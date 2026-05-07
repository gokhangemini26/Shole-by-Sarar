"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ShoppingCart, Send, Mic, MicOff } from "lucide-react";
import { GeminiLiveClient } from "@/lib/gemini-live";
import { Product } from "@/lib/mock-db";

export function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "model", content: "Welcome to SHOLÉ by SARAR. How may I style you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedProducts] = useState<Product[]>([]);
  
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
      console.error("Playback error:", e);
      isPlayingRef.current = false;
    }
  }

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
      addErrorMessage(`Microphone processing failed: ${e.message}`);
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
      if (!apiKey || apiKey === "your_gemini_api_key_here") {
        throw new Error("Client API Key is missing. Please check your .env.local or Vercel settings.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      clientRef.current = new GeminiLiveClient(apiKey, {
        systemInstruction: "You are SHOLÉ, a luxury fashion stylist. Speak warmly and helpfully.",
        onAudioData: (data) => {
          audioQueueRef.current.push(data);
          playNextAudio();
        },
        onTranscription: (text, isUser) => {
          setMessages(prev => [...prev, { role: isUser ? "user" : "model", content: text }]);
        },
        onError: (err: any) => addErrorMessage(`Live API Error: ${err.message || "Unknown error"}`),
        onClose: () => setIsLive(false)
      });

      await clientRef.current.connect();
      startMicCapture(stream);
      setIsLive(true);
      setIsConnecting(false);
    } catch (e: any) {
      console.error("Voice failed:", e);
      addErrorMessage(e.message || "Failed to start voice assistant.");
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
      if (!response.ok) throw new Error(data.error || "Server responded with an error.");
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: "model", content: data.reply }]);
      } else {
        throw new Error("Received empty reply from AI.");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      addErrorMessage(error.message || "Failed to get reply from AI.");
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
      className="fixed bottom-6 right-6 w-full max-w-[440px] max-h-[80vh] flex flex-col bg-white border border-gray-200 shadow-2xl rounded-3xl overflow-hidden z-[100] font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold relative">
            AI {isLive && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Personal Shopper</h3>
            <p className="text-xs text-gray-500">
              {isConnecting ? "Connecting..." : isLive ? "Listening..." : "Ready to assist"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400">
          <X size={20} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              m.role === "user" ? "bg-black text-white ml-auto" : 
              m.content.startsWith("Error:") ? "bg-red-50 text-red-600 border border-red-100" : "bg-white border shadow-sm"
            }`}>
              {m.content}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-1 p-2 items-center text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white border-t space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoice}
            disabled={isConnecting}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isConnecting ? "bg-gray-200 text-gray-400" : 
              isLive ? "bg-red-500 text-white" : "bg-black text-white"
            }`}
          >
            {isLive ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1"
              disabled={isLoading || isConnecting}
            />
            <button onClick={sendMessage} disabled={isLoading || isConnecting || !input.trim()} className="text-black">
              <Send size={18} />
            </button>
          </div>
        </div>

        {isLive && (
          <div className="flex gap-1 h-2 px-12">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: Math.max(4, audioLevel * 30 * (1 + Math.sin(i * 0.5))) }}
                className="flex-1 bg-black rounded-full opacity-40"
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
    <button onClick={onClick} className="fixed bottom-6 right-6 z-50 bg-black text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-semibold">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      Ask AI Stylist
    </button>
  );
}
