"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Mic, MicOff, Send, Terminal, AlertTriangle } from "lucide-react";
import { GeminiLiveClient, FunctionCall } from "@/lib/gemini-live";
import { startVADMic, type VADMicHandle } from "@/lib/vad-mic";
import { PRODUCTS } from "@/lib/products";
import { getLabels } from "@/lib/i18n";

function buildLiveSystemPrompt(locale: string) {
  const productList = PRODUCTS.map(
    (p, i) => {
      const name = locale === "tr" && p.name_tr ? p.name_tr : p.name;
      const subtitle = locale === "tr" && p.subtitle_tr ? p.subtitle_tr : p.subtitle;
      return `${i + 1}. ${name} — ${subtitle}, ${p.price}. slug: '${p.slug}'`;
    }
  ).join("\n");

  return `You are SHOLÉ, the in-store AI stylist for SHOLÉ by SARAR (Istanbul, 1944).
Current interface language: ${locale}.

VOICE STYLE — strict, this is a phone-call conversation:
- ONE sentence per turn. Two max. Never lecture.
- Calm, polished, professional. Not chatty, not casual filler.
- Reply in the customer's language. Match formality.
- No greeting filler after the first turn ("of course", "absolutely" once is fine, then drop it).
- After answering, end with a SHORT question that moves the sale forward — not exposition.

TOOLS — call them silently, never mention names:
- Customer mentions a specific item → CALL show_product with the exact slug.
- Customer asks for a category → CALL navigate_category (women / accessories / shoes / tailoring / journal).
- Customer asks for an outfit → CALL recommend_outfit AND show_product for the hero piece.
- NEVER invent a slug; only use the catalog below.

CATALOG (Spring/Summer 2026):
${productList}

Free shipping over €200. Made in Istanbul. Sizes XS–XL.`;
}

type Msg = { role: "user" | "model"; content: string };
type LogLine = { ts: string; text: string };

