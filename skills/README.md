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

## Prop naming

The [canonical registry](_shared/prop-naming.json) and [generated view](../docs/prop-naming.md) support every spec, implementation and audit. Follow the [shared workflow](_shared/component-contract.md#prop-naming-registry): mandatory meaning/name/alias lookup for new or changed own props, exact convention IDs/proposals/exceptions in specs and issue handoffs, and separate convention approval. Run `pnpm props:check` and `pnpm test:props`; regenerate JSON changes with `pnpm props:docs`, never edit the view manually.

## Flujo de componentes

1. `component-cataloging`: comprueba alternativas y propone la decisión de reutilización, nivel y paquete.
2. `component-spec-proposer`: tras aprobar esa decisión, propone la ficha individual con la [plantilla compartida](_shared/component-spec-template.md) y espera aprobación de sus promesas.
3. `component-contributor`: con decisión y ficha aprobadas, propone el plan; solo lo implementa tras una aprobación independiente.
4. `components-auditor`: comprueba lo implementado contra el contrato general y la ficha aprobada, sin corregir automáticamente.

Specs include [expected-design visual references](../docs/design/README.md), stored under `docs/components/<kebab-name>/v<spec-version>/`. Record real component-zone captures, provenance, conditions, hashes and scoped approval; Playwright MCP does not approve designs or replace tests. Historical archives remain valid. Snapshot version/content SHA-256, visual hashes, approval reference and canonical issue/latest comment must be recoverable; implementation/audit compare without overwriting references.

Si reutilizar basta sin cambiar promesas, no hace falta una ficha nueva ni implementar. Las fichas Foundation existentes son evidencia de diseño, no prueba de disponibilidad React ni aprobación del contrato individual.

For an explicit create-issue or add-comment request, follow the proposer's [issue handoff](component-spec-proposer/references/issue-handoff.md): one issue per component, first spec in the body, later snapshots in separately authorized comments with history/approval scope; no silent body edits, automatic GitHub writes or inferred global convention approvals. Use the global `gentle-ai-issue-creation` and delegated-action guidance only after exact target/action/credential authorization. Skill names/triggers/paths are unchanged; no skill registry refresh is required.
