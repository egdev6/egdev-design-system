# Sidebar/NavList — Antena desktop defaults
Objective: implement the approved desktop defaults and both approved plans on `feat/sidebar-antena-look`; base `ccbf24bf47fc2f4f48584071d0426d6c7a12cfd8`.
Delivery: local work-unit commits; `auto-chain` / `feature-branch-chain` if publication is later authorized; forecast ~850 authored lines excluding generated artifacts. Runners: the commands in the approved implementation plans below; no publishing in this task.

## Specs

- **S1 — Desktop-only scope.** Selected option: “Desktop only (recommended)” — “Draft Sidebar/NavList amendments, an implementation plan, and token proposals. Exclude the mobile strip; preserve AppShell’s bottom-navigation switch. No component code changes.” The final sentence described the earlier documentation phase; S4 now authorizes implementation. AppShell, TabBar, the legacy `eg-menu` bundle and consumer migrations remain excluded.
- **S2 — Replace defaults, preserve API and targets.** Selected option: “Replace the defaults (recommended)” — “Update the proposed Sidebar and NavList visual contracts, as #401 requests. Keep their APIs and the 44px minimum targets; existing NavList consumers receive the new appearance.”
- **S3 — Approved recipe.** The owner accepted these exact proposal terms with “aprobado, escribe en español”: “Default width: **240px**.”; “Rows: **Barlow 13.5px/1.2, weight 400**, padding **7×8px**, icon gap **10px**.”; “Groups: **Barlow Condensed 14px/1, weight 700**, uppercase, tracking **0.14em**.”; “Leading icons: **16px**, inheriting row text color.”; “Hover: `surface-2`.”; “Current row: `surface-2`, Surface sheen/material, and a **2px brand-red marker**.”; “Preserve navigation, Radix disclosure, counters, metadata and focus behavior.”; “**Keep 44px minimum targets**—an intentional difference from Antena’s compact rows.”; “No new variant prop or stylesheet proposed.” The same accepted proposal specified “**zero row tracking**” and a “**logical-start marker in RTL**”. Exactly four token additions were approved: `--text-nav-row: 13.5px`, `--text-nav-group: 14px`, `--text-nav-group--line-height: 1`, `--text-nav-group--letter-spacing: 0.14em`; reuse existing fonts, weights and row companions, not extra tokens.
- **S4 — Implementation and checks authorized.** In direct response to “**Necesito tu decisión:** ¿aprobás ambos `implementation-plan.md` para pasar a implementación?”, the owner answered “si”. Approved plans: [NavList v0.3](../../docs/components/nav-list/v0.3/implementation-plan.md) and [Sidebar v0.2](../../docs/components/sidebar/v0.2/implementation-plan.md). Their exact future edit surfaces, test-first rules, normal verification, built/packed React 18/19 checks and browser inspection are authorized. The [NavList amendment](../../docs/components/nav-list/v0.3/desktop-recipe-amendment.md) payload SHA-256 is `cfb1b0a4dbf1978131a9918a82342cea15ae9fafb63be8db3020a74f85c0b85f`; the [Sidebar amendment](../../docs/components/sidebar/v0.2/desktop-recipe-amendment.md) payload SHA-256 is `6fa891a80786cf6e3d5304d4eaab9fc9bbd93ffa44fe765832ead321a76aad7d`. No dependency additions, publishing, new props or extra appearance mechanisms are authorized.
- **S5 — Language.** Exact owner request: “aprobado, escribe en español”. Conversation replies are Spanish. Repository code/tests/docs remain English under the project artifact rule; preserve exact owner quotes in their original language.

## Tasks

- **T1** — S1–S5 — Record plan approval, preserve amendment payloads, install the existing lockfile dependencies and commit the documentation baseline. Route: bounded worker (parent context backstop) plus parent setup/checks. Risk: none (passive docs/setup with unchanged dependency versions). Status: in_progress. Commit/evidence: pending.
- **T2** — S2–S4 — Add the four typography tokens, integrate the existing `cn()` typography inventory and narrowly adapt token/package contract guards without changing existing behavior. Route: bounded worker (context backstop), then one independent verifier before native review. Risk: item 3 (shared `cn()` merge behavior used by other components). Status: pending. Commit/evidence: pending.
- **T3** — S1–S4 — Implement the NavList and Sidebar default recipes with focused public tests, stories and affected built/packed CSS assertions. Route: bounded worker (context backstop); dependent on T2, not a parallel writer. Risk: reassess actual diff; do not change unrequested metadata/semantic icons or shared behavior. Status: pending. Commit/evidence: pending.
- **T4** — S1–S5 — Finish full functional/build/packed/browser verification, preserve review boundaries and record truthful evidence/remaining visual approval before closure. Route: parent background checks and bounded evidence work; T2's independent verifier is not repeated here. Risk: assessed from actual code diff. Status: pending. Commit/evidence: pending.

