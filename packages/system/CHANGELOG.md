# Changelog

## Unreleased

## 0.4.0

- Regenerate the artifact and design reference for `@egdev/ui` 0.3.0 and `@egdev/tokens` 0.5.0:
  the Tabs `outline` variant, the ColorSwatchGroup picker look, the aligned Dialog and AlertDialog
  headers, the `--gradient-spectrum` token and the current package versions.
- The artifact test derives its naming types and token count from their sources, so it no longer
  needs hand-edited expectations when tokens or prop names change.

## 0.3.0

- Regenerate the artifact and design reference for `@egdev/ui` 0.2.0 and `@egdev/tokens` 0.4.0:
  new components and props (ColorSwatchGroup, AppIcon, Dialog and AlertDialog `headerLayout`,
  Panel `accentEdge` and the other 0.2.0 additions), the semantic contrast role tokens and the
  Antena navigation recipes.

## 0.2.0

- Compact the generated artifact without changing its JSON schema or consumers, and enforce a 768 KiB shipped JSON budget.
- Include source-rendered Logo mark and wordmark SVG assets with token inks in the artifact and design reference.
- Add reviewed card composition and Hero supplementary-content guidance with public-export drift validation.
- Add a static artboard token self-check with auditable traces and explicit gaps.
- Expose source-derived typography roles and token references in the artifact and generated design reference.
- Include source-derived template and section layout, CSS and custom-property facts in the artifact and design reference; mark dynamic class expressions unresolved.
- Lead the design reference with organisms-first composition and proposal guidance; expose source-derived component composition and catalog slots.
- Expose source-derived compound component parts and their documented children in the artifact and generated system reference.
- Add source-derived per-component visual anatomy and Surface usage to the artifact and generated reference.

## 0.1.0

- Introduce the versioned design-system data artifact.
