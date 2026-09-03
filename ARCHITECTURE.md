# ARCHITECTURE — Y̷Y̶Y̸Y̵Y̷Y̶Y̸

## Overall System Design

Y̷Y̶Y̸Y̵Y̷Y̶Y̸ is a single-page interactive art application built as a React component tree orchestrated by `App.tsx`. The rendering pipeline combines Three.js WebGL for 3D chaos, CSS keyframe animations for strobe and marquee effects, and Web Audio API for procedural audio. All layers are absolutely positioned within a fixed-height viewport that fills the browser window.

The application lifecycle follows a gate pattern:

1. **Initial render**: Only the `WarningGate` component is mounted
2. **User acknowledgment**: Clicking "ENTER THE VOID" sets `App.entered = true`
3. **Full experience**: The main application mounts, displaying all layers
4. **Cleanup**: On unmount, all animation intervals are cleared, WebGL resources disposed

## Application Lifecycle

| Phase | Component Tree | State |
|---|---|---|
| Warning | `WarningGate` | `entered = false` |
| Transition | `App` (partial) | `entered = true` initializing |
| Active | `App` full | `entered = true`, all subsystems running |
| Exit | Unmount | All intervals cleared, WebGL disposed |

## Modules

### `src/App.tsx` — Application Orchestrator

Top-level component managing global state:

- `entered: boolean` — gates the entire experience
- `inverted: boolean` — toggles `filter: invert(1) hue-rotate(90deg)` on the world div
- `intensity: 1|2|3|4|5` — controls symbol storm count and popup spawn rate
- `muted: boolean` — toggles AudioContext drone and effects

All subsystems receive `intensity` and `muted` as props; `entered` is checked via early return in `App`.

### `src/main.tsx` — React Root

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### `src/index.css` — Design System and Animations

Single stylesheet containing:

- TailwindCSS 4 base with custom `@theme` font variables
- All keyframe animations: strobe, checkerScroll, hueSpin, spinFast, spinRev, marqueeMove, blinkHard, rainbowText, shakeHard, glitchClip, zoomPulse
- Component-specific utilities: `.trail-bit`, `.popup-window`, `.storm-symbol`, `.giant-sigil`
- Global rules: `html, body, #root { height: 100%; overflow: hidden; background: #000; cursor: crosshair; user-select: none; }`

### `src/lib/noise.ts` — Audio Engine

- `initAudio()` — Creates AudioContext if absent, resumes if suspended, starts drone
- `toggleMute()` — Fades drone gain to 0 or 0.018 using `setTargetAtTime` for smooth amplitude curves
- `isMuted()` — Returns current mute state
- `blip()` — Generates a random oscillator type (square/sawtooth/triangle) with exponential glissando (80→2500Hz, 0.18s)
- `scream()` — Triggers 5 rapid `blip()` calls at 60ms intervals
- `startDrone()` — Internal: creates 4 oscillators (saw/triangle alternate) with LFO-modulated frequency modulation

### `src/components/ThreeChaos.tsx` — 3D WebGL Scene

Full Three.js scene graph with:

- **Camera**: PerspectiveCamera(85, aspect, 0.1, 200), auto-rotating around origin
- **Meshes**: 44 procedural meshes from mixed geometry types (TorusKnot, Icosahedron, Tetrahedron, Torus, Octahedron, Cone, Box)
  - Each mesh has userData: `rx, ry, rz` (rotation per frame), `orbitR, orbitSpeed, orbitPhase`, `yBase, bobSpeed`
  - 45% use `MeshNormalMaterial` wireframe; 55% use `MeshBasicMaterial` with HSL color
- **Center knot**: Large TorusKnot(3, 0.9) with MeshNormalMaterial wireframe, rotates at `t*1.3` / `t*0.9`
- **Sprites**: 3 texture types (eye, goat, sun) × 7 each, billboard sprites with scale modulation `1 + 0.4*sin(t*5 + phase)`
- **Particle field**: 900 points with random positions in [-35,35] and HSL colors; rotates with `t*0.3` / `sin(t*0.4)`
- **Resize**: Window resize listener updates camera aspect and renderer size
- **Cleanup**: `cancelAnimationFrame`, event listener removal, `renderer.dispose()`, geometry disposal

