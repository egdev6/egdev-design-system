# Gauge v0.9 — implementation and retirement plan

**Pending human approval — no implementation or deletion has begun in this documentation unit.** Approving the [composition amendment](composition-amendment.md) and saving it locally does not approve this plan. The [manual record](approval.json) binds the limited conversation decision, not execution. No v0.9 plan-approval record exists or is inferred from v0.8.

## Decision requested

Approve the complete sequence below: preserve the current dirty-tree evidence, adapt Gauge to a native Material well, verify parity before retiring Surface, remove exactly the 20 listed files and their public availability, maintain affected tests/docs/catalog/registry, then report actual validation and remaining blockers. This intentionally removes Surface, IconButton and Tabs APIs; it does not preserve them privately.

**Proposed approval question (not answered):** Do you approve this entire plan, including Gauge adaptation, the 20-file retirement, active-reference/catalog/registry maintenance and the scoped tests and parity checks, to start local implementation under the stated restrictions?

No step below is executable until that separate decision is recovered. Review units are grouped by responsibility and resumability, not classified by path counts or visual size.

## Contract and permission boundaries

- Effective contract: immutable [v0.8 base](../../../specs/gauge.md), payload SHA-256 `f0999610927cc8556259c3896365697f4447ebae69eff810f3a2b66b57a3210d`, its [approval](../v0.8/approval.json), and the bounded [v0.9 amendment](composition-amendment.md). The amendment digest identifies a post-decision local delta snapshot, not a newly hash-presented full specification.
- Gauge public API/defaults, passive accessibility, states, numeric policy, seven meaningful files and geometry-only stylesheet stay unchanged. The old [plan approval](../v0.8/plan-approval.json) records the existing private normalized-value property; do not treat it as v0.9 approval.
- No new dependencies, token values, package versions, release work or broad style migration. **Keep declared Radix dependencies**: removing installed declarations requires separate authorization. No package manifest/lockfile/config changes are proposed.
- This docs-only unit neither starts nor inspects a server/browser. Parent reports an existing authorized Storybook server, job 31; implementation must confirm continued ownership/availability before using it. This plan grants no server start/restart. Missing server/capture access stops that check for separate authorization.
- No GitHub operation, external asset handoff, upload, network fallback, install, commit, push or release. Native assessment remains the parent's independent work, not a writer-authored approval.

## 1. Preserve evidence; adapt Gauge before deleting dependencies

1. Record the current working-tree manifest and source hashes, distinguishing tracked/untracked and existing edits. Preserve the current contents needed to recover the retirement, not merely HEAD: five retirement targets are already modified (IconButton stories/types, Tabs stories/types and Surface types). Do not reset or discard those edits. After plan approval, the parent will preserve those exact working-tree bytes in an archive and source-hash manifest inside a private directory created under `/tmp/egdev-gauge-v0.9-retirement-*`. This is a local recovery copy, not a component implementation, repository artifact or permanent backup guarantee; no archive is created by the current docs-only unit. Stop if new edits, symlinks or unexpected entries appear.
2. While Surface still exists, obtain fresh before evidence against the accepted pilot. Record Default value 42/normal/md, well/arc 56×56, border-box, padding 0, solid **0px** border, hairline token color without visible width, full radius, surface-0/no image, two-inset well shadow, foreground, conic/mask and +0.5px smoothing. Record fonts loaded, browser/viewport/DPR/theme/media and component-zone MCP crops under `docs/components/gauge/v0.9/verification/`, using distinct before/after names and a capture manifest. Historical captures remain untouched; these new files are planned outputs authorized only if this plan is approved.
3. Use meaningful test-first checks for the changed contract: smallest DOM regression for native Gauge-owned decorative well/no Surface identity, source dependency invariant where appropriate, and static Material utility emission in preview/distributed CSS. Observe the intended failures before implementation; do not demand a failing parity check for behavior intentionally unchanged.
4. Replace only the wrapper with an internal `div`. Put existing token-backed Material appearance into static CVA utilities in `types.ts`, compose each supported part with `cn()` through `useGauge`; no Surface import, `eg-surface` classes or private React helper. Preserve 0px rather than copying Surface's base 1px border. Exact static utility syntax is verified by builds/cascade, not treated as permission for new appearance values.
5. Keep `gauge.css` geometry-only, including +0.5px smoothing; no Material BEM recipe there. Keep all seven meaningful Gauge files: `Gauge.tsx`, `useGauge.ts`, `types.ts`, `gauge.css`, `Gauge.test.tsx`, `Gauge.stories.tsx`, `index.ts`. Retain root layout-only merging, isolated internals, numeric properties and semantic protections. Remove the stale Surface dependency from story meta JSDoc; keep eight real scenarios, no new canvas narrative or manual argTypes.
6. Review public-prop AST/type shape against the base and compare emitted styles plus real computed/pixel/geometry evidence with the fresh before baseline. **Do not delete Surface until Gauge parity is established.** A needed new token, stylesheet role or observable design/API change stops for a separate decision.

