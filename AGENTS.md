# Contexto para agentes — egdev-design-system

Este archivo se inyecta como contexto a cualquier agente que trabaje en el repo. Es corto a propósito: los flujos detallados viven en `skills/`.

## Proyecto

**EGDEV Foundation** en código: sistema de diseño de egdev.es y de las herramientas egdev. Monorepo pnpm.

| Paquete | Ruta |
|---|---|
| `@egdev/tokens` | `packages/tokens` |
| `@egdev/ui` | `packages/ui` |
| `@egdev/effects` | `packages/effects` |

**Stack:** React 19 · strict TypeScript · individual `@radix-ui/react-*` packages · CVA · Tailwind v4 appearance utilities backed by `@egdev/tokens` · `cn()` (`clsx` + `twMerge`) · Storybook 10 · Vitest · Biome · pnpm.

**Comandos:** `pnpm storybook`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm tokens`.

**Current React availability:** `@egdev/ui` provides Gauge only; `cn` is a utility, not a component. Surface, IconButton and Tabs remain provisional/future Foundation concepts, not importable React APIs or current review references. Tokens and effects are unchanged. Recover Gauge's [effective v0.10 contract and separate plan approval](skills/_shared/component-contract.md#current-gauge-contract); this pilot does not establish catalog-wide M3 compliance.

## Documentos que mandan

- `docs/ARQUITECTURA.md` — paquetes, niveles, Radix y estilos.
- `docs/MATERIAL.md` — Material v2: superficies tonales, borde de luz, sombras de dos capas, pozos y overlays.
- `docs/CATALOGACION.md` — reutilizar → variante → componer → extraer → nuevo.
- `docs/CATALOGO.md` — nivel, paquete y base Radix de cada componente (se genera desde `scripts/catalog_data.py`).
- `skills/_shared/component-contract.md` — contrato de componente.
- [Prop naming source](skills/_shared/prop-naming.json) and [generated reference](docs/prop-naming.md): before new/changed own props, follow the [shared lookup/review workflow](skills/_shared/component-contract.md#prop-naming-registry); record exact conventions in specs/issues, never infer global approval or migrate APIs automatically.

## Reglas que no se negocian

- Antes de crear un componente, se intenta reutilizar o añadir una variante (`docs/CATALOGACION.md`).
- Comportamiento interactivo siempre con Radix si existe la primitiva. Nunca reimplementar teclado, foco ni ARIA.
- Radix se importa por paquetes individuales: `import * as TabsPrimitive from '@radix-ui/react-tabs'`. La actualización M1 mantiene la API y el CSS legado; M2 fija las normas y M3 adapta los componentes al contrato.
- `type`, nunca `interface`. Nunca `any`.
- Ni colores, ni espaciados, ni fuentes a mano: solo variables de `@egdev/tokens`. Si falta un token, se propone en `packages/tokens/src/theme.css` y se pide confirmación.
- Limited Gauge numeric-geometry exception: static `w-[var(--eg-gauge-size)]` / `h-[var(--eg-gauge-size)]` and a numeric CSS-pixel custom property only; presets use approved token utilities. No dynamic class interpolation or inline appearance; see the shared contract. API/validation and stylesheet-role approval remain separate.
- No flat replacements: background, border and shadow must follow [Material](docs/MATERIAL.md). Surface is a future concept, not an available React prerequisite. Gauge alone has an approved transparent native-frame CVA recipe with existing tokens, a 0px border and no background/image/shadow paint; other Material composition needs an approved recipe or Surface proposal. No handwritten shadows/gradients or generic Surface-class cloning.
- Declare utility variants with CVA in `types.ts`; compose each supported part with `cn()`. Six meaningful files are mandatory; `component-name.css` is optional and exists only when the spec/plan approves a meaningful compliant role. Without one, the spec states “No stylesheet”: no dummy CSS or invented replacement. Extra internal, non-exported modules (e.g. an engine port) only when the spec names them (see the shared contract).
- Style Radix/ARIA/`data-state` attributes through Tailwind data/aria variants; never mirror states into classes.
- Cada componente tiene su clase raíz estable `eg-<nombre>` (API pública). Nunca se estila por `id`; los `id` solo para accesibilidad, con `useId()`. Estados propios en `data-state`.
- Stable `eg-*` roots (including `eg-icon-btn`) are public markers, not a required BEM visual engine. Preserve legacy styles/consumers until parity and migration approval. Use minimal justified global CSS; approved hand-authored component recipes use `@layer components`, utilities their natural layer. `className` is not blanket appearance-override permission; document and test supported merge precedence.
- No añadir ni cambiar valores de tokens en `packages/tokens/src/theme.css`, ni añadir dependencias, sin confirmación del usuario. `tokens.css` es un artefacto compilado: no se edita.
- Código, tests y toda documentación nueva o actualizada en inglés: fichas, READMEs, JSDoc y stories (incluidos textos visibles y ejemplos). No traducir contenido heredado fuera del alcance autorizado.
- Commits en Conventional Commits: `<tipo>(<ámbito>): <descripción>`.

## Skills

| Cuándo | Skill |
|---|---|
| Se propone un componente nuevo o se duda de su nivel | `skills/component-cataloging/SKILL.md` |
| Se define o cambia la ficha individual de un componente | `skills/component-spec-proposer/SKILL.md` |
| Se implementa o porta un componente desde EGDEV Foundation | `skills/component-contributor/SKILL.md` |
| Se revisa un componente existente | `skills/components-auditor/SKILL.md` |
