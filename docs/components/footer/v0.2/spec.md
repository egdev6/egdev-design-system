# Component contract — Footer

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval (G4). No implementation is authorized by this draft.
- **Approval / recovery:** Pending. G1 approval of the exact A6 proposal and G4 approval of this component snapshot precede U6; the implementation plan also needs its separate exact approval. No additional Footer-specific gate is proposed.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending`; `visualHashes: VIS-01 Pending, VIS-02 Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/293`; `latestPublishedComment: Pending` for this snapshot. Finalize before publication or approval.
- **Hash definition:** SHA-256 of UTF-8 LF bytes from the exact heading line `## 1. Purpose and scope` through EOF including the final LF; metadata above that heading is excluded.
- **Prior contract:** [v0.1 spec](../v0.1/spec.md), [approval and hash erratum](../../web-catalog/v0.1/layer-d-batch-1-hash-errata.md), [plan](../v0.1/implementation-plan.md), and [navigation target amendment](../v0.1/link-target-amendment.md). The historical Proposed header is not the later approval record. The owner approved v0.1 with recommendations in [#293 comment 6597377760](https://github.com/egdev6/egdev-design-system/issues/293#issuecomment-6597377760); the erratum distinguishes the canonical payload from the longer pinned range. Old visual adoption was not established.
- **Owner request S6:** “Footer -> cuidar los espacios entre items y tamaños de fuente [Image#15]”. [A6](../../web-catalog/v0.2/visual-amendments.md#a6-footer--one-vertical-rhythm-and-one-heading-recipe) and [U6](../../web-catalog/v0.2/implementation-plan.md#u6--footer-rhythm-and-exported-heading-recipe-a6) are proposals, not evidence of implementation or approval.

## 1. Purpose and scope

A passive site-footer organism in `@egdev/ui` coordinates a motto, brand and tagline, section navigation, social links and legal content. All copy, destinations, logo, language and year belong to the consumer. No router, fetching, analytics, sticky behavior, 3D, particles, large CTA, scroll observer, SectionNav visibility control or choreography. The host owns placement, background and fade.

**Decision:** reuse the existing compound Footer and its existing heading recipe; do not create a new part, variant or component. Logo, SocialLinks and Link alone lack the region's hierarchy; app-only composition repeats it. The existing organism already addresses that responsibility. Source evidence: `packages/ui/src/organisms/footer/{types.ts,useFooter.ts,Footer.tsx,index.ts,Footer.test.tsx,Footer.stories.tsx}` and `packages/ui/src/index.ts` export six Footer components and their types; the heading recipe is currently internal. This source evidence supersedes v0.1's historical pre-implementation availability statements, not its promises.

**Exact proposed delta from effective v0.1:** replace grid `gap-10` by `gap-x-10 gap-y-8`; motto `pt-12 pb-10` by `pt-10 pb-8`; legal `mt-12 pt-5` by `mt-10 pt-4`; heading `mb-4` by `mb-3`. Export the existing `footerHeadingVariants()` through the Footer barrel and public package barrel; consumer group headings, including the social heading in the story, use it. Document the consumer tagline as `text-body-default text-fg-secondary`. No prop, structural, target-size or breakpoint change. All other effective v0.1 promises, including its link-target amendment, remain in force; the frozen documents remain authoritative for their unchanged detail.

## 2. Anatomy and composition

| Part | Element / responsibility | Content |
| --- | --- | --- |
| Footer | native `footer`; partitions children into motto, grid, legal | Optional named parts, each at most once, in documented order |
| FooterMotto | `div`, `eg-footer__stage` | One non-interactive consumer `Text` element |
| FooterBrand | `div`, `footer-brand` in grid | Named brand or link and optional tagline, no nested anchors |
| FooterNavigation | `nav`, visible heading, `ul`, `li`, `Link` anchors | Consumer-labelled ordered section destinations |
| FooterSocial | `div` in grid | Consumer heading and named SocialLinks list |
| FooterLegal | `div`, `eg-footer__legal` | Consumer legal text and optional links |

Absent regions have no empty wrapper; the grid is absent when empty. `eg-footer`, `eg-footer__stage`, `eg-footer__grid`, and `eg-footer__legal` remain stable markers. The host supplies children; no placeholder or implicit content is added. Native landmarks and links require no Radix primitive here; supplied Link retains its own implementation. No `asChild` on Footer.

## 3. Public API

| Prop / export | Type | Required | Rule |
| --- | --- | --- | --- |
| `Footer.children` | `ReactNode` | yes | Optional named parts, each at most once in order |
| `FooterMotto.children` | `ReactElement` | yes | One non-interactive Text; consumer owns accent and context |
| `FooterBrand.children` | `ReactNode` | yes | Named brand and optional tagline |
| `FooterNavigation.label` | `string` | yes | Visible, nonblank navigation name; blank omits group |
| `FooterNavigation.level` | `2 \| 3 \| 4 \| 5 \| 6` | no | Default `2`; host chooses appropriate outline rank |
| `FooterNavigation.items` | `{ href: string; label: string }[]` | yes | Ordered destinations; omit invalid entries and omit group if none remain |
| `FooterSocial.children` | `ReactNode` | yes | Heading and explicitly named SocialLinks; use `caption={null}` |
| `FooterLegal.children` | `ReactNode` | yes | Legal content, naturally wrapping |
| `footerHeadingVariants()` | existing CVA recipe | n/a | Proposed additive public export, no new heading component |

A valid item has a nonempty string `href` and a nonblank string `label`; valid values and order are preserved exactly, with no deduplication, URL rewriting, interception or automatic new tab. Native root props are `ComponentPropsWithoutRef<'footer'>` except `children`, `dangerouslySetInnerHTML`, `role`, `style`, `tabIndex`; compatible `id`, `data-*` and accessible name are forwarded. The runtime also strips ref and `asChild`. Other parts inherit compatible `div` props excluding children and dangerous HTML; navigation inherits compatible `nav` props excluding children, dangerous HTML and accessible-name overrides, and runtime strips role. No ref forwarding or controlled/uncontrolled state is promised.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md), by meaning, name and aliases: existing approved `collection-items` → `FooterNavigation.items`, `accessible-name` → `FooterNavigation.label` and item label, `heading-level` → `FooterNavigation.level`. The three navigation usages are registered. Reviewed source: `packages/ui/src/organisms/footer/types.ts`, `FooterNavigationProps` and `FooterNavigationItem`, whole-file `sha256:929a83a45117bff7c7737855adc8c9cff128b2560b0fb859ac967169ce455118`. Item `href` is native destination; children and className are composition/native. No new or changed own prop, naming proposal or exception; exporting a recipe does not create a prop convention. Convention and spec approvals remain distinct.

## 4. Behavior

| Given / action | Expected result | Event |
| --- | --- | --- |
| Parts supplied or absent | Documented order, no built-in content, no absent wrapper | None |
| Blank nav label, empty or all-invalid items | No nav, heading or otherwise empty grid for that part | None |
| Mixed valid and invalid items | Only valid entries in original order and with exact destinations | None |
| Activate a link | Native navigation; host owns router interception | Native event only |
| Social data invalid | SocialLinks applies its own validation; host avoids orphan heading | None |
| Long content or narrow viewport | Wrap without clipping or visual reordering | None |
| Footer enters view | No own observer, navigation state or visibility action | None |

The three-column grid becomes two equal columns at **inclusive** `width <= 860px`; brand spans both only when present. At 861px it is three columns. No auto backdrop or heading-level detection, own loading, selection or announcements. SocialLinks retains its own validation, external-link and focus contracts.

## 5. Accessibility

A native footer exposes `contentinfo` when outside `main` and sectioning content; the host owns correct placement. Each nav is named by its visible heading via per-instance `useId()` and `aria-labelledby`; no duplicate or unnamed nav is introduced. SocialLinks supplies a separately named list, not a second nav. Consumers name brand/social/legal links, avoid nested anchors, and own their target sizes and contrast. Footer-owned navigation Link anchors alone have the approved local `min-h-14 min-w-14 inline-flex items-center justify-start` exception: 44.8 × 44.8px minimum, no arrow. Consumer-supplied brand, social and legal links are not guaranteed by Footer; demonstrate accessible targets and contrast in stories. Native Tab and Enter and visible focus are owned by links; no footer tab stop or keyboard model. No live announcement applies. Test unique IDs, keyboard order, landmarks, contrast and reduced motion; no screen-reader or visual-conformity claim is inferred from DOM tests.

## 6. Appearance

| Axis | Values / rule |
| --- | --- |
| Responsive layout | Three minmax tracks `1.4fr 1fr 1fr` above 860px; two equal tracks at `width <= 860px`, brand spans both |
| Variants / size / state | No public variant or size axis; native link states remain with Link |

**Proposed A6 values:** grid `gap-x-10` 32px and `gap-y-8` 25.6px; motto `pt-10 pb-8` 32/25.6px; legal `mt-10 pt-4` 32/12.8px, retain `gap-4`; heading `mb-3` 9.6px, retaining `m-0 font-display text-label-eyebrow text-fg-secondary uppercase wrap-anywhere` (eyebrow 11.2px). Social/group headings use this same exported recipe; tagline uses `text-body-default text-fg-secondary`. Legal retains `text-body-default text-fg-muted`, not the heading typography: one documented spacing rhythm does not mean identical legal and heading font. No new token or dependency.

**Material:** preserve host-owned Grafito background/fade; Footer paints no background, gradient or shadow. Root top/bottom, grid top and legal top use existing token-width solid hairlines (`--border-width`, `border-*-border-hairline`), conditional with their regions. This is the Footer-specific boundary, not a general Gauge or Surface exception. Preserve `pt-10` grid top padding, focus and reduced-motion behavior of supplied children. Static CVA and token utilities only; no inline appearance or dynamic geometry.

**Class composition:** root and all five parts accept `className` for outer placement, margin and sizing only, not appearance or internal layout. Each uses `cn(recipe, className)`; recognized conflicts can merge, but `twMerge` does not override every CSS selector, layer or variant and no universal last-class-wins guarantee exists. The exported heading recipe is for consumer-owned heading composition, not blanket appearance override. Preserve the inclusive legacy first-child reset and actual brand-only span. Verify the effective cascade against retained legacy selectors and all properties inventoried in the v0.1 plan, with legacy CSS loaded at both sides of the breakpoint; do not alter legacy consumers or assume string order wins.

**Files:** `types.ts` owns props and recipes; `useFooter.ts` validation, IDs and composition; `Footer.tsx` JSX; `Footer.test.tsx` tests; `Footer.stories.tsx` examples; `index.ts` exports. **No stylesheet**; no additional internal module. The future implementation must verify static utility emission and packed CSS without consumer Tailwind. If the existing utility-only cascade cannot satisfy this contract, stop and return concrete options rather than silently changing legacy CSS or inventing a stylesheet.

### Expected-design visual reference

| ID | Image / scenario | Provenance and status |
| --- | --- | --- |
| VIS-01 | Pending real component-zone capture: default desktop, motto, brand, navigation, social and legal | Expected-design source and conditions to be agreed; no v0.2 image, hash or approval |
| VIS-02 | Pending real component-zone capture: narrow layout with wrapping | Same; no v0.2 image, hash or approval |

Owner Image#15 is conversation provenance only: file, hash, viewport, theme and capture metadata are unavailable here. The historical [v0.1 references](../v0.1/spec.md#expected-design-visual-references) are source captures, not adopted v0.2 expected design. Their original hashes and conditions remain in v0.1; do not copy or relabel them as current approval. Agree source/story and capture conditions (browser/version, viewport, DPR, theme, fonts, motion/transparency, crop and date), then use the [capture guide](../../../design/README.md): authorized read-only preview, real browser component-zone PNG, `capture.json`, hashes and explicit human adoption. Capture is not authorized in this task. **Visual conformity: Not evaluated.**

**Pending owner decision:** approve the exact v0.2 snapshot and its identified visuals when available (G4), or request a specific revision; A6 remains subject to G1. The real expected-design source and capture conditions need agreement; alternatively the owner may supply a recoverable reference with the required provenance. No invented capture, visual observation or approval substitutes for either choice.

## 7. Acceptance criteria

All checks are planned, not observed. Existing FT-01–FT-10 remain applicable as detailed in [v0.1](../v0.1/spec.md#7-acceptance-criteria) and its target amendment.

| ID | Promise | Planned test / method | Story / visual | Evidence |
| --- | --- | --- | --- | --- |
| FT-01/02 | Parts, omission, native site/nested landmarks and no domain defaults | Render/role and DOM tests | Default, Minimal, Landmark | Pending |
| FT-03 | Named nav, ranks, unique IDs, ordered valid values and omission of invalid input | Render and keyboard tests, multiple instances | Empty, Invalid | Pending |
| FT-04/05 | Named brand/social composition, no nested anchors, delegated behavior, no orchestration or own tab stop | Integration, role and native activation tests | Social, HostComposition | Pending |
| FT-06 / A6-AC1 | Inclusive two/three-column split, brand present/absent, new x/y gaps at 390, 859, 860, 861 and 1280px | Packed own-element computed-grid/gap and overflow checks with legacy CSS | Responsive; VIS-01/02 | Pending |
| FT-07 | Token hairlines, legacy neutralization and unchanged legacy consumers | Computed-property and cascade checks, emitted `dist/styles.css` rules | VIS-01/02 after adoption | Pending |
| FT-08 / A6-AC3 | Footer nav targets ≥44px in both dimensions; focus, contrast and consumer-owned links respect responsibilities | Browser rectangles, focus, contrast, keyboard and reduced-motion checks | Focus | Pending |
| FT-09/10 | Native forwarding, per-part layout-only merge, no ref/asChild, file/docgen and package contracts | Type/render/merge tests, CSS build and React 18/19 packed consumption | Composition | Pending |
| A6-AC2 | Exported recipe is publicly importable; nav and consumer social headings use `mb-3`, legal row uses `mt-10 pt-4`, tagline uses documented typography | Public-barrel and story assertions; own-element computed typography/spacing; compare sibling barrel exports base/current per U6 | Default, Social; VIS-01/02 | Pending |
| A6-AC4 | Long legal text wraps without overlap | Browser overflow and bounding-rectangle checks at narrow and wide widths | Responsive with long legal content; VIS-02 | Pending |
| A6-preserve | All unchanged v0.1 brand/legal/social structure, navigation behavior and target exception survive | Focused public behavior preservation tests; browser comparison | Default, Invalid, Focus | Pending |

**Closure:** G1 and exact G4 approval, recoverable finalized payload identity and approved visual references are pending. Capture and publication are separate actions. The plan requires separate approval; this draft authorizes no code, token, dependency, registry or remote changes.
