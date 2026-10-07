# @egdev/tokens

Tokens de EGDEV Foundation.

| Archivo | Qué es |
|---|---|
| `src/tokens.json` | Fuente (exportado del artefacto de Claude Design) |
| `src/tokens.css` | Variables CSS en `:root`, para apps sin Tailwind y para los lienzos de Claude Design. Generado desde `tokens.json` con `scripts/build-tokens.mjs` |
| `src/theme.css` | Tema de Tailwind v4 generado desde `tokens.css` (`scripts/build-theme.mjs`) |

`pnpm build` (o `pnpm tokens` desde la raíz) regenera los dos: `tokens.json` → `tokens.css` → `theme.css`. Para actualizar los tokens, se exporta `tokens.json` del artefacto EGDEV Foundation y se ejecuta el build; nunca se editan a mano los CSS.

Los tokens de Material v2 (superficies, hairlines, sombras de elevación, pozos, degradados y curvas) se explican en [docs/MATERIAL.md](../../docs/MATERIAL.md). Los degradados (`--gradient-*`) se quedan en `:root`, fuera del `@theme` de Tailwind.

La escala de espaciado de Tailwind (4 px) coincide con `--space-*`, así que `p-4` = `var(--space-4)`.

