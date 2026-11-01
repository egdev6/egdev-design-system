# Field v0.3 — Counter shares the bottom row with FieldMessage

Owner-approved visual correction (issue [#223](https://github.com/egdev6/egdev-design-system/issues/223), task T3, review item S4):

> "El counter inferior, debería compartir espacio horizontal con el fieldMessage (como readout con el title)"

- **Status:** owner-approved correction implemented on the existing v0.1/v0.2 contract; no new API surface.
- **Canonical issue:** [#223](https://github.com/egdev6/egdev-design-system/issues/223); review corrections list `odd/tasks/visual-review-corrections.md` (S4).
- **Related contract:** [Field v0.1](../v0.1/implementation.md), [Field v0.2 FieldMessage composition](../v0.2/message-amendment.md).
- **Publication:** local only; this amendment has not been posted to #223.

## 1. Scope

In stacked layout, the FieldMessage (hint or error) and the counter render on one shared horizontal bottom row instead of stacked siblings of the root column. This mirrors the existing label/readout row. Unmentioned v0.1/v0.2 promises remain unchanged: no public API, id, tone, precedence, `aria-describedby` ordering, choice-layout or disabled-dimming behavior changes.

## 2. Anatomy and behavior

- Stacked: when a message, a counter or both exist, Field renders one footer row (`flex justify-between gap-2`) containing the message wrapper at the start and the counter at the end, exactly as the label row places Label at the start and readout at the end.
- When only one part exists, it occupies the row alone; the counter stays aligned to the end (`ml-auto`), preserving its former right-aligned position.
- The message wrapper keeps `min-w-0` and the counter keeps `shrink-0`, so a long message wraps within the row instead of pushing the counter out.
- Choice layout is untouched: the message remains a direct grid child in column two and the counter is still omitted; no footer row is rendered there.
- The footer row carries no disabled dimming itself; the message wrapper and the counter keep their own single `group-has` opacity variants, so parts are still dimmed exactly once.
- The counter drops its former `self-end` (a column cross-axis alignment) in favor of row-end alignment; typography, over-limit `data-state=over` tone and `tabular-nums` are unchanged.

## 3. Wiring

Counter `id`, `aria-describedby` composition and ordering, and the absence of any live region are unchanged. Existing stories (`Invalid`, `Counter`, `Disabled`) document the shared row; no new story is added.

## 4. Authority and delivery

The owner approved this correction in conversation (recorded in #223 and the review corrections task list). No commit/push/PR/merge or remote issue amendment is authorized by this document.
