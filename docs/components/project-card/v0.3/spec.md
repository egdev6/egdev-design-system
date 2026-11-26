# Component contract — ProjectCard (v0.3 amendment: header-row status)

- **Version / status:** 0.3 — **Approved** on 2026-11-25 (owner, in conversation: "Aprobar con recomendaciones (Recomendado)"; record: [approval.md](approval.md)). Amendment to the approved v0.2; specified, not implemented. It answers consumer request [#558](https://github.com/egdev6/egdev-design-system/issues/558) and covers S3 and S5 of `odd/tasks/pulso-consumer-requests.md`. This approval authorizes no implementation.
- **Approval / recovery:** Approved for the exact payload identified in the snapshot identity below (record: [approval.md](approval.md), which quotes the owner's answer verbatim and binds it to the draft committed in `01ff388` with its recommended answers D1–D4 folded in). Gate 1, cataloging, is approved: the owner's choice "Aprobar las cuatro (Recomendado)" (`odd/tasks/pulso-consumer-requests.md` L3) fixed #558 as a ProjectCard API variant: "A header-row status part or slot that takes a Badge." The choice between part and slot (D2) and every contract below are resolved by the spec approval (gate 2, L5). The implementation plan (gate 3, `component-contributor`) needs its own approval, and approving an earlier gate authorizes no code (S5). Effective baseline: the [v0.1 spec](../v0.1/spec.md) with its [decorative-index approval](../v0.1/decorative-index-approval.json), and the [v0.2 spec](../v0.2/spec.md) with its [approval record](../v0.2/approval.md). The record's SHA-256 `f4b7c7bf56d8189727ea9727aae5ef80529344d39c91bdce2201327e2131065a` equals the whole-file hash of `v0.2/spec.md` in this working tree (verified), so the `DRAFT` line in v0.2's header is historical. Agreed spec location: this file, drafted by ODD task T3 (committed in `01ff388`) and finalized by this approval; the finalized bytes are left uncommitted for the parent.
- **Current situation / pending decisions:** Existing component. Verified in the working tree: `ProjectCard.tsx:41-58` renders `index` and `eyebrow` as flow siblings of the heading in both header branches (`:47` upper zone, `:54` plain) and offers no slot for a status; non-part `children` land in the body (`useProjectCard.ts:61`, `:162`; `ProjectCard.tsx:59`); `eyebrow` is `string`. Everything in sections 2–7 is an approved contract; none of it is implemented. Resolved on 2026-11-25: owner decisions D1–D4, as recommended (closing section). Pending and outside this approval: visual authorization V1 (no visual capture exists) and the implementation plan (gate 3).
- **Snapshot identity:** `version: 0.3`; `contentSHA256: 21ae2a49d8b187b6120d7c626c7ba0dbff51a94519f7b8adb6d8c33857636470`; `visualHashes: Pending (VIS-01 to VIS-05 are not captured)`; `approvalReference: docs/components/project-card/v0.3/approval.md (owner answer "Aprobar con recomendaciones (Recomendado)", 2026-11-25; odd/tasks/pulso-consumer-requests.md L5)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/275` (ProjectCard's single component issue, as in v0.2; #558 is the consumer request that triggered this amendment, not a second component issue); `latestPublishedComment: Pending for v0.3 (a later, separately authorized comment on #275; nothing is published)`.
- **Hash definition:** SHA-256 of UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading through EOF including the final newline; metadata above is excluded. Finalize before publication; approval must bind the exact payload and the identified visuals.

## 1. Purpose and scope

- **Need:** On the Lab experiment card, a status such as "testing" (warning tone with an alert icon) must sit in the card's header row, next to the "EXPERIMENTO 014" index (#558; Pulso reference `.row` = label + `.chip.warn`, see section 6). ProjectCard has nowhere to put it today. Current consumer mitigation: none; the element is not shown yet (#558).
- **Non-goals:** no built-in status word, icon, tone or status enum (the lifecycle `status` convention is a different concept); no interactive status (button, link, filter, tooltip trigger), live announcement, state machine or `data-state`; no new component, exported part, token, dependency, stylesheet or Material recipe; no change to index/eyebrow semantics or their stacked order, to Backdrop, Mark, Tags, Code or Footer, or to the passive whole-card contract; no `status` prop and no API change on LabStage; no layout contract for several statuses (the slot holds one Badge composition); no release or version decision.
- **Cataloging decision / alternatives:** approved at gate 1 (L3): **API variant** of the existing molecule. The walk through the cataloging order:

| Step | Result | Evidence |
| --- | --- | --- |
| Reuse as is | Fails | No header-row slot exists (`ProjectCard.tsx:47`, `:54`; #558). |
| Appearance variant | Fails | An appearance axis cannot carry consumer content. |
| Compose with today's public API | Fails, four routes | (1) `children` land in the body after the heading: `partition` extracts only Backdrop and Mark (`useProjectCard.ts:61`) and the rest is body (`:162`). (2) `eyebrow` is `string` only, and the registry's `heading-eyebrow` says to avoid status text. (3) `ProjectCardMark` / `ProjectCardBackdrop` are upper-zone media; supplying either switches the card to the recessed-well upper zone (`ProjectCard.tsx:41`, `useProjectCard.ts:129-134`), and the mark is `self-end` above the index. (4) An app wrapper cannot enter the card's header row. |
| Extract / new | Not warranted | One passive slot adds neither a responsibility nor an interaction pattern. |
| **API variant (approved)** | **Chosen** | Additive optional prop on the same responsibility. `docs/CATALOGACION.md` says a variant stops being one when it introduces another responsibility or interaction pattern; neither applies. |

- **Shape inside the approved envelope — slot prop or exported part (resolved: D2 (a), approved 2026-11-25):** a ReactNode slot prop, `statusBadge`.

| Criterion | Slot prop `statusBadge` (approved) | Exported part (for example `ProjectCardStatus`) |
| --- | --- | --- |
| Header inputs | The header is prop-driven today (`title`, `eyebrow`, `index`); the slot keeps header = props, body = child parts. | The only header input supplied as a child. |
| Registry and sibling | Reuses the approved `leading-status-badge` → `statusBadge` already on NowCard (`NowCardProps`), the sibling web-catalog card. | The same concept would be a prop on NowCard and a part on ProjectCard. |
| Detection | Explicit; the card never inspects children. | `partition` identifies parts by `child.type` identity (`useProjectCard.ts:61`): a wrapped or re-exported part silently lands in the body. |
| Duplicates | Impossible. | Needs a first-wins plus development-warning rule, as v0.2 defined for Backdrop and Mark. |
| Surface touched | One own prop (docgen, controls and story pins). | New export, type and docgen entry, a `scripts/storybook-mcp-exceptions.json` composed-part entry (`:103-120` hold today's five), and the exported-name allowlists (`scripts/package-exports.test.mjs:5897-5902`, `packages/ui/src/lib/storybook-docgen.test.ts:2184-2189`). |
| `className` | No consumer class surface on the row; the Badge keeps its own. | A new part `className` surface and merge tests. |
| Fit with v0.2 | v0.2's owner choice "Hijos por tipo" concerned decorative media for the upper zone; a short, meaningful status label is a different category. | Matches Backdrop and Mark mechanics. |

The part route was viable and more uniform with Backdrop/Mark mechanics; the owner approved the slot (D2 (a)) for the registry precedent, the smaller pinned surface and the absence of type sniffing. LabStage was also considered and rejected as the host: it hosts consumer experiment content through `children` and paints no card (`LabStage.stories.tsx:8`; LabStage v0.1 section 2 says the consumer owns status).

- **Evidence / level and package:** the molecule stays in `@egdev/ui`, `packages/ui/src/molecules/project-card/`. Inspected: `types.ts` (`ProjectCardProps` `:48`; recipes `:163-172`, `:242`), `useProjectCard.ts` (`:61`, `:82`, `:129`, `:134`, `:162`), `ProjectCard.tsx` (`:20-62`), `index.ts`, `ProjectCard.test.tsx`, `ProjectCard.stories.tsx`; `packages/ui/src/index.ts:86-103` (exports ProjectCard, its parts and types); the Badge API in `packages/ui/src/atoms/badge/{types.ts,useBadge.ts}` (tones `neutral | info | success | warning | danger | brand`, variants `soft | solid`, decorative `icon` wrapper `aria-hidden`, `whitespace-nowrap` label); `packages/ui/src/atoms/icon/types.ts` (an `alert` glyph exists); the NowCard precedent `packages/ui/src/molecules/now-card/{types.ts,useNowCard.ts,NowCard.tsx}` with its [badge-order amendment](../../now-card/v0.1/badge-order-amendment.md); `packages/ui/src/organisms/lab-stage/{LabStage.tsx,LabStage.stories.tsx}` (the experiment card is consumer `children`, `:9-18`).

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Root `eg-project-card` | Unchanged: raised article frame named by the generated heading | `article` | Unchanged |
| Header row (new, internal) | Lays the lead group and the status on one wrapping row. Rendered only when `statusBadge` is present; otherwise absent and the markup is today's | `div` | Lead group and status wrapper |
| Lead group (new, internal) | Keeps index over eyebrow exactly as today inside the row. Rendered only with a status and at least one of index or eyebrow | `div` | The existing index `span` (`aria-hidden`) and eyebrow `span`, same order |
| `eg-project-card__badge` (new, approved public marker) | Holds the supplied status node verbatim and pins it to the inline end of the row | `div` | One consumer-supplied non-interactive node, typically a Badge; no interactive descendants |
| Index, eyebrow, heading | Unchanged elements, classes and relative order; only their parent changes when a status is present | `span`, `span`, `h2`–`h6` | Unchanged |
| Backdrop, Mark, Tags, Code, Footer | Unchanged | Unchanged | Unchanged |

DOM order with a status (without one, the card renders exactly as v0.2 does):

Plain branch (no Backdrop or Mark):

```text
article
├─ div            header row (only with a status)
│  ├─ div         lead group (only with an index or an eyebrow)
│  │  ├─ span     index (aria-hidden)
│  │  └─ span     eyebrow
│  └─ div.eg-project-card__badge   the supplied node, verbatim
├─ h2–h6          heading
└─ …              body children, unchanged
```

Upper-zone branch (Backdrop and/or Mark supplied):

```text
article
├─ div            upper zone (well; Backdrop and scrim when supplied)
│  └─ div         content wrapper
│     ├─ Mark     (if supplied)
│     ├─ div      header row (same contents as in the plain branch)
│     └─ h2–h6    heading
└─ …              body children, unchanged
```

- **Radix / composition:** none; the card is passive and has no interaction to delegate. No `asChild`; the card never clones, inspects or reorders the supplied node. ProjectCard does not import Badge: the consumer composes it, so no new dependency edge appears. The wrapper is a `div` (NowCard's equivalent is a `span`) because it is a flex item of a card-owned row and may hold any flow content; the observable parity is the prop name and the marker suffix, and the element type is internal.
- **Public markers:** `eg-project-card`, `eg-project-card__tags`, `eg-project-card__code` and `eg-project-card__foot` are preserved. New marker (approved, D4 (a)): `eg-project-card__badge`, mirroring `eg-now-card__badge`, present only when a status is rendered and documented like the other part markers. The row and the lead group stay unmarked internal layout, like v0.2's upper-zone wrappers, and are not override surfaces. No legacy consumer or class is migrated.

## 3. Public API

- **Prop conventions:** looked up in the [canonical registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning and by name; no registry entry declares aliases, so there were none to match. Result: **reuse `leading-status-badge` → `statusBadge`** (`ReactNode`, component-specific type). The convention is approved (`docs/components/now-card/v0.1/leading-status-badge-approval.json`, scope `convention:leading-status-badge`, contentHash `sha256:221da6cbb0929f0346735d2436b0be6f0d869ccd5c2a9c3ec02ee7e482b6b900`); the registry lists NowCard as its only usage.

| Candidate entry (prop name) | Registry meaning | Verdict for ProjectCard |
| --- | --- | --- |
| **`leading-status-badge` (`statusBadge`)** | Optional consumer-supplied non-interactive status node rendered before a component's primary heading, "without inspecting child content" | **Reused.** ProjectCard is a heading-owning content card and the node renders before its heading. |
| `item-presentation-status` (`status`) | Lifecycle presentation enum expressed through `data-state` | Different meaning and type; `status` stays reserved for it (NowCard's amendment reached the same conclusion). |
| `header-status-text` (`statusText`) | Plain-text note beside a panel heading | Text only; the request needs tone and icon. |
| `heading-eyebrow` (`eyebrow`) | Short contextual text; avoid lists status text | Rejected, as at gate 1. |
| `thumbnail-badge` (`badge`), `cover-badge` (`coverBadge`; exceptions `badge` for TipCard and ArticleFeatureCover) | Text annotations over thumbnails or covers | Different meaning; `badge` is already bound. |
| `corner-badge-icon` (`badgeIcon`), `leading-icon` (`icon`) | Decorative glyphs | The status carries meaning. |
| `panel-header` (`header`), `trailing-actions` (`actions`) | A whole header region; action content | ProjectCard generates its header; a status is not an action. |
| `surface-material-tone` (`tone`) | Color family | Belongs to the supplied Badge (`BadgeTone`); ProjectCard owns no tone. |

  Reusing the entry changes no convention text, so its hash and approval are untouched (usage observations are excluded from the convention hash); this spec proposes a ProjectCard **usage only**, no new concept and no exception. **D1 reading:** the entry says "rendered before a component primary heading" and lists "trailing content" under avoid. This spec reads "trailing" as content placed after the heading in DOM and reading order (the entry's own ID is `leading-status-badge` and its meaning is "before a component primary heading"), and the slot renders before the heading even though it sits at the inline end of the row. The owner resolved D1 as (a) on 2026-11-25: this reading is adopted for ProjectCard's usage. It edits no convention text, so the entry's hash and approval stay untouched; it is neither a convention amendment nor a global approval of other placements, and convention approval stays independent of this spec's approval.
  Reviewed source for existing mappings: `packages/ui/src/molecules/project-card/types.ts`, symbol `ProjectCardProps`, whole-file `sha256:cb2a69d2c7975fa744140c563e26d8bced5540a3b50acf0c4ec484256252222c` (current working tree; equals the revision recorded for ProjectCard's existing usages). Precedent: `packages/ui/src/molecules/now-card/types.ts`, `NowCardProps`, whole-file `sha256:d768d4f65946cd57aa2c526df0c7efde91952eb62dc9ee010b5c858078e4b5c3`. The ProjectCard usage `{ component: ProjectCard, type: ReactNode, status: existing, source: { path: packages/ui/src/molecules/project-card/types.ts, symbol: ProjectCardProps, revision: sha256 of the post-implementation file } }` cannot be recorded now, because the prop does not exist and the hash would be invented; the plan appends it (PC-S12). Not edited by this task: the registry JSON, the generated view and `scripts/prop-naming.test.mjs`.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `statusBadge` (new) | `ReactNode` | no | None. `undefined`, `null`, `true` and `false` render nothing (no row, no wrapper, no marker); any other node, including `0`, renders verbatim | Consumer-supplied non-interactive status node, typically one Badge composition, rendered in the header row at the inline end, after the index/eyebrow lead and before the heading. No interactive descendants, no built-in word, no tone ownership. |
| `title`, `level`, `eyebrow`, `index`, `variant`, `size`, `children`, `className` | Unchanged | Unchanged | Unchanged | See v0.2 section 3; `eyebrow` stays `string` (a status is not an eyebrow). |
| `ProjectCardTags`, `ProjectCardCode`, `ProjectCardFooter`, `ProjectCardBackdrop`, `ProjectCardMark` | Unchanged | Unchanged | Unchanged | No new exported part, type or constant; new CVA recipes stay private to the module, like today's. |

Proposed JSDoc for `types.ts` (English; `@control false` for a ReactNode per the shared contract; no `@default`, because absence is derived):

```ts
/**
 * Optional consumer-supplied non-interactive status node, typically a Badge composition, rendered
 * in the card's header row at the inline end, after the index and eyebrow and before the heading.
 * Absent, null or boolean renders nothing and creates no row. No interactive descendants, no
 * baked-in status word, no tone ownership.
 * @control false
 * @controlReason ReactNode is not serializable; see the WithStatus story for the supplied Badge composition.
 */
statusBadge?: ReactNode;
```

- **Native props / refs:** unchanged. The root forwards native `article` attributes except the protected set in v0.2; the hook removes `statusBadge` from the native rest so it never reaches the DOM. No ref and no `asChild`. `aria-describedby` is forwarded natively, which enables an optional consumer pattern (section 5); the card generates no description id.
- **Controlled / uncontrolled:** Not applicable; no owned state.
- **Compatibility:** additive optional prop. No existing prop, part, export, marker or token is removed, renamed or changed, and without a status the markup equals today's (guarded by the existing byte-equality test, `ProjectCard.test.tsx:73`). Existing usages in this repo (`LabStage.stories.tsx`, `WebTemplate.stories.tsx`) and any consumer that omits the prop render unchanged by construction (PC-S2); consumer application code was not inspected. Release and version impact is decided separately (`docs/distribution/versioning.md`). No React-19-only API is used; React 18/19 packed consumption remains a plan gate, not a claim from types.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| No `statusBadge`, or `undefined`, `null`, `true`, `false` | Markup identical to the v0.2 card: no row, lead group, wrapper or `eg-project-card__badge` | none |
| `statusBadge` with `index` and `eyebrow` | One header row before the heading: lead group (index over eyebrow, as today) at the inline start, status wrapper at the inline end | none |
| `statusBadge` with `index` only, or `eyebrow` only | The lead group holds that single element; status at the inline end | none |
| `statusBadge` only | The row holds only the status wrapper at the inline end; no empty lead placeholder | none |
| `statusBadge` with Backdrop and/or Mark | Inside the upper content wrapper: Mark (if any), then the row, then the heading; the row sits over the backdrop and scrim like the index and eyebrow do today; one scrim, first-part-wins rules unchanged | none |
| `variant="featured"` or `size="sm"` | `featured` does not touch the row or the status; at `sm` the lead's index-to-eyebrow gap keeps the surrounding density step; nothing is hidden | none |
| Narrow host or longer status label | The row wraps: the status drops to its own line at the inline end. The card never truncates, clamps, clips or scales the Badge | none |
| Status added then removed on rerender | Row, lead group and wrapper appear and disappear with the prop; index and eyebrow return to being flow siblings of the heading; nothing stale remains | none |
| Hover, focus or click on the status | No effect: no handler, tab stop, cursor change or event | none |
| Blank title | Unchanged: development warning and nothing rendered, including the status | none |

- **States / representation:** no own state and no new root `data-*`; `data-variant` and `data-size` are unchanged. NowCard added `data-badge` only because its heading padding depends on the badge; here spacing comes from flow gaps, so none is proposed. No state is mirrored into classes.
- **Limits / consumer responsibilities:** the consumer supplies short, localized, visible status text and its tone and icon; keeps the node non-interactive and focus-free; owns legibility over a backdrop (Badge `variant="solid"` is one option); and owns any announcement of status changes. The card does not inspect, validate or warn about the supplied node, as for NowCard. A Badge label is non-wrapping by the Badge contract, so a label wider than the card's content box overflows its row, and the card's legacy `overflow: hidden` (`.eg-project-card` in `legacy/bundle.css`) clips whatever passes the card's padding edge, so only the padding beyond the content box stays visible; supply short labels and a host that reserves space. Several Badges in one fragment render verbatim with no layout promise.

## 5. Accessibility

- **Accessible name / roles / relationships:** unchanged. The article is named only by its generated heading (`useId()` and `aria-labelledby`); neither the eyebrow nor the status is part of the name. The row, lead group and wrapper are generic elements with no role, `aria-*` or list semantics. The index stays `aria-hidden`; the eyebrow stays exposed (v0.2 approval). The card never hides the status. Optional consumer pattern, not implemented by the card: native `aria-describedby` on the card pointing at an `id` on the Badge adds the status to the article's description (the root forwards `aria-describedby` and Badge forwards `id`).
- **Reading order:** DOM order equals visual order and no CSS `order` is used: eyebrow, status, heading (the index is hidden). Layout uses logical start and end, so the same holds in right-to-left (meaningful sequence).
- **Status is visible text, not color alone:** the supplied Badge's visible label carries the meaning; tone is supplementary and the Badge's decorative icon wrapper is `aria-hidden` (Badge contract, `useBadge.ts:29`). An icon-only or color-only status is outside this contract; the card cannot enforce that at runtime and does not claim to (use of color).
- **Keyboard / focus:** none added. The status is non-interactive and focus-free, so the tab order is still only the body and footer controls the consumer supplies, in both branches.
- **Announcements / other conditions:** none. No live region and no announcement on change; announcements belong to the host, as the Badge contract says. Touch targets: Not applicable (non-interactive). Contrast of the Badge on the card's raised surface is the Badge's contract; over a backdrop and scrim the consumer owns legibility (v0.2 section 6) and contrast is Not evaluated until observed in a real browser. No motion is added, so reduced motion has nothing to remove.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `variant` | `default`, `featured` | Unchanged | The status is unaffected; the consumer picks the Badge tone and variant |
| `size` | `md`, `sm` | Unchanged | `sm` keeps all content; the lead's internal gap follows the same density step as the surrounding flow |
| `level` | 2–6 | Unchanged | Semantics only |
| Status presence | Derived from `statusBadge`; not a prop or CVA axis | The row exists only with a status | No status-specific tone, size or placement variants |

- **Tokens / Material:** layout only. The row, lead group and wrapper paint nothing (no background, border, shadow, gradient or radius), so no Surface composition or Material recipe is needed; the Badge keeps its own paint (soft warning composes `text-status-warning border-status-warning/30 bg-status-warning/8` with `shadow-edge`). Recipes live in `types.ts` as private CVA with token-backed utilities only, composed per part with `cn()` in the hook; no inline style, hardcoded value, new token or Tailwind default is proposed. Responsibilities, with an illustrative token-backed set whose final class strings belong to the plan: row = wrapping flex, cross-axis centered, one gap step (`gap-3`, the step the footer already uses), `min-w-0`; lead = `flex flex-col min-w-0` with the surrounding flow's gap (md and the upper zone `gap-4`, sm `gap-3`, as today); wrapper = `flex min-w-0 max-w-full ms-auto` (logical `ms-auto` pins the inline end even when the row wraps or has no lead). The Pulso `.row` gap is 12px, which is not a token step (`--space-3` is 9.6px, `--space-4` is 12.8px): the token step is an allowed difference, chosen against the captures, never inferred from pixels.
- **Dynamic geometry:** Not applicable; no limited geometry exception is requested.
- **Class composition / consumer layout:** root `className` is unchanged: layout only, merged last with `cn()`. No new `className` surface: the row, lead group and wrapper are card-owned recipes, not override surfaces, and there is no `statusClassName`. The supplied Badge merges its own `className` inside Badge (outer margin, alignment and flex layout only); the card never clones the node, so it merges nothing into it. `twMerge` resolves recognized utility conflicts among the classes of one element only; the wrapper and the Badge are separate elements. Tests: PC-S10.
- **Files / pending proposals:** the six mandatory files keep their roles.
  - `types.ts`: the `statusBadge` prop with its JSDoc, plus private CVA recipes for the row, the lead group (density axis) and the status wrapper (marker `eg-project-card__badge`); recipe names are the plan's to choose.
  - `useProjectCard.ts`: removes `statusBadge` from the native rest, derives presence with NowCard's rule (`undefined`, `null` and boolean are absent, no content inspection), and exposes the node plus typed part props and class names; no JSX.
  - `ProjectCard.tsx`: JSX for the row in both branches (`:41-58`), JSX only; the branches may share one local fragment.
  - `ProjectCard.test.tsx` and `ProjectCard.stories.tsx`: new cases and stories (`WithStatus`, `StatusPlacements`, `StatusOverBackdrop`, `StatusInNarrowCard`) plus meta text naming the consumer-supplied Badge.
  - `index.ts`: unchanged (no new export).
  - **No stylesheet.** No additional internal module, token, dependency or Material recipe.
  - Collateral the plan must review, none edited here: `packages/ui/src/lib/storybook-docgen.test.ts` (own-prop count `:1395`, story-name list `:1479-1488`), `packages/ui/src/lib/storybook-controls.test.ts` (`projectcard` controls `:385-394`, count `:805`), `scripts/package-exports.test.mjs` (`:5228-5300`), `scripts/package-consumption.test.mjs` (`:1666-1711`), `scripts/prop-naming.test.mjs` (post-receipt pairs near `:736-760`, usage assertion `:3432-3433`), `skills/_shared/prop-naming.json` with `docs/prop-naming.md`, generated `packages/system/design-system.json` and `packages/system/system.md`, and optionally `packages/ui/src/organisms/lab-stage/LabStage.stories.tsx` (`:9-18`) to show the status in the Lab experiment composition without changing LabStage.

### Expected-design visual reference

Follows the [capture guide](../../../design/README.md). No image exists; nothing below is a captured or approved image.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending. Alt text on capture: "Pulso Lab experiment card with the EXPERIMENTO 014 label at the start of the header row and a warning chip reading testing, with an alert icon, at the end." | Principal scenario, expected design: reference `article.exp`, desktop | `egdev-website/egdev-foundation/reference-web/pulso-source.html` (read-only, outside this repo; whole-file SHA-256 `778e5412b64d1b79195c51c0e47c78f654b46da445be8354a97e572774348f13`): markup `:1050-1058` (row `:1051-1054`), CSS `.chip` `:82`, `.chip .i` `:83`, `.chip.warn` `:85`, `.exp` `:341`, `.exp .row` `:342`, `.exp .no` `:343-344` | Proposed; capture and approval Pending |
| VIS-02 | Pending. Same zone at narrow width. | Additional scenario, expected design: `article.exp` inside the `@media (max-width:560px)` block that opens at `:528` (`.exp{padding:20px}` at `:546`) | Same file and hash | Proposed; capture and approval Pending |
| VIS-03 | Pending, after implementation. | Observed: Storybook `WithStatus` (`index` and `eyebrow` plus a warning Badge with the alert icon), `md` | Story id and commit recorded at capture | Observed, never expected design; Pending |
| VIS-04 | Pending, after implementation. | Observed: `StatusPlacements` (status only, eyebrow only, index only, `sm`) and `StatusInNarrowCard` | Story ids and commit at capture | Observed; Pending |
| VIS-05 | Pending, after implementation. | Observed: `StatusOverBackdrop` (Backdrop, Mark and status) | Story id and commit at capture | Observed; Pending |

- **Conditions / provenance per VIS ID (proposed, to agree under V1):** Chromium through Playwright MCP; viewport 1280×1400 for VIS-01, VIS-03 to VIS-05 and 390×844 for VIS-02 and the narrow case; device scale 2; dark theme (Pulso declares `color-scheme:dark`); element-level component-zone crop (`article.exp` or `article.eg-project-card`); fonts loaded before capture (Pulso: Barlow and Barlow Condensed; the design system's own fonts for observed shots). The reference hides the card until it reveals (`.js [data-reveal]` `:468-469`, reduced-motion override `:477-480`), so capture after `.in` is applied and record the motion preference used. Record tool, version, date, crop and SHA-256 in `capture.json` under this directory when captures exist. Hosting the reference read-only or running a harness needs separate permission (guide step 1).
- **Intent / acceptance / pending evidence:** intent: one header row, label block at the start and the warning status at the end, vertically centered as in the reference `.row` (`align-items:center`); the vertical alignment against a two-line lead (index over eyebrow) is a pending visual decision, not inferred. The Badge's soft warning uses the same alpha steps as `.chip.warn` (border 0.3, background 0.08), read from the two sources; equality of `--warning` and `--color-status-warning` is not asserted. Proposed allowed differences, pending owner adoption: the design system's stacked index over eyebrow versus the reference's inline "EXPERIMENTO 014" label (v0.2 anatomy, out of scope here); glass versus tonal Material (v0.1); token steps versus reference pixels. Related AC: PC-S1, PC-S3, PC-S9, PC-S14. Missing: source authorization, captures, conditions, approval.
- Without recoverable approved references and comparable conditions, visual conformity is **Not evaluated**. Captures do not replace behavior or accessibility tests.

## 7. Acceptance criteria

All checks below are planned, not observed. `PC-S*` extends v0.2's `PC-01` to `PC-16`.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| PC-S1 | Given `index`, `eyebrow` and `statusBadge={<Badge tone="warning" icon={<Icon name="alert" />}>testing</Badge>}`, the status sits in one `.eg-project-card__badge` inside the header row that also holds the index and eyebrow, after them and before the heading; the Badge keeps `data-tone="warning"` (S3) | `ProjectCard.test.tsx`: render, `compareDocumentPosition`, row membership via `closest` | `WithStatus`; VIS-01, VIS-03 | Pending |
| PC-S2 | With `statusBadge` `undefined`, `null`, `true` or `false`, the markup equals today's and no `.eg-project-card__badge` exists; the existing child-order assertions stay valid; rerendering from a status to none restores today's markup with no stale row or marker; `0` is treated as present and renders (no content inspection) | `it.each` over the four values extending the `renderToStaticMarkup` equality case (`:73`); a rerender case; a `0` case | Not applicable (no visual change) | Pending |
| PC-S3 | The lead group appears only with an index or an eyebrow; no empty placeholder; the status is the last element of the row and is pinned with a logical end margin (`ms-auto`, no physical side margin); index stays above eyebrow | DOM-structure tests for index+eyebrow, index only, eyebrow only, neither; class assertion on the wrapper | `StatusPlacements`; VIS-04 | Pending |
| PC-S4 | With Backdrop and Mark plus a status, the upper content order is Mark, row, heading; the row is inside the upper zone; one scrim; the status is not duplicated in the body; first-part-wins is unchanged; a Mark-only card places the row in the upper zone too | Extend the upper-zone tests (`:105`, `:145`) | `StatusOverBackdrop`; VIS-05 | Pending |
| PC-S5 | The article name stays the heading text only; the status text is exposed (not `aria-hidden`); the wrapper has no role or `aria-*`; the Badge's icon wrapper is `aria-hidden`; DOM order is eyebrow, status, heading with no `order-*` utility on the row, lead group or wrapper | `getByRole('article', { name })` exact name; attribute assertions on wrapper and icon; `compareDocumentPosition` and class assertions | Not applicable | Pending |
| PC-S6 | The status adds no tab stop, handler, hover utility or pointer cursor; the tab order with a body link and the footer action is unchanged in the plain and upper-zone branches | `userEvent.tab()` sequences in both branches; class assertions on the wrapper (extending `:321`) | Not applicable | Pending |
| PC-S7 | `statusBadge` never reaches the `article` as an attribute and raises no unknown-prop warning; protected semantics are still removed; a consumer `aria-describedby` is forwarded | `renderHook(useProjectCard)` `rootProps` check, DOM attribute check, `console.error` spy | Not applicable | Pending |
| PC-S8 | At `sm` the lead keeps the density gap step (`gap-3`, md and upper zone `gap-4`) and all content renders; `featured` leaves row and wrapper recipes unchanged | Targeted class assertions per size and variant, no full class snapshot | `StatusPlacements` at `sm` | Pending |
| PC-S9 | In a narrow host the row wraps, the card adds no truncation, clamp or clipping utility, and a realistic label such as "testing" causes no horizontal overflow at 390 px | Extend the narrow-host class scan (`:290`); real-browser geometry check (`scrollWidth <= clientWidth`, status inside the content box), separately authorized | `StatusInNarrowCard`; VIS-02, VIS-04 | Pending |
| PC-S10 | Root `className` still merges last with a status present; no row or wrapper class surface exists (own props go from 8 to 9; no `statusClassName`) | Render with `className` and `statusBadge`; docgen own-prop count | Not applicable | Pending |
| PC-S11 | `statusBadge` has English JSDoc, `@control false` with a concrete `@controlReason`, is optional and has no `@default`; the pinned counts, controls row and story-name list match | Update `storybook-docgen.test.ts` (PC-10 case) and `storybook-controls.test.ts` rows; metadata diagnostics empty | New stories listed in the pinned name list | Pending |
| PC-S12 | `leading-status-badge` gains exactly one ProjectCard usage (`ReactNode`, `existing`, source path, symbol and the post-change `types.ts` hash); convention text, hash and approval are unchanged; the generated view is regenerated | `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`, with the pairs list and `:3432-3433` assertion updated | Not applicable | Pending |
| PC-S13 | The built package renders the status and marker only when supplied; TypeScript accepts `statusBadge`; no new export, token, dependency or stylesheet appears; the emitted CSS contains every utility the new recipes use; no `style` attribute and no non-token arbitrary value | Extend the packed SSR test and typed consumer sample; static CVA scan and emitted-CSS check without a Tailwind compiler in the consumer; React 18 and 19 matrices as the existing gates run | Not applicable | Pending |
| PC-S14 | Observed captures match the approved references under the same conditions, or each difference is explained and mapped to an acceptance ID | Playwright MCP component-zone captures plus `capture.json`, separately authorized | VIS-01 to VIS-05 | Not evaluated (no capture, no approval) |
| PC-S15 | All v0.1 and v0.2 promises hold: `PC-01` to `PC-16` and the existing ProjectCard tests pass unedited except the pinned counts and story list; a blank title with a status still renders nothing and warns once; LabStage tests and API are unchanged | Run the full ProjectCard, LabStage and metadata suites; one blank-title-with-status case | Not applicable | Pending (nothing run in this task) |

### Spec closure

- [x] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain. *Met: blocks are complete; D1–D4 were resolved on 2026-11-25.*
- [x] New/changed own props have registry lookup evidence, exact applied/proposed IDs and reviewed exceptions; convention approval remains explicit and separate. *Met: lookup and reuse of `leading-status-badge` recorded in section 3; no new concept or exception; D1 resolved as (a).*
- [x] Proposals, verified implementation, planned test/story matrices and observed results are distinct; each promise has an acceptance ID and suitable method. *Met: PC-S1 to PC-S15; every observed cell stays Pending (nothing is implemented or run).*
- [ ] Visual IDs identify real image provenance, conditions and related criteria; pending captures are not verification. *Not met, by decision: VIS-01 to VIS-05 stay Pending and visual conformity stays Not evaluated; V1 is a separate authorization that this approval does not grant.*
- [x] Snapshot identity is recoverable; human approval identifies this exact version, content digest, visual hashes and scope; otherwise status remains Proposed. *Met: [approval.md](approval.md) records the digest, the verbatim answer and the scope; `visualHashes` are Pending by decision, so visual conformity is not approved.*
- [x] One canonical component issue is retained; later versions are authorized comments, never silent body edits or one issue per version. *Met: #275 is canonical; #558 is the request; nothing is published.*

**Gate map (S5):**

| Gate | Skill | State |
| --- | --- | --- |
| 1 Cataloging | `component-cataloging` | Approved: L3, "Aprobar las cuatro (Recomendado)" |
| 2 Spec | `component-spec-proposer` | This document, Approved on 2026-11-25: "Aprobar con recomendaciones (Recomendado)" (see approval.md) |
| 3 Plan | `component-contributor` | Not started; needs independent approval |
| 4 Code | — | Not authorized |

**Owner decisions (resolved on 2026-11-25: the owner approved the draft with its recommended answers to D1–D4):**

- **D1 — Prop name and convention reading.** (a) Reuse `leading-status-badge` → `statusBadge` unchanged, reading "trailing content" as after-heading content (recommended). (b) Approve a scoped exception with an alternative prop name for ProjectCard. (c) Amend or replace the convention, which needs new convention approval, changes its hash and touches NowCard's approval basis. **Resolved (2026-11-25): (a)** — reuse `leading-status-badge` → `statusBadge` unchanged, with the after-heading reading of "trailing content" adopted for ProjectCard's usage; no exception and no convention change.
- **D2 — Shape.** (a) ReactNode slot `statusBadge` (recommended). (b) Exported part extracted by type like Backdrop and Mark, needing an exact part contract, a duplicate rule and the extra pins listed in section 1. **Resolved (2026-11-25): (a)** — ReactNode slot `statusBadge`; no exported part and no duplicate rule.
- **D3 — Header-row composition.** (a) The row holds the lead group (index over eyebrow, unchanged) at the inline start and the status at the inline end, and exists only with a status (recommended). (b) The row holds only index and status and the eyebrow stays below it, so an eyebrow-only card shows the status above the eyebrow. **Resolved (2026-11-25): (a)** — lead group (index over eyebrow) at the inline start, status at the inline end; the row exists only with a status.
- **D4 — Public marker.** (a) `eg-project-card__badge` on the status wrapper only, row and lead unmarked (recommended). (b) No new marker. (c) Also mark the row. **Resolved (2026-11-25): (a)** — `eg-project-card__badge` on the status wrapper only; the row and the lead group stay unmarked.
- **V1 — Visual authorization (does not block approving the spec).** Authorize read-only Playwright MCP capture of the Pulso reference `article.exp`, including any read-only hosting or harness, and agree the conditions in section 6. Observed Storybook captures follow implementation. Until then visual conformity stays Not evaluated. **Not granted by the 2026-11-25 approval**, which resolves D1–D4 and records no capture authorization: VIS-01 to VIS-05 stay Pending, no read-only hosting or harness is authorized, and visual conformity is not approved. A later grant is a separate owner decision recorded on its own.

**Next step:** `component-contributor` proposes the implementation plan, which needs its own owner approval before any code. This spec authorizes no code, token or dependency change, capture, registry write or GitHub action.
