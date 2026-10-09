# Decisiones

> Copia del registro de decisiones del artefacto *EGDEV Foundation* (Claude Design, versión 35). Se actualiza en cada traspaso; la fuente es el artefacto.

Registro de lo que se aprobó, se descartó o sigue pendiente mientras se diseñaba la web EGDEV Pulso (1 de octubre de 2026).

## Aprobado

- **Tipografía:** Barlow Condensed para titulares y Barlow para texto, en sustitución de Space Grotesk. Se compararon dos alternativas más, Big Shoulders Display + IBM Plex Sans y Archivo variable, y se descartaron.
- **CTA principal:** neón con texto negro, que sustituye al blanco sobre red-dark de la primera propuesta.
- **Rojos:** tres roles (energía, acción y profundidad). El crimson #DB143C de Agent Teams queda fuera.
- **Tokens que dejan de ser propuesta:**
  - `color-border-control`, `color-border-brand-strong`, `color-fg-brand-raised`
  - `color-focus-ring-inverse` y `shadow-focus`
  - `color-status-*`, `color-bg-flood`, `color-bg-deep`, `color-alpha-red-22`
  - `shadow-card`, `shadow-glow-hot`, `blur-glass`
  - las familias de timing y layout
- **Registros Pro/Show:** una base y como máximo dos acentos por pieza.
- **Fondo de partículas:** el motor y la configuración de Particle Studio, con multiplicadores por tramo.
- **Isotipo 3D:** la silueta extruida, con dos caras recortadas para evitar solapes.
- **Efectos:** progresivos según el porcentaje de scroll. En cada tramo manda una sola capa, sin solapes entre 3D y fondo.
- **Fotos:** reales a color, sin tinte rojo.
- **Secciones:** cada una mide al menos 100dvh y centra su contenido.
- **Navegación:**
  - La barra superior enlaza a páginas (Proyectos, Blog, Notas, Lab, Directos, Sobre mí) e incluye el menú de usuario.
  - Las redes van en el hero, solo con icono.
  - Las secciones de la página se recorren con el botón flotante de abajo a la derecha (SectionNav).

### Producto (prototipo de Mando, 7 de octubre de 2026)

- **Identidad:** las herramientas de producto usan EGDEV Foundation en registro Pro.
- **Componentes nuevos:** PermissionLevel, StatusDot, ToolCallChip, ConfirmCard, ChatMessage, Composer, ModuleCard, ModuleRail, AgentPanel y TabBar.
- **Confirmaciones:** tarjeta en el hilo, no modal. En turnos con contenido externo, Deny es el botón destacado.
- **Niveles de permiso:** solo `irreversible` va en rojo.

### Producto (rediseño de Cadencia, 7 de octubre de 2026)

- **Regla de crecimiento:** primero se reutiliza un componente; si casi sirve, se le añade una variante; solo si no hay nada parecido se crea uno nuevo.
- **Componentes nuevos:** Tabs, Field, Notice, PostCard, Dropzone, Dialog y CalendarGrid.
- **Variantes nuevas:** StatusBadge `--neutral`, Avatar `--sm`/`--xl`/`__badge`/`.is-paused`, Chip `--avatar`, Button `--icon` y `--join-start`/`--join-end`, MenuList `--nav` (+ `__label`, `__count`, `__end`, `__group`, `__item--danger`) y ModuleCard `--error`.
- **Iconos de red:** monocromos en blanco sobre negro dentro del Avatar, sin los colores de cada red.
- **Marca de Cadencia:** «C» sobre neón, igual que la «M» de Mando, hasta decidir logos de producto.
- **Idioma:** la interfaz de Cadencia sigue en español.

### Producto (rediseño de egdev-live, 7 de octubre de 2026)

- **Componentes nuevos:** Stat, Timeline, SelectTile y StageFrame.
- **Variantes nuevas:** MenuList `__group--toggle` y `__tag`, Field `--code` y `--range`, `.eg-check--switch`, ProgressBar `--lg`, PostCard `--row` y `.is-off`, Stat `--sm`.
- **Reutilización:** la alerta en pantalla es un ModuleCard `--wide`; las preguntas, variaciones y capas son PostCard `--row`; las partes del editor de alertas van en Tabs en lugar de una página larga.
- **Marca de egdev-live:** «L» sobre neón, como Mando y Cadencia.
- **Overlays:** fuera de este rediseño; comparten tokens pero no componentes.

