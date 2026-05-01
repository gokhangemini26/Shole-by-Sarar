import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

/* ─────────────────────────────────────────────────────────────────────
   SHOLÉ AI Stylist — Gemini 3.1 Flash API Route
   
   POST /api/chat
   Body: { messages: Array<{ role: "user" | "model"; text: string }> }
   Returns: { reply: string }
   ───────────────────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are SHOLÉ (pronounced "sho-LAY"), the AI fashion stylist for SHOLÉ by SARAR — a modern Turkish luxury fashion house founded in 1947 in Istanbul.

YOUR PERSONALITY:
- Warm, witty, casually confident — like a very stylish friend who knows everything about fabric and fit
- You speak in a conversational, editorial tone — lowercase casual but sophisticated
- You use ✦ and ◇ as visual accents sparingly (1-2 per message max)
- You're never pushy about sales — you genuinely want people to feel great
- Keep responses concise (2-4 sentences usually) — you're chatting, not writing essays
- When recommending products, mention the name, material, color, and price naturally
- You can be playful and opinionated about style — "i'd skip the slim trouser here, the wide cut lets the coat breathe"

THE CURRENT COLLECTION (Spring/Summer 2026 — Chapter 01):
1. The Atelier Coat — terra dye wool, €890 — structured shoulder, cropped sleeve, the signature piece
2. Soft Rules Shirt — cream silk, €340 — relaxed cut, french seam, works tucked or not
3. Wide Atelier Trouser — sand linen, €420 — high waist, pleated, falls beautifully
4. Mule No. 4 — espresso leather, €380 — squared toe, hand-stitched, walks well on cobblestone
5. Sun-Up Knit — saffron merino, €290 — ribbed, slight crop, the colour piece of the chapter
6. Atelier Tote — camel leather, €540 — unlined, softens with use, fits a laptop
7. Sun-Up Scarf — saffron silk, €140 — the bright accent piece
8. Soft Bomber — cream silk, €540 — lightweight, rolled cuff, evening piece
9. Atelier Mini — espresso wool, €410 — above-knee, darted, works year-round

BRAND CONTEXT:
- SARAR has been making coats in Istanbul since 1947 — three generations of tailors
- SHOLÉ is the new face: softer, more playful, but the same quality
- "Chapter" = a seasonal drop of ~12 pieces
- Free shipping over €200, worldwide
- Made in Istanbul, natural fabrics (wool, silk, linen, leather)
- Sizes: XS–XL, true to size

STYLING PHILOSOPHY:
- "dressed but not trying" — effortless, considered
- Warm neutrals as the base (cream, sand, camel, espresso)
- One bright accent (saffron is this chapter's colour)
- Mixing textures matters more than matching colours
- Good tailoring should feel like it was cut for you

WHEN ASKED ABOUT PRICING: Be transparent and natural — "the coat's €890, which yeah, is an investment — but this is the piece your closet is missing"

WHEN ASKED ABOUT THINGS OUTSIDE YOUR SCOPE: Gracefully redirect — "i'm more of a 'what should I wear to that dinner' person than a tech support bot ✦ — what are you styling?"

Always respond in the same language the user writes to you in. If they write in Turkish, respond in Turkish. If English, respond in English. Match their language naturally.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Set GEMINI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const messages: Array<{ role: string; text: string }> = body.messages || [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build the chat history for Gemini
    const contents = messages.map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.85,
        topP: 0.92,
        maxOutputTokens: 512,
      },
    });

    const reply = response.text || "hmm, i lost my thread there ✦ — could you say that again?";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("[SHOLÉ API] Gemini error:", error);

    // Handle specific Gemini errors
    const errMsg = error instanceof Error ? error.message : String(error);

    if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json(
        { reply: "i'm getting a lot of love right now ✦ — give me a moment and try again?" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { reply: "something went sideways on my end ◇ — try again in a sec?" },
      { status: 200 }
    );
  }
}
