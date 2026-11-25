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
