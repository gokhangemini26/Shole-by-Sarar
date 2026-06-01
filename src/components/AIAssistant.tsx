"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Mic, MicOff, Send, Terminal, AlertTriangle, Sparkles } from "lucide-react";
import { GeminiLiveClient, FunctionCall } from "@/lib/gemini-live";
import { startVADMic, type VADMicHandle } from "@/lib/vad-mic";
import { PRODUCTS } from "@/lib/products";
import { getLabels } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { getAIMemoryContext, createChatSession, logChatMessage } from "@/lib/supabase/tracking";

function buildLiveSystemPrompt(locale: string, memoryContext: string) {
  const productList = PRODUCTS.map(
    (p, i) => {
      const name = locale === "tr" && p.name_tr ? p.name_tr : p.name;
      const subtitle = locale === "tr" && p.subtitle_tr ? p.subtitle_tr : p.subtitle;
      return `${i + 1}. ${name} — ${subtitle}, ${p.price}. slug: '${p.slug}'`;
    }
  ).join("\n");

  return `You are SHOLÉ, the in-store AI stylist for SHOLÉ (Istanbul, digital-first since 2026).
Current interface language: ${locale}.

VOICE STYLE — strict, this is a phone-call conversation:
- ONE sentence per turn. Two max. Never lecture.
- Calm, polished, professional. Not chatty, not casual filler.
- Reply in the customer's language. Match formality.
- No greeting filler after the first turn ("of course", "absolutely" once is fine, then drop it).
- DO NOT ask too many questions to avoid overwhelming the user. Limit yourself to 2-3 questions max during the entire conversation.
- After 2-3 questions, switch to passive prompts. Summarize what has been done and ask for their thoughts. For example: "So far we've looked at these options. I'd love to hear your thoughts before we explore further," or "I'm open to your suggestions and would love to continue with more suitable choices based on your feedback."
- When you do ask a question early on, make it a SHORT question that moves the sale forward.

TOOLS — call them silently, never mention names:
- Customer mentions a specific item → CALL show_product with the exact slug.
- Customer asks for a category → CALL navigate_category (women / accessories / shoes / tailoring / journal).
- Customer asks for an outfit → CALL recommend_outfit AND show_product for the hero piece.
- NEVER invent a slug; only use the catalog below.

CATALOG (Spring/Summer 2026):
${productList}

Free shipping over €200. Made in Istanbul. Sizes XS–XL.

${memoryContext}`;
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
}: {
  open: boolean;
  onClose: () => void;
  onToolCall?: ToolCallHandler;
  locale?: string;
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [memoryContext, setMemoryContext] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const currentBotTranscriptRef = useRef("");
  const currentUserTranscriptRef = useRef("");

  useEffect(() => {
    async function initMemory() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const ctx = await getAIMemoryContext(user.id);
        setMemoryContext(ctx);
        const sid = await createChatSession(user.id);
        setSessionId(sid);
      }
    }
    initMemory();
  }, []);

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
    if (isLive || isConnecting) return;
    autoStartedRef.current = true;
    // Defer to next tick so the dialog's intro animation isn't competing
    // with the AudioContext + WebSocket setup.
    const t = setTimeout(() => {
      toggleVoiceRef.current?.();
    }, 200);
    return () => clearTimeout(t);
  }, [open, hasVoiceKey, isLive, isConnecting]);

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
    const target = (isSpeaking || isTurnActive) ? 0.08 : 1.0;
    // Smooth 30 ms ramp avoids audible pops
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.03);
  }, [isSpeaking, isTurnActive]);

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

              // Audio just stopped but turn hasn't completed yet —
              // start a safety timer to release the echo guard.
              if (wasPlaying && !msg.isPlaying && turnActiveRef.current) {
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
              // New audio arrived — cancel any pending safety release.
              if (!wasPlaying && msg.isPlaying && echoGuardTimerRef.current) {
                clearTimeout(echoGuardTimerRef.current);
                echoGuardTimerRef.current = null;
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
      const buf = bytes.buffer.slice(0); // transfer-safe copy
      node.port.postMessage({ type: "pcm", data: buf }, [buf]);
      isPlayingRef.current = true;
      setIsSpeaking(true);
    },
    [ensurePlayerNode]
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
          // Keep echo guard active during the entire AI turn to survive mid-turn buffer underruns and gaps between sentences.
          isAISpeaking: () => isPlayingRef.current || turnActiveRef.current,
          aiPlaybackThreshold: 0.92,
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
        pushLog("VAD loaded and running ✓ — triggering bot greeting");
        clientRef.current?.triggerGreeting(
          "Greet the customer warmly in their language and ask how you can help them shop today."
        );
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
        body: JSON.stringify({ messages: cleanHistory }),
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
    ? (locale === "tr" ? "◌ sese bağlanıyor..." : "◌ connecting voice...")
    : isLive
    ? isSpeaking
      ? (locale === "tr" ? "🔊 SHOLÉ konuşuyor · bölmek için konuşun" : "🔊 SHOLÉ speaking · just talk to interrupt")
      : (locale === "tr" ? "🔴 canlı ses · dinliyor" : "🔴 live voice · listening")
    : (locale === "tr" ? "◇ gemini tarafından destekleniyor" : "◇ powered by gemini");

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
      className={`fixed z-[100] flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
        isExpanded
          ? "inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-full md:w-[800px] md:h-[80vh] md:max-h-[800px] bg-gradient-to-br from-[#352A22] to-[#1A1410] md:rounded-[32px] md:border border-white/20 shadow-2xl"
          : "bottom-0 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[760px] h-auto max-h-[25vh] md:max-h-[20vh] bg-white/50 backdrop-blur-2xl border-t md:border border-white/50 shadow-2xl md:rounded-[32px]"
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

      {/* Debug log panel (Hidden on Mobile) */}
      {showLog && (
        <div className="hidden md:block bg-black/80 backdrop-blur-md text-green-400 font-mono text-[10px] px-3 py-2 max-h-[100px] overflow-y-auto border-b border-green-900/50 shrink-0">
          <div className="flex justify-between items-center mb-1 sticky top-0 bg-transparent pb-1">
            <span className="text-green-300 font-bold">activity log ({logs.length})</span>
            <button onClick={() => setLogs([])} className="text-green-300 hover:text-white text-[9px]">clear</button>
          </div>
          <div ref={logScrollRef}>
            {logs.length === 0 && <div className="text-green-700">no activity yet...</div>}
            {logs.map((l, i) => <div key={i}><span className="text-green-700">{l.ts}</span> {l.text}</div>)}
          </div>
        </div>
      )}

      {/* Messages / Horizontal Flow */}
      <div 
        className={`flex-1 overflow-hidden flex flex-col relative bg-transparent min-h-[60px] ${!isExpanded ? "cursor-pointer" : ""}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {isLive && isSpeaking && (
          <button
            onClick={interruptNow}
            className="absolute top-1 left-1/2 -translate-x-1/2 z-10 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-black transition-colors animate-pulse"
          >
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
            interrupt
          </button>
        )}
        <div ref={chatScrollRef} className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar flex flex-col ${!isExpanded && "justify-end pb-2"}`}>
          {(isExpanded ? messages : messages.slice(-3)).map((m, i) => (
            <div key={i} className={`flex flex-col gap-2 ${!isExpanded && "mb-0 space-y-0"}`}>
              <div
                className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap shadow-sm backdrop-blur-md ${
                  m.role === "user"
                    ? (isExpanded ? "bg-[#D48C51] text-black ml-auto rounded-br-sm" : "bg-black/80 text-white ml-auto rounded-br-sm")
                    : (isExpanded ? "bg-white/10 text-white/90 border border-white/10 rounded-bl-sm mr-auto" : "bg-white/80 border border-white/40 text-black rounded-bl-sm mr-auto")
                }`}
              >
                {m.content || (isLoading && i === (isExpanded ? messages.length : messages.slice(-3).length) - 1 ? "…" : "")}
              </div>
              
              {isExpanded && m.products && m.products.length > 0 && (
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
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isExpanded ? "bg-white/40" : "bg-black/40"}`} />
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s] ${isExpanded ? "bg-white/40" : "bg-black/40"}`} />
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s] ${isExpanded ? "bg-white/40" : "bg-black/40"}`} />
            </div>
          )}
        </div>
      </div>

      {/* Footer / Input Bar */}
      <div className={`p-3 flex items-center gap-2 backdrop-blur-3xl shrink-0 ${
        isExpanded ? "bg-black/20 border-t border-white/10" : "bg-white/40 border-t border-white/30"
      }`}>
        {/* Status Indicator */}
        <div className="hidden md:flex flex-col justify-center items-center mr-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-transform ${isExpanded ? "bg-white/10 text-white" : "bg-black text-white"}`}
            style={{ transform: isLive ? `scale(${1 + audioLevel * 0.2})` : "none" }}
          >
            S
          </div>
        </div>

        <button
          onClick={toggleVoice}
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all shadow-sm ${
            isLive
              ? "bg-red-500 text-white animate-pulse shadow-red-500/30"
              : isConnecting
              ? "bg-amber-400 text-white"
              : isExpanded ? "bg-white/10 text-white hover:bg-white/20" : "bg-black text-white"
          }`}
        >
          {isLive ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <div className={`flex-1 flex items-center gap-2 rounded-full px-4 py-1.5 border transition-all shadow-inner ${
          isExpanded ? "bg-white/5 border-white/10 focus-within:border-white/30 focus-within:bg-white/10" : "bg-white/60 border-white/50 focus-within:border-black/20 focus-within:bg-white/80"
        }`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isLive 
              ? (locale === "tr" ? "ses aktif · veya yazın" : "voice live · or type") 
              : labels.askShole + "..."}
            className={`flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 outline-none ${
              isExpanded ? "text-white placeholder-white/40" : "text-black placeholder-black/50"
            }`}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className={`${isExpanded ? "text-white" : "text-black"} disabled:opacity-30 transition-opacity`}
          >
            <Send size={16} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <button
            onClick={() => setShowLog((v) => !v)}
            title="Activity log"
            className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-colors border ${
              showLog
                ? "bg-emerald-400 text-black border-emerald-400"
                : isExpanded ? "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white" : "bg-white/30 text-black/70 border-white/40 hover:bg-white/50"
            }`}
          >
            <Terminal size={12} />
          </button>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isExpanded ? "hover:bg-white/10 text-white/50 hover:text-white" : "hover:bg-black/10 text-black/70"
            }`}
          >
            <X size={18} />
          </button>
        </div>
      </div>
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
      className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 md:w-auto md:px-5 md:py-3 md:h-12 rounded-full overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-lg border border-white/40"
    >
      <span className="relative flex items-center justify-center gap-2">
        <Sparkles size={20} className="text-black dark:text-white md:mr-1" />
        <span
          className="hidden md:inline-block font-sans text-sm font-medium text-black dark:text-white"
        >
          {label}
        </span>
        
        {/* live dot */}
        <motion.span
          className="absolute right-0 top-0 w-2 h-2 rounded-full bg-green-500 border-2 border-white dark:border-black md:-right-2 md:-top-1"
          animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.button>
  );
}
