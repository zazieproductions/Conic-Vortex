# Contributing to Conic-Vortex

Thanks for considering contributing. This is a creative-technology project that
sits at the intersection of art and engineering — code, documentation,
audio-visual experiments, and aesthetic ideas are all welcome. Above everything,
please honor the project's artistic integrity (see
[Creative methodology](docs/creative-methodology.md)).

## Ground rules

- **Preserve the eccentricities.** Do not smooth away the project's strange,
  hostile-interface character.
- **Keep the warning gate.** It is an ethical accessibility feature.
- **No "startup-ifying".** No pastel overhauls or generic portfolio branding.
- **One responsibility per module** and TypeScript strict, matching existing style.

## Workflow

1. **Fork** the repository and clone your fork.
2. **Create a branch** off `main`:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-description
   ```

3. **Set up** a reproducible install and the dev server:

   ```bash
   npm ci
   npm run dev
   ```

4. **Make your changes** and add comments that explain _why_, not just _what_.

5. **Verify** before pushing:

   ```bash
   npm run lint
   npm run typecheck
   npm run format:check
   npm run build
   # or, all at once:
   npm run validate
   ```

6. **Manually test** the piece (see [docs/testing.md](docs/testing.md)): gate,
   3-D layer, all three altar controls, popups, escape button, resize, perf.

7. **Commit** with a clear, descriptive message; keep the change small and
   logically separable so it can be reviewed or reverted on its own.

8. **Push and open a pull request** against `main`:

   ```bash
   git push origin your-feature-branch
   ```

   In the PR description, note what changed, why, and how it preserves the
   project's artistic integrity (plus any new dependencies).

## Documentation expectations

- Update the root [README.md](README.md) if your change affects setup,
  configuration, or usage.
- Update [docs/architecture.md](docs/architecture.md) if you add or reshape a
  subsystem.
- Add ideas / directions to [docs/roadmap.md](docs/roadmap.md) rather than
  pretending they are shipped.

## Reporting issues

- **Bugs & features:** use the [issue templates](.github/ISSUE_TEMPLATE/).
- **Security:** follow [SECURITY.md](SECURITY.md) (report privately; do not open a
  public issue).

## Need help?

Open an issue or check the docs:

- [docs/architecture.md](docs/architecture.md) — how it is built
- [docs/development.md](docs/development.md) — day-to-day workflow
- [docs/creative-methodology.md](docs/creative-methodology.md) — the artistic intent
