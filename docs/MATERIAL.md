# Material

Desde octubre de 2026 (Material v2), EGDEV Foundation deja de ser plano. El negro y el rojo no cambian: cambia cómo están hechas las superficies. Este documento es la referencia para implementar componentes y pantallas con materia.

Origen: la versión 32 del artefacto *EGDEV Foundation* (Claude Design), aplicada ya a la web y a las seis apps. Las decisiones están en [DECISIONES.md](DECISIONES.md).

## Principios

1. **Superficies tonales.** Cuanto más arriba, más clara. En oscuro la elevación se ve por tono, no por sombra.
2. **Borde de luz.** Toda superficie elevada lleva 1px de luz en el canto superior y un brillo cenital que se apaga hacia abajo. La separación entre superficies es una hairline blanca, no el rojo.
3. **Sombras de dos capas.** Una pegada y otra amplia; nunca una sola sombra desplazada.
4. **Lo que se rellena se hunde, lo que se pulsa sobresale.** Inputs, buscador, casillas, pistas de progreso y el segmentado son pozos; botones, chips y lo seleccionado sobresalen.
5. **Solo flota lo que flota.** Menús, barra superior con scroll, paleta de comandos y paneles sobre el escritorio son overlays translúcidos, con alternativa sólida.
6. **Una firma por vista.** La tarjeta hot (ProjectCard `--feat`) es el único elemento con canto rojo y halo; todo lo demás se queda callado.
7. **Movimiento con intención.** Hover con muelle corto, pulsación seca. Con `prefers-reduced-motion`, sin desplazamientos.

## Tokens

| Token | Valor | Uso |
|---|---|---|
| `--color-surface-0` | #000 | Canvas y pozos |
| `--color-surface-1` | #0C0C0E | Tarjetas, paneles, barras laterales, tablas. `--color-bg-surface` es su alias |
| `--color-surface-2` | #141417 | Hover, cabeceras de tabla, diálogos |
| `--color-surface-3` | #1D1D21 | Lo seleccionado (nav activa, segmento, IconButton pulsado) |
| `--color-surface-overlay` | rgba(20,20,24,.74) | Lo que flota, siempre con `--blur-overlay` (20px) y `saturate(150%)` |
| `--color-border-hairline` / `-strong` | blanco 8 % / 14 % | Separación de superficies; `-strong` en hover y overlays. Los controles siguen con `--color-border-control` (≥3:1) |
| `--gradient-sheen` | blanco 4,5 % → 0 | Brillo cenital, apilado sobre el color de la superficie |
| `--shadow-edge` / `-strong` | inset 1px blanco 7 % / 13 % | Borde de luz |
| `--shadow-elev-1` · `-2` · `-3` | dos capas | Tarjeta · hover y destacado · overlay |
| `--shadow-well` | inset negro | Pozos |
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
