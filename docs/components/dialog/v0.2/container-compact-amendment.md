# Dialog v0.2 — container and compact-body amendment

- **Version / status:** v0.2 — Approved — 2026-11-17 (parent applying the recommended options under owner delegation; see "Approval" below). Implementation plan follows the same delegation.
- **Amends:** [v0.1 implementation plan](../v0.1/implementation-plan.md) and the approved [#119 contract](https://github.com/egdev6/egdev-design-system/issues/119#issuecomment-6251587415). Unmentioned promises remain unchanged. Requests: [#409](https://github.com/egdev6/egdev-design-system/issues/409) and [#421](https://github.com/egdev6/egdev-design-system/issues/421), as narrowed by its [revision](https://github.com/egdev6/egdev-design-system/issues/421#issuecomment-6923521771).
- **Approval / recovery:** This file is the recoverable draft, not approval. Exact-snapshot approval, any scoped naming exception and the implementation plan require their own approval; no code, token, dependency or GitHub mutation is authorized here.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/119`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from the actual `## 1. Purpose and scope` heading through EOF, LF line endings and final newline; metadata above it is excluded. Finalize before publication and bind approval to this version, digest and identified visuals.

## 1. Purpose and scope

Extend the existing `@egdev/ui` Dialog molecule rather than replacing its Radix modal: a consumer may mount the modal in a positioned panel and bound the overlay **and content** to that panel; an independent opt-in body-padding preset supports compact forms. The custom portal target alone must not leave the overlay viewport-fixed. News, application actions and a new focus engine are non-goals. `Stack` remains the consumer's way to set gaps *between* body children.

**Evidence:** `packages/ui/src/index.ts` exports Dialog, Portal, Surface and Stack; `packages/ui/src/molecules/dialog/{types.ts,useDialog.ts,Dialog.tsx,Dialog.test.tsx,Dialog.stories.tsx}` currently use the Radix Dialog portal, a fixed viewport grid and `p-[var(--space-6)]` body. `packages/ui/src/primitives/portal/{types.ts,Portal.tsx}` supports a ready alternate mount, but the separate Portal does not own Dialog focus/presence and cannot replace Dialog's internal portal. `packages/ui/package.json` already declares `@radix-ui/react-dialog` 1.3.1; its installed source delegates focus, outside hiding, pointer blocking and scroll locking to Radix. These are source observations, not browser results.

## 2. Anatomy and composition

| Part | Responsibility / implementation | Content |
| --- | --- | --- |
| Root and Trigger | Existing Radix modal root and native/slotted Trigger | One optional Trigger and one Content |
| Portal and overlay | Radix Dialog Portal → Overlay; overlay is the scrollable grid | Fixed viewport grid or absolute inset grid in the positioned custom host |
| Panel | Existing Radix Content asChild → Surface; centered/full or sheet | Existing title, optional description/status, body, footer actions and built-in close |

Preserve `eg-dialog-backdrop`, `eg-dialog`, `eg-dialog__head`, `eg-dialog__title`, `eg-dialog__description`, `eg-dialog__status`, `eg-dialog__body`, `eg-dialog__foot`, Surface markers, native/slotted Trigger/Close refs and title/description relationships. Radix retains the portal and modal engine; do not add a wrapper Portal or duplicate its state/focus logic.

## 3. Public API

| `DialogContent` prop | Type / default | Proposed contract |
| --- | --- | --- |
| `container` | `HTMLElement \| null`, optional; absent/null → body | A ready, connected, same-document mount target. A non-null host defaults the overlay to `container`; no portal node means no server-side DOM target. |
| `overlayScope` | `'viewport' \| 'container'`, optional; derived from `container` | Explicitly choose the grid boundary. `container` requires a non-null ready host; `viewport` permits a custom mount solely for theme/placement. |
| `bodyPadding` | `'default' \| 'compact'`, optional; `default` | Only the body padding changes: default `--space-6`; compact `--space-3` on all sides. Header, footer and child gaps are unchanged. |

Use a placement union: `{ container?: null; overlayScope?: 'viewport' } | { container: HTMLElement; overlayScope?: 'viewport' | 'container' }`, intersected with the existing centered/sheet dimensions union and native restrictions. A non-null container with omitted `overlayScope` selects `container`; an explicit `viewport` retains viewport layout. `overlayScope='container'` without a ready host is invalid. In untyped runtime use, do not silently render a container-scoped modal into body: render no Content/overlay until the host is ready. Consumers should conditionally render Content until the element ref is set, and close before replacing or removing the target; changing targets during an open modal is unsupported and may remount content. An omitted/null target in the viewport branch keeps the old body portal, including its client-mount/SSR behavior.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry), searched by name, meaning and aliases. `container` reuses approved `portal-container` as the *mount* input, not a collision boundary. Propose new `dialog-overlay-scope` / `overlayScope` (`'viewport' | 'container'`): layout of this modal's own overlay, not floating-side, generic positioning or the mount target itself. `bodyPadding` matches `inner-padding` / `padding`, but needs a **pending scoped exception** `{scope: 'DialogContent', propName: 'bodyPadding', reason: 'Only the body changes; padding would misleadingly describe the whole panel', approval: null}`. It is not `compact-presentation` (icon-only launcher) or the existing panel `size` / `preset-dimensions`. The exception and new convention need separate approval; no registry edit is made here.

