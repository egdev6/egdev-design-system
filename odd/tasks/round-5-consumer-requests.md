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
- L2 — Size note: 14 consumer requests, each with three owner gates. This spans several sessions; resume from this document.
