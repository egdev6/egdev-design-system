# Component contract — NowCard

- **Version / status:** 0.3 — **Approved** on 2026-11-25 with the recommended answers to OQ-1 and OQ-2 ([approval record](approval.md)); an amendment to the effective NowCard contract. Not implementation-ready: the implementation plan ([implementation-plan.md](../../step-meter/v0.1/implementation-plan.md), one plan covering StepMeter v0.1 and this amendment, Proposed) needs its own, separate approval.
- **Approval / recovery:** Approved for this exact snapshot by the owner on 2026-11-25, verbatim "Aprobar con recomendaciones (Recomendado)" (`odd/tasks/pulso-consumer-requests.md` L5), given on the committed draft (`68ea3a4`) with each open question's recommended answer; recorded in [approval.md](approval.md). The question was asked in conversation without a SHA prefix, so the digest below binds the final bytes (the draft with the recommended answers folded in). Every promise in §§2–7 that reads as proposed is approved as written with those answers. The effective baseline is the [v0.1 spec](../v0.1/spec.md) as amended by [badge order](../v0.1/badge-order-amendment.md) and [body growth](../v0.1/body-grow-amendment.md), then the [v0.2 spec](../v0.2/spec.md), owner-approved on 2026-11-04 ([approval record](../v0.2/approval.md)); historical draft headers are interpreted through those records. Cataloging is owner-approved: `odd/tasks/pulso-consumer-requests.md` L3, verbatim "Aprobar las cuatro (Recomendado)". **Depends on** [StepMeter v0.1](../../step-meter/v0.1/spec.md) (payload SHA256 `1da0f307a65e2ade2f750ab6dd6cd1d6702096c08227fa591eecfa63df0de368`), approved in the same answer (OQ-2 resolved); its name is final (OQ-1 there), so no rename follows. Plan approval is separate.
- **Current situation / pending decisions:** Covers S1 (#556) at the spec gate of S5. NowCard is an implemented molecule. This amendment changes only a documented promise (footer content and the meter exclusion); component behavior does not change. Verified in this working tree: the sources, tests, stories and exports cited below. OQ-1 and OQ-2 (last section, kept as the record of the resolved decisions) are resolved as recommended, and the StepMeter dependency is approved in the same answer. Pending outside this spec: the implementation plan and its approval. No capture exists (VIS-01 Pending).
- **Snapshot identity:** `version: 0.3`; `contentSHA256: 2ed402f029d3494334f600d8c037615664b63c6b48df00f9c662d66feba19253`; `visualHashes: VIS-01 → Pending (no capture)`; `approvalReference: docs/components/now-card/v0.3/approval.md` (owner answer "Aprobar con recomendaciones (Recomendado)", 2026-11-25); `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/276` (the NowCard component issue, as in v0.2; consumer request [#556](https://github.com/egdev6/egdev-design-system/issues/556) originates this amendment but is not the component issue); `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from the exact whole heading line `## 1. Purpose and scope` through EOF, with LF line endings and the final newline included. All tracking metadata above that heading is excluded so the digest cannot depend on itself. A digest is not approval.

## 1. Purpose and scope

- **Need / non-goals:** Consumer request #556 / S1: "Each "now" card on the home shows a coarse progress level for its activity (low to high, four steps) next to its footer link, with an accessible name such as "High progress"." This amendment lets the footer host one StepMeter beside its supporting detail or action. NowCard still renders no meter, owns no level data, wording or validation, and gains no prop or part. Every other v0.2 non-goal stands: no domain copy, polling, scheduling, whole-card activation or strip layout.
- **Exact v0.3 delta (S1):**
  1. The footer promise "one NowCardDetail and/or one Link/IconButton" becomes "one NowCardDetail and/or one Link/IconButton, **and optionally one StepMeter**; when a StepMeter is present, the footer holds it plus at most one other child".
  2. The v0.2 exclusion of a **built-in** meter stays. What changes is that a **consumer-supplied** StepMeter is an allowed footer child.
  3. The v0.2 §5 sentence "No decorative meter is implied" is replaced by §5 below.
  4. The only source touch is documentation: the JSDoc of `NowCardFooterProps`, a `WithStepMeter` story and tests. No prop, type, class, marker, token, dependency, stylesheet or default changes. All effective v0.1 and v0.2 promises remain, including that a card without a meter renders exactly as before.
- **Cataloging decision / alternatives:** Owner-approved (L3): a NowCard spec amendment that allows the new atom in the footer. In `docs/CATALOGACION.md` terms this is composition through the existing footer slot plus a changed documented promise, so it needs this amendment, not a new component or a variant. Rejected:
  - *A NowCard prop or part that renders the meter* (`meter`, `level` or a `NowCardMeter` part): NowCard would own the value model, naming and validation, contradicting the v0.2 exclusion that L3 keeps, and would add API for a responsibility the atom already carries.
  - *The meter in `NowCardBody`:* the reference puts it in the footer beside the link, and the body is copy only.
  - *Changing NowStrip:* [NowStrip v0.2](../../now-strip/v0.2/spec.md) §6 says a future footer meter "needs its own approved card amendment; it is not an arbitrary slot grant"; this is that card amendment, and the strip renders and inspects no footer.
  - *Leaving it to app composition:* the pattern L3 decided against. NowCard v0.1 OQ-1 had already expected the meter to arrive as "a later amendment" (then tied to Pixel; L3 chose a dedicated atom instead).
- **Evidence / level and package:** Unchanged molecule in `@egdev/ui`, `packages/ui/src/molecules/now-card/`. Inspected: `types.ts` (`NowCardFooterProps` JSDoc: "one supporting detail and/or one action (a Link or a labelled IconButton); never two competing actions"; `nowCardFootVariants`: `eg-now-card__foot m-0 flex flex-wrap items-center justify-between gap-2 min-w-0 … px-6 py-3`, `sm` `px-5 py-2`), `useNowCard.ts` (`useNowCardFooter`), `NowCard.tsx` (`NowCardFooter` renders its children verbatim), `NowCard.test.tsx` (NC-06 footer cases) and `NowCard.stories.tsx` (`WithLink`, `WithNextDate`, `WithSingleChild`). Reference: `egdev-foundation/reference-web/pulso-source.html:888-911` (the meter sits beside the link in two of the three cards; the third pairs a date with an icon action; CSS `:205-207`, which the request cites as `:206-208`), Foundation `NowCard/README.md` (a `progress` of 0–4 and a `role="img"` meter with an `aria-label`) and `bundle.css:273-275`.

## 2. Anatomy and composition

| Part | Element and responsibility | Content (v0.3) |
| --- | --- | --- |
| Root `eg-now-card` | `article`, surface and named passive frame | unchanged: badge, heading, consumer children in order |
| `eg-now-card__foot` | banded `div` | one `NowCardDetail` and/or one `Link` or named `IconButton`, **plus optionally one StepMeter**; with a StepMeter, it plus at most one other child; DOM order is visual order |
| StepMeter (not a NowCard part) | `span.eg-step-meter`, `role="img"`, the informative level | consumer-supplied footer child; NowCard adds no wrapper and no marker |

All other v0.2 parts are unchanged.

- **Radix / composition:** none. NowCard still has no child inspection, cloning, reordering, `asChild` or ref, and it does not import StepMeter; the consumer composes it, and stories import it as they already import Badge and IconButton.
- **Public markers:** unchanged. No `eg-now-card__meter` marker is added or reused; the legacy `.eg-now-card__meter` rules (`packages/ui/src/styles/legacy/bundle.css:283-285`) stay untouched.

## 3. Public API

No prop, type, export or default changes.

| Surface | v0.3 |
| --- | --- |
| `NowCard` props (`title`, `level`, `size`, `statusBadge`, `children`, `className`) | unchanged |
| `NowCardBody`, `NowCardDetail` | unchanged |
| `NowCardFooter` (`children: ReactNode`, `className`) | types unchanged; only the JSDoc of `NowCardFooterProps` states the v0.3 footer rule |
| Public exports | unchanged |

**Naming:** [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md): no new own prop and no exception for NowCard. The applied approved entries are unchanged (`heading-title` → `title`, `heading-level` → `level`, `preset-dimensions` → `size`, `leading-status-badge` → `statusBadge`). StepMeter's `label`, `value` and `steps` lookups live in its own spec. Reviewed source `packages/ui/src/molecules/now-card/types.ts`, `NowCardProps`, whole-file `sha256:d768d4f65946cd57aa2c526df0c7efde91952eb62dc9ee010b5c858078e4b5c3`, equal to the revision recorded for the four NowCard registry usages. The JSDoc edit changes that hash, so the plan must review and refresh those four usage revisions (`pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`); this spec makes no registry edit. Convention approval stays independent of spec approval.

**Native / refs:** unchanged: no ref and no `asChild`. The `style` discrepancy recorded in v0.2 is closed in the current tree (`style` is omitted by type and stripped by the hook; commit `78af7da`).

**Controlled / uncontrolled:** Not applicable. **Compatibility:** documentation-only for existing consumers; React 18/19 behavior is not touched.

## 4. Behavior

| Situation | Expected observable result |
| --- | --- |
| Footer with a `Link` and a StepMeter, in that order | Link on the leading edge, meter on the trailing edge, one row, no overlap; exactly one tab stop (the link); the meter is an image named by its `label` |
| Footer with an `IconButton` and a StepMeter | Same; the button owns focus and activation |
| Footer with a `NowCardDetail` and a StepMeter | Same; no tab stop |
| Footer with only a StepMeter | Not a supported composition; the existing single-child leading alignment applies and no further promise is made |
| Footer with three or more children (detail, action, meter) | Unsupported but not enforced: all render in DOM order, with no warning, and `justify-between` spreads them; the consumer owns the "at most one other child" rule |
| Narrow container, `md` or `sm` | The footer wraps instead of clipping; a wrapped meter starts the next line at the leading edge; the meter keeps its intrinsic size |
| StepMeter with an invalid `label` or `value` | The StepMeter renders nothing by its own contract; the footer renders its other child unchanged; NowCard adds no warning or placeholder |
| Meter level or label changes | No NowCard motion, announcement or event; the atom's own contract applies |
| Any card without a StepMeter | Unchanged from v0.2 |

Consumers own the level data, the wording of `label`, keeping it coherent with the filled steps, and the placement order. NowCard never reorders, wraps or validates the footer's children.

## 5. Accessibility

The v0.2 sentence "No decorative meter is implied" is replaced: a footer StepMeter is an **informative named image**, not decoration. Its name, role and value rules are those of the [StepMeter spec](../../step-meter/v0.1/spec.md#5-accessibility) (`role="img"` with a consumer-supplied `label`, approved with StepMeter v0.1); NowCard adds nothing to them.

- The article is still named only by the generated heading through `aria-labelledby`; the meter does not rename or describe the article.
- The meter adds no tab stop, key handler or live region. The footer link or button keeps its native keyboard behavior, visible focus (`--shadow-focus`), name and coarse-pointer target of at least 44px; an icon-only action still needs its label.
- DOM order is reading order: the companion first, then the meter, as in the reference.
- Wording guidance for consumers: the `label` must stand alone when a screen reader reaches it inside the card and must not repeat the card title; one meter per card.
- Color independence, contrast on the `surface-0` footer band and forced colors belong to the atom (StepMeter §5, OQ-5 and OQ-6 there). NowCard changes no paint, so the footer band's own Material and contrast promises are unchanged.
- Not evaluated: real screen-reader output for the card with a meter, zoom and reflow with the meter, and any real High Contrast theme.

## 6. Appearance

| Axis | Values | Rule |
| --- | --- | --- |
| size | `md`, `sm` | unchanged; the StepMeter has one fixed size at both densities |
| badge presence | present, absent | unchanged |
| level | 2–6 | unchanged, semantics only |

No NowCard class, utility, token, Material recipe, density, marker or stylesheet changes. The footer band recipes stay as in v0.2 (`surfaceVariants` surface-0 band, hairline, `rounded-b-xl`, `px-6 py-3` or `px-5 py-2`, `flex flex-wrap items-center justify-between gap-2`); with two children, `justify-between` already produces the reference layout, so no layout rule is added. The StepMeter paints itself (neon filled steps over the band); NowCard adds no wrapper, margin or alignment utility. The footer `className` surface is unchanged (local placement, margin and width). No dynamic geometry, inline appearance or handwritten shadow, gradient or color is introduced.

**Files / pending proposals:** no new file in NowCard. When separately planned and approved, the implementation edits `types.ts` (JSDoc of `NowCardFooterProps` only), `NowCard.stories.tsx` (a `WithStepMeter` story) and `NowCard.test.tsx` (new cases), and refreshes the registry usage revisions noted in §3; `useNowCard.ts`, `NowCard.tsx` and `index.ts` stay unchanged. **No stylesheet**, no extra internal module, no token or dependency change.

### Expected-design visual reference

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | **Pending**, no image exists. Planned alt: "A now card footer with a link on the leading edge and a four-step meter on the trailing edge, at medium and compact density." | Principal: `Link` + StepMeter (3 of 4 and 1 of 4) at `md` and `sm`. Additional: `IconButton` + StepMeter and `NowCardDetail` + StepMeter, which have no source design and would be observed only. | Expected design: `reference-web/pulso-source.html:888-911` and Foundation `NowCard/preview.html`, read-only. Observed: the DS story after implementation. | Proposed; no approval |

- **Conditions / provenance:** none exist yet; a capture needs separately authorized read-only hosting and source access, then Playwright MCP, a component-zone PNG, `capture.json` and SHA-256 hashes ([capture guide](../../../design/README.md)). Historical context only: v0.1 VIS-02 (`../v0.1/now-card--variants--1280x1400--dark.png`, SHA-256 `9fff262c4e7d6782e4cac2876388f59a71db3ebe99a5b1ae5f6a1b1efef91c23`, matching its recorded hash) is a Foundation preview, Proposed and never adopted; it shows the meter beside the link at 3/4, 1/4 and 4/4 in `md` and `sm` footers. It is neither a DS capture nor expected design for this amendment.
- **Intent / acceptance / pending evidence:** the footer keeps its identity (hairline band, companion leading, meter trailing); allowed differences are those of StepMeter (token ×0.8 scale, clip-path mechanism, forced-colors paint). Related criteria: NC3-01 to NC3-04. Missing: capture, adoption, implementation comparison. Visual conformity is **Not evaluated**.

## 7. Acceptance criteria

All checks are planned, not observed. The implementation, tests and stories belong to a separately approved plan.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| NC3-01 | A footer with `Link` + StepMeter renders both inside `eg-now-card__foot` in that DOM order; exactly one tab stop (the link); the meter is an `img` named by its `label`; the article is still named by its heading. | `NowCard.test.tsx`: role queries and `userEvent.tab()` | `WithStepMeter` | Pending |
| NC3-02 | The same holds for `IconButton` + StepMeter and `NowCardDetail` + StepMeter at `md` and `sm`. | `it.each` over companions and sizes | `WithStepMeter`, `Sizes` | Pending |
| NC3-03 | Companion leading and meter trailing in one row without overlap; at 390px and 1280px, `md` and `sm`, the footer wraps instead of clipping and the meter keeps its intrinsic size. | Real Chromium geometry (rects); class assertions that `flex-wrap` and `justify-between` are unchanged | VIS-01 | Pending |
| NC3-04 | Adding a StepMeter does not change the footer band height for each supported companion (Link, IconButton, NowCardDetail) at `md` and `sm`; if it does, the plan stops and returns the measurements instead of accepting it. | Browser geometry differential, with and without the meter | VIS-01 | Pending |
| NC3-05 | A card without a StepMeter is unchanged: every existing NowCard test passes untouched, and a differential render of the existing stories gives identical DOM and classes before and after. | Existing suite plus a one-off differential script in scratch outside the repository, not committed | Not applicable | Pending |
| NC3-06 | NowCard does not inspect, clone, reorder or limit its footer children: a footer with detail, action and meter renders all three in order with no warning; the "at most one other child" rule is documented consumer responsibility. | `NowCard.test.tsx` | `WithStepMeter` JSDoc | Pending |
| NC3-07 | An invalid StepMeter (blank `label`, non-finite `value`) renders nothing by its own contract; the footer renders its other child unchanged and NowCard adds no warning or placeholder. | Integration test with the `console.warn` spy | Not applicable | Pending |
| NC3-08 | In a NowStrip row, the footer bands of cards with meters stay aligned (A8-AC1 as interpreted in NowStrip v0.2: card top insets and footer bands). | Browser geometry on a scratch NowStrip composition with meter cards | Not applicable | Pending |
| NC3-09 | `NowCardFooterProps` JSDoc is English and states the v0.3 rule; no type changes (`children: ReactNode`); the four NowCard registry usages are refreshed after the `types.ts` byte change with reviewed evidence; docgen and Controls suites pass. | `storybook-docgen` and `storybook-controls` suites; `pnpm props:check` and `pnpm test:props` | Docs table review of `Molecules/NowCard` | Pending |

### Spec closure

- [x] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain — OQ-1 and OQ-2 are resolved as recommended and the StepMeter dependency is approved in the same answer.
- [x] New or changed own props: none for NowCard; lookup evidence and unchanged entry IDs recorded; no exception requested.
- [x] Proposals, verified implementation, planned checks and observed results are distinct; every promise has an acceptance ID and a method.
- [ ] Visual IDs identify real image provenance, conditions and related criteria — VIS-01 **Pending**; no capture is verification.
- [x] Snapshot identity is recoverable and human approval identifies this version, digest, visual hashes and scope — [approval.md](approval.md) binds version 0.3, the final digest and the scope; the owner's answer was given on the committed draft `68ea3a4` without a digest prefix; no visual hash exists (VIS-01 Pending).
- [x] The canonical NowCard component issue (#276) is retained; this version would be an authorized comment there, never a body edit or a new issue.

**Next step:** the implementation plan ([implementation-plan.md](../../step-meter/v0.1/implementation-plan.md), one plan covering StepMeter v0.1 and this amendment, Proposed) awaits its own, separate owner approval. This amendment authorizes no code, token or dependency change, capture, publication or registry edit.

## Resolved decisions

Record of the owner's resolution of OQ-1 and OQ-2 on 2026-11-25 (`odd/tasks/pulso-consumer-requests.md` L5, verbatim "Aprobar con recomendaciones (Recomendado)"): every recommended answer was adopted. Questions, evidence and recommendations are kept as drafted; see [approval.md](approval.md).

| ID | Question and evidence | Resolution (recommended answer adopted) |
| --- | --- | --- |
| OQ-1 | Companion rule when a meter is present: at most one other footer child, versus allowing detail, action and meter together. `nowCardFootVariants` uses `justify-between`, so three children would be spread across the row and would need a new layout rule; the reference never combines them (link + meter, or date + icon action). | **Resolved: with a meter present, the footer holds at most one other child.** At most one other child: it reproduces the reference and every approved footer composition without new CSS. Three children stay unsupported and unenforced. |
| OQ-2 | Approval order. This amendment names the StepMeter atom and its props, so it cannot be approved independently of that atom's name and API. | **Resolved: StepMeter v0.1 and this amendment are approved in the same answer, and the name `StepMeter` is final, so no rename follows.** Approve StepMeter v0.1 first, or in the same answer; if the name changes, this document and its paths change in lockstep (the parent renames). |
