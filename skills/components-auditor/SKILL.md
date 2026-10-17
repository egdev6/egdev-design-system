---
name: components-auditor
description: "Revisa un componente de @egdev/ui contra el contrato, Radix, Storybook, tests, tokens y accesibilidad. Trigger: auditar componente, revisar componente, ¿está bien este componente?"
license: MIT
metadata:
  author: egdev
  version: "0.8"
  basedOn: "stack-and-flow/components-auditor"
---

> Modificado por EGDEV (2026) a partir de material de Stack and Flow (copyright 2025), cuyo original conserva Apache-2.0. Las modificaciones propias se ofrecen bajo MIT. Véanse los [avisos de terceros](../../THIRD_PARTY_NOTICES.md) y la [licencia original](../../LICENSES/Apache-2.0.txt).

## Activation Contract

Audita solo el alcance explícito; corregir requiere autorización aparte. M2 no acredita adaptación de M3. Un veredicto funcional no es aprobación nativa ni autoriza mutaciones externas.

## Hard Rules

Read the following authorities before inspection; audit only, never infer approval:

1. [Contrato](../_shared/component-contract.md), [arquitectura](../../docs/ARQUITECTURA.md) y [catalogación](../../docs/CATALOGACION.md): autoridades.
2. [Radix](../component-contributor/references/radix-patterns.md): ignora imports unificados heredados.
3. [Stories](../component-contributor/references/stories.md) y [tests](../component-contributor/references/testing.md): no impongas rutas/mocks/dependencias ajenos.
4. [Catálogo provisional](../../docs/CATALOGO.md) y props/exports React reales.
5. [Referencias visuales](../../docs/design/README.md), imágenes/condiciones/aprobación de la ficha; fuente actual no equivale a diseño esperado.
6. [Material](../../docs/MATERIAL.md) y `packages/tokens/src/theme.css` y su salida construida `packages/tokens/dist/tokens.css`.

## Decision Gates

| Situation | Action |
| --- | --- |
| Missing inspection, recoverable spec/approval or comparable visual evidence | Mark affected scope Not evaluated, never fabricate a pass/native approval |
| A stylesheet exists without a meaningful approved role, or is empty/dummy | Report a finding; the optional `component-name.css` must be removed or its role approved. No fake hooks or invented architecture |

## Execution Steps

