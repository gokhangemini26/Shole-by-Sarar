"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ShoppingCart, Send, Mic, MicOff, ExternalLink } from "lucide-react";
import { GeminiLiveClient, FunctionCall } from "@/lib/gemini-live";
import { Product, db } from "@/lib/mock-db";

export function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "model", content: "Welcome to SHOLÉ. I can help you find products and style your outfits." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  
  const clientRef = useRef<GeminiLiveClient | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addErrorMessage = (text: string) => {
    setMessages(prev => [...prev, { role: "model", content: `Error: ${text}` }]);
  };

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
    }
    return audioCtxRef.current;
  }, []);

  async function playNextAudio() {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) return;
    isPlayingRef.current = true;
    try {
      const b64 = audioQueueRef.current.shift()!;
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") await ctx.resume();
      
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
      src.onended = () => {
        activeSourceRef.current = null;
        isPlayingRef.current = false;
        playNextAudio();
      };
      src.start();
    } catch (e) {
      isPlayingRef.current = false;
    }
  }

  const handleToolCall = useCallback((calls: FunctionCall[]) => {
    const responses: any[] = [];

    calls.forEach((call) => {
      let resultData: any = { status: "success" };
      console.log(`[SHOLÉ] Executing Tool: ${call.name}`, call.args);

      if (call.name === "sayfa_degistir") {
        const { url_slug } = call.args as any;
        setMessages(prev => [...prev, { role: "model", content: `Redirecting you to ${url_slug}...` }]);
        // In a real app: router.push(url_slug)
        resultData = { navigated: true, to: url_slug };
      } 
      else if (call.name === "urun_detayi_goster") {
        const { urun_id } = call.args as any;
        const product = db.getProductDetails(urun_id);
        if (product) {
          setDisplayedProducts([product]);
          resultData = { found: true, name: product.name };
        } else {
          resultData = { found: false, error: "Product not found" };
        }
      }
      else if (call.name === "kombin_oner") {
        const { urun_id } = call.args as any;
        const combos = db.getStyleCombos(urun_id);
        setDisplayedProducts(combos);
        resultData = { combosFound: combos.length, items: combos.map(p => p.name) };
      }

      responses.push({ id: call.id, name: call.name, response: resultData });
    });

    clientRef.current?.sendToolResponse(responses);
  }, []);

  const startMicCapture = async (stream: MediaStream) => {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();
    try {
      await ctx.audioWorklet.addModule("/audio-processor.js");
      const source = ctx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(ctx, "pcm-processor");
      
      worklet.port.onmessage = (e) => {
        if (e.data.type === "level") setAudioLevel(e.data.level);
        if (e.data.type === "audio") {
          const bytes = new Uint8Array(e.data.buffer);
          let binary = "";
          for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
          clientRef.current?.sendAudio(btoa(binary));
        }
      };
      
      source.connect(worklet);
      workletRef.current = worklet;
    } catch (e: any) {
      addErrorMessage(`Mic failed: ${e.message}`);
    }
  };

  const toggleVoice = async () => {
    if (isLive || isConnecting) {
      clientRef.current?.close();
      clientRef.current = null;
      streamRef.current?.getTracks().forEach(t => t.stop());
      setIsLive(false);
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      clientRef.current = new GeminiLiveClient(apiKey || "", {
        systemInstruction: "You are SHOLÉ, a luxury fashion stylist. You can change pages, show products, and suggest combos. Speak warmly.",
        onAudioData: (data) => {
          audioQueueRef.current.push(data);
          playNextAudio();
        },
        onTranscription: (text, isUser) => {
          setMessages(prev => [...prev, { role: isUser ? "user" : "model", content: text }]);
        },
        onToolCall: handleToolCall,
        onError: (err: any) => addErrorMessage(err.message || "Live API Error"),
        onClose: () => setIsLive(false)
      });

      await clientRef.current.connect();
      startMicCapture(stream);
      setIsLive(true);
      setIsConnecting(false);
    } catch (e: any) {
      addErrorMessage(e.message || "Failed to start voice.");
      setIsConnecting(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      if (data.reply) setMessages(prev => [...prev, { role: "model", content: data.reply }]);
    } catch (error: any) {
      addErrorMessage(error.message || "Chat failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-full max-w-[460px] max-h-[85vh] flex flex-col bg-white border border-gray-200 shadow-2xl rounded-[32px] overflow-hidden z-[100] font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-lg relative">
            S {isLive && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">SHOLÉ Assistant</h3>
            <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
              {isConnecting ? "Connecting..." : isLive ? "Live Session" : "Online"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Main Display (Dynamic Content) */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
        <AnimatePresence>
          {displayedProducts.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-b border-gray-100 p-5 overflow-x-auto"
            >
              <div className="flex gap-4">
                {displayedProducts.map((p) => (
                  <div key={p.id} className="min-w-[140px] flex flex-col gap-2 group cursor-pointer">
                    <div className="h-40 rounded-2xl overflow-hidden bg-gray-100 relative shadow-sm">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div className="px-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">${p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat History */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 scroll-smooth">
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`max-w-[85%] rounded-[24px] px-5 py-4 text-sm leading-relaxed shadow-sm ${
                m.role === "user" ? "bg-black text-white ml-auto" : 
                m.content.startsWith("Error:") ? "bg-red-50 text-red-600" : "bg-white border border-gray-100 text-gray-800"
              }`}
            >
              {m.content}
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-1.5 p-3 items-center">
              {[0, 1, 2].map(dot => (
                <div key={dot} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${dot * 0.15}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 bg-white border-t border-gray-100 space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleVoice}
            disabled={isConnecting}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
              isConnecting ? "bg-gray-100 text-gray-400" : 
              isLive ? "bg-red-500 text-white animate-pulse" : "bg-black text-white"
            }`}
          >
            {isLive ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
          
          <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-[28px] px-6 py-3 focus-within:border-black transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask for fashion advice..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-1"
              disabled={isLoading || isConnecting}
            />
            <button onClick={sendMessage} disabled={isLoading || isConnecting || !input.trim()} className="text-black hover:scale-110 transition-transform">
              <Send size={20} />
            </button>
          </div>
        </div>

        {isLive && (
          <div className="flex gap-1.5 h-3 px-8 items-center justify-center">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: Math.max(4, audioLevel * 40 * (0.5 + Math.random() * 0.5)),
                  opacity: 0.3 + (audioLevel * 0.7)
                }}
                className="w-1.5 bg-black rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function FloatingLauncher({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="fixed bottom-8 right-8 z-50 bg-black text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 font-bold text-lg hover:scale-105 transition-all active:scale-95 group">
      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse group-hover:shadow-[0_0_10px_rgba(74,222,128,1)]" />
      ASK SHOLÉ
    </button>
  );
}
