# Security

## Scope

Y̷Y̶Y̸Y̵Y̷Y̶Y̸ runs **entirely client-side** in the browser. It performs no
build-time or runtime network requests of its own (Google Fonts is the
only third-party origin hit by the page at the time of writing; this is
scheduled to move to self-hosted assets — see
[ROADMAP.md](ROADMAP.md)). There is no authentication, no user data
storage, no cookies, no server-side code in this repository.

## Supported versions

The project is developed on the `main` branch; we do not backport
security fixes to older tags. If you are deploying a fork, track
`main` (or the latest release tag once releases are cut).

## Reporting a vulnerability

If you discover a security issue, please:

1. **Do not** open a public GitHub issue.
2. Email the maintainers via the address on
   [Zazie Productions' GitHub profile](https://github.com/zazieproductions),
   or open a GitHub Security Advisory on this repository.
3. Include reproduction steps, affected version (commit SHA or tag),
   and your assessment of impact.

We will acknowledge reports within a week and coordinate a fix and
disclosure timeline with you.

## Threat model notes

- **Audio / visual content safety** is handled by the warning gate. The
  project deliberately produces strobe effects and loud noise; users
  must explicitly opt in before any content is rendered. This is an
  accessibility/safety concern, not a security one, and we treat it as
  a core feature requirement.
- **Third-party assets** at present are the six Google Web Fonts
  imported in `src/index.css`. They are referenced by CSS `@import` and
  served from `fonts.googleapis.com` / `fonts.gstatic.com`. Planned
  self-hosting will eliminate those requests.
- **No analytics, no tracking, no telemetry** shipped by this codebase.
  (The Arena preview environment that the maintainers use for
  development injects recording scripts; those are not present in the
  canonical `index.html` on `main`.)
- **WebGL** is a complex native-code surface; we use a recent pinned
  version of `three.js` and avoid custom shader code at this time, so
  exposure is limited to three.js itself.
- **No user input** is parsed, serialised or sent anywhere — no XSS
  risk surface beyond what React already mitigates by default.
