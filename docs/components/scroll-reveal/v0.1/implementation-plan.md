# ScrollReveal v0.1 — implementation plan

- **Status:** Proposed for separate owner approval; this document implements and authorizes no code, test, registry, catalog, token, dependency, Git, build, server or remote change. Every gate below is pending.
- **Coverage:** FP1, **S2/S3** of the [web catalog task](../../../../odd/tasks/web-catalog.md), ScrollReveal only; not HomeTemplate (layer (f)), not any other component.
- **Approved contract:** [ScrollReveal v0.1](spec.md), owner final choice "Approve spec and recommendations" bound to canonical payload SHA-256 `7048c85eb9c2997349ad100bdae32e0e301701a412cc447f021cd9f4d0df2101` (whole text from the complete `## 1. Purpose and scope` line through EOF, final LF included), recorded in [owner-approval.md](owner-approval.md) and task L53. Draft decisions L52 (verbatim: "Wrapper plus restricted asChild (recommended)"; "800ms token + delay exception (recommended)"; "22.4px existing token (recommended)"). Destination approval: "Utilidad en @egdev/effects (Recomendado)" in [web-catalog owner-approvals](../../web-catalog/v0.1/owner-approvals.md); sequencing L51 ("Specify reveal/wipe first"). The spec's Proposed/Pending header is historical metadata, not a reversal of that approval. No OQ was silently re-decided here.
- **Plan identity:** Parent hashes the entire final plan file bytes including final LF and records the separate owner decision, as in prior layer approvals. No self-hash; changed bytes require renewed approval.
- **Visual references:** [owner-approval.md](owner-approval.md) "Adopt with documented differences": VIS-01…VIS-06 in [capture-observed.json](capture-observed.json) and [capture-motion.json](capture-motion.json) are adopted as scoped behavioral references with the recorded file-URL limitations and sample/screenshot timing gap. Accepted deviations: 22.4px rise (not source 24px), token timing. No exact pixel parity is promised.

## 1. Approved anatomy and API (restated exactly; no changes)

Anatomy (spec §2): one Root part — default a plain `div` host carrying the stable public root marker `eg-scroll-reveal` (exact approved hyphenated spelling); advanced opt-in merges everything onto the consumer's single native child through the public `@egdev/ui` `Slot`/`Slottable` export. No Radix behavior primitive, no new dependency, no role, no `tabIndex`, no ARIA attribute, no `aria-hidden`, no `display:none`/`visibility:hidden` in any state.

| Prop | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `variant` | `'reveal' \| 'wipe'` | no | `reveal` | `@control select`; owner-approved convention `entrance-variant` |
| `asChild` | `boolean` | no | `false` | `@control boolean`; reuses approved `slot-composition` |
| `delay` | `number` (ms) | no | none | `@control number`; owner-approved convention `entrance-delay`; finite ≥ 0 only |

Markers: variant marker `data-reveal` or `data-wipe` on the root (OQ-1 approved as recommended); `data-state="hidden" | "revealed"`; terminal `data-done` (wipe only). No `once` prop exists; no `onReveal`; no controlled visibility. Types: `type` only, `ComponentPropsWithoutRef<'div'>` inheritance with `...rest` to the root (wrapper mode) or through Slot (asChild mode); no `any`, the component forwards the public root ref in React 18/19-compatible form.

## 2. Merge semantics and the protected-prop conflict policy (precise; flagged clarification)

