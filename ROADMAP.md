# Roadmap

Y̷Y̶Y̸Y̵Y̷Y̶Y̸ is a living art piece. This roadmap tracks planned work across
three horizons: near-term quality-of-life, experimental extensions, and
longer research directions. It is a planning artifact, not a promise.

## Near term (next few releases)

### Quality & accessibility

- [ ] Honour `prefers-reduced-motion` by defaulting to intensity 1 and
      disabling strobe + flash + shake animations for users who opt in.
- [ ] Allow warning-gate entry via keyboard (`Enter` / `Space`) when the
      button has focus, and add a visible focus ring.
- [ ] Self-host Google Fonts (remove the third-party stylesheet fetch).
- [ ] Add README badges that reflect real build/version state (bundle
      size badge via `pkg-size`, Lighthouse performance via automated
      runs).

### Audio

- [ ] Resume audio on any post-entry user gesture, not just the Enter
      button, so suspended contexts recover gracefully.
- [ ] Add a BiquadFilter (low-pass) with LFO-modulated cutoff as an
      optional drone colouration.
- [ ] Add `PannerNode` so blips spatialise to the cursor position.

### Visual

- [ ] Add shader-based post-processing (chromatic aberration + bloom via
      a single full-screen `EffectComposer` pass) gated behind
      intensity ≥ 4.
- [ ] HSL-cycling material updates should pause when `document.hidden`,
      to save GPU on background tabs.
- [ ] Frustum culling / LOD for the 44 meshes (they are currently always
      ticked even when behind the camera).

### Tooling

- [ ] Add a simple Playwright smoke test that (a) loads the dev server,
      (b) clicks ENTER, (c) verifies the Three.js canvas mounts and no
      console errors occur.
- [ ] Automated screenshots in CI for visual-regression diffing.
- [ ] Bundle-size budget enforcement (fail the build if the main chunk
      regresses by more than 10%).

## Experimental

### Performance & control

- [ ] **WebMIDI input** — map note-on/CC to intensity, mute toggle, and
      invert; expose a small mapping UI (or simply listen on ch.1).
- [ ] **OSC bridge** over a WebSocket-to-UDP bridge so external tools
      (TouchOSC, Max, Ableton) can drive the vortex.
- [ ] **FFT-driven visuals** — wire `AnalyserNode` data into mesh
      parameters (scale, rotation speed, particle size).
- [ ] **Microphone reactivity** — optional `getUserMedia` input that
      modulates a particle field (gated behind a separate consent
      button, never enabled by default).
- [ ] **Generative seeds** — deterministic RNG seeded from a hash, so a
      visitor could share "their" vortex via URL.

### Generative content

- [ ] Markov-chain / context-free grammar for generating new marquee
      copy and popup bodies in the same voice.
- [ ] Cellular-automaton patterns overlaid on the spiral background.
- [ ] Procedural sigil generator — make `assets:generate` seedable and
      parameterised so the goat/eye/sun sprites can take families of
      shapes.

### Export / performance modes

- [ ] **Kiosk mode** — fullscreen, no cursor trail, no right-click, for
      gallery installs.
- [ ] **Canvas snapshot** — button to render the current Three.js frame
      to a downloadable PNG.
- [ ] **Audio render** — offline-render the current drone + blip
      activity to a downloadable WAV.

## Research directions

These are bigger bets and may never ship — they're here so the
intent is visible.

- **Ambisonic / binaural audio** — head-tracked (via DeviceOrientation)
  spatial drone over headphones.
- **GPU-driven particles** — move the particle field to a
  `THREE.ShaderMaterial` with attribute updates on the GPU, scaling
  comfortably to 50k+ points.
- **Constraint-based mesh motion** — lightweight collision detection
  between orbiting meshes so occasional "impacts" trigger blips and
  material flashes.
- **Peer-to-peer multi-user** — WebRTC data channels sharing chaos
  state between two browsers, so two cursors can alter each other's
  vortex.
- **Custom raymarched SDF layer** — signed-distance-field geometry
  rendered in a full-screen shader to complement the mesh-based scene.

If any of these excite you, open an issue or PR — external
collaborations are welcome.
