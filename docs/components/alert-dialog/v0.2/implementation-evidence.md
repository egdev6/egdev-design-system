# AlertDialog v0.2 — implementation evidence

## Scope and status

This lane implements AlertDialog's `container`, `overlayScope` and root-local `pending`, and Dialog's
independent root-local `pending` after #543. The scoped naming amendment and `modal-action-pending`
approval are recorded in [prop-naming-approval.json](prop-naming-approval.json). The earlier Dialog
receipt and the approved amendment snapshot are unchanged. The owner chose to document the outside-host
focus limitation (odd/tasks/consumer-request-specs.md L41); final package gates remain parent-owned.

## Observed tests

- Dialog pending RED: the focused Dialog/AlertDialog command failed 10 and passed 77 tests, exposing
  missing busy, guards and dismissal blocking. The identical command then passed 87/87 after implementation.
  Header, accent and CommandPalette preservation passed 28/28. Dialog tests cover header/footer placement,
  native/Slot refs and handlers, built-in close, pending transitions, Escape/outside, independent nested
  roots and consumer-guarded failure/retry/success.
- The current Storybook source docgen, Controls pipeline and CSS checks passed 517/517. The reviewed
  registry and generated view passed `pnpm props:check` and 134/134 `pnpm test:props`. The regenerated
  artifact and system reference passed their freshness checks, 52/52 artifact tests and 36/36 system tests.
- The initial AlertDialog focused RED run failed 15 tests and passed 47: absent pending/busy and decision guards,
  body instead of hosted portals, and missing-host fallback were observed. After implementation the
  same command passed 62/62. A further Slot regression for a child declaring `aria-disabled=false`
  failed 1 test before the fix and passed afterward. The latest focused run passed 64/64.
- The focused tests cover body/null, derived/explicit host and mount-only scope, invalid untyped
  missing hosts, SSR and host readiness; busy pass-through and override; native and slotted Cancel
  and Action, focus, refs, pointer/keyboard/programmatic activation, Escape, outside interaction,
  controlled close, deferred failure/retry/success and a same-host nested DOM-order regression.
  The slotted Trigger remains operable while pending. These jsdom checks do not prove painted
  stacking, real pointer hit testing or screen-reader announcements.
- Header, Dialog accent and CommandPalette preservation: 26/26. Storybook source docgen,
  installed Controls mapping, preview CSS compilation and a write-free production-source CSS
  build: 510/510. The latter checks the emitted absolute/fixed/inset and scrim utilities without
  story scanning, not the final shipped package. Typecheck and Biome passed; actual browser
  Controls remain unverified.
- The earlier AlertDialog-only registry and artifact became stale after its browser pointer fix.
  Both files' reviewed source revisions have since been refreshed and the generated outputs regenerated.
  The `dialog-overlay-scope` receipt continues to pin the historical Dialog receipt.
- `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` contain updated
  declaration, CSS and consumer fixtures. They have not been run against a fresh candidate build.

## Real-browser evidence

`node docs/components/alert-dialog/v0.2/browser-evidence.mjs` passed with harness SHA-256
`c9015505fc150613086ac0237b7783e00d5bd9476bd77507fe2e1fe8f7bc4ace`. It compiles UI JavaScript,
UI CSS and native token CSS from current sources without writing repository build output, hydrates
the SSR shell, uses a fresh temporary Chrome profile, and cleans up its scratch. HTTP(S) was blocked.
Chrome 148.0.7778.167 ran headless at 1000×800, DPR 1, zoom 1, LTR, with no theme override,
reduced transparency off and browser fallback Times New Roman. Both normal and reduced motion were
sampled for stacking; external web fonts and other browsers were not evaluated.

- **Placement and modality:** five body/null/derived/container/viewport cases passed, including
  three resized-host checks. The 440×600 host and its contained overlay were both at (108, 89);
  after resize both were 360×520. The hosted viewport overlay was (0, 0, 1000, 800) before and
  after resize. Outside content was accessibility-hidden and pointer-inert, Tab/Shift+Tab stayed
  inside the alert, and normal Escape and Cancel restored trigger focus.
