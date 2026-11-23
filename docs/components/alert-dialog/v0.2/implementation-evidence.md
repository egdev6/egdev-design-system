# AlertDialog v0.2 — implementation evidence

## Scope and status

This lane implements AlertDialog's `container`, `overlayScope` and root-local `pending`; it does not
change Dialog. Dialog's independent pending lock remains deferred until after #543 is integrated.
The scoped naming amendment and `modal-action-pending` approval are recorded in
[prop-naming-approval.json](prop-naming-approval.json). The earlier Dialog receipt is unchanged.
Browser checks were run as described below, but an outside-focus limitation still needs an owner
decision, and the final package gates remain pending. This is not final acceptance.

## Observed tests

- The initial focused RED run failed 15 tests and passed 47: absent pending/busy and decision guards,
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
- Before the browser-discovered pointer fix, `pnpm props:docs`, `pnpm props:check`, and
  `pnpm test:props` passed, 133/133 tests. The `dialog-overlay-scope` receipt binds the owner's
  two amended fields and pins the historical Dialog receipt; the source revisions were then current.
  The subsequent `types.ts` edit makes them stale: `pnpm props:check` failed and `pnpm test:props`
  passed 85/133. The parent owns the registry refresh.
- Before that edit, `pnpm artifact --write`, `pnpm system:docs`, `pnpm artifact --check` and
  `pnpm system:check` passed; `pnpm test:artifact` passed 51/51 and `pnpm test:system` 36/36.
  After the edit, `pnpm artifact --check` reported stale JSON, and `pnpm test:artifact` passed
  50/51 with the current-artifact check failing. `pnpm system:check` and `pnpm test:system` still
  passed, the latter 36/36; the parent owns regeneration. The earlier JSON was 597,835 bytes, below
  the 768 KiB budget.
- `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` contain updated
  declaration, CSS and consumer fixtures. They have not been run against a fresh candidate build.

## Real-browser evidence

`node docs/components/alert-dialog/v0.2/browser-evidence.mjs` passed with harness SHA-256
`8f1255431a6f45a6749a1977cba4c54ee4c2c0d0d44e99f37d1d36343a1173bf`. It compiles UI JavaScript,
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
- **Same-host stacking:** with a sheet opened first in the same positioned host, 160 sampled
  `elementFromPoint` checks across two host sizes, two motion preferences, four post-mount samples
  and ten sheet-chrome/host-edge points hit the alert or its veil. Eighty mouse/touch sequences at
  those points while pending caused no sheet or alert close request. Eight normal Cancel/Action
  mouse/touch sequences hit the actual alert button and closed only the alert; nested and parent
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

### Outside-host focus limitation — owner decision pending

In four otherwise identical checks (pending false/true × mouse/touch), a pointer on the page outside
its host left the modal open and the outside handler uncalled, but focus moved from Cancel to BODY
with `focusout.relatedTarget=null`. The non-pending baseline and a direct installed-Radix fixture
showed the same result; it is not caused by enabling this pending lock. Do not claim outside-pointer
focus retention without a separate owner decision. Pending transitions, guarded activation and
Escape themselves retained focus in the checks above.

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

- Owner decision on the documented outside-host focus limitation remains pending. Other untested
  browser cases include close-corner coverage, clipping/containing-block negatives, focus-ring
  paint, reduced transparency, triggerless/removed-trigger limits and actual Controls widgets.
- The parent owns the final `pnpm build` and `pnpm test:package-exports`; neither was run here.
  Package consumption was expressly excluded and remains unverified for React 18/19 and native CSS
  consumers. Repeat the cross-feature check after #543 lands.
- Actual Storybook Controls widgets and assistive-technology speech remain unverified. `aria-busy`
  is not an announcement; consumers own progress, error recovery and any accessible announcements.
  Initial Action close and duplicate operation starts must be prevented synchronously by the consumer.
- **Visual conformity: Not evaluated.** VIS-01 is historical; VIS-02 and VIS-03 remain pending and
  were not replaced with implementation captures.
