# Contexto para agentes — egdev-design-system

Este archivo se inyecta como contexto a cualquier agente que trabaje en el repo. Es corto a propósito: los flujos detallados viven en `skills/`.

## Proyecto

**EGDEV Foundation** en código: sistema de diseño de egdev.es y de las herramientas egdev. Monorepo pnpm.

| Paquete | Ruta |
|---|---|
| `@egdev/tokens` | `packages/tokens` |
| `@egdev/ui` | `packages/ui` |
| `@egdev/effects` | `packages/effects` |

**Stack:** React 19 · TypeScript estricto · Radix UI (`radix-ui`) · CVA · CSS con tokens (clases BEM `eg-*`) · Tailwind v4 solo para layout de apps · Storybook 8 · Vitest · Biome · pnpm.

**Comandos:** `pnpm storybook`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm tokens`.

## Documentos que mandan

- `docs/ARQUITECTURA.md` — paquetes, niveles, Radix y estilos.
- `docs/MATERIAL.md` — Material v2: superficies tonales, borde de luz, sombras de dos capas, pozos y overlays.
- `docs/CATALOGACION.md` — reutilizar → variante → componer → extraer → nuevo.
- `docs/CATALOGO.md` — nivel, paquete y base Radix de cada componente (se genera desde `scripts/catalog_data.py`).
- `skills/_shared/component-contract.md` — contrato de componente.

## Reglas que no se negocian

- Antes de crear un componente, se intenta reutilizar o añadir una variante (`docs/CATALOGACION.md`).
- Comportamiento interactivo siempre con Radix si existe la primitiva. Nunca reimplementar teclado, foco ni ARIA.
- Radix se importa del paquete unificado: `import { Tabs as TabsPrimitive } from 'radix-ui'`.
- `type`, nunca `interface`. Nunca `any`.
- Ni colores, ni espaciados, ni fuentes a mano: solo variables de `@egdev/tokens`. Si falta un token, se propone en `tokens.json` y se pide confirmación.
- Ninguna superficie plana: fondo, borde y sombra salen de Material (`<Surface>` o las recetas de `docs/MATERIAL.md`). Nada de sombras ni degradados escritos a mano.
- Variantes con CVA en `types.ts`, que producen clases BEM `eg-*`. El CSS del componente va en su propio `.css`.
- Estados de Radix por atributo (`[data-state]`, `[aria-selected]`), no con clases a mano.
- Cada componente tiene su clase raíz estable `eg-<nombre>` (API pública). Nunca se estila por `id`; los `id` solo para accesibilidad, con `useId()`. Estados propios en `data-state`.
- Todo el CSS de `@egdev/ui` va en `@layer components`; Tailwind por `className` solo para colocar un componente, nunca para cambiar su aspecto (eso es una variante).
- No tocar `tokens.json` ni añadir dependencias sin confirmación del usuario.
- Código y tests en inglés; documentación y textos de Storybook en español.
- Commits en Conventional Commits: `<tipo>(<ámbito>): <descripción>`.

## Skills

| Cuándo | Skill |
|---|---|
| Se propone un componente nuevo o se duda de su nivel | `skills/component-cataloging/SKILL.md` |
| Se implementa o porta un componente desde EGDEV Foundation | `skills/component-contributor/SKILL.md` |
| Se revisa un componente existente | `skills/components-auditor/SKILL.md` |
