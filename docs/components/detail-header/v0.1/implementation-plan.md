# DetailHeader v0.1 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, tests, stories, registry write, artifact or catalog regeneration, capture, release or Git action. Nothing below is implemented or measured: preparation was read-only inspection and digest checks, and no build, test, Storybook, browser or capture ran.
- **Coverage:** S4 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), issue #572 only ("Consumer request: detail page header with metadata", consumer issue egdev6/egdev-website#49); this is the plan gate that precedes implementation under T6. It does not cover #569–#571 or #573–#574 (each has its own spec, plan and approval); #575 is an app pattern (L3). One new component; commits reference the issue with `Refs #572`, never `Closes` ([consumer requests §3](../../../distribution/consumer-requests.md)). The branch is the parent's choice; the writer never switches branches or commits. Format follows the [Carousel v0.4 plan](../../carousel/v0.4/implementation-plan.md); the new-component obligations (barrel, export inventories, catalog row, artifact entry, docgen and Controls pins) follow the [StepMeter v0.1 plan](../../step-meter/v0.1/implementation-plan.md).
- **Contract authority:** [spec.md](spec.md) v0.1, Approved on 2026-11-26 with the recommended answer to each of OQ-1 to OQ-7 and amended on 2026-11-27 (the link item recipe gained `wrap-anywhere`, [approval.md](approval.md) Amendment 1). `contentSHA256: 97f8419da9fed153dd3cba8483f9295843edc4e55b113de6d540bade09b851c8` (originally approved payload: `df34b603ee5474f6019997d8f367117d2790e212511b538a6c6b289a10988ece`), reproduced byte-exact in this working tree by two independent methods with the spec's own rule (payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline). Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)", 2026-11-26 (`odd/tasks/round-5-consumer-requests.md` L5), given on the committed draft (`8f50f0b`, payload `23171da14380006db59e2bc53beaa563455b4d818a48233115827d1dfa75eba5`), whose payload differs from the final one only by resolving the open questions. The cataloging approval is L3. Visual hashes: VIS-01 to VIS-03 are Pending. Approving the spec did not approve this plan (S6).
- **Re-approval note (Amendment 1, 2026-11-27):** the Chromium check of the implementation found that an unbroken link label does not wrap inside its item ([implementation-evidence.md](implementation-evidence.md), F1), because the approved link item recipe `min-w-0` gives the label nowhere to break. The owner chose to add `wrap-anywhere`, verbatim "Agregar `wrap-anywhere` (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L8). The spec's link item recipe now reads `min-w-0 wrap-anywhere`, and the pinned spec digest above replaces `df34b603ee5474f6019997d8f367117d2790e212511b538a6c6b289a10988ece` ([approval.md](approval.md), Amendment 1). This answer is the plan's renewed approval against the amended spec, and it settles the one thing G4 reserves for the owner (a change to a block 6 recipe). The plan's payload is byte-unchanged, so its identity digest below stays valid, and its section 3 excerpt of `detailHeaderLinkItemVariants` and the recipe rows of test T9 are read as including `wrap-anywhere`: those excerpts are indicative and the amended spec governs. Nothing else in the plan changes: no other utility, token, dependency, stylesheet or edit surface, and Chip, Heading and SectionHeader stay untouched (G8).
- **Plan identity:** `contentSHA256: f5cf17969cd2c77f7ef324e07410f2545d46218543f33ae9c2bccf96950a419b` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b` (draft spec commit). At inspection no tracked file under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified; only the Round 5 spec finalizations, their approval records and the ODD task file differed from HEAD. Whole-file SHA-256 prefixes, reviewed in this working tree: `packages/ui/src/index.ts` `713d1843…` (245 lines), `styles/compiled.css` `7c587736…`, `.storybook/main.ts` `30ef22e5…`, `.storybook/preview.css` `b55993fb…`, `molecules/section-header/types.ts` `5361e176…`, `useSectionHeader.ts` `eadbf748…`, `SectionHeader.test.tsx` `ec6aa72b…`, `molecules/social-links/types.ts` `f3c9c1a2…`, `useSocialLinks.ts` `4f1e14f1…`, `SocialLinks.test.tsx` `cbbf14bf…`, `atoms/chip/types.ts` `8cdf8fe5…`, `atoms/link/types.ts` `850d9f0b…` (the `types.ts` of SocialLinks, Chip and Link equal the `revision` of their registered `new-tab-notice` usages), `skills/_shared/prop-naming.json` `ceb95f54…` (185 entries, last `step-count`), `scripts/prop-naming.test.mjs` `f2acfd78…`, `packages/ui/src/lib/storybook-docgen.test.ts` `3705e162…`, `storybook-controls.test.ts` `f7928479…`, `storybook-css.test.ts` `81993251…`, `scripts/package-exports.test.mjs` `9b779e24…`, `package-consumption.test.mjs` `de9a624c…`, `design-system-artifact.test.mjs` `51238e62…`, `scripts/catalog_data.py` `041dccd6…` (128 lines). `packages/system/design-system.json` is 610,264 bytes against the 786,432-byte (768 KiB) shipped-JSON budget and the 1,048,576-byte artifact budget; `system.md` is 500,426 bytes. `@egdev/ui` is at 0.11.0 and `@egdev/system` at 0.13.0, both never packed (S2). Everything below is planned, not observed.
- **Visuals:** VIS-01 to VIS-03 are Pending: no capture, no hash. This plan produces behavior, token-arithmetic and computed-style evidence only; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the parent-owned integration surfaces and the two behavior-preserving `export` edits of §3 (P1). The spec approval granted no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance.** The spec digest binds the finalized bytes (the committed draft plus the recommended answers). The owner's answer was given on the committed draft and the final digest was computed afterwards ([approval.md](approval.md)). A reviewer who wants an exact-digest confirmation can ask for it before G1. Nothing here upgrades it.
3. **G3 — Registry.** Three new conventions (`content-metadata`, `content-tags`, `external-links`) and six reuses of approved entries; no exception. The owner approved the three conventions as a convention decision with OQ-5, but [approval.md](approval.md) is not a registry receipt, so their registry status depends on D2: `approved`, bound by a receipt, or `proposed` with `approval: null` (as `step-count` ships). No existing usage revision changes, because no other component's `types.ts` is edited. Adding usages approves nothing globally.
4. **G4 — Recipes, tokens and files.** The class recipes are approved in the spec (block 6): static token-backed utilities composed per part with `cn()`, no inline style, no arbitrary value, no Material paint, no new token, no dependency, no Radix package. **No stylesheet**: `detail-header.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. No new AGENTS.md exception is needed or requested.
5. **G5 — Reuse of two module-private rules (P1).** The spec requires reusing SectionHeader's readable-text rule and SocialLinks' link-destination rule without copying them, by a behavior-preserving internal export or extraction that this plan must approve (spec block 6). The plan chooses the internal export: `normalizeText` and `destination` gain the `export` keyword and nothing else (§3). Their components' tests stay unmodified and no code moves.
6. **G6 — Integration ownership.** The registry JSON and generated view, the system artifact and `system.md`, the catalog source and outputs, the barrel, `.storybook/main.ts`, the docgen, Controls and CSS pins, the package harnesses, the changelogs, the evidence file and the ODD log are parent-owned integration surfaces. A writer touches only the six DetailHeader files and the two P1 lines.
7. **G7 — Release and publication stay outside this plan.** Changelog entries go under the existing `## 0.11.0` sections (S2, §7). No `version` edit, `release:pack`, tag, issue comment or snapshot publication.
8. **G8 — Stop lines.** Stop and return to the owner if: a utility does not emit or cascades differently from §3; `cn()` merges a size or colour utility of a recipe away; SectionHeader, Chip, Link or ArticleFeature would need any change beyond the two `export` keywords; a `header` root or nested header would be needed; `props:check` fails for a reason other than stale revisions, or a `content-*` entry would be marked `approved` without D2; docgen or Controls report an owned diagnostic; the artifact exceeds a budget or its diff shows sections this plan does not expect; a token, dependency, Radix package, stylesheet, inline style or `!important` appears necessary; an existing SectionHeader, SocialLinks, Chip or Link case must change to pass; or a whole-repo test fails on the unexported folder and cannot be fixed without weakening it.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/molecules/detail-header/types.ts` | Writer | New. `DetailHeaderMetadataItem`, `DetailHeaderLink`, `DetailHeaderMessages` and `DetailHeaderProps` (native `div` props minus `children`, `title`, `role`, `aria-label`, `aria-labelledby`, `dangerouslySetInnerHTML` and `style`); English JSDoc with one valid `@control` on every own prop and entry field; `@default 1` on `level` and bare `@default (opens in a new tab)` on `newTabText`; `@classNameAllows` on the props type; eight static CVA recipes (§3). Type-only import of `SectionHeaderLevel` and `SectionHeaderText` from `../section-header` | +150 |
| `packages/ui/src/molecules/detail-header/useDetailHeader.ts` | Writer | New. Pure hook, no state or effects: readable-title gate with the single warning, level resolution, metadata, tag and link validation with the exact warnings, `messages` and `newTabText` fallbacks, protected-prop stripping, keys, per-part `cn()`; returns typed props objects including `role: 'list'` and the names | +155 |
| `packages/ui/src/molecules/detail-header/DetailHeader.tsx` | Writer | New. JSX only: null when the title is unreadable, root `div`, `SectionHeader`, then the lists that have valid entries | +60 |
| `packages/ui/src/molecules/detail-header/DetailHeader.test.tsx` | Writer | New. T1 to T12 (§4) | +470 |
| `packages/ui/src/molecules/detail-header/DetailHeader.stories.tsx` | Writer | New. Eight stories (§6) | +190 |
| `packages/ui/src/molecules/detail-header/index.ts` | Writer | New. `export { DetailHeader } from './DetailHeader'` and `export type { DetailHeaderLink, DetailHeaderMessages, DetailHeaderMetadataItem, DetailHeaderProps } from './types'`; no variants export | +8 |
| `packages/ui/src/molecules/section-header/useSectionHeader.ts` | Writer | P1: `normalizeText` (`:34`) gains `export` and a one-line JSDoc note; no other change; `index.ts` and the tests stay untouched | +2 / −1 |
| `packages/ui/src/molecules/social-links/useSocialLinks.ts` | Writer | P1: `destination` (`:52`) gains `export` and a one-line JSDoc note; no other change; `index.ts` and the tests stay untouched | +2 / −1 |
| `packages/ui/src/index.ts` | Parent | `export * from './molecules/detail-header';` between `community-card` (`:63`) and `dialog` (`:64`) | +1 |
| `.storybook/main.ts` | Parent | `documentedNativeProps.detailHeader`: `['id', 'dir', 'lang', 'aria-describedby', 'className', 'onClick']`, after `sectionHeader` (`:205`); SectionHeader's list minus `aria-labelledby` and `style`, which DetailHeader omits | +1 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | DetailHeader extraction test after the SectionHeader one (ends `:2642`); `'./molecules/detail-header'` in the barrel module list (`:2125-2126`); `'DetailHeader'` in the runtime names (`:2216-2220`, between `Countdown` and `Dialog`) (§5.2) | +64 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | Module list entry (`:56`), `detailheader` control map (after `:464`), own-prop count (`:854`), default pin (`:1692`), a dedicated test after the SectionHeader one (`:2261`) (§5.2) | +43 |
| `packages/ui/src/lib/storybook-css.test.ts` | Parent | DH-12 contrast guard from `packages/tokens/src/theme.css` beside the Carousel token guard (`:844`) (§4, T12) | +38 |
| `scripts/package-exports.test.mjs` | Parent | `DetailHeader` and the four types in every export inventory that names `CommunityCard` or `SectionHeader` (baseline `:5997`, `:6350`, `:6600`, `:6929`, `:7030`); the private names in the not-exported list (`:6869-6881`); a built-CSS emission test modeled on SectionHeader's (`:5866`) and an SSR test modeled on `:5914` | +115 |
| `scripts/package-consumption.test.mjs` | Parent | Named and type imports (`:200`, `:275-330`), typed positive and `@ts-expect-error` negative samples modeled on SectionHeader (`:2040-2095`) and the private-name negatives of CommunityCard (`:2132-2137`), `assertDetailHeaderCSS` modeled on `assertSectionHeaderCSS` (`:4534`) embedded and invoked at the same three places (`:6100/6132`, `:10409/10466`, `:10596`), an SSR assertion | +114 |
| `skills/_shared/prop-naming.json` | Parent | Three new entries appended after `step-count`; six usages appended to approved entries (§5.1) | +142 |
| `scripts/prop-naming.test.mjs` | Parent | Three ids in `postReceiptProposals` (`:855`); six usage pairs in `postReceiptUsages` (`:59`); `actual.length` 185 to 188 (`:2309`); one new DetailHeader test (§5.1) | +62 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ +50 |
| `docs/components/detail-header/v0.1/prop-naming-approval.json` | Parent | Only if D2 is granted (Text v0.3 receipt shape) | +55 |
| `scripts/design-system-artifact.test.mjs` | Parent | `'DetailHeader'` in the `classNameAllows` inventory (`:265`, after `CommunityCardMark` at `:281`) and one focused DetailHeader test modeled on the StepMeter one (`:556`) (§5.3) | +49 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ +30 |
| `scripts/catalog_data.py` | Parent | One DetailHeader row after the SectionHeader row (`:67`) (§5.4) | +1 |
| `docs/CATALOGO.md`, `docs/catalog.json` | Parent, generated | One `build_catalog.py` run; never hand-edited | ≈ +6 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | One bullet each under the existing `## 0.11.0` and `## 0.13.0` `### Added` sections (§7) | +14 |
| `docs/components/detail-header/v0.1/implementation-evidence.md` | Parent | New. Observed RED and GREEN output, commands with exit codes, browser table, limits (§9) | +90 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: every other component folder, including `packages/ui/src/atoms/chip/**`, `atoms/link/**`, `molecules/article-feature/**` and `molecules/page-header/**`; the `types.ts`, `index.ts` and tests of SectionHeader and SocialLinks; `packages/tokens/**`; `packages/ui/src/styles/**` (`compiled.css` already scans `../molecules/**/types.ts` at `:53`, the legacy bundle is frozen); `.storybook/preview.css` (wildcards at `:19` and `:64`); every `package.json`, version and the lockfile; `packages/mcp/**`, `packages/cli/**`, `packages/effects/**`; the frozen `docs/components/article-feature/v0.1/` folder; the spec and approval record of this version; the files of the other Round 5 reading-piece lanes (Prose, EmptyState, Breadcrumb, Pagination, Embed), except for the shared integration files above, whose merge order is a risk (§12). Line numbers in this plan are baseline anchors: sequential lanes move them, so the lane re-verifies the cited whole-file hashes before editing and re-locates each anchor (counts such as 185 and 188 are merge-order dependent, §12).

