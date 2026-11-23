# Icon v0.4 — arrow-left amendment

- **Version / status:** v0.4 — Approved 2026-11-23 (owner, in session; odd/tasks/consumer-request-specs.md L31). Implementation plan requires separate approval.
- **Amends:** The approved [Icon v0.2 snapshot](https://github.com/egdev6/egdev-design-system/issues/58#issuecomment-6244802920) and its [implementation evidence](../v0.2/implementation-evidence.md), the later status-glyph addition in [FieldMessage v0.2](../../field-message/v0.2/spec.md) with its [owner decision](../../field-message/v0.2/approval.json), and the approved [Icon v0.3 glyph amendment](../v0.3/download-external-amendment.md) with its [implementation evidence](../v0.3/implementation.md). The v0.3 header retains a Pending digest; its implementation record identifies the payload SHA-256 as `8ad26aabdc7c98b5a3e42a07e6705663d9e3454dc61e4fb01f40a5cca15562bf`. Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner session 2026-11-23, with the verbatim choice recorded in this file's resolved decisions and in odd/tasks/consumer-request-specs.md L31. This spec does not authorize implementation; a separate plan approval is required. No code, token, dependency, registry or GitHub change is authorized here.
- **Snapshot identity:** `version: v0.4`; `contentSHA256: ab4b9e389e367aaec8b9f3cffc8b8ec2969de56819638a3fc13830a531b7e94c`; `visualHashes: VIS-01 14991312739b67ed6f1d25a0a8df54bffb0185f6035f7c3916a055c3246bec35 (historical v0.2); VIS-02 Pending`; `approvalReference: owner session 2026-11-23 (odd/tasks/consumer-request-specs.md L31)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/58`; `latestPublishedComment: Pending` (this amendment is unpublished; latest remote history was not checked). [#537](https://github.com/egdev6/egdev-design-system/issues/537) is the consumer request, not a new component issue.
- **Hash definition:** SHA-256 of the UTF-8 payload from the line-start `## 1. Purpose and scope` through EOF, with LF line endings and the final newline. Tracking metadata above that heading is excluded.

## 1. Purpose and scope

**Proposal.** Add one physical left-pointing glyph, `arrow-left`, to the existing Icon set for back/previous affordances. The application decides where it is appropriate, what action or destination it represents and which accessible name to use. Icon does not navigate, infer the user's intent or automatically mirror any glyph in RTL. In an RTL flow where the appropriate previous direction is physically right, the application chooses `arrow-right` itself; it must decide based on the particular interaction, not direction alone. The owner selected a simple glyph with app-owned usage ([request #537 and its triage comment](https://github.com/egdev6/egdev-design-system/issues/537); `odd/tasks/consumer-request-specs.md:18-19`, S13 and S4).

**Cataloging / alternatives.** Extend the public `@egdev/ui` Icon atom's existing glyph selection. Existing reuse alone lacks a left arrow. Rotating `arrow-right` with application CSS works as a temporary mitigation but overrides system-component appearance; a direction-aware component, a new prop, a wrapper, composition or a new component would add behavior or duplicate Icon's responsibility. No existing glyph or consumer is changed by this proposal.

**Evidence obtained; not evidence that the new glyph is implemented.**

- The public atom and its types are exported by `packages/ui/src/atoms/icon/index.ts:1-2` and `packages/ui/src/index.ts:12`. The required `IconName` union has 47 names and no `arrow-left`; `arrow-right`, `arrow-up-right` and `arrow-down` are at `packages/ui/src/atoms/icon/types.ts:5-15`, with the rest ending at `:52`.
- `packages/ui/src/atoms/icon/icon-paths.ts:19,58-68` stores internal 24-unit SVG descriptors: `arrow-right` has `M5 12h14` and `m12 5 7 7-7 7`; `arrow-up-right` and `arrow-down` use the same directional naming family. `packages/ui/src/atoms/icon/useIcon.ts:50-72` selects the descriptors and root props; `packages/ui/src/atoms/icon/Icon.tsx:6-17` renders them and the existing AccessibleIcon branch. The root owns a 24 × 24 viewBox and round caps/joins; `packages/ui/src/atoms/icon/types.ts:104-111` uses currentColor and the stroke token. At default tokens, `--icon-stroke` is 1.75 and `--icon-size` is 16px (`packages/tokens/src/theme.css:480-483`).
- [Nexo #91](https://github.com/egdev6/nexo/issues/91) reports a Settings back button currently using `arrow-right` rotated 180° in `apps/hub/src/settings/settings.css`; DS046 reports that rule. The issue reports a TODO and `apps/hub/src/design-system-allowlist.ts` mitigation. These consumer files were not inspected in this repository; keep the mitigation until an actual release is adopted in Nexo.
- `packages/ui/src/atoms/icon/Icon.stories.tsx:6,9-11,36-48` derives the Gallery from the descriptors but documents a 47-name set. `packages/ui/src/atoms/icon/Icon.test.tsx:41-58` asserts the count. Real docgen tests enumerate Icon's `name` and FieldMessage's `icon` (`packages/ui/src/lib/storybook-docgen.test.ts:1316-1320,3422-3436`); the installed Controls test asserts Icon's 47 options (`packages/ui/src/lib/storybook-controls.test.ts:1657-1666`).
- The catalog source says 47 (`scripts/catalog_data.py:19`), as do generated `docs/CATALOGO.md:58` and the Icon usage at `skills/_shared/prop-naming.json:3251-3273`. The registry has four usages sourced from Icon's `types.ts` (`:850-859,1870-1879,3264-3273,3291-3300`).
- `scripts/build-artifact.mjs:728-742` records the docgen type name, not enum values. The current `packages/system/design-system.json:1` records Icon's `name` as required `enum` and contains no `IconName` type record; `packages/system/system.md:2047-2055` likewise says `enum` without listing glyphs. `packages/mcp/src/server.ts:30-35,55-56` serves the artifact component or rendered system reference, not an independent icon inventory. `scripts/system-md.mjs:9-10` reads the existing JSON, so checking the Markdown alone does not prove source-to-artifact freshness.
- Package checks use representative glyphs rather than a complete list: `scripts/package-exports.test.mjs:4389-4435` exercises SSR and named glyphs; `scripts/package-consumption.test.mjs:2655-2668,8118-8128,8895-8900` exercises exported types, rendering and rerenders. These are existing fixtures, not verification of `arrow-left`.

## 2. Anatomy and composition

The delta adds only another descriptor entry to the existing passive Icon; the root remains an inline SVG with the public `eg-icon` marker and its internal glyph paths. An informative instance continues to use the existing Radix AccessibleIcon composition for its consumer-supplied `label`. No new element, public part, interaction primitive, `asChild` or ref is proposed. `icon-paths.ts` remains internal data, not a package export; preserve existing markers and legacy `.eg-icon*` consumers.

## 3. Public API

| Surface | Proposed delta / unchanged rule |
| --- | --- |
| `name: IconName` | Required, no default. Add exactly `'arrow-left'` to the current 47-name union, making 48 names; existing values and exports stay. Arbitrary names remain unsupported, with no promised runtime fallback. |
| `size?: 'sm' \| 'md' \| 'lg'` | Unchanged; default `md` and existing preset/token behavior. |
| `filled?: boolean` | Unchanged; default `false`, with existing currentColor fill in addition to the stroke when true. |
| `label?: string` | Unchanged; omitted or empty is decorative, non-empty uses the existing AccessibleIcon behavior. |
| Native SVG attributes, `className` and exports | Existing passthrough, component-owned geometry/paint/naming restrictions and supported class composition remain. No new prop, event, default, ref or `asChild`; no controlled state. |

**Prop naming lookup.** The [registry source](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md) already contain approved `icon-glyph-name` → `IconProps.name` (`skills/_shared/prop-naming.json:3251-3273`; `docs/prop-naming.md:132`). This changes a value of an existing prop, not the prop name or semantic concept: no new entry, alias or exception is proposed, and convention approval is independent of this draft. The reviewed existing usage is `{ path: 'packages/ui/src/atoms/icon/types.ts', symbol: 'IconProps', revision: 'sha256:b586847d42cc179674cf6c59bfd9434d421dc4e45759e355d770b9289b58a361' }`; its whole-file hash was checked for this draft. Under a separately authorized implementation, update its count to 48, review and refresh all four Icon usage revisions when `types.ts` changes, and regenerate the reference; do not edit the registry for this draft.

**Compatibility and inventory impact.** The union addition preserves existing values, defaults and runtime behavior, but it can break exhaustive TypeScript switches or `Record<IconName, …>` maps that must handle every member. The required internal descriptor map is such a record (`packages/ui/src/atoms/icon/icon-paths.ts:19`); no other direct `Record<IconName, …>` was found in the bounded `packages/ui/src` search. Downstream exhaustive consumers have not been inspected and must audit their own switches and inventories. Shared `IconName` inputs include FieldMessage, Indicator, Menu, NavList, CommandPalette, Timeline, ModuleRail and TabBar (`packages/ui/src/atoms/field-message/types.ts:3,26`; `atoms/indicator/types.ts:3,86`; `molecules/menu/types.ts:3,36`; `molecules/nav-list/types.ts:3,61`; `molecules/command-palette/types.ts:3,12`; `molecules/timeline/types.ts:3,63`; `organisms/module-rail/types.ts:3,12`; `organisms/tab-bar/types.ts:3,14`; latter paths relative to `packages/ui/src/`). The existing Carousel uses a rotated `arrow-right` (`packages/ui/src/molecules/carousel/Carousel.tsx:25-32`, `packages/ui/src/molecules/carousel/types.ts:163`); no migration of that composition is implied.

## 4. Behavior

| Input / condition | Proposed result |
| --- | --- |
| `name='arrow-left'` | The existing descriptor selection and SVG rendering pipeline draws its non-empty left arrow. No event is emitted. |
| Change between `arrow-left` and another name | Replace the glyph descriptors through the existing pipeline, retaining the SVG root when the same rendering branch is used. |
| LTR or RTL document / SVG direction | `arrow-left` remains physically left and `arrow-right` remains physically right. Neither is automatically mirrored; the consumer selects the appropriate glyph. |
| Existing name, size, fill or label | Existing rendering, defaults and accessibility branch remain unchanged. |

There is no interaction, direction state, automatic previous/next choice, route, navigation or download action. Keyboard, focus and state transitions are not applicable to this passive glyph; an enclosing control owns them.

## 5. Accessibility

With `label` omitted or empty, the SVG remains decorative, `aria-hidden` and non-focusable. A non-empty label follows the existing Radix AccessibleIcon path; no manual SVG title or new image role is proposed. A containing back button or link must have its own appropriate accessible name; avoid a duplicate icon label when the surrounding control already supplies the name. The consumer owns focus, activation, touch target, localization and any announcement; meaning must not depend on color alone.

## 6. Appearance

**Proposed path-data approach.** Derive the left arrow by reflecting the existing `arrow-right` descriptor geometry horizontally about `x=12` in its `0 0 24 24` viewBox (`x' = 24 − x`), rather than drawing an independently estimated glyph or applying a runtime/CSS transform. Store the resulting two static path descriptors:

| Part | Existing `arrow-right` | Proposed reflected `arrow-left` |
| --- | --- | --- |
| Shaft | `M5 12h14` | `M19 12h-14` |
| Head | `m12 5 7 7-7 7` | `m12 5-7 7 7 7` |

The head runs from `(12,5)` through `(5,12)` to `(12,19)`; the shaft spans `x=5…19` at `y=12`. The same center, bounds and reflected geometry preserve the right arrow's optical alignment and weight without a CSS override or a new direction mechanism. SVG coordinates are glyph data, not new color, spacing or font values. The default unfilled stroke remains inherited `currentColor` via the existing `--icon-stroke` utility, with round caps/joins and the unchanged 24 × 24 viewBox. `filled`, sizes and supported layout, token text-color and spacing-scale `size-*` classes retain their existing contract; `cn()`/`twMerge` resolves recognized utility conflicts, not arbitrary CSS precedence. No new inline appearance, color, token, Material surface, motion or dependency is proposed.

The existing `arrow-right` descriptors are Foundation paths in the Lucide family (`packages/ui/src/atoms/icon/icon-paths.ts:1-12`); `THIRD_PARTY_NOTICES.md:53-60,81-87` retains the Lucide and Feather notices and lists both arrow directions. A later implementation must identify this glyph as derived from the existing `arrow-right` geometry and review attribution rather than claim an uninspected verbatim upstream source. Retain the existing 25 Foundation and 22 Lucide descriptors unchanged; the proposed reflected glyph is one additional derived descriptor, not a new runtime icon-library dependency.

**Files.** Preserve the six existing roles: `types.ts` (API/CVA), `useIcon.ts` (selection and composition), `Icon.tsx` (JSX), `Icon.test.tsx`, `Icon.stories.tsx` and `index.ts`. `icon-paths.ts` remains the sole additional internal data module. **No stylesheet**; preserve legacy CSS. The change adds no Surface recipe or dynamic geometry.

### Expected-design visual reference

| ID | Image / descriptive English alt text and scenario | Source, conditions and status |
| --- | --- | --- |
| VIS-01 | [Historical Icon board](../../../design/foundation-boards/v2026-10-17/Icon.png) — existing right, up-right and down glyphs and size examples | Historical v0.2 expected design only, not a capture or approval of `arrow-left`; SHA-256 above, checked for this draft. Original preview, provenance and approval are in [capture metadata](../../../design/foundation-boards/v2026-10-17/capture.json) and [v0.2 evidence](../v0.2/implementation-evidence.md). |
| VIS-02 | Pending — proposed `arrow-left` beside `arrow-right`, including an RTL context and preset sizes | Expected-design source/version, actual image, viewport, device scale, browser/version, theme, fonts, motion/transparency preferences, crop, capture date/tool, hash and scoped owner adoption are Pending. No capture or server start was authorized for this draft. |

VIS-01 was captured from the Foundation Icon preview on 2026-10-17 using Playwright MCP and Chromium 148 on Linux: 1280 × 900 viewport, DPR 1, dark theme, Barlow/Barlow Condensed/JetBrains Mono, reduced motion off, full-viewport board; transparency preference was not recorded. It does not depict `arrow-left`. The v0.3 gallery image (`../v0.3/captures/gallery-chrome-900.png`) is an implementation observation, not an approved expected design for this proposal. Follow the [visual guide](../../../design/README.md): agree source and conditions and separately authorize capture/hosting; a real component-zone image and recoverable approval must identify its hash. **Visual conformity: Not evaluated.** The v0.3 owner decision requires stories and a real capture before each Icon implementation PR merges; that capture alone does not approve expected design or prove behavior/accessibility.

## 7. Acceptance criteria

All checks below are **planned**, not observed. They require a separately approved implementation plan and appropriate command, browser and consumer authorization. Stories do not replace behavior or accessibility tests.

| ID | Observable promise | Planned check / scenario | Observed evidence |
| --- | --- | --- | --- |
| AC-01 | The public `IconName` and required `name` accept exactly one additional value, `arrow-left`; the other 47 remain and unknown names stay rejected. | Type and export tests against `@egdev/ui`, a 48-name uniqueness/completeness assertion and negative unknown-name case. | Pending |
| AC-02 | The glyph renders the two reflected descriptors in a `0 0 24 24` SVG, with the existing stroke, caps/joins, optical bounds and no runtime/CSS mirroring. | Public DOM/path checks compare the specified reflected coordinates with `arrow-right`; verify token-backed stroke, caps/joins and no transform. VIS-01/02; browser review at agreed conditions. | Pending |
| AC-03 | In both LTR and RTL, `arrow-left` points physically left and `arrow-right` physically right; selecting either does not navigate or choose a direction. | Component and real-browser direction fixtures for both glyphs and directions, with no direction-dependent transform; regression on existing `arrow-right`. | Pending |
| AC-04 | The existing SVG selection/rerender pipeline, root marker, defaults, size, fill, passthrough and supported class merging remain; switching names within the same branch retains the SVG root. | Render/rerender tests for the new and existing glyphs; preserve the existing root, preset, filled and passthrough regressions. Check emitted utilities and a consumer without its own Tailwind compiler. | Pending |
| AC-05 | Omitted/empty `label` remains decorative and non-focusable; non-empty `label` uses the existing AccessibleIcon branch, and a containing named control remains properly named. | Public DOM, role/name, empty-label and keyboard focus tests; assistive-technology review when authorized. | Pending |
| AC-06 | Gallery, real docgen and the installed Controls expose `arrow-left` as one of 48 names, including shared FieldMessage metadata; existing entries and defaults remain. | Update count/inclusion assertions in `Icon.test.tsx`, `storybook-docgen.test.ts` and `storybook-controls.test.ts`; check Gallery and real browser Controls, not manual `argTypes`. | Pending |
| AC-07 | The 48-name catalog and naming usage are accurate, source attribution is retained, and affected reviewed source hashes stay fresh. | Under an authorized plan, update `scripts/catalog_data.py`, regenerate `docs/catalog.json` and `docs/CATALOGO.md`; review all four `IconProps` registry revisions and count, regenerate the naming reference, and check notices and provenance. | Pending |
| AC-08 | The system artifact and MCP stay consistent with the changed source and their existing schema; no enum-list capability is falsely claimed. | Regenerate `packages/system/design-system.json` with the existing artifact generator and verify its Icon `name` is still required `enum`; regenerate/check `packages/system/system.md` as appropriate and verify `get_component` / `get_design_system_md` use the regenerated artifact. Current schema stores no glyph-value list; adding one needs separate scope and approval. | Pending |
| AC-09 | The exported glyph works in SSR and installed React 18/19 consumers; existing package behavior remains, and consumers know to audit exhaustive maps. | Extend representative `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` fixtures with the new name, type, rendered path and rerender; run authorized fresh-build and packed-consumer checks. Nexo adopts only after a release, separately. | Pending |
| AC-10 | Expected-design comparison is not claimed without an approved new-glyph reference and comparable conditions; the prior Icon PR capture requirement remains. | Agree and authorize VIS-02 capture/adoption or explicitly approve the spec without a new expected-design image; obtain the real implementation-PR capture separately and report its limits. | Pending |

### Resolved decisions

1. **Spec:** approved as drafted, including the reflected path data (owner choice, verbatim: "Aprobar sin captura nueva (Recomendado)"). The glyph is simple and not RTL-aware, as decided in triage.
2. **Visual reference:** approved without a new expected-design capture; VIS-02 stays pending and visual conformity is Not evaluated. The existing requirement for a real capture in each Icon implementation PR remains.
3. **Next step:** propose a separate implementation plan covering the registry, catalog, generated artifact, package-consumer and attribution steps; it needs its own approval. Consumer adoption and release are decided separately.