Audit new/changed own props against the [registry source](../_shared/prop-naming.json), [generated view](../../docs/prop-naming.md), [shared workflow](../_shared/component-contract.md#prop-naming-registry) and approved spec: verify meaning/name/alias lookup, exact entry-ID coverage, component types, separate convention approval and reviewed exception scope/reason. Do not demand mass registration of unrelated/native props or infer approval from existing usages. `pnpm props:check` and `pnpm test:props` validate registry tooling, not AST/semantic API conformance; report that review separately.

1. **Scope:** directory, API/exports, approved recoverable spec/version, plan and applicable criteria. Without a recoverable spec, continue general-contract inspection, mark individual criteria Not evaluated and recommend [component-spec-proposer](../component-spec-proposer/SKILL.md) without executing it or inventing approval. Cite paths/lines and real tests/fixtures; uninspected means Not evaluated.
   Verify snapshot version/content SHA-256, visual hashes, recoverable scoped approval and canonical issue/latest published comment; do not accept memory-only proofs. One component keeps one issue; later snapshots belong in authorized comments, not silent body edits or new issues per version.
2. **Contract:** six meaningful mandatory files plus an optional stylesheet only with an approved role, not empty files/fake hooks or counts/lint alone. JSX consumes hook; hook owns logic/CVA calls, types.ts owns variants/props. Check type, actual JSDoc/defaults, native inheritance, ...rest, refs, exports/package boundaries; types/peer do not prove React compatibility.
   Check every own public declaration/union branch against [public prop controls](../_shared/component-contract.md#public-prop-controls), including concrete English `@controlReason` exceptions and no dummy defaults for required props. Apply the shared default policy: constant-only `@default`, derived/absence rules in description text, exact final Docs summaries without extra quotes, and no optional args injected to fill unset Controls. Separate AST coverage, real docgen metadata, the approved central extraction/enhancer/inference pipeline and browser evidence. The [central enhancer](../_shared/component-contract.md#public-prop-controls) maps only validated `text`/`number`/`boolean`/`select`/`false`; require zero owned-metadata diagnostics, concrete false-control reasons and retained documentation rows. It is not native tag support or permission for component `argTypes`/rendering adapters; tags alone prove no widgets.
3. **Catálogo:** evidencia de mantener/reutilizar → variante → componer → extraer → nuevo. Nivel por responsabilidad semántica/coordinación, no tamaño/CSS/recuentos. Surface es apoyo legítimo; detecta cambios semánticos o conceptos separables.
4. **Radix/nativos:** namespace de paquetes individuales, primitiva, `Portal`, `asChild`, estados por atributo. Teclado/foco/ARIA/deshabilitado reales; no reimplementación ni interacción inventada para nativos.
5. **Material/styling:** token-backed Tailwind/CVA, per-part cn/clsx/twMerge surfaces/limits, approved meaningful CSS role and minimal global exceptions; recipes in layer(components), utilities in their natural layer. Check Surface, well/overlay/solid, focus, reduced motion/transparency; stable eg-icon-btn/public markers, useId, Radix/ARIA/data-state variants without mirrored classes. Preserve legacy until parity and migration approval; no arbitrary consumer overrides.
   Gauge numeric geometry alone may use static `w-[var(--eg-gauge-size)]` / `h-[var(--eg-gauge-size)]` with numeric CSS-pixel custom property; presets use approved token utilities. Flag interpolated utility strings/inline appearance. This does not approve numeric validation/bounds, full API/accessibility/Material or `gauge.css`; require necessity evidence and human review, never waive the six mandatory files.
6. **Visual conformity:** compare approved VIS IDs with Playwright MCP only on authorized sources/conditions. Use canonical `docs/components/<kebab-name>/v<spec-version>/` captures with real component-zone PNGs/metadata; historical archives remain valid. Verify hosted image accessibility/hash per the guide before issue/comment links, never infer publication authority. Record observed capture, viewport, theme, state and per-criterion differences; never overwrite references or infer tokens from pixels. Missing references/approval/comparable conditions/tooling means Not evaluated; continue other inspection and report the blocker. Material/token/accessibility conflicts require human decision, not matching pixels at the contract's expense.
7. **Stories:** Storybook 10/autodocs, `@storybook/react-vite`, `storybook/actions`; sin `argTypes` manuales/`play`. Prueba docgen real: required, nativas, enums, defaults, `asChild`; args requeridos/ejemplos sin sustituir defaults. `@control` no prueba widget ni smoke HTML apariencia. Código/IDs, documentación nueva o actualizada, JSDoc y textos de stories en inglés; traducción heredada solo dentro del alcance autorizado.
8. **Tests/accesibilidad:** hook/componente, defaults, roles/nombres, ARIA, teclado, interacción/deshabilitado, contraste, color nunca solo y tamaño táctil aplicables. No cadenas completas de clases; sí invariantes de raíz pública/`cn()`. Pruebas pertinentes, no dependencias ajenas.

### Severity

Use **CRITICAL** for accessibility/unsafe TypeScript/focus/disabled/public API failures; **MAJOR** for blocking contract violations (responsibility, CVA, tokens, Radix, level); **MINOR** for incomplete non-breaking docs/stories/tests; **SUGGESTION** for optional improvements.
Functional verdicts: **PASS** (no findings), **PASS WITH WARNINGS** (only minor/suggestions), **FAIL** (open critical/major), **Not evaluated** (essential evidence absent). Identify authorized exceptions, never infer acceptance. Without a recoverable spec, individual compliance and overall verdict remain Not evaluated; report inspected general-contract findings separately. Uninspected scope never passes.

## Output Contract

Run only authorized focused checks first; no automatic suites, servers, fixes or external gates. Return the English schema below; distinguish planned checks from observed evidence, including CSS build/static CVA scanning and package consumption without a Tailwind compiler.

```md
## Audit — {Component}
**Functional verdict:** PASS / PASS WITH WARNINGS / FAIL / Not evaluated
**Scope:** {files, API and exclusions}
**Individual spec:** {recoverable location/version/approval or Missing}
**Visual references:** {IDs, paths, approval, compared conditions or Pending / Not evaluated}
**Native approval:** Not granted by this audit

| Area | Status | Evidence / limits |
|---|---|---|
| Contract / cataloging and level / Radix / styles and tokens / visual conformity / stories / tests / accessibility | PASS / WARNING / FAIL / Not evaluated | {report each area separately} |

### Findings
- [SEVERITY] `file:line` — {problem, evidence/fixture, expected/observed, rule and proposed correction}
### Checks
- `<exact authorized command>`: {observed result or Not run and reason}
- {Documentary/runtime/browser evidence, scenarios and limits; pending work, reference conflicts and proposed fixes}
```

## References

Use the linked authorities under Hard Rules; no registry refresh is needed without skill creation, removal, movement or renaming.
