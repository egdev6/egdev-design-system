# GaugeGroup v0.1 — bounded implementation plan proposal

- **Status:** Draft plan; Group's full v0.1 contract is already APPROVED, not reopened. [Recovery notes](contract-recovery.md) identify the full snapshot and final approval. This plan is not implemented or approved.
- **Approved contract identity:** `9154316e52cbf60c52617e3a50a3cba4839c8dd938687547253b2d309107f416`.
- **Plan identity:** `contentSHA256: sha256:88827e8d32d8fbe82f7fc6499073630fd2827c207f6c51d2e37d6c027f2628ca`; SHA-256 of UTF-8 bytes from `## 1. Prerequisites and limits` through EOF, LF including final LF, excluding this tracking header.
- **Required amendment identity:** `31d24a2a0808da1ee60c12dc9d63a4b3b5104269e6d1cef77e46f974a7f92864`; [Gauge-private-sharing/Group recipe proposal](gauge-refactor-amendment.md). **Plan approval reference:** Pending. No native review receipt exists.
- **Baseline:** `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`; reviewed source hashes in recovery notes. No future implementation hash or new browser result is claimed.

## 1. Prerequisites and limits

1. Recover approved #31 comment 6243614452 and final approval 6251409960. Keep original VIS-01/02 scopes/hashes intact; local bytes were verified. Do not demand repeat approval of the full product contract because of its historical Draft header.
2. Obtain separate owner approval of the exact private-sharing amendment: one Gauge-private helper/data module, minimal hook delegation, internal CVA sharing, Group-only transparent/static geometry/numeric-value mechanism, and geometry-only stylesheet/import. Gauge's single-ring exception does not cover these implementation gates automatically.
3. Obtain separate approval of this exact plan and explicit runtime edit surfaces. Parent coordinates shared barrel/CSS/test/registry/inventory integrations. No token/dependency change, package version, installed tooling, server or Git/GitHub operation is authorized here.
4. Source node_modules/build artifacts are not provisioned in this isolated clone. Parent schedules/provisions later under its own permission. Docs-only preparation runs source/link/hash checks, not runtime RED/GREEN, suite/build/packed installs or browser/AT claims.
5. Gauge public API, types.ts, JSX, CSS engine, stories and exports stay unchanged; GaugeDock remains separate. Collapsible v0.2 and ODD mirror remain untouched. Never broaden scope to fix unrelated dirty files/failing tests.

## 2. Exact intended implementation surfaces — not current authorization

| New Group file | Required role |
| --- | --- |
| `packages/ui/src/molecules/gauge-group/types.ts` | Public GaugeGroupProps/Ring/Items/Size aliases, exact conditional stateText and two/three tuple, native exclusions, English JSDoc/controls, private static CVA for all parts and slot/count geometry |
| `packages/ui/src/molecules/gauge-group/useGaugeGroup.ts` | Group-only structural/text/state/preset validation, per-slot shared normalization, stable useId relationships, protected root/row/meter/arc props and cn classes, all-unavailable center suppression; no state/timers/aggregate |
| `packages/ui/src/molecules/gauge-group/GaugeGroup.tsx` | JSX only: named passive group, one hidden diagram with available slot wrappers/arc children, shared center, visible ordered position-labelled reading rows, finite meters or plain fallback and per-finite-meter cues |
| `packages/ui/src/molecules/gauge-group/gauge-group.css` | Exactly the amendment's two geometry selectors for slot inset and shared-center alignment in components layer; no duplicate gradient/mask, color/Material paint or animation |
| `packages/ui/src/molecules/gauge-group/GaugeGroup.test.tsx` | Hook/DOM/type/validation/independence/passivity/merge/ID coverage against real shared helper |
| `packages/ui/src/molecules/gauge-group/GaugeGroup.stories.tsx` | Molecules/GaugeGroup real component autodocs, approved scenario matrix, English JSDoc; no play/manual argTypes/fake actions |
| `packages/ui/src/molecules/gauge-group/index.ts` | Named GaugeGroup and its four public types only |

Exactly six mandatory meaningful Group modules plus the justified CSS file; no extra private Group module. Additional **atom** module `packages/ui/src/atoms/gauge/gauge-model.ts` and modifications only to `packages/ui/src/atoms/gauge/useGauge.ts` / `Gauge.test.tsx` implement and test the separate amendment. Do not extract CVA/JSX/React state to gauge-model.ts. Preserve actual Gauge types.ts/Gauge.tsx/gauge.css/stories/index bytes; normalization delegation must not tighten Gauge runtime input handling.

