# #342 — Versioned local tarballs for `@egdev/tokens`, `@egdev/ui`, `@egdev/effects`

- Issue: [#342](https://github.com/egdev6/egdev-design-system/issues/342)
- Milestone: 9 — Distribution for products and agents
- Proposal: `egdev-ds-distribution-v1` (roadmap index #349, ODD task T1)
- ODD specs covered: **S1**, **S2**, **S3** (`odd/tasks/ds-distribution.md`)
- Status: **Approved — owner, 2026-11-05 (see Owner approval)**
- Planning only: no implementation, no manifest/token/dependency change, no publication.

## 1. Current state (observed)

| Fact | Evidence |
| --- | --- |
| Three publishable packages, no licence/repository fields, no `CHANGELOG.md` anywhere | `packages/ui/package.json:2-3`, `packages/effects/package.json:2-3`, `packages/tokens/package.json:2-3`; `ls packages/*/CHANGELOG.md` → not found |
| Versions are independent today: tokens 0.3.0, ui 0.1.0, effects 0.1.0 | `packages/tokens/package.json:3`, `packages/ui/package.json:3`, `packages/effects/package.json:3` |
| Workspace specifiers exist in peers and dependencies: `@egdev/tokens`, `@egdev/ui` | `packages/ui/package.json:57,62`, `packages/effects/package.json:26,32` |
| React peer is `>=18.0.0`, wider than the tested matrix (18.3.1, 19.3.0) | `packages/ui/package.json:58-59`, `packages/effects/package.json:27,29`, matrix at `scripts/package-consumption.test.mjs:13-16`; caveat already stated in `docs/ARQUITECTURA.md:104` and `skills/_shared/component-contract.md:49` |
| `three` peer is exact `0.160.0` and is asserted on the packed manifest | `packages/effects/package.json:28`, `scripts/package-consumption.test.mjs:5075` |
| No `release:pack` script; only build/test entry points | `package.json:10,21-22` |
| Existing, proven pack path: per-package `pnpm pack --pack-destination` into `mkdtemp`, then `file:` dependencies plus `pnpm-workspace.yaml` `overrides` in an isolated consumer | `scripts/package-consumption.test.mjs:9230-9241`, `:9244-9253`, `:9264-9267`, `:9294-9306` |
| Packed-artifact existence is checked separately by the exports suite | `scripts/package-exports.test.mjs:10-19` |
| Build order is topological from the root | `package.json:10` (`pnpm -r --filter './packages/**' run build`) |
| Packed content is decided by `files` and `exports`: ui ships `dist` plus `src/**/*.css`, effects ships `dist`, tokens ships `src` and `dist` (so both `theme.css` modes survive packing) | `packages/ui/package.json:8-19`, `packages/effects/package.json:8-19`, `packages/tokens/package.json:6-14` |
| The consumer fixture pins the repo's `packageManager` and asserts the fixture `pnpm --version` matches before installing | `scripts/package-consumption.test.mjs:9244-9298` |
| Consumer CSS setup already documented for both modes | `docs/ARQUITECTURA.md:74-87` |
| Prior approved requirement still open: verify workspace→published version transformation when packing | `docs/components/isotipo3d/v0.4/dependency-build-plan.md:32` |
| `.gitignore` ignores `dist` at any depth and has no tarball folder | `.gitignore:1-7` |
| No dependency may be added, no token value changed, without owner confirmation | `AGENTS.md:44`; `CONTRIBUTING.md:9-10` |

The packing logic therefore already exists once, as test-only code. The work below moves it to one shared implementation and lets a root script call it.

## 2. Specification

R1 — `pnpm release:pack` (root `package.json`) builds the workspace and packs the five-package release set — `@egdev/tokens`, `@egdev/ui`, `@egdev/effects`, `@egdev/system`, `@egdev/mcp` — into one output folder, producing `egdev-tokens-<version>.tgz`, `egdev-ui-<version>.tgz`, `egdev-effects-<version>.tgz`, `egdev-system-<version>.tgz`, `egdev-mcp-<version>.tgz`, where `<version>` is read from each package manifest at run time (never hardcoded). One run leaves exactly those five files in the folder. **(amended by owner approval 2026-11-05: the issue's AC 1 wording of three tarballs is superseded by the five-package release set, per #346 Q5 (a) and the `@egdev/system` carrier of #345 O1 (b); this document owns the pack and version policy for all five. Ordering precondition: `@egdev/system` is created by T4/T6 (#345, #347) and `@egdev/mcp` by T5 (#346), so the five-file form is reachable only once those tasks land; T1 ships the script over the packages that exist and the two remaining members join the same run without a second packing path. How the script treats a not-yet-created member is not decided by the answers and is reported, not invented.)** → AC 1
R2 — One packing implementation. The pack step is extracted from `scripts/package-consumption.test.mjs:9230-9241` into a shared module used by both the consumption test and `release:pack`; no second `pnpm pack` path is added. → AC 1
R3 — Manifest verification is part of the script, not only of tests: after packing, the script reads each packed `package.json` and fails with exit code 1 and one stderr line per offending package naming the field, if any dependency field (`dependencies`, `peerDependencies`, `optionalDependencies`, `devDependencies`) still contains a `workspace:` specifier. Success writes one stdout line per tarball: file name, package name, version. → AC 2
R4 — Packed React peer range matches the tested matrix. The range is expressed in both React-consuming manifests and asserted on the packed tarballs; the two prose claims that the peer is `>=18.0.0` are reconciled in the same unit (`docs/ARQUITECTURA.md:104`, `skills/_shared/component-contract.md:49`). The range is `^18.3.1 || ^19.3.0` (D5 (a), approved 2026-11-05). **(amended by owner approval 2026-11-05: the exact range is decided.)** → AC 2 (also issue Checks)
R5 — A documented semver 0.x policy plus one `CHANGELOG.md` per package, each containing a section for the version currently in its manifest. Bumps stay manual: the pack script never edits versions. → AC 3
R6 — The install guide ships the exact steps for both CSS modes from `docs/ARQUITECTURA.md:74-87`: `file:` dependencies for the three tarballs, `pnpm-workspace.yaml` `overrides` for `@egdev/tokens` and `@egdev/ui` (so effects resolves the tarball instead of a workspace link), the exact-`three` peer, the pinned `pnpm` version, and the CSS imports per mode. → AC 4
R7 — The guide is executable evidence, not prose: a test extracts the commands from the guide's fenced block, runs them in a fresh `mkdtemp` directory outside the worktree, and asserts install plus a build succeed with no workspace links. Execution mode is D7 (a), an executable test. **(amended by owner approval 2026-11-05: the execution mode is decided.)** → AC 4
R8 — A test for the pack script output and packed manifests, exposed as root script `test:package-release` (naming follows `package-exports`/`package-consumption`), covering: five tarballs with versioned names (the release set above), no `workspace:` in any packed manifest, packed React peer range, packed `three` peer, and packed version equal to manifest version. **(amended by owner approval 2026-11-05: the release set is five packages.)** → AC 1, AC 2, issue Checks
R9 — No new dependency, no token value change, no package version bump other than the ones the owner approves for this unit. If a dependency-free implementation becomes impossible, it is reported, not added. → issue Scope/Dependencies ("None"), `AGENTS.md:44`

### Contract surface (planned file layout)

| Path | Role |
| --- | --- |
| `scripts/lib/pack-packages.mjs` | Single packing step: loop packages, `pnpm pack --pack-destination`, return `{ name: { file, path, version } }` |
| `scripts/release-pack.mjs` | `release:pack` entry point: build, empty/create the output folder, pack, verify packed manifests, print one line per tarball |
| `scripts/package-release.test.mjs` | Pack output, packed-manifest and guide-command checks |
| `scripts/package-consumption.test.mjs` | Keeps its consumer assertions; its inline pack loop is replaced by the helper |
| `docs/distribution/versioning.md` | 0.x policy, bump procedure, changelog format |
| `docs/distribution/install.md` | Install guide for both CSS modes |
| `packages/{tokens,ui,effects}/CHANGELOG.md` | One section per released version, newest first |
| `package.json` | `release:pack`, `test:package-release` |
| `.gitignore` | Output folder entry (D4) |
| Output folder (`release/`, D4 (a)) | `egdev-tokens-<version>.tgz`, `egdev-ui-<version>.tgz`, `egdev-effects-<version>.tgz`, `egdev-system-<version>.tgz`, `egdev-mcp-<version>.tgz` (amended by owner approval 2026-11-05: five-package release set) |

The pack script owns no `.npmrc`, no publish step and no registry configuration: `pnpm pack` reads the workspace and writes tarballs only.

## 3. Decisions for the owner

D1 — Versioning tooling. (a) Manual bumps + per-package `CHANGELOG.md` **[recommended: the issue excludes changesets and any release tooling; manual bumps are reversible and reviewable]**; (b) adopt changesets now; (c) a custom commit-derived bump script.
D2 — Bump semantics under 0.x. (a) Minor for breaking, patch for fixes, pre-1.0 semver allowance documented **[recommended]**; (b) patch-only with a breaking-change suffix; (c) promote to 1.0.0 and treat the peer range as stable.
D3 — Version coupling and packed token peer. (a) Independent per-package versions, `@egdev/tokens` peer packed to the exact version pnpm writes **[recommended: deterministic, matches one-version-per-folder consumption]**; (b) lockstep single version across the three packages; (c) independent versions with the token peer rewritten to `^<version>` in the source manifest.
D4 — Output folder. (a) `release/` at repo root, added to `.gitignore`, emptied by the script on each run **[recommended: conventional, keeps `dist/` as build output]**; (b) `artifacts/packages/` with the same rules; (c) `<repo>/dist/release/` reused because `dist` is already ignored — note this collides in name with package build output.
D5 — React peer range. (a) `^18.3.1 || ^19.3.0` in ui and effects, with the two prose caveats reconciled **[recommended: the issue requires the range to match the tested matrix]**; (b) keep `>=18.0.0` and document only the tested matrix, leaving the range wider than the evidence; (c) keep `>=18.0.0` and widen the tested matrix instead (extra work, more install time).
D6 — CHANGELOG enforcement. (a) `release:pack` fails when the packed version has no matching top `CHANGELOG.md` section **[recommended: makes AC 3 mechanical]**; (b) warning only; (c) enforcement in the test only.
D7 — Guide verification. (a) Executable test that runs the guide's fenced commands in a clean temp directory (network install, ~1-2 min) **[recommended: AC 4 asks for the guide to be followed]**; (b) manual recorded evidence in the PR body, no automated check; (c) doc-only, relying on the existing consumption test as indirect proof.

## 4. Implementation plan

Work units are sized for ~400 changed lines each and depend on D1-D7 approval. Order: WU1 → WU2 → WU3 → WU4. No unit is authorized to add a dependency.

### WU1 — Policy and changelogs (D1, D2, D3)

- Files: `docs/distribution/versioning.md` (new), `packages/tokens/CHANGELOG.md`, `packages/ui/CHANGELOG.md`, `packages/effects/CHANGELOG.md` (new).
- Size: ~140 added lines (policy ~90, three changelogs ~50).
- Content: 0.x version policy, bump procedure per package, changelog format (Keep a Changelog headings + SemVer), and the rule that the pack script packs the manifest version as-is.
- RED/GREEN: not applicable — passive documentation with no runnable behavior. Verification: owner review; `CHANGELOG.md` top section equals each manifest version (`packages/*/package.json:3`).
- Exit condition: policy and changelog format approved; three changelogs contain the current versions.

### WU2 — Pack script, shared helper, output tests (D4, D6)

- Files: `scripts/lib/pack-packages.mjs` (new shared pack step), `scripts/release-pack.mjs` (new), `scripts/package-consumption.test.mjs` (pack step now calls the helper, `:9230-9241` removed), `scripts/package-release.test.mjs` (new), `package.json` (`release:pack`, `test:package-release`), `.gitignore` (output folder).
- Size: ~320 changed lines (new helper/script/test ~300, deleted inline loop ~10, root entries ~4).
- RED: `node --test scripts/package-release.test.mjs` — first with only the test file (missing `scripts/release-pack.mjs` → module-not-found, non-zero exit), then with a stub script (no tarball in the expected folder). Also assert the negative: a fixture manifest containing `workspace:*` must make the check exit 1, print the offending package and field on stderr, and leave the output folder unchanged.
- GREEN: `pnpm build && pnpm release:pack` prints five versioned lines (amended by owner approval 2026-11-05); `pnpm test:package-release` and `node --test scripts/package-release.test.mjs` pass.
- PRESERVE: the consumption test's React 18.3.1 and 19.3.0 cases still install from `file:` tarballs and typecheck (`pnpm test:package-consumption`); `pnpm test:package-exports` unchanged. One differential run of `pnpm test:package-consumption` against the pre-change pack loop confirms stdout/stderr/exit parity of the shared step.
- Manifest reading: `node:zlib` gunzip plus 512-byte tar-header parsing, no `tar` binary and no dependency. Using the system `tar` CLI instead needs explicit owner confirmation as an unmanaged dependency.
- Exit condition: R1-R3, R8 green; AC 1 and AC 2 have recorded evidence.

### WU3 — React peer range and doc reconciliation (D5)

- Files: `packages/ui/package.json:58-59`, `packages/effects/package.json:27,29`, `docs/ARQUITECTURA.md:104`, `skills/_shared/component-contract.md:49`, plus the peer assertions in `scripts/package-release.test.mjs`.
- Size: ~40 changed lines (2 manifests, 2 prose lines, ~10 test lines).
- RED: extend the pack test to assert the packed React peer range equals the approved range; observe it fail against the current `>=18.0.0`.
- GREEN: change both manifests; packed tarballs carry the new range; `three` and `@egdev/tokens` peers stay as decided in D3.
- PRESERVE: `pnpm test:package-consumption` still installs with both React versions and `--strict-peer-dependencies`; `pnpm test:package-exports` unchanged.
- Exit condition: R4 green, both prose caveats updated in the same commit.

### WU4 — Install guide and clean-directory proof (D7)

- Files: `docs/distribution/install.md` (new), one case in `scripts/package-release.test.mjs`.
- Content: prerequisites (Node 24, pinned `pnpm`), install from `file:` tarballs, `pnpm-workspace.yaml` overrides, both CSS modes exactly as in `docs/ARQUITECTURA.md:74-87`, and how to upgrade to a new tarball set.
- Size: ~140 changed lines (guide ~100, test case ~40).
- RED: guide-command test created before the guide exists → fails on the missing fenced block.
- GREEN: guide present; the extracted commands install and build in `mkdtemp` outside the worktree, with the temp directory removed in teardown.
- Exit condition: R6, R7 green; AC 4 has recorded evidence; `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption` pass together.

## 5. Risks and out of scope

- **Consumed contracts:** narrowing the React peer range is a semver-visible manifest change for any consumer currently on 18.0.0-18.3.0 (D5). Packaging `@egdev/tokens` as an exact peer makes every tarball upgrade require a matching tarball (D3).
- **Delivery/environment:** the guide test and the consumption test perform network installs (~1-2 min for the guide, up to 6 min per React version in `scripts/package-consumption.test.mjs:9231`) and need disk in the system temp directory; offline CI would need `EGDEV_CONSUMER_OFFLINE=1` (`:9304`). If the owner chooses the system `tar` CLI over the dependency-free tar-header reader, the manifest check does not run on Windows contributors' machines.
- **Concurrency:** `release:pack` writes a shared output folder. Two concurrent runs, or a run during a branch switch, can interleave; the script must empty the folder on start and write to a temp name before the final rename.
- **Security:** only the repository's own packed tarballs are extracted, into a fresh `mkdtemp`; no third-party tarball, registry, or network fetch is introduced by the pack path. Tarball contents must never be executed from the extracted directory.
- **Data/irreversible:** none. No token values change, no dependency is added, versions and changelogs stay reviewable in Git.
- **Untestable:** the guide test runs on the same machine and the same pnpm pin as the repo, so it does not prove a truly foreign environment (different Node minor, pnpm store, OS). Fresh-machine proof stays manual.
- **Out of scope:** npm or GitHub Packages publication, changesets or any release tooling dependency, CI publication workflows, the pilot consumer (#343/T2), MCP artifact and server (#345, #346), `design/system.md` (#347), version bump automation, changing token values, and any change to `packages/tokens/src/theme.css` or `tokens.css`.

### Acceptance criteria traceability

| AC | Requirements | Planned evidence |
| --- | --- | --- |
| 1 — five versioned tarballs from `pnpm release:pack` (amended by owner approval 2026-11-05; supersedes the issue's three) | R1, R2, R8 | WU2 pack test output |
| 2 — no `workspace:` in packed manifests | R2, R3, R4, R8 | WU2 negative case, WU3 peer assertion |
| 3 — per-package changelog for the packed version + documented policy | R5, R8 | WU1 owner review, WU2 changelog enforcement (D6) |
| 4 — guide installs and builds in a clean directory | R6, R7 | WU4 clean-directory case |
| Scope "no new dependency / no token change" | R9 | manifest diff review |

## Owner approval

Approved by the owner on 2026-11-05. D5 takes the owner's separate answer for the React peer range; every other decision takes its recommended option, per the owner's answer "Aceptar todas las recomendaciones (Recomendado)".

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) Manual bumps + one per-package `CHANGELOG.md` | "Aceptar todas las recomendaciones (Recomendado)" |
| D2 | (a) Minor for breaking, patch for fixes, pre-1.0 semver allowance documented | "Aceptar todas las recomendaciones (Recomendado)" |
| D3 | (a) Independent per-package versions, `@egdev/tokens` peer packed to the exact version pnpm writes | "Aceptar todas las recomendaciones (Recomendado)" |
| D4 | (a) `release/` at repo root, added to `.gitignore`, emptied by the script on each run | "Aceptar todas las recomendaciones (Recomendado)" |
| D5 | (a) `^18.3.1 \|\| ^19.3.0` in ui and effects, with the two prose caveats reconciled | "^18.3.1 \|\| ^19.3.0 (Recomendado)" (#342 D5) |
| D6 | (a) `release:pack` fails when the packed version has no matching top `CHANGELOG.md` section | "Aceptar todas las recomendaciones (Recomendado)" |
| D7 | (a) Executable test that runs the guide's fenced commands in a clean temp directory | "Aceptar todas las recomendaciones (Recomendado)" |

Consequence recorded in R1, R8, the contract surface and the traceability table: the release set is five packages — `@egdev/tokens`, `@egdev/ui`, `@egdev/effects`, `@egdev/system`, `@egdev/mcp` — because #345 O1 chose the data-only `@egdev/system` carrier and #346 Q5 (a) put `@egdev/mcp` in the same `release:pack` run. Versioning, changelogs, the output folder and the React peer range stay this document's decisions (D1–D7). One ordering consequence is recorded in R1 and remains open for implementation: T1 lands before T4 and T5, so two members of the five-package set do not exist yet when `release:pack` is first written; the owner's answers fix the set, not the interim behaviour.

Release-set ordering (resolved by the parent under the owner's "accept all recommendations", ODD Log L7): T1 implements `release:pack` for the members that exist (tokens, ui, effects); #345 adds `@egdev/system` and #346 adds `@egdev/mcp` to the set in the commit that creates each package, with a test that its tarball is produced.
