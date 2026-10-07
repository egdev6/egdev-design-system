# Catálogo de componentes

Aproximación de cómo encaja cada componente de EGDEV Foundation en la nueva arquitectura: nivel, paquete y primitiva de Radix sobre la que se construye.
No es definitivo: es el punto de partida para recatalogar con la skill `component-cataloging`.

Se genera con `python scripts/build_catalog.py` a partir de `scripts/catalog_data.py`. Edita los datos, no este archivo.

## Resumen

| Acción | Componentes |
|---|---|
| mover | 35 |
| mantener | 32 |
| nuevo | 22 |
| extraer | 9 |
| fusionar | 3 |
| separar | 3 |
| renombrar | 2 |
| absorber | 1 |

| Destino | Componentes |
|---|---|
| @egdev/ui | 71 |
| @egdev/effects | 2 |
| Mando | 6 |
| Cadencia | 1 |
| Web (egdev.es) | 27 |

Leyenda de acciones: **mantener** (sigue igual), **renombrar**, **separar** (un componente se parte en varios), **extraer** (sale una pieza nueva de otro), **fusionar** (dos o más pasan a uno), **absorber** (pasa a ser variante o preset de otro), **mover** (cambia de paquete), **nuevo** (falta y hace falta).

## @egdev/ui

### Primitivas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Slot** | — | Slot | — | nuevo | Lo da Radix; se reexporta para `asChild` en todo el sistema. |
| **VisuallyHidden** | — | VisuallyHidden | — | nuevo | Sustituye el `clip: rect(0 0 0 0)` repetido en todos los lienzos. |
| **Surface** | — | Slot | — | nuevo | Material: fondo + borde + radio + sombra. `tone` (default, glass, brand, well, ghost) y `elevation` (flat, low, high). Absorbe ModuleCard --glass, Stat --glass y la tira de Gauge. Implementado como referencia. |
| **Stack / Cluster** | — | Slot | — | nuevo | Apilado vertical y fila con salto. Elimina los `display:flex; gap` en línea. |
| **Text / Heading** | Title + Eyebrow (átomo) | Slot | — | fusionar | Una primitiva tipográfica con variantes (`display`, `hero`, `section`, `eyebrow`, `show`, `inverse`). |
| **Divider** | Divider (átomo) | Separator | — | mantener | Absorbe `.eg-rule` y `--vertical`. |
| **AspectRatio** | — | AspectRatio | — | nuevo | Base de PhotoFrame, SelectTile, PreviewFrame y portadas. |
| **Portal** | — | Portal | — | nuevo | Contenido flotante (menús, diálogos, toasts). |
| **Label** | — | Label | — | nuevo | Etiqueta de formulario; la usa Field. |
| **Skeleton** | — | — | — | nuevo | Estados de carga de listas y tarjetas (tableros States). |

