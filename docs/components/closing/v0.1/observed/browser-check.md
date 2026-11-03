# Closing v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-e-closing`), dark theme, DPR 1.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.
- **Scope:** measured after merging main with Hero #321, which includes the [Button large size amendment](../../../button/v0.3/large-size-amendment.md). The stories use `size="lg"` CTAs.

## Layout and boundary (CL-03, CL-04, gate 1)

| Story | 390 / 859 / 860 | 861 | 1280 |
|---|---|---|---|
| DecorativeMedia, ThreeActions | 1 column, media visually first, 306 × 306px (token cap 307.2px, limited by `34svh`) | 412.16 / 329.75px; media 329.8px | 515.55 / 412.45px; media 412.5px |
| NoMedia, LongCopy | 1 column | 1 column, 773.9px | 1 column, 960px |

- The inclusive ≤860px boundary holds at 860 and releases at 861. No horizontal overflow at any width.
- The media wrapper is `aria-hidden="true"` and contains no focusable element.
- The DOM keeps copy before media; the narrow media-first order is visual only.
- **Not measured:** fractional widths.

## Targets, focus and semantics (CL-01, CL-02, CL-06)

- **CTAs:** three delivered Button `size="lg"` measure 104.2 × 44.8, 126.2 × 44.8 and 102.2 × 44.8px. They wrap without clipping and keep DOM order. Target size stays a consumer obligation, as the spec states.
- **Keyboard:** Tab order is `#explore` → `#community` → `#source`, each with a visible focus ring.
- **Heading and section:** the heading is an `h2` with a generated `id`. The host SectionShell is named through `aria-labelledby` ("Keep building"), the approved heading-ID contract.

## Paint and motion (CL-05, gate 2)

- **Contrast on `rgb(20, 21, 24)`:** title `rgb(255, 255, 255)` 18.26:1; lede `rgb(204, 204, 204)` 11.37:1.
- **Halo:** Closing paints no halo of its own. The host `show` register supplies the gradient, as approved.
- **Motion:** with `prefers-reduced-motion: reduce`, no element in Closing has an effective transition or animation. Without it, six run, all inside the delivered Buttons.

## Defects found and fixed

1. **Empty stories.** The story decorator rendered `<Story args={{ id }} />`, which replaced every story arg. Every story rendered an empty heading with no CTAs. The decorator now spreads `context.args`.
2. **Broken media path.** Media pointed at `/egdev-logo.png`, which returns 404. It now uses `/brand/egdev-logo.png`.
3. **Empty media column.** Without media, the grid kept two columns, so an empty second track remained. The spec says absent media omits the slot with "no empty placeholder". Fixed test-first: the grid is two columns only when media is present, decided by `Children.toArray(media).length > 0` as in Hero. `media={false}` renders no wrapper.
4. **Undersized CTAs.** CTAs were 38.4px before the Button `lg` amendment.

## Not evaluated

Screen-reader output, native zoom, real Isotipo3D media driven by `@egdev/effects`, and pixel comparison with VIS-01/02.
