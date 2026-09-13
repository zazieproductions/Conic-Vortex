/**
 * components/CursorTrail.tsx
 * Mouse-following trail of fading occult glyphs. Spawn-throttled to avoid
 * saturating the DOM; bits self-remove after their CSS fade-out completes.
 */
import { useEffect, useRef, useState } from 'react';
import { TRAIL_CHARS, NEON_PALETTE } from '../data/symbols';
import { uid } from '../utils/id';

interface Bit {
  id: string;
  x: number;
  y: number;
  char: string;
  color: string;
  size: number;
}

/** Minimum ms between trail bits (throttle fast mousemoves). */
const SPAWN_THROTTLE_MS = 40;

/** Fade duration in ms – keep in sync with `.trail-bit` CSS animation. */
const FADE_DURATION_MS = 900;

/** Max visible bits at once (caps DOM size). */
const MAX_BITS = 24;

export default function CursorTrail() {
  const [bits, setBits] = useState<Bit[]>([]);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawn.current < SPAWN_THROTTLE_MS) return;
      lastSpawn.current = now;

      const bit: Bit = {
        id: uid('bit'),
        x: e.clientX,
        y: e.clientY,
        char: TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)],
        color: NEON_PALETTE[Math.floor(Math.random() * NEON_PALETTE.length)],
        size: 14 + Math.random() * 26,
      };

      setBits((prev) => [...prev.slice(-(MAX_BITS - 1)), bit]);

      // Schedule cleanup _after_ the CSS fade-out so we don't remove while visible.
      const thisId = bit.id;
      setTimeout(() => {
        setBits((prev) => prev.filter((b) => b.id !== thisId));
      }, FADE_DURATION_MS);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      {bits.map((b) => (
        <span
          key={b.id}
          className="trail-bit"
          style={{
            left: b.x - b.size / 2,
            top: b.y - b.size / 2,
            fontSize: b.size,
            color: b.color,
            textShadow: `0 0 10px ${b.color}`,
          }}
          aria-hidden="true"
        >
          {b.char}
        </span>
      ))}
    </>
  );
}
