# TopBar v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This document implements nothing and grants no source, test, registry, catalog, token, dependency, Git or remote action.
- **ODD:** `odd/tasks/web-catalog.md`, DP2 / **S3**. This is one bounded plan in the larger web catalog work, not completion of the entire S3 inventory or delivery.
- **Approved contract:** [spec.md](spec.md), issue [#292 approval comment 6597377277](https://github.com/egdev6/egdev-design-system/issues/292#issuecomment-6597377277), owner answer “Aprobar con las recomendaciones (Recomendado)”. Canonical v0.1 payload SHA-256 `12dc99c75b4b5e07e3772fd55f0c0c413339f64c6fe9ab0cd58404640fa74e82`; hash starts at the exact `## 1. Purpose and scope` heading line through EOF. The [batch-1 erratum](../../web-catalog/v0.1/layer-d-batch-1-hash-errata.md) explains the different longer-range hash in the approval; the approved content is unchanged. The spec's Proposed/Pending header is historical tracking metadata, not a cancellation of approval.
- **Plan identity:** The parent computes SHA-256 over the **entire final file's bytes**, including its final newline, and records that hash with the owner's separate plan approval, as in [layer (c) approvals](../../web-catalog/v0.1/layer-c-plan-approvals.md). Any subsequent byte change requires renewed approval; do not embed a self-hash.
- **Visual evidence:** VIS-01 `4472d21dd0d5f12375972ca309a75a0d067ce63278e6e36eb4b741e2a961f25b`; VIS-02 `dbdd553b8f813cf5792d7932ac6fb07c37031c71eb73ca4b759b2c7ac7240a7a`. Capture conditions and permitted differences are in the spec. Adoption of captures is not assumed from the contract approval. Visual conformity: **Not evaluated**.

## 1. Independent owner gates

Approval of the plan is distinct from each following gate; neither the spec approval nor this proposal closes them. Record the owner's answers and exact plan hash before implementation.

1. **G1 — Plan and future surfaces:** approve this exact plan and subsequently authorized implementation surfaces, or request changes. Recommendation: approve, contingent on G2–G4 and proof below.
2. **G2 — TopBar-local container mechanism:** approve the bounded 900px mechanism in §3, including a query container inside—not on—the fixed header, no token or dependency. Recommendation: approve the static Tailwind v4 candidate, conditional on actual emitted CSS and real-browser inclusive-boundary/containing-block proof. A failing proof stops implementation; it does not authorize a viewport breakpoint or a JS observer.
3. **G3 — Material and transparent treatment:** approve the exact existing-token overlay and transparent exception in §4. Recommendation: approve the Material overlay, solid fallback and host-owned transparent state; no Surface clone or new token.
4. **G4 — Legacy neutralization:** approve the local reset inventory and cascade proof in §5. Recommendation: approve utility-only local neutralization with distinct internal markers and no legacy stylesheet edit, conditional on real browser computed styles. If utilities cannot win in the shipped cascade, stop and seek an explicitly scoped compliant mechanism and, if needed, a meaningful stylesheet role; this plan does not preapprove one.

## 2. Future files, ownership and API

Subject to these gates and later explicit edit authorization, create the six meaningful files under `packages/ui/src/organisms/top-bar/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | `TopBarItem`, `TopBarProps`, part props, static token-backed CVA recipes and English JSDoc/Controls metadata. |
| `useTopBar.ts` | Typed event adaptation and per-part CVA calls and `cn()` composition; no scroll, resize or menu state. |
| `TopBar.tsx` | JSX-only native `header`, internal query container/row, named `nav`/list/anchors and five consumer parts. |
| `TopBar.test.tsx` | Public behavior and hook tests, TB-01–TB-09 where deterministic. |
| `TopBar.stories.tsx` | `Organisms/TopBar` autodocs and consumer composition stories. |
| `index.ts` | Named component, five parts and public types; expose variant factories only if explicitly part of the approved public surface. |

**No stylesheet** is recommended, conditional on G2/G4 proof; no extra internal module. `packages/ui/src/styles/compiled.css` currently enumerates organism `types.ts` individually, not via an organism wildcard: parent integration must add the TopBar source. Reinspect `.storybook/preview.css` and add a scoped story source only if needed; pin production and story scanning separately. Parent owns shared package exports, metadata tests, naming registry and catalog integration. Tokens, dependency manifests, lockfile, legacy bundle and other component implementations remain untouched.

Use the exact spec API: required non-empty `label`, required ordered `items: TopBarItem[]`, optional `onNavigate(item, React.MouseEvent<HTMLAnchorElement>)`, required `children`, native optional `data-state` (`transparent` or `glass`, absent means transparent), and root `className` for outer layout/stacking only. Each item has `id`, `label`, `href`, optional `aria-current: 'page'`; consumer supplies unique non-empty IDs, meaningful labels/hrefs and at most one current page. Empty items still produce a named empty desktop nav. Parts `TopBarBrand`, `TopBarSearchFull`, `TopBarSearchCompact`, `TopBarUserMenu`, `TopBarMobileTrigger` each accept children only. Brand is required and contains one named home link; each other part is optional, at most once, and contains one named launcher/control. No descendant policing, cloning, part `className`, ref, `asChild`, routing, scroll listener, inferred current page, menu state or additional public controls. The consumer owns equivalent search actions and destinations, legible transparent backdrops, and Dialog resize/focus management. Root inherits `ComponentPropsWithoutRef<'header'>` with `children`, `role`, `dangerouslySetInnerHTML` and conflicting own fields omitted; forward compatible native attributes/events without overriding semantics.

Header is the contextual banner; brand and utilities are outside a distinctly named native `nav` containing a list of ordinary anchors. Preserve Tab/Shift+Tab and Enter, native modified/middle clicks and callback event; do not add NavigationMenu, menu/tab roles, arrow-key engine or a dependency. The current link gets a visible non-color underline from `[aria-current=page]`, not a mirrored class. No unsupported promise of automatic focus relocation when resizing an open dialog.

## 3. G2 proposal — inclusive container boundary

Place an internal full-width `@container` wrapper **inside** the fixed `header`; it measures the bar's available width, not the constrained `--content-max` inner row. The actual row is a descendant with `max-w-[var(--content-max)]`, centered, `h-[var(--nav-height)]`, and `px-[var(--gutter)]`; preserve box sizing and ensure padding does not change the measured threshold. The fixed header itself is reset to `container-type: normal` and no container name. No root query containment; verify that the internal container neither changes fixed anchoring nor traps supplied portalled UI, and test transformed/containing-block host hazards separately.

Desktop is the base: nav/full search visible; compact search/mobile trigger `hidden`. For widths **below** 900px, static `@max-[900px]:hidden` on desktop branches and `@max-[900px]:block` (or the exact suitable display utility) on compact branches. Tailwind v4's max query is exclusive: add static equality variants `[@container_(width=900px)]:hidden` and `[@container_(width=900px)]:block` on those same branches so exactly 900px is compact. This preserves desktop above 900px, including fractional widths, rather than approximating with 901px or `md:`. All class strings are literal in CVA, never interpolated. An explicitly named container may replace the unnamed one only with owner approval and equivalent proof; it must not accidentally select another ancestor.

**Proof gate, not an observed result:** build using the repository's actual Tailwind v4 and theme with the TopBar source scanned. Assert in production CSS that `@container` and every `@max-[900px]:` and equality arbitrary variant actually emit, with their intended `@container` conditions and display declarations; do not accept class presence alone. Verify computed display and tab/accessibility-tree exclusion at 899, 900 and 901 CSS px, plus fractional widths immediately either side of 900, on both a wide viewport with a narrower bar and a narrow viewport. If Tailwind rejects the equality syntax or the layout cannot provide the promised independent width while fixed, stop for owner resolution rather than claim this candidate works or silently change the contract.

## 4. G3 proposal — Material, state and focus

| State | Exact intended computed treatment, from existing tokens |
| --- | --- |
| Absent / `data-state="transparent"` | transparent background, no background image, no backdrop filter, no box shadow, transparent bottom border; host provides a legible backdrop. No implicit state attribute or scroll logic. |
| `data-state="glass"` | `background: var(--color-surface-overlay)`; `backdrop-filter: blur(var(--blur-overlay)) saturate(150%)` including effective browser-prefixed behavior; 1px solid bottom hairline `var(--color-border-hairline-strong)`; `box-shadow: var(--shadow-edge-strong), var(--shadow-elev-3)`. |
| Glass + `prefers-reduced-transparency: reduce` | `background: var(--color-surface-2)` and `backdrop-filter: none`; retain the strong hairline and token edge/elevation. Transparent stays transparent. |
| Reduced motion | No effective transitions or animation on TopBar-owned elements. |

Use static `data-[state=glass]:` variants, token-backed utilities and static arbitrary properties where necessary; for example `data-[state=glass]:bg-surface-overlay`, `data-[state=glass]:border-border-hairline-strong`, `data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]`, and a static backdrop-filter utility expressing `blur(var(--blur-overlay)) saturate(150%)`. Use a static reduced-transparency media variant scoped to glass; prove the exact emitted declarations and cascade, including `-webkit-backdrop-filter` where relevant. The 150% saturation is the existing Material recipe, not a new token. No inline appearance or handwritten shadow/color/gradient. If a static utility or media variant fails to emit or win, return to the owner; do not silently add CSS. Keep the token focus ring visible on native links and supplied controls; no decorative glow as its substitute. Browser-check contrast over actual consumer backgrounds and no-filter support.

## 5. G4 proposal — legacy and UA neutralization

`packages/ui/src/styles/legacy/bundle.css:492–531` gives `.eg-topbar` fixed top/left/right, z-index 10, `container: eg-topbar/inline-size`, transparent bottom border and transition. Explicitly reset the legacy container name/type and transition locally, then explicitly set approved fixed top/inset/stacking, border and state paint; verify all computed properties rather than assuming class order wins. Root retains only `eg-topbar`; no `.is-scrolled`, `.is-open` or legacy `eg-topbar__*` on new parts. Thus legacy state background, handwritten shadow, blur and border cannot select new markup; `:1782–1783` reduced-transparency `.eg-topbar.is-scrolled/.is-open` must likewise not select it. Test glass/transparent both under reduced transparency, with shipped `@egdev/ui/styles.css` loaded.

Avoiding legacy part markers also avoids `__in` height/gap/margins/padding, `__links` flex/gap/margin, `__link` typography/hover/focus/underline `::after`, `__tools`, search/menu display rules, drawer and the named legacy container query. Check actual computed `::before`/`::after`, hover, focus, transition and display, not just selector absence. Reset UA list `margin`, `padding`, `list-style`, anchor text decoration and typography as required by the approved recipe, using token utilities; inspect box-sizing and focus styles with and without Tailwind preflight. Distinct internal markers are not public part-selector APIs.

The legacy CSS may be unlayered while generated utilities are layered: higher specificity or class-string ordering does not by itself solve cascade precedence. Demonstrate the actual shipped import order/layers and computed result in a packed consumer. If static utilities cannot neutralize root `container`, border, position or transition in that cascade, G4 proof fails and work stops for a separately approved solution; never edit the legacy stylesheet or add `!important` as a workaround.

## 6. RED → GREEN → preserve

All tests below are future work, not observed results. Write deterministic public-interface tests first and record the intended RED for **each** TB criterion before implementing; for browser-only style/geometry requirements create the failing built-CSS/browser assertion before the fix, not a jsdom substitute. Where the build cannot run before a module exists, use the smallest failing test scaffold and explicitly record the observed failure. Then implement the minimum, rerun focused tests GREEN, and refactor only while green.

| RED | Observable assertion and follow-up |
| --- | --- |
| TB-01 | Named banner/nav/list and ordered links, empty items, only host-marked `aria-current`, native attributes, no nested landmark. |
| TB-02 | Click and Enter call with item/event; preventDefault works; rerender changes current without moving focus; browser verifies native modified/middle clicks. |
| TB-03 | Absent/transparent and host-switched glass, no scroll listener; emitted CSS and browser verify paint, reduced transparency and reduced motion. |
| TB-04 | All five supplied parts in intended order, optional absence leaves no placeholder; browser proves only active branch is visible and tabbable. |
| TB-05 | Production CSS conditions and browser at 899/900/901 plus fractional values, independent viewport/container widths, no overflow and 200%/400% zoom. |
| TB-06 | Composed Dialog and Menu accessible names, portal, Escape/focus behavior and resize caveat; exercise real browser, not a fabricated TopBar state engine. |
| TB-07 | Fixed geometry while scrolling, one host clearance, focus visibility, legacy and UA computed-style resets with shipped CSS. |
| TB-08 | Stable root, supported layout-only merge, no legacy state/part markers or unsupported part overrides; types reject unsupported APIs. |
| TB-09 | Real docgen requiredness, native props and metadata, zero owned diagnostics; emitted CSS for every static CVA arbitrary/variant utility; packed React 18/19 consumer without Tailwind and actual browser Controls. |

**PRESERVE:** do not change existing Dialog, Menu, Logo, SearchTrigger, shared helpers or legacy. Run their focused existing tests when authorized, and verify package exports and shared scanning retain existing behavior. If implementation changes shared parsers/helpers used by unrelated commands/components, compare previous and changed behavior for each affected sibling through its public interface; unexpected differences are regressions. Parent must structurally compare every column-0 statement in shared test/export files against main after merges, catching nesting, duplicates and accidental deletion even when suites pass. Capture CSS/browser findings RED before local fixes, as layer (c) required for NowCard and ArticleFeature; test geometry after reset, as CommunityCard's unpinned action showed.

## 7. Stories, Controls and naming

Use `Meta<typeof TopBar>`, `StoryObj`, autodocs, English copy, no manual `argTypes`, `play` or renderer adapter. Stories: `Default`, `CurrentPage`, `Glass`, `Compact`, `ComposedControls`, `MobileDialog`, `UserMenu`, `LongLabels`, and a width fixture for boundary checks. Default provides required example args without inventing a state default. `MobileDialog` composes the existing public Dialog/trigger/portal recipe externally; `UserMenu` composes the existing public Menu recipe externally. Neither becomes a new MobileMenu or UserMenu export. Confirm actual current APIs before writing examples. The host explicitly sets glass while its dialog is open and documents handling resize while focus/trigger is hidden.

`label` uses `@control text`; structured `items`, `onNavigate` and ReactNode `children` use `@control false` with concrete reasons and story references; document each own field/part declaration and applicable defaults without fabricated values. Native `data-state` stays native, not a redeclared own control. Verify real `react-docgen-typescript` output, installed extraction/enhancer/inference and zero owned diagnostics, then actual browser widgets; metadata alone is not proof.

Before implementation recheck `skills/_shared/prop-naming.json` and `docs/prop-naming.md` by meaning/name/alias: `label` → `accessible-name`, `items` → `collection-items`, `onNavigate` → `navigation-intent`; structural/native fields need no new convention. Parent appends applicable usages only after reviewing the real symbol and whole-file source SHA-256, regenerates the reference and runs `pnpm props:check` / `pnpm test:props` when authorized. No new convention or exception is implied by this plan or spec approval.

## 8. Parent integration, package and catalog

Parent integrates `packages/ui/src/index.ts`, the production scan in `packages/ui/src/styles/compiled.css`, any necessary scoped Storybook scan, metadata tests and `scripts/package-exports.test.mjs` / `scripts/package-consumption.test.mjs`. Assert named runtime and type exports, no private hook/unsupported props, SSR/hydration and real packed consumption with React 18 and 19 and **no consumer Tailwind compiler**. Assert all actual CVA utilities and each arbitrary/state/media/container variant in the emitted production CSS, not merely source strings; preserve unrelated entries. Builds, commands and broad suites require explicit authorization in the future implementation transaction.

**Catalog is parent-only:** update the TopBar row in `scripts/catalog_data.py` to reflect the approved flat native-link basis instead of provisional NavigationMenu, consumer-supplied brand/search/user/mobile compositions, fixed header and implemented status only once delivered. Parent regenerates `docs/CATALOGO.md` and `docs/catalog.json` with the existing generator, never hand-edits generated files. No MobileMenu/UserMenu exports or dependency are implied. Coordinate shared catalog updates with a single writer.

## 9. Browser and visual acceptance

In Storybook and a packed consumer loading shipped styles and tokens, record browser/version, viewport and container widths, theme, media settings and actual measured computed values:

- 899/900/901 and adjacent fractional container widths, wide and narrow hosts; correct branch display and no hidden tab stops, no overflow, long/localized labels and 200%/400% zoom.
- Default, explicit transparent and glass; compare computed background, border, both backdrop filters, shadow and pseudo-elements with/without reduced transparency and reduced motion. Verify no effective transition and no legacy paint. Check support/fallback and contrast on representative real host backgrounds.
- Fixed viewport-top geometry on scroll, stacking, root containment and portal placement; host reserves `--nav-height` **exactly once** and content/focus are not obscured. Examine ancestor transforms/containment and report unsupported host conditions.
- Keyboard Tab/Shift+Tab, Enter, visible focus, native link behavior and current underline; Dialog and Menu keyboard/Escape/portal/focus and host-managed resize caveat; named landmark, coarse pointer target and assistive-technology checks separately.
- Compare only surviving written intent to VIS-01/02 under equivalent recorded capture conditions. Distinguish Material overlay from Foundation's historical 55% glass and consumer-owned compositions; never overwrite the references. Screen-reader, native zoom or capture adoption is **Not evaluated** unless actually performed.

## 10. Bounded work units and stop line

- **A — Component writer:** six files, test-first behavior, focused GREEN; no shared integration or legacy edits.
- **B — Parent integration:** scan, exports, metadata, package/consumer fixtures and naming usages; production build and focused checks before parent-authorized broad gates. Verify merge structure against main.
- **C — Parent catalog:** one shared row update and generated artifacts through the existing generator, coordinated with other batch work.
- **D — Parent browser/evidence:** computed-style, container, keyboard, fixed-position, visual and accessibility checks above; record actual results and unresolved limitations.

Risks: unproven inclusive Tailwind container syntax and fixed-root geometry; unlayered legacy rules defeating utility resets; unavailable reduced-transparency emulation or prefixed backdrop support; host-owned transparent contrast, long localization and resize focus; static captures do not prove interaction; current source and APIs may drift before implementation. Stop for a separate owner decision if any gate, token, dependency, CSS emission, cascade or contract assumption fails. No implementation or claim of conformity follows from this document.
