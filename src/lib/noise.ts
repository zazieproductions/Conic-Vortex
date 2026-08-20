let ctx: AudioContext | null = null;
let muted = false;
let droneNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

export function initAudio() {
  if (!ctx) {
    ctx = new AudioContext();
    startDrone();
  } else if (ctx.state === 'suspended') {
    ctx.resume();
  }
}

export function toggleMute(): boolean {
  muted = !muted;
  droneNodes.forEach((n) => {
    if (ctx) n.gain.gain.setTargetAtTime(muted ? 0 : 0.018, ctx.currentTime, 0.1);
  });
  return muted;
}

export function isMuted() {
  return muted;
}

function startDrone() {
  if (!ctx) return;
  const freqs = [55, 55.7, 82.4, 83.1];
  freqs.forEach((f, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.value = f;
    gain.gain.value = 0.018;
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

export function blip() {
  if (!ctx || muted) return;
  const types: OscillatorType[] = ['square', 'sawtooth', 'triangle'];
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = types[Math.floor(Math.random() * types.length)];
  const start = 80 + Math.random() * 1200;
  osc.frequency.setValueAtTime(start, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    40 + Math.random() * 2500,
    ctx.currentTime + 0.18
  );
  gain.gain.setValueAtTime(0.055, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

export function scream() {
  if (!ctx || muted) return;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => blip(), i * 60);
  }
}
