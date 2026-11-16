# PageHeader v0.2 implementation evidence

## Authority and scope

- The [approved leading-action and lede amendment](leading-action-amendment.md) extends the [v0.1 contract](../v0.1/implementation.md) for [#412](https://github.com/egdev6/egdev-design-system/issues/412). Its canonical UTF-8 payload from `## 1. Purpose and scope` through EOF has SHA-256 `2bcac999f883cc7822f701c826eaffbc7b1b806b1eb06ff4cf40df8df4b44415`; the original header remains unchanged and pending publication.
- The separately approved implementation plan is [task T1, S1–S8](../../../../odd/tasks/page-header-leading-action.md). The owner selected `text-body-default` and top-of-text alignment there; the [adoption batch](../../../../odd/tasks/nexo-adoption-m1-specs.md) records the `lede` and scoped `leadingAction` choices. This record is not independent review or visual approval.
- The six existing component roles and public exports remain. **No stylesheet**, extra module, token or dependency was added.

## Implementation

A direct consumer-supplied IconButton, including its supported slotted link, precedes the text and is rendered without cloning or added classes. A logical flex start wrapper aligns it to the top of the existing text Stack; trailing actions remain independent. With no leading action the v0.1 tree and text classes are preserved. Booleans and null omit the leading area.

A nonblank plain lede follows the heading, preserves supplied text verbatim and is not part of its accessible name or automatically related by `aria-describedby`. Blank lede text is omitted. Its `text-body-default` is the owner's deliberate choice, distinct from SectionHeader's `text-body-muted`. Flex layout and `wrap-anywhere` use existing token utilities; the host must provide enough room for each control.

The [naming registry](../../../../skills/_shared/prop-naming.json) adds a reviewed PageHeader `section-lede` usage and one scoped `trailing-actions` exception, bound by the [approval record](prop-naming-approval.json) to the owner choices and prior receipt. The existing PageHeader actions usage is retained exactly once; the exception supplies the alternative-name evidence rather than a duplicate usage. All five PageHeader usage revisions match the reviewed `PageHeaderProps` source, whole-file SHA-256 `efd948e4151568a21c5487e72c4f79b3bb3d56bcd91a39d2948717da6dca9d24`. No global alias or unrelated convention change is implied.

Storybook adds `LeadingAction`, `WithLede`, `Combined`, `ConstrainedCombined` and `RTLCombined`, with no manual `argTypes` or `play` functions. Real docgen and the registered Controls pipeline cover both new rows; actual browser widgets remain a separate check.

## Observed test-first evidence

- **RED:** `pnpm exec vitest run packages/ui/src/molecules/page-header packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner` exited 1 before implementation: 14 failed, 498 passed. New leading-action tests could not find the supplied control and observed a leaked `leadingaction` attribute; the lede test found no paragraph, blank lede leaked to the root, and docgen/Controls lacked the new props.
- **GREEN:** the same command exited 0 after implementation and final test formatting: 512 tests passed across 4 files. Existing v0.1 assertions remain; new tests cover omission, action role/name/ref/unchanged classes, pointer and keyboard activation, disabled and slotted link behavior, rerender identity/focus, lede order/content, root attributes, class merge, and LTR/RTL tab order. DOM tests cannot establish browser reflow.
- The focused preview CSS check builds the actual entry in memory without emitting artifacts and checks the emitted flex, gap, typography, color and wrapping utilities. This is utility-emission evidence, not computed layout or pixel parity.
- `pnpm props:docs && pnpm props:check && pnpm test:props` exited 0: the generated view is current and 120 registry tests passed, including the scoped receipt and prior-approval regression.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` exited 0 and regenerated both catalog outputs (115 rows).
- `pnpm typecheck` exited 0 for the root and all workspace typecheck scripts.
- `pnpm exec biome check packages/ui/src/molecules/page-header/PageHeader.stories.tsx packages/ui/src/molecules/page-header/PageHeader.test.tsx packages/ui/src/molecules/page-header/PageHeader.tsx packages/ui/src/molecules/page-header/types.ts packages/ui/src/molecules/page-header/usePageHeader.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-css.test.ts scripts/package-consumption.test.mjs scripts/package-exports.test.mjs scripts/prop-naming.test.mjs skills/_shared/prop-naming.json docs/components/page-header/v0.2/prop-naming-approval.json` exited 0, 13 files checked. An earlier check found formatting differences, which were corrected.
- Built-package CSS/SSR and packed React 18/19 fixtures, including strict type negatives and the combined leading link sample, were extended but not run by this worker. No full suite or production build was run.

## Remaining verification

The parent must run the full suite, production build, package-export and packed-consumer checks. In Chrome, Edge and Firefox, inspect the combined, constrained and RTL stories for logical alignment and reading order, independently fitting controls, long unbroken title/lede wrapping without overlap or truncation, and keyboard/focus behavior at narrow widths and 200%/400% zoom. Verify actual Controls widgets, accessibility tree and assistive-technology behavior separately.

VIS-01's expected-design source, comparable capture conditions and visual approval remain pending. A real implementation capture is required before merge; none was produced by this worker. Visual conformity: **Not evaluated**.

## Parent browser verification (2026-11-16)

Real browsers against the local Storybook (`molecules-pageheader--leading-action`, `--with-lede`, `--combined`, `--constrained-combined`, `--rtl-combined`, and v0.1 `--long-title` for preservation) at 640px and 320px viewports. No defects were found, so no fixes were needed.

| Check | Chrome 157 (Playwright MCP) | Edge 157 (headless CDP) | Firefox 160 (WebDriver BiDi) |
| --- | --- | --- | --- |
| Leading action aligned to the top of the text block (owner: "Arriba del bloque"); delta to the text Stack top | 0px | 0px | 0px |
| Leading action side: left in LTR, right in RTL; never overlaps the text | Pass | Pass | Pass |
| Lede is the heading's next sibling; `12.8px/500` (owner: `text-body-default`), heading `19.2px` | Pass | Pass | Pass |
| No overflow at 640px or 320px, including the long unbroken lede in the constrained stories | Pass | Pass | Pass |
| No ancestor clips the leading IconButton focus ring | Pass | Pass | Pass |

The only element with `scrollWidth > clientWidth` is the IconButton's visually hidden label (`position: absolute`, 1×1px, `clip: rect(0, 0, 0, 0)`), which is intentional. Keyboard order (leading action before the trailing actions in LTR and RTL) is pinned by unit tests. Zoom, forced colors and reduced motion were **not evaluated** in a browser.

### Captures

Playwright MCP, Chrome 157, device scale, 640px viewport (the constrained stories set a narrower host).

| File | SHA-256 |
| --- | --- |
| `captures/vis-01-combined-chrome-640.png` | `d97d27d670c4a932f8fe9dc1698a1433db630a85e84f980130f0e7981b1ebcb8` |
| `captures/vis-01-constrained-combined-chrome-640.png` | `d46130c4adcdefb67c38cafa58feb0770c117fe64cf989fe7b20788b242823f7` |
| `captures/vis-01-rtl-combined-chrome-640.png` | `17eff9af8165d188302193893fdf2bd40d0465ef49debf6b9c73743966828707` |

These are implementation captures, not approved expected-design references.
