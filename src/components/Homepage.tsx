"use client";

import React from "react";
import Link from "next/link";
import { TYPE, Palette } from "@/lib/design";
import { getLabels } from "@/lib/i18n";
import { useLocale } from "@/lib/LocaleContext";

/* ── Product Images Map ──────────────────────────────────────────────── */
const PRODUCT_IMAGES: Record<string, string> = {
  "hero-coat": "/images/products/hero-coat.png",
  "atelier-coat": "/images/products/atelier-coat.png",
  "soft-rules-shirt": "/images/products/soft-rules-shirt.png",
  "wide-trouser": "/images/products/wide-trouser.png",
  "mule-no4": "/images/products/mule-no4.png",
  "sun-up-knit": "/images/products/sun-up-knit.png",
  "atelier-tote": "/images/products/atelier-tote.png",
  "sun-up-scarf": "/images/products/sun-up-scarf.png",
  "soft-bomber": "/images/products/soft-bomber.png",
  "atelier-mini": "/images/products/atelier-mini.png",
  "story-atelier": "/images/products/story-atelier.png",
};

function ProductImage({ src, alt, ratio = "3 / 4", style = {} }: {
  src: string; alt: string; ratio?: string; style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", aspectRatio: ratio, width: "100%", overflow: "hidden", borderRadius: 12, background: "#E8DFCF", ...style }}>
      <img
        src={src}
        alt={alt}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        loading="lazy"
      />
    </div>
  );
}

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
  const { locale } = useLocale();
  const labels = getLabels(locale);
  const heroVidRef = React.useRef<HTMLVideoElement>(null);
  const heroVidIdx = React.useRef(0);
  const heroVideos = ["/videos/hero.mp4", "/videos/Kalem.mp4"];

  const handleHeroVideoEnded = React.useCallback(() => {
    heroVidIdx.current = (heroVidIdx.current + 1) % heroVideos.length;
    const vid = heroVidRef.current;
    if (vid) {
      vid.src = heroVideos[heroVidIdx.current];
      vid.load();
      vid.play().catch(() => {});
    }
  }, []);

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
          {labels.heroSubtitle}
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
          {locale === "tr" ? "Kendin gibi" : "Wear it"}
          <br />
          <em style={{ color: accent, fontStyle: "italic" }}>
            {locale === "tr" ? "taşı" : "like it's"}
          </em>
          <br />
          {locale === "tr" ? "onu" : "yours"}{" "}
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
            {labels.herosince}
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
          {labels.heroTagline}
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
            {labels.shopChapter}
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
            {labels.tryStylist}
          </button>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ position: "relative", aspectRatio: "3 / 4", width: "100%", overflow: "hidden", borderRadius: 12, background: "#E8DFCF" }}>
          <video
            ref={heroVidRef}
            autoPlay
            loop={false}
            muted
            playsInline
            onEnded={handleHeroVideoEnded}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
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
          {labels.newLooksCount}
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
            {labels.lookSholeSays}
          </div>
          &ldquo;{locale === "tr" ? "kol boyu bileğinde bitiyor — dar pantolonla kombinle." : "the sleeve crops at the wrist on you — pair with the slim trouser."}&rdquo;
        </div>
      </div>
    </section>
  );
}


/* ── Collection Grid ─────────────────────────────────────────────────── */
import { PRODUCTS as ALL_PRODUCTS } from "@/lib/products";

