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

  constructor(apiKey: string, config: GeminiLiveConfig) {
    this.apiKey = apiKey;
    this.config = config;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async connect() {
    try {
      // Using the new SDK live connection method
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

      this.session.on("setupcomplete", () => {
        console.log("Live Session Ready");
      });

      this.session.on("usercontent", (content: any) => {
        if (content.transcription) {
          this.config.onTranscription?.(content.transcription, true);
        }
      });

      this.session.on("modelcontent", (content: any) => {
        if (content.parts?.[0]?.inlineData?.data) {
          this.config.onAudioData?.(content.parts[0].inlineData.data);
        }
        if (content.transcription) {
          this.config.onTranscription?.(content.transcription, false);
        }
      });

      this.session.on("toolcall", (call: any) => {
        this.config.onToolCall?.(call.functionCalls);
      });

      this.session.on("error", (err: any) => {
        this.config.onError?.(err);
      });

      this.session.on("close", () => {
        this.config.onClose?.();
      });

    } catch (err) {
      console.error("Connection failed:", err);
      throw err;
    }
  }

  sendAudio(base64Data: string) {
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
    this.session?.close();
  }
}
