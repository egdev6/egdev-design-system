# Component contract — WebSection

- **Version / status:** 0.2 — DRAFT, new component; awaiting exact owner approval (G4) and separate naming decisions (G5). Not implementation-ready.
- **Approval / recovery:** Pending. The owner accepted planning direction, not this exact contract or an implementation plan. [A11](../../web-catalog/v0.2/visual-amendments.md) and [U9/P0](../../web-catalog/v0.2/implementation-plan.md) are proposals, not approval.
- **Current situation / pending decisions:** No WebSection implementation or previous spec. Heading ID forwarding, exact neutral layout and visual source remain blocking decisions below.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 → Pending; VIS-02 → Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/340`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from `## 1. Purpose and scope` through EOF, with LF line endings and final LF. Metadata above is excluded. Approval must identify the finalized payload, visual hashes and scope.

## 1. Purpose and scope

A neutral, passive section organism combining consumer-supplied header, media, body, actions and social content. No domain copy/data, section register, section frame, choreography, observer or effects import. Host composes it inside `SectionShell`. S11 owner request: “A reconsiderar -> las veo todas muy similares. Quizás unificar en un organismo webSection con slots?”

**Draft cataloging decision:** new organism in `@egdev/ui`, `packages/ui/src/organisms/web-section/`, coordinating a hierarchical region rather than a single atom, page or template. Web-consumer reuse policy permits neutral web building blocks without a second app. No Radix primitive: this component owns no interactive behavior.

**Alternatives inspected:** `packages/ui/src/index.ts` publicly exports `Hero`, `ChapterBreak`, `LabStage`, `Closing`, `SectionHeader` and `SectionShell` in this working tree; older Gauge-only availability prose conflicts with those actual exports and is not proof of their absence. Their `types.ts` show scenes with structured `title`, `level`, `lede` and decorative-only `media`; they do not offer the requested neutral interactive slots. Reuse as-is cannot satisfy A11. A scene or `SectionHeader` appearance variant cannot change its content responsibility; `SectionShell` widening would put organism anatomy in a frame template. App composition is possible but repeats anatomy; the web-specific catalog amendment permits a reusable generic composition. Extracting one existing scene's internals would carry scene-specific structure and media constraints; no common neutral public part has been established. Therefore propose new rather than widening, extracting or recipe-only documentation. Preserve all four scene exports and consumers; migration, deprecation and removal need separate approval. Classification, spec and implementation plan approvals are distinct.

## 2. Anatomy and composition

| Part | Responsibility | Element / Radix | Allowed content |
| --- | --- | --- | --- |
| Root | Passive layout inside host section | Proposed `div`; no Radix | Five slots in order |
| Header | Consumer-owned introduction, including heading | Passive slot host, element pending layout decision | `ReactNode`, including interactive content |
| Media | Consumer-owned meaningful, decorative or interactive media | Passive slot host | `ReactNode`, including video, linked figure or panel |
| Body | Consumer-owned section content | Passive slot host | `ReactNode` |
| Actions | Consumer-owned actions | Passive slot host | `ReactNode` including named links and controls |
| Social | Consumer-owned social content | Passive slot host | `ReactNode` |

Proposed DOM order: header → media → body → actions → social, independent of visual layout. Missing/null slots produce no empty slot wrapper or placeholder; no parsing or cloning arbitrary descendants is assumed. `SectionShell` owns `<section>`, register and its optional content wrapper; consumer owns headings and document outline. `SectionHeader` may be supplied by the host. No `asChild`. Proposed stable root marker `eg-web-section`; no public part marker or part-level className surface is proposed.

## 3. Public API

| Prop | Type | Required | Default / rule | Purpose |
| --- | --- | --- | --- | --- |
| `header` | `ReactNode` | No | absent | Supplied header and heading |
| `media` | `ReactNode` | No | absent | Media, including interactive content |
| `body` | `ReactNode` | No | absent | Main section content |
| `actions` | `ReactNode` | No | absent | Action content |
| `social` | `ReactNode` | No | absent | Social content |
| `id` | `string` | No | absent; heading target **blocked**, see OQ-1 | Intended host `aria-labelledby` relationship, not root anchor |
| `className` | native `string` | No | absent | Root outer placement only |

