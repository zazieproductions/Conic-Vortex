# Y̷Y̶Y̸Y̵Y̷Y̶Y̸

A browser-based interactive audio-visual instrument exploring procedural systems, audiovisual signal processing, and hostile interface design.

**Created by Zazie Productions**

> Click the interface below to launch the live project.

[![Project Preview](docs/images/project-preview.png)](https://zazie-productions.github.io/Conic-Vortex/)

[![Launch Live Project](https://img.shields.io/badge/Launch-Live_Project-111111?style=for-the-badge)](https://zazie-productions.github.io/Conic-Vortex/)

---

## ⚠️ WARNING

This site contains rapidly flashing lights, strobing colors, loud procedural noise, and aggressive motion. **NOT suitable for photosensitive visitors, the faint of heart, or the sane.** By entering you agree that your cursor becomes a ritual implement.

---

## Overview

Y̷Y̶Y̸Y̵Y̷Y̶Y̸ is a real-time generative web application that combines Three.js 3D chaos, particle systems, symbol storms, and cascading popups into a hostile information architecture. The project renders a procedurally generated vortex of 3D objects, textures, and typographic elements that respond to user interaction with audio feedback, cursor trails, and escalating chaos states.

The experience is structured as layered systems:
- **Layer 0**: Strobing background and checker patterns
- **Layer 1**: 3D chaos with 44 procedurally spinning objects
- **Layer 2**: Symbol storm with randomized runes and characters
- **Layer 3**: Marquee strips with occult and technical terminology
- **Layer 4**: Popup hell with self-referential recursive behavior
- **Layer 5**: Cursor trail and control altar

---

## Live Demo

**Live Project**: https://zazie-productions.github.io/Conic-Vortex/

Launch the interactive experience above. The project will present a warning gate — you must acknowledge the content warnings to proceed.

---

## Features

- **Procedural 3D Chaos**: 44 unique 3D meshes (tori, knots, Platonic solids) with independent orbital motion and randomization
- **Symbol Storm**: Dynamic flood of runic characters that teleport, grow/shrink, and animate with varied motion profiles
- **Marquee Layer**: Scrolling strips of formatted text with blend-mode effects (difference, exclusion, normal)
- **Popup Hell**: Self-replicating popups that spawn more popups when closed — "hydra rule"
- **Cursor Trail**: Mouse-following particle trail with fading, rotating symbols
- **Control Altar**: Three interactive buttons — ☠ DO NOT CLICK (escapes), ⛧ MORE CHAOS (increases intensity), 🔊 NOISE ON / 🔇 SILENCE (toggle mute)
- **Audio Drone**: Continuous ambient drone with frequency modulation, plus blip and scream sound effects
- **Glitch & Rainbow Text**: Animated CSS keyframe effects on the central Y̷Y̶Y̸Y̵Y̷Y̶Y̸ title
- **Invert World**: Toggle color inversion via the control button
- **Escape Button**: Fleeing button that runs away from your cursor, with increasing "taunts"

---

## Technical Architecture

The project is built with **React 19**, **Vite 7**, and **TailwindCSS 4** with the following key subsystems:

- **Three.js Rendering**: `src/components/ThreeChaos.tsx` — full scene graph with camera, lighting, particle fields, and 44 animated meshes
- **Audio Engine**: `src/lib/noise.ts` — AudioContext-driven drone, blips, and scream effects with LFO modulation
- **Symbol/Particle Systems**: `src/components/SymbolStorm.tsx` and `src/components/MarqueeLayer.tsx` — state-managed React systems with interval-based updates
- **Interactive Layers**: `src/components/{CursorTrail,EscapeButton,PopupHell,ThreeChaos}.tsx` — each manages its own `useState` + `useEffect` animation loop
- **Global State**: Managed within `App.tsx` — `entered` gate, `intensity` (1-5), `muted` state, `inverted` world state, `counter` visitor counter

---

## Signal Flow

1. **App.entered** gates the entire experience — until acknowledged, only the WarningGate is visible
2. **initAudio()** creates an AudioContext and starts a 4-frequency drone with LFO-modulated oscillator frequencies
3. **blip()** generates a random-type oscillator glissando (80→2500Hz exponential ramp, 0.25s duration)
4. **scream()** triggers 5 rapid blips spaced 60ms apart
5. **toggleMute()** fades drone gain to silence with `setTargetAtTime` for smooth amplitude modulation
6. **Mouse movement** triggers `CursorTrail` — spawns fading trail bits at the cursor position
7. **Control buttons** modify `App` state: `setIntensity`, `setMuted`, `setInverted`
8. **Intensity** (1-5) propagates to `SymbolStorm` (affects count: 30 + intensity × 12) and `PopupHell` (affects spawn interval: max(1200, 3200 - intensity × 400))
9. **ThreeChaos** maintains its own internal clock and mesh userData for orbital motion, independent of App state

---

## Project Structure

```
src/
├── App.tsx           — Main application component, state gate, control altar
├── main.tsx          — React root entry point
├── index.css         — TailwindCSS base, custom fonts, all keyframe animations
├── components/
│   ├── ThreeChaos.tsx      — WebGL Three.js scene (44 meshes, orbital motion, sprites)
│   ├── MarqueeLayer.tsx    — Scrolling text strips with blend-mode effects
│   ├── SymbolStorm.tsx     — Particle-like runic character storm
│   ├── PopupHell.tsx       — Self-replicating popup system
│   ├── CursorTrail.tsx     — Mouse-following fading symbol trail
│   └── EscapeButton.tsx    — Fleeing interactive button
└── lib/
    └── noise.ts          — AudioContext drone, blip, scream, toggleMute

docs/
├── architecture/         — ARCHITECTURE.md (system design, signal flow, diagrams)
├── design/             — Design system documentation
├── images/             — Screenshots and social preview
├── technical/          — Subsystem technical docs
└── development/        — Setup, debugging, deployment docs

public/                 — Static assets, favicon, index.html
scripts/                — Capture screenshots, build tools
package.json            — Dependencies and npm scripts
vite.config.ts          — Vite configuration
tsconfig*.json          — TypeScript configuration
.eslintrc.js            — ESLint configuration
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/zazie-productions/Conic-Vortex.git
cd Conic-Vortex

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Local Development

```bash
npm run dev     # Start Vite dev server at http://localhost:5173
npm run build   # Produce production build in dist/
npm run lint    # Run ESLint
npm run preview # Preview production build locally
```

---

## Production Build

```bash
npm run build
```

Output is in `dist/` — contains `index.html`, `assets/index*.css`, and `assets/index*.js`.  
The build uses Vite with React plugin and TailwindCSS 4. TypeScript checking is performed via `tsc -b` before the Vite build.

---

## Deployment

The project is deployed to GitHub Pages at https://zazie-productions.github.io/Conic-Vortex/.

Deployment is handled by GitHub Actions workflow `.github/workflows/deploy-pages.yml`, which builds and pushes to the `gh-pages` branch on every push to `main`.

---

## Screenshots

| Screenshot | Description |
|---|---|
| `docs/images/project-preview.png` | Primary showcase — interface after entering, with warning gate dismissed |
| `docs/images/project-active.png` | Active state — animation running, chaos at full intensity |
| `docs/images/project-detail.png` | Detail close-up — highlights the 3D vortex and symbol interactions |

---

## Design System

The visual language combines multiple distinct aesthetic traditions:

- **Drip font** (`--font-fraktur`: UnifrakturMaguntia): Blackletter-inspired display
- **Glitch font** (`--font-glitch`: Rubik Glitch): Disrupted, decomposing letterforms
- **Eater font** (`--font-eaten`: Eater): Consumptive, distressed styling
- **Metal font** (`--font-metal`: Metal Mania): Industrial, riveted appearance
- **Creepster font** (`--font-creep`: Creepster): Horror-styled distressed
- **TailwindCSS 4** with custom `@theme` configuration for all CSS variables
- **Color palette**: `#ff0000`, `#00ff00`, `#ffff00`, `#ff00ff`, `#00ffff`, `#7700ff`, `#ff5500`, `#000000`
- **Blend modes**: `difference`, `exclusion`, `normal` — applied to backgrounds and sigils
- **Keyframe animations**: strobe, checker scroll, hue spin, spinFast, spinRev, marqueeMove, blinkHard, rainbowText, shakeHard, glitchClip, zoomPulse
- **Interface hierarchy**: Fixed-position layers z-indexed from 10-70, with control altar at bottom center

---

## Concept / Artistic Context

Y̷Y̶Y̸Y̵Y̷Y̶Y̸ explores the tension between perception and information overload. The Y̷Y̶Y̸Y̵Y̷Y̶Y̸ motif — a.yaml Y with strikethroughs — suggests erasure, decay, and the impossibility of fully grasping the displayed system. The project draws from:

- **Institutional machinery aesthetics**: Interface designs that feel like scientific instruments or government portals
- **Signal decay**: Progressive corruption of visual and audio signals through procedural generation
- **Hostile information architecture**: Designs that impede rather than facilitate user goals
- **Procedural subjectivity**: The user's cursor, interactions, and choices become part of the generative system
- **The Goat as ritual symbol**: Recurring animal motif representing the observer/participant

The work avoids "immersive" or "seamless" experiences in favor of one that explicitly draws attention to its own construction, its artificial constraints, and the ways in which technical systems shape what we can perceive.

---

## Performance Considerations

- The Three.js scene renders 44 meshes + 900 particles + sprite objects — scene complexity is high
- Strobe and checker animations run on CSS keyframes — negligible GPU impact
- Symbol storm count scales with intensity (30-90 symbols) — manageable on most devices
- Audio is synthesized via AudioContext — low CPU cost
- **Recommendation**: Use on desktop/laptop with modern GPU. Not recommended for mobile devices with limited GPU resources.
- The warning gate exists because of the strobe effects and rapid visual changes.

---

## Browser Support

Tested on latest versions of Chrome, Firefox, Safari, and Edge. Mobile browsers may exhibit reduced performance or unexpected behavior due to the WebGL and CSS animation load.

---

## Accessibility

- **Warning gate** explicitly notifies of flashing/strobing content — users can opt out before entering
- `user-select: none` is applied globally to prevent text selection
- `cursor: crosshair` is the default pointer — no hover-based information disclosure
- All color combinations use high-contrast pairings (red/cyan, green/magenta, yellow/blue)
- **However**: The project deliberately employs `filter: invert(1)` / hue-rotate effects, strobe animations, and rapid motion that cannot be easily reconciled with WCAG compliance. The warning gate provides opt-out.

---

## Known Limitations

- High scene complexity (44 meshes + 900 particles) may cause performance degradation on integrated GPUs
- Audio context may be suspended on page load — user interaction required to resume (`Enter` key or click)
- Popup system may create many windows — browser pop-up blockers will prevent some popups from appearing
- The "Escape Button" may be difficult to click when intensity is high (it flees rapidly)
- Intensity level 5 produces the maximum chaotic state — may be overwhelming by design
- No save/presist state — closing the page resets all state including visitor counter and intensity

---

## Testing

- Clean install: `npm ci`
- Type check: `npx tsc -b`
- Lint: `npm run lint`
- Production build: `npm run build`
- Preview: `npm run preview`

No automated UI tests are currently configured — manual testing is the primary verification method.

---

## Roadmap

### Near-term

- Add `prettier` formatting consistent across codebase
- Extract CSS variables from `index.css` into `tailwind.config.js` `theme.extend`
- Add TypeScript strict mode validation
- Implement `resumeAudio()` on user gesture rather than `useEffect` dependency
- Add `aria-label` descriptions to control buttons
- Fix `data-source-loc` attributes on generated elements for element-picker support

### Experimental

- WebAudioWorklet-based parametric EQ filter on the drone output
- OSC/MIDI input integration for external controller mapping
- Shader-based post-processing pipeline (blur, bloom, chromatic aberration)
- Ambient microphone input reactivity (visualize input volume as additional particle field)
- Multi-channel audio panning for drone spatialization
- WebRTC data channel for shared experience between peers

### Research Directions

- Differential tree topology — procedurally generating different knot types based on number-theoretic properties
- Audio-visual sync algorithms — mapping FFT analysis to mesh parameters
- GPU-driven particle culling — reducing the 900-particle field to visible subset only
- Lossy compression of the procedural state — storing and replaying generative sequences
- Constraint-based motion — introducing collision detection between orbiting meshes

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

---

## License

See [LICENSE](LICENSE) for license rights and limitations.

---

## Credits

**Zazie Productions** — conceptual art, creative coding, and systems design

**Technical contributors** — See git blame and commit history for individual contributions

**Fonts**: UnifrakturMaguntia, Rubik Glitch, Nosifer, Eater, Metal Mania, Creepster (Google Web Fonts)

**Audio**: Synthesized via Web Audio API — no external audio files used

---

<!--

## CHANGELOG

See [CHANGELOG.md](CHANGELOG.md) for the project change history.

-->
