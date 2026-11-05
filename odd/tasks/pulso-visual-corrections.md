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
| P0 | Per-component v0.2 spec snapshots: A1–A12 deltas, WebSection/WebTemplate API, slot/landmark/naming mappings, visual provenance, approval evidence (G2–G5) | S1–S12, S14, S15 | `docs/components/<name>/v0.2/` | drafted — 13 specs (T1–T11) snapshotted to their issues; owner approval and captures pending | 73fe84b | #339 |
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

### P0 queue — per-component v0.2 spec drafts (3 parallel workers, pull-based)

Each item writes only `docs/components/<name>/v0.2/**` for its components, follows `skills/component-spec-proposer/SKILL.md`, and produces a draft awaiting exact owner approval (G4). Workers do not commit or publish; the parent commits and appends GitHub snapshots.

| Item | Components | Amendment | Specs | Issue | Status | Commit |
| --- | --- | --- | --- | --- | --- | --- |
| T1 (P0.1) | now-card, now-strip | A2, A8 | S2, S8 | #276, #297 | G4 approved (L18) | — |
| T2 (P0.2) | community-card | A4 | S4 | #281 | drafted — awaits G1, G2, G4 | — |
| T3 (P0.3) | project-card | A1 | S1 | #275 | G4 approved (L20) | — |
| T4 (P0.4) | article-feature, blog-grid | A3, A9 | S3, S9 | #280, #296 | drafted — awaits G1, G4, G5 (content-description) | — |
| T5 (P0.5) | top-bar | A5 | S5 | #292 | G4 approved (L16) | — |
| T6 (P0.6) | footer | A6 | S6 | #293 | G4 approved (L9) | — |
| T7 (P0.7) | section-nav | A7 | S7 | #301 | G4 approved (L9) | — |
| T8 (P0.8) | notes-board | A10 | S10 | #295 | G4 approved (L9) | — |
| T9 (P0.9) | web-section (new) | A11 | S11 | #340 | drafted — heading-ID forwarding and neutral layout need owner choice; awaits G1, G4, G5 | — |
| T10 (P0.10) | web-template (new) | A12 | S12 | #341 | drafted — availability statement conflict, empty-slot rule and native-prop boundary need owner choice; awaits G1, G4, G5 | — |
| T11 (P0.11) | ambient-background (U11, spec only) | A13 | S13 | #45 | drafted (partial) — version collision with #45 history, combination axes, preset precedence, motion and perf bounds need owner choice; awaits G4, G7 | — |

### Implementation queue — approved units

| Task | Unit | Specs | Approved spec | Route | Status | Commit |
| --- | --- | --- | --- | --- | --- | --- |
| T12 | U6 Footer rhythm + exported heading recipe | S6 | `docs/components/footer/v0.2/spec.md` (`cf050c8c…`) | worker, `packages/ui/src/organisms/footer/**`, `packages/ui/src/index.ts`, `scripts/package-exports.test.mjs` | implemented — unit checks green; browser computed-style check passed (L11); owner visual review pending | 29c69f8 |
| T13 | U7 SectionNav story clearance | S7 | `docs/components/section-nav/v0.2/spec.md` (`c2e7cd67…`) | worker, `SectionNav.stories.tsx`, `SectionNav.test.tsx` | implemented — unit checks green; browser computed-style check passed (L11); owner visual review pending | 2be48c1 |
| T14 | U8 NotesBoard rhythm | S10 | `docs/components/notes-board/v0.2/spec.md` (`06e1041f…`) | worker, `packages/ui/src/organisms/notes-board/**` | implemented — unit checks green; browser computed-style check passed (L11); owner visual review pending | 41c7445 |
| T15 | U2 CommunityCard fixed header band | S4 | `docs/components/community-card/v0.2/spec.md` (`0ba56c29…`) | worker, `packages/ui/src/molecules/community-card/**` | implemented — full suite, props and package-exports green; browser computed-style check passed (L15); owner visual review pending | c4c415b |
| T16 | U4 ArticleFeature description + BlogGrid composition | S3, S9 | `docs/components/article-feature/v0.2/spec.md` (`77c0f220…`), `docs/components/blog-grid/v0.2/spec.md` (`2b9f0bcf…`) | worker, article-feature/blog-grid + naming registry surfaces | implemented — full suite, props and package-exports green; browser computed-style check passed (L15); owner visual review pending | 2dfe896 |
| T17 | U5 TopBar links painted like the underline tabs | S5 | `docs/components/top-bar/v0.2/spec.md` (`1dd4518c…`) | worker, `packages/ui/src/organisms/top-bar/**` + registry evidence/package-exports tests | implemented — full suite, props and package-exports green; browser computed-style check passed (L17); owner visual review pending | b8adc57 |
| T18 | U1 NowCard no-badge top inset; NowStrip inherits it | S2, S8 | `docs/components/now-card/v0.2/spec.md` (`571c1eb7…`), `docs/components/now-strip/v0.2/spec.md` (`fd2ff711…`) | worker, now-card/now-strip + registry evidence/package-exports tests | implemented — full suite, props and package-exports green; browser computed-style check passed (L19); owner visual review pending | 8ee5bff |
| T19 | U3 ProjectCard backdrop and trailing mark | S1 | `docs/components/project-card/v0.2/spec.md` (`f4b7c7bf…`) | worker, project-card + barrel/registry/package tests | implemented — full suite, props, package-exports green; no-part markup identical to ad6d467; browser check passed with contrast finding (L21); owner visual review pending | 3e8ab1e, 1bc7cf1 |
| F1 | Follow-up: enforce NowCard's protected `style` promise (v0.1 says protected, source forwards it) | — | outside U1 | not scheduled | pending | — |

