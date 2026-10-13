# Arquitectura

Cómo se organiza el código de EGDEV Foundation: paquetes, niveles, Radix como base y estilos.

El diseño se sigue decidiendo en Claude Design (artefacto *EGDEV Foundation*). Este repo lo convierte en componentes React con Storybook; una ficha o una clase CSS no equivale a una implementación disponible.

## Ruta de trabajo y alcance

1. Inspeccionar implementación y catálogo provisional; justificar reutilizar → variante → componer → extraer → nuevo en [CATALOGACION.md](CATALOGACION.md).
2. Acordar anatomía, API, estados, accesibilidad, Material y base Radix; aprobar el plan por responsabilidades antes de implementar.
3. Comprobar la unidad aprobada y entregar evidencia y pendientes según el [contrato compartido](../skills/_shared/component-contract.md).

M2 establece normas; no migra ni recataloga los tres componentes existentes (Surface, IconButton y Tabs). Esa adaptación corresponde a M3, fuera del tramo autorizado. Las versiones objetivo y el estado de verificación del stack se registran en el [plan ODD](odd/stack-alignment.md): el contrato no demuestra ejecución con Vite 8 ni consumo React 18/19.

## Paquetes

| Paquete | Qué contiene | Depende de |
|---|---|---|
| `@egdev/tokens` | `src/theme.css` (fuente CSS manual); `tokens.css` (artefacto nativo compilado) y `theme.css` (fuente para Tailwind v4) | — |
| `@egdev/ui` | Primitivas, átomos, moléculas, organismos y plantillas genéricos | Paquetes individuales `@radix-ui/react-*`, CVA, `@egdev/tokens` |
| `@egdev/effects` | Capas de efecto de la web (AmbientBackground, Isotipo3D) | canvas, three.js, `@egdev/tokens` |

Lo que solo tiene sentido en un producto **no entra en el sistema**: se queda en el repo de esa app, en `src/patterns/`, y se construye con `@egdev/ui`:

- **Web (egdev.es):** secciones de la home (Hero, LiveBand, NotesBoard…), tarjetas de contenido (NowCard, TipCard, ArticleItem…), TopBar, Footer, SectionShell y HomeTemplate.
- **Mando:** el panel del agente (AgentPanel, ChatMessage, Composer, ToolCallChip, ConfirmCard) y el preset PermissionLevel. Mando será la capa de módulos de **Gentle Dots** (Gentleman Programming), que lleva la orquestación y su propio panel de agente; está por ver qué patrones se usan allí y cuáles quedan para las interfaces de los módulos (ModuleCard, ToolCallChip, ConfirmCard).
- **Cadencia:** PostCard, montado sobre ListItem.

**Regla de subida:** un patrón de producto pasa a `@egdev/ui` cuando lo necesita una segunda app. Se generaliza al subir: nombre neutro, sin datos ni textos del dominio.

## Niveles

| Nivel | Contrato | Puede usar | No debe |
|---|---|---|---|
| **Primitiva** | Base reutilizable de estructura, semántica o tratamiento Material (Surface) | Tokens, utilidades, primitivas de Radix | Tener concepto de producto ni coordinar controles |
| **Átomo** | Un solo concepto de interfaz (botón, casilla, badge) | Primitivas de apoyo, Radix, variantes y estado local | Coordinar conceptos independientes o flujos |
| **Molécula** | Conceptos coordinados como una unidad (campo de formulario, menú, pestañas) | Átomos, primitivas, hooks de interacción | Ser una sección completa ni llevar lógica de dominio |
| **Organismo** | Región con responsabilidad estructural (barra lateral, diálogo, tabla, calendario) | Moléculas, átomos, primitivas | Ser una página ni esconder piezas que deberían extraerse |
| **Plantilla** | Disposición de una vista sin contenido real (AppShell) | Organismos | Llevar datos |

El nivel depende de responsabilidad, coordinación y composición, no del tamaño visual, número de piezas Radix o presencia de CSS. EGDEV tiene soporte real para primitivas (`packages/ui/src/primitives/surface/`); no hereda restricciones de carpetas de otros sistemas. Las reglas completas están en [CATALOGACION.md](CATALOGACION.md).

## Radix como base

Cuando existe la primitiva, el comportamiento interactivo sale de Radix mediante paquetes individuales: `import * as TabsPrimitive from '@radix-ui/react-tabs'`. Nosotros ponemos el aspecto; Radix pone teclado, foco, roles ARIA y portales. Los controles nativos conservan su semántica; no se les inventa interacción adicional.

- **Qué da Radix:** navegación con flechas, Escape, atrapar el foco en diálogos, `aria-*`, `data-state`, portales y posicionamiento de lo flotante.
- **Qué no se reimplementa nunca:** nada de lo anterior. Si un componente necesita teclado o foco y Radix tiene la primitiva, se usa.
- **Cuando falta la pieza o su paquete:** se documenta el bloqueo y se pide confirmación antes de añadir dependencias. Si Radix no cubre el comportamiento, se justifica una alternativa sin inventar teclado, foco o ARIA. `cmdk` y `@dnd-kit` siguen siendo candidatas, no dependencias aprobadas.

