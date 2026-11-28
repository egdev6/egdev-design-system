# Prose v0.2 — implementation plan

- **Status:** **Approved** on 2026-11-28 ([approval.md](approval.md)): the owner's answer "Aprobar todo (Recomendado)" covers the cataloging, the spec and this plan. It opens the edit surfaces of section 2 and prescribes the checks of section 8, still with the exclusions of G1: no version bump, release, GitHub write or website change, and no Git action by the writer. When the plan was drafted nothing was implemented or measured: preparation was read-only (file reads, digests, `git` inspection), and no build, test, Storybook, browser or `doctor` run happened. Observed results go to [implementation-evidence.md](implementation-evidence.md).
- **Coverage:** S1 of [`odd/tasks/prose-links-580.md`](../../../../odd/tasks/prose-links-580.md), request [#580](https://github.com/egdev6/egdev-design-system/issues/580): the plan gate that precedes implementation (T2). It covers `@egdev/cli` (the DS040 check) and, if the owner answers OQ-3 yes, a documentation-only edit of Prose in `@egdev/ui` with the generated files that follow from it in `@egdev/system`, the registry and the MCP README. Branch, PR, merge, release and the notice to the website belong to T3 and the parent; the writer never switches branches or commits. Format follows the [HomeTemplate v0.2 plan](../../home-template/v0.2/implementation-plan.md) (the CLI precedent); the Prose context is the [v0.1 plan](../v0.1/implementation-plan.md) and its [evidence](../v0.1/implementation-evidence.md).
- **Contract authority:** [spec.md](spec.md) v0.2, **Approved** on 2026-11-28, `contentSHA256: 1a96e5bfe6203215c9ed41bbf1ba9e26c6dab3b19b13a68bf78d2d1af8f57e36` (the draft payload `bdf4a5162145fcdc44df33471ce6872b64c7f0b35fc8a3a5324af7bf6f03f52b` this plan was first written against, with the OQ-1 to OQ-5 resolutions folded in and one citation correction), reproduced byte-exact in this working tree by two independent methods (`awk` and Python) with the spec's own rule: the payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline, not the inline mention in the header. The plan was written against the spec's recommended answers (OQ-1 G4, OQ-2 yes, OQ-3 yes, OQ-4 minor, OQ-5 `(#580)`), which the owner took unchanged, so no section of the plan changes (section 13 lists what would change for other answers). If the spec digest changes, the plan is re-checked. Approval record: [approval.md](approval.md). Companion: [cataloging.md](cataloging.md) (Approved). Visual hashes: none; this request adds no visual.
- **Approval note (2026-11-28):** the owner's answer, verbatim "Aprobar todo (Recomendado)" (`odd/tasks/prose-links-580.md` L2), given on the uncommitted drafts with the recommended answers to OQ-1 to OQ-5, approves the cataloging, the spec and this plan ([approval.md](approval.md)). The plan's payload is byte-unchanged, so its identity digest below stays valid. Passages that read as drafts are read as superseded by this approval: the section 2 heading ("not currently authorized"), G2's "none exists yet" and the closing statement of section 14 ("authorizes nothing until G1"). Section 13 is answered as far as that record goes: D1 is approved, D2 and D4 are as recommended (D4 is OQ-5), D3 is T3's notice, the runs of D5 need their own authorization, and D6 was answered separately (L2). The plan-level choices a reviewer could veto at G1 stand as written: the answer carries no veto. Nothing else changes: no surface, command, token, dependency, stylesheet or version.
- **Plan identity:** `contentSHA256: 5b53884cb2bd0cd4ba3bf12be132eb867e6412cd6f699ddbeda8b31a72a3f47d` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line (line start) through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `feat/prose-links-580`, HEAD `2559d52` (main); no tracked file is modified, and the untracked paths are `odd/tasks/prose-links-580.md` and `docs/components/prose/v0.2/`. Whole-file SHA-256 prefixes, to re-verify at the start of implementation: `packages/cli/src/guard.mjs` `3d45ff83` (457 lines), `appearance-guard.mjs` `f6ac5fef` (935), `doctor.mjs` `a57b5577` (933), `packages/cli/tests/guard.test.mjs` `c82219a6` (249), `doctor.test.mjs` `7346c3ea` (817), `ds046.test.mjs` `653ab584` (1079), `ds047.test.mjs` `ed869881` (524), `ds048.test.mjs` `feea09de` (593), `helpers.mjs` `024025be` (619), `package.test.mjs` `3f45f269` (38), `args.test.mjs` `8616ed4d` (217), `packages/cli/README.md` `71b64552` (505), `docs/distribution/egdev-ds-cli.md` `f985761a` (641), `consumer-requests.md` `72df6d93`, `versioning.md` `75895e42`, `packages/cli/CHANGELOG.md` `7fae950c` (93), `packages/ui/CHANGELOG.md` `3ad206ec` (349), `packages/system/CHANGELOG.md` `9407f483` (174), `packages/ui/src/primitives/prose/types.ts` `fea45507` (95; equal to the revision of the two Prose registry usages), `Prose.stories.tsx` `7d7f2ce0` (198), `Prose.test.tsx` `3a814b2d`, `skills/_shared/prop-naming.json` `74e68198`, `docs/prop-naming.md` `37c1a2d9`, `scripts/design-system-artifact.test.mjs` `6f645761` (2914), `scripts/catalog_data.py` `59f37d4f` (136), `packages/mcp/README.md` `2785ddf2`, `packages/system/system.md` `4ea37479` (3950). `packages/system/design-system.json` is 653,169 bytes against the 768 KiB (786,432-byte) budget of `design-system-artifact.test.mjs:2598-2615`. Versions at baseline: `@egdev/cli` 0.5.0, `@egdev/ui` 0.12.0, `@egdev/system` 0.14.0, `@egdev/effects` 0.2.13, `@egdev/tokens` 0.7.0, `@egdev/mcp` 0.4.13; none moves in this plan. Consumer read-only reference (egdev-website, branch `chore/ds-upgrade-2559d52`, HEAD `defdac7`): `src/components/detail-prose.tsx` `975c8902…`, `src/components/egdev-ui.ts` `bb8c1e6d…`.
- **Visuals:** none. This plan produces behavior, metadata and documentation evidence only; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload, after the spec's, grants the edit surface of section 2, including the integration surfaces the parent owns. The spec approval alone grants no code. Approving the plan approves no release, version bump, GitHub write or website change.
2. **G2 — Provenance.** The request text is the verbatim S1 recorded in the ODD task file, and the issue was not re-read. The consumer's shape was read read-only; nothing in the website was changed. The spec digest binds this version's bytes, not an owner answer, because none exists yet.
3. **G3 — Registry.** No new convention, usage or exception: no own prop is added or changed (spec §3). The only registry work, if OQ-3 is yes, is refreshing the two Prose usage revisions that the `children` description edit invalidates (5.1). No status, approval, receipt or convention hash changes.
4. **G4 — Code scope.** `@egdev/ui` changes the `children` JSDoc sentence in `types.ts` and story text only: `useProse.ts`, `Prose.tsx`, `index.ts`, `proseVariants`, every prop, default, marker and export stay byte-identical (`git diff --stat`, section 8). `@egdev/cli` changes only the collection of Prose-rendering files in `appearance-guard.mjs` and the DS040 condition in `guard.mjs`. No token, dependency, Radix package, stylesheet, config key, inline style, interpolated class or new AGENTS.md exception: **No stylesheet.**
5. **G5 — CLI boundary.** `doctor.mjs`, `init.mjs`, `dom-guard.mjs`, `args.mjs`, `packages/cli/types/**`, every flag, exit code, JSON and plan format, `init` and `upgrade` file effect, doctor code, DS041 to DS048 result and the DS040 message stay as they are. The two behavior changes are disclosed in spec §3: a raw `a` in a Prose file is accepted, and an allowlist entry that covered it becomes stale (DS042). The differential (section 4) enforces the boundary.
6. **G6 — Version.** No `package.json` changes. The changelog entries go under new top `## Unreleased` sections, which `release:pack` ignores and `docs/distribution/versioning.md:58,76-78` defines. T3 chooses the number (OQ-4) and moves the entries under the new heading, with the version pins in `package.test.mjs` and `args.test.mjs`, in the release PR.
7. **G7 — Integration ownership.** The registry JSON and generated view, the system artifact and `system.md`, the artifact test, the MCP README, the catalog source and outputs, the three changelogs, the evidence file and the ODD log are parent-owned integration surfaces. A writer touches only the files marked Writer in section 2.
8. **G8 — Stop lines** are listed in section 14.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/cli/src/appearance-guard.mjs` | Writer | 3.2: a second import pass beside the guarded-package one, the JSX visit adds the source to a new `proseSources` set, returned by `collectClasses` (early return at `:518-519` and the final return at `:652` included); typedef and module comment | +26 / −3 |
| `packages/cli/src/guard.mjs` | Writer | 3.2: `checkDesignSystem` passes the set (`:346`, `:372`); `findViolations` skips `a` in a Prose file (`:189-202`); typedef | +11 / −2 |
| `packages/cli/tests/ds040.test.mjs` | Writer | New: D1 to D6 (section 4), guard-level and doctor-level, with local helpers as `ds046`, `ds047` and `ds048` have | +200 |
| `packages/cli/tests/package.test.mjs` | Writer | V1: the heading pin (`:27-30`) skips an `## Unreleased` heading, as `changelogError` does; the versioned headings and every other assertion are unchanged | +3 / −1 |
| `packages/cli/README.md` | Writer | DS040 row (`:376`) and a short DS040 paragraph in "Guard allowlist" (`:406`), beside the DS046 text | +14 / −1 |
| `docs/distribution/egdev-ds-cli.md` | Writer | Amendment list (`:6`), DS040 row (`:497`), the "Guard parity" bullet (`:510`) and one new "Raw elements (DS040)" bullet after `:512` | +10 / −3 |
| `packages/ui/src/primitives/prose/types.ts` | Writer (OQ-3) | The `children` JSDoc sentence of spec §3 (`:25-29`); no type, tag or code change | +2 / −1 |
| `packages/ui/src/primitives/prose/Prose.stories.tsx` | Writer (OQ-3) | Usage-guideline text in the meta JSDoc (`:23-37`); no new story, export or argument | +4 |
| `packages/cli/src/doctor.mjs`, `init.mjs`, `dom-guard.mjs`, `args.mjs`; `packages/cli/types/**`; `packages/cli/package.json` | none | No change; `git diff --stat` must print nothing for them | 0 |
| `useProse.ts`, `Prose.tsx`, `index.ts`, `Prose.test.tsx`; `packages/ui/src/index.ts`; every `package.json` | none | No change | 0 |
| `packages/cli/CHANGELOG.md` | Parent | New top `## Unreleased` (section 7) | +11 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent (OQ-3) | New top `## Unreleased` in each (section 7) | +6; +5 |
| `skills/_shared/prop-naming.json` | Parent (OQ-3) | Refresh two `source.revision` values (`:1038`, `:1623`) | +2 / −2 |
| `docs/prop-naming.md` | Parent, generated (OQ-3) | `pnpm props:docs` (`:190`, `:213`); never hand-edited | ≈ ±4 |
| `scripts/design-system-artifact.test.mjs` | Parent (OQ-3) | A1: one assertion in the Prose test (`:294-395`) | +6 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated (OQ-3) | `pnpm artifact --write`, `pnpm system:docs` | 1 minified line; ≈ ±2 |
| `packages/mcp/README.md` | Parent, generated (OQ-3) | `pnpm mcp:readme` (one digest) | ≈ ±2 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent (veto-able) | One sentence in the Prose row (`:11`), then one `build_catalog.py` run (5.4) | ±1 line each |
| `docs/components/prose/v0.2/implementation-evidence.md` | Parent | Observed RED and GREEN output, the differential and the consumer notes (section 9) | +50 |
| `odd/tasks/prose-links-580.md` | Parent | Log the approvals and the delivery | +6 |

Explicitly untouched: `docs/distribution/consumer-requests.md` (it has no DS040 text, checked by search, and its stale-mitigation flow is generic), `design-system-artifact.md`, `system-md.md`; `packages/tokens/**`, `packages/effects/**` and `packages/mcp/src/**`; `.storybook/**`; the frozen v0.1 Prose documents, this spec and the cataloging.

## 3. Design of the change

### 3.1 `@egdev/ui` — documentation only (OQ-3)

`types.ts`, the `children` JSDoc, English, exactly the proposed contract of spec §3: "Converted and sanitized flow content as React nodes. Write links as bare `a` elements, which Prose styles at the body size; do not render `Link` inside it, because its label step is smaller." (if OQ-2 is no, the clause after the semicolon is dropped). `@control false` and the `@controlReason` text stay byte-identical, so the docgen (`storybook-docgen.test.ts:4184`) and Controls (`storybook-controls.test.ts:2402`) pins hold. In `Prose.stories.tsx`, one added paragraph under "Usage guidelines": "Write links as bare `a` elements: Prose styles them at the body size, while a `Link` keeps its own, smaller label step and does not belong inside it. `egdev-ds doctor` (DS040) accepts a raw `a` in a file that renders `Prose`." No version number appears in either text.

### 3.2 `@egdev/cli` — DS040 and Prose files

The observable contract is spec §3 ("CLI contract"). The code choices below are plan-level and can be vetoed at G1.

- **Where.** `createAppearanceGuard(...).collectClasses` is the one module that already builds the in-memory program with `noResolve` and resolves JSX tags by symbol (`appearance-guard.mjs:502-652`), so shadowing, aliases and namespaces are solved there once. It gains a fourth returned value, `proseSources: Set<SourceFile>`. No second program, no second walk and no disk access; `checkDesignSystem` stays pure.
- **Collection.** Beside the existing guarded-package loop (`:546-571`, which stays byte-identical) a second loop over `source.statements` visits every import declaration that has an import clause that is not type-only, for any specifier: a namespace import adds its symbol to `proseNamespaces`; a named specifier that is not type-only and whose real name `(propertyName ?? name).text` is `Prose` adds `checker.getSymbolAtLocation(binding.name)` to `proseBindings`. In the existing JSX visit (`:616-650`), where `identifier` and `symbol` are already computed (`:620-626`), a tag counts when it is an identifier whose symbol is in `proseBindings`, or a property access named `Prose` whose object symbol is in `proseNamespaces`; the source is then added to `proseSources`. The `classes`, `owners` and `appClasses` values are untouched.
- **Use.** `checkDesignSystem` destructures the fourth value (`guard.mjs:346`) and passes it to `findViolations` (`:372`). The DS040 `visit` (`:191-201`) keeps its condition and adds one conjunct: `!(node.tagName.text === 'a' && proseSources.has(source))`, after `!isSlotChild(node)`. The `source` it holds is the parsed object that `collectClasses` mapped (`sourceFiles.get(input)`), so identity works; the first RED run confirms it.
- **Unchanged.** `doctor.mjs` (the message), `GuardResult`, `GuardOptions`, the allowlist code, the types entry and the DS041 branch.
- **Rejected alternatives.** A syntactic scan or second program in `guard.mjs` (a second parse, and it loses shadowing). An ancestor walk to a `Prose` element (G1, G2): the website's anchor is outside the element. An exact-specifier test (G1, G3): the website's `Prose` comes from `@/components/egdev-ui`. A config key for barrels or Prose files (G5), and module or `tsconfig` resolution (G6): new surface, and they would change DS046 and DS047 for barrel consumers. Removing `a` from DS040 (G7). One allowlist entry per anchor (G8).

### 3.3 Docs

`packages/cli/README.md` and `docs/distribution/egdev-ds-cli.md` say, in English and keeping legacy prose: DS040 accepts a raw `a` in a file that renders `Prose` (named, aliased or namespace import of the export `Prose` from any module, not type-only, not shadowed); `button`, `input` and `label` are still reported; each file is judged alone, so an anchor in a separate converter file is not covered (co-locate it, use an issue-backed entry, or use `Link`); an allowlist entry that covered such an anchor becomes stale (DS042); DS041, DS046, DS047 and DS048 are unchanged. The amendment list (`egdev-ds-cli.md:6`) cites S1 of `odd/tasks/prose-links-580.md` and the [Prose v0.2 spec](spec.md). The "Guard parity" bullet (`:510`) is amended so that "DS046 extends the guard without changing DS040–DS045" no longer reads as a ban on this one DS040 relaxation.

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts).

