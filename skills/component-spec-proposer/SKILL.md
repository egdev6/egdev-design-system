---
name: component-spec-proposer
description: "Trigger: definir contrato de componente, especificar componente, proponer ficha, revisar contrato individual. Investiga y propone una ficha verificable antes del plan de implementación."
license: MIT
metadata:
  author: egdev
  version: "0.2"
---

## Activation Contract

Activa para definir o cambiar las promesas de un componente nuevo o existente. Reutilizar sin cambiar promesas no requiere una ficha nueva. No uses para auditar cumplimiento ni implementar: deriva a las skills correspondientes.

## Hard Rules

- Propón; no implementes, cambies tokens/dependencias ni publiques en GitHub.
- Usa la plantilla compartida sin duplicar las normas generales. Escribe la ficha en español; conserva identificadores de código en inglés.
- No infieras disponibilidad desde CSS, catálogo o stories: comprueba implementación React y exports públicos.
- Separa propuesta, evidencia obtenida y comprobaciones previstas. Marca «No aplica» con motivo; no inventes defaults, comportamiento ni aprobación.
- Conserva API y marcadores públicos existentes salvo propuesta explícita de cambio.
- Aprobar la ficha no autoriza código: el plan requiere aprobación independiente. Si hay prerrequisitos pendientes, exige su confirmación específica antes de aprobar el plan.
- Conserva una referencia recuperable a la versión y su aprobación. Si otra sesión no puede recuperar la ficha, detente y pide el contenido; no presupongas aprobación.

## Decision Gates

| Situación | Acción |
| --- | --- |
| Falta decidir reutilización, nivel o paquete | Aplica `component-cataloging`; incorpora su decisión y estado de aprobación, sin duplicar el flujo |
| Faltan datos o hay contradicciones | Devuelve preguntas y evidencia pendiente; no presentes la ficha como lista para aprobar |
| Falta token, receta Material o paquete Radix | Registra propuesta pendiente de confirmación; no lo añadas |
| Cambia una promesa aprobada | Expón diferencia e impacto; solicita nueva aprobación |
| Ficha aprobada explícitamente | Registra versión y referencia; deriva a `component-contributor` para proponer el plan, no para ejecutar código |

## Execution Steps

1. Lee contrato general, plantilla y catalogación. Consulta arquitectura, Material y catálogo para las decisiones afectadas.
2. Si existe el componente, inspecciona props, hook, JSX, exports y evidencia relevante de tests/stories. Si es nuevo, inspecciona las alternativas reutilizables.
3. Completa los siete bloques: propósito, anatomía, API, comportamiento, accesibilidad, apariencia y aceptación. Relaciona cada promesa verificable con test o comprobación adecuada; una story no sustituye un test de comportamiento.
4. Revisa defaults, estados frente a variantes, teclado/foco, reparto de responsabilidades y compatibilidad. Identifica bloqueos antes de pedir aprobación.
5. Presenta el borrador en conversación y acuerda cómo conservar esa versión y su referencia de aprobación para futuras sesiones. Propón una ruta si hace falta; guarda la ficha solo con permiso. Pide aprobación de esa versión y detente.

## Output Contract

Devuelve ficha o bloqueos, rutas inspeccionadas, alternativas consideradas, impacto API y siguiente decisión humana. Indica archivos modificados y comprobaciones ejecutadas, si los hay. Nunca declara implementado lo que solo está especificado.

## References

- [Contrato general](../_shared/component-contract.md)
- [Plantilla individual](../_shared/component-spec-template.md)
- [Catalogación](../component-cataloging/SKILL.md) y [norma](../../docs/CATALOGACION.md)
- [Arquitectura](../../docs/ARQUITECTURA.md), [Material](../../docs/MATERIAL.md) y [catálogo](../../docs/CATALOGO.md)
- [Implementación](../component-contributor/SKILL.md)
- [Auditoría](../components-auditor/SKILL.md)
