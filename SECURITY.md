# Security

## Scope

Conic-Vortex is a **fully static, client-side** application. There is no server,
no backend API, no authentication, no database, and no user accounts. All code
executes in the visitor's browser from files that are built and served statically.

## What the code does and does not do

- **Web Audio API** synthesizes all audio procedurally — no audio files, no
  third-party audio sources.
- **Three.js** renders only procedural geometry and the bundled sprite SVGs — no
  external models or textures fetched at runtime.
- **No WebSockets, no long-polling, no third-party trackers.**
- **No persistence** — the experience does not store user data in
  `localStorage`/`sessionStorage`, and closing the tab resets all state.

## Reporting a vulnerability

If you believe you have found a security issue in this project, please **do not**
open a public GitHub issue.

1. Report privately to the repository owner (maintained by Zazie Productions).
2. Describe the issue, the impact, and — where possible — a minimal reproduction.
3. Allow a reasonable period for a fix before disclosure.

This project has no known security vulnerabilities at this time. Because it ships
only static content, the practical attack surface is limited to browser-side
behavior and any third-party assets it loads (e.g. Google Fonts).

## Safe usage

- The experience contains **strobes and rapid visual changes** and shows a
  mandatory photosensitive warning gate before running. Users with photosensitive
  epilepsy should heed it and can leave at the gate.
- The page does not access the microphone, camera, or sensors by default, and no
  such capability is requested.
