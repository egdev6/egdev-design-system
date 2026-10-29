# Component contract — Panel

- **Version / status:** v0.1 — Draft; T4 / S8, issue #180. Specifications only.
- **Approval / recovery:** Canonical snapshot in this file; identical draft at `.playwright-mcp/specs/iteration/panel.md`. Agent-applied decisions are recommendations under delegation, not approval of this exact snapshot, any host amendment or an implementation plan.
- **Current situation / pending decisions:** New molecule over the current exported Surface primitive. No Panel/ModuleCard/Popover/Dialog React exports exist in this checkout. Promise decisions applied below; visual evidence, exact approval and peer amendment review remain pending.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: sha256:0ac728fb3c4586ca1720a289d738852e6c436f543e7df90ae00122be74d0cb25`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/180`; `latestPublishedComment: Pending — local snapshot, no comment published`.
- **Hash definition:** SHA-256 of UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, LF endings and final newline; preceding metadata is excluded.

## 1. Purpose and scope

- **Need / non-goals:** A static content unit with composable Header/Body/Footer and optional tonal bands. The same content can sit on a page or inside a Popover/Dialog. It does not open, dismiss, portal, position, trap focus, validate fields, fetch usage, calculate progress, generate domain rows or turn the whole card into an action.
- **Cataloging decision / alternatives:** **Extract/composition; molecule in `@egdev/ui`**, proposed `packages/ui/src/molecules/panel/`. Reuse: Surface paints a box but has no coordinated zones. Variant: adding semantic content slots to Surface would broaden the primitive's responsibility. App composition repeats the generic bands/zone arrangement of ModuleCard and the owner reference. Extract that structural composition, retaining ModuleCard's specialized named module/status/actions contract. Independent content zones and shared band layout make Panel a molecule, not a larger Surface primitive or an entire page organism.
- **Evidence:** Inspected `packages/ui/src/primitives/surface/{types.ts,useSurface.ts,Surface.tsx,index.ts}`, `packages/ui/src/index.ts`, package manifest, token source and catalog. Read [ModuleCard #91](https://github.com/egdev6/egdev-design-system/issues/91), [Popover #96](https://github.com/egdev6/egdev-design-system/issues/96), [Dialog #119](https://github.com/egdev6/egdev-design-system/issues/119) bodies. Surface exports `Surface`, `surfaceVariants`, native/slotted types with tones surface-0…3/well/overlay; it is implemented despite stale shared “Gauge only” prose. Surface's padding/radius/elevation policies are not changed. Peer issue bodies are historical drafts, not current implementation evidence.

### Agent-applied decisions

- D1: API? → Four named parts: `Panel`, `PanelHeader`, `PanelBody`, `PanelFooter`; required body, optional header/footer. Use compound children, not a second set of header/footer/action props. No built-in title/status/close/action slots.
- D2: Material? → `tone: 'surface-1' | 'overlay' | 'inherit'`, default surface-1; `variant: 'default' | 'banded'`, default default. Framed tones delegate outer paint to Surface. Explicit inherit is a proposed **unpainted composition mode inside an already painted raised host**, not a new Surface tone, Gauge exception or all-purpose flat card. It prevents double overlay frames.
- D3: Hosting? → No automatic ancestor/portal detection. Page uses surface-1. A host that needs a standalone floating frame may use overlay. Existing PopoverContent already owns an overlay, and DialogContent owns a surface-2/overlay frame: Panel inside their children uses inherit; host padding/heading/actions remain host-owned. Full edge-to-edge substitution of those hosts is not promised by their current contracts.
- D4: Semantics? → Native div root and div zones, no generated landmark/name/heading. Consumer supplies the document heading rank and, when needed, a labelled section/article outside the Panel. Inside Dialog retain Dialog's required title; Panel does not compete for dialog role/name.
- D5: Banded palette? → surface-1 frame: header surface-2, inherited middle/body, footer surface-0. overlay/inherit on a surface-2 or overlay host: header surface-3, body exposes host, footer surface-1. Bands are surfaces with edge/separators, not nested cards. Missing Header/Footer creates no empty region or orphan border.
- D6: ModuleCard? → Default/banded ModuleCard composes Panel; specialized error/stopped frames reuse its package-internal part recipes where full Panel cannot represent their frame. Keep ModuleCard's existing public API, semantics/status behavior and legacy markers; do not remove ModuleCard or make generic Panel a module-domain component.
- D7: CSS/files? → CVA/cn and Surface composition, **No stylesheet**. Root context conveys only variant/tone for parts; no duplicate visibility or application state. No extra internal module, tokens or dependencies.

## 2. Anatomy and composition

| Part | Responsibility | Native / composition | Allowed content |
| --- | --- | --- | --- |
| Panel | Shared frame, variant/tone context and zone flow | Surface `div` for framed modes; native `div` for inherit | Optional Header, exactly one Body, optional Footer in this order |
| PanelHeader | Identity/context band | `div` | Consumer logo/image, heading, short Badge or related controls; valid flow content |
| PanelBody | Main content and primary actions | `div` | Free flow content, figures, labelled controls, rows, dividers, Notice, Collapsible and action buttons |
| PanelFooter | Supplementary metadata/utility band | `div` | Timestamp/context and utility controls; not an automatic page footer landmark |

- **Composition rules:** Parts belong to their nearest Panel context; nested Panels get independent contexts. One Header/Body/Footer sequence is the supported structure, not a parser that rearranges arbitrary children. Missing root for a part is a descriptive development error. DOM order stays Header→Body→Footer. Consumers must not use CSS order to reverse reading/focus order.
- **Radix:** None for passive structural zones; Surface's installed Slot remains its implementation detail. Supplied controls/disclosures keep their own native/Radix behavior. No Panel Portal or trigger; Panel is not a generic Popup primitive.
- **Markers:** New root `eg-panel`; corresponding part markers `eg-panel__header`, `eg-panel__body`, `eg-panel__footer` retained as stable anatomy markers, not arbitrary styling escape hatches. Framed root also retains `eg-surface` through actual composition. No ids used for styling and no modifier/is-* classes.

### Owner-reference composition, not a generated usage dashboard

Header contains a supplied Logo or image, native heading and a small Badge label (Badge #52 unchanged). Body contains consumer-built progress rows (ProgressBar now, MeterRow only after its own implementation), Divider boundaries where semantically appropriate, a warning Notice #93, two independent Collapsible #181 sections for consumption rhythm/history, and real Button actions. Footer contains a native time element with consumer-provided dateTime and readable timestamp, optionally one utility action. These are illustrative children, not compulsory Panel dependencies, data fields, a domain service model or new Panel props. New examples use English. Collapsible/Notice/overlay examples remain planned until each dependency has its own approved implementation.

## 3. Public API

| Part / prop | Type | Required | Default / rule | Description |
| --- | --- | --- | --- | --- |
| `Panel.children` | `ReactNode` | Yes | Supported zone sequence above | Compound composition |
| `Panel.variant` | `'default' \| 'banded'` | No | `default` | Tonal hierarchy, no behavior difference |
| `Panel.tone` | `'surface-1' \| 'overlay' \| 'inherit'` | No | `surface-1` | Explicit Material ownership/host palette |
| `PanelHeader.children` | `ReactNode` | Yes when part used | Meaningful content | Consumer-owned header anatomy |
| `PanelBody.children` | `ReactNode` | Yes | Meaningful body | Includes consumer actions; no imposed schema |
| `PanelFooter.children` | `ReactNode` | Yes when part used | Meaningful metadata/utility area | Footer can be omitted entirely |
| `className` on each part | inherited `string` | No | None | Supported external layout only |
| Own events | Not applicable | — | None | Child controls own operation events |

- **Native attributes / refs:** Each part inherits `ComponentPropsWithoutRef<'div'>` minus redeclared children, style, dangerous HTML and contentEditable; root additionally omits role/tabIndex/aria-live so it cannot become an action, dialog or duplicate live owner. Compatible ids, relationships and data attributes pass to that same native div. Root aria-label does not create an accessible region; consumers needing one render a labelled native section/article outside. No public ref, asChild, heading/title prop, open/defaultOpen/onOpenChange, elevation, padding, radius, width or portal-container API.
- **Defaults / restrictions:** Framed root uses Surface padding none/radius xl, elevation 1 on surface-1, fixed overlay elevation without passing an elevation. Parts each use --space-4 padding. Inherit requires an already painted surface-2 or overlay host (including solid overlay fallback), not a canvas or bare page; its default/banded variants are both supported. No context introspection or runtime guessing of host tone. Its transparent borderless/shadowless frame is a specifically proposed composition role and must be approved with this spec/plan, not generalized to Surface.
- **Controlled / uncontrolled:** Not applicable; variant/tone context is derived props, not interactive state. No events on incoming changes.
- **Exports:** `Panel`, `PanelHeader`, `PanelBody`, `PanelFooter` and their `*Props`, `PanelTone`, `PanelVariant` types. Private marker-free `panelHeaderVariants`, `panelBodyVariants`, `panelFooterVariants` are named exports from types.ts for internal ModuleCard reuse only, not package-barrel API. No fake Surface/Panel prerequisite is added elsewhere.

### Prop conventions and reviewed evidence

Lookup by meaning/name/aliases: [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Reuse `visual-treatment` → variant and `surface-material-tone` → tone (component-specific type includes inherit as an explicit paint-ownership choice, not an inherited Surface API value). Children/className/native attributes introduce no own convention. No new convention or naming exception; no registry edit or automatic usage registration.

`panel-header` / header and `panel-footer` / footer were considered but are **not applied props**: this API exposes named parts with React children. `heading-title`, `heading-level`, `trailing-actions`, `open-state` and `portal-container` are likewise not Panel-owned props. Child controls/headings retain their own APIs and conventions.

Reviewed current source: `{path: packages/ui/src/primitives/surface/types.ts, symbol: SurfaceProps, revision: sha256:26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6}` confirms the source component's tone/padding/radius/elevation and slotted API, not the proposed Panel types. PanelProps/PanelHeaderProps/PanelBodyProps/PanelFooterProps have no implementation source; future usages must record reviewed `packages/ui/src/molecules/panel/types.ts` symbols and real whole-file hashes. Component approval does not create a separate global convention approval or imply reviewed usages already exist.

### ModuleCard #91 reconciliation / amendment note

- Preserve ModuleCard's required title/body, article named by generated heading, level, decorative icon, localized status Badge/messages, one/two actions, supplementary footer and outer-layout className. No new ModuleCard heading/header API or service state machine.
- Default status with either variant/tone: outer named article remains `eg-module-card`; its internal Panel supplies Header/Body/Footer and one frame. Header maps icon+heading+status; Body maps original body then actions; Footer maps original supplementary metadata, omitted when absent. Retain original corresponding `eg-module-card__head/__icon/__name/__body/__actions/__foot` markers on the appropriate content elements, without nesting another article or another Surface frame. Panel div zones do not create landmarks.
- `variant` and `tone` map to Panel's existing default/banded and surface-1/overlay. ModuleCard #91's error frame requires danger border while keeping Material; its stopped frame is unpainted/dashed and forbids banded/overlay. Do **not** force these through Panel className overrides or add module-status props to Panel. For error/stopped, ModuleCard owns its existing specialized frame and reuses Panel's package-internal marker-free zone recipes. Error keeps bands and token elevation; stopped keeps its distinct unpainted dashed treatment. This bounded exception means shared structure/recipes, not a promise that every ModuleCard state renders a literal Panel root.
- Amend #91 D8–D10/anatomy/appearance dependency to Panel for bands rather than duplicate Surface-band logic; adjust future tests for normal/error/stopped structures and legacy marker continuity. D10's unsupported stopped combinations, recovery actions and no automatic speech remain unchanged. Preserve its no-root-hover/no-whole-card-activation promise and wide as outer grid placement.
- ModuleCard remains a specialized molecule, not renamed/removed. This local note does not edit #91, approve a changed snapshot or implement it; a separately authorized versioned amendment comment and reviewed plan must bind the new composition.

### Host compatibility: no invented overlay APIs

Popover #96 Content already renders Surface overlay with md padding and no public ref/asChild/unstyled API. Supported Panel composition is **inside its children with tone inherit**, preserving the named dialog, Radix focus/dismissal/positioning and existing content padding; it is not an edge-to-edge replacement of PopoverContent. Dialog #119 similarly owns required title, description, built-in Close, optional actions, scrim and frame: Panel inherit sits in its body without another dialog role or duplicate primary title/actions. A later whole-frame/edge-to-edge host refactor needs a separate host amendment, not a hidden new asChild option. Host title can describe the panel's content; avoid redundant duplicate headings. Hosting from any opening mechanism does not make that mechanism Panel's responsibility.

## 4. Behavior

| Initial state / action | Expected result | Event |
| --- | --- | --- |
| Default Header/Body/Footer | One surface-1 frame, normal-flow zones | None |
| Banded surface-1 | Upper surface-2, middle surface-1, lower surface-0 | None |
| Overlay or supported inherit, banded | Upper surface-3, middle host/overlay, lower surface-1 | None |
| Header/Footer absent | No empty band, padding region or orphan separator for that zone | None |
| Children operate | Their native/Radix behavior remains; Panel does not close/open or intercept them | Child event only |
| Hover/focus/content update | No root lift, automatic announcement or root focus movement | None |
| Overlay host closes | Host controls unmount/focus restoration, not Panel | Host event only |
| Part without Panel | Descriptive developer error; no guessed palette/context | None |

- **Representation:** Root data-variant/data-tone expose presentation; own visibility/selected/invalid state does not exist. Use static data/group-data variants where appropriate, never mirror child Radix state into Panel classes.
- **Limits:** Consumers choose valid zone cardinality/order, semantic headings, free-body content and action behavior. Panel imposes no fixed dashboard width, forced scroll viewport, sticky footer, responsive breakpoint or data normalization. Parent bounds/scrolling remain parent-owned; do not clip child focus rings.

## 5. Accessibility

- Root/zones have no dialog/banner/contentinfo semantics. A page region uses a consumer section/article with useId-based aria-labelledby pointing to a real supplied heading; heading rank follows the document outline, never a visual-size prop on Panel. Host Dialog/Popover retains its own name and relationships.
- No focus stop, keyboard handlers, trap or close control is added. Tab follows body controls then footer utility in DOM order. Error/stopped specialization belongs to ModuleCard, not aria-invalid/aria-disabled on Panel. Embedded Collapsible, links/buttons, labelled progress and Notice own their semantics.
- Static Panel emits no live region; warning Notice must remain the sole owner of its own announcement. Footer timestamps are consumer text/time markup, not a polling/announcement engine. No color-only status is invented.
- Header/content/actions wrap and remain readable at zoom/narrow widths. Avoid root overflow-hidden: it would clip focus and outlying indicators; band rounding uses first/last corners rather than hiding the whole subtree. Consumer-supplied controls meet mobile target sizes independently.

## 6. Appearance

| Axis | Values | Default / restrictions |
| --- | --- | --- |
| variant | default, banded | default; all tones |
| tone | surface-1, overlay, inherit | surface-1; inherit requires a raised surface-2/overlay host |
| Geometry | Intrinsic width/height; --space-4 per zone; radius-xl frame | No public size or numeric dimensions |

- **Surface ownership:** Framed root renders current Surface with padding none/radius xl. surface-1 uses elevation 1; overlay passes no elevation and retains strong hairline, edge-strong + elev-3, blur-overlay/saturation and solid surface-2 fallbacks for reduced transparency/unsupported filters. Panel does not copy this engine. Inherit renders a native unpainted div with zero padding/border, no shadow/image or backdrop; it exposes the already painted host, does not claim to be a Surface, and adds no overlay layer. This specific role is proposed for approval, not inferred from Gauge's exception.
- **Bands:** Header uses Surface's existing exported surfaceVariants for surface-2 (or -3), elevation 0, radius none and padding none, then bounded perimeter composition: remove side/top/bottom card borders except its bottom hairline, retain sheen/light edge. Footer uses existing surface-0 (or -1), elevation 0/radius none/padding none, then keep top hairline only and suppress decorative inner edge/image for the recessed lower band. No invented well shadow on the footer. Body paints no surface. All bounded perimeter/band composition belongs to Panel's owned static CVA; consumer className is not the mechanism.
- **Layout / tokens:** Root flex column, min-w-0, font-sans/text-body-default/fg-default; each zone `p-4`, Body flex-column/gap-4, Header/Footer wrapping layout with gap-3. Consumers lay out their rich header children. Header/Footer round only the exposed frame corners using --radius-xl (if Header absent, Body owns the top exposed corners; if Footer absent, Body owns bottom corners). No full-root clipping or hover transform. Unbanded zones expose root material without independent frames/borders.
- **Motion / focus:** No container animation or hover lift; child focus/motion remain child/host-owned. Static Panel has no focus treatment to replace child focus. Overlay fallbacks come from Surface unchanged. No dynamic geometry, inline appearance, generated class interpolation or new tokens.
- **Class composition:** CVA in types.ts, per-part cn in hook helpers. Root className permits outer margins/grid placement/width; part className permits external alignment and consumer content-grid layout only, not removing padding/bands/radius/focus safety or overriding Material. Root/part markers survive merges. Test recognized merges and real cascade; twMerge does not guarantee arbitrary last-class precedence.
- **Six meaningful files:** `types.ts` (four own/native types, frame/layout/marker-free zone CVA); `usePanel.ts` (typed variant/tone-only context, per-part cn/Surface props, missing-context diagnostic); `Panel.tsx` (JSX-only root/zones/context provider); `Panel.test.tsx`; `Panel.stories.tsx` (`Molecules/Panel`, autodocs, no play); `index.ts` (named exports, no private context/recipe barrel exports). **No stylesheet.** No extra modules or packages. JSDoc controls select variant/tone, false + specific composition-story reasons for ReactNode children; annotate only actual constant defaults and every own declaration.

### Expected-design visual reference

| Visual ID | Real image / English description | Scenario | Source / version | Status |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending — logo/title/badge header, progress rows, divider, warning, disclosures, actions and timestamp footer | Principal owner-reference anatomy, banded solid page panel | Owner screenshot described in `odd/tasks/component-iteration.md` L2; actual image bytes/conditions not forwarded | visual reference: pending; textual provenance only |
| VIS-02 | Pending — same structural content inside painted Popover/Dialog hosts without a second frame | inherit default/banded, overlay solid fallback | #96/#119 composition proposals; not current rendered examples | Proposed, no captured/adopted image |

- Playwright MCP unavailable. Do not invent screenshot files, hashes, source image version or visual approval. Viewport/DPR/browser/theme/fonts/motion/transparency/crop/date remain unrecorded. Actual component-zone captures and metadata belong under this version folder before a conformity claim. Owner-reference product copy/layout is anatomy input, not a mandate for token inference from pixels. VIS-01 maps AC-01/02/07; VIS-02 maps AC-05/07. **visual: not evaluated**.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Story / visual | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Header→Body→Footer order and omitted optional zones yield no orphan band/separator | Panel.test.tsx DOM order/cardinality fixtures; browser corner checks | Default, BodyOnly, WithoutFooter; VIS-01 | Planned, not run |
| AC-02 | Banded palettes and default Surface ownership match section 6, with no duplicated outer frame | CVA/Surface prop tests + computed CSS, all tone/variant combinations | Banded, OverlayBanded; VIS-01 | Surface source inspected; Panel not implemented |
| AC-03 | Native relationships/data attrs stay on their part; root adds no landmark/focus/live engine | Role/id/tab-order/userEvent/source assertions | PageRegion, InteractiveBody | Planned, not run |
| AC-04 | Isolated part errors and nested Panel contexts are explicit and independent | Hook/compound render tests | NestedPanels | Planned, not run |
| AC-05 | Popover/Dialog remain behavior/paint owners; inherit adds no second frame, name or close engine | Future host integration and actual browser focus/dismissal checks | InPopover, InDialog; VIS-02 | Peer contracts read; no invented host API |
| AC-06 | ModuleCard normal/banded composes Panel; error/stopped retain specialized contract and markers | Future ModuleCard regression, status matrix and source import review | ModuleCardDefault/Error/Stopped | Amendment specified; no peer writes |
| AC-07 | Rich owner anatomy fits/wraps at narrow widths/zoom; corners and bands do not clip focus | Browser zoom/narrow/contrast, fallback and focus-ring checks | UsageComposition, LongContent; VIS-01/02 | Planned, not run |
| AC-08 | Supported per-part merges retain markers/Material; recipes do not leak Panel markers to ModuleCard | Direct CVA/cn and actual DOM/cascade tests | LayoutComposition | Planned, not run |
| AC-09 | Bounded exports/native types, own controls and compiled static CSS work in packed consumers | AST/docgen/enhancer/browser Controls, CSS build/scan, packed React 18/19 consumer without Tailwind | Default and compound examples | Planned, not run |

### Spec closure

- [x] Seven blocks, host-agnostic static responsibility and recommended choices complete.
- [x] Exact registry reuse/rejected mappings and reviewed source evidence recorded; registry untouched.
- [x] ModuleCard reconciliation and current host limitations explicit; Surface remains a box.
- [ ] Visual evidence, ModuleCard amendment review and exact-snapshot approval pending.
- [ ] Separate implementation/host integration plan approval pending; no code readiness implied.

**Next step:** owner reviews this digest-bound proposal and the explicit inherited-frame/band recipes, then reviews the bounded ModuleCard amendment and actual visuals. Implementation and any host amendment require separate approved plans; no code, token/dependency mutation, GitHub write or commit is authorized here.
