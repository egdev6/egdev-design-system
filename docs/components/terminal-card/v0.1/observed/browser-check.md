# TerminalCard v0.1 — browser verification

Parent verification in Chromium headless shell 1243, Storybook implementation worktree port 6123, dark theme, 390×844 viewport. Compared the default screenshot with adopted VIS-03, honoring the approved solid Surface frame, surface-2 band, raised-brand text and token typography differences.

- Default, WithShell, WithoutShell, LongValues and WithCaret: named `role="group"`, border-box root, zero interactive tab stops and no root horizontal overflow.
- Default root clientWidth/scrollWidth: 356/356px. Surface frame RGB(27,28,32), header band RGB(35,36,40).
- Caret is aria-hidden and pulses; emulated reduced motion changes computed animation-name to none.
- Inspected screenshots `default-390-dark.png` and `long-values-fixed-390-dark.png`. No screen-reader session or pixel-equivalence claim.

## Narrow-column defect and correction

The initial LongValues check passed no-overflow assertions but its screenshot exposed an unreadable one-character-wide value column. The auto/1fr grid allowed a long term to consume space; additionally, the browser's native `dd` margin-left was 40px because this system loads no global reset.

Kept the approved two-column grid and scoped the correction to existing utilities: term `max-w-24`, value `m-0`. Both regression assertions were observed failing before their corresponding fixes; all 13 component tests passed afterward. Fresh Chromium verification (job-201) measured term 76.8px, value 113.2px, value margin 0px, height 122.8px, root clientWidth=scrollWidth=228px. The full value remains present and the inspected screenshot is readable. Legacy CSS, tokens and approved snapshot files were not changed.

Initial measurements and `long-values-390-dark.png` intentionally preserve the failing case; `narrow-grid-fix.json` and `long-values-fixed-390-dark.png` capture the correction. Final rebuilt package and repository checks are recorded separately.
