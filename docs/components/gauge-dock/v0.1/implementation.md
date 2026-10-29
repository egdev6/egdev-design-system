# GaugeDock v0.1 implementation evidence

## Authority and scope

- Contract: [#85 v0.1](https://github.com/egdev6/egdev-design-system/issues/85), read with its [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/85#issuecomment-6251507528). There are no substantive amendments in the retrieved comment history. Historical Draft/Pending headers do not supersede that approval.
- Canonical payload SHA-256: `e56c5110516cbe923dd72851f5316324bc1bb98bdc558f272fb2f5c5978beae8`; frozen body SHA-256: `4bba5012f359f5c91c8f3b44d8530b749ba047dee5b55594ecf659b9a97765f7`; ordered history SHA-256: `cbd64dcebc91be01eb5fb1ef4230129291df059e4ea0fce84ef287985f889513`.
- Execution authorization: the parent delegated complete implementation of T17, S1–S4 in `odd/tasks/molecules-build.md`, based on `origin/main` `d428967`, branch `feat/85-gauge-dock`. The coordination copy is not an implementation artifact and is not edited or committed. The parent owns commits, full gates, packed consumers and PR creation.
- The parent separately installed/pinned `@radix-ui/react-toolbar` 1.2.1 in `eab916f`. No other dependency or token changes are made. Surface, Gauge, Button, IconButton and Icon are already public on this base; no prerequisite component is implemented here.
- Six meaningful files under `packages/ui/src/molecules/gauge-dock/`; **No stylesheet**, no additional internal modules. Public exports are exactly `GaugeDock`, `GaugeDockItem`, `GaugeDockSeparator` and their three prop types. CVA helpers and preparation hooks stay internal.

## Decisions applied

| Decisions | Implementation and functional evidence |
| --- | --- |
| D1, D7 | Radix Toolbar owns role, orientation, explicit direction, entry/exit, arrows and Home/End. Fixed `loop={false}`. Tests cover LTR, RTL, vertical navigation, disabled skipping and bounded endpoints without a custom keyboard engine. |
| D2, D3 | Item renders the direct Gauge untouched, followed by `Toolbar.Button asChild` around the supplied action. Independent meter/button accessibility nodes are DOM siblings, never nested. Tuple cardinality is part of the public type. |
| D4, D5 | Gauge's passive effective v0.10 API is unchanged. Tests cover independent decimals, 0/100 clamping, warning/muted text, unavailable readings and stable focus on updates. No total, threshold, selection or live region is computed. |
| D6, D8 | Required root label names operations; each Gauge and action keeps its own name. Default examples use compact Gauges with 48px Button md or IconButton lg targets. No Dock size axis or child resizing. IconButton names come from AccessibleIcon hidden text. |
| D9 | Only the supplied action's explicit `disabled === true` flag reaches Toolbar.Button. Meter/Item opacity is untouched. All-disabled toolbars remain readable with no enabled action entry; empty arrays/fragments/null/absent content render nothing. Native actions use type button. |
| D10 | `Toolbar.Root asChild` composes the existing `Surface tone="overlay" padding="sm" radius="full"`. No copied Surface recipe or elevation override. Strong hairline, edge, elevation-3 shadow and transparency fallbacks remain Surface-owned. |
| D11 | Radix supplies the perpendicular separator orientation. Decorative separator is explicitly aria-hidden with no tab stop. No public orientation/decorative prop is added. |
| D12 | In-flow inline-flex, one row/column, max dimensions 100%, native overflow scrolling. Host owns placement/stacking/portals. LongStateText demonstrates a constrained root without hiding condition text. |
| D13, D14 | Native action click/Enter/Space and ref composition remain intact. Button retains its own idle/loading data-state. No panel, focus restoration engine, selected/pressed state, timer, animation or Gauge hover treatment is introduced. Real overlay integration remains the overlay owner's responsibility. |
| D15 | JSX-only rendering, typed preparation in `useGaugeDock.ts`, static CVA utilities in `types.ts`, per-part cn(), six files and stable eg-gauge-dock/item/separator markers. No legacy eg-gauge-strip marker or CSS migration. |

### Composition limits

Supply one direct Gauge and one named native-button-compatible action per Item. The action must forward Radix props/ref to one HTMLButtonElement, expose its disabled flag on the supplied element, and use type button. Button/IconButton default native branches and native buttons are supported; links, nested buttons, extra tab stops and opaque disabled wrappers are unsupported. JSX type erasure cannot certify arbitrary custom child DOM at runtime; no universal runtime component detector is claimed. Non-empty root/action names and coherent Gauge text remain consumer requirements.

Root/part className merges last through cn() for outer dimensions, margins, positioning and alignment only. Material/padding/radius and child appearance remain their existing components' APIs. twMerge resolves recognized utility groups, not arbitrary selector/layer semantics; this is not general appearance-override permission. Compatible native ids, data attributes, descriptions and events are forwarded. Protected role/tabIndex/content/orientation attributes are omitted before Radix composition; forwarding even undefined keys would erase Radix defaults.

Before removing/disabling the focused action or unmounting a Dock, consumers must supply their own safe focus fallback. A passive Gauge never receives that focus. Dock opens no overlay; no unavailable overlay prerequisite is invented or imported.

## Naming and Storybook

Only existing approved conventions gain reviewed usages: `accessible-name` → label, `layout-orientation` → orientation. Native dir, tuple/React children and className add no conventions. Gauge's props remain Gauge usages. Source: `packages/ui/src/molecules/gauge-dock/types.ts#GaugeDockProps`, whole-file SHA-256 `892044d2ba68a86b7ebcd73a966662f0b611eac20e8388b6ae90056b267c2a35`. Convention text, approval receipts, aliases and exceptions are unchanged. The generated view and post-receipt usage inventory are updated.

Real docgen and installed extraction/enhancement/inference check required label/children, horizontal default, orientation choices, native ltr/rtl direction, protected APIs and disabled content controllers. Every own public declaration carries English JSDoc and a control directive; ReactNode and tuple content use false with concrete reasons. Owned metadata diagnostics are empty. Native dir is narrowed by picking the existing Radix direction type, not by inventing an own Controls declaration.

Stories: Default, Vertical, RTL, DisabledAction, AllDisabled, IndependentReadings, WithDetailAction, LongStateText and Empty, under `Molecules/GaugeDock`, with autodocs and no manual argTypes/play. Existing recursive Storybook discovery already includes molecules. Production CSS and preview story sources gain additive GaugeDock registration only.

## Test-first and validation

- RED: the behavior suite was written first; its initial focused run failed to resolve the not-yet-created hook/public module. The first integrated implementation then produced 8 failing and 8 passing tests: forwarding undefined protected props removed the toolbar role/entry tabIndex. Omitting those keys fixed the integration.
- GREEN: the same focused command passed all 16 initial tests. Two subsequent cases triangulate untyped semantic protection and public type exclusions/tuple cardinality; all 18 component tests pass.
- Metadata triangulation initially found a test expecting bare horizontal in the Storybook table; the installed renderer correctly reports the string summary as `"horizontal"`, consistent with existing components. The assertion was corrected, without changing the public default or metadata implementation.
- Initial preview-CSS validation could not resolve the not-yet-built `packages/tokens/dist/tokens.css`. After the single authorized build, the same focused command passed all 298 tests, including all 53 preview-CSS tests. No unrelated source change bypassed the build prerequisite.

| Command | Observed result |
| --- | --- |
| `pnpm typecheck` | Pass, including public type assertions. |
| `pnpm props:docs` | Generated view regenerated. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 110 rows regenerated; bytecode writes suppressed outside allowed surfaces. |
| `pnpm props:check` | Registry valid; view current. |
| `pnpm test:props` | 87 passed. |
| `pnpm lint` | Pass; 382 files checked, no fixes. Earlier formatting findings in edited files were corrected. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G bash -c 'pnpm build && pnpm test:package-exports'` | Pass in one foreground run: tokens/UI build succeeded; 51 package-export tests passed, 116 reachable declaration files checked. UI CSS is 252.37 kB. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/gauge-dock packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2` | Pass: 4 files, 298 tests, including 18 GaugeDock behavior/type cases, 99 docgen, 128 Controls and 53 preview-CSS tests. |

Packed React 18/19 fixtures are extended using the real public types: required/unsupported API negatives, independent SSR anatomy, system action refs/activation, disabled skipping, bounded navigation, vertical rerender, focus retention, ref cleanup and shipped native/Tailwind CSS selectors. They are separate from App so existing global action/meter inventories remain unchanged. The packed suite is deliberately not run by this worker; parent full gates remain required. No browser, Storybook server/watch, CI, screen-reader or visual-conformity result is claimed.

## Visual evidence limits

The contract's VIS-01 is the lower-left strip intent only, SHA-256 `edece4df541e7cfc9e9c36005d623a194b973139fa9074d59e2025ae1381f2f9`. VIS-02 is the approved passive-meter/separate-action static specimen, SHA-256 `9290f26b1934f09f9d044ed4dc7b336753e5568eb0461585752dbf5214e275e1`. Neither reference is replaced or represented as a runtime capture.

Visual conformity: **Not evaluated**. Browser accessibility-tree/screen-reader inspection, actual Controls widgets, constrained-host focus-ring visibility, enlarged-text/touch checks, filter-support/reduced-transparency fallback and equivalent-condition visual comparison remain owner/parent review work. Unit roles, emitted CSS and metadata do not prove those checks. AC-11 publication provenance remains the existing contract's historical evidence, not a new asset-publication claim.
