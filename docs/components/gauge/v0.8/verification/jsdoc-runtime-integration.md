# JSDoc runtime integration verification

## Correction

Storybook 10.6.1 did not consume the separate `react-docgen-typescript` prop tag map as Controls configuration. The approved first-pass enhancer in `.storybook/jsdoc-controls.ts`, registered in `.storybook/preview.tsx`, now maps the five supported local directives to real Controls. It preserves extracted types, requiredness, explicit overrides, untagged native rows and documentation; it does not create argument values or narrow mixed unions.

`@control string` maps to the official `text` widget. This is a project integration, not native Storybook JSDoc syntax. The 14-type upstream catalog does not imply that all upstream configuration features are implemented by this mapper.

## Defaults

Actual source comments were reparsed through the public Storybook composition pipeline. Twelve string constants no longer include literal quote characters. Four absent or derived defaults no longer become invented string values: Gauge `center`, `stateText`, `valueText`, and Tabs `defaultValue` describe their behavior in prose instead.

The **Default** column documents constant defaults. **Controls** edits arguments supplied by the example. An unset control can show “Choose option...” or “Set string” while the component applies its runtime fallback. No optional arguments were injected to conceal that distinction.

## Observed checks

- Behavioral RED: 1 passed / 5 failed before integration; default-correction RED: 8 failed / 62 passed before source-comment fixes.
- Focused GREEN: 70 tests, including real-source extraction and Storybook composition/inference.
- Final gate `job-35`: exit 0; 132 Vitest tests, typecheck, lint, current registry/view, 73 registry tests and diff check.
- Static Storybook build `job-36`: exit 0, output `/tmp/egdev-jsdoc-final-storybook.ZRH6PI`.
- Live Vite browser: selects in Gauge (1), IconButton (3), Surface (4) and Tabs (2); non-editable rows remain documented; boolean controls expose switches.
- Gauge: decimal measurement and derived accessible text, state selection with a visible cue, real requiredness and the full preset-or-number size type were checked. Final Default remains 42 / 100, normal, 56 CSS pixels.
- All four Docs tables were checked for exact rendered defaults and clean descriptions without raw directives. See the adjacent JSON for values and resolved automation-selector failures.

## Captures

- `jsdoc-runtime--docs-table--dark.png`: actual Gauge Docs table.
- `jsdoc-runtime--controls--dark.png`: actual Gauge Controls table.
- `jsdoc-runtime--default-gauge--dark.png`: actual Default component region.

These are current observations, not replacements for approved design references or historical reports.

## Limits

No component API, runtime, styling, token or dependency changes. No production-browser matrix, screen-reader evaluation or new packed React consumer run; the prior offline-cache blocker is unchanged. Native assessment was unassessable because untracked scope was not declared, so no native approval is claimed. Builds retain non-blocking Radix `use client` and plugin-timing advisories; active diagnostics found no errors but did report informational/hint findings.

## Sources

- [Storybook ArgTypes](https://storybook.js.org/docs/api/arg-types)
- [Storybook Controls](https://storybook.js.org/docs/essentials/controls)
- [Storybook TypeScript integration](https://storybook.js.org/docs/configure/integration/typescript)

The installed 10.6.1 source and actual browser behavior, not unverified web examples, established the enhancer registration and data flow.
