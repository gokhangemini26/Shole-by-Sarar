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
  const positiveSpeechThreshold = cfg.positiveSpeechThreshold ?? 0.5;
  const negativeSpeechThreshold = cfg.negativeSpeechThreshold ?? 0.35;
  const preSpeechPadFrames = cfg.preSpeechPadFrames ?? 6; // ~192 ms of pre-speech context

  log(`Silero VAD: loading model…`);

  const recentFrames: Float32Array[] = [];
  let inSpeech = false;

  const vad = await MicVAD.new({
    model: "v5",
    audioContext: cfg.audioContext,
    getStream: async () => cfg.stream,
    // VAD model + worklet are served from /public/vad on this origin.
    // ONNX runtime WASM is pulled from jsdelivr (large files, well-cached
    // by the CDN — committing them to the repo would balloon it by 90 MB).
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
      // Flush the ring buffer so Gemini doesn't lose the first syllable.
      for (const f of recentFrames) {
        cfg.onSpeechFrameB64(f32ToPCM16Base64(f));
      }
    },
    onFrameProcessed: (probs, frame) => {
      cfg.onLevel?.(probs.isSpeech);

      if (inSpeech) {
        cfg.onSpeechFrameB64(f32ToPCM16Base64(frame));
      } else {
        // Maintain a rolling buffer of the most recent frames so we have
        // pre-speech context the moment VAD declares speech started.
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
    // Required by the type but we never let MicVAD pause the stream — we
    // own its lifecycle.
    pauseStream: async () => {},
    resumeStream: async () => cfg.stream,
    startOnLoad: false,
    processorType: "auto",
  });

  await vad.start();
  log("Silero VAD: running");

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
