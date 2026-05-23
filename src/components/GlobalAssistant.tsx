"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AIAssistant, FloatingLauncher } from "./AIAssistant";
import type { FunctionCall } from "@/lib/gemini-live";
import { getAllSlugs } from "@/lib/products";

const VALID_SLUGS = new Set(getAllSlugs());
const VALID_CATEGORIES = new Set([
  "women",
  "accessories",
  "shoes",
  "tailoring",
  "journal",
]);

import { useLocale } from "@/lib/LocaleContext";
import { getLabels } from "@/lib/i18n";

export function GlobalAssistant() {
  const [aiOpen, setAiOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale } = useLocale();
  const labels = getLabels(locale);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    console.log("[SHOLÉ] GlobalAssistant mounted");

    const handleOpen = () => {
      console.log("[SHOLÉ] open-ai event received");
      setAiOpen(true);
    };

    window.addEventListener("open-ai", handleOpen);
    return () => window.removeEventListener("open-ai", handleOpen);
  }, []);


  const handleToolCall = useCallback(
    (calls: FunctionCall[]) => {
      const asStr = (v: unknown) => (typeof v === "string" ? v : "");
      for (const call of calls) {
        console.log("[SHOLÉ] tool_call:", call.name, call.args);

        if (call.name === "navigate_to") {
          const section = asStr(call.args.section) || asStr(call.args.page);
          if (!section) continue;
          const scrollTo = () => {
            const el = document.getElementById(section);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          };
          if (pathname !== "/") {
            router.push("/");
            setTimeout(scrollTo, 500);
          } else {
            scrollTo();
          }
        }

        if (call.name === "navigate_category") {
          const category = asStr(call.args.category);
          if (VALID_CATEGORIES.has(category)) {
            router.push(`/${category}`);
            // Smoothly scroll down after a short delay so the user sees the products
            setTimeout(() => {
              window.scrollBy({ top: window.innerHeight * 0.4, behavior: "smooth" });
            }, 800);
          } else {
            console.warn(`[SHOLÉ] invalid category: "${category}"`);
          }
        }

        if (call.name === "show_product") {
          const productId = asStr(call.args.product_id);
          if (VALID_SLUGS.has(productId)) {
            router.push(`/product/${productId}`);
            setTimeout(() => {
              window.scrollBy({ top: window.innerHeight * 0.4, behavior: "smooth" });
            }, 800);
          } else {
            console.warn(
              `[SHOLÉ] hallucinated product slug ignored: "${productId}"`
            );
          }
        }

        if (call.name === "recommend_outfit") {
          const items = asStr(call.args.items);
          if (items) {
            const first = items
              .split(",")[0]
              ?.trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            if (first && VALID_SLUGS.has(first)) {
              router.push(`/product/${first}`);
              setTimeout(() => {
                window.scrollBy({ top: window.innerHeight * 0.4, behavior: "smooth" });
              }, 800);
            } else {
              console.warn(
                `[SHOLÉ] outfit hero piece "${first}" not in catalog`
              );
            }
          }
        }
      }
    },
    [router, pathname]
  );

  if (!mounted) return null;

  return (
    <div style={{ position: "relative", zIndex: 9999 }}>
      {!aiOpen && (
        <FloatingLauncher 
          onClick={() => setAiOpen(true)} 
          label={labels.askShole} 
        />
      )}
      <AIAssistant
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onToolCall={handleToolCall}
        locale={locale}
      />
    </div>
  );
}