## 3. Design of the change

Indicative only: the writer's code and JSDoc are reviewed against the approved spec, not against these excerpts. Biome style: single quotes, 120 columns, no trailing commas, `type` never `interface`, no `any`, no `!`.

**API.** Exactly spec block 3, with the registry mapping of §5.1:

```ts
export type DetailHeaderMetadataItem = { label: string; value: string; dateTime?: string };
export type DetailHeaderLink = { label: string; href: string };
export type DetailHeaderMessages = { tags: string; links: string };

type DetailHeaderNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'title' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML' | 'style'
>;

/** ... @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size */
export type DetailHeaderProps = DetailHeaderNativeProps & {
  title: SectionHeaderText; // @control false, with a reason pointing to Default and Localized
  eyebrow?: SectionHeaderText; // @control false
  lede?: SectionHeaderText; // @control false
  level?: SectionHeaderLevel; // @default 1, @control select
  metadata?: DetailHeaderMetadataItem[]; // @control false
  tags?: string[]; // @control false
  links?: DetailHeaderLink[]; // @control false
  newTabText?: string; // @default (opens in a new tab), @control text
  messages?: Partial<DetailHeaderMessages>; // @control false
};
```

Every own prop and every entry field (`label`, `value`, `dateTime`, `href` and the two `messages` keys) carries English JSDoc with exactly one `@control` (`text` for the string fields, `false` with a concrete `@controlReason` for text-or-runs, collections and `messages`). `messages` carries no `@default`: its per-key fallbacks are described in prose.

