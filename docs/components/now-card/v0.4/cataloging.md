# NowCard v0.4 — cataloging decision draft: status band (#564)

- **Status:** **Approved** on 2026-11-27 by the owner's verbatim answer "Aprobar todo (Recomendado)" ([`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md) L13: one answer for this cataloging, the spec and the plan; see [approval.md](approval.md)), with the recommended answers to OQ-1 to OQ-6. The evidence, gates and proposals below are kept as drafted, as the record of the decision: their words "Proposed", "not approved" and "pending the owner" describe the draft and are superseded by this line. It follows the `Borrador de decisión de catalogación` template of [`docs/CATALOGACION.md`](../../../CATALOGACION.md) (lines 80-99) with English headings, and by itself it changes no code, token, dependency, registry entry, catalog row or Git state.
- **Request:** [#564](https://github.com/egdev6/egdev-design-system/issues/564) "Consumer request: show a Now card status as a full-width band" (open, labels `enhancement` and `status:needs-review`; body read from the public GitHub API, read-only, on 2026-11-27), raised from egdev6/egdev-website#45. Interface outcome, verbatim: "The status on a "now" card can read as a full-width uppercase band across the top of the card, as in the Pulso reference, instead of a small sentence-case pill. Today `statusBadge` renders a Badge as supplied inside `flex px-6 pt-6 pb-3` (`now-card/types.ts:41,159`), and Badge only offers `soft | solid` appearances. Low priority." Current mitigation, verbatim: "None in design-system code. The site keeps the current rendering."
- **Owner authority:** S3 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md). L3 deferred #564 out of the round; L12 reopened it, verbatim "hazla", with cataloging, spec and plan approvals before the version fold. The earlier draft is the #564 block of [`odd/tasks/round-5-cataloging.md`](../../../../odd/tasks/round-5-cataloging.md) (lines 55-61): a deferral, `statusPresentation?: 'badge' | 'band'` as the alternative API, and "possibly a band recipe on the Material side, which needs approval". This document replaces the deferral with evidence.
- **Companions:** [spec.md](spec.md) (NowCard v0.4 amendment, Proposed) and [implementation-plan.md](implementation-plan.md) (Proposed). Approving this cataloging approves neither (S6).

## Cataloging decision draft

- **Component:** NowCard, an existing implemented molecule.
- **Level:** molecule, unchanged. It coordinates a status slot, a heading, a body and a footer band as one passive unit (`docs/CATALOGACION.md:27`).
- **Destination:** `@egdev/ui`.
- **Current / proposed path:** `packages/ui/src/molecules/now-card/`. No new folder or file.
- **Radix base:** none. The card is a passive `article`; no Radix primitive exists for a static status label, and the card adds no keyboard, focus or ARIA behavior (v0.2 §2).
- **Decision:** **variant.** An opt-in, part-scoped prop `statusPresentation?: 'badge' | 'band'` on NowCard (default `'badge'`), with the card painting the band through one recipe, R1. Reuse, a Badge variant, composition, extraction and a new component are weighed below; the Badge variant is the one real alternative and is OQ-2.
- **Existing pieces reused:** the Surface root recipe and the surface-0 footer band (unchanged); the `statusBadge` slot and its marker `eg-now-card__badge`; the consumer's decorative `Icon`; existing token utilities, as values, that Badge's brand/soft treatment already uses.
- **Pieces to extract or create first:** none.
- **Blocks or questions:** OQ-1 to OQ-6 below. Nothing blocks drafting. OQ-1 to OQ-3 must be answered before the spec can be approved.

### Evidence

**E1 — The reference's "band" is the `.tag`, stretched by its flex parent.** Read-only: `/home/egdev/proyectos/egdev-website/egdev-foundation/reference-web/pulso-source.html`.

