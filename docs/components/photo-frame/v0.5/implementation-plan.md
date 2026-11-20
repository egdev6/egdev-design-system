# AttachmentField v0.1.1 and PhotoFrame v0.5 — joint implementation plan (#508, #509)

- **Status:** Approved — 2026-11-20 by the owner (reply "Apruebo con las recomendaciones"): plan and edit surfaces approved; the AttachmentField Controlled story gets a Reset button; the release is a separate step after merge; VIS-07/08 captures authorized; fingerprints inline in PhotoFrame.test.tsx.
- **Specs (approved 2026-11-20, owner reply "Acepto todas"):**
  - [AttachmentField v0.1.1 reset amendment](../../attachment-field/v0.1.1/reset-amendment.md), `contentSHA256: 3803812f0f16bb755328c8d10b72bbea3f341e393c475eb96ad2e9bba1c158a0`.
  - [PhotoFrame v0.5 fit amendment](fit-amendment.md), `contentSHA256: f201262463ed1b01eb5e2bed88dcb0c82368b4c0e1540041db960d3cc76e0f49`.
  - Both digests were recomputed while writing this plan (payload from `## 1. What changes` / `## 1. Purpose and scope` through EOF) and match the recorded values.
- **Base commit:** `2c29b88`. Skill: `skills/component-contributor/SKILL.md`, plan stage only.
- **Issues:** #508 (AttachmentField), #509 (PhotoFrame; canonical #95). One branch, one PR, two independent fixes in separate commits.

## 1. Inspection result

| Piece | Evidence | Consequence |
| --- | --- | --- |
| `useAttachmentField.ts` | `rejections` state is cleared only in `remove` (`setRejections([])`) and replaced in `intake` (`setRejections(rejected)`). `commit(next)` is the single place that calls `onValueChange`. | The fix lives entirely in the hook; no `types.ts`, JSX or export change. |
| `usePhotoFrame.ts` / `types.ts` | `photoFrameImageVariants` base string holds `object-cover`; `focalPoint` axis adds `object-*`. Enum normalisation is done by hand in the hook; `data-*` markers exist for ratio, variant, focal point only. | `fit` is one static CVA axis on the image recipe plus one normaliser; no new marker (PF-2). |
| Composition | No new component, token, dependency, stylesheet or module. `compiled.css` already scans `photo-frame/types.ts`, so `object-contain` is emitted once it is a literal there. | Six files stay as they are; "No stylesheet" stands. |

## 2. Files

### Unit A — AttachmentField reset (S1)

