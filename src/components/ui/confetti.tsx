"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";

const COLORS = [
  "#82C4AD", // mint
  "#A053AA", // plum
  "#FF99CC", // gold/pink
  "#1C5BBF", // navy blue
  "#FF66B3", // pink
  "#FFD166", // yellow
  "#60A5FA", // blue
  "#22C55E", // green
];

interface ConfettiProps {
  active: boolean;
  count?: number;
}

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
  drift: number;
}

/**
 * Lightweight, dependency-free confetti overlay. When `active` is true it
 * renders a burst of colored pieces that fall & spin using the
 * `confettiFall` keyframes in globals.css, then the parent hides it.
 */
export function Confetti({ active, count = 60 }: ConfettiProps) {
  const pieces = useMemo<Piece[]>(() => {
    if (!active) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 2.6 + Math.random() * 1.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 7 + Math.random() * 8,
      rotate: 360 + Math.random() * 360,
      drift: (Math.random() - 0.5) * 10,
    }));
  }, [active, count]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-50 [transform:translateZ(0)]"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute block will-change-transform"
          style={
            {
              top: "-10vh",
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 0.55}px`,
              backgroundColor: p.color,
              borderRadius: "2px",
              animation: `confettiFall ${p.duration}s linear ${p.delay}s both`,
              "--drift": `${p.drift}vw`,
              "--rot": `${p.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}