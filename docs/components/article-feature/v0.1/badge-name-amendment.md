# ArticleFeature badge accessible-name amendment

Owner answer (verbatim): "Include badge text in the name".

## Resolved discrepancy

The approved specification describes a plain-text, non-interactive badge. The implementation plan §10 incorrectly excluded that text from the whole-card link's accessible name. The owner explicitly chose to preserve the visible badge text in that name after inspecting the observed Chromium result.

The default content-derived link name includes the supplied badge, context row, heading and action label in DOM order. The badge is never an independent control or tab stop. Decorative cover words, separator dots and the arrow remain `aria-hidden`. An informative media alternative may contribute to the name; a consumer-supplied `aria-label` or `aria-labelledby` replaces the content-derived name.

This amendment supersedes only the plan's expectation that badge text is absent from the name. Original approved specification, plan and captures remain unchanged. No runtime API or naming convention is added or widened.

## Evidence and limitations

`observed/browser-initial-measurements.json` records the Chromium accessibility tree at 390px and 1280px. The observed default link name includes “Featured”. This is browser accessibility-tree evidence, not an actual screen-reader run. Final keyboard, geometry and visual checks remain separate.
