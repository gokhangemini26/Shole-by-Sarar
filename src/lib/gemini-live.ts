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
      this.session = await this.ai.live.connect({
        model: "gemini-2.0-flash-exp",
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

      // Handle messages using the async iterator pattern (new SDK style)
      this.listenToMessages();

    } catch (err) {
      console.error("Connection failed:", err);
      throw err;
    }
  }

  private async listenToMessages() {
    try {
      for await (const message of this.session) {
        if (this.isClosing) break;

        // Setup complete
        if (message.setupComplete) {
          console.log("Live Session Ready");
        }

        // Transcription (User)
        if (message.serverContent?.transcription) {
          this.config.onTranscription?.(message.serverContent.transcription, true);
        }

        // Model Output (Audio / Transcription)
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

        // Tool Calls
        if (message.serverContent?.modelTurn?.parts?.[0]?.functionCall) {
          // Wrap in array for compatibility with our existing handler
          const calls = message.serverContent.modelTurn.parts
            .filter((p: any) => p.functionCall)
            .map((p: any) => p.functionCall);
          this.config.onToolCall?.(calls);
        }
      }
    } catch (err) {
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
