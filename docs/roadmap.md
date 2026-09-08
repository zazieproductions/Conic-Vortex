# Roadmap

Conic-Vortex is a living experiment. This roadmap keeps **implemented**, **in
flight**, and **aspirational** work honest and separated so readers never confuse
what already runs with what is imagined.

Legend: ✅ implemented · 🔜 planned next · 🧪 experimental · 🔬 research

## Implemented (shipped)

- ✅ Hostile-interface core: gate → full-screen layered experience.
- ✅ Three.js scene: 44 meshes, center knot, ~21 sprite billboards, 900 particles.
- ✅ Web-Audio synth engine: drone, `blip`, `scream`, smooth mute.
- ✅ Intensity dial (1–5) scaling symbol density and popup cadence.
- ✅ Hydra popups, escaping button, cursor trail, marquee layer, sigil sprites.
- ✅ CSS-keyframe motion layer (strobe, glitch, flash, scanlines, hue-spin).
- ✅ Photosensitive warning gate; typed, linted, formatted, CI-built codebase.
- ✅ Three.js lazy-loaded into its own on-demand chunk so the gate/UI shell loads
  fast and the initial bundle is ~217 kB (~69 kB gzip).

## Near-term engineering polish (🔜)

- [ ] Add a Vitest unit-test seam for the pure helpers and the audio mute logic.
- [ ] Add `prefers-reduced-motion` handling that at minimum dims the strobe (the
      gate stays, but viewers who opt in should be able to tame the flash).
- [ ] First-class focus + keyboard path through the control altar and gate.
- [ ] Configurable chaos "seed" for deterministic, reproducible runs.

## Experimental systems (🧪)

Ideas that fit the concept but are not yet built. Each is independent.

### Live-performance & instrument features

- [ ] WebMIDI / OSC input to drive intensity, popup cadence, and drone params.
- [ ] PannerNode spatialization — the drone and blips orbit _around_ the listener.
- [ ] FFT analyser node mapped onto mesh rotation/size for audio-visual sync.
- [ ] Presets & procedural-state save/load (intensity, mute, invert, seed).

### Generative / rendering expansion

- [ ] Fragment/vertex shaders on the 3-D meshes (color, displacement).
- [ ] Deterministic number-theoretic knot topologies (not just seeded meshes).
- [ ] GPU-driven particle culling for the 900-particle field.
- [ ] Raymarching / signed-distance-field geometry as an alternate "world".

### Outputs & recording

- [ ] Export a frame (canvas snapshot) and bake the drone+effects to a WAV.
- [ ] Headless/offscreen render path for stills and video.

### Shared / networked

- [ ] Peer link (WebRTC data channel) mirroring a shared intensity/state between
      two viewers.
- [ ] Ambient mic reactivity feeding a second particle field.

## Research directions (🔬)

- Differential topology for generative knots; collision/constraint-based motion
  between orbiting meshes; lossy encoding of generative state for replay; Markov /
  cellular-automata text generation for the marquees; ambisonics/binaural audio.

## Non-goals

- No user accounts, auth, or server state.
- No downloads/install — it stays a URL.
- No "calming" UI redesign — see [`creative-methodology.md`](creative-methodology.md).
