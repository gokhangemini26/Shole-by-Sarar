"use client";

import { MicVAD } from "@ricky0123/vad-web";

/* ═══════════════════════════════════════════════════════════════════════
   Silero VAD-gated microphone capture for Gemini Live.

   Why: server-side VAD alone forwards EVERY mic chunk to the model,
   including background noise, keyboard taps, and the AI's own speaker
   echo. With a client-side Silero check we only send real human-speech
   frames, which:
     • cuts WebSocket bandwidth ~80 % during silence
     • prevents false interruptions from ambient noise
     • makes the AI's barge-in detection cleaner — no echo loop

   How: MicVAD runs the Silero ONNX model on every 32 ms frame. We keep a
   short ring buffer for pre-speech padding (so the first syllable isn't
   clipped) and forward speech frames as Int16 PCM to the supplied
   sender callback. Loud-mic-during-AI-playback is also used for instant
   barge-in interrupt of the AI's audio queue.
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
  preSpeechPadFrames?: number;
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
  const positiveSpeechThreshold = cfg.positiveSpeechThreshold ?? 0.4;
  const negativeSpeechThreshold = cfg.negativeSpeechThreshold ?? 0.25;
  const preSpeechPadFrames = cfg.preSpeechPadFrames ?? 6;

  log(`Silero VAD: loading model from /vad/ + jsdelivr…`);

  const recentFrames: Float32Array[] = [];
  let inSpeech = false;
  let frameCounter = 0;
  let maxProbSeen = 0;

  let vad;
  try {
    vad = await MicVAD.new({
      model: "v5",
      // Let MicVAD own the audioContext + stream. Going through a custom
      // GainNode chain has caused VAD to receive silent input on some
      // platforms — give the library control end-to-end while we debug.
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
        inSpeech = true;
        log(`VAD → speech start (flushing ${recentFrames.length} pre-frames)`);
        cfg.onSpeechStart?.();
        for (const f of recentFrames) {
          cfg.onSpeechFrameB64(f32ToPCM16Base64(f));
        }
      },
      onFrameProcessed: (probs, frame) => {
        cfg.onLevel?.(probs.isSpeech);

        // Visibility into the model: every ~3 s log the highest probability
        // we've seen in the window so the user can tell if audio is even
        // reaching the VAD.
        frameCounter++;
        if (probs.isSpeech > maxProbSeen) maxProbSeen = probs.isSpeech;
        if (frameCounter % 100 === 0) {
          log(
            `VAD heartbeat: 100 frames, peak isSpeech=${maxProbSeen.toFixed(
              2
            )} (threshold ${positiveSpeechThreshold})`
          );
          maxProbSeen = 0;
        }

        if (inSpeech) {
          cfg.onSpeechFrameB64(f32ToPCM16Base64(frame));
        } else {
          recentFrames.push(frame);
          while (recentFrames.length > preSpeechPadFrames) recentFrames.shift();
        }
      },
      onVADMisfire: () => {
        log("VAD misfire (noise blip ignored)");
      },
      onSpeechEnd: () => {
        inSpeech = false;
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
        // ignore — destroy can throw on already-stopped contexts
      }
    },
  };
}
