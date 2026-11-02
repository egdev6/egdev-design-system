# AppShell v0.1 — implementation plan

## Authority and gates

[Issue #130](https://github.com/egdev6/egdev-design-system/issues/130) is the approved v0.1 full contract. Its [owner full-contract approval comment](https://github.com/egdev6/egdev-design-system/issues/130#issuecomment-6251614057) records canonical SHA-256 `5f861d3f26424ae02cbe3be4daecfa97f697657048d19a82e5b19a7686f190e4`, frozen issue-body SHA-256 `671d890d3bd3dc0529b5b64e52c4a0aeaf89841966d24c8b2b8cd0fd90d204fb`, and visual hashes VIS-01 `27439a76…a43c1d`, VIS-02 `214e4a0e…528e805`, VIS-03 `10bb0733…2686703`, VIS-04 `1fec3626…c0b4706`. That record is a manual assistant record of a direct owner grant, not a native, signed or independent receipt; it supersedes historical Draft/Pending identity headers only and approves no implementation, plan, dependency or token change.

Preparation history is already committed and is **not repeated here**: [v0.2 contract recovery](../v0.2/contract-recovery.md), [dependency/evidence map](../v0.2/dependency-evidence-map.md) and the [parked future plan](../v0.2/implementation-plan.md). Those notes named v0.2 preparation, not a contract revision; this file is the plan for **contract v0.1** and is the artifact the owner approves. They stay untouched.

Prerequisites are satisfied on `main` (`d76732e`): Button #53, Surface #106, Sidebar #123 (`ecc885a`), ModuleRail #124 (`fcf67bb`) and TabBar #125 (`3fab7f1`) are implemented and exported, so the contract's "organism implementations for stories" gate is closed. Evidence that they exist is checked again at implementation time; if an organism API differs from what this plan composes, stop and report the drift instead of adapting silently.

ODD tracking: `odd/tasks/organisms-build.md`, **T10** (#130 + #128 evidence consolidation), under S2–S4. This plan is documentation only: it authorizes no source, test, token, dependency, git or network write. Owner plan approval is required before code (S3 gate); the owner answers in section 14 are recorded at approval time in `docs/components/app-shell/v0.1/owner-approvals.md` (the [organisms-wave precedent](../../organisms-wave/v0.1/owner-approvals.md)), not by editing this file.

## 1. Level, package, folder and files

- Level **Template**, package `@egdev/ui`, folder **`packages/ui/src/templates/app-shell/`** (contract D1). `docs/ARQUITECTURA.md` already defines the level ("Plantilla — disposición de una vista sin contenido real (AppShell)") and the exact folder pattern `packages/ui/src/{primitives|atoms|molecules|organisms|templates}/{kebab-name}/`; `packages/ui/src/templates/` exists today with only `.gitkeep`. **No new folder convention is proposed** and `.gitkeep` is left untouched.
- Six mandatory files, **No stylesheet**, **no extra internal modules** (contract D16):

| File | Responsibility |
| --- | --- |
| `types.ts` | `AppShellProps`/`AppShellMessages`, English JSDoc with `@control`/`@controlReason`, public `appShellVariants` slot recipes (root, skip, skipLink, body, side, main, bottom) with the internal `arrangement` variant, no exported part recipes. |
| `useAppShell.ts` | Slot-derived `arrangement`, `messages` defaults, `useId()` main id, main ref, skip-link click handler (`preventDefault` + `main.focus()`), typed per-part props and per-part `cn()`. No layout state, no media/resize observers. Hook stays private. |
| `AppShell.tsx` | JSX only: root, skip row with Button `asChild`, body, side, `main`, bottom. |
| `AppShell.test.tsx` | Behaviour, DOM/landmark, merge, type and SSR tests. |
| `AppShell.stories.tsx` | `Templates/AppShell` stories and autodocs with real organisms. |
| `index.ts` | `export { AppShell } from './AppShell'; export type { AppShellMessages, AppShellProps } from './types'; export { appShellVariants } from './types';` |

`appShellVariants` follows the existing multi-part precedent (`radioGroupVariants` in `packages/ui/src/atoms/radio-group/types.ts`): private per-part `cva(...)` constants collected into one exported `as const` object, which is what the contract's "slots: root, skip, body, side, main, bottom" means. Part recipes stay non-exported, so the package test can assert them as type-level negatives.

## 2. Composition and API

The contract's public API is adopted verbatim — no additions, no renames:

```ts
type AppShellMessages = {
  /** Visible text and accessible name of the skip link. Default: `Skip to content`. */
  skipToContent?: string;
};

type AppShellProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'dangerouslySetInnerHTML'> & {
  /** Docked side navigation region (a Sidebar or ModuleRail). @control false */
  sideNavigation?: ReactNode;
  /** Docked bottom navigation region (a TabBar). @control false */
  bottomNavigation?: ReactNode;
  /** Main content rendered inside the view's single main landmark. @control false */
  children: ReactNode;
  /** Localizable built-in text. @control false */
  messages?: AppShellMessages;
};
```

Every own declaration carries English JSDoc plus a concrete `@controlReason` and a story reference, per the shared contract's public-prop-controls policy: `sideNavigation`/`bottomNavigation`/`children` are non-serializable ReactNodes (see `SidebarAndTabBar`, `BottomOnly`, `ContentOnly`); `messages` is a structured object (see `Localized`). `children` is required and gets **no** `@default`. No own prop is `text`/`number`/`boolean`/`select`, so no widget is inferred.

Anatomy and slot mapping (contract §2, D2, D5–D8): root `div` (no role) → optional skip row `div` → body `div` → side wrapper `div` (no role) + `main` → bottom wrapper `div` (no role). `arrangement` is derived, not a prop: `switching` (both slots), `side` (side only), `bottom` (bottom only), `content` (neither).

Not in the API, deliberately: `layout`/`breakpoint`/`collapsed` props, aside/secondary slot (D11), drawer or `sheet` slot (D12), ref, `asChild`, part prop bags, consumer `main` id, events, state or `data-state`.

## 3. Prop naming

Checked against [the registry](../../../../skills/_shared/prop-naming.json) (138 entries today) and its generated [reference](../../../prop-naming.md):

| Own prop | Convention | Status |
| --- | --- | --- |
| `sideNavigation` | `side-navigation` | **approved**, `usages: []`, approval `docs/decisions/prop-naming-template-specs-approval.json`, `contentHash sha256:5192bcdd…8067966f` |
| `bottomNavigation` | `bottom-navigation` | **approved**, `usages: []`, same receipt, `contentHash sha256:59c322d5…394dc971` |
| `messages` | `localized-messages` | **approved** (existing, already used by TabBar/ModuleRail) |
| `children`, `className`, native attributes | — | structural/native, no entry needed |

**New convention candidates: none.** Both layout slots were accepted under the template naming receipt, which is assistant-applied acceptance under human delegation, not independent per-convention owner review; this plan proposes no promotion, alias or migration. The only registry work is post-implementation **usage append** through the existing workflow (never hand-edited hashes): after `types.ts` exists and has been read, append `{component: 'AppShell', type, status, source: {path: 'packages/ui/src/templates/app-shell/types.ts', symbol: 'AppShellProps', revision: 'sha256:<whole-file hash of the reviewed file>'}}` for the two slots and `messages`, then `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`. No other convention, receipt or historical record changes.

## 4. Responsive behaviour and exact theme keys

**Mechanism (contract D3–D5):** CSS-only viewport media query. Both navigation trees stay mounted; the inactive wrapper is `display: none`. No `matchMedia`, `ResizeObserver`, container query, JS measurement or React state; the root declares no size container (a container would become the containing block of `position: fixed` descendants and create a stacking context, D17).

**Switching only when both slots are supplied** (`arrangement: 'switching'`):

| Part | Static utilities | Emitted effect |
| --- | --- | --- |
| Side wrapper | `sticky top-0 h-dvh self-start shrink-0 max-[56rem]:hidden` | visible at ≥ 56rem |
| Bottom wrapper | `sticky bottom-0 min-[56rem]:hidden` | visible below 56rem |
| Skip row | `hidden min-[56rem]:block` | only where the side region is visible |

With a single slot the arrangement variant adds no media utility: a side-only rail and a bottom-only bar are visible at every width. Exactly at 896px (56rem × 16px initial font size) the side region is visible and the bottom region is not — `min-[56rem]:` is `width >= 56rem` and `max-[56rem]:` is `width < 56rem`, so there is no overlap band.

**Exact theme keys used — and the gap.** `packages/tokens/src/theme.css` declares media-query breakpoints only as `@theme static { --breakpoint-section-header-split: 860px }` (line 13) and container sizes only as `--container-quote-pull` and `--container-calendar-grid-stack: 960px`. There is **no breakpoint or container key for 56rem/896px**, and the CalendarGrid lesson proves that an *undefined theme key* variant (`@max-4xl:`) silently emits no CSS. The approved mechanism therefore uses **arbitrary media variants** `min-[56rem]:` / `max-[56rem]:`, which Tailwind v4 compiles from the arbitrary value itself and does not depend on a theme key at all.

> **TOKEN GAP — owner approval required.** Component threshold `56rem` (896px) has no token. Exact proposal if a token is wanted: `--breakpoint-app-shell-split: 896px;` inside the existing `@theme static` block immediately after `--breakpoint-section-header-split` (line 13), consumed as `app-shell-split:` / `max-app-shell-split:`; it is a media-query key (`--breakpoint-*`), not `--container-*`, because AppShell measures the viewport, not a container. Cost: `packages/tokens/tests/token-contract.test.mjs` pins move 214→215 utility declarations and 286→287 total declarations plus a new named assertion beside the existing `--breakpoint-section-header-split` one; `packages/tokens/tests/scale-reduction.test.mjs` media-breakpoint assertion gains a second name; `packages/tokens/dist/tokens.css` must be rebuilt with `pnpm tokens`; the CalendarGrid-style stale-dist parity failure is expected until that rebuild; and contract D4 ("the arbitrary 56rem is a structural threshold … changing it later is an amendment, not a token") would need an amendment.

**Recommendation: option A — use the approved arbitrary `min-[56rem]:` / `max-[56rem]:` and no token.** It is what the approved contract literally specifies, it compiles without depending on a theme key, and it adds no token, token-count pin, dist rebuild or amendment. To make it non-silent, the emitted-CSS test in section 9 pins the selectors **and** the at-rule prelude containing `56rem` in the production artifact, so the CalendarGrid failure mode (source class present, CSS absent) becomes a hard test failure rather than a runtime surprise. Option B remains available if the owner prefers token-system consistency.

## 5. Layout ownership: AppShell vs organisms vs consumer

The three contracted organisms explicitly delegate placement, so this is the hand-off the plan must not blur:

| Concern | Owner | Evidence in this plan |
| --- | --- | --- |
| Side region docking, full-height, sticky | AppShell | side wrapper `sticky top-0 h-dvh self-start shrink-0`; Sidebar (`eg-sidebar … h-full w-64`) and ModuleRail (`eg-rail … h-full w-19`) keep their own `h-full` and auto column width; the `auto` flex column is owned by the organism |
| Region Material, inner scrolling, safe-area inset, current-page marking, landmarks | Organisms | Sidebar scrolls internally (`sidebarBodyVariants` + viewport); ModuleRail is a narrow `w-19` rail with its own scroll body; TabBar owns `pb-[max(var(--space-5),env(safe-area-inset-bottom))]` and `aria-current` |
| Bottom placement | AppShell, **without `fixed`** | TabBar does not position itself; AppShell docks it as the last root child with `sticky bottom-0` **in flow**, so it never covers content and no clearance padding is added. TabBar's own `FixedInViewport` story stays a TabBar host example and is not used as AppShell evidence |
| Content clearance | Nobody, by design | in-flow docking removes the need; AppShell adds no `padding-bottom`, spacer or `scroll-margin` |
| `viewport-fit=cover` | Consumer/document | AppShell renders no `<meta>`; the contract lists it as a consumer responsibility |
| Document scroll vs inner pane | AppShell (document) | root `flex min-h-dvh w-full flex-col`; no `overflow`, no `h-screen` scroll pane |
| Content column width and page spacing | Consumer content | `main` is `min-w-0 flex-1` with no padding, max-width or gap |
| Navigation data, routing, wide/narrow destination equivalence | Consumer + organisms | slots are ReactNodes; AppShell imports no organism and re-exports no organism API |
| Modal `sheet`/drawer | Consumer (Dialog #119) | AppShell renders no Dialog and no open state |

Consumers adding `fixed` themselves is unsupported for the AppShell slot: the contract's promise is "no `fixed` needed" (D17), and a consumer `className` that re-docks a region may break non-overlap; this is documented as a restriction, not prevented.

## 6. Material and token recipe

Static CVA only, per-part `cn()`, no dynamic class interpolation, no inline appearance, no handwritten colors/shadows/gradients, no motion:

| Part | Recipe |
| --- | --- |
| Root | `eg-app-shell flex min-h-dvh w-full flex-col bg-bg-canvas font-sans text-fg-default`; no containment, transform, filter, isolation or explicit z-index (D17); `className` merges last for outer sizing/margins only |
| Skip row | `sr-only focus-within:not-sr-only` + `hidden min-[56rem]:block` when switching (in flow while focused, never a z-index layer; the momentary reflow is accepted) |
| Skip link | Button `variant="secondary"` (default `md`, 48px) with `asChild` around a native `<a href={'#' + mainId}>`, `className="m-2"` (layout margin within Button's documented `className` surface) |
| Body | `flex flex-1` |
| Side | `sticky top-0 h-dvh self-start shrink-0` + `max-[56rem]:hidden` |
| Main | `min-w-0 flex-1 focus:outline-none`, permanent `tabIndex={-1}` |
| Bottom | `sticky bottom-0` + `min-[56rem]:hidden` |

`bg-bg-canvas` is `--color-bg-canvas` (surface-0, "Fondo base de pantallas y apps", `theme.css:61`) — the only paint AppShell owns. Regions bring their own Material (Sidebar/TabBar Surface recipe, ModuleRail hairline), so AppShell adds **no** Surface import, border, sheen, shadow, blur or overlay. No new tokens are required by this recipe (see the flagged gap in section 4, which concerns a breakpoint key only). No stylesheet, no `@layer components` rule, no numeric geometry and no exception to any documented geometry exception.

## 7. Accessibility

- **Landmarks:** exactly one `main` (named by nothing, AppShell-owned) around `children`; root and all wrappers are `div`s with no role; no AppShell `banner`, `complementary`, `contentinfo` or `navigation`. All navigation landmarks come from the supplied organisms, which each expose their own (`NavList` navs, ModuleRail `nav`, TabBar `nav`).
- **Hidden-variant semantics:** the inactive region is `display: none` through the media variants, so it leaves **both** the accessibility tree and the tab order. The contract forbids visually-hidden-but-focusable hiding; the plan explicitly rejects `sr-only`/`invisible`/`opacity-0` for the regions. Both organism trees stay mounted, so each keeps its own internal state across a breakpoint change (a TabBar focus inside a region that a resize hides is *not* repaired by AppShell — accepted, D6/D7 behaviour, to be observed in the browser and reported, not promised).
- **Skip link:** rendered only when `sideNavigation` is supplied, the first focusable element, `sr-only` until focused (never a `VisuallyHidden` component, which excludes focusable skip links), gated to ≥56rem in `switching`. Activation prevents the default fragment jump, focuses `main` (`tabIndex={-1}`, unique `useId()` id) and leaves the URL unchanged; the native `href` still works before hydration. `main` shows no focus ring by design; the next Tab continues inside content.
- **Focus order:** native DOM order — skip link → side region → `main` content, or `main` content → bottom region. No roving keys, trap, Escape handling or focus restoration, no live regions, no breakpoint-triggered announcement.
- **Reduced motion:** AppShell owns no transition, animation or transform, so `motion-reduce` variants are not needed at this level; Button and TabBar keep their own reduced-motion recipes unmodified. The plan's CVA scan asserts no `transition-`/`animate-`/`duration-` utility in the template's own recipes.
- **RTL:** logical properties only (`self-start`, `m-2`), so the side region and skip link sit at the inline start with `dir="rtl"`.
- **jsdom limit, stated up front:** unit tests cannot evaluate the compiled media queries, so accessibility-tree and tab-order exclusion are **browser** checks, never jsdom claims.

## 8. Dependency verdict

**No new dependency.** AppShell imports only `react` (types, `useId`, `useRef`), `class-variance-authority`, `@/lib/cn` and the existing `Button` atom (which already uses the installed `@radix-ui/react-slot` for `asChild`). It imports no Radix primitive directly, no organism, no Surface, no VisuallyHidden, no Dialog/Portal, and no `matchMedia` polyfill. `packages/ui/package.json`, the lockfile and peer ranges are untouched — there is no "NEW DEPENDENCY — separate owner confirmation required" item in this plan.

## 9. Test-first sequence

Applicable, deterministic and behaviour-level, so ODD test-first applies. Subject to separate runtime authorization, in this order:

**RED** — add failing tests for the contracted observable behaviour before any implementation:

1. `packages/ui/src/templates/app-shell/AppShell.test.tsx` (new; `render`/`renderHook`/`screen`/`userEvent`, roles and names only, no full class snapshots):
   - AC-01: root is a `div` with `eg-app-shell`, no `role`; DOM order skip row → body (side, main) → bottom; exactly one `main`; no `navigation`/`complementary`/`banner`/`contentinfo` introduced by AppShell.
   - AC-04: both / side-only / bottom-only / neither arrangements render the expected regions; the class contract of the switching arrangement is present (side `max-[56rem]:hidden`, bottom `min-[56rem]:hidden`, skip row `hidden min-[56rem]:block`), and absent for single-slot arrangements.
   - AC-07/08/09: skip link exists only with `sideNavigation`; default text `Skip to content`; `messages.skipToContent` replaces text and accessible name; unique `href`/`main` id per instance; `main` has `tabIndex={-1}`; activation prevents default, focuses `main`, leaves `window.location.hash` unchanged; `focus:outline-none` present.
   - AC-12/13: root keeps `eg-app-shell` while a consumer `className="min-h-full m-4"` merges last; `role`/`children` cannot be overridden through native props (type-level negatives, `@ts-expect-error` only with a written reason).
   - AC-05: no media/resize listeners are registered (spy on `matchMedia`, `ResizeObserver` and `addEventListener`), and the hook returns no viewport state.
   - AC-11 (structural half): no `contain`, `transform`, `filter`, `isolation` or explicit `z-index` utility in the template's own recipes.
2. `packages/ui/src/lib/app-shell-docgen.test.ts` (new, modelled on `sidebar-docgen.test.ts`): real `react-docgen-typescript` output, `children` required, `control === false` and `table.disable !== true` for the four own props, no fabricated `defaultValue`, `mapJSDocControls` diagnostics empty.
3. `scripts/package-exports.test.mjs`: emitted-CSS test in the SectionHeader style — scan every string literal in the template's CVA calls, assert each utility exists in `packages/ui/dist/styles.css`, assert the `min-[56rem]`/`max-[56rem]` selectors sit inside an at-rule whose prelude contains `56rem` (regex tolerant of the observed `>=` / `≥` / `not all and` spellings), assert `bg-bg-canvas`, `text-fg-default`, `font-sans`, `min-h-dvh`, `h-dvh`, `sticky`, `top-0`, `bottom-0`, `self-start`, `shrink-0`, `min-w-0`, `flex-1`, `sr-only`, `focus-within:not-sr-only`, `focus:outline-none` are emitted, and assert no `app-shell.css` exists.
4. `scripts/package-consumption.test.mjs`: typed props fixture, SSR string stability for the same props, hydration without viewport-dependent markup, type-level negatives (`useAppShell` and part recipes not public, `role`/`children` not overridable, no `layout`/`breakpoint`/`asChild`/`ref`), and a no-consumer-Tailwind case proving the layout survives without a consumer compiler.

**GREEN** — add the minimum implementation (`types.ts` → `useAppShell.ts` → `AppShell.tsx` → `index.ts`) plus the parent-owned integration lines, then the focused tests pass.

**PRESERVE** — for every touched shared surface: `Button` keeps its own behaviour and class surface (assert the skip link renders a native `a` with `eg-btn` and the secondary recipe, without changing Button), `packages/ui/src/index.ts` keeps every existing export (sorted list test), `compiled.css` keeps all existing `@source` lines, `.storybook/preview.css` keeps all existing sources, and the prop-naming receipt case ("template naming receipt pins the organism receipt and binds two new layout slots") still passes. Because the diff touches shared parsers/lists that other components read (`packages/ui/src/index.ts`, both package test lists, `compiled.css`, `preview.css`), run one differential check before finishing: build the previous main (`d76732e`) into a `mktemp -d` scratch directory and compare the emitted `@source` lines, the exported-name list and one sibling component's emitted CSS block against the change; any difference nobody asked for is a regression and gets pinned, not explained away.

**REFACTOR** — only while green: module-private recipe naming and JSDoc wording.

Verification commands (exact, focused first; the parent authorizes the broad set and owns installs/build/browser):

```
pnpm exec vitest run packages/ui/src/templates/app-shell/AppShell.test.tsx
pnpm exec vitest run packages/ui/src/lib/app-shell-docgen.test.ts
pnpm build
pnpm test:package-exports
pnpm test:package-consumption
pnpm typecheck
pnpm lint
pnpm test
pnpm props:check
pnpm test:props
python3 scripts/build_catalog.py
```

`pnpm test:tokens` / `pnpm tokens` run only if owner picks token gap option B. Browser evidence (AC-03/06/10/11/16) is parent-owned: 895/896px viewport widths, accessibility-tree and tab exclusion of the hidden region, sticky geometry with long and short documents, no content overlap, RTL, 200%/400% zoom, and pre-hydration fragment navigation. Screen-reader and pixel comparison remain **not evaluated** unless explicitly performed; captures are never behaviour evidence.

## 10. Stories and Controls

`Meta<typeof AppShell>` / `StoryObj` from `@storybook/react-vite`, `title: 'Templates/AppShell'`, `tags: ['autodocs']`, no manual `argTypes`, no `play`, no renderer adapters. Contract story matrix, real organisms only, neutral placeholder page content from existing system components:

`SidebarAndTabBar` (Sidebar with NavLists + TabBar, `switching`), `ModuleRailAndTabBar`, `SideOnly`, `BottomOnly`, `ContentOnly`, `LongContent`, `NarrowViewport`, `SkipLink`, `Localized`, `RTL`.

- The story **is** the full-viewport host: AppShell's root is `min-h-dvh`, so the story iframe's scrollport is the document scrollport and sticky regions behave realistically. Do **not** wrap the component in a bordered card, a `h-96` frame or a transform/overflow shell — those would replace the viewport scrollport and falsify docking. `NarrowViewport` reuses the existing viewport parameter pattern from `TabBar`'s `FixedInViewport` (`parameters: { viewport: { defaultViewport: 'mobile1' } }`); confirm it still works in the installed Storybook at implementation time. `SkipLink` documents tab-to-focus; no focused-element fakery.
- `LongContent` must actually overflow (many real rows) so scroll and no-overlap are observable, and `NarrowViewport`/`RTL` must show the real regions, not placeholders.
- **Story-only utilities need their own scan line:** `.storybook/preview.css` gains `@source "../packages/ui/src/templates/app-shell/AppShell.stories.tsx";` (organism stories are not covered by the existing `molecules/**/*.stories.tsx` glob), and `packages/ui/src/lib/storybook-css.test.ts` pins that line plus the story layout utilities it actually uses. Production utilities come from `packages/ui/src/styles/compiled.css` scanning `types.ts`, never from story scanning.
- Controls: the four own props show `control: false` with reasons and no injected optional args; `Default` supplies required `children` only.

## 11. Repository integrations (parent-owned surfaces)

| Surface | Change |
| --- | --- |
| `packages/ui/src/index.ts` | New `// Templates` section with `export * from './templates/app-shell';` after the organisms block |
| `packages/ui/src/styles/compiled.css` | `@source "../templates/app-shell/types.ts";` (templates are not scanned today) |
| `.storybook/preview.css` | `@source "../packages/ui/src/templates/app-shell/AppShell.stories.tsx";` |
| `scripts/package-exports.test.mjs` | Sorted runtime export list adds `AppShell` (after the `AlertDialog*` entries, before `AspectRatio`) and `appShellVariants` (before `badgeVariants`); sorted type list adds `AppShellMessages`, `AppShellProps` (same position); runtime and type-level negatives for `useAppShell` and the private part recipes (a multi-part recipe object is asserted as `typeof === 'object'` with sorted slot keys `['body','bottom','main','root','side','skip','skipLink']`, the same shape the existing multi-part recipe assertions use); the new emitted-CSS test; no-stylesheet assertion |
| `scripts/package-consumption.test.mjs` | Consumer list adds `AppShell` (same sorted position); typed fixture, SSR/hydration sample and type negatives as in section 9 |
| `packages/ui/src/lib/storybook-docgen.test.ts`, `packages/ui/src/lib/storybook-controls.test.ts` | Add `AppShell` and `appShellVariants` to the public-API export list expectations; the four own props' controls are asserted in the dedicated `app-shell-docgen.test.ts` |
| `packages/ui/src/lib/storybook-css.test.ts` | Preview `@source` line plus the story layout utilities |
| `scripts/catalog_data.py` → `python3 scripts/build_catalog.py` | Update the `AppShell` template row note (line 113) to name the implemented template, composing organisms, plan and remaining verification; regenerate `docs/CATALOGO.md` and `docs/catalog.json`; never edit generated files by hand |
| `skills/_shared/prop-naming.json` → `pnpm props:docs` | Append the three reviewed usages (section 3) |
| `docs/components/app-shell/v0.1/owner-approvals.md` (new, at approval) | Owner answers to section 14, including any token decision |
| `docs/components/app-shell/v0.2/*` | Untouched |

No other file changes. No dependency, lockfile, token, workflow, legend or legacy-CSS change.

## 12. #128 evidence consolidation — what is recorded where

[#128](https://github.com/egdev6/egdev-design-system/issues/128) retains its documentation/evidence scope: it consolidates the AppShell specimen and capture conditions, the two delegated naming conventions, the generated naming reference and the receipt-chain tests, and it explicitly excludes template implementation. It is **not** duplicated, re-scoped or closed here.

| #128 item | Canonical record | Status for this plan |
| --- | --- | --- |
| VIS-01 specimen + capture conditions | `docs/design/foundation-boards/v2026-10-18-wave4/specimens/app-shell--specimen.png` (`27439a76…a43c1d`) and `…/capture.json` (Chromium 148/Linux, 1280×900, DPR 1, PNG 1265×1566, `reducedMotion: false`, theme and reduced-transparency unrecorded) | Existing; cited in section 13 and in the implementation evidence. **No recapture.** |
| VIS-02–VIS-04 supporting references | `…/v2026-10-18-wave3/specimens/sidebar--specimen.png`, `…/v2026-10-18-wave3/ModuleRail.png`, `…/v2026-10-18-wave3/TabBar.png`; board conditions in the two `capture.json` files | Existing; supporting region Material/width only, never AppShell parity |
| Wave-3 `capture.json` entries | `docs/design/foundation-boards/v2026-10-18-wave3/capture.json` (board entries) and `…/specimens/capture.json` (per-specimen entries) | **Contains no AppShell entry** — AppShell's capture record lives in wave 4. Recorded as a factual correction, not a scope change; nothing is added to wave 3 |
| Two naming conventions | `skills/_shared/prop-naming.json` (`side-navigation`, `bottom-navigation`, approved, empty usages) + receipt `docs/decisions/prop-naming-template-specs-approval.json` | Unchanged by the plan; usages appended only after `types.ts` exists |
| Generated naming reference | `docs/prop-naming.md` via `pnpm props:docs` | Regenerated from JSON only |
| Receipt-chain tests | `scripts/prop-naming.test.mjs` (existing template-receipt case) | Must keep passing; no new receipt, no replacement case |
| Historical publication log | `odd/tasks/template-specs.md` and `odd/tasks/organism-specs.md` | Read-only history; untouched |
| Contract approval identity | #130 body + approval comment hashes (section "Authority and gates") | Recorded here and in the implementation PR; **#128/#130 state, labels and closure stay parent-owned** |
| Naming/evidence gaps #128 cannot supply | No native/signed approval receipt, no remote-accessibility or publish-time verification claim | Recorded as limits; not invented |

Concretely, this plan is where the #128 reconciliation is *stated*; the implementation PR carries the observed-evidence rows (emitted CSS, package exports/consumption, browser checks) and the untouched #128 assets are referenced, never recreated.

## 13. Risks

1. **Arbitrary media variants are unpinned by default.** Mitigation: the emitted-CSS test asserts selectors *and* the `56rem` at-rule prelude in the production artifact; a missing at-rule is a hard failure, not a silent no-CSS layout.
2. **jsdom cannot prove media behaviour.** Hidden-region accessibility-tree/tab exclusion, sticky geometry and RTL need the parent's browser run; the plan states that limit instead of implying unit coverage.
3. **Storybook vs real viewport scrollport.** Story decorators with `h-96`, `overflow` or transforms would falsify docking; the plan forbids them for AppShell stories and relies on the iframe viewport.
4. **Resize while focus is inside a hidden region** is not repaired (approved behaviour). It is observed and reported, not fixed by adding focus relocation.
5. **`sticky bottom-0` in-flow docking** is the contract's non-overlap mechanism; if any real browser disagrees, the correct action is to report the discrepancy for owner review, not to switch to `fixed` plus clearance padding or a JS alternative.
6. **Consumer `className`/`style` re-docking** can break the promise; documented as unsupported, tested only for the supported sizing/margin merge.
7. **Organism API drift** (props renamed since their merges) blocks realistic stories; stop and report rather than inventing wrapper props.
8. **Token-gap indecision**: if the owner picks option B, the tokens dist parity test fails until `pnpm tokens` runs and the 214/286 pins move; the parent must sequence that rebuild inside the same change.
9. **Visual conformity stays Not evaluated** until someone compares stories against VIS-01 under recorded conditions; no capture is created by this plan.

## 14. Owner questions (closed options, each with a recommendation)

1. **Approve this plan and its edit surfaces?** Options: (a) approve plan + implementation + the parent-owned integration surfaces in section 11 — **recommended**; (b) approve the plan but leave the catalog row to a follow-up PR; (c) request changes before code. Recommended: (a) — the catalog row is generated from `catalog_data.py` and drifts if split.
2. **Token gap (section 4).** Options: (a) keep the approved arbitrary `min-[56rem]:`/`max-[56rem]:` and add no token — **recommended** (contract-faithful, no token/amendment/rebuild, pinned by an emitted-CSS test); (b) add `--breakpoint-app-shell-split: 896px` beside `--breakpoint-section-header-split`, use `app-shell-split:`/`max-app-shell-split:`, move the 214/286 pins to 215/287 and rebuild the tokens dist. Do not silently substitute a different value (e.g. 960px) in either case.
3. **Where are the owner approval and observed evidence recorded?** Options: (a) `docs/components/app-shell/v0.1/owner-approvals.md` for decisions plus the PR description for observed gates — **recommended** (mirrors the organisms-wave precedent, keeps evidence next to the approved plan); (b) both in a single `docs/components/app-shell/v0.1/implementation-evidence.md`; (c) PR description only.
4. **Keep the `v0.2/` preparation notes as they are?** Options: (a) keep untouched and referenced from v0.1 — **recommended** (they are recoverable preparation history and must not be rewritten); (b) supersede them with a pointer note.
5. **#128 handling.** Options: (a) leave #128 open and let the parent reconcile its tracking after delivery — **recommended** (its scope is evidence consolidation, not this implementation; closing it needs separate authority); (b) close it with this PR, only if the owner grants that explicitly.

## 15. Review burden and stop point

Estimate only: six core files ≈ 200–280 authored lines excluding tests; `AppShell.test.tsx` ≈ 220–300; stories ≈ 160–240; parent integrations ≈ 90–160; **≈ 670–980 authored runtime lines**, plus regenerated catalog/registry views. Review the CVA/slot recipes, the test contract, the real organism compositions, and the CSS/consumer integrations as four distinct responsibilities; the parent owns delivery slicing and git.

This plan ends here. No source, test, token, dependency, catalog, registry, capture or git change was made, and no gate was executed for this document.
