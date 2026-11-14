# TopBar v0.3 — app header amendment

**Status: Owner-approved; implementation pending.** Approved by the owner on 2026-11-14 in Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`, selecting “Apruebo todo” — “Enmienda, los dos conceptos nuevos de nombres y el plan. Implemento test-first y te aviso para revisarlo en Storybook.” (see [feature tracker L4](../../../../odd/tasks/topbar-app-header.md)). It amends the [v0.1 contract](../v0.1/spec.md), its [part-partition amendment](../v0.1/part-partition-amendment.md) and the [approved v0.2 link amendment](../v0.2/spec.md), interpreted with its [approval and resolutions](../v0.2/approval.md). The v0.1 contract was approved in [#292](https://github.com/egdev6/egdev-design-system/issues/292#issuecomment-6597377277); historical draft headers do not revoke those approvals. Everything not explicitly changed below remains in force. The [implementation plan](implementation-plan.md) needs separate approval.

**Snapshot identity:** `version: 0.3`; `contentSHA256: d8d059d5eae318e6a66d69f74395ffd2c95d464a19dc2138f0efab9c8877eef7`; `visualHashes: Pending for the new reference`; `approvalReference: odd/tasks/topbar-app-header.md#l4--approved`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/292`; `latestPublishedComment: Pending for v0.3`. The canonical payload is UTF-8 from `## 1. Purpose and scope` through EOF, with LF endings and the final newline. Finalize its digest and identify any adopted visuals before recording scoped owner approval; no publication is authorized here.

## 1. Purpose and scope

Extend the existing fixed `@egdev/ui` TopBar organism for web and app headers; retain native flat navigation and consumer-owned destinations, controls, routing and clearance. Reuse its composition and existing tokens/Surface rather than introduce another component or dependency. Unlike v0.1, the proposed TopBar would detect window scroll for its own glass state; it would still not be a general scroll director, router or mobile-menu implementation.

