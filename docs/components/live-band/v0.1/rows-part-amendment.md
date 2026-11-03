# LiveBand v0.1 — explicit rows part amendment

- **Status:** Approved by the owner on 2026-11-03.
- **Amends:** [LiveBand v0.1 contract](spec.md) (`LiveBandList` / `LiveBandRow` composition, `LiveBandList.children` row), and the matching composition of the [implementation plan](implementation-plan.md). Every other part of the approved contract and plan is unchanged.

## Problem found before implementation

The contract gives `LiveBandList` undifferentiated `children`: a consumer heading, an optional independent archive link and zero or more `LiveBandRow` children. Only the rows belong in one `ul`, and an empty set of rows omits the `ul`.

With children-only composition, `LiveBandList` cannot tell rows from the heading and link without inspecting child element types, and the approved plan did not authorize that. The Unit A writer stopped before writing any file.

## Owner decision

Question: "LiveBand: LiveBandList recibe título, link al archivo y filas mezclados como children, y solo las filas deben ir en el ul. ¿Cómo lo resolvemos?"

Answer: "Parte explícita LiveBandRows, como BlogGrid (Recomendado)".

## Amended composition

| Part | Renders | Children |
|---|---|---|
| `LiveBandList` | Passive container | Consumer heading, then `LiveBandRows`, then an optional independent archive link, in DOM and visual order. It does not inspect, clone or reorder its children. |
| `LiveBandRows` (new) | `ul` | Zero or more `LiveBandRow`. With no children (after React's ordinary null/boolean filtering, as in `BlogGridRows`), it renders nothing, so no empty `ul`. |
| `LiveBandRow` | `li` | Unchanged: one editorial-divided ListItem composed onto a named anchor; no ListItemActions. |

- `LiveBandRows` follows the delivered `BlogGridRows` precedent. It requires `children: ReactNode`, inherits compatible `ComponentPropsWithoutRef<'ul'>` minus conflicting children, unsafe HTML, `role` and `style`, and takes the list layout utilities that the plan assigned to the list's `ul`.
- The archive link stays outside the `ul` and is never inside a row. Nested links stay forbidden.
- No new naming convention. `children` and `className` remain React and native composition.
- Public exports gain `LiveBandRows` and `LiveBandRowsProps`. The parent integrates them in Unit B.