**New and changed tests.** Guard tests call `checkDesignSystem` and assert `violations`, `errors` and the other result arrays exactly; doctor tests use exact text and JSON output, exit status and an unchanged tree (`treeHash`). No full class snapshots and no `data-testid`.

| ID | Test | Covers |
| --- | --- | --- |
| V1 | `package.test.mjs`: the heading filter skips `## Unreleased`; the five versioned headings, the version and the file list stay asserted. Made first; it passes before and after the changelog edit | PRS2-11 |
| D1 | `ds040.test.mjs` `S1 DS040 accepts a raw anchor in a file that renders Prose`: table rows for `import { Prose } from '@egdev/ui'`, an alias, `import * as DS` with `<DS.Prose>`, the specifier `@/components/egdev-ui` and a relative path; anchors as a deep JSX child, in a fragment, in a conditional, in a `.map` callback, with attributes, self-closing, and the website shape (the anchor built in a function outside the element, then `<Prose>{blocks}</Prose>`); zero violations and no errors | PRS2-01 |
| D2 | `S1 a file is not a Prose file`: type-only import and specifier, a parameter that shadows, a local declaration, a default import, `<prose>`, `export { Prose } from`, `export { Prose as Article }` used as `<Article>`, `Prose` imported and never rendered; the anchor stays reported with the exact `{ file, line, snippet }` | PRS2-02 |
| D3 | `S1 only a is exempt, and only in the file that renders Prose`: `button`, `input` and `label` beside an `a` in a Prose file are the three reported, in order; two-file fixtures (a converter file without Prose, a wrapper file rendering Prose over `children`, a page file with the anchors) report the anchors; the sole `asChild` child stays unreported in both kinds of file | PRS2-03 |
| D4 | `S1 an allowlist entry for an exempt anchor is stale`: `errors` holds exactly `src/x.tsx: stale allowlist entry <a href="/x">; remove it`; an entry for a still-reported anchor in the same run is consumed once | PRS2-05 |
| D5 | `S1 DS041, DS046, DS047 and DS048 are unchanged`: a Prose file with `<Prose className="post">` and `<a className="link">`, plus CSS `.post > a { color: red }`, `.post { max-width: 10px }` and `.link { color: red }`; the exact appearance, structural and DOM results of today (captured on the base first) | PRS2-06 |
| D6 | `S1 doctor: a website-shaped project`: `npmViteFixture`, a barrel `src/egdev-ui.ts` re-exporting `Prose` from `@egdev/ui`, and a file that imports it, builds the anchor in a converter function and renders `<Prose>{blocks}</Prose>`; text and `--json` equal the baseline, exit 0, tree unchanged; then the anchor moved to a file without Prose gives exactly one DS040 line in the existing message (the insertion index is confirmed in the first RED run) | PRS2-04 |
| A1 | `design-system-artifact.test.mjs` (OQ-3): the Prose `children` description matches the bare-`a` sentence and names `Link`; the `size` and `tone` assertions stay | PRS2-09 |

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| PRS2-01 | D1 | Each Prose-file row reports the anchor as a violation instead of none | Focused runner green after `appearance-guard.mjs` and `guard.mjs` |
| PRS2-02 | D2 | **Guard, no RED.** Today every case reports the anchor | Green on the first run |
| PRS2-03 | D3 | **Guard.** The `button`, `input`, `label`, cross-file and `asChild` rows hold today | Green on the first run and after the change |
| PRS2-04 | D6 | The first part fails: DS040 is reported for the anchor | Same runner green |
| PRS2-05 | D4 | The entry is consumed today, so no stale error appears | Same runner green |
| PRS2-06 | D5 and the differential | **Guard.** The structural and appearance outputs hold today | Green; the differential identical where the spec says |
| PRS2-07 | Existing `guard`, `doctor`, `ds046`, `ds047`, `ds048`, `args` suites unmodified | **Guard** | Green, unmodified; the differential |
| PRS2-08 | Existing `Prose.test.tsx`, docgen and Controls pins, `test:artifact`, package suites | **Guard** | Green, unmodified; `git diff --stat` |
| PRS2-09 | A1, then `pnpm props:check` after the `types.ts` edit | The description lacks the sentence; stale revisions fail by design | Edit, `props:docs` and the JSON refresh, `artifact --write`, `system:docs`; all green |
| PRS2-10 | Docs review, not a runner test | Not applicable | Reviewed against spec §3; README, CLI document and changelog agree |
| PRS2-11 | V1 | **Guard.** Passes before and after the changelog edit | Green; `git diff --stat` on every manifest prints nothing |
| PRS2-12 | A real `ds:doctor` run on the website | Not evaluated here | T3, with the vendored release and the website's own PR |

