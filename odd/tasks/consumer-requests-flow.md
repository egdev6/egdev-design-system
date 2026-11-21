# Consumer requests flow: from a consumer app need to a released DS change

How a consumer app (Nexo today, every released app that uses the DS later) asks for a DS change, mitigates meanwhile and learns the change is available. Status: **planning only**; no implementation authorized yet. S3–S9 are the agent's proposal the owner discussed; each needs explicit approval in the GitHub issue before its task starts.

## Specs

- S1: Owner request, verbatim: "quiero tener claro el flow. Crees que deberíamos establecer la regla de que si hay cambios en nexo que reuieran una modificación del DS deberíamos parar el flow en la petición de issue para mantener el control? permitimos mitigación temporal? como comunicamos al que abrió la issue en el DS que ya puede actualizar nexo? Esto áplica ahora a nexo pero será extensible a todos los proyectos que liberemos que usen el DS"
- S2: Mitigation lifetime, owner answer verbatim: "sin limite". A temporary mitigation lives until the release that resolves its DS issue; no expiry date.
- S3 (proposal): **Request gate.** A consumer change that needs a DS change stops its DS-dependent part at an issue in `egdev6/egdev-design-system`, filed with a "Consumer request" template: need, consumer app, link to the consumer issue, no proposed solution. Triage follows `docs/CATALOGACION.md` (reuse → variant → compose → extract → new). The rest of the consumer PR is not blocked.
- S4 (proposal): **Mitigation rules.** Allowed: local composition of existing DS components and tokens, marked `TODO(egdev-design-system#N)` with a real issue number plus an allowlist entry pointing to that issue. Forbidden: editing `vendor/`, copying or forking a DS component, hand-written colors, spacing or fonts. `#TBD-*` placeholders are allowed only in drafts: a merge check (proposed `doctor --strict` or CI mode; DS043 severity is a consumed contract, so the mechanism is decided in T4) fails on them.
- S5 (proposal): **Issue lifecycle.** A DS issue from a consumer request is not closed by its PR merge; it closes at the release that ships it, with a comment naming the package versions and DS commit.
- S6 (proposal): **Machine notice.** `release.json` lists the issues the release resolves (optional field, additive). `egdev-ds upgrade` and `doctor` cross it with the consumer's `TODO(egdev-design-system#N)` markers and allowlist entries and print which mitigations can be removed (file:line). Offline and deterministic, no GitHub access, never runs git.
- S7 (proposal): **Upgrade owner.** The maintainer upgrades the consumer in a separate PR that also removes the resolved mitigations. External contributors never vendor.
- S8 (proposal): **Extensibility.** The canonical rule lives in the DS (`docs/distribution/consumer-requests.md`); each consumer's CONTRIBUTING links it with a short summary; `egdev-ds init` can scaffold that summary.
- S9 (proposal): **Guard placeholder fix.** `TODO(egdev-design-system#TBD-x)` is recorded today as `<localRepo>#TBD-x` (`packages/cli/src/guard.mjs:269-273`); a placeholder declared for the DS must stay attributed to the DS. Also document when `<localRepo>#N` applies versus a DS issue.
- S10: Local trial loop, documented in the canonical doc: `pnpm release:pack` in the DS → `egdev-ds upgrade <project> --allow-dirty` (sibling checkout or `--from`) → test → restore the consumer's `vendor/`, `package.json` and lockfile with git and reinstall. Workspace or `link:` specifiers stay forbidden, with the reason. A local `release:pack` is not a release.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T0 | S1–S10 | parent | done: issue #522, linked from #491 |
| T1 | S3, S5, S7, S8, S10 | inline | done: docs/distribution/consumer-requests.md, CONTRIBUTING, README, README.es (this commit) |
| T2 | S3 | inline | "Consumer request" issue template |
| T3 | S9 | inline | blocked: owner decision (see L7) |
| T4 | S4 | inline | `#TBD-*` merge check (mechanism decided here) |
| T5 | S6 | worker? | `release.json` resolves field + upgrade/doctor notice |
| T6 | S8 | inline | `egdev-ds init` CONTRIBUTING snippet |
| T7 | S5 | parent | release-preparation skill: comment and close resolved issues (global skill, outside this repo) |
| T8 | S8 | parent | Nexo CONTRIBUTING links the canonical rule (nexo repo) |

## Log

- L1 (owner, verbatim): S1.
- L2: Agent proposed the request gate, bounded mitigation, release-time closing and the `release.json` notice; asked whether mitigations expire.
- L3 (owner, verbatim): "sin limite" → S2.
- L4 (owner, verbatim): "odd y github" → this document plus a GitHub issue (T0).
- L5 (owner choice): "Publicar y enlazar a #491" → published #522 (labels odd, documentation, status:needs-review) and commented on #491 (issuecomment-7060894990).
- L6 (owner, verbatim): "empecemos" → start T1 and T3 (the agent's recommended first units).
- L7: T3 premise corrected. Mapping `TODO(egdev-design-system#TBD-x)` to `<localRepo>#TBD-x` is intentional, not a bug: pinned by AC18 tests (`packages/cli/tests/guard.test.mjs:126-145,147-157,179-192`), documented as `<localRepo>#TBD-*` in DS043 (`packages/cli/README.md:339`) and used by consumer allowlists. Changing it is a consumed-contract change. Agent recommendation: keep it and document the semantics (the pending action, filing the issue, belongs to the consumer); T1's doc does so. Owner decision pending.
- L8: T1 done. Relative links in the new doc resolve; docs-only change, no runnable tests apply.
