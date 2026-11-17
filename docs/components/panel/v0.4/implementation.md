# Panel v0.4 accent edge implementation

## Contract and usage

The [approved amendment](accent-edge-amendment.md) extends the existing Panel without changing its compound parts, frame ownership or default presentation. `accentEdge?: 'start'` opts into a passive edge at logical inline-start; omission or an invalid untyped value draws no edge. It is independent of `variant` and `tone`, adds no status or focus semantics, and does not replace a labelled section or its consumer-owned heading.

```tsx
<section aria-labelledby={headingId}>
  <Panel variant='banded' accentEdge='start'>
    <PanelHeader><Heading id={headingId} variant='compact'>Settings</Heading></PanelHeader>
    <PanelBody>Settings content</PanelBody>
  </Panel>
</section>
```

The root alone receives an opt-in, non-interactive `::before` decoration. Its logical placement mirrors with the writing direction, and its color and geometry use the existing `--color-fg-brand-default`, `--space-1`, `--border-width` and `--radius-xl` tokens. Framed Panels retain their Surface paint and use the framed inset and corners; `inherit` remains unpainted apart from the decoration and still requires a raised host. No stylesheet, new token, dependency, extra frame or inline component appearance is added.

A consumer can apply the complete `createAccentTheme` variable map to its own ancestor. Nested hosts and Panels remain independent, and a reset uses the complete default map. Theme and portal inheritance follow DOM ancestry. The `AccentEdge`, `ScopedAccentEdges` and `AccentEdgeOverlay` stories show the default, scoped LTR/RTL and genuinely floating overlay cases.

Root `className` remains limited to outer width/max-width, margin and grid/flex placement; part merges remain limited to content layout and alignment. It does not authorize edge, appearance, padding, radius or overflow overrides. With the edge enabled the root becomes positioned and may become the containing block for absolutely positioned descendants; without it the positioning behavior is unchanged. Keep focus rings visible and use text, icons or semantics for actual status.

## Verification status

The parent observed RED before implementation: the focused Panel and Storybook metadata command exited 1 with 31 failures among 457 tests; the edge classes, SSR output and prop metadata were absent. The tests now describe the intended behavior and packed CSS/React 18/19 consumer checks, but implementation GREEN, built-package checks and browser results must be observed separately.

The `panel-accent-edge` naming entry is a scoped **proposed** convention with reviewed Panel usage, not broader convention approval. No expected-design image or scoped visual adoption has been recorded. Chrome, Edge and Firefox must still verify real logical placement, continuous layering above bands, child focus and pointer interaction, nested theme changes, zoom, forced colors and overlay fallbacks. Visual conformity is **Not evaluated** until the required captures and adoption are available.
