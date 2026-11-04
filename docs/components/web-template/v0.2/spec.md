# Component contract — WebTemplate

- **Version / status:** v0.2 — DRAFT; exact owner approval of this spec (G4) and separate naming approval (G5) pending. New component; no v0.1 WebTemplate contract.
- **Approval / recovery:** Pending. This file is the proposed recoverable snapshot; an exact scoped owner approval must identify its finalized payload digest and visual hashes. Approval of this spec would not approve implementation or a plan.
- **Current situation:** A12/U10 are proposals, not implemented or approved. Owner direction (verbatim): "El actual Home template como template lo cambiaría por webTemplate con la distribución que te mencioné (topBar/content/footer)" (S12). See [A12](../../web-catalog/v0.2/visual-amendments.md) and [U10](../../web-catalog/v0.2/implementation-plan.md). G1, G4 and G5 remain pending.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 → Pending; VIS-02 → Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/341`; `latestPublishedComment: Pending` (no published spec snapshot).
- **Hash definition:** SHA-256 of UTF-8 bytes from `## 1. Purpose and scope` through EOF, LF line endings including final newline; metadata above is excluded. A digest is not approval.

## 1. Purpose and scope

A reusable web page frame orders supplied top bar, page content and footer; it owns the main landmark and skip link, not site copy, navigation, sections, data, canvas or choreography. It is a proposed **template** in `@egdev/ui`, `packages/ui/src/templates/web-template/`. Owner-supplied organisms retain their responsibilities.

**Cataloging decision (draft, approval pending):** new structural template, composing existing pieces. Inspected `packages/ui/src/index.ts` and `templates/app-shell/{index.ts,types.ts,AppShell.tsx,useAppShell.ts}`: AppShell is exported and provides a single main and skip recipes, but docks side/bottom application navigation; it does not provide A12's topBar/content/footer contract. `templates/section-shell/types.ts` is a section frame, not a page. `packages/effects/src/home-template/{index.ts,types.ts}` exports HomeTemplate with required `zoneTable`, children and choreography, not a structural-only frame. A visual variant of either changes responsibility; composing page markup solely in the website does not provide the requested reusable template; extracting and modifying AppShell would change an independently approved surface. Reuse its existing skip recipes and message type without changing it; create this separate template. Catalog evidence: `docs/CATALOGO.md` rows AppShell, SectionShell and HomeTemplate; source barrels above are stronger evidence of exports than a catalog row.

**Evidence conflict / owner decision:** `docs/ARQUITECTURA.md`, `docs/CATALOGACION.md` and `skills/_shared/component-contract.md` say Gauge is the only public UI React component, whereas the inspected working-tree barrels and sources export AppShell, TopBar, Footer and others, and A12 explicitly requires AppShell reuse. Choose either (1) confirm the inspected exports and A12's reuse are the applicable baseline for this work, or (2) reconcile/restore the required approved availability before planning implementation. Neither statement proves a built or packed artifact. This draft does not resolve the conflict or authorize out-of-scope edits.

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix | Allowed content |
| --- | --- | --- | --- |
| Root | Page flow and stable marker | `div`; no landmark | Skip row, topBar host, main, footer in order |
| Skip | Link to own main | Native anchor using existing AppShell skip recipes and Button composition | Localized built-in text |
| topBar host | Reserve fixed-header clearance in normal flow | `div` only when supplied | Consumer node, including fixed TopBar or in-flow header |
| content | Single page main and skip destination | `<main id={useId()} tabIndex={-1}>` | Consumer content without another `main` |
| footer | No extra landmark or wrapper | Consumer node | Consumer footer/other content |

No direct Radix primitive is needed for structural layout; existing Button `asChild` composition uses its own primitive. `topBar` and `footer` are rendered untouched; supplied organisms own header/footer semantics. The skip precedes the visual regions; their order is topBar → content → footer. No automatic role, name or tab stop is added to slots. Proposed stable root marker `eg-web-template`; no public part markers or asChild API.

## 3. Public API

Proposed own declarations; exact naming and all usages require G5 independently of spec approval. [Registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), [lookup workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry).

| Prop | Type | Required | Default / rule | Responsibility |
| --- | --- | --- | --- | --- |
| `topBar` | `ReactNode` | No | absent: no host or clearance | Header region supplied by consumer |
| `content` | `ReactNode` | Yes | none | Contents of main; no nested main |
| `footer` | `ReactNode` | No | absent: no wrapper | Page footer supplied by consumer |
| `messages` | `AppShellMessages` | No | omitted `skipToContent` → `Skip to content` | Localized skip label |

