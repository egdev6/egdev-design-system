# Indicator — exact naming-convention approval candidates

- **Status:** three owner-approval candidates only; global convention approvals and future runtime usage evidence remain Pending. Component/visual/plan approval alone promotes no registry entry. No registry, source, Badge or Avatar migration is performed.
- **Document identity:** `contentSHA256: sha256:218403be9baee574e213cf1b06db1f7bd4d3951b20c7e24e593e90ef011fb062`; SHA-256 of UTF-8 LF bytes from the actual whole-line heading `## Proposals` through EOF, including final LF; metadata above is excluded. This document digest is distinct from each JSON proposal hash below.
- **Canonical issue:** [Indicator #178](https://github.com/egdev6/egdev-design-system/issues/178). This document creates no publication or native/independent review authority.

## Proposals

Follow the complete [naming workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry), [canonical registry](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md) and actual [schema/hash implementation](../../../../scripts/prop-naming.mjs). Each fence is one complete ten-field registry-entry candidate; types/defaults remain component-specific prose, not invented schema fields. Empty usages means no implemented IndicatorProps observation.

Meaning/name/alias lookup found no existing position/count/max convention or alias. Rejected reuse: floating-side/side describes floating placement with collision handling; icon-placement/iconPosition describes a glyph beside a label; primary-value/value describes a primary selection/measurement; character-counter/counter describes text length; thumbnail-badge/badge describes a text annotation. None matches these passive anchor/item-count/overflow responsibilities. Existing corner-badge-icon/badgeIcon is not changed. No alias or scoped exception is needed. The current registry has no proposed entries; validateRegistry explicitly supports proposed entries with approval null and the arrays shown here.

### P1 — anchor-corner-position → position

Indicator candidate type `IndicatorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`; optional, constant default top-right. Physical corners do not flip in RTL. No floating placement, collision engine or logical start/end alias.

```json
{
  "id": "anchor-corner-position",
  "name": "position",
  "meaning": "Physical corner of a non-floating anchor where a passive supplementary marker is placed.",
  "whenToUse": "A passive anchored marker selects top-left, top-right, bottom-left or bottom-right without automatic RTL mirroring; Indicator uses IndicatorPosition with default top-right.",
  "avoid": "Floating content side or collision handling (use floating-side/side), logical start/end placement, automatic RTL flipping, icon placement beside a label, or positioning an interactive overlay.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": []
}
```

### P2 — indicator-count → count

Indicator candidate type `number`, required only in the count branch; no default. It is a supplementary item total, not the child control's accessible announcement or a primary meter. Marker visibility requires a positive safe integer.

```json
{
  "id": "indicator-count",
  "name": "count",
  "meaning": "Supplementary item total represented by a passive marker anchored to consumer content.",
  "whenToUse": "An anchored count marker displays a positive number satisfying Number.isSafeInteger. Indicator suppresses only the marker for zero (including -0), negative, fractional, non-finite, unsafe or non-number input, preserving its anchor and children.",
  "avoid": "Primary measurements or selection values (use primary-value/value), text-length counters, count coercion or rounding, automatic live announcements, or treating the decorative marker as the accessible count description.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": []
}
```

### P3 — indicator-count-cap → max

Indicator candidate type `number`, optional only in the count branch; constant default 99. Invalid runtime thresholds use 99, not a data-validation failure. Valid totals above the threshold remain valid and are represented by threshold-plus-sign text.

```json
{
  "id": "indicator-count-cap",
  "name": "max",
  "meaning": "Display overflow threshold for a passive supplementary item-count marker, not a validation limit on the underlying count.",
  "whenToUse": "A count marker displays the actual decimal count through a positive safe-integer threshold and the decimal threshold followed by + above it. Indicator defaults to 99 and falls back to 99 for zero, negative, fractional, non-finite, unsafe or non-number max input.",
  "avoid": "Rejecting or clamping valid counts above the display threshold, data-storage or validation limits, primary numeric bounds, parsing or rounding invalid thresholds, or changing the underlying accessible count wording.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": []
}
```

### Exact per-proposal byte bindings

For P1/P2/P3 respectively, hash the UTF-8 bytes of the exact corresponding fenced JSON content, from its opening `{` through `}` **including the immediately following LF**, excluding both fence lines. Do not reformat, sort keys or omit that LF. The reproducible extraction is the three captures of regex `^\x60\x60\x60json\n([\s\S]*?\n)\x60\x60\x60$` in multiline mode, hashed in document order.

| Candidate | Exact fenced-payload SHA-256 |
| --- | --- |
| P1 / anchor-corner-position | 0bdb30bd41f9447f7318b3e211518a65959318a7ef4244b2c85a428cfa2bf378 |
| P2 / indicator-count | d4ffee5fc649db1a92475f63d514e28e75757679d53b09a2a6cf4a86a3b23a0d |
| P3 / indicator-count-cap | 7d727f7e689ec2d0ac91c72f70a1442f9ddc72d01e18384934ad6e10466ec535 |

These are proposal byte identities, **not** registry approval.contentHash. The registry's conventionHash uses compact recursively key-sorted semantic JSON with no final LF, excludes approval/usages, sorts semantic sets and includes status. A later approved entry therefore needs its actual approved-state conventionHash and recoverable owner grant scoped exactly to convention:anchor-corner-position, convention:indicator-count or convention:indicator-count-cap. Do not paste a fence/document digest into approval or infer consent from a matching hash. All three bindings remain approval candidates here, with approval null.

### Read-only provenance, not Indicator runtime evidence

Reviewed preparation inputs in sibling worktree `/home/egdev/proyectos/egdev-design-system-worktrees/indicator`, baseline f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23; these are whole-file byte identities, not new approvals:

| Sibling repository-relative path | Whole-file SHA-256 |
| --- | --- |
| docs/components/indicator/v0.2/spec.md | 5e233311abef64a815ab5d7db8a5e42dfc4e52dfaba7064b84909883a79893fd |
| docs/components/indicator/v0.2/implementation-plan.md | 89e68a824f574e8ff451e77ef1836279b901203b6c61e3838a49dc8a815f3c43 |
| docs/components/avatar/v0.2/indicator-amendment.md | 3064f3c006f8dde22ce1304f445bd8e0af5af398b85b63df40eb711aa27b19d8 |

Manually read existing AvatarProps/avatarBadgeVariants in `packages/ui/src/atoms/avatar/types.ts`, SHA-256 b0a6b163639218e7177cd7254c78a4724ef73658ed0861d18cc96e5e6735c3cb, and useAvatar in `packages/ui/src/atoms/avatar/useAvatar.ts`, SHA-256 904de1e3f10d8f456689caf067739b23a7753be5dd9384d9d143fc1ce9e4f1c0: existing physical bottom-right decoration only, no public position/count/max usage. BadgeProps in `packages/ui/src/atoms/badge/types.ts`, SHA-256 81d97cd46835e08a2ed5d846d352642ef9230661b4dcfe04d7e4be921c7d6f3e, is a passive text-label API, not count/cap evidence. These actual source hashes are NOT fictional IndicatorProps revisions. Indicator runtime usage remains Pending; this document supplies no source object for it.

### Future parent integration gates

1. Obtain explicit owner decisions bound to these exact proposal bytes/meanings and separately recover the actual approved-state semantic hashes/scopes before any status promotion. Approval references must identify real recoverable decisions, never this writer's self-check. No registry change is made now.
2. Only after separately authorized actual Indicator implementation, manually inspect `packages/ui/src/atoms/indicator/types.ts` / public IndicatorProps and IndicatorPosition, confirm exact branch types/defaults/meaning, and hash the whole actual file. Parent may then append schema-valid Indicator usages (`component`, component-specific `type`, `status`, reviewed `source: {path, symbol, revision}`) to approved entries. No future source digest or implemented usage is invented; no unrelated Avatar/Badge migration is included.
3. Parent alone authorizes exact registry/integration edits, preserves existing entries/receipt chains, regenerates docs/prop-naming.md with pnpm props:docs and runs the then-authorized pnpm props:check / pnpm test:props. No generator/application/type/runtime tests, browser or independent verification verdict is claimed here; the current task is document/schema/hash self-check only.
