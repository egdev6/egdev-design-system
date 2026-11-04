# Component contract — NotesBoard

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval (G4). A10 itself awaits G1; this snapshot authorizes no implementation.
- **Approval / recovery:** Pending for v0.2. The [v0.1 contract](../v0.1/spec.md), despite its frozen Proposed header, was approved in [#295](https://github.com/egdev6/egdev-design-system/issues/295#issuecomment-6597591171); its [plan](../v0.1/implementation-plan.md) and gates were separately approved in [layer-d records](../../web-catalog/v0.1/layer-d-plan-approvals.md). This draft changes only the promises identified below. Plan approval remains separate.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending`; `visualHashes: VIS-01 Pending; VIS-02 Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/295`; `latestPublishedComment: Pending for this snapshot`.
- **Hash definition:** SHA-256 of UTF-8 canonical payload from the complete `## 1. Purpose and scope` heading line through EOF, with LF and final newline. Tracking metadata above it is excluded. Finalize before publication; approval must identify version, payload and visual hashes.
- **Evidence and limits:** [A10](../../web-catalog/v0.2/visual-amendments.md) and [U8](../../web-catalog/v0.2/implementation-plan.md) are proposals, not observed implementation. Source: `packages/ui/src/organisms/notes-board/{types.ts,useNotesBoard.ts,NotesBoard.tsx,index.ts,NotesBoard.test.tsx,NotesBoard.stories.tsx}` and `packages/ui/src/index.ts`. Previous browser observations in [v0.1 browser check](../v0.1/observed/browser-check.md) do not establish v0.2 conformance.

## 1. Purpose and scope

An `@egdev/ui` organism arranging a host-supplied introduction and topics beside an ordered list of linked notes. It is not a page, section frame, data source, router, filter, archive or effects director. The consumer owns content, chronological ordering, dates and destinations; no Pulso data is built in. The approved web cataloging decision composes existing SectionHeader, static Chip and ListItem: a row variant cannot coordinate the board, a new component or extraction is unnecessary, and repeated application-only composition would duplicate the existing reusable structure. ChipGroup is a selection control, not the static-topic container.

**Exact delta from v0.1 / A10:** change root `items-center` to `items-start`, side `gap-2` to `gap-4`; retain list `gap-2` but recommend `ListItem variant="editorial-divided"` for consecutive notes; demonstrate separation between boards in the host using `flex flex-col gap-16`, not a board margin. All other v0.1 promises remain, including direct list composition, semantics, sticky behavior, responsive boundary, host ownership, public exports and legacy preservation. The preference for divided rows is not a required variant and does not prohibit the previously documented `editorial` rows. Owner request: “NotesBoard -> cuidar espaciados [Image#18]”.

## 2. Anatomy and composition

| Part | Element / responsibility | Content |
| --- | --- | --- |
| `NotesBoard` | Passive `div.eg-notes`; no landmark or board paint | One side followed by one list, supplied by host |
| `NotesBoardSide` | Unpainted `div`, optional sticky positioning | SectionHeader and optional named `ul` of static Chip `li` elements |
| `NotesBoardList` | Native `ol` | Direct consumer `li` elements, including none |
| Row | Consumer-owned `li` with one ListItem `asChild` native anchor | Leading `time dateTime`, body/title, decorative hidden trailing arrow; divided editorial is recommended, editorial remains valid |

No descendant inspection, cloning, extra section or generated heading. No direct Radix primitive is needed for this passive board; ListItem owns its existing Radix Slot behavior. No nested anchor or interactive descendant in a row. `eg-notes` is the stable root marker; legacy `eg-notes__*`, `eg-notes--sticky` and `eg-note*` are not new part-override APIs. Preserve old styles and consumers.

## 3. Public API

| Input | Type | Required / default | Contract |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Required | Root receives one side then one list. This composition is a consumer responsibility, not runtime validation. |
| `sticky` | `boolean` | Optional, `false` | Opt in to sticky side only above 1080 CSS px, subject to host scroll container and clearance. |
| `className` | native `string` | Optional | Root outer margin, width and parent placement only. |
| Side/List `children` | `ReactNode` | Required | Side owns supplied introduction/topics; list receives direct `li` rows or `null` for empty. |

Root inherits compatible `ComponentPropsWithoutRef<'div'>`, omitting `children`, `role`, `style`, `dangerouslySetInnerHTML`; hook also strips the three protected inputs at runtime. Compatible attributes, including `data-*` and `aria-*`, reach the root. Parts accept children only, with no part className, native forwarding, ref or `asChild`; root has no ref or `asChild`. No controlled/uncontrolled interaction, own event, sorting or callback; native forwarded handlers remain native. Public named components and types remain exported via the component and package barrels; no variant recipes are public exports. React 18/19 packed consumption remains a required verification, not inferred from types.

**Naming:** [registry](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md), and [lookup workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry) checked by meaning, name and aliases. Reuse approved `board-sticky-side` → `sticky?: boolean` (default false), no aliases or exceptions; [convention receipt](../v0.1/prop-naming-approval.json) is separate from component approval. Reviewed source: `{path: packages/ui/src/organisms/notes-board/types.ts, symbol: NotesBoardProps, revision: sha256:4edafa0801d22a4ea6c51fee92e21034919a006ea539d1e9ed16366282bd1fa4}`. `children` and `className` are native. `collection-items` / `items` is for structured data, not this composition; `slot-composition` / `asChild` is not a generic child slot. No new or changed own prop, proposal, exception or registry edit.

## 4. Behavior

| Situation | Result / event |
| --- | --- |
| Render, including empty | Side then ordered list in DOM and visual reading order; empty `ol`, no invented message or count cap. No event. |
| Topic labels | Static, not focusable, pressed, selected or filters; genuine navigation may use consumer-supplied link Chips with real destinations. |
| Row activation | Native anchor navigation, one tab stop per row, no board callback or automatic sorting. |
| Width ≤1080px / >1080px | One column side first / two tracks 4fr and 7fr. Sticky disabled at and below boundary. |
| Sticky false / true | Normal flow / side sticks only above boundary using existing token offset; no scroll listener. Host ensures actual header and scroll-container clearance. |

The consumer supplies newest-first order, valid machine-readable dates, localized display, heading rank, accessible names, row destinations and valid semantic children. Long content wraps without clipping or visual reordering; there is no fetch, parsing, selection, live region, animation or automatic routing.

## 5. Accessibility

The host section owns its landmark and `aria-labelledby`; the supplied SectionHeader receives a unique matching `titleId`, e.g. generated by host `useId()`. If its title is blank, avoid a dangling association. The board does not create a second named section or ID. Ordered notes use `ol` and direct `li`; each row has one named native anchor, readable date and title, `time dateTime` with valid ISO date, and an `aria-hidden` decorative arrow. The named, localized topics list has static Chips and no selection role. Tab/Shift+Tab and Enter are native; ListItem owns visible focus. No arrow-key model, focus trap or board announcements. Touch target, contrast, zoom and assistive-technology operation require actual verification; static markup or images do not establish them.

## 6. Appearance

| Axis | Values / default | Rule |
| --- | --- | --- |
| `sticky` | false default / true | Optional side sticky above 1080px; not a visual state or new prop. |
| Size, tone, variant | Not applicable | Board is unpainted; child components retain their own approved treatments. |

**Proposed A10 geometry:** root `grid grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-10 items-start`, with `[@media(width<=1080px)]:grid-cols-1` and `[@media(width<=1080px)]:gap-8`; `gap-10` = 32px and `gap-8` = 25.6px. Side `flex flex-col items-start gap-4 min-w-0`: `gap-4` = 12.8px, replacing `gap-2` = 6.4px. List remains `list-none m-0 p-0 flex flex-col gap-2 min-w-0`. Sticky side retains `sticky self-start top-[calc(var(--nav-height)+var(--space-10))] [@media(width<=1080px)]:static [@media(width<=1080px)]:self-auto`. Host owns inter-board separation; the `MultipleBoards` story uses `flex flex-col gap-16` = 51.2px. This is not an automatic minimum for arbitrary hosts: the documented host composition supplies it. No board-owned outer margin. Verify sticky clearance rather than promising it under every host header.

**Material and files:** board content sits over the host register (Grafito SectionShell is a web example); no new board surface, glass, shadow, halo or painted frame. Composed Chip and ListItem own their existing Material and focus; host chooses appropriate SectionHeader tone. No new token, dependency, inline appearance, dynamic geometry, interpolated utility, handcrafted gradient or shadow. Reduced motion and focus remain child responsibilities. Six meaningful files are `types.ts` (CVA and types), `useNotesBoard.ts` (context, defaults and `cn`), `NotesBoard.tsx` (JSX), `NotesBoard.test.tsx`, `NotesBoard.stories.tsx`, `index.ts`. No extra module. **No stylesheet**: utility-only remains contingent on actual shipped cascade and emission proof; if insufficient, stop and seek an explicitly approved compliant role rather than modifying legacy or using `!important`.

**Merge and cascade:** root `cn(notesBoardVariants(), className)` permits only outer margin, width and parent placement; `twMerge` resolves recognized utility conflicts, not every custom group, variant, stylesheet layer or specificity. It does not authorize arbitrary visual overrides. Side/list use `cn` on their own recipes and expose no consumer className. Legacy `.eg-notes` and historical part/row rules must remain unchanged; avoid old part markers and prove actual packed CSS cascade for new and legacy fixtures. Neither class order nor a class-string assertion proves computed alignment.

### Expected-design visual reference

| ID | Image / scenario | Source and status |
| --- | --- | --- |
| VIS-01 | Pending capture: desktop board with side, topics and consecutive divided rows | Owner Image#18 is conversation provenance only; proposed expected design, capture and approval pending. |
| VIS-02 | Pending capture: stacked boards and narrow single-column composition | Same provenance; proposed, capture and approval pending. |

Agree source, story, conditions and permission before the [capture process](../../../design/README.md): read-only preview, real browser and component-zone PNG with `capture.json`, VIS hashes and separately scoped owner adoption. Capture at 390/1280 and boundary 1079/1080/1081 where applicable, recording viewport, DPR, browser/version, theme, loaded fonts, motion/transparency, crop, date and tool. Owner image has no recoverable file, conditions or hash here; do not infer observations or tokens from it. Historical v0.1 [desktop](../v0.1/notes-board--variants--1280--dark.png) and [narrow](../v0.1/notes-board--variants--390--dark.png) captures remain historical Foundation previews, with conditions/hashes in [v0.1 spec](../v0.1/spec.md) and [capture.json](../v0.1/capture.json); they do not approve v0.2 geometry. Visual conformity **Not evaluated**. Capture does not replace behavioral or accessibility checks.

## 7. Acceptance criteria

All checks are planned, not observed for v0.2. For visual-only spacing use the documented test-first exception and real rendered computed properties plus emitted packed CSS; do not claim a fabricated visual RED. U8 also calls for recipe assertions and preservation tests.

| ID | Promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| NB-01 | Passive root, side then ordered list, empty `ol`, no invented content | Public DOM/order tests; Default, Empty | Pending |
| NB-02 | Host owns unique heading association, no duplicate board landmark | Multi-section ID/name integration test; MultipleBoards, HostSection | Pending |
| NB-03 | Named static topics do not filter, press or add tab stops; genuine links remain native | Role and keyboard test; Topics | Pending |
| NB-04 | Direct `li`, one linked row, valid `time`, readable name and hidden arrow; native focus/activation | DOM and Tab/Shift+Tab/Enter tests; DatedNotes; editorial and divided composition | Pending |
| NB-05 | Supplied ordering and destinations preserved, no parsing/sort/domain copy | Rerender/public link test | Pending |
| NB-06 / A10-AC3 | 4:7 above 1080, single column at and below, wrapping with no clipping | Built CSS and real browser 1079/1080/1081 and fractional boundaries, 390/1280, long content and 200% zoom; VIS-01/02 | Pending |
| NB-07 / A10-AC4 | Sticky offset unchanged, false default, static at/below boundary; host owns clearance | Preserve recipe and browser scroll/resize with real fixed bar and scroll ancestor | Pending |
| NB-08 | Legacy collision avoidance and unchanged old consumers | Computed shipped/packed styles with new and legacy fixtures, including imports and row hover/focus | Pending |
| NB-09 | No board paint; existing child Material, typography, focus, reduced motion and token use preserved | Packed CSS and browser paint, contrast, focus/preferences, Grafito host | Pending |
| NB-10 | Named exports, safe native forwarding/exclusions and root-only layout merge; no part override or ref API | Types, DOM, docgen/Controls and packed React 18/19 tests without consumer Tailwind | Pending |
| A10-AC1 | Above 1080px side top aligns with first row; side `gap-4` | Root/side own recipe assertions and real own-element computed geometry in Default and Sticky at 1081/1280, accounting for sticky scroll state; VIS-01 | Pending |
| A10-AC2 | Host example separates stacked boards by ≥51.2px and second heading does not touch prior rows; list retains `gap-2` and divided row preference | MultipleBoards host `gap-16` and row composition; real bounding boxes and computed gap at 390/1280; VIS-02 | Pending |

### Closure and owner decisions

- [ ] Obtain G1 exact amendment and G4 exact v0.2 snapshot approval, including identified visual references and their hashes. No approval is inferred from a draft or historical reference.
- [ ] Agree visual source/scenarios/conditions and authorize a real capture; alternatively provide a recoverable owner reference with verifiable provenance. Without either, visual adoption and conformity remain pending.
- [ ] Verify utility emission and shipped cascade against legacy and actual packed consumer; if insufficient, return concrete scoped styling alternatives for approval, not a silently invented stylesheet.
- [ ] Publish a later snapshot only via separately authorized comment on #295, with full recoverable payload and exact identity; preserve all v0.1 artifacts. A separate approved implementation plan is required before source work.