## Log

### L1 — Original handoff (verbatim)

Session message from 01a1d3db-81ff-7363-b06d-f8da1933960a (correlation faaac9660cbef1b3d94b6712371fb8b8): Handoff from the egdev-media-tool session, by Enrique's request («manda a la sesión abierta del design system el asunto del sidebar y navbar que ya seguimos allí»).

Context: Enrique prefers Antena's side navigation look over the current DS Sidebar + NavList. Issue: https://github.com/egdev6/egdev-design-system/issues/401 (open, enhancement, now status:needs-review). Antena reference (read-only): /home/egdev/proyectos/antena/app/src/panel/Sidebar.tsx and app/src/styles/panel.css (~45-95): width 240 px; rows Barlow 13.5/400, padding 7×8, 10 px icon gap; group labels Barlow Condensed 14/700 uppercase .14em; hover surface-2; active surface-2 + sheen + 2 px inset brand-red bar; 16 px icons inheriting text color; ≤860 px horizontal strip.

A worker attempted the implementation and stopped without changes because #401 conflicts with approved contracts:
1. NavList v0.2 contract sets the current row to surface-3 (docs/components/nav-list/v0.2/implementation.md:18): the red-bar active state needs a versioned amendment + implementation plan.
2. AppShell hides Sidebar below 56rem when bottom nav is supplied (packages/ui/src/templates/app-shell/types.ts:68), so the ≤860 px strip conflicts with AppShell, which #401 excludes. Proposal discussed with Enrique (not yet confirmed): drop the mobile strip from scope and keep AppShell's bottom-nav switch.
3. Antena's type/spacing values (13.5 px, 7×8) have no tokens: token approval needed. Sidebar delegates responsiveness to host (docs/components/sidebar/v0.1/implementation-plan.md:36).
Suggested path: a docs PR with Sidebar/NavList amendments + implementation plan + proposed tokens, then implementation with tests after approval.

State left for you: a clean worktree /home/egdev/proyectos/egdev-design-system-worktrees/sidebar-antena-look on branch feat/sidebar-antena-look (from origin/main ccbf24b, no commits, no node_modules installed). Reuse or remove it as you prefer.

Media Tool side (not blocked by this): its vendored app/ds is being updated to DS ccbf24b on egdev-media-tool branch feat/ds-sync, and its redesign artboards use the Antena look described in #401 for the sidebar until the DS adopts it.

### L2 — Settled proposal decisions

The owner selected the exact desktop-only and replace-defaults options quoted in S1/S2. Later reply: “aprobado, escribe en español”. This approved S3's recipe/token/Material terms, not code at that stage. Four documentation files were saved; final documentation checks passed 84 worker assertions and 32 parent assertions. Visual conformity was not evaluated. The native assessment of those untracked documents was unavailable; it created no review lineage and is not approval evidence.

### L3 — Implementation approval

Owner reply, verbatim: “si”, immediately following “**Necesito tu decisión:** ¿aprobás ambos `implementation-plan.md` para pasar a implementación?”. Both plans and their necessary checks are now authorized. Do not ask for the same approval again. Provider-owned native review consent remains separate.

### L4 — Resume and routing evidence

Confirmed main is clean; linked feature worktree at the base contains only the four owned new docs, with no node_modules or previous feature tracker. `node --version`: v24.22.2; `pnpm --version`: 10.34.6. No stale Engram observations require review. The parent context backstop requires delegating the next multi-step writing unit. T2/T3 share package-test surfaces and are dependent, so writers must run sequentially. Forecast exceeds the review-size heuristic: use coherent local commits and preserve a feature-branch-chain delivery shape if publication is later authorized; no push/PR is authorized by this plan approval.

### L5 — T1 setup and documentation evidence

Frozen-lockfile installation completed successfully in background job `job-2` (exit 0, ~3 seconds); no dependency versions or tracked lockfile changed. Worker `mwf5h0hh-5-ctqe` recorded both plan approvals in metadata only and passed 365 structural checks after correcting its heading-search checker. The parent initially used an incorrect status phrase in its checker, corrected that checker once, then observed PASS with preserved amendment hashes and no tracked source changes. Runtime tests/builds are not applicable to this passive documentation baseline. Preparing the first local work-unit commit; no native review authority has been created.
