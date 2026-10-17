# Clasificación completa de trabajo — M3

**Todos los registros tienen nivel de trabajo y responsabilidad objetivo.** Nivel Atomic, destino y evidencia se evalúan por separado. Esta matriz permite organizar el trabajo; no presenta hipótesis como anatomías verificadas ni aprueba specs, APIs o implementación.

- **Cobertura:** los **108 registros** del [inventario](m3-component-inventory.md) se concretan en **113 unidades de responsabilidad**, con IDs derivados cuando una fila reúne varios contratos.
- **Aprobación Atomic existente:** únicamente la división Gauge individual → átomo y multianillo → molécula está aprobada. Los otros niveles y divisiones son propuestas.
- **Otro acuerdo existente:** Cover permanece como composición específica. Su nivel de trabajo se propone aquí, sin convertirlo en componente genérico.
- **Sin cambios:** runtime, imports, exports, tokens, dependencias, catálogo generado e issues permanecen intactos.

## Tres ejes que no deben confundirse

| Eje | Qué decide | Qué no decide |
| --- | --- | --- |
| Nivel Atomic | Responsabilidad de una unidad: base, concepto, coordinación, región o disposición | En qué paquete vive, su disponibilidad o si merece una issue independiente |
| Destino | UI candidata, consumidor específico o efectos | El nivel Atomic: una composición específica también puede ser molécula/organismo/plantilla |
| Evidencia y aprobación | Qué se ha leído/comprobado y qué decisión humana existe | Una hipótesis no es fuente verificada; una clasificación no aprueba una spec |

**Primitivas:** soporte estructural, semántico, tipográfico o Material. **Átomos:** un concepto coherente. **Moléculas:** conceptos coordinados como unidad local. **Organismos:** regiones con jerarquía. **Plantillas:** disposición sin contenido real. Criterios completos en [CATALOGACION.md](../CATALOGACION.md).

No se clasifica por número de nodos, imports Radix, tamaño o etiquetas históricas. Los metadatos de un mismo recurso o las cifras derivadas de un mismo tiempo no son automáticamente conceptos independientes.

## Evidencia y estado

- **R:** API/JSX React públicos contrastados: Surface, IconButton y Tabs. No significa contrato completo auditado.
- **F:** ficha original o preview contrastado en la revisión; el nivel objetivo puede diferir de su categoría histórica.
- **A:** evidencia del [análisis de límites](m3-component-boundaries.md) y acuerdos parciales.
- **H:** hipótesis explícita de responsabilidad objetivo; falta contrastar anatomía, estados o contrato. Tiene nivel de trabajo, pero conserva un bloqueo de validación antes de una decisión individual/spec.
- Todos los niveles son **propuestos**, salvo las dos unidades de Gauge marcadas **aprobado**. Nombres de unidades y sufijos son identificadores documentales, no exports ni APIs acordadas.

No se importan rutas privadas, nombres de proyectos ni direcciones externas. La pertenencia de una UI candidata al paquete genérico todavía exige revisión de reutilización.

## Resumen por unidad de responsabilidad

| Nivel | Unidades |
| --- | ---: |
| Primitiva | 12 |
| Átomo | 32 |
| Molécula | 43 |
| Organismo | 23 |
| Plantilla | 3 |
| **Total de unidades** | **113** |

Son **108 registros de origen y 113 unidades**, no 113 componentes nuevos ni 113 issues. Un preset puede reutilizar un átomo existente; una composición de producto puede quedarse en su consumidor.

## Descomposiciones trazables

