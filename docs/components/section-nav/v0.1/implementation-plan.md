# SectionNav v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This document implements and authorizes no source, test, token, dependency, registry, catalog, Git or remote action.
- **Coverage:** DP5, **S3**, bounded to SectionNav; not completion of the web inventory. [Approved v0.1 contract](spec.md), issue [#301, approval 6597832507](https://github.com/egdev6/egdev-design-system/issues/301#issuecomment-6597832507), owner answer “Aprobar con las recomendaciones (Recomendado)”. Canonical payload SHA-256 `a5eae79bf4d1a5090f814bb9c8a407e5c2d91785a2c92e7058d80679cd20d8ca`, exact whole heading line `## 1. Purpose and scope` through EOF. Proposed/Pending spec header is historical tracking metadata.
- **Plan identity:** Parent hashes the entire final file bytes including final newline and records the owner's separate decision in [layer-d-plan-approvals.md](../../web-catalog/v0.1/layer-d-plan-approvals.md); no self-hash. Any later byte change requires renewed approval. Plan approval and the gates below are independent.
- **Prerequisite:** Pixel #300 must be delivered first under its separately approved contract and plan. Depend only on its decorative `state: 'idle' | 'past' | 'active'` and `aria-hidden` behavior; verify the delivered public API before coding, never assume implementation details from its parallel plan.
- **Visual references:** VIS-01 `dd1f700ace732dba694fb645815b647bdada135b3a7902c64d2db86959492214`, VIS-02 `9155ebdfb04d3dbdda9e5ff80fca20dd21110f32d6b29018ff3ca2225624e12b`; conditions in [spec.md](spec.md). Reference adoption is not assumed; ask separately to adopt surviving intent with explicit disclosure/next and Material differences. Visual conformity: **Not evaluated**.

## 1. Independent owner gates

1. **Popover protocol.** Recommend the installed public Popover, non-modal, contingent on the proof in §3. Accept its named dialog and cyclic Tab explicitly. If native anchor navigation, portal/landmark structure, hide, focus return or dismissal cannot satisfy the contract using its supported API, stop; do not patch Popover, invent a focus engine, introduce NavigationMenu or add a dependency without separate owner decisions.
2. **Local breakpoint.** Recommend SectionNav-only inclusive viewport `width <= 520px`, using the exact static media variants in §5; no token or shared breakpoint. Verify production emission and Chromium at 519/520/521 and fractional neighbors. Failure stops work, not an excuse for an exclusive `max-[520px]:` or `md:` substitute.
3. **Overlay.** Recommend the exact pill and list recipe in §5, including solid reduced-transparency and unsupported-filter fallback. Reuse Surface and Popover's existing Surface once each, no double overlay, no token or dependency changes. Proof of actual output and cascade is required.
4. **Naming and localized names.** Recommend the exact proposed `active-section-id` entry in §4, separately approved, and the proposed required `disclosureLabel` and `nextLabel` control-name inputs, each a non-empty localized string; `label` also names the portalled dialog and its single index nav, while the root nav uses `label`. The next label must identify its destination and be updated by the host when activeId changes. These two differentiated accessible-name usages require a scoped naming decision; do not silently invent globally approved aliases. If identical landmark names or the name API fails the §3 proof, stop for owner resolution, not an inferred alternative. Existing registry mappings remain separately reviewed.
5. **Catalog composition.** Recommend the exact replacement row in §8, after delivery and separate authorization; it corrects Link-only composition without claiming NavList/MenuList can express this index unchanged. No catalog edit now.
6. **Legacy inventory.** Recommend local utility neutralization and distinct internal markers in §6, preserving all legacy consumers. Require real Chromium computed-style proof with shipped CSS. If utilities cannot win, stop for a specifically approved compliant mechanism and meaningful stylesheet role; no `!important`, legacy edits or dummy CSS.

## 2. Contract and future files

Host supplies required `label`, `items: { id: string; label: string; href: string }[]`, `activeId: string`, `value: number`, localized control labels, and optional `hidden`, `onNavigate(item, event)`, `open`, `defaultOpen`, `onOpenChange` and root placement-only `className`. Item IDs are stable, unique, nonempty; names and same-document hrefs are consumer-localized and valid. No validation policy beyond the approved contract is invented. Empty items render no controls; unmatched activeId has no current marker or next link. With a match, ordered links have exactly one `aria-current="location"`; previous markers are past, current active, later idle. Next selects the following href, wrapping last to first. Callback receives the original mouse event; native navigation, `preventDefault`, modified and middle clicks remain intact.

Disclosure is an actual click/keyboard button; next is a separate native anchor, never nested. Host supplies current/progress/hidden, equivalent progress text, target existence and safe focus destination before hiding. Use `ProgressBar size="sm" edge` without a label, with its own normalization (finite clamp 0–100, non-finite indeterminate); clip it in the positioned pill, not the root. No scroll, resize, global key or shortcut listeners, hover timer, automatic smooth scroll, router, live announcement, public ref or `asChild`. Do not change controlled/uncontrolled mode mounted. On hide force the visible panel unmounted even if a controlled host has not yet acknowledged its close request; request close, never synthesize an open-state acknowledgement. Host must relocate focus first.

Subject to all gates and later edit authorization, six meaningful files under `packages/ui/src/organisms/section-nav/`: `types.ts` (types, static per-part CVA and English JSDoc), `useSectionNav.ts` (derivation, Radix event adaptation, per-part `cn()`), `SectionNav.tsx` (JSX), `SectionNav.test.tsx`, `SectionNav.stories.tsx`, `index.ts`. No extra module. **No stylesheet**, conditional on emission and legacy proof. Root native inheritance uses `ComponentPropsWithoutRef<'nav'>` omitting children, role, conflicting naming and dangerous HTML; forward compatible native attributes without overriding owned semantics. `className` is outer placement only; `cn()` is not universal cascade precedence. No new part-selector API.

## 3. G1 — proof protocol before implementation adoption

Build a narrow fixture with the delivered public `Popover`, `PopoverTrigger` and `PopoverContent`, actual Pixel once delivered, native section anchors, and shipped CSS. Source evidence: `PopoverContent` portals internally and composes `Surface tone="overlay"`; its public content props inherit native div handlers but protect id/role/naming. Existing Popover tests demonstrate a named portal, Escape restoration, controlled requests and non-modal Tab cycling in jsdom, not this composition or real browser acceptance.

Candidate: root named nav contains pill controls and next anchor; the portalled named dialog contains one named nav and ordered list of links. Verify in the accessibility tree that both landmarks are meaningful and distinguishable, not nested or an empty duplicate in empty/unmatched/closed/open states. Since the portal breaks DOM ancestry, prove how naming stays unambiguous; if this candidate creates an empty or indistinguishable landmark, stop for an owner-approved structure/name resolution rather than hiding an interactive region from AT. A dialog name is required, not a menu role.

In real Chromium and, separately, real screen-reader sessions: open by click, Enter and Space; check `aria-expanded`, `aria-controls`, portal and named dialog; Tab and Shift+Tab cycle as documented; Escape restores the visible trigger; outside pointer/focus follows Radix. Activate a same-document link via click and keyboard, including modified/middle click and a consumer-prevented event: record callback, URL, target focus and closure, ensure no forced trigger return overwrites destination focus. Test the supported `onCloseAutoFocus` event only if necessary and only for actual navigation; do not suppress Escape focus restoration or steal focus after outside interaction. Verify controlled host acknowledgement, rejection/delay and native hidden while open, including focus moved by host before hiding. Compare accessibility tree and actual announced landmark/dialog names. If this cannot be done with the public Popover and Radix events, stop; no bespoke keyboard or focus management. AT availability limits are reported, never treated as passed.

## 4. G4 — exact naming proposal

```json
{
  "id": "active-section-id",
  "name": "activeId",
  "meaning": "The host-designated identity of the current section in an ordered section navigation.",
  "whenToUse": "Identify the current section by its consumer-supplied stable item id.",
  "avoid": "Do not use for a data-table active row, progress value, inferred scroll position or generic selection.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": []
}
```

Recommend `label` → `accessible-name`, `items` → `collection-items`, `value` → `primary-value`, `onNavigate` → `navigation-intent`, `open` → `open-state`, `defaultOpen` → `initial-uncontrolled-open`, `onOpenChange` → `open-change`; `hidden` is native. `disclosureLabel` and `nextLabel` are scoped alternative names for `accessible-name`, not new global conventions: recommend separate exceptions for `SectionNav` with those exact prop names because a single `label` cannot name three different controls. Approve their exact reason and scope separately under the registry workflow; if unsupported or rejected, stop for a selected naming resolution. No registry promotion follows from #301. Parent inspects final `SectionNavProps` and `SectionNavItem`, records real source symbol and whole-file SHA-256 for usages, records separate convention/exception receipts, regenerates with `pnpm props:docs`, then runs `pnpm props:check` and `pnpm test:props` when authorized. No source hash is invented here.

## 5. G2–G3 — material, breakpoint and emission inventory

Pill uses one Surface overlay, full radius, no nested overlay: `--color-surface-overlay`, blur `--blur-overlay` plus saturation 150%, solid strong hairline `--color-border-hairline-strong`, shadow `--shadow-edge-strong, --shadow-elev-3`. Index uses the existing PopoverContent's Surface overlay, `padding="md"`, `radius="xl"`; do not wrap another Surface. In reduced transparency use solid `--color-surface-2` and no backdrop filter; unsupported backdrop filters use the same solid fallback. Retain border and shadows. No inline appearance, handwritten color/gradient/shadow or new token. Ensure own 44px minimum hit rectangles on coarse pointers and no overflow with long localized names. Focus uses existing focus token, never glow alone. Reduced motion removes effective transition/transform on owned controls and panel.

Use token-sized baseline pill and compact token-sized pill; historical 52px/46px are reference dimensions, not permission for hardcoded appearance values. Verify that chosen existing tokens meet visible intent and 44px targets; if not, stop for explicit owner resolution rather than introduce dimensions. Fixed bottom/right safe-area placement must use existing tokens and static CSS utilities; host stacking and obstructed focus are verified, not assumed.

**Exhaustive candidate arbitrary/variant utilities for this plan**, literal source strings, each to be proven with actual compiled selectors, declarations and media context before approval and again in production source scanning:

- `[@media(width<=520px)]:h-12`, `[@media(width<=520px)]:px-3` (compact pill); base `h-14` / token-based horizontal spacing. Verify actual token values and chosen visible geometry.
- `right-[calc(var(--space-6)+env(safe-area-inset-right,0px))]`, `bottom-[calc(var(--space-6)+env(safe-area-inset-bottom,0px))]`.
- `before:content-none`, `motion-reduce:transition-none`, `motion-reduce:transform-none`, `focus-visible:shadow-[var(--shadow-focus)]`, `aria-[current=location]:underline`. Recommend no state variant for SectionNav itself: Radix owns state.
- Surface overlay utilities used by pill and existing Popover: `shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]`, `[@media(prefers-reduced-transparency:reduce)]:bg-surface-2`, `[@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none`, `not-supports-[backdrop-filter]:bg-surface-2`.
- If reused production Popover classes are relied on, also prove `w-[calc(var(--space-24)*4)]`, `max-w-[var(--radix-popover-content-available-width)]`, `max-h-[var(--radix-popover-content-available-height)]`, `duration-[var(--duration-fast)]`, `ease-[var(--ease-out)]`, `data-[state=open]:starting:opacity-0`, `motion-reduce:transition-none`, `focus-visible:outline-2`, `focus-visible:outline-focus-ring`, `focus-visible:outline-offset-2`; Trigger uses `min-w-[var(--space-10)]`, `min-h-[var(--space-10)]`, `pointer-coarse:min-w-[var(--space-12)]`, `pointer-coarse:min-h-[var(--space-12)]`, `focus-visible:outline-none`, `focus-visible:shadow-[var(--shadow-focus)]`, `disabled:opacity-45`, `disabled:pointer-events-none`.

Parent's installed-compiler probe (task handoff and [layer-d approval record](../../web-catalog/v0.1/layer-d-plan-approvals.md)) established `md:` emits nothing, `max-[X]:` is exclusive (`width < X`), while `data-[state=…]:`, `bg-surface-overlay`, `border-border-hairline-strong` and `[@media(prefers-reduced-transparency:reduce)]:bg-surface-2` emit. These facts do not prove every concrete candidate, cascade, media behavior or consumer build. Do not add any further arbitrary or variant utility without listing and proving it before approval. Check static Surface classes `backdrop-blur-overlay`, `backdrop-saturate-150` and both standard and prefixed computed backdrop filters, plus unsupported-filter fallback.

## 6. G6 — legacy and cascade inventory

`packages/ui/src/styles/legacy/bundle.css:557–637`: root sets fixed position, z-index 9, right/bottom with safe-area insets, flex column/end alignment, 10px gap and opacity/transform transition. Explicitly own fixed placement, stacking, display, alignment, gap and no unintended transition; neutralize `::before` content/absolute bridge. Do not emit `is-away` or `is-open`; thus old opacity, translate, pointer suppression and open selectors do not apply. Explicitly verify native `hidden` wins against legacy `display:flex`, including the closed and controlled-open panel; stop if it does not.

Avoid all legacy `eg-section-nav__*` parts: `__pop` delayed opacity/visibility/transform and `:has` hover/focus rules; `__btn` height, paint, border, blur, shadow, overflow and hover/open glow; `__cur`, `__num`, `__sep`, `__mask`, `__name`, `__next`, icon rotations/hover and old focus styling. Avoid `is-hover`, `is-leaving`, `is-entering`, `is-up`. Thus the inclusive legacy 520px root 14px offsets and old part sizes do not govern new parts; explicitly replace root offsets at that width. Later `:1758` number override and `:1783` reduced-transparency `__btn` override must not match. Reduced-motion legacy root rule includes `!important`: check computed motion without changing it. Reset UA list styles as needed, and check Pixel, Icon, ProgressBar and Popover's own legacy markers/cascade separately.

Verify actual layers and selector specificity in built package and packed consumer, not class-string ordering or `twMerge`. Compare root position, offsets, z-index, display, gap, transition, transform, opacity, pointer events; `::before` content/geometry; panel positioning, visibility, shadow, border, backdrop and fallback at rest/open/hover/focus, both media settings, and all breakpoint boundaries. Render a separate unchanged legacy fixture and compare its original hover bridge, parts and reduced-transparency behavior. If a scoped reset cannot win, stop rather than alter shared legacy or add unsupported CSS.

## 7. RED → GREEN, preserve and evidence

Future implementation only: write public behavior tests first; capture each intended RED before minimal implementation and focused GREEN. Browser-only paint, hit geometry, focus and portal checks require a failing real built-CSS fixture or explicitly documented no-meaningful-RED exception, never a jsdom appearance claim.

| Criterion | Observable checks |
| --- | --- |
| SN-01 | Named landmarks, ordered native links, active first/middle/last, exactly one `location`, Pixel past/active/idle and decorative, non-color text/number cue, empty and unmatched. |
| SN-02 | Click/Enter/Space disclosure, owned relationships, named portalled dialog, cyclic Tab, Escape/focus, outside interaction and anchor focus/close per §3. |
| SN-03 | Next and last-to-first wrap; original event, preventDefault, native modified/middle clicks; no nested interactive elements or device-dependent action. |
| SN-04 | Rerender active/value/hidden, no scroll/resize/key listeners; hide while open and focused, controlled and uncontrolled acknowledgement, no hidden tab stops. |
| SN-05 | Decorative ProgressBar edge and host text: 0/50/100, negative/over-100 and non-finite, actual pixel fill and parent clipping. |
| SN-06 | Inclusive 519/520/521 and fractional widths; 44px real controls, safe-area, long text, 200/400% zoom and no page overflow. |
| SN-07 | Shipped CSS, every §6 collision and untouched legacy fixture, overlay, reduced transparency, unsupported filters, reduced motion, focus and contrast. |
| SN-08 | Hover and waiting do not open; no global shortcuts; protected native props and placement-only merge; real metadata, compiled styles and React 18/19 packed consumer. |

PRESERVE: run focused existing Popover, ProgressBar, Surface and Pixel tests once delivered; do not modify their contracts. Check supported merge boundaries without full class-string snapshots. Any shared-helper change needs separate scope, preservation tests and sibling differential verification. Refactor only while focused checks stay green.

## 8. Stories, integration and catalog

`Organisms/SectionNav`, `Meta<typeof SectionNav>`, autodocs, English copy, no manual `argTypes`, `play` or renderer adapter. Stories: Default (required example args only), Controlled, LastWrap, Empty, Unmatched, Hidden, LongLocalizedNames, Progress and Responsive. Show host-supplied text equivalent, distinct names and a host that acknowledges controlled requests and moves focus before hiding. No shortcuts or scroll observer disguised as examples. For own props use `@control text` on strings, `number` on value, `boolean` on open/defaultOpen and `false` with concrete reasons and story references on structured items and callbacks; native hidden remains native. Only actual constants get bare `@default`; no dummy defaults. Verify real docgen requiredness, native omissions and types, installed extraction/enhancer/inference with zero owned diagnostics, and actual browser Controls.

Parent integration, after authorization: named public runtime/type exports in `packages/ui/src/index.ts`; add explicit `types.ts` production scan in `packages/ui/src/styles/compiled.css` and story scan if needed; metadata, `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs`. Test SSR/hydration, protected types and packed React 18/19 imports with tokens and shipped styles **without a consumer Tailwind compiler**. Assert emitted declarations for every selected utility in §5; coordinate Pixel's production scanning and exports without touching its internals.

Proposed exact `scripts/catalog_data.py` row, only once actually delivered and catalog gate separately approved; parent regenerates `docs/CATALOGO.md` and `docs/catalog.json` with the existing generator, never manually edits them:

```python
("SectionNav","organismo","SectionNav","organism","ui","Popover","Native section links, Pixel, ProgressBar, Icon; Surface overlay","mover","Implemented under approved v0.1 contract (#301): host-driven section navigation with explicit disclosure and separate next link, decorative progress edge and Pixel markers; Popover owns portal and focus. No scroll tracking or global shortcuts.")
```

## 9. Browser, work units and stop line

Run real Chromium with shipped CSS and legacy, token package and a packed consumer; record browser/version, viewport, DPR, theme, fonts, media, computed values and observed failures. Check keyboard, Escape/focus return, current/next, hidden, progress, 519/520/521 and fractional boundaries, 44px hit rectangles, safe areas, zoom, reduced motion/transparency and unsupported backdrop fallback. Test contrast over actual host backgrounds, long labels, stacking and portal clipping. Compare VIS-01/02 only under equivalent recorded conditions and separately approved differences; do not replace captures or claim visual/AT conformity without real evidence.

- **A:** after Pixel delivery and gates, writer owns six files and focused criterion-level RED/GREEN.
- **B:** parent owns scanning, public exports, metadata, package fixtures and naming receipt/usages; preserve existing integration and compare shared-file statement structure after merges.
- **C:** parent owns the approved catalog row and one generator run.
- **D:** parent owns Chromium, AT, capture and final integration evidence; focused checks first, broader tests/builds only when separately authorized.

**Risks / stop:** Popover cyclic focus and portal landmarks may not satisfy navigation; content autofocus after native anchor activation may conflict with destination focus; controlled hidden acknowledgement can leave a logical open state; hidden can lose to legacy display. Actual token dimensions, safe-area utility emission, overlay fallback, cascade and 44px targets are unproved. Pixel is not delivered here. Screen-reader, capture adoption, browser, package and visual evidence are unverified. If any gate, proof, API, token, dependency or stylesheet role fails, stop and return evidence for a separate owner decision; never widen the approved contract or treat this plan as implementation approval.
