# Material

Desde octubre de 2026 (Material v2), EGDEV Foundation deja de ser plano: el rojo no cambia, cambia cómo están hechas las superficies. Desde Grafito (9 de octubre de 2026) la escalera de superficies es gris en lugar de negra. Este documento es la referencia para implementar componentes y pantallas con materia.

Origen: la versión 37 del artefacto *EGDEV Foundation* (Claude Design). Material v2 se aplicó a la web y a las seis apps; Grafito se validó en Quorb y se llevó a la web Pulso el 10 de octubre de 2026. Las decisiones están en [DECISIONES.md](DECISIONES.md).

## Principios

1. **Superficies tonales (Grafito).** Cuanto más arriba, más clara, y cada nivel es un escalón de gris visible a simple vista. En oscuro la elevación se ve por tono, no por sombra. El negro puro solo queda en el velo de los modales (`--color-bg-scrim`), el texto sobre neón y las piezas Show.
2. **Bandas.** Un panel se parte en bandas tonales en lugar de líneas: cabecera un tono por encima del cuerpo, pie un tono por debajo (ModuleCard `--banded`).
3. **Borde de luz.** Toda superficie elevada lleva 1px de luz en el canto superior y un brillo cenital que se apaga hacia abajo. La separación entre superficies es una hairline blanca, no el rojo.
4. **Sombras de dos capas.** Una pegada y otra amplia; nunca una sola sombra desplazada.
5. **Lo que se rellena se hunde, lo que se pulsa sobresale.** Inputs, buscador, casillas, pistas de progreso y el segmentado son pozos; botones, chips y lo seleccionado sobresalen.
6. **Solo flota lo que flota.** Menús, barra superior con scroll, paleta de comandos y paneles sobre el escritorio son overlays translúcidos, con alternativa sólida.
7. **Una firma por vista.** La tarjeta hot (ProjectCard `--feat`) es el único elemento con canto rojo y halo; todo lo demás se queda callado.
8. **Movimiento con intención.** Hover con muelle corto, pulsación seca. Con `prefers-reduced-motion`, sin desplazamientos.

## Tokens

| Token | Valor | Uso |
|---|---|---|
| `--color-surface-0` | #141518 | Canvas y pozos. `--color-bg-canvas` vale lo mismo |
| `--color-surface-1` | #1B1C20 | Tarjetas, paneles, barras laterales, tablas. `--color-bg-surface` es su alias |
| `--color-surface-2` | #232428 | Hover, cabeceras de tabla y de panel (`--banded`), diálogos |
| `--color-surface-3` | #2D2E33 | Lo seleccionado (nav activa, segmento, IconButton pulsado) y la cabecera de un panel flotante |
| `--color-surface-overlay` | rgba(35,36,40,.84) | Lo que flota, siempre con `--blur-overlay` (20px) y `saturate(150%)` |
| `--color-border-hairline` / `-strong` | blanco 8 % / 14 % | Separación de superficies; `-strong` en hover y overlays. Los controles siguen con `--color-border-control` (≥3:1) |
| `--gradient-sheen` | blanco 4,5 % → 0 | Brillo cenital, apilado sobre el color de la superficie |
| `--shadow-edge` / `-strong` | inset 1px blanco 7 % / 13 % | Borde de luz |
| `--shadow-elev-1` · `-2` · `-3` | dos capas | Tarjeta · hover y destacado · overlay |
| `--shadow-well` | inset negro suave | Pozos |
| `--color-bg-scrim` | #000 | Velo de modales y diálogos (con transparencia) |
| `--color-fg-muted` · `--color-border-control` | #A1A2A8 · #7A7B81 | Subidos con Grafito para mantener ≥4,5:1 y ≥3:1 en surface-3 |
| `--color-fg-brand-raised` | #FF6680 | Texto de marca sobre surface-1…3. El neón como texto, solo sobre surface-0 |
| `--shadow-ring-brand` | 3px rojo 22 % | Foco suave de campos (no sustituye a `--shadow-focus`) |
| `--gradient-btn-primary` (+ `-hover`), `--shadow-btn-primary` (+ `-hover`, `-pressed`) | | Botón primario: degradado, bisel y halo. Texto negro ≥4,7:1 en todo el botón |
| `--gradient-btn-secondary` (+ `-hover`) | | Secundario, sobre surface-1 |
| `--gradient-chip-active`, `--gradient-post-new`, `--gradient-progress` | | Chip activo, lo que añade el agente, carga de ProgressBar |
| `--gradient-hot`, `--shadow-hot` | base #22121A | Tarjeta firma. La base subió de #0E0709 para no leerse como un agujero sobre gris |
| `--ease-spring`, `--ease-snappy`, `--duration-press` | | Hover con muelle; pulsación en 90ms |

## Recipes — visual semantics, not a CSS mandate

These historical CSS recipes define binding Material semantics, not permission to hand-author per-component appearance or copy literal values into utilities. Use token-backed Tailwind/CVA; wells, overlays, solid/reduced-transparency fallbacks, reduced motion and focus remain mandatory. Surface is a future Foundation composition concept, not an importable React box. Gauge is the only implemented public React component; its approved transparent-frame exception is specified below. Other components require an approved Material recipe or Surface proposal before implementation, not automatic reuse or cloning of retired Surface classes. Minimize justified global CSS; approve any recipe exception and the meaningful seventh-file role in spec/plan, or STOP for human resolution. No new hardcoded values, tokens or dependencies without explicit approval.

