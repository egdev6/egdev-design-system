# HoverCard — retired

**Status:** Removed from `@egdev/ui` on 2026-11-01 by owner decision (issue [#220](https://github.com/egdev6/egdev-design-system/issues/220), task T8 of the [visual review corrections](https://github.com/egdev6/egdev-design-system/blob/main/odd/tasks/visual-review-corrections.md), spec S6).

During the 2026-11-01 owner visual review of Storybook, the owner could not make sense of the component (“Revisar componente, no lo entiendo”), then chose to retire **both** HoverCard and GaugeDock (“Ambos”). The component, its hook, types, stories, tests and barrel exports were removed; the historical v0.1 + A1 documentation under `docs/components/hover-card/` is kept untouched as a record.

## Alternatives

HoverCard was a read-only rich preview that opened on hover/focus of a trigger. Use instead:

- [`Popover`](../popover/) when the extra content needs to be reliably reachable — click-open, focus-managed, dismissible, and touch-friendly.

If a purely static hint is enough, `Tooltip` (text only) remains available. No hover-preview replacement ships with this retirement; consumers must move to Popover composition.
