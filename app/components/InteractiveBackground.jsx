"use client";

import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const containerRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // start offscreen

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dotSpacing = 15;
    const radius = 100;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const dots = [];

    for (let y = 0; y < height; y += dotSpacing) {
      for (let x = 0; x < width; x += dotSpacing) {
        const dot = document.createElement("div");
        dot.className =
          "absolute w-1 h-1 rounded-full bg-emerald-900 pointer-events-none transition-opacity duration-200";
        const offsetX = (Math.floor(y / dotSpacing) % 2 === 0) ? dotSpacing / 2 : 0;
        dot.style.left = `${x + offsetX}px`;
        dot.style.top = `${y}px`;
        dot.style.opacity = "0";

        container.appendChild(dot);
        dots.push({
          el: dot,
          x: x + offsetX,
          y,
        });
      }
    }

    dotsRef.current = dots;

    const handleMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMove);

    const animate = () => {
      const { x: mx, y: my } = mouseRef.current;
      dotsRef.current.forEach((dot) => {
        const dist = Math.hypot(mx - dot.x, my - dot.y);
        const opacity = Math.max(0, 1 - dist / radius);
        dot.el.style.opacity = opacity.toString();
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    />
  );
}