The Surface names in the following historical recipes describe conceptual/future treatments, not current React APIs. A future Surface's general base hairline border remains a separate design concern; Gauge's accepted 0px frame border does not change that concept or every well recipe.

```css
/* Elevated surface: conceptual future Surface, not a current React API. */
background: var(--gradient-sheen), var(--color-surface-1);
border: 1px solid var(--color-border-hairline);
box-shadow: var(--shadow-edge), var(--shadow-elev-1);

/* Overlay: conceptual future Surface glass treatment, not an importable API. */
background: var(--color-surface-overlay);
backdrop-filter: blur(var(--blur-overlay)) saturate(150%);
border: 1px solid var(--color-border-hairline-strong);
box-shadow: var(--shadow-edge-strong), var(--shadow-elev-3);
@media (prefers-reduced-transparency: reduce) { background: var(--color-surface-2); backdrop-filter: none; }

/* Well: existing Material semantics; future Surface composition is conceptual. */
background: var(--color-surface-0);
box-shadow: var(--shadow-well);

/* Panel en bandas (Grafito; hoy en legacy/bundle.css como ModuleCard --banded) */
cabecera: background: var(--gradient-sheen), var(--color-surface-2); border-bottom: 1px solid var(--color-border-hairline); box-shadow: var(--shadow-edge);
cuerpo:   background: var(--color-surface-1);
pie:      background: var(--color-surface-0); border-top: 1px solid var(--color-border-hairline);
/* Sobre --glass todo sube un tono: cabecera surface-3, pie surface-1. */

/* Pulsado */
.eg-x:active { transform: translateY(1px) scale(.97); transition-duration: var(--duration-press); transition-timing-function: var(--ease-snappy); }
```

## En la web (Pulso)

- **Pro sobre gris, Show sobre negro.** Las secciones de lectura llevan SectionShell `--grafito`: `--color-surface-0` al 50 % sobre el fondo de partículas, que el director baja a 0.6 en perfil `read`. Las escenas (hero, capítulo, Lab, Live, Comunidad, cierre) siguen en negro con el 3D.
- **Fundidos solo en los bordes del grupo** (`--fade-top`, `--fade-bottom`): about + build, think + blog, discord y footer. Entre dos secciones grises seguidas no hay fundido.
- **Tarjetas sólidas en gris.** Dentro de `--grafito`, las tarjetas de la web pierden el cristal y pasan a `surface-1` (hover `surface-2`); la ProjectCard `--feat` sigue siendo la tarjeta hot.
- **Bandas.** Cabecera de TerminalCard y CommunityCard en `surface-2`; pie de NowCard en `surface-0`.
- Historical location: `legacy/bundle.css`. Preserve these styles and consumers until visual parity and an explicitly approved migration; porting does not automatically authorize moving/deleting rules.

## Gauge-only transparent-frame exception

The current Gauge contract is the [immutable v0.8 base](specs/gauge.md), [v0.9 composition amendment](components/gauge/v0.9/composition-amendment.md) and [v0.10 transparent-interior amendment](components/gauge/v0.10/transparent-interior-amendment.md), with a [bounded plan](components/gauge/v0.10/implementation-plan.md) and [separate approval](components/gauge/v0.10/approval.json). The v0.10 finish supersedes only Gauge's opaque background and recessed shadow; frozen v0.9 proposal wording is historical, interpreted through its approval record:

- Gauge owns a transparent native geometry-frame `div` (`eg-gauge-well`, retained internal marker only), hidden from accessibility APIs. No Surface import, private React replacement or public part-override API.
- Static token-backed CVA utilities in `types.ts`, composed through the hook with per-part `cn()`, own border-box sizing, padding 0, solid **0px border**, full radius via `--radius-full` and `--color-fg-default`, with transparent background, no image and explicit `box-shadow: none`. The actual host remains visible; the unchanged 10% alpha track blends with it, without an opaque annular backing. Decorative center content may still paint its own content. Do not copy Surface's conceptual base 1px border.
- `gauge.css` remains geometry-only: conic arc, radial mask and supporting alignment/clipping, including **+0.5px inner-edge smoothing**. The seven meaningful file roles, passive API, numeric policy and root outer-margin/alignment-only `className` contract remain unchanged.
- This bounded exception grants no global appearance permission, handwritten Material recipe, generic Surface-class cloning, new tokens/dependencies or automatic reuse for future components. A changed promise or broader stylesheet role requires separate approval.

Approval and the accepted pilot are not evidence that all retirement/test/build/consumer gates have completed; report those separately.

## En el código

- **Future composition concepts, not current APIs:** Surface treatments (`default`, `glass`, `brand`, `well`, `ghost`; conceptual elevations `flat`, `low`, `high`) and segmented Tabs remain provisional. They require their own approved contracts/plans before becoming usable React components; do not import them from `@egdev/ui` or retain a hidden Surface helper. Gauge's transparent frame is the bounded exception above, not a general substitute.
- **Marcas de producto** (ProductMark, pendiente de portar): `--gradient-btn-primary` + `--shadow-btn-primary`.
- **Foco** sigue siendo `--shadow-focus` y gana siempre a las sombras de material.
- **Deshabilitado** sigue siendo opacidad `.45`.
- Legacy Material v2 remains evidence, not proof of target compliance. Preserve its visual semantics and public markers; do not silently migrate consumers/styles.
