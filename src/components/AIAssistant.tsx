"use client";
import React from "react";
import { TYPE, Palette } from "@/lib/design";
import { GeminiLiveClient, FunctionCall } from "@/lib/gemini-live";
import { Placeholder } from "./SiteShell";
import type { Labels } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════════
   SHOLÉ AI Assistant — Voice + Text + Image + Function Calling
   ═══════════════════════════════════════════════════════════════════════ */

// Tool declarations for Gemini Live
const TOOLS = [{
  functionDeclarations: [
    { name: "navigate_to", description: "Scrolls the website to a specific section.", parameters: { type: "object", properties: { section: { type: "string", enum: ["hero","collection","story","ai-invite","press","footer"], description: "Target section" } }, required: ["section"] } },
    { name: "change_language", description: "Changes website language.", parameters: { type: "object", properties: { locale: { type: "string", enum: ["en","tr","de","it","zh"], description: "ISO language code" } }, required: ["locale"] } },
    { name: "show_product", description: "Highlights a product in the collection grid.", parameters: { type: "object", properties: { product_id: { type: "string", description: "Product name like 'atelier-coat'" } }, required: ["product_id"] } },
    { name: "recommend_outfit", description: "Recommends outfit items.", parameters: { type: "object", properties: { items: { type: "string", description: "Comma-separated product names" } }, required: ["items"] } },
    { name: "start_tryon", description: "Opens virtual try-on photo upload.", parameters: { type: "object", properties: {} } },
  ]
}];

interface ChatMsg { from: "sholé"|"me"; text: string; }

// System instruction for voice mode
function getSysInstruction(locale: string) {
  return `You are SHOLÉ (sho-LAY), the AI fashion stylist for SHOLÉ by SARAR — a modern Turkish luxury house founded 1947 in Istanbul.

PERSONALITY: Warm, witty, casually confident. Like a stylish friend who knows everything about fabric and fit. You're an ACTIVE SALES ASSISTANT — genuinely helpful but always guiding toward a purchase.

CURRENT LANGUAGE: ${locale.toUpperCase()}. Respond in whatever language the user speaks. If they switch languages, SIMULTANEOUSLY call change_language tool.

ACTIVE SALES TECHNIQUES:
- Cross-sell: "the mule completes this look perfectly"
- Create urgency: "this is from a limited chapter — only 12 pieces per drop"
- Bundle: "coat + trouser + tote = your new uniform, and you save on shipping"
- Close: "shall I add this to your bag?"
- Upsell: "if you love the knit, the scarf in the same saffron is stunning"

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

PRODUCT PAIRINGS (use for cross-sell):
- Coat → Trouser + Mule + Tote
- Shirt → Mini + Mule
- Knit → Trouser + Scarf
- Bomber → Trouser + Tote

TOOLS — use naturally, never mention function names:
- navigate_to(section) — scroll to website sections
- change_language(locale) — switch site language
- show_product(product_id) — highlight a product
- recommend_outfit(items) — show product cards
- start_tryon() — open photo try-on

When user asks about a section, respond AND call navigate_to.
When user asks to see products, call navigate_to("collection") AND recommend_outfit.
When user sends a photo, analyze their style/body type and suggest specific pieces.

GREETING: Start with "${locale === "tr" ? "Merhaba! Ben SHOLÉ, SARAR'ın AI stilisti ✦ Bugün ne giymek istiyorsun?" : "hi! i'm sholé, your AI stylist from SARAR ✦ what are you styling today?"}"`;
}

