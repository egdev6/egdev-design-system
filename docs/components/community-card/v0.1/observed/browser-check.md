# CommunityCard v0.1 — browser check

Real Chromium (headless shell 1243) against Storybook with compiled tokens. Raw results: `browser-functional-checks.json`; initial measurements: `browser-initial-measurements.json`. Failing captures are kept next to corrected ones (`*-initial-*` vs `*-fixed-*`).

## Findings and corrections

| # | Finding | Kind | Resolution |
|---|---|---|---|
| 1 | In equal-height stretched cards (`Widths`), the action bottoms differed (292.2px vs 266.6px at 1280px): the body zone did not grow, so the action's `mt-auto` had no effect (`widths-initial-1280-dark.png`). | Component defect | `flex-1` on the body zone; RED→GREEN in `CommunityCard.test.tsx`. |
| 2 | The name rendered in the body family without uppercase; spec §4 requires the display family in uppercase, and the section token sets only size, line height and weight (`default-initial-*-dark.png`). | Component defect | `font-display uppercase` on the title recipe; RED→GREEN. |

## Results after corrections (PASS)

- `Widths` at 390, 767, 768 and 1280px: the action sits at the bottom of the body zone, and stretched cards in one row align their actions.
- Name at 390 and 1280px: display family, uppercase.
- 48rem boundary (owner-approved local breakpoint, `responsive-breakpoint-amendment.md`): top row `12.8px 19.2px` and body `19.2px` at 767px; `16px 25.6px` and `25.6px` at 768px.
- Root padding 0 with no legacy glass paint; `surface-2` header band; mark capped at 51.2px.
- Named `article` landmark through the generated heading; the supplied action is the only tab stop.
- No page overflow across `LongContent`, `WithImageMark`, `DecorativeMark`, `WithoutEyebrow` and `WithLink` at 390 and 1280px.

## Visual comparison with VIS-01

Surviving intent matches: role line with the neon diamond, trailing mark, large uppercase display name, secondary copy, one action at the bottom. Approved differences: solid tonal frame with a `surface-2` header band instead of glass, consumer-supplied mark instead of a built wordmark, ×0.8 token scale.

## Not evaluated

No actual screen-reader run (the accessibility tree is not a screen-reader pass), no native browser zoom, and Storybook Controls widgets were not exercised.
