# SectionShell v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This document performs and authorizes no implementation, registry, catalog, token, dependency, Git or GitHub action.
- **Coverage:** DP1, S3 of [web catalog task](../../../../odd/tasks/web-catalog.md). Contract: [SectionShell v0.1](spec.md), issue [#291, approval comment 6597376660](https://github.com/egdev6/egdev-design-system/issues/291#issuecomment-6597376660), owner answer “Aprobar con las recomendaciones (Recomendado)”. Frozen Proposed/Pending metadata is historical, not a reversal of that approval. Canonical UTF-8 payload from the complete `## 1. Purpose and scope` heading line through EOF, final LF included: `edb73a8b606fb49b19516e3d25cf2fe8bb78ca742ce05bd800e2215af03957f9`. The [erratum](../../web-catalog/v0.1/layer-d-batch-1-hash-errata.md) distinguishes the longer-range hash published in the approval from this canonical suffix; do not silently rewrite either history or contract.
- **Plan identity rule:** At approval time the parent computes SHA-256 over the **entire exact file bytes**, including header and final newline, and records the digest and owner decision separately, as in [layer (c) approvals](../../web-catalog/v0.1/layer-c-plan-approvals.md). No self-hash is embedded here. Any subsequent byte change requires a new approval decision.
- **Visual authority:** VIS-01 `da7aa002707b0c66dec602c72c5ae3f376226d928de32968dee438a47b83b4c7`, [conditions](capture.json), is a proposed four-register board, not assumed adopted. It uses a preview-only 250px minimum and contains neither Grafito nor fades. Ask separately whether to adopt it with written-contract differences; until then record visual conformity as Not evaluated, not a pixel-parity claim.

## 1. Independent owner gates

Approving this plan does **not** approve any of the following choices. Recommend each as described; stop the affected work if declined or unresolved, and return an amended proposal instead of silently narrowing the five-register contract.

1. **Material recipes and token/stylesheet scope:** approve the exact five mappings in §3, including the generated 50% color mix and reduced-transparency rule, and independently authorize the proposed Show halo token. Until its token exists by separate confirmation, Show cannot be completed. Recommend no component stylesheet if the static utilities and media variant actually emit; if not, request a narrowly scoped, meaningful `@layer components` stylesheet role before creating one. A stylesheet is not a waiver for a missing token or permission for handwritten gradients.
2. **Group-edge fade:** approve the host-composed paint-only mechanism and three proposed mask tokens in §4, including the reduced-transparency behavior. This is not a SectionShell prop or a generic effects API. Token additions and any host stylesheet role require their own specific approvals. Without them SS-05 remains blocked, not approximated.
3. **Naming conventions:** separately approve the two exact registry entries in §5, or keep them proposed with `approval: null`; the approved component prop names do not imply global convention approval. Recommend approving both without aliases or exceptions.
4. **Sticky Lab escape:** recommend **exclude it from v0.1**. The approved recommendation calls for a separately specified opt-out but supplies neither API nor geometry. Lab/self-contained sticky scenes can remain outside this shell; no height prop, special class or hidden exemption is invented. A future contract amendment and plan are required.
5. **Legacy coexistence:** approve the bounded local neutralization strategy in §6, including avoiding legacy modifier classes, emitted utility proof and browser computed-style comparisons. Recommend it; no legacy stylesheet edits, blanket `!important`, or migration. Escalate any collision that cannot be resolved through emitted local utilities rather than overriding descendant components indiscriminately.
6. **Capture adoption:** recommend adopting VIS-01 only for surviving four-register intent with the stated limitations; independently verify Grafito, fades and full-height geometry in a browser.

## 2. Future implementation boundaries and API

The intended template is a passive native `section`, named by a host-supplied non-empty valid `aria-labelledby` or `aria-label`; host owns valid unique heading/anchor IDs, native `data-zone`, scroll offset, group edges and effects. No generated heading, name from zone, focus stop, choreography, Radix, timer, `asChild`, ref, role override, `style` or unsafe HTML. Native attributes pass through subject to the spec's exclusions. `className` supports outer placement only, not arbitrary appearance; `cn()`/`twMerge` do not guarantee universal cascade precedence. `register` is `'pro' | 'show' | 'flood' | 'deep' | 'grafito'`, default `pro`; `wrap` is boolean, default `true`; required `children` remain in order. `wrap=false` removes the internal wrap, not the children. No automatic neighbor detection.

Future writer-owned files, only after gates and authorization: `packages/ui/src/templates/section-shell/types.ts` (own props, English JSDoc, static per-part CVA and controls), `useSectionShell.ts` (derivation and per-part `cn()`), `SectionShell.tsx` (JSX only), `SectionShell.test.tsx`, `SectionShell.stories.tsx`, `index.ts`. Six meaningful files; no extra module. **No stylesheet** under the recommended utility route, contingent on the recipe and emission gates; a different compliant role requires separate spec/plan approval. Use `type`, `ComponentPropsWithoutRef<'section'>` with the spec exclusions, and no fabricated runtime validation or default content.

Root layout proposal: `box-border relative isolate flex flex-col justify-center min-h-[var(--section-min-height)] pt-[calc(var(--nav-height)+var(--space-8))] pb-8`; wrapper `box-border w-full max-w-[var(--content-max)] mx-auto px-[var(--gutter)]`. Verify the actual compiled `calc` syntax and spacing token emission. Long content grows naturally. Existing `Surface` is available, but none of its card treatments is assumed to supply these full-bleed section recipes. No token/dependency change is implied.

`packages/ui/src/styles/compiled.css` currently scans AppShell explicitly, not all templates: parent must add `@source "../templates/section-shell/types.ts"` in the future integration. `.storybook/preview.css` likewise needs a SectionShell story source if story-only utilities are used. Verify both production and Storybook CSS; don't assume `md:` exists (the token theme does not establish the default `md` breakpoint). Avoid a responsive breakpoint unless independently approved and verified.

## 3. Proposed Material recipes — gate 1

All are proposals, not approved recipes. Static classes belong in CVA in `types.ts` and are merged per part. Confirm emitted declarations, computed paint and contrast with the actual token package and cascade.

| Register | Exact proposed paint and foreground | Route / remaining gate |
| --- | --- | --- |
| `pro` | `bg-transparent bg-none text-fg-default`, no halo or shadow; ambient/canvas shows through. | Static utilities, subject to Material approval. |
| `show` | transparent base, `text-fg-default`, background image `var(--gradient-section-show)`; proposed new token value `radial-gradient(45% 55% at 22% 50%, var(--color-alpha-red-12), transparent 70%)`. No public halo-position prop. | Static `bg-[image:var(--gradient-section-show)]` after **separate new-token approval**; existing `--gradient-hot` is a card recipe, not this halo. No handwritten inline or utility gradient. |
| `flood` | `bg-bg-flood bg-none text-fg-on-flood` using `--color-bg-flood` and `--color-fg-on-flood`. | Static token utilities, subject to recipe and actual descendant contrast approval/check. |
| `deep` | `bg-bg-deep bg-none text-fg-default` using `--color-bg-deep` and `--color-fg-default`. | Static token utilities; verify contrast rather than infer it. |
| `grafito` | `bg-surface-0/50 bg-none text-fg-default`, i.e. 50% `--color-surface-0` over ambient; under `prefers-reduced-transparency: reduce`, replace with opaque `bg-surface-0`. | Static opacity utility generates a color mix and requires explicit recipe approval; propose a static `[@media(prefers-reduced-transparency:reduce)]:bg-surface-0` variant, prove output in production CSS and computed browser paint. If unsupported, request a narrowly approved media-only stylesheet role; no new wash token assumed. |

These section fields are not elevated cards. Grafito descendants retain their own approved solid Material recipes and featured treatment; do not globally repaint or strip their hover. Host-supplied glass descendants remain the host's responsibility and must be verified against the approved contract, not rewritten by SectionShell. No hand-authored shadows, gradients, hardcoded appearance or inline style.

## 4. Host-composed group fade — gate 2

Recommend a **host-owned group wrapper**, not a SectionShell fade input. The host knows whether the group needs top, bottom or both edges. For a contiguous Grafito group, the host provides a positioned isolated wrapper, paints one absolutely inset, pointer-events-none decorative underlay behind its section content, and suppresses only the individual Grafito wash **within that host composition** so the wash is not doubled. This suppression is host-local static styling, not a new component API; ensure stacking leaves the ambient visible and all content above the underlay. At non-group sections Grafito retains its own wash. The host must not apply a mask to section content, focus rings or the entire subtree.

Exact underlay proposal: background `color-mix(in srgb, var(--color-surface-0) 50%, transparent)` (or emitted equivalent of `bg-surface-0/50`); for reduced transparency change it to `var(--color-surface-0)`, keeping the edge mask. Propose separately approved tokens, derived from the historical geometry, not currently present:

```css
--mask-section-fade-top: linear-gradient(180deg, transparent, #000 clamp(96px, 14vh, 180px));
--mask-section-fade-bottom: linear-gradient(0deg, transparent, #000 clamp(96px, 14vh, 180px));
--mask-section-fade-both: linear-gradient(180deg, transparent, #000 clamp(96px, 14vh, 180px), #000 calc(100% - clamp(96px, 14vh, 180px)), transparent);
```

Use the selected token for both `mask-image` and `-webkit-mask-image` on the underlay only; no mask for neither edge. These exact new tokens contain new geometry and gradients and require explicit token approval, not merely plan approval. If static arbitrary-property utilities cannot emit both declarations, request a host-owned, narrowly scoped stylesheet role and approval; do not create SectionShell CSS as a workaround or introduce a public fade prop. Confirm the both-edge case on a short group (overlapping stops), a single section, adjacent sections with no internal seam, separate groups and host focus/stacking. Reduced-transparency's solid middle and still-faded edges need explicit owner acceptance; if rejected, stop and obtain a specified alternative.

## 5. Naming gate and parent-owned registry

Exact proposed entry text, with schema fields before any real usage exists:

```json
[
  {
    "id": "section-register",
    "name": "register",
    "meaning": "The combined visual register selected for a section frame; values and recipes are component-specific.",
    "whenToUse": "Select a section's coordinated scene and material treatment.",
    "avoid": "Do not use for a color tone alone, a generic visual variant or choreography.",
    "status": "proposed",
    "approval": null,
    "aliases": [],
    "exceptions": [],
    "usages": []
  },
  {
    "id": "section-content-wrap",
    "name": "wrap",
    "meaning": "Whether a section frame supplies its own centered content wrapper.",
    "whenToUse": "Choose whether section children receive the section content max-width and gutters.",
    "avoid": "Do not use for flex wrapping, a gap, padding alone or a portal container.",
    "status": "proposed",
    "approval": null,
    "aliases": [],
    "exceptions": [],
    "usages": []
  }
]
```

`register` is distinct from `visual-treatment`/`variant` and `surface-material-tone`/`tone`; `wrap` is not `layout-gap`, `inner-padding` or `portal-container`. `children`, native attributes and `className` require no new own-prop entry. After actual source review, the parent appends `SectionShellProps` usages with exact component-specific types and `source: { path: "packages/ui/src/templates/section-shell/types.ts", symbol: "SectionShellProps", revision: "sha256:<actual whole-file byte hash>" }`. Never invent a hash. If separately approved, record a recoverable receipt, exact `convention:<id>` scopes and canonical convention hashes, not approval inferred from #291; otherwise retain proposed/null or omit pending the decision. Parent regenerates with `pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`; no manual generated-view edit.

## 6. Legacy collision plan — gate 5

`packages/ui/src/styles/index.css` imports legacy in `@layer components` before utilities; verify the **built consumer** preserves this order rather than relying on class-string order. Only `eg-section` and, when enabled, `eg-section__wrap` are emitted as public markers. Do **not** emit legacy `eg-section--pro`, `--show`, `--flood`, `--deep`, `--grafito`, `--fade-top` or `--fade-bottom`; select static recipes without those selectors. Thus legacy modifier pseudo-elements and Grafito descendant rules cannot match a new shell. No assumptions about other consumers' class names: `className` cannot grant those unsupported modifiers.

- **Root:** explicitly own position, isolation, box sizing, flex direction/centering, min-height, both padding edges, background image/color and foreground using the §2–3 utilities; check computed values with legacy loaded. UA section defaults and host CSS can differ; test margins, display, box sizing and inherited color, not just class markers.
- **Wrap:** explicitly own width, max-width, auto margins, inline gutter and box sizing; confirm wrap off really removes it.
- **Direct children:** legacy `.eg-section > * { width:100% }` otherwise affects unwrapped host children. Propose static root variant `[&>*]:w-auto` when `wrap=false`, preserving the child’s intrinsic/default auto width; for `wrap=true`, explicit wrapper `w-full`. Test custom narrow and self-wrapped direct children and child margins at two widths. This reset is a real behavioral choice requiring gate 5; don't claim it preserves every host-authored width. Escalate if it overrides supported child styling.
- **Pseudo-elements:** because no modifier classes are emitted, Show/Grafito/fade `::before` rules do not match. Assert computed `content`, `background-image`, `mask-image`, position and pointer events, including prefixed mask, for all registers and host fade cases. Host underlay is separate; no content masks.
- **Grafito descendants:** legacy selectors at `bundle.css:1739–1742` target `.eg-now-card`, `.eg-project-card:not(.eg-project-card--feat)`, `.eg-article-feature`, `.eg-community-card`, `.eg-terminal`, `.eg-note`, `.eg-article`, including hover, background images/colors and backdrop filters. Avoiding `eg-section--grafito` prevents these rules from matching; compare each available representative's computed rest/hover background image, color, backdrop filter and featured behavior inside vs outside the new shell. Verify unported legacy note/article/terminal fixtures too; their own styling must remain unchanged. Never apply a generic descendant reset to child components.
- **Preservation:** in the same fixture render an untouched legacy `.eg-section--show` and `.eg-section--grafito` with top/bottom modifiers and legacy cards; compare baseline before/after and prove their pseudo-elements and descendant overrides still work. Test the actual shipped CSS, including an independent packed consumer without Tailwind. If cascade or a host variant does not resolve the collision, stop for an approved bounded mechanism; no editing `legacy/bundle.css`.

## 7. Test-first execution

Add public-interface tests first and capture each intended RED before implementation; browser-only criteria need initial failing real-browser fixture/measurement, not a jsdom class assertion presented as visual evidence. Do not assert a complete class string.

| RED | Behavior and evidence required before GREEN |
| --- | --- |
| SS-01 | Named native section for both naming forms, host `id` and distinct `data-zone`, attributes passed, no synthesized name or extra tab stop/handler; host child focus remains functional. |
| SS-02 | Default pro and all five distinct selected recipes and foregrounds; unchanged DOM/children and no choreography. Real CSS/browser verifies paint including Show. |
| SS-03 | Wrap default/on/off, ordered children, self-wrapped child once; inspect widths at two viewport sizes. |
| SS-04 | Computed viewport min-height, token nav/top/bottom padding, centering and long-content growth at mobile/desktop; host real fixed bar and scroll offset keep anchor and focused child visible. Lab escape excluded. |
| SS-05 | Single top, bottom, both and no edge; adjacent Grafito shells have no inner seam; reduced transparency gives solid interior and approved fades. Browser verifies underlay mask does not affect content. |
| SS-06 | New root/wrap/direct children, pseudo-elements and every listed descendant collision under legacy CSS; legacy controls unchanged, including hover and featured card. Browser computed styles plus public marker DOM assertions. |
| SS-07 | Static CSS build emits every chosen arbitrary utility and variant, including media and masks; packed no-Tailwind consumer works; English real docgen, controls and stories. Assert selectors **and declarations/media context**, not presence of class text alone. |
| SS-08 | Browser measures actual text/control contrast on flood, deep and Grafito descendants and focus-ring visibility at anchor/fixed bar; record measured backgrounds and ratios, not screenshots alone. |

GREEN minimally: types/CVA → hook → JSX → local export → stories → parent integration. Add preserve tests for any existing shared code actually touched; run existing AppShell, Surface and affected card tests unchanged in addition to the new tests. No shared helper/parser change is planned; if one becomes necessary stop for scope and differential verification. REFACTOR only while focused checks remain green.

## 8. Stories, docgen and browser evidence

`Templates/SectionShell`, real `Meta<typeof SectionShell>`, autodocs, no manual `argTypes` or `play`. English `Default` supplies required children/name but does not override `register`/`wrap` defaults; examples: FiveRegisters, WithoutWrap/self-wrapped child, LongContent, NamedByHeading, NativeZone, AdjacentGrafitoGroups, SingleAndBothFades, FloodDeepContrast and HostFixedBar. Fade examples use the separately approved host mechanism, not a new prop. Apply `@control select` to `register`, `boolean` to `wrap`, `false` plus concrete reason and dedicated story to `children`; only real constants get bare `@default` tags. Native attributes are not redeclared as own props. Run real react-docgen-typescript, AST coverage, installed extraction/enhancer/inference tests with zero owned diagnostics, then exercise actual browser Controls; no unsupported adapters.

Before merge, use real compiled styles with legacy loaded and record results, captures, viewport/preferences, and per-criterion differences. Test mobile and desktop, long content, 200% zoom, reduced motion (no effective motion, not necessarily zero duration), reduced transparency, adjacent/single/dual fades, focus and contrast. Only dark is currently a token theme: test both themes **if** a supported light theme is actually present; otherwise record light as not applicable, never fabricate one. Compare VIS-01 only under equivalent conditions, record its shortened height and missing cases, and do not replace the reference. Accessibility-tree inspection is not an actual screen-reader run; explicitly report anything not exercised.

## 9. Parent integration, catalog and validation

Parent-owned future surfaces: `packages/ui/src/index.ts`, `packages/ui/src/styles/compiled.css`, `.storybook/preview.css` if needed, docgen/controls tests, `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`, registry and generated view. Add runtime/type named export and SSR checks; packed fixtures render named sections, wrap modes and all registers, include accepted native attributes and negative protected-prop typing, and exercise React 18/19 where the existing harness supports them. Verify production CSS declarations and a packed consumer importing tokens and UI styles **without a Tailwind compiler**. Do not claim React compatibility from types alone.

Catalog is **shared parent-only Unit C**: after implementation evidence, one parent updates SectionShell's existing `scripts/catalog_data.py` row to implemented v0.1, accurately noting five registers, host-owned fades and Lab exclusion, then runs `python3 scripts/build_catalog.py` once for `docs/CATALOGO.md` and `docs/catalog.json`; never hand-edit generated artifacts or parallelize shared writers. This proposed wording is not a catalog change or a new catalog decision.

Future validation, only when separately authorized: focused SectionShell and docgen/controls tests first; then parent schedules `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props` and browser checks. Record exact command output, not inferred success. Following every integration/merge compare column-0 statements with main and inspect test nesting and duplicated loops; layer (c) had structurally damaged tests despite green gates.

## 10. Work units, risks and stop

- **A — writer:** six template files and focused RED/GREEN tests, only after all implementation-blocking gates, including token availability; no shared changes.
- **B — parent:** exports, source scanning, metadata, package fixtures and naming receipt/usages; check structural integrity after merges.
- **C — parent shared catalog unit:** approved row and single generation. Host fade integration is a separately scoped host-owned unit only after its own gates; it is not silently added to SectionShell.
- **Risks:** Show and three mask tokens do not currently exist; proposed definitions need explicit token approval. Static opacity/color-mix, arbitrary variants, prefixed masks and reduced-transparency media support are unverified. Host underlay stacking, short-group overlapping mask stops, child width reset, descendant legacy selectors and real contrast can fail despite green jsdom tests. VIS-01 omits Grafito and full-height conditions. No browser, build, package, Controls, screen-reader or visual-conformity evidence is claimed by this plan.

**Stop:** Contract approval is not plan approval. Plan approval alone is not approval of recipes, token additions, naming, host fades, stylesheet roles, capture adoption or a sticky-scene API. Do not implement affected work until each applicable independent gate is resolved and its exact edit surface authorized; do not widen v0.1 to avoid an unresolved gate.
