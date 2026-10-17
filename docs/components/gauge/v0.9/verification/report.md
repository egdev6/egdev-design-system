# Gauge v0.9 — local retirement verification

## Outcome

**LOCAL RETIREMENT DONE / PACKED COMPATIBILITY BLOCKED.** Gauge's native well and the exact 20-file retirement are locally verified; this is not full implementation completion or release readiness. Packed React 18/19 compatibility remains blocked, and actual screen-reader evaluation remains **Not evaluated**.

Authority is the separate [full-plan approval](../plan-approval.json), recording the parent's observed question and user response `si`, for the frozen [implementation plan](../implementation-plan.md). The earlier [composition receipt](../approval.json) is a separate decision. These are manual conversation records, not signed/provider/native receipts; no exact approval timestamp or new image-byte approval is inferred.

The effective contract remains the immutable [v0.8 base](../../../../specs/gauge.md) plus the [v0.9 amendment](../composition-amendment.md). This report records parent-run implementation evidence and logs; the closing documentation writer ran only passive integrity/format checks, not implementation, deletion, runtime tests, builds or browsers.

## Observed checks

Final parent results below supersede earlier counts, not historical records. Jobs 39–41 were inspected for this report; the successful package-export rerun and earlier RED/GREEN are supplied parent observations.

| Command / check | Observed result and scope |
| --- | --- |
| `pnpm test` | Exit 0; **110 tests, 6 files** in final job 40. The reduction from earlier 134/9 reflects retirement of three component test files and their component-positive cases, not skipped Gauge/helper coverage. |
| `pnpm typecheck` | Exit 0; root and workspace checks, job 40. |
| `pnpm lint` | Exit 0; 68 files, no fixes, job 40. |
| `pnpm props:check` | Exit 0; registry valid and generated view current, job 40. |
| `pnpm test:props` | Exit 0; **73 passed**, zero failed/skipped, job 40. |
| `git diff --check` | Exit 0 in the parent's final chained gate, job 40. |
| `pnpm build` | Exit 0 in job 39; fresh UI JS, reachable declarations and compiled CSS emitted. The subsequent export assertion failed separately, as recorded below. |
| `pnpm test:package-exports` | Initial job 39: exit 1, **12 passed / 1 failed**. After the assertion-only correction: parent-observed exit 0, **13 passed**. Checks cover fresh root types, passive SSR, plain layered CSS, static Material utilities without application Tailwind, and JS import without a CSS loader. Not packed/client compatibility. |
| `pnpm storybook-build` | Exit 0; static Storybook build completed, job 41. |
| `pnpm test:storybook-mcp` | Exit 0; **3 passed** in job 41: two synthetic parser/isolation cases and one live Gauge-only English-metadata/eight-preview check. Live probe approximately 17 seconds. |
| `node --check scripts/package-consumption.test.mjs` | Parent diagnostic exit 0, syntax only. Its embedded TypeScript/client programs were not compiled or executed. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Parent-observed exit 0; 107 rows regenerated through the canonical source. |

Historical implementation regressions remain explicit:

- Native-well/preview-CSS phase: **RED 11 failed / 36 passed → GREEN 47 passed**.
- Public-barrel regression: **RED 1 failed / 26 passed → GREEN 27 passed**, after export/style-import removal and before physical retirement.
- A maintenance writer ended with a generic error and no handoff despite writing changes. The parent inspected rather than blindly rerunning: a read-only diagnostic confirmed on-disk state, **104 focused tests**, registry checking and three script syntax checks, all exit 0. The final 110-test gate above is the closing count.
- Job 39's failing static-utility assertion rejected valid `.p-0 { padding: var(--space-0); }`. The parent added that canonical-token alternative while retaining selector/property checks. No component or token was changed to satisfy it; the subsequent 13-test export suite passed.

All final executed gates listed above exited 0, but advisories remain. Parent LSP review of nine changed paths found **0 errors and 22 information/warnings**, including two nonliteral-RegExp helper findings and legacy spelling notices. SWC advice, Storybook empty MDX patterns/preview docgen exclusion/chunk-size notices and earlier dependency `use client` warnings are not universally clean diagnostics or failing product tests.

## Parity

The unchanged [capture manifest](capture-manifest.json) records **nine scenarios across three phases (27 PNGs)**: before, native well before retirement, and after retirement. Scenarios are Default 42/md, sm/82, lg/100, custom 64.5px/42.5, warning, critical, muted, center 42 and unavailable.

- Every recorded root/well/arc/context field agrees: **9/9 before→after and 9/9 before→post-retirement**. Both computed-difference arrays are empty.
- Actual SHA-256/file-byte comparisons are identical for all nine pairs in each comparison. Gates remain `PASSED_BEFORE_RETIREMENT` and `PASSED` after retirement. The closing writer rechecked all 27 PNG identities and both computed comparisons, without recapturing or modifying evidence.
- Default well/arc remain 56×56px, border-box, padding 0, **solid 0px border**, full radius, surface-0/no image, two-inset well shadow and default foreground. Static CVA owns the native-well Material treatment; `gauge.css` retains geometry/mask and +0.5px smoothing, not a new Material recipe.
- Scope: component-zone captures, viewport **1280×900**, DPR **1**, dark scheme, reduced motion, loaded document fonts and recorded Barlow family. Chromium **148.0.7778.167** and reduced-transparency preference **false** were observed after retirement; those fields were not recorded in the before context and are not retroactively claimed comparable measurements.

