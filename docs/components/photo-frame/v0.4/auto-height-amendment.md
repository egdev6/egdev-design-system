# PhotoFrame v0.4 — `auto` root stretch amendment

- **Version / status:** v0.4 amendment record for the implemented `ratio="auto"` path. The approved contract ([spec.md](spec.md)) and its [implementation plan](implementation-plan.md) are **not edited**: their payloads and whole-file hashes are pinned by the layer-(b) approvals (`docs/components/web-catalog/v0.1/layer-b-plan-approvals.md`), so this record documents the approved deviation instead of rewriting them.
- **Owner decision:** recorded 2026-11-02, verbatim — **"Agregar h-full min-h-0 a la raíz con auto (Recomendado)"**. Scope of the answer is limited to `ratio="auto"`; the three presets and numeric ratios keep their previous classes.
- **Canonical issue:** [#95](https://github.com/egdev6/egdev-design-system/issues/95). This record adds no new contract payload, no visual capture and no owner approval of anything else.
- **Source of the defect:** parent browser check of the `Atoms/PhotoFrame` `AutoHeight` story after the v0.4 implementation (`bb1db29`), with the real compiled tokens and a real pointer.

## 1. Defect

The approved plan (§3) authorised exactly one layout utility for `auto`: `h-full` on the private media frame, with the *host* responsible for supplying a definite height. That is insufficient in the supported host patterns.

A figure is a grid or flex item. Grid and flex items default to `min-height: auto`, so the item cannot shrink below its content's intrinsic size. The image inside the viewport keeps its natural height, the media frame's `h-full` resolves against that grown figure, and the figure therefore expands past the host instead of filling it.

Measured before the amendment (`AutoHeight`, `grid h-96` host, 307 px available):

| Element | Measured height |
| --- | --- |
| Host | 307 px |
| `figure.eg-photo` | 1248 px |
| `img.eg-photo__img` | 1246 px |

The result is not the documented "fills the host height" behaviour: the media overflows its host and the host's definite height has no effect.

## 2. Amendment

`ratio="auto"` now also stretches the figure root with two static utilities, added through the root CVA axis (`ratio: { preset: '', auto: 'h-full min-h-0' }`) in `types.ts` and selected by the existing ratio resolution in `usePhotoFrame.ts`:

- `h-full` — the figure takes the host's definite height instead of its content height.
- `min-h-0` — permits the grid/flex item to shrink below its content's intrinsic minimum, which is what actually constrains the figure.

No dynamic class string, no inline style and no new token is introduced; both utilities are static literals in the recipe, already emitted in `@layer utilities`. The media frame's existing `h-full` and the viewport's `size-full` are unchanged, so the media fills the figure.

Measured after the amendment, same story and three host patterns:

| Host | `figure.eg-photo` | Media frame | `img.eg-photo__img` |
| --- | --- | --- | --- |
| Stretched grid cell (`grid h-96`) | 307 px | 307 px | 305 px |
| Flex column | 307 px | 307 px | 305 px |
| Block host | 307 px | 307 px | 305 px |

The image is 305 px rather than 307 px because the media frame's own Material border sits between the figure edge and the image box in the measured configuration; the figure and the media frame both equal the host height in every case.

## 3. Scope and preserved behaviour

- Only `ratio="auto"` receives the root utilities. `undefined` (the `landscape` default), `square`, `portrait`, `landscape` and every numeric ratio keep their previous root classes and AspectRatio reservation, pinned by test.
- The consumer `className` merge surface is unchanged: outer layout utilities still merge last on the figure and the component now supplies `h-full min-h-0` itself.
- The documented host responsibility is narrower, not removed: the host must still supply a definite height, and a host without one still collapses the media with no invented fallback (`min-height` value, placeholder or warning). The component adds no measurement, observer or container query.
- Anatomy, markers (`data-ratio="auto"`), Material recipe, framed treatment, caption model, accessibility and the six-file layout are untouched. No stylesheet exists for this atom.

## 4. Verification

- `packages/ui/src/atoms/photo-frame/PhotoFrame.test.tsx` adds a behaviour-level case asserting the root carries `h-full` and `min-h-0` for `auto` (and still merges the consumer `className`), and that no other ratio value — omitted default, the three presets or a numeric ratio — receives either utility.
- The emitted-utility assertion in `scripts/package-exports.test.mjs` gains `.min-h-0` beside `.h-full`, so the compiled stylesheet, not only the class string, proves both utilities ship.
- The `AutoHeight` story JSDoc states that the component adds the stretch itself and that a definite host height is still required.
- Registry: all four PhotoFrame usages of `types.ts` (`aspect-ratio`, `image-focal-point`, `visual-treatment`, `image-caption`) refresh their `revision` after renewed source review; convention entries, statuses and approvals are untouched.
