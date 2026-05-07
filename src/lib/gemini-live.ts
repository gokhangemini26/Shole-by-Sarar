import { GoogleGenAI, Modality } from "@google/genai";
import type { LiveServerMessage, Session } from "@google/genai";

/* ═══════════════════════════════════════════════════════════════════════
   Gemini Live Client — Real-time voice + function calling
   Model: gemini-live-2.5-flash-preview (current GA-track Live model)
   ═══════════════════════════════════════════════════════════════════════ */

export interface GeminiLiveConfig {
  systemInstruction?: string;
  tools?: unknown[];
  onAudioData?: (data: string) => void;
  onTranscription?: (text: string, isUser: boolean) => void;
  onToolCall?: (functionCalls: FunctionCall[]) => void;
  onInterrupted?: () => void;
  onError?: (error: unknown) => void;
  onClose?: () => void;
  onOpen?: () => void;
}

export interface FunctionCall {
  id?: string;
  name: string;
  args: Record<string, unknown>;
}

const LIVE_MODEL = "gemini-live-2.5-flash-preview";

export class GeminiLiveClient {
  private ai: GoogleGenAI;
  private session: Session | null = null;
  private config: GeminiLiveConfig;

  constructor(apiKey: string, config: GeminiLiveConfig) {
    this.ai = new GoogleGenAI({ apiKey });
    this.config = config;
  }

  async connect() {
    console.log("[SHOLÉ Live] Connecting to model:", LIVE_MODEL);
    this.session = await this.ai.live.connect({
      model: LIVE_MODEL,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction:
          this.config.systemInstruction || "You are a helpful assistant.",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: (this.config.tools as any) || [],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        realtimeInputConfig: {
          // Use server-side automatic VAD so the model knows when the user
          // stops speaking and can begin responding.
          automaticActivityDetection: {},
        },
      },
      callbacks: {
        onopen: () => {
          console.log("[SHOLÉ Live] Connected");
          this.config.onOpen?.();
        },
        onmessage: (message: LiveServerMessage) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const msg = message as any;

          if (msg.serverContent?.modelTurn?.parts) {
            for (const part of msg.serverContent.modelTurn.parts) {
              if (part.inlineData?.data) {
                this.config.onAudioData?.(part.inlineData.data);
              }
              if (part.text && part.text.trim()) {
                this.config.onTranscription?.(part.text, false);
              }
            }
          }

          if (msg.serverContent?.interrupted) {
            this.config.onInterrupted?.();
          }

          const outTranscript =
            msg.serverContent?.outputTranscription?.text ||
            msg.serverContent?.outputAudioTranscription?.text;
          if (outTranscript) {
            this.config.onTranscription?.(outTranscript, false);
          }

          const inTranscript =
            msg.serverContent?.inputTranscription?.text ||
            msg.serverContent?.inputAudioTranscription?.text;
          if (inTranscript) {
            this.config.onTranscription?.(inTranscript, true);
          }

          if (msg.toolCall?.functionCalls?.length) {
            console.log("[SHOLÉ Live] Tool Call:", msg.toolCall.functionCalls);
            this.config.onToolCall?.(msg.toolCall.functionCalls);
          }
        },
        onclose: (event?: { code?: number; reason?: string }) => {
          console.log(
            "[SHOLÉ Live] Closed. Code:",
            event?.code,
            "Reason:",
            event?.reason
          );
          this.config.onClose?.();
        },
        onerror: (error: unknown) => {
          console.error("[SHOLÉ Live] Error:", error);
          this.config.onError?.(error);
        },
      },
    });
  }

  sendAudio(base64Data: string) {
    if (!this.session) return;
    this.session.sendRealtimeInput({
      audio: { data: base64Data, mimeType: "audio/pcm;rate=16000" },
    });
  }

  sendVideo(base64Data: string) {
    if (!this.session) return;
    this.session.sendRealtimeInput({
      video: { data: base64Data, mimeType: "image/jpeg" },
    });
  }

  sendText(text: string) {
    if (!this.session) return;
    this.session.sendClientContent({
      turns: [{ role: "user", parts: [{ text }] }],
      turnComplete: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendToolResponse(functionResponses: any[]) {
    if (!this.session) return;
    this.session.sendToolResponse({ functionResponses });
  }

  triggerGreeting(prompt = "Briefly greet the customer and ask how you can help.") {
    if (!this.session) return;
    this.session.sendClientContent({
      turns: [{ role: "user", parts: [{ text: prompt }] }],
      turnComplete: true,
    });
  }

  close() {
    if (this.session) {
      this.session.close();
      this.session = null;
    }
  }
}
