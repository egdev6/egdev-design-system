# T2 — Tipografía reutilizable y espaciado vinculado

Implementación local de [#10](https://github.com/egdev6/egdev-design-system/issues/10), sobre T1 integrado en `2feccf91914e731d2f28eedc494d01f987d50b17`. Responsable verificado: `egdev6`; rama `feat/10-typography-spacing`. No implica entrega ni integración.

## Contrato aprobado

- Las [13 recetas y valores](../tokens-reference.md) aportan 52 variables `--text-R` con companions de interlineado, peso y tracking; conservar px y valores heredados.
- Las familias `--font-display`, `--font-sans` y `--font-mono`, y las mayúsculas cuando correspondan, se componen aparte. No hay color implícito en `body-muted`.
- Añadir 16 alias de espaciado: base `--spacing` → `--space-1`; 15 pasos existentes `--spacing-N` → `--space-N`.
- Solo el espaciado usa `@theme inline static`: permite emisión nativa completa y overrides locales en utilidades. Colores, familias y companions mantienen `static`.
- Total previsto: 236 variables y 50 alias; conservar los 168 nombres/valores/unidades anteriores y los 34 alias originales. La fixture original permanece inmutable.
- `p-4` = 16px con raíz 16/20px salvo override local. El cambio frente a 0.25rem de Tailwind con raíz 20px fue aprobado explícitamente.

## Responsabilidades y límites

| Unidad | Superficie | Comprobación |
| --- | --- | --- |
| Contrato CSS | Fuente manual de tokens | Recetas, familias/casing separados, alias y paridad |
| Pruebas | Contrato y consumo de paquetes | RED→GREEN, casos de raíz y overrides, nativo/Tailwind separados |
| Referencia | README, arquitectura y ejemplos | Solo CSS es autoritativo; documentación humana coherente |

No se portan componentes ni CSS legacy, ni se amplían dimensiones T3, colores, familias o MCP. Sin dependencias nuevas ni JSON/generadores. La versión del paquete permanece 0.3.0: no hay aprobación de release/versionado adicional. Borrador M3 y cachés quedan fuera.

## Gate previo (no sustituye el candidato)

En un directorio temporal, Vite/Tailwind existentes compilaron las 236 variables y 50 alias; los 168 valores anteriores permanecieron exactos. El navegador verificó las 13 recetas (tamaño/interlineado/peso/tracking y familias compuestas) y los 15 pasos en consumidores nativo y Tailwind con raíces 16/20px. `p-0.5` y `p-9` derivan de la base; overrides locales de paso/base funcionan.

El primer probe interpretó incorrectamente tracking computado `normal` como distinto de cero; se corrigió solo esa normalización y el gate pasó. No acredita descarga de fuentes, accesibilidad global ni código futuro.

## Estado de ejecución

- [x] Spec de nombres, valores, familias/unidades y cambio de raíz aprobada.
- [x] Inicio local de #10 autorizado; identidad/asignación y baseline verificados.
- [x] Gate temporal de compilador/navegador demostrado sin cambios de producto.
- [x] Pruebas públicas RED→GREEN y contrato implementado en fuente.
- [x] Ejemplos/documentación y consumo de paquete actualizado.
- [x] Lint, tipos, tests, builds, exports, navegador/Storybook pertinentes y verificación independiente.
- [x] Autorización posterior para comprobar GitHub y hacer commit + push de la rama con la sesión actual; PR, merge, cierre y release siguen sin autorizar.

## Evidencia del candidato real

- Worker: `pnpm test:tokens` RED exit 1 (10 fallos de 19), antes de añadir declaraciones; GREEN exit 0 (19/19). Casos negativos de peso, companion ausente y alias vecino detectados. El verificador reprodujo GREEN y contrastó la fixture inmutable con HEAD.
- Parent: `pnpm lint` exit 0 tras corregir formato del test nuevo. El primer intento falló en lint y no llegó a ejecutar el resto de la cadena; no fue un fallo de tokens.
- Cadena final `job-35`, exit 0: `pnpm typecheck`, `pnpm test` (UI 28/28), `pnpm test:tokens` (19/19), `pnpm build`, `pnpm test:package-exports` (8/8), `pnpm test:package-consumption` (12/12, React 18.3.1 y 19.3.0), `pnpm storybook-build` y compilación temporal desde la fuente real, sin añadir campos de prototipo.
- Compilador real: 236 variables, 50 alias y 168 originales sin cambios. No duplicados, referencias sin resolver ni ciclos. La fixture de baseline permanece byte-idéntica.
- Playwright: las 13 recetas y los 15 pasos tienen propiedades calculadas correctas en consumidores nativo y Tailwind, con raíces 16/20px. `p-4` = 16px en ambas. Tailwind respeta override local de paso a 24px y de base a 6px (`p-0.5` = 3px, `p-9` = 54px).
- `pnpm test:storybook-mcp`, `job-38`, exit 0: 3/3, contra el servidor docs-only. El primer probe falló por ECONNREFUSED al no haber servidor, sin cambios de código; se inició Storybook y se ejecutó de nuevo el gate con su prerrequisito satisfecho.
- Navegador Storybook: `molecules-tabs--default` visible, 3 tabs y una selección inicial; `--text-code` = 14px y `--spacing-4` = 16px presentes desde el paquete construido. No sustituye un barrido de interacción de todos los componentes.
- Verificación independiente: PASS del contrato estático y 19 tests, sin bloqueantes. Los checks de distribución/navegador anteriores los ejecutó el parent, no el verificador.

### Riesgo y límites de la evidencia

La evaluación nativa fue `unassessable` por archivos untracked con RDD off; se siguió su plan de riesgo alto (self-checks y verificador independiente). No hay aprobación ni receipt nativos. El comportamiento compartido de la escala Tailwind con raíz distinta de 16px cambia intencionadamente: conservar px es parte de la spec aprobada.

LSP activo: 2 archivos confirmados limpios y 1 inconcluso por servidor silencioso; no se afirma que todos estén limpios. Tipos y lint públicos pasaron. Builds conservan advertencias de directivas `use client` de Radix y tamaño de chunks. `effects` mantiene scripts placeholder; no acredita una implementación nueva de effects. No se afirma descarga/render de fuentes, cold-cache de red ni conformidad WCAG global.

`.codegraph/` y `docs/odd/m3-inventory-pilot.md` siguen intactos y excluidos. `dist/tokens.css` y salidas de Storybook son artefactos ignorados, no parte del diff. No usar staging indiscriminado en una futura entrega.

## Entrega prevista

PR única elegida explícitamente tras advertir que 68 variables más pruebas/documentación pueden superar 400 líneas. Mostrar el diff real sin recortar tests o comentarios. No se autoriza commit, push, PR, merge, cierre ni release por esta elección. Este registro local no se ha publicado como comentario de revisión en GitHub.
