import type { PointerEvent } from 'react';

/**
 * ControlAltar — the three bottom-center controls through which the visitor
 * steers the experience: invert the world, escalate (or wrap) the chaos level,
 * and mute/unmute the procedural drone. Handlers are owned by the orchestrator
 * (`App`) so audio and state stay centralized here.
 */

interface ControlAltarProps {
  inverted: boolean;
  intensity: number;
  muted: boolean;
  onToggleInvert: () => void;
  onChangeIntensity: () => void;
  onToggleMute: () => void;
}

/** Stop the event from bubbling up to the global "blip on any click" handler. */
function guard(handler: () => void) {
  return (e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handler();
  };
}

export default function ControlAltar({
  inverted,
  intensity,
  muted,
  onToggleInvert,
  onChangeIntensity,
  onToggleMute,
}: ControlAltarProps) {
  return (
    <div className="fixed bottom-2 left-1/2 z-[70] flex -translate-x-1/2 flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={guard(onToggleInvert)}
        aria-pressed={inverted}
        aria-label="Toggle inverted color world"
        className="shake-hard cursor-pointer border-2 border-red-500 bg-black px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-black sm:text-sm"
        style={{ fontFamily: 'var(--font-metal)' }}
      >
        ☠ DO NOT CLICK ☠
      </button>
      <button
        type="button"
        onClick={guard(onChangeIntensity)}
        aria-label={`Chaos intensity ${intensity} of 5`}
        className="cursor-pointer border-2 border-white bg-fuchsia-600 px-3 py-2 text-xs font-bold text-black hover:invert sm:text-sm"
        style={{ fontFamily: 'var(--font-metal)' }}
      >
        ⛧ MORE CHAOS [{intensity}/5] ⛧
      </button>
      <button
        type="button"
        onClick={guard(onToggleMute)}
        aria-pressed={muted}
        aria-label={muted ? 'Unmute procedural audio' : 'Mute procedural audio'}
        className="cursor-pointer border-2 border-black bg-yellow-300 px-3 py-2 text-xs font-bold text-black hover:invert sm:text-sm"
        style={{ fontFamily: 'var(--font-metal)' }}
      >
        {muted ? '🔇 SILENCE (COWARD)' : '🔊 NOISE ON'}
      </button>
    </div>
  );
}
