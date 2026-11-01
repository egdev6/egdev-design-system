# Brand text uses neon — owner decision

## Decision

During the visual review on main (2026-11-01) the owner saw that removing Storybook's local red-300 → neon alias (#229) turned many elements pink: "estoy viendo que muchos recursos han cambiado el tono de rojo... ese rojo debería ser el predominante en los elementos no el otro". Offered three options, the owner chose "Todo neón".

- `--color-fg-brand-raised` now resolves to `--color-primitive-red-neon` (#FF0036). No new color value.
- Consumers: Link, ListItem, NavList, PullQuote, Stat, Text/Heading raised, Timeline, Toggle, and the Storybook manager theme and documentation styles.
- `--color-status-danger` keeps `--color-primitive-red-300` (#FF6680), so errors stay distinct from the neon focus ring (#219 option A).

## Accepted accessibility trade-off

Neon text contrast: canvas 4.61:1, surface-1 4.30:1, surface-2 3.92:1, surface-3 3.42:1. Small brand text meets WCAG 2.2 AA (4.5:1) only on the canvas; large text (≥ 24px, or ≥ 18.66px bold), icons and borders meet 3:1 on every surface. The owner explicitly accepted this trade-off; prefer neon brand text for large text, icons and accents.

This supersedes the unmerged Link v0.3 red-light proposal (branch fix/221-link-brand-red).
