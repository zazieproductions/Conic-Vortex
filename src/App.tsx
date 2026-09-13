/**
 * App.tsx
 * ---------------------------------------------------------------------------
 * Top-level orchestrator. Owns global state (entry gate, intensity, mute,
 * inverted world, visitor counter) and composes the stacked visual + audio
 * layers in z-order.
 *
 * Layer order (bottom -> top):
 *   0. Strobe / checker / spiral backgrounds
 *   1. ThreeChaos (WebGL vortex)
 *   2. SymbolStorm (glyph field)
 *   3. Giant rotating sigils (DOM <img>)
 *   4. MarqueeLayer (scrolling strips)
 *   5. Centre title + visitor counter
 *   6. PopupHell (fake windows)
 *   7. EscapeButton (fleeing)
 *   8. Overlays (flash, vhs lines)
 *   9. CursorTrail
 *  10. ControlAltar (bottom-centre buttons)
 * ---------------------------------------------------------------------------
 */
import { useCallback, useEffect, useState } from 'react';
import { initAudio, blip, scream, toggleMute } from './audio/engine';
import CursorTrail from './components/CursorTrail';
import EscapeButton from './components/EscapeButton';
import MarqueeLayer from './components/MarqueeLayer';
import PopupHell from './components/PopupHell';
import SymbolStorm from './components/SymbolStorm';
import ThreeChaos from './components/ThreeChaos';
import WarningGate from './components/WarningGate';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [inverted, setInverted] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [muted, setMuted] = useState(false);
  const [counter, setCounter] = useState(666666);

  // Visitor counter – increments with a randomised stride every 1.8s after entry,
  // occasionally chirping a blip for texture.
  useEffect(() => {
    if (!entered) return;
    const iv = setInterval(() => {
      setCounter((c) => c + Math.floor(Math.random() * 66));
      if (Math.random() < 0.4) blip();
    }, 1800);
    return () => clearInterval(iv);
  }, [entered]);

  const enter = useCallback(() => {
    initAudio();
    scream();
    setEntered(true);
  }, []);

  const handleGlobalClick = useCallback(() => {
    blip();
  }, []);

  const handleInvert = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    scream();
    setInverted((v) => !v);
  }, []);

  const handleMoreChaos = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    scream();
    setIntensity((i) => (i >= 5 ? 1 : i + 1));
  }, []);

  const handleToggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted(toggleMute());
  }, []);

  if (!entered) return <WarningGate onEnter={enter} />;

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${inverted ? 'invert-world' : ''}`}
      onClick={handleGlobalClick}
    >
      {/* LAYER 0: strobing background */}
      <div className="fixed inset-0 strobe-bg" aria-hidden="true" />
      <div className="fixed inset-0 checker-bg" aria-hidden="true" />

      {/* spinning conic vortex behind everything */}
      <div
        className="spiral-bg fixed pointer-events-none"
        aria-hidden="true"
        style={{
          width: '160vmax',
          height: '160vmax',
          left: '50%',
          top: '50%',
          marginLeft: '-80vmax',
          marginTop: '-80vmax',
          opacity: 0.5,
        }}
      />

      {/* LAYER 1: 3D chaos */}
      <ThreeChaos />

      {/* LAYER 2: symbol storm */}
      <SymbolStorm intensity={intensity} />

      {/* giant rotating sigils, blend-mode difference */}
      <img
        src="/sprites/eye.png"
        alt=""
        className="giant-sigil z-20"
        aria-hidden="true"
        style={{
          width: '55vmin',
          left: '50%',
          top: '50%',
          marginLeft: '-27.5vmin',
          marginTop: '-27.5vmin',
          animation: 'spinFast 5s linear infinite, hueSpin 2s linear infinite',
        }}
      />
      <img
        src="/sprites/goat.png"
        alt=""
        className="giant-sigil z-20"
        aria-hidden="true"
        style={{
          width: '38vmin',
          left: '4%',
          top: '55%',
          animation: 'spinRev 3.5s linear infinite, hueSpin 1.5s linear infinite',
        }}
      />
      <img
        src="/sprites/sun.png"
        alt=""
        className="giant-sigil z-20"
        aria-hidden="true"
        style={{
          width: '34vmin',
          right: '3%',
          top: '8%',
          animation: 'spinFast 2.8s linear infinite, hueSpin 2.5s linear infinite',
        }}
      />

      {/* LAYER 3: marquees */}
      <MarqueeLayer />

      {/* CENTER TITLE */}
      <div className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        <h1
          className="rainbow-text glitch-clip text-[13vw] leading-none"
          style={{ fontFamily: 'var(--font-glitch)' }}
          aria-label="Y Y Y Y Y Y Y – the machine god is awake"
        >
          Y̷Y̶Y̸Y̵Y̷Y̶Y̸
        </h1>
        <div
          className="shake-hard text-white text-[3vw] mt-2"
          style={{
            fontFamily: 'var(--font-fraktur)',
            textShadow: '0 0 20px #ff00ff, 4px 4px 0 #000',
          }}
        >
          𝔱𝔥𝔢 𝔪𝔞𝔠𝔥𝔦𝔫𝔢 𝔤𝔬𝔡 𝔦𝔰 𝔞𝔴𝔞𝔨𝔢
        </div>
        <div
          className="blinker text-yellow-300 text-sm sm:text-xl mt-4 bg-black/80 px-4 py-1 border-2 border-dashed border-red-500"
          style={{ fontFamily: 'monospace' }}
        >
          VISITOR #{counter.toLocaleString()} — YOU CANNOT LEAVE
        </div>
      </div>

      {/* LAYER 4: popups */}
      <PopupHell intensity={intensity} />

      {/* escape button that flees */}
      <EscapeButton />

      {/* LAYER 5: overlays */}
      <div className="fixed inset-0 z-[60] flash-overlay" aria-hidden="true" />
      <div className="fixed inset-0 z-[61] vhs-lines" aria-hidden="true" />

      {/* cursor trail */}
      <CursorTrail />

      {/* CONTROL ALTAR */}
      <div
        className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[70] flex flex-wrap gap-2 justify-center"
        role="toolbar"
        aria-label="Chaos controls"
      >
        <button
          onClick={handleInvert}
          aria-label="Invert reality"
          className="px-3 py-2 text-xs sm:text-sm font-bold cursor-pointer bg-black text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-black shake-hard"
          style={{ fontFamily: 'var(--font-metal)' }}
        >
          ☠ DO NOT CLICK ☠
        </button>
        <button
          onClick={handleMoreChaos}
          aria-label={`Increase chaos intensity, currently level ${intensity} of 5`}
          className="px-3 py-2 text-xs sm:text-sm font-bold cursor-pointer bg-fuchsia-600 text-black border-2 border-white hover:invert"
          style={{ fontFamily: 'var(--font-metal)' }}
        >
          ⛧ MORE CHAOS [{intensity}/5] ⛧
        </button>
        <button
          onClick={handleToggleMute}
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          className="px-3 py-2 text-xs sm:text-sm font-bold cursor-pointer bg-yellow-300 text-black border-2 border-black hover:invert"
          style={{ fontFamily: 'var(--font-metal)' }}
        >
          {muted ? '🔇 SILENCE (COWARD)' : '🔊 NOISE ON'}
        </button>
      </div>
    </div>
  );
}
