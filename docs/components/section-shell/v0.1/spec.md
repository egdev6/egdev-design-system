# Component contract — SectionShell

- **Version / status:** 0.1 — **Proposed**, not approved or implementation-ready.
- **Approval / recovery:** Pending owner review of the questions below, exact payload and VIS-01. Cataloging was approved separately in [owner approvals](../../web-catalog/v0.1/owner-approvals.md); `odd/tasks/web-catalog.md` L6, L15 and L25 authorize read-only preview captures and a prepared issue snapshot, not implementation.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: edb73a8b606fb49b19516e3d25cf2fe8bb78ca742ce05bd800e2215af03957f9`; `visualHashes: VIS-01 → da7aa002707b0c66dec602c72c5ae3f376226d928de32968dee438a47b83b4c7`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes beginning with the complete line `## 1. Purpose and scope` through EOF, including the final LF; metadata above is excluded.

## 1. Purpose and scope

A reusable page-section frame, template in `@egdev/ui`, for host-supplied organisms and other content; no Pulso copy, zone table, scene, scrolling director, navigation, data or effects. The approved catalog row `scripts/catalog_data.py:120` names five registers and their top/bottom fades and requires register as a prop. The exact API and appearance are still recommendations, not decisions.

**Alternatives:** existing `AppShell` (`packages/ui/src/templates/app-shell/types.ts`) arranges whole-view navigation and main, not a section frame. `Stack` (`packages/ui/src/primitives/stack/types.ts`) gives a flex axis and gap, not section landmarks, register or page wrap. Adding a variant changes those responsibilities. Consumer composition is possible but repeats the same cross-view frame; extracting from legacy CSS alone is not a React implementation. Recommend a new template following the approved web-consumer classification. `packages/ui/src/index.ts` has no SectionShell export. `Surface` and `surfaceVariants` are exported from `@egdev/ui` and already compose the delivered layer (c) cards; whether a register reuses an existing Surface tone or needs its own approved recipe is part of OQ-1. No Radix: a passive section has no interaction primitive.

**Source:** owner-granted read-only `egdev-website/egdev-foundation/design-system/components/SectionShell/README.md` lines 1–37 and `preview.html`; `design-system/CONTRACT.md:86` specifies the four older registers; `reference-web/pulso-source.html:811–1194` shows named and unnamed section zones and a footer zone. `docs/MATERIAL.md:77–79` adds Grafito and group-edge rules. The Foundation preview does not show Grafito or fades.

## 2. Anatomy and composition

| Part | Proposed responsibility | Element |
| --- | --- | --- |
| Root `eg-section` | Named section, register paint, layout, optional host zone anchor | `section` |
| Content wrap `eg-section__wrap` | Centered content max-width and gutters when enabled | internal `div` |
| Children | Host-supplied composition in DOM order | React children; organisms may be included |

No internal heading or default content. The host owns the name, anchor ID, adjacent-group decisions and effects. The fixed bar and document-level scroll padding belong to the host. No `asChild`, ref or forced organism nesting is proposed. Public marker compatibility does not authorize migration.

## 3. Public API

All values below are conditional on OQ-1–OQ-7. The selection among them is not an owner decision yet.

| Input | Proposed type / default | Purpose |
| --- | --- | --- |
| `register` | `'pro' | 'show' | 'flood' | 'deep' | 'grafito'`; `pro` | Host selects section register, as required by catalog |
| `wrap` | `boolean`; `true` | Optional max-width/gutter wrapper for content which does not bring its own |
| `children` | `ReactNode`, required | Host-supplied content |
| `id` | native section attribute, optional | Host-owned navigation anchor |
| `data-zone` | native data attribute, optional | Host-provided effects anchor, not an effects implementation |
| `aria-labelledby` or `aria-label` | native attributes; host supplies one non-empty valid name | Refer to an existing heading, or name a headingless section |
| `className` | native, optional | Outer placement only, not arbitrary appearance override |

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md), meaning/name/aliases: `register` has no matching entry; propose pending `section-register` / `register`, a five-value SectionShell-specific visual register, distinct from `visual-treatment` / `variant` (which explicitly avoids material tone) and `surface-material-tone` / `tone` (color tone, not the combined scene/register responsibility). `wrap` is not `layout-gap`, `inner-padding`, or `portal-container`; propose pending `section-content-wrap` / `wrap`, boolean controlling this section's content wrapper. The proposed names require separate convention approval; no registry entry or usage is created before a real reviewed `SectionShellProps` source exists. `children` is native composition, not the narrowly scoped `field-message-content`; `id`, `data-zone`, accessible-name attributes and `className` are native, not own conventions. `guide-zones` / `zones` denotes preview rectangles and must not be reused for a director anchor. No `glowX` or fade prop is proposed pending OQ-1/OQ-2. Existing `accessible-name` / `label` is not applied to inherited ARIA. No exception is requested.

