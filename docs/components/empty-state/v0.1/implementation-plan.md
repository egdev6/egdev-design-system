# EmptyState v0.1 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, test, registry write, generated file, catalog, token, dependency, capture, release, Git or GitHub action. Nothing below is implemented or measured: preparation was read-only inspection and digest checks; no build, test, generator, Storybook, browser or capture ran.
- **Coverage:** S4 (#573) at the plan gate of T6 in [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), the new `EmptyState` molecule only; the other ten round 5 specs have their own plans. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) plan; the new-component integration obligations (barrel, native-prop pins, built-CSS and packed-consumer checks, registry usages) follow the [StepMeter v0.1](../../step-meter/v0.1/implementation-plan.md) plan. Commits land on `integration/round-5` (the parent commits; the writer never switches branches or commits) and cite `Refs #573`, never `Closes`; the PR is T7's.
- **Contract authority:** [spec.md](spec.md) v0.1, Approved on 2026-11-26, `contentSHA256: c38e35f3667f61abd162ae02431c612afcaeef13177116428caa678122219e36`, reproduced byte-exact in this working tree by two independent methods with the spec's own rule (payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline; the same heading text also appears inline in the metadata, so an anchored match is required: `awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`). Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)", 2026-11-26, given on the committed draft (`8f50f0b`, payload `71e70809fac5739a630230b0a7fe632eada6c7ef5af72c6eb9a50fca84cf62f3`) with the recommended answers to OQ-1 to OQ-5 (`odd/tasks/round-5-consumer-requests.md` L5); cataloging approval L3. Visual hashes: VIS-01 Pending. Recover and compare the digest again before any edit; a different digest stops the work. Resolved decisions this plan carries: the no-paint recipe; `level` 2 to 6, default 3, any other value silently 3; `actions` optional, exactly one Button or Link, rendered unchanged; `icon?: IconName` rendered at `lg` in an `aria-hidden` wrapper; a blank `title` warns in development and renders nothing; no live region and no focus move; no Surface, Radix, ref, `asChild` or stylesheet; one `@classNameAllows` tag; five reused approved registry entries, no new convention, no exception; VIS-01 Pending (OQ-5 b).
- **Plan identity:** `contentSHA256: 584d4d04173f669f9b75913887af3bd4471797161c4618853cea5c5f8ee26163` — SHA-256 of the UTF-8, LF, final-newline payload from the exact line-start `## 1. Authority and gates` heading line through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b`; at inspection no tracked file under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified. Whole-file SHA-256 prefixes, re-verified: `packages/ui/src/index.ts` `713d1843…`, `styles/compiled.css` `7c587736…`, `.storybook/main.ts` `30ef22e5…`, `.storybook/preview.css` `b55993fb…`, `atoms/icon/types.ts` `81b4efe2…`, `atoms/button/types.ts` `26547d7d…`, `atoms/link/types.ts` `850d9f0b…`, `molecules/tip-card/types.ts` `52f98142…`, `molecules/page-header/types.ts` `d143e8c0…` (`icon`, `tip-card` and `page-header` equal the spec's reviewed hashes, as do `notice` `a93291f4…` and `module-card` `ed7adc13…`), `skills/_shared/prop-naming.json` `ceb95f54…` (185 entries), `scripts/prop-naming.test.mjs` `f2acfd78…`, `storybook-docgen.test.ts` `3705e162…`, `storybook-controls.test.ts` `f7928479…`, `scripts/package-exports.test.mjs` `9b779e24…`, `package-consumption.test.mjs` `de9a624c…`, `design-system-artifact.test.mjs` `51238e62…`, `scripts/catalog_data.py` `041dccd6…` (119 rows), `docs/prop-naming.md` `096d7125…`, `docs/catalog.json` `9428c9ff…`. `packages/system/design-system.json` is 610,264 bytes against the 768 KiB (786,432) budget asserted in `design-system-artifact.test.mjs`; `system.md` is 500,426 bytes. Registry check: `heading-title`, `heading-level`, `content-description`, `trailing-actions` and `leading-icon` are all `approved`, without aliases. No component, file or export named `EmptyState` or `empty-state` and no `eg-empty-state` rule exists in `packages/*/src` (the legacy `bundle.css` included), `scripts/` or `.storybook/`; the only textual hit is a NavList story comment, as the spec says. Baseline line numbers below are for orientation: other round 5 lanes land first (T6 is sequential), so every insertion is anchored by its neighbour.
- **Visuals:** VIS-01 is Pending: no capture, no hash. This plan produces behavior, emission and computed-style evidence only; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns. The spec approval grants no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance and its one limit.** The answer recorded in L5 names no digest, so the spec digest binds the bytes derived from the approved draft plus the recommended answers ([approval.md](approval.md)), not a digest the owner quoted. The plan accepts that as provenance; nothing here upgrades it.
3. **G3 — Registry.** No new convention and no exception: the five approved entries are reused (spec §3). The plan appends five usages (§5.1); no status, approval or receipt changes, and adding a usage approves nothing globally.
4. **G4 — Recipe, tokens and files.** The no-paint recipe is approved (OQ-1). Every utility is a static literal in a CVA string composed per part with `cn()`; no inline style, interpolated class, new AGENTS.md exception, token, dependency, Radix package or Surface import. **No stylesheet**: `empty-state.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. The tokens the recipe reads exist: `--text-heading-small`, `--text-body-default`, `--bp-sm`, `--color-fg-default`, `--color-fg-secondary`, `--color-fg-muted`, `--spacing`.
5. **G5 — Spacing is a starting point, proved by computed style.** The spec lists the spacing steps as an allowed difference at the capture review (OQ-1, OQ-5). The plan ships the listed values and proves the token arithmetic in Chromium (§9). A computed value that disagrees with the spec's arithmetic stops the work (G8); the plan never retunes a value.
6. **G6 — Emission and cascade are proved, not assumed.** Every utility is checked in the shipped package CSS and the packed build, and the computed style shows that no legacy or base rule restyles the bare heading and paragraph (§4 ES-09, §9).
7. **G7 — Integration ownership.** The writer touches only the six files of `packages/ui/src/molecules/empty-state/`. The barrel, `.storybook/main.ts`, the docgen and Controls pins, the registry JSON and generated view, the artifact, the catalog, the package harnesses, the changelogs, the evidence file and the ODD log are parent-owned integration surfaces, as in the NowCard, StepMeter and Carousel plans.
8. **G8 — Stop lines** are listed in §14.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines | Commit |
| --- | --- | --- | --- | --- |
| `packages/ui/src/molecules/empty-state/types.ts` | Writer | `EmptyStateLevel`, `EmptyStateProps` (native `div` props minus the protected list, five own props with English JSDoc, one `@control` each, `@default 3` on `level` only, `@classNameAllows` on the type), five static CVA recipes (§3) | +95 | 1 |
| `packages/ui/src/molecules/empty-state/useEmptyState.ts` | Writer | Title validation and its exact warning, rank fallback, description and actions normalization, protected-attribute stripping, per-part `cn()` | +85 | 1, 2 |
| `packages/ui/src/molecules/empty-state/EmptyState.tsx` | Writer | JSX only: `null` when invalid, root `div`, optional hidden icon wrapper around `Icon size='lg'`, heading, optional `p`, optional actions wrapper | +28 | 1 |
| `packages/ui/src/molecules/empty-state/EmptyState.test.tsx` | Writer | Cases for ES-01 to ES-08 and the ES-13 SSR comparison (§4) | +350 | 1, 2 |
| `packages/ui/src/molecules/empty-state/EmptyState.stories.tsx` | Writer | `Molecules/EmptyState`: eight stories (§6) | +190 | 2 |
| `packages/ui/src/molecules/empty-state/index.ts` | Writer | `export { EmptyState } from './EmptyState'; export type { EmptyStateLevel, EmptyStateProps } from './types';` and no variants export | +2 | 1 |
| `packages/ui/src/index.ts` | Parent | `export * from './molecules/empty-state';` between `./molecules/dialog` and `./molecules/field` (baseline lines 64 and 65) | +1 | 3 |
| `.storybook/main.ts` | Parent | `documentedNativeProps.emptyState: ['id', 'dir', 'lang', 'aria-describedby', 'className', 'style', 'onClick']` after `stepMeter` (baseline 170): PageHeader's list, the closest precedent | +1 | 3 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | EmptyState extraction test after the TipCard one (baseline 1599-1673); `'./molecules/empty-state'` in the barrel module list between `dialog` and `field` (2126-2127); `'EmptyState'` in the runtime names between `Dropzone` and `Field` (2225-2226); the eight story names | +80 | 3 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `['EmptyState', 'molecules/empty-state']` appended at the end of the component list after `StepMeter` (137; the list's literal-interning note applies); `emptystate` control map after `stepmeter` (293); `emptystate: 5` after `stepmeter: 3` (758); `['EmptyState', { level: '3' }]` after `StepMeter` (1638); `['EmptyState', 'icon', false]` in the icon loop beside `FieldMessage` (1813); one dedicated test after StepMeter's (2109) | +40 | 3 |
| `skills/_shared/prop-naming.json` | Parent | Append five `EmptyState` usages (§5.1) | +45 | 3 |
| `scripts/prop-naming.test.mjs` | Parent | Five `{ conventionId, source }` pairs in `postReceiptUsages` after the StepMeter pairs (848-852); one new test modeled on StepMeter's (1717) | +65 | 3 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ +15 | 3 |
| `scripts/design-system-artifact.test.mjs` | Parent | One EmptyState test after the NowCard footer one (628) | +50 | 3 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ +30 | 3 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | One EmptyState row after PageHeader (baseline 65), then one `build_catalog.py` run (§5.4) | +1; ≈ +14 | 3 |
| `scripts/package-exports.test.mjs` | Parent | `'EmptyState'` in the runtime names (after `Dropzone`, 6006), `'EmptyState'`, `'EmptyStateLevel'` and `'EmptyStateProps'` in the sorted declaration-export list (`deepEqual([...names].sort(), …)`, 6251) and in the later declaration-presence list (`Missing public declaration export`, 6896-7055), a built-CSS test and an SSR test modeled on StepMeter's (861, 925) | +105 | 4 |
| `scripts/package-consumption.test.mjs` | Parent | Typed positive samples outside `App`, `@ts-expect-error` negatives, a CSS assertion, an SSR block, `'EmptyState'` in the runtime names (after `Dropzone`, 5934) | +100 | 4 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | One bullet each under the existing unpacked sections (§7) | +6; +3 | 4 |
| `docs/components/empty-state/v0.1/implementation-evidence.md` | Parent | Observed RED and GREEN output, browser table, hashes, limits (§9) | +80 | 4 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 | 4 |

**No change expected:** `packages/ui/src/styles/compiled.css` (already scans `../molecules/**/types.ts`, line 53), `.storybook/preview.css` (already scans `../packages/ui/src/molecules/**/*.stories.tsx`, lines 19 and 64), `scripts/storybook-mcp-exceptions.json` (EmptyState has its own story component), `packages/ui/src/styles/legacy/bundle.css`, `packages/tokens/**`, `packages/ui/src/atoms/**` and the neighbouring molecules (Icon, Button, Link, TipCard, PageHeader, Notice are imported or compared, never edited), every `package.json`, the lockfile, `packages/mcp/**`, `packages/cli/**`, `packages/effects/**`, the spec and approval of this version, the files of the other round 5 lanes.

**Versions:** none move (S2). `@egdev/ui` stays at 0.11.0 and `@egdev/system` at 0.13.0, both unpacked; tokens and cli do not change here.

Work units: **A** (Writer) the six component files, slices 1 and 2. **B** (Parent) integration, registry and generated outputs (slice 3), then harnesses, changelog, evidence and log (slice 4). Registry revisions always follow the final bytes of `types.ts`, so slice 3 stays sequential.

## 3. Design of the change

Indicative only: the writer's code and JSDoc are reviewed against the approved spec, not against these excerpts. Biome style: single quotes, 120 columns, no trailing commas, `type` never `interface`, no `any`.

**Contributor checklist, covered where:**

| Aspect | Result |
| --- | --- |
| Anatomy | Spec §2: root `div.eg-empty-state`, optional hidden icon `span`, native heading, optional `p`, optional actions `div`; DOM order equals visual order |
| API and defaults | Spec §3 exactly; the only constant default is `level` 3; absence and fallback rules live in the JSDoc body, not in `@default` tags |
| States | None: stateless, no `data-state`, no variants, no mirrored classes |
| Accessibility | No role, no live region, no focus move, hidden decorative icon; ES-05 to ES-08, §9 |
| Radix | None: no installed `@radix-ui/*` package offers an empty or status block; the action is a supplied system control |
| Material | No paint (OQ-1): no Surface, background, border, shadow, gradient or backdrop; text and icon colors read the three `fg` tokens |
| Paths | §2; six mandatory files, no stylesheet, no extra internal module |
| Consumer and canvas compatibility | New root marker `eg-empty-state` with no legacy rule to preserve; no DS046 or CLI change; React 18.3.1 and 19.3.0 packed consumers without a Tailwind compiler (ES-13) |

```ts
// types.ts — five own props, each with English JSDoc and one @control; only `level` carries a constant @default
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type { Button, ButtonProps } from '../../atoms/button';
import type { IconName } from '../../atoms/icon';
import type { Link, LinkProps } from '../../atoms/link';

/** Native heading rank for the document outline, independent of the sans heading typography. */
export type EmptyStateLevel = 2 | 3 | 4 | 5 | 6;
type EmptyStateActions = ReactElement<ButtonProps, typeof Button> | ReactElement<LinkProps, typeof Link>;
type EmptyStateNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children' | 'title' | 'role' | 'aria-live' | 'aria-atomic' | 'aria-relevant' | 'aria-label' | 'aria-labelledby'
  | 'dangerouslySetInnerHTML' | 'tabIndex' | 'contentEditable'
>;

/** Passive empty state ... No ref, asChild, children or part-class API.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size */
export type EmptyStateProps = EmptyStateNativeProps & {
  /** Visible plain-text heading, never a native tooltip; blank titles warn in development and render nothing. @control text */
  title: string;
  /** Native heading rank only; the typography never follows the rank. @default 3 @control select */
  level?: EmptyStateLevel;
  /** Short plain-text explanation after the title; omitted when blank. @control text */
  description?: string;
  /** Decorative pictogram before the title, rendered at the lg preset and hidden from assistive technology. @control select */
  icon?: IconName;
  /** One supplied Button or Link, rendered unchanged; null, undefined and booleans omit it. ...
   * @control false
   * @controlReason Non-serializable ReactElement/boolean union; see Default, WithLinkAction and AsLinkButton. */
  actions?: EmptyStateActions | null | boolean;
};

export const emptyStateVariants = cva('eg-empty-state flex min-w-0 flex-col items-center gap-3 px-4 py-8 text-center font-sans');
export const emptyStateIconVariants = cva('inline-flex shrink-0 text-fg-muted');
export const emptyStateTitleVariants = cva('m-0 font-sans text-heading-small text-fg-default wrap-anywhere');
export const emptyStateDescriptionVariants = cva('m-0 max-w-[var(--bp-sm)] font-sans text-body-default text-fg-secondary wrap-anywhere');
export const emptyStateActionsVariants = cva('flex min-w-0 max-w-full flex-wrap items-center justify-center gap-2');
```

```ts
// useEmptyState.ts — same development-only guard and rank fallback as useTipCard.ts; the hook decides everything
const valid = typeof title === 'string' && title.trim().length > 0;
if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
  console.warn('EmptyState requires a non-empty title. Nothing was rendered.');
}
const rank: EmptyStateLevel = [2, 3, 4, 5, 6].includes(level) ? level : 3; // silent
const text = typeof description === 'string' && description.trim().length > 0 ? description : null;
const action = actions == null || typeof actions === 'boolean' ? null : actions;
// Strip children, role, aria-live, aria-atomic, aria-relevant, aria-label, aria-labelledby, dangerouslySetInnerHTML,
// tabIndex, contentEditable and ref from `...native` at untyped boundaries; the rest reaches the root.
// rootProps: { ...rest, className: cn(emptyStateVariants(), className) }; each part gets cn(<recipe>()) and no className.
```

```tsx
// EmptyState.tsx — JSX only; the hook is the only place that normalizes
return valid ? (
  <div {...rootProps}>
    {iconName !== null && (<span className={iconClassName} aria-hidden='true'><Icon name={iconName} size='lg' /></span>)}
    <Heading className={headingClassName}>{title}</Heading>
    {text !== null && <p className={descriptionClassName}>{text}</p>}
    {action !== null && <div className={actionsClassName}>{action}</div>}
  </div>
) : null;
```

The component imports only `Icon` as a value; `IconName`, `Button`, `ButtonProps`, `Link` and `LinkProps` are type-only imports (PageHeader's pattern). No state, ref, id, effect, Surface, Stack, Text, Heading primitive, Slot or inline style. The five recipes are exported from `types.ts` for the hook and the artifact but never from `index.ts` (an `emptyStateVariants` export needs separate approval, spec §3).

**Emission inventory.** Each static utility, the declaration it must emit and where it is proved (E1 is the built-CSS test of §5.5, B the Chromium probe of §9):

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `flex`, `inline-flex`, `flex-col`, `flex-wrap`, `items-center`, `justify-center`, `shrink-0`, `min-w-0`, `max-w-full`, `text-center` | The matching layout declarations | E1, B |
| `gap-3`, `px-4`, `py-8`, `gap-2` | `gap` and padding through `calc(var(--spacing) * n)`: 9.6px, 12.8px, 25.6px, 6.4px under default tokens | E1, B |
| `m-0`, `wrap-anywhere` | `margin: 0`; `overflow-wrap: anywhere` | E1, B |
| `font-sans` | `font-family` from the sans token | E1, B |
| `text-heading-small`, `text-body-default` | Size, line height and weight from `--text-heading-small` (19.2px, 1.2, 700) and `--text-body-default` (12.8px, 1.6, 500) | E1, B |
| `text-fg-default`, `text-fg-secondary`, `text-fg-muted` | `color` from the three `--color-fg-*` tokens | E1, B |
| `max-w-[var(--bp-sm)]` | `max-width: var(--bp-sm)` (520px) | E1, B |

No `bg-*`, `border*`, `shadow*`, `ring*`, `outline*`, `filter`, `backdrop-*`, `transition*`, `animate-*` or `transform` utility appears in any recipe.

## 4. Test-first sequence

Public-interface tests first (roles and accessible names, `userEvent`, no complete class strings, no `data-testid`), with the intended RED captured verbatim before any implementation; the evidence file records command, exit code and counts. Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded, never committed. A new component has no earlier state and a stub would be a dummy file, so ES-01 fails at import and each later row fails on an assertion after the previous minimal GREEN. Rows marked **guard** pass on their first run and claim no RED. Test names carry their ES id, as TipCard's carry TP ids. Type-level assertions use `expectTypeOf` (StepMeter and Switch precedent); the one documented cast is an `untyped(props)` helper for JavaScript callers.

**R0 baseline, no edit:** the TipCard, PageHeader, Notice and Icon suites, docgen, Controls, css, `props:check`, `test:props`, `artifact --check`, `system:check`, `test:artifact`, `test:system`, `test:mcp` and the Storybook MCP contract test all green; record the counts.

| AC | RED test (file → case) | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| ES-01 | `EmptyState.test.tsx`: `getByRole('heading', { name, level: 3 })`; root `div` with `eg-empty-state`, no `role`, no `title` attribute; `compareDocumentPosition` order icon wrapper, heading, description, actions; `renderHook(useEmptyState)` result shape | The file fails at import (`./EmptyState`, `./useEmptyState`, `./types` unresolved) | Marker, role and title absence, order and hook shape green |
| ES-02 | `it.each` 2 to 6 → `h2` to `h6`; `it.each` `undefined`, 1, 7, 2.5, NaN and `'4'` (untyped) → `h3` with no `console.warn`; no `h1` for any value | After ES-01's minimal GREEN (a fixed `h3`): 2, 4, 5 and 6 fail; the invalid rows are **guards** (`h3` by construction) | Green; hook result `headingElement` agrees |
| ES-03 | Table: `description` absent, `''`, `'   '`, `42` (untyped); `icon` absent; `actions` `undefined`, `null`, `false`, `true` → no `p`, no wrapper; a title-only state is valid; a `title` and `description` containing `<b>` render as literal text | Empty `p` and wrapper nodes render until normalization exists; the markup-as-text row is a **guard** (JSX escapes) | Green: no empty node, no element created from text |
| ES-04 | Blank, whitespace and non-string `title` → exactly `EmptyState requires a non-empty title. Nothing was rendered.` once, empty container; a valid `rerender` renders; `vi.stubEnv('NODE_ENV', 'production')` → no warning | An unnamed heading renders and nothing is warned | Green, with `unstubAllEnvs` in `afterEach` |
| ES-05 | Icon wrapper has `aria-hidden="true"`; `queryByRole('img')` is null; the heading's name excludes the glyph; the `svg` carries the `lg` preset class (`size-7`), no full class snapshot | No icon branch yet; after it, the hidden-wrapper assertion fails until `aria-hidden` is set | Green |
| ES-06 | `userEvent` with handler spies: Button (click, Enter and Space once each), Button `asChild` anchor and Link (click and Enter once each); `userEvent.tab()` reaches the action exactly once; the wrapper adds no role or `tabindex`; `href`, handler and props equal what was supplied | The action is not rendered until the actions branch exists | Green |
| ES-07 | No `status`, `alert` or `log` role and no `[aria-live], [aria-atomic], [aria-relevant]` node; untyped `role`, `aria-live`, `aria-atomic` and `aria-relevant` are dropped; an external button keeps `document.activeElement` across render, `rerender` and unmount; `expectTypeOf` omissions | The untyped-injection rows fail until the hook strips them; the rest are **guards** | Green |
| ES-08 | `id`, `data-*`, `aria-describedby`, `lang` and `dir` reach the root; untyped `children`, `aria-label`, `aria-labelledby`, `tabIndex`, `contentEditable`, `dangerouslySetInnerHTML` and `ref` are dropped; `className` merges last, the marker survives, parts carry no consumer class; `expectTypeOf` shows no `ref` or `asChild` | The protected keys reach the DOM until the hook strips them | Green |
| ES-09 | `package-exports.test.mjs` built-CSS test: every static utility of the five recipes is in the shipped `styles.css` with declarations from the named tokens; no `eg-empty-state` rule; `types.ts` holds no `style`, and no stylesheet file exists; the packed consumer CSS assertion; the Chromium probe of §9 | The test reads `types.ts` and fails before slice 1. After it the emission rows are probably **guards**, because other components already emit most of these utilities; the browser probe cannot find the story on the baseline build (D2) | Green after `pnpm build`; browser rows Pending until D2 |
| ES-10 | Chromium: `scrollWidth` not above `clientWidth` at 390px and 200% zoom with `LongContent`; computed description `max-width` equals `--bp-sm` | jsdom cannot express it: the probe is written first and fails against the baseline build | Computed values in the evidence file; **Not observed** without D2 |
| ES-11 | Chromium: title, description and icon computed colors against the computed backgrounds of four `Surface` tones and under `SectionShell register="grafito"`, with and without `prefers-reduced-transparency: reduce` | Same as ES-10 | Ratios recorded as observed; grafito stays an observation, never an assumption |
| ES-12 | `storybook-docgen` extraction test and Controls pins edited first (own props 5, one `@control` each, required flags, `@default 3`, shown native rows, absent `children`, `ref`, `asChild` and protected keys, the eight story names); `prop-naming.test.mjs` new test and five `postReceiptUsages` pairs; `pnpm props:check` | The barrel lists differ from the real barrel and the folder is unknown until slice 3; `props:check` is stale after the `types.ts` edit; the registry test fails until the usages exist | Pins, `props:docs`, `props:check`, `test:props` green with zero owned diagnostics; browser widgets under D2 |
| ES-13 | `package-exports.test.mjs` runtime and type lists plus SSR; `package-consumption.test.mjs` typed samples, `@ts-expect-error` negatives, CSS assertion and SSR; `renderToStaticMarkup` equals the client markup; React 18.3.1 and 19.3.0 through the packed harness (D3) | `EmptyState` is undefined in the package and the lists differ until the barrel line exists | Green after `pnpm build`; the packed matrix is **Not observed** without D3 |

**Coverage check:** ES-01 to ES-13 each appear in at least one row. **PRESERVE:** no shared parser, helper, CVA or hook changes, so no differential run is planned. Evidence that previous behavior holds: the neighbouring suites unmodified and green; `git diff -U0` on every existing file shows additions only; the built-CSS selector inventory before and after differs by additions only; the artifact diff shows additions only apart from the registry counts.

**GREEN order:** `types.ts` → `useEmptyState.ts` → `EmptyState.tsx` → `index.ts` → the focused runner → stories → barrel and `.storybook/main.ts` → docgen and Controls pins → registry → catalog → artifact → harnesses → changelog.

## 5. Registry, docgen, artifact and catalog obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Append, never reorder, one usage to each of the five approved entries; each `source.revision` is the whole-file SHA-256 of the final reviewed `types.ts`, in the form `sha256:<64 hex>`. Hash only after `types.ts` is final and `pnpm lint` is clean on it; any later edit, even formatting, requires re-review and re-hashing. Usage types follow spec §3:

| Entry | Usage `type` |
| --- | --- |
| `heading-title` | `string (required; blank renders nothing with a development warning)` |
| `heading-level` | `EmptyStateLevel (2 \| 3 \| 4 \| 5 \| 6; default 3)` |
| `content-description` | `string (optional; blank or non-string omits the paragraph)` |
| `trailing-actions` | `one Button or Link (optional; null and booleans omit it)` |
| `leading-icon` | `IconName (optional decorative glyph, rendered at lg)` |

Every usage is `{ "component": "EmptyState", "type": …, "status": "existing", "source": { "path": "packages/ui/src/molecules/empty-state/types.ts", "symbol": "EmptyStateProps", "revision": … } }`. No new entry, exception, approval JSON or receipt: a convention hash binds convention content, not usages. The entry count stays 185.

In `scripts/prop-naming.test.mjs` add the five `{ conventionId, source: 'packages/ui/src/molecules/empty-state/types.ts#EmptyStateProps' }` pairs to `postReceiptUsages` and one test modeled on the StepMeter one: each of the five entries stays `approved`, carries exactly one EmptyState usage with the live whole-file revision, and `historicalRegistry` strips only the reviewed usages. An unlisted usage fails the receipt tests: that is the intended RED. Then `pnpm props:docs` (never by hand), `pnpm props:check`, `pnpm test:props`; re-run to find any other pinned count before attributing a failure.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts`: the extraction test asserts five own declarations with controls `title` text, `level` select, `description` text, `icon` select, `actions` false with a reason naming `Default`, `WithLinkAction` and `AsLinkButton`; `title` required; `level` options `2` to `6` and default `3` (the only `@default`); native rows `id`, `dir`, `lang`, `aria-describedby`, `className`, `style`, `onClick` present and `children`, `ref`, `asChild`, `role`, `aria-live`, `aria-atomic`, `aria-relevant`, `aria-label`, `aria-labelledby`, `tabIndex` absent; stories equal the eight names of §6, `title: 'Molecules/EmptyState'`, no `argTypes` or `play`; `EmptyState` is public and the five recipes and `useEmptyState` are not.
- `storybook-controls.test.ts`: the control map, the count 5, the default-args row `{ level: '3' }`, the `icon` loop row (48 options, none injected as an arg) and a dedicated test: `title` required text, `level` select in union order with the Docs default `3`, `description` text, `actions` control false with its reason, zero diagnostics, `args` empty.

