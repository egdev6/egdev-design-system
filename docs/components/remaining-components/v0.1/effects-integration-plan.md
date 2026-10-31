# Common effects integration — owner proposal

- **Status:** Reconciled proposal: utility A selected for plan reconciliation; dist-only direction selected conditionally. Consumer/migration disposition and separate exact final-plan approvals **Pending**; no execution grant.
- **Baseline:** indicator worktree, `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`; no runtime, manifest, lockfile or reference edits.
- **contentSHA256:** sha256:bae5b2351b711927b89f8dd5b60de637fa52e1a7b9a981ef0607c3fc522aa3ad
- **Hash definition:** SHA-256 of UTF-8 LF bytes from the unique actual whole-line heading matched by multiline `^## 1\. Decisions and authority$` through EOF, including final LF. Exclude this tracking metadata and its inline heading mention. This identifies a proposal, not consent or a receipt.

## 1. Decisions and authority

**Owner selected utility A and the dist-only direction, conditioned on consumer/migration review and exact final-plan approval.** The [parent decision record](effects-owner-decisions.md), canonical SHA-256 `636e5a37c41e3896920f9a728349978a09cb1e5e11d5a03498f88b540602cb61` from actual whole-line `## Decisions` through EOF, records these scoped choices, not runtime/install/Git permission or compatibility certification. This proposal coordinates one parent-owned effects integration, not parallel manifest overwrites. Existing full Ambient v0.4 (with atom correction) and Isotipo v0.3 contracts, scoped source visuals/naming, engine modules and exceptions remain approved; their exact final plans are separate gates.

| Gate | Selected direction / remaining authority |
| --- | --- |
| U — utility/dependency | **A selected for reconciliation:** CVA 0.7.1 + public UI cn through workspace dependency, no UI CSS. B is not selected; no effects-local utility module/test |
| P — publication/compatibility | **Dist-only direction selected; compatibility OPEN.** Review consumer inventory coverage, unknown external consumers and migration/release handling before approving the actual publication boundary/export map |
| C — component reconciliation | W1 reconciles common/Ambient here; W2 separately reconciles Isotipo. Parent must compare all returned final drafts/fresh bindings and approve exact plans after compatibility review; no W2 result is assumed |
| X — execution/delivery | Parent supplies a fresh exact runtime assignment and integration/validation authority. This document grants no install, runtime, registry, token, ODD, Git/GitHub or release action |

Already relayed permission remains unchanged: **required peer `three=0.160.0`, development `three=0.160.0` and `@types/three=0.160.0`**, plus associated parent-owned manifest/build/lock/install integration after exact runtime-plan approval. No optional peer, range, new installer permission or unrelated dependency upgrade. Utility selection does not derive from that permission. Parent alone owns any eventual proposed root `pnpm install --ignore-scripts`, after applicable approvals; this proposal neither executes nor expands permission for it.

## 2. Observed graph and selected utility A

Current [effects manifest](../../../../packages/effects/package.json): version 0.1.0, ESM, `main=./src/index.ts`, `files=[src,reference]`, no dependencies/exports/types/sideEffects fields, echo-only build/typecheck. [Entry](../../../../packages/effects/src/index.ts) exports nothing. Its **only declared peers** are `@egdev/tokens=workspace:*` (currently 0.3.0) and `react>=18.0.0`; canvas is a browser API, not an npm dependency. Three and utility edges are not implemented. Root development availability/hoisting is not an effects production declaration.

| Selected route | Exact effects runtime dependencies for final-plan reconciliation | Accepted graph and costs |
| --- | --- | --- |
| A | `class-variance-authority=0.7.1`; `@egdev/ui=workspace:*` (currently UI 0.1.0), solely for public root `cn` | effects → UI → its individual Radix packages, CVA 0.7.1, clsx 2.1.1, tailwind-merge 3.7.0; UI peers tokens/React/ReactDOM. Owner accepts root-barrel evaluation and install/build-order coupling. Named import alone proves no browser tree-shaking savings. No UI CSS import or utility file |

Preserve effects' existing token/React peers and exact three policy above. The required three peer is package-wide once Isotipo ships, even for an Ambient-only import; Ambient's engine itself must not import three. A adds no direct effects clsx/tailwind-merge dependencies; UI owns those existing edges. Keep CVA in each types.ts and per-part cn composition in each hook, importing cn only from public `@egdev/ui`. The actual [UI cn](../../../../packages/ui/src/lib/cn.ts) includes token typography merging. No third utility package, new UI subpath, sibling-source import, global THREE or undeclared dependency resolution.

