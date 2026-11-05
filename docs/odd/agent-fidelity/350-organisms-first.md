# 350 — Organisms-first design guidance

## Current state

The #348 G1 walkthrough mapped static approximations but missed WebTemplate and WebSection, and required owner comments to identify organisms. The artifact already provides catalog levels, compound parts, props and visual anatomy; gentle-design reads the generated `design/system.md` before designing.

## Requirements

- R1 (AC1, S2–S3): lead with the organism → molecule → compose molecules/atoms and propose organism resolution order; propose possible or repeated atoms, using `docs/CATALOGACION.md` and owner decisions.
- R2 (AC2, S1): put templates and organisms before molecules and atoms; explicitly map template, section and component approximations and expose source-derived composition and slots without inventing contracts.
- R3 (AC3, S3): record organism and atom proposals in artboards, with reasons and cataloging evidence; never silently treat missing pieces as local patterns.
- R4: additive source-derived artifact, deterministic rendering, source-drift test, documentation and requested verification; no component, token or dependency changes.
- R5 (AC2–AC3): parent repeats the #348 walkthrough separately; this implementation does not run it.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — composition | (a) source imports used as JSX plus public compound parts; (b) handwritten catalog descriptions | (a): traceable and drift-sensitive, not a complete runtime dependency graph. |
| D2 — slots | (a) existing source-derived own props and part child documentation; (b) infer undocumented slots | (a): never invent a contract. |
| D3 — mapping | (a) `data-component` on approximated template, section and component regions, `data-proposal` plus a note for gaps; (b) unmarked HTML | (a): auditable without claiming React execution. |
| D4 — walkthrough | (a) parent repeats the same pilot and one-direction screen after implementation; (b) claim success from tests | (a): behavioral validation cannot be inferred from rendering tests. |

## Work units

1. RED renderer tests for guide first and level ordering; GREEN guide and ordering, preserving old artifact support.
2. RED artifact composition and source drift tests; GREEN source extraction and rendering; regenerate both outputs.
3. Document additive contract and limitations; run requested checks. No design, walkthrough or GitHub mutation.

## Walkthrough procedure (parent-run, not executed)

Recreate the #343 pilot consumer outside the worktree and install the generated system package. Record commit, package versions and renderer `--write` / `--check` results. Run gentle-design `list` and stop if `design/system.md` is absent or stale; do not auto-sync. Give the original one-direction brief: “A page that uses WebTemplate with two WebSections, using only design/system.md”. Record the system sections read, artboard and manifest, self-check of token values, and open the canvas. Do not solicit or apply owner comments. Record an exhaustive element-to-component mapping with selector counts against the public barrel and artifact, including WebTemplate, both WebSections, and every existing organism and molecule; identify any fidelity limitations. Record every proposed organism/atom with selector, note, reuse → variant → compose → extract → new rationale, and status proposed, not created. Pass only if template, sections, organisms and molecules are mapped without owner comments and all missing pieces have explicit proposals; otherwise record the failure and do not claim AC2/AC3 complete. Retain durable evidence and clean temporary consumer as in #348.

## Risks

Static imports and JSX cannot prove runtime nesting or discover consumer-supplied children; empty data does not mean no composition or slots. HTML markers identify approximations, not React behavior. The parent-run walkthrough remains necessary to prove S1 and AC2–AC3.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| AC1 | R1, R4 | generated guide and renderer tests |
| AC2 | R2, R5 | ordering/composition tests; parent-run walkthrough |
| AC3 | R1, R3, R5 | proposal guide; parent-run recorded proposals |
| Scope | R4 | drift checks, docs, requested verification |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D3 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D4 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |

## Walkthrough evidence (parent-run, 2026-11-05)

Deviation from the planned environment: the run used this repository's workspace with `design/system.md` copied byte-for-byte from the generated golden `packages/system/system.md` (main `1121e0d`), instead of the pilot consumer, because gentle-design runs in the active Pi workspace. Tarball installation of the same bytes was already proven in #348; this run measures what `system.md` teaches.

- `gentle_design list` (verbatim): `Design system: design/system.md is up to date.`
- Agent: an independent subagent restricted to the gentle-design skill and `design/system.md` (no other repository reads), given the original brief verbatim: "design one direction (only one) of a page that uses WebTemplate with two WebSections, using only design/system.md. Don't run sync or implement."
- Output: `design/web-template-two-sections/01-foundation-overview.html` (106 lines) and `design.json`; no owner comments.
- Markers (from the HTML): `WebTemplate` ×1, `TopBar` ×1, `WebSection` ×2, `SectionHeader` ×2, `NowStrip` ×1, `NowCard` ×3, `Footer` ×1; `data-proposal`: none (the agent found existing catalogued pieces for every block).

| Pass criterion (R5) | Result |
| --- | --- |
| Template and sections mapped without owner comments | Pass — `WebTemplate` and both `WebSection`s marked (in #348 neither was mapped) |
| Organisms and molecules used from the top down without owner comments | Pass — `TopBar`, `SectionHeader`, `Footer` organisms and `NowStrip`/`NowCard` molecules chosen by the agent (in #348 the first pass was plain HTML and needed 10 owner comments) |
| Missing pieces recorded as proposals, not silent local patterns | Pass (vacuous) — no missing piece identified |

Remaining visual divergences, filed as follow-ups: the agent rendered text with `system-ui` although `system.md` lists `--font-display` / `--font-sans`, because the reference does not state typography roles → #370; `WebTemplate` / `WebSection` show "No statically extracted anatomy", so their layout is interpreted → #371. Colours were inlined as resolved values and radii as computed pixels; no non-system colour was introduced.

The design folder and `design/system.md` were scratch for this run and are removed after recording (not committed).
