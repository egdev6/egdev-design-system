# WebSection v0.2 — spec approval record

- **Approved artifact:** `docs/components/web-section/v0.2/spec.md`
- **SHA256:** `bf6827fcb8c1991c49de5317768db006266d2b78c51d59295c6cb947a0cfe3ca`
- **Snapshot commit:** `73fe84b` (branch `docs/web-catalog-v0.2-specs`); issue snapshot on #340.
- **Date:** 2026-11-05
- **OQ-1 heading ID:** Option A: the host supplies the heading ID inside `header` and references it from `SectionShell`; WebSection exposes no `id`. This preserves unrestricted ReactNode headers without cloning or adapters.
- **OQ-2 layout:** Option B: structural-only unpainted normal flow, without organism-owned spacing or breakpoint changes. Supplied content and the host own layout; no new token, recipe or global rule is required.
- **G5 slot mappings:** Generalize the existing `header`, `media`, `actions` and `social` conventions to encompass their neutral slot usages while preserving the narrower contracts of existing components; add the proposed `body` slot concept. This avoids duplicate canonical names and preserves existing APIs.
- **Visual source:** Captures and visual conformity remain pending; no visual source or hash is invented.
- **Owner approval (verbatim, L23):** "no me preguntes termina todo y luego vemos (aplica las propuestas por defecto). Puedes abrir hasta 3 subagentes que parelilcen trabajo y permanezcan abiertos hasta terminar"

## Scope

Approves G4 for exactly the bytes above with the resolutions recorded here, G1 for A11, G5 for the named slot mappings, and the U9 implementation plan in `docs/components/web-catalog/v0.2/implementation-plan.md`. Any later change to the spec needs a new approval. Visual conformity is not approved; captures remain pending under `docs/design/README.md`. Historical approvals stay unchanged.
