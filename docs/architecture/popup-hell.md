# Popup Hell Dynamics

The popup subsystem is one of the project's defining "hostile UI"
behaviours. It looks like a joke at first (early-2000s "YOU ARE THE
1,000,000TH VISITOR" popups) but exhibits dynamics that push back
against the user.

## Spawn rules

- An interval fires every `max(1200, 3200 − intensity·400)` ms.
- At intensity 1: one new popup every 2800 ms.
- At intensity 5: one new popup every 1200 ms.
- A newly spawned popup is placed at a random 5–65% / 8–63% position with
  a random title, body, hue from curated palettes, and a random rotation
  of ±7°.

## Hydra rule

Clicking any button on a popup (the X, **ACCEPT FATE**, or **ALSO ACCEPT
FATE**) triggers:

1. `scream()` audio burst.
2. The clicked popup is removed.
3. Two new popups are spawned.
4. The array is truncated to `MAX_POPUPS = 7` (oldest first).

This means trying to dismiss popups is counter-productive until the cap
is reached, whereupon closing one always replaces it with two that
share the fixed budget (so the screen is always full near max
intensity).

## UX intent

The interaction model teaches — without explanation — that fighting the
interface is futile. Users learn within a few seconds to simply ignore
the popups and use the control altar at the bottom, which is the only
UI that does what it says. This mirrors the project's broader theme of
"hostile information architecture": interfaces that impede rather than
facilitate user goals.

## Tuning parameters

| Constant       | Value            | Effect                                                      |
| -------------- | ---------------- | ----------------------------------------------------------- |
| `MAX_POPUPS`   | 7                | Hard cap to prevent DOM/cognitive overload                  |
| Spawn interval | 1200–2800 ms     | Tied to global chaos intensity                              |
| Position range | 5–65% X, 8–63% Y | Keeps popups inside the viewport but away from bottom altar |
| Rotation       | ±7°              | Slight unease without making text unreadable                |
