# Contrato de componente — egdev-design-system

Referencia normativa para implementar, auditar o revisar un componente. Adaptada de Stack & Flow; **(egdev)** identifica decisiones propias, no una adopción de sus estilos o gates de GitHub.

## Antes de implementar

1. Inspecciona el catálogo **y la implementación React pública**; decide reutilizar → variante → componer → extraer → nuevo según [CATALOGACION.md](../../docs/CATALOGACION.md).
2. Para crear o cambiar promesas, usa [component-spec-proposer](../component-spec-proposer/SKILL.md) y la [plantilla individual](component-spec-template.md): documenta anatomía, props, defaults, estados, accesibilidad, base Radix y evidencia de la decisión. Espera aprobación explícita de esa versión de la ficha. Reutilizar sin cambiar promesas no requiere una ficha nueva. Si faltan datos o hay contradicciones, para y pregunta.
3. Presenta el plan por responsabilidades y espera aprobación. Si falta un token o paquete individual de Radix, propón el cambio y espera confirmación antes de modificar tokens o dependencias.
4. Implementa la unidad aprobada, comprueba comportamiento y documentación, y entrega evidencia y pendientes; no declares adaptado lo que solo está previsto.

**Current scope:** Gauge is the only implemented public React component in `@egdev/ui`; `cn` is a utility, not a component. Surface, IconButton and Tabs remain provisional/future Foundation concepts, not importable APIs or current implementation/review references. The accepted Gauge pilot does not establish catalog-wide M3 adaptation or approve all provisional classifications. Publishing this contract authorizes no additional implementation or migration.

### Current Gauge contract

Recover the [immutable v0.8 base](../../docs/specs/gauge.md) and its [contract approval](../../docs/components/gauge/v0.8/approval.json), the [v0.9 composition amendment](../../docs/components/gauge/v0.9/composition-amendment.md) and its [plan approval](../../docs/components/gauge/v0.9/plan-approval.json), then the [v0.10 transparent-interior amendment](../../docs/components/gauge/v0.10/transparent-interior-amendment.md), [bounded plan](../../docs/components/gauge/v0.10/implementation-plan.md) and [separate approval](../../docs/components/gauge/v0.10/approval.json). The current finish is a transparent geometry frame, not an opaque recessed well. Frozen base/header and v0.9 Pending/proposal wording remain historical, interpreted through their approval records; do not rewrite them or infer approval/completion from a digest. Current implementation reference: `packages/ui/src/atoms/gauge/`. Retirement validation, packed consumers and any unevaluated accessibility checks remain separate evidence, not consequences of approval.

## Archivos

El patrón objetivo de cada carpeta `packages/ui/src/{primitives|atoms|molecules|organisms|templates}/{kebab-name}/` es de **seis archivos obligatorios y una hoja de estilos opcional**, con estas responsabilidades:

