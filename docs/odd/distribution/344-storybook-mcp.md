# T3 — Storybook MCP manifest aligned with the real public exports

| Field | Value |
| --- | --- |
| Issue | [#344](https://github.com/egdev6/egdev-design-system/issues/344) (operation `issue-3`) |
| Milestone | 9 — "Distribution for products and agents" |
| Proposal | `egdev-ds-distribution-v1` (roadmap index [#349](https://github.com/egdev6/egdev-design-system/issues/349)) |
| Task / specs | `odd/tasks/ds-distribution.md` T3 — S1 (milestone goal) |
| Dependencies | None; runs in parallel with #342. #344 owns the Storybook endpoint guide that #346 links to |
| Status | **Approved — owner, 2026-11-05 (see Owner approval)** |

Planning only. No source, `package.json`, token, dependency, Git or GitHub change is made by this document.

## 1. Current state (observed)

Base commit `8db0c52` on `docs/distribution-plans` (only sibling ODD drafts landed after it). Measurements below come from reading the barrels with the installed TypeScript checker and from a fresh `storybook build` written to a system temp directory (the gitignored `storybook-static/` in the worktree is a stale 2026-10-17 build with 1 component and 7 docs; it was not modified).

| Fact | Evidence |
| --- | --- |
| Endpoint and toolset are fixed: `/mcp`, docs-only, components manifest enabled | `.storybook/main.ts:281-285` (`endpoint: '/mcp'`, `toolsets: { dev: false, docs: true, test: false }`), `.storybook/main.ts:289` (`features: { componentsManifest: true }`) |
| Storybook indexes 8 MDX guides plus 95 UI and 4 effects story files | `.storybook/main.ts:276`; `docs/storybook/*.mdx` (8 files with `<Meta title>`), `find packages -name '*.stories.tsx'` → 99 |
| Authority for availability is the barrels, not stories or the catalog | `AGENTS.md:19`, `docs/ARQUITECTURA.md:14` |
| Public surface today: 176 value exports, of which 158 are components (153 UI, 5 effects) | `packages/ui/src/index.ts:1-231` (126 export statements), `packages/effects/src/index.ts:1-8`; counted with `getExportsOfModule` + `getAliasedSymbol`, excluding type-only exports, `cn` and lowercase recipe helpers |
| The full export-name list is already pinned once, so a new export already turns another suite RED | `scripts/package-exports.test.mjs:5295-5785` (489 names, generated from the built `dist/index.d.ts`) |
| Current manifest from a fresh build: 99 components, 8 docs, 5 components with declared subcomponents, 874 stories, 106 docs entries in `/index.json` (98 autodocs + 8 standalone) | temp `manifests/components.json`, `manifests/docs.json`, temp `index.json` (not committed) |
| Only 97 of the 158 exported components are reachable from the manifest by name; 61 are absent (footer/topbar/list-item/panel/popover/dialog/live-band/timeline parts, `Slottable`, `HomeTemplateAnchor`, …) | the same build; subcomponent keys exist only under 5 parents (`molecules-alertdialog`, `molecules-collapsible`, `molecules-dialog`, `molecules-panel`, `molecules-popover`) |
| Two manifest anomalies the test must model, not hide: a docs-only "component" `recipes-scene-recipes` (`name: "Scenerecipes"`, `error: "No component found"`) and the generic display name `Table<Row>` for `molecules-table` | temp `components.json`; `packages/ui/src/recipes/scene-recipes.stories.tsx:31-34` has no `meta.component` |
| The current smoke test encodes the historical Gauge-only contract: 7 hardcoded guides, Gauge as the only React component, one docs-show, an 8-story allowlist | `scripts/storybook-mcp.test.mjs:73-83` (7 guides), `:84-120` ("exactly seven standalone docs pages and Gauge autodocs", "Gauge must remain the only React component"), `:260` title, `:338-366` |
| It omits the `Foundations/Scene recipes` guide, which is indexed today | `docs/storybook/scene-recipes.mdx:3` (`<Meta title="Foundations/Scene recipes" />`) vs the 7-entry list at `scripts/storybook-mcp.test.mjs:73-83` |
| Therefore the live test is structurally RED on main, and `pnpm test:storybook-mcp` needs a running server | expectations above vs 99 components / 8 docs; endpoint default `scripts/storybook-mcp.test.mjs:5`, loopback guard `:6-12`, entry point `package.json:20` |
| The historical MCP verification and its limits are recorded (3/3 tools, loopback, no hosting, no global client config) | `docs/odd/stack-alignment.md:68-74`, `:84`, `:124-128`, `:153-155` |
| No dependency may be added without owner confirmation | `AGENTS.md:44`; `CONTRIBUTING.md:9-10` |

The logic needed already exists as a test-only pattern: the TypeScript checker enumerates real exports at `scripts/package-exports.test.mjs:5291-5294`, and `typescript` 6.0.3 is a root devDependency (`package.json:55`). No new dependency is required.

## 2. Specification

Two deliverables: an export-driven smoke test for the Storybook MCP endpoint, and an agent connection guide proven against a running server. `AC1` = the test fails when a public export is missing from the manifest and passes on main; `AC2` = connection instructions exist and were followed once.

- **R1 — One export enumeration (AC1).** A shared helper enumerates public components from both barrels through the installed TypeScript checker: value exports whose name starts uppercase, type-only exports and `cn` excluded. It is the only list in this feature; no second hand-maintained name array is introduced.
- **R2 — Bidirectional manifest reconciliation (AC1).** `docs-list` must list every documented export and nothing unregistered. Each manifest component id/name is either traceable to a public export plus its story file, or present in one reviewed exception registry with a reason; each public export is either reachable from the manifest (top-level component or declared subcomponent) or registered as undocumented with a reason. Any unregistered difference fails and names the offending entries.
- **R3 — Identity rules (AC1).** Component ids are the lowercased, dash-normalised story title slug (`Foundations/Scene recipes` → `foundations-scene-recipes`); ids are asserted exactly. Names are compared after stripping generic parameters (`Table<Row>` → `Table`) and only through the exception registry for entries with no component (the scene-recipe page). Slug and normalisation are pinned by fixtures, not by per-component lists.
- **R4 — Docs section derived from MDX (AC1).** The `# Docs` section expectations are derived from `<Meta title>` in `docs/**/*.mdx`: exactly 8 entries today, including `foundations-scene-recipes--docs`; story autodocs never appear there. The hardcoded 7-entry list is removed.
- **R5 — Story ids are live-checked (AC1).** With `withStoryIds: true`, every advertised story id exists in `/index.json` as `type: 'story'` and belongs to its component's slug; every listed component advertises at least one story. No per-component story allowlist survives (Gauge's eight-story list is deleted).
- **R6 — Deterministic negative regressions, no server (AC1).** The reconciliation and slug functions are tested with synthetic manifests: a removed export that a story documents, an unexpected component, a missing docs page, an extra docs page, a story id absent from the index, and an unregistered undocumented export. This is the mechanical form of the issue's "fails when a public export is missing from the manifest".
- **R7 — Live guarantees preserved (AC1).** The live smoke keeps the credential-free loopback guard, the exact docs toolset (`docs-list`, `docs-show`, `docs-show-story` only), a docs-show content assertion for a deterministic sample and preview HTML for sampled story ids. Toolset names are asserted, not the historical component list.
- **R8 — One entry point (AC1, AC2).** `pnpm test:storybook-mcp` runs the deterministic contract checks and the live smoke. The live part needs `pnpm storybook` on `127.0.0.1:6006` and fails with a message naming that command when the endpoint is unreachable.
- **R9 — Connection guide (AC2).** A single English page documents: how to start the dev server, the endpoint URL, the three tools with one copy-paste request sequence per tool, an HTTP MCP client configuration example, the loopback/no-auth security boundary, and troubleshooting. No global client configuration and no hosting are proposed.
- **R10 — The guide is proven once (AC2).** The documented sequence is executed against a running dev server; the observed tool names, component count and one `docs-show` id are recorded in this file's Log and quoted as PR evidence.
- **R11 — Constraint (AC1, AC2).** No dependency, token, component, Storybook config or package manifest field changes. The only `package.json` edit is the `test:storybook-mcp` command value, since D3 (a) splits the deterministic contract checks from the live smoke. **(amended by owner approval 2026-11-05: D3 = (a).)** No source file outside the test/registry/guide set is touched (`AGENTS.md:44`).

The contract is the markdown `docs-list` already produces, parsed without a second format: components are `- <Name> (<id>)` lines, their stories are indented `  - <Story> (<story-id>)` lines, and standalone guides are the `# Docs` section's `- <Title> (<docs-id>)` lines. The test parses those sections, never `components.json` directly, so it keeps proving the tool agents actually read.

### Traceability

| Acceptance criterion | Requirements | Mechanical proof |
| --- | --- | --- |
| **AC1** — the smoke test fails when a public export is missing from the manifest and passes on main | R1–R8, R11 | WU1/WU2 fixtures fail on a removed documented export and on an unregistered new export; WU3 `pnpm test:storybook-mcp` GREEN against the live server |
| **AC2** — connection instructions exist and were followed once against a running Storybook | R8–R11 | `docs/MCP.md` (D7) plus the Log entry recording the executed sequence and observed output |

The RED for AC1 is captured twice on purpose: offline, a synthetic manifest is missing a documented export (deterministic, repeatable); online, the current test is already RED on main because it asserts 8 catalog entries and 7 guides against 99 components and 8 docs.

## 3. Decisions for the owner

| # | Question | Options | Recommendation |
| --- | --- | --- | --- |
| D1 | How strict is export coverage, given 61 exported components are invisible in the manifest today? | (a) reviewed registry of documented/undocumented exports, enforced in both directions; (b) document all 158 now by adding `component`/`subcomponents` metas and stories; (c) assert only the documented set, with no coverage of undocumented exports | **(a)** — it makes AC1 real (adding an export without docs, or removing a documented export, fails) without turning T3 into a 61-component documentation project. (b) is the honest long-term fix but changes story sources far beyond this issue; (c) leaves AC1 unprovable for new exports. |
| D2 | Where does the exception registry live? | (a) new `scripts/storybook-mcp-exceptions.json` validated by the test; (b) inline in `scripts/storybook-mcp.test.mjs`; (c) extend the existing pinned list in `scripts/package-exports.test.mjs` | **(a)** — ~65 entries with reasons are reviewable as data, diff cleanly, and can later be read by #345/#346 without importing test code. (b) buries a reviewed decision inside a 600-line test; (c) overloads a suite that verifies build artifacts. |
| D3 | Test file layout? | (a) `scripts/storybook-mcp-contract.mjs` (pure functions) + `scripts/storybook-mcp-contract.test.mjs` (fixtures) + existing `scripts/storybook-mcp.test.mjs` (live); (b) keep one file and require a server for every run; (c) live-only file | **(a)** — the RED for R6 must run without a server; today any run of the single file needs one. (b) makes test-first evidence unavailable offline; (c) loses the deterministic regressions. |
| D4 | How are docgen identity anomalies handled? | (a) normalise generics and register the component-less recipe page as a manifest-only exception; (b) fix the story sources so docgen produces clean names (`Table`, a real `component` for the recipe page); (c) compare ids only and stop asserting names | **(a)** — no source change outside the test, and the anomaly stays visible as a reviewed entry instead of silently disappearing. (b) is better documentation but is a Storybook/source change outside this issue's Includes; (c) would let a component be documented under the wrong name. |
| D5 | How deep is the live check? | (a) all advertised ids checked against the index, plus `docs-show`/preview for a deterministic sample (one per level + Gauge + one effects component); (b) `docs-show` for all 99 components and preview for all 874 stories; (c) lists only, no `docs-show` | **(a)** — bounded runtime (each request has a 3 s timeout today) while still proving the docgen/description pipeline and the preview route. (b) is slow and brittle for zero extra contract; (c) drops the guarantee `stack-alignment.md:153-155` asks for. |
| D6 | What happens when no Storybook is running? | (a) the live test fails fast naming `pnpm storybook`; (b) auto-skip the live test when the endpoint is unreachable; (c) require `STORYBOOK_MCP_URL` to be set explicitly | **(a)** — AC1/AC2 both require a real run; a silent skip can hide a manifest regression. The deterministic half still runs offline because of D3. The trade-off to accept: `pnpm test:storybook-mcp` is a two-terminal check, exactly as it is today. |
| D7 | Where does the connection guide live? | (a) `docs/MCP.md`, linked from `README.md` and `CONTRIBUTING.md`; (b) `docs/agents/storybook-mcp.md` (new folder); (c) a section inside `docs/ARQUITECTURA.md` | **(a)** — cross-client narrative in one discoverable page, and #346's package-specific examples stay in `packages/mcp/README.md` as its Q6 recommends. (b) adds a folder for one page; (c) mixes agent operational steps into an architecture document. |
| D8 | Dependency for reading the barrels? | (a) the existing root `typescript` devDependency; (b) regex parsing of `export` statements with no tooling; (c) a new AST/parser dependency | **(a)** — already installed (`package.json:55`), already used this way at `scripts/package-exports.test.mjs:5291-5294`, and it resolves `export *` correctly; (b) breaks on barrels that re-export 60 nested modules; (c) is an unapproved dependency for no benefit. **No dependency is added either way.** |

## 4. Implementation plan

Work units are sequenced; each stays under ~400 changed lines. Validation commands are run in the foreground from the repo root.

File layout as approved (D2 (a), D3 (a), D7 (a); amended by owner approval 2026-11-05):

```text
scripts/storybook-mcp-contract.mjs        new   pure expectation + reconciliation functions
scripts/storybook-mcp-contract.test.mjs   new   deterministic fixtures, no server
scripts/storybook-mcp-exceptions.json     new   reviewed manifest-only / undocumented entries
scripts/storybook-mcp.test.mjs            edit  live smoke over the derived contract
package.json                              edit  test:storybook-mcp value only (no dependency field)
docs/MCP.md                               new   agent connection guide
README.md, CONTRIBUTING.md                edit  one link line each
docs/odd/distribution/344-storybook-mcp.md edit Log entry with the live evidence
```

**WU1 — Contract helper and deterministic regressions (R1, R3, R6).**
Files: `scripts/storybook-mcp-contract.mjs` (new), `scripts/storybook-mcp-contract.test.mjs` (new). Parse the barrels with the installed checker, derive slugs, join story metas (`title` + `component`/`subcomponents`) to ids, and expose the reconciliation function plus its diagnostics.
RED: `node --test scripts/storybook-mcp-contract.test.mjs` — new fixtures fail to load/assert (module absent, then a deliberately removed documented export not detected). Then add the assertions one rule at a time and observe each failure.
GREEN: same command passes; fixtures cover removed export, unexpected component, wrong name generic, slug edge cases.
Exit condition: the helper reports the current base state as exactly 99 manifest entries / 8 docs with only registered exceptions, and every negative fixture fails for the intended reason.

**WU2 — Exception registry and reconciliation of the real base state (R2, R3).**
Files: `scripts/storybook-mcp-exceptions.json` (new), `scripts/storybook-mcp-contract.test.mjs` (extend).
RED: add a fixture where an export listed as documented disappears from a synthetic manifest, and one where a new unregistered export appears; both must fail before the registry wiring.
GREEN: `node --test scripts/storybook-mcp-contract.test.mjs` passes while reconciling the real barrels: 158 exported components = 97 reachable + 61 registered undocumented (each with a reason), plus the manifest-only `recipes-scene-recipes` entry.
Exit condition: adding one export, or removing one documented export, fails with the component name; the registry contains only names that still exist.

**WU3 — Live smoke rewritten to the derived contract (R4, R5, R7, R8).**
Files: `scripts/storybook-mcp.test.mjs` (rewrite of the hardcoded sections), `package.json` (only the `test:storybook-mcp` value if D3 = (a)).
RED: with `pnpm storybook` running, the current file against the current server must be observed failing (7 guides / Gauge-only expectations vs 8 docs / 99 components) before the rewrite; the new assertions are then added.
GREEN: `node --test scripts/storybook-mcp.test.mjs` and `pnpm test:storybook-mcp` pass against the running server.
Exit condition: no hardcoded component or story list remains; the docs section is 8 MDX-derived entries; sampled `docs-show`/preview calls pass; failure without a server names `pnpm storybook`.

**WU4 — Agent connection guide and recorded proof (R9, R10).**
Files: `docs/MCP.md` (new, per D7), plus one link line in `README.md` and `CONTRIBUTING.md`, and this file's Log.
Verification exception: documentation, no meaningful RED. Structural verification: the guide's fenced commands are copied verbatim into the shell, `pnpm storybook` is started, each documented request is executed once, and the observed output (tool names, component count, one `docs-show` id) is written to the Log.
Exit condition: guide exists in English, every command in it was executed, and the Log records the live result; `pnpm lint` and `pnpm typecheck` stay green.

**Dependencies:** none added. `typescript` is already installed; the guide uses only shell/HTTP examples already exercised by the test.

**Guide outline (R9, written in WU4):** prerequisites (`pnpm install`, `pnpm tokens`, Node 24); start `pnpm storybook` and open `http://127.0.0.1:6006`; the endpoint is `http://127.0.0.1:6006/mcp` with the docs toolset only; one request sequence per tool (`initialize` → `notifications/initialized` → `tools/list` → `tools/call`); one client configuration example pointing at that URL; the security boundary (loopback, no auth, never host or tunnel it); troubleshooting for the two observed failures (no server → connection refused; Storybook 8 → `initialize` HTTP 404, `docs/odd/stack-alignment.md:72-74`).

**Validation of the finished issue:** `pnpm storybook` in one terminal, then `pnpm test:storybook-mcp`, `node --test scripts/storybook-mcp-contract.test.mjs`, `pnpm lint`, `pnpm typecheck`, plus the one live query copied from the guide whose output is recorded in the Log.

## 5. Risks and out of scope

- **Data/irreversible:** none; the change is tests, one JSON registry and docs. The stale gitignored `storybook-static/` build is not touched; a fresh temp build was used only for observation.
- **Security:** the endpoint has no authentication and is loopback-only. The guide must state that exposing it beyond `127.0.0.1` is unsupported, and the smoke keeps rejecting non-loopback or credentialed URLs (`scripts/storybook-mcp.test.mjs:5-12`).
- **Consumed contracts:** `pnpm test:storybook-mcp` becomes stricter, and its meaning as a two-terminal live check is preserved. The exception registry is a new reviewed artifact; #345's data artifact and #346's server may later read it, so its shape is a forward-compatible decision (D2).
- **Concurrency:** the live test assumes a single Storybook on port 6006 and shares it with browser inspection; parallel runs on the same port would collide. Per-request timeout stays at 3 s and the sample (D5) keeps total runtime bounded.
- **Delivery/environment:** the live half cannot run offline, and there is no CI (out of scope), so GREEN evidence depends on the parent starting Storybook in the foreground. Docgen anomalies (`Table<Row>`, `No component found`) come from Storybook 10.6.1 behaviour, not from this repo's code, and can change with an addon upgrade.
- **Untestable:** "the guide was followed once" is a recorded manual run, not an automated assertion; the Log entry is the evidence. The 61 undocumented exports remain a documentation gap by design (D1 option a) and are named, not fixed.
- **Out of scope:** hosting Storybook or exposing the endpoint publicly; enabling the `dev`/`test` toolsets; the `@egdev/mcp` package (#346); the data artifact (#345); `design/system.md` (#347); tarball versioning and packing (#342); the pilot consumer (#343); npm/GitHub Packages publication; enabling CI; adding stories or `subcomponents` to fix the 61 undocumented exports; any token, component, Storybook config or dependency change.

## Owner approval

Approved by the owner on 2026-11-05. Every decision below takes its recommended option, per the owner's answer "Aceptar todas las recomendaciones (Recomendado)". No dependency is added by any of the eight answers.

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) Reviewed registry of documented/undocumented exports, enforced in both directions | "Aceptar todas las recomendaciones (Recomendado)" |
| D2 | (a) New `scripts/storybook-mcp-exceptions.json` validated by the test | "Aceptar todas las recomendaciones (Recomendado)" |
| D3 | (a) `scripts/storybook-mcp-contract.mjs` (pure functions) + `scripts/storybook-mcp-contract.test.mjs` (fixtures) + the existing live test | "Aceptar todas las recomendaciones (Recomendado)" |
| D4 | (a) Normalise generics and register the component-less recipe page as a manifest-only exception | "Aceptar todas las recomendaciones (Recomendado)" |
| D5 | (a) All advertised ids checked against the index, plus `docs-show`/preview for a deterministic sample | "Aceptar todas las recomendaciones (Recomendado)" |
| D6 | (a) The live test fails fast naming `pnpm storybook` | "Aceptar todas las recomendaciones (Recomendado)" |
| D7 | (a) `docs/MCP.md`, linked from `README.md` and `CONTRIBUTING.md`; #346's package examples stay in `packages/mcp/README.md` (its Q6 (a)) | "Aceptar todas las recomendaciones (Recomendado)" |
| D8 | (a) The existing root `typescript` devDependency | "Aceptar todas las recomendaciones (Recomendado)" |

Amendments recorded in place: R11 and the §4 file layout now state the approved D3 (a) split and the fixed paths. #346 Q6 (a) keeps the package-specific MCP examples in `packages/mcp/README.md`, so `docs/MCP.md` links to them instead of repeating them.