**PRESERVE and differential.** The shared code is `collectClasses` (DS046 and DS047) and `findViolations` (DS040 and DS041). Evidence that previous behavior holds: every existing guard, doctor, ds046, ds047, ds048 and args case unmodified, D5, and one differential run (not committed) in a `mktemp -d` scratch directory. It extracts the base commit's CLI there (`git archive HEAD packages/cli`), and a scratch script loads `createGuard` from the base copy and from the working tree and runs `checkDesignSystem` over the same table of sources and CSS: ui-only, effects-only, mixed, barrel-import and no-Prose projects, and Prose projects with raw anchors, each with no allowance map, a ui map and a ui plus effects map. `appearanceViolations`, `structuralViolations`, `domViolations` and `pendingIssueCount` must be byte-identical in every row. `violations` and `errors` must be byte-identical except for the two expected differences: the DS040 entries of exempt anchors disappear, and a stale error appears for an allowlist entry that covered one. A second scratch pass runs `egdev-ds doctor` (text and `--json`) from both copies on the fixtures of the existing suites and compares stdout, stderr and exit code; any other difference is a regression to fix and pin with a test.

**GREEN order.** CLI: V1, then D1, D4 and D6 RED, then `appearance-guard.mjs` and `guard.mjs`, the focused CLI runner, the differential, the docs and the changelog. If OQ-3 is yes: A1 RED, then the `types.ts` sentence, `props:check` (stale, RED), `pnpm props:docs` and the JSON refresh, `pnpm artifact --write`, `pnpm system:docs`, `pnpm mcp:readme`, the story text, the catalog row and the changelogs.