- **Wrapper mode (default):** `<div className={rootVariants(...)} data-reveal|data-wipe data-state=… {...rest} style={delayStyle}>`. `rest` lands before the utility-owned state/variant markers, with reserved markers filtered so consumers cannot override behavior; a consumer `className`/`style` merges through `cn()`/object spread with the consumer last, documented per-part precedence and tested; no blanket override permission.
- **asChild mode:** `<Slot className={rootVariants(...)} style={delayStyle} {...rest} data-… ref={observeRef}><Slottable>{child}</Slottable></Slot>`. Slot's own documented merge behavior is used as-is, never re-implemented: `className` merges with the utility classes first and the child's last (consumer layout precedence, spec §6); `style` merges shallowly with the child winning key conflicts; event handlers compose so both the Slot-level handlers (if any installed by this utility) and the consumer's `onFocus` etc. run; `ref` merges so the utility's internal observation ref and any child-supplied ref both attach. Exact ordering is pinned by tests against the real `@egdev/ui` export, not asserted from memory.
- **Public ref preservation:** spec §3 explicitly promises a forwarded ref. Use React 18-compatible `forwardRef` with the native div props, compose the external and observation refs, and preserve the child ref through Slot. `ComponentPropsWithoutRef` describes the native-props base, not removal of the promised forwarded ref. Pin wrapper and native-child ref behavior in tests; do not narrow the approved contract.
- **Conflict policy enforcement — what is enforceable:** (a) multiple children: enforced by Slot/`Slottable` (throws); (b) non-native child (a component): dev-only warning; (c) child already carrying a conflicting state marker (`data-state`, `data-reveal`, `data-wipe`, `data-done`): dev-only warning; (d) child `className` carrying its own transform/transition utilities: **not** reliably detectable by string matching — documented undefined composition per spec §2, consumer responsibility; no fragile heuristic warning is installed. Violations never throw outside Slot's own single-child error; the documented undefined-composition rule covers the rest.

## 3. Six files — No stylesheet

After plan approval and scoped authorization, six meaningful files under `packages/effects/src/scroll-reveal/` (established effects pattern, `src/ambient-background/` precedent):

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, English JSDoc with `@control` per own prop, static CVA root recipes per variant. |
| `useScrollReveal.ts` | All observation/focus/reduced-motion/wipe-cleanup logic; typed return; no `any`. |
| `ScrollReveal.tsx` | JSX only; wrapper and Slot composition; explicit props. |
| `ScrollReveal.test.tsx` | Public behavior tests per §7. |
| `ScrollReveal.stories.tsx` | English autodocs; title `Atoms/ScrollReveal` following the effects precedent; no `play`. |
| `index.ts` | Named component and type exports. |

**No stylesheet:** no `scroll-reveal.css` is created; `packages/effects/src/styles/compiled.css` gains only a parent-owned `@source "../scroll-reveal/types.ts";` line so the CVA utilities compile. No dummy CSS, no invented role (OQ-6 approved as recommended). No additional internal module.

## 4. Static utility inventory — verbatim, for parent compiler probe

No dynamic class interpolation anywhere. The delay utility is always present so classes stay static; the custom property is set inline only for a valid `delay`.

| Part | Exact static classes |
| --- | --- |
| Root, reveal | `eg-scroll-reveal box-border transition-[opacity,translate] duration-[var(--duration-reveal)] ease-[var(--ease-out)] delay-[var(--eg-scroll-reveal-delay)] motion-reduce:transition-none data-[state=hidden]:opacity-0 data-[state=hidden]:translate-y-7` |
| Root, wipe | `eg-scroll-reveal box-border transition-[clip-path] duration-[var(--duration-wipe)] ease-[var(--ease-out)] delay-[var(--eg-scroll-reveal-delay)] motion-reduce:transition-none data-[state=hidden]:[clip-path:inset(-10%_100%_-10%_0)] data-[state=revealed]:[clip-path:inset(-10%_-2%_-10%_0)] [&[data-done]]:[clip-path:none]` |

