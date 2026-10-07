# Contrato de componente — egdev-design-system

Referencia única para implementar, auditar o revisar un componente. Adaptado del contrato de Stack & Flow; las diferencias están marcadas con **(egdev)**.

## Archivos

Cada carpeta `packages/ui/src/{primitives|atoms|molecules|organisms|templates}/{kebab-name}/` contiene exactamente:

1. `types.ts` — variantes CVA, tipos públicos y anotaciones para Storybook.
2. `useComponentName.ts` — lógica, estado, refs, handlers, derivación de aria y la llamada a `componentVariants(...)`.
3. `ComponentName.tsx` — solo JSX; consume el hook. Sin estado, sin CVA, sin lógica.
4. `component-name.css` — **(egdev)** clases `eg-*` del componente, solo con variables de tokens. Se importa en `packages/ui/src/styles/index.css`.
5. `ComponentName.test.tsx` — tests del hook y del componente.
6. `ComponentName.stories.tsx` — documentación en Storybook.
7. `index.ts` — exportación con nombre y tipos.

Un componente sin CSS propio (solo reutiliza clases de otro) no lleva `.css`.

## TypeScript

- `type`, nunca `interface`. `import type` / `export type` para tipos.
- Exportaciones con nombre; nada de `export default` en componentes.
- Tipos reutilizables entre componentes en `packages/ui/src/types`; los propios, en su `types.ts`.
- Toda prop pública lleva JSDoc en español; las que tienen valor por defecto, `@default` con el mismo valor que el hook o `defaultVariants`.
- Los hooks devuelven objetos tipados. Nunca `any`.
- `T[]`, no `Array<T>`. Sin `!`, `@ts-ignore` ni `@ts-expect-error` sin motivo escrito.
- Props nativas con `ComponentProps<'elemento'>`; conflictos con `Omit`.
- `cn()` desde `@/lib/cn`.
- `...rest` al elemento raíz para que pasen `data-*`, `aria-*` y atributos de formulario.

## Estilos **(egdev)**

- Variantes en CVA dentro de `types.ts`, y cada valor produce clases BEM: bloque `eg-<nombre>`, elemento `eg-<nombre>__<parte>`, modificador `eg-<nombre>--<variante>`.
- En el `.css`, solo variables de `@egdev/tokens` (`var(--color-…)`, `var(--space-…)`, `var(--radius-…)`). Nada de hex, rgb ni px de color sueltos. Medidas de layout propias del componente (alto de control, tamaño de icono) sí, documentadas.
- Mezclas (`color-mix`), sombras de varias capas y degradados: si se repiten, se proponen como token.
- **Material (Material v2):** toda superficie usa `--color-surface-*`, `--gradient-sheen`, `--color-border-hairline` y `--shadow-edge` + `--shadow-elev-*`; lo que se rellena, `--shadow-well`; lo que flota, `--color-surface-overlay` con `--blur-overlay` y alternativa en `prefers-reduced-transparency`; lo que se pulsa, `:active` con `translateY(1px) scale(.97)` en `--duration-press`. Ver `docs/MATERIAL.md`.
- Estados por atributo de Radix o ARIA: `[data-state="open"]`, `[data-state="checked"]`, `[data-disabled]`, `[aria-selected="true"]`, `[aria-pressed="true"]`. Las clases `.is-*` del legado solo se mantienen para los lienzos de Claude Design.
- Deshabilitado: opacidad `.45`, `pointer-events: none` y cursor; no se cambia a gris.
- Foco: `:focus-visible` con `box-shadow: var(--shadow-focus)` u `outline` con `--color-focus-ring`. Nunca solo un brillo decorativo.
- `prefers-reduced-motion`: sin transformaciones ni animaciones.
- Nada de Tailwind dentro de los componentes; Tailwind es para el layout de las apps.

### Clases, ids y capas **(egdev)**

La norma para que el CSS de los componentes y Tailwind convivan sin pelearse:

