# AppIcon v0.1 implementation evidence

## Authority and scope

- [Approved AppIcon v0.1 contract](spec.md): the UTF-8 payload from `## 1. Purpose and scope` through the final newline has SHA-256 `c9c88ec10543e4056ed1e517706a06e82f1da96366f68d89eb9e7b5101e91ebf`. The tracking metadata above that heading is excluded.
- The spec's Approval section records the owner's delegation to the parent's recommended decisions, including the component plan and scoped naming convention. The delegated work is [T1 / S1–S6](../../../../odd/tasks/app-icon.md); the request is [#410](https://github.com/egdev6/egdev-design-system/issues/410). This evidence is not an independent review or visual approval.
- The source convention's scoped record is [prop-naming-approval.json](prop-naming-approval.json). Existing `brand-monogram`, `accessible-name` and `preset-dimensions` conventions are reused, not reapproved. `identity-image-source` is the separately recorded approved convention.

## Implementation

The passive span composes Radix Avatar and the existing `surfaceVariants` recipe. A required consumer-supplied monogram remains exact; a nonblank source is passed unchanged to Radix and artwork is contained. The label owns the root's named image semantics; blank or missing labels make it decorative. Untyped overrides of the owned semantics, interaction, content and unsupported composition are stripped. The three preset sizes and fallback typography use static token-backed utilities. No stylesheet, extra internal module, token or dependency is introduced; Avatar is unchanged.

The package barrel exports only the component and its two public types. Production and Storybook CSS entries scan their respective component and story sources. Catalog and system artifacts are regenerated. Nine stories demonstrate defaults, sizes, successful and broken images, non-square artwork, naming and composition. Actual browser Controls remain to be verified.

## Observed checks

- **RED:** the focused Vitest command failed before implementation: 13 AppIcon behavior tests failed because the public component was undefined; 598 tests passed, including the existing Avatar suite.
- **GREEN:** `pnpm exec vitest run packages/ui/src/atoms/app-icon packages/ui/src/atoms/avatar packages/ui/src/lib --maxWorkers=2 --no-cache --configLoader runner` passed 616 tests in 34 files. This includes the real Radix image transport stub, loading/error/recovery, emoji monogram, naming transitions, protected and native attributes, sizes, layout merge, passive tab order, real docgen and installed Controls extraction/enhancement. The unchanged Avatar suite passed.
- `pnpm typecheck`: passed for the root and workspace packages.
- `pnpm exec biome check` on the 17 changed supported source, test, configuration and naming files: passed. Generated catalog and system artifacts are checked by their generators, not reformatted.
- `pnpm props:docs && pnpm props:check && pnpm test:props`: passed, 123 tests. The first run exposed a historical projection test that did not account for the new convention; after updating the projection, the complete command passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`: passed, generating 116 rows.
- `pnpm artifact --write && pnpm system:docs && pnpm system:check`: passed.

## Remaining verification

The parent owns the full suite, build, package-export tests and packed React 18.3.1/19.3.0 consumer matrix. The new package fixtures include negative type checks, SSR, client load/error recovery and CSS assertions, but were not run in this worker. A compiled production CSS build and consumption without a consumer Tailwind compiler are therefore not yet observed.

In Chrome, Edge and Firefox, check loading, failure and source changes; exact emoji and ordinary monograms at all sizes; contained non-square artwork, clipping and computed square geometry; Surface Material, token behavior, contrast and fallback legibility; named/decorative accessibility across states, passive tab order and the surrounding button; and actual Storybook Controls widgets. Include browser/assistive-technology inspection where available. Capture the implementation with provenance and conditions. VIS-01 and VIS-02 have no approved comparable expected-design references, so visual conformity is **Not evaluated**.

## Parent browser verification (2026-11-17)

Storybook (`atoms-appicon--*`), Chrome 157 (Playwright MCP). No defects.

| Check | Result |
| --- | --- |
| Sizes sm/md/lg = 25.6 / 32 / 38.4px, radius 9.6px (`rounded-md`), `overflow: hidden` | Pass |
| Image loads with `object-fit: contain`, `alt=""`, fully inside the frame (square and non-square artwork) | Pass |
| Missing and broken image → monogram fallback, centered (offset ≤ 0.7px), contrast 17.02:1 on surface-1 | Pass |
| Named → `role="img"` + `aria-label`; no label → `aria-hidden="true"`, no role | Pass |
| No tab stop: inside a button, Tab focuses the button, not the icon | Pass |

Edge and Firefox were not run for this passive atom; geometry and fallback use the same static utilities and Radix Avatar image loading verified in Chrome. Forced colors and zoom were not evaluated.

### Captures

| File | SHA-256 |
| --- | --- |
| `captures/non-square-image-chrome-800.png` | `d69b93bd25a18d99919ebd587d43ac5812371246f12f24f39cb003f61880b8e4` |
| `captures/sizes-chrome-800.png` | `23c56409f8b35a5ab57d5809d0b2099404b479f53f45d6befa0e173852e9de2b` |
