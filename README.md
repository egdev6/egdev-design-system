# egdev-design-system

EGDEV Foundation en código: el sistema de diseño que comparten egdev.es y todas las herramientas egdev (Mando, Cadencia, egdev-live, Criterio, media-tool y Quorb).

> **Mando** formará parte de **Gentle Dots**, el gestor de agentes de Gentleman Programming, en colaboración con Alan Buscaglia: Mando aporta la capa de módulos (herramientas MCP, permisos, delegación e interfaces de los módulos) y Gentle Dots la orquestación.

- **Base:** React + [Radix UI](https://www.radix-ui.com/) para el comportamiento, CSS con tokens para el aspecto.
- **Diseño:** se decide en Claude Design (artefacto *EGDEV Foundation*) y se traspasa aquí.
- **Metodología:** atomic design con primitivas, heredada de [Stack & Flow Design System](https://github.com/Stack-and-Flow/design-system).

## Paquetes

| Paquete | Qué es |
|---|---|
| [`@egdev/tokens`](packages/tokens) | Tokens: JSON fuente, variables CSS y tema de Tailwind v4 |
| [`@egdev/ui`](packages/ui) | Componentes sobre Radix: primitivas, átomos, moléculas, organismos y plantillas |
| [`@egdev/effects`](packages/effects) | Capas de efecto de la web (partículas, isotipo 3D) |

## Empezar

```bash
pnpm install
pnpm tokens        # regenera tokens.css y theme.css desde tokens.json
pnpm storybook     # http://localhost:6006
pnpm test
pnpm typecheck
pnpm build
```

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md): paquetes, niveles, Radix y estilos.
- [Material](docs/MATERIAL.md): superficies, borde de luz, sombras, pozos y overlays (Material v2).
- [Decisiones](docs/DECISIONES.md): copia del registro de decisiones de EGDEV Foundation.
- [Catalogación](docs/CATALOGACION.md): reutilizar, variante o componente nuevo, y en qué nivel.
- [Catálogo](docs/CATALOGO.md): cada componente de EGDEV Foundation con su nivel, paquete y base de Radix.
- [Plan de traspaso](docs/PLAN.md): orden de las fases.

## Para agentes

[AGENTS.md](AGENTS.md) resume las reglas; los flujos detallados están en [`skills/`](skills).

## Licencia

MIT
