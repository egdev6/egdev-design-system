# Plantilla de contrato individual de componente

Define qué promete un componente antes de planificar su implementación. Complementa el [contrato general](component-contract.md); no duplica ni sustituye sus normas.

## Cómo usarla

- Copia la ficha siguiente y sustituye los campos entre `<…>`.
- Marca lo que no aplique como «No aplica» y explica el motivo.
- Separa lo propuesto de lo existente y verificado; cita rutas, símbolos o comprobaciones para acreditar lo segundo.
- Deja dudas y decisiones pendientes explícitas. No inventes defaults, comportamientos ni evidencia.
- Presenta la ficha para aprobación humana. Aprobar el contrato no autoriza implementar: después se presenta y aprueba el plan por responsabilidades.
- Si cambia una promesa aprobada, presenta el cambio de contrato antes de implementarlo.

---

# Contrato de componente — <ComponentName>

- **Versión:** <versión de la ficha>
- **Estado:** <borrador | aprobado; solo registrar aprobación humana explícita>
- **Aprobación:** <pendiente o referencia recuperable a la aprobación de esta versión>
- **Conservación:** <ruta acordada o referencia desde la que otra sesión puede recuperar esta ficha; guardar solo con permiso>
- **Situación actual:** <nuevo | existente; qué se ha verificado y qué está propuesto>
- **Pendientes:** <preguntas, decisiones y evidencia que falta; o ninguno>

## 1. Propósito y alcance

- **Necesidad que resuelve:** <responsabilidad y casos de uso>
- **Fuera de alcance:** <casos que no cubre>
- **Decisión de catalogación:** <reutilizar | variante | componer | extraer | nuevo>
- **Alternativas descartadas:** <recorrer las opciones anteriores y explicar por qué no bastan>
- **Evidencia:** <catálogo e implementación React pública inspeccionada: rutas, props y exports>
- **Nivel y paquete:** <ubicación propuesta o existente; justificar por responsabilidad>

## 2. Anatomía y composición

| Parte | Responsabilidad | Elemento nativo / primitiva Radix | Contenido permitido |
| --- | --- | --- | --- |
| <raíz o parte> | <función> | <elemento o primitiva> | <contenido> |

- **Base Radix:** <paquete individual disponible; o ninguna, con motivo>
- **Composición:** <piezas reutilizadas, restricciones y contrato de `asChild` si aplica>
- **Clase raíz pública:** <marcador estable; conservar el existente>
- **Marcadores de partes:** <si existen o están propuestos>

## 3. API pública

| Prop / evento | Tipo | Obligatorio | Default o regla | Descripción |
| --- | --- | --- | --- | --- |
| <nombre> | <tipo> | <sí / no> | <valor, regla dependiente o sin default> | <promesa pública> |

- **Props nativas:** <elemento del que se heredan, destino y restricciones; no duplicar todas sus props>
- **Refs:** <si se exponen, tipo y destino real; o no se exponen>
- **Controlado / no controlado:** <props de cada modo, inicialización y notificaciones; o no aplica>
- **Compatibilidad:** <impacto en API, exports, marcadores públicos y consumidores existentes>

## 4. Comportamiento

| Estado inicial / acción | Resultado esperado | Evento emitido |
| --- | --- | --- |
| <estado y acción> | <estado final y efecto observable> | <evento y datos; o ninguno> |

- **Estados de interacción:** <estados admitidos y transiciones; no confundir con variantes visuales>
- **Representación:** <atributos Radix, ARIA o `data-state` propios>
- **Límites y casos especiales:** <deshabilitado, datos vacíos, límites, acciones repetidas u otros casos aplicables>
- **Responsabilidad del consumidor:** <comportamiento que no gestiona el componente>

## 5. Accesibilidad

- **Nombre accesible:** <origen y obligación del consumidor>
- **Roles y relaciones:** <semántica nativa, ARIA e ids relacionados>
- **Teclado:** <teclas, resultado y responsable: nativo, Radix o lógica propia justificada>
- **Foco:** <entrada, navegación, salida y restitución cuando aplique>
- **Anuncios:** <qué cambios se anuncian y cómo; o no aplica>
- **Otras condiciones:** <objetivo táctil, información no dependiente solo del color y requisitos aplicables>
- **Reparto de responsabilidades:** <garantías del componente y obligaciones del consumidor>

## 6. Apariencia

| Eje de variante | Valores admitidos | Default o regla | Combinaciones / restricciones |
| --- | --- | --- | --- |
| <eje, incluido tamaño si aplica> | <valores> | <valor o regla> | <compatibilidad> |

- **Tokens:** <variables existentes que definen la apariencia; no introducir valores en duro>
- **Layout externo:** <colocación permitida por `className` desde la app; Tailwind solo para layout, nunca para cambiar apariencia ni dentro del componente>
- **Material:** <Surface o receta utilizada y dónde se define>
- **Estados visuales:** <tratamiento de los estados de interacción y foco>
- **Movimiento reducido:** <resultado esperado>
- **Composición de clases:** <contrato de `className` y conflictos que deben resolver `cn()`/twMerge>
- **Propuestas pendientes:** <tokens, tratamientos Material, dependencias o excepciones CSS globales que necesitan confirmación; o ninguna>

## 7. Criterios de aceptación

Asigna un ID a cada promesa verificable. Indica comprobaciones previstas y, por separado, resultados obtenidos: un test o una story planificados no son evidencia de cumplimiento.

| ID | Resultado verificable | Test previsto | Story / comprobación visual prevista | Evidencia obtenida |
| --- | --- | --- | --- | --- |
| AC-01 | <dado un caso, al actuar, ocurre un resultado observable> | <caso y archivo, o no aplica con motivo> | <ejemplo o comprobación, o no aplica con motivo> | <pendiente o resultado y referencia> |

### Cierre de la ficha

- [ ] Los siete bloques están completos o justificados como «No aplica».
- [ ] No quedan dudas que impidan definir las promesas del componente.
- [ ] Las propuestas se distinguen de la implementación verificada.
- [ ] Cada promesa tiene un criterio y un método de comprobación adecuado.
- [ ] La aprobación humana corresponde a esta versión de la ficha.

**Siguiente paso:** presentar el plan de implementación y esperar su aprobación. Esta ficha no autoriza cambios de tokens, dependencias, código ni mutaciones externas.
