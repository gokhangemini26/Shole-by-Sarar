"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AIAssistant, FloatingLauncher } from "./AIAssistant";
import { PALETTES } from "@/lib/design";
import { getLabels, Locale } from "@/lib/i18n";
import type { FunctionCall } from "@/lib/gemini-live";

export function GlobalAssistant() {
  const [aiOpen, setAiOpen] = React.useState(false);
  const [locale, setLocale] = React.useState<Locale>("en");
  
  const router = useRouter();
  const pathname = usePathname();
  const palette = PALETTES.warmCream;
  const accent = palette.accent;
  const labels = getLabels(locale);

  useEffect(() => {
    const handleOpen = () => setAiOpen(true);
    window.addEventListener("open-ai", handleOpen);
    return () => window.removeEventListener("open-ai", handleOpen);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleToolCall = React.useCallback((calls: FunctionCall[]) => {
    const asStr = (v: unknown): string => (typeof v === "string" ? v : "");
    calls.forEach((call) => {
      console.log("[SHOLÉ] Tool call:", call.name, call.args);

      if (call.name === "navigate_to") {
        const section = asStr(call.args.section) || asStr(call.args.page);
        if (section) {
          if (pathname !== "/") {
            router.push("/");
            setTimeout(() => {
              const el = document.getElementById(section);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 500);
          } else {
            const el = document.getElementById(section);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }

      if (call.name === "change_language") {
        const newLocale = asStr(call.args.locale).toLowerCase() as Locale;
        if (["en", "tr", "de", "it", "zh"].includes(newLocale)) {
          setLocale(newLocale);
        }
      }

      if (call.name === "navigate_category") {
        const category = asStr(call.args.category);
        if (category) router.push(`/${category}`);
      }

      if (call.name === "show_product") {
        const productId = asStr(call.args.product_id);
        if (productId) router.push(`/product/${productId}`);
      }

      if (call.name === "recommend_outfit") {
        const items = asStr(call.args.items);
        if (items) {
          const firstProduct = items
            .split(",")[0]
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          if (firstProduct) router.push(`/product/${firstProduct}`);
          else router.push("/");
        }
      }
    });
  }, [pathname, router]);

  return (
    <>
      {!aiOpen && (
        <FloatingLauncher
          palette={palette}
          accent={accent}
          onClick={() => setAiOpen(true)}
          label={labels.askShole}
        />
      )}
      <AIAssistant
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        palette={palette}
        accent={accent}
        labels={labels}
        onToolCall={handleToolCall}
      />
    </>
  );
}
