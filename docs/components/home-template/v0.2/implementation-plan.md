# HomeTemplate v0.2 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, test, registry write, artifact or catalog regeneration, capture, version bump, release or Git action. Nothing below is implemented or measured: preparation was read-only (file reads, digests, `git` inspection), and no build, test, Storybook, browser or capture ran.
- **Coverage:** S3 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), request #566 only, including the owner's L5 extension of the egdev-ds DS046 guard (cli 0.4.1). This is the plan gate that precedes implementation under T6, which is sequential across the Round 5 lanes; the other lanes have their own plans. It covers two packages: `@egdev/effects` (with the `@egdev/system` artifact and the registry that follow from its JSDoc) and `@egdev/cli`. Branch, PR and merge belong to T7 and the parent; the writer never switches branches or commits. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) plan; the HomeTemplate context is the [v0.1 plan](../v0.1/implementation-plan.md) and its [approval](../v0.1/plan-approval.md).
- **Contract authority:** [spec.md](spec.md) v0.2, Approved on 2026-11-26, `contentSHA256: 566afd9457da77bc0662201c06b9a4f5dba86d1ae016f7dc1697ef6c24e8d946`, reproduced byte-exact in this working tree by three independent methods (`awk`, `tail` and Python) with the spec's own rule: the payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline, not the inline mention in the header. Approval record: [approval.md](approval.md): the owner's answer "Aprobar todas (Recomendado)", 2026-11-26, given on the committed draft (`7ed25eb`, payload `ebff110451fdc76bac14ed07f52ebe55f42d5a6c3bc7a66d2db5539467be25c8`) with each recommended answer, and the separate #566 answer "Incluir el CLI: cli 0.4.1 (Recomendado)", which resolves OQ-1 as (b) instead of the draft's (a). Cataloging approval: L3. Visual hash: VIS-01 Pending. Resolved decisions this plan carries: one `@classNameAllows` tag with the thirteen properties (OQ-2); no default sizing and no fallback fill (OQ-3); DS046 reads `@egdev/effects` allowances, package-matched, with DS047, DS048, DS040 and DS041 unchanged, and `@egdev/cli` 0.4.0 → 0.4.1 (OQ-1, spec §3 "CLI contract").
- **Plan identity:** `contentSHA256: eafd5f98f8f2617a015332273b2710ce6531f5d0a30177301e2265177eac3bbe` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line (line start) through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b`. At inspection the tracked changes were other lanes' documents under `docs/components/**` and the parent's log in `odd/tasks/round-5-consumer-requests.md`; nothing under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified. Whole-file SHA-256 prefixes, to re-verify at the start of implementation because earlier T6 lanes will move the shared ones: `packages/effects/src/home-template/types.ts` `ebd47eb4` (equal to the revision of the three HomeTemplate registry usages), `HomeTemplate.test.tsx` `07a425f4`, `HomeTemplate.stories.tsx` `14246948`, `packages/effects/README.md` `cdb11ee7`, `packages/cli/src/appearance-guard.mjs` `6d963a90` (907 lines), `doctor.mjs` `1a134181` (931), `guard.mjs` `1143a87b`, `packages/cli/tests/ds046.test.mjs` `e23bdc18` (913), `packages/cli/README.md` `482d6415`, `docs/distribution/egdev-ds-cli.md` `71944a7a`, `scripts/design-system-artifact.test.mjs` `51238e62`, `skills/_shared/prop-naming.json` `ceb95f54`, `packages/effects/CHANGELOG.md` `40a50dee`, `packages/system/CHANGELOG.md` `ab828f02`, `packages/cli/CHANGELOG.md` `fac17263`. `packages/system/design-system.json` is 610,264 bytes against the 768 KiB (786,432-byte) budget that `design-system-artifact.test.mjs:1300` names, and its `HomeTemplateAnchor` entry has no `classNameAllows` today. Versions at baseline: `@egdev/cli` 0.4.0 (packed in `release/`), `@egdev/effects` 0.2.12, `@egdev/system` 0.13.0, `@egdev/ui` 0.11.0 (the last three are the unpacked 0.11.0 set, S2).
- **Visuals:** VIS-01 is Pending in the spec: no capture, no hash and no expected design exist for the fill. This plan produces behavior, artifact and geometry evidence only; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns. The spec approval alone grants no code (S6). Approving the plan approves no capture, release, GitHub write or version bump beyond the cli 0.4.1 of L5.
2. **G2 — Spec provenance and its one limit.** The owner's answers quoted no digest, so the spec digest binds the bytes derived from the approved draft plus the resolutions, and the detailed CLI contract elaborates the second answer. The plan accepts that as provenance; a reviewer who wants an exact-digest confirmation can ask for it before G1. Nothing here upgrades it.
3. **G3 — Registry.** No new convention, no usage and no exception (spec §3): `className` and the existing `zone` need no entry. The only registry work is refreshing the three HomeTemplate usage revisions that the JSDoc edit invalidates (§5.1). No status, approval, receipt or convention hash changes.
4. **G4 — Code scope.** `@egdev/effects` gets JSDoc only: `useHomeTemplate.ts`, `HomeTemplateAnchor.tsx`, `HomeTemplate.tsx` and both `index.ts` stay byte-identical (`git diff --stat`, §8). `@egdev/cli` changes only the DS046 owner collection and the artifact reader. No token, dependency, Radix package or stylesheet is added: **No stylesheet**, no inline style, no interpolated class and no new AGENTS.md exception.
5. **G5 — CLI boundary.** DS047, DS048, DS040 and DS041, every flag, exit code, JSON and plan format, `init` and `upgrade` file effect and doctor code stay as they are. The one behavior change is disclosed in spec §3 (Compatibility): an app that updates the CLI can get new DS046 errors on classes passed to `@egdev/effects` components. The differential check (§4) enforces the boundary.
6. **G6 — Version.** `@egdev/cli` moves 0.4.0 → 0.4.1 by L5, with a new top `## 0.4.1` section; no other manifest changes, and the effects and system entries go under their existing, unpacked sections (S2). `versioning.md` (lines 93-95) classes "a doctor check" change as a minor bump under 0.x, so D2 asks the owner to confirm the patch bump explicitly; the plan follows L5 until then.
7. **G7 — Integration ownership.** Registry JSON and generated view, the system artifact and its test, catalog source and outputs, the three changelogs, the cli manifest, the evidence file and the odd log are parent-owned integration surfaces, as in the Carousel plan. A writer touches only the component, CLI source, test and doc files marked Writer in §2.
8. **G8 — Stop lines** are listed in §14.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/effects/src/home-template/types.ts` | Writer | JSDoc block with the one `@classNameAllows` tag above `HomeTemplateAnchorProps` (`:45`), as in §3.1; no type or code change | +6 |
| `packages/effects/src/home-template/HomeTemplate.test.tsx` | Writer | E1: one new `it` after the merge case (`:70-117`), which stays unmodified | +22 |
| `packages/effects/src/home-template/HomeTemplate.stories.tsx` | Writer | `AnchorFillsMediaFrame` and a local 638:612 fallback (§6) | +40 |
| `packages/effects/README.md` | Writer | The sentence at `:58`: name the supported properties and say that DS046 honors them from `@egdev/cli` 0.4.1 | +4 / −1 |
| `packages/effects/src/home-template/useHomeTemplate.ts`, `HomeTemplateAnchor.tsx`, `HomeTemplate.tsx`, `index.ts`; `packages/effects/src/index.ts` | none | No change; `git diff --stat` must print nothing for them | 0 |
| `packages/cli/src/appearance-guard.mjs` | Writer | §3.2: `GUARDED_PACKAGES`, `allowanceKey`, `ClassOwner.packageName`, the import filter (`:524`), owner identity, the DS047 gate and the allowance lookup (`:716`) | +28 / −12 |
| `packages/cli/src/doctor.mjs` | Writer | `readClassNameAllows` package filter and key (`:90-91`) and the import of the two shared definitions | +7 / −3 |
| `packages/cli/src/guard.mjs` | Writer | The `GuardOptions` description of `classNameAllows` (`:43`) | +2 / −1 |
| `packages/cli/tests/ds046.test.mjs` | Writer | C1 to C3 with one shared effects fixture; the `wrong package` case (`:776`) and every existing case stay unmodified | +105 |
| `packages/cli/tests/package.test.mjs`, `packages/cli/tests/args.test.mjs` | Writer | V1: version and changelog-heading pins (`package.test.mjs:12,30`; `args.test.mjs:133`) | +3 / −3 |
| `packages/cli/README.md` | Writer | DS046 table row (`:382`), the paragraph at `:413` and the allowances paragraph (`:432-437`) | +10 / −4 |
| `docs/distribution/egdev-ds-cli.md` | Writer | Amendment list (`:6`), DS046 table row (`:503`) and bullet (`:512`) | +9 / −3 |
| `packages/cli/package.json` | Parent | `version` 0.4.0 → 0.4.1 | +1 / −1 |
| `packages/cli/CHANGELOG.md` | Parent | New top `## 0.4.1` (§7) | +9 |
| `packages/effects/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | One entry each under the existing `## 0.2.12` and `## 0.13.0` (§7) | +4; +3 |
| `skills/_shared/prop-naming.json` | Parent | Refresh three `source.revision` values (§5.1) | +3 / −3 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs` (`:150`, `:212`, `:213`); never hand-edited | ≈ ±6 |
| `scripts/design-system-artifact.test.mjs` | Parent | A1 (inventory map) and A2 (new test next to `:252`) | +26 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`; `system.md` is expected unchanged (`pnpm system:check`) | 1 minified line; 0 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | HomeTemplate row sentence (`:127`), then one `build_catalog.py` run (§5.4) | ±1 line each |
| `docs/components/home-template/v0.2/implementation-evidence.md` | Parent | Observed RED and GREEN output, the differential result and the browser table (§9) | +40 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: `packages/cli/src/init.mjs:73` and `agents-init.test.mjs` (the "DS components" wording is package-neutral, and marked blocks are never rewritten); `packages/cli/src/dom-guard.mjs` and `packages/cli/types/**`; `packages/tokens/**`, `packages/ui/**` and `packages/mcp/**`; `.storybook/**` (`preview.css:88` already scans the story file); `docs/distribution/consumer-requests.md`, `design-system-artifact.md` and `system-md.md` (package-neutral, checked); every manifest except the cli's; frozen v0.1 documents and `prop-naming-approval.json`; the spec and the approval record.

## 3. Design of the change

### 3.1 `@egdev/effects` — the tag

JSDoc, English, exactly the approved source contract of spec §3 (a tag on the exported props type; no type or code change):

```ts
/**
 * Measured 3D anchor. className sizes the box: width, height, their constraints and
 * aspect-ratio, beside the shared outer placement. Appearance overrides are unsupported;
 * the anchor invariants (relative, block) take precedence in cn().
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size height min-height max-height block-size min-block-size max-block-size aspect-ratio
 */
