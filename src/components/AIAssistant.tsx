"use client";

import React from "react";
import { TYPE, Palette } from "@/lib/design";
import { Placeholder } from "./SiteShell";

/* ═══════════════════════════════════════════════════════════════════════
   AI Assistant — Real Gemini 3.1 Flash powered chat
   ═══════════════════════════════════════════════════════════════════════ */

interface ChatMessage {
  from: "sholé" | "me";
  kind: "text" | "picks" | "chips" | "cta";
  text?: string;
  items?: Array<{ name: string; tone: string; label: string; price: string }>;
  chipItems?: string[];
  ctaLabel?: string;
  ctaAction?: () => void;
}

/* ── Surface wrapper ─────────────────────────────────────────────────── */
function AISurface({ surface, open, onClose, palette, children }: {
  surface: string; open: boolean; onClose: () => void; palette: Palette; children: React.ReactNode;
}) {
  if (!open) return null;
  if (surface === "overlay") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(28,24,20,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", animation: "sholeFade 0.3s ease" }} onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(1080px, 92vw)", height: "min(720px, 88vh)", background: palette.bg, borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.3)", animation: "sholePop 0.35s cubic-bezier(0.2, 0.7, 0.3, 1.2)" }}>
          {children}
        </div>
      </div>
    );
  }
  // Default: bubble
  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 100, width: "min(420px, 92vw)", height: "min(640px, 80vh)", background: palette.bg, borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: `1px solid ${palette.line}`, animation: "sholeSlide 0.3s cubic-bezier(0.2, 0.7, 0.3, 1)" }}>
      {children}
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────────────── */
function AIHeader({ palette, accent, onClose }: { palette: Palette; accent: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${palette.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #C77A2D)`, display: "grid", placeItems: "center", fontFamily: TYPE.display, fontSize: 18, color: "#1C1814", fontWeight: 600, position: "relative" }}>
          S
          <span style={{ position: "absolute", right: -2, bottom: -2, width: 12, height: 12, borderRadius: "50%", background: "#3FBE5A", border: `2px solid ${palette.bg}` }} />
        </div>
        <div>
          <div style={{ fontFamily: TYPE.sans, fontSize: 14, fontWeight: 500, color: palette.ink }}>SHOLÉ</div>
          <div style={{ fontFamily: TYPE.mono, fontSize: 10, color: palette.muted, letterSpacing: "0.08em" }}>◇ ai stylist · powered by gemini</div>
        </div>
      </div>
      <button onClick={onClose} style={{ background: "transparent", border: 0, color: palette.muted, fontSize: 22, cursor: "pointer", width: 32, height: 32, borderRadius: "50%", lineHeight: 1 }}>×</button>
    </div>
  );
}

/* ── Typing indicator ────────────────────────────────────────────────── */
function Typing({ palette }: { palette: Palette }) {
  return (
    <div style={{ alignSelf: "flex-start", background: "#F4EFE6", padding: "12px 16px", borderRadius: 18, borderTopLeftRadius: 4, display: "flex", gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: palette.muted, animation: `sholeBlip 1.2s ease ${i * 0.15}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Chat bubble ─────────────────────────────────────────────────────── */
function Bubble({ side, children, palette, accent }: { side: "me" | "them"; children: React.ReactNode; palette: Palette; accent: string }) {
  const isMe = side === "me";
  return (
    <div style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "82%", background: isMe ? accent : "#F4EFE6", color: isMe ? "#1C1814" : palette.ink, padding: "11px 15px", borderRadius: 18, borderTopRightRadius: isMe ? 4 : 18, borderTopLeftRadius: isMe ? 18 : 4, fontFamily: TYPE.sans, fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
      {children}
    </div>
  );
}

/* ── Chat item renderer ──────────────────────────────────────────────── */
function ChatItem({ m, palette, accent }: { m: ChatMessage; palette: Palette; accent: string }) {
  if (m.kind === "text") return <Bubble side={m.from === "me" ? "me" : "them"} palette={palette} accent={accent}>{m.text}</Bubble>;
  if (m.kind === "picks" && m.items) {
    return (
      <div style={{ alignSelf: "flex-start", display: "flex", gap: 8, maxWidth: "92%" }}>
        {m.items.map((p, i) => (
          <div key={i} style={{ width: 116, cursor: "pointer" }}>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 12 }}>
              <Placeholder label={p.label} tone={p.tone} ratio="3 / 4" kind="figure" />
            </div>
            <div style={{ fontFamily: TYPE.sans, fontSize: 11, fontWeight: 500, marginTop: 6, color: palette.ink }}>{p.name}</div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 10, color: palette.muted }}>{p.price}</div>
          </div>
        ))}
      </div>
    );
  }
  if (m.kind === "chips" && m.chipItems) {
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {m.chipItems.map((c) => (
          <span key={c} style={{ background: "transparent", border: `1px solid ${palette.line}`, color: palette.ink, padding: "7px 12px", borderRadius: 999, fontFamily: TYPE.sans, fontSize: 12 }}>{c}</span>
        ))}
      </div>
    );
  }
  if (m.kind === "cta") {
    return (
      <button onClick={m.ctaAction} style={{ alignSelf: "flex-start", background: accent, color: "#1C1814", border: 0, padding: "10px 16px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 12.5, fontWeight: 600 }}>{m.ctaLabel}</button>
    );
  }
  return null;
}

/* ── Main AI Assistant ───────────────────────────────────────────────── */
export function AIAssistant({ open, onClose, surface = "bubble", palette, accent }: {
  open: boolean; onClose: () => void; surface?: string; palette: Palette; accent: string;
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { from: "sholé", kind: "text", text: "hi! it's sholé ✦ what are you styling today?" },
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [chatHistory, setChatHistory] = React.useState<Array<{ role: string; text: string }>>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setMessages([{ from: "sholé", kind: "text", text: "hi! it's sholé ✦ what are you styling today?" }]);
        setChatHistory([]);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Auto-scroll
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userText = text.trim();
    setInput("");
    setMessages((m) => [...m, { from: "me", kind: "text", text: userText }]);

    const newHistory = [...chatHistory, { role: "user", text: userText }];
    setChatHistory(newHistory);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "hmm, something went sideways ◇";

      setChatHistory((h) => [...h, { role: "model", text: reply }]);
      setMessages((m) => [...m, { from: "sholé", kind: "text", text: reply }]);
    } catch {
      setMessages((m) => [...m, { from: "sholé", kind: "text", text: "i seem to have lost connection ◇ — try again in a moment?" }]);
    } finally {
      setTyping(false);
    }
  };

  const showChips = messages.length === 1;

  return (
    <AISurface surface={surface} open={open} onClose={onClose} palette={palette}>
      <AIHeader palette={palette} accent={accent} onClose={onClose} />

      {/* Chat area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <ChatItem key={i} m={m} palette={palette} accent={accent} />
        ))}
        {typing && <Typing palette={palette} />}
        {showChips && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {["styling a dinner", "find me a coat", "starting a wardrobe", "just browsing"].map((c) => (
              <button key={c} onClick={() => sendMessage(c)} style={{ background: "transparent", color: palette.ink, border: `1px solid ${palette.line}`, padding: "8px 14px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 12 }}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{ padding: "14px 18px 18px", borderTop: `1px solid ${palette.line}`, background: palette.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F4EFE6", borderRadius: 999, padding: "6px 6px 6px 16px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="tell sholé what you're styling..."
            style={{ flex: 1, border: 0, background: "transparent", outline: "none", fontFamily: TYPE.sans, fontSize: 14, color: palette.ink, padding: "8px 0" }}
          />
          <button onClick={() => sendMessage(input)} style={{ width: 36, height: 36, borderRadius: "50%", border: 0, background: palette.ink, color: palette.bg, cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center" }}>↑</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontFamily: TYPE.mono, fontSize: 10, letterSpacing: "0.06em", color: palette.muted, padding: "0 4px" }}>
          <span>◇ sholé · powered by gemini 3.1 flash</span>
          <span>enter ↵ to send</span>
        </div>
      </div>
    </AISurface>
  );
}

/* ── Floating Launcher ───────────────────────────────────────────────── */
export function FloatingLauncher({ palette, accent, onClick }: { palette: Palette; accent: string; onClick: () => void }) {
  return (
    <button id="floating-launcher" onClick={onClick} style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60, background: palette.ink, color: palette.bg, border: 0, padding: "14px 20px", borderRadius: 999, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: TYPE.sans, fontSize: 13.5, fontWeight: 500, boxShadow: "0 12px 40px rgba(0,0,0,0.2)", animation: "sholeFloat 4s ease-in-out infinite" }}>
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #C77A2D)`, display: "grid", placeItems: "center", fontFamily: TYPE.display, fontSize: 13, color: "#1C1814", fontWeight: 600 }}>S</span>
      Ask SHOLÉ <span style={{ color: accent }}>✦</span>
    </button>
  );
}