export function AIAssistant({ open, onClose, palette, accent, labels, onToolCall }: {
  open: boolean; onClose: () => void; palette: Palette; accent: string;
  labels: Labels; onToolCall: (calls: FunctionCall[]) => void;
}) {
  const [mode, setMode] = React.useState<"welcome"|"voice"|"text">("welcome");
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [isLive, setIsLive] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [audioLevel, setAudioLevel] = React.useState(0);
  const [chatHistory, setChatHistory] = React.useState<{role:string;text:string}[]>([]);
  const [uploadedImage, setUploadedImage] = React.useState<string|null>(null);

  const clientRef = React.useRef<GeminiLiveClient|null>(null);
  const audioCtxRef = React.useRef<AudioContext|null>(null);
  const processorRef = React.useRef<ScriptProcessorNode|null>(null);
  const streamRef = React.useRef<MediaStream|null>(null);
  const audioQueueRef = React.useRef<string[]>([]);
  const isPlayingRef = React.useRef(false);
  const activeSourceRef = React.useRef<AudioBufferSourceNode|null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Auto-scroll
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setMode("welcome"); setMessages([]); setChatHistory([]); setUploadedImage(null); }, 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Cleanup on unmount
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
    src.buffer = buf;
    src.connect(ctx.destination);
    activeSourceRef.current = src;
    src.onended = () => { activeSourceRef.current = null; isPlayingRef.current = false; playNextAudio(); };
    src.start();
  }, [getAudioCtx]);

  const stopAudio = React.useCallback(() => {
    try { activeSourceRef.current?.stop(); } catch {}
    activeSourceRef.current = null;
    isPlayingRef.current = false;
    audioQueueRef.current = [];
  }, []);

  // Handle tool calls from Live API
  const handleToolCall = React.useCallback((calls: FunctionCall[]) => {
    const responses: { id?: string; name: string; response: { success: boolean; message: string } }[] = [];
    calls.forEach(call => {
      onToolCall([call]);
      responses.push({ id: call.id, name: call.name, response: { success: true, message: `Done: ${call.name}` } });
    });
    clientRef.current?.sendToolResponse(responses);
  }, [onToolCall]);

  // Start voice session
  const startVoice = async () => {
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { alert("Microphone permission denied"); return; }
    setIsConnecting(true);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) { alert("NEXT_PUBLIC_GEMINI_API_KEY not set"); stream.getTracks().forEach(t => t.stop()); setIsConnecting(false); return; }

    const locale = (document.documentElement.lang || "en") as string;
    clientRef.current = new GeminiLiveClient(apiKey, {
      systemInstruction: getSysInstruction(locale),
      tools: TOOLS,
      onAudioData: (data) => { audioQueueRef.current.push(data); playNextAudio(); },
      onTranscription: (text, isUser) => {
        setMessages(p => [...p.slice(-20), { from: isUser ? "me" : "sholé", text }]);
      },
      onToolCall: handleToolCall,
      onInterrupted: () => { audioQueueRef.current = []; stopAudio(); },
      onClose: () => { setIsLive(false); setMode("text"); },
      onError: () => {},
    });

    try {
      await clientRef.current.connect();
      setIsLive(true); setIsConnecting(false); setMode("voice");
      clientRef.current.triggerGreeting();
      // Start mic capture
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
    } catch { stream.getTracks().forEach(t => t.stop()); setIsConnecting(false); }
  };

  const stopVoice = () => {
    clientRef.current?.close(); clientRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current?.disconnect();
    setIsLive(false); stopAudio();
  };

  // Text mode send
  const sendText = async (text: string) => {
    if (!text.trim()) return;
    const t = text.trim(); setInput("");
    setMessages(m => [...m, { from: "me", text: t }]);
    const hist = [...chatHistory, { role: "user", text: t }];
    setChatHistory(hist); setTyping(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: hist }) });
      const data = await res.json();
      const reply = data.reply || "hmm ◇";
      setChatHistory(h => [...h, { role: "model", text: reply }]);
      setMessages(m => [...m, { from: "sholé", text: reply }]);
    } catch { setMessages(m => [...m, { from: "sholé", text: "lost connection ◇ — try again?" }]); }
    finally { setTyping(false); }
  };

  // Image upload
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = (reader.result as string).split(",")[1];
      setUploadedImage(reader.result as string);
      if (isLive && clientRef.current) {
        clientRef.current.sendVideo(b64);
        setMessages(m => [...m, { from: "me", text: "📸 [photo uploaded for try-on]" }]);
      } else {
        setMessages(m => [...m, { from: "me", text: "📸 [photo uploaded]" }, { from: "sholé", text: "i can see your photo ✦ — for the best try-on experience, start a voice chat so i can walk you through styling options in real-time!" }]);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  // Welcome screen
  if (mode === "welcome") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: palette.deep, display: "flex", alignItems: "center", justifyContent: "center", animation: "sholeFade 0.3s ease" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #C77A2D)`, display: "grid", placeItems: "center", fontFamily: TYPE.display, fontSize: 36, color: "#1C1814", fontWeight: 600, margin: "0 auto 28px" }}>S</div>
        <h2 style={{ fontFamily: TYPE.display, fontSize: 32, color: palette.bg, margin: "0 0 12px", fontWeight: 400 }}>{labels.welcome}</h2>
        <p style={{ fontFamily: TYPE.sans, fontSize: 16, color: palette.bg, opacity: 0.6, lineHeight: 1.6, margin: "0 0 36px" }}>{labels.welcomeDesc}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <button onClick={() => { startVoice(); }} style={{ background: accent, color: "#1C1814", border: 0, padding: "16px 32px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, width: "100%", justifyContent: "center" }}>
            🎤 {isConnecting ? labels.connecting : labels.startVoice}
          </button>
          <button onClick={() => { setMode("text"); setMessages([{ from: "sholé", text: labels.greeting }]); }} style={{ background: "transparent", color: palette.bg, border: `1px solid rgba(255,255,255,0.2)`, padding: "14px 28px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 14, width: "100%", justifyContent: "center", display: "flex", gap: 8, alignItems: "center" }}>
            💬 Text Chat
          </button>
          <button onClick={onClose} style={{ background: "transparent", color: palette.bg, border: 0, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 13, opacity: 0.4, marginTop: 8 }}>{labels.maybeLater}</button>
        </div>
      </div>
    </div>
  );

  // Voice mode
  if (mode === "voice") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: palette.deep, display: "flex", flexDirection: "column", animation: "sholeFade 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isLive ? "#3FBE5A" : "#ff4444", animation: isLive ? "sholePulse 2s infinite" : "none" }} />
          <span style={{ fontFamily: TYPE.mono, fontSize: 11, color: palette.bg, opacity: 0.6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{isLive ? "live · ai stylist" : "disconnected"}</span>
        </div>
        <button onClick={() => { stopVoice(); onClose(); }} style={{ background: "transparent", border: 0, color: palette.bg, fontSize: 24, cursor: "pointer", opacity: 0.5 }}>×</button>
      </div>

      {/* Transcriptions */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === "me" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            <span style={{ fontFamily: TYPE.mono, fontSize: 9, color: palette.bg, opacity: 0.3, textTransform: "uppercase" }}>{m.from === "me" ? "You" : "SHOLÉ"}</span>
            <div style={{ background: m.from === "me" ? "rgba(255,255,255,0.1)" : `${accent}33`, color: palette.bg, padding: "10px 14px", borderRadius: 16, borderTopRightRadius: m.from === "me" ? 4 : 16, borderTopLeftRadius: m.from === "me" ? 16 : 4, fontFamily: TYPE.sans, fontSize: 13.5, lineHeight: 1.5 }}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* Voice orb + controls */}
      <div style={{ padding: "32px 24px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 100, height: 100 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #C77A2D)`, transform: `scale(${1 + audioLevel * 0.6})`, transition: "transform 0.1s", opacity: 0.3 }} />
          <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #C77A2D)`, display: "grid", placeItems: "center", fontFamily: TYPE.display, fontSize: 40, color: "#1C1814", fontWeight: 600 }}>S</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={() => { stopVoice(); setMode("text"); setMessages(m => [...m, { from: "sholé", text: labels.greeting }]); }} style={{ background: "rgba(255,255,255,0.1)", color: palette.bg, border: 0, padding: "12px 20px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 13 }}>💬 Text</button>
          <button onClick={() => fileRef.current?.click()} style={{ background: "rgba(255,255,255,0.1)", color: palette.bg, border: 0, padding: "12px 20px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 13 }}>📸 Photo</button>
          <button onClick={() => { stopVoice(); onClose(); }} style={{ background: "#ff4444", color: "#fff", border: 0, padding: "12px 20px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 13, fontWeight: 600 }}>■ End</button>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleImage} />
    </div>
  );

  // Text mode (bubble)
  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 100, width: "min(420px, 92vw)", height: "min(660px, 82vh)", background: palette.bg, borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: `1px solid ${palette.line}`, animation: "sholeSlide 0.3s cubic-bezier(0.2,0.7,0.3,1)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${palette.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #C77A2D)`, display: "grid", placeItems: "center", fontFamily: TYPE.display, fontSize: 17, color: "#1C1814", fontWeight: 600, position: "relative" }}>S<span style={{ position: "absolute", right: -1, bottom: -1, width: 10, height: 10, borderRadius: "50%", background: "#3FBE5A", border: `2px solid ${palette.bg}` }} /></div>
          <div>
            <div style={{ fontFamily: TYPE.sans, fontSize: 14, fontWeight: 500, color: palette.ink }}>SHOLÉ</div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 10, color: palette.muted, letterSpacing: "0.06em" }}>{labels.poweredBy}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setMode("welcome"); setMessages([]); }} style={{ background: "transparent", border: 0, color: palette.muted, fontSize: 16, cursor: "pointer", padding: 4 }} title="Voice mode">🎤</button>
          <button onClick={onClose} style={{ background: "transparent", border: 0, color: palette.muted, fontSize: 20, cursor: "pointer", padding: 4 }}>×</button>
        </div>
      </div>

      {/* Chat */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === "me" ? "flex-end" : "flex-start", maxWidth: "82%", background: m.from === "me" ? accent : "#F4EFE6", color: m.from === "me" ? "#1C1814" : palette.ink, padding: "11px 14px", borderRadius: 18, borderTopRightRadius: m.from === "me" ? 4 : 18, borderTopLeftRadius: m.from === "me" ? 18 : 4, fontFamily: TYPE.sans, fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.text}</div>
        ))}
        {typing && <div style={{ alignSelf: "flex-start", background: "#F4EFE6", padding: "12px 16px", borderRadius: 18, borderTopLeftRadius: 4, display: "flex", gap: 4 }}>{[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: palette.muted, animation: `sholeBlip 1.2s ease ${i*0.15}s infinite` }} />)}</div>}
        {uploadedImage && <div style={{ alignSelf: "flex-start", maxWidth: "70%" }}><img src={uploadedImage} alt="try-on" style={{ width: "100%", borderRadius: 12 }} /></div>}
        {messages.length <= 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {["styling a dinner", "find me a coat", "what pairs with the knit?", "show me products"].map(c => (
              <button key={c} onClick={() => sendText(c)} style={{ background: "transparent", color: palette.ink, border: `1px solid ${palette.line}`, padding: "8px 14px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 12 }}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${palette.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F4EFE6", borderRadius: 999, padding: "5px 5px 5px 14px" }}>
          <button onClick={() => fileRef.current?.click()} style={{ background: "transparent", border: 0, fontSize: 18, cursor: "pointer", padding: "4px 2px" }}>📸</button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendText(input)} placeholder={labels.textPlaceholder} style={{ flex: 1, border: 0, background: "transparent", outline: "none", fontFamily: TYPE.sans, fontSize: 14, color: palette.ink, padding: "8px 0" }} />
          <button onClick={() => sendText(input)} style={{ width: 34, height: 34, borderRadius: "50%", border: 0, background: palette.ink, color: palette.bg, cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center" }}>↑</button>
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
