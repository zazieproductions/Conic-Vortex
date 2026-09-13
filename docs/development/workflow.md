# Development Workflow

This document covers the day-to-day workflow for working on
Y̷Y̶Y̸Y̵Y̷Y̶Y̸.

## Prerequisites

- **Node.js ≥ 20** (Vite 7 and the toolchain expect modern Node).
- npm is the canonical package manager (a `package-lock.json` is
  committed; `pnpm-lock.yaml` and yarn lockfiles are not).

## Quick start

```bash
npm install      # install dependencies
npm run dev      # start Vite dev server on http://localhost:5173
```

The dev server uses HMR, so edits to `src/` update instantly.

## Available scripts

| Script                    | Description                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`             | Start Vite dev server (host enabled, any origin allowed).                                |
| `npm run build`           | Type-check (`tsc -b`) then Vite production build into `dist/`.                           |
| `npm run preview`         | Serve the production build locally.                                                      |
| `npm run typecheck`       | Run `tsc -b --noEmit` without building.                                                  |
| `npm run lint`            | Run ESLint over the project.                                                             |
| `npm run lint:fix`        | Autofix lint violations where possible.                                                  |
| `npm run format`          | Run Prettier over all source/config/docs files.                                          |
| `npm run format:check`    | Check Prettier formatting without modifying files.                                       |
| `npm run validate`        | Typecheck + lint + format:check + build. Run this before opening a PR.                   |
| `npm run assets:generate` | Regenerate the three occult sigil PNGs and favicon (uses a dependency-free Node script). |
| `npm run screenshots`     | Puppeteer-driven screenshot capture to `docs/images/` (requires a dev server on :5173).  |

## Running the full validation suite

Before pushing or opening a PR:

```bash
npm run validate
```

This runs type-checking, ESLint, Prettier check, and a production build.
All four must pass for CI to be green.

## Regenerating sprite assets

The repository ships procedurally generated PNG sigils in
`public/sprites/` (eye, goat, sun) plus an SVG/PNG favicon. They are
created by `scripts/generate-assets.mjs` using only Node built-ins (zlib
for PNG encoding, no canvas/native deps). To regenerate (e.g. after
tweaking the shapes):

```bash
npm run assets:generate
```

The resulting PNGs are white-on-transparent so they tint naturally under
CSS `mix-blend-mode: difference` and the Three.js materials.

## Capture screenshots

Screenshots for the README/social previews can be captured with
Puppeteer:

```bash
# In one shell:
npm run dev
# In another:
npm run screenshots
```

This clicks through the warning gate and saves three stills into
`docs/images/`.

## Project layout

```
Conic-Vortex/
├── public/                 # Static assets served at site root
│   ├── favicon.svg
│   ├── favicon.png
│   └── sprites/            # Sigils (eye, goat, sun) used by ThreeChaos + DOM
├── src/
│   ├── App.tsx             # Top-level orchestrator + control altar
│   ├── main.tsx            # React root
│   ├── index.css           # Tailwind + all custom keyframe animations
│   ├── audio/
│   │   └── engine.ts       # Web Audio drone, blips, scream, mute
│   ├── components/         # All React components (one file per subsystem)
│   │   ├── CursorTrail.tsx
│   │   ├── EscapeButton.tsx
│   │   ├── MarqueeLayer.tsx
│   │   ├── PopupHell.tsx
│   │   ├── SymbolStorm.tsx
│   │   ├── ThreeChaos.tsx
│   │   └── WarningGate.tsx
│   ├── data/               # Static content constants (separated from render logic)
│   │   ├── marquees.ts
│   │   ├── popups.ts
│   │   └── symbols.ts
│   └── utils/
│       └── id.ts           # Collision-resistant ID generator
├── scripts/                # Node utilities (asset gen, screenshot capture)
├── docs/                   # Architecture, audio, development docs
├── .github/workflows/      # CI + GitHub Pages deploy
├── index.html
├── vite.config.ts
├── tsconfig*.json
├── eslint.config.js
└── .prettierrc.json
```

## Deployment

Deploys happen automatically via GitHub Actions
(`.github/workflows/deploy-pages.yml`) on every push to `main`. The
workflow:

1. Checks out the repo.
2. Installs dependencies with `npm ci`.
3. Builds with `npm run build` (Vite is configured with `base: './'` by
   default so the bundle works from any subpath; for the Pages path set
   `VITE_BASE=/Conic-Vortex/` as a repo secret or variable).
4. Publishes `dist/` to the `gh-pages` branch via
   `peaceiris/actions-gh-pages`.

## Coding conventions

- **TypeScript strict mode is on.** Avoid `any`; if genuinely necessary
  add an explanatory comment.
- **One subsystem per file.** The SixSeven components in `src/components/`
  should stay focused on their own DOM/state.
- **Content lives in `src/data/`.** Strings, palettes, and animation
  profiles are separated from rendering logic so copy adjustments don't
  touch JSX.
- **Side effects stay in `useEffect`.** Every interval/listener/loop must
  return a cleanup function.
- **WebGL resources must be disposed** in the effect cleanup.
- **No silent try/catches** around things that should error. The one
  intentional empty `catch` is for the optional Arena source-tags Vite
  plugin, which only exists in sandbox previews.
- **Preserve the weirdness.** Performance, accessibility, and clarity
  improvements are welcome; "fixing" the aesthetic — smoothing out the
  jarring contrast, removing the warning gate, muting the drone by
  default — is not.
