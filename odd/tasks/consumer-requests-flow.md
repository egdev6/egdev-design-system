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
- S11 (T2, approved): New GitHub issue form `.github/ISSUE_TEMPLATE/consumer_request.yml` ("Consumer request"), English, same style as `feature_request.yml`: pre-flight checks; consumer app; need described as the interface outcome, explicitly not a proposed solution; link to the consumer issue; optional current mitigation (allowlist entry / `TODO(egdev-design-system#N)` or `<localRepo>#TBD-*`); a note that the issue closes at the release that ships it, not at the PR merge. Links `docs/distribution/consumer-requests.md` and `docs/CATALOGACION.md`.
- S12 (T6, owner choice verbatim): "Bloque marcado en CONTRIBUTING.md (Recomendado)" ("Crea CONTRIBUTING.md si no existe; si existe, añade al final un bloque entre marcadores <!-- egdev-ds:consumer-requests -->. Idempotente, aparece en el plan, respeta --dry-run. upgrade no lo toca.").
- S13 (T4, owner choices verbatim): "Flag nueva solo para TBD (Recomendado)" ("`doctor --no-pending` (nombre a confirmar): DS043 pasa a error (exit 1) solo con la flag. Sin la flag, nada cambia. Precisa y sin efectos colaterales.") and "Solo la CI, documentado (Recomendado)" ("`ds:doctor` local queda igual (los drafts pueden tener TBD); la guía dice que la CI del consumidor corra doctor con la flag. init no cambia."). Flag name chosen by the agent: `--fail-on-pending`.
- S14 (T5, owner choices verbatim): "CHANGELOG `(#N)`, acumulado (Recomendado)" ("`release:pack` lee las secciones versionadas (no Unreleased) de cada paquete del set y lista todo `(#N)` con paquete y versión. Acumulado: no necesita conocer la release anterior. Nueva convención: cada entrada cita su issue.") and "upgrade + doctor --from (Recomendado)" ("Se cruzan las entradas de la allowlist `egdev6/egdev-design-system#N` con la lista. `upgrade` lo imprime como siguiente paso; `doctor --from` añade un warning nuevo (DS052). Sin `--from`, doctor lo marca skipped."). Evidence: the CLI release reader ignores unknown keys (`packages/cli/src/release.mjs:151-182`), so an optional field keeps `schemaVersion: 1`.
- S10: Local trial loop, documented in the canonical doc: `pnpm release:pack` in the DS → `egdev-ds upgrade <project> --allow-dirty` (sibling checkout or `--from`) → test → restore the consumer's `vendor/`, `package.json` and lockfile with git and reinstall. Workspace or `link:` specifiers stay forbidden, with the reason. A local `release:pack` is not a release.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T0 | S1–S10 | parent | done: issue #522, linked from #491 |
| T1 | S3, S5, S7, S8, S10 | inline | done: docs/distribution/consumer-requests.md, CONTRIBUTING, README, README.es (this commit) |
| T2 | S3, S11 | worker | done: .github/ISSUE_TEMPLATE/consumer_request.yml (commit 1) |
| T3 | S9 | inline | done: no code change; semantics documented in consumer-requests.md (af78929) |
| T4 | S4, S13 | worker | done: `doctor --fail-on-pending` (this commit) |
| T5 | S6, S14 | worker | done: 4464354 + advisory fixes (next commit) |
| T6 | S8, S12 | worker | done: init writes the marked block (commit 2) |
| T7 | S5 | parent | done: global skill `release-preparation` 1.7 (local-tarball section, outside this repo) |
| T8 | S8 | parent | done: egdev6/nexo#88, egdev6/egdev-website#42, egdev6/recado#33 |

## Log

