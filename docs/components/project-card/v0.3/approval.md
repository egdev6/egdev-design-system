# ProjectCard v0.3 — spec approval record

- **Approved artifact:** `docs/components/project-card/v0.3/spec.md`
- **SHA256:** `0d346d3527c7af30b35db7f68a37001a44e6c26d9a3e2c03d34862ad509b0356` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `01ff388` (branch `feat/pulso-consumer-requests`), whose payload SHA256 is `ccda3e792b3ce298b73acfe288081545b598ff2fd7c80935e2e70e2a94e45bef`. The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: #275 stays the canonical component issue and a later comment needs separate authorization.
- **Date:** 2026-11-25
- **Owner approval (verbatim):** "Aprobar con recomendaciones (Recomendado)" — in reply to the question approving the committed ProjectCard v0.3 draft with its recommended answers to the open questions, asked in conversation without a SHA prefix (`odd/tasks/pulso-consumer-requests.md` L5).

## Resolved decisions

The owner took the recommended answer of every open question in the draft (spec, closing section "Owner decisions"):

- **D1 — Prop name and convention reading:** (a) reuse `leading-status-badge` → `statusBadge` unchanged, reading "trailing content" as after-heading content for ProjectCard's usage. No exception and no convention change.
- **D2 — Shape:** (a) ReactNode slot prop `statusBadge`; no exported part.
- **D3 — Header-row composition:** (a) lead group (index over eyebrow) at the inline start, status at the inline end; the row exists only with a status.
- **D4 — Public marker:** (a) `eg-project-card__badge` on the status wrapper only; the row and the lead group stay unmarked.
- **V1 — Visual authorization:** not granted. This approval records no capture authorization, hosting or harness.

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect (shape, marker, convention reading, closure checklist, gate-2 row, next step). No promise, API, anatomy, appearance or acceptance criterion changed.

## Scope

This approves gate 2 (the spec, per S5 of `odd/tasks/pulso-consumer-requests.md`) for exactly the bytes identified above, including the D1–D4 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan (gate 3) needs its own approval, and nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures or GitHub actions. It does not approve visual conformity: captures stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated). D1 (a) adopts a reading for ProjectCard's usage only; it amends no convention and gives no global approval. Historical v0.1 and v0.2 approvals stay unchanged.

## Amendment 1 — §4 over-wide status label (2026-11-25)

The amended payload hash below is the current one. The SHA256 at the top of this record stays as the hash the original approval bound.

- **Date:** 2026-11-25
- **Reason (finding F1):** the real-browser check of the #558 implementation (ODD S3, task T7: Storybook plus headless Chrome, geometry and computed values) contradicted one sentence of the approved §4: "a label wider than the card's content box overflows rather than being clipped". The shipped legacy rule `.eg-project-card { overflow: hidden }` (`packages/ui/src/styles/legacy/bundle.css`, layer `components`; the card root carries no overriding utility) clips whatever extends past the card's padding edge. In `StatusInNarrowCard` (content box 189.99 px, padding 19.2 px) a 241.98 px Badge overflowed the content box by 51.98 px and was clipped by 32.78 px (86.5% visible), and a 395.98 px Badge was 52.8% visible; labels up to the content box plus one padding step stayed fully visible, and the realistic label "testing" (68.98 px) is unaffected at 390 px and in the narrow host. The implementation matches the approved plan and its recipes are unchanged. Measurements: [implementation-evidence.md](implementation-evidence.md), finding F1.
- **Change:** one sentence in §4, "Limits / consumer responsibilities", plus the spec's `contentSHA256` identity field. Nothing else in the spec changed.
  - Before: "A Badge label is non-wrapping by the Badge contract, so a label wider than the card's content box overflows rather than being clipped; supply short labels and a host that reserves space."
  - After: "A Badge label is non-wrapping by the Badge contract, so a label wider than the card's content box overflows its row, and the card's legacy `overflow: hidden` (`.eg-project-card` in `legacy/bundle.css`) clips whatever passes the card's padding edge, so only the padding beyond the content box stays visible; supply short labels and a host that reserves space."
- **Owner approval (verbatim):** "A: corregir la frase de la ficha (Recomendado)" — the answer to the question that explained that the code stays, that only the §4 sentence changes, that the spec and plan hashes move, and that the answer is recorded as the new approval of both. It was relayed to the implementation writer by the parent and is logged in `odd/tasks/pulso-consumer-requests.md` L8.
- **SHA256 of the spec payload** (same hash definition as above):
  - Old: `0d346d3527c7af30b35db7f68a37001a44e6c26d9a3e2c03d34862ad509b0356`
  - New: `21ae2a49d8b187b6120d7c626c7ba0dbff51a94519f7b8adb6d8c33857636470`
- **Plan:** [implementation-plan.md](implementation-plan.md) pins the spec hash in its header. It now pins the new hash, and this answer is recorded as the plan's renewed approval against the amended spec. The plan's own payload is unchanged, so its `contentSHA256` `afd55efd9fb4e358d5ad72505229a3573737f68a3e49631a5a3a34f8a8c55a78` is unchanged.
- **Scope:** this approves exactly the sentence above and no other change. D1–D4 and their resolutions are unchanged. V1 is still not granted: no capture exists, `visualHashes` stay Pending and visual conformity stays Not evaluated. The §4 behavior-table row for a narrow host ("The card never truncates, clamps, clips or scales the Badge") and PC-S9 were not amended by this answer. The amended bytes are not committed yet; the parent commits them. No GitHub action was taken and the #275 snapshot stays Pending.
