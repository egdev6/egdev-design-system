# Avatar #51 — bounded Indicator compatibility amendment

- **Version / status:** v0.2 Draft; preparation, not migration authorization.
- **canonicalIssue:** https://github.com/egdev6/egdev-design-system/issues/51
- **approvalReference / latestPublishedComment:** Pending / Pending — unpublished amendment.
- **contentSHA256:** sha256:c46c02566fb2dec680f69231e5ee96236a1cfaf28011086923985bfa03c6b1da
- **Hash definition:** SHA-256 of UTF-8 text from the actual whole-line heading `## Scope and authority` through EOF, LF and final newline. Tracking metadata above is excluded.
- **Companions:** [Indicator contract](../../indicator/v0.2/spec.md), [separate plan](../../indicator/v0.2/implementation-plan.md), [static comparison](../../indicator/v0.2/specimen.html#avatar-comparison).

## Scope and authority

Proposal approval on [#178](https://github.com/egdev6/egdev-design-system/issues/178#issuecomment-6516514764) permits preparing extraction, not silently changing Avatar's approved contract. [Avatar v0.1 evidence](../v0.1/implementation.md) records the prior contract and scoped plan; it does not authorize this amendment. Historical documents and captures remain unchanged. This amendment requires separate scoped approval against #51; no issue/body/comment mutation is performed here.

Recommend **geometry-only reuse with no intended visual or semantic difference**. This explicitly rejects the unapproved Indicator v0.1 recommendation to add a hairline, sheen and elevation to Avatar's badge. Indicator's standalone recipe remains separately proposed. No new public adapter props, internal React marker component, wrapper or runtime adapter code in preparation.

## Inspected source identity

Baseline: `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`; whole-file SHA-256 values:

| Source | SHA-256 |
| --- | --- |
| packages/ui/src/atoms/avatar/types.ts | b0a6b163639218e7177cd7254c78a4724ef73658ed0861d18cc96e5e6735c3cb |
| packages/ui/src/atoms/avatar/useAvatar.ts | 904de1e3f10d8f456689caf067739b23a7753be5dd9384d9d143fc1ce9e4f1c0 |
| packages/ui/src/atoms/avatar/Avatar.tsx | 33934e7166ddba0c64578bdb71912517c150b61a659673a6d9b3c9292f54d325 |
| packages/ui/src/atoms/avatar/Avatar.test.tsx | 85b32f83d7553df095fd5c799ccc5c187f45c88538c15ef5684f022509ad3ec7 |
| packages/ui/src/atoms/icon/types.ts | 1ea0dd7b8a4e42f90f6bd352edf968b9765eea9745ff8ff0ff6b5b9d0957ec13 |

`AvatarProps` and `AvatarSize` are public; `avatarBadgeVariants` and `avatarBadgeIconVariants` are source exports, not barrel exports. Preserve these source symbols/signatures/default md, even though package consumers do not receive them. Read-only source-import review remains necessary before runtime edits. Do not infer that a missing barrel export licenses deleting a source symbol.

## Before / after contract

| Concern | Current source | Proposed after extraction |
| --- | --- | --- |
| Public API | src?, label?, size? default md, badgeIcon?: IconName, paused? default false; native span exclusions | Exactly unchanged; no Indicator prop exposed on Avatar |
| Root | Radix Avatar Root, default span, `eg-avatar`, relative inline-grid; active/paused data-state | Same element/marker/state; no outer Indicator div or extra anchor |
| Naming | label truthy → one role=img and aria-label; otherwise whole root aria-hidden; label removal clears name | Unchanged; network/paused meaning remains caller text responsibility |
| Image/fallback | Radix Image empty alt, cover crop/full rounded size; immediate Fallback with decorative user Icon | Unchanged; no image transport/loading logic in Indicator |
| Badge DOM | Conditional span only when badgeIcon truthy; `eg-avatar__badge`, aria-hidden, decorative Icon | Same conditional span/marker/child and hidden semantics |
| Badge geometry | Absolute grid-centered, full radius, `-right-1 -bottom-1`; 18px except xl 22px | Same; shared geometry recipes from Indicator types, not public Indicator wrapper |
| Glyph | 11px except xl 13px | Same; shared glyph recipe |
| Badge paint | canvas fill, default foreground; no border, sheen or elevation; existing ring-2 | Same identity decoration; **do not apply standalone Indicator paint/outline** |
| Ring | `ring-[var(--eg-avatar-ring,var(--color-bg-surface))]` | Same ring-2 and custom property/fallback; no rename to legacy --avatar-ring |
| Paused | Root grayscale and opacity-60 apply to the full subtree, including badge | Same single ancestor treatment; no second opacity, no generic disabled .45 substitution |
| className | Outer margin/alignment and token-valued --eg-avatar-ring, merged last | Same; no badge override API |
| Pointer behavior | Passive badge is not a control; no explicit pointer-events-none on current badge | Preserve current badge hit-testing; standalone Indicator's pointer-transparent rule is not added silently |
| Exports / CSS | Avatar/AvatarProps/AvatarSize only; no stylesheet | Unchanged; no new CSS or source-export retirement |

Exact dimensional mapping (from actual source, not an inferred avatar-size ratio):

| Avatar size | Disc / fallback glyph | Shared Indicator size | Badge / glyph | Offsets |
| --- | --- | --- | --- | --- |
| sm | size-6 / size-3.25 = 24 / 13px | sm | size-4.5 / size-2.75 = 18 / 11px | right/bottom negative --space-1 |
| md | size-7.5 / size-4 = 30 / 16px | sm | 18 / 11px | Same |
| lg | size-10 / size-(--icon-size) = 40 / 20px | sm | 18 / 11px | Same |
| xl | size-12 / size-6 = 48 / 24px | md | size-5.5 / size-3.25 = 22 / 13px | Same |

Current disc gradient utilities remain `bg-linear-135 from-bg-deep to-primitive-red-neon`. No new Material treatment for this identity content is proposed. Source-internal Indicator geometry exports must contain only geometry, not standalone marker pointer/selection behavior, semantics or paint. Avatar retains its CVA symbols and token ring recipe; compose shared geometry through those recipes, preserving size inputs/defaults and hook results. Keep the existing JSX and six-file architecture; no circular dependency (Indicator never imports Avatar).

## Verification and specimen limits

Actual: types/hook/JSX/tests/index and Icon primitives inspected; hashes recorded. Existing Avatar suite contains 14 tests, including real Radix load/error/recovery with only image transport stubbed, badge md/xl, all disc sizes, paused reversal, naming and supported merge behavior. Those historical passes in v0.1 evidence were not rerun for preparation.

Planned after approval: preserve that suite, add sm/lg badge coverage and all-size before/after geometry/ring assertions; confirm unchanged source-export signatures, no new wrapper, one name, photo replacement/fallback, label removal, paused whole-subtree treatment, root native forwarding, ring fallback and token-valued override. Compare computed bounds, crop, ring/paint on canvas and surface hosts in LTR/RTL, plus browser/AT confirmation. Package/metadata integration remains parent-owned.

VIS-03 in the static specimen authors paired “Before” and “After (proposed)” discs for all four sizes, paused md and a canvas ring override. Both sides intentionally use the same geometry/paint. It illustrates the intended invariant, not an actual migrated DOM, screenshot, image-loading test or proof of parity. There is no photo fixture or fabricated broken-image result. Parent captures real baseline/runtime photo scenarios later; historical expected-design PNG identities are not newly verified here.

**Remaining decision:** approve this geometry-only boundary (recommended), or decline/defer Avatar extraction and keep its internals untouched while reviewing standalone Indicator. Any Avatar restyling requires a separately bounded new proposal/capture/adoption, not an incidental consequence of #178. No Badge, ring rename, label, paused, root semantics or legacy CSS change is authorized by this draft.
