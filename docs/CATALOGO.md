# Catálogo de componentes

Aproximación de cómo encaja cada componente de EGDEV Foundation en la nueva arquitectura: nivel, paquete y primitiva de Radix sobre la que se construye.
No es definitivo: es el punto de partida para recatalogar con la skill `component-cataloging`.

Se genera con `python scripts/build_catalog.py` a partir de `scripts/catalog_data.py`. Edita los datos, no este archivo.

## Resumen

| Acción | Componentes |
|---|---|
| mover | 36 |
| mantener | 30 |
| nuevo | 23 |
| extraer | 12 |
| fusionar | 3 |
| separar | 3 |
| componer | 2 |
| renombrar | 2 |
| absorber | 1 |

| Destino | Componentes |
|---|---|
| @egdev/ui | 74 |
| @egdev/effects | 3 |
| Mando | 6 |
| Cadencia | 1 |
| Web (egdev.es) | 27 |
| Criterio | 1 |

Leyenda de acciones: **mantener** (sigue igual), **renombrar**, **separar** (un componente se parte en varios), **extraer** (sale una pieza nueva de otro), **fusionar** (dos o más pasan a uno), **absorber** (pasa a ser variante o preset de otro), **mover** (cambia de paquete), **nuevo** (falta y hace falta), **componer** (documented composition recipe, not a standalone component).

## @egdev/ui