El mapa previsto está en [CATALOGO.md](CATALOGO.md); es provisional y conserva referencias al paquete unificado. Los [patrones heredados](../skills/component-contributor/references/radix-patterns.md) tampoco cambian la norma de imports individuales del [contrato](../skills/_shared/component-contract.md#radix). No se regenera el catálogo para publicar estas normas.

## Estilos: CSS por componente con clases BEM

La hoja de EGDEV Foundation ya existe: clases `eg-*` en BEM, construidas con los tokens, y es la misma que usan los lienzos de Claude Design. Para no tener dos fuentes de verdad visual:

1. **Cada componente tiene su `.css`** con sus clases `eg-*`, construido solo con variables de `@egdev/tokens`.
2. **Las variantes se declaran con CVA en `types.ts`** y producen clases BEM (`tone: 'glass'` → `eg-surface--glass`). CVA sigue siendo la API tipada de variantes, como en Stack & Flow.
3. **Los estados de Radix se estilan por atributo**: `[data-state="open"]`, `[aria-selected="true"]`, `[data-disabled]`. Nunca con clases de estado puestas a mano.
4. **Tailwind se usa para el layout de las apps**, no dentro de los componentes. `@egdev/tokens/theme.css` da las utilidades con los mismos tokens (`bg-bg-surface`, `rounded-xl`, `font-display`).
5. **Material:** las superficies, bordes, sombras y estados de pulsado salen de los tokens y recetas de [MATERIAL.md](MATERIAL.md), que conserva su autoridad y procedencia visual. Una caja con materia reutiliza `<Surface>`; los controles usan su receta. Nada de colores, espaciados, fuentes, sombras o degradados improvisados. Si falta un token, se propone y se espera confirmación antes de modificar `packages/tokens/src/theme.css`.
6. **Migración:** `packages/ui/src/styles/legacy/bundle.css` es la hoja completa de Claude Design. Al portar un componente, sus reglas se mueven de ahí a su `.css`. Cuando quede vacía, se borra.
7. **Clase pública, nunca estilos por `id`:** raíz estable `eg-<nombre>`, con la excepción heredada **IconButton = `eg-icon-btn`**, no `eg-icon-button`. Ids internos solo para accesibilidad, con `useId()`. Variantes BEM; estados por atributos Radix/ARIA, sin copias en clases. Estados propios en `data-state`, sin sustituir semántica nativa como `aria-pressed`.
8. **Capas de cascada:** todo el CSS de `@egdev/ui` va en `@layer components`, en el mismo orden de capas que Tailwind v4 (`theme, base, components, utilities`). Una utilidad de Tailwind puesta por `className` siempre gana a la clase del componente, sin `!important`; se usa solo para colocar el componente (margen, ancho, grid), nunca para cambiar su aspecto.

La norma completa, con ejemplos de lo que se permite y lo que no, está en el contrato de componente: [skills/_shared/component-contract.md](../skills/_shared/component-contract.md#clases-ids-y-capas-egdev).

> De Stack & Flow se toma el rigor de separación de responsabilidades y revisión, no sus seis archivos, Tailwind de apariencia, idioma de stories ni gates de GitHub. Las decisiones propias de EGDEV no se cambian al adaptar una referencia.

### Fuente y distribución de tokens

`packages/tokens/src/theme.css` es la única fuente de valores: `@theme static` conserva las variables de utilidades y `:root` las variables sin utilidad. Vite y el plugin oficial de Tailwind compilan la entrada `src/native.css` a `dist/tokens.css`, sin generar valores desde JSON. La optimización de Tailwind está desactivada en esa salida para preservar exactamente colores alfa y alias.

Desde `@egdev/tokens` 0.3.0 se retira el export `tokens.json`. Los imports CSS públicos no cambian; el consumo nativo requiere el paquete construido, no interpretar `@theme` en el navegador. Las recetas tipográficas aún no publicadas se conservan como [referencia para T2](tokens-reference.md); no son una segunda fuente de tokens. Una futura consulta MCP queda fuera de T1.

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

Patrón objetivo de siete archivos, con CSS propio. No se crean archivos vacíos ni se mueve código por declarar el patrón; las excepciones se justifican en el plan aprobado:

```
packages/ui/src/{primitives|atoms|molecules|organisms|templates}/{kebab-name}/
  ComponentName.tsx          JSX; consume el hook
  useComponentName.ts        lógica, estado, aria y la llamada a CVA
  types.ts                   props públicas, variantes CVA y JSDoc/defaults
  component-name.css         clases eg-* del componente
  ComponentName.test.tsx     tests del hook y del componente
  ComponentName.stories.tsx  documentación en Storybook
  index.ts                   exportaciones públicas
```

Referencias existentes: `primitives/surface`, `atoms/icon-button` y `molecules/tabs`; su existencia no acredita adaptación completa. Consulta el [contrato](../skills/_shared/component-contract.md#typescript) para herencia nativa y refs: el peer React `>=18.0.0` no es una prueba de compatibilidad ni permite prometer ref forwarding que no se haya comprobado.

Storybook 10 documenta la API con autodocs y docgen TypeScript sobre componentes reales. No se sustituyen fallos de extracción por `argTypes` manuales; `@control select` no garantiza un select visible. Defaults, required, enums y composición se verifican contra hooks/CVA; las stories solo aportan args requeridos y ejemplos. La [guía de stories](../skills/component-contributor/references/stories.md) fija formato e imports; los tests de interacción van en `.test.tsx`, nunca en `play`.

## Idioma

Código, nombres de componentes y props, tests e identificadores de stories en inglés. Documentación en español: `docs/`, READMEs, JSDoc de props y textos nuevos de stories. No se traducen stories heredadas silenciosamente fuera del alcance aprobado.
