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
  private ws: WebSocket | null = null;
  private apiKey: string;
  private config: GeminiLiveConfig;

  constructor(apiKey: string, config: GeminiLiveConfig) {
    this.apiKey = apiKey;
    this.config = config;
  }

  async connect() {
    return new Promise<void>((resolve, reject) => {
      try {
        const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log("[SHOLÉ] WebSocket Connected");
          this.sendSetupMessage();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (err) => {
          console.error("[SHOLÉ] WebSocket Error:", err);
          this.config.onError?.(err);
          reject(err);
        };

        this.ws.onclose = () => {
          console.log("[SHOLÉ] WebSocket Closed");
          this.config.onClose?.();
        };

      } catch (err) {
        reject(err);
      }
    });
  }

  private sendSetupMessage() {
    const setup = {
      setup: {
        model: "models/gemini-2.0-flash-exp",
        generation_config: {
          response_modalities: ["AUDIO"],
          speech_config: {
            voice_config: {
              prebuilt_voice_config: {
                voice_name: "Aoide"
              }
            }
          }
        },
        system_instruction: {
          role: "system",
          parts: [{ text: this.config.systemInstruction || "" }]
        },
        tools: [
          {
            function_declarations: [
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
                description: "Belirli bir ürünün detayını ekranda açar.",
                parameters: {
                  type: "OBJECT",
                  properties: { urun_id: { type: "STRING" } },
                  required: ["urun_id"]
                }
              },
              {
                name: "kombin_oner",
                description: "Ekranda açık olan ürüne uygun kombin önerilerini listeler.",
                parameters: {
                  type: "OBJECT",
                  properties: { urun_id: { type: "STRING" } },
                  required: ["urun_id"]
                }
              }
            ]
          }
        ]
      }
    };
    this.ws?.send(JSON.stringify(setup));
  }

  private async handleMessage(data: any) {
    let msg: any;
    try {
      if (data instanceof Blob) {
        const text = await data.text();
        msg = JSON.parse(text);
      } else {
        msg = JSON.parse(data);
      }
    } catch (e) {
      console.error("[SHOLÉ] Parse error:", e);
      return;
    }

    // Transcription (User/Model)
    if (msg.serverContent?.modelTurn?.parts) {
      for (const part of msg.serverContent.modelTurn.parts) {
        if (part.inlineData?.data) {
          this.config.onAudioData?.(part.inlineData.data);
        }
      }
    }

    // Specific transcription updates
    if (msg.serverContent?.transcription) {
      this.config.onTranscription?.(msg.serverContent.transcription, true);
    }
    
    // Tool Calls (Function Calling)
    if (msg.toolCall?.functionCalls) {
      this.config.onToolCall?.(msg.toolCall.functionCalls);
    }
  }

  sendAudio(base64Data: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = {
        realtime_input: {
          media_chunks: [
            {
              mime_type: "audio/pcm",
              data: base64Data
            }
          ]
        }
      };
      this.ws.send(JSON.stringify(payload));
    }
  }

  sendToolResponse(responses: any[]) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = {
        tool_response: {
          function_responses: responses.map(r => ({
            id: r.id,
            name: r.name,
            response: r.response
          }))
        }
      };
      this.ws.send(JSON.stringify(payload));
    }
  }

  close() {
    this.ws?.close();
  }
}
