# Dropzone v0.1 implementation evidence

## Authority and scope

- Contract: [#56](https://github.com/egdev6/egdev-design-system/issues/56), v0.1, adopted by the owner full-contract approval comment. Frozen body SHA-256: `2701768875f9a4365a2561fb8fe2b91cd1259ef0201b92a7c21d88097907a434`; canonical payload SHA-256: `8a29ac8d0a5ccde96a678e5d8376b5a370686e3d72f19ff3d9f17e824690dca3`; ordered history SHA-256: `8bd11645b36bb460aefbc89ac37aa42e519263e8107c85d2acc7e2212a2cc43b`. Historical Draft/Pending wording does not supersede that approval.
- Separate implementation plan approval: the parent explicitly approved the exact native button + hidden input fragment, upload Icon, contract file handling, six files, CVA and per-part `cn()` in this delegated implementation task. This is a parent approval under delegated full-batch development authority, not a new owner quote or independent receipt.
- Task: `odd/tasks/particles-build.md`, T26, S1–S6; base `1cae07e`, branch `feat/56-dropzone`. Icon is present and publicly exported on this base. No fabricated Button, IconButton or Surface dependency.
- No new stylesheet, internal module, token, dependency, form-file participation, ref or `asChild` API. Legacy CSS and previous components remain unchanged.
- Expected design inspected, not replaced: VIS-01 `Dropzone.png`, SHA-256 `e411150ff53a0ce06939cc5975571bc83314969eb2a245636ee44e9550a6e89f`; VIS-02 `dropzone--specimen.png`, SHA-256 `6bf6b8dd7d374f951766abb5762062dd47ce9a6e130e32b025f5a1125995094e`, under `docs/design/foundation-boards/v2026-10-17/` and its `specimens/` subdirectory.

## Decisions applied

| Decisions | Implementation |
| --- | --- |
| D1–D2 | Native `button type="button"` and sibling `input type="file" hidden tabIndex={-1}` in a fragment. No custom keyboard handler or VisuallyHidden dependency. Radix has no dropzone primitive. |
| D3–D5 | Private nested drag-depth counter, `data-state="idle\|over"`, decorative `Icon name="upload"`, resting `label` and dragging `dropLabel`. No mirrored legacy state classes. |
| D6–D9 | `accept` reaches only the picker. Drop/paste deliver files without MIME, extension or size validation; non-file drags/pastes are ignored. `multiple=false` slices to the first file on every path. Paste is scoped to the focused button; no document listener. |
| D10 | Snapshot selected File objects before clearing the picker, then reset its value before invoking consumer code; repeated selection works. No input `name` or `required`. Native button attributes and consumer `onClick` are preserved; preventDefault cancels picker activation. |
| D11–D12 | Approved token-backed dashed transparent recipe, label-default typography, 1.5/2.5 spacing steps, 96px default minima and 56px inline minimum height. Native focus ring, disabled opacity/pointer/cursor and reduced-motion utilities. |
| D13 | No stylesheet. `compiled.css` scans only production `types.ts`; Storybook scans the story for example layout. |

The production stylesheet has no preflight. Narrow native paint resets `bg-none` and `[box-shadow:none]` make the approved transparent idle button explicit without changing its Material recipe. They do not authorize generic appearance resets elsewhere. Focus-visible utilities override the idle shadow reset. Tailwind compiles `shadow-focus` to the canonical two-ring value; it does not retain a literal `var(--shadow-focus)` reference. Existing legacy marker rules stay in the components layer; production utilities remain in their natural layer.

`className` is merged last on the button for outer margin, grid placement and width only. It is not a promise of arbitrary appearance overrides or universal last-class precedence. Icon and text parts also use `cn()`. Private helpers and the hook are not package exports. Public exports are exactly `Dropzone`, `DropzoneProps` and `dropzoneVariants`.

## Naming and metadata

Four existing approved conventions gain exact reviewed `DropzoneProps` usages: `accessible-name` / `label`, `visual-treatment` / `variant`, `files-received` / `onFiles`, `drop-target-label` / `dropLabel`. Source: `packages/ui/src/atoms/dropzone/types.ts`, whole-file SHA-256 `e5291d6462a6cbbb46e2b5a2ed7cb1d66437ff049d60e77229599395a1dced03`. No semantic widening, alias, exception or historical approval receipt is changed. The exact convention/source pairs are added to the post-receipt filtering test; the generated naming view is regenerated, not hand-edited. `accept`, `multiple` and native `disabled` are native attributes, not new conventions.

Real docgen and registered Storybook extraction/enhancement/inference verify six own rows: text for `label`, `dropLabel`, `accept`; boolean for `multiple`; select for `variant`; disabled control with a concrete reason for required `onFiles`. Requiredness, constant defaults, absent defaults, native rows and omitted drag/ref/asChild APIs are checked. Zero owned metadata diagnostics. No manual argTypes, play function or state-rendering adapter.

Stories: Default, Inline, Disabled, MultipleFiles, DragOver, ConsumerLayout. DragOver requires an actual drag gesture; it is not a forced static over-state screenshot.

## Acceptance coverage

| ID | Observed functional evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 | Unit: native button name/defaults, hidden unfocusable sibling input, Tab focus, decorative icon; packed SSR and CSR anatomy. | Real browser accessibility tree not evaluated. |
| AC-02 | Unit: click, Enter and Space call the input click spy; consumer onClick and cancellation. Packed CSR native activation on both React majors. | Real OS picker and focus return not evaluated. |
| AC-03 | Unit: upload resets before callback, same file can be selected twice, empty selection does not emit. Bounded correction: mutable-selection model preserves first/all selected files before reset; throwing/unmounting callbacks observe the reset input. Initial packed CSR covers repeated input-change delivery and empty value; post-correction packed rerun belongs to the parent. | Native picker UI not evaluated. |
| AC-04 | Unit: file-type presence check, custom labels, nested drag enter/leave, final leave and depth-floor recovery. Packed CSR nested drag handling. | Browser drag visuals not evaluated. |
| AC-05 | Unit: drop prevents navigation, resets state, single/multiple slicing, non-file/empty drops ignored, mismatched accept delivered. Packed CSR delivers a text file despite image accept. | Consumer validation/upload is intentionally out of scope. |
| AC-06 | Unit: focused single/multiple paste prevents default and emits; unfocused target/body paste and empty paste ignored. Packed CSR focus-scoped paste on both majors. | Real clipboard integration not evaluated. |
| AC-07 | Unit: disabled blocks picker, drag, drop, paste and input change; disabling clears an active drag and re-enabling starts fresh. Packed CSR disabled identity and behavior. Built CSS includes opacity .45 and pointer/cursor rules. | Browser computed disabled appearance not evaluated. |
| AC-08 | Unit: inline row, full width, gap and min-height replace default column/min-height classes. Built CSS verifies token geometry. Packed SSR inline classes. | VIS-02 comparison not evaluated. |
| AC-09 | Unit: native keyboard focus and focus-visible utility. Built CSS checks the canonical two-ring shadow. | Browser focus rendering not evaluated. |
| AC-10 | Unit: stable root, consumer layout classes and native routing; metadata/export checks preserve previous APIs. Packed SSR/CSR and CSS consumers validate external use. | Visual conformity not evaluated. |

## Observed validation

All commands ran foreground, serialized/capped as requested. Initial delivery build preceded its full test and package gates. The eight-gate results below predate the bounded picker correction; only the focused/typecheck/lint results in the follow-up section apply to that correction. No timeout, blind retry, install command, browser, server, watcher or CI run is claimed.

### Test-first evidence

1. Initial focused collection failed because the new implementation modules did not exist.
2. With only anatomy/default derivation in place, the same behavior suite produced **7 failures / 4 passes**: picker click expected 3 but received 0, callback expected 2 but received 0, drag name stayed at rest, and drop/paste did not prevent defaults.
3. After implementing the hook handlers, **11/11 passed**. Alternate cases cover both multiple settings, mismatched accept, nested/final/extra leave, non-file drags, empty and unfocused paste, consumer cancellation, repeated picker selection and disabled/re-enabled state.
4. Focused component + metadata suite: **164/164 passed** across 3 files.

Focused commands:

- `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/dropzone/Dropzone.test.tsx --maxWorkers=2`: initial collection failure; then observed behavioral RED (7 failed / 4 passed); then GREEN (11 passed).
- `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/dropzone/Dropzone.test.tsx packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2`: 3 files / 164 passed.

### Initial delivery eight gates (before bounded picker correction)

| Exact command | Observed result |
| --- | --- |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Pass; 281 files checked. Initial formatting-only failure in four edited integration files was corrected manually. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Pass; root and UI TypeScript checks. Existing tokens/effects placeholder scripts remain unchanged. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Pass; UI JS/declarations and 207.42 kB stylesheet, tokens built. Effects remains its existing placeholder. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | 34 files / 674 passed. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Pass; source hashes, approvals and generated view valid. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | 82 passed. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | 31 passed; 68 reachable declaration files. Initial new CSS test failure assumed a nested data-state selector; corrected to the actual emitted flat attribute suffix and canonical compiled focus shadow, without changing implementation. |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | 12 passed: React 18.3.1 and 19.3.0, each with entry/dedup, strict types/negatives, SSR, jsdom CSR, native Vite CSS and Tailwind CSS checks. |

Packed fixtures retain the single React type import and every previous component/import/export scenario. The transition guard remains additive: none, opacity, transform, the exact Input/Textarea `transition-[border-color,box-shadow]` recipe, plus Dropzone `transition-colors` only. No implicit Tailwind default animation is introduced by the reference-only theme.

Warnings: the packed run emitted ProgressBar `<div>`-inside-`<p>` nesting warnings from the existing `ProgressBarSamples` fixture. All subtests passed; this unrelated markup was preserved rather than silently repaired. Vite emitted its existing SWC plugin recommendation. No known environmental failure exemption was needed.

## Bounded picker robustness correction

The parent authorized only hook/test/evidence edits after delivery readback. The original onChange retained a FileList reference, reset input.value and only then converted the list to an array. The contract requires preserving picked files and resetting before consumer delivery, but supplies no guarantee that a previously retrieved FileList remains populated after reset. The correction avoids relying on that lifetime: copy actual File references with Array.from before clearing the input, then reset before calling the unchanged delivery policy. Its private receive helper now also accepts the snapshot array; drop/paste still use FileList, with the same first/all slicing and disabled/empty guards. No API, recipe, token, dependency or naming evidence changed.

A deterministic regression populates a file input through user-event, substitutes a mutable selected-files list and wraps the value setter so reset also clears that list. This is an intentionally controlled mutation model, **not evidence that a particular browser mutates an earlier FileList reference**. The original handler produced **2 failures / 13 passes**: onFiles was never called for either multiple setting because the referenced list was empty before conversion. After snapshotting before reset, **15/15 passed**. Delivered objects retain identity and order for both first-file and multiple delivery.

Two alternate hook/native-input harness cases verify reset ordering with a consumer that throws and a consumer that unmounts the input: each callback sees an empty value and selected-files list while still receiving the original two File objects. The harness captures the thrown error synchronously without treating it as a browser event result. Existing drag/paste, disabled, cancellation and reselection cases remain green.

Follow-up commands:

- `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/dropzone --maxWorkers=2`: observed RED 2 failed / 13 passed, then GREEN 15 passed.
- `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck`: passed after the correction.
- `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint`: passed, 281 files; initial formatting-only failure in the added test was corrected manually. The focused suite was then rerun and remained 15/15 green.

No full build, full suite or packed rerun was authorized for this follow-up; the parent owns those after current-main integration. Browser/visual/native picker behavior remains Not evaluated. Writer self-verification is the evidence here; the parent reported native assessment unavailable for the untracked explicit selection, not an independent review pass.

## Switch-main additive integration

The parent reported complete-file commits `34ce94b`, `1c32f68` and `d9f8db5`, then merged `origin/main` at `cb3a26e` (Switch #156). Its frozen-install job 58 completed successfully. Those Git/install actions belong to the parent; the writer performed no Git mutation or installation.

The writer resolved text conflicts only in `packages/ui/src/lib/storybook-controls.test.ts`, `scripts/package-consumption.test.mjs` and `scripts/package-exports.test.mjs`, plus this evidence update. Generated naming/catalog documents were already merged; `props:check` reports the naming view current, so no regeneration or generated-document edit was needed.

- Controls retain independent complete Dropzone and Switch assertions, both component registrations, all native/default rows, and own metadata counts 6 and 7 respectively.
- Packed fixtures retain one React type import, both complete samples and strict negative cases, the previous App props/scenes, both runtime exports, and both CSS helper definitions/serializations with entry/native-Vite/Tailwind calls. Both SSR scenes and CSR stages/summary entries are retained. Dropzone constructs files through window.File and Switch constructs FormData through dom.window.FormData; the shared DOM realm stays alive until the final root unmount and window.close, after the Switch scene. No DOM node is compared with deep equality. The existing 255-token assertion is unchanged.
- The transition guard uses main's complete-selector boundaries and exact inventory: none, opacity, transform, [background-color,border-color], [border-color,box-shadow], [translate,background-color], plus only the approved Dropzone colors recipe. transition-colors moves into the positive inventory; transition-width replaces it among the 11 negative cases. Suffix extensions and arbitrary property supersets remain rejected by the complete-selector boundary. These package-script cases are retained source coverage, not an executed export/packed gate in this integration pass.
- Dropzone's hardened hook/test files were not edited: its 15-test behavior, snapshot-before-reset correction and source evidence remain intact. Registry approval receipts and regressions were not rewritten; the naming suite passes.

Observed integration validation:

| Exact command | Result |
| --- | --- |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/dropzone packages/ui/src/atoms/switch packages/ui/src/lib --maxWorkers=2` | 12 files / 285 tests passed. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Passed; 287 files checked. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Passed; root and UI checks. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Passed; registry valid and generated view current. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | 82 passed. |

Strict TDD was not activated for this merge-resolution task; no new RED/GREEN lifecycle is claimed. The earlier 674-unit/eight-gate record remains historical, not verification of the merged tree. Full build/export/packed/full-suite gates remain the parent's next step. Browser, visual and Controls-widget checks remain Not evaluated.

## Deviations and limits

- No contract behavior/API deviation. Narrow native paint resets are documented above. The DragOver story is an interactive scenario rather than a fabricated static internal-state prop.
- Catalog composition is corrected from Icon + VisuallyHidden to Icon under approved D2; no primitive is retired.
- CodeGraph reported not initialized. Initialization would write outside the delegated edit surfaces, so scoped filesystem inspection was used instead. No sibling checkout or persistent memory was read.
- Visual conformity, computed browser styles, real picker/clipboard integration and browser Controls widgets: **Not evaluated**. Owner review on main remains separate.
- No Git mutation. The pre-existing untracked `odd/tasks/particles-build.md` is preserved unchanged and is not part of this change.

## Proposed complete-file commit units (parent only)

1. `feat(ui): implement native Dropzone atom` — all six files under `packages/ui/src/atoms/dropzone/` together (496 lines after the bounded correction, including the complete behavior test and stories). The local folder export is usable; package-root registration is the next unit. Do not split the test into prefixes.
2. `test(ui): integrate Dropzone metadata and packed consumers` — package root export, compiled CSS source, `.storybook/main.ts`, `.storybook/preview.css`, both complete Storybook test files, and both complete package test scripts (approximately 320 changed lines). Retain every earlier API and fixture.
3. `docs(ui): register Dropzone contract evidence` — registry JSON, generated naming view, naming regression test, catalog source and both generated catalog outputs, plus this implementation evidence. Historical receipts remain byte-identical.

These were suggested review units, not commits performed by the writer. The parent subsequently reported the three complete-file commits recorded in the integration section above.

## Ready PR body

### Summary

- Implement approved Dropzone #56 v0.1: native drag/paste/pick target, decorative upload Icon and hidden sibling file input.
- Preserve accept as picker-only filtering; consumers own validation, upload and announcements. Handle nested drag depth, focused paste, single/multiple delivery, picker reselection and disabled state.
- Add six-file CVA implementation, Storybook metadata, exact naming usages, catalog correction and additive package/React 18–19 coverage. No tokens, dependencies or stylesheet added.

### Verification

- Initial behavioral RED: 7 failed / 4 passed; GREEN: 11 passed. Initial focused component/metadata: 164 passed.
- Bounded picker correction RED: 2 failed / 13 passed; GREEN: 15 passed, with focused typecheck/lint verification. Selected File objects are snapshotted before reset; consumers still run after reset.
- Before that correction, all eight gates passed: 674 unit tests, 82 naming tests, 31 export tests and 12 packed-matrix tests. Parent reruns full gates after current-main integration; do not treat the earlier build/packed results as post-correction evidence.
- Switch-main integration: 12 focused files / 285 tests, lint (287 files), typecheck, naming check and 82 naming tests pass. Full merged-tree build/export/packed/full-suite gates remain with the parent.
- Browser/visual/Controls checks: Not evaluated; owner reviews Storybook on main. No CI run claimed.
- Existing packed ProgressBar nesting warnings are reported and left unchanged.

Closes #56
