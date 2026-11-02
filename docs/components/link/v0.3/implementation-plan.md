# Link v0.3 — implementation plan for the opt-in `underlined` variant

- **Status:** Draft preparation only. This plan accompanies the already owner-approved v0.3 contract (partial approval); it is **not** permission to write code. It needs its own approval (gate G1) before any edit, and every arrow-glyph item is excluded by the approval.
- **Contract authority:** [`spec.md`](spec.md) v0.3, whole-file `sha256:0b8ed59c2baf3ce98e8fcbb6b0f48a8340445cb9980460052426f18ab7ac9c94`, byte-identical to the copy merged in PR #265 (`git show da19f58:docs/components/link/v0.3/spec.md` reproduces the same whole-file hash). `version: 0.3`; `contentSHA256: 31b7ddd97a7fdb8e263aceea387cb8108bd32969865ef64966d147f2f3c48b93`, reproduced in this preparation with the tracking-doc L12 method for this spec group: `python3 -c "from hashlib import sha256; t=open('docs/components/link/v0.3/spec.md').read(); print(sha256(t[t.find('## 1. Purpose and scope'):].encode()).hexdigest())"` → `31b7ddd9…`, exact. The cut starts at the substring occurrence on line 7 (inside the spec's own hash-definition sentence), not at a line start; the line-start cut hashes to `c88629b3…` and is **not** the approved payload. Unlike Chip v0.2, the approved digest binds `spec.md`, not [`issue-comment.md`](issue-comment.md) (whose payload hashes to `981648f6…`), so `spec.md` plus the approval comment are the binding artifacts.
- **Owner approval:** [issue #61 comment 6576886041](https://github.com/egdev6/egdev-design-system/issues/61#issuecomment-6576886041) (2026-11-02), on snapshot [issue #61 comment 6576837530](https://github.com/egdev6/egdev-design-system/issues/61#issuecomment-6576837530). Owner answers, verbatim: `Arrow: "Mantener solo →"` and `Underline: "Variante opcional 'underlined' (Recomendado)"`. Adopted scope, verbatim from the approval: "the opt-in `underlined` visual treatment (1px brand underline that turns neon on hover), with the default Link unchanged (borderless colored text, as decided in #175)". Rejected, verbatim: "the external `arrow-up-right` input — the arrow keeps pointing right for every destination (#175 stands) and the proposed `trailing-arrow-glyph` convention is not added. Q3–Q5 follow the snapshot recommendations". Approved contract only; "no token value or dependency change is approved".
- **Visual references:** `VIS-01 0199d9ea…`, `VIS-02 360717a9…`, `VIS-03 8ec8bbb7…`, `VIS-04 45e31aa5…`, `VIS-05 50a983eb…`, `VIS-06 e1d5de52…`, `VIS-07 02582c8c…`, `VIS-08 aa1f200a…`. All eight remain `Proposed (Pending owner adoption)` in the contract's own table; the approval names the underline treatment, not the captures. Visual conformity for `underlined` is therefore **Not evaluated** against an adopted reference (G3).
- **Plan identity:** `contentSHA256: 2c0de86e7d0bfdf8b345bf9ba73746a84ff5a3d39f8f4517c0cc42f1aa86177a` — SHA-256 of the UTF-8, LF, final-newline payload from the first level-two heading (“1. Authority and gates”) through EOF. Tracking metadata above that heading is excluded, exactly like the contract's own rule.
- **Baseline:** `f159b9cc63ec0f16797239683b272e4e11ad0de3` (branch `docs/web-catalog-layer-b`). Reviewed source bytes: `atoms/link/types.ts` `ba59cc4ae5c38984541b2c5a84e2aefe74b7b7f99295cc94fd3682107122936d`, `useLink.ts` `a86a35c4175478b3dd335336ac84e7a5e458c1c6b3242641e9034286e4aa2daa`, `Link.tsx` `b7f1af3ea6690ddf2f0455f39067e5baf6b11eabb5bfd4a56341709650b3da6a`, `Link.test.tsx` `75954be5fcd63e0f599f634914bea407c1c7b2aa2d294b21343a95a6fc2dbac4`, `Link.stories.tsx` `38a3a71c1179a99bfd280ed026268250c5635cb5619d24d0ee1cf4e2e825c009`, `index.ts` `faa178b5f86c1141a1bfc72272fc20c4179295512fb2f0e197c02f57dc8170df`.
- **Observed evidence:** none for runtime behaviour. This preparation read the contract, the approval, the six Link files, the `cn()`/`extendTailwindMerge` helper, the two package harnesses, the registry and the built `packages/ui/dist/styles.css`; it ran no tests, builds, Storybook, browser checks or screenshots. Every acceptance row below is *planned*, never observed.

## 1. Authority and gates

1. **G1 — Plan approval.** The owner approves this exact plan payload and grants the implementation edit surface. Contract approval alone grants no code.
2. **G2 — Approved-scope exclusion (binding).** The following must not appear in any implementation artifact, story, test, doc line or registry entry of this slice: `arrowGlyph`, `LinkArrowGlyph = 'right' | 'up-right'`, the `trailing-arrow-glyph` convention, `Icon name='arrow-up-right'`, and any external-only glyph derivation. Concretely: `useLink` keeps `arrowName: 'arrow-right'` and `LinkResult.arrowName` keeps its literal type; `linkArrowVariants` stays byte-identical; `Link.tsx` keeps `<Icon name={arrowName} size='sm' …>`; the existing test `expect(result.current.arrowName).toBe('arrow-right')` is preserved unchanged; the registry `trailing-arrow` entry keeps its bytes. Spec §3/§4/§6 still *describe* the rejected input because the approved digest covers that text — the approval overrides it and the spec is not edited (see Q-A).
3. **G3 — Visual reference status.** VIS-01…VIS-08 stay non-binding source evidence. The implementation is judged against the written recipe in §4 and the browser measurements in §10; nobody may "fix" the atom to match the capture's white label, 18px glyph, 2px inset or diagonal nudge, because the approval also adopted Q4 (keep `--color-fg-brand-raised`) and Q5 (horizontal nudge).
4. **G4 — No token, dependency, Material or legacy change.** No new token (`--color-border-brand`, `--color-fg-brand-default`, `--spacing` all exist and are unmodified), no new dependency (`@radix-ui/react-slot` and `@radix-ui/react-visually-hidden` are already direct dependencies), **no stylesheet** (the six mandatory files keep their roles and `link.css` must not exist), no `packages/tokens/**` edit, no `packages/ui/src/styles/legacy/bundle.css` edit, no Material recipe change. Any discovered need stops for the owner.
5. **G5 — Registry byte refresh.** `atoms/link/types.ts` changes, so all four existing `Link` usages must be re-pinned to the reviewed whole-file hash in the same slice, and the new `variant` usage must be appended to the already-approved `visual-treatment` convention. Convention approval stays separate from this plan; no approval is invented.
6. **G6 — Parent-owned integration.** Registry JSON, the generated `docs/prop-naming.md`, `packages/ui/src/lib/storybook-docgen.test.ts`, `packages/ui/src/lib/storybook-controls.test.ts`, `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs` and the catalog source/artifacts are integration surfaces. The writer proposes exact changes and reviewed hashes; the parent decides when to regenerate and commit.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/atoms/link/types.ts` | Writer | `export type LinkVariant = 'plain' \| 'underlined'`; the `variant?: LinkVariant` declaration with English JSDoc (`@control select`, `@default plain`); `linkVariants` restructured into one shared base plus a `variant` axis whose `plain` branch owns `pb-0 border-0` and whose `underlined` branch owns `border-b border-border-brand pb-0.5 hover:border-fg-brand-default`; `defaultVariants: { variant: 'plain' }`; `linkArrowVariants` untouched |
| `packages/ui/src/atoms/link/useLink.ts` | Writer | Destructure `variant = 'plain'`, normalize any runtime value outside the union to `'plain'` **before** calling CVA, and compose `cn(linkVariants({ variant: resolvedVariant }), className)`; every other line, including `arrowName: 'arrow-right'`, the external rel/target normalization and the Slottable content cloning, stays byte-identical |
| `packages/ui/src/atoms/link/Link.tsx` | Writer (expected: **no change**) | The variant is root paint only; the hook already returns `rootProps.className`. If a change proves necessary it must be JSX-only and stated in the commit message |
| `packages/ui/src/atoms/link/Link.test.tsx` | Writer | RED-first behaviour tests for AC-02, AC-03, AC-08 (`underlined` ink change only), AC-09, AC-10 and the `underlined` half of AC-11; all existing cases preserved |
| `packages/ui/src/atoms/link/Link.stories.tsx` | Writer | New `Underlined` story; updated meta copy that stops implying a fixed borderless-only look; no arrow-glyph story (G2) |
| `packages/ui/src/atoms/link/index.ts` | Writer | Add `export type { LinkVariant }` next to the existing `LinkProps` export; keep `Link`; `useLink`, `linkVariants` and `linkArrowVariants` stay unexported |
| `packages/ui/src/index.ts` | Parent (verify only) | Line 23 already reads `export * from './atoms/link'`; the new type flows through. Verify, do not restructure |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent (integration) | `Link` section: add `variant: 'select'` to the control map and `'variant'` to the expected property list; **remove `variant` from the `['disabled','size','variant']` must-be-undefined list** (it is currently asserted absent); keep the defaults-binding map (`variant: 'plain'` from `useLink.ts`) |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent (integration) | `Link` row of the constant-defaults map gains `variant: '"plain"'`; the "retains Link union controls…" case gains a `select` assertion for `variant` and keeps `expect(args).toEqual({})` |
| `scripts/package-exports.test.mjs` | Parent (integration) | Add `'LinkVariant'` to the exact sorted public-declaration list, between `'LinkProps'` and `'ListItem'`; extend the Link CSS test with the new underline utilities; keep every existing Link selector assertion |
| `scripts/package-consumption.test.mjs` | Parent (integration) | Import `type LinkVariant`; add one positive `variant='underlined'` sample to `LinkSamples`; keep the existing negatives and update the stale comment on `variant: 'primary'`; keep every existing Link runtime assertion |
| `skills/_shared/prop-naming.json` | Parent | Refresh the four `Link` usage revisions (`slot-composition`, `new-tab-navigation`, `new-tab-notice`, `trailing-arrow`); append the `Link` usage to `visual-treatment` with the reviewed hash. No `trailing-arrow-glyph` entry (G2) |
| `docs/prop-naming.md` | Parent-generated | `pnpm props:docs`; never hand-edited |
| `scripts/catalog_data.py` | Parent | Link row (line 18) note: opt-in `underlined` variant, default unchanged, arrow direction unchanged, contract + plan references |
| `docs/CATALOGO.md`, `docs/catalog.json` | Parent-generated | `python3 scripts/build_catalog.py` after the source edit |

Explicitly **not** touched: any `link.css` (must not exist), `packages/ui/src/styles/compiled.css` (`@source "../atoms/link/types.ts"` is already registered at line 24, so new CVA utilities are scanned), `.storybook/preview.css` (`@source "../packages/ui/src/atoms/link/Link.stories.tsx"` is already registered at line 26, so story-only layout utilities are scanned; no new `@source`), `packages/tokens/**`, `packages/ui/package.json`, `packages/ui/src/styles/legacy/bundle.css`, `docs/components/link/v0.3/spec.md` (editing it would change the approved digest), and every other component folder.

## 3. Typing approach and compile impact

The implemented public surface is the approved part of spec §3 only — the spec's own code block still contains the rejected items, which are dropped verbatim from the plan:

```ts
export type LinkVariant = 'plain' | 'underlined';

// unchanged: LinkTargetProps, the href union, every existing prop and its JSDoc
export type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children'> &
  LinkTargetProps & {
    children: ReactNode;
    external?: boolean;
    newTabText?: string;
    arrow?: boolean;
    /**
     * Appearance axis: plain keeps the borderless brand-coloured text; underlined adds the 1px brand
     * hairline under the label, which turns neon on hover. Paint only; it never implies interactivity.
     * @control select
     * @default plain
     */
    variant?: LinkVariant;
  };
