# Referencia tipográfica conservada para T2

Estas 13 recetas existían en el JSON de EGDEV Foundation pero no se exportaban como variables CSS. T1 las conserva aquí sin publicar tokens nuevos ni convertir esta referencia en una segunda fuente de valores del paquete. Su contrato CSS y la vinculación del espaciado se decidirán en [#10](https://github.com/egdev6/egdev-design-system/issues/10).

## Procedencia

Baseline anterior a T1: commit `13cb1252e205c080ea831666aa2ee29f432b4af4`, esquema de origen versión 2. Metadatos originales: `{"source": "Penpot · Foundation / Token Contract"}`. Las familias exportadas siguen siendo autoritativas en `packages/tokens/src/theme.css`; esta tabla usa sus identificadores, no copias de sus valores.

## Recetas no exportadas

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

## Qué queda fuera de T1

- Resolver las notas pendientes de Penpot o alterar las recetas.
- Crear utilidades tipográficas, cambiar unidades o vincular `--space-*` a Tailwind.
- Añadir dimensiones semánticas (#11) o una herramienta MCP de consulta.

Las notas de tokens ya publicados se mantienen como comentarios junto a la única fuente CSS; no se conserva un export JSON estático.
