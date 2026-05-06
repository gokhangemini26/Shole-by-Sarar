"use client";

import React from "react";
import { TYPE, PALETTES } from "@/lib/design";
import { ARTICLES } from "@/lib/journal";
import { Nav, Footer } from "@/components/SiteShell";

export default function JournalPage() {
  const palette = PALETTES.warmCream;
  const accent = palette.accent;

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: "100vh" }}>
      <Nav palette={palette} onOpenAI={() => window.dispatchEvent(new CustomEvent("open-ai"))} />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 32px 120px" }}>
        <header style={{ marginBottom: 80, textAlign: "center" }}>
          <div style={{ fontFamily: TYPE.mono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: accent, marginBottom: 24 }}>
            Editorial
          </div>
          <h1 style={{ fontFamily: TYPE.display, fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>
            The Journal
          </h1>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 120 }}>
          {ARTICLES.map((article) => (
            <article key={article.slug}>
              <div style={{ fontFamily: TYPE.mono, fontSize: 11, letterSpacing: "0.08em", color: palette.muted, marginBottom: 16, display: "flex", gap: 16 }}>
                <span>{article.date}</span>
                <span>—</span>
                <span style={{ color: accent }}>{article.category}</span>
              </div>
              
              <h2 style={{ fontFamily: TYPE.display, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, margin: "0 0 24px", lineHeight: 1.1 }}>
                {article.title}
              </h2>

              <div style={{
                width: "100%", aspectRatio: "16 / 9", background: "#E8DFCF",
                marginBottom: 40, borderRadius: 16, overflow: "hidden", display: "grid", placeItems: "center"
              }}>
                {article.image ? (
                   <img src={article.image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: TYPE.mono, fontSize: 12, color: palette.muted }}>Image coming soon</span>
                )}
              </div>

              <div style={{ fontFamily: TYPE.sans, fontSize: 18, color: palette.ink, lineHeight: 1.6, fontWeight: 500, marginBottom: 32 }}>
                {article.excerpt}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {article.content.map((para, i) => (
                  <p key={i} style={{ fontFamily: TYPE.sans, fontSize: 15.5, color: palette.ink, opacity: 0.85, lineHeight: 1.7, margin: 0 }}>
                    {para}
                  </p>
                ))}
              </div>
              
              <div style={{ marginTop: 64, width: "100%", height: 1, background: palette.line }} />
            </article>
          ))}
        </div>
      </main>

      <Footer palette={palette} accent={accent} />
    </div>
  );
}
