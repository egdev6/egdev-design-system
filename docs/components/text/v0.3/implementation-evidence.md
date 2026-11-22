# Text v0.3 — implementation evidence

## Scope and approval

- T6 covers S2, S5 and S6: Text-only opt-in truncation, with no new stylesheet, token or dependency. Heading and ListItem APIs remain unchanged.
- Amendment payload SHA-256: `fd8f0fdebc2bfd898a51cee69f94685cc64a9f877045f151fea609b202fcd799`.
- The forwarded owner decision approves the `single-line-text-truncation` convention. The separate receipt is [prop-naming-approval.json](prop-naming-approval.json); it distinguishes this decision from the amendment's registration-only naming scope. The approved convention hash is `sha256:e1a37b7e62e7f378b59f1aeaf05c5a1bdc73377c3e09aed41b9cabb6e0bf5872`.
- The reviewed `TextProps.truncate` source is `packages/ui/src/primitives/text/types.ts`, whole-file revision `sha256:41a2d11b8fd42de6f7ec8fc8b05d203459c1dd93eb62b184b8f83e75ebe0f4fc`. The ten earlier Text/Heading usage revisions were refreshed; their approval receipts were not rewritten.
- Both package changelogs use `(#538)` because the capability fully resolves the consumer request. No release or consumer upgrade was performed.

## Test-first evidence

- RED: `pnpm exec vitest run packages/ui/src/primitives/text/Text.test.tsx --maxWorkers=2 --no-cache --configLoader runner` exited 1: 21 failed and 53 passed. Failures showed the missing truncation classes and accent behavior and the unconsumed prop.
- RED: `pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner` exited 1: 6 failed and 501 passed. The new prop, control, declaration and eyebrow CSS were absent.
- Registry receipt RED: `pnpm test:props` exited 1: 1 failed and 131 passed after historical projections were updated; the new test specifically reported the missing approval receipt. An earlier run exposed seven stale counts/projections and prompted separate authorization for `scripts/prop-naming.test.mjs`.
- GREEN: the focused Text run passed all 74 tests; the metadata and preview-CSS run passed all 507; `pnpm test:props` passed all 132.
- PRESERVE: the focused Heading and ListItem run passed all 74 tests. Text tests also check omitted/false behavior, all nine recipes, native and Slot content, accent restoration, native attributes, child ref, supported layout merges and independent actions.

## Observed checks

| Command | Result |
| --- | --- |
| `pnpm exec vitest run packages/ui/src/primitives/text/Text.test.tsx --maxWorkers=2 --no-cache --configLoader runner` | Exit 0; 74 passed. |
| `pnpm exec vitest run packages/ui/src/primitives/text/Heading.test.tsx packages/ui/src/molecules/list-item/ListItem.test.tsx --maxWorkers=2 --no-cache --configLoader runner` | Exit 0; 74 passed. |
| `pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner` | Exit 0; 507 passed. The CSS check compiles the real Storybook preview in memory; it does not prove the shipped package CSS or browser rendering. |
| `pnpm typecheck` | Exit 0. |
| `pnpm exec biome check packages/ui scripts` | Exit 0 after formatting corrections; 665 files checked. |
| `pnpm props:docs` | Exit 0; generated registry view. |
| `pnpm props:check` | Exit 0; schema, source revisions, approval hashes and generated view valid. |
| `pnpm test:props` | Exit 0; 132 passed. |
| `pnpm artifact --write` | Exit 0. |
| `pnpm artifact --check` | Exit 0; repeated after the final Text documentation changes. |
| `pnpm system:docs` | Exit 0. |
| `pnpm system:check` | Exit 0; repeated after the final Text documentation changes. |
| `pnpm test:artifact` | Exit 0; 43 passed. The artifact is 772,892 bytes, under the 786,432-byte budget by 13,540 bytes. |
| `node --test scripts/package-exports.test.mjs` | Exit 1; 136 passed, 1 failed. The existing ignored `packages/ui/dist` build predates this change: the Text test reported `Packed Text must select block` and React warned that `truncate` reached the DOM. This run does not verify the changed shipped CSS. |
| `pnpm build` then `node --test scripts/package-exports.test.mjs` (parent, fresh build) | Build exit 0; package-exports exit 0, 137 passed, 0 failed. The fresh shipped CSS selects `block` for truncated Text and `truncate` no longer reaches the DOM. |

`pnpm build` was not run: it writes and may clear package build directories outside the authorized edit surfaces, even though the existing dist paths are gitignored. The packed-consumer runner was not run because it installs dependencies and was explicitly excluded. No network, dependency mutation or release command was used.

## Acceptance evidence and pending work

| Criterion | Observed / pending |
| --- | --- |
| AC-01 | DOM, hook, type, real docgen and installed Controls pipeline checks pass for the boolean/default and untyped boundaries. Actual browser Controls remain pending. |
| AC-02 | Complete content is retained in DOM tests; bounded, intrinsic-width, long-token and direction stories exist. Real-browser layout, fit/overflow, direction and pixel checks remain pending. |
| AC-03 | All nine variants, eyebrow utilities, representative tones/glow, accentBreak values and toggle restoration pass DOM tests. Pseudo-element centering, computed styles and edge glow require browser inspection. |
| AC-04 | Native paragraph and Slot span, attributes, title, child class/ref, accent placement and wrapper absence pass DOM tests. Computed block display needs a browser. |
| AC-05 | Root minimum width and supported placement/width merges pass DOM checks; stories show consumer-owned flex/grid shrinking. Actual sizing and non-shrinkable comparisons require a browser. |
| AC-06 | Full ordered children, strong content and heading/link names pass DOM tests without generated labels, roles or focus stops. Accessibility-tree inspection and actual screen-reader reading order remain pending. |
| AC-07 | Stories provide separate native disclosures for both complete values, and independent ancestor/sibling actions pass keyboard and pointer simulation. Real-browser keyboard, pointer, touch and focus checks, and the actual Recado route, remain pending. |
| AC-08 | Default unclamped ListItem content, compact Text and editorial heading/meta span compositions, rank and unchanged part types pass tests. Narrow-row browser sizing remains pending. |
| AC-09 | Existing Text, Heading and ListItem checks pass; Heading has no truncation prop and its className permissions remain unchanged. The artifact generator has a pre-existing shared-file limitation: Heading's `variants` and `anatomy` also include the Text-only recipes, so those artifact fields change when Text's recipes change; Heading's own props and `headingVariants` do not. |
| AC-10 | Preview CSS compilation, source-derived artifact checks and the shipped-CSS/package-export check against a fresh build pass (137/137). Packed React 18/19 no-Tailwind consumer evidence remains pending (CI runs it). |
| AC-11 | Usage docs identify passive roots and unsupported hard breaks, nested blocks and focusable descendants; independent action simulations pass. Real-browser focus behavior remains pending. |

VIS-01 and VIS-02 have no approved expected-design images. Visual conformity is **Not evaluated**; no screenshot, DOM test, preview compilation or metadata check substitutes for browser, assistive-technology or visual approval.
