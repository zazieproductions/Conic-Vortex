# Contributing to Y̷Y̶Y̸Y̵Y̷Y̶Y̸

Thank you for considering contributing to this creative technology project! This repository is maintained by Zazie Productions and represents a unique blend of artistic vision and engineering.

## Contribution Workflow

### 1. Fork the Repository
Fork the project on GitHub and clone your fork locally.

```bash
git clone https://github.com/your-username/Conic-Vortex.git
cd Conic-Vortex
```

### 2. Create a Branch
Create a new branch for your feature or bug fix.

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-description
```

### 3. Set Up Development Environment

```bash
# Install dependencies
npm ci

# Run the development server
npm run dev

# Verify linting passes
npm run lint

# Verify type checking passes
npx tsc -b
```

### 4. Make Your Changes
- Follow the existing code style and conventions
- Add appropriate comments explaining the WHY of your changes
- Preserve the project's artistic aesthetic and conceptual integrity
- Do not genericize or "startup-ify" the project's distinctive qualities
- Keep the warning gate and accessibility considerations in mind

### 5. Test Your Changes
- Verify the project still launches and the warning gate works
- Check that all existing subsystems (3D chaos, symbol storm, popups, audio) function correctly
- Test intensity toggles, mute toggle, color invert
- Ensure the Escape button flees correctly
- Verify the control altar buttons work

### 6. Commit Your Changes
```bash
git add .
git commit -m "your descriptive commit message
```

### 7. Push and Open a Pull Request
```bash
git push origin feature/your-feature-name
```
Navigate to your fork on GitHub and open a Pull Request against the main `arena/01a06540-conic-vortex` branch.

## Development Guidelines

### Artistic Integrity
This project has a distinct aesthetic and conceptual vocabulary — damaged systems, cybernetic instruments, archival interfaces, signal decay, hostile information architecture. When adding features or refactoring:

- **Preserve the eccentricities** — do not smooth over the project's strange qualities
- **Serve the artistic concept** — every technical decision should support the creative vision
- **Avoid startup branding** — no pastel color schemes, no sterile "designer" aesthetics, no generic developer portfolio language
- **Keep the warnings** — the photosensitive warning gate must remain

### Technical Standards
- TypeScript type safety — no `any` types unless absolutely necessary
- ESLint — all new code must pass `npm run lint`
- Type check — `npx tsc -b` must pass without errors
- No build breakages — `npm run build` must produce clean output
- Keep dependencies updated but don't remove core aesthetic systems

### Branching Model
- All work happens on `arena/01a06540-conic-vortex` (this session's branch)
- Feature branches should be created from `arena/01a06540-conic-vortex`
- Pull requests merge into `arena/01a06540-conic-vortex`
- Commits should be signed and descriptive

### Submitting Changes
1. Ensure all tests pass (lint, typecheck, build)
2. Update README.md if your changes affect configuration or setup
3. Update ARCHITECTURE.md if you add new subsystems
4. Open a Pull Request with a clear description of:
   - What changed
   - Why it changed
   - How it preserves the project's artistic integrity
   - Any new dependencies added

### Questions or Discussion?
- Open an issue on the GitHub repository
- Contact the maintainers directly
- Check the [ARCHITECTURE.md](ARCHITECTURE.md) for system-level context