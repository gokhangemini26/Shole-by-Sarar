"use client";

import React from "react";
import type { Locale } from "./i18n";

/* ═══════════════════════════════════════════════════════════════════════
   Locale Context — auto-detects TR vs EN based on browser / IP
   ═══════════════════════════════════════════════════════════════════════ */

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleCtx = React.createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
});

export function useLocale() {
  return React.useContext(LocaleCtx);
}

/** Detect if the user is likely Turkish via navigator.language */
function detectFromBrowser(): Locale | null {
  if (typeof navigator === "undefined") return null;
  const lang = (navigator.language || "").toLowerCase();
  if (lang.startsWith("tr")) return "tr";
  return null;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleRaw] = React.useState<Locale>("en");
  const [ready, setReady] = React.useState(false);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleRaw(l);
    try {
      localStorage.setItem("shole-locale", l);
    } catch { /* ignore */ }
    document.documentElement.lang = l;
  }, []);

  React.useEffect(() => {
    // 1. Check localStorage for saved preference
    try {
      const saved = localStorage.getItem("shole-locale") as Locale | null;
      if (saved && (saved === "en" || saved === "tr")) {
        setLocaleRaw(saved);
        document.documentElement.lang = saved;
        setReady(true);
        return;
      }
    } catch { /* ignore */ }

    // 2. Detect from browser language
    const browserLocale = detectFromBrowser();
    if (browserLocale) {
      setLocaleRaw(browserLocale);
      document.documentElement.lang = browserLocale;
      setReady(true);
      return;
    }

    // 3. Try IP-based geolocation (non-blocking)
    setReady(true); // Don't block rendering
    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data) => {
        if (data?.country_code === "TR") {
          setLocale("tr");
        }
      })
      .catch(() => {
        /* silently fallback to EN */
      });
  }, [setLocale]);

  // Prevent flash — render children immediately (locale defaults to "en")
  return (
    <LocaleCtx.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleCtx.Provider>
  );
}
