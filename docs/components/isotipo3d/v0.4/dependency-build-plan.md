# Isotipo3D — dependency and effects build request

- **Status:** v0.4 preparation Draft; no manifest/config/lock/install changes executed.
- **Authority:** full approved v0.3 canonical `990682be7ad0bddfcbbf88f44b53d87769edcbc1cfdd10541af6ebc75028a09a`; parent now relays exact required three0.160.0 + dev/test provisioning + @types/three0.160.0 development typing permission. The [parent owner-decision record](../../../../../indicator/docs/components/remaining-components/v0.1/effects-owner-decisions.md), canonical SHA-256 `636e5a37c41e3896920f9a728349978a09cb1e5e11d5a03498f88b540602cb61`, now selects exact utility A and dist-only direction subject to compatibility review. This reconciles the [read-only common effects proposal](../../../../../indicator/docs/components/remaining-components/v0.1/effects-integration-plan.md); earlier choice-pending wording is historical. Parent alone applies any later install/build integration **after separate exact reconciled plan approval, compatibility disposition and fresh assignment**. Questionnaire choices grant no runtime/install/Git action.
- **Hash rule:** UTF-8 LF bytes from the actual `## 1. Observed dependency boundary` heading through EOF, final LF included; metadata excluded. Digest recorded in [capture-request.json](capture-request.json).

## 1. Observed dependency boundary

The observed baseline effects manifest points main at `src/index.ts` containing export {}, ships src/reference, has **no export map**, placeholder echo build/typecheck, and only tokens/React peers. It declares no CVA/cn/clsx/tailwind-merge/UI or three dependency, CSS export or build configuration; selected future edges are not already implemented. Source main/files and absence of a restrictive map permit source/reference/deep-path consumption despite the empty React barrel. This is a compatibility surface, not evidence of zero consumers. Installed workspace transitive availability is not a declared production dependency. No borrowing the root test resolver's `@` alias, private UI source path, undeclared hoist or ambient global THREE.

Current [UI package manifest](../../../../packages/ui/package.json) pins class-variance-authority0.7.1, clsx2.1.1 and tailwind-merge3.7.0. Public UI root exports cn; [its actual implementation](../../../../packages/ui/src/lib/cn.ts) composes clsx/extended twMerge with token typography groups. Root already provides Vite8.3.4, SWC plugin4.3.3, dts4.5.4, Tailwind/plugin4.3.3, TypeScript6.0.3, React19.3.0/dev typing19.3.0 and current test tooling. Owner selected the exact existing-version A edges below; these observations do not authorize other versions, edges or implementation.

## 2. Required exact three request — permission already relayed, execution gated

Parent's future effects manifest edits:

| Field | Exact intended value |
| --- | --- |
| peerDependencies.three | `0.160.0` — required, no optional peer metadata |
| devDependencies.three | `0.160.0` — build/test/Storybook resolution of literal bare import |
| devDependencies.@types/three | `0.160.0` — development typing only |
| Existing tokens/React peers | Preserve existing scope/ranges; no ReactDOM runtime peer needed by the component |

The exact direct pins—not ^, ~, latest, CDN or optional—are the authorized request. Parent reviews any lockfile transitive changes caused by those pins; the permission does not approve unrelated dependency upgrades. Use existing root React/ReactDOM/type/test/build tools for workspace development rather than silently add new effects-local tooling edges.

After approval and reviewed manifest edits, the proposed **parent-only** install command is `pnpm install --ignore-scripts` at repository root. It resolves the declared workspace pins/updates the lock without running unrelated lifecycle hooks. It is a request, not a command run by this writer; parent must schedule it under its integration authority and inspect the exact resulting lockfile. No repeated installs, lockfile regeneration hacks or new package manager/version.

Consumer/test installations must provision the effects tarball, canonical tokens and **three0.160.0**; React18.3.1 and19.3.0 are separate current harness matrices. Missing-peer bundling is outside support, not a graceful runtime-fallback case. Runtime chunk rejection is covered after a supported build. @types/three is development tooling, not a new public engine type API or runtime load.

