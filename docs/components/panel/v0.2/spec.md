# Component contract — Panel

- **Version / status:** v0.2 — Draft; preparation for #180, not implemented.
- **Approval / recovery:** [Proposal approval](https://github.com/egdev6/egdev-design-system/issues/180#issuecomment-6516515172) authorizes detailed preparation over Surface, explicitly not ModuleCard migration. Parent-supplied issue body and fully paginated `commentHistory` were inspected in `/tmp/egdev-remaining-odd/180.json` (one historical comment). Neither that decision nor roadmap approval adopts this exact contract, specimen or [separate draft plan](implementation-plan.md).
- **Current situation / pending decisions:** Surface and Popover are implemented/exported at baseline `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`; Panel and Dialog are not exported. Shared “Gauge only / future Surface” prose is stale against this source, not authority to invent prerequisites. Exact contract, inherited composition/band recipe, visual adoption and separate plan approval remain pending.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: sha256:98d1cc3aa4fa81040f001476a334e1436e2d78f86f1a93cf7a23220b02917e06`; `visualHashes: Pending — no captures`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/180`; `latestPublishedComment: Pending — v0.2 unpublished`. Historical proposal comment above is not a detailed-spec snapshot.
- **Hash definition:** SHA-256 of UTF-8 payload from `## 1. Purpose and scope` through EOF, LF endings and final newline; metadata above is excluded. Specimen and plan identities are recorded in [capture-request.json](capture-request.json), not invented PNG/runtime hashes.
- **History:** [v0.1](../v0.1/spec.md) is preserved byte-for-byte (whole-file SHA-256 `ad29de6a9035caea7271e1916a47ee0ad6b968e3a67e7aa10a0110a60aac322f`). This consolidation removes the proposed ModuleCard amendment/private recipe-sharing commitment, corrects current availability, bounds native props and inheritance, and clarifies inner corners. No public Panel API exists to migrate.

## 1. Purpose and scope

- **Need:** Static, generic Header/Body/Footer composition with optional tonal bands on a page or inside a separately owned raised host. No dashboard schema, status calculation, title generation, actions API or automatic host detection.
- **Non-goals:** Opening, dismissal, portals, positioning, keyboard/focus management, live announcements, landmarks, scrolling engine, fixed dimensions, ModuleCard migration or host amendments. Children own their controls and data.
- **Cataloging recommendation:** Compose/extract a molecule in `@egdev/ui`, proposed `packages/ui/src/molecules/panel/`. Reuse Surface for frame paint; Surface alone lacks coordinated zones. Adding slots/behavior to Surface broadens a primitive. Generic independent content zones justify the proposed molecule; ModuleCard remains its separate named/status-bearing article, not a prerequisite to extract or modify. App-only composition is the fallback if this generic unit is declined. No new Radix package: passive div zones have no interaction primitive to reimplement.
- **Reviewed evidence:** Public barrel `packages/ui/src/index.ts`, Surface `types.ts`, `useSurface.ts`, `Surface.tsx`, `index.ts` and [Surface evidence](../../surface/v0.1/implementation-evidence.md); ModuleCard `types.ts`, `useModuleCard.ts`, `ModuleCard.tsx`; Popover `types.ts`, `Popover.tsx`; ListItem `useListItem.ts` and `lib/cn.ts`. The catalog is provisional; source availability wins. Existing implementation/evidence is not Panel approval or newly observed validation.

## 2. Anatomy and composition

| Public part | Responsibility | Rendered element / paint | Allowed children |
| --- | --- | --- | --- |
| `Panel` | Presentation context and ordered flow | One Surface div for framed tones; native unpainted div for inherit | Optional Header, exactly one Body, optional Footer, in that DOM order |
| `PanelHeader` | Supplied identity/context | Native div; band recipe only when banded | Consumer heading of appropriate rank, artwork, badge, related controls |
| `PanelBody` | Main content and primary actions | Transparent native div | Free flow content; controls keep their own semantics |
| `PanelFooter` | Supplementary metadata/utility content | Native div; lower band only when banded | Supplied text/time and related utility controls |

- Parts must render as direct DOM siblings under their Panel. Fragments that introduce no DOM are supported; intervening wrappers, repeated/misordered zones and a missing Body are unsupported consumer composition, not parsed/reordered/repaired by Panel. Part children can be arbitrary valid flow content. Empty optional content should omit the entire part; rendering an empty part intentionally retains its padding. No content-emptiness heuristic.
- Each part reads only its nearest Panel's normalized tone/variant. Nested Panels are allowed inside a Body with independent context, but a second frame must represent a genuinely distinct unit, never a workaround for host paint. An isolated part throws `Panel parts must be rendered inside Panel.` in every build. No runtime child-tree validator or effect-based registration.
- Stable proposed markers: `eg-panel`, `eg-panel__header`, `eg-panel__body`, `eg-panel__footer`. Framed roots inherit `eg-surface` through real Surface composition; band recipes may also inherit that marker. Markers are not an override API. Root-owned `data-variant` / `data-tone` describe presentation, not interaction state; there is no Panel `data-state`.
- No `Panel.Header` namespace, Slot/asChild API, generated heading, built-in close button or action/footer prop. Four named components only.

## 3. Public API

| Part / own prop | Complete type | Required | Default / absence rule |
| --- | --- | --- | --- |
| `Panel.children` | `ReactNode` | Yes | Supported compound sequence; no fabricated default |
| `Panel.variant` | `PanelVariant = 'default' \| 'banded'` | No | `default` |
| `Panel.tone` | `PanelTone = 'surface-1' \| 'overlay' \| 'inherit'` | No | `surface-1` |
| Each Header/Body/Footer `children` | `ReactNode` | Yes when used | Meaningful supplied content; no generated copy |
| Each component `className` | Inherited `string` | No | None; bounded layout support in section 6 |
| Own events / controlled state | Not applicable | — | No state, initialization props or notifications |

**Exact native surface:** Each component inherits `ComponentPropsWithoutRef<'div'>`, omitting `children`, `style`, `dangerouslySetInnerHTML`, `contentEditable`, `role`, `tabIndex`, `aria-label`, `aria-labelledby`, `aria-live`, `aria-modal`, `aria-disabled`, `aria-selected`, `aria-pressed`; children are redeclared as above. Retain compatible native attributes such as `id`, `dir`, `lang`, `title`, `aria-describedby` and `data-*`, forwarded to that part's actual div. Native event handlers pass through unchanged for observation; whole-container activation/keyboard behavior is unsupported. No public refs (Surface's ref ability is not inherited), `asChild`, disabled, size, padding, radius, elevation, open, header/footer/actions or host-tone API. Owned data-tone/data-variant win over conflicting passthrough values. Protected attributes/ref/style are also stripped at untyped boundaries; arbitrary event handlers/custom CSS cannot be made safe by typing alone.

