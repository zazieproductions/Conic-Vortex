/**
 * data/symbols.ts
 * Character and colour palettes shared by the symbol storm and cursor trail.
 * Split out so there is one source of "occult aesthetic" glyphs.
 */

export const STORM_CHARS: readonly string[] = [
  '⛧',
  '⛥',
  '👁',
  '☠',
  '💀',
  '☥',
  '⚚',
  '☿',
  '♄',
  '♆',
  '🜏',
  '🜍',
  '🜚',
  '🕯',
  '🗝',
  '🔮',
  '🐐',
  '✦',
  '✴',
  '☽',
  '☉',
  '🩸',
  '🕷',
  '⚰',
] as const;

export const TRAIL_CHARS: readonly string[] = ['✦', '👁', '⛧', '☠', '✴', '🜏', '☽', '🩸'] as const;

export const NEON_PALETTE: readonly string[] = [
  '#ff0000',
  '#00ff00',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ff6600',
  '#ffffff',
  '#00ff99',
] as const;

export const STORM_ANIMATIONS: readonly string[] = [
  'spinFast 1s linear infinite',
  'spinRev 0.7s linear infinite',
  'zoomPulse 0.5s ease-in-out infinite alternate',
  'shakeHard 0.15s linear infinite',
  'blinkHard 0.4s steps(1) infinite',
] as const;

/** Escape button taunt progression, ordered by taunt count. */
export const ESCAPE_LABELS: readonly string[] = [
  'CLICK TO ESCAPE',
  'TOO SLOW',
  'PATHETIC',
  'NICE TRY',
  'THERE IS NO ESCAPE',
  'STOP TRYING',
  'YOU LIVE HERE NOW',
] as const;