**Resume evidence:** before source identity, observed RED/GREEN where meaningful, unchanged API review and before/after parity results. None is claimed by this plan.

## 2. Retire exactly 20 tracked regular source files

Read-only preflight found exactly these 20 tracked regular files, no symlinks or untracked entries inside the three directories. Recheck immediately before any authorized retirement; an unexpected entry or changed preservation state stops the deletion unit. The count is a manifest safeguard, not a component-level classification rule.

| Directory | Exact files to retire | Count |
| --- | --- | --- |
| `packages/ui/src/atoms/icon-button/` | `IconButton.tsx`, `useIconButton.ts`, `types.ts`, `index.ts`, `icon-button.css`, `IconButton.test.tsx`, `IconButton.stories.tsx` | 7 |
| `packages/ui/src/primitives/surface/` | `Surface.tsx`, `useSurface.ts`, `types.ts`, `index.ts`, `surface.css`, `Surface.test.tsx`, `Surface.stories.tsx` | 7 |
| `packages/ui/src/molecules/tabs/` | `Tabs.tsx`, `useTabs.ts`, `types.ts`, `index.ts`, `Tabs.test.tsx`, `Tabs.stories.tsx` | 6 |

There is **no `tabs.css`**; do not invent a twenty-first file or remove whole directories recursively with unknown content.

Remove their package-root component/type/variant exports (including `TabItem`, `iconButtonVariants` and `surfaceVariants`); retain Gauge, `GaugeProps`, `GaugeState`, `GaugeSize` and `cn`. Remove the Surface/IconButton stylesheet imports, retain Gauge geometry and the legacy bundle. Legacy Foundation BEM rules for other concepts remain **design/legacy styles**, not evidence of importable React implementations. Do not mass-purge that bundle or claim the global absence of retired CSS selectors.

**Resume evidence:** manifest/preservation review and per-artifact runtime/declaration absence checks, not a new compatibility promise for removed APIs.

## 3. Maintain active integrations without rewriting history

### Tests, consumer fixtures and usage examples

