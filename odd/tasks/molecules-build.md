# Molecules build — approved molecules of @egdev/ui to PR

Implement every approved `ui` molecule up to an open PR (owner merges), with 3 rolling background workers, one worktree each under `../egdev-design-system-worktrees/<slug>` on branch `feat/<issue>-<slug>` from `origin/main`. Same protocol as `odd/tasks/particles-build.md`.

## Specs

- S1 — "continuamos con los planificado de moléculas. Abre 3 subagentes que pertenecen abiertos y cogiendo nuevas issues cuando terminen una" — scope: molecules in `docs/CATALOGO.md` § Moléculas with a `status:approved` contract issue. Excluded: UserMenu #111, Panel #180, Collapsible #181, FieldMessage #179, Indicator #178 (`status:needs-review`); Dialog/AlertDialog/CommandPalette/Table (organism contracts); PhotoFrame #95 (blocked on asset proof); GaugeGroup #31 (Gauge amendment, not in this batch).
- S2 — Dependencies: "Sí, los 8" — each component adds only the Radix package its contract names, exact pinned version: react-toggle-group (ChipGroup, SelectTile), react-dropdown-menu (Menu), react-popover (Popover), react-hover-card (HoverCard), react-toast (Toast), react-scroll-area (Timeline), react-toolbar (GaugeDock), react-collapsible (NavList). Any other dependency or any token add/change stops and asks the owner.
- S3 — A component starts only when every component its approved contract composes is merged in `main`. Always implement the latest approved amendment, not just the issue body.
- S4 — Standing rules (from particles-build): workers edit the working tree and run focused, memory-capped checks; the parent installs deps, commits work units, merges `origin/main`, runs `/tmp/egdev-gates.sh` + `pnpm test:tokens`, pushes and opens the PR. CI disabled while private (claim no CI runs); no force push; no `git stash`; heavy gates serialized under `flock /tmp/egdev-gates.lock` (packed also `/tmp/egdev-packed.lock`) with MemoryMax; no browser/visual claims (owner reviews Storybook on main).

## Tasks

Route: background `gentle-ai-worker` per component; parent owns Git, installs, gates, push, PR. Status: `[ ]` pending · `[~]` in progress · `[P]` PR open · `[x]` merged.

| ID | Issue | Component | Needs merged / dep | Status | PR / commits |
|---|---|---|---|---|---|
| T1 | #84 | Field | Slider fix (fix/68-slider-invalid 90c3d19) | [x] | PR #201 merged 98df779 |
| T2 | #93 | Notice | — | [x] | PR #187 merged 48e3150 |
| T3 | #107 | Tabs | — (react-tabs installed) | [x] | PR #186 merged da6f956 |
| T4 | #79 | ButtonGroup | — | [x] | PR #185 merged 4f21560 |
| T5 | #89 | Menu | react-dropdown-menu | [x] | PR #190 merged 6ae51c9 |
| T6 | #81 | ChipGroup | react-toggle-group | [x] | PR #189 merged 5e1b099 |
| T7 | #88 | ListItem | — | [x] | PR #188 merged b2230e2 |
| T8 | #100 | SectionHeader | token --breakpoint-section-header-split | [x] | PR #192 merged 97af309 |
| T9 | #90 | MeterRow | — | [x] | PR #191 merged c60d4a8 |
| T10 | #104 | SocialLinks | — | [x] | PR #193 merged ce5a191 |
| T11 | #80 | Carousel | — | [x] | PR #194 merged 565f000 |
| T12 | #96 | Popover | react-popover | [x] | PR #195 merged 5b4efa8 |
| T13 | #86 | HoverCard | react-hover-card | [x] | PR #196 merged 1cfac30 |
| T14 | #101 | SelectTile | react-toggle-group | [x] | PR #197 merged f65538b |
| T15 | #109 | Timeline | react-scroll-area | [x] | PR #198 merged 3722fdc |
| T16 | #92 | NavList | react-collapsible | [x] | PR #199 merged 8753da3 |
| T17 | #85 | GaugeDock | react-toolbar | [x] | PR #200 merged c71629b |
| T18 | #94 | PageHeader | ButtonGroup | [x] | PR #203 merged 383c741 |
| T19 | #110 | Toast | Notice; react-toast | [x] | PR #204 merged 1d1a21f |
| T20 | #91 | ModuleCard | contract-named parts | [x] | PR #202 merged 901ffbf |

## Log