| File | Change |
| --- | --- |
| `packages/ui/src/molecules/attachment-field/useAttachmentField.ts` | Add `requested` ref (last list passed through `commit`, updated in `commit` for intake and removal) and `seenValue` state. During render, when controlled and `value !== seenValue`, set `seenValue` and, if `value` differs entry by entry (length and `File` reference) from `requested.current` and from the previous `value`, call `setRejections([])` (React's adjust-state-during-render pattern, so no stale frame and no effect flash). No `announce` call (silent). Focus code untouched. |
| `AttachmentField.test.tsx` | RED-first cases AC-14a–14d (section 4). |
| `AttachmentField.stories.tsx` | Optional (OQ2): `Controlled` story gains a "Reset" button next to "Clear after save" to show the fixed behavior. |
| `types.ts`, `AttachmentField.tsx`, `index.ts` | **Not touched.** Hence no prop-naming revision refresh for AttachmentField. |

### Unit B — PhotoFrame fit (S2)

| File | Change |
| --- | --- |
| `atoms/photo-frame/types.ts` | `export type PhotoFrameFit = 'cover' | 'contain'`; `fit?: PhotoFrameFit` in `PhotoFrameProps` with English JSDoc, `@default cover`, `@control select`; new `fit` axis in `photoFrameImageVariants`: `{ cover: '', contain: 'object-contain' }`, `defaultVariants.fit = 'cover'`. The base string keeps `object-cover`; `cn()` (tailwind-merge) resolves the conflict, so the default string is untouched. |
| `atoms/photo-frame/usePhotoFrame.ts` | Destructure `fit: requestedFit`; `const fit: PhotoFrameFit = requestedFit === 'contain' ? 'contain' : 'cover'`; pass `{ focalPoint, fit }` to the image recipe. No new `data-*`, no rootProps change. |
| `atoms/photo-frame/index.ts` | Add `PhotoFrameFit` type export (the barrel `export *` carries it). |
| `PhotoFrame.test.tsx` | RED-first cases PF5-01…PF5-09 (section 4). |
| `PhotoFrame.stories.tsx` | Add `Fit` story: cover vs contain side by side using a generated tall screenshot-like fixture (data URI SVG, 1:3), `portrait`/numeric `ratio`, one `framed` + `focalPoint='top'` cell; description carries the PF-5 note ("prefer `portrait` or a numeric `ratio` for tall images; `landscape` shrinks them"). Existing stories unchanged. |
| `PhotoFrame.tsx` | **Not touched** (JSX is unchanged; `imageProps.className` carries the fit). |

### Wiring and integration (parent-owned surfaces, listed for approval)

| Path | Change |
| --- | --- |
| `packages/ui/src/lib/storybook-controls.test.ts` | PhotoFrame `ownPropCounts` 6 → 7; `fit` expected `select`; zero owned diagnostics. |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Extraction row for `fit` (enum `cover`/`contain`, default `cover`) if a PhotoFrame block exists; shared component list unchanged. Check for any per-component `*-docgen` test and update pinned props. |
| `scripts/package-exports.test.mjs` | Add `PhotoFrameFit` to the three type lists (~3247, ~6162, ~6569); add `.object-contain` to the PhotoFrame emitted-CSS assertion (~3266). |
| `scripts/package-consumption.test.mjs` | Import `PhotoFrameFit` (~192); typed `fit: 'contain'` in `photoFrameProps`; `@ts-expect-error` negative for `fit: 'fill'`; runtime assertion that `fit="contain"` image carries `object-contain` and not `object-cover`. 255-token pin unchanged. |
| `skills/_shared/prop-naming.json` | (a) New convention `image-fit` / `fit` copied verbatim from the amendment's section 2, `status: approved`, `approval` = `{reference: docs/decisions/prop-naming-photo-frame-fit-approval.json, scope: 'convention:image-fit', contentHash}`; (b) PhotoFrame usage `PhotoFrameFit ('cover' | 'contain')`, source `atoms/photo-frame/types.ts`, symbol `PhotoFrameProps`; (c) refresh `source.revision` (whole-file SHA-256 of the **final** `types.ts`) on **every** existing usage that points at `photo-frame/types.ts` (the four PhotoFrame usages: `aspect-ratio`, `image-focal-point`, `visual-treatment`, `image-caption`); any later `types.ts` edit or format pass requires recomputing. AttachmentField usages need no refresh. |
| `docs/decisions/prop-naming-photo-frame-fit-approval.json` | New `human-approval-record` (shape of `prop-naming-panel-tabs-fill-approval.json`): quote `"Acepto todas"`, provenance `odd/tasks/attachment-photo-frame-amendments.md` L2 (2026-11-20, PF-1 approves `image-fit` / `fit`); `limits` bind only that convention; entry `convention:image-fit` with its `contentHash`. |
| `docs/prop-naming.md` | `pnpm props:docs` (never hand-edited). |
| `packages/system/design-system.json`, `system.md` | Regenerated by `pnpm build` (`pnpm artifact --write`, `pnpm system:docs`); expected diff: `propNaming` +1 convention, PhotoFrame props/types +`fit`/`PhotoFrameFit`, no token or CSS-variable count change. Read counts from the diff; do not assume. |
| `scripts/catalog_data.py` / `docs/CATALOGO.md` | Not touched (no new component). |

## 3. Behavior guarantees

- **Default PhotoFrame output byte-identical.** Before editing, capture serialized DOM (`container.innerHTML`) at base `2c29b88` for the fingerprint matrix (omitted `fit`; every ratio incl. `auto` and a numeric one; `framed`; caption; each focal point) and pin it as literal strings in `PhotoFrame.test.tsx`; `fit` omitted, `'cover'` and unknown must equal it. Fingerprints come from the base commit, not from the new code.
- **AttachmentField**: a parent echo (same or copied array, same `File` references) keeps a mixed-intake message; reset, replacement, filter or transform clears (AF-1); uncontrolled behavior and the AC-14 sequence are unchanged.

## 4. Tests (RED first, one commit each)

Expected RED: AC-14a/14c fail (messages remain); 14b/14d pass already as PRESERVE guards, so 14b is written first against the current code to pin echo behavior. PF5-02/03/05/06/08 fail (no `fit`); PF5-01/04 pass on the unchanged code (PRESERVE).

| AC | Test |
| --- | --- |
| AC-14a | Controlled harness with a Reset button: after a rejection, reset to `[]` clears messages and `aria-describedby`; `document.activeElement` stays on the Textarea. |
| AC-14b | Mixed intake echoed as the same array and as `[...next]`: message and `aria-describedby` kept. |
| AC-14c | Rerender with different `File`s clears. (AF-1 extra case: a parent that dedupes the requested list clears.) |
| AC-14d | `status` text and node count identical before/after the clear; uncontrolled variant and existing AC-14 tests stay green. |
| PF5-01 | Base-commit fingerprints equal for omitted / `cover` / unknown `fit` across the matrix; existing suite retained. |
| PF5-02 | `contain` gives the image `object-contain` and no `object-cover`, for every ratio and `auto`; other parts unchanged. |
| PF5-03 | Unknown runtime `fit` (`'fill'`, `null`) equals `cover` output; nothing leaks to the DOM (no `fit` attribute). |
| PF5-04 | Radix wrapper `paddingBottom` for presets and numeric, and `auto` (`h-full`, no wrapper), identical across both fits. |
| PF5-05 | No `style` on any node; media class string equal across fits; `scripts/package-exports.test.mjs` asserts emitted `.object-contain`. |
| PF5-06 | Matrix `contain` × `focalPoint` (nine) × `framed` × caption: class set equals the union, `data-focal-point`/`data-variant` unchanged, no `data-fit`. |
| PF5-07 | Browser check (section 6); no jsdom proxy. |
| PF5-08 | Docgen/controls tests: `select`, English JSDoc, `PhotoFrameFit` exported, no manual `argTypes`. |
| PF5-09 | File-set review: six files, no CSS, no new module/token/dependency. |

Counts: AttachmentField 4/4 ACs, PhotoFrame 9/9 ACs (8 automated, 1 browser). Roughly 12 AF and 30 PF `it` cases (parametrised).

## 5. CI Verify list (run focused first, serialized per `docs/decisions/test-worker-budget.md`)

Focused: `pnpm exec vitest run packages/ui/src/molecules/attachment-field packages/ui/src/atoms/photo-frame packages/ui/src/lib --maxWorkers=2`.

Then, in CI order: `pnpm lint` → `pnpm props:check` → `pnpm test:props` → `pnpm typecheck` → `pnpm build` (regenerates the system artifact) → `pnpm test` → `pnpm test:cli` → `pnpm --filter @egdev/tokens run test` → `pnpm test:package-exports` → `pnpm test:package-consumption`. Hygiene: `pnpm props:docs`, `pnpm artifact --write`, `pnpm system:docs`, `pnpm test:artifact`, `pnpm system:check`, `pnpm test:system`.

## 6. Browser verification (Playwright, Chrome, Storybook on 127.0.0.1:6006)

1. **PhotoFrame `Fit` story, tall fixture:** under `cover` the image box exceeds the viewport on one axis (cropped); under `contain` `img.getBoundingClientRect()` lies inside the viewport on both axes and the figure box is unchanged (PF5-07). Check `framed` + `focalPoint='top'` (VIS-08) and the Controls panel `fit` select.
2. **AttachmentField reset:** in `Controlled`, paste a mixed intake (valid + rejected), confirm the message; press Reset: message and `aria-describedby` disappear, `document.activeElement` is the Textarea, the status region gets no new text.
3. Captures (VIS-07/08) only with owner authorization; otherwise visual conformity stays **Not evaluated**. Screen-reader behavior is not verifiable here.

## 7. Commit units (~400 lines each; one PR; the parent commits)

| # | Commit | Content | Size |
| --- | --- | --- | --- |
| 1 | `fix(ui): clear AttachmentField rejection messages on external value changes` | hook + AC-14a–d tests (+ optional story button) | ~180 |
| 2 | `feat(ui): add a fit variant to PhotoFrame` | `types.ts`, hook, `index.ts`, tests PF5-01…06, `Fit` story | ~380 |
| 3 | `test(ui): register PhotoFrame fit in controls, exports and consumer fixtures` | controls/docgen tests, `package-exports`, `package-consumption` | ~90 |
| 4 | `docs(ui): register the image-fit convention and refresh artifacts` | registry JSON + approval record, `docs/prop-naming.md`, regenerated `design-system.json`/`system.md` | mostly generated |
| 5 | `docs(ui): record the v0.1.1 and v0.5 implementation and verification` | `implementation.md` for each (observed commands, RED/GREEN, browser results) | ~120 |

Commit 4 hashes `types.ts` only after unit 2 is final. Complete-file commits only.

## 8. Release impact

`@egdev/ui` **patch** (bug fix and additive optional prop; no break). `@egdev/system`, `@egdev/mcp` and `@egdev/effects` follow per the release rules in `docs/distribution/versioning.md` (the artifact changes; the set is released together, as in `fc89d8a`). Version bump and `release:pack` stay a separate parent step. `@egdev/tokens` and `@egdev/cli` unaffected unless the rules say otherwise (OQ3).

## 9. Risks

- **R1.** Render-phase `setRejections` must not loop: guarded by `seenValue`; covered by a test with a parent that re-creates the array every render.
- **R2.** A parent that never echoes the requested list looks external on its next unrelated change; this is the approved "any external change" reading.
- **R3.** Registry `revision` hashes go stale on any `types.ts` edit (including Biome formatting); recompute last.
- **R4.** Docgen/controls pins (`ownPropCounts`) and `package-*` fixtures fail loudly if missed; they are listed in section 2.
- **R5.** `object-contain` must appear literally in `types.ts` or the production CSS omits it; asserted in `package-exports`.
- **R6.** jsdom cannot prove "not cropped"; PF5-07 depends on the browser run. Letterbox bars use the existing media Surface (PF-4), so contrast over bars is not re-evaluated.

## 10. Open questions (for the owner; none decided here)

1. **OQ1.** Approve this plan and the intended edit surfaces in section 2, including the parent-owned integration files?
2. **OQ2.** Include the optional AttachmentField `Controlled` story Reset button, or ship the fix with tests only?
3. **OQ3.** Exact versions for the patch release (ui, system, mcp, effects) and whether the release lands in this PR or a separate one.
4. **OQ4.** Authorize VIS-07/08 captures under `docs/components/photo-frame/v0.5/`, or leave them Pending?
5. **OQ5.** Where the PhotoFrame fingerprints live: inline literals in `PhotoFrame.test.tsx` (proposed) or a separate fixture file?
