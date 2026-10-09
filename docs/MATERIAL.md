# Material

Desde octubre de 2026 (Material v2), EGDEV Foundation deja de ser plano: el rojo no cambia, cambia cómo están hechas las superficies. Desde Grafito (9 de octubre de 2026) la escalera de superficies es gris en lugar de negra. Este documento es la referencia para implementar componentes y pantallas con materia.

Origen: la versión 35 del artefacto *EGDEV Foundation* (Claude Design). Material v2 se aplicó a la web y a las seis apps; Grafito se validó en Quorb. Las decisiones están en [DECISIONES.md](DECISIONES.md).

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
| `--gradient-hot`, `--shadow-hot` | | Tarjeta firma |
| `--ease-spring`, `--ease-snappy`, `--duration-press` | | Hover con muelle; pulsación en 90ms |

## Recetas

```css
/* Superficie elevada (lo hace <Surface>) */
background: var(--gradient-sheen), var(--color-surface-1);
border: 1px solid var(--color-border-hairline);
box-shadow: var(--shadow-edge), var(--shadow-elev-1);

/* Overlay (lo hace <Surface tone="glass">) */
background: var(--color-surface-overlay);
backdrop-filter: blur(var(--blur-overlay)) saturate(150%);
border: 1px solid var(--color-border-hairline-strong);
box-shadow: var(--shadow-edge-strong), var(--shadow-elev-3);
@media (prefers-reduced-transparency: reduce) { background: var(--color-surface-2); backdrop-filter: none; }

/* Pozo (lo hace <Surface tone="well">) */
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

## En el código

- **No se repiten recetas a mano.** Una caja con materia es `<Surface>` (`tone`: `default`, `glass`, `brand`, `well`, `ghost`; `elevation`: `flat`, `low`, `high`).
- **Selector corto** = `<Tabs variant="segmented">`.
- **Marcas de producto** (ProductMark, pendiente de portar): `--gradient-btn-primary` + `--shadow-btn-primary`.
- **Foco** sigue siendo `--shadow-focus` y gana siempre a las sombras de material.
- **Deshabilitado** sigue siendo opacidad `.45`.
- `legacy/bundle.css` ya trae Material v2 en todos los componentes aún no portados; al portar uno, sus reglas se mueven con el material incluido.
