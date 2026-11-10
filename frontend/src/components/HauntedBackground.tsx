"use client";

import React, { useEffect, useRef } from "react";
import { SERIOUS_MODE_KEY, SERIOUS_MODE_EVENT } from "./MonsterEncounter";

export const TRIGGER_BLUE_FIRE_EVENT = "trigger_blue_fire_event";

// Haunting cryptic phrases that manifest in the black, red & blue fire forest
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

interface RedDot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  colorType: "blood" | "crimson" | "scarlet" | "ruby";
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
  colorTier: number; // 0: White-blue core, 1: Cyan mid, 2: Deep blue tip
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

export default function HauntedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
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

    // Mouse coordinates
    const mouse = { x: -2000, y: -2000, targetX: -2000, targetY: -2000 };

    // 1. Grid & Floating Red & Ash Dots
    const dots: RedDot[] = [];
    const spacing = Math.max(32, Math.min(48, Math.floor(Math.sqrt((width * height) / 1000))));
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = c * spacing + (Math.random() - 0.5) * 16;
        const baseY = r * spacing + (Math.random() - 0.5) * 16;

        const roll = Math.random();
        let colorType: RedDot["colorType"] = "crimson";
        if (roll < 0.45) colorType = "blood";
        else if (roll < 0.75) colorType = "crimson";
        else if (roll < 0.90) colorType = "scarlet";
        else colorType = "ruby";

        const baseRadius =
          colorType === "blood" || colorType === "scarlet"
            ? 1.3 + Math.random() * 2.0
            : 0.9 + Math.random() * 1.5;

        dots.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.15 - Math.random() * 0.35,
          radius: baseRadius,
          baseRadius,
          alpha: 0.15 + Math.random() * 0.5,
          baseAlpha: 0.2 + Math.random() * 0.55,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.04,
          colorType,
        });
      }
    }

    // 2. Floating eye.png Entities (in the 10s and 20s)
    const eyeImg = new window.Image();
    eyeImg.src = "/eye.png";
    let eyeImgLoaded = false;
    eyeImg.onload = () => {
      eyeImgLoaded = true;
    };

    const floatingEyes: FloatingPngEye[] = [];
    const EYE_COUNT = Math.min(22, Math.max(14, Math.floor((width * height) / 48000)));
    for (let i = 0; i < EYE_COUNT; i++) {
      const scale = 0.16 + Math.random() * 0.18;
      floatingEyes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.15 - Math.random() * 0.35,
        width: 227 * scale,
        height: 148 * scale,
        alpha: 0.2 + Math.random() * 0.45,
        baseAlpha: 0.25 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.03,
        rotation: (Math.random() - 0.5) * 0.25,
        vRot: (Math.random() - 0.5) * 0.003,
      });
    }

    // 3. Spectral Blue Fire System ("sometimes blue fire should come")
    const blueFlames: BlueFlame[] = [];
    let isBlueFireActive = false;
    let blueFireDuration = 0;
    // Blue fire triggers periodically every 45 to 80 seconds
    let nextBlueFireTime = performance.now() + 18000 + Math.random() * 30000;

    const startBlueFire = (durationFrames = 550) => {
      if (isSeriousMode) return;
      isBlueFireActive = true;
      blueFireDuration = durationFrames; // ~9 seconds
      spawnWhisper("† THE BLUE SOULFIRE RISES FROM THE ABYSS †", "blue");
    };

    const spawnBlueFlameParticle = (startX?: number, startY?: number) => {
      const px = startX ?? Math.random() * width;
      const py = startY ?? height + 10;
      const baseSize = 14 + Math.random() * 26;
      blueFlames.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -3.2 - Math.random() * 4.8,
        size: baseSize,
        baseSize,
        alpha: 0.6 + Math.random() * 0.4,
        life: 0,
        maxLife: 40 + Math.random() * 50,
        colorTier: Math.random() > 0.65 ? 0 : Math.random() > 0.3 ? 1 : 2,
      });
    };

    // 4. Whispers Pool
    const activeWhispers: Whisper[] = [];
    let nextWhisperTime = performance.now() + 4000;

    const spawnWhisper = (forceText?: string, mode: "red" | "blue" | "ash" = "red") => {
      const text =
        forceText || HAUNTING_WHISPERS[Math.floor(Math.random() * HAUNTING_WHISPERS.length)];
      const isLeft = Math.random() > 0.5;
      const xMargin = width > 1024 ? 60 : 16;
      const spawnX = isLeft
        ? xMargin + Math.random() * (width * 0.24)
        : width * 0.72 + Math.random() * (width * 0.24 - xMargin);
      const spawnY = 80 + Math.random() * (height - 180);

      activeWhispers.push({
        id: Math.random(),
        text: "",
        targetText: text,
        x: spawnX,
        y: spawnY,
        opacity: 0,
        maxOpacity: mode === "blue" ? 0.6 : mode === "red" ? 0.45 : 0.3,
        decryptProgress: 0,
        life: 0,
        maxLife: 320 + Math.random() * 180,
        fontSize: Math.floor(13 + Math.random() * 5),
        mode,
      });
    };

    // 5. Ghost Eyes Anomaly
    let ghostEye: GhostEye | null = null;
    let nextEyeTime = performance.now() + 25000 + Math.random() * 35000;

    const spawnEye = () => {
      const isLeft = Math.random() > 0.5;
      const eyeX = isLeft
        ? 100 + Math.random() * (width * 0.25)
        : width * 0.7 + Math.random() * (width * 0.2);
      const eyeY = 120 + Math.random() * (height - 240);

      ghostEye = {
        x: eyeX,
        y: eyeY,
        alpha: 0,
        maxAlpha: 0.65 + Math.random() * 0.25,
        state: "fading_in",
        timer: 0,
        eyeDistance: 26 + Math.random() * 14,
        eyeSize: 4.5 + Math.random() * 2.5,
      };
    };

    // 6. Blood Ripples
    const ripples: BloodRipple[] = [];

    const handlePointerDown = (e: PointerEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 180 + Math.random() * 100,
        alpha: 0.6,
        isBlue: isBlueFireActive,
      });

      // If blue fire is active, burst blue fire from click
      if (isBlueFireActive && !isSeriousMode) {
        for (let i = 0; i < 8; i++) {
          spawnBlueFlameParticle(e.clientX + (Math.random() - 0.5) * 40, e.clientY);
        }
      }

      if (Math.random() < 0.35 && activeWhispers.length < 3 && !isSeriousMode) {
        spawnWhisper(undefined, isBlueFireActive ? "blue" : "red");
      }
    };

    const handleTriggerBlueFire = () => {
      startBlueFire(600);
    };

    // Event Listeners
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handlePointerLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener(TRIGGER_BLUE_FIRE_EVENT, handleTriggerBlueFire);

    // Initial whisper
    setTimeout(() => {
      if (!isSeriousMode) spawnWhisper();
    }, 2000);

    // Main Render Loop
    const render = (time: number) => {
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Check Blue Fire Timer ("sometimes blue fire should come")
      if (time > nextBlueFireTime && !isBlueFireActive && !isSeriousMode) {
        startBlueFire(500); // 500 frames (~8.3 seconds)
        nextBlueFireTime = time + 55000 + Math.random() * 75000;
      }

      if (isBlueFireActive) {
        blueFireDuration--;
        // Spawn active blue flame particles along bottom edge and random clusters
        if (!isSeriousMode) {
          const spawnCount = Math.min(8, Math.max(3, Math.floor(width / 320)));
          for (let i = 0; i < spawnCount; i++) {
            spawnBlueFlameParticle();
          }
        }
        if (blueFireDuration <= 0) {
          isBlueFireActive = false;
        }
      } else if (!isSeriousMode && Math.random() < 0.08) {
        // Occasional stray blue wisp floating up even when full fire is resting
        spawnBlueFlameParticle(Math.random() * width, height - 10);
      }

      // Check Ghost Eyes Timer
      if (time > nextEyeTime && !ghostEye && !isSeriousMode) {
        spawnEye();
        nextEyeTime = time + 35000 + Math.random() * 55000;
      }

      // Check Whispers Timer
      if (time > nextWhisperTime && activeWhispers.length < 3 && !isSeriousMode) {
        spawnWhisper(undefined, isBlueFireActive ? "blue" : Math.random() > 0.3 ? "red" : "ash");
        nextWhisperTime = time + 25000 + Math.random() * 45000;
      }

      // 1. Deep Pitch Black Background (#000000)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Core Ambient Vignette
      const coreVignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.05,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );

      if (isBlueFireActive) {
        // Mysterious blue soulfire ambience
        coreVignette.addColorStop(0, "rgba(8, 28, 55, 0.4)");
        coreVignette.addColorStop(0.5, "rgba(4, 14, 30, 0.25)");
        coreVignette.addColorStop(1, "rgba(0, 0, 0, 1.0)");
      } else {
        // Pitch black with subtle sinister red depths
        coreVignette.addColorStop(0, "rgba(25, 2, 6, 0.18)");
        coreVignette.addColorStop(0.5, "rgba(10, 1, 3, 0.22)");
        coreVignette.addColorStop(1, "rgba(0, 0, 0, 1.0)");
      }

      ctx.fillStyle = coreVignette;
      ctx.fillRect(0, 0, width, height);

      // 2. Expand & Draw Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 3.5;
        rip.alpha *= 0.96;

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        if (rip.isBlue) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${rip.alpha * 0.5})`;
          ctx.shadowColor = "#0284c7";
        } else {
          ctx.strokeStyle = `rgba(239, 68, 68, ${rip.alpha * 0.4})`;
          ctx.shadowColor = "#dc2626";
        }
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        if (rip.alpha < 0.01 || rip.radius > rip.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 3. Render Black, Red & Grey Dots
      const speedMultiplier = isBlueFireActive ? 1.6 : 1;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        d.pulsePhase += d.pulseSpeed * speedMultiplier;
        d.alpha = Math.max(0.08, d.baseAlpha + Math.sin(d.pulsePhase) * 0.25);

        // Drift upward
        d.y += d.vy * speedMultiplier;
        d.x += (d.vx + Math.sin(d.pulsePhase * 0.8) * 0.25) * speedMultiplier;

        // Screen wraps
        if (d.y < -15) {
          d.y = height + 15;
          d.x = Math.random() * width;
        }
        if (d.x < -15) d.x = width + 15;
        if (d.x > width + 15) d.x = -15;

        // Mouse interaction
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          d.x -= (dx / dist) * force * 4.5;
          d.y -= (dy / dist) * force * 4.5;
          d.alpha = Math.min(0.9, d.alpha + 0.3);
        }

        // Draw Dot
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);

        if (d.colorType === "blood") {
          ctx.fillStyle = `rgba(239, 68, 68, ${d.alpha})`;
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 5;
        } else if (d.colorType === "crimson") {
          ctx.fillStyle = `rgba(220, 38, 38, ${d.alpha * 0.9})`;
          ctx.shadowColor = "#dc2626";
          ctx.shadowBlur = 4;
        } else if (d.colorType === "scarlet") {
          ctx.fillStyle = `rgba(254, 75, 75, ${d.alpha * 0.95})`;
          ctx.shadowColor = "#fe4b4b";
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = `rgba(185, 28, 28, ${d.alpha * 0.85})`;
          ctx.shadowColor = "#991b1b";
          ctx.shadowBlur = 3;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Render Floating eye.png Entities (in the 10s and 20s)
      if (eyeImgLoaded && !isSeriousMode) {
        for (let i = 0; i < floatingEyes.length; i++) {
          const eye = floatingEyes[i];
          eye.phase += eye.phaseSpeed * speedMultiplier;
          eye.y += eye.vy * speedMultiplier;
          eye.x += (eye.vx + Math.sin(eye.phase * 0.7) * 0.4) * speedMultiplier;
          eye.rotation += eye.vRot;

          // Screen wraps
          if (eye.y < -eye.height - 20) {
            eye.y = height + 20;
            eye.x = Math.random() * width;
          }
          if (eye.x < -eye.width - 20) eye.x = width + 20;
          if (eye.x > width + 20) eye.x = -eye.width - 20;

          // Mouse interaction (drifting gently away from cursor)
          const edx = mouse.x - (eye.x + eye.width * 0.5);
          const edy = mouse.y - (eye.y + eye.height * 0.5);
          const eDist = Math.sqrt(edx * edx + edy * edy);
          if (eDist < 120) {
            const eForce = (120 - eDist) / 120;
            eye.x -= (edx / eDist) * eForce * 3.5;
            eye.y -= (edy / eDist) * eForce * 3.5;
          }

          ctx.save();
          ctx.translate(eye.x + eye.width * 0.5, eye.y + eye.height * 0.5);
          ctx.rotate(eye.rotation);
          const currentAlpha = Math.max(0.08, eye.baseAlpha + Math.sin(eye.phase) * 0.25);
          ctx.globalAlpha = isBlueFireActive
            ? Math.min(1, currentAlpha * 1.4)
            : currentAlpha;
          ctx.shadowColor = isBlueFireActive ? "#38bdf8" : "#dc2626";
          ctx.shadowBlur = 10;
          ctx.drawImage(eyeImg, -eye.width * 0.5, -eye.height * 0.5, eye.width, eye.height);
          ctx.restore();
        }
      }

      // 5. Render Blue Soulfire Particles ("sometimes blue fire should come")
      if (blueFlames.length > 0 && !isSeriousMode) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter"; // Additive blending for blazing fire effect

        for (let i = blueFlames.length - 1; i >= 0; i--) {
          const f = blueFlames[i];
          f.life++;

          // Sinusoidal flame sway
          f.x += f.vx + Math.sin(f.life * 0.15) * 1.2;
          f.y += f.vy;

          // Flame size tapers down as it reaches the top
          const progress = f.life / f.maxLife;
          f.size = f.baseSize * (1 - progress * 0.85);
          const flameAlpha = f.alpha * (1 - progress);

          ctx.beginPath();
          ctx.arc(f.x, f.y, Math.max(1, f.size), 0, Math.PI * 2);

          if (f.colorTier === 0) {
            // White-hot spectral blue core
            ctx.fillStyle = `rgba(224, 242, 254, ${flameAlpha})`;
            ctx.shadowColor = "#bae6fd";
            ctx.shadowBlur = f.size * 2;
          } else if (f.colorTier === 1) {
            // Radiant electric cyan
            ctx.fillStyle = `rgba(56, 189, 248, ${flameAlpha * 0.9})`;
            ctx.shadowColor = "#0284c7";
            ctx.shadowBlur = f.size * 2.5;
          } else {
            // Deep sapphire blue flame tip
            ctx.fillStyle = `rgba(37, 99, 235, ${flameAlpha * 0.75})`;
            ctx.shadowColor = "#1d4ed8";
            ctx.shadowBlur = f.size * 1.8;
          }

          ctx.fill();

          if (f.life >= f.maxLife || f.y < -50) {
            blueFlames.splice(i, 1);
          }
        }

        ctx.restore();
      }

      // 6. Ghost Eyes Staring Anomaly
      if (ghostEye && !isSeriousMode) {
        ghostEye.timer++;

        if (ghostEye.state === "fading_in") {
          ghostEye.alpha += 0.015;
          if (ghostEye.alpha >= ghostEye.maxAlpha) {
            ghostEye.alpha = ghostEye.maxAlpha;
            ghostEye.state = "staring";
          }
        } else if (ghostEye.state === "staring") {
          if (ghostEye.timer > 220) {
            ghostEye.state = "blinking";
          }
        } else if (ghostEye.state === "blinking") {
          ghostEye.alpha *= 0.85;
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
            const eDist = Math.sqrt(edx * edx + edy * edy);
            if (eDist > 0) {
              eyeGazeX = (edx / eDist) * 1.8;
              eyeGazeY = (edy / eDist) * 1.5;
            }
          }

          const leftEyeX = ghostEye.x - ghostEye.eyeDistance * 0.5;
          const rightEyeX = ghostEye.x + ghostEye.eyeDistance * 0.5;
          const eyeY = ghostEye.y;

          [leftEyeX, rightEyeX].forEach((ex) => {
            ctx.save();
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
            if (isBlueFireActive) {
              ctx.fillStyle = `rgba(56, 189, 248, ${eyeA * 0.8})`;
              ctx.shadowColor = "#0284c7";
            } else {
              ctx.fillStyle = `rgba(239, 68, 68, ${eyeA * 0.75})`;
              ctx.shadowColor = "#dc2626";
            }
            ctx.shadowBlur = 14;
            ctx.fill();

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
            ctx.shadowBlur = 0;
            ctx.fill();
            ctx.restore();
          });
        }
      }

      // 7. Cryptic Decrypting Whispers
      for (let i = activeWhispers.length - 1; i >= 0; i--) {
        const w = activeWhispers[i];
        w.life++;

        if (w.life < 50) {
          w.opacity = (w.life / 50) * w.maxOpacity;
        } else if (w.life > w.maxLife - 50) {
          w.opacity = Math.max(0, ((w.maxLife - w.life) / 50) * w.maxOpacity);
        } else {
          w.opacity = w.maxOpacity;
        }

        if (w.decryptProgress < w.targetText.length) {
          w.decryptProgress += 0.22;
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

        w.y -= 0.1;

        ctx.save();
        ctx.font = `${w.fontSize}px var(--font-mono, monospace)`;
        ctx.letterSpacing = "0.14em";

        if (w.mode === "blue") {
          ctx.fillStyle = `rgba(56, 189, 248, ${w.opacity})`;
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 12;
        } else if (w.mode === "red") {
          ctx.fillStyle = `rgba(239, 68, 68, ${w.opacity})`;
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = `rgba(156, 163, 175, ${w.opacity * 0.9})`;
          ctx.shadowColor = "#9ca3af";
          ctx.shadowBlur = 6;
        }

        ctx.fillText(rendered, w.x, w.y);
        ctx.restore();

        if (w.life >= w.maxLife) {
          activeWhispers.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener(SERIOUS_MODE_EVENT, handleSeriousChange);
      window.removeEventListener(TRIGGER_BLUE_FIRE_EVENT, handleTriggerBlueFire);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none bg-black">
      <canvas
        ref={canvasRef}
        className="block h-full w-full bg-black"
        aria-hidden="true"
      />
    </div>
  );
}
