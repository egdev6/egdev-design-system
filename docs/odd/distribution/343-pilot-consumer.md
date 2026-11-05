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

## Implementation evidence and browser handoff

`pnpm pilot:build` packs the existing three release members into a fresh system temporary directory, installs them with strict peers and scripts disabled, resolves their public entry points outside this repository, renders the public page on the server, and builds both modes. The directory is removed on exit. `pnpm test:package-pilot` exercises that path and verifies that a repository realpath is rejected and the temporary directory removed.

| Evidence | Observed |
| --- | --- |
| Local tarballs | tokens 0.3.0, ui 0.1.0, effects 0.1.0; each installed from a `file:` tarball |
| Tailwind build | CSS 302017 bytes; JS 431152 bytes; no literal `@theme` |
| Native build | CSS 297690 bytes; JS 431152 bytes; no literal `@theme` |
| Server-rendered structure | One `main`, two WebSections and all five D4 molecule roots |
| Dark | Measured in Windows Chrome via Playwright MCP in both CSS modes and both viewports; see results below |
| Light | Not applicable: `packages/tokens/src/theme.css:16` declares only dark; precedent `docs/components/section-shell/v0.1/implementation-plan.md:124` |

Sizes above are observations from one run, not fixed acceptance thresholds. The parent supplied the browser observations below; AC2 is not claimed as passing.

### Documentation reconciliation

| File and location | Observation | Disposition |
| --- | --- | --- |
| `docs/distribution/install.md`, upgrading step 3 | The `@egdev` packages use tarballs, but installation may fetch React, Vite and other third-party packages from a registry; the old sentence said nothing was fetched from a registry. | Corrected in place. |
| `docs/ARQUITECTURA.md:77-86`; `packages/tokens/README.md:24-35` | Both document the imports used by the respective successful builds. | No contradiction observed. |
| `docs/MATERIAL.md:11-12,29-30,48-52`; `packages/ui/src/primitives/surface/types.ts:50-55,68` | The elevated default Surface specifies a light edge and two-layer shadow, but its computed shadow in the pilot consisted only of transparent layers. | Unresolved consumer-facing discrepancy; package changes are outside this task and no issue has been created or linked. AC3 remains open. |
| This plan, section 5 security | Strictly offline wording overlooks installation of pinned third-party packages. | Clarified here: only `@egdev` packages are required to come from local tarballs; other dependencies may come from the registry. |

### Parent-reported browser evidence and classification

The parent reports Playwright MCP against Windows Chrome. All four runs used dark, activated Details and Code, then reloaded for default-state capture. Details reported `aria-selected=true` / `data-state=active`; Code reported `aria-pressed=true` / `data-state=on`. No console errors were reported. The parent did not supply the browser version, capture commit, device-pixel ratio, page zoom, widest-element value or screenshot hashes; these are not inferred from the current checkout.

| CSS mode | Viewport | Canvas / token | Surface / token | scrollWidth / clientWidth | Raw assertion failures |
| --- | --- | --- | --- | --- | --- |
| Tailwind | 390×844 | rgb(20, 21, 24) / same | rgb(27, 28, 32) / same | 390 / 390 | border, fractional right edges, hidden skip row, two mixed colours; transparent shadow masked by textual check |
| Tailwind | 1280×900 | rgb(20, 21, 24) / same | rgb(27, 28, 32) / same | 1280 / 1280 | border, hidden skip row, two mixed colours; transparent shadow masked by textual check |
| Native | 390×844 | rgb(20, 21, 24) / same | rgb(27, 28, 32) / same | 390 / 390 | border, fractional right edges, hidden skip row, two mixed colours; transparent shadow masked by textual check |
| Native | 1280×900 | rgb(20, 21, 24) / same | rgb(27, 28, 32) / same | 1280 / 1280 | border, hidden skip row, two mixed colours; transparent shadow masked by textual check |

