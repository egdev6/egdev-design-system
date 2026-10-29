# Catálogo de componentes

Aproximación de cómo encaja cada componente de EGDEV Foundation en la nueva arquitectura: nivel, paquete y primitiva de Radix sobre la que se construye.
No es definitivo: es el punto de partida para recatalogar con la skill `component-cataloging`.

Se genera con `python scripts/build_catalog.py` a partir de `scripts/catalog_data.py`. Edita los datos, no este archivo.

## Resumen

| Acción | Componentes |
|---|---|
| mover | 35 |
| mantener | 30 |
| nuevo | 21 |
| extraer | 9 |
| fusionar | 3 |
| separar | 3 |
| componer | 2 |
| renombrar | 2 |
| absorber | 1 |

| Destino | Componentes |
|---|---|
| @egdev/ui | 69 |
| @egdev/effects | 2 |
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
| **StatusDot** | StatusDot + LiveDot (átomo) | — | — | fusionar | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/71): decorative aria-hidden dot fusing StatusDot and LiveDot. Status states running/idle/warning/error/stopped (default) are 8px with a surface ring; live/standby are 10px with the hot glow and a motion-safe pulse (pulse={false} for static). Migration: LiveDot → state='live', LiveDot--static → pulse={false}, waiting → state='standby'. status-dot.css holds only the pulse keyframes. |
| **Kbd** | Kbd (átomo) | — | — | mantener | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/60): one key or shortcut glyph as native inline kbd text with a flat hairline treatment (label-default recipe, secondary text). Optional label gives symbol keys a spoken name through Radix VisuallyHidden and hides the glyph. Combos are consumer composition. No stylesheet. |
| **Avatar** | Avatar (átomo) | Avatar | Icon | mantener | Implemented in @egdev/ui under the approved v0.1 contract: passive identity disc with Radix-managed photo loading and immediate user-icon fallback, sm/md/lg/xl sizes, an optional decorative network badge and paused presentation. Root label owns the accessible name; decorative without it. No initials, interaction, ref, asChild or stylesheet. Contract: [#51](https://github.com/egdev6/egdev-design-system/issues/51). |
| **Logo** | Logo (átomo) | — | — | mantener | Implemented React atom under the [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/62): V4 isotype (mark) or isotype with white name (wordmark) as inline SVG data with the --logo-red/--logo-red-shade token inks, 28/32/36px heights, named span image or native link with the focus ring. No asChild, ref or stylesheet; legacy eg-logo CSS untouched. |
| **ProgressBar** | ProgressBar (átomo) | Progress | — | mantener | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/65): passive Radix Progress bar in percent (clamped 0–100; non-finite values are indeterminate with an empty fill). `label` announces the progressbar, otherwise it is decorative. `size` sm hairline or lg goal well with gradient fill and token bevel, `variant` muted for comparison series and sm-only `edge` strip. Fill scaled through `--eg-progress-value`. No stylesheet. |
| **Gauge** | Gauge (átomo) | — (native role=meter) | Native transparent geometry frame | mantener | Currently implemented React component: one passive circular 0–100 measurement with optional decorative center and consumer-selected normal, warning, critical or muted state. Own transparent native frame uses existing tokens, not Surface. Effective contract: [v0.10 amendment](components/gauge/v0.10/transparent-interior-amendment.md), [v0.9 amendment](components/gauge/v0.9/composition-amendment.md) and [base](specs/gauge.md). Not task progress, multiple rings or a dock API; no Radix dependency. |
| **Stat** | Stat (átomo) | — | — | mantener | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/70): one live figure in a native div role=group named by its visible label (label → value → optional delta). Numbers and strings render unformatted; value={null} shows a hidden em dash with readable unavailableText. Consumer-timed highlighted emphasis (brand border and glow, light edge kept), md/sm figures on the --text-display-stat(-sm) tokens. Own Material elevated-card recipe with token utilities; Text is not composed (no matching recipe). Drops legacy --glass (D2). No Radix base, ref, asChild or stylesheet. |
| **Dropzone** | Dropzone (átomo) | — | Icon | mantener | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/56): native button with a hidden sibling file input and decorative upload Icon. Drag depth, focused paste and picker reset deliver files through onFiles; accept constrains the picker only, validation and announcements belong to the consumer. Square or inline dashed transparent target, no form file participation, ref, asChild or stylesheet. VisuallyHidden is not needed (D2). |
| **Tooltip** | — | Tooltip | Portal | nuevo | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/75): supplementary plain text for one asChild trigger on Radix Tooltip, with its own provider, Radix default delays and its own portal (no separate Portal primitive). Material overlay bubble with solid surface-2 under reduced transparency, opacity fade without transform. Needed by IconButton, ModuleRail and Gauge. No stylesheet. |
| **Spinner** | — | — | — | nuevo | Implemented React atom under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/69): indeterminate open-arc indicator at the Icon scale (sm/md/lg), inherited currentColor, one turn per second through the --animate-spin token and static under reduced motion. Optional label makes a polite status region with Radix VisuallyHidden text; without it the spinner is decorative. No stylesheet. |
| **SearchTrigger** | SearchTrigger (molécula) | — | Icon, Kbd, Surface | mantener | Implemented React atom under [approved v0.2 contract](https://github.com/egdev6/egdev-design-system/issues/99): native type=button launcher on the Surface well recipe with a decorative 16px search Icon, visible label that is also the accessible name and an optional aria-hidden Kbd hint; compact keeps the name. Native onClick and forwarded ref let a host Dialog Trigger wrap it; the host owns the palette, shortcut binding and focus. Button is not composed (D1). Keeps eg-search; no stylesheet. |
| **PhotoFrame** | PhotoFrame (molécula) | AspectRatio | — | mantener | Approved six-row catalogue correction: one framed-image concept; AspectRatio is a supporting primitive. See [classification rules](CATALOGACION.md). API unchanged; no implementation implied. |
| **PullQuote** | PullQuote (molécula) | — | — | mantener | Implemented React atom under [approved v0.2 contract](https://github.com/egdev6/egdev-design-system/issues/98): native figure > blockquote > p with an optional figcaption source outside the passage. Pull (brand logical-start filet, 40ch measure) or display (uppercase display scale, block accent); both stay quotations, never headings. Plain-string text/accent/source, native cite on the blockquote only, raised tone changes the accent only. Quote typography and measure tokens; no Text composition (D2), Radix, ref or stylesheet. |
| **Countdown** | Countdown (molécula) | — | — | mantener | Implemented React atom under [approved v0.2 contract](https://github.com/egdev6/egdev-design-system/issues/82): passive role=timer readout (aria-live=off) of days/hours/minutes/seconds to a Unix-ms deadline, with readable deadlineText in a native time element. Deterministic SSR initializing text, client-only clock sampling, ceil rounding, latched expiry and onExpire once per deadline episode. Native elements with token recipes (`text-countdown-md/sm`, countdown spacing); Text is not composed (D11). No Radix, stylesheet, ref or asChild. |

### Moléculas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Field** | Field (átomo) | Form.Field / Label | Label, Input\|Textarea\|Select\|Slider, Text | separar | Pasa a molécula: etiqueta + control + ayuda + error + contador. El control es un átomo aparte. |
| **ButtonGroup** | `.eg-btn-split` (sin ficha) | — | Button, IconButton, Menu | extraer | Botón dividido (`--join-start/--join-end`) y grupos de botones. |
| **ChipGroup** | — | ToggleGroup | Chip | nuevo | Filtros (múltiple) y selección exclusiva (borde de la pantalla en Quorb). |
| **Tabs** | Tabs (molécula) | Tabs | Badge (contador) | mantener | Provisional future tab-selection concept; not an implemented or importable React API. The previous reference was retired under the [Gauge v0.9 amendment](components/gauge/v0.9/composition-amendment.md); Gauge's current finish follows the [v0.10 amendment](components/gauge/v0.10/transparent-interior-amendment.md). |
| **Menu** | MenuList (popup) (molécula) | DropdownMenu | Icon, Kbd | separar | Menú desplegable con items, separadores, `--danger` y submenús. |
| **NavList** | MenuList --nav (molécula) | Accordion (grupos) / Collapsible | Icon, Badge, StatusDot | separar | Navegación lateral con grupos plegables, contadores y etiquetas `__tag`. |
| **Popover** | — | Popover | Surface, Portal | nuevo | Panel flotante al hacer clic. |
| **HoverCard** | — | HoverCard | Surface glass, Portal | nuevo | El panel de detalle de Quorb al pasar por un Gauge. |
| **Notice** | Notice (molécula) | — | Icon, Button | mantener | `role=status` o `alert`. Mantiene `--sm`. |
| **Toast** | — | Toast | Notice | nuevo | Avisos efímeros (publicado, copiado). No existe. |
| **ListItem** | PostCard (molécula) | Slot | Surface, Text, Badge, Button | renombrar | Fila/tarjeta genérica con estados (`new`, `failed`, `done`, `empty`, `dragging`, `off`) y `--row`. |
| **SelectTile** | SelectTile (molécula) | RadioGroup.Item / ToggleGroup.Item | AspectRatio, Text | mantener | Proporciones como variantes (portrait, story, square, wide, banner). |
| **Timeline** | Timeline (molécula) | ScrollArea | Avatar, Badge, Text | mantener | `--chat` para el chat en vivo. |
| **PageHeader** | — | — | Text, ButtonGroup | nuevo | Eyebrow + título + acciones. Repetido a mano en todas las apps. |
| **SectionHeader** | SectionHeader (molécula) | — | Text | mantener | Cabecera de sección en registro Show; valorar unificar con PageHeader por `register`. |
| **MeterRow** | — | Progress | ProgressBar, Text, Gauge key | nuevo | Etiqueta + valor + barra + ayuda (Quorb, egdev-live, Criterio). |
| **ModuleCard** | ModuleCard (molécula) | — | Surface, Badge, Button | mantener | `--error`, `--stopped`, `--wide`, `--banded` (cabecera y pie en banda tonal, Grafito); `--glass` pasa a Surface. |
| **SocialLinks** | SocialLinks (molécula) | — | IconButton, Cluster | mantener |  |
| **Carousel** | — | — (roving focus propio) | IconButton, ProgressBar | extraer | Sale de TipsSlider: contador, anterior/siguiente, arrastre y teclado. |
| **Dialog** | Dialog (organismo) | Dialog | Surface, ButtonGroup, Portal | mantener | Coordinates dialog content and actions as one reusable overlay interaction, not a structural page region. Retains the `sheet` variant for side panels (MobileMenu). See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation approval. |
| **AlertDialog** | — | AlertDialog | Dialog | nuevo | Coordinates a confirmation prompt and decision actions as one reusable interaction, not a structural page region. Retains destructive confirmations (delete, disconnect). See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation approval. |
| **CommandPalette** | CommandPalette (organismo) | Dialog (+ cmdk, a confirmar) | Input, ListItem, Kbd | mantener | Coordinates search input, results and command activation as one reusable interaction, not application-level structure. Radix has no combobox; cmdk over Radix Dialog remains a candidate requiring confirmation. See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation or dependency approval. |
| **Table** | Table (organismo) | ScrollArea | Checkbox, Switch, Badge, ButtonGroup | mantener | Coordinates tabular data and local sorting and selection as one reusable unit, not a structural page region. Retains the native table with sorting and selection in the hook. See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation approval. |
| **GaugeDock** | GaugeStrip (parte de Gauge) | Toolbar | Surface glass, Gauge | extraer | La tira es un `role=toolbar` con foco itinerante; Radix Toolbar lo da hecho. |

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
| **AmbientBackground** | AmbientBackground (organismo (efecto)) | — | — | mover | One decorative particle-background effect rendered with canvas; it does not coordinate independent UI concepts or define a structural region. See [classification rules](CATALOGACION.md). API unchanged; catalogue classification only, no implementation approval. |
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

`AccessibleIcon`, `Accordion`, `AlertDialog`, `AspectRatio`, `Avatar`, `Checkbox`, `Collapsible`, `Dialog`, `DropdownMenu`, `Form.Field`, `HoverCard`, `Label`, `NavigationMenu`, `Popover`, `Portal`, `Progress`, `RadioGroup`, `ScrollArea`, `Select`, `Separator`, `Slider`, `Slot`, `Switch`, `Tabs`, `Toast`, `Toggle`, `ToggleGroup`, `Toolbar`, `Tooltip`, `VisuallyHidden`

Todas vienen del paquete unificado `radix-ui` (`import { Tabs } from 'radix-ui'`).