const MAX_LOG_LINES = 200;

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
  const [audioLevel, setAudioLevel] = useState(0);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [showLog, setShowLog] = useState(false);

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
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef(0);
  // After a barge-in we keep dropping incoming chunks until Gemini sends
  // turnComplete — otherwise the ~1 s of in-flight audio still arrives,
  // gets scheduled, and produces the choppy start/stop pattern.
  const suppressUntilTurnRef = useRef(false);
  // Time we want playback to start ahead of currentTime to absorb network
  // jitter — small enough that the user doesn't notice the latency, large
  // enough that arriving chunks rarely 'catch up' to the play head.
  const PLAYBACK_LEAD_S = 0.15;

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

  /* ── Mic gain ducking — soften echo while AI talks ────────────────── */
  useEffect(() => {
    const gain = micGainRef.current;
    if (!gain) return;
    const ctx = inputCtxRef.current;
    if (!ctx) return;
    // -22 dB during AI playback — speaker echo at this level rarely clears
    // Silero's positive threshold even with the noisiest laptops.
    const target = isSpeaking ? 0.08 : 1.0;
    // Smooth 30 ms ramp avoids audible pops
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.03);
  }, [isSpeaking]);

  /* ── Cleanup ───────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      clientRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      vadHandleRef.current?.destroy().catch(() => {});
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

  // Schedule a chunk on the AudioContext clock the moment it arrives — no
  // serial 'isPlaying' gate. Web Audio plays sources back-to-back at
  // sample-accurate boundaries as long as we keep advancing
  // nextStartTimeRef, so chunks splice seamlessly even if their JS-level
  // arrival is jittery.
  const scheduleAudioChunk = useCallback(
    async (b64: string) => {
      const ctx = getOutputCtx();
      if (ctx.state === "suspended") await ctx.resume().catch(() => {});

      const bin = atob(b64);
      const bytes = new Int16Array(bin.length / 2);
      for (let i = 0; i < bin.length; i += 2)
        bytes[i / 2] = (bin.charCodeAt(i + 1) << 8) | bin.charCodeAt(i);
      const f32 = new Float32Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) f32[i] = bytes[i] / 32768.0;
      const buf = ctx.createBuffer(1, f32.length, 24000);
      buf.getChannelData(0).set(f32);

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);

      // First chunk of this turn? Add the lead buffer so the play head
      // starts a comfortable distance ahead of currentTime.
      const earliest = ctx.currentTime + PLAYBACK_LEAD_S;
      const startAt = Math.max(earliest, nextStartTimeRef.current);
      nextStartTimeRef.current = startAt + buf.duration;

      scheduledSourcesRef.current.push(src);
      isPlayingRef.current = true;
      setIsSpeaking(true);

      src.onended = () => {
        scheduledSourcesRef.current = scheduledSourcesRef.current.filter(
          (s) => s !== src
        );
        if (scheduledSourcesRef.current.length === 0) {
          isPlayingRef.current = false;
          setIsSpeaking(false);
          nextStartTimeRef.current = 0;
        }
      };

      src.start(startAt);
    },
    [getOutputCtx]
  );

  const stopAudio = useCallback(() => {
    for (const s of scheduledSourcesRef.current) {
      try {
        s.stop();
      } catch {}
    }
    scheduledSourcesRef.current = [];
    isPlayingRef.current = false;
    audioQueueRef.current = [];
    nextStartTimeRef.current = 0;
    setIsSpeaking(false);
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
          // Belt-and-braces echo guard: the duck cuts amplitude (and the
          // VAD probability with it); when AI is playing we additionally
          // require >0.92 confidence before counting as user speech.
          isAISpeaking: () =>
            isPlayingRef.current || audioQueueRef.current.length > 0,
          aiPlaybackThreshold: 0.97,
          onSpeechStart: () => {
            if (isPlayingRef.current || audioQueueRef.current.length > 0) {
              pushLog("local interrupt → clearing AI audio queue");
              suppressUntilTurnRef.current = true;
              audioQueueRef.current = [];
              stopAudio();
            }
          },
          onSpeechFrameB64: (b64) => {
            clientRef.current?.sendAudio(b64);
          },
        });
        vadHandleRef.current = handle;
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
    // Auto-open the log panel during voice connection so the user can see
    // VAD heartbeats, mic level, and any errors without hunting for the
    // log button.
    setShowLog(true);

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
      systemInstruction: buildLiveSystemPrompt(locale),
      onLog: pushLog,
      onOpen: () => {
        pushLog("Live onOpen → starting mic");
        startMicCapture(stream).catch((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          pushLog(`mic start error: ${msg}`);
        });
      },
      onAudioData: (data) => {
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
        setMessages((p) => [
          ...p.slice(-30),
          { role: isUser ? "user" : "model", content: text },
        ]);
      },
      onToolCall: handleToolCall,
      onInterrupted: () => {
        suppressUntilTurnRef.current = true;
        audioQueueRef.current = [];
        stopAudio();
      },
      onTurnComplete: () => {
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
      clientRef.current.triggerGreeting(
        "Greet the customer warmly in their language and ask how you can help them shop today."
      );
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
    pushLog("user pressed interrupt → clearing audio queue");
    audioQueueRef.current = [];
    stopAudio();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 w-full max-w-[440px] max-h-[85vh] flex flex-col bg-white border border-gray-200 shadow-2xl rounded-[32px] overflow-hidden z-[100]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b bg-black text-white">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold transition-transform"
            style={{ transform: isLive ? `scale(${1 + audioLevel * 0.2})` : "none" }}
          >
            S
          </div>
          <div>
            <h3 className="font-bold text-sm">SHOLÉ Personal Shopper</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              {statusText}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLog((v) => !v)}
            title="Activity log"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
              showLog
                ? "bg-emerald-400 text-black border-emerald-400"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }`}
          >
            <Terminal size={12} />
            LOG
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Voice key warning */}
      {!hasVoiceKey && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-900 leading-snug">
            Voice mode disabled: <code>NEXT_PUBLIC_GEMINI_API_KEY</code> is not set on this deployment.
            Text chat works. Add the env var in Vercel → Project Settings → Environment Variables and redeploy.
          </div>
        </div>
      )}

      {/* Debug log panel */}
      {showLog && (
        <div className="bg-black text-green-400 font-mono text-[10px] px-3 py-2 max-h-[160px] overflow-y-auto border-b border-green-900">
          <div className="flex justify-between items-center mb-1 sticky top-0 bg-black pb-1">
            <span className="text-green-300 font-bold">activity log ({logs.length})</span>
            <button
              onClick={() => setLogs([])}
              className="text-green-300 hover:text-white text-[9px]"
            >
              clear
            </button>
          </div>
          <div ref={logScrollRef}>
            {logs.length === 0 && (
              <div className="text-green-700">no activity yet — interact with the assistant.</div>
            )}
            {logs.map((l, i) => (
              <div key={i}>
                <span className="text-green-700">{l.ts}</span> {l.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live mode hint — once, when voice is open */}
      {isLive && !isSpeaking && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 text-[10px] text-emerald-900 text-center">
          ✦ tip: use headphones for the cleanest barge-in (mic stays open while SHOLÉ speaks)
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50 relative">
        {isLive && isSpeaking && (
          <button
            onClick={interruptNow}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black text-white text-[11px] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors animate-pulse"
          >
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
            tap to interrupt
          </button>
        )}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-black text-white ml-auto"
                  : "bg-white border shadow-sm"
              }`}
            >
              {m.content || (isLoading && i === messages.length - 1 ? "…" : "")}
            </div>
          ))}
          {isLoading &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-1 p-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoice}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isLive
                ? "bg-red-500 text-white animate-pulse"
                : isConnecting
                ? "bg-amber-400 text-white"
                : "bg-black text-white"
            }`}
          >
            {isLive ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-black transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={isLive 
                ? (locale === "tr" ? "ses aktif · veya yazın" : "voice live · or type") 
                : labels.askShole + "..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="text-black disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FloatingLauncher({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-black text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold hover:scale-105 transition-all"
    >
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      {onClick && typeof window !== 'undefined' ? (window as any).__shole_label_ask || 'ASK SHOLÉ' : 'ASK SHOLÉ'}
    </button>
  );
}
