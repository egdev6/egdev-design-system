# Component contract — ProjectCard

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval (G4), the A1 delta (G1) and the separate scrim decision (G3). No implementation is authorized.
- **Approval / recovery:** v0.1's immutable [spec](../v0.1/spec.md) and [implementation plan](../v0.1/implementation-plan.md) record the v0.1 payload and owner approval at [#275 comment 6580403446](https://github.com/egdev6/egdev-design-system/issues/275#issuecomment-6580403446). Its header is historical. This draft has no v0.2 approval; a plan requires separate approval.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending finalization`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/275`; `latestPublishedComment: Pending for v0.2`.
- **Hash definition:** SHA-256 of UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading through EOF including final newline; tracking metadata above is excluded. Finalize before publication and bind approval to the exact payload and identified visuals.

## 1. Purpose and scope

ProjectCard is a passive `@egdev/ui` molecule for consumer-authored projects, tools and experiments: optional decorative ordinal and eyebrow, generated heading, free body, static technology tags, labelled code sample and one supplied footer action. It is not a grid, whole-card link, project model, router, analytics, fetcher, statistics widget or animated isotype. The only change to the v0.1 non-goal of images is the decorative backdrop and optional trailing mark below; neither is a general meaningful media API. Tags have no icons.

**Delta A1 / S1:** add optional `ProjectCardBackdrop` and `ProjectCardMark` parts in the upper zone, without new root `src`, `alt`, `backgroundImage` or `style` props. Without either part preserve today's structure byte-for-byte, including no isolation wrapper. Index remains a separate flow line above the eyebrow. New placement, paint and exports are proposals, not existing behavior. Owner request: "Project card -> le añadiría lo de la imagen [Image#11]".

**Cataloging:** retain the existing molecule and compose additive parts rather than create a new card or widen ModuleCard/ListItem responsibilities. v0.1 rejected reuse, a variant, page-only composition and extraction for its coordinated project-card responsibilities; `ProjectsGrid` remains a composition recipe, not an export. Source evidence: `packages/ui/src/molecules/project-card/{types.ts,useProjectCard.ts,ProjectCard.tsx,index.ts}` and `packages/ui/src/index.ts` show the existing public root and three parts; no backdrop or mark exists. The catalog and general architecture state conflicting availability claims, while the inspected working tree exports ProjectCard and Surface; source presence is not a claim of package release or visual validation.

## 2. Anatomy and composition

| Part | Responsibility / element | Content |
| --- | --- | --- |
| Root | `article`, raised frame, generated `h2`–`h6` | index → eyebrow → heading → free body in DOM order |
| Index / eyebrow | internal spans | optional ordinal and context; index hidden from AT |
| Tags | `ul > li > Chip mode="static"` | ordered strings |
| Code | labelled `pre`, line containers and decorative prompt | ordered literal lines |
| Footer | `div` | one consumer-supplied Link or Button, a consumer obligation not runtime enforcement |
| Backdrop (proposed) | one decorative `img` behind the upper zone in one isolated, radius-clipped wrapper | image only, `alt=""`, `aria-hidden`, `object-cover`, `pointer-events-none` |
| Mark (proposed) | non-interactive trailing upper-zone mark | `role="img"` with `aria-label`, `img` with `alt`, or decorative when repeating visible title; no anchor, button or tab stop |

No Radix interaction is needed: root and parts are passive; the supplied Link/Button owns native or Slot interaction. Preserve `eg-project-card`, `eg-project-card__tags`, `eg-project-card__code`, `eg-project-card__foot`; index/eyebrow classes are not public override surfaces. New part markers and the exact slot input and placement mechanism are unresolved below, not invented. Existing body/footer content and tab order must not be reordered by extracting the new parts.

## 3. Public API

| Input | Type / rule |
| --- | --- |
| `title` | required `string`; blank/whitespace warns in development and renders nothing |
| `level` | `2 \| 3 \| 4 \| 5 \| 6`, default `3`; rank independent of visual step |
| `eyebrow`, `index` | optional `string`; whitespace-only omitted; index decorative |
| `variant` | `default \| featured`, default `default`; featured is edge/halo/index ink, not a different layout |
| `size` | `md \| sm`, default `md`; sm hides no supplied content |
| `children` | optional `ReactNode`; free body flow |
| `ProjectCardTags.items` | required `string[]`; empty array produces an empty list; omit the part instead |
| `ProjectCardCode.label`, `.items` | required `string` and `ProjectCardCodeLine[]`; `{ text: string; kind?: 'command' \| 'comment' }`, kind defaults to command |
| `ProjectCardFooter.children` | required `ReactNode`, one supplied action |
| `className` | optional `string` on root and existing parts, layout only; see §6 |
| New parts | proposed names and semantics in §2; exact typed inputs, native forwarding, ref and className surfaces are **blocked**, not implied by these names |

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md), by meaning, name and aliases. Existing mappings: `title` → `heading-title`; `level` → `heading-level`; `eyebrow` → `heading-eyebrow`; `index` → `decorative-index`; `variant` → `visual-treatment`; `size` → `preset-dimensions`; both `items` → `collection-items`; code `label` → `accessible-name`. `kind` is a nested code-line field, not a menu control convention; it shares a name with `menu-entry-kind` but not its meaning. No new own prop is defined by A1 and part identifiers follow existing `*Mark`/`*Cover` precedent, not a registry entry. If a new own prop becomes necessary, its meaning/name/aliases and component-specific type require a separate proposal and naming approval. The v0.1 plan's pending index-convention statement is historical; the current registry records `decorative-index` approved, not an approval of this spec. Reviewed source for existing mappings: `packages/ui/src/molecules/project-card/types.ts`, symbols `ProjectCardProps`, `ProjectCardTagsProps`, `ProjectCardCodeProps`, `ProjectCardCodeLine`, whole-file `sha256:e288a0ee47230a650bd8e6a5c0b3d2329b9e9724ca093be8a2f4b6765c516ea3`. No registry write or new exception is proposed.