- Rise uses Tailwind v4's `translate` property (`translate-y-7` = 7 × 3.2px = **22.4px**, existing `--space-7`/`--spacing-7` token; the accepted 1.6px deviation from the source's 24px). `motion-reduce:transition-none` is a CSS backstop; the JS reduced-motion guarantee in §6 is primary.
- **Exhaustive parent probe list:** every distinct string above — `box-border`, `transition-[opacity,translate]`, `transition-[clip-path]`, `duration-[var(--duration-reveal)]`, `duration-[var(--duration-wipe)]` (emits before token materialization, but its variable needs the approved value), `ease-[var(--ease-out)]`, `delay-[var(--eg-scroll-reveal-delay)]`, `motion-reduce:transition-none`, `data-[state=hidden]:opacity-0`, `data-[state=hidden]:translate-y-7`, `data-[state=hidden]:[clip-path:inset(-10%_100%_-10%_0)]`, `data-[state=revealed]:[clip-path:inset(-10%_-2%_-10%_0)]`, `[&[data-done]]:[clip-path:none]` — asserted as selectors, declarations, media/attribute conditions and token resolution, not mere string presence (packed regexes miss Tailwind `var()` fallbacks, L38). Prove that `transition-delay: var(--eg-scroll-reveal-delay)` with the property unset resolves to 0s (invalid-at-computed-value → initial), and that `translate-y-7` computes 22.4px. `eg-scroll-reveal` is a marker, not a generated utility. Any replacement needs a revised inventory and renewed proof.
- Inline mechanism (scoped exception awaiting approval below): `style={{ ['--eg-scroll-reveal-delay']: `${delay}ms` }}` only when `Number.isFinite(delay) && delay >= 0`; merged with consumer `style` without clobbering it. Numeric millisecond custom property only, mirroring the Gauge/PreviewFrame precedents; no other inline appearance, ever.

## 5. Token and naming gates (all pending this plan's approval)

1. **New duration token:** `--duration-wipe: 800ms`, exact value and English comment per file conventions, materialized in `packages/tokens/src/theme.css` only as a parent-owned unit after owner approval of this plan (L52 selected the value; nothing is written today). The duration utility emits without the custom property; correct computed timing requires the approved token.
2. **Scoped numeric custom property exception:** `--eg-scroll-reveal-delay` for this utility only, per L52; no extension to any other inline mechanism.
3. **Naming receipts:** owner approved both conventions (L53, "Approve both conventions"): `entrance-variant`/`variant` (reveal or wipe) and `entrance-delay`/`delay` (finite nonnegative milliseconds), with meanings exactly as recorded in [owner-approval.md](owner-approval.md). Registry entries are materialized parent-side with `status: "approved"`, approval bound to `docs/components/scroll-reveal/v0.1/owner-approval.md` under `convention:<id>` scope and the matching `conventionHash`; **no historical rewriting** of the spec payload or existing entries. `asChild` appends one usage to the existing approved `slot-composition` entry. Usage `source.revision` values are the actual whole-file `sha256:` of the reviewed `types.ts` after implementation — never invented. After authorized JSON edits: `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`.

## 6. Behavior implementation rules (spec §4, one-to-one)

