# Pagination v0.1 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, test, registry write, artifact or catalog regeneration, capture, release or Git action. Nothing below is implemented or measured: preparation was read-only (file reads, digests, `git` inspection), and no build, test, Storybook, browser or capture ran.
- **Coverage:** S4 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), request #571 only; this is the plan gate that precedes implementation under T6, which is sequential across the Round 5 lanes. Other lanes have their own plans. Branch, PR and merge belong to T7 and the parent; the writer never switches branches or commits. Format follows the [StepMeter v0.1](../../step-meter/v0.1/implementation-plan.md) (new component) and [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) plans.
- **Contract authority:** [spec.md](spec.md) v0.1, Approved on 2026-11-26, `contentSHA256: cb81738188ea161a6819027bec4bfe13703bf30c127966cf67d2c17489cd9a2f`, reproduced byte-exact in this working tree by three independent methods (`awk`, `sed` and Python) with the spec's own rule: the payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline, not the inline mention in the header. Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)", 2026-11-26, given on the committed draft (`8f50f0b`, payload `499588e019c8717f252b12b3b6811313f3acf349d10eb7581b8b873d79a49552`) with the recommended answer to OQ-1 to OQ-7, including the new naming conventions; cataloging approval L3. Visual hashes: VIS-01 to VIS-03 Pending. Resolved decisions this plan carries: a fixed 7-slot window with no `siblingCount` or `boundaryCount`; the current page is a self-link; boundary Previous and Next are dimmed `aria-hidden` placeholders; `pageCount` below 2 renders nothing, `value` is floored and clamped, invalid input warns and renders nothing; `page-count` / `pageCount`, `page-href` / `getHref` and the `navigation-intent` page-number payload are approved as a convention decision recorded separately (receipt pending, D2); recipe R1 and the geometry are approved with no token; Previous and Next keep text and arrow at every width and the row wraps.
- **Plan identity:** `contentSHA256: d4a494eb48896e4dbca5080ff34b77cdf1bd7e9a46a0637f8bd0362c04ddd0ff` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line (line start) through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b`. At inspection the only modified tracked file was `odd/tasks/round-5-consumer-requests.md` (the parent's log); nothing under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified, and `git status` showed no tokens change. Whole-file SHA-256 prefixes, to re-verify at the start of implementation because earlier T6 lanes will move them: `packages/ui/src/index.ts` `713d1843` (245 lines), `styles/compiled.css` `7c587736`, `.storybook/main.ts` `30ef22e5`, `.storybook/preview.css` `b55993fb`, `storybook-docgen.test.ts` `3705e162`, `storybook-controls.test.ts` `f7928479`, `storybook-css.test.ts` `81993251`, `scripts/package-exports.test.mjs` `9b779e24`, `package-consumption.test.mjs` `de9a624c`, `design-system-artifact.test.mjs` `51238e62`, `prop-naming.test.mjs` `f2acfd78`, `scripts/catalog_data.py` `041dccd6` (119 rows), `skills/_shared/prop-naming.json` `ceb95f54` (185 entries: 179 approved, 6 proposed), `packages/ui/CHANGELOG.md` `404c5095`, `packages/system/CHANGELOG.md` `ab828f02`; reviewed appearance sources equal to the spec's recorded hashes: `tabs/types.ts` `c05bfef9`, `carousel/types.ts` `b5d8a17c`, `icon/types.ts` `81b4efe2`. All 17 tokens the spec relies on exist in `packages/tokens/src/theme.css` (`--color-fg-muted`, `--color-fg-secondary`, `--color-fg-default`, `--color-surface-1`, `--color-surface-2`, `--color-state-selected`, `--gradient-chip-active`, `--shadow-edge-strong`, `--shadow-focus`, `--focus-width`, `--duration-fast`, `--ease-out`, `--space-10`, `--space-14`, `--radius-md`, `--text-meta`, `--font-display`), so the spec's "no token proposal" holds. `packages/system/design-system.json` is 610,264 bytes against the 768 KiB (786,432-byte) budget asserted at `design-system-artifact.test.mjs:1300`; `system.md` is 500,426 bytes. Everything below is planned, not observed.
- **Visuals:** VIS-01 to VIS-03 are Pending in the spec: no capture, no hash, and no expected design exists (the Foundation has no pagination component). This plan produces behavior and computed-style evidence only; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns. The contract approval alone grants no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance and its one limit.** The owner's answer is recorded once for all 11 Round 5 specs (L5) with no per-spec digest, so the spec digest binds the bytes derived from the approved draft plus the recommended answers. The plan accepts that as provenance; a reviewer who wants an exact-digest confirmation can ask for it before G1. Nothing here upgrades it.
3. **G3 — Registry.** Two new concepts (`page-count`, `page-href`) and four usages on approved entries (`accessible-name`, `primary-value`, `localized-messages`, `navigation-intent`). OQ-5 approved the concepts and the page-number payload as a convention decision, but the entries ship `proposed` with `approval: null` unless D2 is granted; both paths are valid and green. No existing `types.ts` changes, so no existing usage `revision` is refreshed.
4. **G4 — Recipe, tokens and files.** Recipe R1 and the geometry are approved (OQ-6). No token, dependency, Radix package or stylesheet is added. **No stylesheet**: `pagination.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical, conditional on the emission and cascade proof of §4 (spec §6). Every utility is a static literal in a CVA string composed per part with `cn()`; no inline style, interpolated class or new AGENTS.md exception. Two readings are flagged for confirmation at G1 (§13, plan-level choice c): `Highlight` in the forced-colors rows is a CSS system-colour keyword, not a token (precedent: Carousel `types.ts:185`, ColorSwatchGroup); and `no-underline` on the links is a static utility the spec does not list (§3 and Risk 2c).
5. **G5 — Appearance is arithmetic until measured.** The 32px and 44.8px targets, the 12.8px arrows and the wrap behavior come from token arithmetic (spec §6). Their browser proof needs its own authorization (§9). If a computed value disagrees, **stop and return**: that is a spec amendment, not a plan tweak.
6. **G6 — Cascade and emission are proved, not assumed.** The focus ring beating R1's shadow, the `aria-[current=page]:` variants, the forced-colors rules and the `pointer-coarse:` rules are proved on the preview build and the packed build (§4 E1, E2, §5.5), and the focus test must be shown able to fail.
7. **G7 — Integration ownership.** Registry JSON and generated view, the system artifact, catalog source and outputs, the barrel, package harnesses, docgen and Controls pins, `.storybook/main.ts` and changelogs are parent-owned integration surfaces, as in the StepMeter and Carousel plans. A writer touches only the six Pagination files.
8. **G8 — Stop lines** are listed in §14.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/molecules/pagination/types.ts` | Writer | `PaginationProps` (`Omit<ComponentPropsWithoutRef<'nav'>, 'children' \| 'aria-label' \| 'aria-labelledby' \| 'role'>` plus the six own props), `PaginationMessages`, `defaultPaginationMessages`; English JSDoc with one `@control` per prop (`label` text; `value` and `pageCount` number; `getHref`, `onNavigate` and `messages` `false` with concrete reasons) and no `@default`; static CVA recipes per part (§3) | +120 |
| `packages/ui/src/molecules/pagination/usePagination.ts` | Writer | Normalization (floor, clamp), the five exact warnings, the pure window derivation, `getHref` validation per rendered control, message fallbacks, protected-attribute stripping (NavList's pattern), the `onNavigate` adapter, per-part `cn()` | +170 |
| `packages/ui/src/molecules/pagination/Pagination.tsx` | Writer | JSX only: `null` when nothing renders; `nav` > `ul` > `li` items (Previous or placeholder, pages, ellipses, Next or placeholder) with decorative `Icon` arrows | +65 |
| `packages/ui/src/molecules/pagination/Pagination.test.tsx` | Writer | Steps R1 to R12 (§4) | +600 |
| `packages/ui/src/molecules/pagination/Pagination.stories.tsx` | Writer | `Molecules/Pagination`: `Default`, `Window`, `ClientRouting`, `Localized` (§6) | +150 |
| `packages/ui/src/molecules/pagination/index.ts` | Writer | `export { Pagination } from './Pagination'; export type { PaginationMessages, PaginationProps } from './types';` and nothing else (Carousel's `index.ts` precedent: no variants, no hook, no `defaultPaginationMessages`) | +2 |
| `packages/ui/src/index.ts` | Parent | `export * from './molecules/pagination';` between `./molecules/page-header` (baseline `:75`) and the Panel type exports (`:76`) | +1 |
| `.storybook/main.ts` | Parent | `documentedNativeProps.pagination` beside `navList` (baseline `:117`): proposed `['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'onClick']` (the NavList and TabBar list); the final list is set from the extraction test's real rows | +1 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | Pagination extraction test (beside PageHeader `:1159`); `'./molecules/pagination'` between `:2136` and `:2137`; `'Pagination'` between `'PageHeader'` (`:2277`) and `'Panel'` (`:2278`); the four story names; no variants list changes | +95 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `['Pagination', 'molecules/pagination']` beside NavList (`:20`); control map `pagination: { label: 'text', value: 'number', pageCount: 'number', getHref: false, onNavigate: false, messages: false }` beside `navlist` (`:477`); `pagination: 6` beside `navlist: 3` (`:852`); a retained-rows test modeled on StepMeter's (`:2109`); no `it.each` default-argument row, because there is no `@default` | +40 |
| `packages/ui/src/lib/storybook-css.test.ts` | Parent | E1 emission and E2 cascade on the preview build (§4), modeled on the `declarationAfter` pattern (`:485`) and `rule()` (`:156`) | +95 |
| `scripts/package-exports.test.mjs` | Parent | `'Pagination'` between `'PageHeader'` (`:6058`) and `'Panel'` (`:6059`); `'PaginationMessages'`, `'PaginationProps'` between `'PageHeaderProps'` (`:6536`) and `'Panel'` (`:6537`); a built-CSS emission test and an SSR test modeled on StepMeter's (`:861`, `:925`) and NavList's (`:2616`); no variants list changes | +150 |
| `scripts/package-consumption.test.mjs` | Parent | Packed fixtures modeled on StepMeter's (imports `:97-98`, samples `:569-618`) and its CSS assertion (`:5303`): positive sample, `@ts-expect-error` negatives, `assertPaginationConsumerCSS`, an SSR assertion | +130 |
| `skills/_shared/prop-naming.json` | Parent | Append `page-count` and `page-href`, and the four usages (§5.1) | +95 |
| `scripts/prop-naming.test.mjs` | Parent | `postReceiptProposals` (`:855`) gains two ids; `postReceiptUsages` (`:59`) gains six pairs; the total 185 → 187 (`:2309`); one Pagination test modeled on StepMeter's (`:1717`) | +70 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ ±30 long lines |
| `docs/components/pagination/v0.1/prop-naming-approval.json` | Parent | Only if D2 is granted (§5.1) | +60 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Pagination test modeled on StepMeter's (`:556`) | +65 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1–2 minified lines; ≈ ±40 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | One new row after PageHeader (baseline `:65`), then one `build_catalog.py` run (§5.4) | +1; ≈ +6 generated |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | One bullet each under the existing never-packed sections (§7) | +5; +3 |
| `docs/components/pagination/v0.1/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED and GREEN output, browser table, hashes (§9) | +115 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: `packages/ui/src/styles/compiled.css` (its `@source "../molecules/**/types.ts"` glob at `:53` already scans the new `types.ts`; atoms are listed one by one, molecules are not); `.storybook/preview.css` (its `../packages/ui/src/molecules/**/*.stories.tsx` globs at `:19` and `:64`); `packages/ui/src/styles/legacy/bundle.css`; `packages/tokens/**`; every `package.json`, version and the lockfile; `packages/mcp/**` (its README examples embed only AspectRatio, a filtered HomeTemplate list and the package versions, none of which moves, so `pnpm test:mcp` is a PRESERVE check, not an edit); `packages/cli/**`; `packages/effects/**`; the sources of Chip, Button, IconButton, Link, NavList, Carousel, Tabs, Surface and Icon (read-only references); other lanes' files; frozen documents; this spec and its approval record.

## 3. Design of the change

**API.** Exactly spec §3: `label`, `value`, `pageCount`, `getHref` (required), `onNavigate`, `messages` (optional), over `Omit<ComponentPropsWithoutRef<'nav'>, 'children' | 'aria-label' | 'aria-labelledby' | 'role'>`; no ref, no `asChild`, no state. `style` is not protected by the spec, so it reaches the `nav` like any native attribute. JSDoc is English, with `@control text` on `label`, `@control number` on `value` and `pageCount`, and `@control false` plus a concrete `@controlReason` on `getHref`, `onNavigate` and `messages` (the reasons point at `ClientRouting` and `Localized`). No `@default` anywhere: the fallbacks (`Previous`, `Next`, `Page n`) are derived rules described in the `messages` body, not constants.

**Indicative shape.** The writer's code is reviewed against the approved spec, not against this excerpt. Biome style: single quotes, 120 columns, no trailing commas, `type` never `interface`, no `any`.

```ts
// types.ts — static CVA literals per part; every utility is a whole class name the scanner and the artifact read
export const paginationVariants = cva('eg-pagination');
export const paginationListVariants = cva('m-0 p-0 list-none flex flex-wrap items-center justify-center gap-1');
export const paginationLinkVariants = cva(
  [
    'box-border inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-md px-2 border border-solid border-transparent',
    'pointer-coarse:min-h-14 pointer-coarse:min-w-14 font-display text-meta text-fg-secondary no-underline',
    'transition-colors duration-(--duration-fast) ease-(--ease-out) motion-reduce:transition-none hover:bg-surface-2 hover:text-fg-default',
    'aria-[current=page]:border-state-selected aria-[current=page]:[background:var(--gradient-chip-active),var(--color-surface-1)] aria-[current=page]:shadow-[var(--shadow-edge-strong)] aria-[current=page]:text-fg-default',
    'focus-visible:outline-none focus-visible:shadow-focus aria-[current=page]:focus-visible:shadow-focus',
    'forced-colors:focus-visible:outline-solid forced-colors:focus-visible:outline-(length:--focus-width) forced-colors:focus-visible:outline-[color:Highlight]',
    'forced-colors:aria-[current=page]:outline-solid forced-colors:aria-[current=page]:outline-(length:--focus-width) forced-colors:aria-[current=page]:outline-[color:Highlight]'
  ],
  { variants: { kind: { page: 'tabular-nums', step: 'uppercase' } }, defaultVariants: { kind: 'page' } }
);
// plus an ellipsis recipe (`text-fg-muted`, link geometry) and a placeholder recipe (link geometry, no hover, `data-[disabled]:opacity-45`)
```

```ts
// usePagination.ts — the only place that normalizes, validates, derives the window and builds the link models
type Slot = number | 'start' | 'end'; // 'start' and 'end' are the two ellipses; every other slot is a page number

function pageWindow(pageCount: number, value: number): Slot[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (value <= 4) return [1, 2, 3, 4, 5, 'end', pageCount];
  if (value >= pageCount - 3) return [1, 'start', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, 'start', value - 1, value, value + 1, 'end', pageCount];
}
// Each invalid input warns on its own, development only: `Pagination requires ${what}. Nothing was rendered.` with what =
// 'a non-empty label' | 'a finite numeric value' | 'a finite numeric pageCount' | 'a getHref function' |
// 'getHref to return a non-empty string for every rendered page' (the exact texts of spec §4).
// href values are resolved once per render for the controls actually rendered (Previous, pages, Next); one invalid
// return voids the whole render; placeholders and ellipses never call getHref.
```

```tsx
// Pagination.tsx — JSX only; the hook returns a model or null
export const Pagination: FC<PaginationProps> = (props) => {
  const { model } = usePagination(props);
  if (!model) return null;
  return (
    <nav {...model.rootProps}>
      <ul {...model.listProps}>{model.items.map((item) => <li key={item.key} {...item.itemProps}>{/* link | placeholder | ellipsis */}</li>)}</ul>
    </nav>
  );
};
```

The `ul` carries `role: 'list'` in the hook's props object, not as a JSX attribute, following `useSocialLinks.ts:132` and StepMeter's R-12 reasoning, so Biome's JSX accessibility rules never see a redundant role; `pnpm lint` on the final files decides, and a rule that disagrees is reported, never silenced (spec §2: "the plan checks the role against the lint rules"). Keys are stable (`previous`, `page-n`, `start`, `end`, `next`), so a rerender that keeps a control keeps its DOM node and its focus. No `useId`, effect, ref or browser API: server and client markup match. The arrows are `Icon` at `size="sm"` with `rtl:rotate-180` passed through `className`, as Carousel passes its arrow rotation (`Carousel.tsx:25`).

**Emission inventory.** Each static utility, the declaration it must emit, and where it is proved:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `border`, `border-solid`, `border-transparent`, `rounded-md` | `border-width: 1px`, `border-style: solid`, `border-color: transparent`, `border-radius` from `--radius-md` | E1 |
| `min-h-10`, `min-w-10`, `px-2`, `gap-2` | `min-height`, `min-width`, `padding-inline`, `gap` from `--spacing` (`--space-1`, 3.2px) times 10, 10, 2, 2: 32px minimums | E1; PG-15 browser |
| `pointer-coarse:min-h-14`, `pointer-coarse:min-w-14` | `@media (pointer: coarse)` rules with 14 spacing units: 44.8px | E1; PG-15 browser |
| `font-display`, `text-meta`, `tabular-nums`, `uppercase` | `font-family` from `--font-display`; size and line height from `--text-meta`; `font-variant-numeric: tabular-nums`; `text-transform: uppercase` | E1 |
| `text-fg-secondary`, `text-fg-muted`, `hover:bg-surface-2`, `hover:text-fg-default` | colours and background from the tokens; hover inside `@media (hover: hover)` as the installed Tailwind emits it | E1 |
| `aria-[current=page]:border-state-selected` | `border-color: var(--color-state-selected)` only under `[aria-current="page"]` | E1 |
| `aria-[current=page]:[background:var(--gradient-chip-active),var(--color-surface-1)]` | `background: var(--gradient-chip-active), var(--color-surface-1)` only under the aria selector | E1 |
| `aria-[current=page]:shadow-[var(--shadow-edge-strong)]`, `aria-[current=page]:text-fg-default` | `--tw-shadow: var(--shadow-edge-strong)` with `box-shadow`, and the default foreground, only under the aria selector | E1 |
| `focus-visible:outline-none`, `focus-visible:shadow-focus`, `aria-[current=page]:focus-visible:shadow-focus` | `--tw-shadow: var(--shadow-focus)`; the compound selector requires both `[aria-current="page"]` and `:focus-visible`, strictly more specific than R1's shadow rule, so the ring wins | E1, E2 and the failing-focus proof |
| `transition-colors`, `duration-(--duration-fast)`, `ease-(--ease-out)`, `motion-reduce:transition-none` | colour and background transition, token duration and easing; `transition-property: none` under `@media (prefers-reduced-motion: reduce)` | E1 |
| `forced-colors:focus-visible:outline-*`, `forced-colors:aria-[current=page]:outline-*` | `@media (forced-colors: active)` rules: `outline-style: solid`, `outline-width: var(--focus-width)`, `outline-color: Highlight`, emitted after the plain `outline-none` rule | E1 and E2 (order); PG-14 emulation |
| `rtl:rotate-180` (on the `Icon`) | a rotate under the installed RTL selector shape | E1 |
| `data-[disabled]:opacity-45` (placeholder) | `opacity: 0.45` only under `[data-disabled]` | E1 |

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts). Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded. A new component has no jsdom RED before its files exist, and a stub would be a dummy file, so R1 fails at import and each later row fails on an assertion after the previous minimal GREEN. Rows marked **guard** pass on their first run and claim no RED. Browser-only geometry, contrast and paint are not claimed from jsdom: their probes sit in §9. Tests use roles and accessible names, `userEvent`, no complete class strings and no `data-testid`. Fixtures use fragment URLs (`#page-n`), so jsdom never reports an unimplemented navigation.

