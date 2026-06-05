"use client";

import React from "react";
import { TYPE, PALETTES } from "@/lib/design";
import { ARTICLES } from "@/lib/journal";
import { PRODUCTS } from "@/lib/products";
import { Nav, Footer } from "@/components/SiteShell";
import { useLocale } from "@/lib/LocaleContext";

export default function JournalPage() {
  const palette = PALETTES.warmCream;
  const accent = palette.accent;
  const { locale } = useLocale();

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: "100vh" }}>
      <Nav palette={palette} onOpenAI={() => window.dispatchEvent(new CustomEvent("open-ai"))} />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 32px 120px" }}>
        <header style={{ marginBottom: 80, textAlign: "center" }}>
          <div style={{ fontFamily: TYPE.mono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: accent, marginBottom: 24 }}>
            {locale === "tr" ? "Editöryal" : "Editorial"}
          </div>
          <h1 style={{ fontFamily: TYPE.display, fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>
            {locale === "tr" ? "Dergi" : "The Journal"}
          </h1>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 120 }}>
          {ARTICLES.map((article) => {
            const title = locale === "tr" ? article.title_tr || article.title : article.title;
            const excerpt = locale === "tr" ? article.excerpt_tr || article.excerpt : article.excerpt;
            const content = locale === "tr" ? article.content_tr || article.content : article.content;
            const category = locale === "tr" ? article.category_tr || article.category : article.category;

            return (
              <article key={article.slug}>
                <div style={{ fontFamily: TYPE.mono, fontSize: 11, letterSpacing: "0.08em", color: palette.muted, marginBottom: 16, display: "flex", gap: 16 }}>
                  <span>{article.date}</span>
                  <span>—</span>
                  <span style={{ color: accent }}>{category}</span>
                </div>
                
                <h2 style={{ fontFamily: TYPE.display, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, margin: "0 0 24px", lineHeight: 1.1 }}>
                  {title}
                </h2>

                <div style={{
                  width: "100%", aspectRatio: "16 / 9", background: "#E8DFCF",
                  marginBottom: 40, borderRadius: 16, overflow: "hidden", display: "grid", placeItems: "center"
                }}>
                  {article.image ? (
                     <img src={article.image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontFamily: TYPE.mono, fontSize: 12, color: palette.muted }}>
                      {locale === "tr" ? "Görsel yakında" : "Image coming soon"}
                    </span>
                  )}
                </div>

                <div style={{ fontFamily: TYPE.sans, fontSize: 18, color: palette.ink, lineHeight: 1.6, fontWeight: 500, marginBottom: 32 }}>
                  {excerpt}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
                  {content.map((para, i) => (
                    <p key={i} style={{ fontFamily: TYPE.sans, fontSize: 15.5, color: palette.ink, opacity: 0.85, lineHeight: 1.7, margin: 0 }}>
                      {para}
                    </p>
                  ))}
                </div>

                {article.suggestedProducts && article.suggestedProducts.length > 0 && (
                  <div style={{ marginTop: 40 }}>
                    <h3 style={{ fontFamily: TYPE.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: palette.muted, marginBottom: 20 }}>
                      {locale === "tr" ? "Önerilen Parçalar" : "Suggested Pieces"}
                    </h3>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {article.suggestedProducts.map((pSlug) => {
                        const prod = PRODUCTS.find((p) => p.slug === pSlug);
                        if (!prod) return null;
                        const prodName = locale === "tr" ? prod.name_tr || prod.name : prod.name;
                        return (
                          <a
                            key={pSlug}
                            href={`/products/${pSlug}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              background: "#F2ECE1",
                              border: `1px solid ${palette.line}`,
                              borderRadius: 8,
                              padding: "8px 16px 8px 8px",
                              color: palette.ink,
                              textDecoration: "none",
                              fontSize: 14,
                              fontFamily: TYPE.sans,
                              fontWeight: 500,
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#EADFCB";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#F2ECE1";
                            }}
                          >
                            <div style={{ width: 48, height: 48, background: "#E8DFCF", borderRadius: 4, overflow: "hidden" }}>
                              <img src={prod.image} alt={prodName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <span>{prodName}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div style={{ marginTop: 64, width: "100%", height: 1, background: palette.line }} />
              </article>
            );
          })}
        </div>
      </main>

      <Footer palette={palette} accent={accent} />
    </div>
  );
}