Native section attributes pass to root except unsafe HTML, role and style; names remain host-owned. No ref or polymorphism is promised. No controlled state, events or callbacks. Compatibility: legacy markers and rules remain in place; no legacy consumer is changed by this proposal. React 18/19 and package-consumer evidence are future plan gates.

## 4. Behavior

The proposed default frame centers content vertically with `--section-min-height`, top compensation `calc(--nav-height + --space-8)` and bottom `--space-8`. The wrap uses `--content-max` and `--gutter`; with `wrap=false`, children remain unwrapped. A sticky Lab scene may need an exemption (OQ-3); no unapproved height prop is invented. Name and zone are supplied separately. The host manages scrolling, state, focus, IDs, adjacent sections, navigation and effects. No event, timer, keyboard handler or own `data-state`; children keep their own interaction. Root classes are markers, not automatic permission to use legacy visuals.

## 5. Accessibility

Propose a native `section`, with host `aria-labelledby` to a unique existing heading or `aria-label` when no suitable heading exists; no fixed or duplicate ID, no autogenerated content and no name derived from `data-zone`. The host keeps heading hierarchy and valid unique IDs. Unnamed sections do not reliably become region landmarks. No added tab stop, key handling, focus trap, live region or touch target; nested controls own their own accessibility and focus. The host owns scroll offset and must verify that anchor navigation and focused controls are not obscured by its actual fixed bar. Flood foreground uses `--color-fg-on-flood`; deep uses `--color-fg-default`; contrast of actual descendants remains a future verification.

## 6. Appearance

**Proposed mapping, awaiting explicit recipe approval:** pro = ambient/canvas-facing reading frame with no glow; show = dark scene plus red radial halo; flood = `--color-bg-flood` / `--color-fg-on-flood`; deep = `--color-bg-deep` / `--color-fg-default`; grafito = 50% `--color-surface-0` over ambient, solid `surface-0` under reduced transparency. The latter and group-edge masks are documented web semantics, not already approved SectionShell recipes. Show halo, Grafito wash and fades require explicitly approved compliant recipes/tokens; do not handwrite gradients, color mixes or claim Gauge's exception. Flood and deep are section fields, not automatically elevated card surfaces. The exact Material treatment, including descendants on Grafito, remains OQ-1.

Use token-backed static utilities and CVA in `types.ts`, per-part `cn()`; no inline appearance or dynamic geometry. `className` only supports root external placement; `twMerge` is not universal cascade precedence. Legacy unlayered `.eg-section` and direct-child width, `.eg-section__wrap`, modifiers and `::before` masks/paint at `packages/ui/src/styles/legacy/bundle.css:1045–1062,1733–1743` collide with those markers, including descendant card background and hover overrides. Before implementation, propose and approve component-local neutralization scoped to the new root, including pseudo-elements, direct children and affected descendant cards; prove computed styles with legacy CSS loaded and preserve legacy consumers. No legacy stylesheet edits, global migration, blanket `!important`, or claim that utility order alone wins. Its actual compliant mechanism and stylesheet role are pending plan approval; do not invent a dummy stylesheet. Six meaningful files: `types.ts`, `useSectionShell.ts`, `SectionShell.tsx`, `SectionShell.test.tsx`, `SectionShell.stories.tsx`, `index.ts`; optional stylesheet only if a meaningful compliant role is explicitly approved. No extra module, token or dependency is authorized. No animation is proposed; reduced motion and transparency remain applicable.

### Expected-design visual reference

