# Catalogación

Cómo se decide si algo es un componente nuevo, una variante o una composición, y en qué nivel va. Adaptado de la guía de catalogación de Stack & Flow.

## Antes de crear nada

En este orden, y se para en el primer paso que resuelva la necesidad:

1. **Reutilizar:** ¿un componente existente ya lo hace? Se usa tal cual.
2. **Variante:** ¿lo hace un componente existente con otro aspecto o tamaño, sin cambiar lo que es? Se añade una variante. *Ejemplo: un IconButton sin redondeo completo es `shape="square"`, no un componente nuevo.*
3. **Composición:** ¿se consigue juntando componentes existentes? Se compone donde se usa (en la app, o como molécula si se repite).
4. **Extraer:** ¿hay una pieza escondida dentro de otro componente que ahora necesitan varios? Se saca a su propio componente, en el nivel más bajo posible.
5. **Nuevo:** solo si nada de lo anterior sirve. Se documenta en el catálogo con su nivel y su primitiva de Radix.

**Una variante deja de serlo** cuando cambia la semántica o el patrón de interacción (un botón que pasa a ser un enlace de navegación, un menú que pasa a ser una barra lateral). Entonces es otro componente.

## Contratos por nivel

| Nivel | Contrato | Puede depender de | No debe |
|---|---|---|---|
| Primitiva | Unidad base sin concepto visual propio: caja, texto, apilado, slot, separador | Tokens, primitivas de Radix | Componer conceptos de producto, imponer textos, coordinar controles |
| Átomo | Un solo concepto de interfaz. Puede apoyarse en hasta dos primitivas | Primitivas, una primitiva de Radix, variantes CVA, estado local acotado | Orquestar conceptos pares, layout complejo, flujos, listas |
| Molécula | Composición pequeña de varios conceptos que funcionan como una unidad | Átomos, primitivas, hooks de interacción, layout local | Ser una sección de página, navegación de alto nivel, lógica de dominio extensa |
| Organismo | Región con jerarquía y responsabilidad estructural | Moléculas, átomos, primitivas, datos de ejemplo en stories | Ser una página, mezclar reglas de una sola app, esconder piezas extraíbles |
| Plantilla | Disposición de una vista, sin contenido real | Organismos | Llevar datos ni textos |

## Señales para decidir

| Señal | Decisión |
|---|---|
| Un concepto, API pequeña, estado local simple | Átomo |
| Envoltorio reutilizable sin concepto visual propio | Primitiva |
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

- Coordina tres o más piezas con significado propio.
- Tiene varias zonas o slots con responsabilidades independientes.
- Contiene una lista, menú, tabla, grupo de campos o navegación.
- Necesita estado compartido entre subcomponentes.
- Tiene variantes que cambian el patrón de interacción completo.
- Su documentación tiene que explicar varios usos que no tienen que ver.
- Su API mezcla layout, contenido, interacción y presentación.

*Ejemplo real:* Field se documentó como átomo, pero es etiqueta + control + ayuda + contador, y además cubría input, select, textarea, casilla, interruptor y deslizador. Se separa en átomos de control y una molécula Field que los envuelve.

## Plantilla de decisión

Se rellena antes de implementar (la skill `component-cataloging` la genera):

```md
## Decisión de catalogación

- Componente:
- Nivel: primitive | atom | molecule | organism | template
- Destino: @egdev/ui | @egdev/effects | patrón de <app>
- Ruta: packages/ui/src/<nivel>/<kebab-name>/
- Base Radix: <primitiva> | ninguna (motivo)
- Decisión: reutilizar | variante | componer | extraer | nuevo
- Piezas existentes que reutiliza:
- Piezas que hay que extraer o crear antes:
- Bloqueos o preguntas: ninguno

### Evidencia
- Contrato del nivel:
- Revisión del catálogo:
- Por qué reutilizar o extraer:
```
