# Creative Methodology

This document is about the _why_, not the _how_. The engineering side is covered
in [`architecture.md`](architecture.md); this one explains the artistic intent and
the conventions you should respect when extending the piece.

## The central idea: hostile information architecture

Conic-Vortex (a.k.a. "Y̷Y̶Y̸Y̵Y̷Y̶Y̸" / _the machine god is awake_) is a study in
**hostile information architecture** — interfaces that _resist_ their user rather
than facilitate them. Where a product optimizes for clarity and completion, this
piece optimizes for disorientation, escalation, and the feeling of being _watched
and trapped by a system_.

The recurring motifs map to concrete systems:

| Motif                                                                   | Where it lives                                     |
| :---------------------------------------------------------------------- | :------------------------------------------------- |
| **The Y as erasure** — a glyph struck through, impossible to hold still | The glitching center title; the corrupted marquees |
| **The machine that counts you**                                         | The "VISITOR #" counter that ticks up unbidden     |
| **The eye / goat / sun** — symbols of watching, judgement, ritual       | The 3-D billboards and giant `mix-blend` sigils    |
| **The interface that lies about exit**                                  | The Escape button that flees and taunts            |
| **Recursion as doom**                                                   | The "hydra" popups: close one, two more arrive     |
| **Signal decay**                                                        | VHS scanlines, flash cuts, hue/glitch corruption   |

## Visual language

- **Black + neon primaries** (`#ff0000`, `#00ff00`, `#ffff00`, `#ff00ff`,
  `#00ffff`, …) read as "terminal/archival" rather than "design-system".
- **Corruption over composition.** Chromatic aberration, stepped `steps(1)`
  animation, `mix-blend-mode: difference`/`exclusion`, and `hue-rotate` make
  layers eat each other — the collage should never feel _clean_.
- **Typography as material.** Each Google Web Font is a _character_ — dripping,
  decomposing, glitching — and text is set in marquee bands like readouts.
- **It is an instrument, not a page.** It is full-screen, scroll-less,
  pointer-driven, and makes a sound.

## Rules for contributors

These are the equivalent of a style guide for a _different_ reason than code style:

1. **Preserve the gate.** The photosensitive warning is an ethical feature, not a
   liability. Never remove or soften it into an afterthought.
2. **Do not "startup-ify" it.** No pastel palettes, no rounded "designer" buttons,
   no generic developer-portfolio framing, no smoothing the strangeness away.
3. **Chaos should be _engineered_, not accidental.** When you add a system, prefer
   bounded procedural behavior (as with the intensity dial) over pure noise.
4. **Sound should stay synthesized.** The zero-audio-file property is part of the
   concept: it is a closed, self-contained machine. Reach for Web Audio nodes
   before shipping a sample.
5. **Keep it legible as code.** The other half of the concept is that a _horror
   object_ can still be a clean, typed, documented codebase. Follow
   [`development.md`](development.md).

## What is deliberately "unpolished"

A few qualities are intentional and should not be "fixed":

- The **visitor counter** resets and uses a fake but eerie starting value.
- Nothing **persists** — the experience does not remember you.
- The **escape button always wins**.
- Intensity 5 is _overwhelming by design_.

## For readers / collaborators

- **Artists & designers:** read [`rendering.md`](rendering.md) for how the look is
  achieved.
- **Audio folks:** read [`audio-engine.md`](audio-engine.md).
- **Engineers:** start at [`architecture.md`](architecture.md).
