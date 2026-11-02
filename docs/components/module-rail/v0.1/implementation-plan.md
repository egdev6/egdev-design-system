# ModuleRail v0.1 — conditional implementation plan

## Authority and gates

[Issue #124](https://github.com/egdev6/egdev-design-system/issues/124) is the approved v0.1 full contract. Its owner approval comment identifies canonical SHA-256 `ce9bc0efaee353fb5442fa031636209cdd9ed7c489d0c6578bb29ed23ba9e3c5` and supersedes stale Draft/Pending identity headers only. It is a manual record of an owner grant, not an independent signed receipt. It does **not** approve this plan, implementation, dependencies, token changes or runtime conformity. This plan is proposed; obtain separate owner approval before code.

The contract's ProductMark #64 was removed in #183. Its replacement is an unresolved contract change, not an implementation choice: stop for owner direction and a matching authorized contract amendment before implementing identity. `Logo` is a candidate, not an approved substitute: its inspected types describe fixed egdev corporate artwork, not arbitrary product monograms. Coordinate the decision with the [Sidebar plan](../../sidebar/v0.1/implementation-plan.md), whose ProductMark prerequisite is now stale. Do not silently use Logo or fabricate ProductMark.

The contract requires the Icon #58 v0.2 `plus` amendment and its implemented glyph before the add action; confirmation was not established in this bounded inspection. Confirm the amendment and actual public API before implementation; do not invent another glyph. Reconcile the current public availability and compatible APIs of IconButton, Icon, StatusDot, Tooltip, VisuallyHidden and Surface before using them. Source `types.ts` files alone do not establish exports or runtime readiness; the injected project guidance itself describes an older Gauge-only availability state. No prerequisite work is authorized here.

**Dependency verdict:** no new dependency identified for the contracted rail. `packages/ui/package.json` directly declares `@radix-ui/react-tooltip` 1.4.1 and `@radix-ui/react-visually-hidden` 1.2.13. Native anchors and native overflow need no NavigationMenu, ToggleGroup or ScrollArea. If prerequisite reconciliation or an approved contract amendment needs any undeclared package, flag **NEW DEPENDENCY — owner confirmation required** before adding it. No token change or install is authorized.

## Future files and integration

Subject to separate authorization, create exactly six meaningful files at organism level:

| Path | Responsibility |
| --- | --- |
| `packages/ui/src/organisms/module-rail/types.ts` | Public types, English JSDoc and static token-backed CVA part recipes. |
| `packages/ui/src/organisms/module-rail/useModuleRail.ts` | Split groups, derive names, messages and tooltip direction; compose Surface recipes and per-part `cn()`. |
| `packages/ui/src/organisms/module-rail/ModuleRail.tsx` | JSX only; native landmark, lists and contracted composed controls. |
| `packages/ui/src/organisms/module-rail/ModuleRail.test.tsx` | Behavior, accessibility and contract regression tests. |
| `packages/ui/src/organisms/module-rail/ModuleRail.stories.tsx` | `Organisms/ModuleRail` stories and autodocs. |
| `packages/ui/src/organisms/module-rail/index.ts` | Named component, public type and `moduleRailVariants` exports. |

**No stylesheet.** No extra internal modules. Future integration includes `packages/ui/src/index.ts` for named exports; static CVA and Surface coverage in `packages/ui/src/styles/compiled.css` scanning; existing package export/consumer tests; Storybook metadata tests; catalog source `scripts/catalog_data.py` and generated catalog artifacts; and reviewed registry usage in `skills/_shared/prop-naming.json` plus generated `docs/prop-naming.md`. Reinspect these integration surfaces before implementation; this plan grants no edit permission to them.

### Shared identity decision

Use **one** `ProductIdentity` definition under `packages/ui/src/types`, exported once and consumed directly by Sidebar and ModuleRail, as both contracts require: `{ monogram: string; name: string; href?: string }`. Do not create competing local aliases. Coordinate exact file/barrel ownership and ordering with the Sidebar work before either implementation. The shape is contingent on the owner resolving the removed ProductMark; a replacement that cannot honor its monogram/name/link semantics requires an explicit contract amendment for both components, not an implicit type change.

## API, composition and behavior

- `ModuleRailProps` inherits compatible `ComponentPropsWithoutRef<'nav'>`, omitting `children`, `aria-label`, `aria-labelledby`, `role` and `dangerouslySetInnerHTML`. Required `label: string` names the native `nav`; required `items: ModuleRailEntry[]` is ordered. Optional `product`, `endItems: ModuleRailLink[]`, `onNavigate`, `onAdd` and `messages` follow the approved contract. No ref, `asChild`, size, variant, collapse state or disabled-link API. Root `className` is for height, margins and placement only; forward compatible native attributes without overriding landmark semantics.
- A link is `{ kind?: 'link'; id: string; label: string; href: string; icon: IconName; state?: 'running' | 'idle' | 'warning' | 'error' | 'stopped'; 'aria-current'?: 'page' }`; a separator is `{ kind: 'separator'; id: string }`. IDs are non-empty unique React keys across both collections, never DOM IDs. Consumer supplies valid non-empty label/href, omits unavailable destinations and marks at most one current page. `endItems` contains links only.
- Native anchors provide navigation and keyboard behavior, not NavigationMenu or ToggleGroup. `onNavigate(item, event)` notifies for native click; client routing may prevent default on unmodified primary activation, preserving modifier and middle-click behavior. No route matching, roving focus or selection state is added. `onAdd(event)` alone renders the ghost `lg` IconButton, with the approved plus glyph; the consumer owns the creation flow.
- Split main items into `ul` groups at separators, discard empty groups and duplicate hairlines; separators are decorative siblings, never list items. Empty items produce no empty main list. Main groups scroll natively; brand and end list remain pinned. A spacer pushes the end list down. Tab order is linked identity, main links, add, end links. Limit usage to approximately ten destinations; larger navigation belongs in Sidebar/NavList.
- Tooltip #75 wraps every link and add control, using label or `messages.add` (`Add module` by default). Tooltip owns Radix `asChild`, Portal, hover/focus delays and Escape; its triggers must actually spread props and forward refs. Use right in LTR, left in RTL, derived from inherited direction; verify that the chosen implementation actually observes inherited `dir`, including changes, rather than assuming a root prop equals inherited direction. Radix may flip near an edge. ProductMark had no tooltip in the contract; reassess only if identity is amended. Per-instance provider delay and duplicate `aria-describedby` name are known Tooltip-level limitations.
- Each native anchor contains decorative Icon and StatusDot and VisuallyHidden text: `label` or `label, stateText`. `messages.states` partially overrides English state words. No live region; the consumer announces important changes. Current uses native `aria-current="page"`; stopped dims only a non-current icon. Tooltip owns trigger `data-state`; do not mirror state into classes. Indicator is a passive supplementary marker with physical corner positioning, not the contracted StatusDot state API; do not substitute it. NavList owns labelled grouped navigation and is not the rail's link implementation. IconButton is appropriate for the add action, not the current-page links.

### Prop naming

Use the [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md). The currently inspected registry marks these IDs approved: `label` → `accessible-name`, `items` → `collection-items`, `onNavigate` → `navigation-intent`, `messages` → `localized-messages`, link `icon` → `leading-icon`, and discriminant `kind` → `menu-entry-kind`. Link `state` borrows StatusDot semantics, not a new root condition prop; `id` is a structural key and `href`, `aria-current`, native props and `className` have native/inherited meaning. No exceptions are specified.

Issue-origin **new convention candidates** (now recorded approved in the registry under the organism receipt, not newly approved by this plan): `product-identity` / `product` (`ProductIdentity`, shared with Sidebar), `end-items` / `endItems` (`ModuleRailLink[]`), and `add-request` / `onAdd` (`(event: MouseEvent<HTMLButtonElement>) => void`, shared concept with CalendarGrid). The receipt records assistant-applied acceptance under human delegation, not independent per-convention owner review. Reconcile any effect of the identity amendment and any separately required review before implementation. After the real source exists, inspect the symbol and append only applicable usages with repository path, symbol and actual whole-file SHA-256; regenerate from JSON and run `pnpm props:check` and `pnpm test:props` when authorized. Never invent source revisions or migrate unrelated APIs.

## Material, visual evidence and responsive relationship

Use static CVA in `types.ts` and per-part `cn()` in the hook; no inline appearance, handwritten gradients/shadows, dynamic classes or new tokens. `eg-rail` remains the public root; do not emit legacy part or `.is-*` classes, alter legacy CSS or promise arbitrary `className` appearance overrides. Confirm `twMerge` behavior and actual cascade rather than assuming universal last-class wins.

| Part | Contracted recipe / verification |
| --- | --- |
| Root | `eg-rail box-border flex h-full w-19 flex-col items-center gap-2 py-4`; Surface `surface-1`, elevation `0`, no padding/radius, plus `border-y-0 border-s-0` for logical inline-end hairline. Verify utilities override legacy root paint including shadow in actual built CSS. |
| Main groups | `min-h-0`, centered vertical lists, `overflow-y-auto overscroll-contain [scrollbar-width:thin]`; focus rings must not clip. |
| Link/current | `size-12`, `rounded-md`, transparent border, secondary foreground; hover `bg-surface-2` and default foreground; current Surface `surface-3`, elevation `1`, no padding, `md` radius and brand-raised icon. Focus-visible uses `shadow-focus`; reduced motion removes transitions. |
| Dot and separators | StatusDot at `absolute end-2 bottom-2`; decorative hairline `w-8 h-px my-1.5 bg-border-hairline`. No badge/counter. |
| Add / identity | Ghost `lg` IconButton, no dashed border; identity treatment remains blocked on owner resolution. |

The contract expects `w-19` = 76px and links = 48px, existing tokens only. No specific token gap was established by this bounded inspection; verify each utility/token and static scan against the actual build before implementation. If a token or Surface recipe is missing/incompatible, stop and ask; do not copy Gauge's exceptional frame, invent paint or alter tokens. Compare built LTR and RTL output, logical border, focus and legacy override in a real browser.

VIS-01 is [ModuleRail.png](../../../design/foundation-boards/v2026-10-18-wave3/ModuleRail.png), SHA-256 `10bb0733c96c98d4f3b79a1c9c1f3e3ba073c81f283601b43b395d6372686703`: captured Chromium 148, 1280×900, DPR 1, dark canvas, loaded fonts, no reduced motion, static legacy states; see [capture metadata](../../../design/foundation-boards/v2026-10-18-wave3/capture.json). VIS-02 is the [static specimen](../../../design/foundation-boards/v2026-10-18-wave3/specimens/module-rail--specimen.png), SHA-256 `94a506790fa479661d314ed5382734525faed7237bc79a1123892e77eb6c8679`; exact conditions and scope are in #124. Compare under equivalent conditions only, preserving approved references. The board's dashed add outline and red current tint are explicitly superseded by the ghost add and raised current treatment. **Visual conformity: Not evaluated.** Any identity replacement needs separate visual scope approval.

ModuleRail is the compact desktop alternative to Sidebar; TabBar #125 is the mobile counterpart. The consumer/AppShell owns responsive switching, layout, placement, focus management and breakpoints; the rail does not collapse itself. AppShell #130 remains parked until Sidebar, ModuleRail and TabBar exist. Do not infer coordinated runtime behavior from these plans.

## Test-first and verification plan

After all gates and fresh prerequisite inspection, write public-interface tests first, observe intended RED, implement minimally, observe focused GREEN, preserve touched existing behaviors and refactor only while green. No tests or builds were run for this documentation-only plan.

1. AC-01/02/12: named native landmark and stable marker; brand/groups/add/end order; separator boundaries including leading, trailing and consecutive, no empty lists; empty items; forwarded native attributes, omitted role/name overrides and supported height merge; no legacy part classes.
2. AC-03/04/09: all five states and absence, localized/default names, decorative glyph/dot, no live region; supplied current only, stopped/current precedence and Surface composition. Consumer owns uniqueness and current selection.
3. AC-05–08: link and event callback, prevented primary navigation, modified and middle-click native behavior; add absent/present, custom/default name and click/Enter/Space; tooltip on hover/focus, Escape, LTR/RTL placement and focus retention; native Tab/Shift+Tab order and no roving arrows. Verify Tooltip/trigger ref compatibility and preserve existing IconButton, Tooltip and navigation behavior.
4. AC-10/11/15: browser computed styles for width, Material, logical border and legacy CSS override in both directions; overflow, pinned content, focus scrolling and unclipped rings; 200% zoom, reduced motion, contrast and 48px targets. DOM assertions alone do not establish layout or accessibility.
5. AC-13/14: actual CSS build and static CVA scan including Surface; packed consumer without Tailwind and React 18/19 consumption; real docgen and registered enhancer/inference with zero owned diagnostics, then browser Controls. Record visual comparisons and keyboard/screen-reader findings separately; no accessibility certification follows from unit tests.

Run focused checks first, then the parent-authorized full local Verify set and package consumption, including `pnpm props:check` and `pnpm test:props`. Obtain exact commands and any build permissions for the future implementation transaction; planned checks are not observed evidence.

## Stories and Controls

`Meta<typeof ModuleRail>` / `StoryObj`, autodocs, no manual `argTypes`, renderer adapters or `play`. Cover **Default**, **CurrentAndStates**, **Stopped**, **WithAdd**, **EndItems**, **Separators**, **Minimal**, **Overflow**, **Localized** and **RTL**. Use required/example args only; Default does not override documented defaults. Apply English JSDoc and `@control text` to `label`, `@control false` with concrete reasons and story references to structured data and handlers; annotate each own declaration/union branch using only the supported central metadata directives. Verify real extraction, enhancer/inference and browser widgets independently. Use Storybook actions only for applicable events.

## Owner questions and risks

1. Approve this conditional plan and the later implementation/integration surfaces after prerequisite reconciliation?
2. ProductMark was removed in #183: should both Sidebar and ModuleRail use Logo, or retain/replace product-specific monogram rendering another way? Logo is fixed egdev artwork and does not accept a monogram; choose and authorize the required contract/API and visual amendments before code. Confirm whether the shared `ProductIdentity` shape remains valid.
3. Confirm the shared type's ownership/location and integration order with Sidebar; neither worktree should independently introduce a second definition.
4. Confirm Icon #58 v0.2 `plus` amendment and availability, and the actual public composed-component prerequisites. If Tooltip cannot receive the add trigger's forwarded ref or inherited direction cannot be resolved reliably, how should the relevant contracts be amended?
5. Confirm any separate review needed for `product-identity`, `end-items` and `add-request` after any identity change. If missing tokens or a new dependency emerge, request specific confirmation rather than silently proceeding.
