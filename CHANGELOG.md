# Changelog

All notable changes to Conic-Vortex are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased] — 0.3.0

A maintainability and documentation pass. No change to the on-screen experience's
creative character; the artwork renders as before.

### Added

- Asset-base support: build reads `VITE_BASE` so the site deploys correctly on a
  GitHub-Pages **project** sub-path; sprite/glyph assets are imported modules that
  respect it.
- Real glyph assets that were referenced but never shipped: transparent eye /
  goat / sun sprite SVGs (`src/assets/sprites/`), a favicon (`public/favicon.svg`),
  and a served social image (`public/og.png`).
- A coherent `/docs` system (architecture, rendering, audio engine, creative
  methodology, configuration, development, deployment, testing, roadmap) plus a
  docs index.
- Dedicated CI workflow (`.github/workflows/ci.yml`) running lint, typecheck,
  format-check, and build on Node 20 & 22.
- Prettier config + formatting; `format`/`format:check`/`validate` npm scripts.
- Optional dev-server host allowlist via `VITE_DEV_ALLOWED_HOSTS` for
  sandboxed/live-preview environments.

### Changed

- `src/` reorganized: audio engine moved from `lib/noise.ts` → `audio/engine.ts`
  with robust context handling; `WarningGate` and `ControlAltar` extracted out of
  the monolithic `App.tsx`; sprite set centralized under `assets/sprites/`.
- GitHub Pages workflow now deploys **only on pushes to `main`** (previously it
  also deployed on pull requests) and sets `VITE_BASE` correctly.
- `index.html` social/metadata cleaned up (proper title/description, absolute
  `og:image`/`twitter:image`).
- Screenshot tooling consolidated into one script
  (`scripts/capture-screenshots.mjs`); its `puppeteer` dependency is opt-in to
  avoid forcing a Chromium download on every install.
- Package identity fixed (`conic-vortex`, real description/keywords/engines);
  standardized on npm (removed `pnpm-lock.yaml`).

### Removed

- Unused dependencies `framer-motion`, `lucide-react`, `react-router-dom`.
- Dead code: empty unimported `src/App.css`; superseded
  `scripts/puppeteer-screenshot.mjs`.

### Fixed

- Sprites/favicon that 404'd at runtime now resolve.
- Wrong subsystem counts and stale structural claims in the docs corrected.

## [0.2.0] — 2026-09-03

- Full architecture, rendering, and audio documentation.
- GitHub Pages deployment workflow.
- Screenshot capture tooling (`scripts/capture-screenshots.mjs`).
- Intensity dial, mute toggle, invert toggle, and the fleeing escape button.
- Web-Audio drone with LFO modulation, blip and scream effects.
- Three.js scene (44 meshes, ~21 sprites, 900 particles), marquee layer, symbol
  storm, hydra popups, cursor trail.
- Photosensitive warning gate; strict TypeScript; ESLint React-Hooks rules.

## [0.1.0] — 2026-09-03

- Initial project scaffold (Vite + React + TypeScript).
- Original source modules (`App`, ThreeChaos, SymbolStorm, PopupHell,
  MarqueeLayer, CursorTrail, EscapeButton) and the CSS keyframe system.