| Step | AC | RED test (file → case) | Expected RED before the change |
| --- | --- | --- | --- |
| R0 | PRESERVE | No edit: NavList, Carousel, Tabs and Icon suites; docgen, Controls and css suites; `props:check`, `test:props`, `artifact --check`, `system:check`, `test:artifact`, `test:system`, `test:mcp` | All green; record the counts |
| R1 | PG-01 | `Pagination.test.tsx`: `getByRole('navigation', { name: 'Editorial pages' })` is a `NAV` with `eg-pagination`; one `getByRole('list')` (a `UL`) of `li`; no `button`, `heading`, `status` or `alert` role; `renderHook(usePagination)` result shape | The whole file fails at import (`./Pagination`, `./usePagination`, `./types` unresolved) |
| R2 | PG-04 | `it.each` over (7, any), (8, 4), (8, 5), (9, 5), (12, 1), (12, 4), (12, 5), (12, 8), (12, 9), (12, 12): ordered slots, exactly seven page-or-ellipsis slots above 7, every ellipsis `aria-hidden` and never one page, the `getHref` spy called only for rendered pages (set equality, never call counts) | After R1's minimal GREEN (landmark and empty list): slots missing or wrong |
| R3 | PG-02, PG-03 | Every control is an `a[href]` equal to `getHref(page)`; `renderToString` carries each `href`; exactly one `aria-current="page"`, on the `value` page, named `messages.page(value)` and still an anchor; no other link has it; no `onClick` or `role="button"` | No links render until the link model exists |
| R4 | PG-05 | Previous targets `value − 1` and Next `value + 1` with `rel="prev"` and `rel="next"` and the message texts; at page 1 and at `pageCount` the placeholders are `aria-hidden`, `data-disabled`, without `href`, outside the tab order (`userEvent.tab()` counts); `queryByRole('link', { name: 'Previous' })` is null at page 1 | A boundary renders a link or nothing |
| R5 | PG-06 | Table: `value` 3.9 → 3, 0 → 1, 99 → `pageCount`, −5 → 1; `pageCount` 12.9 → 12 pages, 1.9, 1, 0 and −3 → nothing; `console.warn` never called | Unnormalized values reach the hrefs |
| R6 | PG-07 | Blank, whitespace-only and non-string `label`; NaN, ±Infinity and string `value` or `pageCount`; non-function `getHref`; `getHref` returning `''`, whitespace, a number or `undefined` for a rendered page: the exact warning of spec §4, an empty container, a later valid rerender renders, a production guard emits nothing (StepMeter SM-04 pattern, `console.warn` spy) | An unnamed or unlinkable landmark renders and nothing is warned |
| R7 | PG-08 | `userEvent.click` and `fireEvent.click` with `ctrlKey` on Previous, a page and Next: `onNavigate(page, event)` once with the React event; `defaultPrevented` false unless the consumer prevents it; a consumer `preventDefault` stops the navigation; placeholders and ellipses never call it; rerenders never call it | `onNavigate` never fires |
| R8 | PG-09 | Defaults `Previous`, `Next`, `Page n`; partial, blank and non-string entries fall back independently; a throwing or blank `page` formatter falls back for that link; the visible digits stay `String(page)`; the `Results page 3`, `Newer`, `Older` fixture | Custom messages are ignored, or a throwing formatter crashes the render |
| R9 | PG-10 | `userEvent.tab()` order Previous, pages, Next; `{Enter}` activates (with a prevented click, so jsdom does not navigate); no `tabindex` attribute; placeholders and ellipses are not tab stops; focus stays on the same element across a rerender | **Guard**: native anchors satisfy it from R3; no RED is claimed |
| R10 | PG-11 | `expectTypeOf` excludes `children`, `role`, `aria-label`, `aria-labelledby`, `ref` and `asChild`; untyped runtime injection of those and of `dangerouslySetInnerHTML` is dropped; `id`, `data-*`, `aria-describedby` and `className` reach the root; `className` merges last; the marker survives | Injected `role`, `aria-label` and `children` reach the DOM until the hook strips them |
| R11 | PG-12 (unit), PG-15 (classes) | `toHaveClass` on the spec §6 invariants per part: ghost rest, `hover:bg-surface-2`, the R1 `aria-[current=page]:` utilities, the compound focus shadow, `motion-reduce:transition-none`, the forced-colors utilities, `pointer-coarse:*`, `no-underline`; absent: `is-*` state classes, `style`, `animate-`, transform utilities, literal colours; `text-meta` and `text-fg-secondary` both survive `cn()` | **Guard** for utilities present since `types.ts`; RED only for any not yet present |
| R12 | PG-16 (SSR) | `renderToStaticMarkup(<Pagination … />)` equals the client container markup | **Guard** (no ids, no effects) |
| R13 | PG-16 (metadata) | Docgen and Controls pins edited first: the Pagination extraction test, the barrel module list, the runtime names, the four story names, the `pagination` control map, own-prop count 6, no default-argument injection | The barrel lists differ from the real barrel; the extraction cannot find `Pagination.tsx`; Controls fail until the stories exist |
| R14 | PG-12 (emission), PG-15 (static) | `storybook-css.test.ts` E1 and E2 on the preview build (below) | The Pagination utilities are absent until the files exist; the compound focus rule is absent |
| R15 | PG-12, PG-16 | `package-exports.test.mjs` after `pnpm build`: the built CSS contains every inventory selector and declaration (`cssBlock`, `:671`), no `.eg-pagination {` rule; the package renders the markup by SSR; the export lists gain exactly `Pagination`, `PaginationMessages` and `PaginationProps` | `Pagination` is undefined in the package |
| R16 | PG-16 (packed) | `package-consumption.test.mjs`: packed positive sample, `@ts-expect-error` negatives (missing `label`, `value`, `pageCount` or `getHref`; string `value`; `role`; `aria-label`; `children`; `ref`; `asChild`; a `getHref` returning a number), consumer CSS assertion without a Tailwind compiler | Fails against the baseline packed build; needs D4 |
| R17 | PG-12 (computed), PG-13, PG-14, PG-15 | Scratch browser probes (§9): computed paint, contrast on `surface-0` and `surface-1`, forced colors, geometry and wrap, real keyboard focus | The probe cannot find `Molecules/Pagination` on the baseline build; needs D3 |
| R18 | PG-16 (registry) | `prop-naming.test.mjs` first: total 187, two post-receipt proposals, six post-receipt usages, the new Pagination test; then `props:check` | The counter and usage assertions fail until the entries and usages exist |
| R19 | PG-16 (artifact) | `design-system-artifact.test.mjs` Pagination assertions | No Pagination entry in the committed artifact until it is regenerated |