## 5. Registry, docgen, artifact, catalog and package obligations (OQ-3)

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Refresh the `source.revision` of the two Prose usages (`:1038` `preset-dimensions` → `ProseProps.size`, `:1623` `surface-material-tone` → `ProseProps.tone`), both currently `sha256:fea45507867ff2fc1088010361e918dee996d6a0d525e2f8a22207d0571dedae`, to the whole-file `sha256sum` of the final `types.ts`. Hash only after `types.ts` is final and `pnpm lint` is clean on it: any later edit, even formatting, requires re-hashing. No usage is appended, and no status, approval or convention hash changes. `pnpm props:docs` regenerates `docs/prop-naming.md` (`:190`, `:213`); then `pnpm props:check` and `pnpm test:props`. The existing registry tests compute the digest from the working tree, so they need no edit and fail until the refresh: the intended RED.

### 5.2 Docgen and Controls pins

No pin changes. `storybook-docgen.test.ts:4184` (own props, `children` tags `control: 'false'` and its reason, the exported story names) and `storybook-controls.test.ts:2402` run in the focused command unmodified: a description-only edit adds no prop row and changes no tag.

### 5.3 System artifact, `system.md` and the MCP README

`pnpm artifact --write`. Expect exactly one change: `components[Prose].props[children].description`; no other entry, prop, variant or `propNaming` change, which a scratch before and after JSON comparison (in `mktemp -d`, from `git show HEAD:packages/system/design-system.json`) confirms. `pnpm system:docs` regenerates `packages/system/system.md` (it renders the description; today it contains the old sentence), then `pnpm system:check`. The size grows by about one sentence, far below the 786,432-byte budget. Then `pnpm artifact --check`, `pnpm test:artifact` (A1) and `pnpm test:system` green. `pnpm test:mcp` fails until `pnpm mcp:readme` rewrites the README digest of the `get_design_system_md` response, as in the v0.1 evidence (TK-3); regenerate the artifact and `system.md` first.

