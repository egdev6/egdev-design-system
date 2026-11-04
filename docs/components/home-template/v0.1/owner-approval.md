# HomeTemplate v0.1 — owner decisions

Status: contract, scoped compositor recipe, exact vignette token and naming approved; source-reference adoption approved with the limits below. No implementation plan or component implementation is approved.

## Binding

- Canonical spec: `spec.md`, version 0.1.
- Canonical payload SHA-256: `622eacf3cccb774690b6c247dcaf6e31a8feb4aa858376b00fd274438dc8eb84`.
- Hash method: exact whole heading `## 1. Purpose and scope` through EOF, including the final LF; metadata is excluded.
- Authority: actual primary-session owner questionnaire answers below, not a native code-review verdict or inferred permission.

## Separately selected answers

1. API, behavior and private-engine boundary (OD-1, OD-2): **"Aprobar ficha y frontera de motores"**.
2. Per-component compositor/renderer recipe (OD-3): **"Aprobar receta y adaptación acotadas"**. Exactly two fixed transparent canvases; only finite [0,1] numeric opacity custom properties inline, consumed by static CVA utilities; validated geometry and confinement inside the renderer; no CSS mask-image, inline gradients or stylesheet. No global styling exemption or changes to other components.
3. Exact future token authorization (OD-4): **"Autorizar el token exacto propuesto"**. The following declaration only, to be added during implementation under a separately approved plan, never to the compiled artifact by hand:

   ```css
   --gradient-vignette: radial-gradient(ellipse 120% 90% at 50% 45%, transparent 35%, rgba(0, 0, 0, 0.55) 75%, rgba(0, 0, 0, 0.92) 100%);
   ```

   Delivery: a decorative static CVA `bg-[image:var(--gradient-vignette)]` div after the ambient canvas; no component-authored gradient or inline paint. No other token or dependency approved.
4. Separate naming authorization: **"Aprobar las tres convenciones propuestas"**.

   | Semantic ID | Canonical name | Approved meaning |
   | --- | --- | --- |
   | `choreography-zone-table` | `zoneTable` | Ordered scroll-choreography zone table. |
   | `anchor-zone-binding` | `zone` | Bind a rendered HomeTemplateAnchor to its configured zone key. |
   | `zone-change` | `onZoneChange` | Notify initial/current active-zone identity changes, not per-frame progress. |

   Existing `guide-zones/zones`, `effect-profile/profile` and `effect-scene/scene` remain unchanged. This is not a catalog-wide migration. Future usages/receipts must bind the real reviewed type source, not an invented revision.

## Still pending

- Separate implementation plan approval after the specification gates close.
- No component, shared engine, theme, compiled tokens or registry has been changed by these records.
- Cleanup remains deferred to the final stage; no unrelated work or full-source publication is authorized.

## Source-reference adoption (OD-5)

Owner selected **"Adoptarlas con los límites documentados"**. This adopts VIS-01 through VIS-10 as intention references for the bound specification, not as approval or verification of a React implementation.

- Capture index SHA-256: `5d092aa9d776c6e633fc96e62e3ae0d879a69bae43f98e35420864960437db24`.
- Limits accepted: SwiftShader rather than hardware GPU; no pixel parity; settled FontFaceSet without per-family proof; one reduced-motion screenshot/flag without duration proof; 390px desktop-style layout viewport because the extracted source lacks viewport meta; no screen-reader or zoom claim.
- The capture index remains an immutable capture-time observation record. Adoption is recorded here rather than rewriting its original Proposed/Observed status.

| Visual ID | PNG SHA-256 |
| --- | --- |
| VIS-01 | `703c270ff89c20ef83f3e8dff93d7928677b5b1d93892c7d19f488ad63b4bc73` |
| VIS-02 | `df99e6efed2e620f8a36070c1749d3f70ee3515002fad09fa0557cb4d4d1a0ee` |
| VIS-03 | `bce13b60ba07ebfc793abc531fc654da748da040f8739ce09fea2e50da3f45bd` |
| VIS-04 | `db9360b444cffd070f35e6a130a90b321a2c07c8ceca2358fa42ca716b439f84` |
| VIS-05 | `57d68ba03eb8b88d900aaf92395a616700f74ec854336afa7ab84b5559276400` |
| VIS-06 | `20ace97937c27b64e53f2edd2d1a74ae6fdc9e037fbd20a107369eae729fa1b6` |
| VIS-07 | `2626dfa91e7f5a804dbaaba1d3c21296393ff01669cc430f0b7045513330a85d` |
| VIS-08 | `af5eb547243c63df6c00c5b393bade688d4d8d6cfe942c51d6a52ba0d3de7e45` |
| VIS-09 | `5ed434101e40d6e3b38bd4bee4cd90a4ffc882dde571fd7563e0f419372e94d8` |
| VIS-10 | `389b856bb6c5fce9edd72d93535ba2abcf36f8467b4df8e4481ad9acf2fa9541` |
