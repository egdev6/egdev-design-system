# Collapsible v0.5 implementation evidence

## Authority and scope

- The approved sibling-actions amendment was read from the separate PR #442 worktree; its canonical UTF-8 payload, from `## 1. Purpose and scope` through the final newline, has SHA-256 `ece44f5ae7a7a27fcbe7c8dfc4e646e1b8bb9c1f2195e520884e3e1626f7d11c`. The whole-file SHA-256 is `f0c73d427ed50c9abf0110b84b6c292d88e8464f008cffccfc6578eb973ff49a`. Its metadata retains historical Pending fields; the Approval section records the delegated decision. This branch does not copy that document.
- The approved T1 plan covers #408, S1–S7. Header is unpainted and has no padding; the existing open Trigger radius and neutral/md Button recipe are retained. No stylesheet, additional internal module, token or dependency was introduced. This evidence is neither independent review nor visual approval.

## Implementation

The optional Header places consumer-owned actions in a separate wrapping sibling after the Trigger or its heading. Root disability does not disable those actions. Content defaults to `padding='md'` and native unmounted presence; `sm` uses `p-2`, while `keep-mounted` retains children with internal Radix forceMount and a closed-state display reset. Retained form controls still participate in submission. Consumers move focus before an external close when needed. Trigger `motion='none'` resets transition, active translate/scale and caret rotation without changing native state; the default Trigger class hash remains `6b60044d6975fbe82a1af8e21206173a38079f3ea1dd0965e1e91dbd74442153`.

The registry reuses `trailing-actions` and `inner-padding`; the [delegated naming receipt](prop-naming-approval.json) separately records `disclosure-presence` and `disclosure-motion`. The six component files remain; examples cover sibling/narrow actions, compact content, retained state, no motion, reduced motion and RTL. Package fixtures exercise named exports, negative types, static CSS and retained SSR but have not been run here.

## Observed checks at handoff

- **RED:** `pnpm exec vitest run packages/ui/src/molecules/collapsible packages/ui/src/atoms/button packages/ui/src/lib --maxWorkers=2 --no-cache --configLoader runner` exited 1: 11 failed and 652 passed across 34 files before implementation. Failures included missing Header, spacing/presence/motion behavior, metadata and CSS.
- **GREEN:** the focused command exited 0 with 664 passing tests across 34 files. The previous run had 663 passing and one failing: Header's own rows were present, but its documented native rows were missing. The continuation added the Header native-prop allowlist in `.storybook/main.ts`; the original exact-row assertion now passes without being weakened. Compiled CSS coverage also verifies the optimized selector grouping, closed-state display suppression and motion resets.
- `pnpm typecheck`: exit 0. `pnpm props:docs && pnpm props:check && pnpm test:props`: exit 0, 123 tests passed after updating historical projections. `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`: exit 0, 115 rows. `pnpm artifact --write && pnpm system:docs && pnpm system:check`: exit 0. Biome checked 18 supported changed files with no errors after the continuation.

## Remaining verification

The parent owns the full suite, build, packed React 18/19 consumer matrix and browser checks. In Chrome, Edge and Firefox, verify narrow and 200%/400% zoom wrapping and focus rings with unequal action widths, RTL order, independent action activation, keep-mounted content absent from the accessibility tree and tab order, state retention, and computed transition/active/caret reset in open and closed states including reduced motion. Inspect actual Storybook Controls. Capture real component zones with provenance and request visual approval; visual conformity is **Not evaluated**. Nexo's eight consumer overrides (AC-08) are outside this repository and require a selector-by-selector consumer audit and WebView2 smoke check.

## Parent browser verification (2026-11-17)

Storybook (`molecules-collapsible--sibling-actions`, `--narrow-actions`, `--keep-mounted`, `--no-motion`, `--rtl`). No defects.

| Check | Chrome 157 (Playwright MCP) | Edge 157 (headless CDP, 320px) | Firefox 160 (WebDriver BiDi, 320px) |
| --- | --- | --- | --- |
| Activating a sibling action leaves `aria-expanded` unchanged; the action is outside the Trigger; Tab goes Trigger → action | Pass | Pass (activation) | Pass (activation) |
| Narrow header (320 and 280px): actions wrap below, no overlap, no overflow | Pass | Pass | Pass |
| `presence="keep-mounted"` closed: content stays in the DOM with `display: none`, Tab skips it; open → `display: block` and `aria-controls` points to it | Pass | — | — |
| `motion="none"`: `transition-property: none`, caret not rotated in either state | Pass | Pass | Pass |
| RTL: actions at the inline end (left) | Pass | — | — |

The eight Nexo consumer overrides (AC-08) are outside this repository.

| Capture | SHA-256 |
| --- | --- |
| `captures/sibling-actions-chrome-800.png` | `5f497c77faa72375d268c20978bf8bb69c4f5a69121e0ac93e42793b929736bd` |

Implementation capture, not an approved expected-design reference. Zoom, forced colors and AT announcements were not evaluated.