**Historical alternative B — not selected or executable:** the earlier proposal used CVA 0.7.1/clsx 2.1.1/tailwind-merge 3.7.0 with one effects-local shared helper/test, while the earlier Isotipo alternative used an inline helper. Neither helper variant belongs to this selected-A plan's future edit/test surfaces. No effects-local cn.ts/cn.test.ts, inline replacement or architecture/module amendment is authorized. Reconsidering B would require a new scoped owner decision and freshly reconciled plans.

## 3. Conditional dist-only direction and open compatibility gate

**Owner selected the `files=["dist"]` direction for minimum runtime payload, conditional on compatibility/migration review and exact final-plan approval; retain every historical reference source unchanged in the repository.** Publish emitted ESM JS (including any lazy chunks), the complete declaration closure, built CSS and any actually required emitted assets under dist; package metadata/README/license inclusion follows pack rules. Existing proposed sourcemaps must not introduce undeclared raw-source runtime requirements. No raw src/reference wildcard, story/test artifact, CDN source or direct reference execution is needed by the proposed typed ports, generated canvas sprites/halo and inline SVG artwork. Actual artifact closure is unverified until build/pack checks; a required missing asset must stop integration for a bounded amendment, not be hidden.

**This changes a declared shipping surface, not merely an empty React barrel.** Current files src/reference and source main permit source/reference file consumption without an export map. Dist-only removes those paths; the proposed restrictive map also blocks former deep imports. No published-tarball or consumer inventory was verified by this writer. An empty React barrel is insufficient compatibility evidence. W3 separately inventories local consumers; its results are not assumed here or duplicated. Parent must distinguish repository coverage, published-package evidence and unknown external consumers, review migration/release handling, and obtain final compatibility disposition before execution. The direction choice alone approves neither compatibility nor an unreviewed export map.

Earlier Ambient dist + reference distribution and inventoried archive retention are **historical, non-selected alternatives**, not executable packaging surfaces here. This Ambient reconciliation adopts conditional dist-only; W2 owns its independent Isotipo reconciliation. Repository references remain read-only archival inputs, never production entry imports. Retaining archive bytes alone would not preserve old importability under a restrictive export map; any compatibility export/alias or return to archive publication requires another explicit bounded decision. No reference deletion or rewrite.

| Proposed manifest/build contract | Exact responsibility |
| --- | --- |
| Entry/types/exports | `main=./dist/index.js`, `types=./dist/index.d.ts`; exports `.` → types/import targets respectively, `./styles.css` → `./dist/styles.css`; no helper/engine/reference subpath or public three type leakage |
| Side effects | `sideEffects=["**/*.css"]`; JS import must not load CSS, initialize DOM/canvas/WebGL or execute reference scripts |
| Build/typecheck | Real `vite build && vite build --config vite.styles.config.ts`; `tsc -p tsconfig.json --noEmit`; existing root recursive build already selects effects, no root script/dependency change proposed |
| JS/declarations | Existing SWC/Vite/dts tooling; ES src/index.ts entry, effects src declaration root, exclude stories/tests. Externalize React subpaths, three subpaths, class-variance-authority and @egdev/ui; no eager value import/bundling of three |
| CSS | Separate Tailwind/Vite build with optimization/minification disabled, `emptyOutDir=false`, dist/styles.css. Infrastructure input references canonical token theme and explicitly scans both approved types.ts paths; utility layer only, no preflight/token duplication/UI legacy CSS/component recipe |
| Strict imports | Extend root strict TS base; relative effects internals. Existing root/Vitest/Storybook `@` targets UI and is not an effects source bridge |
| Build order | Tokens → UI → effects for selected A; retain existing UI/token verification. Inspect artifacts before packing |
| Consumer CSS | Native: tokens/tokens.css + effects/styles.css; Tailwind: token theme + effects/styles.css. No app Tailwind compiler or UI stylesheet required for native effects |

Preserve literal lazy external `import('three')` only in eligible client initialization, not package import/render/SSR/suspended mounts. Missing required-peer bundling remains unsupported, not an SVG-fallback promise. Preserve Isotipo's terminal failure/generation/disposal semantics and scoped engine-data/material/opacity exceptions; preserve Ambient's profile survivor identity, private faithful port and scoped numeric opacity exception. No component stylesheet, token value change, Surface clone, director/HomeTemplate choreography or widened appearance permission.

## 4. Reconcile drafts before any implementation

