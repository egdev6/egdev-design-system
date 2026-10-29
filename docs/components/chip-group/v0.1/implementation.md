# ChipGroup v0.1 + A1 implementation evidence

## Authority and scope

- Contract: [#81 v0.1](https://github.com/egdev6/egdev-design-system/issues/81), interpreted through the [full-contract approval](https://github.com/egdev6/egdev-design-system/issues/81#issuecomment-6251495380). Canonical payload SHA-256: `d6ca8111292d7ea8a8241ade56a89de92516c73fd22d48adbb827c92778b2438`; frozen body: `9674e8d7970c6e31260fc7d05dec985922b8dd7e073d99e33d5557fa7e31c44f`. Historical Draft/Pending headers do not supersede approval.
- [Owner-approved amendment A1](https://github.com/egdev6/egdev-design-system/issues/81#issuecomment-6503699329): Storybook metadata only. Both `value` and `defaultValue` declarations in both branches use `@control false`, with the mode-dependent `string` / `string[]` reason pointing to Single and Multiple. Runtime API, selection and other directives are unchanged. No metadata adapter or manual argTypes.
- Implementation authorization: the parent explicitly delegated complete implementation under `odd/tasks/molecules-build.md`, T6, S1–S4, then authorized resuming with A1. This records the scoped parent instruction, not an independent approval receipt. Base `origin/main` at `d428967`; parent-installed `@radix-ui/react-toggle-group` 1.2.1 committed at `47251ca`. No other dependency or token change.
- Worktree: `chip-group`, branch `feat/81-chip-group`. The untracked coordination document is read-only and unchanged. No Git commit, merge, staging or remote mutation is part of this implementation.

## Decisions implemented

| Decisions | Implementation |
| --- | --- |
| D1–D2 | Individual Radix ToggleGroup package owns interaction. Items compose exported `chipVariants` through `cn()`; they never nest Chip or another Toggle. Chip is already merged on main. |
| D3–D4 | Required single/multiple discriminator. Single items retain Radix radio/checked semantics in a named group; activation can clear with `''`. Arrows only move focus. |
| D5–D7 | Ordered standard options with string labels and hidden decorative icons. Mode-specific controlled/uncontrolled props pass directly to Radix. Required label names the root; no visible heading or auto-selection. |
| D8 | Fixed horizontal axis, wrapping `gap-2`, roving focus and looping. Home/End and RTL remain Radix behavior, not custom keyboard handlers. |
| D9 | No form name, required flag, hidden inputs or submission API. Items remain native type=button. |
| D10–D11 | Shared Chip raised-pill geometry and Material recipe. Root/option disabled inputs are delegated to Radix; item opacity occurs once and never on the root. Selection is retained. |
| D12 | On-state underline with `--border-width` thickness and `--space-1` offset adds a non-color cue. |
| D13 | Empty options produce an empty named group. No duplicate/unknown-value normalization, auto-clearing, domain validation or callbacks on option removal. Consumers own valid data. |
| D14 | Unpainted root layout; shared Chip material only. No copied Surface recipe or extra box. |
| D15–D16 | No ref/asChild escape hatch, item subcomponent, stylesheet or extra internal module. Six meaningful files; utilities only in types.ts CVA. |

### Composition and supported overrides

Root `className` merges last for margins, width and parent flex/grid placement. Tests check conflicting layout widths, stable markers and item isolation; arbitrary appearance overrides are unsupported. Item and icon classes are owned and composed separately with `cn()`. `twMerge` only resolves recognized utility conflicts; it cannot guarantee arbitrary CSS or legacy-selector precedence.

The shared Chip recipe supplies the sheen, edge, active gradient/glow and selected-focus shadow. Group-owned additions are the underline, reduced-motion transition reset, disabled cursor and disabled active transform/translate/scale guards. Disabled pointer events come from Chip, preventing pointer hover/press activation. Legacy `.eg-chip` and consumers remain unchanged; no `.is-*` output.

Root native id/title/data attributes, descriptions and compatible handlers survive forwarding. Runtime filtering protects owned role, name, content, tab configuration, fixed keyboard settings, ref/asChild and unsupported form props from untyped injection. No selection state, keyboard recreation or generated ids are added.

## Integration and naming

- Public exports only: `ChipGroup`, `ChipGroupProps`, `ChipGroupType`, `ChipGroupOption`. Hook and group CVA helpers stay internal. Both sorted package-export inventories and the packed runtime-key inventory include the new API.
- Production CSS adds only the component's exact types.ts source. Existing Storybook discovery already matches molecules; native docgen allowlisting and the preview's story-layout source are additive.
- Stories: Multiple (required args only), Single, WithIcons, ControlledSingle, ControlledMultiple, DisabledOption, DisabledGroup, Wrapped, RTL, Empty. Decorative arrows need no new glyph or dependency. Wrapped supplies supported root width through Storybook-only layout scanning.
- Registry usages reuse `accessible-name`, `primary-value`, `initial-uncontrolled-value`, `interactive-value-change`, `choice-options`, `selection-cardinality` on ChipGroupProps; nested ChipGroupOption reuses `accessible-name`, `primary-value`, `leading-icon`. Native disabled/direction and className add no convention. No convention text, aliases, exceptions or approval changes.
- Reviewed source: `packages/ui/src/molecules/chip-group/types.ts`, whole-file SHA-256 `91398445d28ea34d62c8a9c078990ca57e67784af09b0709e0f470a641174252`. Generated naming and catalogue views are regenerated, not hand-edited. Post-receipt filtering preserves historical approval content.

## Acceptance evidence

| Criteria | Automated coverage | Remaining evidence |
| --- | --- | --- |
| AC-01–AC-04 | Named group, ordered options/decorative icons; both modes' activation payloads, clearing, controlled updates, ignored callbacks and changed defaults. | Screen-reader/browser verification not evaluated. |
| AC-05–AC-07 | Tab/Shift+Tab, loop, Home/End, RTL, disabled-option skipping, Space/Enter, no arrow selection; empty/all-disabled groups; public type assertions and 14 packed-fixture type negatives. | Actual packed React 18/19 execution belongs to the parent. |
| AC-08–AC-10 | Hook recipe/underline/motion/disabled assertions; emitted CSS checks include wrapping, token underline and shared Chip focus/coarse/motion rules. | Pixel parity, computed focus/opacity, coarse-pointer geometry and media behavior not evaluated. |
| AC-11–AC-12 | Native forwarding, form passivity, owned semantics, root/part merge isolation, source SSR; build/export checks plus packed SSR/CSR/CSS fixture additions. | Packed native/Tailwind consumers and full gates belong to the parent. |
| AC-13 | AST covers 16 declarations; real docgen and installed registered extraction/enhancer validate eight own rows with zero diagnostics, requiredness and real defaults. A1 stays visible as disabled Controls rows. | Browser Controls widgets not evaluated. |

The focused type test compiles the exact ChipGroup section of the packed fixture against the public source barrel entirely in memory. It validates fixtures now without running installers or claiming compiled-declaration/packed-consumption evidence.

## Observed validation

All tests run foreground under MemoryMax=2G; no Storybook, watcher, browser or packed-consumer suite was run.

- RED: initial suite failed to resolve the absent component. With a null-rendering component stub, 16 behavior tests failed on missing group/items/SSR while the hook composition check passed. This is the observed behavior-level RED.
- GREEN: after real Radix JSX, the original 17 tests passed. Two incorrect test assumptions were corrected: Radix owns the root tab index, and clicking a disabled target affects the user-event tab starting position; keyboard entry is checked before that click.
- TRIANGULATE/REFACTOR: extra single-disabled and public-type coverage plus incoming controlled selection updates; 19 component tests pass. In-memory packed-fixture compilation first caught two callback/discriminator errors; explicitly narrowed fixture constants fixed them without changing the public API.

| Command | Result |
| --- | --- |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/chip-group packages/ui/src/lib/chip-group-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2` | Pass: 4 files, 247 tests. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint` | Pass: 383 files, no fixes. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck` | Pass: root and UI strict TypeScript. |
| `pnpm props:docs` | Naming view regenerated. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm props:check` | Pass: registry and generated view valid. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props` | Pass: 87 tests. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Regenerated both catalogue artifacts, 110 rows; bytecode writes suppressed. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G sh -c 'pnpm build && pnpm test:package-exports'` | Pending final single run. |

VIS-01/VIS-02 identities remain those approved in #81; no replacement screenshot or conformity claim. Visual conformity: **Not evaluated**. Owner review on main, packed consumer execution, full gates, commits, PR and CI claims remain with the parent.
