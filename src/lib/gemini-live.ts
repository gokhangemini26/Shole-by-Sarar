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
      // Reverting to gemini-2.0-flash-exp for Live API as it is the most stable for bidi
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

      this.listenToMessages();
    } catch (err) {
      console.error("Connection failed:", err);
      throw err;
    }
  }

  private async listenToMessages() {
    try {
      // Trying the most compatible stream reading pattern for @google/genai
      // We check multiple possible ways to iterate over messages
      const messageStream = this.session.messages || this.session.receive || this.session;

      if (typeof messageStream[Symbol.asyncIterator] === 'function') {
        for await (const message of messageStream) {
          if (this.isClosing) break;
          this.handleMessage(message);
        }
      } else if (typeof this.session.receive === 'function') {
        while (!this.isClosing) {
          const message = await this.session.receive();
          if (!message) break;
          this.handleMessage(message);
        }
      } else {
        throw new Error("Could not find a way to read messages from the session object.");
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
