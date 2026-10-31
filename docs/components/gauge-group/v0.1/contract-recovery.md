# GaugeGroup v0.1 — approved contract recovery

- **Effective status:** full component contract **APPROVED**, v0.1. GaugeGroup is not implemented/exported. These preparation notes are not a replacement contract, approval receipt or runtime result.
- **Canonical contract:** [full published snapshot, comment 6243614452](https://github.com/egdev6/egdev-design-system/issues/31#issuecomment-6243614452).
- **Final full-contract approval:** [comment 6251409960](https://github.com/egdev6/egdev-design-system/issues/31#issuecomment-6251409960). It supersedes historical Draft/Pending identity/approval prose, not substantive promises or retained implementation prerequisites. It records a direct owner batch grant manually; it is not native/signed/independent per-payload review.
- **Published preparation assignment:** [T5 / #31](https://github.com/egdev6/egdev-design-system/issues/31#issuecomment-6522799354). Parent supplies current ownership/open/no-overlap readback; no new remote check was made by this writer.
- **Recovered identity:** canonical SHA-256 `9154316e52cbf60c52617e3a50a3cba4839c8dd938687547253b2d309107f416`; full contract-comment body SHA-256 `a1ac89d3ac99e4e01f716e9281e21fa9b1eaec099f694bbc79d68cab4cf34a7e`. Both recomputed from the parent-supplied issue snapshot and matched the final approval record. Canonical payload starts at the exact anchored heading `## 1. Purpose and scope`, ends at EOF and includes final LF; no historical body was rewritten.
- **Recovery-note identity:** `contentSHA256: sha256:d235dc78831aefd0f74e35635d7a977cc5bd5845dd14c8d040e88952259e11c7`; hash UTF-8 bytes from `## 1. Recoverable authorities` through EOF, LF including final LF; tracking metadata above is excluded. This identifies these notes only, not a new approved contract.
- **Preparation bundle:** [bounded plan](implementation-plan.md), [private-refactor/recipe amendment proposal](gauge-refactor-amendment.md), [static specimen](specimen.html), [capture request](capture-request.json).

## 1. Recoverable authorities

Recover the full comment and final approval above together. The approved seven-block contract remains the authority; the summary below is a navigation aid. Frozen publication links with commit placeholders are historical, not newly verified remote asset URLs. Actual local image bytes match the two approved visual identities:

| Reference | Local recoverable image | SHA-256 / adopted scope |
| --- | --- | --- |
| Original VIS-01 | [Gauge board](../../../design/foundation-boards/v2026-10-18/Gauge.png) | `edece4df541e7cfc9e9c36005d623a194b973139fa9074d59e2025ae1381f2f9`; concentric anatomy/top origin/shared-center concept only, not positional colors, fixed A, glow, toolbar or original dimensions |
| Original VIS-02 | [static endpoint specimen](../../../design/foundation-boards/v2026-10-18/specimens/gauge-group--specimen.png) | `be0ca0d4c3e6f05d2e56612095b7e92c3ca957e8d02f9f8d9d453eac0ed1002c`; positional visible-list architecture, zero endpoints, conditions/unavailable deltas and transparent host intent, not fractional runtime arcs |

Both PNGs were read and hashed, not recaptured. Historical capture conditions come from [board metadata](../../../design/foundation-boards/v2026-10-18/capture.json) and [specimen metadata](../../../design/foundation-boards/v2026-10-18/specimens/capture.json): Chromium 148/Linux, DPR 1, viewport 1280×900, fonts recorded; original specimen image 1265×1019. Specimen theme and reduced-transparency preference were not recorded. Final owner approval adopts only the full snapshot's specified scopes and exclusions. Visual conformity remains **Not evaluated**; no image-wide or runtime certification follows.

Effective Gauge baseline: immutable [v0.8 base](../../../specs/gauge.md), [contract approval](../../gauge/v0.8/approval.json), [original plan approval](../../gauge/v0.8/plan-approval.json), [v0.9 composition amendment](../../gauge/v0.9/composition-amendment.md), its [approval](../../gauge/v0.9/approval.json) and [separate plan approval](../../gauge/v0.9/plan-approval.json), then [v0.10 transparency amendment](../../gauge/v0.10/transparent-interior-amendment.md), [frozen plan](../../gauge/v0.10/implementation-plan.md) and [approval](../../gauge/v0.10/approval.json). The v0.10 [historical verification report](../../gauge/v0.10/verification/report.md) is prior evidence, not a fresh f88b36e test/browser result or a GaugeGroup permission.

The single-Gauge transparent-frame exception does not grant Group recipe, geometry-property sharing, stylesheet integration or private-refactor authority. The final Group approval expressly retains those gates and separate plan approval. Do not reopen the approved full contract as Draft or treat an old missing-implementation sentence as a new product decision.

## 2. Approved seven-block contract digest

### Purpose / anatomy

New molecule `@egdev/ui`, proposed `packages/ui/src/molecules/gauge-group/`: two/three independent bounded magnitudes, one decorative concentric diagram and mandatory visible outer-to-inner ordered reading list. One named passive group, one meter for each finite reading, plain labelled fallback for each unavailable reading. No sum/average/global severity, selection, task progress, tooltip, action, focus engine or live announcements. No public subcomponents; no embedding hidden whole Gauge roots. GaugeDock retains its separate Gauge-only item contract.

### Exact public API / defaults

Named exports: `GaugeGroup`, `GaugeGroupProps`, `GaugeGroupRing`, `GaugeGroupItems`, `GaugeGroupSize`; no default, helper/CVA export or new package subpath.

- `GaugeGroupSize = 'sm' | 'md' | 'lg'`; optional size defaults md, diameter 56/80/96px via space-14/20/24. No numeric Group size.
- Required non-empty root `label: string`; required `items` is a readonly tuple of exactly two OR three `GaugeGroupRing` entries. Tuple index is radial slot identity, not a domain id. No id/key field, sorting, silent slicing or arbitrary-count mode.
- `GaugeGroupRing = {label: string; value: number; valueText?: string; unavailableText?: string} & ({state?: 'normal'; stateText?: string} | {state: Exclude<GaugeState,'normal'>; stateText: string})`. Default state normal; non-normal text required even if value is unavailable. Meaningful strings are non-empty after trim. Values are already domain-normalized; finite clamp 0–100 retains decimals; NaN/±Infinity means unavailable, not invalid structure or indeterminate progress.
- Optional `valueText` defaults to normalized decimal `X / 100`; optional `unavailableText` defaults `Data unavailable`. Consumer text must remain coherent with normalized values.
- Optional `center: ReactNode`, absent by default; decorative equivalent only, no aggregate/focusable content. Suppressed when all unavailable; smallest three-ring sm hole is 16px. Essential text stays in rows.
- Root native type is `Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'dangerouslySetInnerHTML' | 'role' | 'tabIndex' | 'accessKey' | 'contentEditable' | 'onClick' | 'onChange' | 'defaultValue' | 'style' | 'aria-label' | 'aria-labelledby' | 'aria-hidden' | 'aria-live' | 'aria-disabled' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow' | 'aria-valuetext'>` intersected with the own props above. No refs, asChild or events; inherited other listeners do not make the passive root a control.
- Compatible root id/data/description attrs forward before protected computed semantics; deduplicate root aria-describedby. Only root className supports outer margin/alignment, merged last through cn; no internal appearance/part override or universal last-class-wins guarantee.

Naming lookup reuses current registry IDs: accessible-name, collection-items, preset-dimensions, decorative-center-content, primary-value, measurement-text-equivalent, consumer-selected-condition, condition-description, unavailable-measurement-message. See [source](../../../../skills/_shared/prop-naming.json) / [generated view](../../../prop-naming.md). No convention/alias migration or global promotion; actual Group source usage hashes can only be recorded after implementation/manual API review.

### Behavior / accessibility

Slot order is Outer/Inner for two, Outer/Middle/Inner for three; visible/accessibility order matches it. A missing reading keeps its slot but paints no arc OR track, renders no meter/value attributes, and leaves peers unchanged. All unavailable retains diagram footprint and labelled rows, removes all arcs/meters/center. Finite↔unavailable recovery updates only that slot with stable mounted-slot IDs; changing tuple cardinality intentionally changes position names. No internal sorting/domain reconciliation.

Group-only validation throws descriptive TypeError for non-array/wrong count, missing/nonobject entries, missing/wrong-type value/label, blank supplied text, unknown state/size, or non-normal missing stateText. Non-finite numbers remain valid unavailable data. These stricter validations must NOT be backported into Gauge.

Root role=group with required label; each finite row owns normalized meter name/bounds/value/valueText. Diagram and shared center hidden from accessibility APIs, no role=img wrapping meters. Position and visible label identify rings without color; condition text/icon is visible and described only by that finite meter. Unavailable state suppresses measurement condition cues as in Gauge. Unique useId relationships; external group descriptions stay on group. No tab stops, buttons, disabled semantics, live regions or spontaneous speech. Manual AT/narrow/enlarged-text checks remain planned.

### Appearance / accepted intent versus retained implementation gates

Preset diagram diameter D, shared stroke W=space-1, radial gap G=space-1. Slot i inset i×(W+G); diameter D−2i×(W+G). For three slots: sm 56/40/24, md 80/64/48, lg 96/80/64px; corresponding innermost holes 16/40/56px. Center inset is last-slot inset + W, not Gauge's 30% center recipe. All arcs top-origin/clockwise with exact 0/100 endpoints; existing conic/mask +0.5px smoothing stays unchanged.

All normal fills brand; warning/danger/muted use Gauge's existing state tokens, never positional colors or inferred thresholds. Track existing foreground at 10% alpha; no group-wide opacity, halo, hover or animation. Row/diagram gap space-3, row gap space-2, font-sans and label/body tokens. Unpainted root; proposed transparent native diagram frame reveals actual host with no opaque annular backing. Approve that Group-scoped recipe and sharing mechanism separately, not by extending Gauge's exception silently. Host Material remains host-owned; no Surface dependency is required.

Six meaningful Group files plus `gauge-group.css` for slot/center geometry only; one proposed private atom module `gauge-model.ts`. Exact contents and roles require the [amendment](gauge-refactor-amendment.md) and [plan](implementation-plan.md). No production file is written here.

### Acceptance / evidence

Preserve full approved AC-01–12: independent meters/list; values/bounds/decimals; mixed/all unavailable and recovery; state cue isolation; passivity/non-color identity; preset geometry/host exposure; fail-fast Group input validation; shared center rule; unchanged Gauge; exports/cn/CSS/React18/19; narrow reflow; recoverable scope/identity. The implementation plan maps these to focused tests/stories and parent-owned consumer/browser evidence. No functional test or computed/browser/AT result is claimed by this preparation.

## 3. Actual current source evidence

Baseline HEAD `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`. Gauge's actual source, not old availability prose, controls the refactor proposal. Read-only CodeGraph status reports uninitialized; creating an index exceeds this task's write scope, so exact-path inspection was used. `components/Gauge` is absent here; preserved legacy CSS/approved board provide historical reference evidence, not an importable engine.

| Reviewed source / responsibility | Whole-file SHA-256 |
| --- | --- |
| `packages/ui/src/atoms/gauge/types.ts` — GaugeProps / internal arc/cue/icon CVA | `36bf194b6bdc9da09139704ee50d244cc1b13717150dee60d5473d5e0bb5c05a` |
| `packages/ui/src/atoms/gauge/useGauge.ts` — normalization, iconPaths, size/IDs/native protection | `6a761cb87791d90cd13ec09952f9753d5e461abad638f0488c4892c54c5d4cba` |
| `packages/ui/src/atoms/gauge/Gauge.tsx` — meter / hidden frame / inline decorative cue SVG | `d33f553f6d6c6e1f1e08ee3fa7cfd73473ce4ca1af9f36a175e114383cd7a581` |
| `packages/ui/src/atoms/gauge/gauge.css` — existing conic/mask and 30% single center | `30e9f7763dffdc5956b4cb30b69422f3eaab6d0afc5853057376003d778fdf86` |
| `packages/ui/src/atoms/gauge/Gauge.test.tsx` — inherited behavioral/type/merge regressions | `a0b8e4c0c305e07799aff194362b31537dcd789796b73d5958dbb3942a44db35` |
| `packages/ui/src/atoms/gauge/Gauge.stories.tsx` — eight single-ring scenarios | `a425cbb280dbb95927e711d52ea5bd99d53a9c75470afb23f4726011e4003b28` |
| `packages/ui/src/atoms/gauge/index.ts` — unchanged public components/types only | `03196f4a51be6563572e807f6e8d1d76639fb8aab9fe14051957eadba4ae483d` |
| `packages/ui/src/styles/index.css` — imports legacy and existing Gauge geometry | `954bd82be62351970c8159e4040ef5e7426240fdf8f47e26b6e5384a2901466d` |
| `packages/ui/src/styles/compiled.css` — Gauge types source and molecule types wildcard | `00bd7fe99d92267f90773a7cf6eafb3c2f034e8078489a1b3469002494aef130` |
| `packages/ui/src/lib/storybook-css.test.ts` — preview compile and Gauge CSS invariants | `5f94d4e007b74592d16ee021a9031304b2253e341631ac9ca03a8734e58ddcff` |
| `scripts/package-exports.test.mjs` — Gauge CSS/exports/SSR consumer assertions | `411cafde6726da93994c8da1d3c8f9f0907d270bb5658e5dd23609f168997cb7` |
| `scripts/package-consumption.test.mjs` — assertGaugeCSS, types, SSR and client/recovery fixtures | `b45bb56e6cb8b393a62a5d56bbaec31cfc4086bd37ec72ac143937175c905d5e` |

`compiled.css` already scans `../molecules/**/types.ts`; no new source inventory line is needed for Group CVA. `index.css` needs a separately authorized Group geometry import after existing Gauge CSS. Existing Gauge geometry/CVA can be consumed internally without a public Gauge prop or helper export. No separate canvas/engine module exists in the atom: the CSS recipe is the engine. Gauge's native style inheritance exists today; do not tighten it or change spreading while extracting normalization.

## 4. Readiness and remaining permissions

Approved Group product contract/scoped historical visuals are recovered; no repeat full-contract approval is requested. Remaining owner decisions are the exact [private helper/refactor and Group recipe/stylesheet amendment](gauge-refactor-amendment.md), then the separately digest-bound [implementation plan](implementation-plan.md). New static captures are supplemental diagnostic proposals, not replacements for already adopted VIS-01/02; adopting additional target scope or changing a promise requires explicit owner review.

Parent supplies canonical /tokens.css, owns servers/captures, runtime source authorization and shared integrations. No new tokens/dependencies, Group public API changes, broad geometry/Material permissions, GaugeDock changes, registry migrations or Git/GitHub actions are included. Collapsible v0.2 and the ODD mirror remain untouched.
