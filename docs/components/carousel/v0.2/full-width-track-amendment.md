# Carousel — full-width track amendment

- **Status:** Approved — 2026-11-16 (owner, in session; proposal egdev-ds-nexo-adoption-v1). Implementation plan requires separate approval.
- **Amends:** [Carousel v0.1 implementation evidence](../v0.1/implementation.md) and its [approved base contract](https://github.com/egdev6/egdev-design-system/issues/80#issuecomment-6251492326); requested by [#420](https://github.com/egdev6/egdev-design-system/issues/420). This amendment proposes an additive opt-in layout, not implementation authorization.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 Pending, VIS-02 Pending`; `approvalReference: owner session 2026-11-16; proposal egdev-ds-nexo-adoption-v1`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/80`; `latestPublishedComment: Pending`. #420 tracks the request rather than creating a second canonical component contract.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings and the final newline; tracking metadata above it is excluded. Finalize the digest before publication. The spec is approved without captures; visual hashes remain pending.

## 1. Purpose and scope

- **Need:** a full-visible-width single-slide track with a hidden native scrollbar and intact native and keyboard operation, without consumer access to internal selectors. No news data, autoplay, loop or product-specific cards.
- **Cataloging proposal:** extend the existing `@egdev/ui` molecule's track layout. Reuse already provides full-basis slides but not the complete supported padding/gap/scrollbar treatment; consumer composition cannot configure its internal track. Extraction and a new carousel are unnecessary for the same navigation responsibility. Implementation plan approval is separate.
- **Evidence:** `packages/ui/src/index.ts`, `molecules/carousel/{index.ts,types.ts,useCarousel.ts,Carousel.tsx,Carousel.test.tsx,Carousel.stories.tsx}` and v0.1 evidence were inspected. The current track has `gap-7`, `p-2`, horizontal overflow and mandatory center snap; slides use `basis-full`. The recent [PR #407](https://github.com/egdev6/egdev-design-system/pull/407) alignment protection is present in `useCarousel.ts`: absolute `scrollTo` only when center drift is at least 0.5 CSS px. Mouse dragging still uses relative `scrollBy`.

## 2. Anatomy and composition

| Part | Existing responsibility / element | Amendment |
| --- | --- | --- |
| Root and header | Named `div` group, label, counter and IconButton controls | Unchanged |
| Track | Internal scrollable `div` with snap | Opt-in edge-to-edge viewport; hide scrollbar visually only |
| Slides | Named `div` groups with read-only consumer content | One viewport-wide slide per settled position |
| Progress and status | Composed ProgressBar, VisuallyHidden instructions and status | Unchanged |

No matching Radix carousel primitive is used; preserve the approved native-scroll and bounded hook-owned coordination, not a replacement keyboard model. Preserve `eg-carousel` and existing composed public markers, including `eg-icon-btn` and `eg-progress`. No public part API, marker migration or `asChild` is introduced.

## 3. Public API

| Proposed prop | Type | Required | Default | Rule |
| --- | --- | --- | --- | --- |
| `trackLayout` | `'default' \| 'full-width'` | No | `'default'` | `default` retains v0.1 track; `full-width` selects the edge-to-edge, scrollbar-hidden contract below. |

**Prop conventions:** inspected the [registry source](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning, name and aliases. The owner approved `carousel-track-layout` → `trackLayout: 'default' | 'full-width'` for Carousel (owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1). `top-bar-content-width` describes a constrained/full content row with gutters, not this scroll viewport and scrollbar policy; `visual-treatment` / `variant` concerns visual treatment, not track geometry and scrolling. The registry entry and usage are added in the implementation PR, not here. Reviewed existing usage context: `source: { path: 'packages/ui/src/molecules/carousel/types.ts', symbol: 'CarouselProps', revision: 'sha256:e7bec3354a8aceb305f30e48715014d72c31627d86e8fa7b031d9ae52bd53320' }`; the new prop is not yet in that symbol.

Native div props retain v0.1 exclusions and forwarding; `className` supports root width, margins and placement only. No ref, children, `asChild` or imperative API. Controlled requests commit only on owner acceptance; uncontrolled initialization, identity fallback and `onValueChange` remain unchanged. Public exports and React peer claims remain unchanged; packed-consumer checks are planned rather than inferred.

## 4. Behavior

| Initial state / action | Proposed observable result | Event |
| --- | --- | --- |
| `trackLayout` omitted or `default` | Preserve the existing padded, gapped track and current platform scrollbar behavior. | None |
| `full-width`, settled | Track fills the root's available width; zero track padding and zero inter-slide gap; one border-box slide fills the visible viewport without clipping its in-box content or exposing a neighboring slide. Center snapping is retained. | None for layout alone |
| User swipes, scrolls, drags, uses controls or slide keys | Native horizontal scrolling remains available without a visible scrollbar; the correct bounded slide is selected after settlement, including responsive widths and RTL. A neighbor may appear during movement. | Existing single `onValueChange` request per changed user navigation/settled scroll |
| Controlled owner rejects a request | Accepted identity, counter, status and focus remain coherent and physical track realigns to the accepted slide. | No extra request from realignment |
| Resize or sub-pixel drift | Re-align the accepted slide without changing identity; drift below 0.5 CSS px does not issue a programmatic scroll. | None |

Retain PR #407's absolute, tolerant instant `scrollTo` alignment, physical-center calculations and synchronous-listener protection; never replace this with relative alignment nudges. Preserve relative `scrollBy` for existing mouse dragging, native touch/pen/trackpad scrolling, selection protection, cancellation/release and no autoplay. Empty, invalid and single-item behavior, current `data-state` and consumer read-only slide restrictions remain v0.1. Consumers must fit meaningful content inside the slide's box and supply appropriate image alternatives.

## 5. Accessibility

Keep the visible name and localized group/slide role descriptions, named slides, position messages, instructions, current slide and polite status behavior. Native previous/next buttons retain accessible names and disabled boundaries; the current slide remains the only slide tab stop. Arrow keys are direction-aware; Home/End are bounded, Tab exits normally, and focus repair/controlled acceptance are unchanged. A visually hidden scrollbar must not disable keyboard, button, touch or other native scrolling. The opt-in must keep a fully visible token-backed focus indicator inside the zero-padding viewport, including forced-color contexts; no focus theft or duplicate announcement. Preserve existing reduced-motion instant behavior and target sizing; no added animation.

## 6. Appearance

| Axis | Values / default | Restrictions |
| --- | --- | --- |
| `trackLayout` | `default` / `full-width`; default `default` | `full-width`: no track padding or gap, viewport-width slides, center snap, visually hidden native scrollbar; scrolling remains enabled |

The Carousel frame remains structural and unpainted; consumer slide content owns its Material surfaces. Reuse the existing IconButton, Icon, ProgressBar and VisuallyHidden compositions without new paint, tokens or dependencies. Static CVA utilities in `types.ts` and per-part `cn()` own the proposed geometry and scrollbar treatment. Propose standards-based scrollbar hiding plus a statically scanned WebKit scrollbar pseudo-element utility; verify actual emitted CSS and target browsers. For visible focus at zero padding, use a token-backed inset focus indicator rather than relying on an outward shadow that the track clips. No dynamic inline appearance or geometry is proposed. Root `className` remains last-merged only for outer layout; `cn`/`twMerge` is not a general appearance or cascade guarantee.

**Files:** retain the six existing meaningful files (`types.ts`, `useCarousel.ts`, `Carousel.tsx`, test, stories and `index.ts`) in their established roles. **No stylesheet.** No extra internal module. If static utilities cannot provide the required scrollbar or focus behavior, stop and seek a separately approved meaningful stylesheet role instead of creating a dummy file or changing global CSS silently.

### Expected-design visual reference

| Visual ID | Image / scenario | Source and conditions | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending: full-width settled slide and controls, scrollbar hidden | Source, viewport, scale, browser, theme, fonts, preferences, crop and provenance pending | Pending owner reference and approval |
| VIS-02 | Pending: narrow/zoomed host with current slide focus and boundaries | Same conditions and provenance pending; include focus/overflow and responsive layout | Pending owner reference and approval |

No new captures are authorized for this batch. The spec is approved without captures; each Carousel implementation PR must provide stories and a real capture before merge. The v0.1 evidence refers to earlier VIS-01/VIS-02 but does not establish an approved reference for this new geometry; do not treat current implementation as expected design. Visual conformity is **Not evaluated** until comparable captures and scoped owner approval exist. Intended review covers the one-slide viewport, focus, spacing and existing composed treatments; do not infer tokens from pixels.

## 7. Acceptance criteria

All checks are planned, not observed for v0.2; stories do not replace behavior tests.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Omitted/`default` preserves v0.1 geometry, scrollbar policy, public markers/exports and behavior. | `Carousel.test.tsx` default and explicit default; CSS and packed consumer regression checks. | Pending |
| AC-02 | In `full-width`, the track has zero padding/gap; exactly one complete slide fills it at rest with center snapping. | Browser computed-box and scroll-position checks at wide/narrow/zoomed widths; full-width story / VIS-01, VIS-02. | Pending |
| AC-03 | Scrollbar is not visible in supported Firefox, Chromium/WebView2 and WebKit; scrolling remains enabled. | Actual production CSS scan and browser scrollbar/scroll checks; touch, trackpad and mouse-drag manual checks. | Pending |
| AC-04 | Buttons, LTR/RTL arrows, Home/End, focus, labels, descriptions, current status and boundaries work with the opt-in; hidden scrollbar does not block operation. | Role-based `Carousel.test.tsx` plus browser keyboard, focus clipping, forced-colors and accessibility-tree checks / VIS-02. | Pending |
| AC-05 | Controlled acceptance/rejection, native settlement, resize, synchronous scroll events and sub-0.5px drift retain #407 behavior with no duplicate request. | Geometry and event tests in `Carousel.test.tsx`; browser/WebView2 regression at fractional scale. | Pending |
| AC-06 | Empty, invalid, single and dynamic items; pointer cancellation; reduced motion and no autoplay retain v0.1 behavior. | Targeted tests and browser scenarios with `trackLayout='full-width'`; empty/single stories. | Pending |
| AC-07 | Prop types, default, JSDoc/Controls and emitted scrollbar utilities are usable without internal selectors or a consumer Tailwind compiler. | Docgen/Controls, production CSS and packed-consumer checks; opt-in story. | Pending |

### Resolved decisions

- “Aprobar las cuatro” — the Carousel `trackLayout` convention is approved.
- “Sí, validación visual en cada PR” — the spec is approved without captures; the Carousel implementation PR must provide stories and a real capture before merge.

### Remaining open decisions

- Confirm the single combined opt-in: zero padding, zero gap, viewport-wide slide, center snap and visually hidden scrollbar, including supported browser coverage and inset-focus treatment.
- Provide an authorized expected-design source, capture conditions and separately scoped visual approval for the two scenarios. New references and conformity remain pending.

### Planned checks

Propose a separately approved implementation plan. Planned verification is AC-01–AC-07, especially real browsers/WebView2, accessible operation and packed consumers; no check for this amendment has run for v0.2.
