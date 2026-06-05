"use client";

import {
  GoogleGenAI,
  Modality,
  Type,
  ActivityHandling,
  StartSensitivity,
  EndSensitivity,
} from "@google/genai";
import type { LiveServerMessage, Session, Tool } from "@google/genai";
import { getAllSlugs } from "@/lib/products";

const ALL_SLUGS = getAllSlugs();
const CATEGORIES = ["women", "accessories", "shoes", "tailoring", "journal"];
const SECTIONS = ["hero", "collection", "story", "ai-invite", "press", "footer"];

/* ═══════════════════════════════════════════════════════════════════════
   SHOLÉ Gemini Live Client — Real-time voice + function calling
   Model: gemini-live-2.5-flash-preview
   ═══════════════════════════════════════════════════════════════════════ */

export interface FunctionCall {
  id?: string;
  name: string;
  args: Record<string, unknown>;
}

export type LogFn = (entry: string) => void;

export interface GeminiLiveConfig {
  systemInstruction?: string;
  onAudioData?: (data: string) => void;
  onTranscription?: (text: string, isUser: boolean) => void;
  onToolCall?: (calls: FunctionCall[]) => void;
  onInterrupted?: () => void;
  onTurnComplete?: () => void;
  onOpen?: () => void;
  onError?: (err: unknown) => void;
  onClose?: () => void;
  onLog?: LogFn;
}

// Pinned to gemini-3.1-flash-live-preview per product decision: cascaded TTS
// is the most fluid option for conversational shopping and supports proper
// barge-in / interruption.
const LIVE_MODEL_CANDIDATES = ["gemini-3.1-flash-live-preview"] as const;

const DEFAULT_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "navigate_to",
        description: "Scrolls the homepage to a specific section.",
        parameters: {
          type: Type.OBJECT,
          properties: { section: { type: Type.STRING, enum: SECTIONS } },
          required: ["section"],
        },
      },
      {
        name: "navigate_category",
        description: "Take the user to a category page.",
        parameters: {
          type: Type.OBJECT,
          properties: { category: { type: Type.STRING, enum: CATEGORIES } },
          required: ["category"],
        },
      },
      {
        name: "show_product",
        description:
          "Open the product detail page. ONLY use product_ids from the catalog — never invent a slug.",
        parameters: {
          type: Type.OBJECT,
          properties: { product_id: { type: Type.STRING, enum: ALL_SLUGS } },
          required: ["product_id"],
        },
      },
      {
        name: "recommend_outfit",
        description: "Suggest a complete outfit (comma-separated product names).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            items: { type: Type.STRING },
            occasion: { type: Type.STRING },
          },
          required: ["items"],
        },
      },
    ],
  },
];

export class GeminiLiveClient {
  private ai: GoogleGenAI;
  private session: Session | null = null;
  private config: GeminiLiveConfig;
  private log: LogFn;

  constructor(apiKey: string, config: GeminiLiveConfig) {
    this.ai = new GoogleGenAI({ apiKey });
    this.config = config;
    this.log = (entry) => {
      console.log(`[SHOLÉ Live] ${entry}`);
      config.onLog?.(entry);
    };
  }

  async connect() {
    let lastErr: unknown = null;
    for (const model of LIVE_MODEL_CANDIDATES) {
      try {
        this.log(`connect → model=${model}`);
        this.session = await this.tryConnect(model);
        this.log(`connect resolved (model=${model})`);
        return;
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        this.log(`model ${model} failed: ${msg.slice(0, 160)}`);
        // Only continue if it's a 404/access error; throw other errors immediately.
        if (
          !/404|NOT_FOUND|PERMISSION_DENIED|UNAVAILABLE|not found|not\s+available/i.test(
            msg
          )
        ) {
          throw err;
        }
      }
    }
    throw lastErr instanceof Error
      ? lastErr
      : new Error(String(lastErr ?? "no live model accessible"));
  }

