# Gauge v0.10 — transparent interior amendment

The maintainer approved the visual delta and the separately identified local implementation plan in [approval.json](approval.json). The [plan](implementation-plan.md) is frozen verbatim as presented; its proposal wording is historical, not an outstanding gate. This manual decision record is not provider-native review authority. Execution evidence belongs in the separate verification report.

Recover the immutable [v0.8 base](../../../specs/gauge.md), its [approval](../v0.8/approval.json), and the [v0.9 composition amendment](../v0.9/composition-amendment.md) before applying this bounded delta. Historical payloads, receipts and captures remain unchanged. Version 0.10 identifies the component contract, not an npm release.

## 1. Purpose and scope

Keep the same passive measurement atom. Replace only Gauge's opaque recessed finish with a genuinely transparent circular geometry frame. No new component, public prop, token, dependency or appearance override API.

## 2. Anatomy and composition

Retain the native decorative wrapper, internal `eg-gauge-well` marker, arc, optional center and visible condition cue. The marker is historical/internal, not a new public part API or a promise of recessed Material. No Surface import or hidden React replacement. The seven meaningful files and hook/JSX separation remain mandatory.

## 3. Public API

No delta: inherit the approved API, defaults, native protections and eight Gauge prop meanings. The eight convention approvals recorded separately in `docs/decisions/prop-naming-gauge-approval.json` remain unchanged. A CVA-only edit requires renewed review and whole-file source evidence, not renewed naming approval or an automatic API migration.

## 4. Behavior

No delta: preserve clamping, non-finite fallback, passive updates, four consumer-selected conditions, preset/custom numeric diameters, stroke rules and center inset. Preserve the arc's existing +0.5px inner-edge smoothing.

## 5. Accessibility

No delta: keep the named passive meter, normalized values, descriptions, decorative center/icon treatment and readable unavailable state. No focus, interaction, live announcements or disabled semantics are added. Transparency does not establish contrast on every host background or screen-reader certification.

## 6. Appearance

Supersede only the v0.9 `--color-surface-0` background and `--shadow-well` requirements for Gauge's wrapper: its background is transparent, background image none and box shadow none. Static CVA resets own that finish; `gauge.css` remains geometry-only and unchanged. Retain border-box, padding 0, 0px solid border, full token radius and existing foreground.

The unfilled track keeps its existing semi-transparent color definition and now blends with the actual host background; there is no opaque annular backing. Preserve the filled arc and optional decorative content. Do not simulate transparency by copying a host color. This is a Gauge-only exception, not permission for arbitrary flat surfaces, new Material recipes or handwritten appearance values elsewhere.

## 7. Acceptance and verification boundary

| ID | Required evidence |
| --- | --- |
| T-01 | Compiled CSS and browser styles show transparent wrapper background, no image and no shadow; empty-center pixels reveal two distinct existing token backgrounds. |
| T-02 | Arc/track definitions, dimensions, stroke, mask smoothing, center position and passive API/semantics remain unchanged; decorative center content remains visible. |
| T-03 | Eight own declarations are re-reviewed before source-hash renewal; convention payloads, approvals and five deferred entries are unchanged. |
| T-04 | Old contracts/captures remain byte-identical; new before/after evidence records actual scenarios and conditions without claiming finish pixel parity. |

The full Storybook MCP RPC smoke, packed React consumer matrix and unevaluated screen-reader work remain separate limitations. No retry, installation, server restart, commit, remote publication, merge or release is authorized by this amendment. The canonical component issue remains #30; any future version comment requires separate authorization.
