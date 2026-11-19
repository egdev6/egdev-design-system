# AttachmentField spec v0.1 (#497)

Draft the individual spec for the new `@egdev/ui` molecule that attaches pasted or dropped images with validation and a removable preview strip, requested by Recado in issue #497. Branch `docs/attachment-field-spec`.

## Specs

- S1 — Approved cataloging (Engram `catalog/497-attachment-field`): compose a generic molecule in `@egdev/ui`, working name `AttachmentField`, `packages/ui/src/molecules/attachment-field/`; reuses Dropzone (unchanged), PhotoFrame, IconButton, FieldMessage, Cluster, VisuallyHidden; Radix base none; no new dependencies. Owner: "Sí, va a @egdev/ui".
- S2 — Issue #497 acceptance needs (Recado): paste (Ctrl+V of a screenshot) from the Textarea or the containing form, type/size validation, thumbnail strip with a remove action and an accessible name.
- S3 — Open owner decisions to present with a recommendation each, never resolved silently: Q2 controlled vs uncontrolled list; Q3 images only vs any file; Q4 mixed clipboard (image + text/HTML); Q5 focus after removing the last item and Dropzone visibility at max count; Q6 thumbnail size token mapping; plus every new prop-naming convention.
- S4 — Output: a draft spec following `skills/component-spec-proposer/SKILL.md` and `skills/_shared/component-spec-template.md`, saved at `docs/components/attachment-field/v0.1/spec.md`, status "Draft — not approved".

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S4 | Draft spec v0.1 with open decisions | worker | see L2 |
| T2 | S3 | Owner decisions, approval, issue handoff comment on #497 | inline | c0b43e4, PR #498, #497 comment |
| T3 | S1, S4 | Implementation plan (separate owner approval) | worker | see L4 |

## Log

- L1 — Owner: "catalogala" → cataloging approved with "Sí, va a @egdev/ui"; then "dale" to start the spec.
- L2 — Worker drafted `docs/components/attachment-field/v0.1/spec.md` (Q2–Q7 plus C1–C4, each with a recommendation). Owner: "Acepto todas las recomendaciones" → spec v0.1 approved; contentSHA256 recorded in the spec header. Next: commit, issue handoff comment on #497, then the implementation plan (separate approval).
- L3 — PR #498 opened (CI green); handoff comment posted on #497. Merge blocked by branch policy (needs owner; no --admin without explicit authorization). Owner: "en orden" → plan next.
- L4 — Plan written by worker; owner approved: "Apruebo, con el registro de aprobación (OQ1)". Implementation tracked in `odd/tasks/attachment-field-build.md`.
