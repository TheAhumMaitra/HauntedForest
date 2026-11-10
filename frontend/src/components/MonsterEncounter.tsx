"use client";

import React, { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { RotateCcw, Shield, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";

export const SERIOUS_MODE_KEY = "haunted_forest_serious_mode";
export const SERIOUS_MODE_EVENT = "haunted_serious_mode_change";
export const TRIGGER_MONSTER_EVENT = "trigger_monster_encounter";
export const EMF_ALERT_EVENT = "emf_meter_alert";
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
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
    const handleResize = () => setIsMobileDevice(window.innerWidth < 768);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  const encounterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const encounterRoarTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ambientSoundTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserInteractedRef = useRef(false);

  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  const isSeriousModeRef = useRef(isSeriousMode);
  isSeriousModeRef.current = isSeriousMode;

  // Play monster roar with random intervals during encounter
  const playEncounterRoar = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isActiveRef.current || isSeriousModeRef.current) return;

    if (encounterRoarTimerRef.current) {
      clearTimeout(encounterRoarTimerRef.current);
      encounterRoarTimerRef.current = null;
    }

    audio.loop = false;
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
        });
    }

    // When the 1.5s roar finishes, schedule the next roar with a random pause (1.5s to 4s)
    const handleRoarEnd = () => {
      audio.removeEventListener("ended", handleRoarEnd);
      if (!isActiveRef.current || isSeriousModeRef.current) return;

      const randomPause = 1500 + Math.random() * 2800; // Random pause between monster sounds
      encounterRoarTimerRef.current = setTimeout(() => {
        playEncounterRoar();
      }, randomPause);
    };

    audio.removeEventListener("ended", handleRoarEnd);
    audio.addEventListener("ended", handleRoarEnd, { once: true });
  }, []);

  // Random ambient monster sound played occasionally in the background of the website
  const scheduleNextAmbientRoar = useCallback(() => {
    if (ambientSoundTimerRef.current) {
      clearTimeout(ambientSoundTimerRef.current);
      ambientSoundTimerRef.current = null;
    }

    if (isSeriousModeRef.current) return;

    // Random interval between 30s and 65s for ambient horror roars
    const randomInterval = 30000 + Math.random() * 35000;
    ambientSoundTimerRef.current = setTimeout(() => {
      if (!isActiveRef.current && !isSeriousModeRef.current && hasUserInteractedRef.current) {
        const audio = audioRef.current;
        if (audio && audio.paused) {
          audio.loop = false;
          // Eerie distant ambient volume
          audio.volume = 0.42;
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      }
      // Recursively schedule next random sound
      scheduleNextAmbientRoar();
    }, randomInterval);
  }, []);

  const triggerEncounter = useCallback(() => {
    if (localStorage.getItem(SERIOUS_MODE_KEY) === "true") {
      return;
    }

    const storedCount = parseInt(localStorage.getItem(ENCOUNTER_COUNT_KEY) || "0", 10);
    const nextCount = storedCount + 1;
    localStorage.setItem(ENCOUNTER_COUNT_KEY, nextCount.toString());
    window.dispatchEvent(new CustomEvent(ENCOUNTER_COUNT_EVENT));

    setIsActive(true);
    document.body.style.overflow = "hidden";

    // Play roar immediately on encounter start
    setTimeout(() => {
      playEncounterRoar();
    }, 50);
  }, [playEncounterRoar]);

  const initiateEncounter = useCallback(() => {
    if (localStorage.getItem(SERIOUS_MODE_KEY) === "true") {
      return;
    }

    const isPC =
      typeof window !== "undefined" &&
      window.innerWidth >= 1024 &&
      !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isPC) {
      // 4.2-second EMF Meter spike warning sequence on PC
      window.dispatchEvent(
        new CustomEvent(EMF_ALERT_EVENT, { detail: { durationMs: 4200 } })
      );
      setTimeout(() => {
        triggerEncounter();
      }, 4200);
    } else {
      // Mobile: Instant monster encounter without EMF delay
      triggerEncounter();
    }
  }, [triggerEncounter]);

  const escapeEncounter = useCallback(() => {
    setIsActive(false);
    setIsPlayingAudio(false);
    document.body.style.overflow = "";

    if (encounterRoarTimerRef.current) {
      clearTimeout(encounterRoarTimerRef.current);
      encounterRoarTimerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Schedule next encounter between 3 to 7 minutes
    if (encounterTimeoutRef.current) clearTimeout(encounterTimeoutRef.current);
    const nextDelay = 180000 + Math.random() * 240000;
    encounterTimeoutRef.current = setTimeout(() => {
      initiateEncounter();
    }, nextDelay);

    // Resume ambient random sounds
    scheduleNextAmbientRoar();
  }, [initiateEncounter, scheduleNextAmbientRoar]);

  const enableSeriousModeAndEscape = useCallback(() => {
    localStorage.setItem(SERIOUS_MODE_KEY, "true");
    window.dispatchEvent(
      new CustomEvent(SERIOUS_MODE_EVENT, { detail: { serious: true } })
    );
    escapeEncounter();
  }, [escapeEncounter]);

  const resetSize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    localStorage.setItem(ENCOUNTER_COUNT_KEY, "1");
    window.dispatchEvent(new CustomEvent(ENCOUNTER_COUNT_EVENT));
  }, []);

  // Clean up audio & timers if Serious Mode is enabled
  useEffect(() => {
    if (isSeriousMode) {
      document.body.style.overflow = "";
      if (encounterRoarTimerRef.current) clearTimeout(encounterRoarTimerRef.current);
      if (ambientSoundTimerRef.current) clearTimeout(ambientSoundTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      scheduleNextAmbientRoar();
    }
  }, [isSeriousMode, scheduleNextAmbientRoar]);

  // Pre-prime audio and unlock browser autoplay permissions on first user touch anywhere
  useEffect(() => {
    const handleFirstInteraction = () => {
      hasUserInteractedRef.current = true;
      const audio = audioRef.current;
      if (audio) {
        audio.load();
      }
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("keydown", handleFirstInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  // Setup random encounter timer and keyboard listener
  useEffect(() => {
    if (isSeriousMode) return;

    const audioEl = audioRef.current;
    const initialDelay = 80000 + Math.random() * 90000;
    encounterTimeoutRef.current = setTimeout(() => {
      initiateEncounter();
    }, initialDelay);

    // Initial ambient sound scheduled for ~20-40s after mount
    scheduleNextAmbientRoar();

    const handleTriggerEvent = (e?: Event) => {
      const isDirect = (e as CustomEvent)?.detail?.immediate;
      const isPC =
        typeof window !== "undefined" &&
        window.innerWidth >= 1024 &&
        !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isPC && !isDirect) {
        window.dispatchEvent(
          new CustomEvent(EMF_ALERT_EVENT, { detail: { durationMs: 4000 } })
        );
        setTimeout(() => {
          triggerEncounter();
        }, 4000);
      } else {
        triggerEncounter();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isActive) {
        escapeEncounter();
      }
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "m") ||
        (e.altKey && e.key.toLowerCase() === "m")
      ) {
        initiateEncounter();
      }
    };

    window.addEventListener(TRIGGER_MONSTER_EVENT, handleTriggerEvent);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (encounterTimeoutRef.current) clearTimeout(encounterTimeoutRef.current);
      if (encounterRoarTimerRef.current) clearTimeout(encounterRoarTimerRef.current);
      if (ambientSoundTimerRef.current) clearTimeout(ambientSoundTimerRef.current);
      window.removeEventListener(TRIGGER_MONSTER_EVENT, handleTriggerEvent);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (audioEl) {
        audioEl.pause();
      }
    };
  }, [isSeriousMode, isActive, initiateEncounter, triggerEncounter, escapeEncounter, scheduleNextAmbientRoar]);

  // Mobile-safe scale factor: clamps to 1.7x on mobile so it never blows out screen width
  const maxScale = isMobileDevice ? 1.7 : 3.8;
  const growthRate = isMobileDevice ? 0.18 : 0.45;
  const scaleFactor = Math.min(maxScale, 1.0 + (encounterCount - 1) * growthRate);

  return (
    <>
      {/* Native audio element preloaded */}
      <audio
        ref={audioRef}
        src="/monster.wav"
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
              playEncounterRoar();
            }
          }}
          onTouchStart={() => {
            if (audioRef.current?.paused) {
              playEncounterRoar();
            }
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-between p-3 sm:p-6 bg-black select-none overflow-hidden cursor-crosshair w-full max-w-[100vw] h-[100dvh] min-h-[100dvh] max-h-[100dvh]"
        >
          {/* Pitch Black Void Backdrop */}
          <div className="pointer-events-none absolute inset-0 bg-black" />

          {/* Overhead Flickering Light Fixture */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center w-full max-w-full overflow-hidden">
            <div className="h-1.5 w-40 sm:w-80 rounded-full bg-white shadow-[0_0_35px_#ffffff] animate-horror-flicker" />
            <div className="h-[70vh] w-full max-w-4xl bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.35)_0%,rgba(255,220,220,0.14)_25%,rgba(185,28,28,0.12)_45%,transparent_75%)] animate-light-cone" />
          </div>

          {/* Violent Strobe Flicker Overlay */}
          <div className="pointer-events-none absolute inset-0 z-30 bg-white/20 mix-blend-overlay animate-horror-flicker" />

          {/* CRT Scanlines & Dark Vignette */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_65%,black_100%)]" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.75)_51%)] bg-[length:100%_4px] opacity-60" />

          {/* TOP BAR: Status & Scale Information */}
          <header className="relative z-40 flex items-center justify-between w-full max-w-4xl pt-1 px-1 gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.25em] text-red-500 animate-pulse font-bold truncate">
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 animate-bounce shrink-0" />
              <span className="truncate">
                † #{encounterCount} — {encounterCount > 1 ? "GETTING CLOSER" : "IT SEES YOU"} †
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-red-300 bg-red-950/80 border border-red-800/80 px-2 sm:px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                {(scaleFactor * 100).toFixed(0)}%
              </span>
              {isPlayingAudio ? (
                <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-400 underline cursor-pointer touch-manipulation">
                  <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 animate-pulse" /> Sound
                </span>
              )}
            </div>
          </header>

          {/* CENTER: The Monster Staring (Constrained & width-safe) */}
          <div className="relative z-20 flex-1 w-full max-w-full flex items-center justify-center overflow-hidden my-auto pointer-events-none">
            <div
              className="relative flex items-center justify-center transition-transform duration-700 ease-out animate-monster-spasm max-w-full"
              style={{
                transform: `scale(${scaleFactor})`,
              }}
            >
              {/* Ominous Inner Red Aura */}
              <div className="absolute -inset-8 rounded-full bg-red-600/35 blur-2xl animate-pulse" />

              {/* Monster Image */}
              <Image
                src="/Monster.png"
                alt="The Monster staring"
                width={500}
                height={500}
                priority
                className="relative h-auto w-48 sm:w-80 max-w-[70vw] sm:max-w-[85vw] max-h-[48vh] sm:max-h-[64vh] object-contain drop-shadow-[0_0_50px_rgba(220,38,38,0.9)] contrast-150 filter brightness-95"
              />
            </div>
          </div>

          {/* BOTTOM CONTROLS: Escape & Options */}
          <footer className="relative z-50 flex flex-col items-center justify-center text-center max-w-xl px-2 sm:px-4 pb-2 sm:pb-3 pointer-events-auto w-full">
            <p className="glitch-text text-shadow-red font-mono font-bold text-xs sm:text-base tracking-widest text-red-400 mb-0.5 sm:mb-1">
              YOU ARE TRAPPED IN THE HAUNTED FOREST
            </p>
            <span className="block text-[11px] sm:text-xs font-mono text-zinc-400 mb-2 sm:mb-4">
              [ Tap below to break free ]
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {/* Escape Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  escapeEncounter();
                }}
                type="button"
                className="group relative flex items-center gap-2 rounded-full border-2 border-red-600 bg-red-950/95 px-6 sm:px-8 py-3 sm:py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest text-red-100 shadow-[0_0_35px_rgba(220,38,38,0.85)] transition-all hover:scale-105 hover:bg-red-800 hover:border-red-400 active:scale-95 cursor-pointer touch-manipulation min-h-[44px]"
              >
                <Sparkles className="h-4 w-4 text-red-400 group-hover:rotate-45 transition-transform" />
                <span>Escape The Nightmare</span>
              </button>

              {/* Reset Size Button */}
              {encounterCount > 1 && (
                <button
                  onClick={resetSize}
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/90 px-3.5 py-2.5 sm:py-3 font-mono text-xs text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all cursor-pointer touch-manipulation min-h-[44px]"
                  title="Reset monster size back to 100%"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Reset (1x)</span>
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
              className="mt-2.5 sm:mt-4 flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-4 cursor-pointer touch-manipulation py-1"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Turn on Serious Mode</span>
            </button>
          </footer>
        </div>
      )}
    </>
  );
}
