"use client";

import React, { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { RotateCcw, Shield, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";

export const SERIOUS_MODE_KEY = "haunted_forest_serious_mode";
export const SERIOUS_MODE_EVENT = "haunted_serious_mode_change";
export const TRIGGER_MONSTER_EVENT = "trigger_monster_encounter";
export const ENCOUNTER_COUNT_KEY = "haunted_monster_encounter_count";
export const ENCOUNTER_COUNT_EVENT = "haunted_monster_encounter_count_change";

function subscribeSeriousMode(callback: () => void) {
  window.addEventListener(SERIOUS_MODE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SERIOUS_MODE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSeriousSnapshot() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SERIOUS_MODE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

function subscribeEncounterCount(callback: () => void) {
  window.addEventListener(ENCOUNTER_COUNT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(ENCOUNTER_COUNT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getEncounterSnapshot() {
  if (typeof window === "undefined") return 1;
  const saved = localStorage.getItem(ENCOUNTER_COUNT_KEY);
  if (!saved) return 1;
  const parsed = parseInt(saved, 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : 1;
}

function getEncounterServerSnapshot() {
  return 1;
}

export default function MonsterEncounter() {
  const [isActive, setIsActive] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isSeriousMode = useSyncExternalStore(
    subscribeSeriousMode,
    getSeriousSnapshot,
    getServerSnapshot
  );

  const encounterCount = useSyncExternalStore(
    subscribeEncounterCount,
    getEncounterSnapshot,
    getEncounterServerSnapshot
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Play monster audio with browser autoplay fallback
  const startMonsterAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 1.0;
    audio.currentTime = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch(() => {
          setIsPlayingAudio(false);
          // If browser blocked initial autoplay, unlock on next user interaction
          const unlock = () => {
            if (audio) {
              audio.play().then(() => setIsPlayingAudio(true)).catch(() => {});
            }
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("keydown", unlock);
            window.removeEventListener("touchstart", unlock);
          };
          window.addEventListener("pointerdown", unlock, { once: true });
          window.addEventListener("keydown", unlock, { once: true });
          window.addEventListener("touchstart", unlock, { once: true });
        });
    }
  }, []);

  const triggerEncounter = useCallback(() => {
    if (localStorage.getItem(SERIOUS_MODE_KEY) === "true") {
      return;
    }

    // "each time bigger": Increment encounter count each appearance
    const storedCount = parseInt(localStorage.getItem(ENCOUNTER_COUNT_KEY) || "0", 10);
    const nextCount = storedCount + 1;
    localStorage.setItem(ENCOUNTER_COUNT_KEY, nextCount.toString());
    window.dispatchEvent(new CustomEvent(ENCOUNTER_COUNT_EVENT));

    setIsActive(true);
    document.body.style.overflow = "hidden";
    startMonsterAudio();
  }, [startMonsterAudio]);

  const escapeEncounter = useCallback(() => {
    setIsActive(false);
    setIsPlayingAudio(false);
    document.body.style.overflow = "";

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Schedule next encounter between 5 to 10 minutes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const nextDelay = 300000 + Math.random() * 300000;
    timeoutRef.current = setTimeout(() => {
      triggerEncounter();
    }, nextDelay);
  }, [triggerEncounter]);

  const enableSeriousModeAndEscape = useCallback(() => {
    localStorage.setItem(SERIOUS_MODE_KEY, "true");
    window.dispatchEvent(
      new CustomEvent(SERIOUS_MODE_EVENT, { detail: { serious: true } })
    );
    escapeEncounter();
  }, [escapeEncounter]);

  const resetSize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(ENCOUNTER_COUNT_KEY, "1");
    window.dispatchEvent(new CustomEvent(ENCOUNTER_COUNT_EVENT));
  }, []);

  // Clean up audio & overflow if Serious Mode is enabled
  useEffect(() => {
    if (isSeriousMode) {
      document.body.style.overflow = "";
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isSeriousMode]);

  // Preload and unlock audio on first user interaction anywhere
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.load();
      }
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true, once: true });
    window.addEventListener("keydown", unlockAudio, { passive: true, once: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true, once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  // Setup random encounter timer and keyboard listener
  useEffect(() => {
    if (isSeriousMode) return;

    const audioEl = audioRef.current;

    // First random encounter in 90-180 seconds
    const initialDelay = 90000 + Math.random() * 90000;
    timeoutRef.current = setTimeout(() => {
      triggerEncounter();
    }, initialDelay);

    const handleTriggerEvent = () => triggerEncounter();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isActive) {
        escapeEncounter();
      }
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "m") ||
        (e.altKey && e.key.toLowerCase() === "m")
      ) {
        triggerEncounter();
      }
    };

    window.addEventListener(TRIGGER_MONSTER_EVENT, handleTriggerEvent);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener(TRIGGER_MONSTER_EVENT, handleTriggerEvent);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (audioEl) {
        audioEl.pause();
      }
    };
  }, [isSeriousMode, isActive, triggerEncounter, escapeEncounter]);

  // Growth calculation: starts at 1.0, increases by 45% each encounter, up to 3.8x
  const scaleFactor = Math.min(3.8, 1.0 + (encounterCount - 1) * 0.45);

  return (
    <>
      {/* Native audio element always rendered for instant hardware preloading */}
      <audio
        ref={audioRef}
        src="/monster.wav"
        loop
        preload="auto"
        playsInline
        aria-hidden="true"
      />

      {isActive && !isSeriousMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Haunted Encounter"
          onClick={() => {
            if (audioRef.current?.paused) {
              startMonsterAudio();
            }
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-between p-4 sm:p-6 bg-black select-none overflow-hidden cursor-crosshair"
        >
          {/* 1. Pure Pitch Black Void Backdrop (#000000) */}
          <div className="pointer-events-none absolute inset-0 bg-black" />

          {/* 2. Overhead Flickering Light Fixture (Light Flickering Effect) */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            {/* Electrical tube / bulb filament */}
            <div className="h-1.5 w-48 sm:w-80 rounded-full bg-white shadow-[0_0_35px_#ffffff] animate-horror-flicker" />
            {/* Downward light cone illuminating the pitch black void */}
            <div className="h-[75vh] w-[95vw] max-w-5xl bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.35)_0%,rgba(255,220,220,0.14)_25%,rgba(185,28,28,0.12)_45%,transparent_75%)] animate-light-cone" />
          </div>

          {/* 3. Global Violent Strobe Flicker Overlay */}
          <div className="pointer-events-none absolute inset-0 z-30 bg-white/25 mix-blend-overlay animate-horror-flicker" />

          {/* 4. CRT Scanlines & Dark Vignette */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_65%,black_100%)]" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.75)_51%)] bg-[length:100%_4px] opacity-60" />

          {/* TOP BAR: Status & Scale Information */}
          <header className="relative z-40 flex items-center justify-between w-full max-w-5xl pt-1">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-red-500 animate-pulse font-bold">
              <Zap className="h-4 w-4 text-red-500 animate-bounce" />
              <span>
                † ENCOUNTER #{encounterCount} — {encounterCount > 1 ? "IT IS GETTING CLOSER" : "IT CAN SEE YOU"} †
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-red-300 bg-red-950/80 border border-red-800/80 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                Size: {(scaleFactor * 100).toFixed(0)}%
              </span>
              {isPlayingAudio ? (
                <Volume2 className="h-4 w-4 text-red-400" />
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 underline cursor-pointer">
                  <VolumeX className="h-4 w-4" /> Tap for sound
                </span>
              )}
            </div>
          </header>

          {/* CENTER: The Monster Staring (Each time bigger + Light flickering spasm) */}
          <div className="relative z-20 flex-1 w-full flex items-center justify-center overflow-hidden my-auto">
            <div
              className="relative flex items-center justify-center transition-transform duration-700 ease-out animate-monster-spasm"
              style={{
                transform: `scale(${scaleFactor})`,
              }}
            >
              {/* Ominous Inner Red Aura */}
              <div className="absolute -inset-10 rounded-full bg-red-600/35 blur-3xl animate-pulse" />

              {/* Monster Image */}
              <Image
                src="/Monster.png"
                alt="The Monster staring"
                width={500}
                height={500}
                priority
                className="relative h-auto w-64 sm:w-80 max-w-[85vw] max-h-[64vh] object-contain drop-shadow-[0_0_70px_rgba(220,38,38,0.95)] contrast-150 filter brightness-95"
              />
            </div>
          </div>

          {/* BOTTOM CONTROLS: Escape & Options */}
          <footer className="relative z-40 flex flex-col items-center justify-center text-center max-w-xl px-4 pb-2">
            <p className="glitch-text text-shadow-red font-mono font-bold text-sm sm:text-base tracking-widest text-red-400 mb-1">
              YOU ARE TRAPPED IN THE HAUNTED FOREST
            </p>
            <span className="block text-xs font-mono text-zinc-400 mb-4">
              [ Press ESC or click below to break free ]
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Escape Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  escapeEncounter();
                }}
                type="button"
                className="group relative flex items-center gap-2 rounded-full border-2 border-red-600 bg-red-950/90 px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-widest text-red-100 shadow-[0_0_35px_rgba(220,38,38,0.85)] transition-all hover:scale-105 hover:bg-red-800 hover:border-red-400 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-red-400 group-hover:rotate-45 transition-transform" />
                <span>Escape The Nightmare</span>
              </button>

              {/* Reset Size Button (shown if size has increased) */}
              {encounterCount > 1 && (
                <button
                  onClick={resetSize}
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-3 font-mono text-xs text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all"
                  title="Reset monster size back to 100%"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Reset Size (1x)</span>
                </button>
              )}
            </div>

            {/* Serious Mode Suppress Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                enableSeriousModeAndEscape();
              }}
              type="button"
              className="mt-4 flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-4"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Turn on Serious Mode (Disable all jumpscares)</span>
            </button>
          </footer>
        </div>
      )}
    </>
  );
}
