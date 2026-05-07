import { GoogleGenAI, Modality } from "@google/genai";
import type { LiveServerMessage, Session } from "@google/genai";

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

// We use 2.0-flash-exp because 3.1 does not support the Bidi Live API yet.
const LIVE_MODEL = "gemini-2.0-flash-exp";

export const SHOPPING_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "search_products",
        description: "To find items based on a query, category, or price range.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search term like 'linen shirt'" },
            category: { type: "string", enum: ["shirts", "trousers", "dresses", "accessories", "shoes"], description: "Product category" },
            price_range: { type: "number", description: "Maximum price the user is willing to pay" }
          }
        }
      },
      {
        name: "get_product_details",
        description: "To fetch specs and stock status of a specific product.",
        parameters: {
          type: "object",
          properties: {
            product_id: { type: "string", description: "The ID of the product" }
          },
          required: ["product_id"]
        }
      },
      {
        name: "navigate_to_product_page",
        description: "To programmatically change the route/view for the user to a specific product.",
        parameters: {
          type: "object",
          properties: {
            product_id: { type: "string", description: "The ID of the product to navigate to" }
          },
          required: ["product_id"]
        }
      },
      {
        name: "add_to_cart",
        description: "To perform actions based on voice commands to add an item to the cart.",
        parameters: {
          type: "object",
          properties: {
            product_id: { type: "string", description: "The ID of the product to add" }
          },
          required: ["product_id"]
        }
      },
      {
        name: "suggest_style_combo",
        description: "To trigger a logic that finds matching accessories or clothing items for a base product.",
        parameters: {
          type: "object",
          properties: {
            base_product_id: { type: "string", description: "The ID of the product the user is currently looking at or interested in" }
          },
          required: ["base_product_id"]
        }
      }
    ]
  }
];

export const SYSTEM_INSTRUCTION = `You are an expert personal shopper: sophisticated, helpful, and proactive.
You live on an e-commerce site. 
Instead of just answering, you should proactively use your tools. For example, if you suggest a matching item, say: 'Since you're looking at that linen shirt, I've just opened the matching trousers page for you. They’d look great together!' and IMMEDIATELY call navigate_to_product_page.
Use your tools heavily. If a user asks for a linen shirt, call search_products.
If they ask for details, call get_product_details.
If they say "I'll take it" or "buy this", call add_to_cart.
Keep your responses very short, conversational, and natural.`;

export class GeminiLiveClient {
  private ai: GoogleGenAI;
  private session: Session | null = null;
  private config: GeminiLiveConfig;

  constructor(apiKey: string, config: GeminiLiveConfig) {
    this.ai = new GoogleGenAI({ apiKey });
    this.config = config;
  }

  async connect() {
    console.log("[Shopping Assistant] Connecting to model:", LIVE_MODEL);
    this.session = await this.ai.live.connect({
      model: LIVE_MODEL,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }, // Sophisticated voice
        },
        systemInstruction: this.config.systemInstruction || SYSTEM_INSTRUCTION,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: (this.config.tools as any) || SHOPPING_TOOLS,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        realtimeInputConfig: {
          automaticActivityDetection: {},
        },
      },
      callbacks: {
        onopen: () => {
          console.log("[Shopping Assistant] Connected");
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

          const outTranscript = msg.serverContent?.outputTranscription?.text || msg.serverContent?.outputAudioTranscription?.text;
          if (outTranscript) {
            this.config.onTranscription?.(outTranscript, false);
          }

          const inTranscript = msg.serverContent?.inputTranscription?.text || msg.serverContent?.inputAudioTranscription?.text;
          if (inTranscript) {
            this.config.onTranscription?.(inTranscript, true);
          }

          if (msg.toolCall?.functionCalls?.length) {
            console.log("[Shopping Assistant] Tool Call:", msg.toolCall.functionCalls);
            this.config.onToolCall?.(msg.toolCall.functionCalls);
          }
        },
        onclose: (event?: { code?: number; reason?: string }) => {
          console.log("[Shopping Assistant] Closed. Code:", event?.code, "Reason:", event?.reason);
          this.config.onClose?.();
        },
        onerror: (error: unknown) => {
          console.error("[Shopping Assistant] Error:", error);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendToolResponse(functionResponses: any[]) {
    if (!this.session) return;
    this.session.sendToolResponse({ functionResponses });
  }

  triggerGreeting() {
    if (!this.session) return;
    this.session.sendClientContent({
      turns: [{ role: "user", parts: [{ text: "Hello! Please introduce yourself briefly as my personal shopper." }] }],
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