Exact bytes under these conditions require no invented pixel tolerance or pixel-tool installation. They are not universal cross-viewport/theme/browser or screen-reader proof, and do not replace separate human approval of the pilot/reference scope.

The parent reused the confirmed, existing authorized Storybook server (job 31); no startup/restart was granted by this plan. Live index contains **eight Gauge stories plus Docs only**. Final Docs review found the four state select options, visible disabled center/size rows, constant defaults (`normal`, `md`, `Data unavailable`) and absent optional values displayed as `-` with derived rules in prose, not raw control tags. A closing locator failed because row cell text was concatenated; exact cell/select inspection resolved the automation scope, without a product fix. No actual page error was observed in the final UI.

## Retirement, registry and documentation

The [retirement manifest](retirement-manifest.json) preserves the original 20-file hashes/bytes/modes, pre-retirement dirty status, archive identity and removal history. The parent reverified regular-file/no-symlink status, directory membership, archive and nine pre-retirement PNG pairs immediately before individual unlinks, then removed only empty directories non-recursively. Counts: **Surface 7, IconButton 7, Tabs 6**; there was no Tabs CSS file. This writer records that action and independently rechecked absence; it performed no deletion.

All **seven Gauge files remain**. Parent API/AST comparison found five public source aliases unchanged; `GaugeProps`, `GaugeState`, `GaugeSize`, passive semantics and numeric policy remain. No hidden Surface/private React replacement was retained. Source and fresh distribution expose exactly runtime `Gauge` and utility `cn`; declaration/public-export checks passed. Existing legacy `.eg-tabs`/`.eg-icon-btn` design CSS is not an importable React API and was intentionally not globally purged. Declared Radix dependencies remain.

Active integrations retain generic metadata, control-type, override, native and invalid-fixture coverage. Gauge docgen remains **10 own declarations / 8 unique props**, with all eight remaining owned Controls rows. Registry maintenance withdrew the **11 retired observations**, did not rename/reassign them, and refreshed eight Gauge source revisions to `sha256:e6f03e386d0ac9f55062f32af68a22bea9af00ab22c0174d1f3ce906a2f8a709`. All **13 conventions remain proposed with approval null**; five empty usage arrays are valid and display “None recorded”.

The UI README is Gauge-only; the root README is unchanged. Nine active guides received bounded availability/Material corrections (82 local links/anchors verified in prior maintenance). Catalog generation retained future taxonomy and changed only relevant availability notes/Gauge composition. No token values, dependencies, package versions/manifests, lockfile or CI were changed by this v0.9 execution; unrelated earlier working-tree changes remain outside that claim.

Delta mapping is bounded: **D-01–D-03 locally verified** by native-well/API/functional evidence and captured parity; **D-04 locally verified** by exact retirement, public artifacts and live stories; **D-05 identities/recovery verified** without rewriting the frozen plan's pre-decision wording. This is not a blanket promotion of inherited G-01–G-13: **G-11 packed compatibility stays Blocked; G-05 screen-reader evaluation stays Not evaluated**. The [v0.8 report](../../v0.8/verification/report.md) retains the inherited per-criterion limitations; historical accessibility observations are not new v0.9 all-state/assistive-technology certification.

## Evidence limits

- Packed React **18.3.1** remains blocked at missing offline `loose-envify` metadata; **19.3.0** at the missing `class-variance-authority@0.7.1` tarball. These prior installation failures did not reach consumer assertions. **No retry, installation or network fallback occurred under this plan.** The rewritten consumer script has syntax evidence only; local public types/SSR/CSS checks do not substitute for the packed TypeScript/SSR/CSR/CSS matrix.
- No new existing-dependency consumer harness was started; the old harness remained stopped. No screen reader or production-browser compatibility matrix was run. Broader visual fit/zoom/state combinations and GitHub asset/publication limits remain unverified where previously recorded.
- Native assessment of the untracked scope was unassessable, not a native pass. RDD was off and the plan used self-verification; no independent verifier/native/provider approval is fabricated. Parent final review remains separate from this writer's evidence record.
- The original Foundation sources, immutable v0.8 contract/header/approvals/plans/captures, old ODD records and historical planning/decision documents were not rewritten by this execution.

## Recovery and no delivery

The private archive recorded in the retirement manifest is a **local temporary recovery copy, not a permanent-backup guarantee**. It preserves working-tree bytes, including five pre-existing modified retirement files, rather than assuming HEAD is recoverable truth. This writer verified its SHA-256, the frozen plan hash and the unchanged base/amendment payload hashes before editing these two closing artifacts.

Closing checks: read-only `python3 -B` integrity checks exited 0 (hashes, 20 absent targets/three absent directories, seven regular Gauge files, source revision and 27 PNG identities/computed parity). A second passive check verified every original private-manifest field unchanged, the archive's exact 20 regular members/hashes/bytes/modes, removal history, eight report links, six manifest evidence references and registry counts. `pnpm exec biome check docs/components/gauge/v0.9/verification/retirement-manifest.json` exited 0, one file checked, no fixes. Documentation edits have no meaningful behavior-level RED/GREEN cycle; implementation RED/GREEN above belongs to the earlier observed work, not this passive closing unit.

No commit, push, GitHub update, asset upload, npm publication or release occurred. Local evidence does not authorize delivery, new convention approval, cache installation, expanded testing or an issue-closure/full-completion claim.
