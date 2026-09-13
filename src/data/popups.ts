/**
 * data/popups.ts
 * Hard-coded copy for the popup-hell subsystem. Keeping content separate
 * from rendering logic lets us swap/adjust voice without touching JSX.
 */

export const POPUP_TITLES: readonly string[] = [
  '⚠ MESSAGE FROM BEYOND ⚠',
  '👁 SYSTEM32_SOUL.EXE 👁',
  '⛧ URGENT RITUAL NOTICE ⛧',
  '💀 FATAL EXCEPTION 0x666 💀',
  '🐐 CONGRATULATIONS!!! 🐐',
  '🕯 THE COUNCIL HAS DECIDED 🕯',
  '☠ YOUR FREE TRIAL OF REALITY ☠',
  '🔮 INCOMING TRANSMISSION 🔮',
] as const;

export const POPUP_BODIES: readonly string[] = [
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
] as const;

export const POPUP_HUES: readonly string[] = [
  '#ff0055',
  '#00ff66',
  '#ffee00',
  '#ff00ff',
  '#00ffff',
  '#ff6600',
] as const;

export const ACCEPT_LABELS: readonly string[] = ['ACCEPT FATE', 'ALSO ACCEPT FATE'] as const;
