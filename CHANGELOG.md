# Changelog

All notable changes to Y̷Y̶Y̸Y̵Y̷Y̶Y̸ will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] — 2026-09-03

### Added
- Full architecture documentation (ARCHITECTURE.md)
- Design system documentation with typography, color palette, and animation specs
- Creative technology documentation explaining procedural systems and aesthetic intent
- Screenshot capture script (`scripts/capture-screenshots.mjs`)
- npm capture:screenshots script
- Puppeteer-based screenshot automation
- GitHub Actions deployment workflow (`.github/workflows/deploy-pages.yml`)
- GitHub Pages deployment at https://zazie-productions.github.io/Conic-Vortex/
- Live project badge and launch link in README
- Warning gate with photosensitive epilepsy warning
- Visitor counter (starts at 666666)
- Intensity control (1-5 scale affecting SymbolStorm and PopupHell)
- Mute toggle with persistent state
- Color invert toggle
- Escape button with fleeing behavior
- Control altar with three bottom-center buttons
- Hover-flee on EscapeButton
- 666666 visitor counter aesthetic
- HSL-based color cycling for drone oscillators
- LFO-modulated drone frequency modulation
- Exponential gain fade for mute/unmute
- Blip and scream audio functions
- Three.js scene with 44 meshes, 900 particles, 21 sprites
- Marquee layer with 11 text strips and blend-mode effects
- Symbol storm with 30-90 runic characters
- Popup hell with hydra rule (close one, spawn two)
- Cursor trail with fading symbols
- Glitch and rainbow text animations
- 6 custom font families via Google Web Fonts
- CSS keyframe animations: strobe, checkerScroll, hueSpin, spinFast, spinRev, marqueeMove, blinkHard, rainbowText, shakeHard, glitchClip, zoomPulse
- vhs-lines overlay animation
- Warning gate with blinker and fractur typography
- Data URI favicon support
- Arena RRWeb recording integration
- TypeScript strict mode configuration
- ESLint React Hooks plugin
- Vite 7 with React plugin and TailwindCSS 4

### Changed
- README completely rewritten from scratch
- Repository reorganized into professional structure
- docs/ directory created with architecture, design, technical, and development subdirectories
- package.json scripts updated with capture:screenshots
- All CSS moved from scattered inline styles to consolidated index.css
- TypeScript configuration updated for project-wide type checking

### Deprecated
- None

### Removed
- None

### Fixed
- None

---

## [0.1.0] — 2026-09-03

### Added
- Initial commit — project repository established
- Original source code base (Vite + React + TypeScript + Three.js template)
- Package.json with dev dependencies
- ESLint and TypeScript configuration
- Index.html with Arena RRWeb recording metadata
- All original source components (App.tsx, ThreeChaos, MarqueeLayer, SymbolStorm, PopupHell, CursorTrail, EscapeButton)
- Original index.css with base styles and animations
- GitHub repository structure

### Changed
- None

### Deprecated
- None

### Removed
- None

### Fixed
- None