"use client";

import { MicVAD } from "@ricky0123/vad-web";

/* ═══════════════════════════════════════════════════════════════════════
   Silero VAD-assisted microphone for Gemini Live.

   Architecture (revised):
     • Stream EVERY mic frame to Gemini once warm-up has passed. The
       server-side automatic VAD that comes with the live session
       (silenceDurationMs etc.) needs continuous audio — it uses the
       silent stretches to decide when the user's turn is done. Earlier
       we gated the stream client-side and only forwarded frames where
       Silero saw speech; that turned out to corrupt the server's
       silence detection so it never produced follow-up replies.
     • Silero is now used for two narrow jobs:
         1. Local barge-in: onSpeechStart fires the interrupt that
            clears the local AI audio queue (zero round-trip).
         2. Echo gate: while the AI is playing, suppress mic frames
            whose isSpeech probability falls below `aiPlaybackThreshold`.
            That blocks the speaker echo from looping back into Gemini
            without blocking real user barge-in (which scores high).
     • A 1.2 s warm-up at the start drops opening-mic transients so
       they can't accidentally interrupt the very first model turn.
   ═══════════════════════════════════════════════════════════════════════ */

export interface VADMicConfig {
  stream: MediaStream;
  audioContext: AudioContext;
  onSpeechFrameB64: (b64: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onLevel?: (level: number) => void;
  onLog?: (entry: string) => void;
  positiveSpeechThreshold?: number;
  negativeSpeechThreshold?: number;
  /** Returns true while the AI is playing audio. Forces a stricter VAD
   *  threshold so echo doesn't get routed back to Gemini as user input. */
  isAISpeaking?: () => boolean;
  /** When AI is speaking, only frames whose isSpeech ≥ this threshold are
   *  forwarded. Default 0.92. */
  aiPlaybackThreshold?: number;
  /** While the AI is speaking, a real user barge-in must also clear this
   *  RMS energy floor (0..1, full-scale). Silero's isSpeech can't separate
   *  the bot's own (quiet, ducked) speaker echo from the user's (loud,
   *  close-mic) voice — both are "speech" — so we additionally require the
   *  frame to be loud. Default 0.02. Raise it if the bot still cuts itself
   *  off; lower it if genuine barge-in is too hard. Check the VAD heartbeat
   *  log (peakRms) to tune. */
  aiPlaybackRmsThreshold?: number;
}

export interface VADMicHandle {
  destroy: () => Promise<void>;
}

function f32ToPCM16Base64(f32: Float32Array): string {
  const pcm = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    pcm[i] = s * 0x7fff;
  }
  const u8 = new Uint8Array(pcm.buffer);
  let bin = "";
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
  return btoa(bin);
}

