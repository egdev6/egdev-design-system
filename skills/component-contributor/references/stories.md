> Adapted from Stack & Flow (`skills/component-contributor/references/stories.md`, MIT), with EGDEV's English output and token-backed Tailwind/CVA target under the [shared contract](../../_shared/component-contract.md); preserve public markers and legacy pending approved migration.

# Referencia de stories de Storybook

Convenciones canónicas para `*.stories.tsx` en este repositorio.

**Current example:** Gauge is the only public React component and the only active component-story reference; `cn` is a utility. Use its [effective v0.9 base-plus-amendment contract and separate plan approval](../../_shared/component-contract.md#current-gauge-contract). Surface, IconButton and Tabs are future/provisional Foundation concepts, not available imports or current stories. Gauge is passive: no events/actions, `Disabled`, ref or `asChild` example applies.

## Propósito

Consulta esta referencia ANTES de escribir o revisar stories. No improvises convenciones a partir de los valores genéricos de Storybook.

## Reglas obligatorias

- Usa `autodocs`.
- **No** definas `argTypes` manuales en `meta` ni en stories individuales salvo excepción justificada y aprobada en el plan; nunca para ocultar fallos de docgen.
- Importa `action(...)` desde `storybook/actions` para los argumentos de eventos.
- Importa los tipos `Meta` y `StoryObj` desde el framework `@storybook/react-vite`.
- Nunca uses manejadores vacíos como `() => undefined` en los argumentos.
- Demonstrate the canonical public defaults/variants and supported className contract. Token-backed utility appearance belongs in the component; renders/decorators may supply token-validated layout, never locally restyle internals to mask violations.
- No copies utilidades fraccionarias de otros temas: usa solo espaciados disponibles en `@egdev/tokens/theme.css`; que Tailwind admita una clase no acredita un token EGDEV.
- Toda la documentación nueva o actualizada de Storybook va en inglés: JSDoc, encabezados, descripciones, comentarios, nombres visibles de stories, etiquetas de argumentos y textos de ejemplo. El código y los identificadores también van en inglés. Traducir stories heredadas fuera del alcance requiere autorización explícita.
- La documentación del componente va en un bloque JSDoc inmediatamente antes de `const meta`; **no** en `parameters.docs.description.component`.
- El bloque JSDoc del componente usa estos encabezados:
  - `## Description` — obligatorio; explica qué hace y cuándo usarlo.
  - `## Dependencies` — solo cuando usa otros componentes del sistema o primitivas externas; indica cada dependencia y su motivo.
  - `## Usage guidelines` — solo para usos complejos; explica composición, restricciones o comportamientos no evidentes.
- Cada story lleva un JSDoc útil inmediatamente antes de `export const StoryName`; **no** añadas tarjetas de documentación, paneles, textos auxiliares ni notas de uso al lienzo.
- Cada story debe demostrar un estado, eje de variantes, restricción de composición, comportamiento accesible o integración distinto. No dupliques lo que ya cubren los controles, argumentos u otras stories.
- `.storybook/preview.tsx` no define `globalTypes` ni selector de tema: desactiva backgrounds, usa layout `padded` y ordena niveles con `storySort`. No inventes un selector ni añadas una story genérica `DarkMode`.
- Un caso temático debe usar configuración real y demostrar ámbito local, herencia en portales o una regresión relevante; explica el motivo en JSDoc y aprueba cambios de configuración por separado.
- Los renders y decoradores son ejemplos: pueden aportar layout, pero no interfaces narrativas de documentación.
- Los argumentos de `Default`, incluidos los heredados de meta, no deben sustituir defaults del componente/hook/CVA: solo props requeridas y ejemplos.
- Los componentes interactivos incluyen `Disabled` y escenarios de interacción cuando corresponda.
- Sin funciones `play`: los tests de interacción van en `ComponentName.test.tsx`.

## Public prop control documentation

**Local conventions with an approved central integration, not native Storybook tags:** `.storybook/jsdoc-controls.ts` reads the separate `component.__docgenInfo.props[prop].tags` map produced by `react-docgen-typescript`. `.storybook/preview.tsx` registers it through the supported `argTypesEnhancers` preview field, after renderer extraction and before final native Controls inference. It writes only validated control metadata and finite-enum options on existing tagged own rows. Storybook extraction itself ignores the separate tags; `@controlReason` remains an explanatory local requirement for `false`, not upstream configuration. See [TypeScript integration](https://storybook.js.org/docs/configure/integration/typescript).

Apply the [shared policy](../../_shared/component-contract.md#public-prop-controls) to every own public prop declaration in `types.ts`, including each discriminated-union branch. Inherited React/native props are not duplicated. Keep all new JSDoc and reasons in English; do not migrate unrelated components without authorization. The mappings below define local annotations; consult the [upstream catalog](#official-storybook-controls-catalog) for official widget names and other public types.

| Full public type | Supported local tag | Example |
| --- | --- | --- |
| `string` | `@control text` | Gauge `label`, `valueText`, `stateText`, `unavailableText` |
| `number` | `@control number` | Gauge `value` |
| `boolean` | `@control boolean` | An own boolean flag, when present in the approved API |
| Literal choices | `@control select` | Gauge `state` in both normal and non-normal branches |
| `ReactNode` | `@control false` plus concrete `@controlReason` | Gauge `center`: non-serializable content; demonstrate it in `CenterContent` |
| Handler function | `@control false` plus concrete `@controlReason` | Explain that a callback is not serializable; demonstrate an approved event story using `action(...)` |
| Unrepresentable mixed union | `@control false` plus concrete `@controlReason` | Gauge `size`: preset names and numeric CSS-pixel diameters; demonstrate both in `Sizes` |

The supported local directives are exactly `text`, `number`, `boolean`, `select` and `false`. Public TypeScript `string` → local `@control text` → validated extracted semantic `argTypes.type.name: 'string'` → official widget `argTypes.control: { type: 'text' }`. Storybook 10.6 distinguishes [semantic type](https://storybook.js.org/docs/api/arg-types#type) from [control.type](https://storybook.js.org/docs/api/arg-types#controltype): `string` is a type, `text` a widget. The enhancer does not rewrite semantic types: `text` requires the extracted type `string`, not a type named `text`. Obsolete `@control string` is unsupported, not a compatibility alias. `number` requires a numeric type; `boolean` accepts a boolean or the actual primitive false/true enum, not a quoted-string union. `select` derives ordered primitive options only from a finite extracted enum, never from unresolved aliases or an unrestricted string.

Do not label Gauge `size` as just `select` or `number`: neither represents its full type. Its existing `Sizes` story covers presets, fractional custom diameters and invalid-size fallback; `CenterContent` covers absent, icon, numeric and short-text centers. Both use `false` plus concrete reasons: a disabled controller, not a boolean prop/default. The central metadata integration requires no rendering adapter, API narrowing or story changes.

```ts
/**
 * Decorative, non-interactive content with meaning represented accessibly elsewhere.
 * No center content when omitted.
 * @control false
 * @controlReason Non-serializable ReactNode; use the CenterContent story for examples.
 */
center?: ReactNode;

/**
 * Preset or numeric CSS-pixel diameter.
 * @control false
 * @controlReason Mixed preset and numeric diameter union; no single control represents both. Use the Sizes story.
 * @default md
 */
size?: GaugeSize | number;
```

Use `@default` only for actual constant defaults. For this installed extraction pipeline, bare string tag values such as `@default md` avoid adding quote characters to the value; verify the final Docs summary, not just normalized parser output. Describe computed fallback rules and optional absence in the ordinary English description body, without `@default` or a separate tag that extraction may drop. For example, Gauge `valueText` derives normalized decimal text for finite values, while omitted `center` produces no center content; neither is a fabricated fixed default. Required props need required story args and descriptions, not invented defaults. Non-normal Gauge `stateText` must retain its required non-empty description and its own `@control text`, even though the normal branch makes the prop optional.

The directive-name correction from `string` to `text` changes no defaults: preserve constant-only bare `@default` values and derived/absence descriptions without injecting optional args.

The Docs Default column documents actual constants; Controls reflect supplied args. An optional control may show `Choose option` or `Set string` while the component uses its runtime default. These placeholders do not mean the API is broken. Never inject optional default args just to fill the UI.

The registered enhancer turns validated `select` into `argTypes.control: { type: 'select' }`, and justified `false` into `argTypes.control: false`. Disabled controls keep names, descriptions, requiredness, types and documented defaults visible; the enhancer never sets `table.disable`. It preserves explicit control overrides and leaves unknown/inherited/native/untagged rows alone without creating props.

Repeated identical newline directives (for example, both Gauge union branches) normalize to one. Unknown, conflicting or incompatible directives and missing false-control reasons leave the affected row unchanged and return clear `Component.prop` diagnostics from `mapJSDocControls`. Owned-component tests must fail on diagnostics; the rendering enhancer neither crashes nor logs in a loop. A bad comment cannot override the extracted API type or fabricate defaults/args. Derived fallback and absence rules remain description text, not fixed default metadata or executable args.

This metadata-only central integration is explicitly user-approved; it does not authorize per-component manual `argTypes`, renderer/JSX adapters, new dependencies or broader configuration changes. Verify the installed extraction/enhancer/inference path and browser widgets separately; declarations and tags alone are insufficient.

## Official Storybook Controls catalog

Use this catalog to assess whether a control represents the **full approved public type**, not to require every upstream feature in this repository. These are the **14 documented upstream control types**, not a claim about Storybook's complete internal runtime enum. Sources: the Storybook 10.6 documentation family, matching installed `storybook` and `@storybook/react-vite` 10.6.1; [ArgTypes control API](https://storybook.js.org/docs/api/arg-types#control), [Controls](https://storybook.js.org/docs/essentials/controls) and [TypeScript integration](https://storybook.js.org/docs/configure/integration/typescript).

The catalog describes upstream `argTypes` capabilities, not 14 supported local directives. String props use local `@control text`, matching the official widget name while retaining the extracted semantic type `string`. Only the five directives documented above are implemented by the approved central enhancer; it does not parse arbitrary tags/JSON, ranges, bounds, mappings or aliases. Manual component/story `argTypes` remain prohibited without a justified plan-approved exception. The catalog grants no additional permission for adapters, dependencies, preview changes or API restrictions.

| Documented control type | Suitable value and selection model | Relevant configuration or limitation |
| --- | --- | --- |
| `boolean` | Boolean flag | Toggle between true and false. |
| `number` | Numeric value | Numeric input; use only API-justified bounds and steps. |
| `range` | Numeric value within an approved interval | Slider with API-justified bounds and step; not a substitute for unrestricted numeric input. |
| `object` | Serializable objects or arrays | JSON editor; not an editor for arbitrary `ReactNode`, JSX or functions. |
| `file` | Array of URL strings from selected files | `control.accept` filters file types; the result is not a `File` or `ReactNode`. |
| `radio` | One value from explicit choices | Single-choice radio group. |
| `inline-radio` | One value from explicit choices | Single-choice inline radio group. |
| `check` | Collection of selected values | Multiple-choice checkboxes; requires a collection-valued public API. |
| `inline-check` | Collection of selected values | Multiple-choice inline checkboxes; requires a collection-valued public API. |
| `select` | One value from explicit choices | Single-choice dropdown. |
| `multi-select` | Collection of selected values | Multiple-choice dropdown; requires a collection-valued public API. |
| `text` | String | Free-form text input. |
| `color` | CSS color string | Color picker; valid CSS values do not authorize manual colors or token/appearance-policy exceptions. |
| `date` | Date selection | Produces a UNIX timestamp on change, not a `Date` instance; any conversion requires separately approved story design. |

A scalar literal union supports single choice (`select`, `radio`, `inline-radio`), not multiple choice (`check`, `inline-check`, `multi-select`). Do not change a scalar API into a collection just to use another widget. Do not choose `object` simply because a value is typed as `ReactNode` or to conceal an unrepresentable union.

### Configuration fields and guardrails

These are upstream configuration fields, **not native JSDoc tags**; do not invent native `@min`, `@max`, `@step`, `@options` or `@mapping` support.

| Field | Upstream capability and repository guardrail |
| --- | --- |
| `control.min`, `control.max`, `control.step` | Numeric bounds/increment for `number` and `range`. Derive them only from the approved API; do not impose an arbitrary Gauge range. Gauge `value` accepts fractions, out-of-range values for clamping, and non-finite inputs; retain edge-case stories rather than filtering those inputs away. |
| `options` | ArgType-level list of choices, not a field nested under `control`. Match the approved public values and single/collection selection model. |
| `control.labels` | Partial option-to-display-label map for choice controls; unmapped options retain their original labels. Labels do not redefine the public values. |
| `mapping` | ArgType-level mapping from primitive option keys to complex values. This upstream capability is not permission to introduce a local renderer adapter or treat arbitrary complex values as serializable Controls args. |
| `control.accept` | File-input filter for MIME types or extensions (for example, `.png`); does not change the file control's array-of-URLs result. |
| `control.presetColors` | Per-control suggested color presets. `parameters.controls.presetColors` supplies shared presets; neither bypasses token-backed appearance policy. |

If separately approved story design needs filtering or presentation, upstream `parameters.controls` supports `include`/`exclude` (`string[]` or `RegExp`), `sort` (`none`, `alpha`, `requiredFirst`) and `expanded` (boolean). ArgType-level `if` can conditionally show a control based on an arg or global. These features do not authorize hiding extraction bugs, required API documentation or unsupported behavior. Distinguish disabling a control (`control: false`, implemented by the registered local `false` directive) from hiding its row (`table.disable: true`, not emitted by the enhancer).

Controls matchers infer **color and date** from arg names; they do not parse local tags. The approved central enhancer is the sole local tag integration, not permission to force the upstream catalog into existing stories. Verify extracted metadata, registered pipeline behavior and actual browser widgets separately; report unrun checks as pending.

## Estructura recomendada

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gauge } from './Gauge';

/**
 * ## Description
 * A passive circular meter for a magnitude normalized to 0–100, not task progress.
 *
 * ## Usage guidelines
 * Consumers choose conditions independently of value and provide stateText outside normal.
 * Centers must be decorative and non-interactive; meaning belongs in label or valueText.
 * className supports outer margin/alignment only, not internal appearance overrides.
 */
const meta: Meta<typeof Gauge> = {
  title: 'Atoms/Gauge',
  component: Gauge,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Gauge>;

/** Uses only required inputs, preserving every component default. */
export const Default: Story = {
  args: { label: 'Capacity', value: 42 },
};
```

## Lista de revisión

- ¿Usa autodocs en lugar de `argTypes` personalizados?
- When the approved API exposes events, are they connected through `action(...)` from `storybook/actions`? Gauge has no event/action story.
- ¿Importa los tipos desde `@storybook/react-vite`?
- Does the story preserve public markers and demonstrate the real component, without local appearance overrides hiding violations?
- ¿Los espaciados existen en el tema EGDEV, sin valores arbitrarios ni apariencia inline?
- ¿El JSDoc del componente está inmediatamente antes de `const meta`?
- ¿Incluye el encabezado obligatorio `## Description`?
- ¿Incluye `## Dependencies` y `## Usage guidelines` solo cuando corresponde?
- ¿Cada JSDoc explica el escenario y su importancia, en vez de repetir el nombre o decir solo «Muestra el componente»?
- ¿Todas las stories aportan cobertura distinta de los controles, argumentos y otras stories, sin presuponer selector de tema?
- ¿Evita stories genéricas `DarkMode` salvo casos locales, portales o regresiones documentadas?
- ¿Evita tarjetas, paneles y notas de documentación dentro del lienzo?
- ¿Evita `description.component` en `meta.parameters.docs`?
- ¿Los ejemplos respetan la API canónica y la documentación pública en inglés?
- ¿Cada story demuestra claramente un eje?
- Do public props in `types.ts` use `@default` only for actual constants matching hook/component/CVA behavior, with computed fallback and absence rules in ordinary English descriptions?

### Control verification checklist

- Inspect each own `PropertySignature` in the public types and every union branch; require one explicit, type-appropriate `@control` per declaration, not a matching tag elsewhere in the file.
- For each `@control false`, require a non-empty English `@controlReason` identifying the concrete type limitation and dedicated story examples. Confirm those stories actually cover the documented alternatives.
- Preserve required non-empty descriptions and actual constant defaults; required declarations must not gain dummy defaults. Computed/absent defaults belong in ordinary descriptions, without fixed-value tags. An optional branch must not hide a missing annotation on a required branch.
- Check exact final `table.defaultValue.summary` values through real source parsing and story composition: string defaults have no extra quote characters, while mixed types may legitimately render bare values. Computed/absent defaults have no fixed default metadata and retain their fallback descriptions. Check the Docs Default column separately from Controls args; never fill unset optional controls by injecting default args.
- Run focused AST coverage and real `react-docgen-typescript` regressions for requiredness, defaults, enums, allowed native props and separate tag maps with clean descriptions in `packages/ui/src/lib/storybook-docgen.test.ts`. The active owned metadata is Gauge only (eight unique prop rows); this is not a general suite-count requirement. In `packages/ui/src/lib/storybook-controls.test.ts`, retain generic directive/type/boolean/enum/invalid/override/native fixtures alongside Gauge's installed public `composeStory` extraction, registered preview enhancement and native inference checks from `@storybook/react-vite`. Synthetic fixtures are not additional implemented APIs. Parser output is attached at the Vite docgen boundary; this is not a Vite transform or browser test. Explicit main parser flags keep direct-parser behavior aligned with already-enabled Vite tag maps and string defaults. Retiring other components does not authorize dropping generic helper coverage.
- Inspect Controls in the browser separately: record actual choices, input behavior and widgets, without asserting a combobox or disabled widget from a tag. Report unrun browser checks as pending, not passed.

## Notas

- Check actual extraction, the registered central enhancer and final native inference, then inspect Controls in the browser. Without the integration, native inference may choose radios for small enums despite a local `select` tag, or Set object for `false`-tagged complex props. Do not mask discrepancies with manual component/story `argTypes`.
- MCP favors statically resolvable examples: a local helper may leave an unresolved symbol in a snippet. The required-input-only Gauge example above avoids extra helper dependencies; this does not prohibit helpers generally. Inspect the manifest and complete snippet, not merely story existence.
- `.storybook/main.ts` habilita MCP solo docs (`dev: false`, `test: false`). El smoke de `scripts/storybook-mcp.test.mjs` comprueba HTML del iframe, no render visual ni widgets: la comprobación en navegador sigue siendo necesaria.
- Si cambia el helper oficial de acciones o la política de autodocs, actualiza PRIMERO esta referencia y después los skills afectados.