export type HomeTemplateAnchorProps = Omit<…> & { … };
```

One tag only; on `HomeTemplateAnchorProps` only (the root `HomeTemplateProps` keeps its placement-only prose and gets no tag). The generator reads one tag per `<Name>Props` for any package (`scripts/build-artifact.mjs:95-130`), validates the names against `csstype`, sorts and deduplicates them. `packages/effects/src/styles/compiled.css` scans `home-template/types.ts`, so the comment words must not emit a utility: §8 compares the built `dist/styles.css` before and after.

### 3.2 `@egdev/cli` — DS046 package scope

The observable contract is spec §3 ("CLI contract"). The code choices below are plan-level and can be vetoed at G1.

- **One shared definition**, in `appearance-guard.mjs` (the module that owns owner collection): `GUARDED_PACKAGES = ['@egdev/ui', '@egdev/effects']` and `allowanceKey(packageName, exportName)` returning `` `${packageName}:${exportName}` ``. `doctor.mjs` imports both, so the artifact reader and the guard cannot disagree about the package list or the key shape.
- **`collectClasses` (`:524`).** The import filter accepts any `GUARDED_PACKAGES` specifier (type-only imports are still skipped). Each named or namespace binding remembers its package (`Map<Symbol, { exportName, packageName }>` and `Map<Symbol, string>`), and `ClassOwner` gains `packageName` (`package` is reserved in modules, so it is not destructured). The owner identity checks in `add` and `matchedOwners` include it, so a class shared by same-named components of both packages is checked against both.
- **DS047 isolation.** The `classes` map (class → component, consumed by DS047 only) is filled only from `@egdev/ui` owners; effects owners go to `owners` (DS046) only. `appClasses` is unchanged: it already covers every `className`.
- **`findAppearanceViolations` (`:716`).** It looks up `classNameAllows.get(allowanceKey(owner.packageName, exportName))`. The `firstOnly` rule (`classNameAllows.size === 0`) is unchanged.
- **`readClassNameAllows` (`doctor.mjs:90`).** It keeps entries with `GUARDED_PACKAGES.includes(component.package)`, keyed by `allowanceKey`. The validation block above it is untouched, so a malformed entry for any package still returns an empty map and the base list.
- **`guard.mjs`.** Only the `GuardOptions` description of `classNameAllows` (key shape). `GuardOptions` is internal: the package exports types only (`types/index.d.ts`).
- **Rejected alternatives.** Keep the name-keyed map and drop the package filter: an `@egdev/effects` entry named like a ui export (the `ds046.test.mjs:776` fixture) would extend the ui component. One map per package: a second option on the guard signature for no gain. Extend DS047 too: outside the owner's answer.

### 3.3 Docs

`packages/cli/README.md` and `docs/distribution/egdev-ds-cli.md` say, in English and keeping legacy prose, that DS046 checks static classes on components imported from `@egdev/ui` and `@egdev/effects`, that an allowance applies only to imports from its own package, and that DS047 and DS048 are unchanged. The amendment list (`egdev-ds-cli.md:6`) cites this spec's OQ-1 and L5. The README sentence in `packages/effects/README.md` is in §6.

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts). Browser-only geometry sits in §9.

**New and changed tests.** CLI tests go through `doctor` with exact text and JSON output, exit status and an unchanged tree (`assertDoctor`); component tests use roles and DOM classes, no `data-testid`, no complete class strings.

| ID | Test | Covers |
| --- | --- | --- |
| V1 | `package.test.mjs` expects version `0.4.1` and the first five changelog headings `## 0.4.1, 0.4.0, 0.3.0, 0.2.0, 0.1.1`; `args.test.mjs` expects `--version` to print `0.4.1` | HT2-11 |
| C1 | `ds046.test.mjs` `S10 an @egdev/effects allowance extends DS046 for direct, aliased and namespace imports only`: an artifact with the tagged `HomeTemplateAnchor` (thirteen properties), an untagged `HomeTemplate` and a ui `Button`; `Example.tsx` imports them by name, by alias and by namespace; rules set only the published geometry plus placement (no finding), geometry plus `color` (one finding per rule naming `color`), `width` on the untagged `HomeTemplate` root (finding) and `width` on `Button` (finding, as today) | HT2-09 |
| C2 | `S10 allowances never cross packages, and a class shared by same-named components is checked against both`: an artifact with `SelectTile` for `@egdev/ui` (`width`) and for `@egdev/effects` (`grid-template-columns`); one file imports it from each package; each package's own class may set only its own property; a class used by both and setting `width` yields one finding. The unmodified `:776` case covers the opposite direction | HT2-09, HT2-10 |
| C3 | `S10 DS047 keeps its @egdev/ui scope on effects imports`: `.stage > span { color: red }` with an effects import yields the baseline output | HT2-10 |
| E1 | `HomeTemplate.test.tsx`: `size-full aspect-square max-h-full absolute hidden` on the anchor keeps the first three and `eg-home-template-anchor relative block`, and drops `absolute` and `hidden`; the existing merge case stays unmodified | HT2-02 |
| A1 | `design-system-artifact.test.mjs` inventory (`:265-340`): `expected.set('HomeTemplateAnchor', [...])` with the thirteen sorted names `aspect-ratio, block-size, height, inline-size, max-block-size, max-height, max-inline-size, max-width, min-block-size, min-height, min-inline-size, min-width, width` | HT2-01 |
| A2 | A new test next to `:252`: the entry's `classNameAllows` equals that list, its `props` names equal `['zone']`, `HomeTemplate` has no `classNameAllows`, and the tag text is absent from the entry's descriptions | HT2-01, HT2-06 |

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| HT2-01 | A1, A2 | `tagged` lacks `HomeTemplateAnchor`; `classNameAllows` is undefined | Tag in `types.ts`, `pnpm artifact --write`; `test:artifact` and `artifact --check` green; the scratch before and after diff shows only that field (§5.3) |
| HT2-02 | E1 | **Guard, no RED.** The behavior exists (`cn(className, anchorVariants())`) | Green on the first run; the merge case at `:70-117` unmodified |
| HT2-03 | Existing `HomeTemplate.isotipo.test.tsx:271,301` | **Guard** | Green, unmodified |
| HT2-04 | Scratch Chromium probe (§9), not committed | The unsized baseline is measured, not assumed | Pending browser authorization |
| HT2-05 | Existing `HomeTemplate.isotipo.test.tsx:271,527` | **Guard** | Green, unmodified |
| HT2-06 | `pnpm typecheck`; the docgen (`storybook-docgen.test.ts:6135`), Controls (`storybook-controls.test.ts:1216`), package-exports (`:8314`) and consumption (`:499-506`) suites; A2's `props` assertion | **Guard** | Green, unmodified |
| HT2-07 | `pnpm props:check` and `pnpm test:props` right after the `types.ts` edit | Stale revisions fail by design | `props:docs` and the JSON refresh, then both green |
| HT2-08 | Docs review, not a runner test | Not applicable | Reviewed against the final list; the thirteen names or their axes agree in the JSDoc, README, story JSDoc and both CLI docs |
| HT2-09 | C1, C2 | No DS046 finding for any effects class: the expected rows are missing, so the exact-output assertions differ | The same runner green |
| HT2-10 | Existing `ds046`, `ds047`, `ds048`, `guard` and `doctor` suites unmodified; C3; the differential run | **Guard.** C3 passes before and after, and `:776` stays green (it fails if the key drops the package) | Green; the differential is identical where the spec says |
| HT2-11 | V1 | The manifest is still 0.4.0, `--version` prints 0.4.0, no `## 0.4.1` heading | Manifest, changelog and pins land; V1 green |