| Finding | Source-based classification and remaining uncertainty |
| --- | --- |
| Border `0.8px` in all runs | The measured Surface uses `border` (`packages/ui/src/primitives/surface/types.ts:22`); the shipped utility declares `border-width: 1px` (`packages/ui/dist/styles.css:7256-7259`). The conceptual CSS declaration is 1px. Fractional pixel/zoom quantization is plausible, but the reported value alone does not establish device-pixel ratio or zoom. The literal `1px` computed-style assertion failed; it has not been rerun or waived. |
| At 390, HTML/BODY/DIV/`eg-web-template`/HEADER/MAIN right edge `390.3999938964844`; hidden skip DIV `-1..0` | Equal integer scroll/client widths show no measured scroll overflow; the strict rectangle assertion nevertheless failed. The fractional right edge is consistent with rounding but its cause is unconfirmed without zoom/DPR data. The skip row is intentional visually-hidden accessibility content: `packages/ui/src/templates/app-shell/types.ts:51-52` selects `sr-only`, whose shipped rule uses absolute position, 1px dimensions, -1px margin and clipping (`packages/ui/dist/styles.css:6137-6146`). This does not establish that every visible element satisfies R7's literal assertion. |
| Surface shadow is four transparent layers | `scripts/lib/pilot-page.mjs:13` selects the default Surface, not a well or shadowless variant. `packages/ui/src/primitives/surface/useSurface.ts:10-24` defaults raised elevation to 1, and `packages/ui/src/primitives/surface/types.ts:50-55,68` specifies edge plus elevation shadows. The source tokens are nontransparent (`packages/tokens/src/theme.css:357-362`), and the shipped utility references them (`packages/ui/dist/styles.css:8275-8277`). `docs/MATERIAL.md:11-12,29-30` expects the light edge and two layers. Therefore the element/variant is appropriate; this is not an intentional no-shadow recipe. The parent reports a computed value containing only transparent zero-size layers, so the nonempty-string check was a false positive. The cause is not established by source inspection; do not claim a package or pilot root cause without further evidence. No pilot or package workaround was made. |
| Selected Chip and neutral Notice border colours absent from the literal token set | The selected Chip uses `border-primitive-red-neon/60` (`packages/ui/src/atoms/chip/types.ts:120-122`), compiled to `color-mix(in oklab, var(--color-primitive-red-neon) 60%, transparent)` (`packages/ui/dist/styles.css:9723-9727`). The Notice uses `border-fg-secondary/30` (`packages/ui/src/molecules/notice/types.ts:67-70`), compiled to the corresponding 30% mix (`packages/ui/dist/styles.css:7364-7368`); the token aliases are in `packages/tokens/src/theme.css:27,31,75`. The observed values were respectively `oklab(0.630989 0.234418 0.0996162 / 0.6)` and `oklab(0.845217 0.0000385046 0.0000169277 / 0.3)`. They are token-derived alpha mixes, not literal members of the test's token-value set. Material describes alpha hairlines (`docs/MATERIAL.md:27`); this does not silently amend R5's stricter rule, which failed. |

**Verdicts:** R4 and R6 have supporting evidence, with light not applicable. R5 is **not satisfied**: the backgrounds match, but the literal border and colour assertions failed and the observed shadow is transparent. R7 is **not satisfied literally**: scroll widths and console checks passed, but the rectangle assertion failed; the suspected rounding cause is unconfirmed. AC2 therefore remains open. R8/AC3 remain open because the Material shadow discrepancy has neither been fixed nor linked to a new issue; creating one is parent-owned. AC1/R1–R3 and R9 retain the earlier build/test evidence and are not revalidated by these browser results.

### Parent re-measurement (2026-11-05, same pilot, both modes, 1280×900)

