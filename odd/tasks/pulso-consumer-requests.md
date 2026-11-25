# Pulso consumer requests — #556, #557, #558, #559

egdev-website's Pulso parity gaps (consumer issue egdev6/egdev-website#45), filed as DS consumer requests on 2026-11-25. Each one goes through cataloging → spec → plan → implementation, with an owner approval at each gate, and ships as one PR per issue on its own branch.

## Specs

- S1 — #556 "Consumer request: show a coarse activity level inside a Now card": "Each "now" card on the home shows a coarse progress level for its activity (low to high, four steps) next to its footer link, with an accessible name such as "High progress"."
- S2 — #557 "Consumer request: emphasize the current slide in the tips carousel": "In the tips rail (Carousel + TipCard), the current slide is visually emphasized against its neighbours (the reference uses a brand border and glow)." "Scroll-driven 3D depth (coverflow) is out of scope for this request."
- S3 — #558 "Consumer request: show a status next to a project card's index": "On the Lab experiment card, a status such as "testing" (warning tone with an alert icon) sits in the card's header row, next to the "EXPERIMENTO 014" index."
- S4 — #559 "Consumer request: mark the current page in the footer navigation": "The footer links need to expose the current page the same way, with the host marking at most one."
- S5 — Gates follow AGENTS.md and the component skills: the owner approves the cataloging decision, then the spec (component-spec-proposer), then the implementation plan (component-contributor). Approving one gate never approves the next or authorizes code.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S5 | Cataloging decisions for the four requests; owner approval | inline | done (L3) |
| T2 | S4 | #559 spec draft `docs/components/footer/v0.3/spec.md`; owner approval pending | parallel writer | see git log |
| T3 | S3 | #558 spec draft `docs/components/project-card/v0.3/spec.md`; owner approval pending | parallel writer | see git log |
| T4 | S2 | #557 spec draft `docs/components/carousel/v0.4/spec.md`; owner approval pending | parallel writer | see git log |
| T5 | S1 | #556 spec drafts `docs/components/step-meter/v0.1/spec.md` + `docs/components/now-card/v0.3/spec.md`; owner approval pending | parallel writer | see git log |
| T6 | S4 | #559 implementation per footer/v0.3/implementation-plan.md | sequential worker | pending |
| T7 | S3 | #558 implementation per project-card/v0.3/implementation-plan.md | sequential worker | pending |
| T8 | S2 | #557 implementation per carousel/v0.4/implementation-plan.md | sequential worker | pending |
| T9 | S1 | #556 implementation per step-meter/v0.1/implementation-plan.md | sequential worker | pending |
| T10 | S1–S4 | One integration PR from this branch; owner Storybook review | inline | pending |

## Log

- L1 — Owner request, verbatim: "las abarcamos ya" (the four consumer requests #556–#559 filed in this session).
- L2 — Cataloging evidence gathered before filing:
  - #556: NowCard v0.2 excludes a built-in meter. MeterRow and ProgressBar are continuous, and Pixel is a position marker.
  - #557: TipCard v0.1 excludes the glow. Carousel already sets `aria-current` on the current slide.
  - #558: ProjectCard renders the index and eyebrow in the header (`ProjectCard.tsx:47-55`) with no slot for a status.
  - #559: `FooterNavigationItem` is `{ href, label }`, while TopBarItem has `'aria-current'?: 'page'` (`top-bar/types.ts:13`).
- L3 — Owner approved the cataloging decisions, verbatim: "Aprobar las cuatro (Recomendado)".
  - #559: API variant. `FooterNavigationItem` gains `'aria-current'?: 'page'`, following the TopBarItem contract.
  - #558: ProjectCard API variant. A header-row status part or slot that takes a Badge.
  - #557: Carousel variant. Emphasis keyed off the existing `aria-current`, on the slide wrapper, not on TipCard. No coverflow depth.
  - #556: new atom for a stepped level, plus a NowCard spec amendment that allows it in the footer. Radix base: none for all four.
- L4 — Four parallel writers drafted the specs, all with status Proposed, seven blocks each, and open questions tabled in each file. Main recommendations:
  - #559: attribute only, with no visible cue.
  - #558: `statusBadge` slot, which reuses the `leading-status-badge` naming convention.
  - #557: `variant: 'default' | 'current-emphasis'`, with border-brand plus `--shadow-glow-active`. It does not use `--shadow-hot`.
  - #556: `StepMeter`, using `role="img"` plus `label`, `value` and `steps` (default 4).

  The `contentSHA256` of each draft must be recomputed after the owner's answers.
- L5 — Owner spec approvals, verbatim. All four take the drafts' recommended answers to their open questions:
  - #559 Footer v0.3: "Aprobar con recomendaciones (Recomendado)"
  - #558 ProjectCard v0.3: "Aprobar con recomendaciones (Recomendado)"
  - #557 Carousel v0.4: "Aprobar con recomendaciones (Recomendado)"
  - #556 StepMeter v0.1 + NowCard v0.3: "Aprobar con recomendaciones (Recomendado)"

  Spec approval does not approve the implementation plans (S5).
- L6 — Specs finalized as Approved, with approval.md records, and implementation plans drafted as Proposed.

  Final spec SHA256:
  - Footer v0.3: `3fe3906f`.
  - ProjectCard v0.3: `0d346d35`.
  - Carousel v0.4: `8f5bfbd8`.
  - StepMeter v0.1: `1da0f307`.
  - NowCard v0.3: `2ed402f0`.

- L7 — Owner answers, verbatim:
  - Plans: "Aprobar los cuatro (Recomendado)"
  - Delivery: "Rama de integración, una PR (Recomendado)". One commit series per issue on this branch, and a single PR. This overrides the one-PR-per-issue line in the header.
  - Checks: "Autorizar ambos (Recomendado)". This covers Storybook with Playwright for geometry and forced colors, plus the packed consumer tests (package-exports and package-consumption, network or pnpm cache).

  Implementation runs sequentially, because all four plans touch prop-naming.json, the system artifact and the changelogs.

  Plan estimates: #559 about 315 lines, #558 about 585, #557 about 585, #556 about 1,250 hand-written plus about 250 generated.
