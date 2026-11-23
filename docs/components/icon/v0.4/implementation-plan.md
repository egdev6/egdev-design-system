# Icon v0.4 — implementation plan for `arrow-left`

- **Status:** Draft proposal. The approved amendment does not approve this plan, implementation surfaces, command execution, capture, release or publication. Obtain separate plan and execution authorization before changing anything described below.
- **Contract authority:** [`arrow-left-amendment.md`](arrow-left-amendment.md), version `v0.4`, `contentSHA256: ab4b9e389e367aaec8b9f3cffc8b8ec2969de56819638a3fc13830a531b7e94c`. On preparation, its unique line-start `## 1. Purpose and scope` through EOF, including the final LF and excluding header metadata, produced exactly that SHA-256; the payload contains no CR bytes.
- **Approval:** `approvalReference: owner session 2026-11-23 (odd/tasks/consumer-request-specs.md L31)`. The amendment and L31 record the verbatim choice “Aprobar sin captura nueva (Recomendado)”. A separate plan approval is still required. Canonical Icon issue [#58](https://github.com/egdev6/egdev-design-system/issues/58); [#537](https://github.com/egdev6/egdev-design-system/issues/537) is the consumer request, not a new component issue. Publication of this amendment remains Pending.
- **Visual authority:** VIS-01 is the historical v0.2 board, SHA-256 `14991312739b67ed6f1d25a0a8df54bffb0185f6035f7c3916a055c3246bec35`; it does not depict `arrow-left`. VIS-02 has no adopted expected-design image. The owner approved the amendment without a new expected-design capture; visual conformity remains **Not evaluated**. The separate real implementation-PR capture is still required before merge.
- **Preparation baseline:** `f5b9ce26d5ddf40eb226fc156058b87e35889267`; reviewed `packages/ui/src/atoms/icon/types.ts` SHA-256 `b586847d42cc179674cf6c59bfd9434d421dc4e45759e355d770b9289b58a361`, matching the four current registry usages. Static inspection and digest verification only: no tests, build, browser, screenshots, assistive technology or packed consumers were run for this plan. All implementation and verification below are Pending.
- **Precedent:** the bounded plan in [`v0.2/implementation-evidence.md`](../v0.2/implementation-evidence.md) and [`v0.3/implementation.md`](../v0.3/implementation.md), including its real-capture requirement; there are no separate `implementation-plan.md` files in those directories.

## 1. Scope and gates

1. After separate plan approval, extend the existing exported Icon atom by exactly one physical glyph. The app chooses the name and meaning; neither arrow automatically mirrors in RTL, navigates or decides a previous/next action. Preserve the other 47 names and their data. No new prop, event, default, ref, `asChild`, wrapper, runtime fallback or consumer migration.
2. Preserve the six meaningful roles: `types.ts`, `useIcon.ts`, `Icon.tsx`, `Icon.test.tsx`, `Icon.stories.tsx` and `index.ts`. `icon-paths.ts` remains the only additional, internal data module. **No stylesheet**; keep legacy CSS and the existing Radix AccessibleIcon, CVA and `cn()` behavior. No token, Material recipe, dependency or public export change is needed.
3. Future edit surfaces, generated outputs, build/dist writes, test scratch, packed-fixture installation, browser/server access and capture assets require appropriate separate authorization. The table below proposes those surfaces; it is not permission to edit them now. Stop for a replacement surface authorization or owner decision if actual work needs anything else, a token/dependency, a changed contract or an artifact-schema extension.
4. These are planned checks, not observed results. Test-first is mandatory for the new behavior; retain existing tests and collect actual output. An inaccessible browser, missing fonts or packed dependencies is a reported pending gate, not grounds to fabricate evidence or use a network fallback without permission.

## 2. Proposed file-by-file work

| Path | Planned responsibility |
| --- | --- |
| `packages/ui/src/atoms/icon/types.ts` | Add `'arrow-left'` to the required exported `IconName` union beside the directional names. Correct its set/provenance comment to 25 Foundation, 22 Lucide additions and one derived glyph. Preserve all 47 existing literals, `IconProps` controls/defaults, CVA and native restrictions. |
| `packages/ui/src/atoms/icon/icon-paths.ts` | Add the two static descriptors in §3 to the existing exhaustive `Record<IconName, IconGlyph>`; preserve all prior descriptors byte-for-byte. Update provenance to identify a reflection of the existing Foundation `arrow-right`, not a verbatim upstream copy. This remains private data. |
| `packages/ui/src/atoms/icon/Icon.test.tsx` | RED-first public render, path, direction, rerender, accessibility and type checks in §4; assert exactly 48 distinct names and all prior 47, rather than relying on a count alone. Retain prior regressions, including `arrow-right`, download/external-link, presets, fill, native passthrough, supported merge and file contract. |
| `packages/ui/src/atoms/icon/Icon.stories.tsx` | Update the 47-name prose to 48; Gallery already derives its entries from the descriptor map. Add a focused `Directions` story placing the two physical arrows at `sm`, `md` and `lg` in LTR and RTL contexts, using the real Icon and token-backed layout only. Keep `Default` required args only, English JSDoc, autodocs, no manual `argTypes` or `play`. |
| `packages/ui/src/atoms/icon/useIcon.ts`, `Icon.tsx`, `index.ts`; `packages/ui/src/index.ts` | Inspect and preserve; **no change expected**. Existing selection, SVG/AccessibleIcon branches and public type/value exports already carry the addition. Do not introduce direction handling or expose the data module. |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Change both real-parser inventories: required `Icon.name` and optional `FieldMessage.icon` from 47 to 48; require `arrow-left`, all previous members, uniqueness and absence of unsupported names. Keep requiredness, defaults, own tags, allowed native rows and the other metadata regressions. |
| `packages/ui/src/lib/storybook-controls.test.ts` | Extend installed extraction → registered enhancer → native inference assertions for **both** Icon `name` and FieldMessage `icon`: 48 exact unique options including the new value and the prior set, appropriate requiredness, select widgets, unchanged defaults/args and zero owned diagnostics. Preserve generic enhancer coverage; do not change preview configuration or manually force controls. Verify real browser widgets separately. |
| `scripts/catalog_data.py` → `docs/catalog.json`, `docs/CATALOGO.md` | The Icon row explicitly says 47, so update it to 48 and describe the one derived glyph without misclassifying it as a 23rd verbatim Lucide addition. Regenerate both outputs with the existing catalog generator; never hand-edit them. |
| `skills/_shared/prop-naming.json` → `docs/prop-naming.md` | Reuse the approved `icon-glyph-name` / `name` convention, not a new concept, alias or exception. After reviewing the final `IconProps` source and computing its **whole-file byte hash**, refresh all four usages sourced from Icon `types.ts`: `preset-dimensions`, `accessible-name`, `icon-glyph-name` and `filled-glyph`; update the glyph usage from 47 to 48. Preserve semantic approvals and all unrelated usages. Generate the reference with `pnpm props:docs`; `props:check` cannot itself prove symbol semantics or human consent. |
| `scripts/design-system-artifact.test.mjs`; `packages/system/design-system.json`, `packages/system/system.md` | Test the regenerated source-derived Icon contract: `name` remains required `enum` with no default; preserve schema and do not assert an enum-value list that the generator does not provide. Regenerate the JSON with `pnpm artifact --write`, then Markdown with `pnpm system:docs`, and check both. Record an unchanged generated file honestly if the schema does not project the changed detail. Do not hand-edit outputs or invent `IconName` schema support. |
| `packages/mcp/tests/stdio.test.mjs` | Extend the existing stdio assertion to request `get_component` for Icon and compare its actual result with the regenerated artifact. Run the existing `get_design_system_md` golden-byte test as well; MCP renders the reference from the artifact and does not maintain an independent glyph inventory. No server API change. |
| `scripts/package-exports.test.mjs` | Extend the existing built-package SSR fixture with both exact left-arrow paths, decorative and labelled cases, while keeping current plus/download/external-link and emitted static Icon CSS assertions. The existing Lucide-notice test remains applicable. |
| `scripts/package-consumption.test.mjs` | Extend the representative packed fixtures, not a presumed exhaustive inventory: import the public `IconName` and accept `arrow-left`, reject an unknown name, render both paths in SSR and on the client, and rerender from/to an existing glyph without replacing the SVG root. Preserve the existing representative fixtures and no-Tailwind-compiler style checks for React 18.3.1 and 19.3.0. |
| `THIRD_PARTY_NOTICES.md` | Review and retain the Lucide ISC and Feather MIT notices, which already list both arrow directions. Record the new path as a horizontal derivative of the existing Foundation `arrow-right`; do not claim an uninspected upstream verbatim source. Keep the earlier source attributions and license texts intact. |
| `packages/ui/CHANGELOG.md` | Add English `## Unreleased` / `### Added` for physical `arrow-left` with `(#537)`; note app-owned RTL direction and the need to audit exhaustive `IconName` switches/maps. Do not bump a version. If the system artifact has a substantive user-visible change, separately review whether `packages/system/CHANGELOG.md` needs an accurate `Unreleased` note; never claim a glyph list was added. |
| `docs/components/icon/v0.4/captures/arrow-left--default--1280x900--dark.png`, `docs/components/icon/v0.4/captures/directions--default--1280x900--dark.png`, `docs/components/icon/v0.4/capture.json`, `docs/components/icon/v0.4/implementation.md` | Proposed implementation evidence only, after separate capture/server and file authorization: real component crop, supplementary direction matrix, capture metadata and observed results/limits. Do not modify the approved amendment, historical captures or expected-design references. |

## 3. Exact glyph and provenance

The existing right shaft is `M5 12h14` and head is `m12 5 7 7-7 7`. Reflect about `x = 12` in the unchanged `0 0 24 24` viewBox (`x' = 24 − x`), with no SVG/CSS/runtime transform:

```ts
'arrow-left': [
  ['path', { d: 'M19 12h-14' }],
  ['path', { d: 'm12 5-7 7 7 7' }]
]
```

The head runs `(12,5)` → `(5,12)` → `(12,19)`; the shaft spans `(19,12)` → `(5,12)`. Keep currentColor stroke, existing token-backed stroke width, round caps/joins, fill and all three presets. Coordinates are static glyph data, not permission for new inline appearance or a general direction mechanism.

## 4. Test-first and preservation

1. **RED:** before changing the union or data, add tests through the public Icon interface. Render `arrow-left` and assert the exact two path `d` values, viewBox, marker, caps/joins, stroke/fill classes and absence of a transform; compare the existing right-arrow paths. In `dir='ltr'` and `dir='rtl'`, check each name retains its physical path. The test must fail because the glyph is missing, not because of setup.
2. Prove omitted and empty `label` remain hidden and non-focusable; a non-empty label follows the existing AccessibleIcon branch without adding an SVG title or role. A named containing button remains named once with a decorative child. Exercise actual tab order using neighboring controls, not a fabricated interactive glyph. Check that changing left → right → left in the same decorative branch retains the SVG node and replaces its paths; preserve a prior-name rerender.
3. Add compile-time public `IconName`/`IconProps.name` positive cases and an exact 47-existing-plus-one union/completeness check; retain a justified negative unknown-name case. Compile the public package fixture too: runtime Vitest transpilation alone is not a type check. Before implementation, run the focused Icon and metadata commands and `pnpm typecheck`; record the expected missing-glyph/inventory/type failures separately. Tests for preserved existing behavior are expected to pass, not to be presented as RED.
4. **GREEN:** add only the union member and static paths, update the gallery and the affected test inventories; rerun the same focused commands and typecheck. Run existing FieldMessage tests and the package fixtures in §6 to preserve existing selection, defaults, names, accessibility and shipped styles. Refactor only while focused checks stay green. Real browser, screen-reader and image evidence remain separate from jsdom and docgen.

## 5. Registry, artifact and distribution sequence

After reviewing the final Icon public symbol, compute `sha256sum packages/ui/src/atoms/icon/types.ts` and put that actual post-edit digest in all four listed registry usages; the baseline digest above must not be reused after an edit. Change only the `icon-glyph-name` usage count besides those revisions, then run `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`. Keep existing approval receipts and hashes unchanged.

Generate the catalog before the system artifact. The current generator records the docgen type name, not literal values; the current Icon `name` is a required `enum` and there is no `IconName` type record. `pnpm system:check` alone compares Markdown to the existing JSON and cannot establish source-to-artifact freshness: run `pnpm artifact --write` and `pnpm artifact --check` as well. Inspect both MCP responses against that regenerated artifact and its rendered Markdown; do not imply agents receive a 48-value enum list. The current JSON is 773,884 bytes against the 768 KiB budget; report overflow rather than weakening the budget.

Run `pnpm build` before **both** package gates. Run `pnpm test:package-consumption` locally, not just in CI: L29 records a prior release-candidate CI failure caused by an unrun stale packed fixture, followed by a successful 14/14 local run. That historical success is not evidence for this change. The packed runner installs isolated fixtures and needs explicit authorization and available offline dependencies; do not silently use network fallback. Capture its React 18/19 results and blockers separately. Audit downstream exhaustive switches/maps; do not change Carousel, Nexo or another consumer here. Nexo's rotation mitigation stays until a separately authorized release and adoption.

## 6. Planned commands

Run from the repository root, one at a time, after the relevant authorization. The same focused commands are used before and after implementation; report actual exit codes and counts. `pnpm build` writes ignored `dist/` outputs and regenerates the system JSON; `pnpm storybook-build` writes ignored `storybook-static/`; generators write the tracked outputs listed above.

**RED, then GREEN and preserve:**

```sh
pnpm exec vitest run packages/ui/src/atoms/icon/Icon.test.tsx --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm typecheck
pnpm exec vitest run packages/ui/src/atoms/field-message/FieldMessage.test.tsx --maxWorkers=2 --no-cache --configLoader runner
```

The first three are run in RED and repeated in GREEN; the existing FieldMessage preservation suite is run after GREEN. If a RED is not the intended missing behavior, fix the test setup rather than describing it as evidence.

**Generation and broader gates, after GREEN:**

```sh
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
sha256sum packages/ui/src/atoms/icon/types.ts
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --write
pnpm system:docs
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
pnpm lint
pnpm test
pnpm build
pnpm test:package-exports
pnpm test:package-consumption
pnpm artifact --check
pnpm system:check
pnpm test:mcp
pnpm storybook-build
```

Review the catalog and generator diffs, notice/license preservation and changelog. The second artifact/system freshness checks follow the build because the system build regenerates JSON. If it changes the rendered reference, regenerate and recheck with `pnpm system:docs` and `pnpm system:check`; investigate unexpected changes rather than hiding them. Do not report a check as passed merely because it was planned here.

## 7. Acceptance-to-evidence map

All entries are **Pending** until separately authorized and observed.

| Criterion | Check and evidence |
| --- | --- |
| **AC-01** | RED/GREEN Icon tests and real typecheck prove exact prior-47-plus-`arrow-left` union, 48 unique names, required `name`, unknown-name rejection and public package type exports; packed fixture independently compiles the new name. |
| **AC-02** | Public rendered SVG asserts both specified left `d` values, right comparison, `0 0 24 24`, caps/joins, marker and token classes without transforms; built CSS and real-browser computed stroke/size supplement DOM. VIS-01 is historical and VIS-02 is Pending, so expected-design conformity is not inferred. |
| **AC-03** | LTR and RTL DOM plus real-browser `Directions` story check both physical directions and absence of transforms. Verify the glyph itself adds no navigation or direction selection; host controls own any action. |
| **AC-04** | Rerender both ways with same-branch SVG identity; retain prior-name, preset, fill, native passthrough and supported `cn`/`twMerge` cases. Built static-CVA CSS and packed consumer without a Tailwind compiler prove distribution separately. |
| **AC-05** | Omitted/empty labels, informative AccessibleIcon, named button without duplicate label, SVG hidden/non-focusable and tab-order tests. Actual assistive-technology review, when separately authorized, is distinct from DOM evidence. |
| **AC-06** | Gallery inclusion and 48-name assertions; real docgen and installed Controls for Icon and shared FieldMessage preserve prior members, defaults and requiredness. Inspect the actual browser widgets/options separately, without manual `argTypes`. |
| **AC-07** | Generate the 48-name catalog; review the derived provenance and retained ISC/MIT notices; manually review the four source symbols and refresh their post-edit whole-file hashes, then regenerate/check/test registry docs. |
| **AC-08** | Regenerate and freshness-check artifact and Markdown; assert required `enum` and unchanged schema without claiming literal enumeration. Test `get_component` for Icon and `get_design_system_md` over MCP against the generated artifact/reference. |
| **AC-09** | Fresh build, package-export SSR and local packed React 18.3.1/19.3.0 type/SSR/client/rerender and shipped-style checks. Changelog flags exhaustive consumer maps; product adoption/release remain separate. |
| **AC-10** | Owner approved the spec without a new expected-design capture. Complete the separately authorized real implementation crop and supplementary matrix in §8 before the implementation PR merges; record provenance/limits, but keep VIS-02 and expected-design conformity **Not evaluated**. |

## 8. Real browser, Controls and implementation capture

Proposed exact conditions, to be agreed and separately authorized before starting a server or browser:

- Serve the actual worktree Storybook with `pnpm storybook` at `http://127.0.0.1:6006`; this command also builds tokens. Use Playwright MCP or headless Chrome against `http://127.0.0.1:6006/iframe.html?id=atoms-icon--directions&viewMode=story`, not a synthetic drawing or a copied unrelated tool artifact. Record the source revision plus working-tree state and exact browser/version/tool.
- Set viewport **1280 × 900 CSS px**, device scale **1**, zoom **100%**, default dark token theme, normal interaction state, `prefers-reduced-motion: no-preference` and `prefers-reduced-transparency: no-preference`. Verify the actual media-query results; if either preference cannot be set or verified, report it and seek agreement on changed conditions. Wait for stable content and `document.fonts.ready`; verify and record whether Barlow, Barlow Condensed and JetBrains Mono actually loaded. Storybook imports Google Fonts; if unavailable or network access is unauthorized, report the actual fallback and seek agreement before treating changed conditions as comparable. Do not install fonts or enable network access implicitly.
- The `Directions` story shows left/right in both `dir='ltr'` and `dir='rtl'` at sm/md/lg. Inspect physical direction, rendered paths, computed transform, stroke/currentColor, width/height and the three presets. Save an actual element screenshot of the `md` LTR `arrow-left` SVG as `captures/arrow-left--default--1280x900--dark.png`; it is the component-zone capture. Save the containing directions matrix as `captures/directions--default--1280x900--dark.png` as supplementary context, not a replacement for that component capture. Inspect the resulting real PNGs.
- In `capture.json` record the observed implementation source/story, scenario, date, tool/browser version, viewport/DPR/zoom, theme, direction, font loading, motion/transparency preferences, component versus matrix crop, descriptive English alt text and each PNG's SHA-256. Mark them **Observed implementation**, not VIS-02 expected design or approval. Record checks, differences and limits in `implementation.md`. Do not overwrite historical images or silently adopt the capture as design authority.
- Separately inspect the real Storybook Icon `name` and FieldMessage `icon` Controls: 48 choices including `arrow-left`, selection behavior, required/optional rows and unchanged defaults. Record actual widgets and browser conditions; metadata tests or an iframe HTML smoke are not browser evidence. Screen-reader review requires separate access and is reported separately.

VIS-01's source/version and conditions differ and it does not include this glyph; the implementation capture cannot fill VIS-02. Without a separately adopted new-glyph expected reference and comparable conditions, expected-design conformity remains **Not evaluated**, regardless of capture or functional results.

## 9. Risks and open questions

- **R1 — Exhaustive downstream code:** adding a union member can break existing switches and `Record<IconName, …>` maps despite unchanged runtime behavior. The internal descriptor record is known; downstream projects are not audited. Communicate the audit in the changelog.
- **R2 — Evidence freshness:** changing the shared type file invalidates four registry source hashes, even for unchanged props. Update them only after reviewing the final source; stale or fabricated revisions invalidate the checks.
- **R3 — Metadata versus artifact:** FieldMessage shares the enum; its docgen and installed Controls must not be missed. The system artifact deliberately omits glyph values, and Markdown freshness alone does not prove JSON freshness.
- **R4 — Source and licensing:** the new geometry is reflected from Foundation's existing arrow, not a verified verbatim Lucide import. Preserve both Lucide ISC and Feather MIT notices and do not alter old descriptor attribution.
- **R5 — Browser and consumer proof:** the capture, actual Controls, optional screen-reader review and packed React matrix are unobserved. Fonts, local hosting, browser and offline fixture availability need authorization and verification; an unavailable one remains a named pending gate. A real screenshot does not prove accessibility or expected-design conformity.
- **Open questions / gates:** Does the owner approve this plan and its future file/command surfaces? Can the owner authorize the proposed local Storybook/browser capture and the packed-consumer installation with an offline cache? Are the proposed capture conditions acceptable, including a decision if the actual fonts are unavailable? There is no request to reopen the approved physical glyph or RTL decision; expected-design adoption, release and product migration remain separate decisions.

**Stop here:** this proposal does not implement the glyph, run generators, start a server, install packages, publish assets or authorize a PR/release.