Coverage check: PG-01 to PG-16 each appear in at least one row; PG-13 and the computed parts of PG-12, PG-14 and PG-15 have no jsdom-expressible failure and stay **Not observed** until D3.

**E1 and E2 — emitted CSS** (`storybook-css.test.ts`): `rule()` matches only flat `selector { … }` blocks, so variant selectors follow the `declarationAfter` pattern used for the existing `aria-[current=page]` utilities and bounded `css.slice` parsing. If the optimizer emits nested CSS, the first RED to GREEN run exposes it and the helper is adapted in the same file. E1: emission and token declarations, including the `(forced-colors: active)`, `(pointer: coarse)` and `(prefers-reduced-motion: reduce)` blocks. E2: cascade, meaning the compound focus selector needs both `[aria-current="page"]` and `:focus-visible` and is more specific than R1's shadow rule, and the forced-colors outline rules are emitted after the `outline-none` rule.

**Failing-focus proof (G6).** Show that E2 can fail: run it once against a scratch copy of the preview build without the compound utility, outside the worktree, and record the failure. Never commit a mutation and never leave scratch inside the repository; the writer names the scratch directory for the parent to remove.

**PRESERVE and differential.** No existing component, helper or parser changes: Pagination is new, and the shared registry entries only gain usages. Evidence that previous behavior holds: the NavList, Carousel, Tabs and Icon suites unmodified and green; `git diff --stat` empty on their folders; the barrel export inventories differ by exactly `Pagination`, `PaginationMessages` and `PaginationProps`; and one differential on a copy of the base commit in `mktemp -d` (not committed) showing the built-CSS selector inventory differs by additions only. Any difference nobody asked for is a regression to fix and pin with a test.

