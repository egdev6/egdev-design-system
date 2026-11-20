# Component contract — AttachmentField

- **Version / status:** v0.2 — **Approved — 2026-11-20 by the owner (reply "Apruebo")**: consolidated contract (v0.1 + v0.1.1 + v0.2) with two v0.1 corrections (`onChange` exclusion, 44.8 px Dropzone minimum; owner reply "Sí, corregir la ficha (recomendado)").
- **Approval / recovery:** this file is the recoverable consolidated snapshot, approved 2026-11-20. The [v0.1 spec](../v0.1/spec.md), [v0.1.1 amendment](../v0.1.1/reset-amendment.md) and [v0.2 amendment](reset-key-amendment.md) stay as historical snapshots. Canonical issue #497; related #508 and #516.
- **Current situation / pending decisions:** AttachmentField is an exported `@egdev/ui` molecule. `resetKey` shipped in PR #519 (main 8c0037a) and is released with the next ui minor. No pending decisions.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: b719044db3eb3c807c62c51e2b68aa5cd294e135aa01960ab54df0a08e4f388d`; `visualHashes: VIS-01 0e7ffeafe59c8b33a784b3a795712d0f218c52d0747e9ed09959c33ea9f38408, VIS-02 9a2da051144184969fb9b5874240f1fb9c5501705d0637fd0e149b4fbb463ab4, VIS-03 c3acecc8415b00c72ea48fe66ca6ad7636b8404b1ccb5f2e18b90d165f1e26ce, VIS-04 c6c4382bb84af411d70b3029eacf344d842f10bbf97f09dea1d1d76af50d6fcb` (historical v0.1 implementation captures, Proposed, not approved expected design); `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/497`; `latestPublishedComment: Pending` (a v0.1 handoff comment is recorded in `odd/tasks/attachment-field-spec.md`, but its URL is not recorded here).
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from the `## 1. Purpose and scope` heading line through EOF, with LF line endings and the recorded final newline. All tracking metadata, including the changes, decisions and open-question sections below, stays above that heading and is excluded. Finalize before approval; approval must identify this version, digest and visual scope.

## Changes since v0.1

- [v0.1.1](../v0.1.1/reset-amendment.md): a qualifying external controlled `value` change clears rejections silently and removes their description; copied echoes and a filter back to the previous list retain feedback. AC-14a–d cover this behavior. The amendment's owner clarification explicitly retains the message for a filter back to the previous list.
- [v0.2](reset-key-amendment.md): optional `resetKey` clears transient feedback in both modes on a subsequent `Object.is` change, without clearing the list, remounting, moving focus or emitting callbacks. Qualifying external changes also empty the status; revised AC-14d supersedes the old assertion that status text stays. AC-27–31 cover the token. The v0.1 Q2-B note “Reset needs a `key` remount or a ref API” is superseded as a blanket statement: `resetKey` resets feedback, not the uncontrolled list. No ref or `asChild` API is added.
- All other v0.1 promises remain. The v0.2 change is an additive `@egdev/ui` minor; it adds no appearance, token or dependency change. The v0.1.1 amendment alone was a patch.

## Resolved decisions

The owner approved v0.1 decisions Q2 C (controlled and uncontrolled), Q3 A (images only), Q4 A (files win on a mixed clipboard), Q5a A (Dropzone remains enabled at the limit), Q5b A (focus next, previous, then Dropzone), Q6 B (`w-20`, 64 px), Q7 A (`sm` Remove with the documented touch limitation), and conventions C1–C4. The owner approved the v0.1.1 external-change rule and the clarification for a filter back to the previous list, then approved the v0.2 amendment and `transient-feedback-reset-key` convention. See the linked historical snapshots for the decisions and approvals; the consolidation itself is not approved.

## Corrections from v0.1 (owner-approved 2026-11-20)

Consolidation found two v0.1 statements that never matched the shipped component. The owner chose to correct the spec, not the code ("Sí, corregir la ficha (recomendado)"):

- **Native `onChange`:** v0.1 listed only `onPaste`, `defaultValue` and `children` as excluded native props. The shipped `AttachmentFieldProps` has always excluded `onChange` too, as recorded in `odd/tasks/attachment-field-build.md` L2. The API section now lists it.
- **Dropzone inline minimum:** v0.1 promised at least 56 px via `min-h-14`. `min-h-14` maps to `--space-14` (44.8 px), and the rendered Dropzone measures 44.8 px in Chrome 157. That is still above the 44 px touch minimum. The accessibility section now states 44.8 px.

## 1. Purpose and scope

