# Round 5 — egdev-website consumer requests before the 0.11.0 pack

Integration branch `integration/round-5`. egdev-website's Pulso parity requests (#560–#566, consumer issue egdev6/egdev-website#45) and its reading-page requests (#569–#575, consumer issue egdev6/egdev-website#49), plus small pending items. All of it is absorbed into the unpacked 0.11.0 release (main 7afaabd, PR #568). Each request goes through cataloging → spec → plan → code, with an owner approval at each gate.

## Specs

- S1 — Owner scope, verbatim: "Pulso: #560–#566, Lectura: #569–#575, Pendientes chicos".
- S2 — Owner versioning, verbatim: "Absorber en 0.11.0 (Recomendado)". 0.11.0 was never packed. New entries go under the existing `## 0.11.0` changelog sections, and coupled versions only move if a package that was not bumped (tokens, cli) changes.
- S3 — Pulso requests: #560 scene display titles that fit their column; #561 footer aligned with the page content width; #562 quiet navigation links in cards and the footer; #563 Pulso-style numbers and labels in the section index; #564 Now card status as a full-width band; #565 site footer on the grafito register; #566 isotipo anchor that fills its media slot.
- S4 — Reading requests: #569 readable long-form body with a reading measure; #570 breadcrumb on detail pages; #571 pagination for long listings; #572 detail page header with metadata; #573 empty state for listings and filters; #574 embedded external content; #575 enlarged image view for galleries.
- S5 — Small items:
  - (a) Footer stories with a single child log a React missing-`key` warning.
  - (b) ProjectCard v0.3 §4 behavior row "never truncates, clamps, clips or scales the Badge" contradicts Amendment 1.
  - (c) An owner decision on the proposed `step-count` naming convention (#556).
  - (d) `pnpm test:mcp` README examples drift on every release: add it to the release procedure and to CI.
- S6 — Gates follow AGENTS.md and the component skills. Token changes and dependencies need an explicit owner confirmation. Approving one gate never approves the next.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S3–S4 | Cataloging decisions for #560–#566 and #569–#575; owner approval | explorers | — |
| T2 | S5a | Footer single-child `key` warning: reproduce, test-first fix | inline | pending |
| T3 | S5b–c | ProjectCard row wording and `step-count`: owner decisions | inline | pending |
| T4 | S5d | `test:mcp` in the release procedure and in CI | inline | pending |
| T5 | S3–S4 | Specs per approved cataloging | writers | pending |
| T6 | S3–S4 | Plans and implementation per approved spec, sequential | writers | pending |
| T7 | S2 | Fold into 0.11.0, PR, owner merge, clean release:pack, close resolved issues, notify the website | inline | pending |

## Log

- L1 — Owner request, verbatim: "mergeado. antes de subir versiones podemos hacer las otras tareas oendientes y ya luego subimos?" Answers: S1 and S2.
- L3 — Cataloging decisions are in `odd/tasks/round-5-cataloging.md`. Owner answers, verbatim:
  - Cataloging: "Aprobar todas (Recomendado)". #564 is deferred out of this round, and #575 becomes an app pattern documented in a story (the #509 decision). The approved shapes are:
    - #566: `@classNameAllows` on HomeTemplateAnchor.
    - #563: SectionNav parity, with no API change.
    - #561 + #565: Footer v0.4 with `wrap` and `register`.
    - #562: a Link `quiet` variant.
    - #560: `titleVariant` on the four scenes, measured first.
    - New components: #569 Prose (with a token proposal), #573 EmptyState, #570 Breadcrumb, #572 DetailHeader, #571 Pagination, #574 Embed.
  - Footer register: "Sí, ampliarlo (Recomendado)". This widens `section-register` to Footer.
  - Small items: "Aprobar `step-count` (Recomendado), Corregir la fila de #558 (Recomendado), test:mcp en CI y en el procedimiento (Recomendado)".
- L4 — Spec drafts are written, all Proposed. The paths and contentSHA256 prefixes are:
  - home-template v0.2 `ebff1104`
  - section-nav v0.3 `c317943f`
  - footer v0.4 `b33fdfc1`
  - link v0.5 `68420d30`
  - hero v0.2 (shared spec for the four scenes) `489f499c`
  - prose v0.1 `6976e8d4`
  - empty-state v0.1 `71e70809`
  - breadcrumb v0.1 `1f78dbd4`
  - detail-header v0.1 `23171da1`
  - pagination v0.1 `499588e0`
  - embed v0.1 `032afeb8`

  Nine of these writers first failed on a transient ENOSPC in the shared /tmp tmpfs, which other sessions' large media files had filled. They were relaunched once the space was free.

  Findings:
  - #566: the egdev-ds DS046 guard ignores `classNameAllows` outside `@egdev/ui` (`appearance-guard.mjs:524`, `doctor.mjs:90`). A tag alone does not unblock the website.
  - #560: `show` probably still breaks the Closing title at 1440px or wider, which needs a browser measurement.
  - #562: the type step should stay `text-label-default`; the draft's `body-large` was wrong under ×0.8.
  - #569: proposes the token `--container-prose: 65ch`.
- L5 — Owner answers, verbatim:
  - Specs: "Aprobar todas (Recomendado)". All 11 specs are approved with each draft's recommended answers to its open questions, including the new naming conventions it proposes.
  - Token: "Sí, 65ch (Recomendado)". `--container-prose: 65ch` is confirmed for packages/tokens/src/theme.css.
  - #566: "Incluir el CLI: cli 0.4.1 (Recomendado)". The DS046 guard also reads `classNameAllows` from `@egdev/effects`, and cli moves to 0.4.1.
  - #560: "Sí, medir primero (Recomendado)". A browser measurement comes before the plan.

  Spec approval does not approve the plans (S6).
- L6 — Owner answers, verbatim:
  - Plans: "Aprobar los 10 (Recomendado)". All 10 drafted plans are approved: #566, #563, #561/#565, #562, #569, #573, #570, #572, #571 and #574. The approval includes browser runs, packed consumers, registry receipts for the newly named conventions, and `(#N)` changelog citations so the release resolves each issue.
  - Versions: "tokens 0.7.0 y cli 0.5.0 (Recomendado)". This overrides L5's 0.6.2 and 0.4.1, following versioning.md.
  - #560: "A: titleVariant y la web acorta el texto (Recomendado)". The measured `show` fits Closing at 1280 but breaks at 1440 and 1920. The website adapts its copy. The spec is to be finalized as drafted and its plan drafted, and that plan needs its own approval.
  - #563 F1: "Mantener el token y ajustar PAR-07 (Recomendado)". `fg-brand-raised` is neon #FF0036, 3.92:1 on surface-2 and 3.42:1 on surface-3. Keep the token and amend PAR-07 with a new approval of that wording.

  Implementation order, sequential:
  1. T2, T3 and T4.
  2. #562 Link.
  3. #561/#565 Footer.
  4. #563 SectionNav.
  5. #566 anchor + CLI.
  6. #569 Prose (tokens 0.7.0).
  7. #573 EmptyState.
  8. #570 Breadcrumb.
  9. #572 DetailHeader.
  10. #571 Pagination.
  11. #574 Embed.
  12. #575 story pattern.
  13. #560 after its plan is approved.
- L7 — The website reported three gaps from its listings (PR egdev6/egdev-website#50). Owner answers, verbatim: "Chip link seleccionado (Recomendado), Varias acciones en ProjectCard (Recomendado), Featured como política de app (Recomendado)" and "Sí, a round 5 (Recomendado)".
  - Filed and added to this round: #576 (active filter on link chips) and #577 (several actions in a ProjectCard footer). Both need cataloging, a spec and a plan, and both come after the reading pieces.
  - "Featured once per view" is app policy under MATERIAL principle 7, so no issue was filed. The website was told: only the first featured project gets the featured variant in a listing.
  - T2–T4 are done: 9a55a01, d57066c, 48d9eb7.
- L2 — Size note: 14 consumer requests, each with three owner gates. This spans several sessions; resume from this document.
