# Notice v0.1 implementation evidence

## Authority and scope

- Contract: [issue #93](https://github.com/egdev6/egdev-design-system/issues/93), v0.1, with [full-contract approval](https://github.com/egdev6/egdev-design-system/issues/93#issuecomment-6251531659). Recorded canonical SHA-256: `a1f4c0a4c01bb8d5f98dec179bc2180412db597df7b0cb8377f1970f83691d99`; frozen body SHA-256: `f0671d9a4fa567a0622c35e280068225cda2c2ee6b191fc84b643369f9bcc66a`.
- Effective amendment: [A1, owner-approved 2026-10-29](https://github.com/egdev6/egdev-design-system/issues/93#issuecomment-6503388441). It changes **D10/AC-10 only**: the shared recipe may inherit `eg-surface` unmodified. It still contains no Notice/Toast root or part markers, roles or icon derivation. No filtering, Surface changes or copied Surface recipe.
- Separate implementation authority: the parent delegated this exact implementation and resumed it after A1. This is the forwarded implementation-plan authorization, not an invented independent owner receipt.
- Task: `odd/tasks/molecules-build.md`, T2, S1–S4; branch `feat/93-notice`, base `origin/main` `d428967`. The untracked coordination copy is unchanged. Surface, Icon, Button and Link are already merged and publicly exported.
- Scope: six meaningful files in `packages/ui/src/molecules/notice/`, plus exports, static CSS scanning, Storybook, naming, catalogue and package-consumer checks. **No stylesheet**, extra component module, dependency or token change. No Radix primitive is appropriate for this passive message.

## Decisions implemented

| Decisions | Implementation |
| --- | --- |
| D1–D3 | Native div, role derived as danger → alert and otherwise status; either restricted native role overrides it. Required lead is a native strong before optional detail. Blank/whitespace-only summary warns in development and omits only the strong element. |
| D4 | Decorative span wraps a consumer glyph or system Icon: bell for neutral/info, alert for warning/danger, check for success. Null is unsupported; the implementation retains the default cue for nullish input. Icon sm/md presets match the wrapper. |
| D5 | Optional trailing ReactNode slot, not generated controls. Consumers provide one or two Button sm secondary/ghost or Link elements and own their interactions. Absent/null/false actions omit the wrapper. |
| D6–D8 | Five semantic tones, neutral default; md/sm sizes, md default. Typography uses body-default and label-default respectively, with native strong emphasis. |
| D9–D10 + A1 | `noticeVariants` combines the unmodified Surface surface-1/elevation-1/no-padding/lg-radius recipe with owned CVA tint/layout utilities through cn. Status border is 30%, gradient endpoints 11%/4%. Neutral uses fg-secondary. Surface light edge/two-layer shadow stay intact; owned border and gradient replace its hairline and sheen. |
| D11–D13 | No dismissal, timers or state machine. Flex wrapping plus token-derived 240px text basis moves trailing actions to another line in narrow containers. No stylesheet or animation. |
| D14 | The root alone owns announcements through its implicit status/alert semantics. No extra aria-live attribute, hidden announcer, focus move or nested live region is authored. Genuine non-empty mounted status updates retain the root. Insertion and speech guarantees remain distinct. |

`eg-notice` is added only by the hook; text/actions retain their established markers without a public part-selector styling API. No legacy modifier or mirrored state classes are emitted. `data-tone` and `data-size` describe variants. Legacy CSS remains untouched. A token-backed `m-0` on actions resets legacy physical margin-left before logical `ms-auto`, avoiding opposing auto margins in RTL.

All utilities are static CVA strings in `types.ts`; every supported part is composed with cn. Surface's retained `p-0` is harmless: Notice's px/py utilities override both axes. className merges last for margin, width and self-alignment only; it does not grant arbitrary Material/size/part overrides or universal last-class-wins behavior.

Public exports are exactly `Notice`, `NoticeProps`, `NoticeTone` and `noticeVariants`. Hooks, owned part recipes and the internal appearance CVA stay private. There is no ref or asChild API. Compatible native attributes pass to the root; contradictory live-region overrides, nested live regions and duplicate announcements are unsupported consumer composition.

## Naming, stories and metadata

Five existing approved conventions gain reviewed NoticeProps usages: `message-summary`, `trailing-actions`, `surface-material-tone`, `preset-dimensions`, `leading-icon`. React children and restricted native role require no new convention. No convention, alias, exception or approval was changed. Reviewed source: `packages/ui/src/molecules/notice/types.ts`, whole-file SHA-256 `ac7eafd209afa4d4540bc4a598e0aee447bca676257ce18b98e8b2569fce9eb3`. The generated naming view and immutable-receipt exclusion tests were updated.

Storybook title: **Molecules/Notice**. Stories: Default, Tones, Small, WithActions, CustomIcon, MountedStatusUpdates, InitialStatus, InsertedAlert. Default supplies only the required summary. Stories use system Stack for layout and real Button/Link/Icon composition; no manual argTypes, rendering adapter or play function. Existing main stories glob already discovers molecules; preview examples and production types gain molecule source globs.

AST, real docgen and installed extraction/enhancement/inference cover all seven own declarations, required summary, exact tone/size defaults, enum choices, ReactNode false-control reasons, native rows and unsupported APIs. The registered Controls test requires zero owned diagnostics. Browser widgets remain unevaluated.

## Acceptance evidence

| Criteria | Observed evidence / limit |
| --- | --- |
| AC-01–AC-06 | DOM/hook tests: defaults, strong lead before detail, all five default glyph choices, native role overrides, custom icon replacement, operable system Button/Link actions, optional-part omission and compact geometry. |
| AC-07 | Pure recipe tests cover every tone with both sizes, replaced Surface border/sheen, preserved Material shadow and consumer layout. In-memory production CSS checks emitted tint opacity, typography, flex wrapping and token-derived basis. Actual responsive browser layout is not evaluated. |
| AC-08 | Development empty and whitespace-only warnings; production warning suppression. |
| AC-09 | **Not evaluated.** VIS-01 remains the approved expected-design reference, SHA-256 `ef357f1df5027d232690ebd256ffe2b5b5fe02f3ca575837ada31a87531ada46`. The allowed D8 typography difference remains; no implementation image replaces it. |
| AC-10 + A1 | Shared recipe permits only inherited Surface identity; Notice alone adds its own markers. Barrel runtime keys are checked. Toast integration awaits Toast implementation; no Toast prerequisite was invented. |
| AC-11–AC-12 | DOM identity, stable status role, retained action focus, one announcement owner and readable inserted status/alert content. Stories distinguish mounted updates, initial status insertion and later blocking alert insertion. No DOM-only speech claim; actual screen-reader lifecycle matrix is not evaluated. |

Package checks now include exact runtime/declaration export lists, private-recipe exclusions, SSR markup, strict consumer positives/negatives, React 18/19 SSR/CSR lifecycle/action fixtures and native/Tailwind CSS assertions. These new packed checks are **prepared, not executed** by the writer; the parent owns full gates. Samples stay outside the existing generic App/count/focus harness.

## Observed validation

All tests ran in the foreground; focused Vitest commands used the requested 2GiB memory cap and two workers. No install, watch, Storybook server, browser, CI, staging, commit or push was run.

### Test-first evidence

- RED: behavior tests were written first; the initial focused run failed to resolve the not-yet-created Notice module (no tests collected).
- GREEN: after implementation, 24/24 original behavior/recipe tests passed. Refactoring moved six pure recipe cases into the CSS integration file without changing their assertions.
- Additional RED/GREEN: the action-wrapper legacy-margin regression failed 1/18 DOM tests before adding m-0; after the fix, combined final DOM/recipe/production-CSS coverage passes 25/25 (18 DOM + 7 recipe/CSS).
- Triangulation: all five tones × both sizes, both role overrides, absent actions, custom glyph, whitespace summary, production warning suppression and mounted/insertion lifecycles. CSS assertions account for compiler-generated token fallbacks, not handwritten values.

| Exact command | Observed result |
| --- | --- |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/notice-css.test.ts packages/ui/src/molecules/notice --maxWorkers=2` | 2 files, 25/25 passed. Production CSS built in memory, with write:false and envDir:false. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 -t 'Notice\|through the barrel'` | 2 files, 4 passed, 223 unrelated tests skipped. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 -t Notice` | Failed before assertions: packages/tokens/dist/tokens.css is absent. Parent must build tokens, then rerun. No out-of-scope build was attempted. |
| `pnpm props:docs` | Naming view regenerated from JSON. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 110 rows generated; bytecode disabled to avoid writing outside the approved generated-doc surfaces. |
| `pnpm lint` | Passed, 383 files, no fixes applied. |
| `pnpm typecheck` | Passed root and workspace checks. |
| `pnpm props:check` | Registry valid, evidence hashes and generated view current. |
| `pnpm test:props` | 87/87 passed. |
| `node --check scripts/package-exports.test.mjs` | Passed syntax check; built-artifact tests not run. |
| `node --check scripts/package-consumption.test.mjs` | Passed syntax check; packed suite not run. |
| `git diff --check` | Passed. |

## Remaining parent gates

Build tokens/UI, rerun the preview CSS check and run the serialized full/packed gates before declaring PR readiness. Browser Controls, computed layout/RTL, VIS-01 parity and real assistive-technology announcement observations remain **Not evaluated**, per S4. No product, token, dependency or naming decision remains blocked.
