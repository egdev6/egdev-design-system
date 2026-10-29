# ModuleCard v0.1 implementation evidence

## Authority and scope

- Contract: [#91 v0.1](https://github.com/egdev6/egdev-design-system/issues/91), adopted by the [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/91#issuecomment-6251525440). All comments were recovered; there is no later approved amendment. Canonical payload SHA-256: `982c755090599df49e47f97713e7b5437366197fc944728fe3942c70e95eb0b3`; frozen body SHA-256: `2e9948dc7569f8ab16a735cae6060b2e23747c78fbc1e28a773369ff7f557778`. Historical Draft/Pending wording is interpreted through that approval, not rewritten.
- Implementation authorization: the parent explicitly delegated implementing this exact approved contract under `odd/tasks/molecules-build.md`, T20, S1–S4. The implementation plan retains six meaningful files, Surface/Badge/Icon composition, bounded stopped/band utilities and the contract's validation matrix. This is parent-provided implementation authorization, not a newly invented owner approval receipt.
- Base: `origin/main` `d428967`, branch `feat/91-module-card`. Surface, Badge, Icon, Button, Link, IconButton and optional body Stat already exist in the public barrel. PageHeader/Notice/Carousel supply naming conventions only; they are not composed. The unapproved Panel #180 proposal is not implemented or treated as an amendment.
- No token/dependency change, stylesheet, extra internal module, public CVA/hook, ref or asChild. No Git staging/commit/push, browser, server, watch, packed-suite or CI execution.

## Decisions implemented

| Decisions | Implementation |
| --- | --- |
| D1–D2 | One molecule generates header → free body → optional independent actions → optional supplementary footer. No domain data, KPI API, action arrays or header renderer. |
| D3 | Native article named by its own useId-linked h1–h6, default h2; blank title renders nothing and warns in development. Invalid untyped heading ranks fall back to h2. |
| D4–D5 | Consumer-selected default/error/stopped becomes root data-state. Real Badge + decorative Icon: info/bell/Ready, danger/alert/Needs attention, neutral/pause/Stopped. Partial messages retain omitted defaults; blank/non-string phrases fall back. No live region or process engine. |
| D6 | Supplied Button/Link controls retain handlers, focus and their own data-state. Error/stopped require actions in the public union. Meaningful body/action content, supported element counts and non-empty fragments remain consumer/content-review requirements, not a child parser. Footer is a div, not contentinfo. |
| D7 | col-span-full is documented root className grid placement, not a wide state or sizing algorithm. Its static spelling in types.ts also ensures native packaged CSS ships the supported layout utility. |
| D8–D9 | surfaceVariants supplies root Material (padding none, radius xl; solid elevation 1, overlay fixed recipe). Banded headers compose surface-2/3 at elevation 0; footers compose surface-0/1 at elevation 0, removing sheen/shadow. Body/actions remain transparent. No copied Surface engine. |
| D10 | Error conditionally changes the border only. Stopped conditionally clears background/image/shadow and uses dashed border-control; its type rejects banded/overlay, and untyped conflicts normalize to default/surface-1. No positioning/Portal/floating interaction. |
| D11 | Utility-layer transform-none/transition-none/animate-none neutralize legacy hover lift without altering selected Surface paint. Root is passive; stable child focus survives status rerenders. |
| D12 | Native compact headings use cta-label or banded display/heading-small/uppercase. Body uses body-default, footer label-default; supplied figures remain consumer-owned. |
| D13 | Six files, no stylesheet. Public root/part markers retained without modifier/is-* classes. Root className merges last for supported external layout only, not appearance overrides. |

### Legacy coexistence and composition details

- Existing legacy CSS is unchanged in the components layer. Utilities win by layer, not class-string order. Root overlay explicitly resets the legacy ModuleCard sheen image via data-tone; Surface still owns its background color, shadow, backdrop and fallbacks.
- Banded header has only a bottom hairline; footer only a top hairline. Both remove redundant side/perimeter borders. Exposed top/bottom corners are rounded individually, including last body/action regions without a footer; root remains overflow-visible for child focus rings.
- The icon wrapper resets legacy SVG fill/stroke inheritance; actual Icon paint/geometry remain owned by Icon. Status Icons use its supported size-class surface for Badge's 14px decorative slot.
- Last-of-multiple action alignment resets legacy physical margin-left and adds logical margin-inline-start. Single actions keep logical start; no DOM reorder or cloned children.
- All generated utilities are static CVA in types.ts and each part uses cn(). Production scans molecules/**/types.ts; Storybook separately scans molecule examples. Existing broad Storybook stories discovery already covers molecules.

## Public API, naming and metadata

Exports are exactly ModuleCard plus ModuleCardProps, ModuleCardStatus, ModuleCardVariant, ModuleCardTone, ModuleCardLevel and ModuleCardMessages. No new package subpath. Both exact packaged runtime/declaration inventories, the source-barrel inventory and packed runtime-key list include the additions.

Nine existing approved naming IDs gain reviewed ModuleCardProps usages: heading-title, heading-level, item-presentation-status, trailing-actions, localized-messages, panel-footer, visual-treatment, surface-material-tone and leading-icon. No convention, alias, exception or approval content changes. Reviewed whole-file types.ts SHA-256: `ed7adc13e5eb72795fbfdd83ee8108b291cefd94708e6b4f3642293357139c53`. Dictionary keys are declared by ModuleCardMessages; they are not additional root props or global naming conventions.

Real docgen checks all 18 own declarations across the three union branches (10 unique rows), required title/children, exact constant defaults/enums, native article rows and excluded control/name/ref APIs. Registered extraction/enhancer/inference checks require zero owned-metadata diagnostics. Complex slots/dictionary use justified false Controls, with dedicated stories. No manual argTypes, play, defaults injected into Default, or rendering adapter. The full 24-story contract matrix plus WithIcon is present; OverlayFallback requests inspection of real Surface fallbacks, not a fake paint override.

## Validation and test-first evidence

All validation ran in the foreground with MemoryMax=2G; no packed consumer suite was run.

- RED: the initial behavioral test run failed import resolution because useModuleCard did not exist. With public scaffolding and a null-rendering component, all 24 behavior cases failed as intended (missing article/headings/status/actions and missing blank-title warning).
- GREEN: real JSX/hook composition passed 24/24. Triangulation adds public-type rejection checks, all eight default/error material pairs, conflicting stopped inputs, optional boolean/null slots, invalid messages, child keyboard/disabled/loading/focus and protected untyped native semantics. Final component count: 25/25.
- Initial metadata integration failed on its missing ModuleCard own-prop count; registering the actual 10 unique rows fixed it.
- Initial preview CSS check failed because this fresh worktree lacked built tokens. It passed after the authorized build; no fake token file or test bypass was added.
- One build invocation completed. Its chained exports run initially passed 51/52: a new typography assertion did not account for Tailwind's outer --tw-font-weight fallback. Only that assertion was corrected; the emitted typography was already correct. Standalone exports recheck passed 52/52 without another build.

| Exact command | Final observed result |
| --- | --- |
| `pnpm props:docs` | Generated view regenerated. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 110 rows regenerated; bytecode writes suppressed outside the allowed surface. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G sh -c 'pnpm build && pnpm test:package-exports'` | Build passed (116 reachable declarations; UI CSS 255.67 kB); initial exports 51/52, assertion corrected as described above. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-exports` | 52/52 passed, including ModuleCard SSR and actual shipped CSS. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/module-card packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2` | 4 files, 304/304 passed (25 behavior/type, 99 docgen, 127 Controls, 53 preview-CSS tests). |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint` | Passed; 382 files checked. Earlier formatting findings were corrected only in scoped files. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck` | Passed. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm props:check` | Registry valid; source hashes and generated view current. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props` | 87/87 passed. |
| `git diff --check` | Passed. |

Packed fixtures use the actual exported types with Extract-narrowed status branches, positive/negative TS cases, SSR naming/bands/messages, client action/focus/state preservation and native/Tailwind CSS checks. These fixtures are implemented but their React 18/19 execution remains the parent's full gate; no packed compatibility pass is claimed here.

## Remaining owner/parent evidence

AC-01–AC-07, AC-10–AC-11 and AC-13–AC-15 have the functional/type/metadata/source/build evidence above. Browser portions of those criteria remain distinct. AC-08 real preference/support fallback execution, AC-09 actual grid bounds, AC-12 narrow/RTL/zoom/contrast/focus-ring geometry, actual Controls widgets and screen-reader behavior were not evaluated.

Both approved expected-design PNGs were read, not replaced: VIS-01 `docs/design/foundation-boards/v2026-10-18/ModuleCard.png` (default/stopped/banded-wide) and VIS-02 `docs/design/foundation-boards/v2026-10-18/specimens/module-card--specimen.png` (error/overlay-banded/static fallback). Source anatomy is retained subject to the approved generic status, typography, no-lift and Surface differences. No current implementation capture or computed-style/pixel comparison was performed. **Visual conformity: Not evaluated.** Owner reviews Storybook on main; parent owns broad gates, packed consumption and terminal Git delivery.
