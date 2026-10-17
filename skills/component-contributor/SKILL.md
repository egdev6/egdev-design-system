---
name: component-contributor
description: "Implementa o porta un componente de EGDEV Foundation (Claude Design) a @egdev/ui sobre Radix. Trigger: implementar componente, portar componente, crear componente del catálogo."
license: MIT
metadata:
  author: egdev
  version: "0.9"
  basedOn: "stack-and-flow/component-contributor"
---

> Modificado por EGDEV (2026) a partir de material de Stack and Flow (copyright 2025), cuyo original conserva Apache-2.0. Las modificaciones propias se ofrecen bajo MIT. Véanse los [avisos de terceros](../../THIRD_PARTY_NOTICES.md) y la [licencia original](../../LICENSES/Apache-2.0.txt).

## Activation Contract

Para proponer el plan exige decisión y ficha individual aprobadas y recuperables; para escribir código exige además el plan aprobado. Una fila provisional no basta. Sin decisión, usa [component-cataloging](../component-cataloging/SKILL.md). Sin ficha aprobada o si cambian sus promesas, usa [component-spec-proposer](../component-spec-proposer/SKILL.md); no implementes ni inventes aprobación. M2 fija el flujo, no inicia M3 ni acredita adaptación.

## Hard Rules

Read these authorities in order; preserve their safety and English-output requirements:

