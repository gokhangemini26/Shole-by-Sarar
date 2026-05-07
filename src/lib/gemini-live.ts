import { GoogleGenAI } from "@google/genai";

export interface FunctionCall {
  id: string;
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
      const tools = [
        {
          functionDeclarations: [
            {
              name: "sayfa_degistir",
              description: "Kullanıcıyı belirli bir ürün kategorisine veya sayfaya yönlendirir.",
              parameters: {
                type: "OBJECT",
                properties: { url_slug: { type: "STRING" } },
                required: ["url_slug"]
              }
            },
            {
              name: "urun_detayi_goster",
              description: "Ürün kartını ekranda açar.",
              parameters: {
                type: "OBJECT",
                properties: { urun_id: { type: "STRING" } },
                required: ["urun_id"]
              }
            },
            {
              name: "kombin_oner",
              description: "Uygun aksesuarları listeler.",
              parameters: {
                type: "OBJECT",
                properties: { urun_id: { type: "STRING" } },
                required: ["urun_id"]
              }
            }
          ]
        }
      ];

      // Fix Deprecation: Move generationConfig fields to top-level
      // Fix Connection: Using the latest supported live model name
      this.session = await this.ai.live.connect({
        model: "gemini-2.0-flash-exp",
        systemInstruction: {
          role: "system",
          parts: [{ text: this.config.systemInstruction || "" }]
        },
        tools: tools,
        generationConfig: {
          responseModalities: ["audio"]
        }
      });

      console.log("[SHOLÉ] Live Session connected:", this.session);
      this.listenToMessages();
    } catch (err) {
      console.error("[SHOLÉ] Connection failed:", err);
      throw err;
    }
  }

  private async listenToMessages() {
    try {
      // In some SDK versions, the iterator is the session itself, 
      // in others it is session.receive()
      const source = (typeof this.session.receive === 'function') ? this.session : this.session;

      if (this.session[Symbol.asyncIterator] || (this.session.receive && typeof this.session.receive === 'function')) {
         // Pattern A: for await on session
         if (this.session[Symbol.asyncIterator]) {
            for await (const message of this.session) {
              if (this.isClosing) break;
              this.handleMessage(message);
            }
         } else {
            // Pattern B: while await receive
            while (!this.isClosing) {
              const message = await this.session.receive();
              if (!message) break;
              this.handleMessage(message);
            }
         }
      } else {
        console.error("[SHOLÉ] Session is not iterable and has no receive method", this.session);
      }
    } catch (err: any) {
      if (!this.isClosing) {
        console.error("[SHOLÉ] Message loop error:", err);
        this.config.onError?.(err);
      }
    } finally {
      this.config.onClose?.();
    }
  }

  private handleMessage(message: any) {
    // Model Output
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

    // User Transcription
    if (message.serverContent?.transcription) {
      this.config.onTranscription?.(message.serverContent.transcription, true);
    }

    // Tool Calls
    if (message.serverContent?.modelTurn?.parts) {
      const calls = message.serverContent.modelTurn.parts
        .filter((p: any) => p.functionCall)
        .map((p: any) => p.functionCall);
      
      if (calls.length > 0) {
        this.config.onToolCall?.(calls);
      }
    }
  }

  sendAudio(base64Data: string) {
    if (this.isClosing || !this.session) return;
    
    // Ensure we are using the correct send method
    const sendFn = this.session.send || this.session.sendAudio;
    if (typeof sendFn === 'function') {
      this.session.send({
        realtimeInput: {
          mediaChunks: [{
            mimeType: "audio/pcm",
            data: base64Data
          }]
        }
      });
    } else {
      console.warn("[SHOLÉ] Session has no send method");
    }
  }

  sendToolResponse(responses: any[]) {
    if (this.isClosing || !this.session) return;
    if (typeof this.session.send === 'function') {
      this.session.send({
        toolResponse: {
          functionResponses: responses.map(r => ({
            id: r.id,
            name: r.name,
            response: r.response
          }))
        }
      });
    }
  }

  close() {
    this.isClosing = true;
    try {
      this.session?.close();
    } catch (e) {}
  }
}
