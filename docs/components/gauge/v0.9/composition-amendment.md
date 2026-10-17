# Gauge v0.9 — native-well composition amendment

**Composition approved; full implementation plan separately approved.** Replace Gauge's Surface dependency with its own internal `div`, preserving the accepted pilot's Material well. This is a bounded delta over the approved v0.8 contract, not a replacement full specification. Local execution authority comes only from the separate [plan approval receipt](plan-approval.json), not from the original composition decision. Frozen payload references to a pending plan below record the earlier decision state and are superseded only by that separate receipt; no implementation or retirement completion is claimed.

- **Version / scope:** 0.9; composition and local persistence only. The [manual approval record](approval.json) preserves the exact presented proposal and user response. The English technical elaboration below and its digest were recorded after that decision, not presented byte-for-byte before it.
- **Recoverable base:** [Gauge v0.8](../../../specs/gauge.md), with its [contract approval](../v0.8/approval.json). Base payload SHA-256: `f0999610927cc8556259c3896365697f4447ebae69eff810f3a2b66b57a3210d`. The base tracking header and frozen payload remain untouched.
- **Delta snapshot identity:** `amendmentPayloadSHA256: 9386ba4e3a3e195064c4bda95916c1346c58ce03c5490cf3cf0ec448a7d1186d`. Hash UTF-8 bytes from the exact heading line matching `/^## 1\. Purpose and scope$/m` through EOF, LF including final LF; this tracking header is excluded. The digest identifies only this amendment, not a serialized whole-v0.9 contract or cryptographic proof of consent.
- **Effective contract:** recover the base payload, its approval/tracking interpretation, and this delta together. Only the explicitly identified composition/availability/parity changes below supersede v0.8; every other promise and limitation is inherited. Historical proposal wording in the frozen base is interpreted through its existing whole-contract approval, not reopened as a new API decision.
- **Separate plan:** the full [implementation-plan.md](implementation-plan.md) is now separately approved for bounded local adaptation, exact 20-file retirement, named active-reference/catalog/registry maintenance and specified checks/evidence; see the [manual plan approval receipt](plan-approval.json). The entire plan remains frozen, including its historical Pending wording. The old [v0.8 plan approval](../v0.8/plan-approval.json) explains the existing normalized numeric geometry property; it grants no v0.9 retirement authority.
- **Publication / trust:** local manual observed conversation record, not a provider/native receipt, signed artifact, external approval or native RDD consumption. Canonical issue remains [#30](https://github.com/egdev6/egdev-design-system/issues/30); no remote check/publication occurred. Latest published comment and GitHub-visible asset handoff remain Pending.

## 1. Purpose and scope

**Delta:** Gauge remains the single passive measurement atom and becomes the only public React component in `@egdev/ui` after the separately approved implementation. `cn` remains a utility, not a component. Surface is removed, not retained privately or replaced by a new React helper.

The approved proposal also identifies subsequent retirement of Surface, IconButton and Tabs: exactly 20 source files, public exports, stories and active references, while preserving history and catalog proposals marked not implemented. That is an intentional breaking removal of pre-existing APIs outside the Gauge pilot, not a promise of compatibility for their consumers. Execution awaits the new plan decision.

**Inherited unchanged:** v0.8 section 1's single 0–100 magnitude, atom/package responsibility, optional decorative center, independent consumer-selected conditions, non-goals and multi-ring exclusion. This amendment creates no extra component, interaction or catalog-wide migration.

## 2. Anatomy and composition

**Delta:** replace only `<Surface tone="well" padding="none" radius="full">` inside Gauge with a Gauge-owned native `div`, retaining decorative `aria-hidden="true"` treatment and existing arc/center placement. Use a Gauge-owned internal well marker (for example `eg-gauge-well`), never `eg-surface`, Surface variant classes, a Surface import, or a new private React component. This internal marker introduces no public part-selector or override API.

**Inherited unchanged:** v0.8 section 2's semantic root and stable public `eg-gauge`, one arc, optional center, visible cue and unavailable content. Keep per-part `cn()`, meaningful hook/JSX separation and `useId()` relationships. No Radix primitive is needed for a passive meter. Future surrounding Material boxes remain a design concern, not permission to import a retired Surface component.

## 3. Public API

**No Gauge API delta.** Inherit the entire approved v0.8 section 3, as accepted by its contract receipt: `GaugeProps`, `GaugeState`, `GaugeSize`, required label/value, conditional non-normal stateText, all defaults, native exclusions/protections, description merging and named exports. Root `className` remains outer margin/alignment only; no internal appearance override, ref, `asChild`, children or Gauge events are added.

Retain only Gauge's named component/types and `cn` at the package root after retirement; remove the other three components' type/variant exports as well. Do not expose Gauge CVA helpers as compensation.

The eight Gauge mappings remain those in the base's prop-convention block and [registry](../../../../skills/_shared/prop-naming.json). No name, type, semantic ID or exception changes. All 13 global conventions remain `proposed`, `approval: null`; source-evidence maintenance during future implementation is not convention approval.

## 4. Behavior

**No delta:** inherit v0.8 section 4 completely. Preserve finite clamping to 0–100, decimals, top-origin clockwise endpoints, immediate passive rerenders, non-finite unavailable behavior and recovery. Keep consumer-selected normal/warning/critical/muted conditions independent of value.

Presets remain 40/56/80px with 3/4/6px strokes, default md. Every finite positive numeric diameter, including fractions, remains accepted without an artificial cap; invalid numeric sizes independently fall back to md. Custom stroke remains diameter/14 and center inset 30%. Keep the existing private normalized-value property and static numeric-size utilities within their previously scoped geometry permissions; no new inline appearance mechanism.

## 5. Accessibility

**No delta:** inherit v0.8 section 5 and the accepted native API protections. A finite root is a named passive meter with coherent normalized values/value text; unavailable content has readable label/message without fabricated meter semantics. Preserve merged, deduplicated external/cue descriptions and unique IDs, visible non-normal text plus decorative icon, hidden decorative well/arc/center, and non-interactive center responsibility.

No focus entry, keyboard interaction, action events, live announcements, disabled semantics for muted, or screen-reader certification is added. Actual screen-reader evaluation remains Not evaluated; pilot acceptance is not accessibility-matrix completion.

## 6. Appearance

**Delta:** preserve the accepted v0.8 pilot render as the composition parity baseline, now explicitly adopted by the presented proposal. Move the existing well semantics into **static token-backed Tailwind/CVA utilities in `types.ts`**, composed through the hook. This is a Gauge-only native-well exception to Surface composition, not a new global appearance policy.

| Well property | Required parity target |
| --- | --- |
| Default scenario | Existing Default: value 42, normal, md; well and arc 56×56 CSS px |
| Box model | border-box; padding 0; full radius via `--radius-full` (existing 9999px token) |
| Border | **0px**, solid; hairline token color may remain computed but is not a visible border; do not copy Surface's base 1px width |
| Material | `--color-surface-0` background, background image none, existing two-inset `--shadow-well`, `--color-fg-default` foreground |
| Ring | Existing conic arc and radial mask, including **+0.5px inner-edge smoothing**, unchanged dimensions/strokes and center placement |

These computed observations are parent-supplied current MCP evidence, not measurements performed by this documentation writer. The accepted finish is the rendered zero-border pilot, not every declaration of the removed Surface stylesheet. Exact static utility syntax and emitted cascade still require implementation verification. Existing zero resets do not permit arbitrary raw colors, shadows, spacing, fonts, new values, tokens or dependencies. If parity needs a new token or stylesheet role, STOP for separate approval.

**Seven-file/CSS boundary unchanged:** retain all seven meaningful Gauge files listed in v0.8. `gauge.css` remains geometry-only: conic/radial-mask construction and supporting alignment/clipping in `@layer components`, not a new BEM Material appearance engine. CVA owns well appearance/variants, and utilities retain their natural layer. Preserve passive legacy isolation, state data variants, approved track/fills, typography and motion behavior.

### Visual recovery and pending comparison

The [v0.8 report](../v0.8/verification/report.md), [capture manifest](../v0.8/verification/capture-manifest.json), existing [Default crop](../v0.8/verification/default--normal--1280--dark.png), [smoothing-after crop](../v0.8/verification/smoothing--after--sm--100--dark.png) and [runtime integration evidence](../v0.8/verification/jsdoc-runtime-integration.md) remain historical observed artifacts. Their presence does not make each image a separately hash-presented v0.9 approval. The newly approved reference is the accepted pilot finish identified in the conversation, with fresh before/after evidence still required.

Do not relabel v0.3 VIS-01/VIS-02, rewrite their approval scopes, or replace source captures. Their original hashes/limits remain recoverable from the base and [v0.3 metadata](../v0.3/capture.json). No new external assets are authorized.

Future Playwright MCP checks must record matching props, viewport, DPR, browser, theme, motion/transparency, loaded fonts and component-zone crop conditions. Compare actual computed geometry/Material and images before/after; explain condition mismatches, do not invent pixel tolerances. New v0.9 captures/metadata paths are **Pending, not existing artifacts**. v0.9 visual conformity remains **Not evaluated** until comparable checks are actually performed.

## 7. Acceptance criteria

Inherit all G-01–G-13 promises, eight stories and recorded limitations; historical Pending wording and later scoped results are not rewritten. The following delta checks are planned, not run:

| ID | Observable delta promise | Planned evidence |
| --- | --- | --- |
| D-01 | Gauge owns a native decorative well; no Surface dependency/classes/private React replacement | Behavior-level DOM regression plus source/import review |
| D-02 | Border remains 0px; well finish, geometry and +0.5px smoothing match accepted pilot | Static CVA emission checks for preview/distribution; real computed styles and comparable MCP crops |
| D-03 | Gauge API, accessibility, numeric behavior, public root and seven roles remain unchanged | Public-prop AST comparison, focused behavior/type tests, source-role review, eight-story/Controls checks |
| D-04 | Only Gauge plus `cn` remain publicly implemented after the specified retirement | Exact manifest review; runtime/declaration export absence checks; active reference/story/catalog/registry maintenance, without global legacy-CSS absence claims |
| D-05 | Base, historical decisions and scoped approval remain recoverable; implementation is separately gated | Base/delta hashes, manual receipt provenance and explicit pending plan status |

Packed React 18/19 consumption remains **Blocked** by the previously recorded offline cache failures; do not retry until cache is supplied, and never fall back to network. Existing-dependency consumer observations do not substitute for that matrix. No test/build/browser result is claimed by this documentation unit.

**Next decision:** present the pending implementation plan for separate approval. Composition acceptance and these local records authorize no code, deletion, registry/catalog update, server operation, dependency/token change, commit, push, publication or release.