- **Same-host stacking:** with a full-width sheet and header action opened first in the same positioned
  host, 176 sampled `elementFromPoint` checks across two host sizes, two motion preferences, four
  post-mount samples and eleven sheet-chrome/host-edge points hit the alert or its veil. Eighty-eight
  mouse/touch sequences at those points while pending caused no sheet or alert close request or header
  action. Eight normal Cancel/Action mouse/touch sequences hit the actual alert button and closed only
  the alert; nested and parent
  trigger focus return was checked. This is sampled evidence, not continuous transition coverage
  or a guarantee for clipped/competing stacking contexts; close-button corners were not sampled.
- **Pending:** 16 native/slotted Cancel/Action × mouse/touch/Enter/Space sequences reached the
  intended button, kept focus there, and invoked no ordinary decision handler or close request.
  Both controls exposed `aria-disabled=true` without native disabling and the panel was busy.
  Pending Escape retained focus and did not close in both forms; unlocking restored Cancel, and
  two explicitly disabled controls retained native disabled semantics. A synchronous-start fixture
  blocked a duplicate, then observed failure/retry/success with two total operations and no
  premature close request.
- **Browser-found pointer defect:** before the fix, the legacy Button `aria-disabled` rule made a
  pending native Cancel pointer-transparent. The browser test failed on its painted target before
  implementation; the AlertDialog-only static utility then restored pointer hit testing while
  excluding native `:disabled`. This changed `packages/ui/src/molecules/alert-dialog/types.ts`.
- **Dialog pending:** 48 native, slotted-native and slotted-Button explicit and built-in close
  activations across mouse, touch, Enter and Space passed, including both header and footer placement.
  Six Escape and six scrim probes were blocked; unlocking restored the explicit close in all six
  placement/form combinations.
  The #543 candidate harness also passed with 864 mouse/touch edge and corner sequences and no failures.

### Outside-host focus limitation — documented Radix behavior

In four otherwise identical checks (pending false/true × mouse/touch), a pointer on the page outside
its host left the modal open and the outside handler uncalled, but focus moved from Cancel to BODY
with `focusout.relatedTarget=null`. The non-pending baseline and a direct installed-Radix fixture
showed the same result; it is not caused by enabling this pending lock. Tab re-entered the alert in
all four cases. In two Dialog pending checks (mouse/touch), an outside-host press likewise moved focus
to `body` without closing and Tab re-entered through the active trap. The owner chose to document
this Radix limitation rather than add a focus engine (L41). Pending transitions, guarded activation
and Escape themselves retained focus in the checks above.

The installed Radix AlertDialog spreads consumer props then replaces `onPointerDownOutside` and
`onInteractOutside` (`packages/ui/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs:56-63`).
Direct consumer callbacks for those hooks ran zero times; its `onEscapeKeyDown` ran once and
`preventDefault()` blocked Escape. Dialog passes `trapFocus` and defers outside pointer handling
(`packages/ui/node_modules/@radix-ui/react-dialog/dist/index.mjs:172,252,266`). DismissableLayer
cancels its separate custom event rather than the original pointer event, and deferred processing
uses click (`node_modules/.pnpm/@radix-ui+react-dismissable-layer@1.2.1_@types+react-dom@19.3.0_@types+react@19.3.0__@t_2656bb590de67d8af7daa53dbff259b7/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs:56-58,95-96,272,346`).
The instrumented browser saw the custom event prevented and the original event not prevented in
all four cases. FocusScope's trap restores focus for a non-null outside target but returns on null
(`node_modules/.pnpm/@radix-ui+react-focus-scope@1.3.1_@types+react-dom@19.3.0_@types+react@19.3.0__@types+r_c545200fe192271ccc07b707063d52f1/node_modules/@radix-ui/react-focus-scope/dist/index.mjs:51-65`).
No custom outside or focus guard was added.

## Pending evidence and limits

- Untested browser cases include alert close-corner coverage, clipping/containing-block negatives,
  pending-state focus-ring paint, reduced transparency, triggerless/removed-trigger limits and actual
  Controls widgets.
- The parent owns the final build and package checks; these were not run here. Packed React 18/19
  and native CSS consumption remain unverified. The combined full-width/header-action same-host
  browser case is now sampled above.
- Actual Storybook Controls widgets and assistive-technology speech remain unverified. `aria-busy`
  is not an announcement; consumers own progress, error recovery and any accessible announcements.
  Initial Action close and duplicate operation starts must be prevented synchronously by the consumer.
- **Visual conformity: Not evaluated.** VIS-01 is historical; VIS-02 and VIS-03 remain pending and
  were not replaced with implementation captures.
