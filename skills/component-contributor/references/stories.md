> Adaptado de Stack & Flow (`skills/component-contributor/references/stories.md`, MIT), no aplicado tal cual: EGDEV documenta en español, usa tokens/CSS BEM y reserva Tailwind para colocación. Sin estilos inline de apariencia ni espaciados arbitrarios; manda el [contrato compartido](../../_shared/component-contract.md).

# Referencia de stories de Storybook

Convenciones canónicas para `*.stories.tsx` en este repositorio.

## Propósito

Consulta esta referencia ANTES de escribir o revisar stories. No improvises convenciones a partir de los valores genéricos de Storybook.

## Reglas obligatorias

- Usa `autodocs`.
- **No** definas `argTypes` manuales en `meta` ni en stories individuales salvo excepción justificada y aprobada en el plan; nunca para ocultar fallos de docgen.
- Importa `action(...)` desde `storybook/actions` para los argumentos de eventos.
- Importa los tipos `Meta` y `StoryObj` desde el framework `@storybook/react-vite`.
- Nunca uses manejadores vacíos como `() => undefined` en los argumentos.
- Usa las clases semánticas del sistema (`eg-*`); Tailwind solo para el layout de ejemplo, nunca para cambiar el aspecto del componente.
- No copies utilidades fraccionarias de otros temas: usa solo espaciados disponibles en `@egdev/tokens/theme.css`; que Tailwind admita una clase no acredita un token EGDEV.
- Toda la documentación de Storybook va en español: encabezados, descripciones, comentarios, nombres visibles de stories y etiquetas de argumentos. El código y los identificadores siguen en inglés. Traducir stories heredadas requiere alcance explícito.
- La documentación del componente va en un bloque JSDoc inmediatamente antes de `const meta`; **no** en `parameters.docs.description.component`.
- El bloque JSDoc del componente usa estos encabezados:
  - `## Descripción` — obligatorio; explica qué hace y cuándo usarlo.
  - `## Dependencias` — solo cuando usa otros componentes del sistema o primitivas externas; indica cada dependencia y su motivo.
  - `## Guía de uso` — solo para usos complejos; explica composición, restricciones o comportamientos no evidentes.
- Cada story lleva un JSDoc útil inmediatamente antes de `export const StoryName`; **no** añadas tarjetas de documentación, paneles, textos auxiliares ni notas de uso al lienzo.
- Cada story debe demostrar un estado, eje de variantes, restricción de composición, comportamiento accesible o integración distinto. No dupliques lo que ya cubren los controles, argumentos u otras stories.
- `.storybook/preview.tsx` no define `globalTypes` ni selector de tema: desactiva backgrounds, usa layout `padded` y ordena niveles con `storySort`. No inventes un selector ni añadas una story genérica `DarkMode`.
- Un caso temático debe usar configuración real y demostrar ámbito local, herencia en portales o una regresión relevante; explica el motivo en JSDoc y aprueba cambios de configuración por separado.
- Los renders y decoradores son ejemplos: pueden aportar layout, pero no interfaces narrativas de documentación.
- Los argumentos de `Default`, incluidos los heredados de meta, no deben sustituir defaults del componente/hook/CVA: solo props requeridas y ejemplos.
- Los componentes interactivos incluyen `Disabled` y escenarios de interacción cuando corresponda.
- Sin funciones `play`: los tests de interacción van en `ComponentName.test.tsx`.

## Estructura recomendada

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { IconButton } from "./IconButton";

/**
 * ## Descripción
 * Botón de solo icono con nombre accesible obligatorio.
 *
 * ## Dependencias
 * Radix AccessibleIcon aporta el nombre del icono; Slot permite composición con asChild.
 */
const meta: Meta<typeof IconButton> = {
  title: "Atoms/IconButton",
  component: IconButton,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof IconButton>;

/**
 * Demuestra las variantes predeterminadas para comparar otras stories con la API base.
 */
export const Default: Story = {
  name: "Predeterminado",
  args: {
    label: "Ajustes",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>,
    onClick: action("clic"),
  },
};
```

## Lista de revisión

- ¿Usa autodocs en lugar de `argTypes` personalizados?
- ¿Conecta los eventos con `action(...)` desde `storybook/actions`?
- ¿Importa los tipos desde `@storybook/react-vite`?
- ¿Usa clases semánticas y reserva Tailwind para el layout del ejemplo?
- ¿Los espaciados existen en el tema EGDEV, sin valores arbitrarios ni apariencia inline?
- ¿El JSDoc del componente está inmediatamente antes de `const meta`?
- ¿Incluye el encabezado obligatorio `## Descripción`?
- ¿Incluye `## Dependencias` y `## Guía de uso` solo cuando corresponde?
- ¿Cada JSDoc explica el escenario y su importancia, en vez de repetir el nombre o decir solo «Muestra el componente»?
- ¿Todas las stories aportan cobertura distinta de los controles, argumentos y otras stories, sin presuponer selector de tema?
- ¿Evita stories genéricas `DarkMode` salvo casos locales, portales o regresiones documentadas?
- ¿Evita tarjetas, paneles y notas de documentación dentro del lienzo?
- ¿Evita `description.component` en `meta.parameters.docs`?
- ¿Los ejemplos respetan la API canónica y la documentación pública en español?
- ¿Cada story demuestra claramente un eje?
- ¿Las props públicas en `types.ts` documentan sus valores por defecto con `@default`, coincidiendo con el hook/componente y los `defaultVariants` de CVA?

## Notas

- Comprueba extracción real de required, literales, defaults y `asChild` y su UI en Controls. `@control select` expresa intención, no garantiza combobox: dos valores pueden ser radios. No tapes discrepancias con `argTypes`.
- MCP favorece ejemplos resolubles estáticamente: un helper local como `Gear` puede dejar un símbolo sin resolver en el snippet. El SVG intrínseco anterior evita ese caso; no prohíbe helpers en general. Inspecciona manifest y snippet completo, no solo que exista una story.
- `.storybook/main.ts` habilita MCP solo docs (`dev: false`, `test: false`). El smoke de `scripts/storybook-mcp.test.mjs` comprueba HTML del iframe, no render visual ni widgets: la comprobación en navegador sigue siendo necesaria.
- Si cambia el helper oficial de acciones o la política de autodocs, actualiza PRIMERO esta referencia y después los skills afectados.
