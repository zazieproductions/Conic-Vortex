/**
 * components/EscapeButton.tsx
 * The classic "you cannot click this" hostile-UI button. Fleeing behaviour
 * escalates the taunt label as the user's frustration grows.
 */
import { useState } from 'react';
import { blip } from '../audio/engine';
import { ESCAPE_LABELS } from '../data/symbols';

export default function EscapeButton() {
  const [pos, setPos] = useState({ x: 70, y: 70 });
  const [taunts, setTaunts] = useState(0);

  const flee = () => {
    blip();
    setTaunts((t) => t + 1);
    setPos({ x: 8 + Math.random() * 75, y: 12 + Math.random() * 70 });
  };

  const label = ESCAPE_LABELS[Math.min(taunts, ESCAPE_LABELS.length - 1)];

  return (
    <button
      onMouseEnter={flee}
      onClick={flee}
      aria-label={label}
      className="fixed z-50 px-4 py-2 font-bold text-sm sm:text-base cursor-pointer border-4 border-double border-white bg-red-700 text-yellow-300 blinker"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        fontFamily: 'var(--font-metal)',
        transition: 'left 0.15s, top 0.15s',
        boxShadow: '0 0 25px #ff0000',
      }}
    >
      {label}
    </button>
  );
}
