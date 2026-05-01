/* ═══════════════════════════════════════════════════════════════════════
   Design tokens & types shared across all components
   ═══════════════════════════════════════════════════════════════════════ */

export const TYPE = {
  display: '"Fraunces", "Playfair Display", Georgia, serif',
  sans: '"Outfit", "Inter", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
};

export interface Palette {
  bg: string;
  bgBlur: string;
  ink: string;
  muted: string;
  line: string;
  deep: string;
  accent: string;
}

export const PALETTES: Record<string, Palette> = {
  warmCream: {
    bg: "#FAF7F0",
    bgBlur: "rgba(250,247,240,0.85)",
    ink: "#1C1814",
    muted: "#8A7E68",
    line: "rgba(28,24,20,0.10)",
    deep: "#2A211A",
    accent: "#D98A3D",
  },
  sandClay: {
    bg: "#F1E8D8",
    bgBlur: "rgba(241,232,216,0.85)",
    ink: "#2B221A",
    muted: "#8A7458",
    line: "rgba(43,34,26,0.12)",
    deep: "#3D2C1F",
    accent: "#C44A35",
  },
  oliveBone: {
    bg: "#F4F0E6",
    bgBlur: "rgba(244,240,230,0.85)",
    ink: "#1F2014",
    muted: "#7A7A5C",
    line: "rgba(31,32,20,0.10)",
    deep: "#2C2D1B",
    accent: "#7A8B3E",
  },
  rosePlum: {
    bg: "#F5EAE0",
    bgBlur: "rgba(245,234,224,0.85)",
    ink: "#2A1822",
    muted: "#8E6B72",
    line: "rgba(42,24,34,0.10)",
    deep: "#3A1D2B",
    accent: "#C2566A",
  },
};

export const DARK_PALETTE: Palette = {
  bg: "#1C1814",
  bgBlur: "rgba(28,24,20,0.85)",
  ink: "#F4EFE6",
  muted: "#9A8E78",
  line: "rgba(244,239,230,0.12)",
  deep: "#0F0C09",
  accent: "#E89D55",
};
