# Arquitectura

Cómo se organiza el código de EGDEV Foundation: paquetes, niveles, Radix como base y estilos.

El diseño se sigue decidiendo en Claude Design (artefacto *EGDEV Foundation*). Este repo es donde se convierte en componentes React con Storybook.

## Paquetes

| Paquete | Qué contiene | Depende de |
|---|---|---|
| `@egdev/tokens` | `tokens.json` (fuente), `tokens.css` y `theme.css` (generados: variables CSS y tema de Tailwind v4) | — |
| `@egdev/ui` | Primitivas, átomos, moléculas, organismos y plantillas genéricos | `radix-ui`, CVA, `@egdev/tokens` |
| `@egdev/effects` | Capas de efecto de la web (AmbientBackground, Isotipo3D) | canvas, three.js, `@egdev/tokens` |

Lo que solo tiene sentido en un producto **no entra en el sistema**: se queda en el repo de esa app, en `src/patterns/`, y se construye con `@egdev/ui`:

- **Web (egdev.es):** secciones de la home (Hero, LiveBand, NotesBoard…), tarjetas de contenido (NowCard, TipCard, ArticleItem…), TopBar, Footer, SectionShell y HomeTemplate.
- **Mando:** el panel del agente (AgentPanel, ChatMessage, Composer, ToolCallChip, ConfirmCard) y el preset PermissionLevel. Mando será la capa de módulos de **Gentle Dots** (Gentleman Programming), que lleva la orquestación y su propio panel de agente; está por ver qué patrones se usan allí y cuáles quedan para las interfaces de los módulos (ModuleCard, ToolCallChip, ConfirmCard).
- **Cadencia:** PostCard, montado sobre ListItem.

**Regla de subida:** un patrón de producto pasa a `@egdev/ui` cuando lo necesita una segunda app. Se generaliza al subir: nombre neutro, sin datos ni textos del dominio.

## Niveles

| Nivel | Contrato | Puede usar | No debe |
|---|---|---|---|
| **Primitiva** | Unidad base sin concepto visual propio: caja, texto, apilado, slot, separador, proporción | Tokens, primitivas de Radix | Tener concepto de producto ni coordinar controles |
| **Átomo** | Un solo concepto de interfaz (botón, casilla, badge) | Primitivas (máx. dos de apoyo), una primitiva de Radix, estado local | Coordinar varios conceptos, listas o layout complejo |
| **Molécula** | Unos pocos átomos que funcionan como una unidad (campo de formulario, menú, pestañas) | Átomos, primitivas, hooks de interacción | Ser una sección completa ni llevar lógica de dominio |
| **Organismo** | Región con responsabilidad estructural (barra lateral, diálogo, tabla, calendario) | Moléculas, átomos, primitivas | Ser una página ni esconder piezas que deberían extraerse |
| **Plantilla** | Disposición de una vista sin contenido real (AppShell) | Organismos | Llevar datos |

Las reglas completas para decidir el nivel, cuándo separar y qué impide que algo sea un átomo están en [CATALOGACION.md](CATALOGACION.md).

## Radix como base

Todo comportamiento interactivo sale de Radix (paquete unificado `radix-ui`). Nosotros ponemos el aspecto; Radix pone teclado, foco, roles ARIA y portales.

- **Qué da Radix:** navegación con flechas, Escape, atrapar el foco en diálogos, `aria-*`, `data-state`, portales y posicionamiento de lo flotante.
- **Qué no se reimplementa nunca:** nada de lo anterior. Si un componente necesita teclado o foco y Radix tiene la primitiva, se usa.
- **Cuando Radix no tiene la pieza** (combobox, carrusel, calendario, arrastrar y soltar): se documenta en la ficha y se elige librería con confirmación (candidatas: `cmdk` para CommandPalette y `@dnd-kit` para CalendarGrid).