| Aspect | Pulso reference | NowCard + Badge today | Equivalent for a band |
| --- | --- | --- | --- |
| Layout | `.tag{display:inline-flex…}` (`:86`) is a child of `.now-card{display:flex;flex-direction:column;gap:14px…}` (`:198`) with no `align-items`, so it is blockified and stretched to the card's content box. Markup at `:889`, `:898`, `:907` | The root is `flex flex-col items-stretch` (`types.ts:128`) and the wrapper is `flex px-6 pt-6 pb-3` (`types.ts:161`); a Badge is `inline-flex` (`badge/types.ts:38`), so it is a shrink-to-fit item of that row | The status node fills the slot's content box |
| Type | display family, 700, 13px, `letter-spacing:.12em`, uppercase (`:86`) | `font-sans text-label-default`, 11.2px, 600, tracking 0, label as supplied (`badge/types.ts:38`; `theme.css:254-258`) | `font-display text-label-eyebrow uppercase`: 11.2px, 700, 0.12em (`theme.css:259-263`) |
| Shape | `border-radius:4px` (`:86`) | `rounded-full` (`badge/types.ts:38`) | `rounded-sm` = `--radius-sm` 3.2px = 4px ×0.8 (`theme.css:355`) |
| Tint | `--r12` fill, `--r22` border, `--red-200` ink (`:86`) | brand/soft: `text-primitive-red-200 border-alpha-red-22 bg-alpha-red-12` (`badge/types.ts:58`) | The same three utilities (`theme.css:45,99,129`) |
| Padding, gap, icon | `6px 10px`, `gap:8px`, 15px icon (`:86-87`) | Badge `py-1.5 px-2.5 gap-1.5` (`badge/types.ts:38`) | `py-1.5 px-2.5` (4.8px, 8px: the same ×0.8) and `gap-2` (6.4px); Icon `sm` 12.8px (`icon/types.ts:88`) |
| Inset | card padding 24px, compact 16-18px (`:198`, `:556`) | wrapper `px-6` at both sizes; heading `px-6` (md), `px-4` (sm) (`types.ts:138-141`) | `mx-6` (md), `mx-4` (sm): OQ-6 |
| Edge | flat, no shadow | brand/soft adds `shadow-edge` (`badge/types.ts:42`) | `shadow-edge` (Material principle 3, `docs/MATERIAL.md:11`) |

The band is inset in the card padding, left-aligned and not edge-to-edge. The same `.tag` recipe is used elsewhere on the page with absolute positioning (`:295`, `:377`; markup `:1021`, `:1113`).

**E2 — The two design sources disagree, and the DS already decided once.**

- Foundation's own NowCard is `display:flex;flex-direction:column;align-items:flex-start` (`egdev-foundation/design-system/components/bundle.css:266`; the DS legacy copy is `packages/ui/src/styles/legacy/bundle.css:276`), so its tag hugs its content. Its README composes `Tag` ("Tag de actividad"). Only the Pulso page stretches it.
- Foundation's `.eg-tag` is the same recipe as the Pulso `.tag` (`bundle.css:125-133`: display 700 13px .12em uppercase, `--radius-sm`, red tint). The DS fused `Tag` and `StatusBadge` into one `Badge` ("fusionar", `docs/CATALOGO.md:68`, `scripts/catalog_data.py:29`) and kept the pill; the legacy `.eg-tag` stays in the legacy bundle.
- NowCard v0.1 OQ-2 asked "Badge composition, or a new `NowCardTag` part that reproduces the web's … uppercase display tag?" and recommended Badge, recording pill radius and sans typography as allowed differences (`docs/components/now-card/v0.1/spec.md:92,125`). The batch answer resolved every open question as recommended (`odd/tasks/web-catalog.md:132`, L16), and the plan carries R-3: the non-Badge pill is an approved allowed difference that "must not be implemented to 'match the capture'" (`docs/components/now-card/v0.1/implementation-plan.md:113`).
- So #564 asks to reverse a recorded decision for one presentation. Only an owner answer can do that (OQ-1). Caveat: the adoption status of v0.1's VIS-02 capture is stated both ways (`now-card/v0.1/badge-order-approval.md:7` "adoption remains effective"; `now-card/v0.3/spec.md:99` "never adopted"). This draft does not depend on it.

**E3 — NowCard today** (all paths under `packages/ui/src/molecules/now-card/`): the `statusBadge` prop and its JSDoc (`types.ts:35-41`); `nowCardBadgeVariants = cva('eg-now-card__badge flex px-6 pt-6 pb-3')`, no variants (`types.ts:161`); the hook derives `showBadge` (`useNowCard.ts:64`), returns `badgeProps: { className: cn(nowCardBadgeVariants()) }` (`:86`) and root `data-badge` (`:91`); the JSX is `{showBadge && <span {...badgeProps}>{badge}</span>}` (`NowCard.tsx:22`). The tests pin the wrapper's `px-6`, `pt-6`, `pb-3` (`NowCard.test.tsx:62,151`). No CSS file mentions `eg-now-card__badge`: the legacy bundle has no rule for it (grep of `packages/ui/src` finds only `types.ts` and the test). Today's stories compose `<Badge tone='brand' variant='soft' icon={<Icon name='compass' />}>` (`NowCard.stories.tsx:63-78`); egdev-website does the same at `size="sm"` (`src/components/home-sections.tsx:388-397`, read-only).