**GREEN order.** `types.ts` → `usePagination.ts` → `Pagination.tsx` → `index.ts` → focused runner → stories → barrel and `.storybook/main.ts` → docgen and Controls pins → E1, E2 → package harnesses → registry → artifact → catalog → changelogs.

## 5. Registry, docgen and artifact obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

The lookup is in spec §3. After the final `types.ts` is reviewed and `pnpm lint` is clean on it, append these two entries. `meaning`, `whenToUse` and `avoid` are the spec's approved wording (spec §3, "Proposed meaning / whenToUse / avoid"), normalized only to sentence case with a final period; D2 asks the owner to confirm that normalization:

```json
{
  "id": "page-count",
  "name": "pageCount",
  "meaning": "Total number of pages of a paginated collection, supplied by the consumer.",
  "whenToUse": "A component navigates between the pages of a collection that the consumer splits and counts, and renders a bounded window of page controls from the current page and this total.",
  "avoid": "Item or entry totals, supplementary item counts (use `count`), step counts of a stepped scale (use `steps`), display overflow thresholds and limits on how many page controls render.",
  "status": "proposed", "approval": null, "aliases": [], "exceptions": [],
  "usages": [{ "component": "Pagination", "type": "number (required; floored, below 2 renders nothing)", "status": "existing",
    "source": { "path": "packages/ui/src/molecules/pagination/types.ts", "symbol": "PaginationProps", "revision": "sha256:<whole-file hash of the reviewed final types.ts>" } }]
}
```

