# NotesBoard v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-d-notes-board`), dark theme, DPR 1.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.

## Boundary, tracks and gaps (gate 1)

| Stories | 390 / 1079 / 1080 | 1081 | 1280 |
|---|---|---|---|
| Default, Empty, LongTitles, Sticky, HostSection | 1 track, gap 25.6px (`--space-8`) | 369.81px / 647.19px, gap 32px (`--space-10`) | 442.17px / 773.83px, gap 32px |

The wide tracks keep the 4:7 ratio (369.81 / 647.19 = 0.571). The inclusive `[@media(width<=1080px)]:` boundary holds at 1080 and releases at 1081. Root `align-items: center`. No horizontal overflow and no nested anchors in any story or width. **Not measured:** fractional viewport widths.

## Sticky side (gate 2, `board-sticky-side` / `sticky`)

- **Sticky story, at or above 1081px:** the side is `position: sticky` with `top: 86.4px` (`--nav-height` 54.4px + `--space-10` 32px) and `align-self: flex-start`.
- **At 1080px and below:** the side is `position: static`.
- **Scroll, with 20 extra rows injected so the page can scroll:**
  - At 1280px × 600px, the side stays at 86.4px from the viewport top while the page scrolls 0 → 150 → 400 → 800 → 1032px.
  - At 1080px, the side scrolls with the content (16px → −1159px).
- **Without `sticky`:** the side is `position: static`, `top: auto`.

The legacy sticky rule used `--nav-height + 42px`. The approved token offset replaces it, and the legacy `eg-notes--sticky` and `eg-notes__side` markers are not emitted.

## Semantics, paint and keyboard (NB-01, NB-03, NB-04)

| Check | Result |
|---|---|
| Notes list | `ol`, with `<time datetime>` values `2026-09-12` and `2026-08-30` |
| Topics | A `ul` named "Topics" with two static Chips and no focusable element |
| Tab order | Reaches only the two note rows (`#first-note`, `#second-note`, `:focus-visible`), then leaves the story frame |
| Root paint | Background transparent, no image, no shadow, transition `all 0s` |

## Not evaluated

Screen-reader output, native browser zoom, host clearance against a real fixed TopBar, the computed cascade on a separate legacy-only `.eg-notes` fixture, and pixel comparison with the source web.
