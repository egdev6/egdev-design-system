# Prose v0.1 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, test, token edit, registry write, generated file, catalog, dependency, capture, release, Git or GitHub action. Nothing below is implemented or measured: preparation was read-only inspection and digest checks; no build, test, generator, Storybook, browser or capture ran.
- **Coverage:** S4 (#569) and S2 at the plan gate of T6 in [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md): the new `Prose` primitive and its owner-confirmed `--container-prose` token with the `@egdev/tokens` release effect; the other ten round 5 specs have their own plans. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) and [EmptyState v0.1](../../empty-state/v0.1/implementation-plan.md) plans; the new-component integration obligations follow the [StepMeter v0.1](../../step-meter/v0.1/implementation-plan.md) plan. The token precedent is Tabs v0.4's `--mask-scroll-fade-inline` (count pins at `token-contract.test.mjs:53` and `package-consumption.test.mjs:10531`; released as tokens 0.6.0 with the owner's confirmation, `odd/tasks/release-ui-0.4.0.md` S1). Commits land on `integration/round-5` (the parent commits; the writer never switches branches or commits) and cite `Refs #569`, never `Closes`; the PR is T7's.
- **Contract authority:** [spec.md](spec.md) v0.1, Approved on 2026-11-26 and amended on 2026-11-27 (the inline-code selector now reads `code:not(pre code)`, [approval.md](approval.md) Amendment 1), `contentSHA256: c17faa96af1ed45efe0e084e784307d8dfad7e2484bc4ded1bc556061d7f1674` (originally approved payload `bd1ec5015090608aed7cc0c39fd71ba960f210ec397ad25d08327c916e63abd2`; draft payload `6976e8d471012920668cdd611ce86329f8b056d383fc62abfa8eba19118e2ed3`), reproduced byte-exact in this working tree by two independent methods with the spec's own rule (payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline; the same heading text also appears inline in the metadata, so an anchored match is required: `awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`). Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)", 2026-11-26, given on the committed draft (`8f50f0b`) with the recommended answers to OQ-1 to OQ-8 (`odd/tasks/round-5-consumer-requests.md` L5); token confirmation, verbatim "Sí, 65ch (Recomendado)" (same entry); cataloging approval L3. Visual hashes: VIS-01 to VIS-03 Pending. Recover and compare the digest again before any edit; a different digest stops the work. Resolved decisions this plan carries: `--container-prose: 65ch`, named exactly so (utility `max-w-prose`); `size` `'sm'` or `'md'` (default `md`, the 16px step), `tone` `'canvas'` or `'raised'` (default `canvas`, inline-code colour only); the four Prose-specific Material recipes (`pre` well, `surface-2` table header band, 2px `blockquote` start filet, hairline `hr`); inline code `font-mono text-code` in the brand colour by tone; body colour inherited from the host; `h2` to `h4` only; wide tables are the converter's concern; nesting recipe-owning components is forbidden; no stylesheet, Radix package, ref, `asChild`, HTML-string input or `@classNameAllows` tag; two reused approved registry entries, no new convention, no exception; VIS-01 to VIS-03 Pending.
- **Re-approval note (Amendment 1, 2026-11-27):** the Chromium check of the implementation found that the approved inline-code selector `:not(pre) > code` missed a `code` directly under the root ([implementation-evidence.md](implementation-evidence.md), F4). The owner chose to keep 65ch and correct the selector, verbatim "Dejar 65ch y corregir el selector de code (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L8). The spec now spells the inline-code selector `code:not(pre code)`, and the pinned spec digest above replaces `bd1ec5015090608aed7cc0c39fd71ba960f210ec397ad25d08327c916e63abd2` ([approval.md](approval.md), Amendment 1). This answer is the plan's renewed approval against the amended spec. The plan's payload is byte-unchanged, so its identity digest below stays valid, and its section 3 excerpt, its recipe inventory row and its PRS-06 test row, which spell `:not(pre) > code`, are read as that amended selector: those excerpts are indicative and the amended spec governs. Nothing else in the plan changes: no other utility, token, dependency, stylesheet or edit surface.
- **Plan identity:** `contentSHA256: 79c6d08cbb0546a614eac0b1c7fe7dcf6728d3138659ace94391e6958ddf5d1d` — SHA-256 of the UTF-8, LF, final-newline payload from the exact line-start `## 1. Authority and gates` heading line through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b`; at inspection no tracked file under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified (the working tree held only other round 5 lanes' docs and ODD changes). Whole-file SHA-256 prefixes, re-verified: `packages/ui/src/index.ts` `713d1843…`, `styles/compiled.css` `7c587736…`, `.storybook/main.ts` `30ef22e5…`, `.storybook/preview.css` `b55993fb…`, `packages/tokens/src/theme.css` `49634e2d…`, `packages/tokens/package.json` `b28c3d2f…`, `packages/tokens/CHANGELOG.md` `20b2b23a…`, `token-contract.test.mjs` `c05ebfd8…`, `typography-spacing.test.mjs` `c640bb11…`, `skills/_shared/prop-naming.json` `ceb95f54…` (185 entries), `scripts/prop-naming.test.mjs` `f2acfd78…`, `storybook-docgen.test.ts` `3705e162…`, `storybook-controls.test.ts` `f7928479…`, `storybook-css.test.ts` `81993251…`, `scripts/package-exports.test.mjs` `9b779e24…`, `package-consumption.test.mjs` `de9a624c…`, `design-system-artifact.test.mjs` `51238e62…`, `scripts/catalog_data.py` `041dccd6…` (119 rows), `docs/prop-naming.md` `096d7125…`, `docs/catalog.json` `9428c9ff…`, `packages/mcp/README.md` `f52b4ea7…`, `packages/ui/CHANGELOG.md` `404c5095…`, `packages/system/CHANGELOG.md` `ab828f02…`. Echoed sources, re-read: `primitives/text/types.ts` `41a2d11b…`, `useText.ts` `a5b1d894…`, `atoms/link/types.ts` `850d9f0b…`, `atoms/pull-quote/types.ts` `a80b89c1…`, `molecules/table/types.ts` `d5a3e338…`, `primitives/surface/types.ts` `26d0726b…`, `lib/cn.ts` `3ead7127…`. Versions: tokens 0.6.1, ui 0.11.0, effects 0.2.12, system 0.13.0 (the last three unpacked). `theme.css` declares 313 variables, as pinned by `token-contract.test.mjs` (230 utility, 16 inline, 67 root), and the artifact lists 313 tokens. `packages/tokens/dist/tokens.css` is git-ignored (`.gitignore:2`), so regenerating it adds no tracked file. `packages/system/design-system.json` is 610,264 bytes against the 768 KiB (786,432) budget asserted in `design-system-artifact.test.mjs`; `system.md` is 500,426 bytes. Registry check: `preset-dimensions` and `surface-material-tone` are `approved`, without aliases. No `Prose` component, folder or export and no `eg-prose` rule exist in `packages/*/src`, `scripts/` or `.storybook/`; `max-w-prose` appears only as a consumer class in `Text.test.tsx:703`. Baseline line numbers below are for orientation: other round 5 lanes land first (T6 is sequential), so every anchor is also given by its neighbour.
- **Visuals:** VIS-01 to VIS-03 are Pending: no capture, no hash. This plan produces behavior, emission and computed-style evidence only; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns and the token edit of slice 1. The spec approval and the token confirmation grant no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance and its one limit.** The answer recorded in L5 names no digest, so the spec digest binds the bytes derived from the approved draft plus the recommended answers ([approval.md](approval.md)), not a digest the owner quoted. The plan accepts that as provenance; nothing here upgrades it.
3. **G3 — Token.** The name and value are confirmed (L5). The declaration is added only after G1, in `@theme static` beside `--container-quote-pull`, and `tokens.css` is regenerated only by `pnpm tokens` (a git-ignored build output, never edited by hand). No other token, no value change, no dependency. The release effect (one `@egdev/tokens` bump, changelog, pins) is slice 1; the version number is D4.
4. **G4 — Registry.** No new convention and no exception: the approved `preset-dimensions` (`size`) and `surface-material-tone` (`tone`) are reused (spec §3). The plan appends two usages (§5.1); no status, approval or receipt changes, and adding a usage approves nothing globally.
5. **G5 — Recipes, files and styling.** The recipes are approved (OQ-3, OQ-4); exact utility strings and margin steps are plan-level and fixed in §3, and VIS-01 judges the rhythm. Every utility is a static literal in a CVA string composed with `cn()`; no inline style, interpolated class, new AGENTS.md exception, Radix package or Surface import. **No stylesheet**: `prose.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. `proseVariants` stays private (not exported from `index.ts`).
6. **G6 — Emission and cascade are proved, not assumed.** The descendant utilities are scanned from a real `types.ts` for the first time at this scale. Each selector is proved in the preview build (E1), in the shipped package CSS and in Chromium with and without Preflight (§9); the scratch compile of the spec is feasibility evidence only.
7. **G7 — Integration ownership.** The writer touches only the six files of `packages/ui/src/primitives/prose/`. The token edit, barrel, `compiled.css`, `.storybook/`, the docgen and Controls pins, the registry JSON and generated view, the artifact, the catalog, the package harnesses, the MCP README, the changelogs, the evidence file and the ODD log are parent-owned, as in the StepMeter, Carousel and EmptyState plans.
8. **G8 — Stop lines** are listed in §14.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines | Commit |
| --- | --- | --- | --- | --- |
| `packages/tokens/src/theme.css` | Parent | In `@theme static`, after `--container-quote-pull` (baseline 346-347): the comment line and `--container-prose: 65ch;` | +2 | 1 |
| `packages/tokens/tests/typography-spacing.test.mjs` | Parent | New test after the pull-measure one (baseline 249-253): `--container-prose` equals `65ch`, declared once, in the static block | +10 | 1 |
| `packages/tokens/tests/token-contract.test.mjs` | Parent | History comment; utility count 230 → 231 and total 313 → 314 (baseline 54-58); compiled artifact 313 → 314 (151, 157); `manifest.version` `'0.6.1'` → `'0.6.2'` (142); titles follow | +8 / −7 | 1 |
| `packages/tokens/package.json`, `packages/tokens/CHANGELOG.md` | Parent | `version` 0.6.2 (D4); new `## 0.6.2` section above `## 0.6.1` (the top heading must carry the manifest version) | +1 / −1; +5 | 1 |
| `scripts/package-consumption.test.mjs` | Parent | Packed native artifact count 313 → 314 with its history comment (baseline 10531-10532) | +2 / −1 | 1 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`: the new token entry and the tokens version | 1 minified line; ≈ +2 / −1 | 1 |
| `packages/mcp/README.md` | Parent | The five usage examples: tokens version in each response and the five `mcp-response-sha256` digests (§5.6) | +10 / −10 | 1 |
| `packages/ui/src/primitives/prose/types.ts` | Writer | `ProseSize`, `ProseTone`, `ProseProps` (native `div` props minus the protected list, three own props with English JSDoc), `proseVariants` as one `cva` array of static literals (§3) | +115 | 2 |
| `packages/ui/src/primitives/prose/useProse.ts` | Writer | Size and tone fallbacks, discarded untyped `dangerouslySetInnerHTML`, `cn(proseVariants(…), className)` | +32 | 2 |
| `packages/ui/src/primitives/prose/Prose.tsx` | Writer | JSX only: `div` with `rootProps` around `children`; `displayName` | +13 | 2 |
| `packages/ui/src/primitives/prose/index.ts` | Writer | `export { Prose } from './Prose'; export type { ProseProps, ProseSize, ProseTone } from './types';` and no variants export | +2 | 2 |
| `packages/ui/src/primitives/prose/Prose.test.tsx` | Writer | Cases for PRS-01 to PRS-04 and PRS-07 (slice 2), PRS-08 to PRS-11 and the SSR comparison (slice 3) (§4) | +200; +150 | 2, 3 |
| `packages/ui/src/primitives/prose/Prose.stories.tsx` | Writer | `Primitives/Prose`: five stories (§6) | +215 | 3 |
| `packages/ui/src/styles/compiled.css` | Parent | `@source "../primitives/prose/types.ts";` after the label line (baseline 72), before the blank line and skeleton; without it the descendant utilities never reach `styles.css` | +1 | 2 |
| `.storybook/preview.css` | Parent | `@source "../packages/ui/src/primitives/prose/Prose.stories.tsx";` after the Label stories line (baseline 67) | +1 | 3 |
| `packages/ui/src/index.ts` | Parent | `export type { ProseProps, ProseSize, ProseTone } from './primitives/prose';` and `export { Prose } from './primitives/prose';` between Portal (207-208) and skeleton (209) | +2 | 4 |
| `.storybook/main.ts` | Parent | `documentedNativeProps.prose: ['id', 'title', 'lang', 'dir', 'aria-describedby', 'className', 'style']` after `heading` (baseline 241): Text's list plus `lang` and `dir`, the attributes the spec makes the consumer's | +1 | 4 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | Prose extraction test after the Text and Heading annotation test (starts at 3464); `'./primitives/prose'` between portal and skeleton in the barrel list (2169-2170); `'Prose'` between `ProjectCardTags` and `PullQuote` in the runtime names (2296-2297); the five story names | +75 | 4 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `['Prose', 'primitives/prose']` appended at the end of the component list after `StepMeter` (137; literal-interning note at 76 and 80); `prose` control map after `stepmeter` (293); `prose: 3` after `stepmeter: 3` (758); `['Prose', { size: '"md"', tone: '"canvas"' }]` after the Heading row (1665); one dedicated test after StepMeter's (2109) | +40 | 4 |
| `skills/_shared/prop-naming.json` | Parent | Append two `Prose` usages (§5.1) | +18 | 4 |
| `scripts/prop-naming.test.mjs` | Parent | Two `{ conventionId, source }` pairs in `postReceiptUsages` after the StepMeter pairs (848-852); one new test modeled on StepMeter's (1717) | +50 | 4 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ +6 | 4 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Prose test after the NowCard footer one (628) | +55 | 4 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs` again, now with the Prose entry; never hand-edited | 1 minified line; ≈ +40 | 4 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | One Prose row after Text / Heading (baseline 9), then one `build_catalog.py` run (§5.4) | +1; ≈ +2, +12 | 4 |
| `packages/mcp/README.md` | Parent | The `get_design_system_md` digest again (its `systemMd` now lists Prose) | ±1 | 4 |
| `packages/ui/src/lib/storybook-css.test.ts` | Parent | E1: `.max-w-prose` rule and the descendant selector inventory (§3, §4), preview build only | +95 | 5 |
| `scripts/package-exports.test.mjs` | Parent | `'Prose'` in the runtime names (6077-6078), `'Prose'`, `'ProseProps'`, `'ProseSize'`, `'ProseTone'` in the sorted declaration list (6585-6591) and in the later presence list (6956-6975); a built-CSS test and an SSR test modeled on StepMeter's (861, 925) | +125 | 5 |
| `scripts/package-consumption.test.mjs` | Parent | Value import and type imports; typed samples outside `App`; `@ts-expect-error` negatives; `assertProseConsumerCSS` beside `assertStepMeterConsumerCSS` (5303) and its wiring (5816-5817); `'Prose'` in the runtime names (6005-6006); an SSR block | +115 | 5 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | One bullet each under the existing unpacked sections (§7) | +7; +3 | 5 |
| `docs/components/prose/v0.1/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED and GREEN output, browser table, hashes, limits (§9) | +95 | 6 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 | 6 |

**No change expected:** `packages/ui/src/styles/legacy/bundle.css` (frozen), `scripts/storybook-mcp-exceptions.json` (Prose has its own story component), `docs/MATERIAL.md`, `docs/ARQUITECTURA.md`, `docs/CATALOGACION.md`, `AGENTS.md`, `packages/tokens/README.md`, `packages/tokens/tests/scale-reduction.test.mjs` and `semantic-contrast-roles.test.mjs`, every other `package.json`, the lockfile, `packages/effects/**`, `packages/cli/**`, `packages/mcp/src/**`, the neighbouring primitives (Text, Heading, Surface, Stack, Divider are read or compared, never edited), the spec and approval of this version, and the files of the other round 5 lanes.

**Versions:** `@egdev/tokens` moves 0.6.1 → 0.6.2 (S2: tokens was not bumped for 0.11.0 and now changes; the number is D4). `@egdev/ui` stays at 0.11.0, `@egdev/effects` at 0.2.12 and `@egdev/system` at 0.13.0, all unpacked: the T7 `release:pack` run writes the exact tokens 0.6.2 peer into the ui and effects tarballs, so no dependent bump is needed. `@egdev/mcp` and `@egdev/cli` do not move for this change.

Work units: **A** (Writer) the six component files, slices 2 and 3. **B** (Parent) the token slice first (1), then integration, registry and generated outputs (4), harnesses and changelogs (5), evidence and log (6). Registry revisions always follow the final bytes of `types.ts`, so slice 4 stays sequential after slice 3.

## 3. Design of the change

Indicative only: the writer's code and JSDoc are reviewed against the approved spec, not against these excerpts. Biome style: single quotes, 120 columns, no trailing commas, `type` never `interface`, no `any`.

**Contributor checklist, covered where:**

| Aspect | Result |
| --- | --- |
| Anatomy | Spec §2: one root `div.eg-prose` around the consumer's children; descendants are styled by tag through utilities on the root and are not parts; no `eg-prose__*` marker, id, `data-*` or `data-state` |
| API and defaults | Spec §3 exactly: own props `children` (required), `size` (default `md`), `tone` (default `canvas`); constant defaults only for `size` and `tone`; `className` and the other natives stay inherited |
| States | None: passive, no `data-state`, no mirrored classes; link hover and focus use native pseudo-classes inside generated variants |
| Accessibility | No role, name, id, ARIA attribute or wrapper; children keep their semantics; PRS-09 to PRS-11, §9 |
| Radix | None: static content, no installed `@radix-ui/*` package applies |
| Material | The root paints nothing; only `pre` (opaque `surface-0` well) and the `th` band (`surface-2`) carry a background, both opaque; focus rings replace material shadows; recipes approved by OQ-3 |
| Paths | §2; six mandatory files, no stylesheet, no extra internal module |
| Consumer and canvas compatibility | New root marker `eg-prose` with no legacy rule to preserve; DS046 base list covers `className` (no `@classNameAllows`); native consumers get no Preflight, so every recipe sets its own margin, padding, list style, font, colour, decoration and border; React 18.3.1 and 19.3.0 packed consumers without a Tailwind compiler (PRS-13) |

```ts
// types.ts — three own props, each with English JSDoc and one @control
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Root body step: `md` is the 16px reading size and `sm` the compact 12.8px step; it is also the unit of the measure. */
export type ProseSize = 'sm' | 'md';
/** Surface family hosting the prose; it only selects the brand colour of inline code. */
export type ProseTone = 'canvas' | 'raised';
type ProseNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML'
>;

/** Passive reading column … converts nothing, sanitizes nothing and accepts no HTML string. Supported nesting, heading
 * levels, converter responsibilities and overflow policy are described in the stories. className supports outer layout
 * only (margins, self-alignment, flex or grid placement); width constraints are unsupported. */
export type ProseProps = ProseNativeProps & {
  /** Converted and sanitized flow content as React nodes. @control false
   * @controlReason ReactNode content is not serializable in Controls; see Default and Elements. */
  children: ReactNode;
  /** Root body step and unit of the `ch` measure. @default md @control select */
  size?: ProseSize;
  /** Brand text role of inline code on the host surface; it never paints a background. @default canvas @control select */
  tone?: ProseTone;
};

export const proseVariants = cva(
  [
    'eg-prose box-border min-w-0 max-w-prose font-sans wrap-break-word text-pretty',
    '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
    // … one array element per target of the inventory below, each a static literal of at most 120 columns,
    // every utility carrying its `[&_selector]:` prefix
  ],
  {
    variants: {
      size: { sm: 'text-body-default', md: 'text-body-large' },
      tone: { canvas: '[&_:not(pre)>code]:text-fg-brand-default', raised: '[&_:not(pre)>code]:text-fg-brand-raised' }
    },
    defaultVariants: { size: 'md', tone: 'canvas' }
  }
);
```

```ts
// useProse.ts — same discard and fallback pattern as useText.ts (:60, :64-66); nothing else is stripped at runtime
const { dangerouslySetInnerHTML: _discarded, ...rootProps } = native as typeof native & { dangerouslySetInnerHTML?: unknown };
const resolvedSize: ProseSize = size === 'sm' ? 'sm' : 'md';
const resolvedTone: ProseTone = tone === 'raised' ? 'raised' : 'canvas';
// rootProps: { ...rootProps, className: cn(proseVariants({ size: resolvedSize, tone: resolvedTone }), className) }
```

```tsx
// Prose.tsx — JSX only, FC<ProseProps> like Text; no ref, no forwardRef, no Slot
export const Prose: FC<ProseProps> = (props) => {
  const { children, rootProps } = useProse(props);
  return <div {...rootProps}>{children}</div>;
};
Prose.displayName = 'Prose';
```

The spec promises only a type-level omission of `role`, `aria-label` and `aria-labelledby`, so the hook strips nothing but `dangerouslySetInnerHTML`; in React 19 an untyped `ref` reaches the root as it does for Text (risk 8). The component imports nothing from the system: the recipes echo token roles of Text, Heading, Link, PullQuote, Table and the Surface well without importing them.

**Recipe inventory (spec §6, approved).** Each row is one static utility group written with its `[&_selector]:` prefix, except the root and the first and last child. The emitted spelling of the three non-trivial selectors (`> :first-child`, `:not(pre) > code`, `li::marker`) is taken from the first GREEN preview build and then pinned by E1; the intent is the spec's. E1 asserts, per row, that the selector exists and its declaration reads the named token; PRS-04 asserts the utility presence on the root after `cn()`.

| Target | Utilities | Reads |
| --- | --- | --- |
| root | `box-border min-w-0 max-w-prose font-sans wrap-break-word text-pretty` + step `text-body-large` or `text-body-default` | `--container-prose`, `--font-sans`, `--text-body-large` (16px) or `--text-body-default` (12.8px) |
| `> :first-child`, `> :last-child` | `mt-0`, `mb-0` | margins 0 (specificity above the descendant margin rules) |
| `h2` | `mt-12 mb-4 font-display uppercase text-heading-section text-fg-default text-balance` | `--text-heading-section` (32px, 1.2, 800), `--color-fg-default` |
| `h3` | `mt-8 mb-3 font-sans normal-case text-heading-small text-fg-default text-balance` | `--text-heading-small` (19.2px, 1.2, 700) |
| `h4` | `mt-6 mb-2 font-sans normal-case text-body-large text-fg-default text-balance [font-weight:var(--text-heading-small--font-weight)]` | 16px at weight 700 |
| `p` | `mb-5` | 16px at `md` |
| `a`, `a:hover`, `a:focus-visible` | `text-link-default underline underline-offset-(--space-1)`; `no-underline`; `outline-none rounded-sm [box-shadow:var(--shadow-focus)]` | `--color-link-default`, `--shadow-focus` |
| `strong` | `[font-weight:var(--text-heading-small--font-weight)]` | weight 700 |
| `ul`, `ol`, `li`, `li::marker` | `list-disc` or `list-decimal`, `ps-7 mb-5`; `mt-2`, first `mt-0`; `text-fg-muted` | list style restored explicitly |
| `blockquote` | `my-8 border-s-[length:calc(var(--border-width)*2)] border-fg-brand-default ps-4.5 text-fg-secondary` | 2px start filet (PullQuote precedent) |
| `code`; `:not(pre) > code` | `font-mono text-code`; `text-fg-brand-default` or `text-fg-brand-raised` by tone | `--text-code` (11.2px), brand colour |
| `pre`, `pre:focus-visible` | `my-6 overflow-x-auto rounded-md border border-border-hairline bg-surface-0 p-4 shadow-[var(--shadow-well)] font-mono text-code text-fg-secondary`; `outline-none [box-shadow:var(--shadow-focus)]` | `--shadow-well`, `--color-surface-0` |
| `img` | `block h-auto max-w-full rounded-md` | no tint or overlay |
| `figure`, `figcaption` | `my-8`; `mt-2 text-body-default text-fg-muted` | 12.8px caption |
| `table`, `th`, `td` | `my-8 w-full border-collapse`; `border-b border-border-default bg-surface-2 px-4 py-2.5 text-start font-display text-label-eyebrow uppercase text-fg-muted`; `border-b border-border-subtle px-4 py-3 text-start align-top wrap-break-word text-body-default text-fg-secondary` | Table header and cell recipes |
| `hr` | `my-10 border-0 border-t border-solid border-border-hairline` | hairline, not brand red |

The only non-token forms are the four with precedent: `border-s-[length:calc(var(--border-width)*2)]` (PullQuote), `shadow-[var(--shadow-well)]` (Surface), `[font-weight:var(--text-heading-small--font-weight)]` (Text) and `[box-shadow:var(--shadow-focus)]` (Link). No `bg-[…]`, handwritten shadow, gradient, hex or px literal, `!important` or `style`.

## 4. Test-first sequence

Public-interface tests first (roles and accessible names, `userEvent`, token-exact `classList` checks, no complete class strings, no `data-testid`), with the intended RED captured verbatim before any implementation; the evidence file records command, exit code and counts. Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded, never committed. A new component has no earlier state and a stub would be a dummy file, so PRS-01 fails at import and each later row fails on an assertion after the previous minimal GREEN. Rows marked **guard** pass on their first run and claim no RED. Class checks compare whole tokens (`classList.contains`), never substrings, because the root also holds prefixed utilities such as `[&_td]:text-body-default` that must not satisfy a `text-body-default` assertion. Type-level assertions use `expectTypeOf` (StepMeter and Switch precedent), proved by `pnpm typecheck`; the one documented cast is an `untyped(props)` helper for JavaScript callers.

**R0 baseline, no edit:** the Text, Heading, Surface and Stack suites, `pnpm test:tokens`, docgen, Controls, css, `props:check`, `test:props`, `artifact --check`, `system:check`, `test:artifact`, `test:system`, `test:mcp` and the Storybook MCP contract test all green; record the counts.

| AC | RED test (file → case) | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| TK-1 | `typography-spacing.test.mjs`: `--container-prose` is `65ch`, declared once, in `@theme static` | The declaration is missing: `undefined` is not `'65ch'` | Green after the declaration; the other token tests unmodified and green |
| TK-2 | `token-contract.test.mjs`: 231 utility, 314 total, compiled artifact 314 after `pnpm tokens`, `manifest.version` `0.6.2` | 230 ≠ 231 and 313 ≠ 314; `0.6.1` ≠ `0.6.2` | Green after `theme.css` and `package.json`; `compareParity` still reports no missing, extra or changed token |
| TK-3 | `pnpm test:mcp`: the five README examples against the real stdio responses | After the version bump the documented tokens version and every digest are stale | Green after the §5.6 refresh |
| TK-4 | `package-consumption.test.mjs`: the packed native artifact exposes 314 variables | Needs packing (D3): **Not observed** without it | Green through the packed harness only |
| PRS-01 | `Prose.test.tsx`: `container.children` has one `div` with `eg-prose`; the children keep their order (`compareDocumentPosition`) and text; no `role`, `id`, `tabindex` or `data-state`; `renderHook(useProse)` returns only a `className` in `rootProps` | The file fails at import (`./Prose`, `./useProse`, `./types` unresolved) | Marker, absences, order and hook shape green |
| PRS-02 | `it.each` over `size` and `tone`: `text-body-large` xor `text-body-default`, inline-code utility by tone, omitted values mean `md` and `canvas`, untyped `'lg'`, `'flood'`, `null` and `42` fall back to them | After PRS-01's minimal GREEN (a bare `div.eg-prose`): every row fails; the fallback rows need validation because CVA alone ignores unknown values | Green; each axis never carries both values |
| PRS-03 | Root holds `max-w-prose` and `min-w-0`; E1: the preview build emits `.max-w-prose` reading `--container-prose` with the `65ch` fallback; package-exports: the shipped `styles.css` does the same; Chromium (§9) | Unit rows fail after PRS-01; E1 finds no rule until the recipe and the `@source` line exist; the browser probe finds no story on the baseline build | Unit and E1 green after slice 2, shipped CSS after `pnpm build`; browser rows **Not observed** without D2 |
| PRS-04 | One `it.each` row per selector of the inventory: the root holds each prefixed utility after `cn()`; E1 selectors exist with the §3 declarations; package-exports: one rule per selector in `styles.css` | After PRS-02's GREEN (root and step only) every row fails; E1 fails until the recipe and the `@source` line exist. One run records the failing count first | Green after the recipe; shipped CSS after `pnpm build` |
| PRS-05 | Chromium computed-style script on two pages (§9): identical results with and without Preflight for every property of PRS-05 | jsdom cannot express the cascade: the probe is written first and fails against the baseline build | Computed values in the evidence file; **Not observed** without D2 |
| PRS-06 | Unit: no unconditional `[&_code]:text-fg-brand-*` utility, only the `:not(pre) > code` form; Chromium: `pre > code` takes the block colour and inline `code` the brand colour | The unit row is a **guard**; the browser rows as PRS-05 | Green; browser **Not observed** without D2 |
| PRS-07 | Source scan of `types.ts`: only token utilities plus the four precedent forms, no hex, rgb, px, `!` or interpolation; `useProse` returns no `style`; the folder holds exactly the six files and no `.css`; no `eg-prose__` | Fails at import before slice 2; afterwards a **guard** by construction | Green; the folder list pins "No stylesheet" |
| PRS-08 | `className='mx-auto mt-8'` merges after the variants; the marker and the descendant utilities survive; artifact test: no `classNameAllows` for Prose | After a bare hook: the class is ignored; the artifact assertion fails until regeneration | Green after `cn()`; artifact green after slice 4 |
| PRS-09 | `expectTypeOf`: `children` required, `role`, `aria-label`, `aria-labelledby` and `dangerouslySetInnerHTML` absent, unions exact; runtime: an untyped `dangerouslySetInnerHTML` is discarded (children render, no markup injected, no React error); `lang`, `id` and `data-*` reach the root | React throws on children plus `dangerouslySetInnerHTML` until the hook discards it | Green; `pnpm typecheck` proves the type rows |
| PRS-10 | A fixture with every supported element renders with the same inner HTML inside Prose and inside a plain `div`; roles (headings 2 to 4, list, listitem, link name, img alt, table, separator) are present; no ARIA attribute, id or wrapper added | **Guard**: Prose never touches its children | Green |
| PRS-11 | `userEvent.tab()` visits the links in DOM order; no `tabindex` added; the root holds the resting-underline utility; E1: `a:focus-visible` and `pre:focus-visible` paint `--shadow-focus` | Tab rows are **guards**; the E1 rows fail until the recipe exists | Green; real focus rings in §9 |
| PRS-12 | PRESERVE: the existing token tests (`semantic-contrast-roles.test.mjs:150-168`) stay unmodified; no new pin (see D-notes) | — | Green before and after |
| PRS-13 | `package-exports.test.mjs` runtime and declaration lists, built CSS and SSR; `package-consumption.test.mjs` typed samples, negatives, CSS and SSR; React 18.3.1 and 19.3.0 through the packed harness (D3) | `Prose` is undefined in the package and the lists differ until the barrel line exists | Green after `pnpm build`; the packed matrix is **Not observed** without D3 |
| PRS-14 | PRESERVE: the Text, Heading, Surface and Stack suites unmodified and green; `git diff -U0` on every existing file shows additions only apart from the token pins, the version and the README digests; registry, artifact and catalog regenerated | `props:check` is stale after the `types.ts` edit; the registry test fails until the usages exist; `artifact --check` is stale | `props:docs`, `props:check`, `test:props`, `artifact --write` with `system:docs`, `build_catalog.py` green |
| PRS-15 | Docgen and Controls pins edited first: three own props (`children` false with its reason, `size` and `tone` select), `@default` only on `size` and `tone`, `children` required, native rows shown and absent, the five story names, `title: 'Primitives/Prose'`, no `argTypes` or `play`; barrel lists | The barrel lists differ from the real barrel and the folder is unknown until slice 4; the extraction test finds no component | Pins, `props:docs`, `props:check`, `test:props` green with zero owned diagnostics; browser widgets under D2 |

**Coverage check:** TK-1 to TK-4 and PRS-01 to PRS-15 each appear in at least one row. **PRESERVE:** no shared parser, helper, CVA or hook changes, so no differential run is planned; the token slice touches shared files, and its evidence is TK-2's parity check plus an additions-only diff of `theme.css`.

**E1 — emitted CSS** (`storybook-css.test.ts`, preview build): imports `proseVariants`, then for the §3 inventory asserts that each selector is emitted and reads its token, with `rule()` (`:155`) for flat rules and the bounded `css.slice` pattern already used in this file (`declarationAfter`, `:485`) if the optimizer emits nested or compound selectors (the first run exposes it and the helper is adapted in the same file). E1 is authored and observed RED before slice 2's code and committed in slice 5 with the other emission checks, to keep slice 2 near 400 lines. There is no E2: the descendant rules sit at specificity (0,1,1) or higher by design, which is exactly why nested recipe-owning components are unsupported (spec §4) and nothing guards it.

**GREEN order:** token (slice 1) → `types.ts` → `useProse.ts` → `Prose.tsx` → `index.ts` → `@source` line → the focused runner → stories → barrel, `.storybook/main.ts` → docgen and Controls pins → registry → catalog → artifact → E1 and harnesses → changelogs.

## 5. Registry, docgen, artifact, catalog and release obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Append, never reorder, one usage to each of the two approved entries; each `source.revision` is the whole-file SHA-256 of the final reviewed `types.ts`, in the form `sha256:<64 hex>`. Hash only after `types.ts` is final and `pnpm lint` is clean on it; any later edit, even formatting, requires re-review and re-hashing.

| Entry | Usage `type` |
| --- | --- |
| `preset-dimensions` | `ProseSize ('sm' \| 'md')` |
| `surface-material-tone` | `ProseTone ('canvas' \| 'raised')` |

Every usage is `{ "component": "Prose", "type": …, "status": "existing", "source": { "path": "packages/ui/src/primitives/prose/types.ts", "symbol": "ProseProps", "revision": … } }`. No new entry, exception, approval JSON or receipt: a convention hash binds convention content, not usages. The entry count stays 185.

In `scripts/prop-naming.test.mjs` add the two `{ conventionId, source: 'packages/ui/src/primitives/prose/types.ts#ProseProps' }` pairs to `postReceiptUsages` and one test modeled on the StepMeter one: each of the two entries stays `approved`, carries exactly one Prose usage with the live whole-file revision, and `historicalRegistry` strips only the reviewed usages. An unlisted usage fails the receipt tests: that is the intended RED. Then `pnpm props:docs` (never by hand), `pnpm props:check`, `pnpm test:props`; re-run to find any other pinned count before attributing a failure.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts`: the extraction test asserts three own declarations with controls `children` false (reason naming `Default` and `Elements`), `size` select and `tone` select; `children` required; `size` options `md` and `sm` with default `md` and `tone` options `canvas` and `raised` with default `canvas` (the only `@default` tags); native rows `id`, `title`, `lang`, `dir`, `aria-describedby`, `className`, `style` present and `role`, `aria-label`, `aria-labelledby`, `dangerouslySetInnerHTML`, `ref`, `asChild` absent; stories equal the five names of §6, `title: 'Primitives/Prose'`, no `argTypes` or `play`; `Prose` is public and `proseVariants` and `useProse` are not.
- `storybook-controls.test.ts`: the control map, the count 3, the default-args row, the list row and a dedicated test: `children` control false with its reason, `size` and `tone` select in union order with the Docs defaults `md` and `canvas`, zero diagnostics, `args` empty.

### 5.3 System artifact

`pnpm artifact --write` then `pnpm system:docs`, only after source, registry and catalog are final. Expected `Prose` entry: package `@egdev/ui`, source `packages/ui/src/primitives/prose/types.ts`, props `children` (required), `size` (enum, default `md`), `tone` (enum, default `canvas`), one variant recipe `proseVariants`, no `parts`, no `classNameAllows`, no `surfaceUsage`; `propNaming` gains the two usages; `tokens` gains `--container-prose` (314); `packages` lists tokens 0.6.2; `catalog` gains the row. The builder reads `cva` array literals and splits variants depth-aware, so the descendant forms are expected to parse; the new test checks representative `anatomyUtilities` and reports any `unresolved` flag on a token-backed utility instead of weakening the assertion. Add one test beside the NowCard footer one: props and defaults, `children` required, no `role`, `aria-label`, `aria-labelledby`, `dangerouslySetInnerHTML`, `ref` or `asChild`, `max-w-prose` and representative descendant utilities in the recipe, no `classNameAllows`, both reused entries `approved` and listing `Prose`, and the new token at `65ch`. Expected growth is a few tens of KB at most against the 786,432-byte budget (now 610,264 bytes); report any overflow instead of weakening the budget test. `pnpm build` regenerates the artifact too, so `artifact --check` runs again after it.

### 5.4 Catalog

Edit only `scripts/catalog_data.py`, then `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. New row after Text / Heading, written after GREEN and kept honest about what is observed:

```py
("—","—","Prose","primitive","ui","—","—","nuevo","Implemented React primitive under the [approved v0.1 contract](components/prose/v0.1/spec.md): passive reading column (`div.eg-prose`) that gives bare semantic children (h2 to h4, paragraphs, lists, links, strong, blockquote, code, pre, images, figures, simple tables and rules) a token-backed long-form presentation, with a built-in reading measure (`--container-prose`, 65ch), `size` md or sm and a `tone` for inline code. Descendant utilities only: no stylesheet, ref, asChild, HTML-string input or part markers. The consumer converts and sanitizes content; nested recipe-owning components are unsupported. Browser, contrast and packed-consumer verification remain pending until observed."),
```

### 5.5 Package fixtures

`package-exports.test.mjs`: add `'Prose'` to the runtime names and the four declaration names to the sorted declaration list and to the presence list (the failing diff shows the exact spots); a built-CSS test modeled on the StepMeter one (read `types.ts`, collect every static string of the `cva` call, require each non-`eg-` utility in the built `@layer utilities`, assert `.max-w-prose` reads `--container-prose` as `.max-w-quote-pull` does at 3552, assert one rule per inventory selector through `cssBlock`, and `doesNotMatch(css, /\.eg-prose\b/)`); an SSR test asserting the root `div.eg-prose`, the unchanged children, no role, and that `proseVariants` and `useProse` are not exported.

`package-consumption.test.mjs`: add `Prose` to the value import and `ProseProps`, `ProseSize`, `ProseTone` to the type imports; positive samples in a `ProseSamples` component kept outside `App`, so the existing button-count and focus harness stays unchanged; documented `@ts-expect-error` negatives for a missing `children`, `role`, `aria-label`, `aria-labelledby`, `dangerouslySetInnerHTML`, `asChild`, `size: 'lg'`, `tone: 'flood'` and the private recipe; an `assertProseConsumerCSS` like `assertStepMeterConsumerCSS` (`.max-w-prose` token read plus a representative selector sample, no `eg-prose` rule); an SSR block. No ref API, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

### 5.6 Tokens release effect and the MCP README

- **Tokens.** Slice 1 carries the whole release effect: the declaration, the pins of §2 (counts in `token-contract.test.mjs` and `package-consumption.test.mjs`, the `manifest.version` pin), the `## 0.6.2` changelog section, and the regenerated artifact (new token entry, tokens version). `pnpm tokens` regenerates `packages/tokens/dist/tokens.css`; it is a git-ignored build output and never edited. The literals to change if D4 picks another number are four: `package.json`, the `token-contract.test.mjs` pin, the changelog heading and the README digests.
- **MCP README.** Every example response embeds `designSystem.packages`, so the tokens version change makes all five documented digests and versions stale (`pnpm test:mcp` compares them with the real stdio responses). Refresh each example with the procedure T4 (S5d) adds to the release documents; if T4 has not landed, replace the tokens version in the five response texts and recompute each `mcp-response-sha256` as the SHA-256 of the real `content[0].text` the test receives, never by guessing, and let `pnpm test:mcp` be the proof. The `get_design_system_md` digest moves again in slice 4, because its `systemMd` then lists Prose; the other four examples filter to unrelated entries and are expected to keep their digests (`pnpm test:mcp` proves it).

## 6. Stories and Controls

`Primitives/Prose` keeps autodocs, `Meta<typeof Prose>`, no manual `argTypes`, no `play`, English JSDoc (`## Description`, `## Dependencies`, `## Usage guidelines`). Each story sets only the required `children` (and, where it demonstrates an axis, that axis); `Default` never sets `size` or `tone`, so Docs keeps the constants `md` and `canvas`. Content is realistic English prose; links use `#…` targets that do not navigate the iframe; the image uses the shared `docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url` with a descriptive `alt` (needs `/// <reference types="vite/client" />`, as TipCard and Carousel stories have). Compose only with exported DS pieces.

- `Default`: an article sample (an `h2`, paragraphs with a link and bold text, a list) inside `SectionShell register='grafito'`, the VIS-01 host without a particle layer.
- `Elements`: the full tour of every supported element at the default width: `h2`, `h3`, `h4`, links, `strong`, bulleted and numbered lists, `blockquote`, inline code, a `pre` block, a captioned image, a simple table with a header band and `hr`.
- `Sizes`: `md` and `sm` side by side (PRS-02).
- `RaisedTone`: `size='sm'` and `tone='raised'` inside `Surface tone='surface-1'` (the VIS-03 scenario).
- `Overflow`: a long code line, a wide table and a long unbroken URL in a narrow host built from spacing tokens (`max-w-[calc(var(--space-24)*4)]`, the Carousel precedent; scanned by the new preview `@source` line), the VIS-02 scenario; the 390px reading condition is proved by the viewport probe, not by the story.

The meta JSDoc states: the supported children list; `h2` to `h4` only, the page title being the `h1`; unsupported nesting (`PullQuote`, `Table`, `PhotoFrame`, any recipe-owning component: Prose's descendant rules override their single-class utilities); that Prose takes React children only, converts and sanitizes nothing, and that a consumer holding an HTML string renders it through its own element after its own sanitization, losing only the outer-margin trimming; the converter's duties (heading levels, `alt`, table headers, `lang`, link `target` and `rel`, a scroll region for wide tables, font loading including an italic face); the overflow policy (`pre` scrolls inside the root, a wider table overflows); `className` for outer layout only and width constraints unsupported; the contrast trade-off of neon links and inline code on `surface-1` to `surface-3` as the retained owner decision. Controls: the registered enhancer shows `size` and `tone` as selects in union order and `children` with no widget, and injects no argument. Real browser Controls are checked in §9, not inferred from tags.

## 7. Changelog entries

The unpacked release absorbs the work (S2), so no `## Unreleased` section is added to ui or system. `packages/ui/CHANGELOG.md`: a new first bullet under `### Added` of the existing `## 0.11.0` (entries run newest first):

```md
- `Prose` gives bare semantic content (`h2` to `h4`, paragraphs, lists, links, quotes, code, images, figures, simple
  tables and rules) a readable reading column: a built-in 65ch measure, a 16px body step (`size='sm'` selects the
  compact step) and brand-coloured inline code by `tone`. It renders one `div`, never parses or sanitizes content and
  takes no HTML string, so the app converts and sanitizes its rich text, caps heading levels, provides `alt` text and
  wraps wide tables in a scroll region. Components that own a recipe (`PullQuote`, `Table`, `PhotoFrame`) are not
  supported inside it. (#569)
```

`packages/system/CHANGELOG.md`: a new first bullet under `### Added` of its existing **`## 0.13.0`** section. That is the system version released together with ui 0.11.0 (#568); the `## 0.11.0` heading further down belongs to an older, already released system version and must not be used.

```md
- The source-derived artifact and reference include `Prose` (its props and static descendant recipe), the
  `--container-prose` token and the two reused naming conventions. (#569)
```

`packages/tokens/CHANGELOG.md`: tokens has no unpacked section, so a new `## 0.6.2` goes above `## 0.6.1` (the heading must equal the manifest version):

```md
## 0.6.2

- Add `--container-prose` (`65ch`), a reading measure for long-form text, relative to the font metrics of the element
  that uses it. `@egdev/ui` `Prose` reads it as `max-w-prose`. Refs #569.
```

`(#569)` marks the issue fully resolved, as [versioning](../../../distribution/versioning.md) requires for consumer requests; once the release is packed, `release.json` `resolves` lists it (D5). The tokens bullet uses `Refs #569` because the token alone resolves nothing. If the owner narrows the delivery, write `Refs #569` in all three. No version bump other than tokens, no `release:pack` or tag here, and no `mcp`, `effects` or `cli` entry.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command of each slice is the identical RED and GREEN runner.

```sh
pnpm test:tokens
pnpm exec vitest run packages/ui/src/primitives/prose --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/primitives/text packages/ui/src/primitives/surface packages/ui/src/primitives/stack --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/ui/src/primitives/text packages/ui/src/primitives/surface packages/ui/src/primitives/stack packages/ui/src/styles/legacy packages/effects packages/cli packages/mcp/src
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
pnpm test:mcp
pnpm test:package-exports
pnpm test:package-consumption
pnpm test:package-release
pnpm test:cli
pnpm storybook-build
git status --short
```

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm test:tokens` runs `pnpm tokens` first, which rewrites the git-ignored `packages/tokens/dist/`. `pnpm build` writes package outputs and regenerates the artifact, so the freshness checks run again after it. `pnpm test:mcp` builds `@egdev/mcp` first. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache (`EGDEV_CONSUMER_OFFLINE=1` is the offline route); it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler. `pnpm test:package-release` is a PRESERVE check on the changelog structure. `pnpm release:pack` is T7's and is not run here. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens tests, `test:package-exports` and `test:package-consumption`; the artifact checks and `test:mcp` are not in CI yet (T4) and are run here because `@egdev/system` ships and the README examples drift with the tokens version. Every result is recorded per command with exit code and test counts in the evidence file; jsdom, docgen and HTML smoke prove no appearance, contrast or screen-reader behavior, and none is claimed.

## 9. Browser and capture procedure

Only after separate permission (D2) to start `pnpm storybook` (it builds tokens first) or a scratch package build outside the repository, and to use a real Chromium, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion, transparency and forced-colors settings, crop and date for every observation. Stories: `primitives-prose--default`, `--elements`, `--sizes`, `--raised-tone`, `--overflow`.

1. **Measure (PRS-03).** At `md` and `sm`, the root's computed `max-width` equals 65 times the width of a `1ch` probe element measured inside the root, within 0.5px; a paragraph longer than the measure wraps at it; the same page shows no horizontal overflow of the root. Also record the characters per rendered line of the sample paragraphs (a measurement of the story text, not of real website prose).
2. **Computed style with and without Preflight (PRS-05, PRS-06).** Page A is the Storybook preview (expected to carry no Preflight, since `preview.css` imports only the tokens and the compiled CSS; a bare `h2` outside Prose confirms it). Page B is a scratch fixture outside the repository, in a `mktemp -d` directory named in the evidence file and removed by its creator, that loads the shipped `tokens.css`, the built `styles.css` and Tailwind's Preflight around the same markup. Check every property of PRS-05 on both pages and require identical results: `h2` display family, 32px, 800, uppercase; `h3` sans 19.2px 700; `h4` sans 16px 700; `p` 16px on a 25.6px line at `md` and 12.8px at `sm`; link colour, underlined and not underlined on hover; `strong` 700; `ul` disc and `ol` decimal; `blockquote` 2px start border; `code` mono 11.2px; `pre` on the computed `--color-surface-0` with a hairline border and the well shadow, scrolling horizontally; `table` with collapsed borders and a `surface-2` header band; `hr` 1px top border; first child top margin 0 and last child bottom margin 0; `pre > code` takes the block colour while `code` in a paragraph takes the brand colour. A difference between the pages, or a property that disagrees with the spec's token arithmetic, stops the work (G8).
3. **Reflow (VIS-02 condition).** `Overflow` at a 390px viewport and at 200% zoom: long words and the URL wrap, `pre` scrolls inside the root, the wider table overflows (OQ-7, recorded as observed, not as a promise).
4. **Contrast.** Measured contrast of text on the four `Surface` tones in `RaisedTone` against the spec's hand-computed table, and under `SectionShell register='grafito'` with and without `prefers-reduced-transparency: reduce`; the grafito figure is recorded as observed, never assumed.
5. **Focus and accessibility tree.** Real keyboard Tab through the links: DOM order, `--shadow-focus` visible on `a:focus-visible` and on `pre:focus-visible` where the browser makes the scroller focusable; the tree shows a generic root, headings 2 to 4, list, links, image, table and separator. Real screen-reader output, forced colors and real touch devices stay Not evaluated.
6. **Controls (PRS-15).** `size` select (`md`, `sm`; Docs Default `md`), `tone` select (`canvas`, `raised`; Docs Default `canvas`), `children` without a widget and with its reason, no injected argument, no diagnostics.
7. **Captures VIS-01 to VIS-03**, only if separately authorized: component-zone PNGs of `Default`, `Overflow` at 390×844 and `RaisedTone` under `docs/components/prose/v0.1/`, named `<variant>--<state>--<viewport>--<theme>.png` (for example `default--static--1280x900--dark.png`), at device scale 2 with Barlow, Barlow Condensed and JetBrains Mono loaded (Storybook fetches them from Google Fonts, so capture needs network), with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, not approved expected design, until the owner adopts exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture exists, and none of this plan's browser evidence replaces behavior or accessibility tests. Real-page legibility over the particle layer needs the website and stays Not evaluated.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English; bodies use `Refs #569`. Each commit passes the pre-commit Biome and typecheck hooks (`lefthook.yml`) and the pre-push `pnpm test`; generated files are regenerated inside every commit that changes their inputs, so each commit stays green. A failing RED commit is never made.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(tokens): add the --container-prose reading measure (#569)` | `theme.css`, the tokens tests, `package.json` and changelog (0.6.2), the packed-count pin, the regenerated artifact and the MCP README refresh | ≈ 62 |
| 2 | `feat(ui): add the Prose primitive core and its recipe (#569)` | `types.ts`, `useProse.ts`, `Prose.tsx`, `index.ts`, the `compiled.css` `@source` line, tests for PRS-01 to PRS-04 and PRS-07; folder not yet exported | ≈ 363 |
| 3 | `feat(ui): protect Prose semantics and document it in stories (#569)` | Tests for PRS-08 to PRS-11 and the SSR comparison, `Prose.stories.tsx`, the preview `@source` line | ≈ 366 |
| 4 | `feat(ui): publish Prose with metadata pins, registry usages and catalog (#569)` | Barrel lines, `.storybook/main.ts`, docgen and Controls pins, registry usages with `prop-naming.test.mjs` and the regenerated view, artifact test, catalog row, regenerated artifact and catalog, the README digest | ≈ 306 |
| 5 | `test(ui): check the built and packed Prose styles and add its changelog (#569)` | E1 in `storybook-css.test.ts`, `package-exports.test.mjs`, `package-consumption.test.mjs`, the ui and system bullets | ≈ 345 |
| 6 | `docs(prose): record the v0.1 implementation evidence (#569)` | `implementation-evidence.md`, the ODD log, and `capture.json` with PNGs only if authorized | ≈ 101 |

Slice 1 is a gate-sensitive change (owner-confirmed token plus a release number) and stays alone so it can be reviewed and bisected apart; it must land first because PRS-03 and the E1 build read the token. Slices 2 and 3 leave the folder unexported, so no whole-repo test sees it; if one unexpectedly fails on the unexported folder, merge slices 2 to 4 instead of weakening the test. Slice 4 keeps the barrel, catalog, registry, artifact and metadata pins together because the artifact and docgen suites cross-check them. If slice 5 grows past 400, split `package-consumption.test.mjs` into its own commit. The registry revisions always follow the final bytes of `types.ts`.

## 11. Estimated changed lines

About **1,543 changed lines**: ≈ 1,476 hand-written (component files 727: `types.ts` 115, hook 32, component 13, index 2, tests 350, stories 215; metadata pins, registry test and E1 260; package harnesses 243 including the packed-count pin; artifact test 55; registry JSON, catalog source, barrel, `main.ts`, `compiled.css` and `preview.css` 24; token slice 34 (`theme.css`, tests, `package.json`, changelog); MCP README 22; changelogs for ui and system 10; evidence and log 101) and ≈ 67 generated (`docs/prop-naming.md` ≈ 6, `design-system.json` 4, `system.md` ≈ 43, catalog ≈ 14). For calibration, the EmptyState plan estimated ≈ 1,394 changed lines for a molecule without a token, and the StepMeter plan ≈ 1,250 hand-written lines for an atom plus a documentation-only amendment.

## 12. Risks

- **Risk 1 — Scanner and emission.** The descendant recipe is about 120 static utilities with arbitrary variants (`>`, `:not()`, `::marker`, `:focus-visible`) scanned from a real `types.ts` for the first time here. The spec's compile used an equivalent candidate set, not the scanner. A utility that does not emit, or an emitted selector that differs from the intent, stops the work (G6, G8); E1 and the shipped-CSS test are the proof.
- **Risk 2 — Preflight versus none.** Native consumers get no Preflight, so each recipe sets margin, padding, list style, font, colour and border itself; only the two-page computed-style probe proves identical results (PRS-05). A property that depends on Preflight is a spec amendment, not a plan tweak.
- **Risk 3 — Token ripple.** One new token touches three pinned counts in `token-contract.test.mjs`, the packed count in `package-consumption.test.mjs`, the `manifest.version` pin, the artifact, `system.md` and all five MCP README digests. A missed pin shows as a red check, not silent drift. If another round 5 lane also edits `packages/tokens`, the counts stack and the version bump must be one bump for the round.
- **Risk 4 — Tokens version number.** D4: the policy table and the 0.6.0 precedent read a new capability as a minor bump, while this plan carries 0.6.2. Four literals change with the decision (§5.6).
- **Risk 5 — `max-w-prose` collision.** Tailwind's deprecated default `--max-width-prose: 65ch` shadows the token in apps that load Tailwind's default theme. At exactly 65ch every case agrees; the plan relies on that and ships no other value. PRS-03 also checks whether the shipped rule carries the literal `65ch` fallback for apps on an older tokens version, as `.max-w-quote-pull` does.
- **Risk 6 — Registry freshness chain.** The two revisions bind the final bytes of `types.ts`, and the artifact and registry-test pins follow. Finish source, lint, hash, registry, regenerate, check; any late JSDoc or formatting edit repeats the chain.
- **Risk 7 — Artifact provenance and size.** The recipe adds many `anatomyUtilities`; the builder may flag descendant forms as `unresolved`, which weakens token provenance for Prose without breaking the build. Size stays far below the budget but is reported.
- **Risk 8 — Untyped `ref` and `role`.** The spec promises type-level omissions only: in React 19 a `ref` passed by an untyped caller reaches the root `div` as it does for Text, and an untyped `role` or `aria-label` is not stripped. No guard is planned; a guard would be a behavior the spec does not promise, so it is an amendment, not a plan change.
- **Risk 9 — Nested recipe-owning components.** Prose's descendant rules (specificity (0,1,1) or higher) override single-class utilities of `PullQuote`, `Table` and `PhotoFrame` inside it. Documented and forbidden; nothing guards it.
- **Risk 10 — Outer-margin trimming.** It reaches direct children only; a wrapper `div`, including the consumer's own HTML-string element, defeats it while every other rule still applies. Documented in the JSDoc and stories; no test claims more.
- **Risk 11 — Neon contrast.** Links and inline code are below 4.5:1 on `surface-1` to `surface-3` (the retained owner trade-off, 4.30, 3.92 and 3.42:1). The plan neither fixes nor hides it; the grafito figure is Not evaluated until measured.
- **Risk 12 — Fonts.** Storybook loads Barlow weights 400 to 700 without italics, so `em` is synthesized there; real italic rendering is the consumer's font loading. No italic recipe exists.
- **Risk 13 — Parallel lanes, shared files.** Every round 5 lane touches the barrel, the registry JSON and generated view, the docgen and Controls pins, the package harnesses, the artifact, the catalog, the changelogs and the MCP README. T6 is sequential, so anchors are by neighbour: regenerate generated files after the previous lane lands, never hand-merge them, and re-hash `types.ts` after any rebase. The Controls component list is order-sensitive (literal interning), so the new row goes last.
- **Risk 14 — Changelog headings.** `@egdev/system` has two headings that look alike: the open one is `## 0.13.0`; its `## 0.11.0` is an older, already released version. Tokens needs a new `## 0.6.2` whose heading must equal the manifest version, or `release:pack` fails.
- **Risk 15 — Package harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18 and 19 matrix and the packed token count stay pending, which blocks a "verified in packed consumers" claim, not the rest.
- **Risk 16 — Consumer fit.** egdev-website's pages are not built, so no reference markup exists; the first real use may ask for another step, a heading level or table scrolling, which would be a separate request (non-goals of the spec).

## 13. Pending owner decisions

No Material recipe, token value or naming convention is pending: the recipes, the token and the two reused conventions were approved with the spec and the token confirmation.

1. **D1 — Plan approval (G1).** Approve this exact plan, the §2 edit surfaces (including the parent-owned integration files and the token edit of slice 1), or revise it. The spec approval and the token confirmation do not cover it.
2. **D2 — Browser and capture authorization.** Starting `pnpm storybook` or a scratch build and using a real Chromium are needed for PRS-03, PRS-05, PRS-06, the reflow, contrast and focus observations and the Controls widgets; capturing VIS-01 to VIS-03 and adopting any capture as expected design are separate decisions. Without them those rows stay **Not observed** or **Not evaluated**.
3. **D3 — Packed consumers.** `pnpm test:package-consumption` packs and installs isolated fixtures and needs install and network permission and a known cache; without it PRS-13's React 18.3.1 and 19.3.0 evidence and TK-4 stay **Not observed**.
4. **D4 — Tokens version number.** This plan carries `@egdev/tokens` 0.6.1 → 0.6.2 as instructed for the plan. `docs/distribution/versioning.md` lists "new backwards-compatible capability" as a minor bump under 0.x, and the closest precedent (`--mask-scroll-fade-inline`) was released as tokens 0.6.0 with the owner's confirmation, which would make this 0.7.0. Confirm 0.6.2 or choose 0.7.0 at G1; the change is four literals.
5. **D5 — Issue citation.** The ui and system entries cite `(#569)`, which marks the issue fully resolved once the release is packed; if the owner reads the missing website adoption as leaving it open, write `Refs #569` instead. The tokens entry already uses `Refs #569`.
6. **D6 — Publishing the snapshot.** Publishing v0.1 on a canonical issue (the spec leaves the canonical issue Pending) is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: `documentedNativeProps.prose` lists `id`, `title`, `lang`, `dir`, `aria-describedby`, `className` and `style`; the hook strips only `dangerouslySetInnerHTML` and the component is a plain `FC` with no ref guard; `proseVariants` is a `cva` array with one element per target and stays private; the spelling of the three non-trivial emitted selectors is taken from the first GREEN build and pinned by E1; no new contrast pin for `fg-secondary`; the token slice lands alone and first; E1 lives in `storybook-css.test.ts` and is committed in slice 5; the five story names and the shared diagnostic fixture; the MCP README refresh by recomputed digests until T4's procedure exists.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, generated file, catalog, capture, release, Git or GitHub action is taken or implied. Stop and return to the owner if: a descendant utility is absent from the preview build or the shipped CSS, or an emitted selector or cascade differs from §3; the computed results differ with and without Preflight, or a computed value disagrees with the spec's token arithmetic; the built `.max-w-prose` does not read `--container-prose`; a token test other than the pinned counts and version fails, or another lane's token change makes the counts disagree; `props:check` fails for a reason other than stale revisions; the artifact exceeds the 768 KiB budget or its diff shows sections this plan does not expect; docgen or Controls report an owned diagnostic; an existing suite must change to pass; a whole-repo test fails on an unexported folder and cannot be fixed without weakening it; a generator or test demands an edit outside §2; or a stylesheet, dependency, Radix package, Surface import, inline style, `!important`, HTML-string prop, ref or `asChild` appears necessary.
