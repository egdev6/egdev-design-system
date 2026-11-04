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

## HomeTemplate

`HomeTemplate` coordinates an ambient canvas and one traveling 3D isotipo across consumer-defined page sections. Install `@egdev/effects`, `@egdev/tokens`, React and the package's peer dependencies, including `three`, then load both stylesheets:

```tsx
import '@egdev/tokens/tokens.css';
import '@egdev/effects/styles.css';
import { HomeTemplate, HomeTemplateAnchor } from '@egdev/effects';

const zoneTable = [
  { id: 'introduction', isotipo: true, scene: 'hero' as const },
  { id: 'reading', profile: 'read' as const }
];

export function Page() {
  return (
    <HomeTemplate zoneTable={zoneTable} onZoneChange={({ zone, previous }) => console.log(zone, previous)}>
      <main>
        <section data-zone="introduction">
          <h1>Introduction</h1>
          <HomeTemplateAnchor zone="introduction" className="h-48 w-48">
            <span aria-hidden="true">Decorative fallback</span>
          </HomeTemplateAnchor>
        </section>
        <section data-zone="reading"><h2>Reading</h2></section>
      </main>
    </HomeTemplate>
  );
}
```

`zoneTable` is required and ordered; `children` supplies the page. Each zone has an `id` matching `data-zone`, optional `isotipo` (default false), `scene` (`hero`, `chapter`, `lab`, `outro`; required for 3D), `ambient` (clamped 0–1, defaults to 0 for 3D and 1 otherwise), `profile` (`base`, `read`, `live`; default `base`) and `mobileIsotipo` (default true). `onZoneChange` receives `{ zone, previous }` for the first valid identity and subsequent identity changes, not per-frame progress. `previous` is initially null. The first matching section and first live anchor for a zone win.

Size each `HomeTemplateAnchor` using consumer geometry utilities and provide a decorative, non-interactive fallback. It remains visible until eligible 3D paint and returns if rendering fails. The consumer owns headings, landmarks, navigation, section heights, sticky layout and any scroll padding for fixed navigation. No scene automatically supplies sticky behavior. Avoid transformed, filtered or contained ancestors that make fixed layers use a non-viewport containing block.

Unfit transition bands fail open: effects stop, the active identity is removed, content and fallbacks remain visible, and valid remeasurement recovers automatically. No JavaScript or unavailable WebGL also leaves content and decorative fallbacks visible. Reduced motion snaps to static targets rather than running continuous animation.

Root `className` supports outer placement such as margins and self-alignment; Anchor additionally accepts box geometry. Appearance overrides are unsupported and invariant classes take precedence. Safe native attributes are forwarded; `style`, `role`, `dangerouslySetInnerHTML`, public refs and `asChild` are not supported.
