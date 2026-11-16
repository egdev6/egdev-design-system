# PageHeader leadingAction + lede (#412)

Implement the approved PageHeader v0.2 amendment `docs/components/page-header/v0.2/leading-action-amendment.md` (Approved 2026-11-16) per the owner-approved plan below. Branch `feat/page-header-leading-action`, one PR, Closes #412. Roadmap #427, milestone #14. Reference evidence/flow: Field v0.4 (`docs/components/field/v0.4/implementation.md`) and Tabs v0.2.

## Specs

- S1: `PageHeaderProps` gains `leadingAction?: PageHeaderLeadingAction | null | boolean` (internal type `ReactElement<IconButtonProps, typeof IconButton>`, not exported; `@control false` with a concrete `@controlReason`) and `lede?: string` (`@control text`; blank/whitespace-only text renders nothing; non-blank text preserved verbatim). Both destructured in `usePageHeader.ts` so they never reach the `<header>`; booleans map to no leading action.
- S2: Layout with existing token utilities only. Without a leading action the rendered tree is identical to v0.1 except an optional lede `<p>` right after the heading. With a leading action: a start wrapper `flex min-w-0 grow basis-[calc(var(--space-24)*3)] items-start gap-3` containing a plain `flex-none` leading wrapper (the IconButton is never cloned or classed) and the text Stack switched to `min-w-0 flex-1` via a static `nested` CVA variant; then the existing actions wrapper. Owner: leading action aligned to the top of the text block ("Arriba del bloque"). Logical layout only (no left/right/ml/mr); RTL mirrors via flex.
- S3: Lede: `<p>` with `m-0 min-w-0 font-sans text-body-default text-fg-secondary wrap-anywhere` (owner: "text-body-default", a deliberate difference from SectionHeader's `text-body-muted`, documented). Heading accessible name stays the title only; no `aria-describedby`. DOM order: leading action, eyebrow, heading, lede, actions.
- S4: Tests first (RED observed before GREEN), via the public interface: AC-01 preservation (existing suite unchanged; omitted/null/false/true leadingAction and blank lede keep the v0.1 tree and classes, no `<p>`); AC-02 leading IconButton (role/name, first in start wrapper, click/Enter/Space once, ref retained, disabled, `asChild` link keeps role/href, identity across rerenders); AC-03 lede (paragraph after heading, verbatim whitespace, blank renders nothing, heading name unchanged, text→blank→text, order with eyebrow); AC-04 Tab order leading → actions in LTR and RTL, long unbroken lede wraps without truncation; AC-05 neither prop appears as a root attribute, className merge unchanged.
- S5: Docgen/controls (`packages/ui/src/lib/storybook-docgen.test.ts`, `storybook-controls.test.ts`), CSS utility checks (`storybook-css.test.ts`, `scripts/package-consumption.test.mjs` `assertPageHeaderCSS`, `scripts/package-exports.test.mjs` incl. an SSR order case), package consumption sample (`page-leading`: IconButton asChild link + lede + ButtonGroup) with `@ts-expect-error` negatives (string leadingAction, array leadingAction, element lede). Stories: `LeadingAction`, `WithLede`, `Combined`, `ConstrainedCombined`, `RTLCombined`; English copy; no argTypes/play.
- S6: Registry (`skills/_shared/prop-naming.json`): PageHeader usage under `section-lede`; scoped exception `leadingAction` on `trailing-actions` (owner: "Aprobar leadingAction"), following the SectionNav precedent (and its approval JSON) for exception shape/hash and whether a usage entry is also required; approval record `docs/components/page-header/v0.2/prop-naming-approval.json` citing the owner's choices (odd/tasks/nexo-adoption-m1-specs.md L5 and this document's L1); refresh whole-file revisions of all PageHeader usages; regenerate with `pnpm props:docs`.
- S7: Catalog row (`scripts/catalog_data.py`) mentions v0.2 (#412); regenerate both outputs. Evidence doc `docs/components/page-header/v0.2/implementation.md` (Field v0.4 structure); record the amendment content SHA-256 in its header.
- S8: No stylesheet, no new module, no tokens, no dependencies. English artifacts.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S8 | gentle-ai-worker | — |
| T2 | S2–S3 | parent: Chrome/Edge/Firefox checks + captures | — |
| T3 | all | parent: full checks incl. package consumption, commit, PR | — |

## Log

- L1 (owner, verbatim choices on the plan): "text-body-default"; "Arriba del bloque"; "Aprobar e implementar".
- L2: Browser checks (Chrome/Edge/Firefox, 640 and 320px) found no defects: leading action top-aligned (delta 0), correct side in LTR/RTL, lede after heading at 12.8px/500, no overflow (only the intentional sr-only label), focus ring not clipped. Captures and hashes in docs/components/page-header/v0.2/implementation.md.
