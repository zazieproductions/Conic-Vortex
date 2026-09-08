# Configuration

Conic-Vortex runs with **no configuration** out of the box. This document covers
the handful of optional build-time knobs, the Vite config, and the two tooling
configurations (ESLint, Prettier).

## Environment variables

None are required. Copy `.env.example` → `.env` only if you need to override a
deploy value. Vite exposes anything prefixed `VITE_` (and, for compat,
`NEXT_PUBLIC_`) to `import.meta.env` and — via `vite.config.ts` — to
`process.env.*`.

| Variable                 | Type | Default               | Used by                                                                                                       |
| :----------------------- | :--- | :-------------------- | :------------------------------------------------------------------------------------------------------------ |
| `VITE_BASE`              | path | `/`                   | `vite.config.ts` → `build.base`; the served base path (e.g. `/Conic-Vortex/` for a GitHub-Pages project site) |
| `VITE_DEV_ALLOWED_HOSTS` | CSV  | _(none → local only)_ | `vite.config.ts` → `server.allowedHosts`; lets sandboxed/live-preview hosts into the dev server               |

`.env`, `.env.local`, and `.env.*.local` are gitignored.

## `vite.config.ts`

```text
react()  +  @tailwindcss/vite()  [+ optional .vite-source-tags plugin]
base     = process.env.VITE_BASE || env.VITE_BASE || '/'
envPrefix = ['VITE_', 'NEXT_PUBLIC_']
define   = process.env.* populated from the loaded env
server   = { host: true, allowedHosts: VITE_DEV_ALLOWED_HOSTS? }
```

Highlights:

- **Source-tagging plugin** (`.vite-source-tags.js`) is loaded _if present_ and its
  absence is tolerated (wrapped in `try/catch`). It only exists to stamp
  `data-source-loc` attributes for external source-aware tooling; the app never
  depends on it. See [`development.md`](development.md).
- **Env centralization:** all `VITE_*` / `NEXT_PUBLIC_*` values are loaded once and
  re-exposed as `process.env.*` defines, so library/tooling code that reads
  `process.env` sees the same values without per-file `import.meta.env` handling.

## ESLint

Flat config in `eslint.config.js`:

- `@eslint/js` recommended, `typescript-eslint` recommended,
  `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` (Vite).
- Browser globals; `dist/` ignored.
- Run with `npm run lint` / `npm run lint:fix`.

## Prettier

`.prettierrc.json` sets: single quotes, semicolons, trailing commas (`all`),
88-column width. `.prettierignore` excludes `dist/`, lockfiles, static assets,
and `index.html` (whose inline runtime-harness scripts must remain byte-stable).
Run with `npm run format` / `npm run format:check`.

## Package scripts

See the root [`README.md`](../README.md#development) for the canonical script
table; `npm run validate` runs lint + typecheck + build in one command.
