# Effects — scoped owner decisions

- Status: actual interactive owner choices recorded by the parent; not a native review receipt or whole-plan approval.
- Source: two-question owner questionnaire in parent Pi session `01a18891-ec9e-77b8-b92d-52b1c9e93682`.
- Identity: canonical SHA-256 `636e5a37c41e3896920f9a728349978a09cb1e5e11d5a03498f88b540602cb61`; hash UTF-8 LF bytes from the actual `## Decisions` heading through EOF, including final LF and excluding this metadata.

## Decisions

### U — utility route A selected

Question: “¿Qué estrategia autorizas para las utilidades de effects? Después reconciliaré los planes: esta elección no inicia implementación, instalaciones ni entregas Git.”

Owner selected **“A · Reutilizar cn de @egdev/ui”**, with the displayed dependency preview:

- `class-variance-authority: 0.7.1`
- `@egdev/ui: workspace:*`
- Use the public root `cn`; do not import UI CSS.
- Accept effects → UI/Radix/ReactDOM dependency and build-order coupling. No tree-shaking benefit is assumed.

This selects the exact strategy/dependency edges for plan reconciliation. Route B and its private effects `cn.ts`/`cn.test.ts` are not selected; no such modules are authorized. Existing exact required peer `three=0.160.0` and development `three=0.160.0` / `@types/three=0.160.0` permissions remain separate and unchanged.

### P — dist-only direction selected, compatibility gate retained

Question: “¿Qué dirección seguimos para publicar effects? Actualmente declara src y reference; restringirlo a dist puede romper imports existentes. No se ha completado el inventario de consumidores.”

Owner selected **“Solo dist, con revisión de compatibilidad”**, with the displayed preview:

- Publish JS, declarations, CSS and required chunks under `dist`.
- Keep historical reference files in the repository.
- Accept this proposed publication-boundary direction, but inspect consumers/migration and approve final plans before applying it.

This does not certify compatibility, waive source/reference/deep-import concerns, authorize deleting repository references, or approve an unreviewed export map. Inventory coverage and unknown consumers must be stated honestly before final execution approval.

## Remaining gates

1. Inventory actual tracked consumers and documented source/reference imports; distinguish repository evidence, published-package evidence and unknown external consumers. Do not infer absence of consumers from an empty current React barrel.
2. Reconcile AmbientBackground and Isotipo3D dependency/build/implementation proposals with selected A and conditional dist-only direction; preserve accepted component contracts, lazy three loading, lifecycle and engine exceptions.
3. Refresh affected canonical identities, review the compatibility disposition and obtain separate exact final-plan approval and fresh bounded runtime/integration assignment.
4. Existing component/visual/fixture/refactor/naming gates remain separate. AppShell remains parked on real organism prerequisites.

No runtime implementation, dependency installation, source/manifest/lockfile modification, build, publication, commit, push, PR, merge, label change or issue closure is authorized by this decision record. It records only the two actual scoped questionnaire answers; it is neither a signed/native receipt nor approval of every statement in the common integration proposal.
