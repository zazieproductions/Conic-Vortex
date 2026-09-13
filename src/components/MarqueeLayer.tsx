/**
 * components/MarqueeLayer.tsx
 * Eight horizontal scrolling strips of occult / glitch text, each with its own
 * speed, direction, typeface, palette, blend mode and slight rotation.
 *
 * Animation is pure CSS keyframes (`marqueeMove`) – JS is not in the hot path.
 */
import { MARQUEE_STRIPS } from '../data/marquees';

export default function MarqueeLayer() {
  return (
    <>
      {MARQUEE_STRIPS.map((s, i) => {
        // Repeat the string to guarantee the strip fills the viewport width
        // even on large displays. The doubled span + -50% translateX gives
        // seamless looping.
        const repeated = Array(8).fill(s.text).join(' ');
        return (
          <div
            key={i}
            className="marquee-strip z-30"
            style={{
              top: s.top,
              background: s.bg,
              mixBlendMode: s.blend,
              transform: `rotate(${s.rot}deg) scale(1.05)`,
            }}
            aria-hidden="true"
          >
            <div
              className="marquee-inner py-1"
              style={{
                animationDuration: `${s.dur}s`,
                animationDirection: s.rev ? 'reverse' : 'normal',
                fontFamily: s.font,
                fontSize: s.size,
                color: s.color,
              }}
            >
              <span>{repeated}&nbsp;</span>
              <span>{repeated}&nbsp;</span>
            </div>
          </div>
        );
      })}
    </>
  );
}
