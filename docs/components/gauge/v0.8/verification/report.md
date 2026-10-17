# Gauge v0.8 — local verification evidence

**Overall: PARTIAL — LOCAL IMPLEMENTATION VERIFIED, PACKED CONSUMER MATRIX BLOCKED.** Not ready for full completion. No unresolved internal implementation bug is known from the recorded checks; the external consumer tests failed during installation and are **not passed**. This report consolidates existing parent-run evidence; this documentation unit ran no component tests, builds, servers, installs or remote operations.

## Identity and authorization

- [Approved contract](../../../../specs/gauge.md): v0.8; frozen payload SHA-256 `f0999610927cc8556259c3896365697f4447ebae69eff810f3a2b66b57a3210d`. Hash input is UTF-8 from the exact `## 1. Purpose and scope` heading through EOF, including final LF; tracking header excluded.
- [Contract receipt](../approval.json) approves the contract only. The separate [plan](../implementation-plan.md) and [plan approval](../plan-approval.json) authorize local implementation and two prerequisites: narrow production Tailwind emission and a private normalized arc-geometry property. Manual records bind observed approval/content; they are not signed or self-authorizing receipts.
- Exactly seven Gauge files implement the approved atom. Production CSS scans static Gauge CVA source only, ships compiled utilities/geometry without canonical token redefinitions, and does not require an application Tailwind compiler. Existing Surface well semantics are reused; no broad Surface/IconButton/Tabs migration, dependency addition or canonical token modification was made.
- All 13 global prop conventions remain `proposed`, `approval: null`. Eight Gauge usages are `existing`, bound to actual `packages/ui/src/atoms/gauge/types.ts` bytes; they are observations, not global naming approval. This unit does not edit the registry.

## Automated commands and observed results

Final parent gate run **job 18 exited 0**. Every command below exited 0 in that run; these are recorded results, not reruns by this writer.

| Command | Result |
| --- | --- |
| `pnpm test` | **67 passed, 8 files**; includes 31 Gauge behavior cases, 6 docgen cases and 3 preview-CSS cases (40 focused cases total, not 40 additional tests). |
| `pnpm typecheck` | Exit 0; root and workspace checks. |
| `pnpm lint` | Exit 0; 78 files checked, no fixes applied in final run. |
| `pnpm props:check` | Exit 0; registry valid, generated view current. |
| `pnpm test:props` | 73 passed, 0 failed. |
| `pnpm build` | Exit 0; UI JS, declarations and compiled stylesheet emitted. |
| `pnpm test:package-exports` | 13 passed; root Gauge exports/types, local passive SSR, plain layered CSS, static utilities and geometry. |
| `pnpm storybook-build` | Exit 0; production Storybook built. |
| `pnpm test:storybook-mcp` | 3 passed; actual docs-only MCP smoke, not just static HTML inspection. |

Earlier job 12 had 64 tests before the three preview-CSS regressions were added; **64 is not the final count**. Build warnings included empty MDX patterns, preview docgen exclusion, dependency `use client` bundling and chunk-size notices; they did not fail job 18.

### Observed failures, fixes and regression evidence

Historical RED/GREEN below is parent-observed implementation evidence, not a new documentation TDD cycle.

| Discovery / RED | Fix / GREEN and limits |
| --- | --- |
| Initial Gauge behavior run: missing module, exit 1. | Implemented the approved atom; 31 Gauge cases passed. Alternate cases cover endpoints/overflow/decimals, invalid values and recovery, positive fractional/large and invalid sizes, descriptions, centers, protected semantics and passive input. |
| Real Gauge docgen filtered out supported native fields. | Narrow Gauge-only native-prop allowlist; 6 docgen cases passed, including unchanged metadata for existing components. |
| Artifact checks initially failed because required static CSS was not emitted. | Narrow production Tailwind emission. Subsequent built-CSS assertion failures were test-locator errors (font fallback syntax and components-layer locator), corrected rather than treated as component regressions; final package-export suite: 13 passed. |
| Real browser preview: circle measured **56×2px**, arc background `none`; before-fix PNG retained. Two preview-CSS regression assertions then failed. | Corrected the preview's compiled CSS entry/import handling; 3 preview-CSS cases passed. After reload: **56×56px**, 42% conic arc, 4px mask stroke, inset well shadow and Barlow loaded. Production CSS success alone had not proved preview correctness. |
| Initial lint gate found legacy Button capture-metadata formatting; later job 17 found Controls evidence JSON formatting. | Formatting-only corrections; original data unchanged. Job 18 lint passed; neither was a semantic Gauge fix. |
| Offline fixture selected unintended global pnpm 11 and its temporary v11 store in job 13. | Fixture now inherits root `packageManager: pnpm@10.34.6` and asserts its version before installation. Job 14 used the corrected manager but still failed offline installation; **no consumer GREEN**. |

### External packed-consumer blocker

