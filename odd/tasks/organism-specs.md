# Organism specs — @egdev/ui organisms and reclassified molecules

Draft complete v0.1 contracts for the five `ui` organisms in `docs/CATALOGO.md` plus the four `ui` molecules reclassified from organism in #116 (they had no spec yet), applying the recommended option for every decision, with captures and accepted prop conventions; publish one issue per component.
Branch `docs/organism-specs`. Drafts in `.playwright-mcp/specs/wave3/` (gitignored); new boards in `docs/design/foundation-boards/v2026-10-18-wave3/` (earlier boards in v2026-10-17 and v2026-10-18).

## Specs

- S1 — "empezamos con spcs de organismos" — scope: every `organism` row with destination `ui` (Sidebar, ModuleRail, TabBar, CalendarGrid, PreviewFrame). Agent-applied scope decision: Dialog, AlertDialog, CommandPalette and Table are included because #116 moved them to `ui` molecules and no spec covers them. Web, Mando and effects organisms stay app/effect-owned and out of scope; AppShell (template) waits for the template wave.
- S2 — "no me preguntes, aplica tu las opciones sugeridas y si tengo que irerar en la revisión ya lo vemos" — every open decision gets the recommended option, recorded as an agent-applied decision.
- S3 — "no dejes pendientes. todo de una cuando definamos specs. añade captura y acepta props" — captures and accepted prop conventions; no open items.
- S4 — "como hablamos las specs van a issue en github" — one issue per component; later versions as comments.
- S5 — "sólo vamos a crear las issues. no vamos a cogerlas hasta que no estén todas" — specs only.

## Tasks

| ID | Specs | Components | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S3 | Capture 6 Foundation boards (v2026-10-18-wave3) | parent | — |
| T2 | S1–S3 | Dialog, then AlertDialog | worker O1 | — |
| T3 | S1–S3 | CommandPalette | worker O2 | — |
| T4 | S1–S3 | Table | worker O3 | — |
| T5 | S1–S3 | Sidebar, then ModuleRail | worker O4 | — |
| T6 | S1–S3 | TabBar, then CalendarGrid, then PreviewFrame | worker O5 | — |
| T7 | S3 | Reviews, specimens, consolidate prop conventions, PR | parent | — |
| T8 | S4 | Publish 9 issues after merge | parent | — |

## Log

