# LabStage v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-e-lab-stage`), dark theme, DPR 1.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.

## Legacy height stop gate (LS-06, gate 4)

The retained legacy rule `.eg-lab { position: relative; height: 230vh }` lives in `@layer components`. A legacy-only `.eg-lab` probe computes 2070px (230vh at 900px). LabStage's own root computes its natural height (117.6px in Unit A; 442px with media and experiment), because its `h-auto` utility wins over the components layer.

Packed tests assert LabStage's own SSR root carries `h-auto`, since other components also emit that utility. A source mutation removing it fails 1 export and 6 consumer tests. The stop gate does not fire.

## Layout and boundaries (LS-03, LS-04, gate 1)

| Story | 390 / 559 / 560 / 561 / 859 / 860 | 861 | 1280 |
|---|---|---|---|
| DecorativeMedia, LongCopy | 1 column, media visually first, 307.2 × 307.2px (token cap; 36svh is larger) | 388.61 / 353.30px; media 353.3px | 486.09 / 441.91px; media 441.9px |
| Experiment, NoMedia | 1 column | 1 column, 773.9px | 1 column, 960px |

- The inclusive ≤860px boundary holds at 860 and releases at 861.
- LabStage owns no 560px rule; card-level rules belong to consumer composition. No change appears at 559/560/561.
- No horizontal overflow at any width.
- The media wrapper is `aria-hidden="true"` with no focusable element.
- **Not measured:** fractional widths.

## Experiment content, semantics and motion (LS-01, LS-02, LS-05, gates 2, 5 and 6)

- **Composition:** the story composes the experiment from the delivered ProjectCard (eyebrow, index "014", title, description) with a `ProjectCardFooter` action. LabStage paints no card. The first pass hand-composed Surface, Heading and Text, which produced a hero-sized title and an eyebrow-styled description; the story now reuses ProjectCard.
- **Action:** the delivered Button `size="lg"` measures 171 × 44.8px at 1280 and 390, with a visible focus ring. It is the only tab stop.
- **Heading and section:** the heading is an `h2` with a generated `id`. The host SectionShell is named through `aria-labelledby` ("Explore the lab").
- **Contrast:** title 18.26:1 on `rgb(20, 21, 24)`.
- **Motion:** LabStage's own elements have no transition or animation in any preference. The only transition belongs to the composed Button and stops under `prefers-reduced-motion: reduce`. There is no glitch loop and no scroll choreography.

## Not evaluated

Screen-reader output, native zoom, real Isotipo3D media driven by `@egdev/effects`, and pixel comparison with VIS-01/02.