**CVA recipes.** Eight static literals, the spec's block 6 table, each one string with no template and no concatenation, so the Tailwind scanner and the artifact builder read them:

```ts
export const detailHeaderVariants = cva('eg-detail-header flex min-w-0 flex-col gap-6');
export const detailHeaderMetaVariants = cva('eg-detail-header__meta m-0 flex min-w-0 flex-wrap gap-x-8 gap-y-4');
export const detailHeaderMetaEntryVariants = cva('flex min-w-0 flex-col gap-1');
export const detailHeaderTermVariants = cva('m-0 font-display text-label-eyebrow uppercase text-fg-muted');
export const detailHeaderValueVariants = cva('m-0 min-w-0 font-sans text-body-default text-fg-default wrap-anywhere');
export const detailHeaderTagsVariants = cva('eg-detail-header__tags m-0 flex min-w-0 list-none flex-wrap gap-1.5 p-0');
export const detailHeaderLinksVariants = cva(
  'eg-detail-header__links m-0 flex min-w-0 list-none flex-wrap gap-x-6 gap-y-3 p-0'
);
export const detailHeaderLinkItemVariants = cva('min-w-0');
```

None is exported from `index.ts`. Only the root accepts a consumer `className`, merged last as `cn(detailHeaderVariants(), className)`; no part takes one and SectionHeader, Chip and Link receive none.

**Hook (indicative).**

```ts
const warn = (message: string) => {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') console.warn(message);
};
// Destructure `level = 1` and `newTabText = '(opens in a new tab)'` in the parameter list, like useSocialLinks, so the
// docgen defaults() helper reads them; the protected keys are dropped before ...rest.
if (normalizeText(title) === undefined) {
  warn('DetailHeader requires a non-blank title; nothing was rendered.');
  return unreadableResult; // returns before any list is evaluated: exactly one warning
}
const rank = level === 1 || level === 2 || level === 3 || level === 4 || level === 5 || level === 6 ? level : 1;
// metadata: label and value non-blank strings, dateTime a non-blank string or omitted; invalid entry => warn and skip
// tags: non-blank strings; links: non-blank label and destination(href) !== undefined, href trimmed
// every kept entry carries key = `${originalPosition}:${text}`, so duplicates render and a skipped entry shifts no key
// listProps carry role: 'list', aria-label from messages (default Tags, Links) and the recipe class
```

**JSX (indicative).** `if (!renderRoot) return null;` then `<div {...rootProps}>`, `<SectionHeader title eyebrow lede level />`, `{metadata && <dl …>}` with `div` > `dt` + `dd` (value wrapped in `<time dateTime>` when present), `{tags && <ul …>}` with `li` > `<Chip mode='static'>`, `{links && <ul …>}` with `li` > `<Link href external newTabText>`. `role: 'list'` stays in the hook's props objects, not in JSX (precedent `useSocialLinks.ts:132`). No state, ref, `asChild`, id, `useId`, Surface, Radix import or inline style.

**P1 — the two shared rules.** `useSectionHeader.ts:34` `function normalizeText(value: unknown): SectionHeaderText | undefined` becomes `export function`, and `useSocialLinks.ts:52` `function destination(href: string): string | undefined` becomes `export function`; `useDetailHeader.ts` imports them from `'../section-header/useSectionHeader'` and `'../social-links/useSocialLinks'` (aliasing `destination` at the import for readability is allowed). Only the `index.ts` barrels define the public API of those components, so the root exports are unchanged; `packages/ui/package.json` exposes only `.` and `./styles.css`, so the new named exports are not reachable by a consumer either. Rejected alternative: extracting both rules into new `lib/` modules, which rewrites two hooks and adds two modules to test for no consumer benefit. A reviewer can veto the choice at G1.

**Warnings (exact text, development only, silent when `NODE_ENV` is `production`).**

| Condition | Text |
| --- | --- |
| Unreadable `title` | `DetailHeader requires a non-blank title; nothing was rendered.` |
| Invalid metadata entry | `DetailHeader: skipping an invalid metadata entry.` |
| Blank tag | `DetailHeader: skipping a blank tag.` |
| Invalid link entry | `DetailHeader: skipping an invalid link entry.` |
| Blank `newTabText` | `DetailHeader: newTabText must not be blank; using its default.` |
| Blank `messages.tags` | `DetailHeader: messages.tags must not be blank; using its default.` |
| Blank `messages.links` | `DetailHeader: messages.links must not be blank; using its default.` |

The spec gives the last template as `DetailHeader: <prop> must not be blank; using its default.`; this plan reads `<prop>` as the prop path the consumer writes (`newTabText`, `messages.tags`, `messages.links`).

**Plan-level choices a reviewer can veto at G1.** (1) P1 is an internal export, not an extraction. (2) `newTabText` carries a bare `@default (opens in a new tab)` like SocialLinks (an actual hook constant); spec block 3 names `@default` explicitly only for `level`. (3) The `<prop>` strings above. (4) An unreadable title short-circuits every other validation, so exactly one warning is emitted (DH-02). (5) A non-object `messages`, or a non-array `metadata`, `tags` or `links` (untyped input), is treated as absent without a warning; the spec names only blank strings and invalid entries. (6) A provided `newTabText` or `messages` value that is not a non-blank string counts as blank. (7) The DH-12 contrast guard lives in `storybook-css.test.ts`, beside the Carousel token guard.

