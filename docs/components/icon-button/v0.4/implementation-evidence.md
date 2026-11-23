# IconButton v0.4 and v0.5 — implementation evidence

## Scope and recovered approval

T8 covers S3, S6 and S7, including the separately approved composition decisions S8–S12. The approved [v0.4 hit-area amendment](hit-area-amendment.md) has payload SHA-256 `9b79473b96a8ac9a657bcad82604c770a2fafa4228067b79e7d08567c0c116df`; the approved [v0.5 press-feedback amendment](../v0.5/press-feedback-amendment.md) has `c0f0a7dc66d67339807e8ec3e512508a8d718063a3fe17d37dbfa4da2d1f6d3a`. The owner approved implementation in `odd/tasks/consumer-request-specs.md` S7. The parent corrected six amendment header digests and reports verification against the line-start payload definition in L26; those metadata corrections did not change payloads.

The worktree retains the automatic, centered default-token `::after` target, removes root press scaling, and uses the approved paint feedback. ButtonGroup and Tabs scroll buttons suppress the extension under scoped exceptions. SocialLinks, ListItemActions, Carousel and AttachmentField use their separately approved spacing changes. No release or downstream product upgrade is implied.

## Test-first evidence

- The earlier implementation worker reported IconButton RED with 12 failures, then 31/31 GREEN; its composition run had six intended failures before 331/331 GREEN.
- Tabs suppression: three intended failures, 88 passed; then 91/91 passed. Carousel spacing: two intended failures, 67 passed; then 69/69 passed. AttachmentField v0.3 spacing: two intended failures, 99 passed; then 101/101 passed.
- SocialLinks v0.3 and ListItem v0.4: seven intended spacing failures, 64 passed; then 71/71 passed.
- AttachmentField v0.4: one intended root-gap failure, 100 passed; then 101/101 passed with the same focused runner. Its existing strip-geometry and controlled-removal cases remained green.

## Observed browser evidence

Chrome Headless 148 on Linux used a static local HTML fixture, current-source UI JS and CSS built in a system scratch directory, and the existing token CSS. The viewport was 1280 × 4000 CSS pixels at DPR 1. The primary-pointer query `(hover:hover) and (pointer:fine)` matched; mouse and touch events were dispatched through Chrome DevTools Protocol. This is synthetic input, not a physical hybrid or coarse-primary device.

For each of LTR and RTL under normal and reduced motion:

- The 24 standalone combinations (three sizes × four treatments × native button or slotted anchor) each received nine centered-square probes at the center, four edges and four corners, using ±22px offsets. Each input type completed 216 stationary down/up sequences per direction/motion combination; the computed pseudo-element was at least 44px and visible boxes matched approximately 25.6/32/38.4px.
- Eighteen composition fixtures completed 310 mouse and 310 touch sequences per direction/motion combination: SocialLinks at both supported sizes and both requested gaps, horizontal and wrapped; four md/lg ListItemActions pairs; Carousel; wide and wrapped AttachmentField; both ButtonGroup variants; and Tabs scroll buttons. Expanded controls used nine points; intentionally compact ButtonGroup and Tabs controls used center and four points inside their visible axes.
- The complete matrix passed **2,104 mouse and 2,104 touch sequences**. Each checked pointer-down, pointer-up and click against the intended control; callbacks or controlled requests were checked where applicable. The slotted-anchor fixture prevented navigation. Root boxes stayed unchanged during each 50ms hold, and no tested adjacent control received a mistaken activation.

A separate post-fix probe placed the first AttachmentField Remove button at the exact earlier failure box `(827.1875, 1711.59375, 25.59375, 25.59375)`. All four corners and the adjacent Textarea boundary passed mouse and touch in both directions and motion modes: **40 sequences**. The root gap measured 12.8px and the strip gap 9.6px. Earlier targeted scratch probes also observed the visible-root focus shadow after its transition settled, active paint, Tooltip entry and disabled fall-through. Separate corner-hold probes sampled the former press/spring interval through 300ms; 96 holds were reported. These observations are not visual-reference approval.

### Earlier conflicts and disposition

- Tabs' former expanded scroll target intercepted a mouse click 4px outside the visible button; with suppression the same point selected the underlying tab. S10 approved and documented the compact hybrid-touch exception.
- Carousel's `gap-2` resolved to approximately 6.39px and allowed edge points to hit the neighboring control. S11 approved `gap-3`, measured at 9.6px.
- At SocialLinks `md gap-4`, a 12.796875px measured gap let three `elementFromPoint` probes at the first link's right edge reach the second; no click was dispatched for that observation. S12 added the one-token margin.
- AttachmentField `gap-3` passed point hit testing but Chrome touch targeting selected the nearby Textarea from pointer-down at one Remove corner. Neither scrolling nor motion caused it. The S11 spacing route increased only the root gap to `gap-4`; the post-fix exact-position probe above passed.

