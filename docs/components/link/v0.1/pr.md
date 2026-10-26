## Summary

- Implement approved Link v0.1: native anchors or Radix Slot router composition, decorative Icon arrows, forwarded anchor refs and safe external navigation with a localizable hidden notice.
- Ship static token-backed CVA utilities without a stylesheet or changes to legacy CSS, tokens or dependencies.
- Add six meaningful component files, stories and real Storybook metadata checks; register exact existing prop conventions, publish exports and regenerate the catalogue.
- Extend installed React 18/19 consumers while preserving all previous components and a single React type import.

Closes #61

## Contract coverage

- AC-01–05 and AC-08: native/slotted anchors, correct arrow, external target/rel, notice customization, arrow omission, event/ref composition and supported layout merges.
- AC-09: compiled CSS/export checks and packed native/Tailwind consumer builds.
- AC-10: real docgen and registered Controls enhancement/inference with zero owned diagnostics; browser widgets remain pending.
- AC-06–07: emitted hover/focus/reduced-motion CSS verified; visual parity, focus visibility and browser motion remain **Not evaluated**.
- No contract deviations. Approved differences from legacy: 16px arrows and 14px label-default typography. No disabled, variant or size API.

## Verification

- Observed behavioral RED: 11 failed focused Link tests with minimal scaffolding.
- GREEN: 11 Link tests; 119 focused Link/Storybook metadata tests.
- Local gates passed: lint, typecheck, build, 500 unit tests, props:check, 82 prop-registry tests, 25 package-export tests and 12 packed-consumer tests.
- Packed matrix: React 18.3.1 and 19.3.0, strict positive/negative types, SSR, CSR refs/events/cleanup, native CSS and Tailwind builds, one physical React/ReactDOM instance per fixture.
- Serialized memory-capped gates; build before tests; no watch/server. No CI run is claimed.

## Review notes

- External safety is normalized on the slotted child too: default Radix child precedence must not undo `_blank` or required rel tokens.
- Arrow `transform-none` avoids double motion from retained legacy transform plus Tailwind CSS translate.
- Root `eg-link` and all legacy rules remain; className supports outer margin/alignment only, not arbitrary appearance overrides.
- Prop naming uses the existing `slot-composition`, `new-tab-navigation`, `new-tab-notice` and `trailing-arrow` conventions without modifying approvals.
- Browser screenshots/VIS-01 comparison, real Controls widgets, browser new-tab behavior and assistive-technology evaluation are **Not evaluated**, deferred to owner review on main under S3.

Details and exact local commands: [implementation evidence](implementation.md).
