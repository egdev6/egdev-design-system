# Checkbox delivery handoff

Implementation is ready for parent review and terminal Git actions. No commit, push or PR was performed by the writer. The pre-existing untracked `odd/tasks/particles-build.md` is untouched.

## Proposed coherent commit slices

These are complete-file review units, not commands or completed commits. Slice 1 is slightly over 400 authored lines so the complete 190-line behavior test and all six component responsibilities stay together; no test prefixes or unused helper/import splits. Slices 2 and 3 expose/distribute the component and document the final combined transaction.

### 1. `feat(ui): implement Radix Checkbox atom`

- `packages/ui/src/atoms/checkbox/types.ts`
- `packages/ui/src/atoms/checkbox/useCheckbox.ts`
- `packages/ui/src/atoms/checkbox/Checkbox.tsx`
- `packages/ui/src/atoms/checkbox/Checkbox.test.tsx`
- `packages/ui/src/atoms/checkbox/Checkbox.stories.tsx`
- `packages/ui/src/atoms/checkbox/index.ts`
- `skills/_shared/prop-naming.json`
- `scripts/prop-naming.test.mjs`
- `docs/prop-naming.md`

### 2. `test(ui): verify Checkbox metadata and packed consumers`

- `packages/ui/src/index.ts`
- `packages/ui/src/styles/compiled.css`
- `.storybook/main.ts`
- `.storybook/preview.css`
- `packages/ui/src/lib/storybook-controls.test.ts`
- `packages/ui/src/lib/storybook-docgen.test.ts`
- `scripts/package-exports.test.mjs`
- `scripts/package-consumption.test.mjs`

### 3. `docs(ui): catalogue Checkbox and record verification`

- `scripts/catalog_data.py`
- `docs/CATALOGO.md`
- `docs/catalog.json`
- `docs/components/checkbox/v0.1/implementation.md`
- `docs/components/checkbox/v0.1/delivery.md`

## Ready PR body

```markdown
## Summary

- Implement the approved #54 v0.1 bare Checkbox atom with Radix-owned binary/mixed state, form integration, keyboard semantics and a forwarded button ref.
- Compose decorative Icon check/minus glyphs with token-backed well/filled/focus recipes. Six meaningful files, no stylesheet, no new tokens or dependency changes; legacy `.eg-check` remains untouched.
- Add stories, real docgen/registered Controls pipeline checks, source-backed `checked-change` usage, public exports, exact utility scanning, generated catalogue and additive React 18/19 packed coverage.

Closes #54.

## Authority and contract

Full-contract approval is recorded on #54, separately from the parent's unchanged implementation-plan approval under the owner's batch development delegation (T20, S1–S6). No new API/product conventions or semantic widening were introduced. Recipes/hook remain private; only Checkbox, CheckboxProps and CheckboxCheckedState are public.

Consumers supply accessible naming and the 44px composing label target. No own label, size, children, onChange or asChild API. ClassName is outer margin/self-alignment only.

## Verification

- Observed RED: focused suite could not resolve the missing implementation; no tests ran at that stage. GREEN: 11 Checkbox tests; combined real metadata suite 138 tests.
- Build before tests; lint and typecheck pass.
- Unit suite: 574 tests / 30 files pass.
- Prop registry current; 82 receipt/schema tests pass without changing immutable approvals.
- Package exports: 28 checks pass; 56 reachable declarations.
- Packed React 18.3.1 / 19.3.0 matrix: 12 checks pass (entries, strict types/negatives, SSR, CSR refs/forms, native CSS without Tailwind and Tailwind integration; one React/ReactDOM instance).
- All gates serialized and memory/time capped; no CI run is claimed.

Exact commands, initial harness/matcher/formatting corrections and AC-01–AC-11 coverage are recorded in docs/components/checkbox/v0.1/implementation.md.

## Not evaluated

Browser visual conformity, computed focus-shadow precedence, glyph visibility, disabled opacity/invalid border, coarse-pointer touch targets, rendered Controls widgets, native validation UI, screen-reader announcements and contrast. The owner deferred batch visual review to Storybook on main. The inspected/hash-verified Field.png is expected-design evidence, not an implementation capture. DOM/metadata/emitted CSS/jsdom checks are not browser or visual certification.
```
