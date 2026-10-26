# Checkbox v0.1 implementation evidence

## Authority and scope

- Contract: [issue #54](https://github.com/egdev6/egdev-design-system/issues/54), v0.1, recovered with `gh issue view 54 --comments` and the complete issue body.
- [Full-contract approval](https://github.com/egdev6/egdev-design-system/issues/54#issuecomment-6251425828) identifies canonical SHA-256 `23873687ca13c7c7059f0bd9f99160100cb2ac98a4fe884da7624151e5ff8b8d` and frozen whole-body SHA-256 `c821911f5858b35b60a2dadaea4831de17c9fa97cb649b67ef4a00c5e8a34f2b`. Its historical Draft header is not the effective approval status.
- Separate implementation authority: the parent explicitly approved the unchanged bounded #54 implementation plan under the owner's full-batch development delegation in `odd/tasks/particles-build.md`, T20/S1–S6/Log L1. That parent approval is distinct from contract approval, not a new direct owner quote or a native review receipt.
- The parent prepared the worktree from main `49e1a22` and installed the approved frozen `@radix-ui/react-checkbox` dependency (1.4.1). This implementation changes no manifests, lockfile, tokens or dependencies, and performs no Git mutations.
- Prerequisite verified in the actual public source: Icon already exports `check` and `minus`, accepts a spacing-scale `size-3` className override, and hides decorative glyphs. Surface, Slot, VisuallyHidden, Spinner and Text/Heading are exported too, but #54 composes only Icon and Radix Checkbox. Future Field owns the row; it is not an implementation prerequisite or an imported API.
- Historical Foundation `components/Field/README.md` is absent from this checkout. The approved issue, local expected-design board and unchanged legacy `.eg-check` rules remain recoverable evidence; no sibling repository was read.

## Implemented anatomy and API

The six meaningful files are `types.ts`, `useCheckbox.ts`, `Checkbox.tsx`, `Checkbox.test.tsx`, `Checkbox.stories.tsx` and `index.ts` in `packages/ui/src/atoms/checkbox/`. **No stylesheet** and no extra internal module.

- Public exports: `Checkbox`, `CheckboxProps`, `CheckboxCheckedState` only. CVA recipes and the hook remain private to the package.
- One Radix root button (`eg-checkbox`), Indicator and Radix form input. `forwardRef<HTMLButtonElement>` targets the root.
- Radix owns controlled/uncontrolled state, focus, Space/Enter behavior, label activation, ARIA, form values and reset behavior. The hook only splits props/defaults and composes each part with `cn()`.
- Mixed state is `boolean | 'indeterminate'`, never an internal three-state cycle. The Indicator contains two decorative Icons; static Radix `data-state` child utilities hide the irrelevant glyph. This supports uncontrolled updates without duplicating checked state in React. The implementation detail does not expose public part selectors or a glyph API.
- Defaults: uncontrolled `false`, disabled/required `false`, submitted value `on`. Controlled `checked` and `name` are absent by default.
- No own label, size, children, onChange or asChild API. Consumers supply an accessible name and the composing 44px label target.
- CVA owns the fixed 18px box, unchecked Material well, checked/mixed gradient and primary shadow, danger border only when unchecked/invalid, 45% disabled opacity and state-specific focus shadow overrides. No hover or motion was invented.
- Native button resets (`box-border`, `p-0`, `border-solid`, `bg-none`, `appearance-none`) preserve the approved geometry without relying on an application preflight.
- Root className merges last for outer margin/self-alignment only. `cn()` resolves recognized utility conflicts, not arbitrary selector/cascade or appearance overrides. There is no indicator className prop.
- Exact existing convention: `checked-change` → `onCheckedChange`, `(checked: CheckboxCheckedState) => void`. Its meaning, approval and immutable receipts are unchanged. The other API fields are native-named form/state attributes per #54, not new conventions. The usage records the reviewed whole-file source hash; receipt tests filter only this exact post-receipt usage pair.

No product/API/token/dependency deviations from the approved contract. The two decorative glyphs and native resets are bounded implementation details, not expanded public promises.

## Test-first observations

1. Built packages before tests so `tokens.css` existed.
2. RED: the focused Checkbox test file failed to resolve `./useCheckbox` (implementation absent); no tests ran. This was the observed missing-implementation failure, not a behavioral assertion failure.
3. First implementation run: 10 passed, one form test failed because jsdom has no `ResizeObserver`. Added a local geometry-only observer stub; no Radix state, keyboard, focus or ARIA mocking.
4. GREEN: focused Checkbox suite passed **11/11**. Click/Space/Enter, controlled prop updates, uncontrolled checked/mixed changes, disabled focus/activation, label association, ref identity, form inclusion/exclusion/reset and per-part classes are covered.
5. Triangulation: combined Checkbox + real docgen + installed Storybook extraction/enhancement/inference passed **138/138**. Initial discovery-list mismatch was corrected additively; existing components and generic metadata cases remain.
6. Initial export CSS check failed because its matcher omitted Tailwind's emitted attribute/pseudo selectors after the escaped class. Fixed the matcher, not the production recipe; final exports passed **28/28**. Initial lint formatting/import-order findings were corrected within scope.

## Contract coverage

| Acceptance criterion | Observed automated evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 root/ref | DOM role, marker and button-ref identity; packed CSR on React 18.3.1/19.3.0 | None for this DOM/ref promise |
| AC-02 click/Space/Enter | Real Radix + user-event and callback assertions | Browser/assistive-technology interaction Not evaluated |
| AC-03 mixed | Mixed ARIA, Radix Indicator state and transition to true; emitted glyph-selection utilities | Actual visible minus/check rendering Not evaluated |
| AC-04 modes/defaults | Hook, controlled/uncontrolled DOM cases and real metadata defaults | None for tested state contract |
| AC-05 disabled | Focus skip, no activation, native disabled; shipped opacity/pointer/cursor utilities | Computed opacity Not evaluated |
| AC-06 focus/invalid | Correct native attributes and emitted state-specific focus/danger utilities | Browser computed styles and focus precedence Not evaluated |
| AC-07 expected design | Source board inspected and local hash verified; gradient/shadow/glyph utilities emitted | Visual conformity Not evaluated |
| AC-08 forms | Real Radix hidden input, name/value/required, checked-only FormData, disabled omission and reset; packed CSR/SSR | Browser validation UI Not evaluated |
| AC-09 label | Accessible name/description and actual label-click activation; packed CSR | Coarse-pointer target measurement Not evaluated |
| AC-10 styling/distribution | Static CVA source scanning, built utility declarations, packed Vite native CSS without Tailwind and with Tailwind | Pixel/computed-style parity Not evaluated |
| AC-11 autodocs | Every own declaration tagged; real docgen; registered extraction/enhancement/inference, zero owned diagnostics; no manual argTypes/play | Rendered browser Controls widgets Not evaluated |

## Final validation

All full gates ran in the foreground, one at a time, under the parent's lock/time/memory limits. No CI runs are claimed. Commands below are the exact invocations, not suggested future commands.

| Command | Result |
| --- | --- |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/checkbox/Checkbox.test.tsx --maxWorkers=2` | 11 passed after implementation/stub; initial missing-implementation RED described above |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/checkbox/Checkbox.test.tsx packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2` | 138 passed, 3 files |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Passed; 257 files, no fixes |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Passed; UI JS/declarations and 198.42 kB compiled CSS |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Passed root and workspace checks |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | 574 passed, 30 files |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Registry valid; generated view current |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | 82 passed; immutable receipt assertions retained |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | 28 passed; 56 reachable declaration files |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | 12 passed; React 18.3.1/19.3.0 entries/types/SSR/CSR/CSS, 255 native tokens, one React/ReactDOM instance per bundle |

`pnpm props:docs` and `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` regenerated only authorized documentation outputs. `git diff --check` passed before this document was added.

## Expected design and deferred browser work

VIS-01 is the checked/unchecked checkbox zone in [Field.png](../../../design/foundation-boards/v2026-10-17/Field.png), SHA-256 `80af435a468eecb6ffd17b1b7187d06dc9015bd9d0b8477d874493ff88498df6` (verified locally). The issue approves the Icon glyph and `--shadow-btn-primary` differences from the CSS-drawn legacy check/glow. No current-implementation capture replaces that reference.

Visual conformity: **Not evaluated**. No browser/server was started. The owner deferred visual review to Storybook on main after the batch. Check under the reference conditions (Chromium 148, 1280×900, DPR 1, dark theme, loaded fonts, normal motion):

- 18px box/12px glyph, small radius, well, gradient, black glyph and approved halo difference.
- Checked, unchecked and mixed glyph visibility; state-specific focus shadow precedence.
- Invalid unchecked border; disabled computed opacity; associated label target on coarse pointers.
- Actual mixed-union disabled Controls rows, boolean disabled/required widgets, text name/value widgets and documented defaults.
- Browser native validation, screen-reader announcements and contrast.

DOM, docgen, emitted CSS, SSR/CSR jsdom and package checks do not certify those browser/visual/accessibility results.
