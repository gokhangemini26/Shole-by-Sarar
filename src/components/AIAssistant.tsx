"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Mic, MicOff, Send, Terminal, AlertTriangle } from "lucide-react";
import { GeminiLiveClient, FunctionCall } from "@/lib/gemini-live";
import { PRODUCTS } from "@/lib/products";

function buildLiveSystemPrompt() {
  const productList = PRODUCTS.map(
    (p, i) =>
      `${i + 1}. ${p.name} — ${p.subtitle}, ${p.price}. slug: '${p.slug}'`
  ).join("\n");

  return `You are SHOLÉ (sho-LAY), the AI fashion stylist for SHOLÉ by SARAR — a modern Turkish luxury house in Istanbul, founded 1947.

PERSONALITY: Warm, witty, casually confident. Reply in the user's language, keep answers short (1-3 sentences).

═══ TOOL-USE RULES (NON-NEGOTIABLE) ═══
- When the customer mentions a SPECIFIC product, CALL show_product(product_id) using the EXACT slug from the catalog below. NEVER invent a slug — only use slugs listed.
- When asked about a CATEGORY (women / accessories / shoes / tailoring / journal), CALL navigate_category.
- When asked for an OUTFIT/COMBINATION, CALL recommend_outfit AND show_product for the hero piece.
- NEVER mention tool/function names in your spoken reply.

═══ CATALOG (Spring/Summer 2026) ═══
${productList}

Free shipping over €200; Made in Istanbul; Sizes XS–XL.`;
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
}: {
  open: boolean;
  onClose: () => void;
  onToolCall?: ToolCallHandler;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "model", content: "Welcome to SHOLÉ. How can I help you today?" },
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
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef(0);

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

  /* ── Cleanup ───────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      clientRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      workletRef.current?.disconnect();
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

  const playNextAudio = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsSpeaking(true);
    const b64 = audioQueueRef.current.shift()!;
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
    activeSourceRef.current = src;
    const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
    nextStartTimeRef.current = startAt + buf.duration;
    src.onended = () => {
      activeSourceRef.current = null;
      isPlayingRef.current = false;
      // Only mark "no longer speaking" if the queue is also empty —
      // otherwise the next chunk in the queue will resume immediately.
      if (audioQueueRef.current.length === 0) setIsSpeaking(false);
      playNextAudio();
    };
    src.start(startAt);
  }, [getOutputCtx]);

  const stopAudio = useCallback(() => {
    try {
      activeSourceRef.current?.stop();
    } catch {}
    activeSourceRef.current = null;
    isPlayingRef.current = false;
    audioQueueRef.current = [];
    nextStartTimeRef.current = 0;
    setIsSpeaking(false);
  }, []);

  /* ── Mic capture ──────────────────────────────────────────────────── */
  const startMicCapture = useCallback(
    async (stream: MediaStream) => {
      streamRef.current = stream;
      const ctx = getInputCtx();
      if (ctx.state === "suspended") await ctx.resume();

      try {
        await ctx.audioWorklet.addModule("/audio-processor.js");
      } catch (e) {
        // already registered
        void e;
      }

      const source = ctx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(ctx, "pcm-processor");

      let chunkCount = 0;
      let mutedCount = 0;
      worklet.port.onmessage = (e) => {
        if (e.data.type === "level") {
          // Don't show mic-level animation while AI is talking either
          setAudioLevel(isPlayingRef.current ? 0 : e.data.level);
        } else if (e.data.type === "audio") {
          // Echo-cancellation: while the AI's audio is playing through speakers
          // the mic picks it up and the model would treat it as user speech,
          // creating a feedback loop. Drop those chunks.
          if (isPlayingRef.current || audioQueueRef.current.length > 0) {
            mutedCount++;
            if (mutedCount === 1 || mutedCount % 100 === 0) {
              pushLog(`mic muted while AI speaks (${mutedCount} chunks dropped)`);
            }
            return;
          }
          const u8 = new Uint8Array(e.data.buffer);
          let bin = "";
          for (let i = 0; i < u8.byteLength; i++)
            bin += String.fromCharCode(u8[i]);
          const b64 = btoa(bin);
          clientRef.current?.sendAudio(b64);
          chunkCount++;
          if (chunkCount === 1 || chunkCount % 50 === 0) {
            pushLog(`mic → sent ${chunkCount} chunk(s) (last ${u8.byteLength}b)`);
          }
        }
      };

      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      source.connect(worklet);
      worklet.connect(silentGain);
      silentGain.connect(ctx.destination);
      workletRef.current = worklet;
      pushLog(`mic capture active (sampleRate=${ctx.sampleRate})`);
    },
    [getInputCtx, pushLog]
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
      workletRef.current?.disconnect();
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
      systemInstruction: buildLiveSystemPrompt(),
      onLog: pushLog,
      onOpen: () => {
        pushLog("Live onOpen → starting mic");
        startMicCapture(stream).catch((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          pushLog(`mic start error: ${msg}`);
        });
      },
      onAudioData: (data) => {
        audioQueueRef.current.push(data);
        playNextAudio();
      },
      onTranscription: (text, isUser) => {
        setMessages((p) => [
          ...p.slice(-30),
          { role: isUser ? "user" : "model", content: text },
        ]);
      },
      onToolCall: handleToolCall,
      onInterrupted: () => {
        audioQueueRef.current = [];
        stopAudio();
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
    // Drop empty placeholder bubbles so we never send `{role:'model', content:''}` to Gemini —
    // the API rejects empty assistant turns and produces low-quality follow-ups.
    const cleanHistory = [...messages, userMessage].filter(
      (m) => (m.content || "").trim().length > 0
    );
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
    ? "◌ connecting voice..."
    : isLive
    ? isSpeaking
      ? "🔊 SHOLÉ speaking · mic paused"
      : "🔴 live voice · listening"
    : "◇ powered by gemini";

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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowLog((v) => !v)}
            title="Activity log"
            className={`p-2 rounded-full transition-colors ${
              showLog ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Terminal size={16} />
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

      {/* Messages */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
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
              placeholder={isLive ? "voice live · or type" : "Ask me anything..."}
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
      ASK SHOLÉ
    </button>
  );
}
