# Footer v0.4 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, tests, registry or receipt write, artifact or catalog regeneration, capture, release or Git action. Nothing below is implemented or measured: preparation was read-only (reading source, tests, generators and registry, plus whole-file digests), and no build, test, Storybook, browser or capture ran.
- **Coverage:** S2, S3 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md): requests #561 (width) and #565 (register), plus the Footer half of #562 (FooterNavigation adopting Link `quiet`, FT-28). This is the plan gate that precedes implementation under T6. It does not cover Link v0.5 itself (its own spec and plan). Format follows the [Carousel v0.4 plan](../../carousel/v0.4/implementation-plan.md); the Footer precedents are the [v0.3 plan](../v0.3/implementation-plan.md) and the SectionShell recipes it reuses.
- **Contract authority:** [spec.md](spec.md) v0.4, Approved on 2026-11-26. `contentSHA256: 331bad27caec2d85105c724e0656addb15ff7cc9c49d0944b3d09491084d279a`, reproduced byte-exact in this working tree with the spec's own rule (payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline; `awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`) and by an independent byte-level check. Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L5), 2026-11-26, given on the committed draft (`7ed25eb`, payload `b33fdfc17ff8f18fe3f7c442e53612f493319e3a7e38e52c7c7d16592d16820b`) with the recommended answers to OQ-1 to OQ-5, including both naming-convention amendments. The cataloging approval is L3. Visual hashes: VIS-01 to VIS-04 Pending.
- **Order of work (hard prerequisites).** (1) **T2**, the single-child `key` warning fix (ODD S5a), lands first: it edits `useFooter.ts`, `Footer.tsx` and `Footer.test.tsx`. (2) **Link v0.5** (#562) is implemented, tested and on the branch this work builds on: Footer passes `variant: 'quiet'`, which type-checks only once `LinkVariant` has it. (3) Only then this plan's code, so Footer is touched once (spec OQ-5). The baseline below predates both: re-take every digest and line anchor after they land, and stop if `types.ts` no longer matches the spec's reviewed digest.
- **Plan identity:** `contentSHA256: 038b06c0ef9abf9ec80abd0fe97c87477155d9b6aafa77f343a3bb9a2e35d903` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line (anchored at line start) through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b` (docs-only commits over `7afaabd`; the Footer sources are unchanged since `ea26078`); at inspection no tracked file under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified, and neither T2 nor Link v0.5 is in the tree. Whole-file SHA-256 (first 8 … last 4), read in this working tree: Footer folder `types.ts` `627ebf23…f36f` (equal to the spec's reviewed digest and to the `revision` of all four registered Footer usages), `useFooter.ts` `ca06936b…63a4`, `Footer.tsx` `489a771a…0168`, `Footer.test.tsx` `e9947cf0…ff71` (20 cases), `Footer.stories.tsx` `250107e4…a67c` (11 stories), `index.ts` `22607d02…fe1c`; integration files: `packages/ui/src/index.ts` `713d1843…c0fd`, `storybook-docgen.test.ts` `3705e162…71c6`, `storybook-controls.test.ts` `f7928479…cd7c`, `storybook-css.test.ts` `81993251…41e9`, `scripts/prop-naming.test.mjs` `f2acfd78…629c`, `prop-naming.json` `ceb95f54…9927`, `docs/prop-naming.md` `096d7125…2b73`, `package-exports.test.mjs` `9b779e24…9495`, `package-consumption.test.mjs` `de9a624c…35ec`, `design-system-artifact.test.mjs` `51238e62…38d0`, `catalog_data.py` `041dccd6…ec5c`, `design-system.json` `21b5dc68…3ae1` (610,264 bytes), `.storybook/preview.css` `b55993fb…e902`; precedents: SectionShell `types.ts` `2ffb7ade…5cd1` (equal to its two registry revisions), Link `types.ts` `850d9f0b…2021`, and the receipts `section-shell/v0.1/prop-naming-approval.json` `81a7c8c1…344b` and `color-swatch-group/v0.1/prop-naming-approval.json` `1410b6d1…3fb6` (last in `receiptChain` at inspection).

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns. The contract approval and the L5 answer grant no code (S6). Approving the plan approves no capture, release, receipt content beyond §5.1, or GitHub write. Per the component-spec-proposer skill, the plan is not approved until the two prerequisites above are confirmed (D1).
2. **G2 — Spec provenance and its one limit.** The question that approved the spec carried no recorded text ([approval.md](approval.md)), so the spec digest binds the bytes derived from the committed draft plus the recommended answers, not a digest the owner quoted. The plan accepts that as provenance; a reviewer who wants an exact-digest confirmation can ask for it before G1. Nothing here upgrades it.
3. **G3 — Registry: two convention amendments, no new ID, no exception.** The owner approved widening `section-register` and `section-content-wrap` to Footer with the exact text in spec §3 (OQ-1). The plan first creates the receipt that binds that text (§5.1), then amends the two registry entries, then appends the two Footer usages and refreshes the four existing ones. Names, `avoid`, aliases, exceptions and statuses stay; no other convention changes; reuse approves nothing globally.
4. **G4 — Recipes, tokens, files.** The Grafito wash and the wrapper recipe are approved in spec §6 for Footer only. No token, dependency, Radix package or stylesheet: **No stylesheet**, `packages/ui/src/styles/legacy/bundle.css` stays byte-identical and `compiled.css` already scans `../organisms/footer/types.ts` (`:58`). Every utility is a static literal in a CVA string composed per part with `cn()`; no inline style, interpolated class, new AGENTS.md exception, `className` surface change or `@classNameAllows` tag.
5. **G5 — The wrapper reads two existing tokens.** `--content-max` and `--gutter` are used as in SectionShell; the 1440px numbers in the spec are derived, not measured, until §9.
6. **G6 — Emission and cascade are proved, not assumed.** Footer's new literals duplicate SectionShell's, so the packed stylesheet may already contain them: a green emission assertion proves the selectors exist, not that Footer's scan produced them (§4, E1). The wrapper is checked against the legacy `.eg-footer__wrap` rule on a page that loads only the packed sheets (no preflight) in §9.
7. **G7 — Integration ownership.** The registry JSON and its generated view, the receipt, the system artifact, catalog source and outputs, package harnesses, `.storybook/preview.css`, changelogs, the evidence file and the ODD log are parent-owned integration surfaces, as in the Carousel and IconButton plans. A writer touches only the Footer folder. `footerWrapVariants` and `footerVariants` are not exported (`index.ts` exports only `footerHeadingVariants` and the new type).
8. **G8 — Stop lines.** Stop and return to the owner if: T2 or Link v0.5 is absent when work starts; a utility does not emit or cascades differently from §3; `register` or `wrap` would have to reach the DOM; an existing Footer case has to change to pass; a generator demands an edit outside §2; a story import is rejected by the package boundary lint; or a token, dependency or stylesheet appears necessary.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/organisms/footer/types.ts` | Writer | `FooterRegister`; `wrap` and `register` in `FooterProps` before `children` (spec §3 JSDoc, `@control boolean` / `select`, bare `@default false` / `none`); `register` axis on `footerVariants` (`none: ''`, `grafito` with the three utilities) plus `defaultVariants`; `footerWrapVariants` | +34 / −3 |
| `packages/ui/src/organisms/footer/useFooter.ts` | Writer | Destructure `wrap` and `register` before `...native` so neither is forwarded; strict resolution; pass `register` to `footerVariants`; return `wrapped` and `wrapClassName`; add `variant: 'quiet'` to each link's props (`:108-115`) | +14 / −3 |
| `packages/ui/src/organisms/footer/Footer.tsx` | Writer | JSX only: the wrapper ternary of `SectionShell.tsx:8` around stage, grid and legal; one component JSDoc sentence kept true | +10 / −5 |
| `packages/ui/src/organisms/footer/Footer.test.tsx` | Writer | New `describe('Footer v0.4 wrap, register and quiet links')` (§4, U1 to U11); the existing 20 cases are untouched, and only the import specifiers change | +235 / −2 |
| `packages/ui/src/organisms/footer/Footer.stories.tsx` | Writer | `Wrapped`, `Grafito`, `WrappedGrafito`, `HostFade` and the meta sentence about the background (§6); existing stories untouched | +58 / −2 |
| `packages/ui/src/organisms/footer/index.ts` | Writer | Export the type `FooterRegister` | +1 |
| `packages/ui/src/index.ts` | Parent | Add `FooterRegister` to the Footer type exports (after `FooterProps`) | +1 |
| `.storybook/preview.css` | Parent | One `@source` line for `Footer.stories.tsx` so the host utilities of `HostFade` exist in the preview (production CSS untouched) | +1 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | Footer pin (`:956-1029`): own-prop list gains `wrap` and `register` after `'aria-current'`; metadata assertions for both rows (§5.2) | +14 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | Control map `footer` (`:309`) → `wrap: 'boolean'`, `register: 'select'`, `children: false`; `ownPropCounts.footer` 1 → 3 (`:774`) | +2 / −2 |
| `packages/ui/src/lib/storybook-css.test.ts` | Parent | One preview-build pin for the `HostFade` host utility `[&_.eg-footer]:bg-transparent` (§4, E2) | +14 |
| `scripts/package-exports.test.mjs` | Parent | Extend the Footer CSS test (`:699`) with the register and wrapper utilities and their reduced-transparency block; extend the Footer SSR test (`:738`) with a wrapped Grafito case (§5.5) | +34 |
| `scripts/package-consumption.test.mjs` | Parent | Typed `FooterRegister` samples and negatives, `assertFooterConsumerCSS` (`:5626`), the SSR block (`:6578-6591`) (§5.5) | +28 / −2 |
| `docs/components/footer/v0.4/prop-naming-approval.json` | Parent | New receipt for the two convention amendments (§5.1) | +95 |
| `skills/_shared/prop-naming.json` | Parent | Amend `section-register` and `section-content-wrap` text and approval; append two Footer usages; refresh the four existing Footer revisions (§5.1) | +36 / −14 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ ±12 |
| `scripts/prop-naming.test.mjs` | Parent | `receiptChain` append; `postReceiptUsages` Footer v0.4 usages; `historicalRegistry` amendment map; SectionShell test reads its pre-image; Footer usage pin four → six; one receipt-binding test (§5.1) | +100 / −10 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Footer artifact assertion (§5.3) | +16 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ ±16 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | Footer row note (`catalog_data.py:107`), then one `build_catalog.py` run (§5.4) | ±1 line each |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | Entries under the existing `## 0.11.0` and `## 0.13.0` sections (§7) | +17; +4 |
| `docs/components/footer/v0.4/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED/GREEN output, browser table, hashes (§9) | +45 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: `packages/ui/src/atoms/link/**` (Link v0.5 owns it), `packages/ui/src/templates/**`, TopBar and every other component; `packages/tokens/**`; `packages/ui/src/styles/**` (legacy bundle frozen); package manifests, versions and the lockfile; `packages/effects/CHANGELOG.md` and `packages/mcp/CHANGELOG.md` (their 0.11.0-set entries stay "no code changes"); `.storybook/main.ts` and `preview.tsx`; the frozen v0.1 to v0.3 documents, the spec and the approval record.

## 3. Design of the change

**API.** Exactly spec §3: two optional props consumed by the hook and never forwarded, `FooterRegister = 'none' | 'grafito'`, no `fade` input, no refs, no `asChild`. The JSDoc is the spec's block, in English, with one `@control` each and bare `@default` values.

**CVA structure.** Every string is one static literal (no template, no concatenation) so the Tailwind scanner and the artifact builder read it. The shapes below are illustrations re-derived on the post-T2 baseline.

```ts
export const footerVariants = cva('<existing base, unchanged>', {
  variants: {
    register: {
      none: '',
      grafito: 'bg-surface-0/50 bg-none [@media(prefers-reduced-transparency:reduce)]:bg-surface-0'
    }
  },
  defaultVariants: { register: 'none' }
});
export const footerWrapVariants = cva(
  'eg-footer__wrap box-border w-full max-w-[var(--content-max)] mx-auto px-[var(--gutter)]'
);
```

**Hook.** `wrap` and `register` come out of the props before `...native`, so neither can reach the DOM. Only the boolean `true` and the literal `'grafito'` opt in; every other runtime value is the default, silently, as spec §4 says.

```ts
export function useFooter({ children, className, wrap, register, ...native }: FooterProps, parts: Parts) {
  // …existing protected-prop stripping and `collect(children, parts, stage, grid, legal)` unchanged
  const rendered = stage.length + grid.length + legal.length > 0;
  return {
    rootProps: { ...rest, className: cn(footerVariants({ register: register === 'grafito' ? 'grafito' : 'none' }), className) },
    wrapped: wrap === true && rendered,
    wrapClassName: cn(footerWrapVariants()),
    stage, grid, legal, gridClassName: cn(footerGridVariants())
  };
}
// useFooterNavigation: each entry's anchor props gain `variant: 'quiet' as const` beside href, aria-current and className.
```

**JSX (`Footer.tsx`, no logic).** The stage, grid and legal row keep their order and conditions. With `wrapped` false the output is today's: `footer > stage, grid, legal`.

```tsx
const body = (<>{stage}{grid.length > 0 && <div className={gridClassName}>{grid}</div>}{legal}</>);
return <footer {...rootProps}>{wrapped ? <div className={wrapClassName}>{body}</div> : body}</footer>;
```

**Emission inventory.** Each static utility, the declaration it must emit, and where it is proved:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `bg-surface-0/50` | `background-color` derived from `--color-surface-0` at 50% (the serialization is whatever the installed Tailwind emits; the rule block must contain `--color-surface-0` and `50%`) | E1 |
| `bg-none` | `background-image: none` | E1 |
| `[@media(prefers-reduced-transparency:reduce)]:bg-surface-0` | `background-color: var(--color-surface-0)` inside an `@media (prefers-reduced-transparency: reduce)` block | E1 |
| `box-border`, `w-full`, `max-w-[var(--content-max)]`, `mx-auto`, `px-[var(--gutter)]` | `box-sizing: border-box`, `width: 100%`, `max-width: var(--content-max)`, `margin-inline: auto`, `padding-inline: var(--gutter)` | E1, §9 |
| `[&_.eg-footer]:bg-transparent` (story host only) | `background-color: transparent` on `.eg-footer` inside the host | E2 (preview build) |

**Why the shape.** One wrapper and no negative margins (OQ-4); the legacy `.eg-footer__wrap` rule has the same four declarations, sits in `@layer components` and loses to the utilities by layer order, and the only declaration the utilities add is `box-sizing` (§9 proves it). The register axis lives on the root recipe because the wash is root paint and the wrapper only constrains content (spec §4, "Both props are set").

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records command, exit code and counts). Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded. Browser-only geometry and paint are not claimed from jsdom; they sit in §9.

**R0 — PRESERVE baseline, no edit.** On the base that already contains T2 and Link v0.5: the 20 existing Footer cases, the docgen and Controls suites, the Link and SectionShell suites, `props:check`, `test:props`, `artifact --check` and `system:check` all green. This is the baseline every later RED is read against.

**New unit tests** (`Footer.test.tsx`; roles and accessible names, `userEvent` where it applies, no full class strings, no `data-testid`):

| ID | Test | Covers |
| --- | --- | --- |
| U1 | PRESERVE: with neither prop, the `Default`, `Minimal` and `Landmark` args render stage, grid and legal as direct children of the footer, with no `.eg-footer__wrap`, no `bg-*` token on the root and no `wrap` or `register` attribute | FT-19 |
| U2 | `wrap={false}` with `register='none'` renders the same tree and per-element class lists as omitted props (generated ids normalized by order), and neither prop reaches the DOM | FT-19 |
| U3 | `wrap` with the `Default` args: exactly one `div.eg-footer__wrap` is the footer's only child element and holds stage, grid and legal in order; it has no `role`, `id`, `tabindex` or `aria-*`; its classes include `box-border`, `w-full`, `max-w-[var(--content-max)]`, `mx-auto` and `px-[var(--gutter)]` and none starts with `overflow-`; the root keeps `pb-8` and both hairline classes | FT-20 |
| U4 | `wrap` with no rendered part (`null` children, or a navigation with no valid entry) renders no wrapper and an empty root; a wrapped case repeats the marker loop of `Footer.test.tsx:98-100` as a **new** test: every legacy marker except `wrap` is absent | FT-20 |
| U5 | `wrap` cast through `unknown` (`'true'`, `1`) behaves as absent: no wrapper, no attribute, no throw, `console.warn` and `console.error` not called | FT-21 |
| U6 | `register` cast (`'pro'`, `'show'`) behaves as absent: no `bg-*` token, no attribute, no throw, no console call | FT-21 |
| U7 | `register='grafito'`: the root has `bg-surface-0/50`, `bg-none` and the reduced-transparency variant, keeps `text-fg-default` and both hairlines, and has no `min-h-*`, `flex`, `isolate`, `pt-[calc(` or `shadow-*` token; it is exposed as `contentinfo` with no `role` attribute; `register='none'` has no `bg-*` token | FT-24 |
| U8 | The four `wrap` × `register` combinations with consumer `mt-4` and `w-full` on the root and on a part: each yields the structure of U3 and U7, the wash is on the root and never on the wrapper, and the consumer classes survive beside the recipe | FT-26 |
| U9 | A `fade` prop is a type error (`// @ts-expect-error` with a written reason, checked by `pnpm typecheck`; the docgen pin of §5.2 fixes the own props as exactly `wrap`, `register` and `children`); no root class contains `mask-image`; the `HostFade` args render a host-owned masked underlay with no Footer change | FT-27 |
| U10 | Gated on Link v0.5. Every anchor `FooterNavigation` renders has exactly the class list of a standalone `Link variant='quiet' arrow={false}` given the Footer target recipe as `className`; `text-link-default` is absent; `aria-current` is still forwarded; brand, social and legal links keep the classes of their standalone render | FT-28 |
| U11 | The args of every story, the 11 existing and the 4 new, render under a `console.error` spy with no `key` warning; it extends T2's regression test if that enumerates stories, otherwise it adds this loop | FT-32 |

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| FT-19 | U1, U2 | **U1 is PRESERVE, no RED** (green before and after). U2, the explicit-values half the spec also files under FT-19, is not: it fails because `register="none"` reaches the DOM, since the hook forwards unknown props today | Focused run green; existing cases unmodified |
| FT-20 | U3, U4 | No `.eg-footer__wrap` exists and `wrap` is forwarded, not consumed | Same runner green |
| FT-21 | U5, U6 | `wrap="true"` and `register="pro"` leak as DOM attributes | Same runner green |
| FT-22, FT-23, FT-25, FT-29 | None in jsdom | **Browser-only, no RED run**: no wrapper or wash exists to measure | §9 rows, Pending until D2 |
| FT-24 | U7; E1 first | Classes absent. E1 is a **guard, no RED**: SectionShell already ships the same literals (G6) | Green; E1 green on the packed build |
| FT-26 | U8 | Wrapper and wash absent; attributes leak | Green |
| FT-27 | U9 | The `HostFade` export is missing; the `fade` negative and the class assertions are guards | Green; `pnpm typecheck` |
| FT-28 | U10 | With Link v0.5 in the tree, Footer still renders `plain`, so the class lists differ | Green after `variant: 'quiet'` |
| FT-30 | Docgen and Controls pins edited first; the receipt test (the receipt file does not exist); the artifact assertion | Pin lists lack `wrap` and `register`; receipt read fails; `props:check` stale on the four revisions and `artifact --check` stale after the `types.ts` edit | `props:docs`, `props:check`, `test:props`, `artifact --write`, `system:docs`, `build_catalog.py` and the artifact suites green |
| FT-31 | U12 (the 20 existing cases unmodified, checked with `git diff -U0`); the packed harness extended first | Harness assertions fail against the baseline `dist` | Green after `pnpm build`; React 18.3.1 and 19.3.0 when D2 is granted |
| FT-32 | U11 | **Guard for the 11 existing stories** (T2 landed first); the four new stories are imported by name and fail until added | Green |

**E1 and E2 — emitted CSS.** E1 (`package-exports.test.mjs`, packed `dist/styles.css`): the register and wrapper selectors exist in `@layer utilities`, the `bg-surface-0` fallback sits inside a `prefers-reduced-transparency: reduce` block, and the declarations match §3 through `cssBlock`. The existing Footer test walks only the first `cva` argument, so the options object is added explicitly, following the SectionShell test (`:157-231`). E2 (`storybook-css.test.ts`, preview build): the `HostFade` host utility is emitted once `Footer.stories.tsx` is scanned. If the optimizer nests rules, the first RED to GREEN run exposes it and the helper is adapted in the same file.

**PRESERVE and differential.** The shared code is the root props, the part partition and the navigation link props, used by every Footer. Evidence that previous behavior holds: the 20 existing cases unmodified, U1 and U2, and one differential render on a copy of the base commit in `mktemp -d` (not committed): static markup of every existing story's args with `wrap` and `register` omitted must be byte-identical between the base copy and the change **except** the class attribute of the navigation anchors (the Link `quiet` swap, FT-28), which the check masks. Any other difference nobody asked for is a regression to fix and pin with a test.

**GREEN order.** Receipt and convention amendments (§5.1, slice 1) → `types.ts` → `useFooter.ts` → `Footer.tsx` → `index.ts` and barrel → focused runner → registry usages → stories and preview source → pins → E1, E2 → artifact → catalog → changelogs.

## 5. Registry, docgen and artifact obligations

### 5.1 Registry, receipt and its tests

**Receipt first.** Create `docs/components/footer/v0.4/prop-naming-approval.json`, a `human-approval-record` in the shape of the [calendar-grid organism receipt](../../calendar-grid/v0.1/collection-items-organism-approval.json), before any registry edit:

- `authority: "assistant-recorded-forwarded-owner-approval"`, `nativeReviewApproval: false`; `evidence.userStatements`: "Sí, ampliarlo (Recomendado)" (L3) and "Aprobar todas (Recomendado)" (L5), each with its locator and the date 2026-11-26, plus `specPath` and the spec payload digest `331bad27…279a`.
- `priorReceipts`: **two** entries with whole-file digests: the receipt that is last in `receiptChain` when the slice starts (`color-swatch-group/v0.1` at inspection; T3's `step-count` receipt or a sibling plan's may precede it), because each receipt must pin its predecessor, and `docs/components/section-shell/v0.1/prop-naming-approval.json`, because `registryBeforeSemanticAmendments` reads each amendment's `previousReference` only from `priorReceipts`.
- `semanticAmendments`: `section-register` (previous content hash `sha256:9adf9db4…bfe8`) and `section-content-wrap` (`sha256:953bf9bc…17e3`), `changedFields: ["meaning", "whenToUse"]`, each with the `before` and `after` text of the spec §3 table, verbatim, and a `boundary`: SectionShell and Footer only; values, defaults and recipes stay component-specific; no new convention, name, exception, component, token or dependency; no API migration.
- `entries`: one `convention:<id>` record per amended convention, with `contentHash` from the exported `conventionHash` helper (never by hand) and the full amended convention.

**Registry.** In `prop-naming.json`: the two amended entries get the new `meaning` and `whenToUse` and an `approval` of `{ reference: "docs/components/footer/v0.4/prop-naming-approval.json", scope: "convention:<id>", contentHash }`. Then append, never reorder:

```json
{ "component": "Footer", "type": "boolean (default false)", "status": "existing",
  "source": { "path": "packages/ui/src/organisms/footer/types.ts", "symbol": "FooterProps", "revision": "sha256:<whole-file SHA-256 of the final types.ts>" } }
```

to `section-content-wrap`, and the same with `"type": "FooterRegister ('none' | 'grafito'; default none)"` to `section-register`. Then refresh the four existing Footer usages, currently `sha256:627ebf23…f36f`: `collection-items` (`FooterNavigationProps`), `accessible-name` (`FooterNavigationProps` and `FooterNavigationItem`) and `heading-level` (`FooterNavigationProps`). All six usages carry the same new hash. Hash only after `types.ts` is final and `pnpm lint` is clean on it; any later edit, even formatting, requires re-hashing, and `--write` never refreshes evidence or approvals.

`pnpm props:docs` regenerates `docs/prop-naming.md`; then `pnpm props:check` and `pnpm test:props`.

**`scripts/prop-naming.test.mjs`.** RED drives the exact edits; the expected ones, each following an existing precedent:

- Append the new receipt to `receiptChain` (after `:2491`).
- `postReceiptUsages` (`:794-799`): add `section-register` and `section-content-wrap` at `packages/ui/src/organisms/footer/types.ts#FooterProps`.
- `historicalRegistry` (`:912-920`): map `section-register` and `section-content-wrap` to the SectionShell receipt, as `panel-footer` and `tooltip-content` are.
- The SectionShell test (`:3912`) compares the live convention with its plan and receipt, which the amendment changes: read the pre-image through `registryBeforeSemanticAmendments`, as the SectionNav test does.
- The Footer usage test (`:2210`, "four approved navigation usages") becomes six, with the two new rows.
- One receipt-binding test in the style of the Heading and ColorSwatchGroup tests: statements and dates, the digests of both `priorReceipts`, `previousContentHash` equal to the SectionShell records, `entries` equal to the live conventions, the registry `approval` equal to the record, and a `meaning` change rejected by `validate`.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts` (Footer pin, `:956-1029`): the own-prop name list becomes `href`, `label`, `'aria-current'`, `wrap`, `register`, `children`, `children`, `children`, `label`, `level`, `items`, `children`, `children`. Assert `root.props.wrap` with `required: false`, `defaultValue: { value: 'false' }`, `tags: { control: 'boolean' }`, and `root.props.register` with `required: false`, `defaultValue: { value: 'none' }`, `tags: { control: 'select' }` and options `none`, `grafito` through `normalize`, as the `level` row does. The existing loop already enforces exactly one `@control` per own member.
- `storybook-controls.test.ts`: `footer: { wrap: 'boolean', register: 'select', children: false }` and `ownPropCounts.footer` 3, with zero owned diagnostics. Controls inject no argument for the optional rows; real browser widgets are checked in §9, not inferred from tags.

### 5.3 System artifact

`pnpm artifact --write` then `pnpm system:docs`. Expected diff: the Footer entry gains `register` and `wrap` props (sorted by name, with `default` `none` and `false`), a `footerWrapVariants` entry and the `register` axis on `footerVariants` in `variants` and `anatomy`, possibly new `anatomyUtilities`, and the two Footer usages plus the amended convention text in `propNaming`. No new `types` entry: the usages' component, `Footer`, is a public export. The artifact is 610,264 bytes against the 1,048,576-byte budget in `design-system-artifact.test.mjs`; confirm it stays under. Add one assertion near the existing Footer-adjacent tests: Footer props include `wrap` (default `false`) and `register` (default `none`); `footerWrapVariants` lists the wrapper utilities; `footerVariants` carries the `register` axis. Then `artifact --check`, `system:check`, `test:artifact` and `test:system` green, and again after `pnpm build`.

### 5.4 Catalog

In `scripts/catalog_data.py:107` keep the Footer row and replace its last sentence, "The host owns background and placement; no choreography, stylesheet, ref or asChild.", with: "v0.4 ([#561](https://github.com/egdev6/egdev-design-system/issues/561), [#565](https://github.com/egdev6/egdev-design-system/issues/565)) adds the optional `wrap` (a centered page-width content wrapper; hairlines and bottom padding stay full width) and `register='grafito'` (the Grafito reading wash on the footer root); with `register` omitted the host owns the background, the group-edge fade is always host-owned, and navigation links render with Link `quiet`. The host owns placement; no choreography, stylesheet, ref or asChild." Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` (`:143`) or `docs/catalog.json`.

### 5.5 Package fixtures

`package-exports.test.mjs`: extend the Footer CSS test (`:699`) with E1 and the SSR test (`:738`) with a wrapped Grafito Footer: one `.eg-footer__wrap` as the only child, the three register utilities on the root, no `wrap` or `register` attribute, and, once Link v0.5 is in the packed build, the `quiet` ink on the navigation anchors. `package-consumption.test.mjs`: add `FooterRegister` to the type import (`:118`), typed positive samples for `wrap` and both register values, negatives (`register: 'pro'`, a `fade` prop, and `footerWrapVariants` beside the existing `FooterPrivate` check at `:822`), extend `assertFooterConsumerCSS` (`:5626`) with the register and wrapper selectors, and extend the `FooterSamples` assertions (`:6578-6591`). No ref, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Organisms/Footer` keeps autodocs, `Meta<typeof Footer>`, no manual `argTypes`, no `play`; every new story is English and typed `Story`, uses the shared `content` constant and leaves the 11 existing stories untouched (tests render their args).

- `Wrapped`: `wrap: true` with the `Default` content, rendered after an exported `SectionShell` so the content edges can be compared (the VIS-01 scenario; stories already import the template, for example `Closing.stories.tsx:5`).
- `Grafito`: `register: 'grafito'` over a host backdrop painted with a token utility (`bg-surface-2`), so the 50% wash is visible; the real site's backdrop is the ambient layer, which Footer does not own.
- `WrappedGrafito`: both props over the same backdrop (VIS-02 and VIS-03).
- `HostFade`: both props inside a host `relative isolate [&_.eg-footer]:bg-transparent` wrapper with an `aria-hidden` underlay masked by `--mask-section-fade-top`, the SectionShell stories' pattern (`SectionShell.stories.tsx:68-83`) with the footer's own marker as the only hook. A JSDoc line states that the fade is host-owned and not API.
- Meta sentence: replace "host-owned background" with text that says the host owns the background unless `register='grafito'`. Controls: the registered enhancer shows `wrap` as a boolean and `register` as a select in union order and injects no argument; `Default` stays unchanged.
- `.storybook/preview.css` gains the `@source` line for `Footer.stories.tsx`; production CSS does not scan stories.

## 7. Changelog entries

0.11.0 was never packed (S2), so the entries go straight under the existing sections, with no `## Unreleased` and no version bump. `packages/ui/CHANGELOG.md`, at the top of the existing `### Added` of `## 0.11.0`, plus a new `### Changed` subsection after it:

```md
- Footer accepts an optional `wrap`: when true, one centered wrapper with the page content max-width and gutters
  encloses the motto, grid and legal row, so the footer content aligns with wrapped sections while the root
  hairlines and bottom padding stay full width. The default is `false`: the footer renders as before. (#561)
- Footer accepts an optional `register`: `'grafito'` paints the Grafito reading wash (`surface-0` at 50 percent, solid
  under reduced transparency) on the footer root, which stays a native `footer` at its natural height; `'none'` (the
  default) paints nothing and the host keeps the background. The group-edge fade stays host-owned (see the `HostFade`
  story). The `FooterRegister` type is exported. (#565)

### Changed

- `FooterNavigation` renders its links with Link `quiet` (neutral text with an underline) instead of `plain`, so the
  link ink and underline colour change for every Footer consumer, with no opt-out prop; the type step and the
  44.8px target recipe are unchanged. It needs Link `quiet` from the same release. (#562)
```

`packages/system/CHANGELOG.md`, at the top of the existing `### Added` of `## 0.13.0` (the system version of the 0.11.0 release set):

```md
- The artifact and design reference include Footer's `wrap` and `register` props, its `register` recipe axis and
  `footerWrapVariants`, and the `section-register` and `section-content-wrap` conventions widened to Footer; existing
  props and recipes are unchanged. (#561, #565)
```

`(#N)` cites a fully resolved issue ([versioning](../../../distribution/versioning.md)); `release.json` records `resolves` only when a separately authorized release packs these sections (T7). The `(#562)` citation needs one coordinated owner (D3).

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner (flags as in the Carousel plan).

```sh
pnpm exec vitest run packages/ui/src/organisms/footer packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/atoms/link packages/ui/src/templates/section-shell --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/tokens packages/ui/src/styles packages/ui/src/atoms packages/ui/src/templates packages/ui/src/organisms/top-bar
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
pnpm artifact --check
pnpm system:check
pnpm test:package-exports
pnpm test:package-consumption
pnpm test:mcp
pnpm storybook-build
git status --short
```

The `git diff --stat` scope check runs against the base commit that already holds T2 and Link v0.5 and must print nothing; the final `git status --short` must list only §2 paths, with no scratch, cache or `.playwright-mcp/` output. `pnpm build` regenerates artifacts, hence the second `artifact --check`. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache (`EGDEV_CONSUMER_OFFLINE=1` reports a cache miss instead of a pass); it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler. Record any unavailable matrix as pending. `pnpm test:mcp` runs once at the end: a drift caused by this change is fixed here, a release-procedure drift in the README examples is T4's (S5d), not Footer's. CI runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and run here because `@egdev/system` ships.

## 9. Browser and capture procedure

Only after separate permission to start `pnpm storybook` (it builds tokens first) and to use Playwright MCP, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion, transparency and forced-colours settings, crop and date for every observation, and which stylesheets the page loads. Stories: `organisms-footer--wrapped`, `--grafito`, `--wrapped-grafito`, `--host-fade`, plus `--default` and `--responsive` for preservation.

1. **FT-22 alignment.** At 390, 861, 1280 and 1440px the `Wrapped` footer's content box has the same left edge and width as the section content box above it (the tokens predict x=240px and 960px at 1440px); an unwrapped footer's content starts at x=0. On a page that loads only the packed `styles.css` and tokens (no preflight), the wrapper computes `box-sizing: border-box` with the legacy `.eg-footer__wrap` values for the other four declarations, and the page has no horizontal overflow at 390px.
2. **FT-23 grid.** With `wrap`, brand present and absent and long labels, at 390, 859, 860, 861 and 1280px: two tracks at 860px and below, three above, the brand spans both only when present, no clipping or horizontal overflow.
3. **FT-25 register.** The root's computed background equals a SectionShell `grafito` section's in the same fixture, is solid `surface-0` under emulated `prefers-reduced-transparency: reduce`, and the footer's height equals its content plus its own padding and borders (no minimum height; shorter than the viewport at 1280×900 with the `Default` content).
4. **FT-29 targets, focus, contrast.** Footer-owned links are at least 44.8 × 44.8 CSS px, wrapped and unwrapped; a real keyboard Tab shows the focus ring not clipped at the wrapper edge (the wrapper and root compute `overflow: visible`); the text roles meet 4.5:1 on the solid `surface-0` fallback, computed from resolved colours. Contrast over the translucent wash on the website's ambient layer is **Not evaluated**.
5. **HostFade.** The masked underlay is visible and the footer root computes a transparent background inside the host.
6. **Controls.** `wrap` is a boolean and `register` a select with options `none`, `grafito`, with no injected argument.
7. **Captures VIS-01 to VIS-04**, only if authorized: component-zone PNGs of the footer under `docs/components/footer/v0.4/` named `<variant>--<state>--<viewport>--<theme>.png` (for example `wrapped--default--1440x900--dark.png`), with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, not approved expected design, until the owner adopts exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. A GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture exists and no expected-design source was adopted; none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English; bodies use `Refs #561`, `Refs #565` and `Refs #562`, never `Closes` ([consumer requests](../../../distribution/consumer-requests.md)). The PR is squash-merged as in the Carousel plan; the slices exist for review and bisect. A failing RED commit is never made.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): widen the section register and wrap conventions to Footer (#561, #565)` | Receipt, the two amended registry entries, the regenerated view, and the `prop-naming.test.mjs` edits for the chain, the historical map, the SectionShell pre-image and the receipt-binding test | ≈ 182 |
| 2 | `feat(ui): add the Footer wrap and register props and quiet links (#561, #565, #562)` | `types.ts`, `useFooter.ts`, `Footer.tsx`, `Footer.test.tsx`, both `index.ts` files, the docgen and Controls pins, the registry usages and revisions, the regenerated view, the Footer usage pin | ≈ 411 |
| 3 | `feat(ui): add the Footer wrap and register stories and packed-build checks (#561, #565)` | `Footer.stories.tsx`, `.storybook/preview.css`, `storybook-css.test.ts`, `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 139 |
| 4 | `chore(integration): refresh the Footer artifact, catalog row and changelogs (#561, #565)` | `design-system.json`, `system.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, both changelogs | ≈ 61 |
| 5 | `docs(footer): record the v0.4 implementation evidence (#561, #565)` | `implementation-evidence.md`, the ODD log, and `capture.json` with PNGs only if authorized | ≈ 51 |

Slice 1 stands alone: the conventions are amended before any Footer usage exists, so `props:check` and `test:props` stay green. Slice 2 keeps the usages and revisions with the `types.ts` change. `pnpm artifact --check` is stale from slice 1 to slice 4 (the convention text, then the Footer entry); if every commit must be artifact-fresh, fold slice 4 into slice 2 (≈ 472, above the target).

## 11. Estimated changed lines

About **844 changed lines**: ≈ 810 hand-written (component ≈ 367: `types.ts` 37, hook 17, JSX 15, tests 237, stories 60, `index.ts` 1; tests and fixtures outside the folder ≈ 222; receipt, registry JSON, catalog source, changelogs, evidence, log, barrel and preview line ≈ 221) and ≈ 34 generated (`docs/prop-naming.md` ≈ 12, `design-system.json` 2, `system.md` ≈ 16, catalog 4). For calibration, the Carousel v0.4 plan estimated ≈ 585 and the Footer v0.3 plan ≈ 315; this change adds a receipt, two convention amendments, a registry-test rewrite and four stories.

## 12. Risks

- **Risk 1 — Prerequisite drift.** T2 and Link v0.5 change the same files (`useFooter.ts`, `Footer.tsx`, `Footer.test.tsx`, the Link type and artifact). Every digest, line anchor and snippet here is a baseline fact to re-take; U10 and FT-28 cannot go green without Link v0.5, and FT-32 is only a guard after T2.
- **Risk 2 — Receipt chain order.** A receipt must pin its predecessor's exact bytes. T3's `step-count` receipt or a sibling plan's may land first; pin whatever is last in `receiptChain` at slice 1, and re-hash if another receipt lands between slices.
- **Risk 3 — Registry coupling.** Every `types.ts` edit invalidates six usage revisions and the artifact. Hash last, re-hash after any formatting change. Amending two live conventions touches an old SectionShell test and the historical-registry map: an unexpected failure there is read through the existing amendment projections, never by editing an old receipt or hash literal.
- **Risk 4 — Emission is not proof of the scan.** SectionShell already ships `bg-surface-0/50`, the media variant and the wrapper utilities, so E1 can pass without Footer's source producing them. The existing `@source` line and the AST walk cover the source; the claim is limited to "the packed sheet contains the selectors".
- **Risk 5 — Cascade and `box-sizing`.** The legacy `.eg-footer__wrap` rule has no `box-sizing` and the packed sheet has no preflight, so only the `box-border` utility keeps `width: 100%` plus the gutter inside the container. §9 item 1 measures it; a loss is a stop line, not a CSS patch.
- **Risk 6 — Visible change for every consumer.** The Link `quiet` swap changes ink and underline colour for every Footer consumer with no opt-out prop (spec §1). Contrast of consumer-supplied brand, social and legal content over the translucent wash is host-owned and **Not evaluated** here.
- **Risk 7 — Remounting.** Toggling `wrap` changes the tree shape, so parts remount and a consumer part with local state loses it (spec §4); tests document it, they cannot prevent it.
- **Risk 8 — Story host.** `HostFade` depends on the preview scanning `Footer.stories.tsx` and on a token-only backdrop; the real ambient layer is not reproduced. The story is documentation, not API.
- **Risk 9 — Parallel branches.** The other Round 5 plans touch the same shared outputs: `prop-naming.json`, `prop-naming.test.mjs`, `docs/prop-naming.md`, `design-system.json`, `system.md`, `catalog_data.py` with its generated files and both changelogs. Expect rebase conflicts; regenerate generated files instead of hand-merging, and re-hash `types.ts` revisions after rebasing.
- **Risk 10 — Package harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18 and 19 matrix stays pending, which blocks "verified in packed consumers" claims, not the rest.

## 13. Pending owner decisions

No Material recipe, token or dependency decision is pending: the wash, the wrapper and the link adoption were approved with the spec. No release-timing decision is pending either: S2 puts the entries under the existing 0.11.0 sections, and the release is T7.

1. **D1 — Plan approval (G1) and prerequisites.** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it, and confirm that T2 has landed and Link v0.5 is implemented. The spec approval does not cover either.
2. **D2 — Permissions.** (a) Starting `pnpm storybook` and using Playwright MCP, needed for FT-22, FT-23, FT-25, FT-29, the Controls check and VIS-01 to VIS-04; without it those rows stay Pending or **Not evaluated**. (b) `pnpm test:package-consumption` with install and network access, needed for the React 18.3.1 and 19.3.0 matrix. Adopting any capture as expected design is a separate decision.
3. **D3 — Issue citations.** The entries cite `(#561, #565)` and `(#562)`, which mark the issues fully resolved. #565's group-edge fade stays host-owned (OQ-2): if the owner reads that as leaving #565 open, write `Refs #565`. #562 is complete only when both Link v0.5 and this adoption ship, so `(#562)` should appear once, here (this change lands second), with Link v0.5's own entry using `Refs #562`; confirm with Link v0.5's plan.
4. **D4 — Fallback trigger (decided in spec OQ-5).** Only if Link v0.5 is not implemented when this plan is approved: descope FT-28, U10 and the `### Changed` entry into a later Footer amendment, so `wrap` and `register` are not held back. It changes this plan's scope, so it needs the owner's explicit call at that moment.
5. **D5 — Publishing the snapshot.** Posting v0.4 as a comment on the canonical issue #293, cross-linked from #561 and #565, is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: strict resolution of out-of-type values (spec §4); the receipt's location, `authority` wording and two-entry `priorReceipts`; the component JSDoc, stories meta and catalog sentence kept true; the `bg-surface-2` story backdrop and the `--mask-section-fade-top` mask in `HostFade`; the `@source` line in `.storybook/preview.css` and the E2 pin; `Wrapped` composing an exported `SectionShell`; running `pnpm test:mcp` once.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, receipt, artifact, catalog, capture, release or Git action is taken or implied. Stop and return to the owner on any G8 condition, a contradictory result, or a needed edit outside §2.
