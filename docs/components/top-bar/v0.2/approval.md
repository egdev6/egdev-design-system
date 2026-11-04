# TopBar v0.2 — spec approval record

- **Approved artifact:** `docs/components/top-bar/v0.2/spec.md`
- **SHA256:** `1dd4518ca61ddde698277a4ee93173d25d9b09b25b13c7088ce14bb422787f79`
- **Snapshot commit:** `73fe84b` (branch `docs/web-catalog-v0.2-specs`); issue snapshot on #292.
- **Date:** 2026-11-04
- **A5-AC3 boundary (verbatim choice):** "A 390px la navegación de escritorio de TopBar está oculta, así que no se puede medir que sus links midan 44px. ¿Cómo lo comprobamos?" → "Medir solo cuando se ven (recomendado)" — spec option (2): TopBar links are measured only when visible (1280px); the consumer's compact control is checked separately at 390px.
- **A5-AC1 cardinality (verbatim choice):** "Cero o uno (recomendado)" — v0.1 zero-current and empty cases are preserved; when one item is current only that anchor carries the indicator. No API change.
- **Owner approval (verbatim):** "Con esas decisiones, ¿aprobás la spec v0.2 de TopBar, G1 de A5 y el plan U5 para implementarlo?" → "Sí, aprobar e implementar".

## Scope

Approves G4 for exactly the bytes above with the two resolutions recorded here, G1 for A5, and the U5 implementation plan in `docs/components/web-catalog/v0.2/implementation-plan.md`. Any later change to the spec needs a new approval. Visual conformity is not approved; captures remain pending under `docs/design/README.md`. Historical v0.1 approvals stay unchanged.
