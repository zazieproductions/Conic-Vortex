/**
 * components/PopupHell.tsx
 * The "popup hell" subsystem: fake windows that spawn at intervals and
 * reproduce on close ("hydra rule" – closing one spawns two).
 *
 * Spawn rate scales inversely with global intensity so more chaos = more
 * frequent popups.
 */
import { useCallback, useEffect, useState } from 'react';
import { blip, scream } from '../audio/engine';
import { POPUP_BODIES, POPUP_HUES, POPUP_TITLES } from '../data/popups';
import { uid } from '../utils/id';

interface Popup {
  id: string;
  x: number;
  y: number;
  title: string;
  body: string;
  hue: string;
  rot: number;
}

function makePopup(): Popup {
  return {
    id: uid('pop'),
    x: 5 + Math.random() * 60,
    y: 8 + Math.random() * 55,
    title: POPUP_TITLES[Math.floor(Math.random() * POPUP_TITLES.length)],
    body: POPUP_BODIES[Math.floor(Math.random() * POPUP_BODIES.length)],
    hue: POPUP_HUES[Math.floor(Math.random() * POPUP_HUES.length)],
    rot: (Math.random() - 0.5) * 14,
  };
}

/** Hard cap so we don't devolve into a browser-crash singularity. */
const MAX_POPUPS = 7;

interface PopupHellProps {
  intensity: number;
}

export default function PopupHell({ intensity }: PopupHellProps) {
  const [popups, setPopups] = useState<Popup[]>(() => [makePopup()]);

  useEffect(() => {
    const intervalMs = Math.max(1200, 3200 - intensity * 400);
    const iv = setInterval(() => {
      setPopups((prev) => {
        const next = [...prev, makePopup()];
        while (next.length > MAX_POPUPS) next.shift();
        return next;
      });
      blip();
    }, intervalMs);
    return () => clearInterval(iv);
  }, [intensity]);

  const close = useCallback((id: string) => {
    scream();
    setPopups((prev) => {
      const next = prev.filter((p) => p.id !== id);
      // Hydra rule: closing one window summons two more.
      next.push(makePopup());
      if (next.length < MAX_POPUPS) next.push(makePopup());
      while (next.length > MAX_POPUPS) next.shift();
      return next;
    });
  }, []);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none" aria-hidden="true">
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
          role="dialog"
        >
          <div
            className="flex items-center justify-between px-2 py-1 text-xs sm:text-sm font-bold"
            style={{ background: p.hue, color: '#000', fontFamily: 'var(--font-metal)' }}
          >
            <span className="blinker">{p.title}</span>
            <button
              onClick={() => close(p.id)}
              aria-label="Dismiss summons two more"
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
