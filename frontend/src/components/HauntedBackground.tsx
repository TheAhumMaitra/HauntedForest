"use client";

import React, { useEffect, useRef } from "react";
import { SERIOUS_MODE_KEY, SERIOUS_MODE_EVENT } from "./MonsterEncounter";

export const TRIGGER_BLUE_FIRE_EVENT = "trigger_blue_fire_event";

// Haunting cryptic phrases that manifest in the forest
const HAUNTING_WHISPERS = [
  "the trees are watching",
  "blood in the root system",
  "don't turn around",
  "you have been here before",
  "it breathes when you stop",
  "they are inside the walls",
  "0xDEAD // 45.1092° N, 14.2819° E",
  "the shadows moved on their own",
  "listening to your heartbeat",
  "who is standing behind you?",
  "the blue fire burns without heat",
  "† SOULFIRE FROM THE DEEP †",
  "404: soul not found",
  "can you feel the cold breath?",
  "run while the dots are red",
  "your screen is not clean",
  "eyes in the dark canopy",
  "lost forever in the woods",
];

const GLYPHS = "†‡§ψ░▒▓█ᚠᚢᚦᚨᚱᚲᛋᛏ01XØΔΨΩ#%*!?><~/\\";

type DotColorType = "blood" | "crimson" | "scarlet" | "ruby";

interface RedDot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  colorType: DotColorType;
}

interface FloatingPngEye {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  phaseSpeed: number;
  rotation: number;
  vRot: number;
}

interface BlueFlame {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  life: number;
  maxLife: number;
  colorTier: number; // 0: White-blue, 1: Cyan mid, 2: Deep blue tip
}

interface Whisper {
  id: number;
  text: string;
  targetText: string;
  x: number;
  y: number;
  opacity: number;
  maxOpacity: number;
  decryptProgress: number;
  life: number;
  maxLife: number;
  fontSize: number;
  mode: "red" | "blue" | "ash";
}

interface GhostEye {
  x: number;
  y: number;
  alpha: number;
  maxAlpha: number;
  state: "fading_in" | "staring" | "blinking" | "fading_out";
  timer: number;
  eyeDistance: number;
  eyeSize: number;
}

interface BloodRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  isBlue: boolean;
}

// Pre-render glowing dot sprite onto an offscreen canvas to avoid costly ctx.shadowBlur
function createGlowSprite(
  innerColor: string,
  glowColor: string,
  spriteSize = 32
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = spriteSize;
  c.height = spriteSize;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  const center = spriteSize / 2;
  const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
  grad.addColorStop(0, glowColor);
  grad.addColorStop(0.35, glowColor.replace(/[\d.]+\)$/, "0.45)"));
  grad.addColorStop(0.7, glowColor.replace(/[\d.]+\)$/, "0.12)"));
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, spriteSize, spriteSize);

  // Bright inner core
  ctx.fillStyle = innerColor;
  ctx.beginPath();
  ctx.arc(center, center, spriteSize * 0.16, 0, Math.PI * 2);
  ctx.fill();

  return c;
}

