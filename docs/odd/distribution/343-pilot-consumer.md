# T2 — Isolated pilot consumer installed from local tarballs

| Field | Value |
| --- | --- |
| Issue | [#343](https://github.com/egdev6/egdev-design-system/issues/343) (operation `issue-2`) |
| Milestone | 9 — "Distribution for products and agents" |
| Proposal | `egdev-ds-distribution-v1` (roadmap index [#349](https://github.com/egdev6/egdev-design-system/issues/349)) |
| Task / specs | `odd/tasks/ds-distribution.md` T2 — S1 (milestone goal), S2 (local packaging first) |
| Dependency | #342 (T1) — tarballs and install guide. Its decisions D1–D7 are approved (2026-11-05; see `docs/odd/distribution/342-local-tarballs.md` § Owner approval), including D5's React peer range, so this document inherits them instead of assuming them **(amended by owner approval 2026-11-05)** |
| Consumers | #348 (T7 observed gentle-design walkthrough) reads this pilot's evidence |
| Status | **Approved — owner, 2026-11-05 (see Owner approval)** |

Planning only. This document makes no source, manifest, token, dependency, Git or GitHub change.

## 1. Current state (observed)

- No pilot or example app exists: `ls examples` → absent, and the workspace covers only packages (`pnpm-workspace.yaml:2`). The only consumer fixtures are template strings compiled into one test (`scripts/package-consumption.test.mjs:30`, `:5062`, `:5538`, `:7341`, `:8978`).
- That test already proves packed installation, strict typecheck, SSR, CSR and both CSS modes inside `mkdtemp`, removed on failure too (`:9233-9241` pack, `:9244-9267` fixture and overrides, `:9286-9299` both CSS entries plus pnpm pin, `:9322` teardown). CSR runs in jsdom (`:7341`), so there is no real browser, layout or viewport evidence anywhere in the repository.
- No browser automation is installed: root devDependencies (`package.json:29-73`) contain no Playwright or Puppeteer. Browser evidence comes from the external Playwright MCP server and is stored as ignored artifacts (`.gitignore:9-11`) with per-capture metadata (`.playwright-mcp/button-board--dark--1280.json`: viewport, theme, `screenshotSha256`), on the rule that such proposals are not approval (`docs/design/README.md:11`); example record at `docs/odd/m3-component-inventory.md:324`.
- Only one colour theme exists: "Único tema de color: EGDDEV Foundation (oscuro). No se añade un tema claro." (`packages/tokens/src/theme.css:16`). No `data-theme`, `.dark` or `prefers-color-scheme` rule exists in the token sources. The repo already has the rule for this situation: record light as not applicable, never fabricate it (`docs/components/section-shell/v0.1/implementation-plan.md:124`).
- Both consumer CSS modes are documented twice: `docs/ARQUITECTURA.md:77-86` and `packages/tokens/README.md:24-35`. Native mode needs the built artifact (`packages/tokens/package.json:7`, `packages/tokens/README.md:15`, `dist` ignored at `.gitignore:2`).
- `@egdev/ui` ships a precompiled stylesheet that already contains its CVA utilities: export at `packages/ui/package.json:13`, built from `packages/ui/src/styles/compiled.css:5-8` (`@import "./index.css"`, `@reference "@egdev/tokens/theme.css"`, `@source` over production `types.ts` files) and emitted as `styles.css` by `packages/ui/vite.styles.config.ts:15-16`. A consumer does not need Tailwind to scan the package.
- Page composition is public: `WebSection` at `packages/ui/src/index.ts:185-186`, `WebTemplate` at `:229-230`. `WebTemplate` owns the skip link and the single `main` (`packages/ui/src/templates/web-template/WebTemplate.tsx:10-21`) and rejects a nested main (`types.ts:5,15`); `WebSection` is passive with fixed slot order header/media/body/actions/social (`packages/ui/src/organisms/web-section/useWebSection.ts:25`).
- `release:pack` and the install guide do not exist yet: `package.json:10-27` has `build`, `test:package-*`, `tokens`, no release entry. #342 adds them, with open decisions on output folder (D4), version coupling (D3) and React peer range (D5).
- The React peer `>=18.0.0` (`packages/ui/package.json:58-59`) is wider than the tested matrix (`scripts/package-consumption.test.mjs:13-16`). Reconciling it belongs to #342 WU3/D5; the pilot must not re-decide it.
- `pnpm test` is Vitest only (`package.json:12`) and packed-consumer checks are separate `node --test` scripts (`:21-22`), so the pilot needs its own entry point.
- No dependency may be added and no token value changed without owner confirmation (`AGENTS.md:44`).

## 2. Specification

The pilot is generated into a fresh system temp directory outside the worktree by one script, installed only from the three local tarballs, built twice (Tailwind v4 and native CSS), and inspected in a browser. `AC1`–`AC3` are the issue's acceptance criteria.

**R1 — Reproducible generator (AC1).** One root script creates the app under `mkdtemp` outside the worktree, using only tool versions already pinned in this repository (`package.json:5,7,29-73`), and removes the directory at the end including on failure. It writes no state inside the repository and leaves no cache path tracked by `git status`.

**R2 — Install only from tarballs (AC1).** All three packages are installed as `file:` tarballs with `pnpm-workspace.yaml` `overrides` for `@egdev/tokens` and `@egdev/ui`, following the proven fixture shape (`scripts/package-consumption.test.mjs:9244-9267`). The script asserts every resolved entry point realpath is outside the repository, the pattern at `:5070`. A workspace link or repo-relative path is a hard failure, not a warning.

**R3 — Both CSS modes build (AC1).** Two independent builds use exactly the documented imports — Tailwind mode `tailwindcss` + `@egdev/tokens/theme.css` + `@egdev/ui/styles.css` (`docs/ARQUITECTURA.md:77-80`), native mode `@egdev/tokens/tokens.css` + `@egdev/ui/styles.css` (`:84-86`) — and both `vite build` runs exit 0. The native build's emitted CSS must contain resolved declarations and no literal `@theme` block.

**R4 — Page composition (AC2).** The page uses `WebTemplate` with `topBar`, `content` and `footer`, at least two `WebSection` inside `content`, and the representative molecules fixed by D4. Consumption is through the public barrel only; no internal path, no copied CSS, no handwritten shadow, gradient or colour (`AGENTS.md:36,39`).

**R5 — Tokens and Material paint (AC2).** For every mode and viewport the pilot asserts, from computed styles, that the canvas and surface backgrounds equal the resolved `--color-bg-canvas` / `--color-surface-1` values, that a Material surface carries a non-empty shadow and a 1px conceptual border, and that no element resolves a colour absent from the token set. The exact assertion set is fixed in WU2 and recorded with observed values.

**R6 — Themes (AC2).** Dark is measured. The second theme is D3 (a): light is recorded as not applicable, citing `packages/tokens/src/theme.css:16` and the precedent at `docs/components/section-shell/v0.1/implementation-plan.md:124`; no light theme is invented. **(amended by owner approval 2026-11-05: D3 = (a), "sólo dark".)** Passing AC2's "both themes" is only claimed when two real token themes exist, so the pilot records the light theme as not applicable rather than claiming it.

**R7 — Geometry at 390 and 1280 (AC2, Checks).** At 390×844 and 1280×900 the pilot asserts `document.documentElement.scrollWidth <= clientWidth` and that no element's `boundingClientRect` exceeds the viewport width, and fails on any console error. Each measurement records mode, viewport, theme, commit and tool.

**R8 — Documentation reconciliation (AC3).** Every contradiction the pilot exposes is entered in one table with the file and line, what the pilot observed, and a disposition: fixed in that file here, or recorded as a new issue with its link. Candidate files to re-read: `docs/distribution/install.md` (#342), `docs/ARQUITECTURA.md:74-87`, `packages/tokens/README.md:21-42`, `docs/MATERIAL.md`. Already-flagged items stay owned elsewhere: the React peer range (#342 D5) and the missing light theme (D3).

**R9 — No new repository dependency, no regression (Checks).** The generated app installs its own React, Vite and Tailwind from the pinned versions above, so the repository manifest stays unchanged: D2 (a) adds no browser dependency. **(amended by owner approval 2026-11-05: D2 = (a), no dependency.)** `pnpm test:package-consumption` keeps its current fixtures and assertions.

## 3. Decisions for the owner

D1 — Pilot shape. (a) Root script plus test that generates the app in `mkdtemp` and never commits it **[recommended: the issue's Guidance asks for exactly this, there is no second app to maintain, and it matches the proven fixture lifecycle at `scripts/package-consumption.test.mjs:9229-9322`]**; (b) committed `examples/pilot/` app (reviewable source, but a permanent second app outside the workspace); (c) generated into a gitignored `pilot/` folder inside the worktree (easier manual poking, risk of scratch state in the repository).

D2 — Browser evidence tool. (a) Playwright MCP captures recorded as text evidence with hash, viewport, theme and mode, images left in ignored `.playwright-mcp/` **[recommended: no new dependency, the existing convention, and `AGENTS.md:44` requires confirmation for any dependency]**; (b) add `@playwright/test` as a root devDependency plus a `test:pilot-browser` script (only option a third party can re-run, but it is a new dependency needing explicit confirmation and a Chromium download); (c) dependency-free Chrome DevTools Protocol script against a locally installed Chrome (no dependency, but brittle and OS-specific).

D3 — "Both themes". (a) Measure dark and record light as not applicable, citing `packages/tokens/src/theme.css:16` and the precedent at `docs/components/section-shell/v0.1/implementation-plan.md:124` **[recommended: no token value may change here, and inventing a light theme would misrepresent the design system]**; (b) authorize a light token theme as its own spec before the pilot, which changes `packages/tokens/src/theme.css` and needs explicit token approval; (c) measure dark plus `forced-colors` / reduced-transparency as the second mode and label it as high-contrast, never as light.

D4 — Representative molecules. (a) `Tabs`, `ChipGroup`, `Field`, `Notice`, `ListItem` **[recommended: interaction state, forms, feedback and content, all exported at `packages/ui/src/index.ts:44-112` and none domain-specific]**; (b) `Tabs`, `ProjectCard`, `SectionHeader` (Material-heavier paint, but couples the pilot to product-ish molecules); (c) `Tabs` and `ButtonGroup` only (smallest page, weakest Material coverage).

D5 — Tarball source. (a) The pilot script packs the three packages into its own temp folder through #342's shared pack helper **[recommended: self-contained and independent of #342 D4's output folder, so either D4 choice works]**; (b) the pilot consumes `release/*.tgz` produced by `pnpm release:pack` first (exercises the documented path end to end, but couples #343 to #342 D4 and to a prior command).

D6 — Contradiction disposition. (a) Fix in place when the contradiction is consumer-facing and the fix is small, otherwise record an issue **[recommended: AC3 allows both, and it keeps the diff reviewable]**; (b) fix everything in place in #343 (larger diff, likely to collide with #342's guide); (c) record every contradiction as an issue and fix nothing here (cheapest, but leaves stage 1's "docs compatible with the version" unmet).

D7 — Evidence retention. (a) A short evidence table in the PR body and this ODD document, images only in ignored `.playwright-mcp/` **[recommended: reproducible without versioning binaries]**; (b) commit a metadata file with hashes and measured values under `docs/distribution/` (auditable later, one more artifact to maintain).

## 4. Implementation plan

Order: WU1 → WU2 → WU3 → WU4. Requires #342 approved and landed, because the pilot needs tarballs and the guide. Each unit stays under ~400 changed lines. Any repository dependency named below is a proposal requiring owner confirmation first.

| Planned path | Role |
| --- | --- |
| `scripts/pilot-consumer.mjs` | Creates, installs and builds the pilot; also writes the page source |
| `scripts/pilot-consumer.test.mjs` | Tarball-only, both-mode and page/paint assertions |
| `package.json` | `pilot:build`, `test:package-pilot` (no `test:pilot-browser`: D2 = (a); amended by owner approval 2026-11-05) |
| `scripts/lib/pilot-page.mjs` | Page composition, extracted from the generator for review |
| `playwright.config.ts`, `scripts/pilot-browser.test.mjs` | Not created: D2 = (a) keeps browser evidence in Playwright MCP captures (amended by owner approval 2026-11-05) |
| Generated app (temp `mkdtemp` outside the worktree) | `package.json`, `pnpm-workspace.yaml`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/pilot.css`, `tsconfig.json` |
| Recorded evidence | PR body and this document; images only in ignored `.playwright-mcp/` |

### WU1 — Generator, tarball-only install, both builds (R1–R3, D1, D5)

- Files: `scripts/pilot-consumer.mjs` (new), `scripts/pilot-consumer.test.mjs` (new), `package.json` (`pilot:build`, `test:package-pilot`).
- Size: ~330 lines (generator ~230, test ~90, root entries ~4).
- RED: `node --test scripts/pilot-consumer.test.mjs` fails first on the missing generator, then on a stub that produces no tarball install and no per-mode build directory. Negative case: a fixture that resolves `@egdev/ui` inside the repository must exit non-zero and name the offending realpath on stderr, leaving the temp directory removed.
- GREEN: `pnpm build && pnpm test:package-pilot` — both modes built, both realpath assertions green, three `file:` tarballs in the generated manifest.
- Exit condition: AC1 with recorded stdout, installed versions and build output sizes.

### WU2 — Page composition, tokens and Material paint (R4–R6, D4)

- Files: `scripts/lib/pilot-page.mjs` (new), `scripts/pilot-consumer.mjs`, and new cases in `scripts/pilot-consumer.test.mjs`.
- Size: ~260 lines (page ~140, assertions ~120).
- RED: the emitted HTML/CSS assertions and the computed-style checks fail against WU1's placeholder page (no `eg-web-template` root, no molecule roots, missing shadow layer).
- GREEN: `pnpm test:package-pilot` passes with the D4 molecule set, and the recorded computed values equal the resolved token values in both modes.
- Exit condition: AC2's token/paint half and R6's theme disposition recorded.

### WU3 — Browser geometry at 390 and 1280 (R7, D2)

- Files: none (D2 = (a); the other branches would add `playwright.config.ts`, `scripts/pilot-browser.test.mjs`, `package.json` (`test:pilot-browser`) and `@playwright/test` as a **new dependency requiring owner confirmation**). **(amended by owner approval 2026-11-05.)**
- Size: ~120-180 lines depending on the D2 branch.
- RED: the overflow and console-error assertions have no natural failing behaviour on a correct page; the honest RED is the absent harness, observed as a non-zero exit for the missing config/runner. Say so in the PR rather than fabricating a failure.
- GREEN: `pnpm pilot:build` then the D2 runner, with one record per viewport: scroll width, widest element, console errors, mode and theme.
- Exit condition: R7 satisfied or a recorded issue when a real overflow is found.

### WU4 — Documentation reconciliation (R8, D6, D7)

- Files: the files D6 selects among `docs/distribution/install.md` (#342), `docs/ARQUITECTURA.md:77-86`, `packages/tokens/README.md:24-35`; plus the contradiction and evidence tables in this document or the PR body.
- Size: ~120 changed lines (tables ~60, doc fixes ~60).
- RED/GREEN: not applicable — passive documentation; verification is re-reading each edited file against the pilot's observed values, plus `pnpm test:package-pilot` still green.
- Exit condition: R8 complete — every contradiction fixed or linked to an issue, AC3 evidenced.

## 5. Risks and out of scope

- **Data/irreversible:** nothing in the repository is mutated; every app, tarball set and browser profile lives in a fresh temp directory. The shared pnpm store and the machine's browser cache are touched by installs — an accepted side effect, not a repository change.
- **Security:** only this repository's own tarballs are installed, always as `file:` with `--ignore-scripts`; no registry, token or third-party artifact is introduced, and nothing from the unpacked tarballs is executed. Evidence images stay inside the ignored capture folder.
- **Consumed contracts:** the pilot consumes `WebTemplate`, `WebSection` and the chosen molecules only through the public barrel. If a needed prop is missing, that is a component change and out of scope here; it becomes an issue, not a patch. The React peer range and version coupling stay #342's decisions.
- **Concurrency:** parallel runs are safe only because each uses `mkdtemp`; D5(b) would read a shared `release/` folder and is not concurrency-safe. No CI job is added, so nothing serializes runs.
- **Delivery/environment:** network installs cost minutes (the existing consumption test allows six minutes per React version, `scripts/package-consumption.test.mjs:9229`) and need temp-disk space; results depend on the local Node 24 and the pinned pnpm (`package.json:5,7`). A committed Playwright dependency would also need a Chromium download, and offline machines could not run either check.
- **Untestable:** 390px emulation is not a physical phone; fonts and paint differ per OS; screen-reader behaviour, real zoom and a light theme (which does not exist) cannot be proven by this pilot and will be reported as not exercised.
- **Out of scope:** the egdev.es migration (M1), publication to a registry, new components, any token value change, a light theme unless D3(b) authorizes it, and #342, #344, #345, #346, #347, #348.

### Acceptance criteria traceability

| Criterion | Requirements | Planned evidence |
| --- | --- | --- |
| AC1 — installs only from tarballs and builds in both CSS modes | R1, R2, R3 | WU1 negative realpath case, two green builds, installed versions |
| AC2 — expected tokens and Material paint, no horizontal overflow, both themes | R4, R5, R6, R7 | WU2 computed-style records, WU3 viewport records, D3 disposition |
| AC3 — every documentation contradiction fixed or recorded | R8 | WU4 table with per-item disposition and issue links |
| Scope — no new dependency without confirmation | R9, D2 | manifest diff and the D2 answer (a: none added) |
| Checks — Chromium 390/1280, `pnpm test:package-consumption` | R7, R9 | WU3 records, unchanged consumption test run |

## Owner approval

Approved by the owner on 2026-11-05. D3 uses the owner's earlier answer "sólo dark" (`odd/tasks/ds-distribution.md` L5), which is this document's recommended option; every other decision takes its recommended option, per the owner's answer "Aceptar todas las recomendaciones (Recomendado)".

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) Root script plus test that generates the app in `mkdtemp` and never commits it | "Aceptar todas las recomendaciones (Recomendado)" |
| D2 | (a) Playwright MCP captures recorded as text evidence with hash, viewport, theme and mode; images left in ignored `.playwright-mcp/` | "Aceptar todas las recomendaciones (Recomendado)" |
| D3 | (a) Measure dark and record light as not applicable, citing `packages/tokens/src/theme.css:16` | "sólo dark" (Log L5) |
| D4 | (a) `Tabs`, `ChipGroup`, `Field`, `Notice`, `ListItem` | "Aceptar todas las recomendaciones (Recomendado)" |
| D5 | (a) The pilot script packs the three packages into its own temp folder through #342's shared pack helper | "Aceptar todas las recomendaciones (Recomendado)" |
| D6 | (a) Fix in place when consumer-facing and small, otherwise record an issue | "Aceptar todas las recomendaciones (Recomendado)" |
| D7 | (a) Short evidence table in the PR body and this ODD document; images only in ignored `.playwright-mcp/` | "Aceptar todas las recomendaciones (Recomendado)" |

Amendments recorded in place: the dependency row now inherits #342's approved decisions, R6 is fixed to the dark-only branch, R9's dependency clause is fixed to "none added", and the planned-path table and WU3 no longer carry the D2(b) browser harness, which the approval excludes.
