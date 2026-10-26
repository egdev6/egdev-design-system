# Toggle v0.1 implementation evidence

## Authority and scope

- Contract: [issue #74](https://github.com/egdev6/egdev-design-system/issues/74), v0.1, recovered with its comments. [Full-contract approval](https://github.com/egdev6/egdev-design-system/issues/74#issuecomment-6251480687) is distinct from execution permission.
- Recorded canonical SHA-256: `b1331b91dcfced50afecdbc10ea669a70144a3e4c3ef00708bad5eacf6a6db65`; frozen body SHA-256: `2083d6989b26f15b8ffbe6f184a7ce3353ef0e0d61c84e77ce83fc870de06b2d`.
- Execution: the parent separately approved the exact bounded implementation plan under the owner's full-batch development delegation (`odd/tasks/particles-build.md`, T21, S1–S6, Log L1). That delegation is not a new contract or registry approval.
- Naming: the owner independently selected **“Aprobar excepción para Toggle”**. The [separate receipt](prop-naming-approval.json) is assistant-recorded forwarded explicit interactive approval, not native, signed or independent review. It grants only Toggle's required icon-only `icon` alongside a required accessible `label`; the labelled-text branch is unchanged.
- No dependency installation or manifest/lockfile changes. The parent-prepared `@radix-ui/react-toggle` 1.2.1 is used. No token changes, stylesheet, extra internal module, public recipe export or `asChild` API.

## Composition and architecture

The current public barrel and Icon API were inspected, rather than relying on stale availability prose in older shared documents. Icon is available with its actual closed `name` set and `sm`/`md`/`lg` presets. Text/Heading, Surface, Slot, VisuallyHidden and Spinner remain available and retained in packed fixtures; Toggle does not require a new implementation of any of them. Its examples use the merged `Icon` (`bookmark`), not unavailable Button/IconButton APIs.

The six meaningful component files are `types.ts`, `useToggle.ts`, `Toggle.tsx`, `Toggle.test.tsx`, `Toggle.stories.tsx` and `index.ts`. CVA selects static token utilities in `types.ts`; the hook calls `cn()` separately for the root and icon. Radix owns state, activation, focus, keyboard and ARIA. AccessibleIcon supplies the icon-only name; text-form icons are hidden. The root always remains a button, forwarding its ref, native attributes and handlers while stripping runtime attempts to override `asChild`, `aria-pressed` and `data-state`.

**No stylesheet.** The public root is `eg-toggle`; the named Tailwind group is internal. Existing legacy CSS is unchanged. The selected recipe consumes sheen, surface-3, hairline-strong and edge-strong/elev-1 tokens. Focus shadows override selected shadows. Border-box, zero block padding/margin, solid 1px border and explicit background/shadow resets keep native button geometry independent of preflight. Reduced motion resets both CSS `scale` and `transform` and removes transitions.

`className` is merged last for root outer layout only. Known conflicting utilities are merged; arbitrary selector or appearance override precedence is not promised. The icon slot is private. Supplied SVGs are decorative, non-interactive and use the slot geometry/currentColor; do not insert nested controls.

## Exact naming usages and lineage

`ToggleProps` records six reviewed usages, each pinned to the whole `types.ts` source bytes:

| Prop | Approved convention |
| --- | --- |
| `pressed` | `pressed-state` |
| `defaultPressed` | `initial-uncontrolled-pressed` |
| `onPressedChange` | `pressed-change` |
| `size` | `preset-dimensions` |
| `label` | `accessible-name` |
| `icon` | `leading-icon`, with the Toggle-only semantic amendment |

The amendment changes only `meaning`, `whenToUse` and `avoid`, retaining the canonical name, status, aliases and empty alternative-name `exceptions`. It binds predecessor `convention:leading-icon` hash `sha256:b680df32f87ea2cd2592faa56782bb458d91a8a941b413e7740121f84954e5dd` to the Toggle-scoped hash `sha256:a32eb28ca98d0b726758cac132be9e68dda855b16e1bdf399944d64ea7ae91e0`. Tests verify exact before/after text, restrictions on every other component, all eight historical receipt byte hashes, source freshness, and historical registry projection. Refreshing a broadened hash is explicitly tested as insufficient evidence of consent.

**Integration constraint:** Button, Toggle and IconButton amendments are independent branches from the same historical convention. Do not choose one registry side or rewrite/re-pin their frozen receipts. Union only separately approved permissions in a subsequent integration record that pins the independent receipts. The current test chain is linear and current-content assertions bind this worktree's exact snapshot; integration must extend lineage/projections to retain each sibling snapshot and validate the combined current convention. Repeated amendments of the same ID must project to the appropriate historical pre-image, not merely the last encountered predecessor. This task grants no permission to Button or IconButton.

## Observed test-first evidence

- Initial focused RED: the new behavior-level Toggle test file failed to import the not-yet-implemented `./Toggle` module (no assertions ran).
- Focused GREEN after implementation: 12 Toggle tests passed. Triangulation added outer Slot/ref composition and prevented activation/form submission: final Toggle coverage is 14 tests.
- Metadata RED: missing native `disabled` extraction and public barrel registration; after integration the combined Toggle/docgen/installed Controls pipeline passed 139 tests across three files, with no owned-metadata diagnostics.
- Naming RED: missing scoped receipt, 82 passed / 1 failed; GREEN: 83 passed, including immutable history and broadening negatives.
- Export RED before rebuilding: missing Toggle selectors/export and exact transition-list guard. After rebuilding, assertions were aligned with Tailwind's actual scale-variable output and the exact declaration export list; GREEN: 27 passed.
- Packed fixture correction: an expected-error private value import inadvertently reached runtime. Changing that negative probe to a type-only import preserved private-export checking without breaking SSR/CSR; final matrix: 12 passed.
- Initial lint formatting/import-order failures and a docgen tag-map TypeScript error were corrected; final gate results are below. These are test/code corrections, not approved-contract deviations.

## Contract coverage

| Criteria | Observed automated evidence | Browser status |
| --- | --- | --- |
| AC-01 | Default button, root marker, off state and aria-pressed | Not evaluated |
| AC-02 | Click, Enter, Space and next-value callbacks | Not evaluated |
| AC-03 | Controlled state waits for props; incoming changes emit nothing | Not evaluated |
| AC-04 | defaultPressed initializes on | Not evaluated |
| AC-05 | Text and icon-only names, hidden glyphs, both content forms | Not evaluated |
| AC-06 | Preset DOM classes and emitted state/Material utilities | VIS-01 conformity: **Not evaluated** |
| AC-07 | Disabled on/off controls block click and are skipped by Tab | Not evaluated |
| AC-08 | Root marker retained; supported outer-layout merging | Not evaluated |
| AC-09 | Emitted focus, motion-reduce transition/scale/transform rules | Visible focus and motion emulation: **Not evaluated** |
| AC-10 | Build, 27 export tests, packed native-CSS and Tailwind consumers | Pixel/computed-style parity: Not evaluated |
| AC-11 | AST union annotations, real docgen, registered enhancer and native inference; zero diagnostics | Actual Controls widgets: **Not evaluated** |

No contract/API deviations beyond the explicitly approved naming amendment. Non-empty, constant names and non-interactive short text/icon content remain consumer responsibilities; no arbitrary runtime content validation or new fallback policy was added.

## Initial implementation gates (before main integration)

All full gates run serially under `/tmp/egdev-gates.lock`, `timeout 900`, a 3 GB memory scope; unit tests use four workers. Build ran before tests reading compiled tokens. Packed consumption additionally holds `/tmp/egdev-packed.lock`, with `timeout 1500` and a 2 GB cap. Focused Vitest uses `timeout 300`, 2 GB and two workers.

| Gate | Final observed result |
| --- | --- |
| `pnpm build` | Pass; JS, declarations, compiled UI CSS and tokens |
| `pnpm lint` | Pass |
| `pnpm typecheck` | Pass |
| `pnpm test --maxWorkers=4` | 575 tests / 30 files passed |
| `pnpm props:check` | Pass |
| `pnpm test:props` | 83 passed |
| `pnpm test:package-exports` | 27 passed; 56 reachable declaration files |
| `pnpm test:package-consumption` | 12 passed: React 18.3.1 and 19.3.0, strict positive/negative types, SSR, CSR/ref cleanup, native/Tailwind CSS and React deduplication |

The packed fixture retains the single React type import, all previous component imports/examples, Surface/surfaceVariants/ComponentProps, Icon and Text/Heading checks. DOM identity uses boolean assertions, never node:assert equality on DOM objects. No CI run is claimed.

## Main integration export-guard correction

After integration with main `c83dee0`, the parent reported lint, typecheck, build, 620 unit tests and 83 naming tests passing, followed by an export-guard failure. The focused guard failure was reproduced locally: the built utilities additionally contain `transition-[border-color,box-shadow]`, required by both main's `inputControlVariants` and `textareaVariants`. Main's former `/\.transition-(?!none)\w/` check did not match escaped arbitrary-property selectors; Toggle's stricter exact-list guard exposed the missing approved entry.

Only the export guard was corrected; runtime, API, tokens, dependencies and recipes remain unchanged. The exact allowed utility set is now:

- `transition-none` (retained static/reset utility).
- `transition-[border-color,box-shadow]` (existing Input/Textarea recipes on main).
- `transition-[color,background-color,border-color,box-shadow,scale]` (unchanged approved Toggle recipe).

The same guard rejects injected `transition-all` and `transition-[opacity]` rules in negative regressions. Existing animation/keyframe guards remain unchanged. No blanket transition permission was introduced.

Observed correction checks, each under the shared gate lock, `timeout 900` and a 3 GB memory scope:

- `node --test --test-name-pattern='UI ships the approved Skeleton silhouette utilities with the canonical v0.2 pulse' scripts/package-exports.test.mjs`: RED, one failure identifying the additional Input/Textarea selector; GREEN, one passing test including both negative regressions.
- `pnpm test:package-exports`: 29 passed; 62 reachable declaration files.

The existing parent-built artifact was used without rebuilding. Full gates and packed consumers after this correction remain parent-owned; no new browser verification is claimed.

## Deferred browser review

The approved expected-design [VIS-01 specimen](../../../design/foundation-boards/v2026-10-17/specimens/toggle--specimen.png), SHA-256 `2da6461061708bb7f76444d37ecd778801cec5e6a4be6e0c1a63098a1710a821`, and its HTML were inspected as reference evidence, not implementation verification. Compare under the approved dark Chromium 1280×900, DPR 1 conditions, using the pinned capture metadata. Stories cover sizes, text/icon-only, initial/controlled state, selected/off and disabled controls; hover and focus must be exercised rather than simulated through mirrored classes.

**Not evaluated:** visual conformity to VIS-01, real hover/active/focus rendering, reduced-motion browser emulation, touch target/layout behavior, assistive-technology announcements and actual Storybook Controls widgets. No server, watch process, browser capture or visual approval was performed. The owner deferred batch Storybook review until main; automated results do not replace it.
