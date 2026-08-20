import { useEffect, useState } from 'react';

const CHARS = ['⛧', '⛥', '👁', '☠', '💀', '☥', '⚚', '☿', '♄', '♆', '🜏', '🜍', '🜚', '🕯', '🗝', '🔮', '🐐', '✦', '✴', '☽', '☉', '🩸', '🕷', '⚰'];
const COLORS = ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff', '#ff6600', '#ffffff', '#00ff99'];

interface Sym {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  rot: number;
  color: string;
  anim: string;
}

function randomSym(id: number): Sym {
  const anims = ['spinFast 1s linear infinite', 'spinRev 0.7s linear infinite', 'zoomPulse 0.5s ease-in-out infinite alternate', 'shakeHard 0.15s linear infinite', 'blinkHard 0.4s steps(1) infinite'];
  return {
    id,
    char: CHARS[Math.floor(Math.random() * CHARS.length)],
    x: Math.random() * 96,
    y: Math.random() * 94,
    size: 18 + Math.random() * 70,
    rot: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    anim: anims[Math.floor(Math.random() * anims.length)],
  };
}

export default function SymbolStorm({ intensity }: { intensity: number }) {
  const count = 30 + intensity * 12;
  const [syms, setSyms] = useState<Sym[]>(() =>
    Array.from({ length: count }, (_, i) => randomSym(i))
  );

  useEffect(() => {
    const iv = setInterval(() => {
      setSyms((prev) => {
        const next = [...prev];
        // teleport a random third of them
        for (let k = 0; k < Math.ceil(next.length / 3); k++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = randomSym(next[idx].id);
        }
        // grow/shrink to match intensity
        const target = 30 + intensity * 12;
        while (next.length < target) next.push(randomSym(Date.now() + next.length));
        while (next.length > target) next.pop();
        return next;
      });
    }, 350);
    return () => clearInterval(iv);
  }, [intensity]);

  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
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