Reviewed baseline sources: `{path: 'packages/ui/src/molecules/dialog/types.ts', symbol: 'DialogContentProps', revision: 'sha256:55f9ddfadf7e3f5cd9859f34373c926fbcb2e09294c782b712b22dd92f4884c1'}`; `{path: 'packages/ui/src/primitives/portal/types.ts', symbol: 'PortalProps', revision: 'sha256:b0fd77d5f283fa71d0617c210bdc9db31185f00a6f1bf1034c4e5a8867edf9ff'}`. These hashes identify reviewed existing symbols, not the proposed new props. Record new usages against the actual reviewed implementation bytes later, after separate authorization.

**Explicit contract reversal and migration:** v0.1 deliberately excluded `container`; `Dialog.test.tsx` contains a `@ts-expect-error` fixture asserting that exclusion. This revision reverses it because body portalling plus a viewport overlay cannot serve a positioned panel. Replace that negative fixture with positive `container` type tests and invalid scope/host tests, retaining the other negative cases. Existing consumers with no new props continue to portal into body with the same viewport overlay, defaults, markers and layout. Consumers opting into a host must provide and maintain the positioning/clipping conditions below; remove their custom modal and internal-part overrides only after the implementation and consumer checks pass. Existing className/native/ref restrictions and controlled/uncontrolled API stay unchanged.

