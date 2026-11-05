# T4 — Versioned design system data artifact

| Field | Value |
| --- | --- |
| Issue | [#345](https://github.com/egdev6/egdev-design-system/issues/345) (operation `issue-4`) |
| Milestone | 9 — "Distribution for products and agents" |
| Proposal | `egdev-ds-distribution-v1` (roadmap index [#349](https://github.com/egdev6/egdev-design-system/issues/349)) |
| Task / specs | `odd/tasks/ds-distribution.md` T4 — S1 (milestone goal), S4 (`@egdev/mcp`), S5 (`design/system.md`) |
| Dependency | #342 (T1) — the artifact must ship in, or alongside, the versioned tarballs |
| Consumers | #346 (MCP server), #347 (`design/system.md` renderer) |
| Status | **Approved — owner, 2026-11-05 (see Owner approval)** |

Planning only. No source, `package.json`, token, dependency, Git or GitHub change is made by this document.

## 1. Current state (observed)

- The catalog already has a generator and a machine-readable output: `scripts/catalog_data.py:1-2` declares the row tuple and its keys, `scripts/build_catalog.py:8` writes `docs/catalog.json` (115 rows) and `docs/CATALOGO.md`. There is no other artifact today.
- Tokens have no structured export by decision: `packages/tokens/README.md:3` ("no hay JSON ni generadores propios") and `:44` defer any structured query; `docs/ARQUITECTURA.md:72` repeats that a future MCP query is outside T1/T2. The single source is `packages/tokens/src/theme.css` with three blocks — `@theme static` (`:11`), `:root` (`:409`), `@theme inline static` (`:537`) — 292 declarations observed via the existing reader.
- A block-agnostic CSS declaration reader already exists: `packages/tokens/scripts/token-css.mjs:1-2,12` (`extractDeclarations`) plus duplicate/alias/cycle helpers, used by `packages/tokens/tests/token-contract.test.mjs:5-12`. It flattens blocks and carries no values.
- Public availability is the barrels: 60 `export *` statements plus explicit named exports in `packages/ui/src/index.ts:1-231`; four exported value components in `packages/effects/src/index.ts:1-8`. `docs/MATERIAL.md` and the catalog are explicitly not availability proof (`docs/MATERIAL.md:44`).
- Prop extraction tooling is already installed at the root: `package.json:51` `react-docgen-typescript` 2.4.0, driven by Storybook (`:55` `typescript` 6.0.3, `.storybook/main.ts:291-308`). `react-docgen-typescript` imports programmatically (`parse`, `withCompilerOptions`) with no new dependency.
- Public-export enumeration through the TypeScript checker already exists: `scripts/package-exports.test.mjs:5291-5294` (`createProgram` → `getExportsOfModule`).
- Prop naming is a generated view over a JSON source: `skills/_shared/prop-naming.json` (162 entries) → `docs/prop-naming.md:3` ("Generated … Do not edit"), written by `scripts/prop-naming.mjs` with a `--check`/`--write` CLI (`:309,342`). The same CLI shape is the repo's established pattern for "generate, or verify without writing".
- Material recipes are prose plus illustrative CSS blocks (`docs/MATERIAL.md:42-74`) and the Gauge-only exception (`:83`); they are not structured data.
- Build/test entry points: `package.json:10-27` (`build`, `test`, `test:package-exports`, `props:check`, `tokens`, `pnpm -r` recursion over `packages/**`). There is no `release:pack` yet — it is T1's deliverable.

## 2. Specification

One committed-or-generated JSON artifact, produced only from the sources above, describing the design system of one exact version set. Requirements are numbered; `AC1..AC3` are the issue's acceptance criteria.

**R1 — Artifact identity and location (AC1).** A single UTF-8 JSON file named `design-system.json`, LF endings, 2-space indent, trailing newline, no timestamps, absolute paths, hostnames or environment values. Its repository location is `packages/system/design-system.json`, carried by the data-only package `@egdev/system` (O1 (b), approved 2026-11-05); the schema below is independent of that choice. **(amended by owner approval 2026-11-05.)**

**R2 — Schema (AC1).** Top-level object with exactly these keys: `name` (`"egdev-design-system"`), `schemaVersion` (semver string, decision O3), `packages` (array), `catalog` (array), `components` (array), `tokens` (array), `materialRecipes` (array), `propNaming` (array). Every entry carries only the documented fields; unknown fields are a drift-test failure.

- `packages[]`: `{ "name": "@egdev/tokens"|"@egdev/ui"|"@egdev/effects", "version": "<semver from that package.json>" }`, sorted by name.
- `catalog[]`: `{ name, level, package, radix, composes[], action, available }` for rows whose `destino` is `ui` or `effects`; `available` follows O4 (a). **(amended by owner approval 2026-11-05.)**
- `components[]`: `{ name, package, source, props[], variants[] }` sorted by `name`; `props[]` = `{ name, type, required, default, description, deprecated }` (decision O8); `variants[]` = `{ name, classes[] }` for exported CVA recipes found in the component's `types.ts`.
- `tokens[]`: `{ name, value, group }` sorted by `name`; `group` ∈ `theme` | `root` | `inline`, taken from the CSS block the declaration appears in (decision O6).
- `materialRecipes[]`: `{ id, semantics, tokens[] }` sorted by `id`.
- `propNaming[]`: `{ id, name, status, components[] }` sorted by `id`, derived from `skills/_shared/prop-naming.json` usages.

Abbreviated shape (not the literal file):

```json
{
  "name": "egdev-design-system",
  "schemaVersion": "1.0.0",
  "packages": [{ "name": "@egdev/ui", "version": "0.1.0" }],
  "catalog": [{ "name": "Gauge", "level": "atom", "package": "@egdev/ui", "radix": "— (native role=meter)", "composes": [], "action": "mantener", "available": true }],
  "components": [{ "name": "Gauge", "package": "@egdev/ui", "source": "packages/ui/src/atoms/gauge/types.ts", "props": [], "variants": [] }],
  "tokens": [{ "name": "--color-surface-0", "value": "#141518", "group": "theme" }],
  "materialRecipes": [{ "id": "well", "semantics": "Recessed fill.", "tokens": ["--color-surface-0", "--shadow-well"] }],
  "propNaming": [{ "id": "accessible-name", "name": "label", "status": "approved", "components": ["Gauge"] }]
}
```

**R3 — Catalog section (AC1, AC3).** Derived from `docs/catalog.json` (i.e. from `scripts/catalog_data.py` via the existing generator). No new parser for the Python source and no hand-maintained catalog copy.

**R4 — Props section (AC1, AC3).** For every public value export of `@egdev/ui` and `@egdev/effects`, the generator runs `react-docgen-typescript` against that component's `types.ts` with the same extraction options Storybook uses (`.storybook/main.ts:291-308`), then keeps only own props (decision O8). Components without a `types.ts` (pure re-exports such as `Slot`) record `props: []` and are still listed.

**R5 — Tokens section (AC1, AC3).** Derived from `packages/tokens/src/theme.css` by reusing/extending `packages/tokens/scripts/token-css.mjs` so each declaration keeps its block group. Values are copied verbatim; the artifact never becomes a second source of token values and no token is added, renamed or changed.

**R6 — Material recipes section (AC1).** A small curated table inside the generator (O5 (a), approved 2026-11-05) naming the Material recipes of `docs/MATERIAL.md` and the tokens each depends on. The drift test asserts every listed recipe id appears in `docs/MATERIAL.md` text and every referenced token exists in `tokens[]`.

**R7 — Prop naming section (AC1).** Derived from `skills/_shared/prop-naming.json` only (not from the rendered `docs/prop-naming.md`). Each usage's component name must exist in `components[]`.

**R8 — Version set (AC2).** `packages[]` is read from the three `packages/*/package.json` versions at generation time (`packages/tokens/package.json:3` 0.3.0, `packages/ui/package.json:3` 0.1.0, `packages/effects/package.json:3` 0.1.0 today). The artifact must never carry a version it does not describe.

**R9 — Determinism.** Two consecutive generations from unchanged sources produce byte-identical output; ordering rules in R2 are total and locale-independent (plain `<` comparison, as in `scripts/prop-naming.mjs:9-15`).

**R10 — Build integration (AC2).** A root script generates the artifact (`--write`) and verifies it (`--check`), mirroring `scripts/prop-naming.mjs:309,342`; the generative step joins `pnpm build` only in the form T1 authorizes, and `release:pack` (#342) must carry the artifact in its tarball. Public docs describing the artifact and the deferred structured-token query are updated per decision O7.

**R11 — Drift test (AC3).** One test file fails when the artifact and the sources disagree, covering at minimum: (a) every public value export of `packages/ui/src/index.ts` and `packages/effects/src/index.ts` has a `components[]` entry; (b) every own prop reported by docgen exists with the same `type`, `required` and `default`, and the artifact has no prop the source does not; (c) every `--*` declaration in `packages/tokens/src/theme.css` exists in `tokens[]` with the same value and group, and the artifact has no extra token; (d) every `ui`/`effects` catalog row is present; (e) `--check` on the checked-in/expected bytes. Assertions compare through the generated public output, never internal storage; a negative fixture proves each check fails when an entry is removed.

**R12 — No scope creep.** The generator reads sources and writes one JSON artifact plus its own tests/docs. It does not modify components, tokens, catalog data, the naming registry, dependencies or Material prose.

## 3. Decisions for the owner

| # | Question | Options | Recommendation |
| --- | --- | --- | --- |
| O1 | Where does `design-system.json` live and ship? | (a) inside `@egdev/ui` as a new subpath export; (b) a new data-only package (e.g. `@egdev/system`) with `files: ["design-system.json"]`; (c) root `release/` output attached by T1's packing step | **(b)** — the artifact spans three packages, so `@egdev/ui` cannot own a tokens/Material/effects description without misstating ownership, and #346/#347 need one stable specifier. Cost: T1 must add a fourth package to `release:pack`. |
| O2 | Is the artifact committed? | (a) committed, with `--check` in tests; (b) build-only, tests generate into a temp dir and compare two runs | **(a)** — reviewers see schema changes as diffs and #346/#347 can develop offline; mitigates the "generated file churn" cost with R9 determinism. |
| O3 | How is the artifact versioned? | (a) `schemaVersion` (shape) + described package versions only; (b) own semver bumped with each release set; (c) no version field | **(a)** — shape changes and content changes have different blast radii, and #342 owns release versioning. |
| O4 | What decides `available` in `catalog[]`? | (a) join catalog rows with the public barrels; rows without a matching export are `available: false`; (b) copy the prose `accion`/`notas` verbatim and mark nothing; (c) omit unavailable rows | **(a)** — AGENTS.md makes the barrels authoritative and the catalog provisional. |
| O5 | How are Material recipes structured? | (a) curated table in the generator, validated against `docs/MATERIAL.md` and `tokens[]`; (b) parse the Markdown/CSS blocks of `docs/MATERIAL.md`; (c) make MATERIAL.md generated from a new JSON source | **(a)** — it is the "derive from existing generators rather than new parsers" line, and (c) inverts document authority. |
| O6 | How are token groups modelled? | (a) extend `token-css.mjs` with a block-aware reader and record `group`; (b) flatten to `name`/`value` and drop the block; (c) also export resolved alias values | **(a)** — grouping is what makes `@theme` vs `:root` vs inline meaningful for consumers; alias resolution is speculative (see Risks). |
| O7 | What happens to the legacy Spanish statements that defer the structured token query (`packages/tokens/README.md:44`, `docs/ARQUITECTURA.md:72`)? | (a) leave both untouched and document the resolution in the new artifact docs; (b) edit those two sentences in place (Spanish); (c) edit them and translate both files to English | **(a)** — both sentences remain literally true (no JSON inside `@egdev/tokens`) and AGENTS.md forbids translating legacy content outside the authorized scope; #342 owns package READMEs. |
| O8 | Which props are recorded? | (a) own props only, plus CVA recipe classes; (b) own + inherited native/Radix props; (c) own props only, no variants | **(a)** — matches what the component promises and what #346/#347 need; inherited props are already documented by React/Radix. |
| O9 | Schema validation | (a) hand-written validator assertions in the drift test; (b) add `ajv` + a JSON Schema file as a new dependency; (c) no validation | **(a)** — no new dependency, and the checks in R11 are stronger than schema conformance. **Option (b) requires explicit owner confirmation as a new dependency.** |

No other new dependency is requested: `react-docgen-typescript` and `typescript` are already root devDependencies (`package.json:51,55`).

## 4. Implementation plan

Work units are ordered; each stays within ~400 changed lines. Paths for U1–U5 implement O1 option (b) and O2 option (a) as approved on 2026-11-05. **(amended by owner approval 2026-11-05.)** Every RED run must fail for the stated reason before implementation.

**U1 — Schema, catalog and version set.**
Files: `packages/system/package.json`, `packages/system/design-system.json`, `scripts/build-artifact.mjs`, `scripts/design-system-artifact.test.mjs`, root `package.json` scripts (`artifact`, `test:artifact`).
RED: add artifact tests for R1, R2, R3, R8, R9 and run `node --test scripts/design-system-artifact.test.mjs` → fails with a missing artifact file.
GREEN: same command passes; `node scripts/build-artifact.mjs --check` exits 0 and a second `--write` produces identical bytes.
Exit: artifact contains `packages[]`, `catalog[]` and a valid empty-but-typed shell for the remaining sections.

**U2 — Tokens section.**
Files: `packages/tokens/scripts/token-css.mjs` (block-aware reader + its tests in `packages/tokens/tests/token-contract.test.mjs`), `scripts/build-artifact.mjs`, `scripts/design-system-artifact.test.mjs`.
RED: token drift tests for R5/R11(c) fail (292 declarations vs an empty `tokens[]`), and one negative fixture removes a declaration to prove detection.
GREEN: `node --test scripts/design-system-artifact.test.mjs` and `pnpm test:tokens` pass.
Exit: every declaration is present exactly once with its group and verbatim value; no token value changed.

**U3 — Props section.**
Files: `scripts/build-artifact.mjs`, `scripts/design-system-artifact.test.mjs`.
RED: export/prop drift tests for R4/R11(a)(b) fail (barrel exports not represented).
GREEN: same command passes; a negative fixture drops one prop and the test fails; two runs are byte-identical.
Exit: every public value export listed; own props match docgen for `type`, `required`, `default`.

**U4 — Material recipes and prop naming.**
Files: `scripts/build-artifact.mjs`, `scripts/design-system-artifact.test.mjs`.
RED: R6/R7/R11(d) tests fail (missing sections, unknown recipe ids, dangling naming components).
GREEN: `node --test scripts/design-system-artifact.test.mjs` and `pnpm props:check` pass.
Exit: recipes validated against `docs/MATERIAL.md` + `tokens[]`; naming derived from the JSON source.

**U5 — Build integration and docs.**
Files: root `package.json` (`artifact` wired where T1 authorizes), `packages/system/README.md`, `docs/odd/distribution/345-data-artifact.md` (status line only), artifact docs page.
RED: `node scripts/build-artifact.mjs --check` against a stale artifact fails as expected; a consumption test proves the artifact is readable from a packed tarball (deferred to T1's `release:pack` per O1).
GREEN: `pnpm build` produces the artifact and `pnpm test:artifact` passes; `pnpm exec biome check scripts/build-artifact.mjs scripts/design-system-artifact.test.mjs` clean.
Exit: build emits the artifact with the package versions it describes; documented schema matches the emitted file.

## 5. Risks

- **Consumed contracts:** `design-system.json` becomes the input of #346 and #347. Any field rename after approval is a breaking change; O3's `schemaVersion` is the only mitigation. `docs/catalog.json` and `docs/prop-naming.md` keep their own consumers and must not be re-purposed as the artifact.
- **Data / irreversible:** token names, values and groups are copied verbatim; a normalization bug would silently misdescribe the design system to agents. R9 + a two-run byte comparison are the guard, not a review of 292 values.
- **Concurrency:** three parallel writers already touch shared state (`docs/catalog.json`, `docs/prop-naming.md`, the artifact). The artifact must be generated by a single writer and never hand-edited; `--check` in tests catches drift but not simultaneous writes.
- **Delivery / environment:** the artifact's catalog depends on `docs/catalog.json`, whose regeneration needs `python3` (`docs/CATALOGO.md:6`); `pnpm build` today needs no Python. Adding that dependency to the build is an environment change that needs explicit approval, and it must not be silently skipped. T1's `release:pack` does not exist yet, so "ships with the versioned packages" is unverifiable until #342 lands. CI is disabled, so freshness depends on local discipline plus `--check`.
- **Untestable here:** no browser, accessibility or AT evidence is produced; whether the schema is actually usable by an MCP client (#346) or by gentle-design (#347) cannot be proven in this task. Alias resolution (O6 option c) and inherited-prop completeness (O8 option b) are deliberately out of the testable surface.
- **Security:** the generator reads only in-repo sources and writes one in-repo artifact plus temp-dir scratch output; tests create temp directories outside the worktree and remove them. No secrets, network or user-home paths.

## 6. Out of scope

`@egdev/mcp` (#346), `design/system.md` (#347), token value or name changes, new tokens, new dependencies (O9 (a) adds none), the MCP connection guide (#344), the tarball/versioning policy itself (#342), npm or GitHub Packages publication, enabling CI, catalog reclassification, component changes, Material prose edits and any Git or GitHub operation.

## Owner approval

Approved by the owner on 2026-11-05. O1 takes the owner's separate answer for the artifact package; every other decision takes its recommended option, per the owner's answer "Aceptar todas las recomendaciones (Recomendado)".

| Decision | Chosen option | Source |
| --- | --- | --- |
| O1 | (b) A new data-only package `@egdev/system` with `files: ["design-system.json"]` | "Paquete nuevo @egdev/system (Recomendado)" |
| O2 | (a) Committed, with `--check` in tests | "Aceptar todas las recomendaciones (Recomendado)" |
| O3 | (a) `schemaVersion` (shape) + the described package versions only | "Aceptar todas las recomendaciones (Recomendado)" |
| O4 | (a) Join catalog rows with the public barrels; rows without a matching export are `available: false` | "Aceptar todas las recomendaciones (Recomendado)" |
| O5 | (a) Curated table in the generator, validated against `docs/MATERIAL.md` and `tokens[]` | "Aceptar todas las recomendaciones (Recomendado)" |
| O6 | (a) Extend `token-css.mjs` with a block-aware reader and record `group` | "Aceptar todas las recomendaciones (Recomendado)" |
| O7 | (a) Leave both legacy Spanish sentences untouched and document the resolution in the new artifact docs | "Aceptar todas las recomendaciones (Recomendado)" |
| O8 | (a) Own props only, plus CVA recipe classes | "Aceptar todas las recomendaciones (Recomendado)" |
| O9 | (a) Hand-written validator assertions in the drift test; no `ajv` | "Aceptar todas las recomendaciones (Recomendado)" |

Consequence of O1 (b), recorded here because the decision table must not be rewritten: O1's option text prices the choice as "T1 must add a fourth package to `release:pack`". The released set is five packages — `@egdev/tokens`, `@egdev/ui`, `@egdev/effects`, `@egdev/system`, `@egdev/mcp` — because #346 Q5 (a) also put `@egdev/mcp` in the same `release:pack` run, and #347 P1 (a) makes `@egdev/system` carry the `system.md` renderer and its golden as well as this artifact. `packages[]` inside the artifact keeps describing the three design-system packages whose versions it reports (R8).