Both parent runs used `EGDEV_CONSUMER_OFFLINE=1 pnpm test:package-consumption`: **exit 1; 0 passed, 2 failed**, before consumer assertions. The fixture install command was `pnpm install --ignore-scripts --no-frozen-lockfile --strict-peer-dependencies --offline`.

- **Job 13:** unintended pnpm 11/store selection; missing `class-variance-authority@0.7.1` offline tarball for both consumers. The fixture-manager bug was corrected before the next run.
- **Job 14, corrected pnpm 10.34.6:** React **18.3.1** blocked by missing `loose-envify` metadata (`ERR_PNPM_NO_OFFLINE_META`); React **19.3.0** blocked by missing `class-variance-authority@0.7.1` tarball (`ERR_PNPM_NO_OFFLINE_TARBALL`).
- These are installation failures, not component-assertion RED/GREEN. Packed entries/types/SSR/CSR/CSS assertions were not reached; external React 18/19 compatibility is not verified. Only offline attempts were authorized: **stop further fixtures; no network fallback**.
- [Native built-CSS observations](native-built-css-observations.json) independently show an existing-dependency Vite consumer with `plugins: []`, installed React aliases and built UI JS/UI CSS/token CSS: 64.5px and 40px circles, arcs, masks, well shadows and no transitions. No install or app Tailwind compiler was needed. This is **not a replacement for the packed matrix**.

## Browser, documentation and accessibility evidence

Existing captures/observations used **MCP Playwright**, Chromium **148.0.7778.167**, viewport **1280×900**, DPR **1**, dark theme, reduced motion and loaded Barlow. [Browser JSON](browser-observations.json) records `capturedAt: 2026-10-16T22:10:24.035Z` for its observation run, not an exact shutter time for every PNG. The [manifest](capture-manifest.json) records actual image hashes/dimensions and file-mtime provenance; images are crops unless stated otherwise.

- All **eight stories** were checked: `Default`, `ValueLimits`, `DecimalValue`, `States`, `CenterContent`, `ContextualValue`, `InvalidValue`, `Sizes`. Geometry/semantics agree for limits, decimal values, four consumer-selected states, absent/icon/number/text centers, contextual value text, unavailable data, presets/custom size/fallback. Legacy hover effects and passive focus were absent in recorded checks; `data-state` is used, not mirrored state classes.
- [Controls evidence](controls-observations.json): real UI exposes `id`, `title`, `aria-describedby`, `className`, `style`; excludes `ref`, `asChild`, `onClick`. Value 101 clamps to 100; warning selection connects its description. The mixed preset-or-number `size` uses Storybook's JSON editor: `64.5` → 64.5px, `"sm"` → 40px, `0` → 56px. No manual argTypes hide the real docgen surface.
- [Layout/AX evidence](layout-observations.json): 360×800 viewport shows the state examples without horizontal clipping. **CSS page zoom 200% is a simulation, not actual OS text-only zoom**. Chromium's accessibility tree exposes meter, name, bounds/current/value text and state descriptions. That is **not a screen-reader test**; real screen reader: **NOT_EVALUATED**.
- [Existing Accessibility addon](accessibility-addon-observations.json): **Default only**, **0 violations, 13 passes, 0 inconclusive**. This does not prove all states, all WCAG criteria or assistive-technology compatibility. Automated all-state accessibility and actual OS text zoom: **NOT_EVALUATED**.
- Native consumer console observation: favicon 404 only. Storybook manager reported an `ariaLabel` deprecation warning for Storybook 11; no Gauge page error was observed. This is bounded observed runtime evidence, not a universal error-free guarantee.

## Visual comparison boundary

[VIS-01](../../v0.3/single-ring--normal--dark--1280.png) remains the approved expected reference: unchanged SHA-256 `3e12c98b6b46341576117dc8694a4ec207310a2eff9d619d2920b8efd1f2774b`, **40×62px crop including caption**, not a 62px ring. [VIS-02](../../v0.3/source-board--dark--1280.png) remains context only, SHA-256 `b54ba9681dd14899ab8b303cba3bfbc64ed937cefe314fc342d5007108ba2c80`. Original capture metadata/fingerprints remain historical source evidence; private original sources were not rescanned.

The [observed small-ring crop](single-ring--82--sm--1280--dark.png) is **40×40px**, value **82**, `size="sm"`, center `A`, with the approved **3px** stroke and centered 30%-inset placement. The source and observed crops were inspected only for adopted single-ring anatomy/proportions/center placement. **Fixed A and caption are excluded from acceptance**; A is an optional demonstration, not required branding. Material well backing, DS state colors, passive semantics and visible state cues are approved intentional differences. No pixel-difference metric, arbitrary tolerance, exact whole-image equality or adoption of other source-board elements is claimed. Observed v0.8 images do **not** replace the approved v0.3 reference. Broader cross-size/content visual coverage remains limited as below.

## Acceptance matrix

