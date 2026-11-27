# Breadcrumb v0.1 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, tests, registry write, artifact or catalog regeneration, capture, release or Git action, and approving the spec granted none of them. It also cannot be approved yet: under the spec's OQ-3 resolution, Link `quiet` (#562) must be implemented first (§1 G3). Nothing below is implemented or measured: preparation was read-only (source, test, registry, artifact and changelog reads, digest checks and `git` inspection); no build, test, generator, Storybook, browser or capture ran.
- **Coverage:** S2, S4 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), issue #570 only; this is the plan gate that precedes implementation under T6. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) plan; the new-component sections (integration surfaces, registry, artifact, catalog, slices) follow the [StepMeter v0.1](../../step-meter/v0.1/implementation-plan.md) plan. Commits land on `integration/round-5` and are made by the parent (the writer never switches branches or commits); Round 5 ships as one PR (T7), so the slices exist for review and bisect.
- **Contract authority:** [spec.md](spec.md) v0.1, Approved on 2026-11-26, `contentSHA256: 4de99d12f314f81b57e5d567bc06151443c7de806f2be0f0590607541418c962`, reproduced byte-exact in this working tree by three independent methods with the spec's own rule (payload from the line-start `## 1. Purpose and scope` heading through EOF, LF, final newline: `tail -n +9`, `awk '/^## 1\. Purpose and scope$/{f=1} f'` and a Node slice). Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)", 2026-11-26 (`odd/tasks/round-5-consumer-requests.md` L5), given on the committed draft (`8f50f0b`, payload `1f78dbd47d1f6888456590a104ead1a03671427eb512cdcd67a0a2897b717949`) with the recommended answer to OQ-1 to OQ-7. The cataloging approval is L3. Visual hashes: VIS-01 and VIS-02 are Pending. Resolved decisions this plan carries: the current page is a non-link `span` with `aria-current="page"` derived from the last supplied entry (its `href` is ignored); the separator is `chevron-down` rotated −90°; Link `quiet` is a hard prerequisite; each ancestor anchor is stretched with `self-stretch` inside a `min-h-14` step, claimed only after BC-13 is observed; invalid entries are omitted with development warnings and nobody is promoted; long labels wrap without truncation; no stylesheet, token, dependency, Radix package, naming convention or exception.
- **Prerequisite:** Link `quiet` (#562). Its [v0.5 spec](../../link/v0.5/spec.md) was approved in L5 (draft digest prefix `68420d30`, recorded in L4); its approval record, plan and implementation are separate gates this plan neither reads nor approves. At drafting it is **not implemented**: `LinkVariant` is `'plain' | 'underlined'` (`packages/ui/src/atoms/link/types.ts:74`).
- **Plan identity:** `contentSHA256: f1c2c06aea3029cf562f7098def657e33ee8017382437658fd4d892fcc5ede92` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line through EOF; the metadata above it is excluded, and the match is anchored at the line start because the heading text also appears inline in this metadata. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b` (the draft spec commit). The finalized spec, its approval record and this plan are uncommitted working-tree files at drafting, beside other lanes' uncommitted spec resolutions; no tracked file under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified. Whole-file SHA-256 prefixes, re-verified in this working tree: `packages/ui/src/index.ts` `713d1843…`, `styles/compiled.css` `7c587736…`, `.storybook/main.ts` `30ef22e5…`, `.storybook/preview.css` `b55993fb…`, `atoms/link/types.ts` `850d9f0b…` (equal to the Link spec's reviewed hash and to the `revision` of its registry usages), `atoms/link/useLink.ts` `61765e5b…`, `atoms/icon/types.ts` `81b4efe2…`, `molecules/nav-list/types.ts` `fe91e935…` (precedent), `skills/_shared/prop-naming.json` `ceb95f54…` (185 entries), `scripts/prop-naming.test.mjs` `f2acfd78…`, `storybook-docgen.test.ts` `3705e162…`, `storybook-controls.test.ts` `f7928479…`, `scripts/package-exports.test.mjs` `9b779e24…`, `package-consumption.test.mjs` `de9a624c…`, `design-system-artifact.test.mjs` `51238e62…`, `scripts/catalog_data.py` `041dccd6…` (119 rows), `packages/ui/CHANGELOG.md` `404c5095…`, `packages/system/CHANGELOG.md` `ab828f02…`. `packages/system/design-system.json` is 610,264 bytes with 187 components against the 768 KiB (786,432-byte) budget; `system.md` is 500,426 bytes.
- **Visuals:** VIS-01 and VIS-02 are Pending in the spec: no capture, no hash. This plan produces behavior and computed-style evidence only; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns, and the commands of §8. The spec approval alone grants no code (S6). Approving the plan approves no capture, release or GitHub write. **G1 cannot be granted before G3.**
2. **G2 — Spec provenance and its one limit.** The repository records the owner's verbatim answer (L5) and the draft's digest prefix (L4) but not the question text, so the spec digest binds the bytes derived from the approved draft plus the recommended answers, not a digest the owner quoted ([approval.md](approval.md)). The plan accepts that as provenance; a reviewer who wants an exact-digest confirmation can ask for it before G1. Nothing here upgrades it.
3. **G3 — Prerequisite: Link `quiet` is implemented (spec §6 "Prerequisite order", OQ-3).** Before G1, confirm in the tree: `LinkVariant` includes `'quiet'`, `linkVariants({ variant: 'quiet' })` emits neutral ink with the brand underline, the Link tests pass, and the label-sized type step is known. The current-page text mirrors the **implemented** quiet recipe's family, size, line height and weight and restates none of Link's utilities (today `font-sans text-label-default`, `link/types.ts:82`). If #562 is dropped, loses the underline (the non-colour cue of spec §5) or ends with a type step that breaks BC-12's shared-recipe promise, **stop**: the spec returns as a new version (OQ-3).
4. **G4 — No pending token, dependency, Radix, stylesheet or Material decision.** Every colour, spacing and type utility is token-backed and verified present: `--space-14` (`theme.css:460`, bound by `--spacing-14` at `:595`), `--color-fg-default` (`:73`), `--color-fg-muted` (`:77`), `--text-label-default` (`:255-258`). Nothing is painted behind the trail, so no Material recipe, Surface or flat replacement applies. **No stylesheet**: `breadcrumb.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical (nothing under `packages/*/src` mentions a breadcrumb at drafting). Every utility is a static literal in a CVA string composed per part with `cn()`; no inline style, interpolated class, `@classNameAllows` tag, recipe or hook export, or new AGENTS.md exception. The Tailwind defaults of the spec's §6 inventory are covered by D2.
5. **G5 — Registry.** No new convention and no exception: the approved `accessible-name`, `collection-items` and `navigation-intent` are reused (spec §3). The plan appends four usages (§5.1); no status, approval or receipt changes, and adding a usage approves nothing globally.
6. **G6 — Hit area is proved, not assumed.** Footer found that enlarging the list item alone did not enlarge the hit box. BC-13 measures the stretched anchors in Chromium (D3); if they are not at least 44.8px tall, **stop and return the measurements** (spec OQ-4): another approach needs its own approval.
7. **G7 — Integration ownership.** The barrel line, `.storybook/main.ts`, the docgen, Controls and package pins, the registry JSON and generated view, the artifact, the catalog source and outputs, the changelogs and the evidence file are parent-owned, as in the StepMeter and Carousel plans. A writer touches only the six files in `packages/ui/src/molecules/breadcrumb/`.
8. **G8 — Release and publication stay outside this plan.** Changelog entries go under the existing, never-packed `## 0.11.0` sections (ODD S2, §7): no version bump, `release:pack`, tag, issue comment or snapshot publication, and no coupled version moves because this change touches neither tokens nor cli.
9. **G9 — Stop lines** are listed in §14.

## 2. Exact files to touch (not authorized until G1)

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/molecules/breadcrumb/types.ts` | Writer | `BreadcrumbItem`, `BreadcrumbProps` (the protected `Omit` list), English JSDoc with one `@control` per own declaration and no `@default`; six static CVA recipes (§3) | +100 |
| `packages/ui/src/molecules/breadcrumb/useBreadcrumb.ts` | Writer | Label gate, step derivation, the two entry warnings, protected-key and `ref` stripping, `onNavigate` adapter, complete `Link` props, per-part `cn()` | +130 |
| `packages/ui/src/molecules/breadcrumb/Breadcrumb.tsx` | Writer | JSX only: `nav`, `ol`, one `li` per step, `Link` or the current-page `span`, decorative `Icon` | +30 |
| `packages/ui/src/molecules/breadcrumb/Breadcrumb.test.tsx` | Writer | Cases for BC-01 to BC-10, the unit parts of BC-11 and BC-15, and the BC-16 SSR comparison (§4) | +360 |
| `packages/ui/src/molecules/breadcrumb/Breadcrumb.stories.tsx` | Writer | `Molecules/Breadcrumb`: `Default`, `SingleStep`, `Wrapping`, `OnSurfaces`, `ClientRouting` (§6) | +125 |
| `packages/ui/src/molecules/breadcrumb/index.ts` | Writer | `export { Breadcrumb } from './Breadcrumb'; export type { BreadcrumbItem, BreadcrumbProps } from './types';`; no recipe or hook export (StepMeter precedent) | +3 |
| `packages/ui/src/index.ts` | Parent | `export * from './molecules/breadcrumb';` between `./molecules/attachment-field` and `./molecules/button-group` (baseline lines 48–49) | +1 |
| `packages/ui/src/styles/compiled.css`, `.storybook/preview.css` | none | **No edit expected:** `@source "../molecules/**/types.ts"` (`compiled.css:53`) and `@source "../packages/ui/src/molecules/**/*.stories.tsx"` (`preview.css:19`, `:64`) already scan a new molecule; BC-11 proves emission, and an explicit line is added only if it does not hold | 0 |
| `.storybook/main.ts` | Parent | `documentedNativeProps.breadcrumb`: `['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'style']` after `stepMeter` (baseline 170), NavList's entry (`:117`) minus `onClick` | +1 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | Breadcrumb extraction test after the StepMeter one (baseline 695–770); `'./molecules/breadcrumb'` in the barrel module list (between 2118 and 2119); `'Breadcrumb'` in the runtime names (between 2199 and 2200) | +80 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `['Breadcrumb', 'molecules/breadcrumb']` at the end of the component list (after 137: literal-interning order); `breadcrumb: { label: 'text', items: false, onNavigate: false }` beside `navlist` (477); `breadcrumb: 3` beside `navlist` (852); a retained-rows test modeled on StepMeter's (2109–2124) | +20 |
| `scripts/package-exports.test.mjs` | Parent | `'Breadcrumb'` in the runtime names (5980–5981); `'Breadcrumb'`, `'BreadcrumbItem'`, `'BreadcrumbProps'` in the sorted declaration list (6299–6302) and the positive inventory (6893 onward); built-CSS emission test and package SSR test modeled on StepMeter's (861–973) | +147 |
| `scripts/package-consumption.test.mjs` | Parent | Packed fixtures modeled on StepMeter's (imports 97–98, samples 569–618): positive sample, `@ts-expect-error` negatives; `assertBreadcrumbConsumerCSS` modeled on `assertStepMeterConsumerCSS` (5303, invoked at 5817); `'Breadcrumb'` in the runtime names (5908–5909); SSR assertion near 6401 | +95 |
| `skills/_shared/prop-naming.json` | Parent | Four usages on the three approved entries (§5.1); no new entry | +44 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | generated |
| `scripts/prop-naming.test.mjs` | Parent | Four pairs in `postReceiptUsages` after the StepMeter pair (848–852); one Breadcrumb test modeled on StepMeter's (1717–1763). The pin `actual.length` 185 (2309) is unchanged: no new entry | +55 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Breadcrumb assertion block after StepMeter's (556–626) and `['BreadcrumbItem', 'Breadcrumb']` in the explicit `owners` oracle of "all L9 naming types retain their source and owner" (~1333–1350) | +52 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line (+≈10 KB); ≈ +60 |
| `scripts/catalog_data.py` | Parent | One Breadcrumb row after GaugeGroup (baseline 90, the last molecule row), §5.4 | +1 |
| `docs/CATALOGO.md`, `docs/catalog.json` | Parent, generated | `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`; never hand-edited | +1; +11 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | One bullet each in the existing unreleased sections (§7) | +8; +4 |
| `docs/components/breadcrumb/v0.1/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED and GREEN output, commands with exit codes and counts, browser table, hashes (§9) | +100 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: `packages/ui/src/atoms/link/**` (Link `quiet` belongs to its own lane), `atoms/icon/**`, `molecules/nav-list/**`, `organisms/footer/**`; `packages/tokens/**` (no token), `packages/cli/**`, `packages/effects/**`, `packages/mcp/**` (no mcp changelog entry: it already depends on `@egdev/system` 0.13.0), every `package.json`, the lockfile; `packages/ui/src/styles/**` (the legacy bundle is frozen); other components; the spec and approval record; `scripts/storybook-mcp-exceptions.json` (it lists only component-less stories and composed parts without a story of their own; Breadcrumb has its own).

Work units: **A** (Writer) the six Breadcrumb files, slices C1 and C2, and the stories in C3; **B** (Parent) the integration surfaces, C3 to C6. Registry revisions always follow the final bytes of `types.ts`, so C5 stays after C1 to C4.

## 3. Design of the change

**Anatomy, API, states, accessibility, Radix, Material, compatibility.** Exactly the spec: a `nav.eg-breadcrumb` named by `label` (through `aria-label`) holding one `ol`; one `li` per rendered step; ancestors are the exported `Link` with `variant='quiet'` and `arrow={false}`; the last supplied entry is a `span` with `aria-current="page"`; one decorative `Icon name='chevron-down' size='sm'` after every rendered step except the last rendered one. No Radix package (native `nav`, `ol`, `li`, `a`), no Material, no state and no `data-state`, no ref, no `asChild`, no stylesheet. New molecule: no existing API, class, export or consumer changes. The plan changes no promise.

**`types.ts`** (indicative; the writer's code and JSDoc are reviewed against the approved spec, not against this excerpt; Biome style: single quotes, 120 columns, no trailing commas, `type` never `interface`, no `any`):

```ts
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';

/** One trail step: plain data. ... @control on every field, no @default anywhere */
export type BreadcrumbItem = {
  /** Visible step name, also the accessible name of an ancestor link; blank or non-string omits the entry with a warning. @control text */
  label: string;
  /** Native destination of an ancestor step; never rendered on the last entry; no URL validation. @control text */
  href?: string;
};

export type BreadcrumbProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'aria-label' | 'aria-labelledby' | 'role' | 'dangerouslySetInnerHTML'
> & {
  /** Accessible name of the landmark, never rendered visibly, consumer-owned. @control text */
  label: string;
  /** The trail, ordered from the root to the current page; the last entry is the current page. @control false @controlReason Structured entry data is not a scalar control; see Default and Wrapping. */
  items: BreadcrumbItem[];
  /** Click notification of an ancestor link ... @control false @controlReason Callback functions are not serializable; see ClientRouting. */
  onNavigate?: (item: BreadcrumbItem, event: MouseEvent<HTMLAnchorElement>) => void;
};

export const breadcrumbVariants = cva('eg-breadcrumb min-w-0 wrap-anywhere');
export const breadcrumbListVariants = cva('m-0 p-0 list-none flex flex-wrap items-center gap-x-2 gap-y-1');
export const breadcrumbStepVariants = cva('flex min-h-14 min-w-0 items-center gap-2');
export const breadcrumbLinkVariants = cva('self-stretch');
// Type utilities copied from the implemented Link quiet recipe (G3); today font-sans text-label-default.
export const breadcrumbCurrentVariants = cva('font-sans text-label-default text-fg-default');
export const breadcrumbSeparatorVariants = cva('self-center -rotate-90 text-fg-muted');
```

The type-level JSDoc states the supported `className` surface (root only, outer placement: margin, self-alignment, flex and grid item placement; no width, paint or child override; no part exposes `className`) and no ref, `asChild` or built-in text. No `@classNameAllows` tag is added.

**`useBreadcrumb.ts`** (indicative):

```ts
// Protected at untyped boundaries too: label owns the landmark name and items own the content. ref is dropped because
// React 19 delivers it to function components as a prop (see R-10).
const forbidden = new Set(['children', 'role', 'aria-label', 'aria-labelledby', 'dangerouslySetInnerHTML', 'ref']);
function warn(message: string): void {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') console.warn(message);
}
export type BreadcrumbStep = {
  position: number; // zero-based index in the supplied array: stable across omissions, used as the React key
  label: string;
  stepClassName: string;
  link?: { href: string; variant: 'quiet'; arrow: false; className: string; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void };
  current?: { 'aria-current': 'page'; className: string };
  separatorClassName?: string; // defined for every rendered step except the last rendered one
};
export type UseBreadcrumbResult = { valid: boolean; rootProps: Record<string, unknown> & { 'aria-label': string; className: string }; listClassName: string; steps: BreadcrumbStep[] };
```

Derivation, in the spec's §4 order: (1) `label` must be a non-blank string, else `warn('Breadcrumb requires a non-empty label. Nothing was rendered.')` and `valid: false`; (2) `items` must be an array; (3) classify by supplied position: the last entry is the current page and needs a non-blank string `label`; every other entry is an ancestor and needs that plus a non-empty string `href`; (4) an invalid entry is omitted with exactly one warning, the label check first: `Breadcrumb omitted the entry at index ${index}: it needs a non-blank label.` or `Breadcrumb omitted the entry at index ${index}: an ancestor entry needs a non-empty href.` (0-based supplied index; these are the final strings the spec left to the plan); (5) nothing renders if no entry remains; no ancestor is promoted when the last entry is invalid; (6) separators follow every rendered step but the last rendered one. The hook is the only place that decides these rules; `onNavigate` is adapted per entry with the **original** entry object (`(event) => onNavigate(item, event)`); the root class is `cn(breadcrumbVariants(), className)` and every other part uses `cn(recipe())`.

**`Breadcrumb.tsx`** is JSX only: `valid ? <nav {...rootProps}><ol className={listClassName}>{steps.map(...)}</ol></nav> : null`, with the key taken from the hook's `position` (not a map index), `<Link {...step.link}>{step.label}</Link>` or `<span {...step.current}>{step.label}</span>`, and `<Icon name='chevron-down' size='sm' className={step.separatorClassName} />`. No ARIA literal lives in the JSX.

**Emission inventory.** Every static utility, what it must emit and where it is proved. The exact serialization is recorded by the first run of the emission test; existing pins give the expected shape (`gap-y-1` is pinned as `row-gap: var(--space-1)` at `scripts/package-exports.test.mjs:4072`).

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `min-w-0`, `wrap-anywhere` | `min-width: 0`; `overflow-wrap: anywhere` (pinned at `package-exports.test.mjs:3301`) | BC-11, BC-14 |
| `m-0`, `p-0`, `list-none` | zero margin and padding from the spacing tokens; `list-style-type: none` (pinned at `storybook-css.test.ts:537`) | BC-11 |
| `flex`, `flex-wrap`, `items-center` | `display: flex`; `flex-wrap: wrap`; `align-items: center` | BC-11 |
| `gap-x-2`, `gap-y-1`, `gap-2` | `column-gap` 6.4px, `row-gap` 3.2px, `gap` 6.4px, all from `--space-2` and `--space-1` | BC-11, BC-13, BC-14 |
| `min-h-14` | `min-height` from `--space-14` (44.8px) | BC-11, BC-13 |
| `self-stretch`, `self-center` | `align-self: stretch` (pinned at `:5500`); `align-self: center` | BC-11, BC-13 |
| `font-sans`, `text-label-default` | family; size, line height and weight from `--text-label-default*` | BC-11, BC-12 |
| `text-fg-default`, `text-fg-muted` | `color` from `--color-fg-default` and `--color-fg-muted` | BC-11, BC-12 |
| `-rotate-90` | a `rotate` declaration of a negative quarter turn. **New in the shipped CSS:** only the group-data variant is pinned today (`package-consumption.test.mjs:6192`), so the serialization is recorded by the first run | BC-11, BC-15 |

## 4. Test-first sequence

Public interface only: roles and accessible names, `userEvent`, no complete class strings, no `data-testid`. Fixtures use hash destinations (`#home`) so jsdom's navigation stub stays silent. Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded verbatim (command, exit code, counts) in the evidence file. A new component has no jsdom RED before its files exist and a stub would be a dummy file, so R1 fails at import and each later row fails on an assertion after the previous minimal GREEN. Rows marked **guard** pass on their first run and claim no RED. Browser-only rows have no jsdom-expressible failure: their probes are written first, fail against the baseline build, and their computed values become the evidence.

**RED to GREEN per acceptance criterion.**

| Step | AC | RED test (file → case) | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- | --- |
| R0 | BC-17 baseline | No edit. The existing Link, Icon and NavList test files, `storybook-docgen`, `storybook-controls`, `storybook-css`, `props:check`, `test:props`, `artifact --check`, `system:check`, `test:artifact`, `test:system`; plus the G3 go/no-go read | **PRESERVE, no RED.** All green; record the counts. A Link without `'quiet'` stops the work (G3) | Same commands green after every step |
| R1 | BC-01 | `Breadcrumb.test.tsx`: `getByRole('navigation', { name })` with `eg-breadcrumb`; the list is an `OL`; one `listitem` per step; `nav.querySelector('[role]')` null; `textContent` equals the joined labels; `rerender` with a second English wording leaves no string behind; `renderHook(useBreadcrumb)` result shape | Whole file fails at import (`./Breadcrumb`, `./useBreadcrumb`, `./types` unresolved) | C1 focused run green |
| R2 | BC-02, BC-03 | Ancestors: link roles, names, `href`, order; no `svg` in a link, no `target`, `rel` or new-tab text; the link carries every class of `linkVariants({ variant: 'quiet' })`; hook result has `variant: 'quiet'` and `arrow: false`. Current page: `span` with `aria-current="page"`, exactly one `[aria-current]`, not a link, no `tabindex`, last `href` ignored; single step | After R1's minimal GREEN (landmark, list, labels as plain text): no links and no `aria-current` render, then the class equality fails until the hook passes `variant='quiet'` and `arrow={false}` | Green; `pnpm typecheck` proves `'quiet'` compiles |
| R3 | BC-04 | Separator count equals rendered steps minus one (including a single step and an omitted current page); each `svg` is `aria-hidden="true"` and `focusable="false"`; `queryByRole('img')` null; link names equal their labels; landmark text equals the joined labels | No separators until rendered | Green |
| R4 | BC-05, BC-06 | `it.each` over a blank, whitespace-only or non-string `label`; an ancestor without a string or with an empty `href`; a non-object entry; an invalid last entry (nobody promoted, no `aria-current`); empty, non-array and all-invalid `items`; exact warning strings and indexes through a `console.warn` spy; an empty array warns nothing; a blank `label` warns exactly once and renders nothing, a later valid `rerender` renders | Invalid entries render as anchorless or empty steps and no warning is emitted until validation exists | Green (C2) |
| R5 | BC-07, BC-08 | `userEvent.click` and `{Enter}` call `onNavigate` once with the same entry reference and `expect.objectContaining({ type: 'click' })`; no `preventDefault` leaves `defaultPrevented` false, calling it makes it true; the current page calls nothing; `userEvent.tab()` visits ancestors in order, skips the current page and separators, Shift+Tab reverses, no `tabindex`, role or key handler | `onNavigate` is never called until the adapter exists. BC-08 is a **guard** (native order, passes at once) | Green |
| R6 | BC-09 | `className` merges last on the root and the marker survives, no part receives a consumer class; `id`, `data-*`, `aria-describedby` and `lang` reach the root; untyped `role`, `aria-label`, `aria-labelledby`, `children`, `dangerouslySetInnerHTML` and a `ref` object are dropped (the ref stays null); `expectTypeOf` and documented `@ts-expect-error` lines reject those keys, `asChild` and `ref` by type | The protected keys reach the DOM until the hook strips them; the `@ts-expect-error` lines are reported unused by `pnpm typecheck` until the `Omit` list exists | Green; `pnpm typecheck` clean |
| R7 | BC-10 | `rerender` appends an entry: the previous last step becomes a link, the single `aria-current` moves to the new last entry, none is stale, focus on a surviving link stays | **Guard** (derived data, no state) | Green |
| R8 | BC-11 and BC-15 (unit parts) | `toHaveClass` on the §3 inventory for each part; no `style` attribute; no `transition-`, `animate-`, `shadow`, `bg-` or `border` utility on any Breadcrumb part; exactly the six recipes carry classes | **Guard** for utilities present since `types.ts`; RED only for any not yet present | Green |
| R9 | BC-16 (SSR) | `renderToStaticMarkup(<Breadcrumb … />)` equals the client container markup | **Guard** (no ids, no effects) | Green |
| R10 | BC-16 (metadata) | The docgen and Controls pins of §5.2 first: Breadcrumb extraction test, module list, runtime names, story names, `breadcrumb` expected map, count 3, retained-rows test | Barrel lists differ from the real barrel; native-prop assertions fail until `documentedNativeProps.breadcrumb` exists; Controls fail until the stories exist | Green; zero owned diagnostics |
| R11 | BC-11, BC-16 (package) | `package-exports.test.mjs` after `pnpm build` of the baseline: export lists, built-CSS emission of every static utility read from `types.ts`, package SSR | `Breadcrumb` undefined in the package until the barrel line. The emission test fails at reading `types.ts` before C1 and is then partly a **guard**: most utilities already ship (`wrap-anywhere`, `self-stretch`, `list-none`, `min-h-14`); bare `-rotate-90` does not | Green after `pnpm build` |
| R12 | BC-16 (packed) | `package-consumption.test.mjs`: positive sample, `@ts-expect-error` negatives, consumer CSS assertion, SSR runtime assertion | Fails against the baseline packed build; needs D4 | Green on React 18.3.1 and 19.3.0 when authorized |
| R13 | BC-12, BC-13, BC-14, BC-15 | Scratch browser probes (§9), written first | The probe cannot find `Molecules/Breadcrumb` on the baseline build; needs D3 | Computed values recorded in the evidence file |
| R14 | BC-16 (registry) | `prop-naming.test.mjs` first: four pairs in `postReceiptUsages` and the Breadcrumb test; then `props:check` | Usage assertions fail until the four usages exist; `props:check` is stale until `types.ts` is hashed | `props:docs`, `props:check`, `test:props` green |
| R15 | BC-16 (artifact) | `design-system-artifact.test.mjs`: the Breadcrumb block and the `owners` entry first | No Breadcrumb entry in the committed artifact until regenerated; the `owners` oracle fails against a regenerated artifact that lacks its `BreadcrumbItem` key | `artifact --write`, `system:docs`, then the checks green |
| R16 | BC-17 | The Link, Icon and NavList test files unmodified; barrel diff of exactly one added line; the scope diff of §8 | **PRESERVE, no RED** | Green; diff empty |

Coverage check: BC-01 to BC-17 each appear in at least one row. **PRESERVE:** no shared parser or helper changes, so no differential beyond R16 is needed; the molecules `@source` glob only scans one more file, and the built-CSS selector inventory before and after must differ by additions only.

GREEN order: `types.ts` → `useBreadcrumb.ts` → `Breadcrumb.tsx` → `index.ts` → focused runner → stories → barrel and `.storybook/main.ts` → docgen, Controls and package pins → catalog → artifact → packed-build checks → registry → artifact again → changelogs.

## 5. Registry, docgen, artifact and catalog obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Append, never reorder, four usages at the end of the `usages` arrays of the approved entries, each `status: "existing"`, after `types.ts` is final and `pnpm lint` is clean on it:

| Entry | `component` | `type` | `symbol` |
| --- | --- | --- | --- |
| `collection-items` | `Breadcrumb` | `BreadcrumbItem[] (required; ordered from the root to the current page)` | `BreadcrumbProps` |
| `accessible-name` | `Breadcrumb` | `string (required navigation landmark name)` | `BreadcrumbProps` |
| `accessible-name` | `BreadcrumbItem` | `string (required)` | `BreadcrumbItem` |
| `navigation-intent` | `Breadcrumb` | `(item: BreadcrumbItem, event: MouseEvent<HTMLAnchorElement>) => void` | `BreadcrumbProps` |

All four carry `source: { "path": "packages/ui/src/molecules/breadcrumb/types.ts", "symbol": …, "revision": "sha256:<whole-file SHA-256 of the final types.ts>" }`, the same hash. Hash only after `types.ts` is final; any later edit, even formatting, requires re-hashing. The `type` strings are plan-authored, following the entry-type wording of `FooterNavigationItem` and `SocialLinkItem`. Then `pnpm props:docs` (regenerates `docs/prop-naming.md`, never by hand), `pnpm props:check`, `pnpm test:props`. No approval JSON and no `postReceiptProposals` entry: there is no new convention or exception.

In `scripts/prop-naming.test.mjs`: append the pairs `{ conventionId, source: 'packages/ui/src/molecules/breadcrumb/types.ts#BreadcrumbProps' }` for the three entries and `…#BreadcrumbItem` for `accessible-name` to `postReceiptUsages` (`historicalRegistry` strips only reviewed post-receipt usages, so an unlisted usage fails the receipt tests: that is the intended RED), and add one Breadcrumb test modeled on StepMeter's: the three entries stay `approved`, each gains exactly the usages above, every usage of the file carries the live whole-file revision (`own.length === 4`), and `historicalRegistry` strips them. Re-run to find any other pinned count before attributing a failure; none is pinned for these three entries today.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts`: the extraction test asserts `label` required `string` with `control: 'text'`; `items` required with `control: 'false'` and a `controlReason` matching `/see /`; `onNavigate` optional with `control: 'false'` and a reason; `defaultValue: null` and no `@default` tag on all three; the native rows `id`, `title`, `dir`, `lang`, `aria-describedby`, `className`, `style` defined; `children`, `role`, `aria-label`, `aria-labelledby`, `dangerouslySetInnerHTML`, `ref`, `asChild`, `variant`, `size` and `tone` absent. The AST: every property signature in `types.ts` (three on `BreadcrumbProps`, two on `BreadcrumbItem`) carries exactly one valid `@control`, and `BreadcrumbProps` declares `label`, `items`, `onNavigate` in that order. `Breadcrumb` is public; the six recipes and `useBreadcrumb` are not, and `index.ts` matches no `Variants` or `useBreadcrumb`. The story names equal the five of §6, with no `argTypes` or `play`. The barrel module list and runtime names gain the Breadcrumb entries at the anchors of §2.
- `storybook-controls.test.ts`: the component list, expected map, own-prop count and retained-rows test of §2; `args` stays `{}`, no table default, native rows equal to the unenhanced ones. Breadcrumb has no `@default`, so the defaults `it.each` (baseline 1638) gets no row.
- `.storybook/main.ts`: `documentedNativeProps.breadcrumb` makes docgen show the curated native rows.

### 5.3 System artifact

After source, registry and catalog are final: `pnpm artifact --write`, `pnpm system:docs`, then `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system`. Expected diff: `components` 187 → 188 with a `Breadcrumb` entry (`package` `@egdev/ui`, `source` `packages/ui/src/molecules/breadcrumb/types.ts`, props `items`, `label`, `onNavigate`, six recipes attributed to Breadcrumb, `composedOf` `Icon` and `Link` from `Breadcrumb.tsx`, `parts` and `surfaceUsage` empty, **no** `classNameAllows`); `types` gains `BreadcrumbItem` with owner `Breadcrumb` (the builder infers it: the usage's component starts with the only component name in that source); `propNaming` lists `Breadcrumb` under the three entries and `BreadcrumbItem` under `accessible-name`; `catalog` +1; new `anatomyUtilities`. The new assertion block checks exactly that (props, no protected rows, the recipe classes of §3, `Object.hasOwn(entry, 'classNameAllows') === false`, the three reused entries still `approved`). The `owners` oracle must list `['BreadcrumbItem', 'Breadcrumb']`: it is the independent check of the builder's owner inference and fails for any registry naming type it does not list. The artifact tests also require `components` to equal the barrel exports and `catalog` to equal the `ui` and `effects` rows of `docs/catalog.json`, so barrel, catalog and artifact change in the same commit (§10). Size: 610,264 bytes plus roughly 10 KB against 786,432; six new components share this budget in Round 5, so report any overflow instead of weakening the test (`design-system-artifact.test.mjs:1300-1317`; a looser one-MiB check also sits at `:1321`). `pnpm build` regenerates the artifact too, so recheck `pnpm artifact --check` after it.

### 5.4 Catalog

Edit only `scripts/catalog_data.py`, then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. New row after GaugeGroup, written after GREEN and kept honest about what is observed:

```py
("—","—","Breadcrumb","molecule","ui","— (native nav, ordered list and links)","Link, Icon","nuevo","Implemented React molecule under the [approved v0.1 contract](components/breadcrumb/v0.1/spec.md): named navigation landmark with an ordered trail of Link `quiet` ancestors, the current page as plain text marked `aria-current=\"page\"` and decorative chevron separators; the consumer supplies localized entries ordered from the root to the current page and invalid entries are omitted with a development warning. Wraps instead of truncating; no router integration, ref, asChild or stylesheet. Browser and packed-consumer verification remain pending until observed."),
```

### 5.5 Package fixtures

`package-exports.test.mjs`: the emission test reads every static string passed to `cva` in `types.ts` through the TypeScript AST (StepMeter's method, `:861-973`) and asserts each non-`eg-` utility has a rule in `@layer utilities`, plus the geometry and `-rotate-90` declarations; it asserts the shipped CSS never mentions `eg-breadcrumb` (no stylesheet, no marker rule). The SSR test renders the built package export with `renderToString` and JSDOM: `nav.eg-breadcrumb` with its `aria-label`, `ol > li` count, link `href`s, exactly one `span[aria-current="page"]`, `svg[aria-hidden="true"][focusable="false"]` separators, and `''` for a blank label (warning silenced, not asserted); `breadcrumbVariants` and the other five recipes and `useBreadcrumb` are `undefined` on the export. `package-consumption.test.mjs`: typed positive sample with a typed `onNavigate`, one documented `@ts-expect-error` negative each for a missing `label`, a missing `items`, `role`, `aria-label`, `aria-labelledby`, `children`, `dangerouslySetInnerHTML`, `ref`, `asChild` and an item with a numeric `label`; the private recipes and hook absent from the root types; `assertBreadcrumbConsumerCSS` with the same selectors; a runtime SSR assertion. No ref and no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Molecules/Breadcrumb`, `Meta<typeof Breadcrumb>` with autodocs, meta `args: { label: 'Breadcrumb', items }` (required props only; `Default` replaces nothing), no manual `argTypes`, no `play`; every story is English, typed `Story`, uses hash destinations and composes only exported DS pieces (`Surface`, `Stack`). The JSDoc has `## Description`, `## Dependencies` (Link `quiet` and Icon; no Radix) and `## Usage guidelines` (the host builds the trail, owns route titles, locale and wording, keeps the order from the root to the current page and gives each landmark on the page a distinct name; invalid entries are omitted with a development warning; no truncation; `className` supports outer placement only; use NavList, TopBar or SectionNav for navigation that is not a trail).

- `Default`: "Home / Editorial / Post title" (VIS-01).
- `SingleStep`: one entry, the current page only, with no link and no separator.
- `Wrapping`: long labels and many steps inside a token-sized host `w-full max-w-[calc(var(--space-24)*5)]` (384px under default tokens, scanned by the existing preview `@source` glob, preview build only and proving nothing for the package), so a 320 to 390px viewport shows the wrapping rows and the wrapping current page (VIS-02).
- `OnSurfaces`: the trail on `Surface` tones `surface-0` to `surface-3`, the BC-12 contrast board.
- `ClientRouting`: documents `onNavigate` with the unmodified-primary-click guard and `preventDefault` (no router dependency), reporting through `action('onNavigate')`.

Controls: the registered enhancer shows `label` as text and `items` and `onNavigate` as disabled rows with their reasons, injects no argument, and the Docs table fabricates no default. The real widgets are verified in the browser (§9), not inferred from tags.

## 7. Changelog entries

Entries go under the **existing, never-packed sections of the 0.11.0 release** (ODD S2), at the top of each `### Added` list, whose bullets run from the newest request to the oldest. In `@egdev/system` that section is **`## 0.13.0`**, not its older, already-released `## 0.11.0` (the #547 fix). No `mcp`, `effects`, `cli` or `tokens` entry and no version move.

```md
<!-- packages/ui/CHANGELOG.md, ## 0.11.0, ### Added -->
- `Breadcrumb` shows where the reader is on a detail page: a named navigation landmark (required `label`) holding an
  ordered trail of `items`, where every ancestor is a link (`href`, optional `onNavigate`) and the last entry is the
  current page, plain text marked `aria-current="page"`, with decorative chevrons between steps. The consumer supplies
  the entries ordered from the root to the current page and the wording and language of `label` and every entry label;
  invalid entries are omitted with a development warning. Long trails wrap instead of truncating, and Breadcrumb adds
  no routing, ref or `asChild`. (#570)
```

```md
<!-- packages/system/CHANGELOG.md, ## 0.13.0, ### Added -->
- The source-derived artifact and reference include `Breadcrumb` (its `items`, `label` and `onNavigate` props, the
  `BreadcrumbItem` entry type and its static recipes) and its usages of the approved `accessible-name`,
  `collection-items` and `navigation-intent` conventions. (#570)
```

Because these are versioned sections, the next `pnpm release:pack` collects `(#570)` into `release.json` `resolves` ([versioning](../../../distribution/versioning.md)); earlier plans used `## Unreleased`, which that command ignores. Use `Refs #570` instead if the owner does not consider #570 resolved (D6).

## 8. Checks to run

After G1, from the repository root, foreground, one at a time; the baseline (R0) first, then the focused commands after each GREEN step:

```sh
pnpm exec vitest run packages/ui/src/molecules/breadcrumb --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/atoms/link packages/ui/src/atoms/icon packages/ui/src/molecules/nav-list --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/tokens packages/cli packages/effects packages/mcp/src packages/ui/src/styles packages/ui/src/atoms/icon packages/ui/src/molecules/nav-list packages/ui/src/organisms/footer
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
pnpm test:cli
pnpm storybook-build
git status --short
```

The scope `git diff --stat` must print nothing (and `packages/ui/src/atoms/link` must show only the Link lane's own change set, empty once that lane is committed); the final `git status --short` must list only §2 paths and the parallel lanes' files: no scratch, cache or `.playwright-mcp/` output. `pnpm build` writes package outputs and regenerates the artifact. `pnpm test:package-consumption` packs and installs isolated fixtures and needs D4 (offline alternative: `EGDEV_CONSUMER_OFFLINE=1`); it must exercise React 18.3.1 and 19.3.0 with the shipped tokens and UI CSS and no Tailwind compiler. `pnpm test:package-release` is a PRESERVE check on the changelog structure. `pnpm test:mcp` has recorded README example drift after artifact changes (T4, `odd/tasks/round-5-consumer-requests.md` S5d): re-run it on the base before attributing any failure, and report a drift as a parent-owned fix outside §2. `scripts/storybook-mcp.test.mjs` needs a docs-only Storybook server and stays outside this list unless D3 covers it. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens tests, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and run here because `@egdev/system` ships. Every result is recorded per command with its exit code and test counts in the evidence file; jsdom, docgen and HTML smoke prove no appearance, focus visibility, contrast or screen-reader behavior, and none is claimed.

## 9. Browser procedure (D3)

Only with separate permission to start `pnpm storybook` (it builds tokens first) or a scratch build of `packages/ui` in a `mktemp -d` directory outside the repository, and to use Playwright MCP, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion setting, crop and date for every observation. Stories: `molecules-breadcrumb--default`, `--single-step`, `--wrapping`, `--on-surfaces`, `--client-routing`.

1. **BC-12 computed style.** On `OnSurfaces`, the link steps and the current step share family, size, line height and weight; the current text computes `rgb(255, 255, 255)` and keeps at least 4.5:1 on `surface-0` to `surface-3` (the Link spec's hand-computed 18.26, 17.02, 15.50 and 13.55); ancestors show `text-decoration-line: underline` at rest and the current page `none`.
2. **BC-13 hit areas (G6).** At 1280 and 390px in `Default` and `Wrapping`, each ancestor anchor's box is at least 44.8px tall and at least 24px wide for the sample labels, with at least 25.6px between adjacent targets (6.4 + 12.8 + 6.4). If not, stop and return the measurements.
3. **BC-14 reflow.** At 320 and 390px with long labels and many steps: rows wrap, a long label wraps inside its step, `scrollWidth <= clientWidth` on the story container, and no Breadcrumb part computes a clipping `overflow`.
4. **BC-15 motion and focus.** Under `prefers-reduced-motion: reduce` Breadcrumb parts compute no transition; a real Tab onto an ancestor shows Link's focus ring. **Record the ring's box:** it follows the stretched anchor (about 44.8px tall), as Footer's links do (R-2).
5. **Controls and accessibility tree (BC-16).** `label` text; `items` and `onNavigate` disabled with their reasons; no diagnostics and no fabricated default; the tree exposes a named `navigation`, a `list` with one `listitem` per step, links and one text node with `aria-current`. Real screen-reader output, right-to-left rendering, forced-colours rendering and protan and deutan simulation stay **Not evaluated** (spec §5).
6. **Captures VIS-01 and VIS-02**, only if separately authorized: component-zone PNGs of the story root under `docs/components/breadcrumb/v0.1/`, named for example `default--three-steps--1280x900--dark.png` and `wrapping--long-labels--390x844--dark.png`, with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, never expected design until the owner adopts the exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture exists and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English; bodies use `Refs #570`. Each commit passes the pre-commit Biome and typecheck hooks and the pre-push `pnpm test`, and generated files are regenerated inside every commit that changes their inputs.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| C1 | `feat(ui): add the Breadcrumb molecule core (#570)` | `types.ts`, the core of `useBreadcrumb.ts` (label gate, steps, separators, `Link` props), `Breadcrumb.tsx`, `index.ts`, tests R1 to R3; folder not yet exported | ≈ 358 |
| C2 | `feat(ui): validate Breadcrumb data and protect its semantics (#570)` | Hook warnings, omission rules, `onNavigate` adapter, protected-key and `ref` stripping; tests R4 to R9 | ≈ 265 |
| C3 | `feat(ui): publish Breadcrumb with stories, metadata pins and its catalog row (#570)` | Stories, barrel, `.storybook/main.ts`, docgen and Controls pins, the export-list pins of both package suites, catalog row, regenerated catalog and artifact | ≈ 236 (+≈ 75 generated) |
| C4 | `feat(ui): add the Breadcrumb packed-build checks (#570)` | Package-exports emission and SSR tests, package-consumption fixtures, CSS and SSR assertions | ≈ 234 |
| C5 | `feat(ui): register the Breadcrumb naming usages (#570)` | Four registry usages, `prop-naming.test.mjs`, artifact assertions and the `owners` entry, regenerated view and artifact | ≈ 151 (+≈ 15 generated) |
| C6 | `docs(breadcrumb): record the v0.1 implementation evidence and changelog (#570)` | `implementation-evidence.md`, both changelog bullets, the ODD log, and `capture.json` with PNGs only if authorized | ≈ 118 |

The export-list pins of both package suites must change in the same commit as the barrel line (C3), or the inventory tests fail. If the test file outgrows the estimate and C1 would pass about 400 lines, move R3 into C2. If a whole-repo test unexpectedly fails on the unexported folder between C1 and C3, merge C1 to C3 instead of weakening the test. The registry commit always follows the final bytes of `types.ts`. A failing RED commit is never made.

## 11. Estimated changed lines

About **1,445 changed lines**: ≈ 1,362 hand-written (component files ≈ 388, `Breadcrumb.test.tsx` ≈ 360, integration tests and fixtures ≈ 449, registry JSON, catalog source, changelogs, evidence, log, barrel and `main.ts` ≈ 165) and ≈ 85 generated (`docs/prop-naming.md` ≈ 10, `system.md` ≈ 60, `catalog.json` 11, `CATALOGO.md` 1, plus one minified `design-system.json` line). The range is 1,200 to 1,550. For calibration, the StepMeter plan estimated ≈ 1,250 hand-written lines for an atom plus a documentation amendment.

## 12. Risks

- **R-1 — Link `quiet` is the foundation.** The type-step mirroring, the underline cue and `LinkVariant` itself come from a lane that is not implemented. A different recipe than expected, a dropped underline or a late `Link` `types.ts` edit invalidates BC-02, BC-12 and the mirrored current-page utilities: read the implemented recipe at G1 and stop if it breaks the spec (G3).
- **R-2 — Stretch and focus ring.** `self-stretch` must make the anchor itself 44.8px tall (G6). A consequence to record: Link's focus ring (`--shadow-focus`, `focus-visible:rounded-sm`) follows the stretched box, so a focused ancestor shows a tall ring around 13px text, as Footer's links do. If that reads badly it is an appearance question for the VIS captures, not a promise of this spec.
- **R-3 — Emission and cascade.** Most utilities already ship and are pinned (`wrap-anywhere`, `self-stretch`, `list-none`, `min-h-14`, `m-0`, `p-0`), but bare `-rotate-90` does not ship and `gap-x-2` is not pinned today. BC-11 proves emission through the molecules `@source` glob; if a utility is missing, the fix is an explicit `compiled.css` line, which G7 covers, never an inline style or a stylesheet.
- **R-4 — Physical rotation and list semantics.** The −90° separator does not mirror in right-to-left hosts, and `list-style: none` with `display: flex` on `li` may drop list semantics in WebKit. Both are Not evaluated by the spec; BC-01 forbids a role override, so no `role="list"` workaround may be added without a spec change.
- **R-5 — Registry freshness chain.** Four revisions bind the final bytes of one `types.ts`; a late JSDoc, formatting or Biome autofix stales `props:check`, `test:props` and the artifact until the order is repeated: finish source, lint, hash, registry, regenerate, check.
- **R-6 — Parallel lanes, shared files.** Prose, EmptyState, DetailHeader, Pagination and Embed, plus the Link and Footer amendments, touch the same barrel, sorted pin lists, registry, generated view, artifact, `system.md`, catalog and both changelogs: expect rebase conflicts. Regenerate generated files after rebasing, never hand-merge them, and re-hash `types.ts` revisions.
- **R-7 — Artifact budget.** 610,264 of 786,432 bytes today with six new components in the round; report any overflow instead of weakening the test.
- **R-8 — `test:mcp` README drift.** README example hashes derive from the artifact; a failure is a parent-owned T4 fix, outside §2.
- **R-9 — StrictMode warnings.** The warnings fire in render and can fire twice under React StrictMode; tests assert exact messages, not call counts.
- **R-10 — Spec wording nits, no change requested.** (a) §3 lists four keys in NavList's `Omit` list while BC-09 says five are rejected by type: the plan adds `dangerouslySetInnerHTML` to the list. (b) "No ref (NavList precedent)": NavList does not drop an untyped `ref`, so React 19 would attach it while React 18 would not; the plan drops it in the hook, as StepMeter does, so both behave alike.
- **R-11 — Plan-level choices a reviewer can veto at G1.** A non-array `items` renders nothing and warns nothing (the spec says only that an empty array warns nothing); a non-object entry is treated as a blank label (the label message); a whitespace-only `href` is a non-empty string and is forwarded (no URL validation); the current-page and `Link` props come from the hook; the React key is the hook's `position` (the supplied index) so no map index reaches the JSX.
- **R-12 — Permissions.** Browser observations (D3) and the packed React 18.3.1 and 19.3.0 matrix (D4) stay **Not observed** until separately authorized and run; types, SSR and docgen output are not a substitute.
- **R-13 — Visual conformity.** No expected-design source exists; VIS-01 and VIS-02 stay Pending and conformity Not evaluated.

## 13. Pending owner decisions

No token, dependency, Radix, Material or naming-convention decision is pending.

1. **D1 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. It cannot be granted before Link `quiet` is implemented (G3). The spec approval does not cover it.
2. **D2 — Confirm one reading.** Spec §6 says that "precedent is not approval, so the owner confirms" the Tailwind defaults of its inventory (`flex-wrap`, `list-none`, `wrap-anywhere`, `-rotate-90`, `self-stretch`, `self-center`) "when approving this spec". The L5 answer is the only approval on record and OQ-1 to OQ-7 do not name them, so the plan treats them as covered by the approved spec and asks the owner to confirm that reading at G1. They carry no colour, spacing or font value; precedents are NavList, Footer, Tabs and ProjectCard.
3. **D3 — Browser authorization.** Starting `pnpm storybook` (or a scratch build) and using Playwright MCP are needed for BC-12 to BC-15 and the Controls widgets. Without it those rows stay **Not observed** and the ring and hit-area questions of R-2 stay open.
4. **D4 — Packed consumers.** `pnpm test:package-consumption` needs install and network permission and a known cache; without it BC-16's React 18.3.1 and 19.3.0 evidence stays **Not observed**.
5. **D5 — Captures VIS-01 and VIS-02.** A separate authorization, with the story as the source; adopting any capture as expected design is a further owner decision.
6. **D6 — Issue citation.** The entries cite `(#570)`, which marks the issue fully resolved and, because they sit in versioned sections, feeds `resolves` at the next pack. Write `Refs #570` instead if the owner does not read the request as resolved by this component.
7. **D7 — Publishing the snapshot.** The canonical component issue for Breadcrumb is chosen by the parent at handoff; publishing v0.1 as an issue comment is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1 are listed in R-10 and R-11.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, capture, release or Git action is taken or implied. Stop and return the evidence to the owner if: Link `quiet` is absent, loses the underline or changes the type step (G3); the stretched anchors are shorter than 44.8px or the focus ring or wrapping behavior contradicts the spec's arithmetic (G6); a utility does not emit from the molecules glob and an explicit `compiled.css` line does not fix it; an existing Link, Icon, NavList or Footer case must change to pass; a token, dependency, stylesheet, inline style, `!important`, Radix package, role override or new naming convention would be needed; `props:check` fails for a reason other than stale revisions; docgen or Controls report diagnostics; the artifact exceeds 768 KiB or its diff shows sections this plan does not expect; or a whole-repo test fails on the unexported folder and cannot be fixed without weakening it.