export function CollectionGrid({
  palette,
  accent,
  highlightedProduct,
}: {
  palette: Palette;
  accent: string;
  highlightedProduct?: string | null;
}) {
  const { locale } = useLocale();
  const labels = getLabels(locale);
  const categories = locale === "tr" 
    ? ["Hepsi", "Terzilik", "Triko", "Ayakkabı", "Çanta"] 
    : ["All", "Tailoring", "Knit", "Shoes", "Bags"];

  const featuredIds = [
    "atelier-coat",
    "soft-rules-shirt",
    "wide-trouser",
    "mule-no4",
    "sun-up-knit",
    "atelier-tote",
    "sun-up-scarf",
    "soft-bomber",
    "atelier-mini"
  ];

  const collectionItems = featuredIds.map(id => {
    const p = ALL_PRODUCTS.find(x => x.slug === id);
    if (!p) return null;
    return {
      id: p.slug,
      name: (locale === "tr" && p.name_tr ? p.name_tr : p.name) || p.name,
      price: p.price,
      tag: p.tag,
      label: (locale === "tr" && p.subtitle_tr ? p.subtitle_tr : p.subtitle) || p.subtitle
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

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
            ◇ {labels.chapter01} — {locale === "tr" ? "on iki parça" : "twelve pieces"}
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
            {labels.collectionTitle.split(".")[0]} <em style={{ color: accent }}>{locale === "tr" ? "parçalar" : "soft"}</em>.
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((c, i) => (
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
          <ProductCard key={it.id || i} {...it} palette={palette} accent={accent} highlighted={highlightedProduct === it.id} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  id,
  label,
  tag,
  name,
  price,
  palette,
  accent,
  highlighted,
}: {
  id?: string;
  label: string;
  tag?: string;
  name: string;
  price: string;
  palette: Palette;
  accent: string;
  highlighted?: boolean;
}) {
  const [hover, setHover] = React.useState(false);
  const { locale } = useLocale();
  const labels = getLabels(locale);

  return (
    <Link href={id ? `/product/${id}` : "#"} style={{ textDecoration: "none", color: "inherit" }}>
    <article
      id={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        outline: highlighted ? `3px solid ${accent}` : "none",
        outlineOffset: 6,
        borderRadius: 16,
        transform: highlighted ? "scale(1.03)" : "none",
        transition: "all 0.5s cubic-bezier(0.2, 0.7, 0.3, 1)",
        boxShadow: highlighted ? `0 0 30px ${accent}44, 0 12px 40px rgba(0,0,0,0.12)` : "none",
        position: "relative",
        zIndex: highlighted ? 10 : "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          transform: hover ? "translateY(-4px)" : "none",
          transition: "transform 0.4s cubic-bezier(0.2, 0.7, 0.3, 1)",
        }}
      >
        <ProductImage
          src={id ? PRODUCT_IMAGES[id] || "/images/products/atelier-coat.png" : "/images/products/atelier-coat.png"}
          alt={`SHOLÉ — ${name}`}
          ratio="3 / 4"
        />
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
          {labels.tryOnWithShole}
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
            {labels.sizeRange}
          </div>
        </div>
        <div style={{ fontFamily: TYPE.display, fontSize: 18, color: palette.ink }}>
          {price}
        </div>
      </div>
    </article>
    </Link>
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
  const { locale } = useLocale();
  const labels = getLabels(locale);

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
      <ProductImage
        src={PRODUCT_IMAGES["story-atelier"]}
        alt={`SHOLÉ — ${labels.theHouse}`}
        ratio="4 / 5"
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
          {labels.theHouse}
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
          {labels.storyTitle.split(",")[0]},
          <br />
          {(() => {
            const secondPart = labels.storyTitle.split(",")[1]?.trim() || "";
            const firstWord = secondPart.split(" ")[0];
            const rest = secondPart.slice(firstWord.length);
            return (
              <>
                <em style={{ color: accent }}>{firstWord}</em>{rest}
              </>
            );
          })()}
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
          {locale === "tr" 
            ? "SHOLÉ, 1944'ten beri İstanbul'da palto kesen bir moda evi olan SARAR'ın yeni yüzüdür. Aynı atölye, daha yumuşak bir tutum ve gerçekten iyi bir arkadaş olan bir stilist."
            : "SHOLÉ is the new face of SARAR — a house that's been cutting coats in Istanbul since 1944. Same atelier, softer attitude, and a stylist that's genuinely good company."}
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
              ["1944", labels.statAtelier],
              ["82", labels.statTailoring],
              ["12", labels.statPieces],
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
  const { locale } = useLocale();
  const labels = getLabels(locale);

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
            {labels.meetYourStylist}
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
            {labels.aiInviteTitle.split(".")[0]}.
            <br />{labels.aiInviteTitle.split(".")[1].trim()}
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
            {labels.aiInviteDesc}
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
              {labels.startConversation}
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
              {labels.styleQuiz}
            </button>
          </div>
        </div>

        {/* Mocked chat preview */}
        <ChatPreview palette={palette} accent={accent} />
      </div>
    </section>
  );
}

const Bubble = ({
  side,
  children,
  palette,
  accent,
}: {
  side: "me" | "them";
  children: React.ReactNode;
  palette: Palette;
  accent: string;
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

function ChatPreview({ palette, accent }: { palette: Palette; accent: string }) {
  const { locale } = useLocale();
  const labels = getLabels(locale);

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
              ◇ {labels.onlineAiStylist}
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
          {locale === "tr" ? "önizleme" : "preview"} ✦
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Bubble side="them" palette={palette} accent={accent}>{labels.greeting}</Bubble>
        <Bubble side="me" palette={palette} accent={accent}>{labels.chatPreviewBubble1}</Bubble>
        <Bubble side="them" palette={palette} accent={accent}>
          {labels.chatPreviewBubble2}
        </Bubble>
        <div style={{ display: "flex", gap: 10, paddingLeft: 8 }}>
          {(["sun-up-knit", "wide-trouser", "atelier-mini"] as const).map((pid) => (
            <div key={pid} style={{ width: 86 }}>
              <ProductImage
                src={PRODUCT_IMAGES[pid]}
                alt={pid}
                ratio="3 / 4"
              />
            </div>
          ))}
        </div>
        <Bubble side="them" palette={palette} accent={accent}>
          {labels.chatPreviewBubble3}
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
  const { locale } = useLocale();
  const labels = getLabels(locale);
  const quotes = [
    [labels.pressQuote1, "Vogue Europe"],
    [labels.pressQuote2, "It's Nice That"],
    [labels.pressQuote3, "Monocle"],
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