### `src/components/SymbolStorm.tsx` — Rune Storm

- Count: `30 + intensity × 12` (range 30–90)
- Each symbol has: char from predefined set, `x%`, `y%`, font size 18–88, rotation 0–360, color from palette, animation from 5 keyframe profiles
- Update interval: 350ms — teleports 1/3 of symbols, adjusts total count to target
- Animation profiles: `spinFast 1s linear infinite`, `spinRev 0.7s linear infinite`, `zoomPulse 0.5s ease-in-out infinite alternate`, `shakeHard 0.15s linear infinite`, `blinkHard 0.4s steps(1) infinite`
- All symbols are `position: fixed`, `pointer-events: none`, with `text-shadow: 0 0 12px color`

### `src/components/MarqueeLayer.tsx` — Scrolling Text Strips

- `STRIPS` constant: 11 text strips with properties: `text, top%, dur(s), rev (reverse), font, size, bg, color, blend`
- Each strip is a `marquee-strip` with `marquee-inner` child
- Animation: `marqueeMove linear infinite` from `translateX(0)` to `translateX(-50%)`
- Blend modes used: `normal`, `difference`, `exclusion`
- Fonts: UnifrakturMaguntia, Rubik Glitch, Eater, Metal Mania, Creepster, Nosifer

### `src/components/PopupHell.tsx` — Self-Replicating Popups

- Starts with 1 popup; interval: `max(1200, 3200 - intensity × 400)`ms (800ms–3200ms)
- `makePopup()` generates: random position (5–65% left, 8–63% top), random title/body from constants, random hue from `['#ff0055', '#00ff66', '#ffee00', '#ff00ff', '#00ffff', '#ff6600']`, random rotation `(Math.random()-0.5)*14`
- `MAX_POPUPS = 7` — array bounded; closing one popup spawns two more (hydra rule), then truncates to 7
- Each popup has close button, "ACCEPT FATE" buttons, and displays title + body text
- On close: `scream()` plays, popup removed, two new popups added if under MAX

### `src/components/CursorTrail.tsx` — Mouse Trail

- Trail bits: fading, rotating symbols following the mouse
- Spawn threshold: 40ms between bits
- 8 possible characters: `✦ 👁 ⛧ ✴ 🜏 🩸 ☽`
- 6 possible colors: `#ff0000`, `#00ff00`, `#ffff00`, `#ff00ff`, `#00ffff`, `#ffffff`
- Size: 14–40, random per bit
- Each bit fades out over 900ms with `trailFade` keyframe: scale from 0.5→3, rotation 360deg, opacity 1→0
- Max 24 visible bits at once; bits filtered out by ID after timeout

### `src/components/EscapeButton.tsx` — Fleeing Button

- Position: `%`-based, randomly repositioned on each interaction
- Labels cycle: `['CLICK TO ESCAPE', 'TOO SLOW', 'PATHETIC', 'NICE TRY', 'THERE IS NO ESCAPE', 'STOP TRYING', 'YOU LIVE HERE NOW']`
- On `mouseEnter` and `click`: plays `blip()`, increments `taunts`, repositions to random safe coordinates
- `flee()` ensures new position is not at the exact cursor location (offset by minimum %)
- Button styles: `border-4 border-double border-white bg-red-700 text-yellow-300 blinker`

### `src/components/EscapeButton.tsx` — Control Altar (within App)

Three buttons at bottom center:

- **☠ DO NOT CLICK**: Toggles `inverted` world state, plays `scream()`
- **⛧ MORE CHAOS [n/5]**: Increments intensity (wraps 1→5), plays `scream()`
- **🔊 NOISE ON / 🔇 SILENCE**: Toggles `muted`, plays `blip()`, updates label text

## State Architecture

Global state resides in `App.tsx` and flows downward as props:

