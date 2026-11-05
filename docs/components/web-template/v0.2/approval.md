# WebTemplate v0.2 — spec approval record

- **Approved artifact:** `docs/components/web-template/v0.2/spec.md`
- **SHA256:** `214573f4f20f887e2f32598148b59f7deb28e69838d57b5923839635d83ec6e7`
- **Snapshot commit:** `73fe84b` (branch `docs/web-catalog-v0.2-specs`); issue snapshot on #341.
- **Date:** 2026-11-05
- **Availability:** The inspected source exports are authoritative for this work, including AppShell, TopBar and Footer. Reconciling the older Gauge-only statements is an owner follow-up; `AGENTS.md` and other availability prose are not changed.
- **Empty slots:** Null and undefined mean absent; other ReactNode values, including booleans, count as supplied. This matches AppShell's nullish presence policy and does not narrow the API.
- **Native and merge boundaries:** Adopt the proposed protected native exclusions and placement-only root class merge; this preserves the passive div and introduces no token, dependency or global rule.
- **G5 naming:** Reuse `localized-messages` and its existing `AppShellMessages.skipToContent` member without registering a duplicate message concept. Register `page-top-bar-slot`; generalize existing `content` and `footer` conventions to include page slots while retaining component-specific restrictions and historical receipts.
- **Visual source:** Captures and visual conformity remain pending; no visual source or hash is invented.
- **Owner approval (verbatim, L23):** "no me preguntes termina todo y luego vemos (aplica las propuestas por defecto). Puedes abrir hasta 3 subagentes que parelilcen trabajo y permanezcan abiertos hasta terminar"

## Scope

Approves G4 for exactly the bytes above with the resolutions recorded here, G1 for A12, G5 for the named slot mappings, and the U10 implementation plan in `docs/components/web-catalog/v0.2/implementation-plan.md`. Any later change to the spec needs a new approval. Visual conformity is not approved; captures remain pending under `docs/design/README.md`. Historical approvals stay unchanged; HomeTemplate migration remains separately authorized.
