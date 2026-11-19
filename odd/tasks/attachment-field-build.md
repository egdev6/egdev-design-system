# AttachmentField v0.1 — implementation (#497)

Implement the approved spec `docs/components/attachment-field/v0.1/spec.md` (contentSHA256 47db068c2d055ad342efb895e513db27a258ddef661ee134d4ff42248f5aa7ad) following the approved plan `docs/components/attachment-field/v0.1/implementation-plan.md`. Branch `feat/attachment-field` (on top of `docs/attachment-field-spec`, PR #498; rebase on main after it merges).

## Specs

- S1 — Approved spec v0.1, AC-01–AC-26 (owner: "Acepto todas las recomendaciones").
- S2 — Approved plan (owner: "Apruebo, con el registro de aprobación (OQ1)"): OQ1 approval record `docs/decisions/prop-naming-attachment-field-approval.json`; OQ2–OQ8 as proposed in plan section 9; VIS-01..04 captures authorized.
- S3 — Commit units exactly as plan section 7 (units 1–5), complete-file commits, tree green after each.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S3 | Unit 1: list, paste and validation (AC-01–14, 20, 21) | worker | pending |
| T2 | S1–S3 | Unit 2: previews, removal, focus, announcements, disabled (AC-15–19, 22, 23) | worker | pending |
| T3 | S1–S3 | Unit 3: stories, barrel export, Storybook wiring, package fixtures | worker | pending |
| T4 | S1–S3 | Unit 4: prop-naming registry + approval record, catalog, system artifact | worker | pending |
| T5 | S1–S3 | Unit 5: browser verification, VIS captures, implementation record | worker | pending |

## Log

- L1 — Owner: "en orden" (merge #498, then plan, then catalog #499/#500); plan approved with "Apruebo, con el registro de aprobación (OQ1)".
- L2 — Unit 1 done by worker (RED: module not found → GREEN 52/52; molecules 1013/1013; Biome and typecheck clean). Deviations: empty status region until unit 2; hook returns resolved messages; `onChange` omitted from native props; plan's fixed default strings read "1 files" / "at most 1 attachments" → parent decision: make the defaults singular/plural-correct in unit 2 (no API change).
