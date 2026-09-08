# Conic-Vortex — Documentation

Documentation for the codebase, the creative system, and the engineering
decisions behind it. The root [`README.md`](../README.md) is the orientation
document; this folder is where the deep material lives.

## Index

| Document                                             | Covers                                                                                                                 |
| :--------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [`architecture.md`](architecture.md)                 | System architecture: components, state flow, event flow, render & audio pipelines, performance model, design decisions |
| [`rendering.md`](rendering.md)                       | The three rendering engines: the Three.js scene, the CSS keyframe layer system, blend modes & the sigil sprites        |
| [`audio-engine.md`](audio-engine.md)                 | The Web Audio synthesis engine: drone, blip, scream, mute envelopes, browser autoplay constraints                      |
| [`creative-methodology.md`](creative-methodology.md) | Artistic intent, the hostile-interface canon, and how the concept maps onto the systems                                |
| [`configuration.md`](configuration.md)               | Environment variables, the Vite config, source-tagging plugin, and build knobs                                         |
| [`development.md`](development.md)                   | Setup, developer workflows, conventions, and a debugging checklist                                                     |
| [`deployment.md`](deployment.md)                     | GitHub Pages deployment, the `VITE_BASE` asset-base problem, manual deploys                                            |
| [`testing.md`](testing.md)                           | Verification strategy, CI, manual test checklist, troubleshooting                                                      |
| [`roadmap.md`](roadmap.md)                           | Implemented vs. experimental vs. research directions                                                                   |

## Reading order

1. **Engineers & new contributors:** [`architecture.md`](architecture.md) →
   [`development.md`](development.md) → [`testing.md`](testing.md).
2. **Creative technologists / artists:** [`creative-methodology.md`](creative-methodology.md)
   → [`rendering.md`](rendering.md) → [`audio-engine.md`](audio-engine.md).
3. **Ops / deploy:** [`configuration.md`](configuration.md) →
   [`deployment.md`](deployment.md).
