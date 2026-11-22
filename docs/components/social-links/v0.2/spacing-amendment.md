# SocialLinks v0.2 — minimum target spacing amendment

- **Status:** Approved 2026-11-22 (owner choice in [S8 and L18](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** [v0.1 implementation and approved contract](../v0.1/implementation.md), canonical issue [#104](https://github.com/egdev6/egdev-design-system/issues/104), with [v0.1 approval](https://github.com/egdev6/egdev-design-system/issues/104#issuecomment-6251563933). Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “SocialLinks mínimo + ButtonGroup sin área (Recomendado)” (“Enmienda SocialLinks: `gap` pasa a separación mínima por tamaño (md ≥ gap-4, lg ≥ gap-2; mismos valores y default) → sus iconos tienen 44px. ButtonGroup (pegado y spaced) desactiva el área extendida: compacto por diseño; sus IconButton quedan por debajo de 44px y se documenta. Sin cambio visual en ButtonGroup.”). This records the scoped S8 decision; it is not a new convention approval or release.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: 2f98cd205d56aae5cfcb56135220ae3f81d756f5d8d60e350cb92f03f0b8d70e`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S8, L18`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/104`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Preserve independent IconButton target regions by replacing the exact-gap promise with per-size minimum list spacing. Reuse the existing SocialLinks molecule and its Cluster layout; no new component, token or dependency. The existing React exports and source are in `packages/ui/src/molecules/social-links/`.

## 2. Anatomy and composition

The named `ul`, direct `li` entries, IconButton-slotted anchors, optional caption and root layout remain unchanged. Cluster continues to own wrapping and the gap on both axes. No new wrapper, interactive object or event forwarding is added.

## 3. Public API

`gap?: 1 | 2` retains its type and default `2`, but now requests a minimum: `md` resolves to at least `gap-4`; `lg` to at least `gap-2`. The default-token effective gaps are 12.8px and 6.4px, respectively. `size`, variants, names, exports and other defaults are unchanged. Registry lookup: `gap` uses existing `layout-gap`; `size` uses `preset-dimensions`. No new naming convention, alias or exception is approved. The reviewed pre-change source is `packages/ui/src/molecules/social-links/types.ts`, `SocialLinksProps`, SHA-256 `8be51d9b5a34bd503dd9f35ddc99088de9294980763bdd17f47f6b7db57bf277`; usage revisions require refresh after its bytes change.

## 4. Behavior

The size-dependent minimum applies to both horizontal spacing and wrapped rows, for either `gap` value; native links, keyboard behavior and event propagation are unchanged. Consumers must avoid clipping, overlays, non-identity transforms and insufficient local token overrides. The existing 44.8px target is conditional on its supported host and actual token sizes.

## 5. Accessibility

Preserve one named native link and one tab stop per entry, its decorative icon and focus ring. Under default tokens and unobstructed layout, adjacent same-size targets have the clearance needed for their centered 44px squares. This is not a blanket WCAG or assistive-technology conformance claim.

## 6. Appearance

The new minimum deliberately increases `md` spacing for both values and `lg` spacing for `gap={1}`; `lg` with the existing default `gap={2}` remains unchanged. Nexo and Recado `md` usages can visibly change; egdev-website's reviewed default `lg` usage remains unchanged unless its configuration differs. Product runtime verification remains pending. Retain existing Material, focus and reduced-motion recipes. Six existing meaningful files remain; **No stylesheet** or new internal module. Expected-design references for the changed spacing are Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- `md` with either gap resolves to `gap-4`; `lg` with either resolves to `gap-2`; the default prop remains `2` and links retain their names, semantics and order.
- Focused tests cover both values and sizes, wrapping configuration and default preservation; built-CSS browser hit tests check adjacent targets and row boundaries under default tokens.
- Changelog and usage guidance identify the visual and contract change; product/browser, assistive-technology and visual-reference evidence are reported separately rather than inferred.
