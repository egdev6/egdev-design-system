# Input v0.2 — editable loading with Spinner

- **Canonical issue:** [#59](https://github.com/egdev6/egdev-design-system/issues/59); publish this delta as a comment, not a body replacement.
- **Previous snapshot:** v0.1 in the canonical issue body; [implementation evidence](../v0.1/implementation.md).
- **Request:** [#177](https://github.com/egdev6/egdev-design-system/issues/177), T3/S5 in [component iteration](../../../../odd/tasks/component-iteration.md), Specs and Log L2.
- **Status:** amendment draft for parent publication. The owner approved composing Spinner in Input; editability is the delegated recommendation adopted below, not a claim that this exact document has a published approval.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: c60f3d6d764b47438daf173da37ab99dc637d8abbf300bbabcad91e1cb94bf78`; `visualHashes: Pending`; `approvalReference: odd/tasks/component-iteration.md#log (L2, direction only)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/59`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings including the final newline; tracking metadata is excluded.

## 1. Purpose and scope

Extend the existing bare text-control atom with optional pending-activity feedback. Compose the existing Spinner atom; do not reclassify it as a primitive or duplicate its glyph/animation. Labels, hints, errors, request timing, results and announcements remain consumer responsibilities. No new control, Field implementation or dependency is needed. All unmodified v0.1 promises remain in force.

## 2. Anatomy and composition

`span.eg-input` remains the root around the optional decorative leading icon and native input. When loading, append a pointer-inert, aria-hidden trailing span containing the unlabelled `Spinner size='sm'`. Both supported input heights use the same existing 16px spinner preset, matching the leading slot. The control independently reserves leading and trailing space, so the icon and spinner can coexist. No Radix text-entry primitive applies; the native input owns editing, focus, selection and forms.

## 3. Public API

| Added prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `loading` | `boolean` | No | `false` | Show the trailing decorative Spinner and set native input `aria-busy=true`; do not disable editing. |

Existing size (`md`/`sm`), variant (`default`/`code`), type, icon, native attributes, controlled/uncontrolled values, native onChange and input ref are unchanged. `loading` is consumed and never forwarded as a native attribute. `className` stays on the root for supported layout only.

Registry lookup: reuse `loading` → `pending-activity`, matching Button's public name and host-owned busy/announcement split; append Input usage without changing global convention approval. Existing mappings remain `size` → `preset-dimensions`, `variant` → `visual-treatment`, `icon` → `leading-icon`; type is a narrowed native attribute. See the [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md). Reviewed source: `packages/ui/src/atoms/input/types.ts#InputProps`; whole-file revision `sha256:d1e0800b018aad6f413a263a6f5167c8eb1ebcecb8242a880e455f254a43a16b`.

**Component-specific semantics:** the existing approved `pending-activity` wording describes an action that cannot be activated again. Unlike Button, Input is an editable text control, not a repeat-activation action: loading does not guard change events. This amendment records that bounded difference and does not silently broaden the global convention, rewrite its historical receipt or introduce a naming alias/exception.

## 4. Behavior

| State / action | Result |
| --- | --- |
| Omitted or false loading | No trailing slot or extra trailing padding; consumer aria-busy passes through unchanged. |
| Loading true | One decorative Spinner, trailing space and aria-busy=true on the native input, even if consumer aria-busy was false. |
| Type while loading | Input remains focusable/editable; native onChange and controlled/uncontrolled behavior remain unchanged. |
| Loading with disabled/readOnly | Explicit native restrictions still apply; loading does not override them. |
| Loading ends | Spinner and extra padding disappear; derived busy state clears or restores the consumer value without replacing the input. |

The consumer owns async work, cancellation, debouncing, submission/re-entry policies and completion feedback. This is not determinate progress or a live status message.

## 5. Accessibility

The native input retains its consumer-supplied accessible name and descriptions. aria-busy marks activity without aria-disabled or readOnly side effects. The spinner and slot are decorative, with no label, role=status or duplicate live announcement. Consumers provide appropriately placed status text/live regions if needed, mirroring Button's announcement ownership. Keyboard, native restrictions, ref target and existing focus treatment remain unchanged. Spinner already suppresses its animation under reduced motion.

## 6. Appearance and implementation boundary

- Preserve the Material well, typography, invalid, focus, disabled and read-only recipes; no new paint or flat replacement.
- Trailing slot uses token utilities `absolute right-3 flex size-4 items-center justify-center text-fg-muted pointer-events-none`, centered by the existing root flex context. Loading adds `pr-9`, independently of leading `pl-9`; spacing comes from the existing token-bound scale.
- `types.ts` owns the public prop/JSDoc and static CVA loading offset/trailing slot; `useInput.ts` derives loading, busy semantics and per-part `cn()`; `Input.tsx` composes Spinner in JSX. Colocated tests and stories cover the addition; `index.ts` preserves existing exports. **No stylesheet**, additional internal module, token/dependency change or legacy CSS edit.
- Root layout classes merge last through `cn()`; internal slots have no appearance override API. Existing twMerge/cascade limits remain.

### Visual evidence

The v0.1 Field board remains historical, not evidence for the new spinner. No v0.2 screenshot or actual Controls-widget check was obtained: **visual: not evaluated**. Parent review should inspect Loading and LoadingWithIcon at both sizes, default/code treatment, disabled/read-only and reduced motion. Capture conditions, image hashes and image approval remain pending; no images or approval are fabricated.

## 7. Acceptance criteria

| ID | Promise | Evidence / review |
| --- | --- | --- |
| I2-01 | loading defaults false, is documented as a boolean and never leaks to DOM | Unit/hook checks; real docgen/Controls tests and registry source checks. |
| I2-02 | Trailing Spinner is decorative and text has reserved space at both sizes, with/without leading icon | Unit composition cases; updated CSS and packed-consumer fixtures, execution reported separately. |
| I2-03 | Loading stays editable and preserves native change semantics | userEvent typing, ref/focus and controlled rerender cases. |
| I2-04 | Derived aria-busy overrides false while loading, then restores consumer semantics | Unit rerender cases; no status-region assertion. |
| I2-05 | Explicit disabled/readOnly restrictions and reduced motion remain effective | Native restriction tests; existing Spinner motion utilities; browser review pending. |
| I2-06 | Existing well recipe, root layout and public exports remain intact | Existing tests retained; updated metadata and export fixtures. |

Test-first evidence: the focused Link/Input command initially observed 9 failures and 24 passes, including absent Input aria-busy and trailing offset; the implementation then passed all 33 tests. Final integration and root-gate outcomes belong in the writer handoff. Packed consumers and emitted CSS are not claimed evaluated without running those gates. This draft authorizes no remote publication or terminal Git action by the writer.
