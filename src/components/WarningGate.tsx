/**
 * WarningGate — the ethical content boundary.
 *
 * Shown before anything runs: an explicit photosensitive-epilepsy / sensory
 * overload notice plus an unavoidable acknowledgement button. Clicking it is
 * what grants the app its (single) user gesture, which in turn lets the Web
 * Audio context start. Nothing in the experience mounts until this resolves.
 */

export default function WarningGate({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="warning-title"
      className="warning-border fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 border-[12px] bg-black p-6 text-center"
    >
      <div
        id="warning-title"
        className="blinker text-3xl text-red-600 sm:text-5xl"
        style={{ fontFamily: 'var(--font-drip)' }}
      >
        ⚠ WARNING ⚠
      </div>
      <div
        className="max-w-xl text-sm leading-relaxed text-yellow-300 sm:text-lg"
        style={{ fontFamily: 'var(--font-metal)' }}
      >
        THIS SITE CONTAINS RAPIDLY FLASHING LIGHTS, STROBING COLORS, LOUD PROCEDURAL
        NOISE, AND AGGRESSIVE MOTION. NOT SUITABLE FOR PHOTOSENSITIVE VISITORS, THE
        FAINT OF HEART, OR THE SANE.
      </div>
      <div
        className="text-xs text-cyan-400 sm:text-sm"
        style={{ fontFamily: 'var(--font-eaten)' }}
      >
        by entering you agree that your cursor becomes a ritual implement
      </div>
      <button
        type="button"
        onClick={onEnter}
        className="zoom-pulse cursor-pointer border-4 border-double border-yellow-300 bg-red-700 px-10 py-4 text-2xl text-white hover:bg-yellow-300 hover:text-red-700 sm:text-4xl"
        style={{ fontFamily: 'var(--font-fraktur)', boxShadow: '0 0 60px #ff0000' }}
      >
        ENTER THE VOID
      </button>
      <div className="text-xs text-white/40" style={{ fontFamily: 'monospace' }}>
        [ inspired by the sacred chaos of yyyyyyy ]
      </div>
    </div>
  );
}
