# Link v0.5 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, tests, registry write, artifact or catalog regeneration, capture, release or Git action, and approving the spec granted none of them. Nothing below is implemented or measured: preparation was read-only (source, test, registry, artifact, changelog and token reads, digest checks and `git` inspection); no build, test, generator, Storybook, browser or capture ran.
- **Coverage:** S2, S3 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), issue [#562](https://github.com/egdev6/egdev-design-system/issues/562), **the Link half only**: the footer half is the Footer v0.4 plan's work (spec OQ-5). This is the plan gate that precedes implementation under T6. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) plan (an additive variant on an existing component); the Round 5 conventions follow the [Breadcrumb v0.1](../../breadcrumb/v0.1/implementation-plan.md) sibling. Commits land on `integration/round-5` and are made by the parent (the writer never switches branches or commits); Round 5 ships as one PR (T7), so the slices exist for review and bisect. The PR references #562 with `Refs`, never `Closes` ([consumer requests §3](../../../distribution/consumer-requests.md)).
- **Contract authority:** [spec.md](spec.md) v0.5, Approved on 2026-11-26, `contentSHA256: db442bd1d74bfd3d2e983b797895f76ad0de486de2ba0d19b390d437db68af81`, reproduced byte-exact in this working tree by three independent methods with the spec's own rule (payload from the line-start `## 1. Purpose and scope` heading through EOF, LF, final newline: `awk '/^## 1\. Purpose and scope$/{f=1} f'`, a Python line-anchored slice and a Node line slice; the heading text also appears inline in the spec's header, so a plain substring search anchors wrongly). Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)", 2026-11-26 (`odd/tasks/round-5-consumer-requests.md` L5), given on the committed draft (`7ed25eb`, payload `68420d3090785b165cdcca6783874af789b40a630af5621e29019844935d5175`, prefix `68420d30` in L4) with the recommended answer to OQ-1 to OQ-5. The cataloging approval is L3. Visual hashes: VIS-01 to VIS-04 Pending. Resolved decisions this plan carries: `quiet` keeps `--text-label-default` (no size change, no token); the underline is the neon `--color-fg-brand-default`; the v0.4 hover rule is kept; the NowCard, CommunityCard and ProjectCard stories keep the deprecated `underlined`; `FooterNavigation` adopts `quiet` only through the Footer v0.4 lane, after this one; no new naming convention, exception, token, dependency, Radix package or stylesheet.
- **Sequencing:** this lane goes first. The Breadcrumb plan cannot be approved until `quiet` is implemented (Breadcrumb spec OQ-3), and Footer v0.4 adopts `quiet` after it (Link spec OQ-5); T6 is sequential. Those plans are separate gates that this plan neither relies on for authority nor approves.
- **Plan identity:** `contentSHA256: 847a539ee359c1f831ae9b80b500763ee744203c84e09725862f0bd50e280254` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line through EOF; the metadata above it is excluded, and the match is anchored at line start because the heading text also appears inline in this metadata. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b`. At drafting no tracked file under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified; the finalized spec, its approval record and this plan are uncommitted working-tree files, beside other lanes' uncommitted spec resolutions. Whole-file SHA-256 prefixes, re-verified in this working tree: `atoms/link/types.ts` `850d9f0b…` (equal to the spec's reviewed hash and to the `revision` of the five Link registry usages), `useLink.ts` `61765e5b…`, `Link.tsx` `b7f1af3e…`, `Link.test.tsx` `e7c1bf10…`, `Link.stories.tsx` `8a47beaf…`, `index.ts` `4da2c71d…`, `packages/ui/src/index.ts` `713d1843…`, `styles/compiled.css` `7c587736…`, `lib/cn.ts` `3ead7127…`, `.storybook/preview.css` `b55993fb…`, `skills/_shared/prop-naming.json` `ceb95f54…` (185 entries), `scripts/prop-naming.test.mjs` `f2acfd78…`, `storybook-docgen.test.ts` `3705e162…`, `storybook-controls.test.ts` `f7928479…`, `scripts/package-exports.test.mjs` `9b779e24…`, `package-consumption.test.mjs` `de9a624c…`, `design-system-artifact.test.mjs` `51238e62…`, `scripts/catalog_data.py` `041dccd6…` (119 rows), `packages/ui/CHANGELOG.md` `404c5095…`, `packages/system/CHANGELOG.md` `ab828f02…`, `packages/tokens/src/theme.css` `49634e2d…`, `styles/legacy/bundle.css` `0ddabe8b…`. `packages/system/design-system.json` is 610,264 bytes with 187 components against the 768 KiB (786,432-byte) shipped-JSON budget; `system.md` is 500,426 bytes.
- **Visuals:** VIS-01 to VIS-04 are Pending in the spec: no capture, no hash. This plan produces behavior and token-computed evidence, and computed-style evidence only with D2; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns, and the commands of §8. The spec approval alone grants no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance and its one limit.** The repository records the owner's verbatim answer (L5) and the draft's digest prefix (L4) but not the question text, so the spec digest binds the bytes derived from the approved draft plus the recommended answers, not a digest the owner quoted ([approval.md](approval.md)). The plan accepts that as provenance; a reviewer who wants an exact-digest confirmation can ask for it before G1. Nothing here upgrades it.
3. **G3 — Registry.** No new convention and no exception: the approved `visual-treatment` → `variant` is reused and its existing Link usage widens (spec §3). The plan edits one `type` string and refreshes five source revisions (§5.1); no status, approval or receipt changes, and nothing is approved globally. The spec proposes no naming convention, so there is nothing new to register.
4. **G4 — Recipe, tokens and files.** Both recipes, their tokens and the type step are approved in the spec (OQ-1, OQ-2). Every colour utility is token-backed and verified present: `--color-fg-default` (`theme.css:73`), `--color-fg-brand-default` (`:79`), `--color-link-default` (`:185`), `--text-label-default` (`:255-258`), `--space-1` (`:440`). No token, dependency, Radix package or stylesheet: `link.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. Every utility is a static literal in a CVA string composed per part with `cn()`; no inline style, interpolated class, `@classNameAllows` tag, recipe or hook export, or new AGENTS.md exception. Link paints text and a text decoration only, so no Material recipe, Surface or flat replacement applies. `decoration-fg-brand-default` is the first `decoration-*` colour utility under `packages/ui/src`: its emission is proved on the built CSS (AC-11, §5.5), not assumed.
5. **G5 — The recipes stay published.** The artifact builder reads string literals inside the `cva` call (its first argument and the `variants` object) and does not follow module-level `const` identifiers in that pass (`scripts/build-artifact.mjs:205-247`); only the anatomy pass follows constants (`:626-636`), and it skips colour utilities by design (`:528-578`). Today Link's ink is published because `text-link-default` sits in the base string. Moving the ink into `plainLinkRecipe` and a `quietLinkRecipe` constant, as the spec's file list words it, would delete every Link ink from `design-system.json` and `system.md`. The plan therefore writes the three variant strings as **inline literals** in the `variants` object (Carousel's style), so the artifact lists `text-link-default` for `plain` and `underlined` and `text-fg-default decoration-fg-brand-default` for `quiet`. The class set is exactly the one the spec approves; only its spelling in the source differs. A reviewer can veto this at G1 (§13); the alternative costs a builder change, which needs its own approval.
6. **G6 — No two utilities of one group, by construction.** The ink leaves the shared base so no branch emits two text-colour utilities (spec §6, AC-03). `cn()` already treats `text-label-default` as a font size (`lib/cn.ts` list, drift-guarded by `cn.test.ts`), so it coexists with `text-fg-default`; AC-03 proves this at CVA and DOM level instead of trusting `tailwind-merge`.
7. **G7 — Integration ownership.** The registry JSON and generated view, the system artifact, the catalog source and outputs, the package harnesses, the docgen and Controls pins, the changelogs and the evidence file are parent-owned, as in the Carousel and Breadcrumb plans. A writer touches only four Link files: `types.ts`, `useLink.ts`, `Link.test.tsx` and `Link.stories.tsx`. `Link.tsx`, `index.ts` and `packages/ui/src/index.ts` do not change.
8. **G8 — Release and publication stay outside this plan.** Changelog entries go under the existing, never-packed sections of the 0.11.0 release (ODD S2, §7): no version bump, `release:pack`, tag, issue comment or snapshot publication, and no coupled version moves because this change touches neither tokens nor cli.
9. **G9 — Stop lines** are listed in §14.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/atoms/link/types.ts` | Writer | `LinkVariant` gains `'quiet'` (`:74`) with its JSDoc; the `variant` JSDoc (`:59-66`) replaced; the base string loses `text-link-default`; `plainLinkRecipe` (`:77`) is removed and the three variant strings become inline literals (§3, G5); comments updated. `linkArrowVariants` byte-identical | +16 / −9 |
| `packages/ui/src/atoms/link/useLink.ts` | Writer | `resolvedVariant` (`:46`) passes `plain`, `underlined` and `quiet` through and resolves any other runtime value to `plain`; comment reworded | +3 / −3 |
| `packages/ui/src/atoms/link/Link.tsx`, `index.ts` | none | No change: the JSX already spreads `rootProps`, the arrow follows the ink through `stroke-current`, and `index.ts` already exports `LinkVariant` | 0 |
| `packages/ui/src/atoms/link/Link.test.tsx` | Writer | New `describe('Link quiet variant')` appended after line 374 (§4, T1 to T10); existing cases stay unedited | +260 |
| `packages/ui/src/atoms/link/Link.stories.tsx` | Writer | `Quiet`, `QuietInCardFooter`, `QuietOnSurfaces`; meta description and usage text reworded; the `Surface` import (§6). `Default`, `External`, `CustomNotice`, `WithoutArrow`, `AsChild`, `States` and `Underlined` stay | +70 / −9 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | Link block (`:4127-4203`): `quiet` and "no only-treatment sentence" assertions on the `variant` description (beside `:4197`); one new `it` for the exported story names (`exportedStoryNames`, `:110`) | +20 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `:2023` options become `['plain', 'underlined', 'quiet']`; `ownPropCounts.link` (`:846`) stays 6 | +1 / −1 |
| `packages/ui/src/lib/storybook-css.test.ts`, `cn.test.ts` | none | **No edit expected.** Link stories are already scanned by `.storybook/preview.css:34`; both suites run unchanged | 0 |
| `scripts/package-exports.test.mjs` | Parent | Extend `UI ships Link token recipes…` (`:4480-4525`) with two selector pairs and the `quiet` SSR assertions in `UI Link exports safe native…` (`:4527`) (§5.5) | +11 |
| `scripts/package-consumption.test.mjs` | Parent | Typed `'quiet'` sample beside `:2424`, one `LinkSamples` item (`:2428`), reworded `@ts-expect-error` comment (`:2442`), `assertLinkCSS` (`:6279`) and the SSR DOM block (`:7848`) (§5.5) | +14 / −1 |
| `skills/_shared/prop-naming.json` | Parent | Edit the Link `visual-treatment` usage `type` (`:1310`) and refresh the `revision` of all five Link usages (`:1315`, `:3023`, `:3366`, `:3413`, `:3450`) (§5.1) | +6 / −6 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | 5 long lines ± |
| `scripts/prop-naming.test.mjs` | none | **No edit expected.** The Link usages are already in `postReceiptUsages` (`:400`, `:669-672`) and the freshness test (`:1564-1575`) re-hashes `types.ts`; it must pass unchanged once the revisions are refreshed | 0 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Link assertion after the Carousel one (`:111-167`) (§5.3) | +26 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ ±6 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | Link row note (`catalog_data.py:18`), then one `build_catalog.py` run (§5.4) | ±1 line each |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | Entries under the existing `## 0.11.0` and `## 0.13.0` sections, `### Added` (§7) | +6; +3 |
| `docs/components/link/v0.5/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED/GREEN output, browser table, hashes (§9) | +45 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +5 |

Explicitly untouched: `Link.tsx`, `index.ts`, `packages/ui/src/index.ts`; `packages/tokens/**`, `packages/cli/**`, `packages/effects/**`, `packages/mcp/src/**`; `packages/ui/src/styles/**` (`compiled.css` already scans `../atoms/link/types.ts`; the legacy bundle is frozen); `.storybook/**`; the Footer, NowCard, CommunityCard and ProjectCard sources, tests and stories (OQ-4); the Breadcrumb lane; package manifests and versions; `docs/foundation/semantic-roles-adoption.md` (a historical adoption record); the frozen Link v0.1 to v0.4 documents, the spec and the approval record.

## 3. Design of the change

**API.** Exactly spec §3: `LinkVariant = 'plain' | 'underlined' | 'quiet'`, default `plain`, consumed by the hook and never forwarded to the DOM. No prop is added, removed or renamed; `children`, `asChild`, `href`, `external`, `newTabText`, `arrow`, `className`, native attributes and the anchor ref are untouched. The `variant` JSDoc is the spec's quoted text with `` `underlined` `` kept in backticks (G-choice 2, §13), so the pin at `storybook-docgen.test.ts:4197` (`` /`underlined` is deprecated/ ``) keeps passing unedited; `@control select` and the bare `@default plain` stay.

**`types.ts` target shape.** Every recipe is one static literal; the artifact builder and the Tailwind scanner read it as written:

```ts
/**
 * Appearance axis for the link root. `quiet` is neutral text with a brand underline for links in cards and
 * footer navigation. `underlined` is a deprecated alias of `plain` (same classes), kept for compatibility
 * until a later major removes it.
 */
export type LinkVariant = 'plain' | 'underlined' | 'quiet';

// Each variant owns its ink, so no branch emits two text-colour utilities and the result never relies on
// tailwind-merge to settle one. pb-0 border-0 resets the retained legacy .eg-link bottom border and padding,
// so the text underline is the only line. The recipes are inline literals on purpose: the system artifact
// builder reads string literals in `variants` but does not follow constants.
export const linkVariants = cva(
  'eg-link group/link inline-flex items-center gap-2 font-sans text-label-default underline underline-offset-(--space-1) cursor-pointer transition-colors duration-(--duration-fast) ease-(--ease-out) hover:no-underline focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)] focus-visible:rounded-sm motion-reduce:transition-none',
  {
    variants: {
      variant: {
        plain: 'text-link-default pb-0 border-0',
        /** @deprecated Alias of plain; renders the same classes. Removed in a later major. */
        underlined: 'text-link-default pb-0 border-0',
        quiet: 'text-fg-default decoration-fg-brand-default pb-0 border-0'
      }
    },
    defaultVariants: { variant: 'plain' }
  }
);
```

**Hook.** The cast-invalid fallback keeps its reason (no variant classes would let the legacy `.eg-link` border paint):

```ts
const resolvedVariant: LinkVariant = variant === 'underlined' || variant === 'quiet' ? variant : 'plain';
```

**What changes and what does not.** `plain` and `underlined` keep their class **set** (21 tokens); their class **string order** changes because the ink moves from the middle of the base to the end of the string, which CSS ignores and the spec compares as a set (AC-04). `quiet` is that set minus `text-link-default` plus `text-fg-default` and `decoration-fg-brand-default` (22 tokens). `linkArrowVariants`, `Link.tsx`, the `eg-link` marker, the focus ring, the reduced-motion fallback and the legacy `.eg-link` CSS are untouched; the arrow follows the root ink because the Icon is `stroke-current`.

**Emission inventory.** Each utility the change depends on, the declaration it must emit, and where it is proved:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `decoration-fg-brand-default` | `text-decoration-color: var(--color-fg-brand-default)` in `@layer utilities` (first `decoration-*` colour utility in the package) | AC-11, RED on the base build |
| `text-fg-default` | `color: var(--color-fg-default)` (also emitted by other recipes today) | AC-11 |
| `text-link-default` | `color: var(--color-link-default)` (existing pair, unchanged) | AC-11, existing pair |
| `underline`, `underline-offset-(--space-1)`, `hover:no-underline`, `pb-0`, `border-0`, focus and reduced-motion utilities | The v0.4 declarations, unchanged | Existing pairs and selector list |

**Cascade.** The legacy `.eg-link` rule sets `color`, a hover colour (`.eg-link:hover`), `text-decoration:none` and a bottom border in `@layer components` (`legacy/bundle.css:81-92`); `styles/index.css:10` orders `theme, base, components, utilities` and `:12` imports the bundle into `layer(components)`, so the utilities win regardless of specificity, including `text-fg-default` over the legacy hover colour. That is a statement from layer order, observed only in a real browser (§9, D2).

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts). Browser-only paint and the legacy-rule defeat are not claimed from jsdom; they sit in §9. Writer-owned tests use roles and accessible names, `userEvent`, no `data-testid` and no complete class strings, except one deliberate v0.4 set pin (T4).

**Guard rule.** Today an unknown variant resolves to `plain`, so many `quiet` assertions would pass vacuously. Every `quiet` test therefore opens with a guard (`text-fg-default` present, `text-link-default` absent), which also makes each of them RED before the change and keeps it from passing against `plain` by accident.

**New unit tests** (`Link.test.tsx`, appended; shared `tokens()` and `RouterLink` helpers reused):

| ID | Test | Covers |
| --- | --- | --- |
| T1 | A typed `const quiet: LinkVariant = 'quiet'` renders; the root has no `variant` attribute; omitting `variant` still yields `text-link-default` and no `text-fg-default` | AC-01 |
| T2 | `linkVariants({ variant: 'quiet' })`: the token set equals the `plain` set minus `text-link-default` plus `text-fg-default` and `decoration-fg-brand-default` (22 tokens); it contains the AC-02 list and none of `text-link-default`, `no-underline`, `hover:text-*`, `hover:decoration-*`, `hover:underline`, `border-b`, `pb-0.5` | AC-02 |
| T3 | Group uniqueness over `plain`, `underlined` and `quiet`, at CVA level and in the rendered class list: exactly one text-colour utility (`text-link-default`, or `text-fg-default` for `quiet`), exactly one `text-label-default`, no decoration colour for the first two and exactly `decoration-fg-brand-default` for `quiet` | AC-03 |
| T4 | PRESERVE: `plain`, `underlined` and the default emit the literal 21-token v0.4 set (written out once) at CVA and DOM level, and the arrow classes equal the v0.4 string. Written and run green on the base first | AC-04 |
| T5 | Hover: `quiet` has `hover:no-underline` and no `hover:text-*`, `hover:decoration-*` or `hover:underline`; the hook's `arrowClassName` is identical for the three variants | AC-05 |
| T6 | Focus and motion: the root keeps `focus-visible:outline-none`, `focus-visible:[box-shadow:var(--shadow-focus)]`, `focus-visible:rounded-sm` and `motion-reduce:transition-none`; the arrow keeps `motion-reduce:translate-none` and `motion-reduce:transition-none`; `user.tab()` focuses the link | AC-06 |
| T7 | Semantics for `quiet`, mirrored from the existing cases in three tests: external `target`, merged `rel` and the hidden notice; `arrow={false}` renders no svg; `asChild` with a router anchor (one anchor, composed refs, event order, native Tab and Enter) and `renderToString` output | AC-07 |
| T8 | Runtime values `'primary'`, `'Quiet'`, `''`, `null` and `undefined` (cast) resolve to the `plain` set, never a partial one; `'quiet'` passes through the hook; `'underlined'` is unchanged | AC-08 |
| T9 | `className` merges last on native and slotted `quiet` (`mt-2 mt-4 self-start` leaves `mt-4 self-start`); `eg-link` survives; `variant`, `external`, `newTabText`, `asChild` and `arrow` never reach the DOM as attributes | AC-09 |
| T10 | Contrast: read the ink and underline tokens from the **emitted** `quiet` classes (`text-<x>` and `decoration-<x>` map to `--color-<x>`), resolve their `var()` chains and the four surface tokens from `packages/tokens/src/theme.css` with `node:fs`, compute WCAG 2.x ratios, and assert ink ≥ 4.5 and underline ≥ 3 on `surface-0` to `surface-3`, plus the spec's table to two decimals (18.26, 17.02, 15.50, 13.55 and 4.61, 4.30, 3.92, 3.42). No new dependency | AC-10 |

T10 reads its colours from the emitted classes, so it fails today (`quiet` emits neither) and is tied to the recipe rather than to a free-standing token check. Its resolver mirrors `packages/tokens/tests/semantic-contrast-roles.test.mjs` (`luminance`, `contrast`, alias resolution) and lives in `Link.test.tsx`, so the tokens package, which this change does not touch, gains no file.

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| AC-01 | T1; `pnpm typecheck` | The T1 guard fails (an unknown value renders `plain`); `tsc` reports TS2322 on the typed `'quiet'` literal; the packed-consumer sample fails to compile the same way when the harness runs | Focused run and `pnpm typecheck` green; packed React 18.3.1 and 19.3.0 consumers green once authorized |
| AC-02 | T2 | `linkVariants({ variant: 'quiet' })` returns the base only: no `text-fg-default`, still `text-link-default`, no `pb-0 border-0` | Same runner green |
| AC-03 | T3 | `quiet` has neither the ink pair nor a decoration colour | Green |
| AC-04 | T4 | **PRESERVE, no RED.** Passes before and after; the ink leaving the base is the regression it guards. The existing v0.4 cases stay unmodified | Focused run green; the caller suites of §8 green unmodified |
| AC-05 | T5 | The guard fails; the `hover:*` assertions are PRESERVE-like | Green |
| AC-06 | T6 | The guard fails; the focus and motion assertions are PRESERVE-like | Green |
| AC-07 | T7 | The guard fails; the semantics assertions are PRESERVE-like | Green |
| AC-08 | T8 | `'quiet'` resolves to `plain` today, so the pass-through assertion fails | Green |
| AC-09 | T9 | The guard fails | Green |
| AC-10 | T10 | The tokens cannot be read from the emitted classes: `quiet` emits neither | Green; the real-browser measurement over the footer backdrop stays Pending (D2) |
| AC-11 | `package-exports.test.mjs` Link pairs and `quiet` SSR assertions; `assertLinkCSS` and the SSR block in `package-consumption.test.mjs` | After `pnpm build` on the base, `.decoration-fg-brand-default` is missing from the built CSS ("Missing Link utility") and the SSR output lacks it | Green after `pnpm build`; React 18 and 19 when the harness is authorized; the browser computed-style check stays Pending (D2) |
| AC-12 | `storybook-controls.test.ts:2023`; `storybook-docgen.test.ts` `variant` description and story names | Options are `['plain', 'underlined']`; the description still says "only treatment"; the three stories are missing | Same runner green; `ownPropCounts.link` stays 6 |
| AC-13 | `pnpm props:check` and `pnpm test:props` after the `types.ts` edit (five stale revisions, `prop-naming.test.mjs:1564-1575`); `pnpm artifact --check` and `pnpm system:check`; the new artifact assertion; the catalog row | Stale revisions, view, artifact and catalog before the registry edit and the generators | `props:docs`, `props:check`, `test:props`, `artifact --write` with `system:docs`, `build_catalog.py`, then every `--check` green |
| AC-14 | PRESERVE: the Footer, NowCard, CommunityCard, ProjectCard, Closing, Hero, LiveBand, NowStrip, Notice and ModuleCard suites run unmodified; `git diff --stat` on the four consumer folders is empty | No RED | Green |

**PRESERVE and differential.** The shared code is `linkVariants` and the hook line that feeds it, used by every Link caller. Besides the unmodified suites and T4, one differential render check on a copy of the base commit in `mktemp -d` (never committed, removed afterwards): static markup of `{variant omitted, 'plain', 'underlined'} × {native, asChild} × {arrow true, false} × {external true, false}` rendered by the base copy and by the change, each `class` attribute normalized to its sorted token set (the string order changes on purpose), must be identical. Any difference nobody asked for is a regression to fix and pin with a test.

**GREEN order.** `types.ts` → `useLink.ts` → focused runner → stories → docgen and Controls pins → registry (hash last) → `pnpm build` → package fixtures → artifact → catalog → changelogs.

## 5. Registry, docgen, artifact and catalog obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Nothing is appended: edit the existing Link usage of the approved `visual-treatment`, never reorder:

```json
{
  "component": "Link",
  "type": "LinkVariant ('plain' | 'underlined' | 'quiet')",
  "status": "existing",
  "source": { "path": "packages/ui/src/atoms/link/types.ts", "symbol": "LinkProps", "revision": "sha256:<whole-file SHA-256 of the final types.ts>" }
}
```

Then refresh the other four Link usages (`slot-composition` `:3023`, `new-tab-navigation` `:3366`, `new-tab-notice` `:3413`, `trailing-arrow` `:3450`), all currently `sha256:850d9f0b819c53b391eea8783382b7b5e9f654ac1bd42cf1f5a94f6fb6e52021`; all five carry the same new hash. Hash only after `types.ts` is final and `pnpm lint` is clean on it; any later edit, even formatting, requires re-hashing. `pnpm props:docs` regenerates `docs/prop-naming.md` (five long lines change, never by hand); then `pnpm props:check` and `pnpm test:props`. `scripts/prop-naming.test.mjs` does not change: it matches the Link usages by source and checks only freshness of the revision. No approval JSON is added: there is no new convention or exception, and adding nothing globally approved.

### 5.2 Docgen and Controls pins

- `storybook-controls.test.ts:2023`: options `['plain', 'underlined', 'quiet']`; the control stays `select`, `args` stays `{}`, the owned-metadata diagnostics stay empty, and `ownPropCounts.link` (`:846`) stays 6 because no prop is added.
- `storybook-docgen.test.ts`, Link block: beside `:4197` add `toMatch(/quiet/)` and `not.toMatch(/only treatment/)`; the existing `` /`underlined` is deprecated/ `` and `not.toHaveProperty('deprecated')` stay; a new `it` asserts `exportedStoryNames(ast(source('atoms/link/Link.stories.tsx')))` equals `['Default', 'External', 'CustomNotice', 'WithoutArrow', 'AsChild', 'States', 'Underlined', 'Quiet', 'QuietInCardFooter', 'QuietOnSurfaces']` and lands in slice 2 with the stories. The public-barrel inventory (`:2245`) must pass unchanged: no export changes.

### 5.3 System artifact

`pnpm artifact --write`, then `pnpm system:docs`. The observed `git diff --stat` is the evidence; the expected content is: the Link `variant` description; the `linkVariants` recipe strings (the base loses `text-link-default` and the three inline variant strings are listed); a `quiet` entry in the anatomy (the `pb-0` fact it shares with `plain`, index 196 today, because colour utilities are skipped by design); the five Link usages in `propNaming` (type and revision); in `system.md` the `variant` line and a `linkVariants variant=quiet: pb-0 → --spacing-0` line. The artifact must stay under the 786,432-byte shipped-JSON budget (610,264 bytes today). Add one assertion in `design-system-artifact.test.mjs` after the Carousel one: the Link `variant` prop is an enum with default `plain` whose description matches `/quiet/` and `/underlined/` and not `/only treatment/`; the `linkVariants` `classes` list `text-link-default`, `text-fg-default` and `decoration-fg-brand-default` while its first entry (the base) lacks `text-link-default`; the anatomy variant keys sorted are `['plain', 'quiet', 'underlined']`; `visual-treatment` lists Link. This pins G5: a later refactor into constants fails it. Then `artifact --check`, `system:check`, `test:artifact` and `test:system` green.

### 5.4 Catalog

In `scripts/catalog_data.py:18` append to the Link row notes: "v0.5 ([#562](https://github.com/egdev6/egdev-design-system/issues/562)): `variant='quiet'`, neutral ink with a brand underline for links inside cards and footer navigation; same label step, hover rule, arrow and motion as the default; `underlined` stays a deprecated alias; the footer adopts it through the Footer contract." Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` (`:57`) or `docs/catalog.json`.

### 5.5 Package fixtures

- `package-exports.test.mjs`, `UI ships Link token recipes…` (`:4480-4525`): add `['.text-fg-default', /color:\s*var\(--color-fg-default[,)]/]` and `['.decoration-fg-brand-default', /text-decoration-color:\s*var\(--color-fg-brand-default[,)]/]` to the declaration pairs; the `markerRules` equality (`:4523`) stays, so Link still adds no marker stylesheet rule. In `UI Link exports safe native…` (`:4527`) render `variant: 'quiet'` and assert `eg-link`, `text-fg-default`, `decoration-fg-brand-default`, no `text-link-default` and no `variant=`. The NowCard and ProjectCard SSR checks that pass `underlined` (`:5131`, `:5376`) stay unmodified.
- `package-consumption.test.mjs`: `const linkQuietVariant: LinkVariant = 'quiet';` beside `:2424`; one `LinkSamples` item with id `link-quiet`; the comment of the `@ts-expect-error` at `:2442` becomes "Link only accepts plain, quiet and its deprecated underlined alias." (the `'primary'` case stays an error); `assertLinkCSS` (`:6279`) gains `.text-fg-default` and `.decoration-fg-brand-default`; the SSR block (`:7848`) asserts the `link-quiet` classes (`eg-link`, `text-fg-default`, `decoration-fg-brand-default`, no `text-link-default`) and that `link-underlined` still equals `link-native` as a set. No ref, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Atoms/Link` keeps autodocs, `Meta<typeof Link>`, no manual `argTypes` and no `play`; every new story is English and typed `Story`. `Default`, `External`, `CustomNotice`, `WithoutArrow`, `AsChild`, `States` and `Underlined` stay.

- `Quiet`: `args: { href, children, variant: 'quiet', className: 'self-start', onClick: action('navigate') }`, a single link; its JSDoc says the underline stays at rest and hover removes it. The footer-navigation case (VIS-03) is this story with `arrow` switched off through Controls: AC-12 fixes three new names, so there is no fourth story.
- `QuietInCardFooter`: a card composed only from the exported `Surface` primitive (body on `surface-1`, footer band as a nested `surface-0` Surface) and native elements, holding one `quiet` link with its arrow. No card molecule is imported (an atom story importing a molecule inverts the layering) and no background, border or shadow is written by hand. This is the VIS-01 scenario.
- `QuietOnSurfaces`: `Surface` at `surface-0` to `surface-3` (elevation 0), each holding a `plain` and a `quiet` link side by side with a visible tone label. This is the VIS-04 scenario and the visual counterpart of T10.
- Meta text: rewrite the description and usage sentences that call the underline the default look and tell consumers to omit `variant`, so they name `quiet` for links inside cards and footer navigation, say that it is not for inline prose (with neutral ink the underline is the only cue) and keep the `underlined` deprecation notice. Keep "className supports outer margin/alignment only" and "No stylesheet ships with this atom".
- Controls: the registered enhancer shows `variant` as a select in union order (`plain`, `underlined`, `quiet`) and injects no argument; `Default` stays unchanged. Real-browser Controls are checked in §9, not inferred from tags.
- No `.storybook` edit: `Link.stories.tsx` is already in `.storybook/preview.css:34`, and the stories use only layout and spacing token utilities.

## 7. Changelog entries

Entries go under the **existing, never-packed sections of the 0.11.0 release** (ODD S2), at the top of each `### Added` list, whose bullets run from the newest request to the oldest. In `@egdev/system` that section is **`## 0.13.0`**, not its older, already-released `## 0.11.0`. No `mcp`, `effects`, `cli` or `tokens` entry and no version move.

```md
<!-- packages/ui/CHANGELOG.md, ## 0.11.0, ### Added -->
- Link accepts `variant='quiet'`: neutral text with a brand-coloured underline, for navigation links inside cards and
  footer navigation. It keeps the default label size, the underline removal on hover, the arrow and the focus ring,
  so only the ink and underline colour differ, and it is not meant for inline prose, where the underline is the only
  cue. Omitting `variant`, `plain` and the deprecated `underlined` render as before. `FooterNavigation` adopts it
  through the Footer amendment, not through this entry. Refs #562
```

```md
<!-- packages/system/CHANGELOG.md, ## 0.13.0, ### Added -->
- The artifact and design reference include Link's `quiet` variant: the widened `variant` description and the Link
  recipes with their per-variant ink; existing props and recipes are unchanged. Refs #562
```

`release:pack` counts only `(#N)` as resolved (`scripts/lib/pack-packages.mjs:234`), and the consumer-request rule is that a fully resolved request cites `(#N)` while partial work uses `Refs #N` ([versioning](../../../distribution/versioning.md#changelog-format), [consumer requests §4](../../../distribution/consumer-requests.md)). #562 asks for quiet links in cards **and** the footer, and the footer half ships with Footer v0.4, so these entries use `Refs #562` and the Footer v0.4 entry carries the resolving `(#562)` (D3). If the owner prefers `(#562)` here, change both entries and drop it from the Footer entry.

## 8. Checks to run

After G1, from the repository root, foreground, one at a time; the baseline (T4 and the caller suites on the unchanged tree) first, then the focused commands after each GREEN step:

```sh
pnpm exec vitest run packages/ui/src/atoms/link packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/organisms/footer packages/ui/src/organisms/closing packages/ui/src/organisms/hero packages/ui/src/organisms/live-band packages/ui/src/organisms/now-strip packages/ui/src/molecules/notice packages/ui/src/molecules/community-card packages/ui/src/molecules/module-card packages/ui/src/molecules/now-card packages/ui/src/molecules/project-card --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/cn.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/tokens packages/cli packages/effects packages/mcp/src packages/ui/src/styles packages/ui/src/index.ts packages/ui/src/atoms/link/Link.tsx packages/ui/src/atoms/link/index.ts packages/ui/src/organisms/footer packages/ui/src/molecules/now-card packages/ui/src/molecules/community-card packages/ui/src/molecules/project-card .storybook
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

The scope `git diff --stat` must print nothing from this lane. The final `git status --short` must list only §2 paths and other lanes' files: no scratch, cache or `.playwright-mcp/` output. `pnpm build` writes package outputs and may regenerate the artifact, so `pnpm artifact --check` runs again after it. `pnpm test:package-consumption` packs and installs isolated fixtures and needs D4 (offline alternative: `EGDEV_CONSUMER_OFFLINE=1`); it must exercise React 18.3.1 and 19.3.0 with the shipped tokens and UI CSS and no Tailwind compiler. `pnpm test:package-release` is a PRESERVE check on the changelog structure. `pnpm test:mcp` has recorded README example drift after artifact changes (T4, S5d): run it on the base first before attributing any failure. By reading `packages/mcp/tests/readme-examples.test.mjs` (the digest is of the complete response text, `:144`), the `get_design_system_md` example digest in `packages/mcp/README.md:211` is expected to drift once `system.md` changes, while the `get_component`, `list_components`, `get_tokens` and `get_material_recipe` examples do not depend on Link; that is an inference, not an observation. Such a drift is a parent-owned fix outside §2, belonging to the release refresh at T7. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens tests, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and run here because `@egdev/system` ships. Every result is recorded per command with its exit code and test counts in the evidence file; jsdom, docgen and token arithmetic prove no appearance, focus visibility, rendered contrast or screen-reader behavior, and none is claimed.

## 9. Browser procedure (D2)

Only after separate permission to start `pnpm storybook` (it builds tokens first) and to use Playwright MCP, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts (`document.fonts.ready`), motion settings, crop and date for every observation. Stories: `atoms-link--quiet`, `--quiet-in-card-footer`, `--quiet-on-surfaces`, plus `--default`, `--states` and `--underlined` for preservation.

1. **AC-11 computed style and the legacy rule.** For `quiet`: `color` computes to white at rest **and on hover**; `text-decoration-line` is `underline` and `text-decoration-color` the neon at rest; on hover the line is `none` and the colour unchanged; `border-bottom-width` and `padding-bottom` are `0px`, so the legacy `.eg-link` border, hover colour and `text-decoration:none` do not paint. For `plain`: the v0.4 values (link-default ink, same border and padding resets).
2. **AC-05 and AC-06 hover, focus and motion.** With a held real pointer the underline is removed and the arrow moves by `--space-1`; real keyboard Tab shows the `--shadow-focus` ring over the neutral ink; under `prefers-reduced-motion: reduce` there is no translate and `transition-property` is `none`.
3. **AC-10 contrast over the real backdrop.** Sample the composited background under a `quiet` link in the card stories on `surface-1` to `surface-3` and on a grafito band over the particle layer, and compute ink and underline ratios from the sampled colours, not from tokens. The footer case is the only one not computed from tokens. A failing footer number is reported as a measurement for the Footer and host contract (spec §4 and §5), not as a change to this spec.
4. **AC-12 Controls.** The `variant` row is a select with options in union order and no injected argument; choosing `quiet` re-renders the link.
5. **Captures VIS-01 to VIS-04**, only if authorized: component-zone PNGs under `docs/components/link/v0.5/` named `<variant>--<state>--<viewport>--<theme>.png`, with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, not approved expected design, until the owner adopts exact hashes; no v0.3 capture is reused or adopted. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. A GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No v0.5 capture exists, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English, each body ending `Refs #562`; the PR is part of the one Round 5 PR (T7).

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the Link quiet variant (#562)` | `types.ts`, `useLink.ts`, `Link.test.tsx`, the Controls option pin and the description assertions in `storybook-docgen.test.ts`, `prop-naming.json`, regenerated `docs/prop-naming.md` | ≈ 319 |
| 2 | `feat(ui): add the Link quiet stories and packed-build checks (#562)` | `Link.stories.tsx`, the story-name assertion, `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 121 |
| 3 | `chore(integration): refresh the Link artifact, catalog row and changelogs (#562)` | `design-system.json`, `system.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, both changelogs | ≈ 49 |
| 4 | `docs(link): record the v0.5 implementation evidence (#562)` | `implementation-evidence.md`, the odd log, and `capture.json` with PNGs only if authorized | ≈ 50 |

Slice 1 keeps the registry and the metadata pins with the type change, so `props:check`, `test:props` and the pins stay green per commit. `pnpm artifact --check` is stale between slices 1 and 3; if every commit must be artifact-fresh, fold slice 3 into slice 1 (≈ 368). A failing RED commit is never made.

## 11. Estimated changed lines

About **540 changed lines**: ≈ 517 hand-written (component ≈ 111: `types.ts` 25, hook 6, stories 79, one catalog line 1; tests and fixtures ≈ 334; registry JSON, changelogs, evidence and log ≈ 72) and ≈ 22 generated (`docs/prop-naming.md` ≈ 10, `design-system.json` 2, `system.md` ≈ 6, catalog ≈ 4). For calibration, the v0.4 Link commit `0e6ddfb` touched 16 files with +226 / −96, but carried a specification amendment and no new test block of this size.

## 12. Risks

- **Risk 1 — Artifact fidelity.** The builder does not follow constants (G5). Inline literals keep the ink published; the new artifact assertion pins it. Duplicating the `plain` literal for `underlined` drops the by-construction alias, so the existing alias-equality test and T4 carry that invariant.
- **Risk 2 — Registry coupling.** Every `types.ts` edit invalidates five revisions and the artifact. Hash last and rehash after any formatting change; the receipt tests fail loudly on a stale revision, which is the intended RED.
- **Risk 3 — Emission.** `decoration-fg-brand-default` has no precedent in this package. It rests on the theme colour namespace that already yields `bg-*`, `text-*` and `border-*` utilities (`packages/tokens/tests/semantic-contrast-roles.test.mjs`); AC-11 proves it on the built CSS, and a missing declaration stops the work (§14).
- **Risk 4 — Cascade over the legacy rule.** The defeat of `.eg-link`'s colour, hover colour and border is derived from layer order and observed only with D2; the same mechanism v0.4 relied on.
- **Risk 5 — Contrast over the backdrop.** T10 covers the four tonal surfaces. The footer sits on `--color-surface-0` at 50% over the particle layer (`docs/DECISIONES.md:92-93`), so its ratios need the real-browser sampling of D2 and may fail for reasons that belong to the host.
- **Risk 6 — Merge limits.** `cn()` resolves `text-fg-default` against `text-label-default` only because `lib/cn.ts` lists the label step as a font size; a future text step added to the theme needs that list updated, which `cn.test.ts` guards. A consumer `text-*`, `decoration-*` or `underline` class remains an unsupported override that the extended `cn()` would let win (spec §6).
- **Risk 7 — Parallel lanes.** Footer v0.4, Breadcrumb and the other Round 5 lanes touch the same shared outputs: `prop-naming.json`, `docs/prop-naming.md`, `design-system.json`, `system.md`, `catalog_data.py` with its generated files and both changelogs. Expect rebase conflicts; regenerate generated files instead of hand-merging, keep the Link bullet at the top of each `### Added` list as written, and rehash the five Link revisions if `types.ts` changes again.
- **Risk 8 — Story composition.** Nested `Surface` bands add their own hairline border and sheen; that is documentation of the real recipe, not a defect, and no hand-written paint is added.
- **Risk 9 — Package harness and MCP README.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18 and 19 matrix stays pending, which blocks "verified in packed consumers" claims, not the rest. The expected `get_design_system_md` README digest drift is parent-owned (§8).
- **Risk 10 — Consumer type break.** Widening `LinkVariant` can break a consumer that switches exhaustively over it or builds a `Record<LinkVariant, …>`; none exists in `packages/` and the website's code is not visible here.

## 13. Pending owner decisions

No token, dependency, Radix, naming-convention or Material decision is pending: the recipes, their tokens and the type step were approved with the spec.

1. **D1 — Plan approval (G1).** Approve this exact plan, the §2 edit surfaces including the parent-owned integration files, and the §8 commands, or revise it. The spec approval does not cover it.
2. **D2 — Browser and capture authorization.** Starting `pnpm storybook` and using Playwright MCP are needed for AC-10 over the real footer backdrop, the AC-11 computed-style check of the legacy rule, the Controls check and VIS-01 to VIS-04. Without it those rows stay Pending or **Not evaluated** and the claims rest on class sets, emitted CSS and token arithmetic. Adopting any capture as expected design is a separate decision.
3. **D3 — Issue citation.** Recommended: `Refs #562` in these entries and the resolving `(#562)` in the Footer v0.4 entry, because the footer half ships there (§7). Alternative: `(#562)` here, which marks the request fully resolved the moment this lane lands.
4. **D4 — Build and package-harness commands.** `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption` (isolated fixtures, may install; offline alternative `EGDEV_CONSUMER_OFFLINE=1`) and `pnpm storybook-build` need explicit permission. Without the consumption run, AC-01's React 18 and 19 claim stays pending.
5. **D5 — Publishing the snapshot.** Publishing v0.5 as a comment on the canonical issue #61 is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: (1) the three variant strings are inline literals, so `underlined` duplicates `plain`'s literal (G5); (2) the `variant` JSDoc keeps `` `underlined` `` in backticks, one typographic deviation from the spec's quoted block, to keep the pinned docgen assertion unedited; (3) the contrast test lives in `Link.test.tsx` and reads the tokens from the emitted classes, not in the tokens package; (4) the new stories use `Surface` and native elements only, never a card molecule; (5) the class string order of `plain` and `underlined` changes while the set stays identical; (6) any unknown runtime `variant` (including `null` and `''`) resolves silently to `plain`, as the spec already states.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, capture, release or Git action is taken or implied. Stop and return to the owner if: `.decoration-fg-brand-default` is not emitted or a Link utility cascades differently from §3; a generator demands an edit outside §2, or the artifact cannot publish the recipes without a builder change; AC-04's literal set or the unmodified caller suites fail; the token-computed ratios fall below 4.5:1 (ink) or 3:1 (underline) on a tonal surface; `variant` would have to reach the DOM; a token, dependency or stylesheet appears necessary; or a contradictory result appears.
