/**
 * components/SymbolStorm.tsx
 * A roiling field of occult glyphs that teleport, spin, blink and shake.
 * Density scales with the global `intensity` level (1–5).
 */
import { useEffect, useState } from 'react';
import { STORM_CHARS, NEON_PALETTE, STORM_ANIMATIONS } from '../data/symbols';
import { uid } from '../utils/id';

interface Sym {
  id: string;
  char: string;
  x: number;
  y: number;
  size: number;
  rot: number;
  color: string;
  anim: string;
}

function randomSym(): Sym {
  return {
    id: uid('sym'),
    char: STORM_CHARS[Math.floor(Math.random() * STORM_CHARS.length)],
    x: Math.random() * 96,
    y: Math.random() * 94,
    size: 18 + Math.random() * 70,
    rot: Math.random() * 360,
    color: NEON_PALETTE[Math.floor(Math.random() * NEON_PALETTE.length)],
    anim: STORM_ANIMATIONS[Math.floor(Math.random() * STORM_ANIMATIONS.length)],
  };
}

interface SymbolStormProps {
  /** Global chaos intensity 1–5. */
  intensity: number;
}

export default function SymbolStorm({ intensity }: SymbolStormProps) {
  const count = 30 + intensity * 12;

  const [syms, setSyms] = useState<Sym[]>(() => Array.from({ length: count }, () => randomSym()));

  useEffect(() => {
    const iv = setInterval(() => {
      setSyms((prev) => {
        const next = [...prev];
        // Teleport a random third of them each tick
        for (let k = 0; k < Math.ceil(next.length / 3); k++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = randomSym();
        }
        // Grow or shrink the pool to match current intensity
        const target = 30 + intensity * 12;
        while (next.length < target) next.push(randomSym());
        while (next.length > target) next.pop();
        return next;
      });
    }, 350);
    return () => clearInterval(iv);
  }, [intensity]);

  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden" aria-hidden="true">
      {syms.map((s) => (
        <span
          key={s.id}
          className="storm-symbol"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: s.size,
            color: s.color,
            transform: `rotate(${s.rot}deg)`,
            animation: s.anim,
            textShadow: `0 0 12px ${s.color}`,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