**E4 — Badge, Surface and Material bands.**

- Badge (`packages/ui/src/atoms/badge/types.ts`): axes `tone` (six) and `variant` `soft | solid` (`:4-5`); a pill (`rounded-full`, `:38`); `className` "supports outer margin/alignment/flex layout only" (`:36`). A consumer can already pass `flex-1` to fill the wrapper, but that keeps pill ends, sans and sentence case, so it does not meet the request. `badgeVariants` is exported (`badge/index.ts:3`) but no other component imports it; cards leave Badge to the consumer (`NowCard.stories.tsx:17-18`: "consumer compositions the card never requires"; `docs/components/project-card/v0.3/spec.md:77`: ProjectCard "does not import Badge").
- Surface (`primitives/surface/types.ts:5-8,24-37`): tones `surface-0…3`, `well`, `overlay`. None is a brand tint, so `surfaceVariants` cannot paint the band.
- Material "Bandas" (`docs/MATERIAL.md:10`, recipe `:65-69`, web use `:80`, `docs/DECISIONES.md:95`) are tonal: a header one step above the body, a footer one step below, edge to edge in a panel (ModuleCard and Panel `banded`). The reference band is a red tint inset in the padding, not a tonal step, so a tonal header band would be a different design. NowCard's footer is already the surface-0 band (v0.2 §6).
- `docs/DECISIONES.md:86` allows neon as text only on `surface-0`. R1's ink is `primitive-red-200`, Badge's existing brand ink, not the neon (`#FF0036`), so it does not conflict. By token arithmetic (not measured), that ink on the 12% tint over `surface-1` is about 7.4:1, and about 6.6:1 under the sheen's 4.5% white at the top edge.

**E5 — Tokens.** Every value the band needs exists: `--color-alpha-red-12` (`theme.css:45`), `--color-primitive-red-200` (`:99`), `--color-alpha-red-22` (`:129`), `--font-display` (`:194`), the `label-eyebrow` step (`:259-263`), `--radius-sm` (`:355`) and `shadow-edge`. **No token is added or changed.** What is not approved is the recipe that combines them on a card slot (R1); that is a recipe decision, not a token decision (`AGENTS.md`: Material compositions need an approved recipe).

**E6 — Registry lookup** ([source](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md)), by meaning and name. No entry declares aliases, so there were none to match, and no entry is named `statusPresentation`.

| Entry (name) | Meaning | Verdict |
| --- | --- | --- |
| `leading-status-badge` (`statusBadge`) | Approved: consumer-supplied non-interactive status node before the heading | **Reused unchanged.** Its text is not edited, so its approval hash holds |
| `visual-treatment` (`variant`) | Approved: visual treatment within a component's responsibility; 32 usages | Rejected for this prop: it is the whole-card axis, and `banded` already means header and footer tonal bands in ModuleCard and Panel |
| `heading-title-variant` (`titleVariant`) | Approved: Heading recipe of a title slot; its avoid text sends a component's own treatment to `variant` | Rejected: meaning is the title's typography recipe |
| `carousel-track-layout` (`trackLayout`) | Approved: Carousel track layout | Rejected: Carousel-specific; its avoid text excludes visual treatment |
| `tab-list-full-width` (`fullWidth`) | Approved: a segmented tab list fills its width | Rejected: Tabs-only boolean, and it avoids arbitrary element width |
| `item-presentation-status` (`status`) | Approved: lifecycle presentation through `data-state` | Rejected: a different meaning; `status` stays reserved |
| `compact-presentation`, `paused-presentation`, `live-presentation` | Approved booleans for other meanings | Rejected: different meanings |
| `section-register` (`register`) | Approved: coordinated scene and material treatment of a section or the footer | Rejected: it avoids a generic visual variant |
| `host-fill` (`fill`), `corner-radius` (`radius`), `label-layout` (`layout`) | Block-size fill, Surface radius presets, Field label layout | Rejected: different meanings |