## 4. Test-first sequence

Public-interface tests first (roles and accessible names, `userEvent`, no complete class strings, no `data-testid`), with the intended RED captured verbatim before any implementation; the evidence file records the command, exit code and counts. Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded. A new component has no jsdom RED before its files exist and a stub would be a dummy file, so T1 fails at import and each later row fails on an assertion after the previous minimal GREEN. Rows marked **guard** pass on their first run and claim no RED; **PRESERVE** rows pass before and after.

| ID | Test (file → case) | Covers |
| --- | --- | --- |
| T1 | `DetailHeader.test.tsx`: `it.each` levels 1 to 6 and the default, `getByRole('heading', { level, name })`; eyebrow, heading and lede in DOM order by `compareDocumentPosition`; a runs fixture keeps its `lang` spans; type-erased `0`, `7`, `NaN` and `'2'` give an `h1` | DH-01 |
| T2 | Blank (`'  '`), decorative-only (`[['•', undefined, true]]`) and empty-runs titles render an empty container with exactly one `DetailHeader requires a non-blank title; nothing was rendered.` warning and no SectionHeader warning, even when the lists hold invalid entries; silent under `NODE_ENV=production`; a rerender with a readable title renders | DH-02 |
| T3 | Metadata: `dl` with one `div` > `dt` + `dd` per entry in order (`getAllByRole('term')` and `getAllByRole('definition')`); `dateTime` wraps the value in `time[datetime]`; blank label or value, non-string and non-object entries are skipped with the exact warning, one per entry; absent, empty and all-invalid render no `dl`; duplicates render; the DOM text equals the supplied label | DH-03 |
| T4 | Tags: `getByRole('list', { name: 'Tags' })`, one `li` per tag in order, each with a static Chip (`eg-chip`, no `role`); no `button` or `link` inside; duplicates render; blank tags skipped with the exact warning; none valid renders no list | DH-04 |
| T5 | Links: `getByRole('list', { name: 'Links' })`; `getByRole('link', { name: 'Repository (opens in a new tab)' })` with trimmed `href`, `target="_blank"`, `rel` containing `noopener` and `noreferrer`; an `it.each` matrix of rejected inputs (blank label, relative, protocol-relative, `http:`, `javascript:`, `data:`, credentialed, `https:///`, empty and whitespace-only `href`, control characters `\u0000`, `\u007f`, `\u009f`, non-string) skipped with the exact warning; none valid renders no list | DH-05 |
| T6 | Localization: `messages` and `newTabText` overrides rename both lists and every notice; a partial `messages` keeps the other default; blank or non-string values for `newTabText`, `messages.tags` and `messages.links` fall back with the exact warning; rerender follows the current props | DH-06 |
| T7 | Structure: the root is a `div` with no `role`, `aria-label` or `aria-labelledby`; `querySelectorAll('header')` has length 1 and no list sits inside it; DOM order eyebrow, title, lede, facts, tags, links; type-erased `role`, `aria-label`, `aria-labelledby`, `style`, `children` and `dangerouslySetInnerHTML` never reach the DOM or add content, and the root has no `title` attribute (the own `title` is the heading text) | DH-07 |
| T8 | Root attributes: `id`, `lang`, `dir`, `data-*` and `onClick` reach the root; `className` merges last on the root only, `eg-detail-header` and a width utility survive `cn()`; the three list markers exist; no consumer class reaches SectionHeader, Chip, Link or any part | DH-08 (**guard**: `cn()` composes from the first GREEN) |
| T9 | Recipe invariants without full class strings: `cn()` keeps `text-label-eyebrow` and `text-fg-muted` on the term and `text-body-default` and `text-fg-default` on the value; the list recipes keep `list-none` and `p-0`; DetailHeader-owned elements (root, lists, entries, terms, values, link items) carry no `style`; a TypeScript AST scan of `types.ts` finds only string-literal `cva()` arguments with no template literal and no arbitrary value (`[`); the folder holds no `.css` file | DH-09 unit part (**guard**) |
| T10 | `userEvent.tab()` visits each link once in DOM order and then leaves the component; heading, terms, values and chips are not tabbable; rendering moves no focus | DH-10 (**guard**: native semantics) |
| T11 | `renderHook(useDetailHeader)`: typed result shape, `role: 'list'` and the list names in the props objects, `level` and `newTabText` defaults, unreadable title gives the empty result, no state between renders | DH-01, DH-02, DH-06 |
| T12 | Parent, `storybook-css.test.ts`: resolve the colour aliases in `packages/tokens/src/theme.css` to hex (`--color-fg-default` → `--color-primitive-white`, `--color-fg-muted` → `--color-primitive-graphite-400`, `--color-surface-0` to `--color-surface-3` → `graphite-950`, `-900`, `-850`, `-750`); the colour utilities found in the term and value recipes each reach at least 4.5:1 on each of the four surfaces (re-derived read-only during preparation: `fg-default` 18.26, 17.02, 15.50 and 13.55; `fg-muted` 7.17, 6.69, 6.09 and 5.32); an alias that does not resolve to a plain hex is a G8 stop | DH-12 |

Further parent-owned rows: the docgen and Controls pins of §5.2 (DH-14), the registry tests of §5.1 (DH-15), the artifact, catalog and package tests of §5.3 to §5.5 (DH-16).

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| DH-01 | T1, T11 | The whole `DetailHeader.test.tsx` fails at import (`./DetailHeader`, `./types`, `./useDetailHeader` unresolved); after the minimal GREEN of root and SectionHeader pass-through, the `0`, `7`, `NaN` and `'2'` cases fail until the hook resolves the rank | Focused run green |
| DH-02 | T2 | An empty `div` root and SectionHeader's own warning text appear instead of DetailHeader's, until the hook gates on the shared readable-text rule | Green, including the production case |
| DH-03 | T3 | No `dl`, no `time`, no warnings | Green |
| DH-04 | T4 | No list rendered | Green |
| DH-05 | T5 | No list rendered; after the first GREEN, the rejected-input matrix fails until the shared destination rule is applied | Green |
| DH-06 | T6, T11 | Names and notices keep their defaults; blank values emit no warning | Green |
| DH-07 | T7 | Protected keys (`role`, `aria-label`, `style`) reach the DOM until the hook strips them | Green |
| DH-08 | T8 | **Guard**: passes on first run, no RED claimed | Green |
| DH-09 | T9; E1 (built CSS in `package-exports.test.mjs`) | T9 is a **guard**. E1 fails against the baseline package (`DetailHeader` undefined, its utilities absent from the built CSS) until the files exist and `pnpm build` runs | Green after `pnpm build` |
| DH-10 | T10 | **Guard** | Green |
| DH-11 | §9 probes (D3) | The probe finds no `Molecules/DetailHeader` stories on the baseline build | Computed values recorded in the evidence file; **Not observed** without D3 |
| DH-12 | T12 | Fails at import of the recipes before `types.ts` exists | Green; the translucent host sample stays **Not evaluated** |
| DH-13 | SectionHeader, SocialLinks, Chip, Link and ArticleFeature suites unmodified; `git diff -U0` on the two hook modules; a barrel diff | **PRESERVE, no RED** | Suites green and unmodified; two one-keyword diffs; one barrel line |
| DH-14 | §5.2 pins edited first | Barrel lists differ from the real barrel; native-prop assertions fail until `documentedNativeProps.detailHeader` exists; Controls fail until the stories exist | Green, zero owned diagnostics |
| DH-15 | §5.1 tests edited first | Counter 185 against 188 and usage assertions fail until the entries and usages exist; `props:check` is stale until `props:docs` | `props:docs`, `props:check` and `test:props` green |
| DH-16 | §5.3 to §5.5 tests edited first | No `DetailHeader` entry in the committed artifact; the inventories lack it | `artifact --write`, `system:docs` and the checks green; packed React 18.3.1 and 19.3.0 matrix **Not observed** without D4 |
| DH-17 | The toolchain of §8 | Not a test | Commands recorded |
| DH-18 | Not a test | Visual conformity stays **Not evaluated** until VIS-01 to VIS-03 are captured and adopted | Pending |