### Primitivas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Slot** | — | Slot | — | nuevo | Implemented pure re-exports: `Slot`, `Slottable` and type `SlotProps` from `@radix-ui/react-slot`. No host, root marker or stylesheet; composing components expose `asChild`. Contract: [#103](https://github.com/egdev6/egdev-design-system/issues/103). |
| **VisuallyHidden** | — | VisuallyHidden | — | nuevo | Implemented React primitive under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/112#issuecomment-6251584644): screen-reader-only content with Radix-owned hiding geometry, required children, asChild and an HTMLElement ref to the actual HTML host. No stylesheet or appearance variants. Legacy hidden-content rules are unchanged. |
| **Surface** | — | Slot | — | nuevo | Implemented in @egdev/ui: static Material v2 box with tones `surface-0…3`, `well` and `overlay` (solid reduced-transparency fallback), elevation 0–3 on raised tones, padding and radius presets, and `asChild`. Token-backed CVA, no stylesheet. Gauge keeps its own transparent native frame. Contract: [#106](https://github.com/egdev6/egdev-design-system/issues/106). |
| **Stack / Cluster** | — | Slot | — | nuevo | Implemented in @egdev/ui: Stack (vertical flow, no wrap) and Cluster (wrapping row) with exact spacing-token gaps and flex alignment. Contract: [#105](https://github.com/egdev6/egdev-design-system/issues/105). |
| **Text / Heading** | Title + Eyebrow (átomo) | Slot | — | fusionar | Implemented in @egdev/ui: Text (paragraph eyebrow by default, or any title recipe with Slot `asChild`) and Heading (native h1–h6 from `level`, independent of its `section`/`hero`/`show`/`display`/`inverse` recipe), with an optional trailing accent and canvas/raised tone. No stylesheet; legacy `.eg-title`/`.eg-eyebrow` rules are unchanged. Contract: [#108](https://github.com/egdev6/egdev-design-system/issues/108). |
| **Divider** | Divider (átomo) | Separator | — | mantener | Implemented passive span via Radix Separator with decorative default and horizontal/vertical orientation. Token-backed brand rule; no public children, ref or asChild. Legacy `.eg-rule` and `--vertical` remain unchanged. Contract: [#83](https://github.com/egdev6/egdev-design-system/issues/83). |
| **AspectRatio** | — | AspectRatio | — | nuevo | Implemented in @egdev/ui: unpainted responsive media geometry using Radix AspectRatio. See issue #78; consumer compositions own media semantics and Material. |
| **Portal** | — | Portal | — | nuevo | Implemented unstyled out-of-tree div with eg-portal, ready custom container and forwarded div ref. No focus, positioning, presence or z-index policy; Radix-specific components keep their own portals. Contract: issue #97 v0.1. |
| **Label** | — | Label | — | nuevo | Implemented native form label via `@radix-ui/react-label`: `field`/`choice` typography, `eg-label`, native association and forwarded label ref. No stylesheet or `asChild`; future Field composes it. Contract: [#87](https://github.com/egdev6/egdev-design-system/issues/87). |
| **Skeleton** | — | — | — | nuevo | Implemented React primitive under the [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/102#issuecomment-6251558042) plus the approved v0.2 delta: decorative placeholder in line/block/circle silhouettes with token preset sizes, hidden semantics and host-owned loading/busy state. On-by-default decorative opacity pulse with reduced-motion always static; consumers may pass pulse={false}. No stylesheet or Radix base. |

### Átomos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Button** | Button (átomo) | Slot | Icon, Spinner | mantener | Implemented React atom: labelled native action or Radix Slot child, four Material treatments, md/sm sizes, decorative start/end icon (Button-only naming exception) and focus-retaining loading Spinner. Native disabled or guarded disabled child; React 18-compatible forwardRef. No stylesheet or dependencies added; legacy classes unchanged. Icon-only actions and split/join API remain out of scope. Contract: [#53](https://github.com/egdev6/egdev-design-system/issues/53). |
| **IconButton** | IconButton (átomo) | Slot + AccessibleIcon | Icon | mantener | Implemented React icon-only action under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/57): required hidden label and decorative ReactElement icon, ghost/outline/primary/secondary treatments, 32/40/48px control presets, native button or Slot-composed link, forwarded root ref and disabled activation guard. No stylesheet; legacy eg-icon-btn and eg-btn--icon consumers are unchanged. Tooltip composition and browser visual checks remain deferred. |
| **Toggle** | — | Toggle + AccessibleIcon | Icon | nuevo | Implemented in @egdev/ui: persistent pressed button with visible text and optional leading icon, or required icon and accessible label; sm/md/lg, controlled/uncontrolled Radix state and forwarded button ref. Selected Material treatment via token-backed CVA; no stylesheet or asChild. IconButton remains a distinct one-shot action. Contract: [#74](https://github.com/egdev6/egdev-design-system/issues/74). |
| **Link** | Link (átomo) | Slot + VisuallyHidden | Icon | mantener | Implemented in @egdev/ui: standalone borderless brand-colored native anchor with a centered 16px right arrow and reduced-motion-safe rightward hover movement, safe external new-tab semantics and a localizable hidden notice. Slot/Slottable support router anchors and forwarded refs. No stylesheet; legacy `.eg-link` remains unchanged. Contract: [#61](https://github.com/egdev6/egdev-design-system/issues/61). |
| **Icon** | Icon (átomo) | AccessibleIcon | — | mantener | Implemented in @egdev/ui: one inline glyph from the closed 42-name set (25 Foundation plus 17 Lucide additions, including check, minus and plus) with sm/md/lg presets, optional currentColor fill and an optional label through Radix AccessibleIcon; decorative by default. No stylesheet; legacy `.eg-icon*` rules are unchanged. Contract: [#58](https://github.com/egdev6/egdev-design-system/issues/58). |
| **Input** | Field (input) (átomo) | — | Spinner | extraer | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/59): bare native single-line text control in the Material well (md 44px, sm 36px), extracted from Field. `variant='code'` (not `mono`, D8) uses the mono font on the darker well; optional decorative leading icon and trailing loading Spinner. Loading sets aria-busy without preventing editing; consumers own announcements. Native aria-invalid, onChange and forwarded ref; label, hint, error and counter stay in the future Field molecule. No stylesheet. |
| **Textarea** | Field (textarea) (átomo) | — | — | extraer | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/73): bare native multi-line textarea with `variant` default (well), code (mono well on neutral-950) and prose (raised sheet), vertical-only resize above the variant minimum, native aria-invalid and a forwarded textarea ref. Label, hint, error and counter belong to Field. No stylesheet. |
| **Select** | Field (select) (átomo) | Select | Icon | extraer | Implemented single-choice React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/67): data-driven text options, controlled/uncontrolled values, native form participation, forwarded trigger button ref and Radix-owned portal/keyboard/focus/ARIA. Token-backed field well and overlay; md/sm sizes. Composes Icon chevron/check. No stylesheet, open-state API, asChild or public subcomponents. Legacy native select styles unchanged. |
| **Checkbox** | `.eg-check` (sin ficha) | Checkbox | Icon | extraer | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/54): bare 18px Radix checkbox with binary/mixed state, decorative Icon check/minus glyphs, native form integration and a forwarded button ref. Consumers own naming, labels and the 44px touch target. Token-backed well/filled CVA recipes; no stylesheet or asChild. Legacy `.eg-check` unchanged. |
| **Switch** | `.eg-check--switch` (sin ficha) | Switch | — | extraer | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/72): bare 36×20 on/off switch with immediate effect over Radix Switch (`role="switch"`, Space/Enter, hidden form input). Off is a recessed well with a grey thumb; on uses the primary gradient, `--shadow-btn-primary` and a black thumb moved 16px. `onCheckedChange` (`checked-change`), forwarded button ref, no own label or size axis. Legacy `.eg-check--switch` untouched. No stylesheet. |
| **Slider** | Field --range (átomo) | Slider | — | extraer | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/68): single-value horizontal range control over Radix Slider (ring size, thresholds, volume). Required label names the thumb; optional valueText sets aria-valuetext and aria-describedby reaches the thumb. Material well track, brand range and raised thumb with the focus ring; 44px hit area on coarse pointers. Visible label and readout belong to Field. No stylesheet. |
| **RadioGroup** | — | RadioGroup | — | nuevo | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/66): exclusive choice among short text options from a data-driven `options` array over Radix RadioGroup, named by `label`, vertical or horizontal arrow axis, form `name`/`required`. Unchecked circles are Material wells; the checked one takes the primary gradient, bevel and halo with a black dot. `radioGroupVariants` exposes per-part recipes for SelectTile parity. No stylesheet. |
| **Chip** | Chip (átomo) | Toggle | — | mantener | Implemented in @egdev/ui under the approved v0.1 contract: always-pressable pill on Radix Toggle with controlled/uncontrolled pressed state, an optional decorative leading icon and the sheen/edge raised recipe with red-tinted glow when on. Public chipVariants for the future ChipGroup (ToggleGroup.Item). No ref, asChild, size axis or stylesheet; the Avatar variant (D5) is deferred and legacy `.eg-chip` is unchanged. Contract: [#55](https://github.com/egdev6/egdev-design-system/issues/55). |
| **Badge** | Tag + StatusBadge (átomo) | — | — (consumer-supplied decorative icon) | fusionar | Implemented in @egdev/ui: passive span label with six tone families, soft/solid treatments, a decorative ReactNode icon slot and the label-default pill recipe. No automatic Icon dependency, ref, asChild or stylesheet. Legacy `.eg-tag` and `.eg-status` remain unchanged. Contract: [#52](https://github.com/egdev6/egdev-design-system/issues/52), v0.1 D7. |
| **Indicator** | Avatar corner badge (internal part) | — | Icon | extraer | Implemented public working-tree React atom under the [approved v0.2 contract](components/indicator/v0.2/spec.md): passive dot/count/icon marker on a direct-children anchor, physical corners, safe-integer counts and overflow text. Marker semantics stay decorative and consumer content owns meaning. Compact token Material; no stylesheet, ref or asChild. Parent unit, metadata, build and packed React 18.3.1/19.3.0 checks passed; runtime browser/AT conformity remains pending. Badge is unchanged. |
| **FieldMessage** | Field message (internal part) | — | Icon | extraer | React atom extracted from Field: plain text, description/info/warning/success/error tones, derived decorative status glyphs and native announcement opt-in only. No validation, ref/asChild, surface or stylesheet. Field retains hint/error and adds hintTone. Contract: [#179](https://github.com/egdev6/egdev-design-system/issues/179), [v0.2](components/field-message/v0.2/spec.md). |
| **StatusDot** | StatusDot + LiveDot (átomo) | — | — | fusionar | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/71): decorative aria-hidden dot fusing StatusDot and LiveDot. Status states running/idle/warning/error/stopped (default) are 8px with a surface ring; live/standby are 10px with the hot glow and a motion-safe pulse (pulse={false} for static). Migration: LiveDot → state='live', LiveDot--static → pulse={false}, waiting → state='standby'. status-dot.css holds only the pulse keyframes. |
| **Kbd** | Kbd (átomo) | — | — | mantener | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/60): one key or shortcut glyph as native inline kbd text with a flat hairline treatment (label-default recipe, secondary text). Optional label gives symbol keys a spoken name through Radix VisuallyHidden and hides the glyph. Combos are consumer composition. No stylesheet. |
| **Avatar** | Avatar (átomo) | Avatar | Icon; source-private Indicator geometry | mantener | Implemented in @egdev/ui under the approved v0.1 contract: passive identity disc with Radix-managed photo loading and immediate user-icon fallback, sm/md/lg/xl sizes, an optional decorative network badge and paused presentation. Root label owns the accessible name; decorative without it. No initials, interaction, ref, asChild or stylesheet. Contract: [#51](https://github.com/egdev6/egdev-design-system/issues/51). The separately approved Indicator amendment now shares source-private geometry/glyph/position recipes only, not the public wrapper or standalone paint. Public types, markup, ring and paused policy remain unchanged; browser-measured migration parity is still pending. |
| **Logo** | Logo (átomo) | — | — | mantener | Implemented React atom under the [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/62): V4 isotype (mark) or isotype with white name (wordmark) as inline SVG data with the --logo-red/--logo-red-shade token inks, 28/32/36px heights, named span image or native link with the focus ring. No asChild, ref or stylesheet; legacy eg-logo CSS untouched. |
| **ProgressBar** | ProgressBar (átomo) | Progress | — | mantener | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/65): passive Radix Progress bar in percent (clamped 0–100; non-finite values are indeterminate with an empty fill). `label` announces the progressbar, otherwise it is decorative. `size` sm hairline or lg goal well with gradient fill and token bevel, `variant` muted for comparison series and sm-only `edge` strip. Fill scaled through `--eg-progress-value`. No stylesheet. |
| **Gauge** | Gauge (átomo) | — (native role=meter) | Native transparent geometry frame | mantener | Currently implemented React component: one passive circular 0–100 measurement with optional decorative center and consumer-selected normal, warning, critical or muted state. Own transparent native frame uses existing tokens, not Surface. Effective contract: [v0.10 amendment](components/gauge/v0.10/transparent-interior-amendment.md), [v0.9 amendment](components/gauge/v0.9/composition-amendment.md) and [base](specs/gauge.md). Not task progress, multiple rings or a dock API; no Radix dependency. |
| **Stat** | Stat (átomo) | — | — | mantener | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/70): one live figure in a native div role=group named by its visible label (label → value → optional delta). Numbers and strings render unformatted; value={null} shows a hidden em dash with readable unavailableText. Consumer-timed highlighted emphasis (brand border and glow, light edge kept), md/sm figures on the --text-display-stat(-sm) tokens. Own Material elevated-card recipe with token utilities; Text is not composed (no matching recipe). Drops legacy --glass (D2). No Radix base, ref, asChild or stylesheet. |
| **Dropzone** | Dropzone (átomo) | — | Icon | mantener | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/56): native button with a hidden sibling file input and decorative upload Icon. Drag depth, focused paste and picker reset deliver files through onFiles; accept constrains the picker only, validation and announcements belong to the consumer. Square or inline dashed transparent target, no form file participation, ref, asChild or stylesheet. VisuallyHidden is not needed (D2). |
| **Tooltip** | — | Tooltip | Portal | nuevo | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/75): supplementary plain text for one asChild trigger on Radix Tooltip, with its own provider, Radix default delays and its own portal (no separate Portal primitive). Material overlay bubble with solid surface-2 under reduced transparency, opacity fade without transform. Needed by IconButton, ModuleRail and Gauge. No stylesheet. |
| **Spinner** | — | — | — | nuevo | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/69): indeterminate open-arc indicator at the Icon scale (sm/md/lg), inherited currentColor, one turn per second through the --animate-spin token and static under reduced motion. Optional label makes a polite status region with Radix VisuallyHidden text; without it the spinner is decorative. No stylesheet. |
| **SearchTrigger** | SearchTrigger (molécula) | — | Icon, Kbd, Surface | mantener | Implemented React atom under [approved v0.2 contract](https://github.com/egdev6/egdev-design-system/issues/99): native type=button launcher on the Surface well recipe with a decorative 16px search Icon, visible label that is also the accessible name and an optional aria-hidden Kbd hint; compact keeps the name. Native onClick and forwarded ref let a host Dialog Trigger wrap it; the host owns the palette, shortcut binding and focus. Button is not composed (D1). Keeps eg-search; no stylesheet. |
| **PhotoFrame** | PhotoFrame (molécula) | AspectRatio | Surface | mantener | Implemented passive framed image with native figure and caption; approved v0.2 contract and v0.3 plan. Visual review pending. |
| **PullQuote** | PullQuote (molécula) | — | — | mantener | Implemented React atom under [approved v0.2 contract](https://github.com/egdev6/egdev-design-system/issues/98): native figure > blockquote > p with an optional figcaption source outside the passage. Pull (brand logical-start filet, 40ch measure) or display (uppercase display scale, block accent); both stay quotations, never headings. Plain-string text/accent/source, native cite on the blockquote only, raised tone changes the accent only. Quote typography and measure tokens; no Text composition (D2), Radix, ref or stylesheet. |
| **Countdown** | Countdown (molécula) | — | — | mantener | Implemented React atom under [approved v0.2 contract](https://github.com/egdev6/egdev-design-system/issues/82): passive role=timer readout (aria-live=off) of days/hours/minutes/seconds to a Unix-ms deadline, with readable deadlineText in a native time element. Deterministic SSR initializing text, client-only clock sampling, ceil rounding, latched expiry and onExpire once per deadline episode. Native elements with token recipes (`text-countdown-md/sm`, countdown spacing); Text is not composed (D11). No Radix, stylesheet, ref or asChild. |

### Moléculas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Field** | Field (átomo) | Label + Slot | Label, VisuallyHidden, FieldMessage, Input\|Textarea\|Select\|Slider\|Checkbox\|Switch | separar | Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/84): coordinates one control with a required visible/hidden label, FieldMessage hint or replacing error, non-error hintTone, optional counter and Slider readout. Stacked/choice layouts, child-first Slot descriptions, compatible-child invalid semantics and single disabled opacity per owned part. Controls own value, interaction and Material; FieldMessage annotation paragraphs, no implicit live region, stylesheet, ref or asChild. The [v0.2 amendment](components/field/v0.2/message-amendment.md) preserves existing hint/error inputs. |
| **Menu** | MenuList (popup) (molécula) | DropdownMenu | Icon, Kbd, Surface recipe | separar | Implemented data-driven action menu under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/89) plus A1/A2: action/link/separator/label entries, one submenu level, optional non-interactive header and controlled/uncontrolled visibility. Radix owns trigger keys, focus, ARIA, portals and collision handling; Escape closes the entire menu. Shared Surface overlay recipe, decorative Icon and display-only Kbd. No stylesheet, native forwarding, ref or public subcomponents; legacy menu styles unchanged. |
| **ChipGroup** | — | ToggleGroup | Chip (chipVariants recipe) | nuevo | Implemented React molecule under [approved v0.1 + A1](https://github.com/egdev6/egdev-design-system/issues/81): named single/multiple filter pills, Radix-owned selection and horizontal looping roving focus. Reuses chipVariants without nesting Chip; selected labels add a token underline. Unpainted wrapping root; no form API, ref, asChild, stylesheet or extra internal modules. A1 changes Storybook value/defaultValue metadata only. |
| **ButtonGroup** | `.eg-btn-split` (sin ficha) | — | Button, IconButton (consumer children) | extraer | Implemented under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/79): passive div role=group with optional label, spaced wrapping or attached logical inner corners and focus stacking. Children own Material, sizing, refs and interaction; no built-in Menu or arrow navigation. No stylesheet; legacy split/join rules remain. Browser visual conformity not evaluated. |
| **Tabs** | Tabs (molécula) | Tabs | Surface well recipe; own counter part | mantener | Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/107): data-driven horizontal sibling views with Radix-owned automatic activation, keyboard/focus/ARIA and controlled/uncontrolled selection. Underline md/sm or single-height segmented list composing the existing Surface well recipe; raw neutral/danger counters are owned parts, not Badge overrides. Inactive contents unmount while hidden panel wrappers preserve relationships. No public parts, ref, asChild or stylesheet; legacy `.eg-tabs*` remains unchanged. |
| **NavList** | MenuList --nav (molécula) | Collapsible | Icon, Badge, StatusDot, VisuallyHidden, Surface recipe | separar | Implemented named in-flow navigation under [approved v0.2 contract](https://github.com/egdev6/egdev-design-system/issues/92): native links, consumer-supplied aria-current, static groups and independent Radix disclosures, raw counters, readable tags/signals/warnings. Current rows compose surfaceVariants; the host owns the panel and routing. Entry discriminant kind; no stylesheet, ref, asChild, tree/menu semantics or route inference. Legacy MenuList navigation remains unchanged. |
| **HoverCard** | — | HoverCard | Surface overlay; internal Radix Portal | nuevo | Implemented in @egdev/ui under [approved v0.1 + A1](https://github.com/egdev6/egdev-design-system/issues/86): supplementary read-only rich link preview with controlled/uncontrolled Radix state, native hover/focus timers and collision bounds. Surface owns overlay Material; Gauge remains passive inside a separate named anchor. A1 retains Radix touch cancellation: usage requires a separate persistent details link outside the trigger for touch users. No stylesheet, public content ref, presence or delay API. |
| **Popover** | — | Popover | Surface; Radix-owned Portal | nuevo | Implemented under [approved v0.1 plus A1/A2](https://github.com/egdev6/egdev-design-system/issues/96): named click-open dialog with Root, Trigger, internally portalled Content and Close. Radix owns state, ids, focus, dismissal and placement; modality-only context derives aria-modal. Content composes Surface overlay without copying its recipe. Native/slotted button refs; Button Trigger retains idle/loading state and exposes visibility through aria-expanded (A2). No custom Content id, stylesheet or extra public helpers. Visual conformity remains Not evaluated. |
| **Notice** | Notice (molécula) | — | Surface recipe, Icon; consumer Button/Link actions | mantener | Implemented React molecule under [approved v0.1 + A1 contract](https://github.com/egdev6/egdev-design-system/issues/93#issuecomment-6503388441): persistent single-owner status/alert, required summary, five tones, md/sm sizes and optional actions. Shared noticeVariants inherits eg-surface only; Notice adds eg-notice separately. No stylesheet, dismissal, ref or asChild. FieldMessage #179 independently reuses semantic tokens; Notice/Toast runtime recipes remain unchanged. |
| **Toast** | — | Toast | Notice recipe, Portal, Icon, IconButton; consumer Button action | nuevo | Implemented React molecule under [approved v0.1 + A1 contract](https://github.com/egdev6/egdev-design-system/issues/110): declarative ToastProvider and Toast with five tones, localized announcements, native Radix timers/pause/swipe/F8 and viewport focus after focused dismissal. Shared noticeVariants preserves inherited eg-surface without eg-notice; opaque floating elevation, 48px close and supported Button md action. No stylesheet, imperative queue, ref or asChild. Browser visual conformity not evaluated. |
| **ListItem** | PostCard (molécula) | Slot | Surface recipe; consumer Badge, Button, IconButton, Icon, Link | renombrar | Implemented compound React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/88): generic card/compact/row with Body, Content, Media, Footer, Meta and Actions. Host-selected status snapshots include new, failed, done, empty, dragging and off; visible status words and domain transitions belong to the consumer. Surface recipes supply the elevated frame and passive thumbnail well. Empty is one slotted native action; no drag engine, ref API or stylesheet. Legacy PostCard CSS remains unchanged. |
| **SelectTile** | SelectTile (molécula) | RadioGroup.Item / ToggleGroup.Item | Surface recipes, AspectRatio, Badge | mantener | Implemented React molecule under [approved v0.1 contract and metadata amendment A1](https://github.com/egdev6/egdev-design-system/issues/101): data-driven single radio or multiple toggle selection, six media ratios, decorative thumbnail fallback, independent live badge and sibling stretched native controls. Surface recipes own card/well Material; Badge remains unmodified. Single supports native form name/required; multiple consumers serialize values. Root layout-only className, no ref/asChild/renderer, no stylesheet. Legacy .eg-tile remains unchanged; visual conformity Not evaluated. |
| **Timeline** | Timeline (molécula) | ScrollArea | Avatar, Badge, Icon, VisuallyHidden; Surface well recipe | mantener | Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/109): read-only named events region or chat log, native ordered list, stable consumer ids and supplied order. Radix ScrollArea owns bounded vertical scrolling (sm/md/lg); no auto-follow, sorting, command parsing or secondary announcer. Visible Moderator/Command Badges, readable platform text and optional decorative sm Avatar. Host-owned highlighting and live-off history updates; unpainted content, externally hosted Material, scrollbar well composed from surfaceVariants. No stylesheet, ref or asChild. |
| **PageHeader** | — | — | Stack, Button, ButtonGroup | nuevo | Implemented compact product heading (#94 v0.1): native h1–h6, optional eyebrow and unchanged supplied actions; intrinsic wrapping, no paint or stylesheet. Separate from editorial SectionHeader. |
| **ModuleCard** | ModuleCard (molécula) | — | Surface recipes, Badge, Icon; consumer Button/Link/IconButton | mantener | Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/91): passive article named by its generated h1–h6, readable status Badge, free body and independent actions/footer. Solid/overlay Material and tonal bands compose Surface recipes; error retains Material with a danger border, stopped is an unpainted dashed frame. Wide is parent grid placement. No Panel composition or migration, stylesheet, ref, asChild, process state or whole-card activation. Legacy styles unchanged; visual conformity not evaluated. |
| **SectionHeader** | SectionHeader (molécula) | — | Heading, Text, Divider | mantener | Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/100): passive editorial header with stack/split/inline arrangements, section-scale Heading, optional eyebrow/accent/lede and a decorative inline Divider. Split starts at the approved 860px breakpoint; missing lede/eyebrow collapses split/inline to stack. Distinct from PageHeader: no actions or register axis. Keeps eg-section-head and eg-section-head__lede; no stylesheet. |
| **MeterRow** | — | Progress (via ProgressBar) | ProgressBar; native label/readout/help and decorative key | nuevo | Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/90): labelled task/goal completion only, never capacity, usage or arbitrary measurements. Composes one lg ProgressBar with brand/muted family, normalized decimal percent or coherent valueText, indeterminate messages and optional persistent help. Structural unpainted div, hidden visible header, useId descriptions; no Gauge, Text, Field or Surface composition. No stylesheet, ref, actions, live region or new dependency. |
| **Panel** | ModuleCard frame (design anatomy) | — | Surface | extraer | Implemented public working-tree compound React molecule under the [approved v0.2 contract](components/panel/v0.2/spec.md): Panel/Header/Body/Footer, default/banded treatment and explicit surface-1/overlay/inherit ownership. Real Surface supplies framed paint; inherit requires an already painted host. No stylesheet, ref, asChild or interaction engine; ModuleCard is not migrated. Parent unit, metadata, build and packed React 18.3.1/19.3.0 checks passed; runtime browser/AT conformity remains pending. |
| **Collapsible** | — | Collapsible | Surface, Button recipe, Icon | nuevo | Implemented public working-tree React disclosure over the already-declared Radix Collapsible 1.2.1 under the [v0.2 base](components/collapsible/v0.2/spec.md) and [approved v0.3 relationship amendment](components/collapsible/v0.3/radix-relationship-amendment.md). Fixed Surface frame, ghost/md button recipe, native state/presence and Trigger-only button ref. Closed Trigger omits aria-controls; the hidden Content shell/id remains while children unmount. No stylesheet, custom key/focus engine or dependency change; NavList is unchanged. Parent unit, metadata, build and packed React 18.3.1/19.3.0 checks passed; runtime browser/AT conformity remains pending. |
| **SocialLinks** | SocialLinks (molécula) | — (native anchors; atom-owned Slot + AccessibleIcon) | IconButton, Icon, Stack, Cluster | mantener | Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/104): named native list of validated HTTPS profile links, optional independent caption, stacked or wrapping inline layout, outline/ghost atom treatments and md/lg presets (lg touch-sized default). Per-item opt-in new context merges secure rel tokens and a localized hidden notice once. Empty/all-invalid data renders nothing; no truncation, selection, ref or asChild. Six meaningful files, no stylesheet; legacy markers/styles preserved. Visual conformity: Not evaluated. |
| **Carousel** | — | — (native scroll and bounded roving focus) | IconButton, Icon, ProgressBar, VisuallyHidden | extraer | Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/80): manually navigated read-only slides with stable string identities, bounded direction-aware keyboard navigation, native scrolling and background/media mouse dragging. Controlled requests wait for acceptance; settled user changes coordinate focus and polite status. Structural layout only; consumer Surface content owns Material. No autoplay, stylesheet, new dependencies or legacy TipsSlider migration. |
| **GaugeGroup** | — | — (native group and meters) | Shared private Gauge geometry | nuevo | Implemented in @egdev/ui under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/31): two or three independent passive readings with a decorative transparent concentric diagram and ordered visible list. No aggregate or GaugeDock extension. |
| **Dialog** | Dialog (organismo) | Dialog | Surface, ButtonGroup, Portal | mantener | Coordinates dialog content and actions as one reusable overlay interaction, not a structural page region. Retains the `sheet` variant for side panels (MobileMenu). See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation approval. |
| **AlertDialog** | — | AlertDialog | Dialog | nuevo | Coordinates a confirmation prompt and decision actions as one reusable interaction, not a structural page region. Retains destructive confirmations (delete, disconnect). See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation approval. |
| **CommandPalette** | CommandPalette (organismo) | Dialog (+ cmdk, a confirmar) | Input, ListItem, Kbd | mantener | Coordinates search input, results and command activation as one reusable interaction, not application-level structure. Radix has no combobox; cmdk over Radix Dialog remains a candidate requiring confirmation. See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation or dependency approval. |
| **Table** | Table (organismo) | ScrollArea | Checkbox, Switch, Badge, ButtonGroup | mantener | Coordinates tabular data and local sorting and selection as one reusable unit, not a structural page region. Retains the native table with sorting and selection in the hook. See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation approval. |
| **GaugeDock** | GaugeStrip (parte de Gauge) | Toolbar | Surface overlay, Gauge, Button/IconButton | extraer | Implemented in @egdev/ui under #85 v0.1: independent passive measurements beside separate native actions; Radix owns bounded roving focus. No aggregation, selection, stylesheet or legacy GaugeStrip migration. |

