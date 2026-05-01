"use client";

import React from "react";
import { PALETTES } from "@/lib/design";
import { getLabels, Locale } from "@/lib/i18n";
import { TopAnnounce, Nav, MarqueeRow, Footer } from "@/components/SiteShell";
import { Hero, CollectionGrid, PressStrip, AIInvite, StorySplit } from "@/components/Homepage";
import { AIAssistant, FloatingLauncher } from "@/components/AIAssistant";
import type { FunctionCall } from "@/lib/gemini-live";

export default function HomePage() {
  const [aiOpen, setAiOpen] = React.useState(false);
  const [locale, setLocale] = React.useState<Locale>("en");
  const [highlight, setHighlight] = React.useState<string | null>(null);
  const palette = PALETTES.warmCream;
  const accent = palette.accent;
  const labels = getLabels(locale);

  // Update html lang attribute
  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Handle tool calls from AI
  const handleToolCall = React.useCallback((calls: FunctionCall[]) => {
    calls.forEach((call) => {
      console.log("[SHOLÉ] Tool call:", call.name, call.args);

      if (call.name === "navigate_to") {
        const section = call.args.section || call.args.page;
        if (section) {
          const el = document.getElementById(section);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            // Highlight effect
            setHighlight(section);
            setTimeout(() => setHighlight(null), 3000);
          }
        }
      }

      if (call.name === "change_language") {
        const newLocale = (call.args.locale || "en").toLowerCase() as Locale;
        if (["en", "tr", "de", "it", "zh"].includes(newLocale)) {
          setLocale(newLocale);
        }
      }

      if (call.name === "show_product") {
        // Scroll to collection and highlight
        const el = document.getElementById("collection");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlight("collection");
        setTimeout(() => setHighlight(null), 3000);
      }

      if (call.name === "recommend_outfit") {
        // Scroll to collection
        const el = document.getElementById("collection");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (call.name === "start_tryon") {
        // Already handled in AIAssistant
      }
    });
  }, []);

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
      <Nav palette={palette} onOpenAI={() => setAiOpen(true)} />

      <div className="rise" style={highlightStyle("hero")}>
        <Hero palette={palette} accent={accent} onOpenAI={() => setAiOpen(true)} />
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
        <CollectionGrid palette={palette} accent={accent} />
      </div>

      <div style={highlightStyle("press")}>
        <PressStrip palette={palette} />
      </div>

      <div style={highlightStyle("ai-invite")}>
        <AIInvite palette={palette} accent={accent} onOpenAI={() => setAiOpen(true)} />
      </div>

      <div style={highlightStyle("story")}>
        <StorySplit palette={palette} accent={accent} />
      </div>

      <Footer palette={palette} accent={accent} />

      {/* Floating launcher when chat is closed */}
      {!aiOpen && (
        <FloatingLauncher
          palette={palette}
          accent={accent}
          onClick={() => setAiOpen(true)}
          label={labels.askShole}
        />
      )}

      {/* AI Assistant */}
      <AIAssistant
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        palette={palette}
        accent={accent}
        labels={labels}
        onToolCall={handleToolCall}
      />
    </div>
  );
}
