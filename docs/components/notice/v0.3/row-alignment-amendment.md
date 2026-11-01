# Notice v0.3 amendment — centered row alignment

## Owner decision

During the visual review on main (2026-11-01) the owner reported: "en toast y notice los elementos no están alineados... Sobre todo cuando hay botón... debe adaptar el alineamiento siempre". The v0.2 alignment amendment had moved the root to `items-start` with a first-line icon offset; with an action button taller than one text line, the icon and text sat above the button.

## Changed promise

- The root uses `items-center`: icon, text block and actions share one vertical center in every tone and preset, with or without actions. The per-size first-line icon offsets are removed.
- Toast reuses the Notice recipe, so floating toasts follow the same rule.

## Unchanged

- Wrapping (`flex-wrap`), gaps, padding, tones, presets, the actions slot (`ms-auto`), semantics and public API. This supersedes only the alignment rule of `docs/components/notice/v0.2/alignment-amendment.md`.
