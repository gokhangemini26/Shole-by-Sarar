import { GoogleGenAI, Modality } from "@google/genai";
import type { LiveServerMessage } from "@google/genai";

/* ═══════════════════════════════════════════════════════════════════════
   Gemini Live Client — Real-time voice + function calling
   Adapted from Merit-Web-With-AI for SHOLÉ by SARAR
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
}

export interface FunctionCall {
  id?: string;
  name: string;
  args: Record<string, string>;
}

export class GeminiLiveClient {
  private ai: GoogleGenAI;
  private session: ReturnType<typeof Object.create> | null = null;
  private config: GeminiLiveConfig;

  constructor(apiKey: string, config: GeminiLiveConfig) {
    this.ai = new GoogleGenAI({ apiKey });
    this.config = config;
  }

  async connect() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.session = await (this.ai as any).live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction:
          this.config.systemInstruction || "You are a helpful assistant.",
        tools: this.config.tools || [],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onopen: () => {
          console.log("[SHOLÉ Live] Connected");
        },
        onmessage: async (message: LiveServerMessage) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const msg = message as any;

          // 1. Audio data from model turn parts
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

          // 2. Interruption signal
          if (msg.serverContent?.interrupted) {
            this.config.onInterrupted?.();
          }

          // 3. Output audio transcription (bot speech → text)
          const outTranscript =
            msg.serverContent?.outputAudioTranscription?.text ||
            msg.outputAudioTranscription?.text ||
            msg.serverContent?.outputTranscription?.text;
          if (outTranscript) {
            this.config.onTranscription?.(outTranscript, false);
          }

          // 4. Input audio transcription (user speech → text)
          const inTranscript =
            msg.serverContent?.inputAudioTranscription?.text ||
            msg.inputAudioTranscription?.text ||
            msg.serverContent?.inputTranscription?.text;
          if (inTranscript) {
            this.config.onTranscription?.(inTranscript, true);
          }

          // 5. Tool Calls (Function Calling)
          if (
            msg.toolCall ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            msg.serverContent?.modelTurn?.parts?.some((p: any) => p.functionCall)
          ) {
            const calls =
              msg.toolCall?.functionCalls ||
              msg.serverContent?.modelTurn?.parts
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ?.filter((p: any) => p.functionCall)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((p: any) => p.functionCall);
            if (calls && calls.length > 0) {
              console.log("[SHOLÉ Live] Tool Call:", calls);
              this.config.onToolCall?.(calls);
            }
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
    if (this.session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.session as any).sendRealtimeInput({
        audio: { data: base64Data, mimeType: "audio/pcm;rate=16000" },
      });
    }
  }

  sendVideo(base64Data: string) {
    if (this.session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.session as any).sendRealtimeInput({
        video: { data: base64Data, mimeType: "image/jpeg" },
      });
    }
  }

  sendText(text: string) {
    if (this.session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.session as any).sendRealtimeInput({ text });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendToolResponse(functionResponses: any[]) {
    if (this.session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.session as any).sendToolResponse({ functionResponses });
    }
  }

  triggerGreeting() {
    if (this.session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.session as any).sendRealtimeInput({ text: "Başla" });
    }
  }

  close() {
    if (this.session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.session as any).close();
      this.session = null;
    }
  }
}
