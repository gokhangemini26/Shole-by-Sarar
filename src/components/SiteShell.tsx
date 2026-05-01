"use client";

import React from "react";
import { TYPE, Palette } from "@/lib/design";

/* ═══════════════════════════════════════════════════════════════════════
   Site Shell: Nav, Footer, MarqueeRow, TopAnnounce, Placeholder
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Placeholder (SVG image placeholder with monospace caption) ──────── */
const toneMap: Record<string, { bg: string; stripe: string; ink: string }> = {
  cream: { bg: "#F4EFE6", stripe: "#E8DFCF", ink: "#A89A7E" },
  sand: { bg: "#E8DFCF", stripe: "#D8CAB0", ink: "#8C7B5C" },
  camel: { bg: "#C9AC83", stripe: "#B89A6E", ink: "#5A4A2E" },
  espresso: { bg: "#3A2E22", stripe: "#4A3D2E", ink: "#C9AC83" },
  saffron: { bg: "#D98A3D", stripe: "#C77A2D", ink: "#3A2418" },
};

let placeholderCounter = 0;

export function Placeholder({
  label,
  ratio = "3 / 4",
  tone = "sand",
  kind = "figure",
  style = {},
}: {
  label: string;
  ratio?: string;
  tone?: string;
  kind?: "figure" | "product" | "flat";
  style?: React.CSSProperties;
}) {
  const c = toneMap[tone] || toneMap.sand;
  const id = `ph-${++placeholderCounter}`;

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        background: c.bg,
        overflow: "hidden",
        borderRadius: 12,
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 400"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, display: "block" }}
      >
        <defs>
          <pattern
            id={`stripe-${id}`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <line x1="0" y1="0" x2="0" y2="14" stroke={c.stripe} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="300" height="400" fill={`url(#stripe-${id})`} opacity="0.55" />
        {kind === "figure" && (
          <g opacity="0.18" stroke={c.ink} strokeWidth="0.8" fill="none">
            <ellipse cx="150" cy="100" rx="28" ry="32" />
            <path d="M122 132 L100 220 L110 280 L130 380" />
            <path d="M178 132 L200 220 L190 280 L170 380" />
            <path d="M122 132 L178 132 L185 240 L150 260 L115 240 Z" />
          </g>
        )}
        {kind === "product" && (
          <g opacity="0.22" stroke={c.ink} strokeWidth="1" fill="none">
            <path d="M80 100 L150 80 L220 100 L210 320 L90 320 Z" />
            <path d="M150 80 L150 110" />
          </g>
        )}
        {kind === "flat" && (
          <g opacity="0.2" stroke={c.ink} strokeWidth="0.8" fill="none">
            <circle cx="150" cy="200" r="80" />
            <circle cx="150" cy="200" r="120" />
          </g>
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 10,
          fontFamily: TYPE.mono,
          fontSize: 10,
          letterSpacing: "0.04em",
          color: c.ink,
          opacity: 0.75,
          textTransform: "lowercase",
        }}
      >
        ◇ {label}
      </div>
    </div>
  );
}

