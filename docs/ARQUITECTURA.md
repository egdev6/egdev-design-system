# Arquitectura

Cómo se organiza el código de EGDEV Foundation: paquetes, niveles, Radix como base y estilos.

El diseño se sigue decidiendo en Claude Design (artefacto *EGDEV Foundation*). Este repo lo convierte en componentes React con Storybook; una ficha o una clase CSS no equivale a una implementación disponible.

## Ruta de trabajo y alcance

1. Inspeccionar implementación y catálogo provisional; justificar reutilizar → variante → componer → extraer → nuevo en [CATALOGACION.md](CATALOGACION.md).
2. Para crear o cambiar promesas, proponer y aprobar una versión recuperable de la [ficha individual](../skills/_shared/component-spec-template.md) mediante [component-spec-proposer](../skills/component-spec-proposer/SKILL.md). Reutilizar sin cambiar promesas no requiere una ficha nueva.
3. Con decisión y ficha aprobadas, proponer el plan por responsabilidades; aprobarlo antes de implementar. Tokens y dependencias pendientes requieren confirmación específica, no implícita en la ficha.
4. Comprobar la unidad aprobada y entregar evidencia y pendientes según el [contrato compartido](../skills/_shared/component-contract.md).

Gauge is the only implemented public React component in `@egdev/ui`; `cn` is a utility. Surface, IconButton and Tabs remain provisional/future Foundation concepts, not importable APIs or current implementation references. The accepted Gauge pilot follows the [immutable v0.8 base](specs/gauge.md) plus the [v0.9 composition amendment](components/gauge/v0.9/composition-amendment.md) and [v0.10 transparent-interior amendment](components/gauge/v0.10/transparent-interior-amendment.md); bounded execution follows the [v0.10 plan](components/gauge/v0.10/implementation-plan.md) and [separate approval](components/gauge/v0.10/approval.json). This does not certify all of M3, approve the provisional catalog or complete retirement validation. Stack verification and React 18/19 consumption limits remain in the [ODD plan](odd/stack-alignment.md).

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

Levels depend on responsibility, coordination and composition, not visual size, Radix-piece counts or CSS presence. The architecture permits primitives; Surface is a future primitive concept, not a current source directory to reuse. No folder restrictions from other systems are inherited. See [CATALOGACION.md](CATALOGACION.md) for the full rules; the taxonomy does not approve every provisional classification.

## Radix como base

Cuando existe la primitiva, el comportamiento interactivo sale de Radix mediante paquetes individuales: `import * as TabsPrimitive from '@radix-ui/react-tabs'`. Nosotros ponemos el aspecto; Radix pone teclado, foco, roles ARIA y portales. Los controles nativos conservan su semántica; no se les inventa interacción adicional.

- **Qué da Radix:** navegación con flechas, Escape, atrapar el foco en diálogos, `aria-*`, `data-state`, portales y posicionamiento de lo flotante.
- **Qué no se reimplementa nunca:** nada de lo anterior. Si un componente necesita teclado o foco y Radix tiene la primitiva, se usa.
- **Cuando falta la pieza o su paquete:** se documenta el bloqueo y se pide confirmación antes de añadir dependencias. Si Radix no cubre el comportamiento, se justifica una alternativa sin inventar teclado, foco o ARIA. `cmdk` y `@dnd-kit` siguen siendo candidatas, no dependencias aprobadas.

