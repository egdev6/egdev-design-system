# Plan de traspaso

Orden propuesto para pasar EGDEV Foundation de Claude Design a este repo. Cada fase deja algo usable: las primeras desbloquean la web y el AppShell de las apps.

## Fase 0 · Base (hecho en el arranque)

- Monorepo con `@egdev/tokens`, `@egdev/ui` y `@egdev/effects`.
- Tokens y tema de Tailwind generado.
- Hoja completa de Claude Design en `legacy/bundle.css`.
- Tres componentes de referencia: Surface, IconButton y Tabs.

## Fase 0.5 · Material v2 (7 de octubre de 2026, hecho)

- Tokens de Material v2 en `tokens.json` (versión 2): superficies `surface-0…3` y `overlay`, hairlines, `shadow-edge`, `shadow-elev-1…3`, `shadow-well`, la familia `gradient` y las curvas `ease-spring`, `ease-snappy` y `duration-press`.
- `tokens.css` pasa a generarse desde `tokens.json` (`scripts/build-tokens.mjs`).
- `legacy/bundle.css` actualizada a la versión 32 de EGDEV Foundation: todos los componentes aún sin portar ya traen materia.
- Surface gana `elevation` y el tono `well`; `glass` pasa a ser el overlay. Tabs gana `variant="segmented"`. IconButton `pressed` sube a surface-3.
- Referencia: [MATERIAL.md](MATERIAL.md).

## Fase 1 · Primitivas

Slot, VisuallyHidden, Surface ✓, Stack/Cluster, Text (Title + Eyebrow), Divider, AspectRatio, Label, Portal.

Sin estas, todo lo demás vuelve a llevar estilos en línea.

## Fase 2 · Átomos de acción y estado

Button, IconButton ✓, Toggle, Link, Icon, Badge (Tag + StatusBadge), StatusDot (+ LiveDot), Kbd, Avatar, Logo, ProductMark, Spinner, Tooltip.

## Fase 3 · Formularios

Input, Textarea, Select, Checkbox, Switch, Slider y RadioGroup como átomos; Field como molécula; ChipGroup y ButtonGroup.

Es la fase que más rompe: Field deja de ser un átomo que lo hace todo.

## Fase 4 · Navegación y AppShell

Menu, NavList, Tabs ✓, ProductMark, Sidebar, ModuleRail, TabBar y la plantilla AppShell.

Con esto, cualquier app (Mando, Cadencia, egdev-live, Criterio, media-tool, Quorb) puede montar su esqueleto.

## Fase 5 · Contenido y datos

ListItem (antes PostCard), ModuleCard, PageHeader, SectionHeader, MeterRow, Notice, Stat, ProgressBar, Gauge + GaugeDock, Mark, SelectTile, Timeline, Table, Dropzone, PhotoFrame, PullQuote, Countdown, Carousel.

## Fase 6 · Superposiciones

Dialog (+ sheet), AlertDialog, Popover, HoverCard, Toast, CommandPalette, PreviewFrame, CalendarGrid.

Aquí entran las dos dependencias que hay que confirmar: `cmdk` y `@dnd-kit`.

## Fase 7 · Efectos y patrones de app

- `@egdev/effects`: portar AmbientBackground e Isotipo3D desde `reference/`.
- Web, Mando y Cadencia: sus patrones de producto, en cada repo.

## Cierre

`legacy/bundle.css` vacía y borrada. A partir de ahí, Claude Design consume la hoja que genera este repo y no al revés.

## Pendientes heredados de EGDEV Foundation

- 14 iconos que faltan en Icon.
- Vista Mes de CalendarGrid.
- Sistema de marcas de producto (seis apps con letra sobre neón). Mientras tanto, ProductMark usa `--gradient-btn-primary` + `--shadow-btn-primary`.
- Logos de terceros dentro de Gauge (monocromo para todos o no).
- Overlays y widgets de egdev-live en registro Show.
- Penpot: dar de alta los tokens de Material v2.
- Cadencia: decidir si «Nueva idea» y «Programar» siguen como primario (la regla de la app reserva el neón para «Nuevo post»).
