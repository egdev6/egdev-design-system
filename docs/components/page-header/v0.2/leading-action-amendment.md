# PageHeader v0.2 — leading action and lede amendment

- **Status:** Approved — 2026-11-16 (owner, in session; proposal egdev-ds-nexo-adoption-v1). Implementation plan requires separate approval.
- **Amends:** [PageHeader v0.1 implementation and approved contract](../v0.1/implementation.md); requested by [#412](https://github.com/egdev6/egdev-design-system/issues/412). The canonical component issue remains [#94](https://github.com/egdev6/egdev-design-system/issues/94).
- **Approval / recovery:** Owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1. The spec is approved without captures; its implementation plan requires separate approval.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 → Pending`; `approvalReference: owner session 2026-11-16; proposal egdev-ds-nexo-adoption-v1`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/94`; `latestPublishedComment: Pending recovery`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF endings and the final newline. Tracking metadata above that heading is excluded. Finalize before any separately authorized publication.
- **Current situation:** Existing behavior below is source evidence; both new props and their layout are not implemented, and the checks remain planned.

## 1. Purpose and scope

Provide an optional, independently operated leading action and short lede for a compact product page heading. No routing, automatic back behavior, built-in icon/copy, new header component or changes to SectionHeader.

**Cataloging:** Reuse the exported PageHeader, IconButton and existing trailing Button/ButtonGroup. PageHeader alone cannot currently express the leading control or lede; composing them outside it does not provide its coordinated reflow. Propose additive slots on the existing `@egdev/ui` molecule rather than extraction or a new component. The [public barrel](../../../../packages/ui/src/index.ts), [PageHeader source](../../../../packages/ui/src/molecules/page-header/types.ts) and [SectionHeader source](../../../../packages/ui/src/molecules/section-header/types.ts) were inspected. SectionHeader remains a separate editorial header without actions.

## 2. Anatomy and composition

| Part | Element / content | Responsibility |
| --- | --- | --- |
| Root | Existing native `header` | Passive layout within main or sectioning content; not a site banner. |
| Leading action | One consumer-supplied `IconButton`, including its supported `asChild` link | Logical start before text; the child owns behavior and name. No automatic group or cloning. |
| Text | Existing Stack: optional eyebrow, one native h1–h6, proposed lede paragraph | Preserve text order, heading rank and readable copy. |
| Trailing actions | Existing direct Button or spaced ButtonGroup with at least two direct supported children | Consumer-owned controls, unchanged contract. |

Radix: no PageHeader-specific primitive; the supplied IconButton owns its Radix Slot/AccessibleIcon composition. Preserve `eg-page-header`, existing `eg-stack` and child `eg-*` markers; no new public part marker is proposed.

## 3. Public API

| New prop | Type | Required / default | Proposed rule |
| --- | --- | --- | --- |
| `leadingAction` | `ReactElement<IconButtonProps, typeof IconButton> \| null \| boolean` | No; omitted | One direct accessible IconButton; `undefined`, `null` and either boolean omit the area. Arrays, fragments, wrappers and other controls are unsupported. JSX type erasure cannot enforce component identity; do not add a runtime child parser. |
| `lede` | `string` | No; omitted | Plain explanatory page-purpose text after the heading; omit absent or whitespace-only values and preserve nonblank text verbatim. Not interactive or rich content. |

**Naming lookup:** [registry source](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), names and aliases reviewed. The owner chose `lede` for the product-purpose text, consistent with SectionHeader's approved `section-lede` name. The owner also approved the scoped `trailing-actions`/`actions` exception: scope `PageHeader`, alternative `leadingAction`, reason: a single separate logical-start control must coexist with the existing trailing `actions` slot. Approval reference for both choices: owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1. This does not change a global convention by itself; add the PageHeader usage and scoped exception to the registry in its implementation PR, not here.

Reviewed baseline evidence for both proposed usages: `source: { path: packages/ui/src/molecules/page-header/types.ts, symbol: PageHeaderProps, revision: sha256:65e419324a9415188c20755942f710f92fd24f062bb3b7fab886d51ec0c612a3 }`. The new members are not yet present; a future registry usage needs a newly reviewed source hash after implementation. `SectionHeaderProps.lede` naming evidence: `packages/ui/src/molecules/section-header/types.ts`, `sha256:5726750a3c95049bf2262524f7d11d504774fd67f3b7d4409e49b9641b1d6f0c`.

**Unchanged:** required nonblank `title`, optional `eyebrow`, `level` default 1, and `actions` keep their existing types/defaults and behavior; blank title omits the whole header and warns outside production. Native header props reach the root, except owned omissions; no public ref, `asChild`, `children` or part-class API. No controlled state. Existing exports remain unchanged. React 18/19 compatibility must be rechecked, not inferred from types.

## 4. Behavior

| Input / action | Proposed observable result | Event |
| --- | --- | --- |
| Both new props omitted | Existing output, order, spacing and behavior remain unchanged. | None added. |
| Leading action and/or lede supplied | Logical start control precedes eyebrow/title/lede; trailing actions follow. Blank lede leaves no empty paragraph. | None added. |
| Activate leading or trailing control | The child handles its own action; native event bubbling to a consumer root handler is unchanged. No generated navigation or focus movement. | Child-owned. |
| Narrow width or RTL | Heading/lede and controls reflow without overlap or truncation, preserving DOM/tab order and logical start/end. The host must provide room for non-shrinking controls and text; each supplied control must fit or manage its own label. | None. |

No own state, live region, child inspection or automatic grouping. Supplied controls retain their own disabled, loading, focus and link behavior.

## 5. Accessibility

Exactly one heading retains its `title`-only accessible name and selected rank; the lede is visible ordinary paragraph text, not added to the heading name or automatically linked via `aria-describedby`. The consumer supplies IconButton's non-empty localized `label` and decorative icon; its native button or supported slotted link owns keyboard activation, focus and destination. DOM order is leading control, text, trailing controls in LTR and RTL; Tab/Shift+Tab follow that order. Touch sizing is consumer-owned: use IconButton `lg` where a 44px target is required. No additional announcement or focus restoration is proposed.

## 6. Appearance

| Axis | Proposed values / default | Restriction |
| --- | --- | --- |
| New slots | Omitted by default; independently supplied | No output or layout change when both are omitted. |
| Lede | Proposed `m-0 min-w-0 font-sans text-body-default text-fg-secondary wrap-anywhere`; not visually approved | In the existing text Stack after title; its existing token gap and intrinsic text wrapping, including unbroken copy. |

Root stays unpainted: no background, border, shadow or padding; supplied controls retain their approved Material treatments. Use logical flex layout and existing token utilities, static CVA in `types.ts` and per-part `cn()`; no dynamic geometry, new token, dependency or handwritten Material recipe. Existing root `className` remains limited to outer margin, size and parent placement, merged last for recognized `twMerge` conflicts only; it is not an internal appearance override. **No stylesheet** and no extra internal module. The existing six meaningful files remain types, hook, JSX, test, story and index; this spec changes none of them.

### Expected-design visual reference

| ID | Image / scenario | Source / conditions | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending: leading IconButton, title, lede and trailing actions, including narrow RTL reflow | Expected source, viewport, scale, browser, theme, fonts, motion/transparency, crop and date all pending | No capture in this batch; visual approval and hash pending. Visual conformity **Not evaluated**. |

The spec is approved without captures; each PageHeader implementation PR must provide stories and a real capture before merge. A historic v0.1 specimen is not proof of the new layout. Agree the source and conditions before a separately authorized capture; compare against it only after owner adoption. Captures do not replace behavior checks.

## 7. Acceptance criteria

All checks below are planned, not observed; stories do not replace tests.

| ID | Observable promise | Planned test / method | Planned story / visual check |
| --- | --- | --- | --- |
| AC-01 | Omitted new props preserve v0.1 output, markers, defaults and blank-title/eyebrow behavior. | `PageHeader.test.tsx` public rendering and existing regression suite. | Existing Default/WithActions; no new visual assertion. |
| AC-02 | Named leading IconButton is independent, including a slotted link, disabled state, pointer/keyboard activation and retained child ref. | Public role/name, tab, Enter/Space and callback/ref assertions in `PageHeader.test.tsx`. | Leading action example; VIS-01 pending. |
| AC-03 | Lede is a separate paragraph; absent/blank omits it, nonblank survives unchanged, heading name/rank remain unchanged. | Role/name, paragraph order, blank and rerender cases in `PageHeader.test.tsx`. | Lede and combined examples; VIS-01 pending. |
| AC-04 | Long title/lede and individually fitting controls reflow with no overlap/truncation in constrained LTR/RTL; DOM/tab order remains stable. | Unit DOM/order assertions plus browser bounding-box and keyboard checks at narrow widths and 200%/400% zoom; test both controls together. | Constrained and RTL examples; VIS-01 pending. |
| AC-05 | Existing root-only attributes, supported class merge, child states, exports and token-backed CSS remain intact. | Unit, docgen/Controls, static CSS/build and packed React 18/19 consumer checks; browser focus and Controls verification. | Existing and combined examples; visual parity pending. |

### Resolved decisions

- “lede” — use `lede` for the secondary text, consistent with SectionHeader.
- “Aprobar leadingAction” — approve the scoped `trailing-actions` → `PageHeader.leadingAction` naming exception.
- “Sí, validación visual en cada PR” — the spec is approved without captures; the PageHeader implementation PR must provide stories and a real capture before merge.

### Remaining open decisions

- Confirm the direct IconButton-only slot, lede typography and intrinsic leading/text arrangement.
- Select the expected-design source and capture conditions for VIS-01 and obtain separately scoped visual approval.

### Planned checks

After separate plan approval: focused PageHeader behavior tests, the full suite, typecheck and lint; verify docgen/Controls, built static CSS and packed React 18/19 consumers, then browser keyboard/reflow/focus and separately approved visual comparison. All remain pending; spec approval authorizes no code, tokens, dependencies or GitHub writes.