```json
{
  "id": "page-href",
  "name": "getHref",
  "meaning": "Function that returns the native destination URL of one page of a paginated collection; called during render with an integer page and expected to be pure.",
  "whenToUse": "A component renders crawlable anchors from a derived sequence of pages, so the consumer encodes route and filter state into each URL.",
  "avoid": "Click interception or routing (use `onNavigate`), destinations supplied as entry data (use an entry's `href` inside `items`), parsing the current location, and side effects.",
  "status": "proposed", "approval": null, "aliases": [], "exceptions": [],
  "usages": [{ "component": "Pagination", "type": "(page: number) => string (required)", "status": "existing",
    "source": { "path": "packages/ui/src/molecules/pagination/types.ts", "symbol": "PaginationProps", "revision": "sha256:<same hash>" } }]
}
```

Then append one usage to each approved entry, all `status: "existing"` with the same `source`: `accessible-name` (`string (required)`), `primary-value` (`number (required; floored and clamped to 1..pageCount)`), `localized-messages` (`Partial<PaginationMessages>`) and `navigation-intent` (`(page: number, event: MouseEvent<HTMLAnchorElement>) => void`, the page-number payload OQ-5 approved; the existing entry text and hash do not change). Append, never reorder. All six usages carry the same hash; hash only after `types.ts` is final and lint is clean, and re-hash after any later edit, even formatting. No exception is requested and no existing convention changes status.

**D2 receipt.** The spec carries the exact `meaning`, `whenToUse` and `avoid` of both concepts, so the owner's OQ-5 answer already covers the wording. If D2 is granted, the parent records `docs/components/pagination/v0.1/prop-naming-approval.json` on the Text v0.3 precedent (`docs/components/text/v0.3/prop-naming-approval.json`): a `human-approval-record` that cites the owner answer and the spec digest, with one entry per concept whose `scope` is `convention:page-count` or `convention:page-href` and whose `contentHash` is `conventionHash` of the **approved** form, because the hash includes `status`. Each registry entry then sets `status: "approved"` and `approval: { reference, scope, contentHash }`. The validator checks structure and hashes, never consent. If declined or unanswered, both entries ship `proposed` with `approval: null`, as six entries already do (`field-message-content`, `field-guidance-tone`, `panel-accent-edge`, `dialog-title-overflow`, `dialog-action-placement`, `step-count`).

### 5.2 Registry tests and generated view

In `prop-naming.test.mjs`: add `'page-count'` and `'page-href'` to `postReceiptProposals` (a post-receipt entry, approved or proposed); add the six `{ conventionId, source: 'packages/ui/src/molecules/pagination/types.ts#PaginationProps' }` pairs to `postReceiptUsages`; change the total at `:2309` from 185 to 187, assuming Pagination lands before any other registry-adding lane (otherwise recount); add one test modeled on StepMeter's: exact entry fields, `status` and `approval`, exact usages, every `revision` equal to the live file hash, `historicalRegistry` strips them, `validate(registry)`; with D2, a receipt test modeled on "Text truncation binds its scoped owner approval". Then `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`; re-run to find any other pinned count before attributing a failure.

