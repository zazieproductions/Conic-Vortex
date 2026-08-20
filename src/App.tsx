import { useState, useEffect, useCallback } from 'react';
import ThreeChaos from './components/ThreeChaos';
import MarqueeLayer from './components/MarqueeLayer';
import SymbolStorm from './components/SymbolStorm';
import PopupHell from './components/PopupHell';
import CursorTrail from './components/CursorTrail';
import EscapeButton from './components/EscapeButton';
import { initAudio, blip, toggleMute, scream } from './lib/noise';

function WarningGate({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-8 p-6 text-center warning-border border-[12px]">
      <div
        className="text-red-600 text-3xl sm:text-5xl blinker"
        style={{ fontFamily: 'var(--font-drip)' }}
      >
        ⚠ WARNING ⚠
      </div>
      <div
        className="text-yellow-300 max-w-xl text-sm sm:text-lg leading-relaxed"
        style={{ fontFamily: 'var(--font-metal)' }}
      >
        THIS SITE CONTAINS RAPIDLY FLASHING LIGHTS, STROBING COLORS, LOUD PROCEDURAL
        NOISE, AND AGGRESSIVE MOTION. NOT SUITABLE FOR PHOTOSENSITIVE VISITORS,
        THE FAINT OF HEART, OR THE SANE.
      </div>
      <div
        className="text-cyan-400 text-xs sm:text-sm"
        style={{ fontFamily: 'var(--font-eaten)' }}
      >
        by entering you agree that your cursor becomes a ritual implement
      </div>
      <button
        onClick={onEnter}
        className="px-10 py-4 text-2xl sm:text-4xl cursor-pointer bg-red-700 text-white border-4 border-double border-yellow-300 hover:bg-yellow-300 hover:text-red-700 zoom-pulse"
        style={{ fontFamily: 'var(--font-fraktur)', boxShadow: '0 0 60px #ff0000' }}
      >
        ENTER THE VOID
      </button>
      <div className="text-white/40 text-xs" style={{ fontFamily: 'monospace' }}>
        [ inspired by the sacred chaos of yyyyyyy ]
      </div>
    </div>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [inverted, setInverted] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [muted, setMuted] = useState(false);
  const [counter, setCounter] = useState(666666);

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

  if (!entered) return <WarningGate onEnter={enter} />;

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${inverted ? 'invert-world' : ''}`}
      onClick={handleGlobalClick}
    >
      {/* LAYER 0: strobing background */}
      <div className="fixed inset-0 strobe-bg" />
      <div className="fixed inset-0 checker-bg" />

      {/* spinning conic vortex behind everything */}
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

      {/* LAYER 1: 3D chaos */}
      <ThreeChaos />

      {/* LAYER 2: symbol storm */}
      <SymbolStorm intensity={intensity} />

      {/* giant rotating sigils, blend-mode difference */}
      <img
        src="/sprites/eye.png"
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
        src="/sprites/goat.png"
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
        src="/sprites/sun.png"
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

      {/* CENTER TITLE */}
      <div className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        <h1
          className="rainbow-text glitch-clip text-[13vw] leading-none"
          style={{ fontFamily: 'var(--font-glitch)' }}
        >
          Y̷Y̶Y̸Y̵Y̷Y̶Y̸
        </h1>
        <div
          className="shake-hard text-white text-[3vw] mt-2"
          style={{ fontFamily: 'var(--font-fraktur)', textShadow: '0 0 20px #ff00ff, 4px 4px 0 #000' }}
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
      <div className="fixed inset-0 z-[60] flash-overlay" />
      <div className="fixed inset-0 z-[61] vhs-lines" />

      {/* cursor trail */}
      <CursorTrail />

      {/* CONTROL ALTAR */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[70] flex flex-wrap gap-2 justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            scream();
            setInverted((v) => !v);
          }}
          className="px-3 py-2 text-xs sm:text-sm font-bold cursor-pointer bg-black text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-black shake-hard"
          style={{ fontFamily: 'var(--font-metal)' }}
        >
          ☠ DO NOT CLICK ☠
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            scream();
            setIntensity((i) => (i >= 5 ? 1 : i + 1));
          }}
          className="px-3 py-2 text-xs sm:text-sm font-bold cursor-pointer bg-fuchsia-600 text-black border-2 border-white hover:invert"
          style={{ fontFamily: 'var(--font-metal)' }}
        >
          ⛧ MORE CHAOS [{intensity}/5] ⛧
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMuted(toggleMute());
          }}
          className="px-3 py-2 text-xs sm:text-sm font-bold cursor-pointer bg-yellow-300 text-black border-2 border-black hover:invert"
          style={{ fontFamily: 'var(--font-metal)' }}
        >
          {muted ? '🔇 SILENCE (COWARD)' : '🔊 NOISE ON'}
        </button>
      </div>
    </div>
  );
}