**PRESERVE and differential.** The shared code is `collectClasses`, `matchedOwners`, `findAppearanceViolations` and `readClassNameAllows`, used by DS046 and, through `classes`, by DS047. Evidence that previous behavior holds: every existing ds046, ds047, ds048, guard and doctor case unmodified, C3, and one differential run (not committed) in a `mktemp -d` scratch directory. It extracts the base commit's CLI there (`git archive HEAD packages/cli`), and a scratch script loads `createGuard` from the base copy and from the working tree and runs `checkDesignSystem` over the same source and CSS table: ui-only, effects-only and mixed projects, each with no allowance map, with a ui map and with a ui plus effects map (each implementation gets the map shape it expects, built from the same artifact JSON). `violations`, `structuralViolations`, `domViolations`, `errors` and `pendingIssueCount` must be byte-identical in every row. `appearanceViolations` must be byte-identical for the ui-only rows and may differ, in the other rows, only by the effects findings the spec lists. Any other difference is a regression to fix and pin with a test.

**GREEN order.** CLI: V1 and C1 to C3 RED, then `appearance-guard.mjs`, `doctor.mjs`, `guard.mjs`, the focused CLI runner, the differential, the docs, the manifest and the changelog. Effects: A1 and A2 RED, then the `types.ts` tag, `props:check` (stale, RED), `pnpm artifact --write`, the registry refresh, E1, the story, the README sentence, the catalog row and the changelogs.

