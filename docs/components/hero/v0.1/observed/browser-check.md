# Hero v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-e-hero`), dark theme, DPR 1.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.
- **Scope:** measured with the [Button large size amendment](../../../button/v0.3/large-size-amendment.md) applied; the stories use `size="lg"` CTAs.

## Layout and boundaries (HE-04, gate 1)

| Story | 390 / 859 / 860 | 861 / 960 | 961 / 1280 |
|---|---|---|---|
| LongLocalizedContent (with media) | 1 column, media first, 306 × 306px | 2 columns (422.95 / 325.36 at 861); media 325.4 then 365.6px | 2 columns; media 366 then 406.3px |
| NoMedia | 1 column at every width; copy fills the track (960px at 1280) with no phantom media column | — | — |

- The inclusive ≤860px boundary holds at 860 and releases at 861. The square media slot keeps its token-capped sizes at every measured width.
- No horizontal overflow at any width.
- **Not measured:** fractional widths.

## Targets, focus and semantics (HE-02, HE-03, HE-05)

- **CTAs:** the delivered Button at `size="lg"` measures 80.2 × 44.8px ("Explore") and 103.2 × 44.8px ("Learn more").
  - Before the Button amendment the largest size was 38.4px, which is why the owner approved it.
  - Target size stays a consumer obligation, as the spec states.
- **Social slot:** the consumer SocialLinks profile link measures 38.4 × 38.4px. Its size is a consumer obligation, as decided for Footer.
- **Keyboard:** Tab order is "Explore" → "Learn more" → profile link. Each shows the focus ring (`… rgb(255, 0, 54) 0 0 0 4px`).
- **Heading and section:** the heading is a native `h1` (host-chosen rank). The story host names its SectionShell "Introduction".
- **Media:** the media wrapper is `aria-hidden="true"` and contains no focusable element.

## Paint and motion (HE-05, HE-06, gate 2)

- **Contrast on the page background `rgb(20, 21, 24)`:**
  - title `rgb(255, 255, 255)`: 18.26:1;
  - lede `rgb(204, 204, 204)`: 11.37:1.
- **Root paint:** none (transparent, no image, no shadow). The host SectionShell `show` register paints the background.
- **Legacy:** root `position: static`; `::before` is `none`.
- **Motion:** with `prefers-reduced-motion: reduce`, no element in Hero has an effective transition or animation. Without it, only the delivered Button, IconButton and Icon transitions run.

## Defects found and fixed

- **Broken media path:** the stories referenced `/egdev-logo.png`, which returned 404, so the slot rendered empty. The path is now `/brand/egdev-logo.png` (Storybook static `brand`), with `block h-full w-full object-contain`.
- **Story scanning:** `.storybook/preview.css` now scans `Hero.stories.tsx`, because those image utilities appear only in stories.
- **CTA targets:** the delivered Button maxed out at 38.4px. The owner approved Button `size="lg"` (44.8px), committed separately before this evidence.

## Not evaluated

Screen-reader output, native zoom, real 3D media (Isotipo3D lives in `@egdev/effects`), host clearance under a fixed TopBar, and pixel comparison with VIS-01/02.