| Prop Type | Source | Distributed To |
|---|---|---|
| `entered: boolean` | `useState(false)` | App render — early return if false |
| `inverted: boolean` | `useState(false)` | World div className (`inverted-world`) |
| `intensity: 1-5` | `useState(1)` | `SymbolStorm`, `PopupHell` |
| `muted: boolean` | `useState(false)` | `toggleMute()` in `noise.ts`, button labels |
| `counter: number` | `useState(666666)` | Visitor display, increments randomly + random blip |

No context API or external state manager — all state is co-located in App.

## Rendering Architecture

Three distinct rendering paths:

1. **Three.js WebGL** (`ThreeChaos`): Mounted on a `ref` div, full canvas size, runs its own `requestAnimationFrame` loop. Renders to `renderer.domElement` which is appended to the mount div. All meshes are `MeshBasicMaterial` or `MeshNormalMaterial` — no lighting calculations, just color/position/rotation.

2. **CSS Animated Layers** (`MarqueeLayer`, `SymbolStorm`, `PopupHell`, `EscapeButton`, `ControlAltar`): All use `position: fixed` with `left`/`top` percentages, `fontSize` in `vw/vmin` units, and CSS `animation` keyframes. No React rendering per-frame — all animation is driven by CSS or `setInterval`/`requestAnimationFrame` within the component.

3. **HTML/Text Elements** (`App.tsx` return): Central title `h1` with `rainbow-text glitch-clip` animation, visitor counter, and control altar buttons. These are standard DOM elements animated via CSS keyframes.

The compositor is the browser page: Three.js canvas sits at `z-index: 10` beneath CSS layers at `z-index: 20-70`. The control altar is at `z-index: 70` (highest).

## Audio Architecture

All audio is synthesized via the Web Audio API — no external audio files are loaded.

- **AudioContext** is initialized once via `initAudio()`, which creates a drone consisting of 4 oscillators (freqs: 55, 55.7, 82.4, 83.1 Hz) with sawtooth/triangle alternate waveforms. Each oscillator has an LFO (0.1–0.4 Hz) modulating its frequency.
- **Drone volume** is faded via `setTargetAtTime(gain, contextTime, 0.1)` for smooth amplitude curves.
- **`blip()`** generates a standalone oscillator with exponential frequency glissando (start: random 80–1200Hz → end: random 40–2500Hz, over 0.18s). Gain envelope: 0.055→0.0001 over 0.25s.
- **`scream()`** triggers 5 `blip()` calls at 60ms intervals.
- **`toggleMute()`** sets drone gain to 0 (muted) or 0.018 (unmuted) using `setTargetAtTime` for exponential fade.
- Audio context is suspended on page load (browser policy) and must be resumed by user gesture. The `WarningGate` button's `onEnter` calls `initAudio()` and `scream()` simultaneously.

## Data Architecture

- **No external data fetches** — all data is hardcoded or procedurally generated
- **Text constants**: `TITLES`, `BODIES`, `HUES` arrays in `PopupHell.tsx`; `STRIPS` constant in `MarqueeLayer.tsx`
- **Character sets**: `CHARS` and `TRAIL_CHARS` arrays in `SymbolStorm.tsx` and `CursorTrail.tsx`
- **Visitor counter**: `counter` state in `App.tsx`, starts at 666666, increments by `Math.floor(Math.random() * 66)` every 1.8s after entry
- **No persistence** — state is lost on page close; no localStorage or sessionStorage usage beyond the Arena recording meta

## Event Flow

1. **Page load**: `main.tsx` creates React root, renders `<App /><StrictMode>`
2. **App mount**: `WarningGate` shown; no audio, no chaos
3. **WarningGate → App**: User clicks "ENTER THE VOID" → `setEntered(true)` → `initAudio()` + `scream()` → main App tree mounts
4. **Mouse movement**: `mousemove` event → `CursorTrail` spawns a trail bit (throttled at 40ms)
5. **Control button click**: 
   - ☠ button → `setInverted(!inverted)` + `scream()`
   - ⛧ button → `setIntensity(i >= 5 ? 1 : i + 1)` + `scream()`
   - 🔊 button → `setMuted(toggleMute())` + `blip()`
