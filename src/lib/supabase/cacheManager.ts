/* ═══════════════════════════════════════════════════════════════════════
   Rolling Context Cache manager for Gemini Explicit Context Caching.

   Strategy
   ────────
   Gemini caches are immutable, so we do NOT recreate one per message.
   Instead, per session we keep ONE active cache holding a prefix of the
   conversation (system prompt + tools + turns 1..B). Each request reuses it
   via `config.cachedContent` and sends only the uncached delta (turns B+1..N)
   as `contents`. Periodically (every N turns, or once the uncached delta is
   large) we mint a fresh cache covering more of the history and delete the
   old one to avoid orphaned storage charges.

   Hot path (prepareCachedGeneration): ONE Supabase read, no Gemini calls.
   Cold path (runMaintenance, called AFTER the answer has streamed): the
   create / refresh / delete + DB write. Never blocks the user's first token.

   Every Supabase / Gemini call is wrapped so a failure degrades to standard
   non-cached inference instead of breaking the chat.

   DB table (see supabase/migrations/*_gemini_context_caches.sql):
     gemini_context_caches(session_id PK, tenant_id, cached_content_name,
       cached_turn_count, model, expires_at, created_at, updated_at)
   ═══════════════════════════════════════════════════════════════════════ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { GoogleGenAI, Content, ContentUnion, Tool } from "@google/genai";

const TABLE = "gemini_context_caches";

export interface CacheManagerOptions {
  /** Cache TTL in seconds (Gemini default 3600 = 1h). */
  ttlSeconds?: number;
  /** Minimum estimated history tokens before the FIRST cache is created.
   *  ~2048 for Gemini 2.x/2.5 Flash, ~4096 for 3.x/3.5 Flash. */
  minTokensToCache?: number;
  /** Recreate the cache once this many messages sit uncached after it. */
  refreshEveryTurns?: number;
  /** …or once the uncached delta exceeds this many estimated tokens. */
  refreshTokenDelta?: number;
  /** How many of the most recent messages to keep OUT of the cache so they
   *  can be appended live (kept dynamic). */
  keepRecentTurns?: number;
}

const DEFAULTS: Required<CacheManagerOptions> = {
  ttlSeconds: 3600,
  minTokensToCache: 2048,
  refreshEveryTurns: 10, // ~5 user/model exchanges
  refreshTokenDelta: 2000,
  keepRecentTurns: 2,
};

/** Per-model minimum-token guidance for the create threshold. */
export function minTokensForModel(model: string): number {
  // 3.x / 3.5 family needs a larger floor than 2.x / 2.5.
  return /gemini-3|gemini-3\.|3\.\d/.test(model) ? 4096 : 2048;
}

export interface GenerationPlan {
  model: string;
  contents: Content[];
  config: {
    cachedContent?: string;
    systemInstruction?: ContentUnion;
    tools?: Tool[];
  };
  usedCache: boolean;
}

export interface PreparedGeneration {
  /** The plan to use for THIS request (cached or standard). */
  plan: GenerationPlan;
  /** A standard, non-cached plan — use it to retry if the cached call fails
   *  (graceful fallback). */
  fallbackPlan: GenerationPlan;
  /** Best-effort cache maintenance. Call AFTER the response has streamed.
   *  Always resolves (errors are swallowed + logged). */
  runMaintenance: () => Promise<void>;
}

interface CacheRow {
  session_id: string;
  tenant_id: string | null;
  cached_content_name: string | null;
  cached_turn_count: number | null;
  model: string | null;
  expires_at: string | null;
}

/* ── Supabase admin (service-role preferred, anon fallback) ────────────── */
let _admin: SupabaseClient | null = null;
let _adminTried = false;
function getAdminClient(): SupabaseClient | null {
  if (_adminTried) return _admin;
  _adminTried = true;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    _admin = createClient(url, key, { auth: { persistSession: false } });
  } catch {
    _admin = null;
  }
  return _admin;
}