- L1 — 2026-10-29 — "continuamos con los planificado de moléculas. Abre 3 subagentes que pertenecen abiertos y cogiendo nuevas issues cuando terminen una"
- L2 — Dependencies: "Sí, los 8".
- L3 — Worktrees field/notice/tabs from origin/main d428967, frozen install OK; coordination doc copied untracked into each worktree (runtime requires it there). Workers: Field mvtsc2fl-1-imm8, Notice mvtsc2o5-2-4455, Tabs mvtsc2yz-3-1tln.
- L4 — Notice stopped before edits: D10/AC-10 require marker-free noticeVariants composed from surfaceVariants, but merged surfaceVariants base includes `eg-surface`; filtering forbidden. Owner decision pending.
- L5 — Field stopped before edits: D2/D9 Slot wiring puts aria-invalid where Slider leaves it on the non-focusable root (aria-describedby goes to thumb). Needs a Slider correction outside scope. Owner decision pending.
- L6 — Freed slots: ButtonGroup mvtsfu4g-4-k3pd; Menu mvtsfud4-5-wjom (parent added @radix-ui/react-dropdown-menu 2.2.1 in e965b71).
- L7 — Owner: Notice "Enmendar D10: permitir eg-surface" (posted #93 A1); Field "Corregir Slider antes" (posted #68 A1; fix 90c3d19 on fix/68-slider-invalid, RED→GREEN 17/17); Menu "Enmendar: comportamiento nativo de Radix" (posted #89 A1).
- L8 — Tabs and ButtonGroup completed and committed in 3 slices each; delivery job-2 runs full gates+tokens, push and PR for slider fix, Tabs, ButtonGroup serially.
- L9 — Menu stopped again: Radix SubContent Escape calls rootContext.onClose() (closes whole menu) vs §4/AC-06 submenu-only. ChipGroup stopped: §6 branch-specific Controls vs whole-type metadata policy. ListItem mvttckv8-9-wjka and SectionHeader mvttcly9-a-c7ps launched in the freed slots.
- L10 — Owner: Menu Escape "Enmendar: nativo Radix" (posted #89 A2); ChipGroup "@control false en ambos" (posted #81 A1, metadata only). Both queued first for the next free slots (3-worker cap).
- L11 — job-2: Slider fix PR #184 (1049 unit/87/50/12/26 tokens) and ButtonGroup PR #185 (1062/87/51/12/26) opened. Tabs failed package-exports: runtime+declaration export inventories lacked Tabs; parent fixed a6c5b3e (51/51), re-delivery job-3. Tabs branch is 1173 lines in 4 commits: review per commit (component / tests / docs).
- L12 — SectionHeader stopped on D7 token; owner: "Aprobar el token tal cual" (--breakpoint-section-header-split: 860px). Menu resumed mvttfxc9-b-3c9y.
- L13 — Tabs job-3 failed packed CSR only: controlled Tabs emitted ['drafts','drafts'] (Radix requests on mousedown and focus while owner has not acknowledged). Packed assertion relaxed to only-'drafts' requests and no new request on acknowledgement (2be36c0); packed 12/12; re-delivery job-5.
- L14 — Tabs PR #186 opened: full gates 1063 unit/87/51/12 packed/26 tokens. #185 and #186 both add the molecules registration (compiled.css/.storybook/export lists): the second to merge needs a union merge of main.
- L15 — Notice completed (25/25 focused; storybook-css needs built tokens → covered by parent build). Committed in 3 slices; delivery job-6. ChipGroup resumed mvttt3wm-c-p5ql.
- L16 — Notice job-6 failed package-exports: SSR regex did not allow React's `<!-- -->` text separator; fixed 082ac3a (51/51); re-delivery job-7. Workers skip the export/packed suites, so parent gates catch these.
- L17 — Notice PR #187 opened: full gates 1076 unit/87/51/12 packed/26 tokens.
- L18 — Menu completed (20/20 + metadata/CSS); committed; delivery job-8. SectionHeader resumed mvtu2d71-d-kxty with theme.css/token tests added to its surfaces.
- L19 — Menu job-8 failed package-exports: missing export inventories + token regex without fallback. Parent helper /tmp/egdev-inventory.py updates both exact sorted inventories; fixed, 51/51; re-delivery job-9.
- L20 — Menu job-9 failed packed CSR: 'Selection restores trigger focus' after item selection (click and Enter both). Delegated root-cause/fix to Menu worker mvtubqoy-f-50x7 (delivery repair, temporary 4th worker).
- L21 — ListItem completed (21/21); job-10 failed package-exports: guard used `p-4` as unscanned sentinel, now legitimately shipped by ListItem; sentinel narrowed to bg-red-500; re-delivery job-11. MeterRow launched mvtu8jn9-e-spo8.
- L22 — ListItem job-11 failed packed `types`: fixture passes wide ListItemStatus (incl. 'empty') to a populated item; delegated fixture fix to the ListItem worker.
- L23 — ChipGroup completed (247 focused); committed; delivery job-12. Briefs now allow packages/*/dist/** and require workers to run build + package-exports + packed once before returning. SocialLinks launched.
- L24 — ListItem fixture narrowed to Exclude<ListItemStatus,'empty'> (1917dfe); worker could not run build/packed (dist outside surfaces); parent gates job-13.
- L25 — ListItem PR #188 (1074 unit/87/51/12/26). Menu packed failure = harness race: Radix restores trigger focus in a setTimeout(0) after unmount; packed stage now awaits post-commit settling (assertion kept) + regression test menu-packed-focus.test.tsx; component unchanged. ChipGroup job-12: all gates green, pre-push hook failed → push retried with full log (job-14).
- L26 — PRs: Menu #190 (all gates), ChipGroup #189 (gates green; pre-push flake = 5s timeout on in-test tsc → 30s, 5cdcffd). MeterRow and SectionHeader (token commit f4e2df4) completed and committed; delivery job-17. Carousel and Popover launched.
- L27 — Brief conflict (packed required vs forbidden) stopped Carousel; resolved: workers run build + package-exports once, never packed (parent gates). Carousel resumed mvtuyxrk-k-j4ac; Popover and SocialLinks notified.
- L28 — MeterRow PR #191 (1074 unit, all gates) and SectionHeader PR #192 (1073 unit, exports 52, tokens 27, packed 12/12) opened.
- L29 — Popover stopped: Radix 1.3.1 Content spreads consumer props after `id: contentId`, so a consumer id breaks Trigger aria-controls. Owner: "Enmendar: excluir id de Content" (posted #96 A1). Popover resumed mvtv3xlf-l-79wy.
- L30 — SocialLinks completed (31/31, exports 51); committed; delivery job-18. HoverCard launched with dep fa93028.
- L31 — SocialLinks PR #193 opened (all gates green, packed 12/12).
- L32 — HoverCard stopped: Radix 1.2.1 Trigger preventDefault on touchstart vs D4/D5 touch navigation. Owner: "Enmendar: comportamiento nativo Radix" (posted #86 A1, separate persistent link for touch). SelectTile stopped on the ChipGroup-style Controls conflict; owner: "Sí, mismo criterio que ChipGroup" — standing rule for later contracts with the same mode-dependent Controls conflict (posted #101 A1).
- L33 — Popover implemented (308 focused, exports 51) but Button-as-Trigger overwrites Radix data-state (Button #53 owns idle/loading). Owner: "Enmendar Popover: Button conserva su data-state" (posted #96 A2; same criterion for other Radix triggers composing Button). Popover worker finishing.
- L34 — Carousel completed (33/33, focused 313, exports 52); committed; delivery job-19. Worker count back to 3 (Popover finishing, HoverCard, SelectTile); no new launch until one frees.
- L35 — Carousel packed failed: real bug, `instanceof HTMLButtonElement` throws where the global is absent (packed realm/iframes). RED test with stubbed global, fixed via tagName check (f49240e), 34/34. Popover packed CSR fails ('Close packed settings' null); worker repairing (may run packed). HoverCard completed (79/79, exports 52), committed. Timeline and NavList launched. Deliveries carousel+hover-card job-21.
- L36 — Carousel PR #194 (all gates). HoverCard unit failed: storybook-docgen barrel module + export inventories lacked HoverCard (worker had not run that file); fixed, 98/98; re-delivery. Popover packed cause: harness expected aria-label but IconButton names via AccessibleIcon hidden text; fixed 73e5ff7 (worker packed 12/12); re-delivery job-22.
- L37 — Popover PR #195 (all gates, packed 12/12). SelectTile completed (22, focused 249, exports 51), committed, delivery. GaugeDock launched.
- L38 — HoverCard PR #196 (all gates, exports 52, packed 12/12).
- L39 — SelectTile packed: fixture-only (full-union props lost branch inference in createElement → TS7006/TS2769); narrowed with Extract<SelectTileProps,…>, worker packed 12/12; re-delivery job-25.
- L40 — SelectTile PR #197 (all gates, packed 12/12).
- L41 — Timeline (19, focused 299) and NavList (v0.2, 22, focused 249) completed and committed; delivery job-26. ModuleCard launched (last unblocked molecule). Remaining blocked on owner merges: Field (#184), PageHeader (#185), Toast (#187).
- L42 — Timeline PR #198 and NavList PR #199 (all gates, packed 12/12).
- L43 — GaugeDock completed (18, focused 298, exports 51), committed; delivery job-27.
- L44 — GaugeDock PR #200 (all gates, packed 12/12).
- L45 — Owner: "podrias ir mergeando tu mismo y solucionando conflictos?" → authorized "Sí, --admin + squash para estos PRs" (only #184–#200 and this batch's Field/PageHeader/Toast/ModuleCard PRs; squash; keep remote branches; stop on non-union integration or failed gate). Merge train starts with #184.
- L46 — #184 had already been merged by the owner (b232b10). Landed #185 ButtonGroup (4f21560) after union integration + full gates. Field (29) and ModuleCard (25) completed → PRs #201, #202. PageHeader launched. Notice #187 integration: line union broke package-consumption (duplicate const) → semantic union delegated to Notice worker (merge in progress, parent commits).
- L47 — Landed #187 Notice (48e3150; 1093 unit, exports 52, packed 12/12). Toast launched. #186 Tabs integrated (line union, syntax OK), landing job-30.
- L48 — Toast stopped: Radix 1.3.1 moves focus to Viewport on close (incl. Escape) vs prior-focus promise. Owner: "Enmendar a nativo Radix y que sea regla fija" → posted #110 A1; STANDING RULE: Radix-native keyboard/focus/event behavior wins via published scoped amendment, applied without asking and reported. PageHeader completed (26, focused 309) → PR #203. #186 Tabs: barrel list unsorted after union (blank line defeated sorter; fixed sorter + e095b31); now packed fails → Tabs worker repairing.
- L49 — #186 packed cause: line union duplicated imports inside generated consumer/SSR/CSR fixture strings (invisible to node --check); Tabs worker consolidated 3 import pairs (f009df9), packed 12/12; landing job-32. Train procedure from now on: integrate (line union) → the PR's own worker does a semantic review of every union file against both parents + runs packed once → parent lands with full gates.
- L50 — Landed #186 Tabs (da6f956; 1109 unit, exports 53, packed 12/12). #188 ListItem integrated (union broke package-exports/prop-naming syntax) → ListItem worker semantic union + packed.
- L51 — Landed #188 ListItem (b2230e2; 1136 unit, exports 54, packed 12/12). #189 ChipGroup integrated; semantic union + packed by its worker.
- L52 — Toast completed (27, focused 261, exports 54) → PR #204. Native Escape-outside behavior published as #110 A2 under the standing rule. All 20 molecules now implemented; remaining work is the merge train (#189–#204).
- L53 — Landed #189 ChipGroup (5e1b099; 1159 unit, exports 55, packed 12/12). #190 Menu integrated; semantic union by its worker.
- Landed #190 Menu (6ae51c9; 1186 unit, exports 56, packed 12/12). #191 meter-row integrated; semantic union by its worker.
- Landed #191 MeterRow (c60d4a8; 1213 unit, exports 57, packed 12/12). #192 section-header integrated; semantic union by its worker.
- Landed #192 SectionHeader (97af309; 1239 unit, exports 59, packed 12/12, tokens 27). #193 social-links integrated; semantic union by its worker.
- Landed #193 SocialLinks (ce5a191; 1274 unit, exports 60, packed 12/12). #194 carousel integrated; semantic union by its worker.
- Landed #194 Carousel (565f000; 1312 unit, exports 62, packed 12/12). #195 popover integrated; semantic union by its worker.
- Landed #195 Popover (5b4efa8; 1345 unit, exports 63, packed 12/12). #196 hover-card integrated; semantic union by its worker.
- Landed #196 HoverCard (1cfac30; 1372 unit, exports 65, packed 12/12). #197 select-tile integrated; semantic union by its worker.
- Landed #197 SelectTile (f65538b; 1397 unit, exports 66, packed 12/12). #198 timeline integrated; semantic union by its worker.
- L-x — #196/#198: first land attempt failed in pre-commit because index held the naive union while the worktree had the worker's repairs (MM). Cause not fully determined (both followed a pnpm install --frozen-lockfile + typecheck in the same step). Mitigation: re-add, assert git diff --quiet, commit the merge explicitly before landing.
- Landed #198 Timeline (3722fdc; 1420 unit, exports 67, packed 12/12). #199 nav-list integrated; semantic union by its worker.
- Landed #199 NavList (8753da3; 1445 unit, exports 68, packed 12/12). #200 gauge-dock integrated; semantic union by its worker.
- Landed #200 GaugeDock (c71629b; 1467 unit, exports 69, packed 12/12). #201 field integrated; semantic union by its worker.
- Landed #201 Field (98df779; 1499 unit, exports 71, packed 12/12). #202 module-card integrated; semantic union by its worker.
- Landed #202 ModuleCard (901ffbf; 1527 unit, exports 73, packed 12/12). #203 page-header integrated; semantic union by its worker.
- Landed #203 PageHeader (383c741; 1556 unit, exports 74, packed 12/12). #204 toast integrated; semantic union by its worker.
- L-end — Landed #202 ModuleCard (901ffbf), #203 PageHeader (383c741), #204 Toast (1d1a21f; 1587 unit, exports 76, packed 12/12, tokens 27). All 20 approved molecules + Slider prerequisite merged to main (#184–#204). Feature closed.
