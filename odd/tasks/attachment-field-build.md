# AttachmentField v0.1 — implementation (#497)

Implement the approved spec `docs/components/attachment-field/v0.1/spec.md` (contentSHA256 47db068c2d055ad342efb895e513db27a258ddef661ee134d4ff42248f5aa7ad) following the approved plan `docs/components/attachment-field/v0.1/implementation-plan.md`. Branch `feat/attachment-field` (on top of `docs/attachment-field-spec`, PR #498; rebase on main after it merges).

## Specs

- S1 — Approved spec v0.1, AC-01–AC-26 (owner: "Acepto todas las recomendaciones").
- S2 — Approved plan (owner: "Apruebo, con el registro de aprobación (OQ1)"): OQ1 approval record `docs/decisions/prop-naming-attachment-field-approval.json`; OQ2–OQ8 as proposed in plan section 9; VIS-01..04 captures authorized.
- S3 — Commit units exactly as plan section 7 (units 1–5), complete-file commits, tree green after each.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S3 | Unit 1: list, paste and validation (AC-01–14, 20, 21) | worker | c10d2e0 |
| T2 | S1–S3 | Unit 2: previews, removal, focus, announcements, disabled (AC-15–19, 22, 23) | worker | 05e883c |
| T3 | S1–S3 | Unit 3: stories, barrel export, Storybook wiring, package fixtures | worker | cc4225a |
| T4 | S1–S3 | Unit 4: prop-naming registry + approval record, catalog, system artifact | worker | b6334a2 |
| T5 | S1–S3 | Unit 5: browser verification, VIS captures, implementation record | inline | see L6 |

## Log

- L1 — Owner: "en orden" (merge #498, then plan, then catalog #499/#500); plan approved with "Apruebo, con el registro de aprobación (OQ1)".
- L2 — Unit 1 done by worker (RED: module not found → GREEN 52/52; molecules 1013/1013; Biome and typecheck clean). Deviations: empty status region until unit 2; hook returns resolved messages; `onChange` omitted from native props; plan's fixed default strings read "1 files" / "at most 1 attachments" → parent decision: make the defaults singular/plural-correct in unit 2 (no API change).
- L3 — Unit 2 done by worker (RED 25 failed/54 passed → GREEN 79/79; molecules 1040/1040; Biome and typecheck clean). Grammar decision applied: only the count rejection needed plural forms (single files are named by file name). Status span renders only when non-empty (keeps AC-02's empty region).
- L4 — Unit 3 done by worker (stories, barrel export, Storybook/CSS wiring, controls rows, export and consumption fixtures; R4 did not occur: docgen keeps all union rows). Parent fixes: reverted the build-regenerated design-system.json (unit 4 owns it); React 18 SSR warned `useLayoutEffect does nothing on the server` in package-consumption → switched the focus effect to a local `useClientLayoutEffect` (Carousel precedent); consumption 14/14 with 0 warnings, typecheck and build clean.
- L5 — Unit 4 done by worker: conventions accepted-file-types, max-file-bytes, max-file-count, files-rejected (approved, record docs/decisions/prop-naming-attachment-field-approval.json) and five AttachmentFieldProps usages; catalog row; artifact regenerated (propNaming 173→177, catalog 109→110, components 185→186; tokens unchanged). props:check, test:props 130, test:artifact 34, system tests 31 all pass.
- L6 — Unit 5 inline: Chrome 157 checks per plan 6.2 recorded in `docs/components/attachment-field/v0.1/implementation.md`; trusted OS paste not evaluable (harness clipboard unavailable even for a plain input); synthetic mixed paste, picker, rejections, focus order, reduced motion, wrap/RTL, disabled pass; Validation story fixed to use the DS Link; VIS-01..04 captured as Proposed.
