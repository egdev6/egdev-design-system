# Contrato tipográfico y espaciado — T2

Las 13 recetas heredadas se publican como variables CSS y utilidades Tailwind en [#10](https://github.com/egdev6/egdev-design-system/issues/10), sin portar componentes ni rediseñar la tipografía. La única fuente autoritativa de valores es `packages/tokens/src/theme.css`. Esta referencia conserva el snapshot aprobado, familias, muestras y procedencia; no genera tokens.

## Procedencia

Baseline anterior a T1: commit `13cb1252e205c080ea831666aa2ee29f432b4af4`, esquema de origen versión 2. Metadatos originales: `{"source": "Penpot · Foundation / Token Contract"}`. Las familias exportadas siguen siendo autoritativas en `packages/tokens/src/theme.css`; esta tabla usa sus identificadores, no copias de sus valores.

## Recetas aprobadas (snapshot de T2)

| Grupo | Nombre | Familia | Tamaño | Interlineado | Peso | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| Display | display-hero | display | 56px | 1.1 | 800 | 0 |
| Display | display-show | display | 96px | 0.9 | 800 | 0 |
| Display | display-pro | display | 64px | 0.95 | 800 | 0 |
| Heading | heading-section | display | 40px | 1.2 | 800 | 0 |
| Heading | heading-small | sans | 24px | 1.2 | 700 | 0 |
| Body | body-large | sans | 20px | 1.6 | 500 | 0 |
| Body | body-default | sans | 16px | 1.6 | 500 | 0 |
| Body | body-muted | sans | 20px | 1.6 | 400 | 0 |
| Label | label-default | sans | 14px | 1.2 | 600 | 0 |
| Label | label-eyebrow | display | 14px | 1.2 | 700 | 0.12em |
| Label | meta | display | 14px | 1.3 | 600 | 0.08em |
| CTA | cta-label | sans | 16px | 1.2 | 700 | 0 |
| Code | code | mono | 14px | 1.6 | 400 | 0 |

## Fluid Title recipes (Text/Heading #108)

Owner-approved additions for the Text/Heading primitives ([#108](https://github.com/egdev6/egdev-design-system/issues/108) D8/D9). They preserve the exact legacy `.eg-title--*` clamps and tight leading; they do not replace the fixed `display-*` or `heading-section` recipes above. Family (`font-display`) and casing (`uppercase`) stay separate utilities.

| Group | Name | Family | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| Title | title-section | display | `clamp(40px, 5.6vw, 64px)` | 0.9 | 800 | 0 |
| Title | title-hero | display | `clamp(60px, 9vw, 140px)` | 0.86 | 800 | 0 |
| Title | title-show | display | `clamp(56px, 8.2vw, 132px)` | 0.86 | 800 | 0 |
| Title | title-display | display | `clamp(64px, 9.6vw, 164px)` | 0.82 | 800 | 0 |

Glyph glow: `--text-shadow-title-hero: 0 0 40px var(--color-alpha-red-30)`, used only by the canvas hero accent through `[text-shadow:var(--text-shadow-title-hero)]`. It is a text shadow, never a box-shadow token. `cn()` registers the four `title-*` sizes in its font-size merge group so they are not mistaken for text colors.

## Consumir una receta

Para cada nombre `R`, el contrato publica `--text-R`, `--text-R--line-height`, `--text-R--font-weight` y `--text-R--letter-spacing`. Tailwind compila `text-R` con esos cuatro valores; **no añade automáticamente la familia ni las mayúsculas**.

En CSS nativo de una app:

```css
.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-display-hero);
  line-height: var(--text-display-hero--line-height);
  font-weight: var(--text-display-hero--font-weight);
  letter-spacing: var(--text-display-hero--letter-spacing);
  text-transform: uppercase;
}
```

En HTML de una app con Tailwind:

```html
<h1 class="font-display text-display-hero uppercase">HAZ QUE SUCEDA</h1>
<p class="font-sans text-body-muted">Texto secundario, sin color implícito.</p>
<code class="font-mono text-code">touch-action: pan-y;</code>
```

Los ejemplos no autorizan cambiar el aspecto de un componente `@egdev/ui` mediante `className`: se mantiene el contrato de variantes. El consumidor carga las fuentes; declarar una familia no acredita su descarga ni el renderizado de glifos.

## Espaciado y tamaño raíz

Se conservan `--space-0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24` en px. Sus alias `--spacing-N` viven en `@theme inline static` y las utilidades usan `var(--space-N)` directamente. La base `--spacing` referencia `--space-1` para pasos no enumerados y decimales.

| Caso sin overrides | Raíz 16px | Raíz 20px |
| --- | --- | --- |
| `p-4` y `padding: var(--space-4)` | 16px | 16px |
| `p-0.5` | 2px | 2px |
| `p-9` (derivado de la base, no nuevo token) | 36px | 36px |
| `text-display-hero` | 56px | 56px |

**Cambio aprobado respecto al default Tailwind:** antes `--spacing: 0.25rem` hacía que `p-4` valiese 20px con raíz de 20px; T2 lo vincula a los tokens EGDEV en px. El zoom del navegador es otro mecanismo y no se sustituye por este test de tamaño raíz.

Un override local de `--space-4: 24px` afecta a `p-4` en ese ámbito, sin cambiar los demás pasos. Un override de `--space-1: 6px` afecta a los pasos derivados (`p-0.5` = 3px, `p-9` = 54px); los pasos con alias propio conservan su token correspondiente. No se modifica el espaciado de componentes existentes por publicar estos alias.

## Animation tokens

Animation tokens live in the `@theme static` block of `packages/tokens/src/theme.css` together with their keyframes, so Tailwind compiles the matching `animate-*` utility and the native `tokens.css` artifact ships the keyframes. `@egdev/ui` only references the token theme: an `animate-*` utility without a token here is not emitted. Reduced motion is stopped at the usage site (`motion-reduce:animate-none`).

| Token | Value | Keyframes | Use |
| --- | --- | --- | --- |
| `--animate-pulse` | `pulse 2s var(--ease-snappy) infinite` | `pulse`: 50% opacity 0.5 | Decorative opacity pulse for placeholders and signals (Skeleton v0.2, [#102](https://github.com/egdev6/egdev-design-system/issues/102)). |
| `--animate-spin` | `spin 1s linear infinite` | `spin`: to rotate(360deg) | Indeterminate activity rotation, one linear turn per second (Spinner v0.1, [#69](https://github.com/egdev6/egdev-design-system/issues/69)). |

## Notas y muestras originales

- **display-hero**: Typography / Display / Hero. Barlow Condensed 800 en MAYÚSCULAS. Penpot: 56 / 700 / 1.1. (Penpot: pendiente de sincronizar la familia.)
  Muestra: `Construye en negro y rojo`.
- **display-show**: Registro Show: Barlow Condensed 800 en MAYÚSCULAS; puede cortarse en el borde.
  Muestra: `HAZ QUE SUCEDA`.
- **display-pro**: Registro Pro: hero de producto y documentación, Barlow Condensed 800 en MAYÚSCULAS.
  Muestra: `ORQUESTA TUS AGENTES`.
- **heading-section**: Typography / Heading / Section. Barlow Condensed 800 en MAYÚSCULAS. Penpot: 40 / 700 / 1.2. (Penpot: pendiente de sincronizar la familia.)
- **heading-small**: Typography / Heading / Small. Barlow 700 en caja normal (títulos de card y bloque). (Penpot: pendiente de sincronizar la familia.)
- **body-large**: Typography / Body / Large. Barlow 500. (Penpot: pendiente de sincronizar la familia.)
- **body-default**: Typography / Body / Default. Barlow 500. (Penpot: pendiente de sincronizar la familia.)
- **body-muted**: Typography / Body / Muted. Barlow 400. El nombre no implica color. (Penpot: pendiente de sincronizar la familia.)
- **label-default**: Typography / Label / Default. Barlow 600. (Penpot: pendiente de sincronizar la familia.)
- **label-eyebrow**: Typography / Label / Eyebrow. Barlow Condensed 700 en MAYÚSCULAS, tracking 0.12em. Sustituye también a los metadatos mono. (Penpot: pendiente de sincronizar la familia.)
  Muestra: `FOUNDATION`.
- **meta**: Metadatos, versiones y etiquetas: Barlow Condensed 600 en MAYÚSCULAS. Sustituye a la voz mono.
  Muestra: `DOCS · V1.1.3 · 4 MIN`.
- **cta-label**: Typography / CTA / Label. Barlow 700. (Penpot: pendiente de sincronizar la familia.)
  Muestra: `Empezar ahora`.
- **code**: JetBrains Mono SOLO dentro de bloques y fragmentos de código.
  Muestra: `touch-action: pan-y;`.

## Qué queda fuera de T2

- Resolver las notas pendientes de Penpot, alterar las recetas o migrar tipografía legacy.
- Convertir tamaños o espaciados de px a rem; añadir familias o cambiar colores de `body-muted`.
- Añadir dimensiones semánticas (#11), componentes o una herramienta MCP de consulta.

Las notas de tokens ya publicados se mantienen como comentarios junto a la única fuente CSS; no se conserva un export JSON estático.
