# Tabs v0.1 implementation evidence

## Authority and scope

- Contract: [#107](https://github.com/egdev6/egdev-design-system/issues/107), **v0.1**, with its [full-contract approval](https://github.com/egdev6/egdev-design-system/issues/107#issuecomment-6251573119). The live issue body and every comment were read; there is no later amendment. Canonical payload SHA-256: `f8cd04a429ec153f4a3db0a46e8aa25f1996a30a11ee46fd63b324d95c7c4f50`; frozen body SHA-256: `e1926d20aca5c265fd3a4ae0170e913f5e3b9fd0100c3b4b153919f9a6238bc6`.
- Implementation authorization: the parent delegated this exact contract, six-file architecture, integration surfaces and test-first execution under the molecules-build task T3, S1–S4. This is delegated implementation authority, not a new owner quote or independent approval receipt.
- Base: `d428967`, branch `feat/107-tabs`. Surface was already merged (`3d7fe50`) and exports the required well recipe. Radix Tabs 1.2.0 is already installed. No prerequisite component, dependency or token was added or changed.
- Six meaningful files under `packages/ui/src/molecules/tabs/`. **No stylesheet.** No internal engine modules. Legacy `.eg-tabs*` CSS is unchanged.
- VIS-01 remains the expected design, not replaced by the implementation: `docs/design/foundation-boards/v2026-10-18/Tabs.png`, SHA-256 `5c99ce8a8ba13d955327a9826f4765d824a65bca3262b3f0d450dcff73bb418a`. Browser and visual conformity: **Not evaluated**; the owner reviews Storybook on main.

## Decisions implemented

| Decisions | Implementation |
| --- | --- |
| D1–D6 | One data-driven component over Radix Root/List/Trigger/Content. Required panel content, controlled/uncontrolled string values, first-enabled initial fallback, horizontal-only automatic activation. No keyboard, focus or ARIA reimplementation. |
| D7–D8 | Own compact counter span, not Badge. Raw numbers including zero, fractions, negatives and uncapped counts; neutral/danger tone applies only to the counter. An explicit whitespace node preserves accessible names such as “Queue 0”. |
| D9–D11 | Underline md/sm heights and padding; segmented ignores size. All triggers use label-default typography. The underline indicator uses the existing glow token; danger uses the approved 14% opacity utility. |
| D12–D13 | The actual segmented Radix List composes `surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' })` without elevation. Tabs CVA adds layout and `p-0.75`, replacing shared `p-0` through cn. Active segments have the approved sheen/surface-3/two-layer shadow; inner radius compiles from radius-md minus token-derived 3px padding. The active+focus-visible shadow rule follows the active elevation rule so focus wins. |
| D14–D15 | Root `eg-tabs` plus flex-column/gap-zero/border-zero/visible-overflow utilities reset legacy row geometry. No legacy part or mirrored state classes. Only the underline list scrolls with a hidden scrollbar. |
| D16–D17 | Surface-free panels use pt-4 and the system focus outline. All owned utility strings live in types.ts CVA, composed per part with cn. No stylesheet. |

The root's last-merged className supports margin, width and grid placement only. It is not a general appearance override; cn only resolves recognized utility conflicts. Parts have no override API. Native div attributes forward to Root; children/defaultValue/dir/onChange are omitted from native inheritance, and defaultValue is reintroduced as the selection prop. No ref, asChild, public parts, orientation or activationMode prop.

Public exports are exactly `Tabs`, `TabsProps`, `TabsItem`, `TabsTone`, `TabsVariant`, `TabsSize` and `tabsVariants`. The hook and part recipes remain internal.

Invalid collections (empty/duplicate item values or no enabled items) are consumer contract violations. The approved contract specifies no runtime exception, normalization or repair policy; none was invented. Persistent panel state belongs to the consumer because inactive child contents unmount, while Radix retains hidden panel wrappers.

## Naming and Storybook integration

Seven existing conventions gain reviewed TabsProps usages: `accessible-name`, `collection-items`, `primary-value`, `initial-uncontrolled-value`, `interactive-value-change`, `visual-treatment` and `preset-dimensions`. `surface-material-tone` gains the counter-specific TabsItem usage. Source: `packages/ui/src/molecules/tabs/types.ts`, whole-file SHA-256 `f495fce0b20fb63177cda01fa64b84bea5e6d65ec2976f3bf4801e7e9aa22615`. No convention, alias, exception or approval changed. The generated naming view and post-receipt regression pairs are updated.

Storybook title: **Molecules/Tabs**. Stories: Default, WithCounts, Small, Segmented, Controlled, Disabled. Default supplies only required inputs. Every owned props/item declaration has English JSDoc and control metadata. Actual docgen and installed extraction/enhancer/inference tests cover seven owned component rows with zero diagnostics, required inputs, enum order, constant-only defaults, derived selection descriptions and permitted native rows. No manual argTypes or play functions. Browser Controls widgets are not evaluated.

The existing Storybook story glob already includes molecules. Production compiled.css and preview.css explicitly scan Tabs types.ts and its stories respectively, mirroring existing atoms. Catalogue composition now records Surface and the owned counter instead of Badge.

## Test-first and acceptance evidence

- **RED:** against an inert div scaffold, all 11 initial behavior tests failed: missing marker, named tablist/tabs/panels and server-selected content. This was an observed behavior failure, not an unresolved import.
- **GREEN:** the real Radix implementation passed all 11 tests. Subsequent hook coverage brings the component suite to 12 tests.
- **Triangulation:** first-disabled and explicit defaults; one enabled item; loop/Home/End/Tab navigation; disabled selection; native form non-submission; fixed controlled values; zero/fractional/negative/uncapped counters; multiple-instance ids; panel mount/unmount probes; segmented size invariance and shared-recipe merge; SSR and native/layout props.
- The initial real implementation exposed a missing counter-name separator, fixed in JSX. It also showed that an unacknowledged controlled pointer selection can be requested by both Radix pointer and automatic focus activation; no deduplication behavior was invented.
- CSS regressions compile the actual production entry **in memory, with write:false and envDir:false**. They verify scanned fractional padding/height/radius, indicator paint/glow, danger opacity, scroll hiding, reduced-motion indicator handling and active focus-shadow order. Initial assertion mismatches were corrected for actual emitted fallback variables, inlined named shadows and enclosing media rules; the final check passes.

AC-01–AC-06 and AC-09 have DOM/interaction evidence. AC-07–AC-08 and AC-10 have class and production-CSS evidence; computed browser layout/focus, 360px overflow, actual media behavior, accessibility-tree inspection and VIS-01 comparison remain unevaluated.

## Observed validation

| Command | Result |
| --- | --- |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/tabs packages/ui/src/lib/tabs-css.test.ts packages/ui/src/lib/tabs-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2` | 5 files, 240/240 tests passed. Includes 12 Tabs behavior/hook tests and the production CSS compile. |
| `pnpm lint` | Passed; 384 files, no fixes. Earlier formatting diagnostics in changed files were corrected. |
| `pnpm typecheck` | Passed. A stale incremental editor diagnostic about the initial missing Tabs module was contradicted by the real compiler; tests now import the local public barrel. |
| `pnpm props:docs` | Naming view regenerated. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 110 catalogue rows regenerated; bytecode output disabled to preserve edit scope. |
| `pnpm props:check` | Registry valid; generated view up to date. |
| `pnpm test:props` | 87/87 passed. |
| `node --check scripts/package-exports.test.mjs` | Passed syntax check only. |
| `node --check scripts/package-consumption.test.mjs` | Passed syntax check only. |

The package-export and packed-consumer scripts gain Tabs export/declaration checks, strict positive/negative types, SSR panel relationships, CSR selection/keyboard/controlled cases, emitted CSS assertions and runtime export-key updates. Tabs fixtures are outside App, preserving earlier button/focus counts. These scripts were **not executed** against packed artifacts here: full build/export/React 18/19 native/Tailwind consumer gates belong to the parent. No packed compatibility, browser, visual, CI or PR result is claimed.
