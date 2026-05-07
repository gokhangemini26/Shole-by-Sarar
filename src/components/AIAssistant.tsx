"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ShoppingCart, Send } from "lucide-react";
import { Product } from "@/lib/mock-db";

export function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: "model", content: "Welcome to SHOLÉ by SARAR. How may I style you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedProducts] = useState<Product[]>([]);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    
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

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", content: "I'm experiencing a brief interruption. Could you please repeat that?" }]);
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
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 right-6 w-full max-w-[440px] max-h-[80vh] flex flex-col bg-white border border-gray-200 shadow-2xl rounded-3xl overflow-hidden z-[100] font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold tracking-wider relative">
            AI
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm tracking-wide">Personal Shopper</h3>
            <p className="text-xs text-gray-500 font-medium">
              {isLoading ? "SHOLÉ is typing..." : "Ready to assist"}
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
              {m.content}
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-1.5 p-2 items-center text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-gray-900 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask for an outfit..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-900"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? "bg-gray-900 text-white hover:scale-105 active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
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
