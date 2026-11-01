# Avatar #225 — badgeIcon removal amendment

- **Version / status:** v0.3 Applied; owner-approved breaking API removal (T5, issue [#225](https://github.com/egdev6/egdev-design-system/issues/225)).
- **canonicalIssue:** https://github.com/egdev6/egdev-design-system/issues/51
- **approvalReference:** odd/tasks/visual-review-corrections.md (S10, owner visual review 2026-11-01).
- **contentSHA256:** sha256:86a0e892219e24269fe9adeec2f2eacbedc2d304e8760ea6171ba80a1052a68d
- **Hash definition:** SHA-256 of UTF-8 text from the actual whole-line heading `## Scope and authority` through EOF, LF and final newline. Tracking metadata above is excluded.
- **Companions:** [Indicator contract](../../indicator/v0.2/spec.md), [Avatar v0.2 Indicator amendment](../v0.2/indicator-amendment.md), [Avatar v0.1 evidence](../v0.1/implementation.md).

## Scope and authority

Owner decision recorded verbatim in the visual-review corrections spec (S10, 2026-11-01):

> "Quitar badgeIcon (ya tenemos el indicator)"

("Remove badgeIcon — we already have the indicator.") The Indicator component already covers corner origin/network glyphs, so Avatar's private corner badge duplicates it. This amendment records the applied breaking removal of the public `badgeIcon` prop and its rendering; it does not reopen the geometry-sharing boundary approved in v0.2 and does not mutate any historical document. Historical approval receipts, [v0.1 implementation evidence](../v0.1/implementation.md) and the [v0.2 amendment](../v0.2/indicator-amendment.md) keep their recorded baseline hashes, revisions and quotes unchanged.

## Applied change

| Concern | Before (v0.1/v0.2 source) | After (v0.3) |
| --- | --- | --- |
| Public API | `badgeIcon?: IconName` on `AvatarProps` | Removed; passing it is a type error and is ignored at runtime (never renders a badge) |
| Badge DOM | Conditional `eg-avatar__badge` span with a decorative Icon when `badgeIcon` is truthy | Removed entirely; no badge marker, no `eg-avatar__badge` node in any state |
| Source exports | `avatarBadgeVariants`, `avatarBadgeIconVariants` (source-private, not barrel exports) | Retired; Avatar no longer composes Indicator's geometry/glyph/position recipes |
| Storybook metadata | `badgeIcon` select control with 45 glyph options | Removed from Controls and docgen; Avatar exposes src, label, size, paused |
| Root, naming, image/fallback, ring, paused | Radix Avatar root, `eg-avatar`, label-owned `role=img` naming, empty-alt image, immediate user fallback, `--eg-avatar-ring`, paused data-state | Exactly unchanged |
| Six-file architecture | types.ts, useAvatar.ts, Avatar.tsx, Avatar.test.tsx, Avatar.stories.tsx, index.ts | Unchanged; still no stylesheet |
| Indicator | Shares nothing with Avatar at runtime; own source-private recipes | Unchanged; its source-private geometry comments no longer claim Avatar sharing |

## Migration path

Replace the removed prop by wrapping the Avatar with the public Indicator component:

```tsx
// Before
<Avatar label='Channel on LinkedIn' badgeIcon='linkedin' size='lg' />

// After
<Indicator variant='icon' badgeIcon='linkedin' tone='neutral' position='bottom-right'>
  <Avatar label='Channel on LinkedIn' size='lg' />
</Indicator>
```

The wrapped Indicator reproduces the removed badge geometry (bottom-right icon marker, 18/11px on sm–lg and 22/13px on xl, per the v0.2 dimensional mapping) while gaining Indicator's approved paint contract. Network and paused meaning still belong in the Avatar label or adjacent text; the Indicator marker stays decorative and never announces. Consumers keep owning `--eg-avatar-ring` and outer alignment through the Avatar root className; the Indicator anchor supplies its own placement.

## Evidence and verification

- Avatar focused suite: removal tests prove the legacy spread `badgeIcon` renders no badge and the hook exposes no badge state; a migration test renders Avatar inside `Indicator variant='icon'` and keeps naming, marker geometry and hidden semantics. Existing image/fallback, naming, paused, native-forwarding and merge tests still pass.
- Controls/docgen contracts updated: four annotated own props, no `badgeIcon` control or enum row in autodocs.
- Prop-naming registry: the Avatar usage under `corner-badge-icon` was removed and remaining usage revisions re-recorded against the edited source files; the convention itself stays approved and bound to Indicator. Historical receipt projections (post-receipt usage filtering) were updated in the same mechanical way; no receipt bytes or approval hashes changed.
- Catalog notes regenerated for the removal and the Indicator composition path.
- Package export/consumption fixtures updated: SSR output contains no `eg-avatar__badge`, the removed prop is a type error for package consumers, and a packed Avatar-inside-Indicator sample documents the migration at the package boundary. Package tests run against a rebuilt dist remain parent-owned.

**Boundary:** no token values, no Material changes to the Avatar disc, no Indicator behavior change, no legacy CSS change. Any future Avatar restyling still requires a separately bounded proposal.