Approved spec bytes are frozen: implementation never edits an approved `spec.md`.

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

- **L7 — P0 start (verbatim):** "empezamos la planificación. Levanta 3 subagentes que trabajen en paralelo haciendo issues y cuando terminen que cojan otras hasta que esté la planificación terminada" — authorizes drafting the P0 v0.2 specs with three parallel workers on branch `docs/web-catalog-v0.2-specs`. Spec approval (G1–G5) is still the owner's decision.

- **L8 — P0 drafts done:** T1–T11 drafted by three pull-based workers; 13 specs committed in 73fe84b, exact snapshots appended to #276, #297, #281, #275, #280, #296, #292, #293, #301, #295, #340, #341, #45 (all readbacks OK) and the decision summary to #339 (https://github.com/egdev6/egdev-design-system/issues/339#issuecomment-6637858760). Nothing approved; no captures; branch not pushed.

- **L9 — G4 approval for T6, T7, T8 (verbatim):** "si" — reply to "¿Aprobás estas tres specs v0.2 tal como están?" for Footer (`cf050c8c…`), SectionNav (`c2e7cd67…`) and NotesBoard (`06e1041f…`). Recorded in each `docs/components/<name>/v0.2/approval.md` with the full SHA256. U6–U8 plan approval is still separate.

- **L10 — G1 (A6, A7, A10) and U6–U8 plan approval (verbatim):** "si" — reply to "¿Aprobás G1 (A6, A7, A10) y los planes U6–U8 para empezar a implementar?". Authorizes implementation of U6–U8 per `implementation-plan.md` with one commit per unit on `docs/web-catalog-v0.2-specs`.

- **L11 — U6–U8 browser check (Storybook + Playwright, computed styles, 900px tall viewport):** Footer default at 390/859/860/861/1280: 2/2/2/3/3 columns, column gap 32px, row gap 25.6px, motto 32/25.6px, legal 32/12.8px, heading margin 9.6px, smallest nav link target 45px, no horizontal overflow. NotesBoard default: one column at 1079/1080 and two at 1081/1280, `align-items: flex-start`, side gap 12.8px, side top equal to first row top (16px) above 1080; MultipleBoards separation 51.2px. SectionNav Default/Hover at 390/1280: pill fully inside the viewport; Hover index open and fully inside the viewport. Geometry only; no comparison against owner Image#15/#16/#18 and no capture asset recorded.

- **L12 — G2, mark rule, G5, G4/G1 and U2/U4 plan approval (verbatim choices):** G2 "Aprobar tal cual (recomendado)"; non-image mark "Obligación del consumidor (recomendado)"; G5 "Aprobar `description` (recomendado)"; specs + G1 (A3/A4/A9) + plans U2/U4 "Sí, aprobar e implementar". Recorded in `docs/components/{community-card,article-feature,blog-grid}/v0.2/approval.md`.

- **L13 — `description` registry collision resolved (verbatim choice):** "Unificar en un concepto general (recomendado)" — the approved `dialog-description` convention (canonical `description`) is generalized to one `content-description` concept: short visible plain text that explains the content next to its title. Dialog/AlertDialog remain usages, ArticleFeature is added. No code or API change for dialogs; the convention text and its approval record change. Validator invariant (one canonical name, one concept) is preserved.

- **L14 — Parent regression fixed:** U6 (29c69f8) and U8 (41c7445) changed Footer/NotesBoard `types.ts` without refreshing prop-naming registry evidence, so `pnpm props:check` and `pnpm test:props` failed on the branch; the parent had not run them. Refreshed in 2dfe896 after confirming each recorded prop and type; both checks now pass, full suite 2708/2708.

