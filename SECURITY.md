# Security

## Supported Versions

Currently this project does not have formal security maintenance or vulnerability reporting.
All code runs client-side in the browser. No data is transmitted to external servers
except:

- Arena recording metadata (RRWeb) — stored in sessionStorage, exfiltrated on demand
- GitHub Pages deployment — static asset deployment only

## Reporting Security Issues

If you discover a security concern in this project, please:

1. **Do not** open a public GitHub Issue
2. Contact the maintainers directly through the repository owner
3. Describe the issue and potential impact

The project has no known security vulnerabilities at this time, as all code executes
client-side with no external API calls, no authentication, and no user data persistence.

## Client-Side Considerations

- The Web Audio API generates procedural audio — no external audio files, no
  external audio sources, no embedding of third-party sound libraries
- Three.js renders exclusively from procedural geometries and colors — no external
  3D models, no external textures beyond 3 sprite assets (eye, goat, sun)
- No WebSocket connections, no Server-Sent Events, no long-polling
- No login, no authentication, no user accounts
- No third-party scripts or trackers (beyond the Arena recording infrastructure)

## Safe Usage

- This project contains strobe effects and rapid visual changes
- A warning gate is presented on first entry — users can opt out before viewing
- Users with photosensitive epilepsy should heed the warning
- The project does not access microphones, cameras, or sensors by default