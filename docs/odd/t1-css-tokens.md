# T1 — Tokens como fuente CSS única

Implementación local de [#9](https://github.com/egdev6/egdev-design-system/issues/9), sobre M1/M2 integrados en `13cb1252`. No implica entrega ni integración. Responsable verificado: `egdev6`; rama `refactor/9-css-tokens`.

## Contrato aprobado

- Fuente manual `packages/tokens/src/theme.css`: 113 variables de utilidades en `@theme static`, 55 en `:root`.
- Conservar 168 nombres/valores/unidades y 34 alias; Material y API `eg-*` no cambian.
- `tokens.css` es la salida nativa de compilación CSS estándar, no una segunda fuente manual.
- Mantener `@egdev/tokens/tokens.css` y `@egdev/tokens/theme.css`; retirar export/archivo JSON y dos generadores propios en la versión propuesta 0.3.0.
- Conservar notas de uso en la fuente y las [13 recetas no exportadas](../tokens-reference.md) como referencia para T2.
- MCP se abordará después: ni herramienta nueva ni generación de JSON por esta tarea.

## Responsabilidades y límites

| Unidad | Superficie | Comprobación |
| --- | --- | --- |
| Fuente y compilación | Paquete tokens, Vite y entrada CSS nativa | Paridad, ausencia de `@theme` en salida, sin utilidades/preflight |
| Integridad y distribución | Tests de tokens/exports/consumo | RED→GREEN y negativos: duplicados, ausentes, ciclos y deriva |
| Consumo y normas | Storybook, README, arquitectura, AGENTS y contrato | Imports públicos y documentación coherentes |

No se amplían escalas, fuentes, tipografía ni dimensiones; no se migra CSS legado ni se añaden dependencias. T2/T3 mantienen sus unidades independientes tras integrar T1. No modificar ni entregar el borrador M3 o cachés.

## Decisión técnica comprobada

El gate temporal de compilación usa Vite 8.3.4 y `@tailwindcss/vite` 4.3.3 existentes. La entrada nativa importa la fuente y declara `@tailwind utilities source(none)` para activar el compilador sin escaneo/utilidades. Se desactiva la optimización del plugin y `cssMinify` para conservar valores exactos.

| Gate | Resultado real |
| --- | --- |
| CSS de `@theme` como entrada directa | FAIL: la salida conservaba `@theme` sin transformar |
| Entrada CSS explícita, optimización por defecto | FAIL de paridad: conversión RGBA a hexadecimal con alfa |
| Entrada explícita, `optimize: false` | PASS, 168 variables y valores/alias exactos; sin `@theme` |

Estos son prototipos temporales, no pruebas del candidato final. No se considera `inline` un sustituto de `static`: cambiaría la expresión de las utilidades y la resolución de variables.

## Estado de ejecución

- [x] Especificación y retirada JSON aprobadas en conversación; futura consulta MCP diferida.
- [x] Identidad/asignación y dependencia de M2 verificadas; baseline sin diferencias de árbol.
- [x] Gate de compilación estándar demostrado sin nuevas dependencias.
- [x] Pruebas de contrato RED→GREEN y migración del paquete.
- [x] Lint, tipos, tests, build, exports y consumo nativo/Tailwind separados.
- [x] Storybook/MCP y navegador pertinentes, verificación independiente y lectura estructural.
- [ ] Entrega autorizada en conversación: commit, push y PR única pendientes de ejecución/verificación. Sin merge, cierre automático ni release.

## Evidencia del candidato local

- Writer: contrato RED (7 fallos/9, exit 1) antes de migrar; GREEN inicial 9/9, exports 8/8 y consumo 12/12 (exit 0).
- Parent `job-19`: lint, tipos, UI 28/28, tokens 9/9, build, exports 8/8 y consumo React 18/19 12/12 pasan. Storybook falla al resolver el import público desde la raíz, que no declara esa dependencia.
- Corrección Storybook: preview importa `../packages/tokens/dist/tokens.css`; los scripts compilan tokens antes de iniciar/build. `job-20`: build Storybook exit 0, sin dependencias nuevas.
- Verificador independiente `mv5xfcyy-5-w1xg`: PASS acotado para paridad, exports, fixture original, atribución de datos y corrección Storybook; no aprobación nativa.
- Sus observaciones de reset/fallback se reprodujeron: 2 nuevos tests fallan (9 pasan/11, exit 1); corrección del patrón global y referencias requeridas → 11/11, exit 0. Se tradujeron comentarios nuevos de configuración/entrada a inglés. El primer lint posterior señaló formato; tras formatear solo el test, lint/tipos/diff-check pasan.
- MCP `job-22`: 3/3, exit 0. Navegador compara los 168 valores computados de baseline y salida nativa en iframes aislados: paridad completa, colores/familia/sombras Material idénticos y override de `--color-surface-1` conservado (`rgb(12, 34, 56)`). Surface mantiene su gradiente y sombras en Storybook.
- LSP activo: configuración, validador y tests (3 archivos) sin diagnósticos de error.

RDD está desactivado en este clon. La evaluación nativa no pudo clasificar por archivos untracked; se aplicó verificación independiente, sin reclamar aprobación nativa. Los scripts placeholder de effects no acreditan validación de ese paquete. La consulta MCP de tokens, T2/T3 y M3 quedan fuera. No se ejecuta una release.

## Entrega prevista

PR única elegida expresamente para T1 después del aviso de tamaño: solo retirar JSON supone 1.057 líneas. Mantener pruebas/documentación con la migración y mostrar el diff real, sin comprimirlo. Tras la verificación local, el usuario autoriza commit, push y apertura de PR con `Refs #9`; también autoriza aplicar `status:approved` a la issue. No autoriza merge, cierre ni release. Esta nota acompaña el código; no se ha publicado como comentario de revisión en GitHub.