Composition-specific results and limitations are recorded in the notes for [ButtonGroup](../../button-group/v0.2/implementation-evidence.md), [SocialLinks v0.2](../../social-links/v0.2/implementation-evidence.md) and [v0.3](../../social-links/v0.3/implementation-evidence.md), [ListItem v0.3](../../list-item/v0.3/implementation-evidence.md) and [v0.4](../../list-item/v0.4/implementation-evidence.md), [Tabs](../../tabs/v0.6/implementation-evidence.md), [Carousel](../../carousel/v0.3/implementation-evidence.md), and [AttachmentField v0.3](../../attachment-field/v0.3/implementation-evidence.md) and [v0.4](../../attachment-field/v0.4/implementation-evidence.md).

## Observed automated checks

These are the recorded results from the original implementation work, before the marker-free follow-up below.

| Command | Result |
| --- | --- |
| `pnpm exec vitest run packages/ui/src/atoms/icon-button/IconButton.test.tsx --maxWorkers=2 --no-cache --configLoader runner` | Exit 0; 31 passed. |
| `pnpm exec vitest run packages/ui/src/molecules/button-group/ButtonGroup.test.tsx packages/ui/src/molecules/social-links/SocialLinks.test.tsx packages/ui/src/molecules/list-item/ListItem.test.tsx packages/ui/src/molecules/tabs/Tabs.test.tsx packages/ui/src/molecules/carousel/Carousel.test.tsx packages/ui/src/molecules/attachment-field/AttachmentField.test.tsx packages/ui/src/primitives/text/Text.test.tsx --maxWorkers=2 --no-cache --configLoader runner` | Exit 0; 417 passed across seven files. |
| `pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner` | Exit 0; 507 passed. |
| `pnpm typecheck` | Exit 0. |
| `pnpm exec biome check packages/ui scripts` | Exit 0; 665 files checked in the final documentation handoff. |
| `pnpm props:docs` and `pnpm props:check` | Both exit 0; registry view generated and checked. |
| `pnpm test:props` | Exit 0; 132 passed. |
| `pnpm artifact --write`, `pnpm artifact --check`, `pnpm system:docs`, `pnpm system:check` | All exit 0. |
| `pnpm test:artifact` | Exit 0; 44 passed. |

At the original handoff the last source edit changed `AttachmentField.tsx`, not a registry-pinned `types.ts`; the registry, artifact and system checks then passed. These source checks and scratch builds do not verify the distributable package.

## Marker-free suppression follow-up

The parent reported that a fresh package-exports run passed 136 tests and failed one: generated parent utilities used the public `.eg-icon-btn` marker as a styling hook. The approved ButtonGroup and Tabs amendments specify behavior, not that selector. Their containers now reserve `data-icon-button-target="compact"` as an internal composition signal; the IconButton CVA owns the static direct-parent utility `[[data-icon-button-target=compact]>&]:after:content-none`. Direct-parent scope preserves extended targets on nested, non-direct IconButtons. This is not an own prop or a new naming convention; the affected existing registry usages were reviewed and their source revisions refreshed.

- RED: the IconButton, ButtonGroup and Tabs focused run exited 1 with 14 intended failures and 120 passes. The updated artifact assertion also produced one intended failure and 43 passes before regeneration.
- GREEN: `pnpm exec vitest run packages/ui/src/atoms/icon-button/IconButton.test.tsx packages/ui/src/molecules/button-group/ButtonGroup.test.tsx packages/ui/src/molecules/tabs/Tabs.test.tsx --maxWorkers=2 --no-cache --configLoader runner` exited 0 with 134/134 passing. The Storybook docgen/controls/CSS run passed 507/507; `pnpm typecheck` passed. Biome passed after one test-formatting correction.
- `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`, `pnpm artifact --write`, `pnpm artifact --check`, `pnpm system:docs`, `pnpm system:check` and `pnpm test:artifact` all exited 0. Props passed 132/132 and artifact 44/44.
- A scratch source-CSS audit found all 76 static IconButton CVA utilities and no `.eg-icon-btn` styling selector in the utilities layer. Chrome 148 synthetic input passed 124 standalone/group sequences, including direct native and slotted controls and extended nested/standalone controls. Twelve LTR/RTL Tabs configurations selected the underlying tab from a stationary mouse click 4px outside the visible scroll control. The earlier 2,104-per-input matrix was not rerun after this selector-only change.

## Pending and limitations

- The parent owns a fresh repository `pnpm build` and package-exports rerun after the marker-free change. Packed React 18/19 consumer tests, package-consumption, full repository suite, `pnpm lint`, `pnpm test:system` and Storybook build were not run here.
- Physical coarse-primary and hybrid devices, real screen readers, accessibility-tree review, a compatible router host, browser Controls, and downstream Recado/Nexo/website layouts remain unverified. The matrix does not establish unconditional WCAG conformance.
- Clipping, overlays, conflicting host pseudo-elements, insufficient token overrides and transformed ancestors remain consumer limitations. `elementFromPoint` alone is not proof of touch targeting. Consumer-provided clearance is still needed for smaller adjacent pairs and neighboring rows.
- Full baseline flow-box comparison, visual ring legibility and approved expected-design captures remain pending. VIS-03 and VIS-04 are pending; historical VIS-01/02 do not approve the new press feedback. Visual conformity is **Not evaluated**.
- Independent review, release and publication are outside this evidence handoff.
