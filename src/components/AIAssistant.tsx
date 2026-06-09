"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X, Mic, MicOff, Send, Terminal, AlertTriangle, Sparkles, ChevronUp, Square } from "lucide-react";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { GeminiLiveClient, FunctionCall } from "@/lib/gemini-live";
import { startVADMic, type VADMicHandle } from "@/lib/vad-mic";
import { PRODUCTS } from "@/lib/products";
import { getLabels } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { getAIMemoryContext, createChatSession, logChatMessage } from "@/lib/supabase/tracking";
import { useLocale } from "@/lib/LocaleContext";

// ms to keep the mic gated after the last audio sample plays out, covering
// speaker output latency + room reverb so trailing echo never reaches Gemini.
const SPEAKER_DRAIN_TAIL_MS = 450;

// Fired the moment the live session connects — the assistant opens the
// conversation itself instead of waiting for the user to speak.
const GREETING_PROMPT =
  "Open with exactly: 'Merhaba, hoş geldiniz — size bugün nasıl yardımcı olabilirim?' " +
  "(adapt to the interface language). Do NOT use the customer's name in this first greeting, " +
  "even if you know it. Use the formal 'siz' form, warm but professional.";

function buildLiveSystemPrompt(locale: string, memoryContext: string) {
  const productList = PRODUCTS.map(
    (p, i) => {
      const name = locale === "tr" && p.name_tr ? p.name_tr : p.name;
      const subtitle = locale === "tr" && p.subtitle_tr ? p.subtitle_tr : p.subtitle;
      return `${i + 1}. ${name} (${p.category}) — ${subtitle}, ${p.price}. sizes: [${p.sizes.join(", ")}]. slug: '${p.slug}'`;
    }
  ).join("\n");

  return `You are SHOLÉ, the in-store AI stylist for SHOLÉ (Istanbul, digital-first since 2026).
Current interface language: ${locale}.

VOICE STYLE — strict, this is a phone-call conversation:
- ONE sentence per turn. Two max. Never lecture.
- Calm, polished, professional. Not chatty, not casual filler.
- Reply in the customer's language. Match formality.

FORM OF ADDRESS — important:
- ALWAYS use the formal "siz" form (Turkish) / formal register — never "sen". Formal yet warm and friendly, like a refined personal stylist.
- FIRST GREETING when voice starts: say exactly "Merhaba, hoş geldiniz — size bugün nasıl yardımcı olabilirim?" (adapt to the interface language). Do NOT use the customer's name in this opening line, even if it is in memory.
- You MAY address the customer by their name later in the conversation — sparingly, politely, once rapport is built — never in the first line.
- No greeting filler after the first turn ("of course", "absolutely" once is fine, then drop it).
- DO NOT ask too many questions to avoid overwhelming the user. Limit yourself to 2-3 questions max during the entire conversation.
- After 2-3 questions, switch to passive prompts. Summarize what has been done and ask for their thoughts. For example: "So far we've looked at these options. I'd love to hear your thoughts before we explore further," or "I'm open to your suggestions and would love to continue with more suitable choices based on your feedback."
- When you do ask a question early on, make it a SHORT question that moves the sale forward.

TOOLS — call them silently, never mention names:
- Customer mentions a specific item → CALL show_product with the exact slug.
- Customer asks for a category → CALL navigate_category (women / accessories / shoes / tailoring / journal).
- Customer asks for an outfit → CALL recommend_outfit AND show_product for the hero piece.
- Customer wants to ADD an item to the cart/bag ("sepete ekle", "add this") → CALL add_to_cart with the slug and, if given, the size.
- Customer wants to view their cart, checkout, or complete/finalize their shopping/purchase → CALL open_cart.
- Customer wants to close the cart / go back to browsing → CALL close_cart.
- Customer requests/speaks a different language or asks if you speak it (e.g., "Parli Italiano?", "Almanca konuş", "switch to English", "Deutsch sprechen") → CALL set_language(locale) immediately.
- NEVER invent a slug; only use the catalog below.

SIZES — read them from the catalog, never guess:
- Each product lists its OWN available sizes in 'sizes: [...]'. Quote ONLY those.
- Shoes use EU numeric sizes (e.g. 36–41), garments use XS–XL, accessories are usually One Size.
- If asked "what sizes?", state that product's exact sizes from the catalog. Never default to XS–XL for shoes.

CATALOG (Spring/Summer 2026):
${productList}

Free shipping over €200. Made in Istanbul.

${memoryContext}`;
}

function resamplePCM(oldSamples: Int16Array, oldSR: number, newSR: number): Int16Array {
  if (oldSR === newSR) return oldSamples;
  const ratio = oldSR / newSR;
  const newLength = Math.round(oldSamples.length / ratio);
  const result = new Int16Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const oldIdx = i * ratio;
    const low = Math.floor(oldIdx);
    const high = Math.min(low + 1, oldSamples.length - 1);
    const weight = oldIdx - low;
    result[i] = Math.round(oldSamples[low] * (1 - weight) + oldSamples[high] * weight);
  }
  return result;
}

type Msg = { role: "user" | "model"; content: string; products?: string[] };
type LogLine = { ts: string; text: string };

const MAX_LOG_LINES = 1000;

export interface ToolCallHandler {
  (calls: FunctionCall[]): void;
}

