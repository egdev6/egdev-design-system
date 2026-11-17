# Dialog and AlertDialog v0.2 — header-layout amendment

- **Status:** Approved — 2026-11-17 (owner).
- **Amends:** the existing [Dialog v0.2 contract](container-compact-amendment.md) and [AlertDialog v0.1 contract](../../alert-dialog/v0.1/implementation-plan.md), for [#458](https://github.com/egdev6/egdev-design-system/issues/458). Unmentioned promises remain unchanged.
- **Approval evidence:** owner decisions recorded in `odd/tasks/dialog-header-layout.md` S2, 2026-11-17, verbatim: API `headerLayout="inline"|"stacked" (Recommended)`; statusText `En la primera línea, junto al título (Recommended)`; AlertDialog `Agregar la prop también a AlertDialog`; delivery `Sí, hasta el merge (Recommended)`.

## Purpose and anatomy

Extend the existing Radix-based molecules with a header-only arrangement. In `stacked`, the description is on its own line below the title at every dialog width; Dialog's optional passive status remains on the first line next to the title. In `inline`, the title line and description share a row. A long title or description may wrap within its own content; do not use a width breakpoint to select the arrangement.

Preserve all existing public part markers and the title/description reading order. Dialog's built-in dismiss button remains outside the header, absolutely positioned at logical top-end, with its existing focus order. AlertDialog has no built-in dismiss button or `statusText`; its title row retains the optional decorative danger icon, and Cancel remains the initial focus target.

## Public API and naming

| Component | New optional prop | Default and behavior |
| --- | --- | --- |
| `DialogContent` | `headerLayout?: 'inline' \| 'stacked'` | `inline`: exactly the existing header markup and classes. `stacked`: title and optional status first, description below. |
| `AlertDialogContent` | `headerLayout?: 'inline' \| 'stacked'` | `stacked`: exactly the existing header markup and classes. `inline`: existing title row and required description side by side. |

The defaults differ deliberately: AlertDialog already renders its description below the title row, while Dialog's legacy `.eg-dialog__head` renders a row. An unrecognized runtime value falls back to that component's own default and is not forwarded to the DOM. TypeScript accepts only the two documented values. This prop changes no title, description, status, actions or portal ownership.

[Naming registry](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md), and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry): `label-layout` / `layout` describes a control and its label, not a modal header. The approved scoped convention to register is `dialog-header-layout` / `headerLayout`, meaning the arrangement of the title line and description within DialogContent and AlertDialogContent. It does not redefine generic page layout, field-label layout or keyboard orientation. Its approval and usages are restricted to these two components and require a recoverable receipt, final reviewed source hashes and a pinned prior receipt in the implementation transaction.

## Appearance and accessibility

Declare static token-backed CVA variants in each component's `types.ts`, compose parts through `cn()` in the hook, and preserve the legacy components-layer rule while allowing utilities to win where opted in. No new token, dependency, stylesheet, dynamic geometry, handwritten paint or extra internal module is authorized. Existing panel material, spacing, dismiss placement, interaction and supported `className` boundaries remain unchanged.

Radix continues to own the modal, `aria-labelledby`, `aria-describedby`, focus management and dismissal. The relationships must still point to the same visible title and description across layout changes, without using status as the accessible name or introducing a live region. Dialog retains its built-in close position and Tab order; AlertDialog retains Cancel autofocus, action order and Escape behavior. Browser and assistive-technology verification are separate from class and DOM assertions.

## Acceptance matrix

| ID | Observable contract | Planned evidence |
| --- | --- | --- |
| HL-01 | Dialog defaults to the unchanged inline header; AlertDialog defaults to the unchanged stacked header. | Default and explicit-default DOM/class regressions; invalid-value fallback checks. |
| HL-02 | Stacked description is below the title at all widths; Dialog status stays on the title's first line. | Layout part/class and DOM tests; narrow and wide real-browser geometry, including long text and status. |
| HL-03 | Inline puts the description beside the title line; AlertDialog keeps its icon and title together. | Both components' inline tests, stories and real-browser geometry. |
| HL-04 | Accessible title/description relationships, Dialog dismiss placement and focus order, and AlertDialog Cancel/action focus behavior are unchanged. | Rerender/keyboard tests; real-browser keyboard and accessibility inspection. |
| HL-05 | Both layouts are documented in English stories for each component, with optional select metadata and the correct component-specific default. | Story source, docgen and registered Controls tests; browser Controls inspection. |
| HL-06 | Both public prop types accept only the two values; the shipped CSS contains the applied layout utilities without requiring consumer Tailwind. | Package export and packed React 18/19 type/CSS checks. |

All evidence above is planned until observed by the parent; this amendment does not claim browser, assistive-technology, build or packed-consumer results.
