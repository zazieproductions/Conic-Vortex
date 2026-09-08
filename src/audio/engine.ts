/**
 * Procedural audio engine for Conic-Vortex.
 *
 * Everything heard is synthesized live through the Web Audio API — there are no
 * audio files in the project. The engine exposes four effects:
 *
 *   - A continuous, LFO-modulated ambient "drone" (4 detuned oscillators).
 *   - `blip()`   — a short random oscillator glissando (drops into the mix on
 *                  clicks and periodic events).
 *   - `scream()` — five rapid blips, used as punctuation on charged actions.
 *   - `toggleMute()` — smoothly fades the drone in/out via an exponential ramp.
 *
 * Web Audio requires a user gesture before an AudioContext will run, so callers
 * must call `initAudio()` from a trusted event handler (the entry button does).
 *
 * The module keeps a tiny amount of process-global state (the live context and
 * the mute flag) because the browser permits only a handful of AudioContexts
 * and the drone must survive component unmounts.
 */

type AudioWindow = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext };

const DRONE_GAIN = 0.018;
// Detuned fundamentals so the stacked oscillators beat and thicken.
const DRONE_FREQUENCIES = [55, 55.7, 82.4, 83.1];

/** Live oscillator/gain pairs that form the ambient drone. */
type DroneVoice = { osc: OscillatorNode; gain: GainNode };

let ctx: AudioContext | null = null;
let muted = false;
const droneVoices: DroneVoice[] = [];

/** Resolve the browser's AudioContext constructor (with vendor fallbacks). */
function createAudioContext(): AudioContext | null {
  try {
    const Ctor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
    return Ctor ? new Ctor() : null;
  } catch (err) {
    console.error('[audio] Web Audio is unavailable in this browser.', err);
    return null;
  }
}

/**
 * Lazily create (or resume) the shared AudioContext and start the drone.
 * Safe to call repeatedly — the drone only ever starts once.
 */
export function initAudio(): void {
  if (!ctx) {
    ctx = createAudioContext();
    if (ctx) startDrone();
  } else if (ctx.state === 'suspended') {
    ctx.resume().catch((err) => {
      console.warn('[audio] Could not resume AudioContext.', err);
    });
  }
}

/** Toggle the drone on/off, returning the new mute state. */
export function toggleMute(): boolean {
  muted = !muted;
  if (ctx) {
    const target = muted ? 0 : DRONE_GAIN;
    droneVoices.forEach((v) => {
      v.gain.gain.setTargetAtTime(target, ctx!.currentTime, 0.1);
    });
  }
  return muted;
}

export function isMuted(): boolean {
  return muted;
}

/** Build the persistent ambient drone: 4 detuned, LFO-modulated oscillators. */
function startDrone(): void {
  if (!ctx) return;
  const freqs = DRONE_FREQUENCIES;
  freqs.forEach((f, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();

    // Alternate harsh (sawtooth) and softer (triangle) waveforms.
    osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.value = f;
    gain.gain.value = DRONE_GAIN;

    // A slow LFO wobbles each oscillator's frequency for organic drift.
    const lfo = ctx!.createOscillator();
    const lfoGain = ctx!.createGain();
    lfo.frequency.value = 0.1 + Math.random() * 0.3;
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    lfo.start();
    osc.connect(gain);
    gain.connect(ctx!.destination);
    osc.start();

    droneVoices.push({ osc, gain });
  });
}

/** One-shot glissando "blip": random type, sliding from a high pitch downward. */
export function blip(): void {
  if (!ctx || muted) return;
  const types: OscillatorType[] = ['square', 'sawtooth', 'triangle'];
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = types[Math.floor(Math.random() * types.length)];
  const start = 80 + Math.random() * 1200;
  osc.frequency.setValueAtTime(start, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    40 + Math.random() * 2500,
    ctx.currentTime + 0.18,
  );
  gain.gain.setValueAtTime(0.055, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

/** Punctuation "scream": five rapid blips. */
export function scream(): void {
  if (!ctx || muted) return;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => blip(), i * 60);
  }
}
