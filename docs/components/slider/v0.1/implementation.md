# Slider v0.1 implementation evidence

## Authority and scope

- Frozen contract: [issue #68](https://github.com/egdev6/egdev-design-system/issues/68), v0.1, plus its owner full-contract approval comment. Whole-body SHA-256: `ef60f28a9507b76b72114d3c0b69a5285916c232c0c18a116422e751fe3fd555`; canonical SHA-256: `1544762b7f091da513e89ae28d0b9fbf49249ff44fa7c66c70b08035ecee0dec`.
- Expected design: VIS-01 `slider--specimen.png`, pinned to `e08f007`, SHA-256 `bfd416a007ad24b277f45e982cc6010dc9d35d7cf952745f16e641946ca3ff4b`. The issue preserves its image and capture metadata links.
- Implementation authorization: the owner’s full primitive/atom batch request, forwarded explicitly by the parent. This is not a new native approval receipt. The dependency was installed by the parent in `c336e5f`: exact `@radix-ui/react-slider` 1.6.1. No additional dependency or token changes.
- T17 / S1–S6: one atom; no composed system-component prerequisites; no Git mutation or coordination-file edits. Parent owns commits, integration and PR creation. Visual review is deferred to the owner on `main`; no CI run is claimed.

## Decisions applied

| Decisions | Implementation |
| --- | --- |
| D1–D3 | Radix Root/Track/Range/Thumb; scalar public value and callbacks, one thumb, horizontal only. Radix owns keyboard, pointer handling, focus and slider semantics. |
| D4–D6 | Required `label` names the thumb. Visible label/readout stay outside the atom. `aria-describedby` routes to the thumb; `valueText` formats the current value. `onValueCommit` unwraps Radix’s final array value. |
| D7–D8 | Track: 4px `surface-0` well with `shadow-well`; range: `fg-brand-default`. Thumb: 16px `fg-default`, `shadow-elev-1`, replaced by `shadow-focus` on focus-visible. |
| D9–D11 | Root hit area: 24px, 44px on coarse pointers. No size axis. Six meaningful files; **No stylesheet**. Static token-reference shadow utilities work with the reference-only theme; shorthand spellings in the contract are expressed as `shadow-[var(--…)]`. |

`types.ts` owns props, JSDoc and four CVA recipes. `useSlider.ts` maps scalars to arrays, unwraps callbacks, composes each part with `cn()` and mirrors the uncontrolled value only for formatter text. `Slider.tsx` is JSX over Radix. Tests, stories and the local barrel complete the folder. Public exports: `Slider`, `SliderProps`, `sliderVariants`; internal part recipes and the hook are not exported.

`className` is root outer layout (width/margin), merged last through `cn()`. Parts are not overridable. This is not permission for arbitrary appearance overrides or universal last-class-wins behavior. Legacy `.eg-field--range` rules remain unchanged.

Naming usages reuse the existing approved entries: `accessible-name`, `primary-value`, `initial-uncontrolled-value`, `interactive-value-change`, `committed-value-change`, `measurement-text-equivalent`. Evidence is `packages/ui/src/atoms/slider/types.ts#SliderProps`, whole-file SHA-256 `f4d9c995eb95223290846a986c4d1a09022e1352c3b930addf05e4f7035a01de`. No convention, approval or exception is changed. Bounds, step, disabled and name retain their native-equivalent meanings.

## Runtime details and contract clarifications

- Radix 1.6.1 clamps interaction updates, not incoming values. The wrapper clamps controlled values and uncontrolled initialization without emitting callbacks, preserving the promised bounded rendering. Consumers still ensure `min < max` and `step > 0`.
- Radix does not expose its uncontrolled value to the formatter; the hook mirrors value changes for `aria-valuetext`, leaving interaction/state ownership in Radix. Empty formatter results omit the attribute so the number can be announced.
- Radix renders the thumb hidden on the server until its collection mounts. Consequently SSR has bounds/name/formatter text and the range geometry, but not a visible thumb or `aria-valuenow`. CSR tests verify the mounted thumb value. No custom SSR keyboard/ARIA implementation is added.
- Named inputs participate **inside a form**, as provided by Radix. The packed fixture checks current-value submission after keyboard interaction; no custom form input is introduced.

## Acceptance evidence

| Criterion | Evidence |
| --- | --- |
| AC-01 | Unit and packed CSR: stable root, one named horizontal slider thumb, default bounds and value. SSR separately checks Radix markup without claiming a mounted thumb. |
| AC-02 | Unit: four arrows, Home/End, Page keys, Shift+arrow, custom step/bounds, pointer snapping and commit-on-release; callbacks are scalars. Packed CSR checks keyboard change and commit on both React majors. |
| AC-03 | Unit: controlled authority and consumer updates, defaultValue/min fallback, incoming clamp without callbacks. Packed CSR checks controlled out-of-bounds rendering. |
| AC-04 | Unit: disabled pointer/keyboard inactivity and Tab exclusion, Radix data attributes. Packed CSR verifies disabled value and no callback. CSS checks verify opacity and pointer-event utilities. |
| AC-05 | Unit and packed: current formatted value, required name, description only on the focusable thumb. Browser assistive-technology behavior: Not evaluated. |
| AC-06 | Unit per-part classes; built CSS checks well/elevation/focus token references, dimensions, coarse-pointer query and reduced motion. Pixel/computed-style conformity: Not evaluated. |
| AC-07 | Unit and packed CSR: named hidden form input submits the current scalar value after interaction; unnamed inputs do not submit. |
| AC-08 | Unit and packed: public marker retained; consumer width replaces `w-full`; private parts take no consumer classes. |
| AC-09 | Export checks scan all four real CVA bases against emitted CSS. Packed native Vite and Tailwind consumers exercise declarations, exports, SSR/CSR, CSS shipping and React deduplication on React 18.3.1 and 19.3.0. |

Storybook: Default, Controlled, Stepped, WithValueText, Disabled. The real docgen/extraction/enhancer pipeline checks all 11 own props, requiredness, numeric/boolean/text controls, justified false controls, constant defaults and zero owned-metadata diagnostics. Browser Controls widgets: Not evaluated.

## Main integration repair

The bounded PR #158 integration with `origin/main` at `f4d4202` preserves Slider and every implemented main component, including RadioGroup, Switch, Tooltip, ProgressBar, Input, Textarea and the typography/brand atoms. Storybook native-prop filters, source inventories, metadata tests, public exports, production CSS sources, catalogue notes and naming usages are additive unions. Registry convention/exception approvals, receipt pins and reviewed source revisions are unchanged; the generated naming view and catalogue were regenerated from their sources.

The packed fixture keeps one React type import, independent sample functions and strict negative declarations. It retains Slider SSR/keyboard/form scenes alongside main's RadioGroup/Switch submission and reset, Tooltip focus/Escape/portal, ProgressBar rerenders and native input handlers. Shared jsdom FormData, File and ResizeObserver globals remain available through the final Switch scene. The native token inventory remains pinned to 255; DOM identities use boolean assertions only.

The complete-selector transition guard retains its six main permissions and eleven negative cases. The unchanged Slider thumb recipe requires only one additional exact selector, `.transition-shadow`; a suffix negative protects that boundary. No runtime appearance, API, token or dependency was changed to satisfy the guard. Skeleton's no-animation marker rules and reduced-motion checks remain intact.

Repair validation: capped focused Vitest passes **317 tests in 13 files** (Slider, RadioGroup, Switch and library tests); lint, typecheck and registry freshness pass; naming tests pass **82/82**. Full build, export-artifact tests and the packed consumer matrix remain the parent's integration gates, not results of this repair execution. This is not a new TDD lifecycle or browser/visual claim.

### Export-inventory follow-up

Parent job 64 reported passing lint, typecheck, build, **735 unit tests** and **82 naming tests**, followed by an export-test failure; the integrated packed matrix had not executed. Reproducing against those existing artifacts observed **34/35** export tests passing. The failing root-export test omitted the already-approved `sliderVariants` from its expected runtime inventory; inspection found the same omission in its declaration inventory. The emitted package and Slider recipe were correct, including all CSS/transition artifact checks.

The correction adds `sliderVariants` to both exact inventories and checks that the public root recipe remains callable. Negative assertions retain the hook and three private part recipes outside both runtime and declaration exports. The transition guard is unchanged: six main permissions plus exact `transition-shadow`, with all twelve negative selectors preserved. No runtime, appearance, token, dependency, fixture, registry or immutable evidence changes were needed.

Observed follow-up validation: the focused root-export test passes **1/1**, then the complete export suite passes **35/35**, checking 74 reachable declaration files, against the unchanged existing build. These are reproduction/correction results, not a new strict-TDD or browser claim. The integrated packed matrix remains **not executed** and parent-owned; this does not claim all integration gates are green.

## Historical pre-integration validation

The earlier interrupted execution observed RED from missing Slider modules before implementation. The resumed execution observed GREEN: 115 focused tests across Slider and Storybook metadata (15 Slider tests), then 399 tests across 24 full-suite files. Build precedes tests that read artifacts. Export checks pass 20/20; naming checks pass 82/82; the packed matrix passes 12/12. Typecheck and registry freshness pass. All full gates use the parent’s shared lock, timeout and memory cap; packed additionally uses its matrix lock and 2GB cap. Gate receipts and the final lint result are reported in the handoff.

Visual conformity with VIS-01, real browser focus/touch behavior, accessibility-tree behavior and actual Controls widgets remain **Not evaluated**, pending the owner’s Storybook review. No server was started and no CI execution is asserted.
