# Dialog container + compact body (#409, #421)

Implement the APPROVED Dialog v0.2 amendment, read from `/home/egdev/proyectos/eds-wt-c/docs/components/dialog/v0.2/container-compact-amendment.md` (lands on main via PR #442; do NOT copy or edit it in this branch). Every open decision resolves to its **Recommended** option. Branch `feat/dialog-container-compact` (worktree `../eds-wt-e`), one PR, Closes #409 and #421.

## Specs

- S1: `DialogContentProps` placement union: `{ container?: null; overlayScope?: 'viewport' } | { container: HTMLElement; overlayScope?: 'viewport' | 'container' }`, plus `bodyPadding?: 'default' | 'compact'`. JSDoc: `container` `@control false` with a concrete `@controlReason`; `overlayScope` `@control select`, no `@default` (derived from `container`, stated in prose); `bodyPadding` `@default default`, `@control select`.
- S2: Overlay recipe: move positioning out of the base (`inset-0 grid overflow-y-auto place-items-center p-[var(--space-6)]`) into a variant `scope: { viewport: 'fixed', container: 'absolute' }`, default `viewport` — AlertDialog and CommandPalette outputs must stay identical. Body recipe: base `min-h-0 overflow-y-auto` + variant `bodyPadding: { default: 'p-[var(--space-6)]', compact: 'p-[var(--space-3)]' }`, default `default` (AlertDialog shares it).
- S3: `useDialogContent` destructures the three props (never on DOM); `scope = overlayScope ?? (container ? 'container' : 'viewport')`; untyped `scope === 'container'` without a host → `blocked` (render nothing, never fall back to body). `Dialog.tsx`: `<DialogPrimitive.Portal container={c.container}>`; update JSDoc. Radix modality stays document-wide (document it).
- S4: Tests first (RED before GREEN): reverse the no-container type fixture into positive fixtures + `@ts-expect-error` for container-scope without host and invalid `bodyPadding`; AC-01 defaults (portal under body, `fixed`, `p-[var(--space-6)]`, explicit `container={null}` same); AC-02 host → backdrop parent is host, `absolute inset-0`, not `fixed`; untyped container-scope with null host renders nothing; AC-03 host + viewport keeps `fixed`; AC-04 compact padding, head/foot unchanged; AC-05 container mode: Tab/Shift+Tab loop, Escape closes and returns focus, scrim click, controlled onOpenChange once, outside sibling `aria-hidden` while open; AC-06 AlertDialog overlay/body class hashes unchanged (capture before editing); AC-07 no prop attributes on the DOM; new `packages/ui/src/lib/dialog-docgen.test.ts` (model: alert-dialog-docgen.test.ts).
- S5: Stories `Container` (positioned host, render after ref set), `ContainerViewport`, `CompactForm` (Stack + Button `labelWrap`), `CompactLongContent`; no argTypes/play. Packed consumer typed positive/negative fixtures and shipped CSS (`absolute`, `p-[var(--space-3)]`).
- S6: Registry: DialogContent usage on `portal-container`; new convention `dialog-overlay-scope`; `inner-padding` exception for `bodyPadding`; approval record `docs/components/dialog/v0.2/prop-naming-approval.json`; refresh Dialog whole-file revisions; `pnpm props:docs`. Catalog (`scripts/catalog_data.py`) + `build_catalog.py`. System artifact (`packages/system`): `pnpm artifact --write && pnpm system:docs`. Evidence `docs/components/dialog/v0.2/implementation.md` with the amendment SHA-256.
- S7: No stylesheet, no new module, no tokens, no dependencies.

## Tasks

| ID | Specs | Route |
| --- | --- | --- |
| T1 | S1–S7 | gentle-ai-worker |
| T2 | S2–S3 | parent: Chrome/Edge (also scale 1.25)/Firefox containment, focus, scroll; captures |
| T3 | all | parent: full checks, PR, CI, merge |

## Log

- L1: Plan by explorer, approved by the parent applying recommendations (delegation L1 in the main tracking doc); visual approval covered by the delegation; real WebView2 check in Nexo stays optional.
- L2: Parent browser check (Chrome real keyboard; Edge scale 1/1.25; Firefox): containment, viewport override, compact padding, default unchanged, focus trap/Escape/return (Chrome); capture recorded.
