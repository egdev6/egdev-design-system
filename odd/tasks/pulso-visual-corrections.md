# Pulso visual corrections — ODD planning
**Objective:** plan the web-catalog v0.2 visual amendments (A1–A13) as ODD work units, with local ODD and authorized GitHub planning, without implementing, approving or assigning work.
**Branch:** none created; exact base branch pending parent. **Delivery:** ask-on-risk before the first oversized commit — no inherited single-PR choice. **Test runner:** ODD test-first with `pnpm test <paths>`, then `pnpm typecheck`, `pnpm lint`, `pnpm --filter @egdev/ui build`.

## Specs

Exact owner requirements, quoted verbatim (Spanish is the owner's wording; the exception to English artifacts).

- **S1 — ProjectCard:** "Project card -> le añadiría lo de la imagen [Image#11]"
- **S2 — NowCard:** "NowCard -> revisa espaciado cuando no hay badge [Image#12]"
- **S3 — ArticleFeature:** "ArticleFeature -> añadir opción de texto descriptivo"
- **S4 — CommunityCard:** "CommunityCard -> hacer texto de la derecha con fuente mayor, para que adapte relación de sapecto con y sin logo [Image#13]"
  - Owner clarification, verbatim: "todo OK! la aclaración...quiero mantener el tamaño de la fuente para que siempre sea el mismo alto del head haya o no haya logo...aumentando un  poco la fuente y manteniendo el alto del head siempre igual"
- **S5 — TopBar:** "TopBar -> ajustar estilos de links [Image#14] podríamos hacerlo visualmente igual que tabs"
- **S6 — Footer:** "Footer -> cuidar los espacios entre items y tamaños de fuente [Image#15]"
- **S7 — SectionNav:** "SectionNav -> ajusta espacio de stories para que se vea (hover incluido) [Image#16]"
- **S8 — NowStrip:** "NowStrip -> lo mismo que nowCard [Image#17]"
- **S9 — BlogGrid:** "BlogGrid -> añadir opciones de descripción a moléculas y organismos"
- **S10 — NotesBoard:** "NotesBoard -> cuidar espaciados [Image#18]"
- **S11 — WebSection:** "A reconsiderar -> las veo todas muy similares. Quizás unificar en un organismo webSection con slots?"
- **S12 — WebTemplate:** "El actual Home template como template lo cambiaría por webTemplate con la distribución que te mencioné (topBar/content/footer)"
- **S13 — AmbientBackground:** "AmbientBackground -> los elementos se mueven paralelos (lineas y cuadrados). Cuando debería ser un componente que permita definir diferentes combinaciones (https://www.camzuna.com/anim)"
- **S14 — Close and plan:** "ciérralo y prepara la planificación de todo"
- **S15 — ODD planning:** "planifica en odd y github"

## Tasks

| Task | Content | Specs | Route | Status | Commit | GitHub |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Per-component v0.2 spec snapshots: A1–A12 deltas, WebSection/WebTemplate API, slot/landmark/naming mappings, visual provenance, approval evidence (G2–G5) | S1–S12, S14, S15 | `docs/components/<name>/v0.2/` | pending — not started; produces the specs, does not assume them | not implemented | #339 |
| P1 | Materialise this ODD plan | S14, S15 | `odd/tasks/` | done — parent structural readback | planning artifact only | #339 |
| P2 | Publish tracker, new component proposals and canonical amendment comments | S15 | parent GitHub operations | done — all exact remote readbacks confirmed | planning publication only | #339, #340, #341 |
| P3 | Read back publication, link tasks and mirror complete ODD | S15 | inline parent | done — structural/link validation; full mirror saved in closing step | planning synchronization only | #339 |
| U1 | NowCard no-badge top inset; NowStrip inherits it | S2, S8 | `molecules/now-card`, `organisms/now-strip` | blocked — exact approval G1 + G4 | not implemented | #276, #297 |
| U2 | CommunityCard fixed header band with larger fixed header text | S4 | `molecules/community-card` | blocked — exact approvals G1 + G4 + G2 | not implemented | #281 |
| U3 | ProjectCard decorative backdrop and trailing mark | S1 | `molecules/project-card` | blocked — exact approvals G1 + G4 + G3 | not implemented | #275 |
| U4 | ArticleFeature description; BlogGrid molecule/organism descriptions | S3, S9 | `molecules/article-feature`, `organisms/blog-grid` | blocked — exact approvals G1 + G4 + G5 | not implemented | #280, #296 |
| U5 | TopBar links painted like the underline tabs | S5 | `organisms/top-bar` | blocked — exact approval G1 + G4 | not implemented | #292 |
| U6 | Footer spacing rhythm and exported heading recipe | S6 | `organisms/footer` | blocked — exact approval G1 + G4 | not implemented | #293 |
| U7 | SectionNav story canvas clearance (story-only) | S7 | `organisms/section-nav` | blocked — exact approval G1 + G4 | not implemented | #301 |
| U8 | NotesBoard spacing between side, rows and stacked boards | S10 | `organisms/notes-board` | blocked — exact approval G1 + G4 | not implemented | #295 |
| U9 | New WebSection organism with neutral slots | S11 | `organisms/web-section`, `packages/ui/src/index.ts` | blocked — exact approvals G1 + G4 + G5 | not implemented | #340 |
| U10 | New WebTemplate structural page slots | S12 | `templates/web-template`, `packages/ui/src/index.ts` | blocked — exact approvals G1 + G4 + G5 | not implemented | #341 |
| U11 | AmbientBackground independent combinations — spec only | S13 | `docs/components/ambient-background/v0.2/` | pending — drafting not scheduled; not blocked on its own spec | not implemented | #45 |
| U12 | Integration, cross-component stories, catalog and packed-output readiness | S1–S13 | stories, `packages/ui/src/index.ts`, `scripts/catalog_data.py` | blocked — exact approvals G1 + G4 + G5 | not implemented | #339 |
| M1 | Website adoption, choreography relocation and breaking removal of `HomeTemplate`/scenes | S12 | website repository (not this repo) | blocked — separate website scope and breaking-removal authority | not implemented | #337 (prior HomeTemplate) |

Status notes are approval gates only: unit ordering in `implementation-plan.md` §2 is not treated as a blocking edge here. U11 stays pending on scheduling, not on its own spec.

### Planning status and sources

Planning only. No implementation task below is implemented or approved; GitHub planning publication is confirmed; no approval is claimed from any hash, file or issue reference. P0 produces the per-component v0.2 specs; they do not exist yet. The source files remain untracked locally; full exact snapshots are published in tracker comments and cited below by content identity, not by nonexistent repository blob links.

| Plan source (local untracked; exact snapshot published) | SHA256 (content identity only) |
| --- | --- |
| `docs/components/web-catalog/v0.2/visual-amendments.md` | `b07304a4a5d2fa6e32f4a24cabe58e0466eccde81d8c1bf06a7104875eafdf38` |
| `docs/components/web-catalog/v0.2/implementation-plan.md` | `8bf76ad357594c51f214718dc310ade573f24948581a6182fc37ff9b7f8a2e6b` |

Preserved: prior frozen specs/approvals stay byte-identical, `roadmap8` body is not edited, and the untracked `packages/effects/src/home-template/HomeTemplate.story-index.test.ts` is untouched. Confirmed tracker #339, WebSection #340, WebTemplate #341; no status:approved labels or assignees were added.


### Published planning snapshots

- tracker: https://github.com/egdev6/egdev-design-system/issues/339
- web-section: https://github.com/egdev6/egdev-design-system/issues/340
- web-template: https://github.com/egdev6/egdev-design-system/issues/341
- Full amendments snapshot: https://github.com/egdev6/egdev-design-system/issues/339#issuecomment-6636690304
- Full plan snapshot: https://github.com/egdev6/egdev-design-system/issues/339#issuecomment-6636691440
- Publication receipt: `docs/components/web-catalog/v0.2/github-planning.json` (3 issue creations + 17 comment appends, all exact readbacks confirmed).

### Workload and delivery

- **Workload:** ≈1,970 authored lines for U1–U12 (visual fixes ~1,110; new surfaces ~580; spec-only ~150; integration ~130). P0 and M1 are excluded and remain unknown until reference handoff and consumer/engine discovery.
- **Delivery shape:** ask-on-risk once before the first oversized implementation commit, then record the answer. This plan inherits no earlier single-PR decision and recommends no shape.
- **Approvals needed before any source work:** G1 proposal/delta approval, G2 CommunityCard fixed-height and two-line policy, G3 ProjectCard scrim recipe, G4 per-component v0.2 specs, G5 naming mappings, G7 AmbientBackground spec/plan, G6/M1 website and breaking-removal authority.

## Log

- **L1 — Owner original correction request (verbatim):**
  - Project card -> le añadiría lo de la imagen [Image#11]
  - NowCard -> revisa espaciado cuando no hay badge [Image#12]
  - ArticleFeature -> añadir opción de texto descriptivo
  - CommunityCard -> hacer texto de la derecha con fuente mayor, para que adapte relación de sapecto con y sin logo [Image#13]
  - TopBar -> ajustar estilos de links [Image#14] podríamos hacerlo visualmente igual que tabs
  - Footer -> cuidar los espacios entre items y tamaños de fuente [Image#15]
  - SectionNav -> ajusta espacio de stories para que se vea (hover incluido) [Image#16]
  - NowStrip -> lo mismo que nowCard [Image#17]
  - BlogGrid -> añadir opciones de descripción a moléculas y organismos
  - NotesBoard -> cuidar espaciados [Image#18]
  - A reconsiderar -> las veo todas muy similares. Quizás unificar en un organismo webSection con slots?
- **L2 — Owner direction acceptance and CommunityCard clarification (verbatim):** "todo OK! la aclaración...quiero mantener el tamaño de la fuente para que siempre sea el mismo alto del head haya o no haya logo...aumentando un  poco la fuente y manteniendo el alto del head siempre igual"
- **L3 — Draft closure and planning request (verbatim):** "ciérralo y prepara la planificación de todo"
- **L4 — Planning authorization (verbatim):** "planifica en odd y github" — authorizes the local ODD and GitHub planning publication. Exact IDs and content readback are parent work; implementation, approvals, assignment, branch creation and edits to prior frozen docs remain unauthorized.

- **L5 — Publication in progress:** job-435 performs one creation per new planning issue and one append per planned comment, verifies exact readback, records partial outcomes in `docs/components/web-catalog/v0.2/github-planning.json`, and stops on uncertainty without replay. No protected labels or assignment.

- **L6 — Publication confirmed:** tracker #339, WebSection #340, WebTemplate #341. Exact proposal and plan snapshots and dependency links are in #339 comments. Appended planning amendments to the twelve canonical existing component issues and backlinks on #340/#341; preserved prior issue bodies, labels, state and assignees. Three new issues carry only enhancement/odd labels and no assignees. Job-435 exit0, all20 remote bodies read back exactly. No implementation, Git commit, push or roadmap-index edit.
