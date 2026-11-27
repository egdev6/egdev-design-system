# Changelog

## 0.13.0

### Added

- The source-derived artifact and reference list the `GalleryLightbox` composition recipe in the catalog, composed from
  Dialog, Carousel and PhotoFrame and not exported; no prop, recipe or other entry changes. (#575)
- The source-derived artifact and reference include `Embed` (its six props and static recipes), the
  `unavailable-content-fallback` naming concept (approved, with its receipt) and Embed among the users of two reused
  conventions. (#574)
- The source-derived artifact and reference include `Pagination` (its six props and static recipes), the `page-count`
  and `page-href` naming concepts (approved, with their receipt) and Pagination among the users of four reused
  conventions. (#571)
- The source-derived artifact and reference include `DetailHeader` (its props, static recipes and `classNameAllows`
  width set), the `content-metadata`, `content-tags` and `external-links` naming concepts (approved, with their
  receipt) and DetailHeader among the users of six reused conventions. (#572)
- The source-derived artifact and reference include `Breadcrumb` (its `items`, `label` and `onNavigate` props, the
  `BreadcrumbItem` entry type and its static recipes) and its usages of the approved `accessible-name`,
  `collection-items` and `navigation-intent` conventions. (#570)
- The source-derived artifact and reference include `EmptyState` (its props, static recipes and `className`
  allowance) and its five reused naming conventions. (#573)
- The source-derived artifact and reference include `Prose` (its props and static descendant recipe), the
  `--container-prose` token and the two reused naming conventions. (#569)
- The source-derived artifact lists `classNameAllows` for `HomeTemplateAnchor` (the thirteen published width, height
  and aspect-ratio properties); no prop, recipe or other entry changes. (#566)
- The source-derived artifact and reference include SectionNav's number and label recipes and the `items` description
  of its zero-padded numbers; existing props are unchanged. (#563)
- The artifact and design reference include Footer's `wrap` and `register` props, its `register` recipe axis and
  `footerWrapVariants`, and the `section-register` and `section-content-wrap` conventions widened to Footer; existing
  props and recipes are unchanged. (#561, #565)
- The artifact and design reference include Link's `quiet` variant: the widened `variant` description, a `quiet`
  entry in the recipe anatomy and the ink listed per variant, so the shared `linkVariants` base no longer carries
  `text-link-default`; every other Link prop is unchanged. (#562)
- The source-derived artifact and reference include ProjectCard's `statusBadge` slot and its
  `leading-status-badge` usage. (#558)
- The artifact and design reference include Carousel's `variant` prop and its current-slide emphasis recipes;
  existing props and recipes are unchanged. (#557)
- The source-derived artifact and reference include `StepMeter` (its props and static recipes), the `step-count`
  naming concept (approved, with its receipt) and the refreshed NowCard footer description. (#556)

## 0.12.0

### Added

- The source-derived artifact and reference include Dialog sheet layout options and their proposed naming
  concepts; the centered defaults, reserved `className` properties and sibling APIs remain unchanged. (#543)
- Record AlertDialog's container and overlay scope, both modal roots' independent pending-action
  props, their approved naming conventions and current source evidence. (#544)

## 0.11.0

### Fixed

- Attribute shared CVA recipes to the individual components that use them instead of every export
  from the same types file. (#547)

## 0.10.0

### Added

- The artifact and design reference include Text's `truncate` prop and the approved
  `single-line-text-truncation` convention. (#538)

### Changed

- Refreshed IconButton target and press recipes, composition spacing, and the documented ButtonGroup
  and Tabs target exceptions from the current UI sources. (#540)

## 0.9.0

### Added

- The artifact exposes each component's explicitly permitted additional `className` CSS properties
  as optional `classNameAllows` metadata. Refs #530

## 0.8.0

### Added

- The artifact and design reference include AttachmentField's `resetKey` prop and the
  `transient-feedback-reset-key` convention.

## 0.7.0

### Added

- The artifact and design reference include PhotoFrame's `fit` prop and the `image-fit` convention.

## 0.6.1

- Regenerate the artifact and design reference for the `@egdev/tokens` 0.6.1, `@egdev/ui` 0.5.1 and
  `@egdev/effects` 0.2.5 package versions.

## 0.6.0

### Added

- The artifact and design reference include AttachmentField, the Panel and Tabs `fill` props, the
  `host-fill` convention and four AttachmentField conventions.

## 0.5.0

### Added

- The artifact and design reference include the `--mask-scroll-fade-inline` token and updated Tabs
  anatomy.

### Fixed

- Same-file class constants now resolve in the artifact: Link, Panel parts and Textarea gain visual
  facts, while spurious unresolved entries disappear from Field, Surface and Tabs.

## 0.4.2

- No code changes. The tarball now ships this `CHANGELOG.md`, and `release:pack` records the release in `release.json` (commit, dirty flag, sha256), so `egdev-ds upgrade` can verify the set and show what changed.
- Regenerate the artifact for the 0.5.1/0.3.2/0.2.2 package versions.

## 0.4.1

- Regenerate the artifact and design reference for `@egdev/ui` 0.3.1 (Link underlined at rest,
  underline removed on hover, deprecated `underlined` variant) and `@egdev/effects` 0.2.1.

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
