---
name: component-cataloging
description: "Decide si una necesidad de interfaz se cubre reutilizando, con una variante, componiendo, extrayendo o con un componente nuevo, y en qué nivel y paquete va. Trigger: nuevo componente, ¿esto es variante?, ¿qué nivel es?, catalogar, recatalogar."
license: MIT
metadata:
  author: egdev
  version: "0.2"
  basedOn: "stack-and-flow/component-spec-cataloging-validator"
---

> Modificado por EGDEV (2026) a partir de material de Stack and Flow (copyright 2025), cuyo original conserva Apache-2.0. Las modificaciones propias se ofrecen bajo MIT. Véanse los [avisos de terceros](../../THIRD_PARTY_NOTICES.md) y la [licencia original](../../LICENSES/Apache-2.0.txt).

## Cuándo usarla

- Al diseñar una pantalla nueva (en Claude Design o en código) y aparecer algo que no está en el sistema.
- Antes de implementar un componente nuevo.
- Al revisar si un componente existente está en el nivel o paquete correcto.

Presenta un borrador, no implementes. Fila/label/skill no equivalen a aprobación humana ni autorizan mutaciones externas. M2 no inicia adaptación/recatalogación de M3.

## Lecturas obligatorias

1. [Catalogación](../../docs/CATALOGACION.md): autoridad sobre decisión/nivel.
2. [Arquitectura](../../docs/ARQUITECTURA.md) y [contrato](../_shared/component-contract.md): paquetes/API.
3. [Catálogo](../../docs/CATALOGO.md) o `docs/catalog.json`: mapa provisional.
4. Props, comportamiento y exports públicos en carpetas de componentes de `packages/ui/src/` y su `index.ts`.
5. Ficha Foundation, si existe; ficha/CSS no prueban disponibilidad React.

## Puertas de decisión

| Hallazgo | Decisión |
|---|---|
| La implementación pública existente ya lo cubre | **mantener/reutilizar** — nombra el componente, props y exports comprobados |
| Un componente existente lo cubre con otro aspecto, sin cambiar qué es | **variante** — nombre de la variante y valores |
| Se consigue juntando existentes y solo lo usa una app | **componer** en la app (patrón de producto) |
| Se compone igual en dos o más apps | **componer** una unidad genérica en `@egdev/ui`, con nivel justificado por responsabilidad |
| Hay una pieza dentro de otro componente que ahora necesitan varios | **extraer** — pieza, nivel y componente de origen |
| Nada de lo anterior | **nuevo** — nivel, base Radix y piezas que reutiliza |
| Faltan anatomía, estados, accesibilidad o evidencia React pública | **bloqueo** — lista de preguntas y evidencia pendiente |

Recorre mantener/reutilizar → variante → componer → extraer → nuevo; justifica opciones anteriores descartadas. Nivel por responsabilidad semántica/coordinación/composición, no tamaño, nodos, imports Radix, CSS ni stories. Aplica descalificadores de átomo/señales de separación del contrato; Surface y otras primitivas de apoyo son legítimas, no otro concepto por sí solas.

## Base Radix

Indica primitiva o «ninguna» justificada. Comprueba el paquete individual `@radix-ui/react-*`; si falta, bloquea y propone, no añadas dependencias. Tokens/otras librerías requieren confirmación. No reimplementes teclado/foco/ARIA disponibles.

## Salida

Devuelve la plantilla de catalogación bajo `## Borrador de decisión de catalogación`: responsabilidad, rutas/props/exports inspeccionados, alternativas e impacto API/clases/stories/tests. Nunca como aprobada. Si faltan datos o hay contradicciones, devuelve solo:

```md
## Bloqueos de catalogación

- Componente:
- Bloqueos o preguntas:
- Qué falta para decidir:
- Siguiente paso:
```

Tras aprobación humana, sigue [component-contributor](../component-contributor/SKILL.md): el plan también requiere aprobación antes de código. Catálogo solo autorizado: `scripts/catalog_data.py` y `python3 scripts/build_catalog.py`, nunca editar el generado. Informa archivos/comprobaciones/pendientes; sin aprobación nativa ni gates GitHub.
