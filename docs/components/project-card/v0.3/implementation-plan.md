# ProjectCard v0.3 — implementation plan (header-row status slot)

- **Status:** Proposed, for separate owner approval (gate 3 of S5). It authorizes no code, test, story, registry, artifact, catalog, version, commit or GitHub change. Prepared by static inspection and hash computation only: no test, build, Storybook, browser or package check was run, so every check below is future work.
- **Contract authority:** [spec.md](spec.md) v0.3, Approved on 2026-11-25. `contentSHA256: 0d346d3527c7af30b35db7f68a37001a44e6c26d9a3e2c03d34862ad509b0356`, reproduced byte-exact with the spec's own rule (line-start `## 1. Purpose and scope` through EOF) by two independent methods in this working tree. [Approval record](approval.md): owner answer verbatim "Aprobar con recomendaciones (Recomendado)"; D1–D4 resolved as (a); V1 not granted. `visualHashes` Pending (no capture); visual conformity **Not evaluated**.
- **Coverage:** S3 and S5 of `odd/tasks/pulso-consumer-requests.md` (#558), ProjectCard only, acceptance IDs PC-S1 to PC-S15. Canonical component issue #275; #558 is the request.
- **Plan identity:** `contentSHA256: afd55efd9fb4e358d5ad72505229a3573737f68a3e49631a5a3a34f8a8c55a78` — SHA-256 of the UTF-8 LF payload from `## 1. Authority and gates` through EOF including the final newline; this header is excluded. Changed bytes need renewed approval.
- **Baseline:** branch `feat/pulso-consumer-requests`, HEAD `68ea3a4`. Reviewed whole-file SHA-256 in this working tree: `types.ts` `cb2a69d2…`, `useProjectCard.ts` `3a082f49…`, `ProjectCard.tsx` `27cfc779…`, `ProjectCard.test.tsx` `e0936651…`, `ProjectCard.stories.tsx` `3f6989ca…`, `index.ts` `79a2ea7a…`; precedent `now-card/types.ts` `d768d4f6…`.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surfaces in §2. Spec approval alone grants no code (S5).
2. **G2 — Spec provenance.** Recover the contract from `spec.md` plus `approval.md` (digest, verbatim answer). The draft the owner saw is commit `01ff388` (payload `ccda3e79…`); the finalized spec, `approval.md` and this plan are uncommitted at plan time, so the parent commits them before implementation starts. Nothing is published on #275.
3. **G3 — Registry.** Reuse `leading-status-badge` → `statusBadge` (D1 (a)): no new convention, no exception, no receipt, no convention-text change (hash `sha256:221da6cb…` and approval untouched). One new ProjectCard usage plus a mandatory revision refresh of nine existing ProjectCard usages (§7.1).
4. **G4 — Visual references.** VIS-01 to VIS-05 stay Pending and V1 is not granted: no capture, hosting or harness is planned here. Visual conformity is reported **Not evaluated**, never inferred from pixels or from the Pulso source.
5. **G5 — No token, dependency, Material or stylesheet change.** Layout-only recipes (§4): no new token, no Material recipe, no stylesheet (spec: "No stylesheet"; `compiled.css:52` `@source "../molecules/**/types.ts"` and `.storybook/preview.css:19` already scan the touched files), no inline style, no arbitrary value, no dynamic class interpolation, no new export. `packages/tokens/**`, dependencies and `legacy/bundle.css` stay byte-identical.
6. **G6 — Evidence ordering.** Editing `types.ts` stales, in one stroke, nine registry revisions, the generated prop-naming view, `design-system.json` and `system.md`. Settle the final `types.ts` bytes first, then regenerate in the §7 order; any later `types.ts` edit repeats the regeneration.
7. **G7 — The legacy cascade is live.** The shipped stylesheet imports `legacy/bundle.css` into `@layer components` (`styles/index.css:12`), and `bundle.css:293` gives `.eg-project-card` `align-items:flex-start` and `overflow:hidden`; no ProjectCard or Surface utility overrides either (corroborated in the untracked local build output `packages/ui/dist/styles.css:830-837`, not re-built here). §4 and R2 follow from this.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned change |
| --- | --- | --- |
| `packages/ui/src/molecules/project-card/types.ts` | Writer | `statusBadge?: ReactNode` with the approved JSDoc; three private CVA recipes (§4); `type` only, no new exported type |
| `packages/ui/src/molecules/project-card/useProjectCard.ts` | Writer | Presence rule, class composition, native-rest stripping (§3); no JSX |
| `packages/ui/src/molecules/project-card/ProjectCard.tsx` | Writer | JSX only: one shared header node used by both branches |
| `packages/ui/src/molecules/project-card/ProjectCard.test.tsx` | Writer | New `describe` block with the RED-first cases of §5; no existing case is edited |
| `packages/ui/src/molecules/project-card/ProjectCard.stories.tsx` | Writer | Four stories appended and meta text (§6) |
| `packages/ui/src/organisms/lab-stage/LabStage.stories.tsx` | Writer, **optional (PD1)** | Add `statusBadge` to the existing experiment composition (`:9-18`); no LabStage API, test or recipe change |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | PC-10 case (`:1379`): own count `:1395` 8→9, `controls` map `:1384` gains `statusBadge: 'false'`, `props.statusBadge` and `controlReason` assertions, story-name list `:1478-1488` gains four names |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `projectcard` row `:385-394` gains `statusBadge: false`; count `:805` 8→9 |
| `skills/_shared/prop-naming.json` | Parent | One usage appended, nine revisions refreshed (§7.1) |
| `docs/prop-naming.md` | Parent | Regenerated by `pnpm props:docs` only |
| `scripts/prop-naming.test.mjs` | Parent | Post-receipt pair and receipt-test updates (§7.1) |
| `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs` | Parent | Packed SSR, emitted-CSS and typed-consumer cases (§8) |
| `scripts/design-system-artifact.test.mjs` | Parent | One focused ProjectCard `statusBadge` assertion |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent | Regenerated, never hand-edited (§7.3) |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | `## Unreleased` entries (§9) |
| `docs/components/project-card/v0.3/implementation-evidence.md` | Parent | Observed results at implementation; no capture files (V1) |

**Untouched:** `packages/ui/src/molecules/project-card/index.ts` (no new export) and `packages/ui/src/index.ts`; `scripts/storybook-mcp-exceptions.json` (no new part); the exported-name allowlists (`storybook-docgen.test.ts:2184-2189`, `package-exports.test.mjs:5897-5902`); `scripts/catalog_data.py` and the generated catalog (§7.4); `docs/components/project-card/v0.1/**`, `v0.2/**` and this folder's `spec.md` and `approval.md`; `packages/tokens/**`; `legacy/bundle.css`; NowCard, Badge, Icon and LabStage source.

## 3. API, hook and JSX

- **Prop:** exactly the spec's JSDoc, in English: optional `statusBadge?: ReactNode`, `@control false`, `@controlReason ReactNode is not serializable; see the WithStatus story for the supplied Badge composition.` (the `ReactNode`…`story` shape the docgen cases assert), no `@default`. Own props go 8 → 9; no `statusClassName`, no ref, no `asChild`.
- **Hook:** `statusBadge` is removed from the native rest so it never reaches `<article>` (PC-S7). Presence is the rule of `useNowCard.ts:46`: `undefined`, `null` and booleans are absent, everything else (including `0`) is present, with no content inspection. It stays a one-line local predicate: sharing it would edit NowCard, which is out of scope. `hasLead` is derived from the normalized index and eyebrow, so whitespace-only values count as absent. Lead density is `sm` only when `size` is `sm` and the card has no upper zone, otherwise `md`: today the plain branch inherits the root's `gap-3` at `sm` while the upper content wrapper is fixed at `gap-4`. The hook returns `statusBadge`, `hasStatus`, `hasLead`, `headerClassName`, `leadClassName` and `badgeClassName`.
- **JSX:** both branches replace their two header spans with one `header` node built once. Without a status it is the same two spans as today (byte equality, guarded by `ProjectCard.test.tsx:73`); with a status it is a row holding an optional lead group and the badge wrapper. The card never clones, inspects or reorders the node, and `Badge` is not imported (`composedOf` stays Chip).

## 4. Recipes and class composition

| Part | Static CVA (token or keyword utilities only) | Basis |
| --- | --- | --- |
| Header row | `flex min-w-0 flex-wrap items-center gap-3 self-stretch` | Spec §6: wrapping flex, centered cross axis, one gap step, `min-w-0`; `self-stretch` is a plan-level addition (PD2) |
| Lead group | `flex min-w-0 flex-col`, `density` axis `md: gap-4`, `sm: gap-3` | Keeps today's index-over-eyebrow spacing |
| Status wrapper | `eg-project-card__badge flex min-w-0 max-w-full ms-auto` | Logical-end pin with no `ml-*` or `mr-*`; marker per D4 |

- Recipe names: `projectCardHeaderVariants`, `projectCardLeadVariants`, `projectCardBadgeVariants`, all private to the module. Each part composes through `cn()` in the hook, with no consumer class surface; root `className` still merges last.
- They paint nothing (no background, border, shadow, gradient or radius), so no Surface or Material recipe applies. None carries `order-*`, `hover:`, `transition*`, `cursor-*`, `truncate`, `line-clamp`, `overflow-*` or `whitespace-nowrap`.
- Vocabulary: `flex`, `flex-col`, `flex-wrap`, `min-w-0`, `items-center`, `gap-3` and `gap-4` already appear in this file's recipes; `ms-auto`, `max-w-full` and `self-stretch` are new to it (keyword values, no scale or token surface; the first two are named in spec §6). `gap-3` and `gap-4` resolve through the spacing aliases to `--space-*`; §8 proves the emitted declarations instead of assuming them.
- **Why `self-stretch`:** in the plain branch the row is a direct flex item of `.eg-project-card`, whose legacy `align-items:flex-start` (G7) would let it hug its content, so `ms-auto` could not reach the card's inline end. `align-self` on the item beats the container's `align-items` by CSS semantics, not by layer order. In the upper-zone branch the parent is the card's own `flex-col` wrapper (default stretch), so it is a no-op there.
- `gap-3` and `items-center` follow spec §6; the final step and the alignment against a two-line lead stay provisional until captures exist (spec §6, V1).

## 5. Test-first sequence

Every behavior test is written and run RED before the source change, through the public interface and without full class strings. RED and GREEN use the identical command: `pnpm exec vitest run packages/ui/src/molecules/project-card/ProjectCard.test.tsx --maxWorkers=2 --no-cache --configLoader runner`. Cases share one `statusBadge` fixture, `<Badge tone="warning" icon={<Icon name="alert" />}>testing</Badge>`.

| Step | RED test (`ProjectCard.test.tsx` unless noted) | Covers | Intended RED today |
| --- | --- | --- | --- |
| R1 | Status sits in one `.eg-project-card__badge` inside the row that also holds index and eyebrow, after them and before the heading; the Badge keeps `data-tone="warning"` | PC-S1 | Wrapper absent: `querySelector` returns null |
| R2 | `0` renders verbatim; status → none rerender restores today's markup; `undefined`, `null`, `true`, `false` (`it.each`) equal the previous markup (extends `:73`) | PC-S2 | `0` and rerender cases fail (no wrapper). The four-value equality is PRESERVE and passes before and after |
| R3 | Shape matrix (index+eyebrow, index only, eyebrow only, neither): row children are `[lead?, badge]`, lead only with index or eyebrow, index above eyebrow, wrapper last with `ms-auto` and no `ml-*`/`mr-*`, row has `self-stretch` | PC-S3 | Row absent |
| R4 | Upper zone: Mark, row, heading in that order; row inside the upper zone; one scrim; status absent from the body; first-part-wins unchanged; Mark-only card (extends `:105`, `:145`) | PC-S4 | Row absent |
| R5 | Article name is exactly the heading text; status text exposed (no `aria-hidden` ancestor up to the article); wrapper has no role or `aria-*`; Badge icon wrapper `aria-hidden`; DOM order eyebrow, status, heading; no `order-*` | PC-S5 | `closest` returns null. The name check passes today (PRESERVE) |
| R6 | Tab sequence with a body link and the footer action unchanged in both branches; row, lead and wrapper carry no handler, `hover:`, `transition*` or `cursor-pointer` (extends `:321`) | PC-S6 | Wrapper null. The tab sequence is PRESERVE |
| R7 | `renderHook(useProjectCard)`: `rootProps.statusBadge` undefined, consumer `aria-describedby` forwarded, protected props still stripped; DOM `article` has no `statusbadge` attribute; no `console.error` after the change | PC-S7 | The node leaks into `rootProps` and onto the `article` as an unknown attribute |
| R8 | Lead `gap-3` at `sm` (plain), `gap-4` at `md` and in the upper zone; `featured` leaves row and wrapper class strings equal to `default` | PC-S8 | Lead absent |
| R9 | Narrow host (`w-48`) with a status: the forbidden-utility scan of `:290`, excluding `.eg-chip` and `.eg-badge`; row has `flex-wrap`; the existing `:290` case stays untouched | PC-S9 | Row absent. The scan alone is PRESERVE |
| R10 | Root `className` merges last with a status present; own-prop count 9 (docgen) | PC-S10 | Count 8 ≠ 9 |
| R11 | `storybook-docgen.test.ts` PC-10 case and `storybook-controls.test.ts` rows (§2) | PC-S11 | `own` has 8 declarations; the controls row lacks `statusBadge` |
| R12 | `scripts/prop-naming.test.mjs` edits (§7.1), then `pnpm test:props` | PC-S12 | Usages are `['NowCard']`. Once `types.ts` changes, `pnpm props:check` fails with `Stale evidence revision` for the nine usages (expected intermediate state) |
| R13 | Packed harness cases (§8) | PC-S13 | Needs a build of the pre-change source; the edited harness then fails on the missing marker and utilities. No jsdom-only RED exists for emitted CSS |
| R14 | None | PC-S14 | No capture: **Not evaluated** |
| R15 | Blank title with a status renders nothing and warns once; v0.1/v0.2 cases (`PC-01` to `PC-16`) and LabStage tests pass unedited | PC-S15 | PRESERVE: passes before and after |

**PRESERVE.** The no-status path is guarded by R2's byte equality and by leaving every existing case unedited except the pinned counts and story list. The hook, recipes and JSX are ProjectCard-private, so no shared helper, option or parser changes and no cross-command differential run is needed.

**GREEN order:** `types.ts` → `useProjectCard.ts` → `ProjectCard.tsx` → focused GREEN → stories → registry and artifacts last (G6). Refactor only with the focused checks green.

## 6. Stories and Controls

`Molecules/ProjectCard`, autodocs, the existing `Meta<typeof ProjectCard>`, no manual `argTypes`, no `play`, all text in English. The meta description gains one paragraph: `statusBadge` takes one consumer-supplied, non-interactive Badge composition; the card owns no status word, tone or icon, and no announcement. Existing stories and their order are unchanged; new ones are appended after `LongContent`:

- `WithStatus`: `title` "OpenDesign × Gentle AI", `index` "014", `eyebrow` "Experiment", the warning "testing" Badge with the alert icon, one paragraph (the #558 Lab card; VIS-03).
- `StatusPlacements`: `sm` cards in `grid max-w-3xl grid-cols-2 items-start gap-6` showing status only, eyebrow only, index only and both (VIS-04).
- `StatusOverBackdrop`: Backdrop, Mark and a status, with Badge `variant="solid"` as a consumer legibility choice (VIS-05).
- `StatusInNarrowCard`: a `w-72` host with a long eyebrow and title so the row wraps (VIS-04).

Only story utilities this file already uses appear, so `.storybook/preview.css:19` covers them and no `@source` edit is needed. Controls: the `statusBadge` row carries `@control false` with its reason; verify AST coverage, real docgen, extraction/enhancer/inference and zero owned diagnostics, then the actual browser widgets (§11).

## 7. Registry, docgen and artifact obligations

**7.1 Registry (parent).**
- `skills/_shared/prop-naming.json`: append to `leading-status-badge.usages`, after NowCard, `{ component: ProjectCard, type: ReactNode, status: existing, source: { path: packages/ui/src/molecules/project-card/types.ts, symbol: ProjectCardProps, revision: sha256:<whole-file hash of the final types.ts> } }`. Refresh `source.revision` to the same hash on the nine existing usages whose source is this file: `heading-title`, `heading-level`, `heading-eyebrow`, `decorative-index`, `visual-treatment` and `preset-dimensions` (`ProjectCardProps`), `accessible-name` and `collection-items` (`ProjectCardCodeProps`), `collection-items` (`ProjectCardTagsProps`). `props:check` enforces this freshness. No entry's text, status, aliases, exceptions or `approval` changes, `docs/components/now-card/v0.1/leading-status-badge-approval.json` is not edited, and no receipt is added.
- `scripts/prop-naming.test.mjs`: add `'leading-status-badge'` to the ProjectCard `ProjectCardProps` id list (`:739-750`). This is required: the post-receipt test (`:1554`) asserts every listed pair, and the receipt tests strip listed usages through `historicalRegistry` and expect none left. In the `leading-status-badge` receipt test (`:3390`) expect usages `['NowCard', 'ProjectCard']` (`:3433`) and assert the new usage's path, symbol and revision read from the working tree.
- Then `pnpm props:docs` (never hand-edit `docs/prop-naming.md`), `pnpm props:check`, `pnpm test:props`.

**7.2 Docgen and Controls pins (parent).** As in §2 and R10/R11. The story-name list moves in the same commit as the stories (§12), because the PC-10 case asserts both in one `it`.

**7.3 Artifact (parent), only after 7.1 settles.** `pnpm artifact --write`, `pnpm system:docs`, then `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system`. Expect `ProjectCard.props` to gain `statusBadge` (`ReactNode`, optional, default null, description from the JSDoc), `variants` and `anatomy` to gain the three recipes, and `propNaming` `leading-status-badge` to list ProjectCard. `parts` (five), `composedOf` (Chip only: Badge must not appear, the card does not import it), `classNameAllows` and every other component stay unchanged. `design-system.json` is one minified line of 605,026 bytes against the 768 KiB budget (786,432): expect growth of a few KiB, report any overflow and never weaken the budget; never hand-merge it.

**7.4 Catalog.** No change planned: no level, package, export or Radix change, and the ProjectCard row's composes column already lists Badge. Its note still describes v0.1 and omits v0.2's parts too; refreshing it is a separate parent-only unit (`scripts/catalog_data.py`, then `python3 scripts/build_catalog.py`, never hand-edit generated files) that #558 does not require.

## 8. Package exports and consumption

- `scripts/package-exports.test.mjs`: the SSR case (`:5228`) renders a `statusBadge` built from the packed exports and asserts `eg-project-card__badge`, `ms-auto` and `self-stretch` appear, and that none appear without a status; the existing `tabindex`/`role`/`aria-live` guard stays. Add `projectCardHeaderVariants`, `projectCardLeadVariants` and `projectCardBadgeVariants` to the private-name lists (`:5289-5297`, `:6595-6611`; the second list already omits v0.2's five recipes, a pre-existing gap not widened here). The shipped-CSS case (`:5302`) asserts `.ms-auto`, `.max-w-full`, `.self-stretch`, `.flex-wrap`, `.gap-3` and `.gap-4` with their declarations from the emitted `@layer utilities`, and still finds no hand-authored `.eg-project-card` block and no `project-card.css`.
- `scripts/package-consumption.test.mjs`: a new sample outside `App` (as the existing ProjectCard samples, `:1666-1716`) with a Badge and Icon `statusBadge`; a `@ts-expect-error` negative for `statusClassName`; `assertProjectCardCSS` (`:4697`) gains the same selectors; the packed SSR/JSDOM block (`:6755`) asserts the wrapper inside the row when supplied, its absence otherwise, and that the footer link stays the only tab stop. React 18.3.1 and 19.3.0 as the existing gates run; no React-19-only API; no consumer Tailwind compiler. Offline-cache availability is unverified.

## 9. Changelog entries (English, `(#558)`)

`packages/ui/CHANGELOG.md`, a new `## Unreleased` above `## 0.10.0`:

```md
## Unreleased

### Added

- ProjectCard accepts an optional `statusBadge` node, typically a Badge, rendered in a header row at the inline end, after the index and eyebrow and before the heading, for a short non-interactive status such as a warning "testing" Badge with an alert icon. Without it the card renders as before. Consumers provide short localized status text, keep the node non-interactive and own any announcement of status changes. (#558)
```

`packages/system/CHANGELOG.md`, a new `## Unreleased` above `## 0.12.0`:

```md
## Unreleased

### Added

- The source-derived artifact and reference include ProjectCard's `statusBadge` slot and its `leading-status-badge` usage. (#558)
```

No `package.json` edit and no version bump: `docs/distribution/versioning.md` keeps `## Unreleased` out of `release:pack` and `release.json` until a separate release decision moves the entries.

## 10. Checks to run

Focused first, one at a time in the foreground, with observed output recorded in `implementation-evidence.md` as `<exact command>: <observed result>`:

```sh
pnpm exec vitest run packages/ui/src/molecules/project-card/ProjectCard.test.tsx --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/organisms/lab-stage packages/ui/src/molecules/now-card --maxWorkers=2 --no-cache --configLoader runner
pnpm typecheck
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --write
pnpm system:docs
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
pnpm lint
```

Broader checks only with explicit authorization: `pnpm test`; `pnpm build` (writes outputs and regenerates the artifact, so rerun the freshness checks if inputs changed); `pnpm test:package-exports`; `pnpm test:package-consumption` (isolated packed fixtures, may install, needs a verified offline cache); `pnpm test:mcp` (builds `@egdev/mcp`; grep found no ProjectCard reference in `packages/mcp/tests` or `packages/system/tests`); `pnpm storybook-build`. A command that cannot run is recorded with its blocker and its evidence stays Pending; green metadata or HTML smoke never stands in for appearance or accessibility.

## 11. Real-browser checks (separately authorized: local server and real browser)

Against `pnpm storybook`, which imports `compiled.css` and therefore the same legacy layer as the shipped stylesheet (`.storybook/preview.css:3`). Record computed values and geometry; take no captures without V1.

1. Controls: the `statusBadge` row is present with a disabled control and its reason, and there are zero owned diagnostics.
2. G7: in the plain branch, row `align-self`, row width equal to the card's content width and the status at the inline end (`WithStatus`, `StatusPlacements`). Remove `self-stretch` once to prove it is needed, record the observation, then restore it.
3. PC-S9 at 390 px and in the `w-72` host: the row wraps, the status drops to its own line at the inline end, `scrollWidth <= clientWidth`, the status stays inside the card's content box, and there is no horizontal page overflow. Record what the legacy `overflow:hidden` does to an over-wide label: spec §4 says it "overflows rather than being clipped", so if the shipped CSS clips at the card edge, that sentence needs a precision amendment through a new spec approval, not a silent edit.
4. RTL host (`dir="rtl"`): the status sits at the inline end (left); only logical utilities are used.
5. `StatusOverBackdrop`: legibility and contrast of the status over the well and scrim, **Not evaluated** until observed.
6. Alignment against a two-line lead and the `gap-3` step: observe and report; changing either is a spec question, not an implementation tweak.
7. Reduced motion and 200% zoom: nothing animates and the row reflows.

Visual conformity against VIS-01 and VIS-02 stays **Not evaluated** until V1, real captures and adoption exist.

## 12. Commit slicing (about 400 lines; the parent owns commits)

| # | Commit | Content | ≈ lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the ProjectCard header-row status slot (#558)` | `types.ts` +28, `useProjectCard.ts` +21, `ProjectCard.tsx` +14, `ProjectCard.test.tsx` +250, docgen and controls pins +14, registry JSON +30, `prop-naming.test.mjs` +10; generated: `docs/prop-naming.md` 18, `design-system.json` 1, `system.md` 6 | 392 |
| 2 | `docs(ui): add ProjectCard status stories (#558)` | stories +82, docgen story-name list +4, optional LabStage story +7 | 93 |
| 3 | `chore(integration): cover the ProjectCard status slot in the package harnesses and changelogs (#558)` | `package-exports` +32, `package-consumption` +37, artifact test +16, two changelogs +15 | 100 |

**Estimate: about 585 changed lines** (about 560 written by hand plus about 25 generated; about 553 written without the optional LabStage story). Slice 1 carries the registry and generated files because every commit must keep `props:check`, `artifact --check` and `system:check` green and a `types.ts` change stales all three. Slice 2 stays green because the story-name pin moves with the stories. Slice 3 only adds assertions about behavior slice 1 already ships.

## 13. Pending owner decisions

- **No Material recipe, token, dependency or literal is pending.**
- **PD1 — LabStage story (optional edit surface).** Add the "testing" status to the existing experiment composition in `LabStage.stories.tsx`, which already renders `eyebrow="Experiment"` and `index="014"` (+7 lines). Recommended: include. If undecided, the file stays untouched.
- **PD2 — `self-stretch` on the header row.** A plan-level addition to spec §6's illustrative recipe, justified by G7. Recommended: include. Declining leaves the status hugging the lead in the plain branch under the shipped stylesheet, which §11.2 would show.
- **PD3 — Pending evidence that does not gate this plan:** V1 and captures (VIS-01 to VIS-05); the gap step and the alignment against a two-line lead; and the spec §4 overflow sentence versus the legacy `overflow:hidden`, which may become a spec amendment (§11.3).
- **PD4 — Release and version.** Separate; this plan writes `## Unreleased` entries only.

## 14. Risks

- **R1 — Stale-evidence cascade (G6).** One `types.ts` byte stales nine revisions, the view and both artifacts. Regenerate after the final edit, in the §7 order.
- **R2 — Legacy cascade (G7).** `align-items:flex-start` and `overflow:hidden` on `.eg-project-card` live in the shipped CSS. The first is neutralized for the row by `self-stretch`; the second may clip an over-wide status at the card edge. The legacy `__code` and `__foot` rules already apply to the existing parts and are not changed here.
- **R3 — Shared files across the four consumer-request branches (#556 to #559).** Both changelogs, `prop-naming.json`, `docs/prop-naming.md`, `prop-naming.test.mjs`, the docgen and controls tests, the package harnesses, the single-line `design-system.json` and `system.md` will conflict. Land the branches in turn, rebase, and regenerate generated files after each rebase; never hand-merge them.
- **R4 — Duplicated presence predicate.** The local `present()` mirrors NowCard's; drift is possible. Extract only if a third card needs it, in its own reviewed change.
- **R5 — `statusBadge={0}` renders "0".** By design (no content inspection, as NowCard); it is a consumer responsibility, documented and tested (R2).
- **R6 — No visual evidence.** The Pulso `.row` gap (12px) is not a token step and the status alignment is unproven; no pixel inference.
- **R7 — Package matrix.** React 18/19 results and the offline cache are unverified; types and SSR alone prove no compatibility.
- **R8 — Controls metadata.** The `@controlReason` must keep the `ReactNode` … `story` shape or the docgen assertions and the central enhancer report a diagnostic.

## 15. Stop

This plan authorizes nothing until G1. No source, test, story, token, dependency, registry, artifact, catalog, version, Git or GitHub action is taken or implied. Stop for owner resolution if a gate, the legacy cascade, the emitted utilities or a spec sentence cannot be satisfied as written; never edit the approved spec silently.