| Registro original | Unidades de trabajo | Estado |
| --- | --- | --- |
| INV-004 — Stack / Cluster | `.stack` y `.cluster`: dos responsabilidades de layout | Propuesta; una API común todavía puede justificarse |
| INV-005 — Text / Heading | `.text` y `.heading`: bases tipográficas con semánticas diferentes | Propuesta; no asumir una API única |
| INV-023 — Badge | `.tag` y `.status`: categoría y estado | Propuesta; no borrar diferencias en una fusión automática |
| INV-032 — Gauge | `.single` y `.multi`: magnitud individual y composición de magnitudes | División y niveles aprobados; APIs/nombres/semántica pendientes |
| INV-053 — Timeline | `.events` y `.chat`: cronología y feed de mensajes | Propuesta; el feed no absorbe composer ni panel de conversación |

La suma añade cinco unidades respecto a los registros. Los IDs originales siguen identificando su procedencia; no se modifica la fuente del catálogo.

## Matriz completa

Cada unidad aparece una vez. «Responsabilidad objetivo» fija el alcance utilizado para proponer su nivel; si la anatomía observada contradice ese alcance, se revisan nivel y límites antes de la spec.

### Primitiva

| Unidad | Nombre de trabajo | Responsabilidad objetivo | Destino | Evidencia / estado |
| --- | --- | --- | --- | --- |
| INV-001 | Slot | Composición de elemento y props; base estructural sin un control propio. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-002 | VisuallyHidden | Ocultar visualmente manteniendo contenido accesible; soporte estructural. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-003 | Surface | Materia y estructura reutilizables; no coordina controles ni dominio. | UI candidata; pertenencia pendiente | R · propuesto |
| INV-004.stack | Stack | Distribuir contenido verticalmente; base de layout sin coordinar controles. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-004.cluster | Cluster | Distribuir contenido en fila con salto; base de layout. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-005.text | Text | Base tipográfica para texto sin rol de encabezado; no conoce contenido de producto. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-005.heading | Heading | Base tipográfica y jerarquía semántica de encabezado; tamaño y nivel semántico separados. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-006 | Divider | Separación estructural entre contenidos, sin coordinar acciones. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-007 | AspectRatio | Restricción de proporción; no figura editorial ni visor por sí sola. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-008 | Portal | Ubicación de contenido fuera del árbol local; soporte a piezas flotantes. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-009 | Label | Relación etiqueta/control como base semántica, sin validar ni coordinar formulario. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-038 | Skeleton | Placeholder estructural; su contrato de carga y anuncios sigue pendiente. | UI candidata; pertenencia pendiente | H · propuesto |

### Átomo