### Átomos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Button** | Button (átomo) | Slot | Icon, Spinner | mantener | Pierde `--icon` (pasa a IconButton). Mantiene `.eg-btn-split` como molécula ButtonGroup. |
| **IconButton** | IconButton (átomo) | Slot + AccessibleIcon | Icon | mantener | Gana `shape: square` (antes Button --icon) y `pressed`. Implementado como referencia. |
| **Toggle** | — | Toggle | Icon | nuevo | Botón conmutado (mostrar/ocultar capa, silenciar). IconButton `pressed` puede apoyarse en él. |
| **Link** | Link (átomo) | Slot | — | mantener |  |
| **Icon** | Icon (átomo) | AccessibleIcon | — | mantener | Faltan 14 iconos (ver DECISIONES). |
| **Input** | Field (input) (átomo) | — | — | extraer | Control nativo; sale de Field. Variante `mono` para código y URLs. |
| **Textarea** | Field (textarea) (átomo) | — | — | extraer | Variantes `code` y `prose` (antes Field --code y --prose). |
| **Select** | Field (select) (átomo) | Select | Icon | extraer | Select de Radix con el aspecto de Field. |
| **Checkbox** | `.eg-check` (sin ficha) | Checkbox | Icon | extraer | Existía solo como clase. |
| **Switch** | `.eg-check--switch` (sin ficha) | Switch | — | extraer |  |
| **Slider** | Field --range (átomo) | Slider | — | extraer | Tamaño del anillo, umbrales, volumen. |
| **RadioGroup** | — | RadioGroup | — | nuevo | Grupo de opciones exclusivas; base de SelectTile y de chips exclusivos. |
| **Chip** | Chip (átomo) | Toggle / ToggleGroup.Item | Avatar | mantener | Siempre interactivo (filtro o selección). Los grupos van en ChipGroup. |
| **Badge** | Tag + StatusBadge (átomo) | — | Icon | fusionar | Etiqueta estática con `tone` (neutral, info, success, warning, danger, brand) e icono opcional; `solid`. |
| **StatusDot** | StatusDot + LiveDot (átomo) | — | — | fusionar | LiveDot pasa a `StatusDot state='live'` (con pulso y `--static`). |
| **Kbd** | Kbd (átomo) | — | — | mantener |  |
| **Avatar** | Avatar (átomo) | Avatar | — | mantener | Radix Avatar da el fallback a iniciales mientras carga la imagen. |
| **Logo** | Logo (átomo) | — | — | mantener |  |
| **ProductMark** | — | — | — | nuevo | Letra o marca de producto con `gradient-btn-primary` + `shadow-btn-primary` (M, C, L, Cr, Mt, Q). Hoy está copiada a mano en cada app. |
| **ProgressBar** | ProgressBar (átomo) | Progress | — | mantener | Radix Progress da `role=progressbar` y los aria-value*. |
| **Gauge** | Gauge (átomo) | Progress (uno por anillo) o role=img | — | mantener | Revisar si exponer cada anillo como Progress o el conjunto como imagen con etiqueta. |
| **Stat** | Stat (átomo) | — | Text | mantener | Pierde `--glass` (usa Surface). |
| **Mark** | Mark (átomo) | — | — | mantener |  |
| **Dropzone** | Dropzone (átomo) | — | Icon, VisuallyHidden | mantener | Input file nativo oculto con VisuallyHidden. |
| **Tooltip** | — | Tooltip | Portal | nuevo | Hace falta para IconButton, ModuleRail y Gauge. No existe. |
| **Spinner** | — | — | — | nuevo | Carga en Button y estados de espera (Stack & Flow usa spinners-react). |

### Moléculas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Field** | Field (átomo) | Form.Field / Label | Label, Input\|Textarea\|Select\|Slider, Text | separar | Pasa a molécula: etiqueta + control + ayuda + error + contador. El control es un átomo aparte. |
| **ButtonGroup** | `.eg-btn-split` (sin ficha) | — | Button, IconButton, Menu | extraer | Botón dividido (`--join-start/--join-end`) y grupos de botones. |
| **ChipGroup** | — | ToggleGroup | Chip | nuevo | Filtros (múltiple) y selección exclusiva (borde de la pantalla en Quorb). |
| **Tabs** | Tabs (molécula) | Tabs | Badge (contador) | mantener | `variant`: underline o segmented (Material v2, para 2–4 opciones cortas). Implementado como referencia. |
| **Menu** | MenuList (popup) (molécula) | DropdownMenu | Icon, Kbd | separar | Menú desplegable con items, separadores, `--danger` y submenús. |
| **NavList** | MenuList --nav (molécula) | Accordion (grupos) / Collapsible | Icon, Badge, StatusDot | separar | Navegación lateral con grupos plegables, contadores y etiquetas `__tag`. |
| **UserMenu** | UserMenu (molécula) | DropdownMenu | Avatar, Menu | mantener | Es Menu con Avatar de trigger; podría ser solo un ejemplo de Menu. |
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
| **ModuleCard** | ModuleCard (molécula) | — | Surface, Badge, Button | mantener | `--error`, `--stopped`, `--wide`; `--glass` pasa a Surface. |
| **SearchTrigger** | SearchTrigger (molécula) | — | Button, Kbd | mantener | Abre CommandPalette. |
| **SocialLinks** | SocialLinks (molécula) | — | IconButton, Cluster | mantener |  |
| **PhotoFrame** | PhotoFrame (molécula) | AspectRatio | — | mantener |  |
| **PullQuote** | PullQuote (molécula) | — | Text | mantener |  |
| **Countdown** | Countdown (molécula) | — | Text | mantener | También útil en egdev-live. |
| **Carousel** | — | — (roving focus propio) | IconButton, ProgressBar | extraer | Sale de TipsSlider: contador, anterior/siguiente, arrastre y teclado. |
| **GaugeDock** | GaugeStrip (parte de Gauge) | Toolbar | Surface glass, Gauge | extraer | La tira es un `role=toolbar` con foco itinerante; Radix Toolbar lo da hecho. |