- `packages/ui/src/lib/storybook-docgen.test.ts`: retire matrices that read the three deleted components; retain real Gauge defaults/native-prop filter, negative annotations, **10 own declarations / 8 unique props**, union-branch requiredness and AST/API invariants. Preserve applicable generic parser/mutation coverage, converting fixtures where necessary rather than disabling the suite.
- `packages/ui/src/lib/storybook-controls.test.ts`: reduce owned-component mapping from **29 to 8 active unique rows**; keep the pure enhancer's generic directive/type/boolean/enum/invalid/override/native fixtures and installed extraction/enhancement/inference checks. Defaults stay constant-only; optional Controls args remain unset when absent. Retiring real components is not permission to drop generic helper coverage or change enhancer configuration.
- `packages/ui/src/lib/storybook-css.test.ts` and `scripts/package-exports.test.mjs`: add native-well Material emission/parity invariants; retain conic/mask/+0.5px, static CVA scanning, layers, no unresolved directives/canonical token definitions, stable CSS exports, explicit token imports and JS importability without a CSS loader. Replace Surface SSR and obsolete component-selector requirements with Gauge API/Material artifact checks and absent retired runtime/declaration exports. Preserve unrelated token/export checks and intentional legacy styles.
- `scripts/package-consumption.test.mjs`: replace the three retired imports/types/TabItem samples, Surface/IconButton refs and disabled-Tabs interaction assertions with Gauge-only samples plus a generic native harness where needed for test infrastructure. Keep strict public-type negatives, SSR/client rerender/recovery, CSS consumption with no app Tailwind compiler, deduplication and native/Tailwind token checks. A native harness is not a new system component or a Gauge ref/action promise. Keep both React majors and the root-pinned fixture package manager; do not skip/disable the fixtures to manufacture success.
- `scripts/storybook-mcp.test.mjs`: replace active three-component assertions/Spanish story expectations with the eight Gauge stories and English API/docs; preserve generic listing/parser isolation fixtures. Metadata/MCP HTML smoke does not verify actual widgets or visual parity.
- `packages/ui/README.md`: replace its active Surface/IconButton/Tabs import example with Gauge-only usage, preserving explicit CSS/token imports and distinguishing legacy class usage from React availability. No root README edit is needed for an active import example.

The existing broad Storybook globs discover Gauge alone after retirement. No `.storybook/main.ts`, preview or enhancer change is needed; preserve the Gauge-native prop allowlist and approved metadata-only integration.

### Catalog, governance and registry

1. Edit only `scripts/catalog_data.py` for availability notes: Surface, IconButton and Tabs are not implemented after retirement, but remain future/provisional catalog concepts with existing levels/actions. Change Gauge composition from Surface to its own native Material well only once code reflects that. No implementation-status schema or blanket name purge. Run `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` to regenerate only `docs/CATALOGO.md` and `docs/catalog.json`; do not edit generated rows manually. The bytecode guard avoids adding a script cache artifact.
2. Make narrow current-availability corrections in `AGENTS.md`, `docs/ARQUITECTURA.md`, `docs/CATALOGACION.md`, `docs/MATERIAL.md`, `skills/_shared/component-contract.md`, `skills/component-contributor/SKILL.md`, and its `references/radix-patterns.md`, `references/stories.md`, `references/testing.md`. Remove claims that retired implementations are usable references. Link current Gauge entry points to the effective v0.9 amendment plus its immutable v0.8 base, so future readers do not mistake the frozen historical composition for the current implementation. Mark generic Surface/IconButton/Tabs examples conceptual/planned or replace with applicable Gauge/native examples. Material's Surface concept and future composition rows may remain clearly planned. Document the Gauge-only native existing-well exception consistently, without widening global appearance or seventh-file policy. New/updated prose is English; leave unrelated legacy text alone.
3. Registry preflight verified **19 fresh usages**: Gauge 8, IconButton 3, Tabs 6, Surface 2. After retirement remove only the 11 retired observations from `skills/_shared/prop-naming.json`. Keep all 13 conventions proposed/null; **five empty usage lists are valid** and render “None recorded”. Do not reassign old usages to Gauge, alter schema/status/approval, or imply global naming consent. After manual API/source review, refresh only the eight Gauge whole-file revisions because its CVA edit changes `types.ts` bytes. Run `pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`; the generator never refreshes evidence or consent.

**Protected history:** never modify the v0.8 base/header, old approvals/plans, captures/reports, v0.3 references, `docs/odd/m3-component-inventory.md`, `docs/odd/m3-component-boundaries.md`, `docs/odd/m3-atomic-proposal.md`, `docs/PLAN.md`, `docs/DECISIONES.md` or original Foundation sources. They record past decisions, not current availability. No source-capture relabeling or new global convention approval.

### Future write scope for approval