| Unidad | Nombre de trabajo | Responsabilidad objetivo | Destino | Evidencia / estado |
| --- | --- | --- | --- | --- |
| INV-010 | Button | Una acción de botón; icono de apoyo no añade otro concepto. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-011 | IconButton | Una acción con icono y nombre accesible; no coordina un grupo. | UI candidata; pertenencia pendiente | R · propuesto |
| INV-012 | Toggle | Conmutar un estado local; coordinación entre opciones fuera de esta pieza. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-013 | Link | Un enlace con destino; no región de navegación. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-014 | Icon | Un pictograma con contrato decorativo/accesible; no interacción adicional. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-015 | Input | Capturar un valor de texto; etiqueta y mensajes coordinados fuera del control. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-016 | Textarea | Capturar texto multilinea; distinguir tratamiento visual de editor especializado. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-017 | Select | Elegir un valor; opciones son partes del mismo control, no conceptos pares independientes. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-018 | Checkbox | Un valor booleano de formulario; extracción desde Field propuesta. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-019 | Switch | Una conmutación; no conjunto coordinado de switches. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-020 | Slider | Un valor en un rango; no grupo de métricas ni editor. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-021 | RadioGroup | Una elección exclusiva en un grupo semántico; múltiples items no implican conceptos independientes. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-022 | Chip | Una opción interactiva; el grupo coordina valores. Usos estáticos y navegación aún requieren delimitar contrato. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-023.tag | Tag | Categorizar contenido mediante una etiqueta estática. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-023.status | StatusBadge | Comunicar un estado semántico con texto e icono opcional. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-024 | Badge preset | Comunicar un nivel de permiso como etiqueta; preset consumidor, no coordina acciones. | Consumidor específico | F · propuesto |
| INV-025 | StatusDot | Un indicador puntual de estado; fusión de nombres no acredita sucesor implementado. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-026 | Kbd | Representación de una tecla o atajo, no ejecución del comando. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-027 | Avatar | Representación de identidad con imagen/fallback, un único concepto. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-028 | Logo | Marca gráfica como concepto local; generalidad y API pendientes. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-029 | ProductMark | Representar una marca de producto; contrato objetivo de un único identificador visual. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-030 | Pixel | Representar un recurso gráfico puntual; no compone una región de página. | Consumidor específico | H · propuesto |
| INV-031 | ProgressBar | Avance de un valor, sin coordinación de acciones ni múltiples métricas. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-032.single | Gauge · indicador individual | Representar una magnitud normalizada 0–100 con nombre/significado del consumidor. | UI candidata; pertenencia pendiente | A · aprobado |
| INV-033 | Stat | Etiqueta, valor y contexto pertenecen a una sola métrica; no slots independientes de producto. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-034 | Mark | Marcar un fragmento enlazado a su anotación; un concepto de referencia. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-035 | Dropzone | Un control de carga de archivos; arrastre/pegado son vías de entrada, no flujos independientes. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-037 | Spinner | Indicador de espera local; anuncios y movimiento deben definirse. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-062 | Countdown | Representar un único tiempo restante y actualizarlo; todas las cifras derivan de un mismo objetivo. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-070 | NoteItem | Enlazar una nota identificada por fecha y título; un único recurso, sin acciones independientes. | Consumidor específico | F · propuesto |
| INV-074 | StreamItem | Enlazar un único directo grabado con título, fecha y duración; metadatos de un mismo recurso. | Consumidor específico | F · propuesto |
| INV-104 | Isotipo3D | Representar una marca visual 3D con fallback; una responsabilidad visual, no una región. | Efectos | F · propuesto |

### Molécula