**Naming lookup:** consulted [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning, name and aliases. `scene-social` → `social` is an approved convention for supplied social-profile link groups; reuse is proposed only when that meaning fits, without imposing a decorative or noninteractive restriction. `trailing-actions` → `actions` covers supplied action elements but its one-or-two trailing control context is narrower than A11's neutral unrestricted `ReactNode`: exact usage/generalization needs G5, not an automatic grant. `scene-media` → `media` explicitly excludes interactive content and cannot be reused as-is. `panel-header` → `header` excludes interactive and section headings and is not a match. No matching generic `body` entry was found. Propose separately reviewed concepts `web-section-header-slot`, `web-section-media-slot`, `web-section-body-slot` for `header`, `media`, `body`, each `ReactNode`, optional and consumer-supplied, allowing interactive content; the media concept must resolve its name collision with `scene-media` via a reviewed convention change or scoped resolution, not a duplicate registration. For `social` and `actions`, approve their exact neutral usage or choose scoped/new concepts if broader meanings are intended. All proposals and exceptions have `approval: null`; no registry edits are authorized here. Native `id` and `className` are not own naming conventions; OQ-1 determines whether `id` needs an explicit semantic mapping.

Reviewed existing evidence: `HeroProps` in `packages/ui/src/organisms/hero/types.ts`, `sha256:09c805d2cd51cf46095f17945aabfe547ab59f464fccdbdba9fe30d66c1ed844`; `SectionHeaderProps` in `packages/ui/src/molecules/section-header/types.ts`, `sha256:5726750a3c95049bf2262524f7d11d504774fd67f3b7d4409e49b9641b1d6f0c`. These are evidence of existing symbols, not evidence of the nonexistent WebSection API. Future registry usage requires reviewing the actual new source and its whole-file hash after implementation.

**Native boundary proposal:** `ComponentPropsWithoutRef<'div'>` to root, omitting `children`, `id`, `role`, `style`, `dangerouslySetInnerHTML` and conflicting own props; supported `data-*` and compatible `aria-*` pass through. `id` is reserved pending OQ-1, not silently assigned to root. No ref, `asChild`, built-in state or callbacks. The five ReactNode props require English JSDoc `@control false` and a concrete `@controlReason`; no fake controls. React 18/19 packed consumption is planned, not verified.

## 4. Behavior

| Input / action | Proposed result | Event |
| --- | --- | --- |
| Supplied slots | Render unchanged in documented DOM order; no copy, automatic role, name or tab stop | None |
| Omitted slot | No placeholder or empty slot host | None |
| Consumer activates a control or media | Its own native/Radix behavior applies; WebSection does not intercept or choreograph | None from WebSection |
| Reduced motion | WebSection adds no animation; supplied content owns its behavior | None |

No controlled/uncontrolled state, variants or `data-state` apply. The consumer owns supplied semantics and valid nesting, unique IDs, focus, links, content and responsive integration; no runtime validation of arbitrary React trees is promised.

## 5. Accessibility

The root introduces no landmark, accessible name, role or automatic tab stop. `SectionShell` owns the section landmark; host names it with a unique heading relationship or another appropriate accessible name. The exact heading-ID delivery remains blocked by OQ-1. A consumer-supplied heading chooses its rank and ID; a `SectionHeader` uses its `titleId` for the heading, not its root `id`.

No component keyboard handler, focus trap, focus restoration or live announcement applies. Tab/Shift+Tab and activation belong to supplied controls; consumers provide meaningful names, appropriate video/figure alternatives, visible focus and at least 44px touch targets where applicable. Interactive media must not be hidden with `aria-hidden` or blocked from focus. Contrast, zoom, keyboard and assistive technology checks are planned, not observed; no automatic accessibility enforcement is claimed.

## 6. Appearance

| Axis | Values | Rule |
| --- | --- | --- |
| Variant / size | None | One neutral shape; no branded scene variants |

**Material and tokens:** A11 specifies no exact WebSection spacing, typography, breakpoint, token or utility values. Do not infer any from scene recipes or images. `SectionShell` owns the register and paint; its inspected `sectionShellVariants` offers `pro`, `show`, `flood`, `deep`, `grafito`, default `pro`, and `wrap` default `true`; no local register is copied. Supplied controls retain their approved Material, focus and reduced-motion/transparency behavior. WebSection adds no surface recipe, handwritten shadow/gradient, inline appearance or dynamic geometry. Exact structural layout and whether a new Material recipe is necessary remain OQ-2, not a blanket transparent-frame exception.

**Class composition:** proposed root `className` supports outer margins, width constraints and parent grid/flex placement only, merged through `cn()` after root CVA; supported recognized conflicting layout utilities are tested. No part-level consumer `className` or arbitrary appearance override. `twMerge` resolves recognized conflicts only; CSS layers, specificity and external selectors can override class order. Consumer slot descendants retain their own component contracts.

**Files:** future `types.ts` (public types/CVA), `useWebSection.ts` (derive slot/root props), `WebSection.tsx` (JSX), `WebSection.test.tsx` (behavior), `WebSection.stories.tsx` (scenarios), `index.ts` (exports). No additional internal module proposed. **No stylesheet**: no meaningful compliant role identified; revisit only with a separately approved role if static utilities cannot meet the chosen layout. No token, dependency, new breakpoint or implementation is authorized.

### Expected-design visual reference

| Visual ID | Image / alt | Scenario / source | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending | Principal composition in SectionShell, wide; source and exact dimensions pending | Proposed capture, not yet captured or approved |
| VIS-02 | Pending | Narrow composition with interactive media and absent optional slots; source and exact dimensions pending | Proposed capture, not yet captured or approved |

Owner Image#11–#18 are conversation provenance for other corrections, not recoverable WebSection captures and not visual approval. Agree source and scenarios first, then separately authorize read-only preview and real-browser Playwright MCP component-zone captures under this version per [capture guide](../../../design/README.md); record actual `capture.json`, image hashes, viewport, DPR, browser/version, theme, fonts, preferences, crop, date and source version only after capture. No source, conditions or hash is invented. Review register parity, reflow and interactive content in VIS-01/02; images do not prove accessibility. Visual conformity **Not evaluated**.

## 7. Acceptance criteria

All checks are planned, not observed; U9 requires an independently approved plan and test-first execution.

| ID | Promise | Planned test / method | Story / visual check | Evidence |
| --- | --- | --- | --- | --- |
| WS-AC1 | Slots render in header → media → body → actions → social DOM order; absent slots have no wrapper; no copy injected | Public render and absence tests | Full and sparse; VIS-01/02 | Pending |
| WS-AC2 | Inside SectionShell, frame/register/wrap remain host-owned and register paint unchanged | Compare own-element computed styles and emitted CSS with and without organism in same register | Register parity; VIS-01 | Pending |
| WS-AC3 | No choreography, observer or effects import | Module graph and public API checks | Not applicable: no visual proof of imports | Pending |
| WS-AC4 | Slots add no role, name or tab stop; supplied interactive media/actions remain reachable | DOM role/name and Tab/activation integration tests | Interactive media at 390/860/1280 px; VIS-02 | Pending |
| WS-AC5 | Heading relationship satisfies selected OQ-1 contract; unique IDs and host label work | Multiple-instance role/name and ID tests after decision | Named SectionShell | Pending |
| WS-AC6 | Stable root, native forwarding, no ref/asChild, layout-only merge and no part override surface | Public DOM/type tests and recognized-conflict `cn` check; packed React 18/19 | Placement example | Pending |
| WS-AC7 | Selected token-backed layout reflows without clipping and preserves content/focus order | Packed own-element computed styles, emitted CSS and browser checks at 390/860/1280, zoom and long content | VIS-01/02 | Pending |
| WS-AC8 | Four existing scene exports and stories remain unchanged | Public barrel and existing scene tests; no migration | Existing scenes | Pending |

### Blocking owner decisions

- **OQ-1 — heading ID:** A11/U9 ask WebSection to forward `id` to a heading, but a neutral `ReactNode` header can be a fragment, text, multiple elements or a component such as SectionHeader whose heading uses `titleId`; blindly forwarding to a wrapper does not put it on the heading. Choose (A) host supplies the heading ID directly inside `header` and `SectionShell` references it, omitting WebSection `id` (changes A11/U9); or (B) retain `id` and approve an explicit compatible header contract/adapter specifying how it reaches exactly one heading, including fragment/absent-header handling (narrows neutral-slot promise). Neither option is assumed implemented.
- **OQ-2 — exact layout:** A11 prescribes slot shape but no geometry or approved visual source. Choose (A) approve a proposed token-backed neutral layout after a design source and exact responsive values are reviewed, or (B) explicitly adopt a structural-only unpainted flow and define any required spacing and responsive behavior. Do not inherit a scene's breakpoints or Material recipe silently.
- **G5:** decide exact five slot mappings, particularly interactive `media` vs `scene-media`, and whether `actions`/`social` retain narrower existing meanings. Record scoped convention approval separately; no registry mutation in this task.
- **G4 / visual:** provide or authorize a recoverable visual source, capture conditions and captures, then approve exact v0.2 payload and identified visual hashes. Approval of this spec is not approval of a separately proposed implementation plan or of token/dependency changes.

**Closure:** open; no approval, implementation, browser result or publication is claimed.