**Native boundary:** root forwards native article attributes except `children`, `className`, `title`, `role`, `tabIndex`, `contentEditable`, `dangerouslySetInnerHTML`, `aria-label`, `aria-labelledby`, `aria-disabled`, `aria-selected`, `aria-pressed`, `aria-live`; the hook strips protected semantics and `ref` at untyped boundaries. No root ref or `asChild`. Existing parts accept only their stated props, not arbitrary native attributes. Controlled/uncontrolled: not applicable; no owned state. Existing public exports and markers remain; additions are proposed, no legacy migration. React 18/19 packed consumption remains a future check, not inferred from types.

## 4. Behavior

| Situation | Expected result |
| --- | --- |
| Title only | frame and heading; no empty optional zones |
| Blank title | development warning and no article |
| Index/eyebrow | optional, in that order before heading; blank omitted |
| Featured / sm | featured signature without layout change; sm reduces density without hiding code or other parts |
| Tags / code | static chips in supplied order; command gets hidden prompt; comment muted; literal lines remain passive |
| Backdrop and/or mark | optional upper zone; backdrop behind content; mark trailing, never interactive; absence preserves old structure |
| Long title/body/tags | wrap without truncation, clamping or reordering; code overflow remains inside its well |
| Footer activation / pointer over body | consumer action retains native navigation/activation; card itself has no hover movement, glow change or pointer cursor |

No own state machine or event; root exposes `data-variant` and `data-size`. Consumer supplies all content and action, formats ordinal, owns outer layout and limits featured cards to one per view. Invalid runtime rank falls back to 3, invalid variant to default and invalid size to md as in the hook.

## 5. Accessibility

The article is named only by its generated heading via `useId()` / `aria-labelledby`; index and command prompt are `aria-hidden`. Eyebrow is excluded from the article name because the heading supplies that name. **Conflict:** v0.1 §5 also promises the eyebrow itself is inside an `aria-hidden` span, but current JSX does not set that attribute. Preserve the written promise as pending reconciliation: owner may require hidden eyebrow or explicitly amend v0.1 to expose its text; do not claim either has been verified as the approved outcome.

Backdrop is decorative, has empty alt and `aria-hidden`, contributes nothing to the card name and creates no tab stop. A named mark has its own supplied accessible name; a duplicate-title mark may be decorative. The card adds no keyboard handling, live region or tab stop. The consumer's action owns focus, native activation and touch target; no nested interactive controls. The code block has its supplied accessible label; tags are a semantic list. Consumer supplies any status in readable text, never color alone. Arbitrary body children can be interactive; the one-action rule applies to the intended footer composition, not a runtime guarantee about arbitrary children.

## 6. Appearance

| Axis | Values | Rule |
| --- | --- | --- |
| variant | default / featured | default raised frame; featured `border-border-brand` and `shadow-[var(--shadow-hot)]`, brand index stroke; no `--gradient-hot` |
| size | md / sm | md default; sm smaller padding, gap, index and heading; all content remains |
| level | 2–6 | default 3; typography independent of rank |

Existing frame composes `surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' })`; index uses token-backed `-webkit-text-stroke` with `--border-width` and brand color. Existing typography uses `text-label-eyebrow`, `text-title-display` / `text-title-section`, `text-heading-small` / `text-body-large`, and `font-mono text-code`; tags use static Chip and code uses the recessed well. The v0.1 approved bounded stroke exception does not authorize other handwritten appearance. No card-level animation; supplied action owns its focus treatment, including `--shadow-focus` where applicable.

**A1 proposed Material recipe, G3 pending:** `surfaceVariants({ tone: 'well' })` under the image, then exactly one scrim painted with `--color-alpha-black-42`; the fade is that scrim, not a handwritten gradient. Use an `isolate` wrapper and frame-radius clipping; backdrop `object-cover pointer-events-none`. Mark maximum width `max-w-[calc(var(--space-24)*2)]` = **153.6 px** (`--space-24` = 76.8 px). Do not reuse `--mask-section-fade-bottom` outside SectionShell without a separate scope grant; no new backdrop token is proposed. Contrast and broken-image legibility require real browser checks, not assumed from the token. The older visual amendment and working-tree Surface reuse conflict with the general Material/architecture documents' future-Surface wording: resolve authority before an implementation plan rather than clone Surface or claim a new exception.

