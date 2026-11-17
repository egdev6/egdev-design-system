# Dialog v0.2 container and compact-body implementation evidence

## Authority and scope

- The approved [v0.2 amendment](container-compact-amendment.md) is delivered separately by PR #442. The read-only snapshot supplied to this task has SHA-256 `6b809f230033d7dcca6bd2c90c1241a85e9d53a9a1b97404c4973a69bc16ab31` for the UTF-8 payload from `## 1. Purpose and scope` through the final LF; metadata above that heading is excluded. This branch does not copy or alter that snapshot, so the link resolves after PR #442 lands.
- The parent-applied recommended choices cover T1 / S1–S7 of the [implementation task](../../../../odd/tasks/dialog-container-compact.md), including the new convention and scoped exception recorded in [prop-naming-approval.json](prop-naming-approval.json). This evidence is not independent review or visual approval. Requests: #409 and #421; canonical Dialog issue: #119.
- The six existing Dialog files retain their roles. No stylesheet, extra internal module, token or dependency was added.

## Implementation

`DialogContent` accepts the placement union: null/omitted host with viewport scope, or a ready `HTMLElement` with container or viewport scope. Omitted scope derives from the host; an untyped container scope without a host renders no portal or panel. The Radix portal owns mounting and the modal engine. A container host must be connected, in the same document, positioned, non-scrolling and have definite usable dimensions. Render Content after its ref is ready and close before changing or removing the target. A custom viewport portal is subject to ancestor clipping and fixed-position containing blocks. Neither a bounded overlay nor its host localizes Radix modality: focus, outside hiding and pointer/scroll blocking remain document-wide.

The overlay's static scope variant chooses `fixed` or `absolute`; the existing class ordering is retained for shared default recipes. `bodyPadding='compact'` changes only the body's token padding from `--space-6` to `--space-3`; `Stack` remains responsible for child gaps. Header, footer, Surface paint, body scrolling and public markers remain unchanged. The registry reuses `portal-container`, adds `dialog-overlay-scope`, and grants `bodyPadding` only as a DialogContent exception to `inner-padding`; whole-file Dialog source evidence is refreshed.

Storybook includes `Container`, `ContainerViewport`, `CompactForm` and `CompactLongContent` without manual argTypes or play functions. The package-consumer fixture contains positive and negative placement/padding types and packed CSS checks; the package-export fixture checks the shipped selectors. These fixtures have not been run in this worker and require a fresh package build.

## Observed checks

- **RED:** the authorized focused Vitest command exited 1 before recipe edits: 9 failed and 633 passed across 37 files. New failures showed the portal still under body, untyped container scope falling back to body, compact padding absent, and missing docgen/recipe metadata. The new TypeScript fixtures were present but Vitest does not typecheck them, so a separate compile-time RED was not observed.
- Before editing shared recipes, a second deliberately failing capture recorded SHA-256 class-string baselines: AlertDialog overlay `5555eba62384a77e5a02623fc9286f945a2ff56add76e858db41b7134fde6d65`, AlertDialog body `35e32c4255b8acef72e2dcc93f2623d8c08bbace6a59111c1b82cdb46f840141`, and CommandPalette overlay `aed654be1d10d4a1267ec18b5d79a6899c36a36270ee21aa82456a00c4401932`. The final tests assert those exact hashes.
- **GREEN:** the focused command exited 0, 642/642 tests in 37 files. Real Radix tests cover hosted placement, default/null and viewport paths, blocked invalid input, body-only compactness, focus loop, Escape, scrim dismissal, controlled requests, background `aria-hidden`, focus restoration and prop non-leakage. The real docgen/registered Controls pipeline and in-memory production CSS compilation passed. The first post-implementation run exposed a test expectation about Storybook's quoted string rendering; the test now verifies both the unquoted raw docgen default and the installed pipeline's quoted summary.
- `pnpm typecheck` passed at root and across workspace packages. Biome passed on the 15 changed supported source, test and JSON files.
- `pnpm props:docs && pnpm props:check && pnpm test:props` passed: registry and generated view current, 123/123 tests. `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` passed with 115 rows. `pnpm artifact --write && pnpm system:docs && pnpm system:check` passed.

## Remaining verification

The parent owns the full test suite, build, packed React 18/19 consumer matrix, review and delivery. A separate old-versus-new scratch-worktree differential was not run: the delegated commands do not authorize one and this task is restricted to the supplied worktree. Exact pre-change shared-class hashes and the existing sibling behavior tests are preserved, but they are not that differential.

In Chrome, Edge (including 1.25 device scale) and Firefox, verify host resize and clipping, fixed viewport override and ancestor limits, panel/scrim bounds, long-body overflow with header/footer retained, compact form wrapping at narrow widths and zoom, default/sheet/full/RTL and reduced preferences. Exercise Tab and Shift+Tab, Escape, scrim and close actions, trigger focus restoration, outside hiding and pointer/scroll blocking; verify actual Storybook Controls widgets and manual assistive-technology behavior. Real WebView2 verification in Nexo is optional under the task and remains unobserved. Provide implementation captures with conditions before merge. The amendment has no approved expected-design capture; visual conformity is **Not evaluated**.

## Parent browser verification (2026-11-17)

Storybook (`molecules-dialog--container`, `--container-viewport`, `--compact-form`, `--default`), each opened through its trigger. No defects.

| Check | Chrome 157 (Playwright MCP, real keyboard) | Edge 157 (headless CDP, scale 1 and 1.25) | Firefox 160 (WebDriver BiDi) |
| --- | --- | --- | --- |
| `container`: portal mounted in the host, overlay `position: absolute`, overlay and panel inside the host rect | Pass | Pass | Pass |
| `container` + `overlayScope="viewport"`: overlay `fixed`, covers the viewport | Pass | Pass | Pass |
| `bodyPadding="compact"`: body padding 9.6px (`--space-3`); default 19.2px unchanged | Pass | Pass | Pass |
| Default dialog unchanged: portal in `body`, overlay `fixed` | Pass | Pass | Pass |
| Focus trapped (8 Tabs), Escape closes, focus returns to the trigger | Pass (all four stories) | Not run | Not run (no OS focus in automation) |

Radix modality stays document-wide by design (documented in the JSDoc). Scale 1.25 approximates WebView2; a real Nexo/WebView2 check remains optional.

| Capture | SHA-256 |
| --- | --- |
| `captures/container-open-chrome-1000.png` | `b4b0969cad877d72dc4c77f30fbff8a3c1f3c8504f02b8dc4d308f8acff6098b` |

Implementation capture, not an approved expected-design reference.
