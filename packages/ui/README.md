# @egdev/ui

Componentes de EGDEV Foundation sobre Radix UI.

```tsx
import { IconButton, Surface, Tabs } from '@egdev/ui';
import '@egdev/tokens/tokens.css';
import '@egdev/ui/styles.css';
```

## CSS distribuido

`pnpm --filter @egdev/ui build` genera JavaScript y declaraciones, y después reúne las hojas existentes en `dist/styles.css`. El import público `@egdev/ui/styles.css` entrega CSS plano, con los imports internos resueltos y las clases BEM dentro de `@layer components`; no requiere Tailwind para consumirlo.

Los tokens siguen siendo un import explícito de la app, antes de los estilos de UI. No se duplican sus valores ni se generan utilidades desde stories o tests. Con Tailwind, la app puede importar `@egdev/tokens/theme.css`; `@egdev/ui/styles.css` mantiene el mismo contrato. Importar los componentes JavaScript no carga CSS automáticamente y sigue siendo compatible con SSR en Node.

## Estructura

Estructura: `src/{primitives,atoms,molecules,organisms,templates}/<kebab-name>/`. Contrato en `skills/_shared/component-contract.md`; qué falta por portar en `docs/CATALOGO.md`.

`src/styles/legacy/bundle.css` es la hoja completa de Claude Design mientras se porta todo: los componentes aún no portados ya se pueden usar con sus clases `eg-*`.
