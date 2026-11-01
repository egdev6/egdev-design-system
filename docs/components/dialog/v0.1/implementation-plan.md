# Dialog v0.1 — implementation plan

**Status:** Owner-approved implementation plan (2026-11-01; [approval record](../../organisms-wave/v0.1/owner-approvals.md)). Covers organism-wave S2–S4 / O1. [Issue #119](https://github.com/egdev6/egdev-design-system/issues/119) is the approved v0.1 contract; the [owner full-contract approval record](https://github.com/egdev6/egdev-design-system/issues/119#issuecomment-6251587415) supersedes historical Draft/Pending identity declarations, not substantive promises. Canonical payload SHA-256 `d5251ade0cc5ce07d99199b68250b698e05bcc9cf03e893487b094ce83d212b6`; frozen body SHA-256 `db4d16ae8199164644159bc66535bbe55da59ce9a652d089b601cd52617f0d13`. The issue approval is a manual record of a forwarded owner grant, not a native signed receipt. Separate plan and dependency approvals are recorded above; neither establishes runtime conformity or approves token changes.

## 1. Gates and dependency

- The owner approved the plan and separately confirmed the aligned dependency versions; token changes remain outside scope.
- **Owner-confirmed dependency:** `@radix-ui/react-dialog@1.3.1`, pinned in `packages/ui/package.json`, supersedes the proposed 1.1.15 under the owner's “Alineadas” decision (2026-11-01; `odd/tasks/organisms-build.md` L12). No fallback reimplementation of focus, scroll locking or ARIA.
- Verify the actual public exports, ref forwarding and runtime behavior of Surface, IconButton, Icon and Button against their current implementations before code. Their inspected `types.ts` files support the required prop shapes; types alone do not establish runtime or barrel availability. Reconcile drift without changing the approved contract silently.
- No token changes are planned. Verify that the approved token references, especially `bg-bg-scrim/72`, width calculations and static motion variants, compile and render as specified; stop for owner confirmation if a genuine token or recipe gap appears.

## 2. Approved implementation inventory

| Path | Responsibility |
| --- | --- |
| `packages/ui/src/molecules/dialog/types.ts` | Public types, union branches, English JSDoc/Controls, static marker-free per-part CVA recipes and internal `dialogScrimVariants`. |
| `packages/ui/src/molecules/dialog/useDialog.ts` | Root/Trigger/Content/Close preparation, description relationship and per-part marker + recipe + `cn()`; no duplicate visibility state. |
| `packages/ui/src/molecules/dialog/Dialog.tsx` | JSX-only Radix tree and composed Surface/IconButton/Icon. |
| `packages/ui/src/molecules/dialog/Dialog.test.tsx` | Behavior, types, refs, markers and composition tests. |
| `packages/ui/src/molecules/dialog/Dialog.stories.tsx` | Autodocs and specified stories. |
| `packages/ui/src/molecules/dialog/index.ts` | Named component and public type exports; no shared recipe barrel exports. |

**No stylesheet.** No extra internal modules. Shared integration surfaces for this approved implementation: `packages/ui/package.json` and lockfile for the separately confirmed dependency; `packages/ui/src/index.ts` for molecule exports; `scripts/catalog_data.py` and generated `docs/CATALOGO.md` / `docs/catalog.json` for catalog availability; `skills/_shared/prop-naming.json` and generated `docs/prop-naming.md` for reviewed usages; `packages/ui/src/lib/storybook-docgen.test.ts`, `packages/ui/src/lib/storybook-controls.test.ts`, `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` for scoped integration evidence. Use the assigned edit surfaces; do not hand-edit generated artifacts or modify peers, legacy CSS or tokens.

## 3. Anatomy, API and conventions

Use namespace import `* as DialogPrimitive` from the individual package. Root is always modal and has no DOM; Trigger, Portal, Overlay, Content, Title, Description and Close use Radix. Overlay wraps the panel in the scrollable-overlay pattern. `Content asChild` renders an actual Surface; preserve injected props and ref. Built-in `Close asChild` wraps `IconButton` (`label={dismissLabel}`, `icon={<Icon name="close" />}`, `variant="ghost"`, `size="lg"`), last in DOM but visually at header inline-end. Radix owns focus, dismissal, scroll lock, outside hiding and relationships. The standalone Portal wrapper is not used: Dialog's Radix Portal mounts in `document.body`, without a container API. Trigger/Close can slot compatible ref-forwarding Button or IconButton; consumers compose Button and ButtonGroup in actions. Heading/Text's inspected recipes are display-scale and do not expose the specified heading-small recipe; use Radix Title as the native `h2` and Description as `p`, with the specified token utilities rather than forcing an incompatible Heading/Text variant.

| Public part / prop | Contract and naming registry mapping |
| --- | --- |
| `Dialog.children` | Required ReactNode; one optional Trigger and one Content. |
| `Dialog.open`, `defaultOpen`, `onOpenChange` | `open-state`, `initial-uncontrolled-open`, `open-change`: controlled boolean or uncontrolled initial false; callback requests changes and never echoes incoming updates. |
| `DialogTrigger` / `DialogClose` `children`, `asChild` | Required ReactNode, or one ReactElement when `asChild: true` (`slot-composition`); default false. Native button `type="button"`; React 18-compatible forwarded button refs. |
| `DialogContent.title` | Required non-empty localized string, visible `h2`, `heading-title`. |
| `description` | Optional visible string; omitted means no description and `aria-describedby={undefined}`; `dialog-description`. |
| `statusText` | Optional passive non-live header string; `header-status-text`. |
| `children`, `actions` | Required body ReactNode; optional `trailing-actions` ReactNode, absent means no footer. |
| `dismissLabel` | `dismiss-label`, string default `Close`. |
| `variant`, `size` | `visual-treatment`: centered default or sheet. `preset-dimensions`: centered sm/md/lg/full, default md; `size?: never` on sheet. |
| `className` | Inherited on Trigger/Content/Close; Content supports non-appearance layout only, not width, paint, radius, padding, focus or positioning overrides. Trigger/Close allow control composition while retaining focus and target requirements. `cn`/`twMerge` handles recognized groups, not universal cascade precedence. |

Root has only own props and no ref or DOM spread. Trigger and Close use discriminated `asChild` unions plus native button props omitting `children`, `type`, `dangerouslySetInnerHTML`, `style`. Content inherits div props omitting `title`, `children`, `role`, `aria-labelledby`, `aria-describedby`, `aria-modal`, `tabIndex`, `style`, `dangerouslySetInnerHTML`, `contentEditable`; compatible id, remaining aria/data and events pass to the panel. No Content ref, asChild, forceMount, autofocus/dismissal-cancel hooks, modal, side or container. Export `Dialog`, `DialogTrigger`, `DialogContent`, `DialogClose` and `DialogProps`, `DialogTriggerProps`, `DialogContentProps`, `DialogCloseProps`, `DialogSize`, `DialogVariant`.

The contract's newly introduced convention candidates `dialog-description` / `description` and `header-status-text` / `statusText` already carry `approved` entries and the organism naming receipt in the published snapshot; that receipt is assistant-applied acceptance under delegation, not independent per-payload owner review. Do not create duplicates or claim this plan grants new convention approval. Recheck current [registry](../../../../skills/_shared/prop-naming.json) and aliases before code. Append matching usages only after inspecting the final `types.ts` symbols and recording its actual whole-file SHA-256; run `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` as separately authorized integration. No invented source hashes or migrations.

## 4. Material, layout and interaction

- Surface alone paints centered panels with `tone="surface-2" elevation={3} radius="xl" padding="none"`; full uses `radius="none"`. Sheet uses `tone="overlay" radius="none" padding="none"`, with Surface's reduced-transparency and unsupported-filter solid surface-2 fallback. Never pass elevation to overlay.
- The internal marker-free `dialogScrimVariants` is paint only: `bg-bg-scrim/72 backdrop-blur-none`; no handwritten blur, gradient, shadow or color. Combine with a separate fixed inset grid layout, centered and padded `--space-6`; full and sheet remove padding. The scrim has no reduced-transparency blur fallback because it has no blur.
- Panel is flex-column, clipped, maximum viewport height; centered widths sm `calc(var(--space-24)*5)` (480px), md `calc(var(--space-20)*8)` (640px), lg `calc(var(--space-24)*10)` (960px), capped to available width; full fills viewport. Sheet is full-height inline-end with width capped at `calc(var(--space-24)*4)` (384px), mirrored in RTL. Body is `min-h-0 overflow-y-auto`; header/footer remain visible. Reserve the close target in the header.
- Header uses `py-[var(--space-4)] ps-[var(--space-6)] pe-[var(--space-4)]`, with no separator; title uses `font-display uppercase text-heading-small text-[var(--color-fg-default)]`; status `text-label-default`/`--color-fg-muted`; description `text-body-default`/`--color-fg-secondary`. Body uses `p-[var(--space-6)]`. Footer, only with actions, right-aligns with `px-[var(--space-6)] py-[var(--space-4)] gap-[var(--space-3)]`, top `--color-border-hairline` and `--color-surface-0` centered / `--color-surface-1` sheet.
- Static CVA recipes are marker-free for later package-internal reuse. Hook composes `eg-dialog-backdrop`, `eg-dialog`, `eg-dialog__head`, `eg-dialog__title`, `eg-dialog__body`, `eg-dialog__foot`, `eg-dialog__description`, `eg-dialog__status` on corresponding parts; no `--full`, `__spacer` or mirrored state classes. Verify shipped utility cascade overrides legacy rules, including blur and radius. Preserve legacy CSS.
- Enter opacity uses `--duration-fast`/`--ease-out` and Radix data-state; sheet also enters via logical RTL-aware translation. Immediate unmount on close, no exit-presence API. Reduced motion removes transitions and transforms. No z-index token: consumer owns stacking above positioned stacks; nested dialogs and subtree-scoped themes are out of scope.

## 5. Test-first sequence after approval

Add behavior-level tests first, observe intended RED, implement minimally, then GREEN; record actual evidence, not this plan as a result. Test public behavior/roles and contract effects rather than whole class strings.

1. AC-01–02: default closed; click, Enter, Space open a body-portalled modal named by native h2; description relationship only when present, unique IDs, passive status. Check trigger ARIA.
2. AC-03–05: initial focus first body tabbable or built-in close; Tab/Shift+Tab trap; outside content hidden and not activated, scroll lock. Escape, scrim pointer-down, built-in close and `DialogClose` each request false and restore Trigger focus; verify real browser behavior as well as DOM tests.
3. AC-06–08: controlled ignored close stays open, prop updates do not echo, uncontrolled initialization only once; trigger-less controlled open and documented consumer-owned restoration; close label/default, 48px ghost/lg, last DOM position and visual header placement.
4. AC-09–12: absent/present footer and respective tones; all sizes, viewport bounds, full, sheet LTR/RTL and sheet-size type rejection; long body scrolling with fixed header/footer; computed Surface, scrim no blur, fallback and reduced-motion behavior in browser.
5. AC-13–15: slotted Trigger/Close use one compatible named button, no nested buttons, type/ref fixtures including React 18/19; per-part markers, marker-free direct recipe outputs, omitted legacy modifiers, supported `cn` merges, emitted CSS/legacy cascade, bounded native props, exports and real docgen/Controls. Prove existing composed components' touched behavior remains intact.
6. AC-16: compare real runtime captures against approved VIS-01 and VIS-02 under comparable conditions; record each difference and allowed exception. Screen-reader testing and real browser focus, visual, RTL, motion and transparency checks remain separate from unit tests.

VIS-01 hash `d80802e8ffcb69dbcf383b508571f9573f9462fd9c385d86fab894398321e82d`; VIS-02 [capture metadata](../../../design/foundation-boards/v2026-10-18-wave3/specimens/capture.json) PNG hash `f989d068ab7524bf98cce04a4842c8b64c082cae4eb4db7d6cb5bb01b008e3a0`, specimen source hash `752b1597c637061a79f10c03d9f3d0523990d0b12f4bc9607f179db3db848409`; Chromium 148, viewport 1280×900, DPR 1, reduced motion off. Static specimen is not runtime evidence. VIS-01 allowed differences: 22px radius, heading weight/line height, 48px close, no header separator, no scrim blur, English copy. Visual conformity: **Not evaluated**.

## 6. Stories, integration and delivery

`Molecules/Dialog`: Default, WithSplitAction, Sizes, Full, Sheet, LongContent, Controlled, WithoutTrigger; autodocs, real `Meta`/`StoryObj`, no play or manual argTypes. Default does not override runtime defaults. Annotate every own declaration/union branch: boolean `open/defaultOpen/asChild`, text `title/description/statusText/dismissLabel`, select `variant/size`, false with concrete reasons for ReactNode `children/actions` and callback `onOpenChange`. Use true constant defaults only; verify real docgen, registered enhancer/inference, no owned diagnostics and actual browser widgets separately.

Integrate the package barrel, reviewed registry usages and generated docs, catalog source and generated catalog within the assigned edit surfaces. Run focused tests first; then the separately authorized full local verify set, including `pnpm props:check` and `pnpm test:props`, actual static CVA/CSS build and package export/packed consumer checks without a Tailwind compiler on React 18/19. Do not claim commands, AT or visual checks as passed until observed. Parent owns integration, review and delivery.

## 7. Risks and owner questions

1. Plan and dependency approvals are recorded in the owner approval record; runtime, browser and visual evidence remain separate.
2. Owner decision “Documentar restricción” (2026-11-01; `odd/tasks/organisms-build.md` L13): `className` merges last. Overriding reserved width, padding, radius, paint, focus and positioning is unsupported but not prevented. Document this restriction and test supported merge precedence; `twMerge` is not a policy filter.
3. The approved sheet placement, 48px close target and header end padding must fit together, including long localized titles and RTL. Verify computed layout; stop if the stated static recipes cannot satisfy the contract without an amendment.
4. The contract expects `@radix-ui/react-dialog` outside-dismissal, focus order, `asChild` refs and scrollable-overlay behavior; these require verification for the aligned version and existing component implementations. Resolve incompatibilities without inventing a focus engine.
5. AlertDialog #120 should reuse Dialog's marker-free part recipes and shared veil, **not** its modal wrapper or built-in dismiss X; its own AlertDialog primitive and decision semantics remain authoritative. CommandPalette #121 should reuse only the unchanged internal shared scrim recipe per #119, not assume it builds on Dialog's public wrapper; its separate contract determines interaction. Neither later contract is approved by this plan.