| Unidad | Nombre de trabajo | Responsabilidad objetivo | Destino | Evidencia / estado |
| --- | --- | --- | --- | --- |
| INV-032.multi | Gauge · conjunto multianillo | Componer indicadores con valores 0–100 independientes; reutiliza la pieza individual, sin incorporar acciones. | UI candidata; pertenencia pendiente | A · aprobado |
| INV-036 | Tooltip | Coordinar trigger y explicación contextual; hipótesis de wrapper, no solo un import. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-039 | Field | Coordina control, etiqueta y mensajes; no absorbe todos los controles. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-040 | ButtonGroup | Coordina varias acciones de botón; el split requiere contratos de acciones diferenciadas. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-041 | ChipGroup | Coordina opciones y selección exclusiva/múltiple, sin paneles de pestañas. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-042 | Tabs | Coordina triggers y paneles de pestañas; selección sin panel necesita revisión semántica. | UI candidata; pertenencia pendiente | R · propuesto |
| INV-043 | Menu | Lista de acciones y sus relaciones locales; no región completa de navegación. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-044 | NavList | Colección navegable y grupos locales; la región que la posiciona es otra responsabilidad. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-045 | UserMenu | Coordinar trigger de identidad y menú de cuenta, conservando destino de composición. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-046 | Popover | Coordina trigger y contenido contextual activable. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-047 | HoverCard | Coordina trigger y contenido de detalle por hover/foco; no tarjeta de producto por defecto. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-048 | Notice | Mensaje de estado y hasta dos acciones con responsabilidades propias. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-049 | Toast | Coordina avisos temporales y su ciclo de presentación; no solo una caja visual. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-050 | ListItem | Coordinar contenido, estado y acciones de una entrada de lista; contrato genérico aún propuesto. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-051 | PostCard | Coordinar contenido de publicación, estado y acciones; composición de dominio. | Consumidor específico | H · propuesto |
| INV-052 | SelectTile | Opción visual compuesta; cardinalidad de selección pertenece al contrato del grupo, no a la proporción. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-053.events | Timeline · eventos | Coordinar entradas y metadatos de una cronología. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-053.chat | Timeline · feed de chat | Coordinar entradas de mensajes y actualizaciones en vivo, sin absorber composer ni panel completo. | Consumidor; generalidad pendiente | F · propuesto |
| INV-054 | PageHeader | Coordina título y acciones de cabecera; alcance genérico sin confirmar. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-055 | SectionHeader | Jerarquía local de cabecera; revisar reutilización frente a PageHeader. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-056 | MeterRow | Coordina etiqueta, valor, visualización y ayuda; significado de la métrica aún pendiente. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-057 | ModuleCard | Coordina contenido y acciones de una tarjeta; no región completa por tamaño. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-058 | SearchTrigger | Acción para abrir búsqueda con pista de atajo; no implementa el buscador. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-059 | SocialLinks | Coordina enlaces de iconos como una unidad, no navegación general. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-060 | PhotoFrame | Figura editorial con imagen y pie; distinta de una restricción de proporción. | UI candidata; pertenencia pendiente | A · propuesto |
| INV-061 | PullQuote | Coordinar cita editorial y fuente/comentario en una figura; no encabezado de página. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-063 | TerminalCard | Coordinar presentación de perfil y contenido de terminal en una tarjeta. | Consumidor específico | H · propuesto |
| INV-064 | ToolCallChip | Coordinar llamada, estado/permiso y detalle de argumentos/resultado desplegable. | Consumidor específico | F · propuesto |
| INV-065 | ConfirmCard | Coordinar resumen de operación, detalles y acciones de confirmación. | Consumidor específico | H · propuesto |
| INV-066 | ChatMessage | Presentar cuerpo de mensaje, identidad y metadatos como unidad de conversación. | Consumidor específico | H · propuesto |
| INV-067 | Composer | Coordinar entrada de mensaje, adjuntos/opciones y envío. | Consumidor específico | H · propuesto |
| INV-068 | NowCard | Coordinar resumen de actividad actual y contexto en una tarjeta. | Consumidor específico | H · propuesto |
| INV-069 | ProjectCard | Coordinar resumen de proyecto y acceso/acciones asociadas. | Consumidor específico | H · propuesto |
| INV-071 | TipCard | Coordinar contenido de consejo y material de apoyo en una tarjeta. | Consumidor específico | H · propuesto |
| INV-072 | ArticleFeature | Coordinar destacado editorial, imagen y acceso a su artículo. | Consumidor específico | H · propuesto |
| INV-073 | ArticleItem | Coordinar resumen editorial y acceso como entrada de contenido; límite frente a enlace simple pendiente. | Consumidor específico | H · propuesto |
| INV-075 | CommunityCard | Coordinar resumen de comunidad, identidades y llamada a la acción. | Consumidor específico | H · propuesto |
| INV-076 | Carousel | Coordina contenido, navegación y estado local de una secuencia; extracción propuesta. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-086 | GaugeDock | Coordina gauges y acciones en una tira; no parte obligatoria de una magnitud. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-093 | ChapterBreak | Coordinar transición editorial, texto y marcador visual como unidad local. | Consumidor específico | H · propuesto |
| INV-102 | TipsSlider | Coordinar consejos, posición activa y navegación de una secuencia. | Consumidor específico | H · propuesto |
| INV-103 | AmbientBackground | Coordinar capas visuales de fondo (canvas, viñeta, grano) y su perfil; no el motor JS. | Efectos | F · propuesto |
| INV-108 | Cover | Coordinar título/tag y composición gráfica de una portada específica; no componente genérico. | Consumidor específico | F · propuesto |

### Organismo

