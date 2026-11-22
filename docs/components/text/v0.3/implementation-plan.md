# Text v0.3 — implementation plan for single-line truncation

- **Status:** Draft proposal, not implementation authorization. The owner must separately approve this plan and its actual edit surfaces before code, tests, registry or generated artifacts change. This document records planned work, not completed behavior.
- **Contract authority:** [`truncate-amendment.md`](truncate-amendment.md), version `v0.3`, `contentSHA256: fd8f0fdebc2bfd898a51cee69f94685cc64a9f877045f151fea609b202fcd799`. Its UTF-8 payload is the line-start heading `## 1. Purpose and scope` through EOF, with LF and a final newline. In preparation, the unique line-start heading produced exactly that digest; the earlier occurrence of the same text inside the hash-definition sentence is metadata and is excluded.
- **Approval:** `approvalReference: owner session 2026-11-22 (odd/tasks/consumer-request-specs.md L6)`; the amendment's resolved decisions record the owner's verbatim choices “Aprobar tal cual (Recomendado)” and “Aprobar `truncate` (Recomendado)”. The component amendment and registration with the first reviewed usage are approved; neither this plan nor a global convention promotion is thereby approved. The canonical component issue is [#108](https://github.com/egdev6/egdev-design-system/issues/108); [#538](https://github.com/egdev6/egdev-design-system/issues/538) is the request, not a new component issue.
- **Visual references:** VIS-01/02, source conditions and hashes are Pending. No expected-design capture was adopted. Visual conformity is **Not evaluated**; earlier Text captures do not approve this delta.
- **Baseline:** `c0c4275d0b0d5ce1d6732387668ce2e4ab386233`. Reviewed `packages/ui/src/primitives/text/types.ts` whole-file SHA-256 is `5ef0768327e1ad973783f0907b8a0f5f3a0b0975507bdc94499cda219f6a0b7e`, matching the amendment's baseline; it does not yet contain `truncate`.
- **Observed in preparation:** static source, registry and artifact inspection and the amendment digest check only. No test, build, Storybook, browser, screen reader, screenshot or package-consumer check was run for this plan. All checks below are future work.

## 1. Authority, scope and gates

1. **G1 — Separate plan approval:** recover approval of this plan before implementation. Contract approval is not permission to modify any code or publish on GitHub. Obtain the necessary implementation surfaces and explicit permission for broad checks, generated outputs, server starts and packed fixtures separately.
2. **G2 — Text only:** add optional `Text.truncate?: boolean`, default `false`, for every existing Text variant. Only literal `true` enables it, even for untyped callers. Preserve the `p`/Slot element and unsliced content; no automatic title, tooltip, focus, wrapper, event or tree-validation engine. Heading and ListItem receive no new prop or behavior.
3. **G3 — Consumers own access and sizing:** Text supplies `min-width: 0` on its own opted-in root. Each flex/grid item in the shrinking path and each grid track must also be shrinkable, and the host must supply a bounded size. A separate visible details route or disclosure must expose all complete values to pointer, keyboard and touch users. `title` and Tooltip are supplementary, never the sole route. No focusable descendants, hard breaks or nested block boxes inside the clipping root; an interactive ancestor may own its own unclipped focus indicator.
4. **G4 — Existing architecture and paint:** no new tokens, dependencies, Material treatment, inline appearance, dynamic utility interpolation or legacy migration. **No stylesheet** and no extra internal module. Keep existing typography, foregrounds, accent tones/glow, markers and native/Slot behavior except the approved opt-in delta.
5. **G5 — Evidence is separate:** unit classes do not prove clipping; compiled CSS does not prove pixels, screen-reader output or consumer access. Run the acceptance checks in §8–10 with observed results. Stop rather than improvise if the approved behavior cannot be achieved or a new token, dependency, shared-contract change or unapproved edit surface is required.

## 2. Current implementation and future edit surfaces

`Text` is already exported by `packages/ui/src/index.ts`; reuse it rather than adding a component or ListItem-only switch. `types.ts` currently has distinct title/eyebrow `textVariants`, body `textBodyVariants`, and a shared `accentVariants`; `useText.ts` selects body/title classes and derives accents. The current eyebrow is `inline-flex` with `gap-2.5` and a decorative `before` diamond; the current default display accent is block. `Text.tsx` uses Radix `Slot`/`Slottable` so a trailing accent lands inside the child. Heading has a separate type/hook/renderer but shares this types file. ListItem Content is explicitly not automatically clamped; editorial Title is a native heading and Meta is a `div`.

The following are **proposed future surfaces**, not permission to edit them now. Keep the six mandatory files meaningful; no dummy files are needed.

| Path | Planned responsibility |
| --- | --- |
| `packages/ui/src/primitives/text/types.ts` | Add one documented optional boolean to `TextProps`; add static truncation choices to both Text CVAs and a conditional eyebrow pseudo-element recipe. Leave `HeadingProps`, `headingVariants`, `textForegroundClasses` and shared `accentVariants` behavior unchanged. Preserve the existing `@classNameAllows width min-width max-width inline-size min-inline-size max-inline-size` exactly: no new property allowance is needed. Clarify in English prose that display, whitespace, clipping and ellipsis remain owned by `truncate`, not consumer overrides. |
| `packages/ui/src/primitives/text/useText.ts` | Destructure and consume `truncate` before `...native`; derive `isTruncated = truncate === true`, pass it to the selected Text CVA, and derive the existing accent's `accentBreak` as false only during truncation. Keep `cn(recipe, className)` for supported layout merges and preserve all other guards and defaults. |
| `packages/ui/src/primitives/text/Text.tsx` | Expected **no runtime change**: existing JSX already renders one `p` or Slot child and the accent. Review its English JSDoc for the opt-in and passive-child restriction; do not add a wrapper or public ref. If the existing JSX cannot satisfy the Slot tests, stop rather than silently expand the contract. |
| `packages/ui/src/primitives/text/Text.test.tsx` | Add RED-first public DOM, hook and type cases, including both ListItem compositions and preservation guards described in §4. Assert individual class/structure invariants, never new full class-string snapshots. Existing historical assertions remain intact. |
| `packages/ui/src/primitives/text/Text.stories.tsx` | Add focused examples and English usage guidance in §5, including a `Truncate` story in a bounded flex host and a ListItem composition with a real full-text disclosure. Preserve `Default` and avoid manual `argTypes` or `play`. |
| `packages/ui/src/primitives/text/index.ts` | **No change expected:** `Text` and `TextProps` are already exported; the new property travels through the existing type. Keep hooks and recipes private at the package barrel. Verify `packages/ui/src/index.ts` and `packages/ui/package.json` without changing exports. |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Extend the Text/Heading AST and real-parser checks: optional boolean, `@default false`, `@control boolean`, unchanged Heading; update the own-declaration expectation from 33 to 34. Keep checks for every existing union branch and native rows. |
| `packages/ui/src/lib/storybook-controls.test.ts` | Add `truncate: 'boolean'` to Text's expected controls and update its own-prop count from 7 to 8. Assert the installed extraction/enhancer/inference pipeline has no diagnostics, yields a boolean control and documented `false`, and injects no optional arg; Heading still has no row. Preserve generic metadata tests. |
| `packages/ui/src/lib/storybook-css.test.ts` | Extend real preview-CSS compilation checks for the selected static truncation and eyebrow utilities if needed to prove story compilation; this is not a substitute for shipped CSS or browser evidence. |
| `scripts/package-exports.test.mjs` | Extend the existing Text/Heading shipped-CSS case to assert the actual emitted truncation, block, minimum-width and eyebrow pseudo-element declarations, and tie the checks to static Text CVA/rendered classes rather than merely finding a utility used by another component. |
| `scripts/package-consumption.test.mjs` | Extend the existing packed `TypographySamples`/type fixtures with positive and negative Text/Heading cases, opted-in native and Slot rendering, full content/child ref, and shipped styles without an app Tailwind compiler for each supported React major. Retain current defaults and all other consumer assertions. |
| `skills/_shared/prop-naming.json` | Add the single concept and reviewed Text usage, and refresh all ten existing Text/Heading usages whose evidence is this shared `types.ts`; see §6. Do not modify approval receipts. |
| `docs/prop-naming.md` | Generated only via `pnpm props:docs`; never hand-edit. |
| `scripts/design-system-artifact.test.mjs` | Add a focused artifact assertion for optional `Text.truncate`, default `false`, unchanged Heading and preserved className metadata; retain source-derived variant and naming checks. |
| `packages/system/design-system.json`, `packages/system/system.md` | Regenerate from reviewed source and registry; verify the Text prop and naming concept appear, Heading stays unchanged, and the artifact remains under its size budget. Never hand-edit. |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Add English `## Unreleased` / `### Added` entries respectively for opt-in Text and the corresponding artifact/reference update. No version bump is implied. |

**Not planned:** `Heading.tsx`, `useHeading.ts`, ListItem implementation/types/stories, `packages/ui/src/styles/compiled.css` or `.storybook/preview.css` (both already scan the relevant Text source/story), any Text stylesheet, `packages/tokens/**`, dependencies, legacy CSS, the approved amendment, catalog source/generated files, or product repositories. Run existing Heading and ListItem tests unchanged. If a future check requires another file, seek a replacement edit-surface authorization before changing it.

## 3. Rendering, classes and composition

- In each of the two Text CVAs, select static `block min-w-0 truncate` when true (`truncate` emits `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`); explicit equivalent static utilities are acceptable only if their emitted CSS and merge behavior are verified. A false/omitted choice contributes nothing. Existing token-backed typography/color is unchanged.
- Use a Text-only eyebrow/true compound choice to replace `inline-flex` with `block` through `cn`/`twMerge` and make the existing diamond `before:inline-block` with logical-end spacing equivalent to the old `gap-2.5` (for example `before:me-2.5`, backed by the existing fractional spacing scale). Preserve its size, rotation, color and empty content. Verify pseudo-element alignment and clipping in a browser; no claim of identical centering follows from a class assertion. The old flex gap becomes inoperative on a block root.
- With truncation, select the existing accent's inline branch for omitted, true **and** false `accentBreak`; retain the same text bytes, order, tone and glow classes. Toggling off restores the previous default/explicit block or inline accent. `accentVariants` itself remains shared and unchanged, avoiding a Heading behavior change. Root-edge clipping may clip accent glow; evaluate it rather than promising otherwise.
- No content slicing, manually inserted ellipsis, width observer, `aria-label`, hidden duplicate or synthesized `title`. The browser supplies ellipsis at the resolved inline end; do not reverse RTL/mixed-direction content. Fit, unbounded and too-narrow-to-fit-the-marker cases follow the amendment's limits.
- For `asChild`, a single prop-spreading, passive, non-heading and CSS-block-compatible child remains the actual element; its own ref, native attributes and non-conflicting class survive, with the accent inside it. A slotted `span` is valid in a native heading, but becomes block display only while opted in. Text exposes no new ref API; do not promise universal Slot-child CSS precedence. Supported root width/placement classes merge last for recognized utilities only.

## 4. Test-first and preservation sequence

1. **RED, after G1:** add behavior-level cases against the public `Text` interface before implementation. Cover omitted, false, true and representative untyped non-booleans (`'true'`, `1`, `null`); for both `p` and slotted span assert the prop never reaches the DOM, without treating React's omission of a false unknown attribute as proof of consumption. Assert the selected root invariants, complete ordered text/`strong`, no invented title/role/tab stop/live region, and no extra wrapper. Add a true → false rerender proving restoration.
2. Exercise all nine variants and representative body foreground/title tone combinations; test eyebrow diamond invariants, hero glow, inline accent with each `accentBreak` input, and restored block/inline defaults. Test supplied native `title`, `id`, `lang`, `dir`, child class and child ref, and positive/negative TypeScript cases for boolean Text versus non-boolean and Heading. Assert role/name relationships through a native heading and ancestor link, not a fabricated paragraph accessible name.
3. Add public ListItem cases: existing unclamped Content, nested Text in Content, and a real editorial `ListItemTitle`/`ListItemMeta` containing slotted spans with `self-stretch`; preserve native heading and all full text. Assert unchanged ListItem/part type APIs and independent sibling/ancestor control activation. Unsupported descendants are documented, not invented as supported behavior.
4. Add real docgen/Controls and shipped-CSS/packed fixture assertions in the surfaces above. Run the focused Text test first and capture the intended failure, not a test setup error; run the focused metadata checks as applicable. Browser geometry, actual assistive technology and visual comparisons are separate checks and have no meaningful JSDOM-only RED.
5. **GREEN:** make the minimal Text-only changes in §2–3; rerun the exact focused commands, then the separately authorized broader checks. **PRESERVE:** run the existing Text, Heading and ListItem suites, type negatives and package defaults; keep `accentVariants` and Heading implementation unchanged. Existing class hashes in historical tests are not a license for new whole-string snapshots. Refactor only with focused checks green.

## 5. Stories and consumer access

Use real `Meta<typeof Text>`, autodocs and English JSDoc. No manual controls, `play`, fake display defaults or appearance overrides. `Default` keeps only required children. Proposed coverage:

- `Truncate`: a bounded flex row with the Text or its wrapper as a flex item, explicit consumer-owned `min-w-0` and a token-backed maximum width. Show both fitting and overflowing content, plus an unbounded comparison; retain full DOM text and provide a visible native disclosure outside the clipping box.
- `TruncateListItem`: editorial Body with `ListItemTitle`/`ListItemMeta` using `self-stretch` and slotted Text spans, and a card/compact Content composition. A visible, keyboard- and touch-operable details disclosure outside each clipped root reveals **both** full values; a `title` may be included only as supplementary help. Do not put a paragraph directly inside a heading or nest focusable content in Text.
- Additional distinct direction/geometry examples, or focused extensions of existing stories: long unbroken LTR, RTL and mixed text, near-zero marker width, a real heading/ancestor link, an opted-in Slot, eyebrow and accent/glow, and bounded flex/grid with a shrinkable track and explicit ancestry. An unshrinkable ancestor may be shown as a documented consumer limitation, not a supported guarantee. No example promises fixed card height or a non-wrapping ListItem row.

Document that a CSS-block-compatible slotted span no longer behaves as an inline phrase while truncating; focusable descendants, hard breaks and nested blocks are unsupported, and the consumer owns contrast, width, every shrinking ancestor, the full-value route and its focus behavior.

## 6. Registry and generated documentation

The inspected registry has no matching truncation concept. `accent-line-break`, `control-label-wrap` and `section-content-wrap` describe different semantics and must not be overloaded. After source implementation and human review, append **one** `single-line-text-truncation` entry, canonical `truncate`, with the amendment's meaning (visual one-line elision without removing underlying content), appropriate use/avoid text, no aliases/exceptions, `status: proposed` and `approval: null` as specified. The owner approved this name for registration and Text use, not an automatic global convention promotion.

Record the first usage as Text's optional boolean/default-false API, `status: existing`, with `source.path: packages/ui/src/primitives/text/types.ts`, `source.symbol: TextProps.truncate`, and `revision: sha256:<actual reviewed post-edit whole-file hash>`. Do not reuse the baseline digest as evidence of the new prop. Re-review and refresh the ten current source revisions: Text and Heading in `visual-treatment`, `surface-material-tone`, `trailing-text-accent` and `accent-line-break`; Text in `slot-composition`; Heading in `heading-level`. Keep all existing semantic approvals and the Text `foreground` scoped-exception receipt intact. Registry status and approval hashes do not change merely because source revisions do.

Run `pnpm props:docs`, `pnpm props:check`, then `pnpm test:props`; review the generated view. After registry and source updates, run `pnpm artifact --write`, `pnpm system:docs`, `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact` and `pnpm test:system`. Confirm the `Text` prop/default and naming entry, unchanged Heading API/className permissions and existing typography facts. Baseline `design-system.json` is 771,781 bytes against the 768 KiB limit (14,651 bytes headroom); report any overflow instead of weakening the budget.

The catalog currently describes the existing primitive, default and `asChild`, and makes no exhaustive claim excluding the new opt-in. No level, export, Radix base or new component changes: **no catalog impact expected**. If the actual source reveals a stale or contradictory row, request authorization for the catalog source and generators; never edit generated catalog files directly.

## 7. Planned verification commands

These commands are **not observed results** and need the responsible owner's execution authorization. Run from the repository root, one at a time; focused RED and GREEN precede broader gates. The exact same focused command is used for RED and GREEN.

```sh
pnpm exec vitest run packages/ui/src/primitives/text/Text.test.tsx --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/primitives/text/Heading.test.tsx packages/ui/src/molecules/list-item/ListItem.test.tsx --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm typecheck
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --write
pnpm system:docs
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
pnpm lint
pnpm test
pnpm build
pnpm test:package-exports
pnpm test:package-consumption
pnpm storybook-build
```

`pnpm build` writes package build outputs and regenerates the system artifact; review its scope and rerun freshness checks afterwards if inputs changed. `pnpm test:package-consumption` builds isolated packed-consumer fixtures and may install dependencies: run only with specific permission and a verified offline cache; the existing guide records cache gaps, not a current successful matrix. Never fall back to network or claim React 18/19 results from types or SSR alone. If an authorized command cannot run, record the exact blocker and leave its acceptance evidence pending.

For interactive checks, separately authorize a local server before `pnpm storybook` (which also builds tokens), the real browser, and any captures. Inspect actual Storybook Controls and the scenarios in §8–9. Commands and metadata/HTML smoke are not evidence of the actual widget, clipping, access route or appearance.

## 8. Acceptance-to-evidence map

Every row is **planned / Pending**. `Text.test.tsx` means observable DOM/hook tests and `typecheck` means actual positive/negative compilation, not JSDOM geometry.

| Amendment criterion | Planned check and expected evidence |
| --- | --- |
| **AC-01** | RED/GREEN native and Slot DOM/rerender cases for omitted/false/true and untyped non-booleans; no leaked prop. Positive/negative types, AST/real docgen (`optional`, boolean, default false) and installed boolean Controls, then actual browser widget. |
| **AC-02** | `Truncate`/direction scenarios: real-browser computed `display`, overflow, white-space and text-overflow, `scrollWidth` versus `clientWidth` and line geometry; inspect rendered pixels for overflow/fits, unbounded, long unbroken text, LTR, RTL, mixed and too-narrow marker. Full DOM text/order asserted separately. VIS-01/02 pending. |
| **AC-03** | DOM cases for all nine variants, representative foreground/tone/glow, decorative eyebrow, every accentBreak and true→false; browser computed/pseudo-element geometry for actual diamond, inline accent, centering and possible glow clipping. VIS-02 pending. |
| **AC-04** | Native `p` and slotted `span` tests: marker, attributes, supplied versus absent title, child ref/class, no wrapper, accent order; browser verifies block display only on opt-in. VIS-01/02 pending. |
| **AC-05** | Supported width/placement merges plus browser flex and grid with bounded host, shrinking track and `min-width: 0` on every relevant item; compare unbounded and unshrinkable ancestors as consumer limitations. VIS-02 pending. |
| **AC-06** | DOM/accessibility-tree and role/name assertions for complete children, `strong`, accent, native heading and ancestor link; no generated role, focus stop, live region, label or duplicate. Separately record actual screen-reader reading order; DOM alone is not AT proof. |
| **AC-07** | Real browser keyboard, pointer and touch activation of the visible disclosure in `TruncateListItem`, including focus indicator outside clipping and both complete values visible after activation. Test the actual Recado route separately in its consumer; `title`/Tooltip alone do not qualify. VIS-01 pending. |
| **AC-08** | Preserve ListItem's unclamped default; DOM/type checks for nested Text in Content and editorial Title/Meta spans, heading rank and unchanged part API. Browser verifies constrained narrow sizing and full-value disclosure. VIS-01 pending. |
| **AC-09** | Existing Text/Heading/ListItem tests plus explicit omitted/false and toggle preservation for variants, whitespace, tone, accent, Slot, native attrs and merges. Negative Heading type and unchanged Heading docgen/artifact; no Heading runtime/API change. |
| **AC-10** | Build and inspect shipped CSS/static CVA scan; packed React 18.3.1 and 19.3.0 consumer type, SSR/client, child-ref and no-Tailwind-compiler style checks. Audit diff for no token, dependency or legacy change; separately verify the authorized registry work and artifact. |
| **AC-11** | Review prop/story usage docs for unsupported hard breaks, blocks and focusable children. Public keyboard/activation checks show independent ancestor/sibling controls remain operable; no runtime child inspection or interaction engine is introduced. |

## 9. Browser, accessibility and visual procedure

With separate permission, record browser/version, viewport, device scale, theme, fonts and zoom. Inspect computed styles and line/overflow geometry, and rendered pixels in LTR/RTL/mixed cases; check the eyebrow pseudo-element and glow edge with the actual compiled stylesheet. Verify keyboard focus, pointer and touch reach the disclosure without clipping and that it really reveals both complete values. Inspect the accessibility tree and separately use a real screen reader for reading order; record product/version and outcome. Inspect the actual Storybook boolean widget and default column separately from optional args. Include the packed consumer without a Tailwind compiler, not only Storybook.

For expected-design comparison, first agree on a legitimate source and scenario/conditions, obtain read-only hosting and browser/server permission, capture and inspect real VIS-01/02 images, record provenance and SHA-256 in `docs/components/text/v0.3/capture.json`, and obtain human adoption of those exact images. This requires its own authorized surfaces. Do not fabricate expected references from implementation captures. Until adopted comparable references exist, visual conformity remains **Not evaluated**; a screenshot, DOM assertion or successful build is not visual or assistive-technology approval.

## 10. Risks, questions and stop

- **R1 — Flex is not ellipsis:** `inline-flex` cannot simply receive ellipsis; the eyebrow needs block layout and logical pseudo-element spacing. `twMerge`, RTL and actual pseudo-element metrics need real CSS/browser verification.
- **R2 — Shared source and evidence:** Text/Heading share `types.ts` and `accentVariants`. A convenience edit to the shared accent recipe could alter Heading; ten existing source revisions become stale even though the Heading contract does not change.
- **R3 — Accessible data versus visual access:** intact DOM/accessible names do not provide a visible touch/keyboard route. A native `title` or Tooltip-only example would violate the approved policy; actual screen-reader and Recado consumer checks remain separate.
- **R4 — Shipped CSS and package matrix:** a DOM class or a globally existing utility can produce false confidence. Verify Text's own static CVA and actual packed styles/React-major consumers; offline-cache availability and permission are unverified.
- **R5 — Evidence and size:** VIS-01/02 have no approved reference; browser/AT checks and the 768 KiB artifact budget remain pending. No conformity or completion claim is justified by this plan.
- **Open questions / gates:** no contradiction with the approved amendment was found. The owner must decide whether to approve this exact plan and the future edit/verification surfaces; expected-design source, capture conditions/adoption, real-browser/AT access and packed-fixture permissions remain to be arranged. No change to the approved truncation or full-text-access policy is proposed.

**Stop here:** this plan is a proposal. It does not authorize implementation, generated output, a server, package installation, a release or a GitHub action.
