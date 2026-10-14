---
name: components-auditor
description: "Revisa un componente de @egdev/ui contra el contrato, Radix, Storybook, tests, tokens y accesibilidad. Trigger: auditar componente, revisar componente, ¿está bien este componente?"
license: MIT
metadata:
  author: egdev
  version: "0.3"
  basedOn: "stack-and-flow/components-auditor"
---

> Modificado por EGDEV (2026) a partir de material de Stack and Flow (copyright 2025), cuyo original conserva Apache-2.0. Las modificaciones propias se ofrecen bajo MIT. Véanse los [avisos de terceros](../../THIRD_PARTY_NOTICES.md) y la [licencia original](../../LICENSES/Apache-2.0.txt).

## Cuándo usarla

Audita solo el alcance explícito; corregir requiere autorización aparte. M2 no acredita adaptación de M3. Un veredicto funcional no es aprobación nativa ni autoriza mutaciones externas.

## Lecturas obligatorias

1. [Contrato](../_shared/component-contract.md), [arquitectura](../../docs/ARQUITECTURA.md) y [catalogación](../../docs/CATALOGACION.md): autoridades.
2. [Radix](../component-contributor/references/radix-patterns.md): ignora imports unificados heredados.
3. [Stories](../component-contributor/references/stories.md) y [tests](../component-contributor/references/testing.md): no impongas rutas/mocks/dependencias ajenos.
4. [Catálogo provisional](../../docs/CATALOGO.md) y props/exports React reales.
5. [Material](../../docs/MATERIAL.md) y `packages/tokens/src/theme.css` y su salida construida `packages/tokens/dist/tokens.css`.

## Fases

1. **Alcance:** carpeta, API/exports, ficha individual aprobada (versión y referencia), plan y criterios aplicables. Si no hay ficha recuperable, continúa la auditoría del contrato general, marca los criterios individuales «no evaluado» y recomienda [component-spec-proposer](../component-spec-proposer/SKILL.md) para definirla, sin ejecutar ese flujo ni inventar aprobación. Evidencia con rutas/líneas y pruebas/fixtures reales; no inspeccionado = «no evaluado».
2. **Contrato:** siete responsabilidades significativas, no vacíos/recuentos/lint. JSX consume hook; lógica/llamada CVA en hook, variantes/props en `types.ts`. Comprueba `type`, JSDoc/defaults reales, herencia nativa, `...rest`, refs, exports/límites de paquete aplicables; tipos/peer no prueban compatibilidad React.
3. **Catálogo:** evidencia de mantener/reutilizar → variante → componer → extraer → nuevo. Nivel por responsabilidad semántica/coordinación, no tamaño/CSS/recuentos. Surface es apoyo legítimo; detecta cambios semánticos o conceptos separables.
4. **Radix/nativos:** namespace de paquetes individuales, primitiva, `Portal`, `asChild`, estados por atributo. Teclado/foco/ARIA/deshabilitado reales; no reimplementación ni interacción inventada para nativos.
5. **Material/CSS:** tokens/receta, Surface, hoja propia en `layer(components)`, foco y alternativas movimiento/transparencia. Raíz pública estable (IconButton: `eg-icon-btn`), ids accesibles/`useId()`, estados Radix/ARIA/`data-state`. Legado/lienzos según paridad/migración aprobadas, nunca borrar `.is-*` o renombrar automáticamente.
6. **Stories:** Storybook 10/autodocs, `@storybook/react-vite`, `storybook/actions`; sin `argTypes` manuales/`play`. Prueba docgen real: required, nativas, enums, defaults, `asChild`; args requeridos/ejemplos sin sustituir defaults. `@control` no prueba widget ni smoke HTML apariencia. Código/IDs inglés, textos nuevos español; traducción heredada solo autorizada.
7. **Tests/accesibilidad:** hook/componente, defaults, roles/nombres, ARIA, teclado, interacción/deshabilitado, contraste, color nunca solo y tamaño táctil aplicables. No cadenas completas de clases; sí invariantes de raíz pública/`cn()`. Pruebas pertinentes, no dependencias ajenas.

## Severidad

| Nivel | Significado |
|---|---|
| CRÍTICO | Fallo de accesibilidad, TypeScript inseguro, foco o deshabilitado roto, API pública rota |
| MAYOR | Violación del contrato que bloquea: responsabilidades mal repartidas, CVA fuera de sitio, valores fuera de tokens, Radix reimplementado, nivel equivocado |
| MENOR | Documentación, stories o tests incompletos sin romper nada |
| SUGERENCIA | Mejora opcional |

Veredicto funcional: **PASA** (sin hallazgos), **PASA CON AVISOS** (solo menores/sugerencias), **NO PASA** (críticos/mayores abiertos). Explicita excepciones autorizadas, nunca infieras aceptación. Evidencia esencial ausente: «no evaluado» y pendientes, no pase ni aprobación nativa. Sin ficha recuperable, el cumplimiento individual y el veredicto global quedan «no evaluado»; informa los hallazgos comprobados del contrato general por separado.

## Informe

Comprobaciones focalizadas primero y solo autorizadas; sin suites, servidores, cambios ni gates externos automáticos. Devuelve:

```md
## Auditoría — {Componente}

**Veredicto funcional:** PASA / PASA CON AVISOS / NO PASA / no evaluado
**Alcance:** {archivos, API y exclusiones}
**Ficha individual:** {ruta o referencia recuperable y versión; o ausente/no recuperable}
**Aprobación nativa:** no otorgada por esta auditoría

| Área | Estado | Notas |
|---|---|---|
| Contrato | ✅ / ⚠️ / ❌ | |
| Catálogo y nivel | ✅ / ⚠️ / ❌ | |
| Radix | ✅ / ⚠️ / ❌ | |
| Estilos y tokens | ✅ / ⚠️ / ❌ | |
| Stories | ✅ / ⚠️ / ❌ | |
| Tests | ✅ / ⚠️ / ❌ | |
| Accesibilidad | ✅ / ⚠️ / ❌ | |

### Hallazgos
- [SEVERIDAD] `archivo:línea` — Problema … Evidencia/fixture … Esperado … Encontrado … Regla … Corrección propuesta …

### Comprobaciones
- `<comando exacto autorizado>`: resultado observado / no ejecutado y motivo
- Evidencia documental / runtime / navegador: ruta o escenario y límites
- Pendientes, contradicciones de referencias y correcciones propuestas: …
```