## 5. Registry, docgen, artifact, catalog and package obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Refresh the `source.revision` of the three HomeTemplate usages (`:78` `choreography-zone-table` → `HomeTemplateProps.zoneTable`, `:105` `anchor-zone-binding` → `HomeTemplateAnchorProps.zone`, `:132` `zone-change` → `HomeTemplateProps.onZoneChange`), all currently `sha256:ebd47eb475b4866b2ec45519badd62df64a59c2a5b751f6beefde4efd2b94983`, to the whole-file `sha256sum` of the final `types.ts`. Hash only after `types.ts` is final and `pnpm lint` is clean on it: any later edit, even formatting, requires re-hashing. No usage is appended, no status or approval changes, and no convention hash moves (a convention hash binds the convention, not its usages). `pnpm props:docs` regenerates `docs/prop-naming.md` (never by hand); then `pnpm props:check` and `pnpm test:props`. `prop-naming.test.mjs:4833` computes the digest from the working tree, so it needs no edit and fails until the refresh: that is the intended RED. `docs/components/home-template/v0.1/prop-naming-approval.json` is a frozen receipt and stays unchanged.

### 5.2 Docgen and Controls pins

No pin changes. The existing HomeTemplate docgen test (`storybook-docgen.test.ts:6135`, own props and `HomeTemplateAnchor.zone`) and Controls test (`storybook-controls.test.ts:1216`) run in the focused command unmodified: a type-level JSDoc tag adds no prop row (HT2-06), and the new story adds no own prop or control.