1. [Contrato](../_shared/component-contract.md), [arquitectura](../../docs/ARQUITECTURA.md) y [catalogación](../../docs/CATALOGACION.md): autoridades.
2. [Catálogo provisional](../../docs/CATALOGO.md) y props/exports React reales.
3. Ficha individual aprobada y su versión/referencia, incluidas las capturas del diseño esperado y sus condiciones según [docs/design](../../docs/design/README.md). Ficha Foundation (`components/<Nombre>/README.md`, `preview.html`), si existe, como evidencia de diseño, no como aprobación ni prueba React. Consulta [Material](../../docs/MATERIAL.md).
4. CSS propio y `packages/ui/src/styles/legacy/bundle.css`.
5. [Radix](references/radix-patterns.md): ignora imports unificados heredados.
6. [Stories](references/stories.md) y [tests](references/testing.md): no impongas rutas/mocks/dependencias ajenos.
7. Current reviewed implementation example: Gauge under its [effective v0.10 base-plus-amendments contract and separate plan approval](../_shared/component-contract.md#current-gauge-contract). It is the only public React component; `cn` is a utility. Surface, IconButton and Tabs are future/provisional Foundation design references, never proof of React availability or completed M3 adaptation.

## Decision Gates

| Situation | Action |
| --- | --- |
| Spec/plan approval, token/dependency confirmation or meaningful compliant stylesheet role missing | STOP for human resolution; exactly seven meaningful files, no dummy files, fake hooks, omission or replacement |

## Execution Steps

For new/changed own props, follow the [registry workflow](../_shared/component-contract.md#prop-naming-registry) using the [source](../_shared/prop-naming.json) and [generated view](../../docs/prop-naming.md): verify meaning/name/aliases, approved-spec entry mappings and reviewed exceptions before coding. Append matching usages; new concepts require explicit semantic IDs/evidence/component types and review, not duplicate entries or automatic migration. Keep convention approval separate; run `pnpm props:check` and `pnpm test:props` after authorized registry changes.

1. **Inspect composition/API.** Missing pieces, packages or tokens: stop and propose, never implement prerequisites without approval. Classify by responsibility/coordination, not size/counts. A future approved Surface may supply Material support; it is not currently importable, privately retained or an automatic prerequisite.
2. **Approve the plan before code:** anatomy, API/defaults, states, accessibility, Radix, Material, paths and consumer/canvas compatibility. Recover exact spec version/content SHA-256, visual hashes and scoped approval from its saved snapshot or canonical issue/comment, never memory alone. Later versions require authorized comments, not body edits/new issues. Document all seven meaningful files and the spec-approved CSS role; resolve the gate above first.
3. **`types.ts`:** public props, `type`, token-backed Tailwind CVA variants, English JSDoc with `@default` only for actual constants (bare string tag values in the installed pipeline); describe derived fallback and absence rules in the ordinary description body, not fixed-value tags. Follow [public prop controls](../_shared/component-contract.md#public-prop-controls) on every own declaration/union branch; use concrete `@controlReason` exceptions, never dummy defaults for required props. Propose separation for semantic changes; native inheritance with `Omit`, `ComponentPropsWithoutRef` without refs. Never infer forwarding/React 18 compatibility.
4. **Approved styling:** token utilities/Material; minimal justified global CSS and approved hand-authored recipe exceptions in `@layer components`, utilities in their natural layer. Stable public roots (`eg-gauge`; historical/future `eg-icon-btn`), accessible ids/`useId()`, Radix/ARIA/data-state variants without mirrored classes; preserve legacy/canvas styles until parity and approved migration. Surface is a future concept, not an available box API. Gauge alone owns a transparent native geometry frame with static CVA utilities and per-part `cn()`: border-box, padding 0, solid border 0 (not Surface's conceptual base 1px), full token radius and foreground, with transparent background, no image and explicit no-shadow reset. Its unchanged 10% alpha track blends with the actual host; no opaque annular backing is added. No Surface import, private React helper, generic Surface-class cloning or general flat replacement. Future components need their own approved recipe or Surface proposal.
   Gauge's approved numeric geometry mechanism is limited to static `w-[var(--eg-gauge-size)]` / `h-[var(--eg-gauge-size)]` plus numeric CSS-pixel custom property; presets use approved token utilities. No interpolated class strings or inline appearance. Its current base-plus-v0.9-plus-v0.10 contract already approves validation/fallback, passive API/accessibility, Material and the geometry-only `gauge.css` role, including +0.5px smoothing; do not reopen accepted decisions. Changed promises or expanded roles require separate approval. Neither Gauge exception waives seven meaningful files or grants global appearance permission.
5. **`useComponentName.ts`:** meaningful logic, state, refs, handlers, aria and CVA calls; typed return without `any`. Use per-part `cn()` (`clsx` + `twMerge`) with spec-defined supported className surfaces/merge limits, not arbitrary appearance overrides.
6. **`ComponentName.tsx`:** solo JSX, hook y props explícitas; namespaces `@radix-ui/react-*` ya disponibles. No reimplementes teclado/foco/ARIA. Verifica `Portal`, `asChild`, `...rest` y semántica nativa.
7. **Tests/stories:** hook/componente con `renderHook`, `render`, roles/nombres y `userEvent`; defaults, ARIA, teclado y deshabilitado aplicables. Sin cadenas completas de clases; raíz pública/invariantes `cn()` sí. Storybook 10: autodocs, `Meta`/`StoryObj` de `@storybook/react-vite`, `action` de `storybook/actions`; sin `argTypes` manuales/`play`. Prueba `react-docgen-typescript` real: required, enums, nativas, defaults, `asChild`. Follow the approved [central metadata integration](../_shared/component-contract.md#public-prop-controls): only `text`/`number`/`boolean`/`select`/`false`, with type validation and concrete false-control reasons. Require zero owned-metadata diagnostics and installed extraction/enhancer/inference tests, then browser widget evidence; tags/AST alone are insufficient. This exception grants no per-component `argTypes` or rendering adapter permission. Required/example args only; `Default` must not replace defaults.
8. **`index.ts`:** exports nombrados de componente/tipos y en índice público; límites de paquete aplicables.
9. **Catálogo autorizado:** `scripts/catalog_data.py` y `python3 scripts/build_catalog.py`, nunca edición del generado.
10. **Verify:** use canonical capture paths `docs/components/<kebab-name>/v<spec-version>/` (historical archives remain valid); compare approved expected-design references under equivalent conditions; record differences by criterion without replacing references with current implementation. Without comparable evidence report visual conformity as Not evaluated. Run focused checks first, suites/Storybook only when authorized; metadata, HTML smoke or lint do not prove appearance/accessibility.

### Delivery safeguards

- Tokens/dependencias: confirmación específica. Contradicciones: para y pregunta con evidencia.
- Código/tests/IDs y toda documentación nueva o actualizada en inglés: fichas, READMEs, JSDoc y stories, incluidos encabezados, descripciones, comentarios, nombres visibles, etiquetas y textos de ejemplo. Sin datos personales; no traduzcas legado fuera del alcance autorizado.
- Sin commits, issues, labels ni gates externos automáticos.

## Output Contract

Return files, approvals, observed checks and pending work, separating planned from implemented and functional verification from native approval. Include actual CSS build/static CVA scanning and package-consumer evidence without a Tailwind compiler; do not claim unrun checks.

## References

Use the ordered authorities above; stack verification status: [ODD](../../docs/odd/stack-alignment.md).
