# AttachmentField v0.2 — resetKey implementation plan (#516)

- **Status:** Approved — 2026-11-20 by the owner (reply "Apruebo con las recomendaciones"): plan and edit surfaces approved; the parent runs builds, artifact regeneration and `test:package-release`; browser verification in Chrome (screen-reader silence Not evaluated); release as a ui minor after the consolidated spec.
- **Contract:** [v0.1](../v0.1/spec.md) + [v0.1.1](../v0.1.1/reset-amendment.md) + [approved v0.2 amendment](reset-key-amendment.md). The v0.2 heading-line-through-EOF SHA-256 was verified as `3d83fc4b53f8617a54c7c4de89306e3d6153157fe30fcce766991c82700a1263`; owner reply **"Apruebo todo (recomendado)"** approved the amendment and naming convention, not this plan. Base: `e7eabf2`; planning branch: `docs/attachment-field-reset-key`.
- **Scope:** retain the exported molecule and its six files, composition, Material, no stylesheet, no ref/`asChild`, no new tokens or dependencies. Consolidating the three specs is a separate approved docs task before release.

## 1. Inspection and proposed files

`useAttachmentField.ts` already detects external controlled changes against both `seenValue` and the last `requested` list; it clears rejections but leaves the keyed status text. Its `commit` owns list notifications. The existing Controlled story starts with two files, and its button only clears the list. The default `image/*` accepts SVG, so the story must explicitly accept PNG to demonstrate an SVG rejection.

| Future surface, subject to separate approval | Proposed change |
| --- | --- |
| `packages/ui/src/molecules/attachment-field/types.ts` | Add `resetKey?: string \| number` to shared own props. English JSDoc: mount value inert, subsequent `Object.is` changes silently clear feedback only; omission has no fixed default. Use `@control false` and a concrete mixed-type reason pointing to Controlled. |
| `packages/ui/src/molecules/attachment-field/useAttachmentField.ts` | Consume the prop, never forward it to the DOM. Initialize a previous-token ref from the mount value; in the existing client-layout-effect pattern compare with `Object.is`, update the ref and clear rejections plus status `text: ''` on change. Update the ref in the committed effect, not during render. Move status state above the existing guarded external-change adjustment if needed; that qualifying adjustment also clears status text. Preserve the status key; never call `announce`, `commit`, callbacks or focus logic for either clear. |
| `packages/ui/src/molecules/attachment-field/AttachmentField.test.tsx` | RED-first matrix below; revise the existing AC-14d assertion that status text stays. |
| `packages/ui/src/molecules/attachment-field/AttachmentField.stories.tsx` | Controlled example keeps its existing list and button, accepts PNG, and increments a local `resetKey` on **Clear after save**, including when the list is already empty. Explain save vs typing in English. |
| `packages/ui/src/lib/storybook-controls.test.ts`, `packages/ui/src/lib/storybook-docgen.test.ts` | Update AttachmentField's pinned own-prop count 11 → 12 and control map; assert the optional mixed-type row, reason, no invented default, both union paths and zero diagnostics through actual extraction/enhancement. Inspect any story-list/docgen pins; do not add manual `argTypes`. |
| `scripts/package-consumption.test.mjs`, `scripts/package-exports.test.mjs` | Add typed controlled and uncontrolled `resetKey` samples and an invalid-type negative in the packed consumer fixture; inspect export/declaration pins and adjust only if necessary. Preserve no-ref/`asChild` negatives and React 18/19 evidence. |

**Parent-owned integration, proposed for later authorization:**

- `skills/_shared/prop-naming.json`: add approved `transient-feedback-reset-key` / `resetKey`, optional `string | number`, `aliases: []`, `exceptions: []`; semantics are the amendment's consumer token for transient feedback, not list reset, React identity or callback. Append reviewed `AttachmentFieldProps` usage. Refresh **all nine** existing AttachmentField usage revisions to the final whole-file `types.ts` SHA-256, after formatting; any later edit requires another refresh.
- `docs/decisions/prop-naming-attachment-field-reset-key-approval.json`: use the existing `human-approval-record` shape; quote **"Apruebo todo (recomendado)"** with `odd/tasks/attachment-field-reset-key.md` L2 provenance, limit it to `convention:transient-feedback-reset-key`, and bind the actual approved payload with `conventionHash`. Run `pnpm props:docs` to generate `docs/prop-naming.md`; never hand-edit it.
- `scripts/prop-naming.test.mjs`: register the new post-receipt convention and approval/usage proof, preserve historical receipts, and update applicable exact-count pins (currently 179 and 176). After the final source hash, run `pnpm props:check` and `pnpm test:props`.
- `packages/system/design-system.json`, `packages/system/system.md`: parent regenerates via `pnpm build`, `pnpm artifact --write`, `pnpm system:docs`, with separate authorization; inspect actual prop/naming diffs. No catalog row or token change.
- `docs/components/attachment-field/v0.2/implementation.md`: parent records observed RED/GREEN, verification and browser/AT results, distinguishing pending checks.

