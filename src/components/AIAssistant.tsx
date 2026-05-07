"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, ShoppingBag, ShoppingCart, ArrowRight } from "lucide-react";
import { GeminiLiveClient, FunctionCall } from "@/lib/gemini-live";
import { db, Product } from "@/lib/mock-db";

export function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  const clientRef = useRef<GeminiLiveClient | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clientRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      workletRef.current?.disconnect();
      inputCtxRef.current?.close().catch(() => {});
      outputCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const getInputCtx = useCallback(() => {
    if (!inputCtxRef.current) inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
    return inputCtxRef.current;
  }, []);

  const getOutputCtx = useCallback(() => {
    if (!outputCtxRef.current) outputCtxRef.current = new AudioContext({ sampleRate: 24000 });
    return outputCtxRef.current;
  }, []);

  const playNextAudio = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) return;
    isPlayingRef.current = true;
    const b64 = audioQueueRef.current.shift()!;
    const ctx = getOutputCtx();
    if (ctx.state === "suspended") await ctx.resume().catch(() => {});
    const bin = atob(b64);
    const bytes = new Int16Array(bin.length / 2);
    for (let i = 0; i < bin.length; i += 2) bytes[i / 2] = (bin.charCodeAt(i + 1) << 8) | bin.charCodeAt(i);
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
      playNextAudio();
    };
    src.start(startAt);
  }, [getOutputCtx]);

  const stopAudio = useCallback(() => {
    try { activeSourceRef.current?.stop(); } catch {}
    activeSourceRef.current = null;
    isPlayingRef.current = false;
    audioQueueRef.current = [];
    nextStartTimeRef.current = 0;
  }, []);

  const handleToolCall = useCallback((calls: FunctionCall[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responses: any[] = [];

    calls.forEach((call) => {
      let resultData: unknown = { success: true };

      if (call.name === "search_products") {
        const { query, category, price_range } = call.args as any;
        const results = db.searchProducts(query, category, price_range);
        setDisplayedProducts(results);
        resultData = { found: results.length, products: results.map(p => ({ id: p.id, name: p.name, price: p.price })) };
      } 
      else if (call.name === "get_product_details") {
        const { product_id } = call.args as any;
        const details = db.getProductDetails(product_id);
        if (details) setDisplayedProducts([details]);
        resultData = details || { error: "Product not found" };
      }
      else if (call.name === "suggest_style_combo") {
        const { base_product_id } = call.args as any;
        const combos = db.getStyleCombos(base_product_id);
        setDisplayedProducts(combos);
        resultData = { combosFound: combos.length, products: combos.map(p => p.name) };
      }
      else if (call.name === "navigate_to_product_page") {
        const { product_id } = call.args as any;
        const details = db.getProductDetails(product_id);
        if (details) setDisplayedProducts([details]);
        // Simulate routing change
        console.log("Navigating to product page:", product_id);
        resultData = { success: true, navigatedTo: product_id };
      }
      else if (call.name === "add_to_cart") {
        const { product_id } = call.args as any;
        console.log("Added to cart:", product_id);
        resultData = { success: true, added: product_id };
      }

      responses.push({ id: call.id, name: call.name, response: resultData });
    });

    clientRef.current?.sendToolResponse(responses);
  }, []);

  const startMicCapture = useCallback(async (stream: MediaStream) => {
    streamRef.current = stream;
    const ctx = getInputCtx();
    if (ctx.state === "suspended") await ctx.resume();

    try {
      await ctx.audioWorklet.addModule("/audio-processor.js");
    } catch {
      // module might already be added
    }

    const source = ctx.createMediaStreamSource(stream);
    const worklet = new AudioWorkletNode(ctx, "pcm-processor");

    worklet.port.onmessage = (e) => {
      if (e.data.type === "level") {
        setAudioLevel(e.data.level);
      } else if (e.data.type === "audio") {
        const bytes = new Uint8Array(e.data.buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        const b64 = btoa(binary);
        clientRef.current?.sendAudio(b64);
      }
    };

    const silentGain = ctx.createGain();
    silentGain.gain.value = 0;
    source.connect(worklet);
    worklet.connect(silentGain);
    silentGain.connect(ctx.destination);
    workletRef.current = worklet;
  }, [getInputCtx]);

  const toggleVoice = async () => {
    if (isLive || isConnecting) {
      clientRef.current?.close();
      clientRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      workletRef.current?.disconnect();
      setIsLive(false);
      setIsConnecting(false);
      setAudioLevel(0);
      stopAudio();
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (e) {
      console.error("Mic error:", e);
      return;
    }

    setIsConnecting(true);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

    clientRef.current = new GeminiLiveClient(apiKey, {
      onOpen: () => {
        startMicCapture(stream);
      },
      onAudioData: (data) => {
        audioQueueRef.current.push(data);
        playNextAudio();
      },
      onTranscription: (text, isUser) => {
        setMessages((prev) => [...prev, { role: isUser ? "user" : "model", text }]);
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
        console.error("Live API Error:", err);
        setIsLive(false);
        setIsConnecting(false);
      },
    });

    try {
      await clientRef.current.connect();
      setIsLive(true);
      setIsConnecting(false);
      clientRef.current.triggerGreeting();
    } catch (err) {
      console.error("Connect error:", err);
      stream.getTracks().forEach((t) => t.stop());
      setIsConnecting(false);
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 right-6 w-full max-w-[440px] max-h-[80vh] flex flex-col bg-white border border-gray-200 shadow-2xl rounded-3xl overflow-hidden z-[100] font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold tracking-wider relative">
            AI
            {isLive && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm tracking-wide">Personal Shopper</h3>
            <p className="text-xs text-gray-500 font-medium">
              {isConnecting ? "Connecting..." : isLive ? "Listening..." : "Ready to assist"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Dynamic Display Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
        <AnimatePresence>
          {displayedProducts.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-b border-gray-100 p-4 shadow-sm"
            >
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested for you</h4>
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
                {displayedProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    layoutId={p.id}
                    className="min-w-[160px] snap-center bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer"
                  >
                    <div className="h-[180px] overflow-hidden relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-3">
                      <h5 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-gray-600">${p.price}</span>
                        <button className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                          <ShoppingCart size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcripts Area */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !isLive && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p className="text-sm">Tap the microphone to start shopping with your AI stylist.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-gray-900 text-white ml-auto rounded-tr-sm"
                  : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm"
              }`}
            >
              {m.text}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Bubble Controls */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleVoice}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isLive
                ? "bg-red-500 text-white hover:bg-red-600 hover:scale-95"
                : "bg-gray-900 text-white hover:bg-gray-800 hover:scale-105"
            }`}
          >
            {isLive ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <div className="flex-1 h-12 bg-gray-50 rounded-full flex items-center justify-center relative overflow-hidden border border-gray-100">
            {!isLive ? (
              <span className="text-sm font-medium text-gray-400">Voice Assistant Inactive</span>
            ) : (
              <div className="flex items-center gap-1 h-full w-full px-8">
                {/* Audio Waves Simulation */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isLive ? Math.max(4, Math.random() * audioLevel * 80) : 4,
                    }}
                    transition={{ type: "tween", duration: 0.1 }}
                    className="flex-1 bg-gray-900 rounded-full opacity-60"
                  />
                ))}
              </div>
            )}
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
      className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-semibold hover:scale-105 transition-transform"
    >
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      Ask AI Stylist
    </button>
  );
}
