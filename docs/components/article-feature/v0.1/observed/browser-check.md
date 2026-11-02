# ArticleFeature v0.1 — browser check

Real Chromium (headless shell 1243) against Storybook with compiled tokens. Raw results: `browser-functional-checks.json`; diagnostics: `browser-finding-diagnostics.json`, `media-geometry-diagnostics.json`; initial metrics: `browser-initial-measurements.json`. Failing evidence is kept, labelled, next to the corrected captures.

## Findings and corrections

| # | Finding | Kind | Resolution |
|---|---|---|---|
| 1 | A legacy stylesheet rule for the `eg-article-feature__cover` marker painted a radial brand halo and linear gradient on the cover (`default-initial-*-dark.png`). | Component defect | Local reset on the cover recipe (`bg-none border-b-0 aspect-auto`); the legacy stylesheet is unchanged. RED→GREEN in `ArticleFeature.test.tsx`. |
| 2 | The generative well measured 53px inside a 158.8px reservation, so the decorative word sat at the top. | Component defect | `h-full` on the well; RED→GREEN. |
| 3 | Legacy root/meta rules added backdrop blur, clipping and tabular numerals. | Component defect | Local resets (`backdrop-filter-none`, `normal-nums`); RED→GREEN. |
| 4 | After reset 1 removed the legacy cover clipping, the oversized word overflowed the well and the card edge on the narrow card (`widths-fixed-1280-dark.png`). | Component defect | `overflow-hidden` on the well; RED (1 failed / 22 passed) → GREEN; `widths-clipped-1280-dark.png`. |
| 5 | Reduced-motion check expected a zero duration; the computed `transition-property` is `none` with a 0.2s duration. | Test predicate error | Predicate corrected: no effective transition. |
| 6 | Media check compared the image to the reservation; the image sits inside PhotoFrame's approved 1px Material border. | Test predicate error | Predicate corrected: PhotoFrame fills the reservation; the image fills the frame's inner box. |

## Results after corrections (PASS)

- Eight stories at 390px: single native anchor, no nested targets, no page overflow.
- Cover at 390px and 1280px: no halo, 16:8 reservation, well fills it, word bottom-aligned and clipped.
- Media cover in flex and grid hosts at 160px and 280px: 16:8 reservation, PhotoFrame fills it, empty `alt`, no host overflow; no reservation jump on image load.
- Accessible name includes the badge, per the owner-approved `badge-name-amendment.md`; the decorative word is absent; a consumer `aria-label` replaces the content name.
- Hover changes the hairline without moving the frame; one tab stop with the token focus ring; Enter follows the destination; reduced motion removes the transition.

## Visual comparison with VIS-01

Surviving intent matches: 16:8 cover, context row above the heading, title step, underlined paint-only action label with arrow, badge over the cover corner. Approved differences: no halo or isotype mark, solid tonal frame instead of glass, `text-heading-small` title, `alpha-white-07` ghost word, brand hairline plus `surface-2` on hover instead of glow.

## Not evaluated

No actual screen-reader run (the accessibility tree is not a screen-reader pass), no native browser zoom, and Storybook Controls widgets were not exercised.