### 5.3 System artifact

`pnpm artifact --write`. Expect exactly one change: `components[HomeTemplateAnchor]` gains `classNameAllows` with the thirteen sorted names; no other entry, prop, variant or `propNaming` change, which a scratch before and after JSON comparison (in `mktemp -d`, from `git show HEAD:packages/system/design-system.json`) confirms. `packages/system/system.md` stays unchanged: `pnpm system:check`. The size stays far below the budget. Then `pnpm artifact --check`, `pnpm test:artifact` (A1 and A2) and `pnpm test:system` green.

### 5.4 Catalog

In `scripts/catalog_data.py:127`, insert before "Browser and packed-consumer verification remain pending.": "v0.2 ([#566](https://github.com/egdev6/egdev-design-system/issues/566)) publishes the `HomeTemplateAnchor` `className` geometry contract (`@classNameAllows`), and `egdev-ds` DS046 honors it from `@egdev/cli` 0.4.1." Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. This is a plan-level choice a reviewer can veto at G1 (§13); the Carousel row is the precedent.

### 5.5 Package fixtures and the CLI consumer

No edit expected. `scripts/package-exports.test.mjs:8314` (HomeTemplate layer classes and private boundaries) and `scripts/package-consumption.test.mjs:499-506` (typed samples and the no-ref negatives) must pass unchanged, which proves no type surface moved. The built effects CSS is compared before and after the JSDoc edit (§8). `pnpm test:cli:consumer` packs and runs the CLI at 0.4.1 and needs permission; nothing under `scripts/` pins 0.4.0 (searched).

