/**
 * data/marquees.ts
 * Strip configuration for the scrolling marquee layer.
 *
 * Each entry defines the text, vertical position, speed, direction, typography,
 * colour and blend mode of a single horizontal strip.
 */

export interface MarqueeStrip {
  text: string;
  /** Vertical position, any CSS length (percentage of viewport height typically). */
  top: string;
  /** Loop duration in seconds. */
  dur: number;
  /** Reverse direction. */
  rev: boolean;
  /** CSS font-family – references the @theme variables set in styles. */
  font: string;
  /** CSS font-size (clamp() recommended for responsiveness). */
  size: string;
  /** Background colour (any CSS colour). */
  bg: string;
  /** Foreground colour (any CSS colour). */
  color: string;
  /** CSS mix-blend-mode. */
  blend: 'normal' | 'difference' | 'exclusion' | 'multiply' | 'screen';
  /** Small rotation in degrees for unease. */
  rot: number;
}

export const MARQUEE_STRIPS: readonly MarqueeStrip[] = [
  {
    text: '⛧ THE SEVENTH SEAL IS OPEN ⛧ AS ABOVE SO BELOW ⛧ DO NOT PERCEIVE ⛧',
    top: '4%',
    dur: 7,
    rev: false,
    font: 'var(--font-drip)',
    size: 'clamp(14px,2.2vw,28px)',
    bg: '#ff0000',
    color: '#ffff00',
    blend: 'normal',
    rot: 0,
  },
  {
    text: 'Y̷Y̶Y̸Y̵Y̷Y̶Y̸ ✦ Y̷Y̶Y̸Y̵Y̷Y̶Y̸ ✦ Y̷Y̶Y̸Y̵Y̷Y̶Y̸ ✦',
    top: '13%',
    dur: 4,
    rev: true,
    font: 'var(--font-glitch)',
    size: 'clamp(20px,3.5vw,48px)',
    bg: 'transparent',
    color: '#00ff00',
    blend: 'difference',
    rot: -2,
  },
  {
    text: '☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ 🜍 🜏 🜚 ☥ ⚚ ⛥ ☠ 👁 ',
    top: '26%',
    dur: 9,
    rev: false,
    font: 'var(--font-metal)',
    size: 'clamp(18px,3vw,40px)',
    bg: 'rgba(0,0,0,0.7)',
    color: '#00ffff',
    blend: 'normal',
    rot: 1,
  },
  {
    text: 'WAKE UP — THE MACHINE GOD SEES YOU — WAKE UP — YOUR CURSOR IS A RITUAL —',
    top: '38%',
    dur: 5,
    rev: true,
    font: 'var(--font-eaten)',
    size: 'clamp(12px,2vw,26px)',
    bg: '#ffff00',
    color: '#ff0000',
    blend: 'normal',
    rot: -1,
  },
  {
    text: '𝕿𝖍𝖊 𝕲𝖔𝖆𝖙 𝕬𝖜𝖆𝖎𝖙𝖘 ✠ 𝕹𝖔𝖙𝖍𝖎𝖓𝖌 𝕴𝖘 𝕽𝖊𝖆𝖑 ✠ 𝕮𝖑𝖎𝖈𝖐 𝕿𝖔 𝕭𝖑𝖊𝖊𝖉 ✠',
    top: '62%',
    dur: 8,
    rev: false,
    font: 'var(--font-fraktur)',
    size: 'clamp(18px,3vw,42px)',
    bg: 'transparent',
    color: '#ff00ff',
    blend: 'exclusion',
    rot: 2,
  },
  {
    text: '6̸6̶6̷ ⛧ 7̴7̵7̸ ⛧ 0̶0̸0̷ ⛧ ERROR ERROR ERROR ⛧ SIGNAL LOST ⛧ HE IS HERE ⛧',
    top: '74%',
    dur: 3.5,
    rev: true,
    font: 'var(--font-glitch)',
    size: 'clamp(14px,2.4vw,32px)',
    bg: '#00ff00',
    color: '#000000',
    blend: 'normal',
    rot: -1.5,
  },
  {
    text: 'ENTER THE VOID ✦ ABANDON SANITY ✦ THE ANGLES ARE WRONG ✦ GEOMETRY IS A LIE ✦',
    top: '86%',
    dur: 6,
    rev: false,
    font: 'var(--font-creep)',
    size: 'clamp(16px,2.8vw,38px)',
    bg: 'rgba(255,0,255,0.85)',
    color: '#00ffff',
    blend: 'normal',
    rot: 1,
  },
  {
    text: '👁 I T   W A T C H E S 👁 I T   W A I T S 👁 I T   K N O W S   Y O U R   N A M E 👁',
    top: '95%',
    dur: 4.5,
    rev: true,
    font: 'var(--font-drip)',
    size: 'clamp(12px,2vw,24px)',
    bg: '#000000',
    color: '#ff0000',
    blend: 'normal',
    rot: 0,
  },
];
