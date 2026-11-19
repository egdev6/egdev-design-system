# AttachmentField v0.1 — implementation plan

- **Status:** Approved — 2026-11-19 by the owner (reply "Apruebo, con el registro de aprobación (OQ1)"): OQ1 creates `docs/decisions/prop-naming-attachment-field-approval.json`; OQ2–OQ8 as proposed in section 9, including authorization to capture VIS-01..04. Implementation proceeds in the commit slices below.
- **Spec:** [spec.md](spec.md), v0.1, **Approved — 2026-11-19**, `contentSHA256: 47db068c2d055ad342efb895e513db27a258ddef661ee134d4ff42248f5aa7ad`. Verified while writing this plan: SHA-256 of the UTF-8 bytes from the `## 1. Purpose and scope` heading line (the heading itself, without the preceding blank-line LF) through EOF reproduces the recorded digest. Hashing from the LF before the heading gives `5acfc0e1…`, so the spec's own "from `## 1.`" definition is the one that holds.
- **Issue / branch:** canonical issue [#497](https://github.com/egdev6/egdev-design-system/issues/497); implementation branch to be chosen by the parent (planning branch: `docs/attachment-field-spec`).
- **Skill:** `skills/component-contributor/SKILL.md`, plan stage (steps 1–2 and Delivery safeguards). The owner's earlier decisions are not reopened: Q2 C, Q3 A, Q4 A, Q5a A, Q5b A, Q6 B, Q7 A, conventions C1–C4.

## 1. Inspection result (step 1)

Composition is complete; no prerequisite component, token or dependency is missing.

| Piece | Evidence in the repo (public barrel `packages/ui/src/index.ts`) | Use |
| --- | --- | --- |
| `Dropzone` | `atoms/dropzone`; `onFiles`, `accept` (picker only), `multiple`, `disabled`, `variant`, `label`, `dropLabel`; native button + hidden input; focus-scoped paste; **no ref** | `variant='inline'`, unchanged |
| `PhotoFrame` | `atoms/photo-frame`; required `src` and `alt`; `ratio`, `variant`, figure `className` | `ratio='square'`, `variant='default'`, figure width `w-20` |
| `IconButton` | `atoms/icon-button`; `forwardRef<HTMLButtonElement>`; required `label` and `icon` | `variant='outline'`, `size='sm'`, `icon={<Icon name='close' />}`, `label={removeItem(itemLabel)}` |
| `FieldMessage` | `atoms/field-message`; `children: string`, `tone`, native `p` props (`id`); no live region | one `tone='error'` per broken rule, `id` from `useId()` |
| `Cluster` | `primitives/stack` (`asChild` supported through Slot) | `Cluster asChild gap={2}` on the `ul` |
| `Stack` | `primitives/stack`; **no ref**, `asChild` supported; `...rest` reaches the `div` | root layout, `gap={2}` |
| `VisuallyHidden` | `primitives/visually-hidden`; `forwardRef<HTMLElement>` | `role='status' aria-live='polite'` (precedent: `organisms/calendar-grid/CalendarGrid.tsx:110`) |
| `Icon` | `atoms/icon`; `close` glyph exists | Remove button glyph |

Radix base: none. New dependencies: none. `@radix-ui/react-visually-hidden` is already a dependency of the VisuallyHidden primitive.

## 2. Plan (step 2)

### 2.1 Files, level and package

Level molecule, package `@egdev/ui`, folder `packages/ui/src/molecules/attachment-field/`. Exactly the six mandatory files, English JSDoc throughout, no internal modules (module-level pure helper functions inside `useAttachmentField.ts` are not modules).

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, `AttachmentFieldProps` (controlled/uncontrolled union), `AttachmentFieldMessages` and the four other exported types, CVA recipes (root, strip, item, thumbnail, remove), JSDoc with `@control` / `@controlReason` / `@default` |
| `useAttachmentField.ts` | All logic (section 2.3); typed return, no `any` |
| `AttachmentField.tsx` | JSX only: hook result, explicit props, composed atoms |
| `index.ts` | Named exports: `AttachmentField` and types `AttachmentFieldProps`, `AttachmentFieldMessages`, `AttachmentItemInfo`, `AttachmentRejection`, `AttachmentRejectionReason` (exactly the spec's list) |
| `AttachmentField.test.tsx` | Vitest + Testing Library + `userEvent`; section 3 |
| `AttachmentField.stories.tsx` | `Molecules/AttachmentField`; section 4 |

**No stylesheet.** Utilities express everything; no dummy CSS. No new tokens or dependencies (the Q6-C token is not proposed).

Outside the folder, required wiring (all additive; each is listed again under the commit units):

- `packages/ui/src/index.ts`: add `export * from './molecules/attachment-field';` in the molecules block. Public availability is claimed only after this line exists.
- `packages/ui/src/styles/compiled.css`: add `@source "../molecules/attachment-field/types.ts";` (the production stylesheet scans only production `types.ts`, as Dropzone does).
- `.storybook/preview.css`: add `@source` for `AttachmentField.stories.tsx`; `.storybook/main.ts`: add the native-prop filter entry for the component next to `dropzone:` (line ~133) so docgen does not list inherited `div` attributes.
- `packages/ui/src/lib/storybook-controls.test.ts`: register `['AttachmentField', 'molecules/attachment-field']` and the own-metadata assertions.

### 2.2 Anatomy and exact composition

DOM order is `children` → strip → Dropzone → rejection messages → status (spec section 2). Public marker: root `eg-attachment-field` (in the root CVA base string). Reused markers stay those of their components; no new part markers.

```tsx
<Stack asChild gap={2} className={cn(rootVariants(), className)} onPaste={…} data-disabled={disabled ? '' : undefined} {...rest}>
  <div ref={rootRef}>
    {children}
    {files.length > 0 && (
      <Cluster asChild gap={2}>
        <ul aria-label={label} className={stripClassName}>
          {files.map((file) => (
            <li key=… className={itemClassName}>
              <PhotoFrame ratio='square' variant='default' src={url} alt={itemLabel} className={thumbClassName} />
              <IconButton ref={…} variant='outline' size='sm' label={removeLabel} icon={<Icon name='close' />}
                disabled={disabled} onClick={…} className={removeClassName} />
            </li>
          ))}
        </ul>
      </Cluster>
    )}
    <Dropzone variant='inline' multiple accept={accept} disabled={disabled} label=… dropLabel=…
      aria-describedby={messageIds} onFiles={receive} />
    {rejectionMessages.map(({ id, text }) => <FieldMessage key={id} id={id} tone='error'>{text}</FieldMessage>)}
    <VisuallyHidden role='status' aria-live='polite'><span key={announcementSeq}>{announcement}</span></VisuallyHidden>
  </div>
</Stack>
```

Per-part decisions:

- **Root.** `Stack` has no public ref, and the hook needs a DOM anchor for focus restoration (Dropzone has no ref either). So the root is `Stack asChild` over one `div` carrying an internal `rootRef`. The DOM is exactly what the spec describes (a `div` with the Stack recipe and `eg-attachment-field`); no ref is exposed publicly. `onPaste`, `data-disabled`, `className` and `...rest` travel through Slot to that `div`.
- **Strip.** Rendered only when the list is non-empty. Native `ul` named by `aria-label={label}` (the required `label` prop). Because the production stylesheet has no preflight, the strip recipe carries `list-none m-0 p-0`; items carry `relative m-0`.
- **Thumbnail.** `PhotoFrame` gets `className` `w-20 shrink-0` (64 px, `--space-20`, Q6 B). No `imageCaption`; `alt` is the item label. PhotoFrame is rendered only once its object URL exists (`src` is required and non-empty).
- **Remove button.** `IconButton` outline/sm, `className` `absolute top-1 end-1` (logical inset). The hidden text comes from IconButton's own mechanism; the glyph is `Icon name='close'` with no label. Touch target 25.6 px is a documented limitation (Q7 A, AC-26).
- **Dropzone.** Fixed `variant='inline'` and `multiple` (see open question OQ2): with `multiple={false}` Dropzone slices to the first file and the `count` rule could never fire from a pick or drop. `accept` is `acceptedTypes.join(',')`, or `image/*` when `acceptedTypes` is omitted (the spec's default "any `image/*`"). `label`/`dropLabel` pass only when `messages` defines them, so Dropzone's own defaults ("Drag, paste or upload", "Drop here") stay otherwise. `aria-describedby` reaches the button through Dropzone's native `...rest`.
- **Messages.** One `FieldMessage tone='error'` per distinct broken rule, order type → size → count, `id` = `${useId()}-type|size|count`. They are not live regions.
- **Status.** Always mounted, empty at first. The announcement text lives in an inner `span` whose `key` changes on every announcement (section 2.3).

CVA recipes in `types.ts` (static utilities only, token-backed, per-part `cn()`): `attachmentFieldVariants` (root: `eg-attachment-field min-w-0`), `…StripVariants`, `…ItemVariants`, `…ThumbnailVariants`, `…RemoveVariants`. Only the root recipe carries a documented `className` merge surface: `className` merged last, outer layout only, exactly as the spec's "Class composition". No per-part `className`, no inline `style`, no interpolated class strings, no transition or animation, no shadow, gradient or color. The recipes are internal (not exported; see OQ5).

### 2.3 Hook responsibilities (`useAttachmentField.ts`)

1. **Controlled / uncontrolled list.** `controlled = value !== undefined`. Uncontrolled state is initialized once from `defaultValue ?? []` (lazy `useState`). `files = controlled ? value : internal`. A `latestFiles` ref is refreshed every render and is what intake and removal read, so two intakes in the same tick in controlled mode compute capacity from the latest rendered list, not a stale closure. `commit(next)`: in uncontrolled mode `setInternal(next)`; always `onValueChange?.(next)`. Controlled validation applies to user intake only: a `value` with non-image files or more than `maxFiles` entries renders as given with no error. The discriminated props union makes `value` without `onValueChange` a type error; there is no runtime warning.
2. **Limit normalization.** `maxFileBytes` is used only if `Number.isFinite` and `> 0`; `maxFiles` only if `Number.isInteger` and `>= 1` (AC-13). Invalid values mean "no limit".
3. **Type matching.** Entries are lowercased. `image/*` (any `type/*`) matches by prefix, otherwise exact. A file whose lowercased `type` is empty is rejected. Omitted `acceptedTypes` means `image/*`. Open detail in OQ3.
4. **Intake pipeline** (one function `intake(selected: File[])`; paste, drop and pick all end here):
   - Rules per file, in selection order, first failing rule wins: **type**, then **size** (`file.size > maxFileBytes`; exactly equal passes), then **count** (`maxFiles - latestFiles.length - acceptedSoFar <= 0`). A file rejected for type or size consumes no capacity.
   - If `accepted.length > 0`: `commit([...latestFiles, ...accepted])`. Then, if `rejections.length > 0`, `onFilesRejected?.(rejections)` once, after `onValueChange`.
   - Rejection state: replace the previous messages with one entry per distinct reason, fixed order type → size → count (AC-12, AC-14). A file breaking two rules is reported once, under the first. Any intake or removal first clears the previous messages.
   - Announcement: one string per intake: `added(acceptedCount)` (only when `accepted.length > 0`), then each rejection text, joined with a single space. An intake with no accepted and no rejected file (empty selection) announces nothing and changes nothing.
   - `disabled`: `intake` returns immediately (no callbacks, no state, no announcement).
5. **Paste** (container `onPaste` on the root; no `document`/`window` listener, AC-06). The handler runs, in order: return if `disabled`; return if `event.defaultPrevented` (a consumer `onPaste` opt-out or Dropzone's own focused paste already handled it, AC-07); read `event.clipboardData.files` and return if empty (text-only paste is never touched, AC-04); run `intake`; call `event.preventDefault()` only if at least one file was **added** (Q4 A; a rejected-only paste proceeds as a normal paste). Focus is never moved. `onPaste` is removed from the accepted native props and is owned by the hook. Because the consumer's own Textarea `onPaste` bubbles first, it can opt out with `preventDefault()`; one that calls `stopPropagation()` hides the event from the root (documented limit).
6. **Dropzone `onFiles`** calls `intake` directly (Dropzone's own paste calls `preventDefault()` before `onFiles`, so the root's paste handler then skips it, preventing a double intake).
7. **Object URL lifecycle.**
   - A ref `Map<File, string>` plus a `urls` state snapshot used for rendering. Effect A (`[files]`): create a URL for every file not yet in the map, revoke and delete the entries whose file is no longer in `files`, then `setUrls(new Map(map))` when something changed. Effect B (`[]`): its cleanup revokes every remaining URL and clears the map.
   - A thumbnail is rendered only when `urls.get(file)` exists; a URL still shown is never revoked (revocation happens only for files already gone from the list).
   - React StrictMode: the simulated unmount runs B's cleanup (revoking all and clearing the map) and the remount re-runs A, which recreates the URLs. Creation and revocation stay balanced and no creation is left unmatched after the final unmount (AC-17). Without StrictMode each file gets exactly one `createObjectURL`.
   - Item identity is the `File` reference (`key` from a `WeakMap<File, number>` id counter, never the index or name, so duplicate file names stay distinct).
8. **Item labels.** `position` is the 1-based index in the current list; `typeLabel` is the MIME subtype uppercased without a `+xml` suffix (`image/svg+xml` → `SVG`); `sizeLabel = formatSize(file.size)`. `itemLabel(info)` renders both the thumbnail `alt` and the Remove button name (`removeItem(itemLabel)`); labels renumber after a removal.
9. **Removal.** Remove button `onClick` (native button: click, Enter and Space all go through it, AC-18): compute the focus target from the list **before** removal (file at the same index after removal, i.e. the next item; else the previous item; else the Dropzone), store `pendingFocus = { removed, target }` in a ref, clear the rejection messages, announce `removed(itemLabel)`, then `commit(next)`.
10. **Focus management after removal.** A layout effect keyed on `[files]` (only when the list identity changes): if `pendingFocus` exists **and** `pendingFocus.removed` is no longer in `files` **and** `document.activeElement` is `body` or `null` (focus was dropped by the unmounting button; if the user already moved focus elsewhere, nothing is stolen), focus the target: a Remove button from a `Map<File, HTMLButtonElement>` filled by callback refs on `IconButton`, or the Dropzone button found as `rootRef.current.querySelector('button.eg-dropzone')` (the stable public Dropzone marker; Dropzone has no ref). `pendingFocus` is always cleared by that effect, and also at the start of the next intake or removal, so a controlled request the parent never applies discards its intent and a later unrelated update cannot steal focus (AC-19). No timers.
11. **Live-region strategy.** The status region is mounted from the first render and never conditionally rendered (so a fresh region is not "created with content"). Each announcement sets `announcement` and increments `announcementSeq`, used as the `key` of the inner `span`: even when two consecutive announcements have identical text, the text node is replaced rather than left unchanged, which screen readers treat as new content. The default texts also include the file name or count, which already makes most repeats differ. Whether every screen reader re-announces a replaced identical node cannot be proven in jsdom or Playwright; it is a documented limit and is reported as **Not evaluated** with a real screen reader (risk R3). The announcement is replaced, not cleared, by the next intake or removal. Visible `FieldMessage`s are not live regions, so nothing is announced twice.
12. **Disabled.** `disabled` goes to Dropzone and to every Remove button (native `disabled`); paste, intake and removal are inert; the strip stays; the root gets `data-disabled=''` (omitted when enabled). No pending focus is recorded while disabled.
13. **Return.** One typed object with `rootProps`, `rootRef`, `strip`, `items` (key, alt, url, remove props and ref callback), `dropzoneProps`, `messages` (id/text), `status` (text, key); no `any`.

### 2.4 Default message strings (fixed here, as the spec delegates them to the plan)

| Key | Default |
| --- | --- |
| `itemLabel` | `Attachment ${position}, ${typeLabel}, ${sizeLabel}` (for example `Attachment 1, PNG, 240 KB`) |
| `removeItem` | `Remove ${itemLabel}` |
| `added` | `Attachment added` for 1, otherwise `${count} attachments added` |
| `removed` | `${itemLabel} removed` |
| `rejectedType` | one file: `${name} was not added: only ${types} files are allowed.`; several: `${n} files were not added: only ${types} files are allowed.` `${types}` is the accepted types as `typeLabel`s joined by `, ` (`PNG, JPEG`); `image/*` renders as `image`, so the default reads “only image files are allowed” |
| `rejectedSize` | one file: `${name} was not added: it is larger than ${formatSize(max)}.`; several: `${n} files were not added: each must be ${formatSize(max)} or smaller.` |
| `rejectedCount` | one file: `${name} was not added: at most ${max} attachments are allowed.`; several: `${n} files were not added: at most ${max} attachments are allowed.` |
| `formatSize` | 1024-based: below 1024 → `${bytes} B`; below 1 MiB → `${Math.round(bytes / 1024)} KB`; otherwise MB with at most one decimal, trailing `.0` dropped (`5 MB`, `1.5 MB`); a KB value that rounds to 1024 is shown as `1 MB` |
| `dropzoneLabel` / `dropzoneDropLabel` | omitted → Dropzone's own defaults |

A file with an empty `name` uses the word `Image` in rejection texts. Partial `messages` merge entry by entry over these defaults.

### 2.5 Public API typing (`types.ts`)

- `AttachmentFieldProps` is a discriminated union over the controlled and uncontrolled shapes, intersected with native props: `Omit<ComponentPropsWithoutRef<'div'>, 'onPaste' | 'defaultValue' | 'children'>`. Controlled: `value: File[]` and `onValueChange: (files: File[]) => void` required, `defaultValue?: never`. Uncontrolled: `value?: undefined`, `defaultValue?: File[]`, `onValueChange?`. Docgen extraction of the union must show every row; if the real `react-docgen-typescript` drops rows, the fallback is an interface-free single type with `value?` / `onValueChange?` and a JSDoc rule (this would change the approved "required with `value`" promise, so it would be raised to the owner, not applied silently; risk R4).
- Own props, `@control` kinds (public prop controls contract): `label` text; `maxFileBytes` number; `maxFiles` number; `disabled` boolean (`@default false`); `value`, `defaultValue`, `onValueChange`, `onFilesRejected`, `messages`, `acceptedTypes` (a `readonly` template-literal tuple) and `children` → `@control false` with concrete `@controlReason` text referring to the Controlled / Uncontrolled / Validation stories. No dummy defaults for required props.
- `type`, never `interface`; no `any`. Exported types: exactly the five in `index.ts`.

## 3. Tests (RED first)

Single file `AttachmentField.test.tsx`; written and run failing before implementation in each commit unit. Setup: stub `URL.createObjectURL` / `revokeObjectURL` (jsdom lacks them) with counters, reset per test; `makeFile(name, type, size)` helper defining `size` with `Object.defineProperty` (no multi-MB allocation); `fireEvent.paste` / `fireEvent.drop` with plain `clipboardData` / `dataTransfer` objects (jsdom has no `DataTransfer` constructor); the hidden picker input is reached from the Dropzone button's sibling, not through `data-testid`. No full class strings: the root marker and `cn()` merge invariants only.

Expected RED sequence: collection failure (module missing); then, with only anatomy and the default list, behavioral failures for paste, validation and removal; then GREEN per unit.

| AC | Test case(s) (describe → it) |
| --- | --- |
| AC-01 | root keeps `eg-attachment-field`, renders `children` first, merges a layout `className` last with the root recipe, has no `style` attribute; `ref` and `asChild` are rejected by the type (`@ts-expect-error` in the packed fixture) |
| AC-02 | empty list: no `list` role, Dropzone button with default name, empty `status` region present |
| AC-03 | paste with one accepted image in the Textarea: `onValueChange([file])`, `defaultPrevented`, `document.activeElement` still the Textarea |
| AC-04 | text-only paste: no callback, not prevented, Textarea receives the text (`userEvent.paste`) |
| AC-05 | mixed clipboard (image + `text/plain` + `text/html`): files win, prevented, one `onValueChange` |
| AC-06 | `addEventListener` spies on `document` and `window` record no `paste`; paste on an outside input attaches nothing |
| AC-07 | focused Dropzone paste: one `onValueChange` call, not two; consumer `onPaste` that calls `preventDefault()`: root ignores |
| AC-08 | `userEvent.upload` and `fireEvent.drop` use the pipeline; Dropzone `input[type=file]` `accept` equals `acceptedTypes.join(',')`, and `image/*` when omitted; picker is `multiple` |
| AC-09 | disallowed type and empty type rejected: visible error text, `onFilesRejected([{ file, reason: 'type' }])`, list unchanged, `onValueChange` not called |
| AC-10 | `maxFileBytes` boundary: exactly equal accepted, `+1` rejected with `size` |
| AC-11 | `maxFiles` with a preloaded list and multi-file intake: first files that fit accepted in order, rest `count`; capacity counts files accepted earlier in the same intake |
| AC-12 | one intake breaking all three rules: three messages in type → size → count order; a file breaking type and size appears once under `type` |
| AC-13 | parameterized invalid limits (`0`, `-1`, `NaN`, `Infinity`, `1.5` for `maxFiles`): rule not enforced |
| AC-14 | message sequence: rejected intake shows messages; next intake clears and replaces; a removal clears; Dropzone `aria-describedby` references exactly the present message ids |
| AC-15 | `status` region exists before content, receives one text per intake (added then rejections) and one per removal; two identical consecutive announcements replace the inner `span` node (identity changes) with equal text; `FieldMessage` has no `aria-live` or `role` |
| AC-16 | `list` named by `label`; `img` named `Attachment 1, PNG, 240 KB`; `button` named `Remove Attachment 1, PNG, 240 KB`; `messages` overrides (`itemLabel`, `removeItem`, `formatSize`) apply; labels renumber after removal; `formatSize` and type-label cases (`image/svg+xml` → `SVG`) |
| AC-17 | create count equals file count; revoke on removal, on a controlled `value` change and on unmount; StrictMode render balances create/revoke and leaves none after unmount; a shown URL is never revoked |
| AC-18 | Remove by click, Enter and Space; removed file absent from the emitted list; `userEvent.tab` order Textarea → Remove buttons → Dropzone |
| AC-19 | uncontrolled and controlled: next item's Remove, else previous, else Dropzone; controlled request not applied keeps focus where it is; user focus moved elsewhere is not stolen |
| AC-20 | controlled `value` changes only when the parent does; `defaultValue` read once (rerender with another `defaultValue` ignored); `onValueChange` fires in both modes |
| AC-21 | at `maxFiles`: Dropzone rendered and enabled; extra file gives a visible `count` rejection |
| AC-22 | `disabled`: Dropzone and every Remove `disabled`, paste not prevented and no callbacks or announcement, strip kept, `data-disabled` present; enabling again restores behavior |
| AC-23 | class output of every recipe contains no `transition`, `animate` or `duration` utility (regex on the generated class strings); composed atoms' `motion-reduce:` utilities are not re-tested here; browser check with reduced motion emulated |
| AC-24 | `pnpm typecheck` (union, exports); `storybook-controls.test.ts` own-metadata pass and docgen test (required/optional, `@control` kinds, zero owned diagnostics); `pnpm props:check`; `pnpm test:props`; barrel and `index.ts` export assertions in `package-exports.test.mjs` |
| AC-25 | unit: strip carries the wrapping `Cluster` recipe (`flex-wrap`) rather than a nowrap row; browser: five 64 px thumbnails in a narrow panel wrap inside the root |
| AC-26 | browser/manual: Remove button measured box (25.6 px) and pointer-coarse emulation; contrast over light and dark screenshots; unit: the component docs (story description) carry the touch-limitation sentence |

Counts: 22 ACs have a primary unit test (AC-01–22), AC-23 is unit plus browser, AC-24 is tooling/metadata (typecheck, docgen, registry, export tests), AC-25 and AC-26 are browser/manual with one supporting unit assertion each. Roughly 45 `it` cases. PRESERVE: none of Dropzone, PhotoFrame, IconButton, FieldMessage, Cluster, Stack or VisuallyHidden is changed; their existing suites are run unchanged (the full `pnpm test`), plus the Dropzone suite as a named preserve check.

## 4. Stories

`AttachmentField.stories.tsx`, `title: 'Molecules/AttachmentField'`, `tags: ['autodocs']`, `Meta` / `StoryObj` from `@storybook/react-vite`, `action` from `storybook/actions`, English copy, no manual `argTypes`, no `play`. Description sections follow the Tabs convention (Description, Dependencies, Usage guidelines), including the Q7 touch-target limitation and the consumer duties from spec section 4.

| Story | Content |
| --- | --- |
| `Default` | empty field with a `Field` + `Textarea` as child; actions on `onValueChange` and `onFilesRejected` |
| `WithTextarea` | same, documented paste instructions (Ctrl+V of a screenshot) |
| `WithAttachments` | `defaultValue` with three generated PNG `File`s (canvas/Blob built in the story) — the VIS-02 subject |
| `Controlled` | `useState` list with a "Clear after save" button |
| `Uncontrolled` | `defaultValue` only |
| `Validation` | `acceptedTypes`, `maxFileBytes`, `maxFiles` set, sample files of each rule to pick or paste |
| `AtLimit` | `maxFiles={3}` with three items |
| `ManyItems` | five items in a 320 px host to show wrapping (AC-25) |
| `Disabled` | `disabled` with a populated strip (VIS-04) |

`Default` supplies only required/example args and does not replace defaults. Stories are the only place with example layout utilities, so `.storybook/preview.css` gains its `@source`.

## 5. Package, registry, catalog, artifact

### 5.1 Package export and consumption

- `packages/ui/src/index.ts`: one `export *` line (see 2.1).
- `scripts/package-exports.test.mjs`: add `AttachmentField` to the runtime export list (around the `'Dropzone'` entries, lines ~5621 and ~6501), the five types to the declaration/type export lists (~5977 and ~6502), a function-type assertion like Dropzone's (~5770), and an SSR smoke render asserting the root marker, the status region and no `aria-live` on messages. If the plan's OQ5 answer is "do not export the recipe", no recipe entry is added (the lists at ~5741 and ~6343 stay untouched). The transition guard stays additive: no new transition is introduced, so no guard expansion.
- `scripts/package-consumption.test.mjs` (packed React 18.3.1 and 19.3.0): extend the single consumer fixture additively (keep the single React type import and all earlier scenes): import `AttachmentField` and the five types; typed sample props; strict negatives with `@ts-expect-error` for `value` without `onValueChange`, `value` plus `defaultValue`, a non-`image/` entry in `acceptedTypes`, `onPaste`, `ref` and `asChild`; an SSR scene; a jsdom CSR scene (paste a file, see the thumbnail, remove it, focus lands on the Dropzone, object URLs stubbed); and an `assertAttachmentFieldCSS` helper, serialized in the three places the Dropzone helper is (entry, native Vite, Tailwind), checking the emitted CSS contains the `w-20`, `absolute`, `end-1`, `top-1`, `list-none` selectors from `types.ts`. The 255-token pin is unchanged.

### 5.2 Prop-naming registry (`skills/_shared/prop-naming.json`, then `pnpm props:docs`)

Lookup already ran in the spec (173 entries). Entries to add or extend, nothing migrated:

| Action | ID / name | Usage to append (component `AttachmentField`, source `packages/ui/src/molecules/attachment-field/types.ts`, symbol `AttachmentFieldProps`) |
| --- | --- | --- |
| New C1 | `accepted-file-types` / `acceptedTypes` | `` readonly `image/${string}`[] `` |
| New C2 | `max-file-bytes` / `maxFileBytes` | `number` |
| New C3 | `max-file-count` / `maxFiles` | `number` |
| New C4 | `files-rejected` / `onFilesRejected` | `(rejections: AttachmentRejection[]) => void` |
| Usage | `accessible-name` / `label` | `string` |
| Usage | `primary-value` / `value` | `File[]` |
| Usage | `initial-uncontrolled-value` / `defaultValue` | `File[]` |
| Usage | `interactive-value-change` / `onValueChange` | `(files: File[]) => void` |
| Usage | `localized-messages` / `messages` | `Partial<AttachmentFieldMessages>` |

- The four new entries copy the approved payloads from the spec's "Conventions to approve" verbatim (`id`, `name`, `meaning`, `whenToUse`, `avoid`, `status: approved`, `aliases: []`, `exceptions: []`), with the `usages` array added.
- **The validator rejects `status: approved` with `approval: null`** (`scripts/prop-naming.mjs`: approved conventions need `{reference, scope: 'convention:<id>', contentHash}` where `contentHash` is the digest of the convention payload; `reference` must be a recoverable repository file or HTTPS URL). The spec JSON shows `approval: null`. The plan therefore adds an approval record `docs/decisions/prop-naming-attachment-field-approval.json` in the existing `human-approval-record` shape (precedent: `prop-naming-web-section-approval.json`), quoting the owner's recorded reply "Acepto todas las recomendaciones" (spec header, 2026-11-19) as provenance for C1–C4, and each entry's `approval.reference` points to it. This requires parent/owner confirmation (OQ1); the plan does not invent consent beyond that recorded reply.
- Usage `source.revision` is `sha256:<whole-file byte hash>` of the **final** `types.ts` (computed last, after any lint or format edit; any later change to `types.ts` requires recomputing). Use `status: 'existing'` once implemented.
- Commands: `pnpm props:docs` (regenerates `docs/prop-naming.md`), `pnpm props:check`, `pnpm test:props`. If the `prop-naming.test.mjs` suite filters post-receipt entries by exact convention/source pairs (as the Dropzone record describes), add the five exact pairs there.

### 5.3 Catalog row

`scripts/catalog_data.py`, one new tuple in the molecules block: current `—`, level `—`, new `AttachmentField`, level `molecule`, destination `ui`, Radix `—`, composes `Dropzone, PhotoFrame, IconButton, FieldMessage, Cluster, Stack, VisuallyHidden`, action `nuevo`, English note with the approved spec link (`docs/components/attachment-field/v0.1/spec.md`). Then `python3 scripts/build_catalog.py` regenerates `docs/CATALOGO.md` and the other catalog outputs; the generated files are never edited by hand. The row is written only with the implementation (a provisional row is not enough to claim availability).

### 5.4 System artifact

`pnpm artifact --write` (then `pnpm system:docs`; verify with `pnpm test:artifact`, `pnpm system:check`, `pnpm test:system`).

- Expected additive changes in `packages/system/design-system.json`: catalog 109 → 110, one new `components` entry for `AttachmentField` (public value; the artifact currently lists 185), `propNaming` 173 → 177 (four new conventions), new usage records, and `system.md` regenerated. The five types and the composition record are derived by the generator; the exact counts are read from the diff, not assumed.
- **Do not change:** the token count (313) and every CSS variable/token count, the 255-token assertion in the packed fixture, `theme.css`, `tokens.css`. The component uses existing utilities (`w-20`, `top-1`, `end-1`, `gap-2`) only. `anatomyUtilities` (358) can only change if the generator records new utility names; any such diff is reviewed, not suppressed.
- No `package.json` version bump or changelog in this work: release (`release:pack`) stays a separate parent step.

## 6. Verification plan

### 6.1 Local gates (CI Verify job, in order; run before the PR)

`pnpm lint` → `pnpm props:check` → `pnpm test:props` → `pnpm typecheck` → `pnpm build` → `pnpm test` → `pnpm test:cli` → `pnpm --filter @egdev/tokens run test` → `pnpm test:package-exports` → `pnpm test:package-consumption`. Because the artifact and catalog change, also run (not in CI Verify, repo hygiene): `python3 scripts/build_catalog.py` (idempotent), `pnpm artifact --write`, `pnpm system:docs`, `pnpm test:artifact`, `pnpm system:check`, `pnpm test:system`. Run focused first: `pnpm exec vitest run packages/ui/src/molecules/attachment-field packages/ui/src/atoms/dropzone packages/ui/src/lib --maxWorkers=2`. Use the repo's serialized/capped practice for the heavy gates (`docs/decisions/test-worker-budget.md`). The `cli-consumer` job is unaffected.

### 6.2 Real browser (Playwright, Chrome; Storybook on 127.0.0.1:6006 after `pnpm tokens`)

Never records an approval and never replaces a reference. Captures go to `docs/components/attachment-field/v0.1/` (canonical path for spec v0.1) with conditions: viewport px, device scale, browser version, dark theme, loaded fonts, motion/transparency settings, component-zone crop, date and tool.

1. **Paste from the Textarea:** `WithTextarea` story: grant `clipboard-read/write`, write a PNG blob with `navigator.clipboard.write`, focus the Textarea, press Ctrl+V (a trusted event). Confirm the thumbnail appears, focus stays in the Textarea, and a text paste afterwards still enters the Textarea. A second pass dispatches a synthetic `ClipboardEvent` carrying a `DataTransfer` file for the mixed-flavor case.
2. **Paste from a descendant and outside:** paste in another child control of the root works; an input outside the root does nothing.
3. **Drop and pick:** drop a file on the Dropzone, pick through the native chooser handler (`setInputFiles`), confirm the same validation.
4. **Rejections:** `Validation` story with a `.bmp`, an oversized file and a sixth file: one error per rule in the order type → size → count with the error glyph, `aria-describedby` on the Dropzone button, status region text (read from the accessibility snapshot); next intake and removal clear them.
5. **Focus order and removal:** Tab order (Textarea → Remove buttons → Dropzone); remove the middle, last and only item and observe `document.activeElement` each time (next → previous → Dropzone); Enter and Space on Remove.
6. **Reduced motion:** `page.emulateMedia({ reducedMotion: 'reduce' })`; confirm the component's own parts have no transition/animation computed styles; composed atoms' `motion-reduce:` unchanged.
7. **Layout:** `ManyItems` at a 320 px host: five 64 px thumbnails wrap inside the root; RTL (`dir='rtl'`) places the Remove button at the logical end corner.
8. **Touch and contrast:** measure the Remove box (expected 25.6 px); pointer-coarse/touch emulation to document the limitation; contrast of the outline button's glyph over a light and a dark screenshot (AC-26).
9. **Controls panel:** the Storybook Controls show the six own widgets (label text, `maxFileBytes`/`maxFiles` number, `disabled` boolean, the rest disabled with reasons) with zero metadata diagnostics.
10. **Not verifiable here:** real screen-reader behavior for repeated identical announcements (R3), a real OS picker, touch hardware.

Visual references: VIS-01 (empty field), VIS-02 (three thumbnails with Remove buttons), VIS-03 (rejection message), VIS-04 (disabled with a populated strip) are captured from the stories as **Proposed** references only after the owner authorizes that (OQ7). Until then every VIS row and visual conformity stay **Not evaluated**. Captures never substitute for the behavior and accessibility tests.

## 7. Commit units (reviewable, ~400 lines each, Conventional Commits)

Intermediate commits keep the tree green: the folder `index.ts` exists from the first unit, but the barrel export waits for unit 3 so `package-exports` is never half-registered.

| # | Commit | Content | Approx. size |
| --- | --- | --- | --- |
| 1 | `feat(ui): add AttachmentField list, paste and validation` | `types.ts`, `useAttachmentField.ts` (list, intake, validation, paste, rejection messages, message defaults), `AttachmentField.tsx`, `index.ts`, tests for AC-01–14, 20, 21 | ~450 |
| 2 | `feat(ui): add AttachmentField previews, removal and announcements` | same files extended: object URLs, strip, Remove, focus management, status region, disabled; tests for AC-15–19, 22, 23 | ~350 |
| 3 | `feat(ui): export AttachmentField and register its consumers` | stories; barrel line; `compiled.css`, `.storybook/main.ts`, `.storybook/preview.css`, `storybook-controls.test.ts`; `package-exports` and `package-consumption` additions | ~400 |
| 4 | `docs(ui): register AttachmentField naming, catalog and system artifacts` | registry JSON, approval record, regenerated `docs/prop-naming.md`, `scripts/catalog_data.py` and regenerated catalog, regenerated `design-system.json` and `system.md`, naming test pairs | mostly generated |
| 5 | `docs(ui): record AttachmentField v0.1 implementation and verification` | `docs/components/attachment-field/v0.1/implementation.md` (observed commands, RED/GREEN counts, browser results, captures, Not-evaluated list) | ~150 |

Complete-file commits only (no prefix-split of a test file). Commit 4 hashes `types.ts` after unit 3 is final. The parent owns commit, push and PR actions.

## 8. Risks

- **R1 (Gate: new public API, additive).** One new molecule and five types in the barrel; no existing API, token or dependency changes. Rollback is removing the folder and the registrations.
- **R2.** Focus restoration depends on DOM lookups (a Remove-button ref map, and the Dropzone's `eg-dropzone` marker because Dropzone has no ref). If Dropzone later changes its marker, the AC-19 test fails first. Controlled parents that apply a removal asynchronously still get focus moved when the list finally changes, unless focus moved elsewhere.
- **R3.** Repeated identical announcements: the keyed-span replacement is a best effort. Real screen-reader behavior is unverified by this plan.
- **R4.** `react-docgen-typescript` on the controlled/uncontrolled union may omit or merge rows; the Storybook controls test must prove the rows. Fallback needs owner consent (it would soften "required with `value`").
- **R5.** Object URL effects under StrictMode and React 18/19: covered by the StrictMode unit test and the packed matrix, but leak freedom beyond `createObjectURL`/`revokeObjectURL` call counts is a count-balance proof, not a memory measurement.
- **R6.** The Remove button is 25.6 px (Q7, accepted). The 64 px thumbnail is partly covered by the corner button.
- **R7.** Clipboard testing in real Chrome relies on clipboard permissions; the synthetic `ClipboardEvent` path is untrusted-event evidence only.
- **R8.** Mixed Office clipboard content is replaced by the picture (Q4 A, accepted).
- Not applicable: concurrency, persistence, network, security-sensitive data (no upload, storage or network; files and object URLs stay in the browser).

## 9. Open questions and plan-level decisions to confirm

Approving this plan approves the items below as written; none changes a spec promise except where stated.

- **OQ1 — Approval record for C1–C4 (needs a decision).** The registry validator requires an approval record for `status: approved`. Proposal: add `docs/decisions/prop-naming-attachment-field-approval.json` quoting the owner's recorded reply. Alternative if the owner will not accept that provenance: register C1–C4 as `proposed` (`approval: null`), which contradicts the spec's "approved" wording and blocks nothing else.
- **OQ2 — Dropzone `multiple` and default `accept` (derived).** `multiple` is always on so the count rule is reachable from picks and drops; the picker `accept` is `image/*` when `acceptedTypes` is omitted. Neither is stated verbatim in the spec.
- **OQ3 — `acceptedTypes` edge inputs (derived).** An empty array behaves like an omitted prop (`image/*`), and an entry that does not start with `image/` at runtime (only possible from untyped callers) is ignored. No error or warning.
- **OQ4 — Root is `Stack asChild` over a `div` with an internal ref** (Stack has no ref). Same DOM as the spec's anatomy; no public ref.
- **OQ5 — Recipe export.** The spec lists the component and five types only, so `attachmentFieldVariants` is not exported (unlike Dropzone and Tabs). Recommended: keep it internal as specified; exporting it later is additive.
- **OQ6 — Focus guard.** Beyond the spec, restoration is skipped when focus has already moved off `body`, and pending intent is cleared at the next intake or removal. Consistent with the spec's "dropped" rule for unapplied controlled requests.
- **OQ7 — VIS captures.** Capturing the stories as Proposed references needs the owner's authorization (the spec has no source artboard). Without it, VIS-01–04 stay pending.
- **OQ8 — Default message strings** in 2.4 are plan-fixed (the spec delegates them); the empty-name fallback word `Image` and the 1.5 MB / KB-rounding rule are plan-level details.
