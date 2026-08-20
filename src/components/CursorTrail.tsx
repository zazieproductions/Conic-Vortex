import { useEffect, useState, useRef } from 'react';

const TRAIL_CHARS = ['✦', '👁', '⛧', '☠', '✴', '🜏', '☽', '🩸'];
const TRAIL_COLORS = ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

interface Bit {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
  size: number;
}

let bitId = 0;

export default function CursorTrail() {
  const [bits, setBits] = useState<Bit[]>([]);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawn.current < 40) return;
      lastSpawn.current = now;
      const bit: Bit = {
        id: bitId++,
        x: e.clientX,
        y: e.clientY,
        char: TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)],
        color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
        size: 14 + Math.random() * 26,
      };
      setBits((prev) => [...prev.slice(-24), bit]);
      setTimeout(() => {
        setBits((prev) => prev.filter((b) => b.id !== bit.id));
      }, 900);
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
        >
          {b.char}
        </span>
      ))}
    </>
  );
}
