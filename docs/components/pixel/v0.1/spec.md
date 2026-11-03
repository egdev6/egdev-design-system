# Component contract — Pixel

- **Version / status:** 0.1 — **Proposed**, draft for owner review; not approved or implementation-ready.
- **Approval / recovery:** Pending explicit owner decisions on this payload and VIS-01/VIS-02. Catalog classification is approved, not this contract or plan: `docs/components/web-catalog/v0.1/owner-approvals.md`; capture authority `odd/tasks/web-catalog.md` L6, L15, L25, L29.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: 9d2c435e3648f428b6b58dc216fbc86c690ee43c0e00232cd077b1b7db2bb490`; `visualHashes: VIS-01 → 164187ecd80434b8e824153f62b3055b55255292d8c2a7bbeedb84dffd7957d4; VIS-02 → 2348a1ddb51ce598249e9088ac0a040343bf3b1c52724096937ba750a504c72c`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact whole heading line `## 1. Purpose and scope` through EOF, LF and final newline included; metadata above is excluded.

## 1. Purpose and scope

One passive, decorative isometric brand marker denoting a position or progress state; atom in `@egdev/ui`. It is not a meter, navigation, a collection, status text or a control. The host supplies all meaning. Classification and extraction were approved for the web catalog, but its row explicitly reserves geometry (`scripts/catalog_data.py:36`); this is a draft decision request, not a resolved geometry or implementation plan.

**Alternatives:** `packages/ui/src/index.ts:1-36,119-125` exports StatusDot, Kbd, ProgressBar and Surface but no Pixel. StatusDot (`packages/ui/src/atoms/status-dot/types.ts`) is a round condition/signal dot; Kbd displays meaningful key text; neither preserves the isotype shape or position semantics. ProgressBar represents task progress, not an individual marker; Surface is an available Material box, not this free-standing clipped shape. Reuse/variant of those changes their responsibilities. A sequence is composed by its owner from individual markers; extracting this recurrent shape is the catalog direction, without adding a separate collection here. Foundation `design-system/components/Pixel/README.md:1-34`, `design-system/CONTRACT.md:8-11,40,62`, and `reference-web/pulso-source.html:650-654,786-796` are read-only source evidence. Foundation decisions separate floating SectionNav from old pixel-rail navigation (`design-system/DECISIONES.md:20-32`).

## 2. Anatomy and composition

| Part | Responsibility | Element / content |
| --- | --- | --- |
| Root | One empty decorative isotype parallelogram | Proposed `span.eg-pixel`, always `aria-hidden="true"`; no children |

No interactive Radix primitive, Surface wrapper, parts, SVG dependency or collection. Inline SVG remains an owner alternative, not a selected API. Preserve `eg-pixel` public marker and existing legacy rules/consumers; never add legacy `.is-past`/`.is-active` to new markup. Six-file implementation and any stylesheet role are subject to the independent plan.

## 3. Public API

Proposed only, conditional on OQs:

| Prop | Type | Required | Default / rule |
| --- | --- | --- | --- |
| `state` | `'idle' \| 'past' \| 'active'` | no | `idle`; consumer selects the represented position, not a visual variant or inferred progress. Render matching `data-state`; no `.is-*`. |
| `className` | `string` | no | Root outer placement only; no size, geometry, paint, filter or state overrides. |

Propose `ComponentPropsWithoutRef<'span'>` with `children`, `dangerouslySetInnerHTML`, `role`, `aria-hidden`, `aria-label`, `aria-labelledby`, `data-state`, `tabIndex` and `contentEditable` omitted; runtime must discard conflicting supplied values even from untyped callers. Forward nonconflicting native data/attributes; never forward event handlers that turn the decoration into a control. No refs, `asChild`, arbitrary size, children, label, events or internal state. No callbacks, keyboard or controlled/uncontrolled mechanism: Not applicable. Unsupported invalid runtime state handling is not specified; strict public type rejects it.

**Registry lookup:** searched `skills/_shared/prop-naming.json` and `docs/prop-naming.md` by state/condition/position, aliases, `variant`, `tone`, and size. Existing `state` → `consumer-selected-condition` is approved but its meaning and use name Gauge/GaugeGroup only, not Pixel; StatusDot is an existing usage, not proof of a wider approved meaning. Recommend a separately approved widening of `consumer-selected-condition` to cover consumer-selected position markers, retaining ID/name, rather than a duplicate or scoped alternative; proposed widened meaning and approval are **Pending**, no registry edit authorized. `visual-treatment` (`variant`) and `surface-material-tone` (`tone`) do not describe a consumer-owned position. `preset-dimensions` (`size`) is not used because no size prop is proposed. Native `data-state` and `className` need no own convention. Reviewed `StatusDotProps`, `packages/ui/src/atoms/status-dot/types.ts`, whole-file `sha256:4d3db595cffe56d87931b3000d57fa0226a2c812d35950308f6d4309c89e4ecb`; Pixel has no source revision yet. Any changed convention content requires its own scoped approval, independent of spec and plan.

