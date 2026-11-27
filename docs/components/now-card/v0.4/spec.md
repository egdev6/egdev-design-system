# Component contract — NowCard

- **Version / status:** 0.4 — **Approved** on 2026-11-27 with the recommended answers to OQ-1 to OQ-6 ([approval record](approval.md)); an additive, opt-in amendment of the effective NowCard contract (v0.1 as amended by [badge order](../v0.1/badge-order-amendment.md) and [body growth](../v0.1/body-grow-amendment.md), then [v0.2](../v0.2/spec.md) and [v0.3](../v0.3/spec.md), whose approvals are [v0.2](../v0.2/approval.md) and [v0.3](../v0.3/approval.md)). The owner approved the cataloging, this spec and the [implementation plan](implementation-plan.md) with one answer, and each is its own gate (S6): this spec by itself authorizes no component, story, test, token, dependency, registry, receipt, artifact, catalog or GitHub change, and the plan's approval grants its edit surfaces. OQ-1 to OQ-6 (last section) are resolved as recommended.
- **Approval / recovery:** Approved for this payload by the owner on 2026-11-27, verbatim "Aprobar todo (Recomendado)" ([`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md) L13: one answer for the cataloging, this spec and the plan), given on the drafts left uncommitted on `integration/round-5` after commit `ae2408d` (draft payload SHA-256 `5d20f8f263a0d945003fefb6bf5981efd6dfd8565cd448879f2bcf695ea06289`) with the recommended answer to each open question, and recorded in [approval.md](approval.md). The digest below binds the final bytes (the draft with the recommended answers resolved). Every promise in §§2–7 is approved as written with those answers. Cataloging: [cataloging.md](cataloging.md), approved by the same answer (S6 puts its approval before this spec's). This approval covers no visual (VIS-01 stays Pending). Request authority: consumer request [#564](https://github.com/egdev6/egdev-design-system/issues/564) (S3 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md)), deferred by L3 and reopened by L12, verbatim "hazla". Agreed location: this folder; nothing is published.
- **Current situation / pending decisions:** Existing component, additive. Verified in this working tree (`integration/round-5`, HEAD `ae2408d`; the NowCard source folder has no uncommitted change): `types.ts`, `useNowCard.ts`, `NowCard.tsx`, `index.ts`, the tests and stories, `badge/types.ts`, `surface/types.ts`, `theme.css`, the registry, the artifact and the packed-check pins cited below; and, read-only, the Pulso reference and the Foundation NowCard sources. Two design sources disagree (the Pulso page stretches the tag, Foundation's NowCard does not) and v0.1 recorded the pill as an approved allowed difference: OQ-1. Owner decisions: OQ-1 to OQ-6 are resolved as recommended (closing section, kept as the record), notably recipe R1 (OQ-3) and the new naming convention (OQ-4). Pending outside this spec: the capture (VIS-01 stays Pending, under separate authorization) and every acceptance result, because no capture existed and nothing had been measured in a browser when this spec was finalized.
- **Snapshot identity:** `version: 0.4`; `contentSHA256: 50b9141f4c26fd01aa5016af57c1ebd3221cdc44b839c94b9a17a882cb456b39`; `visualHashes: VIS-01 → Pending (no capture)`; `approvalReference: docs/components/now-card/v0.4/approval.md (owner answer "Aprobar todo (Recomendado)", 2026-11-27)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/276` (the NowCard component issue, as in v0.2 and v0.3; #564 is the request, not the component issue); `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from the exact line-start heading `## 1. Purpose and scope` through EOF, with LF line endings and the final newline included. Every line above that heading is tracking metadata and is excluded, so the digest cannot depend on itself; the inline mention of the heading in this line does not count. Reproduce it with `awk '/^## 1\. Purpose and scope$/{f=1} f' docs/components/now-card/v0.4/spec.md | sha256sum`, and recompute after any payload edit. A digest is not approval.

## 1. Purpose and scope

- **Need / non-goals:** egdev-website's "now" cards want the status to read as the Pulso reference shows it: a full-width, uppercase band across the top of the card instead of a small sentence-case pill. In the reference the `.tag` is `inline-flex` inside a flex column, so it stretches to the card's content box (`pulso-source.html:86,198,889`) with uppercase display type, a 4px radius and a brand tint. NowCard renders `statusBadge` in `span.eg-now-card__badge` (`flex px-6 pt-6 pb-3`, `packages/ui/src/molecules/now-card/types.ts:161`), so a Badge keeps its content width and its pill look. #564 is low priority and has no mitigation in design-system code.
  **Non-goals:** changing the default presentation; any change to Badge, Surface, NowStrip, ProjectCard, tokens or dependencies; a tone axis (the band is brand-toned, as in the reference); a tonal Material header band (`docs/MATERIAL.md:65-69`) or an edge-to-edge band; renaming or replacing `statusBadge`; a built-in status word or icon; an interactive status; detecting, cloning or restyling the supplied node; clamping or hiding a long label; a capture or any publication.
- **Exact v0.4 delta:**
  1. A new optional prop `statusPresentation?: 'badge' | 'band'`, default `'badge'`. `badge` is v0.3 unchanged. `band` makes the existing wrapper `eg-now-card__badge` the band: the full width of the card's content box, an uppercase display label and a brand tint (recipe R1, §6).
  2. The JSDoc of `statusBadge` states what the slot holds in each presentation.
  3. The private recipe `nowCardBadgeVariants` gains a `presentation` axis (and a `size` axis that only `band` uses); with `badge` its class list is identical to today's.
  4. One story (`WithStatusBand`), new tests and the parent-owned integration (registry, artifact, catalog, changelogs).
  5. Nothing else: no part, marker, export, token, dependency, stylesheet or default changes. Every v0.1 to v0.3 promise remains, including the v0.3 footer rule for one optional StepMeter.

  **Changed promises and impact** (the approval gate must see these):

| Promise | Effective text | v0.4 | Impact |
| --- | --- | --- | --- |
| Tone ownership | The slot has "no tone ownership" (`types.ts:35-37`; v0.2 §3, the node renders verbatim) | Default unchanged. With `band` the card owns the brand tint; the node owns the words and the icon | None unless `band` is set |
| Slot content | "typically a Badge composition" (`types.ts:35`) | In `band`, label words and an optional decorative icon, not a Badge | Opt-in consumers replace the Badge |
| "Frozen" props | v0.3 §3: "No prop, type, export or default changes" (`v0.3/spec.md:39`) and the six props "unchanged" (`:43`) | Those lines scope v0.3's own delta (`v0.3/spec.md:16`); v0.4 adds one optional prop | One additive prop and one new naming convention (OQ-4) |
| Badge wrapper | `px-6 pt-6 pb-3` at both sizes (v0.2 §1 and §6) | Unchanged in `badge` | None |
| Allowed difference | The non-Badge pill is an approved allowed difference that "must not be implemented to match the capture" (`v0.1/implementation-plan.md:113`; v0.1 OQ-2) | Superseded for the opt-in `band` only (OQ-1); the default and the decision stand | None unless `band` is set |

- **Cataloging decision / alternatives:** **variant** of the existing molecule (a part-scoped, opt-in prop), decided in [cataloging.md](cataloging.md), approved with this spec (L13). Rejected there, with evidence: *reuse* (full width is reachable with `flex-1` on the Badge, but the uppercase display look, the radius and the tint are not, and Badge's `className` is layout-only, `badge/types.ts:36`); a *Badge variant* (a shared-atom change plus a second spec and plan; OQ-2 (b)); *composition* in the app (nothing existing paints a brand-tinted rectangular label); *extraction* (only NowCard asks); a *new* `NowCardTag` part (the v0.1 OQ-2 alternative that was not chosen).
- **Evidence / level and package:** unchanged molecule in `@egdev/ui`, `packages/ui/src/molecules/now-card/`. Inspected: `types.ts` (the `statusBadge` JSDoc `:35-41`; recipes `:128`, `:138-144`, `:161`, `:167-175`), `useNowCard.ts` (`:49`, `:64`, `:86`, `:91`, `:99`), `NowCard.tsx:22`, `index.ts`, `NowCard.test.tsx` (`:62`, `:151`), `NowCard.stories.tsx` (`:63-78`); `atoms/badge/types.ts` (`:4-5`, `:36`, `:38`, `:42`, `:58`), `primitives/surface/types.ts` (`:5-8`, `:24-37`); `packages/tokens/src/theme.css` (`:45`, `:99`, `:129`, `:194`, `:259-263`, `:355`); `docs/MATERIAL.md` and `docs/DECISIONES.md` as cited in [cataloging.md](cataloging.md); the registry and the packed-check pins named in the plan. `packages/ui/src/index.ts:78` is `export *` from the NowCard barrel.

## 2. Anatomy and composition

| Part | Element and responsibility | Content (v0.4) |
| --- | --- | --- |
| Root `eg-now-card` | `article`, surface and named passive frame | unchanged: status slot, heading, consumer children in order |
| `eg-now-card__badge` | optional `span` before the heading, the status slot. `badge`: a row that holds the node at its content width. `band`: the band itself, painted by the card | the consumer's non-interactive `statusBadge` node |
| Heading | `h2` to `h6`, generated id | unchanged |
| `eg-now-card__body` | growing `div` | unchanged |
| `eg-now-card__foot` | banded `div` | unchanged, including the v0.3 optional StepMeter |
| `eg-now-card__detail` | `span` | unchanged |

- **Radix / composition:** none. NowCard still has no child inspection, cloning, reordering, `asChild` or ref, and it does not import Badge or Icon: the consumer composes the label.
- **Public markers:** unchanged. `eg-now-card__badge` names the slot in both presentations. No `data-*` is added for the presentation: it is a prop, not a state, and the root `data-badge` keeps recording slot presence. The legacy bundle has no rule for `eg-now-card__badge`.

## 3. Public API

- **Prop conventions:** looked up in the [canonical registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning and name; no entry declares aliases, so none could match, and no entry is named `statusPresentation`. Applied entry, reused unchanged: `leading-status-badge` → `statusBadge` (approved; its text is not edited, so its approval hash holds). **New convention (OQ-4):** semantic ID `leading-status-presentation`, name `statusPresentation`, status `proposed` with `approval: null` when first recorded and `approved` once its receipt lands (plan §5.1), NowCard-only type `'badge' | 'band'`. Meaning: "How a heading-owning card presents its leading status slot: the supplied node at its content width, or a full-width status band that the card paints around it." Use: "A card that renders a consumer-supplied status node before its heading offers a small finite choice of how that slot is presented, with the default leaving the node as supplied." Avoid: "The component's own visual treatment (use `variant`), the status node's tone or treatment, lifecycle presentation (use `status`), dimension presets (use `size`), arbitrary widths or CSS values." Rejected, with reasons: `visual-treatment` (`variant`: the whole-card axis, and `banded` already means header and footer tonal bands in ModuleCard and Panel), `heading-title-variant`, `carousel-track-layout`, `tab-list-full-width`, `item-presentation-status`, the three `*-presentation` booleans, `section-register`, `host-fill`, `corner-radius` and `label-layout` (each has a different meaning). No exception is requested. Reviewed source: `packages/ui/src/molecules/now-card/types.ts`, symbol `NowCardProps`, whole-file `sha256:dce9fa50d7dafcde73ff3793077a056b8a2777a40f95fd434589ae3c633bfb94` (this working tree), equal to the revision recorded for the four NowCard usages. The `types.ts` edit changes that hash, so the plan must refresh the four usages and append the fifth (`pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`); this spec makes no registry edit. Resolved by OQ-4: the convention is approved as proposed, and its receipt is recorded at implementation (plan §5.1, D5) as a record separate from this spec's approval.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `statusPresentation` | `'badge' \| 'band'` (inline union, no new export) | no | `badge`; any other runtime value resolves to `badge`; no effect without `statusBadge` | `badge` renders the supplied node at its content width, as in v0.3. `band` paints the slot as a full-width, uppercase, brand-tinted band across the top of the card and frames the supplied label in it |
| `statusBadge` | `ReactNode` | no | undefined, null or boolean render nothing | Unchanged type and rule; the JSDoc is amended (below) |
| `title`, `level`, `size`, `children`, `className` | as in v0.3 | as in v0.3 | as in v0.3 | unchanged |

Approved JSDoc, English, for `types.ts`. `statusPresentation`: "Presentation of the leading status slot. `badge` renders the supplied node at its content width. `band` paints a full-width, uppercase, brand-tinted band across the top of the card and frames the supplied label in it. It has no effect without `statusBadge`." with `@control select` and `@default badge`. `statusBadge`, in place of the current body text: "Optional consumer-supplied non-interactive status node rendered before the heading as the card's first content. With the default `badge` presentation it is typically a Badge composition and keeps its own paint. With `statusPresentation='band'` the card paints the band, so supply the label words and, optionally, a decorative Icon instead of a Badge, which would paint a second pill inside the band. Absent/null/boolean renders nothing. No interactive descendants, no baked-in status word." Its `@controlReason` gains `WithStatusBand`.

- **Native props / refs:** unchanged. No ref, no `asChild`. The hook destructures `statusPresentation` before the native props, so it never reaches the `article`.
- **Controlled / uncontrolled:** Not applicable.
- **Compatibility:** additive. Omitting the prop renders exactly as v0.3. No export, marker, part, token or dependency changes; `packages/ui/src/index.ts:78` is unaffected because the union is inline. The artifact gains one prop and the card's recipe lines. React 18 and 19 behavior is a packed-consumption check, not inferred from types.

## 4. Behavior

| Situation | Expected observable result |
| --- | --- |
| `statusPresentation` omitted or `'badge'` | Exactly v0.3: the wrapper keeps `eg-now-card__badge`, `px-6`, `pt-6` and `pb-3`, and the node keeps its content width. DOM and class lists are identical to v0.3 |
| `'band'` with a label node | The wrapper is a full-width band inset like the pill's slot, with uppercase display type, brand tint, hairline border and edge shadow. DOM order is band, heading, body, footer. The node renders verbatim inside, and an icon and the words share one row |
| `'band'` without a status node (undefined, null or boolean) | No wrapper, root `data-badge="false"`, heading keeps `pt-6`, no warning. The presentation has no effect |
| Any other runtime value | Resolves to `badge`, silently, as an invalid `level` falls back to 3 (v0.2 §3) |
| A long label in `band` | Wraps onto further lines inside the band; nothing is truncated, clamped, clipped or replaced by a tooltip; the band grows |
| A Badge supplied in `band` | Renders verbatim inside the band, so a second pill appears. Unsupported, not detected, no warning |
| `size` `md` or `sm` | The band's horizontal inset follows the heading's (OQ-6); the vertical slot is the pill's. For a one-line label the heading's top does not move between presentations (C2, §6) |
| Rerender switching `badge` and `band` | Only the wrapper's classes change; the article's name, heading id and tab order are unchanged; no event |
| Hover, focus or status changes | None: the card stays passive, with no motion, polling, announcement or emitted event |
| A NowStrip row with band, badge and no-badge cards | Card edges and footer bands align as A8-AC1 is interpreted in v0.2 (`now-card/v0.2/approval.md:8`): not equal heading tops across badge and no-badge cards |
| A footer with a StepMeter | Unchanged from v0.3 |

- **States / representation:** no own `data-state`, no hover state in JS, no mirrored state classes. The presentation is a prop, not a state.
- **Limits / consumer responsibilities:** the consumer supplies the label words and their language, an optional decorative `Icon` (use `size='sm'` to keep the one-line height), and keeps the label short. The consumer does not pass a Badge in `band`. Only a brand tone exists in `band`; another tone needs the default presentation with a Badge.

## 5. Accessibility

- **Accessible name / roles / relationships:** unchanged. The article is named only by the generated heading through `aria-labelledby`. The band is readable text, never `aria-hidden`, and the status is never colour-only: the label carries it.
- **Keyboard / focus:** unchanged. The band adds no tab stop, key handler or live region, and the footer action keeps its native behavior.
- **Announcements / other conditions:**
  - Uppercase is CSS `text-transform`; the DOM text is unchanged. If a tool reports uppercased text, it is the Chromium behavior recorded in #563 F2 (`odd/tasks/round-5-consumer-requests.md` L8), not a defect.
  - An icon supplied through `Icon` without a `label` is decorative and hidden from assistive technology; a labelled icon inside the band would be announced, which is the consumer's choice.
  - Contrast: the ink is Badge's existing brand ink on the 12% brand tint over `surface-1`. By token arithmetic it is about 7.4:1, and about 6.6:1 under the sheen's 4.5% white at the top edge. That is arithmetic, not a measurement (NC4-10).
  - Forced colors: the 1px border is the shape cue that survives the system palette, as for Badge (derived from the specification, Not evaluated). Reduced motion and transparency: Not applicable, since the band has no motion and no backdrop blur or translucent overlay (the tint sits on the solid card surface).
  - Not evaluated: real screen-reader output, reflow of a long label at 400% zoom, and a real High Contrast theme.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `statusPresentation` | `badge`, `band` | `badge` | `band` is brand-toned only and needs a status node; both sizes |
| `size` | `md`, `sm` | `md` | unchanged for the card; in `band` it selects the horizontal inset |
| badge presence | present, absent | unchanged | the heading inset follows presence, as in v0.2 |
| `level` | 2 to 6 | 3 | semantics only |

- **Tokens / Material:** one new recipe, **R1**, approved with this spec (OQ-3). It is the brand/soft treatment of Badge with a rectangular radius and the eyebrow type, composed from existing token-backed utilities on the existing wrapper's `flex`. **No token is added or changed.** It is not Surface (no Surface tone is a brand tint), not Gauge's exception and not a tonal Material band.

| R1 utility | Resolves to | Source |
| --- | --- | --- |
| `mx-6` (`md`), `mx-4` (`sm`) | inline margin `--space-6`, `--space-4` | the heading's inset (`types.ts:138-141`); OQ-6 |
| `mt-6`, `mb-3` | the pill's slot, moved from padding to margin | `types.ts:161` |
| `px-2.5`, `py-1.5` | 8px, 4.8px | the same as Badge (`badge/types.ts:38`); Pulso `6px 10px` ×0.8 |
| `items-center`, `gap-2` | centered row, 6.4px | Pulso `gap:8px` ×0.8 |
| `rounded-sm` | `--radius-sm`, 3.2px | `theme.css:355`; Pulso 4px ×0.8 |
| `border border-alpha-red-22` | 1px, `--color-alpha-red-22` | `theme.css:129`; `badge/types.ts:58` |
| `bg-alpha-red-12` | `--color-alpha-red-12` | `theme.css:45`; `badge/types.ts:58` |
| `text-primitive-red-200` | `--color-primitive-red-200` | `theme.css:99`; `badge/types.ts:58` |
| `shadow-edge` | `--shadow-edge`, the light edge | `badge/types.ts:42`; Material principle 3 |
| `font-display text-label-eyebrow uppercase` | display family; 11.2px, 700, 0.12em; uppercase | `theme.css:194,259-263` |
| `wrap-anywhere` | long labels wrap | the heading's recipe (`types.ts:138`) |

  Allowed differences from the reference: token type step (11.2px against 13px ×0.8) instead of raw pixels; `shadow-edge` where the Pulso tag is flat; a solid `surface-1` card instead of glass; the radius is exact (3.2px is 4px ×0.8).
- **Dynamic geometry:** Not applicable. Every utility is a static literal in a CVA string; there is no custom property, interpolated class or inline style. The values above are a **starting point** (OQ-6), confirmed in a browser against three constraints, at `md` and `sm` and at 390px and 1280px:
  - **C1** the band's outer left and right edges equal the heading's content edges within 0.5px;
  - **C2** for a one-line label with an Icon `sm`, the heading's top equals that of the same card in `badge` presentation within 0.5px;
  - **C3** a label longer than the content box wraps, and the card has no horizontal overflow at 320px.

  If no value meets C1 to C3, that is a spec amendment, not a plan tweak.
- **Class composition / consumer layout:** no `className` surface is added: the wrapper takes none, and the root's (outer margin, width, parent-grid placement, merged last through `cn()`) is unchanged. R1 uses margin for the inset and padding for the label, so `twMerge` meets no group conflict, and the `band` and `size` compound replaces `mx-*` instead of stacking. The `badge` class list is byte-identical to v0.3's.
- **Files / confirmations:** the six mandatory files keep their roles. Edited: `types.ts` (the prop, the JSDoc, `nowCardBadgeVariants`), `useNowCard.ts` (resolve the presentation, pass it to the recipe), `NowCard.test.tsx` and `NowCard.stories.tsx`. Unchanged: `NowCard.tsx` (the JSX already spreads `badgeProps`) and `index.ts`. **No stylesheet**, no extra internal module, no token and no dependency. Confirmed by the owner: R1 (OQ-3), the convention (OQ-4) and the geometry starting point (OQ-6), whose final values are confirmed in a browser. Registry, artifact, catalog and changelogs are parent-owned integration surfaces named in the plan.

### Expected-design visual reference

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | **Pending**, no image exists. Planned alt: "A now card with a full-width brand-tinted status band holding a small icon and an uppercase label above the card title, at medium and compact density." | Principal: `statusPresentation='band'` with an icon and a one-line label at `md` and `sm`. Additional: a long label that wraps, and the same card in `badge` presentation beside it | Expected design: `pulso-source.html:86,198,889` and `:556` (compact), read-only. Observed: the DS story `WithStatusBand` after implementation | Pending; no capture, so no visual approval |

- **Conditions / provenance:** none exist yet. A capture needs a separately authorized read-only hosting of the reference, then Playwright MCP, a component-zone PNG, `capture.json` and SHA-256 hashes ([capture guide](../../../design/README.md)).
- **Intent / acceptance / pending evidence:** the band is inset in the card padding, left-aligned, uppercase display type, brand tint, one line for a short label. Allowed differences are those listed above. Related criteria: NC4-03, NC4-09 and NC4-10. Missing: capture, adoption, implementation comparison. Visual conformity is **Not evaluated**.

## 7. Acceptance criteria

All checks are planned, not observed when this spec was finalized. The implementation, tests and stories follow the separately approved [plan](implementation-plan.md).

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| NC4-01 | With `statusPresentation` omitted or `'badge'`, at `md` and `sm`, the wrapper keeps `eg-now-card__badge`, `px-6`, `pt-6` and `pb-3` and none of R1's utilities. A differential render of the existing stories on a base copy gives identical DOM and classes. | `NowCard.test.tsx` `it.each`; a one-off script in scratch outside the repository, not committed | existing stories | Pending |
| NC4-02 | `statusPresentation` is consumed and never forwarded: the article has no `statuspresentation` attribute for any value, `data-*` still arrives, and the console stays silent. | `NowCard.test.tsx` | Not applicable | Pending |
| NC4-03 | With `'band'` the wrapper carries R1 exactly (the utility list in §6, `mx-6` at `md` and `mx-4` at `sm`, one `mx-*` class), and not `px-6`, `pt-6` or `pb-3`. | `NowCard.test.tsx` class contract | `WithStatusBand` | Pending |
| NC4-04 | In `band` the wrapper is the article's first child, then heading, body and footer; the label is readable and not `aria-hidden`; the card adds no tab stop; the article is named by the heading only. | `NowCard.test.tsx` with role queries and `userEvent.tab()` | `WithStatusBand` | Pending |
| NC4-05 | In `band` with an undefined, null or boolean node: no wrapper, `data-badge="false"`, the heading keeps `pt-6`, no `console.warn` or `console.error`. | `NowCard.test.tsx` | Not applicable | Pending |
| NC4-06 | Any other runtime value resolves to `badge`: the `badge` class list and no warning. | `NowCard.test.tsx` through an untyped boundary | Not applicable | Pending |
| NC4-07 | Rerendering `badge` to `band` and back swaps only the wrapper's classes; the heading id and the article name are unchanged; no event. | `NowCard.test.tsx` `rerender` | Not applicable | Pending |
| NC4-08 | The band wrapper carries no transition, animation, transform, hover or pointer-cursor utility (NC-09 extended). | `NowCard.test.tsx`, proved able to fail by a mutation in the plan | Not applicable | Pending |
| NC4-09 | In Chromium, at `md` and `sm`, 390px and 1280px: C1 and C2 hold, a long label wraps, and C3 holds at 320px. | Browser rects, parent-authorized, geometry only | VIS-01 | Pending |
| NC4-10 | The computed band paint is `text-transform: uppercase`, the display font family, `border-radius` 3.2px, background `rgba(255, 0, 54, 0.12)` and the `alpha-red-22` border, with a measured text contrast of at least 4.5:1 over the real card background. | Browser computed style | VIS-01 | Pending |
| NC4-11 | In a NowStrip row of a band card, a badge card and a no-badge card, the footer bands align and the card tops follow A8-AC1 as interpreted in v0.2; the band and badge cards' heading tops match. | Browser geometry on a scratch composition | Not applicable | Pending |
| NC4-12 | `statusPresentation` has English JSDoc, `@control select` and `@default badge`, with options in union order and no injected argument; `statusBadge`'s JSDoc is amended; own declarations go from 11 to 12; the `WithStatusBand` story exists. | `storybook-docgen` and `storybook-controls` suites | Docs table of `Molecules/NowCard` | Pending |
| NC4-13 | The registry has one new convention (recorded as proposed, then approved by its receipt, OQ-4) and five NowCard usages with refreshed revisions; the artifact lists the prop and the recipe lines; the packed CSS ships R1's utilities; no stylesheet is added; the barrel and the export list are unchanged. | `pnpm props:check`, `pnpm test:props`, the artifact, package-exports and package-consumption checks | Not applicable | Pending |
| NC4-14 | The v0.3 footer is unchanged: every existing NowCard test, including the StepMeter cases, passes unedited. | Existing suite | `WithStepMeter` | Pending |
| NC4-15 | A Badge supplied in `band` renders verbatim; the card adds no warning and does not inspect it. | `NowCard.test.tsx` | Not applicable | Pending |

### Spec closure

- [x] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain — **met**: OQ-1 to OQ-6 are resolved as recommended (owner answer, L13) and the blocks are complete with those answers folded in.
- [x] New or changed own props have registry lookup evidence, the exact reused entry and the new proposal with its source; convention approval stays explicit and separate (OQ-4); no exception is requested.
- [x] Proposals, verified implementation, planned checks and observed results are distinct; every promise has an acceptance ID and a method.
- [ ] Visual IDs identify real image provenance, conditions and related criteria — VIS-01 **Pending**; no capture is verification.
- [x] Snapshot identity is recoverable and human approval identifies this version, digest and scope — [approval.md](approval.md) binds v0.4, the final digest and the scope; the owner's answer was given on the drafts left uncommitted on `integration/round-5` after `ae2408d` (one answer for the cataloging, this spec and the plan). No visual hash exists for VIS-01 (Pending), so none is bound.
- [x] The canonical NowCard component issue (#276) is retained; this version would be an authorized comment there, never a body edit or a new issue.

## Resolved decisions

Record of the owner's resolution of OQ-1 to OQ-6 on 2026-11-27 (`odd/tasks/round-5-consumer-requests.md` L13, verbatim "Aprobar todo (Recomendado)"): every recommended answer was adopted. Questions, evidence and recommendations are kept as drafted; see [approval.md](approval.md).

| ID | Question and evidence | Resolution (recommended answer adopted) |
| --- | --- | --- |
| OQ-1 | **Expected design.** The Pulso page stretches the tag (`pulso-source.html:86,198`); Foundation's NowCard keeps it content-width (`bundle.css:266`); v0.1 approved the pill as an allowed difference (`v0.1/implementation-plan.md:113`). Is the Pulso band the expected design for an opt-in band presentation, superseding that allowed difference only for `band`? | **Resolved: yes.** The default `badge` presentation and the v0.1 decision stay; only the opt-in follows the Pulso page |
| OQ-2 | **Who paints the band?** (a) NowCard, with R1, around supplied label content; (b) Badge gains a `shape` axis and NowCard only places it; (c) NowCard only stretches the Badge ([cataloging.md](cataloging.md), the fork) | **Resolved: (a).** One component, one recipe, no shared-atom change. Extract R1 into a Badge axis only when a second component asks |
| OQ-3 | **Approve recipe R1** (token-backed, brand-only, with `shadow-edge`, no new token) | **Resolved: approved as written.** R1 is the recipe that paints the band; no other approved recipe does |
| OQ-4 | **Prop name and convention:** `statusPresentation: 'badge' \| 'band'` under a new proposed `leading-status-presentation` | **Resolved: as proposed.** The convention receipt is recorded at implementation under plan §5.1 (D5), separately from this approval |
| OQ-5 | **Slot content in `band`:** keep `statusBadge` (no rename, no second slot, no convention edit) and document that the node is label content, not a Badge | **Resolved: keep.** A second slot prop for the same position would need a precedence rule and fork `leading-status-badge` |
| OQ-6 | **Geometry starting point:** horizontal inset equal to the heading's (`mx-6` `md`, `mx-4` `sm`), the pill's vertical slot (`mt-6 mb-3`), final values confirmed in a browser against C1 to C3 | **Resolved: yes.** If no value meets C1 to C3, the plan stops and returns to the owner |

The recommended answers were already folded into the draft's text, so resolving the questions changes no API, anatomy, behavior, accessibility, appearance or owner-facing promise; the digest moved because the status, decision and closure wording changed ([approval.md](approval.md), "Differences from the approved draft"). The plan's pinned spec digest was updated to the new one, and it was re-read against these bytes: its assumptions (G2: OQ-1 yes, OQ-2 (a), OQ-3 approve R1, OQ-4 as proposed, OQ-5 keep, OQ-6 yes) are exactly the recommended answers adopted here.

**Next step:** the [implementation plan](implementation-plan.md) was approved by the same owner answer, as a separate gate (S6), and implementation follows it, within its §2 edit surfaces and its G8 stop lines; the pending visual (VIS-01) is captured only under separate authorization. This spec by itself authorizes no code, token or dependency change, registry write, capture, publication or terminal Git action.
