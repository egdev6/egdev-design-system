# Component contract — Panel accent edge amendment

- **Version:** v0.4
- **Status:** Approved — 2026-11-17 (owner, in session; odd/tasks/shared-app-theme-specs.md L2). Implementation plan follows the same delegation.
- **Amends:** [Panel v0.2](../v0.2/spec.md), adopted by [P-C owner approval](../../remaining-components/v0.1/ui-first-wave-owner-approvals.md), and the [v0.3 compact-heading amendment](../v0.3/band-heading-amendment.md). [#418](https://github.com/egdev6/egdev-design-system/issues/418) is the request; [#180](https://github.com/egdev6/egdev-design-system/issues/180) remains Panel's canonical issue. This is an approved delta, not a replacement for either prior contract.
- **Dependencies:** [#415 runtime accent](../../../foundation/runtime-accent.md) depends on #425; their choices are approved but not implemented. The implementation plan follows the same delegation. Visual evidence, snapshot publication and registry work remain pending; no code, dependency, GitHub or consumer change has occurred.
- **Snapshot identity:** `version: v0.4`; `contentSHA256: Pending before publication`; `visualHashes: Pending`; `approvalReference: odd/tasks/shared-app-theme-specs.md L2`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/180`; `latestPublishedComment: Pending — no v0.4 snapshot published`. The SHA-256 is of the UTF-8 LF payload from `## 1. Purpose and scope` through EOF, with its final newline; metadata above is excluded. Publication must bind this version, digest and the adopted visual hashes.
- **Current evidence:** `Panel`, its three parts and `Surface` are public (`packages/ui/src/index.ts:73-80,217-223`). Current root and part types have no edge option (`packages/ui/src/molecules/panel/types.ts:5-46,79-105`); `Panel.tsx` composes Surface for framed tones and an unpainted div for inherit. Nexo's labelled settings section wraps a banded Panel (`/home/egdev/proyectos/nexo/apps/hub/src/settings/index.tsx:16,64-69`) and paints a physical left border (`/home/egdev/proyectos/nexo/apps/hub/src/settings/settings.css:13`). This observation is not an approved expected-design capture.

## Approval

The owner's choices are “Sí, helper + variables por scope”, “Sí, accentEdge=\"start\"” and “Sí, igual que el 1 y 2” (`odd/tasks/shared-app-theme-specs.md` L2). D1–D7 resolve to their Recommended options: the Panel-only `accentEdge='start'`, existing inherited color and width, bounded Material recipe, all tones, decorative semantics, scoped naming proposal and required evidence. The implementation plan follows the same delegation; any new token value goes back to the owner. Visual captures and their scoped adoption, snapshot digest and registry work remain open.

## 1. Purpose and scope

Offer a **passive, decorative logical-start accent edge** on the existing compound Panel, driven by its inherited supported accent role. It is not a semantic status, a control boundary, a free-form border, a per-panel arbitrary color, a new frame, a runtime palette generator or a settings feature. Color never conveys state by itself.

**Cataloging recommendation:** extend Panel with one orthogonal opt-in presentation choice. Reuse Panel/Surface paint and the caller's existing labelled region. Surface alone lacks Panel's coordinated zones; an app wrapper duplicates the frame and Nexo's physical-left edge is not direction-aware. Replacing `variant='banded'` with an accent variant would couple independent axes; a new component or an extra Surface is unnecessary. The molecule remains in `@egdev/ui`, with no new Radix primitive or package. Application-only composition remains the fallback if this amendment is declined.

## 2. Anatomy and composition

| Part | Existing responsibility | Proposed delta |
| --- | --- | --- |
| Consumer host / optional section | Owns theme, region semantics, heading ID and layout | An ancestor receives the complete validated #415 theme map; the section remains if it owns `aria-labelledby`. |
| `Panel` | Single Surface frame for `surface-1`/`overlay`; unpainted native root for `inherit` | Optional decorative pseudo-element on the root's logical-start inner edge; no new interactive DOM node or second frame. |
| `PanelHeader`, `PanelBody`, `PanelFooter` | Direct sibling zones and existing band/spacing contracts | Unchanged content, order, roles, padding, corner ownership and child interactions. |

Stable `eg-panel`, `eg-panel__header`, `eg-panel__body`, `eg-panel__footer` and framed `eg-surface` markers remain. No new public part selector, role, ref, `asChild`, title API, ID or Radix interaction. Generated paint is non-interactive and carries no accessible content; do not add a separate focusable element. Nested Panels independently select their own edge.

## 3. Public API

| Part / prop | Proposed type | Required / default | Contract |
| --- | --- | --- | --- |
| `Panel.accentEdge` | `'start'` | No; omitted or `undefined` means no edge | Add the decorative logical inline-start edge, using the inherited #415-compatible role. No `'end'`, arbitrary string, color, thickness or per-part control. |
| `Panel.variant` | Existing `'default' \| 'banded'` | Unchanged: `'default'` | Independent of edge. |
| `Panel.tone` | Existing `'surface-1' \| 'overlay' \| 'inherit'` | Unchanged: `'surface-1'` | Existing ownership and host restrictions apply. |
| Parts, children, native props, `className` | Existing contracts | Unchanged | No `style`, ref, custom role, `asChild` or appearance override is added; supported layout merges remain bounded. |

At an untyped boundary, values other than `'start'`, including `null`, `false` and unknown strings, normalize to no edge and are consumed rather than forwarded to the DOM. No event, controlled state, disabled, selection or inferred host behavior is added. The edge tracks inherited theme updates without remounting children. `Panel` remains passive; React 18/19 compatibility is a planned package-consumer check, not a claim inferred from types.

### Prop-naming registry lookup

Reviewed the [canonical registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [lookup workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry) by meaning, `accentEdge`, `accent`, `edge` and aliases. Existing `visual-treatment` / `variant` stays unchanged. Approved `trailing-text-accent` / `accent` means a readable trailing text run, not paint; approved `container-edge-placement` / `edge` means a bottom full-width progress/status strip in a clipped positioned host, not this logical-start passive accent. Neither is reused or widened. No `accentEdge` name/alias or matching semantic entry was found.

**Proposed new semantic ID:** `panel-accent-edge`, canonical prop `accentEdge`, meaning “opt in to a passive, inherited-color logical-start Panel edge”; component-specific type `PanelProps.accentEdge?: 'start'`. No exception or alias is proposed. The `accentEdge` prop is approved for Panel in this amendment; the proposed convention's registry registration and any broader convention approval remain **Pending**. No registry write or global approval is implied. Reviewed current API source: `{ path: 'packages/ui/src/molecules/panel/types.ts', symbol: 'PanelProps', revision: 'sha256:5aa2753d3af82b96e29f8df01eda0af56e750d5f4b7d321664a74bc4c4432cd8' }`. It is evidence of the present API, not evidence that the proposed property already exists. Before later registration, manually review the implemented symbol and record its actual whole-file hash; never predict it.

## 4. Behavior

| Situation | Proposed result | Event |
| --- | --- | --- |
| Edge omitted, undefined or invalid untyped input | Existing root/parts, presentation and default paint remain unchanged; no edge is drawn. | None |
| `accentEdge='start'` | One continuous decorative line spans the Panel's block extent on logical inline-start, including visible header/body/footer zones. | None |
| Theme host changes custom accent or resets to default | The edge follows the inherited semantic value; no local palette, class probing, rerendered child state or cross-host leakage. | None |
| `dir='ltr'` / `dir='rtl'` | Edge is at the left / right respectively; it does not become a physical-left API. | None |
| Default/banded, surface-1/overlay/inherit, optional zones and nested Panels | All supported combinations preserve the prior paint owner, band hierarchy, corners, children and interactions. Inherit still requires a properly painted raised host; overlay is still genuinely floating. | None |
| Child receives keyboard/pointer interaction or focus | Child remains reachable and behaves as before; the edge is never a hit target, overlay control or focus indicator. | Child-owned only |

Opt-in positioning may establish a containing block for absolutely positioned descendants; this is a consumer-visible effect to review and test, not a promise that arbitrary external positioning remains identical. No-edge Panels must not acquire that change. Unsupported root/part appearance overrides, extra wrappers between zones, or children that ignore the established padding are not made supported by this amendment.

## 5. Accessibility

The edge adds no role, name, state, announcement, tab stop, keyboard handler or interaction. The consumer keeps a correctly ranked real heading and, when a named region is needed, its existing unique `aria-labelledby` relationship. Header/body/footer controls retain native/Radix keyboard and focus behavior. The edge is decorative even when its chosen color resembles a status: actual warnings, selection and other meaning require their own text, icons and semantics.

Do not clip children or their focus rings to round the edge. The standard padded parts must leave focus visible; prove this in browser tests with focus near both ends, LTR/RTL, zoom and forced colors. No claim is made that a decorative edge itself meets WCAG non-text contrast, or that it supplies a focus ring. Contrast and fallback for the scoped custom color are those of the limited #415 contract; default neon retains its existing limitations.

## 6. Appearance

| Axis | Proposed values / default | Restrictions |
| --- | --- | --- |
| Edge | Absent / `start`; absent by default | Static decorative treatment only; no color, thickness or side selector. |
| Variant | Existing `default` / `banded` | Both remain independent and preserve each zone's paint. |
| Tone | Existing `surface-1` / `overlay` / `inherit` | All combinations; inherit never creates a frame. |

### Approved bounded Material recipe

Preserve the actual Surface hairline, upper light edge, sheen, elevation and overlay/solid reduced-transparency fallbacks; never replace the Surface border with the accent, recolor all four sides, add a halo or duplicate the frame. One static-CVA `::before` decoration, created only for `accentEdge='start'`, is positioned on the Panel root, uses `pointer-events: none`, `inline-size: var(--space-1)` and `background: var(--color-fg-brand-default)`. It runs along the logical block axis. For framed tones, inset it by `var(--border-width)` from the inside of the frame and use `calc(var(--radius-xl) - var(--border-width))` for its logical start-start and end-start corners; for the unpainted inherit root, use zero inset and `var(--radius-xl)` for those corners. Other corners are square. Use static token-backed Tailwind/CVA and logical properties, not interpolated classes, inline component paint, a hand-written shadow or gradient.

Layer the decoration above band backgrounds so it remains continuous, but below or clear of child content and focus indicators. Existing part padding must not change, no parent or child gets `overflow: hidden`, and no child event is intercepted. Its exact stacking and logical-corner implementation must demonstrate these properties in the future real browser matrix; if they cannot coexist, stop and revise the recipe rather than sacrifice focus, Material or corners. The root becomes positioned only for the opt-in; preserve the rest of the root, Surface and zone recipes. The edge is quieter than Material's single hot signature and has no glow. No automatic hover, animation or transparency treatment is added; existing reduced-motion and reduced-transparency behavior remains authoritative.

### Token confirmation table

**Approved:** reuse the following exact existing dark-theme values; add **no new token or token value** in #418. The scoped runtime override of `--color-fg-brand-default`, including its values and contrast limits, is listed in the approved [#415 table](../../../foundation/runtime-accent.md#token-confirmation-table). No light theme is defined.

| Existing token | Current dark value / primitive reference | Role in this amendment and contrast evidence |
| --- | --- | --- |
| `--color-fg-brand-default` | `var(--color-primitive-red-neon)` = `#FF0036` | Decorative edge; source documents 4.61:1 on surface-0 and 3.42:1 on surface-3. It is not a control boundary; custom-mode B is bounded in #415. |
| `--space-1` | `3.2px` | Edge inline thickness; geometry, contrast not applicable. Same existing spacing token Nexo uses. |
| `--border-width` | `1px` | Framed inset, preserving the Surface hairline; geometry, contrast not applicable. |
| `--radius-xl` | `17.6px` | Existing framed/inherited corner geometry; contrast not applicable. |

The existing Surface recipe supplies `--color-border-hairline`, `--gradient-sheen`, edge/elevation shadows and, where applicable, overlay and solid fallbacks unchanged. No accent-to-background contrast is promised on an unknown overlay backdrop; edge is decorative and #415's documented solid-surface limits apply. Any new token, inline-appearance exception beyond #415's host map, altered Material recipe or dependency needs specific owner confirmation.

### Merge, files and consumer impact

Root `className` still supports only outer width/max-width, margin and grid/flex placement; parts retain their existing content layout/alignment merges. Appearance, padding, radius, overflow, edge width/color, state and Surface overrides remain unsupported; `cn`/`twMerge` do not establish universal CSS precedence. Future tests must verify the documented merges with the edge, real cascade/layers, legacy styles, and no-edge preservation.

The existing six meaningful files keep their roles: `types.ts` owns the typed prop, JSDoc/control and static CVA; `usePanel.ts` normalizes and consumes it; `Panel.tsx` renders the existing tree; `Panel.test.tsx`, `Panel.stories.tsx` and `index.ts` cover behavior, documentation and exports. **No stylesheet.** No extra internal module or new dependency is approved. A future plan must show that static utilities can express the recipe; failure requires a new scoped decision, not a dummy stylesheet.

After implementation and adoption, Nexo may opt into the Panel prop and remove only its decorative `settings__appearance` border/allowlist workaround; retain the enclosing labelled section and heading ID. Its current wrapper adds physical-left outside the Panel, whereas this proposal paints inside the frame at logical start, so geometry and RTL appearance can change and need explicit visual approval. Existing consumers that omit the prop need no migration.

### Expected-design visual reference

| Visual ID | Image / scenario | Provenance and status |
| --- | --- | --- |
| VIS-01 | Pending: custom-accent banded Panel with header/body/footer, LTR and RTL | Expected-design source/version, actual browser/version, viewport, DPR, fonts, theme, crop, motion/transparency, date, hash and scoped owner adoption all Pending. |
| VIS-02 | Pending: default/unbanded, optional zones, overlay and inherited host, with visible focused child | Same provenance and conditions Pending. |

Existing v0.2 captures document a prior design and do not approve an accent edge. No new capture is available or claimed; follow the [capture guide](../../../design/README.md) with a separately authorized real source and browser. Visual conformity: **Not evaluated**. Component captures do not replace functional/accessibility tests.

## 7. Acceptance criteria

All methods below are planned, not observed.

| ID | Observable promise | Planned functional / structural check | Planned visual / browser check | Observed |
| --- | --- | --- | --- | --- |
| AC-01 | Omitted/undefined/invalid input produces no edge and retains existing markup, classes, paint and semantics. | Public default and banded preservation tests, untyped invalid cases and no prop leakage. | Before/after default computed styles. | Pending |
| AC-02 | `start` yields one inherited-color edge in both directions; custom theme changes and nested scopes stay local. | Public prop and host integration tests; CSS build/static scan; no internal selector needed by consumer. | LTR/RTL, live custom/default changes, VIS-01. | Pending |
| AC-03 | Six tone×variant combinations and optional Header/Footer retain a single paint owner, unchanged spacing/corners and continuous edge. | Matrix and missing-zone tests; Surface composition and no overflow clipping assertions. | Surface-1, actual floating overlay, inherit and reduced-transparency fallback, VIS-01/02. | Pending |
| AC-04 | Content, landmarks, label relationships, tab order, pointer activation and focus are unaffected. | Named-region/heading and child interaction tests; no extra role, accessible text or tab stop. | Keyboard focus at edges, narrow/zoom, forced colors, LTR/RTL; VIS-02. | Pending |
| AC-05 | Root layout and supported part merges stay valid; default no-edge does not create a containing block. | Per-part merge, nested Panel and computed-style/containing-block fixtures, including opt-in absolute-child impact. | Real cascade with legacy styles and ancestor clipping. | Pending |
| AC-06 | The prop is documented, normalized and distributable without a Tailwind compiler, without new tokens/dependencies. | Naming review, strict positive/negative types, docgen/Controls, static CSS build and packed React 18/19 consumers. | Real Controls and consumer app visual check. | Pending |

### Resolved decisions and remaining evidence

- D1 — **Approved:** `accentEdge?: 'start'` on Panel, independent of existing `variant` and `tone`.
- D2 — **Approved:** inherited `--color-fg-brand-default` and `--space-1`, with #415's custom mapping and no new Panel token.
- D3 — **Approved:** the bounded logical-start inner pseudo-element recipe above, preserving Surface paint and visible focus; revise the recipe if browser checks cannot prove it.
- D4 — **Approved:** all existing tone/variant combinations; `inherit` remains unpainted apart from the opt-in decoration and overlay remains for floating hosts.
- D5 — **Approved:** the edge is decorative, the labelled section remains, and the local border/allowlist are removed only after package adoption and visual verification.
- D6 — **Approved:** propose `panel-accent-edge` / `accentEdge` as a new scoped convention; do not overload existing text `accent` or bottom-strip `edge`. Registry registration and broader convention approval remain pending.
- D7 — **Approved:** #415/#425 choices precede this edge; obtain real component captures and scoped visual adoption, use an implementation plan under the same delegation, and add no dependency. Captures, browser proof and publication evidence remain pending.
