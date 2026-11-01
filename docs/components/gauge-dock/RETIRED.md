# GaugeDock — retired

**Status:** Removed from `@egdev/ui` on 2026-11-01 by owner decision (issue [#220](https://github.com/egdev6/egdev-design-system/issues/220), task T8 of the [visual review corrections](https://github.com/egdev6/egdev-design-system/blob/main/odd/tasks/visual-review-corrections.md), spec S5).

During the 2026-11-01 owner visual review of Storybook, the owner could not make sense of the component (“Revisar componente, no lo entiendo”), then chose to retire **both** GaugeDock and HoverCard (“Ambos”). The component, its hook, types, stories, tests and barrel exports were removed; the historical v0.1 documentation under `docs/components/gauge-dock/` is kept untouched as a record.

## Alternatives

GaugeDock combined passive gauge readings with grouped toolbar actions. Compose the same intent from existing parts instead:

- Readings: [`GaugeGroup`](../gauge-group/) or `MeterRow` for two or three passive measurements.
- Actions: separate `Button` / `IconButton` controls next to the readings; the group semantic stays with the consumer (no roving-focus toolbar is provided anymore).

No migration path ships with this retirement; consumers must recompose from the parts above.