El mapa previsto está en [CATALOGO.md](CATALOGO.md); es provisional y conserva referencias al paquete unificado. Los [patrones heredados](../skills/component-contributor/references/radix-patterns.md) tampoco cambian la norma de imports individuales del [contrato](../skills/_shared/component-contract.md#radix). No se regenera el catálogo para publicar estas normas.

## Styles: token-backed Tailwind utilities

The current target uses Tailwind appearance utilities, CVA in `types.ts` and per-part `cn()` (`clsx` + `twMerge`); follow the [shared contract](../skills/_shared/component-contract.md#estilos-egdev) for tokens, merge limits and consumer permissions. Stable `eg-*` roots, including `eg-icon-btn`, remain public markers, not a mandatory BEM visual engine. Preserve legacy BEM/CSS and consumers until demonstrated parity and explicit migration approval; no automatic moving or deleting legacy rules.

Style Radix/ARIA/own `data-state` attributes through data/aria variants, never mirrored state classes. [Material](MATERIAL.md) remains binding: preserve wells, overlays, solid fallbacks, focus and reduced motion/transparency. Surface is a future composition concept, not an available React box. Gauge's approved transparent native frame uses static CVA utilities and existing tokens: border-box, padding 0, solid border 0 (not Surface's conceptual base 1px), full radius and foreground, with transparent background, no image and explicit no-shadow reset. No Surface import, hidden React helper, generic Surface-class cloning or general flat replacement is allowed. Future components need their own approved Material recipe or a Surface proposal; this exception is Gauge-only. No improvised colors, spacing, fonts, shadows or gradients; missing tokens/dependencies require specific approval.

Gauge numeric diameter has a limited geometry exception: static `w-[var(--eg-gauge-size)]` / `h-[var(--eg-gauge-size)]` consume the numeric CSS-pixel custom property; presets use approved token utilities. Do not interpolate class strings or extend this to inline appearance. Its current base-plus-v0.9-plus-v0.10 contract already approves numeric validation/fallback, passive API/accessibility and Material; do not reopen those accepted decisions. `gauge.css` retains its approved geometry-only role, including +0.5px inner-edge smoothing. Any expanded role or changed promise requires separate approval.

Keep global CSS minimal and justified. Approved hand-authored component recipes belong in `@layer components`; utilities remain in their natural layer. Class order alone does not guarantee cascade precedence. Six meaningful files are mandatory; the component stylesheet is optional. Create it only when the approved spec and plan document a meaningful compliant role; otherwise the spec states “No stylesheet”. A stylesheet does not authorize per-component BEM appearance, dummy CSS or a replacement architecture.

> Preserve previously adopted Stack & Flow separation/review requirements. This target adopts token-backed utility appearance, not upstream six-file rules, unadopted requirements or GitHub gates.

### Fuente y distribución de tokens

`packages/tokens/src/theme.css` es la única fuente de valores: `@theme static` conserva las variables de utilidades y `:root` las variables sin utilidad. T2 añade únicamente los alias de espaciado en `@theme inline static`, para emitirlos siempre y resolver overrides locales en el elemento consumidor. Vite y el plugin oficial de Tailwind compilan la entrada `src/native.css` a `dist/tokens.css`, sin generar valores desde JSON. La optimización de Tailwind está desactivada en esa salida para preservar exactamente colores alfa y alias.

Desde `@egdev/tokens` 0.3.0 se retira el export `tokens.json`. Los imports CSS públicos no cambian; el consumo nativo requiere el paquete construido, no interpretar `@theme` en el navegador. Las [13 recetas tipográficas](tokens-reference.md) tienen tamaño, interlineado, peso y tracking en `--text-*`; familia y mayúsculas se componen aparte. El espaciado nativo y Tailwind se vincula explícitamente en px, incluso con raíz distinta de 16px. La referencia conserva procedencia y muestras, no es una segunda fuente de tokens. Una futura consulta MCP queda fuera de T1/T2.

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

Six meaningful files are mandatory and the stylesheet is optional; no empty files, fake hooks or automatic migration. The approved spec/plan records the stylesheet role or “No stylesheet” before implementation:

```
packages/ui/src/{primitives|atoms|molecules|organisms|templates}/{kebab-name}/
  ComponentName.tsx          JSX; consume el hook
  useComponentName.ts        lógica, estado, aria y la llamada a CVA
  types.ts                   props públicas, variantes CVA y JSDoc/defaults
  component-name.css         optional: only with a spec-approved CSS role
  ComponentName.test.tsx     tests del hook y del componente
  ComponentName.stories.tsx  documentación en Storybook
  index.ts                   exportaciones públicas
```

Current implementation reference: `packages/ui/src/atoms/gauge/`, interpreted through its effective base-plus-v0.9-plus-v0.10 contract above. Foundation designs and legacy classes for Surface, IconButton and Tabs are future/historical evidence, not available React examples. See the [contract](../skills/_shared/component-contract.md#typescript) for native inheritance and refs when an API exposes them: the React `>=18.0.0` peer is not compatibility proof. Gauge exposes no ref or `asChild` API.

Storybook 10 documenta la API con autodocs y docgen TypeScript sobre componentes reales. No se sustituyen fallos de extracción por `argTypes` manuales; `@control select` no garantiza un select visible. Defaults, required, enums y composición se verifican contra hooks/CVA; las stories solo aportan args requeridos y ejemplos. La [guía de stories](../skills/component-contributor/references/stories.md) fija formato e imports; los tests de interacción van en `.test.tsx`, nunca en `play`.

## Idioma

Código, nombres de componentes y props, tests y toda documentación nueva o actualizada en inglés: `docs/`, READMEs, fichas de componentes, JSDoc de props, componentes y stories, encabezados, descripciones, comentarios, nombres visibles, etiquetas y textos de ejemplo de Storybook. No se traduce contenido heredado fuera del alcance aprobado. Esta norma define el idioma de los artefactos; no obliga a cambiar el idioma de la conversación.