The "transparent shadow" finding was a parent measurement defect: the first run truncated `boxShadow` to 120 characters. The full computed value, identical in Tailwind and native mode, is `rgba(0, 0, 0, 0) 0px 0px 0px 0px` ×4 (Tailwind's empty ring/inset slots) followed by `rgba(255, 255, 255, 0.07) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.7) 0px 1px 2px 0px, rgba(0, 0, 0, 0.55) 0px 4px 14px -2px` — the light edge plus the two elevation layers that `docs/MATERIAL.md` requires. The same run reported `devicePixelRatio` 1 and a browser zoom of about 1.23 (`outerWidth / innerWidth`), which explains the `0.8px` border (1px quantised at 125% zoom) and the `390.4px` root edge; scroll width still equals client width.

Revised disposition: **shadow** — passes (no Material discrepancy, no issue needed). **Border and fractional edges** — host zoom artefacts; the declared border is 1px and no scroll overflow exists. **Skip link** — intentional `sr-only` clip. **Token-derived alpha mixes** (Chip 60%, Notice 30%) — still fail the literal token-set rule; they are recorded openly as a limitation of that rule (it compares against resolved token values and does not model `color-mix` of a token with transparency), not as a design-system defect. Remaining limits: captures stay in the Windows Playwright host folder without SHA-256, and the measurement ran at ~125% browser zoom.

The four `pilot--{tailwind,native}--dark--{390,1280}.png` captures are reported in the Playwright MCP host's Windows output folder, not this worktree's `.playwright-mcp/`. No SHA-256 values or matching metadata files were supplied; D7 hash/location retention is incomplete. Physical devices, assistive technology, zoom behavior and a light theme remain untested.

### Parent-owned Chromium capture procedure

From the repository root run `pnpm pilot:build -- --serve` in a foreground terminal and leave it running. Wait until both Vite preview servers report ready. Tailwind is `http://localhost:4173/`; native is `http://localhost:4174/`. Stop with Ctrl-C after capture to remove the temporary app. The server listens on `0.0.0.0` for an external browser host; use the worktree host's reachable address in place of `localhost` if necessary. No preview is intended to remain running after capture.

For each mode capture dark/default at 390×844 and 1280×900: `.playwright-mcp/pilot--tailwind--dark--390.png`, `.playwright-mcp/pilot--tailwind--dark--1280.png`, `.playwright-mcp/pilot--native--dark--390.png`, and `.playwright-mcp/pilot--native--dark--1280.png`. Attach matching `.json` records with viewport, mode, theme, commit, browser/tool, screenshot SHA-256, computed measurements and console errors. Record errors from navigation onward; assert none. Also activate the Details tab and the Code chip, confirm their selected states, then restore defaults before the screenshots. Do not treat captures as approval.

At each viewport and mode evaluate the following in the page. It returns the measurements and failures instead of hiding failures in a boolean. Token-derived alpha mixes may expose a real discrepancy and must not be silently exempted. Record the returned data with the console-error count and screenshot hash.

```js
() => {
  const root = document.documentElement;
  const rootStyle = getComputedStyle(root);
  const probe = document.createElement('span');
  document.body.append(probe);
  const resolve = (value) => {
    probe.style.color = '';
    probe.style.color = value;
    return probe.style.color ? getComputedStyle(probe).color : null;
  };
  const tokens = new Set();
  for (const name of rootStyle) {
    if (name.startsWith('--color-')) {
      const color = resolve(rootStyle.getPropertyValue(name).trim());
      if (color) tokens.add(color);
    }
  }
  const canvasToken = resolve(rootStyle.getPropertyValue('--color-bg-canvas').trim());
  const surfaceToken = resolve(rootStyle.getPropertyValue('--color-surface-1').trim());
  probe.remove();
  const canvas = getComputedStyle(root).backgroundColor;
  const surface = getComputedStyle(document.querySelector('[data-pilot-surface]'));
  const failures = [];
  if (canvas !== canvasToken) failures.push(`canvas: ${canvas} != ${canvasToken}`);
  if (surface.backgroundColor !== surfaceToken) failures.push(`surface: ${surface.backgroundColor} != ${surfaceToken}`);
  if (surface.boxShadow === 'none' || !surface.boxShadow) failures.push('surface has no shadow');
  if (surface.borderTopWidth !== '1px') failures.push(`surface border: ${surface.borderTopWidth}`);
  const elements = [...document.querySelectorAll('*')];
  const widest = elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { tag: element.tagName, className: String(element.className), width: rect.width, left: rect.left, right: rect.right };
  }).sort((a, b) => b.width - a.width)[0];
  if (root.scrollWidth > root.clientWidth) failures.push(`scroll width: ${root.scrollWidth} > ${root.clientWidth}`);
  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    if (rect.width > root.clientWidth || rect.right > root.clientWidth || rect.left < 0) {
      failures.push(`overflow: ${element.tagName} ${String(element.className)} ${rect.left}..${rect.right}`);
    }
    const style = getComputedStyle(element);
    for (const property of ['color', 'backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']) {
      const color = style[property];
      if (color !== 'rgba(0, 0, 0, 0)' && !tokens.has(color)) failures.push(`non-token ${property}: ${color} on ${element.tagName} ${String(element.className)}`);
    }
  }
  return { viewport: [innerWidth, innerHeight], scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, widest, canvas, canvasToken, surface: surface.backgroundColor, surfaceToken, shadow: surface.boxShadow, border: surface.borderTopWidth, failures };
}
```

A screenshot or this measurement does not prove physical-device rendering, assistive-technology behavior, zoom, or a light theme.