- **Need / non-goals:** let a form attach images by pasting (Ctrl+V of a screenshot) while focus stays in the consumer's `Textarea`, or by dropping/picking them through the existing Dropzone, with configurable type, size and count validation, visible and announced errors, and a removable thumbnail strip with an accessible name per item (issue #497, Recado). Non-goals: upload transport or progress, storage, form file participation (`name`/`required`), document-wide or field-wide drop and paste, image editing or cropping, deduplication, reordering, non-image files (owner decision Q3), and owning or labelling the consumer's `Textarea` (that belongs to `Field`). A consumer can reset transient feedback after saving, including when it uses its own handlers without a form.
- **Cataloging decision / alternatives:** **compose** (approved). Dropzone alone has focus-scoped paste, no validation and no preview strip; a Dropzone variant adding those responsibilities would contradict its contract. Nothing needs extracting and no new component primitive is needed. Compose Dropzone (unchanged), PhotoFrame, IconButton, FieldMessage, Cluster, Stack and VisuallyHidden. Radix base: none for behavior; `@radix-ui/react-visually-hidden` is already a dependency of the VisuallyHidden primitive. No new dependencies.
- **Evidence / level and package:** `packages/ui/src/index.ts` exports AttachmentField and the composed public components. Dropzone's `onFiles` delivers files while `accept` is picker-only; PhotoFrame requires `src` and `alt`; IconButton requires `label` and `icon`; FieldMessage is not a live region. The polite-status precedent is `packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx`. AttachmentField is a molecule because it coordinates intake, validation and list state with atoms and layout primitives; package `@egdev/ui`, folder `packages/ui/src/molecules/attachment-field/`. The base implementation and historical checks are recorded in [v0.1 implementation](../v0.1/implementation.md); the v0.2 contract is not proof of the PR's implementation or verification.

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Root | Paste scope (React `onPaste` bubbling), layout, public marker | `Stack` (`div`), `gap={2}`, marker `eg-attachment-field` | consumer `children`, then strip, Dropzone, messages, status |
| Control slot | The consumer's control(s), usually `Field` wrapping `Textarea` | consumer elements | any ReactNode; paste from any descendant is handled |
| Strip | Named list of attachments; rendered only when there is at least one item | `Cluster asChild` on `ul`, `gap={2}`, named by `label` | one `li` per file |
| Item | One attachment | `li` | thumbnail + Remove button |
| Thumbnail | Decorative-sized preview of the object URL | `PhotoFrame` (`ratio='square'`, `variant='default'`) | `img` with `alt` = item label |
| Remove button | Remove the item | `IconButton` (`variant='outline'`, `size='sm'`, `Icon name='close'`) | hidden text from `removeItem` |
| Dropzone | Drop and pick entry point, unchanged | `Dropzone variant='inline'` | upload icon and label |
| Rejection messages | Visible per-rule errors | one `FieldMessage tone='error'` per broken rule | plain text |
| Status | Polite announcements | `VisuallyHidden role='status' aria-live='polite'` | announcement text |

- **Radix / composition:** none for behavior; no public `asChild` or ref. Reused components keep their own contracts. DOM order: `children` → strip → Dropzone → messages → status.
- **Public markers:** root `eg-attachment-field` is stable. Reused markers (`eg-photo`, `eg-icon-btn`, `eg-dropzone`, `eg-field-message`, `eg-cluster`, `eg-stack`, `eg-visually-hidden`) remain those of their components; no new part markers are promised.

## 3. Public API

