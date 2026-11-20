# AttachmentField v0.2 — resetKey (#516)

Add an explicit, declarative reset signal so a controlled consumer that saves with its own handlers can clear a rejection when `value` is already empty. Requested by Recado (#516). Branch `docs/attachment-field-reset-key` (spec + plan), then a feature branch.

## Specs

- S1 — Cataloging (owner-approved, option c): new optional prop `resetKey` (new prop-naming convention; no precedent in the registry). Changing its value (`Object.is`) after mount clears transient state; the first value does nothing. No remount, no focus move, silent. Owner answers: "(c) Prop token (Recomendado)", "resetKey (Recomendado)".
- S2 — Scope: transient state only (rejection messages and the hidden status region); the list is untouched in both modes. Owner: "Solo lo temporal (Recomendado)".
- S3 — Status region: emptied silently on the new reset AND on v0.1.1 external clears; AC-14d (which asserts the status text stays) changes accordingly. Owner: "Sí, también en la v0.1.1 (Recomendado)".
- S4 — Typing re-renders never clear (the token only changes when the consumer saves). Version: AttachmentField v0.2 (new prop) → ui minor. AC-01 "no ref or asChild API" stays true.
- S5 — Output: amendment `docs/components/attachment-field/v0.2/reset-key-amendment.md`, status "Draft — not approved", contentSHA256 "Pending approval".

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S5 | Amendment v0.2 draft | worker | see L2 |
| T2 | S1–S5 | Implementation plan | worker | see L3 |
| T3 | S1–S5 | Implementation, verification, consolidated spec, release | inline/worker | pending |

## Log

- L1 — Recado opened #516 (empty list → rejected paste → save → value [] → [] keeps the message; saves with its own handlers, no <form>). Owner chose a new issue, then the four answers quoted in S1–S3.
- L2 — Draft written (convention `transient-feedback-reset-key` / `resetKey`; AC-27–31, AC-14d revised). Owner: "Apruebo todo (recomendado)" — amendment and convention approved; consolidated spec (v0.1 + v0.1.1 + v0.2) as a separate docs task before release. contentSHA256 3d83fc4b….
- L3 — Plan at docs/components/attachment-field/v0.2/implementation-plan.md; owner: "Apruebo con las recomendaciones" (parent runs builds/artifact/package-release; Chrome verification, screen reader Not evaluated; ui minor after the consolidated spec). Added to PR #517.
- L4 — Unit 1: the worker wrote AC-27–31 and the revised AC-14d tests, then stopped twice because it would not run Vitest (env-file/cache caution), so the parent ran RED (11 failed/87 passed, then 8 failed/90 after the worker's helper fix — failures on uncleared rejections and non-empty status) and implemented inline: `resetKey` in types.ts (English JSDoc, `@control false`), a shared silent `clearFeedback()` (rejections + status text) used by the v0.1.1 external clear and by an Object.is token change tracked in render state (mount value inert). Controlled story: `acceptedTypes={['image/png']}` and "Clear after save" bumps `resetKey`. GREEN 98/98; with controls/docgen 516/516; typecheck and Biome clean.
- L5 — Unit 2 by worker: `transient-feedback-reset-key` convention + approval record docs/decisions/prop-naming-attachment-field-reset-key-approval.json, 9 AttachmentField usage revisions refreshed, controls row (11→12), docgen checks, consumption fixtures. The worker stopped on an approval-hash mismatch caused by its own new test (sliced from the first textual match of `## 1. What changes`, inside the hash-definition line); parent fixed it to slice from the heading line, so the approved 3d83fc4b… stands. Parent also applied Biome formatting and typed the docgen `tags` lookups (typecheck had failed on `{}`). props 131/131, AttachmentField+lib 714/714.
- L6 — Unit 3 by parent: build, artifact (system.md gains `resetKey`), artifact 34, cli 115, tokens 72, consumption 14, package-release 24 all pass. Chrome: Recado's exact flow passes (empty list → rejected svg → typing keeps it → Clear after save with bumped resetKey clears message, aria-describedby and status; focus stays on the Textarea). Record: docs/components/attachment-field/v0.2/implementation.md.
- L7 — Independent verify (Risk item 3): pass, no blockers (implementation matches §2; main's tests against HEAD fail only the intended AC-14d; registry revisions and amendment hash correct). Its first focused run had 6 unnamed failures under load and passed on rerun; the parent reran with full output at load 8: 714/714 (load-sensitive, see #513). Waiting for the owner to merge #518 before rebasing this branch onto main.