Parent-owned integration candidates, each needing explicit authorization before edits:

- `packages/ui/src/index.ts`: named Group plus GaugeGroupProps/Ring/Items/Size, no private helpers/CVA or new subpath.
- `packages/ui/src/styles/index.css`: import Group geometry after existing Gauge geometry. `compiled.css` already scans `../molecules/**/types.ts`; `.storybook/preview.css` already scans molecule stories. No source-scan inventory change is necessary unless later verified evidence proves otherwise.
- `packages/ui/src/lib/storybook-css.test.ts`: retain existing Gauge checks and append Group diameter/stroke/inset/center/style-layer/static-emission cases.
- `packages/ui/src/lib/storybook-docgen.test.ts`, `packages/ui/src/lib/storybook-controls.test.ts`: actual Group public metadata extraction/enhancement alongside unchanged Gauge; no shared enhancer changes or misleading invented nested-field widgets.
- `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`: add Group runtime/types/SSR/client/CSS evidence while retaining Gauge fixtures. Use their existing embedded consumer conventions; no new fixture path or dependency is presumed.
- `skills/_shared/prop-naming.json`, generated `docs/prop-naming.md`: append actual reviewed Group symbol/hash usages for existing nine convention IDs only after source exists. Gauge types.ts stays unchanged; no unnecessary hash renewal/promotion/alias change.
- `scripts/catalog_data.py`, generated `docs/CATALOGO.md` and `docs/catalog.json`: parent updates only once actual implementation exists; no taxonomy redesign or automatic GaugeDock widening.

No manifest, lock, tokens/theme, legacy stylesheet, shared authority, ODD or Collapsible edit is proposed. Additional capture/evidence paths require parent authorization; this preparation creates no fake PNG/capture.json/approval receipt.

## 3. Bounded sequence after approvals

1. Recheck reviewed source identities and preserve unrelated edits. Run current focused Gauge tests as baseline before the private refactor. Add helper parity tests first: finite/decimal/non-finite, nullish text and cue truthiness; record intended runtime test lifecycle honestly.
2. Extract normalizeGaugeMeasurement and existing glyph-path table exactly as amendment, delegate only corresponding useGauge expressions. Keep size/native/IDs/descriptions/center in Gauge hook. Run all Gauge regressions before beginning Group; compare public API/type/DOM/CSS source invariants. A parity failure stops the refactor, not a reason to rewrite accepted tests.
3. Add smallest behavior-level Group test (two labelled independent meters/list); implement minimum types/hook/JSX. Add three-ring/order, independent rerender, unavailable slot preservation/all-unavailable suppression and strict validation tests incrementally. Keep normalizer pure and validation Group-only.
4. Add static Group CVA geometry and the approved two-selector stylesheet. Reuse unchanged Gauge arc/cue/icon CVA and glyph table; never place whole Gauge roots inside the diagram or fake hidden meters. Static slot index, not child position, controls geometry; no shared aggregate data-state/value.
5. Complete public type exclusions, protected native spreading, external group descriptions and per-row state cue IDs. Root className outer margin/alignment only, merged last with cn; no consumer appearance/part overrides or numeric size extension. Keep helpers/variants private.
6. Add scenarios and metadata; parent integrates exports/CSS/consumer checks/registry/catalog under named authorization. Only after focused tests are green schedule emitted CSS, packed consumers and browser review. Record unavailable tooling or unrelated failures rather than fabricating conformity.

## 4. Acceptance, regression and story matrix

All checks below are PLANNED. Existing source/test inspection is not execution.

