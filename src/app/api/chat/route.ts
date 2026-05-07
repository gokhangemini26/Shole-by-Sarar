import { GoogleGenAI, Type } from "@google/genai";
import type { Tool } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

/* ─────────────────────────────────────────────────────────────────────
   SHOLÉ AI Stylist — Gemini text route
   POST /api/chat
   Body: { messages: Array<{ role: "user" | "model"; text: string }> }
   Returns: { reply: string, toolCalls?: FunctionCall[] }
   ───────────────────────────────────────────────────────────────────── */

export const runtime = "nodejs";
export const maxDuration = 30;

// Try models in order; fall back if one is unavailable for the project/key.
const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;

const SYSTEM_PROMPT = `You are SHOLÉ (pronounced "sho-LAY"), the AI fashion stylist and SALES ASSISTANT for SHOLÉ by SARAR — a modern Turkish luxury fashion house founded in 1947 in Istanbul.

PERSONALITY: Warm, witty, casually confident. Lowercase casual but sophisticated. Use ✦ and ◇ sparingly. Replies short (1–3 sentences).

═══ TOOL-USE RULES (NON-NEGOTIABLE) ═══
You MUST call a tool whenever the customer's request maps to one. Tools navigate the site for them.

▸ Customer mentions a SPECIFIC product (by name, by description) → CALL show_product(product_id) on the same turn as your verbal reply.
▸ Customer asks to see a CATEGORY ("show me coats", "kadın koleksiyonu", "shoes", "journal") → CALL navigate_category.
▸ Customer asks for an OUTFIT, COMBINATION, "ne giyebilirim", "what should I wear" → CALL recommend_outfit AND show_product for the hero piece.
▸ Customer asks to scroll a homepage area → CALL navigate_to.

If unsure which product, ask ONE quick clarifying question, then act. Don't describe products without showing them.

═══ ACTIVE SALES ═══
- Cross-sell, bundle, urgency, close. Always end with a question or next step.

═══ COLLECTION (Spring/Summer 2026) ═══
1. The Atelier Coat — terra dye wool, €890 — slug: atelier-coat
2. Soft Rules Shirt — cream silk, €340 — slug: soft-rules-shirt
3. Wide Atelier Trouser — sand linen, €420 — slug: wide-atelier-trouser
4. Mule No. 4 — espresso leather, €380 — slug: mule-no-4
5. Sun-Up Knit — saffron merino, €290 — slug: sun-up-knit
6. Atelier Tote — camel leather, €540 — slug: atelier-tote
7. Sun-Up Scarf — saffron silk, €140 — slug: sun-up-scarf
8. Soft Bomber — cream silk, €540 — slug: soft-bomber
9. Atelier Mini — espresso wool, €410 — slug: atelier-mini

Free shipping over €200, worldwide; Made in Istanbul; Sizes XS–XL.

Always reply in the same language the user wrote in. NEVER mention tool/function names.`;

const TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "navigate_to",
        description: "Scrolls the homepage to a specific section.",
        parameters: {
          type: Type.OBJECT,
          properties: { section: { type: Type.STRING } },
          required: ["section"],
        },
      },
      {
        name: "navigate_category",
        description:
          "Take the user to a category page. Use when the customer asks for a category.",
        parameters: {
          type: Type.OBJECT,
          properties: { category: { type: Type.STRING } },
          required: ["category"],
        },
      },
      {
        name: "show_product",
        description:
          "Open the product detail page. Use whenever the customer asks about a specific item.",
        parameters: {
          type: Type.OBJECT,
          properties: { product_id: { type: Type.STRING } },
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

export async function POST(request: NextRequest) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[SHOLÉ API] No GEMINI_API_KEY configured");
      return NextResponse.json(
        { reply: "i'm not fully wired up yet ◇ — the team is on it." },
        { status: 200 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const messages: Array<{ role: string; text: string }> = body.messages || [];

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.text }],
    }));

    let lastErr: unknown = null;
    for (const model of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.85,
            topP: 0.92,
            maxOutputTokens: 512,
            tools: TOOLS,
          },
        });

        const reply =
          response.text ||
          "hmm, i lost my thread there ✦ — could you say that again?";
        const functionCalls = response.functionCalls || [];
        return NextResponse.json({ reply, toolCalls: functionCalls });
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[SHOLÉ API] ${model} failed:`, msg);
        // Retry on next model only for transient/availability errors
        if (
          /404|NOT_FOUND|UNAVAILABLE|model|not found/i.test(msg) === false &&
          /429|RESOURCE_EXHAUSTED/i.test(msg) === false
        ) {
          break;
        }
      }
    }

    const errMsg =
      lastErr instanceof Error ? lastErr.message : String(lastErr ?? "unknown");
    console.error("[SHOLÉ API] All models failed:", errMsg);

    if (/API key|API_KEY_INVALID|PERMISSION_DENIED|UNAUTHENTICATED/i.test(errMsg)) {
      return NextResponse.json(
        { reply: "my voice key needs a refresh ◇ — try me again in a sec." },
        { status: 200 }
      );
    }
    if (/429|RESOURCE_EXHAUSTED/i.test(errMsg)) {
      return NextResponse.json(
        { reply: "i'm getting a lot of love right now ✦ — give me a moment and try again?" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { reply: "something went sideways on my end ◇ — try again in a sec?" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[SHOLÉ API] Unexpected:", msg);
    return NextResponse.json(
      { reply: "something went sideways on my end ◇ — try again in a sec?" },
      { status: 200 }
    );
  }
}