Only the seven existing Gauge files; the exact 20 retirement targets; package UI `src/index.ts` and `src/styles/index.css`; the six test/integration files named above; `packages/ui/README.md`; canonical catalog source and its two generated outputs; the nine governance/reference paths named above; registry JSON and generated `docs/prop-naming.md`. The integration/authority sources were inspected for these roles; retirement paths were checked against the tracked regular-file manifest. Generated build outputs follow existing configs, not source/config expansion. After approval, fresh before/after PNGs, `capture-manifest.json`, `retirement-manifest.json` and `report.md` belong under `docs/components/gauge/v0.9/verification/`; the retirement manifest records repository-relative targets, hashes and the local recovery archive's identity. Only the parent creates the private `/tmp/egdev-gauge-v0.9-retirement-*` recovery copy before delegating source changes. These are planned outputs, not existing artifacts or permanent-backup claims. Any additional implementation path needs inspection, justification and a new scope decision, not silent expansion. The current documentation task writes **only its three v0.9 artifacts**.

## 4. Validate and report actual results after approval

All commands/checks here are **planned**, not run or authorized by the present docs-only decision. Run focused deterministic checks first; record failures and fixes honestly.

| Order | Planned validation | Required evidence / limit |
| --- | --- | --- |
| Focused | `pnpm exec vitest run packages/ui/src/atoms/gauge/Gauge.test.tsx packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts` | Meaningful RED/GREEN for new well/dependency/emission checks; retain inherited negative/alternate cases, not full class snapshots |
| Registry | `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` | Source manually reviewed, eight Gauge revisions fresh, no promotion, generated view current |
| Local gates | `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test:package-exports`, `pnpm storybook-build` | Actual exit codes; preview and distribution emit static Material utilities, no consumer Tailwind requirement, no retired JS/type exports; builds are generated artifacts, not new source authority |
| Existing docs server | `pnpm test:storybook-mcp` plus actual Playwright MCP browser review | Eight Gauge stories; live Docs/Controls and native filter, requiredness/defaults/union types, zero owned-metadata diagnostics; no server startup implied |
| Visual / semantics | Comparable before/after component-zone captures and computed styles | Presets/custom sizes, all states, centers, endpoints/decimals/unavailable recovery, Material/border-0/mask/smoothing, IDs/labels/descriptions, passive focus/events; documented font/DPR/media conditions and no invented tolerance |
| Integrity | `git diff --check` plus manifest/base-payload/active-reference review | Preserve unrelated dirty files/history; exact 20 retirements; seven meaningful Gauge roles; base still f099…3210d |

### Consumer and accessibility blockers remain explicit

**Do not run another packed fixture until the required offline cache is provided.** The existing [v0.8 report](../v0.8/verification/report.md) records React 18.3.1 missing `loose-envify` metadata and React 19.3.0 missing the `class-variance-authority@0.7.1` tarball, before consumer assertions. Both are Blocked, not component assertion failures or passed compatibility. No retry is authorized now.

Only after cache availability and scoped execution approval may `EGDEV_CONSUMER_OFFLINE=1 pnpm test:package-consumption` be attempted. Its install must remain `--offline --ignore-scripts`; never substitute an online fallback. The script's offline option is conditional, so the environment restriction is mandatory. Existing-dependency built-artifact consumer smoke may be used only through an already verified, authorized local harness, without new installations; it cannot make the packed matrix green.

Actual screen-reader checks remain **Not evaluated** unless separately performed; automated/AX/addon evidence and accepted pilot images are not screen-reader certification. Do not promote the compatibility/accessibility matrix to green from composition acceptance. Prior reported 134/73 gates or older report counts are historical, not new checks of v0.9.

## Handoff and next step

Report the review units completed, exact touched paths and removals, observed commands/results, visual/semantic evidence and remaining blockers. No implementation-complete or ready-to-release claim while required checks remain blocked/failing. Local delivery does not authorize commits, pushes, GitHub comments/assets, npm publication or release.

**Stop here for the separate plan decision.** This file is a proposal; neither its persistence nor a newly computed hash answers its approval question.
