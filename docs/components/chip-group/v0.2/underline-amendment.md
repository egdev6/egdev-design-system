# ChipGroup v0.2 — on-state underline amendment

Removes the on-state underline from the group-owned item additions. Selection remains perceivable through the shared Chip on-state and Radix-owned semantics; no token, dependency or API change.

- **Status:** owner-decided visual correction, implemented directly per the umbrella decision (S3 in `odd/tasks/visual-review-corrections.md`).
- **Owner decision (verbatim, 2026-11-01):** "Sin underline al estar seleccionado".
- **Tracking:** issue [#221](https://github.com/egdev6/egdev-design-system/issues/221), umbrella [#228](https://github.com/egdev6/egdev-design-system/issues/228).
- **Identity:** delta amendment to [ChipGroup v0.1 + A1](../v0.1/implementation.md). Unmentioned v0.1 promises remain unchanged.

## 1. Change

`chipGroupItemVariants` no longer emits the `data-[state=on]:underline` utility nor its `decoration-[length:var(--border-width)]` and `underline-offset-[var(--space-1)]` companions, which existed only for that underline. The motion-reduce reset and disabled cursor/transform guards stay. The shared Chip recipe (`@/atoms/chip`) is unchanged. No other part, prop, token or stylesheet changes.

## 2. Remaining selection cues

Follow-up owner decision (2026-11-01, verbatim): **"Icono de check"** — a non-color selected cue is added on top of the underline removal. Every group item now renders a decorative `check` glyph from the closed Icon system (`aria-hidden`, no accessible name) after the label, inside a `h-3.5` slot that collapses to zero width (`w-0`, logical `-ms-1.5` canceling the flex gap) when off and animates to `w-3.5` with opacity and scale when `data-state=on`. The width animation keeps unselected items pixel-identical to the previous recipe and shifts siblings only by the animated width itself; it uses the `--duration-fast`/`--ease-out` tokens and `motion-reduce:transition-none`, so reduced-motion users get an instant, non-animated appearance. The glyph is existing, not new, and the shared Chip atom is unchanged.

With the check in place, an on-state chip is distinguishable without color alone:

- **Non-color cue (visual):** the decorative check icon described above.
- **Material on-state (visual):** the shared Chip recipe adds a `var(--shadow-edge-strong)` layer on top of the base `shadow-edge`; the `border-primitive-red-neon/60` border, `--gradient-chip-active` fill, `--shadow-glow-base` glow and `text-fg-default` shift are color cues.
- **Programmatic state:** items keep Radix ToggleGroup-owned `aria-checked` (single) / `aria-pressed` (multiple) and `data-state=on`.

## 3. Verification

The focused suite asserts that an on-state chip in both modes carries no `underline` utility, that the group-owned additions keep the motion/disabled guards, and that the existing selection, roving-focus and composition assertions still hold. No token or dependency was touched; no new export or stylesheet was added.
