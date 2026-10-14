# Referencias visuales de componentes

Aquí se conservan las capturas del **diseño esperado** vinculadas a la ficha individual de cada componente. Complementan el [contrato de apariencia](../../skills/_shared/component-spec-template.md); no sustituyen tokens, Material, comportamiento, accesibilidad ni tests.

## Organización

Usa `docs/design/<kebab-name>/v<spec-version>/` y nombres como `<variant>--<state>--<viewport>--<theme>.png`. Los identificadores de archivos van en inglés. La ficha enlaza la imagen con una ruta relativa desde su propia ubicación y texto alternativo descriptivo en español.

No crees imágenes vacías ni copies automáticamente los artefactos de `.playwright-mcp/`. Guarda solo las referencias solicitadas, con los metadatos de cada captura en la ficha. La carpeta puede contener propuestas; estar versionada no equivale a estar aprobada.

## Qué registrar en la ficha

Asigna un ID visual (`VIS-01`, etc.) a cada imagen:

- **Origen y objetivo:** URL/story o lienzo de diseño, versión/commit de la fuente y si representa diseño esperado o implementación actual. No publiques credenciales, rutas privadas ni datos personales.
- **Escenario:** componente y partes visibles, variante, props/args relevantes y estado de interacción. Acuerda la referencia principal y los estados/variantes adicionales necesarios, sin prometer cobertura de toda la API por una sola imagen.
- **Condiciones:** viewport en px, escala de dispositivo, navegador/versión, tema, fuentes cargadas y preferencias de movimiento/transparencia. Indica recorte de componente o página completa.
- **Procedencia:** fecha y herramienta de captura; si la imagen la aporta el usuario, identifica esa procedencia y lo que no se pudo verificar.
- **Intención visual:** anatomía, Material, tipografía, espaciado y tokens que deben conservarse; diferencias permitidas y criterios de aceptación relacionados.
- **Aprobación:** propuesta/aprobada, versión de la ficha y referencia recuperable a la aprobación humana que identifica esa imagen. La aprobación de la ficha puede cubrir sus referencias si las identifica explícitamente.

## Capturar con Playwright MCP

1. Acuerda fuente, escenario y condiciones antes de capturar. Para componentes aún no implementados, usa un lienzo/prototipo de diseño disponible: no implementes el componente solo para obtener la imagen.
2. Usa Playwright MCP para abrir la fuente autorizada, ajustar viewport y estado, esperar fuentes y contenido estable y capturar el componente o la página según lo acordado. Registrar una imagen no demuestra que se haya verificado teclado, foco o accesibilidad.
3. Revisa el resultado y conserva la captura solicitada en la ruta acordada de `docs/design/`, enlazándola y registrando sus condiciones en la ficha. La imagen se captura del navegador; no se genera con IA ni se presenta una imagen sintética como evidencia Playwright.
4. Presenta la referencia como propuesta y solicita aprobación de esa versión. Una captura de la implementación actual solo acredita su estado observado, no el diseño esperado; adoptarla como referencia requiere una decisión humana explícita.

Si no hay fuente, servidor autorizado o Playwright MCP disponible, registra el bloqueo; no instales dependencias, arranques servidores ni simules una captura sin autorización. Una imagen aportada puede servir como propuesta, indicando sus límites de procedencia.

## Comparar durante implementación y auditoría

Captura la implementación observada en las mismas condiciones y compárala con las referencias aprobadas. Si cambian viewport, tema, fuentes, estado o versión, explica la diferencia antes de extraer conclusiones. Las capturas de comprobación siguen siendo evidencia observada, no reemplazan el diseño esperado automáticamente.

Relaciona cada diferencia con un criterio de aceptación. No infieras valores de tokens desde píxeles ni inventes tolerancias numéricas o tests de regresión visual: se acuerdan en la ficha/plan si hacen falta. Si imagen y contrato contradicen tokens, Material o accesibilidad, informa el conflicto y pide decisión; no cambies esas normas ni tokens para igualar una imagen.

Sin referencia aprobada, captura recuperable o condiciones comparables, marca la conformidad visual «no evaluado» y registra lo pendiente. Puedes seguir comprobando el resto del contrato, pero no declarar apariencia validada por tener una captura. Cambiar una referencia de diseño ya aprobada, aunque solo cambie la imagen, requiere incrementar la versión de la ficha, crear su nueva carpeta y obtener nueva aprobación; conserva la versión anterior en lugar de sobrescribirla. Antes de aprobar, puedes revisar una propuesta en su carpeta, dejando explícito que sigue siendo borrador y actualizando sus metadatos.
