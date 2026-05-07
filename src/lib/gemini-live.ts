import { GoogleGenAI } from "@google/genai";

export interface FunctionCall {
  id?: string;
  name: string;
  args: Record<string, unknown>;
}

export interface GeminiLiveConfig {
  systemInstruction?: string;
  onAudioData?: (data: string) => void;
  onTranscription?: (text: string, isUser: boolean) => void;
  onToolCall?: (functionCalls: FunctionCall[]) => void;
  onError?: (error: unknown) => void;
  onClose?: () => void;
}

export class GeminiLiveClient {
  private ai: any;
  private session: any;
  private apiKey: string;
  private config: GeminiLiveConfig;
  private isClosing = false;

  constructor(apiKey: string, config: GeminiLiveConfig) {
    this.apiKey = apiKey;
    this.config = config;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async connect() {
    this.isClosing = false;
    try {
      // Using Gemini 3 Flash Live from your model list
      this.session = await this.ai.live.connect({
        model: "gemini-3-flash-live",
        config: {
          systemInstruction: {
            role: "system",
            parts: [{ text: this.config.systemInstruction || "" }]
          },
          generationConfig: {
            responseModalities: ["audio"]
          }
        }
      });

      // Start listening loop
      this.listenToMessages();

    } catch (err) {
      console.error("Connection failed:", err);
      throw err;
    }
  }

  private async listenToMessages() {
    try {
      while (!this.isClosing) {
        const message = await this.session.receive();
        if (!message || this.isClosing) break;

        if (message.setupComplete) {
          console.log("Live Session Ready");
        }

        if (message.serverContent?.transcription) {
          this.config.onTranscription?.(message.serverContent.transcription, true);
        }

        if (message.serverContent?.modelTurn?.parts) {
          for (const part of message.serverContent.modelTurn.parts) {
            if (part.inlineData?.data) {
              this.config.onAudioData?.(part.inlineData.data);
            }
          }
          if (message.serverContent.modelTurn.transcription) {
            this.config.onTranscription?.(message.serverContent.modelTurn.transcription, false);
          }
        }

        if (message.serverContent?.modelTurn?.parts?.[0]?.functionCall) {
          const calls = message.serverContent.modelTurn.parts
            .filter((p: any) => p.functionCall)
            .map((p: any) => p.functionCall);
          this.config.onToolCall?.(calls);
        }
      }
    } catch (err: any) {
      if (!this.isClosing) {
        console.error("Message loop error:", err);
        this.config.onError?.(err);
      }
    } finally {
      this.config.onClose?.();
    }
  }

  sendAudio(base64Data: string) {
    if (this.isClosing) return;
    this.session?.send({
      realtimeInput: {
        mediaChunks: [{
          mimeType: "audio/pcm",
          data: base64Data
        }]
      }
    });
  }

  sendToolResponse(responses: any[]) {
    if (this.isClosing) return;
    this.session?.send({
      toolResponse: {
        functionResponses: responses.map(r => ({
          id: r.id,
          name: r.name,
          response: r.response
        }))
      }
    });
  }

  close() {
    this.isClosing = true;
    this.session?.close();
  }
}
