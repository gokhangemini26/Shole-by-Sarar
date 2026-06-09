"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { PALETTES, TYPE } from "@/lib/design";
import { TopAnnounce, Nav, Footer } from "@/components/SiteShell";

export default function LoginPage() {
  const palette = PALETTES.warmCream;
  const accent = palette.accent;
  const supabase = createClient();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [info, setInfo] = React.useState("");

  const safeNext = () => {
    const next =
      new URLSearchParams(window.location.search).get("redirect") || "/";
    return next.startsWith("/") && !next.startsWith("//") ? next : "/";
  };

  // Used by OAuth and the email-confirmation round-trip.
  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext())}`;

  const handleGoogleLogin = async () => {
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || busy) return;
    setBusy(true);
    setError("");
    setInfo("");

    if (mode === "signin") {
      const { error: e2 } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setBusy(false);
      if (e2) return setError(e2.message);
      window.location.assign(safeNext()); // session persists in the browser
    } else {
      const { data, error: e2 } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: callbackUrl() },
      });
      setBusy(false);
      if (e2) return setError(e2.message);
      if (data.session) window.location.assign(safeNext());
      else
        setInfo(
          "Hesabınızı doğrulamak için e-postanıza gönderdiğimiz bağlantıya tıklayın."
        );
    }
  };

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopAnnounce accent={accent} />
      <Nav palette={palette} onOpenAI={() => {}} />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div
          style={{
            background: palette.bgBlur,
            border: `1px solid ${palette.line}`,
            padding: "48px 40px",
            borderRadius: 16,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
          }}
        >
          <h1 style={{ fontFamily: TYPE.display, fontSize: 36, margin: "0 0 16px", fontWeight: 400 }}>
            Welcome Back
          </h1>
          <p style={{ fontFamily: TYPE.sans, fontSize: 14, color: palette.muted, marginBottom: 32, lineHeight: 1.5 }}>
            Sign in to save your looks and get personalized styling from SHOLÉ.
          </p>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              background: "#FFFFFF",
              color: "#1C1814",
              border: `1px solid ${palette.line}`,
              padding: "14px 24px",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: TYPE.sans,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: palette.line }} />
            <span style={{ fontFamily: TYPE.mono, fontSize: 11, color: palette.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              veya
            </span>
            <div style={{ flex: 1, height: 1, background: palette.line }} />
          </div>

          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              style={{
                width: "100%",
                background: "#FFFFFF",
                color: "#1C1814",
                border: `1px solid ${palette.line}`,
                padding: "13px 16px",
                borderRadius: 8,
                fontFamily: TYPE.sans,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre (en az 6 karakter)"
              style={{
                width: "100%",
                background: "#FFFFFF",
                color: "#1C1814",
                border: `1px solid ${palette.line}`,
                padding: "13px 16px",
                borderRadius: 8,
                fontFamily: TYPE.sans,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%",
                background: palette.ink,
                color: palette.bg,
                border: 0,
                padding: "14px 24px",
                borderRadius: 8,
                cursor: busy ? "default" : "pointer",
                opacity: busy ? 0.6 : 1,
                fontFamily: TYPE.sans,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {busy
                ? "Lütfen bekleyin…"
                : mode === "signin"
                ? "E-posta ile giriş yap"
                : "Hesap oluştur"}
            </button>
          </form>

          <p style={{ fontFamily: TYPE.sans, fontSize: 13, color: palette.muted, marginTop: 16 }}>
            {mode === "signin" ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setInfo("");
              }}
              style={{
                background: "transparent",
                border: 0,
                color: palette.ink,
                cursor: "pointer",
                fontFamily: TYPE.sans,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "underline",
                padding: 0,
              }}
            >
              {mode === "signin" ? "Kayıt olun" : "Giriş yapın"}
            </button>
          </p>

          {info && (
            <p style={{ fontFamily: TYPE.sans, fontSize: 13, color: palette.ink, marginTop: 12, lineHeight: 1.5 }}>
              ✦ {info}
            </p>
          )}
          {error && (
            <p style={{ fontFamily: TYPE.sans, fontSize: 13, color: "#9E3B2E", marginTop: 12 }}>
              {error}
            </p>
          )}
        </div>
      </main>

      <Footer palette={palette} accent={accent} />
    </div>
  );
}
