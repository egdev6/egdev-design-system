# SelectTile v0.2 — selected underline amendment

Removes the selected underline from the card title recipe. Selection remains perceivable through the existing Material selected state and Radix-owned semantics; no token, dependency or API change.

- **Status:** owner-decided visual correction, implemented directly per the umbrella decision (S1 in `odd/tasks/visual-review-corrections.md`).
- **Owner decision (verbatim, 2026-11-01):** "No poner título en underline cuando está seleccionado".
- **Tracking:** issue [#221](https://github.com/egdev6/egdev-design-system/issues/221), umbrella [#228](https://github.com/egdev6/egdev-design-system/issues/228).
- **Identity:** delta amendment to [SelectTile v0.1](../v0.1/implementation.md). Unmentioned v0.1 promises remain unchanged.

## 1. Change

`selectTileVariants.label` no longer emits the `group-has-[[data-state=checked]]/tile:underline` and `group-has-[[data-state=on]]/tile:underline` utilities, nor their `decoration-(length:--border-width)` and `underline-offset-(--space-1)` companions, which existed only for that underline. The card keeps its `no-underline` guard. No other part, prop, token or stylesheet changes.

## 2. Remaining selection cues

Follow-up owner decision (2026-11-01, verbatim): **"Icono de check"** — a non-color selected cue is added on top of the underline removal. When a card is selected (`data-state=checked` / `data-state=on`), a decorative `check` glyph from the closed Icon system (`aria-hidden`, no accessible name) fades and scales in inside a fixed `h-3.5 w-3.5` slot at the card's inline-end corner over the media, mirroring the live badge corner. The slot is absolutely positioned, so it reserves no layout space and causes no layout shift; it uses the `--duration-fast`/`--ease-out` tokens and `motion-reduce:transition-none`, so reduced-motion users get an instant, non-animated appearance. No check indicator existed before this amendment; the glyph is existing, not new.

With the check in place, a selected card is distinguishable without color alone:

- **Non-color cue (visual):** the decorative check icon described above.
- **Material selected state (visual):** `bg-surface-3` with the `--gradient-post-new` fill, `border-border-brand` and the added `var(--shadow-edge-strong)` layer plus `--shadow-elev-1`.
- **Programmatic state:** the control keeps Radix-owned `aria-checked` (single) / `aria-pressed` (multiple) and `data-state=checked|on`.

## 3. Verification

The focused suite asserts that the label of a selected card in both modes carries no `underline`/`decoration` utilities, and that the existing composition, Radix selection and Material assertions still hold. No token or dependency was touched; no new export or stylesheet was added.
