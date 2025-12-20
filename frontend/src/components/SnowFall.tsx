"use client";

import { useEffect } from "react";

export default function Snowfall() {
  useEffect(() => {
    // Instead of a container, append directly to body
    const body = document.body;
    const snowflakes: { el: HTMLSpanElement; x: number; y: number; speed: number }[] = [];

    const createSnowflake = () => {
      const flake = document.createElement("span");
      flake.textContent = "❄";
      flake.style.position = "fixed";
      flake.style.top = "-20px"; // start above screen
      flake.style.left = `${Math.random() * window.innerWidth}px`;
      flake.style.fontSize = `${Math.random() * 8 + 10}px`;
      flake.style.color = "white";
      flake.style.pointerEvents = "none";
      flake.style.userSelect = "none";
      flake.style.zIndex = "9999"; // ensure on top of everything

      body.appendChild(flake);

      const speed = Math.random() * 1 + 1; // px per frame
      snowflakes.push({ el: flake, x: parseFloat(flake.style.left), y: -20, speed });
    };

    const animate = () => {
      for (let i = snowflakes.length - 1; i >= 0; i--) {
        const s = snowflakes[i];
        s.y += s.speed;
        s.x += Math.sin(s.y / 50) * 0.5; // slight horizontal drift
        s.el.style.top = `${s.y}px`;
        s.el.style.left = `${s.x}px`;

        if (s.y > window.innerHeight + 20) {
          s.el.remove();
          snowflakes.splice(i, 1);
        }
      }
      requestAnimationFrame(animate);
    };

    const interval = setInterval(createSnowflake, 150);
    requestAnimationFrame(animate);

    return () => clearInterval(interval);
  }, []);

  return null; // no div needed
}