VIS-01: [Foundation four-register board](section-shell--registers--1280x1400--dark.png), showing Pro, Show, Flood and Deep in two columns, each with a dashed nav-height indicator and shortened minimum height. Source `SectionShell/preview.html`; read-only browser capture, **Proposed**, not adopted. 1280×1400 CSS viewport, 2× scale, dark, en-US, no-preference motion; network requests blocked; browser reported Barlow and Barlow Condensed faces loaded, but font source was not verified. The preview overrides `--section-min-height` to 250px; it does not establish full viewport behavior. See [capture.json](capture.json) for file hashes and conditions. Grafito, group fades, reduced-transparency and responsive states are not captured. Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

These are proposed checks, not observed implementation results. All implementation and visual tests await resolution and separate plan approval.

| ID | Promise / proposed check | Planned evidence |
| --- | --- | --- |
| SS-01 | Named native section, host ID and correct `data-zone`; no focus stop, event or synthesized name | Role/name, IDs, keyboard and native-attribute tests |
| SS-02 | All five selected registers and default; no choreography | CVA/static CSS and DOM tests; browser stories |
| SS-03 | Wrap on/off and children order; self-wrapped organism is not double wrapped | Render tests and two widths |
| SS-04 | Minimum height and top/bottom compensation, long content and host scroll offset | Browser geometry at desktop/mobile with actual bar; Lab exception only if approved |
| SS-05 | Group edge fades only as approved; reduced transparency yields solid Grafito | Browser adjacent-group, single/dual fade and preference tests |
| SS-06 | Stable markers work with legacy stylesheet loaded without changing unrelated legacy consumers or descendant card appearance | Computed-style collision, pseudo-element and consumer fixture tests |
| SS-07 | Token-backed recipes, static utility scan, build and packed consumer without Tailwind compiler; English docgen and controls | Build, package fixture, real Controls and stories |
| SS-08 | Flood/deep and gray descendants meet contrast, focus remains unobscured | Real-browser contrast and focus checks, not inferred from screenshot |

## Blocking owner questions

1. **Registers and Material:** approve five register values and mappings above, or narrow them? Recommend retaining all five because the approved catalog requires them; separately approve actual show halo, Grafito wash/reduced-transparency and solid-descendant recipes rather than assuming existing tokens or Surface provide those recipes. Evidence: Foundation README lines 1–28; `docs/MATERIAL.md:42–46,77–79`; legacy `bundle.css:1045–1062,1733–1743`; tokens `theme.css:132–137`.
2. **Group fades:** expose per-section fade input or compose at group level? Recommend host/group composition, still supporting the approved catalog's top/bottom fades without inferring neighbors; exact API and compliant mask recipe require approval. The host knows first/last and one section may need both. Evidence: `docs/MATERIAL.md:78`; legacy `bundle.css:1735–1743`.
3. **Nav and minimum height:** universal `100dvh` and top compensation or scene escape? Recommend the token-based default, with a separately specified opt-out for sticky Lab rather than forcing 100dvh on it; keep scroll-padding on the host, not each section. Exact escape API and geometry are unresolved. Evidence: Foundation README lines 18–29, 36–37; `theme.css:477–480`; `bundle.css:1045–1051,1065`.
4. **Wrap:** default internal wrapper with explicit opt-out, or always delegate layout? Recommend default wrapper and `wrap=false` for already wrapped Hero/ChapterBreak. Evidence: Foundation README lines 5–16; legacy `bundle.css:1052–1053`; `theme.css:473–476`.
5. **Zone and effects:** own `zone` prop or pass native `data-zone`? Recommend host-supplied `data-zone`, independent of native anchor `id` and accessible name; no choreography in UI. Evidence: Foundation README lines 9–15; `reference-web/pulso-source.html:811–1194`; `docs/CATALOGACION.md` web amendment.
6. **Landmark and naming:** require native heading reference or allow a direct label? Recommend named `section` accepting either `aria-labelledby` or `aria-label`, preferring the visible heading. The host supplies unique IDs and avoids landmark proliferation. Evidence: Foundation README lines 33–35; `reference-web/pulso-source.html:852,1136`.
7. **Composition:** must all organisms live inside SectionShell or may they? Recommend may: generic view sections use it where appropriate, while footer and self-contained/sticky scenes retain their own semantics and layout. Evidence: Foundation README lines 5–7,28; `reference-web/pulso-source.html:1042,1194`; `docs/CATALOGACION.md` template contract.

Owner approval of this exact spec and VIS-01, naming conventions and any recipes is separate from the independently approved implementation plan. GitHub image availability and publication remain pending; no remote action is authorized by this document.