**Already delivered:** Button `labelWrap` was shipped in [#422](https://github.com/egdev6/egdev-design-system/issues/422) / #439; compose that existing opt-in where needed. This revision neither changes nor re-specifies Button wrapping. It is not a dependency on #396, #417 or #424.

### Decisions awaiting approval

- Portal and overlay: **Recommended** — a separate `overlayScope`, defaulting from the ready host, with an explicit viewport override. This satisfies the supplied-container case while preserving mount-only use and the old default.
- Compactness: **Recommended** — `bodyPadding='compact'` maps to `--space-3`; existing `Stack` controls inner gaps. The change is local, tokenized and does not alter panel width or actions.
- Modal boundary: **Recommended** — bound *paint and layout*, not Radix's modal interaction scope. This preserves the existing modal rather than inventing a weaker focus/inertness engine.

## 4. Behavior

| Given / action | Expected result |
| --- | --- |
| No target, or null with viewport scope | Existing body portal and viewport overlay; no default change. |
| Connected positioned host and omitted scope, or scope `container` | Portal is a child of that host; absolute inset overlay and panel stay within its padding box and follow host resize without measurement. |
| Host and explicit `viewport` | Portal is under the host but uses the existing fixed viewport overlay, subject to ancestor clipping/containing blocks. |
| Compact body | Only its padding is reduced; body remains the scroll viewport with `min-h-0` and `overflow-y-auto`; long contents do not displace header/footer. |
| Controlled/uncontrolled open, Escape, close, scrim click | Existing Radix requests, visibility, dismissal and focus behavior remain; no extra callbacks on prop changes. |

The host must be connected in the same document, have a nonzero definite size and establish the overlay's containing block (for example `position: relative`); it must not itself scroll. Host clipping, borders, stacking and sufficiently usable dimensions are consumer-owned; the body scrolls inside the overlay/panel. Do not promise shadow-root, iframe, cross-document, nested-dialog or target-removal behavior. A viewport-scoped custom portal requires no clipping or ancestor transform/containment that changes fixed positioning. The supplied host does not localize modality: Radix's modal hides outside content from assistive technology, traps focus and blocks outside pointers/scroll at document scope, including outside the panel. Consumers must accept that document-wide effect; a visually bounded scrim is not a locally modal or independently interactive page.

## 5. Accessibility

Keep a non-empty localized title, optional description, `aria-modal`, native button names and Radix-owned relationships. Radix captures focus, loops Tab/Shift+Tab, handles Escape/outside dismissal and restores the Trigger where present. Trigger-less controlled consumers continue to own restoration. On close, restore background availability. A panel clipped by its host must still expose usable focus rings and reachable scrolling; the consumer supplies an adequately sized host and accessible child controls. Verify real browser and assistive-technology behavior: DOM ownership or visual bounds alone do not prove modality or inertness.

## 6. Appearance

| Axis | Values / default | Rule |
| --- | --- | --- |
| Overlay layout | viewport / container; derived as above | `fixed inset-0` versus `absolute inset-0`; preserve existing grid, overflow, flush/full/sheet rules and scrim paint. |
| Body padding | default / compact; default | `p-[var(--space-6)]` / `p-[var(--space-3)]`; no change to other parts. |
| Panel | existing centered sizes / sheet | Keep Surface tones, elevation, radii, width caps, RTL, transparency fallback and reduced motion. |

Use static CVA utilities in `types.ts` and per-part `cn()` in the hook. No inline appearance or dynamic measured geometry; no new tokens, shadows, gradients or dependency. Content `className` continues to support the existing outer layout only, merged last by `cn`; overrides of panel paint, padding, width, positioning and focus are unsupported and not sanitized. `twMerge` handles recognized conflicts, not all CSS cascade. Preserve the shared marker-free scrim recipe used by AlertDialog/CommandPalette; scope the new layout axis to Dialog's overlay, not the shared paint recipe. The six existing files retain their roles: `types.ts`, `useDialog.ts`, `Dialog.tsx`, `Dialog.test.tsx`, `Dialog.stories.tsx`, `index.ts`. **No stylesheet** or extra internal module.

### Expected-design visual reference

| ID | Scenario / source | Status and conditions |
| --- | --- | --- |
| VIS-01 | Pending: positioned panel, bounded centered dialog and outside-panel page | No capture, source version, browser, viewport, DPR, fonts, theme, motion/transparency, crop, date, hash or visual approval supplied. |
| VIS-02 | Pending: compact long form and wrapped existing Button label, narrow host | Same conditions and provenance pending; no screenshot is implied. |

No captures are produced in this batch. The implementation PR must provide stories and real component-zone captures with provenance/conditions and request visual approval before merge. Visual conformity is **Not evaluated**; see the [capture guide](../../../design/README.md). Captures do not replace keyboard or AT checks.

## 7. Acceptance criteria

All checks are planned, not observed.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Omitted/null target keeps body portal, fixed viewport, default body padding and existing markers/defaults. | Public DOM and positive/negative type tests; Default story; compiled CSS regression. | Pending |
| AC-02 | Ready positioned host with omitted/container scope contains overlay and panel before/after resize; invalid container-scoped input never falls back to body. | Portal DOM/type tests; real browser resize/geometry/clipping and host lifecycle; Container story; VIS-01. | Pending |
| AC-03 | Explicit viewport scope under a custom host keeps fixed overlay; lifecycle and unsupported ancestor limitations are documented. | DOM and browser geometry examples including SSR/hydration and conditional ref readiness. | Pending |
| AC-04 | Compact body uses space-3 while default uses space-6; both retain header/footer, content scrolling, widths and supplied actions. | Recipe/DOM and computed-style/overflow tests; CompactForm and LongContent stories; VIS-02. | Pending |
| AC-05 | Both layouts preserve names, controlled requests, Tab trap, Escape/scrim dismissal, background hiding/pointer blocking and Trigger restoration. | Real Radix user-event tests, real-browser and manual AT checks, including nested positioned host; verify actual WebView2 in Nexo before its workaround is removed. | Pending |
| AC-06 | Existing centered sizes, full/sheet RTL, Surface/scrim, reduced preferences, supported merge and Button labelWrap behavior remain intact. | Existing regressions plus browser computed CSS, focus, narrow/zoom and packed React 18/19 consumer checks. | Pending |
| AC-07 | Types, prop metadata and public exports implement only the proposed additions without leaking placement props to the panel DOM. | Compile/type fixtures, docgen/Controls, emitted CSS and package-consumer checks. | Pending |

**Next step:** Review the recommended decisions and naming exception, finalize this snapshot and separately approve an implementation plan. Real captures and browser/WebView2 evidence remain outstanding; this draft authorizes no implementation.

## Approval

- **Status:** Approved 2026-11-17.
- **Authority:** the owner delegated these decisions to the parent's recommendations: "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar" (owner session 2026-11-17, recorded in `odd/tasks/milestones-1-2-delivery.md` L1 and `odd/tasks/nexo-adoption-m2-specs.md` L1).
- **Resolution:** every open decision in this document resolves to its option marked **Recommended**. New or changed prop-naming conventions and scoped exceptions proposed here are approved together with this spec; registry entries and approval records are added in the implementation PR.
- **Not approved here:** new tokens or token value changes, new dependencies, and anything this document flags as out of scope; those stop for the owner.
