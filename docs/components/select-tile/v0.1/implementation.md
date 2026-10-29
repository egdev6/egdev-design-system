# SelectTile v0.1 implementation

## Authority and scope

- Contract: [#101 v0.1](https://github.com/egdev6/egdev-design-system/issues/101), canonical payload SHA-256 `78356a31ede931e59e6fc84b717e90f0eac938a178a97e982dc26a0340fbe24d`.
- [Full-contract approval](https://github.com/egdev6/egdev-design-system/issues/101#issuecomment-6251555076) approves the identified snapshot, not runtime or visual conformity.
- [Owner-approved amendment A1](https://github.com/egdev6/egdev-design-system/issues/101#issuecomment-6505015286): `value` and `defaultValue` use `@control false` in both branches. Each reason explains the mode-dependent `string` / `string[]` type and points to Single, Multiple and Controlled. Runtime API is unchanged.
- Implementation authorization: delegated molecules-build T14, S1–S4 and the explicit continuation after A1. Dependencies were installed by the parent; this implementation changes no dependencies or tokens.
- Six meaningful files in `packages/ui/src/molecules/select-tile/`. **No stylesheet.** No additional internal modules.

## Decisions implemented

| Decisions | Implementation |
| --- | --- |
| D1–D5 | Data-driven collection with Radix RadioGroup in single mode and ToggleGroup in multiple mode. Native empty buttons stretch over passive sibling media and captions, named/described by generated IDs. No parallel selection state. Single reactivation does not clear; Enter does not activate or submit. |
| D6–D7 | Six exact ratio presets map to the shared AspectRatio. Images have empty alt; missing/error media repeats the label decoratively. Errors are keyed by option value and image source; stale handlers cannot hide a new source. |
| D8–D12 | Live is independent of selection and requires consumer badge copy. Unmodified brand/solid Badge, exported Surface recipes for card/well, selected underline and approved token typography. No copied atom recipes or shipped fallback asset. |
| D13–D14 | Horizontal looping Radix navigation with ltr/rtl direction; default two-column layout. Native form name/required only in single mode; multiple has no hidden form controls. |
| D15 | Selected fill wins over hover. Explicit live+selected variants retain live border/glow. The separate stretched control owns the full-card focus ring, outside media clipping. Disabled opacity applies to the card only. Reduced-motion utilities remove transitions/transforms. |
| D16–D17 | No ref, asChild, children renderer or per-part override API. Root className supports margin, width, columns and parent layout, merged through cn. Internal CVA and hook are not public exports. No stylesheet. |

Consumers own non-empty names/unique values, valid selections, at most one live option and meaningful live badge text. The component does not prune, repair or validate consumer option data, or emit selection callbacks on prop changes. Long labels and metadata wrap.

## Integration

- Package exports: SelectTile plus SelectTileProps, SelectTileType, SelectTileRatio, SelectTileOption and SelectTileThumbnail only.
- Production scanning adds the additive molecules `types.ts` source glob. The existing recursive Storybook stories glob already discovers molecules; native-prop filtering and preview story layout scanning are extended.
- Storybook title: `Molecules/SelectTile`. Twelve contract scenarios, no manual argTypes or play functions. Real docgen and registered extraction/enhancer/inference regressions cover A1 and zero owned diagnostics.
- Both exact package export inventories and the packed runtime-key list are extended. Packed fixtures import real public types, include negative API assertions and exercise SSR/client selection, passive media and error fallback. Packed execution belongs to the parent.
- Registry usages reuse accessible-name, choice-options, primary-value, initial-uncontrolled-value, interactive-value-change, selection-cardinality, aspect-ratio, option-metadata, preview-thumbnail, live-presentation and thumbnail-badge. Option value/label usages bind SelectTileOption separately. No convention, approval or exception changes. Native-equivalent fields require no new convention.
- Reviewed naming evidence: whole-file `types.ts` SHA-256 `211e99db0425c209a04027efabb575be4218bf621dc10ad9b3ac39c1183c2c92`. Generated naming and catalogue views are regenerated from their sources.

## Observed validation

- RED: after resolving the initial missing-module bootstrap, the empty component/hook scaffold failed all 19 initial behavior tests: missing named controls, absent required validity and incorrect ratio mapping.
- GREEN: the same focused suite passed all 19 tests after implementation. Triangulation added stale-source callbacks, option removal/reappearance and multiple disabled cases; the final component suite has 22 passing tests.
- `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/select-tile packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2`: 249 passed. Initial metadata expectations were corrected for installed union ordering, enum default summaries and all barrel inventories.
- `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck`: passed; earlier test-fixture union spreads were corrected without casts.
- `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint`: passed; earlier formatting/import findings were fixed only within scope.
- `pnpm props:docs`: regenerated the view.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`: regenerated both catalogue views, 110 rows; disabled bytecode output to avoid unrelated generated files.
- `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm props:check`: valid and fresh.
- `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props`: 87 passed.
- `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm build`: passed. The initial `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-exports` run passed 50/51 and exposed an omitted multiple-root role mapping: toolbar instead of the promised group. A focused regression then reproduced that failure (21/22), and passed 22/22 after the supported Radix role override was added.
- `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G bash -c 'pnpm build && pnpm test:package-exports'`: rebuilt after that fix; 51/51 passed, including 116 reachable declaration files, exact runtime/type export inventories, emitted has/live selectors, state-shadow ordering, retained legacy layers and built-package SSR semantics. This repair required a second build/export pass; no packed suite was run.

ToggleGroup 1.2.1 defaults its multiple root to toolbar (`packages/ui/node_modules/@radix-ui/react-toggle-group/dist/index.mjs:32`) but spreads its supported root props after that default. SelectTile explicitly supplies the contract's group role; no new role/API decision or keyboard handler is introduced. Tailwind emits arbitrary descendant selectors as `:has(:is([data-state=...]))`, and token utility values may include fallbacks; export tests check actual emitted syntax.

Radix's radio focus task runs asynchronously while an arrow is held: tests press, allow its focus task, then release. The only browser-API stub is ResizeObserver for Radix's hidden-input measurement in jsdom; keyboard, selection, focus and ARIA are not mocked. Radix may emit single-mode bubble inputs during SSR before knowing whether the button is inside a form; they remain Radix-owned.

## Remaining evidence

Visual conformity against VIS-01/VIS-02: **Not evaluated**. No browser/Storybook server, screenshots, screen-reader assessment, computed cross-browser cascade, contrast, zoom/coarse-pointer checks or actual Controls-widget inspection were run. CSS/export checks establish emitted utilities and legacy layer ordering, not visual parity. React 18/19 packed-consumer execution and full delivery gates remain with the parent. No Git terminal actions or PR publication were performed.
