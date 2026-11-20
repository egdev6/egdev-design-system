# AttachmentField v0.1.1 — reset amendment (#508)

- **Version / status:** v0.1.1 — **Approved — 2026-11-20 by the owner (reply "Acepto todas"); filter wording clarified the same day (reply "Mantener el mensaje (recomendado)")**. Amends the approved v0.1 (`../v0.1/spec.md`); every v0.1 promise not listed here is unchanged.
- **Owner decision:** "Cualquier cambio externo (Recomendado)": clear rejection messages on any external controlled `value` change.
- **Snapshot identity:** `version: v0.1.1`; `contentSHA256: 3803812f0f16bb755328c8d10b72bbea3f341e393c475eb96ad2e9bba1c158a0`; hash definition as in v0.1 (SHA-256 of the UTF-8 payload from `## 1. What changes` through EOF, LF line endings, final newline; metadata above that heading is excluded); `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/508`; `approvalReference: owner reply "Acepto todas", 2026-11-20; canonical issue #508 — this file is the recoverable snapshot`.
- **Evidence:** `useAttachmentField.ts` clears `rejections` only in `intake` (replaced) and `remove`; a controlled parent reset leaves them visible. `gh issue view 508` returned no output in this session, so the issue text was not re-read; the problem statement comes from the task brief. The note on repro step 2 below is an inference, not confirmed.

## 1. What changes vs v0.1

| v0.1 | v0.1.1 |
| --- | --- |
| Behavior row (spec :255) "Next intake, or any removal → previous rejection messages are cleared" | Adds: "**Or any external change of a controlled `value`** → messages are cleared, silently." |
| AC-14 covers next intake and removal only | AC-14 unchanged; new AC-14a–14d below |

## 2. Detection rule (controlled only)

The hook keeps the last list it passed to `onValueChange` (`requested`). A render is an **external change** when `value` is defined and its entries differ, entry by entry (`length` and `value[i] === requested[i]` by `File` reference), from `requested`, and also from the `value` of the previous render. Then `rejections` become `[]`. A filtered or transformed list therefore clears only when it differs from the previous `value`: a parent that filters the request back to exactly the list it already had keeps the messages, because no rejection they describe has become untrue.

- A parent echo of the requested list, including a **copied array** with the same `File` references, is not external, so a mixed intake (some accepted, some rejected) keeps its messages.
- Reset to `[]`, replacement with other files, or any other differing list is external and clears.
- An intake with no accepted files does not call `commit`, leaves `value` unchanged and keeps its messages.

## 3. Behavior

- **Silent:** no `status` announcement for the clearing.
- **`aria-describedby`:** the Dropzone loses it together with the messages (already derived from the rendered messages).
- **Focus:** unchanged; the field never moves focus on a reset. A removal's pending focus intent behaves as in v0.1.
- **Uncontrolled:** unaffected (`value` undefined; internal changes only come from intake/removal).
- **API / prop naming:** no prop, type or export change; no registry entry. **Compatibility:** additive behavior; consumers that never change `value` externally see no difference.

## 4. Acceptance criteria and planned tests

| AC | Promise | Planned check |
| --- | --- | --- |
| AC-14a | Parent reset to `[]` after a rejection clears the messages and `aria-describedby`; focus stays on the Textarea | controlled harness with a reset button; assert `activeElement` |
| AC-14b | Echo of a mixed intake keeps the message, with the same array and with a copied array | two harness variants (`setValue(next)` / `setValue([...next])`) |
| AC-14c | Replacement with other files clears | rerender with different `File`s |
| AC-14d | Clearing adds no announcement; uncontrolled behavior and AC-14 sequence unchanged | status text before/after; existing AC-14 tests stay green |

## 5. Release impact

`@egdev/ui` patch (bug-fix behavior; no API change). Other packages untouched.

## 6. Note on #508 repro step 2

A single valid intake already clears prior messages (`AttachmentField.test.tsx:329-331`), so step 2 was most likely a **mixed** paste (valid + rejected files), where the messages stay by design until the next intake or removal.

## Owner decisions (resolved 2026-11-20)

The owner replied "Acepto todas", accepting both recommendations: (1) a parent that filters or transforms the requested list counts as an external change and clears the messages, matching "any external change" — clarified on 2026-11-20 (owner reply "Mantener el mensaje (recomendado)"): a filter that returns exactly the previous `value` is not a change and keeps the messages; (2) this amendment stays standalone and is folded into the spec at the next minor. The options below are kept as the record.

1. A parent that filters or transforms the requested list (e.g. dedupes) counts as external and clears. **Recommendation:** accept; it is the owner's "any external change" and is simplest to explain. **Resolved: accepted.**
2. Fold this amendment into `v0.1/spec.md` at approval or keep it standalone. **Recommendation:** keep standalone; fold into a consolidated spec only on the next minor. **Resolved: standalone; fold at the next minor.**