Cómo se mapea cada componente a su primitiva de Radix: [CATALOGO.md](CATALOGO.md). Patrones de código: [skills/component-contributor/references/radix-patterns.md](../skills/component-contributor/references/radix-patterns.md).

## Estilos: CSS por componente con clases BEM

La hoja de EGDEV Foundation ya existe: clases `eg-*` en BEM, construidas con los tokens, y es la misma que usan los lienzos de Claude Design. Para no tener dos fuentes de verdad visual:

1. **Cada componente tiene su `.css`** con sus clases `eg-*`, construido solo con variables de `@egdev/tokens`.
2. **Las variantes se declaran con CVA en `types.ts`** y producen clases BEM (`variant: 'glass'` → `eg-surface--glass`). CVA sigue siendo la API tipada de variantes, como en Stack & Flow.
3. **Los estados de Radix se estilan por atributo**: `[data-state="open"]`, `[aria-selected="true"]`, `[data-disabled]`. Nunca con clases de estado puestas a mano.
4. **Tailwind se usa para el layout de las apps**, no dentro de los componentes. `@egdev/tokens/theme.css` da las utilidades con los mismos tokens (`bg-bg-surface`, `rounded-xl`, `font-display`).
5. **Material:** las superficies, bordes, sombras y estados de pulsado salen de los tokens de Material v2 ([MATERIAL.md](MATERIAL.md)). Una caja con materia es `<Surface>`; nadie repite la receta a mano.
6. **Migración:** `packages/ui/src/styles/legacy/bundle.css` es la hoja completa de Claude Design. Al portar un componente, sus reglas se mueven de ahí a su `.css`. Cuando quede vacía, se borra.
7. **Clase propia, nunca `id`:** cada componente tiene su clase raíz estable `eg-<nombre>`; los `id` solo sirven para accesibilidad y anclas, generados con `useId()`. Variantes como modificadores BEM y estados como atributos (`data-state`, ARIA).
8. **Capas de cascada:** todo el CSS de `@egdev/ui` va en `@layer components`, en el mismo orden de capas que Tailwind v4 (`theme, base, components, utilities`). Una utilidad de Tailwind puesta por `className` siempre gana a la clase del componente, sin `!important`; se usa solo para colocar el componente (margen, ancho, grid), nunca para cambiar su aspecto.

La norma completa, con ejemplos de lo que se permite y lo que no, está en el contrato de componente: [skills/_shared/component-contract.md](../skills/_shared/component-contract.md#clases-ids-y-capas-egdev).

> Si prefieres el enfoque de Stack & Flow (clases de Tailwind dentro de CVA), se cambia en un sitio: el contrato de [skills/_shared/component-contract.md](../skills/_shared/component-contract.md). Lo que se pierde es compartir la hoja con los lienzos de Claude Design.

### Uso en una app

```css
/* Con Tailwind */
@import "tailwindcss";
@import "@egdev/tokens/theme.css";
@import "@egdev/ui/styles.css";
```

```css
/* Sin Tailwind */
@import "@egdev/tokens/tokens.css";
@import "@egdev/ui/styles.css";
```

## Anatomía de un componente

Se hereda de Stack & Flow, con un archivo más para el CSS:

```
packages/ui/src/{primitives|atoms|molecules|organisms|templates}/{kebab-name}/
  ComponentName.tsx          JSX; consume el hook
  useComponentName.ts        lógica, estado, aria y la llamada a CVA
  types.ts                   tipos públicos y variantes CVA (con @default y @control)
  component-name.css         clases eg-* del componente
  ComponentName.test.tsx     tests del hook y del componente
  ComponentName.stories.tsx  documentación en Storybook
  index.ts                   exportaciones públicas
```

Referencias ya hechas: `primitives/surface`, `atoms/icon-button` y `molecules/tabs`.

## Idioma

Código, nombres de componentes y props, y tests en inglés. Documentación en español: `docs/`, READMEs, JSDoc de props y textos de las stories, que es lo que se lee en Storybook.
