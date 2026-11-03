# ChapterBreak v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-e-chapter-break`), dark theme, DPR 1.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.

## Layout and boundary (CB-03, CB-04, gate 1)

| Story | 390 / 859 / 860 | 861 | 1280 |
|---|---|---|---|
| DecorativeMedia | 1 column, media visually first, 306 × 306px (token cap 307.2px, limited by `34svh`) | 412.16 / 329.75px; media 329.8px | 515.55 / 412.45px; media 412.5px |
| NoMedia, LongLocalizedContent | 1 column | 1 column, 773.9px | 1 column, 960px |

- The inclusive ≤860px boundary holds at 860 and releases at 861.
- Without media the copy fills the track and no empty column remains, as the spec requires.
- No horizontal overflow at any width.
- The media wrapper is `aria-hidden="true"` and contains no focusable element.
- **Not measured:** fractional widths.

## Semantics, paint and motion (CB-01, CB-05, CB-06, gates 2 and 4)

- **Heading and section:** the heading is an `h2` with a generated `id`. The host SectionShell is named through `aria-labelledby` ("A new chapter").
- **Controls:** ChapterBreak renders no controls; surrounding controls are a consumer obligation.
- **Contrast on `rgb(20, 21, 24)`:**
  - title `rgb(255, 255, 255)`: 18.26:1;
  - lede `rgb(204, 204, 204)`: 11.37:1.
- **Root paint:** none (transparent, no image, no shadow). The host `show` register supplies the background.
- **Legacy (gate 4):** the root is `eg-chapter-break`. A legacy-only `.eg-chapter` probe computes `position: static`, `min-height: 0` and `display: block`, so the new root does not collide with it. Legacy markers are untouched.
- **Motion:** no element in ChapterBreak has an effective transition or animation, with or without `prefers-reduced-motion: reduce`.

## Not evaluated

Screen-reader output, native zoom, real Isotipo3D media driven by `@egdev/effects`, and pixel comparison with VIS-01/02.
