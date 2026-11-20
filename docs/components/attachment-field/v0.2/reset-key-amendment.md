# AttachmentField v0.2 — reset key amendment (#516)

- **Version / status:** v0.2 — **Approved — 2026-11-20 by the owner (reply "Apruebo todo (recomendado)")**, together with the `transient-feedback-reset-key` / `resetKey` convention; the consolidated spec (v0.1 + v0.1.1 + v0.2) is a separate docs task before release. Amends [v0.1](../v0.1/spec.md) and [v0.1.1](../v0.1.1/reset-amendment.md).
- **Snapshot:** `contentSHA256: 3d83fc4b53f8617a54c7c4de89306e3d6153157fe30fcce766991c82700a1263`; `visualHashes: Not applicable (no appearance change)`; `approvalReference: owner reply "Apruebo todo (recomendado)", 2026-11-20; ODD log odd/tasks/attachment-field-reset-key.md`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/497`; `latestPublishedComment: Pending`; related request: #516.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. What changes` through EOF, with LF line endings and the recorded final newline; metadata above it is excluded. Finalize before approval.

## 1. What changes

The v0.1 Q2-B note “Reset needs a `key` remount or a ref API” is superseded as a blanket statement: this resets feedback, **not** the list. AC-01's no-ref/no-`asChild` promise remains. The additive change targets an `@egdev/ui` **minor** release.

The v0.1.1 external-change rule still compares list length and `File` references against both the previous value and last requested list; copied echoes and filters back to the previous list retain feedback. A qualifying external clear now also empties the status silently. AC-14d's assertion that status text stays is superseded; its other promises and all unmentioned v0.1/v0.1.1 promises remain.

## 2. API and behavior

`resetKey?: string | number` works in both modes. Its mount value, including omission, is inert. Thereafter, when `Object.is(previous, current)` is false, clear rejections and empty the still-mounted status region silently. Adding/removing the prop changes it; `NaN` equals `NaN`, while `+0` and `-0` differ. Unchanged tokens, including typing re-renders, do nothing; existing intake, removal and external-change rules still apply. Bump the token after save, including without a form.

A reset leaves either list untouched, emits neither `onValueChange` nor `onFilesRejected`, removes rejection `aria-describedby`, and causes no remount or focus move. Existing removal focus intent is unchanged. No new live-region text is inserted; assistive-technology silence requires manual verification.

### Prop-naming proposal

Meaning/name/alias lookup in the [registry](../../../../skills/_shared/prop-naming.json) and [view](../../../prop-naming.md) found no reset token. Propose **`transient-feedback-reset-key` / `resetKey`**: consumer token changes reset component-defined transient feedback without changing its value or remounting. Use declaratively; avoid list resets, React identity keys and callbacks. Status `approved` (owner, 2026-11-20); the approval record is added with the registry entry at implementation, `aliases: []`, `exceptions: []`; AttachmentField type optional `string | number`. Convention approval is separate.

`primary-value`/`value` is the list; `initial-uncontrolled-value`/`defaultValue` initializes it. `interactive-value-change`/`onValueChange` and `committed-value-change`/`onValueCommit` are outgoing notifications; `search-query-change`/`onQueryChange` explicitly avoids programmatic resets; `initial-uncontrolled-sort`/`defaultSort` excludes resets. React `key` remounts. Current [AttachmentFieldProps](../../../../packages/ui/src/molecules/attachment-field/types.ts) SHA-256: `344b1b447c3d07fd0d0c3cc52d94373d4ba392d36b2942045bda584af509c75f`; record new usage evidence only after implementation.

## 3. Acceptance criteria and planned checks

Planned in `packages/ui/src/molecules/attachment-field/AttachmentField.test.tsx`; not yet run:

- **AC-27:** Controlled `[]` → rejected paste → save with `[]` and bumped token clears messages, `aria-describedby` and status; no reset callbacks.
- **AC-28:** Typing and unchanged-token re-renders preserve rejection and status; `NaN` → `NaN` also preserves them.
- **AC-29:** Initial token is inert; omitted → supplied, supplied → omitted and `+0` → `-0` later clear feedback.
- **AC-30:** Both modes retain field, Textarea and status node identity and Textarea focus; no new live-region text. Manually verify no spoken announcement.
- **AC-31:** Populated lists in both modes retain all items without a list-change callback.
- **AC-14d revised:** A qualifying external controlled clear empties status without announcing; preserve AC-14, AC-14a–c and uncontrolled behavior without a token change.

## 4. Owner decisions (resolved 2026-11-20)

The owner approved the amendment and the convention together ("Apruebo todo (recomendado)"). The already-approved v0.1.1 consolidation is delivered as a separate consolidated v0.2 spec before release; historical snapshots are preserved. Neither approval authorizes the implementation plan, which needs its own approval.
