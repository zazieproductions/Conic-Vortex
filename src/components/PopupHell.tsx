import { useEffect, useState, useCallback } from 'react';
import { blip, scream } from '../lib/noise';

const TITLES = [
  '⚠ MESSAGE FROM BEYOND ⚠',
  '👁 SYSTEM32_SOUL.EXE 👁',
  '⛧ URGENT RITUAL NOTICE ⛧',
  '💀 FATAL EXCEPTION 0x666 💀',
  '🐐 CONGRATULATIONS!!! 🐐',
  '🕯 THE COUNCIL HAS DECIDED 🕯',
  '☠ YOUR FREE TRIAL OF REALITY ☠',
  '🔮 INCOMING TRANSMISSION 🔮',
];

const BODIES = [
  'You are the 666,666th visitor. The Goat will contact you shortly.',
  'ERROR: soul not found. Reinstall? (this cannot be undone)',
  'The angles of this room are wrong. Do not look behind you.',
  'Your reality license expires in 3... 2... 1...',
  'HE WHO SCROLLS SHALL BE SCROLLED.',
  'A sigil has been drawn using your cursor history.',
  'Warning: perceiving this popup binds you contractually to the void.',
  'The seventh Y has awakened. There is no eighth Y.',
  'Your bones have been selected for a wonderful opportunity.',
  'DO NOT CLOSE THIS WINDOW. (closing summons two more)',
];

const HUES = ['#ff0055', '#00ff66', '#ffee00', '#ff00ff', '#00ffff', '#ff6600'];

interface Popup {
  id: number;
  x: number;
  y: number;
  title: string;
  body: string;
  hue: string;
  rot: number;
}

let popupId = 0;

function makePopup(): Popup {
  return {
    id: popupId++,
    x: 5 + Math.random() * 60,
    y: 8 + Math.random() * 55,
    title: TITLES[Math.floor(Math.random() * TITLES.length)],
    body: BODIES[Math.floor(Math.random() * BODIES.length)],
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    rot: (Math.random() - 0.5) * 14,
  };
}

const MAX_POPUPS = 7;

export default function PopupHell({ intensity }: { intensity: number }) {
  const [popups, setPopups] = useState<Popup[]>([makePopup()]);

  useEffect(() => {
    const iv = setInterval(() => {
      setPopups((prev) => {
        const next = [...prev, makePopup()];
        while (next.length > MAX_POPUPS) next.shift();
        return next;
      });
      blip();
    }, Math.max(1200, 3200 - intensity * 400));
    return () => clearInterval(iv);
  }, [intensity]);

  const close = useCallback((id: number) => {
    scream();
    setPopups((prev) => {
      const next = prev.filter((p) => p.id !== id);
      // hydra rule: closing one spawns two
      next.push(makePopup());
      if (next.length < MAX_POPUPS) next.push(makePopup());
      while (next.length > MAX_POPUPS) next.shift();
      return next;
    });
  }, []);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {popups.map((p) => (
        <div
          key={p.id}
          className="popup-window absolute pointer-events-auto w-64 sm:w-80"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.hue,
            rotate: `${p.rot}deg`,
            background: '#000',
            border: `4px ridge ${p.hue}`,
          }}
        >
          <div
            className="flex items-center justify-between px-2 py-1 text-xs sm:text-sm font-bold"
            style={{ background: p.hue, color: '#000', fontFamily: 'var(--font-metal)' }}
          >
            <span className="blinker">{p.title}</span>
            <button
              onClick={() => close(p.id)}
              className="ml-2 px-2 border-2 border-black bg-white text-black hover:bg-red-600 hover:text-white cursor-pointer font-black"
              style={{ fontFamily: 'monospace' }}
            >
              X
            </button>
          </div>
          <div className="p-3 text-xs sm:text-sm" style={{ fontFamily: 'var(--font-eaten)' }}>
            {p.body}
          </div>
          <div className="flex gap-2 p-2 justify-center">
            <button
              onClick={() => close(p.id)}
              className="px-3 py-1 text-xs font-bold cursor-pointer hover:invert"
              style={{ background: p.hue, color: '#000', fontFamily: 'var(--font-metal)' }}
            >
              ACCEPT FATE
            </button>
            <button
              onClick={() => close(p.id)}
              className="px-3 py-1 text-xs font-bold cursor-pointer hover:invert"
              style={{ background: '#fff', color: '#000', fontFamily: 'var(--font-metal)' }}
            >
              ALSO ACCEPT FATE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
