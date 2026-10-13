# @egdev/tokens

Tokens de EGDEV Foundation escritos directamente en CSS. Una sola fuente manual conserva Grafito y Material; no hay JSON ni generadores propios.

## Editar y construir

1. Propón y acuerda cualquier cambio de nombres o valores.
2. Edita únicamente `src/theme.css`.
3. Ejecuta `pnpm tokens` desde la raíz para compilar la salida nativa.

| Archivo | Responsabilidad |
| --- | --- |
| `src/theme.css` | Fuente manual: 165 variables en `@theme static`, 16 alias de espaciado en `@theme inline static` y 55 en `:root` |
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

Se retira el export `@egdev/tokens/tokens.json`, el archivo y sus dos generadores. No se publica una release por preparar esta versión. T1 conservó los 168 tokens y 34 alias anteriores; T2 los mantiene y amplía el total a 236 variables y 50 alias. Las notas de uso permanecen junto a la fuente.

Las [13 recetas tipográficas y su procedencia](../../docs/tokens-reference.md) se publican en T2 mediante `--text-*` y sus companions; familia y mayúsculas se componen aparte. La futura consulta estructurada por MCP no exige un archivo JSON y queda fuera de T1/T2.

## Límites

Los tokens y recetas de [Material v2](../../docs/MATERIAL.md) conservan su autoridad. Los degradados y demás variables sin utilidad siguen en `:root`. `--color-*: initial` reinicia solo la paleta Tailwind, no todas las escalas.

`--space-*` conserva sus valores en px. Los 15 alias `--spacing-N` apuntan al paso `--space-N`; la base `--spacing` apunta a `--space-1`. El bloque `inline static` emite todas las variables y hace que utilidades como `p-4` usen directamente `var(--space-4)`, respetando overrides locales. No se aplica `inline` a colores ni a las familias existentes.

Con raíz de 16 o 20px, `p-4` vale 16px salvo override local. Esto cambia la escala Tailwind anterior basada en `0.25rem`: con raíz de 20px, antes valía 20px. Pasos no enumerados y decimales derivan de `--space-1`: `p-9` = 36px y `p-0.5` = 2px, sin inventar `--space-9`. Las recetas mantienen tamaños px e interlineados unitarios; el zoom del navegador no equivale a cambiar el tamaño raíz.

Las dimensiones semánticas siguen pendientes de T3. No se portan estilos de componentes ni CSS legacy por publicar este contrato.
