# Contributing to Y̷Y̶Y̸Y̵Y̷Y̶Y̸

Thank you for considering contributing to this creative-technology project!
Y̷Y̶Y̸Y̵Y̷Y̶Y̸ is maintained by [Zazie Productions](https://github.com/zazieproductions)
and is a deliberate hybrid of artistic vision and engineering.

## The golden rule

> **Preserve the weirdness.**
>
> We welcome refactors, performance work, accessibility improvements,
> documentation, new subsystems, and creative extensions. We will not
> merge changes that pastel-wash the aesthetic, remove the warning gate,
> silence the audio by default, or turn the piece into a generic SaaS
> landing page.

## Workflow

1. **Fork** the repository on GitHub and clone your fork.

   ```bash
   git clone https://github.com/your-username/Conic-Vortex.git
   cd Conic-Vortex
   ```

2. **Create a branch** off `main`.

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-description
   ```

3. **Set up** your environment:

   ```bash
   npm install
   npm run dev          # confirm it boots
   npm run validate     # must pass on a clean checkout
   ```

4. **Make your changes**, following the
   [coding conventions](docs/development/workflow.md#coding-conventions):
   - TypeScript strict mode; no `any` without an explanatory comment.
   - One subsystem per file; content constants live in `src/data/`.
   - Every `useEffect` that allocates (intervals, RAF, event listeners,
     WebGL resources) returns a cleanup.
   - Don't genericise the aesthetic. The strobes, the jarring palette,
     the blackletter/glitch fonts, the "hostile" UX — all intentional.

5. **Manual QA checklist:**
   - [ ] The warning gate is shown first and is reachable by keyboard.
   - [ ] Clicking **ENTER THE VOID** starts the drone and scream.
   - [ ] All three control-altar buttons work (invert, more chaos, mute).
   - [ ] Closing a popup summons two more (hydra rule).
   - [ ] The escape button still flees on hover.
   - [ ] Cursor trail follows the mouse.
   - [ ] Resizing the window doesn't break the Three.js scene.
   - [ ] `npm run validate` passes.

6. **Document** any new subsystem under `docs/` — see
   `docs/architecture/`, `docs/audio/`.

7. **Commit** with a clear message. Prefer conventional-commit style but
   clarity beats ritual.

   ```bash
   git add .
   git commit -m "feat(popup): add red-pulse on spawn"
   ```

8. **Push** and open a pull request against `main`. In the PR
   description, cover:
   - What changed and why.
   - How it preserves (or extends) the project's artistic intent.
   - Any new dependencies added and why they are justified.
   - Screenshots / clips for visual changes if practical.

## Opening issues

- **Bug reports:** use the bug-report template and include browser/OS,
  GPU if relevant, and reproduction steps.
- **Feature ideas:** open an issue with the `enhancement` label —
  explain the creative motivation, not just "add X".
- **Security:** see [SECURITY.md](SECURITY.md) for responsible disclosure.

## Development quick reference

```bash
npm run dev             # Vite + HMR
npm run validate        # typecheck + lint + format:check + build
npm run format          # auto-format with Prettier
npm run assets:generate # regenerate the public/sprites/*.png sigils
npm run screenshots     # Puppeteer stills (needs a running dev server)
```

The full development guide is in
[docs/development/workflow.md](docs/development/workflow.md).