| Reconciliation target | Current scope / remaining review and binding |
| --- | --- |
| [Ambient implementation plan](../../ambient-background/v0.4/implementation-plan.md) | Reconciled here to selected A, no helper and conditional dist-only; exact plan/compatibility approval remains Pending. Keep seven-file component anatomy and lifecycle/engine gates |
| [Ambient engine port map](../../ambient-background/v0.4/engine-port-map.md), [recovery](../../ambient-background/v0.4/contract-recovery.md) | Preserve approved source identity/configuration and recovery history; no new engine or automatic hash rewrite. Port-map approval remains separate |
| [Isotipo dependency/build plan](../../../../../panel/docs/components/isotipo3d/v0.4/dependency-build-plan.md) | W2 separately reconciles selected A/public UI cn, no local helper and conditional dist-only; parent cross-checks returned graph/consumer/binding details, not assumed here |
| [Isotipo implementation plan](../../../../../panel/docs/components/isotipo3d/v0.4/implementation-plan.md), [recovery](../../../../../panel/docs/components/isotipo3d/v0.4/contract-recovery.md) | W2 separately reconciles A and conditional P; retain approved contract/recovery, lazy lifecycle and exceptions. Approve amended implementation plan separately |
| Both v0.4 capture-request.json files; [decision index](approval-decision-index.md) | Later refresh only affected plan/dependency canonical bindings and scoped Pending/approval records after real review; preserve historical/source/visual identities. No future implementation source hash or approved receipt now |

This document reconciles the scoped directions recorded by the parent, not a new helper/architecture amendment; frozen recovery payloads are not rewritten. Reconciliation does not supply final-plan or compatibility consent. If owner requests different utility versions, extra modules/assets/export paths or API behavior, stop for a bounded revised proposal rather than extending this scope.

## 5. Exact proposed future edit surfaces — not current permission

Parent owns shared writes below after X. Component writers receive only their separately approved seven-file ledgers. No generated artifact is hand-edited; future builds also write their effects dist outputs and parent-authorized prerequisite token/UI dist outputs.

| Future paths | Bounded role |
| --- | --- |
| `packages/effects/package.json` | Selected graph, exact peers/dev pins, real scripts, chosen files/exports/sideEffects |
| `packages/effects/tsconfig.json` | Strict effects project and development test types |
| `packages/effects/vite.config.ts` | JS/declarations/external lazy imports |
| `packages/effects/vite.styles.config.ts` | Separate CSS build preserving emitted JS/types |
| `packages/effects/src/styles/compiled.css` | Only approved production effect utility sources |
| `packages/effects/src/index.ts` | Explicit AmbientBackground/public types and Isotipo3D/props exports; no internals |
| `packages/effects/README.md` | English supported peers/CSS/container/SSR/compatibility and actual evidence limits |
| `pnpm-lock.yaml` | Parent-owned reviewed resolution; no unrelated upgrades |
| `.storybook/preview.css`; `.storybook/main.ts` | Effects utility/story-layout sources and bounded actual native-prop metadata; preserve UI/global enhancer |
| `packages/ui/src/lib/storybook-docgen.test.ts`; `packages/ui/src/lib/storybook-controls.test.ts` | Add real effects parser/project and extraction/enhancer/inference cases, preserving existing coverage |
| `scripts/package-exports.test.mjs`; `scripts/package-consumption.test.mjs` | Additive effects artifact and packed-consumer cases; retain UI/tokens checks |
| `docs/components/ambient-background/v0.4/implementation-plan.md`; `docs/components/ambient-background/v0.4/capture-request.json` | Current documentation-only reconciliation/bindings; no runtime edit grant |
| `docs/components/isotipo3d/v0.4/implementation-plan.md`; `docs/components/isotipo3d/v0.4/dependency-build-plan.md`; `docs/components/isotipo3d/v0.4/capture-request.json` | Same, in parent integration checkout; current panel drafts remain read-only |
| `docs/components/remaining-components/v0.1/effects-integration-plan.md`; `docs/components/remaining-components/v0.1/approval-decision-index.md` | Current common-plan reconciliation; parent alone refreshes the index after all returns. Its FX-P/AB-P/AB-R bindings are temporarily stale; W1 leaves it untouched |

Exact component surfaces retained from their plans (physical placement still needs approval):

| AmbientBackground | Isotipo3D |
| --- | --- |
| `packages/effects/src/ambient-background/types.ts` | `packages/effects/src/atoms/isotipo3d/types.ts` |
| `packages/effects/src/ambient-background/useAmbientBackground.ts` | `packages/effects/src/atoms/isotipo3d/useIsotipo3D.ts` |
| `packages/effects/src/ambient-background/AmbientBackground.tsx` | `packages/effects/src/atoms/isotipo3d/Isotipo3D.tsx` |
| `packages/effects/src/ambient-background/AmbientBackground.test.tsx` | `packages/effects/src/atoms/isotipo3d/Isotipo3D.test.tsx` |
| `packages/effects/src/ambient-background/AmbientBackground.stories.tsx` | `packages/effects/src/atoms/isotipo3d/Isotipo3D.stories.tsx` |
| `packages/effects/src/ambient-background/index.ts` | `packages/effects/src/atoms/isotipo3d/index.ts` |
| `packages/effects/src/ambient-background/particleStreaks.ts` | `packages/effects/src/atoms/isotipo3d/isotipoScene.ts` |

