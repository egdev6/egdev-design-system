# StatusDot v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#71](https://github.com/egdev6/egdev-design-system/issues/71), frozen v0.1 body (whole-body SHA-256 `b91f1de320f50d3698ba21542af39b140a1375d0ee1ebfc98cc178465f06101c`, canonical SHA-256 `929342f715d91ea8ac82feb8b867e82dcdd4aaff4eddf1a1633b31d4b0185143`) and the owner full-contract approval comment on that issue.
- Visual references: VIS-01 `StatusDot.png` (`84d03fd7…21b6`) and VIS-02 `LiveDot.png` (`8eb6e8cd…7a92`), board set v2026-10-17.
- Scope: one decorative atom that fuses the Foundation StatusDot and LiveDot. This does not establish catalog-wide M3 compliance.
- No token, dependency or Radix change. Composes no other component.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Fusion | One `StatusDot` with `state: 'running' \| 'idle' \| 'warning' \| 'error' \| 'stopped' \| 'live' \| 'standby'`. |
| D2 Default | `stopped`, in the CVA `defaultVariants` and the hook. |
| D3 Pulse | Boolean `pulse`, default `true`. A CVA compound variant applies it only to `live` and `standby`. |
| D4 Geometry | Status states: `size-2` (8px) with `ring-2 ring-bg-surface`. Signal states: `size-2.5` (10px) with `shadow-glow-hot` and no ring. |
| D5 Ring colour | No `ring` prop. The ring always uses `--color-bg-surface`. |
| D6 Ring width | `ring-2` (2px). Its colour comes from the token. |
| D7 Keyframes | `status-dot.css` holds only `@keyframes eg-status-dot-pulse` (scale 1 → .72, opacity 100% → 75%). The static utility `motion-safe:animate-[eg-status-dot-pulse_2.4s_var(--ease-out)_infinite]` applies it. |
| D8 Accessibility | The root is always `aria-hidden="true"` and has no role or name. `children`, `role`, `aria-hidden`, `aria-label` and `aria-labelledby` are omitted from the type. The hook also drops them at runtime, along with a spread `data-state`. |
| D9 Stylesheet | `status-dot.css` exists only for D7. `compiled.css` imports it after `index.css`, at the top level, so native consumers get the keyframes. `compiled.css` also scans `atoms/status-dot/types.ts`. |

## Files

`types.ts` holds `StatusDotProps`, `StatusDotState` and the public `statusDotVariants`. `useStatusDot.ts` sets `data-state`, keeps the dot hidden, guards the omitted props and composes classes with `cn()`. `StatusDot.tsx` is JSX only. The folder also has `StatusDot.test.tsx`, `StatusDot.stories.tsx` (`Atoms/StatusDot`: Default, AllStates, Live, LiveStatic, WithText), `index.ts` and `status-dot.css`. There are no internal modules.

The legacy `.eg-status-dot*` and `.eg-live-dot*` rules stay in `legacy/bundle.css`. The root carries `eg-status-dot`, so the legacy base rule also matches it in `@layer components`. Every property that rule sets is either overridden by the component's utilities or has the same value.

Prop naming: `state` → `consumer-selected-condition` and `pulse` → `signal-pulse`. Both are already approved; this change adds only usages. Each usage records `packages/ui/src/atoms/status-dot/types.ts#StatusDotProps` at `sha256:4d3db595cffe56d87931b3000d57fa0226a2c812d35950308f6d4309c89e4ecb`. The approved `consumer-selected-condition` meaning text still names Gauge only. Widening it would change its convention hash, so it needs separate approval. This change leaves it unchanged.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| AC-01 | Unit, SSR and packed CSR/SSR: the default render is an empty `span.eg-status-dot` with `aria-hidden="true"` and `data-state="stopped"`. |
| AC-02 | CVA unit test, SSR and packed: each state resolves its fill, its size and either the ring or the glow. The shipped utilities resolve to `--space-2`, `calc(var(--space-1) * 2.5)`, `--color-bg-surface`, `--shadow-glow-hot` and the status/brand/primitive colour tokens. Visual conformity with VIS-01/VIS-02: Not evaluated. |
| AC-03 | Unit, SSR and packed CSR rerender: the pulse utility appears only for `live`/`standby` with `pulse` on. `pulse={false}` and every status state stay static. |
| AC-04 | Only one animation utility exists, and it is `motion-safe:`. It ships inside `@media (prefers-reduced-motion: no-preference)`. Browser emulation: Not evaluated. |
| AC-05 | `status-dot.css` contains only the keyframes. The built CSS ships them at the top level, outside the utilities layer, together with the arbitrary animation utility. |
| AC-06 | Unit: the dot is not focusable and exposes no role. Adjacent text supplies the meaning. axe on WithText: Not evaluated. |
| AC-07 | Unit, SSR and packed: consumer layout classes merge last, `eg-status-dot` stays first, and native `id`, `title`, `lang` and `data-*` attributes are forwarded. |
| AC-08 | Native Vite and Tailwind packed consumers on React 18.3.1 and 19.3.0 ship every state utility, the motion-safe pulse and the keyframes. A strict type fixture rejects content, role, hiddenness, naming, ref, `asChild`, unknown states, `ring` and string `pulse`. |

Docgen and Controls tests cover `state` (select, default `stopped`) and `pulse` (boolean, default `true`) with zero diagnostics. Browser widget check: Not evaluated.

## Notes

- The Skeleton v0.2 naming-receipt test still requires exactly one Skeleton usage under `signal-pulse`. Any other usage must now be a reviewed post-receipt usage. The approved convention content is unchanged.
- Visual conformity, browser computed styles, axe and Controls widgets are Not evaluated. They wait for the owner's Storybook review on `main`.