- **L15 — U2/U4 browser check (Storybook + Playwright, computed geometry):** CommunityCard Default/WithImageMark/WithoutEyebrow/LongEyebrow at 390/767/768/1280: band 76.8px below 768 and 83.2px from 768 in every case; heading offset identical with and without mark or eyebrow (96.8px / 109.6px); eyebrow 12.8px, long eyebrow clamps at 2 lines; marks within 153.6×51.2; no horizontal overflow. ArticleFeature Default/LongContent at 390/1280: description after heading, 12.8px, unclipped, included in the link's accessible text. BlogGrid Default at 390/1280: feature description and 3/3 row descriptions render, no overflow. Geometry only; no comparison against owner images.

- **L16 — TopBar G4, G1 (A5) and U5 plan approval (verbatim choices):** A5-AC3 "Medir solo cuando se ven (recomendado)"; A5-AC1 "Cero o uno (recomendado)"; approval "Sí, aprobar e implementar". Recorded in `docs/components/top-bar/v0.2/approval.md`.

- **L17 — U5 browser check and story fix:** at 1280px TopBar CurrentPage/Default links are 44.8px tall with no text underline; the current link has ink rgb(255,255,255) and a 1.6px brand `::after` indicator with glow; other links keep a transparent indicator; no tab/menu roles. At 390px the desktop nav is hidden (as approved, measured only when visible). The consumer compact controls in the Compact/MobileDialog/UserMenu stories were bare `<button>` fixtures 19–21px tall; owner choice (verbatim) "Corregir las stories (recomendado)": stories now use `Button variant='neutral' size='lg'`, measured 44.8px at 390px, no overflow. The brand link (19.2px) is outside A5 and unchanged.

- **L18 — NowCard/NowStrip G4, G1 (A2/A8) and U1 plan approval (verbatim choices):** mixed row "Alinear bordes y footers (recomendado)"; `style` "Mantener la promesa, arreglar aparte (recomendado)" (follow-up F1); approval "Sí, aprobar e implementar". Recorded in `docs/components/{now-card,now-strip}/v0.2/approval.md`.

- **L19 — U1 browser check (Storybook + Playwright, computed geometry):** NowCard/NowStrip at 390/860/861/1280: no-badge heading `padding-top` 19.2px, so its text starts 20px below the card top, the same inset as the badge wrapper; badge headings keep `padding-top` 0 and their 54.2px offset (recipe base byte-identical to the previous `headingBase`, badge adds only `pt-0`). NowStrip UnevenCards mixed row (one badge, two without) at 861/1280: equal card heights and footers starting at the same y (198px / 192px), the approved A8 criterion (insets and footer bands, not heading tops). Geometry only; no comparison against owner images.

- **L20 — ProjectCard G4, G1 (A1), G3 and U3 plan approval (verbatim choices):** G3 "Aprobar la receta (recomendado)"; parts "Hijos por tipo, como Footer (recomendado)"; eyebrow "Exponerlo (recomendado)"; approval "Sí, aprobar e implementar". Recorded in `docs/components/project-card/v0.2/approval.md`.

- **L21 — U3 checks, parent fixes and contrast finding:** base/current differential against ad6d467 (built dist, SSR): only `ProjectCardBackdrop` and `ProjectCardMark` added, none removed; no-part markup identical in 3/3 cases. Parent fixed key warnings in part partitioning (`Children.toArray`) and, again, a stale registry revision for `project-card/types.ts` caused by a parent `biome --write` after the worker's refresh (the check chain did not stop the commit); amended into 3e8ab1e, `props:check` green. Story fix (second U3 commit): the backdrop pointed to a missing `/project-backdrop.png`; it now loads `/brand/egdev-logo-with-name.png`, and a `BrokenBackdrop` story covers the failure case. Browser (390/1280): one scrim `rgba(0,0,0,0.42)` over well `rgb(20,21,24)`, radius 17.6px clipped, backdrop and scrim `aria-hidden`, `object-cover`, no overflow; broken image: heading and eyebrow 19.5:1. **Finding:** worst case over the brightest pixel of the loaded image is 3:1 for the white heading — meets AA large text only; small eyebrow text is not guaranteed 4.5:1 over bright images with the approved 42% scrim. Owner decision pending; recipe unchanged.

- **L22 — ProjectCard contrast finding resolved (verbatim choice):** "2" — option 2 of the L21 finding: legibility over bright images is a consumer obligation, documented in the `ProjectCardBackdropProps` JSDoc; the approved G3 recipe (single 42% scrim) is unchanged.

- **L6 — Publication confirmed:** tracker #339, WebSection #340, WebTemplate #341. Exact proposal and plan snapshots and dependency links are in #339 comments. Appended planning amendments to the twelve canonical existing component issues and backlinks on #340/#341; preserved prior issue bodies, labels, state and assignees. Three new issues carry only enhancement/odd labels and no assignees. Job-435 exit0, all20 remote bodies read back exactly. No implementation, Git commit, push or roadmap-index edit.