### 5.3 System artifact

`pnpm artifact --write` then `pnpm system:docs`, only after source, registry and catalog are final. Expected `EmptyState` entry: package `@egdev/ui`, source `packages/ui/src/molecules/empty-state/types.ts`, `classNameAllows` the six sorted properties, props `actions`, `description`, `icon`, `level` (enum, default `3`), `title` (string, required), five variants named `emptyState{,Actions,Description,Icon,Title}Variants`, `composedOf` `Icon`, no `surfaceUsage`, no `parts`; `propNaming` gains the five usages; `catalog` gains the row. The artifact tests require the components list to equal the barrel exports, `catalog` to equal `docs/catalog.json`, and every registry usage to resolve to an artifact component, so the barrel, catalog, registry and artifact change in the same commit (slice 3). Add one test beside the NowCard footer one: props and default, `title` required, no `children`, `role`, `aria-label` or `ref`, the five recipes with the §3 utilities, no `surfaceUsage`, the six `classNameAllows`, and each of the five reused entries `approved` and listing `EmptyState`. Expected growth is a few KB against the 786,432-byte budget; report any overflow instead of weakening it. `pnpm build` regenerates the artifact too, so `artifact --check` runs again after it.

### 5.4 Catalog

Edit only `scripts/catalog_data.py`, then `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. New row after PageHeader, written after GREEN and kept honest about what is observed:

```py
("—","—","EmptyState","molecule","ui","—","Icon; consumer Button/Link action","nuevo","Implemented React molecule under the [approved v0.1 contract](components/empty-state/v0.1/spec.md): passive empty state for a listing or filter combination that returns nothing: native heading (`title`, `level` 2 to 6, default 3), optional plain-text `description`, optional decorative `icon` and one consumer-supplied Button or Link in `actions`, unpainted on the host backdrop. No live region, no focus management and no built-in copy; the host announces and places focus. No stylesheet, ref or asChild. Browser, grafito contrast and packed-consumer verification remain pending until observed."),
```

### 5.5 Package fixtures

`package-exports.test.mjs`: add `'EmptyState'` to the runtime names and `'EmptyState'`, `'EmptyStateLevel'`, `'EmptyStateProps'` to the sorted declaration-export list and to the declaration-presence list (the failing diff shows the exact spot); a built-CSS test modeled on the StepMeter one (read `types.ts`, collect every static string of the five `cva` calls, require each non-`eg-` utility in the built `@layer utilities`, assert the §3 declarations through `cssBlock`, assert `doesNotMatch(css, /eg-empty-state/)`); an SSR test asserting the root `div.eg-empty-state`, the heading, the hidden icon wrapper, no `role`, nothing for a blank title, and that `emptyStateVariants`, `useEmptyState` and the other recipes are not exported.

`package-consumption.test.mjs`: add `EmptyState` to the value import and `EmptyStateLevel` and `EmptyStateProps` to the type imports; positive samples in an `EmptyStateSamples` component kept outside `App`, so the existing button-count and focus harness stays unchanged (the PageHeader and TipCard comment); documented `@ts-expect-error` negatives for a missing `title`, `level` 1 and 7, a rich `title`, array and text `actions`, `children`, `role`, `aria-live`, `aria-label`, `aria-labelledby`, `tabIndex`, `contentEditable`, `dangerouslySetInnerHTML`, `ref`, `asChild`, an `icon` outside `IconName` and the private recipes; an `assertEmptyStateConsumerCSS` like `assertStepMeterConsumerCSS`; an SSR block. No ref API, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Molecules/EmptyState` keeps autodocs, `Meta<typeof EmptyState>`, `parameters: { layout: 'padded' }`, no manual `argTypes`, no `play`, English JSDoc (`## Description`, `## Dependencies`, `## Usage guidelines`). Meta `args` hold only the required `title`; `Default` supplies example args and never `level`, so Docs keeps the constant `3`. Compose only with exported DS pieces.

