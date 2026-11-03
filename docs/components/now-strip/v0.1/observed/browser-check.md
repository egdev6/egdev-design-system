# NowStrip v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-d-now-strip`), dark theme, DPR 1, default fonts loaded by Storybook.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.

## Grid boundary (NS-04, gate 1)

| Story | 390 | 859 | 860 | 861 | 1280 |
|---|---|---|---|---|---|
| Default | 1 track | 1 track | 1 track | 3 tracks | 3 tracks |
| UnevenCards | 1 track | 1 track | 1 track | 3 tracks | 3 tracks |
| LongContent | 1 track | 1 track | 1 track | 3 tracks | 3 tracks |

The inclusive `[@media(width<=860px)]:grid-cols-1` boundary holds at 860 and releases at 861. No horizontal overflow at any width. **Not measured:** fractional viewport widths (the probe only sets integer viewports).

## Equal heights and footer alignment (NS-04, gate 5)

- Before the NowCard amendment, the first-row cards stretched to 181.41px each, but their footer tops were 192.22, 185.73 and 138.41px. That stopped the work, as gate 5 requires. See [the NowCard body-grow amendment](../../../now-card/v0.1/body-grow-amendment.md).
- After the owner-approved amendment (`NowCardBody` `flex-1`), the `UnevenCards` first row measures 181.41px for each card, with every footer top at 192.22px and 1px below each footer. The second-row card is unaffected (99.25px, no footer).
- Standalone NowCard geometry is identical before and after in all nine NowCard stories at 390px and 1280px.

## Computed styles (NS-06, gates 2 and 4)

| Property | Value |
|---|---|
| Root margin | `0px` (legacy margin neutralized) |
| Root padding-bottom | `19.2px` (`--space-6`) |
| Root bottom border | `1px solid rgba(255, 255, 255, 0.08)`, equal to `--border-width` and `--color-border-hairline` (the legacy rule used `--color-border-subtle`) |
| Other root borders | `0px` |
| Root background / image / shadow | transparent / none / none |
| Root transition | `all 0s` (no transition) |
| Label | flex, gap 6.4px, margin `0 0 9.6px`, Barlow Condensed 11.2px uppercase, `rgb(204, 204, 204)` |

## Semantics, motion and keyboard (NS-01, NS-03)

- The root has `role="group"`, and its name is the visible label ("Currently") through `aria-labelledby`. The root has no tab stop (`tabIndex` −1 as computed by the DOM, no `tabindex` attribute).
- The decorative StatusDot has `aria-hidden="true"` and no animation (`animation-name: none`), with and without `prefers-reduced-motion: reduce`. It renders at 8px × 8px.
- Tab from the document start reaches only the child-owned card link (`#building`, `:focus-visible`), then leaves the story frame.

## Not evaluated

Screen-reader output, native browser zoom, text contrast against the real host surface, and pixel comparison with VIS-01/02.