**Result:** reuse `leading-status-badge` → `statusBadge`; propose one new concept, `leading-status-presentation` → `statusPresentation`, status `proposed`, no approval, NowCard-only type. Convention approval stays separate from spec approval.

**E7 — The v0.3 "frozen props" note.** `now-card/v0.3/spec.md:39` says "No prop, type, export or default changes" and `:43` lists the six NowCard props as "unchanged". Both describe v0.3's own delta, which `:16` scopes to "the only source touch is documentation"; neither is a standing prohibition. The template makes a changed promise a new approval (`skills/_shared/component-spec-template.md:9`), which is this path. The v0.3 StepMeter footer rule (`:13`) is untouched by v0.4.

### Decision gates

| Gate | Verdict | Evidence |
| --- | --- | --- |
| 1. Reuse | **Not enough.** Full width is reachable today (`flex-1` on the Badge), but the uppercase display look, the 4px radius and the card-owned tint are not | E1, E4; Badge `className` is layout-only (`badge/types.ts:36`) |
| 2. Variant | **Yes.** The card keeps its responsibility (a passive current-status article) and gains another presentation of one slot. The real fork is which component paints it: OQ-2 | `docs/CATALOGACION.md:12`; below |
| 3. Compose | **Rejected.** No existing export paints a brand-tinted rectangular label: Surface has no tinted tone and Badge cannot be reshaped by its consumer. An app would hand-write token utilities that `AGENTS.md` treats as an unapproved Material composition | E4 |
| 4. Extract | **Not now.** Only NowCard requests the look. If a second component asks (the same `.tag` is used on covers and thumbnails in Pulso, `pulso-source.html:295,377`), extract R1 into a Badge axis then | `docs/CATALOGACION.md:14` |
| 5. New | **Rejected.** A `NowCardTag` part was the v0.1 OQ-2 alternative that was not chosen; it would add a public part and export, and a new `Tag` atom would duplicate the fused Badge | E2 |
| Block | **None.** OQ-1 and OQ-2 are owner decisions, not missing evidence | |

**The fork (OQ-2).**

| | (a) NowCard paints the band — recommended | (b) Badge gains a `shape` axis; NowCard only places it | (c) NowCard only stretches the supplied Badge |
| --- | --- | --- | --- |
| Look vs the reference | Faithful (R1) | Faithful | Pill ends, sans, sentence case |
| Components changed | NowCard | Badge, a shared atom, plus NowCard | NowCard |
| Extra owner work | None beyond this set | A Badge spec, plan and registry entry, outside this folder | None |
| Cost | A second brand-tint recipe on a card (three token utilities); the band's content is label text, not a Badge; the band is brand-only | A wider blast radius, and the consumer must set two props that agree | Does not deliver the request |
| Reversible | Yes: it is opt-in and the default is unchanged | Harder | Yes |

### Proposed API (after the registry lookup)

| Prop | Type | Default | Rule |
| --- | --- | --- | --- |
| `statusPresentation` | `'badge' \| 'band'` (inline union, no new export) | `'badge'` | `badge` is v0.3 unchanged. `band` paints the slot as a full-width, uppercase, brand-tinted band and frames the supplied label. Has no effect without `statusBadge`. Any other runtime value resolves to `badge` |

- The default output is byte-identical to today's. `statusBadge` keeps its name and type (`ReactNode`); only its JSDoc changes. In `band` the node is the label words and, optionally, a decorative `Icon`, not a Badge, which would paint a second pill inside the band (OQ-5). NowCard does not inspect, strip or warn.
- Proposed convention text (receipt at plan approval, as for `heading-title-variant`): meaning, "How a heading-owning card presents its leading status slot: the supplied node at its content width, or a full-width status band that the card paints around it"; use, "A card that renders a consumer-supplied status node before its heading offers a small finite choice of how that slot is presented, with the default leaving the node as supplied"; avoid, "The component's own visual treatment (use `variant`), the status node's tone or treatment, lifecycle presentation (use `status`), dimension presets (use `size`), arbitrary widths or CSS values".
- Level and package are unchanged; `packages/ui/src/index.ts:78` is `export *` from the NowCard barrel, so an inline union keeps the public export list identical.

### Material recipe and token proposals pending the owner