### 5.4 Catalog

In `scripts/catalog_data.py:11`, append to the Prose row: "v0.2 ([#580](https://github.com/egdev6/egdev-design-system/issues/580)) documents that links are written as bare `a` elements, and `egdev-ds` DS040 accepts them in a file that renders `Prose`." Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. This is a plan-level choice a reviewer can veto at G1 (section 13); the HomeTemplate v0.2 row is the precedent. The artifact's `catalog` entries carry no description, so they do not change.

### 5.5 Package harnesses

No edit expected. `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` (Prose exports, typed samples, no-ref negatives) must pass unchanged, which proves no type surface moved. No script under `scripts/` pins the cli version (searched). `pnpm test:cli:consumer` packs and runs the CLI and needs permission.

## 6. Stories

`Primitives/Prose` keeps autodocs, `Meta<typeof Prose>`, no manual `argTypes` and no `play`, and the same five exports (`Default`, `Elements`, `Sizes`, `RaisedTone`, `Overflow`, pinned at `storybook-docgen.test.ts:4241`). Only the meta JSDoc text changes (3.1), in English. No story is added: the `Elements` story already shows links, and the convention is a documentation rule, not a new scenario.

## 7. Changelog entries

All three go under a **new** top `## Unreleased` section (none exists today), above the current top heading. `(#580)` marks the issue fully resolved, as [versioning](../../../distribution/versioning.md) requires for consumer requests, and `release.json` `resolves` reads it only after T3 moves the entries under a versioned heading. If the owner narrows the delivery (OQ-1, OQ-5), write `Refs #580` instead.