### Producto (diseño de Criterio, 7 de octubre de 2026)

- **Criterio pasa a tener interfaz:** redactar y revisar, analítica con recomendaciones y experimentos, y reglas anti-slop. El MCP sigue siendo la vía principal; la interfaz enseña lo mismo que las tools.
- **Componentes nuevos:** Mark y Table.
- **Variantes nuevas:** Field `--prose` y ProgressBar `--muted`.
- **Marca de Criterio:** «Cr» sobre neón, porque la «C» ya es de Cadencia.

### Producto (rediseño de egdev-media-tool, 7 de octubre de 2026)

- **Sin componentes nuevos:** todo sale de lo que ya había, con variantes.
- **Variantes nuevas:** SelectTile `--portrait`/`--story`/`--square`/`--wide`/`--banner`, StageFrame `__zone`/`__zone--tight`/`--fit`, Dropzone `--inline` y cabeceras de fila en Table.
- **Navegación:** las plantillas pasan de pestañas a una barra lateral (MenuList `--nav`), y los formatos (miniatura, post, short) a Tabs.
- **Generados:** galería nueva con el detalle de cada archivo y «Enviar a Cadencia».
- **Marca del media-tool:** «Mt» sobre neón.

### Material v2 (7 de octubre de 2026)

- **El sistema deja de ser plano.** Se integra en la base de los componentes, no como capa opcional: superficies tonales (`color-surface-0…3`, `color-surface-overlay`), hairlines, borde de luz (`shadow-edge`), sombras de dos capas (`shadow-elev-1…3`), pozos (`shadow-well`), degradados (familia nueva `gradient`) y curvas `ease-spring`, `ease-snappy` y `duration-press`.
- **`color-bg-surface` pasa a ser alias de `color-surface-1`** (#0C0C0E, antes #0A0A0A).
- **Botones:** primario con degradado, bisel y halo; secundario con canto sobre `surface-1`; estado pulsado en todos (`.is-pressed` para documentar).
- **Tarjetas glass de la web** (NowCard, ProjectCard, ArticleFeature, CommunityCard, TerminalCard): borde hairline en reposo y rojo solo en hover.
- **Overlays:** solo lo que flota es translúcido (blur 20 + saturate 150 %), con alternativa sólida en `prefers-reduced-transparency`. Los menús pierden el borde rojo: flotan por luz.
- **Variante nueva:** Tabs `--segmented` (pozo con la opción activa elevada; radios concéntricos 12 → 9) para filtros cortos.
- **Firma:** ProjectCard `--feat` es la tarjeta hot (`gradient-hot`, `shadow-hot`). Una por vista.
- **Ampliado tras aplicarlo a las apps** (web, Mando, egdev-live, Criterio, Cadencia, Quorb, media-tool): marca de ModuleRail con degradado y bisel; AgentPanel en surface-1 con hairline, sombra lateral y cabecera en surface-2; divisores del rail en hairline; SelectTile con materia (miniatura en pozo, seleccionado en surface-3); `.eg-post__media` en pozo; Gauge strip, SectionNav, MobileMenu y CommandPalette como overlay; botón de UserMenu con canto. Las marcas de producto (letra sobre neón) usan `gradient-btn-primary` + `shadow-btn-primary`.
- **Origen:** criterios de las skills frontend-design (Anthropic), ckw-design y claude-design-skill: un elemento firma, estados que ganan contraste, radios concéntricos, sombra de dos capas, elevación tonal en oscuro y alternativa sólida a las transparencias.

### Grafito (9 de octubre de 2026)

- **El canvas deja de ser negro.** La escalera de superficies pasa a grises, inspirada en apps de escritorio como OBSBOT Center: `surface-0` #141518, `-1` #1B1C20, `-2` #232428 y `-3` #2D2E33 (primitivos `color-primitive-graphite-*`). `color-bg-canvas` es igual que `surface-0`.
- **Se validó en Quorb** (lienzo «Quorb — Rediseño», fila «Propuesta · elevación tonal en grafito»): ajustes, escritorio y comparativa de escalas.
- **Tokens que cambian para mantener el contraste:** `color-fg-muted` → #A1A2A8 (≥5.32:1), `color-border-default` → #2A2B30, `color-border-control` → #7A7B81 (≥3.21:1), `color-fg-brand-raised` y `color-status-danger` → `color-primitive-red-300` #FF6680 (≥4.82:1), hueco de `shadow-focus` en #141518 y `shadow-well` más suave.
- **Token nuevo:** `color-bg-scrim` (negro) para el velo de modales y diálogos.
- **Neón como texto, solo sobre `surface-0`.** Sobre `surface-1…3` el texto de marca es `color-fg-brand-raised`. El neón sigue en rellenos, anillos, subrayados y gráficas.
- **Variante nueva:** ModuleCard `--banded` (+ parte `__foot`): cabecera un tono por encima, pie un tono por debajo.
- **No cambia:** el rojo, la tipografía, las sombras de dos capas, la web Pulso sobre `color-ambient-bg` y las piezas Show (flood, deep, negro).

## Descartado

- El degradado del CTA (#FF1A4B → #CC0030): da 3.82:1 con texto blanco. (Material v2 sí usa un degradado, #FF2D57 → #FF0036 → #EE0031, porque el texto es negro: ≥4,7:1 en todo el botón.)
- Grano y malla de degradados como «acabado premium»: es la media de las tendencias, no materia.
- El tracking negativo de los titulares: con una condensada no hace falta.
- Duotono y tintes rojos sobre fotos.
- Mascota 3D como pegatina en la web.
- Logo 3D como marco de paredes: se vuelve a la silueta extruida.
- Raíl lateral de píxeles y dock central como navegación de secciones.
- Contadores en el hero y franja inferior «Frontend / IA / Developer tools».

## Pendiente

- **Grafito en los lienzos de las apps:** Mando, Cadencia, egdev-live, Criterio, media-tool y Quorb llevan una copia de los tokens anteriores; hay que reinstalar EGDEV Foundation en cada lienzo para verlos en grafito.
- **Grafito en Penpot:** dar de alta `color-primitive-graphite-*`, `color-primitive-red-300` y `color-bg-scrim`, y actualizar las superficies.
- **Tarjeta hot sobre grafito:** `gradient-hot` termina en #0E0709, más oscuro que el canvas nuevo; revisar si se sube un tono.

- **Penpot:** sincronizar `font.family.sans` y crear `font.family.display`, y dar de alta los tokens nuevos de esta versión y los de Material v2 (familias `gradient`, `shadow-elev-*`, `color-surface-*`).
- **Logo de Stack & Flow:** falta el archivo.
- **Cifra real de miembros** de Stack & Flow: en la maqueta original aparecen «50+» y «+1,2k».
- **URLs reales:** de cada post de los Tips y de las páginas Proyectos, Blog, Notas, Lab, Directos y Sobre mí.
- **Texto de cuerpo:** decidir si se mantiene blanco o pasa a #E3E3E3, el valor que usa Agent Teams.
- **Emotes de Twitch:** revisar su rojo-naranja antes de incorporarlos.
- **Isotipo 3D:** el render real (encuadres e intensidad de luz) solo se ha validado en navegador por el usuario.
- **Iconos que faltan en Icon:** `calendar`, `inbox`, `lightbulb`, `shuffle`, `pause`, `pencil`, `send`, `grip`, `upload`, `flask`, `plug`, `bot`, `trash`, `copy` se usan en Cadencia pero aún no están en el catálogo de Icon.
- **Vista Mes** de CalendarGrid: definida en la guía, sin prototipo.
- **PostCard como nombre:** ya se usa para preguntas y capas; valorar renombrarlo a algo genérico (p.ej. ItemCard) antes del Storybook.
- **Rediseño de overlays y widgets** de egdev-live en registro Show.
- **Marcas de producto:** Mando, Cadencia, egdev-live, Criterio, el media-tool y Quorb usan letras sobre neón («M», «C», «L», «Cr», «Mt», «Q»); con seis productos conviene decidir un sistema de marcas propio.
- **Marca de Mando:** de momento es una «M» sobre neón en ModuleRail; falta decidir si Mando tiene logo propio.
- **Logos de terceros en Gauge:** Quorb enseña los logos reales de Claude, ChatGPT, Gemini, Cursor y NaN Builders en blanco; los proveedores sin logo (Copilot, OpenRouter, APIs) llevan iniciales. Decidir si se tratan todos igual (monocromo) y revisar las condiciones de uso de cada marca.
- **Historial de Quorb:** la gráfica del panel es un SVG dibujado a mano; si aparece en otro producto, merece un componente Sparkline.
