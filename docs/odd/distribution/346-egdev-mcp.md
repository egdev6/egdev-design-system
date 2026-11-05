# T5 — `@egdev/mcp`: offline stdio MCP server over the design system artifact

| Field | Value |
| --- | --- |
| Issue | [#346](https://github.com/egdev6/egdev-design-system/issues/346) (operation `issue-5`) |
| Milestone | 9 — "Distribution for products and agents" |
| Proposal | `egdev-ds-distribution-v1` (roadmap index [#349](https://github.com/egdev6/egdev-design-system/issues/349)) |
| Task / specs | `odd/tasks/ds-distribution.md` T5 — S1 (milestone goal), S4 ("Paquete @egdev/mcp propio (Recomendado)") |
| Dependencies | #345 (artifact, decisions O1–O9 approved 2026-11-05), #342 (packing, decisions D1–D7 approved 2026-11-05) |
| Status | **Five-tool integration implemented; packed verification pending** |

Parent decision L10 deferred `get_design_system_md` until the integration after #347; that integration now implements the approved fifth tool. The original owner approval and five-tool requirements below remain recorded as historical context.

## 1. Current state (observed)

- Workspace glob already admits a fourth package: `pnpm-workspace.yaml:1-2` (`packages/*`), so `packages/mcp` needs no workspace edit.
- Three packages today, one version each: `packages/tokens/package.json:3` (0.3.0), `packages/ui/package.json:3` (0.1.0), `packages/effects/package.json:3` (0.1.0). No package is data-only; `@egdev/tokens` ships CSS only (`packages/tokens/package.json:6-14`, "no hay JSON ni generadores propios" in `packages/tokens/README.md:3`).
- The only structured design-system data today is the catalog: `scripts/build_catalog.py:8` writes `docs/catalog.json` (115 rows, verified) plus `docs/CATALOGO.md`. Everything an MCP server must serve is the artifact planned in #345, which does not exist yet.
- The deferred MCP query is already recorded: `docs/ARQUITECTURA.md:72` ("Una futura consulta MCP queda fuera de T1/T2") and `packages/tokens/README.md:44`.
- An MCP surface already exists, but a different one: Storybook's `@storybook/addon-mcp` exposes an HTTP endpoint (`/mcp`, docs toolset) at `.storybook/main.ts:281-285`. `scripts/storybook-mcp.test.mjs:1-9` proves the repo's testing convention for MCP: an explicit client over a bounded loopback URL. #346 is a separate, local, stdio server with no HTTP.
- Root scripts have no `release:pack` and no MCP entry point: `package.json:10-27` (`build`, `typecheck`, `test`, `lint`, `test:package-exports`, `test:package-consumption`, `test:storybook-mcp`, `props:check`, `tokens`). Every new entry point must follow that `test:<thing>` naming. `release:pack` is #342's deliverable; its R1 now names the five-package release set (`docs/odd/distribution/342-local-tarballs.md`, section 2), amended by the owner approval of 2026-11-05, which resolves this document's Q5 (a).
- Proven pack/consumer pattern to reuse: `scripts/package-consumption.test.mjs:9230-9241` (`pnpm pack --pack-destination` into `mkdtempSync`), `:9294-9305` (pinned pnpm asserted, `--ignore-scripts --no-frozen-lockfile --strict-peer-dependencies` at `:9302`, `EGDEV_CONSUMER_OFFLINE=1` adds `--offline` at `:9303-9305`).
- Toolchain the new package must fit: root `packageManager` pnpm 10.34.6 (`package.json:5`), Node `>=24 <25` (`package.json:6-8`, `.nvmrc` `v24.21.0`), `typecheck` = `tsc --noEmit && pnpm -r run typecheck` (`package.json:11`), `lint` = `biome check .` with everything included except a listed set (`package.json:16`, `biome.json:4-27`) and the repo formatter settings (2 spaces, LF, 120 columns at `biome.json:29-38`), tests via Vitest at root but `node --test` for infrastructure scripts (`package.json:21-22,24`).
- No MCP client configuration exists in the repository today: there is no `.mcp.json` and no `.pi` directory (verified by `ls`), so R7 introduces the first committed client config and there is no existing convention to follow.
- **Dependencies:** `@modelcontextprotocol/sdk` and `zod` are **absent** — no match in `pnpm-lock.yaml` and no `node_modules/@modelcontextprotocol` or `node_modules/zod`. They are genuinely new. `AGENTS.md:44` requires owner confirmation before adding a dependency.
- **MCP SDK facts, known vs to confirm.** Known (npm registry metadata, read-only, `1.32.2` = `latest`): package name `@modelcontextprotocol/sdk`, MIT, `engines.node >= 18`, it re-exports `./server`, `./client`, `./validation`, and it pulls `express`, `hono`, `cors`, `ajv`, `zod-to-json-schema` with `zod` as both dependency and peer (`^3.25 || ^4.0`). To confirm at implementation time (not verified here — no install was performed): exact subpath specifiers for the stdio server (`server/mcp.*`, `server/stdio.*`) and for a test client (`client/index.*`, `client/stdio.*`), the current tool-registration call (`registerTool` vs the older `tool`) and whether it accepts a zod raw shape, the protocol-version negotiation constants, and whether an SDK client can run under `node --test` without extra tooling. If the installed SDK contradicts this document, the doc is corrected with the observed API, not worked around.
- English artifacts, Conventional Commits and "no unapproved dependency" are repository rules (`AGENTS.md:44-46`).
- Neither `docs/distribution/` nor `docs/odd/distribution/344-*` exists yet; #342 and #345 are the only distribution drafts on disk, both `Draft — pending owner approval` **(superseded by the owner approval of 2026-11-05, which approved all seven plans; recorded here as the drafting-time observation)**.

## 2. Specification

The server is a **thin reader**: it loads one already-generated artifact and projects it through tools. It computes nothing about the design system (issue Guidance: "all knowledge lives in #345"). `AC1` = spec/plan/dependencies approved, `AC2` = packed clean-directory install answers every tool offline, `AC3` = responses match the artifact of the same version.

- **R1 — Package layout and manifest (AC1).** A new workspace package `packages/mcp` named `@egdev/mcp`, `"type": "module"`, no React, no CSS, no build-time design-system source reads. One `"bin"` exposing the server executable `egdev-mcp` (Q4 (a)); `"files"` ships exactly the compiled/source server, and the artifact arrives through the `@egdev/system` dependency, so no copy is bundled (Q2 (a)). **(amended by owner approval 2026-11-05.)** `"engines": { "node": ">=24.0.0 <25" }` mirroring `package.json:6-8`; a `typecheck` script so `pnpm -r run typecheck` covers it (`package.json:11`); nothing `private`, because it must install from a tarball.
- **R2 — Artifact resolution and startup (AC2, AC3).** The artifact location follows #345 **O1 (b)**: the data-only `@egdev/system` package. Resolution order is fixed by Q2 (a): a runtime dependency on that carrier package, resolved at startup. **(amended by owner approval 2026-11-05: O1 (b) and Q2 (a) are decided, so the fallback branch in Q2 is closed.)** On startup the server reads the artifact once, validates that it parses as JSON and carries the seven keys of #345 R2, and on any failure exits 1 with **one** stderr line naming the path and the reason. It never falls back to a bundled copy, a network fetch, or an empty shell.
- **R3 — Version identity (AC3).** Every tool response reports the version set it describes: `designSystem.name`, `designSystem.schemaVersion` and `packages[].name/version` exactly as stored in the artifact. The server never derives, reformats or bumps a version. A contract test asserts a response's version block is byte-equal to the artifact's.
- **R4 — Tools (AC2).** Exactly five tools, final names in Q3: the four in the issue with the names as written, plus `get_design_system_md`. **(amended by owner approval 2026-11-05: #346 Q3 and #347 P5 (a) were reconciled — the tool set is the four from the issue plus `get_design_system_md`; no other extra tool, so `get_prop_naming` and `get_version` are still out.)** Each is read-only, takes a validated input and returns JSON: `list_components` (input: optional `package`, `level`; output: `{ designSystem, components: [{ name, package, level, available }], total }`), `get_component` (input: required `name`; output: `{ designSystem, component: { name, package, source, props[], variants[] }, catalog }`), `get_tokens` (input: optional `group`, `prefix`; output: `{ designSystem, tokens: [{ name, value, group }], total }`), `get_material_recipe` (input: optional `id`; output: `{ designSystem, recipes: [{ id, semantics, tokens[] }] }`), `get_design_system_md` (no input; output: `{ designSystem, systemMd }`, where `systemMd` is the string returned by #347's `renderSystemMd` imported from `@egdev/system` — never re-rendered here). **(amended by owner approval 2026-11-05.)** Field names and types are #345's `components[]`, `tokens[]`, `materialRecipes[]` verbatim — the server adds only the query fields and the `total`/version envelope, never a renamed field.
- **R5 — Error behavior (AC2).** Unknown `name`/`id`: a successful tool call whose result carries `isError: true` and one message of the fixed form `Unknown component: <name>` / `Unknown recipe: <id>`, and the server keeps serving. Missing or wrongly typed arguments: rejected by the tool's input schema before the handler runs, with the SDK's validation error surfaced unchanged. No error path writes to stdout (stdout is the JSON-RPC channel); all diagnostics go to stderr.
- **R6 — Read-only and offline by construction (AC2).** The server performs no network I/O, opens no listening socket, writes no file, and registers no tool that mutates anything. Its only input is the artifact file. A test asserts the server's own source imports no `node:http`, `node:net`, `node:dgram` or `fetch`, and the packed check runs with the network-independent flags of `scripts/package-consumption.test.mjs:9302-9305`.
- **R7 — Configuration examples (AC2).** Committed examples for Pi and one further client, as exact JSON blocks that reference the packed, installed binary path (never a repo-relative dev path), plus the one command that proves the connection. Where they live is Q6, because #344 owns the agent connection guide.
- **R8 — Pack inclusion (AC1, AC2).** `pnpm release:pack` produces an `egdev-mcp-<version>.tgz` alongside the others, and the packed tarball contains the artifact it serves (Q2 (a) resolves it from the `@egdev/system` carrier, which is in the same run). Q5 (a) amends #342 R1 to the five-package release set — `@egdev/tokens`, `@egdev/ui`, `@egdev/effects`, `@egdev/system`, `@egdev/mcp` — one folder, one run. **(amended by owner approval 2026-11-05: Q5 (a) is approved, so this document no longer leaves #342 R1 unamended.)**
- **R9 — Contract tests over stdio (AC2, AC3).** One test file spawns the packed/installed server as a child process over stdio with an SDK client and, for each tool, asserts: the tool is listed with its schema, a valid call returns the expected projection of the artifact, an unknown identifier returns the R5 error, and a negative fixture (artifact with one component removed) is detected. Assertions compare against the artifact read directly in the test, never against a second hardcoded copy of the data.
- **R10 — Packed-install proof (AC2).** A test packs all packages, installs the tarballs by `file:` in a fresh `mkdtemp` outside the worktree, and queries every tool through the client with no registry access (`--offline`), then removes the temp directory in teardown. This is the mechanical form of AC2.
- **R11 — New dependencies are exactly the approved set (AC1).** Nothing is added beyond Q1's answer; `zod` is added only as the SDK's peer requires, pinned exactly like every other dependency in this repo. If a further package turns out to be necessary, it is reported, not added.
- **R12 — Lint and typecheck.** `pnpm typecheck`, `pnpm lint` (biome already includes new files, `biome.json:4-27`) and the root `test` suite stay green, and the new entry points are registered as root scripts following the existing `test:*` naming (`package.json:21-22,24`).
- **R13 — No scope creep.** The server does not parse `packages/tokens/src/theme.css`, `docs/catalog.json`, component sources or `docs/MATERIAL.md`; it does not modify #345's artifact, #342's pack policy, tokens, components or `design/system.md`.

Non-requirement (recorded so it is not invented later): the server does not replace, proxy or extend the existing Storybook `/mcp` docs endpoint (`.storybook/main.ts:281-285`), and it offers no transport other than stdio.

## 3. Decisions for the owner

| # | Question | Options | Recommendation |
| --- | --- | --- | --- |
| Q1 | Which new dependencies are approved? | (a) `@modelcontextprotocol/sdk` + `zod`, both pinned exact, direct dependencies of `packages/mcp`; (b) `@modelcontextprotocol/sdk` only, relying on its own bundled zod and passing plain JSON Schemas; (c) no dependency: hand-written stdio JSON-RPC reader | **(a)** — the issue names the SDK and zod as likely, and the SDK's own peer range forces a matching zod anyway. Cost to accept knowingly: this SDK's tree includes `express`, `hono`, `cors` and `ajv` even for stdio use, so install size and dependency surface grow with no runtime HTTP server. (c) saves the dependency but re-implements framing, negotiation and schema validation that the issue's Checks then cannot verify cheaply. |
| Q2 | How does the server obtain the artifact? | (a) runtime dependency on the artifact-owning package chosen by #345 **O1**, resolved at startup; (b) a copy of the artifact bundled into the `@egdev/mcp` tarball by the pack step, no cross-package dependency; (c) read it from an installed `@egdev/ui` | **(a)**, conditional on O1 = (b) (`@egdev/system`): one artifact, one owner, one version set, and R3's version match becomes a package-resolution fact instead of a copy that can drift. If O1 chooses (a) or (c), (b) is the fallback and the pack step must fail when the bundle is stale. |
| Q3 | Which tools, with which final names? | (a) exactly the four in the issue, names as written; (b) the four plus `get_prop_naming` and `get_version`, because `propNaming[]` otherwise has no tool; (c) the four plus one generic `query` tool | **(a)** — the issue's "such as" allows more, but every extra tool is an unrequested contract. `propNaming[]` stays reachable through the artifact package itself until a real consumer asks. |
| Q4 | Executable name and invocation? | (a) `egdev-mcp`; (b) `egdev-design-system-mcp`; (c) no `bin`, invoked as `node node_modules/@egdev/mcp/dist/index.js` | **(a)** — the repo's public marker convention is `eg-` prefixed and short (`AGENTS.md` component rules), and it reads unambiguously in a client config next to other servers. (c) makes every client config depend on a path shape instead of a declared executable. |
| Q5 | How does the MCP tarball enter `release:pack`? | (a) amend #342 R1 from "exactly the three packages" to the release set that includes `@egdev/mcp`, one folder, one run; (b) a separate `release:pack:mcp` script and folder; (c) the MCP tarball is produced only inside the #346 tests | **(a)** — #342 is still an unapproved draft, so widening its R1 now is cheap and keeps a single version set and a single output folder (#342 D4). (b) creates two release truths; (c) leaves AC2's "installed from its tarball" with no shipped artifact. |
| Q6 | Where do the client configuration examples live? | (a) `packages/mcp/README.md`, with #344's guide linking to it; (b) only in #344's guide; (c) a new `docs/distribution/mcp.md` page | **(a)** — the example must version with the bin name and the packed path, which are this package's facts; #344 keeps the cross-client narrative. (b) couples an approved scope to an undrafted document (#344 does not exist on disk yet). |
| Q7 | How is "read-only, no network" enforced? | (a) structural test on the server's imports plus an offline packed run (R6); (b) runtime guards that reject any network call; (c) code review only | **(a)** — mechanical evidence with no production code that exists only for the test. (b) cannot block a `fetch` already imported from the runtime and adds unreachable branches. |
| Q8 | Should the server's responses be validated against the artifact schema? | (a) hand-written assertions in the contract tests, as in #345 O9 (a); (b) reuse a JSON Schema + `ajv` (already transitively present via the SDK, but a new direct dependency); (c) no shape checks | **(a)** — keeps the dependency set exactly Q1's and keeps the assertion strength in the tests rather than in a schema file that can drift. (b) is only attractive if #345 later adopts a schema. |

No other new dependency, tool, transport, hosting step or write path is proposed.

## 4. Implementation plan

Work units stay within ~400 changed lines and depend on Q1–Q8 (approved 2026-11-05) plus #345 (artifact schema) and #342 (`release:pack`). Order WU1 → WU5. Every RED run must fail for the stated reason first. **(amended by owner approval 2026-11-05: Q1 is approved, so WU1 may install the dependency it names.)**

**WU1 — Package skeleton, artifact loading, version envelope (Q1, Q2, Q4).**
Files: `packages/mcp/package.json`, `packages/mcp/tsconfig.json`, `packages/mcp/src/artifact.ts` (load + validate), `packages/mcp/src/version.ts`, `packages/mcp/tests/artifact.test.mjs`, `pnpm-lock.yaml` (via the approved install), root `package.json` (`test:mcp`).
RED: `node --test packages/mcp/tests/artifact.test.mjs` → module-not-found, then failing cases for a missing file, malformed JSON, a missing top-level key (each expects exit 1 and one stderr line) and a version block that differs from the artifact.
GREEN: same command passes; `pnpm install --frozen-lockfile` is clean after the approved dependency addition; `pnpm --filter @egdev/mcp run typecheck` passes.
Exit: the loader returns the artifact and its version block, fails closed on every malformed case, and no tool exists yet.

**WU2 — The five tools and their contract tests (Q3, Q8, R4, R9).**
Files: `packages/mcp/src/server.ts`, `packages/mcp/src/tools/*.ts`, `packages/mcp/tests/stdio.test.mjs`.
RED: `node --test packages/mcp/tests/stdio.test.mjs` → fails on the missing `listTools` entries and on each expected projection.
GREEN: same command passes; each tool's output is compared to the artifact read directly in the test; a fixture with one `components[]` entry removed makes the `list_components` expectation fail (proving the test is artifact-derived, not hardcoded).
Exit: five tools listed with input schemas and JSON output matching R4, all obtained through a client over stdio (amended by owner approval 2026-11-05: `get_design_system_md` is the fifth, and its bytes are asserted equal to #347's golden).

**WU3 — Error behavior, read-only guard (Q7, R5, R6).**
Files: `packages/mcp/src/errors.ts`, `packages/mcp/tests/errors.test.mjs`, `packages/mcp/tests/read-only.test.mjs`.
RED: unknown component/recipe cases fail (no `isError` flag today), invalid-argument case fails, and the import-structure assertion fails while any forbidden specifier is still imported.
GREEN: `node --test packages/mcp/tests/errors.test.mjs packages/mcp/tests/read-only.test.mjs` passes; the server survives an unknown-identifier call and answers a following valid call in the same session.
Exit: R5's exact messages observed, R6's structural assertion green, nothing written to stdout except protocol frames.

**WU4 — Pack inclusion and clean-directory offline proof (Q5, R8, R10).**
Files: `scripts/lib/pack-packages.mjs` (add `@egdev/mcp`; #347 WU4 adds the `@egdev/system` carrier), `scripts/release-pack.mjs` (verification line for the MCP tarball and its `@egdev/system` dependency, per Q2 (a); amended by owner approval 2026-11-05), `scripts/package-release.test.mjs` (new cases), `scripts/mcp-packed.test.mjs`, root `package.json` (`test:mcp:packed`).
RED: `node --test scripts/package-release.test.mjs scripts/mcp-packed.test.mjs` → no `egdev-mcp-*.tgz` in the output folder; then, with the tarball present but its `@egdev/system` dependency absent from the packed manifest, the resolution case still fails. **(amended by owner approval 2026-11-05: Q2 (a) resolves the artifact from the carrier instead of bundling a copy, so the negative case targets the dependency.)**
GREEN: `pnpm build && pnpm release:pack` prints one line per tarball including the MCP one (five in total); both test files pass; the packed-install case queries all five tools offline from a `mkdtemp` consumer removed in teardown.
Exit: AC2 has mechanical evidence; no `workspace:` specifier survives in the packed MCP manifest (reusing #342 R3's check).

**WU5 — Client configuration examples and docs (Q6, R7, R12).**
Files: `packages/mcp/README.md` (new), one package entry in the root README only if the owner approves it in review, and the status line of this document.
RED: not applicable in the RED/GREEN sense — passive documentation plus no new executable path. Proving evidence instead: the example JSON is copied verbatim into the packed-install test (WU4) so the documented configuration is the executed one.
GREEN: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:mcp`, `pnpm test:package-release` all pass together.
Exit: Pi plus one other client example present with the packed path, and every checks entry from the issue has recorded evidence.

Owner-approved new dependencies: **`@modelcontextprotocol/sdk`** and **`zod`**, pinned to exact versions at implementation time (Q1 (a), owner approval 2026-11-05). Nothing else, and no `ajv` (Q8 option (a)). **(amended by owner approval 2026-11-05: the dependency question is answered, not pending.)**

## 5. Risks and out of scope

- **Consumed contracts (highest):** the server's output shapes are #345's artifact schema. Every field name here (`props[]`, `variants[]`, `group`, `semantics`, `available`) is a projection of decisions O1–O9, all approved on 2026-11-05 (O6 keeps token groups, O8 keeps own props only). **(amended by owner approval 2026-11-05: the rework risk from an unapproved #345 is closed; a later field rename is still a breaking change under #345 O3's `schemaVersion`.)**
- **Data / irreversible:** none written. The server only reads; a bug misdescribes the design system to an agent, and the contract test (R9) is the only guard against a plausible-but-wrong projection.
- **Security:** a stdio server is spawned by the client with the user's privileges. The mitigation is structural: no network, no writes, no shell-out, no dynamic code loading, and the artifact path is the only input. The SDK's transitive `express`/`hono` presence is a larger audit surface than a stdio-only server needs (Q1).
- **Delivery / environment:** AC2 is unprovable until #342's `release:pack` exists; Q5 (a) is approved, so #342 R1 names the five-package release set and no separate packing truth is produced. **(amended by owner approval 2026-11-05.)** CI is disabled, so nothing re-runs these checks automatically. The packed-install test needs a warm pnpm store or a network-enabled first run (`EGDEV_CONSUMER_OFFLINE=1` only helps after that, `scripts/package-consumption.test.mjs:9302-9305`).
- **Concurrency:** none new. The pack output folder is written by `release:pack` (#342 already lists interleaving as its risk); the MCP tarball does not add a second writer.
- **Two MCP surfaces for one design system:** Storybook already serves docs over HTTP `.storybook/main.ts:281-285` while #346 serves artifact data over stdio. A user may connect both and get overlapping answers; the division of labour belongs to #344's guide, and this document only fixes the stdio side.
- **Protocol churn:** the MCP specification and SDK move quickly (`1.32.2` at drafting time). A pinned exact version plus the R9 contract tests keep a protocol break local to one upgrade, but the client examples may go stale against new Pi releases.
- **Untestable here:** a real Pi session, and any claim about how a *specific* client renders tool output. The tests prove protocol-level answers over stdio, not client UX.
- **Out of scope:** network access, HTTP/SSE transport, hosting, write or mutation tools, the `design/system.md` renderer (#347), the artifact schema and its generator (#345), tarball versioning policy (#342), the agent connection guide and Storybook MCP alignment (#344), the pilot consumer (#343), npm or GitHub Packages publication, and any token, component or dependency change not listed in Q1.

### Acceptance criteria traceability

| AC | Requirements | Planned evidence |
| --- | --- | --- |
| 1 — spec, plan and new dependencies approved | R1, R8, R11, Q1–Q8 | owner approval of this document and of the exact dependency list |
| 2 — packed clean-directory install answers each tool without network | R1, R2, R4, R5, R6, R7, R10 | WU4 packed-install case, offline; WU5 executed example config |
| 3 — responses match the artifact of the same version | R3, R4, R9 | WU2 artifact-derived comparisons, WU1 version-block assertion, WU2 negative fixture |
| Issue Checks (`typecheck`, `lint`, stdio contract tests, packed-install test) | R9, R10, R12 | WU3/WU4/WU5 command output |

## Owner approval

Approved by the owner on 2026-11-05. Q1 takes the owner's separate answer for the dependencies; every other decision takes its recommended option, per the owner's answer "Aceptar todas las recomendaciones (Recomendado)". Q3 carries one reconciliation the owner accepted as part of that answer.

| Decision | Chosen option | Source |
| --- | --- | --- |
| Q1 | (a) `@modelcontextprotocol/sdk` + `zod`, both pinned exact, direct dependencies of `packages/mcp` | "SDK MCP + zod, versión exacta (Recomendado)" (#346 Q1) |
| Q2 | (a) Runtime dependency on the artifact-owning package chosen by #345 O1 — `@egdev/system` — resolved at startup | "Paquete nuevo @egdev/system (Recomendado)" + "Aceptar todas las recomendaciones (Recomendado)" |
| Q3 | (a) The four tools from the issue, plus `get_design_system_md` per #347 P5 (a); no other extra tool (no `get_prop_naming`, no `get_version`) | "Aceptar todas las recomendaciones (Recomendado)", reconciled with #347 P5 (a) |
| Q4 | (a) Executable `egdev-mcp` on `bin` | "Aceptar todas las recomendaciones (Recomendado)" |
| Q5 | (a) Amend #342 R1 to the release set that includes `@egdev/mcp`, one folder, one run (five packages with `@egdev/system`) | "Aceptar todas las recomendaciones (Recomendado)" |
| Q6 | (a) `packages/mcp/README.md`, with #344's guide linking to it | "Aceptar todas las recomendaciones (Recomendado)" |
| Q7 | (a) Structural test on the server's imports plus an offline packed run | "Aceptar todas las recomendaciones (Recomendado)" |
| Q8 | (a) Hand-written assertions in the contract tests, as in #345 O9 (a); no `ajv` | "Aceptar todas las recomendaciones (Recomendado)" |

**Q3/P5 reconciliation (accepted by the owner).** Q3 recommended only the four issue tools, while #347 P5 recommended adding `get_design_system_md` and said Q3 must be reopened. Resolved as #347 P5 (a): the tool set is the four from the issue plus `get_design_system_md`, which returns #347's rendered `system.md` string through the carrier package's `renderSystemMd`, so the server keeps no second renderer. No further tool is authorized, so `propNaming[]` stays reachable through the artifact package, as Q3's own recommended option states. R4, R8, WU2 and WU4 record the five-tool and five-package consequences.
