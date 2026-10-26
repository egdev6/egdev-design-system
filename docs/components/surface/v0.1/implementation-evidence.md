# Surface v0.1 implementation evidence

## Authority and scope

- Contract: [issue #106](https://github.com/egdev6/egdev-design-system/issues/106), approved in the
  [owner full-contract comment](https://github.com/egdev6/egdev-design-system/issues/106#issuecomment-6251570023).
- Implementation was delegated by the component-development coordinator for the owner's
  primitives-and-atoms build. This is an assistant record, not a native approval receipt.
- Six meaningful files under `packages/ui/src/primitives/surface/`: `types.ts`, `useSurface.ts`,
  `Surface.tsx`, `Surface.test.tsx`, `Surface.stories.tsx` and `index.ts`. **No stylesheet** (D14),
  no internal modules, no token or dependency changes. `@radix-ui/react-slot` 1.5.0 was already installed.

## Snapshot identity

Recomputed from the fetched issue JSON; all identities match the approval record:

- Whole issue body SHA-256: `d302ad252c712722453bad3fefa5613b27b6e3b97d0d27d5dea974aba70be88a`
- Canonical payload SHA-256 (from the `## 1. Purpose and scope` heading line, LF, final newline):
  `0fb06d0b80537fcc7f375d94179f3e3bc388affdb486ffe190ea011354c7e4d4`
- VIS-01 specimen PNG (`docs/design/foundation-boards/v2026-10-18/specimens/surface--specimen.png`):
  `e227db8e4c11c22832964f973c2511f9a3a56454feaa992978c4b0f1858ee1eb`

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1, D2 | `tone`: `surface-0…3`, `well`, `overlay`; default `surface-1`. No `brand`, `ghost` or `glass`. |
| D3, D4 | `elevation` `0…3`, default `1`, painted only through raised-tone CVA compounds; `well`/`overlay` type it `never`. |
| D5 | Sheen on `surface-1…3` at every elevation and on `surface-0` at resolved elevation 1–3; explicit `surface-0` elevation 0 is plain. |
| D6 | Overlay falls back to solid `surface-2` with `backdrop-filter: none` under `prefers-reduced-transparency: reduce`, and to `surface-2` without `backdrop-filter` support. Static arbitrary/`not-supports-*` variants, no global CSS. |
| D7 | Base `border border-solid`; hairline, strong hairline on elevation 2–3 and overlay. |
| D8 | `padding` `none/sm/md/lg` → `p-0/3/6/8` (default `md`); `radius` `none/md/lg/xl/full` (default `xl`). |
| D9, D10 | No slots, no states, no `data-state`, no motion. |
| D11, D12 | `div` by default; `asChild` renders Radix `Slot`. Internal `forwardRef<HTMLElement, SurfaceProps>` bridge. |
| D13 | Root sets `text-fg-default`; brand-text responsibility documented in the stories. |
| D14 | Root marker `eg-surface`, no modifier classes, no stylesheet. |

### Implementation deviation for owner review: call-signature shape (D12)

The contract sketches `SurfaceComponent` as two overloads. The implementation expresses the same
promises as **one call signature over a discriminated union**:
`(SurfaceDefaultProps & RefAttributes<HTMLDivElement>) | (SurfaceSlottedProps & RefAttributes<HTMLElement>)`.

- Observed reason: `react-docgen-typescript` documents only the first overload (with the slotted
  branch first, `asChild` became a required `true` and `children` a required `ReactElement`), and
  Storybook's `ComponentProps` infers only the last overload.
- Preserved promises: the default branch accepts only an `HTMLDivElement` ref (an `HTMLElement`
  ref is a type error, asserted with `@ts-expect-error`); `asChild: true` takes an `HTMLElement`
  ref and one element child; `well`/`overlay` reject `elevation`.
- The signature returns `ReactNode`, matching React 19's `ExoticComponent`, instead of the sketched
  `ReactElement | null`, so the bridge is assigned without a cast. The only assertion is the
  default-branch `Ref<HTMLDivElement>` narrowing on the literal `div`; Slot is never asserted.

### Metadata note

Docgen merges JSDoc across union branches. `@control` is repeated per branch (normalized by the
enhancer), while `@default` lives on one branch only so values are never duplicated
(`surface-1\nsurface-1` was observed before the fix). Docgen omits the `children` row, as for the
other primitives; its declarations still carry `@control false` with a reason.

## Test-first evidence

- RED: `pnpm exec vitest run packages/ui/src/primitives/surface` failed with
  `Failed to resolve import "./Surface"` before the component existed.
- GREEN: the same command passes 16 tests: defaults and marker (AC-01), the full raised
  tone × elevation matrix with the sheen rule (AC-02, AC-03), surface-0 omitted versus explicit 0,
  well and overlay recipes including the reduced-transparency classes (AC-05 at class level),
  padding/radius token mapping and existence of every referenced `var(--*)` token in `theme.css`,
  layout `className` merged last (AC-07), native passthrough, div ref, slotted section/article/li
  with composed child ref (AC-06), hook resolution, and type fixtures for D4 and both ref branches (AC-04, AC-06).
- Metadata: real docgen extraction and registered Controls with zero diagnostics (AC-09).
- Build/static scan (AC-08): `packages/ui/dist/styles.css` emits every recipe class, including the
  arbitrary shadows, `bg-[image:var(--gradient-sheen)]`, the `prefers-reduced-transparency` media
  variants and `not-supports-[backdrop-filter]`, all as token `var()` references.

## Registry

Usages bound to `packages/ui/src/primitives/surface/types.ts#SurfaceProps`
(`sha256:26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6`):
`surface-material-tone`, `surface-elevation`, `inner-padding`, `corner-radius` and `slot-composition`,
all already approved conventions. `postReceiptUsages` gained the five pairs.

## Visual review handoff

Stories: `Primitives/Surface` — Default, Tones, Elevations, SurfaceZeroElevations, Well, Overlay, AsChild.

Browser computed styles, emulated `prefers-reduced-transparency` (AC-05 in a browser), actual Controls
widgets and VIS-01 visual conformity remain **Not evaluated** here. This agent does not launch Storybook;
the owner reviews on `main`.
