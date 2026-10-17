# Responsabilidades y límites de componentes — M3

**Borrador de análisis con decisiones parciales de producto registradas.** La clasificación Atomic, las specs y los planes siguen sin aprobar. Complementa el [inventario provisional](m3-component-inventory.md) antes de clasificar en Atomic, definir specs o abrir issues. El alcance son ocho familias ambiguas priorizadas, no una auditoría completa de los 108 registros.

- **Baseline React:** `6ea2841485b079a1d4a8e7b87a015afe4b872771`.
- **Evidencia documental:** fichas de la colección local autorizada y, para Cover, solo preview. Se identifican por nombre de componente y documento relativo, sin publicar rutas privadas, nombres de proyectos ni direcciones externas.
- **Autoridad para decidir:** [CATALOGACION.md](../CATALOGACION.md). Se evalúa reutilizar → variante → componer → extraer → nuevo; similitud visual no implica misma responsabilidad.
- **Límites:** sin niveles Atomic finales, cambios de catálogo generado, código, tokens, dependencias, nuevas capturas, issues ni aprobación de diseño.
- **Revisión humana:** las recomendaciones son condicionadas; cada bloqueo indica qué falta para decidir. Aprobar los límites tampoco aprueba una spec ni un plan de implementación.

## Decisiones de producto confirmadas

Aprobaciones explícitas en conversación, limitadas a estos puntos:

- **Gauge:** valores normalizados **0–100** controlan magnitudes cuyo significado define el consumidor. Se aprueba la división entre **indicador individual (átomo)** y **conjunto de anillos con valores independientes (molécula)**; el conjunto reutiliza la pieza individual y las acciones quedan aparte. No se fija aún nombre de props/componentes, límite de anillos, valores fuera de rango ni semántica ARIA.
- **Selección:** tiles y chips deben admitir **selección exclusiva y múltiple**. Quedan pendientes obligatoriedad, deselección, formulario y contrato de grupo.
- **Cover:** permanece como **composición específica**, no componente genérico público por ahora. Se conserva como referencia; solo se evaluará extracción si varios usos comparten estructura.

Estas respuestas no aprueban las demás recomendaciones, una implementación ni la publicación de issues.

## Resumen de propuestas

| ID | Familia | Responsabilidades que no deben confundirse | Dirección; aprobaciones parciales indicadas arriba |
| --- | --- | --- | --- |
| LIM-01 | Field y controles | Capturar un valor / relacionar etiqueta, ayuda y error | Controles con contratos propios; Field compone y coordina mensajes |
| LIM-02 | Menu, NavList y UserMenu | Ejecutar acciones / navegar / presentar opciones de cuenta | Separar acciones de navegación; evaluar UserMenu como composición o ejemplo |
| LIM-03 | Tag, StatusBadge, Badge y Chip | Categorizar / comunicar estado / activar filtro o selección | Mantener contratos semánticos diferenciados; no fusionar automáticamente en Badge |
| LIM-04 | Title, Eyebrow, Text y Heading | Texto descriptivo / encabezado de sección | Diferenciar Text y Heading; evaluar Eyebrow como tratamiento de texto |
| LIM-05 | Gauge, GaugeDock, ProgressBar y MeterRow | Mostrar límites / avance / coordinar acciones | Separar visualización de acciones; no asumir semántica progressbar para límites |
| LIM-06 | Timeline y chat | Mostrar cronología / presentar mensajes y actualizaciones en vivo | No tratar chat automáticamente como una variante visual |
| LIM-07 | RadioGroup, ChipGroup y SelectTile | Elegir una opción / varios filtros / presentar una opción visual | Separar interacción de selección y presentación; fijar cardinalidad antes de API |
| LIM-08 | Cover, PhotoFrame, PreviewFrame y AspectRatio | Portada editorial / figura con pie / marco de vista previa / proporción | Cover como composición específica confirmado; límites de los marcos aún propuestos |

## Qué puede reutilizarse hoy

La implementación pública está en [index.ts](../../packages/ui/src/index.ts); los candidatos restantes no aparecen como componentes React públicos.

| Componente existente | API y JSX inspeccionados | Qué aporta y qué no resuelve |
| --- | --- | --- |
| Surface | [types.ts](../../packages/ui/src/primitives/surface/types.ts), [Surface.tsx](../../packages/ui/src/primitives/surface/Surface.tsx) | Material, padding, radio y `asChild`; no aporta control de formulario, selección ni navegación |
| IconButton | [types.ts](../../packages/ui/src/atoms/icon-button/types.ts), [IconButton.tsx](../../packages/ui/src/atoms/icon-button/IconButton.tsx) | Botón de icono con nombre accesible, variantes y `pressed`; no coordina grupos |
| Tabs | [types.ts](../../packages/ui/src/molecules/tabs/types.ts), [Tabs.tsx](../../packages/ui/src/molecules/tabs/Tabs.tsx) | Selección de pestañas y paneles opcionales; no demuestra que cubra cualquier filtro o selección de formulario |

