# Chronocrypt: Causal War v1.3

A standalone portrait Android card battler built around three simultaneous eras and retrocausal bootstrap loops.

## v1.3 systems

- Past Foundations, discounted Present intervention, and maturing Future Forecasts.
- Four deck-defining doctrines and four once-per-match Chronarch leader abilities.
- 72-card foundational set with Units, Tactics, hidden Contingencies, persistent Anchors, and concrete Cause cards.
- Explicit numbered slot placement; no automatic left-slot deployment.
- Unit commands: Advance, Anchor, Shift, and Intervene.
- Confirmable combat forecasts, retaliation, Guard, damage numbers, erasure animations, and event announcements.
- Unknown Origin events name the exact card that must later become their cause.
- Paradox Forks, Entropy recycling, opening-hand mulligan, 24-card deck construction, and a 24-pick Temporal Draft mode.
- AI duel, local pass-and-play, card inspector, full card library, rules codex, and twelve-part tutorial.

## Build

```bash
gradle --no-daemon assembleDebug
```

The application has no third-party runtime dependencies. It uses a local WebView shell around deterministic HTML/CSS/JavaScript gameplay and stores custom decks on-device.

## Scope

This build includes AI and same-device local multiplayer. Internet matchmaking is not included because it requires an authoritative hosted service, accounts, reconnection handling, and anti-cheat validation.
