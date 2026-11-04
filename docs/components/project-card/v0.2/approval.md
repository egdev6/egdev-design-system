# ProjectCard v0.2 — spec approval record

- **Approved artifact:** `docs/components/project-card/v0.2/spec.md`
- **SHA256:** `f4b7c7bf56d8189727ea9727aae5ef80529344d39c91bdce2201327e2131065a`
- **Snapshot commit:** `73fe84b` (branch `docs/web-catalog-v0.2-specs`); issue snapshot on #275.
- **Date:** 2026-11-04
- **G3 scrim and Material authority (verbatim choice):** "Para la imagen de fondo: superficie `well` debajo y una sola capa oscura con `--color-alpha-black-42` encima, recortada al radio de la tarjeta, sin gradiente a mano ni token nuevo. ¿La aprobás como receta Material válida para ProjectCard?" → "Aprobar la receta (recomendado)". This is the approved Material recipe for this composition; no separate Surface proposal is required.
- **Part API (verbatim choice):** "¿Cómo entran el fondo y la marca en la tarjeta?" → "Hijos por tipo, como Footer (recomendado)" — `ProjectCardBackdrop` and `ProjectCardMark` are direct children partitioned by part type, as Footer does; layout-only `className`; no new root props; a duplicated part uses the first one and warns in development.
- **Eyebrow accessibility (verbatim choice):** "Exponerlo (recomendado)" — the v0.1 `aria-hidden` eyebrow promise is amended to match the current exposed span; the article name stays heading-only and the decorative index stays hidden.
- **Owner approval (verbatim):** "Con esas decisiones, ¿aprobás la spec v0.2 de ProjectCard, G1 de A1 y el plan U3 para implementarlo?" → "Sí, aprobar e implementar".

## Scope

Approves G4 for exactly the bytes above with the resolutions recorded here, G1 for A1, G3, and the U3 implementation plan in `docs/components/web-catalog/v0.2/implementation-plan.md`. Any later change to the spec needs a new approval. Visual conformity is not approved; captures remain pending under `docs/design/README.md`. Historical v0.1 approvals stay unchanged.
