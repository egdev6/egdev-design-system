# AlertDialog v0.1 — implementation plan

**Status: draft for owner review; documentation only.** Covers organism-wave S2–S4 and O4, coordinated with O1/L3. [Issue #120](https://github.com/egdev6/egdev-design-system/issues/120) is the approved v0.1 full contract. Its owner approval comment supersedes historical Draft/Pending identity wording, not the substantive contract. Canonical payload SHA-256 `e68a29aa929f930c86eb2334e3c1f6ef4e131329512c9ca396dcc9871686f1a9`; frozen body SHA-256 `2163ba591bf77648d865bc559670886c8b79022de7672ec653ec4f2d987b7dd4`. The comment records a forwarded owner grant, not an independently signed per-payload receipt. It does not approve this plan, dependency changes, implementation or runtime conformity.

## Gates and dependencies

- **Approved dependency:** exact `@radix-ui/react-alert-dialog@1.2.1`, installed by the parent. The owner chose “Alineadas” in organisms-wave L12, replacing the earlier 1.1.15 proposal. There is no custom focus/dismissal fallback.
- Obtain separate approval of this plan and implementation surfaces. The approved issue explicitly requires implemented Dialog recipes, Surface, Button and Icon first. Types inspected for Surface and Button support the intended shapes, but types alone do not establish runtime exports, ref forwarding or implementation readiness. Verify those prerequisites on the integrated base before writing code; do not substitute another component silently. Project-level availability guidance may be stale relative to the worktree: resolve using actual exports and behavior at implementation time.
- No new tokens or stylesheet. If an existing token, dependency or recipe is insufficient, stop for a scoped owner decision; do not change tokens or invent Material.

## Future files and integration (not authorized by this plan)

Six meaningful files under `packages/ui/src/molecules/alert-dialog/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public props, discriminated button union, static CVA for header row and tone icon, English JSDoc/Controls. |
| `useAlertDialog.ts` | Part preparation; import marker-free recipes from `../dialog/types`; compose own markers and classes with `cn()` per part. |
| `AlertDialog.tsx` | JSX-only Radix tree, Surface panel and Icon. |
| `AlertDialog.test.tsx` | Public behavior, accessibility relationships, composition, types and marker tests. |
| `AlertDialog.stories.tsx` | Autodocs and specified stories. |
| `index.ts` | Named components and types only; no recipes. |

**No stylesheet. No extra internal modules.** Later separately authorized integration: `packages/ui/package.json` and `pnpm-lock.yaml` for the confirmed package; `packages/ui/src/index.ts` for public exports; `scripts/catalog_data.py` and generated `docs/CATALOGO.md` / `docs/catalog.json` for availability; `skills/_shared/prop-naming.json` and generated `docs/prop-naming.md` for reviewed usages; scoped Storybook metadata and package export/consumption tests in the existing harness. Inspect and authorize actual integration paths before edits; generate artifacts through their canonical tooling, never hand-edit generated files. No changes to legacy CSS or peer components are implied.

## API, composition and naming

Use `import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'`. Root is modal and has no DOM. Radix Trigger, Portal, Overlay, Content, Title, Description, Cancel and Action own interaction. Portal mounts in `document.body`; Overlay wraps Content; `Content asChild` renders Surface. No standalone Portal wrapper, Dialog wrapper, X, `AlertDialogClose`, `dismissLabel`, `statusText`, size, variant, sheet, public autofocus/dismissal hooks or container. Heading/Text types offer display-scale recipes, not this heading-small treatment: use Radix native `h2` and `p` with the shared token recipes.

| Part / own prop | Contract and [registry](../../../../skills/_shared/prop-naming.json) mapping |
| --- | --- |
| Root `children` | Required ReactNode: optional Trigger and one Content. |
| `open`, `defaultOpen`, `onOpenChange` | `open-state`, `initial-uncontrolled-open`, `open-change`: controlled or uncontrolled; default initially false; user requests only, no echo of incoming props. |
| Trigger, Cancel, Action `children`, `asChild` | Required named ReactNode, or exactly one compatible ReactElement when `asChild: true` (`slot-composition`); default false; native button type button. |
| Content `title`, `description` | Required non-empty localized strings; `heading-title`, `dialog-description`; native visible heading and consequence text linked by Radix. Concept-level description is optional, but this component requires it. |
| Content `children`, `actions` | Optional supporting body; required `trailing-actions` ReactNode: exactly one Cancel followed by at least one Action. Consumer contract, not runtime parsing. |
| Content `tone` | `surface-material-tone`: `neutral` default or `danger`; danger adds decorative alert icon, never changes panel Material. |
| `className` | Inherited on Trigger, Content, Cancel, Action. Content supports non-appearance layout only, not width, paint, radius, padding or focus overrides. Controls may compose appearance while retaining focus/target requirements. `cn`/`twMerge` only resolves recognized utility conflicts, not a universal CSS policy filter. |

Root has own props only, no ref or DOM spread. Trigger/Cancel/Action use a discriminated `asChild` union and native button props omitting `children`, `type`, `dangerouslySetInnerHTML`, `style`; forward button refs compatibly with React 18. Preserve `disabled`, ARIA and click handlers. Content uses `ComponentPropsWithoutRef<'div'>` omitting `title`, `children`, `role`, `aria-labelledby`, `aria-describedby`, `aria-modal`, `tabIndex`, `style`, `dangerouslySetInnerHTML`, `contentEditable`; no Content ref. Use `type`, not `interface` or `any`. Export `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogCancel`, `AlertDialogAction` and corresponding `AlertDialogProps`, `AlertDialogTriggerProps`, `AlertDialogContentProps`, `AlertDialogCancelProps`, `AlertDialogActionProps`, `AlertDialogTone`.

The issue records all eight mappings as approved, including `dialog-description` via the organism naming receipt; that receipt records assistant-applied acceptance under human delegation, not independent per-payload owner review. No new convention or exception is proposed. Recheck current registry and aliases before code. After reviewing actual symbols, register usages with the whole-file SHA-256 of the final `types.ts`; generate the reference and run `pnpm props:check` and `pnpm test:props` under later authorization. Never invent source revisions or migrate unrelated APIs.

## Shared internals and Material

Dialog's plan is not yet approved. The approved AlertDialog contract requires importing Dialog's internal, **marker-free** part CVAs from `../dialog/types`, including `dialogScrimVariants`, sm panel, header, title, description, body and footer. Apply AlertDialog's own header spacing and title row/icon recipes, without baking either component's markers into shared CVAs. Add `eg-alert-dialog-backdrop`, `eg-alert-dialog`, `eg-alert-dialog__head`, `eg-alert-dialog__title`, `eg-alert-dialog__description`, `eg-alert-dialog__body`, `eg-alert-dialog__foot` in the hook; no `eg-dialog*`, tone or mirrored state classes. Dialog recipes remain internal, not barrel exports.

- **Dialog lands first:** use its reviewed internal recipes directly; confirm names, marker absence and behavior, preserving Dialog's existing behavior with focused regression tests. Escalate if the landed recipes cannot meet both contracts.
- **AlertDialog would land first:** do not duplicate recipes, create a new shared module or ship a temporary wrapper. The approved issue requires implemented Dialog first; wait for it. An alternate ordering or pre-extraction would require an explicit contract/plan amendment and separately approved surfaces. Neither this plan nor the provisional Dialog plan grants that amendment.

Use Surface `tone="surface-2" elevation={3} radius="xl" padding="none"`; it supplies the tonal sheen, strong light edge and two-layer elevation. Center the fixed Dialog sm shell at `calc(var(--space-24)*5)` (480px), capped by viewport minus twice `--space-6`. Use the shared paint-only veil `bg-bg-scrim/72 backdrop-blur-none` with AlertDialog's fixed inset centering/padding layout; no blur token. Footer is surface-0 with top hairline, right-aligned, Cancel before Action. Header is `flex flex-col gap-[var(--space-2)] px-[var(--space-6)] pt-[var(--space-6)] pb-[var(--space-4)]`; title row `flex items-center gap-[var(--space-3)]`; danger icon uses `text-[var(--color-status-danger)] size-[var(--space-6)] shrink-0`. Title is `font-display uppercase text-heading-small`; description is `text-body-default text-[var(--color-fg-secondary)]`. No red panel, border or halo. Use static token-backed utilities, not handwritten colors, shadows or gradients. Body is absent when omitted and scrolls when long; keep header/footer visible. Check enlarged description and short viewports: if the stated fixed-header rule cannot keep the consequence and actions usable, stop for owner resolution rather than hide content.

Radix data-state controls opacity entry using `--duration-fast`/`--ease-out`; reduced motion removes transitions. Closed content unmounts. No z-index token or stacking guarantee; consumer owns stacking, and nested dialogs are out of scope. Verify actual emitted CSS, utility scanning and legacy cascade; the no-blur scrim needs no reduced-transparency blur fallback.

## Interaction and accessibility

Cancel is the initial focus target and least destructive outcome. Trigger click/Enter/Space opens a body-portalled `alertdialog` with `aria-modal`, linked title and description, focus trap, scroll lock and outside content hidden/inert. Scrim pointer-down cannot dismiss or move focus. **Escape does request close**, like Cancel, and restores Trigger focus: decision-required does not mean Escape is blocked. Action's consumer click runs before Radix requests close. Controlled consumers can ignore a close request while pending and compose Button `loading`, explaining why; consumer owns the operation, its announcement and eventual state. Without a Trigger, restoration is the consumer's responsibility. No manual focus or dismissal engine.

Use one clearly named Cancel followed by consequence-named Action(s), e.g. “Keep connected” and “Disconnect”, not “OK/Yes”. Recommended slotted Buttons are secondary and primary. Danger uses decorative `Icon name="alert"` plus descriptive text, never color alone. Plain button parts must retain the specified 40px target, 48px on coarse pointers, and visible token focus ring. Verify Radix and composed Surface/Button actually forward required refs, handlers and semantic attributes; `asChild` requires one compatible prop-spreading, ref-forwarding button, not nested buttons.

## Test-first sequence after approval

Add observable behavior tests first, record intended RED, implement minimum, then GREEN; planned checks are not evidence of results. Keep tests on public behavior, roles and names, not complete class snapshots.

1. AC-01–04: default closed and one-time `defaultOpen`; pointer/keyboard Trigger opens body portal with unique linked title/description and `alertdialog` modal semantics; Cancel autofocus, Tab/Shift+Tab trap, outside hiding/scroll lock, ignored scrim pointer-down with no close callback or focus move; Escape and Cancel request false and restore Trigger focus. Test independent instances and browser behavior.
2. AC-05–06: Action callback precedes close request; controlled owner can keep open with loading Button; prop updates do not echo, triggerless consumer restoration, no X; required supported Cancel-then-Action order; disabled and slotted native buttons, no nested buttons. Include preserve tests for touched Dialog shared recipes and controls.
3. AC-07–11: neutral/danger icon and unchanged Material, optional and long body, viewport bounds and scrolling at 375×667, markers/no Dialog markers, native prop bounds, supported merges, per-part recipes, data-state, reduced motion and transparency in real browser. Test React 18/19 ref forwarding. Check className policy limitations; stop if contract protection needs unapproved filtering.
4. AC-12–13: public exports/types and absence of recipe exports, real docgen and Controls, static CVA scanning and shipped CSS, packed consumer without a Tailwind compiler; compare runtime visual captures against VIS-01 under comparable conditions and document each difference. Browser focus, accessibility and screen-reader checks are separate from DOM tests.

[VIS-01 capture](../../../design/foundation-boards/v2026-10-18-wave3/specimens/alert-dialog--specimen.png) SHA-256 `3d348ff39c64508416135197066439add03ac484256180484994e8495df996f4`; [source](../../../design/foundation-boards/v2026-10-18-wave3/specimens/alert-dialog.specimen.html) SHA-256 `90b8e7d5f5330e1deb519025080d6e920e54d8f65e513f17f476268366ccd78f`; [metadata](../../../design/foundation-boards/v2026-10-18-wave3/specimens/capture.json): Chromium 148, viewport 1280×900, DPR 1, reduced motion off, crop 1280×515; theme and reduced transparency not recorded. Danger/Cancel focus and neutral/body are static silhouettes, not runtime proof; specimen button label weight 600 versus Button's 700 is an allowed difference. Visual conformity: **Not evaluated**.

## Stories and delivery verification

`Molecules/AlertDialog`: Default, Danger, WithBody, PendingAction, Controlled; `Meta`/`StoryObj` from `@storybook/react-vite`, autodocs, no play or manual `argTypes`. Default supplies required args only and does not override runtime defaults. Own JSDoc on every union branch: boolean `open`, `defaultOpen`, `asChild`; text `title`, `description`; select `tone`; false with concrete reasons for `children`, `actions`, `onOpenChange`. Defaults only for actual constants. Exercise actual docgen, installed enhancer/inference and zero owned diagnostics, then browser Controls; metadata alone does not prove widgets.

After implementation, parent integrates reviewed registry usages and generated catalog, runs focused tests first and the separately authorized full local Verify set including `pnpm props:check`, `pnpm test:props`, CSS build/static scanning and packed consumer checks. RDD assessment and delivery are parent-owned. No tests, build, browser or AT checks are claimed here.

## Risks and owner questions

1. Approve this plan and its future scoped surfaces? Separately confirm **NEW** `@radix-ui/react-alert-dialog@1.1.15` only after version and compatibility verification, or choose another verified exact version.
2. Confirm the required sequencing: wait for Dialog and its marker-free internal recipes rather than landing AlertDialog first. Any earlier shared extraction requires an explicit contract amendment, not a silent dependency inversion.
3. `twMerge` does not enforce the promised appearance boundary. If actual classes can override protected Material or focus, choose a contract-compatible resolution after concrete evidence rather than assuming all overrides are prevented.
4. Verify Radix Escape, autofocus and pointer behavior, existing Surface/Button refs, and long description/viewport behavior before relying on them; incompatibilities require an owner decision, not a bespoke interaction engine.