export function AIAssistant({
  open,
  onClose,
  onToolCall,
  locale = "en",
  autoStartVoice = false,
}: {
  open: boolean;
  onClose: () => void;
  onToolCall?: ToolCallHandler;
  locale?: string;
  autoStartVoice?: boolean;
}) {
  const labels = getLabels(locale as any);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "model", content: labels.greeting },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTurnActive, setIsTurnActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [logCopied, setLogCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [memoryContext, setMemoryContext] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();
  const { setLocale } = useLocale();
  
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);

  const detectAndSetLanguage = (text: string) => {
    const clean = text.toLowerCase();
    
    // Turkish keywords & letters
    const hasTrLetters = /[ığüşöçİĞÜŞÖÇ]/.test(text);
    const trWords = ["merhaba", "nasılsın", "sepet", "ürün", "kıyafet", "elbise", "giysi", "pantolon", "ayakkabı", "kargo", "ücretsiz", "türkçe", "yardım", "göster", "öner", "tavsiye", "ekle", "almak", "istiyorum", "neler", "bunu", "şunu", "evet", "hayır", "lütfen", "nasıl", "bugün", "ayır"];
    const trScore = (hasTrLetters ? 2 : 0) + trWords.filter(w => clean.includes(w)).length;

    // Italian keywords
    const itWords = ["ciao", "come", "stai", "carrello", "prodotto", "vestito", "cappotto", "scarpa", "pantalone", "italiano", "parli", "sì", "spedizione", "gratuita", "mostra", "consiglia", "comprare", "aggiungi", "apri", "chiudi", "aiuto", "buongiorno", "buonasera", "matrimonio", "oggi"];
    const itScore = itWords.filter(w => clean.includes(w)).length;

    // German keywords & letters
    const hasDeLetters = /[äßÄ]/.test(text); // ö, ü are shared with TR, but ä and ß are German specific
    const deWords = ["hallo", "wie", "geht", "warenkorb", "produkt", "kleid", "schuh", "hose", "deutsch", "sprichst", "bitte", "danke", "versand", "kostenlos", "zeigen", "empfehlen", "kaufen", "hinzufügen", "öffnen", "schließen", "hilfe", "guten", "tag", "morgen", "abend", "heute"];
    const deScore = (hasDeLetters ? 2 : 0) + deWords.filter(w => clean.includes(w)).length;

    // English keywords
    const enWords = ["hello", "hi", "how", "are", "you", "cart", "bag", "product", "dress", "coat", "shoe", "pant", "trouser", "english", "speak", "please", "thanks", "shipping", "free", "show", "recommend", "suggest", "buy", "add", "open", "close", "help", "wedding", "today"];
    const enScore = enWords.filter(w => clean.includes(w)).length;

    const maxScore = Math.max(trScore, itScore, deScore, enScore);
    if (maxScore >= 1) {
      if (maxScore === trScore && locale !== "tr") {
        setLocale("tr");
      } else if (maxScore === itScore && locale !== "it") {
        setLocale("it");
      } else if (maxScore === deScore && locale !== "de") {
        setLocale("de");
      } else if (maxScore === enScore && locale !== "en") {
        setLocale("en");
      }
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const ua = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const width = window.innerWidth < 768;
      setIsMobile(ua || width);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (open && autoStartVoice && isMobile) {
      setShowMobileOverlay(true);
      setIsExpanded(true);
    } else {
      setShowMobileOverlay(false);
    }
  }, [open, autoStartVoice, isMobile]);
  
  const currentBotTranscriptRef = useRef("");
  const currentUserTranscriptRef = useRef("");

  useEffect(() => {
    const supabase = createClient();
    async function loadFor(userId: string) {
      const ctx = await getAIMemoryContext(userId);
      setMemoryContext(ctx);
      const sid = await createChatSession(userId);
      setSessionId(sid);
    }
    // Session is persisted by Supabase → returning visitors are auto-authed.
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthed(!!data.user);
      if (data.user) loadFor(data.user.id);
    });
    // Keep the voice gate accurate if the user logs in / out mid-session.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthed(!!session?.user);
      if (event === "SIGNED_OUT") {
        setMemoryContext("");
        setSessionId(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Tear down the session's Gemini context cache when the user leaves the page
  // (session end) to zero out cache storage cost. Durable history in Supabase
  // is untouched — returning customers stay personalised.
  useEffect(() => {
    if (!sessionId) return;
    const cleanup = () => {
      try {
        navigator.sendBeacon?.(
          "/api/cache",
          new Blob([JSON.stringify({ sessionId })], { type: "application/json" })
        );
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("pagehide", cleanup);
    return () => window.removeEventListener("pagehide", cleanup);
  }, [sessionId]);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const logScrollRef = useRef<HTMLDivElement>(null);

  const hasVoiceKey =
    typeof process !== "undefined" &&
    !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Live refs
  const clientRef = useRef<GeminiLiveClient | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const micGainRef = useRef<GainNode | null>(null);
  const vadHandleRef = useRef<VADMicHandle | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Output is now a single AudioWorkletNode that owns a 3-second ring
  // buffer of PCM samples. The worklet runs in the audio rendering thread
  // so we never lose continuity to main-thread jank — and we get a real
  // jitter buffer + fade-out on barge-in for free.
  const playerNodeRef = useRef<AudioWorkletNode | null>(null);
  const playerInitPromiseRef = useRef<Promise<AudioWorkletNode> | null>(null);
  const isPlayingRef = useRef(false);
  // After a barge-in we keep dropping incoming chunks until Gemini sends
  // turnComplete — otherwise the ~1 s of in-flight audio still arrives,
  // gets played, and produces the choppy start/stop pattern.
  const turnActiveRef = useRef(false);
  const suppressUntilTurnRef = useRef(false);
  // Safety valve: if audio playback stops but turnComplete never arrives,
  // release the echo guard after 1.5 s so the user's mic isn't blocked.
  const echoGuardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Speaker-drain tail: turnComplete / isPlaying=false fire the instant the
  // ring buffer empties, but the speaker keeps physically emitting the bot's
  // voice for a few hundred ms after (output latency + room reverb). Keep the
  // mic suppressed until this timestamp so that trailing echo never reaches
  // Gemini and gets mistaken for a user barge-in.
  const aiTailUntilRef = useRef(0);
  const aiTailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [aiAudioTail, setAiAudioTail] = useState(false);

  /* ── Logging ───────────────────────────────────────────────────────── */
  const pushLog = useCallback((text: string) => {
    const ts = new Date().toISOString().slice(11, 23);
    const line = { ts, text };
    console.log(`[SHOLÉ ${ts}] ${text}`);
    setLogs((prev) => {
      const next = [...prev, line];
      if (next.length > MAX_LOG_LINES) next.splice(0, next.length - MAX_LOG_LINES);
      return next;
    });
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      w.__SHOLE_LOG = w.__SHOLE_LOG || [];
      w.__SHOLE_LOG.push(`${ts} ${text}`);
      if (w.__SHOLE_LOG.length > 500) w.__SHOLE_LOG.shift();
    }
  }, []);

  /* ── Auto-scroll ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [logs]);

  /* ── Auto-start voice on open ──────────────────────────────────────── */
  // The launcher is the user's intent gesture — opening the assistant
  // means they want to talk. Spin the live session up automatically so
  // they can just speak. Skipped if the voice key isn't configured.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (!open) {
      autoStartedRef.current = false;
      return;
    }
    if (autoStartedRef.current) return;
    if (!hasVoiceKey) return;
    if (!isAuthed) return; // voice requires sign-in — don't auto-start for guests
    if (isLive || isConnecting) return;

    if (isMobile && autoStartVoice) {
      autoStartedRef.current = true;
      return;
    }

    autoStartedRef.current = true;
    // Defer to next tick so the dialog's intro animation isn't competing
    // with the AudioContext + WebSocket setup.
    const t = setTimeout(() => {
      toggleVoiceRef.current?.();
    }, 200);
    return () => clearTimeout(t);
  }, [open, hasVoiceKey, isAuthed, isLive, isConnecting, isMobile, autoStartVoice]);

  // toggleVoice is defined further down; we read it through a ref so the
  // auto-start effect doesn't have to worry about hoisting.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleVoiceRef = useRef<any>(null);

  /* ── Mic gain ducking — soften echo while AI talks ────────────────── */
  useEffect(() => {
    const gain = micGainRef.current;
    if (!gain) return;
    const ctx = inputCtxRef.current;
    if (!ctx) return;
    // -22 dB during AI playback — speaker echo at this level rarely clears
    // Silero's positive threshold even with the noisiest laptops.
    // Keep ducking active even during brief buffer underruns if the turn
    // hasn't officially completed yet.
    const target = (isSpeaking || isTurnActive || aiAudioTail) ? 0.08 : 1.0;
    // Smooth 30 ms ramp avoids audible pops
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.03);
  }, [isSpeaking, isTurnActive, aiAudioTail]);

  /* ── Cleanup ───────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      clientRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      vadHandleRef.current?.destroy().catch(() => {});
      try {
        playerNodeRef.current?.disconnect();
      } catch {}
      inputCtxRef.current?.close().catch(() => {});
      outputCtxRef.current?.close().catch(() => {});
    };
  }, []);

  /* ── Audio contexts ───────────────────────────────────────────────── */
  const getInputCtx = useCallback(() => {
    if (!inputCtxRef.current)
      inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
    return inputCtxRef.current;
  }, []);

  const getOutputCtx = useCallback(() => {
    if (!outputCtxRef.current)
      outputCtxRef.current = new AudioContext({ sampleRate: 24000 });
    return outputCtxRef.current;
  }, []);

  // Lazy-load the PCM player AudioWorklet. The worklet runs in the audio
  // rendering thread with a built-in ring buffer, so playback is immune
  // to React renders / log updates / network bursts — and it can fade
  // out instantly on barge-in without crackle.
  const ensurePlayerNode = useCallback(async () => {
    if (playerNodeRef.current) return playerNodeRef.current;
    
    if (!playerInitPromiseRef.current) {
      playerInitPromiseRef.current = (async () => {
        const ctx = getOutputCtx();
        if (ctx.state === "suspended") await ctx.resume().catch(() => {});
        try {
          await ctx.audioWorklet.addModule("/pcm-player-processor.js");
        } catch {
          // module already registered
        }
        const node = new AudioWorkletNode(ctx, "pcm-player", {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          outputChannelCount: [1],
        });
        let lastPriming = true;
        let turnEndedLocally = false;
        node.port.onmessage = (ev) => {
          const msg = ev.data;
          if (msg && msg.type === "level") {
            if (msg.isPlaying !== isPlayingRef.current) {
              const wasPlaying = isPlayingRef.current;
              isPlayingRef.current = msg.isPlaying;
              setIsSpeaking(msg.isPlaying);

              // Audio just stopped: arm the speaker-drain tail so the echo
              // gate + mic ducking stay engaged while the speaker finishes
              // emitting the bot's voice. Without this, trailing echo leaks
              // to Gemini and triggers a false barge-in that restarts the turn.
              if (wasPlaying && !msg.isPlaying) {
                aiTailUntilRef.current = Date.now() + SPEAKER_DRAIN_TAIL_MS;
                setAiAudioTail(true);
                if (aiTailTimerRef.current) clearTimeout(aiTailTimerRef.current);
                aiTailTimerRef.current = setTimeout(() => {
                  if (!isPlayingRef.current) setAiAudioTail(false);
                  aiTailTimerRef.current = null;
                }, SPEAKER_DRAIN_TAIL_MS);

                // Safety timer to release the echo guard if turnComplete
                // never arrives.
                if (turnActiveRef.current) {
                  if (echoGuardTimerRef.current) clearTimeout(echoGuardTimerRef.current);
                  echoGuardTimerRef.current = setTimeout(() => {
                    if (!isPlayingRef.current && turnActiveRef.current) {
                      pushLog("echo guard safety release (no turnComplete after 1.5 s)");
                      turnActiveRef.current = false;
                      setIsTurnActive(false);
                    }
                    echoGuardTimerRef.current = null;
                  }, 1500);
                }
              }
              // New audio arrived — cancel pending releases and tail.
              if (!wasPlaying && msg.isPlaying) {
                aiTailUntilRef.current = 0;
                setAiAudioTail(false);
                if (aiTailTimerRef.current) {
                  clearTimeout(aiTailTimerRef.current);
                  aiTailTimerRef.current = null;
                }
                if (echoGuardTimerRef.current) {
                  clearTimeout(echoGuardTimerRef.current);
                  echoGuardTimerRef.current = null;
                }
              }
            }
            // Detect underruns (priming flipping back on while we've been
            // streaming) — only report mid-turn underruns, not natural
            // end-of-turn buffer drains.
            if (msg.priming && !lastPriming && !suppressUntilTurnRef.current && !turnEndedLocally) {
              pushLog(`underrun! re-priming jitter buffer (had ${Math.round(msg.bufferedMs ?? 0)} ms)`);
            }
            // Reset turn-ended flag once we're idle (no audio in buffer)
            if (msg.priming && msg.bufferedMs <= 0) {
              turnEndedLocally = false;
            }
            lastPriming = msg.priming;
          } else if (msg && msg.type === "turn_ended_ack") {
            turnEndedLocally = true;
          }
        };
        node.connect(ctx.destination);
        playerNodeRef.current = node;
        pushLog(`pcm-player worklet active (ctx ${ctx.sampleRate} Hz)`);
        return node;
      })();
    }
    
    return playerInitPromiseRef.current;
  }, [getOutputCtx, pushLog]);

  // Push a base64 PCM chunk into the worklet's ring buffer. Decoding and
  // sample-rate handling happen here; actual playback is on the audio
  // thread. Cheap and lock-free relative to BufferSourceNode scheduling.
  const scheduleAudioChunk = useCallback(
    async (b64: string) => {
      const node = await ensurePlayerNode();
      const bin = atob(b64);
      // Skip Gemini's empty header chunks (4 base64 chars → ~3 bytes).
      if (bin.length < 8) return;
      const bytes = new Int16Array(bin.length / 2);
      for (let i = 0; i < bin.length; i += 2)
        bytes[i / 2] = (bin.charCodeAt(i + 1) << 8) | bin.charCodeAt(i);
      
      const ctx = getOutputCtx();
      const resampled = resamplePCM(bytes, 24000, ctx.sampleRate);
      const buf = resampled.buffer.slice(0); // transfer-safe copy
      node.port.postMessage({ type: "pcm", data: buf }, [buf]);
      isPlayingRef.current = true;
      setIsSpeaking(true);
    },
    [ensurePlayerNode, getOutputCtx]
  );

  const stopAudio = useCallback(() => {
    // 20 ms fade-out in the worklet — no pop, then the buffer is cleared.
    playerNodeRef.current?.port.postMessage({ type: "stop" });
  }, []);

  /* ── VAD-gated mic capture ────────────────────────────────────────── */
  const startMicCapture = useCallback(
    async (rawStream: MediaStream) => {
      streamRef.current = rawStream;
      const ctx = getInputCtx();
      if (ctx.state === "suspended") await ctx.resume();

      // Build a ducking chain so the AI's voice through speakers gets
      // attenuated before it reaches the mic-side VAD. Without this the
      // mic re-captures the bot and Silero treats it as user speech.
      const sourceNode = ctx.createMediaStreamSource(rawStream);
      const micGain = ctx.createGain();
      micGain.gain.value = 1.0;
      micGainRef.current = micGain;
      const dest = ctx.createMediaStreamDestination();
      sourceNode.connect(micGain);
      micGain.connect(dest);
      const gatedStream = dest.stream;

      try {
        const handle = await startVADMic({
          stream: gatedStream,
          audioContext: ctx,
          onLog: pushLog,
          onLevel: (lvl) => setAudioLevel(lvl),
          // Keep echo guard active during the entire AI turn AND through the
          // speaker-drain tail after it ends, so trailing echo never reaches
          // Gemini as a false barge-in.
          isAISpeaking: () =>
            isPlayingRef.current ||
            turnActiveRef.current ||
            Date.now() < aiTailUntilRef.current,
          aiPlaybackThreshold: 0.92,
          aiPlaybackRmsThreshold: 0.22,
          onSpeechStart: () => {
            // Purely rely on Gemini's highly accurate server-side echo cancellation and interruption detection
            // to avoid client-side speaker echo from falsely cutting off the AI's voice mid-turn.
            pushLog("local VAD speech start detected");
          },
          onSpeechFrameB64: (b64) => {
            clientRef.current?.sendAudio(b64);
          },
        });
        vadHandleRef.current = handle;
        pushLog("VAD loaded and running ✓ (mic listening)");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        pushLog(`VAD load FAILED: ${msg}`);
        setMessages((m) => [
          ...m,
          {
            role: "model",
            content: `couldn't load the voice model ◇ ${msg.slice(0, 100)}`,
          },
        ]);
        throw err;
      }
    },
    [getInputCtx, pushLog, stopAudio]
  );

  /* ── Tool calls ───────────────────────────────────────────────────── */
  const handleToolCall = useCallback(
    (calls: FunctionCall[]) => {
      pushLog(`tool: ${calls.map((c) => c.name).join(",")}`);
      onToolCall?.(calls);

      const productSlugs: string[] = [];
      calls.forEach(c => {
        if (c.name === "show_product" && typeof c.args.product_id === "string") {
          productSlugs.push(c.args.product_id);
        }
        if (c.name === "recommend_outfit" && typeof c.args.items === "string") {
          const slugs = c.args.items.split(",").map(s => s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
          productSlugs.push(...slugs);
        }
      });

      if (productSlugs.length > 0) {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === "model") {
            return [...prev.slice(0, -1), { ...last, products: [...(last.products || []), ...productSlugs] }];
          } else {
            return [...prev, { role: "model", content: "", products: productSlugs }];
          }
        });
      }

      const responses = calls.map((c) => ({
        id: c.id,
        name: c.name,
        response: { success: true, message: `Done: ${c.name}` },
      }));
      clientRef.current?.sendToolResponse(responses);
    },
    [onToolCall, pushLog]
  );

  /* ── Voice toggle ─────────────────────────────────────────────────── */
  const toggleVoice = async () => {
    if (isLive || isConnecting) {
      pushLog("voice OFF (user)");
      clientRef.current?.close();
      clientRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      vadHandleRef.current?.destroy().catch(() => {});
      vadHandleRef.current = null;
      stopAudio();
      setIsLive(false);
      setIsConnecting(false);
      setAudioLevel(0);
      return;
    }

    pushLog("voice ON requested");

    // Gate: the voice assistant requires a signed-in account. Redirect guests
    // to login/register first; bounce them back here (with ?voice=1 so the
    // assistant re-opens and starts) after they authenticate.
    if (!isAuthed) {
      pushLog("voice blocked — not signed in → /login");
      const here =
        typeof window !== "undefined" ? window.location.pathname : "/";
      setMessages((m) => [
        ...m,
        {
          role: "model",
          content:
            "Sesli asistanı kullanmak için lütfen giriş yapın ◇ sizi giriş sayfasına yönlendiriyorum.",
        },
      ]);
      router.push(`/login?redirect=${encodeURIComponent(here + "?voice=1")}`);
      return;
    }

    // Initialize/resume the AudioContext synchronously within the user gesture to bypass browser autoplay blocks.
    ensurePlayerNode().catch((err) => pushLog(`player warm-up error: ${err.message}`));

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      pushLog("mic permission granted");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      pushLog(`mic permission DENIED: ${msg}`);
      setMessages((m) => [
        ...m,
        {
          role: "model",
          content:
            "I can't hear you ◇ — please allow microphone access and try again.",
        },
      ]);
      return;
    }

    setIsConnecting(true);
    // Log panel is now hidden by default per user request. You can manually toggle it.
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      pushLog("ERROR: NEXT_PUBLIC_GEMINI_API_KEY not set");
      setMessages((m) => [
        ...m,
        {
          role: "model",
          content:
            "Voice mode isn't configured (NEXT_PUBLIC_GEMINI_API_KEY missing on Vercel) — but you can still chat with me here.",
        },
      ]);
      stream.getTracks().forEach((t) => t.stop());
      setIsConnecting(false);
      return;
    }
    pushLog(`api key present (len=${apiKey.length})`);

    clientRef.current = new GeminiLiveClient(apiKey, {
      systemInstruction: buildLiveSystemPrompt(locale, memoryContext),
      onLog: pushLog,
      onOpen: () => {
        pushLog("Live onOpen → starting mic");
        startMicCapture(stream).catch((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          pushLog(`mic start error: ${msg}`);
        });
      },
      onAudioData: (data) => {
        // We're receiving audio from the model, so the turn is definitely active.
        if (!turnActiveRef.current) {
          turnActiveRef.current = true;
          setIsTurnActive(true);
        }
        
        // Drop late chunks that arrive after we locally interrupted —
        // server hasn't acknowledged yet but we're already done with
        // this turn. Without this gate the in-flight ~1 s of audio
        // gets played in fragments and sounds choppy.
        if (suppressUntilTurnRef.current) return;
        // Schedule each chunk directly on the AudioContext clock — no
        // serial JS queue. This is what makes playback smooth.
        scheduleAudioChunk(data).catch((err) => {
          pushLog(`audio schedule error: ${(err as Error).message}`);
        });
      },
      onTranscription: (text, isUser) => {
        if (isUser) {
          currentUserTranscriptRef.current += text;
          detectAndSetLanguage(currentUserTranscriptRef.current);
        } else {
          if (!turnActiveRef.current) {
            turnActiveRef.current = true;
            setIsTurnActive(true);
          }
          currentBotTranscriptRef.current += text;
        }

        // Display voice transcripts as text chat bubbles
        setMessages((prev) => {
          const role = isUser ? "user" : "model";
          const lastMsg = prev[prev.length - 1];
          
          if (lastMsg && lastMsg.role === role) {
            // Append chunks to current turn
            const updated = [...prev];
            updated[updated.length - 1] = { ...lastMsg, content: lastMsg.content + text };
            return updated;
          } else {
            // Start a new message bubble
            return [...prev, { role, content: text }];
          }
        });
      },
      onToolCall: (calls) => {
        if (!turnActiveRef.current) {
          turnActiveRef.current = true;
          setIsTurnActive(true);
        }
        handleToolCall(calls);
      },
      onInterrupted: () => {
        turnActiveRef.current = false;
        setIsTurnActive(false);
        suppressUntilTurnRef.current = true;
        stopAudio();

        if (sessionId) {
          if (currentUserTranscriptRef.current) {
            logChatMessage(sessionId, "user", currentUserTranscriptRef.current);
            currentUserTranscriptRef.current = "";
          }
          if (currentBotTranscriptRef.current) {
            logChatMessage(sessionId, "model", currentBotTranscriptRef.current + " [interrupted]");
            currentBotTranscriptRef.current = "";
          }
        }
      },
      onTurnComplete: () => {
        turnActiveRef.current = false;
        setIsTurnActive(false);
        
        if (sessionId) {
          if (currentUserTranscriptRef.current) {
            logChatMessage(sessionId, "user", currentUserTranscriptRef.current);
            currentUserTranscriptRef.current = "";
          }
          if (currentBotTranscriptRef.current) {
            logChatMessage(sessionId, "model", currentBotTranscriptRef.current);
            currentBotTranscriptRef.current = "";
          }
        }
        
        // Tell the worklet the turn is done — buffer draining is expected,
        // and the next turn should use HOT priming (80ms) for fast start.
        playerNodeRef.current?.port.postMessage({ type: "turn_ended" });
        // Server has fully wound down — safe to accept new audio again.
        if (suppressUntilTurnRef.current) {
          pushLog("turn complete — re-enabling audio playback");
          suppressUntilTurnRef.current = false;
        }
      },
      onClose: () => {
        setIsLive(false);
        setIsConnecting(false);
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : String(err);
        setMessages((m) => [
          ...m,
          {
            role: "model",
            content: `voice error ◇ ${msg.slice(0, 80)}`,
          },
        ]);
      },
    });

    try {
      await clientRef.current.connect();
      setIsLive(true);
      setIsConnecting(false);
      // Greet immediately on connect — don't wait for the Silero VAD model to
      // finish downloading. The assistant should open the conversation, not
      // sit listening for the user to speak first.
      pushLog("connected → triggering greeting");
      clientRef.current.triggerGreeting(GREETING_PROMPT);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      pushLog(`connect FAILED: ${msg}`);
      stream.getTracks().forEach((t) => t.stop());
      setIsConnecting(false);
      setMessages((m) => [
        ...m,
        {
          role: "model",
          content: `couldn't open voice link ◇ ${msg.slice(0, 100)}`,
        },
      ]);
    }
  };

  // Keep the ref in sync each render so the auto-start effect can fire
  // toggleVoice without depending on render order.
  useEffect(() => {
    toggleVoiceRef.current = toggleVoice;
  });

  /* ── Text send (streaming) ────────────────────────────────────────── */
  const sendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    detectAndSetLanguage(textToSend);

    const userMessage: Msg = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (isLive && clientRef.current) {
      pushLog(`text via Live: "${textToSend.slice(0, 40)}"`);
      clientRef.current.sendText(textToSend);
      return;
    }

    setIsLoading(true);
    pushLog(`POST /api/chat → "${textToSend.slice(0, 40)}"`);
    // Build the API history:
    // 1. Drop empty placeholder bubbles (would produce {role:'model', content:''})
    // 2. Drop any leading model bubble — Gemini requires history to start with `user`,
    //    otherwise follow-up turns get silently rejected.
    let cleanHistory = [...messages, userMessage].filter(
      (m) => (m.content || "").trim().length > 0
    );
    while (cleanHistory.length && cleanHistory[0].role !== "user") {
      cleanHistory = cleanHistory.slice(1);
    }
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: cleanHistory, sessionId, memoryContext }),
      });

      pushLog(`HTTP ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errText = await response.text();
        pushLog(`error body: ${errText.slice(0, 200)}`);
        setMessages((p) => [
          ...p,
          { role: "model", content: `Error ${response.status}: ${errText.slice(0, 200)}` },
        ]);
        return;
      }

      if (!response.body) {
        setMessages((p) => [...p, { role: "model", content: "No response body" }]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";
      let receivedToolCalls: FunctionCall[] = [];

      setMessages((prev) => [...prev, { role: "model", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.text) {
              fullText += data.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].content = fullText;
                return updated;
              });
            }
            if (data.tool) {
              pushLog(`stream tool: ${data.tool.name} ${JSON.stringify(data.tool.args)}`);
              receivedToolCalls.push({
                name: data.tool.name,
                args: data.tool.args,
              });
            }
            if (data.error) {
              pushLog(`stream error: ${data.error}`);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].content =
                  fullText || `Error: ${data.error}`;
                return updated;
              });
            }
            if (data.done) {
              pushLog(`stream done (${fullText.length} chars, ${receivedToolCalls.length} tools)`);
            }
          } catch (e) {
            pushLog(`parse error: ${(e as Error).message} on "${line.slice(0, 60)}"`);
          }
        }
      }

      if (receivedToolCalls.length) onToolCall?.(receivedToolCalls);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      pushLog(`fetch error: ${msg}`);
      setMessages((prev) => [...prev, { role: "model", content: `Error: ${msg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  const statusText = isConnecting
    ? (locale === "tr" ? "◌ sese bağlanıyor..." : locale === "de" ? "◌ Sprachverbindung wird hergestellt..." : locale === "it" ? "◌ connessione voce in corso..." : "◌ connecting voice...")
    : isLive
    ? isSpeaking
      ? (locale === "tr" ? "🔊 SHOLÉ konuşuyor · bölmek için konuşun" : locale === "de" ? "🔊 SHOLÉ spricht · zum Unterbrechen sprechen" : locale === "it" ? "🔊 SHOLÉ parla · parla per interrompere" : "🔊 SHOLÉ speaking · just talk to interrupt")
      : (locale === "tr" ? "🔴 canlı ses · dinliyor" : locale === "de" ? "🔴 Live-Sprache · hört zu" : locale === "it" ? "🔴 voce in tempo reale · in ascolto" : "🔴 live voice · listening")
    : (locale === "tr" ? "◇ gemini tarafından destekleniyor" : locale === "de" ? "◇ unterstützt von gemini" : locale === "it" ? "◇ supportato da gemini" : "◇ powered by gemini");

  const interruptNow = () => {
    pushLog("user pressed interrupt → fading out audio");
    suppressUntilTurnRef.current = true;
    stopAudio();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed z-[100] flex flex-col transition-all duration-500 ease-in-out ${
        isExpanded
          ? "overflow-hidden inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-full md:w-[800px] md:h-[80vh] md:max-h-[800px] bg-gradient-to-br from-[#352A22] to-[#1A1410] md:rounded-[32px] md:border border-white/20 shadow-2xl"
          : "bottom-4 left-1/2 -translate-x-1/2 w-auto md:bottom-6 md:w-[680px] md:max-w-[calc(100vw-32px)] h-auto bg-[#E8DFCF]/45 supports-[backdrop-filter]:bg-[#E8DFCF]/30 md:supports-[backdrop-filter]:bg-[#E8DFCF]/40 backdrop-blur-xl border border-[#1C1814]/10 shadow-[0_8px_30px_-14px_rgba(28,24,20,0.35)] rounded-full"
      }`}
    >
      {/* Header for expanded view */}
      {isExpanded && (
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#D48C51] text-black font-serif flex items-center justify-center text-xl">S</div>
            <div className="flex flex-col">
              <span className="text-white font-medium text-sm tracking-wide">SHOLÉ</span>
              <span className="text-white/50 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full border border-white/50"></span>
                çevrimiçi • ai stilist
              </span>
            </div>
          </div>
          <button onClick={() => setIsExpanded(false)} className="text-white/50 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-mono flex items-center gap-1">
            önizleme <Sparkles size={10} />
          </button>
        </div>
      )}

      {/* Voice key warning */}
      {!hasVoiceKey && (
        <div className="bg-amber-500/90 text-white px-4 py-1 text-[10px] text-center shrink-0">
          Voice mode disabled: NEXT_PUBLIC_GEMINI_API_KEY is not set. Text chat works.
        </div>
      )}

      {/* Debug log panel */}
      {showLog && (
        <div className="bg-black/85 backdrop-blur-md text-green-400 font-mono text-[10px] px-3 py-2 max-h-[42vh] overflow-y-auto border-b border-green-900/50 shrink-0">
          <div className="flex justify-between items-center gap-2 mb-1 sticky top-0 bg-black/85 pb-1 z-10">
            <span className="text-green-300 font-bold">activity log ({logs.length})</span>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const text = logs.map((l) => `${l.ts} ${l.text}`).join("\n");
                  try {
                    await navigator.clipboard.writeText(text);
                    setLogCopied(true);
                    setTimeout(() => setLogCopied(false), 1500);
                  } catch {
                    // Fallback: select-all the panel so the user can Ctrl+C
                    const el = logScrollRef.current;
                    if (el) {
                      const range = document.createRange();
                      range.selectNodeContents(el);
                      const sel = window.getSelection();
                      sel?.removeAllRanges();
                      sel?.addRange(range);
                    }
                  }
                }}
                className="px-2 py-0.5 rounded bg-emerald-500 text-black font-bold text-[9px] hover:bg-emerald-400"
              >
                {logCopied ? "copied ✓" : "copy"}
              </button>
              <button onClick={() => setLogs([])} className="text-green-300 hover:text-white text-[9px]">clear</button>
            </div>
          </div>
          <div ref={logScrollRef} className="select-text">
            {logs.length === 0 && <div className="text-green-700">no activity yet...</div>}
            {logs.map((l, i) => <div key={i}><span className="text-green-700">{l.ts}</span> {l.text}</div>)}
          </div>
        </div>
      )}

      {/* ── İZLEME MODU AÇIK: flowing chat + product images ── */}
      {isExpanded && (
        <>
          {showMobileOverlay && (
            <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#352A22]/98 to-[#1A1410]/98 backdrop-blur-md text-center md:rounded-[32px] overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-[#D48C51]/10 flex items-center justify-center mb-6 border border-[#D48C51]/30 relative">
                {/* Pulsing ring */}
                <span className="absolute inset-0 rounded-full bg-[#D48C51]/20 animate-ping opacity-75"></span>
                <Mic size={36} className="text-[#D48C51] relative z-10" />
              </div>
              
              <h3 className="text-white text-xl font-serif tracking-wide mb-3">
                {locale === "tr" ? "Giriş Başarılı" : locale === "de" ? "Anmeldung erfolgreich" : locale === "it" ? "Accesso effettuato" : "Login Successful"}
              </h3>
              
              <p className="text-white/75 text-sm max-w-[280px] leading-relaxed mb-8">
                {locale === "tr" 
                  ? "SHOLÉ sesli stilist asistanını başlatmak ve mikrofon bağlantısını kurmak için lütfen dokunun." 
                  : locale === "de"
                  ? "Bitte tippen Sie, um die SHOLÉ KI-Stylistin zu starten und die Mikrofonverbindung herzustellen."
                  : locale === "it"
                  ? "Tocca per avviare lo stilista vocale AI SHOLÉ e stabilire la connessione al microfono."
                  : "Please tap to launch the SHOLÉ voice stylist assistant and establish a microphone connection."}
              </p>
              
              <button
                onClick={async () => {
                  setShowMobileOverlay(false);
                  await toggleVoice();
                }}
                className="w-full max-w-[260px] py-4 bg-[#D48C51] hover:bg-[#c37b42] active:scale-95 transition-all text-[#1C1814] font-medium rounded-full shadow-lg flex items-center justify-center gap-2 text-sm tracking-wider uppercase"
              >
                <Sparkles size={16} />
                {locale === "tr" ? "SESLİ ASİSTANI BAŞLAT" : locale === "de" ? "SPRACH-ASSISTENTIN STARTEN" : locale === "it" ? "AVVIA ASSISTENTE VOCALE" : "START VOICE ASSISTANT"}
              </button>
              
              <button
                onClick={() => {
                  setShowMobileOverlay(false);
                }}
                className="mt-4 text-white/50 hover:text-white text-xs tracking-wider uppercase font-mono py-2"
              >
                {locale === "tr" ? "Metin ile devam et" : locale === "de" ? "Mit Text fortfahren" : locale === "it" ? "Continua con testo" : "Continue with text"}
              </button>
            </div>
          )}
          <div className="flex-1 overflow-hidden flex flex-col relative bg-transparent min-h-[60px]">
            {isLive && isSpeaking && (
              <button
                onClick={interruptNow}
                className="absolute top-1 left-1/2 -translate-x-1/2 z-10 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-black transition-colors animate-pulse"
              >
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                interrupt
              </button>
            )}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar flex flex-col">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div
                    className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap shadow-sm backdrop-blur-md ${
                      m.role === "user"
                        ? "bg-[#D48C51] text-black ml-auto rounded-br-sm"
                        : "bg-white/10 text-white/90 border border-white/10 rounded-bl-sm mr-auto"
                    }`}
                  >
                    {m.content || (isLoading && i === messages.length - 1 ? "…" : "")}
                  </div>

                  {m.products && m.products.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 max-w-[90%] mr-auto pl-2">
                      {m.products.map(slug => {
                        const product = PRODUCTS.find(p => p.slug === slug);
                        if (!product) return null;
                        const imgSrc = `/images/products/${slug}.png`;
                        return (
                          <div key={slug} className="w-[120px] shrink-0 flex flex-col gap-2 cursor-pointer group" onClick={() => window.location.href = `/product/${slug}`}>
                            <div className="w-full aspect-[4/5] bg-white/5 rounded-xl overflow-hidden border border-white/10 relative">
                               <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-1 p-2">
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce bg-white/40" />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s] bg-white/40" />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s] bg-white/40" />
                </div>
              )}
            </div>
          </div>

          <div className="p-3 flex items-center gap-2 backdrop-blur-3xl shrink-0 bg-black/20 border-t border-white/10">
            <AIVoiceInput
              isActive={isLive}
              isConnecting={isConnecting}
              onStart={toggleVoice}
              onStop={toggleVoice}
              visualizerBars={32}
              className="py-0 shrink-0"
            />

            <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-1.5 border transition-all shadow-inner bg-white/5 border-white/10 focus-within:border-white/30 focus-within:bg-white/10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={isLive
                  ? (locale === "tr" ? "ses aktif · veya yazın" : "voice live · or type")
                  : labels.askShole + "..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 outline-none text-white placeholder-white/40"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="text-white disabled:opacity-30 transition-opacity"
              >
                <Send size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-1">
              <button
                onClick={() => setShowLog((v) => !v)}
                title="Activity log"
                className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-colors border ${
                  showLog
                    ? "bg-emerald-400 text-black border-emerald-400"
                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Terminal size={12} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── İZLEME MODU KAPALI: sade & elegant bar (site paletinde) ── */}
      {!isExpanded && (
        <div className="flex items-center gap-1 md:gap-2 px-1.5 md:px-3 py-1 md:py-2">
          {/* Sohbeti durdur — AI konuşurken belirir (yarı-dubleks: sesle kesilemez) */}
          {isLive && (
            <button
              onClick={isSpeaking ? interruptNow : toggleVoice}
              title={locale === "tr" ? "Sohbeti durdur" : "Stop conversation"}
              className="absolute left-1/2 -translate-x-1/2 -top-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9E3B2E] text-white text-[10px] font-medium tracking-wide shadow-[0_6px_18px_-6px_rgba(158,59,46,0.7)] hover:bg-[#8a3328] transition-colors"
            >
              <Square size={9} fill="currentColor" /> {locale === "tr" ? "durdur" : "stop"}
            </button>
          )}

          {/* Marka — dokununca izleme modunu açar */}
          <button
            onClick={() => setIsExpanded(true)}
            title={locale === "tr" ? "İzleme modunu aç" : "Open watch mode"}
            className="flex items-center gap-2 shrink-0"
          >
            <span className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#C77A2D] text-[#1C1814] font-serif flex items-center justify-center text-xs md:text-sm shadow-inner shrink-0">S</span>
            <span className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-[#1C1814] text-[12px] font-medium tracking-wide">SHOLÉ</span>
              <span className="text-[#1C1814]/50 text-[8px] font-mono uppercase tracking-[0.15em] flex items-center gap-1">
                <span className={`w-1 h-1 rounded-full ${isLive ? "bg-[#C77A2D] animate-pulse" : "border border-[#1C1814]/40"}`} />
                {isLive
                  ? (isSpeaking ? (locale === "tr" ? "konuşuyor" : "speaking") : (locale === "tr" ? "dinliyor" : "listening"))
                  : (locale === "tr" ? "ai stilist" : "ai stylist")}
              </span>
            </span>
          </button>

          {/* Metin girişi — mobilde gizli (sadece konuşma); açmak için izleme moduna geç */}
          <div className="hidden md:flex flex-1 min-w-0 items-center gap-1.5 rounded-full px-2.5 md:px-3.5 py-0.5 md:py-1 bg-white/45 border border-[#1C1814]/10 focus-within:border-[#C77A2D]/50 focus-within:bg-white/70 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={isLive
                ? (locale === "tr" ? "ses aktif · veya yazın" : "voice live · or type")
                : labels.askShole + "..."}
              className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-sm py-1 outline-none text-[#1C1814] placeholder-[#1C1814]/40"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="text-[#1C1814] disabled:opacity-30 transition-opacity"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Mikrofon + sinyal animasyonu (kompakt) */}
          <AIVoiceInput
            compact
            isSpeaking={isSpeaking}
            isActive={isLive}
            isConnecting={isConnecting}
            onStart={toggleVoice}
            onStop={toggleVoice}
            visualizerBars={9}
            className="shrink-0"
          />

          {/* İzleme modunu aç */}
          <button
            onClick={() => setIsExpanded(true)}
            title={locale === "tr" ? "İzleme modu" : "Watch mode"}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider border border-[#1C1814]/15 text-[#1C1814]/70 hover:bg-[#1C1814]/5 hover:text-[#1C1814] transition-colors shrink-0"
          >
            <Sparkles size={10} /> {locale === "tr" ? "izle" : "watch"} <ChevronUp size={11} />
          </button>

          {/* Log — mobilde collapsed'da gizli (sade); izleme modunda erişilebilir */}
          <button
            onClick={() => setShowLog((v) => !v)}
            title="Activity log"
            className={`hidden md:flex items-center px-1.5 py-1.5 rounded-full transition-colors border shrink-0 ${
              showLog
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-[#1C1814]/8 text-[#1C1814]/70 border-[#1C1814]/20 hover:bg-[#1C1814]/15 hover:text-[#1C1814]"
            }`}
          >
            <Terminal size={13} />
          </button>

          {/* Kapat */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1C1814]/10 text-[#1C1814]/60 hover:text-[#1C1814] transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function FloatingLauncher({
  onClick,
  label = "Ask Sholé",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: [0, -3, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.5, ease: "easeOut" },
        scale: { duration: 0.5, ease: "easeOut" },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="group fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex items-center justify-center w-10 h-10 md:w-auto md:px-5 md:py-3 md:h-12 rounded-full overflow-hidden bg-white/20 md:bg-white/40 dark:bg-black/25 md:dark:bg-black/40 backdrop-blur-md shadow-sm md:shadow-lg border border-white/25 md:border-white/40"
    >
      <span className="relative flex items-center justify-center gap-2">
        <Sparkles size={16} className="text-black dark:text-white md:mr-1 md:w-5 md:h-5 opacity-80 md:opacity-100" />
        <span
          className="hidden md:inline-block font-sans text-sm font-medium text-black dark:text-white"
        >
          {label}
        </span>

        {/* live dot — desktop only for a cleaner mobile look */}
        <motion.span
          className="hidden md:block absolute right-0 top-0 w-2 h-2 rounded-full bg-green-500 border-2 border-white dark:border-black md:-right-2 md:-top-1"
          animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.button>
  );
}
