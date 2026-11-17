# Panel v0.3 compact band heading implementation evidence

## Authority and scope

The [approved amendment](band-heading-amendment.md) and `odd/tasks/panel-band-heading.md` T1/S1–S7 authorize this implementation. The amendment's canonical UTF-8 payload from `## 1. Purpose and scope` through its final LF has SHA-256 `17fe2e116544db6e2736217d54c6ee84c4624de824eaa5b8ace9a07770043ded`; the whole file has SHA-256 `742e9e09ff061bc59799bdeff83124dd061e1a7320c76e46e9f2d99952355101`. The Approval section supersedes historical Pending language in the header. Request: [#424](https://github.com/egdev6/egdev-design-system/issues/424).

The [scoped naming receipt](heading-foreground-exception-approval.json) binds the Heading-only `foreground` exception and pins the earlier Text and Dialog receipt bytes. It does not constitute independent review or visual approval. No stylesheet, internal module, token or dependency was added.

## Implementation and decisions

`Heading variant='compact'` is opt-in, retains the native level and caller-provided ID, and composes inside the existing free `PanelHeader`; Panel props and markup do not change. `TitleVariant` and Text's variant domain remain unchanged. Exhaustive downstream handling of Heading variants may need a compact case. Old Heading recipes, accents, defaults and markers remain unchanged.

The compact recipe deliberately pairs existing `text-heading-small` size, line-height, weight and tracking metrics with `font-display` and uppercase. This is the approved **closest-token substitution**, not proof of an exact design match. Foreground defaults to inheritance and shares Text's seven token mappings and host/contrast restrictions. Untyped compact accent/tone inputs are ignored; invalid foreground inherits. Untyped foreground is consumed on all other Heading variants. Warning and danger add no status or announcement semantics.

`Compact`, `CompactForeground` and `CompactBandHeading` demonstrate the public recipes, supported host colors and consumer-owned region associations. The Panel story includes surface-1, floating overlay and inherited raised hosts, with a right-to-left layout. No manual argTypes or play functions were added. The naming registry records the scoped exception and refreshed whole-file evidence; catalog and system outputs were regenerated from their existing generators.

## Observed checks

- **RED:** `pnpm exec vitest run packages/ui/src/primitives/text packages/ui/src/molecules/panel packages/ui/src/molecules/section-header packages/ui/src/lib --maxWorkers=2 --no-cache --configLoader runner` exited 1 before implementation: 28 failed, 724 passed. Compact fell back to section, untyped foreground leaked, compact accent was retained, and docgen/Controls lacked the new values.
- **GREEN and preservation:** the same command exited 0: 754 passed across 39 files. It covers six ranks and IDs, default h2, all foreground mappings, invalid and untyped input, two `useId` regions in one Panel for all three tones, markers, previous Heading class hashes, Text and SectionHeader behavior, real docgen and installed Controls. The exact packed Heading type fixtures also compile in memory against the public source barrel; this is not packed-distribution evidence. In-memory preview CSS compilation found the display font and all four compact metric variables. An intermediate check caught Tailwind's nested fallback variables; the assertion was corrected to inspect the containing declaration.
- `pnpm typecheck`: exit 0, including source-level positive and negative combinations.
- `pnpm exec biome check` on the 16 changed supported source, test and JSON files: exit 0 after formatting corrections. Generated Markdown, Python and minified system JSON are not represented as formatted by Biome.
- `pnpm props:docs && pnpm props:check && pnpm test:props`: exit 0; 127 tests passed, including both immutable prior receipts and the new scoped approval.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`: exit 0; 116 rows generated.
- `pnpm artifact --write && pnpm system:docs && pnpm system:check`: exit 0. `node --test scripts/design-system-artifact.test.mjs`: exit 0; 31 tests passed, including the compact role's display family and metric tokens and the existing Text body recipes.

## Remaining verification

The packed-consumer fixture contains positive `HeadingProps`, negative combinations, native rendering and shipped CSS checks for the four metric variables. The build and packed React 18/19 consumption/export checks were not run by this worker: the authorized build includes `packages/tokens/vite.config.ts` with `emptyOutDir: true`, which deletes and rewrites `packages/tokens/dist` outside the delegated edit surfaces. The parent owns that build and packed matrix, and the full `pnpm test`. Preview CSS compilation is not proof of shipped package CSS or rendering without Tailwind.

The parent must verify real components and Storybook Controls in Chrome, Edge and Firefox. Inside surface-1, overlay and inherited banded Panels, compare computed font family, size, weight, line-height, tracking, uppercase and inherited/explicit color, including actual translucent backgrounds and legacy CSS. Check native rank, caller-owned region names and unique IDs, all foreground host/contrast restrictions, non-color status cues, narrow wrapping, RTL and 200%/400% zoom/reflow. Record implementation captures with browser, viewport, DPR, font, theme and other provenance. Expected-design references remain pending, so visual conformity is **Not evaluated**; a failure of the closest-token substitution requires a separate token decision rather than invented values.

## Parent browser verification (2026-11-17)

Storybook (`molecules-panel--compact-band-heading`, `primitives-heading--compact`, `--compact-foreground`). No defects.

| Check | Chrome 157 | Edge 157 | Firefox 160 |
| --- | --- | --- | --- |
| Compact heading metrics inside banded Panels (surface-1, overlay, RTL): Barlow Condensed, 19.2px, line-height 23.04px, weight 700, uppercase via CSS | Pass | Pass | Pass (line-height 23.03px, sub-pixel rounding) |
| Unique `useId` ids; each region labelled by its compact heading; RTL band mirrors | Pass | Pass | Pass |
| Seven `foreground` mappings apply their tokens (inherit, default, secondary, muted, warning, …) | Pass | Pass | Pass |
| No overflow | Pass | Pass | Pass |

Token pairing (approved closest-token substitution: `text-heading-small` metrics with the display font) reviewed visually in the capture: it reads as a compact band heading, so no new token is proposed. Zoom and forced colors were not evaluated.

| Capture | SHA-256 |
| --- | --- |
| `captures/compact-band-heading-chrome-900.png` | `4e6aa7344697b0e56505c3dda9254430457c5590549834b2dc1c5c01c44c0394` |
