"use client";

import React, { useState, useSyncExternalStore } from "react";
import { AlertTriangle, Ghost, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SERIOUS_MODE_KEY,
  SERIOUS_MODE_EVENT,
} from "./MonsterEncounter";

const DISCLAIMER_KEY = "haunted_disclaimer_viewed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(DISCLAIMER_KEY) === "true";
}

function getServerSnapshot() {
  return true; // Don't show during SSR
}

export default function HorrorDisclaimer() {
  const hasViewed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(true);

  if (hasViewed || !isOpen) {
    return null;
  }

  const handleEnterHaunted = () => {
    localStorage.setItem(DISCLAIMER_KEY, "true");
    setIsOpen(false);
  };

  const handleEnterSerious = () => {
    localStorage.setItem(DISCLAIMER_KEY, "true");
    localStorage.setItem(SERIOUS_MODE_KEY, "true");
    window.dispatchEvent(
      new CustomEvent(SERIOUS_MODE_EVENT, { detail: { serious: true } })
    );
    setIsOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-[999998] flex items-center justify-center bg-black/85 backdrop-blur-md px-4 select-none animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-red-900/60 bg-[#0a0507] p-6 sm:p-8 text-foreground shadow-[0_0_60px_rgba(220,38,38,0.3)]">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-red-600/25 blur-3xl" />

        {/* Warning Badge */}
        <div className="relative mb-5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-red-500">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 animate-pulse" />
          <span>Content Advisory // Disclaimer</span>
        </div>

        {/* Title */}
        <h2
          id="disclaimer-title"
          className="relative text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white mb-3"
        >
          Welcome to the Haunted Forest
        </h2>

        {/* Description */}
        <p className="relative text-sm sm:text-base leading-relaxed text-zinc-300 mb-6 font-sans">
          This website is designed with an immersive horror atmosphere. It contains
          <strong className="text-red-400"> floating entities, red eyes, ambient whispers, sudden audio, and spontaneous monster encounters</strong>.
        </p>

        <p className="relative text-xs font-mono text-zinc-400 mb-6 border-l-2 border-red-600/50 pl-3">
          You can experience the haunted website as intended, or enter in{" "}
          <span className="text-emerald-400 font-semibold">Serious Mode</span> to disable all monsters, jumpscares, and horror effects.
        </p>

        {/* Action Buttons */}
        <div className="relative flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleEnterHaunted}
            type="button"
            className="flex-1 gap-2 rounded-full border border-red-500/60 bg-red-950/80 hover:bg-red-900 hover:border-red-400 text-red-100 font-mono text-xs uppercase tracking-wider py-5 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <Ghost className="h-4 w-4 text-red-400" />
            <span>Enter Haunted</span>
          </Button>

          <Button
            onClick={handleEnterSerious}
            type="button"
            variant="outline"
            className="flex-1 gap-2 rounded-full border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-mono text-xs uppercase tracking-wider py-5"
          >
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Serious Mode</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