Tabs se documenta también como selector sin panel, pero su JSX usa Radix Tabs en ambos casos. Esa frontera requiere revisión semántica: no se declara aquí un defecto ni se cambia la implementación. No hay motivo para duplicar su responsabilidad de pestañas dentro de ChipGroup o RadioGroup.

## LIM-01 — Field y controles

**Evidencia:** `Field/README.md` reúne etiqueta, control, ayuda, error y contador; documenta input, select, textarea, checkbox, switch y range, además de tratamientos de código/prosa y búsqueda. Registros INV-015…INV-020 e INV-039.

**Propuesta:** extraer contratos independientes para Input, Textarea, Select, Checkbox, Switch y Slider. Field coordinaría la relación accesible entre un control y sus mensajes, no implementaría todos los controles mediante un selector de tipo. Label y las ayudas se evalúan antes de convertir cada parte en otro componente público.

- **Reutilizar:** Surface puede aportar materia, pero ninguno de los tres componentes React actuales captura estos valores.
- **Variante:** código/prosa pueden ser tratamientos de Textarea si conservan responsabilidad; select, switch y range no son variantes visuales de Input.
- **Componer/extraer:** la ficha reúne controles y mensajes separables; la composición no está implementada en React.
- **Bloqueos:** destino de `id`/ref, asociación de label/ayuda/error, validación del consumidor y aplicación de Field a checkbox/switch/grupos.
- **Pregunta:** ¿Field envuelve un único control con mensajes y dejamos los grupos de controles para una unidad distinta?
- **Dependencia conceptual:** contratos del control y sus relaciones accesibles antes de cerrar Field; esto no obliga a dependencias runtime entre todos los controles.

## LIM-02 — Acciones, navegación y cuenta

**Evidencia:** `MenuList/README.md` documenta acciones popup y `--nav` con grupos plegables, contadores y etiquetas. `UserMenu/README.md` añade un trigger con Avatar y opciones de cuenta. INV-043…INV-045.

**Propuesta:** separar Menu de acciones y NavList de navegación. Compartir iconos, etiquetas o estilos no justifica compartir teclado, estado y roles. UserMenu queda como candidato de composición; no se da por genérico sin demostrar reutilización.

- **Reutilizar:** IconButton puede participar como trigger, pero no aporta comportamiento de menú; Tabs no sustituye navegación arbitraria.
- **Variante:** el cambio acciones → navegación cambia semántica, no solo aspecto.
- **Componer/extraer:** estudiar piezas comunes; no crear una base compleja de menú solo para evitar CSS duplicado.
- **Bloqueos:** enlaces frente a acciones, grupos y rutas activas, contrato del trigger y evidencia de consumidores de UserMenu.
- **Pregunta:** ¿UserMenu queda como ejemplo/patrón de composición hasta que haya un contrato genérico realmente reutilizado?
- **Dependencias conceptuales:** Menu y trigger accesible para el ejemplo de UserMenu; NavList puede prepararse por separado si no altera esos contratos.

## LIM-03 — Etiquetas, estados y chips

**Evidencia:** `Tag/README.md` categoriza; `StatusBadge/README.md` comunica estado mediante texto e icono. `Chip/README.md` admite tema/tecnología y filtro interactivo con enlace/botón o avatar. Esto difiere de la nota histórica «Chip siempre interactivo». INV-022…INV-024.

**Propuesta:** preservar las responsabilidades de etiqueta descriptiva y estado semántico. Evaluar una base visual compartida solo si reduce duplicación sin borrar contratos; no aprobar aún la fusión en Badge. Un control de filtro/selección no es una etiqueta estática con un callback añadido.

- **Reutilizar:** los componentes React públicos no cubren estas responsabilidades.
- **Variante:** tono o icono pueden variar apariencia; introducir selección cambia interacción y responsabilidad.
- **Componer/extraer:** un preset consumidor no merece automáticamente componente genérico ni issue independiente.
- **Bloqueos:** usos reales estáticos/interactivos de Chip, navegación frente a selección y diferencias que requieren contratos propios.
- **Pregunta:** ¿conservamos por ahora Tag y StatusBadge diferenciados y delimitamos Chip para interacción, revisando los usos estáticos como etiquetas?
- **Dependencia conceptual:** semántica de las piezas antes de ChipGroup; no imponer dependencia de Chip con StatusBadge.

## LIM-04 — Texto y encabezados

**Evidencia:** `Title/README.md` documenta display, acento, inverse y nivel de heading configurable. `Eyebrow/README.md` describe texto breve no-heading. INV-005.