6. **Interval-driven updates**:
   - `SymbolStorm`: every 350ms, teleport 1/3 of symbols + adjust count
   - `PopupHell`: every `max(1200, 3200 - intensity×400)`ms, add new popup + bounded to MAX_POPUPS
   - Visitor counter: every 1.8s, `setCounter(c => c + Math.floor(Math.random()*66))`
   - Audio LFO: continuous within `startDrone()`
7. **Window resize**: `resize` event → camera aspect update + renderer size update

## External Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.0 | UI tree |
| `react-dom` | ^19.2.0 | DOM injection |
| `three` | ^0.185.1 | 3D WebGL rendering |
| `framer-motion` | ^12.35.0 | (imported, not actively used in current build) |
| `lucide-react` | ^0.577.0 | (imported, not actively used) |
| `@tailwindcss/vite` | ^4.2.1 | TailwindCSS Vite plugin |
| `tailwindcss` | ^4.2.1 | Utility-first CSS |
| `@types/three` | ^0.185.4 | TypeScript three.js types |
| `@vitejs/plugin-react` | ^5.1.1 | React Fast Refresh |
| `eslint` | ^9.39.1 | Linting |
- No build step dependencies beyond Vite + TSC

## Browser APIs Used

- `AudioContext` — Web Audio API synthesis
- `requestAnimationFrame` — Three.js render loop, cursor trail fading
- `querySelector / addEventListener` — DOM selection and event routing
- `getComputedStyle` — implicitly via TailwindCSS responsive utilities
- `WheelEvent`, `KeyboardEvent` — (not currently used beyond mouse/mousemove)
- `sessionStorage` — Arena recording recording metadata (see `index.html`)

## Build Pipeline

1. **Type check**: `tsc -b` — checks `tsconfig.app.json` and `tsconfig.node.json`
2. **Vite build**: `vite build` — transforms 38 modules, outputs `dist/` with `index.html`, CSS, and JS
3. **Production output**: `dist/index.html` with hashed asset URLs, `dist/assets/index-*.css`, `dist/assets/index-*.js`
4. **GitHub Pages deployment**: GitHub Actions workflow (see `.github/workflows/deploy-pages.yml`) builds and commits to `gh-pages` branch

## Performance Model

- **GPU load**: Dominated by Three.js scene — 44 meshes + 900 particles + 21 sprites. Each frame runs ~150+ transform operations. Integrated GPUs may struggle at full screen 1440×900.
- **CPU load**: Mainly from `setInterval` callbacks (SymbolStorm every 350ms, PopupHell every 800-3200ms) and DOM animations (CSS keyframes). Audio synthesis is minimal.
- **Memory**: Three.js geometries and materials are disposed on unmount. No known leaks.
- **Recommendation**: Desktop/laptop with discrete GPU recommended for sustained use. Mobile performance variable.

## Major Design Decisions

1. **Warning gate first** — Ethical design choice to prevent photosensitive seizures; user must explicitly acknowledge before any content is shown
2. **All CSS keyframe animations** — Offloads animation from JS thread; enables complex timing (strobe sequences, marquee scrolls) without per-frame React re-renders
3. **Mixed rendering engines** — Three.js for the 3D vortex; CSS for everything else; clear separation of concerns
4. **Intensity-scoped systems** — `SymbolStorm` count and `PopupHell` spawn rate both scale from intensity 1→5, creating a graduated experience
5. **Audio begins after user gesture** — Browser autoplay policies prevent AudioContext creation on initial load; the WarningGate button's click handler both enters the app and resumes audio
6. **No configuration externalization** — All colors, fonts, texts, and animations are hardcoded in `index.css` and component constants; no `tailwind.config.js` or `.env` files
7. **Self-replicating popups** — The "hydra rule" (close one, spawn two) creates unbounded growth capped only by `MAX_POPUPS = 7`, producing a maximum-chaos state

## Technical Compromises

