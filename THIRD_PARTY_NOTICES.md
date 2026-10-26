# Avisos de terceros

El propietario mantiene **MIT para el trabajo propio de EGDEV**. Esta elección no sustituye los términos ni los avisos de los materiales de terceros.

## Stack & Flow — documentación adaptada

Las referencias de stories, testing y Radix, así como el contrato de componentes, contienen adaptaciones de documentación de Stack & Flow. Se conserva a continuación el aviso completo de su licencia raíz, sin sustituir la licencia del trabajo propio de EGDEV.

Fuente consultada: repositorio `Stack-and-Flow/design-system`, revisión `a9b5c9f3d77b1ff3fd70e2c30d0910713887d4f5`. Esta identifica la revisión inspeccionada, **no acredita la revisión originalmente adoptada** por cada documento.

```text
MIT License

Copyright (c) 2025 Stack and Flow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Stack & Flow — skills con términos Apache-2.0

Copyright (c) 2025 Stack and Flow. Autor upstream declarado: `stack-and-flow`.

En la revisión consultada, estas skills declaran expresamente `Apache-2.0`; se conservan esos términos para su material original, sin aplicarles por defecto la licencia raíz MIT:

| Adaptación EGDEV | Fuente Stack & Flow |
| --- | --- |
| `skills/component-contributor/SKILL.md` | `skills/component-contributor/SKILL.md` |
| `skills/component-cataloging/SKILL.md` | `skills/component-spec-cataloging-validator/SKILL.md` |
| `skills/components-auditor/SKILL.md` | `skills/components-auditor/SKILL.md` |

Se incluye la [licencia Apache-2.0 completa](LICENSES/Apache-2.0.txt). No se encontró un archivo NOTICE adicional en el árbol versionado upstream consultado.

**Archivos modificados por EGDEV:** traducción al español y adaptación del flujo, responsabilidades, criterios Atomic, CSS BEM/Material, Radix individual, Storybook y límites de aprobación. El trabajo propio y las modificaciones de Enrique Gómez Navarro (2026) se ofrecen bajo MIT, sin eliminar las condiciones del material original. La sección 4 de Apache-2.0 permite términos distintos para modificaciones manteniendo sus requisitos de redistribución.

La revisión de origen de la primera adaptación no quedó registrada; no se inventa. Para este cierre se conservan tanto el aviso MIT de la documentación como los términos específicos Apache-2.0 de las skills identificadas en la revisión consultada. Esto documenta atribución y conservación de avisos, no una certificación jurídica ni autorización de publicación.

## Lucide — system icon paths

The system's Lucide-family SVG paths include:

- `packages/ui/src/atoms/icon/icon-paths.ts`: the 17 glyphs added in the Icon contract ([#58](https://github.com/egdev6/egdev-design-system/issues/58), decisions D2 and D8) are copied verbatim from `lucide-react` 1.55.0 (`grip` from `grip-vertical`, `flask` from `flask-conical`, `trash` from `trash-2`; the rest same-named). The 25 Foundation glyphs are copied verbatim from the EGDEV Foundation Icon preview, which uses the same Lucide-family paths.
- `packages/ui/src/atoms/spinner/Spinner.tsx`: the open arc is the Lucide `loader-circle` path, also used in the EGDEV Foundation Spinner design ([#69](https://github.com/egdev6/egdev-design-system/issues/69)).

These notices cover the system icon paths, including Icon and Spinner; no Lucide package is a dependency of `@egdev/ui`. Lucide marks some glyphs (including `calendar`, `check`, `minus`, `plus`, `trash-2` and `upload`) as derived from Feather; its full license, including the Feather notice, is reproduced below.

```text
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
