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

- **S9 — Visual approval.** Asked “¿Querés ir revisando Storybook mientras terminan las comprobaciones?”, the owner reviewed TopBar in Storybook and replied, verbatim: “está OK”.

## Tasks

- **T1** — S1–S7 — Draft the TopBar v0.3 amendment and implementation plan with the prop-naming proposal; obtain owner approval. Route: bounded worker (context backstop). Risk: none (docs). Status: done. Commit/evidence: docs commit with approval (see L4).
- **T2** — S1–S7 — Implement the approved amendment test-first (types, hook, JSX, tests, stories, package checks, registry). Route: bounded worker. Risk: none (additive API; existing parts, exports and `data-state` promise preserved; no shared helper changed). Status: done. Commit/evidence: feature commit (L10); RED 9→GREEN 22; full Vitest 2798; storybook-css 79; props 117; exports 131; packed 14; storybook-mcp 27; artifact 30; system 36; tokens, mcp, typecheck, tracked-file lint PASS; browser PASS; owner visual approval.
- **T3** — S1–S7 — Full checks, browser measurement against the reference, owner visual review, commit. Route: parent. Risk: none. Status: in_progress. Commit/evidence: pending delivery decision.

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

### L5 — T2 implementation and browser checks

Worker `mwg4d34f-p-3i6s` first stopped (interaction_required) because the plan also touches `scripts/prop-naming.test.mjs`, `scripts/design-system-artifact.test.mjs` and the generated `packages/system/design-system.json`; parent authorized them as necessary consequences of the approved plan. Continuation `mwg4gamu-q-1ouf` implemented S1–S7 in 22 files (+719/−76): `TopBarEnd`, `initialBackground`, `contentWidth`, rAF-throttled passive scroll listener (skipped when the host passes `data-state`), solid Surface background, link recipe and stories; registry concepts and usages added; catalog regenerated; amendment/plan identities bound (amendment `d8d059d5…`, plan `198cec9d…`). RED 9/12 → GREEN 22/22; storybook-css 79/79; docgen/controls TopBar PASS; props 117. It left two Biome `noChildrenProp` diagnostics in the docgen SSR test; parent fixed them (children as createElement arguments). Story composition refined by `mwg50w3e-r-8wvu` (display uppercase name, muted regular subtitle/status, brand spacing).

Browser (Storybook, 1500/700px, DPR1): links 16px, current 600 white, rest `rgb(204,204,204)`, indicator 2px `#FF0036` flush with the bar bottom, square, no shadow; solid `surface-1` + sheen + bottom hairline; scroll story transparent → glass (`rgba(35,36,40,.84)`, blur 20px saturate 1.5) → transparent at top; `full` width puts brand and status at the edges, `content` centres. Found one defect: below 900px the end slot sat next to the brand because the nav (flex-1) is hidden. Parent fixed with `ms-auto` on the end wrapper (geometry-only, verified in browser: 22px from the right edge at 700px; 270px at 1500px = centred cap). No unit test for this geometry (jsdom cannot measure it); browser is the proof.

Full runs: job24 failed on the public export inventory (missing `TopBarEnd`, parent fixed); job25 had all 2798 tests green but the artifact went stale after the `ms-auto` edit (regenerated with `--write`, check PASS); job26 found `test:artifact` asserting 292 tokens. Root cause: PR #402 added 5 tokens and `test:artifact` is not part of `pnpm test`, so the breakage was already on main since #402. Fixed to 297 with a comment (30/30). While checking, a timed-out command left the work in a stash; parent restored it immediately (22 files, stash empty). Job27 reruns the full set plus the separate local suites (artifact, system, tokens, mcp, storybook-mcp).

### L6 — Second pre-existing stale artifact

Job27: everything up to `test:system` passed (artifact 30/30), then `scripts/system-md.test.mjs` failed 4 tests because the generated `packages/system/system.md` was stale (`Stale: packages/system/system.md; run --write.`). It was already stale on main since #402 (it lacked the five navigation tokens) and also needed TopBar v0.3. Regenerated with `pnpm system:docs` (+114/-60: the 5 tokens plus TopBar parts/anatomy); `system:check` PASS, `test:system` 36/36. Job28 reruns the whole extended set, now including `system:check`. X# L7 - Storybook MCP manifest exception

Job28: build, full Vitest, artifact check, system check, test:artifact, test:system, test:tokens and test:mcp passed; `test:storybook-mcp` failed because the new public export `TopBarEnd` was not documented in the docs-only MCP manifest. Following the existing convention for the other TopBar parts, parent added `TopBarEnd` to `scripts/storybook-mcp-exceptions.json` with the same reason (#344 D1 (a)). Job29 reruns storybook-mcp and the remaining checks (props, typecheck, lint, exports, packed consumption, artifact/system checks).

### L8 — Final corrections and visual approval

Job29: storybook-mcp 27/27, then `props:check` failed (`Stale evidence revision: packages/ui/src/organisms/top-bar/types.ts`) because the parent's `ms-auto` edit changed the file hash. Declarations unchanged (CVA string only), so parent replaced the 5 TopBar `source.revision` values with the new whole-file hash and regenerated the view; props:check PASS. Job30: test:props 117 PASS, then typecheck failed in the docgen SSR test (`children` required on TopBar props) — a regression from the parent's earlier Biome fix. Second correction for that file: props moved to a variable (Biome and `tsc -p packages/ui` PASS, docgen TopBar test PASS). Owner visually approved TopBar in Storybook (S9: “está OK”). Job31 reruns typecheck, lint, full Vitest, props, exports, packed consumption, artifact/system checks and test:artifact/test:system before the commit.

### L9 — Environment lint noise and export inventories

Job31: typecheck PASS, then `pnpm lint` failed with 30 diagnostics, all in the git-ignored local `.playwright-mcp/` evidence folder of the main checkout (`.gitignore:13`); Biome does not use the ignore file. Not product files, absent in CI; left untouched (owner's local data). Lint is now run on `git ls-files` only; all changed files are clean. Job32: tracked-file lint PASS, full Vitest 2798/2798, test:props 117, props:check PASS, then package exports failed: both root export inventories in `scripts/package-exports.test.mjs` (runtime names and `.d.ts` names) lacked `TopBarEnd`. Added to both; package exports 131/131. Job33 runs packed consumption, artifact/system checks, test:artifact, test:system, typecheck and diff-check.

### L10 — All green; commit

Job33 exit 0 (ALL-GREEN): tracked-file lint, packed React 18/19 consumption 14/14, artifact check, system check, test:artifact 30/30, test:system 36/36, typecheck, diff-check. Native assessment of the current diff: medium, no independent verifier, reviewDue false (`under_budget`). Risk: none. Committing T2 as one work unit (TopBar v0.3 plus the two artifact checks that were already broken on main since #402: `test:artifact` 292→297 and regenerated `system.md`). Not run (pack/install-based): test:package-release, test:package-pilot, test:mcp:packed, test:system:consumer.

### L11 — Native review stop and delivery choice

T2 committed as `638b52b` (25 files, +878/−139; hooks Biome, typecheck, commitlint PASS). The RDD reminder requested inspect; inspect offered review.start; START with lenses readability+reliability stopped at preflight with `lens_context_budget_exceeded` (candidate too large for the reviewer context; no authority created, nothing to abandon). Owner then selected “PR único sin revisión nativa (recomendado)” — “Publicar los 2 commits en un solo PR contra main, como el anterior. La revisión nativa no era obligatoria y todas las comprobaciones están en verde.” Pushing (pre-push runs the full Vitest suite) and opening one PR against main with label type:feature.