export async function startVADMic(
  cfg: VADMicConfig
): Promise<VADMicHandle> {
  const log = cfg.onLog ?? (() => {});
  const positiveSpeechThreshold = cfg.positiveSpeechThreshold ?? 0.7;
  const negativeSpeechThreshold = cfg.negativeSpeechThreshold ?? 0.4;
  // Tighter than positive threshold — only confidently human voice should
  // bypass the echo gate while AI is talking.
  const aiPlaybackThreshold = cfg.aiPlaybackThreshold ?? 0.95;
  // Energy floor a real barge-in must clear while the AI is speaking.
  const aiPlaybackRmsThreshold = cfg.aiPlaybackRmsThreshold ?? 0.02;
  // Require N consecutive high-confidence frames during AI playback before
  // we trust it's a real barge-in. Single-frame spikes are usually echo.
  const aiPlaybackConsecutiveFrames = 6; // 180ms of continuous human speech

  log(`Silero VAD: loading model from /vad/ + jsdelivr…`);

  const startedAt = Date.now();
  const WARMUP_MS = 1200;
  let warmupAnnounced = false;
  let frameCounter = 0;
  let maxProbSeen = 0;
  let maxRmsDuringPlayback = 0;
  let droppedDuringPlayback = 0;
  let sentFrames = 0;
  let consecutiveHighProbFrames = 0;
  let realBargeInActive = false;

  let vad;
  try {
    vad = await MicVAD.new({
      model: "v5",
      getStream: async () => cfg.stream,
      baseAssetPath: "/vad/",
      onnxWASMBasePath:
        "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.25.1/dist/",
      positiveSpeechThreshold,
      negativeSpeechThreshold,
      redemptionMs: 800,
      preSpeechPadMs: 200,
      minSpeechMs: 200,
      onSpeechStart: () => {
        // Warm-up: ignore startup mic transients.
        if (Date.now() - startedAt < WARMUP_MS) {
          log("VAD speech start IGNORED (warm-up)");
          return;
        }
        // During AI playback, only honour onSpeechStart if we already have
        // N consecutive frames above aiPlaybackThreshold. Single-frame
        // spikes (echo) shouldn't kill the AI's reply mid-sentence.
        const aiTalking = cfg.isAISpeaking?.() ?? false;
        if (aiTalking && !realBargeInActive) {
          log("VAD speech start IGNORED (echo guard, awaiting confirmation)");
          return;
        }
        log("VAD → speech start (barge-in signal)");
        cfg.onSpeechStart?.();
      },
      onFrameProcessed: (probs, frame) => {
        cfg.onLevel?.(probs.isSpeech);

        // RMS energy of this frame (0..1 full-scale). This is the "dB level"
        // discriminator: the bot's ducked speaker echo is quiet, the user's
        // close-mic voice is loud, even though Silero scores both as speech.
        let sumSq = 0;
        for (let i = 0; i < frame.length; i++) sumSq += frame[i] * frame[i];
        const rms = Math.sqrt(sumSq / frame.length);

        frameCounter++;
        if (probs.isSpeech > maxProbSeen) maxProbSeen = probs.isSpeech;
        if (rms > maxRmsDuringPlayback) maxRmsDuringPlayback = rms;
        if (frameCounter % 100 === 0) {
          log(
            `VAD heartbeat: 100f, peak isSpeech=${maxProbSeen.toFixed(2)} ` +
              `peakRms=${maxRmsDuringPlayback.toFixed(3)} ` +
              `(thr ${positiveSpeechThreshold}/${aiPlaybackThreshold}/rms${aiPlaybackRmsThreshold}) ` +
              `sent=${sentFrames} mutedEcho=${droppedDuringPlayback}`
          );
          maxProbSeen = 0;
          maxRmsDuringPlayback = 0;
          sentFrames = 0;
          droppedDuringPlayback = 0;
        }

        if (!warmupAnnounced && Date.now() - startedAt >= WARMUP_MS) {
          warmupAnnounced = true;
          log("VAD warm-up complete — streaming to Gemini");
        }

        // Hold the stream silent during warm-up so Gemini doesn't get
        // garbage from the mic auto-gain ramp.
        if (Date.now() - startedAt < WARMUP_MS) return;

        const aiTalking = cfg.isAISpeaking?.() ?? false;

        // Track confirmed real barge-in: N consecutive frames that are BOTH
        // speech-like AND loud enough to clear the echo floor means the user
        // is genuinely talking over the AI. The RMS gate is what rejects the
        // bot's own echo (which Silero alone scores as confident speech).
        if (aiTalking) {
          if (
            probs.isSpeech >= aiPlaybackThreshold &&
            rms >= aiPlaybackRmsThreshold
          ) {
            consecutiveHighProbFrames++;
            if (
              consecutiveHighProbFrames >= aiPlaybackConsecutiveFrames &&
              !realBargeInActive
            ) {
              realBargeInActive = true;
              log(
                `VAD real barge-in confirmed (${consecutiveHighProbFrames} frames, rms=${rms.toFixed(3)})`
              );
              cfg.onSpeechStart?.();
            }
          } else {
            consecutiveHighProbFrames = 0;
          }
        } else {
          consecutiveHighProbFrames = 0;
          realBargeInActive = false;
        }

        if (aiTalking && !realBargeInActive) {
          // AI is speaking and no real (loud) user barge-in is confirmed:
          // forward a SILENT frame instead of the live mic so the bot's
          // speaker echo can never loop back into Gemini and trigger a false
          // interruption — while still keeping the stream continuous so the
          // server's silence/turn detector stays aligned. This is the
          // half-duplex "lower mic sensitivity while AI talks" behaviour.
          droppedDuringPlayback++;
          const silent = new Float32Array(frame.length);
          cfg.onSpeechFrameB64(f32ToPCM16Base64(silent));
          return;
        }

        cfg.onSpeechFrameB64(f32ToPCM16Base64(frame));
        sentFrames++;
      },
      onVADMisfire: () => {
        log("VAD misfire (noise blip ignored)");
      },
      onSpeechEnd: () => {
        log("VAD → speech end");
        cfg.onSpeechEnd?.();
      },
      pauseStream: async () => {},
      resumeStream: async () => cfg.stream,
      startOnLoad: false,
      processorType: "auto",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`Silero VAD INIT FAILED: ${msg}`);
    throw err;
  }

  log("Silero VAD: starting…");
  try {
    await vad.start();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`Silero VAD START FAILED: ${msg}`);
    throw err;
  }
  log("Silero VAD: running ✓");

  return {
    destroy: async () => {
      try {
        await vad.destroy();
      } catch {
        // ignore
      }
    },
  };
}