1. **SSR / no JS / hydration:** server output has no hidden state, no `data-state=hidden`, no opacity/clip/translate hiding — content fully visible. The hidden state exists only on the client, and only when `IntersectionObserver` exists and reduced motion is not requested.
2. **Client mount:** if IO is missing, creating/observing the observer throws, or `prefers-reduced-motion: reduce` is active, take the immediate-reveal path (below); the element is never hidden and the observer is not used. Otherwise run the pre-pass: if the element's top is already above ~92% of the viewport height (`getBoundingClientRect().top < 0.92 * window.innerHeight`), reveal immediately without a transition and without observing. Otherwise set `data-state="hidden"` and observe with `rootMargin: '0px 0px -8% 0px'`, `threshold: 0`.
3. **Intersection:** on the callback, transition to `data-state="revealed"`, then `unobserve` — once-only invariant, never re-hides on later intersections.
4. **Immediate-reveal path:** set `data-state="revealed"` with no transition (the element was never hidden, so nothing animates), disconnect/clean up, and under reduced motion treat it as final (no re-observation when the preference later changes).
5. **Reduced-motion live changes:** a `matchMedia('(prefers-reduced-motion: reduce)')` change listener; while hidden, a change to reduce reveals immediately (rule 4). Change back to no-preference does nothing once revealed (once-only).
6. **Focus reveal:** while hidden, a capture-phase `focusin` listener on the root reveals immediately like the pre-pass, so focus is never received by invisible content; the listener is removed after reveal and on unmount.
7. **Wipe terminal state:** after the wipe reveal, listen for `transitionend` filtered to `propertyName === 'clip-path'` and for `transitioncancel` on the element; either sets the terminal `data-done` (React state), removing the clip-path entirely. **Bounded cleanup even for a missed `transitionend`** (e.g. a `display:none` host mid-transition): a safety timer computed from the element's computed `transition-duration`/`transition-delay` for `clip-path` at reveal time (token-derived; handle unreadable computed timing by immediately finalizing visible/unclipped rather than adding hardcoded appearance timing) sets `data-done` too. Timers and listeners are cleared on `done` and unmount.
8. **Fail-open:** observer absence or any creation/observation failure never leaves content hidden (rules 1–2); the element ends visible with the entrance skipped.
9. **Unmount / StrictMode:** the per-instance observer is `disconnect()`ed, all listeners and timers removed, and no leaked global listeners remain (OQ-5 approved: per-instance). Effects are idempotent under StrictMode double-invocation: a re-mounted instance re-observes only if not yet revealed and never re-applies hidden to an already-revealed element.
10. **Delay validation:** finite ≥ 0 sets the inline custom property; non-finite or negative values are ignored — no property, no delay, nothing else changes (AC-07).

## 7. Test-first plan — every AC through the public component API

Implementation is RED first: each criterion's tests are written and observed failing before minimum GREEN; no fake or invented passing evidence. jsdom is not geometry evidence; browser-only promises get their §9 Chromium evidence.

| Criterion | RED → GREEN observable checks (Vitest, public API) |
| --- | --- |
| AC-01 | SSR/no-JS render (no effect run) shows no hidden state and visible content; `IntersectionObserver` undefined → visible, entrance skipped; observer constructor throwing and `observe`/`unobserve` throwing → visible, never stuck hidden. |
| AC-02 | Mocked IO drives intersection → `data-state` hidden → revealed with the variant's root classes present on the utility's own element; wrong `rootMargin`/`threshold` options fail the test. |
| AC-03 | Mocked `getBoundingClientRect` above the 92% line → revealed immediately, never hidden, no observation registered; below the line → hidden then observed. |
| AC-04 | After reveal: `unobserve` called; a later intersection callback is a no-op; state never returns to hidden; no `once` prop exists (type-negative). |
| AC-05 | `variant="wipe"`: hidden clip utility present; dispatch `transitionend` with `propertyName='clip-path'` → `data-done`; `transitionend` with another property → no `done`; dispatch `transitioncancel` → `done`; with neither event firing, the bounded timer (fake timers) still sets `done`; timer/listeners cleared after `done` and unmount. |
| AC-06 | Mocked matchMedia `reduce` at mount → visible, no transition, immediate-reveal path; live change to reduce while hidden → immediate reveal; live change after reveal → no re-hide. |
| AC-07 | `delay={300}` → inline `--eg-scroll-reveal-delay: 300ms`; `NaN`, `Infinity`, `-1` → property absent, no delay, all other output unchanged. |
| AC-08 | `focusin` inside a hidden subtree → immediate reveal (pre-pass semantics); unmount → `disconnect()` called, no listeners/timers remain (lifecycle spies). |
| AC-09 | Wrapper mode: root carries `eg-scroll-reveal` + markers; a stateful child's own `data-state`, classes and transitions are untouched (attribute/class preservation assertions). |
| AC-10 | `asChild` with a real `Slot` and a native `li`: no wrapper element, markers/state merged onto the child, `className`/`style`/event/ref merge semantics of §2 observed (ref via a child-side ref capture), single-child violation throws, non-native child and conflicting markers warn in dev. |
| AC-11 | No role/ARIA attribute added, no `aria-hidden`, no `display:none`/`visibility:hidden` in any state; opacity/translate/clip-path only. |