PASS means the stated local evidence scope only. PARTIAL retains an unverified part of the frozen promise; BLOCKED identifies an attempted gate that could not reach its assertions. NOT_EVALUATED is used for unperformed checks above, never as a pass. Frozen contract checklists remain historical and unchanged.

| ID | Status | Evidence and remaining limit |
| --- | --- | --- |
| G-01 | **PASS** | Unit boundaries -1/0/100/101 normalize both numeric geometry and ARIA; `ValueLimits` browser arcs/values show 0/100 endpoints and overflow clamps. |
| G-02 | **PASS** | Decimal 42.5 retained in browser arc/value text; unit rerender to 88.25 updates geometry and semantics. No Gauge event API. |
| G-03 | **PASS** | NaN/±Infinity have readable label/default/custom unavailable text without meter, value attributes, center/cue or fake-zero ring; finite→invalid→finite recovery tested. |
| G-04 | **PARTIAL** | Four states at identical browser value 42, unit description/data-state/icon and type-requiredness checks; muted not disabled. Exhaustive state×value combinations were not exercised. |
| G-05 | **PARTIAL** | Name, normalized bounds/value/valueText, merged descriptions and unique multi-instance IDs tested; real Default/state AX trees inspected. Screen-reader behavior **NOT_EVALUATED**. |
| G-06 | **PASS** | Type/DOM negatives, tab/pointer tests and browser focus/hover checks protect passive semantics: no tab stop, action API, live region, editing or progressbar. Consumer content must remain non-interactive. |
| G-07 | **PARTIAL** | Center alternatives remain decorative with no duplicate accessible name; md examples and small comparison show centered fit. Arbitrary content fit across every size is not proven; no fixed logo/actions are promised. |
| G-08 | **PARTIAL** | Defaults/docgen/CVA agree; browser 40/56/80px with 3/4/6px strokes, custom 64.5px with diameter/14, invalid 0→56px. Unit 0.5/64/64.5/1000 and invalid numeric cases preserve policy; static numeric-property mechanism verified. Extreme-size browser overflow/clipping and actual OS text zoom were not fully evaluated. |
| G-09 | **PASS** | Stable `eg-gauge`, supported native forwarding, protected semantic spread, deduplicated descriptions, root margin/alignment merge and per-part isolation tested; emitted CSS/browser checks show legacy passive coexistence. Unsupported appearance overrides have no guarantee. |
| G-10 | **PASS** | Seven-file source roles, hook/JSX separation, static CVA/data variants and per-part `cn()` reviewed; built CSS and real browser prove conic/mask geometry, approved strokes/center/track/fills and reused Surface well. No decorative redesign; reduced-motion observation recorded. Reduced-transparency preference not recorded; no overlay/backdrop feature is present. |
| G-11 | **BLOCKED** | Local root exports/types/SSR and shipped-CSS checks pass; no-Tailwind native browser check passes. Packed React 18/19 installs fail offline before entries/types/SSR/CSR/CSS assertions. Full external-consumer promise remains unverified. |
| G-12 | **PASS** | 6 real docgen cases, real Controls/native fields/union editor, all eight stories and 3 actual MCP smoke cases; Default supplies only required label/value, no manual argTypes masking. |
| G-13 | **PARTIAL** | Scoped approval, original hashes/conditions and bounded small-ring anatomy comparison are recoverable locally. GitHub asset accessibility/publication remains **Pending**, not tested or fabricated; broader visual acceptance is not claimed. |

## Documentation-unit checks

- `git diff --check`: exit 0, no output.
- Read-only Python integrity/link/privacy verification (30-second bound): exit 0. Approved payload remains **35,548 bytes** with the same SHA-256; historical capture metadata is semantically unchanged outside current tracking fields. Existing receipts/plan, observation JSON, PNGs, registry and Gauge types are untouched. All **11 implementation PNGs plus 2 source references** match their recorded hashes/dimensions; report/header links resolve and all G-01–G-13 rows are present. New metadata uses repository-relative paths with no private absolute paths, local URLs or new image URLs.
- `pnpm exec biome check --write docs/components/gauge/v0.8/verification/capture-manifest.json docs/components/gauge/v0.3/capture.json`: exit 0; checked 2 files, formatted 1.
- Read-only `pnpm exec biome check` on the five existing observation JSON files: exit 0; no fixes applied.
- `pnpm props:check`: exit 0; registry valid, generated view current. No test suite/build/install was rerun for this docs-only unit; historical RED/GREEN above is not attributed to documentation edits.

## Delivery and evidence limits

Issue #30's body remains v0.4 **per supplied context, not a fresh remote read**. No issue was updated. The next separately authorized publication is a **comment on #30**, not a body edit or new issue; GitHub-visible asset publication/access is still **Pending**. No new image URL or live local URL is offered. Parent stopped Storybook job 15 and native-consumer job 19; this unit starts no servers.

Remaining gates are the blocked packed matrix, unperformed assistive-technology checks and independent publication permissions/access. The current report does not change approvals, promote global conventions, authorize network fallback or claim issue closure/full implementation completion.
