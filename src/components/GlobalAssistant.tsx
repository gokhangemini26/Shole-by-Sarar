"use client";

import React, { useEffect, useState } from "react";
import { AIAssistant, FloatingLauncher } from "./AIAssistant";

export function GlobalAssistant() {
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setAiOpen(true);
    window.addEventListener("open-ai", handleOpen);
    return () => window.removeEventListener("open-ai", handleOpen);
  }, []);

  return (
    <>
      {!aiOpen && <FloatingLauncher onClick={() => setAiOpen(true)} />}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