## 6. Stories and Controls

`Templates/HomeTemplate` keeps autodocs, `satisfies Meta<typeof HomeTemplate>`, no manual `argTypes` and no `play`. The new story is English and typed `Story`.

- `AnchorFillsMediaFrame` (the VIS-01 scenario): `args.zoneTable` with two 3D zones and `args.children` with two sections. The first holds a token-sized frame (`aspect-square w-full max-w-[calc(var(--space-24)*4)]`, the host width of the Carousel stories, scanned by `.storybook/preview.css:88`) containing `<HomeTemplateAnchor className='aspect-square w-full'>` with the existing `Fallback`. The second is the contrast: the same frame with an unsized anchor whose fallback is a local 638:612 SVG (`viewBox='0 0 638 612'`, `aria-hidden`, `block w-full`). JSDoc: "The anchor's own `aspect-square w-full` makes its measured box equal the square scene frame; the unsized contrast takes its height from its fallback."
- README (`packages/effects/README.md:58`), in English: "Root `className` supports outer placement such as margins and self-alignment; Anchor additionally accepts box geometry: `width`, `height`, their minimum and maximum constraints, the logical sizes and `aspect-ratio`. `egdev-ds doctor` (DS046) honors this published contract from `@egdev/cli` 0.4.1. Appearance overrides are unsupported and invariant classes take precedence." The rest of the sentence at `:58` is kept.
- Controls: unchanged. No own prop is added and `Default` is unchanged.

## 7. Changelog entries

`packages/effects/CHANGELOG.md`, under the existing `## 0.2.12`, after its one bullet (that bullet stays true: nothing in the code changes):

```md
- `HomeTemplateAnchor` publishes its `className` geometry contract with `@classNameAllows`: width, height, their
  minimum and maximum constraints, the logical sizes and `aspect-ratio`, so a consumer can size the measured box to
  its media slot and `egdev-ds doctor` (`@egdev/cli` 0.4.1) honors it. Documentation and published metadata only:
  no runtime change. (#566)
```

`packages/system/CHANGELOG.md`, under `## 0.13.0` → `### Added`, after the last bullet:

```md
- The source-derived artifact lists `classNameAllows` for `HomeTemplateAnchor` (the thirteen published width, height
  and aspect-ratio properties); no prop, recipe or other entry changes. (#566)
```

`packages/cli/CHANGELOG.md`, a new top section above `## 0.4.0` (the cli has no 0.11.0 section; it moves because its code changes):

```md
## 0.4.1

- `doctor` DS046 also checks static classes on components imported from `@egdev/effects` and reads their
  `classNameAllows` from the project's vendored `@egdev/system` artifact. An allowance applies only to imports from
  its own package, so a class on `HomeTemplateAnchor` may set its published geometry (`width`, `height`, their
  constraints and `aspect-ratio`), while any other non-placement property on a class passed to an effects component
  is reported as it already is for `@egdev/ui`. DS047, DS048 and the checks for `@egdev/ui` are unchanged. (#566)
```

`(#566)` cites a fully resolved issue, as [versioning](../../../distribution/versioning.md) requires for consumer requests: `release.json` `resolves` then gains #566 for `@egdev/effects`, `@egdev/system` and `@egdev/cli` at pack time (T7). If the owner narrows the delivery, write `Refs #566` instead (D4). This PR makes no other version bump, `release:pack` or tag.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first three are the identical RED and GREEN runners.

```sh
node --test packages/cli/tests/ds046.test.mjs packages/cli/tests/ds047.test.mjs packages/cli/tests/ds048.test.mjs packages/cli/tests/guard.test.mjs packages/cli/tests/doctor.test.mjs packages/cli/tests/package.test.mjs packages/cli/tests/args.test.mjs
node --test scripts/design-system-artifact.test.mjs
pnpm exec vitest run packages/effects/src/home-template packages/effects/src/package-contract.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/effects/src/home-template/useHomeTemplate.ts packages/effects/src/home-template/HomeTemplateAnchor.tsx packages/effects/src/home-template/HomeTemplate.tsx packages/effects/src/home-template/index.ts packages/effects/src/index.ts packages/tokens packages/ui packages/mcp packages/cli/types packages/cli/src/init.mjs packages/cli/src/dom-guard.mjs
pnpm --filter @egdev/effects run build
sha256sum packages/effects/dist/styles.css
pnpm typecheck
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --write
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
pnpm test:cli
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
pnpm lint
pnpm test
pnpm build
sha256sum packages/effects/dist/styles.css
pnpm test:package-exports
pnpm test:package-consumption
pnpm test:cli:consumer
pnpm test:mcp
pnpm storybook-build
git status --short
```

