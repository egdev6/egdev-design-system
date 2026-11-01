# TabBar v0.1 — conditional implementation plan

## Authority and gates

[Issue #125](https://github.com/egdev6/egdev-design-system/issues/125) is the approved v0.1 full contract. Its owner approval comment records canonical SHA-256 `148bad71744c7746ccd34db9a81a8402ca12257f528a0a9dddf28636fd989a7b`, frozen body SHA-256 `a08f082715e86f101fd9cce33b0e4ea06442e058ce201a9468c641c7b5f3c3c0`, and visual hashes below. That manual record documents an owner grant, not an independent signed receipt; it supersedes historical Draft/Pending identity headers, not substantive promises. It does not approve this plan, implementation, dependencies, tokens or runtime conformity. Obtain separate owner plan approval before code. ODD organisms wave S2–S4 / O7 governs sequencing and delivery; AppShell #130 remains parked.

The contract requires Icon #58, Badge #52, VisuallyHidden #112 and Surface #106. Reconcile their actual public exports, versions and compatible APIs before implementation; inspecting source types alone does not establish runtime availability. In particular, Surface's inspected recipe supports the contracted arguments, and Icon's inspected `IconName` now contains 45 names, not the historical 41; use the actual exported union without narrowing it. Do not implement prerequisites as part of TabBar or invent their availability. No ProductMark or ProductIdentity is needed by TabBar.

**Dependency verdict: no new dependency identified.** The navigation engine is native `nav`/`ul`/`li`/`a`, not Radix Tabs (which supplies in-page tab/panel semantics and roving focus), ToggleGroup, or a flyout-oriented NavigationMenu. Native anchors already provide link focus and activation; no keyboard or ARIA engine is reimplemented. The current `packages/ui/package.json` directly declares `@radix-ui/react-visually-hidden` 1.2.13 for the composed prerequisite. If prerequisite reconciliation reveals an undeclared required package, flag **NEW DEPENDENCY — separate owner confirmation required** before changes. No install, token change or implementation is authorized by this plan.

## Future files and integration

Subject to separate authorization, create six meaningful files under `packages/ui/src/organisms/tab-bar/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, English JSDoc and static token-backed `tabBarVariants` and part CVA recipes. |
| `useTabBar.ts` | Normalize counts and display cap, resolve messages, adapt navigation events, call Surface recipe and compose each part with `cn()`. |
| `TabBar.tsx` | JSX only: landmark, list, native links, Icon, Badge and VisuallyHidden. |
| `TabBar.test.tsx` | Hook and public behavior, accessibility, type and regression tests. |
| `TabBar.stories.tsx` | `Organisms/TabBar` stories and autodocs. |
| `index.ts` | Named component, types and `tabBarVariants` exports. |

**No stylesheet.** No extra internal modules. Later integration surfaces include `packages/ui/src/index.ts`, `packages/ui/src/styles/compiled.css` static source scanning, package export/consumer and Storybook metadata tests, catalog source and generated catalog artifacts, and reviewed prop-naming usage plus generated reference. Reinspect exact integration ownership and authorize those edits separately; this documentation does not grant source-edit permission.

## Composition, API and behavior

Reuse rather than substitute: NavList is a vertical grouped in-flow navigation landmark with a different responsibility; Link is a standalone text-link treatment; neither supplies this bottom-bar anatomy. Indicator's inspected count branch requires positive **safe** integers and its own marker geometry, while #125 promises all finite positive integers and the published Badge treatment. It is not a compatible drop-in. Compose unmodified Badge `tone="brand" variant="solid"`, decorative Icon `size="md"`, VisuallyHidden, and the exported Surface recipe on the native `nav` without an extra wrapper. Icon and Badge are hidden from assistive technology; a TabBar-owned span positions the Badge. Retain `eg-tabbar` as the public root marker; do not generate legacy part or `.is-active` classes or alter legacy consumers.

```ts
type TabBarItem = {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  count?: number;
  'aria-current'?: 'page';
};
type TabBarMessages = { pendingCount?: (count: number) => string };
type TabBarProps = Omit<ComponentPropsWithoutRef<'nav'>,
  'children' | 'aria-label' | 'aria-labelledby' | 'role'> & {
  label: string;
  items: TabBarItem[];
  onNavigate?: (item: TabBarItem, event: MouseEvent<HTMLAnchorElement>) => void;
  messages?: TabBarMessages;
};
```

`MouseEvent` is React's type; export `TabBar`, `TabBarProps`, `TabBarItem`, `TabBarMessages` and `tabBarVariants`. IDs are non-empty unique React keys, not DOM IDs; labels and hrefs are non-empty consumer inputs. The consumer marks at most one current page using native `aria-current="page"`; no route matching, inferred current item, state mirror, disabled destinations, ref, `asChild`, or visual axes. Forward compatible native root attributes and events, retaining the required landmark name and role. Three or four links are supported; other lengths still render equal columns without warnings or truncating the array, including a named empty list for `items=[]`.

Only finite integers ≥ 1 display a pill; zero, negatives, fractions, NaN and infinities display neither pill nor hidden count. Show integers through 99, then `99+`; the accessible name retains the exact input number, e.g. `Inbox, 250 pending`. Default `messages.pendingCount` returns `${count} pending`; a supplied formatter replaces that hidden phrase without changing the visual pill. Preserve visible label in the accessible name, without a link `aria-label` override. No live announcements: consumers supply their own if needed.

`onNavigate(item, event)` receives native click activation including Enter; the consumer may prevent default for client routing on unmodified primary activation. Do not intercept `auxclick` or alter modifier/middle-click behavior. Tab and Shift+Tab follow native link order; no arrow-key, Escape or roving-focus engine.

### Responsive coordination

TabBar itself is neither fixed nor breakpoint-aware. AppShell or the consumer supplies placement such as `fixed inset-x-0 bottom-0`, responsive visibility, content clearance and `viewport-fit=cover`; the contract describes mobile below 960px, not an automatic TabBar media query or a guarantee that a named Tailwind breakpoint equals 960px. TabBar owns intrinsic safe-area padding. Sidebar and ModuleRail are separate desktop alternatives; their consumer owns switching, layout and focus management. Coordinate one shared `ProductIdentity` under `packages/ui/src/types` between those two plans only; ProductMark was removed in #183 and needs their separate owner resolution, not a TabBar substitute. Do not build AppShell #130 or assume coordinated behavior already exists.

### Prop naming

The issue maps `label` → `accessible-name`, `items` → `collection-items`, `onNavigate` → `navigation-intent`, `messages` → `localized-messages`, and item `icon` → `leading-icon`. Item `count` follows Tabs/NavList data-field meaning; `id`, `href`, `aria-current`, inherited props and `className` are structural/native. **New convention candidates: none; exceptions: none.** The issue reports reused IDs approved under the organism naming receipt, itself assistant-applied acceptance under human delegation, not independent per-convention owner review. Recheck the current [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md) by meaning, names and aliases before implementation; convention review remains separate. Once the real source exists, inspect each symbol and append applicable usage with path, symbol and actual whole-file SHA-256; never invent evidence or migrate peers. Regenerate the reference and run `pnpm props:check` and `pnpm test:props` when authorized.

## Material, tokens and visual evidence

Use static CVA in `types.ts` and per-part `cn()` in the hook, no dynamic class interpolation, inline appearance, handwritten colors, shadows or gradients. The approved contract specifies:

| Part | Recipe |
| --- | --- |
| Root | `surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' })`; `eg-tabbar box-border block w-full pt-1.5 px-2 pb-[max(var(--space-5),env(safe-area-inset-bottom))] font-sans`. Surface supplies sheen, hairline and edge shadow; no blur. |
| List and items | `m-0 p-0 list-none grid grid-flow-col auto-cols-fr`; each `li` is `min-w-0`. |
| Link | `group relative flex flex-col items-center justify-center gap-1 min-h-12 py-2 px-1 rounded-md no-underline text-label-default text-fg-secondary`; hover/current foreground, token-based color and press transitions, `active:scale-97`, `focus-visible:shadow-focus`, reduced-motion transition and scale removal. |
| Current cue | Native `aria-current` variants draw a centered `h-0.5 w-6 rounded-full` brand-colored `::before` indicator; icon changes to brand foreground, label to default foreground. The shape supplements color. |
| Label/count | Label `block max-w-full truncate`; count anchor `absolute top-1 left-1/2 ml-1.5 pointer-events-none`, unmodified Badge brand/solid. VisuallyHidden holds the exact accessible count. |

The `env()` value is the platform inset, not an invented appearance token; `--space-5` is the floor. Use the exact token duration/easing utilities from #125 for fast color transition and press feedback. Root `className` is limited to positioning, width, margin, stacking and responsive visibility; merge last, retain `eg-tabbar`, and test supported conflicts without promising universal `twMerge` precedence or appearance overrides. No token additions are proposed. **Token gap: none established by this bounded inspection**; verify every utility, token, Surface/legacy cascade and static scan in the actual build. Stop for owner direction if a token or compatible recipe is missing; do not reuse Gauge's exceptional frame.

VIS-01: [TabBar board](../../../design/foundation-boards/v2026-10-18-wave3/TabBar.png), SHA-256 `1fec3626d85edceb81022b48971c4c1acac910044c25764784a728bd4c0b4706`, Chromium 148, 1280×900, DPR 1, dark canvas and loaded fonts. VIS-02: [static specimen](../../../design/foundation-boards/v2026-10-18-wave3/specimens/tab-bar--specimen.png), SHA-256 `a80fc6267124d538bc55ce7395540f604cfef89f0635ea3b6a2543d082ed1a05`, 1280×186 capture within 1280×900 viewport; exact conditions are in #125. Compare only scoped scenarios under equivalent recorded conditions. Approved differences from VIS-01 include 14px labels, full-size Badge, top indicator, Surface sheen/all-side hairline and available Icon glyphs. Focus and press in the specimen are illustrative. **Visual conformity: Not evaluated.**

## Test-first implementation and integration

After approvals, prerequisite reconciliation and fresh working-tree inspection, write public-interface behavior tests first and record their intended RED; implement minimally, run focused GREEN, preserve touched prior behavior and refactor only while green. Planned evidence, not observed results:

1. AC-01–03 and 12–13: named navigation/list/link order and marker, no tab/menu roles, empty list, native attributes and layout merge; consumer-supplied current only, rerender changes without callback or focus movement; click and Enter callback/event, prevented primary navigation, native no-handler and modifier/middle-click browser behavior. Verify no invented state or interception.
2. AC-04–07: counts 1, 99, 100, 250 and finite integers beyond safe-integer range as represented by JavaScript; zero, negative, fractional, NaN and infinities suppress both outputs. Assert decorative Badge and Icon, exact visible/accessible text, localization, no `aria-label`, and required `IconName` type. Preserve composed component behavior without editing their implementations.
3. AC-08–11: native Tab/Shift+Tab and Enter, no roving arrows or Escape behavior; real browser checks for focus ring, ≥48px targets, equal columns at 320/390px, full accessible labels despite truncation, safe-area maximum, fixed host clearance, Surface paint, no blur, active timing and reduced motion. Use an environment capable of simulating the platform inset, or report that check not evaluated rather than claiming a CSS-string test proves it.
4. AC-14–15: actual production CSS build and static CVA scanning including Surface; packed consumer without a Tailwind compiler on React 18 and 19; owned metadata AST, real docgen, registered enhancer/inference and zero diagnostics, then browser Controls. Compare scoped visuals and record keyboard/screen-reader, contrast, 200%/400% zoom and reflow separately; unit tests and captures are not accessibility certification.
5. Run focused tests first, then the separately authorized full local Verify set and package consumption, including `pnpm props:check` and `pnpm test:props`. Parent coordinates catalog, registry, package and sibling integration. Exact runners and build permissions must be supplied for the future implementation transaction.

## Stories and Controls

Use `Meta<typeof TabBar>` / `StoryObj`, autodocs, `Organisms/TabBar`, no manual `argTypes`, renderer adapters or `play`. Stories: **Default**, **CurrentPage**, **PendingCount**, **LargeCount**, **FourItems**, **LongLabels**, **LocalizedMessages**, **FixedInViewport** with a mobile viewport decorator. Supply required/example args only; Default must not replace defaults. English JSDoc on every own declaration/union branch: `label` uses `@control text`; structured items, callbacks and messages use `@control false` with concrete reasons and story references. Apply supported directives to item/message fields too, without fabricated defaults. Check real extraction, enhancer/inference and actual browser widgets separately; actions only for applicable events.

## Owner questions and risks

1. Approve this plan and the later implementation/integration surfaces, subject to prerequisite and token reconciliation?
2. Confirm the required public Icon, Badge, VisuallyHidden and Surface APIs are available before implementation; if not, schedule those prerequisites rather than substitute Indicator or modify Badge. Confirm any separate convention review needed for the reused IDs.
3. Confirm consumer/AppShell ownership of the <960px hand-off, fixed placement, safe-area viewport setup and content clearance; AppShell #130 remains parked. Coordinate Sidebar/ModuleRail's separate shared identity and removed ProductMark decision without adding identity to TabBar.
4. If real CSS/token inspection or safe-area simulation exposes a gap, select a separately approved resolution rather than silently changing the contract. Very large finite integers can already be imprecise as JavaScript numbers; preserve the represented value and do not silently impose Indicator's safe-integer limit.

No runtime tests, build, browser/AT checks or package-consumer verification were performed for this documentation-only plan.
