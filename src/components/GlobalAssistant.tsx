"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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

// Height of the sticky nav (+ a small breathing gap) so we never scroll a
// section's images partly under the header.
function navOffset() {
  const nav = document.getElementById("site-nav");
  const h = nav ? nav.getBoundingClientRect().height : 72;
  return h + 24;
}

// Cinematic slow scroll that lands cleanly: aligns a target element's top
// just below the sticky nav (full images, symmetric framing). Falls back to a
// gentle partial reveal if the element isn't on the page.
function slowScrollToTarget(elementId?: string) {
  let targetY: number;
  const el = elementId ? document.getElementById(elementId) : null;
  if (el) {
    targetY = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset());
  } else {
    targetY = Math.min(window.innerHeight * 0.5, 480);
  }

  const start = window.scrollY;
  const distance = targetY - start;
  if (Math.abs(distance) < 4) return;
  const duration = 1800;
  const startTime = performance.now();

  function step(time: number) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + distance * ease);
    if (progress < 1) window.requestAnimationFrame(step);
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
  const { setCartOpen, addToCart } = useCart();

  // After add_to_cart we preview the cart for 3s then auto-close so the page
  // stays in focus. A follow-up open_cart (user keeps engaging the cart)
  // cancels the auto-close and leaves it open.
  const cartAutoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearCartTimer = useCallback(() => {
    if (cartAutoCloseTimer.current) {
      clearTimeout(cartAutoCloseTimer.current);
      cartAutoCloseTimer.current = null;
    }
  }, []);
  useEffect(() => () => clearCartTimer(), [clearCartTimer]);

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

      for (const call of calls) {
        console.log("[SHOLÉ] tool_call:", call.name, call.args);

        if (call.name === "open_cart") {
          clearCartTimer(); // user is engaging the cart → keep it open
          setCartOpen(true);
        }

        if (call.name === "add_to_cart") {
          const productId = asStr(call.args.product_id);
          const size = asStr(call.args.size) || "M";
          if (VALID_SLUGS.has(productId)) {
            addToCart(productId, size);
            setCartOpen(true);
            // Preview the cart for 3s, then close to return focus to the page.
            clearCartTimer();
            cartAutoCloseTimer.current = setTimeout(() => {
              setCartOpen(false);
              cartAutoCloseTimer.current = null;
            }, 3000);
          } else {
            console.warn(`[SHOLÉ] add_to_cart invalid slug: "${productId}"`);
          }
        }

        if (call.name === "close_cart") {
          clearCartTimer();
          setCartOpen(false);
        }

        if (call.name === "navigate_to" && !navigated) {
          const section = asStr(call.args.section) || asStr(call.args.page);
          if (!section) continue;
          navigated = true;
          // Slow-scroll the section's top to just below the nav so its
          // images are framed whole, never clipped at the top.
          if (pathname !== "/") {
            router.push("/");
            setTimeout(() => slowScrollToTarget(section), 650);
          } else {
            slowScrollToTarget(section);
          }
        }

        if (call.name === "navigate_category" && !navigated) {
          const category = asStr(call.args.category);
          if (VALID_CATEGORIES.has(category)) {
            navigated = true;
            router.push(`/${category}`);
            // Reveal the product grid aligned under the nav (full, symmetric
            // first row) instead of a blind partial scroll that halves images.
            setTimeout(() => slowScrollToTarget("collection"), 650);
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
    [router, pathname, setCartOpen, addToCart, clearCartTimer]
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