### Organismos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Sidebar** | — | ScrollArea | Logo, NavList, Text | nuevo | La barra lateral de todas las apps. |
| **ModuleRail** | ModuleRail (organismo (agente)) | Tooltip + NavigationMenu o ToggleGroup | Logo, IconButton, StatusDot | mantener | Raíl compacto de Mando; genérico. |
| **TabBar** | TabBar (organismo (agente)) | — | Icon, Badge | mantener | Navegación inferior móvil. |
| **CalendarGrid** | CalendarGrid (organismo) | — (arrastre: dnd-kit, a confirmar) | ListItem, Text | mantener | `.eg-day` y `.eg-post-row` pasan a partes internas. Falta vista Mes. |
| **PreviewFrame** | StageFrame (organismo) | AspectRatio + Toolbar | IconButton, Chip | renombrar | Vista previa a tamaño fijo con zonas seguras. |

### Plantillas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **AppShell** | — | — | Sidebar, ModuleRail, TabBar | nuevo | Barra lateral + contenido; móvil con TabBar. Hoy se repite en las seis apps. |

### Composition recipes

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **UserMenu** | UserMenu (molécula) | DropdownMenu | Avatar, Menu | componer | Approved six-row catalogue correction: Menu composition recipe with an Avatar trigger; no standalone UserMenu export. See [classification rules](CATALOGACION.md). Catalogue decision only; no implementation implied. |

