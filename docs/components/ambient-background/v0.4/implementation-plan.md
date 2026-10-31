# AmbientBackground v0.4 — bounded implementation and package plan

- **Status:** Reconciled proposal; **not implementation-ready**. Owner selected utility A and conditional dist-only direction; compatibility/migration disposition and exact final-plan approval remain Pending. Approved contract/visual/naming/taxonomy recovery is in [contract-recovery.md](contract-recovery.md); engine invariants are in [engine-port-map.md](engine-port-map.md).
- **contentSHA256:** sha256:c25bdfe955fec20e1ff6b62827d852e973288fbe9c330246192c74cbdb77e3ed
- **Hash definition:** UTF-8 SHA-256 from the actual whole-line heading matched by multiline `^## 1\. Authority and owner decisions$` through EOF, with LF and final LF. Metadata and inline mentions are excluded.
- **Baseline:** remote-main worktree `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`, not the primary checkout. All paths below are **proposed future edit surfaces**, not current write permission.

## 1. Authority and owner decisions

Approved v0.4 fixes API, profile values, six token colors, decorative/ref behavior, no stylesheet, the named private `particleStreaks.ts`, and already adopted v0.3 source captures/naming. Later approved classification is atom, not organism. These records do not grant implementation-plan or execution approval. The later [parent owner-decision record](../../remaining-components/v0.1/effects-owner-decisions.md), canonical SHA-256 `636e5a37c41e3896920f9a728349978a09cb1e5e11d5a03498f88b540602cb61` from actual whole-line `## Decisions` through EOF, selects utility A and the dist-only direction for reconciliation only. It grants no compatibility certification, exact final-plan approval, install/runtime/browser/Git permission. The separate Isotipo three/@types grant remains unchanged and is not the authority for the utility choice.

| Gate | Concrete recommendation / required authority |
| --- | --- |
| G1 Utility/dependency direction — selected | A: exact CVA 0.7.1 + public @egdev/ui workspace:* cn, no UI CSS. Owner accepts UI/Radix/ReactDOM/build-order coupling without assuming tree-shaking savings. No manifest/lock/install/runtime work yet |
| P Compatibility/migration — OPEN | Dist-only direction is selected, not the final publication boundary/export map. Parent reviews W3 inventory coverage, migration/release handling and unknown external consumers before final disposition; no consumer-absence conclusion here |
| G2 Exact final plan — Pending | After P review, approve this fresh digest, `src/ambient-background/` placement, unchanged engine-port-map digest, six files/private engine and reconciled common package/CSS plan independently from contract/direction choices |
| G3 Lifecycle/merge operational details | Approve stopped-before-static precedence, zero-size/context handling, stale-RAF guards, native guarantee precedence and supported root layout/style boundaries below; these are plan recommendations, not previously adopted implementation choices |
| G4 Parent integration/execution | Provide exact runtime allowed paths and authorize parent-owned package/lock/install/build/test/packed/capture actions separately. Preserve reference engines, existing tests, receipts and Indicator/Avatar drafts |

No source-design or naming reapproval is requested. Future runtime captures verify conformity, not whether the already adopted source captures should be adopted again. The historical all-planned-issues prerequisite is retained by recovery; parent owns the current roadmap/readiness decision, not this writer.

## 2. Disproved assumption and selected utility A

Actual `packages/effects/package.json` has only token/React peers, `main: ./src/index.ts`, files src/reference and echo-only build/typecheck. It declares **no dependencies**. Root devDependencies do not declare CVA/clsx/tailwind-merge either. UI declares CVA 0.7.1, clsx 2.1.1, tailwind-merge 3.7.0 and publicly exports cn. Effects cannot honestly claim zero dependency work while importing CVA/cn through undeclared resolution. No package install or cache availability is inferred from UI's manifest.

| Selected route | Exact edges / wiring for final-plan reconciliation | Accepted costs and remaining authority |
| --- | --- | --- |
| A — owner-selected | Effects dependencies: `class-variance-authority: 0.7.1`, `@egdev/ui: workspace:*` (currently UI 0.1.0). Import cva from its declared package and cn only from UI's public root barrel. Parent edits `packages/effects/package.json` and reconciles `pnpm-lock.yaml` only after compatibility/final-plan review and fresh integration permission. No utility module/test added | Effects→UI→individual Radix/CVA/clsx/tailwind-merge and UI's token/React/ReactDOM peers; tokens → UI → effects build order. Owner accepts package/root-barrel coupling; browser elimination of unrelated UI code is unproven. Packed consumers require exact UI/token tarball overrides and deduplication. No source-relative UI import or UI CSS import |

