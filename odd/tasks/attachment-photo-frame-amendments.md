# AttachmentField v0.1.1 and PhotoFrame fit amendments (#508, #509)

Draft two independent spec amendments from the owner-approved cataloging (Engram `catalog/508-509-attachment-reset-readonly-images`).

## Specs

- S1 — #508: AttachmentField v0.1.1. Clear rejection messages on ANY external controlled `value` change (parent reset or replacement), detected against the last list the field itself requested (entry-by-entry File references, so a parent echo — even a copied array — keeps a mixed-intake message). Silent (no announcement), focus unchanged, no API. Owner answer: "Cualquier cambio externo (Recomendado)".
- S2 — #509: PhotoFrame `fit: 'cover' | 'contain'` variant (new prop-naming convention; `ratio` avoids object-fit), default `cover` unchanged. Owner answers: "Variante fit en PhotoFrame (Recomendado)", "No por ahora" (no extraction), "No, lo compone la app" (enlarge is app-side).
- S3 — Output: short amendments, status "Draft — not approved", contentSHA256 "Pending approval", following each component's latest approved format.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1, S3 | AttachmentField v0.1.1 amendment draft | worker | see L2 |
| T2 | S2, S3 | PhotoFrame fit amendment draft | worker | see L2 |
| T3 | S1, S2 | Joint implementation plan (owner approval) | worker | see L3 |

## Log

- L1 — Owner chose to catalog Recado's issues; answers: #508 "Cualquier cambio externo (Recomendado)"; #509 "No por ahora (Recomendado)", "Variante fit en PhotoFrame (Recomendado)", "No, lo compone la app (Recomendado)".
- L2 — Drafts written; owner: "Acepto todas" (AF-1 filter/transform counts as external; AF-2 standalone until next minor; PF-1 convention `image-fit`/`fit`; PF-2 no `data-fit`; PF-3 focalPoint active under contain; PF-4 letterbox shows the existing Surface; PF-5 story note only). Approved hashes: AttachmentField v0.1.1 3803812f…, PhotoFrame v0.5 f2012624… (both re-verified by the parent).
- L3 — Joint plan at docs/components/photo-frame/v0.5/implementation-plan.md; owner: "Apruebo con las recomendaciones" (Reset story; release separate; VIS-07/08 authorized; fingerprints inline). First push failed on the load-sensitive Heading packed-fixture typecheck (timed out while a worker ran in parallel); push again with no concurrent workers.
