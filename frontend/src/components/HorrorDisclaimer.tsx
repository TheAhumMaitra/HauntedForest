"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { AlertTriangle, Ghost, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SERIOUS_MODE_KEY,
  SERIOUS_MODE_EVENT,
} from "./MonsterEncounter";

const DISCLAIMER_KEY = "haunted_disclaimer_viewed";
export const DISCLAIMER_EVENT = "haunted_disclaimer_change";

function subscribe(callback: () => void) {
  window.addEventListener(DISCLAIMER_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DISCLAIMER_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
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

  const dismissModal = useCallback((serious = false) => {
    localStorage.setItem(DISCLAIMER_KEY, "true");
    if (serious) {
      localStorage.setItem(SERIOUS_MODE_KEY, "true");
      window.dispatchEvent(
        new CustomEvent(SERIOUS_MODE_EVENT, { detail: { serious: true } })
      );
    }
    window.dispatchEvent(new CustomEvent(DISCLAIMER_EVENT));
    setIsOpen(false);
  }, []);

  const handleEnterHaunted = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    dismissModal(false);
  };

  const handleEnterSerious = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    dismissModal(true);
  };

  // Keyboard accessibility: ESC key to enter haunted mode
  useEffect(() => {
    if (hasViewed || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismissModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasViewed, isOpen, dismissModal]);

  if (hasViewed || !isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      onClick={() => dismissModal(false)}
      className="fixed inset-0 z-[999998] flex items-center justify-center p-3 sm:p-4 overflow-y-auto min-h-[100dvh] min-h-[100vh] bg-black/92 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-[calc(100vw-1.5rem)] max-w-[460px] max-h-[calc(100dvh-1.5rem)] flex flex-col rounded-2xl sm:rounded-3xl border border-red-900/60 bg-[#0a0507] p-4 sm:p-6 text-foreground shadow-[0_0_40px_rgba(220,38,38,0.35)] overflow-hidden"
      >
        {/* Subtle Ambient Glow bounded inside container */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-56 rounded-full bg-red-600/20 blur-2xl" />
        </div>

        {/* Top Bar with Badge & Quick Close Button */}
        <div className="relative mb-2.5 sm:mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-red-500">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500 animate-pulse" />
            <span>Content Advisory</span>
          </div>

          <button
            type="button"
            onClick={() => dismissModal(false)}
            aria-label="Dismiss disclaimer"
            className="rounded-full p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer touch-manipulation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <h2
          id="disclaimer-title"
          className="relative text-lg sm:text-2xl font-bold font-serif tracking-tight text-white mb-2"
        >
          Welcome to the Haunted Forest
        </h2>

        {/* Description */}
        <p className="relative text-xs sm:text-sm leading-relaxed text-zinc-300 mb-2.5 sm:mb-3 font-sans">
          This website is designed with an immersive horror atmosphere containing{" "}
          <strong className="text-red-400">
            floating entities, red eyes, ambient whispers, and spontaneous monster encounters
          </strong>.
        </p>

        {/* Mode explanation */}
        <div className="relative text-[11px] sm:text-xs font-mono text-zinc-400 mb-3.5 sm:mb-4 border-l-2 border-red-600/60 bg-red-950/20 py-1.5 px-2.5 rounded-r-lg leading-relaxed">
          Choose <span className="text-red-400 font-semibold">Haunted</span> for full immersion or{" "}
          <span className="text-emerald-400 font-semibold">Serious Mode</span> to disable all monsters and effects.
        </div>

        {/* Action Buttons: 2-column grid for compact mobile fit */}
        <div className="relative grid grid-cols-2 gap-2 sm:gap-3 pt-1">
          <Button
            onClick={handleEnterHaunted}
            type="button"
            className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-red-500/60 bg-red-950/90 hover:bg-red-900 active:scale-95 text-red-100 font-mono text-[11px] sm:text-xs uppercase tracking-wider py-2.5 sm:py-3.5 px-2 sm:px-4 min-h-[42px] sm:min-h-[46px] shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer touch-manipulation transition-all"
          >
            <Ghost className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span className="truncate">Enter Haunted</span>
          </Button>

          <Button
            onClick={handleEnterSerious}
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 text-zinc-200 font-mono text-[11px] sm:text-xs uppercase tracking-wider py-2.5 sm:py-3.5 px-2 sm:px-4 min-h-[42px] sm:min-h-[46px] cursor-pointer touch-manipulation transition-all"
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Serious Mode</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
