# Alineación del stack — M1 y M2

Roadmap aprobado: [índice #8](https://github.com/egdev6/egdev-design-system/issues/8), revisión `egdev-ds-alignment-v1`.
Trabajo local: rama `chore/3-stack-contracts`. Sin commit, PR ni integración todavía.

## Límites

- Tramo original: ejecutar M1/M2 y detenerse antes de M3. Ampliación posterior autorizada:
  solo [borrador local de inventario/spec M3](m3-inventory-pilot.md), sin implementación ni publicación.
- Conservar identidad, tokens, clases públicas `eg-*` y CSS legado.
- Sin componentes nuevos, spinner, portado de efectos, `cmdk`/`dnd-kit` ni clon upstream MCP.
- No convertir todo el CSS a Tailwind en esta actualización.
- Autorizar dependencias/tokens adicionales por separado.
- La revisión multiárea se aprobó por unidades A/B/C/D; no hay entrega automática.

## Unidades y estado real

| Unidad | Issue | Resultado | Estado |
| --- | --- | --- | --- |
| A | [#3](https://github.com/egdev6/egdev-design-system/issues/3) | Base reproducible y calidad | Checks locales e independientes pasan; revisión nativa no realizada; continuación autorizada por el usuario |
| B | [#4](https://github.com/egdev6/egdev-design-system/issues/4) | Storybook 10, JSDoc y MCP | Comprobado localmente e independientemente; sin revisión nativa |
| C | [#5](https://github.com/egdev6/egdev-design-system/issues/5) | Vite 8 y consumo del paquete | Comprobado localmente; revisión independiente de fuente, artifacts y checks; consumidores contrastados por log |
| D | [#6](https://github.com/egdev6/egdev-design-system/issues/6) | Contratos, skills y contribución | Completado localmente y revisado independientemente; avisos de terceros conservados; sin integración |
| E | [#7](https://github.com/egdev6/egdev-design-system/issues/7) | Catálogo y piloto | Borrador local; anatomías y aprobación pendientes; issue bloqueada por integración de M2 |

## Decisión de revisión

El usuario autorizó explícitamente desactivar RDD **solo para este clon**, incluidos sus worktrees,
y continuar M1/M2, manteniendo las pruebas y la verificación independiente y deteniéndose antes de M3.
El readback nativo confirma `global: on`, `clone_local: off`, `effective: off`; otros clones no cambian.
La unidad A no obtuvo revisión ni aprobación nativa: su candidato fue rechazado en preflight por
`lens_context_budget_exceeded`, sin crear autoridad. La autorización humana de continuar no sustituye
ese resultado por una aprobación ficticia ni autoriza commits, publicaciones o instalaciones del controlador.
RDD permanece desactivado para los siguientes cambios del clon hasta que el usuario decida reactivarlo.

## Línea base

En `2adf0c0`: instalación correcta, 17 tests pasan, tipos UI pasan y Storybook 8 compila.
`pnpm build` fallaba por expansión del filtro del shell. Lint tenía 263 errores, incluidos formato,
configuración antigua, CSS generado y referencias que aún no se portan.
No se habían instalado dependencias ni existía lockfile versionado en el checkout inicial.

## Evidencia A

- Build: RED con `ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT`; GREEN al citar `'./packages/**'`.
- `cn`: RED 2 fallos/1 correcto con clsx; GREEN 3 correctos con clsx + tailwind-merge.
- Suite tras actualizar React: RED 5 fallos/15 correctos por peers UI con React 19.2.8 y renderer 19.3.
  Se fijaron dev dependencies UI 19.3 sin forzar React 19 a los consumidores; GREEN 20/20.
- Instalación `--frozen-lockfile`, root/UI typecheck, lint, cobertura, build y Storybook 8: exit 0.
- Cobertura UI: statements 96,55 %, branches 92,85 %, functions 100 %, lines 96,29 %.
- Verificador independiente: lint, typecheck, 20 tests, `cn` y validación Lefthook: exit 0.
- Runtime comprobado: Node **24.20.0**, pnpm **10.34.6**, TypeScript **6.0.3**.
  `.nvmrc` propone **24.21.0**; esa versión exacta aún no se ha ejecutado.
- Un probe LSP del checkout original mantiene TS2322 en Slot. La compilación configurada pasa
  con TS 6.0.3 y con el TS 5.9.3 del proveedor; no se reprodujo como defecto de fuente.
  No se añadieron casts para ocultarlo. La resolución del proyecto LSP sigue inconcluyente.
- Lefthook instaló hooks compartidos durante su primer postinstall. Se bloqueó su lifecycle
  para siguientes instalaciones; `pnpm hooks:install` es la activación explícita. No se borraron hooks.

Los scripts de `effects` siguen siendo placeholders: **no prueban funcionamiento del paquete**.
Lint excluye solo referencias/legado no portado, CSS generado, tokens fuente protegidos y artefactos;
no significa que el legado esté auditado. Los archivos mantenidos conservan las reglas de calidad.

## Evidencia B

- Storybook, React-Vite, Docs, a11y y MCP fijados en **10.6.1**. B se comprobó primero con Vite **6.4.4**:
  sus peers admiten esa versión; la comprobación posterior con Vite 8 se registra en C.
- MCP en `127.0.0.1:6006/mcp`, manifiesto explícito y herramientas documentales únicamente:
  `docs-list`, `docs-show`, `docs-show-story`. El peer de addon-vitest es opcional; no se añadió ni se adoptó `play`.
- Se mantienen JSDoc, extracción TypeScript, props obligatorias, enums, defaults y su relación con hooks/CVA.
  Cuatro regresiones de docgen pasan; usan Node por archivo, sin cambiar jsdom para los componentes.
- RED persistente MCP sobre Storybook 8: `initialize` devuelve HTTP 404, exit 1.
  Tras la migración se corrigió el parser del smoke para descripciones multilínea y viñetas Markdown;
  sus dos regresiones y la comprobación real de las tres herramientas pasan (3/3).
- El manifiesto advertía que `Gear` no podía resolverse estáticamente. El SVG idéntico se dejó inline en
  los args de IconButton: desaparece la advertencia, los snippets son completos y pasan sus seis tests.
- Instalación congelada, tipos, lint, 24 tests, build de paquetes y build Storybook 10: exit 0.
  El candidato final repite todos esos checks (exit 0), y la comprobación independiente reproduce tipos, lint,
  24 tests, MCP 3/3 y manifiestos sin advertencias de snippets incompletos.
- Navegador real: Autodocs de IconButton conserva textos españoles, required y defaults. El control de forma
  cambia `square` → `round`, con las clases esperadas; el canvas de variantes muestra cinco SVG y el estado pressed.
  Tabs selecciona Borradores mediante Radix, actualiza `aria-selected` y muestra su panel.
  Un intento previo con un selector de combobox expiró: los controles reales son radios; no se atribuyó al componente.
- Claude Code **2.1.286** se ejecutó con configuración HTTP inline, herramientas MCP únicamente y sin persistencia
  de sesión ni configuración global. Exit 0: descubre los tres componentes y devuelve ID, required y defaults correctos.
- La guía mínima de stories se alineó antes de cambiar imports: español, tipos del framework y `storybook/actions`.
  Es un prerrequisito normativo de M2; no significa que los contratos y skills completos de D estén adaptados.

Las previews HTML del smoke no sustituyen las comprobaciones de navegador. Los artefactos visuales locales
están en `.playwright-mcp/` del checkout original, sin versionar. Siguen existiendo avisos de MDX ausente,
docgen omitido para el preview (no es un componente del proyecto TS), directivas `use client` y tamaño de chunks;
los 404 de favicon son anteriores/no bloquean las stories. No se ocultan como un resultado sin avisos.

### Gate adicional de exports públicos

Un build exitoso no bastaba: `dist/index.d.ts`, declarado públicamente, faltaba en la salida fresca.
El test persistente dio RED (4/5): los tipos estaban bajo `dist/src/`. TypeScript 6 usa por defecto
la raíz del tsconfig al emitir; el plugin de declaraciones infería `src`. Se alineó únicamente su
`compilerOptions.rootDir`, sin cambiar el manifest ni mover los tests. La hipótesis inicial de que
el test docgen causaba el desfase no se confirmó.

El siguiente build fresco pasó: exports **5/5**, **11 declaraciones** enlazadas, sin entrada anidada
obsoleta ni diagnósticos de TypeScript/plugins en el log. Un verificador independiente reprodujo
exports, tipos, lint y 24 tests. Esto resuelve la ruta pública; todavía no prueba consumo empaquetado,
CSS en una app, SSR ni React 18/19: esos gates permanecen en C.

## Evidencia C

- Vite **8.3.4** instalado y lockfile congelado verificado. Build UI, exports **5/5** con **11 declaraciones**,
  tipos, lint (**47 archivos**), cobertura (**28 tests / 5 archivos**) y build Storybook **10.6.1** con Vite 8: exit 0.
  Cobertura de los archivos incluidos: statements/functions/lines 100 %, branches 96,42 %; no es cobertura de efectos ni del catálogo futuro.
- Los consumidores usan tarballs locales, sin alias del monorepo: React **18.3.1** y **19.3.0**, TS estricto,
  negativos de props, SSR, CSR con eventos/disabled/Tabs/paneles/refs, CSS compilado y React/ReactDOM deduplicados.
  Resultado final **12/12**, una hoja CSS de **162.914 bytes** por versión y una instancia física de cada renderer.
- RED real: CSS empaquetado faltante en ambas versiones y CSR React 18 con timeout de 30 s y aviso de refs.
  El usuario autorizó expresamente reparar ambos dentro de M1-C y una nueva ejecución tras la corrección.
  Se publican `src/**/*.css` y se reenvían refs existentes de Surface/IconButton con `forwardRef`, sin cambiar
  props, defaults, variantes ni contenido CSS. Cuatro regresiones prueban raíces nativas y `asChild` compatible;
  no se promete una ref polimórfica a cualquier elemento ni se atribuye una causa exacta al timeout inicial.
- El verificador independiente reproduce exports, tipos, lint y **28/28** tests, revisa la fuente y lee el log íntegro
  de los **12/12** consumidores; no repite sus instalaciones por falta de herramienta background.
- Se preserva stderr de subprocesses exitosos. Esto reveló que pnpm ignoraba `package.json#pnpm.overrides` en
  los fixtures; el override se trasladó a su `pnpm-workspace.yaml`. Nueva ejecución: **12/12**, lint y diffcheck exit 0.
- MCP final sobre servidor Vite 8: **3/3**, exit 0. El navegador muestra Surface con clase estable, borde de luz,
  degradado y sombras Material; captura inspeccionada y consola sin errores en ese escenario.
- Incidente de comprobación: un arranque con `-- --no-open` falló por argumentos; navegación posterior fue rechazada
  y el locator expiró. El wait de readiness también expiró (exit 124); no se repitió ese wait. Arranque corregido
  con `storybook dev ... --ci`, seguido de ejecución directa MCP y del escenario independiente Surface.

## Evidencia D y avisos de terceros

- Contrato/arquitectura/catalogación: **151 líneas** diff; flujos de tres skills: **119**; referencias Radix/testing/stories:
  **399 agregadas**, incluida la guía previa de B. Se mantienen siete responsabilidades, Material, CSS BEM, primitivas
  de apoyo y la excepción pública `eg-icon-btn`. Atomic se decide por responsabilidad y coordinación, no tamaño o CSS.
- Revisión independiente: **9 archivos / 798 líneas**, **47 enlaces/anclas**, diffcheck correcto y normas coherentes.
  Se corrigieron dos contradicciones de AGENTS y la descripción transitoria de componentes sin `forwardRef`.
- El trabajo propio conserva MIT. [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md) incluye el aviso MIT upstream
  íntegro y distingue los originales Apache-2.0 de las modificaciones propias. Se añade la [licencia Apache-2.0 completa](../../LICENSES/Apache-2.0.txt)
  y avisos prominentes de modificación/atribución en las tres skills; sus términos específicos no se sustituyen por MIT raíz.
- El seguimiento independiente valida identidad literal de ambas licencias, tres headers upstream, atribución,
  rutas y 31 enlaces/anclas; diffcheck exit 0. Los hallazgos anteriores están resueltos: **cierre documental técnico aprobado**,
  no aprobación nativa ni certificación jurídica. La revisión de la primera copia sigue desconocida y se declara;
  no mantiene un bloqueo técnico con la conservación explícita de los términos conocidos. Entrega/integración requieren autorización aparte.

Al cierre de D, M3 no se había iniciado; después se autorizó únicamente su borrador local, descrito arriba.
Node 24.21.0 y los efectos siguen sin probarse; los avisos MDX/docgen-preview/use-client/chunks y
la recomendación SWC se conservan. No hubo commits, push, PR, cierre de issues ni release.

## Gates B y C

Antes de afirmar viabilidad: instalación/peers reproducibles, tests/tipos/lint/build, JS/CSS/`.d.ts`
y consumo real React 18/19. Verificar Storybook en navegador y JSDoc de props/meta/stories,
required/defaults/controles y casos CVA/alias/defaults de hooks. MCP debe listar y mostrar documentación
real con el manifiesto habilitado; servidor local, sin exposición pública ni configuración global de Claude.
API MCP en preview. No adoptar `play` ni addon-vitest únicamente por añadir MCP.

## Comprobaciones y entrega

Registrar evidencia por unidad, incluidas limitaciones. Configuración y documentación sin un RED
significativo se comprueban estructural/funcionalmente; cambios de comportamiento usan test-first.
Cada candidato de alto riesgo recibe verificación independiente además de la revisión nativa aplicable.
Commit, push, PR, merge, cierre y release siguen pendientes de autorización propia.