1. **`framer-motion` and `lucide-react` imported in `package.json` but not used** in the current component tree — kept for potential future use or were part of the template baseline
2. **`@types/node` v24** in devDependencies — potentially ahead of stable three.js typings; may cause minor type warnings
3. **Three.js antialias: false** in `ThreeChaos.tsx` — chosen to reduce GPU load at the cost of edge smoothness
4. **Pixel ratio capped at 1.5** — `Math.min(window.devicePixelRatio, 1.5)` prevents extreme DPI scaling on 4K+ displays
5. **No CSS config file** — all design tokens (fonts, colors, spacing) are in `index.css` `@theme` block; no `tailwind.config.js` exists
6. **Audio resume on specific user gesture** — The `Enter` button handles audio resumption; other interactions (mousemove, control clicks) do not re-resume if already running

## Limitations

- **Performance**: High mesh/particle count may cause frame drops on integrated GPUs or mobile devices
- **Audio**: Context suspension on load requires user interaction to resume; autoplay not possible
- **Popup proliferation**: Even with MAX_POPUPS = 7, the hydra rule means closing popups increases the total count toward the cap
- **No responsive breakpoints** — layout is fixed for desktop; min-width adjustments not implemented
- **No save/load** — all state (intensity, muted, inverted, counter) is lost on page close
- **Three.js scene disposal** — geometries are disposed on component unmount, but browser tabs kept open may accumulate memory
- **Font loading** — Custom Google fonts (UnifrakturMaguntia, etc.) require network access; fallback fonts are system serif

## Diagrams

```mermaid
flowchart TD
    A[Page Load] --> B[WarningGate Mounted]
    C[User Clicks "ENTER THE VOID"] -->|setEntered(true)| D[App Mounted]
    D --> E[ThreeChaos Initialized]
    D --> F[SymbolStorm Initialized]
    D --> G[MarqueeLayer Initialized]
    D --> H[PopupHell Initialized]
    D --> I[CursorTrail Initialized]
    D --> J[Control Altar Rendered]
    E --> K[requestAnimationFrame Loop]
    F --> L[setInterval 350ms]
    G --> M[setInterval marquee]
    H --> N[setInterval popup spawn]
    I --> O[mousemove Event]
    J --> P[Button Clicks]
    K --> Q[Mesh Rotation/Position Update]
    L --> R[Symbol Teleport/Count Adjust]
    M --> S[Marquee Position Reset]
    N --> T[Popup Add/Remove]
    O --> U[New CursorTrail Bit]
    P --> V[State Change: inverted/intensity/muted]
```

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant T as ThreeChaos
    participant S as SymbolStorm
    participant P as PopupHell
    participant C as CursorTrail
    participant N as AudioContext
    
    U->>A: Clicks "ENTER THE VOID"
    A->>N: initAudio() - resume context
    A->>T: Mount WebGL scene
    A->>S: Mount symbol storm
    A->>P: Mount popup system (1 popup)
    A->>C: Mount cursor trail (inactive)
    
    Note: User interaction ongoing...
    
    U->>M: Mousemove
    C->>C: Spawn trail bit
    
    U->>P: Click close popup
    P->>P: Hydra rule: spawn 2 new popups
    P->>N: blip() close feedback
    
    U->>J: Click ⛧ MORE CHAOS
    A->>A: setIntensity++ 
    A->>S: Update symbol count
    A->>P: Update spawn interval
    A->>N: scream()
    
    U->>J: Click 🔊 NOISE ON/OFF
    A->>N: toggleMute()
```

```mermaid
component.diagram
    title Component Hierarchy
    
    classDef react fill:#f9f,stroke:#333,stroke-width:2px;
    classDef three fill:#bbf,stroke:#333,stroke-width:2px;
    classDef css fill:#ff9,stroke:#333,stroke-width:2px;
    
    app[App.tsx] ::: react
    main[main.tsx] ::: react
    css[index.css] ::: css
    three[ThreeChaos.tsx] ::: three
    symbol[SymbolStorm.tsx] ::: react
    marquee[MarqueeLayer.tsx] ::: react
    popup[PopupHell.tsx] ::: react
    trail[CursorTrail.tsx] ::: react
    button[EscapeButton/Control] ::: react
    noise[lib/noise.ts] ::: three
    
    app --> main
    app --> three
    app --> symbol
    app --> marquee
    app --> popup
    app --> trail
    app --> button
    app --> noise
    noise --> css
```