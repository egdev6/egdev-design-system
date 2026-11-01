# Organisms wave — owner approvals

Recorded 2026-11-01 from the owner's questionnaire answers after the nine implementation plans were drafted (tracking: `odd/tasks/organisms-build.md`, L11).

| Decision | Owner answer | Scope |
|---|---|---|
| Implementation plans | "Aprobar los 9 (Recomendado)" | `docs/components/{dialog,alert-dialog,command-palette,table,sidebar,module-rail,tab-bar,calendar-grid,preview-frame}/v0.1/implementation-plan.md` with their stated recommendations: Dialog first (AlertDialog and CommandPalette reuse its veil); CalendarGrid uses a keyboard-accessible Move menu without drag; TabBar uses native anchors; PreviewFrame examples use `neutral` instead of the retired `ghost`. |
| New dependencies | "Las tres (Recomendado)", then "Alineadas (Recomendado)" for versions | `@radix-ui/react-dialog@1.3.1`, `@radix-ui/react-alert-dialog@1.2.1` (aligned with the installed Radix generation, e.g. popover/toast 1.3.1) and `cmdk@1.1.1`, exact pins in `@egdev/ui`. |
| ProductMark replacement | "Slot libre del consumidor (Recomendado)" | `ProductIdentity` (shared by Sidebar and ModuleRail) accepts a consumer-supplied node (Logo, Avatar or other) plus a name; no new component. |
| PreviewFrame grid pattern | "Fondo liso por ahora (Recomendado)" | No `--pattern-grid` token; use existing surfaces. |

These approvals cover implementation within each plan's surfaces, the listed dependencies and bounded validation. They do not approve token value changes or other dependencies. AppShell #130 stays parked until Sidebar, ModuleRail and TabBar exist.