**Normalization:** Omitted/undefined variant and unknown untyped variant resolve to default. Omitted/undefined tone and unknown untyped tone resolve to surface-1; inherit is explicit only. Parts have no own tone/variant. No ancestor inspection, computed-style lookup or inference from portal location. Invalid supported structure remains unsupported rather than silently repaired.

**Exports:** `Panel`, `PanelHeader`, `PanelBody`, `PanelFooter`; `PanelProps`, `PanelHeaderProps`, `PanelBodyProps`, `PanelFooterProps`, `PanelTone`, `PanelVariant`. Context/hooks/CVA recipes stay package-private; no ModuleCard-sharing export. React 18/19 consumption must be verified later, not inferred from native types.

### Prop naming and source identity

Consult [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Meaning/name/aliases reviewed: `visual-treatment` → variant and `surface-material-tone` → tone; both entries have empty aliases/exceptions and existing scoped approvals in [atom naming approval](../../../decisions/prop-naming-atom-specs-approval.json). Component-specific inherit is a paint-ownership proposal, not a new global convention or Surface tone. `panel-header` / header and `panel-footer` / footer were checked but not applied as props; compound children do not introduce those APIs. No new conventions, exceptions, registry writes or automatic promotions.

Reviewed source observation: `{path: packages/ui/src/primitives/surface/types.ts, symbol: SurfaceProps, revision: sha256:26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6}`. Surface exposes tone/elevation/padding/radius/asChild, not Panel's proposed types. Additional reviewed whole-file hashes: `useSurface.ts` `e0e836e7dc7d471b2f0d87ada35b87e4097c2f15144f43e5e0ced732cec249cc`; `Surface.tsx` `8173b47ef3645fbd09d58608558d97ea5524910960a3068f1d769c8f994cb143`; public `src/index.ts` `08908ee7c034a211f2b6c252f7bb258865be1e31ec3f166e9ece7747a91bfa73`. No Panel source exists; future usage records need manual symbol review and the actual future whole-file hash, never a predicted hash. Naming approval does not approve this contract.

## 4. Behavior

| Input / situation | Observable result | Event |
| --- | --- | --- |
| Defaults | One surface-1 frame; div zones in supplied order | None |
| variant/tone changes | Presentation updates; same child behavior, no open/close transitions | None |
| Optional Header or Footer absent | No DOM, padding or separator for that part; remaining end corners resolve locally | None |
| Body only | One padded content area, no band separators | None |
| Explicit inherit | No second frame, blur or shadow; fixed raised-host band palette | None |
| Child button/link/disclosure operates | Child event/default behavior untouched; no close/toggle interception | Child-owned only |
| Root hovered / content changes | No lift, animation, focus movement or automatic announcement | None |
| Isolated part / nested Panel | Exact error above / independent nearest context | None |

No loading/error/disabled/selected state machine. Panel never disables descendants. Consumer/host owns width, bounded scrolling, data validity, heading hierarchy and long content. No global listeners, effects or timers. It does not make an inaccessible child accessible.

## 5. Accessibility

- Root and all zones are generic divs, not section/article/header/footer/dialog landmarks; no implicit role, name, tabindex, live region or generated IDs. A consumer needing a named region supplies a labelled section/article outside, using its own `useId()` relationship to a real heading inside. Native `title` remains a tooltip attribute, not a heading/name API.
- No keyboard handler, focus stop/trap/restoration or roving navigation. Native/Radix controls retain their own keys and DOM tab order (header controls → body controls → footer controls). Host Popover owns Escape, outside interaction and focus return. No Panel keyboard/focus script is justified.
- No status is communicated by band color alone; bands indicate hierarchy, not state. Child warning/status semantics and announcements remain child-owned. Dates/localization are consumer content; no timestamp polling.
- Intrinsic flow, min-width zero and wrapping support narrow view/zoom. Keep overflow visible so child focus rings are not cut off; mobile target sizes belong to supplied controls. Browser/AT/contrast/zoom results are Pending, not proven by the specimen.

## 6. Appearance

| Axis | Values / default | Responsibility |
| --- | --- | --- |
| variant | default / banded; default default | Same geometry/semantics; only band paint/separators differ |
| tone | surface-1 / overlay / inherit; default surface-1 | Explicit paint owner, never automatic host inference |
| geometry | Intrinsic; radius-xl frame; space-4 per zone | No public numeric dimensions or additional presets |

### Exact paint and hierarchy

| Tone | Outer owner | Default zones | Banded Header / Body / Footer |
| --- | --- | --- | --- |
| surface-1 | Real `Surface tone='surface-1' elevation={1} padding='none' radius='xl'` | Transparent, expose root | surface-2 + sheen/edge / expose root / surface-0, no sheen/edge |
| overlay | Real `Surface tone='overlay' padding='none' radius='xl'`, no elevation prop | Transparent, expose overlay | surface-3 + sheen/edge / expose overlay / surface-1, no sheen/edge |
| inherit | Native div, zero border/padding, transparent, no image/shadow/backdrop | Transparent, expose host | surface-3 + sheen/edge / expose host / surface-1, no sheen/edge |

- Surface source is the frame engine: raised hairline + `--shadow-edge` / `--shadow-elev-1`; overlay strong hairline + `--shadow-edge-strong` / `--shadow-elev-3`, `--blur-overlay`, existing saturation recipe. Overlay must be genuinely floating, not a cosmetic page variant. Preserve Surface's solid surface-2 reduced-transparency/unsupported-filter fallback. Surface currently has no overlay sheen image; Panel must not add one.
- Banded Header/Footer are native divs composing exported `surfaceVariants` at elevation 0, padding none, radius none, followed by owned bounded perimeter utilities. Header removes top/side borders, keeps only bottom hairline and existing sheen/light edge. Footer removes bottom/side borders, keeps only top hairline and explicitly removes image/shadow. Neither band is an independently elevated nested card or nested Surface component. Body never calls Surface/its recipe. Default zones have no paint or separators.
- Inherit requires an already painted surface-2 or overlay host, including a solid overlay fallback. It does not support canvas/surface-0/surface-1 as an inferred palette. Host owns all outer border, shadow, clipping and radius. Panel cannot remove host padding, title, close/actions or replace host content. Existing PopoverContent renders Surface overlay with md padding; place Panel inherit inside its children and preserve that padding. No edge-to-edge/unstyled/asChild Content API exists. Dialog is a future host, not an importable integration example here.
- Root: flex column, min-w-0, gap-0, p-0, overflow-visible, font-sans/text-body-default/fg-default. All zones: p-4/min-w-0/wrap-anywhere. Body: flex column/gap-4. Header/Footer: wrapping row, items-center/gap-3. Child heading typography is consumer-owned; no visual heading engine.
- Corners: only the first rendered zone gets top corners and only the last gets bottom corners. Framed zones use `calc(var(--radius-xl) - var(--border-width))` to sit inside the Surface hairline; inherit zones use `--radius-xl` as local band geometry, not a promise to match the host's outer corners. Middle joins remain square. First/last selectors on direct zones avoid registration state. Never use root overflow-hidden to conceal bad corners. Body-only remains transparent; no orphan line appears when optional parts are absent.
- Static CVA utilities in types.ts, per-part `cn()` in hooks; no handwritten runtime Material engine or generic Surface clone. **No stylesheet.** No extra internal modules, tokens, dependencies, inline appearance or dynamic geometry. Token source reviewed: `packages/tokens/src/theme.css`, SHA-256 `62d10992ae654e34e83d9d11bcf35da29e56c905648015f2415ebdca59bf6ab8`.
- No Panel animation/hover/pressed/focus/disabled treatment. Child/host motion/focus/transparency policies remain theirs; inherited Panel adds no independent translucent layer. Reduced motion does not alter this static structure.

### Supported merge boundary

Each root/part composes `cn(ownedRecipe, className)` (framed root also receives Surface's recipe through Surface). Root className supports width/max-width, outer margins and parent grid/flex placement; parts support content grid/alignment layout without changing order. Root additions such as `w-full` / `col-span-full` compose without replacing frame utilities; recognized conflicts in supplied layout classes (e.g. `m-2 m-4` → `m-4`) resolve through current cn/twMerge. Header/Footer permit `items-center` → `items-start`; Body permits a content grid layout. These specific supported merges require tests. Padding/gap/radius/overflow/Material/typography/state overrides and removing stable markers are unsupported, not magically blocked by cn. No universal “last class wins”: custom selectors, arbitrary groups, CSS layers and conditional variants require actual cascade checks. Preserve protected owned props after rest spread. Apps needing other appearance request a variant rather than clone/override the recipe.

### Files and proposed visual evidence

Six meaningful future files: `types.ts` (public types/JSDoc and private CVA); `usePanel.ts` (normalization, typed context/part hooks, protected passthrough, cn and Surface props); `Panel.tsx` (JSX-only four components/provider); `Panel.test.tsx`; `Panel.stories.tsx`; `index.ts` (named public exports only). No extra modules or CSS. Required children use `@control false` with a specific composition-story reason; optional tone/variant use `@control select` and bare constant `@default` tags. No invented defaults for native/required props.

[Static specimen](specimen.html) is authored design, not React/runtime output or adopted expected design. It links `/tokens.css`; parent must serve compiled canonical tokens and record their actual hash and loaded fonts. Preview-only CSS restates the inspected Material recipe for static comparison, not permission to copy it into production. No scripts, icons or runtime behaviors are supplied.

| Visual ID | Proposed image / English intent | Specimen selector / scenario | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending — one quiet frame with three supplied zones | `[data-capture="default"]`; default/surface-1 | Proposed, no PNG/adoption |
| VIS-02 | Pending — raised header and lower footer hierarchy | `[data-capture="banded"]`; banded/surface-1 | Proposed, no PNG/adoption |
| VIS-03 | Pending — floating frame versus inherited host, no double frame | `[data-capture="hosts"]`; overlay default/banded and inherit default/banded | Proposed, no PNG/adoption |
| VIS-04 | Pending — body-only, missing header, missing footer corners | `[data-capture="optional"]`; banded/surface-1 | Proposed, no PNG/adoption |

Conditions are proposed in [capture-request.json](capture-request.json): desktop/narrow, dark canonical theme, actual browser/version/DPR/fonts, motion/transparency and crops to be recorded by parent. Source version is this v0.2 HTML, not a future runtime build. Historical screenshot descriptions in v0.1 are textual provenance only; no source PNG/conditions were forwarded. No claimed screenshot hashes, native receipts or visual tolerance. **Visual conformity: Not evaluated.** Parent captures real component zones and obtains recoverable owner adoption tied to contract/HTML/PNG hashes; snapshots alone do not test behavior or AT.

## 7. Acceptance criteria

All methods below are planned future checks, not executed runtime evidence.

| ID | Observable promise | Functional / structural method | Story / browser method | Observed now |
| --- | --- | --- | --- | --- |
| AC-01 | Four named parts, defaults and supported order; optional omissions leave no wrapper/line/padding | Panel DOM/hook tests for full, no-header, no-footer, body-only and rerender | Default, OptionalParts; VIS-01/04 | Contract/specimen authored only |
| AC-02 | All six tone×variant combinations have exactly one external paint owner | Surface props/recipe assertions; inherit has no outer Surface/blur; Body has no recipe | ToneMatrix; VIS-02/03, computed paint/fallbacks | Surface/API source inspected |
| AC-03 | End-only corners, square joins, no clipped focus or phantom bands | Per-part CVA + first/last DOM fixtures, no overflow-hidden | Narrow/zoom/RTL/focus-at-edge; VIS-02/04 | No browser result |
| AC-04 | Generic div semantics; compatible native props reach correct div; protected ones do not override | Roles/tabindex/live/style/ref/type-negative and JS-boundary tests; child event/Tab tests | ChildControls, PageRegion; browser accessibility tree | Not run |
| AC-05 | No inferred host, keyboard/focus/open engine; Popover preserves name/frame/padding/dismissal | Host integration fixture using existing API; no global listeners; type-negative open/asChild | InPopover; real Escape/outside/Tab/focus return; no Dialog runtime claim | Popover source inspected |
| AC-06 | Nearest context isolates nested Panels; orphan parts throw exact error | Nested differing tones/variants; isolated Header/Body/Footer and invalid enum tests | NestedPanels | Not run |
| AC-07 | Bounded layout merges preserve markers and Material | Direct cn/CVA invariants, owned data attrs, per-part supported merge tests (not full snapshots) | LayoutComposition, computed CSS/layers | cn source inspected |
| AC-08 | Own prop docs, public exports and distributable utilities match contract | AST + real docgen/enhancer diagnostics, type fixtures, CSS static scan/build, packed consumers without Tailwind on React 18/19 | Real Controls widgets; no manual argTypes/play | Not run |
| AC-09 | No peer migration, tokens/dependencies, style engine or invented screenshot claims | Scoped diff + six meaningful file/exports audit | Owner reviews exact snapshot and real captured visuals | Preparation touches four allowed files only |

### Closure and remaining decisions

- Recommended exact contract: four named static parts, default/banded × surface-1/overlay/inherit as above, no refs/asChild/landmarks, no ModuleCard/host edits. Pending owner approval of this digest.
- Recommended Material decision: approve only the bounded inherited unpainted composition role, fixed raised-host palette and token-derived end corners; do not infer a general flat Surface exception. Pending.
- Recommended visual step: parent hosts this immutable specimen with compiled tokens, records capture conditions/hashes, then requests explicit adoption or a bounded revision. All VIS IDs pending.
- [Implementation plan](implementation-plan.md) is separately reviewable and conditional, not an execution grant. No token/dependency prerequisite is requested. Runtime test-first work starts only after contract, visuals and separate plan approval; no runtime readiness claim here.