| Unidad | Nombre de trabajo | Responsabilidad objetivo | Destino | Evidencia / estado |
| --- | --- | --- | --- | --- |
| INV-077 | Dialog | Región modal con cabecera, cuerpo desplazable y pie de acciones. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-078 | AlertDialog | Región de confirmación con decisión y acciones; no variante meramente visual de Dialog. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-079 | CommandPalette | Región modal que coordina búsqueda, resultados y ejecución de comandos. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-080 | Sidebar | Delimitar una región lateral que organiza navegación y contenido de apoyo; anatomía objetivo. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-081 | ModuleRail | Región de navegación con selección contextual; no patrón específico solo por dónde se usa. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-082 | TabBar | Región de navegación móvil; no grupo de opciones de formulario. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-083 | Table | Región de datos con cabecera, filas, scroll y contenido de celdas. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-084 | CalendarGrid | Región temporal con secciones de días, entradas y acciones; no simple cuadrícula decorativa. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-085 | PreviewFrame | Organizar región de previsualización, zonas seguras y toolbar; sucesor propuesto del marco original. | UI candidata; pertenencia pendiente | F · propuesto |
| INV-087 | AgentPanel | Organizar región de conversación, llamadas, confirmaciones y composición de mensajes. | Consumidor específico | H · propuesto |
| INV-088 | TopBar | Organizar cabecera global y sus zonas de navegación/acciones. | Consumidor específico | H · propuesto |
| INV-089 | MobileMenu | Organizar región móvil de navegación y acciones de acceso. | Consumidor específico | H · propuesto |
| INV-090 | SectionNav | Organizar navegación de secciones de una página; alcance de región objetivo. | Consumidor específico | H · propuesto |
| INV-091 | Footer | Organizar región final con identidad, enlaces y contenido complementario. | Consumidor específico | H · propuesto |
| INV-092 | Hero | Organizar región principal de presentación y llamadas a la acción. | Consumidor específico | H · propuesto |
| INV-094 | LabStage | Organizar región de exposición/demostración y su marco de contenido. | Consumidor específico | H · propuesto |
| INV-095 | Closing | Organizar región de cierre de página y acciones posteriores. | Consumidor específico | H · propuesto |
| INV-096 | NotesBoard | Organizar región de notas con cabecera, filtros y colección. | Consumidor específico | H · propuesto |
| INV-097 | NowStrip | Organizar región de actividad actual compuesta de tarjetas/contexto. | Consumidor específico | H · propuesto |
| INV-098 | ProjectsGrid | Organizar región de colección de proyectos y su jerarquía. | Consumidor específico | H · propuesto |
| INV-099 | BlogGrid | Organizar región de artículos destacados y entradas. | Consumidor específico | H · propuesto |
| INV-100 | LiveBand | Organizar región de contenido en directo, próxima emisión e historial. | Consumidor específico | H · propuesto |
| INV-101 | CommunityGrid | Organizar región de colección de comunidades. | Consumidor específico | H · propuesto |

### Plantilla

| Unidad | Nombre de trabajo | Responsabilidad objetivo | Destino | Evidencia / estado |
| --- | --- | --- | --- | --- |
| INV-105 | AppShell | Disposición de regiones de una vista sin contenido real; genericidad aún por demostrar. | UI candidata; pertenencia pendiente | H · propuesto |
| INV-106 | SectionShell | Disponer y enmarcar una sección que aloja organismos, sin contenido real propio. | Consumidor específico | F · propuesto |
| INV-107 | HomeTemplate | Disponer regiones de la vista inicial sin datos ni textos reales. | Consumidor específico | H · propuesto |

## Justificaciones que evitan clasificar por apariencia

