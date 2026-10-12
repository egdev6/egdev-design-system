> Adaptado de Stack & Flow (`skills/component-contributor/references/testing.md`, MIT), no copiado tal cual: EGDEV usa CSS BEM, tokens y el [contrato compartido](../../_shared/component-contract.md). M2 fija normas; no acredita la adaptación de M3.

# Referencia: tests de componentes

Vitest 4 + Testing Library React + user-event. Referencias reales bajo `packages/ui/src/`: `atoms/icon-button/IconButton.test.tsx`, `molecules/tabs/Tabs.test.tsx` y `lib/cn.test.ts`.

## Organización y entorno

- El patrón objetivo de siete archivos reserva `ComponentName.test.tsx` para hook (`renderHook`) y componente (`render` + `screen` + `userEvent`). No crees hooks ficticios ni archivos vacíos para alcanzar el número.
- `vitest.config.ts` incluye `packages/*/src/**/*.test.{ts,tsx}`, usa `jsdom`, `css: false` y `vitest.setup.ts` carga `@testing-library/jest-dom/vitest`.
- `packages/ui/src/lib/storybook-docgen.test.ts` es una prueba separada de metadatos reales con `// @vitest-environment node`: evita conflictos de `TextEncoder` al cargar herramientas Vite/docgen en jsdom. No cambies el entorno global ni el de las pruebas DOM.
- Código y nombres de tests en inglés; documentación y textos nuevos de stories en español. No traduzcas stories heredadas sin alcance aprobado.

## Cobertura observable

| Contrato | Evidencia cuando aplique |
|---|---|
| Hook | Defaults, estado controlado/no controlado y resultados públicos; no cada detalle interno |
| DOM y accesibilidad | Roles, nombres accesibles, relaciones ARIA y atributos nativos |
| Interacción | Clic, teclado, foco, callbacks y ausencia de interacción al deshabilitar |
| Composición | `asChild`, paso de atributos y restricciones públicas reales |
| Refs y SSR | Ref conectada al DOM en cliente si la API la acepta; render servidor por separado |
| API de estilos | Solo marcador raíz BEM estable (`eg-icon-btn`, no `eg-icon-button`) |

No pruebes cadenas completas de clases, snapshots de apariencia ni internos de animaciones. `cn.test.ts` sí comprueba el contrato de combinación/conflictos de la utilidad: no demuestra apariencia CSS.

Si la API pública acepta refs, comprueba que llegan al elemento DOM esperado en cada versión de React soportada, tanto en uso nativo como en la composición autorizada. Ni la firma del componente ni usar `forwardRef` acreditan por sí solos ese comportamiento. SSR no conecta refs y no sustituye la prueba cliente. El peer `>=18` tampoco demuestra compatibilidad universal: registra resultados por versión.

## Dobles solo si hacen falta

Mockea únicamente módulos realmente importados y necesarios para aislar el caso; `vi.mock` se eleva en Vitest. No añadas mocks de iconos, CSS ni paquetes ausentes por plantilla. No se prescribe `spinners-react` ni se autoriza añadir dependencias. Nunca mockees teclado, foco o ARIA de Radix para hacer pasar una prueba.

## Ejemplo mínimo con la API real

Para `packages/ui/src/atoms/icon-button/IconButton.test.tsx`:

```tsx
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';
import { useIconButton } from './useIconButton';

const icon = <svg viewBox='0 0 24 24' />;

describe('IconButton public contract', () => {
  it('defaults to a native button', () => {
    const { result } = renderHook(() => useIconButton({ label: 'Save', icon }));
    expect(result.current.type).toBe('button');
  });

  it('dispatches clicks but blocks them when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<IconButton label='Save' icon={icon} onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('eg-icon-btn');
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    onClick.mockClear();
    rerender(<IconButton label='Save' icon={icon} disabled onClick={onClick} />);
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

Completa los casos pertinentes: `pressed` conserva `aria-pressed` en un botón; no lo conviertas en `switch`. Tabs debe probar selección, paneles, flechas, elementos deshabilitados y callbacks controlados. Los casos negativos de tipos consumidores pueden usar `@ts-expect-error` con motivo concreto (p. ej., falta `label` obligatorio); no casts indiscriminados ni supresiones generales.

## Comandos y límites de la evidencia

Ejecuta primero la unidad afectada, p. ej. `pnpm test -- packages/ui/src/atoms/icon-button/IconButton.test.tsx`; después los gates autorizados. Esta guía no afirma que hayan pasado.

| Comando del root | Qué comprueba / requisito |
|---|---|
| `pnpm test` / `pnpm test:coverage` | Suites Vitest / cobertura v8; no validación visual |
| `pnpm typecheck` / `pnpm lint` | Tipos / Biome; no prueba de consumo externo |
| `pnpm build` → `pnpm test:package-exports` | Build previo; archivos exportados y grafo `.d.ts`, no funcionalidad ni CSS consumido |
| `pnpm test:package-consumption` | Build previo; paquetes externos empaquetados, TS estricto/negativos, CSS Vite, SSR, cliente/refs y deduplicación por major; instala fixtures aisladas, requiere autorización |
| `pnpm test:storybook-mcp` | Servidor local docs-only existente; APIs/documentación e iframe HTML, no render visual de navegador |

El consumo externo y los gates runtime siguen pendientes de resultados del responsable; no declares React 18/19 verificado por leer sus scripts. Storybook documenta: sin `play` ni addon de tests impuesto. Metadatos docgen y smoke MCP no prueban widgets Controls, foco ni apariencia: verifica también la UI real, sin habilitar herramientas MCP de tests ni crear servidor por esta guía. Comprueba los exports públicos en `packages/ui/src/index.ts` y `packages/ui/package.json`, no rutas del proyecto de origen.

## Revisión

- [ ] Casos aplicables de hook, DOM, accesibilidad, interacción y refs cubiertos sin mocks de Radix.
- [ ] Tipos negativos justificados y marcadores públicos distinguidos de apariencia.
- [ ] Gates ejecutados con resultado observado; pendientes y comprobación visual separados.