/* ── Helpers ───────────────────────────────────────────────────────────── */
function estimateTokens(contents: Content[]): number {
  // Cheap heuristic (~4 chars/token) so the hot path never calls the network.
  let chars = 0;
  for (const c of contents) {
    for (const p of c.parts ?? []) {
      if (typeof (p as { text?: string }).text === "string") {
        chars += (p as { text: string }).text.length;
      } else {
        chars += 256; // rough cost for a tool call / response part
      }
    }
  }
  return Math.ceil(chars / 4);
}

function isExpired(row: CacheRow | null): boolean {
  if (!row?.expires_at) return false;
  // 30s safety margin against clock skew / in-flight latency.
  return Date.parse(row.expires_at) <= Date.now() + 30_000;
}

async function loadState(
  supabase: SupabaseClient,
  sessionId: string
): Promise<CacheRow | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "session_id, tenant_id, cached_content_name, cached_turn_count, model, expires_at"
    )
    .eq("session_id", sessionId)
    .maybeSingle();
  if (error) {
    console.warn("[cacheManager] loadState failed:", error.message);
    return null;
  }
  return (data as CacheRow) ?? null;
}

/* ── Public: prepare a generation plan for this request ────────────────── */
export async function prepareCachedGeneration(params: {
  ai: GoogleGenAI;
  sessionId?: string | null;
  tenantId?: string | null;
  model: string;
  systemInstruction: ContentUnion;
  tools: Tool[];
  /** Sanitised history — MUST start with a `user` turn and be append-only. */
  history: Content[];
  options?: CacheManagerOptions;
}): Promise<PreparedGeneration> {
  const opts = { ...DEFAULTS, ...params.options };
  const { ai, model, systemInstruction, tools, history } = params;
  const sessionId = params.sessionId ?? null;
  const tenantId = params.tenantId ?? null;

  const fallbackPlan: GenerationPlan = {
    model,
    contents: history,
    config: { systemInstruction, tools },
    usedCache: false,
  };

  const supabase = getAdminClient();
  // No DB or no session id → caching disabled, behave exactly as before.
  if (!supabase || !sessionId) {
    return { plan: fallbackPlan, fallbackPlan, runMaintenance: async () => {} };
  }

  let row: CacheRow | null = null;
  try {
    row = await loadState(supabase, sessionId);
  } catch (e) {
    console.warn("[cacheManager] loadState threw:", (e as Error)?.message);
  }

  const cachedCount = row?.cached_turn_count ?? 0;
  const cacheUsable =
    !!row?.cached_content_name &&
    row.model === model &&
    cachedCount > 0 &&
    cachedCount <= history.length &&
    !isExpired(row);

  let plan: GenerationPlan = fallbackPlan;
  if (cacheUsable) {
    const delta = history.slice(cachedCount);
    // The delta must be a valid continuation: non-empty and starting on a
    // `user` turn. (Otherwise reuse standard inference this turn.)
    if (delta.length > 0 && delta[0].role === "user") {
      plan = {
        model,
        contents: delta,
        config: { cachedContent: row!.cached_content_name! },
        usedCache: true,
      };
    }
  }

  const runMaintenance = async () => {
    try {
      await maintain({
        ai,
        supabase,
        sessionId,
        tenantId,
        model,
        systemInstruction,
        tools,
        history,
        row,
        opts,
      });
    } catch (e) {
      console.warn("[cacheManager] maintenance failed:", (e as Error)?.message);
    }
  };

  return { plan, fallbackPlan, runMaintenance };
}

