# SelectTile v0.3 implementation evidence

## Authority and scope

- The [approved text-only amendment](text-only-amendment.md) extends [v0.1](../v0.1/implementation.md) and [v0.2](../v0.2/underline-amendment.md) for [#413](https://github.com/egdev6/egdev-design-system/issues/413). Its canonical UTF-8 payload from `## 1. Purpose and scope` through EOF has SHA-256 `eeaeadef3d8f81c2d58902b3e018ff77a3cbbc573d870dd92cd03ca585622c39`; the unpublished amendment header remains unchanged.
- The separately approved implementation plan is [T1, S1–S9](../../../../odd/tasks/select-tile-text-only.md). Its L2 resolves repeated docgen default tags and the minimum hit height within the approved spec. This record is neither independent review nor visual approval.
- The existing six component roles and public export inventory remain unchanged. **No stylesheet**, extra internal module, token or dependency was added.

## Implementation and integration

Single mode accepts `variant='text-only'`; multiple mode accepts only `default` in TypeScript. The hook consumes the variant and falls back to media for untyped multiple/text-only input. The single branch owns the `@default default` tag, while the multiple branch describes its default in prose; real docgen and Controls report one default. Text-only omits the media well, AspectRatio, image and fallback, places any badge after label and metadata, and retains the decorative check and Radix-owned selection, form and keyboard behavior. Token utilities supply logical inline-end clearance and `min-h-14` (44.8 CSS pixels with the current token); default media cards retain `min-h-11`. A client effect warns about ignored thumbnails once per changed set; ratio alone and server rendering do not warn.

The [naming registry](../../../../skills/_shared/prop-naming.json) reuses approved `visual-treatment` / `variant` and refreshes all fourteen SelectTile source usages to whole-file `types.ts` SHA-256 `d89650be9580591f8543d36e2185121c8047eecec1a4936dcb74602bdaaeb834`. No convention or approval was changed. The catalog identifies the new single-mode presentation. Storybook adds `TextOnly`, `TextOnlyNarrow` and `TextOnlyRTL` without manual `argTypes` or play functions. Package fixtures include typed positive and negative cases, SSR and production CSS checks; the parent owns their execution.

## Observed test-first evidence

- **RED:** the authorized focused Vitest command exited 1 before implementation: 7 failed, 509 passed. The new variant leaked to the root, the warning was absent, docgen and Controls lacked the variant, and `.pe-7` was not emitted.
- **L2 correction RED:** the focused command exited 1: 4 failed, 513 passed. The two text-only DOM tests found `min-h-11` instead of `min-h-14`; docgen and Controls still returned duplicate defaults. Before this correction the same command had exited 1 with those two metadata failures (514 passed).
- **GREEN:** after applying L2, the same focused command exited 0: 517 tests passed across four files. It covers both presentations' keyboard, form, controlled, disabled and RTL behavior, text-only anatomy, warnings, docgen/Controls and emitted preview CSS. Existing media-card tests remain unchanged. DOM assertions and compiled utilities do not establish real-browser geometry or visual parity.
- `pnpm typecheck` exited 0 for the root and workspace projects.
- `pnpm props:docs && pnpm props:check && pnpm test:props` exited 0; all 122 registry tests passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` exited 0 and regenerated both catalog outputs (115 rows).
- A focused Biome check of changed code initially reported formatting/style issues; they were corrected and the check passed. Build, full-suite, built-package exports and packed consumers remain parent-owned.

## Remaining verification and decisions

In Chrome, Edge and Firefox, check wide, narrow and RTL stories with keyboard and pointer: wrapping, logical check clearance, inline badge order, selection/live/disabled states, focus visibility and clipping, forced colors, reduced motion, contrast, accessibility tree and announcements. Measure whole-tile hit geometry, including a short label without metadata or badge at 200% and 400% zoom; the emitted minimum is not a browser layout measurement. Verify the actual Controls widgets as well.

VIS-01 expected-design source, comparable conditions and visual approval remain pending. A real implementation capture is required before merge; none was produced by this worker. Visual conformity: **Not evaluated**.

## Parent browser verification (2026-11-17)

Real browsers against the local Storybook (`molecules-selecttile--text-only`, `--text-only-narrow`, `--text-only-rtl`, and `--single` for preservation) at 640px and 320px. No defects were found in the browser pass. The two corrections made earlier (L2 in `odd/tasks/select-tile-text-only.md`) came from the worker's tests: docgen concatenating branch `@default` tags, and `min-h-11` being 35.2px.

| Check | Chrome 157 (Playwright MCP) | Edge 157 (headless CDP) | Firefox 160 (WebDriver BiDi) |
| --- | --- | --- | --- |
| Minimum tile height ≥ 44px (label-only disabled tile) | 44.8px | 44.8px | 44.8px |
| No image or aspect-ratio wrapper in text-only; `single` keeps its media | Pass | Pass | Pass |
| Label, meta and badge text never intersect the check (LTR and RTL; check mirrors to the left in RTL) | Pass | Pass | Pass |
| No overflow, including the unbroken long label in the narrow story | Pass | Pass | Pass |
| Text order label → meta → badge; clicking an enabled unselected tile selects it | Pass | Pass | Pass |

Forced colors, zoom and reduced motion were **not evaluated** in a browser. Placement next to Radix's hidden native input inside forms is covered by the packed-consumer SSR test.

### Captures

Playwright MCP, Chrome 157, device scale, 640px viewport.

| File | SHA-256 |
| --- | --- |
| `captures/vis-01-text-only-chrome-640.png` | `2b45f61d914ab4b61de6783d46c2c08e94b5ecc81cbbcc54ed95f29bc6d365ed` |
| `captures/vis-01-text-only-narrow-chrome-640.png` | `c5346ea578c32c133a26b8e60aa53f8a96cd11bc1f7db06a6cbf2e39710fbb98` |
| `captures/vis-01-text-only-rtl-chrome-640.png` | `74d36166f8fb14659785099c0505f4b54175435cb044492cb955d49d62370ac5` |

These are implementation captures, not approved expected-design references.
