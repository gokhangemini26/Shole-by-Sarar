"use client";

import React from "react";
import { PALETTES } from "@/lib/design";
import { getLabels, Locale } from "@/lib/i18n";
import { TopAnnounce, Nav, MarqueeRow, Footer } from "@/components/SiteShell";
import { Hero, CollectionGrid, PressStrip, AIInvite, StorySplit } from "@/components/Homepage";
import { IntroVideo } from "@/components/IntroVideo";

export default function DesktopHome() {
  const [locale, setLocale] = React.useState<Locale>("en");
  const [highlight, setHighlight] = React.useState<string | null>(null);
  const [highlightedProduct, setHighlightedProduct] = React.useState<string | null>(null);
  const [introOpen, setIntroOpen] = React.useState(true);
  const palette = PALETTES.warmCream;
  const accent = palette.accent;
  const labels = getLabels(locale);

  // Update html lang attribute
  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Highlight style for sections
  const highlightStyle = (sectionId: string): React.CSSProperties =>
    highlight === sectionId
      ? {
          outline: `3px solid ${accent}`,
          outlineOffset: 8,
          borderRadius: 16,
          transition: "outline 0.4s ease",
        }
      : {};

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: "100vh" }}>
      <TopAnnounce accent={accent} />
      <Nav palette={palette} onOpenAI={() => window.dispatchEvent(new CustomEvent("open-ai"))} />

      <div className="rise" style={highlightStyle("hero")}>
        <Hero palette={palette} accent={accent} onOpenAI={() => window.dispatchEvent(new CustomEvent("open-ai"))} />
      </div>

      <MarqueeRow
        accent={accent}
        items={[
          "soft tailoring",
          "made in istanbul",
          "try on with sholé",
          "wool ✦ silk ✦ linen",
          "chapter 01",
          "free shipping €200+",
          "made to last",
        ]}
      />

      <div style={highlightStyle("collection")}>
        <CollectionGrid palette={palette} accent={accent} highlightedProduct={highlightedProduct} />
      </div>

      <div style={highlightStyle("press")}>
        <PressStrip palette={palette} />
      </div>

      <div style={highlightStyle("ai-invite")}>
        <AIInvite palette={palette} accent={accent} onOpenAI={() => window.dispatchEvent(new CustomEvent("open-ai"))} />
      </div>

      <div style={highlightStyle("story")}>
        <StorySplit palette={palette} accent={accent} />
      </div>

      <Footer palette={palette} accent={accent} />

      {introOpen && <IntroVideo accent={accent} onDone={() => setIntroOpen(false)} />}
    </div>
  );
}