- **Text y Heading → primitivas de trabajo:** bases de tipografía y semántica reutilizables, sin concepto de producto ni coordinación de controles. Separar su rol no implica imponer un nivel visual ni unificar APIs.
- **Tag y StatusBadge → átomos:** categoría y estado son contratos distintos de un concepto local cada uno. El preset de permiso también es un átomo de consumidor, no otra molécula solo por usar icono.
- **RadioGroup → átomo de trabajo:** un grupo con una elección semántica exclusiva. ChipGroup coordina una colección y los modos exclusivos/múltiples; no sustituye pestañas.
- **Gauge:** indicador individual átomo y multianillo molécula aprobados. Cada valor 0–100 es independiente; las acciones quedan aparte y no se asigna automáticamente `progressbar`.
- **Notice → molécula:** coordina mensaje y acciones. **NavList → molécula:** colección local; la región Sidebar que la aloja tiene otra responsabilidad.
- **Stat y Countdown → átomos:** una métrica y un único tiempo restante, respectivamente. Etiqueta/contexto o días/horas/minutos/segundos no son conceptos pares independientes solo por tener varios nodos.
- **NoteItem / StreamItem → átomos de trabajo:** un enlace enriquecido a un recurso. Si aparecen slots o acciones independientes, habrá que revisar el límite; no se obliga a que toda fila sea átomo.
- **ToolCallChip → molécula:** coordina datos/estado/permiso con detalle desplegable; no es átomo por llamarse Chip.
- **PullQuote → molécula de trabajo:** figura editorial que coordina cita y fuente/comentario; el contrato de esa anotación se delimita antes de aprobarla.
- **SectionShell / HomeTemplate / AppShell → plantillas:** disposición de regiones sin contenido real propio. Consumidor específico no implica organismo.
- **Cover → molécula de trabajo:** título/tag y material gráfico como composición editorial. Sigue siendo específica; no se crea una API genérica ni una issue propia por esta clasificación.
- **Efectos:** el fondo coordinado se propone molécula y la marca 3D átomo. Estos niveles describen los componentes visuales objetivo, no los motores/archivos JS de referencia ni una implementación React existente.

## Reutilización, dependencias y paralelo

Los exports React observados siguen siendo [Surface, IconButton y Tabs](../../packages/ui/src/index.ts). Se conservan APIs y raíces públicas, incluida `eg-icon-btn`. Ningún nombre o sufijo de esta matriz renombra código existente.

Antes de definir una unidad publicable se aplica reutilizar → variante → componer → extraer → nuevo. Nivel y destino no bastan para decidir si necesita componente o issue propios. El [manifiesto UI](../../packages/ui/package.json) no cambia; paquetes Radix, tokens o recetas ausentes requieren confirmación específica.

Dependencias conceptuales mínimas: indicador individual → multianillo; contratos de selección → grupos/opciones; controles y relaciones accesibles → Field; acciones de menú → composiciones de cuenta; piezas de presentación → regiones → plantillas. No se declaran imports runtime desde esta relación.

Para paralelo se acordarán rutas exclusivas, APIs de las bases, dueño de exports/catálogo/estilos compartidos y orden de integración. No se declara lista una tanda por disponer de niveles.

## Validación pendiente antes de specs e issues

1. Revisar y aprobar las responsabilidades/niveles propuestos; las únicas unidades Atomic aprobadas son las de Gauge.
2. Para H, contrastar anatomía, estados y accesibilidad; una responsabilidad objetivo no sustituye esa investigación.
3. Aprobar o revisar las otras cuatro descomposiciones y la genericidad de los candidatos; conservar compatibilidad y consumidores.
4. Cerrar APIs, valores, nombres, variantes y referencias visuales versionadas por unidad. La captura de muestra existente no aprueba todos los diseños.
5. Aprobar specs y planes por separado antes de implementar o publicar issues; no crear una issue automáticamente por cada fila.

Esta versión sustituye la matriz anterior que dejaba patrones y efectos sin nivel y doce casos pendientes de clasificación. Todos tienen ahora una **clasificación de trabajo**; los bloqueos restantes son de validación, aprobación o definición de contrato, no casillas vacías de nivel.
