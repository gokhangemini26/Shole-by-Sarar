"use client";

import React from "react";
import { TYPE } from "@/lib/design";
import { useLocale } from "@/lib/LocaleContext";
import { getLabels } from "@/lib/i18n";

export function IntroVideo({
  accent,
  onDone,
}: {
  accent: string;
  onDone: () => void;
}) {
  const { locale } = useLocale();
  const labels = getLabels(locale);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = React.useState<"playing" | "exiting">("playing");
  const [progress, setProgress] = React.useState(0);
  const [showCopy, setShowCopy] = React.useState(false);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    
    // ensure autoplay works
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
    
    const onTime = () => {
      if (!v.duration) return;
      setProgress(v.currentTime / v.duration);
      // bring up the headline after the very first beat
      if (v.currentTime > 0.6 && !showCopy) setShowCopy(true);
    };
    
    const onEnd = () => exit();
    
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, [showCopy]);

  const exit = () => {
    setPhase("exiting");
    setTimeout(onDone, 900);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sholeFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sholeBlip {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}} />
      
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "#0A0807",
          overflow: "hidden",
          transition: "opacity 0.9s ease, transform 0.9s cubic-bezier(0.7, 0, 0.3, 1)",
          opacity: phase === "exiting" ? 0 : 1,
          transform: phase === "exiting" ? "scale(1.08)" : "scale(1)",
          pointerEvents: phase === "exiting" ? "none" : "auto",
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // subtle Ken Burns; combine with film grain via overlay
            transform: phase === "playing" ? "scale(1.04)" : "scale(1.08)",
            transition: "transform 6s linear",
            filter: "contrast(1.04) saturate(1.05)",
          }}
        />

        {/* Vignette + warm wash for legibility */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)," +
              "linear-gradient(180deg, rgba(10,8,7,0.35) 0%, rgba(10,8,7,0.10) 30%, rgba(10,8,7,0.65) 100%)",
          }}
        />

        {/* Subtle film grain */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
            backgroundSize: "180px 180px",
            pointerEvents: "none",
          }}
        />

        {/* Top bar — mute + skip */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "28px 36px",
            animation: "sholeFade 1.2s ease 0.3s both",
          }}
        >
          <div
            style={{
              color: "#FAF7F0",
              fontFamily: TYPE.mono,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF4A3D",
                boxShadow: "0 0 8px #FF4A3D",
                animation: "sholeBlip 1.4s ease infinite",
              }}
            />
            {labels.introRec}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={exit}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#FAF7F0",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                padding: "8px 14px",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: TYPE.mono,
                fontSize: 11,
                letterSpacing: "0.08em",
              }}
            >
              {labels.introSkip}
            </button>
          </div>
        </div>

        {/* Center copy — fades in over the video */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#FAF7F0",
            textAlign: "center",
            padding: "0 24px",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: TYPE.mono,
              fontSize: 11,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              opacity: showCopy ? 0.85 : 0,
              transition: "opacity 1.4s ease",
              marginBottom: 28,
            }}
          >
            {labels.introLocation}
          </div>
          <div
            style={{
              fontFamily: TYPE.display,
              fontSize: "clamp(80px, 16vw, 240px)",
              lineHeight: 0.85,
              fontWeight: 300,
              letterSpacing: "-0.04em",
              opacity: showCopy ? 1 : 0,
              transform: showCopy ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 1.6s ease 0.2s, transform 1.6s cubic-bezier(0.2, 0.7, 0.3, 1) 0.2s",
              textShadow: "0 4px 40px rgba(0,0,0,0.4)",
            }}
          >
            SHOL
            <em
              style={{
                color: accent,
                fontStyle: "italic",
                display: "inline-block",
                transform: "translateY(0.04em)",
              }}
            >
              É
            </em>
          </div>
          <div
            style={{
              fontFamily: TYPE.display,
              fontStyle: "italic",
              fontSize: "clamp(20px, 2.6vw, 32px)",
              marginTop: 18,
              opacity: showCopy ? 0.92 : 0,
              transition: "opacity 1.6s ease 0.6s",
              maxWidth: 720,
              lineHeight: 1.3,
            }}
            dangerouslySetInnerHTML={{ __html: labels.introDesc }}
          />
        </div>

        {/* Bottom bar — progress + tagline + enter cue */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            padding: "0 36px 28px",
            animation: "sholeFade 1.2s ease 0.8s both",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              color: "#FAF7F0",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: TYPE.mono,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
              dangerouslySetInnerHTML={{ __html: labels.introCue }}
            />
          </div>
          <div
            style={{
              height: 2,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(2, progress * 100)}%`,
                background: accent,
                transition: "width 0.3s linear",
                boxShadow: `0 0 12px ${accent}`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
