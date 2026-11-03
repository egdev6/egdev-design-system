# Pixel v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-d-pixel`), dark theme, DPR 1, viewport 1280×600.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.

## Geometry and paint (gates 1 and 2)

| State | Rect | Clip path | Background | Filter | Transition property |
|---|---|---|---|---|---|
| idle | 6.39 × 9.59px | `polygon(0px 0px, 100% 33.8%, 100% 100%, 0px 66.2%)` | `oklab(0.999994 0.0000455678 0.0000200868 / 0.18)`, `--color-fg-default` (white) at 18% | none | none |
| past | 6.39 × 9.59px | same | `rgb(128, 12, 29)` = `--color-bg-deep` | none | none |
| active | 6.39 × 9.59px | same | `rgb(255, 0, 54)` = `--color-fg-brand-default` | none | none |

- The rect matches the approved ×0.8 size (6.4 × 9.6 CSS px).
- All three states render `display: inline-block` and `flex: 0 0 auto`, so they do not shrink.
- **Legacy neutralization (gate 4):** the legacy `.eg-pixel.is-active` neon `drop-shadow` glow and the legacy background transition do not apply. Computed `filter: none` and `transition-property: none` in every state.

## Motion and forced colors

- **`prefers-reduced-motion: reduce`:** the same paint, with `transition: none 0s`.
- **`forced-colors: active` (Chromium emulation):**
  - The mark stays visible in every state: idle `rgba(255, 255, 255, 0.18)`, past and active `rgb(255, 255, 255)`.
  - Past and active become indistinguishable. This is acceptable because the contract makes Pixel decorative and leaves all meaning to host text, and the plan asks only to observe visibility, not to add a forced-color API.

## Accessibility and host semantics

- Every Pixel in the AllStates, WithText, Navigation and LabelledMeter stories has `aria-hidden="true"`, no tab stop and no children.
- Meaning comes from host text: "Overview / Details" navigation labels, "2 of 3" in LabelledMeter and "Current section" in WithText.

## Not evaluated

Screen-reader output, native browser zoom, real Windows High Contrast themes, and pixel comparison with VIS-01/02.