**Historical B — not selected or executable:** CVA 0.7.1/clsx 2.1.1/tailwind-merge 3.7.0 with an effects-local helper/test was an earlier alternative; Isotipo separately described an inline helper. Neither variant is part of selected A's edit/test surfaces, and no helper/architecture amendment is authorized. Reconsidering B needs a new owner decision and fresh plans. UI's existing cn already owns its token typography merge extension; no local copy or new merge algorithm is proposed.

The utility strategy is selected, not OWNER PENDING; implementation and exact final plans remain Pending. A minimizes new files, not necessarily delivered graph size. Do not bundle undeclared UI source through aliases, borrow hoisted dependencies, add direct effects clsx/tailwind-merge edges or invent a third utility package.

## 3. Component and engine responsibilities

Recommended component folder: `packages/effects/src/ambient-background/` (atom responsibility; no mandated nested level folder in the approved contract).

| Mandatory / named file | Meaningful responsibility |
| --- | --- |
| types.ts | AmbientBackgroundProps, proposed AmbientBackgroundProfile alias, English JSDoc and root/canvas static CVA. profile select/default base; opacity number/default 1; inherited native props are not redeclared just for controls |
| useAmbientBackground.ts | Normalize opacity, per-part cn, root/canvas refs, root data-state, mounted token reading, engine ownership and media/visibility/resize effects. No JSX or duplicated engine math |
| AmbientBackground.tsx | JSX-only div/canvas consuming hook results, React18-compatible forwardRef to actual root div, explicit props type; no animation/state/CVA logic |
| AmbientBackground.test.tsx | Real hook/component plus internal engine behavior through deterministic environmental doubles, including null contexts, refs, SSR-safe boundaries and instance-local cleanup |
| AmbientBackground.stories.tsx | Atoms/AmbientBackground, autodocs and JSDoc. Default omits optional defaults; Read, Live, Opacity, NarrowContainer. Layout-only host wrappers, no invented controls, choreography or play |
| index.ts | Explicit named component/props/profile-type exports only |
| particleStreaks.ts — additional spec-named private module | Faithful typed source port: config, sprites, particle lifecycle, set/start/stop/renderOnce and internal resize/dispose. No JSX, CVA, React state or public package export |

**No stylesheet** for the component. No new tokens, custom CSS Material recipe, shared Surface clone, extra engine filename, runtime icons or images. The root's ambient background fallback and approved canvas art are not elevated/pressed/well/overlay UI surfaces. Preserve original canvas gradients/sprites as engine art; do not reinterpret them as hand-authored CSS shadows.

Static root recipe: stable `eg-ambient-background`, absolute/inset-0 fill, pointer-events-none, token-backed `bg-ambient-bg`, and exact approved `opacity-[var(--eg-ambient-opacity)]`. Canvas: block/full size, with forced-colors utility hiding it. Profile is engine data, not CSS state classes. Root uses only `data-state=running|stopped|static`; no .is-* mirrors. Component-created inline style contains only normalized numeric `--eg-ambient-opacity`; canvas bitmap width/height attributes and 2D setTransform are rendering geometry, not inline CSS appearance.

Ref contract is root HTMLDivElement, not canvas/engine. Use React18-compatible forwardRef and client effects; no browser global at module import/SSR. Initial SSR state is stopped. Root aria-hidden and no tab stop remain component-owned even if native/untyped props conflict. Native id/title/dir/lang/data/descriptions/events target the root, not the canvas. Discard untyped children/dangerous HTML and interaction-enabling overrides from passthrough so the subtree remains canvas-only/passive. Do not silently narrow the approved native public type beyond the contract's children omission; inspect docgen/type behavior and expose any unavoidable type-level correction for approval rather than smuggling it into implementation.

Root className merged last supports outer positioning/insets/dimensions, margins and alignment only, not opacity/color/background/pointer/animation overrides. Consumer-supplied native style retains the approved inheritance but is supported for layout only; merge the component opacity property last so it cannot be shadowed by a consumer custom property. Do not promise class/style sanitization or universal last-class-wins. Test recognized position/margin conflicts and marker/opacity retention. No canvas className/style override prop. Native attributes do not grant arbitrary appearance permission.

The hook constructs one engine per mounted canvas, patches profiles without recreating it, and uses actual CSS box width for density. Engine retains survivors on count changes and resets only for genuine size/DPR changes. Recommended stopped/static/running precedence and full cleanup contract are specified in the port map and require G3 approval. No time interpolation, scroll listeners or director state. Reduced motion draws one frame on relevant updates, not an idle RAF loop.