export default function HauntedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Detect mobile device
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        (typeof navigator !== "undefined" &&
          /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches));

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track serious mode
    let isSeriousMode = localStorage.getItem(SERIOUS_MODE_KEY) === "true";
    const handleSeriousChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ serious: boolean }>;
      isSeriousMode =
        customEvent.detail?.serious ?? (localStorage.getItem(SERIOUS_MODE_KEY) === "true");
    };
    window.addEventListener(SERIOUS_MODE_EVENT, handleSeriousChange);

    // Pre-rendered sprite cache for zero-cost hardware-accelerated glowing dots
    const spriteCache: Record<DotColorType, HTMLCanvasElement> = {
      blood: createGlowSprite("#ef4444", "rgba(239, 68, 68, 0.95)", 32),
      crimson: createGlowSprite("#dc2626", "rgba(220, 38, 38, 0.9)", 32),
      scarlet: createGlowSprite("#fe4b4b", "rgba(254, 75, 75, 0.95)", 32),
      ruby: createGlowSprite("#b91c1c", "rgba(185, 28, 28, 0.85)", 32),
    };

    // Pre-rendered soft glow for floating eyes (red and blue)
    const eyeRedGlow = createGlowSprite("#dc2626", "rgba(220, 38, 38, 0.5)", 64);
    const eyeBlueGlow = createGlowSprite("#38bdf8", "rgba(56, 189, 248, 0.5)", 64);

    // Cached ambient background vignettes (re-created only on resize)
    let redVignette: CanvasGradient;
    let blueVignette: CanvasGradient;

    const updateVignettes = () => {
      const radius = Math.max(width, height) * 0.85;

      redVignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.05,
        width * 0.5,
        height * 0.5,
        radius
      );
      redVignette.addColorStop(0, "rgba(25, 2, 6, 0.2)");
      redVignette.addColorStop(0.5, "rgba(10, 1, 3, 0.25)");
      redVignette.addColorStop(1, "rgba(0, 0, 0, 1.0)");

      blueVignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.05,
        width * 0.5,
        height * 0.5,
        radius
      );
      blueVignette.addColorStop(0, "rgba(8, 28, 55, 0.42)");
      blueVignette.addColorStop(0.5, "rgba(4, 14, 30, 0.26)");
      blueVignette.addColorStop(1, "rgba(0, 0, 0, 1.0)");
    };
    updateVignettes();

    // Mouse coordinates with auto-reset on mobile touch release
    const mouse = { x: -2000, y: -2000, targetX: -2000, targetY: -2000 };
    let touchResetTimeout: ReturnType<typeof setTimeout> | null = null;

    // 1. Grid & Floating Red & Ash Dots (optimized count for mobile vs desktop)
    const dots: RedDot[] = [];
    // Mobile gets wider spacing -> ~40-60 dots. Desktop gets ~100-140 dots.
    const spacing = isMobile
      ? Math.max(64, Math.min(84, Math.floor(Math.sqrt((width * height) / 8000))))
      : Math.max(48, Math.min(64, Math.floor(Math.sqrt((width * height) / 3600))));

    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = c * spacing + (Math.random() - 0.5) * 20;
        const baseY = r * spacing + (Math.random() - 0.5) * 20;

        const roll = Math.random();
        let colorType: DotColorType = "crimson";
        if (roll < 0.45) colorType = "blood";
        else if (roll < 0.75) colorType = "crimson";
        else if (roll < 0.90) colorType = "scarlet";
        else colorType = "ruby";

        const baseRadius =
          colorType === "blood" || colorType === "scarlet"
            ? (isMobile ? 1.4 : 1.6) + Math.random() * 1.5
            : (isMobile ? 1.0 : 1.2) + Math.random() * 1.2;

        dots.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.12 - Math.random() * 0.3,
          radius: baseRadius,
          alpha: 0.15 + Math.random() * 0.45,
          baseAlpha: 0.2 + Math.random() * 0.5,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.03,
          colorType,
        });
      }
    }

    // 2. Floating eye.png Entities (subtle, eerie, restrained count on mobile)
    const eyeImg = new window.Image();
    eyeImg.src = "/eye.png";
    let eyeImgLoaded = false;
    eyeImg.onload = () => {
      eyeImgLoaded = true;
    };

    const floatingEyes: FloatingPngEye[] = [];
    const EYE_COUNT = isMobile ? 4 : Math.min(14, Math.max(8, Math.floor((width * height) / 90000)));

    for (let i = 0; i < EYE_COUNT; i++) {
      const scale = isMobile ? 0.12 + Math.random() * 0.1 : 0.15 + Math.random() * 0.15;
      floatingEyes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.12 - Math.random() * 0.28,
        width: 227 * scale,
        height: 148 * scale,
        alpha: 0.18 + Math.random() * 0.35,
        baseAlpha: 0.2 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.012 + Math.random() * 0.02,
        rotation: (Math.random() - 0.5) * 0.2,
        vRot: (Math.random() - 0.5) * 0.002,
      });
    }

    // 3. Spectral Blue Fire System ("sometimes blue fire should come")
    const blueFlames: BlueFlame[] = [];
    let isBlueFireActive = false;
    let blueFireDuration = 0;
    let nextBlueFireTime = performance.now() + 20000 + Math.random() * 30000;

    const startBlueFire = (durationFrames = isMobile ? 400 : 520) => {
      if (isSeriousMode) return;
      isBlueFireActive = true;
      blueFireDuration = durationFrames;
      spawnWhisper("† THE BLUE SOULFIRE RISES FROM THE ABYSS †", "blue");
    };

    const spawnBlueFlameParticle = (startX?: number, startY?: number) => {
      const maxFlames = isMobile ? 24 : 60;
      if (blueFlames.length >= maxFlames) return;

      const px = startX ?? Math.random() * width;
      const py = startY ?? height + 10;
      const baseSize = (isMobile ? 10 : 14) + Math.random() * (isMobile ? 16 : 22);

      blueFlames.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -2.8 - Math.random() * 3.8,
        size: baseSize,
        baseSize,
        alpha: 0.55 + Math.random() * 0.35,
        life: 0,
        maxLife: isMobile ? 32 + Math.random() * 35 : 40 + Math.random() * 50,
        colorTier: Math.random() > 0.65 ? 0 : Math.random() > 0.3 ? 1 : 2,
      });
    };

    // 4. Whispers Pool
    const activeWhispers: Whisper[] = [];
    let nextWhisperTime = performance.now() + 4000;

    const spawnWhisper = (forceText?: string, mode: "red" | "blue" | "ash" = "red") => {
      const maxWhispers = isMobile ? 1 : 3;
      if (activeWhispers.length >= maxWhispers) return;

      const text =
        forceText || HAUNTING_WHISPERS[Math.floor(Math.random() * HAUNTING_WHISPERS.length)];
      const isLeft = Math.random() > 0.5;
      const xMargin = isMobile ? 18 : 60;
      const spawnX = isLeft
        ? xMargin + Math.random() * (width * (isMobile ? 0.35 : 0.24))
        : width * (isMobile ? 0.55 : 0.72) + Math.random() * (width * 0.25 - xMargin);
      const spawnY = 80 + Math.random() * (height - 180);

      activeWhispers.push({
        id: Math.random(),
        text: "",
        targetText: text,
        x: Math.max(16, Math.min(width - 240, spawnX)),
        y: spawnY,
        opacity: 0,
        maxOpacity: mode === "blue" ? 0.6 : mode === "red" ? 0.45 : 0.3,
        decryptProgress: 0,
        life: 0,
        maxLife: 300 + Math.random() * 150,
        fontSize: isMobile ? 11 : Math.floor(13 + Math.random() * 4),
        mode,
      });
    };

    // 5. Ghost Eyes Anomaly
    let ghostEye: GhostEye | null = null;
    let nextEyeTime = performance.now() + 25000 + Math.random() * 35000;

    const spawnEye = () => {
      const isLeft = Math.random() > 0.5;
      const eyeX = isLeft
        ? (isMobile ? 40 : 100) + Math.random() * (width * 0.25)
        : width * 0.68 + Math.random() * (width * 0.22);
      const eyeY = 120 + Math.random() * (height - 240);

      ghostEye = {
        x: eyeX,
        y: eyeY,
        alpha: 0,
        maxAlpha: 0.6 + Math.random() * 0.2,
        state: "fading_in",
        timer: 0,
        eyeDistance: (isMobile ? 20 : 26) + Math.random() * 12,
        eyeSize: (isMobile ? 3.5 : 4.5) + Math.random() * 2,
      };
    };

    // 6. Blood Ripples
    const ripples: BloodRipple[] = [];

    const handlePointerDown = (e: PointerEvent) => {
      // Don't flood ripples on touch scroll
      if (ripples.length >= (isMobile ? 3 : 8)) return;

      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: isMobile ? 100 + Math.random() * 50 : 160 + Math.random() * 80,
        alpha: 0.55,
        isBlue: isBlueFireActive,
      });

      if (isBlueFireActive && !isSeriousMode) {
        const burstCount = isMobile ? 3 : 6;
        for (let i = 0; i < burstCount; i++) {
          spawnBlueFlameParticle(e.clientX + (Math.random() - 0.5) * 30, e.clientY);
        }
      }

      if (Math.random() < 0.3 && !isSeriousMode) {
        spawnWhisper(undefined, isBlueFireActive ? "blue" : "red");
      }
    };

    const handleTriggerBlueFire = () => {
      startBlueFire(500);
    };

    // Responsive resize handler: Debounced and ignores small mobile address bar height fluctuations
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newW = window.innerWidth;
        const newH = window.innerHeight;

        // On mobile, scrolling down/up triggers 40-60px height change due to address bar collapse.
        // We only reallocate canvas if width changes or height changes by more than 110px.
        const widthChanged = Math.abs(newW - lastWidth) > 5;
        const heightChanged = Math.abs(newH - lastHeight) > 110;

        if (widthChanged || heightChanged) {
          lastWidth = width = canvas.width = newW;
          lastHeight = height = canvas.height = newH;
          updateVignettes();

          // Reposition any out-of-bounds dots smoothly
          for (let i = 0; i < dots.length; i++) {
            if (dots[i].x > width) dots[i].x = Math.random() * width;
            if (dots[i].y > height) dots[i].y = Math.random() * height;
          }
        }
      }, 150);
    };

    // Pointer move & touch handling
    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      if (e.pointerType === "touch") {
        if (touchResetTimeout) clearTimeout(touchResetTimeout);
        // On mobile, reset mouse repulsion after touch ends or pauses
        touchResetTimeout = setTimeout(() => {
          mouse.targetX = -2000;
          mouse.targetY = -2000;
        }, 800);
      }
    };

    const handlePointerLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        if (touchResetTimeout) clearTimeout(touchResetTimeout);
        touchResetTimeout = setTimeout(() => {
          mouse.targetX = -2000;
          mouse.targetY = -2000;
        }, 500);
      }
    };

    // Pause rendering when document is hidden (tab switched)
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerLeave, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener(SERIOUS_MODE_EVENT, handleSeriousChange);
    window.addEventListener(TRIGGER_BLUE_FIRE_EVENT, handleTriggerBlueFire);

    // Initial subtle whisper after mount
    setTimeout(() => {
      if (!isSeriousMode) spawnWhisper();
    }, 2500);

    // Main Render Loop with Delta Time for smooth frame rates across 60Hz/120Hz/mobile
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Don't waste GPU when tab is hidden in background
      if (!isTabVisible) {
        lastTime = currentTime;
        return;
      }

      // Delta time normalization (target 60fps = ~16.6ms)
      const elapsed = currentTime - lastTime;
      lastTime = currentTime;
      // Cap delta time to prevent giant jumps after lag spikes
      const dt = Math.min(elapsed / 16.67, 2.5);

      // Interpolate mouse smoothly
      mouse.x += (mouse.targetX - mouse.x) * (0.12 * dt);
      mouse.y += (mouse.targetY - mouse.y) * (0.12 * dt);

      // Check Blue Fire Timer
      if (currentTime > nextBlueFireTime && !isBlueFireActive && !isSeriousMode) {
        startBlueFire(isMobile ? 380 : 500);
        nextBlueFireTime = currentTime + 55000 + Math.random() * 75000;
      }

      if (isBlueFireActive) {
        blueFireDuration -= dt;
        if (!isSeriousMode) {
          const spawnCount = isMobile ? 1 : Math.min(6, Math.max(2, Math.floor(width / 360)));
          for (let i = 0; i < spawnCount; i++) {
            spawnBlueFlameParticle();
          }
        }
        if (blueFireDuration <= 0) {
          isBlueFireActive = false;
        }
      } else if (!isSeriousMode && Math.random() < (isMobile ? 0.03 : 0.07)) {
        // Occasional stray blue wisp floating up
        spawnBlueFlameParticle(Math.random() * width, height - 10);
      }

      // Check Ghost Eyes Timer
      if (currentTime > nextEyeTime && !ghostEye && !isSeriousMode) {
        spawnEye();
        nextEyeTime = currentTime + 35000 + Math.random() * 55000;
      }

      // Check Whispers Timer
      if (
        currentTime > nextWhisperTime &&
        activeWhispers.length < (isMobile ? 1 : 3) &&
        !isSeriousMode
      ) {
        spawnWhisper(undefined, isBlueFireActive ? "blue" : Math.random() > 0.3 ? "red" : "ash");
        nextWhisperTime = currentTime + 25000 + Math.random() * 45000;
      }

      // 1. Deep Pitch Black Background with Cached Ambient Vignette
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = isBlueFireActive ? blueVignette : redVignette;
      ctx.fillRect(0, 0, width, height);

      // In Serious Mode, stop after ambient dark background
      if (isSeriousMode) {
        return;
      }

      // 2. Expand & Draw Ripples (fast stroke without costly shadowBlur)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 3.2 * dt;
        rip.alpha *= Math.pow(0.96, dt);

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = rip.isBlue
          ? `rgba(56, 189, 248, ${rip.alpha * 0.6})`
          : `rgba(239, 68, 68, ${rip.alpha * 0.5})`;
        ctx.stroke();

        if (rip.alpha < 0.015 || rip.radius > rip.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 3. Render Black & Red Dots using Pre-rendered Sprite Cache (Blazing Fast)
      const speedMultiplier = (isBlueFireActive ? 1.5 : 1) * (prefersReducedMotion ? 0.2 : 1);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        d.pulsePhase += d.pulseSpeed * speedMultiplier * dt;
        d.alpha = Math.max(0.08, d.baseAlpha + Math.sin(d.pulsePhase) * 0.22);

        // Drift upward
        d.y += d.vy * speedMultiplier * dt;
        d.x += (d.vx + Math.sin(d.pulsePhase * 0.8) * 0.2) * speedMultiplier * dt;

        // Screen wrap
        if (d.y < -15) {
          d.y = height + 15;
          d.x = Math.random() * width;
        }
        if (d.x < -15) d.x = width + 15;
        if (d.x > width + 15) d.x = -15;

        // Mouse repulsion
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const distSq = dx * dx + dy * dy;
        const repelRadius = isMobile ? 85 : 110;
        const repelRadiusSq = repelRadius * repelRadius;

        if (distSq < repelRadiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (repelRadius - dist) / repelRadius;
          d.x -= (dx / dist) * force * 4.2 * dt;
          d.y -= (dy / dist) * force * 4.2 * dt;
          d.alpha = Math.min(0.9, d.alpha + 0.25);
        }

        // Draw hardware-accelerated sprite
        const sprite = spriteCache[d.colorType];
        const spriteSize = d.radius * 6.5;
        ctx.globalAlpha = d.alpha;
        ctx.drawImage(
          sprite,
          d.x - spriteSize * 0.5,
          d.y - spriteSize * 0.5,
          spriteSize,
          spriteSize
        );
      }
      ctx.globalAlpha = 1.0;

      // 4. Render Floating eye.png Entities
      if (eyeImgLoaded) {
        for (let i = 0; i < floatingEyes.length; i++) {
          const eye = floatingEyes[i];
          eye.phase += eye.phaseSpeed * speedMultiplier * dt;
          eye.y += eye.vy * speedMultiplier * dt;
          eye.x += (eye.vx + Math.sin(eye.phase * 0.7) * 0.35) * speedMultiplier * dt;
          eye.rotation += eye.vRot * dt;

          if (eye.y < -eye.height - 20) {
            eye.y = height + 20;
            eye.x = Math.random() * width;
          }
          if (eye.x < -eye.width - 20) eye.x = width + 20;
          if (eye.x > width + 20) eye.x = -eye.width - 20;

          // Mouse interaction (gentle drift)
          const edx = mouse.x - (eye.x + eye.width * 0.5);
          const edy = mouse.y - (eye.y + eye.height * 0.5);
          const eDistSq = edx * edx + edy * edy;
          const eRepelRadius = isMobile ? 80 : 120;
          if (eDistSq < eRepelRadius * eRepelRadius && eDistSq > 0) {
            const eDist = Math.sqrt(eDistSq);
            const eForce = (eRepelRadius - eDist) / eRepelRadius;
            eye.x -= (edx / eDist) * eForce * 3.2 * dt;
            eye.y -= (edy / eDist) * eForce * 3.2 * dt;
          }

          ctx.save();
          ctx.translate(eye.x + eye.width * 0.5, eye.y + eye.height * 0.5);
          ctx.rotate(eye.rotation);

          const currentAlpha = Math.max(0.08, eye.baseAlpha + Math.sin(eye.phase) * 0.22);
          const drawAlpha = isBlueFireActive ? Math.min(1, currentAlpha * 1.3) : currentAlpha;

          // Soft ambient glow behind eye without expensive shadowBlur
          const glowSprite = isBlueFireActive ? eyeBlueGlow : eyeRedGlow;
          ctx.globalAlpha = drawAlpha * 0.7;
          ctx.drawImage(
            glowSprite,
            -eye.width * 0.75,
            -eye.height * 0.75,
            eye.width * 1.5,
            eye.height * 1.5
          );

          ctx.globalAlpha = drawAlpha;
          ctx.drawImage(eyeImg, -eye.width * 0.5, -eye.height * 0.5, eye.width, eye.height);
          ctx.restore();
        }
      }

      // 5. Render Blue Soulfire Particles (Additive blending for natural intense glow)
      if (blueFlames.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        for (let i = blueFlames.length - 1; i >= 0; i--) {
          const f = blueFlames[i];
          f.life += dt;

          f.x += (f.vx + Math.sin(f.life * 0.15) * 1.1) * dt;
          f.y += f.vy * dt;

          const progress = f.life / f.maxLife;
          f.size = Math.max(1, f.baseSize * (1 - progress * 0.85));
          const flameAlpha = Math.max(0, f.alpha * (1 - progress));

          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);

          if (f.colorTier === 0) {
            // White-hot spectral core
            ctx.fillStyle = `rgba(224, 242, 254, ${flameAlpha})`;
          } else if (f.colorTier === 1) {
            // Radiant electric cyan
            ctx.fillStyle = `rgba(56, 189, 248, ${flameAlpha * 0.9})`;
          } else {
            // Sapphire blue
            ctx.fillStyle = `rgba(37, 99, 235, ${flameAlpha * 0.75})`;
          }

          ctx.fill();

          if (f.life >= f.maxLife || f.y < -50) {
            blueFlames.splice(i, 1);
          }
        }

        ctx.restore();
      }

      // 6. Ghost Eyes Anomaly (smooth dual ellipse glow without shadowBlur)
      if (ghostEye) {
        ghostEye.timer += dt;

        if (ghostEye.state === "fading_in") {
          ghostEye.alpha += 0.018 * dt;
          if (ghostEye.alpha >= ghostEye.maxAlpha) {
            ghostEye.alpha = ghostEye.maxAlpha;
            ghostEye.state = "staring";
          }
        } else if (ghostEye.state === "staring") {
          if (ghostEye.timer > 200) {
            ghostEye.state = "blinking";
          }
        } else if (ghostEye.state === "blinking") {
          ghostEye.alpha *= Math.pow(0.85, dt);
          if (ghostEye.alpha < 0.05) {
            ghostEye.state = "fading_out";
          }
        } else if (ghostEye.state === "fading_out") {
          ghostEye = null;
        }

        if (ghostEye) {
          const eyeA = ghostEye.alpha;
          let eyeGazeX = 0;
          let eyeGazeY = 0;
          if (mouse.x > 0) {
            const edx = mouse.x - ghostEye.x;
            const edy = mouse.y - ghostEye.y;
            const eDistSq = edx * edx + edy * edy;
            if (eDistSq > 0) {
              const eDist = Math.sqrt(eDistSq);
              eyeGazeX = (edx / eDist) * 1.6;
              eyeGazeY = (edy / eDist) * 1.4;
            }
          }

          const leftEyeX = ghostEye.x - ghostEye.eyeDistance * 0.5;
          const rightEyeX = ghostEye.x + ghostEye.eyeDistance * 0.5;
          const eyeY = ghostEye.y;

          [leftEyeX, rightEyeX].forEach((ex) => {
            // Outer subtle aura
            ctx.beginPath();
            ctx.ellipse(
              ex,
              eyeY,
              ghostEye!.eyeSize * 2.2,
              ghostEye!.eyeSize * 1.3,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = isBlueFireActive
              ? `rgba(56, 189, 248, ${eyeA * 0.35})`
              : `rgba(239, 68, 68, ${eyeA * 0.3})`;
            ctx.fill();

            // Iris
            ctx.beginPath();
            ctx.ellipse(
              ex,
              eyeY,
              ghostEye!.eyeSize * 1.3,
              ghostEye!.eyeSize * 0.75,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = isBlueFireActive
              ? `rgba(56, 189, 248, ${eyeA * 0.85})`
              : `rgba(239, 68, 68, ${eyeA * 0.8})`;
            ctx.fill();

            // Pupil
            ctx.beginPath();
            ctx.ellipse(
              ex + eyeGazeX,
              eyeY + eyeGazeY,
              ghostEye!.eyeSize * 0.35,
              ghostEye!.eyeSize * 0.7,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = `rgba(2, 1, 3, ${eyeA * 0.95})`;
            ctx.fill();
          });
        }
      }

      // 7. Cryptic Decrypting Whispers
      for (let i = activeWhispers.length - 1; i >= 0; i--) {
        const w = activeWhispers[i];
        w.life += dt;

        if (w.life < 45) {
          w.opacity = (w.life / 45) * w.maxOpacity;
        } else if (w.life > w.maxLife - 45) {
          w.opacity = Math.max(0, ((w.maxLife - w.life) / 45) * w.maxOpacity);
        } else {
          w.opacity = w.maxOpacity;
        }

        if (w.decryptProgress < w.targetText.length) {
          w.decryptProgress += 0.22 * dt;
        }

        const revealed = Math.floor(w.decryptProgress);
        let rendered = "";
        for (let c = 0; c < w.targetText.length; c++) {
          if (c < revealed) {
            if (Math.random() < 0.04) {
              rendered += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            } else {
              rendered += w.targetText[c];
            }
          } else if (c < revealed + 3) {
            rendered += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            break;
          }
        }

        w.y -= 0.08 * dt;

        ctx.font = `${w.fontSize}px var(--font-mono, monospace)`;

        if (w.mode === "blue") {
          ctx.fillStyle = `rgba(56, 189, 248, ${w.opacity})`;
        } else if (w.mode === "red") {
          ctx.fillStyle = `rgba(239, 68, 68, ${w.opacity})`;
        } else {
          ctx.fillStyle = `rgba(156, 163, 175, ${w.opacity * 0.9})`;
        }

        ctx.fillText(rendered, w.x, w.y);

        if (w.life >= w.maxLife) {
          activeWhispers.splice(i, 1);
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (touchResetTimeout) clearTimeout(touchResetTimeout);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener(SERIOUS_MODE_EVENT, handleSeriousChange);
      window.removeEventListener(TRIGGER_BLUE_FIRE_EVENT, handleTriggerBlueFire);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none bg-black">
      <canvas
        ref={canvasRef}
        className="block h-full w-full bg-black touch-none"
        aria-hidden="true"
      />
    </div>
  );
}