`ReactNode` includes nullish and boolean nodes; **owner decision needed:** adopt null/undefined as absence (matching AppShell) with other render-empty nodes still considered supplied, or define a different explicit presence rule. Tests must pin the chosen rule; do not infer a truthiness policy. Required `content` expresses a required prop, not runtime proof of nonempty content.

- Reuse `localized-messages` → `messages` (approved convention; new usage requires G5). Reuse the existing `AppShellMessages.skipToContent` member/type, not a new text key; no matching standalone registered convention was found, so propose `skip-to-content-message` → `skipToContent?: string`, meaning localizable text/name of the skip-to-main link. Owner must approve its mapping or explicitly accept reuse only as a member of `localized-messages` without a new concept.
- Proposed concepts: `page-top-bar-slot` → `topBar?: ReactNode`, consumer page-header region; `page-main-content-slot` → `content: ReactNode`, contents of owned main; `page-footer-slot` → `footer?: ReactNode`, consumer page footer. `tooltip-content` explicitly excludes page slots and `panel-footer` excludes site footers; neither matches. `panel-header` excludes page headings. No registered exact `topBar` semantic match identified. No scoped exception is claimed; all three names and IDs are pending G5, not registry edits. If a name collision requires an exception, obtain a scoped approval rather than assuming it.
- Reviewed existing evidence: `source: {path: packages/ui/src/templates/app-shell/types.ts, symbol: AppShellProps.messages / AppShellMessages.skipToContent, revision: sha256:a38077de08175a76725986fd36f873de673304cb800d1134b90b18d80251aed4}`. New WebTemplate source/symbol/revision: Pending until implementation and review; no fictional usage receipt.

**Native props / refs:** propose `Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'dangerouslySetInnerHTML' | 'style'>` on root, plus the own props above. Forward compatible `id`, `data-*`, `aria-*`, `dir`, and native handlers to root without changing landmark semantics. No public ref or `asChild`; no raw HTML or inline style. Consumer must not override semantics through untyped props. `children` is not a second content API. This exact boundary is proposed, not an existing implementation. Controlled/uncontrolled: not applicable; no owned state or events. React 18/19 packed compatibility remains a planned check, not proven by types.

**Compatibility:** additive only; AppShell recipes/output and exports unchanged. HomeTemplate stays exported and unchanged until a separately approved website migration and breaking-removal plan; eventual website ownership of choreography is the target, not permanent legacy coexistence. No website changes are authorized here.

## 4. Behavior

| Initial state / action | Expected result | Event |
| --- | --- | --- |
| Valid content, optional regions supplied | Skip then topBar host, main, footer in document order | None |
| topBar absent | No host or reserved nav height; main follows skip in normal flow | None |
| topBar present | Host has `min-height: var(--nav-height)`; fixed TopBar gets one clearance; an in-flow header may grow the host naturally | None |
| Activate skip | Native anchor points to generated main ID; focus moves to main | No component event |
| footer absent | No footer node or empty wrapper | None |

No positioning inference or additional main padding. Headers with a different fixed height require a compatible consumer composition; automatic measurement is not promised. Slots do not inject copy, observer, listener, director, canvas, zone table or effect import. The native anchor handler needed to focus main is the sole skip interaction, not an ambient/window listener. No state, variants, timers or choreography. Consumer ensures a single page main and accessible supplied content; arbitrary ReactNode trees cannot be validated as main-free at runtime.

## 5. Accessibility

The template owns one native main, with `useId()` unique per instance and `tabIndex={-1}`; the host must render only one page template and no nested or sibling main. It does not wrap supplied landmarks in duplicate header/footer landmarks. Skip is keyboard reachable and visible on focus using AppShell's existing `appShellVariants.skip` and `.skipLink` recipes; its anchor has the localized text and targets the generated ID. Enter/click moves focus to main, which is programmatically focusable; content interactions and their names, touch sizes, focus and keyboard behavior remain consumer/organism owned. No focus trap, roving keys, live announcements or motion are introduced. Accessible behavior and browser focus/scroll remain planned checks, not observations.

## 6. Appearance

| Variant axis | Values | Default / restriction |
| --- | --- | --- |
| None | Not applicable | Structural page frame; no size, register or visual variants |

**Tokens / Material:** structural normal-flow host uses static token utility `min-h-[var(--nav-height)]` only when topBar is supplied; no extra main padding. Reuse `appShellVariants.skip` / `.skipLink` and their current values (`sr-only focus-within:not-sr-only`, `m-2`) with existing Button secondary composition, not copied recipes. No new tokens, hardcoded geometry, handwritten gradients/shadows or effects. Template does not paint a Material surface or borrow Gauge's exception; supplied organisms own their approved Material, focus and reduced-transparency behavior. No template motion; reduced motion needs no extra animation rule. No dynamic inline geometry.

