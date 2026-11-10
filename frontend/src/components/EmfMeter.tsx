"use client";

import React, { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import { Activity, Radio, Volume2, VolumeX, Zap } from "lucide-react";
import {
  SERIOUS_MODE_KEY,
  SERIOUS_MODE_EVENT,
  TRIGGER_MONSTER_EVENT,
} from "./MonsterEncounter";

export const EMF_ALERT_EVENT = "emf_meter_alert";

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

// Synthesized Paranormal EMF Audio Engine using Web Audio API (Zero asset download, zero lag)
class EmfAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public playClick(level: number) {
    if (this.isMuted) return;

    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Escalating EMF frequency and waveform
      const frequencies = [0, 440, 680, 950, 1350, 1850];
      const freq = frequencies[level] || 880;

      osc.type = level >= 4 ? "sawtooth" : "square";
      osc.frequency.setValueAtTime(freq, now);

      const duration = level === 5 ? 0.055 : 0.032;
      const vol = level === 5 ? 0.12 : 0.08;

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext fallback
    }
  }
}

const audioEngine = new EmfAudioEngine();

export default function EmfMeter() {
  const [isMounted, setIsMounted] = useState(false);
  const [isPC, setIsPC] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const [emfLevel, setEmfLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [milligauss, setMilligauss] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const isSeriousMode = useSyncExternalStore(
    subscribeSeriousMode,
    getSeriousSnapshot,
    getServerSnapshot
  );

  const spikeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const clickLoopRef = useRef<NodeJS.Timeout | null>(null);
  const ambientTickRef = useRef<NodeJS.Timeout | null>(null);

  // Strict PC check: Only activate for PC (Screen width >= 1024px & fine pointer)
  useEffect(() => {
    setIsMounted(true);

    const checkPC = () => {
      const isDesktop =
        window.innerWidth >= 1024 &&
        window.matchMedia("(pointer: fine)").matches &&
        !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsPC(isDesktop);
    };

    checkPC();
    window.addEventListener("resize", checkPC, { passive: true });
    return () => window.removeEventListener("resize", checkPC);
  }, []);

  // Ambient slight fluctuation when idle in Haunted Mode (0.2mG - 1.2mG)
  useEffect(() => {
    if (!isPC || isSeriousMode || isAlerting) {
      if (ambientTickRef.current) clearInterval(ambientTickRef.current);
      return;
    }

    ambientTickRef.current = setInterval(() => {
      // Small ambient fluctuation
      const val = +(0.3 + Math.random() * 0.9).toFixed(1);
      setMilligauss(val);
      setEmfLevel(val > 1.0 ? 2 : 1);
      if (Math.random() < 0.25) {
        audioEngine.playClick(val > 1.0 ? 2 : 1);
      }
    }, 4500);

    return () => {
      if (ambientTickRef.current) clearInterval(ambientTickRef.current);
    };
  }, [isPC, isSeriousMode, isAlerting]);

  // Handle EMF Spike Alert Sequence right before the monster suddenly appears
  const startSpikeSequence = useCallback((durationMs = 4500) => {
    if (isSeriousMode) return;

    setIsAlerting(true);
    setIsExpanded(true);

    const startTime = Date.now();
    let currentLvl: 1 | 2 | 3 | 4 | 5 = 1;

    // Rapid audio clicking loop matching current EMF level
    const runClickLoop = () => {
      audioEngine.playClick(currentLvl);

      const delayMap: Record<number, number> = {
        1: 600,
        2: 280,
        3: 140,
        4: 75,
        5: 45,
      };

      clickLoopRef.current = setTimeout(runClickLoop, delayMap[currentLvl]);
    };
    runClickLoop();

    // Ramp up EMF level from 1 to 5 over durationMs
    spikeIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      if (progress < 0.22) {
        currentLvl = 2;
        setEmfLevel(2);
        setMilligauss(+(1.5 + Math.random() * 1.5).toFixed(1));
      } else if (progress < 0.5) {
        currentLvl = 3;
        setEmfLevel(3);
        setMilligauss(+(4.2 + Math.random() * 4.0).toFixed(1));
      } else if (progress < 0.78) {
        currentLvl = 4;
        setEmfLevel(4);
        setMilligauss(+(11.5 + Math.random() * 7.5).toFixed(1));
      } else {
        currentLvl = 5;
        setEmfLevel(5);
        setMilligauss(+(22.0 + Math.random() * 14.0).toFixed(1));
      }

      if (progress >= 1) {
        if (spikeIntervalRef.current) clearInterval(spikeIntervalRef.current);
        if (clickLoopRef.current) clearTimeout(clickLoopRef.current);

        // Keep at Level 5 red alert for brief moment before monster encounter takes over
        setTimeout(() => {
          setIsAlerting(false);
          setEmfLevel(1);
          setMilligauss(0.4);
        }, 1200);
      }
    }, 80);
  }, [isSeriousMode]);

  // Listen for EMF Alert Event
  useEffect(() => {
    if (!isPC || isSeriousMode) return;

    const handleEmfAlert = (e: Event) => {
      const customEvent = e as CustomEvent<{ durationMs?: number }>;
      const duration = customEvent.detail?.durationMs ?? 4500;
      startSpikeSequence(duration);
    };

    window.addEventListener(EMF_ALERT_EVENT, handleEmfAlert);
    return () => {
      window.removeEventListener(EMF_ALERT_EVENT, handleEmfAlert);
      if (spikeIntervalRef.current) clearInterval(spikeIntervalRef.current);
      if (clickLoopRef.current) clearTimeout(clickLoopRef.current);
    };
  }, [isPC, isSeriousMode, startSpikeSequence]);

  // Clean up if Serious Mode is toggled
  useEffect(() => {
    if (isSeriousMode) {
      setIsAlerting(false);
      setEmfLevel(1);
      setMilligauss(0.4);
      if (spikeIntervalRef.current) clearInterval(spikeIntervalRef.current);
      if (clickLoopRef.current) clearTimeout(clickLoopRef.current);
    }
  }, [isSeriousMode]);

  // Test trigger directly from the meter
  const handleTestSpike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAlerting) return;
    startSpikeSequence(4200);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(TRIGGER_MONSTER_EVENT, { detail: { immediate: true } })
      );
    }, 4200);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  // Only render on PC and when not in Serious Mode
  if (!isMounted || !isPC || isSeriousMode) {
    return null;
  }

  return (
    <aside
      aria-label="Paranormal EMF Detector"
      className="fixed bottom-6 right-6 z-[99998] hidden lg:block select-none font-mono"
    >
      <div
        className={`relative transition-all duration-300 ease-out rounded-2xl border ${
          isAlerting
            ? "border-red-600/90 bg-[#0d0407]/95 shadow-[0_0_50px_rgba(239,68,68,0.5)] scale-105"
            : "border-zinc-800/80 bg-zinc-950/85 hover:border-zinc-700/80 shadow-[0_0_25px_rgba(0,0,0,0.8)]"
        } backdrop-blur-md overflow-hidden`}
      >
        {/* Subtle Ambient Red Glow on Spike */}
        {isAlerting && (
          <div className="pointer-events-none absolute inset-0 bg-red-600/15 animate-pulse" />
        )}

        {/* DEVICE HEADER BAR */}
        <header className="relative flex items-center justify-between px-3.5 py-2 border-b border-zinc-800/80 bg-black/40">
          <div className="flex items-center gap-2">
            <Radio
              className={`h-3.5 w-3.5 ${
                isAlerting ? "text-red-500 animate-pulse" : "text-emerald-400"
              }`}
            />
            <span className="text-[10px] font-bold tracking-wider text-zinc-300 uppercase">
              K-II EMF Detector
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute EMF clicks" : "Mute EMF clicks"}
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 px-1 py-0.5 rounded cursor-pointer"
            >
              {isExpanded ? "▾" : "▴"}
            </button>
          </div>
        </header>

        {isExpanded && (
          <div className="relative p-3.5 flex flex-col gap-3 min-w-[240px]">
            {/* 5-STAGE K-II LED ARC LIGHTS */}
            <div className="flex items-center justify-between gap-1.5 px-1 py-1 rounded-xl bg-black/60 border border-zinc-800/70">
              {/* LED 1: Green (Normal) */}
              <div
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all ${
                  emfLevel >= 1
                    ? "bg-emerald-950/80 text-emerald-400 shadow-[0_0_12px_#22c55e]"
                    : "opacity-25 text-zinc-600"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    emfLevel >= 1 ? "bg-emerald-400" : "bg-zinc-700"
                  }`}
                />
                <span className="text-[9px] font-bold">1.5</span>
              </div>

              {/* LED 2: Green/Cyan (Low) */}
              <div
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all ${
                  emfLevel >= 2
                    ? "bg-emerald-950/80 text-emerald-300 shadow-[0_0_12px_#34d399]"
                    : "opacity-25 text-zinc-600"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    emfLevel >= 2 ? "bg-emerald-300" : "bg-zinc-700"
                  }`}
                />
                <span className="text-[9px] font-bold">2.5</span>
              </div>

              {/* LED 3: Yellow (Med) */}
              <div
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all ${
                  emfLevel >= 3
                    ? "bg-yellow-950/80 text-yellow-400 shadow-[0_0_14px_#eab308]"
                    : "opacity-25 text-zinc-600"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    emfLevel >= 3 ? "bg-yellow-400 animate-pulse" : "bg-zinc-700"
                  }`}
                />
                <span className="text-[9px] font-bold">10</span>
              </div>

              {/* LED 4: Orange (High) */}
              <div
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all ${
                  emfLevel >= 4
                    ? "bg-orange-950/80 text-orange-400 shadow-[0_0_16px_#f97316]"
                    : "opacity-25 text-zinc-600"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    emfLevel >= 4 ? "bg-orange-400 animate-pulse" : "bg-zinc-700"
                  }`}
                />
                <span className="text-[9px] font-bold">20</span>
              </div>

              {/* LED 5: Red (Critical Entity Spike) */}
              <div
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all ${
                  emfLevel >= 5
                    ? "bg-red-950 text-red-400 shadow-[0_0_24px_#ef4444] animate-bounce"
                    : "opacity-25 text-zinc-600"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    emfLevel >= 5 ? "bg-red-500 animate-ping" : "bg-zinc-700"
                  }`}
                />
                <span className="text-[9px] font-bold">20+</span>
              </div>
            </div>

            {/* DIGITAL LCD DISPLAY */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/90 border border-zinc-800">
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
                  Electromagnetic Flux
                </span>
                <span
                  className={`text-base font-bold tracking-tight ${
                    emfLevel >= 5
                      ? "text-red-500 animate-pulse"
                      : emfLevel >= 3
                        ? "text-yellow-400"
                        : "text-emerald-400"
                  }`}
                >
                  {milligauss.toFixed(1)}{" "}
                  <span className="text-[11px] font-normal text-zinc-400">mG</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">
                  Status
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    emfLevel >= 5
                      ? "text-red-500 animate-pulse font-extrabold"
                      : emfLevel >= 4
                        ? "text-orange-400"
                        : emfLevel >= 3
                          ? "text-yellow-400"
                          : "text-emerald-400"
                  }`}
                >
                  {emfLevel >= 5
                    ? "EMF 5 // DANGER"
                    : emfLevel >= 4
                      ? "HIGH ACTIVITY"
                      : emfLevel >= 3
                        ? "SURGE DETECTED"
                        : "SCANNING"}
                </span>
              </div>
            </div>

            {/* ACTION / TEST TRIGGER */}
            <div className="flex items-center justify-between pt-0.5 text-[10px]">
              <span className="text-zinc-500 text-[10px]">
                {isAlerting ? (
                  <span className="text-red-400 font-bold animate-pulse inline-flex items-center gap-1">
                    <Activity className="h-3 w-3" /> ENTITY MANIFESTING...
                  </span>
                ) : (
                  <span>[ PC Paranormal Radar ]</span>
                )}
              </span>

              {!isAlerting && (
                <button
                  type="button"
                  onClick={handleTestSpike}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-zinc-400 hover:text-red-300 hover:bg-red-950/40 border border-zinc-800 hover:border-red-900/60 transition-all cursor-pointer"
                  title="Simulate sudden monster approach"
                >
                  <Zap className="h-2.5 w-2.5 text-red-400" />
                  <span>Test Spike</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
