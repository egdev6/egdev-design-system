# Sidebar v0.1 — implementation plan

**Owner decisions, 2026-11-01:** The owner approved the nine organism plans with recommendations and replaced ProductMark with a consumer-supplied node (Logo, Avatar or other), name and optional home destination shared by Sidebar and ModuleRail. The ProductMark prerequisites, monogram validation and ProductMark rendering assumptions below are historical and superseded. See [product identity amendment](product-identity-amendment.md) for the separate naming approval. ScrollArea is already a direct UI dependency. The plan's other composition and Material boundaries remain applicable.

## 1. Authority and gates

- **Status:** Owner-approved plan with the consumer identity amendment above. [Issue #123](https://github.com/egdev6/egdev-design-system/issues/123) is the v0.1 contract; its [owner approval record](https://github.com/egdev6/egdev-design-system/issues/123#issuecomment-6251599325) approves the identified full snapshot and scoped visuals, not this plan, dependencies, tokens or implementation. Canonical contract SHA-256: `fba24ddd604a3fafe033f6bc6fbae0c7ad6f540c14a87f28fe5a678646bc227b`. Its historical Draft/Pending headers are superseded only as explained in that record.
- **VIS-01:** [Sidebar specimen](../../../design/foundation-boards/v2026-10-18-wave3/specimens/sidebar--specimen.png), SHA-256 `214e4a0ebb531561935419d309990d81eda88a29adef27b6825246cb9528e805`; source `sidebar.specimen.html` and conditions are recorded in the adjacent `capture.json`. It is static expected design, not runtime proof. **VIS-02:** [ModuleRail board](../../../design/foundation-boards/v2026-10-18-wave3/ModuleRail.png), SHA-256 `10bb0733c96c98d4f3b79a1c9c1f3e3ba073c81f283601b43b395d6372686703`, supports only the ProductMark tile and side-panel Material; rail layout, dots, add button and shadow are excluded. Compare only the approved scenarios under equivalent recorded conditions. Visual conformity: **Not evaluated**.
- Surface and NavList are available. The former ProductMark prerequisite is superseded by the owner-approved consumer artwork slot; do not implement a replacement component.
- **Dependency:** the existing direct `@radix-ui/react-scroll-area` dependency provides `type="auto"`, vertical scrolling. No install or dependency change is authorized.
- No new tokens, dependency mutation or stylesheet. Resolve any missing token or incompatible prerequisite with the owner; do not clone a Material recipe.

## 2. Future edit surfaces, subject to separate authorization

Six meaningful files under the existing organism level `packages/ui/src/organisms/sidebar/`:

| Path | Planned responsibility |
| --- | --- |
| `packages/ui/src/organisms/sidebar/types.ts` | `SidebarProps`, documented own props and static `sidebarVariants` part recipes. |
| `packages/ui/src/organisms/sidebar/useSidebar.ts` | Product validation and development warning, Surface variant calls and per-part `cn()` composition. |
| `packages/ui/src/organisms/sidebar/Sidebar.tsx` | JSX-only root, optional header, ScrollArea body and optional footer. |
| `packages/ui/src/organisms/sidebar/Sidebar.test.tsx` | Public behavior, composition, typing and contract regression tests. |
| `packages/ui/src/organisms/sidebar/Sidebar.stories.tsx` | `Organisms/Sidebar` stories and autodocs. |
| `packages/ui/src/organisms/sidebar/index.ts` | Named `Sidebar`, `SidebarProps` and `sidebarVariants` exports. |

**No stylesheet.** No extra internal modules. Integration surfaces for a later authorized transaction: `packages/ui/src/index.ts` for public exports; `packages/ui/src/styles/compiled.css` build scanning configuration if the existing scan does not cover these static sources; `packages/ui/src/lib/storybook-docgen.test.ts` and `packages/ui/src/lib/storybook-controls.test.ts` for metadata integration; `scripts/catalog_data.py` and generated `docs/CATALOGO.md` / `docs/catalog.json` for the bounded catalog update; `skills/_shared/prop-naming.json` and generated `docs/prop-naming.md` for reviewed usage; `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` for public package and consumer checks. Reinspect actual scripts and ownership before any integration. If ScrollArea is not a direct dependency, a separately approved dependency change also affects `packages/ui/package.json` and the pnpm lockfile.

The shared `ProductIdentity` definition lives in `packages/ui/src/types/product-identity.ts`, exported once for Sidebar and ModuleRail.

## 3. Composition, API and behavior

- The root is a native `div`, not `aside` or `nav`, with stable `eg-sidebar` and no landmark role. Header is omitted without a valid product name. The consumer supplies a decorative, non-interactive node (Logo, Avatar or other) with no focusable descendants. Optional `href` makes it the native home link named by `product.name`; the adjacent visible name is hidden from assistive technology in that case so the name is announced once.
- `children` supplies one or more individually labelled **NavList #92** instances or other in-flow content. NavList owns link data, `aria-current="page"`, group disclosure and its Radix behavior; the consumer owns route selection and native/client navigation. Sidebar must not duplicate those APIs or add nested navigation landmarks. The inspected NavList types provide labelled landmarks and collapsible groups. Collapsible is not a Sidebar-wide disclosure engine.
- `footer` is an optional pinned slot for utility controls and metadata, not navigation. Consumers may compose a named **IconButton**, or a Menu-based account recipe with Avatar where available; Menu's account recipe is internal in the inspected types, not a public UserMenu API. Do not import private recipe internals or make a UserMenu promise. Settings destinations belong to a NavList group in the body. Components retain their own public markers.
- ScrollArea Root, Viewport, vertical Scrollbar and Thumb manage scrolling and scrollbar interaction; no custom wheel, touch, focus or keyboard engine, Portal or `asChild`. Header and footer remain pinned while the body scrolls. Viewport adds no tab stop; consumer is responsible for non-focusable overflowing content. Native Tab order is product link, body controls, then footer controls; focused links should scroll into view.
- Sidebar itself has **no collapse/expand** state or control, and no active-route logic. NavList group disclosure is separate. AppShell/consumer owns hiding, focus management, positioning and breakpoints; ModuleRail #124 is a separate compact rail and TabBar #125 a separate mobile navigation option. AppShell #130 remains parked until the three organisms exist. Sidebar fills host height (`h-full`), defaults to token-based `w-64`, and exposes layout-only root `className`; it makes no automatic breakpoint or replacement decision.

### Public contract and naming

```ts
type ProductIdentity = { node: ReactNode; name: string; href?: string };
type SidebarProps = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'role' | 'dangerouslySetInnerHTML'> & {
  product?: ProductIdentity;
  children: ReactNode;
  footer?: ReactNode;
};
```

`product` is optional; absence omits header. A blank `name` omits the header and warns in development; never invent a name. The consumer node is non-interactive and decorative. Optional `href` gives the mark a native link. `children` is required and `footer` optional; absent footer means no band. Forward compatible root native attributes and events; omit `role` and dangerous HTML, expose no ref, `asChild`, part prop bags, own callbacks, `open`, `collapsed`, `size`, tone or elevation. Test both types and runtime boundaries without inventing additional restrictions. `className` supports width/min/max-width, margins and placement only; merge last with `cn()`, preserve `eg-sidebar`, and do not promise universal `twMerge` or appearance overrides.

The contract maps `footer` to `panel-footer`; `href` has native anchor meaning. The old monogram convention is superseded. `children`, inherited native props and `className` are not new own naming conventions. `product` uses **`product-identity`**, the new-concept candidate recorded in the issue, with the issue's recorded assistant-applied convention acceptance; that record is not independent per-convention owner review. No additional candidate or exception is proposed. Before implementation inspect the current [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md) by meaning/name/aliases, reconcile status and any drift, and obtain any required separate convention review. After source review append only applicable Sidebar usages with `source.path`, `symbol` and actual whole-file `sha256:`; never invent revisions or auto-migrate peers. Regenerate the view from JSON, then run `pnpm props:check` and `pnpm test:props` when authorized.

## 4. Material and token recipe

Static token-backed CVA utilities in `types.ts`, composed per part with `cn()` in the hook; no interpolated classes, inline appearance, hand-authored shadows/gradients or new tokens. Verify each referenced utility against current token/build output rather than assume the issue's historical token inventory is current.

| Part | Contracted treatment |
| --- | --- |
| Root | `eg-sidebar box-border flex h-full w-64 min-h-0 flex-col`, plus unmodified `surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' })`. Surface owns sheen, light edge and all four hairlines, no drop shadow; the docked inline-end edge separates content in LTR and RTL. |
| Header / name | `flex items-center gap-3 px-4 pt-5 pb-4`; `min-w-0 truncate font-display text-heading-small text-fg-default`. Padding protects focus; preserve the full accessible name when visually truncated. |
| Body / viewport / content | `relative min-h-0 flex-1 overflow-hidden`; `size-full` viewport; `px-3 pb-4`, adding `pt-4` when header absent. Padding protects body focus rings. |
| Scrollbar / thumb | `flex w-2 touch-none select-none p-0.5 data-[state=hidden]:hidden`; `relative flex-1 rounded-full bg-border-hairline-strong`. Radix owns its state and geometry; logical-end placement must work in RTL. |
| Footer | Unmodified `surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' })` plus `flex items-center gap-2 px-4 py-3 font-sans text-label-default text-fg-muted`; its all-side hairline reads as a top separator. |

Do not subtract Surface borders, add rail shadows, introduce overlay/blur or copy Gauge's special frame exception. No Sidebar motion is prescribed. **Token gap:** none established by this bounded inspection; actual availability and static scan coverage remain implementation gates, not verified facts.

## 5. Test-first implementation and integration

After gates and a fresh source/working-tree inspection, add behavior tests through public interfaces and record intended RED before implementation. Then implement minimally, run focused tests GREEN, preserve affected existing behavior, and refactor only while green. Planned checks, not observed results:

1. AC-01–04: root `div`/marker and header/body/footer order; no Sidebar landmark; two separately named child NavLists; passive and linked product accessible names with one announcement and native href; absent/blank product omits header and blank warns in development. Verify consumer artwork and the full product name without ProductMark-specific validation.
2. AC-05–08: optional footer and no empty band; overflow versus short body, pinned header/footer, no extra viewport tab stop, Tab/Shift+Tab order and focus scrolling. Browser geometry and real keyboard checks establish scroll containment and unclipped focus; DOM-only tests cannot prove them.
3. AC-09–11: exact unmodified Surface calls and token recipe, LTR/RTL logical edge and scrollbar, valid root layout class merge and marker retention, forbidden role/dangerous HTML type boundary, native attributes, long-name truncation and unchanged accessible name. Verify Surface and NavList existing behavior remains unchanged; do not change their implementation.
4. AC-12–14: static CVA and Surface sources included in actual CSS build; exported package consumer without a Tailwind compiler on React 18 and 19; owned metadata extraction/enhancer/inference with zero diagnostics and actual browser Controls; 200%/400% zoom, narrow host, focus visibility and reflow. Verify normal keyboard use and touch targets of composed controls; no accessibility certification follows from unit tests.
5. Parent integrates public exports, catalog source and generated artifacts; inspect existing package-test harness before adding cases. Run focused tests first, followed by parent-authorized full Verify set, package consumption, `pnpm props:check` and `pnpm test:props`. Exact runners and build/install permissions must be authorized for the implementation transaction. Record outcomes separately from owner approval.

## 6. Storybook and owner decisions

Use `Meta<typeof Sidebar>` / `StoryObj`, autodocs, `Organisms/Sidebar`, no manual `argTypes`, renderer adapters or `play`. Stories: **Default**, **LinkedProduct**, **WithFooter**, **Overflow**, **WithoutProduct**, **LongProductName**, **RTL**. Default does not override defaults; use required/example args only. Document each own prop in English with `@control false` and concrete reasons for non-serializable `product`, `children`, `footer`, pointing to dedicated stories; no fabricated defaults. Verify real docgen, installed central enhancer/inference and browser widgets independently.

**Historical questions, resolved by the owner decisions above:**

1. Approve this plan and its later implementation/integration surfaces, subject to the shared-type location being resolved with the parent?
2. Approve `@radix-ui/react-scroll-area` as a direct UI dependency if the current manifest lacks it, or select the recorded native-scroll fallback and reconcile its effects?
3. Confirm that ProductMark #64 and Surface #106 availability/API are prerequisite gates; schedule or resolve ProductMark rather than replacing it with Logo. Confirm the shared `ProductIdentity` coordination with ModuleRail before either duplicates it.
4. Confirm any needed separate review of the recorded `product-identity` convention and its later usage evidence. If token or Surface/ScrollArea incompatibilities emerge on reinspection, stop for a specific decision instead of changing this approved contract silently.

No runtime tests, CSS build, browser/AT checks or package-consumer verification were performed for this documentation plan.
