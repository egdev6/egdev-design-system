# @egdev/effects

Capas de efecto de la web: el fondo de partículas (AmbientBackground) y el isotipo 3D (Isotipo3D).

Van en un paquete aparte porque usan canvas a pantalla completa y three.js, y ninguna app de producto (Mando, Cadencia, egdev-live…) debería cargarlos.

## Estado

`reference/` guarda el código aprobado tal cual salió del prototipo de la web (EGDEV Pulso, 1 de octubre de 2026):

| Archivo | Qué es | Componente destino |
|---|---|---|
| `particle-streaks.js` | Motor de partículas (port de Particle Studio) con API `set/start/stop/renderOnce` | AmbientBackground |
| `pulso-director.js` | Director de efectos por porcentaje de scroll | AmbientBackground + HomeTemplate (web) |
| `pulso-iso3d.mjs` | Isotipo extruido en three.js con fallback SVG | Isotipo3D |

Al portar: respetar la API y los valores de configuración, parar el bucle con `prefers-reduced-motion` y cuando la capa está a opacidad 0, y añadir `three` como peerDependency (pedir confirmación antes de añadir dependencias).
