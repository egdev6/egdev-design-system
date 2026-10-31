# Indicator v0.2 — separately reviewable implementation plan

- **Status:** Draft; preparation complete does not mean runtime implemented or eligible.
- **contentSHA256:** sha256:0e2a477066f7ce162fcbcdff3713822e1a5eae6f3e12ebe44471476d97f3793e
- **Approval reference:** Pending; contract, visuals, naming and this plan each retain their own gates.
- **Hash definition:** SHA-256 of UTF-8 text from the actual whole-line heading `## Authorization gates` through EOF, LF and final newline; tracking metadata above is excluded.
- **Source baseline:** `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`.
- **Scanner-only revision:** Adds future parent-owned Storybook story scanning; spec/specimen and Indicator/Avatar promises are unchanged. [Existing observed metadata](observed/capture-metadata.json) retains capture-time plan identity `6cef2b7bc26e8bbed812baeb5c9f3a410053150f5311bd67d93a332a91fbb241`; no recapture, visual adoption or runtime approval is implied.

## Authorization gates

1. Approve the exact [v0.2 contract](spec.md) digest, including safe integers, physical corners/defaults, native filtering and Indicator-only compact Material recipe.
2. Parent hosts [specimen](specimen.html) with actual compiled canonical `/tokens.css`, records its byte hash, captures/inspects the proposed component zones per [capture request](capture-request.json), and obtains owner adoption bound to real visual hashes/conditions. No synthetic capture or blanket inferred adoption.
3. Approve the exact [Avatar #51 amendment](../../avatar/v0.2/indicator-amendment.md) independently. Recommendation: geometry-only sharing, identical DOM/paint/semantics; if declined, leave Avatar untouched and re-scope this plan before runtime.
4. Approve `anchor-corner-position`, `indicator-count`, `indicator-count-cap` conventions separately for registry integration; no global semantics or alias migration implied by component approval.
5. Approve this bounded plan digest and provide fresh runtime allowed edit surfaces. Parent owns shared inventory/build/package/registry integration and all terminal Git/GitHub actions. Tokens/dependencies require no changes.

This preparation creates only five allowed docs/design files. It does not change runtime, inventories or ODD. No tests/build/packed checks were run to manufacture a preparation lifecycle. Runtime test-first evidence begins only after these gates.

## Responsibilities and intended runtime surfaces

The following are proposed future surfaces, **not currently authorized writes**.

| Owner / path | Responsibility |
| --- | --- |
| Runtime writer: packages/ui/src/atoms/indicator/types.ts | Public union/JSDoc and static root, position, geometry, glyph and paint CVA. Export source-internal geometry recipes only for Avatar; no public composition API |
| Runtime writer: packages/ui/src/atoms/indicator/useIndicator.ts | Typed derivation: safe count/max validation, ASCII text/suppression, explicit passthrough filter and component-owned data attrs; call per-part cn |
| Runtime writer: packages/ui/src/atoms/indicator/Indicator.tsx | JSX-only anchor/conditional hidden marker/existing decorative Icon; no clone/Slot/ref or state |
| Runtime writer: packages/ui/src/atoms/indicator/Indicator.test.tsx | Behavior-level renderHook/render/userEvent cases, normalization/semantics/native forwarding/merges/identity |
| Runtime writer: packages/ui/src/atoms/indicator/Indicator.stories.tsx | Atoms/Indicator, real Meta/StoryObj/autodocs; no manual argTypes or play; required args only in Default |
| Runtime writer: packages/ui/src/atoms/indicator/index.ts | Explicit named component/types only, no CVA/hook export |
| Runtime writer, only if amendment approved: packages/ui/src/atoms/avatar/types.ts | Retain source-exported badge CVA symbols/size signatures/default md and existing identity/ring recipe; compose shared Indicator geometry |
| Runtime writer, only if needed: packages/ui/src/atoms/avatar/useAvatar.ts | Preserve typed result/native semantics, per-part cn and size mapping; no new state or image behavior |
| Runtime writer: packages/ui/src/atoms/avatar/Avatar.test.tsx | Add all-size badge/unchanged DOM/ring/paused regressions; preserve existing cases |
| Parent: packages/ui/src/index.ts | Add Indicator named exports without exporting private geometry |
| Parent: packages/ui/src/styles/compiled.css | Add Indicator types.ts utility source to existing explicit inventory; no handwritten component CSS |
| Parent: .storybook/preview.css | Add `@source "../packages/ui/src/atoms/indicator/Indicator.stories.tsx";` for Storybook-only example layout utilities. Production CVA scanning remains in packages/ui/src/styles/compiled.css; do not ship incidental story layouts. Future parent-owned integration only, not a preview.css edit authorized here |
| Parent: packages/ui/src/lib/storybook-controls.test.ts; packages/ui/src/lib/storybook-docgen.test.ts | Add owned prop metadata/extraction/enhancement coverage; preserve prior expectations |
| Parent: scripts/package-exports.test.mjs; scripts/package-consumption.test.mjs | Add public names and positive/negative type, SSR/CSR/CSS consumer checks; retain previous imports/assertions |
| Parent: skills/_shared/prop-naming.json; docs/prop-naming.md; scripts/prop-naming.test.mjs | Only approved convention/usage observations; re-read changed Avatar source before refreshing its whole-file usage hashes; regenerate view and preserve receipt pins |
| Parent: scripts/catalog_data.py; docs/CATALOGO.md; docs/catalog.json | Update Indicator/Avatar status only after actual integration; generated references follow source |

No stylesheet, extra internal module, glyph addition, manifest/lock/token change, Badge edit, legacy CSS retirement or other consumer migration. Avatar JSX/index/stories should need no edits: its markup and stories remain the same. If source inspection finds a real need beyond these paths, stop for parent coordination, not speculative widening.

## Work sequence and runtime test-first checks

### A. Standalone behavior and recipe

- Recheck baseline/source hashes and approved digests; inspect source imports before touching Avatar. Add smallest intended behavior test, observe actual behavioral RED rather than missing-module-only failure, implement minimal approved behavior, then triangulate.
- Define dot/count/icon union with count/max/badgeIcon exclusions and native Omit contract. Own declarations carry English @control metadata: finite enums select, numeric inputs number, children false with reason. Constant defaults only.
- Isolate `indicatorMarkerGeometryVariants`, `indicatorPositionVariants` and `indicatorGlyphVariants` in types.ts. Geometry owns centered absolute/full-radius size and position only; standalone paint/outline, pointer transparency and selection are separate. This separation prevents accidental Avatar restyling. Root wrapper recipe remains independent.
- Hook computes count text/visibility and native passthrough once; JSX renders unchanged children plus optional hidden span. No hidden React marker helper, context, timer, forwarded child props, dynamic class interpolation or inline appearance.
- Preserve each child node across prop rerenders. Empty child is not a runtime exception; it remains a caller layout/meaning responsibility.

### B. Geometry-only Avatar reuse

- Keep Avatar's root/Radix image/fallback/conditional span and existing marker. Preserve source CVA symbols and default md; map Avatar sm/md/lg → Indicator sm, xl → md within its existing recipe/hook responsibilities.
- Import source-internal geometry/glyph/position from Indicator types, never Indicator public wrapper or standalone paint. Retain Avatar-only canvas/default ink, ring-2 and ring token fallback. Do not change current badge pointer behavior.
- Preserve gradient disc, whole-root paused grayscale/opacity-60, overflow, no-ref API and className/ring support. Do not opportunistically “fix” any unrelated native inherited behavior.
- Run preserved tests plus all-size badge checks. Demonstrate same computed bounds/ring/paint in real browser later; identical utility intent alone is not measured parity.

### C. Parent integration and evidence

- Add utility inventory/export/metadata/consumer and approved naming observations atomically with the integration. Keep production compiled.css scanning separate from the explicit Indicator story source in Storybook preview.css; inspect emitted Storybook example-layout utilities and verify real browser story-host layout without adding story classes to shipped package CSS. No manual metadata workaround or consumer Tailwind requirement.
- Inspect actual browser Controls separately from AST/docgen/pipeline passes. Capture observed runtime under approved conditions, compare with adopted references; retain source proposal provenance.
- Keep historical v0.1 files and approvals untouched. Record actual implementation validation separately; never rewrite preparation as a past implementation receipt.

## Planned checks (not run in preparation)

| Area | Proposed checks / commands for a separately authorized runtime task |
| --- | --- |
| Focused runtime first | `pnpm exec vitest run packages/ui/src/atoms/indicator/Indicator.test.tsx packages/ui/src/atoms/avatar/Avatar.test.tsx --maxWorkers=2` |
| Count table | 0/-0/1/99/100; custom max 1 and 9; absent/0/negative/fraction/NaN/±Infinity/string inputs; MAX_SAFE_INTEGER and next unsafe value for count and max; rerender hidden/visible/overflow without child remount |
| Types/native/events | Dot/count/icon valid branches, forbidden combinations/missing inputs, no ref/asChild/style/semantic overrides; untyped forbidden props discarded; id/title/dir/data/description/events forwarded to wrapper; caller data-variant cannot override derived value |
| Accessibility | Marker/SVG hidden; no wrapper live/role/tabindex; one child name; child click/Enter/Space/tab/disabled unchanged; count update preserves focus/DOM; real pointer hit-test on marker and browser/AT confirmation |
| Layout/Material | Both sizes × branches, four corners in LTR/RTL, all tones, visible outlines and token shadow composition; large max/text zoom, child focus clearance and neighboring host clipping documented, no arbitrary last-class-wins promise |
| Avatar | Preserve all 14 current tests; add sm/lg badge and all-size glyph/offset checks; name removal, photo load/error/recovery, paused badge inheritance, ring fallback/override; unchanged source symbols and JSX topology |
| Metadata | `pnpm exec vitest run packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2`; AST and real extraction/enhancer/inference; then real Controls widgets |
| Parent serialization | Build before emitted-CSS checks; parent selects locked commands under /tmp/egdev-gates.lock and /tmp/egdev-packed.lock with memory/time bounds. Planned pnpm build, typecheck, lint, props:check, test:props, test:package-exports, test:package-consumption; no invocation authorized here |
| Package/CSS | Actual static CVA emitted dimensions/tones/corners/outlines/shadows; no new stylesheet; public export names; strict React18/19 positive/negative types, SSR/CSR with unchanged Avatar and no Tailwind consumer compiler |
| Unrelated protection | Scoped diff and Badge regressions at integration; no legacy selector/token/manifest changes |

Planned stories: Default, Sizes, Corners, Tones, Counts, InvalidCounts, OnButton, LongCount; existing Avatar Default/Sizes/NetworkBadge/Paused/WithImage/BrokenImage/Decorative remain. Avoid a timer/action demo that invents a live policy. Runtime narratives and visible copy are English.

## Review units and size estimate

Preparation: five files, 574 authored lines (about 70 kB) including repeated static glyph markup and capture JSON; review contract, compatibility amendment, and visual proposal separately from this plan. Future estimates below are not measured runtime diffs.

Future runtime estimate: 300–420 lines for standalone types/hook/JSX/stories/index, 160–220 focused tests, 30–70 Avatar recipe/test changes, and 100–180 parent metadata/export/consumer assertions plus generated observations. Recommend separately reviewable units: standalone atom with its tests/docs; Avatar compatibility reuse with regressions; parent integration/evidence. Parent controls actual commit/PR splitting; no oversized unit or staging performed here.

## Preparation evidence and remaining decisions

Actual: correct worktree HEAD and existing exports/API/tests/token/glyph sources inspected; proposal approval recovered from supplied history; v0.1 preserved; static HTML/JSON and Markdown identity/link/source checks performed as reported in handoff. CodeGraph status reported uninitialized; initialization would write outside current surfaces, so scoped source inspection was used.

Not performed: runtime RED/GREEN, tests, build, server, screenshot, browser/AT, actual Controls, native review or remote publication. Spec/visual/naming/amendment/plan approvals remain Pending. Recommend approving the concrete choices above after parent captures the board; do not call preparation implementation.