- L1 (owner, verbatim): S1.
- L2: Agent proposed the request gate, bounded mitigation, release-time closing and the `release.json` notice; asked whether mitigations expire.
- L3 (owner, verbatim): "sin limite" → S2.
- L4 (owner, verbatim): "odd y github" → this document plus a GitHub issue (T0).
- L5 (owner choice): "Publicar y enlazar a #491" → published #522 (labels odd, documentation, status:needs-review) and commented on #491 (issuecomment-7060894990).
- L6 (owner, verbatim): "empecemos" → start T1 and T3 (the agent's recommended first units).
- L7: T3 premise corrected. Mapping `TODO(egdev-design-system#TBD-x)` to `<localRepo>#TBD-x` is intentional, not a bug: pinned by AC18 tests (`packages/cli/tests/guard.test.mjs:126-145,147-157,179-192`), documented as `<localRepo>#TBD-*` in DS043 (`packages/cli/README.md:339`) and used by consumer allowlists. Changing it is a consumed-contract change. Agent recommendation: keep it and document the semantics (the pending action, filing the issue, belongs to the consumer); T1's doc does so. Owner decision pending.
- L8: T1 done. Relative links in the new doc resolve; docs-only change, no runnable tests apply.
- L9 (owner choice): "Mantener y documentar (Recomendado)" → S9 resolved: keep `<localRepo>#TBD-*` attribution; the canonical doc explains it. T3 closed without code changes.
- L10: PR #523 merged as 3446b6e (T1, T3).
- L11 (owner, verbatim): "si, gestion trabajo paralelo en hasta 3 subagentes" → T2 and T6 on branch feat/consumer-requests-template-init.
- L12 (owner choices): S12; "Sí, 2 workers en paralelo" (T2 as its own worker).
- L13: T2 done by worker: issue form parsed with PyYAML, 5 unique ids; consumer-requests.md links it.
- L14: T6 first pass by worker (RED 12 fail → GREEN 124). Parent resolved a handoff contradiction: preserve every byte, add only the missing blank-line separation. Parent review found a monorepo gap (Nexo project apps/hub, CONTRIBUTING.md at repo root): following the `.mcp.json` precedent, init searches CONTRIBUTING.md from <project> up to the nearest `.git` ancestor; a marked file anywhere → nothing; nearest unmarked file in an ancestor → no write, next step names it; else create/append in <project>. Already-vendored projects get the same backfill. RED 4 fail → GREEN test:cli 131/131; typecheck green; biome formatted. Shared code: `FileWrite` JSDoc type widened to `string | Buffer` (type only; upgrade tests green); findRepoRoot and nextSteps reused unchanged.
- L15: Independent verify (Risk: item 3) found one blocker: a symlinked or hard-linked project CONTRIBUTING.md made init exit 2 (base exit 0), even when it held the block. Fixed inline: a linked/irregular guide is never written and never refuses; with the markers nothing happens, otherwise a manual next step. RED 2 fail → GREEN test:cli 132/132; upgrade/doctor/status matched base in the verifier's differential check. README, egdev-ds-cli.md, CHANGELOG updated.
- L16: PR #524 merged as 386ed4a (T2, T6); CI green incl. egdev-ds end to end.
- L17 (owner, verbatim): "dale" → T4 on branch feat/doctor-fail-on-pending; owner choices recorded in S13.
- L18: T4 by worker: RED 8 fail → GREEN test:cli 143/143; typecheck, biome green. Parent differential vs origin/main (scratch git archive): doctor/init/status existing flags and outputs identical; only difference is the new flag on init/upgrade/status, now "Unknown argument for <cmd>" (existing convention for known-but-inapplicable flags), exit 2 unchanged.
- L19: Independent verify (Risk: item 3) PASS for S4, S13 and the risk: no-flag output byte-identical to base, 134 parser cases differ only by the new flag and usage line, init unchanged, test:cli 143/143. Advisory applied: consumer-requests.md says npx runs after installing dependencies.
- L20: PR #525 merged as 4c33f91 (T4); CI green.
- L21 (owner, verbatim): "t5" → branch feat/release-resolved-issues; owner choices recorded in S14.
- L22: T5 by worker: RED 5 fail → GREEN test:cli 151/151; typecheck, biome green. Parent ran test:package-release (builds the workspace, outside the worker surfaces): 25/25.
- L23: Independent verify (Risk: items 3 and 5) PASS for S6, S14 and both risks (272-scenario differential; old release.json byte-identical; base CLI reads the new field). Advisories adopted by the parent: A) DS052 warns only when vendored commit equals the release commit, else skipped (would otherwise ask to remove a mitigation before upgrading); 5) resolutions filtered by the packages the project uses; B) one notice per allowlist entry listing every resolving package; C) the CHANGELOG cites the tracking issue as `Refs #522`, since only `(#N)` counts as resolving. Worker: RED 5 then 2 fail → GREEN test:cli 160/160.
- L24: Focused re-verify of the advisory fixes: A, 5, B, C PASS; D found one unrequested difference: `doctor --from` at another commit added a DS052 skipped line even for an old release.json without `resolves`. Fixed inline: the commit gate applies only when `resolves` is non-empty; an empty or absent list adds no DS052 finding with `--from` (without `--from` it stays skipped, per S14). RED 1 → GREEN test:cli 161/161; DS014 test restored to its base expectation; README and egdev-ds-cli.md DS052 rows updated.
- L25: PR #526 merged as 464c713 (T5). Owner chose "cli 0.1.1 → 0.2.0 (Recomendado)"; released via #528 (6f6e0c5) and packed clean on main (`resolves` #485, #486, #488 from cli 0.1.1; no #522). #527 made biome respect `.gitignore`.
- L26: T8 done in the three consumers, each upgraded to 6f6e0c5 with `ds:doctor --fail-on-pending` in CI and the marked CONTRIBUTING block: egdev6/nexo#88 (b28ecf9; block added by hand at the repository root), egdev6/egdev-website#42 (b009d8e; ui 0.3.2 → 0.7.0, Tabs changes not applicable), egdev6/recado#33 (b94a7d2; plus `postcss` devDependency so DS044 does not depend on `pnpm run`). Local checks green; GitHub Actions blocked by account billing, so the PRs merged without remote checks.
- L27 (owner, verbatim): "si" → T7: the global `release-preparation` skill (1.7) gains a local-tarball section: publication is a clean `release:pack` on the merged main; only `resolves` entries new in the release are commented and closed, with an explicit grant. Checked on cli 0.2.0: no new entries. All tasks done; #522 closes.
