/**
 * components/WarningGate.tsx
 * Full-screen epilepsy / content warning. Must be explicitly acknowledged
 * before any strobing or audio is shown – an ethical and accessibility gate.
 */
interface WarningGateProps {
  onEnter: () => void;
}

export default function WarningGate({ onEnter }: WarningGateProps) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-8 p-6 text-center warning-border border-[12px]"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="warning-title"
      aria-describedby="warning-body"
    >
      <div
        id="warning-title"
        className="text-red-600 text-3xl sm:text-5xl blinker"
        style={{ fontFamily: 'var(--font-drip)' }}
      >
        ⚠ WARNING ⚠
      </div>
      <div
        id="warning-body"
        className="text-yellow-300 max-w-xl text-sm sm:text-lg leading-relaxed"
        style={{ fontFamily: 'var(--font-metal)' }}
      >
        THIS SITE CONTAINS RAPIDLY FLASHING LIGHTS, STROBING COLORS, LOUD PROCEDURAL NOISE, AND
        AGGRESSIVE MOTION. NOT SUITABLE FOR PHOTOSENSITIVE VISITORS, THE FAINT OF HEART, OR THE
        SANE.
      </div>
      <div className="text-cyan-400 text-xs sm:text-sm" style={{ fontFamily: 'var(--font-eaten)' }}>
        by entering you agree that your cursor becomes a ritual implement
      </div>
      <button
        onClick={onEnter}
        aria-label="Enter the experience (acknowledges photosensitivity warning)"
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