### 5.3 Docgen and Controls

The pins are listed in §2. `documentedNativeProps.pagination` makes docgen show the retained native rows. The extraction test asserts: `label` required string with `control: 'text'`; `value` and `pageCount` required numbers with `control: 'number'`; `getHref` required function, `onNavigate` optional function and `messages` optional `Partial<PaginationMessages>`, each `control: false` with its `controlReason`; no `defaultValue` on any row; absence of `children`, `role`, `aria-label`, `aria-labelledby`, `ref` and `asChild`; the AST has exactly six own props with one `@control` each; `Pagination` is public and the variants, `usePagination` and `defaultPaginationMessages` are not; the story names equal the four in §6; no `argTypes`, no `play`; the registered enhancer injects no argument and reports zero owned diagnostics.

### 5.4 Artifact and catalog

After source, registry and catalog are final: `pnpm artifact --write`, `pnpm system:docs`, then `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system`. Expected diff: a `Pagination` component entry (props `label`, `value`, `pageCount`, `getHref`, `onNavigate`, `messages`; the recipes attributed to Pagination; no `classNameAllows`), `propNaming` +2 entries (187) and the six usages, catalog +1, and `system.md` regenerated. The artifact tests require the components list to equal the barrel exports, the catalog to equal `docs/catalog.json`, and every registry usage to resolve to an artifact component, so the barrel, catalog row, registry and artifact change in the same commits (§10). Expected growth is a few KB against the 786,432-byte budget; report an overflow instead of weakening the test. `pnpm build` regenerates the artifact too, so re-check after it.

Catalog: edit only `scripts/catalog_data.py`, then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. The row goes right after PageHeader, is written after GREEN, and stays honest about what is observed:

```py
("—","—","Pagination","molecule","ui","— (native nav, list and anchors)","Icon","nuevo","Implemented React molecule under the [approved v0.1 contract](components/pagination/v0.1/spec.md): a named navigation landmark of crawlable links over a derived constant-width window (Previous, Next, the current page, ellipses) for long listings. The consumer owns the data slice, `pageCount`, `value` and `getHref`; no state, Radix primitive, stylesheet, ref or asChild. Browser and packed-consumer verification remain pending until observed."),
```

### 5.5 Package fixtures

`package-exports.test.mjs`: the R1 selectors (`aria-[current=page]` border, background and shadow), the compound focus rule, `transition-colors` with the motion-reduce rule, the `forced-colors` and `pointer-coarse` blocks, `min-h-10`, `min-w-10`, `no-underline`, through `cssBlock`; SSR with a valid fixture asserts one `nav.eg-pagination` named by `label`, exactly one `aria-current` link, every `href`, and nothing for invalid input; `Pagination`, `PaginationMessages` and `PaginationProps` appear and `usePagination`, `paginationVariants` and `defaultPaginationMessages` do not. `package-consumption.test.mjs`: typed positive samples, the documented `@ts-expect-error` negatives (R16), `assertPaginationConsumerCSS` and an SSR block. No ref, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness (D4).

## 6. Stories and Controls

`Molecules/Pagination` keeps autodocs, `Meta<typeof Pagination>`, no manual `argTypes`, no `play`. Meta args carry the required props only (`label`, `value`, `pageCount`, `getHref`); no handler is empty, so `onNavigate` uses `action('onNavigate')` from `storybook/actions`. Every story's `getHref` returns a same-document fragment (`#page-7`), so activating a link inside the Storybook iframe never leaves the story. The meta JSDoc has `## Description`, `## Dependencies` (Icon) and `## Usage guidelines` (the consumer owns the slice, the count, the URLs, focus and any announcement); each story has its own JSDoc, in English.

