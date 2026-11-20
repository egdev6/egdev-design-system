# AttachmentField v0.1.1 reset and PhotoFrame v0.5 fit — implementation (#508, #509)

Implement the approved amendments (`docs/components/attachment-field/v0.1.1/reset-amendment.md`, cd7e6b88…; `docs/components/photo-frame/v0.5/fit-amendment.md`, f2012624…) following the approved joint plan `docs/components/photo-frame/v0.5/implementation-plan.md`. Branch `feat/attachment-reset-photo-frame-fit`, local only until PR #512 merges, then rebased on main.

## Specs

- S1 — AttachmentField v0.1.1: AC-14a–d (owner: "Acepto todas").
- S2 — PhotoFrame v0.5 fit: PF5-01–09 (owner: "Acepto todas").
- S3 — Plan approved ("Apruebo con las recomendaciones"): Reset button in the AttachmentField Controlled story; release separate after merge; VIS-07/08 authorized; fingerprints inline in PhotoFrame.test.tsx; commit units as the plan section on commits.
- S4 — Every CI Verify step locally before the PR.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1, S3 | Unit 1: AttachmentField reset fix (+ Reset story) | worker | a9f5116 |
| T2 | S2, S3 | Unit 2: PhotoFrame fit (+ Fit story) | worker | c241ff8 |
| T3 | S2–S4 | Units 3–4: controls/exports/consumer fixtures, `image-fit` registry + approval, artifact | worker | pending |
| T4 | S1–S4 | Unit 5: browser verification, VIS-07/08, records | inline | pending |

## Log

- L1 — Owner approved both amendments ("Acepto todas") and the joint plan ("Apruebo con las recomendaciones"); authorized `--no-verify` for the docs push under machine load.
- L2 — Units 1–2 by parallel workers: AttachmentField reset (RED 4 failed/83 → GREEN 87/87; extra guard: parent re-creating the array every render keeps the message without looping); parent removed a duplicate Reset story button ("Clear after save" already demonstrates the reset). PhotoFrame fit (RED 35 failed → GREEN 91/91; 18 default fingerprints pinned from the unmodified code; `PhotoFrameFit` exported; Fit story with a 300×900 tall fixture).
- L3 — Units 3–4 by worker: controls row (`fit: 'select'`, photoframe 6→7), package-exports/consumption (`PhotoFrameFit`, `object-contain`), `image-fit` convention + approval record docs/decisions/prop-naming-photo-frame-fit-approval.json, 4 PhotoFrame usage revisions refreshed, artifact regenerated. lib+AF+PF 793 tests, typecheck, props 130, artifact 34, system 31, exports 137, consumption 14 pass. PRs #511 and #512 merged; branch to be rebased onto main dropping the two docs commits.