/* ── Marquee Row ─────────────────────────────────────────────────────── */
export function MarqueeRow({
  items,
  accent,
}: {
  items: string[];
  accent: string;
}) {
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "14px 0",
        background: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          whiteSpace: "nowrap",
          animation: "sholeMarquee 38s linear infinite",
          fontFamily: TYPE.display,
          fontSize: 22,
          fontStyle: "italic",
        }}
      >
        {[...items, ...items, ...items].map((s, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <span>{s}</span>
            <span style={{ color: accent, fontStyle: "normal" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Top Announce Bar ────────────────────────────────────────────────── */
export function TopAnnounce({
  accent,
}: {
  accent: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        background: accent,
        color: "#1C1814",
        fontFamily: TYPE.mono,
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textAlign: "center",
        padding: "8px 16px",
      }}
    >
      ✦ Free shipping over €200 · Meet SHOLÉ — your AI stylist · New drop: late
      spring 26
    </div>
  );
}

/* ── Navigation ──────────────────────────────────────────────────────── */
export function Nav({
  palette,
  onOpenAI,
}: {
  palette: Palette;
  dark?: boolean;
  onOpenAI: () => void;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkStyle: React.CSSProperties = {
    fontFamily: TYPE.sans,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.02em",
    color: palette.ink,
    textDecoration: "none",
    padding: "6px 0",
    cursor: "pointer",
  };

  return (
    <header
      id="site-nav"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? palette.bgBlur : "transparent",
        backdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? `1px solid ${palette.line}`
          : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "18px 32px",
          gap: 24,
        }}
      >
        <nav className="hide-mobile" style={{ display: "flex", gap: 28 }}>
          <a style={linkStyle}>Women</a>
          <a style={linkStyle}>Accessories</a>
          <a style={linkStyle}>Shoes</a>
          <a style={linkStyle}>Tailoring</a>
          <a style={linkStyle}>Journal</a>
        </nav>

        <a
          style={{
            fontFamily: TYPE.display,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "0.18em",
            color: palette.ink,
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          SHOLÉ
          <span
            style={{
              fontFamily: TYPE.mono,
              fontSize: 9,
              marginLeft: 4,
              verticalAlign: "super",
              color: palette.muted,
            }}
          >
            by SARAR
          </span>
        </a>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 18,
            alignItems: "center",
          }}
        >
          <a className="hide-mobile" style={linkStyle}>Search</a>
          <a className="hide-mobile" style={linkStyle}>Account</a>
          <button
            id="nav-ask-shole"
            onClick={onOpenAI}
            style={{
              background: palette.ink,
              color: palette.bg,
              border: 0,
              fontFamily: TYPE.sans,
              fontSize: 12,
              fontWeight: 500,
              padding: "9px 14px",
              borderRadius: 999,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              letterSpacing: "0.04em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: palette.accent,
                boxShadow: `0 0 8px ${palette.accent}`,
              }}
            />
            Ask SHOLÉ
          </button>
          <a className="hide-mobile" style={{ ...linkStyle, position: "relative" }}>
            Bag{" "}
            <sup style={{ fontFamily: TYPE.mono, fontSize: 10 }}>2</sup>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────── */
export function Footer({
  palette,
  accent,
}: {
  palette: Palette;
  accent: string;
}) {
  const col = (h: string, items: string[]) => (
    <div>
      <div
        style={{
          fontFamily: TYPE.mono,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: palette.muted,
          marginBottom: 18,
        }}
      >
        {h}
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map((i) => (
          <li
            key={i}
            style={{
              fontFamily: TYPE.sans,
              fontSize: 13,
              color: palette.bg || palette.ink,
              opacity: 0.8,
              cursor: "pointer",
            }}
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer
      id="site-footer"
      style={{
        background: palette.deep,
        color: palette.bg,
        padding: "80px 32px 32px",
        marginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            marginBottom: 60,
            paddingBottom: 40,
            borderBottom: `1px solid ${palette.bg}22`,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily: TYPE.display,
              fontSize: "clamp(32px, 4vw, 56px)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              maxWidth: 720,
            }}
          >
            Letters from <em style={{ color: accent }}>SHOLÉ</em>—
            <br />
            drops, dispatches, and the occasional outfit emergency.
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              minWidth: 280,
            }}
          >
            <input
              placeholder="your@email.com"
              style={{
                flex: 1,
                background: "transparent",
                color: palette.bg,
                border: `1px solid ${palette.bg}33`,
                padding: "12px 16px",
                borderRadius: 999,
                fontFamily: TYPE.sans,
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              style={{
                background: accent,
                color: "#1C1814",
                border: 0,
                padding: "12px 20px",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: TYPE.sans,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe →
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 40,
            opacity: 0.92,
          }}
        >
          {col("Shop", ["Women", "Accessories", "Shoes", "Tailoring", "Sale"])}
          {col("Stylist", [
            "Ask SHOLÉ",
            "Try-on Studio",
            "Style quiz",
            "Wishlist",
          ])}
          {col("Service", ["Shipping", "Returns", "Size guide", "Care"])}
          {col("Sarar", ["Heritage", "Journal", "Stores", "Sustainability"])}
          <div
            style={{
              fontFamily: TYPE.mono,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: palette.bg,
              opacity: 0.5,
              alignSelf: "flex-start",
            }}
          >
            ◇ Est. 1947 — Istanbul
            <br />◇ A SARAR house
            <br />◇ © 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
