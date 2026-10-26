# Button v0.1 implementation

## Authority and scope

- Contract: [issue #53](https://github.com/egdev6/egdev-design-system/issues/53), v0.1; [full-contract approval](https://github.com/egdev6/egdev-design-system/issues/53#issuecomment-6251422908).
- Approved canonical payload SHA-256: `d608085e32f0a5b4dcaeef47ca95de694b6d08ce6ebfd6f74052a02f747552fa`; frozen issue-body SHA-256: `e02dac1cdde48fec62ca2b8d1da24f25f48ea4a1e7d324c0f66b21a1b3c8f97d`.
- Implementation authorization: `odd/tasks/particles-build.md`, T19/S1–S6/L1, with the coordinating task's separate concrete Button v0.1 plan approval. This is parent-provided execution authority, not another owner quotation or full-contract approval.
- Naming: [forwarded owner approval record](prop-naming-approval.json), separate from the contract and implementation plan. The owner approved only Button's decorative start/end slot, with end as default.
- No tokens, dependencies, legacy rules, coordination files or historical approval receipts changed. **No stylesheet.** No internal helper modules.

## Implementation plan and public API

The six component files retain distinct responsibilities:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public `ButtonProps`, `ButtonSize`, `ButtonVariant`; root/icon CVA recipes and control metadata |
| `useButton.ts` | Defaults, state derivation, activation guards, ARIA/data attributes, per-part `cn()` |
| `Button.tsx` | JSX, React 18-compatible `forwardRef`, Radix Slot/Slottable, decorative Spinner |
| `Button.test.tsx` | Hook, native/Slot behavior, keyboard, focus, refs, recovery and layout merge tests |
| `Button.stories.tsx` | Real defaults, variants, sizes, icons, disabled/loading, navigation and layout |
| `index.ts` | Named component and public types; CVA and hook stay package-internal |

Exports: `Button`, `ButtonProps`, `ButtonVariant`, `ButtonSize`. The native default is `type="button"`; navigation uses a single compatible child with `asChild`, never a Button `href` prop. Native keyboard/focus behavior is not recreated. Slot owns child composition and refs; a capture-phase guard suppresses disabled/loading activation before child-first bubbling handlers run.

Loading replaces the decorative icon at its configured side, retains the visible label, marks busy/disabled semantics and keeps focus. The consumer owns announcements. Explicit disabled takes precedence and removes a slotted link from tab order. Child components must spread root props and forward refs; conflicting state or appearance overrides are not supported. The public ref signature remains the contract's `HTMLButtonElement` signature; Slot forwards it to the actual child host at runtime, not a polymorphically inferred anchor type.

`className` supports root margin, alignment, placement and width. `cn()` merges it last; recognized utility conflicts resolve through `twMerge`, not universal CSS precedence. The internal icon span has no class prop. `eg-btn` and `eg-btn__icon` remain public markers, with no emitted legacy modifier/state classes. Token-backed utility resets override the retained legacy root, active, focus and icon rules, including `box-border`, solid borders, explicit typography, backgrounds, shadows, `transform: none`, and independent CSS translate/scale.

Material recipes use the approved existing gradients, border/shadow tokens, focus replacement, disabled opacity, pressed scale and motion preferences. Hover lift/primary-secondary hover paint exclude active state so pressed treatment wins; hover/pressed shadows exclude focus-visible so focus replaces Material shadows. No browser parity is inferred from these source/CSS checks.

## Exact naming coverage

| Prop | Convention |
| --- | --- |
| `variant` | `visual-treatment` |
| `size` | `preset-dimensions` |
| `icon` | `leading-icon`, **Button-only semantic exception** |
| `iconPosition` | `icon-placement` |
| `loading` | `pending-activity` |
| `asChild` | `slot-composition` |

Native props, required `children` redeclaration and `className` do not introduce new conventions. Source evidence binds the reviewed `ButtonProps` whole-file bytes; the generated [registry view](../../../prop-naming.md) records them.

The actual registry `exceptions` schema requires an alternative prop name, so it cannot encode a same-name semantic exception. This implementation uses the established `semanticAmendments` receipt/projection mechanism instead: only `leading-icon.meaning`, `whenToUse` and `avoid` append explicit Button-only language; other components retain all previous restrictions. The canonical name, aliases, empty alternate-name exceptions and status remain unchanged. The new record pins eight historical receipts, and tests project the pre-image back for historical snapshot checks. No immutable registry snapshot or approval receipt is re-pinned. Tests also distinguish a schema-valid refreshed hash from actual content-bound approval; neither grants global trailing-icon permission.

## Observed automated evidence

Strict test-first sequence:

1. Initial focused test could not resolve the unimplemented Button import.
2. With a minimal native scaffold, all 10 original behavior tests failed: absent non-submit default, unwanted form submission, missing disabled/loading semantics, missing Slot composition and layout merge behavior.
3. Implemented the contract; the same 10 tests passed. Alternate cases expanded Button coverage to 16 tests.
4. Naming test first failed because the scoped approval record was absent; after the bounded amendment, naming passed 83/83. Historical receipt assertions remain active.

| Criterion | Observed evidence | Boundary |
| --- | --- | --- |
| AC-01 | Native role/name, type, root and idle hook tests | No pixel claim |
| AC-02 | Click/Enter/Space activation and submit override | Native behavior in jsdom |
| AC-03 | Disabled native action, skipped tab stop, suppressed callbacks | Browser appearance deferred |
| AC-04 | Slotted anchor, href, both icon sides, forwarded/child refs, disabled guards/tab order | Packed client refs exercised on React 18.3.1 and 19.3.0 |
| AC-05 | Busy/disabled/state, decorative Spinner, focus retention, recovery and disabled precedence | Consumer announcements remain consumer-owned |
| AC-06 | Decorative span and start/end order, including inside Slot | No accessible icon announcement |
| AC-07 | Stable marker and root layout merge precedence | Appearance overrides unsupported |
| AC-08 | Four treatments and both sizes covered structurally; CVA utilities emitted | **Visual conformity: Not evaluated** |
| AC-09 | Reduced-motion utilities and focus token emitted | **Browser motion/focus appearance: Not evaluated** |
| AC-10 | AST scan checks every static root/icon CVA utility; packed CSS works with and without an application Tailwind compiler | Build/static checks, not computed geometry or pixels |
| AC-11 | Seven own props extracted through real docgen and installed extraction/enhancer/inference; zero owned diagnostics | **Actual browser Controls: Not evaluated** |

Latest required gate results (all foreground, one at a time):

| Exact command | Result |
| --- | --- |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Passed; 238 files at this implementation checkpoint |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Passed |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Passed before tests; JavaScript, declarations, native tokens and utility CSS |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | Passed: 502 tests, 27 files |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Passed; source evidence and generated view fresh |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | Passed: 83 tests |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | Passed: 24 tests; 47 reachable declaration files |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | Passed: 12/12; React 18.3.1 and 19.3.0 strict types/negatives, SSR, client refs/activation and CSS; one React/ReactDOM instance per bundle |

Focused command: `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/button/Button.test.tsx packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2` — passed 121 tests across 3 files.

Intermediate failures were resolved, not classified as environmental: the Controls composition allowlist initially omitted Button; CSS assertions initially expected direct numeric translate/scale instead of Tailwind's custom-property bindings; a redundant Spinner descendant sizing selector tripped the existing no-Spinner-stylesheet guard and was removed; a packed standalone Spinner count was scoped to its own section after Button introduced another decorative Spinner. The final packed fixture retains every existing component, Surface/surfaceVariants and the single React type import including ComponentProps.

## Expected design and deferred browser checks

Approved references were read and local byte hashes verified without replacing or modifying them:

- VIS-01: `docs/design/foundation-boards/v2026-10-17/Button.png`, SHA-256 `bdf100bc73e73b3817d4a82251f1082ec6a4c3e2d5f5e3601ab7cfad01f32be1`.
- VIS-02: `docs/design/foundation-boards/v2026-10-17/specimens/button--specimen.png`, SHA-256 `566c7a0e5cd33d4d17e29fdeb7cf9fff6ad031bbe6cec7f9d69b9953dfa0e425`.

Allowed contract differences remain D9 (token borders/no text shadow), D10 (token shadow plus hairline ring), D11 (recipe typography line heights) and D12 (16px small icon). No additional product/API differences are claimed. The naming exception changes no approved Button behavior.

**Not evaluated:** comparable implementation captures against VIS-01/VIS-02, real hover/pressed/focus visuals, computed geometry without preflight, keyboard focus ring appearance, browser reduced-motion emulation, actual Storybook Controls widgets and assistive-technology announcements. Owner review is deferred to Storybook on integrated main under S3. No watch/server or browser session was launched, no CI run is claimed, and no git mutation or PR publication was performed by the writer.

## Proposed commit slices (parent-owned)

Keep complete tests with their helpers/imports; do not split test files by prefix.

1. `feat(ui): implement Button with scoped icon naming approval`
   - `packages/ui/src/atoms/button/types.ts`
   - `packages/ui/src/atoms/button/useButton.ts`
   - `packages/ui/src/atoms/button/Button.tsx`
   - `packages/ui/src/atoms/button/Button.test.tsx`
   - `packages/ui/src/atoms/button/Button.stories.tsx`
   - `packages/ui/src/atoms/button/index.ts`
   - `packages/ui/src/index.ts`
   - `packages/ui/src/styles/compiled.css`
   - `.storybook/main.ts`
   - `.storybook/preview.css`
   - `packages/ui/src/lib/storybook-controls.test.ts`
   - `packages/ui/src/lib/storybook-docgen.test.ts`
   - `skills/_shared/prop-naming.json`
   - `docs/prop-naming.md`
   - `scripts/prop-naming.test.mjs`
   - `docs/components/button/v0.1/prop-naming-approval.json`
   - `scripts/package-exports.test.mjs`
   - `scripts/package-consumption.test.mjs`
2. `docs(ui): catalogue Button and record implementation evidence`
   - `scripts/catalog_data.py`
   - `docs/CATALOGO.md`
   - `docs/catalog.json`
   - `docs/components/button/v0.1/implementation.md`

The implementation/registry/metadata/packed checks form one coherent first slice: splitting those exact-export assertions or source-hashed usages away would leave an intentionally inconsistent intermediate tree. The second slice changes catalogue descriptions and evidence only.

## Ready English PR body

```markdown
## Summary

Implements the approved Button v0.1 contract from #53.

- Native non-submit action or Radix Slot/Slottable navigation, with forwarded DOM refs.
- Four token-backed Material treatments, md/sm sizes and decorative Icon/Spinner slots.
- Focus-retaining pending state, guarded repeated activation and native/slotted disabled semantics.
- Button-only start/end icon naming exception, default end, recorded separately from contract/plan approval. Other components retain leading-icon restrictions; historical receipts and snapshots are unchanged.
- Real Storybook metadata tests, static CVA CSS scan, catalogue updates and packed consumer coverage. No new tokens, dependencies or component stylesheet.

## Verification

Strict TDD observed 10 behavior failures before implementation, then passes; final Button coverage is 16 tests. Naming's missing-record failure was observed before its scoped approval record was added.

All local gates passed:
- lint and typecheck
- build before tests
- 502 unit/metadata tests across 27 files
- props:check and 83 naming tests
- 24 package-export checks (47 reachable declarations)
- packed matrix 12/12: React 18.3.1 and 19.3.0, strict positive/negative types, SSR, client refs/loading recovery/disabled composition, CSS with and without application Tailwind, single physical React/ReactDOM instance per bundle

No CI run is claimed. Execution commands, intermediate failures and final evidence are in docs/components/button/v0.1/implementation.md.

## Deferred review

Not evaluated: visual parity with VIS-01/VIS-02, browser hover/pressed/focus and reduced-motion appearance, computed geometry, actual Controls widgets and assistive-technology announcements. Owner Storybook review remains deferred to integrated main under particles-build S3.

Legacy CSS/consumers are preserved. No implementation screenshots replace the approved expected-design images.

Closes #53
```
