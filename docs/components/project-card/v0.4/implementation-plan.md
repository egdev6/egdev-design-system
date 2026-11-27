# ProjectCard v0.4 — implementation plan (footer actions)

- **Status:** **Approved** on 2026-11-27 by the owner's verbatim answer "Aprobar las dos (Recomendado)" ([`odd/tasks/round-5-consumer-requests.md` L11](../../../../odd/tasks/round-5-consumer-requests.md), one answer for the Chip v0.3 and ProjectCard v0.4 specs and plans), as a gate separate from the spec's (S6). The approval binds the plan payload identified by `contentSHA256` `6eb633b1…` below, which is byte-identical to the approved draft: its own statements that read the spec as Proposed or the work as unstarted describe the state at drafting and are superseded by this header. It covers the recommended answers to OQ-1 to OQ-3, the browser runs of §9 (geometry only: no PNG capture), the packed consumers and the `(#577)` citation, and grants the edit surfaces of §2 (G1). It authorizes no capture (VIS-01 and VIS-02 stay Pending), release or GitHub action. Nothing below was implemented or measured when the plan was drafted: preparation was read-only (static inspection and hash computation), and no build, test, Storybook, browser or package check ran, so every check was future work then.
- **Coverage:** S2 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), issue #577 only (L10); ProjectCard only; acceptance IDs PC-08 (rewritten) and PC-F1 to PC-F10. It does not cover #576 (Chip v0.3 has its own spec and plan). Canonical component issue #275; #577 is the request. Format follows the [Carousel v0.4 plan](../../carousel/v0.4/implementation-plan.md); the registry, artifact and package sections follow the [ProjectCard v0.3 plan](../v0.3/implementation-plan.md).
- **Contract authority:** [spec.md](spec.md) v0.4, **Approved** on 2026-11-27, `contentSHA256: b1b9beae5aa5d551ec97fb18f1e3f8db1290ab49c8a6e5ee72ba136eea1cf468`, reproduced byte-exact in this working tree by three independent methods (a byte-offset hash in Python, an anchored `awk` range and an anchored `sed` range, each piped to `sha256sum`) with the spec's own rule: the payload from the line-start `## 1. Purpose and scope` heading through EOF, LF, final newline, not the inline mention in its header. This plan pins the approved bytes. The draft it was written against hashed to `0f09e0353dedec6dd24eb7d5920760317854447e530c8388b9d2ac6994c8e74c`; approval with the recommended answers (OQ-1 to OQ-3) resolved them in the spec's text and moved the digest, so the sections that rest on an answer (OQ-1 the documented naming wording, OQ-2 the over-wide label observation of §9.4, OQ-3 the registry scope of G3 and §5.1) were re-read against the approved bytes (G2). The approved spec changes no promise, API, appearance or acceptance criterion, only status and decision wording ([approval.md](approval.md), "Differences from the approved draft"). Approval record: [approval.md](approval.md), owner answer, verbatim "Aprobar las dos (Recomendado)" (L11), 2026-11-27, given on the committed draft (`a43273e`). Cataloging approval: L10, "Aprobar las dos (Recomendado)". `visualHashes` Pending; visual conformity **Not evaluated**.
- **Plan identity:** `contentSHA256: 6eb633b188b1cfcae651aabf3ab4f26b5114bd6d9c0cec228217bfd53ba3a23b` — SHA-256 of the UTF-8 LF payload from the exact line-start `## 1. Authority and gates` heading through EOF, final newline included; this header is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `5ed0748`. Whole-file SHA-256 at HEAD (checked with `git show HEAD:<path>`, and equal to the working-tree files when drafting began): `types.ts` `5da961e5…`, `useProjectCard.ts` `74350af3…`, `ProjectCard.tsx` `888ab022…`, `ProjectCard.test.tsx` `05da45f4…`, `ProjectCard.stories.tsx` `41eec38d…`, `index.ts` `79a2ea7a…`; integration files: `storybook-docgen.test.ts` `72a0b095…`, `storybook-controls.test.ts` `3e746e89…`, `package-exports.test.mjs` `26f4dc6b…`, `package-consumption.test.mjs` `e04c6955…`, `design-system-artifact.test.mjs` `75878af8…`, `prop-naming.test.mjs` `afb1b38c…`, `prop-naming.json` `6228f538…`, `docs/prop-naming.md` `bb9fe017…`, `design-system.json` `48de625a…`, `system.md` `62526b8b…`, `catalog_data.py` `d16eea26…`, `legacy/bundle.css` `0ddabe8b…`, `packages/ui/CHANGELOG.md` `5b7090f2…`, `packages/system/CHANGELOG.md` `c690cf11…`. When drafting began, the only changes in the tree were `odd/tasks/round-5-cataloging.md` and `odd/tasks/round-5-consumer-requests.md` (the parent's log). Another writer's uncommitted #575 work has since modified `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md`, `packages/system/design-system.json`, `packages/system/system.md`, `scripts/catalog_data.py`, `docs/CATALOGO.md`, `docs/catalog.json`, `packages/mcp/README.md` and `scripts/storybook-mcp-exceptions.json` in the tree, so the digests of the first five are no longer their on-disk values. The cited line numbers (`system.md:1545`, `catalog_data.py:87`) still hold in the tree, and no ProjectCard file is affected. The implementer re-verifies every digest and line number against the tree the work starts from (R0, §4).

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surfaces of §2, including the integration files the parent owns. Spec approval alone grants no code (S6): the spec and this plan are approved each by its own digest, in the same answer (L10). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec first.** The plan is drafted against a Proposed spec and is void until that exact spec is approved with its OQ answers. If OQ-1 to OQ-3 are answered other than (a), renew the spec digest and this plan's pin. `approval.md` is written by the parent, never by a writer.
3. **G3 — Registry.** With OQ-3 (a) there is no new convention, usage, exception or receipt, and no convention text, hash or approval changes. The ten `source.revision` values that point at `project-card/types.ts` (all `sha256:5da961e5…`) must be refreshed after the file is final (§5.1). With OQ-3 (b) this plan is incomplete: stop and renew it.
4. **G4 — Visual references.** VIS-01 and VIS-02 stay Pending; no capture, hosting or harness is planned. Browser geometry (§9) is functional evidence, not a capture. Visual conformity is reported **Not evaluated**.
5. **G5 — No token, dependency, Material, stylesheet, prop, part, export or marker change.** The only source change that is not documentation is the keyword utility `flex-wrap` in one private recipe, a utility this package already ships (spec V-10). `packages/ui/src/styles/compiled.css:54` already scans `../molecules/**/types.ts` and `.storybook/preview.css:20` already scans the molecule stories, so no scanning change is needed. `packages/tokens/**`, dependencies, `legacy/bundle.css`, `index.ts` and `packages/ui/src/index.ts` stay byte-identical.
6. **G6 — Evidence ordering.** Editing `types.ts` and the `ProjectCard.tsx` JSDoc stales, in one stroke, ten registry revisions, the generated prop-naming view, `design-system.json` and `system.md`. Settle the final bytes of both files first, then regenerate in the §5 order. Any later edit to either file repeats the regeneration, even a formatting one.
7. **G7 — The legacy cascade is live, and the wrap is derived, not observed.** `legacy/bundle.css` is imported into `@layer components` (`styles/index.css:10-12`), below utilities. `.eg-project-card` sets `align-items:flex-start`, so the footer is a shrink-to-fit flex item whose width is its content width clamped to the card's content box; that clamp is what lets the row wrap without a `self-stretch`. `.eg-project-card__foot` sets only `margin-top:auto` and `padding-top`. §9 proves this in a browser; until then it is a derivation.
8. **G8 — Stop lines.** Stop and return to the owner if: `flex-wrap` does not emit or cascades differently from §3; in the browser the footer overflows instead of wrapping, or a one-action footer's geometry differs from the base (any recipe addition beyond `flex-wrap`, such as `self-stretch` or `min-w-0`, is a spec amendment, not a plan tweak); the regenerated artifact differs beyond the two footer descriptions, measured against the artifact of the starting tree, which R0 proves fresh; a test would need runtime enforcement of the cap or of names; a generator demands an edit outside §2; or a token, dependency, stylesheet, new prop or new export appears necessary.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/molecules/project-card/types.ts` | Writer | The JSDoc of `ProjectCardFooterProps` and its `children` with the `@controlReason` text (`:144-153`), the recipe comment and `flex-wrap` in `projectCardFootVariants` (`:270-271`) (§3); no new type or export | +11 / −6 |
| `packages/ui/src/molecules/project-card/useProjectCard.ts` | Writer | Comment-only edit on `useProjectCardFooter` (`:253`); no logic | +1 / −1 |
| `packages/ui/src/molecules/project-card/ProjectCard.tsx` | Writer | JSDoc-only edit on `ProjectCardFooter` (`:124`); the JSX is unchanged | +1 / −1 |
| `packages/ui/src/molecules/project-card/ProjectCard.test.tsx` | Writer | New `describe('ProjectCard footer actions (#577)')` appended with the §4 cases; imports gain `Button` and `WithActions`; no existing case is edited | +205 / −2 |
| `packages/ui/src/molecules/project-card/ProjectCard.stories.tsx` | Writer | `WithActions`, the meta-text edits and the `WithLink` description (§6); imports gain `Button` and `action` | +42 / −4 |
| `packages/ui/src/molecules/project-card/index.ts`, `packages/ui/src/index.ts` | none | No change: no export is added | 0 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | PC-10 case (`:1828`): `'WithActions'` after `'WithLink'` in the story-name list (`:1932-1947`) and one footer `children` description assertion in the part loop (`:1901-1925`) | +6 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | **No edit expected**: the `projectcardfooter` row (`:408`) and its count (`:844`) do not move. It runs in the focused command to prove that | 0 |
| `scripts/package-exports.test.mjs` | Parent | Extend `ProjectCard ships named passive article SSR…` (`:6923`) with a three-action footer; `.flex-wrap` emission is already pinned (`:7051`, `:7067`) | +14 |
| `scripts/package-consumption.test.mjs` | Parent | A typed three-action sample beside `ProjectCardStatusSample` (`:2056-2066`; `Button` is already imported at `:212`), the sample name added to the import at `:7820`, and one JSDOM block after the v0.3 status block (`:7853-7879`); the existing one-action assertions (`:7845`, `:7847`) stay unedited | +22 / −1 |
| `scripts/design-system-artifact.test.mjs` | Parent | One focused ProjectCard footer assertion beside `:807` (§5.3) | +10 |
| `skills/_shared/prop-naming.json` | Parent | Refresh the ten `source.revision` values (§5.1); no usage appended | +10 / −10 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | +10 / −10 |
| `scripts/prop-naming.test.mjs` | Parent | **No edit expected**: no usage is added, the receipts are unchanged and no test pins the revision hash | 0 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited (§5.3) | +2 / −2 (one minified line; `system.md:1545`) |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent, **D4** | ProjectCard row note (`:87`), then one `build_catalog.py` run (§5.4) | +3 / −3 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | Entries under the existing `## 0.11.0` and `## 0.13.0`, citing (#577) (§7) | +9; +4 |
| `docs/components/project-card/v0.4/approval.md` | Parent | New record: the owner's verbatim answer, the spec and plan digests, the OQ resolutions. Not created by this draft | +25 |
| `docs/components/project-card/v0.4/implementation-evidence.md` | Parent | Observed RED and GREEN, mutation proofs, browser table, digests (§4, §9); no capture files (VIS pending) | +50 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the approval and the delivery | +5 |

**Untouched:** `packages/tokens/**`; `packages/ui/src/styles/**` (the legacy bundle stays frozen); package manifests, versions and `pnpm-lock.yaml` (S2: no bump, tokens and cli are unchanged); `scripts/storybook-mcp-exceptions.json` (no new part); the exported-name allowlists; `LabStage`, `NowCard`, `ModuleCard` and `CommunityCard` (its own "single supplied action" wording belongs to another component and is out of scope); the frozen v0.1 to v0.3 documents and this folder's `spec.md`; every other component.

## 3. Design of the change

**API.** None. No prop, part, export, type or marker is added; `ProjectCardFooterProps` keeps `children: ReactNode` (required) and `className`. Only documentation and one utility change.

**Documentation.** The JSDoc is exactly the spec §3 text, in English, with `@control false` and `@controlReason Non-serializable ReactNode content; see the WithLink and WithActions stories for the supplied actions.` (the docgen part loop asserts a non-empty reason, `storybook-docgen.test.ts:1917-1924`). The phrase "one to three supplied Button or Link actions" stays on one JSDoc line in each block so the artifact keeps it intact. The other three sites:

- `ProjectCard.tsx:124`: "Footer zone for one to three supplied Button or Link actions; the card itself stays passive."
- `useProjectCard.ts:253`: "Compose the footer zone for one to three supplied Button or Link actions."
- `types.ts:270`: "Footer zone for one to three supplied actions; the row wraps onto further lines, with no pinning: it follows the body flow."

**Recipe.** The literal stays one static string, with no template and no concatenation, so the Tailwind scanner and the artifact builder read it:

```ts
export const projectCardFootVariants = cva('eg-project-card__foot flex flex-wrap items-center gap-3');
```

`useProjectCardFooter` already composes `cn(projectCardFootVariants(), className)` and returns the children untouched (spec V-3), so the hook gains no logic: no `Children` import, no counting, no cloning, no warning. The cap and name uniqueness are consumer obligations, not enforced at runtime (spec §4).

**Emission and cascade.** `.flex-wrap` is already emitted and pinned in the packed stylesheet (`package-exports.test.mjs:7051`, `:7067`), so this change adds no utility to the emitted CSS. The cascade analysis is G7.

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts). jsdom cannot compute layout, so geometry sits in §9 and is never claimed from jsdom.

**What can go RED.** The footer already renders its children verbatim (spec V-3). Only the recipe, the story and the documentation pins can fail before the change. T2 to T7 are characterization guards: they pass before and after, and that is reported as such, never as RED. Each guard is proved able to fail by one temporary mutation (below).

**R0 — baseline, no edit.** Record the focused runner, `pnpm typecheck`, `pnpm props:check`, `pnpm test:props`, `pnpm artifact --check`, `pnpm system:check` and `pnpm test:mcp` on the untouched tree, so a later failure is attributed correctly (`test:mcp` joined the CI gate in T4; its base result is recorded, not assumed).

**New unit tests** (`ProjectCard.test.tsx`; roles and accessible names, `userEvent`, no complete class strings, no `data-testid`; the 59 existing cases stay unedited, including the one-link PC-08 case at `:273`):

| ID | Test | Covers | Before the change |
| --- | --- | --- | --- |
| T1 | The footer keeps the marker, `flex`, `flex-wrap`, `items-center` and `gap-3`; none of `ms-auto`, `ml-auto`, `justify-*`, `order-*`, `truncate`, `line-clamp`, `text-ellipsis`, `overflow-*`, `whitespace-nowrap`, `flex-nowrap` is present; a root-level `className` still merges last | PC-F2 | **RED**: `flex-wrap` is missing |
| T2 | One, two and three supplied actions (a `Link` and `Button`s) render verbatim in one footer in supplied order, keeping roles and names; the footer has no `role`, no `aria-*` and no `ul`, `ol` or `li` | PC-F1 | GREEN (characterization) |
| T3 | Tab order with two and three actions in the plain and upper-zone (Backdrop and Mark) branches: one stop per action in DOM order, then `document.body`; Shift+Tab reverses | PC-08 | GREEN (characterization) |
| T4 | PRESERVE: a one-action footer holds the supplied element as its only child with no wrapper, in both branches | PC-F3 | GREEN (PRESERVE) |
| T5 | Four actions, two actions with the same accessible name and a non-action child render verbatim; `console.warn` and `console.error` are never called | PC-F5 | GREEN (characterization) |
| T6 | With only footer actions, `a[href]`, `button` and `[tabindex]` inside the article are exactly the supplied ones and none nests in another; the article has no `role` or `tabindex`; clicking the article away from an action moves no focus and leaves `outerHTML` unchanged | PC-F6 | GREEN (characterization) |
| T7 | A `w-48` host with three actions: no truncation, clamp, clipping or no-wrap utility on any card-owned part (Chip, Button and Link subtrees excluded, as the PC-09 scan excludes Chip) and the footer is the last child | PC-F4 (unit part) | GREEN (characterization) |
| T8 | `composeStory(WithActions, meta)` renders two links and one button in one footer with distinct accessible names, the tab order of T3 and no console error; the Button is never activated, so `action()` never touches the Storybook channel | PC-08, PC-F1, PC-F5 | **RED**: the story does not exist |

**Documentation pins** (parent-owned files): D1, `storybook-docgen.test.ts` story-name list gains `WithActions`: RED until the story exists. D2, the extracted `ProjectCardFooter` `children` description matches `/to three supplied Button or Link actions/`: RED against the stale JSDoc. D3, `design-system-artifact.test.mjs`: the `ProjectCardFooter` part description matches `/one to three supplied Button or Link actions/` and its `children` text matches `/enforced at runtime/`: RED against the stale artifact.

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| PC-08 | T3 | **No RED**: the footer already tabs through every child. Guard proved by mutation M1 | Focused run green; the existing one-link case unedited |
| PC-F1 | T2, T8 | T2 no RED; T8 `Expected a story but received undefined` | Green |
| PC-F2 | T1 | `expected … to have class "flex-wrap"` | Green; `.flex-wrap` stays pinned in the packed CSS |
| PC-F3 | T4; §9 geometry | **PRESERVE, no RED**; the base geometry is recorded before the first edit | Green; §9 equal geometry |
| PC-F4 | T7; §9 wrap | **No RED** for the unit part; the browser part stays Pending until authorized | Green; §9 |
| PC-F5 | T5 | **No RED**. Guard proved by mutation M2 | Green |
| PC-F6 | T6 | **No RED**. Guard proved by mutation M3 | Green |
| PC-F7 | D1, D2, D3 | Story list lacks `WithActions`; the description does not match; the artifact is stale | Green after the edits and the regeneration; the §8 search prints nothing |
| PC-F8 | the existing suites, unedited | **PRESERVE, no RED** | Green: ProjectCard, LabStage, NowCard, ModuleCard and the metadata suites |
| PC-F9 | `props:check` stale after the `types.ts` edit; `artifact --check` stale; the packed footer assertion against the baseline `dist` | Stale ten revisions and artifact; the packed `flex-wrap` footer assertion fails against the baseline build | `props:docs`, `props:check`, `test:props`, `artifact --write` with `system:docs`, `pnpm build`, then the packed suites green |
| PC-F10 | not a test | Not evaluated | Pending |

**Mutation proofs (never committed).** M1: make `useProjectCardFooter` return only the first child, so T2, T3 and T8 fail. M2: make it warn when `Children.count` exceeds 3, so T5 fails. M3: add `tabIndex={0}` to the `article`, so T6 fails. Each is applied to the working tree, the failing line is recorded, and the file is restored byte-identical (digest compared with the baseline before and after).

**PRESERVE and differential.** The shared code is `projectCardFootVariants`, used only by `useProjectCardFooter` (private; absent from both barrels). Evidence that previous behavior holds: the existing PC-08 one-link and PC-09 cases unedited, T4, `git diff -U0 -- packages/ui/src/molecules/project-card/types.ts` showing hunks only in the §3 sites, and the §9 geometry comparison of `WithLink` on the base and on the change. A sibling-command differential does not apply: no other component consumes the recipe, so there is no untouched command that shares the changed code.

**GREEN order.** `types.ts`, then the two comments, then the focused runner, then the story and T8, then the docgen pins, then the registry, the artifact, the catalog and the changelogs.

## 5. Registry, docgen and artifact obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

With OQ-3 (a), no usage is appended and no convention is touched. After `types.ts` is final and `pnpm lint` is clean on it, refresh the ten `source.revision` values that point at `packages/ui/src/molecules/project-card/types.ts`: the `ProjectCard` usages of `preset-dimensions`, `visual-treatment`, `heading-title`, `heading-level`, `heading-eyebrow`, `decorative-index` and `leading-status-badge`; `ProjectCardCode` under `accessible-name` and `collection-items`; and `ProjectCardTags` under `collection-items`. All ten carry `sha256:5da961e5…` today and all ten take the same new whole-file hash. Hash last: any later edit, even formatting, re-hashes. Then `pnpm props:docs` (never by hand), `pnpm props:check` and `pnpm test:props`. `scripts/prop-naming.test.mjs` needs no edit: nothing pins the revision hash (the old hash appears only in the registry, its generated view and the frozen v0.3 evidence), and `historicalRegistry` strips only reviewed post-receipt usages, none of which changes. No approval JSON is added.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts`, PC-10 case (`:1828`): add `'WithActions'` after `'WithLink'` in the story-name list (`:1932-1947`) and assert that the extracted `ProjectCardFooter` `children` description matches `/to three supplied Button or Link actions/`. The own-prop count, the footer controls map (`:1904`) and the reason check (`:1917-1924`) are unchanged.
- `storybook-controls.test.ts`: no edit expected (`projectcard: 9`, `projectcardfooter: 2`, `children: false`). A diff there means an accidental prop.

### 5.3 System artifact

After `types.ts` and `ProjectCard.tsx` are final: `pnpm artifact --write`, then `pnpm system:docs`. Expected diff, measured against the artifact of the tree the work starts from (R0 proves it fresh, so a concurrent change such as #575's is never attributed to this one): exactly two strings, the `ProjectCardFooter` part `description` and its `children` description, in `design-system.json` (one minified line) and on the same line of `system.md` (`:1545`). The footer recipe is not part of the artifact (spec V-12), so `variants` and `anatomy` do not move. Anything else is a G8 stop. Add one assertion beside `design-system-artifact.test.mjs:807`: the `ProjectCardFooter` part exists, its description matches `/one to three supplied Button or Link actions/`, its `children` text matches `/enforced at runtime/`, and the part list and `composedOf` (`['Chip']`) are unchanged. Then `artifact --check`, `system:check`, `test:artifact` and `test:system` green, and the artifact stays under the size budget that test asserts.

### 5.4 Catalog (D4)

`scripts/catalog_data.py:87` says "…labelled code well and a supplied footer action". Recommended: replace "a supplied footer action" with "one to three supplied footer actions (v0.4, [#577](https://github.com/egdev6/egdev-design-system/issues/577))", then run `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` once; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. If the owner declines, the row keeps its v0.1 wording and the catalog is stale on this one phrase.

### 5.5 Package fixtures

`package-exports.test.mjs` (`:6923`): add a second `ProjectCard` render whose footer holds a `Link`, a `Link` and a `Button` through `createElement` (the test already uses `exported.Link`); assert the three appear in order inside one `eg-project-card__foot`, that its class list contains `flex-wrap`, and that the markup has no `tabindex=` or `role="list"`. `package-consumption.test.mjs`: a typed three-action sample next to `ProjectCardStatusSample`, rendered by a new JSDOM block placed after the v0.3 status block (the loop at `:7821-7852` and the status block are not edited); assert three controls in order inside `.eg-project-card__foot`. The existing "One supplied footer action" and "only tab stop" assertions (`:7845`, `:7847`) stay unedited as the PRESERVE guard. No ref and no React-19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Molecules/ProjectCard` keeps autodocs, `Meta<typeof ProjectCard>`, no manual `argTypes` and no `play`; every new text is English.

- **`WithActions`:** `args` with `title: 'Pulso'`, `eyebrow: 'Open source'` and `children`: one body paragraph, then `ProjectCardFooter` holding three actions in importance order: `Link href='#pulso' variant='quiet'` "Details", `Link href='#pulso-source' variant='quiet'` "GitHub", and `Button size='sm' variant='neutral' onClick={action('Open demo')}` "Demo" (`action` from `storybook/actions`, as 40 stories already do). Story description: "The footer holds one to three supplied Button or Link actions in importance order and wraps in a narrow card. The card adds no tab stop; the cap of three and unique accessible names within the card are the consumer's to keep."
- **Meta text (`:18`, `:22`, `:27`):** "and one footer action" becomes "and one to three footer actions"; "Link (consumer-supplied): the card's single interactive element lives in the footer." becomes "Button and Link (consumer-supplied): the card's interactive elements live in the footer, one to three of them."; "The only focusable element is the one action the consumer supplies inside `ProjectCardFooter`." becomes "The only focusable elements are the one to three actions the consumer supplies inside `ProjectCardFooter`." One sentence is appended to the usage guidelines: "Keep the cap of three and give each action an accessible name that is unique within the card, adding the project name when the same wording repeats across a listing: the card enforces neither, adds no whole-card link and never nests controls."
- **`WithLink` (`:175`):** its description becomes "A footer with a single action; the card itself adds no tab stop."
- **No second story** for a narrow host: the approved decision names one story, so the §9 check narrows the viewport instead (D5 lets the owner ask for one).
- **Controls:** unchanged; the footer `children` stays `@control false` and `Default` is untouched. Real browser Controls are checked in §9, not inferred from tags.

## 7. Changelog entries

S2: entries go under the existing sections, with no `## Unreleased` and no version bump (`@egdev/ui` is 0.11.0 and `@egdev/system` is 0.13.0 in their manifests; tokens and cli do not change).

`packages/ui/CHANGELOG.md`, `## 0.11.0`, under `### Changed`:

```md
- `ProjectCardFooter` takes one to three supplied `Button` or `Link` actions instead of one, and its row wraps onto
  further lines in a narrow card. It adds no list semantics, tab stop or whole-card link, and nothing nests: each action
  keeps its own focus and the card still emits no event. The cap of three and unique accessible names within the card
  are yours to keep and are not enforced at runtime; add the project name when the same wording repeats across a
  listing. A single label wider than the card's content box is clipped by the card's legacy `overflow: hidden`, so keep
  labels short or use Button `labelWrap`. A one-action footer renders as before. (#577)
```

`packages/system/CHANGELOG.md`, `## 0.13.0`, under `### Added`:

```md
- The source-derived artifact and reference describe `ProjectCardFooter` as holding one to three supplied actions; no
  prop, recipe axis or export is added, and the existing props and recipes are unchanged. (#577)
```

`(#577)` cites a fully resolved issue, as [versioning](../../../distribution/versioning.md) requires for consumer requests: #577 asks for up to three footer actions and this delivers exactly that. `release.json` `resolves` gains #577 when `release:pack` collects the versioned sections. If the owner narrows the delivery, write `Refs #577` instead. This work makes no version bump, `release:pack` or tag.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/molecules/project-card packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/organisms/lab-stage packages/ui/src/molecules/now-card packages/ui/src/molecules/module-card --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/tokens packages/ui/src/styles packages/ui/src/index.ts packages/ui/src/molecules/project-card/index.ts packages/ui/package.json packages/system/package.json pnpm-lock.yaml
git diff -U0 -- packages/ui/src/molecules/project-card/types.ts
grep -rn "single supplied action\|single action\|exactly one Link\|One supplied action\|one footer action\|single interactive element\|exactly one action" packages/ui/src/molecules/project-card
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

The `git diff --stat` scope check must print nothing, the `grep` must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` may regenerate artifacts, so recheck `pnpm artifact --check` afterwards. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache; it must exercise React 18.3.1 and 19.3.0 with the shipped tokens and UI CSS and no Tailwind compiler. Record any unavailable matrix as pending. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, `test:mcp`, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and run here because `@egdev/system` ships. `pnpm test:cli` and the tokens tests are not run: this change does not touch them.

## 9. Browser procedure (functional only; no captures)

Only after separate permission to start `pnpm storybook` and to drive a browser (Playwright MCP, or a headless Chrome as in the v0.3 evidence). Record commit, browser and version, viewport, device scale, theme (dark), loaded fonts, motion setting and date for every observation. Stories: `molecules-projectcard--with-actions` and, for preservation, `molecules-projectcard--with-link`.

1. **PC-F3 baseline, before the first source edit.** On `WithLink`, record the footer rect, the link rect and the computed `display`, `flex-wrap`, `align-items` and `padding-top`. After the change, repeat: only `flex-wrap` may differ (`nowrap` becomes `wrap`).
2. **PC-F4 wrap.** `WithActions` at 1280×900: one row at the inline start, supplied order, gap equal to `--space-3` (9.6px). At 320px and 640px viewport widths (the layout widths of 400% and 200% zoom on a 1280px window): the later actions wrap at the inline start with equal row and column gaps, the card has `scrollWidth <= clientWidth`, every action's rect sits inside the card's padding box and the footer is no wider than the content box (the G7 shrink-to-fit clamp). In `dir="rtl"` the row starts at the right and the wrap mirrors.
3. **Cascade (G7).** The footer computes `display: flex`, `flex-wrap: wrap` and `align-items: center`; `padding-top` equals `--space-2`; exactly one `.eg-project-card__foot` rule is loaded and it sets no display, wrap or alignment.
4. **Over-wide label (OQ-2 (a)), observed and not changed.** Replace the Button label in the DOM with one wider than the content box and record the visible fraction, as the v0.3 evidence did for its F1, so the documented limit is stated from a measurement. No code changes.
5. **Target size, observation only.** Record each action's rect and whether the WCAG 2.5.8 spacing exception holds for the real Link and Button boxes at 1280 and 320px. It is an observation, not a conformance claim.
6. **Docs and Controls.** The docs row for `ProjectCardFooter` `children` has no input element and shows the new description; `WithActions` renders with an empty console.
7. **Captures VIS-01 and VIS-02:** not planned. They need separate authorization, and these geometry numbers are not captures.

**Visual conformity: Not evaluated.** No capture exists and no expected design is adopted; none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each; the parent commits)

Conventional Commits, English; squash-merge as for the other round-5 pull requests. The slices exist for review and bisect. A failing RED commit is never made: pre-commit runs Biome and the typecheck.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 0 | `docs(project-card): approve the v0.4 spec and plan (#577)` | `spec.md` and `implementation-plan.md` (already written), `approval.md` | 25 (plus the two documents) |
| 1 | `feat(ui): wrap one to three ProjectCard footer actions (#577)` | `types.ts`, the two comment edits, `ProjectCard.test.tsx` (T1 to T7), the ten registry revisions and the regenerated `docs/prop-naming.md` | ≈ 236 |
| 2 | `feat(ui): add the ProjectCard WithActions story and packed-build checks (#577)` | `ProjectCard.stories.tsx`, T8, the docgen pins, `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 121 |
| 3 | `chore(integration): refresh the ProjectCard artifact, catalog row and changelogs (#577)` | `design-system.json`, `system.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, both changelogs | ≈ 33 |
| 4 | `docs(project-card): record the v0.4 implementation evidence (#577)` | `implementation-evidence.md`, the odd log | ≈ 55 |

Slice 1 keeps the registry with the type change, so `props:check` and `test:props` stay green per commit. `pnpm artifact --check` is stale between slices 1 and 3; if every commit must be artifact-fresh, fold slice 3 into slice 1 (≈ 269).

## 11. Estimated changed lines

About **470 changed lines**: ≈ 442 hand-written and ≈ 28 generated (`docs/prop-naming.md` 20, `design-system.json` and `system.md` 4, the generated catalog 4). The hand-written part is production source ≈ 21 (`types.ts` 17, the two comments 4; one token, `flex-wrap`, is the only behavior), stories ≈ 46, tests and fixtures ≈ 260, the registry JSON 20, the catalog row 2, changelogs 13, and approval, evidence and log 80. For calibration, the v0.3 `statusBadge` plan estimated 585 and the tracked diff reached about 984, mostly because Biome expands test tables; treat 470 as the floor and about 700 as the plausible ceiling.

## 12. Risks

- **Risk 1 — The wrap is a derivation (G7).** If the footer does not clamp to the content box, or a legacy rule interferes, §9 shows it, and the remedy is a spec amendment, not a plan tweak. Without the browser authorization (D3) the wrap stays unobserved.
- **Risk 2 — Over-wide single labels.** A Button label is `whitespace-nowrap` by default, so one wider than the content box is clipped by the legacy `overflow: hidden`. This is the documented limit (OQ-2 (a)), observed in §9 and not fixed.
- **Risk 3 — Registry coupling.** Every `types.ts` edit invalidates ten revisions and the artifact descriptions. Hash last and re-hash after any formatting change.
- **Risk 4 — Characterization tests cannot go RED.** T2 to T7 are guards proved by mutation, not RED tests. The evidence must say so and record the restored digests.
- **Risk 5 — Parallel work on the shared outputs.** #576 (Chip v0.3) is expected to share, and the uncommitted #575 work already shares, the integration outputs: `prop-naming.json`, `docs/prop-naming.md`, `design-system.json`, `system.md`, both changelogs and `catalog_data.py` with its generated files. #575's entries already sit at the top of the 0.11.0 and 0.13.0 `### Added` sections in the tree. Expect rebase conflicts; regenerate instead of hand-merging and re-hash each component's revisions after rebasing.
- **Risk 6 — Story handler.** `onClick={action('Open demo')}` is safe in Storybook, and T8 never activates the Button. If `action()` proves unsafe on import in Vitest, drop the handler: a Button without `onClick` is valid for the story.
- **Risk 7 — Consumer-owned accessibility.** Name uniqueness, link purpose (WCAG 2.4.4) and target size (WCAG 2.5.8) are consumer obligations and stay **Not evaluated** beyond the §9 observations. The visual harmony of a mixed Link and Button row is observed, not specified.
- **Risk 8 — Variant mix in one file.** The existing ProjectCard stories use Link `variant='underlined'` (the deprecated alias of `plain`); `WithActions` uses `quiet`, documented for links inside cards. The old stories are not migrated: that is out of scope.

## 13. Pending owner decisions

No Material recipe, token or dependency decision is pending.

1. **D1 — Spec approval and OQ-1 to OQ-3** (recommended: (a) for all three). This plan follows them.
2. **D2 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it.
3. **D3 — Browser authorization.** Starting `pnpm storybook` and driving a browser for §9, geometry only, with no PNG captures. Without it the PC-F3 and PC-F4 browser parts stay Pending and the wrap is unobserved.
4. **D4 — Catalog row note** (§5.4; recommended: yes).
5. **D5 — A second story for a narrow host** (recommended: no, since the approved decision names one story).
6. **D6 — Release timing and citation.** The change folds into the unpacked 0.11.0 and 0.13.0 (S2) with no bump, and `(#577)` marks the issue fully resolved when released; use `Refs #577` if the owner narrows the delivery.
7. **D7 — Publishing the v0.4 snapshot** as a comment on the canonical issue #275: a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: the comment-only edits in `useProjectCard.ts` and `ProjectCard.tsx`; the `WithActions` composition (two quiet Links and one neutral Button); `quiet` Links in the new story while the old stories keep the deprecated alias; the ui entry under `### Changed`; no new emission test, because `.flex-wrap` is already pinned.

## 14. Stop

This plan authorizes nothing until G1. No source, test, story, token, dependency, registry, artifact, catalog, changelog, capture, release or Git action is taken or implied. Stop and return to the owner on any G8 condition, a contradictory result, or a needed edit outside §2.
