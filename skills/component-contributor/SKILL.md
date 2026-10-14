---
name: component-contributor
description: "Implementa o porta un componente de EGDEV Foundation (Claude Design) a @egdev/ui sobre Radix. Trigger: implementar componente, portar componente, crear componente del catálogo."
license: MIT
metadata:
  author: egdev
  version: "0.4"
  basedOn: "stack-and-flow/component-contributor"
---

> Modificado por EGDEV (2026) a partir de material de Stack and Flow (copyright 2025), cuyo original conserva Apache-2.0. Las modificaciones propias se ofrecen bajo MIT. Véanse los [avisos de terceros](../../THIRD_PARTY_NOTICES.md) y la [licencia original](../../LICENSES/Apache-2.0.txt).

## Cuándo usarla

Para proponer el plan exige decisión y ficha individual aprobadas y recuperables; para escribir código exige además el plan aprobado. Una fila provisional no basta. Sin decisión, usa [component-cataloging](../component-cataloging/SKILL.md). Sin ficha aprobada o si cambian sus promesas, usa [component-spec-proposer](../component-spec-proposer/SKILL.md); no implementes ni inventes aprobación. M2 fija el flujo, no inicia M3 ni acredita adaptación.

## Lecturas obligatorias, en este orden

1. [Contrato](../_shared/component-contract.md), [arquitectura](../../docs/ARQUITECTURA.md) y [catalogación](../../docs/CATALOGACION.md): autoridades.
2. [Catálogo provisional](../../docs/CATALOGO.md) y props/exports React reales.
3. Ficha individual aprobada y su versión/referencia, incluidas las capturas del diseño esperado y sus condiciones según [docs/design](../../docs/design/README.md). Ficha Foundation (`components/<Nombre>/README.md`, `preview.html`), si existe, como evidencia de diseño, no como aprobación ni prueba React. Consulta [Material](../../docs/MATERIAL.md).
4. CSS propio y `packages/ui/src/styles/legacy/bundle.css`.
5. [Radix](references/radix-patterns.md): ignora imports unificados heredados.
6. [Stories](references/stories.md) y [tests](references/testing.md): no impongas rutas/mocks/dependencias ajenos.
7. Referencias existentes Surface, IconButton o Tabs, sin asumir conformidad.

## Pasos

1. **Inspecciona composición/API.** Piezas, paquetes o tokens ausentes: bloquea y propone, nunca implementes prerrequisitos sin aprobación. Nivel por responsabilidad/coordinación, no tamaño/recuentos; Surface es apoyo legítimo.
2. **Presenta el plan y espera aprobación humana antes de código:** anatomía, API/defaults, estados, accesibilidad, Radix, Material, rutas y compatibilidad/lienzos. Siete responsabilidades significativas; excepciones justificadas y aprobadas, nunca archivos vacíos.
3. **`types.ts`:** props públicas, `type`, CVA/BEM, JSDoc español y `@default` real, incluidos defaults derivados. Cambios semánticos: propón separar. Herencia nativa con `Omit`; `ComponentPropsWithoutRef` si excluye refs. No infieras forwarding/compatibilidad React 18.
4. **CSS del port aprobado:** tokens/receta Material, Surface para cajas con materia; hoja propia importada con `layer(components)`. Nada de recetas improvisadas/migración masiva. Raíz pública estable: IconButton = `eg-icon-btn`, nunca `eg-icon-button`; nuevas raíces `eg-<nombre>`. Estados por atributos Radix/ARIA o `data-state`, ids accesibles con `useId()`. Conserva legado/`.is-*` de lienzos hasta paridad y retirada aprobadas.
5. **`useComponentName.ts`:** lógica, estado, refs, handlers, aria y llamada CVA; retorno tipado sin `any`, `cn()` para raíz/`className` de layout.
6. **`ComponentName.tsx`:** solo JSX, hook y props explícitas; namespaces `@radix-ui/react-*` ya disponibles. No reimplementes teclado/foco/ARIA. Verifica `Portal`, `asChild`, `...rest` y semántica nativa.
7. **Tests/stories:** hook/componente con `renderHook`, `render`, roles/nombres y `userEvent`; defaults, ARIA, teclado y deshabilitado aplicables. Sin cadenas completas de clases; raíz pública/invariantes `cn()` sí. Storybook 10: autodocs, `Meta`/`StoryObj` de `@storybook/react-vite`, `action` de `storybook/actions`; sin `argTypes` manuales/`play`. Prueba `react-docgen-typescript` real: required, enums, nativas, defaults, `asChild`. `@control` no garantiza widget; args requeridos/ejemplos, `Default` sin sustituir defaults.
8. **`index.ts`:** exports nombrados de componente/tipos y en índice público; límites de paquete aplicables.
9. **Catálogo autorizado:** `scripts/catalog_data.py` y `python3 scripts/build_catalog.py`, nunca edición del generado.
10. **Verifica:** compara la apariencia con las referencias visuales aprobadas en condiciones equivalentes y registra diferencias por criterio, sin reemplazar la referencia por la implementación actual. Sin evidencia comparable, declara conformidad visual «no evaluado». Pruebas focalizadas primero; suites/Storybook solo autorizados. Metadatos, smoke HTML o lint no prueban apariencia/accesibilidad.

## Reglas

- Tokens/dependencias: confirmación específica. Contradicciones: para y pregunta con evidencia.
- Código/tests/IDs en inglés; documentación/stories nuevas en español, sin datos personales. No traduzcas legado fuera de alcance.
- Sin commits, issues, labels ni gates externos automáticos.

## Entrega

Devuelve archivos, decisiones aprobadas, resultados observados y pendientes. Distingue previsto/implementado y verificación funcional/aprobación nativa. Estado del stack: [ODD](../../docs/odd/stack-alignment.md).
