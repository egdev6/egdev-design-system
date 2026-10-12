# Contrato de componente — egdev-design-system

Referencia normativa para implementar, auditar o revisar un componente. Adaptada de Stack & Flow; **(egdev)** identifica decisiones propias, no una adopción de sus estilos o gates de GitHub.

## Antes de implementar

1. Inspecciona el catálogo **y la implementación React pública**; decide reutilizar → variante → componer → extraer → nuevo según [CATALOGACION.md](../../docs/CATALOGACION.md).
2. Documenta anatomía, props, defaults, estados, accesibilidad, base Radix y evidencia de la decisión. Si faltan datos o hay contradicciones, para y pregunta.
3. Presenta el plan por responsabilidades y espera aprobación. Si falta un token o paquete individual de Radix, propón el cambio y espera confirmación antes de modificar tokens o dependencias.
4. Implementa la unidad aprobada, comprueba comportamiento y documentación, y entrega evidencia y pendientes; no declares adaptado lo que solo está previsto.

**Alcance actual:** Surface, IconButton y Tabs existen como referencias, pero no prueban cumplimiento completo. M2 fija estas normas; la adaptación y recatalogación de componentes corresponden a M3, todavía no ejecutada. No se crean archivos ni se migra código por publicar este contrato.

## Archivos

El patrón objetivo de cada carpeta `packages/ui/src/{primitives|atoms|molecules|organisms|templates}/{kebab-name}/` es de **siete archivos**, con estas responsabilidades:

1. `types.ts` — variantes CVA, tipos públicos y anotaciones para Storybook.
2. `useComponentName.ts` — lógica, estado, refs, handlers, derivación de aria y la llamada a `componentVariants(...)`.
3. `ComponentName.tsx` — solo JSX; consume el hook. Sin estado, sin CVA, sin lógica.
4. `component-name.css` — **(egdev)** apariencia propia con clases `eg-*` y tokens, dentro de `@layer components` al importarse en `packages/ui/src/styles/index.css`.
5. `ComponentName.test.tsx` — tests del hook y del componente.
6. `ComponentName.stories.tsx` — documentación en Storybook.
7. `index.ts` — exportación con nombre y tipos.

No crees archivos vacíos para cumplir un número. Una excepción por reutilización o una separación adicional requiere justificación y aprobación en el plan; no convierte el patrón de EGDEV en los seis archivos de Stack & Flow.

## TypeScript

- `type`, nunca `interface`. `import type` / `export type` para tipos.
- Exportaciones con nombre; nada de `export default` en componentes.
- Tipos reutilizables entre componentes en `packages/ui/src/types`; los propios, en su `types.ts`.
- Las props propias públicas se declaran en `types.ts` con JSDoc en español, obligatoriedad y valores admitidos. No dupliques manualmente las props nativas heredadas.
- Cada default público lleva `@default` coherente con `defaultVariants`, destructuring del hook y fallbacks reales. Si depende de otras props (p. ej., el primer item de Tabs), explica la regla, no inventes un valor fijo.
- Los hooks devuelven objetos tipados. Nunca `any`.
- `T[]`, no `Array<T>`. Sin `!`, `@ts-ignore` ni `@ts-expect-error` sin motivo escrito.
- Hereda props nativas y resuelve conflictos con `Omit`; usa `ComponentPropsWithoutRef<'elemento'>` si la API no expone refs. Heredar `ComponentProps` no prueba que una ref llegue al DOM.
- Props públicas explícitas en el genérico del componente (`FC<IconButtonProps>`, por ejemplo). No prometas refs universales ni impongas `forwardRef` sin comprobar el contrato de cada componente.
- El peer declara React `>=18.0.0` y el desarrollo usa React 19: una API de refs exclusiva de React 19 no acredita consumo con React 18. La evidencia de compatibilidad vive en el [plan ODD](../../docs/odd/stack-alignment.md), no se deduce de los tipos.
- `cn()` desde `@/lib/cn`.
- `...rest` al elemento nativo o raíz compatible para que pasen `data-*`, `aria-*` y atributos de formulario sin pisar la semántica. Documenta restricciones reales de composición, como `asChild`.

## Estilos **(egdev)**

- Variantes en CVA dentro de `types.ts`, y cada valor produce clases BEM: bloque `eg-<nombre>`, elemento `eg-<nombre>__<parte>`, modificador `eg-<nombre>--<variante>`.
- Colores, espaciados y fuentes salen de variables de `@egdev/tokens`; no de valores en duro ni estilos inline de apariencia. Si falta un token, propón incorporarlo a `tokens.json` y espera confirmación.
- No escribas sombras, degradados ni mezclas de color a mano. Usa los tokens y recetas de [MATERIAL.md](../../docs/MATERIAL.md); un tratamiento nuevo requiere propuesta y confirmación, aunque todavía no se repita.
- **Material v2:** una caja con materia reutiliza `<Surface>`; los controles aplican la receta correspondiente, no una superficie plana improvisada. Superficie elevada, pozo, overlay y pulsado conservan su tratamiento y alternativas de transparencia/movimiento según Material. `ghost` y `flat` son variantes existentes, no permiso para eludir esas recetas.
- Estados por atributo de Radix o ARIA: `[data-state="open"]`, `[data-state="checked"]`, `[data-disabled]`, `[aria-selected="true"]`, `[aria-pressed="true"]`. Las clases `.is-*` del legado solo se mantienen para los lienzos de Claude Design.
- Deshabilitado: opacidad `.45`, `pointer-events: none` y cursor; no se cambia a gris.
- Foco: `:focus-visible` con `box-shadow: var(--shadow-focus)` u `outline` con `--color-focus-ring`. Nunca solo un brillo decorativo.
- `prefers-reduced-motion`: sin transformaciones ni animaciones.
- Nada de Tailwind dentro de los componentes; Tailwind es para el layout de las apps.

