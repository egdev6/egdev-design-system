# Field v0.2 — FieldMessage composition

Keep Field's public hint/error inputs and relationship behavior; delegate the annotation to FieldMessage and add non-error guidance tones. Field remains the only owner of validation wiring.

- **Status:** consolidation of the owner-approved API, staged plan and visual/icon decisions, not an independent per-payload approval.
- **Canonical issue:** [#84](https://github.com/egdev6/egdev-design-system/issues/84); [v0.1 approval](https://github.com/egdev6/egdev-design-system/issues/84#issuecomment-6251504375), canonical payload sha256:8da041653613d30b20fbe54532467830d58ad79218592eb0bbbcc0ee151d4361. Original body/history and local v0.1 artifacts remain unchanged.
- **Related contract:** [FieldMessage v0.2](../../field-message/v0.2/spec.md), issue #179; [decision record](../../field-message/v0.2/approval.json).
- **Identity:** amendment canonical contentSHA256: sha256:a605172e22d2d18323a9609d6814c3aa386868b31ab74ecefbd6d8e1fa07b173. Hash UTF-8 from the anchored `## 1. Scope` heading through EOF, LF with final newline. This is a delta identity, not a reconstructed full-spec hash. Unmentioned v0.1 promises remain unchanged.
- **Publication:** local only; this amendment has not been posted to #84.

## 1. Scope

Extract hint/error rendering into the passive FieldMessage atom. Do not change the Label, compatible control set, Radix Slot ownership, control value, counter/readout rules, layout choices, hidden label or native root forwarding. No new Hint component, form engine, announcement owner or Notice/Toast dependency.

## 2. Compatible API

Existing `hint?: string` and `error?: string` remain unchanged. Add `hintTone?: Exclude<FieldMessageTone, 'error'>`, default `description`, with values description/info/warning/success. It applies only to the hint, never to the Field root/control appearance or validation.

New name `hintTone` is recorded as the proposed `field-guidance-tone` convention (subordinate guidance and existing error precedence), with no automatic global approval. Existing field-hint/field-error conventions and approved generic tone semantics remain unchanged; no aliases or mass migration.

## 3. Precedence and state

| Input | Visible annotation | Field/control validity |
| --- | --- | --- |
| hint, no error | Hint text with selected hintTone | No new invalidity |
| non-empty error | Error text/tone, replacing hint regardless of hintTone | Existing data-state=invalid and aria-invalid=true behavior |
| empty error | Hint if non-empty | Existing no-error behavior |
| no non-empty text | No annotation or associated id | No dangling message description |
| hintTone changes during error | Error stays unchanged | Still invalid |
| error cleared | Hint returns in selected tone, if present | Existing recovery |

Semantic-tone glyphs follow the adopted FieldMessage defaults. This intentionally adds a decorative circle-alert to errors and glyphs to info/warning/success guidance; default description stays icon-free. No tone alone creates a live region or moves focus.

## 4. Wiring and composition

- Keep useId-based stable control/message/counter ids. FieldMessage receives the generated message id, resolved text and resolved tone.
- Keep Slot's child-first aria-describedby ordering/deduplication and existing explicit child aria-invalid precedence/unsupported conflicts; no custom merge engine.
- Slider still receives its relationships and invalidity at the focusable thumb under its existing contract. Label association and consumer refs remain unchanged.
- One Field-owned wrapper positions the message under the choice label and applies disabled opacity once. The paragraph itself has no Field-disabled opacity. No extra role, id or tab stop on the wrapper.
- Preserve eg-field, native root attributes, root-only supported layout className and absence of a Field ref/asChild API. FieldMessage adds its own eg-field-message marker, not a replacement root.

## 5. Appearance and evidence

Description/error retain the existing 14px/400 annotation typography and neutral/danger tokens. Info/warning/success use existing status tokens. Controls own their wells/borders/focus; FieldMessage adds no painted surface, shadow, motion or validation border.

[Adopted five-tone specimen](../../field-message/v0.2/field-message-five-tones.png) SHA-256 e062352f2575b76979b04899decb3acb218ac6b6fd85e7e1c2a656271f7a6b56 and its [metadata](../../field-message/v0.2/capture.json) establish visual direction, not runtime verification. #84's historical visuals retain their original identities and limited scenarios. No new token, package or stylesheet.

## 6. Implementation and regression scope

Change only Field's existing files, the extracted atom, the approved three-glyph Icon extension and their package/docs/metadata/consumer integrations. No additional internal module. Keep all existing Field assertions; change DOM locators only where the approved paragraph/text/wrapper anatomy moves the same observable responsibility.

Required cases: all hint tones without invalidity, error precedence/recovery, empty text, id stability, description ordering/deduplication, explicit conflicting child invalid props, Slider thumb semantics, choice layout/label behavior, disabled parts dimmed once and consumer control refs retained. Validate actual docgen/enhancer controls, emitted CSS and public React18/19 packed SSR/client composition.

## 7. Authority and delivery

The owner approved the compatible API, staged implementation plan, specimen, glyph additions and semantic icon defaults in conversation. The associated local record does not invent remote approval URLs or promote registry proposals. Browser/AT/functional results must be reported from actual checks; the approved image is not proof of runtime conformity. No commit/push/PR/merge or remote issue amendment is authorized by this document.
