# @egdev/tokens

Tokens de EGDEV Foundation escritos directamente en CSS. Una sola fuente manual conserva Grafito y Material; no hay JSON ni generadores propios.

## Editar y construir

1. Propón y acuerda cualquier cambio de nombres o valores.
2. Edita únicamente `src/theme.css`.
3. Ejecuta `pnpm tokens` desde la raíz para compilar la salida nativa.

| Archivo | Responsabilidad |
| --- | --- |
| `src/theme.css` | Fuente manual: 113 variables en `@theme static` y 55 en `:root` |
| `src/native.css` | Entrada de compilación; importa la fuente y activa el compilador, sin duplicar valores |
| `dist/tokens.css` | Artefacto nativo de Vite/Tailwind; no se edita ni se versiona |

`pnpm test:tokens` compila y comprueba el contrato, la integridad de alias y la paridad con el baseline inmutable. Tras `pnpm build`, `pnpm test:package-exports` y `pnpm test:package-consumption` verifican distribución y consumo nativo/Tailwind fuera del workspace.

El plugin oficial de Tailwind compila con optimización desactivada para preservar los colores alfa y los alias. `static` mantiene todas las variables aunque no haya utilidades usadas. No se añade preflight ni utilidades al import nativo.

## Consumir

Sin Tailwind, importa el paquete construido:

```css
@import "@egdev/tokens/tokens.css";
@import "@egdev/ui/styles.css";
```

Con Tailwind v4:

```css
@import "tailwindcss";
@import "@egdev/tokens/theme.css";
@import "@egdev/ui/styles.css";
```

No importes la fuente `@theme` sin compilar en un navegador. Los subpaths CSS públicos se mantienen; sus archivos internos pueden cambiar de ubicación.

## Migración 0.2 → 0.3

Se retira el export `@egdev/tokens/tokens.json`, el archivo y sus dos generadores. No se publica una release por preparar esta versión. Los 168 tokens y 34 alias conservan nombres, valores y unidades; las notas de uso permanecen junto a la fuente.

Las [13 recetas tipográficas y su procedencia](../../docs/tokens-reference.md) se conservan como referencia para T2: aún no son nuevas utilidades. La futura consulta estructurada por MCP no exige un archivo JSON y queda fuera de esta migración.

## Límites

Los tokens y recetas de [Material v2](../../docs/MATERIAL.md) conservan su autoridad. Los degradados y demás variables sin utilidad siguen en `:root`. `--color-*: initial` reinicia solo la paleta Tailwind, no todas las escalas.

`--space-*` sigue usando sus valores actuales en px. `p-4` no referencia `--space-4`: la vinculación de espaciado y Tailwind corresponde a T2, junto con la tipografía; las dimensiones semánticas corresponden a T3.
