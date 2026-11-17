# Button v0.4 implementation evidence

## Authority and scope

- [Approved label-wrap amendment](label-wrap-amendment.md): the canonical UTF-8 payload from `## 1. Purpose and scope` through the final newline has SHA-256 `ba6ba63bfe0c185c022cfcc4a0617c4e5961c05acb84b725dfed42706d75650a`. Header tracking metadata remains historical and excluded from the hash.
- The owner-approved [implementation plan](../../../../odd/tasks/button-label-wrap.md) covers T1 / S1–S7 and resolves the supported plain-text and compatible slotted-link scope, the attached-group caution, and the shared naming ID. Request: [#422](https://github.com/egdev6/egdev-design-system/issues/422); canonical Button issue: #53. This evidence is not an independent review or visual approval.
- The existing six-file component structure and public exports remain. No stylesheet, new module, token, dependency, ButtonGroup or IconButton implementation change was added.

## Implementation

`labelWrap` is an optional boolean, default false, consumed before native or Slot props. The unchanged base retains `whitespace-nowrap`; the true CVA branch selects `whitespace-normal wrap-anywhere text-center`, merged through `cn`. Existing size minimums and padding are unchanged. Supported text is plain label text or a compatible slotted link with plain text; richer children are best effort. Avoid the option in attached ButtonGroups, which require matching heights. Consumers must provide a feasible width and must not clip the focus ring.

The [registry](../../../../skills/_shared/prop-naming.json) reuses the existing approved `control-label-wrap` / `labelWrap` convention with a new Button usage and refreshed whole-file Button source evidence; it adds no approval. Storybook adds `LabelWrap` and `LabelWrapStates` without manual argTypes or play functions. The packed-consumer fixture includes typed positive and negative examples, separate native/link SSR assertions and shipped CSS checks; that fixture has not been run in this worker.

## Observed checks

- **RED:** the authorized focused Vitest command failed with 10 tests failing and 575 passing. The three size cases, both icon/spinner placement cases, and native and slotted activation cases lacked the wrap utilities; real Button docgen had seven rather than eight own props, and the two Controls assertions found no `labelWrap` row. A separate pre-implementation capture recorded the Collapsible Trigger class SHA-256 for exact preservation.
- **GREEN:** the same focused command passed 585/585 tests across seven files. The omitted/false comparisons cover all four variants and all three sizes; wrapped tests cover minimums, padding, names, decorative icon/spinner order, native and Slot attributes, refs, keyboard/handlers, disabled/loading guards, recovery and supported layout merges. The unchanged Collapsible Trigger matches its pre-change class hash. The preview CSS test compiles the actual entry in memory and checks the three utility declarations and the static Button CVA branch.
- `pnpm typecheck`: passed for root and workspace packages. Biome passed on all 12 supported changed files after formatting corrections.
- `pnpm props:docs && pnpm props:check && pnpm test:props`: passed; generated view current, registry valid, 122 tests passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`: passed, generating 115 rows and both catalog outputs.
- `pnpm system:check`: initially reported `packages/system/system.md` stale against the committed artifact. `pnpm system:docs` regenerated the reference and a subsequent `pnpm system:check` passed. This checks the Markdown against the existing `packages/system/design-system.json`, not that the JSON artifact reflects current source; the artifact still lacks Button's new usage and requires separate regeneration and validation.

## Remaining verification

The parent owns the full suite, build, packed React 18/19 consumer matrix and real-browser checks. In Chrome, Edge and Firefox, verify constrained spaced and unbroken labels at all sizes and 200%/400% zoom: computed wrapping, growth/minimum height, no clipping or horizontal overflow, icon/spinner placement, full-box hit testing and focus ring. Verify native Enter/Space and slotted-link Enter, loading/disabled recovery, reduced motion, Material parity, and actual Storybook Controls widgets. Capture the implementation before merge. VIS-01 has no approved expected-design reference or comparable conditions; visual conformity is **Not evaluated**.

## Parent browser verification (2026-11-17)

Real browsers against the local Storybook (`atoms-button--label-wrap` and `--label-wrap-states`) at 640px and 320px, plus RTL in Chrome. No defects were found. The parent also regenerated the system artifact (`pnpm artifact --write`, then `pnpm system:docs`; `pnpm system:check` exit 0), so `labelWrap` is now listed in `packages/system/design-system.json` and `system.md`.

| Check | Chrome 157 (Playwright MCP) | Edge 157 (headless CDP) | Firefox 160 (WebDriver BiDi) |
| --- | --- | --- | --- |
| Wrapped labels grow the box (2–3 lines) and never go below the size minimum (sm 32px, md 38.4px, lg 44.8px) | Pass | Pass | Pass |
| No overflow, including the unbroken long label | Pass | Pass | Pass |
| Whole box clickable: `elementFromPoint` 1px inside all four edges hits the button (or the `asChild` link) | Pass | Pass | Pass |
| Start/end icon and loading spinner vertically centered on the multi-line label | Pass (delta 0) | Pass | Pass |
| Focus ring around the grown box, no clipping ancestor | Pass (real keyboard `:focus-visible`) | Pass (no clipping) | Pass (no clipping) |
| RTL | Pass | Not run | Not run |

Attached ButtonGroups are documented as unsupported for `labelWrap` (owner decision); they were not measured. Zoom, forced colors and reduced motion were **not evaluated** in a browser.

### Captures

Playwright MCP, Chrome 157, device scale, 640px viewport (stories constrain the host width).

| File | SHA-256 |
| --- | --- |
| `captures/vis-01-label-wrap-chrome-640.png` | `d46f5e69c590babb5f67042da1a848f78723844c6456d768ccab9229790e6e6f` |
| `captures/vis-01-label-wrap-states-chrome-640.png` | `3ea18bd5e563bbeac9971232316b2e330dddb1e8b40770057348f1c75222f317` |

These are implementation captures, not approved expected-design references.