`packages/cli/CHANGELOG.md`:

```md
## Unreleased

- `doctor` DS040 no longer reports a raw `<a>` in a file that renders `Prose`: Prose styles the bare anchors of long-form
  content at the reading size, so DS `Link`, with its smaller label step, is the wrong element there. A file counts when
  one of its JSX elements is an import of the export `Prose`, named, aliased or as a namespace member, from any module,
  so an app's own barrel works; an anchor anywhere in that file is accepted. `button`, `input` and `label` are still
  reported there, files that do not render `Prose` are unchanged, and no other check, flag or exit code changes. An
  allowlist entry that covered such an anchor becomes stale (DS042): remove it. (#580)
```

`packages/ui/CHANGELOG.md` (OQ-3):

```md
## Unreleased

### Changed

- `Prose` documents how to write links: as bare `a` elements, which it styles at the body size, and never as `Link`,
  whose label step is smaller. Documentation only: no prop, default, recipe or export changes. (#580)
```

`packages/system/CHANGELOG.md` (OQ-3):

```md
## Unreleased

### Changed

- The source-derived artifact and reference carry the amended `children` description of `Prose`; no prop, recipe or
  other entry changes. (#580)
```

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first one is the identical RED and GREEN runner.

```sh
node --test packages/cli/tests/ds040.test.mjs packages/cli/tests/guard.test.mjs packages/cli/tests/doctor.test.mjs packages/cli/tests/ds046.test.mjs packages/cli/tests/ds047.test.mjs packages/cli/tests/ds048.test.mjs packages/cli/tests/package.test.mjs packages/cli/tests/args.test.mjs
git diff --stat -- packages/cli/src/doctor.mjs packages/cli/src/init.mjs packages/cli/src/dom-guard.mjs packages/cli/src/args.mjs packages/cli/types packages/cli/package.json packages/ui/package.json packages/system/package.json packages/ui/src/primitives/prose/useProse.ts packages/ui/src/primitives/prose/Prose.tsx packages/ui/src/primitives/prose/index.ts packages/ui/src/primitives/prose/Prose.test.tsx packages/ui/src/index.ts packages/tokens packages/effects docs/distribution/consumer-requests.md
pnpm exec vitest run packages/ui/src/primitives/prose packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm typecheck
pnpm lint
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --write
pnpm artifact --check
pnpm system:docs
pnpm system:check
pnpm test:artifact
pnpm test:system
pnpm mcp:readme
pnpm test:mcp
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
pnpm test:cli
pnpm test
pnpm build
pnpm artifact --check
pnpm test:package-exports
pnpm test:package-consumption
pnpm test:package-release
pnpm test:cli:consumer
pnpm storybook-build
git status --short
```

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only section 2 paths and the three v0.2 documents: no scratch, cache or `.playwright-mcp/` output. If OQ-3 is no, the registry, artifact, system, MCP, catalog and storybook commands drop out, and `pnpm lint`, `pnpm typecheck` and the CLI commands remain. `pnpm build` may regenerate artifacts: recheck `pnpm artifact --check` afterwards. `pnpm test:package-consumption` and `pnpm test:cli:consumer` create isolated fixtures and may install dependencies, so they need specific permission and a verified offline cache; record any unavailable matrix as pending. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`, and a separate job runs `test:cli:consumer`; the artifact checks are not in CI and are run here because `@egdev/system` ships.

## 9. Consumer and evidence procedure

No browser, capture or Storybook run is needed: nothing here changes appearance.

1. **In this repository.** D6 builds the website's shape with the suite's own fixtures; D1 to D5 pin the contract. The evidence file records the RED and GREEN output, the differential result and the digests of every touched source.
2. **Optional read-only run on the real project** (needs permission, because `doctor` executes the project's allowlist file): the working-tree CLI (`node packages/cli/bin/egdev-ds.mjs doctor <path-to-egdev-website>`) against the website checkout at `defdac7`, base copy and working tree, comparing stdout and exit code. Expected: byte-identical, because the website has no raw anchor today. It proves nothing else regressed on a real project; it does not prove the exemption on the website's shape, which D6 does.
3. **T3, outside this plan.** After the release, the website upgrades with `egdev-ds upgrade`, replaces the `Link` plus `Text` workaround in `renderLink` with a bare anchor, sets `target`, `rel` and an external-link notice itself, retires `TODO(egdev-design-system#580)` at `detail-prose.tsx:116` and runs `pnpm ds:doctor` (PRS2-12). That is the website's change and its own PR.

**Visual conformity: Not evaluated.** No evidence here is a screen-reader, browser or contrast claim.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English, citing `(#580)` and `Refs #580` in the body, never `Closes`. The parent commits the three v0.2 documents first. The total is about 384 changed lines, below one 400-line slice, so the slices follow the packages for review and bisect. The PR is squash-merged by T3.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(cli): accept raw anchors in files that render Prose in DS040 (#580)` | `appearance-guard.mjs`, `guard.mjs`, `ds040.test.mjs`, `package.test.mjs`, `packages/cli/README.md`, `egdev-ds-cli.md`, `packages/cli/CHANGELOG.md` | ≈ 284 |
| 2 | `docs(prose): say that links are bare anchors, not Link (#580)` | `types.ts`, `Prose.stories.tsx`, `prop-naming.json` with the regenerated `docs/prop-naming.md`, `design-system.json`, `system.md`, `packages/mcp/README.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, the ui and system changelogs | ≈ 44 |
| 3 | `docs(prose): record the v0.2 implementation evidence (#580)` | `implementation-evidence.md` and the ODD log | ≈ 56 |

Each commit leaves its own focused suites green: slice 2 keeps the sentence, the registry refresh and the artifact together, so `props:check` and `artifact --check` are fresh per commit, and slice 1 does not depend on it. If the owner answers OQ-4 as a patch, the type of slice 1 becomes `fix(cli)`. A failing RED commit is never made.

## 11. Estimated changed lines

About **384 changed lines**: ≈ 370 hand-written (CLI source ≈ 42, CLI tests ≈ 204, CLI docs ≈ 28 and CLI changelog ≈ 11; Prose docs ≈ 7; ui and system changelogs ≈ 11; registry, artifact test and catalog source ≈ 12; evidence and log ≈ 56) and ≈ 14 generated (`docs/prop-naming.md` ≈ 4, `design-system.json` 2, `system.md` ≈ 2, MCP README ≈ 2, `CATALOGO.md` 2, `catalog.json` 2). For calibration, this is close to the HomeTemplate v0.2 plan (≈ 373), which also changed one guard in `@egdev/cli`. If OQ-3 is no, about 60 of these lines drop out.

## 12. Risks

- **Risk 1 — The consumer premise.** The recommended rule unblocks `detail-prose.tsx` only while its converter and its `<Prose>` stay in one file, which they are at `defdac7`. A later split into a converter module re-blocks it, and no rule in this plan covers that. OQ-1 asks the owner to confirm the shape before approval; the follow-ups are listed in section 13.
- **Risk 2 — Over-exemption.** DS040 approximates "inside Prose" by "in a file that renders Prose". An unrelated raw `a` in that file passes, and an app's own imported component with the exact export name `Prose` opts its file in. Accepted at OQ-1 and stated in spec §4; the narrow alternative is G1.
- **Risk 3 — Shared code.** `collectClasses` feeds DS046 owners and the DS047 class map. The change adds a second import loop and one returned set, and leaves the guarded-package loop untouched; the differential and D5 exist to prove that `classes`, `owners` and `appClasses` are unchanged.
- **Risk 4 — Stale allowlist entries.** A consumer with a #580 entry sees DS042 after upgrading the CLI (spec §3, item 7) and DS052 names it as a resolved mitigation once the release cites `(#580)`. The website has none at `defdac7` (`src/design-system-allowlist.ts` lists three unrelated component-gap entries). Documented in the CLI docs and the changelog.
- **Risk 5 — Changelog pin.** Adding `## Unreleased` breaks `package.test.mjs:30` until V1 lands, so V1 goes first. At release time T3 moves the entries under the new heading and updates `manifest.version`, the heading pin and `args.test.mjs:133` together.
- **Risk 6 — Registry coupling (OQ-3).** Every `types.ts` edit invalidates two registry revisions. Hash last and re-hash after any formatting change; `pnpm lint` proves the sentence wraps cleanly.
- **Risk 7 — Generated outputs (OQ-3).** `system.md` is about 530 KB and the MCP README digest changes with it; `pnpm test:mcp` fails until `pnpm mcp:readme` runs, after `pnpm artifact --write` and `pnpm system:docs`.
- **Risk 8 — External links.** A consumer that swaps `Link` for a bare `a` loses `target`, a safe `rel` and the hidden new-tab notice (spec §5). Nothing enforces replacing them; T3's notice to the website must say so.
- **Risk 9 — Symbol resolution under `noResolve`.** Aliases and namespaces rely on the alias symbol of the import binding, as DS046 does (`ds046.test.mjs:126` pins shadowing). The first RED run must show the named, aliased and namespace rows failing for the intended reason; a row that fails otherwise stops the work.
- **Risk 10 — Fixtures.** The doctor fixtures install no real `@egdev/ui`, and the guard resolves no modules, so import specifiers alone drive the result. `doctor.mjs` has no source-import check, but the first RED run must confirm that no other code fires; if one does, declare the package in the fixture instead of weakening an assertion.
- **Risk 11 — Package harnesses.** `test:package-consumption` and `test:cli:consumer` need an offline cache and permission to install; without them those rows stay pending, which blocks "verified in packed consumers" claims, not the rest.
- **Risk 12 — A side finding, not fixed here.** Components imported through an app barrel are invisible to DS046 and DS047, because they match the exact specifiers `@egdev/ui` and `@egdev/effects` (`appearance-guard.mjs:550`); egdev-website imports through its barrel in 22 files. Whether that coverage gap matters, and whether to declare barrels in `egdev-ds.json`, is a separate Consumer request, because turning it on would start reporting in those files.

## 13. Pending owner decisions

No token, dependency, Radix, Material or stylesheet decision is pending.

1. **D1 — Plan approval (G1).** Approve this exact plan and the section 2 edit surfaces, including the parent-owned integration files, or revise it. It follows the spec's approval, which does not cover it.
2. **D2 — The spec's open questions.** OQ-1 to OQ-5 as recommended, or others. What changes if the owner answers otherwise: OQ-1 = G1 (JSX children, exact `@egdev/ui`): the file set becomes an element set with an ancestor walk (about +20 lines), D6 flips to show the website still blocked, and T3's notice must say the website needs a restructure or an allowlist entry; OQ-2 = no: the clause about `Link` leaves the sentences in 3.1 and 7; OQ-3 = no: slice 2, the registry, artifact, `system.md`, MCP, catalog and the ui and system changelogs drop out; OQ-4 = patch: only the T3 version and the commit type change; OQ-5 = `Refs`: the three changelog entries cite `Refs #580`.
3. **D3 — Consumer impact notice (T3).** The notice to egdev-website says: keep the converter and the `<Prose>` in one file; set `target`, `rel` and the new-tab notice yourself; remove any #580 allowlist entry after upgrading; the `Link` plus `Text` workaround and the TODO at `detail-prose.tsx:116` can then go.
4. **D4 — Issue citation.** The entries cite `(#580)`, which marks the issue fully resolved. If the owner reads the cross-file limit as leaving #580 open, write `Refs #580` instead (OQ-5).
5. **D5 — Authorization for runs that execute project code or install.** The read-only `doctor` run on the website checkout (it loads the website's allowlist file), `pnpm test:cli:consumer` and `pnpm test:package-consumption`. Without them those rows stay Pending.
6. **D6 — A follow-up request for barrel visibility** (Risk 12), to file separately or leave unrecorded.

Plan-level choices a reviewer can veto at G1: collecting the files inside `collectClasses` instead of a separate pass; the `proseSources` name and the single added conjunct in DS040; the catalog sentence; V1 as a filter edit instead of a new pin; the sentence wording in 3.1.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, version, release or Git action is taken or implied. Stop and return to the owner if: the `classes`, `owners` or `appClasses` output of `collectClasses` would change; the differential shows any difference beyond the exempt anchors and the stale entries; an existing guard, doctor, ds046, ds047, ds048 or args case needs editing beyond V1; a flag, exit code, JSON shape, doctor code, config key or `doctor.mjs` message would change; `useProse.ts`, `Prose.tsx`, `index.ts` or `proseVariants` would need to change; a token, dependency or stylesheet appears necessary; the generator or the registry demands an edit outside section 2; the owner's answers to OQ-1 to OQ-5 change the scope; or a check of the website's shape contradicts the premise of OQ-1.