**Geometry:** no inline appearance, dynamic utility interpolation or new geometry exception. **Class merging:** root `cn` merges consumer `className` last for outer grid placement, margin and width; existing tags/code/footer each merge their own class last for local layout. `twMerge` resolves recognized utility conflicts, not all CSS; no blanket appearance override, content hiding or reordering. New part className surfaces require the decision below and matching tests; none is assumed.

**Files:** existing six meaningful roles remain `types.ts` (CVA/types), `useProjectCard.ts` (normalization and composition), `ProjectCard.tsx` (JSX), tests, stories and `index.ts` (exports). **No stylesheet**; no additional internal module, token or dependency is proposed. Plan and exact G3 approval remain separate.

### Expected-design visual reference

| Visual ID | Image / scenario | Source / status |
| --- | --- | --- |
| VIS-01 (historical) | [v0.1 variants board](../v0.1/project-card--variants--1280x1400--dark.png): featured/default and compact cards | v0.1 [capture conditions](../v0.1/capture.json), SHA-256 `76b898745365c333865b8e206f4f14d99c5d54919b4b0115dcdf3b9489a1a781`; Proposed, not adopted by the v0.1 approval; does not depict the A1 delta |
| VIS-02 (pending) | No image yet: backdrop plus trailing mark, also missing/broken image and no-parts baseline | Owner conversation Image#11 is provenance only; no recoverable image, capture metadata or approval exists here |

Agree source, scenario and permissions, then obtain a real component-zone capture per [visual guide](../../../design/README.md) at agreed viewport, device scale, browser, theme, fonts and motion/transparency settings; record actual date, tool, crop, hashes and `capture.json`, and separately arrange an accessible handoff. Suggested checks include 390/768/1280 px. No capture has been performed in this task. Visual conformity: **Not evaluated**. A capture never establishes accessibility or behavior.

## 7. Acceptance criteria

All checks below are planned, not observed.

| ID | Promise → check | Story / visual |
| --- | --- | --- |
| PC-01–03 | Named article, rank/ID, blank-title warning, optional index and eyebrow ordering/name → render and accessibility assertions; reconcile eyebrow hiding first | Default, HeadingRanks |
| PC-04–05 | default/featured finish, sm density, all content kept, no hover motion → recipe and render assertions | Variants, Sizes; historical VIS-01 |
| PC-06–08 | static ordered tags; named code with hidden command glyph and muted comments; supplied footer action keyboard behavior → DOM/name/tab tests | Tags, Code, WithLink |
| PC-09–10 | long copy/tags wrap, own controls metadata valid → narrow browser layout and docgen/controls checks | LongContent |
| PC-11 | decorative backdrop has empty alt and `aria-hidden`, absent from name → DOM/accessibility assertions | pending VIS-02 |
| PC-12 | three mark shapes, neither new part creates tab stops; body/footer interactions unchanged → render and keyboard tests | pending VIS-02 |
| PC-13 | no parts preserves exact old structure and no isolate wrapper → base/current structural comparison | baseline story |
| PC-14 | broken image retains frame, scrim and legible text → real browser computed styles and contrast observation | broken-image story, pending VIS-02 |
| PC-15 | index, mark and heading not clipped at 390/768/1280; mark cap 153.6 px → browser geometry/computed-style check and emitted Tailwind rule | pending VIS-02 |
| PC-16 | allowed root/part layout merge precedence, protected native semantics, existing markers and exports preserved → public-interface and package tests | Not applicable visually |

### Spec closure and owner decisions

- [ ] G4: finalize exact snapshot/hash and obtain explicit scoped owner approval including identified visual references. G1 approves the proposal separately; G3 approves the exact well/scrim recipe separately. Approval of this spec does not approve implementation.
- [ ] **Part API/placement:** amendment specifies two parts but not their exact props or how they enter the generated upper zone. Owner: choose direct child parts extracted by type, or explicit named slots; then decide whether new parts accept layout-only `className` and native attributes. Both choices need exact typed contracts and tests before approval; neither is represented as already decided. Define duplicate/invalid part behavior and public markers with that choice.
- [ ] **Eyebrow mismatch:** choose preserve v0.1's `aria-hidden` promise or amend it to match the current exposed span; both retain heading-only article name.
- [ ] **Material authority:** confirm that the A1 well and existing Surface composition are valid for this work despite conflicting current general guidance, or require a separately approved Material/Surface proposal. G3 is not implied by either option.
- [ ] Capture and adopt exact visual reference; agree conditions and obtain actual files/metadata. No visual approval is inferred from Image#11 or historical VIS-01.
- [ ] New or changed prop naming, if any, requires registry lookup and independent approval; no proposed new prop is currently specified. Resolve each blocker, finalize identity and request approval before a separately approved plan and source work.