## 4. Minimum real effects delivery proposal

Current root `pnpm build` already recursively selects packages; no new root build command is needed. Effects needs a genuine build rather than its successful echo. The [common plan](../../remaining-components/v0.1/effects-integration-plan.md) now follows selected A and conditional dist-only. Parent must approve exact final plans and own all following integration surfaces after compatibility review; direction choices authorize no writes.

| Exact proposed future surface | Minimum role |
| --- | --- |
| packages/effects/package.json | Real `vite build && vite build --config vite.styles.config.ts`; real `tsc -p tsconfig.json --noEmit`; main/types to dist; proposed exports `.` (types/import) and `./styles.css`; files `["dist"]` direction with repository references retained; CSS-only sideEffects. Exact A edges after P/G2/G4. Keep existing token/React peers; Ambient's engine has no three dependency |
| packages/effects/tsconfig.json | Extend strict root base, include effects src, existing development test types. Use relative internal imports, no UI source alias leak |
| packages/effects/vite.config.ts | Existing root SWC/Vite/dts toolchain; ES library entry src/index.ts, sourcemaps; dts rootDir effects src, exclude stories/tests. External React subpaths, class-variance-authority, @egdev/ui and shared required three subpaths when Isotipo ships; no browser-global initialization or CSS import in JS |
| packages/effects/vite.styles.config.ts | Separate existing Tailwind/Vite CSS build, optimization/minification disabled for exact token references; emptyOutDir=false after JS/declarations; dist/styles.css |
| packages/effects/src/styles/compiled.css | **Package utility-build input, not a component stylesheet/recipe.** Reference canonical token theme; explicitly source ambient-background/types.ts and preserve separately approved Isotipo production CVA sources; emit utilities only, no preflight, tokens, legacy UI bundle, BEM declarations, @layer components recipe or dummy CSS |
| packages/effects/src/index.ts | Add AmbientBackground/public types, preserving separately integrated approved effects exports; correct obsolete director comment. Never export engine/hook/CVA |
| packages/effects/README.md | English delivery usage and boundary: tokens + effects/styles.css for native CSS; token theme + effects/styles.css for Tailwind; no UI CSS requirement for Ambient, no director/API invention |
| pnpm-lock.yaml | Parent-only selected dependency edge resolution, if authorized. No installation or update implied by this draft |
| .storybook/preview.css | Include effects package utility build input and exact effects story layout source, retaining UI imports and existing sources |
| .storybook/main.ts | Add native documentation whitelist for ambientBackground as needed. Existing packages/* story glob already discovers effects; no new addon, alias trick or renderer |
| packages/ui/src/lib/storybook-docgen.test.ts | Add an explicit second parser using effects tsconfig and actual effects source; do not assume existing UI-relative source helper/aliases cover effects |
| packages/ui/src/lib/storybook-controls.test.ts | Add actual effects metadata/extraction/enhancer/inference using the existing central enhancer; preserve all UI/generic fixtures. Then browser Controls verification separately |
| scripts/package-exports.test.mjs | Add effects manifest/artifact/import/declaration-closure checks, CSS emission and internal export negatives while preserving UI/token coverage |
| scripts/package-consumption.test.mjs | Extend packed fixtures with effects tarball, both React majors, strict types/SSR/CSR/ref/lifecycle/CSS checks, offline/cache policy and real deduplication. No temporary consumers, installs or execution now |
| skills/_shared/prop-naming.json; docs/prop-naming.md; scripts/prop-naming.test.mjs | Append approved profile/opacity usages with manually reviewed actual AmbientBackgroundProps whole-file hash after implementation; regenerate/check, preserve convention approvals and immutable receipt pins |
| scripts/catalog_data.py; docs/CATALOGO.md; docs/catalog.json | Parent records actual atom implementation/status after evidence, never edit generated catalogue directly |

Selected A adds no effects-local helper/test or inline cn substitute. B's files/coverage are excluded from executable future surfaces. No Vitest discovery change is necessary: `packages/*/src/**/*.test.{ts,tsx}` already covers effects. Its coverage list currently covers UI only; broad coverage-policy expansion is not a minimum prerequisite and is not proposed. Avoid `@/` in effects because current Vitest/Storybook aliases point to UI. Do not modify UI runtime/style inventory to deliver effects utilities.

Manifest/CSS contract: JS import remains usable in Node without importing CSS or touching DOM. Consumers explicitly load built token CSS and built effects CSS, not raw @theme source in a native browser. Reference scripts remain unchanged in the repository, not the selected publication payload or side-effect entries. Dist must contain the complete JS/declaration/CSS/required-chunk/asset closure, verified later. Proposed export maps block engine subpaths; private declarations must not become reachable from public type signatures. Declare no public engine handles/constants for tests.

**Compatibility OPEN:** current files src/reference plus source main permit file/deep-import consumption; dist-only and a restrictive map can remove/break those paths despite an empty React barrel. Earlier dist + reference packaging is historical and not selected. W3 independently inventories local consumers; this writer neither duplicates nor assumes its output. Parent must review inventory coverage, documented migration/release disposition and unknown external/published consumers before approving the final boundary. No global consumer-absence or compatibility approval is inferred.

Existing Isotipo permission remains exact required peer `three=0.160.0` and development `three=0.160.0` / `@types/three=0.160.0`, separate from A. Once Isotipo ships in the same effects package the required peer is package-wide; do not make it optional or add a range. Preserve eligible lazy external import, no module-evaluation/SSR initialization and unchanged Isotipo lifecycle/engine-data exceptions; Ambient itself must not import three.

Packed fixtures currently pack only tokens/UI, install strict-peer isolated React18.3.1/19.3.0 fixtures, and exercise entries/types/SSR/CSR/CSS. Extend them, not replace their assertions. For selected A, build tokens → UI → effects and override packed `workspace:*` UI/token resolution to the exact packed artifacts, not a registry or workspace source link. No B fixture or helper test is proposed. Validate the exact selected import/dependency graph and one React/react-dom instance; measure browser bundle contents/tree-shaking rather than asserting that importing cn is free.

## 5. Planned test-first and verification sequence

No runtime RED/GREEN applies to this documentation preparation. Once the missing gates clear, a runtime task should add the smallest meaningful behavior test, observe intended behavioral RED (not only missing-module resolution), implement minimally, then triangulate and refactor while focused checks pass.

| Contract / concern | Planned evidence |
| --- | --- |
| AC-01/02/07 | Exact three preset tuples and base default; effective counts 42/54, 12/15, 66/72 below 700; widths 699/700/701 × DPR 1/2/3; no cumulative scaling |
| AC-03 | Constant-size base→read→live patches preserve survivor draw positions/random-call history, no resize/init or sprite rebuild. Appended/removed tails follow source |
| AC-04/11 | Omitted 1, clamp negative/over-1, fractional opacity and NaN/±Infinity→0; data-state/RAF transitions; only numeric custom property generated; opacity prop wins conflicting native style custom property |
| AC-05/06 | Live matchMedia/visibility changes and intersections with zero opacity/zero size; exactly one reduced-motion frame per relevant update, no RAF; resume without elapsed hidden travel |
| AC-08 | Disposal cancels only owned RAF, disconnects RO/listeners, releases instance resources; StrictMode replay, stale queued callbacks and two concurrent instances |
| AC-09 | Main/sprite null contexts and missing required token values do not throw/start work; root background fallback remains |
| AC-10 | Root marker/hidden semantics, no tab stop/pointer interception/live region; forwarded object/callback ref points to actual div; compatible native attrs retained; child/dangerous HTML overrides cannot replace canvas |
| AC-12 | Explicit public value/type export list and negative engine/hook/CVA/deep imports; declaration closure and Node SSR import have no browser access |
| Metadata | AST JSDoc profile select/opacity number, actual defaults, native rows/ref, real docgen and registered enhancer/inference; zero owned diagnostics, no manual argTypes/play; real Controls widgets later |
| CSS/native delivery | Build before checks; verify emitted opacity variable, ambient fallback, absolute/inset/full canvas and forced-colors rule, no raw build directives/duplicated token declarations/component recipe. Native Vite consumer needs no Tailwind compiler; Tailwind consumer stays compatible |
| Real browser | Compare adopted VIS-01/02/03 density/palette/glow/angle at comparable conditions; component-zone captures, real motion/visibility/resizing and fallback; positions are random, no pixel equality claim |

Deterministic environmental doubles and source-function invariants are detailed in the port map. Keep real engine/hook under test, not a fake-success engine mock. Recording canvas commands is not visual/browser/AT proof.

Proposed first focused runtime command, **not run or authorized here**: `pnpm exec vitest run packages/effects/src/ambient-background/AmbientBackground.test.tsx --maxWorkers=2`. Then existing real metadata suites, effects build/typecheck, emitted-CSS/export/packed checks. Parent uses the common plan's unchanged caps and `/tmp/egdev-gates.lock` / `/tmp/egdev-packed.lock`: builds/packed/long or unknown-duration commands are serialized background jobs with completion notification, not polling. Only finite deterministic checks bounded to ≤30s may be synchronous with an explicit ≤30s timeout. Build, lint, typecheck, props checks and packed install/cleanup execution require the later runtime permission; a plan cannot authorize them itself.

## 6. Review slices and actual preparation evidence

Estimates, not observed runtime diffs:

1. **Engine fidelity:** private particleStreaks.ts + complete focused engine tests in AmbientBackground.test.tsx, about 600–900 changed lines once the compressed 182-line/12 kB reference is typed, formatted and tested. Review config/sprites, spawn/draw math and RAF ownership as separate views of the same named module; do not invent extra engine files or stage test prefixes to force a small count.
2. **React adapter:** types/hook/JSX/index/stories + complete expanded component test file, about 350–550 lines. Parent may separate review views but must preserve whole-file tests and source/test coherence.
3. **Effects build/delivery:** manifest/tsconfig/two Vite configs/package utility entry/export/docs, about 150–250 lines, plus parent-owned lock diff. Selected A adds no effects-local helper/test; integration remains gated by P/G2/G4.
4. **Integration/evidence:** additive package/metadata assertions and approved naming/catalogue observations, about 200–350 authored lines plus generated output. Preserve all previous UI/consumer tests and approval pins.

Parent controls actual commit/PR segmentation; no terminal Git action occurs here. A faithful port must not be compressed into a misleading “small” simplified engine to meet an estimate.

Actual preparation: authoritative supplied history, full reference and effects/UI/token/build/consumer sources inspected; existing source/PNG byte hashes verified; approved taxonomy/naming/captures recovered; structural/link/digest checks reported in handoff. CodeGraph was uninitialized; initialization was outside allowed edit surfaces, so scoped source inspection followed. Indicator/Avatar files and the ODD mirror remain read-only.

Reviewed whole-file source identities (not future implementation hashes):

| Existing path | SHA-256 |
| --- | --- |
| packages/effects/package.json | 61fb3d4575f4a6770b3045bce5368557b852c544d9786deb3537257bd0e22e20 |
| packages/effects/src/index.ts | d4f463629e5bbe7565524dafc96cd295195962dca17172051f7a9731d33f6fae |
| packages/ui/package.json | 2d4686f9dc27cc5dfa460ac5520f96e06a98ace10b3dec77a2f6b7bad9b826a2 |
| packages/ui/src/lib/cn.ts | 74220d183bbca5febc12bd56e70c8c07690d02ec8ff8f771a77072d62a90771f |
| packages/ui/vite.config.ts | 8ef92465c00f64534270c8dc6de72a33103f3c1af52d3529f38aabce099019e1 |
| packages/ui/vite.styles.config.ts | 26de58c3cc3513224ed7db224d93bc3675d0cad7da0bfdd05d408f0e91fdf4c5 |
| packages/ui/src/styles/compiled.css | 00bd7fe99d92267f90773a7cf6eafb3c2f034e8078489a1b3469002494aef130 |
| vitest.config.ts | 203202ca76e93d0530e94158a8e7958b950b5844aa2fc8e5e76be449874e03a5 |
| scripts/package-exports.test.mjs | 411cafde6726da93994c8da1d3c8f9f0907d270bb5658e5dd23609f168997cb7 |
| scripts/package-consumption.test.mjs | b45bb56e6cb8b393a62a5d56bbaec31cfc4086bd37ec72ac143937175c905d5e |
| .storybook/main.ts | fe86bd0964887192171da93e8f05413f4533eb7a1ea8c5397e8c6896e2cdb8da |
| .storybook/preview.css | 93d9763a1c254b97d4bb5a880210aa63f4f42befdb18c4084d3e9aef339abafe |

Not performed: runtime port, utility module, manifest/lock edit, install, build, test double/harness, runtime RED/GREEN, server, browser capture, AT, Controls widget inspection, native receipt or GitHub mutation. G1 strategy A and conditional dist-only direction are selected; P compatibility disposition and G2–G4 remain Pending. **Next: parent reviews W2/W3 returns and migration coverage, then requests exact final-plan/lifecycle and execution authority separately.** The decision index is deliberately untouched here; its AB-P/AB-R/FX-P bindings are temporarily stale until parent refreshes all returned plans.
