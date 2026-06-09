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
  const [emailSent, setEmailSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  // Carry the post-login destination (e.g. the page that asked for voice)
  // through the OAuth / magic-link round-trip via ?next=.
  const callbackUrl = () => {
    const next =
      new URLSearchParams(window.location.search).get("redirect") || "/";
    const safe = next.startsWith("/") ? next : "/";
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(safe)}`;
  };

  const handleGoogleLogin = async () => {
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setError("");
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: callbackUrl() },
    });
    setBusy(false);
    if (otpError) setError(otpError.message);
    else setEmailSent(true);
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

          {emailSent ? (
            <p style={{ fontFamily: TYPE.sans, fontSize: 14, color: palette.ink, lineHeight: 1.6 }}>
              ✦ Giriş bağlantısını <strong>{email}</strong> adresine gönderdik.
              <br />
              E-postanızdaki bağlantıya tıklayarak devam edin.
            </p>
          ) : (
            <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="email"
                required
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
                {busy ? "Gönderiliyor…" : "E-posta ile giriş bağlantısı gönder"}
              </button>
              <p style={{ fontFamily: TYPE.mono, fontSize: 11, color: palette.muted, lineHeight: 1.5, margin: "4px 0 0" }}>
                Şifre yok — size güvenli bir giriş bağlantısı e-postayla gelir. İlk girişte hesabınız otomatik oluşturulur.
              </p>
            </form>
          )}

          {error && (
            <p style={{ fontFamily: TYPE.sans, fontSize: 13, color: "#9E3B2E", marginTop: 14 }}>
              {error}
            </p>
          )}
        </div>
      </main>

      <Footer palette={palette} accent={accent} />
    </div>
  );
}
