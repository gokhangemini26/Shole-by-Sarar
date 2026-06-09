import { GoogleGenAI } from "@google/genai";
import { deleteSessionCache } from "@/lib/supabase/cacheManager";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────────────────────────────
   POST /api/cache — best-effort teardown of a session's Gemini context
   cache when the session ends (page unload / sendBeacon).

   IMPORTANT: this deletes ONLY the ephemeral model-side token cache. The
   customer's durable history (chat_messages, purchases, cart_events,
   product_views) lives in its own tables and is NOT touched — returning
   customers are still recognised and personalised via getAIMemoryContext().
   ───────────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    // sendBeacon delivers a Blob; tolerate any content-type.
    const raw = await req.text();
    const body = raw ? JSON.parse(raw) : {};
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
    if (!sessionId) return new Response(null, { status: 204 });

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return new Response(null, { status: 204 });

    const ai = new GoogleGenAI({ apiKey });
    await deleteSessionCache(ai, sessionId);
    return new Response(null, { status: 204 });
  } catch {
    // Never surface errors — this is fire-and-forget cleanup.
    return new Response(null, { status: 204 });
  }
}
