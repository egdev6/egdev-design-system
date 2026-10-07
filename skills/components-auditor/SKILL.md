---
name: components-auditor
description: "Revisa un componente de @egdev/ui contra el contrato, Radix, Storybook, tests, tokens y accesibilidad. Trigger: auditar componente, revisar componente, ¿está bien este componente?"
license: MIT
metadata:
  author: egdev
  version: "0.1"
  basedOn: "stack-and-flow/components-auditor"
---

## Cuándo usarla

Después de implementar o portar un componente, o al revisar uno existente. Solo revisa; no cambia código salvo que se pida.

## Lecturas obligatorias

1. `skills/_shared/component-contract.md`
2. `skills/component-contributor/references/radix-patterns.md` si usa Radix.
3. `skills/component-contributor/references/stories.md` y `testing.md`.
4. `docs/CATALOGO.md` — nivel, destino y base Radix previstos.
5. `packages/tokens/src/tokens.css` antes de dar por malo un valor.

## Fases

1. **Alcance:** carpeta, nivel, archivos y fila del catálogo.
2. **Contrato:** 7 archivos; responsabilidades de cada uno; `type`; JSDoc y `@default` alineados con el hook y `defaultVariants`; exportaciones.
3. **Catálogo:** ¿el nivel cumple su contrato? ¿Algún descalificador de átomo? ¿Hay variantes que cambian la semántica? ¿Repite algo que ya existe?
4. **Radix:** primitiva correcta, `Portal`, `asChild`, nada reimplementado, estados por `data-state`.
5. **Estilos:** solo tokens; BEM `eg-*`; estados por atributo; foco con `--shadow-focus`; deshabilitado; `prefers-reduced-motion`; reglas movidas fuera de `legacy/bundle.css` sin duplicar.
6. **Stories y tests:** según las referencias.
7. **Accesibilidad:** nombre accesible, teclado, contraste, color nunca solo, tamaño táctil.

## Severidad

| Nivel | Significado |
|---|---|
| CRÍTICO | Fallo de accesibilidad, TypeScript inseguro, foco o deshabilitado roto, API pública rota |
| MAYOR | Violación del contrato que bloquea: responsabilidades mal repartidas, CVA fuera de sitio, valores fuera de tokens, Radix reimplementado, nivel equivocado |
| MENOR | Documentación, stories o tests incompletos sin romper nada |
| SUGERENCIA | Mejora opcional |

Veredicto: **PASA** (sin críticos ni mayores), **PASA CON AVISOS** (mayores aceptados), **NO PASA**.

## Informe

```md
## Auditoría — {Componente}

**Veredicto:** PASA / PASA CON AVISOS / NO PASA
**Alcance:** {archivos}

| Área | Estado | Notas |
|---|---|---|
| Contrato | ✅ / ⚠️ / ❌ | |
| Catálogo y nivel | ✅ / ⚠️ / ❌ | |
| Radix | ✅ / ⚠️ / ❌ | |
| Estilos y tokens | ✅ / ⚠️ / ❌ | |
| Stories | ✅ / ⚠️ / ❌ | |
| Tests | ✅ / ⚠️ / ❌ | |
| Accesibilidad | ✅ / ⚠️ / ❌ | |

### Hallazgos
- [SEVERIDAD] `archivo:línea` — Problema … Esperado … Encontrado … Regla …

### Comprobaciones
- `pnpm typecheck`: pasa / falla / no ejecutado
- `pnpm test`: …
```
