# Atom specs — one GitHub issue per @egdev/ui atom

Draft complete component contracts (v0.1) for every `@egdev/ui` atom in `docs/CATALOGO.md`, applying the recommended option for every open decision, then publish one issue per component. No implementation until all component issues exist.
Branch `docs/atom-specs`. Drafts staged in `.playwright-mcp/specs/<kebab>.md` (gitignored); source boards in `docs/design/foundation-boards/v2026-10-17/`.

## Specs

- S1 — "atoms" — scope: every `atom` row with destination `ui` in `scripts/catalog_data.py`, except Gauge (already specified). Out of scope: `Badge preset` (destination mando) and `Pixel` (destination web).
- S2 — "no me preguntes, aplica tu las opciones sugeridas y si tengo que irerar en la revisión ya lo vemos" — every open decision gets the recommended option, recorded in the spec as an agent-applied decision; no questions to the owner.
- S3 — "no dejes pendientes. todo de una cuando definamos specs. añade captura y acepta props" — each spec ships with its captures and its prop conventions accepted (registry + approval record); no open items.
- S4 — "como hablamos las specs van a issue en github" — one issue per component; later versions as comments.
- S5 — "sólo vamos a crear las issues. no vamos a cogerlas hasta que no estén todas" — specs only, no implementation.

## Tasks

| ID | Specs | Components | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S3 | Capture 17 Foundation boards + capture.json | parent | — |
| T2 | S1–S3 | Button, IconButton, Toggle, Link, Spinner | worker A | — |
| T3 | S1–S3 | Input, Textarea, Select, Checkbox, Switch | worker B | — |
| T4 | S1–S3 | Slider, RadioGroup, Chip, Badge, StatusDot | worker C | — |
| T5 | S1–S3 | Icon, Kbd, Avatar, Logo, ProductMark | worker D | — |
| T6 | S1–S3 | ProgressBar, Stat, Mark, Dropzone, Tooltip | worker E | — |
| T7 | S3 | Consolidate prop conventions (registry, approval record, view), PR with boards | parent | — |
| T8 | S4 | Publish 25 issues after the PR merges (verified image URLs) | parent | — |

## Log

- L1 — 2026-10-17 — "atoms, hagamos una cosa...no me preguntes, aplica tu las opciones sugeridas y si tengo que irerar en la revisión ya lo vemos"
- L2 — Owner authorized read-only access to `/mnt/e/Media tool/DS/_Design systems/EGDEV Foundation/` and a local static server for captures (server not needed: boards rendered via about:blank + inlined CSS).
- L4 — Workers launched in background: T2 mvcxbhbq-1-kzh1, T3 mvcxbhiz-2-ua9f, T4 mvcxbhom-3-5juw, T5 mvcxbhux-4-um51, T6 mvcxbi1z-5-4jbp; brief `.playwright-mcp/specs/BRIEF.md`.
- L5 — T4 heads-up: registry names are globally unique. Shared IDs broadcast to T2/T3/T5/T6: pressed-state, initial-uncontrolled-pressed, pressed-change, leading-icon, signal-pulse, committed-value-change, choice-options, layout-orientation. T7: widen surface-material-tone into one shared `tone` (semantic/status tone).
- L6 — T3 done (mvcxbhiz): input, textarea, select, checkbox, switch (+ specimen). New conventions: selection-placeholder, checked-change. Cross-spec: Icon set needs `check` and `minus` (forwarded to T5). Owner-review deviations listed in each spec's D# (sizes 44/36, focus via shadow-ring-brand).
- L7 — T4 done (mvcxbhom): slider, radio-group (+ specimens), chip, badge, status-dot. New conventions: pressed-state, initial-uncontrolled-pressed, pressed-change, leading-icon, signal-pulse, committed-value-change, choice-options, layout-orientation. T7 checks: widen `tone`; RadioGroup 20px circle vs Checkbox size; StatusDot keyframes literal 2.4s (only stylesheet so far).
- L8 — T5 done (mvcxbhux): icon (41 glyphs incl. check/minus, Lucide ISC notice at implementation), kbd, avatar (+ specimen), logo (+ specimen), product-mark (+ specimen). New conventions: icon-glyph-name, filled-glyph, corner-badge-icon, paused-presentation, brand-monogram. T7 checks: Avatar.png and Logo.png boards contain broken `/_blob/` images (Avatar image row, all Logo artwork) — cite only valid rows or drop; wordmark SVG source absent (implementation prerequisite).
- L9 — T6 done (mvcxbi1z): progress-bar (+ specimen), stat, mark, dropzone (+ specimen), tooltip (+ specimen). New conventions: container-edge-placement, value-context, transient-highlight, rule-reference, files-received, drop-target-label, tooltip-content, floating-side. T7 checks: widen unavailable-measurement-message (Stat) and tone (Mark); token proposals recorded as decisions (Stat display sizes, Mark code-xs) and ProgressBar scale-x geometry exception (agent-applied, owner review); Dropzone.png has a broken `/_blob/` thumbnail.
- L3 — T1 done: 17 boards captured (Chromium 148, 1280x900, DPR 1), hashes in `docs/design/foundation-boards/v2026-10-17/capture.json`.
