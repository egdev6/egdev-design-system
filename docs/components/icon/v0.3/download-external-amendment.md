# Component contract — Icon glyph amendment

- **Version / status:** v0.3, **Draft — not approved**.
- **Approval / recovery:** Pending. This local snapshot proposes an amendment to [Icon v0.2](https://github.com/egdev6/egdev-design-system/issues/58#issuecomment-6244802920); its [implementation record](../v0.2/implementation-evidence.md) identifies the prior approval and limits. The later addition of three status glyphs is recorded in [FieldMessage v0.2](../../field-message/v0.2/spec.md) and its [owner-decision record](../../field-message/v0.2/approval.json).
- **Current situation:** #423, split from #404, requests two more glyphs. The React implementation currently has 45 names; the generated catalog and naming usage still describe 42. No new glyph or visual approval exists yet.
- **Snapshot identity:** `version: 0.3`; `contentSHA256: Pending`; `visualHashes: VIS-01 → Pending, VIS-02 → Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/58`; `latestPublishedComment: Pending`. Tracked separately: [request #423](https://github.com/egdev6/egdev-design-system/issues/423).
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and the final newline; metadata above it is excluded. Finalization and scoped owner approval must bind this version, digest and identified visuals.

## 1. Purpose and scope

- **Need / non-goals:** Add only `download` and `external` to the closed set. No semantic color roles, other glyphs, runtime icon-library dependency or consumer migration.
- **Cataloging / alternatives:** Extend the exported Icon atom's existing `name` selection. Current glyphs do not supply a download-tray or external-link mark; hand-drawn consumer SVGs would duplicate its responsibility. Composition, extraction and a new component are unnecessary.
- **Evidence:** `packages/ui/src/atoms/icon/{types.ts,icon-paths.ts,useIcon.ts,Icon.tsx,index.ts}` and `packages/ui/src/index.ts` expose the existing `@egdev/ui` atom. `scripts/catalog_data.py` and `docs/CATALOGO.md` lag behind its current 45-name set; they are not proof of the runtime set.

## 2. Anatomy and composition

| Part | Responsibility | Element / primitive | Content |
| --- | --- | --- | --- |
| Root | Passive glyph, public `eg-icon` marker | SVG, `viewBox="0 0 24 24"` | Internal glyph descriptors |
| Accessible name | Name an informative icon when requested | Existing Radix AccessibleIcon | Consumer-supplied `label` |

No interaction primitive, `asChild`, ref or new public parts. Preserve existing markers and legacy `.eg-icon*` consumers. `icon-paths.ts` is internal data, not an export.

## 3. Public API

| Prop | Type | Required / default | Rule |
| --- | --- | --- | --- |
| `name` | Existing `IconName` 45-name union plus `'download' \| 'external'` | Required; no default | Select one glyph; arbitrary names remain unsupported. |
| `size` | `IconSize = 'sm' \| 'md' \| 'lg'` | Optional; `md` | Preserve the existing token-backed preset classes. |
| `filled` | `boolean` | Optional; `false` | Preserve currentColor fill plus stroke when true. |
| `label` | `string` | Optional; absent | Non-empty value uses AccessibleIcon; omitted or empty is decorative. |

**Naming and provenance:** [Registry source](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md): reuse approved `icon-glyph-name` → `IconProps.name`; no new prop, semantic ID, alias or exception is proposed. Reviewed source: `packages/ui/src/atoms/icon/types.ts#IconProps`, `sha256:673126c6aea8fc04533a323869695bf96abc5ccc732433c446c834d5be577292`. The registry's `IconName` usage says 42 although the reviewed union has 45; a separately approved implementation should update the usage to the resulting 47 and refresh every usage hash affected by changing `types.ts`, then regenerate the reference. Convention approval is separate from this amendment.

Propose Lucide `download` → system `download` and Lucide `external-link` → system `external`, using the existing verbatim Lucide 1.55.0 descriptor convention and 24×24 geometry. The issue title says “external-link”, but its scope and the batch specify `external`; existing shortened mappings such as `grip` → `grip-vertical` establish precedent. Do not add `external-link` as another public name. Verify the exact source descriptors and attribution before implementation: the local Lucide source files were not available for inspection. `THIRD_PARTY_NOTICES.md` already lists both source glyphs among Feather-derived Lucide icons with ISC/MIT notices; retain the applicable notices and record provenance.

Compatible native SVG attributes pass to the SVG except component-owned geometry, paint and accessibility attributes. No public ref or `asChild`; no controlled/uncontrolled state. Existing exports, defaults and consumers remain unchanged. React 18/19 compatibility requires package-consumer evidence, not types alone.

## 4. Behavior

| Input / action | Expected result | Event |
| --- | --- | --- |
| Either new name | Render its matching non-empty glyph in the existing SVG | None |
| Change `name` | Replace glyph descriptors, retaining the SVG root | None |
| Existing name, size, fill or label | Retain existing behavior and defaults | None |

No state machine, fallback for unsupported runtime names, activation, navigation or download behavior. The consumer owns actions and destinations.

## 5. Accessibility

- By default both SVGs remain `aria-hidden` and non-focusable; no manual image role or title. An empty `label` is also decorative; a non-empty label uses the existing Radix AccessibleIcon path.
- A containing button or link needs its own accessible name; avoid duplicating that name with a labelled icon. When a standalone icon carries meaning, the consumer supplies an appropriate label and must not rely on color alone.
- Keyboard, focus restoration, announcements and touch targets are not applicable to this passive glyph; the containing control owns them.

## 6. Appearance

| Axis | Values | Default / restriction |
| --- | --- | --- |
| Glyph | Existing 45 plus the two proposed names | Same 24×24 descriptor and round-cap/join convention |
| Size | `sm`, `md`, `lg` | `md`; retain `size-4`, `size-(--icon-size)`, `size-7` respectively |
| Fill | `false`, `true` | `false`; existing currentColor stroke/fill |

Existing token-backed CVA in `types.ts` and `cn()` composition remain; no Material surface, motion, dynamic geometry, new tokens or dependency. `className` supports the existing outer layout, token text-color and spacing-scale `size-*` utilities; recognized conflicts merge through `cn`/`twMerge`, not universal appearance overrides. **No stylesheet.** The six meaningful files remain `types.ts`, `useIcon.ts`, `Icon.tsx`, `Icon.test.tsx`, `Icon.stories.tsx`, and `index.ts`; the only additional internal module remains `icon-paths.ts` for descriptors.

The existing `types.ts`/story prose describes `md` as 20px, while `packages/tokens/src/theme.css` currently sets `--icon-size: 16px`; no size or token change is proposed here. Treat numeric-size reconciliation as a separate owner decision, not a visual measurement established by this draft.

### Expected-design visual reference

| ID | Image / scenario | Source and conditions | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending; `download` glyph | Expected-design source, version, viewport, browser, scale, theme, fonts and crop pending | Pending owner adoption; hash Pending |
| VIS-02 | Pending; `external` glyph | Expected-design source, version, viewport, browser, scale, theme, fonts and crop pending | Pending owner adoption; hash Pending |

No captures are authorized in this batch. Visual conformity is **Not evaluated**; implementation geometry is not an approved expected-design reference. Both IDs relate to AC-01 and AC-04; capture provenance, comparable conditions and separate owner approval are prerequisites for visual comparison.

## 7. Acceptance criteria

| ID | Observable promise | Planned check / story | Observed evidence |
| --- | --- | --- | --- |
| AC-01 | Both requested names type-check and render their own non-empty, source-verified 24×24 glyphs; switching names retains the SVG root | `Icon.test.tsx` type/render, rerender and descriptor checks; Gallery, VIS-01/02 | Pending |
| AC-02 | Both remain decorative by default and with empty label; a non-empty label follows existing AccessibleIcon behavior | Component accessibility tests for both modes and labelled-control name; Labelled story | Pending |
| AC-03 | Existing glyphs, unknown-name rejection, root marker, presets, fill, merging and exports remain compatible | Existing-name regression, type/export and package-consumer checks | Pending |
| AC-04 | Gallery and real docgen/Controls expose both names | `Icon.stories.tsx`, metadata tests; browser widget/visual check when separately authorized | Pending |
| AC-05 | Catalog and naming evidence agree with the resulting set | Update `scripts/catalog_data.py`; regenerate `docs/catalog.json`, `docs/CATALOGO.md` and registry reference using existing generators; check outputs | Pending |

### Spec closure

Draft only: visual source, glyph-source verification, owner approval and separately approved implementation plan remain pending. No code, token, dependency or GitHub change is authorized by this document.

### Open decisions for the owner

1. Confirm `external` as the public name and `external-link` solely as its Lucide source mapping.
2. Confirm the proposed source/attribution after exact descriptors are verified, and select expected-design sources and capture conditions for VIS-01/02.
3. Decide separately whether to address the existing numeric size documentation/token discrepancy; this amendment preserves current behavior.

### Planned checks

After separate plan approval: focused Icon/type, accessibility, metadata and export/consumer tests; verify source paths/notices and gallery; regenerate the catalog and registry references; run `pnpm props:check`, `pnpm test:props`, `pnpm test`, `pnpm typecheck` and `pnpm lint`. Capture/compare visuals only with separate source and tool authorization. All checks are pending, not results of this draft.
