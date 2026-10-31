# Effects — observable compatibility-surface inventory

- **Status:** observed tracked baseline plus proposed compatibility dispositions; drafting/self-check only, not an independent verifier verdict or final-plan approval.
- **Baseline:** `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`, current isolated worktree. Untracked component/owner-plan drafts are not implemented consumers.
- **Canonical identity:** `contentSHA256: sha256:1f952925e4e46e83e714805a77d305ca6720c3a9d85cb6131603fdb1f3cbe3b5`; SHA-256 of UTF-8 LF bytes from the actual whole-line heading `## 1. Authority and inventory boundary` through EOF, including final LF; exclude tracking metadata above, not an inline heading mention.

## 1. Authority and inventory boundary

Read the parent-owned `effects-owner-decisions.md` and `effects-integration-plan.md` under sibling worktree `/home/egdev/proyectos/egdev-design-system-worktrees/indicator/docs/components/remaining-components/v0.1/`, without modifying either or depending on W1/W2's concurrent reconciliation outputs. Owner decision-record canonical SHA-256 is `636e5a37c41e3896920f9a728349978a09cb1e5e11d5a03498f88b540602cb61` (actual `## Decisions` heading). It selects **A: CVA 0.7.1 + public root cn from @egdev/ui:workspace:*, no UI CSS**, accepting UI/Radix/ReactDOM coupling, and **dist-only direction conditional on consumer/migration review and final plan approval**. Older proposal wording that U/P are unselected is historical, not authority to reopen A or silently grant execution. No private effects cn, aliases, export map, deletion, install, migration, release or Git operation is authorized here.

Local inventory used read-only git ls-files/git grep across tracked files for @egdev/effects, packages/effects, relative effects/src/reference, all three archived filenames, their callable/global references, workspace/link/file/pack workflows, then read the entry/archive closure and relevant manifests/scripts. CodeGraph reports uninitialized; index creation is outside this one-document surface, so scoped source/text inspection was used. No archived JavaScript or repository test/build/pack was executed, including pack --dry-run. This is lexical/source inventory, not proof against computed imports, aliases, vendored copies or consumers outside this checkout.

## 2. Current declared and reachable surface

[Manifest](../../../../packages/effects/package.json): @egdev/effects 0.1.0, type=module, **main=./src/index.ts, files=[src,reference]**, echo-only build/typecheck. No exports map, types, dependencies, devDependencies, sideEffects or private field. Only declared peers are tokens workspace:* and React >=18; lock importer resolves tokens link:../tokens and React19.2.8. No tracked manifest declares effects as another package's dependency. These are declarations/lock observations, not an installed or published tarball inventory.

Exactly six tracked package files: README.md, package.json, src/index.ts and the three reference scripts below. No tracked dist, real Vite/TS build config, stylesheet, React component/test/story or other source module exists. Entry [src/index.ts](../../../../packages/effects/src/index.ts) contains comments and export {}; no imports/re-exports, so its current reachable source closure is that one file. **An empty barrel does not eliminate shipped raw source/reference/deep-import surfaces.** With no exports map, the manifest places no explicit export-map barrier around source/reference/package.json; actual resolver and TS/script execution rules still apply. Do not claim that every raw file already has an ESM API or that no one can consume it.

| Baseline file | Whole-file SHA-256 | Observed role / compatibility significance |
| --- | --- | --- |
| `packages/effects/package.json` | `61fb3d4575f4a6770b3045bce5368557b852c544d9786deb3537257bd0e22e20` | Declared source entry and src/reference shipping allowlist |
| `packages/effects/src/index.ts` | `d4f463629e5bbe7565524dafc96cd295195962dca17172051f7a9731d33f6fae` | Empty public barrel, not a deep-path compatibility waiver |
| `packages/effects/README.md` | `c2a75293bc4041d046dce72010394d6ca13436cd731e748d7ae5d3dbea9d15a3` | Documents archive provenance, engine methods and future React ports |
| `packages/effects/reference/particle-streaks.js` | `acabbacd1bdb1b94bb1745cbcb7e3e4bf804a77c3fef3e375d63692bd9ad9086` | Vanilla createParticleStreaks declaration/config; no import/export; script/inlined harness surface |
| `packages/effects/reference/pulso-director.js` | `2193bf2f19c927133722453db0301dc08285ca6e0db69a3994d4b7c25a98fc5e` | Self-running page controller with its own inlined particle factory and window.PULSO producer |
| `packages/effects/reference/pulso-iso3d.mjs` | `394bbf719bc3e1b5855e63a37ceee55ee5069065c659c953528ed3c13a7e34c8` | Self-running module consuming window.PULSO and dynamic CDN three URL |

