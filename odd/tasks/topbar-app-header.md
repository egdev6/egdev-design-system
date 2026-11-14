# TopBar — app header finish
Objective: give TopBar a free trailing slot, scroll-driven glass, an optional initial background, a content-width option and the link finish of the owner's Media Tool reference, composed only from design-system resources. Branch `feat/topbar-app-header` (main checkout, base `247752f`).
Delivery: local work-unit commits; delivery shape decided with the owner before publishing. Runners: the repository commands named in the approved plan.

## Specs

- **S1 — Brand slot.** Owner, verbatim: “el logo de la izquierda es un slot (habitualmente usado para logo con link)”. Keep `TopBarBrand` as the leading slot; a home link inside it is the usual composition, not a hard requirement.
- **S2 — Free trailing slot.** Owner, verbatim: “el espacio de la derecha es un slot ( que admita ReactNode)”. Selected option: “Sumar un slot derecho libre (recomendado)” — “TopBarBrand sigue siendo el slot izquierdo (logo con link). Se agrega una parte nueva para la derecha que acepta cualquier ReactNode. Búsqueda, usuario y menú móvil se mantienen: no rompe a nadie.”
- **S3 — Glass on scroll.** Owner, verbatim: “Aplicamos ese estilo glass al background en el scroll”. Selected option: “TopBar lo detecta solo (recomendado)” — “Pasa a glass cuando la página deja el tope (scroll > 0). Si quien lo usa pasa `data-state`, ese valor manda.”
- **S4 — Optional initial background.** To “Antes de hacer scroll, ¿qué fondo tiene la barra?” the owner answered, verbatim: “hagamoslo opcional por prop”. Assumption: the default stays transparent (current behaviour) and the solid option matches the reference.
- **S5 — Link colours.** Owner, verbatim: “cambiamos los colores de los <a> (active, hover...) por los estilos de la imagen”.
- **S6 — Content max-width.** Owner, verbatim: “Debe admitir max-width que aplique al contenido (no al background), yq eu en apps serás del 100% pero en web centrará con ese maxWidth”. Selected option: “Prop con dos valores: content o full (recomendado)” — “`content` centra en --content-max (web, por defecto); `full` ocupa el 100 % (apps). Solo tokens, sin valores arbitrarios.”
- **S7 — Composition rule.** Owner, verbatim: “no, compón lo tu con los recursos del design system para buscar un acabado visual como el de la imagen que te pasé”. Use existing tokens, Surface and public components; do not read the Media Tool source.

- **S8 — Approval.** To “¿Aprobás la enmienda v0.3, los nombres `TopBarEnd`, `initialBackground` y `contentWidth`, y el plan de implementación?” the owner selected “Apruebo todo” — “Enmienda, los dos conceptos nuevos de nombres y el plan. Implemento test-first y te aviso para revisarlo en Storybook.”

## Tasks

- **T1** — S1–S7 — Draft the TopBar v0.3 amendment and implementation plan with the prop-naming proposal; obtain owner approval. Route: bounded worker (context backstop). Risk: none (docs). Status: done. Commit/evidence: docs commit with approval (see L4).
- **T2** — S1–S7 — Implement the approved amendment test-first (types, hook, JSX, tests, stories, package checks, registry). Route: bounded worker. Risk: reassess from the diff (existing exports must stay compatible). Status: in_progress. Commit/evidence: pending.
- **T3** — S1–S7 — Full checks, browser measurement against the reference, owner visual review, commit. Route: parent. Risk: from the diff. Status: pending. Commit/evidence: pending.

## Log

### L1 — Original request (verbatim)

“TopBar la veo desestilada, me equivoco? la idea sería que fuera algo similar a esto [Image#5] Ese es el componente que va arriba en la website? o me estoy confundiendo?” — followed, after the parent's diagnosis, by “si, pero con ajustes.” and the bullets quoted in S1–S6, the option answers quoted there, and S7.

### L2 — Evidence

Explorer `mwg377qc-n-azqf`: effective contract is v0.1 (#292) plus the approved v0.2 link amendment (`docs/components/top-bar/v0.2/`); parts are partitioned by element type and unknown children are dropped; glass is host-selected through `data-state` with no scroll listener; content row already capped at `--content-max` with no prop; links use `text-label-default` (11.2px/600) with an inset, rounded, glowing `::after` indicator; consumers include WebTemplate stories and package fixtures. Registry has no exact convention for a free trailing node, an adjustable content width or a scroll/glass state.

Reference pixel sampling (Image#5, 1785×85): background `rgb(27,28,32)` with a lighter top band `rgb(36,37,41)` (surface + sheen); links at rest `rgb(204,204,204)` (= `fg-secondary`), current `rgb(255,255,255)` (= `fg-default`), current visibly heavier; current indicator `#FF0036`, 2px tall, spanning the text width, flush with the bar's bottom edge, square, no glow; ~27px between links; trailing status dot `rgb(45,226,196)`. Exact font size/weight/spacing are inferred, not measured from source (S7).

### L3 — Drafts ready for approval

Worker `mwg425up-o-609m` wrote `docs/components/top-bar/v0.3/spec-amendment.md` (92 lines) and `implementation-plan.md` (83 lines), both pending owner approval; diff-check and structural checks PASS. Proposals: part `TopBarEnd` (no new naming concept; `trailing-actions`/`end-items` rejected as narrower), props `initialBackground?: 'transparent' | 'solid'` (new concept `top-bar-initial-background`, default transparent) and `contentWidth?: 'content' | 'full'` (new concept `top-bar-content-width`, default content). DOM order brand → nav → full search → compact search → end → user → mobile trigger. Explicit `data-state` wins over scroll; otherwise `scrollY > 0` → glass, else `initialBackground`. Default story shows the reference composition (solid). Asking the owner to approve amendment, the two naming concepts and the plan.

### L4 — Approved

Owner selected “Apruebo todo” (S8). Both v0.3 documents updated to owner-approved with that quote; T1 done; T2 starts.
