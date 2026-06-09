"use client"

import { Mic } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Fixed waveform heights (%) for the compact signal animation.
const COMPACT_BARS = [45, 75, 55, 90, 60, 85, 50, 70, 40]

interface AIVoiceInputProps {
  onStart?: () => void
  onStop?: (duration: number) => void
  visualizerBars?: number
  demoMode?: boolean
  demoInterval?: number
  className?: string
  isActive?: boolean
  isConnecting?: boolean
  /** Minimal inline layout: just the mic button + a small signal animation.
   *  No timer, no "Click to speak" label. For the slim chat bar. */
  compact?: boolean
  /** When true (and active) the signal animation is emphasised — used while
   *  the AI is speaking. */
  isSpeaking?: boolean
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className,
  isActive = false,
  isConnecting = false,
  compact = false,
  isSpeaking = false,
}: AIVoiceInputProps) {
  const [time, setTime] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isDemo, setIsDemo] = useState(demoMode)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    if (isActive) {
      intervalId = setInterval(() => setTime((t) => t + 1), 1000)
    } else {
      setTime(0)
    }
    return () => clearInterval(intervalId)
  }, [isActive])

  useEffect(() => {
    if (!isDemo) return
    let timeoutId: ReturnType<typeof setTimeout>
    const runAnimation = () => {
      onStart?.()
      timeoutId = setTimeout(() => {
        onStop?.(demoInterval / 1000)
        timeoutId = setTimeout(runAnimation, 1000)
      }, demoInterval)
    }
    const initialTimeout = setTimeout(runAnimation, 100)
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(initialTimeout)
    }
  }, [isDemo, demoInterval, onStart, onStop])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleClick = () => {
    if (isConnecting) return
    if (isDemo) {
      setIsDemo(false)
    } else {
      isActive ? onStop?.(time) : onStart?.()
    }
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <button
          type="button"
          onClick={handleClick}
          disabled={isConnecting}
          title={isActive ? "Konuşmayı durdur" : "Konuşmaya başla"}
          className={cn(
            "relative shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors",
            isActive
              ? "bg-[#C77A2D] text-white"
              : "bg-[#1C1814]/8 text-[#1C1814]/70 hover:bg-[#1C1814]/15 hover:text-[#1C1814]"
          )}
        >
          {isConnecting ? (
            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Inline signal animation — runs while the session is live; copper +
            stronger while the AI is speaking. Heights are a fixed waveform
            pattern; animate-pulse + staggered delays give the live feel. */}
        {isActive && (
          <div className="flex items-center gap-[2px] h-4">
            {COMPACT_BARS.slice(0, Math.min(visualizerBars, COMPACT_BARS.length)).map((h, i) => (
              <div
                key={i}
                className={cn(
                  "w-[2px] rounded-full animate-pulse",
                  isSpeaking ? "bg-[#C77A2D]" : "bg-[#1C1814]/40"
                )}
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: isSpeaking ? "0.6s" : "1s",
                }}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            isActive ? "bg-none" : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={handleClick}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <div className="w-6 h-6 rounded-full border-2 border-current border-t-transparent animate-spin opacity-70" />
          ) : isActive ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            isActive ? "text-black/70 dark:text-white/70" : "text-black/30 dark:text-white/30"
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                isActive
                  ? "bg-black/50 dark:bg-white/50 animate-pulse"
                  : "bg-black/10 dark:bg-white/10 h-1"
              )}
              style={
                isActive && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {isConnecting ? "Connecting..." : isActive ? "Listening..." : "Click to speak"}
        </p>
      </div>
    </div>
  )
}
