"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

const OCCULT_GLYPHS = "†‡§ψ░▒▓█ᚠᚢᚦᚨᚱᚲᛋᛏ01XØΔΨΩ!?>~";

// Lightweight synthesized micro-static tick (Web Audio API, 12ms duration, very quiet)
class PossessedAudioEngine {
  private ctx: AudioContext | null = null;

  playTick() {
    try {
      if (!this.ctx && typeof window !== "undefined") {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280 + Math.random() * 200, now);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Audio context fallback
    }
  }
}

const possessedAudio = new PossessedAudioEngine();

interface PossessedTextProps {
  text: string;
  className?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  shudderOnHover?: boolean;
}

export default function PossessedText({
  text,
  className = "",
  as: Component = "span",
  shudderOnHover = true,
}: PossessedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isPossessed, setIsPossessed] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const isScramblingRef = useRef(false);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const triggerPossession = useCallback(() => {
    if (isScramblingRef.current) return;

    isScramblingRef.current = true;
    setIsPossessed(true);
    possessedAudio.playTick();

    const original = text;
    const length = original.length;
    const duration = 280; // 280ms duration
    const startTime = performance.now();

    const frame = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Number of characters resolved back to original
      const resolvedCount = Math.floor(progress * length);

      let scrambled = "";
      for (let i = 0; i < length; i++) {
        if (original[i] === " ") {
          scrambled += " ";
        } else if (i < resolvedCount) {
          scrambled += original[i];
        } else {
          scrambled += OCCULT_GLYPHS[Math.floor(Math.random() * OCCULT_GLYPHS.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(frame);
      } else {
        setDisplayText(original);
        setIsPossessed(false);
        isScramblingRef.current = false;
      }
    };

    animFrameRef.current = requestAnimationFrame(frame);
  }, [text]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <Component
      onMouseEnter={triggerPossession}
      onTouchStart={triggerPossession}
      className={`inline-block transition-colors duration-150 cursor-pointer ${
        isPossessed
          ? `text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] ${
              shudderOnHover ? "animate-possessed-shudder" : ""
            }`
          : ""
      } ${className}`}
    >
      {displayText}
    </Component>
  );
}