Archive closure was read completely, not executed: particle factory allocates canvas sprites and resize/rAF behavior when called, exposing config/set/start/stop/renderOnce/running. Director is an IIFE touching document/window, #ambient/#gl, [data-zone], menu/search/countdown/reveal UI and global PULSO; it **duplicates**, not imports, the particle factory. Isotipo reads PULSO, #gl and #slot-* / fallback-class host contract, dynamically imports `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`, creates scene/geometry/material/canvas texture data and listeners. No archive-to-local-file module imports or other local asset fetches were found; generated sprites/halo and embedded geometry do not require a tracked texture file. CDN/network availability and host DOM/global initialization order are external dependencies, not proven working. A raw script/DOM-global integration is not a drop-in typed React consumer and must not be auto-rewritten.

## 3. Exact tracked reference/consumer classification

All matching local path families below were classified; line numbers describe this baseline, not future edited plans. **No tracked application import/require or package dependency on @egdev/effects, nor tracked HTML script tag naming these three files, was found.** That scoped observation is not a harmlessness verdict. Raw JS archives and the recorded inlining harness are real observable consumption surfaces even without React exports.

| Exact observed path(s) / location | Classification and disposition |
| --- | --- |
| `packages/effects/package.json`; `packages/effects/src/index.ts`; `packages/effects/README.md` | Package declarations, empty entry and documented future ports/archive methods; retain provenance and review supported-consumer documentation before any boundary change |
| Three exact `packages/effects/reference/` files in §2 | Archived direct-script/runtime-example implementations, not current typed package exports or evidence of a deployed consumer; preserve unchanged in repository |
| `docs/components/ambient-background/v0.3/capture.json:8–11` | Historical **actual recorded inlined engine harness**: about:blank canvas, createParticleStreaks(...).start(), director PROF multipliers; not a package import/deployed app; repository source path/hash must remain recoverable |
| `docs/odd/m3-component-inventory.md:35,119` | Historical entry/archive links and catalog evidence, explicitly not React implementation; preserve archive links/history |
| `packages/ui/src/styles/legacy/bundle.css:844` | Historical web/p4-pulso.html and web/particle-streaks.js provenance comment, not a JS import; original external web tree not inventoried here |
| `README.md:17`; `AGENTS.md:13`; `docs/ARQUITECTURA.md:22` | Package listing/architecture references, not executable consumers; graph/docs may need later scoped updates, not automatic migration |
| `docs/CATALOGACION.md:73`; `docs/CATALOGO.md:25,138`; `scripts/build_catalog.py:11` | Destination schema/generated catalog references; effects rows are plans, not imports; no catalog/index edits in this inventory |
| `docs/PLAN.md:7,54` | Monorepo and future port roadmap, not a deployed application dependency |
| `docs/storybook/welcome.mdx:21` | Rendered documentation card naming effects, not an effects component import |
| `biome.json:19` | Explicit reference-directory lint exclusion; not proof of execution, correctness or publishing safety |
| `pnpm-workspace.yaml:2`; `pnpm-lock.yaml:99–107` | Local workspace includes packages/*; effects importer links tokens/react only; no reciprocal effects dependency observed |
| `package.json:10–11`; `tsconfig.json:8`; `vitest.config.ts:14`; `.storybook/main.ts:145` | Recursive build/typecheck and broad source/test/story discovery may include effects; no implemented effects source consumer/story/test beyond the empty entry |
| `.github/workflows/build-and-test.yml:2,51–58`; `.github/bootstrap/sources/build-and-test.build-first.yml:2`; `.github/bootstrap/sources/build-and-test.props.yml:2` | CI/template warnings explicitly say placeholder effects build does not certify artifacts; recursive build is not distribution coverage |
| `scripts/package-exports.test.mjs:9–12` | Built-artifact checks instantiate UI/tokens manifests, not effects; no effects artifact assurance exists here |
| `scripts/package-consumption.test.mjs:6670–6755` | Existing local **pack/file:** fixture workflow packs **tokens/UI only**, overrides token workspace edge, installs React18/19 consumers with ignore-scripts/strict peers, optional offline; effects not included. Read only, not run |

No tracked pnpm/npm/yarn link command or documented local effects-specific link/pack consumer was found. Repository workspace inclusion is observed; developer filesystem links, unpublished fixtures, other checkouts and private app manifests remain unknown. Existing pack/consumer scripts create/install/clean temporary files and are not safe “inspection commands”; no invocation, dry run or tarball was made. Source hashes of the two inspected consumer scripts: package-exports `411cafde6726da93994c8da1d3c8f9f0907d270bb5658e5dd23609f168997cb7`; package-consumption `b45bb56e6cb8b393a62a5d56bbaec31cfc4086bd37ec72ac143937175c905d5e`.

## 4. Proposed dist-only disposition — conditional, not applied

| Current/reachable path or workflow | Proposed change and unresolved compatibility handling |
| --- | --- |
| `@egdev/effects` → src/index.ts | Move main to dist/index.js and expose declarations/public effects through the eventual approved root map; consumer/module/peer/build-order compatibility must be checked, not inferred from empty old exports |
| `@egdev/effects/src/index.ts`, raw `src/**`, relative/file/workspace source paths | Exclude raw src from shipped files; restrictive map would block package deep imports. Inventory actual consumers and agree migration/release handling before change; repository-relative checkout access is a separate surface |
| `@egdev/effects/reference/particle-streaks.js`, `.../pulso-director.js`, `.../pulso-iso3d.mjs` and served/copied script URLs | Exclude reference from tarball; direct package/archive URLs would lose those files even if root React API was empty. Retain all three exact repository files/historical links; unknown users require explicit disposition, not automatic typed-component replacement |
| Other deep paths, package.json access, future private helpers/engine files/chunks | Proposed restrictive root + styles.css map may deny former deep resolution; even shipped dist internals are not automatically public exports. No compatibility alias/wildcard is selected or authorized here |
| New dist JS/declarations/styles/required lazy chunks/assets | Review complete emitted closure and map/allowlist under final plan; do not omit required chunks or accidentally publish raw sources/stories/tests. Pack rules may include metadata/README/license independently; no tarball contents are claimed now |
| Workspace/local fixture installs and route A | New effects→UI workspace edge/CVA requires actual package resolution/build order, packed UI/token overrides and peer/ReactDOM review; do not import UI CSS or assume named cn guarantees tree-shaking. Existing UI/tokens fixtures must be preserved and effects coverage added only under later authorization |

The archive's page director/global API is not part of the future generic effects component API merely because its bytes are preserved. Conversely archive preservation in Git does not preserve an old package deep path under files=[dist]/a restrictive exports map. No deletion, alias design, automatic migration, semver/release decision or publication is authorized by the selected direction.

## 5. Parent-provided bounded external evidence and unknowns

Parent supplied job73, exit0, record `/tmp/egdev-remaining-odd/effects-external-inventory.json`, whole-file SHA-256 `f26bdb49c01805195bab9c694bed9537289653af914d5f20c28edc4bc211dfc0`, observed **2026-10-30T13:51:57.073893+00:00**. This writer read that record; **performed no network/registry/GitHub query**.

- Public npm `https://registry.npmjs.org/@egdev%2feffects` returned **404** at that time. No metadata/tarball was obtained from this endpoint. This is not proof of no past publication, private registry package, local/workspace use or mirrored/copied distribution.
- Parent GitHub query: `gh search code '"@egdev/effects"' --owner egdev6 --limit 100 --json repository,path,url`, exit0, returned exactly two hits, both in egdev6/egdev-design-system: scripts/build_catalog.py and packages/effects/package.json. The actual returned array has two entries, not proof of every indexable reference; local tracked grep already reveals more documentation mentions. Exact-text/account/access/indexing/limit scope does not cover private/global/alias/raw-script consumers.
- No published tarball inspection or private-registry inventory was performed by this writer; parent endpoint evidence yielded no tarball to inspect. **Unknown external consumers are not absent consumers.** No external app migration list, local developer-link inventory or CDN/script URL usage audit is supplied.

## 6. Bounded migration and verification gate

Before final execution approval, parent combines this tracked inventory with separately authorized relevant external/private/local-link evidence, records any known consumers/import forms/versions and explicitly resolves unknown-risk acceptance or named migrations. A public404 plus bounded search cannot waive this review. Keep recoverable archive paths/source hashes and historical captures unchanged; any additional consumer evidence updates the compatibility decision, not the old contract silently.

Final reconciled plans must identify exact files/map/entries/CSS/chunk closure, selected A graph and no-UI-CSS policy, consumer migration/release handling and remaining component approvals. If a compatibility alias, archive export, extra asset, peer change or migration is needed, return that precise proposal for owner approval; none is implied by this inventory. W1/W2 reconcile their plans independently; this writer imposes no in-progress-output gate.

Only after separate final-plan/runtime authority may parent build and inspect emitted artifacts, run authorized packing/consumer checks, compare the actual file list to the proposed allowlist, validate root/styles imports and intended negative deep imports, declarations/SSR/React18/19, lazy external three/chunk behavior and native CSS without consumer Tailwind/UI CSS. Preserve existing UI/tokens coverage. Missing peer/CDN/DOM-global behavior must not be presented as a supported fallback or automatic migration. This is a future gate, **not checks run here**.

Self-check covers this new document's anchored identity, links, evidence byte hashes, whitespace and coverage of observed/proposed/unknown categories only. No tests/build/install/pack/server/browser/source/registry/index/tracking/Git mutation or independent/native approval verdict occurred.