### Organismos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **Dialog** | Dialog (organismo) | Dialog | Surface, ButtonGroup, Portal | mantener | Variante `sheet` para paneles laterales (MobileMenu). |
| **AlertDialog** | — | AlertDialog | Dialog | nuevo | Confirmaciones destructivas (borrar, desconectar). |
| **CommandPalette** | CommandPalette (organismo) | Dialog (+ cmdk, a confirmar) | Input, ListItem, Kbd | mantener | Radix no tiene combobox; cmdk es la opción habitual sobre Radix Dialog. |
| **Sidebar** | — | ScrollArea | ProductMark, NavList, Text | nuevo | La barra lateral de todas las apps. |
| **ModuleRail** | ModuleRail (organismo (agente)) | Tooltip + NavigationMenu o ToggleGroup | ProductMark, IconButton, StatusDot | mantener | Raíl compacto de Mando; genérico. |
| **TabBar** | TabBar (organismo (agente)) | — | Icon, Badge | mantener | Navegación inferior móvil. |
| **Table** | Table (organismo) | ScrollArea | Checkbox, Switch, Badge, ButtonGroup | mantener | Tabla nativa; orden y selección en el hook. |
| **CalendarGrid** | CalendarGrid (organismo) | — (arrastre: dnd-kit, a confirmar) | ListItem, Text | mantener | `.eg-day` y `.eg-post-row` pasan a partes internas. Falta vista Mes. |
| **PreviewFrame** | StageFrame (organismo) | AspectRatio + Toolbar | IconButton, Chip | renombrar | Vista previa a tamaño fijo con zonas seguras. |

### Plantillas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **AppShell** | — | — | Sidebar, ModuleRail, TabBar | nuevo | Barra lateral + contenido; móvil con TabBar. Hoy se repite en las seis apps. |

## @egdev/effects

### Organismos

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **AmbientBackground** | AmbientBackground (organismo (efecto)) | — | — | mover | Canvas de partículas. |
| **Isotipo3D** | Isotipo3D (organismo (efecto)) | — | — | mover | three.js con fallback SVG. |

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
| **TerminalCard** | TerminalCard (molécula) | — | Surface | mover | Ficha de perfil de la web. |
| **NowCard** | NowCard (molécula) | — | Surface, Text | mover |  |
| **ProjectCard** | ProjectCard (molécula) | — | Surface, Badge, Link | mover |  |
| **NoteItem** | NoteItem (molécula) | — | ListItem | mover | Valorar construirlo sobre ListItem. |
| **TipCard** | TipCard (molécula) | — | AspectRatio, Text | mover |  |
| **ArticleFeature** | ArticleFeature (molécula) | — | PhotoFrame, Text | mover |  |
| **ArticleItem** | ArticleItem (molécula) | — | ListItem | mover |  |
| **StreamItem** | StreamItem (molécula) | — | ListItem | mover |  |
| **CommunityCard** | CommunityCard (molécula) | — | Surface, Avatar, Button | mover |  |

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
| **ProjectsGrid** | ProjectsGrid (organismo) | — | ProjectCard | mover |  |
| **BlogGrid** | BlogGrid (organismo) | — | ArticleFeature, ArticleItem | mover |  |
| **LiveBand** | LiveBand (organismo) | — | Countdown, PhotoFrame, StreamItem | mover |  |
| **CommunityGrid** | CommunityGrid (organismo) | — | CommunityCard | mover |  |
| **TipsSlider** | TipsSlider (organismo) | — | Carousel, TipCard | mover | El carrusel genérico sube a ui. |

### Plantillas

| Componente | Antes | Radix | Compone | Acción | Notas |
|---|---|---|---|---|---|
| **SectionShell** | SectionShell (plantilla) | — | — | mover |  |
| **HomeTemplate** | HomeTemplate (plantilla) | — | Secciones web, effects | mover |  |

## Primitivas de Radix que se usan

`AccessibleIcon`, `Accordion`, `AlertDialog`, `AspectRatio`, `Avatar`, `Checkbox`, `Collapsible`, `Dialog`, `DropdownMenu`, `Form.Field`, `HoverCard`, `Label`, `NavigationMenu`, `Popover`, `Portal`, `Progress`, `RadioGroup`, `ScrollArea`, `Select`, `Separator`, `Slider`, `Slot`, `Switch`, `Tabs`, `Toast`, `Toggle`, `ToggleGroup`, `Toolbar`, `Tooltip`, `VisuallyHidden`

Todas vienen del paquete unificado `radix-ui` (`import { Tabs } from 'radix-ui'`).