### Clases, ids y capas **(egdev)**

La norma para que el CSS de los componentes y Tailwind convivan sin pelearse:

1. **Cada componente tiene una clase raíz propia y estable**, `eg-<nombre>`, y sus partes `eg-<nombre>__<parte>`. La raíz conserva la clase aunque no haya variantes. Son **API pública** para apps sin React, terceros y lienzos de Claude Design; renombrarla o quitarla es incompatible. **Excepción heredada explícita:** IconButton usa `eg-icon-btn`, nunca se renombra a `eg-icon-button` para normalizar la convención.
2. **Nunca se estila por `id`.** Los ids internos solo relacionan elementos para accesibilidad (`aria-controls`, `aria-labelledby`, `htmlFor`); se generan con `useId()`, no con literales compartidos entre instancias.
3. **Variantes = modificadores BEM** de CVA. **Estados = atributos** de Radix (`[data-state]`, `[data-disabled]`) o semánticos (`[aria-pressed]`, `[aria-current]`, `[aria-invalid]`). No copies esos estados a clases. Los estados propios van en `data-state`, documentados en `types.ts`, sin sustituir ARIA nativo: IconButton `pressed` conserva `aria-pressed`. Las `.is-*` heredadas se preservan solo para los lienzos; retirarlas requiere una migración aprobada.
4. **Especificidad baja y plana:** una clase, o una clase más un atributo o pseudoclase (`.eg-toolcall[data-state="running"]`, `.eg-btn:focus-visible`). Sin anidar bloques, sin selectores de etiqueta salvo el `svg` o el `img` interno de un bloque, sin `!important`.
5. **Todo el CSS de `@egdev/ui` vive en `@layer components`.** `styles/index.css` declara el orden `theme, base, components, utilities` (el mismo de Tailwind v4) e importa cada hoja con `layer(components)`. Así una utilidad de Tailwind siempre gana a la clase del componente sin `!important`, y el CSS sin capa de la app también.
6. **Tailwind en un componente, solo desde fuera y solo para colocarlo:** por `className` en el elemento raíz (`cn()` lo une a las clases del componente) para márgenes, ancho, posición en un grid o flex y visibilidad por breakpoint. Si hace falta cambiar el aspecto (color, borde, radio, sombra), no es una utilidad: es una variante nueva (ver `docs/CATALOGACION.md`).
7. **Selectores para tests y temas:** se usan roles y nombres accesibles (Testing Library); para temas o depuración, la clase raíz. Nada de `data-testid` en el sistema.

## Radix

- Paquetes individuales con alias de namespace: `import * as TabsPrimitive from '@radix-ui/react-tabs'`. No se usa el paquete unificado `radix-ui`. Si falta un paquete, para y pide confirmación antes de añadirlo.
- Usa la primitiva disponible; no reimplementes su teclado, foco, ARIA o interacción. M1 preserva API y legado; publicar normas en M2 no acredita adaptación completa de componentes.
- `Portal` para todo lo flotante.
- `asChild` en los `Trigger` cuando se compone con componentes del sistema.
- Animaciones con `[data-state]`.
- La lógica de abrir/cerrar, filtrar o calcular, en el hook.
- Patrones: [radix-patterns.md](../component-contributor/references/radix-patterns.md). Sus ejemplos heredados del paquete unificado no autorizan imports contrarios a este contrato.

## Storybook y tests

- [Stories](../component-contributor/references/stories.md): Storybook 10, `autodocs`, tipos `Meta`/`StoryObj` de `@storybook/react-vite` y eventos con `action` de `storybook/actions`. Meta tipada con el componente real (`Meta<typeof IconButton>` o `satisfies Meta<typeof IconButton>`).
- Controles generados por la integración Vite y `react-docgen-typescript` configurada en `.storybook/main.ts`: comprueba required, props nativas, enums, defaults y `asChild` sobre el componente real. No escribas `argTypes` manuales para tapar fallos de extracción.
- `@control` expresa intención documental, no garantiza el widget. Un enum de dos valores puede verse como radios aunque documente `@control select`; verifica valores y comportamiento, no supongas un combobox.
- Args solo para props requeridas y ejemplos; `Default` no sobrescribe defaults documentados. JSDoc sobre meta y stories según la guía; títulos `Primitives/…`, `Atoms/…`, `Molecules/…`, `Organisms/…`, `Templates/…`.
- Código, tests e identificadores en inglés; documentación y textos nuevos de stories en español. Traducir stories heredadas requiere alcance explícito, no una corrección silenciosa.
- [Tests](../component-contributor/references/testing.md): hook con `renderHook`; componente con `render`, `screen` y `userEvent`. Cubre defaults, ARIA, teclado, interacción y deshabilitado cuando apliquen. Sin `play`; no se testean cadenas de clases ni se importan dependencias de ejemplos que el componente no usa.

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
