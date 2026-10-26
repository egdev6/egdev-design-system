# Badge v0.1 — implementation and verification

## Authority and scope

- Contract: [issue #52](https://github.com/egdev6/egdev-design-system/issues/52), v0.1; [full-contract approval](https://github.com/egdev6/egdev-design-system/issues/52#issuecomment-6251420102).
- Approved canonical SHA-256: `eabc000b8cd3da7e9853e53dfaffc1403e26c6be704511277d762971301941e7`.
- Frozen issue-body SHA-256: `765d2614c53a483147b92a1d35cf47bb41344d0e9c92f8009461554845a93e56`. Historical Draft/Pending headers are interpreted through the approval comment, not rewritten.
- Execution authorization: the parent task delegates T18, S1–S6 under the owner's full-development instruction L1 in `odd/tasks/particles-build.md`. That authorization is separate from full-contract approval; this document is implementation evidence, not a new approval receipt.
- No token, dependency, legacy-style or coordination-file changes. No Git mutations or remote publication performed by the writer.

## Implementation

The six meaningful files are in `packages/ui/src/atoms/badge/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, root tone/treatment compound CVA recipe, internal decorative-part recipe and controls metadata |
| `useBadge.ts` | Passive defaults, native prop forwarding, data attributes, optional-icon derivation and per-part `cn()` |
| `Badge.tsx` | Root span, optional hidden leading span and consumer text, consuming the hook |
| `Badge.test.tsx` | Hook, DOM, keyboard passivity, merge invariants, twelve combinations and rerender alternatives |
| `Badge.stories.tsx` | Default, Tones, Solid and WithIcon |
| `index.ts` | Named public component, three types and `badgeVariants` |

**No stylesheet.** Only production `types.ts` is scanned into shipped utilities. Story layout sources stay in Storybook. The public root is `eg-badge`; no new public part markers or legacy `.eg-tag`/`.eg-status` classes are emitted.

Badge defaults to neutral/soft, with six tones and two treatments. Soft uses the approved 30% border / 8% fill and edge shadow; brand uses its existing alpha/red tokens. Solid uses transparent borders, no edge shadow and the approved black foreground. Typography is `font-sans text-label-default`; fractional spacing and the 14px icon wrapper derive from the existing spacing scale.

There is no automatic icon, Radix behavior, ref, `asChild`, size axis, live region or component-owned event. The native span inheritance is retained exactly as contracted: consumers must not add interaction or interactive descendants. `children: ReactNode` is required; meaningful short non-empty text remains a consumer responsibility, not a new runtime validation or truncation policy. Absent/null/boolean icons produce no wrapper; a supplied numeric zero is retained as decorative content.

Root `className` supports outer margin/alignment/flex layout only and is merged last. Known Tailwind conflicts merge through `cn()`; arbitrary appearance overrides, selector precedence and universal last-class-wins behavior are not promised. The internal icon wrapper has no consumer override API.

### Composition and registry

The actual public Icon, Text/Heading, Surface, Slot, VisuallyHidden and Spinner APIs exist in this checkout. Badge itself requires none of them. WithIcon and packed fixtures use the real `Icon name='check' className='size-3.5'` API: Icon explicitly supports spacing-scale size overrides.

The catalogue's old mandatory Icon composition was corrected to a consumer-supplied decorative slot, matching already-approved D7, not a new product decision. Text/Heading remain in existing packed fixtures; Badge's contracted label is a text node, not a new Text composition.

Exact existing approved naming entries used:

| Prop | Convention | Component-specific type |
| --- | --- | --- |
| `tone` | `surface-material-tone` | `BadgeTone` |
| `variant` | `visual-treatment` | `BadgeVariant` |
| `icon` | `leading-icon` | `ReactNode` |

The current approved tone wording already includes component-specific semantic status families. No convention wording, approval, exception, receipt or immutable predecessor pin was changed. Each appended usage identifies `packages/ui/src/atoms/badge/types.ts#BadgeProps` at whole-file SHA-256 `81d97cd46835e08a2ed5d846d352642ef9230661b4dcfe04d7e4be921c7d6f3e`. Native `children` and `className` are not new naming conventions.

## Acceptance coverage

| Criterion | Observed automated evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 | Native span, neutral/soft defaults, public marker, text and no automatic icon; unit and packed SSR/CSR | Visual comparison Not evaluated |
| AC-02 | Decorative wrapper before text, `aria-hidden`, real Icon composition and optional-icon alternatives | Real assistive-technology reading Not evaluated |
| AC-03 | All twelve tone/treatment combinations in hook/CVA tests and packed SSR/CSR; emitted token/opacity/geometry/shadow rules | Pixel/computed-style/contrast comparison Not evaluated |
| AC-04 | No default role, live region or tab stop; user-event skips Badge | Browser keyboard and axe scan Not evaluated |
| AC-05 | Consumer margin conflict resolves last without losing marker, typography or tone | No arbitrary appearance override permission |
| AC-06 | Native id/title/data/ARIA forwarding | No ref promise |
| AC-07 | Real static CVA source scan, built CSS assertions, packed native CSS and Tailwind paths on React 18.3.1 and 19.3.0 | Browser rendering Not evaluated |

Real docgen and installed extraction/enhancer/inference tests cover required children, full enums, defaults, native rows, false controls with reasons, and zero owned-metadata diagnostics. They do not certify actual Controls widgets. The installed pipeline formats finite string-enum defaults as `"neutral"` / `"soft"` in Docs from bare JSDoc defaults. Shared TypeScript literal interning may reorder enums; tests preserve actual extracted option order and verify the complete Badge choice set without disturbing Gauge's existing assertions.

Tailwind expands named `shadow-edge` into the canonical value plus its optional `--tw-shadow-color` override rather than retaining `var(--shadow-edge)`. Export and packed checks compare that expansion against the existing token source. No styling exception or guard allowlist was broadened; earlier component checks remain intact.

## Observed test-first lifecycle

- Initial missing-module run: one failed suite, no tests collected; not claimed as the behavior-level RED.
- Behavior RED: 16 failed / 6 passed out of 22. Fifteen failures exposed the missing tone/treatment utilities; one exposed missing initial props in the hook test fixture, which was corrected explicitly.
- GREEN: all 22 Badge tests passed after the compound recipes and fixture correction.
- Integration RED: missing public barrel export and native metadata rows were observed before integration. An early metadata run also exposed enum interning order and an incorrect expectation about Storybook's quoted enum defaults; those test assumptions were corrected, not the public API.
- CSS/export RED against the pre-Badge build: 22 passed / 2 failed, for missing Badge utilities and root exports. After rebuilding, one incorrect shadow-token assertion was corrected to match the observed Tailwind expansion.
- TRIANGULATE/REFACTOR: all twelve combinations, absent/null/false/numeric icons, native forwarding, layout merging, passivity and removal of stale icon/tone state pass. Story labels were simplified to a typed lookup while retaining the four required examples.

## Final observed validation

All listed commands ran in the foreground. Build preceded tests because tests consume built token CSS. Earlier exploratory failures are recorded above; final gate outcomes are below.

| Exact command | Observed result |
| --- | --- |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/badge/Badge.test.tsx --maxWorkers=2` | 22/22 passed |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/badge/Badge.test.tsx packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2` | 128/128 passed across 3 files |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Passed |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Passed |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Passed; JavaScript, declarations and 195.60 kB UI CSS emitted |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | 509/509 passed across 27 files |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Registry valid, generated view current |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | 82/82 passed, including immutable receipt assertions |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | 24/24 passed; 47 reachable declaration files |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | 12/12 passed: entries, strict types/negatives, SSR, CSR and native/Tailwind CSS for each React major |
| `python3 -B scripts/build_catalog.py` | Regenerated 107 catalogue rows; only Badge data changed |
| `pnpm props:docs` | Regenerated the registry view |

Packed fixtures retain one React type import and all earlier component/type/composition checks, especially Surface, `surfaceVariants`, `ComponentProps`, Icon and Text/Heading. DOM identity checks use booleans, never node equality in `node:assert`.

## Main integration repair — Slider baseline

The parent started the merge of `origin/main` at `05591b1` (Slider #158) into Badge PR #159. This bounded repair resolves the seven shared-file conflicts by preserving main and adding only Badge's existing contract. Git staging, merge completion, installation, full gates and publication remain parent-owned.

- Resolved `.storybook/main.ts`, both package test scripts, Controls metadata tests and naming source/tests/view as additive unions. Auto-merged root exports, docgen tests, production/story CSS sources and catalogue retain all main implementations plus Badge; no open-PR component is introduced.
- Registry changes against main are exactly Badge's three reviewed usages. Convention semantics, scoped approvals, historical receipts, predecessor pins and source revisions are unchanged; the generated naming view was regenerated, not hand-edited. The catalogue generator retains 107 rows with only Badge differing from main.
- Packed fixtures retain one React type import, independently closed samples, every main import/type/App prop/render/strict negative, Badge's six strict negatives, CSS helpers and all three CSS harness calls. Badge SSR/CSR scenes and summaries coexist with Slider keyboard/change/commit/form checks, RadioGroup/Switch controlled/disabled/reset/FormData scenes, Tooltip focus/portal/Escape, ProgressBar clamps/rerenders and Input/Textarea native scenes. Shared FormData/File/ResizeObserver globals remain available through the final scene. DOM identity assertions remain boolean comparisons.
- The exact seven-selector transition guard and twelve rejection cases, including `shadow-extra`, are unchanged from main. Badge adds no transition permission. Runtime/declaration inventories retain `sliderVariants`, `radioGroupVariants`, `progressBarVariants`, `tooltipVariants`, all prior public recipes and `badgeVariants`; Slider's private-part exclusions remain intact. The packed token pin remains 255.
- No component/API, token, dependency, manifest, lockfile, legacy CSS or coordination file was edited by this repair. No new behavior was introduced, and strict TDD was not activated; the earlier lifecycle above belongs to the original implementation, not this merge repair.

| Exact repair command | Observed result |
| --- | --- |
| `node scripts/prop-naming.mjs --write` | Generated naming view regenerated |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 107 catalogue rows regenerated |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/badge packages/ui/src/atoms/slider packages/ui/src/atoms/radio-group packages/ui/src/atoms/switch packages/ui/src/lib --maxWorkers=2` | 342/342 passed across 14 files |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint` | Passed; 299 files, no fixes applied |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck` | Passed |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm props:check` | Registry valid, generated view current |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props` | 82/82 passed, including immutable receipt checks |

These are focused source/metadata/registry results only. Full build, built exports and packed React 18/19 consumption must be rerun by the parent against the merged tree; the original pre-merge gate results above do not certify it. Browser/visual/Controls/axe evidence remains Not evaluated. CodeGraph was uninitialized; targeted readback was used because index creation was outside the allowed edit surfaces.

## Deferred browser review — Not evaluated

Expected-design references remain the originals pinned to `e08f007ee71af90e97cec2cd3f7dd2a880364314`:

- [VIS-01 StatusBadge.png](https://raw.githubusercontent.com/egdev6/egdev-design-system/e08f007ee71af90e97cec2cd3f7dd2a880364314/docs/design/foundation-boards/v2026-10-17/StatusBadge.png): SHA-256 `3c3c0421264526cb3cd40ed531cb2f47445ef63810bf804aa643118536d6d2d3`.
- [VIS-02 Tag.png](https://raw.githubusercontent.com/egdev6/egdev-design-system/e08f007ee71af90e97cec2cd3f7dd2a880364314/docs/design/foundation-boards/v2026-10-17/Tag.png): SHA-256 `ae23d314b0ba27b9c7b72b0da84a7e7e1a4d1f8cb540beace2ec0848c9ca1b54`.

Their approval/provenance comes from the recovered issue, not a fresh image download or capture in this task. No reference image was replaced or synthesized. The contract's expected conditions are Chromium 148, 1280×900, DPR 1, dark canvas, loaded Barlow fonts and no reduced motion. Allowed differences remain the 14px label recipe and brand pill/sentence-case treatment instead of Tag's uppercase rectangle.

Owner review on main should compare pill geometry, tone colors, border/edge treatment, icon sizing/order, actual Controls widgets, keyboard passivity, assistive-technology reading and contrast/axe results. Visual conformity, browser accessibility, browser Controls, automated axe and screenshots are **Not evaluated**. Unit/metadata/CSS/SSR/jsdom evidence is not browser evidence. No Storybook server or CI run was started or claimed.
