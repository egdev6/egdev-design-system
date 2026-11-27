# NowCard v0.4 — implementation plan (status band)

- **Status:** **Approved** on 2026-11-27 by the owner's verbatim answer "Aprobar todo (Recomendado)" ([`odd/tasks/round-5-consumer-requests.md` L13](../../../../odd/tasks/round-5-consumer-requests.md), one answer for the cataloging, the spec and this plan), as a gate separate from the spec's (S6). The approval binds the plan payload identified by `contentSHA256` `5a50e7a2…` below, which is byte-identical to the approved draft: its own statements that read the spec as Proposed, or the recipe, the convention, the catalog note or the work as pending or unstarted, describe the state at drafting and are superseded by this header. It covers the recommended answers to OQ-1 to OQ-6, recipe R1, the `leading-status-presentation` convention receipt (D5), the catalog row note (D4), the browser runs of §9 (geometry and computed style only: no PNG capture), the packed consumers and the `(#564)` citation (D6), and grants the edit surfaces of §2 (G1). It authorizes no capture (VIS-01 stays Pending), release, version bump or GitHub action, and no snapshot is published (D7). Nothing below was implemented or measured when the plan was drafted: preparation was read-only (source, test, registry, artifact, reference and changelog reads, digest computation and `git` inspection), and no build, test, generator, Storybook, browser or capture ran, so every check was future work then.
- **Coverage:** S2, S3 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), request [#564](https://github.com/egdev6/egdev-design-system/issues/564) only (deferred by L3, reopened by L12, verbatim "hazla"); NowCard only; acceptance IDs NC4-01 to NC4-15. Canonical component issue #276; #564 is the request. This is the plan gate that precedes implementation under T6. Format follows the [Carousel v0.4 plan](../../carousel/v0.4/implementation-plan.md); the new-convention registry steps follow the [Hero v0.2 plan](../../hero/v0.2/implementation-plan.md) (`titleVariant`, #560); the artifact and package sections follow the [ProjectCard v0.4 plan](../../project-card/v0.4/implementation-plan.md).
- **Contract authority:** [spec.md](spec.md) v0.4, **Approved** on 2026-11-27, `contentSHA256: 50b9141f4c26fd01aa5016af57c1ebd3221cdc44b839c94b9a17a882cb456b39`, reproduced byte-exact in this working tree by three independent methods (an anchored `awk` range, an anchored `sed` range and a Python byte-offset slice, each hashed with SHA-256) with the spec's own rule: the payload from the line-start `## 1. Purpose and scope` heading through EOF, LF, final newline. The heading text also appears inline in the spec's metadata, so a plain substring search anchors wrongly. This plan pins the approved bytes. The draft it was written against hashed to `5d20f8f263a0d945003fefb6bf5981efd6dfd8565cd448879f2bcf695ea06289`; approval with the recommended answers (OQ-1 to OQ-6) resolved them in the spec's text and moved the digest, so the plan's assumptions (G2) were re-read against the approved bytes and are exactly the recommended answers adopted. The approved spec changes no API, anatomy, behavior, accessibility, appearance or acceptance-criterion promise, only status and decision wording ([approval.md](approval.md), "Differences from the approved draft"). Approval record: [approval.md](approval.md), owner answer, verbatim "Aprobar todo (Recomendado)" (L13), 2026-11-27, given on the drafts left uncommitted on `integration/round-5` after commit `ae2408d`. Cataloging: [cataloging.md](cataloging.md), approved by the same answer. `visualHashes` Pending (VIS-01); visual conformity **Not evaluated**.
- **Plan identity:** `contentSHA256: 5a50e7a2c3a3cb95f715040ae87c9e16e4be98914d4cebc1c126698466ca1551` — SHA-256 of the UTF-8 LF payload from the exact line-start `## 1. Authority and gates` heading through EOF, final newline included; this header is excluded. Reproduce it with `awk '/^## 1\. Authority and gates$/{f=1} f' docs/components/now-card/v0.4/implementation-plan.md | sha256sum`. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `ae2408d`. Whole-file SHA-256 prefixes at HEAD (checked with `git show HEAD:<path>`; the working-tree files are equal, because `git status` showed only `odd/tasks/round-5-consumer-requests.md` modified, plus this folder, untracked): `types.ts` `dce9fa50…`, `useNowCard.ts` `cf91bc3a…`, `NowCard.tsx` `efb5f971…`, `NowCard.test.tsx` `c20617d0…`, `NowCard.stories.tsx` `765ae7be…`, `index.ts` `fb9835e4…`; integration files: `storybook-docgen.test.ts` `5432af9f…`, `storybook-controls.test.ts` `6c3921dd…`, `package-exports.test.mjs` `e935c95f…`, `package-consumption.test.mjs` `b38a1093…`, `design-system-artifact.test.mjs` `97ce82b7…`, `prop-naming.test.mjs` `d7cbd43b…`, `prop-naming.json` `b9ba4921…`, `docs/prop-naming.md` `9afc1452…`, `design-system.json` `1d114474…`, `system.md` `b42f5c1d…`, `catalog_data.py` `8f0c1c4b…`, `legacy/bundle.css` `0ddabe8b…`, `packages/ui/CHANGELOG.md` `a5ef1bfd…`, `packages/system/CHANGELOG.md` `37e450ed…`; read-only evidence: `theme.css` `2ba17e32…`, `badge/types.ts` `81d97cd4…`. Other round-5 lanes share the integration files, so the implementer re-verifies every digest and line number against the tree the work starts from (R0, §4).

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surfaces of §2, including the integration files the parent owns. Spec approval alone grants no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec first, and what this plan assumes.** The plan is drafted against a Proposed spec and is void until that exact spec is approved with its open questions answered. It assumes OQ-1 yes, OQ-2 (a), OQ-3 approve R1, OQ-4 as proposed, OQ-5 keep and OQ-6 yes. If OQ-2 is answered (b) or (c), or OQ-3 is declined, the plan is void: stop and renew it (a Badge `shape` axis is another component's spec and plan, outside this folder). `approval.md` is written by the parent, never by a writer.
3. **G3 — Registry.** One new proposed convention and its first usage, plus four refreshed source revisions (§5.1). The entry stays `proposed` with `approval: null` until the D5 receipt flips it. Adding a usage or refreshing a revision approves nothing globally, and the text of `leading-status-badge` is not touched, so its approval hash holds.
4. **G4 — Recipe, tokens and files.** R1 (spec §6) is the only new recipe, approved only by OQ-3. No token, dependency, Radix package or stylesheet is added. `packages/tokens/**` and `legacy/bundle.css` stay byte-identical, and the existing packed test that asserts no `now-card.css` still passes. `packages/ui/src/styles/compiled.css:54` already scans `../molecules/**/types.ts` and `.storybook/preview.css:20` the molecule stories, so no scanning change is needed. Every utility is a static literal in a CVA string composed per part with `cn()`: no inline style, interpolated class or new `AGENTS.md` exception.
5. **G5 — Geometry is a starting point.** R1's insets are the starting point approved by OQ-6. The final values are fixed after §9 within constraints C1 to C3 (spec §6). If no value satisfies them, **stop and return**: that is a spec amendment, not a plan tweak.
6. **G6 — Evidence ordering.** Editing `types.ts` stales, in one stroke, four registry revisions, the generated prop-naming view, `design-system.json` and `system.md`. Settle the final bytes of `types.ts` first (Biome clean), then regenerate in the §5 order. Any later edit to it repeats the regeneration, even a formatting one.
7. **G7 — The legacy cascade is live, and the stretch is derived, not observed.** `legacy/bundle.css` is imported into `@layer components` (`packages/ui/src/styles/index.css:10-12`), below utilities. The legacy `.eg-now-card` rule sets `align-items:flex-start` (`bundle.css:276`) while the root recipe sets `items-stretch` (`types.ts:128`), a utility that wins; the band's margin-based inset relies on that stretch. No legacy rule targets `eg-now-card__badge`. §9 proves this in a browser; until then it is a derivation.
8. **G8 — Stop lines.** Stop and return to the owner if: a utility does not emit or cascades differently from §3; C1 to C3 cannot be met; `statusPresentation` would have to reach the DOM; the `badge` DOM or class list differs from the base in any way; the regenerated artifact differs beyond the NowCard prop, its `statusBadge` description, the `propNaming` additions and the `nowCardBadgeVariants` recipe lines, measured against the artifact of the starting tree that R0 proves fresh; a generator demands an edit outside §2; or a token, dependency, stylesheet, new export or new part appears necessary.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/molecules/now-card/types.ts` | Writer | `statusPresentation?: 'badge' \| 'band'` on `NowCardProps` after `statusBadge` (`:41`): English JSDoc, `@control select`, `@default badge`, inline union, no new export. The `statusBadge` JSDoc body and `@controlReason` (`:35-39`). `nowCardBadgeVariants` (`:161`) becomes the base `eg-now-card__badge flex` with a `presentation` axis, a `size` axis and two compounds (§3) | +40 / −5 |
| `packages/ui/src/molecules/now-card/useNowCard.ts` | Writer | Destructure `statusPresentation = 'badge'` before `...native` (`:49`); resolve to `band` only for the exact value; pass `{ presentation, size }` to `nowCardBadgeVariants` (`:86`). No other logic | +5 / −1 |
| `packages/ui/src/molecules/now-card/NowCard.tsx`, `index.ts` | none | No change: the JSX already spreads `badgeProps` (`NowCard.tsx:22`), and the inline union adds no export | 0 |
| `packages/ui/src/molecules/now-card/NowCard.test.tsx` | Writer | New `describe('NowCard status presentation (#564)')` with T1 to T10 (§4); no existing case is edited | +195 / −0 |
| `packages/ui/src/molecules/now-card/NowCard.stories.tsx` | Writer | `WithStatusBand` and the Usage guidelines sentence (§6); `Icon` is already imported (`:3`) | +46 / −2 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | NowCard case (`:1726`): controls map (`:1734-1740`), own declarations 11 → 12 (`:1743`), default loop (`:1766`), union-values assertion beside `:1769`, `'WithStatusBand'` in the story-name list (`:1847-1858`) | +8 / −2 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `statusPresentation: 'select'` in the control map (`:395`), `nowcard: 5` → 6 (`:841`), the defaults row (`:1697`) | +3 / −3 |
| `scripts/package-exports.test.mjs` | Parent | Extend `NowCard ships Surface frame…` (`:6928`) with R1's selectors and declarations, and a band SSR render beside `:6839` (§5.5) | +34 / −0 |
| `scripts/package-consumption.test.mjs` | Parent | Typed `statusPresentation` samples and a documented `@ts-expect-error` negative near `:2229-2278`, a band card in `NowCardSamples`, and a JSDOM assertion beside `:7912-7923` (§5.5) | +20 / −1 |
| `scripts/design-system-artifact.test.mjs` | Parent | The v0.3 test (`:1715-1741`): its props list gains `statusPresentation` and its "documentation only" comment is rewritten (the one deliberate edit of a pinned assertion); one assertion that the `statusBadge` description mentions the band and that `nowCardBadgeVariants` lists the `presentation` axis | +14 / −4 |
| `skills/_shared/prop-naming.json` | Parent | One new proposed entry with its first usage; refresh the four NowCard `source.revision` values (§5.1) | +32 / −4 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ ±20 long lines |
| `scripts/prop-naming.test.mjs` | Parent | The usage list ending at `:899` and the proposals list (`:957`) gain the new usage and ID; a receipt test modeled on `:2552` (§5.1) | +75 / −0 |
| `docs/components/now-card/v0.4/prop-naming-approval.json` | Parent, after D5 | The receipt of the approved convention, in the shape of `docs/components/hero/v0.2/prop-naming-approval.json`. Not created by this draft | +45 (new) |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited (§5.3) | 2 minified lines; ≈ +25 (`system.md` near `:1453-1455`) |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent, **D4** | NowCard row note (`catalog_data.py:86`), then one `build_catalog.py` run (§5.4) | ±3 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | Entries under the existing `## 0.11.0` and `## 0.13.0`, citing (#564) (§7) | +9; +4 |
| `docs/components/now-card/v0.4/approval.md` | Parent | New record: the owner's verbatim answers, the spec and plan digests, the OQ resolutions. Not created by this draft | +30 |
| `docs/components/now-card/v0.4/implementation-evidence.md` | Parent | Observed RED and GREEN, mutation proofs, browser table, digests (§4, §9); no capture files while VIS-01 is Pending | +60 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the approvals and the delivery | +6 |

**Untouched:** `packages/tokens/**`; `packages/ui/src/styles/**` (the legacy bundle stays frozen); `packages/ui/src/atoms/badge/**` and every other atom; `packages/ui/src/organisms/now-strip/**`; `packages/ui/src/molecules/project-card/**` (its `statusBadge` is unaffected); `packages/ui/src/index.ts`; package manifests, versions and `pnpm-lock.yaml` (S2: no bump, tokens and cli are unchanged); `scripts/storybook-mcp-exceptions.json` (no new part); the frozen v0.1 to v0.3 documents and this folder's `spec.md` and `cataloging.md`.

## 3. Design of the change

**API.** Exactly spec §3: an inline union, default `badge`, consumed by the hook and never forwarded to the DOM. The JSDoc is the spec's text, in English, with `@control select` and `@default badge` as bare tag values (the installed pipeline keeps quotes as part of the value). The `statusBadge` `@controlReason` becomes "ReactNode is not serializable; see Default, WithBadge and WithStatusBand for status compositions.", which still matches the docgen pin `/ReactNode.*Default.*WithBadge/` (`storybook-docgen.test.ts:1761-1764`).

**CVA structure.** Every string is one static literal (no template, no concatenation) so the Tailwind scanner and the artifact builder read it:

```ts
export const nowCardBadgeVariants = cva('eg-now-card__badge flex', {
  variants: {
    presentation: {
      badge: 'px-6 pt-6 pb-3',
      band: 'mt-6 mb-3 items-center gap-2 rounded-sm border border-alpha-red-22 bg-alpha-red-12 px-2.5 py-1.5 font-display text-label-eyebrow text-primitive-red-200 uppercase shadow-edge wrap-anywhere'
    },
    size: { md: '', sm: '' }
  },
  compoundVariants: [
    { presentation: 'band', size: 'md', class: 'mx-6' },
    { presentation: 'band', size: 'sm', class: 'mx-4' }
  ],
  defaultVariants: { presentation: 'badge', size: 'md' }
});
```

With `badge`, the call returns `eg-now-card__badge flex px-6 pt-6 pb-3` for both sizes: the same classes in the same order as today's single literal (NC4-01). T2 pins it and the differential check compares it with the base copy. The comment above the recipe keeps its "marked span, no aria-hidden, no tone ownership" sentence for `badge` and adds that in `band` the card owns the brand tint.

**Why the inset is margin.** The pill's slot is `px-6 pt-6 pb-3` padding on a full-width wrapper. A band has to paint a box inset from the card edges, and padding on the wrapper cannot paint inside itself, so `band` moves the slot's three insets to margins (`mx-*`, `mt-6`, `mb-3`) and puts the label padding on the same element. A flex item with margins in the root's `items-stretch` column keeps filling the content box, and flex items' margins do not collapse, so the heading's top follows the pill's: by token arithmetic, 19.2 + 25.04 + 9.6 = 53.84px for a one-line label with an Icon `sm` in both presentations (the band's 9.6 padding, 2 border and 13.44 line box are the Badge's). That is arithmetic; C2 checks it in §9. `twMerge` meets no group conflict (`m*` and `p*` are separate groups), and the `band` and `size` compound adds exactly one `mx-*` (T3).

**Hook.**

```ts
  statusBadge,
  statusPresentation = 'badge',
  children,
  …
  // Only the exact value opts in; every other runtime value resolves to the default presentation.
  const presentation = statusPresentation === 'band' ? 'band' : 'badge';
  …
  badgeProps: { className: cn(nowCardBadgeVariants({ presentation, size })) },
```

`UseNowCardResult.badgeProps` keeps its shape, and `showBadge` still gates the wrapper, so a band without a node renders nothing (T5). The spec promises the invalid-value fallback (spec §4), as `level` already does.

**Emission inventory.** Each static R1 utility, the declaration it must emit and where it is proved. Badge already ships several of them, so the first GREEN run reads the exact declarations from the built CSS and pins them from observation; the column is the intent, derived and not observed:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `rounded-sm` | `border-radius` from `--radius-sm` | E1 |
| `border`, `border-alpha-red-22` | `border-width: 1px`; `border-color` from `--color-alpha-red-22` | E1 |
| `bg-alpha-red-12`, `text-primitive-red-200` | `background-color` from `--color-alpha-red-12`; `color` from `--color-primitive-red-200` | E1 |
| `shadow-edge` | `--tw-shadow` and `box-shadow` from `--shadow-edge` | E1 |
| `font-display`, `text-label-eyebrow`, `uppercase` | family; size, line height, weight and letter spacing from the `--text-label-eyebrow*` tokens; `text-transform: uppercase` | E1 |
| `mx-6`, `mx-4`, `mt-6`, `mb-3` | margin from `--space-6`, `--space-4`, `--space-6`, `--space-3` | E1 |
| `px-2.5`, `py-1.5`, `gap-2`, `items-center`, `wrap-anywhere` | padding, gap, alignment and `overflow-wrap: anywhere` | E1 |

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts). jsdom cannot compute layout or paint, so geometry and computed style sit in §9 and are never claimed from jsdom.

**What can go RED.** The wrapper already renders any node first in the DOM, and an absent node already renders nothing. Only the prop, the band classes, the story and the documentation pins can fail before the change. T2, T4, T5, T8 and T9 are characterization or PRESERVE guards: they pass before and after and are reported as such, never as RED. T5 and T8 are proved able to fail by a temporary mutation (below).

**R0 — baseline, no edit.** Record the focused runner, `pnpm typecheck`, `pnpm props:check`, `pnpm test:props`, `pnpm artifact --check`, `pnpm system:check` and `pnpm test:mcp` on the untouched tree, so a later failure is attributed correctly (`test:mcp` is in the CI gate; its base result is recorded, not assumed).

**New unit tests** (`NowCard.test.tsx`; roles and accessible names, `userEvent`, no complete class strings, no `data-testid`; existing cases stay unedited, including the heading-inset case at `:46` and NC-A1 at `:145-160`):

| ID | Test | Covers | Before the change |
| --- | --- | --- | --- |
| T1 | `statusPresentation` is consumed and never forwarded: the article has no `statuspresentation` attribute for `'band'`, `'badge'` and an invalid value; `data-example` still arrives; `console.warn` and `console.error` stay silent | NC4-02 | **RED**: the prop falls into `...native` and reaches the article |
| T2 | PRESERVE: omitted and `'badge'` at `md` and `sm`: the wrapper has `eg-now-card__badge`, `flex`, `px-6`, `pt-6` and `pb-3` and none of R1's utilities (`mx-`, `mt-`, `rounded-sm`, `uppercase`, `bg-alpha-red-12`, `border-alpha-red-22`, `shadow-edge`, `font-display`, `text-label-eyebrow`, `wrap-anywhere`, `items-center`, `gap-2`) | NC4-01 | GREEN (PRESERVE) |
| T3 | Band class contract at `md` and `sm`: the wrapper carries exactly R1's utilities, one `mx-*` (`mx-6` at `md`, `mx-4` at `sm`) and none of `px-6`, `pt-6`, `pb-3`; the heading keeps `pt-0` and its size inset | NC4-03 | **RED**: R1 is absent |
| T4 | Band semantics: the wrapper is the article's first child, followed by the heading and the body; the label is readable and the wrapper has no `aria-hidden`; `userEvent.tab()` lands on `document.body`; the article's name is the heading | NC4-04 | GREEN (characterization; the class part is T3) |
| T5 | Band without a node (undefined, null, false, true): no wrapper, `data-badge="false"`, the heading keeps `pt-6`, the console stays silent | NC4-05 | GREEN (characterization); mutation M2 |
| T6 | An invalid runtime value (`'ribbon'`, `''`, `null`) through an untyped boundary (one documented cast): the `badge` classes, no attribute, no warning | NC4-06 | **RED** for the attribute leak; the class part is GREEN |
| T7 | `rerender` badge → band → badge: the article's name, the heading id and the tab order are unchanged, the wrapper's classes swap, and a footer link's `onClick` is never called | NC4-07 | **RED**: the band never appears |
| T8 | The band wrapper carries no `transition`, `animate`, `transform`, `translate`, `scale`, `hover:` or `cursor-pointer` utility (NC-09 extended) | NC4-08 | GREEN (characterization); mutation M1 |
| T9 | A `Badge` supplied in `band` renders verbatim inside the wrapper; no `console.warn`; the wrapper's class list is the same as without it | NC4-15 | GREEN (characterization) |
| T10 | `composeStory(WithStatusBand, meta)` renders an `md` and an `sm` card with a band wrapper each, an Icon, one-line labels and no console error | NC4-12 | **RED**: the story does not exist |

**Documentation and integration pins** (parent-owned files), each RED until its edit lands: **D1** `storybook-docgen.test.ts`: `statusPresentation` is `select` with options `['badge', 'band']` in union order and default `badge`, own declarations are 12, the `statusBadge` reason still matches, `WithStatusBand` is in the story list. **D2** `storybook-controls.test.ts`: the map, the count 6 and the defaults row. **D3** `design-system-artifact.test.mjs`: the prop list, the `statusBadge` description and the `presentation` axis, against the stale artifact. **D4** `package-exports.test.mjs`: R1's utilities in the packed CSS and the band SSR, against the baseline `dist`. **D5** `package-consumption.test.mjs`: the typed sample, the negative case for `statusPresentation: 'ribbon'` and the JSDOM band assertion, against the baseline build. **D6** `props:check` (stale revisions) and the new `prop-naming.test.mjs` pins.

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| NC4-01 | T2; the existing NowCard tests unedited; the differential render | **PRESERVE, no RED.** The recipe restructure is the regression it guards. Green before and after | Focused run green; differential byte-identical |
| NC4-02 | T1 | the attribute leaks to the `article` | Green |
| NC4-03 | T3 | R1 classes absent | Green |
| NC4-04 | T4 | **No RED**: the DOM order already holds. Guard for the class part: T3 | Green |
| NC4-05 | T5 | **No RED**. Guard proved by mutation M2 | Green |
| NC4-06 | T6 | the attribute leaks | Green |
| NC4-07 | T7 | band classes never appear | Green |
| NC4-08 | T8 | **No RED**. Guard proved by mutation M1 | Green |
| NC4-09 | §9 geometry (C1 to C3) | Not a unit test | Pending until D3 |
| NC4-10 | §9 computed style and contrast | Not a unit test | Pending until D3 |
| NC4-11 | §9 NowStrip scratch composition | Not a unit test | Pending until D3 |
| NC4-12 | T10, D1, D2 | the story is missing, 11 declarations are found, the controls map lacks the prop | Green; `storybook-docgen` and `storybook-controls` suites pass |
| NC4-13 | D3 to D6 | stale revisions, a stale artifact, R1 utilities absent from the baseline `dist` | `props:docs`, `props:check`, `test:props`, `artifact --write` with `system:docs`, `pnpm build`, then the packed suites green |
| NC4-14 | the existing suites, unedited | **PRESERVE, no RED** | Green: NowCard (StepMeter cases included), NowStrip, ProjectCard, Badge and the metadata suites |
| NC4-15 | T9 | **No RED** | Green |

**Mutation proofs (never committed).** M1: add `transition-colors` to R1's string, so T8 fails. M2: make the hook render the wrapper when the node is absent, so T5 fails. Each is applied to the working tree, the failing line is recorded, and the file is restored byte-identical (its digest compared with the baseline before and after).

**PRESERVE and differential.** The shared code is `nowCardBadgeVariants` and the hook line that feeds it; both are private (absent from the barrels, which the docgen suite asserts at `:1845`) and used only by `useNowCard`. Evidence that previous behavior holds: the existing NowCard tests unmodified, T2, `git diff -U0` showing hunks only in the §3 sites, and one differential render check on a copy of the base commit in `mktemp -d` (not committed): the static markup of every existing NowCard story, at `md` and `sm`, with the prop omitted, must be byte-identical between the base copy and the change. Any difference nobody asked for is a regression to fix and pin with a test. No other component consumes the recipe, so no sibling-command differential applies.

**GREEN order.** `types.ts` → `useNowCard.ts` → focused runner → story and T10 → docgen and Controls pins → registry → artifact → catalog → changelogs → receipt (after D5).

## 5. Registry, docgen and artifact obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

After `types.ts` is final and `pnpm lint` is clean on it, create the entry with its first usage. The three texts are the spec's block 3 words written as registry sentences (first letter capitalised, final period, nothing else changed), so the receipt can quote them verbatim. Never reorder; append:

```json
{
  "id": "leading-status-presentation",
  "name": "statusPresentation",
  "meaning": "How a heading-owning card presents its leading status slot: the supplied node at its content width, or a full-width status band that the card paints around it.",
  "whenToUse": "A card that renders a consumer-supplied status node before its heading offers a small finite choice of how that slot is presented, with the default leaving the node as supplied.",
  "avoid": "The component's own visual treatment (use `variant`), the status node's tone or treatment, lifecycle presentation (use `status`), dimension presets (use `size`), arbitrary widths or CSS values.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": [
    {
      "component": "NowCard",
      "type": "'badge' | 'band' (optional; default 'badge'; any other runtime value resolves to 'badge')",
      "status": "existing",
      "source": { "path": "packages/ui/src/molecules/now-card/types.ts", "symbol": "NowCardProps", "revision": "sha256:<whole-file SHA-256 of the final types.ts>" }
    }
  ]
}
```

Then refresh the four existing NowCard usages, all `sha256:dce9fa50…` today: `preset-dimensions`, `heading-title`, `heading-level` and `leading-status-badge`. All five usages carry the same new hash. Hash last: any later edit, even formatting, re-hashes. Then `pnpm props:docs` (never by hand), `pnpm props:check` and `pnpm test:props`.

`scripts/prop-naming.test.mjs`: the Hero lane touched three places for `heading-title-variant`, and this one mirrors them: the post-receipt usage list that ends at `:899` gains the NowCard usage, the proposals list (`:957`) gains `leading-status-presentation`, and a receipt test modeled on `:2552` binds the receipt and the reviewed source revision. R0 re-reads the exact blocks. The `leading-status-badge` receipt test (`:4419-4475`) reads the NowCard revision from the working tree, never from an older byte, so it needs no edit.

**Receipt (D5).** After the owner approves the convention, record `docs/components/now-card/v0.4/prop-naming-approval.json` in the shape of `docs/components/hero/v0.2/prop-naming-approval.json`: scope `convention:leading-status-presentation`, the owner's verbatim answers, the spec and plan payload digests, and the content hash of the approved form. The entry flips to `approved` with `{ reference, scope, contentHash }` where `contentHash` is `conventionHash(entry)`. Hashing the approved form is the step D5 adds, as in the Hero plan; the receipt approves no implementation, alias or exception.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts`, NowCard case (`:1726`): add `statusPresentation: 'select'` to the controls map (`:1734-1740`); `toHaveLength(11)` → 12 (`:1743`); add `statusPresentation: 'badge'` to the default loop (`:1766`); assert the options `['badge', 'band']` beside the `level` assertion (`:1769`); add `'WithStatusBand'` after `'WithBadge'` in the story-name list (`:1847-1858`). The `statusBadge` reason assertion (`:1761-1764`) stays as it is.
- `storybook-controls.test.ts`: `statusPresentation: 'select'` in the `nowcard` map (`:395`), `nowcard: 5` → 6 (`:841`) and `statusPresentation: '"badge"'` in the defaults row (`:1697`). The new prop must map as an optional select without injecting an argument and with zero diagnostics.

### 5.3 System artifact

After `types.ts` is final: `pnpm artifact --write`, then `pnpm system:docs`. Expected diff, measured against the artifact of the tree the work starts from (R0 proves it fresh, so another lane's change is never attributed to this one): the NowCard `props` gain `statusPresentation` (enum, default `badge`, description from the JSDoc), the `statusBadge` description changes, `nowCardBadgeVariants` in `variants` and `anatomy` gains the two axes, the two compounds and R1's utilities (the card's recipes are listed today, `system.md:1453-1455`), and `propNaming` gains the new concept and its usage. Anything else is a G8 stop. Add the `design-system-artifact.test.mjs` assertions of §2, then `artifact --check`, `system:check`, `test:artifact` and `test:system` green, and the artifact stays under the size budget that test asserts.

### 5.4 Catalog (D4)

`scripts/catalog_data.py:86` ends the NowCard note with "…the card renders no meter." Recommended: append "v0.4 ([#564](https://github.com/egdev6/egdev-design-system/issues/564)) adds the opt-in `statusPresentation='band'`: the card paints the status as a full-width, uppercase, brand-tinted band around the supplied label; the default presentation is unchanged.", then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. If the owner declines, the row keeps its v0.3 wording and the catalog is stale on this one phrase.

### 5.5 Package fixtures

`package-exports.test.mjs`: in `NowCard ships Surface frame…` (`:6928`), add R1's selectors to the `utilities` list and assert their declarations through `rule()`, keeping `assert.doesNotMatch(utilities, /\.eg-now-card[^{}]*\{/)` and the no-`now-card.css` assertion. Beside `:6839`, add a band SSR render through `createElement(exported.NowCard, { statusPresentation: 'band', … })`: the wrapper carries R1, the article has no `statuspresentation` attribute, and the badge render is unchanged. `package-consumption.test.mjs`: a typed `statusPresentation: 'band'` sample next to `nowCardSample` (`:2232`), one documented `@ts-expect-error` for `statusPresentation: 'ribbon'` beside the existing negatives (`:2271`, `:2273`), a band card in `NowCardSamples`, and a JSDOM assertion beside the badge-wrapper assertions at `:7912-7923`, which stay unedited as the PRESERVE guard. No ref and no React-19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Molecules/NowCard` keeps autodocs, `Meta<typeof NowCard>`, no manual `argTypes` and no `play`; every new text is English.

- **`WithStatusBand`:** one story with two cards in a `grid gap-4` host, as `Sizes` does. The `md` card has `statusPresentation='band'` and `statusBadge={<><Icon name='hammer' size='sm' />Building</>}`; the `sm` card has the same prop and `<><Icon name='compass' size='sm' />Exploring</>`. Each has a body paragraph and a `NowCardFooter` with a `NowCardDetail`. Story description: "With `statusPresentation='band'` the card paints the status as a full-width, uppercase, brand-tinted band across the top. Supply the label words and, optionally, a decorative Icon: a Badge would paint a second pill inside the band. The default presentation keeps the Badge as supplied."
- **Meta text (`NowCard.stories.tsx:8-26`):** the Usage guidelines gain one sentence: "For a full-width status band, set `statusPresentation='band'` and supply the label words instead of a Badge; the card owns the band's brand tint." The existing sentences about the Badge slot stay.
- **Existing stories** stay unedited, `WithBadge` included.
- **Controls:** the registered enhancer shows `statusPresentation` as a select in union order and injects no argument; `Default` is untouched. Real browser Controls are checked in §9, not inferred from tags.

## 7. Changelog entries

S2: entries go under the existing sections, with no `## Unreleased` and no version bump (`@egdev/ui` is 0.11.0 and `@egdev/system` is 0.13.0 in their manifests; tokens and cli do not change).

`packages/ui/CHANGELOG.md`, `## 0.11.0`, at the top of `### Added`:

```md
- `NowCard` accepts `statusPresentation` (`'badge'` by default, or `'band'`) to present its status as a full-width band
  across the top of the card, as in the Pulso reference, instead of a content-width pill. In `band` the card paints a
  brand-tinted, uppercase band (display type, hairline border, light edge) and frames the label you supply, so pass the
  label words and, optionally, a decorative `Icon` instead of a `Badge`, which would paint a second pill inside it. Long
  labels wrap, the band follows the card's `size` and it has the brand tone only. The default presentation is
  unchanged and renders exactly as before. (#564)
```

`packages/system/CHANGELOG.md`, `## 0.13.0`, at the top of `### Added`:

```md
- The source-derived artifact and reference include `NowCard`'s `statusPresentation` prop (default `badge`), the
  amended `statusBadge` description, the status-band recipe lines and the `leading-status-presentation` naming concept
  (approved, with its receipt); existing props and recipes are unchanged. (#564)
```

If the D5 receipt is not recorded when this lands, drop "approved, with its receipt" and say "proposed". `(#564)` cites a fully resolved issue, as [versioning](../../../distribution/versioning.md) requires for consumer requests: #564 asks for a full-width uppercase status band and this delivers it as an opt-in. `release.json` `resolves` gains #564 when `release:pack` collects the versioned sections. If the owner narrows the delivery, write `Refs #564` instead. This work makes no version bump, `release:pack` or tag.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/molecules/now-card packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/organisms/now-strip packages/ui/src/molecules/project-card packages/ui/src/atoms/badge packages/ui/src/atoms/step-meter --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/tokens packages/ui/src/styles packages/ui/src/index.ts packages/ui/src/atoms packages/ui/src/molecules/now-card/NowCard.tsx packages/ui/src/molecules/now-card/index.ts packages/ui/package.json packages/system/package.json pnpm-lock.yaml
git diff -U0 -- packages/ui/src/molecules/now-card/types.ts packages/ui/src/molecules/now-card/useNowCard.ts
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
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
pnpm lint
pnpm test
pnpm build
pnpm test:mcp
pnpm test:package-exports
pnpm test:package-consumption
pnpm storybook-build
git status --short
```

The `git diff --stat` scope check must print nothing, the `git diff -U0` hunks must sit only in the §3 sites, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` may regenerate artifacts, so recheck `pnpm artifact --check` afterwards. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache; it must exercise React 18.3.1 and 19.3.0 with the shipped tokens and UI CSS and no Tailwind compiler. Record any unavailable matrix as pending. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, `test:mcp`, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and run here because `@egdev/system` ships. `pnpm test:cli` and the tokens tests are not run: this change does not touch them.

## 9. Browser procedure (functional only; no captures)

Only after separate permission to start `pnpm storybook` (it builds tokens first) and to drive a browser (Playwright MCP, or a headless Chrome as in earlier evidence). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion and forced-colors settings, and date for every observation. Stories: `molecules-nowcard--with-status-band` and, for preservation, `--with-badge`, `--sizes` and `--long-content`.

1. **NC4-01 baseline, before the first source edit.** On `WithBadge` and `Sizes` at `md` and `sm`, record the wrapper rect, the heading top and the wrapper's computed `display`, margins and paddings at 390px and 1280px. After the change, repeat: nothing may differ.
2. **NC4-09 geometry.** On `WithStatusBand`, at `md` and `sm` and at 390px and 1280px: C1 (the band's outer edges against the heading's content edges, within 0.5px), C2 (the heading's top against the same card in `badge` presentation, within 0.5px, with an Icon `sm` and a one-line label) and the band spanning the content box. Then a label wider than the card, with `scrollWidth <= clientWidth` at 320px (C3). In `dir="rtl"` the band still fills the content box.
3. **NC4-10 computed style and contrast.** The band computes `text-transform: uppercase`, the display font family, `border-radius` 3.2px, `background-color` `rgba(255, 0, 54, 0.12)` and the `alpha-red-22` border colour. Contrast is measured against the real composited background at the band's position, including the sheen, by sampling an element screenshot kept in scratch outside the repository; at least 4.5:1, with the token-arithmetic figures (about 7.4:1 and 6.6:1) recorded next to the measurement.
4. **Cascade (G7).** The root computes `align-items: stretch`; the legacy `.eg-now-card` rule that sets `flex-start` does not win; exactly one legacy `.eg-now-card` rule set is loaded and none targets `__badge`; the band fills the content box.
5. **NC4-11 NowStrip.** In a scratch composition outside the repository (a three-card row at `size="sm"`: band, badge, no badge), the footer bands align and the card tops follow A8-AC1 as v0.2 interprets it; the band and badge cards' heading tops match.
6. **Forced colors and reduced motion (observations).** Chromium emulation of `forced-colors: active` (emulation only, not a real Windows contrast session): the band's border stays visible. Under `prefers-reduced-motion: reduce` nothing changes, since the band has no motion.
7. **Docs and Controls (NC4-12).** The `statusPresentation` row is a select with options in union order and no injected argument; `WithStatusBand` renders with an empty console. The accessibility tree shows the band text; if Chromium reports it uppercased, record it as the L8 #563 F2 behavior, not a defect.
8. **Reference measurement (optional, D3).** Only with read-only access to `pulso-source.html`: record the `.tag` rect inside `.now-card` at 1280px, to compare its inset and height with the band's. Nothing in `egdev-website` is modified.
9. **Capture VIS-01:** not planned. It needs separate authorization, and these numbers are not captures.

**Visual conformity: Not evaluated.** No capture exists and no expected design is adopted; none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each; the parent commits)

Conventional Commits, English; squash-merge as for the other round-5 pull requests. The slices exist for review and bisect. A failing RED commit is never made.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 0 | `docs(now-card): approve the v0.4 spec and plan (#564)` | `cataloging.md`, `spec.md` and `implementation-plan.md` (already written) and `approval.md` | 30 (plus the three documents) |
| 1 | `feat(ui): add the NowCard status band presentation (#564)` | `types.ts`, `useNowCard.ts`, `NowCard.test.tsx` (T1 to T9), the docgen and Controls pins without the story name, the registry entry and four revisions, regenerated `docs/prop-naming.md` and the `prop-naming.test.mjs` list edits | ≈ 305 |
| 2 | `feat(ui): add the NowCard WithStatusBand story and packed-build checks (#564)` | `NowCard.stories.tsx`, T10, the story-name pin, `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 125 |
| 3 | `chore(integration): refresh the NowCard artifact, catalog row and changelogs, and record the convention receipt (#564)` | `design-system.json`, `system.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, both changelogs, `prop-naming-approval.json`, the receipt test and the status flip | ≈ 175 |
| 4 | `docs(now-card): record the v0.4 implementation evidence (#564)` | `implementation-evidence.md` and the odd log | ≈ 66 |

Slice 1 keeps the registry entry as `proposed`, so `props:check` and `test:props` stay green per commit, and slice 3 flips it with its receipt. `pnpm artifact --check` is stale between slices 1 and 3; if every commit must be artifact-fresh, fold the artifact files of slice 3 into slice 1 (≈ 350).

## 11. Estimated changed lines

About **700 changed lines**: ≈ 650 hand-written and ≈ 50 generated (`docs/prop-naming.md` 20, `design-system.json` 2, `system.md` 25, the generated catalog 4). The hand-written part is production source ≈ 51 (`types.ts` 45, the hook 6; the behavior is one class-list restructure and one ternary), stories ≈ 48, tests and fixtures ≈ 360, registry and receipt JSON ≈ 81, catalog and changelog text ≈ 15, and approval, evidence and log ≈ 96. For calibration, the v0.3 `statusBadge` plan estimated 585 and the tracked diff reached about 984, mostly because Biome expands test tables (ProjectCard v0.4 plan §11); treat 700 as the floor and about 1,000 as the plausible ceiling.

## 12. Risks

- **Risk 1 — Recipe duplication.** R1 repeats three of Badge's token utilities (the tint) in a second recipe, so the two can drift. T3 pins R1 and the spec names the extraction path: when a second component needs the look, move it into a Badge axis (OQ-2).
- **Risk 2 — A Badge passed in `band`.** The likeliest consumer mistake is adding `statusPresentation="band"` and keeping the Badge, which paints a second pill. The card cannot detect it (it never inspects children). The story, the JSDoc and the changelog state it, and T9 pins that nothing warns.
- **Risk 3 — The stretch and the margins are a derivation (G7).** If the root does not stretch the wrapper, or a legacy rule interferes, §9 shows it, and the remedy is a spec amendment. Without the browser authorization (D3) NC4-09 to NC4-11 stay Pending and the geometry ships unmeasured.
- **Risk 4 — Registry coupling.** Every `types.ts` edit invalidates five registry revisions and the artifact. Hash last and re-hash after any formatting change. The new convention is `proposed` until D5, and the `prop-naming.test.mjs` receipt pins move with it.
- **Risk 5 — The artifact diff is wider than a prop.** The card's private recipes are listed in `design-system.json` and `system.md`, so the restructured `nowCardBadgeVariants` adds lines there (§5.3). Anything beyond the listed items is a G8 stop.
- **Risk 6 — Parallel work on the shared outputs.** Other round-5 lanes share `prop-naming.json`, `docs/prop-naming.md`, `design-system.json`, `system.md`, `catalog_data.py` with its generated files, the packed-check scripts and both changelogs. Expect rebase conflicts; regenerate instead of hand-merging, and re-hash each component's revisions after rebasing.
- **Risk 7 — Contrast and forced colors are not measured.** The 7.4:1 and 6.6:1 figures are token arithmetic, and forced colors is derived from the specification. §9 measures the first and emulates the second; a real Windows contrast session stays pending.
- **Risk 8 — Alignment at `sm`.** The band aligns with the heading's inset (`mx-4`), while the footer text sits at `px-5` and the badge slot keeps `px-6`: the existing `sm` insets are not one grid. The band follows the heading by OQ-6; the difference from the footer is observed in §9, not changed.
- **Risk 9 — Untyped-boundary test (T6).** The invalid-value case needs one cast with a written reason, as the existing protected-props tests do.

## 13. Pending owner decisions

One Material recipe decision is pending, R1 (OQ-3). No token or dependency decision is pending.

1. **D1 — Spec approval and OQ-1 to OQ-6** (recommended: yes, (a), approve, as proposed, keep, yes). This plan follows them (G2).
2. **D2 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it.
3. **D3 — Browser authorization.** Starting `pnpm storybook` and driving a browser for §9, geometry and computed style only, with no PNG captures, and optionally reading `pulso-source.html` read-only for step 8. Without it NC4-09 to NC4-11 stay Pending and the geometry ships unmeasured.
4. **D4 — Catalog row note** (§5.4; recommended: yes).
5. **D5 — Convention receipt** for `leading-status-presentation`: approve the exact payload of §5.1 and its receipt (recommended: yes, at plan approval, as for `heading-title-variant`). Without it the entry stays `proposed`.
6. **D6 — Release timing and citation.** The change folds into the unpacked 0.11.0 and 0.13.0 (S2) with no bump, and `(#564)` marks the issue fully resolved when released; use `Refs #564` if the owner narrows the delivery.
7. **D7 — Publishing the v0.4 snapshot** as a comment on the canonical issue #276: a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: the inline union with no new export; the `size` axis and the two compounds on the private recipe; the margin-based inset; the single `WithStatusBand` story showing both densities; the invalid-value fallback to `badge`; the receipt landing in slice 3 with the status flip.

## 14. Stop

This plan authorizes nothing until G1. No source, test, story, token, dependency, registry, receipt, artifact, catalog, changelog, capture, release or Git action is taken or implied. Stop and return to the owner on any G8 condition, a contradictory result, or a needed edit outside §2.
