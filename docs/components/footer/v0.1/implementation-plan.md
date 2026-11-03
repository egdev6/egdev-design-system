# Footer v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This document authorizes no implementation or shared-file changes.
- **Contract:** [Footer v0.1](spec.md), issue [#293 approval comment 6597377760](https://github.com/egdev6/egdev-design-system/issues/293#issuecomment-6597377760), owner answer: “Aprobar con las recomendaciones (Recomendado)”. Canonical payload SHA-256 `8b672a15b17d23d1162b896867c45112a74c1749c6e6e7770b21c93717e7efd0`, from the exact heading line `## 1. Purpose and scope` through EOF. The approval pinned a longer range; the [erratum](../../web-catalog/v0.1/layer-d-batch-1-hash-errata.md) records the canonical suffix and explains why the approved content is unchanged. The spec's Proposed/Pending header is historical; do not rewrite it.
- **Plan approval identity:** The parent computes SHA-256 of the **entire final plan file**, records the exact whole-file hash with the owner's explicit approval, and preserves those bytes, as in [layer (c) approvals](../../web-catalog/v0.1/layer-c-plan-approvals.md). No self-hash is embedded. Any subsequent edit requires a new hash and approval; contract, plan, and the gates below are distinct decisions.
- **Visual references:** VIS-01 `53d75dae7646a1f6aa770525bb335ccb68eb2966b8db54cb679b39045e03011b`; VIS-02 `23311a65bfc2bffd958a52d7c85f8c19274ae384dacfd03b3cb4d02df07665dd`. Capture conditions are in [the spec](spec.md). Their separate adoption is not established by the recorded answer; request explicit adoption with approved differences. Until then compare as reference only, and report visual conformity **Not evaluated** rather than claiming adoption.

## 1. Separate owner gates before implementation

1. **Plan:** approve this exact whole-file plan and separately authorize the future surfaces. Approval of the plan alone does not resolve gates 2–6.
2. **Footer-local inclusive breakpoint:** recommend static `[@media(width<=860px)]:grid-cols-2` and corresponding `[@media(width<=860px)]:col-span-2` on the brand, with a three-track base. Unlike a typical Tailwind `max-[860px]:` range (`width < 860px`), the explicit media comparison includes exactly 860px; verify the installed compiler's actual output and browser behavior, including fractional widths around 860, before relying on it. `--breakpoint-section-header-split` is also 860px but names SectionHeader's rule; do not silently reuse or broaden it. No token change. If the exact arbitrary variant does not emit, stop for a separately approved solution; do not substitute a near-860 threshold. Approval is Footer-only.
3. **Boundary recipe:** recommend host-owned Grafito background and group-edge fade; Footer paints no background, gradient or shadow. Use `border-t-[length:var(--border-width)] border-t-solid border-t-border-hairline` and `border-b-[length:var(--border-width)] border-b-solid border-b-border-hairline` on the root; the grid's top and legal row's top each use the same token-width solid `border-border-hairline` divider, only when that region exists. The sole width is existing `--border-width`; all colors are existing `--color-border-hairline`. These decorative hairlines do not delimit controls. This is a proposed Footer-specific Material boundary, **not** Gauge's exception or an already approved Surface recipe. Owner must explicitly approve top, bottom and internal dividers; stop if another treatment is selected or emission fails. No new tokens, shadows or gradients.
4. **Legacy neutralization:** approve the scoped inventory and target properties in §4, including the responsive first-child rule. Recommend utility-layer local resets/matches only, never change `packages/ui/src/styles/legacy/bundle.css`. Demonstrate every target with shipped legacy loaded, computed styles and the 859/860/861 checks; if the approved recipe cannot win in the real cascade, stop rather than add unapproved CSS. Approval does not migrate legacy consumers.
5. **Naming:** recommend the existing approved entries `collection-items` (`FooterNavigation.items`), `accessible-name` (`FooterNavigation.label` and item `label`) and `heading-level` (`FooterNavigation.level`). Item `href` is the native destination; `children`/`className` are composition/native, not new own naming concepts. No new convention or exception is required by this plan; confirm those mappings separately before registry integration. Any newly discovered convention remains `proposed`, `approval: null`, pending its own semantic review, never silently approved by the plan or component approval.
6. **Section-link target feasibility:** FT-08 requires at least 44px targets. The existing `Link` allows `className` for outer margin/alignment only, not a new sizing/appearance override; simply enlarging a surrounding `li` does not enlarge the anchor's hit box. Recommend first proving the unmodified `Link arrow={false}` target in the actual browser. If it is below 44px, **stop** and obtain a separate owner-approved, contract-compliant resolution before implementation can meet FT-08; do not silently widen Link's API, fake a hit area, change the atom, or weaken the criterion. Any Link amendment is outside this plan's authorization.

## 2. Contract and composition

`Footer` is a passive organism, not a page or choreography controller. Its required children contain optional parts at most once in documented order: `FooterMotto` (one consumer non-interactive `Text` element), `FooterBrand` (named consumer brand and optional tagline), `FooterNavigation` (structured links), `FooterSocial` (consumer heading and configured `SocialLinks`), `FooterLegal` (consumer text/links). Absent parts produce no empty wrapper. No baked-in names, copy, URLs, year, logo, observer, SectionNav state, router, analytics or automatic new tab. Host owns register/fade, visibility coordination and placement outside `main` and other sectioning contexts.

`FooterNavigation` has required nonblank visible `label`, `items: { href: string; label: string }[]`, optional `level: 2 | 3 | 4 | 5 | 6` default 2. Omit blank label, empty or all-invalid group; omit entries with empty href or blank label, preserve valid order and exact destinations without deduplication or rewriting. Native `nav` is labelled by its visible heading using per-instance `useId()`. Render each valid destination using existing `Link` with `arrow={false}` and no interception or automatic new tab. System brand ink is the approved deviation from the source's secondary-to-white links; do not override it or claim parity. SocialLinks is a separately named list, not another nav; consumer supplies explicit nonblank list label and `caption={null}`, owns avoiding an orphan heading when its data is invalid, and retains SocialLinks validation and external behavior. Native Tab/Enter and focus belong to links; no invented keyboard model or Radix dependency.

Root forwards compatible `ComponentPropsWithoutRef<'footer'>`, excluding `children`, `dangerouslySetInnerHTML`, `role`, `style`, `tabIndex`; preserve `id`, `data-*` and compatible accessible name. Parts use corresponding compatible attributes under the spec; `className` is outer placement, margin and sizing only, not internal layout or appearance. No ref or `asChild` on Footer. `cn()` handles recognized utility conflicts only; do not promise universal last-class wins. Preserve DOM order and make brand span both tracks only when brand exists; a missing brand must not cause the navigation to span by legacy first-child accident.

## 3. Future surfaces and responsibilities

These are proposals, not current edit permission:

| Surface | Future owner / responsibility |
| --- | --- |
| `packages/ui/src/organisms/footer/types.ts` | Writer: public types, English JSDoc, static CVA per-part recipes, `type` only and protected native inheritance. |
| `packages/ui/src/organisms/footer/useFooter.ts` | Writer: meaningful normalization, IDs and per-part `cn()` composition; no observers or orchestration. |
| `packages/ui/src/organisms/footer/Footer.tsx` | Writer: JSX only, native landmark, heading/list and named parts; consume hooks. |
| `packages/ui/src/organisms/footer/Footer.test.tsx` | Writer: public behavior and criterion-level RED tests. |
| `packages/ui/src/organisms/footer/Footer.stories.tsx` | Writer: English Storybook examples and autodocs. |
| `packages/ui/src/organisms/footer/index.ts` | Writer: named components and types, only approved variant exports if needed. |
| `packages/ui/src/index.ts`, `packages/ui/src/styles/compiled.css`, `.storybook/preview.css` | Parent integration: organism export; add Footer `types.ts` and stories source scans respectively. Current production scan lists individual organisms, not an organisms wildcard; verify build output, not just directives. |
| `packages/ui/src/lib/storybook-docgen.test.ts`, `packages/ui/src/lib/storybook-controls.test.ts`, `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs` | Parent: extraction, Controls, exports, emitted CSS and packed-consumer checks. |
| `skills/_shared/prop-naming.json`, `docs/prop-naming.md` | Parent: reviewed usages and generated reference, per gate 5. |
| `scripts/catalog_data.py`, `docs/CATALOGO.md`, `docs/catalog.json` | Parent only: Footer row refresh and generated outputs, §8. |

**No stylesheet**, contingent on gates 2–4 and working utility emission. If a compliant utility-only solution is impossible, stop for a separately approved meaningful stylesheet role; no dummy file, unapproved global recipe, inline appearance, invented internal module or dependency. Do not edit tokens, legacy stylesheet, child implementations, frozen spec or captures.

## 4. Local styling and collision inventory

Legacy is imported into `@layer components` by `packages/ui/src/styles/index.css`; production utilities are in `@layer utilities`. Verify actual shipped cascade, including apps that import legacy differently: class-string order and `cn()` are not proof. Use the retained `eg-footer`, `eg-footer__stage`, `eg-footer__grid`, `eg-footer__legal` markers only; other legacy part markers are not required or granted public APIs. Proposed target inventory, subject to gate 4:

| Legacy selector | Every inherited legacy declaration to neutralize or deliberately match in the new Footer |
| --- | --- |
| `.eg-footer` | `position: relative`; top border width/style/red color; `padding: 0 0 var(--space-8)`; foreground and sans family. Explicitly choose relative positioning, token padding/foreground/family and replace top border with gate 3 hairline; add approved bottom hairline. |
| `.eg-footer__stage` | top/bottom padding `--space-12`/`--space-10`, zero horizontal padding. Explicit token-backed values; ensure absent motto has no stage. |
| `.eg-footer__grid` | `display:grid`, `1.4fr 1fr 1fr` minmax tracks, `--space-10` gap/top padding, top border width/style/subtle color. Explicit three-track base, token gap/padding and gate 3 divider; the inclusive media variant supplies two equal tracks. |
| `.eg-footer__legal` | flex, `justify-content:space-between`, `--space-4` gap, wrapping, `--space-12` top margin, `--space-5` top padding, top border width/style/subtle color, muted color and 14px font size. Explicitly match layout with token utilities and reset typography to a chosen existing token recipe; replace border with gate 3 divider. |
| `.eg-footer__grid > :first-child` at `max-width:860px` | Legacy sets `grid-column:1/-1` on whichever part happens to be first. Reset first child's column to auto at that viewport, then span the actual brand only. Test brand present and absent, each optional-part combination, and both sides of the breakpoint. Verify cascade against this more-specific selector. |

Avoid `eg-footer__wrap`, `__motto`, `__tagline`, `__heading`, `__list`, `__link`, `__social`; if implementation nevertheless needs one, stop and extend the separately approved inventory first. In particular avoid `.eg-footer__motto .eg-title__accent` (legacy block display and brand color) and leave Text's own contract intact. Reused Logo, Link and SocialLinks carry their own legacy contracts and must be checked with their actual CSS. Reset the new nav `ul` explicitly with `list-none m-0 p-0` rather than depending on UA or Tailwind preflight. Ensure narrow text can wrap (`min-w-0`, appropriate wrapping) without clipping, and no visual reordering. Emit and inspect every arbitrary and variant utility in actual production CSS, including boundary widths, grid tracks and breakpoint; do not rely on Storybook's extra scan to prove package output.

## 5. Test-first and acceptance mapping

For each FT criterion, add behavior-level tests first and record intended RED before the implementation that makes it pass. Browser-only observations require a reproducible failing baseline or a stated reason no meaningful automated RED exists; jsdom cannot prove geometry, paint, focus visibility or contrast. After GREEN keep focused tests green while refactoring.

| RED | Public observable behavior / acceptance |
| --- | --- |
| R01 | FT-01: supplied parts in order, no domain defaults; each omission leaves no wrapper. |
| R02 | FT-02: native footer outside a real `main` exposes contentinfo; nested under `main`/section does not assert one. |
| R03 | FT-03: visible labelled nav, default and selected heading ranks, unique IDs across instances, ordered links; blank group label, empty/all-invalid entries and mixed invalid items omit exactly the specified output, retaining valid href bytes. |
| R04 | FT-04: real Logo/SocialLinks composition, named brand/list/links, no nested anchors or default caption; delegate invalid/duplicate/external behavior and test native activation without automatic new tab. |
| R05 | FT-05: no observer, own tab stop, scroll handler or visibility state; host alone controls SectionNav in integration example. |
| R06 | FT-06: browser grid and DOM order at 390, 859, 860, 861 and 1280px, brand present/absent; long labels/legal/social wrap with no clipping or page overflow. |
| R07 | FT-07: browser computed declaration-by-declaration checks from §4 with legacy loaded, approved boundary recipe and unaffected separate legacy fixture; conditional divider absence. |
| R08 | FT-08: keyboard order/Enter, visible focus, all link targets ≥44px, actual contrast on host register and reduced motion; gate 6 applies. |
| R09 | FT-09: root/part layout-only merges and native forwarding; type and runtime checks for excluded root attributes, no ref/asChild or leaked own props. |
| R10 | FT-10: six meaningful files, real docgen/control pipeline, static source scan, CSS emission and no-Tailwind packed consumers on React 18/19. |

PRESERVE: do not modify Link, SocialLinks, Logo, Text, shared helpers or legacy CSS. Run their focused suites and existing package/metadata tests alongside the new cases; any shared-code change requires its own scope and preservation/differential review. Tests of marker/merge invariants must not snapshot entire class strings.

## 6. Stories, docgen and package evidence

`Organisms/Footer`, `Meta<typeof Footer>`, autodocs, no manual `argTypes`, `play` or rendering adapter. Examples: `Default`, `Minimal`, `Landmark` (real main plus sibling footer), `Empty`, `Invalid`, `Social`, `HostComposition`, `Responsive`, `Focus`, `Composition` and long localized labels. Examples supply their own neutral content and destinations; default story does not fabricate component defaults. Use `variant="ghost"`, `size="lg"`, explicit social label and `caption={null}` in the applicable social example.

Annotate every own declaration/union branch with English `@control` from the shared policy: `text` for label, `number` or a supported finite-enum control for the extracted level, `false` with concrete `@controlReason` for structured items and ReactNode/ReactElement children. `@default 2` only for the actual constant; no dummy defaults. Verify requiredness, native props, extracted enum/default, real `react-docgen-typescript`, installed extraction/enhancer/inference and zero owned diagnostics. Then exercise actual Controls widgets in a browser; tags and AST counts alone are not evidence.

Parent extends named runtime/type export assertions and SSR fixture for the six public components and their types. Packed consumers import public APIs, use valid and invalid types, and render with compiled tokens and shipped UI CSS **without a consumer Tailwind compiler**; check React 18 and 19 via the existing harness. Verify the production CSS contains all static CVA classes, arbitrary and media variants and the approved 860px inclusive query. Build/fixture success alone does not prove visual layout.

## 7. Registry and integration

Parent inspects the actual final `FooterNavigationProps` and item symbol in `packages/ui/src/organisms/footer/types.ts`, then appends usages for the three exact IDs in gate 5 with `source.path`, `source.symbol`, and `revision: sha256:<whole-file bytes>` of that reviewed source. No guessed revision, promotion or duplicate convention. Regenerate via `pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`; these validate mechanics, not human semantic approval.

## 8. Catalog — parent only

After successful implementation and separate authorization, one parent-owned shared integration unit updates the Footer row in `scripts/catalog_data.py` (organism, `@egdev/ui`, native, Logo + SocialLinks + Link composition) to reflect the implemented approved contract, then runs `python3 scripts/build_catalog.py` once to regenerate `docs/CATALOGO.md` and `docs/catalog.json`. Do not hand-edit generated files or silently alter another row. This plan performs none of those actions.

## 9. Browser and merge gates

Use real Chromium with shipped CSS, actual tokens and legacy bundle, not just jsdom or HTML smoke. Record browser/version, viewport, DPR, theme, fonts, motion setting and screenshots/computed values. Check all §4 properties with brand present and absent at 859/860/861 plus fractional boundaries; inspect `grid-template-columns`, `grid-column`, border colors/styles/widths, spacing, typography and UA list resets. Check 390/1280, long labels, long unbroken content, legal wrapping and social icon wraps; test a real `main` followed by the footer, multiple instances, nav and named list separately. Tab through brand, section, social and legal links, Enter destinations, visible focus and actual hit rectangles, contrast on the actual host background, reduced motion and 200% zoom. Exercise Controls, not merely metadata. Compare references only with their stated conditions and explicit adoption status; record approved Link-color and Material differences. No screen-reader session or visual parity is implied by accessibility-tree inspection.

Focused checks precede broader verification; future parent schedules and explicitly authorizes commands, including focused Footer and child suites, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`. Report actual observed results, not planned passes. After each integration merge compare every column-0 statement in shared test files against main, inspect test nesting/counts and duplicate loops as well as diff/deletions; passing suites alone did not catch layer (c) structural merge damage.

## 10. Bounded work units and stop line

- **A — writer:** six Footer files and criterion-level RED/GREEN, only after all applicable gates and scoped authorization.
- **B — parent:** source scanning, public exports, metadata, package fixtures and reviewed naming usages; verify emitted CSS and packed consumption.
- **C — parent:** authorized catalog row and one regeneration, coordinated with other layer (d) rows.
- **D — parent:** real-browser and structural merge checks, final verification and separate delivery decision.

**Risks:** inclusive arbitrary-media syntax and its emitted cascade are unverified; legacy first-child specificity and list UA defaults can silently break optional composition; Link's 44px target is unverified and may block FT-08; consumer-supplied slots cannot enforce accessible content or prevent orphan social headings; host background affects brand-link contrast; visual-reference adoption, screen-reader checks and browser parity remain unverified. If any gate fails, CSS cannot emit, target/contrast cannot satisfy the contract, a token/dependency is missing, or a changed promise is needed, stop and return evidence for a separate owner decision. No implementation, token, dependency, registry, catalog, Git or remote action is authorized by this proposed plan.
