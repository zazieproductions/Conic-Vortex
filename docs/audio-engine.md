# Audio Engine

All of Conic-Vortex's sound is synthesized live with the **Web Audio API**. There
are no audio files in the repository and no external audio sources. The engine
lives in `src/audio/engine.ts`.

## Public API

| Export                  | Purpose                                                                 |
| :---------------------- | :---------------------------------------------------------------------- |
| `initAudio()`           | Lazily create (or resume) the shared `AudioContext` and start the drone |
| `toggleMute(): boolean` | Smoothly fade the drone in/out; returns the new mute state              |
| `isMuted(): boolean`    | Query the mute state                                                    |
| `blip()`                | One-shot randomized oscillator glissando                                |
| `scream()`              | Five rapid `blip()`s (punctuation on charged actions)                   |

## Design

### The drone

Four oscillators form the ambient bed:

- Fundamentals ≈ **55, 55.7, 82.4, 83.1 Hz** — close enough to beat and thicken.
- Waveforms alternate **sawtooth / triangle** for a blend of harsh and soft.
- Each oscillator's frequency is modulated by its **own slow LFO**
  (0.1–0.4 Hz, depth 2 Hz) so the pitch drifts organically rather than sitting
  still and sterile.

The drone is created once and lives for the whole session — a browser only
permits a handful of `AudioContext`s, so the engine keeps one module-level
context and reuses it.

### One-shots: `blip` and `scream`

`blip()` picks a random oscillator type (square/sawtooth/triangle), starts around
80–1280 Hz, and **exponential-ramps down** to 40–2540 Hz over 0.18 s while its gain
envelope decays to ~0.0001 over 0.25 s. The downward exponential glide is what
makes it read as a "blip" rather than a note.

`scream()` simply schedules five `blip()`s 60 ms apart — used as a rising
crescendo of panic on charged actions like escalating chaos.

### Muting

`toggleMute()` ramps the drone's gain with `setTargetAtTime(gain, ctxTime, 0.1)` —
an **exponential** approach to 0 (or back to `DRONE_GAIN`). An exponential ramp
avoids the abrupt "click" a linear/instant cut produces. One-shots are simply
suppressed while muted.

## Browser autoplay constraints

Browsers will not let an `AudioContext` run until a **user gesture**. Conic-Vortex
uses the entry button on `WarningGate` as that single gesture: its click handler
calls `initAudio()` (which creates/resumes the context and starts the drone) and
`scream()`. If you later need to restart sound after a mute, toggling 🔊 back on
re-arms it.

## Robustness

- The context is created inside a `try/catch` and falls back across
  `webkitAudioContext`, so an unsupported browser logs once and the rest of the
  piece keeps running.
- `initAudio()` is idempotent and safe to call from any layer; the drone starts
  exactly once.

## Ideas / extension points

Possible future work (see [`roadmap.md`](roadmap.md)): a WebAudioWorklet EQ on the
drone output, an FFT analyser driving mesh parameters, PannerNode spatialization,
and OSC/MIDI mapping for live performance.