1. **Cada componente tiene una clase raíz propia y estable**, `eg-<nombre>`, y sus partes `eg-<nombre>__<parte>`. La clase raíz siempre está en el elemento raíz, aunque no haya variantes. Esas clases son **API pública**: las usan las apps sin React, los módulos de terceros y los lienzos de Claude Design. Renombrar o quitar una es un cambio incompatible (versión mayor).
2. **Nunca se estila por `id`.** Un componente se repite en la página y un `id` tiene más especificidad de la cuenta (ninguna utilidad podría ajustarlo). Los `id` solo existen para accesibilidad y anclas (`aria-controls`, `aria-labelledby`, `htmlFor`, `#seccion`) y se generan con `useId()`, nunca escritos a mano.
3. **Variantes = modificadores BEM** que produce CVA (`eg-btn--primary`). **Estados = atributos**: los de Radix (`[data-state]`, `[data-disabled]`) y ARIA (`[aria-pressed]`, `[aria-current]`, `[aria-invalid]`). Si un componente tiene estados propios que Radix no da (una llamada `running`, un módulo `stopped`), van en `data-state` (o un `data-*` con nombre claro) y se documentan en `types.ts`. Las clases `.is-*` solo se mantienen en `legacy/bundle.css` para los lienzos de Claude Design.
4. **Especificidad baja y plana:** una clase, o una clase más un atributo o pseudoclase (`.eg-toolcall[data-state="running"]`, `.eg-btn:focus-visible`). Sin anidar bloques, sin selectores de etiqueta salvo el `svg` o el `img` interno de un bloque, sin `!important`.
5. **Todo el CSS de `@egdev/ui` vive en `@layer components`.** `styles/index.css` declara el orden `theme, base, components, utilities` (el mismo de Tailwind v4) e importa cada hoja con `layer(components)`. Así una utilidad de Tailwind siempre gana a la clase del componente sin `!important`, y el CSS sin capa de la app también.
6. **Tailwind en un componente, solo desde fuera y solo para colocarlo:** por `className` en el elemento raíz (`cn()` lo une a las clases del componente) para márgenes, ancho, posición en un grid o flex y visibilidad por breakpoint. Si hace falta cambiar el aspecto (color, borde, radio, sombra), no es una utilidad: es una variante nueva (ver `docs/CATALOGACION.md`).
7. **Selectores para tests y temas:** se usan roles y nombres accesibles (Testing Library); para temas o depuración, la clase raíz. Nada de `data-testid` en el sistema.

## Radix

- Paquete unificado: `import { Dialog as DialogPrimitive } from 'radix-ui'`. **(egdev)** En Stack & Flow se importa cada `@radix-ui/react-*`; aquí uno solo para alinear versiones.
- `Portal` para todo lo flotante.
- `asChild` en los `Trigger` cuando se compone con componentes del sistema.
- Animaciones con `[data-state]`.
- La lógica de abrir/cerrar, filtrar o calcular, en el hook.
- Patrones: `skills/component-contributor/references/radix-patterns.md`.

## Storybook y tests

- Stories: `skills/component-contributor/references/stories.md`. Títulos `Primitives/…`, `Atoms/…`, `Molecules/…`, `Organisms/…`, `Templates/…`.
- Tests: `skills/component-contributor/references/testing.md`. Hook con `renderHook`, componente con `render` + `screen` + `userEvent`. Sin `play` en stories. No se testean cadenas de clases.

## Accesibilidad

- Nombre accesible en todo control (los de solo icono, obligatorio por prop).
- Teclado completo: lo da Radix; si no hay Radix, se documenta y se testea.
- Tamaños de control: 32/40/48 px; táctil mínimo 44 px en móvil.
- El color nunca va solo: estado con icono o texto.

## `index.ts`

```ts
export { ComponentName } from './ComponentName';
export type * from './types';
export { componentNameVariants } from './types'; // si se expone para composición
```

Y se añade a `packages/ui/src/index.ts` en la sección de su nivel.
