# Menu v0.1 implementation

## Effective contract and scope

- Canonical contract: [Menu #89](https://github.com/egdev6/egdev-design-system/issues/89), approved v0.1 plus A1 and A2. The later approval comment supersedes the original Draft tracking header, not the substantive contract.
- Approved base canonical payload SHA-256: `953b77dd1b8a427a06224941d9c21880d77c1c192c50b3486d2dbdc4cc010bdd` (identity recorded in the issue approval).
- [A1](https://github.com/egdev6/egdev-design-system/issues/89#issuecomment-6503388947): Enter/Space toggle; ArrowDown opens and focuses the first enabled item; ArrowUp on a closed trigger does nothing. No Menu-owned key handler or focus adapter.
- [A2](https://github.com/egdev6/egdev-design-system/issues/89#issuecomment-6503698568): ArrowLeft (ArrowRight in RTL) closes only the submenu and focuses its SubTrigger; Escape closes the entire menu and focuses the root trigger. No Menu-owned Escape handler or focus restoration.
- Delegated implementation scope: `odd/tasks/molecules-build.md`, T5/S1–S4. The untracked coordination copy is not an implementation artifact and remains unchanged. Parent owns dependency installation, Git actions, full gates and PR preparation.
- Existing dependencies composed from the base: Surface recipe, Icon and Kbd; Button and Avatar appear in examples. DropdownMenu 2.2.1 was installed and committed by the parent. No dependency or token changes here.

## Files and public API

Six meaningful files live in `packages/ui/src/molecules/menu/`: `types.ts`, `useMenu.ts`, `Menu.tsx`, `Menu.test.tsx`, `Menu.stories.tsx` and `index.ts`. **No stylesheet.** No additional internal modules.

The barrel exports only `Menu`, `menuVariants`, `MenuProps`, `MenuEntry`, `MenuActionItem`, `MenuLinkItem`, `MenuSeparatorItem`, `MenuLabelItem`, `MenuSubmenuItem`, `MenuTone`, `MenuAlign` and `MenuSide`. Hook and part recipes stay internal. Menu forwards no native attributes, ref or own `asChild` prop.

`Menu.tsx` contains JSX composition only. The hook normalizes omitted action kinds, prepares explicit per-part props and calls CVA plus `cn()`. Radix owns open state, modality, loop, focus, typeahead, positioning, dismissal, ARIA and both portal levels.

Links keep native anchors. The hook captures the original React anchor click and invokes `onNavigate` during Radix's synchronous selection event. This separates anchor navigation cancellation from Radix selection cancellation: `event.preventDefault()` routes without keeping the menu open. Action `onSelect(event).preventDefault()` still keeps it open. Disabled links have no `href`; auxiliary clicks remain native. No custom state, keyboard listeners, focus restoration or synthetic menu-selection dispatch is added.

## Decisions implemented

| Decisions | Implementation |
| --- | --- |
| D1–D4 | Individual Radix DropdownMenu import; one data-driven Menu; five `kind` branches; submenu children exclude submenu by type. No public subcomponents. |
| D5–D8 | Default/primary/danger item/link tones; decorative 18px Icon; display-only Kbd shortcut; non-interactive optional header. |
| D9–D12 | Bottom/start defaults; offsets 8px, submenu 4px/−8px; Radix-controlled/uncontrolled state; modal root and looping content; cancellable actions and interceptable native links. A1/A2 govern keyboard behavior. |
| D13–D14 | Shared `surfaceVariants({ tone: 'overlay', padding: 'none', radius: 'xl' })`; Menu adds 8px padding, 230px minimum width, available-height scrolling and approved token-backed item geometry. No copied Material recipe. |
| D15–D19 | Starting opacity/rise with motion-safe translate; immediate exit; reduced-motion transition reset; no z-index utility; coarse-pointer 44px items; `eg-menu` on both panels; no stylesheet. |

Menu's panel classes merge the shared Surface recipe, then owned Menu geometry, then the supported consumer `className`. `p-2` intentionally replaces Surface's `p-0`. A larger `min-w-*` is supported; arbitrary appearance overrides are not. `cn()` resolves recognized utility conflicts, not every CSS selector or arbitrary semantic conflict. Legacy menu CSS remains untouched.

Production scanning adds only `../molecules/menu/types.ts` to `compiled.css`; it does not scan stories/tests. Existing `.storybook/main.ts` already discovers all `src/**/*.stories.@(ts|tsx)`, including molecules, so no redundant stories glob is needed. The preview source list adds Menu independently, ready to union with another molecule's registration.

## Naming evidence

Reviewed source: `packages/ui/src/molecules/menu/types.ts`, SHA-256 `5a7bc589984fe83ab17566aa8029a499b9dddd8cb99bba0ffa9d6136a9e810f5`.

Usages reuse existing approved conventions without changing any meaning, aliases, approval or exception:

- MenuProps: `collection-items`, `floating-side`, `floating-align`, `open-state`, `initial-uncontrolled-open`, `open-change`, `panel-header`, `navigation-intent`.
- MenuEntry and its reviewed branches: `menu-entry-kind`, `leading-icon`, `surface-material-tone`, `keyboard-shortcut-hint`.
- MenuSubmenuItem: `collection-items` with its restricted child union.

The current registry's broader approved menu/navigation `menu-entry-kind` convention governs; its historical molecule-only definition is not restored. `children` and `className` require no naming entry. Entry identity, visible labels, href, disabled and onSelect retain the approved schema, with no new convention or global approval inferred. Generated naming documentation and historical-receipt fixtures are updated; receipts themselves are unchanged.

## Acceptance evidence

| Criteria | Observed focused evidence |
| --- | --- |
| AC-01–AC-03 | Named body portal, composed Button/ref, trigger ARIA, ordered roles/header/schema isolation, opening keys/A1, arrows/loop/Home/End/typeahead and Escape focus tested. |
| AC-04–AC-05 | Action selection/keep-open; keyboard and pointer router interception plus dismissal; native href; disabled links; auxiliary click and no shortcut binding tested. |
| AC-06 | ArrowRight/hover opens one submenu; ArrowLeft returns to SubTrigger; Escape returns to root trigger under A2; nested submenu type rejection. RTL behavior remains Radix-owned; no separate RTL runtime result claimed. |
| AC-07–AC-09 | Icon/Kbd composition, primary/danger classes, disabled entries, controlled requests, prop-update/no-echo and empty/defaultOpen boundaries tested. |
| AC-10–AC-11 | Shared-recipe merge, internal padding, public marker, supported min-width merge, placement defaults/explicit preferences and submenu offsets tested. Production CSS compiled in memory, including fallbacks and motion/coarse-pointer utilities. Real collision layout/media behavior is not browser-verified. |
| AC-12 | Type fixtures reject missing link href, old `type`, deeper nesting, native forwarding and Menu ref; `kind` narrows and omitted actions render at both levels. |

### Test-first record

- RED: initial missing-module failure, then three opening tests against a null component failed because no trigger rendered.
- GREEN: after implementation and approved A1/A2 updates, `Menu.test.tsx` passes all 20 tests. The shortcut accessible-name fixture was corrected to the actual concatenated text (`Edit⌘E`), without changing component content.
- Triangulation: router cancellation still dismisses; action cancellation keeps open; disabled and auxiliary link activation; controlled no-echo; empty collections; submenu keyboard/hover; production CSS and installed Storybook metadata.
- Ancillary failures fixed: Storybook's native enum default summaries include one normal quote pair; the organism naming receipt test now excludes reviewed post-receipt usages before checking historical emptiness. In-memory CSS uses the same `optimize: false` as the production stylesheet config, rather than the differently prefixed optimized output.

### Checks run

All Vitest commands below used `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run <path> --maxWorkers=2`, one at a time:

| Path / command | Result |
| --- | --- |
| `packages/ui/src/molecules/menu` | 20 passed |
| `packages/ui/src/lib/menu-metadata.test.ts` | 3 passed; all 36 public schema fields annotated; real prop extraction/defaults and static composition verified |
| `packages/ui/src/lib/menu-css.test.ts` | 1 passed; real production CSS entry compiled in memory, no build output written |
| `packages/ui/src/lib/storybook-controls.test.ts` | 128 passed; installed extraction/enhancer/inference including Menu, zero owned-metadata diagnostics |
| `packages/ui/src/lib/storybook-docgen.test.ts` | 98 passed; public barrel regression included |
| `pnpm lint` | Passed |
| `pnpm typecheck` | Passed |
| `pnpm props:docs` / `pnpm props:check` | Regenerated / passed |
| `pnpm test:props` | 87 passed |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Regenerated catalogue, 110 rows; bytecode writes disabled |
| `node --test --test-name-pattern='transition utility guard' scripts/package-exports.test.mjs` | 2 passed |
| `git diff --check` | Passed |

## Remaining parent verification

Package export and packed-consumer suites are updated (public declarations and runtime keys, native/SSR/client samples, negative types, production/native/Tailwind consumer CSS), **not run here**. Full build, packed React 18/19 consumers, serialized parent gates, browser Controls and owner visual review remain separate. No Storybook server, package installation, commit, push or CI run was performed.

Expected-design references remain VIS-01 (`8a88d52db066da90a5de0f618c5ec5143a898e745001ff4789765aaa2c7d8983`) and VIS-02 (`8adad5c344e6635d6e98b77aa463208a806f3c406d6403537423e34b7914d3ad`) scoped by the approved issue. No current screenshots replace them. Visual conformity: **Not evaluated**; CSS and JSDOM evidence do not establish pixel parity, actual collision placement, computed media behavior or browser accessibility certification.
