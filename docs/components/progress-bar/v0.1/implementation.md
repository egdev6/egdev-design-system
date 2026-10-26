# ProgressBar v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#65](https://github.com/egdev6/egdev-design-system/issues/65), frozen v0.1 body (whole-body SHA-256 `77e492720a88ae67950bb087993fed3b4c7faf7069fc3d842b3c5f37343585b5`, canonical SHA-256 `5384c76d152622b249e9a684da488d654690ca4dd40e57bdc287cbabf5cc2340`, both as recorded in the owner full-contract approval comment on that issue).
- Expected design: VIS-01 `ProgressBar.png` (`sha256:6c5e7d0eed830604b22b731e21383ee91778dbcde7745982ab478771dab633e9`) and VIS-02 `progress-bar--specimen.png` (`sha256:6e6d838662bb4c7c63735d0738c8e843533dbc2325ecf881acf9796420c28025`).
- Dependency: `@radix-ui/react-progress` 1.2.1 (exact), owner-approved for this batch and added in its own commit. No token change.
- Scope: one passive atom. This does not establish catalog-wide M3 compliance.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Radix base | `ProgressPrimitive.Root` (track) and `ProgressPrimitive.Indicator` (fill). Radix supplies `role="progressbar"`, `aria-valuemin/max/now/text`, `data-state`, `data-value` and `data-max` on both parts. |
| D2 Scale | `max={100}` always; finite values clamp to 0–100; no `max` prop. |
| D3 Non-finite value | Radix receives `value={null}`: no `aria-valuenow`/`aria-valuetext`, `data-state="indeterminate"`, `--eg-progress-value: 0` (empty fill), no animation. |
| D4 Decorative bar | A non-empty `label` becomes `aria-label`. Absent, empty or whitespace-only labels give the root `aria-hidden="true"`. Empty is treated as absent, as Spinner and Kbd do, so an unnamed progressbar is never exposed. |
| D5 lg height | `h-2.5` (10px). |
| D6 lg fill | `bg-[image:var(--gradient-progress)] shadow-edge-strong rounded-[inherit]`. The handwritten source halo is dropped. |
| D7 edge only with sm | Discriminated union: `{ size?: 'sm'; edge?: boolean } \| { size: 'lg'; edge?: false }`. Untyped callers passing `edge` with `lg` get the non-edge track. |
| D8 Fill geometry | Static `scale-x-[var(--eg-progress-value)]` with `origin-left`. The hook sets the only inline style, `--eg-progress-value: value / 100`. |
| D9 Markers | Root `eg-progress` (existing Foundation marker); internal fill `eg-progress-fill`. The component never emits the legacy `__bar`, `--edge`, `--lg` or `--muted` classes. |
| D10 Stylesheet | No stylesheet. `compiled.css` gains `@source "../atoms/progress-bar/types.ts"`. |

## Files

`types.ts` holds `ProgressBarProps`, `ProgressBarSize`, `ProgressBarVariant`, the public `progressBarVariants` (track) and the internal `progressBarFillVariants`. `useProgressBar.ts` clamps the value, maps non-finite values to indeterminate, derives naming, guards Radix-owned props at runtime and composes both parts with `cn()`. `ProgressBar.tsx` is JSX only. `ProgressBar.test.tsx`, `ProgressBar.stories.tsx` (`Atoms/ProgressBar`: Default, Decorative, Values, Sizes, Muted, Edge, ValueTransition, Indeterminate) and `index.ts` complete the folder.

The track CVA uses compound variants so each preset emits exactly one position, background and radius utility: the published `progressBarVariants` stays conflict-free without `twMerge`.

Native props: `ComponentPropsWithoutRef<'div'>` without `children`, `role`, `aria-valuemin/max/now/text`, `aria-label`, `aria-labelledby`, `aria-hidden` and `dangerouslySetInnerHTML`. The contract lists `children` and the Radix-owned `role`/`aria-value*`. The naming attributes are also omitted because `label` owns both the accessible name and the decorative state (D4). `className` merges last on the root only.

Prop naming (all conventions already approved): `value` → `primary-value`, `label` → `accessible-name`, `valueText` → `measurement-text-equivalent`, `size` → `preset-dimensions`, `variant` → `visual-treatment` and `edge` → `container-edge-placement` (first usage). Each usage records `packages/ui/src/atoms/progress-bar/types.ts#ProgressBarProps` at `sha256:24333aa44912ecce88ce5e0bf27f04ccf838a6ee0c1b723b01574cbbf4c67a6b`.

Legacy: the Foundation `.eg-progress*` rules stay in `legacy/bundle.css`, inside `@layer components`. The root still matches `.eg-progress`, but every property that rule sets is also set by a utility in `@layer utilities`, so the utilities win without `!important`.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| AC-01 | Unit, SSR and packed SSR: labelled root has role progressbar, its name, `aria-valuemin="0"`, `aria-valuemax="100"` and `aria-valuenow="45"`. |
| AC-02 | Unit and packed SSR/CSR: 140 → 100 with `data-state="complete"`, −5 → 0. |
| AC-03 | Unit, SSR and packed CSR: NaN and ±Infinity give no `aria-valuenow`/`aria-valuetext`, `data-state="indeterminate"` and `--eg-progress-value: 0`. |
| AC-04 | Unit and packed SSR: absent, empty or whitespace-only label → `aria-hidden="true"` and no `aria-label`. |
| AC-05 | Unit, SSR and packed SSR: `valueText` becomes `aria-valuetext`; when omitted, the Radix `"45%"` is announced. |
| AC-06 | Unit and packed SSR: the fill style attribute is exactly `--eg-progress-value:<value/100>`. |
| AC-07 | Unit: preset classes for sm, lg, muted and edge. The `@ts-expect-error` cases (edge with lg, unknown size/variant, `max`, refs, `asChild`, Radix-owned ARIA) are checked by `pnpm typecheck` and by the packed strict type fixture. |
| AC-08 | Unit and packed: `eg-progress` leads the root classes, and consumer layout classes merge last (`w-full w-48` resolves to `w-48`). |
| AC-09 | Unit and shipped CSS: `transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)]` plus `motion-reduce:transition-none` inside `@media (prefers-reduced-motion: reduce)`. Browser emulation: Not evaluated. |

## Notes

- The shipped-CSS guard in `package-exports` used to reject every animated `transition-*` utility. It now admits `transition-transform`, which the contract approves (AC-09). `animate-*` limits are unchanged.
- The packed fixture again imports `Surface`, `surfaceVariants` and `ComponentProps`, which its Surface samples already used.
- Visual conformity with VIS-01/VIS-02, browser computed styles and Controls widgets are Not evaluated. They are pending the owner's Storybook review on `main`.
