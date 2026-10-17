# T3 — Semantic dimensions, design v2 (updated draft)

**Outcome:** six semantic roles and their geometry limits are human-approved. This update records that bounded decision; it does not approve this entire draft or authorize implementation. The implementation plan, token changes, component adoption and publication remain pending separate approval.

[#11](https://github.com/egdev6/egdev-design-system/issues/11) and [roadmap #8](https://github.com/egdev6/egdev-design-system/issues/8) are context links only. Their status and assignment were not refreshed or changed for this update.

## Scoped decision record

| Field | Recoverable manual record |
| --- | --- |
| Record date | 2026-10-17 UTC |
| Human response | The user answered exactly `si` to the preceding full table of six names/values and its geometry rules. |
| Approved scope | The six names/values below; minimum rather than fixed control heights; the coarse-pointer target policy (44×44px, with the large control minimum retained at 48px); glyph/target separation; preservation of the existing icon values; Gauge exclusion; and updating this draft only. |
| Not approved | The whole updated document, implementation plan, token edits, component adoption, publication or Git delivery. |
| Evidence limit | This inline record preserves the conversation decision. It is a manual record, not a native approval verdict, provider approval or hash-based proof. |

The user paused new component work while these pre-spec adjustments are resolved. The obsolete Tabs draft was deleted separately; this update records the T3 design decision and does not start a component. Token implementation still requires a separately approved plan and explicit code authorization. Screen-reader evaluation remains deferred by the user, not passed or waived as a compliance requirement.

## Authoritative baseline, not the secondary checkout

Current source authority is the repository's `main` baseline, commit `8882aae3b00bfccbff18db0e70339f8576a83ce4`, tree `fe8bafb2d908200ffd56b3812f7e80d4f95cfcc2`:

- [Token source][theme] and [declaration/alias contract][counts]: 236 variables, 50 aliases; 165 utility-theme declarations, 16 inline declarations and 55 root declarations.
- [Artifact preservation contract][preservation]: preserve the existing 236 values and the immutable original 168-value fixture. These are existing contract requirements, not tests executed for T3.
- [Current component contract][contract] and [architecture][architecture]: Gauge is the only implemented public React component; `cn` is a utility. Surface, IconButton, Tabs and other families are future/historical concepts, not available adoption references.

This secondary checkout is at `560dfd6c6a6fdf9715f4dc196ff554d5a1b45d7b`, 16 commits behind that primary baseline. Its relative component documents must not establish current availability. T2/PR #14, merge `bc91273221eda01b7d7640b2b22d3a6f1cf41dcb`, and the matching old `560dfd6` tree `9ccd98b87f648252c0a218800a257245871945ec` are historical context only. Historical dimensions such as field 36/44px, Tabs 34/36/44px or icon 28px do not establish current React APIs or authorize migration.

## Approved roles; implementation placement remains proposed

| New variable | Literal value | Role |
| --- | --- | --- |
| `--control-height-sm` | `32px` | Compact vertical minimum reference for controls and fields |
| `--control-height-md` | `40px` | Medium vertical minimum reference for controls and fields |
| `--control-height-lg` | `48px` | Large vertical minimum reference for controls and fields |
| `--touch-target-min` | `44px` | Minimum actual interactive width and height under the coarse-pointer policy |
| `--icon-size-sm` | `16px` | Small glyph box, not a hit area |
| `--icon-size-lg` | `24px` | Large glyph box, not a hit area |

Preserve existing `--icon-size: 20px` as the middle glyph reference and `--icon-stroke: 1.75` unchanged. Do not add `--icon-size-md`, field aliases, `--spacing-control-*`, new numeric spacing steps, a Tailwind namespace or another `@theme` block.

Proposed implementation: place the six roles as literal px declarations in the existing `:root` of `packages/tokens/src/theme.css`, subject to separate plan and code authorization. They are geometry roles, **not aliases of spacing**: overriding `--space-*` should not implicitly resize them. Reusing a number for a different semantic role within that single source is not a second manual source. Do not hand-edit compiled tokens or alter namespace resets.

| Count | Current authoritative baseline | Projected after approved implementation |
| --- | --- | --- |
| Total variables | 236 | 242 |
| `@theme static` utility declarations | 165 | 165 |
| `@theme inline static` declarations | 16 | 16 |
| `:root` declarations | 55 | 61 |
| Aliases | 50 | 50 |

All existing 236 values remain protected, including T2 additions and the immutable original 168. Do not rewrite the original fixture. **No new tokens are added by this draft update.**

## Approved geometry policy and proposed verification limits

### Minimum references, not exact outer heights

- Use control roles as `min-height` references, not fixed `height` or a promise of exact outer size. Content, font, padding, borders, `box-sizing` and container constraints affect actual geometry; allow content growth and measure the outer box. Examples use `border-box`.
- Fields reuse the 32/40/48px references; no duplicate field aliases or tokens reproducing historical 36/44px values. This does not replace existing styles or automatically map every component's `size` prop.
- A 16/20/24px glyph may sit inside a larger target. Glyph dimensions never certify an interactive hit area.
- Literal px roles should resolve equally with 16px and 20px roots. Changing the root is neither real zoom nor a text-enlargement test.

### Reported coarse pointers, including hybrids

When `(any-pointer: coarse)` matches, the **actual interactive box** must be at least 44 CSS px in both dimensions. Use the reported media capability, including hybrids, not viewport width, user-agent detection or only the primary `pointer`. Absence of a reported coarse pointer is not proof that touch is unavailable; consumers may choose the 44px minimum unconditionally.

- Vertical minimum: `max(control role, --touch-target-min)` gives sm/md 44px and lg 48px. Horizontal minimum: `--touch-target-min` gives 44px; content may grow either dimension.
- Tokens do not install this policy automatically. Future fixtures must compose it explicitly; component adoption requires its own approval.
- Grow the real interactive element. Decorative surfaces, transparent pseudo-elements and non-interactive parents do not establish its target size. A measured minimum or 44px bounding rectangle alone does not prove unclipped, unobstructed activation: check clipping, overlap, neighbors and activation of the intended control.
- Hover, focus, active, pressed and loading changes must not shrink the effective target, cause geometry jumps or lose/move focus unexpectedly. Borders and transforms must respect these limits. Disabled controls preserve geometry but do not count as activatable targets; do not expect disabled activation.

**Gauge exclusion:** keep its approved presets, numeric diameter and existing API unchanged. Gauge is not an interactive control; do not force these control roles or coarse-target rules onto it.

### WCAG boundary

Prior public-page review identified [WCAG 2.2 SC 2.5.8, Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) as 24×24 CSS px with exceptions, and [SC 2.5.5, Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) as 44×44 CSS px with exceptions. The coarse-pointer 44px rule here is **EGDEV design policy**, not a normative W3C device rule or a global WCAG certificate. Neither a token nor a geometry fixture proves accessibility conformance.

## Planned consumption example — not compiled or proven

Native CSS for an app/geometry fixture, not a new `@egdev/ui` component:

```css
.t3-example-control {
  box-sizing: border-box;
  min-height: var(--control-height-md);
}

@media (any-pointer: coarse) {
  .t3-example-control {
    min-height: max(var(--control-height-md), var(--touch-target-min));
    min-width: var(--touch-target-min);
  }
}
```

Planned Tailwind v4 consumption uses static arbitrary references to the same variables, without an additional namespace:

| Fixture intention | Static class |
| --- | --- |
| Compact / medium / large vertical minimum | `min-h-(--control-height-sm)` / `min-h-(--control-height-md)` / `min-h-(--control-height-lg)` |
| Small / existing middle / large glyph box | `size-(--icon-size-sm)` / `size-(--icon-size)` / `size-(--icon-size-lg)` |

The base classes do not implement the coarse rule. A future Tailwind fixture must compose its `max(...)` and width minimum explicitly and verify the compiled cascade; class-string order alone is not proof. Syntax, compilation and packed consumption remain unverified.

This example grants no appearance overrides through `className`, no new Surface dependency, and no relaxation of the current CVA, Radix, Material or token rules. Use an authorized geometry fixture, not seven invented component files. Any visual treatment needs an approved existing recipe or separate proposal.

## Adoption and authorization boundaries

T3 does not adopt components, rename props or approve the five prop conventions `defaultValue`, `onValueChange`, `variant`, `tone` and `elevation`. Historical/future IconButton, Button, Field, Tabs and Icon families need separately approved contracts, mapping and adoption decisions; their old dimensions are not current implementation evidence. Surface is not an importable prerequisite. Gauge remains outside this control policy.

| Next phase | Required gate |
| --- | --- |
| Implementation planning | Present responsibilities, focused checks, consumer fixtures and a proportionate regression/review plan; obtain separate approval before code. |
| Token implementation | Separate authorization for token changes; apply contract RED→GREEN where meaningful. No automatic component adoption. |
| Verification | Record actual results and method limits; do not inherit unrelated project test counts as T3 evidence. |
| Adoption / publication / delivery | Separate component approval, publication permission and Git authorization. T2's single-PR strategy is not inherited. |

This update neither assigns nor changes issues, closes #9/#10, publishes a spec, nor authorizes branches, commits, pushes or PRs. It records a scoped design decision only; it is not whole-document approval, implementation evidence or compliance approval.

## Future acceptance checklist — all pending, not executed

- [ ] **Contract RED→GREEN after implementation approval:** cover the exact six names, literal values, root placement and projected counts; missing/altered-value negatives; no extra aliases, namespace blocks or reset changes. Preserve all existing 236 values, original 168-value fixture and exact source/artifact parity.
- [ ] **Distribution:** use the approved existing build path; retain unreferenced root variables in native output with no `@theme`. Check color/alias preservation, CSS imports, exports and unchanged package dependencies/version. Do not hand-edit artifacts.
- [ ] **Packed consumers:** verify native CSS and Tailwind separately, including static arbitrary-class compilation and references. Verify local semantic-variable overrides and that spacing overrides do not resize the roles.
- [ ] **Geometry:** measure computed styles and outer boxes at 16px and 20px roots, control minima and 16/20/24px glyphs. Include content/font/padding growth beyond the minimum; equality with the reference height is not required.
- [ ] **Coarse and hybrid behavior:** verify the media query actually matches, minima are 44/44/48px with width ≥44px, and the real target activates correctly without clipping or intercepted neighbors. Contrast non-coarse behavior and relevant states; disabled geometry stays stable without expecting activation. Do not claim hybrid coverage if the runner cannot establish it.
- [ ] **Zoom and text:** explicitly document the real-zoom and text-enlargement methods, long-content growth and clipping results. Root 20px or DPR changes are not substitutes. Mark manual or unsupported cases pending with their limits; screen-reader evaluation remains deferred.
- [ ] **Proportionate regression/review:** approve the relevant lint, types, tests, build, exports, consumer and Storybook checks in the later plan. No T3 claim for effects, cold-cache networking, font downloads or global WCAG conformance. No tests, builds, browser checks or implementation RED/GREEN were executed for this draft.

[theme]: https://github.com/egdev6/egdev-design-system/blob/8882aae3b00bfccbff18db0e70339f8576a83ce4/packages/tokens/src/theme.css
[counts]: https://github.com/egdev6/egdev-design-system/blob/8882aae3b00bfccbff18db0e70339f8576a83ce4/packages/tokens/tests/token-contract.test.mjs#L45-L54
[preservation]: https://github.com/egdev6/egdev-design-system/blob/8882aae3b00bfccbff18db0e70339f8576a83ce4/packages/tokens/tests/token-contract.test.mjs#L86-L104
[contract]: https://github.com/egdev6/egdev-design-system/blob/8882aae3b00bfccbff18db0e70339f8576a83ce4/skills/_shared/component-contract.md
[architecture]: https://github.com/egdev6/egdev-design-system/blob/8882aae3b00bfccbff18db0e70339f8576a83ce4/docs/ARQUITECTURA.md
