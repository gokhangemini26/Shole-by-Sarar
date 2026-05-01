"use client";

import React from "react";
import { PALETTES } from "@/lib/design";
import { TopAnnounce, Nav, MarqueeRow, Footer } from "@/components/SiteShell";
import { Hero, CollectionGrid, PressStrip, AIInvite, StorySplit } from "@/components/Homepage";
import { AIAssistant, FloatingLauncher } from "@/components/AIAssistant";

export default function HomePage() {
  const [aiOpen, setAiOpen] = React.useState(false);
  const palette = PALETTES.warmCream;
  const accent = palette.accent;

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: "100vh" }}>
      <TopAnnounce accent={accent} />
      <Nav palette={palette} onOpenAI={() => setAiOpen(true)} />

      <div className="rise">
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

      <CollectionGrid palette={palette} accent={accent} />
      <PressStrip palette={palette} />
      <AIInvite palette={palette} accent={accent} onOpenAI={() => setAiOpen(true)} />
      <StorySplit palette={palette} accent={accent} />
      <Footer palette={palette} accent={accent} />

      {/* Floating launcher when chat is closed */}
      {!aiOpen && (
        <FloatingLauncher palette={palette} accent={accent} onClick={() => setAiOpen(true)} />
      )}

      {/* AI Assistant chat */}
      <AIAssistant
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        surface="bubble"
        palette={palette}
        accent={accent}
      />
    </div>
  );
}
