# Component contract — AttachmentField

- **Version / status:** v0.1 — **Approved — 2026-11-19** by the owner (reply "Acepto todas las recomendaciones": every recommended option in Q2–Q7 and conventions C1–C4).
- **Approval / recovery:** approved by the owner on 2026-11-19 in conversation (after the cataloging decision "Sí, va a @egdev/ui", Engram `catalog/497-attachment-field`; ODD log in `odd/tasks/attachment-field-spec.md`). Recoverable snapshot: this file; canonical issue #497 (handoff comment pending).
- **Current situation / pending decisions:** new component, nothing implemented. All owner decisions are resolved (see "Owner decisions"). Approval covers this spec only, not the implementation plan, which needs separate approval.
- **Snapshot identity:** `version: v0.1`; `contentSHA256: 47db068c2d055ad342efb895e513db27a258ddef661ee134d4ff42248f5aa7ad`; `visualHashes: VIS-01 Pending capture, VIS-02 Pending capture, VIS-03 Pending capture, VIS-04 Pending capture`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/497`; `latestPublishedComment: Pending (the initial issue body is not a comment)`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, with LF line endings and the recorded final newline. All tracking metadata, including the open-decisions section below, stays above that heading and is excluded. When the owner resolves the decisions, the chosen options are folded into sections 1–7 (inside the hashed payload) and this section is replaced by a short “Resolved decisions” record before the digest is computed.

## Owner decisions (resolved 2026-11-19)

The owner accepted every recommendation: **Q2 C** (controlled and uncontrolled), **Q3 A** (images only), **Q4 A** (files win on a mixed clipboard), **Q5a A** (Dropzone stays enabled at the maximum) and **Q5b A** (focus to the next, else previous Remove button, else the Dropzone), **Q6 B** (`w-20`, 64px), **Q7 A** (IconButton `sm` with the documented touch-target limitation), and conventions **C1–C4** approved. The options below are kept as the decision record.

### Q2 — Controlled vs uncontrolled attachment list

The list holds `File` objects the consumer must eventually read (Recado stores them in recado #15) and clear after saving a note.

| Option | Shape | Consequence |
| --- | --- | --- |
| A. Controlled only | `value: File[]` + required `onValueChange` | Smallest surface and tests. Reset after submit is trivial. Every simple use (stories, quick forms) needs its own `useState`. |
| B. Uncontrolled only | internal list + `onValueChange` notification | Reset needs a `key` remount or a ref API; the consumer cannot reconcile with its own store. |
| **C. Both (recommended)** | `value` / `defaultValue` / `onValueChange` | Matches the registry pairing used by Select, Tabs, Slider, RadioGroup, ChipGroup, SelectTile, Carousel and Table (each appears under both `initial-uncontrolled-value` and `interactive-value-change`). One more code path and its tests. |

**Recommendation: C.** Recado needs the controlled path (clear after save); the uncontrolled path is what every other interactive molecule in the system offers and keeps stories and simple forms one-liners. Cost is moderate: a discriminated props union and about three extra tests. If the owner prefers the smallest scope, A is a safe subset that C can grow into additively.

### Q3 — Images only vs any file

| Option | Shape | Consequence |
| --- | --- | --- |
| **A. Images only (recommended)** | `acceptedTypes` typed `image/${string}`; every item is a PhotoFrame thumbnail | Matches issue #497 (non-image files out of scope unless the design system generalizes) and the evidence: PhotoFrame requires `src` + `alt`, so there is no non-image preview. Smallest surface. |
| B. Any file | `acceptedTypes: string[]`; non-image items render a generic file tile | Needs a new item appearance (tile, glyph, Material recipe) with no design reference, and a different accessible-name story. Larger spec and tests. |
| C. Images now, widen later | Same as A, documented as additive | Widening `image/${string}` to `string` and adding a tile is non-breaking, so A already keeps the door open. This is a wording of A, not a separate API. |

**Recommendation: A.** It satisfies #497 without inventing a non-image appearance. The name `AttachmentField` stays valid if B is added in a later, separately approved version.

### Q4 — Mixed clipboard (image + text/HTML)

Real sources that put several flavors on the clipboard: “Copy image” in a browser (HTML + PNG), Word, and Excel cells (text + HTML + PNG). Plain screenshots (Snipping Tool, macOS) carry only the image.

| Option | Rule | Consequence |
| --- | --- | --- |
| **A. Files win (recommended)** | If at least one clipboard file is **added**, call `preventDefault()`, attach the files, discard the text/HTML flavors. | Predictable, one sentence, identical to the approved Dropzone paste rule (#56 D8: files present ⇒ default prevented). Cost: copying an Excel range pastes a picture and drops the text. |
| B. Text wins | If `text/plain` is non-empty, leave the whole paste to the target (no attach). | Excel pastes as text. But a source that adds a text flavor to a screenshot silently attaches nothing, and the user gets no feedback. |
| C. Both | Attach the files and let the text through (no `preventDefault()`). | Nothing is lost, but one paste produces two effects (a picture plus an HTML dump in the Textarea). |

**Recommendation: A.** It is the only option that is both predictable and consistent with Dropzone, and the failing case (rich Office content into a screenshot-capture form) is rare. A rejected-only paste (no file added) is never prevented under any option, so ordinary text paste is always untouched.

### Q5 — Focus after removal, and Dropzone at the maximum count

**Q5a — Dropzone when the list is full (`maxFiles` reached):**

| Option | Consequence |
| --- | --- |
| **A. Keep rendered and enabled (recommended)** | No focus loss when the last accepted file arrives from a focused Dropzone, no layout jump, one rule path: extra files get the visible “count” rejection. `disabled` stays reserved for the whole field. |
| B. Hide the Dropzone | Compact, but a focused Dropzone vanishes when the final file arrives (focus is lost) and needs extra focus management; the focus target after removal changes. |
| C. Render it natively `disabled` | Browsers differ on a focused button that becomes disabled; users get no explanation unless a message is added. |

**Q5b — Focus after removing an item:**

| Option | Consequence |
| --- | --- |
| **A. Next item's Remove button; else previous; after the last item, the Dropzone button (recommended)** | Predictable, entirely inside the component, and consistent with Q5a-A (the Dropzone is always there). |
| B. After the last item, the consumer's Textarea | The component does not own the Textarea; it would need a new ref/selector prop. |
| C. Do not manage focus | Focus falls to `body`: unacceptable for keyboard users (#497 requires “a predictable place”). |

**Recommendation: Q5a-A and Q5b-A.** If the owner picks Q5a-B or C, the “last item” focus target must be re-decided (the Dropzone may not be focusable).

### Q6 — Thumbnail size token mapping

PhotoFrame reserves its ratio from the figure width (`ratio='square'`); the thumbnail width is a layout utility on the figure. Recado's artboard (private) gives no size to map. Existing spacing steps (`@egdev/tokens`, `--space-*`, 1 step = 3.2 px):

| Option | Utility / token | Size |
| --- | --- | --- |
| A. `w-14` | `--space-14` | 44.8 px |
| **B. `w-20` (recommended)** | `--space-20` | 64 px |
| C. New token | e.g. `--size-attachment-thumb` in `packages/tokens/src/theme.css` | any; requires token confirmation, not proposed as a value here |

**Recommendation: B.** An existing token, large enough to recognise a screenshot. Five items (Recado's limit) take about 5 × 64 px plus four 6.4 px gaps, and the strip wraps if the panel is narrower. Needs no token change. A is the fallback if the owner wants five items to fit a narrower panel on one row. C is listed only for completeness; no value is proposed.

### Q7 — (additional, found while drafting) Remove-button touch target

`IconButton` sizes are `sm` 25.6 px, `md` 32 px, `lg` 38.4 px (`packages/ui/src/atoms/icon-button/types.ts:64`); none reaches the 44 px touch minimum (`skills/_shared/component-contract.md`, Accesibilidad), and IconButton has no coarse-pointer sizing. Overlaying a 38.4 px button on a 64 px thumbnail also hides most of the image.

| Option | Consequence |
| --- | --- |
| **A. `sm`, `outline` variant, corner overlay; document the touch limitation (recommended for v0.1)** | Smallest cover over the image; `outline` has its own opaque surface so the glyph reads over any screenshot. Below 44 px on touch; Recado is a desktop (pointer-fine) app. |
| B. `lg`, `outline` variant | Closest to touch size (38.4 px) but covers about 36% of a 64 px thumbnail and is still under 44 px. |
| C. Propose a separate IconButton coarse-pointer sizing amendment first | Correct for touch, but changes an existing component API/appearance and needs its own spec; out of scope for this one. |

**Recommendation: A**, recording the touch limitation explicitly (AC-26) and tracking C as a separate follow-up.

### C1–C4 — New prop-naming conventions (separate approval)

See “Conventions to approve” in section 3. Recommendation: approve all four as proposed; they are independent of this spec's approval.

---

## 1. Purpose and scope

- **Need / non-goals:** let a form attach images by pasting (Ctrl+V of a screenshot) while focus stays in the consumer's `Textarea`, or by dropping/picking them through the existing Dropzone, with configurable type, size and count validation, visible and announced errors, and a removable thumbnail strip with an accessible name per item (issue #497, Recado). Non-goals: upload transport or progress, storage, form file participation (`name`/`required`), document-wide or field-wide drop and paste, image editing or cropping, deduplication, reordering, non-image files (owner decision Q3), and owning or labelling the consumer's `Textarea` (that belongs to `Field`).
- **Cataloging decision / alternatives:** **compose** (approved, S1). Reuse: Dropzone alone has focus-scoped paste (`packages/ui/src/atoms/dropzone/useDropzone.ts:97-104`, approved #56 D8), no validation (#56 D6) and no preview strip. Variant: a Dropzone variant would have to add validation, a value and a strip, contradicting its approved contract. Extract: nothing repeats. New: not needed, because every part already exists. Composed pieces: Dropzone (unchanged), PhotoFrame, IconButton, FieldMessage, Cluster, Stack, VisuallyHidden. Radix base: none (`@radix-ui/react-visually-hidden` is already a dependency of the VisuallyHidden primitive). No new dependencies.
- **Evidence / level and package:** inspected public exports of `packages/ui/src/index.ts` (Dropzone, PhotoFrame, IconButton, FieldMessage, Field, Textarea, Cluster/Stack, VisuallyHidden, Icon); `Dropzone` props (`onFiles`, `accept` picker-only, `multiple`, `disabled`, `variant`; `types.ts:18-55`) and hook; `PhotoFrame` requires `src` and `alt` (`photo-frame/types.ts:36,40`); `IconButton` requires `label` and `icon` (`icon-button/types.ts:13`); `FieldMessage` and `Field` create no live region (`field-message/FieldMessage.tsx:6`, `field/types.ts` `error`); the polite-status precedent is `<VisuallyHidden role='status' aria-live='polite'>` in `organisms/calendar-grid/CalendarGrid.tsx:110`; `Icon` provides `close` (used by Dialog and Toast). Level molecule (composes atoms and a layout primitive; owns paste, validation and list state), package `@egdev/ui`, folder `packages/ui/src/molecules/attachment-field/`.

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

- **Radix / composition:** none for behavior; no `asChild`, no ref. Reused components keep their own contracts (Dropzone unchanged; no change to PhotoFrame, IconButton, FieldMessage, Cluster, Stack or VisuallyHidden). DOM order: `children` → strip → Dropzone → messages → status.
- **Public markers:** root `eg-attachment-field` (new, stable). Reused markers (`eg-photo`, `eg-icon-btn`, `eg-dropzone`, `eg-field-message`, `eg-cluster`, `eg-stack`, `eg-visually-hidden`) remain those of their components; no new part markers are promised.

## 3. Public API

- **Prop conventions:** registry [`skills/_shared/prop-naming.json`](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), [lookup workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Lookup ran by meaning, name and aliases (173 entries). Applied (all `approved`):
  - `label` → `accessible-name`: required name of the attachment list (collection-name precedent: Timeline, GaugeGroup, SelectTile).
  - `value` → `primary-value`; `defaultValue` → `initial-uncontrolled-value`; `onValueChange` → `interactive-value-change` (owner decision Q2).
  - `messages` → `localized-messages`: `Partial<AttachmentFieldMessages>` with formatters, with documented defaults for omitted entries (precedents: Carousel, Timeline, CalendarGrid `entryMoved`). The per-item remove label is a **key of this dictionary** (`removeItem`), not a new top-level prop.
  - Considered and **not** applied: `files-received` / `onFiles` (the field emits the full next list through `onValueChange`, and the entry's own “avoid” excludes validation feedback; `onFiles` stays Dropzone's internal contract); `collection-items` / `items` (the list is the user-edited value, not render data supplied for entries; its “avoid” excludes free lists without an entry shape); `dismiss-label` / `dismissLabel` (its “avoid” excludes destructive actions, and it names one built-in close control, not a per-item action); `indicator-count-cap` / `max` (display threshold, explicitly “not a validation limit”); `character-counter` / `counter` (text length, avoid “item counts”); `viewport-max-height` / `maxHeight` (scroll viewport).
  - `disabled`: no registry entry exists (a native attribute on Dropzone, IconButton and others); used as a boolean own prop on a `div` root with the same meaning. No convention proposed.
  - New proposals C1–C4 are below. Usage `source: {path, symbol, revision}` with `sha256:<whole-file byte hash>` is recorded at implementation from `packages/ui/src/molecules/attachment-field/types.ts` (symbol `AttachmentFieldProps`); nothing is invented now.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | yes | — | Accessible name of the attachment list (for example “Attachments”). The list is rendered only when there is at least one item. |
| `value` | `File[]` | no (controlled) | — | Controlled attachments; requires `onValueChange`. **Owner decision Q2.** |
| `defaultValue` | `File[]` | no (uncontrolled) | `[]` | Initial attachments when uncontrolled; never combined with `value`. **Owner decision Q2.** |
| `onValueChange` | `(files: File[]) => void` | required with `value`, otherwise no | — | Called with the next full list after a user add or remove; in controlled mode it is a request. **Owner decision Q2.** |
| `acceptedTypes` | `` readonly `image/${string}`[] `` | no | any `image/*` | Allowed MIME types, exact (`image/png`) or subtype wildcard (`image/*`), case-insensitive. A file with an empty type is rejected. Also drives the Dropzone picker filter (`accept` joined with commas). **owner decision Q3; new convention C1.** |
| `maxFileBytes` | `number` | no | no limit | Largest allowed file size in bytes; a file of exactly this size is accepted. A non-finite or non-positive value is ignored. **New convention C2.** |
| `maxFiles` | `number` | no | no limit | Largest number of attachments, counting the current list. A non-integer, non-finite or `< 1` value is ignored. **New convention C3.** |
| `onFilesRejected` | `(rejections: AttachmentRejection[]) => void` | no | none | Called once per intake that rejects at least one file, after `onValueChange`. **New convention C4.** |
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
  formatSize: (bytes: number) => string;                  // default: 1024-based, 'B' | 'KB' | 'MB' (for example '240 KB')
  dropzoneLabel: string;                                  // omitted: Dropzone's own default 'Drag, paste or upload'
  dropzoneDropLabel: string;                              // omitted: Dropzone's own default 'Drop here'
};
```

  - `typeLabel` is derived from the MIME subtype, uppercased, without a `+xml` suffix (`image/png` → `PNG`, `image/svg+xml` → `SVG`). The proposed English defaults for the rejection formatters name the rule and the file or count, for example “screenshot.bmp was not added: only PNG, JPEG, WebP, GIF files are allowed.”, “big.png was not added: it is larger than 5 MB.”, “extra.png was not added: at most 5 attachments are allowed.”; plural forms say “N files were not added: …”. Exact strings are fixed in the implementation plan and tests.
  - **Item identity** is the `File` object reference; `position` is the 1-based index in the current list, so labels renumber after a removal.
  - `AttachmentFieldProps` types that are exported: `AttachmentFieldProps`, `AttachmentFieldMessages`, `AttachmentItemInfo`, `AttachmentRejection`, `AttachmentRejectionReason`.

- **Native props / refs:** inherits `ComponentPropsWithoutRef<'div'>` minus `onPaste` (owned by the hook; consumers put their own `onPaste` on the Textarea, where it runs first and can opt out with `preventDefault()`), `defaultValue` (replaced by the typed own prop) and `children` (retyped); `...rest` reaches the root. No Dropzone, IconButton or PhotoFrame props are exposed beyond those above. Dropzone is fixed to `variant='inline'` (compact full-width row; `default` is a square that would break the strip layout; a future variant would be additive). No ref, no `asChild`.
- **Controlled / uncontrolled (owner decision Q2):** controlled when `value` is defined; `onValueChange` is then required and the list changes only when the parent passes a new `value`. Uncontrolled starts from `defaultValue` (read once) and notifies through `onValueChange`. Controlled validation applies to user intake only: a `value` with non-image files or more than `maxFiles` entries is rendered as given, with no error.
- **Compatibility:** new exports from `packages/ui/src/index.ts` (molecules section) only; Dropzone, PhotoFrame, IconButton, FieldMessage and every existing API are unchanged. React peer `^18.3.1 || ^19.3.0`: the design uses only React 18-compatible APIs (state, effects, `useId`, synthetic events); the React 18 claim is verified by the existing tested matrix at implementation, not deduced from types.

### Conventions to approve

Approved by the owner on 2026-11-19, separately from the spec approval; registry entries are added with their usage evidence during implementation.

```json
{
  "id": "accepted-file-types",
  "name": "acceptedTypes",
  "meaning": "Explicit list of MIME types a file field accepts; files outside it are rejected by the component itself.",
  "whenToUse": "A component validates picked, dropped or pasted files by MIME type and reports rejections.",
  "avoid": "A native picker filter that never rejects (Dropzone accept), file extensions, size or count limits.",
  "status": "approved",
  "approval": null,
  "aliases": [],
  "exceptions": []
}
```

Evidence: `Dropzone.accept` is a comma-separated picker filter with explicit “never silently rejected” semantics (`atoms/dropzone/types.ts:36-39`), so reusing the name `accept` for a rejecting `string[]` would conflate two behaviors. No registry entry covers file types.

```json
{
  "id": "max-file-bytes",
  "name": "maxFileBytes",
  "meaning": "Largest allowed size, in bytes, of one file accepted by a file field; a file of exactly this size is accepted.",
  "whenToUse": "A component validates the size of each picked, dropped or pasted file and reports rejections.",
  "avoid": "Total size across files, display thresholds, text length limits or scroll viewport heights.",
  "status": "approved",
  "approval": null,
  "aliases": [],
  "exceptions": []
}
```

Evidence: bare `max` is taken by `indicator-count-cap` (display threshold, “not a validation limit”) and `counter.max` by `character-counter`; `maxHeight` by `viewport-max-height`. The unit is in the name because the per-file scope and the byte unit are the two ambiguities in the issue's wording (“maximum bytes”).

```json
{
  "id": "max-file-count",
  "name": "maxFiles",
  "meaning": "Largest number of files a file field holds at once, counting those already attached; further files are rejected.",
  "whenToUse": "A component limits how many files can be attached and reports rejections of the excess.",
  "avoid": "Display overflow caps on counters, text length limits or per-file size limits.",
  "status": "approved",
  "approval": null,
  "aliases": [],
  "exceptions": []
}
```

```json
{
  "id": "files-rejected",
  "name": "onFilesRejected",
  "meaning": "Notification carrying the files a file field refused to attach, each with the rule it broke.",
  "whenToUse": "A component validates files itself and lets the consumer log, mirror or react to rejections.",
  "avoid": "Files that were accepted (use onValueChange), upload failures or the visible error text.",
  "status": "approved",
  "approval": null,
  "aliases": [],
  "exceptions": []
}
```

Evidence: `files-received` (`onFiles`) explicitly avoids “validation feedback”, so rejections need their own entry. Component-specific type: `(rejections: { file: File; reason: 'type' | 'size' | 'count' }[]) => void`.

Per-item remove label: **no new convention** is proposed. It is the `removeItem` formatter inside the approved `localized-messages` dictionary (`messages`). If the owner prefers a standalone top-level prop, that would need a new entry; this is noted, not proposed.

## 4. Behavior

Intake (paste, drop or pick) goes through one pipeline. For each file, in clipboard/selection order, the first failing rule wins: **type** (not in `acceptedTypes`, or empty type), then **size** (`file.size > maxFileBytes`), then **count** (no capacity left: `maxFiles − current list length − files already accepted in this intake`). Accepted files are appended in order; `onValueChange` is called once with the next list when at least one file was accepted; `onFilesRejected` is then called once when at least one was rejected.

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Paste with at least one accepted file, focus in the consumer's Textarea (or any descendant of the root) | Files are attached, `preventDefault()` is called, **focus does not move**, text/HTML flavors are discarded (owner decision Q4) | `onValueChange(next)`; `onFilesRejected` if some were rejected |
| Paste of text only (no clipboard files) | Ignored: no `preventDefault()`, text goes into the Textarea | none |
| Paste where every clipboard file is rejected | Rejection errors are shown and announced; **no `preventDefault()`** (the default paste proceeds) | `onFilesRejected` |
| Paste outside the root | Not handled; there is no `document`/`window` listener | none |
| Paste whose default is already prevented by a descendant (for example Dropzone's own focused paste, or a consumer `onPaste` opting out) | Ignored by the root, so a focused-Dropzone paste is processed once, not twice | none from the root |
| Paste while the Dropzone button itself has focus | Dropzone's approved rule applies (default prevented when files are present); its files enter the same pipeline once | as for intake |
| Files dropped on or picked through the Dropzone | Same pipeline; focus stays where it was (Dropzone unchanged) | as for intake |
| File of a disallowed or empty type | Rejected with reason `type` | `onFilesRejected` |
| File larger than `maxFileBytes` (exactly equal is accepted) | Rejected with reason `size` | `onFilesRejected` |
| More files than the remaining capacity | The first files that fit are accepted; the rest are rejected with reason `count` | `onValueChange`, `onFilesRejected` |
| Intake with rejections | One visible `FieldMessage tone='error'` per distinct broken rule, in the order type → size → count, replacing the previous messages; the Dropzone button gets `aria-describedby` to them | none |
| Next intake, or any removal | Previous rejection messages are cleared (then replaced if the new intake rejects) | none |
| Intake with at least one accepted or rejected file | One polite announcement: the `added` text, then each rejection text | none |
| Remove button activated (click, Enter or Space) | The item leaves the list; `removed` is announced; focus moves per section 5 | `onValueChange(next)` |
| Object URL lifecycle | Created once per file when it first appears in the list; revoked when it leaves the list (removal or controlled change) and for every remaining file on unmount; the thumbnail renders once its URL exists | none |
| `disabled` | Dropzone disabled, Remove buttons disabled, paste ignored (no `preventDefault()`, no callbacks, no announcements); the strip remains | none |
| `maxFiles` reached | Dropzone stays rendered and enabled; an extra file produces the `count` rejection (owner decision Q5a) | `onFilesRejected` |
| Controlled with an unchanged `value` after a request | List unchanged; focus intent from a removal is discarded | the request was emitted |
| Reduced motion | The component adds no transition or animation of its own (see section 6) | none |

- **States / representation:** no own `data-state`. Disabled is exposed as `data-disabled` (empty string) on the root, like IconButton, styled by the composed atoms' native disabled handling. Radix/ARIA attributes are those of the composed atoms. No state is mirrored into classes.
- **Limits / consumer responsibilities:** the paste scope is the root's subtree, so “anywhere in the containing form” requires the form's fields to be rendered as `children` (a paste in a control outside the root is not handled). Consumers own the Textarea, its label (`Field`), uploading and storage, deduplication (no dedup is done), any non-image or oversized controlled `value`, and mirroring rejections elsewhere (`onFilesRejected`). Repeated identical announcement strings may not be re-announced by every screen reader; the default texts include file names or counts to reduce this (implementation plan to verify). A consumer `onPaste` that calls `stopPropagation()` prevents the root from seeing the event.

## 5. Accessibility

- **Accessible name / roles / relationships:** the strip is a native `ul` named by `label`; each `li` contains the thumbnail `img` whose `alt` is the item label (default “Attachment 1, PNG, 240 KB”; Recado passes “Screenshot 1, PNG, 240 KB”) and a native button named by `removeItem(itemLabel)` (rendered as Radix visually hidden text by IconButton). The Dropzone keeps its native button name. Root has no role (it wraps arbitrary content). Visible errors are `p` elements with `useId()` ids, referenced from the Dropzone button's `aria-describedby`; no control receives `aria-invalid` (the component does not own the Textarea).
- **Keyboard / focus:** all interaction is native: Tab order is consumer controls → each Remove button → Dropzone; Enter/Space activate Remove and the Dropzone. Paste, drop and pick never move focus. After removing an item, focus moves to the Remove button now at the same position (the next item), else to the previous item's Remove button, else, when the list is empty, to the Dropzone button (owner decision Q5). In controlled mode, the move happens only if the next render no longer contains the removed file; otherwise it is dropped. No focus trap and no roving tabindex.
- **Announcements / other conditions:** one always-mounted `VisuallyHidden role='status' aria-live='polite'` (CalendarGrid precedent) announces added files, rejections and removals; the visible `FieldMessage` is not itself live, so nothing is announced twice. Errors are not color-only: `FieldMessage` error tone adds a decorative status glyph and the text names the broken rule. Target sizes: Dropzone inline row is at least 56 px high (`min-h-14`); the Remove button (`IconButton` `sm`, 25.6 px) is **below** the 44 px touch minimum, a documented limitation (owner decision Q7). The component guarantees names, the live region, the focus rules above and keyboard operation; the consumer guarantees the Textarea's label and any wider announcements.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| none | — | — | No variant axis. The composed atoms use fixed treatments: Dropzone `inline`, PhotoFrame `default` + `square`, IconButton `outline` + `sm`. |

- **Tokens / Material:** no paint of its own. Material comes entirely from the composed components: the PhotoFrame recipe (a Surface well composed through `surfaceVariants`), the IconButton `outline` treatment (elevated, round, opaque over the image), the approved Dropzone dashed transparent recipe, and the FieldMessage error tone. Layout only, by token-backed utilities: root `Stack gap={2}`; strip `Cluster gap={2}`; thumbnail figure width `w-20` (64 px, `--space-20`; **owner decision Q6**, new token not proposed); item `relative`; Remove button `absolute top-1 end-1` (logical inset, RTL-safe). Focus, hover, disabled (`.45` opacity) and `motion-reduce:` handling are inherited from the atoms. The component adds no transition, animation, shadow, gradient or color; therefore there is no reduced-motion or reduced-transparency surface of its own to define. No hardcoded values.
- **Dynamic geometry:** Not applicable. No inline style and no interpolated class strings.
- **Class composition / consumer layout:** `className` on the root supports outer layout only (grid placement, margin, width), merged last with `cn()`; appearance overrides are unsupported and `twMerge` does not resolve arbitrary CSS selectors. No per-part `className` is exposed. Tested: layout class kept together with the root recipe; `style` absent.
- **Files / pending proposals:** `types.ts` (props and message types, exported types, CVA for root, strip, item, thumbnail and Remove positioning), `useAttachmentField.ts` (intake pipeline and validation, controlled/uncontrolled list, paste handler, object URL map and revocation, rejection state, announcement text, focus restoration, `messages` defaults, `Dropzone` props), `AttachmentField.tsx` (JSX only), `AttachmentField.test.tsx`, `AttachmentField.stories.tsx` (`Molecules/AttachmentField`, actions for `onValueChange` and `onFilesRejected`, a Textarea inside `Field` as the consumer control), `index.ts`. **No stylesheet** (utilities express everything). **No internal modules.** No tokens or dependencies added; the only conditional token proposal is Q6-C, which is not recommended.

### Expected-design visual reference

Recado's artboard (`recado/design/recado-panel/01-compact-tabs.html`, frames 02–04 and 13) is a private repository file that this design-system repo cannot read, and no supplied image exists. The design guide's read-only preview → real browser → Playwright component-zone capture flow has no authorized source, so **no image is invented**. Every VIS row stays pending until the owner supplies the artboard (or authorizes capturing the Storybook stories after implementation as a Proposed reference).

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending capture: field with a Textarea and the inline Dropzone, no attachments | empty list | story `Molecules/AttachmentField` Default, after implementation, or the supplied artboard frame 02 | Pending capture; not approved |
| VIS-02 | Pending capture: strip of three 64 px thumbnails, each with a corner Remove button, above the Dropzone | three items | story Default with three files, or artboard frame 13 | Pending capture; not approved |
| VIS-03 | Pending capture: one `error` FieldMessage naming a broken rule below the Dropzone | rejected file of each rule | story Validation | Pending capture; not approved |
| VIS-04 | Pending capture: disabled field with a populated strip | `disabled` | story Disabled | Pending capture; not approved |

- **Conditions / provenance per VIS ID:** Pending. When captured: viewport in px, device scale, browser and version, dark theme, loaded fonts, motion/transparency preferences, component-zone crop, date and tool, or the supplied-image provenance and its verification limits.
- **Intent / acceptance / pending evidence:** the strip reads as a row of square, Material-framed thumbnails with a round corner control; the Dropzone stays the quiet dashed row; errors are text with the error glyph. Related criteria: AC-16, AC-09, AC-22, AC-26. Missing: source design, captures and approval. Tokens are never inferred from pixels. Visual conformity: **Not evaluated**.
- Without recoverable approved references and comparable conditions, visual conformity is **Not evaluated**. Captures do not replace behavior or accessibility tests.

## 7. Acceptance criteria

Test file for all rows: `packages/ui/src/molecules/attachment-field/AttachmentField.test.tsx` (Vitest, Testing Library, `userEvent`; `URL.createObjectURL` / `revokeObjectURL` stubbed because jsdom lacks them; no `data-testid`). Stories are in `AttachmentField.stories.tsx`. “Pending” in the last column means nothing has been run.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | The root keeps `eg-attachment-field`, renders `children`, merges consumer `className` last, and sets no inline style; no ref or `asChild` API | render test; class and attribute assertions | Default; VIS-01 | Pending |
| AC-02 | Empty list: no `ul` is rendered, the Dropzone button is present with its default name, and the status region exists and is empty | role/name queries | Default; VIS-01 | Pending |
| AC-03 | Pasting an accepted image while focus is in the Textarea attaches it: `onValueChange` receives the appended `File`, `defaultPrevented` is true, and `document.activeElement` is still the Textarea | `fireEvent.paste` / `userEvent.paste` with `clipboardData.files` | WithTextarea | Pending |
| AC-04 | Text-only paste: no callback, not default-prevented, and the Textarea receives the text | `userEvent.paste` with text | WithTextarea | Pending |
| AC-05 | Mixed clipboard (image + text/HTML): the recommended rule applies (files win, default prevented); the case is rewritten if the owner chooses another Q4 option | `fireEvent.paste` with files and text flavors | Not applicable | Pending |
| AC-06 | No `document`/`window` listener: pasting on an element outside the root attaches nothing and no `paste` listener was added to `document` or `window` | spy on `addEventListener`; paste on an outside input | Not applicable | Pending |
| AC-07 | A paste already default-prevented by a descendant (Dropzone button focused, or a consumer `onPaste` opt-out) is processed once and the root's intake does not run twice | focus the Dropzone, paste, count `onValueChange` calls | Not applicable | Pending |
| AC-08 | Drop and pick go through the same validation, and the Dropzone `accept` attribute equals `acceptedTypes` joined by commas | `userEvent.upload`, `fireEvent.drop`, input attribute assertion | Default | Pending |
| AC-09 | Type rule: a disallowed or empty-type file is rejected, a visible error names the rule, `onFilesRejected` receives `{ file, reason: 'type' }`, and the list is unchanged | rejection test; text and callback assertions | Validation; VIS-03 | Pending |
| AC-10 | Size rule: a file of exactly `maxFileBytes` is accepted and `maxFileBytes + 1` is rejected with reason `size` | boundary tests | Validation; VIS-03 | Pending |
| AC-11 | Count rule: capacity includes the current list; the first files that fit are accepted in order and the rest are rejected with reason `count` | tests with a preloaded list and multi-file intake | Validation; VIS-03 | Pending |
| AC-12 | Several broken rules in one intake yield one error per rule in the order type → size → count, and a file breaking two rules is reported once, under the first | multi-rule test | Validation; VIS-03 | Pending |
| AC-13 | Invalid limits (`0`, negative, `NaN`, non-integer `maxFiles`) are ignored, so the rule is not enforced | parameterized tests | Not applicable | Pending |
| AC-14 | Rejection messages are cleared by the next intake and by any removal, and replaced when the new intake rejects | sequence test | Validation | Pending |
| AC-15 | The polite `role='status'` region is mounted before any content and receives exactly one announcement per intake (added text then rejection texts) and one per removal; visible errors are not live regions | status region text assertions; no `aria-live` on `FieldMessage` | Validation | Pending |
| AC-16 | The strip is a `ul` named by `label`; each item has an `img` named by `itemLabel`, and a Remove button named by `removeItem`; default text matches “Attachment 1, PNG, 240 KB” and `messages` overrides apply, including `formatSize` | `getByRole('list', { name })`, `getByRole('img', { name })`, `getByRole('button', { name })` | Default with three files; VIS-02 | Pending |
| AC-17 | Object URLs: created once per file, revoked on removal, on a controlled list change and on unmount; no unmatched creation after unmount, also under React StrictMode; a URL still shown is never revoked | spy counts on stubs; StrictMode render | Not applicable | Pending |
| AC-18 | Remove works with click, Enter and Space, and the removed file is not in the next list; Tab order is Textarea → Remove buttons → Dropzone | `userEvent.keyboard`, `userEvent.tab` | Default | Pending |
| AC-19 | Focus after removal: next item's Remove, else previous, else (empty list) the Dropzone button; a controlled request that is not applied keeps focus where it was | focus assertions in controlled and uncontrolled modes | Default | Pending |
| AC-20 | Controlled `value` changes only when the parent changes it; `defaultValue` is read once; `onValueChange` fires in both modes (owner decision Q2) | controlled/uncontrolled tests | Controlled, Uncontrolled | Pending |
| AC-21 | At `maxFiles`, the Dropzone stays rendered and enabled and an extra file produces a visible `count` rejection (owner decision Q5a) | render and intake test | AtLimit | Pending |
| AC-22 | `disabled` disables the Dropzone and every Remove button, ignores paste (no `preventDefault()`, callbacks or announcements), keeps the strip, and sets `data-disabled` | render and event tests | Disabled; VIS-04 | Pending |
| AC-23 | Reduced motion: the component's own class output includes no transition or animation utility; the composed atoms keep their `motion-reduce:` utilities | class assertions; browser check with reduced motion emulated | Default under reduced motion | Pending |
| AC-24 | Public exports (`AttachmentField` and the five types) are in the `packages/ui/src/index.ts` barrel and `index.ts`; every own prop has English JSDoc with a valid `@control`; the controlled/uncontrolled union type-checks | `pnpm typecheck`; storybook metadata and controls tests; registry checks (`pnpm props:check`, `pnpm test:props`) after the conventions are approved | Controls panel | Pending |
| AC-25 | Strip and message layout stays inside the root with five 64 px thumbnails plus gaps in a narrow panel (Recado's maximum) and wraps, rather than overflowing | browser check at the compact width | ManyItems; VIS-02 | Pending |
| AC-26 | Remove button touch target and contrast over images are verified and the below-44 px limitation (Q7) is documented in the component docs | manual check on pointer-coarse emulation; contrast check over light and dark screenshots | Default; VIS-02 | Pending |

### Spec closure

- [ ] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain (Q2–Q7 are open).
- [ ] New/changed own props have registry lookup evidence, exact applied/proposed IDs and reviewed exceptions; convention approval (C1–C4) remains explicit and separate. Usage `source` evidence is recorded at implementation.
- [x] Proposals, verified implementation, planned test/story matrices and observed results are distinct; each promise has an acceptance ID and a suitable method. Nothing is implemented.
- [ ] Visual IDs identify real image provenance, conditions and related criteria; all four are Pending capture, which is not verification.
- [ ] Snapshot identity is recoverable; human approval identifies this exact version, content digest, visual hashes and scope; status records the approved version.
- [ ] One canonical component issue is retained (#497); this version, once approved, is published only as an authorized comment with reason, compatibility impact, previous-comment link and a recoverable full snapshot, never a silent body edit or a new issue.

**Next step:** present Q2–Q7 and C1–C4 to the owner, fold the decisions into sections 1–7, compute the digest, then request approval of this version; afterwards propose the implementation plan and await separate approval. This spec authorizes no code, token/dependency changes or external writes.
