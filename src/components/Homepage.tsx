"use client";

import React from "react";
import { TYPE, Palette } from "@/lib/design";
import { Placeholder } from "./SiteShell";

/* ═══════════════════════════════════════════════════════════════════════
   Homepage Sections: Hero, CollectionGrid, StorySplit, AIInvite, PressStrip
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Hero (default oversize variant) ─────────────────────────────────── */
export function Hero({
  palette,
  accent,
  onOpenAI,
}: {
  palette: Palette;
  accent: string;
  onOpenAI: () => void;
}) {
  return (
    <section
      id="hero"
      style={{
        maxWidth: 1480,
        margin: "0 auto",
        padding: "80px 32px 72px",
        display: "grid",
        gridTemplateColumns: "1.15fr 1fr",
        gap: 56,
        alignItems: "end",
        minHeight: "78vh",
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: TYPE.mono,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: palette.muted,
            marginBottom: 32,
          }}
        >
          <span style={{ width: 24, height: 1, background: palette.muted }} />
          Spring / Summer 2026 — Chapter 01
        </div>
        <h1
          style={{
            fontFamily: TYPE.display,
            fontWeight: 400,
            fontSize: "clamp(64px, 9vw, 148px)",
            lineHeight: 0.92,
            letterSpacing: "-0.025em",
            margin: 0,
            color: palette.ink,
          }}
        >
          Wear it
          <br />
          <em style={{ color: accent, fontStyle: "italic" }}>like it&apos;s</em>
          <br />
          yours{" "}
          <span
            style={{
              display: "inline-block",
              transform: "translateY(-0.1em)",
              fontFamily: TYPE.mono,
              fontSize: "0.18em",
              letterSpacing: "0.16em",
              verticalAlign: "middle",
              color: palette.muted,
              marginLeft: 12,
            }}
          >
            — since 1947
          </span>
        </h1>
        <p
          style={{
            fontFamily: TYPE.sans,
            fontSize: 18,
            lineHeight: 1.55,
            color: palette.ink,
            opacity: 0.7,
            maxWidth: 460,
            marginTop: 36,
          }}
        >
          A new chapter from the SARAR atelier. Tailoring that learns your
          shape, textures that get better with time, and a stylist that actually
          listens.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 36,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            id="hero-shop"
            style={{
              background: palette.ink,
              color: palette.bg,
              border: 0,
              padding: "14px 28px",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: TYPE.sans,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            Shop the chapter →
          </button>
          <button
            id="hero-stylist"
            onClick={onOpenAI}
            style={{
              background: "transparent",
              color: palette.ink,
              border: `1px solid ${palette.line}`,
              padding: "13px 24px",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: TYPE.sans,
              fontSize: 13,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 0 4px ${accent}22`,
              }}
            />
            Try the stylist
          </button>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <Placeholder
          label="hero — wool coat, terra dye"
          tone="camel"
          ratio="3 / 4"
          kind="figure"
        />
        <div
          style={{
            position: "absolute",
            top: -16,
            right: -12,
            background: accent,
            color: "#1C1814",
            fontFamily: TYPE.mono,
            fontSize: 11,
            letterSpacing: "0.06em",
            padding: "8px 14px",
            borderRadius: 999,
            transform: "rotate(6deg)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          ✦ new — 12 looks
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 18,
            background: palette.bg,
            padding: "14px 16px",
            borderRadius: 12,
            fontFamily: TYPE.sans,
            fontSize: 12,
            color: palette.ink,
            maxWidth: 220,
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: TYPE.mono,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: palette.muted,
              marginBottom: 4,
            }}
          >
            look 04 / sholé says
          </div>
          &ldquo;the sleeve crops at the wrist on you — pair with the slim trouser.&rdquo;
        </div>
      </div>
    </section>
  );
}

/* ── Collection Grid ─────────────────────────────────────────────────── */
const collectionItems = [
  { label: "wool coat — terra", tone: "camel", kind: "figure" as const, tag: "new", name: "The Atelier Coat", price: "€ 890" },
  { label: "silk shirt — cream", tone: "cream", kind: "figure" as const, name: "Soft Rules Shirt", price: "€ 340" },
  { label: "tailored trouser", tone: "sand", kind: "figure" as const, name: "Wide Atelier Trouser", price: "€ 420" },
  { label: "leather mule", tone: "espresso", kind: "product" as const, tag: "late spring", name: "Mule No. 4", price: "€ 380" },
  { label: "knit dress — saffron", tone: "saffron", kind: "figure" as const, tag: "✦ pick", name: "Sun-Up Knit", price: "€ 290" },
  { label: "leather tote", tone: "camel", kind: "product" as const, name: "Atelier Tote", price: "€ 540" },
];

export function CollectionGrid({
  palette,
  accent,
}: {
  palette: Palette;
  accent: string;
}) {
  return (
    <section id="collection" style={{ maxWidth: 1480, margin: "0 auto", padding: "60px 32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 40,
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: TYPE.mono,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: palette.muted,
              marginBottom: 12,
            }}
          >
            ◇ Chapter 01 — twelve pieces
          </div>
          <h2
            style={{
              fontFamily: TYPE.display,
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              margin: 0,
              color: palette.ink,
            }}
          >
            The <em style={{ color: accent }}>soft</em> arrivals.
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", "Tailoring", "Knit", "Shoes", "Bags"].map((c, i) => (
            <button
              key={c}
              style={{
                background: i === 0 ? palette.ink : "transparent",
                color: i === 0 ? palette.bg : palette.ink,
                border: `1px solid ${i === 0 ? palette.ink : palette.line}`,
                padding: "8px 16px",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: TYPE.sans,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 28,
          rowGap: 52,
        }}
      >
        {collectionItems.map((it, i) => (
          <ProductCard key={i} {...it} palette={palette} accent={accent} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  label,
  tone,
  kind,
  tag,
  name,
  price,
  palette,
  accent,
}: {
  label: string;
  tone: string;
  kind: "figure" | "product" | "flat";
  tag?: string;
  name: string;
  price: string;
  palette: Palette;
  accent: string;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          transform: hover ? "translateY(-4px)" : "none",
          transition: "transform 0.4s cubic-bezier(0.2, 0.7, 0.3, 1)",
        }}
      >
        <Placeholder label={label} tone={tone} ratio="3 / 4" kind={kind} />
        {tag && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: tag.includes("✦") ? accent : palette.bg,
              color: tag.includes("✦") ? "#1C1814" : palette.ink,
              fontFamily: TYPE.mono,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "5px 10px",
              borderRadius: 999,
            }}
          >
            {tag}
          </div>
        )}
        <button
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: 0,
            background: palette.bg,
            color: palette.ink,
            cursor: "pointer",
            fontSize: 16,
            opacity: hover ? 1 : 0,
            transform: hover ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          ♡
        </button>
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            opacity: hover ? 1 : 0,
            transform: hover ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.3s ease",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            padding: "6px 10px",
            borderRadius: 999,
            fontFamily: TYPE.mono,
            fontSize: 10,
            color: palette.ink,
            letterSpacing: "0.04em",
          }}
        >
          + try on with sholé
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 14,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: TYPE.sans,
              fontSize: 15,
              fontWeight: 500,
              color: palette.ink,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: TYPE.mono,
              fontSize: 11,
              color: palette.muted,
              marginTop: 2,
              letterSpacing: "0.04em",
            }}
          >
            4 colours · xs–xl
          </div>
        </div>
        <div style={{ fontFamily: TYPE.display, fontSize: 18, color: palette.ink }}>
          {price}
        </div>
      </div>
    </article>
  );
}

/* ── Story Split ─────────────────────────────────────────────────────── */
export function StorySplit({
  palette,
  accent,
}: {
  palette: Palette;
  accent: string;
}) {
  return (
    <section
      id="story"
      style={{
        maxWidth: 1480,
        margin: "80px auto",
        padding: "0 32px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 56,
        alignItems: "center",
      }}
    >
      <Placeholder
        label="atelier — istanbul, no. 4"
        tone="espresso"
        ratio="4 / 5"
        kind="flat"
      />
      <div>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: palette.muted,
            marginBottom: 18,
          }}
        >
          ◇ The house
        </div>
        <h2
          style={{
            fontFamily: TYPE.display,
            fontWeight: 400,
            fontSize: "clamp(36px, 4.4vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
            color: palette.ink,
          }}
        >
          Three generations of tailors,
          <br />
          <em style={{ color: accent }}>one</em> very curious AI.
        </h2>
        <p
          style={{
            fontFamily: TYPE.sans,
            fontSize: 17,
            lineHeight: 1.6,
            color: palette.ink,
            opacity: 0.8,
            marginTop: 24,
            maxWidth: 540,
          }}
        >
          SHOLÉ is the new face of SARAR — a house that&apos;s been cutting coats
          in Istanbul since 1947. Same atelier, softer attitude, and a stylist
          that&apos;s genuinely good company.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            marginTop: 40,
            paddingTop: 32,
            borderTop: `1px solid ${palette.line}`,
          }}
        >
          {(
            [
              ["1947", "atelier opened"],
              ["78", "years of tailoring"],
              ["12", "pieces per chapter"],
            ] as const
          ).map(([n, l]) => (
            <div key={l}>
              <div
                style={{
                  fontFamily: TYPE.display,
                  fontSize: 48,
                  lineHeight: 1,
                  color: palette.ink,
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontFamily: TYPE.mono,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: palette.muted,
                  marginTop: 8,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── AI Invite (dark section) ────────────────────────────────────────── */
export function AIInvite({
  palette,
  accent,
  onOpenAI,
}: {
  palette: Palette;
  accent: string;
  onOpenAI: () => void;
}) {
  return (
    <section
      id="ai-invite"
      style={{
        background: palette.deep,
        color: palette.bg,
        padding: "100px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: TYPE.mono,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 16px ${accent}`,
              }}
            />
            Meet your stylist
          </div>
          <h2
            style={{
              fontFamily: TYPE.display,
              fontWeight: 400,
              fontSize: "clamp(48px, 6vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Hi, I&apos;m <em style={{ color: accent }}>SHOLÉ</em>.
            <br />I help you not panic at 8pm.
          </h2>
          <p
            style={{
              fontFamily: TYPE.sans,
              fontSize: 18,
              lineHeight: 1.6,
              opacity: 0.8,
              marginTop: 28,
              maxWidth: 520,
            }}
          >
            Tell me what you&apos;re going to. Show me the dress you almost
            bought. Send me a photo — I&apos;ll show you how the coat actually
            fits. Mostly I just want you to feel a bit better in your closet.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <button
              id="ai-invite-start"
              onClick={onOpenAI}
              style={{
                background: accent,
                color: "#1C1814",
                border: 0,
                padding: "15px 28px",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: TYPE.sans,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Start the conversation →
            </button>
            <button
              onClick={onOpenAI}
              style={{
                background: "transparent",
                color: palette.bg,
                border: `1px solid ${palette.bg}33`,
                padding: "14px 24px",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: TYPE.sans,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Take the style quiz
            </button>
          </div>
        </div>

        {/* Mocked chat preview */}
        <ChatPreview palette={palette} accent={accent} />
      </div>
    </section>
  );
}

function ChatPreview({ palette, accent }: { palette: Palette; accent: string }) {
  const Bubble = ({
    side,
    children,
  }: {
    side: "me" | "them";
    children: React.ReactNode;
  }) => {
    const isMe = side === "me";
    return (
      <div
        style={{
          alignSelf: isMe ? "flex-end" : "flex-start",
          maxWidth: "82%",
          background: isMe ? accent : "rgba(255,255,255,0.08)",
          color: isMe ? "#1C1814" : palette.bg,
          padding: "10px 14px",
          borderRadius: 18,
          borderTopRightRadius: isMe ? 4 : 18,
          borderTopLeftRadius: isMe ? 18 : 4,
          fontFamily: TYPE.sans,
          fontSize: 13.5,
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${palette.bg}22`,
        borderRadius: 28,
        padding: 28,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 16,
          borderBottom: `1px solid ${palette.bg}15`,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accent}, #C77A2D)`,
              display: "grid",
              placeItems: "center",
              fontFamily: TYPE.display,
              fontSize: 16,
              color: "#1C1814",
              fontWeight: 600,
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontFamily: TYPE.sans, fontSize: 13, fontWeight: 500 }}>
              SHOLÉ
            </div>
            <div
              style={{
                fontFamily: TYPE.mono,
                fontSize: 10,
                letterSpacing: "0.06em",
                opacity: 0.6,
              }}
            >
              ◇ online · ai stylist
            </div>
          </div>
        </div>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 10,
            letterSpacing: "0.06em",
            opacity: 0.5,
          }}
        >
          preview ✦
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Bubble side="them">hi! it&apos;s sholé ✦ what are you styling today?</Bubble>
        <Bubble side="me">A dinner Friday. not too dressed up. need a dress.</Bubble>
        <Bubble side="them">
          got it. weather says 17°C — i&apos;ll lean knit. three picks, low-effort,
          slightly off-duty:
        </Bubble>
        <div style={{ display: "flex", gap: 10, paddingLeft: 8 }}>
          {(["saffron", "sand", "espresso"] as const).map((t, i) => (
            <div key={t} style={{ width: 86 }}>
              <Placeholder
                label={`pick ${i + 1}`}
                tone={t}
                ratio="3 / 4"
                kind="figure"
              />
            </div>
          ))}
        </div>
        <Bubble side="them">
          want to try one on? send a full-body photo and i&apos;ll mock it up.
        </Bubble>
      </div>
    </div>
  );
}

/* ── Press Strip ─────────────────────────────────────────────────────── */
export function PressStrip({
  palette,
}: {
  palette: Palette;
  accent?: string;
}) {
  const quotes = [
    ['"Tailoring with a sense of humour."', "Vogue Europe"],
    ['"The AI you actually want around."', "It\'s Nice That"],
    ['"SARAR\'s most playful chapter yet."', "Monocle"],
  ];
  return (
    <section
      id="press"
      style={{ maxWidth: 1480, margin: "80px auto 0", padding: "0 32px" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          padding: "40px 0",
          borderTop: `1px solid ${palette.line}`,
          borderBottom: `1px solid ${palette.line}`,
        }}
      >
        {quotes.map(([q, a]) => (
          <div key={a}>
            <div
              style={{
                fontFamily: TYPE.display,
                fontSize: 22,
                fontStyle: "italic",
                color: palette.ink,
                lineHeight: 1.3,
              }}
            >
              {q}
            </div>
            <div
              style={{
                fontFamily: TYPE.mono,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: palette.muted,
                marginTop: 12,
              }}
            >
              — {a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
