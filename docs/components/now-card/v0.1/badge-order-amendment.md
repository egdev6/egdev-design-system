# NowCard v0.1 — badge-order amendment (docs only)

- **Status:** Proposed. Presented for owner approval together with [badge-order-plan-amendment.md](badge-order-plan-amendment.md). This document changes no code, no registry entry, no catalog artifact and no Git state. The frozen v0.1 contract and plan stay byte-identical.
- **Frozen authorities (verified unchanged in this working tree):**
  - `docs/components/now-card/v0.1/spec.md` — whole-file `sha256:37761116163274164ad1931a64eb59a58382eb8479f00143058fd6ce776e4f37`; canonical payload (`## 1. Purpose and scope` through EOF) reproduces the declared `contentSHA256: 7bd00ad82db7e42f639972fc96dd7f86b0c1fdbf3b8bddeae655fdc5646f5e57` exactly.
  - `docs/components/now-card/v0.1/implementation-plan.md` — whole-file `sha256:083ac7c83362656325b1fda1c8f904baa9ca4afb56e2a9cb5f226af95d9131b9`, matching the pinned value in `docs/components/web-catalog/v0.1/layer-c-plan-approvals.md`.
- **Owner decision this amendment implements (parent-reported, verbatim):** owner chose **"Badge → título → texto (como en la web)"** — the status badge renders before the title, as the web card does — over the anatomy-table heading-first reading. Unit A currently implements heading-first; it therefore remains **partial** until this amendment is approved and applied. This document records the compositional solution, the prop-naming lookup and the acceptance tests; no runtime change is made here.

## 1. Problem

The approved v0.1 spec contradicts itself on one point:

- §2 "Reading order": "DOM order equals visual order — **badge**, heading, body copy, footer detail, footer action" (badge first, matching VIS-02 and the web source).
- §2 anatomy table: "Status badge (consumer-supplied, **first child of the body**)" with a root-generated heading rendered before the body — which forces heading before badge in the DOM.

Unit A followed the anatomy table (heading first). The owner has now resolved the conflict explicitly in favor of the reading-order sentence and the web's visual order.

## 2. Compositional solution (no child-tree inspection or reordering)

The card must not parse, reorder or repair arbitrary consumer children (Panel precedent: "Panel never parses or repairs the child tree"). CSS `order` tricks are also rejected: they would separate DOM order from visual/reading order, which the spec itself forbids, and cannot move a node across containers without `display: contents` hacks.

**Chosen composition:** the status badge becomes an **optional root slot rendered by the card itself as the first DOM child, before the generated heading**. This is the same pattern `ModuleCard` already uses for its root `icon` prop (rendered by the card inside a marked wrapper), so no new composition machinery is introduced:

- `NowCard` renders, in order: optional badge wrapper → generated heading → children (`NowCardBody` copy, `NowCardFooter`).
- The badge stays **consumer-supplied content** (typically `Badge tone="brand" variant="soft"`), never baked in: the card renders the supplied node verbatim inside its own marked wrapper; it takes no tone, label or icon ownership.
- `NowCardBody` content becomes copy only ("one or two short paragraphs; no interactive content"). A badge may still be placed inside the body by a consumer who wants it under the title, but the documented composition for the web parity order is the root slot.
- Absent/null/boolean slot renders no wrapper at all (mirrors `ModuleCard`'s `present()` rule) — never an empty marked element.

## 3. Prop-naming lookup — why a new own prop is needed

Registry: [canonical JSON](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md), looked up by meaning and alias. Candidate approved entries inspected:

| Entry (name) | Meaning | Verdict |
| --- | --- | --- |
| `heading-eyebrow` (`eyebrow`) | Short contextual **plain text** before a primary heading (`string` in PageHeader/SectionHeader) | Not applicable: the slot is a non-interactive node (Badge composition), not a text run |
| `leading-icon` (`icon`) | Optional **decorative** icon beside a label; "avoid … the sole carrier of meaning" | Not applicable: the status badge carries meaning and is readable text, not decorative |
| `thumbnail-badge` (`badge`) | Short annotation **over a thumbnail**, `string` type in `SelectTileOption` | Not applicable: different meaning (overlaid thumbnail annotation vs leading status slot); name `badge` is already bound to that concept, and registry names are globally unique |
| `header-status-text` (`statusText`) | Plain-text note **beside** a panel heading (`string`) | Not applicable: text, beside-not-before, different role |
| `corner-badge-icon` (`badgeIcon`) | Decorative system **glyph** on a corner | Not applicable: not a glyph, not a corner marker |
| `trailing-actions` (`actions`) / `panel-header` (`header`) | Trailing action area / top-of-floating-panel content | Not applicable: different edge and different content responsibility |

**Conclusion: a new own prop is needed.** No approved entry covers "optional consumer-supplied non-interactive status node rendered before the component's primary heading". Per the registry workflow this is a **new concept proposal**, never an inferred approval:

- **Semantic ID (proposed):** `leading-status-badge`
- **Prop name (proposed):** `statusBadge` — follows the registry's compound style (`badgeIcon`, `statusText`); `badge` is unavailable (bound to `thumbnail-badge`), and bare `status` is the lifecycle-enum name (`item-presentation-status`), which this is not
- **Type:** `ReactNode` (optional; absent/null/boolean renders nothing)
- **Meaning (proposed):** "Optional consumer-supplied non-interactive status node, typically a Badge composition, rendered before the component's primary heading."
- **Avoid (proposed):** interactive controls, plain-text eyebrows (use `heading-eyebrow`), trailing content, and baked-in status words.
- Status stays `proposed` with `approval: null` until an owner approval record exists; the implementation task appends the usage with `source.revision = sha256:<post-amendment types.ts whole-file hash>` only after that approval.

## 4. Rejected alternatives (closed set)

| Alternative | Why rejected |
| --- | --- |
| Parse/reorder consumer children so a body badge moves above the heading | Forbidden child-tree inspection; breaks the parts contract |
| CSS `order`/`display: contents` to move the badge visually | Separates DOM/reading order from visual order; spec §2 requires them equal |
| Render children before the heading | Puts copy above the title — wrong order and wrong anatomy |
| Keep heading-first and amend the reading-order sentence instead | Contradicts the owner's explicit answer ("como en la web") |
| Second body-adjacent slot rendered between heading and body | Does not reproduce the web's badge-above-title order |

## 5. Density correction carried by this amendment (sm body step)

The frozen spec promises that `size="sm"` applies "smaller padding, **heading and body** steps", and the VIS-02 compact row shows smaller body copy (web compact: title 20px, copy 15px vs 24/16px). Unit A kept the body at `text-body-large` for both sizes (the approved plan's §4 recipe names only `p-4` as the body's sm step). To honor the frozen promise without inventing a token:

- **Proposed sm body step:** `text-body-default` (12.8px, token `--text-body-default`) in addition to the existing `p-4`. The token set has no 15px step; token steps instead of raw web pixels are an approved allowed difference of this spec.
- Owner choice required (see §7); the alternative is a future authorized spec edit relaxing the body-step promise, which this docs-only amendment does not make.

## 6. Acceptance tests (amendment scope)

Implemented only after both amendments are approved, RED-first, in `NowCard.test.tsx`:

| ID | Observable promise | Test |
| --- | --- | --- |
| NC-A1 (amends NC-05) | A `statusBadge` node renders as the **first DOM child** of the `article`, before the generated heading; DOM order equals visual order (badge → title → copy) | Render with `statusBadge={<Badge tone='brand' variant='soft'>Building</Badge>}`; assert `article.firstElementChild` carries the badge text and precedes the heading element (`compareDocumentPosition`) |
| NC-A2 (amends NC-05) | The slot adds no tab stop and stays non-interactive content; absent/null/boolean renders no wrapper | `userEvent.tab()` lands nowhere inside the card without a footer action; `queryAllByText('Building')` empty and no `.eg-now-card__badge` marker when the prop is omitted |
| NC-A3 (amends NC-04) | `size="sm"` applies the body copy step: body has `text-body-default` (and `p-4`), full copy still renders | Class assertions at both sizes plus visibility of the full sentence |
| NC-A4 (boundary) | The protected-props hook test compiles under `tsc` while still proving runtime stripping at untyped boundaries | Typed fixture built from `ComponentPropsWithoutRef<'article'> & { title: string }` (the real pre-narrowing native surface), passed through **one** documented cast with a written reason (simulating the JavaScript/untyped boundary the hook defends against); no unprotected object-literal excess properties |
| PRESERVE | All existing behavior tests stay green except the two the amendment deliberately rewires (badge moved from body fixture to root slot in `fullCard` and the NC-05 case); heading rank, banded footer, detail, wrap and passivity cases untouched | Focused Vitest run, `--maxWorkers=2` |

Public marker added by the plan amendment: `eg-now-card__badge` wrapper (span, `flex px-6 pt-6 pb-3` proposed), documented as a public part marker alongside `__body`, `__foot`, `__detail`.

## 7. Pending owner choices (closed set)

1. **API:** approve prop `statusBadge` under new proposed convention `leading-status-badge` (recommended), or pick `status`/`eyebrow`-style alternative from §3 (each documented as inapplicable or colliding — a rejection confirms the recommendation).
2. **sm body step:** approve `text-body-default` at `sm` (recommended), or direct a future spec edit that relaxes the "body step" promise and keep `text-body-large`.
3. **Badge wrapper spacing:** approve `px-6 pt-6 pb-3` (recommended, ≈ web's 14px pill→title gap via `--space-3`), or `pb-2`, or no bottom spacing.
4. **Adoption of VIS-02 impact:** confirm the capture stays adopted with the now-achieved badge-first order removed from the allowed-difference list.

## 8. Stop

This amendment authorizes no runtime change, no registry write, no catalog regeneration, no token/dependency change and no Git action. Unit A remains partial (badge order + sm body step + test-boundary compile) until the owner approves both amendment documents and a follow-up implementation task applies them RED-first.