## @egdev/effects

### Átomos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Isotipo3D** | Isotipo3D (átomo (efecto)) | — | — | mover | Decorative 3D isotype with scene, progress, opacity and pointer tilt controls, lazy three loading and an SVG fallback. Browser visual conformity and packed-consumer validation remain pending. Contract: [#47](https://github.com/egdev6/egdev-design-system/issues/47). |
| **AmbientBackground** | AmbientBackground (organismo (efecto)) | — | — | mover | Working-tree React effect under the approved v0.4 contract and implementation plan: decorative canvas particles with profile and opacity, reduced-motion fallback and a forwarded root ref. No component stylesheet or director choreography. Browser visual conformity and packed-consumer validation remain pending. Contract: [#45](https://github.com/egdev6/egdev-design-system/issues/45). |
| **Isotipo3D** | Isotipo3D (organismo (efecto)) | — | — | mover | One rendered brand-mark effect using three.js with an SVG fallback; rendering complexity does not make it a structural region or coordinate independent UI concepts. See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation or dependency approval. |

## Mando

### Átomos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Badge preset** | PermissionLevel (átomo (agente)) | — | Badge | absorber | Preset de Badge en Mando (read, write, irreversible, blocked). |

### Moléculas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **ToolCallChip** | ToolCallChip (molécula (agente)) | Collapsible | Badge, StatusDot | mover | Sube a ui si otra app aloja el agente. |
| **ConfirmCard** | ConfirmCard (molécula (agente)) | Collapsible | Surface, Badge, ButtonGroup | mover | Argumentos crudos en Collapsible. |
| **ChatMessage** | ChatMessage (molécula (agente)) | — | Avatar, Text | mover |  |
| **Composer** | Composer (molécula (agente)) | — | Textarea, IconButton, Chip | mover |  |

### Organismos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **AgentPanel** | AgentPanel (organismo (agente)) | ScrollArea | ChatMessage, ToolCallChip, ConfirmCard, Composer | mover |  |

## Cadencia

### Moléculas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **PostCard** | PostCard (Cadencia) (molécula) | — | ListItem, Avatar, Chip | mover | Composición de dominio en Cadencia sobre ListItem. |

## Web (egdev.es)

### Átomos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Pixel** | Pixel (átomo) | — | — | mover | Recurso gráfico de la web; revisar si alguna app lo usa. |

### Moléculas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **TerminalCard** | TerminalCard (molécula) | — | Surface | mover | Ficha de perfil de la web. Barra en banda `surface-2` (Grafito). |
| **NowCard** | NowCard (molécula) | — | Surface, Text | mover | Pie en banda `surface-0` (Grafito). |
| **ProjectCard** | ProjectCard (molécula) | — | Surface, Badge, Link | mover |  |
| **NoteItem** | NoteItem (molécula) | — | ListItem | mover | Valorar construirlo sobre ListItem. |
| **TipCard** | TipCard (molécula) | — | AspectRatio, Text | mover |  |
| **ArticleFeature** | ArticleFeature (molécula) | — | PhotoFrame, Text | mover |  |
| **ArticleItem** | ArticleItem (molécula) | — | ListItem | mover |  |
| **StreamItem** | StreamItem (molécula) | — | ListItem | mover |  |
| **CommunityCard** | CommunityCard (molécula) | — | Surface, Avatar, Button | mover | Cabecera en banda `surface-2` (Grafito). |

### Organismos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **TopBar** | TopBar (organismo) | NavigationMenu | Logo, SearchTrigger, UserMenu | mover |  |
| **MobileMenu** | MobileMenu (organismo) | Dialog (sheet) | NavList, SocialLinks | mover |  |
| **SectionNav** | SectionNav (organismo) | — | Link | mover |  |
| **Footer** | Footer (organismo) | — | Logo, SocialLinks, Link | mover |  |
| **Hero** | Hero (organismo) | — | Text, Button | mover |  |
| **ChapterBreak** | ChapterBreak (organismo) | — | Text | mover |  |
| **LabStage** | LabStage (organismo) | — | Surface | mover |  |
| **Closing** | Closing (organismo) | — | Text, Button | mover |  |
| **NotesBoard** | NotesBoard (organismo) | — | SectionHeader, ChipGroup, NoteItem | mover |  |
| **NowStrip** | NowStrip (organismo) | — | NowCard | mover |  |
| **BlogGrid** | BlogGrid (organismo) | — | ArticleFeature, ArticleItem | mover |  |
| **LiveBand** | LiveBand (organismo) | — | Countdown, PhotoFrame, StreamItem | mover |  |
| **CommunityGrid** | CommunityGrid (organismo) | — | CommunityCard | mover |  |
| **TipsSlider** | TipsSlider (organismo) | — | Carousel, TipCard | mover | El carrusel genérico sube a ui. |

### Plantillas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **SectionShell** | SectionShell (plantilla) | — | — | mover | `--pro`, `--show`, `--flood`, `--deep`; `--grafito` (+ `--fade-top`, `--fade-bottom`) para lectura sobre gris. |
| **HomeTemplate** | HomeTemplate (plantilla) | — | Secciones web, effects | mover |  |

### Composition recipes

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **ProjectsGrid** | ProjectsGrid (organismo) | — | ProjectCard | componer | Web composition recipe arranging ProjectCard instances; no independently specified component API or behavior beyond that composition. Not a standalone component or export. See [classification rules](CATALOGACION.md). Catalogue classification only, no implementation approval. |

## Criterio

### Application patterns

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Mark** | Mark (átomo) | — | — | mover | Approved six-row catalogue correction: Criterio application pattern, not a generic UI atom or molecule. See [classification rules](CATALOGACION.md). Catalogue decision only; no implementation implied. |

## Primitivas de Radix que se usan

`AccessibleIcon`, `AlertDialog`, `AspectRatio`, `Avatar`, `Checkbox`, `Collapsible`, `Dialog`, `DropdownMenu`, `HoverCard`, `Label`, `NavigationMenu`, `Popover`, `Portal`, `Progress`, `RadioGroup`, `ScrollArea`, `Select`, `Separator`, `Slider`, `Slot`, `Switch`, `Tabs`, `Toast`, `Toggle`, `ToggleGroup`, `Toolbar`, `Tooltip`, `VisuallyHidden`

Todas vienen del paquete unificado `radix-ui` (`import { Tabs } from 'radix-ui'`).