**Class composition:** root `className` supports outer placement (margin/self-alignment) only, composed with `cn()` and structural invariants preserved; root `eg-web-template` remains. No consumer className surfaces on skip, host or main; consumer node classes remain their own. Plan tests of supported margin merge and protection of root marker/flow; `twMerge` resolves recognized utility conflicts only, not arbitrary selectors, custom CSS or all variants. No blanket appearance override permission. Owner must approve this proposed merge policy and native exclusions as part of G4.

**Files:** future six meaningful files: `types.ts` (props, JSDoc, CVA), `useWebTemplate.ts` (IDs, focus, slot presence, per-part `cn`), `WebTemplate.tsx` (JSX), `WebTemplate.test.tsx`, `WebTemplate.stories.tsx`, `index.ts` (named exports). **No stylesheet**; no additional internal modules. No source, registry, token or dependency changes are authorized by this draft.

### Expected-design visual reference

| Visual ID | Image / alt text | Scenario | Source and version | Status |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending — page frame with top bar, content and footer | Fixed TopBar and supplied Footer, 390 and 1280 px | Expected source and capture version pending | Proposed; not captured or approved |
| VIS-02 | Pending — content without optional regions | No topBar or footer, 390 and 1280 px | Expected source and capture version pending | Proposed; not captured or approved |

Owner Image#11–#18 are conversation provenance for other corrections, not WebTemplate captures; no viewport, theme, image files or hashes are recoverable here. Agree a real expected-design source and scenarios, authorize read-only hosting and Playwright MCP capture separately, then follow [capture guide](../../../design/README.md): component-zone PNGs and `capture.json`, browser/version, viewport, DPR, theme, fonts, motion/transparency, crop, date, source revision and hashes. Do not implement merely to capture. Owner must adopt the exact visual IDs/hashes; visual conformity is **Not evaluated**. These planned checks relate to WT-AC1/3/5 and do not establish keyboard or behavior.

## 7. Acceptance criteria

All evidence below is **Pending**; no runtime or visual validation has been performed. WT IDs follow A12; additional IDs cover remaining promises.

| ID | Observable promise | Planned test / method | Planned story / visual check |
| --- | --- | --- | --- |
| WT-AC1 | Valid composition has exactly one main, ordered topBar → content → footer | Render and query landmarks/order; demonstrate consumer no-nested-main contract | Full page, VIS-01 |
| WT-AC2 | No canvas, director, ambient listener, zone API or effects dependency | Public type/module graph and rendered DOM checks | Not applicable: structural exclusion |
| WT-AC3 | Present host reserves nav height, fixed and normal-flow headers work, main gets no extra padding | DOM and browser computed styles; compare growing header and fixed TopBar | VIS-01 at 390/1280 |
| WT-AC4 | Localized skip points to unique main and activation focuses it | Two instances for ID uniqueness; keyboard/click and fallback label assertions | Focused skip story; browser focus check |
| WT-AC5 | Absent optional slots create no wrappers or phantom clearance | Presence cases after owner selects empty-node rule; rendered DOM and computed style | VIS-02 at 390/1280 |
| WT-AC6 | Native props and supported class merge preserve root and flow; no public ref/asChild | Type/API and DOM/`cn` tests for allowed/forbidden surfaces | Not applicable |
| WT-AC7 | Existing AppShell output, public exports and HomeTemplate unchanged | U10 focused preservation test and base/current differential on AppShell and barrel | Existing AppShell story; no new visual approval inferred |
| WT-AC8 | Accessible supplied landmarks remain untouched; no automatic slot tab stops | Role/name and tab-order tests with consumer-supplied interactive content | Keyboard story |
| WT-AC9 | Token-backed utility is present in packed CSS and new API works for React 18 and 19 | Build artifact inspection and packed consumer checks after separate approval | Visual checks do not substitute |

### Spec closure

- [ ] Resolve source-availability contradiction, empty-node presence policy, native/merge policy and G5 naming choices.
- [ ] Capture and approve real VIS references with provenance; visual conformity remains Not evaluated until then.
- [ ] Finalize content digest and obtain recoverable exact G1/G4/G5 owner approvals; separately approve implementation plan. No approval is implied by issue #341 or this draft.
- [ ] Publish a full snapshot only with separate authorization; preserve prior issue history. No code, capture, registry edit, migration or external mutation is authorized here.