- `Default`: page 6 of 12 inside a grafito `SectionShell` host (`register='grafito'`, a real DS layout host, not documentation chrome). This is the VIS-01 scenario.
- `Window`: four rows with distinct `label` values (first page, middle, last page, and a short `pageCount=5` at `value=5`), showing the boundary placeholders and the absence of ellipses. VIS-02 scenario.
- `ClientRouting`: a story-local component with `useState` (the pattern of Carousel's `ControlledExample`) whose `onNavigate` calls `action`, calls `preventDefault` only for unmodified primary activations and updates `value`, while `getHref` carries an active filter (`#topic=design&page=n`) through every URL.
- `Localized`: a custom `messages` dictionary (`Newer`, `Older`, `Results page n`).
- Controls: the registered enhancer shows `label` as text, `value` and `pageCount` as numbers, and `getHref`, `onNavigate` and `messages` without a widget, with their reasons; no Default column constants; `Default` stays unchanged. Real browser Controls are checked in §9, not inferred from tags.

## 7. Changelog entries

S2 puts new entries under the existing sections of the never-packed release, not under `## Unreleased`: `packages/ui/CHANGELOG.md` `## 0.11.0` → `### Added`, and `packages/system/CHANGELOG.md` `## 0.13.0` → `### Added` (the system release that ships with ui 0.11.0 in `7afaabd`; the file's own `## 0.11.0` is an older, packed release and is not touched). Each section lists newest issue first (#559, #558, #557, #556), so each bullet goes first in its list. English, effect on a consumer, `(#571)` because the request is fully resolved.

```md
<!-- packages/ui/CHANGELOG.md, ## 0.11.0, ### Added, first bullet -->
- `Pagination` renders a named navigation landmark of crawlable links for long listings: Previous and Next, numbered
  pages in a constant-width window of at most seven slots with ellipses, and the current page marked with
  `aria-current="page"`. The consumer owns the data slice, `pageCount`, `value` and the page URLs through `getHref`,
  and any client-side routing, focus move or announcement through `onNavigate`; the component keeps no state, has no
  size, variant or tone axis and ships no stylesheet. (#571)
```

```md
<!-- packages/system/CHANGELOG.md, ## 0.13.0, ### Added, first bullet -->
- The source-derived artifact and reference include `Pagination` (its props and static recipes), the `page-count`
  and `page-href` naming concepts (proposed unless their receipt is recorded) and the new `accessible-name`,
  `primary-value`, `localized-messages` and `navigation-intent` usages. (#571)
```

`release.json` `resolves` will gain #571 for both packages at the next clean `release:pack` (T7), because the bullets sit in versioned sections. No version moves and there is no `effects`, `mcp`, `cli` or `tokens` entry. If the owner narrows the delivery, write `Refs #571` instead (D5).

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/molecules/pagination --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/molecules/nav-list packages/ui/src/molecules/carousel packages/ui/src/molecules/tabs packages/ui/src/atoms/icon --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/tokens packages/ui/src/styles packages/ui/src/molecules/nav-list packages/ui/src/molecules/carousel packages/ui/src/molecules/tabs packages/ui/src/atoms
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

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` writes package outputs and regenerates the artifact, so the freshness checks run again after it. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache (D4); it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler, and an unavailable matrix is recorded as pending. `pnpm test:package-release` and `pnpm test:mcp` are PRESERVE checks (no version or changelog structure moves); `test:mcp` joins CI under T4, which is still pending, so run it here regardless. The CI gate as recorded in the Carousel plan runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and are run here because `@egdev/system` ships. Every result is recorded per command with exit code and test counts in the evidence file; jsdom, docgen and HTML smoke prove no appearance, focus visibility, contrast or screen-reader behavior, and none is claimed.

## 9. Browser and capture procedure

Only after separate permission to start `pnpm storybook` (it builds tokens first) and to use Playwright MCP, following the [capture guide](../../../design/README.md). Probes and any scratch build live in a `mktemp -d` directory outside the repository, and their output is copied into `implementation-evidence.md`. Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion and forced-colors settings, pointer emulation, crop and date for every observation. Stories: `molecules-pagination--default`, `--window`, `--client-routing`, `--localized`.

1. **PG-12 computed style.** At rest a link has a transparent background and border and the `fg-secondary` colour; on hover the `surface-2` background; the current page has the `--color-state-selected` border, the chip-active gradient over `surface-1`, the edge shadow and the default foreground; no `transform`; under `prefers-reduced-motion: reduce` the computed `transition-property` is `none`.
2. **Focus (PG-10, PG-12).** Real keyboard Tab onto a non-current link and onto the current link: the computed `box-shadow` carries the focus layers and blur restores the rest state; the focused current page shows the focus shadow, not R1's edge alone. Enter on a focused link activates it (a same-document fragment in the stories).
3. **PG-13 contrast.** Computed contrast on `surface-0` and `surface-1`: the current page's border at 3:1 or more against both neighbours, text at 4.5:1 or more. The spec's hand-computed figures are not evidence. Contrast over the translucent grafito host stays Not evaluated.
4. **PG-14 forced colors.** Chromium `forced-colors: active` emulation (not a real Windows contrast session): the current page and the focused link compute a solid outline of `--focus-width` in `Highlight`, and the transparent border is painted. In the spec's recipe the focused current page and the unfocused current page share one outline, so VIS-03 records what a keyboard user actually sees; a distinct focus treatment would be a spec amendment. Firefox and real High Contrast stay Not evaluated.
5. **PG-15 geometry.** Every visible control is at least 32px high and wide under a fine pointer and at least 44.8px under coarse-pointer emulation; at a 320px host the row wraps with no horizontal overflow and stays centred. Informational, not a criterion: the row width for `value` 1 to 12 at `pageCount=12`, to show whether the constant slot count also keeps the pixel width steady.
6. **PG-04, PG-05.** The seven-slot windows and the boundary placeholders render as the fixtures say; no placeholder or ellipsis is focusable.
7. **PG-16 Controls.** In `pnpm storybook`: `label` is a text control, `value` and `pageCount` are number controls, the three function-like rows have no widget and show their reasons, the Docs Default column is empty, and there are no diagnostics.
8. **Captures VIS-01 to VIS-03**, only if authorized: component-zone PNGs under `docs/components/pagination/v0.1/` named `<variant>--<state>--<viewport>--<theme>.png` (for example `default--page-6-of-12--1280x900--dark.png`), with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, never approved expected design, until the owner adopts exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. A GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture exists and no expected design exists, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English. Each commit passes the pre-commit Biome and typecheck hooks and the pre-push `pnpm test`. The slices exist for review and bisect.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the Pagination core (#571)` | `types.ts`, `usePagination.ts` (normalization, window, link models), `Pagination.tsx`, `index.ts`; tests R1 to R4; the folder is not exported yet | ≈ 417 |
| 2 | `feat(ui): validate Pagination input and messages (#571)` | Warnings, `getHref` validation, message fallbacks, `onNavigate`; tests R5 to R8 | ≈ 265 |
| 3 | `feat(ui): protect Pagination semantics and the root class (#571)` | Protected-attribute stripping; tests R9 to R12 | ≈ 275 |
| 4 | `feat(ui): publish Pagination with stories, metadata pins and its catalog row (#571)` | `Pagination.stories.tsx`, barrel, `.storybook/main.ts`, docgen and Controls pins, catalog row, regenerated artifact and catalog | ≈ 288 (+ ≈ 50 generated) |
| 5 | `test(ui): prove the Pagination emission and packed consumption (#571)` | `storybook-css.test.ts` E1 and E2, `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 375 |
| 6 | `feat(ui): register the Pagination naming conventions (#571)` | Registry entries and usages, `prop-naming.test.mjs`, artifact assertions, the receipt if D2, regenerated view and artifact | ≈ 230 (+ 60 with D2; + ≈ 30 generated) |
| 7 | `docs(pagination): record the v0.1 implementation evidence (#571)` | `implementation-evidence.md`, both changelog bullets, the odd log, and `capture.json` with PNGs only if authorized | ≈ 129 |

The barrel, the catalog row and the regenerated artifact stay together in commit 4 and the registry follows in commit 6, because the artifact tests tie components, catalog and registry usages together; regenerate in both. If commit 1 passes about 450 lines, move R4 into commit 2; if commit 5 does, move the consumption additions after it. If a whole-repo test unexpectedly fails on the unexported folder between commits 1 and 4, merge commits 1 to 4 instead of weakening the test. The registry steps always follow the final bytes of `types.ts`. A failing RED commit is never made.

## 11. Estimated changed lines

About **1,979 hand-written changed lines** (range 1,800 to 2,400; 2,039 with the D2 receipt): component folder ≈ 1,107 (`types.ts` 120, hook 170, `Pagination.tsx` 65, `index.ts` 2, tests 600, stories 150) and integration ≈ 872 (barrel and `.storybook/main.ts` 2, docgen 95, Controls 40, css 95, package-exports 150, package-consumption 130, registry 95, prop-naming test 70, artifact test 65, catalog row 1, changelogs 8, evidence 115, odd log 6). Plus about 80 generated lines (the minified artifact counts as 1 to 2 lines but several KB; `system.md` ≈ 40; `prop-naming.md` ≈ 30; catalog ≈ 6). For calibration, the StepMeter atom with three props was planned at ≈ 1,250 and its lane commit `ea26078` touched 64 files with +6,395 across four lanes.

## 12. Risks

- **Risk 1 — Cascade.** Equal-specificity rules on the current page and the focused link can hide the focus ring or the forced-colors outline. The compound selector, the emission order of the `forced-colors:` rules after `outline-none`, and their failing-focus proof must be shown on the emitted build, not inferred from class order or `twMerge`.
- **Risk 2 — Spec silences with consequences** (reviewer can veto each at G1, §13): (a) the precedence when several inputs are invalid, or `pageCount` is below 2 while `label` is blank; (b) a custom `page` formatter that returns a name without the visible digits, which would break WCAG 2.5.3 although the spec only defines fallback for blank or throwing results; (c) the underline of the anchors, since no shipped reset removes the user-agent underline and NavList, Chip link, SectionNav and TabBar all set `no-underline`; (d) geometry of the ellipsis and the placeholders, which the spec leaves open beyond dimming and `text-fg-muted`.
- **Risk 3 — Forced-colors focus.** The spec gives the focused link and the current page the same outline, so focus on the current page is indistinguishable from its unfocused state in forced colors; PG-14 checks presence, not distinction. The transparent border painted in forced colors is general knowledge until PG-14 runs, and a real Windows session stays pending.
- **Risk 4 — Geometry.** The 32px and 44.8px targets, the wrap and the 12.8px arrows are token arithmetic. A disagreement is a spec amendment (G5).
- **Risk 5 — Registry coupling.** Six usages share one `types.ts` revision: hash last and re-hash after any formatting change. The pins (187 entries, the two post-receipt lists, own-prop count 6) depend on lane order; if another Round 5 lane adds registry entries first, recount instead of editing blindly.
- **Risk 6 — Parallel lanes, shared files.** The barrel, `prop-naming.json`, `docs/prop-naming.md`, the artifact, `system.md`, `catalog_data.py` and its generated files, both changelogs and the docgen, Controls and package-harness lists are touched by other Round 5 lanes. T6 is sequential, so expect rebase conflicts only if that changes: regenerate generated files instead of hand-merging, re-verify this plan's baseline hashes at the start, and keep the newest-issue-first changelog order.
- **Risk 7 — Impure `getHref` and StrictMode.** The function may run more than once per render and warnings can fire twice. Tests assert the set of called pages and the exact warning texts, never call counts under StrictMode, and the JSDoc states that `getHref` must be pure.
- **Risk 8 — Lint on the role.** `role="list"` on a `ul` may trip a Biome accessibility rule; it is set in the hook's props object (SocialLinks precedent) and `pnpm lint` decides; a rule that disagrees is reported, not silenced.
- **Risk 9 — Story typing and hosting.** `ClientRouting` needs a story-local component for `useState`; the grafito `SectionShell` host and the row must not need a utility outside the existing globs. The `*.stories.tsx` glob is preview-only and proves nothing for the package.
- **Risk 10 — Artifact budget.** 610,264 of 786,432 bytes; the growth is expected to be a few KB. An overflow is reported, never absorbed by weakening the test.
- **Risk 11 — Permissions.** Browser observations (D3) and the packed React 18.3.1 and 19.3.0 matrix (D4) stay **Not observed** until separately authorized and run; types, SSR and docgen output are not a substitute.
- **Risk 12 — Not evaluated by this plan:** screen-reader output (including how VoiceOver announces the list under the list-style reset and `aria-current` on a link), RTL appearance of the physical arrows, zoom and reflow in real browsers, contrast over translucent hosts, Firefox and real High Contrast, protan and deutan simulations.

## 13. Pending owner decisions

No token, dependency, Radix or Material decision is pending: R1, the geometry and the recipe were approved with the spec, and every utility is token-backed.

1. **D1 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it.
2. **D2 — Registry receipt for `page-count` and `page-href` (recommended: record it at implementation).** The approved spec already carries each entry's `meaning`, `whenToUse` and `avoid`, so the receipt binds wording the owner approved in OQ-5; confirm that reading and the sentence-case normalization of §5.1. If declined, both entries ship `proposed` with `approval: null`. The `navigation-intent` usage needs no receipt.
3. **D3 — Browser observations and captures (recommended: yes).** Starting `pnpm storybook` and using Playwright MCP are needed for PG-12 (computed), PG-13, PG-14, PG-15 and the Controls widgets. Without it those rows stay **Not observed**. Capturing VIS-01 to VIS-03, and adopting any capture as expected design, are separate decisions.
4. **D4 — Packed consumers (recommended: yes).** `pnpm test:package-consumption` packs and installs isolated fixtures and needs install and network permission and a known cache; without it PG-16's React 18.3.1 and 19.3.0 evidence stays **Not observed** (offline alternative: `EGDEV_CONSUMER_OFFLINE=1`).
5. **D5 — Issue citation.** The bullets cite `(#571)`, which marks the issue fully resolved and puts it in `release.json` `resolves`. Document-head `rel="prev"` and `rel="next"` tags and indexing policy are consumer-owned non-goals of the spec; if the owner reads them as leaving #571 open, write `Refs #571` instead.
6. **D6 — Publishing the snapshot.** Choosing the canonical component issue and publishing v0.1 as a comment is a separate GitHub authorization, not required before code.
7. **D7 — Harness location (recommended: scratch only).** Browser probes live in a `mktemp -d` directory and their output is copied into the evidence file; a committed script is the alternative.

Plan-level choices a reviewer can veto at G1: (a) every invalid input warns on its own, including when `pageCount` is below 2, and the quiet no-op applies only when all inputs are valid; (b) a `page` formatter whose result lacks the digits is consumer-owned, documented in the `messages` JSDoc and not enforced, because enforcing it would change a promise; (c) `no-underline` and the `Highlight` keyword are static utilities, the first with four precedents; (d) placeholders share the link geometry and typography without hover and carry only `data-[disabled]:opacity-45`, and the ellipsis shares the link's minimum size; (e) `getHref` results are computed once per render for the rendered controls, with set-based tests; (f) `role: 'list'` lives in the hook's props object; (g) the changelog placement: ui `## 0.11.0`, system `## 0.13.0`, newest first.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, capture, release or Git action is taken or implied. Stop and return to the owner if: a utility does not emit, or cascades differently from §3 (the focus ring loses to R1, or a forced-colors rule is emitted before `outline-none`), because a stylesheet, `!important` or an inline style needs a spec amendment; computed geometry disagrees with the spec's arithmetic; a generator demands an edit outside §2; `props:check` fails for a reason other than stale revisions, or a convention would be marked `approved` without D2; docgen or Controls report owned-metadata diagnostics; an existing NavList, Carousel, Tabs or Icon case must change to pass; a token, dependency, Radix package, stylesheet or inline style appears necessary; the artifact exceeds 768 KiB or its diff shows sections this plan does not expect; Biome rejects `role="list"` and only a silence would pass; or a whole-repo test fails on the unexported folder and cannot be fixed without weakening it.