**Propuesta:** distinguir Heading, que preserva semántica de encabezado, de Text, que presenta texto. Evaluar Eyebrow como tratamiento de Text, sin convertirlo en un heading por su escala o posición. Compartir recetas tipográficas no exige una API única que mezcle roles.

- **Reutilizar:** ningún componente React público aporta estos contratos.
- **Variante:** display/inverse son ejes posibles si no alteran semántica; nivel `h1`…`h6` no se deduce del tamaño.
- **Componer/extraer:** separar contratos aunque compartan recetas; no fijar aún carpeta, exports ni número de issues.
- **Bloqueos:** elementos permitidos, destino real de `asChild`/ref y diferencias de apariencia frente a semántica.
- **Pregunta:** ¿dos contratos Text y Heading, con Eyebrow como tratamiento de texto, conservando marcadores heredados mediante migración explícita?
- **Dependencia conceptual:** recetas comunes acordadas antes de composiciones de cabeceras; sin modificar tokens.

## LIM-05 — Límites, progreso y acciones

**Evidencia:** `Gauge/README.md` describe 1–3 límites anidados, etiqueta, estado y tira de acciones. `ProgressBar/README.md` presenta avance de un valor. MeterRow y GaugeDock son propuestas del catálogo. INV-031, INV-032, INV-056 e INV-086.

**División aprobada:** indicador individual como átomo y composición multianillo como molécula, con valores independientes 0–100; el conjunto reutiliza la pieza individual. Las acciones permanecen aparte. **Propuestas restantes:** mantenerlo diferenciado de ProgressBar; evaluar GaugeDock con navegación de toolbar solo si se confirma ese requisito y MeterRow como composición de etiqueta/valor/ayuda. Nombres y contratos aún pendientes, sin implementación autorizada.

- **Reutilizar:** Surface puede aportar materia a la tira; IconButton puede aportar acciones; ninguno resuelve la semántica de las métricas.
- **Variante:** anillo frente a barra solo puede compartir contrato si expresa el mismo significado; límites y progreso no son equivalentes automáticamente.
- **Componer/extraer:** desacoplar visualización y acciones permite revisarlas sin compartir lógica de interacción.
- **Bloqueos:** con valor normalizado 0–100 confirmado, quedan API multianillo, unidades/texto del consumidor, lectura del conjunto y anuncio de cambios. `progressbar`, `meter` o imagen etiquetada son alternativas a contrastar, no una elección realizada.
- **Pregunta:** ¿cómo declara el consumidor el significado y nombre accesible de la magnitud, sin asumir que todo valor es progreso de tarea?
- **Dependencia conceptual:** contrato de valores → visualización → composición de acciones; no dependencia automática de Gauge con ProgressBar.

## LIM-06 — Cronología y mensajes en vivo

**Evidencia:** `Timeline/README.md` contempla eventos y chat; para chat incluye densidad y actualización mediante `aria-live` sin robar foco. INV-053, relacionado con patrones de mensajes del inventario.

**Propuesta:** conservar cronología como responsabilidad explícita; evaluar chat aparte por modelo de entradas, actualización y accesibilidad. No convertir la densidad visual en justificación suficiente para unificar ambos.

- **Reutilizar:** no hay cronología ni feed de mensajes entre los exports React actuales.
- **Variante:** densidad puede ser variante; recepción de mensajes, anuncios y controles de lectura añaden promesas distintas.
- **Componer/extraer:** un feed genérico podría ser reutilizable si se acredita; los mensajes con dominio permanecen en el consumidor hasta justificar generalización.
- **Bloqueos:** datos, orden, agrupación, historial, anuncios, política de foco y evidencia de varios consumidores.
- **Pregunta:** ¿dejamos Timeline para eventos y el chat como patrón separado hasta definir un contrato genérico común?
- **Dependencia conceptual:** contratos de entradas antes de composición; no prometer virtualización o historial infinito sin necesidad acordada.

## LIM-07 — Selección y presentación de opciones

**Evidencia:** `SelectTile/README.md` contempla botón con `aria-pressed` y radio contextual para selección exclusiva persistente. `Chip/README.md` menciona grupos separados. No hay fichas independientes de RadioGroup/ChipGroup. INV-021, INV-041 e INV-052.

**Propuesta:** la selección exclusiva y la múltiple deben tener contratos explícitos. SelectTile representa una opción visual; no debe cambiar libremente entre acción, radio y toggle sin explicar las promesas de cada composición. ChipGroup coordinaría opciones, no paneles de pestañas.

