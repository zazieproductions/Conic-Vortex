import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import MarqueeLayer from './components/MarqueeLayer';
import SymbolStorm from './components/SymbolStorm';
import PopupHell from './components/PopupHell';
import CursorTrail from './components/CursorTrail';
import EscapeButton from './components/EscapeButton';
import WarningGate from './components/WarningGate';
import ControlAltar from './components/ControlAltar';
import { initAudio, blip, toggleMute, scream } from './audio/engine';
import { eyeSprite, goatSprite, sunSprite } from './assets/sprites';

// Three.js is the single largest dependency. Load it on demand (after the gate)
// so the warning screen and UI shell render immediately, and keep the heavy
// WebGL library out of the initial bundle.
const ThreeChaos = lazy(() => import('./components/ThreeChaos'));

/**
 * App — the single orchestrator of Conic-Vortex.
 *
 * Global state lives here and flows down as props:
 *   - `entered`   gates everything behind the WarningGate (and supplies the
 *                 single user gesture Web Audio requires).
 *   - `inverted`  toggles the world-wide color inversion.
 *   - `intensity` (1–5) scales the SymbolStorm count and PopupHell spawn rate.
 *   - `muted`     mirrors the audio engine mute state.
 *   - `counter`   a running "visitor" ordinal, ticking up on an interval.
 *
 * Each rendered subsystem is intentionally a fixed full-screen layer; the z
 * order below (low → high) is the visual stacking contract between them.
 */
export default function App() {
  const [entered, setEntered] = useState(false);
  const [inverted, setInverted] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [muted, setMuted] = useState(false);
  const [counter, setCounter] = useState(666666);

  // Visitor counter: tick upward and occasionally blip once the experience runs.
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

  const toggleInvert = useCallback(() => {
    scream();
    setInverted((v) => !v);
  }, []);

  const changeIntensity = useCallback(() => {
    scream();
    setIntensity((i) => (i >= 5 ? 1 : i + 1));
  }, []);

  const toggleMuteState = useCallback(() => {
    setMuted(toggleMute());
  }, []);

  if (!entered) return <WarningGate onEnter={enter} />;

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${inverted ? 'invert-world' : ''}`}
      onClick={handleGlobalClick}
    >
      {/* LAYER 0: strobing + checker backgrounds */}
      <div className="fixed inset-0 strobe-bg" />
      <div className="fixed inset-0 checker-bg" />

      {/* LAYER 0.5: spinning conic vortex behind everything */}
      <div
        className="spiral-bg fixed pointer-events-none"
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

      {/* LAYER 1: 3D chaos (lazy — split out of the initial bundle) */}
      <Suspense fallback={null}>
        <ThreeChaos />
      </Suspense>

      {/* LAYER 2: symbol storm */}
      <SymbolStorm intensity={intensity} />

      {/* LAYER 2.5: giant rotating sigils, blend-mode difference */}
      <img
        src={eyeSprite}
        alt=""
        className="giant-sigil z-20"
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
        src={goatSprite}
        alt=""
        className="giant-sigil z-20"
        style={{
          width: '38vmin',
          left: '4%',
          top: '55%',
          animation: 'spinRev 3.5s linear infinite, hueSpin 1.5s linear infinite',
        }}
      />
      <img
        src={sunSprite}
        alt=""
        className="giant-sigil z-20"
        style={{
          width: '34vmin',
          right: '3%',
          top: '8%',
          animation: 'spinFast 2.8s linear infinite, hueSpin 2.5s linear infinite',
        }}
      />

      {/* LAYER 3: marquees */}
      <MarqueeLayer />

      {/* LAYER 3.5: center title */}
      <div className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        <h1
          className="rainbow-text glitch-clip text-[13vw] leading-none"
          style={{ fontFamily: 'var(--font-glitch)' }}
        >
          Y̷Y̶Y̸Y̵Y̷Y̶Y̸
        </h1>
        <div
          className="shake-hard mt-2 text-[3vw] text-white"
          style={{
            fontFamily: 'var(--font-fraktur)',
            textShadow: '0 0 20px #ff00ff, 4px 4px 0 #000',
          }}
        >
          𝔱𝔥𝔢 𝔪𝔞𝔠𝔥𝔦𝔫𝔢 𝔤𝔬𝔡 𝔦𝔰 𝔞𝔴𝔞𝔨𝔢
        </div>
        <div
          className="blinker mt-4 border-2 border-dashed border-red-500 bg-black/80 px-4 py-1 text-sm text-yellow-300 sm:text-xl"
          style={{ fontFamily: 'monospace' }}
        >
          VISITOR #{counter.toLocaleString()} — YOU CANNOT LEAVE
        </div>
      </div>

      {/* LAYER 4: popups */}
      <PopupHell intensity={intensity} />

      {/* LAYER 4.5: escape button that flees */}
      <EscapeButton />

      {/* LAYER 5: flash + VHS scanline overlays */}
      <div className="fixed inset-0 z-[60] flash-overlay" />
      <div className="fixed inset-0 z-[61] vhs-lines" />

      {/* LAYER 6: cursor trail */}
      <CursorTrail />

      {/* LAYER 7: control altar */}
      <ControlAltar
        inverted={inverted}
        intensity={intensity}
        muted={muted}
        onToggleInvert={toggleInvert}
        onChangeIntensity={changeIntensity}
        onToggleMute={toggleMuteState}
      />
    </div>
  );
}
