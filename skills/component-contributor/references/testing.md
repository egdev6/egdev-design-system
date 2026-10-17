> Adapted from Stack & Flow (`skills/component-contributor/references/testing.md`, MIT), under EGDEV's token-backed Tailwind/CVA [shared contract](../../_shared/component-contract.md). Policy is not evidence of completed migration.

# Referencia: tests de componentes

Vitest 4 + Testing Library React + user-event. Current component reference: `packages/ui/src/atoms/gauge/Gauge.test.tsx`, under the [effective v0.9 base-plus-amendment contract and separate plan approval](../../_shared/component-contract.md#current-gauge-contract). Gauge is the only public React component; `packages/ui/src/lib/cn.test.ts` tests a utility, not another component. Surface, IconButton and Tabs remain future/provisional Foundation concepts, not current fixtures or importable APIs.

## Organización y entorno

- Exactly seven meaningful files remain mandatory: ComponentName.test.tsx covers the real hook (`renderHook`) and component (`render`, `screen`, `userEvent`); no fake hooks/empty files. Missing meaningful compliant CSS role blocks spec/plan approval for human resolution.
- `vitest.config.ts` incluye `packages/*/src/**/*.test.{ts,tsx}`, usa `jsdom`, `css: false` y `vitest.setup.ts` carga `@testing-library/jest-dom/vitest`.
- `packages/ui/src/lib/storybook-docgen.test.ts` es una prueba separada de metadatos reales con `// @vitest-environment node`: evita conflictos de `TextEncoder` al cargar herramientas Vite/docgen en jsdom. No cambies el entorno global ni el de las pruebas DOM.
- Código, nombres de tests y toda documentación nueva o actualizada en inglés, incluidos JSDoc y textos de stories. No traduzcas contenido heredado fuera del alcance aprobado.

## Cobertura observable

| Contrato | Evidencia cuando aplique |
|---|---|
| Hook | Defaults, estado controlado/no controlado y resultados públicos; no cada detalle interno |
| DOM y accesibilidad | Roles, nombres accesibles, relaciones ARIA y atributos nativos |
| Interacción | Clic, teclado, foco, callbacks y ausencia de interacción al deshabilitar |
| Composición | `asChild`, paso de atributos y restricciones públicas reales |
| Refs y SSR | Ref conectada al DOM en cliente si la API la acepta; render servidor por separado |
| Styling API | Stable public root (`eg-gauge`) and spec-defined per-part cn/clsx/twMerge merge invariants/limits; className supports outer margin/alignment only, not internal appearance; no full class snapshots |

No pruebes cadenas completas de clases, snapshots de apariencia ni internos de animaciones. `cn.test.ts` sí comprueba el contrato de combinación/conflictos de la utilidad: no demuestra apariencia CSS.

Si la API pública acepta refs, comprueba que llegan al elemento DOM esperado en cada versión de React soportada, tanto en uso nativo como en la composición autorizada. Ni la firma del componente ni usar `forwardRef` acreditan por sí solos ese comportamiento. SSR no conecta refs y no sustituye la prueba cliente. El peer `>=18` tampoco demuestra compatibilidad universal: registra resultados por versión.

## Dobles solo si hacen falta

Mockea únicamente módulos realmente importados y necesarios para aislar el caso; `vi.mock` se eleva en Vitest. No añadas mocks de iconos, CSS ni paquetes ausentes por plantilla. No se prescribe `spinners-react` ni se autoriza añadir dependencias. Nunca mockees teclado, foco o ARIA de Radix para hacer pasar una prueba.

## Minimal example with the real API

For `packages/ui/src/atoms/gauge/Gauge.test.tsx` (the hook import is internal to its colocated tests, not a package-root export):

```tsx
import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Gauge } from './Gauge';
import { useGauge } from './useGauge';

const base = { label: 'Capacity', value: 42.5 };

describe('Gauge public contract', () => {
  it('derives passive defaults without center content', () => {
    const { result } = renderHook(() => useGauge(base));
    expect(result.current.rootProps['data-state']).toBe('normal');
    expect(result.current.rootProps['aria-valuetext']).toBe('42.5 / 100');
    expect(result.current.showCenter).toBe(false);
  });

  it('owns a native decorative well without Surface identity', () => {
    render(<Gauge {...base} />);
    const meter = screen.getByRole('meter', { name: 'Capacity' });
    expect(meter).toHaveClass('eg-gauge');
    expect(meter).toHaveAttribute('aria-valuenow', '42.5');
    const well = meter.querySelector('.eg-gauge-well');
    expect(well?.tagName).toBe('DIV');
    expect(well).toHaveAttribute('aria-hidden', 'true');
    expect(well).toHaveClass('box-border', 'p-0', 'border-0', 'border-solid');
    expect(meter.querySelector('[class*="eg-surface"]')).toBeNull();
  });

  it('shows readable unavailable content and recovers without stale semantics', () => {
    const { rerender } = render(<Gauge {...base} />);
    rerender(<Gauge {...base} value={NaN} unavailableText='Sensor offline' />);
    expect(screen.queryByRole('meter')).not.toBeInTheDocument();
    expect(screen.getByText('Capacity')).toBeVisible();
    expect(screen.getByText('Sensor offline')).toBeVisible();
    rerender(<Gauge {...base} value={100} />);
    expect(screen.getByRole('meter', { name: 'Capacity' })).toHaveAttribute('aria-valuenow', '100');
    expect(screen.queryByText('Sensor offline')).not.toBeInTheDocument();
  });
});
```

The internal well query checks a bounded composition invariant, not a new public part-selector API or full class snapshot. Its existing Material appearance belongs to static CVA utilities in `types.ts`: border-box, padding 0, solid **0px border** (not Surface's conceptual base 1px), full token radius, surface-0/no image, two-inset well shadow and foreground. `gauge.css` remains geometry-only, including +0.5px smoothing. DOM classes alone do not prove computed or pixel parity; no hidden React Surface helper, flat well or global recipe permission follows from these assertions.

Complete applicable Gauge cases: clamped endpoints/decimals, consumer-selected states with visible non-color cues, merged unique descriptions, decorative centers, finite-positive fractional sizes/invalid fallback, native semantic protection and passive focus/pointer behavior. Gauge has no ref, `asChild`, disabled or action/event API; use `userEvent` where it tests passivity, not to invent interaction. Future button/tab contracts must test their actual native/Radix behavior only after approval and implementation; they are not live Gauge examples. Consumer type negatives may use `@ts-expect-error` with a concrete reason (for example, a missing required label), never indiscriminate casts or general suppressions.

## Comandos y límites de la evidencia

Run the affected unit first, for example `pnpm exec vitest run packages/ui/src/atoms/gauge/Gauge.test.tsx`; then only the authorized gates. These are validation instructions, not commands executed or results claimed by this documentation update.

| Comando del root | Qué comprueba / requisito |
|---|---|
| `pnpm test` / `pnpm test:coverage` | Suites Vitest / cobertura v8; no validación visual |
| `pnpm typecheck` / `pnpm lint` | Tipos / Biome; no prueba de consumo externo |
| `pnpm build` → `pnpm test:package-exports` | Build previo; archivos exportados y grafo `.d.ts`, no funcionalidad ni CSS consumido |
| `pnpm test:package-consumption` | Build previo; paquetes externos empaquetados, TS estricto/negativos, CSS Vite, SSR, cliente/refs y deduplicación por major; instala fixtures aisladas, requiere autorización |
| `pnpm test:storybook-mcp` | Servidor local docs-only existente; APIs/documentación e iframe HTML, no render visual de navegador |

External consumption and runtime gates require the responsible owner's observed results; reading scripts does not verify React 18/19. Both supported majors need actual client and SSR consumer evidence, with ref checks only when the API exposes refs (Gauge does not). The packed matrix remains Blocked by the recorded offline-cache gaps until cache availability and separately authorized execution; no retry, install or online fallback is authorized by this guide. Storybook documents without `play` or an imposed test addon. Docgen metadata and MCP HTML smoke do not prove Controls widgets, focus or appearance: inspect the real UI separately without enabling test MCP tools or creating a server through this guide. Verify public exports in `packages/ui/src/index.ts` and `packages/ui/package.json`, not original-project paths. Generic native harnesses or parser fixtures are synthetic infrastructure, not additional system components or Gauge API promises.

Require actual CSS build evidence that static utility/CVA classes are scanned and emitted, plus package-consumer rendering/styles without a Tailwind compiler (including theme/spacing). DOM tests with `css: false`, exports and docgen alone cannot prove this. Record planned tests/stories separately from observed results; do not promise automated axe coverage without available, authorized tooling.

## Revisión

- [ ] Casos aplicables de hook, DOM, accesibilidad, interacción y refs cubiertos sin mocks de Radix.
- [ ] Tipos negativos justificados y marcadores públicos distinguidos de apariencia.
- [ ] Gates ejecutados con resultado observado; pendientes y comprobación visual separados.
