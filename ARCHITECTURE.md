# Architecture

The detailed architecture documentation now lives in the `docs/` tree:

- [Architecture overview](docs/architecture/overview.md) — layer composition, state flow, rendering pipelines.
- [Three.js vortex](docs/architecture/three-chaos.md) — scene layout, camera path, materials, performance choices.
- [Popup hell dynamics](docs/architecture/popup-hell.md) — spawn rules, the hydra rule, UX intent.
- [Audio engine](docs/audio/engine.md) — drone, blips, scream, lifecycle, muting.
- [Development workflow](docs/development/workflow.md) — scripts, layout, conventions, deployment.

Top-level entry point is `src/App.tsx`; the audio engine is
`src/audio/engine.ts`; each visual layer is one component in
`src/components/`.