```

Rationale and limits: `type`, not `interface`; no `any`; the `href` discriminated union is untouched, so **no consumer needs narrowing**; `variant` is one closed enum, so `@control select` is the correct directive (not `text`), and `@default plain` is a real constant because `useLink` destructures `variant = 'plain'` and the CVA declares `defaultVariants`.

Compile impact, case by case:

| Consumer | Expected after the change | Required action |
| --- | --- | --- |
| `<Link href='#x'>label</Link>` anywhere in the repo | Unaffected (optional prop, default `plain`) | None |
| `LinkSamples` in `scripts/package-consumption.test.mjs:1350-1358` | Still compiles: `linkDefaults` has no `variant`; each sample keeps its own props | None; one underlined sample is added next to them |
| Existing `@ts-expect-error` negatives (`missingLinkDestination`, `slottedLinkDestination`, `missingLinkContent`, `disabledLink`, `wrongLinkRef`) | Still errors, unchanged | None |
| `// @ts-expect-error Link v0.1 has no visual variants.` with `variant: 'primary'` (line 1368) | **Still a type error** (`'primary'` is not in the closed set), so the directive stays valid | Update the comment: `Link only accepts the opt-in plain|underlined appearance axis.` Consider adding `variant: 'outline'` as a second negative only if the parent wants two; one is enough |
| Story helper types (`StoryObj<typeof Link>`) | Unaffected | None |