Parent-only later evidence bookkeeping remains separately scoped: `skills/_shared/prop-naming.json`, generated `docs/prop-naming.md`, `scripts/prop-naming.test.mjs`, `scripts/catalog_data.py`, generated `docs/CATALOGO.md` and `docs/catalog.json`. No invented source usage before manually reviewed runtime files exist. These are not prerequisites to author this proposal and no shared inventory/registry/ODD edit occurs now. No root manifest/config rewrite or runtime UI/style edit proposed.

## 6. Planned bounded verification — no observed runtime results

Focused functional checks come first after authorization: real component/hooks/engines with deterministic environment doubles; profile hot-patch identity, state/media/size/opacity precedence, SSR/ref/StrictMode/two-instance cleanup; Isotipo eligibility, first-frame swap, terminal import/context/partial-boot/disposer failures and stale-generation suppression. Mocks prove neither WebGL raster parity nor driver resource release.

Builds, packed checks and all long or unknown-duration commands must run as serialized background jobs, with completion notification rather than polling. Only finite deterministic checks bounded to ≤30s may run synchronously, with an explicit timeout of ≤30s. Preserve the per-command caps and parent locks below.

| Later parent step | Planned checks and execution bounds |
| --- | --- |
| Focused tests | `pnpm exec vitest run packages/effects/src/ambient-background/AmbientBackground.test.tsx packages/effects/src/atoms/isotipo3d/Isotipo3D.test.tsx --maxWorkers=2`. One serialized background job at a time, with completion notification rather than polling; proposed cap 300s/2GiB |
| Types/build | `pnpm --filter @egdev/effects run typecheck`; build tokens, UI, then effects using their `pnpm --filter <package> run build` commands. Proposed 600s/3GiB per command; serialize with parent gate lock, no broad suite/parallel writer builds |
| Metadata | Focused existing docgen/Controls suites with effects cases; AST/JSDoc/default/native/ref evidence and zero owned diagnostics. Real browser widgets are separate later evidence |
| Export artifacts | `pnpm test:package-exports` after actual builds; proposed 300s/2GiB. Exact runtime/type names, private/deep-import negatives, declaration and JS/asset closure, emitted static opacity/fill/forced-color utilities; no raw build directives, duplicate tokens or implicit CSS/three initialization |
| Packed consumers | `pnpm test:package-consumption`; proposed 900s/3GiB, one serialized background job under parent gate + packed locks, with completion notification rather than polling. Add effects tarball to existing tokens/UI tests and strict React18.3.1/19.3.0 fixtures; required exact three installed, strict declarations without skipLibCheck/source aliases, ref/SSR/hydration/CSR and native/no-Tailwind CSS plus Tailwind compatibility |

Parent must approve/enforce exact wrappers/caps under `/tmp/egdev-gates.lock` and `/tmp/egdev-packed.lock` before execution. Current packed script creates temporary fixtures, installs with strict peers/ignore-scripts (optional `EGDEV_CONSUMER_OFFLINE=1`) and cleans its own directory: describing it grants no new install/network/temporary-write/cleanup authority. For selected A, override both token and UI workspace edges to exact packed artifacts and check one physical React/ReactDOM, retaining existing UI coverage. No B/helper fixture is proposed. Verify packed workspace-version transformation, exact selected graph and P's file inventory; compare tarball bytes/bundle contents instead of assuming dependency count equals payload.

Inspect emitted import graph and supported bundled consumer: no three fetch on root import, unrelated Ambient use, SSR or suspended Isotipo; first eligible boot performs the lazy request, supported chunk rejection yields terminal SVG fallback. No missing-peer build fallback claim. Real browser motion/visibility/resize/Controls, resource observations and scoped source comparisons remain parent-owned later checks, not new capture work here.

## 7. Preparation evidence and next response

Read both complete component implementation/engine/dependency/recovery bundles and current manifests/build/CSS/TS conventions; inspect existing verification infrastructure read-only. Scoped document inspection is used because CodeGraph is uninitialized and creating its index exceeds this task's three-file edit surface. Self-check only the common plan, Ambient plan and Ambient capture request for links, anchored bindings, scope/facts and whitespace; do not validate or assume W2/W3 outputs. No test/build/install/server/browser/registry/token/ODD/Git mutation, future source hash, independent verdict or native approval receipt is claimed.

**U=A is selected; P=dist-only direction is selected conditionally.** Parent awaits W2/W3 returns, reviews inventory coverage and migration/unknown-consumer disposition, refreshes the temporarily stale decision index, and requests exact final-plan approvals. Compatibility disposition, C and X remain **Pending**; no manifest/lock/install/runtime/Git action is authorized. Do not ask to reselect A or turn a direction choice into final execution authority.