| Approved IDs | Functional/type/source checks | Stories / visual checks |
| --- | --- | --- |
| AC-01/02 | 2/3 named independent finite meters; group has no value/aggregate; Outer/Middle/Inner list order; -1/0/42.5/100/101 boundaries; update one value without altering peer | Default, ThreeRings, ValueLimits, DecimalValue |
| AC-03 | NaN/±Infinity accepted as unavailable, no meter/value attrs/arc/track in that reserved slot; finite↔unavailable recovery; all unavailable retains footprint/list and suppresses center | MixedUnavailable, AllUnavailable; original VIS-02 + supplemental PREP-03/04 |
| AC-04/05 | All independent states at equal values; required non-normal stateText; finite cue text/icon described by only its meter; no focus/actions/live/disabled/progressbar/aggregate; no diagram accessibility duplicates | Conditions, IndependentReadings; manual AT later |
| AC-06/08 | D=56/80/96, stroke/gap=4, index-based insets 0/8/16; 2/3-ring center insets 12/20; no unavailable slot collapse; no dynamic Group diameter; actual host exposure | Sizes, CenterContent, TransparentHosts; PREP-01–05 |
| AC-07 | Descriptive TypeError: wrong collection/count, null/nonobject/missing/wrong-type fields, blank required/supplied texts, unknown state/size and missing non-normal cue; reject structural errors without throwing on non-finite number | Error tests/documentation, not invented fallback screens |
| AC-09 | All existing Gauge cases in amendment section 4 remain; helper direct parity for whitespace/empty text; Gauge API/types/JSX/CSS/stories/index unchanged; no public helper export | Unchanged eight Gauge stories on same hosts/conditions |
| AC-10 | Root markers/cn layout merge and internal isolation; static CSS scan/emission; exact exports and type negatives; React18/19 SSR/hydration/client recovery without consumer Tailwind | Default and packaged fixture |
| AC-11/12 | Narrow/200% text and zoom/RTL reading order/reflow; no loss of essential text into diagram; original scope/hash recovery; source/capture identities and actual conditions | Narrow, LongLabels; parent captures preserve original VIS-01/02 |

Group public type negatives: missing root/ring labels or value, count 1/4, non-normal state without text, numeric size, root value/state/children/ref/asChild/role/style/actions; no unapproved id/key field added to Ring. Runtime validation handles JavaScript callers; static tuples alone are not enough. Do not assert arbitrary accessibility compliance from screenshot/DOM only.

Metadata: own string fields text, value number, size/state select, tuple items and ReactNode center false with concrete story reasons. Defaults md/normal/Data unavailable are constants; derived valueText/absent center have no fabricated default. Nested Ring rows may remain part of items documentation rather than separate Controls; verify actual extracted API/enhancer/browser behavior. Stories provide required/examples only, no optional defaults to fill unset Controls.

## 5. Later command/consumer/browser proposal

Not authorized or executed in this preparation. Parent verifies write/output scope and schedules heavy gates serially.

1. `pnpm exec vitest run packages/ui/src/atoms/gauge/Gauge.test.tsx`, then `pnpm exec vitest run packages/ui/src/molecules/gauge-group/GaugeGroup.test.tsx`.
2. `pnpm exec vitest run packages/ui/src/lib/storybook-css.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts` after parent-owned scoped test integration.
3. Parent-authorized typecheck/lint/build and `pnpm test:package-exports`; emitted CSS must contain unchanged Gauge engine/+0.5px and 30% center plus Group's separate slot/center selectors, static diameter/stroke/inset utilities and state-fill/alpha mappings, without duplicate tokens/unresolved directives.
4. Parent-authorized `pnpm test:package-consumption` only after inspecting fixture installs/cache policy. Preserve both supported React majors, SSR plus real client/hydration ID relationships, per-slot recovery, declaration negatives and no-consumer-Tailwind CSS. Historical offline-cache failures in old Gauge reports are not a newly observed current blocker or a pass; report actual execution results when authorized.
5. Parent hosts canonical /tokens.css and static specimen for supplemental captures, then later actual runtime Storybook on an authorized server. Record browser/version, DPR, loaded fonts, viewport, zoom/direction, motion/transparency, crop and hashes. Inspect fractional arcs/top origin/endpoints/mask, all presets/holes/centers, state/track mappings, two token hosts, narrow/enlarged list and actual AT. No screen-reader, browser or runtime result is claimed by this plan.

## 6. Review sizing / stop point

Estimate, not measured runtime diff: private helper/hook/tests 100–180 changed lines; Group core types/hook/JSX/CSS/barrel 400–600; Group tests 300–450; stories 130–200; parent integration 100–180 plus generated inventories. Total roughly **1030–1610 authored runtime lines**. Complex validation/typed rows and preserving Gauge need real review; do not advertise a sub-400-line implementation or omit tests to fit.

Recommended review units: (A) separately approved helper extraction with full Gauge parity, (B) Group behavior/types/geometry with colocated tests, (C) stories/metadata, (D) parent export/CSS/consumer/registry/catalog and observed evidence. Parent controls scheduling/commit/PR review size; no independently shipped slice may expose an incomplete Group API. Current preparation stops after these five documents/static artifacts for review, with exact amendment and plan approvals still pending.
