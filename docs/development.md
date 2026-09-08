# Development

Setup, day-to-day workflow, and conventions for working on Conic-Vortex.

## Prerequisites

- **Node.js ≥ 20.19** (LTS 22 recommended) and **npm ≥ 10**.
- This is an npm project — the lockfile is `package-lock.json`. Prefer `npm ci`
  for reproducible installs.

## First run

```bash
npm ci          # reproducible install
npm run dev     # Vite dev server → open the printed local URL
```

`npm run dev` supports hot reload: edit a component and the page updates in place.
The Three.js scene and CSS animations respond to saves without a reload.

## Commands

| Command                           | Description                                                |
| :-------------------------------- | :--------------------------------------------------------- |
| `npm run dev`                     | Dev server with HMR                                        |
| `npm run typecheck`               | `tsc -b` (both the app and node configs)                   |
| `npm run lint` / `lint:fix`       | ESLint                                                     |
| `npm run format` / `format:check` | Prettier write / check                                     |
| `npm run build`                   | type-check + production build to `dist/`                   |
| `npm run preview`                 | Serve the production build locally                         |
| `npm run validate`                | `lint` + `typecheck` + `build`                             |
| `npm run clean`                   | Remove `dist/`                                             |
| `npm run capture:screenshots`     | Headless screenshots (needs one-time `npm i -D puppeteer`) |

## Folder conventions

- **`src/components/`** — one file per visible system. Components are focused and
  largely self-contained; shared orchestration lives in `App.tsx`.
- **`src/audio/`** — the audio engine is the only global side-effecting module.
- **`src/assets/`** — imported media (the sprite SVGs). Import assets rather than
  referencing `/…` URL strings so Vite rewrites them for the configured base.
- **`public/`** — truly static files served at the root (`favicon.svg`, `og.png`).
- **`scripts/`** — one-off node tooling.
- **`docs/`** — architecture & creative documentation.

## Code conventions

- **TypeScript strict.** No `any` unless truly necessary (the audio engine's
  Web-Audio fallback and the optional plugin are the sanctioned exceptions, and
  both are scoped tightly).
- **Formatting is Prettier** — run `npm run format` before committing.
- **One responsibility per module** — if a component grows a second unrelated
  concern, extract it (the original monolithic `App.tsx` was split into
  `WarningGate` + `ControlAltar` + the orchestration for exactly this reason).
- **Comments explain _why_, not _what_.** Prefer clear naming over narration.
- **Do not touch the runtime-harness scripts** in `index.html` — they are build/
  preview tooling that must stay byte-stable.

## Working with the visual layers

When adding or changing a visual system:

1. Respect the [z-order contract](../docs/rendering.md#z-order-contract).
2. Prefer CSS keyframe animation for anything that moves every frame.
3. Give any new interactive control the same treatment as the Control Altar:
   real `aria-label` / `aria-pressed` plus on-theme copy.
4. Re-check both `npm run lint` and `npm run typecheck`.

## The optional source-tagging plugin

`vite.config.ts` tries to load `.vite-source-tags.js` and proceeds if it is absent.
That plugin stamps `data-source-loc="file:line:col"` onto compiled JSX for
external source-aware tooling (hover-to-reveal, WYSIWYG editing). It is
**not part of the application** — you can delete the file and the app builds and
runs identically. Keep it byte-stable if present.

## Debugging checklist

- **No 3-D layer?** WebGL blocked → check browser GPU settings; the layer
  degrades gracefully with a console warning.
- **No sound?** Needs a user gesture — click **ENTER THE VOID**. If muted, unmute.
- **Blank black screen?** Confirm `#root` mounts and the gate is reachable; check
  the browser console for a React render error.
- **TypeScript complains about a new import path?** After moving files, re-run
  `npm run typecheck` and update `tsconfig*.json` includes if a new top-level
  directory was introduced.
- **Prettier/CI failing on an image/SVG?** They're in `.prettierignore`; don't
  fight it.

For more troubleshooting, see [`testing.md`](testing.md).
