"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AIAssistant, FloatingLauncher } from "./AIAssistant";
import type { FunctionCall } from "@/lib/gemini-live";
import { getAllSlugs } from "@/lib/products";
import { useCart } from "@/lib/CartContext";

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

// A cinematic, slow scroll function to gently reveal the page contents
function slowScrollDown() {
  // Try to find the main content area to scroll to, otherwise scroll 60vh
  const distance = Math.min(window.innerHeight * 0.6, 600);
  const duration = 2500; // 2.5 seconds for a very slow, elegant scroll
  const start = window.scrollY;
  const startTime = performance.now();
  
  function step(time: number) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Cubic ease-in-out
    const ease = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
    window.scrollTo(0, start + distance * ease);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

export function GlobalAssistant() {
  const [aiOpen, setAiOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale } = useLocale();
  const labels = getLabels(locale);

  const router = useRouter();
  const pathname = usePathname();
  const { setCartOpen } = useCart();

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
      
      let navigated = false;
      const triggerScroll = () => {
        if (!navigated) {
          navigated = true;
          // Wait for Next.js to mount the new page before scrolling
          setTimeout(slowScrollDown, 600);
        }
      };

      for (const call of calls) {
        console.log("[SHOLÉ] tool_call:", call.name, call.args);

        if (call.name === "open_cart") {
          setCartOpen(true);
        }

        if (call.name === "navigate_to" && !navigated) {
          const section = asStr(call.args.section) || asStr(call.args.page);
          if (!section) continue;
          navigated = true;
          const scrollToSection = () => {
            const el = document.getElementById(section);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          };
          if (pathname !== "/") {
            router.push("/");
            setTimeout(scrollToSection, 600);
          } else {
            scrollToSection();
          }
        }

        if (call.name === "navigate_category" && !navigated) {
          const category = asStr(call.args.category);
          if (VALID_CATEGORIES.has(category)) {
            router.push(`/${category}`);
            triggerScroll();
          } else {
            console.warn(`[SHOLÉ] invalid category: "${category}"`);
          }
        }

        if (call.name === "show_product" && !navigated) {
          const productId = asStr(call.args.product_id);
          if (VALID_SLUGS.has(productId)) {
            router.push(`/product/${productId}?tour=true`);
          } else {
            console.warn(
              `[SHOLÉ] hallucinated product slug ignored: "${productId}"`
            );
          }
        }

        if (call.name === "recommend_outfit" && !navigated) {
          const items = asStr(call.args.items);
          if (items) {
            const first = items
              .split(",")[0]
              ?.trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            if (first && VALID_SLUGS.has(first)) {
              router.push(`/product/${first}?tour=true`);
            } else {
              console.warn(
                `[SHOLÉ] outfit hero piece "${first}" not in catalog`
              );
            }
          }
        }
      }
    },
    [router, pathname, setCartOpen]
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
