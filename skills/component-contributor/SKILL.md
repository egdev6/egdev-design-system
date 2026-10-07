---
name: component-contributor
description: "Implementa o porta un componente de EGDEV Foundation (Claude Design) a @egdev/ui sobre Radix. Trigger: implementar componente, portar componente, crear componente del catálogo."
license: MIT
metadata:
  author: egdev
  version: "0.1"
  basedOn: "stack-and-flow/component-contributor"
---

## Cuándo usarla

Para implementar un componente que ya tiene decisión de catalogación (fila en `docs/CATALOGO.md` o salida de `component-cataloging`). Si el componente no está en el catálogo o hay dudas de nivel, primero `skills/component-cataloging/SKILL.md`.

## Lecturas obligatorias, en este orden

1. `skills/_shared/component-contract.md`
2. `docs/CATALOGO.md` — fila del componente: nivel, destino, base Radix, qué compone.
3. La ficha del componente en EGDEV Foundation (`components/<Nombre>/README.md` y `preview.html` del artefacto de Claude Design), si existe: es la fuente del aspecto, las variantes y la accesibilidad.
4. Sus reglas en `packages/ui/src/styles/legacy/bundle.css` (busca `.eg-<bloque>`).
5. `skills/component-contributor/references/radix-patterns.md` si usa Radix.
6. `references/stories.md` y `references/testing.md`.
7. Un componente de referencia del mismo nivel: `primitives/surface`, `atoms/icon-button` o `molecules/tabs`.

## Pasos

1. **Comprueba dependencias.** Todo lo que aparece en «Compone» del catálogo tiene que existir. Si falta, se implementa antes (de abajo arriba) o se para y se avisa.
2. **Crea la carpeta** `packages/ui/src/<nivel>/<kebab-name>/` con los 7 archivos del contrato.
3. **`types.ts`:** traduce cada modificador BEM de la ficha a una variante CVA. Un modificador que en realidad cambia la semántica no es variante: avisa y propón separarlo.
4. **Mueve el CSS:** corta las reglas del bloque de `legacy/bundle.css` y pégalas en `<kebab-name>.css`. Cambia los selectores de estado `.is-*` por los atributos de Radix/ARIA (deja también `.is-*` solo si los lienzos de Claude Design lo siguen necesitando). Importa el archivo en `styles/index.css`.
5. **`useComponentName.ts`:** defaults, CVA, aria y handlers.
6. **`ComponentName.tsx`:** solo JSX sobre la primitiva de Radix.
7. **Tests y stories** según las referencias. Las stories enseñan las variantes que existían en la ficha.
8. **Exporta** en `index.ts` y en `packages/ui/src/index.ts`.
9. **Actualiza el catálogo:** en `scripts/catalog_data.py` si cambia algo de lo previsto, y `python scripts/build_catalog.py`.
10. **Verifica:** `pnpm typecheck`, `pnpm test`, `pnpm lint`, y abre la story en `pnpm storybook`.

## Reglas

- No añadir dependencias ni tocar `tokens.json` sin confirmación.
- Si la ficha de EGDEV Foundation y el catálogo se contradicen, para y pregunta.
- Textos de ejemplo realistas y en español, sin datos ni nombres de personas reales.
