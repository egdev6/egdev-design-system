# NowCard v0.2 — spec approval record

- **Approved artifact:** `docs/components/now-card/v0.2/spec.md`
- **SHA256:** `571c1eb7e3052e70974a021cf5d30365860a3068fe82e1b5f4d89331aa8968e2`
- **Snapshot commit:** `73fe84b` (branch `docs/web-catalog-v0.2-specs`); issue snapshot on #276.
- **Date:** 2026-11-04
- **`style` baseline discrepancy (verbatim choice):** "La spec v0.1 de NowCard dice que no se acepta `style`, pero el código hoy lo deja pasar. ¿Qué hacemos?" → "Mantener la promesa, arreglar aparte (recomendado)" — the protected-`style` promise stays; enforcement is a separate follow-up outside U1.
- **Mixed-row resolution (verbatim choice):** "En una fila de NowStrip con tarjetas con y sin badge, el título de la que tiene badge queda más abajo (el badge ocupa lugar). ¿Qué promete A8?" → "Alinear bordes y footers (recomendado)" — spec option (1): A2 badge parity is kept; A8-AC1 checks card top insets and footer bands, not equal heading tops.
- **Owner approval (verbatim):** "Con esas decisiones, ¿aprobás las specs v0.2 de NowCard y NowStrip, G1 de A2/A8 y el plan U1 para implementarlo?" → "Sí, aprobar e implementar".

## Scope

Approves G4 for exactly the bytes above with the resolutions recorded here, G1 for A2, and the U1 implementation plan in `docs/components/web-catalog/v0.2/implementation-plan.md`. Any later change to the spec needs a new approval. Visual conformity is not approved; captures remain pending under `docs/design/README.md`. Historical v0.1 approvals stay unchanged.
