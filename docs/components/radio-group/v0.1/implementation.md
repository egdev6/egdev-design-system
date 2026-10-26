# RadioGroup v0.1 implementation evidence

## Contract and authorization

- Frozen contract: [issue #66](https://github.com/egdev6/egdev-design-system/issues/66), whole-body SHA-256 `cdfa864012ff3720fb3cbfd9f0e7d5b23923cbbf86ef2596cbfbdcc7f40065b6`, canonical SHA-256 `aeda1af8cd2d506fe6b37c6c9065f50202a755a64ac5625680fd39023ae69325`.
- [Owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/66#issuecomment-6251457813) supersedes the frozen Draft/tracking metadata only. It approves the full contract and scoped expected design, not implementation conformity.
- Expected design: [VIS-01, radio-group--specimen.png](https://raw.githubusercontent.com/egdev6/egdev-design-system/e08f007ee71af90e97cec2cd3f7dd2a880364314/docs/design/foundation-boards/v2026-10-17/specimens/radio-group--specimen.png), SHA-256 `552c1a52fe3188a49ecf94007a81f6fc322cefa94cd1b63140da75fb1fdff343`. The approval record identifies the reference; this implementation did not recapture or replace it.
- Implementation authorization is the parent's explicit full-batch development instruction (T16, S1–S6), separate from contract approval. S1/S2 scope this atom; S3 defers owner visual review to Storybook on main; S4 permits only the approved Radix dependency; S5 is satisfied because no other system component is composed; S6 governs local gates and delivery. The parent owns all Git mutations and PR publication.
- The parent already pinned and installed `@radix-ui/react-radio-group` 1.5.1 in `530f193`. This implementation changes neither dependencies nor tokens. Coordination files and `.atl/` remain untouched and must not be committed.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Behavior base | Individual-package `RadioGroupPrimitive.Root`, `Item` and `Indicator`. Radix owns roles, roving focus, keyboard selection, controlled/uncontrolled state and hidden form inputs. No interaction is reimplemented. |
| D2 API shape | Required ordered `options` data, not compound exports or custom item rendering. |
| D3 Option shape | `RadioGroupOption = { value: string; label: string; disabled?: boolean }`; values must be unique and non-empty. No descriptions. |
| D4 Group naming | Required `label` maps to root `aria-label`; consumer `aria-labelledby` may take precedence. Each visible native label targets its radio through a `useId()`-derived id plus index. |
| D5 Orientation | Default `vertical`: column with `gap-1`; `horizontal`: wrapping row with `gap-x-6 gap-y-1`. Passed to Radix for its keyboard axis. |
| D6 Material | A 20px circular well using existing tokens; checked primary gradient, bevel/halo and 8px black dot. Focus wins over both shadow treatments. |
| D7 Rows | 40px minimum, label-default typography, secondary text brightening through `:has([data-state=checked])`; disabled rows dim through `:has([data-disabled])`. |
| D8 Size | No size axis. |
| D9 Stylesheet | No stylesheet. Production CVA literals are scanned through `compiled.css`; story layout utilities are scanned separately in Storybook. |

Six files implement the contract: `types.ts`, `useRadioGroup.ts`, `RadioGroup.tsx`, `RadioGroup.test.tsx`, `RadioGroup.stories.tsx`, `index.ts`. No internal module or component stylesheet was added. The public exports are `RadioGroup`, `RadioGroupProps`, `RadioGroupOption`, `RadioGroupOrientation` and `radioGroupVariants` (an object of `root`, `row`, `item`, `indicator`, `label` CVA recipes). The hook composes every part through `cn()`; only root `className` is consumer-controlled, merged last for outer layout such as margins/alignment. Known utility conflicts merge; arbitrary appearance overrides, selector precedence and universal last-class-wins are not promised. There is no ref or `asChild` API and no legacy CSS migration.

Prop naming usages record reviewed `types.ts#RadioGroupProps` at `sha256:4ca31d93de621ebd92fb4d19375b50baffcf633301bde23f3b4cc91b5fef88bf`: `accessible-name`, `choice-options`, `primary-value`, `initial-uncontrolled-value`, `interactive-value-change`, `layout-orientation`. All six already have approval records in the registry; no convention is promoted or redefined. `disabled`, `required`, `name` remain native-equivalent semantics. Historical receipt tests exclude only these exact new convention/source pairs.

## Implementation details, not contract changes

- Native radio buttons need `box-border p-0 border-solid` because the package ships no preflight. These resets preserve the specified circle geometry.
- Explicit `shadow-[var(...)]` references and `bg-[image:var(--gradient-btn-primary)]` preserve the approved token recipe. `ease-out` resolves to the token theme's `--ease-out`, not a Tailwind default theme.
- The checked utility is emitted after plain focus-visible at equal specificity. The additional checked+focus-visible shadow variant ensures the focus ring beats the checked halo; the CSS export test verifies it. Checked border also follows the hover border.
- Radix defers arrow-key focus and checks the radio while the arrow is held. Tests press and release separately so the deferred focus runs before keyup; no Radix keyboard behavior is mocked.
- Packed CSR forms expose `HTMLFormElement` and stub `ResizeObserver`, missing from that jsdom harness. DOM identity checks use boolean assertions, never `node:assert` equality on DOM nodes.
- The packed fixture retains the authorized repair for main's missing `Surface`, `surfaceVariants` and `ComponentProps` imports, with a single React type import.

## Acceptance evidence

| ID | Observed evidence |
| --- | --- |
| AC-01 | Unit, SSR and packed SSR/CSR: named radiogroup, ordered radio buttons, associated visible labels and stable `eg-radio-group` marker. |
| AC-02 | Real Radix/user-event tests: Tab entry on checked or first enabled option, both arrow axes, wrapping, skipping disabled options, selection callbacks, Space selection and Tab exit. Browser keyboard verification: Not evaluated. |
| AC-03 | Unit and packed CSR label/item clicks select; re-clicking a checked item emits nothing; checked radio mounts the indicator and exposes ARIA/data state. |
| AC-04 | Unit and packed: absent/default/controlled selection, controlled consumer updates, frozen controlled value, unknown value checking nothing and empty options. |
| AC-05 | Unit/packed disabled option and group checks; disabled row dimming utility is emitted. Browser computed dimming: Not evaluated. |
| AC-06 | Unit CVA invariants and built-CSS assertions cover row/20px circle/8px dot, Material tokens, checked/hover/focus precedence and no mirrored state classes. Browser computed styles and comparison with VIS-01: Not evaluated. |
| AC-07 | Unit/packed form inputs expose `name`, `required` and `aria-required`, submit the checked value, and reset to initial selection. Native browser form validation: Not evaluated. |
| AC-08 | Unit/packed instance ids are unique; labels target the correct radio. Ids are not used for styling. |
| AC-09 | Unit/packed root margin merging preserves the public marker; rows/items take no consumer classes. |
| AC-10 | Build, export tests and external packed consumers verify CSS emission, strict positive/negative types, SSR/CSR, React deduplication, native Vite CSS without Tailwind and an application Tailwind build. |

Docgen/Controls tests cover all nine own props, requiredness, finite orientation options, constant defaults, justified disabled controls for options/handler, native row allowlisting and zero enhancer diagnostics. They exercise real parser metadata and the installed extraction/enhancer/inference pipeline, not browser widgets. Stories: Default, Controlled, Horizontal, DisabledOption, DisabledGroup.

## Local validation

The earlier implementation attempt observed RED before `RadioGroup` existed (focused import failure), then GREEN with 22 component tests. This resumed pass inherited that RED evidence; it did not recreate a missing component. Focused checks passed before and after the per-part `cn()` refactor: 122 tests in three files. Lint initially found one formatting-only error in the new export assertion; it was fixed and lint passed.

Full gates ran one at a time under `flock /tmp/egdev-gates.lock`, with `timeout 900 systemd-run --user --scope -q -p MemoryMax=3G`; Vitest used `--maxWorkers=4`. Build preceded the full tests. The packed matrix additionally held `/tmp/egdev-packed.lock` with timeout 1500 and MemoryMax=2G. Focused Vitest used timeout 300, MemoryMax=2G and `--maxWorkers=2`. No timeout or memory-limit failure occurred.

| Gate | Observed result |
| --- | --- |
| `pnpm lint` | Passed; 220 files, no fixes applied. |
| `pnpm typecheck` | Passed; root and workspace commands. |
| `pnpm build` | Passed; UI JS/declarations and 191.39 kB compiled CSS emitted. Effects retains its existing placeholder command. |
| `pnpm test --maxWorkers=4` | 406 passed, 24 files; includes 22 RadioGroup tests. |
| `pnpm props:check` | Registry valid; generated view current. |
| `pnpm test:props` | 82 passed. |
| `pnpm test:package-exports` | 20 passed; 40 reachable declaration files. |
| `pnpm test:package-consumption` | 12 passed across React 18.3.1 / 19.3.0 (entries, types, SSR, CSR, CSS). |

## Remaining review

Visual conformity, browser Controls widgets, browser computed styles, touch-target measurements and assistive-technology announcements are **Not evaluated**. They remain for the owner's S3 Storybook review on main; no server or browser was started. All recorded functional checks are local. Workflows are intentionally disabled while private; no CI run, independent review, commit, push or PR publication is claimed.