## 3. Selected utility A — exact reconciled wiring

Owner selected **dependencies.class-variance-authority=`0.7.1`** and **dependencies.@egdev/ui=`workspace:*`** for effects. Import CVA from its package in types.ts and **cn from the public @egdev/ui root** in the hook. Keep both external to the effects JS library build and verify workspace-to-published-version transformation when packing. **No UI CSS import**, private/deep/sibling-source import, new UI subpath, effects helper file or cn reimplementation.

**Accepted graph/build costs:** effects → UI → individual Radix packages, existing clsx/tailwind-merge and UI's ReactDOM/token/React peer graph. Root-barrel ESM evaluation/install/build coupling remains; **assume no tree-shaking benefit**. Build tokens then UI before effects; isolated consumers provision exact packed UI/token artifacts and consistent React/ReactDOM. Consuming only cn does not imply that the entire UI graph disappears from SSR/dev or bundles. Current UI cn owns its token typography merge policy; do not duplicate it.

**B was not selected.** Neither the previous inline Isotipo helper nor the common proposal's private shared cn.ts/cn.test.ts is authorized. Add no direct effects clsx/tailwind-merge edges, helper module/test, alternative utility package or amendment implementation. Seven runtime files remain exactly as planned. A's scoped selection and unchanged exact three/@types permissions still require separate final-plan approval and fresh assignment before manifest/install/runtime work; they are not an execution grant.

## 4. Exact proposed production build configuration

Parent creates the package build once, coordinated with AmbientBackground preparation; never overwrite shared effects work from another writer.

| Future path | Planned responsibility |
| --- | --- |
| `packages/effects/package.json` | Real build/typecheck scripts; dist ESM/types/CSS exports, approved dependency/peer pins and packaging |
| `packages/effects/tsconfig.json` | Extend existing root strict config; include src, root development type/test setup; no private UI alias |
| `packages/effects/vite.config.ts` | Existing Vite/SWC/dts library pattern; src/index.ts ES entry, source maps, strict declaration emit with src root, exclude stories/tests |
| `packages/effects/vite.styles.config.ts` | Separate CSS-only Vite/Tailwind build, preserve JS/declaration output; no CSS import in SSR entry |
| `packages/effects/src/styles/compiled.css` | Package utility entry: reference canonical token theme and explicitly scan approved effects types.ts; natural utility layer only, no handwritten component recipe |
| `packages/effects/src/index.ts` | Named Isotipo3D/type export, preserve any separately integrated effects exports |
| `packages/effects/README.md` | English supported peer/install/CSS/container/SSR/fallback/preference contract and honest validation limits |
| `pnpm-lock.yaml` | Parent-owned install result only |

**Owner-selected direction, conditional proposed manifest:** main `./dist/index.js`, types `./dist/index.d.ts`, exports `.` with types/import targets and `./styles.css`→`./dist/styles.css`; files `["dist"]`; sideEffects `["**/*.css"]`. Publish complete emitted JS/lazy chunks/declaration/CSS/required-asset closure under dist; keep every historical reference file unchanged in the repository and never execute it as the component entry. Preserve concurrently approved AmbientBackground outputs.

**Compatibility gate before applying:** current src/reference files, source main and missing export map allow existing source/reference/deep paths. Dist-only removes shipping paths and the proposed map can block former imports. An empty React barrel does **not** remove that compatibility surface. W3/parent inventory must distinguish tracked/documented consumers, published-package/tarball evidence where available and unknown external consumers; this writer has not performed that inventory and does not claim it is absent globally or that there are no consumers. Review coverage, affected paths, migration/release handling and any unknowns; obtain exact final-plan/export-map approval before editing manifests or packing the new boundary. Questionnaire direction alone neither certifies compatibility nor authorizes a map, migration, alias, path removal or repository-reference deletion. Parent reconciles common/Ambient plans and evidence before execution; no new helper/engine subpath is proposed.