The owner decisions in [S1–S7](../../../../odd/tasks/topbar-app-header.md#specs) are recorded verbatim:

- **S1:** “el logo de la izquierda es un slot (habitualmente usado para logo con link)”.
- **S2:** “el espacio de la derecha es un slot ( que admita ReactNode)”. Selected: “Sumar un slot derecho libre (recomendado)” — “TopBarBrand sigue siendo el slot izquierdo (logo con link). Se agrega una parte nueva para la derecha que acepta cualquier ReactNode. Búsqueda, usuario y menú móvil se mantienen: no rompe a nadie.”
- **S3:** “Aplicamos ese estilo glass al background en el scroll”. Selected: “TopBar lo detecta solo (recomendado)” — “Pasa a glass cuando la página deja el tope (scroll > 0). Si quien lo usa pasa `data-state`, ese valor manda.”
- **S4:** “Antes de hacer scroll, ¿qué fondo tiene la barra?” — “hagamoslo opcional por prop”.
- **S5:** `“cambiamos los colores de los <a> (active, hover...) por los estilos de la imagen”.`
- **S6:** “Debe admitir max-width que aplique al contenido (no al background), yq eu en apps serás del 100% pero en web centrará con ese maxWidth”. Selected: “Prop con dos valores: content o full (recomendado)” — “`content` centra en --content-max (web, por defecto); `full` ocupa el 100 % (apps). Solo tokens, sin valores arbitrarios.”
- **S7:** “no, compón lo tu con los recursos del design system para buscar un acabado visual como el de la imagen que te pasé”.

## 2. Anatomy and composition

`TopBarBrand` remains the required leading part, but its content is a slot: a named home link is usual, not mandatory. Brand content need not be a link. The new optional **`TopBarEnd`** accepts any `ReactNode`, including text, elements, fragments or an empty node; it adds no automatic semantics. Its wrapper is not hidden at any width. Consumer-supplied interactive content remains responsible for its own accessible name and behavior.

Final DOM order, independent of the order supplied: **brand → page navigation → full search → compact search → end → user menu → mobile trigger**. The existing inclusive 900px container switch still determines which search and mobile branches are visible; end remains available in both layouts. Absent parts add no placeholder. The existing part-type partition, fragment traversal, development warnings, first-instance handling for duplicates, unknown-child rejection and no-cloning/no-descendant-inspection rules remain. `TopBarEnd` follows the same direct-part/at-most-once contract. Existing parts and exports remain unchanged; add this one named part at the component and public barrels.

## 3. Public API and naming

| Addition | Type | Default / meaning |
| --- | --- | --- |
| `TopBarEnd` | `TopBarPartProps` (`children: ReactNode`) | Optional composition part; no part `className`, ref or `asChild`. |
| `initialBackground` | `'transparent' \| 'solid'` | Optional, `transparent`. Selects the unscrolled backing when the host does not explicitly select `data-state`. |
| `contentWidth` | `'content' \| 'full'` | Optional, `content`. Selects inner row width, never background width. |

Names are proposals, not approved conventions. Lookup by meaning, canonical name and aliases used the [registry source](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry):

- **`initialBackground` → proposed semantic ID `top-bar-initial-background`.** This chooses only the top-of-page backing, while scroll or explicit `data-state` selects glass/transparent presentation. `surface-material-tone` / `tone` is a semantic color or Material tone, not this temporary transparent-versus-solid choice; `visual-treatment` / `variant` is a presentation treatment, not the backing conditioned by scroll; `surface-elevation` / `elevation` selects elevation, fixed at 0 here rather than exposed. Component type: `TopBarProps.initialBackground?: 'transparent' | 'solid'`. Use for an initial backing overridden by state; avoid using it as a tone, elevation or scroll-state prop.
- **`contentWidth` → proposed semantic ID `top-bar-content-width`.** This selects a constrained or full-width inner row with gutters in both cases. `section-content-wrap` / `wrap` is a boolean choice of whether a section supplies a wrapper, not these two row-width modes; it does not describe a full-width row that retains gutters. Component type: `TopBarProps.contentWidth?: 'content' | 'full'`. Avoid using it for a background, an arbitrary width value or flex wrapping.
- **`TopBarEnd` is a part, not a new named prop.** Its existing structural `children` convention is `TopBarPartProps.children: ReactNode`; no `actions` prop is introduced. `trailing-actions` / `actions` is for action content and would misdescribe passive status text; `end-items` / `endItems` is an ordered collection of shaped navigation entries, not an arbitrary node. The part name expresses the logical end without promising either concept. No new registry concept or exception is proposed for the structural `children`.

The lookup found no `initialBackground` or `contentWidth` name/alias in the registry. The two new IDs were approved by the owner together with this amendment and plan (same decision); they still need their registry entries added during implementation. Existing `label`, `items` and `onNavigate` keep `accessible-name`, `collection-items` and `navigation-intent`; native attributes remain native. Reviewed baseline evidence: `packages/ui/src/organisms/top-bar/types.ts`, symbols `TopBarProps` and `TopBarPartProps`, whole-file `sha256:f097a3b5f6d5bf8bf5e451a3a826e663116abc1549d7947c4ccfe5ba64042c1c`; `packages/ui/src/primitives/surface/types.ts`, `SurfaceProps`, `sha256:26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6`. These are baseline evidence, not claims that the new props already exist. After authorized implementation, review the actual public symbol and record its new whole-file hash for each usage; do not invent one or silently refresh old evidence.

## 4. Behavior

| Condition, in precedence order | Header presentation |
| --- | --- |
| Host explicitly supplies `data-state="glass"` | Glass regardless of scroll or `initialBackground`. |
| Host explicitly supplies `data-state="transparent"` | Transparent regardless of scroll or `initialBackground`, preserving the existing explicit-state promise. |
| No explicit host state and `window.scrollY > 0` | Glass. |
| No explicit host state and `window.scrollY <= 0` | `initialBackground`: transparent by default, or solid when requested. |

The server and first client render assume **not scrolled**; after mount, synchronize with the actual window position, including pages loaded below the top. With no explicit host state, use a passive window scroll listener and at most one pending `requestAnimationFrame` to sample the latest position; clean up the listener and any scheduled frame on unmount or when a host state takes over. An explicit state disables internal state selection; removing it re-enables and resynchronizes detection. No dependency, scroll callback, inferred dialog state or new public scroll prop is added. An unscrolled automatic state need not add a `data-state` attribute; automatic glass uses the existing `data-state="glass"` styling.

The host still owns current-link selection, native navigation, the Dialog/Menu compositions and safe focus handling when their triggers are hidden on resize. Scroll state does not open or close a dialog.

## 5. Accessibility

Preserve the named native navigation landmark, list, ordinary anchors, zero-or-one host-selected `aria-current="page"`, native Tab/Shift+Tab and Enter, and the existing focus-visible outline. The current indicator remains a non-color cue. Visible desktop links retain the v0.2 minimum of 44.8px, exceeding the requested 24px minimum; the full-height bar treatment must not reduce that target. Measure links only when visible; check the supplied compact control separately at narrow widths, as resolved in v0.2. Supplied controls still require names and at least 44px coarse-pointer targets. No new live announcement, keyboard engine or ARIA role is introduced.

## 6. Appearance

| Area | Proposed finish |
| --- | --- |
| Initial backing | `transparent`: existing unpainted state and host-owned legible backdrop. `solid`: compose `surfaceVariants` with `surface-1`, sheen and elevation `0`, no radius or padding, with a bottom hairline; retain Surface's elevation-0 light edge. Background spans the full bar. |
| Glass | Preserve the current overlay recipe and [Material](../../../MATERIAL.md) semantics: overlay background, blur/saturation, strong bottom hairline and edge/elevation shadows. Reduced transparency remains solid `surface-2` without backdrop filter; reduced-motion behavior is unchanged. Glass must not inherit solid-state sheen. |
| Content width | `content`: centered, `--content-max` and `--gutter`. `full`: 100% with the same `--gutter`. The fixed background remains full-bleed for both. |
| Links | `text-body-large` (16px, body weight at rest), `fg-secondary` at rest and `fg-default` on hover/current; current weight uses `--text-label-default--font-weight` (600). List gap is `gap-8` (25.6px). Stretch nav/list/items/links through the bar height. |
| Current indicator | Flush with the bar's bottom edge, 2px high via `calc(var(--space-1)*0.625)`, square, no inline inset, no glow, spanning the text width; use `bg-flood` (`--color-bg-flood`, Tailwind `bg-bg-flood`). No text-decoration underline. |

The link finish supersedes v0.2's smaller typography and inset, rounded, glowing indicator, but not its native semantics, focus outline or target floor. Token-backed static CVA and per-part `cn()` remain; the root `className` remains outer placement/stacking only. Keep legacy CSS/markers and the 900px query behavior intact. **No stylesheet** and no additional internal module; stop for separate approval if compliant utilities cannot express or ship the recipe. No token or dependency changes.

### Expected-design evidence and stories

The owner's Image#5 is conversation-supplied provenance, not a recoverable image file in this repository. [L2](../../../../odd/tasks/topbar-app-header.md#l2--evidence) records a 1785×85 image and pixel sampling: surface/sheen, secondary/default ink, a 2px square indicator and about 27px between links. Exact font, weight and spacing were inferred, not measured from source. The choices above deliberately use existing tokens; the sample is not proof of token identity or visual conformity. Browser, DPR, font and capture conditions, image bytes/hash and scoped visual adoption remain pending. Historical [v0.1 captures](../v0.1/spec.md#expected-design-visual-references) retain their own provenance and do not validate this finish. Follow the [capture guide](../../../design/README.md); visual conformity is **Not evaluated** until comparable approved evidence exists. Do not read the Media Tool source.

The TopBar `Default` story deliberately demonstrates the owner's reference rather than the runtime prop defaults: compose a named brand link with unlinked Logo, display name and small subtitle; set a current page and `initialBackground="solid"`; put StatusDot plus adjacent text in `TopBarEnd`. Use public design-system components and token-backed composition, not raw unstyled anchors. Add distinct transparent-to-glass-on-scroll, `full` width and trailing-slot-only stories. Other TopBar stories likewise use design-system links rather than raw unstyled anchors. Preserve required-input documentation and make the actual transparent/content defaults clear.

## 7. Acceptance criteria

All checks are **planned**, not observed; unchanged v0.1/v0.2 criteria remain applicable as amended above.

| ID | Observable promise | Planned proof |
| --- | --- | --- |
| AC-01 / S1 | Required leading brand accepts non-link content as well as the usual named home link; partition rules remain. | Public render and warning tests. |
| AC-02 / S2 | Arbitrary end content appears in the documented order at all widths; existing optional parts retain their placement and visibility. | Public render/order tests and built-CSS/browser visibility. |
| AC-03 / S3 | Top-of-page/scroll transitions, initial hydration and explicit host-state precedence behave as specified, with cleanup. | Listener/rAF/SSR tests and browser scroll; glass fallback computed styles. |
| AC-04 / S4 | Default transparent and optional solid backing compose correctly with both host overrides and scroll glass. | Prop/state tests and computed Surface/overlay paint. |
| AC-05 / S6 | Both content widths keep gutters and a full-bleed background. | Prop tests and browser geometry at both widths. |
| AC-06 / S5, S7 | Ink, weight, full-height links, flush square 2px text-width indicator and `gap-8` match the token recipe; focus and target floor survive. | Rendered recipe and shipped-CSS/browser computed styles, including hover/current/focus. |
| AC-07 / S7 | The reference composition and three supplementary scenarios use design-system resources. | Story review, real browser and Controls/docgen checks. |

**Next step:** obtain explicit approval of this exact v0.3 payload and, separately, the proposed naming conventions and [implementation plan](implementation-plan.md). No implementation or visual-conformity claim follows from this draft.
