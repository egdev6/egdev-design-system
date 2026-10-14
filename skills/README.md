# Skills

Flujos para agentes, adaptados de las skills de [Stack & Flow](https://github.com/Stack-and-Flow/design-system/tree/main/skills) (MIT).

| Skill | Para qué | Origen en Stack & Flow |
|---|---|---|
| `_shared/component-contract.md` | Contrato de componente | `_shared/component-contract.md` |
| `component-cataloging` | Reutilizar, variante, componer, extraer o nuevo; nivel y paquete | `component-spec-cataloging-validator` |
| `component-spec-proposer` | Proponer y aprobar la ficha individual antes del plan de implementación | Flujo propio de EGDEV |
| `_shared/component-spec-template.md` | Plantilla de ficha individual verificable | Plantilla propia de EGDEV |
| `component-contributor` | Portar un componente de Claude Design a `@egdev/ui` | `component-contributor` |
| `components-auditor` | Revisar un componente | `components-auditor` |

No se han traído las que dependen del flujo de GitHub Projects de Stack & Flow (`component-child-issues`, `github-project-tasks`, `pr-reviewer`, `release-changeset`, `worktree-location`) ni `visual-review`, que está escrita sobre los tokens de Stack & Flow. Se pueden adaptar cuando haga falta.

## Flujo de componentes

1. `component-cataloging`: comprueba alternativas y propone la decisión de reutilización, nivel y paquete.
2. `component-spec-proposer`: tras aprobar esa decisión, propone la ficha individual con la [plantilla compartida](_shared/component-spec-template.md) y espera aprobación de sus promesas.
3. `component-contributor`: con decisión y ficha aprobadas, propone el plan; solo lo implementa tras una aprobación independiente.
4. `components-auditor`: comprueba lo implementado contra el contrato general y la ficha aprobada, sin corregir automáticamente.

Si reutilizar basta sin cambiar promesas, no hace falta una ficha nueva ni implementar. Las fichas Foundation existentes son evidencia de diseño, no prueba de disponibilidad React ni aprobación del contrato individual.
