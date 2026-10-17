---
name: component-spec-proposer
description: "Trigger: definir contrato de componente, especificar componente, proponer ficha, revisar contrato individual. Investiga y propone una ficha verificable antes del plan de implementación."
license: MIT
metadata:
  author: egdev
  version: "0.7"
---

## Activation Contract

Activa para definir o cambiar las promesas de un componente nuevo o existente. Reutilizar sin cambiar promesas no requiere una ficha nueva. No uses para auditar cumplimiento ni implementar: deriva a las skills correspondientes.

## Hard Rules

- Propón; no implementes, cambies tokens/dependencias ni publiques en GitHub.
- Use the shared English output schema without duplicating general rules; write new/updated specs, headings, metadata, visible examples and JSDoc in English. Preserve unrelated legacy prose.
- No infieras disponibilidad desde CSS, catálogo o stories: comprueba implementación React y exports públicos.
- Separa propuesta, evidencia obtenida y comprobaciones previstas. Marca «Not applicable» con motivo; no inventes defaults, comportamiento ni aprobación.
- Conserva API y marcadores públicos existentes salvo propuesta explícita de cambio.
- Aplica la guía de `docs/design/` para referencias visuales: captura real con Playwright MCP o procedencia aportada explícita, condiciones y aprobación recuperables. La implementación actual no es el diseño esperado automáticamente.
- Aprobar la ficha no autoriza código: el plan requiere aprobación independiente. Si hay prerrequisitos pendientes, exige su confirmación específica antes de aprobar el plan.
- Conserva una referencia recuperable a la versión y su aprobación. Si otra sesión no puede recuperar la ficha, detente y pide el contenido; no presupongas aprobación.

## Decision Gates

| Situación | Acción |
| --- | --- |
| Falta decidir reutilización, nivel o paquete | Aplica `component-cataloging`; incorpora su decisión y estado de aprobación, sin duplicar el flujo |
| Falta fuente visual, captura o herramienta autorizada | Registra el bloqueo y propone el siguiente paso; no inventes imágenes, implementes para capturar ni declares apariencia validada |
| Missing data or contradictions | STOP with evidence and concrete choices for human resolution; no dummy files, fake hooks or invented architecture |
| No meaningful compliant CSS role | Record “No stylesheet” in the spec; the optional `component-name.css` is not created. Never add dummy CSS |
| Explicit create-issue / add-comment handoff request | Follow [issue handoff](references/issue-handoff.md): one issue per component; later versions are authorized comments, never silent body edits/new issues per version. Prepare exact snapshots; do not publish or export blocking choices as ready |
| Falta token, receta Material o paquete Radix | Registra propuesta pendiente de confirmación; no lo añadas |
| Cambia una promesa aprobada | Expón diferencia e impacto; solicita nueva aprobación |
| Ficha aprobada explícitamente | Registra versión y referencia; deriva a `component-contributor` para proponer el plan, no para ejecutar código |

## Execution Steps

Before drafting new/changed own props, follow the [registry workflow](../_shared/component-contract.md#prop-naming-registry): inspect the [source](../_shared/prop-naming.json) and [generated view](../../docs/prop-naming.md) by meaning/name/aliases. Record exact reused entry IDs, new proposals with evidence/component types and scoped/reasoned exceptions near the API and in issue handoffs; convention approval is independent of spec/issue approval. Do not duplicate the global matrix.

1. Lee contrato general, plantilla y catalogación. Consulta arquitectura, Material y catálogo para las decisiones afectadas.
2. Si existe el componente, inspecciona props, hook, JSX, exports y evidencia relevante de tests/stories. Si es nuevo, inspecciona las alternativas reutilizables.
3. Complete all seven blocks: purpose, anatomy, API, behavior, accessibility, appearance and acceptance. Agree principal/additional scenarios; link requested real captures under `docs/components/<kebab-name>/v<spec-version>/` with provenance, conditions and VIS hashes. Include the template's snapshot identity and recoverable scoped approval; reuse historical capture versions honestly. Follow the guide's read-only preview → real browser → Playwright MCP component-zone PNG/metadata → separately authorized accessible asset handoff. Map each promise to an appropriate check; stories do not replace behavior tests.
4. Revisa defaults, estados frente a variantes, teclado/foco, reparto de responsabilidades y compatibilidad. Identifica bloqueos antes de pedir aprobación.
5. Presenta el borrador en conversación y acuerda cómo conservar esa versión y su referencia de aprobación para futuras sesiones. Propón una ruta si hace falta; guarda la ficha solo con permiso. Pide aprobación de esa versión y detente.

## Output Contract

Devuelve ficha o bloqueos, rutas inspeccionadas, alternativas consideradas, impacto API y siguiente decisión humana. Indica archivos modificados y comprobaciones ejecutadas, si los hay. Nunca declara implementado lo que solo está especificado.

## References

- [Contrato general](../_shared/component-contract.md)
- [Plantilla individual](../_shared/component-spec-template.md)
- [Referencias visuales y Playwright MCP](../../docs/design/README.md)
- [Catalogación](../component-cataloging/SKILL.md) y [norma](../../docs/CATALOGACION.md)
- [Arquitectura](../../docs/ARQUITECTURA.md), [Material](../../docs/MATERIAL.md) y [catálogo](../../docs/CATALOGO.md)
- [Implementación](../component-contributor/SKILL.md)
- [Auditoría](../components-auditor/SKILL.md)
- [Spec-to-issue handoff](references/issue-handoff.md)