Nothing widens `LinkProps` in a way that changes existing call sites, and the new type alias is exported only as a type — no runtime export is added, so the SSR/runtime export list does not move.

## 4. Render and class composition

`linkVariants` keeps one shared base (spec §6, verbatim, **with the legacy reset removed from it**) and adds exactly one `variant` axis. The empty-looking split is deliberate: `plain` must resolve the same utility set as v0.2 while moving `border-0` and `pb-0` out of the shared base.

- Shared base, verbatim from spec §6: `eg-link group/link inline-flex items-center gap-2 font-sans text-label-default text-fg-brand-raised no-underline cursor-pointer transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-primitive-red-200 focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)] focus-visible:rounded-sm motion-reduce:transition-none`
- `variant: 'plain'`: `pb-0 border-0`
- `variant: 'underlined'`: `border-b border-border-brand pb-0.5 hover:border-fg-brand-default`

Why the reset must live in `plain` and not in the base (the spec's own finding, verified against the project helper): `cn()` is `extendTailwindMerge` with exactly one extension — the `font-size` group keyed by the token typography sizes (`packages/ui/src/lib/cn.ts`) — so every stock `tailwind-merge` group applies. `border-0` is the border-**width** group and `border-b` is the border-width-**b** group, and `pb-0` versus `pb-0.5` share the padding-**b** group. If `border-0` stayed in the base, `cn(linkVariants({ variant: 'underlined' }))` would keep both `border-0` and `border-b`, and which one paints would depend on emitted CSS order rather than on the recipe. Keeping the reset in `plain` makes `underlined` resolve **no** `border-0`/`pb-0` at all.

Consequences to state in the test names and the commit message:

- `cn(linkVariants())` (and `cn(linkVariants({ variant: 'plain' }))`) resolves the **same class set as today**, in a different order: the base comes first and the reset is appended by the variant group instead of sitting mid-string. No utility is dropped, duplicated or restyled, and CVA concatenation (not `twMerge`) is what reorders them.
- `underlined` resolves exactly base + four underline utilities, keeps `no-underline` (the underline is a border, never `text-decoration`), and keeps `text-fg-brand-raised`, `hover:text-primitive-red-200`, the focus ring and the reduced-motion reset untouched.
- The arrow recipe is byte-identical (G2), so the nudge stays horizontal.
- `eg-link` survives in both variants, so legacy selectors and consumers keep working; the legacy `.eg-link` rule (which draws its own 1px `--color-border-brand` bottom border and `padding-bottom:2px`) continues to coexist and is overridden only for the properties the utilities set — this is why `plain` must keep the reset.
- Token backing (verified in `packages/tokens/src/theme.css`, no value changes): `--color-border-brand: var(--color-alpha-red-45)` = `rgba(255,0,54,0.45)`; `--color-fg-brand-default: var(--color-primitive-red-neon)`; `--spacing: var(--space-1)` = 3.2px, so `pb-0.5` = 1.6px, the #218-scaled legacy 2px inset.

Hook contract (`useLink`), the one behavioural addition:

| Input | Resolution | Result |
| --- | --- | --- |
| `variant` absent / `'plain'` | `plain` branch | unchanged v0.2 class set (reordered only) and unchanged DOM |
| `variant='underlined'` | `underlined` branch | same root, same semantics, plus the four underline utilities |
| runtime value outside the union (cast, e.g. `'primary'`) | normalized to `'plain'` **before** CVA | no throw, no partial class set, and no accidental legacy 1px underline (an un-normalized unknown value would resolve *no* variant classes, and the legacy `.eg-link` rule would then paint its own border — AC-09 exists to forbid that) |
| any `variant` value | never forwarded as a DOM attribute | `rootProps` keeps the existing `...rest` shape with `variant` destructured out |

`Link.tsx` stays declarative JSX: no CVA call, no state, no `asChild` change, no ref change (`forwardRef<HTMLAnchorElement>` untouched).

## 5. Test-first sequence

RED before GREEN, one behavioural test per acceptance promise in the approved scope, asserted through the public interface (role, accessible name, attributes, rendered classes, SSR HTML) and never through internal storage. Existing behaviour that shares the changed code is pinned by PRESERVE cases and needs no RED run. **AC-04 (arrow glyph) and every other `arrowGlyph` row of the contract are out of scope by G2 and get no test, story or implementation.**

| Step | RED test (file → case) | Covers |
| --- | --- | --- |
| R1 | `Link.test.tsx` — `linkVariants()` and `linkVariants({ variant: 'plain' })` both contain `border-0` and `pb-0` and none of `border-b`/`border-border-brand`/`pb-0.5`/`hover:border-fg-brand-default`; the two strings are token-set-equal | AC-02 |
| R2 | `Link.test.tsx` — `linkVariants({ variant: 'underlined' })` contains the four underline utilities and **no** `border-0`/`pb-0`; every non-border token of the base is still present | AC-03 |
| R3 | `Link.test.tsx` — rendered `variant='underlined'`: `getByRole('link', { name: 'Label' })`, marker `eg-link`, `text-fg-brand-raised` kept, `no-underline` kept, no `text-decoration`, arrow still `M5 12h14` with `size-4`/`aria-hidden`/`focusable="false"`, no extra announcement | AC-03, AC-11 (`underlined` half) |
| R4 | `Link.test.tsx` — runtime value outside the union via a cast resolves the `plain` set (contains `border-0`, no `border-b`) and does not throw | AC-09 |
| R5 | `Link.test.tsx` — `underlined` + `external` keeps `target="_blank"`, deduped `rel` and the hidden notice; `underlined` + `arrow={false}` renders no arrow | AC-05 (`underlined` half), AC-06 boundary |
| R6 | `Link.test.tsx` — `className='mt-2 mt-4 self-start'` merges last and `eg-link` survives with `variant='underlined'`; own props (`variant`, `external`, `newTabText`, `asChild`, `arrow`) never reach the DOM | AC-10 |
| R7 | `package-exports.test.mjs` (parent) — the Link CSS case gains `.border-b`, `.border-border-brand`, `.pb-0.5` and the escaped `hover:border-fg-brand-default` selector, plus `--tw-border-style` initial `solid` so the 1px line actually paints | AC-03 emitted-CSS evidence |
| R8 | `storybook-docgen.test.ts` / `storybook-controls.test.ts` (parent) — `variant` extracts as a finite enum with `@control select`, the documented default is `plain`, and owned diagnostics stay empty | AC-12 |

GREEN proceeds only after the intended failures are observed, in this order: `types.ts` (type + CVA restructure) → `useLink.ts` (destructure, normalize, compose) → `index.ts` (`LinkVariant`) → the Link test cases → stories → the parent-owned metadata/harness updates.

PRESERVE (expected to pass, no RED run) — one case per touched existing behaviour:

- AC-01 default render: one `a.eg-link`, `href`, `text-fg-brand-raised`, `border-0`, `pb-0`, no `target`/`rel`, decorative 16px right arrow, no `<span>` notice — existing case, unchanged and unextended.
- AC-06 external semantics in native and Slot modes (safe deduped `rel`, conflicting `target` overridden, notice inside the anchor) — existing cases.
- AC-07 `asChild` composition: marker, classes, arrow, notice, both refs and child-before-parent event order — existing case.
- AC-08 hover/focus/reduced-motion utilities on the root and arrow — existing case, plus the `underlined` ink-change assertion from R3.
- AC-11 accessible name, tab order and announcement for `plain` and `asChild` — existing queries and `user.tab()`.
- SSR of native and slotted anchors — existing case.
- Link package harness selectors and `markerRules(css) === markerRules(legacy)` (no new `.eg-link` rule) — unchanged.
- No other component consumes `linkVariants`/`linkArrowVariants` (verified by repository search), so `Chip`, `ChipGroup`, `SocialLinks`, `IconButton` and every sibling suite are expected to stay byte-identical.

**Default-rendering evidence (required for this slice, not a committed test).** Because "the default rendering stays byte-identical" is the central promise, run one script that renders, from a `mktemp -d` copy of baseline `f159b9cc…` and from the working tree, the SSR HTML of four cases — default, `external`, `asChild` with a router anchor, and `arrow={false}` — plus the `cn(linkVariants())` class string, then compares the DOM class **multiset** (sorted tokens), the full attribute set and the exit code. The expected difference is class order only; any attribute, glyph or class-set difference is a regression to fix and pin with a test. The scratch copy lives outside the worktree and is deleted at the end; the committed suite never reads git history.

## 6. Stories and Controls

`Atoms/Link`, `autodocs`, real `Meta<typeof Link>`/`StoryObj<typeof Link>`, `action` only for `onClick`. No manual `argTypes`, no `play`.

| Story | Content |
| --- | --- |
| `Default`, `External`, `CustomNotice`, `WithoutArrow`, `AsChild`, `States` (all kept) | Unchanged args; `States` stays the hover/focus/reduced-motion inspection row |
| `Underlined` (new) | `variant='underlined'` with a real `href`, plus one `arrow={false}` sibling so the underline is visible independent of the arrow. Story JSDoc states that the underline is opt-in paint, not a second interactivity level, and that it is the treatment a web view requests explicitly |

Meta copy to rewrite to the v0.3 truth: the current Description says "Borderless brand-colored text navigation…" and the Usage guidelines say nothing about variants. New text must describe the one appearance axis (`plain` default, `underlined` opt-in), keep "not primary actions, icon-only navigation or inline prose", keep "with asChild, exactly one anchor-compatible child that forwards props and its ref; it owns href", keep "localize newTabText", keep "className supports outer margin/alignment only", keep "no ref beyond the anchor" and "**no stylesheet**", and must not claim a direction-specific or external-specific arrow (G2).

Controls expectations the parent must update with the stories: `variant` documented as `@control select` with `@default plain`; everything else keeps its current directive (`children`/`asChild`/`href`/`external`/`newTabText`/`arrow` unchanged). `useLink` destructuring defaults stay `{ asChild: 'false', external: 'false', arrow: 'true', newTabText: '(opens in a new tab)', variant: 'plain' }`, which is exactly what the docgen `defaults(useLink.ts)` map must record.

## 7. Registry integration

| Entry | Action |
| --- | --- |
| `slot-composition` (`asChild`), `new-tab-navigation` (`external`), `new-tab-notice` (`newTabText`), `trailing-arrow` (`arrow`) | Existing approved conventions with an existing `Link` usage pinned to `sha256:ba59cc4a…`. The revision must be refreshed to the reviewed whole-file hash of the new `types.ts`; no type, status or phrase changes. `trailing-arrow` keeps its wording ("the glyph is derived by the component"), which the approval leaves true |
| `visual-treatment` (`variant`) | Approved convention (`docs/decisions/prop-naming-atom-specs-approval.json`, `convention:visual-treatment`). Append a `Link` usage: `type: "LinkVariant ('plain' \| 'underlined')"`, `status: "existing"`, `source: {path: packages/ui/src/atoms/link/types.ts, symbol: LinkProps, revision: sha256:<reviewed hash>}` |
| `trailing-arrow-glyph` | **Not added** (G2). No `proposed` entry, no exception, no alias |

After any authorized registry edit: edit the JSON, regenerate with `pnpm props:docs`, then run `pnpm props:check` and `pnpm test:props`. `--write` never refreshes evidence or approval, and the reviewed hash must be taken from the actual working-tree bytes after the final edit.

## 8. Package export and consumption cases

- `scripts/package-exports.test.mjs`: add `'LinkVariant'` to the exact sorted public-declaration list — it sits between `'LinkProps'` and `'ListItem'` — and keep every existing runtime assertion (`Link` is a `forward_ref`, marker present, no `asChild` leakage in SSR). The Link CSS case keeps its full existing selector list; new underline selectors are added, none removed. `markerRules(css) === markerRules(legacy)` must keep passing: no `.eg-link` rule may be added to the shipped utilities.
- `scripts/package-consumption.test.mjs`: add `type LinkVariant` to the type-import block; keep `linkDefaults` as the positive `plain` control; add one positive `variant='underlined'` sample to `LinkSamples` (and, if the parent wants a visible control, one `arrow={false}` combination); keep the four existing negatives; update the comment on the `variant: 'primary'` negative. No runtime behaviour assertions beyond the existing id-based DOM checks.
- React 18.3.1/19.3.0 packed-consumer checks run where the existing harness runs them. Link adds no ref, no React-19-only API and no new dependency, so no new compatibility claim is made.
- The built-CSS assertions are the only place where the new utilities are proved without an application Tailwind compiler, which is why R7 names concrete selectors instead of trusting the source string.

## 9. Catalog row and documentation reconciliation

`scripts/catalog_data.py` line 18 is the single Link source. Update the note to the v0.3 truth — standalone native/Slot anchor, unchanged borderless `plain` default, opt-in `underlined` paint with `--color-border-brand` turning `--color-fg-brand-default` on hover, arrow always right (#175 stands, no external glyph), `LinkVariant` exported, no stylesheet, no token/dependency change, contract #61 plus this plan as links — then regenerate with `python3 scripts/build_catalog.py`; the generated files are never hand-edited.

Two pre-existing documentation artifacts become stale in this slice and are **not** editable under G4/G6 rules:

- [`../v0.2/amendment.md`](../v0.2/amendment.md) line 20 still says "No public prop is added, removed or renamed". It is a repository draft with no published digest, so a documentation-only correction is possible but needs its own authorization (Q-A).
- [`spec.md`](spec.md) keeps its `Draft`/`Pending` header, its open-questions section and its rejected `arrowGlyph`/`LinkArrowGlyph`/`trailing-arrow-glyph` text. It cannot be edited without changing the approved `contentSHA256`; the approval comment is the binding scope and §1.2 records the exclusion.

## 10. Browser checks to run before merge

Run against `pnpm storybook` with the real compiled tokens, after GREEN, and record observations — never as expected-design proof:

1. Controls: `variant` renders a select with exactly `plain|underlined`; `children`, `arrow`, `external`, `newTabText` and `asChild` keep their current widgets; no `Component.prop` diagnostic appears in any Link story; `Default` may show an unset select while the component still applies `plain`.
2. `Default` (plain): computed `border-bottom-width: 0px` and `padding-bottom: 0px`; no hairline, no underline, no legacy bleed from `.eg-link`.
3. `Underlined` at rest: computed `border-bottom-width: 1px`, `border-bottom-style: solid`, `border-bottom-color: rgba(255, 0, 54, 0.45)` (i.e. `--color-border-brand`), `padding-bottom: 1.6px`.
4. `Underlined` hover: computed `border-bottom-color` becomes the neon brand value and the label becomes `--color-primitive-red-200`; the arrow translates horizontally only; `Underlined` with `arrow={false}` shows the underline with no arrow.
5. Focus-visible on both variants: `--shadow-focus` ring and `rounded-sm`; no underline change on focus; Tab order and Enter activation unchanged.
6. Reduced motion (`prefers-reduced-motion: reduce`): no translate and no transition in either variant.
7. Legacy coexistence: with `.eg-link` active, the underlined variant shows exactly one 1px line (no double border), and the plain variant shows none. Record computed values, not screenshots alone.
8. Long label, wrapping container, 200% zoom and RTL: no clipping, no truncation, the underline follows the text box, and the arrow stays logically after the label.
9. Contrast re-measure of `--color-fg-brand-raised` (neon) on canvas and on surfaces 1–3 for both variants — the spec forbids inferring it from captures, and the understated risk is that neon passes AA only on the canvas.
10. `External` and `AsChild` stories: `target`/`rel`/notice still correct with `variant='underlined'`, and the arrow still points right.

Full gates before merge, parent-scheduled and reported with observed output: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`, the catalog regeneration and the Storybook build. Focused first: `pnpm exec vitest run packages/ui/src/atoms/link packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`.

## 11. Risks

- **R-1 — Class-string order change (low, but externally visible).** `linkVariants()` returns the same tokens in a new order. No repository test compares whole strings (they assert membership), and the differential check in §5 bounds the residual risk; a third-party consumer that string-compares the public `linkVariants()` output would still notice.
- **R-2 — Runtime fallback is load-bearing.** If the hook forwards an unknown `variant` straight into CVA, the root resolves no variant classes, `border-0`/`pb-0` disappear, and the **legacy `.eg-link` rule paints its 1px hairline again** — a silent appearance change for a cast-invalid value. AC-09/R4 exist for exactly this and must fail before the normalization is added.
- **R-3 — The approved contract text still contains rejected items.** Spec §3, §4, the story list in §6 and the `trailing-arrow-glyph` proposal block all describe the up-right glyph. A future reader who skims the spec instead of the approval could re-introduce it. Mitigation: G2, §1.2 and the commit message; the spec stays frozen (Q-A).
- **R-4 — No adopted expected-design reference.** `underlined` is judged only against the written recipe; visual conformity stays **Not evaluated**. The VIS captures also show details the approval supersedes (white label, 18px glyph, 2px inset, diagonal nudge), so nobody may treat a pixel diff against them as a failure.
- **R-5 — Consumer utility collisions are documented, not fixed.** A consumer `border-b`/`pb-2` utility cannot remove or adjust the recipe through `cn()` in the way a reader might expect, because `twMerge` resolves stock groups whose ordering here depends on emitted CSS. The contract documents "use `variant='underlined'`"; the plan repeats it in the story copy.
- **R-6 — Utility availability depends on scanned sources.** `pb-0.5`, `border-b` and `hover:border-fg-brand-default` are new *class strings*, not new theme keys: `--spacing`, the `border-*` width scale and `--color-fg-brand-default` all exist, and `border-border-brand`/`border-b` are already emitted by other components today. `pb-0.5` is currently **absent** from `packages/ui/dist/styles.css`, so R7's emitted-CSS assertion is the real guard. A future variant-prefixed utility whose theme key does not exist would silently emit nothing — that is the tailwind lesson this plan pins.
- **R-7 — Registry freshness.** `types.ts` bytes change for an approved convention set; forgetting the four revision refreshes fails `pnpm props:check`, and hand-editing `docs/prop-naming.md` would be a policy violation. Both are parent-owned steps in §7.
- **R-8 — Documentation debt widens.** The v0.2 amendment and the spec header now contradict the shipped API. It is visible, harmless to runtime and needs an explicit decision (Q-A) rather than a silent fix.

## 12. Owner questions

**Q-A — Reconcile the stale documentation, or leave it frozen?** `spec.md` cannot be edited (its payload is the approved digest). `docs/components/link/v0.2/amendment.md` (line 20: "No public prop is added") has no published digest and could be corrected. *Recommendation:* leave `spec.md` frozen, forbid edits by policy note in the commit message, and authorize a one-line correction in the v0.2 amendment pointing to v0.3 for the added `variant`. Option: also leave the amendment alone and rely on `docs/CATALOGO.md` plus this plan — smaller diff, but the next reader hits a contradicting sentence in the same folder tree.

**Q-B — One story or one story plus a composition example?** Spec §6 planned `Underlined`, `ExternalUpRight` and a card-footer composition story; `ExternalUpRight` is rejected, and Q3 already decided the link-look inside a whole-card anchor belongs to the card/list layer. *Recommendation:* ship `Underlined` only (with one `arrow={false}` sibling inside it) and defer the card-footer composition to the layer-(c) components that own the card. Option: add the composition to `Atoms/Link` now, which puts a molecule's layout into an atom's docs and duplicates the later work.

**Q-C — Catalog and registry timing.** *Recommendation:* one delivery — the six Link files (one of them unchanged) plus the parent-owned metadata, registry and catalog updates in the same slice, because the registry revisions and the docgen/Controls assertions are only meaningful together with the CVA change. Option: split code from documentation, which leaves `pnpm props:check` red between the two commits and breaks "registry refreshed in the same slice".

## 13. Stop

This plan authorizes nothing. It records the six mandatory files (no stylesheet), the exact recipe split, the hook normalization, the test-first map, the exclusion of every arrow-glyph item, the parent-owned integration list, and it stops for G1–G6 plus Q-A…Q-C. No source, test, token, dependency, registry, catalog or Git action is taken or implied, and no behaviour in this document is claimed as observed.
