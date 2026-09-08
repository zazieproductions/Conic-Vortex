# Testing & Troubleshooting

## Verification strategy

Conic-Vortex is a DOM/WebGL/Web-Audio art piece — its primary "test" is a manual
visual + auditory pass. Automated safety nets cover everything that can be
checked without a browser:

| Check               | Command                | Runs in CI |
| :------------------ | :--------------------- | :--------: |
| TypeScript strict   | `npm run typecheck`    |     ✅     |
| ESLint              | `npm run lint`         |     ✅     |
| Prettier formatting | `npm run format:check` |     ✅     |
| Production build    | `npm run build`        |     ✅     |

CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) runs all four on
Node 20 and 22 for every PR and push to `main`. `npm run validate` runs the same
set locally in one shot.

## Manual test checklist

After any change, step through:

1. **Gate** — the warning gate shows; **ENTER THE VOID** mounts the experience and
   sound begins (this is the audio gesture).
2. **3-D layer** — the knot, orbiting meshes, sprites, and particle field are
   visible and moving.
3. **Controls** — ☠ toggles inversion; ⛧ escalates intensity 1→5 and wraps;
   🔊/🔇 fades audio smoothly.
4. **Popups** — new popups arrive; closing one spawns up to two more (hydra),
   bounded at `MAX_POPUPS`.
5. **Escape button** — it flees on hover/click and changes its taunts.
6. **Resize** — window resize keeps the camera/renderer correct.
7. **Perf** — at intensity 5 on a modest laptop the piece should stay roughly
   fluid; on an integrated GPU expect some stutter by design.
8. **Unmount** — the interval timers and WebGL resources clean up (no console
   leaks when hot-reloading).

## Troubleshooting

**No 3-D layer.** WebGL unavailable/blocked. The layer logs a warning and the rest
of the experience still runs. Check the browser's hardware-acceleration / WebGL
setting, or try another browser.

**No sound.** Audio needs a user gesture: click **ENTER THE VOID**. If you muted,
toggle 🔊 back on. Some browsers also suspend audio in background tabs — bring the
tab to the foreground.

**Everything freezes / low FPS.** Reduce intensity to 1–3; the scene targets
desktop-class GPUs. On low-end devices disable hardware acceleration is not the
fix — the scene simply is heavy at intensity 5.

**Blurry / wrong text on GitHub Pages but fine locally.** Fonts are Google Web
Fonts loaded at runtime; check network access. If the _page_ is unstyled or sprites
404, it's the asset-base problem — see [`deployment.md`](deployment.md).

**Dev server refuses a host.** Vite 7 validates the `Host` header. For a
sandboxed/live-preview host start it with
`VITE_DEV_ALLOWED_HOSTS=.host.example npm run dev`.

**HMR doesn't pick up CSS.** Confirm the file is under `src/` and imported by
`src/main.tsx` (`index.css`).

## Adding automated tests later

The app currently has no unit tests. The seams where tests would add the most
value:

- **`src/audio/engine.ts`** — pure-ish logic (mute ramp targets, blip scheduling)
  is testable with a mocked `AudioContext`.
- **Pure helpers** — the glyph/color constants and count formulas
  (`30 + intensity × 12`, popup cadence) could be extracted and unit-tested with
  Vitest.

If you add a test runner, wire it into `ci.yml` after `build`. Use a DOM
environment for component tests and keep any test that runs the Three.js scene
behind a `--headless` flag.
