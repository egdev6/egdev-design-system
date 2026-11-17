# Icon v0.3 implementation evidence

## Authority and decisions

- The approved [glyph amendment](download-external-amendment.md) has canonical payload SHA-256 `8ad26aabdc7c98b5a3e42a07e6705663d9e3454dc61e4fb01f40a5cca15562bf` (UTF-8, LF, from `## 1. Purpose and scope` through the final newline; header metadata excluded). The parent-authorized implementation task `odd/tasks/icon-download-external.md` covers T1 / S1–S6; this record is not an independent review or visual approval.
- The selected names and source mappings are Lucide `download` → `download` and Lucide `external-link` → `external-link`, not `external`. The installed `lucide-react` 1.55.0 files `dist/esm/icons/download.mjs` and `dist/esm/icons/external-link.mjs` were inspected directly. Their source-file SHA-256 values are `2c0b6b6a4c192f3735526f152cc1ce213e91690727f8554441f5ca75107d60a8` and `6836187d747f5699b709a81806a7ff2a858dd7da0151ba3ab5ac712e9d1b6241`, respectively. The 24×24 path elements and geometry are copied verbatim; upstream React keys are omitted under the existing descriptor convention. `THIRD_PARTY_NOTICES.md` retains Lucide ISC and the applicable Feather MIT notice for both glyphs. There is no Lucide runtime dependency.
- The closed set now contains 25 Foundation glyphs and 22 Lucide additions. Existing root, preset, fill, passthrough and Radix AccessibleIcon behavior is unchanged; the Gallery derives the new names from the existing descriptor set. No stylesheet, new module, token or dependency is added. The md documentation/token discrepancy remains separately tracked in #428.
- The registry reuses the approved `icon-glyph-name` convention without a new convention or exception. The four Icon usages point to reviewed `IconProps` source SHA-256 `d79cbabf517ae54a0cc78744b8aa3ca19affa18ff51cff1fa9fad1ce75f28921`; the glyph usage records 47 names. Approval content is unchanged.

## Observed checks

- **RED:** `pnpm exec vitest run packages/ui/src/atoms/icon packages/ui/src/lib --maxWorkers=2 --no-cache --configLoader runner` exited 1 before implementation: the new render/rerender and Gallery cases failed, the closed set and docgen/Controls contained 45 instead of 47 names, and the new paths were absent. Overall: 8 failed, 621 passed and 45 skipped. Independently, preview CSS and branding checks failed because `packages/tokens/dist/tokens.css` was absent.
- **After implementation:** the same command exited 1 with 630 passed, 1 failed and 45 skipped across 32 passed and 2 failed files. The Icon, Gallery, real docgen, FieldMessage enum and installed Controls cases passed. The remaining failed branding test and failed preview CSS suite both require the absent `packages/tokens/dist/tokens.css`; no complete GREEN or emitted-CSS result is claimed. An intermediate run exposed the existing FieldMessage 45-name assertion, which was updated to 47.
- `pnpm typecheck`: exit 0 for the root and workspace packages; the focused type tests accept the two names and reject `external`.
- `pnpm exec biome check packages/ui/src/atoms/icon/Icon.stories.tsx packages/ui/src/atoms/icon/Icon.test.tsx packages/ui/src/atoms/icon/icon-paths.ts packages/ui/src/atoms/icon/types.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts scripts/package-consumption.test.mjs scripts/package-exports.test.mjs skills/_shared/prop-naming.json docs/catalog.json`: exit 0, 10 files checked after formatting corrections.
- `pnpm props:docs && pnpm props:check && pnpm test:props`: exit 0; registry valid, generated view current, 122 tests passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`: exit 0; regenerated 115 rows in both catalog outputs.
- `pnpm system:check`: exit 0. This compares `system.md` with the existing JSON artifact, not that artifact with current source. The conditional artifact regeneration was not run because this check did not report staleness.

The changed package-export and packed-consumer fixtures include both glyphs, the rejected `external` alias, SSR and client rerender checks; these package tests and the full build were not run in this worker. The prior 45 descriptors were left unchanged in the source diff.

## Parent browser verification — pending

In Chrome, Edge and Firefox inspect and capture both glyphs in the Gallery and real Storybook Controls: verify selection, distinct shapes, 24×24 geometry, round caps/joins, currentColor stroke and preset sizing, decorative/empty-label behavior and informative labels. Check an existing glyph for regression. Record browser versions, viewport, device scale, theme and capture hashes before merge. No browser, assistive-technology or comparable expected-design reference was evaluated here; visual conformity is **Not evaluated** and VIS-01/02 remain pending owner adoption.

## Parent browser verification (2026-11-17)

Storybook `atoms-icon--gallery` (worktree build). No defects.

| Check | Chrome 157 (Playwright MCP) | Edge 157 (headless CDP) | Firefox 160 (WebDriver BiDi) |
| --- | --- | --- | --- |
| `download` and `external-link` render at the preset size (16×16), `viewBox="0 0 24 24"`, `fill: none`, stroke via `currentColor` | Pass | Pass | Pass |
| Decorative by default (`aria-hidden="true"`), same structure as neighbouring glyphs (e.g. `upload`) | Pass | Pass (same path geometry) | Pass (same path geometry) |

| Capture | SHA-256 |
| --- | --- |
| `captures/gallery-chrome-900.png` | `bae1bdbdf6c7e970240347282cdd1c641424097811b6ca115afbc2c027c66587` |

Implementation capture (Chrome 157, device scale, 900px gallery), not an approved expected-design reference.
