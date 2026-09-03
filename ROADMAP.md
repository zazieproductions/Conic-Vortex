# Roadmap

## Near-term

### Code Quality and Tooling
- [ ] Extract CSS variables from `index.css` into `tailwind.config.js` `theme.extend` for proper design tokens
- [ ] Add `prettier` configuration and integrate into npm scripts
- [ ] Enable TypeScript strict mode and fix any resulting errors
- [ ] Add `import Sort` ESLint rule and resolve ordering violations
- [ ] Remove unused `framer-motion` and `lucide-react` imports from `package.json`
- [ ] Add `component-typed` or similar prop-type validation

### Accessibility and Usability
- [ ] Add `aria-label` attributes to all control buttons (☠ DO NOT CLICK, ⛧ MORE CHAOS, 🔊 NOISE ON/OFF)
- [ ] Add `focus` styles for keyboard navigability (currently `user-select: none` globally)
- [ ] Ensure WarningGate is reachable via Escape key
- [ ] Add reduced-motion media query support for `prefers-reduced-motion`

### Three.js Scene Improvements
- [ ] Add frustum culling for the 44 meshes to reduce GPU load
- [ ] Implement orbit controls as optional alternate camera mode
- [ ] Add LOD (level-of-detail) switching based on camera distance
- [ ] Add mesh selection/highlight on hover (compatible with Arena element-picker)

### Audio System
- [ ] Add `resumeAudio()` call on any user gesture, not just the Enter button
- [ ] Add WebAudioWorklet-based parametric EQ filter on the drone output
- [ ] Add optional microphone input reactivity (visualize input volume as additional particle field)

### Documentation
- [ ] Write design system documentation (typography, spacing, colors, blend modes)
- [ ] Write creative technology documentation (procedural systems, aesthetic intent)
- [ ] Add JSDoc comments to `noise.ts` export functions
- [ ] Add inline comments explaining WHY for non-obvious code sections

## Experimental

### MIDI / OSC Integration
- [ ] WebMIDI input — map note-on/note-off to intensity changes, popup spawn rates
- [ ] OSC sender — broadcast current state (intensity, muted, visitor count) to external systems
- [ ] MIDI controller mapping — assign knob/slider to intensity, fader to muted toggle

### WebAudio Worklet Effects
- [ ] Biquad filter — low-pass, high-pass, band-pass modulation on the drone
- [ ] Convolver reverb — impulse response for spatial ambience
- [ ] Dynamics compressor — automatic gain control for consistent loudness
- [ ] FFT visualizer — map drone frequencies to Three.js mesh parameters

### Generative Sequencing
- [ ] Procedural state persistence — save/load current chaotic state to localStorage
- [ ] User presets — save/load named configurations of intensity, muted, inverted
- [ ] Generative seed — deterministic RNG seeded by user input, reproducible sequences

### Spatial Audio
- [ ] PannerNode — pan drone around the user based cursor position
- [ ] Directional audio — blips appear to come from cursor direction
- [ ] Reverb tail on scream based on scene complexity

### Downloadable Output
- [ ] Canvas snapshot — export current Three.js frame as data URI or PNG
- [ ] Audio render — bake current drone + blips + scream to downloadable WAV/MP3
- [ ] Symbol storm pattern — export current symbol layout as text/ASCII art

### Patch Systems
- [ ] Modular node-based interface — connect audio/modal processing blocks
- [ ] Preset patch files — JSON-based saved signal routings
- [ ] Feedback loop control — intentional instability parameters

### Offline Rendering
- [ ] Headless Three.js rendering — export still images without browser UI
- [ ] Web Worker compute — move mesh computation off the main thread
- [ ] Server-side rendering — static previews for social sharing

## Research Directions

### Shader Systems
- [ ] Fragment shader — procedural color patterns on the 3D meshes
- [ ] Vertex shader — displacement based on audio frequency bands
- [ ] Raymarching — signed distance fields for abstract geometry
- [ ] Image-based lighting — environment map illumination for the scene

### Generative Sequencing
- [ ] Markov chain text generation — for marquee strip content
- [ ] Cellular automata — interactive rule-based pattern generation
- [ ] Perlin noise fields — displacement fields for mesh positions
- [ ] Chaos game — iterative visualization of probabilistic rule sets

### Spatial Audio
- [ ] Ambisonics — 3D sound field encoding for headphone playback
- [ ] HRTF — head-related transfer function for externalized audio perception
- [ ] Binaural panning — interactive audio direction control

### Sensors
- [ ] Gyroscope/accelerometer — mobile device motion affecting camera or symbol behavior
- [] Ambient light API — adjust screen brightness based on environment
- [] Orientation sensor — device rotation affecting vortex camera

### Live Performance Modes
- [ ] Kiosk mode — disable context menu, fullscreen only, no scroll
- [ ] Performanceset view — fixed camera orbit, no cursor trail, simplified UI
- [ ] Multi-instance — multiple concurrent experiences on one page
- [ ] MIDI sync — lock animation tempo to external MIDI clock