- L1 — 2026-10-18 — "empezamos con spcs de organismos"
- L15 — All review fixes applied (ModuleRail `kind` + `eg-rail`, CalendarGrid meta in ListItem footer, shared Icon `plus` amendment, Sidebar uses `ProductIdentity`, PreviewFrame wrapper + bracket geometry). 9/9 specimens captured, viewed and recorded in `docs/design/foundation-boards/v2026-10-18-wave3/specimens/capture.json`. Running: registry consolidation mvd6sgeb-2l-biuy; publication bodies + Icon #58 / NavList #92 v0.2 amendments mvd6sgef-2m-u8cx.
- L14 — Review of last four: no blockers; issue numbers clean. Fixes assigned: ModuleRail `type`→`kind` reusing `menu-entry-kind` (widen meaning at consolidation; NavList #92 v0.2 rename comment at publication), keep `eg-rail` marker, specimen class; CalendarGrid meta below label via ListItem footer, specimen min-width; one shared Icon #58 v0.2 `plus` amendment comment at publication; Sidebar drops `SidebarProduct` alias; PreviewFrame wrapper for Surface/clipping outside AspectRatio and bracket-syntax zone geometry (exception wording covers ProgressBar + PreviewFrame zones).
- L13 — First-five fixes applied (veil `dialogScrimVariants` in CommandPalette/AlertDialog, `dismissLabel`, `category`/`keywords` demoted to collection fields → CommandPalette has 3 new conventions, highlight `bg-action-primary-bg-default`, Sidebar four-side hairline and shared `ProductIdentity`, catalog cross-reference notes, specimen fixes). `onAdd` unified as one widened `add-request` (byte-identical in CalendarGrid/ModuleRail); `move-intent` unique. Parent set CommandPalette specimen veil to 72% to match the shared veil.
- L12 — PreviewFrame done (20 decisions: rename keeps root marker `eg-stage`; consumer owns rendering/replay/variables; `ratio`, `variant` grid|plain, `safeArea`, labelled `zones`; scoped zone-geometry custom-property exception (owner review, AGENTS.md allows Gauge only); token proposal `--pattern-grid` with plain fallback, confirmed at plan; no Radix Toolbar; new conventions `safe-area-guide`, `guide-zones`, `figure-caption`). AspectRatio is #78 (brief note #81 was wrong). All nine drafted. Final read-only review of the last four: mvd6j90a-2i-9ils.
- L11 — CalendarGrid done (20 decisions: product-neutral week organism emitting add/move/navigate intents; Move menu always available, @dnd-kit/core optional drag shortcut confirmed at plan; month view deferred; container-width layout; ListItem is #88 (brief note #91 was wrong); new `move-intent`). Collision found: `onAdd` proposed twice (`add-intent` vs ModuleRail `add-request`); unification to one widened `add-request` assigned to the CalendarGrid worker. Icon `plus` needed in #58 by ModuleRail and CalendarGrid.
- L10 — ModuleRail done (19 decisions: product-neutral rail, ProductMark brand, rail-owned anchors in Tooltip, IconButton only for add; D14 current item uses Material surface-3 instead of the board's red tint (owner review); Icon `plus` needed in #58 at plan; new conventions `end-items`, `add-request`; shared `ProductIdentity` type with Sidebar). T7 check: item `type` discriminants vs Menu `kind` / selection-cardinality `type`.
- L9 — Dialog marker fix done (recipes marker-free, hook adds markers, AC-14 asserts recipe output). Cross review of first five: issue numbers and 16 new conventions clean; decisions applied: one modal veil `bg-bg-scrim/72 backdrop-blur-none` exported from dialog/types.ts (drop `--blur-scrim` proposal); CommandPalette uses `dismissLabel` and demotes `category`/`keywords` to collection fields; Sidebar accepts four-side hairline, drops Material from level wording; specimen fixes. Workers: Dialog veil mvd6* (continuation of mvd6ffnw-2e-rfla), others mvd6gnyp-2f-av7d.
- L8 — AlertDialog done (16 decisions: separate component with Radix AlertDialog, focus on Cancel, no outside dismissal or X, required `title`/`description`/`actions`, `tone` neutral|danger with alert icon, fixed `sm`, reuses Dialog recipes and conventions; no new conventions). Found marker conflict: Dialog recipes embed `eg-dialog*` markers; fix assigned to the same worker (dialog.md only).
- L7 — Table done (25 decisions: native table, generic `TRow extends { id: string }`, sorting/selection in the hook, `value/defaultValue/onValueChange` for selected ids, details variant without header, 8 new conventions). Table worker now runs a read-only cross review of the five finished drafts (task list). All nine specs are drafted or in progress.
- L6 — CommandPalette done (22 decisions: generic palette, consumer owns index/hotkey/navigation; engine cmdk inside own Radix Dialog with hook filtering, fallback Radix Dialog + hook combobox with the same API; deps confirmed at plan; 5 new conventions; D17 departs from catalog Input/ListItem composition). T7: check scrim treatment vs Dialog (`bg-scrim` 60% vs Dialog `--blur-scrim` proposal). PreviewFrame reassigned to the CommandPalette worker: mvd6bmr4-2c-f7kq.
- L5 — Dialog done (20 decisions: sheet is a variant pinned inline-end, always modal, compound API like Popover, solid surface-2 for centered and overlay for sheet, new `size="sm"`, `status`→`statusText`, new conventions `dialog-description` and `header-status-text`, token proposal `--blur-scrim` with `backdrop-blur-none` fallback confirmed at plan). AlertDialog continuation mvd6anm4-2b-qug5.
- L4 — TabBar done (18 decisions, root marker keeps legacy `eg-tabbar`, Badge size gap noted for #52, specimen VIS-02). Sidebar done (15 decisions, no Foundation source, new convention `product-identity`, adds @radix-ui/react-scroll-area at implementation; review D6 aria-hidden name and D7 no Text). Continuations: CalendarGrid mvd69g5y-29-7xqh, ModuleRail mvd69ocn-2a-3jbv. T7 review points: env(safe-area-inset-bottom) under tokens rule (TabBar D13); Lucide paths in specimens are illustrative.
- L3 — Workers launched one spec per run (save on completion): Dialog mvd607qg-24-dyvm, CommandPalette mvd607wc-25-ii6g, Table mvd60838-26-0ghi, Sidebar mvd608ah-27-orlj, TabBar mvd608m5-28-4ft9. Continuations: AlertDialog (after Dialog), ModuleRail (after Sidebar), CalendarGrid and PreviewFrame (after TabBar). Brief `.playwright-mcp/specs/wave3/BRIEF.md`.
- L2 — Classification verified first (#114, #116 merged). T1 done: 6 boards (CalendarGrid, CommandPalette, ModuleRail, StageFrame, TabBar, Table); Dialog board already in v2026-10-18. StageFrame photo replaced by a token placeholder.
