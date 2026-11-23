# AlertDialog v0.2 — container and pending-action amendment

- **Version / status:** v0.2 — Draft; not ready for implementation.
- **Amends:** the approved AlertDialog v0.1 contract in [#120](https://github.com/egdev6/egdev-design-system/issues/120) and its [local plan record](../v0.1/implementation-plan.md), together with the shared [header-layout amendment](../../dialog/v0.2/header-layout-amendment.md) and its [v0.3 owner extension](../../dialog/v0.3/stacked-header-spacing-amendment.md). It also proposes a bounded Dialog pending-state delta against the approved [Dialog container contract](../../dialog/v0.2/container-compact-amendment.md) and [#119](https://github.com/egdev6/egdev-design-system/issues/119). Unmentioned promises remain unchanged.
- **Approval / recovery:** Pending. Owner decisions below are recommendations, not decisions already made. Approval must bind this exact snapshot, scope and any adopted visual hashes; an implementation plan, naming changes, tokens, dependencies, captures and publication require separate authorization.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: d4a8c74a5104605d1ced9f7b8c14adc7230882b37f102c0fdf276ab7c0ea0555`; `visualHashes: VIS-01 3d348ff39c64508416135197066439add03ac484256180484994e8495df996f4 (historical v0.1); VIS-02 Pending; VIS-03 Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/120`; `latestPublishedComment: Pending` (this snapshot is unpublished; remote AlertDialog history was not checked). [#544](https://github.com/egdev6/egdev-design-system/issues/544) is the follow-up request, not a replacement component issue.
- **Hash definition:** SHA-256 of the UTF-8 payload from the line-start `## 1. Purpose and scope` through EOF, with LF line endings and the final newline; tracking metadata above that heading is excluded.

## 1. Purpose and scope

**Proposal.** Permit an AlertDialog confirmation to mount and lay out within the same positioned host as a Dialog sheet, above the sheet's own chrome. Add a consumer-declared pending-action state to **both** modal roots so an in-flight operation can temporarily prevent the components' user-initiated dismissal paths, including Dialog's built-in close. Both capabilities are opt-in; existing behavior without the new inputs is unchanged. This is a draft contract, not evidence that the implementation exists.

[#539](https://github.com/egdev6/egdev-design-system/issues/539) was accepted and split: [#543](https://github.com/egdev6/egdev-design-system/issues/543) covers sheet width, bounded header and top actions; #544 covers nested confirmation placement and the pending lock. The motivating Recado case is a 440px floating panel: a delete confirmation opened from a host-scoped sheet must stay visible during a request so a late error can be shown. [Recado #41](https://github.com/egdev6/recado/issues/41) is consumer context about DS046–DS048 and issue-backed workarounds, not an approval of this proposal. Removing those workarounds or implementing #543 is out of scope.

**Reuse / alternatives.** Amend the existing `@egdev/ui` molecules and their Radix composition; their public exports are in `packages/ui/src/index.ts` and the local barrels. Existing Dialog `container`/`overlayScope` already serve the sheet, but cannot select AlertDialog's portal. A visual variant does not change portal or dismissal behavior. A separate Portal wrapper, application-only close guard or new component would duplicate modal coordination or leave the built-in close inconsistent. No extra focus, keyboard or modal engine is proposed. Changing either component's contract, or applying the pending state to Dialog, requires explicit owner approval.

**Verified source observations, not runtime validation:**

- `packages/ui/src/molecules/alert-dialog/AlertDialog.tsx` renders a Radix Portal without a target; its Overlay wraps Content and Surface. `useAlertDialog.ts` uses the Dialog overlay recipe with viewport layout. Cancel and Action are Radix decision controls; AlertDialog has no built-in X.
- `packages/ui/src/molecules/dialog/types.ts` and `useDialog.ts` derive `overlayScope` from the ready `container`; `Dialog.tsx` owns an unconditional IconButton close and a separate public `DialogClose`. Dialog's modal remains document-wide even when its paint is host-scoped.
- The existing `PendingAction` story uses controlled `open`, a synchronous ref guard and a loading Button. It keeps the modal open by ignoring close requests; it does not expose a dialog-wide lock or disable Cancel. Button's `loading` is a focus-retaining **control** state, not a modal state (`packages/ui/src/atoms/button/useButton.ts`).
- The v0.1 AlertDialog plan explicitly excluded nested-dialog stacking and gave consumers responsibility for stacking and triggerless focus return. This amendment proposes only the bounded nested case below; it does not claim general overlay ordering.

## 2. Anatomy and composition

| Part | Responsibility and proposed delta |
| --- | --- |
| `AlertDialog` / `Dialog` roots | Existing separate Radix modal roots; each receives its own proposed consumer-controlled `pending` value. No DOM wrapper or new focus engine. |
| AlertDialog Portal and Overlay | Radix Portal mounts into the selected target; the existing Overlay contains the modal and adopts viewport or host layout. |
| Content / Surface | Existing `alertdialog` or `dialog` role, title and description relationships, Surface paint and markers. While its own root is pending, its Content is `aria-busy=true`. |
| AlertDialog Cancel and Action | Existing native or supported `asChild` button-compatible controls; transiently unavailable while their AlertDialog is pending. Cancel remains the normal initial focus target. |
| Dialog built-in close and `DialogClose` | Existing IconButton and explicit close controls become transiently unavailable while their own Dialog is pending. AlertDialog does not gain an X. |
| Host | Consumer-owned positioned, connected same-document element with definite usable dimensions; it bounds paint, not modal interaction. |

Keep the existing `eg-alert-dialog*` and `eg-dialog*` markers, public parts, title/description order and `asChild` restrictions. A compatible slotted button spreads props and forwards its ref; arbitrary nested interactive controls and custom capture/native listeners that perform side effects before the guard are not supported as lock enforcement. The components continue to use their individual installed Radix packages, not the standalone Portal primitive as a replacement.

## 3. Public API

The following types and behavior are **proposed**, not present today.

| Surface | Type / default | Proposed rule |
| --- | --- | --- |
| `AlertDialogContent.container` | `HTMLElement \| null`, optional; omitted/null uses body | Ready, connected, same-document Radix portal target; same supported host lifecycle as Dialog. |
| `AlertDialogContent.overlayScope` | `'viewport' \| 'container'`, optional; derived | Non-null host defaults to `container`; no host defaults to `viewport`. Explicit `viewport` permits mount-only use. |
| `AlertDialog.pending` | `boolean`, optional; `false` | One confirmation's consumer-declared in-flight action locks its component-owned dismissal controls and marks its content busy. |
| `Dialog.pending` | `boolean`, optional; `false` | Independently does the same for that Dialog, including its built-in close and `DialogClose`. It does not infer a nested AlertDialog's state. |

For AlertDialog placement, mirror Dialog's union: `{ container?: null; overlayScope?: 'viewport' } | { container: HTMLElement; overlayScope?: 'viewport' | 'container' }`. A container-scoped overlay without a ready host is invalid; if supplied by untyped code, render neither overlay nor content rather than silently portalling into body. Consumers render Content only after the ref is ready and close before removing or replacing the host; moving a live portal, cross-document hosts, shadow roots and iframes are not promised. Omitted/null target with viewport layout retains the current body portal, including its existing client-mount/SSR behavior. A viewport-scoped custom portal remains subject to clipping and fixed-position containing blocks.

**Prop naming.** The [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [lookup workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry) were checked by name, meaning and aliases:

- Reuse approved `portal-container` → `container`; this is a portal mount, not a collision or layout boundary. `DialogContent` already uses `HTMLElement | null`.
- Propose reuse of `dialog-overlay-scope` → `overlayScope` for the same modal-overlay layout on `AlertDialogContent`. Its current approved wording explicitly says Dialog; owner naming review must confirm that it covers AlertDialog or approve a scoped semantic amendment. Do not silently widen or duplicate the convention.
- Propose new semantic ID **`modal-action-pending`** → `pending: boolean` on each root: a consumer-declared action is in flight for that modal and its user dismissal is temporarily locked. It is not an automatic Promise tracker, generic modal setting, per-control spinner, collection refresh or progress value. The approved `pending-activity` → `loading` concerns an individual action control (and existing Input usage has its own behavior); `results-busy` → `busy` concerns refreshing a collection. Neither describes this lock. No matching `pending` name or proposed ID was found. No exception or registry edit is made here; this new convention needs its own scoped approval independently of the spec.

Reviewed existing source bytes (each `symbol` is the inspected public declaration):

- `{path: 'packages/ui/src/molecules/alert-dialog/types.ts', symbol: 'AlertDialogContentProps', revision: 'sha256:a669f446426068240f2143bc21a7f48980f81510521b00f177035fa2b7ceb7b5'}`.
- `{path: 'packages/ui/src/molecules/alert-dialog/types.ts', symbol: 'AlertDialogProps', revision: 'sha256:a669f446426068240f2143bc21a7f48980f81510521b00f177035fa2b7ceb7b5'}`.
- `{path: 'packages/ui/src/molecules/dialog/types.ts', symbol: 'DialogContentProps', revision: 'sha256:631f34f582959c9049124289bc570686e0505fe03d099fb83ee18403e37d8479'}`.
- `{path: 'packages/ui/src/molecules/dialog/types.ts', symbol: 'DialogProps', revision: 'sha256:631f34f582959c9049124289bc570686e0505fe03d099fb83ee18403e37d8479'}`.
- `{path: 'packages/ui/src/atoms/button/types.ts', symbol: 'ButtonProps', revision: 'sha256:26547d7d24fb9a9e8f5a3850d09ef9e010dce123f62c8fcc3db7c9ccf16cb11e'}`.

These identify inspected **existing** symbols, not evidence that proposed props already exist. After any separately authorized implementation, inspect the final symbols and update usage evidence against the final whole-file hashes through the registry workflow.

**Compatibility and ownership.** Root `open`, `defaultOpen` and `onOpenChange`, content native-prop exclusions, supported `className` boundaries, markers, exports and button refs remain. Content has no public ref; Trigger/Cancel/Action and Dialog Trigger/Close retain their existing button-ref and `asChild` contracts. `pending` and placement inputs are consumed, not leaked to DOM. When pending is false, any consumer-supplied native `aria-busy` passes through as before; while true the owned content value is `true` even if the consumer supplied `false`. Do not add an unconditional `aria-busy=false` to existing content. React 18/19 compatibility is a planned package check, not inferred from types.

## 4. Behavior

| Given / action | Proposed observable result and notification |
| --- | --- |
| No new props | AlertDialog uses the body portal and fixed viewport overlay; both modals preserve their current initial state, dismissal, focus and callbacks. |
| Ready host, omitted or `container` scope | The alert portal is in that host; its absolute inset overlay and centered panel follow the host's bounds and resize without runtime geometry measurement. |
| Ready host, explicit `viewport` scope | The portal is under the host; the existing fixed viewport overlay is retained, subject to host ancestor constraints. |
| Sheet open; nested alert opens later into the same host | In the supported common stacking context described below, the alert overlay and panel paint and receive pointer input above the sheet, including its close and header chrome. The sheet stays open underneath. |
| `pending=true`, Escape | The top modal remains open and sends no `onOpenChange(false)` for the blocked request. It must not let the same Escape dismiss the underlying sheet. |
| `pending=true`, overlay/outside interaction | Dialog's outside dismissal is blocked without a close request; AlertDialog already ignores outside dismissal, which remains true. Underlying controls do not activate through the modal. |
| `pending=true`, Cancel, Action, Dialog's built-in close or `DialogClose` | These controls expose unavailable semantics, stay in the focus order and cannot request close or run their ordinary click action. The pending Action cannot start another request through its supported click path. |
| `pending` returns to false | The normal control and Radix dismissal behavior returns; failure may remain visible in the open modal and the user can retry or cancel. No callback is emitted merely because the prop changed. |
| Consumer changes controlled `open` to false or unmounts | The consumer can still close/remove the modal; the lock is a user-interaction safeguard, not a transaction, security or unmount guarantee. Incoming prop changes are not echoed. |

The supported nested stacking case uses the **same ready host** for sheet and alert, the sheet open first and alert opened afterward, with their portal layers participating in the same stacking context and no consumer-supplied competing z-index, clipping or occluding layer. The later alert must cover the sheet's own chrome throughout opening and while pending. Consumers own the host's size, containing block, clipping and external stacking; differing stacking contexts, arbitrary elevated descendants, other overlays and portal target changes are not guaranteed. If real-browser checks show sibling ordering is insufficient even for the supported case, stop for a scoped stacking decision; do not assert an unverified z-index, add a token or silently change all Dialog defaults.

**Starting an async Action.** Radix Action normally requests close in the same click. Setting React `pending` alone is not a synchronous cancellation of that first request. A controlled consumer must synchronously call `event.preventDefault()` on the Action click before starting the operation, or synchronously guard `onOpenChange` with a ref as the existing story does. Guard repeat calls synchronously as well, before React commits the pending render. The consumer starts the operation, sets `pending=true`, supplies visible localized progress, and controls completion: on success clear the lock and close; on error clear the lock, keep the modal open and show a recoverable error. An uncontrolled root remains supported for ordinary use; an async workflow that must close on successful completion should use controlled `open` or another explicitly consumer-owned lifecycle. No Promise inspection, timeout or automatic result handling is proposed.

The lock applies to the component-owned close paths, not arbitrary child buttons, links, forms, app-level shortcuts, parent state updates or imperative unmounts. Consumers must guard their own operations and any independent close paths. Nested roots have independent pending values: pass the relevant state to each root whose own dismissal must be locked; a visually covering child does not automatically set its parent's `pending`.

## 5. Accessibility

Radix continues to own roles, modal focus containment, outside hiding, scrolling, Escape handling and normal restoration; the implementation may use its supported cancellable events but must not replace its keyboard, focus or modality engine. A host-scoped overlay is still document-modal, not a locally interactive page. Verify the nested case in a real browser and assistive technology: while open, the alert is the active accessible modal, the underlying sheet is unavailable, Tab/Shift+Tab stay within the top modal, and closing the alert restores the sheet's accessibility and focus.

**Recommended transient guard:** expose `aria-disabled=true` and suppress activation on the affected component-owned controls while keeping them focusable, rather than applying native `disabled` to the currently focused control. This follows the focus-retaining intent of Button `loading` but is a separate modal-wide concept. Preserve an explicitly disabled control's existing native/Slot behavior and precedence. Guard pointer, Enter, Space and supported programmatic click paths, including compatible slotted buttons, before ordinary click handlers/close requests; never synthesize a click or invent keyboard navigation. Consumer-owned capture/native side effects and independent close mechanisms remain the consumer's responsibility. The later plan must verify the guard and focus behavior with Radix Slot composition rather than assume handler order is safe.

When a pending action starts, keep focus on the existing appropriate control; do not move it merely because the lock changes. Keep a visible, localized, non-color pending indication and a usable recovery path. `aria-busy=true` describes the content while the operation is in flight; it does **not** by itself guarantee an immediate spoken announcement. Recommend **no built-in live region**: the consumer owns progress and error copy and any separately designed announcement. A live region under an `aria-busy` subtree can be deferred, so an immediate announcement must not be promised without an accessible placement and real AT verification. On failure, clear busy before presenting an error that must be announced; test the chosen consumer announcement separately.

On normal child close, Radix returns focus to its still-connected, enabled Trigger in the sheet; a later parent close returns to its own Trigger. Triggerless use, a deleted/disabled Trigger, unmount or forced controlled close remains the consumer's restoration responsibility. Preserve non-empty localized title, consequence and action names, `aria-modal`, focus ring visibility, action order and the decorative danger icon. No screen-reader or browser result is claimed here.

## 6. Appearance

| Axis | Proposed rule |
| --- | --- |
| Overlay layout | Existing viewport `fixed inset-0` or host `absolute inset-0`, with the same scrim and centered grid. No measured or inline geometry. |
| Panel and header | Preserve AlertDialog Surface `surface-2`, elevation, radius, sm cap, tone/icon and approved header-layout behavior; preserve Dialog sheet Material, chrome and layout. |
| Pending controls | The consumer supplies visible progress and may compose existing `Button loading`; this amendment introduces no spinner, text, color or appearance variant. Preserve existing focus-visible treatment and distinguish unavailable controls accessibly. |
| Motion and transparency | Preserve the existing Material, focus and reduced-motion/transparency behavior. A host changes bounds, not Material or modality. |

Use the existing marker-free Dialog overlay/scrim recipes with static CVA and per-part `cn()`; do not clone Surface paint, change legacy styles or add a token, dependency, inline appearance or handwritten shadow. The current `className` contracts and last-merge limits remain: recognized utility conflicts are not universal cascade or appearance-policy guarantees. The pending guard must not make a supported focus ring disappear or send a pointer through to sheet chrome.

The existing six meaningful files for each molecule keep their roles: `types.ts`, `useAlertDialog.ts` / `useDialog.ts`, `AlertDialog.tsx` / `Dialog.tsx`, their `.test.tsx`, `.stories.tsx` and `index.ts`. **No stylesheet** and no extra internal module are proposed. Any necessary implementation, shared-recipe, registry, story or integration edits require an independently approved plan and authorized surfaces.

### Expected-design visual reference

| ID | Image / descriptive scenario | Source, conditions and status |
| --- | --- | --- |
| VIS-01 | [Historical specimen](../../../design/foundation-boards/v2026-10-18-wave3/specimens/alert-dialog--specimen.png) — neutral and danger confirmations and decision controls | Historical v0.1 expected-design reference, not a v0.2 capture or evidence of nesting/pending. Its recorded hash above was checked against the local PNG. |
| VIS-02 | Pending — confirmation over the chrome of a host-scoped sheet | Source/version, image, conditions, hash and owner adoption Pending. |
| VIS-03 | Pending — the same confirmation during a delete request, with visible progress and unavailable controls | Source/version, image, conditions, hash and owner adoption Pending. |

VIS-01 provenance: agent-composed specimen, Playwright MCP, Chromium 148 on Linux, 2026-10-18, viewport 1280×900, DPR 1, Barlow/Barlow Condensed/JetBrains Mono, reduced motion off, 1280×515 component crop; theme and reduced-transparency preference were not recorded. See [capture metadata](../../../design/foundation-boards/v2026-10-18-wave3/specimens/capture.json) and the v0.1 plan for the static specimen's limits. It does not verify runtime interaction.

For VIS-02/03, agree an actual expected-design source, scenario, viewport, DPR, browser/version, fonts, theme, motion/transparency, crop, date/tool and approval before any capture. Follow the [visual guide](../../../design/README.md); no server or capture was authorized here. **Visual conformity: Not evaluated.** Images do not replace hit-testing, keyboard or AT checks.

## 7. Acceptance criteria

All checks below are **planned**, not observed. Stories illustrate scenarios and do not replace tests.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Omitted/null target and omitted/false pending preserve body portal, viewport layout, current focus, Escape, outside and action behavior, callbacks, markers and defaults for both components. | Public DOM, pointer/keyboard, controlled/uncontrolled and existing story regressions; preserve AlertDialog's outside-ignore and Dialog's outside-dismiss behavior separately. | Pending. |
| AC-02 | Host scope and explicit viewport scope match the placement union; invalid host/scope never falls back to body, and new props do not leak to DOM. | Positive/negative public type fixtures, DOM/SSR and conditional host-readiness tests; browser host resize and viewport/clipping examples. | Pending. |
| AC-03 | A confirmation opened from a host-scoped sheet paints and hit-tests above its own header and close, remains within the host, and does not dismiss the sheet. | Recado-like 440px host story; real-browser geometry and `elementFromPoint`/pointer tests, sheet chrome and opening transitions under the stated stacking preconditions; VIS-02. | Pending. |
| AC-04 | Each pending root blocks its own Escape, outside/scrim and supported close controls without `onOpenChange(false)` or ordinary click callbacks; the alert's blocked Escape cannot close the sheet. | Public interaction tests for AlertDialog Cancel/Action and Dialog built-in close/`DialogClose`, native and compatible slotted controls, pointer/Enter/Space/programmatic click; controlled and uncontrolled cases. | Pending. |
| AC-05 | Starting a delete cannot close on the initiating click; repeated activations cannot start duplicate requests. Success closes deliberately; failure clears busy and leaves a visible recoverable error in the open confirmation. | Controlled async story and deterministic deferred-promise tests with synchronous default prevention/ref guard; assert operation and callback counts, pending transitions, success and failure. | Pending; VIS-03. |
| AC-06 | Busy and guard semantics preserve focus, `aria-modal`, names, relationships, independent nested roots and restoration; false pending preserves supplied `aria-busy`. | Role/attribute and focus tests, including focused Cancel/close when pending begins, explicit disabled precedence and valid/missing Trigger; real-browser and manual AT checks for nested open/close, error and announcement limitations. | Pending. |
| AC-07 | Existing Material, `headerLayout`, public APIs/refs, supported merges and reduced preferences remain; no new styling or unrelated Dialog recipe regression. | Component preserve tests, actual emitted CSS/static CVA scan and browser computed-style/focus checks; story and documentation review. | Pending. |
| AC-08 | Proposed types/metadata and packaged behavior work with supported React versions and a consumer without its own Tailwind compiler. | Public export/type and docgen/Controls checks, packed React 18/19 consumers and shipped-CSS validation under a separately approved plan. | Pending. |

### Open owner decisions

1. **Scope and naming:** (A) `pending?: boolean` on both modal roots, with new `modal-action-pending` convention; (B) AlertDialog only, leaving Dialog's built-in close to a separate contract; (C) separate dismissal-lock APIs instead of a pending concept. **Recommend A:** the request includes both confirmation and sheet close, and independent root values avoid accidental propagation. Approve the new naming convention separately.
2. **Portal and scope:** (A) `container` plus Dialog-equivalent `overlayScope` and derived defaults; (B) `container` only with host layout forced; (C) keep body-only mounting. **Recommend A:** it meets bounded-host and mount-only use without changing defaults. Confirm whether existing `dialog-overlay-scope` approval includes AlertDialog or approve a scoped wording amendment.
3. **Unavailable controls and focus:** (A) focus-retaining `aria-disabled` plus guarded activation; (B) native `disabled` with a separately approved focus policy; (C) only suppress close requests while leaving controls apparently active. **Recommend A:** it communicates unavailability without deliberately removing the focused control; verify the exact Radix/Slot behavior. Explicitly disabled controls keep their existing behavior.
4. **Announcements:** (A) `aria-busy` on the active content, visible consumer-owned progress/error and no built-in live region; (B) add a component-owned localized live announcement; (C) no busy state, consumer owns all status. **Recommend A:** avoid duplicate or fabricated announcements while acknowledging that `aria-busy` can defer descendant live updates. Choose B only with a specified message API, placement and AT evidence.
5. **Stacking boundary:** (A) guarantee the stated same-host/common-context case, with external stacking consumer-owned; (B) design a broader overlay-layer policy and separately approve its inputs/tokens; (C) leave all nested stacking consumer-owned. **Recommend A:** it addresses the actual sheet without claiming universal z-index ordering; require the browser gate before implementation acceptance.
6. **Visual evidence:** (A) review this behavioral draft now, with VIS-02/03 still Pending and conformity Not evaluated; (B) first authorize and approve real expected-design captures. **Recommend A** for this draft, then agree captures and conditions separately before making a visual-conformity claim.

**Next step:** owner reviews these choices and this exact digest, followed by separate convention and implementation-plan approvals. No code, tests, tokens, dependencies, registry, issue comments or release changes are authorized by this draft.
