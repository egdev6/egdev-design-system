# Referencias visuales de componentes

Aquí se conservan las capturas del **diseño esperado** vinculadas a la ficha individual de cada componente. Complementan el [contrato de apariencia](../../skills/_shared/component-spec-template.md); no sustituyen tokens, Material, comportamiento, accesibilidad ni tests.

## Organización

Use `docs/components/<kebab-name>/v<spec-version>/` and `<variant>--<state>--<viewport>--<theme>.png`, with `capture.json` metadata. Write identifiers, descriptive alt text, metadata and statuses in English; link real images relative to the spec's actual location. Specs need not move: Gauge stays at `docs/specs/gauge.md`.

Preserve existing `docs/design/` captures and historical ODD documents unchanged; older component paths remain valid archives, not migration targets. Gauge's canonical v0.3 copies retain the original PNG bytes/hashes and capture conditions; metadata distinguishes current spec v0.6 from source capture v0.3. Reuse is not a fresh v0.6 capture or approval.

No crees imágenes vacías ni copies automáticamente los artefactos de `.playwright-mcp/`. Guarda solo las referencias solicitadas, con los metadatos de cada captura en la ficha. La carpeta puede contener propuestas; estar versionada no equivale a estar aprobada.

## Qué registrar en la ficha

Asigna un ID visual (`VIS-01`, etc.) a cada imagen:

- **Origen y objetivo:** URL/story o lienzo de diseño, versión/commit de la fuente y si representa diseño esperado o implementación actual. No publiques credenciales, rutas privadas ni datos personales.
- **Escenario:** componente y partes visibles, variante, props/args relevantes y estado de interacción. Acuerda la referencia principal y los estados/variantes adicionales necesarios, sin prometer cobertura de toda la API por una sola imagen.
- **Condiciones:** viewport en px, escala de dispositivo, navegador/versión, tema, fuentes cargadas y preferencias de movimiento/transparencia. Indica recorte de componente o página completa.
- **Procedencia:** fecha y herramienta de captura; si la imagen la aporta el usuario, identifica esa procedencia y lo que no se pudo verificar.
- **Intención visual:** anatomía, Material, tipografía, espaciado y tokens que deben conservarse; diferencias permitidas y criterios de aceptación relacionados.
- **Approval:** Proposed / Approved, spec version and recoverable human approval identifying the image. Spec approval covers images only when explicitly identified; never infer it.

## Capturar con Playwright MCP

1. Agree on the source, scenario, conditions and exact permissions. For an original HTML preview, authorize read-only hosting and source/tool access, then navigate a real browser to that preview; do not edit the source or implement a component to obtain evidence. Starting a server requires separate permission.
2. Use Playwright MCP on the authorized source, set viewport/state and wait for fonts/stable content. Capture the **component zone** (element or agreed crop), not only a blank/full-page screenshot; a board may supplement, not replace, the component capture. No synthetic/AI image is browser evidence.
3. Inspect the real PNG, save only the requested captures under `docs/components/` and record source/capture versions, conditions, crop, VIS IDs, SHA-256 hashes and limits in `capture.json` and the spec. No automatic copying of unrelated tool artifacts.
4. Present the source capture as Proposed/Observed, never automatically approved expected design. Obtain recoverable human adoption identifying the exact snapshot and visual hashes. Browser images do not verify behavior/accessibility.

### GitHub-visible image handoff

1. Local PNGs are not GitHub-visible. Choose **human attachment** (human uploads the exact PNG and returns its actual URL) or a **bounded authorized asset-publication branch** (human approves exact repository/branch, files, credential/session and each needed commit/push/upload action). Spec approval implies none of these permissions.
2. For the branch route, use only an already available authorized capability and a recoverable immutable image reference. Do not invent a `gh` attachment-upload command, install tools or publish private source data. Missing source/hosting/tool/action authorization or unavailable tooling means STOP; return the local artifact, hash and precise missing permission.
3. Before linking in an issue/comment, retrieve the actual URL using an authorized read, verify GitHub/reviewer accessibility and compare the downloaded PNG bytes' SHA-256 with local capture metadata. Do not use invented URLs, local paths, or a landing/login page as an image. A transformed/mismatched asset needs review, not an assumed match.
4. Record the verified URL, hash and access-check result; then request the separately authorized issue/comment action in [issue handoff](../../skills/component-spec-proposer/references/issue-handoff.md). Until verified, report image publication/access Pending and visual handoff blocked; no upload, commit or push is implied.

Si no hay fuente, servidor autorizado o Playwright MCP disponible, registra el bloqueo; no instales dependencias, arranques servidores ni simules una captura sin autorización. Una imagen aportada puede servir como propuesta, indicando sus límites de procedencia.

## Comparar durante implementación y auditoría

Captura la implementación observada en las mismas condiciones y compárala con las referencias aprobadas. Si cambian viewport, tema, fuentes, estado o versión, explica la diferencia antes de extraer conclusiones. Las capturas de comprobación siguen siendo evidencia observada, no reemplazan el diseño esperado automáticamente.

Relaciona cada diferencia con un criterio de aceptación. No infieras valores de tokens desde píxeles ni inventes tolerancias numéricas o tests de regresión visual: se acuerdan en la ficha/plan si hacen falta. Si imagen y contrato contradicen tokens, Material o accesibilidad, informa el conflicto y pide decisión; no cambies esas normas ni tokens para igualar una imagen.

Without approved, recoverable references and comparable conditions, mark visual conformity **Not evaluated** and record pending evidence; other checks may continue, but a capture alone never validates appearance. Changing approved expected design requires a new spec version/folder and approval; preserve the previous version. Proposed images may be revised with updated metadata while explicitly Draft.
