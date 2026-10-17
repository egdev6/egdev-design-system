# Catalogación

Cómo decidir reutilización, variantes, composición, extracción o creación, y justificar el nivel por responsabilidad. Adaptado del rigor de catalogación de Stack & Flow, sin importar sus gates de GitHub ni restricciones de carpetas.

**Current availability:** [CATALOGO.md](CATALOGO.md) is a generated provisional map, not proof of importable implementations or final classification. Gauge is the only public React component in `@egdev/ui`; `cn` is a utility. Surface, IconButton and Tabs remain future/provisional Foundation concepts, not current reuse candidates. Gauge's accepted pilot follows the [effective v0.10 base-plus-amendments contract](../skills/_shared/component-contract.md#current-gauge-contract); it does not establish catalog-wide M3 adaptation or completed retirement gates.

## Antes de crear nada

En este orden, y se para en el primer paso que resuelva la necesidad:

1. **Mantener/reutilizar:** ¿la implementación pública existente ya lo hace? Se conserva o usa tal cual. Inspecciona props, comportamiento y exports; una regla CSS o una fila prevista no prueba disponibilidad.
2. **Variant:** can an existing component meet the need with another appearance or size without changing its responsibility? Add a variant only within its approved contract. A hypothetical future IconButton shape variation illustrates this decision, but IconButton and `shape="square"` are not available current APIs.
3. **Componer:** ¿se consigue juntando componentes existentes? Se compone en la app; si lo necesita otra app, se propone una unidad genérica en `@egdev/ui`, con nivel justificado por su responsabilidad.
4. **Extraer:** ¿hay una pieza escondida dentro de otro componente que ahora necesitan varios? Se saca a su propio componente, en el nivel más bajo posible.
5. **Nuevo:** solo si nada de lo anterior sirve. Se documentan nivel, base Radix y piezas reutilizadas antes de implementar.

Registra qué se inspeccionó y por qué cada opción anterior no basta; no saltes a «nuevo» por intuición. Si faltan anatomía, estados, accesibilidad o evidencia de implementación, para y pregunta. Un token o dependencia ausente requiere propuesta y confirmación del usuario, no su incorporación automática.

**Una variante deja de serlo** cuando introduce otra responsabilidad o patrón de interacción (un menú que pasa a ser una barra lateral). No escondas cambios semánticos en una variante visual. La composición documentada con `asChild` conserva la semántica del hijo y no exige por sí sola crear otro componente.

## Contratos por nivel

| Nivel | Contrato | Puede depender de | No debe |
|---|---|---|---|
| Primitive | Reusable structure, semantics or Material; Surface is a future concept, not an implemented example | Tokens, utilities, Radix primitives | Compose product concepts, impose copy, coordinate controls |
| Átomo | Un único concepto semántico de interfaz, con API y estado local coherentes | Primitivas de apoyo, Radix, variantes CVA | Orquestar conceptos independientes, flujos o composición contextual |
| Molécula | Conceptos coordinados que funcionan como una unidad reutilizable | Átomos, primitivas, hooks de interacción, layout local | Ser una sección de página, navegación de alto nivel, lógica de dominio extensa |
| Organismo | Región con jerarquía y responsabilidad estructural | Moléculas, átomos, primitivas, datos de ejemplo en stories | Ser una página, mezclar reglas de una sola app, esconder piezas extraíbles |
| Plantilla | Disposición de una vista, sin contenido real | Organismos | Llevar datos ni textos |

EGDEV admite primitivas en `packages/ui/src/primitives/`; no se las convierte en átomos por reglas de otro repo. Clasifica por **responsabilidad, coordinación y composición**, no por tamaño visual, cantidad de nodos o imports Radix, presencia de CSS ni número de stories.

## Señales para decidir

| Señal | Decisión |
|---|---|
| Un concepto, API pequeña, estado local simple | Átomo |
| Base reutilizable sin coordinación de controles ni dominio, incluso con tratamiento Material | Primitiva |
| Dos o más conceptos coordinados | Molécula |
| Región completa con jerarquía y composición | Organismo |
| Variantes que cambian la semántica, no el estilo | Separar antes de clasificar |
| Props que activan comportamientos que se excluyen entre sí | Componentes distintos |
| Storybook necesita muchas stories para usos que no tienen que ver | Probablemente hay que separar |
| Los tests cubren flujos independientes dentro del mismo componente | Probablemente hay que separar |
| Solo existe para el layout de una página | Fuera del sistema (patrón de la app) |
| Solo lo usa una app y lleva datos de su dominio | Patrón de esa app hasta que lo necesite otra |

## Qué impide que algo sea un átomo

Si se cumple cualquiera, es molécula u organismo, o hay que separarlo:

- Coordina conceptos pares con responsabilidades independientes, no solo partes de un control.
- Expone zonas o slots con contratos independientes.
- Gestiona una colección, menú, tabla, grupo de campos o navegación compuesta.
- Comparte estado para coordinar responsabilidades de subcomponentes.
- Sus variantes cambian el patrón de interacción completo.
- Documentación o tests describen usos o flujos sin relación.
- Mezcla responsabilidades de layout de producto, contenido e interacción en una API.

Contar primitivas de apoyo o piezas Radix no decide el nivel. Un icono decorativo no añade otro concepto; un grupo nativo con una única responsabilidad de selección no se descalifica solo por tener varios items.

*Caso previsto en el catálogo:* Field agrupa etiqueta, control, ayuda y contador, y cubre controles distintos. La propuesta es separar controles atómicos y una molécula Field que los envuelve; no significa que esa extracción exista ya.

## Plantilla de decisión

La skill [component-cataloging](../skills/component-cataloging/SKILL.md) presenta esta plantilla como **borrador** para aprobación humana antes de implementar. Si hay preguntas, entrega bloqueos, no una decisión final. No se exige un label de GitHub por adaptar esta referencia.

```md
## Borrador de decisión de catalogación

- Componente:
- Nivel: primitive | atom | molecule | organism | template
- Destino: @egdev/ui | @egdev/effects | patrón de <app>
- Ruta actual / propuesta: packages/ui/src/<nivel>/<kebab-name>/
- Base Radix: <primitiva> | ninguna (motivo)
- Decisión: reutilizar | variante | componer | extraer | nuevo
- Piezas existentes que reutiliza:
- Piezas que hay que extraer o crear antes:
- Bloqueos o preguntas: ninguno

### Evidencia
- Responsabilidad y contrato del nivel:
- Catálogo e implementación pública inspeccionados (rutas, props, exports):
- Opciones anteriores descartadas y motivo:
- Razón de reutilización, composición o extracción:
- Impacto previsto en imports, exports, API, clases públicas, stories y tests:
```

Si reutilizar basta sin cambiar promesas, entrega la recomendación sin crear una ficha nueva. Para crear o cambiar promesas, tras aprobar la decisión usa [component-spec-proposer](../skills/component-spec-proposer/SKILL.md) y la [plantilla individual](../skills/_shared/component-spec-template.md): aprueba una versión recuperable de la ficha antes de proponer el plan. Confirma específicamente tokens o dependencias pendientes y aprueba el plan por separado antes de código, según el [contrato compartido](../skills/_shared/component-contract.md). Si se autoriza actualizar el catálogo, se editan `scripts/catalog_data.py` y se genera con `scripts/build_catalog.py`; nunca se edita directamente `CATALOGO.md`. Publicar esta guía no autoriza ejecutar esa actualización ni iniciar M3.
