# Component contract — Text and Heading: body and foreground amendment

- **Version / status:** v0.2 — Approved — 2026-11-17 (parent applying the recommended options under owner delegation; see "Approval" below). Implementation plan follows the same delegation.
- **Amends:** [Text and Heading v0.1 implementation evidence](../v0.1/implementation-evidence.md) and the [approved #108 contract](https://github.com/egdev6/egdev-design-system/issues/108#issuecomment-6251575943); unchanged promises remain in force. Request: [#396](https://github.com/egdev6/egdev-design-system/issues/396), including the [Nexo comment](https://github.com/egdev6/egdev-design-system/issues/396#issuecomment-6923136851).
- **Approval / recovery:** Pending for this exact amendment; this file is the authorized local draft. Registry exception approval and a later implementation plan are separate. No code, token, dependency or GitHub change is authorized.
- **Current situation / pending decisions:** Existing Text/Heading are exported and implemented; the recipes and foreground choice below are proposals, not observed behavior. Recommendations D1–D5 resolve the requested API choices subject to approval; captures and scoped approvals are pending evidence, not decisions to invent.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending before publication`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/108`; `latestPublishedComment: Pending — no v0.2 snapshot published`; the recovered base approval is linked above, without claiming it is the latest issue comment.
- **Hash definition:** SHA-256 of UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings and final newline; tracking metadata above is excluded. Bind any approval to this version, digest and identified visuals.

## 1. Purpose and scope

Add ordinary body and lede typography, an inline emphasis recipe and explicit semantic foregrounds without changing display typography or announcing status. Translations, host backgrounds, status wording and icons are consumer-owned. No new component, automatic background detection, validation or live region is proposed.

**Cataloging:** extend the exported `@egdev/ui` Text primitive rather than add an atom. Existing Text covers display/eyebrow, not the token-backed body roles; Notice is a status block and is not inline prose. Compose existing `strong` markup instead of inventing a rich-text engine. Inspected `packages/ui/src/primitives/text/{types.ts,useText.ts,Text.tsx,Heading.tsx,index.ts}`, their tests/stories, `packages/ui/src/index.ts`, SectionShell and `packages/tokens/src/theme.css`; current source is evidence, not expected-design approval.

## 2. Anatomy and composition

| Part | Element / responsibility | Content |
| --- | --- | --- |
| Text root | Existing `p`, or Radix Slot on one supplied non-heading element | Consumer-authored inline content and semantic `strong`; no new interactive behavior |
| Emphasis | Consumer's native `strong` inside a body recipe | Meaningful emphasized text; accessible and in reading order |
| Existing title accent | Existing trailing `span` for display recipes | Unchanged; not an emphasis API for body copy |

Keep `eg-text`, existing accent markers and `eg-heading`; body introduces no public marker or wrapper. `asChild` keeps its existing one prop-spreading non-heading child restriction and Slot semantics; the host remains responsible for valid HTML. No new Radix dependency. Heading remains a separate native heading, unchanged by this amendment.

## 3. Public API

| Prop | Complete proposed type / default | Rule |
| --- | --- | --- |
| `Text.variant` | Existing `TextVariant` plus `'body' \| 'body-large' \| 'lede'`; default remains `'eyebrow'` | New values opt in. Existing `TitleVariant`, Heading variants and their meanings remain unchanged. |
| `Text.foreground` | `TextForeground = 'inherit' \| 'default' \| 'secondary' \| 'muted' \| 'warning' \| 'danger' \| 'on-flood'`; optional on the three new body values, default `'inherit'` | Selects only foreground; no host paint or status/live semantics. Excluded on existing variants. |
| `children`, `asChild`, native `lang`, `id`, `className` | Existing types and routing | `strong` in body children is supported; no new public ref or Heading composition. |
| `tone`, `accent`, `accentBreak` | Existing display contracts unchanged | Forbidden on body values; `tone` remains canvas/raised **accent context**, not semantic foreground. |

**Naming lookup:** [registry source](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry) were checked by name, meaning and aliases. Reuse approved `visual-treatment` for the widened `variant`. Reuse `surface-material-tone` for the component-specific foreground tone, with a **proposed scoped exception** `{ scope: 'Text', propName: 'foreground', reason: 'Text.tone already selects display-accent material context; semantic body foreground must coexist without overloading it', approval: null }`. The entry covers semantic color families as well as material tone; no new global semantic ID is proposed. Exception approval is independent of this component snapshot. `TextForeground` is a proposed exported type alias, not another prop or registry entry. `strong`, inherited attributes and className are not new own props.

Reviewed existing symbol: `{ path: 'packages/ui/src/primitives/text/types.ts', symbol: 'TextProps', revision: 'sha256:badce40976a01fb4c0079a1481c5ba2fcdf88c10dd2bee6556244991fdfd21c9' }`. This does not claim the proposed prop already exists; future registry usage needs the reviewed implemented source hash. No registry edit is authorized here.

**Compatibility / migration:** existing calls, default eyebrow, display/Heading classes, markers, Slot, accent, tone, native attributes and no-ref behavior are unchanged. New variant/prop/type values are a contract expansion: exhaustive consumer switches over `TextVariant` may require new cases; direct use of private/internal CVA helpers is not promised. Existing applications need no migration unless opting into body recipes. React 18/19 compatibility requires the planned packed checks; it is not inferred from types. Controlled/uncontrolled behavior is not applicable.

## 4. Behavior

| Input / action | Proposed result |
| --- | --- |
| Omitted variant | Existing eyebrow and decorative diamond; no semantic foreground option. |
| `body`, `body-large`, `lede` | Render supplied content once in the same default paragraph or compatible Slot child; preserve whitespace, language attributes and order. `strong` is not hidden or converted to an accent. |
| Foreground omitted | Inherit the actual ancestor text color; this permits SectionShell's `pro`, `show`, `deep`, `grafito` and `flood` registers without host detection. |
| Explicit foreground | Apply the selected foreground token, independent of typography; warn/danger do not create roles, live regions, icons or events. |
| Invalid untyped new foreground | Resolve to `inherit`, without throwing or forwarding the prop to the DOM. Existing invalid-variant fallback remains eyebrow. |

Body content is passive; no keyboard, focus or own state. Consumers provide meaningful status wording and an accompanying icon for status colors, and ensure valid HTML and contrast on their actual host. No arbitrary child styling or implicit status inference is promised.

## 5. Accessibility

The native paragraph or consumer's compatible slotted element retains its semantics; `strong` conveys importance and is not hidden. No `role`, `aria-live`, focus stop or automatic announcement is added. Status cannot rely on color alone: consumers provide meaningful text and a non-color cue such as an accessible or appropriately decorative icon. The consumer owns localized text, valid `lang`, markup, links and any actual status announcements. No keyboard or touch-target behavior applies to passive Text; child controls retain their own behavior.

## 6. Appearance

| Axis | Values / exact recipe | Restrictions |
| --- | --- | --- |
| Body typography | `body`: `font-sans text-body-default`; `body-large`: `font-sans text-body-large`; `lede`: `font-sans text-body-muted` | Each retains `m-0` and normal flow without forcing casing. `body-muted` is a typography token, not a color. Do not apply the display root's uppercase/font-display/wrap treatment. |
| Foreground | `inherit`: inherited; `default`: `--color-fg-default`; `secondary`: `--color-fg-secondary`; `muted`: `--color-fg-muted`; `warning`: `--color-status-warning`; `danger`: `--color-status-danger`; `on-flood`: `--color-fg-on-flood` | Use static token-backed utilities. On `flood`, use `inherit` or `on-flood` only; status wording/icon carries meaning without colored status text. |
| Emphasis | Static body CVA descendant utility `[&_strong]:[font-weight:var(--text-heading-small--font-weight)]` | One native `strong`, no new wrapper, color, inline style or typography token. It can appear anywhere inside valid inline content. |

On solid surface-0 through surface-3, the supported explicit roles are `default`, `secondary`, `muted`, `warning` and `danger`; `on-flood` is supported on the solid flood background, not on these dark surfaces. `inherit` depends on a host-provided contrasting color; SectionShell chooses black on flood and white on its other registers. On solid deep, use `inherit` or `default`; other explicit roles are not promised there. Translucent overlay, grafito and show composition require a contrast check against the actual underlying pixels; do not assert universal contrast from an alpha token. `warning` and `danger` are not supported on flood or deep red. No distinct secondary, muted or status-on-flood text tokens exist: **closest existing token is `--color-fg-on-flood`**, with semantic distinction carried by words/icons, not color. Do not add a token; flag any future need for colored distinctions as a separately approved token request.

No Material surface is painted; Surface/SectionShell or the consumer owns backgrounds. Static CVA choices in `types.ts`, per-part `cn()` and Slot remain; no dynamic geometry, inline appearance or new dependency. Root `className` remains limited to outer layout and recognized merges, not typography/color override; `twMerge` is not a universal CSS cascade guarantee. Six existing roles remain `types.ts`, `useText.ts` / `useHeading.ts`, `Text.tsx` / `Heading.tsx`, their tests, their stories and `index.ts`. **No stylesheet**, additional module or token change.

### Expected-design visual reference

| Visual ID | Image / scenario | Source and conditions / status |
| --- | --- | --- |
| VIS-01 | Pending: body, large and lede with inline emphasis on canvas and raised bands | Expected-design source/version, browser, viewport, DPR, fonts, theme, crop, motion/transparency, date, hash and scoped adoption Pending. |
| VIS-02 | Pending: semantic warning/danger on supported solid hosts and inherited black on flood | Same provenance and conditions Pending; status wording and icon visible. |

No captures are produced in this batch. The implementation PR must provide stories and real component captures with provenance and conditions before merge; historical #108 visuals do not approve these new recipes. Visual conformity: **Not evaluated**. Follow [capture guidance](../../../design/README.md); captures do not replace functional/accessibility tests.

## 7. Acceptance criteria

All checks below are planned, not observed; stories supplement tests.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | All three opt-in recipes use the exact token typography and preserve native text/Slot semantics and whitespace. | Text public DOM/type tests; BodyRecipes and Slot stories; compiled CSS and computed-style inspection, VIS-01. | Pending |
| AC-02 | Inline `strong` remains meaningful, in order and uses the existing weight token without inline styling or extra markup. | DOM/accessibility and computed-style tests, including slotted content; Emphasis story, VIS-01. | Pending |
| AC-03 | Every foreground maps as specified; omitted/invalid resolves to inherit, prop is not leaked, and no status introduces a role or live region. | Public DOM/type/rerender/JS-boundary tests; ForegroundMatrix story. | Pending |
| AC-04 | Body with inherited foreground is legible on all five SectionShell registers, including flood; each explicit role has at least 4.5:1 on its supported solid backgrounds, including on-flood on flood, and actual translucent contexts are measured rather than assumed. | Browser computed contrast, normal text and zoom/reflow, supported-host matrix, visual review VIS-02; explicit restriction documentation. | Pending |
| AC-05 | Existing eyebrow, all display and Heading variants, accent/glow, Slot, native passthrough, default, marker and supported merge behavior remain unchanged. | Existing tests plus public preservation cases, docgen/Controls, built CSS and packed React 18/19 consumers without a Tailwind compiler. | Pending |
| AC-06 | Body branches reject `tone`/accent and old branches reject `foreground`; no token/dependency/legacy changes. | Strict positive/negative type fixtures, source/diff audit and registry exception review. | Pending |

### Decisions awaiting approval

- D1 — separate body primitive or Text variants? **Recommended:** three opt-in Text variants, because the existing primitive already owns passive text and remains backwards compatible.
- D2 — semantic color in existing `tone` or a separate axis? **Recommended:** `foreground` with the scoped `surface-material-tone` exception, because `tone` already controls display accents.
- D3 — default foreground and flood? **Recommended:** inherit by default, offer explicit `on-flood`, and use black plus words/icons for unsupported colored flood states; this preserves host contrast without new tokens or background detection.
- D4 — emphasis part? **Recommended:** consumer-authored semantic `strong` with the token-backed body-only descendant utility, because it preserves accessible reading order without another component.
- D5 — visual evidence? **Recommended:** no captures in this batch; require real implementation stories/captures before merge, because current source is not an approved expected design.

### Closure and dependencies

- Dependencies: no new token, dependency or component implementation prerequisite. #417 and #424 depend on this amendment. Existing SectionShell and tokens are composition evidence, not new approvals.
- Exact snapshot, the naming exception and the later implementation plan require separate scoped approval. Complete all AC checks and real visual handoff before implementation merge; this draft is not implementation permission.

## Approval

- **Status:** Approved 2026-11-17.
- **Authority:** the owner delegated these decisions to the parent's recommendations: "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar" (owner session 2026-11-17, recorded in `odd/tasks/milestones-1-2-delivery.md` L1 and `odd/tasks/nexo-adoption-m2-specs.md` L1).
- **Resolution:** every open decision in this document resolves to its option marked **Recommended**. New or changed prop-naming conventions and scoped exceptions proposed here are approved together with this spec; registry entries and approval records are added in the implementation PR.
- **Not approved here:** new tokens or token value changes, new dependencies, and anything this document flags as out of scope; those stop for the owner.
