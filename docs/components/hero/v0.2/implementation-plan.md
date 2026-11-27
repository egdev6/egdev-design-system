# Scene `titleVariant` (Hero, Closing, ChapterBreak and LabStage) v0.2 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, tests, registry or receipt write, generated-file, catalog, token, dependency, capture, release or Git action, and approving the spec granted none of them. Nothing below is implemented or measured by this plan: preparation was read-only (source, test, registry, artifact and changelog reads, digest checks and `git` inspection), and no build, test, generator, Storybook, browser or capture ran. The only measurement is the owner-reported TV-09 figures recorded in the spec.
- **Coverage:** S2, S3 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), request [#560](https://github.com/egdev6/egdev-design-system/issues/560) for **all four scenes**: Hero ([#318](https://github.com/egdev6/egdev-design-system/issues/318)), Closing ([#319](https://github.com/egdev6/egdev-design-system/issues/319)), ChapterBreak ([#324](https://github.com/egdev6/egdev-design-system/issues/324)) and LabStage ([#325](https://github.com/egdev6/egdev-design-system/issues/325)); the issue numbers are the spec's, taken from `docs/CATALOGO.md` and not re-read on GitHub. This is the plan gate that precedes implementation under T6. L6 puts #560 last in the implementation order (item 13) and says its plan needs its own approval: the L6 approval of ten other plans does not cover it. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) plan (an additive variant on an existing component); the Round 5 conventions (registry receipt, the `## 0.11.0` and `## 0.13.0` changelog sections, parent-owned integration surfaces) follow the [Link v0.5](../../link/v0.5/implementation-plan.md) and [Embed v0.1](../../embed/v0.1/implementation-plan.md) plans. Commits land on `integration/round-5` and are made by the parent (the writer never switches branches or commits); Round 5 ships as one PR (T7), so the slices exist for review and bisect. The PR references #560 with `Refs`, never `Closes` ([consumer requests §3](../../../distribution/consumer-requests.md)).
- **Contract authority:** [spec.md](spec.md) v0.2, Approved on 2026-11-27, `contentSHA256: 170160c2115a7b7b29b5743a046b7a08187c3f1fc821577e2ae9f192ac0a2474`, reproduced byte-exact in this working tree by two independent methods with the spec's own rule (payload from the line-start `## 1. Purpose and scope` heading through EOF, LF, final newline: `awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum` and a Python line-anchored slice; the heading text also appears inline in the spec's metadata, so a plain substring search anchors wrongly). The three amendment notes are pinned the same way: [Closing](../../closing/v0.2/amendment.md) `8b1759da4fe3a452ed2763b61421c5a8490d2709bd3da9d99343c9e7808d5006`, [ChapterBreak](../../chapter-break/v0.2/amendment.md) `11e0e896a2a0ed51afc9aee015584e140f48701adbe4e01b6ad68262d3c3e40f` and [LabStage](../../lab-stage/v0.2/amendment.md) `3647d4d7976a9cec2417b00bc886fef9539a024db36e2177debdf26efc616848`. Approval record: [approval.md](approval.md): owner answers, verbatim, "Aprobar todas (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L5) and "A: titleVariant y la web acorta el texto (Recomendado)" (L6), 2026-11-27, given on the committed drafts (`7ed25eb`, shared draft payload `489f499c841f14a2c7ec7c53bb626bd7fd4cddcb91be56119346ef239dc91f90`) with the recommended answer to OQ-1 to OQ-5. The cataloging approval is L3. Visual hashes: VIS-01 to VIS-05 Pending. Recover and compare the digests again before any edit; a different digest stops the work.
- **Resolved decisions this plan carries:** the measurement ran first (OQ-1); `titleVariant` ships as specified and the website shortens its copy at the wider viewports, with no wider track, no further union value and no token (OQ-2, L6); the accent stops glowing at `show` (OQ-3); the convention `heading-title-variant` is approved, with its receipt separate (OQ-4); the website supplies the other scenes' real titles for TV-10 and that does not block code (OQ-5).
- **Sequencing:** #560 is the last Pulso item of T6, so the other lanes' code is on the branch by then. It depends on none of them for authority or code, but it shares their integration files (registry JSON and generated view, test pins, artifact, catalog, changelogs), so every digest, count and line anchor below must be re-taken on the merged tree. Tokens 0.7.0 and cli 0.5.0 (L6) belong to other lanes: this change touches neither package, so no coupled version moves for it.
- **Plan identity:** `contentSHA256: 791a3fdfa8dfff2a84ff597215e11164f15c3468ac443e17f238ffa88b7de0de` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line (anchored at line start) through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `041cfbb`. Digests and line anchors are of the committed HEAD content (`git show HEAD:<path>`). The scene folders and `packages/ui/src/primitives/text/` have no uncommitted change, and no commit since `7afaabd` touched them; the spec, the three notes, the approval record and this plan are uncommitted working-tree files. At drafting, other lanes also had uncommitted edits to `skills/_shared/prop-naming.json`, `docs/prop-naming.md`, `packages/system/design-system.json`, `scripts/prop-naming.test.mjs`, `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`, `scripts/design-system-artifact.test.mjs`, `packages/ui/src/lib/storybook-css.test.ts` and the DetailHeader and Prose folders (the L8 amendments); this plan does not depend on them, and the baseline must be re-taken once they are committed. Whole-file SHA-256 prefixes. Scenes: `types.ts` `09c805d2…` Hero, `b413fbef…` Closing, `ddcb7063…` ChapterBreak and `371b71ee…` LabStage (each equal to the spec's reviewed hash and to the `revision` of every registered usage of that file); hooks `useHero.ts` `0602434b…`, `useClosing.ts` `ff4ec646…`, `useChapterBreak.ts` `ca7fd203…`, `useLabStage.ts` `bb860ab1…`; JSX `Hero.tsx` `ed487043…`, `Closing.tsx` `3959d960…`, `ChapterBreak.tsx` `e5bbadda…`, `LabStage.tsx` `a9a3276d…`; tests `Hero.test.tsx` `40b0c403…` (326 lines), `Closing.test.tsx` `8ad49bf1…` (368), `ChapterBreak.test.tsx` `44662a71…` (202), `LabStage.test.tsx` `1731a42b…` (228); stories `Hero.stories.tsx` `df9b36e0…` (99), `Closing.stories.tsx` `41af4259…` (75), `ChapterBreak.stories.tsx` `92bb62a7…` (58), `LabStage.stories.tsx` `f1ac1138…` (93); the four `index.ts` files are not edited. Heading: `Heading.tsx` `e68349d0…`, `Heading.test.tsx` `eb8bc9e7…`, `text/types.ts` `41a2d11b…`, `useHeading.ts` `050efdaa…`. Integration: `packages/ui/src/index.ts` `20059f04…`, `styles/compiled.css` `82784cfe…`, `.storybook/preview.css` `eb001f5d…`, `skills/_shared/prop-naming.json` `0e3168de…` (191 entries, none named or aliased `titleVariant`, re-checked on 2026-11-27), `scripts/prop-naming.test.mjs` `02a73832…`, `storybook-docgen.test.ts` `72a0b095…`, `storybook-controls.test.ts` `3e746e89…`, `storybook-css.test.ts` `0acddc94…`, `scripts/package-exports.test.mjs` `00dba672…`, `package-consumption.test.mjs` `4d266d05…`, `design-system-artifact.test.mjs` `ba94a318…`, `scripts/catalog_data.py` `d16eea26…`, `packages/ui/CHANGELOG.md` `1b3058cb…`, `packages/system/CHANGELOG.md` `c690cf11…`, `packages/tokens/src/theme.css` `2ba17e32…`, `styles/legacy/bundle.css` `0ddabe8b…`. At HEAD `packages/system/design-system.json` is 642,794 bytes and `system.md` 523,302 bytes against the 768 KiB (786,432-byte) shipped-JSON budget asserted in `design-system-artifact.test.mjs`. Everything below is planned, not observed.
- **Visuals:** VIS-01 to VIS-05 are Pending in the spec: no capture, no hash. This plan produces behavior, emitted-CSS and registry evidence, and computed-style evidence only with D3; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surfaces of §2, including the integration surfaces the parent owns, and the commands of §8. The spec approval and the L6 approval of ten other plans grant no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance and its two limits.** The repository records the owner's verbatim answers (L5, L6) and the draft's digest prefix (L4) but not the question text, so the spec digest binds the bytes derived from the committed draft plus the recommended answers and the recorded measurement, not a digest the owner quoted ([approval.md](approval.md)). The TV-09 figures are recorded as reported and the harness conditions were not supplied, so the plan treats them as the owner's decision input, not as verified browser evidence; D3 repeats the measurement on the shipped prop. A reviewer who wants an exact-digest confirmation can ask for it before G1. Nothing here upgrades either limit.
3. **G3 — Registry: one new convention, no exception.** `heading-title-variant` / `titleVariant` was approved with the spec (OQ-4) on the wording of spec block 3, which §5.1 writes as registry sentences. It enters with four usages and becomes `approved` only through the receipt of D2 (recommended: yes); without D2 it ships `proposed` with `approval: null`, as other entries do, and both paths are green. The plan also refreshes the `source.revision` of **25 existing usages** (Hero 7, Closing 6, ChapterBreak 6, LabStage 6) because each scene's `types.ts` changes; those edits approve nothing globally. No other entry, status, alias or exception changes.
4. **G4 — No new paint: no token, dependency, Radix package, stylesheet or Material recipe.** The change selects between two Heading recipes that already ship (`text-title-hero`, `text-title-show`) and two accent utilities Heading already emits (`[text-shadow:var(--text-shadow-title-hero)]`, `[text-shadow:none]`). No scene CVA axis, class string or inline style is added, and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. If an emitted utility is missing or a computed style disagrees, stop (§14).
5. **G5 — Heading is read, never edited.** The scenes pass `variant` to Heading as they do today. `useHeading.ts:63` already gates the glow to `hero` on the canvas tone, and `Heading.test.tsx` already pins the glow by tone and the `show` recipe class. Both stay unmodified and green as the PRESERVE baseline; a diff under `packages/ui/src/primitives/text/` is a stop line.
6. **G6 — Promises are proven by markup, not by appearance.** Normalisation, no DOM leak, identity and byte-identical default output are proven in jsdom and in the built package. Fit, glow rendering and font metrics are not: they rest on the owner-reported TV-09 figures and, if D3 is granted, on a browser run. jsdom proves none of them.
7. **G7 — Integration ownership.** The registry JSON, its generated view and the receipt, the system artifact and `system.md`, the catalog source and outputs, the docgen and Controls pins, the package harnesses, the changelogs and the evidence file are parent-owned, as in the Carousel, Link and Embed plans. A writer touches only the five changing files of each scene folder (`types.ts`, `use<Scene>.ts`, `<Scene>.tsx`, `<Scene>.test.tsx`, `<Scene>.stories.tsx`): 20 files. No scene `index.ts` and no `packages/ui/src/index.ts` change.
8. **G8 — Release and publication stay outside this plan.** Changelog entries go under the existing, never-packed sections of the 0.11.0 release (ODD S2, §7): `packages/ui/CHANGELOG.md` `## 0.11.0` and `packages/system/CHANGELOG.md` `## 0.13.0`. No version bump, `release:pack`, tag, issue comment or snapshot publication; tokens and cli do not change for #560.
9. **G9 — The fit is not this plan's job.** The measurement showed `show` is necessary but not sufficient above about 1,420px, and the owner's decision (L6) sends the remainder to the website's copy. The plan adds no auto-fit, container query, wider track, union value or token, and it does not claim that the reported word fits.
10. **G10 — Stop lines** are listed in §14.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/organisms/hero/{types.ts,useHero.ts,Hero.tsx,Hero.test.tsx,Hero.stories.tsx}` | Writer | `types.ts`: `titleVariant?: 'hero' \| 'show'` after `level` (`:16`), JSDoc in §3, no CVA axis, no new export. `useHero.ts`: destructure `titleVariant` in the parameter list (`:16-28`) so it never reaches `safeNative`; resolve anything but `'show'` to `'hero'`; return it. `Hero.tsx`: `variant={hero.titleVariant}` (`:17`); the 120-column line grows to 133, so Biome wraps the element to one attribute per line. `Hero.test.tsx`: new `describe('Hero titleVariant (#560)')` after `:326`, T1 to T6 (§4), v0.1 cases unedited. `Hero.stories.tsx`: `ShowTitle` and a meta sentence (§6) | +157 / −1 |
| `packages/ui/src/organisms/closing/{types.ts,useClosing.ts,Closing.tsx,Closing.test.tsx,Closing.stories.tsx}` | Writer | Same shape: `types.ts` after `level` (`:18`); `useClosing.ts` adds `titleVariant` to the destructure (`:17-31`); `Closing.tsx:14` becomes `variant={scene.titleVariant}` on the same line; `Closing.test.tsx` after `:368`; `ShowTitle` on the `DecorativeMedia` args | +140 / −1 |
| `packages/ui/src/organisms/chapter-break/{types.ts,useChapterBreak.ts,ChapterBreak.tsx,ChapterBreak.test.tsx,ChapterBreak.stories.tsx}` | Writer | Same shape: `types.ts` after `level` (`:16`); `useChapterBreak.ts` adds `titleVariant` to the destructure that already removes `children`, `ref` and `asChild` (`:15-35`); `ChapterBreak.tsx:17`; `ChapterBreak.test.tsx` after `:202`; `ShowTitle` on the `DecorativeMedia` args | +135 / −1 |
| `packages/ui/src/organisms/lab-stage/{types.ts,useLabStage.ts,LabStage.tsx,LabStage.test.tsx,LabStage.stories.tsx}` | Writer | Same shape: `types.ts` after `level` (`:16`); `useLabStage.ts` adds `titleVariant` to the destructure that already removes `ref` and `asChild` (`:16-36`); `LabStage.tsx:14`; `LabStage.test.tsx` after `:228`; `ShowTitle` keeping the experiment content | +140 / −1 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | In each of the four extraction cases (`:541`, `:576`, `:604`, `:630`) assert `titleVariant` as the real parser returns it: optional, default `hero`, `@control select`, the values `hero` and `show`; the protected-boundary assertions stay | +24 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `titleVariant: 'select'` in the four `expected` maps (`:247`, `:257`, `:266`, `:275`); `ownPropCounts` `labstage` 8 → 9, `chapterbreak` 7 → 8, `closing` 7 → 8, `hero` 9 → 10 (`:781-784`); one `it.each` over the four scenes beside the Carousel `variant` test (`:1332`): optional select, options `['hero', 'show']`, no injected argument, default `"hero"`, zero diagnostics | +24 / −4 |
| `skills/_shared/prop-naming.json` | Parent | New `heading-title-variant` entry with four usages (§5.1); refresh the `revision` of the 25 existing scene usages | +58, +25 / −25 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited. It prints source revisions, so the 7 convention rows that list scene usages change, plus the new row, in each slice | ≈ 43 long lines |
| `scripts/prop-naming.test.mjs` | Parent | `'heading-title-variant'` in `postReceiptProposals` (`:895`); four `postReceiptUsages` pairs; totals 191 → 192 and 188 → 189 (`:3050-3051`, recomputed on the merged tree); one new test modeled on Embed's (`:2321`): entry fields, status and approval, the exact usages, fresh revisions, `historicalRegistry([entry])` empty, `validate(registry)`, and the receipt assertions if D2 | +122 / −2 (+50 with D2) |
| `docs/components/hero/v0.2/prop-naming-approval.json` | Parent | Only if D2 is granted: the scoped receipt for `convention:heading-title-variant` (§5.1) | +52 |
| `scripts/design-system-artifact.test.mjs` | Parent | One test after the Embed block (`:1510`): each scene publishes `titleVariant` with default `hero`, no scene recipe gains an axis, the convention lists the four scenes (§5.3) | +30 |
| `scripts/package-exports.test.mjs` | Parent | One new test after the four scene SSR tests (`:2697`, `:2810`, `:2905`, `:2998`): each scene renders `titleVariant: 'show'` and invalid values in the built package (§5.5) | +45 |
| `scripts/package-consumption.test.mjs` | Parent | Packed fixtures: typed samples for both values, one `@ts-expect-error` negative per scene (fixtures `:942-1031`), SSR assertions at both values (`:7215-7310`). No CSS assertion: `:6444` already pins `.text-title-show` and the glow utilities in the packed CSS | +50 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ 16 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | Append the v0.2 note to the four scene rows (`catalog_data.py:114-117`), then one `build_catalog.py` run (§5.4) | ±4 lines each |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | One bullet each under the existing `## 0.11.0` and `## 0.13.0` `### Added` sections, citing `(#560)` (§7) | +6; +4 |
| `docs/components/hero/v0.2/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED and GREEN output, browser table, hashes (§9) | +60 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +5 |

Explicitly untouched: `packages/ui/src/primitives/text/**` (Heading and its tests, the PRESERVE baseline); the four scene `index.ts` files and `packages/ui/src/index.ts` (no export is added); `packages/ui/src/styles/**` (`compiled.css` already scans the four `types.ts` files and `primitives/text/types.ts`; the legacy bundle is frozen); `.storybook/**` (the four stories are already in `.storybook/preview.css`, and `ShowTitle` adds no utility); `packages/tokens/**`, `packages/cli/**`, `packages/mcp/src/**`; `packages/effects/**` (its `HomeTemplate.stories.tsx` imports Hero, ChapterBreak and Closing and must keep type-checking unchanged); package manifests and versions; other components and the files of other Round 5 lanes; the frozen v0.1 documents, the spec, the three notes and the approval record.

## 3. Design of the change

**API.** Exactly spec block 3: `titleVariant?: 'hero' | 'show'`, default `'hero'`, declared as one inline union per scene (the spec adds no exported type), consumed by each hook and never forwarded to the DOM. Planned JSDoc, English, in each file's local comment style, with the bare `@default` tag and the finite-enum `@control` (the spec's quoted block):

```ts
/**
 * Display recipe of the scene's own heading: `hero` (default) or the smaller `show` step, so a long
 * title can fit its column. Independent of `level`; the accent glows only with `hero`.
 * @default hero
 * @control select
 */
titleVariant?: 'hero' | 'show';
```

**Hooks.** Indicative only; the writer's code is reviewed against the approved spec, not against this excerpt. Every scene destructures the prop before `...native`, which is what keeps it off the DOM: Hero's `safeNative` filter and the other three hooks forward whatever is left.

```ts
// useClosing.ts — inside the existing destructure, before `...native`:
  titleVariant,
// after it:
  // Only 'show' selects the smaller recipe; any other runtime value, including null, resolves to the default.
  const titleRecipe = titleVariant === 'show' ? 'show' : 'hero';
// in the returned object:
  titleVariant: titleRecipe,
```

**JSX.** One attribute per scene: `variant={scene.titleVariant}` (`variant={hero.titleVariant}` in Hero). Hero's and ChapterBreak's explicit `tone='canvas'` and `accentBreak={true}` stay. A union-typed `variant` passes Heading's discriminated props because `'hero' | 'show'` sits inside `Exclude<TitleVariant, 'inverse'>`; `pnpm typecheck` proves it, and no cast is needed.

**What changes and what does not.** With the prop omitted or `'hero'` each scene renders byte-identical markup (spec TV-01). With `'show'` only two class strings change, both inside Heading: the heading's `text-title-hero` becomes `text-title-show`, and the accent's glow utility becomes `[text-shadow:none]`. The heading element, `id`, text, rank, the accent's `block` and `text-fg-brand-default`, every other part and every marker stay. The scenes' CVA recipes gain no axis, so the `variants` and `anatomy` of the four scenes in `design-system.json` do not change.

**Emission inventory.** Every utility is already emitted by Heading, so nothing new has to ship:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `text-title-hero`, `text-title-show` | `font-size` from `--text-title-hero` (`clamp(48px, 7.2vw, 112px)`) and `--text-title-show` (`clamp(44.8px, 6.56vw, 105.6px)`), with the token line height and weight | Existing pin `package-exports.test.mjs:6312` (PRESERVE, no RED); packed list `package-consumption.test.mjs:6444` |
| `[text-shadow:var(--text-shadow-title-hero)]`, `[text-shadow:none]` | `text-shadow: var(--text-shadow-title-hero)` and `text-shadow: none` | Existing pin `package-exports.test.mjs:6331-6334` |
| `text-fg-brand-default`, `block` | Unchanged | Existing |

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records command, exit code and counts). Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded, as in the Embed plan. Tests use roles and accessible names, `renderHook` only where a hook result is asserted, no `data-testid` and no full class strings, except the two recipe classes and the two glow utilities the spec names. **Guard rule:** today every scene ignores the prop, so the default-path assertions pass before and after; each row below says which assertions are RED and which are PRESERVE.

**New unit tests** (appended to each scene's test file, with a local render helper holding every optional part):

| ID | Test | Covers |
| --- | --- | --- |
| T1 | Default unchanged: omitted and `'hero'` give equal `container.innerHTML`; the heading has `text-title-hero` and not `text-title-show`; the accent keeps `text-fg-brand-default` and `[text-shadow:var(--text-shadow-title-hero)]` | TV-01 |
| T2 | `show`: Hero at ranks 1 to 6 (`it.each`, as `Heading.test.tsx:262` does), the other three at their story rank: `getByRole('heading', { level, name })` has `text-title-show` and not `text-title-hero`; `id`, rank and name (title plus accent) are unchanged; the accent keeps `text-fg-brand-default` and `block` and carries `[text-shadow:none]` instead of the glow | TV-02 |
| T3 | Runtime fallback: `'display'`, `'section'`, `'inverse'`, `'compact'`, `'SHOW'`, `''`, `null` and `42` (cast through `as unknown as`) render exactly T1's baseline; no `titleVariant`, `title-variant` or value text as an attribute, `data-*` or class; the root `div` has no unknown attribute; no console error | TV-03 |
| T4 | Types: typed `'hero'` and `'show'` compile; `@ts-expect-error` cases for `'display'`, `'section'`, `'inverse'`, `'compact'` and a number, written in the style of each file's existing "rejects invalid public types" test | TV-03 |
| T5 | Only the recipe changes: with every optional part present (Hero: eyebrow, accent, lede, actions, social, media; Closing: eyebrow, accent, lede, CTA, media; ChapterBreak: eyebrow, accent, lede, media; LabStage: eyebrow, accent, lede, experiment, media) the `show` output equals the `hero` output after swapping the recipe class and the glow utility; no `[style]`; the set of `eg-*` classes is identical | TV-04 |
| T6 | Identity: `rerender` hero → show → hero keeps the same heading node and `id` and toggles only the recipe classes; two scenes keep distinct ids | TV-05 |

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| TV-01 | T1 in each scene; the v0.1 cases HE, CL, CB and LS-01 to -07 unmodified | The default-recipe assertions are **PRESERVE, no RED**. The explicit `'hero'` render fails today: `titleVariant` reaches the root `div` as an attribute (`...native` forwards it), so the two outputs differ | Focused run green, v0.1 cases unmodified, differential check (below) |
| TV-02 | T2 | `text-title-hero` stays on the heading, `text-title-show` is absent, the accent keeps the glow and the root carries the stray attribute | Same runner green |
| TV-03 | T3, T4, `pnpm typecheck` | T3 fails today (the value leaks as an attribute). T4's `@ts-expect-error` lines are **vacuously satisfied** before the change (an unknown property is already an error) and become real guards after it; the type RED is the typed positive, which fails `pnpm typecheck` with TS2353 before the change | Runner green, `pnpm typecheck` clean |
| TV-04 | T5 | The `show` render keeps the `hero` recipe, so the swapped comparison differs | Green |
| TV-05 | T6 | The node-identity assertion passes today; the recipe-class toggles fail | Green |
| TV-06 | Docgen (four cases), Controls (maps, counts, `it.each`), the artifact assertion | The pins say 9, 8, 8 and 10 own props for LabStage, ChapterBreak, Closing and Hero while extraction still finds 8, 7, 7 and 9; the `titleVariant` rows are undefined; the artifact lacks the prop | Same runner green; `artifact --check` |
| TV-07 | `prop-naming.test.mjs` (counts, proposal, usages, the new test); `props:check` after the `types.ts` edits | 25 stale revisions fail "post-receipt usages exist with valid source evidence" (`:1613`) and "Hero binds both approved scene conventions" (`:1640`); the entry and usages are missing | `props:docs`, `props:check`, `test:props` green |
| TV-08 | The new `package-exports` test; the packed fixtures | After `pnpm build` of the base, the `show` render keeps `text-title-hero`; the typed sample does not compile in the packed consumer | Green after `pnpm build`; React 18.3.1 and 19.3.0 once D4 is granted |
| TV-09 | Not a test. Measured as reported; D3 repeats it on the shipped prop | — | Spec TV-09; the evidence file |
| TV-10 | Not a test. Pending the website's strings (OQ-5) | — | Pending |

**PRESERVE and differential.** The shared code is each hook's destructure and return and the Heading call site, used by every consumer of the scenes. Besides the unmodified v0.1 cases, `Heading.test.tsx` and the `HomeTemplate` story that imports three scenes, one differential render check runs on a copy of the base build kept in `mktemp -d` (never committed, removed afterwards): the static markup of the four scenes, with and without media and with the prop omitted, rendered by the base build and by the change, must be byte-identical (spec TV-01). Any difference nobody asked for is a regression to fix and pin with a test. The check needs `pnpm build`, so it is gated by D4.

**GREEN order.** Per scene: `types.ts` → hook → JSX → focused runner. Then, after all four: stories → docgen and Controls pins → registry (hash last) → `pnpm build` → package fixtures → artifact → catalog → changelogs.

## 5. Registry, docgen, artifact and catalog obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

After a scene's `types.ts` is final and `pnpm lint` is clean on it, add that scene's usage. The entry is created with the first usage (Closing); the three texts are the spec's block 3 words written as registry sentences (first letter capitalised, final period, nothing else changed), so the receipt can quote them verbatim. Never reorder; usages are appended in landing order:

```json
{
  "id": "heading-title-variant",
  "name": "titleVariant",
  "meaning": "Display-title typography recipe of the heading slot a composite component owns, chosen from the Heading recipes that component supports.",
  "whenToUse": "A composite renders its title through Heading and lets the consumer pick one of a small finite set of Heading's existing recipes so the title fits the container it sits in; the rank stays on `level`.",
  "avoid": "The component's own visual treatment (use `variant`), heading rank, dimension presets (use `size`), colour tone, accent layout, arbitrary font sizes or CSS values.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": [
    {
      "component": "Closing",
      "type": "'hero' | 'show' (optional; default 'hero'; any other runtime value resolves to 'hero')",
      "status": "existing",
      "source": { "path": "packages/ui/src/organisms/closing/types.ts", "symbol": "ClosingProps", "revision": "sha256:<whole-file SHA-256 of the reviewed final types.ts>" }
    }
  ]
}
```

The other three usages (`ChapterBreak`, `Hero`, `LabStage`) have the same `type` and `status` and the matching path and symbol. Then refresh the `revision` of the 25 existing usages that point at the four files: Hero's seven (`scene-media`, `scene-social`, `heading-title`, `heading-level`, `heading-eyebrow`, `trailing-text-accent`, `section-lede`) and the same six without `scene-social` for each of Closing, ChapterBreak and LabStage. They currently carry `sha256:09c805d2…`, `b413fbef…`, `ddcb7063…` and `371b71ee…` respectively, and every usage of one scene carries that scene's new hash. Hash only after the scene's `types.ts` is final; any later edit, even formatting, requires re-hashing. `pnpm props:docs` regenerates `docs/prop-naming.md` (never by hand); then `pnpm props:check` and `pnpm test:props`.

In `scripts/prop-naming.test.mjs`: `'heading-title-variant'` joins `postReceiptProposals`; one `{ conventionId, source }` pair per scene joins `postReceiptUsages` as it lands (the existing scene pairs at `:694-713` already cover the reused conventions of the four scenes); the totals become 192 and 189 (recompute them from the merged tree, because other Round 5 lanes may add entries first); and one new test modeled on Embed's (`:2321`) asserts the exact entry fields, `status` and `approval`, no alias and no exception, the usages (its expected component list grows by one line per slice: Closing; then Hero and ChapterBreak; then LabStage), every revision equal to the live file hash, `historicalRegistry([entry])` empty and `validate(registry)`. The reused entries keep their approved status and gain no usage and no exception.

**Receipt (D2).** `docs/components/hero/v0.2/prop-naming-approval.json`, modeled on `docs/components/embed/v0.1/prop-naming-approval.json`: `kind: human-approval-record`, `nativeReviewApproval: false`, `authority: assistant-recorded-forwarded-owner-approval`, `evidence.userStatements` quoting "Aprobar todas (Recomendado)" (L5, OQ-4) and, verbatim, the answer that approves this plan once it exists (never invented), `specPath` and `specPayloadSHA256` (`sha256:170160c2…`), `planPath` and `planPayloadSHA256`, an `interpretation` stating that it is a scoped convention approval, not native review authority, that the spec's three texts are written as registry sentences and that the one bound field the owner's answers did not show is `status`; `priorReceipts: []`, `semanticAmendments: []`, `previouslyProposedNowApproved: ['heading-title-variant']`, and one `entries` item with the scope `convention:heading-title-variant`, the `conventionHash` of the approved form, the `convention` record and a `source` equal to the Closing usage. The registry entry then becomes `status: approved` with `approval: { reference, scope, contentHash }`. Because `conventionHash` includes `status`, the receipt binds the approved form. It is not added to `receiptChain` (`:3203`), which lists amendment receipts; new-convention receipts such as Embed's are checked by their own test. If D2 is declined or unanswered, the entry ships `proposed` with `approval: null` and no receipt.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts`: in each of the four extraction cases assert the row the real parser returns, never a guess: `titleVariant` optional, `defaultValue` `hero`, `tags.control` `select`, values `hero` and `show` in extracted order; the existing assertions (required `title` and `level`, the native rows, the protected keys absent) stay unedited.
- `storybook-controls.test.ts`: the pins of §2, plus the `it.each` that maps `titleVariant` as an optional select with options `['hero', 'show']`, no injected argument (`args` stays `{}`), summary `"hero"` and zero owned-metadata diagnostics. The registered enhancer needs no change: an inline union with `@control select` is the Carousel `variant` precedent.
- `storybook-css.test.ts`, `cn.test.ts`: no edit expected; both run unchanged.

### 5.3 System artifact

`pnpm artifact --write`, then `pnpm system:docs`. Expected diff: each of the four scene entries gains one prop `titleVariant` (type `enum`, `required: false`, `default: 'hero'`, description from the JSDoc), so Hero lists 10 props, Closing 9, ChapterBreak 8 and LabStage 9; `variants`, `anatomy`, `surfaceUsage` and `layout` of the scenes are unchanged; `propNaming` gains `heading-title-variant` listing the four scenes (192 entries) and the revisions of the seven reused conventions move; `system.md` gains four prop rows and the naming entry. Add one assertion block after the Embed one in `design-system-artifact.test.mjs`: for each scene `titleVariant` is an enum, not required, default `hero`, its description matches `/hero/` and `/show/`; the scene's other props are exactly the previous list; no scene `variants` entry gains an axis (the no-CVA-axis promise of spec block 6); `heading-title-variant` lists exactly the four scenes. Then `artifact --check`, `system:check`, `test:artifact` and `test:system` green. The spec's TV-06 also names `scripts/system-md.test.mjs`: it runs inside `pnpm test:system` and pins no scene prop, so it needs no edit. The artifact is 642,794 bytes against the 786,432-byte budget; expected growth is a few KB, and any overflow is reported, not weakened.

### 5.4 Catalog

In `scripts/catalog_data.py:114-117` append one sentence to each of the four scene rows, for example for Hero: "v0.2 ([#560](https://github.com/egdev6/egdev-design-system/issues/560)): optional `titleVariant` (`hero` by default, or the smaller `show` step, whose accent does not glow) on the scene's own heading; no other change." The other three rows carry the same sentence. Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`.

### 5.5 Package fixtures

- `package-exports.test.mjs`: one new test, `Scene titleVariant renders in the package SSR of all four scenes (#560)`, after `pnpm build`: for each scene the package renders the heading with `text-title-show`, no `text-title-hero`, the accent with `[text-shadow:none]` and not the glow, no `titlevariant` attribute and an unchanged `id` and text; an invalid value renders the `hero` recipe. The four existing scene SSR tests and the title-recipe CSS test (`:6312`) stay unmodified.
- `package-consumption.test.mjs`: typed samples with `titleVariant: 'show'` and `'hero'` for each scene (new constants and exports, so the existing `heroProps` and sibling samples and their SSR assertions stay untouched), one documented `@ts-expect-error` negative per scene for an invalid value, added to each `…Negatives` tuple, and SSR assertions at both values. No ref, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Organisms/Hero`, `Closing`, `ChapterBreak` and `LabStage` keep autodocs, `Meta<typeof Scene>`, no manual `argTypes` and no `play`; every new story is English and typed `Story`. All existing stories stay.

- `ShowTitle` (one per scene): `titleVariant: 'show'` on the scene's media-bearing args, so the copy track is the narrow one, with English copy that includes one long word of at least 12 letters in the title; LabStage keeps its experiment content and Hero its actions. The story JSDoc says what `show` changes (the smaller step and no accent glow) and that it narrows the fit risk without removing it. The consumer's Spanish string is evidence for the measurement only and is not used.
- Meta text: one added sentence per scene saying that `titleVariant` chooses the heading's size recipe and that `show` also drops the accent glow.
- `Responsive` takes the new select through Controls, so both values can be inspected at every viewport; no other story changes.
- Controls: the registered enhancer shows `titleVariant` as a select in union order (`hero`, `show`) with the Docs Default column `hero`, and injects no argument; `Default` stays unchanged. Real browser Controls are checked in §9, not inferred from tags.
- No `.storybook` edit: the four stories are already scanned (`.storybook/preview.css:10,11,79,80`) and `ShowTitle` adds no utility.

## 7. Changelog entries

Entries go under the **existing, never-packed sections of the 0.11.0 release** (ODD S2), at the top of each `### Added` list, which runs newest first. In `@egdev/system` that section is **`## 0.13.0`**, not its older, already-released `## 0.11.0`. No tokens, cli, effects or mcp entry and no version move.

```md
<!-- packages/ui/CHANGELOG.md, ## 0.11.0, ### Added -->
- `Hero`, `Closing`, `ChapterBreak` and `LabStage` accept `titleVariant` (`'hero'` by default, or `'show'`) to choose the
  recipe of the scene's own heading. `show` is the smaller Show-register step, about 9% below `hero` between roughly
  680px and 1,560px of viewport and capped at 105.6px instead of 112px, so a long title can fit a narrow copy column;
  its accent does not glow, because the glow belongs to the `hero` recipe. The prop never changes the heading rank
  (`level`), and omitting it renders exactly as before. It narrows the risk of a title breaking inside a word and does
  not remove it, so shorten the copy for wider viewports. (#560)
```

```md
<!-- packages/system/CHANGELOG.md, ## 0.13.0, ### Added -->
- The source-derived artifact and reference include the `titleVariant` prop of `Hero`, `Closing`, `ChapterBreak` and
  `LabStage` (default `hero`) and the `heading-title-variant` naming concept (approved, with its receipt); existing
  props and recipes are unchanged. (#560)
```

The system bullet assumes D2 is granted; without it, "approved, with its receipt" becomes "proposed, with no approval receipt". `release:pack` counts only `(#N)` as resolved (`scripts/lib/pack-packages.mjs:234`), and the consumer-request rule is that a fully resolved request cites `(#N)` while partial work uses `Refs #N` ([versioning](../../../distribution/versioning.md#changelog-format)). `(#560)` is the recommended reading: the owner's L6 answer hands the remaining fit work to the website's copy. Spec OQ-5 does say TV-10 blocks calling #560 resolved, so D5 asks the owner to confirm; if the owner keeps #560 open for TV-10, write `Refs #560` in both entries. Other Round 5 lanes add bullets to the same sections, so whichever PR merges second keeps every set of bullets.

## 8. Checks to run

After G1, from the repository root, foreground, one at a time; the PRESERVE baseline (the first two commands on the unchanged tree) first, then the focused commands after each GREEN step:

```sh
pnpm exec vitest run packages/ui/src/organisms/hero packages/ui/src/organisms/closing packages/ui/src/organisms/chapter-break packages/ui/src/organisms/lab-stage packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/primitives/text packages/ui/src/templates/section-shell packages/ui/src/lib/storybook-css.test.ts packages/ui/src/lib/cn.test.ts --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/ui/src/primitives packages/tokens packages/cli packages/effects packages/mcp/src packages/ui/src/styles packages/ui/src/index.ts .storybook packages/ui/src/organisms/hero/index.ts packages/ui/src/organisms/closing/index.ts packages/ui/src/organisms/chapter-break/index.ts packages/ui/src/organisms/lab-stage/index.ts
pnpm typecheck
pnpm lint
pnpm props:docs
pnpm props:check
pnpm test:props
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
pnpm artifact --write
pnpm system:docs
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
node --test scripts/storybook-mcp-contract.test.mjs
pnpm test
pnpm build
pnpm artifact --check
pnpm system:check
pnpm test:package-exports
pnpm test:package-consumption
pnpm test:package-release
pnpm test:mcp
pnpm storybook-build
git status --short
```

The scope `git diff --stat` must print nothing. The final `git status --short` must list only §2 paths and other lanes' files: no scratch, cache or `.playwright-mcp/` output. `pnpm build` writes package outputs and may regenerate the artifact, so `pnpm artifact --check` runs again after it. `pnpm test:package-consumption` packs and installs isolated fixtures and needs D4 (offline alternative: `EGDEV_CONSUMER_OFFLINE=1`); it must exercise React 18.3.1 and 19.3.0 with the shipped tokens and UI CSS and no Tailwind compiler, and an unavailable matrix is recorded as pending. `pnpm test:package-release` is a PRESERVE check on the changelog structure. `pnpm test:mcp` has recorded README example drift after artifact changes (ODD S5d): run it on the base first before attributing any failure; a drift in the `get_design_system_md` example digest is a parent-owned fix outside §2, belonging to the release refresh at T7. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens tests, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and run here because `@egdev/system` ships, and CI's `test:cli` and tokens tests are untouched by this change. Every result is recorded per command with exit code and test counts in the evidence file. jsdom, docgen and token arithmetic prove no appearance, font fit, glow rendering or screen-reader behavior, and none is claimed.

## 9. Browser and capture procedure (D3)

Only after separate permission to start `pnpm storybook` (it builds tokens first) and to use Playwright MCP, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts (`document.fonts.ready`), motion settings, crop and date for every observation: the conditions the L6 report did not carry. Stories: `organisms-closing--show-title`, `organisms-hero--show-title`, `organisms-chapterbreak--show-title`, `organisms-labstage--show-title`, plus each scene's `--default` and `--responsive` for preservation.

1. **TV-09 on the shipped prop.** Closing with media in `SectionShell register='show'` (its default `wrap` gives the 515.55px copy column), with the reported string "¿CONSTRUIMOS ALGO?" in a scratch harness only (the title and accent split is the consumer's and #560 does not state it), Barlow Condensed 800 confirmed loaded, at 1280, 1440, 1536 and 1920px for `hero` and `show`: (a) reproduce the reported break at `hero`/1440px; (b) per word `Range.getClientRects()` and `getBoundingClientRect()` of the copy column. Expect agreement with the reported figures within 0.5px: 464px of the column at 1280px, 6.5px short at 1440px and about 70px short at 1920px. Any disagreement is a finding returned to the owner with the numbers, not a plan tweak.
2. **Computed style per scene (TV-02, TV-08).** At 1440px for each scene in `ShowTitle` and `Default`: the heading's `font-size` is 94.46px at `show` and 103.68px at `hero` (`6.56vw` and `7.2vw`, within 0.5px) with the same line height, weight and family; the accent's `text-shadow` is the token glow at `hero` and `none` at `show`; the accent colour, the heading element and its `id` are identical; there is no extra element.
3. **Reflow.** At 320px, no horizontal overflow at either value, and whether the story's long word splits at either recipe is recorded (spec block 5 estimates it does not).
4. **Controls (TV-06).** The `titleVariant` row is a select with options in union order, the Docs Default column shows `hero`, no argument is injected, and choosing `show` re-renders the heading.
5. **TV-10.** Repeat step 1 for Hero (528.14px track), ChapterBreak (515.56px) and LabStage (486.10px) once the website's real titles exist (OQ-5); until then the spec's projection is arithmetic only.
6. **Captures VIS-01 to VIS-05**, only if authorized: component-zone PNGs under `docs/components/hero/v0.2/` named `<scene>--<variant>--<state>--<viewport>--<theme>.png`, with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, not approved expected design, until the owner adopts exact hashes; VIS-01 also needs read-only access to the Pulso reference in egdev-website. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. A GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture exists, and no browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English, each body ending `Refs #560`; the PR is part of the one Round 5 PR (T7).

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the Closing titleVariant and register its naming convention (#560)` | Closing `types.ts`, `useClosing.ts`, `Closing.tsx`, `Closing.test.tsx`; the Closing docgen and Controls pins; `prop-naming.json` (the new entry with the Closing usage, Closing's 6 revisions), regenerated `docs/prop-naming.md`, `prop-naming.test.mjs` (proposal, usage pair, totals, the new test); the receipt and its assertions only if D2 | ≈ 308 (≈ 410 with D2) |
| 2 | `feat(ui): add titleVariant to Hero and ChapterBreak (#560)` | The two scenes' `types.ts`, hooks, JSX and tests; their docgen and Controls pins; their two usages and 13 revisions; regenerated view; two usage pairs | ≈ 362 |
| 3 | `feat(ui): add titleVariant to LabStage, the show-title stories and packed-build checks (#560)` | LabStage code and test; the four `ShowTitle` stories; the Controls `it.each`; its usage and 6 revisions; `package-exports.test.mjs` and `package-consumption.test.mjs` | ≈ 340 |
| 4 | `chore(integration): refresh the scene artifact, catalog rows and changelogs (#560)` | `design-system.json`, `system.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, both changelogs | ≈ 81 |
| 5 | `docs(scenes): record the titleVariant v0.2 implementation evidence (#560)` | `implementation-evidence.md`, the ODD log, and `capture.json` with PNGs only if authorized | ≈ 65 |

Slices 1 to 3 keep the registry and the metadata pins with the type changes, so `props:check`, `test:props` and the pins stay green per commit; `pnpm artifact --check` is stale between slices 1 and 4, and if every commit must be artifact-fresh, fold slice 4 into slice 3 (≈ 421). The dedicated registry test's expected list grows by one line per slice. A failing RED commit is never made.

## 11. Estimated changed lines

About **1,150 changed lines** (≈ 1,250 with the D2 receipt): ≈ 1,070 hand-written (the four scene folders ≈ 575: types 32, hooks 16, JSX 15, tests 465, stories 48; pins, harnesses and registry tests ≈ 300; registry JSON ≈ 108; catalog source, changelogs, evidence and log ≈ 83) and ≈ 80 generated (`docs/prop-naming.md` ≈ 43, `design-system.json` 2, `system.md` ≈ 16, catalog ≈ 16). For calibration, the Link v0.5 plan estimated ≈ 540 changed lines for one component and the Carousel v0.4 plan ≈ 585; this plan changes four scene folders and adds a convention, with ≈ 465 lines of scene tests and ≈ 125 of registry test, so roughly twice that is expected. Treat the range as 1,000 to 1,400.

## 12. Risks

- **Risk 1 — Registry freshness chain.** Four `types.ts` files feed 25 existing revisions plus four new usages. Hash only after each file is final and lint is clean, and rehash after any later edit. The two freshness tests fail loudly on a stale revision, which is the intended RED. The absolute totals (192, 189) and the line anchors move with the merge order of the other lanes.
- **Risk 2 — Prop leak through `...native`.** Hero's `safeNative` filter and the other three hooks forward every key they do not destructure, so a missed destructure puts `titleVariant` on the root `div`. T1 and T3 assert the absence of the attribute in all four scenes.
- **Risk 3 — Hero reflow.** Hero's `Heading` line is exactly 120 columns today and grows to 133, so Biome wraps the element: a larger diff than the one-token change suggests, with no behavior change. Lint runs on the final files.
- **Risk 4 — The glow disappears at `show`.** Accepted (OQ-3): `useHeading` gates the glow to `hero` on the canvas tone. A consumer who wants the glow on a smaller title would need a separate Heading amendment, and the changelog and the stories say so.
- **Risk 5 — Fit is narrowed, not solved.** On the reported string `show` fits Closing's column up to about 1,420px and breaks above it (as reported). Hero's, ChapterBreak's and LabStage's real titles are unmeasured; the spec's projection for a word as wide as the reported one is about 1,460px, 1,420px and 1,340px, and it is arithmetic only. The website owns the copy decision (L6).
- **Risk 6 — The measurement is reported, not reproduced.** The harness conditions, the `hero`/1440px reproduction and the 1536px point are not recorded. D3 repeats TV-09 on the shipped prop; without it the figures stay the owner's reported input.
- **Risk 7 — Parallel lanes, shared files.** `prop-naming.json`, `prop-naming.test.mjs`, `docs/prop-naming.md`, the artifact, `system.md`, `catalog_data.py` with its generated files, both changelogs and the docgen and Controls pins are also touched by other lanes. Expect rebase conflicts; regenerate generated files instead of hand-merging, keep the #560 bullet at the top of each `### Added` list and rehash the four `types.ts` revisions after rebasing.
- **Risk 8 — Docgen on a four-way copy.** The same inline union is declared in four files, so a docgen or Controls diagnostic on one scene may not appear on the others. Each scene is asserted separately (§5.2), and the `it.each` covers all four.
- **Risk 9 — Artifact fidelity.** The builder reads the `@default hero` tag and the inline union; the new assertion pins the default and the absence of a scene CVA axis, so a later refactor that adds an axis or a shared type fails it.
- **Risk 10 — Package harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18.3.1 and 19.3.0 matrix stays pending, which blocks "verified in packed consumers" claims, not the rest. The expected `get_design_system_md` README digest drift is parent-owned (§8).
- **Risk 11 — Consumer type break.** Widening a scene's props cannot break an existing caller, since the prop is optional, but a consumer that wraps `HeroProps` in an exact-key `Record` would see a new key; none exists in `packages/` and the website's code is not visible here.
- **Risk 12 — Citation reading.** `(#560)` marks the request fully resolved at release while TV-10 stays open (D5).

## 13. Pending owner decisions

No token, dependency, Radix, Material or naming-convention decision is pending: the prop, its default, the glow rule and the convention were approved with the spec, and the fit outcome was decided in L6.

1. **D1 — Plan approval (G1).** Approve this exact plan, the §2 edit surfaces including the parent-owned integration files, and the §8 commands, or revise it. The spec approval and the L6 approval of ten other plans do not cover it.
2. **D2 — `heading-title-variant` receipt (recommended: yes).** The owner's OQ-4 answer decided the convention on the spec's wording of `meaning`, `whenToUse` and `avoid`, which §5.1 copies as registry sentences. A receipt is the separate record that binds those exact bytes. If granted, the parent records `docs/components/hero/v0.2/prop-naming-approval.json` and the entry becomes `approved`; the receipt quotes the answer that approves this plan, so it is written after that answer exists. If declined or unanswered, the entry ships `proposed` with `approval: null`; both paths are valid and green.
3. **D3 — Browser observations and captures (recommended: yes).** Re-measuring TV-09 on the shipped prop, the computed-style rows, the reflow check and the Controls widgets need a local Storybook, a real Chromium and Playwright MCP, each with separate permission. Without them those criteria stay **Not observed** and the figures stay as reported. Captures VIS-01 to VIS-05 and access to the Pulso reference are a further, separate authorization.
4. **D4 — Build and package-harness commands (recommended: yes).** `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption` (isolated fixtures, may install; offline alternative `EGDEV_CONSUMER_OFFLINE=1`), `pnpm storybook-build` and the differential render check need explicit permission. Without the consumption run, TV-08's React 18.3.1 and 19.3.0 claim stays pending.
5. **D5 — Issue citation (recommended: `(#560)`).** The changelog entries cite `(#560)`, which marks the request fully resolved at release. Spec OQ-5 says TV-10 blocks calling #560 resolved, while the owner's L6 answer sends the remaining fit work to the website's copy. If the owner keeps #560 open until TV-10, write `Refs #560` in both entries.
6. **D6 — Publishing the snapshot.** Publishing v0.2 as a comment on each canonical issue (#318, #319, #324, #325) is a separate GitHub authorization, not required before code.
7. **D7 — TV-10 strings.** The website's real Hero, ChapterBreak and LabStage titles (OQ-5) are requested through the parent. They do not block code; they block recording TV-10.

Plan-level choices a reviewer can veto at G1: (1) the hook normalisation `titleVariant === 'show' ? 'show' : 'hero'`, so any other runtime value, including `null`, resolves silently to `hero` (spec block 4 states it); (2) the union is declared inline in each of the four scenes, with no shared exported type, because the spec adds no export; (3) the new tests live in new `describe` blocks and leave every v0.1 case unedited; (4) the package SSR test and the packed fixtures are new, not edits to the existing scene tests; (5) the Hero JSX reflow that Biome will apply; (6) the registry usage `type` wording, which states the fallback rule like Embed's usages do; (7) the `ShowTitle` story copy includes one long English word, not the consumer's Spanish string; (8) the registry entry is created with the first usage in slice 1 and the dedicated test's expected list grows by one line per slice.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, receipt, artifact, catalog, capture, release or Git action is taken or implied. Stop and return the evidence to the owner if: `titleVariant` would have to reach the DOM, a scene would need a CVA axis, or Heading would have to change; the output with the prop omitted differs from the base by a byte (T1 or the differential check); a utility of §3 does not emit or computes differently, or the glow stays under `show` or disappears under `hero`; `props:check` fails for a reason other than stale revisions, the entry would be marked approved without D2, or the validator rejects the usage `type`; docgen or Controls report diagnostics, or `titleVariant` does not extract as a select over exactly `hero` and `show`; an existing Heading, scene, SectionShell or `HomeTemplate` story case must change to pass; the artifact exceeds 768 KiB or its diff shows sections this plan does not expect; a generator demands an edit outside §2; a token, dependency, stylesheet, inline style, auto-fit or wider track appears necessary; or the D3 measurement disagrees with the reported TV-09 figures by more than 0.5px or crosses its threshold at a different viewport (return to the owner with the numbers).
