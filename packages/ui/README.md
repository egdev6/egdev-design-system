# @egdev/ui

Componentes de EGDEV Foundation sobre Radix UI.

```tsx
import { IconButton, Surface, Tabs } from '@egdev/ui';
import '@egdev/tokens/tokens.css';
import '@egdev/ui/styles.css';
```

Estructura: `src/{primitives,atoms,molecules,organisms,templates}/<kebab-name>/`. Contrato en `skills/_shared/component-contract.md`; qué falta por portar en `docs/CATALOGO.md`.

`src/styles/legacy/bundle.css` es la hoja completa de Claude Design mientras se porta todo: los componentes aún no portados ya se pueden usar con sus clases `eg-*`.
