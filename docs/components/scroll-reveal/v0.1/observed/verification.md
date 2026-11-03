# ScrollReveal v0.1 — observed verification

## Functional browser checks

Chromium 153, dark theme, 900px viewport height; see `browser-observed.json` for exact computed values.

- Sixteen cases passed: 390px and 1280px × reveal/wipe × scroll, focus, live reduced motion and reduced motion at mount.
- Reveal hidden geometry is 22.4px; configured delay is 150ms; durations are 560ms reveal and 800ms wipe.
- Focus and reduced motion yield transition-property `none`, opacity 1, no translate and no clip. Wipe finalizes `data-done`.
- No horizontal overflow or page errors. An initial story failure came from a long nowrap Button label; shortening the illustrative label fixed it without changing any shared component.
- The source Storybook checks exercise actual below-fold observation, not just an above-fold pre-pass. They use compiler-loaded source styles; shipped artifacts are independently checked below.

## SSR / no JavaScript

Four cases passed with JavaScript disabled: 390px and 1280px × reveal/wipe, using SSR from the built package with shipped token/UI/effects CSS. Content is visible, untransformed and unclipped; default delay resolves to 0s. `ssr-browser-observed.json` records stylesheet SHA-256 values and computed results.

## Mutation evidence

- `mutation-results.json`: eleven source mutations were killed by the public-interface component tests. Original source bytes were restored and verified after each case.
- `packed-mutation-results.json`: removing the component's own focus-transition bypass or final wipe unclipping class fails both rebuilt package-export and React 18/19 consumer checks. This avoids the shared-utility selector-presence hole. Source was restored byte-identical and artifacts rebuilt afterward.

## Behavior corrections and limits

Readback found and corrected focus/live-motion animation, unobserve failure visibility, partial observer cleanup, descendant transition events, SSR wipe clipping and forwarded-ref reassignment. The ref reassignment fix has direct wrapper/native-child RED/GREEN tests plus React 19 callback-cleanup tests; built React 18/19 hydration/ref replacement checks are part of the final candidate gates.

No native screen-reader, zoom or pixel-parity claim is made. The approved source captures remain scoped behavioral references with their documented resource and sample/screenshot timing limitations. Final corrected-candidate gates passed: complete root/workspace TypeScript, lint, build, naming112, tokens34, exports130, packed React18/19 consumers14 (SSR/hydration/ref replacement), focused62 tests and full Vitest2594 across132files. The initial React18 type-narrowing and formatting failures were corrected before this final passing run; prior counts were not substituted for it.
