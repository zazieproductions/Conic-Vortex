# Deployment

Conic-Vortex is a fully static client-side app — it builds to a folder of plain
files that can be hosted anywhere static files are served.

## GitHub Pages

The repository is configured to deploy to GitHub Pages at
`https://zazie-productions.github.io/Conic-Vortex/` via
[`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml):

1. Triggered on pushes to `main` (and manual `workflow_dispatch`).
2. `npm ci` then `npm run build` with `VITE_BASE=/Conic-Vortex/`.
3. Publishes `dist/` to the `gh-pages` branch with
   [`peaceiris/actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages).

> Pull requests are validated by the separate CI workflow
> ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) and are **not**
> deployed. This was a deliberate split from an earlier workflow that deployed on
> every PR.

## The asset-base problem (read this)

A GitHub Pages **project** site is served from a sub-path (`/Conic-Vortex/`), not
the domain root. Two things must agree with that sub-path:

1. **Vite's `base`** — so the bundled JS/CSS `<script>`/`<link>` URLs point at
   `/Conic-Vortex/assets/…`. Set it with `VITE_BASE=/Conic-Vortex/`.
2. **Imported assets** — everything imported in code (the sprite SVGs) is
   rewritten by Vite to respect `base`. That is _why_ the sigils are imported
   modules rather than hardcoded `/sprites/…` strings.

For a **root** deployment (custom domain, `user.github.io/<you>`), simply leave
`VITE_BASE` unset (defaults to `/`).

## Deploying manually

```bash
npm ci
VITE_BASE=/Conic-Vortex/ npm run build   # or: npm run build  for a root deploy
npm run preview                          # sanity-check the dist/ locally
# then copy/serve dist/ to your static host
```

## Serving options

Because the output is static, it works on GitHub Pages, Netlify, Vercel, Cloudflare
Pages, `nginx`, S3, or a local `vite preview` / `python -m http.server`. There are
no server-side requirements, no API, and no build-time secrets.

## Metadata / social

- `public/og.png` is the social-share preview image (also kept in
  `docs/images/github-social-preview.svg` + `.png` as the source artwork).
- `index.html` sets `og:title`, `og:description`, `og:url`, and absolute
  `og:image`/`twitter:image` pointing at the deployed Pages URL, plus `theme-color`
  and an author meta tag.

## Environment

`VITE_DEV_ALLOWED_HOSTS` is only relevant to the dev server, not deploys. See
[`configuration.md`](configuration.md).
