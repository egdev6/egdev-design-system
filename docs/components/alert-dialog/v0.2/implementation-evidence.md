# AlertDialog v0.2 — implementation evidence

## Scope and status

This lane implements AlertDialog's `container`, `overlayScope` and root-local `pending`; it does not
change Dialog. Dialog's independent pending lock remains deferred until after #543 is integrated.
The scoped naming amendment and `modal-action-pending` approval are recorded in
[prop-naming-approval.json](prop-naming-approval.json). The earlier Dialog receipt is unchanged.
The requested final browser and package gates remain pending, so this is not final acceptance.

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
- `pnpm props:docs`, `pnpm props:check`, and `pnpm test:props`: passed, 133/133 tests. The
  `dialog-overlay-scope` receipt binds the owner's two amended fields and pins the historical
  Dialog receipt; AlertDialog usages and whole-file source revisions were refreshed.
- `pnpm artifact --write`, `pnpm system:docs`, `pnpm artifact --check` and `pnpm system:check`:
  passed. `pnpm test:artifact`: 51/51; `pnpm test:system`: 36/36. The initial artifact RED had
  three expected stale-artifact failures, including the new attribution assertion. The generated
  JSON was 597,835 bytes when inspected, below the 768 KiB budget.
- `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` contain updated
  declaration, CSS and consumer fixtures. They have not been run against a fresh candidate build.

## Pending evidence and limits

- **Real browser: 0 cases run.** `/usr/bin/google-chrome` exists, but no exact authorized scratch
  build/CDP validation command was supplied. No scratch build, browser session or browser numbers
  are claimed. Check same-host sheet chrome and veil hit testing, modality, focus return, host
  resizing, opening transitions, normal/reduced motion, mouse/touch and the pending workflow.
  If same-host stacking fails, stop for the scoped stacking decision in the plan.
- The parent owns the final `pnpm build` and `pnpm test:package-exports`; neither was run here.
  Package consumption was expressly excluded and remains unverified for React 18/19 and native CSS
  consumers. Repeat the cross-feature check after #543 lands.
- Actual Storybook Controls widgets and assistive-technology speech remain unverified. `aria-busy`
  is not an announcement; consumers own progress, error recovery and any accessible announcements.
  Initial Action close and duplicate operation starts must be prevented synchronously by the consumer.
- **Visual conformity: Not evaluated.** VIS-01 is historical; VIS-02 and VIS-03 remain pending and
  were not replaced with implementation captures.
