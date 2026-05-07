"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Send, ShoppingBag } from "lucide-react";
import { Product, db } from "@/lib/mock-db";

export function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "model", content: "Welcome to SHOLÉ. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleVoice = () => {
    // For now, voice is a placeholder that triggers recording
    // In a real app, we'd use SpeechRecognition API here
    setIsRecording(!isRecording);
    if (!isRecording) {
      setMessages(prev => [...prev, { role: "model", content: "I'm listening... (Voice-to-Text simulation active)" }]);
    }
  };

  const sendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.body) throw new Error("No response body");

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = ""; // Buffer for partial lines
      
      setMessages(prev => [...prev, { role: "model", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the last partial line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.text) {
              fullText += data.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content = fullText;
                return updated;
              });
            }
          } catch (e) {
            console.warn("Parse error in stream line:", line, e);
          }
        }
      }

      // After streaming, check for function call patterns (simulation)
      if (fullText.toLowerCase().includes("kombin") || fullText.toLowerCase().includes("öner")) {
        setDisplayedProducts(db.getStyleCombos("1")); // Mock combo for product 1
      }

    } catch (error: any) {
      setMessages(prev => [...prev, { role: "model", content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
      setIsRecording(false);
    }
  };

  if (!open) return null;

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
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">S</div>
          <div>
            <h3 className="font-bold text-sm">SHOLÉ Personal Shopper</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Powered by Gemini</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
        <AnimatePresence>
          {displayedProducts.length > 0 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              className="bg-white border-b p-4 overflow-x-auto flex gap-3"
            >
              {displayedProducts.map(p => (
                <div key={p.id} className="min-w-[120px] bg-gray-50 rounded-xl p-2 border">
                  <img src={p.image} className="w-full h-24 object-cover rounded-lg mb-2" alt={p.name} />
                  <p className="text-[10px] font-bold truncate">{p.name}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-black text-white ml-auto" : "bg-white border shadow-sm"}`}>
              {m.content}
            </div>
          ))}
          {isLoading && !messages[messages.length-1].content && (
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
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-black text-white"}`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-black transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1"
              disabled={isLoading}
            />
            <button onClick={() => sendMessage()} disabled={isLoading || !input.trim()} className="text-black">
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
    <button onClick={onClick} className="fixed bottom-6 right-6 z-50 bg-black text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold hover:scale-105 transition-all">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      ASK SHOLÉ
    </button>
  );
}
