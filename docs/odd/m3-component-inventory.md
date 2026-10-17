# Inventario provisional de componentes — M3

**Borrador para revisión, sin clasificación Atomic definitiva.** Recopila lo disponible y lo propuesto antes de decidir responsabilidades, divisiones, pertenencia al sistema y unidades desarrollables.

- **Baseline inspeccionada:** `6ea2841485b079a1d4a8e7b87a015afe4b872771` (main tras PR #29).
- **Alcance autorizado:** inventario local; sin implementación, publicación de issues, cambios de tokens/dependencias ni regeneración del catálogo.
- **Secuencia acordada:** inventario → análisis de responsabilidades → clasificación Atomic → catálogo aprobado → specs visuales e issues.
- **Fuente enumerada:** [`scripts/catalog_data.py`](../../scripts/catalog_data.py), contrastada con [`docs/catalog.json`](../catalog.json). [CATALOGO.md](../CATALOGO.md) es generado y provisional.
- **Límite de cobertura:** 107 registros de la fuente histórica y un candidato adicional localizado en la colección visual autorizada: 108 registros provisionales. No son 108 issues ni 108 componentes independientes; otros materiales no inspeccionados pueden ampliar la lista.
- **Identificadores:** INV-001…INV-107 identifican los registros de esta baseline; INV-108 identifica el candidato adicional. Se conservan al revisarlos; una división o fusión posterior debe registrar su trazabilidad, no renumerarlos.

## Lectura rápida

| Evidencia local | Registros | Qué acredita |
| --- | ---: | --- |
| R — React público | 3 | Fuente React y export público: Surface, IconButton, Tabs |
| F — Referencia JS de efectos | 2 | Código de referencia; no componente React público |
| C — Origen indicado por el catálogo | 80 | La fuente atribuye un componente/clase anterior; existencia y anatomía pendientes de contraste individual |
| P — Propuesta sin origen indicado | 22 | El catálogo propone una pieza; no acredita implementación |
| V — Preview adicional sin ficha | 1 | Cover: material visual localizado, propósito pendiente |
| **Total provisional** | **108** | 107 registros históricos + 1 adicional; no disponibilidad |

Los tres componentes R tienen tests y stories colocados, pero aquí **no se audita** su contrato, accesibilidad, clasificación ni conformidad visual. Una clase CSS, una nota o una propuesta Radix no acredita disponibilidad React.

## Implementación pública observada

Los exports se comprueban en [`packages/ui/src/index.ts`](../../packages/ui/src/index.ts). `cn` es una utilidad, no otro componente.

| Componente | Fuente React / carpeta de tests y stories | Alcance de la evidencia |
| --- | --- | --- |
| Surface | [surface](../../packages/ui/src/primitives/surface/) | Fuente y export público; nivel de la carpeta heredado, no validado aquí |
| IconButton | [icon-button](../../packages/ui/src/atoms/icon-button/) | Fuente y export público; nivel de la carpeta heredado, no validado aquí |
| Tabs | [tabs](../../packages/ui/src/molecules/tabs/) | Fuente y export público; nivel de la carpeta heredado, no validado aquí |

[`packages/effects/src/index.ts`](../../packages/effects/src/index.ts) no exporta componentes. [`reference/particle-streaks.js`](../../packages/effects/reference/particle-streaks.js) y [`reference/pulso-director.js`](../../packages/effects/reference/pulso-director.js) son referencias, no implementaciones React publicadas ni contratos finales de AmbientBackground/Isotipo3D.

En [`styles/legacy/bundle.css`](../../packages/ui/src/styles/legacy/bundle.css) sí se observaron reglas de Button, IconButton, Chip, Tag/Status, Kbd, Avatar, Pixel, Logo y Divider, entre otras. Esto prueba estilos heredados, **no** un componente interactivo ni la disponibilidad de su candidato sucesor. C no significa «CSS comprobado fila por fila».

## Registros de origen y candidatos

Las agrupaciones siguientes reproducen únicamente el **destino anotado en la fuente histórica**: no aprueban pertenencia a un paquete ni niveles Atomic. La columna de uso reproduce notas de propuesta, no promesas aprobadas ni comportamiento verificado. «—» deja un uso pendiente de definir. Los nombres conjuntos, presets, variantes, extracciones y composiciones **no se convierten automáticamente en componentes separados**.

### Destino histórico: @egdev/ui (71 registros)

| ID | Origen anotado | Candidato / nombre propuesto | Evidencia | Uso o cambio propuesto por la fuente | Fuente |
| --- | --- | --- | --- | --- | --- |
| INV-001 | — | Slot | P | Lo da Radix; se reexporta para `asChild` en todo el sistema. | [fila 5](../../scripts/catalog_data.py#L5) |
| INV-002 | — | VisuallyHidden | P | Sustituye el `clip: rect(0 0 0 0)` repetido en todos los lienzos. | [fila 6](../../scripts/catalog_data.py#L6) |
| INV-003 | — | Surface | R | Material: fondo + borde + radio + sombra. `tone` (default, glass, brand, well, ghost) y `elevation` (flat, low, high). Absorbe ModuleCard --glass, Stat --glass y la tira de Gauge. Implementado como referencia. | [fila 7](../../scripts/catalog_data.py#L7) |
| INV-004 | — | Stack / Cluster | P | Apilado vertical y fila con salto. Elimina los `display:flex; gap` en línea. | [fila 8](../../scripts/catalog_data.py#L8) |
| INV-005 | Title + Eyebrow | Text / Heading | C | Una primitiva tipográfica con variantes (`display`, `hero`, `section`, `eyebrow`, `show`, `inverse`). | [fila 9](../../scripts/catalog_data.py#L9) |
| INV-006 | Divider | Divider | C | Absorbe `.eg-rule` y `--vertical`. | [fila 10](../../scripts/catalog_data.py#L10) |
| INV-007 | — | AspectRatio | P | Base de PhotoFrame, SelectTile, PreviewFrame y portadas. | [fila 11](../../scripts/catalog_data.py#L11) |
| INV-008 | — | Portal | P | Contenido flotante (menús, diálogos, toasts). | [fila 12](../../scripts/catalog_data.py#L12) |
| INV-009 | — | Label | P | Etiqueta de formulario; la usa Field. | [fila 13](../../scripts/catalog_data.py#L13) |
| INV-010 | Button | Button | C | Pierde `--icon` (pasa a IconButton). Mantiene `.eg-btn-split` como molécula ButtonGroup. | [fila 15](../../scripts/catalog_data.py#L15) |
| INV-011 | IconButton | IconButton | R | Gana `shape: square` (antes Button --icon) y `pressed`. Implementado como referencia. | [fila 16](../../scripts/catalog_data.py#L16) |
| INV-012 | — | Toggle | P | Botón conmutado (mostrar/ocultar capa, silenciar). IconButton `pressed` puede apoyarse en él. | [fila 17](../../scripts/catalog_data.py#L17) |
| INV-013 | Link | Link | C | — | [fila 18](../../scripts/catalog_data.py#L18) |
| INV-014 | Icon | Icon | C | Faltan 14 iconos (ver DECISIONES). | [fila 19](../../scripts/catalog_data.py#L19) |
| INV-015 | Field (input) | Input | C | Control nativo; sale de Field. Variante `mono` para código y URLs. | [fila 20](../../scripts/catalog_data.py#L20) |
| INV-016 | Field (textarea) | Textarea | C | Variantes `code` y `prose` (antes Field --code y --prose). | [fila 21](../../scripts/catalog_data.py#L21) |
| INV-017 | Field (select) | Select | C | Select de Radix con el aspecto de Field. | [fila 22](../../scripts/catalog_data.py#L22) |
| INV-018 | `.eg-check` | Checkbox | C | Existía solo como clase. | [fila 23](../../scripts/catalog_data.py#L23) |
| INV-019 | `.eg-check--switch` | Switch | C | — | [fila 24](../../scripts/catalog_data.py#L24) |
| INV-020 | Field --range | Slider | C | Tamaño del anillo, umbrales, volumen. | [fila 25](../../scripts/catalog_data.py#L25) |
| INV-021 | — | RadioGroup | P | Grupo de opciones exclusivas; base de SelectTile y de chips exclusivos. | [fila 26](../../scripts/catalog_data.py#L26) |
| INV-022 | Chip | Chip | C | Siempre interactivo (filtro o selección). Los grupos van en ChipGroup. | [fila 27](../../scripts/catalog_data.py#L27) |
| INV-023 | Tag + StatusBadge | Badge | C | Etiqueta estática con `tone` (neutral, info, success, warning, danger, brand) e icono opcional; `solid`. | [fila 28](../../scripts/catalog_data.py#L28) |
| INV-025 | StatusDot + LiveDot | StatusDot | C | LiveDot pasa a `StatusDot state='live'` (con pulso y `--static`). | [fila 30](../../scripts/catalog_data.py#L30) |
| INV-026 | Kbd | Kbd | C | — | [fila 31](../../scripts/catalog_data.py#L31) |
| INV-027 | Avatar | Avatar | C | Radix Avatar da el fallback a iniciales mientras carga la imagen. | [fila 32](../../scripts/catalog_data.py#L32) |
| INV-028 | Logo | Logo | C | — | [fila 33](../../scripts/catalog_data.py#L33) |
| INV-029 | — | ProductMark | P | Letra o marca de producto con `gradient-btn-primary` + `shadow-btn-primary` (M, C, L, Cr, Mt, Q). Hoy está copiada a mano en cada app. | [fila 34](../../scripts/catalog_data.py#L34) |
| INV-031 | ProgressBar | ProgressBar | C | Radix Progress da `role=progressbar` y los aria-value*. | [fila 36](../../scripts/catalog_data.py#L36) |
| INV-032 | Gauge | Gauge | C | Revisar si exponer cada anillo como Progress o el conjunto como imagen con etiqueta. | [fila 37](../../scripts/catalog_data.py#L37) |
| INV-033 | Stat | Stat | C | Pierde `--glass` (usa Surface). | [fila 38](../../scripts/catalog_data.py#L38) |
| INV-034 | Mark | Mark | C | — | [fila 39](../../scripts/catalog_data.py#L39) |
| INV-035 | Dropzone | Dropzone | C | Input file nativo oculto con VisuallyHidden. | [fila 40](../../scripts/catalog_data.py#L40) |
| INV-036 | — | Tooltip | P | Hace falta para IconButton, ModuleRail y Gauge. No existe. | [fila 41](../../scripts/catalog_data.py#L41) |
| INV-037 | — | Spinner | P | Carga en Button y estados de espera (Stack & Flow usa spinners-react). | [fila 42](../../scripts/catalog_data.py#L42) |
| INV-038 | — | Skeleton | P | Estados de carga de listas y tarjetas (tableros States). | [fila 43](../../scripts/catalog_data.py#L43) |
| INV-039 | Field | Field | C | Pasa a molécula: etiqueta + control + ayuda + error + contador. El control es un átomo aparte. | [fila 45](../../scripts/catalog_data.py#L45) |
| INV-040 | `.eg-btn-split` | ButtonGroup | C | Botón dividido (`--join-start/--join-end`) y grupos de botones. | [fila 46](../../scripts/catalog_data.py#L46) |
| INV-041 | — | ChipGroup | P | Filtros (múltiple) y selección exclusiva (borde de la pantalla en Quorb). | [fila 47](../../scripts/catalog_data.py#L47) |
| INV-042 | Tabs | Tabs | R | `variant`: underline o segmented (Material v2, para 2–4 opciones cortas). Implementado como referencia. | [fila 48](../../scripts/catalog_data.py#L48) |
| INV-043 | MenuList (popup) | Menu | C | Menú desplegable con items, separadores, `--danger` y submenús. | [fila 49](../../scripts/catalog_data.py#L49) |
| INV-044 | MenuList --nav | NavList | C | Navegación lateral con grupos plegables, contadores y etiquetas `__tag`. | [fila 50](../../scripts/catalog_data.py#L50) |
| INV-045 | UserMenu | UserMenu | C | Es Menu con Avatar de trigger; podría ser solo un ejemplo de Menu. | [fila 51](../../scripts/catalog_data.py#L51) |
| INV-046 | — | Popover | P | Panel flotante al hacer clic. | [fila 52](../../scripts/catalog_data.py#L52) |
| INV-047 | — | HoverCard | P | El panel de detalle de Quorb al pasar por un Gauge. | [fila 53](../../scripts/catalog_data.py#L53) |
| INV-048 | Notice | Notice | C | `role=status` o `alert`. Mantiene `--sm`. | [fila 54](../../scripts/catalog_data.py#L54) |
| INV-049 | — | Toast | P | Avisos efímeros (publicado, copiado). No existe. | [fila 55](../../scripts/catalog_data.py#L55) |
| INV-050 | PostCard | ListItem | C | Fila/tarjeta genérica con estados (`new`, `failed`, `done`, `empty`, `dragging`, `off`) y `--row`. | [fila 56](../../scripts/catalog_data.py#L56) |
| INV-052 | SelectTile | SelectTile | C | Proporciones como variantes (portrait, story, square, wide, banner). | [fila 58](../../scripts/catalog_data.py#L58) |
| INV-053 | Timeline | Timeline | C | `--chat` para el chat en vivo. | [fila 59](../../scripts/catalog_data.py#L59) |
| INV-054 | — | PageHeader | P | Eyebrow + título + acciones. Repetido a mano en todas las apps. | [fila 60](../../scripts/catalog_data.py#L60) |
| INV-055 | SectionHeader | SectionHeader | C | Cabecera de sección en registro Show; valorar unificar con PageHeader por `register`. | [fila 61](../../scripts/catalog_data.py#L61) |
| INV-056 | — | MeterRow | P | Etiqueta + valor + barra + ayuda (Quorb, egdev-live, Criterio). | [fila 62](../../scripts/catalog_data.py#L62) |
| INV-057 | ModuleCard | ModuleCard | C | `--error`, `--stopped`, `--wide`, `--banded` (cabecera y pie en banda tonal, Grafito); `--glass` pasa a Surface. | [fila 63](../../scripts/catalog_data.py#L63) |
| INV-058 | SearchTrigger | SearchTrigger | C | Abre CommandPalette. | [fila 64](../../scripts/catalog_data.py#L64) |
| INV-059 | SocialLinks | SocialLinks | C | — | [fila 65](../../scripts/catalog_data.py#L65) |
| INV-060 | PhotoFrame | PhotoFrame | C | — | [fila 66](../../scripts/catalog_data.py#L66) |
| INV-061 | PullQuote | PullQuote | C | — | [fila 67](../../scripts/catalog_data.py#L67) |
| INV-062 | Countdown | Countdown | C | También útil en egdev-live. | [fila 68](../../scripts/catalog_data.py#L68) |
| INV-076 | — | Carousel | P | Sale de TipsSlider: contador, anterior/siguiente, arrastre y teclado. | [fila 82](../../scripts/catalog_data.py#L82) |
| INV-077 | Dialog | Dialog | C | Variante `sheet` para paneles laterales (MobileMenu). | [fila 84](../../scripts/catalog_data.py#L84) |
| INV-078 | — | AlertDialog | P | Confirmaciones destructivas (borrar, desconectar). | [fila 85](../../scripts/catalog_data.py#L85) |
| INV-079 | CommandPalette | CommandPalette | C | Radix no tiene combobox; cmdk es la opción habitual sobre Radix Dialog. | [fila 86](../../scripts/catalog_data.py#L86) |
| INV-080 | — | Sidebar | P | La barra lateral de todas las apps. | [fila 87](../../scripts/catalog_data.py#L87) |
| INV-081 | ModuleRail | ModuleRail | C | Raíl compacto de Mando; genérico. | [fila 88](../../scripts/catalog_data.py#L88) |
| INV-082 | TabBar | TabBar | C | Navegación inferior móvil. | [fila 89](../../scripts/catalog_data.py#L89) |
| INV-083 | Table | Table | C | Tabla nativa; orden y selección en el hook. | [fila 90](../../scripts/catalog_data.py#L90) |
| INV-084 | CalendarGrid | CalendarGrid | C | `.eg-day` y `.eg-post-row` pasan a partes internas. Falta vista Mes. | [fila 91](../../scripts/catalog_data.py#L91) |
| INV-085 | StageFrame | PreviewFrame | C | Vista previa a tamaño fijo con zonas seguras. | [fila 92](../../scripts/catalog_data.py#L92) |
| INV-086 | GaugeStrip | GaugeDock | C | La tira es un `role=toolbar` con foco itinerante; Radix Toolbar lo da hecho. | [fila 93](../../scripts/catalog_data.py#L93) |
| INV-105 | — | AppShell | P | Barra lateral + contenido; móvil con TabBar. Hoy se repite en las seis apps. | [fila 113](../../scripts/catalog_data.py#L113) |

### Destino histórico: @egdev/effects (2 registros)

| ID | Origen anotado | Candidato / nombre propuesto | Evidencia | Uso o cambio propuesto por la fuente | Fuente |
| --- | --- | --- | --- | --- | --- |
| INV-103 | AmbientBackground | AmbientBackground | F | Canvas de partículas. | [fila 110](../../scripts/catalog_data.py#L110) |
| INV-104 | Isotipo3D | Isotipo3D | F | three.js con fallback SVG. | [fila 111](../../scripts/catalog_data.py#L111) |

### Destino histórico: Mando (6 registros)

| ID | Origen anotado | Candidato / nombre propuesto | Evidencia | Uso o cambio propuesto por la fuente | Fuente |
| --- | --- | --- | --- | --- | --- |
| INV-024 | PermissionLevel | Badge preset | C | Preset de Badge en Mando (read, write, irreversible, blocked). | [fila 29](../../scripts/catalog_data.py#L29) |
| INV-064 | ToolCallChip | ToolCallChip | C | Sube a ui si otra app aloja el agente. | [fila 70](../../scripts/catalog_data.py#L70) |
| INV-065 | ConfirmCard | ConfirmCard | C | Argumentos crudos en Collapsible. | [fila 71](../../scripts/catalog_data.py#L71) |
| INV-066 | ChatMessage | ChatMessage | C | — | [fila 72](../../scripts/catalog_data.py#L72) |
| INV-067 | Composer | Composer | C | — | [fila 73](../../scripts/catalog_data.py#L73) |
| INV-087 | AgentPanel | AgentPanel | C | — | [fila 94](../../scripts/catalog_data.py#L94) |

### Destino histórico: Cadencia (1 registros)

| ID | Origen anotado | Candidato / nombre propuesto | Evidencia | Uso o cambio propuesto por la fuente | Fuente |
| --- | --- | --- | --- | --- | --- |
| INV-051 | PostCard (Cadencia) | PostCard | C | Composición de dominio en Cadencia sobre ListItem. | [fila 57](../../scripts/catalog_data.py#L57) |

### Destino histórico: web (27 registros)

| ID | Origen anotado | Candidato / nombre propuesto | Evidencia | Uso o cambio propuesto por la fuente | Fuente |
| --- | --- | --- | --- | --- | --- |
| INV-030 | Pixel | Pixel | C | Recurso gráfico de la web; revisar si alguna app lo usa. | [fila 35](../../scripts/catalog_data.py#L35) |
| INV-063 | TerminalCard | TerminalCard | C | Ficha de perfil de la web. Barra en banda `surface-2` (Grafito). | [fila 69](../../scripts/catalog_data.py#L69) |
| INV-068 | NowCard | NowCard | C | Pie en banda `surface-0` (Grafito). | [fila 74](../../scripts/catalog_data.py#L74) |
| INV-069 | ProjectCard | ProjectCard | C | — | [fila 75](../../scripts/catalog_data.py#L75) |
| INV-070 | NoteItem | NoteItem | C | Valorar construirlo sobre ListItem. | [fila 76](../../scripts/catalog_data.py#L76) |
| INV-071 | TipCard | TipCard | C | — | [fila 77](../../scripts/catalog_data.py#L77) |
| INV-072 | ArticleFeature | ArticleFeature | C | — | [fila 78](../../scripts/catalog_data.py#L78) |
| INV-073 | ArticleItem | ArticleItem | C | — | [fila 79](../../scripts/catalog_data.py#L79) |
| INV-074 | StreamItem | StreamItem | C | — | [fila 80](../../scripts/catalog_data.py#L80) |
| INV-075 | CommunityCard | CommunityCard | C | Cabecera en banda `surface-2` (Grafito). | [fila 81](../../scripts/catalog_data.py#L81) |
| INV-088 | TopBar | TopBar | C | — | [fila 95](../../scripts/catalog_data.py#L95) |
| INV-089 | MobileMenu | MobileMenu | C | — | [fila 96](../../scripts/catalog_data.py#L96) |
| INV-090 | SectionNav | SectionNav | C | — | [fila 97](../../scripts/catalog_data.py#L97) |
| INV-091 | Footer | Footer | C | — | [fila 98](../../scripts/catalog_data.py#L98) |
| INV-092 | Hero | Hero | C | — | [fila 99](../../scripts/catalog_data.py#L99) |
| INV-093 | ChapterBreak | ChapterBreak | C | — | [fila 100](../../scripts/catalog_data.py#L100) |
| INV-094 | LabStage | LabStage | C | — | [fila 101](../../scripts/catalog_data.py#L101) |
| INV-095 | Closing | Closing | C | — | [fila 102](../../scripts/catalog_data.py#L102) |
| INV-096 | NotesBoard | NotesBoard | C | — | [fila 103](../../scripts/catalog_data.py#L103) |
| INV-097 | NowStrip | NowStrip | C | — | [fila 104](../../scripts/catalog_data.py#L104) |
| INV-098 | ProjectsGrid | ProjectsGrid | C | — | [fila 105](../../scripts/catalog_data.py#L105) |
| INV-099 | BlogGrid | BlogGrid | C | — | [fila 106](../../scripts/catalog_data.py#L106) |
| INV-100 | LiveBand | LiveBand | C | — | [fila 107](../../scripts/catalog_data.py#L107) |
| INV-101 | CommunityGrid | CommunityGrid | C | — | [fila 108](../../scripts/catalog_data.py#L108) |
| INV-102 | TipsSlider | TipsSlider | C | El carrusel genérico sube a ui. | [fila 109](../../scripts/catalog_data.py#L109) |
| INV-106 | SectionShell | SectionShell | C | `--pro`, `--show`, `--flood`, `--deep`; `--grafito` (+ `--fade-top`, `--fade-bottom`) para lectura sobre gris. | [fila 114](../../scripts/catalog_data.py#L114) |
| INV-107 | HomeTemplate | HomeTemplate | C | — | [fila 115](../../scripts/catalog_data.py#L115) |

## Cruce con documentación y previsualizaciones locales

La colección autorizada contiene **78 carpetas de candidatos** y un subárbol técnico `src`: **77 carpetas tienen README y preview; una tiene únicamente preview**. No hay carpetas con README sin preview. El conteo anterior de 77 previews se corrige a **78**.

El cruce identifica **85 de los 107 registros históricos** relacionados con 77 carpetas originales; **22 no tienen ficha independiente localizada**. «Relacionado» no significa que el candidato sucesor ya exista ni que su API o diseño estén aprobados. La coincidencia de nombre sirve para localizar material, no para validar equivalencia semántica.

| Relación observada | Registros | Límite |
| --- | ---: | --- |
| O — Coincidencia del nombre de origen | 70 | Documentación localizada; contenido no auditado íntegramente por componente |
| T — Cambio anotado en el catálogo | 12 | Fusión, separación o extracción propuesta; los originales no son el sucesor |
| D — Control documentado en Field | 2 | Checkbox/Switch incluidos en la ficha original, no componentes independientes |
| C — Coincidencia del nombre de candidato | 1 | Composición específica frente a fuente genérica: equivalencia pendiente |
| P — Sin ficha independiente | 22 | Puede ser nueva propuesta, parte existente o React sin ficha visual |
| **Total base** | **107** | No aprueba un componente por fila |

En la matriz, los nombres de carpetas son relativos a la colección local autorizada; no se publican rutas privadas, nombres de proyectos ni direcciones externas. Las fichas y previews indicados existen, salvo «—». No se importan sus categorías históricas como niveles Atomic finales.

| ID | Candidato | Material original localizado | Relación |
| --- | --- | --- | --- |
| INV-001 | Slot | — | P |
| INV-002 | VisuallyHidden | — | P |
| INV-003 | Surface | — | P |
| INV-004 | Stack / Cluster | — | P |
| INV-005 | Text / Heading | `Title` + `Eyebrow` | T |
| INV-006 | Divider | `Divider` | O |
| INV-007 | AspectRatio | — | P |
| INV-008 | Portal | — | P |
| INV-009 | Label | — | P |
| INV-010 | Button | `Button` | O |
| INV-011 | IconButton | `IconButton` | O |
| INV-012 | Toggle | — | P |
| INV-013 | Link | `Link` | O |
| INV-014 | Icon | `Icon` | O |
| INV-015 | Input | `Field` | T |
| INV-016 | Textarea | `Field` | T |
| INV-017 | Select | `Field` | T |
| INV-018 | Checkbox | `Field` | D |
| INV-019 | Switch | `Field` | D |
| INV-020 | Slider | `Field` | T |
| INV-021 | RadioGroup | — | P |
| INV-022 | Chip | `Chip` | O |
| INV-023 | Badge | `Tag` + `StatusBadge` | T |
| INV-024 | Badge preset | `PermissionLevel` | O |
| INV-025 | StatusDot | `StatusDot` + `LiveDot` | T |
| INV-026 | Kbd | `Kbd` | O |
| INV-027 | Avatar | `Avatar` | O |
| INV-028 | Logo | `Logo` | O |
| INV-029 | ProductMark | — | P |
| INV-030 | Pixel | `Pixel` | O |
| INV-031 | ProgressBar | `ProgressBar` | O |
| INV-032 | Gauge | `Gauge` | O |
| INV-033 | Stat | `Stat` | O |
| INV-034 | Mark | `Mark` | O |
| INV-035 | Dropzone | `Dropzone` | O |
| INV-036 | Tooltip | — | P |
| INV-037 | Spinner | — | P |
| INV-038 | Skeleton | — | P |
| INV-039 | Field | `Field` | O |
| INV-040 | ButtonGroup | `Button` | T |
| INV-041 | ChipGroup | — | P |
| INV-042 | Tabs | `Tabs` | O |
| INV-043 | Menu | `MenuList` | T |
| INV-044 | NavList | `MenuList` | T |
| INV-045 | UserMenu | `UserMenu` | O |
| INV-046 | Popover | — | P |
| INV-047 | HoverCard | — | P |
| INV-048 | Notice | `Notice` | O |
| INV-049 | Toast | — | P |
| INV-050 | ListItem | `PostCard` | O |
| INV-051 | PostCard | `PostCard` | C |
| INV-052 | SelectTile | `SelectTile` | O |
| INV-053 | Timeline | `Timeline` | O |
| INV-054 | PageHeader | — | P |
| INV-055 | SectionHeader | `SectionHeader` | O |
| INV-056 | MeterRow | — | P |
| INV-057 | ModuleCard | `ModuleCard` | O |
| INV-058 | SearchTrigger | `SearchTrigger` | O |
| INV-059 | SocialLinks | `SocialLinks` | O |
| INV-060 | PhotoFrame | `PhotoFrame` | O |
| INV-061 | PullQuote | `PullQuote` | O |
| INV-062 | Countdown | `Countdown` | O |
| INV-063 | TerminalCard | `TerminalCard` | O |
| INV-064 | ToolCallChip | `ToolCallChip` | O |
| INV-065 | ConfirmCard | `ConfirmCard` | O |
| INV-066 | ChatMessage | `ChatMessage` | O |
| INV-067 | Composer | `Composer` | O |
| INV-068 | NowCard | `NowCard` | O |
| INV-069 | ProjectCard | `ProjectCard` | O |
| INV-070 | NoteItem | `NoteItem` | O |
| INV-071 | TipCard | `TipCard` | O |
| INV-072 | ArticleFeature | `ArticleFeature` | O |
| INV-073 | ArticleItem | `ArticleItem` | O |
| INV-074 | StreamItem | `StreamItem` | O |
| INV-075 | CommunityCard | `CommunityCard` | O |
| INV-076 | Carousel | `TipsSlider` | T |
| INV-077 | Dialog | `Dialog` | O |
| INV-078 | AlertDialog | — | P |
| INV-079 | CommandPalette | `CommandPalette` | O |
| INV-080 | Sidebar | — | P |
| INV-081 | ModuleRail | `ModuleRail` | O |
| INV-082 | TabBar | `TabBar` | O |
| INV-083 | Table | `Table` | O |
| INV-084 | CalendarGrid | `CalendarGrid` | O |
| INV-085 | PreviewFrame | `StageFrame` | O |
| INV-086 | GaugeDock | `Gauge` | T |
| INV-087 | AgentPanel | `AgentPanel` | O |
| INV-088 | TopBar | `TopBar` | O |
| INV-089 | MobileMenu | `MobileMenu` | O |
| INV-090 | SectionNav | `SectionNav` | O |
| INV-091 | Footer | `Footer` | O |
| INV-092 | Hero | `Hero` | O |
| INV-093 | ChapterBreak | `ChapterBreak` | O |
| INV-094 | LabStage | `LabStage` | O |
| INV-095 | Closing | `Closing` | O |
| INV-096 | NotesBoard | `NotesBoard` | O |
| INV-097 | NowStrip | `NowStrip` | O |
| INV-098 | ProjectsGrid | `ProjectsGrid` | O |
| INV-099 | BlogGrid | `BlogGrid` | O |
| INV-100 | LiveBand | `LiveBand` | O |
| INV-101 | CommunityGrid | `CommunityGrid` | O |
| INV-102 | TipsSlider | `TipsSlider` | O |
| INV-103 | AmbientBackground | `AmbientBackground` | O |
| INV-104 | Isotipo3D | `Isotipo3D` | O |
| INV-105 | AppShell | — | P |
| INV-106 | SectionShell | `SectionShell` | O |
| INV-107 | HomeTemplate | `HomeTemplate` | O |

### Candidato adicional localizado

| ID | Candidato | Evidencia | Pendiente |
| --- | --- | --- | --- |
| INV-108 | Cover | Existe `Cover/preview.html`; no `Cover/README.md`; ausente de los 107 registros históricos | Composición específica confirmada; no componente genérico público por ahora. Extracción futura solo tras demostrar usos y estructura compartida; sin spec ni clasificación genéricas aprobadas |

Se añade a este **inventario provisional**, no al catálogo generado. La unión pasa a **108 registros: 107 históricos y un candidato nuevo**, no a 108 issues. El subárbol técnico `src` no se cuenta como componente.

### Evidencia anatómica que cambia la revisión

- **Field:** la ficha documenta etiqueta, control, ayuda, error y contador; incluye input, select, textarea, checkbox, switch y range. Las extracciones requieren decidir APIs y límites.
- **MenuList / UserMenu:** se documentan acciones emergentes y navegación lateral en la misma familia, y un menú con avatar. Separar Menu/NavList y conservar UserMenu como unidad o ejemplo sigue pendiente.
- **Tag / StatusBadge:** las fichas distinguen categoría y estado semántico; la fusión propuesta no acredita que ya exista un único Badge.
- **Title / Eyebrow:** son conceptos documentados por separado; una API sucesora compartida necesita justificación.
- **Gauge:** se documentan 1–3 anillos y una tira de acciones. La semántica de progreso por anillo frente a imagen etiquetada sigue abierta.
- **Timeline:** la ficha contempla eventos y chat; decidir variante, composición o patrón independiente requiere análisis.
- **RadioGroup / SelectTile / ChipGroup:** hay material de selección contextual y grupos, pero no fichas independientes de RadioGroup/ChipGroup que resuelvan sus límites.

## Diseño visual: material localizado, aprobación pendiente

Se revisó una colección local autorizada con fichas y previews y se comprobó **una muestra de Button** con un visor temporal aislado y Playwright MCP. Tokens existentes, estilos y tipografías cargaron; la consola no mostró errores. Se conservan PNG y metadatos localmente en `.playwright-mcp/button-board--dark--1280.{png,json}`, fuera de los archivos versionados. Los originales permanecen intactos y el servidor de prueba está detenido.

**Esto acredita el recorrido de captura de esa muestra**, no la fidelidad de todas las previews, paridad con otro visor ni aprobación del diseño. Los estados de la muestra son representaciones estáticas del preview, no tests de interacción. No se han capturado los 78 candidatos ni aprobado specs visuales.

En [`docs/design/`](../design/README.md) sigue sin haber referencias de componentes versionadas y aprobadas. Para preparar cada spec necesitamos acordar:

1. Qué material original corresponde al candidato y a qué versión.
2. Escenarios, variantes y estados que debe mostrar cada referencia.
3. Condiciones de captura, recursos completos y aprobación recuperable.
4. Si la imagen representa diseño esperado o estado observado.

Los previews de componentes necesitan contenedor, tokens, estilos y tipografías. Los lienzos de pantallas pueden depender de soporte e imágenes no incluidos; no se presupone que el mismo visor sea suficiente para todos. Una captura o story no pasa a ser diseño aprobado sin decisión humana.

## Preguntas antes de clasificar y dividir el trabajo

| Área | Decisión pendiente | Por qué afecta al inventario final |
| --- | --- | --- |
| RadioGroup, SelectTile y ChipGroup | Determinar anatomía y selección exclusiva/múltiple de cada caso | Puede cambiar composición, unidades y dependencias |
| Gauge | Acordar significado de los anillos y semántica accesible: progreso por anillo o imagen etiquetada | El aspecto no determina su responsabilidad |
| Timeline | Delimitar cronología genérica frente a chat y sus partes | Puede ser variante, composición o patrón de producto |
| UserMenu | Decidir componente autónomo o ejemplo de Menu con Avatar | No abrir una issue redundante antes de decidir |
| Field | Contrastar control, etiqueta, ayuda, error y contador, y posibles extracciones | El registro histórico ya propone separaciones, aún no aprobadas |
| Stack / Cluster y Text / Heading | Determinar si hay APIs independientes o una unidad compartida | Una fila no equivale a un solo componente |
| Header, navegación y shells | Comparar responsabilidades y límites entre piezas de nombre similar | Evitar duplicación y acoplamiento a productos |
| Presets y patrones de producto | Confirmar consumidores y necesidad de generalización | Destino histórico no prueba pertenencia a @egdev/ui |
| Referencias Foundation y legado | Completar anatomías, usos y procedencia visual | No deducir contrato desde selectores CSS |
| Tokens, recetas Material y paquetes Radix | Contrastar disponibilidad real con las necesidades acordadas | Las anotaciones de la fuente no autorizan nuevas dependencias o tokens |

## Paralelismo: todavía no decidido

Las columnas «compone» y «Radix» del catálogo son hipótesis históricas, no un grafo de dependencias validado. En React solo se observaron imports de Slot/AccessibleIcon en IconButton, Slot en Surface y Tabs en Tabs. No se presupone instalado el resto de paquetes anotados.

Después del análisis, cada unidad tendrá dependencias, ruta propia y archivos permitidos. Tokens/dependencias/configuración compartida se resolverán aparte; exports raíz, catálogo y estilos de entrada requerirán integración coordinada. Un worktree aislado no elimina conflictos semánticos.

## Comprobaciones de este inventario

- Se contrastan los 107 registros históricos, nombres e IDs contra la fuente y el JSON generado; INV-108 se verifica aparte contra su preview.
- Se contrastan las 77 carpetas con ficha+preview, una preview sin ficha y el subárbol técnico; la matriz cubre los 107 registros y relaciona 77 originales sin añadir componentes desde subcarpetas técnicas.
- Se mantienen los 71 destinos ui, 2 effects, 6 Mando, 1 Cadencia y 27 web **como metadatos históricos**, sin asumir aprobación.
- Solo Surface, IconButton y Tabs se marcan como React público; effects no se marca como React disponible.
- No se copian los niveles Atomic ni las acciones históricas como decisiones finales.
- Sin cambios de runtime en el repositorio: no corresponde RED/GREEN de componentes; se valida estructura, cobertura y enlaces. La prueba del visor temporal es evidencia de render de una muestra, no verificación funcional del catálogo.

## Siguiente paso de revisión

Revisar la cobertura y el candidato adicional. El [análisis de responsabilidades y límites](m3-component-boundaries.md) recoge acuerdos parciales y recomendaciones pendientes. La [clasificación completa de trabajo](m3-atomic-proposal.md) cubre los 108 registros mediante 113 unidades de responsabilidad, todas con nivel. Separa nivel, destino y evidencia; no deja patrones o efectos sin categoría ni presenta hipótesis como decisiones aprobadas o implementaciones listas. Resolver los límites y contrastar las hipótesis antes de cerrar catalogación según [CATALOGACION.md](../CATALOGACION.md). Acordar por separado qué referencias visuales se adoptan y capturan para cada spec.

Este borrador **no aprueba** candidatos, clasificación, specs, referencias visuales ni planes. No crea issues, no elige piloto y no autoriza implementación.