JS build externalization: /^react($|\/)/, /^three($|\/)/, class-variance-authority and @egdev/ui under selected A. No bundling three into root/eager chunk. Preserve literal external dynamic `import('three')` under eligible client startup, optionally with lazy private scene-module chunk; emitted JS/declarations must be inspected rather than assume build configuration proves laziness. Engine types are internal type-only imports; public Isotipo3DProps exposes no three values/types. No value imports of THREE at module scope, CDN URL, global object, source execution, @vite-ignore or loader prop.

CSS entry is package infrastructure, **not a component stylesheet exception**. Reference @egdev/tokens/theme.css, scan `../atoms/isotipo3d/types.ts` and any separately approved AmbientBackground types, emit utilities via existing Tailwind plugin without token declarations/legacy UI CSS; no invented fallback values. Consumers load canonical @egdev/tokens/tokens.css plus @egdev/effects/styles.css; no app Tailwind compiler or UI stylesheet required. Include static opacity variable utility, fills, dimension/position/clip/pointer and presentation utilities; no root material paint. Token CSS and WebGL numeric exceptions remain their original scopes.

Renderer size calls use r160's non-style-updating mode (setSize(width,height,false)); DPR/backing-store changes are drawing operations, not inline CSS size permission. Choose r160 WebGL/geometry/material APIs against the actually installed @types/three and record any discrepancy rather than widen contract. Renderer/framebuffer/instance buffers/halo ownership must be verified by tests and real browser resource observations, not claims from an unexecuted declaration build.

## 5. Shared integration and planned supported-consumer evidence

Parent-owned additional exact surfaces: `.storybook/preview.css` (include effects utility entry and story example sources without duplicate token imports), `.storybook/main.ts` (bounded native-prop documentation for actual component; do not replace global docgen), `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`, registry JSON/generated view and authorized catalog inputs/outputs. Root Vitest already discovers `packages/*/src/**/*.test.{ts,tsx}`; root TS already includes packages/*/src. **No root test config/dependency change is currently required**. If real integration reveals one, report it with exact evidence rather than silently broaden surfaces. Avoid the current @ alias, which targets UI.

Planned parent commands, **not run/authorized to writer now**, after exact approved integration/install:

1. `pnpm exec vitest run packages/effects/src/atoms/isotipo3d` — focused runtime tests first.
2. `pnpm --filter @egdev/effects run typecheck` — replaces placeholder with real strict tsc.
3. `pnpm --filter @egdev/tokens run build` then `pnpm --filter @egdev/ui run build` — selected A prerequisite order before effects; preserve other prepared components.
4. `pnpm --filter @egdev/effects run build` — real JS/dts/CSS and dynamic import inspection.
5. Parent-updated `pnpm test:package-exports` and `pnpm test:package-consumption` — serialized under parent locks/caps; current harness is primarily UI/token, so existing passes would not validate effects until scoped cases are integrated.

Required evidence: packaged entry/exports/private exclusion; no-Tailwind static CSS; SSR without window/document/imported WebGL; deterministic hydration fallback; correct callback/object refs React18/19; installed required peer; no three request just from package import/unrelated export/SSR/suspended mount; first eligible lazy request; actual supported bundler build; rejection→terminal fallback; repeated mount/unmount/stale result cleanup. Native/browser code after renderer creation needs a real WebGL browser test; mocked GPU/React tests cannot establish parity or disposal on a driver.

**Remaining gates, not repeated questionnaire choices:** review W3/parent inventory coverage and compatibility/migration disposition for selected dist-only; approve the exact reconciled final component/build/exports plan and receive a fresh bounded runtime/integration assignment. Utility A and exact three/@types scope are already selected/retained. No build/install, source/manifest/lock edit, optional-peer policy, compatibility certification or CSS/browser result follows from those answers or is performed here. Parent must refresh old common/index bindings after concurrent writers and inventory handoffs return; new document hashes are not approval receipts.
