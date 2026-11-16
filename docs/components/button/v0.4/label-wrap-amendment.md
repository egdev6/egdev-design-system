# Button v0.4 — opt-in label wrapping amendment

- **Status:** Approved — 2026-11-16 (owner, in session; proposal egdev-ds-nexo-adoption-v1). Implementation plan requires separate approval.
- **Amends:** [Button v0.1](../v0.1/implementation.md), the [v0.2 neutral treatment](../v0.2/neutral-variant-amendment.md), [v0.3 hover motion](../v0.3/hover-motion-amendment.md) and [v0.3 large size](../v0.3/large-size-amendment.md). Requested by [#422](https://github.com/egdev6/egdev-design-system/issues/422), split from [#421](https://github.com/egdev6/egdev-design-system/issues/421); the canonical Button issue remains [#53](https://github.com/egdev6/egdev-design-system/issues/53).
- **Approval / recovery:** Owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1. The spec is approved without captures; the implementation plan requires separate approval.
- **Snapshot identity:** `version: v0.4`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 → Pending`; `approvalReference: owner session 2026-11-16; proposal egdev-ds-nexo-adoption-v1`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/53`; `latestPublishedComment: Pending recovery`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF endings and the final newline. Tracking metadata above that heading is excluded. Finalize before any separately authorized publication.
- **Current situation:** `buttonVariants` currently includes `whitespace-nowrap`; the option and checks below are proposals, not implemented results.

## 1. Purpose and scope

Allow long localized action labels to wrap inside constrained controls without app-owned internal selectors. Preserve nowrap for existing consumers. Dialog density is now #421's separate scope; this amendment changes neither Dialog nor Tabs (#414).

**Cataloging:** Reuse the existing exported Button; its sizes and root-layout-only `className` do not offer a supported text-wrapping treatment. Propose an additive variant on the existing `@egdev/ui` atom rather than a new button or app-specific wrapper. Inspected the [public barrel](../../../../packages/ui/src/index.ts), [Button props/CVA](../../../../packages/ui/src/atoms/button/types.ts), hook, JSX, tests and stories.

## 2. Anatomy and composition

| Part | Element / content | Responsibility |
| --- | --- | --- |
| Root | Native `button`, or one compatible child through Radix Slot/Slottable | One labelled action or navigation target, including the entire clickable box. |
| Label | Existing consumer-visible `children` | Readable action text, optionally wraps; no added interactive descendants. |
| Icon | Existing decorative `eg-btn__icon` span or loading Spinner | Remains on configured start/end side, hidden from accessibility APIs. |

Keep Radix Slot's existing single-child composition, merged handlers and refs; no new focus or keyboard engine. Preserve `eg-btn`, `eg-btn__icon` and child markers; no new public marker or part override.

## 3. Public API

| New prop | Type | Required / default | Proposed rule |
| --- | --- | --- | --- |
| `labelWrap` | `boolean` | No; `false` | When true, allow the visible label to wrap and break long unbroken words within available space. False/omitted retains the existing nowrap recipe. |

**Naming lookup:** [registry source](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), meanings, names and aliases reviewed. The owner approved the shared `labelWrap: boolean` convention for Button and Tabs (owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1): an opt-in line-breaking policy for a control's visible label, not generic flex wrapping or truncation. The drafts used different candidate IDs for the shared convention (`button-label-wrapping` and `tab-label-wrap`); its single registry ID remains to be resolved. Existing `section-content-wrap`/`wrap` means a section's centered content wrapper and explicitly is not this behavior; do not reuse or overwrite it. Registry entries and usages are added in each implementation PR, not here.

Reviewed baseline: `source: { path: packages/ui/src/atoms/button/types.ts, symbol: ButtonProps, revision: sha256:5acf2913181c5bb12776da8a45125dd47a1e2fe00b639b8a64acea7b3b1ec866 }`. `labelWrap` is not present in those bytes; a future usage needs source review and a fresh whole-file hash after implementation.

**Unchanged:** `variant` is `primary | secondary | neutral | dark` (default `primary`); `size` is `lg | md | sm` (default `md`); `iconPosition` defaults to `end`, `loading` and `asChild` to `false`. Existing Button native props, required children, `type="button"` default, public exports and `HTMLButtonElement` ref signature remain. Slot forwards the ref to the actual compatible child at runtime without promising polymorphic anchor typing. Root `className` still supports layout only. No controlled state is added.

## 4. Behavior

| Input / action | Proposed observable result | Event |
| --- | --- | --- |
| Omitted or `labelWrap={false}` | Existing single-line nowrap rendering and all defaults remain unchanged. | None added. |
| `labelWrap={true}` with constrained plain text | Natural word wrapping, with breaks inside an otherwise unbreakable word as needed; no clipping, ellipsis or horizontal label overflow. The icon/Spinner remains on its configured side. | None added. |
| Wrapped action or supported slotted link activated | The whole rendered control remains the hit target; native/Slot behavior and child handlers remain unchanged. | Existing child/native events only. |
| Loading or disabled | Existing focus-retaining loading guard and disabled precedence/tab behavior remain, independent of wrapping. | Existing guarded behavior. |

The approved interpretation of #422's unchanged hit area is **no reduction or detached/non-clickable label**: retain the size's minimum height and padding, and allow the whole clickable box to grow vertically for multiple lines. It does not promise a fixed-height box. Consumers must allocate enough inline space for existing padding, any non-shrinking icon and at least one glyph; clipping ancestors, narrower impossible widths and descendants with their own conflicting whitespace/overflow rules are outside this guarantee. Plain visible text and a compatible slotted anchor with plain text are the supported wrapping scenarios; existing richer children are not removed from the API.

## 5. Accessibility

Wrapping changes presentation only: visible text remains the same complete accessible name and reading order; the icon or Spinner remains decorative. Native button Enter/Space and slotted link Enter behavior, focus, `aria-busy`/`aria-disabled`, disabled suppression and consumer-owned loading announcements remain as before. Keep the focus ring visible around the entire expanded root; the host must not clip it. Preserve each preset's minimum, not an invented universal touch guarantee: `lg` is at least 44px high; consumers choose an adequate width and size for touch.

## 6. Appearance

| Axis | Values / default | Restriction |
| --- | --- | --- |
| Label wrapping | `false` / `true`; default `false` | Opt-in; readable centered multiline label, no icon-row separation. |
| Existing size | `sm`, `md`, `lg`; default `md` | Preserve token-backed minimums, padding, gap and typography. Existing CTA/label line-height tokens remain in effect. |
| Existing treatment | `primary`, `secondary`, `neutral`, `dark`; default `primary` | Keep approved Material, hover, pressed, focus and disabled/loading treatments. |

Use a static CVA variant in `types.ts`, composed in the hook with `cn()`, using normal whitespace, `wrap-anywhere` and `text-center` for the opt-in; no hardcoded spacing, dynamic geometry or new tokens. Preserve the approved Button Material recipes and no-hover-motion amendment; do not create a new paint recipe. `className` remains a root margin/alignment/placement/width surface, merged last for recognized `twMerge` conflicts only, not general appearance control. No layout utility may hide or clip the focus ring. **No stylesheet**, no extra module or dependency; existing six meaningful files retain their types, hook, JSX, test, story and index roles.

### Expected-design visual reference

| ID | Image / scenario | Source / conditions | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending: constrained long localized label, icon and keyboard focus, plus unchanged nowrap comparison | Expected source, viewport, scale, browser, theme, fonts, motion/transparency, crop and date all pending | No capture in this batch; approval and hash pending. Visual conformity **Not evaluated**. |

The spec is approved without captures; each Button implementation PR must provide stories and a real capture before merge. Historical v0.1 Button references do not establish the expected multiline design. Agree source and conditions before separately authorized capture and owner adoption; captures do not replace behavior checks.

## 7. Acceptance criteria

All checks below are planned, not observed; stories do not replace tests.

| ID | Observable promise | Planned test / method | Planned story / visual check |
| --- | --- | --- | --- |
| AC-01 | Omitted/false retains nowrap, existing variants, sizes, markers, labels, root attributes and default behavior. | `Button.test.tsx` default/false regression and existing suite; built CSS check. | Existing Default/Sizes; no new visual claim. |
| AC-02 | True wraps spaced and unbroken long labels inside a feasible constrained width, without clipping or horizontal overflow; line-height uses current size tokens and box can grow. | Public behavior and real browser computed styles/bounding boxes for `sm`, `md`, `lg` at narrow width and 200%/400% zoom; static built-CSS scan. | Long localized label story; VIS-01 pending. |
| AC-03 | Start/end icon and loading Spinner remain decorative, correctly placed and do not detach or narrow the usable hit area. | Unit role/name/order and loading assertions; browser hit testing, bounding boxes and focus ring around full expanded root. | Wrapped icon and loading examples; VIS-01 pending. |
| AC-04 | Native button and `asChild` link keep role/name, refs, handlers, Enter/Space as applicable, focus, disabled/loading guards and recovery; no DOM `labelWrap` attribute. | `Button.test.tsx` public interactions and ref/attribute assertions; browser keyboard verification. | Wrapped native and slotted link examples. |
| AC-05 | Existing Material, merge limits, reduced motion, exports, type metadata and React 18/19 consumer support remain. | Token/CVA built CSS, docgen/Controls, typecheck, lint and packed-consumer checks; inspect focus and reduced motion in browser. | Variants and Controls; visual parity pending. |

### Resolved decisions

- “Aprobar las cuatro” — the shared Button/Tabs `labelWrap` convention is approved.
- “Sí, la caja crece y es clicable entera” — retain the size's minimum height and the entire clickable area; wrapped text can only add height.
- “Sí, validación visual en cada PR” — the spec is approved without captures; the Button implementation PR must provide stories and a real capture before merge.

### Remaining open decisions

- Resolve the shared `labelWrap` registry ID in the implementation PR.
- Confirm the supported plain-label/compatible Slot scope and select the expected-design source and capture conditions for VIS-01; visual approval remains separate.

### Planned checks

After separate plan approval: focused Button tests, `pnpm test`, `pnpm typecheck`, `pnpm lint`; docgen/Controls, static built CSS and packed React 18/19 consumer verification; browser reflow, focus, keyboard and hit-area checks; then a separately approved visual comparison. All remain pending; this spec authorizes no code, tokens, dependencies or GitHub writes.