1. `types.ts` — variantes CVA, tipos públicos y anotaciones para Storybook.
2. `useComponentName.ts` — lógica, estado, refs, handlers, derivación de aria y la llamada a `componentVariants(...)`.
3. `ComponentName.tsx` — solo JSX; consume el hook. Sin estado, sin CVA, sin lógica.
4. `component-name.css` — **optional**; only when the spec/plan approves a meaningful compliant CSS role (for example Gauge's geometry recipe). Not automatic permission for per-component BEM appearance.
5. `ComponentName.test.tsx` — tests del hook y del componente.
6. `ComponentName.stories.tsx` — documentación en Storybook.
7. `index.ts` — exportación con nombre y tipos.

Six meaningful files are mandatory: `types.ts`, `useComponentName.ts`, `ComponentName.tsx`, `ComponentName.test.tsx`, `ComponentName.stories.tsx` and `index.ts`. The stylesheet is optional: create `component-name.css` only when the approved spec/plan records a meaningful role that utilities cannot express under the utility-first/minimal-global-CSS policy; otherwise the spec states “No stylesheet” and the file is not created. Never create empty/dummy files or fake hooks, or invent a replacement architecture.

## Snapshot identity and issue history

Use the [template identity fields](component-spec-template.md) for each snapshot: version, `contentSHA256`, visual hashes, `approvalReference`, `canonicalIssue` and `latestPublishedComment` (Pending when unpublished). Hash the canonical payload, not its own tracking metadata; recover exact content and scoped human approval, never opaque assertions from memory. A component comment does not approve registry conventions globally.

Keep **one issue per component**, not per version: the initial body holds the first spec; later versions go in separately authorized comments with recoverable snapshots and approval scope. Follow [issue handoff](../component-spec-proposer/references/issue-handoff.md); no silent body edits or automatic remote actions. Capture references use `docs/components/<kebab-name>/v<spec-version>/` per the [guide](../../docs/design/README.md); preserve historical archives.

## TypeScript

- `type`, nunca `interface`. `import type` / `export type` para tipos.
- Exportaciones con nombre; nada de `export default` en componentes.
- Tipos reutilizables entre componentes en `packages/ui/src/types`; los propios, en su `types.ts`.
- Las props propias públicas se declaran en `types.ts` con JSDoc en inglés, obligatoriedad y valores admitidos. No dupliques manualmente las props nativas heredadas.
- Use `@default` only for actual constant public defaults matching CVA/hook behavior. In the installed docgen/Storybook pipeline, write string constants as bare tag values (for example, `@default md`), not quoted literals: extra quotes become part of the documented value. Describe derived fallbacks and optional absence in the English description body, without a fabricated fixed `@default` (for example, Gauge derives normalized decimal valueText and omits center content when absent).
- Los hooks devuelven objetos tipados. Nunca `any`.
- `T[]`, no `Array<T>`. Sin `!`, `@ts-ignore` ni `@ts-expect-error` sin motivo escrito.
- Hereda props nativas y resuelve conflictos con `Omit`; usa `ComponentPropsWithoutRef<'elemento'>` si la API no expone refs. Heredar `ComponentProps` no prueba que una ref llegue al DOM.
- Declare explicit public props in the component generic (for example, `FC<GaugeProps>`). Do not promise universal refs or impose `forwardRef` without verifying each component's contract. Gauge exposes no ref or `asChild` API.
- El peer declara React `>=18.0.0` y el desarrollo usa React 19: una API de refs exclusiva de React 19 no acredita consumo con React 18. La evidencia de compatibilidad vive en el [plan ODD](../../docs/odd/stack-alignment.md), no se deduce de los tipos.
- `cn()` desde `@/lib/cn`.
- `...rest` al elemento nativo o raíz compatible para que pasen `data-*`, `aria-*` y atributos de formulario sin pisar la semántica. Documenta restricciones reales de composición, como `asChild`.

## Public prop controls

`@control` and `@controlReason` are **local project conventions, not native Storybook JSDoc configuration**. The explicitly user-approved central metadata enhancer in `.storybook/jsdoc-controls.ts`, registered through `argTypesEnhancers` in `.storybook/preview.tsx`, reads `component.__docgenInfo.props[prop].tags` from the configured `react-docgen-typescript` integration. Storybook's own extraction ignores that separate tag map; it does not parse these tags natively. `.storybook/main.ts` explicitly matches the installed Vite plugin's already-enabled tag-map behavior and string-valued defaults for direct-parser parity; a missing Vite flag was not the integration defect.

For a public TypeScript `string` prop, use local `@control text`: extracted semantic `argTypes.type.name: 'string'` → official widget `argTypes.control: { type: 'text' }`. The enhancer validates the extracted type, never changes it to fit a comment. Semantic types and widget names are distinct; see Storybook 10.6 [ArgTypes type](https://storybook.js.org/docs/api/arg-types#type) and [control.type](https://storybook.js.org/docs/api/arg-types#controltype).

Every own public prop declaration in `types.ts` must carry English JSDoc with an explicit `@control`. Cover each discriminated-union branch separately, including repeated prop names; do not redeclare inherited React/native props just to annotate them.

- The supported local directives are exactly `text`, `number`, `boolean`, `select` and `false`. Obsolete `@control string` is unsupported, not a compatibility alias. Choose from the full public type, not one convenient example. The [14 upstream control types and guardrails](../component-contributor/references/stories.md#official-storybook-controls-catalog) are a capability catalog, not additional supported metadata directives. No ranges, arbitrary tag JSON, options aliases, `@min` or `@mapping` parser is installed.
- `text` requires the extracted semantic type `string`, never a semantic type named `text`. `number` requires an extracted numeric type. `boolean` requires an extracted boolean or an enum of the actual primitive `false` and `true`, not the string literals `'false'` and `'true'`. `select` requires a finite extracted primitive enum; options retain extracted values and order. Unrestricted strings, unresolved aliases and mixed numeric/preset unions cannot be guessed into a select.
- For ReactNode, event handlers or unrepresentable mixed unions, use `@control false` with a concrete English `@controlReason` explaining the limitation and pointing to dedicated story examples. It disables only the controller (`argTypes.control: false`), retains the documented row, and never sets `table.disable`. This is not a boolean public prop or a default of false. Do not narrow the API or introduce a renderer adapter.
- Reserve `@default` for actual constants from the hook/CVA/API, using bare string values for this installed pipeline; keep derived fallback and absence rules in ordinary English descriptions, not fixed-value tags. Required props have no dummy default; supply required story args instead. The Docs Default column documents constants, while Controls reflect supplied args and may remain unset (`Choose option` / `Set string`) even when the component applies its runtime default. Do not inject optional args to fill the UI or treat such placeholders as a broken API. The enhancer changes no defaults, requiredness, semantic types, descriptions, args, initial values or runtime behavior.
- Repeated identical newline-separated directives from discriminated unions normalize to one. Unknown, conflicting or type-incompatible directives and missing false-control reasons leave the row unchanged and produce a `Component.prop` diagnostic from the pure helper. Owned metadata tests must require no diagnostics; the enhancer deliberately neither throws in rendering nor repeatedly logs them. Unknown, inherited/native and untagged rows are untouched; no new rows are created. Existing explicit controls remain authoritative.
- This central, metadata-only enhancer is the explicitly approved exception, not permission for per-component manual `argTypes`, rendering/JSX adapters, dependencies, API restrictions or unrelated preview changes. Existing approval gates remain in force.
- Verify AST coverage, real docgen metadata and the installed extraction/enhancer/inference pipeline separately, then verify actual Controls in the browser. Without this registered integration, native inference still chooses radios for small enums and may show Set object for complex values. Tags or AST counts alone do not prove working widgets.

The directive-name correction from `string` to `text` changes no default behavior: constant-only bare `@default` values, derived/absence descriptions and optional unset Controls remain unchanged.

See the [mapping, exception examples and checklist](../component-contributor/references/stories.md#public-prop-control-documentation). Apply this policy within authorized implementation/audit scope; publishing it does not authorize a migration of unrelated components.

## Prop naming registry

Use the [canonical JSON registry](prop-naming.json) and its [generated view](../../docs/prop-naming.md); do not copy the global matrix into component specs.

- Before every new or changed own prop, look up semantic meaning, canonical name **and aliases**. Reuse a matching entry and append component usage, never duplicate the concept. Propose a new concept with an explicit semantic ID and component-specific type. Each usage needs `source: {path, symbol, revision}`: manually inspect the public API symbol in the repository-relative file and record `sha256:<whole-file byte hash>` of that reviewed working-tree source; never invent a Git revision.
- Near each spec's API, link the registry and record exact entry IDs/conventions applied, new proposals and scoped exceptions; carry these into issue handoffs. Keep convention approval separate from component/spec/issue approval: `proposed`, `approved` and `deprecated` are not automatically promoted. Matching existing API evidence is not global approval.
- Types remain component-specific. Never auto-rename/migrate existing APIs or mass-register unrelated existing props; inherited native attributes and `className` need no own entry unless an explicit semantic policy is proposed.
- Convention `approval` is null for `proposed`; `approved`/`deprecated` require `{reference, scope, contentHash}` with a recoverable HTTPS resource or existing repository-file reference, exact `convention:<id>` scope and matching `conventionHash(entry)`. Exceptions require `{scope, propName, reason, approval}`: one component, an alternative prop name and a reason; null means pending, never API permission. Recorded exception approval uses exact `exception:<id>:<scope>:<propName>` scope and `exceptionHash(exception)`. These exported helpers and canonical hash rules are documented in the generated view; approval must bind the actual content, not just a recomputed hash. Never invent human approval.
- Audit new/changed own-prop coverage and exceptions against the approved spec. `pnpm props:check` checks schema, scoped conflicts, repository containment, approval hashes, source-byte freshness and generated-view freshness; it cannot prove meaning, human consent, symbol existence or TypeScript types and performs no network lookup. Even unrelated edits in an evidence file require renewed source review and explicit JSON revision updates. Usage observations do not change convention hashes; `--write` never refreshes evidence or approval.
- Edit JSON, regenerate with `pnpm props:docs`, then run `pnpm props:check` and `pnpm test:props`; never hand-edit the generated view.

## Estilos **(egdev)**

- Declare token-backed Tailwind appearance variants with CVA in `types.ts`; use `cn()` (`clsx` + `twMerge`) per supported part. Preserve previously adopted separation/review requirements; do not import unadopted upstream rules.
- Colores, espaciados y fuentes salen de variables de `@egdev/tokens`; no de valores en duro ni estilos inline de apariencia. Si falta un token, propón incorporarlo a `packages/tokens/src/theme.css` y espera confirmación. La salida nativa `tokens.css` es compilada y no se edita.
- **Limited geometry exception — Gauge numeric diameter only:** use static `w-[var(--eg-gauge-size)]` and `h-[var(--eg-gauge-size)]` with the dynamic **inline custom property** `--eg-gauge-size` expressed in numeric CSS pixels. Presets use approved token utilities. Never interpolate utility class strings (e.g. `width-[${size}px]`: wrong prefix and not statically scannable). This is not permission for inline colors, fonts, shadows, spacing or hardcoded appearance. Gauge's current base-plus-v0.9-plus-v0.10 contract already approves finite-positive numeric validation, invalid-size fallback to md without an artificial cap, passive API/accessibility, Material and the meaningful geometry-only `gauge.css` role; do not reopen these accepted decisions. Changed promises or broader roles require separate approval.
- No escribas sombras, degradados ni mezclas de color a mano. Usa los tokens y recetas de [MATERIAL.md](../../docs/MATERIAL.md); un tratamiento nuevo requiere propuesta y confirmación, aunque todavía no se repita.
- **Material v2:** preserve elevated, recessed-well, overlay and pressed treatments plus transparency/motion fallbacks under [Material](../../docs/MATERIAL.md). Surface (including conceptual `ghost`/`flat` treatments) is a future concept, not an available React prerequisite or escape from Material. Gauge alone has an approved transparent native geometry frame: static CVA utilities in `types.ts`, composed through the hook with `cn()`, use border-box, padding 0, solid **0px border** (not Surface's conceptual base 1px), full token radius and foreground, with transparent background, no image and explicit `box-shadow: none`. The actual host shows through; the unchanged 10% alpha track blends with it, without opaque annular backing. Decorative center content remains visible. No Surface import, hidden React helper, generic Surface-class cloning or general flat-well permission. `gauge.css` remains geometry-only, including +0.5px smoothing. Other components need an approved recipe or Surface proposal, not automatic reuse of this exception; the six mandatory files remain required and any stylesheet still needs its approved role.
- Style Radix/ARIA attributes (`data-state`, `data-disabled`, `aria-selected`, `aria-pressed`) through Tailwind data/aria variants. Never mirror states into classes; preserve legacy `.is-*` until parity and approved migration.
- Deshabilitado: opacidad `.45`, `pointer-events: none` y cursor; no se cambia a gris.
- Foco: `:focus-visible` con `box-shadow: var(--shadow-focus)` u `outline` con `--color-focus-ring`. Nunca solo un brillo decorativo.
- `prefers-reduced-motion`: sin transformaciones ni animaciones.
- Validate utilities against `@egdev/tokens`, including themes/spacing. Arbitrary token references (e.g. `bg-[var(--color-surface-1)]`) are not arbitrary hardcoded values; no handwritten colors/shadows/spacing/fonts. Tailwind defaults require an explicitly justified, approved fallback, never blanket permission.

### Clases, ids y capas **(egdev)**

La norma para que el CSS de los componentes y Tailwind convivan sin pelearse:

1. Stable `eg-<name>` public roots and established public part markers remain API for consumers/Claude Design; preserve them without requiring a BEM visual engine. Gauge's root is `eg-gauge`; its internal well marker grants no public part-selector API. The historical/future IconButton marker remains `eg-icon-btn`, never `eg-icon-button`; it does not imply an available React component. No silent consumer/style migration.
2. **Nunca se estila por `id`.** Los ids internos solo relacionan elementos para accesibilidad (`aria-controls`, `aria-labelledby`, `htmlFor`); se generan con `useId()`, no con literales compartidos entre instancias.
3. CVA selects utilities, not mirrored state classes. Own states use documented `data-state` without replacing native ARIA. Gauge condition states retain passive meter semantics; a future pressed-button contract must preserve `aria-pressed`, not invent a switch role.
4. Keep approved hand-authored recipes low/flat specificity: one class, optionally an attribute/pseudoclass. No nested blocks, tag selectors except internal svg/img, or `!important`; generated Tailwind variants are not hand-authored recipes.
5. Minimize global CSS; justify and approve exceptions. Hand-authored component recipes use `@layer components`; Tailwind utilities keep their natural layer. Cascade depends on layers, specificity and conditions, not simply class-string order.
6. Public defaults/variants remain the appearance API. Specify supported `className` surfaces and precedence per part, then test them; apps receive no arbitrary appearance-override permission. `clsx` composes conditions; `twMerge` resolves recognized utility conflicts only, not CSS selectors, token semantics, every custom group or variant combination. Document limitations/configuration; do not promise universal last-class wins.
7. **Selectores para tests y temas:** se usan roles y nombres accesibles (Testing Library); para temas o depuración, la clase raíz. Nada de `data-testid` en el sistema.

## Radix

- Paquetes individuales con alias de namespace: `import * as TabsPrimitive from '@radix-ui/react-tabs'`. No se usa el paquete unificado `radix-ui`. Si falta un paquete, para y pide confirmación antes de añadirlo.
- Usa la primitiva disponible; no reimplementes su teclado, foco, ARIA o interacción. M1 preserva API y legado; publicar normas en M2 no acredita adaptación completa de componentes.
- `Portal` para todo lo flotante.
- `asChild` en los `Trigger` cuando se compone con componentes del sistema.
- Animaciones con `[data-state]`.
- La lógica de abrir/cerrar, filtrar o calcular, en el hook.
- Patrones: [radix-patterns.md](../component-contributor/references/radix-patterns.md). Sus ejemplos heredados del paquete unificado no autorizan imports contrarios a este contrato.

## Storybook y tests

- [Stories](../component-contributor/references/stories.md): Storybook 10, `autodocs`, `Meta`/`StoryObj` from `@storybook/react-vite`; use `action` from `storybook/actions` only for applicable approved events. Type meta with the real component (`Meta<typeof Gauge>` or `satisfies Meta<typeof Gauge>`). Gauge has no event/action story.
- Controls use Vite and `react-docgen-typescript` configured in `.storybook/main.ts`: verify requiredness, allowed native props, enums and defaults on the real component, plus composition only when exposed by its API (Gauge has no `asChild`). Do not write manual `argTypes` to mask extraction failures.
- Follow [public prop controls](#public-prop-controls) for every own declaration and union branch. The approved central enhancer maps validated local tags; verify extracted values, registered pipeline behavior and actual browser widgets separately.
- Args solo para props requeridas y ejemplos; `Default` no sobrescribe defaults documentados. JSDoc sobre meta y stories según la guía; títulos `Primitives/…`, `Atoms/…`, `Molecules/…`, `Organisms/…`, `Templates/…`.
- Código, tests, identificadores y toda documentación nueva o actualizada en inglés: fichas, READMEs, JSDoc de props/componentes/stories, encabezados, descripciones, comentarios, nombres visibles, etiquetas y textos de ejemplo de Storybook. Traducir contenido heredado requiere alcance explícito, no una corrección silenciosa.
- [Tests](../component-contributor/references/testing.md): use `renderHook`, `render`, `screen`, `userEvent`; cover applicable defaults, ARIA, keyboard, disabled, public markers and per-part merge invariants, not full class snapshots. No `play` or unrelated example dependencies. Require actual CSS build/static CVA scanning and package-consumer evidence without a Tailwind compiler; planned checks are not observed results.

## Accesibilidad

- Nombre accesible en todo control (los de solo icono, obligatorio por prop).
- Teclado completo: lo da Radix; si no hay Radix, se documenta y se testea.
- Tamaños de control: 32/40/48 px; táctil mínimo 44 px en móvil.
- El color nunca va solo: estado con icono o texto.

## `index.ts`

```ts
export { ComponentName } from './ComponentName';
export type * from './types';
export { componentNameVariants } from './types'; // si se expone para composición
```

Y se añade a `packages/ui/src/index.ts` en la sección de su nivel.
