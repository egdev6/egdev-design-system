# T7 — Observed gentle-design walkthrough and gap report

| Field | Value |
| --- | --- |
| Issue | [#348](https://github.com/egdev6/egdev-design-system/issues/348) (operation `issue-7`) |
| Milestone | 9 — "Distribution for products and agents" |
| Proposal | `egdev-ds-distribution-v1` (roadmap index [#349](https://github.com/egdev6/egdev-design-system/issues/349)) |
| Task / specs | `odd/tasks/ds-distribution.md` T7 — S1 (milestone goal), S5 ("design/system.md generado desde el DS (Recomendado)") |
| Dependencies | #343 (pilot consumer; D1, D7 and the rest approved 2026-11-05, D3 dark-only in `odd/tasks/ds-distribution.md` L5) — #347 (`design/system.md`; P1, P2, P6, P8 and the rest approved 2026-11-05) **(amended by owner approval 2026-11-05)** |
| Status | **Approved — owner, 2026-11-05 (see Owner approval)** |

Planning only. This document creates no `design/` folder, no artboard, no observation, no source, token or dependency change, and no Git or GitHub operation. Artboards, comments and the walkthrough itself happen only after this plan and its dependencies are approved. #343 `D1–D7` and #347 `P1–P8` are referenced, never answered.

## 1. Current state (observed)

- **The flow is documented end to end.** `list` gate, brief, artboards, `open`, comments, handoff: gate at `skills/design/SKILL.md:38-46`, steps at `:48-70`, sync at `:72-78`, comments at `:80-102`, output contract at `:104-106`. The tool actions are `list`, `open`, `stop`, `implement`, `handoff` (`lib/gentle-design.ts:374`); comments have their own tool with only `list` and `resolve` (`:314`).
- **Artboards cannot run the design system.** Each artboard is one self-contained HTML file — inline CSS/JS/SVG, system fonts, "never reference external URLs, CDNs, remote fonts, images, or scripts" (`skills/design/SKILL.md:18`). So no React, no `@egdev/ui` component renders, and no import of `@egdev/tokens` CSS: every token value and every component appearance is **retyped by the agent from `design/system.md`**. That is the premise of this task: mapping and gaps, not conversion.
- **`system.md` is read, never parsed.** The skill says "read it first and use only its tokens and component rules" (`:21`); the tool only checks that `<design>/system.md` realpaths to a regular file inside `design/` (`lib/design-canvas-server.ts:445-453`) and that its mtime beats the consumer's own detected sources (`lib/design-sources.ts:112-119`). No hash, version or content check exists, so "in use" is unverifiable mechanically; only the agent's self-check (`SKILL.md:78`) and the owner's eyes.
- **Compliance is a self-check, not a gate.** The only conformance step is the agent listing the colours and font families each artboard uses, comparing them with the system tokens and fixing deviations (`SKILL.md:78`). Nothing records that list today; this task's report must, or the evidence is hearsay.
- **The auto-sync trap.** If `list` reports `system.exists` false while design sources exist, the skill runs its own **Design system sync** and writes a *different* `design/system.md` from the consumer's sources (`SKILL.md:44`, `:74-76`). Those sources are consumer-owned files only: the walk skips `node_modules`, `dist`, `build`, `out`, `coverage` and the root `design/` (`lib/design-sources.ts:24`, `:86`). An installed EGDEV package is never a source, so a sync inside the pilot would capture the pilot's own CSS, not the design system. The generated file must therefore exist and be reported current **before** the first brief.
- **Comments come from the canvas, not from the agent.** The owner creates them by clicking on the artboard; they are stored in `design/<slug>/comments.json` with `id`, `file`, `selector`, `excerpt`, `comment`, `createdAt`, `status` (`open`/`resolved`), `sentAt`, `resolvedAt`, and an optional `.screenshots/<id>.<ext>` (`SKILL.md:88-102`, `lib/design-comments.ts:37-48`, `:349`, `:243`). The agent reads open ones, edits only the target artboard, and resolves them with ids (`SKILL.md:84-86`, `lib/gentle-design.ts:333`). Every comment therefore needs the owner present at the canvas.
- **Handoff is a message, not a conversion.** `implement <slug>/<artboard>` builds text that says "map its parts to the project's existing components and styles, and do not copy the artboard HTML verbatim", and, when `system.md` exists, "Take colors, typography, spacing, radius and shadows from design/system.md, the project's token source" (`lib/gentle-design.ts:82-117`, `:96`); it also records `handoffs.json` (`lib/design-handoffs.ts:35`, `:58-62`). It "commits nothing" (`lib/gentle-design.ts:117`), but it is the transformation boundary this task excludes.
- **No `design/` folder exists here**, and `.gitignore:1-11` has no entry for one; captures under `docs/design/` are "propuestas; estar versionada no equivale a estar aprobada" (`docs/design/README.md:11`).
- **The walkthrough consumer is settled upstream.** #343 `D1` (a) generates the pilot on demand in a temp `mkdtemp` directory and `D7` (a) keeps the evidence in the document; #347 `P6` (a) reuses that consumer for the observed `list`. This plan still names no path of its own: it records the path those approved decisions produce. **(amended by owner approval 2026-11-05.)**
- **No repository test can drive the tool.** gentle-design ships in the external `gentle-pi` package (no `gentle*` entry in the root `devDependencies`, `package.json:29-59`), so the walkthrough is manual evidence, not a suite (`docs/odd/distribution/347-system-md.md:20`).

## 2. Specification

`AC1`–`AC3` are the issue's acceptance criteria. The deliverable is **one report** recording an observed run, plus proposals for the gaps.

### Observation protocol

The screen, its slug and its content follow **§3 D1**, approved as option (b): the screen shaped like #343's pilot page, one direction only. **(amended by owner approval 2026-11-05.)** The protocol is the same either way. Every step records: UTC time, the exact command or tool call, its verbatim output (truncated only where noted), the files touched with `path` and mtime, and what the owner did on the canvas.

| Step | What is executed | What is recorded |
| --- | --- | --- |
| S0 — Environment | Consumer from #343 installed from the tarballs; `design/system.md` produced by #347's documented command (`P1`/`P2`) | Installed versions, commit SHA, gentle-pi version (`skills/design/SKILL.md` frontmatter `version: "1.0"`), the renderer command and its exit code |
| S1 — Gate | `gentle_design list` before any brief | Verbatim `list` text: designs, system board line (`lib/gentle-design.ts:454`), design sources, and `Design system: design/system.md is up to date.` (`:460`). Any stale line is recorded, not silently re-synced |
| S2 — Brief and system read | One brief (goal, layout, content, audience); the agent reads `system.md` first | The slug, the brief, and **which `system.md` sections were copied**: colours, typography, spacing, radius, shadows, component rules |
| S3 — Artboards | `design/<slug>/NN-<name>.html` per artboard plus `design.json` (`SKILL.md:52-68`) | File list with titles and tradeoffs; per artboard the agent's self-check list (colours + font families used) and every deviation fixed or still open (`:78`) |
| S4 — Open | `gentle_design` `action: "open"` with the slug (`:70`) | The returned canvas URL and whether the tab was opened or refreshed |
| S5 — Comment | Owner comments on the canvas: at least one, ideally one visual and one token/component rule | Comment `id`, `file`, `selector`, `excerpt`, `comment`, `status`, `sentAt`, and whether a `screenshot` was attached |
| S6 — Modify | Agent reads open comments (`gentle_design_comments` `action: "list"`), edits only that artboard, then resolves with ids (`SKILL.md:84-86`) | The ids read and resolved, the changed file, what changed, and any comment left open with its reason |
| S7 — Validate | Re-open/refresh the canvas; re-run `list` and `gentle_design_comments` `list` | Re-run outputs (no open comments, system still current), the owner's verdict on the canvas, and the re-run self-check |
| S8 — Mapping and gaps | Reading the final artboards against the catalog and public barrel | The mapping table and the gap list below |

### Report format

One report with five parts. Where it lives is **§3 D4**; the PR body carries at least the owner verdict.

1. **Environment** — the S0 facts plus dependency versions.
2. **Steps** — one table with the S0–S7 rows above; each row names its evidence (tool output, file, mtime).
3. **Component mapping** — one table, every element of every artboard:

   | Column | Content |
   | --- | --- |
   | `element` | CSS selector or labelled region, as `comments.json` uses it |
   | `artboard` | `<slug>/<file>` and the manifest title |
   | `renders` | What it is for the user (button, list row, notice, field…) |
   | `EGDEV mapping` | Exported component name, or `local pattern`, or `gap <id>` |
   | `availability evidence` | `packages/ui/src/index.ts:<line>` or `docs/catalog.json` row; `—` for a gap |
   | `fidelity` | What the HTML could not reproduce: real Radix behaviour, Material layering, token resolution, states |

4. **Gaps** — one table: `gap id`, the limitation observed, its evidence `path:line`, the component or rule it implies, and the **proposed** follow-up title with `odd`/`type:*` labels and a size hint. Status is always `proposed — not created`.
5. **Owner verdict** — the owner's verbatim review comment and its date (issue Checks: "Report review by the owner").

### Requirements

- **R1 — One approved screen, one environment (AC1).** Exactly the screen fixed by D1, in the consumer fixed by #343 `D1`, using the `design/system.md` produced by #347's documented command. The report names the commit SHA, installed package versions and the renderer command; no artboard exists before S1 is recorded.
- **R2 — `system.md` is present and current before designing (AC1).** The recorded `list` output shows `Design system: design/system.md is up to date.` (`lib/gentle-design.ts:460`). A stale or absent report stops the walkthrough and records the cause; the walkthrough never runs its own `sync`, whose output would be the pilot's CSS (`SKILL.md:74-76`).
- **R3 — Artboards derive from `system.md` only (AC1).** Every colour, font, spacing, radius and shadow in each artboard is traceable to a `system.md` entry, and the agent's self-check list (`SKILL.md:78`) is recorded per artboard. Every deviation is either fixed before the artboard is reported or recorded as a gap; none is silently kept.
- **R4 — One full comment → modify → validate loop (AC1).** At least one owner comment created on the canvas, read through the tool, applied to its `file` only, and resolved with its id; a comment that could not be applied stays `open` with the reason (`SKILL.md:86`). The loop is reported as observed steps, not summarised as "worked".
- **R5 — Complete element mapping (AC2).** Every element of every artboard appears in exactly one mapping row, mapped to an exported EGDEV component with its barrel line, or classified `local pattern` / `gap <id>`. Completeness is cross-checked mechanically during the observation: the selectors found in the final HTML files must equal the `element` column, and the count is quoted in the report. No element is omitted, merged or described as "the rest".
- **R6 — Gaps become proposals, never issues (AC3).** Each gap has an id, evidence `path:line`, the component/rule it implies, and a proposed follow-up title with `odd`/`type:*` labels and a size hint. The report states plainly that the issues are proposed and not created; creation waits for the owner's approval (D5).
- **R7 — Record, do not fix (Guidance).** The walkthrough changes no component, token, token value, `package.json`, catalog, Material recipe or naming registry. An inconvenient absence becomes a gap. This document and D4's report file are the only repository writes.
- **R8 — No automation promised or started (Scope).** The report claims no artboard-to-React conversion, no transformation skill and no codemod, and states the known limitation once: artboards do not run React and do not import tokens. No such artifact is written here.
- **R9 — Scratch hygiene and no dependencies.** Any consumer, artboard, screenshot or capture lives outside the worktree or in an ignored folder and is removed after the observation; `git status --short` shows only the report file(s). No repository dependency is added to run gentle-design (`docs/odd/distribution/347-system-md.md:20`).
- **R10 — Owner review is part of the deliverable (Checks).** The report ends with the owner's verdict on the artboards and the report, verbatim and dated; without it the task is `partial`, not done.

## 3. Decisions for the owner

None of these is answered here. These are #348's own decisions, `D1–D7`, and they share no numbering with #343's `D1–D7` or #347's `P1–P8`; D2–D4 depend on #343 `D1`/`D7` and #347 `P1`/`P2`/`P6`, so their options stay valid under any of those answers.

| # | Question | Options | Recommendation |
| --- | --- | --- | --- |
| D1 | Which screen is designed, and how many directions? | (a) one screen shaped like #343's pilot page (WebTemplate + two WebSections), three directions per the skill default (`SKILL.md:29`); (b) the same screen, one direction only (`SKILL.md:29` allows the number asked); (c) a product-like screen not in the pilot (sign-in, pricing, settings), three directions | **(b)** — the smallest loop that still exercises every part of the flow, and a single artboard keeps the mapping table exhaustive and reviewable; (a) multiplies AC2's mapping table by three for the same component coverage; (c) gives richer mapping material but invents a screen the pilot never builds. |
| D2 | Where does the walkthrough run? | (a) in the #343 pilot consumer, generated on demand the way #343 `D1` recommends; (b) a separate throwaway consumer created only for #348; (c) in this repository root with a copied `system.md` | **(a)** — #347 `P6` already reuses that consumer for its observed `list`, and the pilot's own sources are what make `system.md` "current"; (b) costs a second install for no new evidence; (c) is not a product consumer and its `list` currency would be artificial. |
| D3 | Are the artboards, `design.json`, `comments.json` and screenshots committed? | (a) no: they stay in the consumer's folder and are removed after the observation; the report quotes selectors, comment bodies and diffs; (b) commit the `design/<slug>/` folder in this repository; (c) commit a static copy under `docs/odd/distribution/assets/348/` | **(a)** — the issue's Scope is a report, not design work in this repository; the repository has no `design/` folder and `.gitignore:1-11` has no entry for one, and versioned captures are "proposals, not approval" (`docs/design/README.md:11`). (b) adds a design folder no feature document owns. (c) adds binaries the issue never asks for. |
| D4 | Where does the report live? | (a) in this document, replacing §1/§2 evidence with the observed run, plus the owner verdict in the PR body; (b) a separate `docs/distribution/gentle-design-walkthrough.md`; (c) PR body only | **(a)** — AC1 needs a durable record and the issue's Checks is an owner review of it; ODD documents are the repository's evidence convention, and (c) loses the record at merge time. (b) splits the task from its evidence and duplicates the plan. |
| D5 | How are the gap follow-ups proposed and approved? | (a) the gap table is approved with the report, then the issues are created in a separate batch, one per gap, labelled `odd`/`type:*`; (b) the owner approves each row individually in one PR comment; (c) create them immediately as `status:needs-review` because the plan is approved | **(a)** — AC3 requires proposals first and no creation without approval, and one approval point keeps the review small. (c) breaks AC3: plan approval is not issue approval. (b) is fine but costs one round-trip per gap. |
| D6 | Is the `implement` handoff observed? | (a) no: recorded as available-but-out-of-scope (`lib/gentle-design.ts:82-117`), nothing executed; (b) yes, once, on a throwaway artboard, recording its message and `handoffs.json` verbatim while implementing nothing | **(a)** — the issue excludes automatic artboard-to-React conversion and any implementation; (b) adds a mutation and evidence nobody asked for, and "commits nothing" is still a handoff record. |
| D7 | If the owner's comment cannot be applied without inventing a component or token, what happens? | (a) leave the comment `open`, record it as a gap, and ask the owner to rephrase or accept the deviation (`SKILL.md:86`); (b) apply an approximation and note it in the report; (c) resolve the comment with a note that it is impossible | **(a)** — the issue's Guidance is "record evidence; do not fix the design system", and an unapplied comment is itself the most useful gap; (b) hides a real limitation behind a silent approximation; (c) marks work done that was not done. |

## 4. Plan

Phases match the issue's ODD plan (Design, Iterate, Report), with setup separated because S0–S1 are the gate that makes the run valid. Inputs, owner touchpoints, evidence and exit conditions per phase. The owner is present at the canvas in Design and Iterate, and reviews the report in Report.

| Phase | Inputs | Owner touchpoint | Evidence recorded | Exit condition |
| --- | --- | --- | --- | --- |
| **Setup** (S0–S1) | #343 consumer and #347 renderer, both approved and landed; D1–D3 answers (D2 follows #343 `D1`) | Answers D1–D3; confirms the installed versions | `list` verbatim showing the system present and current; renderer command and exit code; environment table | `system.md` exists, is reported current, and the consumer is recorded by path |
| **Design** (S2–S4) — issue phase "Design" | Approved brief and `system.md` | Approves the brief in one line | Slug, brief, system sections copied, artboard files and tradeoffs, per-artboard self-check, canvas URL | Artboards exist and are open on the canvas |
| **Iterate** (S5–S7) — issue phase "Iterate" | At least one owner comment | Creates the comment(s) on the canvas; gives the verdict | Comment fields verbatim, ids read/resolved, changed files, re-run `list` and comments output | One comment applied, resolved and validated; loop recorded |
| **Report** (S8) — issue phase "Report" | Final artboards, catalog and barrel | Reviews the report and the gap table (D4/D5) | Mapping table, gap table with proposals, owner verdict | Owner accepts the report; no issue created yet |

**Test-first applicability.** Not applicable, and this is the honest statement rather than an exemption: this task changes no product code and adds no test surface. There is no runnable deterministic check for "did the artboard use the system tokens" — gentle-design's only verdict is `statSync` plus mtime, and the conformance step is an agent self-check. The one mechanical guard planned is R5's element-count cross-check between the final HTML selectors and the mapping rows, run ad hoc during the observation and quoted in the report; it is not a committed test and must not be presented as one. Verification for this task is observed output, file evidence and the owner's review, as the issue's Checks says.

## 5. Risks and out of scope

- **Highest: the evidence can look stronger than it is.** `list` proves a regular file with a newer mtime, nothing about content; conformance rests on the agent's own self-check. The report must separate "observed output" from "agent's claim" row by row, or AC1 passes with an unverifiable run.
- **Auto-sync can silently replace the generated file.** A `list` that reports `system.exists` false triggers the skill's sync (`SKILL.md:44`), which writes a `system.md` from the pilot's own CSS (`:76`), and `node_modules` is never a source (`lib/design-sources.ts:24`). If that happens unnoticed, the walkthrough measures the pilot, not EGDEV. R2 is the guard; the risk stays because nothing prevents it mechanically. #347 `P8` (no `system.html`) is a related consequence, reported as "No system board" (`lib/gentle-design.ts:454`).
- **Fidelity is retyped, not resolved.** Colours, shadows and typography are hand-copied into inline CSS. A drift between the copied value and `system.md` is invisible to the tool, so the mapping table's `fidelity` column and the self-check are the only signals.
- **Tool drift is outside the repository.** gentle-design lives in `gentle-pi` and is not pinned here; its actions, canvas behaviour, comment schema and `list` wording can change between releases. The observation is dated evidence, valid for the owner's review, not a contract.
- **Owner availability is on the critical path.** S5–S6 need the owner at the canvas, and D7 can lengthen the loop if a comment cannot be applied. Saving the comment for a later session is possible, but then "observed" must say so.
- **Data / retention:** screenshots under `.screenshots/` are binary and may show transient states; under D3(a) they disappear with the consumer, so any claim about them must be quoted in the report or it is lost.
- **Dependency risk is upstream.** #343 `D1`/`D7` decide the consumer and retention, #347 `P1`/`P2`/`P6` decide the renderer command and the reused consumer; if any changes, Setup's inputs change and no artboard may be produced against the old ones.
- **Untestable here:** whether a designer or agent would follow `system.md` from a *different* model, real cross-browser rendering of the canvas, and any automated conversion. 390/1280 reasoning done on an artboard is the artboard's declared viewport (`SKILL.md:68`), not a measurement.
- **Out of scope:** transformation skills, any artboard-to-React conversion, codemods, new components, token or naming changes, `packages/` source, `package.json`, `design/` committed in this repository (pending D3), creating issues before approval (AC3), npm/GitHub Packages publication, CI, the pilot consumer itself (#343), the renderer (#347), the artifact and MCP server (#345, #346), and Pulso/egdev.es.

### Acceptance criteria traceability

| Criterion | Requirements | Planned evidence |
| --- | --- | --- |
| AC1 — each observed step, with artboards and comments | R1, R2, R3, R4 | S0–S7 rows with verbatim tool output, files and mtimes; per-artboard self-check; comment ids and resolves; owner verdict |
| AC2 — every artboard element mapped or listed as a gap | R5 | Mapping table with one row per selector, availability lines, and the quoted selector/row count check |
| AC3 — follow-ups proposed, none created without approval | R6, D5 | Gap table with proposed titles and labels, status `proposed — not created` |
| Scope and Guidance — record, do not fix; no automation promised | R7, R8 | Empty `git status` outside the report file; report statements and no new script or dependency |
| Delivery rules and Checks — English, no dependencies, owner review | R9, R10 | `git status --short`, unchanged `package.json`, owner verdict verbatim and dated |

## Owner approval

Approved by the owner on 2026-11-05. Every decision below takes its recommended option, per the owner's answer "Aceptar todas las recomendaciones (Recomendado)". D1 is the one decision whose recommended option is (b).

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (b) The same screen as #343's pilot page (WebTemplate plus two WebSections), one direction only | "Aceptar todas las recomendaciones (Recomendado)" |
| D2 | (a) Run in the #343 pilot consumer, generated on demand the way #343 D1 (a) does | "Aceptar todas las recomendaciones (Recomendado)" |
| D3 | (a) Not committed: artboards, `design.json`, `comments.json` and screenshots stay in the consumer and are removed after the observation | "Aceptar todas las recomendaciones (Recomendado)" |
| D4 | (a) The report lives in this document, plus the owner verdict in the PR body | "Aceptar todas las recomendaciones (Recomendado)" |
| D5 | (a) The gap table is approved with the report, then the issues are created in a separate batch, one per gap, labelled `odd`/`type:*` | "Aceptar todas las recomendaciones (Recomendado)" |
| D6 | (a) No `implement` handoff: recorded as available-but-out-of-scope, nothing executed | "Aceptar todas las recomendaciones (Recomendado)" |
| D7 | (a) An unapplicable comment stays `open`, becomes a gap, and the owner is asked to rephrase or accept the deviation | "Aceptar todas las recomendaciones (Recomendado)" |

Amendments recorded in place: the dependency row and the §1 consumer bullet now name the approved #343 and #347 decisions, and the observation protocol states D1 (b) explicitly so the run cannot be read as three directions. Artboards are removed after the observation (D3 (a)), so every claim about them is quoted in this document.