**E1 — emitted CSS (`package-exports.test.mjs`).** A TypeScript AST scan collects every string literal of the `cva()` calls in `types.ts` (the technique of the SectionHeader test at `:5866`), then asserts that each non-`eg-` utility is present in the built `styles.css`, that the term and value recipes keep their size and colour declarations, and that no `detail-header.css` file exists. The first GREEN run exposes any utility the optimizer does not emit (for example `wrap-anywhere`); a missing one is a G8 stop.

**PRESERVE and differential.** The shared code is two module-private helpers, and the change only adds `export`. Evidence: the SectionHeader, SocialLinks, Chip, Link and ArticleFeature suites unmodified and green; `git diff -U0` on the two hook modules shows exactly the `export` keyword and the one-line JSDoc each; the export inventories of `package-exports.test.mjs` show root additions for DetailHeader only. One differential check, not committed: transpile both hook modules from the base commit (`git show HEAD:…`) and from the change with `ts.transpileModule` and `removeComments: true` in a `mktemp -d` directory outside the repository; the only difference must be the `export` modifier. Any other difference is a regression to fix and pin with a test.

**GREEN order.** P1 exports → `types.ts` → `useDetailHeader.ts` → `DetailHeader.tsx` → `index.ts` → focused runner → stories → barrel and `.storybook/main.ts` → docgen, Controls and CSS pins → package fixtures and `pnpm build` → registry (hash last) → catalog → artifact → system docs → changelogs → evidence.

## 5. Registry, docgen and artifact obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Lookup is in spec block 3. Coverage audit against the spec: the nine own root props map one to one: `title` → `heading-title`, `eyebrow` → `heading-eyebrow`, `lede` → `section-lede`, `level` → `heading-level`, `metadata` → `content-metadata`, `tags` → `content-tags`, `links` → `external-links`, `newTabText` → `new-tab-notice`, `messages` → `localized-messages`. The entry fields `label`, `value`, `dateTime` and `href` are component-local data fields that spec block 3 maps to no entry; the plan registers none. If a reviewer wants parity with `CarouselItem` (item `label` as `accessible-name`), that is a spec amendment, not a plan edit.

