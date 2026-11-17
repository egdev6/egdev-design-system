# Button labelWrap (#422)

Implement the approved Button v0.4 amendment `docs/components/button/v0.4/label-wrap-amendment.md` (Approved 2026-11-16) per the owner-approved plan below. Branch `feat/button-label-wrap`, one PR, Closes #422. Roadmap #427, milestone #14. Reference evidence/flow: Tabs v0.2 (first user of the shared `labelWrap` convention) and SelectTile v0.3.

## Specs

- S1: `ButtonProps` gains `labelWrap?: boolean` (English JSDoc, `@default false`, `@control boolean`): opt-in wrapping including long unbroken words; the box grows vertically, keeps each size's minimum height and stays fully clickable. JSDoc states the guaranteed content (owner: "Texto plano y un enlace con texto (asChild)"; other children best effort) and to avoid `labelWrap` in attached ButtonGroups (owner: "Documentar: evitar labelWrap en grupos pegados"). `useButton.ts` destructures `labelWrap = false` so it never reaches the DOM (native and `asChild`).
- S2: `buttonVariants` adds `labelWrap: { true: 'whitespace-normal wrap-anywhere text-center', false: '' }` with `labelWrap: false` in `defaultVariants`; the base keeps `whitespace-nowrap` so default output is byte-identical; twMerge resolves the override. Sizes are unchanged (`min-h-*` + `py-*` already allow growth). Use `wrap-anywhere`, not `wrap-break-word` (plain text is an anonymous flex item; only an inherited `wrap-anywhere` lowers its min-content). `buttonIconVariants`, `Button.tsx`, `index.ts`, IconButton and ButtonGroup are unchanged. Collapsible's direct `buttonVariants` call keeps its exact classes.
- S3: Tests first (RED observed before GREEN), via the public interface: AC-01 omitted and `false` give identical classes, keep `whitespace-nowrap`, no wrap utilities, across every variant × size (existing size tests unedited); AC-02 `true` has the wrap utilities, no `whitespace-nowrap`, keeps each size's `min-h-*`/`py-*`; AC-03 start/end icon and loading spinner stay first/last and `aria-hidden`, accessible name unchanged; AC-04 no `labelwrap` DOM attribute (native and `asChild`), the `asChild` link gets the wrap classes, ref/handlers/disabled/loading guards/Enter/Space hold; `className` still merges last; IconButton tests unchanged; Collapsible trigger classes unchanged.
- S4: Docgen/controls (`storybook-docgen.test.ts` Button block: controls map, own count, default; `storybook-controls.test.ts`), compiled-CSS assertion for `.whitespace-normal`, `.wrap-anywhere`, `.text-center`, packed consumer (typed `labelWrap: true` sample, `@ts-expect-error` for `labelWrap: 1`, separate SSR check for wrap classes and no attribute incl. `asChild`; do not add to `ButtonSamples`, whose button count is asserted). Stories `LabelWrap` (narrow host, spaced and unbroken long labels, sm/md/lg, start/end icon) and `LabelWrapStates` (loading, `asChild` link, spaced ButtonGroup); no argTypes/play.
- S5: Registry: append a Button usage to the existing `control-label-wrap` convention (no new approval record); refresh all Button whole-file revisions; update `scripts/prop-naming.test.mjs` so the Tabs assertion no longer assumes Tabs is the only usage and Button's usage is asserted; regenerate with `pnpm props:docs`.
- S6: Catalog row (`scripts/catalog_data.py`) mentions v0.4 `labelWrap`; regenerate both outputs. Evidence doc `docs/components/button/v0.4/implementation.md`; record the amendment content SHA-256 there. If `pnpm system:check` reports generated system artifacts stale, regenerate them with the repo's documented command.
- S7: No stylesheet, no new module, no tokens, no dependencies. English artifacts.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S7 | gentle-ai-worker | — |
| T2 | S2 | parent: Chrome/Edge/Firefox checks + captures | — |
| T3 | all | parent: full checks incl. package consumption, commit, PR | — |

## Log

- L1 (owner, verbatim choices on the plan): "Documentar: evitar labelWrap en grupos pegados"; "Texto plano y un enlace con texto (asChild)"; "Aprobar e implementar". Earlier spec decisions (odd/tasks/nexo-adoption-m1-specs.md L5): shared `labelWrap` convention approved; "Sí, la caja crece y es clicable entera". Registry id `control-label-wrap` (odd/tasks/tabs-full-width-wrap.md L1).
- L2: Parent regenerated the system artifact (artifact --write + system:docs; system:check 0). Browser checks (Chrome/Edge/Firefox, 640 and 320px, Chrome RTL) found no defects: growth above each size minimum, no overflow, full-box hit test, centered icons/spinner, focus ring unclipped. Captures in docs/components/button/v0.4/implementation.md.
