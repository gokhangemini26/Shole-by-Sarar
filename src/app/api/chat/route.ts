import { GoogleGenAI, Type } from "@google/genai";
import type { Tool } from "@google/genai";
import { NextResponse } from "next/server";
import { PRODUCTS, getAllSlugs } from "@/lib/products";

const ALL_SLUGS = getAllSlugs();
const CATEGORIES = ["women", "accessories", "shoes", "tailoring", "journal"];
const SECTIONS = ["hero", "collection", "story", "ai-invite", "press", "footer"];

export const runtime = "nodejs";
export const maxDuration = 30;

/* ─────────────────────────────────────────────────────────────────────
   SHOLÉ AI Stylist — Streaming text route
   POST /api/chat → application/x-ndjson
   Each line is JSON: { text?: string } | { tool?: {name, args} } | { error?: string } | { done: true }
   ───────────────────────────────────────────────────────────────────── */

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;

function buildSystemPrompt() {
  const productList = PRODUCTS.map(
    (p, i) =>
      `${i + 1}. ${p.name} (${p.category}) — ${p.subtitle}, ${p.price}. sizes: [${p.sizes.join(", ")}]. slug: '${p.slug}'`
  ).join("\n");

  return `You are SHOLÉ (sho-LAY), the AI fashion stylist and SALES ASSISTANT for SHOLÉ — a digital-first autonomous fashion house, Istanbul, est. 2026. We combine computational design, digital-twin sizing, and generative styling.

PERSONALITY: Warm, witty, casually confident. Conversational, lowercase casual but sophisticated. Use ✦ and ◇ sparingly. Replies short (1–3 sentences).

═══ TOOL-USE RULES (NON-NEGOTIABLE) ═══
You MUST call a tool whenever the customer's request maps to one. Tools navigate the site for them.

▸ Customer mentions a SPECIFIC product (by name or description) → CALL show_product(product_id) on the SAME turn as your verbal reply.
▸ Customer asks to see a CATEGORY ("show me coats", "kadın koleksiyonu", "shoes", "journal") → CALL navigate_category.
▸ Customer asks for an OUTFIT, COMBINATION, "ne giyebilirim", "what should I wear" → CALL recommend_outfit AND show_product for the hero piece.
▸ Customer wants to ADD an item to the cart/bag ("sepete ekle", "add this") → CALL add_to_cart with the slug (and size if given).
▸ Customer wants to see their cart, checkout, or complete/finalize shopping → CALL open_cart.
▸ Customer wants to close the cart / keep browsing → CALL close_cart.
▸ Customer asks to scroll a homepage area → CALL navigate_to.

If unsure which product, ask ONE quick clarifying question, then act.

═══ SIZES (read from catalog, never guess) ═══
Each product lists its OWN sizes in 'sizes: [...]'. Quote only those. Shoes use EU numeric sizes (36–41), garments XS–XL, accessories One Size. Never default shoes to XS–XL.

═══ COLLECTION (Spring/Summer 2026) ═══
${productList}

Free shipping over €200, worldwide; Made in Istanbul.

Always reply in the same language the user wrote in. NEVER mention tool/function names.`;
}

const TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "navigate_to",
        description: "Scrolls the homepage to a specific section.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.STRING, enum: SECTIONS },
          },
          required: ["section"],
        },
      },
      {
        name: "navigate_category",
        description: "Take the user to a category page.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: CATEGORIES },
          },
          required: ["category"],
        },
      },
      {
        name: "show_product",
        description:
          "Open the product detail page. ONLY use product_ids from the catalog above — never invent a slug.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            product_id: { type: Type.STRING, enum: ALL_SLUGS },
          },
          required: ["product_id"],
        },
      },
      {
        name: "recommend_outfit",
        description:
          "Suggest a complete outfit (comma-separated product names from the catalog).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            items: { type: Type.STRING },
            occasion: { type: Type.STRING },
          },
          required: ["items"],
        },
      },
      {
        name: "open_cart",
        description:
          "Opens the shopping cart drawer (sepetim) for the user to view their cart or complete their checkout.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
      {
        name: "add_to_cart",
        description:
          "Adds a product to the shopping cart (sepete ekle). Use a product_id from the catalog. Optionally pass a size from that product's sizes; defaults to M when omitted.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            product_id: { type: Type.STRING, enum: ALL_SLUGS },
            size: {
              type: Type.STRING,
              description:
                "One of the product's available sizes from the catalog (e.g. '38' for shoes, 'M' for garments, 'One Size'). Omit if unknown.",
            },
          },
          required: ["product_id"],
        },
      },
      {
        name: "close_cart",
        description:
          "Closes the shopping cart drawer (sepetim) so the user can keep browsing.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
    ],
  },
];

function ndjson(obj: unknown) {
  return new TextEncoder().encode(JSON.stringify(obj) + "\n");
}

export async function POST(req: Request) {
  const t0 = Date.now();
  const requestId = Math.random().toString(36).slice(2, 8);
  const log = (...args: unknown[]) =>
    console.log(`[SHOLÉ API ${requestId}]`, ...args);

  try {
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      log("ERROR: no GEMINI_API_KEY env var");
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages: Array<{ role: string; content?: string; text?: string }> =
      body.messages || [];
    log("recv", messages.length, "msgs; last:", messages[messages.length - 1]);

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    let contents = messages
      .map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: (m.content || m.text || "").toString() }],
      }))
      .filter((c) => c.parts[0].text.trim().length > 0);

    // Gemini requires history to begin with a `user` turn — strip any leading
    // model greeting (e.g. the "Welcome to SHOLÉ" placeholder).
    while (contents.length && contents[0].role !== "user") {
      contents.shift();
    }
    if (!contents.length) {
      log("history reduced to empty after sanitisation");
      return NextResponse.json({ error: "Empty history" }, { status: 400 });
    }

    let lastErr: unknown = null;
    for (const model of MODELS) {
      try {
        log("calling model:", model);
        const result = await ai.models.generateContentStream({
          model,
          contents,
          config: {
            systemInstruction: buildSystemPrompt(),
            temperature: 0.85,
            topP: 0.92,
            maxOutputTokens: 512,
            tools: TOOLS,
          },
        });

        const stream = new ReadableStream({
          async start(controller) {
            let chars = 0;
            let toolCalls = 0;
            try {
              for await (const chunk of result) {
                const text = chunk.text || "";
                if (text) {
                  chars += text.length;
                  controller.enqueue(ndjson({ text }));
                }
                const calls = chunk.functionCalls || [];
                if (calls.length) {
                  for (const c of calls) {
                    toolCalls++;
                    log("tool_call:", c.name, c.args);
                    controller.enqueue(
                      ndjson({ tool: { name: c.name, args: c.args } })
                    );
                  }
                }
              }
              log(`stream done in ${Date.now() - t0}ms — ${chars} chars, ${toolCalls} tool_calls`);
              controller.enqueue(ndjson({ done: true }));
              controller.close();
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              log("stream error:", msg);
              controller.enqueue(ndjson({ error: msg }));
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-store, no-transform",
            "X-Request-Id": requestId,
          },
        });
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        log(`model ${model} failed:`, msg);
        if (!/404|NOT_FOUND|UNAVAILABLE|not found/i.test(msg)) break;
      }
    }

    const errMsg =
      lastErr instanceof Error ? lastErr.message : String(lastErr ?? "unknown");
    log("ALL models failed:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[SHOLÉ API ${requestId}] FATAL:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
