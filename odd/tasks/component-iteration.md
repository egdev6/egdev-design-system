# Component iteration — fixes, amendments and new component specs

Iterate existing @egdev/ui atoms (Button, Chip, Select, Link, Input, Avatar), remove ProductMark and specify new pieces (Indicator, FieldMessage, Panel, Collapsible).
Three parallel streams in isolated worktrees: W1 fixes, W2 contract amendments, W3 new specs (no code: repo gate requires approved spec + plan; new Radix deps need explicit confirmation).

## Specs

- S1 — Button resting styles: "Los estilos de los botones sin hover están rotos. Arreglarlos"
- S2 — Icon alignment: "Alinear iconos en chip y botones" and "Select alinear icono con texto"
- S3 — Link: "El componente Link no me gusta como está visualmente. Hay que iterarlo" → "texto en color (no con borde alrededor) y la flecha alineada con texto y marcando hacia la derecha (no hacia arriba). En el hover se podría animar un poquito la flecha hacia la derecha para que se note el efecto"
- S4 — ProductMark: "ProductMark elimínalo" → "Sustituir donde se use por Logo o una imagen"
- S5 — Spinner reuse: "Spinner podría ser primitiva? ya que se puede usar en diferentes elementos como button, input, etc?" → agreed: Spinner stays an atom; Input gains a `loading` state composing Spinner like Button.
- S6 — Indicator: "Avatar tiene aplicado un aviso que podríamos extraer a otro componente. Algo similar a esto, https://sf-design-system.netlify.app/?path=/docs/atoms-badge--docs" → agreed: new anchored indicator (dot | count | icon) plus positioning wrapper; Avatar migrates its badge to it. Badge (label pill) stays as is.
- S7 — FieldMessage: "Convendría una primitiva con estilos para los errores de inputs? ErrorMesage con texto icono y estilo?" → agreed: FieldMessage atom with tone hint | error (icon + text + correct live semantics), composed later by Field (#84); share the tone/icon/text recipe with Notice (#93).
- S8 — Panel: "Con el surface tengo una duda. Esto sería posible o requeriria composición? header/content/footer?" → agreed: Surface stays a box; new Panel molecule (Header/Body/Footer, banded variant) over Surface; ModuleCard (#91) may compose it. Opening mechanism: "puede ser por cualquier medio" → Panel is static and host-agnostic (Popover, Dialog, page).
- S9 — Collapsible: collapsible sections seen in the reference panel (Ritmo de consumo / Historial) → Collapsible/Accordion over Radix (new dependency, needs confirmation).
- S10 — Popover: already specified in #96 (new dependency `@radix-ui/react-popover`, needs confirmation). No new issue.
- S11 — Delivery: "si, crealas y abre 3 subagentes poaralelos para hacerlas"

## Tasks

| ID | Specs | Work | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S1–S11 | Create GitHub issues (one per point, link #59 #61 #64 #84 #91 #93 #96) | parent | #173–#181 (done) |
| T2 | S1, S2 | Fix Button resting treatments; align icons in Chip, Button, Select | W1 worktree | 69f8899, 9be868a on fix/173-174-button-icons (done) |
| T3 | S3, S4, S5 | Link visual amendment; remove ProductMark and reassign consumers; Input loading | W2 worktree | 8e84f56, bde0d99, 2f7056a on feat/175-177-link-productmark-input (done) |
| T4 | S6–S9 | Draft v0.1 specs: Indicator, FieldMessage, Panel, Collapsible (no code) | W3 worktree | b11ae72, b07a5c8, 41ade6f on docs/178-181-component-specs (done) |
| T5 | S11 | Review results, report, decisions pending (spec approval, deps) | parent | done |

## Log

- L1 — User (original requests, 2026-10-29): "vale, alguna modificaciones y temas de los compoenentes actuales. Primero comentamos luego planificamos: -Stack y Cluster no son lo mismo? en qué se diferencian? -Avatar tiene aplicado un aviso que podríamos extraer a otro componente. Algo similar a esto, https://sf-design-system.netlify.app/?path=/docs/atoms-badge--docs - Los estilos de los botones sin hover están rotos. Arreglarlos -Alinear iconos en chip y botones -Convendría una primitiva con estilos para los errores de inputs? ErrorMesage con texto icono y estilo? -El componente Link no me gusta como está visualmente. Hay que iterarlo -ProductMark elimínalo -Convendría hacer una primitiva popup? -Select alinear icono con texto -Spinner podría ser primitiva? ya que se puede usar en diferentes elementos como button, input, etc?"
- L2 — User: "6- texto en color (no con borde alrededor) y la flecha alineada con texto y marcando hacia la derecha (no hacia arriba). En el hover se podría animar un poquito la flecha hacia la derecha para que se note el efecto 7- Sustituir donde se use por Logo o una imagen 8- Con el surface tengo una duda. Esto sería posible o requeriria composición? header/content/footer? [reference: Claude usage panel — header with logo/title/Max badge, progress rows, dividers, warning callout, collapsible sections, action buttons, banded footer] El resto me parece bien"
- L3 — User: "puede ser por cualquier medio" (how the panel opens)
- L4 — User: "si, crealas y abre 3 subagentes poaralelos para hacerlas"
- L5 — Agent: Stack and Cluster stay separate (intent-named layout primitives). No generic Popup primitive: overlay look = Surface tone overlay; behavior = Radix per case.
- L6 — Agent: Button hypothesis — base `bg-none`/`shadow-none` compete with variant arbitrary `[background-image:…]`/`[box-shadow:…]` (same CSS property, not merged by twMerge); hover wins by specificity. To confirm RED before fixing.
- L7 — Evidence T2: cause confirmed for background (bg-none won over the gradient); shadows already won. Fix scopes resets to ghost/dark. pnpm test 50/50 files, 1056/1056 tests after `pnpm tokens`; browser measure: primary/secondary gradient at rest, ghost/dark none; icon centre = root centre in Button (40/40), Chip (32/32), Select (38/38, 94/94).
- L8 — T3: worker cannot delete files; parent ran `git rm` on packages/ui/src/atoms/product-mark (6 files). compiled.css is hand-authored Tailwind input; writer authorized to edit only its @source lines for ProductMark/Link/Input.
- L9 — T2 follow-up: package-exports/consumption need `pnpm build` first (baseline main fails identically without it). After build W1: exports 51/51, consumption 12/12; props failed 13 (stale sha256 evidence for button/chip/select types.ts) → fixed in d971194, props 87/87.
- L10 — T3 evidence: vitest 49/49 files, 1039/1039; build OK; exports 50/50, consumption 12/12, props 87/87. Browser: Link color fg-brand-raised, border 0, arrow-right centred (svg mid = root mid), hover translate 4px; Input loading Spinner centred, aria-busy=true. Slice 1156 lines (incl. ~400 ProductMark deletions and regenerated docs): review per commit.
- L11 — T4: four v0.1 drafts (agent-applied decisions), catalog rows regenerated; visual references pending (Playwright unavailable to worker). Slice 661 lines (specs only).
- L12 — Merge: branches conflict only in generated docs (A+B docs/prop-naming.md; B+C docs/CATALOGO.md); resolve by regenerating (pnpm props:docs, python3 scripts/build_catalog.py) after merging sources.
- L13 — Pending owner: push/PRs; post #61/#59 amendment drafts and the 4 specs as issue comments; approve specs; confirm @radix-ui/react-collapsible and @radix-ui/react-popover.
- L14 — User: "jusntalas en una misma rama, crea la issue comentando lo que contiene y lanza un unico pr"
- L15 — Delivery: umbrella issue #182; branch feat/182-component-iteration (9 cherry-picked commits, generated docs regenerated); gate: lint/typecheck/build OK, test 1047/1047, exports 50/50, consumption 12/12, props 87/87, tokens 26/26; PR #183 (closes #173–#177, #182; refs #178–#181).