- **Prop conventions:** [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), [lookup workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Lookup covered meanings, names and aliases. Approved reused entries: `label` → `accessible-name`, `value` → `primary-value`, `defaultValue` → `initial-uncontrolled-value`, `onValueChange` → `interactive-value-change`, and `messages` → `localized-messages`. `removeItem` is a formatter in that dictionary, not a top-level prop.
- Approved v0.1 entries: `acceptedTypes` → `accepted-file-types`, `maxFileBytes` → `max-file-bytes`, `maxFiles` → `max-file-count`, and `onFilesRejected` → `files-rejected`. Their separate [approval record](../../../decisions/prop-naming-attachment-field-approval.json) and registry entries bind their exact meanings and scopes. `accept` was not reused because Dropzone's picker filter does not itself reject files; `files-received` / `onFiles` avoids validation feedback. `indicator-count-cap`, `character-counter` and `viewport-max-height` describe display thresholds, text length and viewport height, not these limits. `collection-items` is render data rather than the edited list; `dismiss-label` is not a per-item destructive action.
- Approved v0.2 convention: `resetKey` → **`transient-feedback-reset-key`**, optional `string | number`. It is a consumer token for declaratively clearing component-defined transient feedback, not the list, a React identity key or a callback; use it without remounting. The owner approved the convention as a separate scope together with the v0.2 amendment on 2026-11-20 ([amendment](reset-key-amendment.md), `odd/tasks/attachment-field-reset-key.md` L2); `aliases: []`, `exceptions: []`. On this branch it is not yet in the registry. `committed-value-change` / `onValueCommit` is an outgoing notification, `search-query-change` / `onQueryChange` avoids programmatic resets, and `initial-uncontrolled-sort` / `defaultSort` excludes resets; none describes this token. `primary-value` and `initial-uncontrolled-value` describe the list, not its feedback reset.
- The nine existing AttachmentField naming usages point at `packages/ui/src/molecules/attachment-field/types.ts`, symbol `AttachmentFieldProps`, revision `sha256:344b1b447c3d07fd0d0c3cc52d94373d4ba392d36b2942045bda584af509c75f` on this branch. The future `resetKey` usage and any changed source revision must be reviewed and recorded after implementation, not invented here. `disabled` uses the native-attribute meaning; no convention or exception is proposed.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | yes | — | Accessible name of the attachment list (for example “Attachments”); the list renders only when nonempty. |
| `value` | `File[]` | no (controlled) | — | Controlled attachments; requires `onValueChange`. |
| `defaultValue` | `File[]` | no (uncontrolled) | `[]` | Initial uncontrolled attachments, read once; never combined with `value`. |
| `onValueChange` | `(files: File[]) => void` | required with `value`, otherwise no | — | Called with the next full list after a user add or remove; in controlled mode it is a request. |
| `acceptedTypes` | `` readonly `image/${string}`[] `` | no | any `image/*` | Allowed MIME types, exact (`image/png`) or subtype wildcard (`image/*`), case-insensitive. Empty file type is rejected. Also drives the Dropzone picker filter, joined with commas; omitted or empty means `image/*`. |
| `maxFileBytes` | `number` | no | no limit | Largest allowed per-file size in bytes; exactly this size is accepted. Non-finite or non-positive values are ignored. |
| `maxFiles` | `number` | no | no limit | Largest attachment count, including the current list. Non-integer, non-finite or `< 1` values are ignored. |
| `onFilesRejected` | `(rejections: AttachmentRejection[]) => void` | no | none | Called once per intake that rejects at least one file, after `onValueChange` when the latter is called. |
| `resetKey` | `string \| number` | no | omitted; initial value inert | In either mode, a subsequent token change by `Object.is` silently clears rejections and status only; it never resets the list. |
| `messages` | `Partial<AttachmentFieldMessages>` | no | English defaults below | Localizable built-in text and formatters. |
| `disabled` | `boolean` | no | `false` | Disables Dropzone and Remove buttons, and ignores paste. The strip stays visible. |
| `children` | `ReactNode` | no | none | The consumer's control(s); paste from any descendant is handled. |

```ts
type AttachmentRejectionReason = 'type' | 'size' | 'count';
type AttachmentRejection = { file: File; reason: AttachmentRejectionReason };
type AttachmentItemInfo = { file: File; position: number; typeLabel: string; sizeLabel: string };
type AttachmentFieldMessages = {
  itemLabel: (item: AttachmentItemInfo) => string;        // default: `Attachment ${position}, ${typeLabel}, ${sizeLabel}`
  removeItem: (itemLabel: string) => string;              // default: `Remove ${itemLabel}`
  added: (count: number) => string;                       // default: 'Attachment added' | `${count} attachments added`
  removed: (itemLabel: string) => string;                 // default: `${itemLabel} removed`
  rejectedType: (files: File[], acceptedTypes: readonly string[]) => string;
  rejectedSize: (files: File[], maxFileBytes: number) => string;
  rejectedCount: (files: File[], maxFiles: number) => string;
  formatSize: (bytes: number) => string;                  // 1024-based, 'B' | 'KB' | 'MB', e.g. '240 KB'
  dropzoneLabel: string;                                  // omitted: Dropzone default 'Drag, paste or upload'
  dropzoneDropLabel: string;                              // omitted: Dropzone default 'Drop here'
};
```

- `typeLabel` is the uppercased MIME subtype without a `+xml` suffix (`image/png` → `PNG`, `image/svg+xml` → `SVG`). Item identity is the `File` reference; `position` is the 1-based current index, so labels renumber after removal. The exported types are `AttachmentFieldProps`, `AttachmentFieldMessages`, `AttachmentItemInfo`, `AttachmentRejection` and `AttachmentRejectionReason`.
- Default rejection texts name the rule and file or count. For one file: `${name} was not added: only ${types} files are allowed.`, `${name} was not added: it is larger than ${formatSize(maxFileBytes)}.`, and `${name} was not added: at most ${maxFiles} ${maxFiles === 1 ? 'attachment is' : 'attachments are'} allowed.` For several files, the subject is `${count} files were not added`; size continues `: each must be ${formatSize(maxFileBytes)} or smaller.`, while type and count use the same rule suffixes. Types are joined with `, `, and `image/*` is described as `image`. An empty file name is `Image`. Partial `messages` entries override defaults individually. `formatSize` uses bytes below 1024, rounded KB below 1 MiB (a rounded 1024 KB displays as 1 MB), and MB to at most one decimal with trailing `.0` removed. The approved [v0.1 plan](../v0.1/implementation-plan.md#24-default-message-strings-fixed-here-as-the-spec-delegates-them-to-the-plan) fixed the defaults; the singular/plural correction is recorded in `odd/tasks/attachment-field-build.md` L2–L3.
- **Native props / refs:** inherits `ComponentPropsWithoutRef<'div'>` minus `onPaste` (owned by the hook; the consumer may put its own `onPaste` on the Textarea, where it runs first and can opt out with `preventDefault()`), `defaultValue` (replaced by the typed own prop), `children` (retyped) and `onChange` (a native change handler on the root would compete with the field's own change handling); `...rest` reaches the root. Correction from v0.1, which omitted `onChange` from this list although the shipped API has always excluded it. No Dropzone, IconButton or PhotoFrame props are exposed beyond those above. Dropzone is fixed to `variant='inline'`; a future variant would be additive. No ref, no `asChild`.
- **Controlled / uncontrolled (owner decision Q2):** controlled when `value` is defined; `onValueChange` is required and the list changes only when the parent passes a new `value`. Uncontrolled starts from `defaultValue` (read once) and notifies through `onValueChange`. Controlled validation applies to user intake only: a `value` with non-image files or more than `maxFiles` entries renders as given, with no error. `resetKey` is a feedback signal in both modes, not a way to set or clear either list.
- **Compatibility:** `AttachmentField` and the five types are exported from `packages/ui/src/index.ts`; Dropzone, PhotoFrame, IconButton, FieldMessage and existing APIs remain unchanged. React peer `^18.3.1 || ^19.3.0`: the design uses React 18-compatible state, effects, `useId` and synthetic events. The [v0.1 implementation record](../v0.1/implementation.md#automated-checks-observed) reports packed consumer checks for React 18.3.1 and 19.3.0; it does not verify the v0.2 addition.

## 4. Behavior

Intake (paste, drop or pick) goes through one pipeline. For each file, in clipboard/selection order, the first failing rule wins: **type** (not in `acceptedTypes`, or empty type), then **size** (`file.size > maxFileBytes`), then **count** (no capacity left: `maxFiles − current list length − files already accepted in this intake`). Accepted files are appended in order; `onValueChange` is called once with the next list when at least one file was accepted; `onFilesRejected` is then called once when at least one was rejected. A selection with no files changes nothing and announces nothing.

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Paste with at least one accepted file, focus in the consumer's Textarea (or any descendant of the root) | Files attach, `preventDefault()` is called, **focus does not move**, text/HTML flavors are discarded (Q4) | `onValueChange(next)`; `onFilesRejected` if some were rejected |
| Paste of text only (no clipboard files) | Ignored: no `preventDefault()`, text goes into the Textarea | none |
| Paste where every clipboard file is rejected | Rejection errors are shown and announced; **no `preventDefault()`** (the default paste proceeds) | `onFilesRejected` |
| Paste outside the root | Not handled; there is no `document`/`window` listener | none |
| Paste whose default is already prevented by a descendant (for example focused Dropzone, or a consumer opt-out) | Ignored by the root, so a focused-Dropzone paste is processed once, not twice | none from the root |
| Paste while the Dropzone button itself has focus | Dropzone's approved rule applies (default prevented when files are present); its files enter the pipeline once | as for intake |
| Files dropped on or picked through the Dropzone | Same pipeline; focus stays where it was (Dropzone unchanged) | as for intake |
| File of a disallowed or empty type | Rejected with reason `type` | `onFilesRejected` |
| File larger than `maxFileBytes` (exactly equal is accepted) | Rejected with reason `size` | `onFilesRejected` |
| More files than remaining capacity | First files that fit are accepted; rest are rejected with reason `count` | `onValueChange`, `onFilesRejected` |
| Intake with rejections | One visible `FieldMessage tone='error'` per distinct broken rule, in order type → size → count, replacing previous messages; Dropzone gets `aria-describedby` to them | none beyond intake callbacks |
| Next intake, or any removal | Previous rejection messages clear, then are replaced if the new intake rejects | none beyond intake/removal callbacks |
| Intake with at least one accepted or rejected file | One polite announcement: `added` text, then each rejection text | none beyond intake callbacks |
| Remove button activated (click, Enter or Space) | Item leaves the list; `removed` is announced; focus moves per section 5 | `onValueChange(next)` |
| Qualifying external controlled `value` change | Rejection messages and status text clear silently; Dropzone loses rejection `aria-describedby`; list follows the parent's `value`. Clearing itself does not move focus or change removal focus intent; a concurrent removal follows the existing focus rule | none for clearing |
| Mount with any `resetKey`, including omission | Initial token is inert | none |
| Subsequent `resetKey` change for which `Object.is(previous, current)` is false | Rejections and status text clear silently; rejection `aria-describedby` is removed. Both lists, root/field, Textarea and status node identities, focus and removal focus intent stay unchanged; no new live-region text | neither `onValueChange` nor `onFilesRejected` |
| Unchanged `resetKey`, including typing re-renders or `NaN` → `NaN` | Feedback stays unless an independent intake, removal or qualifying external change applies | none for unchanged token |
| `resetKey` omitted → supplied, supplied → omitted, or `+0` → `-0` after mount | Each is a token change and clears feedback as above | none |
| Object URL lifecycle | Created once per file when it first appears in the list; revoked when it leaves (removal or controlled change) and for every remaining file on unmount; thumbnail renders once its URL exists | none |
| `disabled` | Dropzone disabled, Remove buttons disabled, paste ignored (no `preventDefault()`, callbacks or announcements); the strip remains | none |
| `maxFiles` reached | Dropzone stays rendered and enabled; an extra file produces the `count` rejection (Q5a) | `onFilesRejected` |
| Controlled with an unchanged `value` after a request | List unchanged; focus intent from a removal is discarded | the request was emitted |
| Reduced motion | Component adds no transition or animation of its own (section 6) | none |

- **External-change detection:** controlled only. Keep the last list passed to `onValueChange` as `requested`. A render is external when `value` is defined and differs entry by entry, by length and `File` reference, from both `requested` and the previous render's `value`. A copied array containing the same references as the requested list is an echo, not external; mixed-intake feedback stays. A filtered or transformed list clears feedback only if it also differs from the previous value. In particular, filtering a request back to exactly the previous list keeps the message; passing a new `[]` when the previous value was already `[]` is not an external change. Reset to `[]` from a different list, replacement with other files, and other qualifying changes clear. Rejected-only intake makes no list request and keeps its rejection feedback. Uncontrolled internal changes do not qualify as external.
- **Reset use:** bump `resetKey` after save, even when the controlled list is already empty; ordinary typing should leave it unchanged. The token clears transient feedback only. Clearing inserts no announcement text; actual assistive-technology silence needs manual verification. Existing intake, removal and external-change rules continue to apply independently.
- **States / representation:** no own `data-state`. Disabled is exposed as `data-disabled` (empty string) on the root, like IconButton, styled by the composed atoms' native disabled handling. Radix/ARIA attributes are those of the composed atoms. No state is mirrored into classes.
- **Limits / consumer responsibilities:** paste scope is the root's subtree, so “anywhere in the containing form” requires its fields as `children`; outside controls are not handled. Consumers own the Textarea, its label (`Field`), uploading and storage, deduplication (none is done), any non-image or oversized controlled `value`, and mirroring rejections elsewhere (`onFilesRejected`). A consumer `onPaste` calling `stopPropagation()` prevents the root seeing the event. Repeated identical announcement strings may not be re-announced by every screen reader; default texts include file names or counts to reduce this, but real screen-reader behavior remains Not evaluated.

## 5. Accessibility

- **Accessible name / roles / relationships:** the strip is a native `ul` named by `label`; each `li` contains a thumbnail `img` with the item label as `alt` (default “Attachment 1, PNG, 240 KB”; Recado can pass “Screenshot 1, PNG, 240 KB”) and a native button named by `removeItem(itemLabel)` (visually hidden text from IconButton). Dropzone keeps its native button name. Root has no role. Visible errors are `p` elements with `useId()` ids referenced by the Dropzone button's `aria-describedby`; no control receives `aria-invalid` because the component does not own the Textarea. When feedback clears, those descriptions are removed.
- **Keyboard / focus:** Tab order is consumer controls → each Remove button → Dropzone; Enter/Space activate Remove and Dropzone. Paste, drop and pick never move focus. After removal, focus moves to the Remove button now at the same position (next), else the previous Remove, else the Dropzone when empty (Q5). In controlled mode this happens only if the next render no longer contains the removed file; otherwise the intent is dropped. Neither external feedback clearing nor a token reset itself moves focus or changes the existing removal intent; a concurrent removal still follows the existing focus rule. No focus trap or roving tabindex.
- **Announcements / other conditions:** one always-mounted `VisuallyHidden role='status' aria-live='polite'` announces additions, rejections and removals; visible `FieldMessage` is not live, so nothing is announced twice. A token reset or qualifying external controlled change empties the existing status without inserting new announcement text; actual spoken silence is Not evaluated until checked with a screen reader. Errors are not color-only: the error tone adds a decorative glyph and the text names the rule. Dropzone inline row is at least 44.8 px high (`min-h-14`, `--space-14`; measured 44.8 px in Chrome 157), above the 44 px touch minimum — correction from v0.1, which stated 56 px; Remove (`IconButton` `sm`, 25.6 px) is **below** the 44 px touch minimum, a documented limitation (Q7). The consumer guarantees the Textarea's label and any wider announcements.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| none | — | — | No variant axis. Composed atoms use fixed treatments: Dropzone `inline`, PhotoFrame `default` + `square`, IconButton `outline` + `sm`. |

- **Tokens / Material:** no paint of its own. Material comes from the composed components: PhotoFrame's Surface well (`surfaceVariants`), IconButton `outline` (elevated, round, opaque over the image), the approved Dropzone dashed transparent recipe and FieldMessage error tone. Token-backed layout: root `Stack gap={2}`; strip `Cluster gap={2}`; thumbnail `w-20` (64 px, `--space-20`, Q6); item `relative`; Remove `absolute top-1 end-1` (logical, RTL-safe). Focus, hover, disabled (`.45` opacity) and `motion-reduce:` handling are inherited. No own transition, animation, shadow, gradient or color; no own reduced-motion or reduced-transparency surface. No hardcoded values or new token.
- **Dynamic geometry:** Not applicable. No inline style and no interpolated class strings.
- **Class composition / consumer layout:** root `className` supports outer layout only (grid placement, margin, width), merged last with `cn()`; appearance overrides are unsupported and `twMerge` does not resolve arbitrary CSS selectors. No per-part `className` is exposed. Check that the layout class is kept with the root recipe and no own `style` is added.
- **Files / pending proposals:** `types.ts` (props, exported message types and CVA recipes); `useAttachmentField.ts` (intake, validation, list, paste, URLs, rejection and status state, reset signal, focus and defaults); `AttachmentField.tsx` (JSX); `AttachmentField.test.tsx`; `AttachmentField.stories.tsx` (`Molecules/AttachmentField`, callback actions and a Textarea in Field); `index.ts`. **No stylesheet**: utilities express everything. **No internal modules.** No tokens or dependencies added.

### Expected-design visual reference

The original Recado artboard was not available to this repository. The owner authorized capturing the implemented stories as **Proposed**, not approved expected design; no new v0.2 appearance is proposed. The historical v0.1 component-zone captures are preserved in place and are not fresh v0.2 captures. See the [implementation record](../v0.1/implementation.md#captures-proposed-references) for provenance and hash prefixes; the full file hashes are in snapshot identity above.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | [Empty field with Textarea and inline Dropzone](../v0.1/vis-01-empty.png) | empty list | `Molecules/AttachmentField` Default, implementation capture v0.1 | Proposed; not approved expected design for v0.2 |
| VIS-02 | [Three square thumbnails with corner Remove buttons](../v0.1/vis-02-thumbnails.png) | three items | WithAttachments, implementation capture v0.1 | Proposed; not approved expected design for v0.2 |
| VIS-03 | [Visible type and size rejection messages](../v0.1/vis-03-rejection.png) | rejected files | Validation, implementation capture v0.1 | Proposed; not approved expected design for v0.2 |
| VIS-04 | [Disabled field with a populated strip](../v0.1/vis-04-disabled.png) | `disabled` | Disabled, implementation capture v0.1 | Proposed; not approved expected design for v0.2 |

- **Conditions / provenance:** Chrome 157 on Windows, Playwright element screenshot of `.eg-attachment-field`, 480 px viewport, device scale 1, dark theme, default motion, 2026-11-19. Loaded fonts and transparency preference are not recorded. The captures are implementation observations, not an authorized substitute for the unavailable artboard.
- **Intent / acceptance / pending evidence:** a wrapping row of square Material-framed thumbnails with round corner controls; quiet dashed Dropzone row; errors with text and glyph. Related criteria: AC-16, AC-09, AC-22, AC-26. Missing: approved expected-design source, matching conditions and owner approval. Tokens are never inferred from pixels. Visual conformity is **Not evaluated**; captures do not replace behavior or accessibility tests.

## 7. Acceptance criteria

Primary test source: [`packages/ui/src/molecules/attachment-field/AttachmentField.test.tsx`](../../../../packages/ui/src/molecules/attachment-field/AttachmentField.test.tsx) (Vitest, Testing Library, `userEvent`; object URLs stubbed). Stories: `AttachmentField.stories.tsx`. **Historical base suite** means the [v0.1 implementation record](../v0.1/implementation.md#automated-checks-observed) reports 339/339 for AttachmentField plus Storybook controls; it is not a new run and predates v0.1.1 and v0.2. Browser observations are from that same record. A test existing in source is not a recorded passing run. The [v0.2 plan](implementation-plan.md#2-red-first-acceptance-matrix) describes planned token and revised AC-14d checks; no PR #519 result is asserted here.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Root keeps `eg-attachment-field`, renders children, merges consumer layout `className` last, sets no own inline style; no ref or `asChild` API | render/class assertions; packed type negatives | Default; VIS-01 | Historical base suite; v0.2 recheck pending |
| AC-02 | Empty list: no `ul`, default-named Dropzone button, status region present and empty | role/name queries | Default; VIS-01 | Historical base suite |
| AC-03 | Accepted image pasted in Textarea calls `onValueChange` with appended `File`, is default-prevented and retains Textarea focus | paste with `clipboardData.files` | WithTextarea | Historical base suite; trusted OS paste Not evaluated |
| AC-04 | Text-only paste has no callback, is not default-prevented and enters Textarea | `userEvent.paste` with text | WithTextarea | Historical base suite; trusted OS paste Not evaluated |
| AC-05 | Mixed image + text/HTML clipboard: files win and default is prevented | paste with files and text flavors | Not applicable: behavioral case | Historical base suite; synthetic browser event passed |
| AC-06 | No `document`/`window` paste listener; paste outside the root attaches nothing | listener spies and outside input | Not applicable: behavioral case | Historical base suite |
| AC-07 | Descendant-prevented paste is ignored by root; focused-Dropzone paste is processed once | focused Dropzone and consumer opt-out | Not applicable: behavioral case | Historical base suite |
| AC-08 | Drop and pick use the same validation; picker `accept` is joined `acceptedTypes` (or `image/*` by default) | upload, drop and attribute assertions | Default | Historical base suite; browser `setInputFiles` passed, real chooser Not evaluated |
| AC-09 | Disallowed or empty type yields visible type error and `{ file, reason: 'type' }`; list unchanged | rejection and callback assertions | Validation; VIS-03 | Historical base suite; browser type rejection observed |
| AC-10 | Exactly `maxFileBytes` is accepted; one byte more is rejected with `size` | boundary tests | Validation; VIS-03 | Historical base suite; browser size rejection observed |
| AC-11 | Capacity includes current list; first files that fit are accepted in order, rest rejected with `count` | preloaded list and multi-file intake | Validation; VIS-03 | Historical base suite |
| AC-12 | Multiple broken rules produce one error per rule in type → size → count order; a file breaking two appears only under the first | multi-rule test | Validation; VIS-03 | Historical base suite; browser type/size order observed |
| AC-13 | Invalid limits (`0`, negative, `NaN`, non-integer `maxFiles`, non-finite values) are ignored | parameterized tests | Not applicable: input boundaries | Historical base suite |
| AC-14 | Rejections clear at next intake and any removal, replaced if the intake rejects | sequence tests, description assertions | Validation | Historical base suite; v0.2 preservation pending |
| AC-14a | A qualifying parent reset to `[]` after rejection clears messages and `aria-describedby`; Textarea focus stays | controlled reset from a nonempty previous list | Controlled | v0.1.1 test exists; no run recorded here; v0.2 preservation pending |
| AC-14b | A mixed-intake echo keeps the message with the same array or a copy; filtering back to the previous list also keeps it | controlled echo/copy and filter-to-previous harnesses | Not applicable: controlled behavior | v0.1.1 tests exist; no run recorded here; v0.2 preservation pending |
| AC-14c | Replacement with other files, or a filtered/transformed request that differs from both previous and requested lists, clears feedback | controlled rerender and filter harness | Not applicable: controlled behavior | v0.1.1 tests exist; no run recorded here; v0.2 preservation pending |
| AC-14d | A qualifying external controlled clear empties the status without announcing; preserve AC-14, AC-14a–c and uncontrolled behavior without a token change | status text and node assertions; no inserted text; preservation tests; manual screen-reader check | Controlled | **Revised:** existing v0.1.1 test asserts the superseded retained status text; v0.2 proof pending, spoken silence Not evaluated |
| AC-15 | Always-mounted polite status receives one announcement per intake (added then rejections) and removal; visible errors are not live | status text and live-region assertions | Validation | Historical base suite; repeated speech Not evaluated |
| AC-16 | `ul` named by `label`; per-item image and Remove names use formatters, defaults and overrides including `formatSize` | role/name queries | WithAttachments; VIS-02 | Historical base suite |
| AC-17 | Object URLs created once per file, revoked on removal, controlled change and unmount; no unmatched creation after unmount including StrictMode; a shown URL is never revoked | URL spies and StrictMode render | Not applicable: lifecycle | Historical base suite |
| AC-18 | Remove by click, Enter or Space emits list without file; Tab order Textarea → Remove buttons → Dropzone | keyboard and tab tests | WithAttachments | Historical base suite; browser Enter/Space removal observed |
| AC-19 | Removal focus: next, else previous, else Dropzone; unapplied controlled request keeps focus | focus assertions, both modes | WithAttachments | Historical base suite; browser next/previous/Dropzone observed |
| AC-20 | Controlled list changes only with parent value; `defaultValue` read once; `onValueChange` fires in both modes | controlled/uncontrolled tests | Controlled, Uncontrolled | Historical base suite |
| AC-21 | At `maxFiles`, Dropzone remains rendered and enabled; extra file gives visible count rejection | render and intake test | AtLimit | Historical base suite |
| AC-22 | `disabled` disables Dropzone and Remove, ignores paste without preventing it, callbacks or announcements, keeps strip and sets `data-disabled` | render and event tests | Disabled; VIS-04 | Historical base suite; browser disabled state observed |
| AC-23 | No own transition or animation utility; composed atoms keep their `motion-reduce:` handling | class assertions and reduced-motion browser check | Default under reduced motion | Historical base suite; browser own parts showed no animation and 0s transition |
| AC-24 | Public exports and five types are available; own props have English JSDoc and valid `@control`; controlled/uncontrolled union type-checks | typecheck, Storybook metadata/controls, registry and packed export/consumer checks | Controls panel | v0.1 typecheck, docgen, registry and React 18/19 packed checks recorded; `resetKey` row and v0.2 checks pending; browser widgets Not evaluated |
| AC-25 | Strip and message layout stays inside root and wraps with five 64 px thumbnails plus gaps in a narrow panel | compact-width browser check | ManyItems; VIS-02 | Browser observed five thumbnails wrap without overflow at 320 px; message-layout portion not separately recorded |
| AC-26 | Remove touch target and contrast over images are verified; below-44 px limitation is documented | pointer-coarse and light/dark contrast checks | WithAttachments; VIS-02 | Browser measured 25.6 × 25.6 px and documented limitation; contrast and real touch hardware Not evaluated |
| AC-27 | Controlled `[]` → rejected paste → save with `[]` and bumped token clears messages, `aria-describedby` and status; no reset callbacks | controlled harness; compare callback counts before and after reset | Controlled | Pending v0.2 verification |
| AC-28 | Typing and unchanged-token rerenders preserve rejection and status; `NaN` → `NaN` also preserves them | rerender/typing and `NaN` cases, assert description and status | Controlled | Pending v0.2 verification |
| AC-29 | Initial token is inert; omitted → supplied, supplied → omitted and `+0` → `-0` later clear feedback | mount and transition cases | Controlled | Pending v0.2 verification |
| AC-30 | Both modes retain field/root, Textarea and status node identities and Textarea focus; no new live-region text | DOM identity, focus and mutation checks in both modes; manual screen-reader check | Controlled, Uncontrolled | Pending v0.2 verification; spoken silence Not evaluated |
| AC-31 | Populated lists in both modes retain all items and emit no list-change callback on token reset | controlled/uncontrolled list and callback assertions | Controlled, Uncontrolled | Pending v0.2 verification |

### Spec closure

- [ ] Seven blocks are present; the `onChange` and inline-minimum discrepancies above need decisions without silently changing v0.1 promises.
- [x] New/changed own props have lookup evidence, exact applied IDs and separate convention approval references; future `resetKey` usage evidence is pending implementation.
- [x] Historical observations, planned checks and unverified v0.2 behavior are distinguished; each acceptance promise has a method.
- [ ] VIS-01–04 are historical Proposed captures, not approved expected design; comparable visual conformity remains Not evaluated.
- [ ] Finalize the payload digest and obtain human approval scoped to this exact consolidated version and visual scope.
- [ ] Retain canonical issue #497; any later-version comment requires separate authorization, a recoverable full snapshot, reason, compatibility impact and previous-comment link.

**Next step:** resolve the recorded discrepancies and seek approval of this exact consolidation; neither this draft nor the earlier amendment approval authorizes further code, token/dependency changes or external writes. The v0.2 implementation plan has its own separate owner approval.
