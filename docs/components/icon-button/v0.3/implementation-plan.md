# IconButton v0.3 — implementation plan for the `outline` hover-border token

- **Status:** Draft preparation only. This plan accompanies the already owner-approved v0.3 contract; it is **not** permission to write code. It needs its own approval (gate G1) before any edit. The approved change is one CVA class plus documentation copy; nothing else in the atom moves.
- **Contract authority:** [`spec.md`](spec.md) v0.3, whole-file `sha256:c3fb02fe961b07e423bcb59a3109ef7c2689546aa0d76725aa4b31556787c4ea`, byte-identical to the copy merged in PR #265 (`git show da19f58:docs/components/icon-button/v0.3/spec.md` reproduces the same whole-file hash). `version: 0.3`; `contentSHA256: 28a7527a1452deda5051ff0618335b4a0b8b5b05191e0c86d1e40c47ee9bb49c`, reproduced in this preparation with the tracking-doc L12 method for this spec group: `python3 -c "from hashlib import sha256; t=open('docs/components/icon-button/v0.3/spec.md').read(); print(sha256(t[t.find('## 1. Purpose and scope'):].encode()).hexdigest())"` → `28a7527a…`, exact. The cut starts at the substring occurrence on line 7 (inside the spec's own hash-definition sentence); the line-start cut hashes to `2be3d98e…` and is **not** the approved payload. Unlike Chip v0.2, the approved digest binds `spec.md`, not [`issue-comment.md`](issue-comment.md) (whose payload hashes to `1013281a…`); the published comment embeds the canonical payload verbatim at its end.
- **Owner approval:** [issue #57 comment 6576885478](https://github.com/egdev6/egdev-design-system/issues/57#issuecomment-6576885478) (2026-11-02), on snapshot [issue #57 comment 6576836257](https://github.com/egdev6/egdev-design-system/issues/57#issuecomment-6576836257). Owner answer, verbatim: `"Aprobar + corregir el token (Recomendado)"`. Adopted scope, verbatim from the approval: "the snapshot with its recommendations: keep `lg` (48px), no new size or token, keep the neutral raised hover, the social row stays documented in SocialLinks, footer and slider controls stay ghost. Q2 adopted: the outline hover border moves from `--color-alpha-red-65` to the existing `--color-border-brand` token (one CVA class; the registry revisions for IconButton refresh in that slice)."
- **Visual references:** `VIS-01 5b6c4dd0…` and `VIS-02 cc7ff50c…` are reused v0.1 approved expected design for the outline treatment; `VIS-03 771aa85d…`, `VIS-04 ebb144d9…`, `VIS-05 7aa63694…`, `VIS-06 1b7e5662…`, `VIS-07 2ce06798…`, `VIS-08 da63ba2d…` remain `Proposed (Pending owner adoption)`. The swapped border colour moves the atom *toward* the Foundation board and both web sources (which use the 45% brand border), but visual conformity for the new hover paint is measured in the browser (§10) and is not inferred from a hash.
- **Plan identity:** `contentSHA256: 1500f08ff57cefa943a0f86d3847778b5233de6657e011f6173445dd5e1f8d36` — SHA-256 of the UTF-8, LF, final-newline payload from the first level-two heading (“1. Authority and gates”) through EOF. Tracking metadata above that heading is excluded, exactly like the contract's own rule.
- **Baseline:** `f159b9cc63ec0f16797239683b272e4e11ad0de3` (branch `docs/web-catalog-layer-b`). Reviewed source bytes: `atoms/icon-button/types.ts` `721e9ef2357a52b4a75ce9202736901a82a80ab7d5da7ba94b575f582d351489`, `useIconButton.ts` `98c0573bc9ab98c2ec4cac99a028f3532fcc2c79f1aca2ccd4e17d0f54b68f49`, `IconButton.tsx` `dc8de02cef071e2d2e64deb7960b67df7ee16ef92c95ad9b2f9c138c744d2495`, `IconButton.test.tsx` `1414fa404ede6e8d959085373d1874d92247e45642ead3d273bd04367217b927`, `IconButton.stories.tsx` `06f6f8a4f82af1c277bd557623dcb2998be120f567cd774fb6cdd6557cc751ae`, `index.ts` `44ab511b50cf4caf101d3b3817a501fb1496b3b3e50480d4150a02da03cad257`; harness bytes `scripts/package-exports.test.mjs` `46e80fc6930603ab9928d9d1dd914a0859f211232709c32584dafd5c36bd7f82`, `scripts/package-consumption.test.mjs` `077b8accf4825dc087174c581d66b5b5abd80326335fad265d97b047da2cf9f6`, registry `skills/_shared/prop-naming.json` `e20288f097cb70eedf25a3d5e481977b57d6ce84fe017478132a09e3905f8850`.
- **Observed evidence:** none for runtime behaviour. This preparation read the contract, the approval, the six IconButton files, `social-links`, the two package harnesses, the registry and the built `packages/ui/dist/styles.css`; it ran no tests, builds, Storybook, browser checks or screenshots. Every acceptance row below is *planned*, never observed. What *was* observed is static, and it changes the risk picture (see §5 and R-1/R-2): `packages/ui/src/atoms/icon-button/types.ts` is the **only** file under `packages/ui/src` whose CVA references `alpha-red-65`, so the utilities layer of the shipped stylesheet carries exactly one `--color-alpha-red-65` occurrence and it belongs to this outline recipe; four legacy rules in `packages/ui/src/styles/legacy/bundle.css` (chip active, tabs underline, checkbox checked, progress lg) keep the token shipped and used, so the token itself stays untouched.

## 1. Authority and gates

1. **G1 — Plan approval.** The owner approves this exact plan payload and grants the implementation edit surface. Contract approval alone grants no code.
2. **G2 — Approved scope is exactly two things.** (a) One CVA class token swap inside the `outline` variant string of `iconButtonVariants`: the arbitrary-variant utility `[&:not([data-disabled]):hover]:border-alpha-red-65` becomes `[&:not([data-disabled]):hover]:border-border-brand`. (b) Documentation copy stating that `outline` is the round treatment used by the web's social rows, plus one `outline` `lg` example inside the existing `Sizes` story. Must **not** appear: a 46px preset, a new size, a new token, a `round`/`shape`/`radius` prop or variant, a red-tinted hover fill, a new story name, a `SocialLinks` change, an atom-level social-row composition story, hover motion, tooltips/pressed/loading, a stylesheet, or any change to `useIconButton.ts`, `IconButton.tsx`, `index.ts` or the public type block.
3. **G3 — Harness pins must move with the source.** Two package-harness assertions currently name `--color-alpha-red-65` as an IconButton consumption: `scripts/package-exports.test.mjs` (utilities-layer token list, line ~2797) and `scripts/package-consumption.test.mjs` (`assertIconButtonCSS`, line ~2766). They behave differently and both must be updated in the same slice: the exports assertion **fails** after the swap (it scans only the `@layer utilities` block, where this CVA provided the sole occurrence), while the consumption assertion would stay **falsely green** (it scans the whole shipped stylesheet, where the four legacy rules still emit `var(--color-alpha-red-65)`). Leaving either one unedited makes the evidence lie about what IconButton consumes.
4. **G4 — Registry byte refresh in the same slice.** `types.ts` bytes change, so all five `IconButton` usages (`accessible-name`, `leading-icon`, `visual-treatment`, `preset-dimensions`, `slot-composition`) must be re-pinned to the reviewed whole-file hash, and `docs/prop-naming.md` regenerated. The v0.1 IconButton-scoped `leading-icon` amendment records stay byte-identical (exception hashes bind the exception payload, not the usage revision). Convention approval is neither sought nor changed.
5. **G5 — No token, dependency, Material or legacy change.** Both tokens already exist (`--color-border-brand: var(--color-alpha-red-45)` = `rgba(255,0,54,0.45)`; `--color-alpha-red-65` = `rgba(255,0,54,0.65)`), no token is added, edited or removed, no dependency moves, no Material recipe changes (same hairline, sheen, edge/elevation and glow), **no stylesheet** (`icon.css` must not exist), no `packages/ui/src/styles/legacy/bundle.css` edit, and `theme.css`'s own note that `--color-alpha-red-65` is "solo dentro de sombras" stays accurate because after this change the only remaining consumers are legacy shadow layers.
6. **G6 — Parent-owned integration.** Registry JSON, the generated view, both package harnesses and the catalog source/artifacts are integration surfaces. The writer returns the reviewed hash and the exact assertion text; the parent decides when to regenerate and commit.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/atoms/icon-button/types.ts` | Writer | The single token swap inside the `outline` variant string; English JSDoc body of `variant` extended so the documented treatment reads "outline is the round treatment; it is the web social-row treatment used at `lg`" while every `@control`/`@default` tag stays byte-identical |
| `packages/ui/src/atoms/icon-button/IconButton.test.tsx` | Writer | RED-first class assertion for AC-08 (hover border resolves `border-border-brand`, never `border-alpha-red-65`, rest hairline preserved); one list-composition case for AC-05 if kept (Q-C); all existing cases untouched |
| `packages/ui/src/atoms/icon-button/IconButton.stories.tsx` | Writer | Meta Description/Usage guidelines copy for the round social-row treatment at `lg`; one `outline` `lg` cell added to the existing `Sizes` story render. Story names, args and story count unchanged |
| `packages/ui/src/atoms/icon-button/useIconButton.ts` | — (**no change**) | Out of scope by G2; the recipe swaps inside the CVA only, and the hook composes it unchanged |
| `packages/ui/src/atoms/icon-button/IconButton.tsx`, `index.ts`, `packages/ui/src/index.ts` | — (**no change**) | No JSX, export or public-type movement; `iconButtonVariants`/`iconButtonIconVariants` stay internal |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent (verify) | Expected **no change**: the IconButton case asserts `ownProps` names, `@control` tags, requiredness, defaults, the story-name list and the `argTypes`/`play` absence. The swap touches no tag and no story name; this plan requires re-running it, not editing it |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent (verify) | Expected **no change**: `variant`/`size` option lists, the defaults map (`variant: '"ghost"'`) and the native rows are unaffected |
| `scripts/package-exports.test.mjs` | Parent (integration) | In the "UI ships every static IconButton CVA utility…" case: replace `'--color-alpha-red-65'` in the "must consume" token list with `'--color-border-brand'`. The CVA class scan keeps passing because `border-border-brand` is already emitted (the `secondary` variant uses it) |
| `scripts/package-consumption.test.mjs` | Parent (integration) | In `assertIconButtonCSS`: replace `'--color-alpha-red-65'` with `'--color-border-brand'`. The function is injected into three separate consumer runs (`shippedStyles`, `emitted`, `twCss`), so one edit covers all three |
| `skills/_shared/prop-naming.json` | Parent | Refresh the five IconButton `source.revision` values to the reviewed hash of the new `types.ts`. No entry text, status, alias or exception changes |
| `docs/prop-naming.md` | Parent-generated | `pnpm props:docs`; never hand-edited |
| `scripts/catalog_data.py` | Parent | IconButton row (line 16) note: record the v0.3 confirmation (round `outline` = web social-row treatment, `lg` default through `SocialLinks`) and the hover-border token correction, with the #57 references |
| `docs/CATALOGO.md`, `docs/catalog.json` | Parent-generated | `python3 scripts/build_catalog.py` after the source edit |

Explicitly **not** touched: any `icon-button.css` (must not exist), `packages/ui/src/styles/compiled.css` (`@source "../atoms/icon-button/types.ts"` is already registered at line 18, so the new utility is scanned), `.storybook/preview.css` (`@source "../packages/ui/src/atoms/icon-button/IconButton.stories.tsx"` is already registered at line 24, so story-only layout utilities are scanned; no new `@source`), `packages/ui/src/molecules/social-links/**`, `packages/tokens/**`, `packages/ui/package.json`, `packages/ui/src/styles/legacy/bundle.css`, `docs/components/icon-button/v0.3/spec.md` (editing it would change the approved digest) and every other component folder.

## 3. Typing approach and compile impact

**No type, prop, default, variant, size, export or marker changes.** `IconButtonVariant`, `IconButtonSize`, `IconButtonProps`, `forwardRef<HTMLButtonElement>`, `asChild`, the disabled guards and both CVA exports keep their exact public shape, so:

| Consumer | Expected after the change | Required action |
| --- | --- | --- |
| `SocialLinks` (`molecules/social-links`) | Unaffected: it forwards `variant`/`size` and never reads classes | None |
| Any consumer spreading `IconButtonProps` | Unaffected: no union, no new discriminant, no requiredness change | None |
| `scripts/package-consumption.test.mjs` IconButton samples | Unchanged; the SSR/id assertions keep passing | None |
| Public `iconButtonVariants` string | Same token set except the one swapped border utility; the value is internal (`index.ts` does not export it), so no consumer can observe it as API | None |

Because nothing in the public type surface moves, this slice adds no packed-consumer type cases; the package harness work is strictly the two token-list corrections in G3 plus the registry refresh in G4. The only string that changes is inside `types.ts`, which is also registry evidence (`source.revision`), which is why G4 is part of the same slice rather than a follow-up.

## 4. Render and class composition

Before (current `outline` branch, `types.ts:57`, quoted as it ships):

```
border rounded-full border-border-hairline-strong bg-surface-1 bg-[image:var(--gradient-sheen)] shadow-[var(--shadow-edge),var(--shadow-elev-1)] text-fg-secondary [&:not([data-disabled]):hover]:border-alpha-red-65 [&:not([data-disabled]):hover]:bg-surface-2 [&:not([data-disabled]):hover:not(:focus-visible)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] [&:not([data-disabled]):hover]:text-fg-default
```

After — one token, nothing else:

```
… [&:not([data-disabled]):hover]:border-border-brand [&:not([data-disabled]):hover]:bg-surface-2 … [&:not([data-disabled]):hover:text-fg-default
```

(only the first hover utility changes; the rest of the string stays byte-identical)

- **`cn()` / `twMerge` behaviour is unchanged in kind.** The rest colour `border-border-hairline-strong` and the hover colour `[&:not([data-disabled]):hover]:border-border-brand` are different `tailwind-merge` groups (bare versus arbitrary-variant modifier), exactly as today with `…:border-alpha-red-65`, so both survive composition through `cn(iconButtonVariants({ variant, size }), className)` in `useIconButton.ts`. The base `border-transparent`, the `secondary` variant's own `border-border-brand` and its `hover:border-primitive-red-neon` are untouched; CVA selects one variant, so no cross-variant conflict exists.
- **Emitted CSS shape** (verified in the current artifact for the analogue selector): `.\[\&\:not\(\[data-disabled\]\)\:hover\]\:border-border-brand:not([data-disabled]):hover { border-color: var(--color-border-brand, var(--color-alpha-red-45)); }` — i.e. 1px `rgba(255,0,54,0.45)` on hover against `rgba(255,255,255,0.14)` at rest. `border-border-brand` and its token already exist in the utilities layer, so no new theme key is involved and no variant can silently emit nothing.
- **Design consequence to state, not hide:** the hover border alpha drops from 65% to 45%, so the hover ring is *softer* while the neon glyph (`group-[:not([data-disabled]):hover]/icon-button:text-fg-brand-default`), the `bg-surface-2` fill and the glow (`--shadow-glow-base` still builds its own 65% layer) keep the brand cue. That is the approved trade: it aligns the atom with the token's documented role and with the Foundation/web sources.
- **Disabled, focus and motion are untouched:** `[&:not([data-disabled]):hover]` guarantees no hover border while disabled; `focus-visible` still wins the shadow competition through its own selector; `motion-reduce` resets, the `motion-safe` press scale and the v0.2 no-hover-motion rule are unaffected.
- **Copy change only:** the `variant` JSDoc body and the stories meta gain the social-row/`lg` sentence. No `@control`, `@default`, story name, arg or default moves, so `storybook-docgen.test.ts` and `storybook-controls.test.ts` keep their expected values.

## 5. Test-first sequence

RED before GREEN, one behaviour-level test per acceptance criterion in this slice's scope, asserted through the public interface (rendered classes on the real button, shipped CSS selectors), never through internal storage. Existing behaviour that shares the changed code is pinned by PRESERVE cases and needs no RED run.

| Step | RED test (file → case) | Covers |
| --- | --- | --- |
| R1 | `IconButton.test.tsx` — `variant='outline'` renders `[&:not([data-disabled]):hover]:border-border-brand`, does **not** render any `…:border-alpha-red-65` utility, and keeps `border-border-hairline-strong` at rest | AC-08 |
| R2 | `scripts/package-exports.test.mjs` (parent) — the IconButton "must consume" token list requires `--color-border-brand` instead of `--color-alpha-red-65`. This is the case that turns **red** on the source change and proves the utilities layer really moved | AC-08, AC-10 |
| R3 | `scripts/package-consumption.test.mjs` (parent) — `assertIconButtonCSS` requires `--color-border-brand`; the change is honest but does not turn red on its own, which is exactly why G3 names it | AC-10 |

GREEN proceeds after R1's intended failure is observed: one-line `types.ts` swap first, then the copy edits in `IconButton.stories.tsx` (and the `variant` JSDoc body), then the two harness corrections and the registry refresh.

PRESERVE (expected to pass, no RED run) — one case per touched existing behaviour:

- AC-01 default `ghost` `md` (`button type="button"`, `eg-icon-btn`, `size-10`, `rounded-md`, no `rounded-full`) — existing case.
- AC-02 `outline` is round at every size and resolves no `rounded-md` — existing `it.each` over the three sizes; extend it only with the rest hairline assertion already covered by R1.
- AC-03 `outline` hover carries no translate or scale, only the `motion-safe` `:active` press — existing no-hover-motion case.
- AC-04 the `outline` glyph turns brand colour on hover through the group selector and stays `aria-hidden` — existing class assertion and accessible-name case; the glyph recipe is untouched.
- AC-05 `asChild` anchor keeps role, `href`, `target`, `rel`, marker and root ref — existing case. The spec's extra "inside `<ul role="list">` the row keeps its list name and item count" case is a `SocialLinks` composition concern; if kept it is one assertion added to `IconButton.test.tsx`, not a new story (Q-C).
- AC-06 `SocialLinks` still defaults to `outline`/`lg` (48px) with one `<li>` per valid entry and secure rel — existing `SocialLinks.test.tsx` suite, unchanged.
- Disabled guards (native and slotted), form submission, raw-SVG merge, slot ref forwarding and the six-files/no-stylesheet directory assertion — existing cases, unchanged.
- Story metadata: `exportedStoryNames` list, `argTypes` absence, `play` absence, `variant`/`size` option lists and the defaults map — expected unchanged (verify).
- `SocialLinks`, `Tooltip`, `Menu` and every other consumer of IconButton at runtime — no change expected; the class scan in the exports harness plus the IconButton suite bound the blast radius, and no other component reads these classes.

No differential scratch-copy check is required here: nothing outside `atoms/icon-button` consumes `iconButtonVariants`/`iconButtonIconVariants` (verified by repository search), so no unnamed existing component shares the changed code. The correctness of the change is instead pinned by R1 (class), R2 (utilities layer) and §10 (computed colours).

## 6. Stories and copy

`Atoms/IconButton`, `autodocs`, real `Meta<typeof IconButton>`; `action` only for `onClick`. No manual `argTypes`, no `play`, and **no new or renamed story**.

| Story | Change |
| --- | --- |
| `Default`, `Variants`, `Disabled`, `States`, `AsChildLink`, `RawSvg` | None |
| `Sizes` | The render adds one `outline` `lg` cell next to the three ghost sizes, so the round 48px treatment is visible where sizes are documented. Story JSDoc gains one sentence: `outline` is the round treatment the web social rows use at `lg` |

Meta copy to update: the Description currently says "Ghost is the default toolbar treatment; outline is round." and must state that `outline` is the round treatment used by social rows at `lg` while the row itself is `SocialLinks` (Q4 of the contract); the Usage guidelines already say the atom does not own row spacing, ordering or the external notice and that `className` is root layout only — keep those, keep "small controls are desktop-only; touch layouts provide a ≥44px hit area", and keep "no stylesheet". Copy must not claim a new variant, a new size or a hover fill change.

Controls expectations: unchanged. `variant` stays `@control select` with `@default ghost`, `size` `@control select` with `@default md`, `asChild` `@control boolean` `@default false`, `label` `@control text`, `icon`/`children` `@control false` with their existing concrete reasons.

## 7. Registry integration

| Entry (all `approved`, all already carrying an `IconButton` usage) | Action |
| --- | --- |
| `accessible-name` (`label`), `leading-icon` (`icon`), `visual-treatment` (`variant`), `preset-dimensions` (`size`), `slot-composition` (`asChild`) | Refresh `source.revision` from `sha256:721e9ef2…` to the reviewed whole-file hash of the new `types.ts`. Nothing else in those usages changes: no type text, no status, no aliases. The v0.1 IconButton-scoped `leading-icon` amendment/exception records keep their bytes (their hashes bind the exception payload, not the usage revision) |

No new convention, alias or exception is proposed: the round outline remains an allowed value of the approved `visual-treatment` axis, and shape stays bound to the treatment (v0.1 D4). After the authorized edit: `pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`, with the revision taken from the actual post-edit working-tree bytes.

## 8. Package export and consumption cases

- **Exports:** no public name is added, removed or renamed, so the two export lists (the exact sorted declaration list and the membership list) stay byte-identical. `iconButtonVariants`/`iconButtonIconVariants`/`useIconButton` must remain non-exported from the barrel.
- **Consumption:** every existing IconButton SSR/DOM assertion (native button, `type="button"`, `eg-icon-btn`, hidden label, no `aria-label`/`aria-pressed`/`data-state`/`eg-icon-btn--`, slotted anchor without `type`) stays byte-identical.
- **Built CSS:** after the swap the utilities layer no longer contains any `--color-alpha-red-65`, and the outline hover selector resolves `var(--color-border-brand, var(--color-alpha-red-45))`. Both harness edits in G3 encode that, and they are the only no-compiler proof available.
- React 18.3.1/19.3.0 packed-consumer checks run where the existing harness runs them; this slice adds no ref, no API and no dependency, so no new compatibility claim is made.

## 9. Catalog row and documentation

`scripts/catalog_data.py` line 16 is the single IconButton source. Recommended note update (parent-owned): keep the v0.1 contract reference, add the v0.3 confirmation (the web's round social row is `variant="outline"` used at `lg` through `SocialLinks`; the outline hover border now uses `--color-border-brand`) and link this plan. Regenerate with `python3 scripts/build_catalog.py`; the generated files are never hand-edited.

Documentation that becomes stale and is **not** editable in this slice: [`spec.md`](spec.md) keeps its `Draft`/`Pending` header, its `approvalReference: Pending` line and its "Next step" paragraph; it cannot be edited without changing the approved `contentSHA256`. The v0.1/v0.2 IconButton records keep their historical wording (v0.1 D10 chose `alpha-red-65`), which is correct as history but now superseded — see Q-A.

## 10. Browser checks to run before merge

Run against `pnpm storybook` with the real compiled tokens, after GREEN, and record observations — never as expected-design proof:

1. `Variants` / `States`: `outline` at rest computes `border-*-color: rgba(255,255,255,0.14)` (hairline-strong) and `border-*-width: 1px`; on a real pointer hover the computed border colour becomes `rgba(255,0,54,0.45)` (`--color-border-brand`). Record the four longhand colours, not the shorthand.
2. Same hover: the glyph computes the neon brand colour, the fill advances to `--color-surface-2` with the sheen, the hover glow layers apply, and **no** translate/scale appears (v0.2).
3. `Sizes`: the new `outline` `lg` cell measures a 48×48px border box with `border-radius: 9999px`; `sm`/`md` outline stay round too; ghost `md` stays `rounded-md`.
4. Focus-visible on `outline`: `--shadow-focus` ring, the hover shadow recipe excluded while focused, and the border colour does not jump to the hover token on keyboard focus alone.
5. Disabled (`native` and `asChild`): hover produces no border-colour change, opacity 45%, pointer events off, activation cancelled.
6. `AsChildLink`: the slotted anchor keeps `href`/`target`/`rel` and the same computed border colours at rest, hover and focus.
7. `Molecules/SocialLinks` `Default` story beside the atom: identical item appearance to the pre-change baseline except the approved hover border alpha (65% → 45%); footer/slider-style ghost rows unchanged.
8. Reduced motion (`prefers-reduced-motion: reduce`): no transition effect on the border/fill swap and no motion on press; coarse pointer: `lg` still ≥44px.
9. Legacy coexistence: with `.eg-icon-btn--outline`/`.is-hover` rules present in the legacy bundle, the utilities still win for border colour, fill and shadow (no double ring, no grey border).
10. `Controls`: `variant` select lists `ghost|outline|primary|secondary`, `size` lists `sm|md|lg`, and no `Component.prop` diagnostic appears in any IconButton story.

Full gates before merge, parent-scheduled and reported with observed output: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`, the catalog regeneration and the Storybook build. Focused first: `pnpm exec vitest run packages/ui/src/atoms/icon-button packages/ui/src/molecules/social-links packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`.

## 11. Risks

- **R-1 — A harness assertion that cannot fail (highest).** `assertIconButtonCSS` in `scripts/package-consumption.test.mjs` would keep passing after the swap because four legacy rules still emit `var(--color-alpha-red-65)` in the shipped stylesheet. If it is not corrected, the evidence claims IconButton consumes a token it no longer uses, and a future regression could hide behind it. Named for exactly that reason in G3.
- **R-2 — A harness assertion that will fail loudly.** `scripts/package-exports.test.mjs` scans only the `@layer utilities` block, where this outline recipe is the sole `--color-alpha-red-65` occurrence. Expect a red run there immediately after the source edit; that failure is the proof the swap reached the compiled CSS, and the fix is the token-list edit, not a revert.
- **R-3 — Registry freshness.** `types.ts` bytes change for five approved usages; skipping any refresh fails `pnpm props:check`, and hand-editing the generated view is a policy violation. Registry work belongs to the same commit, which is why Q-D recommends one delivery.
- **R-4 — The hover ring gets softer.** 65% → 45% alpha on the border is an intentional, owner-approved appearance change to a v0.1/D10 promise. Anyone diffing the previous screenshots will see it; the mitigation is §10.1–2 recorded evidence plus the catalog note, not a silent revert.
- **R-5 — Visual references are mixed status.** VIS-01/VIS-02 are approved v0.1 boards for the outline appearance; VIS-03…VIS-08 stay proposed. Conformity for the new hover paint is measured, not hashed, and the captures must never be used to argue for the web's 46px box, flat fill or −2px lift (those stay rejected per D3/Q1, v0.2 and Q3).
- **R-6 — Copy drift risk in a documentation-only decision.** Because AC-07 lives in story/meta copy, a reviewer could "improve" it into a new story, a new variant or a size change. G2 lists those explicitly as prohibited, and the correction is a copy edit, never an API edit.
- **R-7 — Token documentation nuance.** `theme.css` documents `--color-alpha-red-65` as "solo dentro de sombras". After this slice the statement becomes true again (only legacy shadow layers consume it), but the legacy rules that keep using it also mean the token cannot be retired by a later sweep without a legacy decision. That is out of scope here and is recorded so the next sweep does not assume IconButton blocked it.
- **R-8 — Stale approved-contract prose.** `spec.md` still reads `Draft`/`Pending` with an open Q1–Q5 section, although the approval records the answers. Implementation must cite the approval comment, not the header, and must not edit the file (Q-A).

## 12. Owner questions

**Q-A — Reconcile the stale contract header, or leave it frozen?** `spec.md` cannot be edited without breaking the approved digest, and the v0.1 record (D10: `alpha-red-65`) is correct as history. *Recommendation:* freeze `spec.md`, rely on the approval comment + this plan, and record the supersession in the commit message and the catalog note. Option: authorize a separate documentation-only amendment file under `docs/components/icon-button/v0.3/` (no digest is bound to it) if the owner prefers an in-repo pointer over a commit-message note.

**Q-B — Catalog note update.** The current row does not mention any hover token, so no regeneration is strictly required for correctness. *Recommendation:* update the row to name the v0.3 confirmation and the token correction, because the catalog is the only place a future contributor reads the current IconButton promise. Option: skip it and let the contract be the single source.

**Q-C — Keep the spec's extra list-composition test?** Spec AC-05 adds "inside `<ul role="list">` the row keeps its list name and item count" while AC-06 already covers `SocialLinks`. *Recommendation:* keep exactly one assertion inside the existing `asChild` case (it is a cheap preservation guard for the social-row role claim) and add no new story. Option: drop it entirely and treat AC-05/AC-06 as `SocialLinks` evidence only, which keeps the atom's suite smaller.

**Q-D — One delivery or two?** *Recommendation:* one delivery — one-line `types.ts` swap, copy edits, one new test case, the two harness token-list corrections, the five registry revision refreshes and the regenerated view/catalog in the same slice; estimated well under 100 changed lines. Option: split source from registry/harness, which leaves `pnpm props:check` and `pnpm test:package-exports` red between commits and makes the review blind to the token's real consumption.

## 13. Stop

This plan authorizes nothing. It records the six mandatory files (one of them holds the single change and none is created), the exact token swap, the copy-only documentation part, the test-first map, the two harness corrections that make the evidence honest, the registry refresh, and it stops for G1–G6 plus Q-A…Q-D. No source, test, token, dependency, registry, catalog or Git action is taken or implied, and no behaviour in this document is claimed as observed.
