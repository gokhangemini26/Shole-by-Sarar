"use client";

import React, { useEffect, useState } from "react";
import { AIAssistant, FloatingLauncher } from "./AIAssistant";

export function GlobalAssistant() {
  const [aiOpen, setAiOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) return null;

  return (
    <div style={{ position: 'relative', zIndex: 9999 }}>
      {!aiOpen && <FloatingLauncher onClick={() => setAiOpen(true)} />}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
