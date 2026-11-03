# SectionNav v0.1 — single landmark amendment

- **Status:** Approved by the owner on 2026-11-03.
- **Amends:** the landmark structure of the [SectionNav v0.1 contract](spec.md) and [plan](implementation-plan.md) §1 item 4 and §3 ("the portalled named dialog contains one named nav and ordered list of links"). The public API, names, behavior and every other part of the approved contract and plan are unchanged.

## Problem found during implementation

The approved candidate renders two navigation landmarks:
- the root `<nav>`, named by `label`;
- an index `<nav>` inside the portalled Popover dialog, also named by `label`.

The jsdom accessibility check exposes both as navigation landmarks named with the same string, for example "Sections". Plan §3 requires the landmarks to be distinguishable and, if they are not, to stop for an owner-approved structure or name resolution. The Unit A writer stopped there.

## Owner decision

Question: "SectionNav: la raíz y el índice del Popover quedan como dos landmarks de navegación con el mismo nombre ("Sections"), indistinguibles para lectores de pantalla. ¿Cómo lo resolvemos?"

Answer: "Un solo landmark: el índice como lista dentro del diálogo (Recomendado)".

## Amended structure

| Part | Element and name | Change |
|---|---|---|
| Root | `<nav>` named by `label` | Unchanged; the only navigation landmark SectionNav renders. |
| Index panel | The existing Popover dialog, named by `label` | Unchanged; the dialog remains exposed to assistive technology, never hidden. |
| Index list | An `<ol>` of native same-document links directly inside the dialog | No inner `<nav>`. The dialog name provides the context that the inner landmark duplicated. |

- The amendment adds no props, renames nothing and leaves no landmark unnamed.
- `aria-current="location"`, focus behavior (including `onCloseAutoFocus` only after real navigation), Escape and dismissal are unchanged.
- **Tests:** in every state (empty, unmatched, closed, open), exactly one navigation landmark is rendered. When open, the dialog named by `label` contains the ordered list of links.
- Real screen-reader sessions remain unperformed, as the plan already records.