## 2. RED-first acceptance matrix

Use public DOM/props and capture expected RED before implementation, then GREEN; assert callback counts relative to the initial rejection, not zero total calls.

| Criteria | Planned checks |
| --- | --- |
| AC-27 | Controlled `[]` with `acceptedTypes={['image/png']}` → rejected SVG paste → save with `[]` and bumped token: messages, Dropzone `aria-describedby` and status text clear; no new list/rejection callbacks. |
| AC-28 | Typing and unchanged-token rerenders, including `NaN` → `NaN`, preserve message, description and status. |
| AC-29 | Mount token is inert; later omitted → supplied, supplied → omitted and `+0` → `-0` each clear feedback. |
| AC-30 | Both modes retain root, Textarea and status-node identity and Textarea focus; observe no newly inserted live text. Manual screen-reader verification is separate. |
| AC-31 | Populated controlled and uncontrolled lists keep every item and emit no list-change callback on token reset. |
| AC-14d revised | Qualifying external controlled clear empties status without new announcement; retain AC-14, 14a–c, copied echoes, filter back to previous value and uncontrolled behavior. Preserve intake/removal and existing removal focus intent. |

Check StrictMode, simultaneous external/token changes and absence of a leaked DOM attribute within these cases. Do not remount the field or clear a list for feedback reset.

## 3. Verification plan — not executed

Focused first: `pnpm exec vitest run packages/ui/src/molecules/attachment-field packages/ui/src/lib --maxWorkers=2`. CI Verify, serialized: `pnpm lint` → `pnpm props:check` → `pnpm test:props` → `pnpm typecheck` → `pnpm build` → `pnpm test` → `pnpm test:cli` → `pnpm --filter @egdev/tokens run test` → `pnpm test:package-exports` → `pnpm test:package-consumption`. Artifact hygiene: `pnpm artifact --write` → `pnpm system:docs` → `pnpm test:artifact` → `pnpm system:check` → `pnpm test:system`. Builds, generators, packed-consumer installation and `pnpm test:package-release` are parent-owned and require separate authorization; no verification is claimed here.

**Chrome / Storybook:** in Controlled, first clear its initial files; focus the Textarea and paste rejected `image/svg+xml` against the PNG-only rule. Type and verify feedback remains; invoke save without moving focus (for example a programmatic button click), verify empty message/description/status and unchanged focus. A normal mouse click may focus the button naturally; do not misattribute that to the field. Record whether clipboard input was trusted or synthetic, observe status mutations and check the Controls row. A screen reader is needed to establish spoken silence; browser/DOM evidence alone cannot. No new visual claim; existing visual conformity remains Not evaluated without comparable approved references.

## 4. Commit units and release

One PR; parent owns commits and final verification. Keep complete files together; intermediate units may have stale registry/docgen pins until integration lands, so the final PR—not each intermediate commit—is the full CI gate.

1. `feat(ui): reset AttachmentField transient feedback by token` — hook, types, RED/GREEN tests and Controlled story; approximately 400 lines.
2. `test(ui): register AttachmentField resetKey metadata and consumers` — docgen/controls, packed fixtures, naming registry, approval record, naming tests and generated prop docs; approximately 400 handwritten lines excluding generated output.
3. `docs(ui): refresh system artifact for AttachmentField resetKey` — parent-generated artifacts and observed verification record; generated output excluded from the line estimate.

`@egdev/ui` is a **minor** release; `@egdev/system`, `@egdev/mcp` and `@egdev/effects` follow release-set policy. Parent owns versioning, consolidated spec, `test:package-release`, packing and release separately; tokens/CLI are not changed by this plan.

## 5. Risks and open questions

- **Risks:** render-phase external clearing and committed token effects must not loop or race; test StrictMode and combined changes. Stale source hashes, pinned metadata/counts and generated artifacts can fail later gates. Real clipboard formats, focus from an actual pointer click and assistive-technology speech need distinct evidence.
- **Open questions:** (1) Approve this plan and the exact future surfaces above? (2) Authorize the parent-owned build, regeneration, packed-consumer and package-release gates when implementation is ready? (3) Which available browser/screen-reader combination and separate server authorization will be used? (4) What exact dependent versions and release timing should the parent select under the release policy?
