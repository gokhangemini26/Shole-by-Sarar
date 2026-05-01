"use client";
import React from "react";
import { TYPE, Palette } from "@/lib/design";
import { GeminiLiveClient, FunctionCall } from "@/lib/gemini-live";
import type { Labels } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════════
   SHOLÉ AI Assistant — Compact corner widget with voice + text
   Always stays in the corner, never covers the full page.
   Uses function calling to navigate the site and show products.
   ═══════════════════════════════════════════════════════════════════════ */

const TOOLS = [{
  functionDeclarations: [
    { name: "navigate_to", description: "Scrolls the website to a specific section.", parameters: { type: "object", properties: { section: { type: "string", enum: ["hero","collection","story","ai-invite","press","footer"], description: "Target section" } }, required: ["section"] } },
    { name: "change_language", description: "Changes website language.", parameters: { type: "object", properties: { locale: { type: "string", enum: ["en","tr","de","it","zh"], description: "ISO language code" } }, required: ["locale"] } },
    { name: "show_product", description: "Highlights a product in the collection and tells the customer about it. Use when customer asks about a specific product or wants to see something.", parameters: { type: "object", properties: { product_id: { type: "string", enum: ["atelier-coat","soft-rules-shirt","wide-trouser","mule-no4","sun-up-knit","atelier-tote","sun-up-scarf","soft-bomber","atelier-mini"], description: "Product identifier" } }, required: ["product_id"] } },
    { name: "recommend_outfit", description: "Recommends a complete outfit combination to the customer. Use when suggesting pairings or complete looks.", parameters: { type: "object", properties: { items: { type: "string", description: "Comma-separated product names to recommend as an outfit" }, occasion: { type: "string", description: "What the outfit is for, e.g. dinner, office, weekend" } }, required: ["items"] } },
    { name: "start_tryon", description: "Opens virtual try-on — asks user to upload a photo so AI can suggest how pieces look on them.", parameters: { type: "object", properties: {} } },
  ]
}];

interface ChatMsg { from: "sholé"|"me"; text: string; }

function getSysInstruction(locale: string) {
  return `You are SHOLÉ (sho-LAY), the AI fashion stylist for SHOLÉ by SARAR — a modern Turkish luxury house, Istanbul, 1947.

PERSONALITY: Warm, witty, confident. A stylish friend who knows fabric and fit. You are an ACTIVE SALES ASSISTANT.

CURRENT LANGUAGE: ${locale.toUpperCase()}. Respond in whatever language the user speaks. If they switch, call change_language.

HOW YOU WORK:
- You sit in a small chat bubble on the website
- You can NAVIGATE the website to show the customer specific products and sections
- When talking about a product, ALWAYS call show_product to scroll the page to it
- When recommending outfits, call recommend_outfit AND navigate_to("collection")
- Listen to the customer, understand their needs, then guide them through the site

ACTIVE SALES:
- Cross-sell: "the mule completes this look ✦"
- Bundle: "coat + trouser + tote = your new uniform — and you save on shipping"
- Urgency: "limited chapter — only 12 pieces per drop"
- Close: "shall I add this to your bag?"
- Upsell: "the scarf in the same saffron is stunning at €140"

PRODUCT PAIRINGS:
- Coat → Trouser + Mule + Tote ("the full atelier look")
- Shirt → Mini + Mule ("the effortless friday")
- Knit → Trouser + Scarf ("the colour story")
- Bomber → Trouser + Tote ("the evening uniform")

COLLECTION (Spring/Summer 2026 — Chapter 01):
1. The Atelier Coat — terra wool, €890
2. Soft Rules Shirt — cream silk, €340
3. Wide Atelier Trouser — sand linen, €420
4. Mule No. 4 — espresso leather, €380
5. Sun-Up Knit — saffron merino, €290
6. Atelier Tote — camel leather, €540
7. Sun-Up Scarf — saffron silk, €140
8. Soft Bomber — cream silk, €540
9. Atelier Mini — espresso wool, €410

CONVERSATION FLOW:
1. Greet warmly, ask what they're looking for
2. Listen to their needs (occasion, style, budget)
3. Show relevant products by calling show_product
4. Suggest complete outfits with recommend_outfit
5. Cross-sell complementary pieces
6. Ask to close: "want me to add this to your bag?"

TOOLS — use naturally, never mention function names:
- navigate_to(section) → scroll to website sections
- change_language(locale) → switch site language
- show_product(product_id) → scroll to and highlight a product
- recommend_outfit(items, occasion) → show outfit combination
- start_tryon() → photo try-on

GREETING: "${locale === "tr" ? "Merhaba! Ben SHOLÉ ✦ Size bugün ne önerebilirim?" : "hi! i'm sholé ✦ what can i help you find today?"}"`;
}