  private async tryConnect(model: string): Promise<Session> {
    return await this.ai.live.connect({
      model,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
        },
        systemInstruction:
          this.config.systemInstruction || "You are a helpful assistant.",
        tools: DEFAULT_TOOLS,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        realtimeInputConfig: {
          // Half-duplex: never let detected activity interrupt the model
          // mid-turn. The client already mutes the mic (sends silence) while
          // the AI speaks, but this is the server-side guarantee that the
          // bot's own speaker echo can't cut its reply short. The user takes
          // their turn after playback finishes.
          activityHandling: ActivityHandling.NO_INTERRUPTION,
          automaticActivityDetection: {
            // LOW sensitivity avoids echo-triggered false barge-ins
            // while still catching intentional interruptions reliably.
            startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
            endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
            // Require 300ms of sustained speech before triggering a
            // barge-in. Speaker echo of the bot's own voice arrives in short
            // bursts; demanding 300ms of continuous input filters it out
            // while still catching a genuine user interruption.
            prefixPaddingMs: 300,
            // Wait 800ms of silence before ending the user's turn — gives
            // natural breathing room for mid-sentence pauses.
            silenceDurationMs: 800,
          },
        },
      },
      callbacks: {
        onopen: () => {
          this.log("WS opened");
          this.config.onOpen?.();
        },
        onmessage: (message: LiveServerMessage) => {
          this.handleMessage(message);
        },
        onclose: (ev?: { code?: number; reason?: string }) => {
          this.log(`WS closed code=${ev?.code} reason=${ev?.reason || ""}`);
          this.config.onClose?.();
        },
        onerror: (err: unknown) => {
          const msg = err instanceof Error ? err.message : String(err);
          this.log(`WS error: ${msg}`);
          this.config.onError?.(err);
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleMessage(message: any) {
    if (message?.setupComplete) {
      this.log("← setupComplete");
    }

    const parts = message?.serverContent?.modelTurn?.parts;
    if (parts?.length) {
      let audioBytes = 0;
      for (const part of parts) {
        if (part.inlineData?.data) {
          audioBytes += part.inlineData.data.length;
          this.config.onAudioData?.(part.inlineData.data);
        }
        if (part.text && part.text.trim()) {
          this.config.onTranscription?.(part.text, false);
        }
      }
      if (audioBytes) this.log(`← audio chunk (${audioBytes}b base64)`);
    }

    if (message?.serverContent?.interrupted) {
      this.log("← interrupted");
      this.config.onInterrupted?.();
    }

    const outT =
      message?.serverContent?.outputTranscription?.text ||
      message?.serverContent?.outputAudioTranscription?.text;
    if (outT) {
      this.log(`← bot transcript: "${outT.slice(0, 60)}"`);
      this.config.onTranscription?.(outT, false);
    }

    const inT =
      message?.serverContent?.inputTranscription?.text ||
      message?.serverContent?.inputAudioTranscription?.text;
    if (inT) {
      this.log(`← user transcript: "${inT.slice(0, 60)}"`);
      this.config.onTranscription?.(inT, true);
    }

    if (message?.toolCall?.functionCalls?.length) {
      this.log(`← tool_call: ${message.toolCall.functionCalls.map((c: FunctionCall) => c.name).join(",")}`);
      this.config.onToolCall?.(message.toolCall.functionCalls);
    }

    if (message?.serverContent?.turnComplete) {
      this.log("← turnComplete");
      this.config.onTurnComplete?.();
    }
  }

  sendAudio(b64: string) {
    if (!this.session) return;
    this.session.sendRealtimeInput({
      audio: { data: b64, mimeType: "audio/pcm;rate=16000" },
    });
  }

  sendVideo(b64: string) {
    if (!this.session) return;
    this.session.sendRealtimeInput({
      video: { data: b64, mimeType: "image/jpeg" },
    });
  }

  sendText(text: string) {
    if (!this.session) return;
    this.log(`→ sendText: "${text.slice(0, 60)}"`);
    this.session.sendClientContent({
      turns: [{ role: "user", parts: [{ text }] }],
      turnComplete: true,
    });
  }

  triggerGreeting(prompt = "Briefly greet the customer and ask how you can help.") {
    if (!this.session) return;
    this.log("→ triggerGreeting");
    this.session.sendClientContent({
      turns: [{ role: "user", parts: [{ text: prompt }] }],
      turnComplete: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendToolResponse(functionResponses: any[]) {
    if (!this.session) return;
    this.log(`→ sendToolResponse (${functionResponses.length})`);
    this.session.sendToolResponse({ functionResponses });
  }

  close() {
    if (this.session) {
      this.log("close()");
      this.session.close();
      this.session = null;
    }
  }
}
