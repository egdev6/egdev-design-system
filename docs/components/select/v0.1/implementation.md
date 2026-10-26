# Select v0.1 implementation evidence

## Authority and scope

- Contract: [issue #67](https://github.com/egdev6/egdev-design-system/issues/67), v0.1, with [full-contract approval](https://github.com/egdev6/egdev-design-system/issues/67#issuecomment-6251460571).
- Approved canonical payload SHA-256: `751a26bce479497cede2ec414f6a68ca51fdb01ff1b833174e80837127087469`.
- Frozen issue body SHA-256: `c16ed526ad7420450311c3bcfea108a9b6b0bbccf3c946d7321d97268adb3c89`.
- Expected VIS-01: [Field.png at e08f007](https://github.com/egdev6/egdev-design-system/blob/e08f007ee71af90e97cec2cd3f7dd2a880364314/docs/design/foundation-boards/v2026-10-17/Field.png), SHA-256 `80af435a468eecb6ffd17b1b7187d06dc9015bd9d0b8477d874493ff88498df6`. Scope: closed md trigger, selected value and chevron; shared focus/invalid treatment. The popup uses the approved overlay recipe, not an invented board comparison.
- The parent separately approved the unchanged concrete implementation plan under the owner's full-batch development delegation (T23, S1–S6). That plan authorization is distinct from contract approval and is not represented as a new owner quote or independent signed receipt.
- Parent-prepared base contains merged Icon and Text/Heading. The public barrel and Icon types were inspected: `chevron-down` and `check` exist, `size='sm'` is 16px, and unlabeled icons are decorative. Surface, Slot, VisuallyHidden and Spinner are also exported. Select composes only Icon; it does not require unmerged Button, Avatar, Link or Badge.
- Parent installed the approved `@radix-ui/react-select` 2.4.1 dependency. This implementation changes no dependency, lockfile, token, legacy stylesheet or coordination file. No CI run is claimed.

## Contract coverage

| Criteria | Implemented / automated evidence | Browser evidence |
| --- | --- | --- |
| AC-01 | Named button combobox, `eg-select`, forwarded HTMLButtonElement ref and cleanup in packed React 18/19 | Not evaluated |
| AC-02 | Real Radix click/Enter/Space/ArrowDown/ArrowUp opening, portalled listbox/options | Not evaluated |
| AC-03 | Pointer/Enter/Space selection, one callback, focus restoration, same-value silence, Escape/outside dismissal | Not evaluated |
| AC-04 | Controlled updates (including inside forms), uncontrolled initialization/selection, empty placeholder; no callback on prop updates | Not evaluated |
| AC-05 | Disabled trigger, disabled-option rejection, Home/End/arrows/typeahead skipping, closed Tab order | Not evaluated |
| AC-06 | Static emitted overlay, hairline, two-layer shadow, blur/saturation, solid reduced-transparency fallback, item focus/highlight and non-color check | Computed styles, clipping, scroll geometry and reduced-transparency rendering: Not evaluated |
| AC-07 | Static well/focus/open/invalid utilities, md/sm presets, token-backed border/button resets and layout merge invariants | Actual 44px/36px geometry and VIS-01 comparison: Not evaluated |
| AC-08 | Native hidden select, required empty-value validity, name/value FormData after selection, disabled omission | Native browser validation/announcement: Not evaluated |
| AC-09 | Production-only static CVA source; built/exported CSS and packed native/Tailwind consumer checks with both React majors | Not evaluated |
| AC-10 | Real TypeScript docgen and installed extraction → registered enhancer → inference, all own controls, defaults and zero diagnostics | Actual Controls widgets: Not evaluated |
| AC-11 | Label association, accessible description and independent placeholder naming | Screen reader/browser review: Not evaluated |

### API and implementation boundaries

Named exports are exactly `Select`, `SelectProps`, `SelectOption`, `SelectSize`. Recipes and hook are private to the component implementation. The six meaningful files are present; **No stylesheet** and no internal helper module. The hook splits form/value props to Root and native attributes to Trigger without own value, open, focus or keyboard state. Radix owns interactive behavior and its native hidden select.

`options` must contain non-empty unique values and plain string labels. There are no groups, separators, icons/descriptions in options, clearing, multi-select, search, open-state API, public subcomponents or `asChild`. Consumers supply the accessible name. Native `name`, `required` and `disabled` retain their native-equivalent meanings.

`className` supports only trigger width and margin, merged last with `cn()`. Tests cover replacement of `w-full` and duplicate margin utilities. This is not permission to override Material, typography, state or internal appearance; twMerge does not arbitrate arbitrary CSS or every conditional conflict. Content and items expose no class props. Supported styled parts each use hook-derived CVA plus `cn()`; Radix Value/ItemText deliberately do not accept styling through className, so no ineffective class API is claimed.

No semantic/API deviation from the approved contract. Implementation details needed for the existing no-preflight package are `m-0`, `bg-none`, `border-solid` and token `--border-width`, plus a relative trigger for the absolute chevron. The sm typography takes `text-label-default` size/line-height and overrides its weight with `--text-body-default--font-weight` (500), not a new token. Reduced transparency sets the entire backdrop filter to `none`, retaining the approved solid Material fallback without residual saturation. Only `transition-colors` is added to the existing animation/transition guard; the pulse/spin exceptions are preserved. No z-index or popup animation is introduced.

### Exact naming conventions

Existing approvals and meanings are unchanged. Six post-receipt observations point to the reviewed whole-file hash of `packages/ui/src/atoms/select/types.ts#SelectProps`:

| Prop | Approved convention | Component-specific type |
| --- | --- | --- |
| value | primary-value | string |
| defaultValue | initial-uncontrolled-value | string |
| onValueChange | interactive-value-change | (value: string) => void |
| options | choice-options | SelectOption[]: value, text label, optional disabled |
| size | preset-dimensions | md or sm |
| placeholder | selection-placeholder | Hint only when unselected, not an accessible name |

The option members are the existing `choice-options` shape, not new accessible-name or Icon-name inputs. Native-equivalent form attributes and inherited className need no new naming concept. Historical registry receipts are tested after removing only exact reviewed usage pairs; no immutable receipt or approval hash was re-pinned.

## Observed test-first sequence

1. Base build passed before any test execution so `tokens.css` existed.
2. The first focused test initially failed import resolution because Select did not exist.
3. With a temporary null-rendering scaffold, the focused behavior test failed as intended: no accessible combobox named Visibility (one test failed).
4. The real Radix implementation passed that focused test (one passed).
5. Triangulation added alternate/negative behavior and real metadata checks: final focused run **148 passed**, including **20 Select tests**.
6. During harness development, four opening assertions queried the trigger while Radix hid its ancestor from the accessibility tree. Retaining the pre-open trigger reference fixed the test, not the component.
7. The first export guard runs exposed quoted state selectors and compact media-query whitespace; assertions were aligned to observed emitted syntax. Final export checks passed.
8. The first packed matrix exposed a missing jsdom `DocumentFragment` global in both CSR cases (8 passing / 4 failed including parent cases). Supplying the real jsdom constructors fixed the harness; no Radix behavior was mocked. Final packed matrix **12/12 passed**.

## Validation commands and results

All heavy commands ran in the foreground, serialized with the parent gate lock and capped memory. No timeout or out-of-memory rerun occurred.

| Exact command | Observed result |
| --- | --- |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/select/Select.test.tsx --maxWorkers=2` | Initial missing-module failure; then intended one-test behavior RED; then one-test GREEN. Later triangulation: 14 passed / 4 harness assertions failed, corrected before the combined run. |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/select/Select.test.tsx packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2` | Final 148 passed, 3 files. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Passed; native tokens, JS/declarations and static CSS built. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Passed after correcting eight initial formatting-only diagnostics and one final test-formatting diagnostic. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Passed, root and package TypeScript. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | Final 584 passed, 30 files. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Passed; source evidence and generated view current. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | 82 passed, immutable receipt assertions preserved. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | 27 passed; 56 reachable declarations. |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | 12 passed: React 18.3.1 and 19.3.0, entries/types/SSR/CSR/CSS; 255 native tokens; one React and React DOM instance each. |
| `pnpm props:docs` | Regenerated the authorized naming view. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Regenerated both authorized catalogue outputs, 107 rows. |
| `git diff --check` | Passed. |

The packed fixture retains the single React type import and every pre-existing component, including Surface/surfaceVariants/ComponentProps, Icon and Text/Heading in their original import/render/CSR/CSS harnesses. CSR adds real Radix keyboard selection, portalling, check glyph, disabled choice, native FormData, restored focus and trigger ref cleanup. CSS is checked both without a consumer Tailwind compiler and with Tailwind. These are jsdom/static/build checks, not browser screenshots or computed layout proof.

## Deferred review — Not evaluated

Per batch S3, the owner reviews all components in Storybook on main. No browser, watch process or server was started. Remaining checks: VIS-01 comparison at its original conditions, open overlay layout/positioning/collision/scrolling, focus visibility, invalid/open precedence, reduced transparency/motion rendering, actual Controls widgets, native browser form validation, touch geometry and screen-reader announcements. No automated axe or independent native review is claimed.

## Proposed commit slices for the parent

These are review units, not writer-executed Git actions. Gates above apply to the final union, not every intermediate prefix. Keep complete files: the core unit is larger than 400 authored lines because its 348-line behavior test shares helpers/imports throughout and must not be split into non-executable prefixes.

1. `feat(ui): implement Radix Select atom`
   - `packages/ui/src/atoms/select/types.ts`
   - `packages/ui/src/atoms/select/useSelect.ts`
   - `packages/ui/src/atoms/select/Select.tsx`
   - `packages/ui/src/atoms/select/Select.test.tsx`
   - `packages/ui/src/atoms/select/index.ts`
   - `packages/ui/src/index.ts`
   - `packages/ui/src/styles/compiled.css`
2. `test(storybook): document Select and verify its real controls`
   - `packages/ui/src/atoms/select/Select.stories.tsx`
   - `.storybook/main.ts`
   - `.storybook/preview.css`
   - `packages/ui/src/lib/storybook-controls.test.ts`
   - `packages/ui/src/lib/storybook-docgen.test.ts`
3. `docs(ui): register Select naming and catalogue evidence`
   - `skills/_shared/prop-naming.json`
   - `docs/prop-naming.md`
   - `scripts/prop-naming.test.mjs`
   - `scripts/catalog_data.py`
   - `docs/CATALOGO.md`
   - `docs/catalog.json`
4. `test(ui): verify Select exports and packed React consumers`
   - `scripts/package-exports.test.mjs`
   - `scripts/package-consumption.test.mjs`
   - `docs/components/select/v0.1/implementation.md`

## Ready PR body

### Summary

- Implement the approved #67 v0.1 Select contract with data-driven string choices, md/sm trigger sizes, controlled/uncontrolled values, native forms and a forwarded button ref.
- Keep keyboard, focus, ARIA, selection and portalling in Radix; compose the merged Icon chevron/check. Ship token-backed CVA well/overlay recipes with no stylesheet or token changes.
- Add stories, real Storybook metadata coverage, exact naming observations, generated catalogue updates and additive export/packed checks without dropping existing components.

### Validation

- Observed focused RED → GREEN, then 148 focused tests including 20 Select behavior tests.
- All required gates pass: lint, typecheck, build, 584 unit tests, props:check, 82 registry tests, 27 export checks and 12 packed-consumer checks across React 18.3.1 / 19.3.0.
- Packed checks include strict types/negative APIs, SSR, real Radix CSR behavior and native CSS without a Tailwind compiler, plus Tailwind coexistence and React deduplication.

### Review boundaries

No contract/API deviations, new tokens or dependency changes in the implementation. The parent prepared the approved Radix dependency separately. Browser/visual conformity, actual Controls widgets, computed overlay/scroll/focus styles and assistive-technology review: **Not evaluated**, deferred to the owner's main-branch Storybook batch review. No CI run is claimed. See `docs/components/select/v0.1/implementation.md` for exact commands, AC coverage, approval boundaries and corrected harness failures.

Closes #67.