- **Reutilizar:** IconButton ofrece estado local `pressed`, no coordinación de grupo. Tabs aporta pestañas, no garantía de semántica de formulario.
- **Variante:** proporción o densidad son apariencia; radio frente a acción no es solo variante visual.
- **Componer/extraer:** separar presentación de opción y mecanismo de selección; no cerrar todavía APIs intercambiables entre grupos.
- **Bloqueos:** los dos modos están confirmados en tiles y chips; quedan obligatoriedad, deselección, persistencia, envío de formulario y teclado/foco de cada patrón.
- **Pregunta:** ¿qué reglas de selección vacía y formulario deben tener los modos exclusivo y múltiple? No se presupone una API a partir de la forma visual.
- **Dependencia conceptual:** contrato de selección → presentación de opciones → ejemplos de grupo; añadir paquetes requiere permiso.

## LIM-08 — Portadas y marcos

**Evidencia:** `PhotoFrame/README.md` define figura editorial con foto/pie; `StageFrame/README.md` define vista previa con zonas seguras y barras. `Cover/preview.html` presenta una composición fija de 960×288 con título y motivo gráfico, sin README. AspectRatio solo está propuesto. INV-007, INV-060, INV-085 e INV-108.

**Propuesta:** mantener PhotoFrame y PreviewFrame diferenciados. Evaluar AspectRatio como base estructural solo si las restricciones comunes lo justifican. Para Cover se ha confirmado mantener la composición específica fuera del paquete genérico, sin inventar una API desde el preview.

- **Reutilizar:** Surface aporta materia, no restricción de proporción ni figura con pie.
- **Variante:** pie editorial y zonas seguras tienen responsabilidades distintas, no se fusionan por contener una imagen.
- **Componer/extraer:** extraer proporción solo si es una necesidad común; no añadir una capa por cada div del preview.
- **Bloqueos:** para los marcos, API de contenido, recorte/proporción, responsive y significado de pie. Cover no requiere ahora una spec genérica; cualquier extracción futura necesita evidencia nueva.
- **Pregunta:** ¿qué usos y estructura compartida justificarían una extracción futura de Cover? No es un bloqueo para mantenerlo como composición.
- **Dependencia conceptual:** necesidades de proporción → contrato estructural si procede → marcos; Cover queda fuera de las tandas de componentes genéricos.

## Dependencias y paralelo: propuestas condicionadas

El [manifiesto UI](../../packages/ui/package.json) declara solo los paquetes Radix de Slot, AccessibleIcon y Tabs. El resto de primitivas es una necesidad a evaluar, no dependencia instalada ni autorizada. No se reimplementa teclado/foco/ARIA para evitar pedir una dependencia.

| Paquete conceptual de trabajo | Precondición | Posible aislamiento, no autorización de ejecución |
| --- | --- | --- |
| Controles / coordinación de Field | Contratos de valores y relaciones accesibles | Controles en rutas propias; Field tras acordar contratos |
| Menu / NavList | Separación acciones y navegación aprobada | Rutas disjuntas; piezas comunes solo con dueño acordado |
| Texto / etiquetas / visualizaciones | Semántica y recetas compartidas acordadas | Candidatos independientes si no cambian archivos comunes |
| Grupos / docks / marcos | API de las piezas base y composición acordadas | Integrar tras contratos base; no depender de ramas ajenas sin baseline definida |
| Patrones de cuenta, chat y portada | Reutilización y propósito genérico demostrados | Quedan fuera de la planificación paralela genérica mientras estén bloqueados |

Antes de declarar una tanda lista: fijar imports/exports, compatibilidad y marcadores públicos; resolver tokens/dependencias; asignar rutas y propietario de archivos compartidos; definir integración y pruebas. Los worktrees no sustituyen estas decisiones. Se conserva la clase pública `eg-icon-btn`; ningún renombrado del análisis autoriza cambios incompatibles.

## Bloqueos de catalogación

- Las propuestas restantes esperan aprobación específica de sus límites, no una autorización implícita por «seguir»; los tres acuerdos parciales se enumeran al inicio.
- Field, selección, Gauge y chat necesitan cerrar sus contratos antes de una ficha completa. Cover se conserva como composición, no como candidato listo para una issue genérica.
- UserMenu y otras composiciones necesitan evidencia de reutilización antes de pertenecer al paquete genérico.
- La unificación Badge y la delimitación Chip discrepan del catálogo histórico; no se actualiza la fuente por intuición.
- La división y niveles de Gauge están aprobados; los demás niveles y límites siguen sin aprobación integral. Tampoco se han evaluado completamente los demás candidatos.

## Siguiente decisión

Revisar LIM-01…LIM-08 y cerrar sus preguntas restantes, empezando por controles/Field, etiquetas y selección. La [clasificación completa de trabajo](m3-atomic-proposal.md) asigna nivel y responsabilidad objetivo a todas las unidades, separando destino y evidencia. Las hipótesis conservan bloqueos de validación, no casillas sin nivel; la matriz no sustituye estas decisiones. Solo con decisiones individuales aprobadas se prepararán specs y referencias visuales versionadas; el plan de implementación requiere aprobación posterior.