The first `sha256sum` is taken before the `types.ts` edit (run the build and record it then), the second after the final edit: they must be equal, which proves the tag words emit no utility. The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` may regenerate artifacts: recheck `pnpm artifact --check` afterwards. `pnpm test:package-consumption` and `pnpm test:cli:consumer` create isolated fixtures and may install dependencies, so they need specific permission and a verified offline cache; record any unavailable matrix as pending. `pnpm test:mcp` serves the regenerated artifact; if it fails only on README example drift (the T4 item), report it, do not fix it here. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`, and a separate job runs `test:cli:consumer`; the artifact checks are not in CI and are run here because `@egdev/system` ships.

## 9. Browser and capture procedure

Only after separate permission to start `pnpm storybook` (it builds tokens first) and to use Playwright MCP, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion setting, crop and date for every observation. Story: `templates-hometemplate--anchor-fills-media-frame`.

1. **HT2-04 geometry.** At viewport widths 1280, 768 and 390 CSS px (device scale 1): in the filled section, the anchor's `getBoundingClientRect()` (the rect the director reads) equals the frame's in left, top, width and height within 1 CSS px, and the anchor computes `display: block` and `position: relative`. In the contrast section, record the anchor height over the frame height as measured; the consumer reports about 4% (612/638 ≈ 0.959) and that figure is evidence to confirm, not an assumption.
2. **VIS-01 captures**, only if authorized: component-zone PNGs of both sections under `docs/components/home-template/v0.2/` named `home-template--anchor-fill--1280x900--dark.png` and `home-template--anchor-unsized--1280x900--dark.png`, with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, not an approved expected design, until the owner adopts exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture exists, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English. The total is about 373 lines, below one 400-line slice, so the slices follow the packages (the cli versions independently) for review and bisect. The PR is squash-merged by T7.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `fix(cli): check @egdev/effects classes against their published classNameAllows in DS046 (#566)` | `appearance-guard.mjs`, `doctor.mjs`, `guard.mjs`, `ds046.test.mjs`, `package.test.mjs`, `args.test.mjs`, `package.json`, `CHANGELOG.md`, `README.md`, `egdev-ds-cli.md` | ≈ 201 |
| 2 | `feat(effects): publish the HomeTemplateAnchor className geometry contract (#566)` | `types.ts`, `HomeTemplate.test.tsx`, `HomeTemplate.stories.tsx`, `packages/effects/README.md`, `prop-naming.json` with the regenerated `docs/prop-naming.md`, `design-system.json`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, the effects and system changelogs | ≈ 126 |
| 3 | `docs(home-template): record the v0.2 implementation evidence (#566)` | `implementation-evidence.md`, the odd log, and `capture.json` with PNGs only if authorized | ≈ 46 |

Each commit leaves its own focused suites green: slice 2 keeps the tag, the registry refresh and the artifact together, so `props:check` and `artifact --check` are fresh per commit, and the cli slice does not depend on the artifact. If the owner confirms 0.5.0 instead (D2), the commit type of slice 1 becomes `feat(cli)`. A failing RED commit is never made.

## 11. Estimated changed lines

About **373 changed lines**: ≈ 361 hand-written (component and story ≈ 73; CLI source ≈ 53, CLI tests ≈ 111, CLI docs ≈ 26; artifact test ≈ 26; registry JSON, catalog source, three changelogs and the manifest ≈ 26; evidence and log ≈ 46) and ≈ 12 generated (`docs/prop-naming.md` ≈ 6, `design-system.json` 2, `CATALOGO.md` 2, `catalog.json` 2). For calibration, this is a smaller change than the Carousel v0.4 plan (≈ 585) because the effects side adds no prop and no code.

## 12. Risks