PRESERVE: no existing export, marker, consumer or effect changes; `packages/effects/src/package-contract.test.ts` must keep passing unchanged (no dependency, exports-map or manifest change). Sibling differential checks for AmbientBackground/Isotipo3D only if shared code is ever touched — this plan touches none.

## 8. Package, SSR and packed gates (parent integration, Unit B)

- Add the named export to `packages/effects/src/index.ts` (`ScrollReveal` + `ScrollRevealProps`) and `@source "../scroll-reveal/types.ts";` to `src/styles/compiled.css`; run `pnpm typecheck`, `pnpm lint`, focused Vitest, then the suite only when authorized.
- Packed React 18 and 19 consumers and SSR/hydration with shipped tokens, styles and **no consumer Tailwind compiler**; type-negative cases (invalid `variant`, `delay` misuse) rejected at compile time.
- **Own-element assertions, not shared-selector mutation holes (L38/L49):** SSR/packed tests assert ScrollReveal's own root elements carry the exact classes of §4 (e.g. `data-[state=hidden]:opacity-0`, `[&[data-done]]:[clip-path:none]`) and that compiled CSS contains the matching declarations; packed CSS alone can stay green when a sibling emits the removed utility.
- **Mutation gates** — after each build, removing each source behavior must fail its test: hidden state, reveal translate, wipe hidden clip, wipe revealed clip, done no-clip, no-motion backstop, delay property, focus reveal, error/fail-open cleanup, unmount cleanup.

## 9. Browser gates (parent, Unit C — Chromium, real shipped styles)

- 390/1280 viewports: no-JS and SSR renders fully visible; scrolling drives reveal/wipe; wipe reaches `data-done` and the clip is gone; focus entering hidden content reveals it; computed `translate`/`clip-path`/`transition` values match §4; 22.4px rise; delay stagger composes both variants.
- Reduced motion: emulated `prefers-reduced-motion: reduce` at mount and toggled live while hidden — content never hidden, no transition; the no-motion backstop holds.
- Compare adopted VIS references only under equivalent recorded conditions and report the documented differences (22.4px, token timing); report any incomparable reference as **Not evaluated**.
- **No claims of native screen-reader or zoom parity:** accessibility-tree checks are not screen-reader sessions; zoom/reflow behavior of this utility is decorative-transparent but is not certified here.

## 10. Work units, ownership and stop lines

- **Unit A (writer, this worker, after plan approval + scoped authorization):** the six files and criterion-level RED/GREEN only; no exports, tokens, registry, catalog or fixture edits.
- **Unit B (parent):** token materialization (§5.1), `@source` line, package export, naming receipts/usages (§5.3), exports/consumption fixtures, metadata/docgen checks, packed/SSR/mutation gates, structural merge checks (compare column-0 statements against main; L24).
- **Unit C (parent):** browser evidence and the separate delivery decision. **Canonical issue publication (spec closure's Pending issue) is parent-owned separate authority, not a worker task.**
- **CI:** CI is disabled per owner policy; no CI run is claimed, and all gates above are local parent-executed checks.
- **Stop lines:** no implementation from this proposal alone; separate owner approval of this plan (exact whole-file hash) and of the §5 gates is required first. Stop if any §4 utility fails emission, the Slot merge semantics differ from §2, the approved API cannot be honored exactly, the token or exception approval is refused, or any criterion cannot be met — report with evidence, never widen the contract or invent approvals.

## Parent pre-approval compiler evidence

The installed Tailwind 4.3.3 compiler with the actual unchanged token theme emits all 13 distinct candidates from §4, including the variable-backed wipe duration even before its token exists. This proves CSS generation, not runtime timing; computed delay fallback and token resolution remain mandatory browser gates. No token was edited for this probe. Plan corrections preserve the spec's explicit forwarded-ref promise (no API-narrowing amendment) and remove the erroneous missing-token emission claim. No implementation exists.