After the final `types.ts` is reviewed and `pnpm lint` is clean on it, append three entries after `step-count` (wording is the spec's approved proposal table, verbatim):

```json
{
  "id": "content-metadata",
  "name": "metadata",
  "meaning": "Ordered label/value facts about a content unit, rendered as a description list.",
  "whenToUse": "A header or card presents factual attributes such as date, place or source.",
  "avoid": "Option detail (`meta`), one context fact (`detail`), selectable options, rich or interactive values.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": [
    {
      "component": "DetailHeader",
      "type": "DetailHeaderMetadataItem[] (optional)",
      "status": "existing",
      "source": { "path": "packages/ui/src/molecules/detail-header/types.ts", "symbol": "DetailHeaderProps", "revision": "sha256:<whole-file hash of the reviewed final types.ts>" }
    }
  ]
}
```

`content-tags` (`name: "tags"`, usage type `string[] (optional)`) and `external-links` (`name: "links"`, usage type `DetailHeaderLink[] (optional)`) follow the same shape with the spec's `meaning`, `whenToUse` ("Use" column) and `avoid` strings. Then append six usages to approved entries, each `status: "existing"` with the same `source`, in this order:

| Entry | Usage `type` |
| --- | --- |
| `heading-title` | `SectionHeaderText (string or readonly text runs)` |
| `heading-level` | `SectionHeaderLevel (1 to 6; default 1)` |
| `heading-eyebrow` | `SectionHeaderText (string or readonly text runs)` |
| `section-lede` | `SectionHeaderText (string or readonly text runs)` |
| `localized-messages` | `Partial<DetailHeaderMessages>` |
| `new-tab-notice` | `string (localized new-tab notice appended to every link)` |

No existing usage revision changes (no other `types.ts` is edited; verify with `pnpm props:check` after P1). All nine DetailHeader usages carry the same hash of the final `types.ts`; hash only after `types.ts` is final and lint-clean, and re-hash after any later edit, even formatting. No exception is requested.

**D2 (status of the three new entries).** Without D2 they ship as above (`proposed`, `approval: null`). With D2 the parent records `docs/components/detail-header/v0.1/prop-naming-approval.json` (the [Text v0.3 receipt](../../text/v0.3/prop-naming-approval.json) shape: `authority: assistant-recorded-forwarded-owner-approval`, the owner's verbatim answer and date, the spec path and digest, one entry per convention with `scope: convention:<id>`, the `conventionHash` of the **approved** form and the reviewed `source`), and each entry becomes `status: "approved"` with `approval: { reference, scope, contentHash }`. `conventionHash` binds `id`, `name`, `meaning`, `whenToUse`, `avoid`, `status`, `aliases` and `exceptions`. The spec table shows `id`, `name`, `meaning`, `whenToUse` (its "Use" column) and `avoid`, the spec proposes no exception and the entries carry no alias; `status` is the only bound field the answer did not show, so hashing the `approved` form is the one step D2 adds.

**Tests.** In `scripts/prop-naming.test.mjs`: the three ids join `postReceiptProposals` (`:855`; `historicalRegistry` must strip them), the six `{ conventionId, source: 'packages/ui/src/molecules/detail-header/types.ts#DetailHeaderProps' }` pairs join `postReceiptUsages` (`:59`), `actual.length` becomes 188 (`:2309`, with its comment; the next assertion's `182` counts the conventions before Indicator and should not move; re-run to find any other pinned count before attributing a failure), and one new test mirrors the Dialog-sheet and StepMeter ones: exact entry fields, `status` and `approval`, exact usages, every revision equal to the live file hash, `historicalRegistry([entry])` empty, `validate(registry)`. With D2 add a receipt test modeled on "Text truncation binds its scoped owner approval". Then `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`. `historicalRegistry` strips only reviewed post-receipt usages, so an unlisted usage fails the receipt tests: that is the intended RED.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts`: `'./molecules/detail-header'` in the barrel module list (`:2125-2126`); `'DetailHeader'` in the runtime names (`:2216-2220`); a new test after the SectionHeader one asserting, from `react-docgen-typescript`: `title` required with `control: 'false'` and a `controlReason`; `level` optional `enum` `1` to `6` default `1` with `control: 'select'`; `newTabText` optional string with its default and `control: 'text'`; `eyebrow`, `lede`, `metadata`, `tags`, `links` and `messages` optional with `control: 'false'` and a reason; native rows `id`, `dir`, `lang`, `aria-describedby`, `className`, `onClick` present; `children`, `role`, `aria-label`, `aria-labelledby`, `style`, `dangerouslySetInnerHTML`, `ref` and `asChild` absent, and the `title` row is the own required prop (its type is not the native `string`); the AST finds sixteen own declarations (nine on `DetailHeaderProps`, three on `DetailHeaderMetadataItem`, two on `DetailHeaderLink`, two on `DetailHeaderMessages`), each with exactly one `@control` and no `@default` on a required prop; the story names equal the eight of §6; `title: 'Molecules/DetailHeader'`; no `argTypes` or `play`; `defaults()` of `useDetailHeader.ts` equals `{ level: '1', newTabText: '(opens in a new tab)' }`; `publicAPI.DetailHeader` is defined while `useDetailHeader`, the eight recipes and `DetailHeaderNativeProps` are not.
- `storybook-controls.test.ts`: `['DetailHeader', 'molecules/detail-header']` (`:56`); `detailheader: { title: false, eyebrow: false, lede: false, level: 'select', metadata: false, tags: false, links: false, newTabText: 'text', messages: false }` after `:464`; `detailheader: 9` (`:854`); a default pin next to `:1692` in the value format the SocialLinks entry shows (read from the first RED run, not guessed); a test after `:2261` asserting required `title`, the `level` options `1` to `6`, no injected args (`args` stays `{}`) and the native rows, with zero diagnostics.
- `.storybook/main.ts`: `documentedNativeProps.detailHeader` as in §2, so docgen documents those native rows and no omitted key.

### 5.3 System artifact

After source, registry and catalog are final: `pnpm artifact --write`, `pnpm system:docs`, then `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system`. Expected diff: a `DetailHeader` component entry (source `packages/ui/src/molecules/detail-header/types.ts`, nine props, `classNameAllows` equal to the six width properties, the eight recipes, `composedOf` from the JSX: Chip, Link and SectionHeader, `parts` empty, `surfaceUsage` empty), `propNaming` +3 (188) with the six reused entries gaining `DetailHeader`, the catalog row, and new `anatomyUtilities` entries. In `design-system-artifact.test.mjs`: add `'DetailHeader'` to the `classNameAllows` inventory (`:265`; the test compares the tagged components with the sorted inventory, so omitting it fails) and one focused test asserting the nine props with types, `required` and defaults, the eight recipe names, the `classNameAllows` width set, `composedOf`, empty `parts` and `surfaceUsage`, the three `proposed` (or `approved` with D2) entries and the six reused entries listing `DetailHeader`. Adapt an expectation only to what the generator derives from the source, never to weaken it. The artifact is 610,264 bytes against 786,432 (shipped-JSON test) and 1,048,576 (artifact test); report any overflow instead of raising a budget. `pnpm build` regenerates the artifact too, so re-check after it.

### 5.4 Catalog

Edit only `scripts/catalog_data.py`, then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. New row after the SectionHeader row (`:67`), written after GREEN and kept honest about what is observed:

```py
("—","—","DetailHeader","molecule","ui","—","SectionHeader, Chip, Link","nuevo","Implemented React molecule under the [approved v0.1 contract](components/detail-header/v0.1/spec.md): passive detail-page header composing SectionHeader with an optional label/value facts list (`time` for dates), static tag Chips and external Links (absolute HTTPS, new tab); native `div` root with no role, DOM order heading, facts, tags, links; no paint, no stylesheet, no ref or asChild. The consumer owns text, dates and localization. Browser and packed-consumer verification remain pending until observed."),
```

### 5.5 Package fixtures

`package-exports.test.mjs`: add `DetailHeader` and `DetailHeaderLink`, `DetailHeaderMessages`, `DetailHeaderMetadataItem`, `DetailHeaderProps` to each inventory that names `CommunityCard` or `SectionHeader`; add `useDetailHeader`, the eight recipe names and `DetailHeaderNativeProps` to the not-exported list; add E1 (§4) and an SSR test (root `div`, exactly one `header`, `dl` with `time`, two `ul role="list"` with their names, links with `target="_blank"`, `rel` and the hidden notice, no `role` on the root, no `style` on DetailHeader-owned elements, deterministic markup, invalid entries dropped). `package-consumption.test.mjs`: typed positive samples of every shape (runs title, `level`, metadata with and without `dateTime`, tags, links, `messages`, `newTabText`), documented `@ts-expect-error` negatives (missing `title`; `children`; `role`; `aria-label`; `style`; `ref`; `asChild`; `level: 7`; a metadata entry without `value`; a link without `href`; the private hook and recipe names), `assertDetailHeaderCSS` over the emitted utilities and the SSR block. No ref, no React-19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Molecules/DetailHeader` keeps autodocs, `Meta<typeof DetailHeader>` with `tags: ['autodocs']`, no manual `argTypes`, no `play`; the meta carries no args (as SectionHeader) and each story supplies its own required `title` and examples, never a documented default such as `level`. English text, example hostnames only (`example.com`, `example.org`), no personal data. The meta JSDoc has `## Description`, `## Dependencies` (SectionHeader, Chip and Link; no Radix) and `## Usage guidelines`: render it inside `main` or `article`, supply exactly one page-level heading, format dates and text in the page language, pass `messages` and `newTabText` on localized pages, note that it paints nothing and that only the root takes `className`.

- `Default`: an editorial post, every part populated (eyebrow, title, lede, a dated fact with `dateTime`, a source fact, three tags, one canonical link).
- `Event`: the principal scenario of VIS-01 (date and place facts, tags, an event link and a recording link).
- `Project`: repository and demo links with status and stack facts.
- `Note`: facts and tags with no links.
- `TitleOnly`: the minimal scenario of VIS-03.
- `Levels`: six title-only headers at levels 1 to 6.
- `Localized`: English override strings for `messages` and `newTabText`, showing the localized names and notice.
- `LongContent`: a long multi-word title, unbroken values, long link labels and many tags, the DH-11 and VIS-02 scenario.

Controls expectations (the registered enhancer, verified in the browser, not inferred from tags): `level` as a select in union order, `newTabText` as text, every other row disabled with its reason pointing to these stories, zero owned diagnostics, no injected argument. Storybook-only utilities, if any story host needs one, must be token-backed and covered by the existing `.storybook/preview.css` wildcard; the package CSS test guards only `types.ts`.

## 7. Changelog entries

Under the existing unpacked sections (S2: 0.11.0 was never packed), not under `## Unreleased`. `packages/ui/CHANGELOG.md`, `## 0.11.0`, `### Added`, appended after the last bullet:

```md
- `DetailHeader` opens a detail page with its title block and metadata. It composes SectionHeader (optional eyebrow, a
  heading at `level`, default 1, and an optional lede) with an optional label/value facts list (`metadata`, where an
  entry may carry a `dateTime` for a native `time`), a named list of static tag pills (`tags`) and a named list of
  external links (`links`: absolute `https:` URLs that open in a new tab with a hidden notice, localizable through
  `newTabText`). The list names are English by default (`Tags`, `Links`) and localizable through `messages`. Blank or
  invalid entries are skipped with a development warning and an unreadable title renders nothing. It paints no
  surface: the host formats dates and text, places it inside `main` or `article` and supplies one page-level heading.
  (#572)
```

`packages/system/CHANGELOG.md`, `## 0.13.0`, `### Added`, appended after the last bullet (this section is the system package's existing unpacked one in the same release set):

```md
- The source-derived artifact and reference include `DetailHeader` (its props, static recipes and `classNameAllows`
  width set) and the `content-metadata`, `content-tags` and `external-links` naming concepts (proposed unless their
  receipt is recorded). (#572)
```

`(#572)` cites a fully resolved issue, as [versioning](../../../distribution/versioning.md) requires for consumer requests; because the entries sit in versioned sections, a later `release:pack` records `resolves` for #572 (the Unreleased exemption does not apply). If the owner narrows the delivery, write `Refs #572` instead (D5). No entry for `@egdev/mcp` 0.4.12, `@egdev/effects` 0.2.12, `@egdev/tokens` or `@egdev/cli`: none changes, so no coupled version moves (S2). This work makes no version bump, `release:pack` or tag.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/molecules/detail-header packages/ui/src/molecules/section-header packages/ui/src/molecules/social-links packages/ui/src/atoms/chip packages/ui/src/atoms/link packages/ui/src/molecules/article-feature --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
git diff --stat <base> -- packages/ui/src/atoms/chip packages/ui/src/atoms/link packages/ui/src/molecules/article-feature packages/ui/src/molecules/page-header packages/tokens packages/ui/src/styles docs/components/article-feature
git diff -U0 <base> -- packages/ui/src/molecules/section-header packages/ui/src/molecules/social-links
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

`<base>` is the HEAD recorded in the evidence file at the start of this lane, so a path that another approved lane changed earlier is outside the check. The first `git diff --stat` must print nothing; the second must show exactly the two P1 hunks. The final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` writes package outputs and regenerates the artifact, so the freshness checks run again after it. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache (D4); it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler. `pnpm test:package-release` is a PRESERVE check on the changelog structure. `pnpm test:mcp` serves the artifact and its README examples drift on releases (S5d): run it on the base first and re-run before attributing any failure. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and run here because `@egdev/system` ships. Record every result per command with exit code and test counts in the evidence file; jsdom, docgen and HTML smoke prove no appearance, focus visibility, contrast on a real host or screen-reader behavior, and none is claimed.

## 9. Browser and capture procedure

Only after separate permission (D3) to start `pnpm storybook` (it builds tokens first) and to use a real Chromium, from a scratch build of `packages/ui` (`dist/styles.css` plus tokens, SSR markup from the built package, no Tailwind compiler) in a `mktemp -d` directory outside the repository. Record browser and version, viewport, device scale, theme (dark), loaded fonts, motion setting, crop and date for every observation, and copy the outputs into `implementation-evidence.md`.

1. **Reflow (DH-11).** At 320, 390 and 1280 CSS px and at 200% and 400% zoom (a 320 px viewport stands for 1280 px at 400%), render a fixture with a long multi-word title, an unbroken 60-character value, a long link label and many tags: `document.documentElement.scrollWidth` does not exceed `clientWidth`, every part keeps `overflow: visible`, nothing is truncated or clipped, and the value and link label wrap. An unbroken **title** is Heading's behavior and outside DetailHeader's recipes: if it overflows, record it as a SectionHeader finding, not a DetailHeader fix.
2. **Order and gaps.** Each part's top edge is non-decreasing in DOM order (eyebrow, title, lede, facts, tags, links); the computed gaps match the proposed recipes; no `order` or reversed flex direction exists.
3. **Contrast (DH-12).** Computed `color` of a term and a value against solid `surface-0` to `surface-3` hosts reproduces the T12 figures; the Link colour (4.61:1 on `surface-0` only, below 4.5:1 on `surface-1` to `surface-3`) and the translucent Grafito host are recorded, not claimed.
4. **Keyboard (DH-10).** Real Tab visits the links only, in DOM order, and the focus ring is Link's own `:focus-visible` shadow.
5. **Accessibility tree.** `heading` level 1 named by the title, `list` named `Tags` and `Links`, description-list terms and definitions, links named with the notice. Real screen-reader output, Safari or WebKit list semantics and the nested-`header` banner mapping outside `main` or `article` stay **Not evaluated**.
6. **Controls (DH-14).** In Storybook: `level` select 1 to 6, `newTabText` text, the other rows disabled with their reasons, no diagnostics.
7. **Captures VIS-01 to VIS-03, only if separately authorized** (Playwright MCP, never part of this plan's approval): `Event` at 1280 px, `Event` at 390 px and `TitleOnly` at 1280 px, device scale 2, dark theme, Barlow and Barlow Condensed loaded, no reduced motion, component-zone crop on a solid `surface-0` host, written under `docs/components/detail-header/v0.1/` with `capture.json` and SHA-256 hashes. They are observed implementation, not approved expected design, until the owner adopts exact hashes. GitHub-visible handoff is a further authorization.

**Visual conformity: Not evaluated.** No capture exists, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English, bodies with `Refs #572`. Every commit passes the pre-commit (Biome, typecheck) and pre-push (`pnpm test`) hooks; RED is observed before the matching implementation and a failing commit is never made.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the DetailHeader core` | P1 exports, `types.ts` (final), the hook core (title gate, level, root), `DetailHeader.tsx` (heading only), `index.ts`, tests T1, T2 and T11; the folder is not yet exported | ≈ 359 |
| 2 | `feat(ui): render the DetailHeader facts, tags and links` | Hook lists (metadata, tags, links, keys, warnings), JSX for the three lists, tests T3 to T5 | ≈ 240 |
| 3 | `feat(ui): localize and protect DetailHeader` | `messages` and `newTabText` fallbacks, protected-prop stripping, tests T6 to T10 | ≈ 250 |
| 4 | `feat(ui): publish DetailHeader with stories and metadata pins` | Stories, barrel, `.storybook/main.ts`, docgen and Controls pins, T12, the export inventories of `package-exports.test.mjs` | ≈ 355 |
| 5 | `chore(integration): register DetailHeader in the registry, catalog and artifact` | Registry entries and usages, `prop-naming.test.mjs`, receipt if D2, catalog row, artifact test, both changelogs, regenerated view, artifact and catalog | ≈ 268 (+55 with D2, ≈ +88 generated) |
| 6 | `test(ui): add the DetailHeader package CSS, SSR and consumer checks` | E1, the SSR test, the `package-consumption.test.mjs` additions | ≈ 211 |
| 7 | `docs(detail-header): record the v0.1 implementation evidence` | `implementation-evidence.md` and the ODD log | ≈ 96 |

The barrel export lands in slice 4. Slice 4 also restores the `package-exports` inventories, but between slices 4 and 5 the artifact is stale (`artifact --check`, `system:check` and `test:artifact` compare the components list with the barrel), while `props:check` and `test:props` stay green; slice 5 restores it. If every commit must be green on all of them, fold slice 5 into slice 4 (≈ 623). If a whole-repo test unexpectedly fails on the unexported folder between slices 1 and 4, merge slices 1 to 4 instead of weakening the test. If slice 1 outgrows the estimate and passes about 400 lines, move T11 into slice 2. The registry steps always follow the final bytes of `types.ts`.

## 11. Estimated changed lines

About **1,780 hand-written changed lines** (range 1,500 to 2,050): component files ≈ 1,033 (`types.ts` 150, hook 155, JSX 60, tests 470, stories 190, `index.ts` 8), P1 6, barrel and `main.ts` 2, docgen, Controls and CSS pins 145, package fixtures 229, registry JSON and test 204, artifact test, catalog source and changelogs 64, evidence and log 96. About 55 more with the D2 receipt, and ≈ 88 generated lines (`docs/prop-naming.md` ≈ 50, `design-system.json` 2, `system.md` ≈ 30, catalog ≈ 6), counted separately and regenerated inside the commit that changes their inputs. For calibration, the StepMeter atom folder (three props, one part) was 786 lines: a 502-line test, 110 lines of stories and 174 lines of source; DetailHeader has nine props and three lists, hence the larger estimate.

## 12. Risks

- **Risk 1 — P1 couples three components.** `useDetailHeader.ts` imports two hook modules of other components. A later rename or behavior change in `normalizeText` or `destination` changes DetailHeader too. Both components' suites must stay unmodified and green; the differential check of §4 proves the base behavior is untouched; the extraction alternative is larger and was not chosen.
- **Risk 2 — Heading ownership.** DetailHeader cannot style SectionHeader. A long unbroken title may overflow because of Heading, not DetailHeader (§9.1); that would be a SectionHeader finding, outside this plan's authority.
- **Risk 3 — Semantics are unobserved.** The `dl` with `div` wrappers, the explicit `role="list"` on a `ul` and SectionHeader's `header` mapping outside `main` or `article` are specified from HTML-AAM, not from a real browser or screen reader (spec block 5). They stay **Not evaluated**.
- **Risk 4 — Link colour.** The neon Link text is documented as 4.61:1 only on `surface-0` and below 4.5:1 on raised surfaces and the translucent host; DetailHeader owns neither the colour nor the host. T12 and §9.3 record it and claim only the colours DetailHeader owns.
- **Risk 5 — No-inline-style claim has a scope.** The composed Link renders Radix VisuallyHidden with its own inline `style` for the hidden notice (`Link.test.tsx:83` asserts `notice.style.position`). T9 therefore asserts no `style` on DetailHeader-owned elements and in `types.ts`, not on the whole subtree; a whole-subtree assertion would fail for a reason DetailHeader cannot change.
- **Risk 6 — Registry coupling.** Every `types.ts` edit invalidates nine usage revisions and the artifact. Hash last, re-hash after any Biome or format change. The pins in `prop-naming.test.mjs` (post-receipt lists, the 188 count) move with the entries.
- **Risk 7 — Parallel lanes, shared files.** The other reading-piece lanes and the Pulso parity lanes also touch `prop-naming.json`, `prop-naming.test.mjs`, `docs/prop-naming.md`, the artifact, `system.md`, `catalog_data.py` with its generated files, both changelogs, `packages/ui/src/index.ts`, `.storybook/main.ts` and the docgen, Controls and package pins. Expect rebase conflicts, and treat every counter as merge-order dependent: 185 to 188 assumes DetailHeader lands alone on this baseline. Regenerate generated files instead of hand-merging, recompute counters from the tree, and re-hash each component's `types.ts` revisions after rebasing.
- **Risk 8 — Artifact budget.** The artifact is 610,264 bytes against the 786,432-byte shipped-JSON test; the sibling lanes also grow it. Report an overflow instead of weakening the test.
- **Risk 9 — Warnings in render.** Like SocialLinks, the warnings fire during render and can fire twice under React StrictMode; tests assert the exact messages, not a call count under StrictMode.
- **Risk 10 — Package harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18.3.1 and 19.3.0 matrix stays pending, which blocks "verified in packed consumers" claims, not the rest.
- **Risk 11 — Proposed visual values.** The gaps and the 12.8 px value step are proposals for VIS-01 and VIS-02 to confirm. If the value text reads too small, the spec's alternative is the existing `text-body-large` (no token). Changing a recipe after the registry hash needs a re-hash.
- **Risk 12 — `test:mcp` drift.** Adding a component to the artifact may touch the MCP README examples that already drift on releases (S5d); run it on the base before attributing a failure.
- **Risk 13 — Unvalidated `dateTime`.** The component neither formats nor validates `dateTime` (spec block 4); an invalid string reaches the `datetime` attribute as supplied. The host owns it.

## 13. Pending owner decisions

No token, dependency, Radix package, Material recipe or stylesheet decision is pending: the recipes were approved with the spec and none is needed.

1. **D1 — Plan approval (G1).** Approve this exact plan, the §2 edit surfaces (including the parent-owned integration files and the two P1 `export` edits) and the §8 commands, or revise it. The spec approval does not cover it.
2. **D2 — Convention receipt (recommended: yes).** Confirm that the owner's answer to OQ-5 may be recorded as the receipt for the three exact entries of §5.1, so the parent records `prop-naming-approval.json` and the entries ship `approved`. The spec table carries every field the convention hash binds except `status` (no alias and no exception are proposed). If declined or unanswered, they ship `proposed` with `approval: null`, as `step-count` does.
3. **D3 — Browser and capture authorization (recommended: yes for §9.1 to §9.6, separate for §9.7).** Starting `pnpm storybook` and a real Chromium are needed for DH-11, the computed parts of DH-10 and DH-12, and the Controls widgets of DH-14. Without D3 those rows stay **Not observed**. Playwright captures VIS-01 to VIS-03 and adopting any capture as expected design are separate decisions.
4. **D4 — Packed consumers (recommended: yes).** `pnpm test:package-consumption` packs and installs isolated fixtures and needs install and network permission and a known cache (offline alternative: `EGDEV_CONSUMER_OFFLINE=1`); without it the React 18.3.1 and 19.3.0 evidence of DH-16 stays **Not observed**.
5. **D5 — Issue citation.** The entries cite `(#572)`, which marks the issue fully resolved. The spec covers the whole request (title block, metadata, tags and links); if the owner reads linkable tags or `external?: false` as leaving it open, write `Refs #572` instead.
6. **D6 — Publishing the snapshot.** The canonical component issue is Pending (the consumer request #572 is only a candidate under the one-issue-per-component rule). Publishing v0.1 as a comment is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1 are listed at the end of §3.

## 14. Stop

This plan authorizes nothing until G1. No source, test, story, token, dependency, registry, artifact, catalog, capture, release or Git action is taken or implied. Stop and return to the owner on any G8 condition, a contradictory result, or a needed edit outside §2.
