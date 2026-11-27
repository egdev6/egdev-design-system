# Component contract — Chip v0.3: link-mode current state amendment

- **Version / status:** v0.3 — **Proposed**, never approved. Presented for owner approval together with its [implementation plan](implementation-plan.md), also Proposed. Approving this spec approves neither the plan nor any code, token, dependency, registry write, artifact or catalog regeneration, capture, release or GitHub action (S6). Drafted on 2026-11-27 for Round 5 T5, request #576.
- **Amends:** the approved v0.2 contract ([`../v0.2/spec.md`](../v0.2/spec.md) and its published snapshot [`../v0.2/issue-comment.md`](../v0.2/issue-comment.md), posted on [issue #55](https://github.com/egdev6/egdev-design-system/issues/55) as comment 6573737002 and approved at comment 6576758274 on 2026-11-02 with the owner answer "Aprobar con static y link (Recomendado)", as recorded in [`../v0.2/implementation-plan.md`](../v0.2/implementation-plan.md); the remote comments were not re-read) and, through it, the approved v0.1 pressable contract. Every promise not listed under "Changed promises" in §1 stays as approved. Requested by consumer issue [#576](https://github.com/egdev6/egdev-design-system/issues/576) (egdev-website; found while building the listings in egdev6/egdev-website#50, consumer issue egdev6/egdev-website#49). ODD coverage: S2 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md); the request was filed and scoped in L7 and its cataloging approved in L10.
- **Approval / recovery:** Pending for this spec. The cataloging decision is owner-approved: answer, verbatim, "Aprobar las dos (Recomendado)" ([`odd/tasks/round-5-consumer-requests.md` L10](../../../../odd/tasks/round-5-consumer-requests.md)); the approved decision is the "#576: Chip link current state" item under "Listings (#576, #577), owner-approved 2026-11-27" in [`odd/tasks/round-5-cataloging.md`](../../../../odd/tasks/round-5-cataloging.md). That approval covers the cataloging decision only, not this spec, the plan, tokens or code. Agreed spec location: this file; nothing is published, and the canonical component issue stays #55.
- **Current situation / pending decisions:** existing, implemented atom; this is an additive, link-only amendment. Verified facts ("Evidence" in §1) and proposals (§3, §6) are kept apart. Four open questions (OQ-1 to OQ-4, last section) each carry a recommendation; none needs a token, dependency or Radix package. Pending outside this spec: its approval, the implementation plan and its own approval, the visual captures VIS-02 to VIS-05 (separate authorization) and every acceptance result, because no check for v0.3 has run.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: 72174131b0988846c99664146ba39b096bf1a1035c947fe35709bad17d1e0cae`; `visualHashes: VIS-01 → a45c6772f1ab77e6d14cc45a05c518a17f3ae581e601b4e04884655c548c72ae (historical capture reused from Chip v0.2 VIS-01, not a v0.3 capture); VIS-02 to VIS-05 → Pending`; `approvalReference: Pending (v0.3 Proposed; cataloging approval: odd/tasks/round-5-consumer-requests.md L10, verbatim "Aprobar las dos (Recomendado)")`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/55` (#576 tracks the request; it is not a second canonical contract); `latestPublishedComment: Pending (nothing published for v0.3; remote comment history not checked)`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from the exact whole heading line `## 1. Purpose and scope` (line start, not the inline mention in this header) through EOF, with LF line endings and the recorded final newline. All tracking metadata stays above that heading and is excluded, so the digest cannot depend on itself. A digest is not approval: approval must bind this version, digest and visuals, and any later change to the payload needs a recomputed digest and a new approval.

---

## 1. Purpose and scope

- **Need / non-goals:** Crawlable listing filters (for example `?tag=react` or `?kind=article`) render as link chips (`Chip mode="link"`), and the active filter must be visibly selected and exposed to assistive technology as current. Today the link root forwards `aria-current` (v0.2 leaves it consumer-owned) but paints nothing for it, and `pressed` is no answer: it is the toggle's `aria-pressed` state, which v0.2 rejects on links. The consumer mitigation lives in the app: `aria-current="true"` plus a check icon, with the selected look built by hand (issue #576, "Current mitigation"). v0.3 gives that one state one native carrier: a link chip whose `aria-current` is `page` or `true` is painted as the current item.

  Non-goals: a `current`, `selected`, `active`, `state` or `variant` prop; `data-state`, `aria-pressed` or `aria-selected` on the link root; a built-in check icon (the consumer passes `icon`); a visual difference between `page` and `true` (the distinction is semantic only); any change to the toggle or static paint, to `chipVariants()` called with no argument, to ChipGroup, to size, tones or the stylesheet policy; choosing or enforcing which chip is current (the consumer owns it); routing and focus after navigation; a glow or any new Material treatment.

- **Cataloging decision / alternatives:** **variant** of the existing atom (step 2 of `docs/CATALOGACION.md`), approved at cataloging as: a Chip v0.3 link-mode state painted only through the native `aria-current`, typed as the narrowed union `'page' | 'true'` as in TopBar, reusing Pagination's selected recipe and its forced-colors outline, with no new prop, no `data-state` on the link root and no built-in check icon, `chipVariants()` keeping the toggle recipe so ChipGroup is unaffected; atom, native `a`, size S. Rejected earlier steps:
  - *Reuse as is:* the link chip paints nothing for the state, so every consumer would hand-build the selected look and clone Pagination's recipe in application code.
  - *A `variant`, `state` or `current` prop:* `visual-treatment` excludes a consumer-selected condition, and a second source of truth could disagree with the `aria-current` that assistive technology reads (lookup in §3).
  - *`pressed` on a link:* `aria-pressed` is a button state, and v0.2 rejects it on links.
  - *Compose with ChipGroup:* it is a Radix ToggleGroup of pressable options with selection state, a different interaction pattern from navigation. *Compose with Pagination, NavList or Tabs:* they are not pills, and a filter row is not a page sequence.
  - *Extract or new:* no hidden piece and no new responsibility.
- **Evidence / level and package:** atom in `@egdev/ui`, existing folder `packages/ui/src/atoms/chip/`, native `a`. Inspected in this working tree (branch `integration/round-5`, HEAD `5ed0748`; every file named below is identical to its committed content): the whole files `packages/ui/src/atoms/chip/types.ts` (sha256 `8cdf8fe5…`), `useChip.ts` (`b7320613…`), `Chip.tsx` (`134581b2…`), `Chip.test.tsx` (`bb921114…`), `Chip.stories.tsx` (`e79f557e…`) and `index.ts` (`73ffaf4d…`); `packages/ui/src/molecules/pagination/types.ts` (`b947a96e…`, recipe at lines 115–126); `packages/ui/src/molecules/chip-group/useChipGroup.ts:89` (the `chipVariants()` consumer); `packages/ui/src/index.ts:7` (`export * from './atoms/chip'`); the registry `skills/_shared/prop-naming.json` (191 entries); the approved [Pagination v0.1 spec](../../pagination/v0.1/spec.md) (§5 forced colours, §6 recipe R1) and its [implementation evidence](../../pagination/v0.1/implementation-evidence.md) (F1); issue #576 read with `gh issue view 576` (the consumer repository was not read). Verified facts:
  1. `ChipLinkProps` (`types.ts:80`) inherits `ComponentPropsWithoutRef<'a'>` minus `children` and `href`, so `aria-current` is typed today with the full native union (`boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time'`) and forwarded untouched: `useChip.ts` spreads `...rest` onto the anchor and handles no `aria-current`.
  2. The link recipe (`types.ts:124`) contains no `aria-current` utility, and its focus treatment is `focus-visible:outline-none focus-visible:shadow-focus` with no forced-colors rule. Derived from the recipe, not browser-observed: forced colours drop shadows, so a focused link chip shows no focus indicator there today.
  3. Pagination's current page ships the selected recipe at `pagination/types.ts:120-123`: line 120 the `aria-[current=page]:` border, fill, edge shadow and text, line 121 the compound focus ring, line 122 the forced-colors focus outline and line 123 the forced-colors current outline. Pagination's evidence F1 records that in forced colours the focus on the current page cannot be told from its resting state, because both compute the same outline.
  4. `aria-current` is declared as a narrowed item field in TopBar (`top-bar/types.ts:13`), TabBar (`tab-bar/types.ts:18`), Footer (`footer/types.ts:21`), ModuleRail (`module-rail/types.ts:14`) and NavList (`nav-list/types.ts:66`), all `'page'`, and CalendarGrid (`calendar-grid/types.ts:38`, `'date'`). None has a registry entry.
  5. No component in the repository passes `aria-current` to a link Chip: `mode='link'` appears only inside the Chip folder.
  6. The approved v0.2 text predates two recipe changes: the 44.8px coarse-pointer target (`682ec93`: `pointer-coarse:min-h-14`, where v0.2 says `min-h-11`) and the accent-following selected border (`aced24d`: `border-state-selected/60`, where v0.2 says `border-primitive-red-neon/60`). v0.3 anchors its facts to the source and restates neither value as a promise.
  7. The v0.2 declared digest (`958fb7fd…`) reproduces only when the payload starts at the inline mention of the heading in the header line, an unanchored match. Under the anchored rule both the v0.2 `spec.md` and `issue-comment.md` hash to `18fec340…`. v0.3 therefore binds v0.2 by its approval references, not by either digest; correcting v0.2's metadata is outside this amendment.

- **Changed promises** (everything else in v0.2 stands):

| v0.2 promise | v0.3 |
| --- | --- |
| §3 native props: "`aria-current` and `aria-describedby` are consumer-owned in link mode" | `aria-current` stays consumer-owned but is narrowed to `'page' \| 'true'` in link mode and painted as the current item; `aria-describedby` is unchanged |
| §6 link recipe (`types.ts:124`) | The link recipe gains 19 static utilities (§6); a non-current link chip keeps its v0.2 set |
| §5 link focus: `focus-visible:shadow-focus` with the outline removed | Adds the compound ring for the current chip and, under forced colours, the system-colour outline for focus and for the current state (OQ-1) |
| §3 compatibility: `chipVariants()` "keeps the current class output" | Still true for no argument, `toggle` and `static`; `chipVariants({ mode: 'link' })` gains the 19 utilities |
| §4 limits: the consumer owns `aria-current` | Ownership is unchanged; the component now paints the attribute |

## 2. Anatomy and composition

Exactly one root element per instance, chosen by `mode`, as in v0.2; the current state adds no element, part or marker.

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Root — toggle (default) | Pressable pill, pressed state, focus | `TogglePrimitive.Root` → `button type="button"` | Icon part and label (unchanged) |
| Root — static (`mode="static"`) | Non-interactive label pill | native `span` | Icon part and label text only (unchanged) |
| Root — link (`mode="link"`) | Navigation pill; with `aria-current` `page` or `true` it is also the current item | native `a` with required `href` | Icon part and label |
| Icon | Optional decorative leading visual; on a current chip the consumer may pass a check glyph as a non-colour cue | `span aria-hidden="true"`, 14px wrapper | Consumer `ReactNode`; never focusable content |
| Label | Accessible name and visible text | text inside the root | Short, non-empty, non-truncating text |

- **Radix / composition:** no Radix primitive for the link root, as in v0.2; `@radix-ui/react-toggle` stays the toggle's only primitive. No new package or dependency. `asChild` stays unavailable in every mode, so a consumer router intercepts `onClick` on the anchor.
- **Public markers:** the stable root class `eg-chip` stays on all three roots. No new marker, no `data-testid`, no `data-state` and no `eg-chip--current` class: the state is the native `aria-current` alone, and the link root exposes no own state attribute (v0.2 §4, unchanged).

## 3. Public API

- **Prop conventions:** registry source [`skills/_shared/prop-naming.json`](../../../../skills/_shared/prop-naming.json), generated view [`docs/prop-naming.md`](../../../prop-naming.md), lookup workflow [component-contract.md](../../../../skills/_shared/component-contract.md#prop-naming-registry). Lookup on 2026-11-27 by meaning, name and aliases over 191 entries (186 approved, 5 proposed), with the terms current, active, selected, selection, pressed, state, aria, link, navigation, page, filter, check and mark (names, IDs and aliases, then a second pass over the meaning, use and avoid texts for `aria-current` and "current"); no alias matches any of them. Entries examined:

| Entry ID (prop) | Registry meaning | Result |
| --- | --- | --- |
| `pressed-state` (`pressed`) | Controlled on/off state of a toggle, exposed as `aria-pressed` | Not applicable: a button state, wrong for navigation; v0.2 keeps `pressed` toggle-only |
| `consumer-selected-condition` (`state`) | Consumer-selected interpretation of a measurement or position marker | Not applicable: its domain is measurement conditions |
| `visual-treatment` (`variant`) | Visual treatment within a component's responsibility; avoid: consumer-selected condition | Not applicable: the current state is a consumer-driven condition, not a presentation |
| `active-row` (`activeRowId`) | Id of the current row of a data collection, exposed as `aria-current` | Not applicable: an id of a collection row, not the state of one link |
| `active-section-id` (`activeId`) | Current section id in an ordered section navigation | Not applicable: the identity of a section in an organism |
| `render-mode` (`mode`, approved, receipt [`../v0.2/render-mode-approval.json`](../v0.2/render-mode-approval.json)) | Role and rendered element | Reused unchanged: the state exists only for `mode="link"` |

  **Result: no registry entry applies and no new concept is proposed: no new own prop, no semantic ID and no exception.** `aria-current` is an inherited native attribute, which the contract exempts from an own entry unless an explicit semantic policy is proposed, and its narrowing follows the item-field precedent of six components that have no entry either (the registry mentions `aria-current` only in the `active-row` meaning). No usage is appended. At implementation the seven existing Chip usages (`leading-icon`, `pressed-state`, `initial-uncontrolled-pressed`, `pressed-change`, `new-tab-navigation`, `new-tab-notice`, `render-mode`; each `source.revision` is `sha256:8cdf8fe5…`, the whole-file hash of `types.ts`) need their revision refreshed because `types.ts` changes: that is source-evidence freshness, not an approval (plan §5.1). Convention approval stays separate, and none is requested (OQ-4).

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `aria-current` (link branch only; inherited native attribute, narrowed) | `'page' \| 'true'` | No | Absent → not current | Marks the link chip as the current item: `page` when the destination is the page being shown, `true` for the current item of a set that is not a page sequence, such as the active filter. Both paint the same current treatment and are exposed natively to assistive technology. Any other native token (`step`, `location`, `date`, `time`), `'false'` and booleans are compile-time errors in link mode; at runtime the attribute is still forwarded unchanged and not painted. |

```ts
// Only the changed branch; every other prop of v0.2 §3 is unchanged.
export type ChipLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'href' | 'aria-current'> &
  ChipCommonProps & {
    mode: 'link';
    href: string;
    /**
     * Marks the link as the current item: `page` when the destination is the page being shown, `true` for the
     * current item of a set that is not a page sequence, such as the active filter. Both paint the same current
     * treatment; any other token does not compile.
     * @control false
     * @controlReason The row merges the native unions of all three modes, which mix booleans and strings; see the LinkCurrent story.
     */
    'aria-current'?: 'page' | 'true';
    external?: boolean;
    newTabText?: string;
    pressed?: never;
    defaultPressed?: never;
    onPressedChange?: never;
    disabled?: never;
  };
```

  The contract requires JSDoc and `@control` on every own declaration, and this narrowing is an own declaration even though the attribute is inherited. The directive is proposed as `@control false` with a concrete reason because the merged Controls row spans the native unions of all three modes (booleans and strings), and `select` needs a finite primitive enum. It is confirmed or corrected against the real extraction at implementation under the contract's rules (plan §5.2); a different directive changes only this tag, never the promise.

- **Native props / refs:** the link branch otherwise inherits the `a` props as in v0.2, except that `aria-current` is now the narrowed declaration above. Toggle and static keep the full native `aria-current` union, forward it and never paint it. No ref in any mode (unchanged).
- **Controlled / uncontrolled:** Not applicable. The state is a consumer-owned attribute; the component keeps no state and emits no event for it.
- **Compatibility:**
  - Runtime: the toggle and static output is byte-identical, `useChip` and `Chip` are unchanged, and the exports (`Chip`, `ChipProps`, `ChipMode`, `chipVariants`) and markers are unchanged, with no new export. A link chip's markup differs only by the 19 static utilities in `class`.
  - Recipe: `chipVariants()` still equals `chipVariants({ mode: 'toggle' })`, so ChipGroup (`useChipGroup.ts:89`) is unaffected. `chipVariants({ mode: 'link' })` is public output and gains the utilities, so a consumer that spreads it onto its own anchor gets the current paint too.
  - Types: a compile-time-only break for a link chip that passes another `aria-current` token or a boolean. The 0.x policy allows a type narrowing in a minor version, and the 0.11.0 changelog records it. The known consumer (egdev-website) passes the string `"true"`, per the issue, so it is unaffected.
  - Visible change: any consumer that already sets `aria-current` `page` or `true` on a link chip now gets the painted state. That is the request, and it is not opt-in.
  - React versions: no claim beyond types; the plan runs the packed harness on React 18.3.1 and 19.3.0.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Link, default render, no `aria-current` | `a[href]` with `eg-chip` and the rest paint; no `aria-pressed`, no `data-state`, no `role` (as v0.2) | None |
| Link, `aria-current="page"` | The same element and classes, painted as the current item; assistive technology announces the current page in its own wording | None |
| Link, `aria-current="true"` | Identical paint; announced as current in the assistive technology's own wording | None |
| Current chip, hover (fine pointer) | Keeps the current paint: border, fill and edge shadow do not change | None |
| Current chip, keyboard focus (`:focus-visible`) | The focus ring (`--shadow-focus`) replaces the edge shadow; blur restores it; the border and fill stay | None |
| Current chip, click or Enter | Native navigation (a self-link); `onClick` composed as in v0.2; Space does not activate | `onClick` |
| Rerender: `aria-current` added, removed or switched between `page` and `true` | The paint follows the attribute at once; Chip emits no event, moves no focus and announces nothing | None |
| Link, runtime `aria-current` outside the union (`step`, `location`, `date`, `time`, `false`) through untyped code | Forwarded unchanged; not painted; no warning | None |
| Link, boolean `true` through untyped code | React renders `aria-current="true"`, so it is painted like `true`; a type error in TypeScript | None |
| Toggle or static with `aria-current` | Forwarded as before; never painted, because their recipes contain no current utility | None |
| ChipGroup items | Unchanged | None |

- **States / representation:** the current state is the native `aria-current` alone, styled through `aria-[current=page]:` and `aria-[current=true]:` variants. No `data-state`, no mirrored class, no `pressed` semantics. The link root still exposes no own state attribute and is never styled through `data-[state]`.
- **Limits / consumer responsibilities:**
  - The consumer decides which chip is current and keeps the attribute in sync with the route or filter. At most one current chip per set is the recommended pattern, and it is not enforced.
  - The paint is tonal: a consumer who needs a cue that survives losing colour passes `icon` (OQ-2).
  - The v0.2 rules stand: labels stay short, the consumer owns list or `nav` semantics, router interception and any announcement after a client-side navigation, and one mode per visual group applies, so a pressed toggle and a current link chip are not mixed in one group.
  - `className` stays outer layout only: a consumer border, background or shadow utility that collides with the current recipe is a documented limitation, not a supported override.

## 5. Accessibility

- **Accessible name / roles / relationships:** unchanged. The link is a native `a` named by its label text, the icon stays hidden, and `external` appends the hidden new-tab notice inside the anchor. The state is `aria-current` and nothing else: no `aria-pressed`, `aria-selected`, role or hidden "current" text is added, because assistive technology announces `aria-current` in its own language (the Pagination precedent). Required consumer input: set `aria-current` to `page` or `true` on exactly the chip that represents the current item and on no other, and name the enclosing `nav` or list.
- **Keyboard / focus:** unchanged and native: link chips are in the Tab order, Enter activates, Space does not. The focus ring is `--shadow-focus` on `:focus-visible`; on a current chip it wins over the edge shadow through a compound selector.
- **Announcements / other conditions:**
  - **Announcements:** none from Chip. A route or filter change is announced by the consumer if needed.
  - **Colour independence:** the current chip differs from the rest by its neon border, brand-tinted fill and brighter text, all tonal, and Chip adds no glyph (cataloging decision). The state is programmatic through `aria-current`. A consumer who needs the state to survive colour loss passes `icon` with a check glyph, as the `LinkCurrentWithIcon` story shows. In forced colours the current chip gains a system-colour outline, a cue that is not hue (OQ-2).
  - **Contrast (borrowed, not re-measured for Chip):** the Pagination spec hand-computed the default-accent neon border at 4.61:1 on `surface-0`, 4.30:1 on `surface-1` and about 3.5:1 against the current fill, with white text at about 14:1 on the fill. Chip uses the same tokens, so the plan recomputes the values on the Chip and records them. Over translucent hosts the contrast is Not evaluated. A host accent re-themes the border and fill through `state-selected` and `gradient-chip-active`, as it does for the toggle.
  - **Forced colours:** shadows and backgrounds are dropped, so the focus ring and the current state use a system-colour outline (`Highlight`, `--focus-width`); the UA paints the border, and the current chip is told apart by the outline, never by hue. Inherited limit (Pagination F1): in forced colours the focus on the current chip is indistinguishable from its resting state, because both compute the same outline. Chromium emulation is the planned evidence; Firefox and real Windows High Contrast are Not evaluated.
  - **Touch targets and motion:** unchanged (`pointer-coarse:min-h-14`, the existing `transition-colors` that fades border and text colour; no transform, no new transition and no animation).
  - **Not evaluated:** screen-reader output for `aria-current="true"` on a link (the wording differs by assistive technology), RTL appearance, zoom and reflow, contrast over translucent hosts, protan and deutan simulation.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `mode` | `toggle`, `static`, `link` | `toggle` | Unchanged; the current-state paint exists in `link` only |
| Current state (not an axis) | `aria-current` = `page` or `true` | Absent | Link only; `page` and `true` paint identically; toggle and static never paint it |
| Size | none | — | Unchanged; no `size` axis |

- **Tokens / Material:** the current state is painted by the selected-pill recipe that Pagination's current page already ships (`pagination/types.ts:120-123`, itself the Tabs `outline` treatment at `tabs/types.ts:229-234`), applied to the link root through `aria-[current=page]:` and `aria-[current=true]:` variants. It is proposed here as **recipe R1 of Chip link mode** and is in force only once this spec is approved. Static literals appended to the link recipe in `types.ts` (no other recipe changes):
  1. **Current paint (8):** `border-state-selected`, `[background:var(--gradient-chip-active),var(--color-surface-1)]`, `shadow-[var(--shadow-edge-strong)]` and `text-fg-default`, each with the `aria-[current=page]:` and the `aria-[current=true]:` prefix.
  2. **Focus compound (2):** `aria-[current=page]:focus-visible:shadow-focus` and `aria-[current=true]:focus-visible:shadow-focus`. They carry one more selector than R1's edge shadow, so the ring wins; `--shadow-focus` wins over Material shadows (`docs/MATERIAL.md`).
  3. **Forced colours (9):** `forced-colors:focus-visible:outline-solid`, `forced-colors:focus-visible:outline-(length:--focus-width)` and `forced-colors:focus-visible:outline-[color:Highlight]`, plus the same three behind `forced-colors:aria-[current=page]:` and behind `forced-colors:aria-[current=true]:`.

  The 19 utilities are all static literals. The existing link utilities (`hover:`, `focus-visible:outline-none focus-visible:shadow-focus`, `transition-colors`, `pointer-coarse:min-h-14`, `no-underline`) stay, so a hovered or focused non-current link chip is unchanged. On the current chip only, the attribute variants override the base hairline border, `shadow-edge` and `text-fg-secondary` by specificity (class plus attribute).
  - **Material semantics:** R1 adds no surface, well, overlay, glow or gradient of its own, only token references. `Highlight` is a CSS system-colour keyword, not a token (precedent: Pagination, Carousel R1, ColorSwatchGroup). The border is the full `state-selected` (the toggle's `on` uses a 60% mix) and the shadow is the edge alone (the toggle adds `--shadow-glow-base`): this is deliberately the navigation selected recipe, not the pressed recipe, so a current link chip is calmer than a pressed toggle chip. That difference is allowed.
  - **Hover:** the current paint wins over the link hover utilities (the same properties at equal specificity, resolved by emission order). This is a promise to prove on the emitted CSS, not to assume (plan G6); a hovered current chip does not change (OQ-3).
  - **Reduced motion and transparency:** the existing `transition-colors` fades border and text colour only, the fill and the shadow swap instantly, and no transform or new transition is added. The recipe uses a solid `surface-1` under the gradient, so no transparency fallback is needed.
  - **Tokens and dependencies:** none new. No hardcoded colour, shadow, gradient, spacing or font.
- **Dynamic geometry:** Not applicable. No inline style, custom property or interpolated class string; the 19 utilities are static strings. The Gauge, PreviewFrame and ColorSwatchGroup exceptions are neither used nor extended.
- **Class composition / consumer layout:** `className` merges last through `cn()` for outer layout (margin, alignment, flex and grid placement), unchanged, and `eg-chip` is never dropped. `twMerge` keeps all 19 utilities because their variant prefixes differ from the base utilities (planned test, AC-04). A consumer colour, border or shadow utility that collides with R1 is a documented limitation, not a supported appearance override.
- **Files / pending proposals:** the six mandatory files keep their roles: `types.ts` (the CVA `chipVariants` link recipe with the 19 utilities and the narrowed `aria-current` declaration with English JSDoc and `@control`), `useChip.ts` (no change expected: the attribute reaches the anchor through `...rest`), `Chip.tsx` (no change), `Chip.test.tsx` (compile fixtures, class contract, emission and cascade checks, runtime forwarding, PRESERVE cases), `Chip.stories.tsx` (adds `LinkCurrent` and `LinkCurrentWithIcon` and updates the meta text) and `index.ts` (no change: no new export). **No stylesheet**: no `chip.css`, and the legacy bundle stays byte-identical. No additional internal module, no token, dependency or Radix change. Documentation outside this folder that becomes stale is proposed separately: `docs/CATALOGO.md:67` still says "always-pressable"; it is generated from `scripts/catalog_data.py:28` and is corrected there, never by hand (plan §5.4).

### Expected-design visual reference

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | [`docs/design/foundation-boards/v2026-10-17/Chip.png`](../../../design/foundation-boards/v2026-10-17/Chip.png) — "Grey raised pills with bold labels, two with leading icons, and an interactive row showing default, hover (lighter) and active (red-tinted with glow) chips" | Foundation rows: off, hover and on toggle (the base pill) | Foundation `components/Chip/preview.html`, board set v2026-10-17; **reused historical capture**, source capture version v2026-10-17, cited by Chip v0.2 VIS-01 and now by v0.3 | Approved as the v0.1 expected design for the toggle look only (owner instruction 2026-10-17, review in #55); in v0.3 it supports only the unchanged base pill and is not a link or current-state reference |
| VIS-02 | **Pending**, no image exists. Planned alt: "A row of four link chips on a dark surface: three at rest with a hairline border and grey text, and one in the current treatment with a neon border, a brand-tinted fill and brighter text." | Principal: `mode="link"`, one chip with `aria-current="true"`, default tokens, dark grafito host | Observed after implementation | Proposed; no approval |
| VIS-03 | **Pending**. Planned alt: "The same row with a check icon before the label of the current chip." | Additional: `icon` check on the current chip, `aria-current="page"` | Observed after implementation | Proposed; no approval |
| VIS-04 | **Pending**. Planned alt: "A current link chip and a link chip at rest, each showing the keyboard focus ring." | Additional: keyboard focus on a current and on a non-current chip | Observed after implementation | Proposed; no approval |
| VIS-05 | **Pending**. Planned alt: "The principal row under forced-colours emulation: the current chip has a system-colour outline that the chips at rest lack." | Additional: forced colours | Observed after implementation | Proposed; no approval |

- **Conditions / provenance per VIS ID:** VIS-01 keeps its original conditions (Playwright MCP, Chromium 148, 1280×900, hover simulated with the legacy `.is-hover` class; taken from the v0.2 record, not re-verified). VIS-02 to VIS-05: no capture exists. The plan's browser procedure would produce them only after separate authorization: Chromium, 1280×900, dark grafito host, device scale 1, loaded fonts and the motion and forced-colours settings recorded, component-zone crop, named `<variant>--<state>--<viewport>--<theme>.png` under `docs/components/chip/v0.3/` with `capture.json`.
- **Intent / acceptance / pending evidence:** anatomy and geometry are unchanged (pill `min-h-8`, `rounded-full`, icon then label). The current chip differs only in border, fill, edge shadow and text tone; that is the whole allowed difference. Related criteria: AC-04 to AC-08. No token value may be inferred from pixels. Visual conformity of the current state is **Not evaluated**: no expected design exists for it (Pagination's R1 has none either) and the captures are Pending. Captures never replace behavior or accessibility checks.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | PRESERVE — toggle and static are unchanged: `chipVariants()` equals `chipVariants({ mode: 'toggle' })`, neither the toggle nor the static class set contains an `aria-[current` utility, and the static set still resolves no interactive utility (v0.2 AC-06) | `Chip.test.tsx`: the existing recipe cases unmodified plus one "no `aria-[current`" assertion; the ChipGroup suite unmodified | Default, Static; ChipGroup stories unchanged | Pending |
| AC-02 | PRESERVE — a link chip without `aria-current` renders as in v0.2 (`a[href]`, `eg-chip`, no `aria-pressed`, no `data-state`; Tab, Enter, Space, the `external` notice, the runtime boundary and `className` unchanged), and the link class set minus the 19 new utilities equals the v0.2 link set pinned in the test | `Chip.test.tsx`: the existing link cases unmodified plus one pinned-set equality case | Link, ExternalLink | Pending |
| AC-03 | `aria-current="page"` and `"true"` reach the one `a` as native attributes: same element, accessible name equal to the label (plus the external notice), `eg-chip` kept, and no `data-state`, `role`, `aria-pressed`, `aria-selected`, `style`, extra element or state class | `Chip.test.tsx`: `getByRole('link', { name })` with both values, with and without `external` | LinkCurrent | Pending |
| AC-04 | Class contract: the link recipe adds exactly the 19 static utilities of §6; all survive `cn()` with a consumer `className`, which stays last; none of a literal colour, shadow or gradient, `opacity-`, `animate-`, a transform utility, `style`, an interpolated string or an `is-*` class appears | `Chip.test.tsx` class assertions and a static-literal scan of the recipe | LinkCurrent; VIS-02 | Pending |
| AC-05 | Emission: each utility emits its declaration from the named token only under `[aria-current="page"]` or `[aria-current="true"]` (never under another value or a bare `[aria-current]`), the forced-colours rules sit inside `@media (forced-colors: active)`, and no `.eg-chip` rule is emitted | `Chip.test.tsx` E1 on the production CSS build; packed CSS in `package-exports.test.mjs` and, through `assertChipCSS`, in `package-consumption.test.mjs` (a package consumer without a Tailwind compiler) | Not applicable | Pending |
| AC-06 | Hover and cascade: on the emitted CSS the current rules follow the link hover rules, so a hovered current chip keeps its border, fill and edge shadow; the base hairline border, `shadow-edge` and `text-fg-secondary` yield to R1 on the current chip only | `Chip.test.tsx` E2 order and specificity assertions; browser computed style on hover with a fine pointer | VIS-02 | Pending |
| AC-07 | Focus: the compound `aria-[current=…]:focus-visible:shadow-focus` outranks R1's edge shadow, so a focused current chip shows the ring alone and the edge shadow returns on blur; a focused non-current link chip is unchanged; the test is shown able to fail | E2 plus the failing-focus proof; real keyboard Tab in the browser | VIS-04 | Pending |
| AC-08 | Forced colours: a focused link chip and a current link chip compute a solid `--focus-width` outline in `Highlight`, an unfocused non-current chip computes none, and the current chip is told apart by the outline | E1 rules inside the media block and E2 order after `outline-none`; Chromium `forced-colors: active` emulation (computed style) | VIS-05 | Pending |
| AC-09 | Types: link mode accepts exactly `'page' \| 'true'` for `aria-current`; `'step'`, `'location'`, `'date'`, `'time'`, `'false'`, `true` and `false` are rejected; toggle and static still accept the native union | `Chip.test.tsx` compile fixtures (`@ts-expect-error` rows and accepted rows); `pnpm typecheck`; the package consumer positive and negative samples | Not applicable | Pending |
| AC-10 | Runtime boundary: an out-of-union value (`step`, `false`) passed through a cast is forwarded unchanged and not painted, because the emitted selectors match only `page` and `true`; toggle and static forward `aria-current` unchanged and are never painted | `Chip.test.tsx` forwarding per mode; E1 selector strictness; a browser probe | Not applicable | Pending |
| AC-11 | No new API surface: no `current`, `selected`, `active`, `state` or `variant` prop, no `data-state` on the link root, no new export, no ref or `asChild`; the own declarations of `ChipProps` differ from v0.2 only by the narrowed `aria-current` | AST and docgen metadata test; `index.ts` and public-barrel inventories unchanged | All stories | Pending |
| AC-12 | Consumer cue: with a consumer `icon` on a current chip, the icon wrapper stays `aria-hidden` and the accessible name is still the label only | `Chip.test.tsx` | LinkCurrentWithIcon; VIS-03 | Pending |
| AC-13 | Metadata: the narrowed `aria-current` row carries a valid directive with no diagnostics, no argument is injected, and the new stories are exported | `storybook-docgen.test.ts` and `storybook-controls.test.ts`; Controls checked in the browser | LinkCurrent, LinkCurrentWithIcon | Pending |
| AC-14 | Registry and artifact: the seven Chip usages carry the final `types.ts` hash and nothing else changes in the registry; the artifact lists the narrowed prop and the new link utilities and nothing else changes in Chip's entry | `pnpm props:docs`, `props:check` and `test:props`; `artifact --write` and `--check`, `system:docs`, `system:check`, `test:artifact` and `test:system` | Not applicable | Pending |
| AC-15 | Documentation: the catalog row no longer says "always-pressable" and describes the three modes and the v0.3 state; the 0.11.0 ui and system changelogs cite `(#576)`; stories and JSDoc are English | `scripts/catalog_data.py` plus `build_catalog.py`; changelog diff; story text review | Not applicable | Pending |
| AC-16 | Packed build: the shipped CSS contains the selectors; the server rendering of `<Chip mode="link" aria-current="true">` emits the attribute and the link class set; React 18.3.1 and 19.3.0 consume the typed samples | `package-exports.test.mjs`, `package-consumption.test.mjs` | Not applicable | Pending |
| AC-17 | Visual conformity of the current state stays **Not evaluated** until captures exist and an expected design is adopted | Not a test | VIS-02 to VIS-05 | Pending |

### Spec closure

- [x] All seven blocks are complete or justified as Not applicable (dynamic geometry and controlled state).
- [x] The registry lookup is recorded with exact entry IDs and results; no new own prop, convention or exception is proposed, and convention approval stays separate (OQ-4).
- [x] Proposals, verified facts, planned checks and observed results are distinct; every promise has an acceptance ID and a method; nothing is claimed as observed.
- [x] Visual IDs identify provenance and conditions; VIS-01 is a reused historical capture and VIS-02 to VIS-05 are Pending, not verification.
- [ ] Snapshot identity is recoverable and the owner approval identifies this exact version, digest, visual hashes and scope — **Pending**; the status stays Proposed until then.
- [x] One canonical component issue is retained (#55); v0.3 is published later, if authorized, as a comment that identifies the previous snapshot, never as a body edit or a new issue.

### Open questions for owner approval

| ID | Question | Recommendation |
| --- | --- | --- |
| OQ-1 | Does the forced-colours focus outline apply to every link chip, or only to the current chip? Pagination's reused recipe gives it to every link, and link chips have none today (derived, fact 2). | **Every link chip**, for Pagination parity. It is forced-colours only, it fixes the invisible focus ring of link chips there, and it is additive. The toggle has the same gap and is left for a separate amendment. The inherited limit (fact 3, F1) is accepted and documented. The alternative, the current chip only, leaves non-current link chips without a visible focus in forced colours. |
| OQ-2 | The current paint is tonal and the contract says colour never goes alone. Is a non-colour cue a documented consumer obligation or a requirement? | **Documented only**: the consumer passes `icon` with a check glyph (`LinkCurrentWithIcon`), and Chip neither requires nor enforces it, as decided at cataloging. `aria-current` and the forced-colours outline are the non-colour carriers otherwise. Requiring an icon would need a built-in glyph or a runtime check, which the cataloging decision excludes. |
| OQ-3 | Does a hovered current chip keep its current paint? | **Yes**, as the toggle's `on` and Pagination's current page do. The chip is already current, and letting hover change it would hide the state under the pointer. |
| OQ-4 | Should the narrowed `aria-current` become a registry convention (a `current-item` concept for Chip and the six existing item fields)? | **No.** It is a native attribute narrowed in six places without entries. A convention would approve a naming rule globally and invite an unrequested migration, and convention approval is separate from this spec. No usage is appended; only the seven Chip revisions are refreshed. |

Owner approval with the recommended answers folds them into these bytes and moves the digest; the plan's pinned digest and every section that depends on OQ-1 to OQ-4 must then be re-read against the approved bytes before the plan gate.

**Next step:** the owner answers OQ-1 to OQ-4 and approves this exact version; the [implementation plan](implementation-plan.md) (Proposed) needs its own, separate approval. This spec authorizes no code, token or dependency change, registry write, catalog or artifact regeneration, capture or external write.
