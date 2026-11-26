# Embed v0.1 — spec approval record

- **Approved artifact:** `docs/components/embed/v0.1/spec.md`
- **SHA256:** `a004144377a34800c9729c2b983bf48bdaaadd3bb8d41b0ca3338c98317e1b69` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line (anchored at line start) through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `8f50f0b` (branch `integration/round-5`), whose payload SHA256 is `032afeb82805e643080a739d4e3e82875db0dfd2327d548724efbce886b98d5a` (prefix `032afeb8`, as recorded in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken: request #574 originates this spec but is not a component issue, and the parent chooses the canonical issue at handoff.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — the owner's answer to the spec-approval question, recorded in `odd/tasks/round-5-consumer-requests.md` L5 as approving all 11 round-5 specs with each draft's recommended answers to its open questions, including the new naming conventions it proposes. The digest above binds the resulting final bytes (the draft plus those answers, nothing else), not a digest the owner quoted.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | Both branches live in one atom: a native `iframe` for `src` and consumer `children` for script-filled embeds. Level `atom`, package `@egdev/ui`, path `packages/ui/src/atoms/embed/`. |
| OQ-2 | v0.1 ships the fixed `ratio` and the app picks a ratio covering its tallest expected output. A growth mode is added only on evidence, after the website's real X output is measured. |
| OQ-3 | No state prop: the app selects the fallback by omitting `src` and `children`, and loading visuals exist only in the frame branch. A consumer-controlled `status` is revisited after the first website integration, as an additive change. |
| OQ-4 | `src` accepts only http(s) URLs through the URL parser (absolute, scheme-relative or relative); anything else gives the fallback state plus the exact development warning. |
| OQ-5 | `ratio` defaults to `16 / 9` and `loading` to `lazy`; neither is required. |
| OQ-6 | `label` reuses the approved `accessible-name` and replaces the request's `title`; `src` stays an inherited native attribute with no registry entry; `fallback` is the new proposed convention `unavailable-content-fallback`. The entry enters the registry only through the receipt workflow at implementation, as `proposed` with `approval: null` until a receipt binds its exact content. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval, current-situation, identity and hash-definition metadata above the hash anchor, one clause in block 1 and one in block 4 that pointed at OQ-1 and OQ-2 as open, the heading, introduction and resolution column of the decisions table, the closure checklist and the next step. No promise, API, anatomy, appearance or acceptance criterion changed.

## Scope

This approves the spec gate (S6 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-6 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval, and nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-01 to VIS-03 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated). Convention approval stays separate: OQ-6 (a) is the owner's decision on the `fallback` convention, but it is not the registry receipt, so the `unavailable-content-fallback` entry stays `proposed` with `approval: null` until a receipt binds its exact content, and reusing the approved `accessible-name` and `aspect-ratio` entries adds usages later and approves nothing globally. The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) stays unchanged and separate.