export function AIAssistant({ open, onClose, palette, accent, labels, onToolCall }: {
  open: boolean; onClose: () => void; palette: Palette; accent: string;
  labels: Labels; onToolCall: (calls: FunctionCall[]) => void;
}) {
  const [messages, setMessages] = React.useState<ChatMsg[]>([{ from: "sholé", text: labels.greeting }]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [isLive, setIsLive] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [audioLevel, setAudioLevel] = React.useState(0);
  const [chatHistory, setChatHistory] = React.useState<{role:string;text:string}[]>([]);

  const clientRef = React.useRef<GeminiLiveClient|null>(null);
  const audioCtxRef = React.useRef<AudioContext|null>(null);
  const processorRef = React.useRef<ScriptProcessorNode|null>(null);
  const streamRef = React.useRef<MediaStream|null>(null);
  const audioQueueRef = React.useRef<string[]>([]);
  const isPlayingRef = React.useRef(false);
  const activeSourceRef = React.useRef<AudioBufferSourceNode|null>(null);
  const pendingStreamRef = React.useRef<MediaStream|null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, typing]);
  React.useEffect(() => {
    if (!open) { const t = setTimeout(() => { setMessages([{ from: "sholé", text: labels.greeting }]); setChatHistory([]); }, 400); return () => clearTimeout(t); }
  }, [open, labels.greeting]);
  React.useEffect(() => { return () => { clientRef.current?.close(); streamRef.current?.getTracks().forEach(t => t.stop()); processorRef.current?.disconnect(); }; }, []);

  const getAudioCtx = React.useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext({ sampleRate: 16000 });
    return audioCtxRef.current;
  }, []);

  const playNextAudio = React.useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) return;
    isPlayingRef.current = true;
    const b64 = audioQueueRef.current.shift()!;
    const ctx = getAudioCtx();
    const bin = atob(b64);
    const bytes = new Int16Array(bin.length / 2);
    for (let i = 0; i < bin.length; i += 2) bytes[i/2] = (bin.charCodeAt(i+1) << 8) | bin.charCodeAt(i);
    const f32 = new Float32Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) f32[i] = bytes[i] / 32768.0;
    const buf = ctx.createBuffer(1, f32.length, 24000);
    buf.getChannelData(0).set(f32);
    const src = ctx.createBufferSource();
    src.buffer = buf; src.connect(ctx.destination);
    activeSourceRef.current = src;
    src.onended = () => { activeSourceRef.current = null; isPlayingRef.current = false; playNextAudio(); };
    src.start();
  }, [getAudioCtx]);

  const stopAudio = React.useCallback(() => {
    try { activeSourceRef.current?.stop(); } catch {}
    activeSourceRef.current = null; isPlayingRef.current = false; audioQueueRef.current = [];
  }, []);

  const handleToolCall = React.useCallback((calls: FunctionCall[]) => {
    const responses: { id?: string; name: string; response: { success: boolean; message: string } }[] = [];
    calls.forEach(call => {
      onToolCall([call]);
      responses.push({ id: call.id, name: call.name, response: { success: true, message: `Done: ${call.name}` } });
    });
    clientRef.current?.sendToolResponse(responses);
  }, [onToolCall]);

  const startMicCapture = React.useCallback(async (stream: MediaStream) => {
    streamRef.current = stream;
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();
    const source = ctx.createMediaStreamSource(stream);
    const proc = ctx.createScriptProcessor(4096, 1, 1);
    proc.onaudioprocess = (e) => {
      const inp = e.inputBuffer.getChannelData(0);
      const pcm = new Int16Array(inp.length);
      for (let i = 0; i < inp.length; i++) pcm[i] = Math.max(-1, Math.min(1, inp[i])) * 0x7FFF;
      const b64 = btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)));
      clientRef.current?.sendAudio(b64);
      const sum = inp.reduce((a, b) => a + Math.abs(b), 0);
      setAudioLevel(sum / inp.length * 5);
    };
    source.connect(proc); proc.connect(ctx.destination);
    processorRef.current = proc;
  }, [getAudioCtx]);

  // Toggle voice
  const toggleVoice = async () => {
    if (isLive) {
      clientRef.current?.close(); clientRef.current = null;
      streamRef.current?.getTracks().forEach(t => t.stop()); processorRef.current?.disconnect();
      setIsLive(false); setAudioLevel(0); stopAudio();
      return;
    }
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { alert("Microphone permission denied"); return; }
    setIsConnecting(true);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) { alert("NEXT_PUBLIC_GEMINI_API_KEY not set"); stream.getTracks().forEach(t => t.stop()); setIsConnecting(false); return; }

    const locale = (document.documentElement.lang || "en");
    clientRef.current = new GeminiLiveClient(apiKey, {
      systemInstruction: getSysInstruction(locale),
      tools: TOOLS,
      onAudioData: (data) => {
        audioQueueRef.current.push(data);
        playNextAudio();
        if (pendingStreamRef.current) {
          const s = pendingStreamRef.current; pendingStreamRef.current = null;
          setTimeout(() => startMicCapture(s), 1500);
        }
      },
      onTranscription: (text, isUser) => {
        setMessages(p => [...p.slice(-30), { from: isUser ? "me" : "sholé", text }]);
      },
      onToolCall: handleToolCall,
      onInterrupted: () => { audioQueueRef.current = []; stopAudio(); },
      onClose: () => setIsLive(false),
      onError: () => {},
    });
    try {
      await clientRef.current.connect();
      setIsLive(true); setIsConnecting(false);
      pendingStreamRef.current = stream;
      clientRef.current.triggerGreeting();
    } catch { stream.getTracks().forEach(t => t.stop()); setIsConnecting(false); }
  };

  // Text send
  const sendText = async (text: string) => {
    if (!text.trim()) return;
    const t = text.trim(); setInput("");
    setMessages(m => [...m, { from: "me", text: t }]);
    // If voice is live, send as text input to live session
    if (isLive && clientRef.current) {
      clientRef.current.sendText(t);
      return;
    }
    const hist = [...chatHistory, { role: "user", text: t }];
    setChatHistory(hist); setTyping(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: hist }) });
      const data = await res.json();
      const reply = data.reply || "hmm ◇";
      setChatHistory(h => [...h, { role: "model", text: reply }]);
      setMessages(m => [...m, { from: "sholé", text: reply }]);
    } catch { setMessages(m => [...m, { from: "sholé", text: "connection lost ◇ — try again?" }]); }
    finally { setTyping(false); }
  };

  // Image
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = (reader.result as string).split(",")[1];
      if (isLive && clientRef.current) {
        clientRef.current.sendVideo(b64);
        setMessages(m => [...m, { from: "me", text: "📸 [fotoğraf gönderildi]" }]);
      } else {
        setMessages(m => [...m, { from: "me", text: "📸 [photo]" }, { from: "sholé", text: "i can see your photo ✦ — start voice chat so i can walk you through styling in real-time!" }]);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", right: 24, bottom: 24, zIndex: 100,
      width: "min(400px, 90vw)", height: "min(600px, 78vh)",
      background: palette.bg, borderRadius: 24, overflow: "hidden",
      display: "flex", flexDirection: "column",
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: `1px solid ${palette.line}`,
      animation: "sholeSlide 0.3s cubic-bezier(0.2,0.7,0.3,1)",
    }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${palette.line}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #C77A2D)`, display: "grid", placeItems: "center", fontFamily: TYPE.display, fontSize: 17, color: "#1C1814", fontWeight: 600, position: "relative", transform: isLive ? `scale(${1 + audioLevel * 0.15})` : "none", transition: "transform 0.1s" }}>
            S
            <span style={{ position: "absolute", right: -1, bottom: -1, width: 10, height: 10, borderRadius: "50%", background: isLive ? "#ff4444" : "#3FBE5A", border: `2px solid ${palette.bg}`, animation: isLive ? "sholePulse 1.5s infinite" : "none" }} />
          </div>
          <div>
            <div style={{ fontFamily: TYPE.sans, fontSize: 14, fontWeight: 500, color: palette.ink }}>SHOLÉ</div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 10, color: palette.muted, letterSpacing: "0.06em" }}>
              {isLive ? "🔴 live voice · ai stylist" : "◇ ai stylist · powered by gemini"}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: 0, color: palette.muted, fontSize: 20, cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}>×</button>
      </div>

      {/* ── Chat area ── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === "me" ? "flex-end" : "flex-start",
            maxWidth: "82%",
            background: m.from === "me" ? accent : "#F4EFE6",
            color: m.from === "me" ? "#1C1814" : palette.ink,
            padding: "10px 14px", borderRadius: 18,
            borderTopRightRadius: m.from === "me" ? 4 : 18,
            borderTopLeftRadius: m.from === "me" ? 18 : 4,
            fontFamily: TYPE.sans, fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap",
          }}>{m.text}</div>
        ))}
        {typing && (
          <div style={{ alignSelf: "flex-start", background: "#F4EFE6", padding: "12px 16px", borderRadius: 18, borderTopLeftRadius: 4, display: "flex", gap: 4 }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: palette.muted, animation: `sholeBlip 1.2s ease ${i*0.15}s infinite` }} />)}
          </div>
        )}
        {/* Quick chips on first message */}
        {messages.length <= 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {["ürünleri göster", "akşam yemeği kombini", "palto öner", "bütçeme uygun ne var?"].map(c => (
              <button key={c} onClick={() => sendText(c)} style={{ background: "transparent", color: palette.ink, border: `1px solid ${palette.line}`, padding: "7px 12px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 11.5 }}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${palette.line}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F4EFE6", borderRadius: 999, padding: "4px 4px 4px 12px" }}>
          {/* Mic button */}
          <button onClick={toggleVoice} style={{
            background: isLive ? "#ff4444" : "transparent", color: isLive ? "#fff" : palette.muted,
            border: isLive ? 0 : `1px solid ${palette.line}`,
            width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14,
            display: "grid", placeItems: "center", flexShrink: 0,
            transition: "all 0.2s",
          }}>{isConnecting ? "..." : isLive ? "■" : "🎤"}</button>
          {/* Photo button */}
          <button onClick={() => fileRef.current?.click()} style={{ background: "transparent", border: 0, fontSize: 16, cursor: "pointer", padding: "2px 4px", color: palette.muted, flexShrink: 0 }}>📸</button>
          {/* Text input */}
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendText(input)}
            placeholder={isLive ? "sesli dinliyorum..." : labels.textPlaceholder}
            style={{ flex: 1, border: 0, background: "transparent", outline: "none", fontFamily: TYPE.sans, fontSize: 13.5, color: palette.ink, padding: "8px 0", minWidth: 0 }} />
          {/* Send button */}
          <button onClick={() => sendText(input)} style={{ width: 32, height: 32, borderRadius: "50%", border: 0, background: palette.ink, color: palette.bg, cursor: "pointer", fontSize: 13, display: "grid", placeItems: "center", flexShrink: 0 }}>↑</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: TYPE.mono, fontSize: 9, color: palette.muted, letterSpacing: "0.06em", padding: "0 4px" }}>
          <span>{isLive ? "🔴 sesli mod aktif — konuşabilirsiniz" : labels.poweredBy}</span>
          <span>enter ↵</span>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleImage} />
    </div>
  );
}

/* ── Floating Launcher ───────────────────────────────────────────────── */
export function FloatingLauncher({ palette, accent, onClick, label }: { palette: Palette; accent: string; onClick: () => void; label: string }) {
  return (
    <button id="floating-launcher" onClick={onClick} style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60, background: palette.ink, color: palette.bg, border: 0, padding: "14px 20px", borderRadius: 999, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: TYPE.sans, fontSize: 13.5, fontWeight: 500, boxShadow: "0 12px 40px rgba(0,0,0,0.2)", animation: "sholeFloat 4s ease-in-out infinite" }}>
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #C77A2D)`, display: "grid", placeItems: "center", fontFamily: TYPE.display, fontSize: 13, color: "#1C1814", fontWeight: 600 }}>S</span>
      {label} <span style={{ color: accent }}>✦</span>
    </button>
  );
}
