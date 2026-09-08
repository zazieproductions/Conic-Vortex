# Rendering

Conic-Vortex composites several rendering strategies into one screen. This
document explains each one and the z-order contract between them. Related: the
system-level picture is in [`architecture.md`](architecture.md).

## The Three engines

### 1. Three.js WebGL scene — `src/components/ThreeChaos.tsx`

A single, self-contained scene mounted on a full-viewport `<canvas>`:

- **The zoo:** 44 meshes, each assigned a random geometry (torus knot,
  icosahedron, tetrahedron, torus, octahedron, cone, box) and a material
  (≈45 % `MeshNormalMaterial`, ≈55 % animated `MeshBasicMaterial`). Each mesh
  carries orbit / bob / spin kinematics on `mesh.userData`.
- **Center knot:** one large wireframe torus knot that pulses in scale.
- **Sprite billboards:** the eye / goat / sun SVGs, scattered 7×3 = 21 across a
  spherical shell, scaling with a per-sprite sine and counter-rotating.
- **Particle field:** 900 vertex-colored points rotating as a cloud.

The scene uses only unlit materials (`MeshBasic`/`MeshNormal`), so there is no
lighting computation — pure color and motion. It runs its own
`requestAnimationFrame` loop and disposes geometry/materials/renderer on unmount.
If WebGL construction throws, the component logs and yields the layer gracefully
rather than crashing the page.

Because Three.js is the single largest dependency, `ThreeChaos` is **lazy-loaded**
(React `lazy` + `Suspense`): it is split into its own on-demand chunk that only
loads after the warning gate is passed, keeping the initial bundle small
(~217 kB / ~69 kB gzip).

### 2. CSS keyframe layer — `src/index.css`

`index.css` is the animation workhorse. Everything below runs on the compositor:

- **Strobe background** (`strobe-bg`) — `steps(1)` color snapping through 8 hues.
- **Checker field** (`checker-bg`) — a scrolling `repeating-conic-gradient`.
- **Spiral vortex** (`spiral-bg`) — a full-screen conic gradient, spinning, blended
  with `difference`.
- **Flash + VHS overlays** — stepped full-screen white/red/green flashes and a
  rolling scanline gradient.
- **Text FX** — `rainbow-text`, `glitch-clip`, `shake-hard`, `blinker`, `zoom-pulse`.
- **Marquee** — `marquee-strip`/`marquee-inner` scroll with a 2-frame repeating
  trick for an endless loop.

Because these are CSS animations, they never invoke React or the main thread per
frame.

### 3. React glyph layers

`SymbolStorm`, `PopupHell`, and `MarqueeLayer` render DOM nodes whose motion is
mostly CSS-driven. React only re-renders them on their `setInterval` ticks, which
is why the storm can contain 30–90 glyphs without hurting the frame budget.

## Fonts & blend modes

The `@theme` block in `index.css` maps seven Google Web Fonts to semantic tokens:

| Token            | Font               | Character            |
| :--------------- | :----------------- | :------------------- |
| `--font-fraktur` | UnifrakturMaguntia | Blackletter display  |
| `--font-glitch`  | Rubik Glitch       | Disrupted/decomposed |
| `--font-drip`    | Nosifer            | Dripping horror      |
| `--font-eaten`   | Eater              | Eaten/distressed     |
| `--font-metal`   | Metal Mania        | Riveted industrial   |
| `--font-creep`   | Creepster          | Horror display       |

`mix-blend-mode` is used to make overlapping layers cancel or invert each other:
`difference` and `exclusion` for the sigils, spiral, and selected marquee strips;
`normal` elsewhere. This gives the "not-quite-layered" see-through-corruption look
that flat opacity can't produce.

## The sigil sprites

The eye / goat / sun glyphs ship as **transparent SVGs** in `src/assets/sprites/`
and are imported through Vite. Importing them (rather than stringing a `/sprites/…`
URL) means Vite emits a correct, content-hashed URL that respects the configured
`VITE_BASE` — so they work on the `/Conic-Vortex/` sub-path as well as at the root.
Transparency also matters: the same SVGs are used as full-screen `mix-blend`
sigils _and_ as 3-D billboard textures, where an opaque rectangle would look wrong.

## Z-order contract

| Layer | System                                |  z-index  |
| ----: | :------------------------------------ | :-------: |
|     0 | strobe + checker + spiral backgrounds |   base    |
|     1 | Three.js scene                        |  `z-10`   |
|     2 | symbol storm                          |  `z-20`   |
|   2.5 | giant sigils                          |  `z-20`   |
|     3 | marquee strips                        |  `z-30`   |
|   3.5 | center title + visitor counter        |  `z-30`   |
|     4 | popups                                |  `z-40`   |
|   4.5 | escape button                         |  `z-50`   |
|     5 | flash + scanline overlays             | `z-60/61` |
|     6 | cursor trail                          |  `z-90`   |
|     7 | control altar                         | `z-[70]`  |
|     – | warning gate (pre-entry)              | `z-[100]` |

`pointer-events` is disabled on decorative full-screen layers so clicks reach the
interactive elements beneath.
