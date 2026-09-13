/**
 * audio/engine.ts
 * ---------------------------------------------------------------------------
 * Web Audio synthesis engine for the vortex.
 *
 * All audio is generated procedurally – no external samples. The engine stays
 * deliberately small and side-effect free until `initAudio()` is called, so
 * importing this module never touches AudioContext (respects browser autoplay
 * policy).
 *
 * Public surface:
 *   initAudio()      – lazily create AudioContext + drone, resume if suspended
 *   blip()           – one-off glitch blip (randomised osc type + glissando)
 *   scream()         – burst of 5 blips
 *   toggleMute()     – smooth fade of drone volume; returns new mute state
 *   isMuted()        – getter for current mute state
 *   isInitialized()  – true once initAudio() has created a context
 * ---------------------------------------------------------------------------
 */

let ctx: AudioContext | null = null;
let muted = false;

interface DroneVoice {
  osc: OscillatorNode;
  gain: GainNode;
}

const droneNodes: DroneVoice[] = [];

/** Nominal drone gain. Kept low – this is an ambient bed, not a lead. */
const DRONE_GAIN = 0.018;

/** Drone voice frequencies (Hz). Detuned pairs create beating. */
const DRONE_FREQS: readonly number[] = [55, 55.7, 82.4, 83.1];

/**
 * Create the four-voice drone with per-voice LFO frequency modulation.
 * Called once from initAudio().
 */
function startDrone(): void {
  if (!ctx) return;
  DRONE_FREQS.forEach((f, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();

    osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.value = f;
    gain.gain.value = muted ? 0 : DRONE_GAIN;

    // LFO modulating pitch (slow wobble, ~0.1–0.4 Hz, ±2 Hz)
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
    droneNodes.push({ osc, gain });
  });
}

/** Lazily create the AudioContext and drone, or resume a suspended one. */
export function initAudio(): void {
  if (!ctx) {
    ctx = new AudioContext();
    startDrone();
  } else if (ctx.state === 'suspended') {
    void ctx.resume();
  }
}

/** Has initAudio() created a context yet? */
export function isInitialized(): boolean {
  return ctx !== null;
}

/** Smoothly toggle drone gain. Returns the new mute state. */
export function toggleMute(): boolean {
  muted = !muted;
  if (!ctx) return muted;
  const target = muted ? 0 : DRONE_GAIN;
  droneNodes.forEach((n) => {
    n.gain.gain.setTargetAtTime(target, ctx!.currentTime, 0.1);
  });
  return muted;
}

/** Current mute state (does not reflect AudioContext.suspended). */
export function isMuted(): boolean {
  return muted;
}

/** Short glitch blip: random osc type, exponential glissando, fast decay. */
export function blip(): void {
  if (!ctx || muted) return;
  const types: OscillatorType[] = ['square', 'sawtooth', 'triangle'];
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = types[Math.floor(Math.random() * types.length)];
  const start = 80 + Math.random() * 1200;
  osc.frequency.setValueAtTime(start, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40 + Math.random() * 2500, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.055, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

/** A burst of five staggered blips – used for emphasis / chaos spikes. */
export function scream(): void {
  if (!ctx || muted) return;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => blip(), i * 60);
  }
}
