# Molecule specs — primitives and molecules of @egdev/ui

Draft complete v0.1 contracts for the 10 `ui` primitives and 25 `ui` molecules in `docs/CATALOGO.md`, plus the multi-ring Gauge composition (#31), applying the recommended option for every decision, with captures and accepted prop conventions; publish one issue per component (multi-ring as a versioned comment on #31).
Branch `docs/molecule-specs`. Drafts in `.playwright-mcp/specs/wave2/` (gitignored); boards in `docs/design/foundation-boards/v2026-10-18/` (and v2026-10-17).

## Specs

- S1 — "arrancamos con las moleculas" — scope: every `molecule` row with destination `ui`; molecules for web, mando and cadencia are out. Agent-applied scope decision: the 10 `ui` primitives are included because the molecules compose them (Surface, Text, Stack/Cluster, AspectRatio, Portal, Label…); the multi-ring Gauge is included as a comment on its existing issue #31.
- S2 — "no me preguntes, aplica tu las opciones sugeridas y si tengo que irerar en la revisión ya lo vemos" — every open decision gets the recommended option, recorded as an agent-applied decision.
- S3 — "no dejes pendientes. todo de una cuando definamos specs. añade captura y acepta props" — captures and accepted prop conventions; no open items.
- S4 — "como hablamos las specs van a issue en github" — one issue per component; later versions as comments.
- S5 — "sólo vamos a crear las issues. no vamos a cogerlas hasta que no estén todas" — specs only.

## Tasks

| ID | Specs | Components | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S3 | Capture 20 Foundation boards (v2026-10-18) | parent | — |
| T2 | S1–S3 | Slot, VisuallyHidden, Portal, Label, AspectRatio | worker P1 | — |
| T3 | S1–S3 | Surface, Stack/Cluster, Text/Heading, Divider, Skeleton | worker P2 | — |
| T4 | S1–S3 | Field, ButtonGroup, ChipGroup, SelectTile, SearchTrigger | worker M1 | — |
| T5 | S1–S3 | Tabs, Menu, NavList, UserMenu, Popover | worker M2 | — |
| T6 | S1–S3 | HoverCard, Notice, Toast, Carousel, GaugeDock | worker M3 | — |
| T7 | S1–S3 | ListItem, Timeline, ModuleCard, MeterRow, PhotoFrame | worker M4 | — |
| T8 | S1–S3 | PageHeader, SectionHeader, SocialLinks, PullQuote, Countdown, GaugeGroup (#31) | worker M5 | — |
| T9 | S3 | Specimens, consolidate prop conventions, PR | parent | — |
| T10 | S4 | Publish issues + #31 comment after merge | parent | — |

## Log

- L1 — 2026-10-18 — "arrancamos con las moleculas"
- L5 — Resumed failed writers as single-spec units, preserving 11 existing drafts. AspectRatio completed (mvczcfci-8-9q7w); five P1 drafts now exist. Read-only consistency review delegated as mvczh1r0-f-z6oo (includes Label specimen mismatch). Other active units: Stack mvczck5g-9-93q2, ChipGroup mvczck8n-a-swkh, NavList mvczckb1-b-hnqj, HoverCard mvczcke6-c-sl0x, ListItem mvczckhu-d-1btb, PageHeader mvczcklo-e-7cbd.
- L4 — 2026-10-18 — "reanuda la definición de moléculas con subagentes". The L3 workers were lost before writing any draft (not in the task list, `wave2/` empty). Relaunched the same groups: T2 mvcyxudx-1-u98s, T3 mvcyxugn-2-u7zr, T4 mvcyxujf-3-nl2k, T5 mvcyxulz-4-stiq, T6 mvcyxupz-5-bl2k, T7 mvcyxuu7-6-1hn3, T8 mvcyxuz2-7-lja5; each now writes every spec as soon as it is ready.
- L3 — (superseded) Workers launched: T2 mvcygzqy-6-hwn2, T3 mvcygzxj-7-vi4e, T4 mvcyh035-8-urqz, T5 mvcyh0ec-9-eg0o, T6 mvcyh0ks-a-yo8f, T7 mvcyh0sy-b-djfn, T8 mvcyh12m-c-6zva; brief `.playwright-mcp/specs/wave2/BRIEF.md`.
- L6 — Stack/Cluster, ChipGroup and HoverCard completed as bounded drafts/specimens. Next units active: Text/Heading mvczhnbw-g-rpsk, SelectTile mvczhrs0-h-m5tw, Carousel mvczicuy-i-ghyr. Consolidation must reconcile differing Menu/Toast wording for shared open-state, initial-uncontrolled-open and open-change conventions; HoverCard reused Menu verbatim. No captures/runtime validation implied by draft completion.
- L7 — NavList, ListItem and PageHeader completed. Next active: UserMenu mvczjx7w-j-rp2z, Timeline mvcznf2e-l-bbwy, SectionHeader mvcznvzx-m-56zg. PageHeader decision: separate from SectionHeader, no register axis. Primitive review found Label type/specimen mismatch, Slot invalid-child wording and overstated verification; corrective writer mvczk2be-k-7txe active on five narrow draft/specimen paths.
- L8 — Text/Heading, SelectTile and Carousel completed. SearchTrigger mvczqklq-o-lge4, Divider mvczoy9v-n-g6bo and GaugeDock mvczrnsk-q-pujc active. Primitive corrections completed (Label types/choice specimen; Slot errors; VisuallyHidden naming/refs; Portal conservative SSR). Cross-draft read-only convention/consumer consistency review active as mvczrih0-p-fp89. No browser/runtime checks inferred.
- L9 — Skeleton completes T3's five primitive drafts; read-only group review mvd02oze-y-3vxp active. T4 correction mvd01jqe-x-vsf3 active (ButtonGroup child keyboard behavior, independent SelectTile ratio fixtures, SearchTrigger CSS cascade wording). Remaining T7/T8 drafting continues incrementally; completed artifacts are not overwritten.
- L10 — Menu/UserMenu schema reconciliation completed: public entry discriminator is `kind` (item/link/separator/label/submenu), new draft convention `menu-entry-kind`; native button `type` unchanged. T3 review found Surface ref/material inconsistencies, Text HTML-injection type gap, Stack default metadata and specimen weight literal; corrections active as mvd07udw-13-jptq.
- L11 — T3 correction complete: Surface default/slotted refs clarified, elevated surface-0 gains sheen (no combinations removed), Text/Heading exclude dangerouslySetInnerHTML, Stack/Cluster alignment metadata separated, Surface specimen caption weights tokenized. Revised Surface specimen must be captured after these corrections. Browser capture capabilities located for next parent evidence step.
- L12 — All 35 other contracts drafted; GaugeGroup retry mvd12mxf-1c-js08 active after prior timeout (no file saved). T7 read-only review found only Timeline Badge wrapping and MeterRow lg/edge composition inconsistencies, both corrected by mvd141be-1d-7xwk. Prop consolidation candidate extraction active mvd15ogb-1e-yf37; no canonical registry edits/approvals yet. Surface specimen has one real provisional capture in `.playwright-mcp/wave2/surface--specimen.png`; actual bounds/font conditions still need final comparable capture metadata.
- L2 — T1 done: 20 boards (Tabs, MenuList, UserMenu, Notice, PostCard, SelectTile, Timeline, SectionHeader, ModuleCard, SearchTrigger, SocialLinks, PhotoFrame, PullQuote, Countdown, TipsSlider, Divider, Title, Eyebrow, Gauge, Dialog); 4 with photo placeholders for unavailable `/_blob/` images.

- L13 — Delivery issue #76 created with explicit owner authorization and status:approved. All 36 final Draft bodies prepared (35 new issues, GaugeGroup comment on #31); 27 specimen captures visually reviewed after font corrections. Registry 103 entries; focused checks pass: props 74, unit 166, types, lint, finalizer 15. Component implementation remains out of scope.