/* ── Cold path: create / refresh / delete ──────────────────────────────── */
async function maintain(args: {
  ai: GoogleGenAI;
  supabase: SupabaseClient;
  sessionId: string;
  tenantId: string | null;
  model: string;
  systemInstruction: ContentUnion;
  tools: Tool[];
  history: Content[];
  row: CacheRow | null;
  opts: Required<CacheManagerOptions>;
}) {
  const { history, row, model, opts } = args;

  // Cache everything except the last `keepRecentTurns` messages.
  const boundary = Math.max(0, history.length - opts.keepRecentTurns);
  if (boundary <= 0) return; // not enough history to cache anything

  const hasUsableCache =
    !!row?.cached_content_name &&
    row.model === model &&
    typeof row.cached_turn_count === "number" &&
    row.cached_turn_count > 0 &&
    row.cached_turn_count <= history.length &&
    !isExpired(row);

  if (hasUsableCache) {
    const cachedCount = row!.cached_turn_count!;
    const delta = history.slice(cachedCount);
    const turnsBehind = history.length - cachedCount;
    const shouldRefresh =
      turnsBehind >= opts.refreshEveryTurns ||
      estimateTokens(delta) >= opts.refreshTokenDelta;
    if (!shouldRefresh || boundary <= cachedCount) return;
    await createAndSwap({ ...args, boundary, oldName: row!.cached_content_name! });
  } else {
    // First-time creation: only once the cacheable prefix is large enough.
    if (estimateTokens(history.slice(0, boundary)) < opts.minTokensToCache) return;
    await createAndSwap({ ...args, boundary, oldName: row?.cached_content_name ?? null });
  }
}

async function createAndSwap(args: {
  ai: GoogleGenAI;
  supabase: SupabaseClient;
  sessionId: string;
  tenantId: string | null;
  model: string;
  systemInstruction: ContentUnion;
  tools: Tool[];
  history: Content[];
  boundary: number;
  oldName: string | null;
  opts: Required<CacheManagerOptions>;
}) {
  const {
    ai,
    supabase,
    sessionId,
    tenantId,
    model,
    systemInstruction,
    tools,
    history,
    boundary,
    oldName,
    opts,
  } = args;

  // Cached prefix must begin on a `user` turn (history is already sanitised,
  // so start is normally 0 — this is purely defensive).
  let start = 0;
  const prefix = history.slice(0, boundary);
  while (start < prefix.length && prefix[start].role !== "user") start++;
  const cacheContents = prefix.slice(start);
  if (!cacheContents.length) return;

  // 1) Create the new cache (system prompt + tools live here, NOT in generate).
  const created = await ai.caches.create({
    model,
    config: {
      contents: cacheContents,
      systemInstruction,
      tools,
      ttl: `${opts.ttlSeconds}s`,
      displayName: `sess:${sessionId}`.slice(0, 120),
    },
  });
  if (!created?.name) throw new Error("caches.create returned no name");

  const expiresAt = created.expireTime
    ? new Date(created.expireTime).toISOString()
    : new Date(Date.now() + opts.ttlSeconds * 1000).toISOString();

  // 2) Persist state. `cached_turn_count = boundary` is the index into the
  //    SAME sanitised history prepare() uses, so delta = history.slice(boundary).
  const { error } = await supabase.from(TABLE).upsert(
    {
      session_id: sessionId,
      tenant_id: tenantId,
      cached_content_name: created.name,
      cached_turn_count: boundary,
      model,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "session_id" }
  );

  if (error) {
    // DB write lost → drop the just-created cache so it can't orphan-bill.
    await ai.caches.delete({ name: created.name }).catch(() => {});
    throw new Error(`cache state upsert failed: ${error.message}`);
  }

  // 3) Swap succeeded → delete the previous cache.
  if (oldName && oldName !== created.name) {
    await ai.caches.delete({ name: oldName }).catch((e) =>
      console.warn("[cacheManager] old cache delete failed:", e?.message)
    );
  }
}

/* ── Optional: explicit teardown when a session ends ───────────────────── */
export async function deleteSessionCache(
  ai: GoogleGenAI,
  sessionId: string
): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) return;
  try {
    const row = await loadState(supabase, sessionId);
    if (row?.cached_content_name) {
      await ai.caches.delete({ name: row.cached_content_name }).catch(() => {});
    }
    await supabase.from(TABLE).delete().eq("session_id", sessionId);
  } catch (e) {
    console.warn("[cacheManager] deleteSessionCache failed:", (e as Error)?.message);
  }
}