- **Risk 1 — Consumer behavior.** DS046 now flags non-placement properties on classes passed to untagged effects components (and anything outside the published geometry on `HomeTemplateAnchor`). This is the owner's scope (L5) and is disclosed in spec §3, the cli changelog and G5, but an app with CSS-file rules on effects classes will see new errors after the upgrade. DS046 reads CSS rules only, so Tailwind utilities on the anchor (the #566 use) are outside it.
- **Risk 2 — Version policy.** `versioning.md:93-95` classes a doctor-check change as minor; L5 fixed 0.4.1. D2 asks for confirmation; if it moves to 0.5.0 the manifest, changelog heading, V1 and the commit type change, nothing else.
- **Risk 3 — Shared code.** `collectClasses` feeds DS046 owners and the DS047 class map. The isolation is one condition (`@egdev/ui` owners fill `classes`); the differential and C3 exist to prove it. The allowance key is an internal option shape: nothing outside the package imports it (types-only entry), but any direct `checkDesignSystem` caller must use `allowanceKey`.
- **Risk 4 — Registry coupling.** Every `types.ts` edit invalidates three registry revisions. Hash last, rehash after any formatting change. The tag line is about 170 characters; Biome does not wrap comments, and `pnpm lint` proves it.
- **Risk 5 — Emission.** `compiled.css` scans `home-template/types.ts`, so comment words could emit a utility. The built `ui` CSS shows no such rule for the same property names, but `aspect-ratio` is new to this file; the before and after `sha256sum` of `dist/styles.css` (§8) is the proof, not that precedent.
- **Risk 6 — Parallel lanes.** The Footer, Hero, Link, SectionNav, Prose and the reading-piece lanes touch the same shared outputs: `prop-naming.json`, `docs/prop-naming.md`, `design-system.json`, the `classNameAllows` inventory pin (`design-system-artifact.test.mjs:265-340`, whose `tagged` list must equal whatever other lanes tag), `catalog_data.py` with its generated files, the system `## 0.13.0` section and the cli changelog. Expect rebase conflicts: regenerate generated files instead of hand-merging, and re-hash the three revisions after rebasing.
- **Risk 7 — Fixtures.** The doctor fixtures install no `@egdev/effects`, and the guard resolves no modules, so import specifiers alone drive collection. `doctor.mjs` has no source-import check, but the first RED run must confirm no other code fires; if one does, declare effects in the fixture instead of weakening an assertion.
- **Risk 8 — Premise.** The consumer's "about 4% shorter" is unmeasured here. If the probe contradicts the premise, or `aspect-square w-full` does not equal the frame, that is a spec amendment (G8), not a plan tweak. A fallback gap alone does not reopen OQ-3.
- **Risk 9 — Story utilities.** `max-w-[calc(var(--space-24)*4)]` exists only in the preview build; the production effects CSS scans `types.ts` alone. `pnpm typecheck` and `pnpm storybook-build` prove the story compiles.
- **Risk 10 — Package harnesses.** `test:package-consumption` and `test:cli:consumer` need an offline cache and permission to install; without them those rows stay pending, which blocks "verified in packed consumers" claims, not the rest.

## 13. Pending owner decisions

No token, dependency, Radix, Material or stylesheet decision is pending: the tag, its thirteen properties and the CLI scope were approved with the spec.

1. **D1 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files and the cli 0.4.1 manifest bump, or revise it. The spec approval does not cover it.
2. **D2 — Version policy.** `versioning.md:93-95` makes a doctor-check change a minor bump under 0.x; L5 chose 0.4.1. Confirm 0.4.1 (the plan's default), or choose 0.5.0.
3. **D3 — Consumer impact.** Confirm that apps may see new DS046 errors for CSS-file rules on effects classes after upgrading the CLI (spec §3). T7's notice to the website should say so.
4. **D4 — Issue citation.** The entries cite `(#566)`, which marks the issue fully resolved. If the owner reads the fallback gap (the reported 4%) as leaving #566 open, write `Refs #566` instead.
5. **D5 — Browser and capture authorization.** Starting `pnpm storybook` and using Playwright MCP are needed for HT2-04 and VIS-01. Without it those rows stay Pending or **Not evaluated**. Adopting any capture as expected design is a separate decision.
6. **D6 — Publishing the snapshot.** Publishing v0.2 as a comment on the canonical issue is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: the package-qualified allowance key (`<package>:<export>`); the DS047 isolation by a single owner-package condition; leaving the `:776` case unmodified as the cross-package guard; the catalog row sentence; the story host width.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, capture, version, release or Git action is taken or implied. Stop and return to the owner if: the generator rejects the tag or demands an edit outside §2; `useHomeTemplate.ts`, `HomeTemplateAnchor.tsx` or an `index.ts` would need to change; the built effects CSS changes; a DS047, DS048, DS040 or DS041 result changes in the differential, or an existing ds046 case needs editing beyond its label; a flag, exit code, JSON shape or doctor code would change; a token, dependency or stylesheet appears necessary; the Chromium measurement contradicts the spec's premise; or the owner's answer to D2 changes the version.
