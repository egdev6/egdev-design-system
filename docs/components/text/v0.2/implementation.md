# Text v0.2 implementation evidence

## Authority and scope

- The approved Text body and foreground amendment was read from `/home/egdev/proyectos/eds-wt-c/docs/components/text/v0.2/body-tone-amendment.md`; its canonical UTF-8 payload from `## 1. Purpose and scope` through the final newline has SHA-256 `8dc92d7052a5e2c70e6d54097d9d1b0abd1b8fa600253d021493ea5ff3842667`. Its approval section records the owner's 2026-11-17 delegation to apply the recommended choices. The amendment is expected from PR #442 and is not copied into this branch. Request: [#396](https://github.com/egdev6/egdev-design-system/issues/396); canonical Text/Heading issue: [#108](https://github.com/egdev6/egdev-design-system/issues/108).
- The parent-approved implementation task covers T1 / S1–S7. The [scoped naming receipt](foreground-exception-approval.json) records the separate `exception:surface-material-tone:Text:foreground` approval and the reviewed source revision. This evidence is not independent review or visual approval.
- No stylesheet, new internal module, token or dependency was added; Heading and legacy CSS remain unchanged.

## Implementation

Text adds `body`, `body-large` and `lede` with a separate static CVA recipe, native `strong` emphasis and a body-only `foreground` selection. Omitted or invalid foreground inherits; untyped accent inputs are ignored on body recipes, and untyped foreground is consumed and ignored on older recipes. Warning and danger do not create status semantics. `TextForeground` is exported; exhaustive consumer switches over `TextVariant` may need new cases.

The original eyebrow and title class strings and `textVariants` recipe remain unchanged; the existing map's TypeScript `satisfies` constraint excludes the newly added body variants. Heading's classes and the system artifact's `typographyRoles` remain unchanged. The registry retains the existing Text `tone` usage alongside the approved component-scoped `foreground` exception, widens Text's `visual-treatment` usage and refreshes all Text/Heading source revisions. The catalog and system artifact/reference were regenerated from their existing generators.

`BodyRecipes`, `Emphasis`, `ForegroundMatrix`, `StatusCopy`, `BodyAsChild` and `BodyLongText` demonstrate the new choices without manual argTypes or play functions. Consumers own contrast and non-color status cues: surface-0…3 support the documented explicit dark-host choices; flood uses inherit or on-flood; deep uses inherit or default. Translucent hosts must be checked against their actual underlying pixels.

## Observed checks

- **RED:** `pnpm exec vitest run packages/ui/src/primitives/text packages/ui/src/lib --maxWorkers=2 --no-cache --configLoader runner` exited 1: 26 failures, 625 passes. Body recipes fell back to eyebrow, untyped foreground leaked to the DOM, and real docgen/Controls lacked the new choices. The untyped body-accent guard happened to pass on the old code because unknown body variants fell back to eyebrow; the final test also requires the actual body recipe.
- **GREEN:** the same focused command exited 0: 653 tests passed across 34 files. This includes native/Slot reading order and whitespace, all foregrounds and rerender, untyped boundaries, previous Text classes and five pre-change Heading class hashes, real docgen/installed Controls, and an in-memory compilation of the actual Storybook preview CSS including the escaped `strong` selector and token declarations.
- `pnpm typecheck` exited 0 after correcting an existing story spread to discard the new body-only prop when forcing a hero variant. Positive and negative source type fixtures passed.
- `pnpm exec biome check` on the changed supported source, test, registry and receipt files exited 0 after formatting corrections.
- `pnpm props:docs && pnpm props:check && pnpm test:props` exited 0; 123 tests passed, including the scoped receipt, prior approval history and all ten reviewed Text/Heading source usages.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` exited 0 and generated 115 rows. `pnpm artifact --write && pnpm system:docs && pnpm system:check` exited 0. Comparison with the base artifact confirmed identical `typographyRoles`; the new Text foreground row is present and Heading has none.

## Remaining verification

The parent owns the full suite, build and packed React 18/19 consumer checks; the new package export, SSR, CSS and positive/negative TypeScript fixtures have not been run here. Preview CSS compilation is not proof of shipped package CSS or consumer rendering without Tailwind.

In Chrome, Edge and Firefox, inspect real component and Storybook Controls widgets; compare computed font family, size, weight, line height, casing and native strong weight for each recipe, including Slot and whitespace. Measure actual foreground/background contrast at normal text size on solid surface-0…3, flood and deep, and on real translucent overlay/grafito/show compositions; verify inherited host colors, status wording/icons and 200%/400% zoom/reflow. Do not change tokens for a contrast failure; report it to the owner. Capture implementation images with provenance and comparable conditions. The expected-design references remain pending, so visual conformity is **Not evaluated**.

## Parent browser verification (2026-11-17)

Storybook (`primitives-text--foreground-matrix`, `--body-recipes`, `--emphasis`). No defects; no token change needed.

| Check | Chrome 157 | Edge 157 | Firefox 160 |
| --- | --- | --- | --- |
| Contrast of every foreground on surface-0…3 and flood (22 texts; effective background = nearest opaque ancestor, no gradient overlay present) | min 4.82:1 (danger on surface-3); muted on surface-3 5.32:1; flood 5.31:1 | min 4.82:1, 0 below 4.5:1 | min 4.82:1, 0 below 4.5:1 |
| Body recipes: Barlow, 12.8/20.48px 500 (body), 16/25.6px 500 (body-large), 16/25.6px 400 (lede), no uppercase | Pass | — | — |
| `strong` emphasis weight 700 over 500/400 body | Pass | Pass | Pass |

| Capture | SHA-256 |
| --- | --- |
| `captures/foreground-matrix-chrome-1100.png` | `f9e9a7116abf406a0db86db692dcbc67f8a27867e3acdb467eb77e03ab2fe95b` |

Implementation capture, not an approved expected-design reference. Zoom, forced colors and translucent compositions beyond the matrix were not evaluated.
