import { useState } from 'react';
import { blip } from '../lib/noise';

export default function EscapeButton() {
  const [pos, setPos] = useState({ x: 70, y: 70 });
  const [taunts, setTaunts] = useState(0);

  const flee = () => {
    blip();
    setTaunts((t) => t + 1);
    setPos({ x: 8 + Math.random() * 75, y: 12 + Math.random() * 70 });
  };

  const labels = ['CLICK TO ESCAPE', 'TOO SLOW', 'PATHETIC', 'NICE TRY', 'THERE IS NO ESCAPE', 'STOP TRYING', 'YOU LIVE HERE NOW'];

  return (
    <button
      onMouseEnter={flee}
      onClick={flee}
      className="fixed z-50 px-4 py-2 font-bold text-sm sm:text-base cursor-pointer border-4 border-double border-white bg-red-700 text-yellow-300 blinker"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        fontFamily: 'var(--font-metal)',
        transition: 'left 0.15s, top 0.15s',
        boxShadow: '0 0 25px #ff0000',
      }}
    >
      {labels[Math.min(taunts, labels.length - 1)]}
    </button>
  );
}