- **Token: none.** See E5.
- **Recipe R1 (not approved; OQ-3).** On the wrapper in `band`: `mt-6 mb-3 items-center gap-2 rounded-sm border border-alpha-red-22 bg-alpha-red-12 px-2.5 py-1.5 font-display text-label-eyebrow text-primitive-red-200 uppercase shadow-edge wrap-anywhere`, plus `mx-6` at `md` and `mx-4` at `sm` (OQ-6), on the existing `flex`. It is the brand/soft treatment of Badge with a rectangular radius, the eyebrow type and `shadow-edge` (the Pulso tag is flat; the Material rule is no flat replacements, `AGENTS.md`). It is not Surface, not handwritten shadow or gradient, and not a tonal Material band. Declining it means the band cannot ship: no approved recipe paints it.
- **Geometry** is a starting point confirmed in a browser (OQ-6; constraints C1 to C3 in the spec §6). For a one-line label the band occupies the same height as the pill (padding, border and the 1.2 line height are the same), so the heading top should not move between presentations; that is checked, not assumed.

### Impact

- **API:** one optional prop on `NowCardProps`; `statusBadge` JSDoc amended; no export, part, marker, token or dependency change.
- **Classes:** `eg-now-card__badge` stays the public marker. `nowCardBadgeVariants` gains a `presentation` axis; with `badge` its class list is identical.
- **Stories and tests:** one story (`WithStatusBand`) and a new test block; existing stories and tests stay unedited, except one deliberate edit of the pinned v0.3 artifact assertion that lists the card's props (`scripts/design-system-artifact.test.mjs:1715-1741`).
- **Parent-owned integration:** registry (one proposed convention, five NowCard usage revisions), generated view, artifact (the card's `variants` and `anatomy` list `nowCardBadgeVariants`), catalog row (`scripts/catalog_data.py:86`), changelogs, packed checks. `@egdev/ui` stays 0.11.0 and `@egdev/system` 0.13.0 (S2): no token or cli change moves a coupled version.
- **Consumers:** egdev-website opts in per card (`statusPresentation="band"`, and the Badge becomes an `Icon` plus words). Nothing changes for anyone else. ProjectCard's `statusBadge` is not affected.

### Open questions

| ID | Question and evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | **Expected design.** The Pulso page stretches the tag (`pulso-source.html:86,198`); Foundation's NowCard keeps it content-width (`bundle.css:266`); v0.1 approved the pill as an allowed difference (`now-card/v0.1/implementation-plan.md:113`). Is the Pulso band the expected design for an opt-in band presentation, superseding that allowed difference only for `band`? | **Yes.** The default `badge` presentation and the v0.1 decision stay; only the opt-in follows the Pulso page |
| OQ-2 | **Who paints the band?** (a) NowCard, with R1, around supplied label content; (b) Badge gains a `shape` axis and NowCard only places it; (c) NowCard only stretches the Badge (table above) | **(a).** One component, one recipe, no shared-atom change. Extract R1 into a Badge axis only when a second component asks |
| OQ-3 | **Approve recipe R1** (token-backed, brand-only, with `shadow-edge`, no new token) | **Approve as written.** No other approved recipe paints the band |
| OQ-4 | **Prop name and convention:** `statusPresentation: 'badge' \| 'band'` under a new proposed `leading-status-presentation`; root `variant` and the existing entries are rejected (E6) | **As proposed.** The convention receipt is recorded at plan approval, separately |
| OQ-5 | **Slot content in `band`:** keep `statusBadge` (no rename, no second slot, no convention edit) and document that the node is label content, not a Badge | **Keep.** A second slot prop for the same position would need a precedence rule and fork `leading-status-badge` |
| OQ-6 | **Geometry starting point:** horizontal inset equal to the heading's (`mx-6` md, `mx-4` sm), the pill's vertical slot (`mt-6 mb-3`), final values confirmed in a browser | **Yes.** If no value meets C1 to C3, the plan stops and returns to the owner |

### Not evaluated and limits

- No browser measurement, capture or Storybook run was done; nothing here is measured. Contrast is token arithmetic only. Real screen-reader output, zoom and forced colors are not evaluated.
- The issue body was read from the public GitHub API, not with `gh`. The reference and Foundation sources were read read-only; no file in `egdev-website` was changed.
- Visual conformity is **Not evaluated**: no capture exists and no expected design is adopted (VIS-01 Pending in the spec).

### Next step

The owner answered OQ-1 to OQ-6 as recommended and approved this cataloging, the [spec](spec.md) and the [plan](implementation-plan.md) with one answer; each is its own gate (S6) and the cataloging precedes the spec ([approval.md](approval.md)).
