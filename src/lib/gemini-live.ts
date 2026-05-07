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
      // Setup tools as per the user's architectural guide
      const tools = [
        {
          functionDeclarations: [
            {
              name: "sayfa_degistir",
              description: "Kullanıcıyı belirli bir ürün kategorisine veya sayfaya yönlendirir.",
              parameters: {
                type: "OBJECT",
                properties: { url_slug: { type: "STRING", description: "Yönlendirilecek sayfa veya kategori adı" } },
                required: ["url_slug"]
              }
            },
            {
              name: "urun_detayi_goster",
              description: "Kullanıcı belirli bir ürünü sorduğunda ürün kartını veya detayını ekranda açar.",
              parameters: {
                type: "OBJECT",
                properties: { urun_id: { type: "STRING", description: "Gösterilecek ürünün benzersiz ID'si" } },
                required: ["urun_id"]
              }
            },
            {
              name: "kombin_oner",
              description: "Ekranda açık olan ürüne uygun aksesuarları veya kombin parçalarını listeler.",
              parameters: {
                type: "OBJECT",
                properties: { urun_id: { type: "STRING", description: "Kombin yapılacak ana ürünün ID'si" } },
                required: ["urun_id"]
              }
            }
          ]
        }
      ];

      // Using Gemini 3 Flash Live - The best for Bidi as per the user's list
      this.session = await this.ai.live.connect({
        model: "gemini-3-flash-live",
        config: {
          tools,
          systemInstruction: {
            role: "system",
            parts: [{ text: this.config.systemInstruction || "" }]
          },
          generationConfig: {
            responseModalities: ["audio"]
          }
        }
      });

      this.listenToMessages();
    } catch (err) {
      console.error("Connection failed:", err);
      throw err;
    }
  }

  private async listenToMessages() {
    try {
      const messageStream = this.session.messages || this.session.receive || this.session;

      if (typeof messageStream[Symbol.asyncIterator] === 'function') {
        for await (const message of messageStream) {
          if (this.isClosing) break;
          this.handleMessage(message);
        }
      } else {
        // Fallback for non-iterable session
        while (!this.isClosing) {
          const message = await this.session.receive();
          if (!message) break;
          this.handleMessage(message);
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

  private handleMessage(message: any) {
    // Model turn with audio/transcription
    if (message.serverContent?.modelTurn?.parts) {
      for (const part of message.serverContent.modelTurn.parts) {
        if (part.inlineData?.data) {
          this.config.onAudioData?.(part.inlineData.data);
        }
        if (part.text) {
          // Sometimes transcription is in parts.text
          this.config.onTranscription?.(part.text, false);
        }
      }
      if (message.serverContent.modelTurn.transcription) {
        this.config.onTranscription?.(message.serverContent.modelTurn.transcription, false);
      }
    }

    // Transcription (User side)
    if (message.serverContent?.transcription) {
      this.config.onTranscription?.(message.serverContent.transcription, true);
    }

    // TOOL CALLS (The core of website control)
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