- `Default`: `icon: 'search'`, `description` and a secondary Button ("Clear filters"), the VIS-01 scenario. JSDoc prefers Button where the 44px touch target matters and says a bare Link's hit area is its text line.
- `TitleOnly`: `title` alone (ES-03).
- `WithLinkAction`: a Link action with an `href` that does not navigate the iframe (`#…`, as PageHeader's stories).
- `AsLinkButton`: a Button `asChild` around an anchor.
- `HeadingLevels`: ranks 2 to 6 side by side; JSDoc states that the typography never follows the rank and that there is no `h1`.
- `LongContent`: a long unbroken title and description in a narrow host built from spacing tokens (precedent: Carousel's `max-w-[calc(var(--space-24)*4)]`), with the 390px reading condition proved by the viewport probe, not by the story.
- `FilteredListing`: a small stateful host (a filter, a list and the EmptyState) that owns a `VisuallyHidden` status mounted before results change, updated with the count, and moves focus to a stable target when the action clears the filter. JSDoc says it documents the host boundary and proves nothing about speech. No `play`, no new dependency.
- `OnGrafitoSection`: the component inside `SectionShell register="grafito"` (ES-11).

Controls: the registered enhancer shows `title` and `description` as text, `level` as a select in union order, `icon` as a select with the 48 glyphs and `actions` with no control; it injects no argument. Real browser Controls are checked in §9, not inferred from tags.

## 7. Changelog entries

The unpacked release absorbs the work (S2), so no `## Unreleased` section is added. `packages/ui/CHANGELOG.md`: a new first bullet under `### Added` of the existing `## 0.11.0` (entries run newest first):

```md
- `EmptyState` shows that a listing or a filter combination returned nothing: a native heading (`title`, rank 2 to 6,
  default 3), an optional plain-text `description`, an optional decorative `icon` and one recovery `actions` Button or
  Link, on the host backdrop with no card, border or shadow. It is passive: it renders no live region and never moves
  focus, so the host announces "no results" if it wants speech and places focus when the action removes the state.
  There is no built-in copy: consumers provide localized text. (#573)
```

`packages/system/CHANGELOG.md`: a new first bullet under `### Added` of its existing **`## 0.13.0`** section. That is the system version released together with ui 0.11.0 (#568); the `## 0.11.0` heading further down belongs to an older, already released system version (0.11.0, #552) and must not be used.

```md
- The source-derived artifact and reference include `EmptyState` (its props, static recipes and `className`
  allowance) and its five reused naming conventions. (#573)
```

`(#573)` marks the issue fully resolved, as [versioning](../../../distribution/versioning.md) requires; once the release is packed, `release.json` `resolves` lists it (D4). If the owner narrows the delivery, write `Refs #573` instead. No version bump, `release:pack` or tag, and no `mcp`, `effects`, `cli` or `tokens` entry.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/molecules/empty-state --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/molecules/tip-card packages/ui/src/molecules/page-header packages/ui/src/molecules/notice packages/ui/src/atoms/icon --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/tokens packages/ui/src/styles packages/ui/src/atoms packages/ui/src/molecules/tip-card packages/ui/src/molecules/page-header packages/ui/src/molecules/notice
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

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` writes package outputs and regenerates the artifact, so the freshness checks run again after it. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache (`EGDEV_CONSUMER_OFFLINE=1` is the offline route); it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler. `pnpm test:package-release` is a PRESERVE check on the changelog structure and `pnpm test:mcp` on the README examples (no version moves, so no drift is expected; if it fails, re-run it on the base before attributing the failure). The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens tests, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and are run here because `@egdev/system` ships. Every result is recorded per command with exit code and test counts in the evidence file; jsdom, docgen and HTML smoke prove no appearance, contrast or screen-reader behavior, and none is claimed.

## 9. Browser and capture procedure

Only after separate permission (D2) to start `pnpm storybook` (it builds tokens first) or a scratch package build outside the repository, and to use a real Chromium, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion, transparency and forced-colors settings, crop and date for every observation. Stories: `molecules-emptystate--default`, `--title-only`, `--with-link-action`, `--as-link-button`, `--heading-levels`, `--long-content`, `--filtered-listing`, `--on-grafito-section`.

1. **Geometry and paint (ES-09).** Root: transparent background, `background-image` none, `box-shadow` none, zero border widths, `display: flex` column, centered, `gap` 9.6px, padding 12.8px inline and 25.6px block. Title: sans family, `text-transform: none`, margin 0, 19.2px, line height 1.2, weight 700, color equal to the computed `--color-fg-default`. Description: 12.8px, 1.6, 500, color `--color-fg-secondary`, `max-width` 520px. Icon wrapper: color `--color-fg-muted`, glyph 22.4px. Actions: wrap, centered, `gap` 6.4px. No inline `style` attribute on any own element. A legacy or base rule that restyles the bare heading or paragraph stops the work (G8). Disagreement with the spec's token arithmetic stops the work.
2. **Reflow (ES-10).** `LongContent` at a 390px viewport and at 200% zoom: no horizontal overflow (`scrollWidth` not above `clientWidth`), long words wrap, the description never exceeds `--bp-sm`.
3. **Contrast (ES-11).** Measured contrast of title, description and icon on the four `Surface` tones against the spec's hand-computed table, and under `SectionShell register="grafito"` with and without `prefers-reduced-transparency: reduce`; the grafito figure is recorded as observed.
4. **Accessibility tree.** A generic root with no role, a heading named by `title`, the icon absent from the tree, the action reachable by Tab exactly once, and the supplied control's own focus ring visible. Real screen-reader output, real touch devices and real High Contrast sessions stay Not evaluated.
5. **Controls (ES-12).** In `pnpm storybook`: `title` and `description` text, `level` select (2 to 6, Docs Default `3`), `icon` select (48 glyphs), `actions` without a widget and with its reason, no injected argument, no diagnostics.
6. **Capture VIS-01**, only if separately authorized (OQ-5 b): a component-zone PNG of the `Default` story under `docs/components/empty-state/v0.1/` named `<variant>--<state>--<viewport>--<theme>.png` (for example `default--static--1280x900--dark.png`), with `capture.json`, SHA-256 hashes and conditions. It is observed implementation, not approved expected design, until the owner adopts exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture exists, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English; bodies use `Refs #573`. Each commit passes the pre-commit Biome and typecheck hooks (`lefthook.yml`) and the pre-push `pnpm test`; generated files are regenerated inside every commit that changes their inputs, so each commit stays green. A failing RED commit is never made.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the EmptyState core with its heading and content rules (#573)` | `types.ts`, `useEmptyState.ts` (title warning, rank fallback, description, icon and actions normalization), `EmptyState.tsx`, `index.ts`, tests for ES-01 to ES-04; folder not yet exported | ≈ 370 |
| 2 | `feat(ui): protect EmptyState semantics and document it in stories (#573)` | Protected-attribute stripping in the hook, tests for ES-05 to ES-08 and the SSR comparison, `EmptyState.stories.tsx` | ≈ 380 |
| 3 | `feat(ui): publish EmptyState with metadata pins, registry usages and catalog (#573)` | Barrel line, `.storybook/main.ts`, docgen and Controls pins, registry usages with `prop-naming.test.mjs` and the regenerated view, artifact test, catalog row, regenerated artifact and catalog | ≈ 344 |
| 4 | `test(ui): check the packed EmptyState build and record its evidence (#573)` | `package-exports.test.mjs`, `package-consumption.test.mjs`, both changelog bullets, `implementation-evidence.md`, the ODD log | ≈ 300 |

Slices 1 and 2 leave the folder unexported, so no whole-repo test sees it; if one unexpectedly fails on the unexported folder, merge slices 1 to 3 instead of weakening the test. Slice 3 keeps the barrel, catalog, registry, artifact and metadata pins together because the artifact and docgen suites cross-check them. If slice 3 grows past 400, move the artifact test into slice 4. The registry revisions always follow the final bytes of `types.ts`.

## 11. Estimated changed lines

About **1,394 changed lines**: ≈ 1,333 hand-written (component files 750: `types.ts` 95, hook 85, component 28, index 2, tests 350, stories 190; metadata pins and registry test 185; package harnesses 205; artifact test 50; registry JSON, catalog source, barrel and `.storybook/main.ts` 48; changelogs, evidence and log 95) and ≈ 61 generated (`docs/prop-naming.md` ≈ 15, `design-system.json` 2, `system.md` ≈ 30, catalog ≈ 14). For calibration, the StepMeter plan estimated ≈ 1,250 hand-written lines for an atom plus a documentation-only NowCard amendment.

## 12. Risks

- **Risk 1 — Spacing is arithmetic until measured.** The 9.6, 12.8, 25.6 and 6.4px steps and the 520px measure come from token arithmetic, not from a reference or a browser. A disagreement stops the work (G5, G8); an owner-adopted capture may change the steps later (an allowed difference), which then needs a regeneration of the artifact and the pinned utilities.
- **Risk 2 — Bare heading and paragraph.** The title and description are native `h2` to `h6` and `p`: a legacy or base element rule could win over a recipe utility. The recipes carry `m-0` and `font-sans`, and only the computed-style probe proves that no inherited uppercase, margin or family survives.
- **Risk 3 — Grafito contrast.** The grafito backdrop is translucent, so contrast over it is Not evaluated until measured (ES-11); the hand-computed ratios cover only the four solid surfaces.
- **Risk 4 — Registry freshness chain.** The five revisions bind the final bytes of `types.ts`, and the artifact and registry test pins follow. Finish source, lint, hash, registry, regenerate, check; any late JSDoc or formatting edit repeats the chain.
- **Risk 5 — `icon` outside `IconName`.** At an untyped boundary `Icon` throws on an unknown name (`iconPaths[name].map` in `useIcon.ts`). The spec defines no guard, so none is planned: the closed type is the contract. A guard would be a behavior the spec does not promise, so it is an amendment, not a plan change.
- **Risk 6 — `ref` at a React 19 boundary.** React 19 delivers `ref` as a prop to a function component, and spreading it would attach it to the root `div`, against the spec's "no ref". The hook drops it like `useTipCard` does; this is a plan-level choice a reviewer can veto at G1.
- **Risk 7 — Development warning in render.** Like TipCard's, the warning fires in render and can fire twice under React StrictMode: tests assert the exact message and a single call under plain `render`, not a count under StrictMode.
- **Risk 8 — Action identity and touch target.** JSX type erasure cannot enforce that `actions` is a Button or Link, and a bare Link's hit area is its 11.2px text line, below the 44px touch minimum. The stories and JSDoc prefer Button and say so; nothing is enforced.
- **Risk 9 — Parallel lanes, shared files.** Every round 5 lane touches the barrel, the registry JSON and generated view, the docgen and Controls pins, the package harnesses, the artifact, the catalog and the changelogs. T6 is sequential, so anchors are by neighbour: regenerate generated files after the previous lane lands, never hand-merge them, and re-hash `types.ts` after any rebase. The Controls component list is order-sensitive (literal interning), so the new row goes last.
- **Risk 10 — Changelog section.** `@egdev/system` has two headings that look alike: the open one is `## 0.13.0`; its `## 0.11.0` is an older, already released version. A bullet in the wrong one would break the release trail.
- **Risk 11 — Package harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18 and 19 matrix stays pending, which blocks a "verified in packed consumers" claim, not the rest. The aggregate `App` harness counts buttons and focus, so the samples stay outside it.
- **Risk 12 — Story host.** `FilteredListing` owns a live region and a focus move that the component itself never has; the story must say that boundary is the host's and proves nothing about speech, and must not add `play` or a dependency.
- **Risk 13 — Consumer fit.** egdev-website's pages are not built, so no reference markup exists; the first real use may ask for another spacing step or a second action, which would be a separate request (non-goals of the spec).

## 13. Pending owner decisions

No Material recipe, token, dependency or naming convention is pending: the recipe and the five reused conventions were approved with the spec.

1. **D1 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it.
2. **D2 — Browser and capture authorization.** Starting `pnpm storybook` or a scratch build and using a real Chromium are needed for ES-09 to ES-11 and the Controls widgets; capturing VIS-01 and adopting any capture as expected design are separate decisions (OQ-5 b). Without them those rows stay **Not observed** or **Not evaluated** and the spec's spacing ships unmeasured.
3. **D3 — Packed consumers.** `pnpm test:package-consumption` packs and installs isolated fixtures and needs install and network permission and a known cache; without it ES-13's React 18.3.1 and 19.3.0 evidence stays **Not observed**.
4. **D4 — Issue citation.** The entries cite `(#573)`, which marks the issue fully resolved once the release is packed; if the owner reads the missing website adoption as leaving it open, write `Refs #573` instead.
5. **D5 — Publishing the snapshot.** Publishing v0.1 on a canonical issue (the spec leaves the canonical issue Pending) is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: the hook drops a runtime `ref`; `documentedNativeProps.emptyState` copies PageHeader's list; the five recipes are named `emptyState{,Icon,Title,Description,Actions}Variants` and stay private; the warning fires in render; the ES-06 reading that Space activates the Button only (an anchor follows native Enter and click); the `FilteredListing` composition; the Controls list position.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, generated file, catalog, capture, release, Git or GitHub action is taken or implied. Stop and return to the owner if: a computed value disagrees with the spec's token arithmetic; a legacy or base rule restyles the bare heading or paragraph; a recipe utility is absent from the shipped CSS or the preview build; a generator or test demands an edit outside §2; the `icon` select reports diagnostics or `actions` cannot be mapped as `false` with its reason; `props:check` fails for a reason other than stale revisions; the artifact exceeds the 768 KiB budget or its diff shows sections this plan does not expect; an existing suite must change to pass; a whole-repo test fails on an unexported folder and cannot be fixed without weakening it; or a token, dependency, stylesheet, inline style, `!important`, Radix package, Surface import or live region appears necessary.
