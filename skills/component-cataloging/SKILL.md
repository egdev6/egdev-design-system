---
name: component-cataloging
description: "Decide si una necesidad de interfaz se cubre reutilizando, con una variante, componiendo, extrayendo o con un componente nuevo, y en qué nivel y paquete va. Trigger: nuevo componente, ¿esto es variante?, ¿qué nivel es?, catalogar, recatalogar."
license: MIT
metadata:
  author: egdev
  version: "0.1"
  basedOn: "stack-and-flow/component-spec-cataloging-validator"
---

## Cuándo usarla

- Al diseñar una pantalla nueva (en Claude Design o en código) y aparecer algo que no está en el sistema.
- Antes de implementar un componente nuevo.
- Al revisar si un componente existente está en el nivel o paquete correcto.

No implementa nada: produce una decisión que el usuario aprueba.

## Lecturas obligatorias

1. `docs/CATALOGACION.md` — orden de decisión, contratos por nivel y descalificadores de átomo. Es la autoridad.
2. `docs/CATALOGO.md` (o `docs/catalog.json`) — qué existe, en qué nivel y sobre qué Radix.
3. `packages/ui/src/{primitives,atoms,molecules,organisms,templates}/` — lo ya implementado.
4. Si viene de EGDEV Foundation: la ficha del componente en Claude Design.

## Puertas de decisión

| Hallazgo | Decisión |
|---|---|
| Un componente existente ya lo cubre | **reutilizar** — nombra el componente y cómo se usa |
| Un componente existente lo cubre con otro aspecto, sin cambiar qué es | **variante** — nombre de la variante y valores |
| Se consigue juntando existentes y solo lo usa una app | **componer** en la app (patrón de producto) |
| Se compone igual en dos o más apps | **componer** como molécula u organismo en `@egdev/ui` |
| Hay una pieza dentro de otro componente que ahora necesitan varios | **extraer** — pieza, nivel y componente de origen |
| Nada de lo anterior | **nuevo** — nivel, base Radix y piezas que reutiliza |
| Falta información (anatomía, estados, accesibilidad) | **bloqueo** — lista de preguntas |

Comprueba siempre los descalificadores de átomo y las señales de separación de `docs/CATALOGACION.md`.

## Base Radix

Para cada componente nuevo o extraído, indica la primitiva de Radix o «ninguna» con el motivo. Si Radix no la tiene y hace falta librería (combobox, carrusel, arrastrar), dilo como bloqueo: añadir dependencias requiere confirmación.

## Salida

Cuando la decisión está clara, devuelve el bloque de `docs/CATALOGACION.md` («Decisión de catalogación») bajo el título `## Borrador de decisión de catalogación`. Cuando no, devuelve solo:

```md
## Bloqueos de catalogación

- Componente:
- Bloqueos o preguntas:
- Qué falta para decidir:
- Siguiente paso:
```

Tras la aprobación del usuario: actualiza `scripts/catalog_data.py` y ejecuta `python scripts/build_catalog.py`.