## 4. Behavior

| Input / action | Proposed result | Event |
| --- | --- | --- |
| Omitted state | idle and `data-state="idle"` | none |
| `past` / `active` / `idle` | One corresponding fill; attribute updates on rerender | none |
| Reduced motion | State changes immediately; no transition, animation or transform | none |

No automatic tracking, calculation, routing, timer or announcement. Consumer maintains semantic state independently; Pixel does not own a focus target or communicate status by color alone.

## 5. Accessibility

Always hidden from the accessibility tree, with no role, accessible name, children or tab stop. The host supplies visible, meaningful text and, for a current navigation item, `aria-current` on the actual link; do not place focusable content inside the decoration. A meter must expose a coherent accessible value/name separately. No keyboard, focus, touch target, live region or focus restoration applies to this passive atom. Verify real accessibility tree and keyboard integration; no conformance claimed.

## 6. Appearance

- **Geometry and size:** Foundation uses `polygon(0 0,100% 33.8%,100% 100%,0 66.2%)` at 8×12 CSS px (`packages/ui/src/styles/legacy/bundle.css:182-187`); this is brand geometry, not a space/color/font value. Recommend static literal percentage clip-path utility, pending explicit geometry decision OQ-1; it can express the polygon without a stylesheet if accepted. Gauge's numeric inline custom-property exception and PreviewFrame's four zone properties do not authorize Pixel inline geometry. The existing spacing scale changed to ×0.8 (`packages/tokens/src/theme.css:415-423,530-541`); 8×12 exact vs 6.4×9.6 token-backed sizing is OQ-2. Recommend the latter (`w-2 h-3`) as an explicit visual difference; no numeric size prop. Exact legacy dimensions would need a separately approved geometry mechanism, not an assumed token exemption.
- **State fills:** `past` → `--color-bg-deep`; `active` → `--color-fg-brand-default` (`packages/tokens/src/theme.css:78-79,136-137`). Foundation idle is 18% `--color-fg-default` on transparent (`Pixel/README.md:14-19`; legacy 185-186). No 18%-white token was found in `packages/tokens/src/theme.css:36-39`; recommend token-based `bg-fg-default/18` only if owner approves its literal opacity modifier as a bounded exception to the no-handwritten color-mix rule; otherwise approve an existing different token or specifically approve a new token. Do not silently use `color-mix()` by hand, infer equivalence from screenshots, or add tokens.
- **Glow:** legacy active uses an un-tokenized 4px 90%-red `drop-shadow` (`bundle.css:189`); existing `--shadow-glow-active` is a box shadow with different geometry (`packages/tokens/src/theme.css:343-346`). Clip paths can clip box shadows, and filter order matters. Recommend **no glow** in v0.1 as an explicit visual deviation pending owner approval; do not claim token parity. A new filter token requires separate approval and browser verification. No transition is recommended; if approved later, use motion-safe token timing and none under reduced motion.
- **Legacy collision:** shipped `.eg-pixel` sets display, flex, width, height, polygon, white-18% background and background/filter transition; `.eg-pixel.is-past` and `.eg-pixel.is-active` set state backgrounds and active filter; reduced-motion rule removes transition (`packages/ui/src/styles/legacy/bundle.css:182-190`). Keep all legacy rules unchanged. New markup uses no `.is-*`; locally neutralize every conflicting base property through static utilities at the correct layer, including explicit `filter: none` and `transition: none`, then establish approved dimensions, polygon and state fill. If SVG is selected, reset inherited clip/background on the stable root too. Verify computed CSS with the shipped stylesheet and any host selectors, before asserting parity; `cn`/class-string order alone does not resolve cascade or arbitrary-value conflicts.
- **Material / files:** A tiny decorative mark is not an elevated surface, well or overlay; no Surface recipe is implied. Token-backed CVA in `types.ts`, `cn()` in hook; `className` merges only supported placement and `twMerge` does not guarantee universal precedence. Six meaningful files: `types.ts`, `usePixel.ts`, `Pixel.tsx`, `Pixel.test.tsx`, `Pixel.stories.tsx`, `index.ts`; no additional module. **No stylesheet** is recommended only if owner approves static utilities and they compile. Alternative `pixel.css` may contain solely a necessary polygon geometry role in `@layer components`, but shared policy permits it only if utilities cannot express the role under the approved policy; convenience or legacy copying alone is insufficient. A separate spec/plan approval is required. No new dependency, token or registry change is authorized.

### Expected-design visual references

| ID | Image / English alt text | Status and hash |
| --- | --- | --- |
| VIS-01 | [Desktop Foundation preview](pixel--variants--1280--dark.png): idle, past and active markers, six-marker sequence and enlarged three-state shapes. | Proposed; `164187ecd80434b8e824153f62b3055b55255292d8c2a7bbeedb84dffd7957d4` |
| VIS-02 | [Narrow Foundation preview](pixel--variants--390--dark.png): the same labelled states, sequence and enlarged shapes. | Proposed; `2348a1ddb51ce598249e9088ac0a040343bf3b1c52724096937ba750a504c72c` |

Parent-supplied Foundation `Pixel/preview.html`, SHA-256 `baef733abae3b8626ef596a6ebec991e8a5d79bb11167dc27e6787c9dddb3cba`; raw records in `capture-raw.json`, index in `capture.json`. Chromium headless shell 1243, viewport 1280×1400 / 390×1400, DPR 2, dark, en-US, motion no-preference, animations disabled, Barlow Condensed 600 loaded, `.pv` board crop, 2026-11-03. Preview labels are source language; new documentation is English. Capture is not an implemented DS comparison, reduced-motion check, accessibility test or public asset verification. Adoption pending; visual conformity **Not evaluated**, especially proposed size, idle alpha and omitted glow.

## 7. Acceptance criteria

All checks are planned, not observed; subject to owner resolution.

| ID | Promise | Planned test / scenario |
| --- | --- | --- |
| PX-01 | Empty hidden span, default idle, all three exact data states, no legacy state classes | DOM and rerender tests; Default, AllStates |
| PX-02 | Conflicting semantics/content/focus and untyped overrides cannot expose decoration; nonconflicting attributes pass | DOM, type tests, SSR; WithText |
| PX-03 | Host conveys current/progress independently; keyboard skips markers | browser accessibility tree and keyboard integration; SectionNav-style list and meter examples |
| PX-04 | Selected geometry and dimensions compile and survive real legacy cascade in every state | built CSS and packed-consumer browser computed geometry; VIS-01/02 with approved differences |
| PX-05 | Approved state tokens, glow decision and immediate reduced-motion behavior | built CSS, browser computed style/media and real visual review |
| PX-06 | Placement-only merge; marker preserved; no unexpected legacy transition/filter | DOM/compiled CSS and real browser tests with shipped stylesheet |
| PX-07 | English JSDoc, select control, static CVA scan; React 18/19 consumer without Tailwind | metadata pipeline, Storybook controls, packed consumer and browser checks |

**Closure:** OQ-1–OQ-6, convention widening, visual adoption and separate implementation plan are pending. No issue, registry, catalog, code, token, dependency or remote mutation follows. Public URLs must be independently authorized and their downloaded image bytes checked before publication.

## Blocking decisions for the owner

| ID | Question and evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | How to encode polygon? Foundation expressly permits literal geometry (`design-system/CONTRACT.md:8-11`); local contract allows optional stylesheet only where utilities cannot express a compliant role (`skills/_shared/component-contract.md`, Archivos and Estilos). (a) Geometry-only `@layer components` stylesheet: meaningful but not justified if static utilities are permitted. (b) Static `[clip-path:polygon(0_0,100%_33.8%,100%_100%,0_66.2%)]`: literal geometry, not forbidden handwritten color, spacing or font; local rules do not explicitly approve this Pixel literal, so request approval. (c) New geometry token(s): changes token source and requires explicit separate approval. (d) Inline SVG polygon: avoids clip-path, but changes anatomy/cascade and needs visual/size verification. | Choose (b), explicit Pixel-only geometry approval, no stylesheet if built/packed CSS verifies; stop for owner choice, not a silent exception. |
| OQ-2 | Preserve 8×12 or apply ×0.8 (6.4×9.6)? (`Pixel/README.md:3`, `packages/tokens/src/theme.css:415-423`). | Scale using existing `w-2 h-3`; document deviation from capture and get visual adoption. No size prop. |
| OQ-3 | Consumer `state` prop or native `data-state` only? (`Pixel/README.md:11`, `packages/ui/src/atoms/status-dot/types.ts`); registry `consumer-selected-condition` currently scoped to Gauge. | `state` with derived `data-state`, never mirrored classes; separately approve widened naming convention. |
| OQ-4 | Idle 18% white: bounded token-backed opacity modifier, another existing token, or new token? (`Pixel/README.md:14-19`; `packages/tokens/src/theme.css:36-39,72-79`). | Approve `bg-fg-default/18` as narrowly scoped exception if considered an authored color mix; else choose an existing token with a stated visual change or explicitly approve a new one separately. Past/active use existing deep/brand tokens. |
| OQ-5 | Keep active glow or omit? (`packages/ui/src/styles/legacy/bundle.css:189`; `packages/tokens/src/theme.css:343-348`). | No glow; no suitable equivalent filter token established, box shadow is not drop-shadow parity. New filter token needs separate explicit approval. |
| OQ-6 | Is one always-hidden mark enough, with SectionNav list and NowCard meter composed separately? (`SectionNav/preview.html:25-29`, `NowCard/README.md:1-3,20-26,34-36`; `odd/tasks/web-catalog.md` L29). | Yes. Host supplies text/current or labelled meter semantics; SectionNav owns its list. NowCard's current approved footer excludes the meter; any future meter requires a separate NowCard amendment and plan, not Pixel approval. |
