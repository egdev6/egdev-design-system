## Composition guide

Start with an existing organism; otherwise use a molecule; otherwise compose molecules and atoms and propose a new organism.
Propose a new atom for anything that could be an atom or repeats across pieces. Follow docs/CATALOGACION.md: reuse → variant → compose → extract → new; record what was inspected and why earlier choices do not suffice. The agent proposes; the owner decides.
Map each template, section, organism and molecule approximation in the artboard with `data-component="Name"` (for example `data-component="WebTemplate"` and `data-component="WebSection"`). These markers do not render React.
Mark missing pieces with `data-proposal="organism:Name"` or `data-proposal="atom:Name"` and add an artboard note describing the need, reused pieces and cataloging rationale. Proposals are not approved components.
Use the catalog descriptions, source-derived Composes lists, parts and documented props/children as slots. These are static source facts, not an exhaustive runtime composition or permission to invent slots.
See Typography roles for source-derived font families and sizes; display headings and body copy have different recipes, and component overrides may differ.
- Session preview: When no existing organism or molecule fits, compose a Surface containing Badge, TerminalCard and Countdown; the walkthrough records this session preview. Surface supplies Material paint; respect each child's own treatment. (compositionRecipes[] · docs/odd/distribution/348-gentle-design-walkthrough.md · docs/MATERIAL.md · packages/ui/src/primitives/surface/types.ts)
- List row: Reuse ListItem with its Body, Leading, Content and Meta parts for an agenda row; its own Surface recipe supplies the frame. Use a surrounding Surface only when a separate group frame is needed, not as a replacement for ListItem's treatment. (compositionRecipes[] · docs/odd/distribution/348-gentle-design-walkthrough.md · packages/ui/src/molecules/list-item/types.ts · packages/ui/src/molecules/list-item/useListItem.ts)
- Media card: For a featured article link, reuse ArticleFeature and ArticleFeatureCover with PhotoFrame ratio=auto; ArticleFeature already uses the Surface raised frame. For a different passive media grouping, compose PhotoFrame and suitable content inside Surface rather than inventing a general card API. (compositionRecipes[] · packages/ui/src/molecules/article-feature/types.ts · docs/MATERIAL.md)
- Hero supplementary content: Place a registration count as sibling content beside or after Hero in the host section, for example a labelled Stat; do not put it in Hero children, which accept zero to two independent named actions, or decorative media. Stat owns its own Material treatment and the consumer formats the value. (compositionRecipes[] · packages/ui/src/organisms/hero/types.ts · packages/ui/src/atoms/stat/types.ts · packages/ui/src/organisms/web-section/types.ts)

## Header

# egdev-design-system
<!-- Generated from design-system.json. Do not edit. -->
Schema: 1.0.0 (schemaVersion)
| Package | Version | Source |
| --- | --- | --- |
| @egdev/effects | 0.1.0 | packages[] · packages/effects/package.json |
| @egdev/tokens | 0.3.0 | packages[] · packages/tokens/package.json |
| @egdev/ui | 0.1.0 | packages[] · packages/ui/package.json |
Re-run: `pnpm exec egdev-system-md --write`

## Typography roles

Representative source recipes, not a computed cascade; unresolved means no token was statically identified.
| Role | Font family | Size | Line height | Weight | Tracking | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Eyebrow | --font-display | --text-label-eyebrow | --text-label-eyebrow--line-height | --text-label-eyebrow--font-weight | --text-label-eyebrow--letter-spacing | typographyRoles[] · packages/ui/src/primitives/text/types.ts · packages/tokens/src/theme.css |
| Heading display | --font-display | --text-title-display | --text-title-display--line-height | --text-title-display--font-weight | --text-title-display--letter-spacing | typographyRoles[] · packages/ui/src/primitives/text/types.ts · packages/tokens/src/theme.css |
| Heading hero | --font-display | --text-title-hero | --text-title-hero--line-height | --text-title-hero--font-weight | --text-title-hero--letter-spacing | typographyRoles[] · packages/ui/src/primitives/text/types.ts · packages/tokens/src/theme.css |
| Heading section | --font-display | --text-title-section | --text-title-section--line-height | --text-title-section--font-weight | --text-title-section--letter-spacing | typographyRoles[] · packages/ui/src/primitives/text/types.ts · packages/tokens/src/theme.css |
| Heading show | --font-display | --text-title-show | --text-title-show--line-height | --text-title-show--font-weight | --text-title-show--letter-spacing | typographyRoles[] · packages/ui/src/primitives/text/types.ts · packages/tokens/src/theme.css |
| Hero lede | --font-sans | --text-body-large | --text-body-large--line-height | --text-body-large--font-weight | --text-body-large--letter-spacing | typographyRoles[] · packages/ui/src/organisms/hero/types.ts · packages/tokens/src/theme.css |
| ProjectCard code | --font-mono | --text-code | --text-code--line-height | --text-code--font-weight | --text-code--letter-spacing | typographyRoles[] · packages/ui/src/molecules/project-card/types.ts · packages/tokens/src/theme.css |
| SectionHeader lede | --font-sans | --text-body-muted | --text-body-muted--line-height | --text-body-muted--font-weight | --text-body-muted--letter-spacing | typographyRoles[] · packages/ui/src/molecules/section-header/types.ts · packages/tokens/src/theme.css |

## Colours

| Name | Value | Group | Usage | Source |
| --- | --- | --- | --- | --- |
| --color-action-primary-bg-default | var(--color-alpha-red-12) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-action-primary-bg-hover | var(--color-alpha-red-18) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-action-primary-fg | var(--color-primitive-white) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-action-primary-solid-bg | var(--color-primitive-red-neon) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-action-primary-solid-bg-hover | var(--color-primitive-red-light) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-action-primary-solid-fg | var(--color-primitive-black) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-black-25 | rgba(0, 0, 0, 0.25) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-black-42 | rgba(0, 0, 0, 0.42) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-07 | rgba(255, 0, 54, 0.07) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-10 | rgba(255, 0, 54, 0.10) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-12 | rgba(255, 0, 54, 0.12) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-15 | rgba(255, 0, 54, 0.15) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-18 | rgba(255, 0, 54, 0.18) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-22 | rgba(255, 0, 54, 0.22) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-30 | rgba(255, 0, 54, 0.30) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-45 | rgba(255, 0, 54, 0.45) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-red-65 | rgba(255, 0, 54, 0.65) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-white-07 | rgba(255, 255, 255, 0.07) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-alpha-white-08 | rgba(255, 255, 255, 0.08) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-ambient-bg | #060103 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-ambient-glow | #b40a1e | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-ambient-line | #950e20 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-ambient-line-glow | #4d000d | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-ambient-square | #e6001a | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-ambient-square-glow | #ff2244 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-bg-brand-hover | var(--color-alpha-red-18) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-bg-brand-subtle | var(--color-alpha-red-10) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-bg-canvas | var(--color-primitive-graphite-950) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-bg-deep | var(--logo-red-shade) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-bg-flood | var(--color-primitive-red-neon) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-bg-glass | var(--color-alpha-white-08) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-bg-scrim | var(--color-primitive-black) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-bg-surface | var(--color-surface-1) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-border-brand | var(--color-alpha-red-45) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-border-brand-strong | var(--color-primitive-red-dark) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-border-control | var(--color-primitive-graphite-500) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-border-default | var(--color-primitive-graphite-800) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-border-hairline | rgba(255, 255, 255, 0.08) | theme | Elevated surface | tokens[] · packages/tokens/src/theme.css |
| --color-border-hairline-strong | rgba(255, 255, 255, 0.14) | theme | Overlay | tokens[] · packages/tokens/src/theme.css |
| --color-border-subtle | var(--color-alpha-white-07) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-fg-brand-default | var(--color-primitive-red-neon) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-fg-brand-hover | var(--color-primitive-red-light) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-fg-brand-raised | var(--color-primitive-red-neon) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-fg-default | var(--color-primitive-white) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-fg-muted | var(--color-primitive-graphite-400) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-fg-on-flood | var(--color-primitive-black) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-fg-on-status | var(--color-primitive-black) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-fg-secondary | var(--color-primitive-neutral-200) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-focus-ring | var(--color-primitive-red-neon) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-focus-ring-inverse | var(--color-primitive-white) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-black | #000000 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-graphite-400 | #A1A2A8 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-graphite-500 | #7A7B81 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-graphite-750 | #2D2E33 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-graphite-800 | #2A2B30 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-graphite-850 | #232428 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-graphite-900 | #1B1C20 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-graphite-950 | #141518 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-neutral-200 | #CCCCCC | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-neutral-500 | #888888 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-neutral-600 | #6B6B6B | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-neutral-900 | #1A1A1A | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-neutral-950 | #0A0A0A | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-red-200 | #FF8FA6 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-red-300 | #FF6680 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-red-950 | #1F0006 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-red-dark | #CC002B | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-red-light | #FF335E | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-red-neon | #FF0036 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-primitive-white | #FFFFFF | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-status-danger | var(--color-primitive-red-300) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-status-danger-bg | color-mix(in srgb, var(--color-status-danger) 12%, transparent) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-status-info | #8AB4FF | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-status-success | #2DE2C4 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-status-warning | #FFB224 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-surface-0 | var(--color-primitive-graphite-950) | theme | Well | tokens[] · packages/tokens/src/theme.css |
| --color-surface-1 | var(--color-primitive-graphite-900) | theme | Elevated surface | tokens[] · packages/tokens/src/theme.css |
| --color-surface-2 | var(--color-primitive-graphite-850) | theme | Overlay | tokens[] · packages/tokens/src/theme.css |
| --color-surface-3 | var(--color-primitive-graphite-750) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --color-surface-overlay | rgba(35, 36, 40, 0.84) | theme | Overlay | tokens[] · packages/tokens/src/theme.css |

## Typography

| Name | Value | Group | Usage | Source |
| --- | --- | --- | --- | --- |
| --font-display | "Barlow Condensed", "Arial Narrow", sans-serif | theme |  | tokens[] · packages/tokens/src/theme.css |
| --font-mono | "JetBrains Mono", ui-monospace, monospace | theme |  | tokens[] · packages/tokens/src/theme.css |
| --font-sans | "Barlow", system-ui, sans-serif | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-default | 12.8px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-default--font-weight | 500 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-default--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-default--line-height | 1.6 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-large | 16px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-large--font-weight | 500 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-large--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-large--line-height | 1.6 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-muted | 16px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-muted--font-weight | 400 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-muted--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-body-muted--line-height | 1.6 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-code | 11.2px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-code--font-weight | 400 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-code--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-code--line-height | 1.6 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-countdown-md | clamp(41.6px, 4.8vw, 76.8px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-countdown-md--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-countdown-md--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-countdown-md--line-height | 0.85 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-countdown-sm | clamp(28.8px, 3.2vw, 44.8px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-countdown-sm--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-countdown-sm--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-countdown-sm--line-height | 0.85 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-cta-label | 12.8px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-cta-label--font-weight | 700 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-cta-label--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-cta-label--line-height | 1.2 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-hero | 44.8px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-hero--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-hero--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-hero--line-height | 1.1 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-pro | 51.2px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-pro--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-pro--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-pro--line-height | 0.95 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-show | 76.8px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-show--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-show--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-show--line-height | 0.9 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-stat | 28.8px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-stat--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-stat--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-stat--line-height | 1 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-stat-sm | 22.4px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-stat-sm--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-stat-sm--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-display-stat-sm--line-height | 1 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-heading-section | 32px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-heading-section--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-heading-section--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-heading-section--line-height | 1.2 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-heading-small | 19.2px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-heading-small--font-weight | 700 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-heading-small--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-heading-small--line-height | 1.2 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-label-default | 11.2px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-label-default--font-weight | 600 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-label-default--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-label-default--line-height | 1.2 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-label-eyebrow | 11.2px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-label-eyebrow--font-weight | 700 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-label-eyebrow--letter-spacing | 0.12em | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-label-eyebrow--line-height | 1.2 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-meta | 11.2px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-meta--font-weight | 600 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-meta--letter-spacing | 0.08em | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-meta--line-height | 1.3 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-nav-count | 11.5px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-nav-group | 14px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-nav-group--letter-spacing | 0.14em | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-nav-group--line-height | 1 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-nav-row | 13.5px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-quote-display | clamp(38.4px, 4.96vw, 80px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-quote-display--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-quote-display--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-quote-display--line-height | 0.86 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-quote-pull | clamp(15.2px, 1.36vw, 18.4px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-quote-pull--font-weight | 500 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-quote-pull--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-quote-pull--line-height | 1.4 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-shadow-title-hero | 0 0 40px var(--color-alpha-red-30) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-display | clamp(51.2px, 7.68vw, 131.2px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-display--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-display--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-display--line-height | 0.82 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-hero | clamp(48px, 7.2vw, 112px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-hero--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-hero--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-hero--line-height | 0.86 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-section | clamp(32px, 4.48vw, 51.2px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-section--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-section--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-section--line-height | 0.9 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-show | clamp(44.8px, 6.56vw, 105.6px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-show--font-weight | 800 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-show--letter-spacing | 0 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --text-title-show--line-height | 0.86 | theme |  | tokens[] · packages/tokens/src/theme.css |

## Spacing

| Name | Value | Group | Usage | Source |
| --- | --- | --- | --- | --- |
| --spacing-0 | var(--space-0) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-1 | var(--space-1) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-10 | var(--space-10) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-12 | var(--space-12) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-14 | var(--space-14) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-16 | var(--space-16) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-2 | var(--space-2) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-20 | var(--space-20) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-24 | var(--space-24) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-3 | var(--space-3) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-4 | var(--space-4) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-5 | var(--space-5) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-6 | var(--space-6) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-7 | var(--space-7) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-8 | var(--space-8) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-countdown-column | clamp(11.2px, 1.76vw, 25.6px) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --spacing-countdown-unit | 1.9ch | theme |  | tokens[] · packages/tokens/src/theme.css |

## Radius

| Name | Value | Group | Usage | Source |
| --- | --- | --- | --- | --- |
| --radius-2xl | 19.2px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --radius-full | 9999px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --radius-lg | 12.8px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --radius-md | 9.6px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --radius-none | 0px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --radius-sm | 3.2px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --radius-xl | 17.6px | theme |  | tokens[] · packages/tokens/src/theme.css |

## Shadows and effects

| Name | Value | Group | Usage | Source |
| --- | --- | --- | --- | --- |
| --shadow-btn-pressed | inset 0 2px 5px rgba(0, 0, 0, 0.4) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-btn-primary | inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 0 rgba(0, 0, 0, 0.28), 0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 22px -8px rgba(255, 0, 54, 0.7) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-btn-primary-hover | inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 0, 54, 0.35), 0 10px 30px -6px rgba(255, 0, 54, 0.75) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-card | 0 0 0 1px rgba(255, 0, 54, 0.12), 0 8px 40px 0 rgba(255, 0, 54, 0.12), inset 0 0 16px 0 rgba(255, 0, 54, 0.08) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-cta-hover | 0 0 16px 4px rgba(255, 0, 54, 0.35), 0 0 45px 10px rgba(255, 0, 54, 0.15), inset 0 0 16px 0 rgba(255, 0, 54, 0.08) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-edge | inset 0 1px 0 rgba(255, 255, 255, 0.07) | theme | Elevated surface | tokens[] · packages/tokens/src/theme.css |
| --shadow-edge-strong | inset 0 1px 0 rgba(255, 255, 255, 0.13) | theme | Overlay | tokens[] · packages/tokens/src/theme.css |
| --shadow-elev-1 | 0 1px 2px rgba(0, 0, 0, 0.7), 0 4px 14px -2px rgba(0, 0, 0, 0.55) | theme | Elevated surface | tokens[] · packages/tokens/src/theme.css |
| --shadow-elev-2 | 0 2px 4px rgba(0, 0, 0, 0.7), 0 14px 36px -6px rgba(0, 0, 0, 0.75) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-elev-3 | 0 4px 10px rgba(0, 0, 0, 0.7), 0 28px 70px -10px rgba(0, 0, 0, 0.9) | theme | Overlay | tokens[] · packages/tokens/src/theme.css |
| --shadow-focus | 0 0 0 2px #141518, 0 0 0 4px #FF0036 | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-glow-active | 0 8px 30px 0 rgba(255, 0, 54, 0.30) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-glow-base | 0 4px 20px 0 rgba(255, 0, 54, 0.15) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-glow-hot | 0 0 4px 1px rgba(255, 255, 255, 0.85), 0 0 18px 4px rgba(255, 0, 54, 0.75), 0 0 60px 12px rgba(255, 0, 54, 0.35) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-glow-intense | 0 0 22px 4px rgba(255, 0, 54, 0.65), 0 0 55px 8px rgba(255, 0, 54, 0.28) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-hot | inset 0 1px 0 rgba(255, 180, 195, 0.35), inset 0 0 0 1px rgba(255, 0, 54, 0.18), 0 2px 0 0 #7A0A1C, 0 5px 0 0 #3D050E, 0 18px 40px -10px rgba(0, 0, 0, 0.85), 0 0 50px -6px rgba(255, 0, 54, 0.45) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-ring-brand | 0 0 0 3px rgba(255, 0, 54, 0.22) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --shadow-well | inset 0 1px 2px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(0, 0, 0, 0.28) | theme | Well | tokens[] · packages/tokens/src/theme.css |
| --gradient-btn-primary | linear-gradient(180deg, #FF2D57 0%, #FF0036 52%, #EE0031 100%) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-btn-primary-hover | linear-gradient(180deg, #FF4A6E 0%, #FF1A49 52%, #F00033 100%) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-btn-secondary | linear-gradient(180deg, rgba(255, 0, 54, 0.20) 0%, rgba(255, 0, 54, 0.08) 100%) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-btn-secondary-hover | linear-gradient(180deg, rgba(255, 0, 54, 0.30) 0%, rgba(255, 0, 54, 0.13) 100%) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-chip-active | linear-gradient(180deg, rgba(255, 0, 54, 0.24), rgba(255, 0, 54, 0.09)) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-glass-card | linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.015) 45%) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-hot | radial-gradient(120% 80% at 85% -10%, rgba(255, 0, 54, 0.26), transparent 55%), linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0) 40%), #22121A | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-post-new | linear-gradient(180deg, rgba(255, 0, 54, 0.11), rgba(255, 0, 54, 0.03) 60%) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-progress | linear-gradient(180deg, #FF4A6E, #FF0036 60%, #D9002D) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-section-show | radial-gradient(45% 55% at 22% 50%, var(--color-alpha-red-12), transparent 70%) | root |  | tokens[] · packages/tokens/src/theme.css |
| --gradient-sheen | linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0) 42%) | root | Elevated surface | tokens[] · packages/tokens/src/theme.css |
| --gradient-vignette | radial-gradient(ellipse 120% 90% at 50% 45%, transparent 35%, rgba(0, 0, 0, 0.55) 75%, rgba(0, 0, 0, 0.92) 100%) | root |  | tokens[] · packages/tokens/src/theme.css |
| --blur-glass | 16px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --blur-overlay | 20px | theme | Overlay | tokens[] · packages/tokens/src/theme.css |
| --ease-out | cubic-bezier(0.2, 0.8, 0.2, 1) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --ease-overshoot | cubic-bezier(0.34, 1.56, 0.64, 1) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --ease-snappy | cubic-bezier(0.4, 0, 0.2, 1) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --ease-spring | cubic-bezier(0.34, 1.56, 0.64, 1) | theme |  | tokens[] · packages/tokens/src/theme.css |
| --duration-base | 300ms | root |  | tokens[] · packages/tokens/src/theme.css |
| --duration-fast | 200ms | root |  | tokens[] · packages/tokens/src/theme.css |
| --duration-press | 90ms | root |  | tokens[] · packages/tokens/src/theme.css |
| --duration-reveal | 560ms | root |  | tokens[] · packages/tokens/src/theme.css |
| --duration-wipe | 800ms | root |  | tokens[] · packages/tokens/src/theme.css |

## Material rules

- Elevated surface: Tonal raised surface with sheen, edge light and two-layer elevation. --color-surface-1: var(--color-primitive-graphite-900), --gradient-sheen: linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0) 42%), --color-border-hairline: rgba(255, 255, 255, 0.08), --shadow-edge: inset 0 1px 0 rgba(255, 255, 255, 0.07), --shadow-elev-1: 0 1px 2px rgba(0, 0, 0, 0.7), 0 4px 14px -2px rgba(0, 0, 0, 0.55) (materialRecipes[] · docs/MATERIAL.md; tokens[] · packages/tokens/src/theme.css)
- Overlay: Translucent floating surface with solid reduced-transparency fallback. --color-surface-overlay: rgba(35, 36, 40, 0.84), --blur-overlay: 20px, --color-border-hairline-strong: rgba(255, 255, 255, 0.14), --shadow-edge-strong: inset 0 1px 0 rgba(255, 255, 255, 0.13), --shadow-elev-3: 0 4px 10px rgba(0, 0, 0, 0.7), 0 28px 70px -10px rgba(0, 0, 0, 0.9), --color-surface-2: var(--color-primitive-graphite-850) (materialRecipes[] · docs/MATERIAL.md; tokens[] · packages/tokens/src/theme.css)
- Well: Recessed fill. --color-surface-0: var(--color-primitive-graphite-950), --shadow-well: inset 0 1px 2px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(0, 0, 0, 0.28) (materialRecipes[] · docs/MATERIAL.md; tokens[] · packages/tokens/src/theme.css)

## Components

### AppShell
catalog[] · docs/catalog.json · @egdev/ui · template · —
- AppShell (components[] · packages/ui/src/templates/app-shell/types.ts)
  - Catalog composition / slots: Sidebar, ModuleRail, TabBar (catalog[] · docs/catalog.json)
  - Composes: Button (packages/ui/src/templates/app-shell/AppShell.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - appShellBodyVariants base: flex → 
    - appShellBodyVariants base: flex-1 → 
    - appShellBottomVariants base: sticky → 
    - appShellBottomVariants base: bottom-0 → 
    - appShellMainVariants base: min-w-0 → 
    - appShellMainVariants base: flex-1 → 
    - appShellRootVariants base: flex → 
    - appShellRootVariants base: min-h-dvh → 
    - appShellRootVariants base: w-full → 
    - appShellRootVariants base: flex-col → 
    - appShellRootVariants base: bg-bg-canvas → --color-bg-canvas
    - appShellRootVariants base: font-sans → --font-sans
    - appShellSideVariants base: sticky → 
    - appShellSideVariants base: top-0 → 
    - appShellSideVariants base: h-dvh → 
    - appShellSkipLinkVariants base: m-2 → --spacing-2
    - appShellSkipRowVariants arrangement=switching: hidden → 
    - Layout source: `cn(appShellVariants.skipLink())` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.skipLink() → unresolved
    - Layout source: `cn(appShellVariants.root(), className)` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.root() → unresolved
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: className → unresolved
    - Layout source: `cn(appShellVariants.skip({ arrangement }))` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.skip({ arrangement }) → unresolved
    - Layout source: `cn(appShellVariants.body())` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.body() → unresolved
    - Layout source: `cn(appShellVariants.side({ arrangement }))` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.side({ arrangement }) → unresolved
    - Layout source: `cn(appShellVariants.main())` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.main() → unresolved
    - Layout source: `cn(appShellVariants.bottom({ arrangement }))` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.bottom({ arrangement }) → unresolved
    - Layout source: `{s.showSkipRow && ( <div className={s.skipRowClass}> <Button variant='secondary' asChild={true} className={s.skipLinkClass}> <a href={s.skipHref} onClick={s.onSkipClick}> {s.skipLabel} </a> </Button> </div> )}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.skipRowClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.skipRowClass → unresolved
    - Layout source: `className={s.skipLinkClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.skipLinkClass → unresolved
    - Layout source: `{s.skipLabel}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.bodyClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.bodyClass → unresolved
    - Layout source: `{s.sideNavigation != null && <div className={s.sideClass}>{s.sideNavigation}</div>}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.sideClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.sideClass → unresolved
    - Layout source: `{s.sideNavigation}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.mainClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.mainClass → unresolved
    - Layout source: `{s.children}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `{s.bottomNavigation != null && <div className={s.bottomClass}>{s.bottomNavigation}</div>}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.bottomClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.bottomClass → unresolved
    - Layout source: `{s.bottomNavigation}` · packages/ui/src/templates/app-shell/AppShell.tsx
  - bottomNavigation: ReactNode; Docked bottom navigation region, such as a TabBar. Shown below the 56rem viewport threshold when sideNavigation is also supplied, and at every width when it is the only navigation. (components[] · packages/ui/src/templates/app-shell/types.ts)
  - children: ReactNode; Content of the view's single main landmark, without page padding or max-width. It must not contain another main landmark. (components[] · packages/ui/src/templates/app-shell/types.ts)
  - messages: AppShellMessages; Localizable built-in text. Omitted entries fall back to the documented English default. (components[] · packages/ui/src/templates/app-shell/types.ts)
  - sideNavigation: ReactNode; Docked side navigation region, such as a Sidebar or ModuleRail. Its organism owns width, Material and navigation behavior; the shell owns docking, full-height placement and responsive visibility. (components[] · packages/ui/src/templates/app-shell/types.ts)
### HomeTemplate
catalog[] · docs/catalog.json · @egdev/effects · template · —
- HomeTemplate (components[] · packages/effects/src/home-template/types.ts)
  - Catalog composition / slots: Private Isotipo3D and AmbientBackground engines; consumer content (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - children: ReactNode; Consumer page content; see the Default story. (components[] · packages/effects/src/home-template/types.ts)
  - onZoneChange: ((change: { zone: string; previous: string \| null; }) => void); Notify active zone identity changes; see the ActiveZoneCallback story. (components[] · packages/effects/src/home-template/types.ts)
  - zoneTable: readonly HomeTemplateZone[]; Ordered scroll-choreography zones; see the Default story. (components[] · packages/effects/src/home-template/types.ts)
### SectionShell
catalog[] · docs/catalog.json · @egdev/ui · template · —
- SectionShell (components[] · packages/ui/src/templates/section-shell/types.ts)
  - Catalog composition / slots: Host-supplied children; host-composed group fades (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - sectionShellVariants base: box-border → 
    - sectionShellVariants base: relative → 
    - sectionShellVariants base: isolate → 
    - sectionShellVariants base: flex → 
    - sectionShellVariants base: flex-col → 
    - sectionShellVariants base: justify-center → 
    - sectionShellVariants base: min-h-[var(--section-min-height)] → --section-min-height
    - sectionShellVariants base: pt-[calc(var(--nav-height)+var(--space-8))] → --nav-height, --space-8
    - sectionShellVariants base: pb-8 → --spacing-8
    - sectionShellVariants base: shadow-none → unresolved
    - sectionShellVariants register=pro: bg-transparent → 
    - sectionShellVariants register=pro: bg-none → 
    - sectionShellVariants register=show: bg-transparent → 
    - sectionShellVariants register=show: bg-[image:var(--gradient-section-show)] → --gradient-section-show
    - sectionShellVariants register=flood: bg-bg-flood → --color-bg-flood
    - sectionShellVariants register=flood: bg-none → 
    - sectionShellVariants register=deep: bg-bg-deep → --color-bg-deep
    - sectionShellVariants register=deep: bg-none → 
    - sectionShellVariants register=grafito: bg-surface-0/50 → --color-surface-0
    - sectionShellVariants register=grafito: bg-none → 
    - sectionShellVariants register=grafito: [@media(prefers-reduced-transparency:reduce)]:bg-surface-0 → --color-surface-0
    - sectionShellVariants wrap=false: [&>*]:w-auto → 
    - sectionShellWrapVariants base: box-border → 
    - sectionShellWrapVariants base: w-full → 
    - sectionShellWrapVariants base: max-w-[var(--content-max)] → --content-max
    - sectionShellWrapVariants base: mx-auto → 
    - sectionShellWrapVariants base: px-[var(--gutter)] → --gutter
    - Layout source: `cn(sectionShellVariants({ register, wrap }), className)` · packages/ui/src/templates/section-shell/useSectionShell.ts
    - Layout packages/ui/src/templates/section-shell/useSectionShell.ts: sectionShellVariants({ register, wrap }) → unresolved
    - Layout packages/ui/src/templates/section-shell/useSectionShell.ts: className → unresolved
    - Layout source: `cn(sectionShellWrapVariants())` · packages/ui/src/templates/section-shell/useSectionShell.ts
    - Layout packages/ui/src/templates/section-shell/useSectionShell.ts: sectionShellWrapVariants() → unresolved
    - Layout source: `{s.wrap ? <div className={s.wrapClass}>{s.children}</div> : s.children}` · packages/ui/src/templates/section-shell/SectionShell.tsx
    - Layout source: `className={s.wrapClass}` · packages/ui/src/templates/section-shell/SectionShell.tsx
    - Layout packages/ui/src/templates/section-shell/SectionShell.tsx: s.wrapClass → unresolved
    - Layout source: `{s.children}` · packages/ui/src/templates/section-shell/SectionShell.tsx
  - children: ReactNode; Host-supplied content in reading order. (components[] · packages/ui/src/templates/section-shell/types.ts)
  - register: enum; Coordinated visual register for this section. (components[] · packages/ui/src/templates/section-shell/types.ts)
  - wrap: boolean; Supply a centered content wrapper with page gutters; disable for self-wrapped content. (components[] · packages/ui/src/templates/section-shell/types.ts)
### WebTemplate
catalog[] · docs/catalog.json · @egdev/ui · template · —
- WebTemplate (components[] · packages/ui/src/templates/web-template/types.ts)
  - Catalog composition / slots: Consumer-supplied TopBar, content and Footer (catalog[] · docs/catalog.json)
  - Composes: Button (packages/ui/src/templates/web-template/WebTemplate.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - webTemplateTopBarVariants base: min-h-[var(--nav-height)] → --nav-height
    - Layout source: `cn(webTemplateVariants(), className)` · packages/ui/src/templates/web-template/useWebTemplate.ts
    - Layout packages/ui/src/templates/web-template/useWebTemplate.ts: webTemplateVariants() → unresolved
    - Layout packages/ui/src/templates/web-template/useWebTemplate.ts: className → unresolved
    - Layout source: `cn(appShellVariants.skip())` · packages/ui/src/templates/web-template/useWebTemplate.ts
    - Layout packages/ui/src/templates/web-template/useWebTemplate.ts: appShellVariants.skip() → unresolved
    - Layout source: `cn(appShellVariants.skipLink())` · packages/ui/src/templates/web-template/useWebTemplate.ts
    - Layout packages/ui/src/templates/web-template/useWebTemplate.ts: appShellVariants.skipLink() → unresolved
    - Layout source: `cn(webTemplateTopBarVariants())` · packages/ui/src/templates/web-template/useWebTemplate.ts
    - Layout packages/ui/src/templates/web-template/useWebTemplate.ts: webTemplateTopBarVariants() → unresolved
    - Layout source: `className={page.skipClass}` · packages/ui/src/templates/web-template/WebTemplate.tsx
    - Layout packages/ui/src/templates/web-template/WebTemplate.tsx: page.skipClass → unresolved
    - Layout source: `className={page.skipLinkClass}` · packages/ui/src/templates/web-template/WebTemplate.tsx
    - Layout packages/ui/src/templates/web-template/WebTemplate.tsx: page.skipLinkClass → unresolved
    - Layout source: `{page.skipLabel}` · packages/ui/src/templates/web-template/WebTemplate.tsx
    - Layout source: `{page.topBar != null && <div className={page.topBarClass}>{page.topBar}</div>}` · packages/ui/src/templates/web-template/WebTemplate.tsx
    - Layout source: `className={page.topBarClass}` · packages/ui/src/templates/web-template/WebTemplate.tsx
    - Layout packages/ui/src/templates/web-template/WebTemplate.tsx: page.topBarClass → unresolved
    - Layout source: `{page.topBar}` · packages/ui/src/templates/web-template/WebTemplate.tsx
    - Layout source: `{page.content}` · packages/ui/src/templates/web-template/WebTemplate.tsx
    - Layout source: `{page.footer}` · packages/ui/src/templates/web-template/WebTemplate.tsx
  - content: ReactNode; Content of the owned main landmark, without another main. (components[] · packages/ui/src/templates/web-template/types.ts)
  - footer: ReactNode; Consumer footer rendered without another wrapper. (components[] · packages/ui/src/templates/web-template/types.ts)
  - messages: AppShellMessages; Localized skip link text; omitted entries use Skip to content. (components[] · packages/ui/src/templates/web-template/types.ts)
  - topBar: ReactNode; Consumer page header; nullish values omit the clearance host. (components[] · packages/ui/src/templates/web-template/types.ts)
### BlogGrid
catalog[] · docs/catalog.json · @egdev/ui · organism · — (native list)
- BlogGrid (components[] · packages/ui/src/organisms/blog-grid/types.ts)
  - Catalog composition / slots: Consumer ArticleFeature, editorial ListItem and Link (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - BlogGridArchive: Wrap the independent archive link. Children: Archive slot: supply one independent named link. The standalone archive link. (components[].parts · packages/ui/src/organisms/blog-grid/BlogGrid.tsx)
  - BlogGridFeature: Wrap one ArticleFeature whole-card link. Children: Feature slot: supply one whole-card ArticleFeature link. The consumer's featured article element. (components[].parts · packages/ui/src/organisms/blog-grid/BlogGrid.tsx)
  - BlogGridRow: Wrap one editorial anchor in a native list item. Children: Row slot: supply one editorial ListItem slotted onto an anchor. One editorial ListItem rendered as an anchor. (components[].parts · packages/ui/src/organisms/blog-grid/BlogGrid.tsx)
  - BlogGridRows: Render a semantic list only when rows are present. Children: List slot: supply zero or more keyed BlogGridRow parts. Editorial rows in reading order; an empty collection omits the list. (components[].parts · packages/ui/src/organisms/blog-grid/BlogGrid.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - blogGridRowsVariants base: gap-3 → --spacing-3
    - blogGridRowsVariants base: p-0 → --spacing-0
    - blogGridVariants base: gap-x-5 → --spacing-5
    - blogGridVariants base: gap-y-0 → --spacing-0
    - blogGridVariants base: [@media(width<=1080px)]:gap-y-5 → --spacing-5
  - children: ReactNode; One feature and rows part, followed by an optional archive part. (components[] · packages/ui/src/organisms/blog-grid/types.ts)
### CalendarGrid
catalog[] · docs/catalog.json · @egdev/ui · organism · — (Move menu, no drag dependency)
- CalendarGrid (components[] · packages/ui/src/organisms/calendar-grid/types.ts)
  - Catalog composition / slots: ListItem, Menu, IconButton, Icon, VisuallyHidden (catalog[] · docs/catalog.json)
  - Composes: Icon (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), IconButton (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), ListItem (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), ListItemActions (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), ListItemBody (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), ListItemContent (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), ListItemFooter (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), ListItemMeta (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), Menu (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx), VisuallyHidden (packages/ui/src/organisms/calendar-grid/CalendarGrid.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - calendarGridAddVariants base: rounded-md → --radius-md
    - calendarGridAddVariants base: focus-visible:shadow-focus → --shadow-focus
    - calendarGridDayNumberVariants base: font-display → --font-display
    - calendarGridDayNumberVariants base: text-heading-small → --text-heading-small
    - calendarGridDayVariants base: gap-2 → --spacing-2
    - calendarGridDayVariants base: p-2 → --spacing-2
    - calendarGridDayVariants base: rounded-lg → --radius-lg
    - calendarGridEntryListVariants base: p-0 → --spacing-0
    - calendarGridEntryListVariants base: gap-2 → --spacing-2
    - calendarGridHeaderRowVariants base: gap-2 → --spacing-2
    - calendarGridHeaderVariants base: gap-2 → --spacing-2
    - calendarGridHeaderVariants base: pt-1 → --spacing-1
    - calendarGridHeaderVariants base: px-0.5 → --spacing
    - calendarGridHeaderVariants base: pb-2 → --spacing-2
    - calendarGridLinkVariants base: rounded-sm → --radius-sm
    - calendarGridLinkVariants base: focus-visible:shadow-focus → --shadow-focus
    - calendarGridListVariants base: p-0 → --spacing-0
    - calendarGridListVariants base: gap-2 → --spacing-2
    - calendarGridMetaVariants base: text-label-default → --text-label-default
    - calendarGridTodayVariants base: font-display → --font-display
    - calendarGridTodayVariants base: text-meta → --text-meta
    - calendarGridVariants base: font-sans → --font-sans
    - calendarGridWeekdayVariants base: font-display → --font-display
    - calendarGridWeekdayVariants base: text-meta → --text-meta
  - items: CalendarGridDay[]; Ordered days, 1-7, rendered as equal columns or stacked lanes. (components[] · packages/ui/src/organisms/calendar-grid/types.ts)
  - label: string; Accessible name of the planning region, such as Week of October 5. (components[] · packages/ui/src/organisms/calendar-grid/types.ts)
  - level: enum; Rank of the day headings. (components[] · packages/ui/src/organisms/calendar-grid/types.ts)
  - messages: CalendarGridMessages; Localizable built-in text and formatters. (components[] · packages/ui/src/organisms/calendar-grid/types.ts)
  - onAdd: ((date: string) => void); Add request for a day's ISO date; supplying it renders the add controls. (components[] · packages/ui/src/organisms/calendar-grid/types.ts)
  - onMove: ((entry: CalendarGridEntry, date: string) => void); Move request for an entry to another date; supplying it renders the move menus. (components[] · packages/ui/src/organisms/calendar-grid/types.ts)
  - onNavigate: ((entry: CalendarGridEntry, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void); Entry link activation; preventDefault lets a router handle the navigation. (components[] · packages/ui/src/organisms/calendar-grid/types.ts)
### ChapterBreak
catalog[] · docs/catalog.json · @egdev/ui · organism · —
- ChapterBreak (components[] · packages/ui/src/organisms/chapter-break/types.ts)
  - Catalog composition / slots: Heading, Text; host SectionShell and consumer media (catalog[] · docs/catalog.json)
  - Composes: Heading (packages/ui/src/organisms/chapter-break/ChapterBreak.tsx), Text (packages/ui/src/organisms/chapter-break/ChapterBreak.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - chapterBreakGridVariants base: gap-10 → --spacing-10
    - chapterBreakGridVariants media=true: [@media(width<=860px)]:gap-2 → --spacing-2
    - chapterBreakLedeVariants base: font-sans → --font-sans
    - chapterBreakLedeVariants base: text-body-large → --text-body-large
    - chapterBreakVariants base: font-sans → --font-sans
  - accent: string; Optional trailing highlighted heading text. (components[] · packages/ui/src/organisms/chapter-break/types.ts)
  - eyebrow: string; Optional chapter context. (components[] · packages/ui/src/organisms/chapter-break/types.ts)
  - id: string; Unique heading ID supplied by the host for its section label. (components[] · packages/ui/src/organisms/chapter-break/types.ts)
  - lede: string; Optional introductory paragraph. (components[] · packages/ui/src/organisms/chapter-break/types.ts)
  - level: enum; Host-selected heading rank. (components[] · packages/ui/src/organisms/chapter-break/types.ts)
  - media: ReactNode; Decorative, non-focusable media, never the sole source of meaning. (components[] · packages/ui/src/organisms/chapter-break/types.ts)
  - title: string; Main heading text; include trailing whitespace when the accent needs a separator. (components[] · packages/ui/src/organisms/chapter-break/types.ts)
### Closing
catalog[] · docs/catalog.json · @egdev/ui · organism · —
- Closing (components[] · packages/ui/src/organisms/closing/types.ts)
  - Catalog composition / slots: Heading, Text; consumer Button, Link and SectionShell (catalog[] · docs/catalog.json)
  - Composes: Heading (packages/ui/src/organisms/closing/Closing.tsx), Text (packages/ui/src/organisms/closing/Closing.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - closingActionsVariants base: gap-3 → --spacing-3
    - closingGridVariants base: gap-10 → --spacing-10
    - closingGridVariants media=true: [@media(width<=860px)]:gap-2 → --spacing-2
    - closingLedeVariants base: font-sans → --font-sans
    - closingLedeVariants base: text-body-large → --text-body-large
    - closingVariants base: font-sans → --font-sans
  - accent: string; Optional trailing highlighted heading text. (components[] · packages/ui/src/organisms/closing/types.ts)
  - children: ReactNode; One to three independent, named CTA controls; consumers own targets and accessibility. (components[] · packages/ui/src/organisms/closing/types.ts)
  - eyebrow: string; Optional context above the heading. (components[] · packages/ui/src/organisms/closing/types.ts)
  - id: string; Native heading ID, supplied uniquely by the host for its section label. (components[] · packages/ui/src/organisms/closing/types.ts)
  - lede: string; Optional introductory paragraph. (components[] · packages/ui/src/organisms/closing/types.ts)
  - level: enum; Heading rank chosen by the host. (components[] · packages/ui/src/organisms/closing/types.ts)
  - media: ReactNode; Optional decorative, non-focusable media; never interactive or the sole source of meaning. (components[] · packages/ui/src/organisms/closing/types.ts)
  - title: string; Main heading text. Supply trailing whitespace when the accent needs a separator. (components[] · packages/ui/src/organisms/closing/types.ts)
### Footer
catalog[] · docs/catalog.json · @egdev/ui · organism · — (native footer and navigation)
- Footer (components[] · packages/ui/src/organisms/footer/types.ts)
  - Catalog composition / slots: Link; consumer Logo and SocialLinks (catalog[] · docs/catalog.json)
  - Composes: Link (packages/ui/src/organisms/footer/Footer.tsx)
  - FooterBrand: Consumer-owned brand and optional tagline. Children: Brand identity and optional tagline. Named brand element and optional descriptive copy, without nested anchors. The consumer owns link contrast and target size (44px recommended); Footer sizes its own navigation links to 44px. (components[].parts · packages/ui/src/organisms/footer/Footer.tsx)
  - FooterLegal: Consumer legal and credit row. Children: Consumer legal and credit content in reading order. Legal text and optional links supplied by the host. The consumer owns link contrast and target size (44px recommended); Footer sizes its own navigation links to 44px. (components[].parts · packages/ui/src/organisms/footer/Footer.tsx)
  - FooterMotto: Non-interactive motto stage. Children: Motto stage containing one non-interactive consumer Text element. One non-interactive Text element, including any consumer-owned accent. (components[].parts · packages/ui/src/organisms/footer/Footer.tsx)
  - FooterNavigation: Named section navigation with the Footer-local link target exception. Children: Section navigation with a visible heading and ordered destinations. (components[].parts · packages/ui/src/organisms/footer/Footer.tsx)
  - FooterSocial: Social heading and separately named list supplied by the consumer. Children: Consumer social heading and named SocialLinks list. Consumer heading and configured SocialLinks; use a list label and caption={null}. The consumer owns link contrast and target size (44px recommended); Footer sizes its own navigation links to 44px. (components[].parts · packages/ui/src/organisms/footer/Footer.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - footerGridVariants base: gap-x-10 → --spacing-10
    - footerGridVariants base: gap-y-8 → --spacing-8
    - footerGridVariants base: pt-10 → --spacing-10
    - footerHeadingVariants base: font-display → --font-display
    - footerHeadingVariants base: text-label-eyebrow → --text-label-eyebrow
    - footerLegalVariants base: gap-4 → --spacing-4
    - footerLegalVariants base: pt-4 → --spacing-4
    - footerLegalVariants base: text-body-default → --text-body-default
    - footerListVariants base: p-0 → --spacing-0
    - footerMottoVariants base: px-0 → --spacing-0
    - footerMottoVariants base: pt-10 → --spacing-10
    - footerMottoVariants base: pb-8 → --spacing-8
    - footerVariants base: p-0 → --spacing-0
    - footerVariants base: pb-8 → --spacing-8
    - footerVariants base: font-sans → --font-sans
  - children: ReactNode; Optional named parts, each at most once in the documented order. (components[] · packages/ui/src/organisms/footer/types.ts)
### Hero
catalog[] · docs/catalog.json · @egdev/ui · organism · —
- Hero (components[] · packages/ui/src/organisms/hero/types.ts)
  - Catalog composition / slots: Heading, Text, Button, SocialLinks; host SectionShell; consumer media (catalog[] · docs/catalog.json)
  - Composes: Heading (packages/ui/src/organisms/hero/Hero.tsx), Text (packages/ui/src/organisms/hero/Hero.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - heroActionsVariants base: gap-3 → --spacing-3
    - heroLedeVariants base: font-sans → --font-sans
    - heroLedeVariants base: text-body-large → --text-body-large
    - heroVariants base: px-0 → --spacing-0
    - heroVariants base: gap-8 → --spacing-8
    - heroVariants base: font-sans → --font-sans
    - heroVariants media=true: [@media(width<=860px)]:gap-4 → --spacing-4
  - accent: string; Optional trailing heading accent. (components[] · packages/ui/src/organisms/hero/types.ts)
  - children: ReactNode; Zero to two independent named actions; at most one primary. (components[] · packages/ui/src/organisms/hero/types.ts)
  - eyebrow: string; Optional context above the heading. (components[] · packages/ui/src/organisms/hero/types.ts)
  - id: string; Unique heading ID for the host section's aria-labelledby. (components[] · packages/ui/src/organisms/hero/types.ts)
  - lede: string; Optional introductory paragraph. (components[] · packages/ui/src/organisms/hero/types.ts)
  - level: enum; Heading rank selected by the host. (components[] · packages/ui/src/organisms/hero/types.ts)
  - media: ReactNode; Decorative nonfocusable media, never the sole source of meaning. (components[] · packages/ui/src/organisms/hero/types.ts)
  - social: ReactNode; Consumer-named social profile links. (components[] · packages/ui/src/organisms/hero/types.ts)
  - title: string; Main heading text. Supply trailing whitespace before an accent when needed. (components[] · packages/ui/src/organisms/hero/types.ts)
### LabStage
catalog[] · docs/catalog.json · @egdev/ui · organism · —
- LabStage (components[] · packages/ui/src/organisms/lab-stage/types.ts)
  - Catalog composition / slots: Heading, Text; host SectionShell; consumer Surface, Badge, Link and media (catalog[] · docs/catalog.json)
  - Composes: Heading (packages/ui/src/organisms/lab-stage/LabStage.tsx), Text (packages/ui/src/organisms/lab-stage/LabStage.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - labStageGridVariants base: gap-10 → --spacing-10
    - labStageGridVariants media=true: [@media(width<=860px)]:gap-2 → --spacing-2
    - labStageLedeVariants base: font-sans → --font-sans
    - labStageLedeVariants base: text-body-large → --text-body-large
    - labStageVariants base: font-sans → --font-sans
  - accent: string; Optional trailing highlighted heading text. (components[] · packages/ui/src/organisms/lab-stage/types.ts)
  - children: ReactNode; Consumer-owned experiment content and semantics. (components[] · packages/ui/src/organisms/lab-stage/types.ts)
  - eyebrow: string; Optional context above the heading. (components[] · packages/ui/src/organisms/lab-stage/types.ts)
  - id: string; Native heading ID, uniquely supplied by the host. (components[] · packages/ui/src/organisms/lab-stage/types.ts)
  - lede: string; Optional introductory paragraph. (components[] · packages/ui/src/organisms/lab-stage/types.ts)
  - level: enum; Heading rank selected by the host. (components[] · packages/ui/src/organisms/lab-stage/types.ts)
  - media: ReactNode; Decorative, non-focusable media, never interactive or the sole source of meaning. (components[] · packages/ui/src/organisms/lab-stage/types.ts)
  - title: string; Main heading text; supply trailing whitespace before an accent when needed. (components[] · packages/ui/src/organisms/lab-stage/types.ts)
### ModuleRail
catalog[] · docs/catalog.json · @egdev/ui · organism · Tooltip + VisuallyHidden
- ModuleRail (components[] · packages/ui/src/organisms/module-rail/types.ts)
  - Catalog composition / slots: Icon, IconButton, StatusDot, Surface recipe; consumer identity (catalog[] · docs/catalog.json)
  - Composes: Icon (packages/ui/src/organisms/module-rail/ModuleRail.tsx), IconButton (packages/ui/src/organisms/module-rail/ModuleRail.tsx), StatusDot (packages/ui/src/organisms/module-rail/ModuleRail.tsx), Tooltip (packages/ui/src/organisms/module-rail/ModuleRail.tsx), VisuallyHidden (packages/ui/src/organisms/module-rail/ModuleRail.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - moduleRailVariants base: gap-2 → --spacing-2
    - moduleRailVariants base: py-4 → --spacing-4
    - railLinkVariants base: rounded-md → --radius-md
    - railLinkVariants base: focus-visible:shadow-focus → --shadow-focus
    - railListVariants base: gap-2 → --spacing-2
    - railListVariants base: p-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/module-rail/useModuleRail.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }) · packages/ui/src/organisms/module-rail/useModuleRail.ts; see Surface anatomy
  - endItems: ModuleRailLink[]; Pinned destinations after the add action. (components[] · packages/ui/src/organisms/module-rail/types.ts)
  - items: ModuleRailEntry[]; Ordered destinations and separators. (components[] · packages/ui/src/organisms/module-rail/types.ts)
  - label: string; Accessible navigation landmark name. (components[] · packages/ui/src/organisms/module-rail/types.ts)
  - messages: ModuleRailMessages; Localized add and state words. (components[] · packages/ui/src/organisms/module-rail/types.ts)
  - onAdd: ((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void); Requests creation; omitted when creation is unavailable. (components[] · packages/ui/src/organisms/module-rail/types.ts)
  - onNavigate: ((item: ModuleRailLink, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void); Called on native link click; the consumer owns routing. (components[] · packages/ui/src/organisms/module-rail/types.ts)
  - product: ProductIdentity; Consumer artwork and optional product home. (components[] · packages/ui/src/organisms/module-rail/types.ts)
### NotesBoard
catalog[] · docs/catalog.json · @egdev/ui · organism · — (native ordered list)
- NotesBoard (components[] · packages/ui/src/organisms/notes-board/types.ts)
  - Catalog composition / slots: Consumer SectionHeader, named static Chip list and editorial ListItem rows (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - NotesBoardList: Consumer-ordered list of linked notes. (components[].parts · packages/ui/src/organisms/notes-board/NotesBoard.tsx)
  - NotesBoardSide: Introduction and optional static topics. (components[].parts · packages/ui/src/organisms/notes-board/NotesBoard.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - notesBoardListVariants base: p-0 → --spacing-0
    - notesBoardListVariants base: gap-2 → --spacing-2
    - notesBoardSideVariants base: gap-4 → --spacing-4
    - notesBoardVariants base: gap-10 → --spacing-10
    - notesBoardVariants base: [@media(width<=1080px)]:gap-8 → --spacing-8
  - children: ReactNode; One NotesBoardSide followed by one NotesBoardList; the consumer owns their contents. (components[] · packages/ui/src/organisms/notes-board/types.ts)
  - sticky: boolean; Stick the side above 1080px, subject to the host scroll container and navigation clearance. (components[] · packages/ui/src/organisms/notes-board/types.ts)
### NowStrip
catalog[] · docs/catalog.json · @egdev/ui · organism · — (native named group)
- NowStrip (components[] · packages/ui/src/organisms/now-strip/types.ts)
  - Catalog composition / slots: StatusDot; consumer NowCard sm (catalog[] · docs/catalog.json)
  - Composes: StatusDot (packages/ui/src/organisms/now-strip/NowStrip.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - nowStripGridVariants base: gap-5 → --spacing-5
    - nowStripLabelVariants base: gap-2 → --spacing-2
    - nowStripLabelVariants base: font-display → --font-display
    - nowStripLabelVariants base: text-meta → --text-meta
    - nowStripVariants base: pb-6 → --spacing-6
  - children: ReactNode; Ordered direct NowCard children; consumers supply size="sm" and own their content. (components[] · packages/ui/src/organisms/now-strip/types.ts)
  - label: string; Visible, non-empty localized group name. Blank labels warn in development and render nothing. (components[] · packages/ui/src/organisms/now-strip/types.ts)
### PreviewFrame
catalog[] · docs/catalog.json · @egdev/ui · organism · AspectRatio
- PreviewFrame (components[] · packages/ui/src/organisms/preview-frame/types.ts)
  - Catalog composition / slots: IconButton, Chip (catalog[] · docs/catalog.json)
  - Composes: AspectRatio (packages/ui/src/organisms/preview-frame/PreviewFrame.tsx), Text (packages/ui/src/organisms/preview-frame/PreviewFrame.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - actionsVariants base: gap-2 → --spacing-2
    - footerVariants base: gap-2 → --spacing-2
    - footerVariants base: font-sans → --font-sans
    - footerVariants base: text-label-default → --text-label-default
    - labelVariants base: px-1 → --spacing-1
    - labelVariants base: font-sans → --font-sans
    - labelVariants base: text-label-default → --text-label-default
    - rootVariants base: gap-3 → --spacing-3
    - safeAreaVariants base: rounded-lg → --radius-lg
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'lg' }) · packages/ui/src/organisms/preview-frame/usePreviewFrame.ts; see Surface anatomy
  - actions: ReactNode; Consumer-owned trailing controls. (components[] · packages/ui/src/organisms/preview-frame/types.ts)
  - children: ReactNode; Decorative, non-interactive canvas content. (components[] · packages/ui/src/organisms/preview-frame/types.ts)
  - figureCaption: string; Visible native figure caption. (components[] · packages/ui/src/organisms/preview-frame/types.ts)
  - footer: ReactNode; Consumer-owned lower bar. (components[] · packages/ui/src/organisms/preview-frame/types.ts)
  - ratio: number; Width divided by height; values the canvas primitive cannot represent (non-positive, non-finite, or a non-finite reciprocal) fall back to 16:9. (components[] · packages/ui/src/organisms/preview-frame/types.ts)
  - safeArea: boolean; Show the decorative five-percent inset guide. (components[] · packages/ui/src/organisms/preview-frame/types.ts)
  - variant: enum; Grid currently uses the plain fallback until a grid token is approved. (components[] · packages/ui/src/organisms/preview-frame/types.ts)
  - zones: PreviewFrameZone[]; Ordered decorative percentage guides. (components[] · packages/ui/src/organisms/preview-frame/types.ts)
### SectionNav
catalog[] · docs/catalog.json · @egdev/ui · organism · Popover
- SectionNav (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - Catalog composition / slots: Native section links, Pixel, ProgressBar, Icon; Surface overlay (catalog[] · docs/catalog.json)
  - Composes: Icon (packages/ui/src/organisms/section-nav/SectionNav.tsx), Pixel (packages/ui/src/organisms/section-nav/SectionNav.tsx), Popover (packages/ui/src/organisms/section-nav/SectionNav.tsx), PopoverContent (packages/ui/src/organisms/section-nav/SectionNav.tsx), PopoverTrigger (packages/ui/src/organisms/section-nav/SectionNav.tsx), ProgressBar (packages/ui/src/organisms/section-nav/SectionNav.tsx), Surface (packages/ui/src/organisms/section-nav/SectionNav.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - sectionNavLinkVariants base: flex → 
    - sectionNavLinkVariants base: items-center → 
    - sectionNavLinkVariants base: gap-3 → --spacing-3
    - sectionNavLinkVariants base: min-h-14 → 
    - sectionNavLinkVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - sectionNavListVariants base: m-0 → --spacing-0
    - sectionNavListVariants base: p-0 → --spacing-0
    - sectionNavNextVariants base: items-center → 
    - sectionNavNextVariants base: justify-center → 
    - sectionNavNextVariants base: min-w-14 → 
    - sectionNavNextVariants base: min-h-14 → 
    - sectionNavNextVariants base: [@media(width<=520px)]:min-w-14 → 
    - sectionNavNextVariants base: [@media(width<=520px)]:min-h-14 → 
    - sectionNavNextVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - sectionNavPillVariants base: relative → 
    - sectionNavPillVariants base: flex → 
    - sectionNavPillVariants base: items-center → 
    - sectionNavPillVariants base: h-14 → 
    - sectionNavPillVariants base: px-4 → --spacing-4
    - sectionNavPillVariants base: [@media(width<=520px)]:h-14 → 
    - sectionNavPillVariants base: [@media(width<=520px)]:px-3 → --spacing-3
    - sectionNavPillVariants base: overflow-hidden → 
    - sectionNavRootVariants base: right-[calc(var(--space-6)+env(safe-area-inset-right,0px))] → --space-6
    - sectionNavRootVariants base: bottom-[calc(var(--space-6)+env(safe-area-inset-bottom,0px))] → --space-6
    - sectionNavRootVariants base: flex → 
    - sectionNavRootVariants base: flex-col → 
    - sectionNavRootVariants base: items-end → 
    - sectionNavRootVariants base: gap-0 → --spacing-0
    - sectionNavTriggerVariants base: flex → 
    - sectionNavTriggerVariants base: items-center → 
    - sectionNavTriggerVariants base: gap-3 → --spacing-3
    - sectionNavTriggerVariants base: bg-transparent → 
    - sectionNavTriggerVariants base: p-0 → --spacing-0
    - sectionNavTriggerVariants base: font-sans → --font-sans
    - sectionNavTriggerVariants base: text-body-default → --text-body-default
    - sectionNavTriggerVariants base: min-w-14 → 
    - sectionNavTriggerVariants base: min-h-14 → 
    - sectionNavTriggerVariants base: [@media(width<=520px)]:min-w-14 → 
    - sectionNavTriggerVariants base: [@media(width<=520px)]:min-h-14 → 
    - Layout source: `cn(sectionNavRootVariants(), className, hidden && 'hidden')` · packages/ui/src/organisms/section-nav/useSectionNav.ts
    - Layout packages/ui/src/organisms/section-nav/useSectionNav.ts: sectionNavRootVariants() → unresolved
    - Layout packages/ui/src/organisms/section-nav/useSectionNav.ts: className → unresolved
    - Layout packages/ui/src/organisms/section-nav/useSectionNav.ts: hidden && 'hidden' → unresolved
    - Layout source: `cn(sectionNavPillVariants())` · packages/ui/src/organisms/section-nav/useSectionNav.ts
    - Layout packages/ui/src/organisms/section-nav/useSectionNav.ts: sectionNavPillVariants() → unresolved
    - Layout source: `cn(sectionNavTriggerVariants())` · packages/ui/src/organisms/section-nav/useSectionNav.ts
    - Layout packages/ui/src/organisms/section-nav/useSectionNav.ts: sectionNavTriggerVariants() → unresolved
    - Layout source: `cn(sectionNavNextVariants())` · packages/ui/src/organisms/section-nav/useSectionNav.ts
    - Layout packages/ui/src/organisms/section-nav/useSectionNav.ts: sectionNavNextVariants() → unresolved
    - Layout source: `cn(sectionNavListVariants())` · packages/ui/src/organisms/section-nav/useSectionNav.ts
    - Layout packages/ui/src/organisms/section-nav/useSectionNav.ts: sectionNavListVariants() → unresolved
    - Layout source: `cn(sectionNavLinkVariants())` · packages/ui/src/organisms/section-nav/useSectionNav.ts
    - Layout packages/ui/src/organisms/section-nav/useSectionNav.ts: sectionNavLinkVariants() → unresolved
    - Layout source: `{nav.items.length > 0 && ( <Popover open={nav.popoverOpen} onOpenChange={nav.requestOpen}> <Surface tone='overlay' padding='none' radius='full' className={nav.pillClass}> <PopoverTrigger aria-label={nav.disclosureLabel} className={nav.triggerClass}> {nav.current && ( <> <span>{nav.currentNumber}</span> <span>{nav.current.label}</span> </> )} <Icon name='chevron-down' /> </PopoverTrigger> {nav.next && ( <a href={nav.next.href} aria-label={nav.nextLabel} className={nav.nextClass} onClick={nav.onNextClick} onAuxClick={nav.onNextAuxClick} > <Icon name='arrow-down' /> </a> )} <ProgressBar value={nav.value} size='sm' edge={true} /> </Surface> <PopoverContent label={nav.label} side='top' align='end' onCloseAutoFocus={nav.onCloseAutoFocus}> <ol className={nav.listClass}> {nav.rows.map((row) => ( <li key={row.item.id}> <a href={row.item.href} className={nav.linkClass} aria-current={row.current} onClick={row.onClick} onAuxClick={row.onAuxClick} > <Pixel state={row.state} /> <span>{row.number}</span> <span>{row.item.label}</span> </a> </li> ))} </ol> </PopoverContent> </Popover> )}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout source: `className={nav.pillClass}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout packages/ui/src/organisms/section-nav/SectionNav.tsx: nav.pillClass → unresolved
    - Layout source: `className={nav.triggerClass}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout packages/ui/src/organisms/section-nav/SectionNav.tsx: nav.triggerClass → unresolved
    - Layout source: `{nav.current && ( <> <span>{nav.currentNumber}</span> <span>{nav.current.label}</span> </> )}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout source: `{nav.currentNumber}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout source: `{nav.current.label}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout source: `{nav.next && ( <a href={nav.next.href} aria-label={nav.nextLabel} className={nav.nextClass} onClick={nav.onNextClick} onAuxClick={nav.onNextAuxClick} > <Icon name='arrow-down' /> </a> )}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout source: `className={nav.nextClass}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout packages/ui/src/organisms/section-nav/SectionNav.tsx: nav.nextClass → unresolved
    - Layout source: `className={nav.listClass}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout packages/ui/src/organisms/section-nav/SectionNav.tsx: nav.listClass → unresolved
    - Layout source: `{nav.rows.map((row) => ( <li key={row.item.id}> <a href={row.item.href} className={nav.linkClass} aria-current={row.current} onClick={row.onClick} onAuxClick={row.onAuxClick} > <Pixel state={row.state} /> <span>{row.number}</span> <span>{row.item.label}</span> </a> </li> ))}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout source: `className={nav.linkClass}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout packages/ui/src/organisms/section-nav/SectionNav.tsx: nav.linkClass → unresolved
    - Layout source: `{row.number}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
    - Layout source: `{row.item.label}` · packages/ui/src/organisms/section-nav/SectionNav.tsx
  - activeId: string; Host-designated current section identity. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - defaultOpen: boolean; Initial uncontrolled visibility. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - disclosureLabel: string; Localized disclosure name. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - items: SectionNavItem[]; Ordered section destinations. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - label: string; Localized navigation and dialog name. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - nextLabel: string; Localized next destination name, updated when the destination changes. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - onNavigate: ((item: SectionNavItem, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void); Notify the host of link activation without intercepting navigation. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - onOpenChange: ((open: boolean) => void); Notify the host when visibility is requested. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - open: boolean; Controlled visibility; the host acknowledges requested changes. (components[] · packages/ui/src/organisms/section-nav/types.ts)
  - value: number; Scroll progress in percent; host supplies equivalent text. (components[] · packages/ui/src/organisms/section-nav/types.ts)
### Sidebar
catalog[] · docs/catalog.json · @egdev/ui · organism · ScrollArea
- Sidebar (components[] · packages/ui/src/organisms/sidebar/types.ts)
  - Catalog composition / slots: Surface recipe; consumer identity, NavList and footer (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - sidebarContentVariants base: px-3 → --spacing-3
    - sidebarContentVariants base: pb-4 → --spacing-4
    - sidebarContentVariants header=false: pt-4 → --spacing-4
    - sidebarFooterVariants base: gap-2 → --spacing-2
    - sidebarFooterVariants base: px-4 → --spacing-4
    - sidebarFooterVariants base: py-3 → --spacing-3
    - sidebarFooterVariants base: font-sans → --font-sans
    - sidebarFooterVariants base: text-label-default → --text-label-default
    - sidebarHeaderVariants base: gap-3 → --spacing-3
    - sidebarHeaderVariants base: px-4 → --spacing-4
    - sidebarHeaderVariants base: pt-5 → --spacing-5
    - sidebarHeaderVariants base: pb-4 → --spacing-4
    - sidebarNameVariants base: font-display → --font-display
    - sidebarNameVariants base: text-heading-small → --text-heading-small
    - sidebarScrollbarVariants base: p-0.5 → --spacing
    - sidebarThumbVariants base: rounded-full → --radius-full
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/sidebar/useSidebar.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/sidebar/useSidebar.ts; see Surface anatomy
  - children: ReactNode; In-flow content, including independently labelled NavLists. (components[] · packages/ui/src/organisms/sidebar/types.ts)
  - footer: ReactNode; Optional pinned utility and metadata content, not navigation. (components[] · packages/ui/src/organisms/sidebar/types.ts)
  - product: ProductIdentity; Optional product name and consumer artwork, optionally linked to its home. Blank names omit the header. (components[] · packages/ui/src/organisms/sidebar/types.ts)
### TabBar
catalog[] · docs/catalog.json · @egdev/ui · organism · — (native navigation)
- TabBar (components[] · packages/ui/src/organisms/tab-bar/types.ts)
  - Catalog composition / slots: Icon, Badge, VisuallyHidden, Surface recipe (catalog[] · docs/catalog.json)
  - Composes: Badge (packages/ui/src/organisms/tab-bar/TabBar.tsx), Icon (packages/ui/src/organisms/tab-bar/TabBar.tsx), VisuallyHidden (packages/ui/src/organisms/tab-bar/TabBar.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - tabBarLinkVariants base: gap-1 → --spacing-1
    - tabBarLinkVariants base: py-2 → --spacing-2
    - tabBarLinkVariants base: px-1 → --spacing-1
    - tabBarLinkVariants base: rounded-md → --radius-md
    - tabBarLinkVariants base: text-label-default → --text-label-default
    - tabBarLinkVariants base: aria-[current=page]:before:rounded-full → --radius-full
    - tabBarLinkVariants base: focus-visible:shadow-focus → --shadow-focus
    - tabBarListVariants base: p-0 → --spacing-0
    - tabBarVariants base: pt-1.5 → --spacing
    - tabBarVariants base: px-2 → --spacing-2
    - tabBarVariants base: pb-[max(var(--space-5),env(safe-area-inset-bottom))] → --space-5
    - tabBarVariants base: font-sans → --font-sans
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/tab-bar/useTabBar.ts; see Surface anatomy
  - items: TabBarItem[]; Ordered destinations. (components[] · packages/ui/src/organisms/tab-bar/types.ts)
  - label: string; Required navigation landmark name. (components[] · packages/ui/src/organisms/tab-bar/types.ts)
  - messages: TabBarMessages; Optional count localization. (components[] · packages/ui/src/organisms/tab-bar/types.ts)
  - onNavigate: ((item: TabBarItem, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void); Native click notification; prevent default only for unmodified primary routing. (components[] · packages/ui/src/organisms/tab-bar/types.ts)
### TopBar
catalog[] · docs/catalog.json · @egdev/ui · organism · — (native navigation links)
- TopBar (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - Catalog composition / slots: Consumer-supplied brand, search, end, user and mobile parts; Surface recipe (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - TopBarBrand: Consumer-supplied leading identity; a home link is customary but not required. Children: Consumer-owned part content; the end accepts arbitrary nodes, while controls retain their own semantics. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarEnd: Consumer-supplied trailing content, visible in both layouts. Children: Consumer-owned part content; the end accepts arbitrary nodes, while controls retain their own semantics. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarMobileTrigger: Consumer-supplied mobile dialog trigger. Children: Consumer-owned part content; the end accepts arbitrary nodes, while controls retain their own semantics. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarSearchCompact: Compact search launcher. Children: Consumer-owned part content; the end accepts arbitrary nodes, while controls retain their own semantics. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarSearchFull: Full-width search launcher. Children: Consumer-owned part content; the end accepts arbitrary nodes, while controls retain their own semantics. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarUserMenu: Consumer-supplied account control. Children: Consumer-owned part content; the end accepts arbitrary nodes, while controls retain their own semantics. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: font-sans → --font-sans
    - topBarLinkVariants base: text-body-large → --text-body-large
    - topBarLinkVariants base: aria-[current=page]:font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - topBarListVariants base: gap-8 → --spacing-8
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: data-[state=transparent]:shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - topBarVariants initialBackground=transparent: shadow-none → unresolved
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
  - children: ReactNode; Direct TopBar parts, optionally wrapped in fragments; one brand is required. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - contentWidth: enum; Width of the inner row; the background remains full width in both modes. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - data-state: enum; Host-selected presentation; when absent, scroll selects glass over the initial background. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - initialBackground: enum; Unscrolled backing; glass or an explicit data-state takes precedence. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - items: TopBarItem[]; Ordered destinations, including an empty list when appropriate. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - label: string; Non-empty localized page navigation landmark name. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - onNavigate: ((item: TopBarItem, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void); Notifies a native link click; the host may prevent default. (components[] · packages/ui/src/organisms/top-bar/types.ts)
### WebSection
catalog[] · docs/catalog.json · @egdev/ui · organism · —
- WebSection (components[] · packages/ui/src/organisms/web-section/types.ts)
  - Catalog composition / slots: Consumer-supplied header, media, body, actions and social slots (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - Layout source: `slots: [header, media, body, actions, social]` · packages/ui/src/organisms/web-section/useWebSection.ts
    - Layout source: `cn(webSectionVariants(), className)` · packages/ui/src/organisms/web-section/useWebSection.ts
    - Layout packages/ui/src/organisms/web-section/useWebSection.ts: webSectionVariants() → unresolved
    - Layout packages/ui/src/organisms/web-section/useWebSection.ts: className → unresolved
    - Layout source: `{section.slots.map((slot, index) => (slot == null ? null : <div key={index}>{slot}</div>))}` · packages/ui/src/organisms/web-section/WebSection.tsx
    - Layout source: `{slot}` · packages/ui/src/organisms/web-section/WebSection.tsx
  - actions: ReactNode; Consumer actions. (components[] · packages/ui/src/organisms/web-section/types.ts)
  - body: ReactNode; Consumer section content. (components[] · packages/ui/src/organisms/web-section/types.ts)
  - header: ReactNode; Consumer introduction and heading. (components[] · packages/ui/src/organisms/web-section/types.ts)
  - media: ReactNode; Consumer media, including interactive media. (components[] · packages/ui/src/organisms/web-section/types.ts)
  - social: ReactNode; Consumer social content. (components[] · packages/ui/src/organisms/web-section/types.ts)
### AlertDialog
catalog[] · docs/catalog.json · @egdev/ui · molecule · AlertDialog
- AlertDialog (components[] · packages/ui/src/molecules/alert-dialog/types.ts)
  - AlertDialogAction: Decision action. (components[].parts · packages/ui/src/molecules/alert-dialog/AlertDialog.tsx)
  - AlertDialogCancel: Least-destructive decision; receives initial focus. (components[].parts · packages/ui/src/molecules/alert-dialog/AlertDialog.tsx)
  - AlertDialogContent: Labelled modal with required consequence and actions. (components[].parts · packages/ui/src/molecules/alert-dialog/AlertDialog.tsx)
  - AlertDialogTrigger: Optional disclosure control. (components[].parts · packages/ui/src/molecules/alert-dialog/AlertDialog.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - alertDialogHeadVariants base: gap-[var(--space-2)] → --space-2
    - alertDialogHeadVariants base: px-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pt-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pb-[var(--space-4)] → --space-4
    - alertDialogIconVariants base: text-[var(--color-status-danger)] → --color-status-danger
    - alertDialogTitleRowVariants base: gap-[var(--space-3)] → --space-3
  - children: ReactNode; Trigger and Content. (components[] · packages/ui/src/molecules/alert-dialog/types.ts)
  - defaultOpen: boolean; Initial uncontrolled visibility. (components[] · packages/ui/src/molecules/alert-dialog/types.ts)
  - onOpenChange: ((open: boolean) => void); Requested visibility changes. (components[] · packages/ui/src/molecules/alert-dialog/types.ts)
  - open: boolean; Controlled visibility. (components[] · packages/ui/src/molecules/alert-dialog/types.ts)
### ArticleFeature
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- ArticleFeature (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - ArticleFeatureCover: Reserved 16:8 cover region: the generative recessed plate with the aria-hidden word, or the supplied `PhotoFrame ratio="auto"` filling the reservation, plus the optional overlay badge. Children: Cover region props: one generative plate or exactly one `PhotoFrame ratio="auto"`. Exactly one PhotoFrame composed with ratio="auto": the cover region reserves the 16:8 proportion and the auto media fills the reserved height. A child with its own ratio breaks the reservation; that composition error is documented and warned about in development, not rejected by the type. (components[].parts · packages/ui/src/molecules/article-feature/ArticleFeature.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - articleFeatureActionVariants base: gap-1.5 → --spacing
    - articleFeatureActionVariants base: text-label-default → --text-label-default
    - articleFeatureDescriptionVariants base: text-body-default → --text-body-default
    - articleFeatureMetaVariants base: gap-2 → --spacing-2
    - articleFeatureMetaVariants base: font-display → --font-display
    - articleFeatureMetaVariants base: text-meta → --text-meta
    - articleFeatureTitleVariants base: text-heading-small → --text-heading-small
    - articleFeatureVariants base: gap-4 → --spacing-4
    - articleFeatureVariants base: focus-visible:shadow-focus → --shadow-focus
    - articleFeatureWordVariants base: px-4 → --spacing-4
    - articleFeatureWordVariants base: text-title-display → --text-title-display
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/article-feature/useArticleFeature.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }) · packages/ui/src/molecules/article-feature/useArticleFeature.ts; see Surface anatomy
  - actionLabel: string; Visible text of the card's action affordance. Paint and text only: it never becomes a nested link. Whitespace-only renders nothing. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - asChild: boolean; Merge the card onto one consumer anchor through Radix Slot; the child keeps anchor semantics. Render the native anchor that wraps the whole card. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - children: ReactNode; At most one ArticleFeatureCover, rendered before the context row. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - className: string; Outer layout only (grid placement, margin, width); appearance stays with the recipes. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - description: string; Optional descriptive paragraph; whitespace-only is omitted. Included in the link's name. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - detail: string; Reading time, date or other short fact of the context row, rendered in the secondary ink. Formatting is the consumer's. Whitespace-only renders nothing. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - eyebrow: string; Category line of the context row, rendered in the brand raised ink. Whitespace-only renders nothing. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - href: string; The consumer anchor owns the destination; the slotted branch accepts no href of its own. Destination of the card's single whole-card link. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - level: enum; Native heading rank only; the title typography never follows the rank. (components[] · packages/ui/src/molecules/article-feature/types.ts)
  - title: string; Visible article title and the card link's name. Blank or whitespace-only warns in development and renders nothing, because an unnamed link is never promised. (components[] · packages/ui/src/molecules/article-feature/types.ts)
### ButtonGroup
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- ButtonGroup (components[] · packages/ui/src/molecules/button-group/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - buttonGroupVariants variant=spaced: gap-3 → --spacing-3
    - buttonGroupVariants variant=attached: gap-0.5 → --spacing
    - buttonGroupVariants variant=attached: *:not-first:rounded-s-sm → --radius-sm
    - buttonGroupVariants variant=attached: *:not-last:rounded-e-sm → --radius-sm
  - children: ReactNode; Direct Button and IconButton elements in visual order; two or three recommended. A consumer-owned popup trigger must keep its button as a direct DOM child. (components[] · packages/ui/src/molecules/button-group/types.ts)
  - label: string; Accessible group name, recommended for split actions. Absent or empty means unnamed; aria-labelledby is also supported through native attributes. (components[] · packages/ui/src/molecules/button-group/types.ts)
  - variant: enum; Spaced wrapping actions or attached non-wrapping items with logical inner corners. (components[] · packages/ui/src/molecules/button-group/types.ts)
### Carousel
catalog[] · docs/catalog.json · @egdev/ui · molecule · — (native scroll and bounded roving focus)
- Carousel (components[] · packages/ui/src/molecules/carousel/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - carouselControlsVariants base: gap-2 → --spacing-2
    - carouselCounterVariants base: font-display → --font-display
    - carouselCounterVariants base: text-meta → --text-meta
    - carouselHeaderVariants base: gap-4 → --spacing-4
    - carouselLabelVariants base: font-display → --font-display
    - carouselLabelVariants base: text-label-eyebrow → --text-label-eyebrow
    - carouselSlideVariants base: rounded-lg → --radius-lg
    - carouselSlideVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - carouselTrackVariants base: gap-7 → --spacing-7
    - carouselTrackVariants base: p-2 → --spacing-2
    - carouselVariants base: gap-4 → --spacing-4
    - carouselVariants base: font-sans → --font-sans
  - defaultValue: string; Initial uncontrolled identity; absence or an unknown identity resolves to the first item. Later changes do not reset the current item. (components[] · packages/ui/src/molecules/carousel/types.ts)
  - items: CarouselItem[]; Ordered slides with non-empty unique values and names. Invalid collections render safely empty. (components[] · packages/ui/src/molecules/carousel/types.ts)
  - label: string; Non-empty visible and accessible collection name, without repeating its role description. (components[] · packages/ui/src/molecules/carousel/types.ts)
  - messages: Partial<CarouselMessages>; Partial localizable dictionary. Each omitted or blank text falls back independently to English. (components[] · packages/ui/src/molecules/carousel/types.ts)
  - onValueChange: ((value: string) => void); One request for a changed identity per user navigation or settled scroll; never for prop updates. (components[] · packages/ui/src/molecules/carousel/types.ts)
  - value: string; Controlled accepted identity. Missing or unknown identities resolve to the first available item. (components[] · packages/ui/src/molecules/carousel/types.ts)
### ChipGroup
catalog[] · docs/catalog.json · @egdev/ui · molecule · ToggleGroup
- ChipGroup (components[] · packages/ui/src/molecules/chip-group/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - chipGroupVariants base: gap-2 → --spacing-2
  - defaultValue: string \| string[]; Initial uncontrolled selection; omission starts empty. Later changes do not reset it. Initial uncontrolled selections; omission starts empty. Later changes do not reset them. (components[] · packages/ui/src/molecules/chip-group/types.ts)
  - dir: enum; Text direction and logical horizontal arrow direction. (components[] · packages/ui/src/molecules/chip-group/types.ts)
  - disabled: boolean; Disables every item, preserving selection and dimming each item once, never the root. (components[] · packages/ui/src/molecules/chip-group/types.ts)
  - label: string; Required non-empty accessible group name; no visible heading is added. (components[] · packages/ui/src/molecules/chip-group/types.ts)
  - onValueChange: ((value: string) => void) \| ((value: string[]) => void); Next selection after activation, including an empty string when cleared; not prop updates. Next selections in activation order after user interaction only, including an empty array. (components[] · packages/ui/src/molecules/chip-group/types.ts)
  - options: ChipGroupOption[]; Choices in DOM and keyboard order. Empty arrays render an empty named group. Consumers own valid labels, unique values and selection validity; no repair is performed. (components[] · packages/ui/src/molecules/chip-group/types.ts)
  - type: enum; At most one selected filter; selecting it again clears the group. Independent filters; no selection is required. (components[] · packages/ui/src/molecules/chip-group/types.ts)
  - value: string \| string[]; Controlled selection; an empty string clears it. Omission leaves Radix uncontrolled. Controlled selections; an empty array clears them. Omission leaves Radix uncontrolled. (components[] · packages/ui/src/molecules/chip-group/types.ts)
### Collapsible
catalog[] · docs/catalog.json · @egdev/ui · molecule · Collapsible
- Collapsible (components[] · packages/ui/src/molecules/collapsible/types.ts)
  - CollapsibleContent: Native hidden-shell/unmounted-children boundary; no forceMount or content animation. Children: In-flow body; the native hidden shell/id remains closed while children unmount. Lift persistent form state outside it. className supports outer margin/self-alignment only, merged last; no id, hidden, ref, forceMount or asChild API. Opt-in regions need a name. Meaningful flow content; children remount on reopening and local state may reset. (components[].parts · packages/ui/src/molecules/collapsible/Collapsible.tsx)
  - CollapsibleTrigger: Native button; the React 18-compatible bridge connects only this public part's ref. (components[].parts · packages/ui/src/molecules/collapsible/Collapsible.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - collapsibleContentVariants base: p-4 → --spacing-4
    - collapsibleContentVariants base: font-sans → --font-sans
    - collapsibleContentVariants base: text-body-default → --text-body-default
    - collapsibleTriggerVariants base: text-start → unresolved
    - collapsibleTriggerVariants base: data-[state=open]:rounded-b-none → --radius-none
  - children: ReactNode; One named Trigger/Content pair; nested Roots are independent. (components[] · packages/ui/src/molecules/collapsible/types.ts)
  - defaultOpen: boolean; Initial visibility only; unavailable in controlled mode, where open is authoritative. Initial visibility only; later changes do not reset the native state. (components[] · packages/ui/src/molecules/collapsible/types.ts)
  - disabled: boolean; Disable only Trigger activation, retaining visibility and enabled body controls. (components[] · packages/ui/src/molecules/collapsible/types.ts)
  - onOpenChange: ((open: boolean) => void) \| ((open: boolean) => void); Requests the next visibility without echoing mount or incoming prop updates. (components[] · packages/ui/src/molecules/collapsible/types.ts)
  - open: boolean; Owner-supplied visibility; do not switch control mode while mounted. Owner-supplied visibility; omit in uncontrolled mode and do not switch mode while mounted. (components[] · packages/ui/src/molecules/collapsible/types.ts)
### CommandPalette
catalog[] · docs/catalog.json · @egdev/ui · molecule · Dialog (native D4 combobox)
- CommandPalette (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - paletteCategory base: font-display → --font-display
    - paletteCategory base: text-label-eyebrow → --text-label-eyebrow
    - paletteField base: gap-2.5 → --spacing
    - paletteField base: px-3 → --spacing-3
    - paletteField base: py-1.5 → --spacing
    - paletteInput base: font-sans → --font-sans
    - paletteInput base: text-body-default → --text-body-default
    - paletteList base: py-1.5 → --spacing
    - paletteMessage base: p-3 → --spacing-3
    - paletteMessage base: text-body-default → --text-body-default
    - paletteOverlay base: px-(--gutter) → --gutter
    - paletteOverlay base: pt-[12vh] → unresolved
    - palettePanel base: p-2 → --spacing-2
    - paletteRow base: gap-3 → --spacing-3
    - paletteRow base: p-3 → --spacing-3
    - paletteRow base: rounded-md → --radius-md
    - paletteRow base: font-sans → --font-sans
    - paletteRow base: text-body-default → --text-body-default
  - busy: boolean; Results are loading. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - children: ReactElement<unknown, string \| JSXElementConstructor<any>>; Optional focusable launcher. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - className: string; Panel width and max-width only; appearance overrides are unsupported. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - defaultOpen: boolean; Initial visibility. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - dismissLabel: string; Close button name. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - filtering: enum; Filtering mode. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - items: CommandPaletteItem[]; Ordered commands. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - label: string; Input and dialog name. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - messages: Partial<CommandPaletteMessages>; Localized messages. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - onOpenChange: ((open: boolean) => void); Requested visibility changes. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - onQueryChange: ((query: string) => void); User query changes. (components[] · packages/ui/src/molecules/command-palette/types.ts)
  - open: boolean; Controlled visibility. (components[] · packages/ui/src/molecules/command-palette/types.ts)
### CommunityCard
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- CommunityCard (components[] · packages/ui/src/molecules/community-card/types.ts)
  - CommunityCardAction: Bottom-edge zone for the card's single supplied action; the card itself stays passive. Children: Bottom-edge zone for the card's single supplied action; the card itself stays passive. Exactly one consumer `Button` (optionally `asChild` with an anchor) or `Link`. Two competing actions are outside the contract; the action keeps its own events, focus ring and target. (components[].parts · packages/ui/src/molecules/community-card/CommunityCard.tsx)
  - CommunityCardMark: Decorative consumer mark slot on the trailing edge of the header band's top row. Children: Decorative consumer mark slot on the trailing edge of the header band's top row. Exactly one consumer-supplied, non-interactive mark element: no anchor, button or tab stop. Either named — `role="img"` with `aria-label`, or `img` with `alt` — so it joins the card content, or decorative — `img` with `alt=""` or `aria-hidden` — when the mark repeats the visible name, so the card is not announced twice. Non-image marks must fit within 153.6 × 51.2 CSS pixels without distortion; consumers own this constraint and the slot does not clip. Not type-enforced; rendered untouched. (components[].parts · packages/ui/src/molecules/community-card/CommunityCard.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - communityCardBandVariants base: rounded-t-xl → --radius-xl
    - communityCardBodyVariants base: gap-4 → --spacing-4
    - communityCardBodyVariants base: p-6 → --spacing-6
    - communityCardBodyVariants base: text-body-default → --text-body-default
    - communityCardBodyVariants base: min-[48rem]:p-8 → --spacing-8
    - communityCardEyebrowVariants base: gap-2.5 → --spacing
    - communityCardEyebrowVariants base: font-display → --font-display
    - communityCardEyebrowVariants base: text-body-default → --text-body-default
    - communityCardEyebrowVariants base: font-(weight:--text-label-eyebrow--font-weight) → --text-label-eyebrow--font-weight
    - communityCardTitleVariants base: font-display → --font-display
    - communityCardTitleVariants base: text-title-section → --text-title-section
    - communityCardTopRowVariants base: gap-3 → --spacing-3
    - communityCardTopRowVariants base: px-6 → --spacing-6
    - communityCardTopRowVariants base: py-4 → --spacing-4
    - communityCardTopRowVariants base: min-[48rem]:px-8 → --spacing-8
    - communityCardTopRowVariants base: min-[48rem]:py-5 → --spacing-5
    - communityCardVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
  - children: ReactNode; Free descriptive copy in reading order: paragraphs and phrasing content, never headings or interactive content. Direct CommunityCardMark children are hoisted into the header band's top row; a CommunityCardAction child stays in the body flow where it is placed. (components[] · packages/ui/src/molecules/community-card/types.ts)
  - className: string; Outer layout only (grid placement, margin, width); appearance stays with the recipes. (components[] · packages/ui/src/molecules/community-card/types.ts)
  - eyebrow: string; Optional relationship line above the name. Visually limited to two lines; the full text remains in the DOM. Whitespace-only renders nothing and the top row collapses to the mark when supplied. (components[] · packages/ui/src/molecules/community-card/types.ts)
  - level: enum; Native heading rank only; the display typography never follows the rank. (components[] · packages/ui/src/molecules/community-card/types.ts)
  - title: string; Visible community name and the complete article name. Blank or whitespace-only titles warn in development and render nothing, because an unnamed article is never promised. (components[] · packages/ui/src/molecules/community-card/types.ts)
### Dialog
catalog[] · docs/catalog.json · @egdev/ui · molecule · Dialog
- Dialog (components[] · packages/ui/src/molecules/dialog/types.ts)
  - DialogClose: Explicit close action. (components[].parts · packages/ui/src/molecules/dialog/Dialog.tsx)
  - DialogContent: Body-portalled modal panel with an owned accessible title and optional description. (components[].parts · packages/ui/src/molecules/dialog/Dialog.tsx)
  - DialogTrigger: Optional native or slotted disclosure button. (components[].parts · packages/ui/src/molecules/dialog/Dialog.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - dialogBodyVariants base: p-[var(--space-6)] → --space-6
    - dialogDescriptionVariants base: text-body-default → --text-body-default
    - dialogFootVariants base: px-[var(--space-6)] → --space-6
    - dialogFootVariants base: py-[var(--space-4)] → --space-4
    - dialogFootVariants base: gap-[var(--space-3)] → --space-3
    - dialogHeadVariants base: py-[var(--space-4)] → --space-4
    - dialogHeadVariants base: ps-[var(--space-6)] → --space-6
    - dialogHeadVariants base: pe-[calc(var(--space-4)+var(--space-12))] → --space-4, --space-12
    - dialogOverlayVariants base: p-[var(--space-6)] → --space-6
    - dialogOverlayVariants flush=true: p-0 → --spacing-0
    - dialogStatusVariants base: text-label-default → --text-label-default
    - dialogTitleVariants base: font-display → --font-display
    - dialogTitleVariants base: text-heading-small → --text-heading-small
  - children: ReactNode; Composed Trigger and Content. (components[] · packages/ui/src/molecules/dialog/types.ts)
  - defaultOpen: boolean; Initial uncontrolled visibility. (components[] · packages/ui/src/molecules/dialog/types.ts)
  - onOpenChange: ((open: boolean) => void); Requested visibility changes. (components[] · packages/ui/src/molecules/dialog/types.ts)
  - open: boolean; Controlled visibility. (components[] · packages/ui/src/molecules/dialog/types.ts)
### Field
catalog[] · docs/catalog.json · @egdev/ui · molecule · Label + Slot
- Field (components[] · packages/ui/src/molecules/field/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - fieldCounterVariants base: text-label-default → --text-label-default
    - fieldCounterVariants base: disabledPart → unresolved
    - fieldFooterRowVariants base: gap-2 → --spacing-2
    - fieldLabelRowVariants base: gap-2 → --spacing-2
    - fieldLabelRowVariants base: disabledPart → unresolved
    - fieldMessageVariants base: disabledPart → unresolved
    - fieldReadoutVariants base: text-label-default → --text-label-default
    - fieldVariants base: font-sans → --font-sans
    - fieldVariants layout=stacked: gap-1.5 → --spacing
    - fieldVariants layout=choice: gap-x-2 → --spacing-2
    - fieldVariants layout=choice: gap-y-1 → --spacing-1
  - children: ReactElement<unknown, string \| JSXElementConstructor<any>>; Exactly one Input, Textarea, Select, Slider, Checkbox or Switch element; no Fragment. Slot preserves child-first description ids and explicit child aria-invalid precedence. With an error, omit aria-invalid entirely or supply true/'true'; explicit undefined, null, false and other conflicting values are unsupported. Slider also needs its own label. (components[] · packages/ui/src/molecules/field/types.ts)
  - counter: FieldCounter; Consumer-derived length and limit, shown alone on the stacked bottom row; never invents an error. (components[] · packages/ui/src/molecules/field/types.ts)
  - error: string; Consumer validation message; a non-empty string marks the compatible control invalid. No live announcement or validation logic; an empty string is treated as absent. (components[] · packages/ui/src/molecules/field/types.ts)
  - hideLabel: boolean; Keep the required label accessible while removing it from visual layout. (components[] · packages/ui/src/molecules/field/types.ts)
  - hint: string; Help text; replaced by a non-empty error. Omitted when absent or empty. (components[] · packages/ui/src/molecules/field/types.ts)
  - hintTone: enum; Presentation of the hint only; a non-empty error always takes precedence. No tone changes control validity or creates a live region. (components[] · packages/ui/src/molecules/field/types.ts)
  - label: string; Required control name, even when visually hidden. (components[] · packages/ui/src/molecules/field/types.ts)
  - layout: enum; Label above the control, or beside a Checkbox/Switch. Choice omits readout and counter. (components[] · packages/ui/src/molecules/field/types.ts)
  - readout: string; Visible current value in a linked output; omitted in choice layout or when absent. (components[] · packages/ui/src/molecules/field/types.ts)
### GaugeGroup
catalog[] · docs/catalog.json · @egdev/ui · molecule · — (native group and meters)
- GaugeGroup (components[] · packages/ui/src/molecules/gauge-group/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - groupCenterVariants base: text-label-default → --text-label-default
    - groupCenterVariants base: font-sans → --font-sans
    - groupFrameVariants base: p-0 → --spacing-0
    - groupFrameVariants base: rounded-[var(--radius-full)] → --radius-full
    - groupFrameVariants base: [box-shadow:none] → unresolved
    - groupListVariants base: p-0 → --spacing-0
    - groupListVariants base: gap-2 → --spacing-2
    - groupPositionVariants base: text-label-default → --text-label-default
    - groupRootVariants base: gap-3 → --spacing-3
    - groupRootVariants base: font-sans → --font-sans
    - groupRowVariants base: gap-2 → --spacing-2
    - groupRowVariants base: text-body-default → --text-body-default
    - groupValueVariants base: text-body-default → --text-body-default
  - center: ReactNode; Decorative, non-interactive content already represented in the readings. (components[] · packages/ui/src/molecules/gauge-group/types.ts)
  - items: GaugeGroupItems; Two or three independent ordered readings. (components[] · packages/ui/src/molecules/gauge-group/types.ts)
  - label: string; Required non-empty collection name. (components[] · packages/ui/src/molecules/gauge-group/types.ts)
  - size: enum; Diagram preset diameter. (components[] · packages/ui/src/molecules/gauge-group/types.ts)
### ListItem
catalog[] · docs/catalog.json · @egdev/ui · molecule · Slot
- ListItem (components[] · packages/ui/src/molecules/list-item/types.ts)
  - ListItemActions: Independent trailing controls; no item-wide activation or primary navigation region. Children: Compound div attributes. className supports local alignment, placement and width constraints, not appearance, hidden content or reordering. No ref, own role or tab stop is exposed. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - ListItemBody: Leading content, optional host handle and passive media grouping. Children: Compound div attributes. className supports local alignment, placement and width constraints, not appearance, hidden content or reordering. No ref, own role or tab stop is exposed. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - ListItemContent: Flexible readable content; never automatically clamped or hidden. Children: Compound div attributes. className supports local alignment, placement and width constraints, not appearance, hidden content or reordering. No ref, own role or tab stop is exposed. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - ListItemFooter: Wrapping metadata/action band for card and compact compositions. Children: Compound div attributes. className supports local alignment, placement and width constraints, not appearance, hidden content or reordering. No ref, own role or tab stop is exposed. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - ListItemLeading: Optional editorial leading zone: a dated time stamp, index or short label; no controls. Children: Compound div attributes. className supports local alignment, placement and width constraints, not appearance, hidden content or reordering. No ref, own role or tab stop is exposed. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - ListItemMedia: Passive square thumbnail well; consumers own image alt and poster content. Children: Compound div attributes. className supports local alignment, placement and width constraints, not appearance, hidden content or reordering. No ref, own role or tab stop is exposed. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - ListItemMeta: Non-interactive context and visible status text. Children: Compound div attributes. className supports local alignment, placement and width constraints, not appearance, hidden content or reordering. No ref, own role or tab stop is exposed. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - ListItemTitle: Editorial row title; level picks the native heading rank h2–h6 independently of typography. Children: Editorial title zone: renders a real h2–h6 chosen by level, forwards native heading attributes for that element and merges className last for local placement. No ref, own role or tab stop. One heading text node; the consumer supplies a rank that fits the surrounding outline. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - ListItemTrailing: Optional editorial trailing zone: a decorative icon or readable text such as a duration. Children: Compound div attributes. className supports local alignment, placement and width constraints, not appearance, hidden content or reordering. No ref, own role or tab stop is exposed. (components[].parts · packages/ui/src/molecules/list-item/ListItem.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
  - asChild: boolean; Merge onto one child through Radix Slot. Populated children remain non-focusable containers; editorial values additionally accept one anchor child for a whole-row link. Merge onto one child through Radix Slot. Editorial values accept one anchor child so the whole row is a single link; keep ListItemActions out of that anchor. Merge onto one native button or anchor; its child owns type, disabled, href and activation. (components[] · packages/ui/src/molecules/list-item/types.ts)
  - children: ReactNode \| ReactElement<unknown, string \| JSXElementConstructor<any>>; Populated item composition; use compound parts for readable content and independent controls. One non-focusable li, article or div containing the entire populated composition. One native action with phrasing content only; no compound div parts or nested controls. (components[] · packages/ui/src/molecules/list-item/types.ts)
  - size: enum; Editorial row density only; card, compact, row and empty ignore it. Inert for the empty presentation, which normalizes to card. (components[] · packages/ui/src/molecules/list-item/types.ts)
  - status: enum; Host-selected condition, never selection or disabled semantics. Empty presentation requires a single native action and visible creation text. (components[] · packages/ui/src/molecules/list-item/types.ts)
  - variant: enum; Arrangement and density; content preserves DOM order and wraps. Empty actions support card only; invalid runtime combinations normalize to card. (components[] · packages/ui/src/molecules/list-item/types.ts)
### Menu
catalog[] · docs/catalog.json · @egdev/ui · molecule · DropdownMenu
- Menu (components[] · packages/ui/src/molecules/menu/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - accountMenuRecipeVariants part=trigger: cn(         surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'full' }),         'group inline-flex items-center gap-1 min-h-10 pointer-coarse:min-h-11 pl-1 pr-1.5 border-border-hairline-strong text-fg-secondary cursor-pointer hover:bg-surface-2 hover:border-border-brand hover:text-fg-default aria-expanded:bg-surface-2 aria-expanded:border-border-brand aria-expanded:text-fg-default focus-visible:outline-none focus-visible:shadow-focus transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none'       ) → unresolved
    - accountMenuRecipeVariants part=name: font-sans → --font-sans
    - accountMenuRecipeVariants part=name: text-label-default → --text-label-default
    - accountMenuRecipeVariants part=description: font-sans → --font-sans
    - accountMenuRecipeVariants part=description: text-label-default → --text-label-default
    - menuHeaderVariants base: gap-3 → --spacing-3
    - menuHeaderVariants base: p-2.5 → --spacing
    - menuHeaderVariants base: pb-3 → --spacing-3
    - menuItemVariants base: gap-3 → --spacing-3
    - menuItemVariants base: px-3 → --spacing-3
    - menuItemVariants base: py-2.25 → --spacing
    - menuItemVariants base: rounded-md → --radius-md
    - menuItemVariants base: text-label-default → --text-label-default
    - menuLabelVariants base: px-3 → --spacing-3
    - menuLabelVariants base: pt-2 → --spacing-2
    - menuLabelVariants base: pb-1 → --spacing-1
    - menuLabelVariants base: font-display → --font-display
    - menuLabelVariants base: text-meta → --text-meta
    - menuShortcutVariants base: pl-3 → --spacing-3
    - menuVariants base: p-2 → --spacing-2
    - menuVariants base: font-sans → --font-sans
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'full' }) · packages/ui/src/molecules/menu/types.ts; see Surface anatomy
    - surfaceVariants({ tone: 'overlay', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/menu/useMenu.ts; see Surface anatomy
  - align: enum; Alignment along the preferred side. (components[] · packages/ui/src/molecules/menu/types.ts)
  - children: ReactElement<unknown, string \| JSXElementConstructor<any>>; One named focusable element that spreads props and forwards its ref. (components[] · packages/ui/src/molecules/menu/types.ts)
  - className: string; Layout-safe Content additions, such as a larger min-width; appearance overrides are unsupported. (components[] · packages/ui/src/molecules/menu/types.ts)
  - defaultOpen: boolean; Initial uncontrolled visibility; subsequent updates do not control it. (components[] · packages/ui/src/molecules/menu/types.ts)
  - header: ReactNode; Non-interactive context before the entries; absent means no header. (components[] · packages/ui/src/molecules/menu/types.ts)
  - items: MenuEntry[]; Ordered entries with unique ids and non-empty labels where applicable. (components[] · packages/ui/src/molecules/menu/types.ts)
  - onNavigate: ((item: MenuLinkItem, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void); Link activation before native navigation; preventDefault supports client-side routing. (components[] · packages/ui/src/molecules/menu/types.ts)
  - onOpenChange: ((open: boolean) => void); Visibility request caused by user interaction, not mounting or incoming props. (components[] · packages/ui/src/molecules/menu/types.ts)
  - open: boolean; Controlled visibility; omission leaves Radix in control. (components[] · packages/ui/src/molecules/menu/types.ts)
  - side: enum; Preferred side, adjusted by Radix collision handling. (components[] · packages/ui/src/molecules/menu/types.ts)
### MeterRow
catalog[] · docs/catalog.json · @egdev/ui · molecule · Progress (via ProgressBar)
- MeterRow (components[] · packages/ui/src/molecules/meter-row/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - meterRowHeaderVariants base: gap-x-3 → --spacing-3
    - meterRowHeaderVariants base: gap-y-1 → --spacing-1
    - meterRowHelpVariants base: text-label-default → --text-label-default
    - meterRowHelpVariants base: font-[var(--text-body-muted--font-weight)] → --text-body-muted--font-weight
    - meterRowKeyVariants base: rounded-full → --radius-full
    - meterRowLabelGroupVariants base: gap-2 → --spacing-2
    - meterRowLabelVariants base: text-label-default → --text-label-default
    - meterRowValueVariants base: text-label-default → --text-label-default
    - meterRowVariants base: gap-2 → --spacing-2
    - meterRowVariants base: font-sans → --font-sans
  - help: string; Persistent plain-text explanation linked to the indicator. Absent or whitespace-only help is omitted; this is not form guidance, a tooltip, an error or the numeric readout. (components[] · packages/ui/src/molecules/meter-row/types.ts)
  - label: string; Required non-empty visible task/goal name and sole progressbar accessible name. (components[] · packages/ui/src/molecules/meter-row/types.ts)
  - messages: Partial<MeterRowMessages>; Localizable built-in text. Omitted indeterminate entries resolve to In progress. Supplied phrases must be non-empty; no locale-aware number formatting is built in. (components[] · packages/ui/src/molecules/meter-row/types.ts)
  - value: number; Required task percent. Finite values clamp to 0–100 with decimals preserved; NaN and infinities mean indeterminate progress, not unavailable data or zero. (components[] · packages/ui/src/molecules/meter-row/types.ts)
  - valueText: string; Non-empty coherent completion equivalent, visible and accessible. Finite values otherwise derive normalized decimal percent text; ignored during indeterminate progress. (components[] · packages/ui/src/molecules/meter-row/types.ts)
  - variant: enum; Brand or muted comparison-task family for the bar and decorative key, never disabled state. (components[] · packages/ui/src/molecules/meter-row/types.ts)
### ModuleCard
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- ModuleCard (components[] · packages/ui/src/molecules/module-card/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - moduleCardActionsVariants base: gap-2 → --spacing-2
    - moduleCardActionsVariants base: last:rounded-b-xl → --radius-xl
    - moduleCardActionsVariants banded=true: px-6 → --spacing-6
    - moduleCardActionsVariants banded=true: pb-5 → --spacing-5
    - moduleCardActionsVariants banded=true: group-data-[tone=overlay]/module-card:px-5 → --spacing-5
    - moduleCardBodyVariants base: gap-3 → --spacing-3
    - moduleCardBodyVariants base: font-sans → --font-sans
    - moduleCardBodyVariants base: text-body-default → --text-body-default
    - moduleCardBodyVariants base: last:rounded-b-xl → --radius-xl
    - moduleCardBodyVariants banded=true: gap-4 → --spacing-4
    - moduleCardBodyVariants banded=true: pt-5 → --spacing-5
    - moduleCardBodyVariants banded=true: px-6 → --spacing-6
    - moduleCardBodyVariants banded=true: pb-6 → --spacing-6
    - moduleCardBodyVariants banded=true: group-data-[tone=overlay]/module-card:px-5 → --spacing-5
    - moduleCardFootVariants base: gap-2 → --spacing-2
    - moduleCardFootVariants base: font-sans → --font-sans
    - moduleCardFootVariants base: text-label-default → --text-label-default
    - moduleCardFootVariants banded=true: shadow-none → unresolved
    - moduleCardFootVariants banded=true: rounded-b-xl → --radius-xl
    - moduleCardFootVariants banded=true: py-2.5 → --spacing
    - moduleCardFootVariants banded=true: ps-6 → --spacing-6
    - moduleCardFootVariants banded=true: pe-3 → --spacing-3
    - moduleCardFootVariants banded=true: group-data-[tone=overlay]/module-card:px-5 → --spacing-5
    - moduleCardHeadVariants base: gap-2.5 → --spacing
    - moduleCardHeadVariants banded=true: rounded-t-xl → --radius-xl
    - moduleCardHeadVariants banded=true: py-3.5 → --spacing
    - moduleCardHeadVariants banded=true: px-6 → --spacing-6
    - moduleCardHeadVariants banded=true: group-data-[tone=overlay]/module-card:px-5 → --spacing-5
    - moduleCardNameVariants banded=true: font-display → --font-display
    - moduleCardNameVariants banded=true: text-heading-small → --text-heading-small
    - moduleCardNameVariants banded=false: font-sans → --font-sans
    - moduleCardNameVariants banded=false: text-cta-label → --text-cta-label
    - moduleCardVariants base: gap-4 → --spacing-4
    - moduleCardVariants base: p-5 → --spacing-5
    - moduleCardVariants base: font-sans → --font-sans
    - moduleCardVariants base: data-[variant=banded]:gap-0 → --spacing-0
    - moduleCardVariants base: data-[variant=banded]:p-0 → --spacing-0
    - moduleCardVariants base: data-[state=stopped]:shadow-none → unresolved
    - surfaceVariants({             tone: effectiveTone === 'overlay' ? 'surface-1' : 'surface-0',             elevation: 0,             padding: 'none',             radius: 'none'           }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
    - surfaceVariants({             tone: effectiveTone === 'overlay' ? 'surface-3' : 'surface-2',             elevation: 0,             padding: 'none',             radius: 'none'           }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
    - surfaceVariants({           tone: effectiveTone,           ...(effectiveTone === 'surface-1' ? { elevation: 1 } : {}),           padding: 'none',           radius: 'xl'         }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
  - actions: ReactNode; One or two supplied Button/Link controls. Absent/null/boolean omits the wrapper. One or two meaningful recovery Button/Link elements; null/boolean/empty fragments are unsupported. One or two meaningful Start/enable/details controls; null/boolean/empty fragments are unsupported. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - children: ReactNode; Meaningful free body; error content explains the problem. Consumers own figures and related controls. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - footer: ReactNode; Supplementary metadata and at most one utility control; never the primary actions. Omitted when absent/null/boolean. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - icon: ReactNode; Optional decorative pictogram; no controls or sole identity text. Absent/null/boolean omits the wrapper. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - level: enum; Native heading rank only; typography follows variant. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - messages: Partial<ModuleCardMessages>; Partial status dictionary; omitted or blank keys fall back to Ready / Needs attention / Stopped. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - status: enum; Consumer-selected presentation; no automatic transitions or announcements. Error presentation keeps the selected Material and requires meaningful recovery actions. Unpainted dashed stopped presentation; does not disable descendants. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - title: string; Visible non-empty heading and complete article name. Blank titles warn in development and render nothing. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - tone: enum; Surface material; overlay requires a genuinely floating host. Stopped cards support only surface-1 input, then reset its paint. (components[] · packages/ui/src/molecules/module-card/types.ts)
  - variant: enum; Regular card or tonal bands, independent of status. Stopped cards support only the regular variant; untyped conflicts normalize to default. (components[] · packages/ui/src/molecules/module-card/types.ts)
### NavList
catalog[] · docs/catalog.json · @egdev/ui · molecule · Collapsible
- NavList (components[] · packages/ui/src/molecules/nav-list/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - navListCaptionVariants base: gap-2 → --spacing-2
    - navListCaptionVariants base: px-[calc(var(--space-1)*2.5)] → --space-1
    - navListCaptionVariants base: font-display → --font-display
    - navListCaptionVariants base: text-nav-group → --text-nav-group
    - navListCaptionVariants base: font-[var(--text-label-eyebrow--font-weight)] → --text-label-eyebrow--font-weight
    - navListCountVariants base: font-mono → --font-mono
    - navListCountVariants base: text-nav-count → --text-nav-count
    - navListCountVariants base: font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - navListLinkVariants base: rounded-md → --radius-md
    - navListLinkVariants base: gap-[calc(var(--space-1)*3.125)] → --space-1
    - navListLinkVariants base: px-[calc(var(--space-1)*2.5)] → --space-1
    - navListLinkVariants base: py-[calc(var(--space-1)*2.1875)] → --space-1
    - navListLinkVariants base: font-sans → --font-sans
    - navListLinkVariants base: text-nav-row → --text-nav-row
    - navListLinkVariants base: font-[var(--text-body-muted--font-weight)] → --text-body-muted--font-weight
    - navListListVariants base: p-0 → --spacing-0
    - navListListVariants base: gap-0 → --spacing-0
    - navListMarkerVariants base: rounded-md → --radius-md
    - navListMetadataVariants base: gap-2 → --spacing-2
    - navListTriggerVariants base: gap-2 → --spacing-2
    - navListTriggerVariants base: px-[calc(var(--space-1)*2.5)] → --space-1
    - navListTriggerVariants base: py-[calc(var(--space-1)*1.5625)] → --space-1
    - navListTriggerVariants base: rounded-md → --radius-md
    - navListTriggerVariants base: text-left → unresolved
    - navListTriggerVariants base: font-display → --font-display
    - navListTriggerVariants base: text-nav-group → --text-nav-group
    - navListTriggerVariants base: font-[var(--text-label-eyebrow--font-weight)] → --text-label-eyebrow--font-weight
    - navListTriggerVariants base: focus-visible:shadow-focus → --shadow-focus
    - navListVariants base: font-sans → --font-sans
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'md' }) · packages/ui/src/molecules/nav-list/useNavList.ts; see Surface anatomy
  - items: NavListEntry[]; Ordered links and one-level groups. Empty data renders an empty list. (components[] · packages/ui/src/molecules/nav-list/types.ts)
  - label: string; Required non-empty accessible name of the navigation landmark. (components[] · packages/ui/src/molecules/nav-list/types.ts)
  - onNavigate: ((item: NavListLink, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void); Native click notification with the original entry and React event. For client routing, preventDefault only on unmodified primary activations; modifiers and auxclick remain native. (components[] · packages/ui/src/molecules/nav-list/types.ts)
### Notice
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- Notice (components[] · packages/ui/src/molecules/notice/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - noticeActionsVariants base: gap-2 → --spacing-2
    - noticeAppearanceVariants base: gap-3 → --spacing-3
    - noticeAppearanceVariants base: px-4 → --spacing-4
    - noticeAppearanceVariants base: py-3 → --spacing-3
    - noticeAppearanceVariants base: font-sans → --font-sans
    - noticeAppearanceVariants size=md: text-body-default → --text-body-default
    - noticeAppearanceVariants size=sm: gap-2 → --spacing-2
    - noticeAppearanceVariants size=sm: px-3 → --spacing-3
    - noticeAppearanceVariants size=sm: py-2 → --spacing-2
    - noticeAppearanceVariants size=sm: rounded-md → --radius-md
    - noticeAppearanceVariants size=sm: text-label-default → --text-label-default
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/notice/types.ts; see Surface anatomy
  - actions: ReactNode; Optional trailing one or two system Button (sm, secondary/neutral) or Link elements. Their handlers, routing and keyboard behavior stay consumer-owned. No dismissal API. (components[] · packages/ui/src/molecules/notice/types.ts)
  - children: ReactNode; Optional detail following the summary. Do not supply nested live regions. (components[] · packages/ui/src/molecules/notice/types.ts)
  - icon: ReactNode; Decorative leading glyph replacing bell, alert or check derived from tone. Null is unsupported: every notice needs its non-color icon cue. (components[] · packages/ui/src/molecules/notice/types.ts)
  - role: enum; Native live-region role override. Derived from tone when omitted; do not add a second announcement owner or contradict its implicit live behavior with native ARIA overrides. (components[] · packages/ui/src/molecules/notice/types.ts)
  - size: enum; Compact preset for narrow panels or the standard inline message. (components[] · packages/ui/src/molecules/notice/types.ts)
  - summary: string; Required non-empty lead sentence, rendered first in strong; carries meaning without color. Blank input warns in development and omits the strong element, not the whole notice. (components[] · packages/ui/src/molecules/notice/types.ts)
  - tone: enum; Status tint and default icon; danger derives alert, all other tones derive status. (components[] · packages/ui/src/molecules/notice/types.ts)
### NowCard
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- NowCard (components[] · packages/ui/src/molecules/now-card/types.ts)
  - NowCardBody: Padded growing zone for the consumer-supplied copy. Children: Padded growing zone for the consumer-supplied copy; no interactive content, no badge slot. One or two short paragraphs. No controls, no links, no status badge: the card renders the consumer's statusBadge slot itself, before the heading. (components[].parts · packages/ui/src/molecules/now-card/NowCard.tsx)
  - NowCardDetail: Supporting date or context line with the consumer-marked emphasized value. Children: Supporting date or context line with an emphasized value; no controls. One short visible sentence; mark the value with <b> (for example a real <time dateTime> inside it). (components[].parts · packages/ui/src/molecules/now-card/NowCard.tsx)
  - NowCardFooter: Lower band for one supporting detail and/or one action. Children: Lower band for one supporting detail and/or one action (a Link or a labelled IconButton); never two competing actions. One NowCardDetail and/or one Link/IconButton. Omit the part entirely when the card has no footer. (components[].parts · packages/ui/src/molecules/now-card/NowCard.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - nowCardBadgeVariants base: px-6 → --spacing-6
    - nowCardBadgeVariants base: pt-6 → --spacing-6
    - nowCardBadgeVariants base: pb-3 → --spacing-3
    - nowCardBodyVariants base: gap-2 → --spacing-2
    - nowCardBodyVariants base: p-6 → --spacing-6
    - nowCardBodyVariants base: text-body-large → --text-body-large
    - nowCardBodyVariants size=sm: p-4 → --spacing-4
    - nowCardBodyVariants size=sm: text-body-default → --text-body-default
    - nowCardDetailValueVariants base: [&_b]:font-(weight:--text-title-section--font-weight) → --text-title-section--font-weight
    - nowCardDetailVariants base: font-display → --font-display
    - nowCardDetailVariants base: text-meta → --text-meta
    - nowCardFootVariants base: gap-2 → --spacing-2
    - nowCardFootVariants base: shadow-none → unresolved
    - nowCardFootVariants base: rounded-b-xl → --radius-xl
    - nowCardFootVariants base: px-6 → --spacing-6
    - nowCardFootVariants base: py-3 → --spacing-3
    - nowCardFootVariants size=sm: px-5 → --spacing-5
    - nowCardFootVariants size=sm: py-2 → --spacing-2
    - nowCardHeadingVariants base: px-6 → --spacing-6
    - nowCardHeadingVariants base: text-heading-small → --text-heading-small
    - nowCardHeadingVariants size=sm: px-4 → --spacing-4
    - nowCardHeadingVariants size=sm: text-body-large → --text-body-large
    - nowCardHeadingVariants badge=true: pt-0 → --spacing-0
    - nowCardHeadingVariants badge=false: pt-6 → --spacing-6
    - nowCardVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
  - children: ReactNode; Body and footer parts in reading order (NowCardBody, then NowCardFooter). (components[] · packages/ui/src/molecules/now-card/types.ts)
  - level: enum; Native heading rank only; the visual step follows size. (components[] · packages/ui/src/molecules/now-card/types.ts)
  - size: enum; Density preset: md is the standard card, sm the three-up NowStrip density. Density never clamps, truncates or hides supplied content. (components[] · packages/ui/src/molecules/now-card/types.ts)
  - statusBadge: ReactNode; Optional consumer-supplied non-interactive status node, typically a Badge composition, rendered before the heading as the card's first content. Absent/null/boolean renders nothing. No interactive descendants, no baked-in status word, no tone ownership. (components[] · packages/ui/src/molecules/now-card/types.ts)
  - title: string; Visible non-empty heading and complete article name. Blank titles warn in development and render nothing. (components[] · packages/ui/src/molecules/now-card/types.ts)
### PageHeader
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- PageHeader (components[] · packages/ui/src/molecules/page-header/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - pageHeaderEyebrowVariants base: font-display → --font-display
    - pageHeaderEyebrowVariants base: text-label-eyebrow → --text-label-eyebrow
    - pageHeaderHeadingVariants base: font-sans → --font-sans
    - pageHeaderHeadingVariants base: text-heading-small → --text-heading-small
    - pageHeaderVariants base: gap-x-6 → --spacing-6
    - pageHeaderVariants base: gap-y-4 → --spacing-4
  - actions: boolean \| PageHeaderActions \| null; One direct Button (including asChild links), or one supplied ButtonGroup variant="spaced" with at least two direct supported children. Rendered unchanged, never cloned or parsed. Null, undefined and booleans omit the action area. Arrays, fragments, arbitrary wrappers and nested groups are unsupported; JSX type erasure cannot enforce target identity. (components[] · packages/ui/src/molecules/page-header/types.ts)
  - eyebrow: string; Context before the heading. Absent or whitespace-only text is omitted; nonblank supplied text is preserved without a decorative diamond. (components[] · packages/ui/src/molecules/page-header/types.ts)
  - level: enum; Native h1–h6 rank; never changes the compact heading-small recipe. (components[] · packages/ui/src/molecules/page-header/types.ts)
  - title: string; Visible plain-string heading, not a native tooltip. Must contain non-whitespace text; otherwise the entire header is omitted, with a development warning. (components[] · packages/ui/src/molecules/page-header/types.ts)
### Panel
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- Panel (components[] · packages/ui/src/molecules/panel/types.ts)
  - PanelBody: Transparent main-content zone; controls retain their native or Radix behavior. Children: Required transparent main-content zone; child controls own their behavior. Free flow content and independently labelled consumer controls. (components[].parts · packages/ui/src/molecules/panel/Panel.tsx)
  - PanelFooter: Supplied supplementary metadata/utility zone, not a footer landmark. Children: Supplementary metadata/utility zone, not a page-footer landmark. Supplied metadata and related utility controls. Omit the part when absent. (components[].parts · packages/ui/src/molecules/panel/Panel.tsx)
  - PanelHeader: Supplied identity/context, without generated heading semantics. Children: Supplied identity/context zone; no generated heading or landmark. Meaningful supplied header content. Omit the part itself when it is not needed. (components[].parts · packages/ui/src/molecules/panel/Panel.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - panelBodyVariants base: gap-4 → --spacing-4
    - panelBodyVariants base: zoneGeometry → unresolved
    - panelFooterVariants base: gap-3 → --spacing-3
    - panelFooterVariants base: zoneGeometry → unresolved
    - panelFooterVariants variant=banded: shadow-none → unresolved
    - panelHeaderVariants base: gap-3 → --spacing-3
    - panelHeaderVariants base: zoneGeometry → unresolved
    - panelVariants base: gap-0 → --spacing-0
    - panelVariants base: p-0 → --spacing-0
    - panelVariants base: font-sans → --font-sans
    - panelVariants base: text-body-default → --text-body-default
    - panelVariants tone=inherit: shadow-none → unresolved
    - surfaceVariants({ tone: bandTone, elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/panel/usePanel.ts; see Surface anatomy
  - children: ReactNode; Optional Header, exactly one Body and optional Footer, in direct DOM sibling order. Fragments without wrappers are supported; Panel never parses or repairs the child tree. (components[] · packages/ui/src/molecules/panel/types.ts)
  - tone: enum; Explicit Material ownership. Inherit exposes an existing raised host, never infers one. (components[] · packages/ui/src/molecules/panel/types.ts)
  - variant: enum; Shared presentation of the supplied zones, without changing their behavior. (components[] · packages/ui/src/molecules/panel/types.ts)
### Popover
catalog[] · docs/catalog.json · @egdev/ui · molecule · Popover
- Popover (components[] · packages/ui/src/molecules/popover/types.ts)
  - PopoverClose: Explicit named dismissal action; optionally compose a button-compatible child. (components[].parts · packages/ui/src/molecules/popover/Popover.tsx)
  - PopoverContent: Internally portalled named dialog on the existing Surface overlay treatment. Children: Named dialog. className supports outer dimensions, margins and alignment only, not Material paint. Consumer-owned body, field labels and visible Close action; no generated heading or form. (components[].parts · packages/ui/src/molecules/popover/Popover.tsx)
  - PopoverTrigger: Named button that toggles the associated dialog; optionally compose an existing Button. (components[].parts · packages/ui/src/molecules/popover/Popover.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - popoverButtonVariants base: rounded-md → --radius-md
    - popoverButtonVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - popoverContentVariants base: font-sans → --font-sans
    - popoverContentVariants base: text-body-default → --text-body-default
  - children: ReactNode; One Trigger and one Content; use Close for explicit dismissal. (components[] · packages/ui/src/molecules/popover/types.ts)
  - defaultOpen: boolean; Initial uncontrolled visibility, read once. (components[] · packages/ui/src/molecules/popover/types.ts)
  - modal: boolean; Contain focus, pointer interaction and assistive-technology access while open. Do not change modality while open. Non-modal Tab still cycles within Content. (components[] · packages/ui/src/molecules/popover/types.ts)
  - onOpenChange: ((open: boolean) => void); Requested next visibility; incoming prop updates never echo this notification. (components[] · packages/ui/src/molecules/popover/types.ts)
  - open: boolean; Controlled visibility; the owner must acknowledge close requests. (components[] · packages/ui/src/molecules/popover/types.ts)
### ProjectCard
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- ProjectCard (components[] · packages/ui/src/molecules/project-card/types.ts)
  - ProjectCardBackdrop: Decorative backdrop; supply a single image with empty alt. Children: Decorative backdrop: supply one non-interactive image with empty alt. Layout classes only. Consumers own legibility: the single 42% scrim guarantees contrast only for dark or low-contrast images, so choose a backdrop that keeps the heading and eyebrow readable. (components[].parts · packages/ui/src/molecules/project-card/ProjectCard.tsx)
  - ProjectCardCode: Sample command block in a labelled mono well; passive text, never executable or focusable. Children: Sample command block in a labelled mono well; passive text, never executable or focusable. (components[].parts · packages/ui/src/molecules/project-card/ProjectCard.tsx)
  - ProjectCardFooter: Footer zone for the card's single supplied action; the card itself stays passive. Children: Footer zone for the card's single action; the consumer supplies exactly one Link or Button. One supplied action; the card itself stays passive and adds no tab stop of its own. (components[].parts · packages/ui/src/molecules/project-card/ProjectCard.tsx)
  - ProjectCardMark: Trailing non-interactive mark. Children: Trailing non-interactive mark: supply a named image or a decorative repeated mark. Layout classes only. (components[].parts · packages/ui/src/molecules/project-card/ProjectCard.tsx)
  - ProjectCardTags: Ordered technology labels rendered as one static Chip per list item. Children: Ordered technology labels rendered as one static Chip per list item. (components[].parts · packages/ui/src/molecules/project-card/ProjectCard.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - projectCardBodyVariants base: text-body-large → --text-body-large
    - projectCardCodeVariants base: font-mono → --font-mono
    - projectCardCodeVariants base: text-code → --text-code
    - projectCardEyebrowVariants base: text-label-eyebrow → --text-label-eyebrow
    - projectCardFootVariants base: gap-3 → --spacing-3
    - projectCardHeadingVariants size=md: text-heading-small → --text-heading-small
    - projectCardHeadingVariants size=sm: text-body-large → --text-body-large
    - projectCardIndexVariants base: text-transparent → unresolved
    - projectCardIndexVariants size=md: text-title-display → --text-title-display
    - projectCardIndexVariants size=sm: text-title-section → --text-title-section
    - projectCardTagsVariants base: gap-1.5 → --spacing
    - projectCardTagsVariants base: p-0 → --spacing-0
    - projectCardUpperContentVariants base: gap-4 → --spacing-4
    - projectCardUpperVariants base: rounded-xl → --radius-xl
    - projectCardUpperVariants base: gap-4 → --spacing-4
    - projectCardVariants base: gap-4 → --spacing-4
    - projectCardVariants variant=featured: shadow-[var(--shadow-hot)] → --shadow-hot
    - projectCardVariants size=sm: gap-3 → --spacing-3
    - projectCardVariants size=sm: p-3 → --spacing-3
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
  - children: ReactNode; Free body flow in reading order: paragraphs, then ProjectCardTags, ProjectCardCode and ProjectCardFooter. (components[] · packages/ui/src/molecules/project-card/types.ts)
  - className: string; Outer layout only (grid placement, margin, width); appearance stays with the recipes. (components[] · packages/ui/src/molecules/project-card/types.ts)
  - eyebrow: string; Optional uppercase context line above the heading; whitespace-only renders nothing. (components[] · packages/ui/src/molecules/project-card/types.ts)
  - index: string; Optional decorative outline number such as 01; aria-hidden and never part of the accessible name. Whitespace-only renders nothing. (components[] · packages/ui/src/molecules/project-card/types.ts)
  - level: enum; Native heading rank only; the visual step follows the size, never the rank. (components[] · packages/ui/src/molecules/project-card/types.ts)
  - size: enum; Density preset; every supplied part still renders, including the code block. (components[] · packages/ui/src/molecules/project-card/types.ts)
  - title: string; Visible heading text and the complete article name. Blank titles warn in development and render nothing. (components[] · packages/ui/src/molecules/project-card/types.ts)
  - variant: enum; Visual treatment: the raised default frame or the featured signature (brand edge, halo and index ink). (components[] · packages/ui/src/molecules/project-card/types.ts)
### SectionHeader
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- SectionHeader (components[] · packages/ui/src/molecules/section-header/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - sectionHeaderLedeVariants base: font-sans → --font-sans
    - sectionHeaderLedeVariants base: text-body-muted → --text-body-muted
    - sectionHeaderVariants variant=stack: gap-5 → --spacing-5
    - sectionHeaderVariants variant=split: gap-y-6 → --spacing-6
    - sectionHeaderVariants variant=split: gap-x-12 → --spacing-12
    - sectionHeaderVariants variant=inline: gap-6 → --spacing-6
  - accent: string; Optional trailing highlighted run in the same heading; blank text is omitted. No separator is inserted. (components[] · packages/ui/src/molecules/section-header/types.ts)
  - accentBreak: boolean; Start the accent on a separate visual line. No effect without an accent. (components[] · packages/ui/src/molecules/section-header/types.ts)
  - eyebrow: string; Optional context before the heading, rendered by Text's decorative diamond eyebrow recipe. Blank text is omitted. (components[] · packages/ui/src/molecules/section-header/types.ts)
  - lede: string; Optional introductory paragraph; blank text is omitted, never rendered as a placeholder. (components[] · packages/ui/src/molecules/section-header/types.ts)
  - level: enum; Native heading rank only, not a font-size selector. (components[] · packages/ui/src/molecules/section-header/types.ts)
  - title: string; Required non-blank heading copy, preserved verbatim. Include any separating space before accent. Blank titles warn in development and render no header. (components[] · packages/ui/src/molecules/section-header/types.ts)
  - titleId: string; Consumer-supplied document-unique heading ID for external relationships, distinct from root id. Blank IDs are omitted; no ID is generated. (components[] · packages/ui/src/molecules/section-header/types.ts)
  - tone: enum; Accent context: canvas neon or raised brand on surface-1 through surface-3 and overlays. (components[] · packages/ui/src/molecules/section-header/types.ts)
  - variant: enum; Editorial arrangement. Split without a lede and inline without an eyebrow resolve to stack. (components[] · packages/ui/src/molecules/section-header/types.ts)
### SelectTile
catalog[] · docs/catalog.json · @egdev/ui · molecule · RadioGroup.Item / ToggleGroup.Item
- SelectTile (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - card base: gap-2 → --spacing-2
    - card base: p-2 → --spacing-2
    - card base: text-start → unresolved
    - card base: font-sans → --font-sans
    - card base: hover:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - card base: has-[[data-state=checked]]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)] → --shadow-edge-strong, --shadow-elev-1
    - card base: has-[[data-state=on]]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)] → --shadow-edge-strong, --shadow-elev-1
    - card base: data-[state=live]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] → --shadow-edge-strong, --shadow-glow-base
    - card base: data-[state=live]:has-[[data-state=checked]]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] → --shadow-edge-strong, --shadow-glow-base
    - card base: data-[state=live]:has-[[data-state=on]]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] → --shadow-edge-strong, --shadow-glow-base
    - control base: rounded-lg → --radius-lg
    - control base: p-0 → --spacing-0
    - control base: focus-visible:shadow-focus → --shadow-focus
    - fallback base: text-cta-label → --text-cta-label
    - fallback base: font-sans → --font-sans
    - label base: text-cta-label → --text-cta-label
    - label base: px-1 → --spacing-1
    - meta base: text-label-default → --text-label-default
    - meta base: font-[var(--text-body-default--font-weight)] → --text-body-default--font-weight
    - meta base: px-1 → --spacing-1
    - meta base: pb-1 → --spacing-1
    - root base: gap-3 → --spacing-3
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/select-tile/useSelectTile.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/select-tile/useSelectTile.ts; see Surface anatomy
  - defaultValue: string \| string[]; Initial uncontrolled selection only; absent means no selection. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - dir: enum; Logical text and horizontal keyboard direction. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - disabled: boolean; Disable every card, dimming each entire card once. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - label: string; Non-empty accessible collection name. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - name: string; Native-equivalent single-mode form field name; omitted unless supplied. Form field names are unavailable in multiple mode; consumers serialize values themselves. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - onValueChange: ((value: string) => void) \| ((value: string[]) => void); User-driven next selection. Absent unless the consumer subscribes. User-driven next selection in activation order, including an empty array. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - options: SelectTileOption[]; Standard cards in data order; an empty collection is allowed. Consumers own valid values. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - ratio: enum; Collection-wide thumbnail proportions. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - required: boolean; Native-equivalent single-mode form requirement. Native required validation is unavailable in multiple mode. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - type: enum; Single radio choice or independent multiple toggles. (components[] · packages/ui/src/molecules/select-tile/types.ts)
  - value: string \| string[]; Authoritative selection; an empty string clears without an event on prop updates. Authoritative selection in Radix activation order; an empty array clears. (components[] · packages/ui/src/molecules/select-tile/types.ts)
### SocialLinks
catalog[] · docs/catalog.json · @egdev/ui · molecule · — (native anchors; atom-owned Slot + AccessibleIcon)
- SocialLinks (components[] · packages/ui/src/molecules/social-links/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - socialLinksCaptionVariants base: font-display → --font-display
    - socialLinksCaptionVariants base: text-label-eyebrow → --text-label-eyebrow
    - socialLinksListVariants base: p-0 → --spacing-0
  - caption: string \| null; Visible contextual copy; null or whitespace-only omits the caption without losing the list name. (components[] · packages/ui/src/molecules/social-links/types.ts)
  - gap: enum; Token-key list spacing: 1 is 4px and 2 is 8px, including wrapped rows. (components[] · packages/ui/src/molecules/social-links/types.ts)
  - inline: boolean; Arrange caption and list in a wrapping row rather than a stack; DOM order stays unchanged. (components[] · packages/ui/src/molecules/social-links/types.ts)
  - items: SocialLinkItem[]; Ordered profile entries. Empty or all-invalid entries render nothing; invalid entries warn in development. (components[] · packages/ui/src/molecules/social-links/types.ts)
  - label: string; Accessible list name, separate from the caption. Blank input warns and uses Social profiles. (components[] · packages/ui/src/molecules/social-links/types.ts)
  - newTabText: string; Localized notice appended once to external link names. Blank input warns and uses the default notice. (components[] · packages/ui/src/molecules/social-links/types.ts)
  - size: enum; Delegated IconButton size; lg is 48px, md is 40px for dense desktop use only. (components[] · packages/ui/src/molecules/social-links/types.ts)
  - variant: enum; Delegated IconButton treatment; the collection paints no surface of its own. (components[] · packages/ui/src/molecules/social-links/types.ts)
### Table
catalog[] · docs/catalog.json · @egdev/ui · molecule · ScrollArea
- Table (components[] · packages/ui/src/molecules/table/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - captionVariants base: text-label-default → --text-label-default
    - captionVariants base: text-start → unresolved
    - captionVariants base: px-4 → --spacing-4
    - captionVariants base: py-3 → --spacing-3
    - cellVariants base: text-label-default → --text-label-default
    - cellVariants base: [font-weight:var(--text-body-default--font-weight)] → --text-body-default--font-weight
    - cellVariants size=md: py-3 → --spacing-3
    - cellVariants size=md: px-4 → --spacing-4
    - cellVariants size=sm: py-2 → --spacing-2
    - cellVariants size=sm: px-3 → --spacing-3
    - cellVariants format=number: text-end → unresolved
    - cellVariants format=actions: text-end → unresolved
    - codeVariants base: font-mono → --font-mono
    - codeVariants base: text-code → --text-code
    - emptyVariants base: py-6 → --spacing-6
    - emptyVariants base: px-4 → --spacing-4
    - emptyVariants base: text-center → unresolved
    - headerVariants base: font-display → --font-display
    - headerVariants base: text-label-eyebrow → --text-label-eyebrow
    - headerVariants base: text-start → unresolved
    - headerVariants size=md: py-2.5 → --spacing
    - headerVariants size=md: px-4 → --spacing-4
    - headerVariants size=sm: py-2 → --spacing-2
    - headerVariants size=sm: px-3 → --spacing-3
    - sortVariants base: gap-1 → --spacing-1
    - sortVariants base: p-0 → --spacing-0
    - sortVariants base: font-inherit → unresolved
    - sortVariants base: text-inherit → unresolved
    - sortVariants base: focus-visible:shadow-focus → --shadow-focus
    - thumbVariants base: rounded-full → --radius-full
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/table/useTable.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }) · packages/ui/src/molecules/table/useTable.ts; see Surface anatomy
  - activeRowId: string; Current row, independent of selection. (components[] · packages/ui/src/molecules/table/types.ts)
  - className: string; Outer layout only. Native style is forwarded, but appearance overrides are unsupported. (components[] · packages/ui/src/molecules/table/types.ts)
  - columns: TableColumn<TableRow>[]; Ordered column definitions. (components[] · packages/ui/src/molecules/table/types.ts)
  - defaultSort: TableSort \| null; Initial sort. (components[] · packages/ui/src/molecules/table/types.ts)
  - defaultValue: string[]; Initial selected IDs. (components[] · packages/ui/src/molecules/table/types.ts)
  - hideLabel: boolean; Hide the caption visually. (components[] · packages/ui/src/molecules/table/types.ts)
  - label: string; Caption and accessible name. (components[] · packages/ui/src/molecules/table/types.ts)
  - maxHeight: enum; Optional scroll viewport cap. (components[] · packages/ui/src/molecules/table/types.ts)
  - messages: Partial<TableMessages>; Localized labels. (components[] · packages/ui/src/molecules/table/types.ts)
  - onSortChange: ((sort: TableSort) => void); Sort request. (components[] · packages/ui/src/molecules/table/types.ts)
  - onValueChange: ((value: string[]) => void); Selection request. (components[] · packages/ui/src/molecules/table/types.ts)
  - rows: TableRow[]; Consumer-defined rows. (components[] · packages/ui/src/molecules/table/types.ts)
  - selectable: boolean; Enable row selection. (components[] · packages/ui/src/molecules/table/types.ts)
  - size: enum; Cell density. (components[] · packages/ui/src/molecules/table/types.ts)
  - sort: TableSort \| null; Controlled sort. (components[] · packages/ui/src/molecules/table/types.ts)
  - value: string[]; Controlled selected IDs. (components[] · packages/ui/src/molecules/table/types.ts)
  - variant: enum; Presentation. (components[] · packages/ui/src/molecules/table/types.ts)
### Tabs
catalog[] · docs/catalog.json · @egdev/ui · molecule · Tabs
- Tabs (components[] · packages/ui/src/molecules/tabs/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - tabsCountVariants base: px-1.5 → --spacing
    - tabsCountVariants base: rounded-full → --radius-full
    - tabsCountVariants base: shadow-edge → --shadow-edge
    - tabsCountVariants base: text-label-default → --text-label-default
    - tabsListVariants variant=underline: gap-1 → --spacing-1
    - tabsListVariants variant=segmented: gap-0.5 → --spacing
    - tabsListVariants variant=segmented: p-0.75 → --spacing
    - tabsPanelVariants base: pt-4 → --spacing-4
    - tabsTriggerVariants base: gap-2 → --spacing-2
    - tabsTriggerVariants base: font-sans → --font-sans
    - tabsTriggerVariants base: text-label-default → --text-label-default
    - tabsTriggerVariants variant=underline: after:rounded-full → --radius-full
    - tabsTriggerVariants variant=underline: data-[state=active]:after:shadow-glow-base → --shadow-glow-base
    - tabsTriggerVariants variant=segmented: px-3 → --spacing-3
    - tabsTriggerVariants variant=segmented: rounded-[calc(var(--radius-md)---spacing(0.75))] → --radius-md, --spacing
    - tabsTriggerVariants variant=segmented: data-[state=active]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)] → --shadow-edge-strong, --shadow-elev-1
    - tabsTriggerVariants variant=segmented: focus-visible:shadow-focus → --shadow-focus
    - tabsTriggerVariants variant=segmented: data-[state=active]:focus-visible:shadow-focus → --shadow-focus
    - tabsTriggerVariants {"variant":"underline","size":"md"}: px-3 → --spacing-3
    - tabsTriggerVariants {"variant":"underline","size":"sm"}: px-2 → --spacing-2
    - tabsVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/tabs/useTabs.ts; see Surface anatomy
  - defaultValue: string; Initial uncontrolled selection; when absent, selects the first enabled item. (components[] · packages/ui/src/molecules/tabs/types.ts)
  - items: TabsItem[]; Ordered views: unique, non-empty values and at least one enabled item are required. (components[] · packages/ui/src/molecules/tabs/types.ts)
  - label: string; Accessible name of the tablist. (components[] · packages/ui/src/molecules/tabs/types.ts)
  - onValueChange: ((value: string) => void); Notifies a user-driven selection change; incoming prop updates do not emit it. (components[] · packages/ui/src/molecules/tabs/types.ts)
  - size: enum; Underline height and horizontal padding only; segmented always uses its single height. (components[] · packages/ui/src/molecules/tabs/types.ts)
  - value: string; Controlled selection. When absent, Radix manages selection internally. (components[] · packages/ui/src/molecules/tabs/types.ts)
  - variant: enum; Underline row or recessed segmented well. (components[] · packages/ui/src/molecules/tabs/types.ts)
### TerminalCard
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- TerminalCard (components[] · packages/ui/src/molecules/terminal-card/types.ts)
  - TerminalCardBar: Title bar with the decorative terminal glyph, the supplied path and an optional shell. Children: Title bar showing the current path and, optionally, the shell name on the trailing edge. No ref or asChild API; className supports local layout only. The path text shown after the decorative glyph; plain text, `span` or `code`. Controls are not acceptable bar content. (components[].parts · packages/ui/src/molecules/terminal-card/TerminalCard.tsx)
  - TerminalCardList: Ordered definition pairs as a two-column `dl`; carets stay decorative and unannounced. Children: Ordered definition pairs rendered as `dl` > `dt`/`dd`. No controls, no links and no nested lists. No ref or asChild API; className supports local layout only. (components[].parts · packages/ui/src/molecules/terminal-card/TerminalCard.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - terminalCardBarVariants base: rounded-t-xl → --radius-xl
    - terminalCardBarVariants base: gap-2 → --spacing-2
    - terminalCardBarVariants base: px-4 → --spacing-4
    - terminalCardBarVariants base: py-2.5 → --spacing
    - terminalCardListVariants base: gap-x-4 → --spacing-4
    - terminalCardListVariants base: gap-y-1.5 → --spacing
    - terminalCardListVariants base: px-4 → --spacing-4
    - terminalCardListVariants base: py-3 → --spacing-3
    - terminalCardListVariants base: font-mono → --font-mono
    - terminalCardListVariants base: text-body-default → --text-body-default
    - terminalCardShellVariants base: font-sans → --font-sans
    - terminalCardShellVariants base: text-label-default → --text-label-default
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
  - children: ReactNode; `TerminalCardBar` and `TerminalCardList` in that order, as direct children. (components[] · packages/ui/src/molecules/terminal-card/types.ts)
  - className: string; Outer layout only (width, margin, grid placement). The card has no built-in maximum width; the consumer decides it here. (components[] · packages/ui/src/molecules/terminal-card/types.ts)
  - label: string; Accessible name of the `role="group"` region. Required and non-empty; a blank or whitespace-only label renders nothing, because an unnamed group is never promised. (components[] · packages/ui/src/molecules/terminal-card/types.ts)
### Timeline
catalog[] · docs/catalog.json · @egdev/ui · molecule · ScrollArea
- Timeline (components[] · packages/ui/src/molecules/timeline/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - timelineAuthorVariants base: font-(weight:--text-cta-label--font-weight) → --text-cta-label--font-weight
    - timelineBodyVariants base: [&_b]:font-(weight:--text-cta-label--font-weight) → --text-cta-label--font-weight
    - timelineBodyVariants base: [&_strong]:font-(weight:--text-cta-label--font-weight) → --text-cta-label--font-weight
    - timelineCategoryVariants base: gap-1.5 → --spacing
    - timelineCategoryVariants base: font-display → --font-display
    - timelineCategoryVariants base: text-label-eyebrow → --text-label-eyebrow
    - timelineCategoryVariants base: [&_.eg-icon]:text-inherit → unresolved
    - timelineEmptyVariants base: p-2 → --spacing-2
    - timelineEmptyVariants base: font-sans → --font-sans
    - timelineEmptyVariants base: text-body-default → --text-body-default
    - timelineIdentityVariants base: gap-1.5 → --spacing
    - timelineItemVariants base: gap-3 → --spacing-3
    - timelineItemVariants base: px-2 → --spacing-2
    - timelineItemVariants base: font-sans → --font-sans
    - timelineItemVariants variant=events: py-2 → --spacing-2
    - timelineItemVariants variant=events: text-body-default → --text-body-default
    - timelineItemVariants variant=chat: py-1.5 → --spacing
    - timelineItemVariants variant=chat: text-label-default → --text-label-default
    - timelineItemVariants variant=chat: data-[kind=command]:rounded-sm → --radius-sm
    - timelineListVariants base: p-0 → --spacing-0
    - timelineMessageVariants command=true: font-mono → --font-mono
    - timelineMessageVariants command=true: text-code → --text-code
    - timelinePlatformVariants base: rounded-sm → --radius-sm
    - timelineScrollbarVariants base: p-0.5 → --spacing
    - timelineThumbVariants base: rounded-full → --radius-full
    - timelineTimeVariants base: font-mono → --font-mono
    - timelineTimeVariants base: text-code → --text-code
    - timelineVariants base: p-0 → --spacing-0
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'full' }) · packages/ui/src/molecules/timeline/useTimeline.ts; see Surface anatomy
  - aria-live: enum; Events never request live announcements. Native log speech request. Use off for history/backfill, commit, then restore polite. Initial-mount speech and exact delivery depend on browser/AT. (components[] · packages/ui/src/molecules/timeline/types.ts)
  - dir: enum; Radix layout direction; inherits the document when omitted. (components[] · packages/ui/src/molecules/timeline/types.ts)
  - items: TimelineEvent[] \| TimelineChatItem[]; Events in display order, with unique stable ids; may be empty. Chat in chronological oldest-first order, with unique stable ids; may be empty. (components[] · packages/ui/src/molecules/timeline/types.ts)
  - label: string; Required non-empty accessible name, including ordering context. (components[] · packages/ui/src/molecules/timeline/types.ts)
  - messages: Partial<TimelineMessages>; Omitted keys use the documented English messages, never content translations. (components[] · packages/ui/src/molecules/timeline/types.ts)
  - size: enum; Viewport maximum height: sm 192px, md 288px, lg 384px; short content stays short. (components[] · packages/ui/src/molecules/timeline/types.ts)
  - variant: enum; Events region or passive chat log. (components[] · packages/ui/src/molecules/timeline/types.ts)
### TipCard
catalog[] · docs/catalog.json · @egdev/ui · molecule · —
- TipCard (components[] · packages/ui/src/molecules/tip-card/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - tipCardCapVariants base: p-0 → --spacing-0
    - tipCardCapVariants base: gap-1.5 → --spacing
    - tipCardTitleVariants base: font-mono → --font-mono
    - tipCardTitleVariants base: text-label-default → --text-label-default
    - tipCardVariants base: gap-3 → --spacing-3
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'sm', radius: 'xl' }) · packages/ui/src/molecules/tip-card/useTipCard.ts; see Surface anatomy
  - alt: string; Cover alternative text carrying the real post text. Required and non-empty in practice: the poster never depends on the category badge for meaning. (components[] · packages/ui/src/molecules/tip-card/types.ts)
  - badge: string; Optional category word rendered as a solid brand Badge above the label in the caption row. Whitespace-only renders no badge and leaves no empty pill. (components[] · packages/ui/src/molecules/tip-card/types.ts)
  - className: string; Outer layout only (grid placement, margin, width); appearance stays with the recipes. (components[] · packages/ui/src/molecules/tip-card/types.ts)
  - focalPoint: enum; Static cover crop alignment inside the 2:3 viewport; crop only, never a mirror. (components[] · packages/ui/src/molecules/tip-card/types.ts)
  - level: enum; Native heading rank only; the mono label typography never follows the rank. (components[] · packages/ui/src/molecules/tip-card/types.ts)
  - src: string; Cover image resource handed to PhotoFrame. Required: the poster is content, never decorative. (components[] · packages/ui/src/molecules/tip-card/types.ts)
  - title: string; Visible technical label in the caption row and the complete article name. Blank titles warn in development and render nothing. (components[] · packages/ui/src/molecules/tip-card/types.ts)
### AmbientBackground
catalog[] · docs/catalog.json · @egdev/effects · atom · —
- AmbientBackground (components[] · packages/effects/src/ambient-background/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - lineDirection: enum; Line travel direction in screen coordinates. (components[] · packages/effects/src/ambient-background/types.ts)
  - opacity: number; Layer opacity, clamped to [0, 1]; non-finite values become zero. (components[] · packages/effects/src/ambient-background/types.ts)
  - profile: enum; Particle density and motion profile. (components[] · packages/effects/src/ambient-background/types.ts)
  - squareDirection: enum; Square travel direction in screen coordinates. (components[] · packages/effects/src/ambient-background/types.ts)
### Avatar
catalog[] · docs/catalog.json · @egdev/ui · atom · Avatar
- Avatar (components[] · packages/ui/src/atoms/avatar/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - avatarImageVariants base: rounded-full → --radius-full
    - avatarVariants base: rounded-full → --radius-full
  - label: string; Person or channel name. Without a label the whole avatar is decorative. Include network and paused meaning here or in adjacent text when applicable. (components[] · packages/ui/src/atoms/avatar/types.ts)
  - paused: boolean; De-emphasizes a paused entity; also communicate the meaning in label or adjacent text. (components[] · packages/ui/src/atoms/avatar/types.ts)
  - size: enum; Disc diameter: sm 24px, md 30px, lg 40px, xl 48px. (components[] · packages/ui/src/atoms/avatar/types.ts)
  - src: string; Photo URL. When absent or unavailable, Radix shows the user glyph. (components[] · packages/ui/src/atoms/avatar/types.ts)
### Badge
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Badge (components[] · packages/ui/src/atoms/badge/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - badgeVariants base: gap-1.5 → --spacing
    - badgeVariants base: py-1.5 → --spacing
    - badgeVariants base: px-2.5 → --spacing
    - badgeVariants base: rounded-full → --radius-full
    - badgeVariants base: font-sans → --font-sans
    - badgeVariants base: text-label-default → --text-label-default
    - badgeVariants variant=soft: shadow-edge → --shadow-edge
    - badgeVariants variant=solid: shadow-none → unresolved
  - children: ReactNode; Visible non-empty word or short phrase. Do not supply interactive descendants. (components[] · packages/ui/src/atoms/badge/types.ts)
  - icon: ReactNode; Optional decorative leading visual, hidden from assistive technology. Omitted when absent. Size supplied content to the 14px wrapper; never supply focusable content. (components[] · packages/ui/src/atoms/badge/types.ts)
  - tone: enum; Supplementary color family; the visible label carries the meaning. (components[] · packages/ui/src/atoms/badge/types.ts)
  - variant: enum; Soft tinted fill and border or solid tone fill with on-status text. (components[] · packages/ui/src/atoms/badge/types.ts)
### Button
catalog[] · docs/catalog.json · @egdev/ui · atom · Slot
- Button (components[] · packages/ui/src/atoms/button/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - buttonVariants base: rounded-md → --radius-md
    - buttonVariants base: font-sans → --font-sans
    - buttonVariants base: focus-visible:[box-shadow:var(--shadow-focus)] → --shadow-focus
    - buttonVariants base: data-disabled:shadow-none → unresolved
    - buttonVariants variant=primary: [box-shadow:var(--shadow-btn-primary)] → --shadow-btn-primary
    - buttonVariants variant=primary: [&:not([aria-disabled=true]):not(:active):not(:focus-visible):hover]:[box-shadow:var(--shadow-btn-primary-hover)] → --shadow-btn-primary-hover
    - buttonVariants variant=primary: [&:not([aria-disabled=true]):not(:focus-visible):active]:[box-shadow:var(--shadow-btn-pressed)] → --shadow-btn-pressed
    - buttonVariants variant=secondary: [box-shadow:var(--shadow-edge-strong),var(--shadow-elev-1)] → --shadow-edge-strong, --shadow-elev-1
    - buttonVariants variant=secondary: [&:not([aria-disabled=true]):not(:active):not(:focus-visible):hover]:[box-shadow:var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] → --shadow-edge-strong, --shadow-elev-1, --shadow-glow-base
    - buttonVariants variant=secondary: [&:not([aria-disabled=true]):not(:focus-visible):active]:[box-shadow:var(--shadow-btn-pressed)] → --shadow-btn-pressed
    - buttonVariants variant=neutral: shadow-(--shadow-edge) → --shadow-edge
    - buttonVariants variant=dark: shadow-none → unresolved
    - buttonVariants size=lg: py-3 → --spacing-3
    - buttonVariants size=lg: px-5.5 → --spacing
    - buttonVariants size=lg: gap-2.5 → --spacing
    - buttonVariants size=lg: text-cta-label → --text-cta-label
    - buttonVariants size=md: py-3 → --spacing-3
    - buttonVariants size=md: px-5.5 → --spacing
    - buttonVariants size=md: gap-2.5 → --spacing
    - buttonVariants size=md: text-cta-label → --text-cta-label
    - buttonVariants size=sm: py-2 → --spacing-2
    - buttonVariants size=sm: px-4 → --spacing-4
    - buttonVariants size=sm: gap-2 → --spacing-2
    - buttonVariants size=sm: text-label-default → --text-label-default
    - buttonVariants size=sm: [font-weight:var(--text-cta-label--font-weight)] → --text-cta-label--font-weight
  - asChild: boolean; Compose onto one compatible child through Radix Slot. Native type is not forwarded. Disabled children leave tab order; loading children remain focusable. (components[] · packages/ui/src/atoms/button/types.ts)
  - children: ReactNode; Non-empty visible action label; one compatible element when asChild is true. (components[] · packages/ui/src/atoms/button/types.ts)
  - icon: ReactNode; Optional decorative glyph, hidden from assistive technology. Button alone permits start/end placement under its scoped leading-icon amendment; end is the default. (components[] · packages/ui/src/atoms/button/types.ts)
  - iconPosition: enum; Side of the decorative icon slot, also used by the loading spinner. (components[] · packages/ui/src/atoms/button/types.ts)
  - loading: boolean; Pending operation: keeps focus, suppresses activation and replaces the icon with Spinner. The consumer owns announcements. Explicit disabled takes precedence over focus retention. (components[] · packages/ui/src/atoms/button/types.ts)
  - size: enum; Minimum height uses spacing tokens: lg 44.8px, md 38.4px and sm 32px. Use lg when the action must meet a 44px touch target. (components[] · packages/ui/src/atoms/button/types.ts)
  - variant: enum; Material treatment. neutral is the visible grey quiet action; use dark only on flood backgrounds. (components[] · packages/ui/src/atoms/button/types.ts)
### Checkbox
catalog[] · docs/catalog.json · @egdev/ui · atom · Checkbox
- Checkbox (components[] · packages/ui/src/atoms/checkbox/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - checkboxVariants base: p-0 → --spacing-0
    - checkboxVariants base: rounded-sm → --radius-sm
    - checkboxVariants base: shadow-[var(--shadow-well)] → --shadow-well
    - checkboxVariants base: data-[state=checked]:shadow-[var(--shadow-btn-primary)] → --shadow-btn-primary
    - checkboxVariants base: data-[state=indeterminate]:shadow-[var(--shadow-btn-primary)] → --shadow-btn-primary
    - checkboxVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - checkboxVariants base: data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - checkboxVariants base: data-[state=indeterminate]:focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
  - checked: CheckboxCheckedState; Controlled state. When omitted, Radix manages state internally. (components[] · packages/ui/src/atoms/checkbox/types.ts)
  - defaultChecked: CheckboxCheckedState; Initial state for an uncontrolled checkbox. (components[] · packages/ui/src/atoms/checkbox/types.ts)
  - disabled: boolean; Prevents focus and activation without replacing the checked state. (components[] · packages/ui/src/atoms/checkbox/types.ts)
  - name: string; Form field name; omitted fields are not included in submission. (components[] · packages/ui/src/atoms/checkbox/types.ts)
  - onCheckedChange: ((checked: CheckboxCheckedState) => void); Notifies a user-driven toggle with the next checked state, never incoming prop changes. From indeterminate the next state is true. (components[] · packages/ui/src/atoms/checkbox/types.ts)
  - required: boolean; Requires a checked value for native form validation through Radix's hidden input. (components[] · packages/ui/src/atoms/checkbox/types.ts)
  - value: string; Value submitted when checked. (components[] · packages/ui/src/atoms/checkbox/types.ts)
### Chip
catalog[] · docs/catalog.json · @egdev/ui · atom · Toggle
- Chip (components[] · packages/ui/src/atoms/chip/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - chipVariants base: gap-1.5 → --spacing
    - chipVariants base: px-2.5 → --spacing
    - chipVariants base: py-1.5 → --spacing
    - chipVariants base: rounded-full → --radius-full
    - chipVariants base: shadow-edge → --shadow-edge
    - chipVariants base: font-sans → --font-sans
    - chipVariants base: text-label-default → --text-label-default
    - chipVariants mode=toggle: data-[state=on]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] → --shadow-edge-strong, --shadow-glow-base
    - chipVariants mode=toggle: focus-visible:shadow-focus → --shadow-focus
    - chipVariants mode=toggle: data-[state=on]:focus-visible:shadow-focus → --shadow-focus
    - chipVariants mode=link: focus-visible:shadow-focus → --shadow-focus
  - children: ReactNode; Visible short label and accessible name in every mode. (components[] · packages/ui/src/atoms/chip/types.ts)
  - defaultPressed: boolean; Initial pressed state when uncontrolled. (components[] · packages/ui/src/atoms/chip/types.ts)
  - disabled: boolean; Removes the chip from the Tab order and blocks toggling; dims it to 45% opacity. (components[] · packages/ui/src/atoms/chip/types.ts)
  - external: boolean; Opens the destination in a new browsing context with safe rel values and a hidden notice. (components[] · packages/ui/src/atoms/chip/types.ts)
  - href: string; Destination of the anchor; required in link mode and rejected in every other mode. (components[] · packages/ui/src/atoms/chip/types.ts)
  - icon: ReactNode; Optional decorative leading visual, hidden from assistive technology. Omitted when absent. Size supplied content to the 14px wrapper; never supply focusable content. (components[] · packages/ui/src/atoms/chip/types.ts)
  - mode: enum; Selects the semantic role and rendered element. Toggle is the pressable default; static renders a plain span and link renders a native anchor. Selects the static role: a non-interactive label pill with no pressed state. Selects the link role: the same pill rendered as a native anchor for a real destination. (components[] · packages/ui/src/atoms/chip/types.ts)
  - newTabText: string; Localized notice appended for assistive technology when external is true. (components[] · packages/ui/src/atoms/chip/types.ts)
  - onPressedChange: ((pressed: boolean) => void); Called with the next pressed state after user interaction only. (components[] · packages/ui/src/atoms/chip/types.ts)
  - pressed: boolean; Controlled pressed state; the chip is uncontrolled when omitted. Incoming updates emit no event. (components[] · packages/ui/src/atoms/chip/types.ts)
### Countdown
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Countdown (components[] · packages/ui/src/atoms/countdown/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - countdownDateVariants base: font-sans → --font-sans
    - countdownDateVariants base: text-body-default → --text-body-default
    - countdownLabelVariants base: font-display → --font-display
    - countdownLabelVariants base: text-label-eyebrow → --text-label-eyebrow
    - countdownNameVariants base: font-display → --font-display
    - countdownNameVariants base: text-label-eyebrow → --text-label-eyebrow
    - countdownRootVariants tone=inherit: text-inherit → unresolved
    - countdownRowVariants base: gap-y-2 → --spacing-2
    - countdownRowVariants base: gap-x-countdown-column → --spacing-countdown-column
    - countdownStatusVariants base: font-sans → --font-sans
    - countdownStatusVariants base: text-body-default → --text-body-default
    - countdownValueVariants base: font-display → --font-display
    - countdownValueVariants size=md: text-countdown-md → --text-countdown-md
    - countdownValueVariants size=sm: text-countdown-sm → --text-countdown-sm
    - countdownValueVariants tone=inherit: text-inherit → unresolved
  - deadline: number; Target instant in Unix epoch milliseconds: a safe integer whose UTC year is 1–9999. Zero and negative values are valid past instants. Strings, Date objects, fractions and non-finite or out-of-range numbers are never coerced: the timer shows unavailableText and runs no clock. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - deadlineText: string; Human-readable date, time and timezone of the deadline, rendered in a native time element. The caller owns its localization and accuracy. A blank value warns and falls back to the deterministic UTC ISO string of the deadline. Omitted for an invalid deadline. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - expiredText: string; Non-live explanation shown beside the zero readout once the deadline is reached. A blank value warns and uses the default. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - initializingText: string; Placeholder shown before the first client clock sample, without digits. A blank value warns and uses the default. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - label: string; Visible label that also names the timer. A blank value warns and uses the default. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - onExpire: ((deadline: number) => void); Called once per deadline episode when the client first observes the deadline reached, including an already-past deadline at mount, with the normalized deadline. Never per tick, render or server render. Absent by default. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - size: enum; Digit scale preset. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - tone: enum; Foreground treatment. `inherit` keeps the host foreground on every part (for example black on a flood field); `canvas` uses white digits with secondary labels and text. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - unavailableText: string; Fallback shown for an invalid deadline, without digits or date metadata. A blank value warns and uses the default. (components[] · packages/ui/src/atoms/countdown/types.ts)
  - units: CountdownUnits; Column labels for days, hours, minutes and seconds, in that fixed order; English `days`, `hours`, `minutes`, `seconds` when omitted. No plural inflection is applied. A tuple with the wrong length or a blank entry warns and uses the complete default tuple. (components[] · packages/ui/src/atoms/countdown/types.ts)
### Dropzone
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Dropzone (components[] · packages/ui/src/atoms/dropzone/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - dropzoneVariants base: p-3 → --spacing-3
    - dropzoneVariants base: rounded-md → --radius-md
    - dropzoneVariants base: [box-shadow:none] → unresolved
    - dropzoneVariants base: text-label-default → --text-label-default
    - dropzoneVariants base: font-sans → --font-sans
    - dropzoneVariants base: text-center → unresolved
    - dropzoneVariants base: focus-visible:shadow-focus → --shadow-focus
    - dropzoneVariants variant=default: gap-1.5 → --spacing
    - dropzoneVariants variant=inline: gap-2.5 → --spacing
  - accept: string; Native picker filter only; dropped and pasted files are never silently rejected. (components[] · packages/ui/src/atoms/dropzone/types.ts)
  - dropLabel: string; Visible text and accessible name while files are dragged over the target. (components[] · packages/ui/src/atoms/dropzone/types.ts)
  - label: string; Resting visible text and native button accessible name. (components[] · packages/ui/src/atoms/dropzone/types.ts)
  - multiple: boolean; Accept several files; otherwise only the first file is delivered from every input path. (components[] · packages/ui/src/atoms/dropzone/types.ts)
  - onFiles: (files: File[]) => void; Receives a non-empty array of picked, dropped or pasted files, without accept/size validation. (components[] · packages/ui/src/atoms/dropzone/types.ts)
  - variant: enum; Square target by default; inline is a full-width row with a 56px minimum height. (components[] · packages/ui/src/atoms/dropzone/types.ts)
### FieldMessage
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- FieldMessage (components[] · packages/ui/src/atoms/field-message/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - fieldMessageVariants base: gap-1.5 → --spacing
    - fieldMessageVariants base: font-sans → --font-sans
    - fieldMessageVariants base: text-label-default → --text-label-default
    - fieldMessageVariants base: font-[var(--text-body-muted--font-weight)] → --text-body-muted--font-weight
  - children: string; Consumer-authored message; an empty string renders nothing. (components[] · packages/ui/src/atoms/field-message/types.ts)
  - icon: enum; Optional decorative glyph override. When omitted, semantic tones derive their status glyph; description has no glyph. No accessible label is added to the icon. (components[] · packages/ui/src/atoms/field-message/types.ts)
  - tone: enum; Semantic text treatment; does not set control validity or a live-region role. (components[] · packages/ui/src/atoms/field-message/types.ts)
### Gauge
catalog[] · docs/catalog.json · @egdev/ui · atom · — (native role=meter)
- Gauge (components[] · packages/ui/src/atoms/gauge/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - gaugeArcVariants base: rounded-full → --radius-full
    - gaugeCenterVariants base: text-label-default → --text-label-default
    - gaugeCenterVariants base: font-sans → --font-sans
    - gaugeCircleVariants base: p-0 → --spacing-0
    - gaugeCircleVariants base: rounded-[var(--radius-full)] → --radius-full
    - gaugeCircleVariants base: [box-shadow:none] → unresolved
    - gaugeCueVariants base: gap-2 → --spacing-2
    - gaugeCueVariants base: text-label-default → --text-label-default
    - gaugeCueVariants base: font-sans → --font-sans
    - gaugeRootVariants base: gap-2 → --spacing-2
    - gaugeRootVariants base: rounded-none → --radius-none
    - gaugeRootVariants base: shadow-none → unresolved
    - gaugeRootVariants base: hover:shadow-none → unresolved
    - gaugeRootVariants base: font-sans → --font-sans
    - gaugeRootVariants base: text-label-default → --text-label-default
  - center: ReactNode; Decorative, non-interactive icon, number or short text; meaning belongs in label or valueText. No center content when omitted. (components[] · packages/ui/src/atoms/gauge/types.ts)
  - label: string; Required non-empty accessible name for the magnitude. (components[] · packages/ui/src/atoms/gauge/types.ts)
  - size: number \| GaugeSize; sm/md/lg use 40/56/80px; any finite positive CSS-pixel diameter, including fractions, has no cap. Invalid numeric sizes fall back to md (56px), independently of measurement clamping. (components[] · packages/ui/src/atoms/gauge/types.ts)
  - state: enum; Consumer-selected condition, independent of value; no automatic thresholds. Consumer-selected non-normal condition; requires stateText, never disabled semantics. (components[] · packages/ui/src/atoms/gauge/types.ts)
  - stateText: string; Optional visible condition description, connected through aria-describedby. Omitted when not supplied in the normal state. Required non-empty visible description, accompanied by an icon and connected through aria-describedby. (components[] · packages/ui/src/atoms/gauge/types.ts)
  - unavailableText: string; Non-empty readable fallback for non-finite values; no measurement, center or state cue is presented. (components[] · packages/ui/src/atoms/gauge/types.ts)
  - value: number; Finite values clamp to 0–100; non-finite values are unavailable. (components[] · packages/ui/src/atoms/gauge/types.ts)
  - valueText: string; Coherent contextual measurement equivalent; retain the normalized decimal value. When omitted for finite values, uses the normalized decimal "X / 100". Non-finite values expose no aria-valuetext. (components[] · packages/ui/src/atoms/gauge/types.ts)
### Icon
catalog[] · docs/catalog.json · @egdev/ui · atom · AccessibleIcon
- Icon (components[] · packages/ui/src/atoms/icon/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - filled: boolean; Fills the glyph with currentColor in addition to its stroke, e.g. a solid play triangle. (components[] · packages/ui/src/atoms/icon/types.ts)
  - label: string; Accessible name for an informative icon, exposed through Radix AccessibleIcon. When omitted or empty, the icon is decorative and hidden from assistive technology. (components[] · packages/ui/src/atoms/icon/types.ts)
  - name: enum; Glyph to draw from the closed system icon set. (components[] · packages/ui/src/atoms/icon/types.ts)
  - size: enum; Preset square size: sm 16px, md 20px (--icon-size), lg 28px. Containers needing other sizes pass a spacing-scale size-* utility in className, which wins over the preset. (components[] · packages/ui/src/atoms/icon/types.ts)
### IconButton
catalog[] · docs/catalog.json · @egdev/ui · atom · Slot + AccessibleIcon
- IconButton (components[] · packages/ui/src/atoms/icon-button/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - iconButtonVariants base: p-0 → --spacing-0
    - iconButtonVariants base: focus-visible:shadow-focus → --shadow-focus
    - iconButtonVariants variant=ghost: rounded-md → --radius-md
    - iconButtonVariants variant=ghost: shadow-none → unresolved
    - iconButtonVariants variant=outline: rounded-full → --radius-full
    - iconButtonVariants variant=outline: shadow-[var(--shadow-edge),var(--shadow-elev-1)] → --shadow-edge, --shadow-elev-1
    - iconButtonVariants variant=outline: [&:not([data-disabled]):hover:not(:focus-visible)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] → --shadow-edge-strong, --shadow-elev-1, --shadow-glow-base
    - iconButtonVariants variant=primary: rounded-md → --radius-md
    - iconButtonVariants variant=primary: shadow-btn-primary → --shadow-btn-primary
    - iconButtonVariants variant=primary: [&:not([data-disabled]):hover:not(:focus-visible):not(:active)]:shadow-btn-primary-hover → --shadow-btn-primary-hover
    - iconButtonVariants variant=primary: [&:not([data-disabled]):active:not(:focus-visible)]:shadow-btn-pressed → --shadow-btn-pressed
    - iconButtonVariants variant=secondary: rounded-md → --radius-md
    - iconButtonVariants variant=secondary: shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)] → --shadow-edge-strong, --shadow-elev-1
    - iconButtonVariants variant=secondary: [&:not([data-disabled]):hover:not(:focus-visible):not(:active)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] → --shadow-edge-strong, --shadow-elev-1, --shadow-glow-base
    - iconButtonVariants variant=secondary: [&:not([data-disabled]):active:not(:focus-visible)]:shadow-btn-pressed → --shadow-btn-pressed
  - asChild: boolean; Apply the control to one child through Radix Slot. The child accepts props and forwards refs. Supply an empty anchor/router link; IconButton inserts its icon and hidden name. (components[] · packages/ui/src/atoms/icon-button/types.ts)
  - children: ReactElement<unknown, string \| JSXElementConstructor<any>>; Single host element when asChild is true; not visible label content. Omitted in native mode. (components[] · packages/ui/src/atoms/icon-button/types.ts)
  - icon: ReactElement<unknown, string \| JSXElementConstructor<any>>; One decorative Icon (without its own label) or SVG element, hidden from assistive technology. (components[] · packages/ui/src/atoms/icon-button/types.ts)
  - label: string; Clear, non-empty accessible name rendered as Radix visually hidden text, not aria-label. (components[] · packages/ui/src/atoms/icon-button/types.ts)
  - size: enum; Square control: sm 32px, md 40px, lg 48px. Glyph: sm 16px, otherwise 20px. Use sm only for dense desktop toolbars; touch layouts provide a hit area of at least 44px. (components[] · packages/ui/src/atoms/icon-button/types.ts)
  - variant: enum; Visual treatment. Outline is the round treatment; it is the web social-row treatment used at lg. Every other treatment uses radius-md. (components[] · packages/ui/src/atoms/icon-button/types.ts)
### Indicator
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Indicator (components[] · packages/ui/src/atoms/indicator/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - indicatorMarkerGeometryVariants base: rounded-full → --radius-full
    - indicatorMarkerPaintVariants variant=dot: shadow-[var(--shadow-edge)] → --shadow-edge
    - indicatorMarkerPaintVariants variant=count: px-1 → --spacing-1
    - indicatorMarkerPaintVariants variant=count: py-0 → --spacing-0
    - indicatorMarkerPaintVariants variant=count: font-sans → --font-sans
    - indicatorMarkerPaintVariants variant=count: text-label-default → --text-label-default
    - indicatorMarkerPaintVariants variant=count: shadow-[var(--shadow-edge),var(--shadow-elev-1)] → --shadow-edge, --shadow-elev-1
    - indicatorMarkerPaintVariants variant=icon: shadow-[var(--shadow-edge),var(--shadow-elev-1)] → --shadow-edge, --shadow-elev-1
  - badgeIcon: enum; Decorative origin glyph; available only in the icon branch. Closed system glyph for origin/network decoration. Meaning belongs in child text/name. (components[] · packages/ui/src/atoms/indicator/types.ts)
  - children: ReactNode; Meaningful anchor content rendered directly, without cloning. Null/empty content is valid. (components[] · packages/ui/src/atoms/indicator/types.ts)
  - count: number; Supplementary total; available only in the count branch. Positive safe-integer total. Zero, invalid and unsafe inputs suppress only the marker. No coercion, rounding, automatic announcement or data clamping. (components[] · packages/ui/src/atoms/indicator/types.ts)
  - max: number; Display overflow threshold; available only in the count branch. Positive safe-integer display threshold. Larger totals show threshold-plus-sign text; invalid thresholds fall back to 99, without invalidating the underlying count. (components[] · packages/ui/src/atoms/indicator/types.ts)
  - position: enum; Physical corner of the shared anchor footprint; does not flip in RTL or avoid collisions. (components[] · packages/ui/src/atoms/indicator/types.ts)
  - size: enum; Marker geometry preset, independent of child dimensions. Counts may grow with text zoom. (components[] · packages/ui/src/atoms/indicator/types.ts)
  - tone: enum; Supplementary signal color family; meaning must also exist in readable consumer content. (components[] · packages/ui/src/atoms/indicator/types.ts)
  - variant: enum; Empty decorative marker. Count and icon branches require their explicit variant. Decimal supplementary count, not a primary measurement. Existing decorative origin/network glyph, not an action. (components[] · packages/ui/src/atoms/indicator/types.ts)
### Input
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Input (components[] · packages/ui/src/atoms/input/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - inputControlVariants base: rounded-md → --radius-md
    - inputControlVariants base: shadow-[var(--shadow-well)] → --shadow-well
    - inputControlVariants base: font-sans → --font-sans
    - inputControlVariants base: focus-visible:shadow-[var(--shadow-well),var(--shadow-focus)] → --shadow-well, --shadow-focus
    - inputControlVariants size=md: px-3 → --spacing-3
    - inputControlVariants size=md: py-2 → --spacing-2
    - inputControlVariants size=md: text-body-default → --text-body-default
    - inputControlVariants size=sm: px-3 → --spacing-3
    - inputControlVariants size=sm: py-1.5 → --spacing
    - inputControlVariants size=sm: text-label-default → --text-label-default
    - inputControlVariants variant=code: font-mono → --font-mono
    - inputControlVariants variant=code: text-code → --text-code
    - inputControlVariants icon=true: pl-9 → --spacing
    - inputControlVariants loading=true: pr-9 → --spacing
    - inputControlVariants {"size":"sm","variant":"default"}: font-[var(--text-body-default--font-weight)] → --text-body-default--font-weight
  - icon: ReactNode; Optional decorative leading icon inside the well, hidden from assistive technology; its meaning must also exist in the accessible name. No icon is rendered when omitted. (components[] · packages/ui/src/atoms/input/types.ts)
  - loading: boolean; Show a decorative trailing Spinner and set aria-busy on the native input. The input stays editable unless disabled or readOnly; the consumer owns status announcements. (components[] · packages/ui/src/atoms/input/types.ts)
  - size: enum; Control height preset: `md` 44px, `sm` 36px for toolbars and dialog footers. (components[] · packages/ui/src/atoms/input/types.ts)
  - type: enum; Text-entry input type, narrowed from the native attribute. (components[] · packages/ui/src/atoms/input/types.ts)
  - variant: enum; Visual treatment; `code` uses the mono font on the darker well for code, URLs and commands. (components[] · packages/ui/src/atoms/input/types.ts)
### Isotipo3D
catalog[] · docs/catalog.json · @egdev/effects · atom · —
- Isotipo3D (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - isotipoRootInvariantVariants base: shadow-none → unresolved
  - dragRotate: boolean; Enables drag-to-rotate offsets that spring back to the scene pose on release. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - flip: boolean; Enables the flip gesture: a drag released past the threshold or a double-click toggles 180°. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - interactive: boolean; Switches to the interactive accessibility model: focusable image role with Arrow-key rotate and Enter/Space flip. Requires a non-empty `label`; without one the component renders its decorative fallback posture and warns in development. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - label: string; Required accessible name for `interactive` mode; ignored while decorative. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - onPoseChange: ((pose: IsotipoPoseChange) => void); Reports the user-driven pose (drag and keyboard offsets in degrees plus the flip state) on gesture changes and on spring-back settle; never for scene or progress prop changes. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - opacity: number; Decorative layer opacity, clamped to [0, 1]. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - paused: boolean; Freezes the idle animation loop at the current pose; gestures still repaint and it resumes when false. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - pointerTilt: boolean; Enables mouse-only cosmetic camera tilt. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - progress: number; Local scene progress, clamped to [0, 1]. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - scene: enum; Animation scene. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
### Isotipo3D
catalog[] · docs/catalog.json · @egdev/effects · atom · —
- Isotipo3D (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - isotipoRootInvariantVariants base: shadow-none → unresolved
  - dragRotate: boolean; Enables drag-to-rotate offsets that spring back to the scene pose on release. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - flip: boolean; Enables the flip gesture: a drag released past the threshold or a double-click toggles 180°. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - interactive: boolean; Switches to the interactive accessibility model: focusable image role with Arrow-key rotate and Enter/Space flip. Requires a non-empty `label`; without one the component renders its decorative fallback posture and warns in development. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - label: string; Required accessible name for `interactive` mode; ignored while decorative. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - onPoseChange: ((pose: IsotipoPoseChange) => void); Reports the user-driven pose (drag and keyboard offsets in degrees plus the flip state) on gesture changes and on spring-back settle; never for scene or progress prop changes. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - opacity: number; Decorative layer opacity, clamped to [0, 1]. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - paused: boolean; Freezes the idle animation loop at the current pose; gestures still repaint and it resumes when false. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - pointerTilt: boolean; Enables mouse-only cosmetic camera tilt. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - progress: number; Local scene progress, clamped to [0, 1]. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
  - scene: enum; Animation scene. (components[] · packages/effects/src/atoms/isotipo3d/types.ts)
### Kbd
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Kbd (components[] · packages/ui/src/atoms/kbd/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - kbdVariants base: rounded-sm → --radius-sm
    - kbdVariants base: px-1.5 → --spacing
    - kbdVariants base: py-0.5 → --spacing
    - kbdVariants base: font-sans → --font-sans
    - kbdVariants base: text-label-default → --text-label-default
  - children: string; Short key text, for example `⌘K`, `Ctrl` or `Esc`. Plain text only; it never wraps. (components[] · packages/ui/src/atoms/kbd/types.ts)
  - label: string; Spoken key name for symbol keys, for example `Command K`. When set, the visible glyph is hidden from assistive technology and this name is read instead. When omitted or empty, the children are read as-is. (components[] · packages/ui/src/atoms/kbd/types.ts)
### Link
catalog[] · docs/catalog.json · @egdev/ui · atom · Slot + VisuallyHidden
- Link (components[] · packages/ui/src/atoms/link/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - linkVariants base: gap-2 → --spacing-2
    - linkVariants base: font-sans → --font-sans
    - linkVariants base: text-label-default → --text-label-default
    - linkVariants base: focus-visible:[box-shadow:var(--shadow-focus)] → --shadow-focus
    - linkVariants base: focus-visible:rounded-sm → --radius-sm
    - linkVariants variant=plain: pb-0 → --spacing-0
    - linkVariants variant=underlined: pb-0.5 → --spacing
  - arrow: boolean; Show the trailing decorative right arrow, independent of external. (components[] · packages/ui/src/atoms/link/types.ts)
  - asChild: boolean; Use the native anchor; href supplies its destination. Render onto one prop-spreading, ref-forwarding anchor child through Radix Slot. The child owns href and must preserve anchor navigation semantics. (components[] · packages/ui/src/atoms/link/types.ts)
  - children: ReactNode; Descriptive visible link text; exactly one anchor element when asChild is true. (components[] · packages/ui/src/atoms/link/types.ts)
  - external: boolean; Open in a new tab with safe rel tokens and a hidden notice; the arrow still points right. (components[] · packages/ui/src/atoms/link/types.ts)
  - href: string; Native destination, required unless asChild is true. Not available with asChild: the child supplies its destination. (components[] · packages/ui/src/atoms/link/types.ts)
  - newTabText: string; Localized screen-reader notice appended only when external is true. (components[] · packages/ui/src/atoms/link/types.ts)
  - variant: enum; Appearance axis: plain keeps the borderless brand-coloured text; underlined adds the 1px brand hairline under the label, which turns neon on hover. Paint only; it never implies interactivity. (components[] · packages/ui/src/atoms/link/types.ts)
### Logo
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Logo (components[] · packages/ui/src/atoms/logo/types.ts)
  - Copyable inline SVG (mark) · assets[] · packages/ui/src/atoms/logo/Logo.tsx, packages/ui/src/atoms/logo/useLogo.ts, packages/ui/src/atoms/logo/logo-artwork.ts, packages/ui/src/atoms/logo/types.ts · tokens: --logo-red, --logo-red-shade
    Define these CSS custom properties from the token tables in the artboard. Wordmark is for canvas or surface backgrounds; use an appropriate accessible name or link.

```html
<svg role="img" aria-label="egdev" viewBox="0 0 638.45 612.37"><polygon fill="var(--logo-red)" points="415.52 185.14 415.52 231.18 350.31 197.81 350.31 315.25 638.45 466.95 638.45 297.64 415.52 185.14"></polygon><polygon fill="var(--logo-red-shade)" points="288.15 152.23 288.15 315.25 0 466.95 0 297.64 288.15 152.23"></polygon><polygon fill="var(--logo-red)" points="0 297.64 288.15 449.34 288.15 612.37 0 466.95 0 297.64"></polygon><polygon fill="var(--logo-red-shade)" points="638.45 297.64 350.31 449.34 350.31 612.37 638.45 466.95 638.45 297.64"></polygon><polygon fill="var(--logo-red)" points="432.36 157.09 353.05 116.52 353.05 37.2 432.36 77.77 432.36 157.09"></polygon><polygon fill="var(--logo-red)" points="521.88 74.4 472.66 49.22 472.66 0 521.88 25.18 521.88 74.4"></polygon><polygon fill="var(--logo-red)" points="555.8 219.34 487.96 184.64 487.96 116.8 555.8 151.5 555.8 219.34"></polygon></svg>
```
  - Copyable inline SVG (wordmark) · assets[] · packages/ui/src/atoms/logo/Logo.tsx, packages/ui/src/atoms/logo/useLogo.ts, packages/ui/src/atoms/logo/logo-artwork.ts, packages/ui/src/atoms/logo/types.ts · tokens: --color-primitive-white, --logo-red, --logo-red-shade
    Define these CSS custom properties from the token tables in the artboard. Wordmark is for canvas or surface backgrounds; use an appropriate accessible name or link.

```html
<svg role="img" aria-label="egdev" viewBox="0 0 653 258"><path fill="var(--color-primitive-white)" d="M381.632 89.944C382.315 90.0293 382.955 90.4133 383.552 91.096C383.637 91.2667 383.509 91.3947 383.168 91.48C383.083 91.48 382.912 91.5227 382.656 91.608H382.4L381.632 91.992H381.888C382.059 91.992 382.144 91.992 382.144 91.992L381.376 92.248C381.205 92.3333 380.992 92.4613 380.736 92.632L380.48 92.76C379.968 93.016 379.669 93.1013 379.584 93.016C379.413 93.1013 379.157 93.1867 378.816 93.272C378.56 93.3573 378.304 93.4853 378.048 93.656C377.877 93.7413 377.749 93.8267 377.664 93.912C377.323 93.912 377.067 93.9973 376.896 94.168C376.725 94.3387 376.512 94.424 376.256 94.424C375.659 94.68 374.848 95.0213 373.824 95.448C372.885 95.8747 372.075 96.216 371.392 96.472C370.795 96.728 370.283 96.8987 369.856 96.984C369.515 97.3253 369.216 97.4533 368.96 97.368C368.448 97.4533 367.851 97.6667 367.168 98.008C366.571 98.264 365.973 98.52 365.376 98.776C364.864 99.032 364.352 99.288 363.84 99.544C363.413 99.7147 363.029 99.8 362.688 99.8C362.432 99.8 362.261 99.672 362.176 99.416L361.408 99.288C361.408 99.2027 361.493 99.1173 361.664 99.032C353.216 103.981 346.645 107.096 341.952 108.376C339.051 109.571 337.173 110.168 336.32 110.168C334.784 111.021 334.101 112.088 334.272 113.368C334.101 113.368 333.973 113.453 333.888 113.624C333.803 113.709 333.845 113.837 334.016 114.008C334.101 114.264 334.059 114.605 333.888 115.032C333.717 115.373 333.76 115.587 334.016 115.672C333.845 116.44 333.632 117.208 333.376 117.976C333.12 118.659 332.992 119.171 332.992 119.512C332.907 119.853 332.779 120.195 332.608 120.536C332.523 120.792 332.48 120.92 332.48 120.92C332.565 121.261 332.267 122.456 331.584 124.504C331.328 125.357 331.456 125.784 331.968 125.784C332.053 125.699 332.181 125.656 332.352 125.656C334.315 125.4 335.765 125.443 336.704 125.784C338.24 125.528 339.093 125.485 339.264 125.656C339.349 125.485 340.971 125.357 344.128 125.272L346.176 125.016C346.176 125.016 346.091 125.016 345.92 125.016C345.493 124.931 345.621 124.845 346.304 124.76C346.475 124.76 346.645 124.803 346.816 124.888C346.987 124.973 347.115 125.101 347.2 125.272C347.371 125.357 347.499 125.4 347.584 125.4C347.499 125.571 347.541 125.656 347.712 125.656C347.968 125.656 348.139 125.699 348.224 125.784C348.309 125.784 348.352 125.827 348.352 125.912C348.437 125.912 348.523 125.997 348.608 126.168C348.779 126.424 348.864 126.509 348.864 126.424C348.693 126.851 348.565 126.851 348.48 126.424C348.395 126.595 348.48 126.808 348.736 127.064C349.077 127.235 348.864 127.491 348.096 127.832C347.328 128.429 345.792 129.752 343.488 131.8C341.184 133.848 339.349 135.256 337.984 136.024C337.472 136.28 336.96 136.579 336.448 136.92C335.936 137.176 335.467 137.432 335.04 137.688C334.699 137.859 334.357 138.029 334.016 138.2C334.016 138.285 334.016 138.328 334.016 138.328C333.163 138.584 332.309 138.968 331.456 139.48C330.688 139.907 330.048 140.163 329.536 140.248C328.939 140.333 328.299 140.675 327.616 141.272C326.933 141.869 326.464 142.168 326.208 142.168C325.099 143.96 323.733 146.648 322.112 150.232C320.576 153.816 319.765 155.736 319.68 155.992C319.509 156.589 319.125 157.229 318.528 157.912C318.016 158.509 317.803 158.979 317.888 159.32C317.803 159.576 317.632 159.832 317.376 160.088C317.12 160.259 316.949 160.387 316.864 160.472C316.779 160.557 316.821 160.685 316.992 160.856C316.907 161.112 316.736 161.283 316.48 161.368C316.224 161.453 316.011 161.624 315.84 161.88C315.669 162.307 315.499 162.733 315.328 163.16C315.157 163.501 314.944 163.8 314.688 164.056C314.517 164.312 314.304 164.653 314.048 165.08C313.877 165.421 313.707 165.763 313.536 166.104C313.28 166.445 313.067 166.744 312.896 167C312.725 167.256 312.597 167.469 312.512 167.64C312.427 167.811 312.299 168.024 312.128 168.28C312.043 168.536 311.957 168.749 311.872 168.92C311.872 169.005 311.744 169.219 311.488 169.56C311.317 169.816 311.189 170.115 311.104 170.456C311.019 170.712 310.976 170.925 310.976 171.096C311.317 171.011 311.488 171.011 311.488 171.096C311.317 171.437 311.147 171.565 310.976 171.48C310.805 171.309 310.72 171.267 310.72 171.352C310.635 171.608 310.635 171.736 310.72 171.736L311.104 171.864C310.848 172.547 310.635 172.717 310.464 172.376C310.379 172.205 310.293 172.163 310.208 172.248C310.208 172.333 310.293 172.461 310.464 172.632C310.72 172.888 310.72 173.059 310.464 173.144C310.293 173.315 310.208 173.528 310.208 173.784C310.208 173.955 310.037 173.912 309.696 173.656V174.68L309.568 174.552C309.397 174.637 309.312 174.68 309.312 174.68C309.653 174.936 309.653 175.107 309.312 175.192C309.056 175.192 308.971 175.235 309.056 175.32C308.971 175.491 308.843 175.747 308.672 176.088C308.501 176.344 308.373 176.557 308.288 176.728C308.288 176.813 308.245 177.027 308.16 177.368C308.075 177.624 308.075 177.837 308.16 178.008C308.331 178.008 308.416 177.923 308.416 177.752C308.501 177.667 308.672 177.624 308.928 177.624C309.269 177.539 309.483 177.581 309.568 177.752C309.312 177.496 309.227 177.283 309.312 177.112C309.397 176.856 309.483 176.685 309.568 176.6C309.739 176.515 309.952 176.429 310.208 176.344C310.464 176.173 310.635 176.045 310.72 175.96C311.147 175.875 311.531 175.576 311.872 175.064C312.299 174.552 312.597 174.253 312.768 174.168C312.939 174.168 313.067 174.083 313.152 173.912C313.323 173.741 313.408 173.613 313.408 173.528C313.493 173.443 313.621 173.443 313.792 173.528C313.963 173.272 314.091 173.101 314.176 173.016C314.347 172.931 314.56 172.888 314.816 172.888C315.072 172.888 315.243 172.888 315.328 172.888C315.499 172.291 315.968 171.864 316.736 171.608C317.504 171.267 317.845 170.797 317.76 170.2C317.76 170.285 317.717 170.328 317.632 170.328C317.717 170.243 317.76 170.285 317.76 170.456C317.845 170.627 317.845 170.712 317.76 170.712C317.931 170.712 318.016 170.669 318.016 170.584C318.016 170.413 318.016 170.328 318.016 170.328C318.272 170.243 318.4 170.2 318.4 170.2C318.485 170.371 318.571 170.371 318.656 170.2C318.741 169.944 318.869 169.859 319.04 169.944C318.955 169.688 319.125 169.475 319.552 169.304C319.979 169.048 320.192 168.92 320.192 168.92C321.387 167.299 322.453 166.36 323.392 166.104C323.563 166.019 323.733 165.848 323.904 165.592C324.16 165.251 324.373 165.08 324.544 165.08C325.312 164.397 325.696 164.056 325.696 164.056C325.867 163.971 325.952 163.928 325.952 163.928C326.037 163.757 326.251 163.672 326.592 163.672C326.592 163.672 326.635 163.587 326.72 163.416C326.805 163.245 326.848 163.16 326.848 163.16C326.933 163.075 327.061 163.075 327.232 163.16C327.317 162.733 327.531 162.435 327.872 162.264L328 162.136H328.128C328.64 161.709 329.109 161.496 329.536 161.496C329.792 161.24 330.091 160.899 330.432 160.472C330.773 160.131 330.944 160.088 330.944 160.344C331.968 158.893 332.907 158.168 333.76 158.168C333.931 158.168 334.016 158.211 334.016 158.296V158.168C333.76 157.912 333.888 157.699 334.4 157.528C334.912 157.357 335.04 157.101 334.784 156.76C335.467 156.675 335.808 156.675 335.808 156.76C335.723 156.504 335.723 156.333 335.808 156.248C335.979 156.077 336.149 155.992 336.32 155.992C336.491 155.907 336.576 155.821 336.576 155.736C336.576 155.48 336.747 155.309 337.088 155.224C337.429 155.139 337.6 155.096 337.6 155.096C337.856 154.925 338.112 154.755 338.368 154.584C338.624 154.328 338.837 154.157 339.008 154.072C339.179 153.901 339.349 153.816 339.52 153.816C340.715 152.963 341.653 152.28 342.336 151.768C342.592 151.597 342.805 151.427 342.976 151.256C343.147 151.085 343.317 150.957 343.488 150.872C343.659 150.787 343.787 150.701 343.872 150.616C344.043 150.531 344.213 150.403 344.384 150.232C344.555 150.061 344.725 149.891 344.896 149.72C345.579 149.635 346.005 149.421 346.176 149.08C346.432 148.739 346.688 148.568 346.944 148.568C347.029 148.227 347.157 148.056 347.328 148.056C347.499 148.056 347.584 148.013 347.584 147.928C348.779 147.075 349.419 146.648 349.504 146.648C349.589 146.477 349.717 146.307 349.888 146.136C350.059 145.88 350.187 145.709 350.272 145.624C350.699 145.368 351.211 145.325 351.808 145.496C352.405 145.24 352.789 145.453 352.96 146.136C352.021 146.989 351.509 147.416 351.424 147.416C351.424 147.331 351.424 147.245 351.424 147.16C351.083 147.501 350.784 147.885 350.528 148.312C350.357 148.653 350.187 148.867 350.016 148.952C350.016 149.123 349.803 149.336 349.376 149.592C348.949 149.848 348.736 149.976 348.736 149.976C348.736 150.061 348.779 150.147 348.864 150.232C348.949 150.317 348.907 150.36 348.736 150.36C348.48 150.445 348.224 150.744 347.968 151.256C346.859 152.621 345.877 153.56 345.024 154.072V154.456C345.024 154.541 344.981 154.627 344.896 154.712C344.469 155.309 344.213 155.523 344.128 155.352C343.957 155.181 343.872 155.096 343.872 155.096C343.787 155.096 343.744 155.181 343.744 155.352C343.829 155.437 343.829 155.48 343.744 155.48L343.488 155.224L343.616 155.864V156.12C343.531 156.12 343.403 156.248 343.232 156.504C343.061 156.675 342.848 156.888 342.592 157.144C342.421 157.4 342.208 157.571 341.952 157.656C341.867 157.741 341.739 157.869 341.568 158.04C341.483 158.125 341.397 158.253 341.312 158.424C341.227 158.509 341.141 158.552 341.056 158.552C339.093 161.283 336.96 163.16 334.656 164.184C334.229 163.757 334.016 163.672 334.016 163.928C334.016 164.099 333.973 164.227 333.888 164.312C333.888 164.397 333.973 164.483 334.144 164.568C334.485 164.909 334.571 165.165 334.4 165.336C333.888 165.848 333.632 166.104 333.632 166.104C333.461 166.531 333.333 166.531 333.248 166.104C333.163 166.019 333.12 165.933 333.12 165.848L332.992 166.104C333.077 166.616 333.035 166.915 332.864 167C332.693 167 332.565 167.085 332.48 167.256C332.224 167.341 331.797 167.64 331.2 168.152C330.688 168.579 330.304 168.792 330.048 168.792C329.877 168.877 329.792 168.92 329.792 168.92C329.621 168.664 329.536 168.707 329.536 169.048C329.451 168.877 329.408 168.92 329.408 169.176C329.323 169.603 329.237 169.816 329.152 169.816C328.896 169.987 328.725 169.901 328.64 169.56C328.896 170.243 328.939 170.712 328.768 170.968C328.597 171.224 328.171 171.565 327.488 171.992C326.891 172.419 326.507 172.675 326.336 172.76C326.08 172.931 325.867 173.101 325.696 173.272C325.525 173.443 325.312 173.656 325.056 173.912C324.885 174.168 324.715 174.381 324.544 174.552C324.373 174.723 324.203 174.851 324.032 174.936C323.776 175.107 323.52 175.277 323.264 175.448C323.008 175.619 322.837 175.747 322.752 175.832C322.667 175.832 322.581 175.917 322.496 176.088C322.411 176.173 322.325 176.301 322.24 176.472C321.899 176.557 321.643 176.728 321.472 176.984C321.301 177.24 321.216 177.411 321.216 177.496C319.339 179.032 317.717 180.099 316.352 180.696C316.267 180.781 316.267 180.867 316.352 180.952C316.181 181.037 316.053 181.037 315.968 180.952C315.712 180.611 315.669 180.397 315.84 180.312C316.011 180.227 316.139 180.355 316.224 180.696C316.309 180.184 316.224 179.928 315.968 179.928C315.797 179.928 315.541 180.013 315.2 180.184C314.859 180.355 314.688 180.44 314.688 180.44C313.835 180.952 313.365 181.293 313.28 181.464C313.536 181.464 313.536 181.677 313.28 182.104C313.195 182.445 313.237 182.616 313.408 182.616C313.408 182.531 313.493 182.445 313.664 182.36L314.176 181.976C314.603 181.549 314.987 181.507 315.328 181.848C315.584 182.019 315.499 182.189 315.072 182.36C314.731 182.616 314.133 182.915 313.28 183.256C312.427 183.683 311.829 184.152 311.488 184.664C311.317 184.92 310.421 185.389 308.8 186.072C308.459 186.243 308.416 186.371 308.672 186.456C308.587 186.797 308.373 186.84 308.032 186.584C307.691 186.328 307.52 186.2 307.52 186.2C307.861 186.797 307.733 187.139 307.136 187.224C306.624 187.395 306.368 187.523 306.368 187.608C306.795 187.523 307.051 187.523 307.136 187.608C307.221 187.693 307.136 187.779 306.88 187.864C306.624 188.035 306.411 188.12 306.24 188.12C305.984 188.12 305.387 188.248 304.448 188.504C303.509 188.845 302.997 188.803 302.912 188.376C302.997 188.632 302.997 188.803 302.912 188.888C302.827 188.973 302.741 189.016 302.656 189.016C302.656 189.016 302.613 189.016 302.528 189.016C302.357 188.76 302.016 188.547 301.504 188.376C301.077 188.205 300.821 188.035 300.736 187.864C297.408 187.864 295.317 187.352 294.464 186.328C293.611 185.389 293.653 183.555 294.592 180.824C294.336 180.653 294.293 180.269 294.464 179.672C294.635 178.989 294.72 178.605 294.72 178.52C294.805 178.264 294.933 177.965 295.104 177.624C295.189 177.283 295.232 177.112 295.232 177.112C295.829 175.405 296.725 172.461 297.92 168.28C298.688 166.317 299.115 165.293 299.2 165.208C299.115 164.867 299.072 164.653 299.072 164.568C299.157 164.397 299.243 164.184 299.328 163.928C299.499 163.587 299.584 163.373 299.584 163.288C302.4 155.523 304.064 151.171 304.576 150.232C304.149 149.976 303.936 149.805 303.936 149.72V149.464C303.509 149.379 303.211 149.293 303.04 149.208C302.869 149.037 302.699 148.781 302.528 148.44C302.357 148.099 302.144 147.843 301.888 147.672C301.632 147.501 301.035 147.245 300.096 146.904C299.157 146.563 298.475 146.221 298.048 145.88C297.621 145.539 297.579 145.155 297.92 144.728C298.091 144.387 298.048 144.301 297.792 144.472L297.024 145.112C295.915 144.173 295.36 143.661 295.36 143.576C295.275 143.405 295.147 143.192 294.976 142.936C294.549 142.339 294.507 141.955 294.848 141.784C294.848 141.613 294.933 141.443 295.104 141.272C295.189 141.016 295.232 140.845 295.232 140.76C295.403 140.248 295.872 139.736 296.64 139.224C297.408 138.627 297.92 138.157 298.176 137.816C298.176 137.56 298.389 137.304 298.816 137.048C299.243 136.792 299.456 136.621 299.456 136.536C299.541 136.365 299.669 136.28 299.84 136.28C299.925 136.28 299.968 136.237 299.968 136.152C303.723 133.848 306.837 132.397 309.312 131.8C309.397 131.629 309.525 131.544 309.696 131.544C309.952 131.459 310.208 131.416 310.464 131.416C310.805 131.331 311.019 131.245 311.104 131.16C311.701 130.904 312.085 130.392 312.256 129.624C312.427 128.856 312.555 128.429 312.64 128.344C313.323 127.064 313.707 126.168 313.792 125.656C313.877 125.571 313.92 125.443 313.92 125.272C314.005 125.101 314.048 124.973 314.048 124.888C314.048 124.717 314.091 124.632 314.176 124.632C314.773 123.523 315.371 121.944 315.968 119.896C316.651 117.848 317.205 116.312 317.632 115.288C317.205 115.373 316.651 115.288 315.968 115.032C315.371 114.776 314.944 114.691 314.688 114.776C313.835 115.032 313.109 114.989 312.512 114.648C312 114.307 311.531 113.795 311.104 113.112C310.677 112.344 310.336 111.832 310.08 111.576C309.909 111.235 309.653 110.979 309.312 110.808C308.971 110.552 308.587 110.339 308.16 110.168C307.733 109.997 307.435 109.784 307.264 109.528C306.667 109.016 306.197 108.589 305.856 108.248C305.6 107.907 305.344 107.608 305.088 107.352C304.832 107.096 304.789 106.84 304.96 106.584C305.131 106.243 305.216 106.029 305.216 105.944C305.301 105.773 305.557 105.432 305.984 104.92C306.496 104.323 306.88 103.896 307.136 103.64C307.221 103.555 307.307 103.469 307.392 103.384C308.331 103.128 308.843 102.957 308.928 102.872C309.269 102.701 309.525 102.573 309.696 102.488C309.952 102.403 310.165 102.36 310.336 102.36C310.507 102.275 310.635 102.189 310.72 102.104C311.061 102.019 311.317 101.891 311.488 101.72C311.659 101.549 311.787 101.464 311.872 101.464C312.64 101.805 313.195 101.805 313.536 101.464C313.963 101.123 314.389 100.995 314.816 101.08C315.243 100.909 315.243 100.781 314.816 100.696C314.901 100.355 315.072 100.141 315.328 100.056C315.669 99.9707 315.968 100.013 316.224 100.184C316.48 100.269 316.608 100.397 316.608 100.568L316.864 100.44C316.864 100.184 316.992 99.9707 317.248 99.8C317.504 99.544 317.803 99.3733 318.144 99.288C318.485 99.1173 318.869 98.9893 319.296 98.904C319.808 98.7333 320.235 98.6053 320.576 98.52C320.917 98.4347 321.216 98.392 321.472 98.392C321.813 98.3067 321.984 98.264 321.984 98.264C324.885 97.4107 326.891 96.984 328 96.984C328.683 96.8987 329.92 96.472 331.712 95.704C335.552 95.2773 337.771 94.9787 338.368 94.808C338.368 95.1493 338.581 95.2773 339.008 95.192L339.136 95.064C339.392 95.2347 339.776 95.32 340.288 95.32C340.885 95.2347 341.227 95.2347 341.312 95.32C342.08 94.4667 343.445 94.1253 345.408 94.296C345.408 94.552 345.493 94.6373 345.664 94.552C345.835 94.3813 345.92 94.3387 345.92 94.424C346.005 94.424 346.133 94.4667 346.304 94.552C346.56 94.552 346.731 94.5947 346.816 94.68C346.901 94.5947 347.029 94.4667 347.2 94.296C347.371 94.1253 347.499 93.9973 347.584 93.912C347.755 93.8267 347.925 93.7413 348.096 93.656C348.267 93.5707 348.395 93.5707 348.48 93.656C348.651 93.656 348.779 93.7413 348.864 93.912C349.803 93.4853 350.955 93.1867 352.32 93.016C353.771 92.8453 354.88 92.8453 355.648 93.016C355.733 93.016 355.819 93.0587 355.904 93.144C355.989 92.888 356.245 92.6747 356.672 92.504C357.099 92.3333 357.397 92.3333 357.568 92.504C358.336 92.76 358.72 92.888 358.72 92.888C358.891 92.7173 359.147 92.5467 359.488 92.376C359.829 92.12 360.128 91.992 360.384 91.992C360.555 91.9067 360.768 91.864 361.024 91.864C361.28 91.7787 361.493 91.7787 361.664 91.864C361.835 91.864 361.963 91.9067 362.048 91.992C362.219 91.992 362.347 91.992 362.432 91.992C362.603 91.992 363.029 91.9067 363.712 91.736C364.395 91.48 364.864 91.3947 365.12 91.48C365.717 91.736 366.144 91.7787 366.4 91.608C366.656 91.352 366.955 91.224 367.296 91.224C368.661 91.224 369.899 91.1813 371.008 91.096C372.117 90.9253 373.013 90.8827 373.696 90.968C373.952 91.3093 374.379 91.352 374.976 91.096V90.84C374.805 90.4987 374.891 90.4133 375.232 90.584C375.829 90.9253 376.128 91.096 376.128 91.096C376.128 91.096 376.085 91.0533 376 90.968C375.403 90.712 375.403 90.584 376 90.584C376.256 90.584 376.469 90.584 376.64 90.584C376.811 90.4133 377.451 90.2853 378.56 90.2C379.755 90.1147 380.437 90.0293 380.608 89.944C380.608 90.0293 380.651 90.0293 380.736 89.944C380.992 90.0293 381.12 90.0293 381.12 89.944C381.205 89.8587 381.376 89.8587 381.632 89.944ZM315.584 100.824C315.669 100.824 315.712 100.824 315.712 100.824H315.584ZM351.68 146.648C351.595 146.648 351.552 146.648 351.552 146.648H351.68ZM349.504 148.056H349.376C349.205 148.227 349.163 148.312 349.248 148.312C349.248 148.312 349.333 148.227 349.504 148.056ZM348.48 148.184V148.056V148.184ZM348.224 149.464C348.224 149.464 348.181 149.549 348.096 149.72C348.011 149.805 347.968 149.848 347.968 149.848L349.376 148.44H349.248L348.224 149.464ZM333.888 164.952C333.888 164.867 333.888 164.824 333.888 164.824C333.888 164.824 333.845 164.824 333.76 164.824L333.888 164.952ZM329.152 161.752C328.981 161.667 328.896 161.624 328.896 161.624V161.88H329.024L329.152 161.752ZM327.488 165.592L328.256 164.696C328.256 164.696 328.171 164.739 328 164.824C327.488 165.251 327.317 165.507 327.488 165.592ZM327.744 168.28C327.317 168.451 327.019 168.707 326.848 169.048C326.848 169.133 326.891 169.176 326.976 169.176C327.403 169.005 327.659 168.707 327.744 168.28ZM325.952 169.816C325.867 169.816 325.781 169.901 325.696 170.072C325.611 170.157 325.568 170.2 325.568 170.2L325.696 170.328L326.336 169.688C326.251 169.688 326.123 169.731 325.952 169.816ZM312.64 183.128C313.067 182.787 313.237 182.616 313.152 182.616C313.067 182.616 312.811 182.659 312.384 182.744C312.299 182.915 312.384 183.043 312.64 183.128ZM346.816 125.144C346.816 125.059 346.773 124.973 346.688 124.888L346.816 125.144ZM339.648 130.904L339.776 130.776L339.648 130.904ZM339.52 130.648C339.52 130.563 339.52 130.52 339.52 130.52C339.52 130.52 339.477 130.52 339.392 130.52L339.52 130.648ZM338.88 131.032V131.16C338.965 131.16 338.965 131.117 338.88 131.032ZM360.384 94.296V94.168C360.299 94.168 360.299 94.2107 360.384 94.296ZM360.384 94.04C360.299 94.04 360.256 94.04 360.256 94.04H360.384ZM359.616 98.648C359.701 98.5627 359.787 98.52 359.872 98.52C359.872 98.008 359.659 97.9227 359.232 98.264C359.061 98.3493 359.061 98.4347 359.232 98.52C359.317 98.6053 359.445 98.648 359.616 98.648ZM362.304 93.912H362.176H362.304ZM363.456 93.656L363.328 93.784L363.456 93.656ZM364.48 93.528C364.565 93.6133 364.608 93.656 364.608 93.656L364.48 93.528ZM366.272 93.4H366.4H366.272ZM367.936 93.144L368.96 93.016C369.387 93.016 369.6 93.016 369.6 93.016L369.856 92.888C369.429 92.888 368.789 92.9733 367.936 93.144ZM417.402 123.608C417.317 123.864 417.274 124.035 417.274 124.12C417.359 124.205 417.445 124.291 417.53 124.376C417.615 124.461 417.658 124.547 417.658 124.632C417.743 125.229 417.615 126.04 417.274 127.064C417.018 128.088 416.933 128.899 417.018 129.496C416.677 129.837 416.506 130.051 416.506 130.136C416.421 130.477 416.293 130.861 416.122 131.288C415.951 131.715 415.781 132.141 415.61 132.568C415.439 132.909 415.311 133.208 415.226 133.464C414.202 135.341 413.434 136.92 412.922 138.2C412.751 138.456 412.538 138.883 412.282 139.48C412.026 140.077 411.813 140.461 411.642 140.632C411.471 140.888 410.49 142.936 408.698 146.776C407.674 148.568 406.309 151.256 404.602 154.84C402.895 158.339 401.487 160.984 400.378 162.776C399.781 164.397 398.245 168.067 395.77 173.784C393.381 179.501 391.717 183.725 390.778 186.456C390.693 186.627 390.138 188.077 389.114 190.808C389.029 191.32 388.815 192.003 388.474 192.856C387.621 194.819 386.938 196.611 386.426 198.232C386.426 198.232 386.383 198.275 386.298 198.36C386.213 198.531 386.127 198.701 386.042 198.872C385.957 199.043 385.871 199.171 385.786 199.256C385.786 199.427 385.743 199.555 385.658 199.64C385.658 199.725 385.658 199.811 385.658 199.896C384.549 202.371 383.994 203.779 383.994 204.12C383.738 204.291 383.482 204.547 383.226 204.888C383.055 205.315 383.141 205.528 383.482 205.528C383.311 205.699 383.141 205.869 382.97 206.04C382.885 206.211 382.799 206.339 382.714 206.424C382.714 206.595 382.671 206.723 382.586 206.808C382.586 207.064 382.501 207.363 382.33 207.704C382.245 208.045 382.159 208.259 382.074 208.344C382.074 208.429 382.031 208.515 381.946 208.6C381.946 208.515 381.946 208.472 381.946 208.472C381.946 208.557 381.903 208.685 381.818 208.856C381.733 209.368 381.562 209.667 381.306 209.752C381.306 209.752 381.178 210.093 380.922 210.776H381.05C380.965 210.776 380.751 211.075 380.41 211.672L380.154 212.184C380.069 212.099 380.026 211.928 380.026 211.672C380.026 211.672 380.026 211.587 380.026 211.416C380.111 211.331 380.154 211.16 380.154 210.904C380.154 210.733 380.154 210.52 380.154 210.264C380.154 210.093 380.154 209.923 380.154 209.752C380.239 209.581 380.282 209.453 380.282 209.368L380.026 209.496C380.197 209.325 380.282 209.069 380.282 208.728L380.41 208.6C380.325 208.429 380.282 208.216 380.282 207.96C380.197 207.704 380.111 207.576 380.026 207.576C380.026 207.661 380.026 207.704 380.026 207.704C379.941 207.789 379.898 207.875 379.898 207.96C379.813 208.045 379.727 208.259 379.642 208.6C379.642 208.941 379.642 209.197 379.642 209.368C379.642 209.624 379.685 209.752 379.77 209.752C379.599 209.923 379.471 209.88 379.386 209.624L379.514 209.368L379.386 209.24C379.301 209.155 379.258 209.112 379.258 209.112C379.258 209.197 379.215 209.24 379.13 209.24C378.959 209.411 378.959 209.88 379.13 210.648C379.13 210.733 379.087 210.861 379.002 211.032C379.002 211.203 379.002 211.331 379.002 211.416C378.917 211.245 378.874 210.691 378.874 209.752C378.874 208.899 378.789 208.429 378.618 208.344L378.746 208.216C378.575 207.277 378.49 206.723 378.49 206.552C379.77 195.373 381.775 184.877 384.506 175.064C384.506 174.637 384.933 173.229 385.786 170.84C385.786 170.669 385.743 170.541 385.658 170.456C385.402 170.712 385.274 170.84 385.274 170.84C385.274 170.84 385.231 170.968 385.146 171.224C385.061 171.48 384.975 171.651 384.89 171.736C384.89 171.821 384.805 171.949 384.634 172.12C384.549 172.291 384.421 172.419 384.25 172.504C384.079 172.589 383.909 172.675 383.738 172.76H383.61C383.013 173.528 382.543 173.869 382.202 173.784C382.117 174.125 381.946 174.467 381.69 174.808C381.434 175.064 381.093 175.363 380.666 175.704C380.239 176.045 379.983 176.216 379.898 176.216C379.557 176.472 379.087 176.856 378.49 177.368C377.893 177.88 377.338 178.264 376.826 178.52C376.399 178.776 375.973 178.904 375.546 178.904C375.205 179.416 374.437 180.056 373.242 180.824C372.133 181.507 371.535 181.891 371.45 181.976L370.17 182.616H370.298C370.81 182.787 370.81 182.957 370.298 183.128C369.786 183.299 369.445 183.256 369.274 183C369.103 183.171 368.89 183.256 368.634 183.256C369.317 183.683 369.103 183.981 367.994 184.152C367.823 184.152 367.61 184.152 367.354 184.152C366.927 184.237 366.714 184.28 366.714 184.28C366.373 184.195 366.031 184.323 365.69 184.664C365.434 184.749 365.007 184.792 364.41 184.792C363.898 184.877 363.599 184.92 363.514 184.92C363.173 185.176 362.533 185.048 361.594 184.536C360.741 184.109 360.314 183.896 360.314 183.896C359.887 183.64 359.461 183.427 359.034 183.256C358.693 183.171 358.223 183.085 357.626 183C357.114 183 356.773 183 356.602 183C355.578 182.744 354.938 182.616 354.682 182.616C353.231 181.507 352.293 180.696 351.866 180.184C351.866 180.013 351.823 179.885 351.738 179.8C351.226 178.861 350.97 178.221 350.97 177.88C350.714 176.941 350.501 176.003 350.33 175.064C350.159 174.125 350.074 173.101 350.074 171.992C350.074 170.797 350.117 169.816 350.202 169.048C350.202 168.28 350.33 167.213 350.586 165.848C350.757 164.483 350.885 163.587 350.97 163.16C350.97 162.648 351.141 161.624 351.482 160.088C351.738 158.552 351.909 157.656 351.994 157.4C352.506 155.437 352.762 154.328 352.762 154.072C352.933 153.645 353.103 152.92 353.274 151.896C353.445 150.872 353.615 150.104 353.786 149.592C354.042 148.995 354.298 148.611 354.554 148.44C354.213 148.269 354.213 147.672 354.554 146.648C354.895 145.624 355.066 145.069 355.066 144.984C355.237 144.643 355.365 144.301 355.45 143.96C355.535 143.533 355.578 143.149 355.578 142.808C355.663 142.467 355.749 142.168 355.834 141.912C355.919 141.741 356.005 141.528 356.09 141.272V141.144C356.09 141.144 356.09 141.101 356.09 141.016C356.346 140.248 356.773 139.053 357.37 137.432C358.053 135.725 358.522 134.488 358.778 133.72C359.119 133.208 359.29 132.781 359.29 132.44C359.546 131.843 359.93 131.075 360.442 130.136C360.954 129.112 361.295 128.344 361.466 127.832C361.466 127.747 361.509 127.704 361.594 127.704C362.447 125.656 363.855 122.925 365.818 119.512C367.866 116.013 369.231 113.581 369.914 112.216C370.426 111.704 370.725 111.491 370.81 111.576C371.066 111.32 371.151 111.107 371.066 110.936C371.066 110.851 371.109 110.808 371.194 110.808C371.194 110.211 371.407 109.741 371.834 109.4C372.261 108.973 372.431 108.632 372.346 108.376C372.602 107.864 372.986 107.267 373.498 106.584C374.01 105.816 374.351 105.261 374.522 104.92C376.655 101.336 378.575 98.8613 380.282 97.496C380.453 97.1547 380.837 96.6853 381.434 96.088C382.031 95.4907 382.501 94.9787 382.842 94.552C383.183 94.04 383.183 93.6987 382.842 93.528C383.354 93.1867 384.037 92.4613 384.89 91.352C385.743 90.1573 386.469 89.4747 387.066 89.304C387.066 89.304 387.151 89.176 387.322 88.92C387.493 88.5787 387.621 88.408 387.706 88.408C387.791 88.408 388.005 88.408 388.346 88.408C388.175 86.872 389.114 86.4453 391.162 87.128C392.357 87.5547 393.125 88.0667 393.466 88.664C393.807 88.92 394.063 88.9627 394.234 88.792C394.405 88.6213 394.533 88.536 394.618 88.536C395.045 88.4507 395.599 88.536 396.282 88.792C396.965 89.048 397.349 89.176 397.434 89.176C397.69 89.2613 398.415 89.432 399.61 89.688C400.805 89.8587 401.658 90.1147 402.17 90.456C403.962 90.968 406.309 92.2907 409.21 94.424L408.57 94.552C408.741 94.7227 408.954 95.0213 409.21 95.448C409.551 95.8747 409.765 96.1307 409.85 96.216C409.935 96.216 410.149 96.1307 410.49 95.96V95.704V95.32C410.49 95.32 410.49 95.3627 410.49 95.448C410.917 95.6187 411.258 95.96 411.514 96.472C411.685 97.8373 411.898 98.648 412.154 98.904C412.154 99.416 412.026 100.184 411.77 101.208C411.514 102.147 411.386 102.787 411.386 103.128C411.642 105.091 410.959 107.181 409.338 109.4C408.997 111.192 408.015 112.088 406.394 112.088C406.309 112.259 406.223 112.515 406.138 112.856C406.053 113.112 405.925 113.283 405.754 113.368C405.669 113.453 405.413 113.539 404.986 113.624C404.474 113.88 404.005 114.051 403.578 114.136C403.237 114.136 402.81 114.093 402.298 114.008C401.786 113.923 401.445 113.88 401.274 113.88C400.762 113.539 400.506 113.325 400.506 113.24L401.274 112.984L401.018 113.112C400.847 112.941 400.762 112.899 400.762 112.984C400.506 112.984 400.335 112.984 400.25 112.984H400.122L401.018 112.728C401.445 112.387 401.53 112.216 401.274 112.216C401.018 112.216 400.847 112.301 400.762 112.472C400.677 112.301 400.677 112.173 400.762 112.088C400.847 112.003 400.89 111.96 400.89 111.96C400.89 111.875 400.89 111.789 400.89 111.704C400.975 111.448 400.933 111.277 400.762 111.192C400.677 111.107 400.719 110.893 400.89 110.552L400.634 111.192L400.25 112.088C399.909 113.027 399.61 113.24 399.354 112.728C399.269 112.557 399.269 112.429 399.354 112.344C399.098 112.344 398.97 112.301 398.97 112.216C398.373 111.448 398.117 111.064 398.202 111.064C398.202 110.979 398.287 110.936 398.458 110.936C398.373 110.851 398.287 110.723 398.202 110.552C397.861 110.979 397.391 110.68 396.794 109.656C396.453 109.485 396.154 109.229 395.898 108.888C395.642 108.547 395.386 108.205 395.13 107.864C394.959 107.437 394.789 107.139 394.618 106.968C394.447 106.712 394.405 106.456 394.49 106.2C394.661 105.944 394.746 105.773 394.746 105.688C394.149 105.688 393.679 105.901 393.338 106.328C393.082 106.755 392.997 107.181 393.082 107.608C392.741 107.779 392.442 107.949 392.186 108.12C392.015 108.291 391.845 108.504 391.674 108.76C391.503 108.931 391.375 109.101 391.29 109.272C391.119 109.357 390.906 109.443 390.65 109.528C390.394 109.613 390.181 109.699 390.01 109.784C389.925 109.869 389.839 109.997 389.754 110.168C389.669 110.253 389.669 110.381 389.754 110.552C389.071 111.064 388.474 111.576 387.962 112.088C387.45 112.515 387.066 112.899 386.81 113.24C386.554 113.496 386.17 113.965 385.658 114.648C385.146 115.245 384.719 115.672 384.378 115.928C384.207 116.184 383.994 116.397 383.738 116.568C383.567 116.653 383.439 116.696 383.354 116.696C383.269 116.696 383.183 116.781 383.098 116.952C383.098 117.037 383.055 117.208 382.97 117.464C382.885 117.891 382.629 118.275 382.202 118.616C381.775 118.957 381.519 119.213 381.434 119.384C379.727 121.261 378.149 123.139 376.698 125.016C375.333 126.893 374.01 128.899 372.73 131.032C371.45 133.165 370.469 134.872 369.786 136.152C369.103 137.432 368.122 139.309 366.842 141.784C365.562 144.259 364.751 145.923 364.41 146.776C363.813 148.141 363.471 149.123 363.386 149.72C363.215 150.147 363.087 150.573 363.002 151C363.002 151.427 362.959 151.725 362.874 151.896C362.874 152.067 362.831 152.28 362.746 152.536C362.661 152.707 362.575 152.877 362.49 153.048C362.405 153.219 362.319 153.389 362.234 153.56C362.234 153.731 362.234 153.859 362.234 153.944C362.063 154.797 361.679 156.035 361.082 157.656C360.485 159.192 360.186 160.216 360.186 160.728C360.271 160.813 360.271 160.984 360.186 161.24C360.101 161.411 360.058 161.539 360.058 161.624C359.973 161.624 359.93 161.496 359.93 161.24C360.015 160.984 360.015 160.856 359.93 160.856C359.845 161.283 359.845 161.709 359.93 162.136C360.015 162.477 360.015 162.733 359.93 162.904L359.674 163.032V163.16L359.802 163.288C359.973 163.544 359.93 163.672 359.674 163.672V163.8C359.418 164.483 359.333 165.08 359.418 165.592C358.906 167.811 358.735 169.645 358.906 171.096C359.077 171.181 359.119 171.224 359.034 171.224C358.863 171.48 358.821 171.736 358.906 171.992C359.077 172.248 359.119 172.419 359.034 172.504C359.119 174.552 359.247 176.003 359.418 176.856C359.589 177.624 359.759 178.051 359.93 178.136C360.101 178.136 360.527 177.923 361.21 177.496C361.978 176.984 362.575 176.643 363.002 176.472C363.087 176.387 363.13 176.301 363.13 176.216C363.215 176.045 363.301 175.96 363.386 175.96C363.471 175.875 363.514 175.832 363.514 175.832C366.586 172.76 368.677 170.883 369.786 170.2C369.957 170.029 370.085 169.859 370.17 169.688C370.255 169.517 370.255 169.432 370.17 169.432C370.17 169.347 370.213 169.304 370.298 169.304V169.176C370.554 168.749 370.895 168.323 371.322 167.896C371.834 167.469 372.261 167.085 372.602 166.744C372.943 166.403 373.327 166.019 373.754 165.592C374.181 165.08 374.522 164.611 374.778 164.184C375.034 163.928 375.29 163.715 375.546 163.544C375.802 163.373 376.015 163.245 376.186 163.16C376.357 162.989 376.527 162.819 376.698 162.648C377.125 161.539 377.978 160.557 379.258 159.704C379.343 159.619 379.429 159.533 379.514 159.448C379.258 158.936 379.343 158.637 379.77 158.552C380.282 158.467 380.538 158.424 380.538 158.424C380.794 157.571 381.221 156.717 381.818 155.864C382.501 155.011 383.311 154.029 384.25 152.92C385.274 151.811 385.999 151 386.426 150.488C386.853 150.061 387.45 149.336 388.218 148.312C388.986 147.203 389.626 146.435 390.138 146.008C391.333 144.557 392.015 143.832 392.186 143.832C392.271 143.917 392.399 143.875 392.57 143.704C392.741 143.533 392.869 143.363 392.954 143.192C393.125 142.936 393.21 142.765 393.21 142.68C393.295 143.021 393.423 142.936 393.594 142.424C393.935 141.571 394.191 141.101 394.362 141.016C394.789 140.248 395.258 139.779 395.77 139.608C394.405 139.779 392.613 140.461 390.394 141.656C388.175 142.765 386.554 143.448 385.53 143.704C384.335 144.301 383.525 144.344 383.098 143.832C383.013 143.747 382.97 143.704 382.97 143.704C382.714 143.619 382.373 143.789 381.946 144.216C381.605 144.472 381.306 144.6 381.05 144.6C381.05 144.515 381.178 144.429 381.434 144.344C381.861 144.173 381.946 144.088 381.69 144.088L379.514 144.472H379.77C379.514 144.728 379.173 144.813 378.746 144.728C378.405 144.557 378.234 144.515 378.234 144.6C378.063 144.515 377.807 144.515 377.466 144.6C377.21 144.685 377.082 144.6 377.082 144.344C376.399 144.259 376.399 144.131 377.082 143.96L377.722 143.704C377.893 143.619 378.063 143.576 378.234 143.576V143.448C378.575 143.363 378.959 143.235 379.386 143.064C379.898 142.893 380.367 142.765 380.794 142.68L380.666 142.552L379.898 142.424L379.386 142.296C378.447 142.467 377.722 142.765 377.21 143.192C376.783 143.448 376.698 143.661 376.954 143.832C376.527 143.661 376.229 143.661 376.058 143.832L375.93 143.704C375.674 143.619 375.802 143.491 376.314 143.32C376.399 143.235 376.57 143.149 376.826 143.064H376.954L376.698 142.936C375.674 143.363 375.162 143.491 375.162 143.32C375.162 143.235 375.162 143.192 375.162 143.192C375.247 143.021 375.247 142.936 375.162 142.936C374.991 143.021 374.821 143.149 374.65 143.32C374.565 143.405 374.479 143.491 374.394 143.576C374.309 143.661 374.223 143.747 374.138 143.832C373.967 142.979 374.138 142.296 374.65 141.784C374.821 141.613 374.949 141.613 375.034 141.784L375.162 142.168C375.333 142.168 375.418 142.168 375.418 142.168C375.418 142.083 375.461 142.04 375.546 142.04L375.674 141.784C375.845 141.699 376.058 141.571 376.314 141.4C376.399 141.4 376.442 141.4 376.442 141.4C376.698 141.059 376.911 140.973 377.082 141.144C377.253 141.315 377.551 141.272 377.978 141.016C378.661 140.248 379.343 139.352 380.026 138.328C380.794 137.219 381.391 136.365 381.818 135.768C382.33 135.085 382.714 134.744 382.97 134.744C383.226 134.659 383.439 134.403 383.61 133.976C383.866 133.464 384.122 133.208 384.378 133.208C384.719 133.037 385.018 132.739 385.274 132.312C385.615 131.8 385.957 131.459 386.298 131.288C386.554 131.373 386.767 131.331 386.938 131.16C387.194 130.904 387.365 130.733 387.45 130.648C387.535 130.563 387.663 130.605 387.834 130.776C388.005 130.605 388.175 130.477 388.346 130.392C388.602 130.221 388.815 130.093 388.986 130.008C389.242 129.837 389.455 129.667 389.626 129.496C389.797 129.325 389.967 129.155 390.138 128.984C390.309 128.728 390.394 128.472 390.394 128.216L390.522 128.088C390.522 127.832 390.693 127.747 391.034 127.832C391.375 127.832 391.546 127.789 391.546 127.704C391.631 127.277 391.802 127.021 392.058 126.936C392.314 126.765 392.57 126.637 392.826 126.552C393.082 126.381 393.295 126.125 393.466 125.784C393.637 125.613 393.85 125.528 394.106 125.528C394.362 125.443 394.575 125.4 394.746 125.4C395.002 125.315 395.215 125.144 395.386 124.888C395.642 124.461 396.026 124.035 396.538 123.608C397.135 123.181 397.605 122.883 397.946 122.712C398.373 122.541 398.97 122.285 399.738 121.944C400.506 121.603 400.975 121.389 401.146 121.304C401.487 120.877 401.871 120.749 402.298 120.92C402.554 121.091 402.767 121.048 402.938 120.792C403.194 120.451 403.407 120.323 403.578 120.408C404.005 120.579 404.687 120.664 405.626 120.664C406.565 120.664 407.205 120.877 407.546 121.304C412.239 120.792 415.525 121.56 417.402 123.608ZM378.234 142.296C378.319 142.04 378.447 141.997 378.618 142.168C378.533 142.083 378.49 142.04 378.49 142.04V141.912C378.063 141.997 377.893 142.083 377.978 142.168C377.978 142.253 378.063 142.296 378.234 142.296ZM407.546 93.272C407.461 93.4427 407.546 93.5707 407.802 93.656C407.887 93.4853 407.845 93.4 407.674 93.4C407.674 93.3147 407.631 93.272 407.546 93.272ZM405.37 92.248C405.37 92.1627 405.37 92.12 405.37 92.12V92.248ZM399.738 112.088L399.482 112.216C399.567 112.301 399.61 112.301 399.61 112.216C399.695 112.216 399.738 112.173 399.738 112.088ZM399.354 111.704L399.226 111.32C399.226 111.405 399.269 111.533 399.354 111.704ZM361.85 136.024C361.935 135.768 361.978 135.597 361.978 135.512L361.338 136.792L361.21 137.56C361.295 137.389 361.338 137.261 361.338 137.176H361.21C361.381 137.005 361.466 136.835 361.466 136.664C361.551 136.493 361.594 136.365 361.594 136.28C361.679 136.109 361.765 136.024 361.85 136.024ZM350.842 177.112C350.842 177.197 350.842 177.24 350.842 177.24V177.112ZM351.61 162.008V162.136C351.61 162.136 351.61 162.093 351.61 162.008ZM354.81 151.768C354.81 151.939 354.81 152.024 354.81 152.024V151.384H354.682L354.81 151.512V151.768ZM354.554 155.608C354.639 155.437 354.682 155.267 354.682 155.096L354.81 154.84V154.2L354.554 155.864V155.608ZM355.066 153.176V153.304C355.066 153.304 355.066 153.261 355.066 153.176ZM354.938 152.536C355.023 152.536 355.066 152.536 355.066 152.536H354.938ZM355.194 149.464C355.194 148.867 355.237 148.483 355.322 148.312C355.066 148.141 354.895 148.483 354.81 149.336V151.256C355.066 151.171 355.194 150.872 355.194 150.36C355.194 149.848 355.194 149.549 355.194 149.464ZM355.322 147.544C355.237 147.715 355.194 147.843 355.194 147.928C355.279 147.757 355.322 147.629 355.322 147.544ZM359.29 154.968C359.034 155.224 359.034 155.395 359.29 155.48C359.546 155.395 359.546 155.224 359.29 154.968ZM360.058 157.656C360.058 157.571 359.887 157.571 359.546 157.656H360.058ZM360.186 158.68C360.357 158.595 360.485 158.211 360.57 157.528C360.741 156.845 360.869 156.419 360.954 156.248C360.954 156.077 360.57 156.291 359.802 156.888C360.314 156.973 360.485 157.144 360.314 157.4C360.229 157.656 360.186 157.912 360.186 158.168C360.186 158.339 360.186 158.509 360.186 158.68ZM360.442 155.992C360.271 155.907 360.143 155.907 360.058 155.992C359.973 156.077 360.058 156.12 360.314 156.12H360.442V155.992ZM358.65 153.816C358.735 152.707 359.418 149.805 360.698 145.112V144.984L359.674 147.672C359.247 147.587 358.949 147.757 358.778 148.184C358.693 148.525 358.65 149.037 358.65 149.72C358.65 150.317 358.607 150.744 358.522 151C358.266 151.597 358.223 151.896 358.394 151.896L358.266 152.792C358.181 152.707 358.138 152.579 358.138 152.408C358.053 152.749 358.01 153.176 358.01 153.688L357.882 153.816L357.754 154.072C357.327 154.925 357.157 155.437 357.242 155.608L357.882 154.328L357.754 154.456V154.584L357.626 155.48C357.626 155.651 357.669 155.693 357.754 155.608C357.925 155.267 358.01 155.181 358.01 155.352V155.736L358.394 154.456H358.266L358.522 154.2C358.522 154.115 358.565 153.987 358.65 153.816ZM363.642 175.832C363.642 175.832 363.642 175.875 363.642 175.96V175.832ZM375.93 178.392L376.058 178.52L375.93 178.392ZM377.978 176.472L378.106 176.344C378.021 176.003 377.765 176.131 377.338 176.728C377.167 176.984 377.125 177.112 377.21 177.112C377.295 177.112 377.423 177.069 377.594 176.984C377.679 176.728 377.807 176.557 377.978 176.472ZM379.13 169.944V170.072V169.944ZM379.386 174.68V174.808L379.514 174.68C379.514 174.68 379.471 174.68 379.386 174.68ZM380.282 173.912L380.41 174.04L380.282 173.912ZM381.818 172.504L381.69 172.632L381.818 172.504ZM383.61 164.184C383.61 164.099 383.653 163.971 383.738 163.8C383.909 163.629 383.994 163.544 383.994 163.544C383.994 163.373 383.909 163.416 383.738 163.672H383.61C383.439 163.843 383.226 163.971 382.97 164.056C382.799 164.056 382.714 164.099 382.714 164.184C382.543 164.355 382.415 164.568 382.33 164.824C382.245 164.995 382.159 165.208 382.074 165.464C381.989 165.635 381.861 165.763 381.69 165.848C381.349 165.848 381.263 166.019 381.434 166.36L381.562 166.616C381.903 166.104 382.117 165.805 382.202 165.72C382.373 165.549 382.629 165.293 382.97 164.952C383.311 164.525 383.525 164.269 383.61 164.184ZM385.274 158.552H385.402H385.274ZM379.514 202.328C379.514 202.328 379.471 202.328 379.386 202.328H379.514ZM379.258 208.216C379.258 208.387 379.258 208.515 379.258 208.6V208.472V208.216ZM379.258 207.576C379.343 207.661 379.386 207.704 379.386 207.704V207.576H379.258ZM379.386 207.064L379.514 207.192C379.599 207.107 379.599 206.979 379.514 206.808V206.68C379.514 206.765 379.471 206.893 379.386 207.064ZM379.514 206.04H379.642H379.514ZM379.898 202.456V202.584V202.456ZM381.178 205.4H381.05H381.178ZM380.41 207.832L380.922 206.168C380.666 206.68 380.495 207.235 380.41 207.832ZM380.666 208.216C380.837 208.045 380.922 207.832 380.922 207.576C380.837 207.747 380.751 207.96 380.666 208.216ZM380.538 206.296C380.367 206.637 380.325 206.893 380.41 207.064L380.538 206.296ZM380.41 208.216H380.282H380.41ZM380.282 211.8V212.056V211.8ZM380.41 210.392C380.239 210.989 380.154 211.288 380.154 211.288C380.154 211.288 380.282 211.117 380.538 210.776C380.623 210.776 380.623 210.52 380.538 210.008C380.538 210.008 380.495 210.136 380.41 210.392ZM381.05 208.856V209.112V208.856ZM381.05 207.192L381.178 206.936L381.05 207.192ZM381.69 209.112L381.562 209.24L381.69 209.112ZM407.418 121.432C407.418 121.517 407.418 121.56 407.418 121.56V121.432ZM408.186 121.432C408.271 121.432 408.357 121.389 408.442 121.304C408.357 121.304 408.229 121.304 408.058 121.304L408.186 121.432ZM479.503 107.736C479.503 107.907 479.631 108.035 479.887 108.12V108.248C479.887 108.504 479.887 109.229 479.887 110.424C479.887 111.533 479.802 112.301 479.631 112.728C479.204 115.288 478.692 117.379 478.095 119C477.498 121.731 476.388 124.248 474.767 126.552C473.402 129.88 471.908 132.483 470.287 134.36C465.594 140.589 462.863 143.491 462.095 143.064C461.924 143.235 461.924 143.363 462.095 143.448C462.351 143.533 462.308 143.661 461.967 143.832C461.37 144.429 460.687 145.112 459.919 145.88C459.151 146.648 458.639 147.16 458.383 147.416C458.298 147.672 458.042 147.971 457.615 148.312C457.274 148.568 457.06 148.739 456.975 148.824C456.548 149.507 456.036 150.019 455.439 150.36C455.354 150.616 455.226 150.659 455.055 150.488C454.97 150.488 454.927 150.488 454.927 150.488C454.927 150.659 454.927 150.744 454.927 150.744C454.842 150.829 454.714 150.957 454.543 151.128C454.458 151.299 454.33 151.469 454.159 151.64C454.074 151.811 453.988 151.896 453.903 151.896C453.562 151.981 453.22 152.28 452.879 152.792C452.538 153.304 452.239 153.56 451.983 153.56C451.044 155.011 449.85 155.821 448.399 155.992C448.655 156.248 448.74 156.504 448.655 156.76C448.484 157.101 448.356 157.144 448.271 156.888C448.271 156.717 448.442 156.419 448.783 155.992C448.527 155.992 447.887 156.675 446.863 158.04C446.607 158.552 446.138 159.107 445.455 159.704C444.772 160.216 444.388 160.515 444.303 160.6C444.132 160.685 443.791 160.984 443.279 161.496C442.852 161.923 442.468 162.221 442.127 162.392C441.871 162.819 441.359 163.331 440.591 163.928C439.908 164.525 439.524 164.824 439.439 164.824C439.439 164.824 439.439 164.867 439.439 164.952C439.439 165.123 439.268 165.251 438.927 165.336C438.842 165.421 438.799 165.464 438.799 165.464C438.628 165.635 438.458 165.72 438.287 165.72C437.69 166.147 437.135 166.701 436.623 167.384C436.196 167.981 435.855 168.365 435.599 168.536C435.343 168.621 435.13 168.792 434.959 169.048C434.788 169.389 434.319 169.773 433.551 170.2C433.295 170.541 432.356 171.352 430.735 172.632C430.65 172.888 430.436 173.101 430.095 173.272C429.839 173.443 429.668 173.571 429.583 173.656C428.986 174.339 428.474 174.765 428.047 174.936C425.999 176.984 424.762 178.136 424.335 178.392C423.311 179.501 419.898 182.659 414.095 187.864C413.498 188.205 412.687 188.888 411.663 189.912C410.639 191.021 409.871 191.704 409.359 191.96C409.018 192.131 408.719 192.429 408.463 192.856C408.207 193.283 407.908 193.496 407.567 193.496V193.624C407.567 193.88 407.524 194.008 407.439 194.008C406.842 194.435 405.306 195.8 402.831 198.104C401.978 198.957 401.295 199.469 400.783 199.64C400.698 199.725 400.57 199.853 400.399 200.024C400.228 200.195 400.058 200.323 399.887 200.408C399.119 201.517 398.18 202.328 397.071 202.84C396.986 203.011 396.815 203.181 396.559 203.352V203.48C396.303 203.565 396.09 203.693 395.919 203.864C395.663 204.035 395.492 204.163 395.407 204.248C395.322 204.504 395.151 204.675 394.895 204.76C394.639 204.845 394.468 204.76 394.383 204.504V204.76L394.511 204.888C394.852 204.973 394.724 205.144 394.127 205.4C393.615 205.741 393.188 206.04 392.847 206.296C392.42 206.637 392.25 206.851 392.335 206.936C391.823 206.851 391.439 207.107 391.183 207.704C391.183 207.875 391.14 207.96 391.055 207.96C390.714 208.131 390.415 208.387 390.159 208.728C389.818 209.155 389.604 209.411 389.519 209.496C389.434 209.496 389.391 209.539 389.391 209.624C388.794 210.136 388.111 210.691 387.343 211.288C386.575 211.885 385.935 212.355 385.423 212.696C384.911 213.123 384.655 213.421 384.655 213.592C384.655 213.677 384.655 213.72 384.655 213.72L383.887 213.336L384.015 213.208C383.503 213.379 383.204 213.635 383.119 213.976H383.503C383.247 214.317 382.735 214.573 381.967 214.744C381.796 214.573 381.626 214.573 381.455 214.744C381.455 214.573 381.668 214.275 382.095 213.848C382.18 213.848 382.095 213.848 381.839 213.848C382.01 213.763 382.351 213.421 382.863 212.824C383.29 212.312 383.546 212.099 383.631 212.184C383.802 211.928 384.015 211.629 384.271 211.288C384.527 211.032 384.698 210.819 384.783 210.648C384.954 210.477 385.039 210.392 385.039 210.392L385.295 210.008C385.636 209.581 385.935 209.325 386.191 209.24C386.106 209.155 386.063 209.112 386.063 209.112C385.978 209.197 385.935 209.24 385.935 209.24L386.063 209.112C386.148 209.027 387.428 207.32 389.903 203.992C390.074 203.907 390.287 203.693 390.543 203.352C390.714 203.011 390.927 202.712 391.183 202.456C391.354 202.285 391.482 202.2 391.567 202.2C391.823 202.115 391.994 201.944 392.079 201.688C392.079 201.517 392.122 201.389 392.207 201.304C392.292 200.963 392.463 200.749 392.719 200.664C392.89 200.579 393.018 200.493 393.103 200.408C393.444 199.555 394.127 198.787 395.151 198.104C395.578 197.336 396.303 196.44 397.327 195.416C398.266 194.392 398.778 193.795 398.863 193.624C398.948 193.539 399.034 193.539 399.119 193.624C399.119 193.709 399.119 193.752 399.119 193.752C399.204 194.008 399.247 194.051 399.247 193.88V193.112C399.674 192.429 400.356 191.619 401.295 190.68C402.148 189.827 402.618 189.357 402.703 189.272C402.959 189.272 403.215 188.973 403.471 188.376C403.642 187.864 403.855 187.565 404.111 187.48C404.367 187.309 404.623 187.053 404.879 186.712C405.05 186.371 405.22 186.115 405.391 185.944C405.562 185.859 405.732 185.816 405.903 185.816C406.159 185.219 406.543 184.707 407.055 184.28C407.311 184.365 407.482 184.323 407.567 184.152C407.482 183.896 407.61 183.597 407.951 183.256C408.207 183 408.548 182.701 408.975 182.36C409.402 182.019 409.7 181.72 409.871 181.464C410.639 180.952 411.151 180.44 411.407 179.928C411.663 179.331 411.834 178.605 411.919 177.752C411.919 176.899 412.004 176.259 412.175 175.832C412.175 175.576 412.431 174.125 412.943 171.48C413.028 171.139 413.327 170.072 413.839 168.28C413.924 168.024 414.01 167.768 414.095 167.512C414.095 167.427 414.095 167.384 414.095 167.384C414.18 167.299 414.266 167.128 414.351 166.872C414.351 166.531 414.394 166.232 414.479 165.976C414.479 165.72 414.522 165.635 414.607 165.72C414.863 165.72 414.906 165.592 414.735 165.336C414.65 165.251 414.607 165.165 414.607 165.08C414.522 164.995 414.522 164.909 414.607 164.824C415.204 163.715 415.375 162.947 415.119 162.52C415.887 160.045 416.698 157.059 417.551 153.56C418.66 149.037 420.452 142.808 422.927 134.872C423.098 134.445 423.14 134.147 423.055 133.976C423.396 133.635 423.61 133.123 423.695 132.44C423.866 131.672 424.079 131.16 424.335 130.904C424.42 129.539 424.676 128.131 425.103 126.68C425.615 125.144 426.212 123.523 426.895 121.816C427.663 120.024 428.175 118.659 428.431 117.72C428.943 117.635 429.199 117.464 429.199 117.208L428.943 117.08L428.815 117.208C428.73 117.123 428.73 116.995 428.815 116.824C428.9 116.568 429.028 116.397 429.199 116.312C429.37 116.141 429.455 116.099 429.455 116.184C429.455 115.757 429.583 115.331 429.839 114.904C430.095 114.477 430.351 114.179 430.607 114.008C430.948 113.752 431.204 113.581 431.375 113.496C431.29 113.24 431.375 112.941 431.631 112.6C431.972 112.259 432.143 112.088 432.143 112.088C432.314 112.003 432.356 111.832 432.271 111.576H432.399C432.399 111.661 432.442 111.704 432.527 111.704C432.868 111.704 433.082 111.576 433.167 111.32L433.039 111.064C433.124 110.979 433.252 110.979 433.423 111.064C433.679 111.149 433.807 111.064 433.807 110.808C433.551 110.723 432.655 110.893 431.119 111.32C428.474 112.088 427.151 112.259 427.151 111.832C426.81 112.259 426.468 112.557 426.127 112.728C425.871 112.813 425.53 112.899 425.103 112.984C424.762 113.069 424.42 113.155 424.079 113.24C422.287 114.093 420.538 114.52 418.831 114.52C418.575 114.52 418.276 114.819 417.935 115.416C417.594 116.013 417.338 116.312 417.167 116.312C416.57 116.568 415.802 117.123 414.863 117.976C413.924 118.744 413.156 119.128 412.559 119.128C412.218 119.213 411.919 118.915 411.663 118.232C411.322 117.549 411.108 117.165 411.023 117.08C411.194 118.104 411.023 118.488 410.511 118.232C410.34 118.147 410.084 117.891 409.743 117.464C409.572 117.379 409.444 117.293 409.359 117.208C407.908 116.781 406.842 116.525 406.159 116.44C405.306 115.501 404.836 115.032 404.751 115.032C404.751 115.032 404.666 114.947 404.495 114.776C404.239 114.52 404.026 114.221 403.855 113.88C403.684 113.539 403.556 113.283 403.471 113.112C403.386 112.515 403.514 112.045 403.855 111.704C404.111 111.277 404.239 110.979 404.239 110.808C404.154 110.296 404.41 109.613 405.007 108.76C405.604 107.907 405.903 107.309 405.903 106.968C406.074 106.797 406.287 106.627 406.543 106.456C406.799 106.2 406.97 106.072 407.055 106.072C407.055 106.072 407.183 106.115 407.439 106.2C407.866 105.603 408.42 105.133 409.103 104.792C409.786 104.365 410.17 104.109 410.255 104.024L410.895 103.384V103.64C411.407 103.384 411.748 103.213 411.919 103.128C412.175 102.701 412.687 102.403 413.455 102.232C413.626 102.232 413.711 102.275 413.711 102.36C413.796 102.445 413.924 102.445 414.095 102.36C414.266 102.275 414.394 102.275 414.479 102.36C414.479 102.189 414.522 102.104 414.607 102.104C414.692 102.104 414.778 102.147 414.863 102.232C414.863 101.976 414.948 101.933 415.119 102.104C415.29 102.189 415.375 102.232 415.375 102.232C415.546 102.147 415.802 102.104 416.143 102.104C416.74 102.019 417.082 101.805 417.167 101.464C417.252 101.549 417.295 101.549 417.295 101.464C417.38 101.037 417.466 100.824 417.551 100.824C417.636 101.507 417.892 101.763 418.319 101.592C418.49 101.507 418.532 101.251 418.447 100.824C418.618 100.824 418.788 100.909 418.959 101.08C419.215 101.251 419.343 101.336 419.343 101.336C420.111 101.165 420.452 101.037 420.367 100.952C420.196 100.781 420.196 100.568 420.367 100.312C420.623 100.056 420.836 99.9707 421.007 100.056C421.348 99.8 421.946 99.7573 422.799 99.928C422.97 99.8427 423.183 99.7147 423.439 99.544C423.695 99.3733 423.866 99.288 423.951 99.288C424.036 99.288 424.25 99.288 424.591 99.288C424.676 99.288 424.847 99.2027 425.103 99.032C425.444 98.8613 425.7 98.7333 425.871 98.648C426.042 98.5627 426.255 98.6053 426.511 98.776C426.767 98.8613 427.023 98.7333 427.279 98.392C427.535 98.0507 427.748 98.0507 427.919 98.392C430.564 97.368 432.484 96.8133 433.679 96.728L433.423 96.856C433.594 96.7707 433.807 96.6 434.063 96.344C434.063 96.344 434.148 96.344 434.319 96.344C434.831 96.344 435.172 96.5147 435.343 96.856C435.428 96.6853 435.556 96.6 435.727 96.6C435.983 96.5147 436.196 96.472 436.367 96.472C436.623 96.472 436.836 96.472 437.007 96.472C437.263 96.472 437.434 96.4293 437.519 96.344C437.69 96.2587 437.732 96.1307 437.647 95.96C437.732 95.5333 437.988 95.3627 438.415 95.448C438.586 95.448 438.714 95.4053 438.799 95.32C438.799 95.576 439.012 95.6613 439.439 95.576C439.866 95.4053 440.122 95.32 440.207 95.32C440.89 95.4907 441.956 95.4907 443.407 95.32C444.858 95.1493 445.796 95.064 446.223 95.064C446.65 94.8933 446.735 94.7227 446.479 94.552C446.308 94.3813 446.522 94.1253 447.119 93.784C447.46 93.6133 447.759 93.656 448.015 93.912C448.271 94.0827 448.442 94.168 448.527 94.168C448.698 93.8267 449.039 93.7413 449.551 93.912C450.148 93.9973 450.532 93.9973 450.703 93.912C451.215 93.7413 451.812 93.7413 452.495 93.912C453.263 94.0827 453.775 93.912 454.031 93.4C454.372 93.4 455.055 93.4853 456.079 93.656C457.188 93.8267 458.042 93.8693 458.639 93.784C459.066 93.9547 459.492 94.168 459.919 94.424C460.346 94.68 460.687 94.8507 460.943 94.936C461.284 95.0213 461.626 95.064 461.967 95.064C462.052 95.1493 462.18 95.192 462.351 95.192C462.436 95.2773 462.479 95.32 462.479 95.32C467.343 96.2587 470.628 97.1973 472.335 98.136C472.335 98.136 472.42 98.1787 472.591 98.264C472.847 98.3493 472.975 98.4347 472.975 98.52C473.572 98.776 473.999 99.0747 474.255 99.416C474.426 99.5867 474.767 99.8853 475.279 100.312C475.791 100.653 476.09 100.952 476.175 101.208C476.346 100.525 476.9 101.037 477.839 102.744C477.924 102.915 478.052 103.171 478.223 103.512L479.119 104.792C479.204 104.877 479.29 105.048 479.375 105.304C479.546 105.475 479.631 105.56 479.631 105.56C479.802 105.901 479.802 106.328 479.631 106.84C479.546 107.352 479.503 107.651 479.503 107.736ZM406.031 107.864C406.116 107.864 406.159 107.864 406.159 107.864H406.031ZM406.287 116.056H406.415H406.287ZM419.087 101.464H418.959H419.087ZM382.479 213.592V213.72L382.607 213.464L382.479 213.592ZM385.423 211.8C385.508 211.715 385.551 211.672 385.551 211.672L385.423 211.8ZM383.759 212.184C383.332 212.099 383.076 212.269 382.991 212.696V212.824C383.503 212.483 383.759 212.269 383.759 212.184ZM382.991 213.72C383.418 213.123 383.674 212.867 383.759 212.952C384.1 212.525 384.228 212.312 384.143 212.312C384.143 212.227 384.143 212.184 384.143 212.184C383.034 213.208 382.65 213.72 382.991 213.72ZM384.015 212.952C384.015 213.037 384.015 213.08 384.015 213.08V212.952ZM384.143 213.464V213.592V213.464ZM385.807 212.184C385.978 212.184 386.063 212.141 386.063 212.056C386.063 212.056 386.063 212.013 386.063 211.928C385.892 211.928 385.807 211.928 385.807 211.928L385.935 211.8C385.764 211.8 385.338 211.971 384.655 212.312C384.484 212.483 384.442 212.611 384.527 212.696C385.38 212.184 385.807 212.013 385.807 212.184ZM387.599 208.472L387.343 208.6L387.599 208.472ZM386.831 209.112L386.703 209.24L386.575 209.368C386.746 209.368 386.831 209.283 386.831 209.112ZM386.575 210.264L386.447 210.392V210.52C386.532 210.52 386.575 210.435 386.575 210.264ZM386.319 211.8L386.831 211.288C386.66 211.288 386.532 211.331 386.447 211.416C386.362 211.587 386.319 211.715 386.319 211.8ZM387.087 209.496C386.916 209.752 386.831 209.965 386.831 210.136C387.087 209.88 387.172 209.667 387.087 209.496ZM387.343 209.368C387.258 209.368 387.215 209.411 387.215 209.496L387.343 209.368ZM387.471 210.776C387.471 210.776 387.514 210.733 387.599 210.648H387.471V210.776ZM387.855 208.088H387.983H387.855ZM388.239 207.704V207.832V207.704ZM388.495 206.04C388.58 205.955 388.623 205.912 388.623 205.912L388.495 206.04ZM391.055 204.76L391.311 204.632V204.376C391.14 204.376 391.055 204.504 391.055 204.76ZM393.487 205.656H393.615H393.487ZM412.175 178.904V179.16C412.09 178.989 412.09 178.861 412.175 178.776V178.904ZM412.175 177.752C412.09 177.923 412.09 178.008 412.175 178.008C412.26 178.008 412.346 177.965 412.431 177.88C412.431 177.795 412.388 177.752 412.303 177.752C412.218 177.752 412.175 177.752 412.175 177.752ZM412.431 175.448V175.576C412.516 175.576 412.516 175.533 412.431 175.448ZM438.287 95.832L438.543 95.96L438.671 95.704L438.415 95.832C438.415 95.832 438.372 95.832 438.287 95.832ZM428.687 119C428.687 119 428.644 118.957 428.559 118.872L428.687 119ZM430.607 172.632V172.76C430.607 172.76 430.607 172.717 430.607 172.632ZM435.727 155.736C435.727 155.821 435.77 155.821 435.855 155.736H435.727ZM441.103 155.096C441.103 155.181 441.103 155.224 441.103 155.224V155.096ZM464.783 117.592C465.124 117.08 465.338 116.184 465.423 114.904C465.594 113.539 465.892 112.813 466.319 112.728C466.319 112.643 466.191 112.173 465.935 111.32C465.679 110.381 465.679 109.869 465.935 109.784C465.679 109.699 465.594 109.443 465.679 109.016C465.764 108.589 465.764 108.333 465.679 108.248C465.508 108.163 465.38 108.035 465.295 107.864C465.21 107.608 465.167 107.395 465.167 107.224C465.167 107.053 465.124 106.883 465.039 106.712C464.783 106.627 464.612 106.371 464.527 105.944C464.527 105.432 464.442 105.133 464.271 105.048C461.028 104.707 458.682 104.749 457.231 105.176L457.103 105.048L456.975 104.92C456.975 105.517 456.463 105.603 455.439 105.176C455.268 104.92 455.14 104.749 455.055 104.664C454.799 104.664 454.5 104.707 454.159 104.792C453.818 104.877 453.519 104.92 453.263 104.92C453.007 104.92 452.751 104.92 452.495 104.92C452.239 104.92 452.026 104.92 451.855 104.92C451.514 105.091 451.215 105.048 450.959 104.792C450.874 104.707 450.746 104.877 450.575 105.304C450.404 105.645 450.191 105.773 449.935 105.688H449.807C448.698 105.944 447.546 106.243 446.351 106.584C445.156 106.84 443.663 107.224 441.871 107.736C440.079 108.248 438.671 108.76 437.647 109.272C436.708 109.699 436.367 110.04 436.623 110.296C436.708 110.296 436.794 110.253 436.879 110.168C437.05 110.083 437.178 109.997 437.263 109.912C437.434 109.827 437.604 109.784 437.775 109.784C437.946 109.699 438.116 109.741 438.287 109.912C438.543 109.485 438.799 109.443 439.055 109.784C439.055 109.699 439.012 109.613 438.927 109.528C439.183 109.528 439.439 109.528 439.695 109.528C440.036 109.528 440.292 109.571 440.463 109.656C440.634 109.656 440.762 109.656 440.847 109.656C441.018 109.912 441.146 109.955 441.231 109.784C441.487 109.955 441.743 110.125 441.999 110.296C442.255 110.467 442.468 110.637 442.639 110.808C442.895 110.979 443.108 111.149 443.279 111.32C443.535 111.405 443.748 111.533 443.919 111.704C443.919 111.789 443.748 111.832 443.407 111.832C443.236 111.747 443.236 111.789 443.407 111.96C443.407 112.045 443.492 112.173 443.663 112.344C444.602 113.368 444.943 115.245 444.687 117.976C444.516 120.707 443.962 122.755 443.023 124.12C443.108 124.632 443.108 125.144 443.023 125.656C442.938 126.083 442.81 126.467 442.639 126.808C442.554 127.064 442.383 127.491 442.127 128.088C441.956 128.685 441.786 129.197 441.615 129.624C441.274 130.307 440.975 131.032 440.719 131.8C440.463 132.483 440.207 133.123 439.951 133.72C439.695 134.317 439.396 134.915 439.055 135.512C438.799 136.28 438.287 137.389 437.519 138.84C436.836 140.205 436.452 140.973 436.367 141.144C436.282 141.315 435.898 142.253 435.215 143.96C435.13 144.301 434.916 144.685 434.575 145.112C434.234 145.453 433.935 145.795 433.679 146.136C433.508 146.477 433.423 146.776 433.423 147.032C433.082 148.397 432.356 150.104 431.247 152.152C430.138 154.115 429.455 155.437 429.199 156.12C429.114 156.291 429.028 156.504 428.943 156.76V156.888C428.431 157.656 427.962 158.68 427.535 159.96C427.45 160.131 427.322 160.259 427.151 160.344H427.023C427.023 160.515 427.023 160.685 427.023 160.856C426.938 161.283 426.767 161.453 426.511 161.368C426.426 161.453 426.383 161.539 426.383 161.624C426.212 161.709 425.999 162.008 425.743 162.52C425.572 163.032 425.487 163.288 425.487 163.288C425.402 163.288 425.316 163.331 425.231 163.416C425.487 163.757 425.444 164.056 425.103 164.312C424.847 164.568 424.719 164.867 424.719 165.208C424.804 165.464 424.804 165.677 424.719 165.848C424.634 165.933 424.548 166.019 424.463 166.104C424.292 166.36 424.25 166.488 424.335 166.488L424.975 165.976C425.402 165.464 426.127 164.781 427.151 163.928C428.175 163.075 428.815 162.477 429.071 162.136C429.242 161.795 429.54 161.496 429.967 161.24C430.479 160.899 430.82 160.515 430.991 160.088C431.076 159.917 431.204 159.875 431.375 159.96C431.716 159.448 432.442 158.68 433.551 157.656C434.66 156.547 435.386 155.779 435.727 155.352L436.239 154.968C436.324 154.797 436.495 154.712 436.751 154.712C437.092 154.627 437.22 154.456 437.135 154.2C437.22 154.2 437.263 154.157 437.263 154.072C437.348 153.987 437.434 153.901 437.519 153.816C437.604 153.56 437.69 153.389 437.775 153.304C437.86 153.219 437.988 153.261 438.159 153.432C438.244 153.176 438.372 152.963 438.543 152.792C438.714 152.536 438.884 152.323 439.055 152.152C439.226 151.981 439.396 151.853 439.567 151.768C439.738 151.597 439.908 151.512 440.079 151.512C440.25 151.512 440.378 151.555 440.463 151.64C440.719 150.872 441.615 149.72 443.151 148.184C444.772 146.563 445.796 145.496 446.223 144.984C447.674 143.448 448.74 142.296 449.423 141.528C449.935 141.187 450.66 140.589 451.599 139.736C452.623 138.883 453.306 138.371 453.647 138.2C453.732 137.432 454.372 136.323 455.567 134.872C458.127 131.715 460.175 128.557 461.711 125.4C462.052 124.717 462.607 123.48 463.375 121.688C463.46 121.603 463.46 121.517 463.375 121.432C463.716 120.92 463.972 120.323 464.143 119.64C464.57 119.043 464.783 118.36 464.783 117.592ZM439.311 111.192V111.064C439.311 110.467 439.354 110.211 439.439 110.296C439.268 110.04 439.183 110.04 439.183 110.296C439.183 110.381 439.183 110.509 439.183 110.68C439.268 110.851 439.311 111.021 439.311 111.192ZM442.767 111.064C442.682 110.979 442.639 110.979 442.639 111.064H442.767ZM472.847 98.648C472.932 98.7333 472.975 98.776 472.975 98.776C472.975 98.6907 472.932 98.6053 472.847 98.52C472.762 98.4347 472.762 98.4773 472.847 98.648ZM563.257 89.944C563.94 90.0293 564.58 90.4133 565.177 91.096C565.262 91.2667 565.134 91.3947 564.793 91.48C564.708 91.48 564.537 91.5227 564.281 91.608H564.025L563.257 91.992H563.513C563.684 91.992 563.769 91.992 563.769 91.992L563.001 92.248C562.83 92.3333 562.617 92.4613 562.361 92.632L562.105 92.76C561.593 93.016 561.294 93.1013 561.209 93.016C561.038 93.1013 560.782 93.1867 560.441 93.272C560.185 93.3573 559.929 93.4853 559.673 93.656C559.502 93.7413 559.374 93.8267 559.289 93.912C558.948 93.912 558.692 93.9973 558.521 94.168C558.35 94.3387 558.137 94.424 557.881 94.424C557.284 94.68 556.473 95.0213 555.449 95.448C554.51 95.8747 553.7 96.216 553.017 96.472C552.42 96.728 551.908 96.8987 551.481 96.984C551.14 97.3253 550.841 97.4533 550.585 97.368C550.073 97.4533 549.476 97.6667 548.793 98.008C548.196 98.264 547.598 98.52 547.001 98.776C546.489 99.032 545.977 99.288 545.465 99.544C545.038 99.7147 544.654 99.8 544.313 99.8C544.057 99.8 543.886 99.672 543.801 99.416L543.033 99.288C543.033 99.2027 543.118 99.1173 543.289 99.032C534.841 103.981 528.27 107.096 523.577 108.376C520.676 109.571 518.798 110.168 517.945 110.168C516.409 111.021 515.726 112.088 515.897 113.368C515.726 113.368 515.598 113.453 515.513 113.624C515.428 113.709 515.47 113.837 515.641 114.008C515.726 114.264 515.684 114.605 515.513 115.032C515.342 115.373 515.385 115.587 515.641 115.672C515.47 116.44 515.257 117.208 515.001 117.976C514.745 118.659 514.617 119.171 514.617 119.512C514.532 119.853 514.404 120.195 514.233 120.536C514.148 120.792 514.105 120.92 514.105 120.92C514.19 121.261 513.892 122.456 513.209 124.504C512.953 125.357 513.081 125.784 513.593 125.784C513.678 125.699 513.806 125.656 513.977 125.656C515.94 125.4 517.39 125.443 518.329 125.784C519.865 125.528 520.718 125.485 520.889 125.656C520.974 125.485 522.596 125.357 525.753 125.272L527.801 125.016C527.801 125.016 527.716 125.016 527.545 125.016C527.118 124.931 527.246 124.845 527.929 124.76C528.1 124.76 528.27 124.803 528.441 124.888C528.612 124.973 528.74 125.101 528.825 125.272C528.996 125.357 529.124 125.4 529.209 125.4C529.124 125.571 529.166 125.656 529.337 125.656C529.593 125.656 529.764 125.699 529.849 125.784C529.934 125.784 529.977 125.827 529.977 125.912C530.062 125.912 530.148 125.997 530.233 126.168C530.404 126.424 530.489 126.509 530.489 126.424C530.318 126.851 530.19 126.851 530.105 126.424C530.02 126.595 530.105 126.808 530.361 127.064C530.702 127.235 530.489 127.491 529.721 127.832C528.953 128.429 527.417 129.752 525.113 131.8C522.809 133.848 520.974 135.256 519.609 136.024C519.097 136.28 518.585 136.579 518.073 136.92C517.561 137.176 517.092 137.432 516.665 137.688C516.324 137.859 515.982 138.029 515.641 138.2C515.641 138.285 515.641 138.328 515.641 138.328C514.788 138.584 513.934 138.968 513.081 139.48C512.313 139.907 511.673 140.163 511.161 140.248C510.564 140.333 509.924 140.675 509.241 141.272C508.558 141.869 508.089 142.168 507.833 142.168C506.724 143.96 505.358 146.648 503.737 150.232C502.201 153.816 501.39 155.736 501.305 155.992C501.134 156.589 500.75 157.229 500.153 157.912C499.641 158.509 499.428 158.979 499.513 159.32C499.428 159.576 499.257 159.832 499.001 160.088C498.745 160.259 498.574 160.387 498.489 160.472C498.404 160.557 498.446 160.685 498.617 160.856C498.532 161.112 498.361 161.283 498.105 161.368C497.849 161.453 497.636 161.624 497.465 161.88C497.294 162.307 497.124 162.733 496.953 163.16C496.782 163.501 496.569 163.8 496.313 164.056C496.142 164.312 495.929 164.653 495.673 165.08C495.502 165.421 495.332 165.763 495.161 166.104C494.905 166.445 494.692 166.744 494.521 167C494.35 167.256 494.222 167.469 494.137 167.64C494.052 167.811 493.924 168.024 493.753 168.28C493.668 168.536 493.582 168.749 493.497 168.92C493.497 169.005 493.369 169.219 493.113 169.56C492.942 169.816 492.814 170.115 492.729 170.456C492.644 170.712 492.601 170.925 492.601 171.096C492.942 171.011 493.113 171.011 493.113 171.096C492.942 171.437 492.772 171.565 492.601 171.48C492.43 171.309 492.345 171.267 492.345 171.352C492.26 171.608 492.26 171.736 492.345 171.736L492.729 171.864C492.473 172.547 492.26 172.717 492.089 172.376C492.004 172.205 491.918 172.163 491.833 172.248C491.833 172.333 491.918 172.461 492.089 172.632C492.345 172.888 492.345 173.059 492.089 173.144C491.918 173.315 491.833 173.528 491.833 173.784C491.833 173.955 491.662 173.912 491.321 173.656V174.68L491.193 174.552C491.022 174.637 490.937 174.68 490.937 174.68C491.278 174.936 491.278 175.107 490.937 175.192C490.681 175.192 490.596 175.235 490.681 175.32C490.596 175.491 490.468 175.747 490.297 176.088C490.126 176.344 489.998 176.557 489.913 176.728C489.913 176.813 489.87 177.027 489.785 177.368C489.7 177.624 489.7 177.837 489.785 178.008C489.956 178.008 490.041 177.923 490.041 177.752C490.126 177.667 490.297 177.624 490.553 177.624C490.894 177.539 491.108 177.581 491.193 177.752C490.937 177.496 490.852 177.283 490.937 177.112C491.022 176.856 491.108 176.685 491.193 176.6C491.364 176.515 491.577 176.429 491.833 176.344C492.089 176.173 492.26 176.045 492.345 175.96C492.772 175.875 493.156 175.576 493.497 175.064C493.924 174.552 494.222 174.253 494.393 174.168C494.564 174.168 494.692 174.083 494.777 173.912C494.948 173.741 495.033 173.613 495.033 173.528C495.118 173.443 495.246 173.443 495.417 173.528C495.588 173.272 495.716 173.101 495.801 173.016C495.972 172.931 496.185 172.888 496.441 172.888C496.697 172.888 496.868 172.888 496.953 172.888C497.124 172.291 497.593 171.864 498.361 171.608C499.129 171.267 499.47 170.797 499.385 170.2C499.385 170.285 499.342 170.328 499.257 170.328C499.342 170.243 499.385 170.285 499.385 170.456C499.47 170.627 499.47 170.712 499.385 170.712C499.556 170.712 499.641 170.669 499.641 170.584C499.641 170.413 499.641 170.328 499.641 170.328C499.897 170.243 500.025 170.2 500.025 170.2C500.11 170.371 500.196 170.371 500.281 170.2C500.366 169.944 500.494 169.859 500.665 169.944C500.58 169.688 500.75 169.475 501.177 169.304C501.604 169.048 501.817 168.92 501.817 168.92C503.012 167.299 504.078 166.36 505.017 166.104C505.188 166.019 505.358 165.848 505.529 165.592C505.785 165.251 505.998 165.08 506.169 165.08C506.937 164.397 507.321 164.056 507.321 164.056C507.492 163.971 507.577 163.928 507.577 163.928C507.662 163.757 507.876 163.672 508.217 163.672C508.217 163.672 508.26 163.587 508.345 163.416C508.43 163.245 508.473 163.16 508.473 163.16C508.558 163.075 508.686 163.075 508.857 163.16C508.942 162.733 509.156 162.435 509.497 162.264L509.625 162.136H509.753C510.265 161.709 510.734 161.496 511.161 161.496C511.417 161.24 511.716 160.899 512.057 160.472C512.398 160.131 512.569 160.088 512.569 160.344C513.593 158.893 514.532 158.168 515.385 158.168C515.556 158.168 515.641 158.211 515.641 158.296V158.168C515.385 157.912 515.513 157.699 516.025 157.528C516.537 157.357 516.665 157.101 516.409 156.76C517.092 156.675 517.433 156.675 517.433 156.76C517.348 156.504 517.348 156.333 517.433 156.248C517.604 156.077 517.774 155.992 517.945 155.992C518.116 155.907 518.201 155.821 518.201 155.736C518.201 155.48 518.372 155.309 518.713 155.224C519.054 155.139 519.225 155.096 519.225 155.096C519.481 154.925 519.737 154.755 519.993 154.584C520.249 154.328 520.462 154.157 520.633 154.072C520.804 153.901 520.974 153.816 521.145 153.816C522.34 152.963 523.278 152.28 523.961 151.768C524.217 151.597 524.43 151.427 524.601 151.256C524.772 151.085 524.942 150.957 525.113 150.872C525.284 150.787 525.412 150.701 525.497 150.616C525.668 150.531 525.838 150.403 526.009 150.232C526.18 150.061 526.35 149.891 526.521 149.72C527.204 149.635 527.63 149.421 527.801 149.08C528.057 148.739 528.313 148.568 528.569 148.568C528.654 148.227 528.782 148.056 528.953 148.056C529.124 148.056 529.209 148.013 529.209 147.928C530.404 147.075 531.044 146.648 531.129 146.648C531.214 146.477 531.342 146.307 531.513 146.136C531.684 145.88 531.812 145.709 531.897 145.624C532.324 145.368 532.836 145.325 533.433 145.496C534.03 145.24 534.414 145.453 534.585 146.136C533.646 146.989 533.134 147.416 533.049 147.416C533.049 147.331 533.049 147.245 533.049 147.16C532.708 147.501 532.409 147.885 532.153 148.312C531.982 148.653 531.812 148.867 531.641 148.952C531.641 149.123 531.428 149.336 531.001 149.592C530.574 149.848 530.361 149.976 530.361 149.976C530.361 150.061 530.404 150.147 530.489 150.232C530.574 150.317 530.532 150.36 530.361 150.36C530.105 150.445 529.849 150.744 529.593 151.256C528.484 152.621 527.502 153.56 526.649 154.072V154.456C526.649 154.541 526.606 154.627 526.521 154.712C526.094 155.309 525.838 155.523 525.753 155.352C525.582 155.181 525.497 155.096 525.497 155.096C525.412 155.096 525.369 155.181 525.369 155.352C525.454 155.437 525.454 155.48 525.369 155.48L525.113 155.224L525.241 155.864V156.12C525.156 156.12 525.028 156.248 524.857 156.504C524.686 156.675 524.473 156.888 524.217 157.144C524.046 157.4 523.833 157.571 523.577 157.656C523.492 157.741 523.364 157.869 523.193 158.04C523.108 158.125 523.022 158.253 522.937 158.424C522.852 158.509 522.766 158.552 522.681 158.552C520.718 161.283 518.585 163.16 516.281 164.184C515.854 163.757 515.641 163.672 515.641 163.928C515.641 164.099 515.598 164.227 515.513 164.312C515.513 164.397 515.598 164.483 515.769 164.568C516.11 164.909 516.196 165.165 516.025 165.336C515.513 165.848 515.257 166.104 515.257 166.104C515.086 166.531 514.958 166.531 514.873 166.104C514.788 166.019 514.745 165.933 514.745 165.848L514.617 166.104C514.702 166.616 514.66 166.915 514.489 167C514.318 167 514.19 167.085 514.105 167.256C513.849 167.341 513.422 167.64 512.825 168.152C512.313 168.579 511.929 168.792 511.673 168.792C511.502 168.877 511.417 168.92 511.417 168.92C511.246 168.664 511.161 168.707 511.161 169.048C511.076 168.877 511.033 168.92 511.033 169.176C510.948 169.603 510.862 169.816 510.777 169.816C510.521 169.987 510.35 169.901 510.265 169.56C510.521 170.243 510.564 170.712 510.393 170.968C510.222 171.224 509.796 171.565 509.113 171.992C508.516 172.419 508.132 172.675 507.961 172.76C507.705 172.931 507.492 173.101 507.321 173.272C507.15 173.443 506.937 173.656 506.681 173.912C506.51 174.168 506.34 174.381 506.169 174.552C505.998 174.723 505.828 174.851 505.657 174.936C505.401 175.107 505.145 175.277 504.889 175.448C504.633 175.619 504.462 175.747 504.377 175.832C504.292 175.832 504.206 175.917 504.121 176.088C504.036 176.173 503.95 176.301 503.865 176.472C503.524 176.557 503.268 176.728 503.097 176.984C502.926 177.24 502.841 177.411 502.841 177.496C500.964 179.032 499.342 180.099 497.977 180.696C497.892 180.781 497.892 180.867 497.977 180.952C497.806 181.037 497.678 181.037 497.593 180.952C497.337 180.611 497.294 180.397 497.465 180.312C497.636 180.227 497.764 180.355 497.849 180.696C497.934 180.184 497.849 179.928 497.593 179.928C497.422 179.928 497.166 180.013 496.825 180.184C496.484 180.355 496.313 180.44 496.313 180.44C495.46 180.952 494.99 181.293 494.905 181.464C495.161 181.464 495.161 181.677 494.905 182.104C494.82 182.445 494.862 182.616 495.033 182.616C495.033 182.531 495.118 182.445 495.289 182.36L495.801 181.976C496.228 181.549 496.612 181.507 496.953 181.848C497.209 182.019 497.124 182.189 496.697 182.36C496.356 182.616 495.758 182.915 494.905 183.256C494.052 183.683 493.454 184.152 493.113 184.664C492.942 184.92 492.046 185.389 490.425 186.072C490.084 186.243 490.041 186.371 490.297 186.456C490.212 186.797 489.998 186.84 489.657 186.584C489.316 186.328 489.145 186.2 489.145 186.2C489.486 186.797 489.358 187.139 488.761 187.224C488.249 187.395 487.993 187.523 487.993 187.608C488.42 187.523 488.676 187.523 488.761 187.608C488.846 187.693 488.761 187.779 488.505 187.864C488.249 188.035 488.036 188.12 487.865 188.12C487.609 188.12 487.012 188.248 486.073 188.504C485.134 188.845 484.622 188.803 484.537 188.376C484.622 188.632 484.622 188.803 484.537 188.888C484.452 188.973 484.366 189.016 484.281 189.016C484.281 189.016 484.238 189.016 484.153 189.016C483.982 188.76 483.641 188.547 483.129 188.376C482.702 188.205 482.446 188.035 482.361 187.864C479.033 187.864 476.942 187.352 476.089 186.328C475.236 185.389 475.278 183.555 476.217 180.824C475.961 180.653 475.918 180.269 476.089 179.672C476.26 178.989 476.345 178.605 476.345 178.52C476.43 178.264 476.558 177.965 476.729 177.624C476.814 177.283 476.857 177.112 476.857 177.112C477.454 175.405 478.35 172.461 479.545 168.28C480.313 166.317 480.74 165.293 480.825 165.208C480.74 164.867 480.697 164.653 480.697 164.568C480.782 164.397 480.868 164.184 480.953 163.928C481.124 163.587 481.209 163.373 481.209 163.288C484.025 155.523 485.689 151.171 486.201 150.232C485.774 149.976 485.561 149.805 485.561 149.72V149.464C485.134 149.379 484.836 149.293 484.665 149.208C484.494 149.037 484.324 148.781 484.153 148.44C483.982 148.099 483.769 147.843 483.513 147.672C483.257 147.501 482.66 147.245 481.721 146.904C480.782 146.563 480.1 146.221 479.673 145.88C479.246 145.539 479.204 145.155 479.545 144.728C479.716 144.387 479.673 144.301 479.417 144.472L478.649 145.112C477.54 144.173 476.985 143.661 476.985 143.576C476.9 143.405 476.772 143.192 476.601 142.936C476.174 142.339 476.132 141.955 476.473 141.784C476.473 141.613 476.558 141.443 476.729 141.272C476.814 141.016 476.857 140.845 476.857 140.76C477.028 140.248 477.497 139.736 478.265 139.224C479.033 138.627 479.545 138.157 479.801 137.816C479.801 137.56 480.014 137.304 480.441 137.048C480.868 136.792 481.081 136.621 481.081 136.536C481.166 136.365 481.294 136.28 481.465 136.28C481.55 136.28 481.593 136.237 481.593 136.152C485.348 133.848 488.462 132.397 490.937 131.8C491.022 131.629 491.15 131.544 491.321 131.544C491.577 131.459 491.833 131.416 492.089 131.416C492.43 131.331 492.644 131.245 492.729 131.16C493.326 130.904 493.71 130.392 493.881 129.624C494.052 128.856 494.18 128.429 494.265 128.344C494.948 127.064 495.332 126.168 495.417 125.656C495.502 125.571 495.545 125.443 495.545 125.272C495.63 125.101 495.673 124.973 495.673 124.888C495.673 124.717 495.716 124.632 495.801 124.632C496.398 123.523 496.996 121.944 497.593 119.896C498.276 117.848 498.83 116.312 499.257 115.288C498.83 115.373 498.276 115.288 497.593 115.032C496.996 114.776 496.569 114.691 496.313 114.776C495.46 115.032 494.734 114.989 494.137 114.648C493.625 114.307 493.156 113.795 492.729 113.112C492.302 112.344 491.961 111.832 491.705 111.576C491.534 111.235 491.278 110.979 490.937 110.808C490.596 110.552 490.212 110.339 489.785 110.168C489.358 109.997 489.06 109.784 488.889 109.528C488.292 109.016 487.822 108.589 487.481 108.248C487.225 107.907 486.969 107.608 486.713 107.352C486.457 107.096 486.414 106.84 486.585 106.584C486.756 106.243 486.841 106.029 486.841 105.944C486.926 105.773 487.182 105.432 487.609 104.92C488.121 104.323 488.505 103.896 488.761 103.64C488.846 103.555 488.932 103.469 489.017 103.384C489.956 103.128 490.468 102.957 490.553 102.872C490.894 102.701 491.15 102.573 491.321 102.488C491.577 102.403 491.79 102.36 491.961 102.36C492.132 102.275 492.26 102.189 492.345 102.104C492.686 102.019 492.942 101.891 493.113 101.72C493.284 101.549 493.412 101.464 493.497 101.464C494.265 101.805 494.82 101.805 495.161 101.464C495.588 101.123 496.014 100.995 496.441 101.08C496.868 100.909 496.868 100.781 496.441 100.696C496.526 100.355 496.697 100.141 496.953 100.056C497.294 99.9707 497.593 100.013 497.849 100.184C498.105 100.269 498.233 100.397 498.233 100.568L498.489 100.44C498.489 100.184 498.617 99.9707 498.873 99.8C499.129 99.544 499.428 99.3733 499.769 99.288C500.11 99.1173 500.494 98.9893 500.921 98.904C501.433 98.7333 501.86 98.6053 502.201 98.52C502.542 98.4347 502.841 98.392 503.097 98.392C503.438 98.3067 503.609 98.264 503.609 98.264C506.51 97.4107 508.516 96.984 509.625 96.984C510.308 96.8987 511.545 96.472 513.337 95.704C517.177 95.2773 519.396 94.9787 519.993 94.808C519.993 95.1493 520.206 95.2773 520.633 95.192L520.761 95.064C521.017 95.2347 521.401 95.32 521.913 95.32C522.51 95.2347 522.852 95.2347 522.937 95.32C523.705 94.4667 525.07 94.1253 527.033 94.296C527.033 94.552 527.118 94.6373 527.289 94.552C527.46 94.3813 527.545 94.3387 527.545 94.424C527.63 94.424 527.758 94.4667 527.929 94.552C528.185 94.552 528.356 94.5947 528.441 94.68C528.526 94.5947 528.654 94.4667 528.825 94.296C528.996 94.1253 529.124 93.9973 529.209 93.912C529.38 93.8267 529.55 93.7413 529.721 93.656C529.892 93.5707 530.02 93.5707 530.105 93.656C530.276 93.656 530.404 93.7413 530.489 93.912C531.428 93.4853 532.58 93.1867 533.945 93.016C535.396 92.8453 536.505 92.8453 537.273 93.016C537.358 93.016 537.444 93.0587 537.529 93.144C537.614 92.888 537.87 92.6747 538.297 92.504C538.724 92.3333 539.022 92.3333 539.193 92.504C539.961 92.76 540.345 92.888 540.345 92.888C540.516 92.7173 540.772 92.5467 541.113 92.376C541.454 92.12 541.753 91.992 542.009 91.992C542.18 91.9067 542.393 91.864 542.649 91.864C542.905 91.7787 543.118 91.7787 543.289 91.864C543.46 91.864 543.588 91.9067 543.673 91.992C543.844 91.992 543.972 91.992 544.057 91.992C544.228 91.992 544.654 91.9067 545.337 91.736C546.02 91.48 546.489 91.3947 546.745 91.48C547.342 91.736 547.769 91.7787 548.025 91.608C548.281 91.352 548.58 91.224 548.921 91.224C550.286 91.224 551.524 91.1813 552.633 91.096C553.742 90.9253 554.638 90.8827 555.321 90.968C555.577 91.3093 556.004 91.352 556.601 91.096V90.84C556.43 90.4987 556.516 90.4133 556.857 90.584C557.454 90.9253 557.753 91.096 557.753 91.096C557.753 91.096 557.71 91.0533 557.625 90.968C557.028 90.712 557.028 90.584 557.625 90.584C557.881 90.584 558.094 90.584 558.265 90.584C558.436 90.4133 559.076 90.2853 560.185 90.2C561.38 90.1147 562.062 90.0293 562.233 89.944C562.233 90.0293 562.276 90.0293 562.361 89.944C562.617 90.0293 562.745 90.0293 562.745 89.944C562.83 89.8587 563.001 89.8587 563.257 89.944ZM497.209 100.824C497.294 100.824 497.337 100.824 497.337 100.824H497.209ZM533.305 146.648C533.22 146.648 533.177 146.648 533.177 146.648H533.305ZM531.129 148.056H531.001C530.83 148.227 530.788 148.312 530.873 148.312C530.873 148.312 530.958 148.227 531.129 148.056ZM530.105 148.184V148.056V148.184ZM529.849 149.464C529.849 149.464 529.806 149.549 529.721 149.72C529.636 149.805 529.593 149.848 529.593 149.848L531.001 148.44H530.873L529.849 149.464ZM515.513 164.952C515.513 164.867 515.513 164.824 515.513 164.824C515.513 164.824 515.47 164.824 515.385 164.824L515.513 164.952ZM510.777 161.752C510.606 161.667 510.521 161.624 510.521 161.624V161.88H510.649L510.777 161.752ZM509.113 165.592L509.881 164.696C509.881 164.696 509.796 164.739 509.625 164.824C509.113 165.251 508.942 165.507 509.113 165.592ZM509.369 168.28C508.942 168.451 508.644 168.707 508.473 169.048C508.473 169.133 508.516 169.176 508.601 169.176C509.028 169.005 509.284 168.707 509.369 168.28ZM507.577 169.816C507.492 169.816 507.406 169.901 507.321 170.072C507.236 170.157 507.193 170.2 507.193 170.2L507.321 170.328L507.961 169.688C507.876 169.688 507.748 169.731 507.577 169.816ZM494.265 183.128C494.692 182.787 494.862 182.616 494.777 182.616C494.692 182.616 494.436 182.659 494.009 182.744C493.924 182.915 494.009 183.043 494.265 183.128ZM528.441 125.144C528.441 125.059 528.398 124.973 528.313 124.888L528.441 125.144ZM521.273 130.904L521.401 130.776L521.273 130.904ZM521.145 130.648C521.145 130.563 521.145 130.52 521.145 130.52C521.145 130.52 521.102 130.52 521.017 130.52L521.145 130.648ZM520.505 131.032V131.16C520.59 131.16 520.59 131.117 520.505 131.032ZM542.009 94.296V94.168C541.924 94.168 541.924 94.2107 542.009 94.296ZM542.009 94.04C541.924 94.04 541.881 94.04 541.881 94.04H542.009ZM541.241 98.648C541.326 98.5627 541.412 98.52 541.497 98.52C541.497 98.008 541.284 97.9227 540.857 98.264C540.686 98.3493 540.686 98.4347 540.857 98.52C540.942 98.6053 541.07 98.648 541.241 98.648ZM543.929 93.912H543.801H543.929ZM545.081 93.656L544.953 93.784L545.081 93.656ZM546.105 93.528C546.19 93.6133 546.233 93.656 546.233 93.656L546.105 93.528ZM547.897 93.4H548.025H547.897ZM549.561 93.144L550.585 93.016C551.012 93.016 551.225 93.016 551.225 93.016L551.481 92.888C551.054 92.888 550.414 92.9733 549.561 93.144ZM614.003 65.496C614.686 65.4107 615.112 65.496 615.283 65.752C615.539 66.008 615.624 66.3493 615.539 66.776C615.624 66.8613 615.582 67.032 615.411 67.288V67.416C615.24 67.672 614.771 68.568 614.003 70.104L612.979 71.896V71.64C613.064 71.5547 613.064 71.4693 612.979 71.384C612.979 71.2133 612.979 71.128 612.979 71.128C612.894 71.2987 612.808 71.512 612.723 71.768C612.723 71.9387 612.68 72.1093 612.595 72.28C612.595 72.3653 612.595 72.4933 612.595 72.664C612.595 72.7493 612.595 72.792 612.595 72.792C612.339 73.2187 611.955 73.9867 611.443 75.096C611.016 76.12 610.675 76.8027 610.419 77.144C610.248 77.5707 609.95 78.1253 609.523 78.808C609.267 79.4907 608.243 81.88 606.451 85.976C606.024 86.9147 605.768 87.384 605.683 87.384C605.683 87.4693 605.683 87.5547 605.683 87.64C605.427 88.2373 604.915 89.304 604.147 90.84C603.464 92.376 602.952 93.528 602.611 94.296C602.526 94.3813 602.398 94.5093 602.227 94.68C602.142 94.7653 602.056 94.8933 601.971 95.064C601.886 95.1493 601.843 95.2347 601.843 95.32C601.758 95.4907 601.715 95.6613 601.715 95.832C601.715 95.9173 601.672 96.0027 601.587 96.088C601.502 96.344 601.288 96.6427 600.947 96.984C600.691 97.24 600.563 97.4107 600.563 97.496C600.648 97.6667 600.606 97.88 600.435 98.136C600.35 98.3067 600.35 98.392 600.435 98.392C599.411 99.8427 598.259 102.104 596.979 105.176C596.808 105.347 596.638 105.56 596.467 105.816C596.382 106.072 596.296 106.285 596.211 106.456C596.211 106.541 596.168 106.627 596.083 106.712C596.083 106.797 595.998 106.797 595.827 106.712C595.742 106.456 595.614 106.371 595.443 106.456C595.87 107.224 595.656 108.12 594.803 109.144C594.547 109.571 593.992 110.637 593.139 112.344C592.286 114.051 591.56 115.331 590.963 116.184C590.451 116.952 590.11 117.037 589.939 116.44C589.939 117.293 589.896 117.72 589.811 117.72C589.811 117.72 589.683 117.592 589.427 117.336C589.768 117.165 589.768 116.952 589.427 116.696C589.256 116.611 589.128 116.568 589.043 116.568C588.958 116.483 588.83 116.483 588.659 116.568C588.574 116.568 588.488 116.568 588.403 116.568C588.488 116.909 588.574 117.08 588.659 117.08C588.744 117.08 588.83 117.037 588.915 116.952C589.086 116.781 589.256 116.781 589.427 116.952C589.086 117.123 588.958 117.293 589.043 117.464C589.128 117.549 589.171 117.635 589.171 117.72C589.256 117.976 589.299 118.147 589.299 118.232C589.043 118.061 588.872 117.976 588.787 117.976C588.787 117.891 588.787 118.019 588.787 118.36V118.616C588.872 118.616 588.915 118.744 588.915 119C588.915 119.256 588.958 119.341 589.043 119.256C589.128 119.597 589.128 119.768 589.043 119.768C588.787 119.256 588.659 119.171 588.659 119.512C588.659 119.768 588.744 119.939 588.915 120.024C587.891 122.584 587.038 124.035 586.355 124.376C586.27 124.632 586.184 124.888 586.099 125.144C586.099 125.315 586.099 125.443 586.099 125.528C586.099 125.613 586.056 125.699 585.971 125.784C585.971 125.869 585.928 125.955 585.843 126.04C585.843 126.125 585.758 126.253 585.587 126.424C585.502 126.509 585.374 126.637 585.203 126.808C585.118 126.808 585.032 126.851 584.947 126.936C585.203 127.021 585.288 127.149 585.203 127.32C585.203 127.405 585.032 127.619 584.691 127.96C583.752 130.349 582.856 131.8 582.003 132.312C581.918 133.336 581.363 134.531 580.339 135.896C575.56 143.832 572.659 148.611 571.635 150.232C570.355 152.621 569.203 154.2 568.179 154.968C568.179 155.651 567.667 156.717 566.643 158.168C565.704 159.533 565.235 160.216 565.235 160.216C564.296 161.24 563.784 161.752 563.699 161.752C563.699 161.837 563.656 162.051 563.571 162.392C563.571 162.648 563.528 162.861 563.443 163.032C563.443 163.117 563.4 163.117 563.315 163.032C562.974 163.629 562.163 164.867 560.883 166.744C560.712 167 560.456 167.299 560.115 167.64C559.774 167.896 559.518 168.152 559.347 168.408C559.176 168.579 559.134 168.749 559.219 168.92C559.048 169.261 558.792 169.645 558.451 170.072C558.195 170.413 558.024 170.627 557.939 170.712C557.598 170.968 556.702 172.12 555.251 174.168L553.587 176.216L553.715 176.088C552.35 177.624 551.07 178.989 549.875 180.184C548.766 181.293 547.571 182.275 546.291 183.128C545.438 183.299 544.883 183.384 544.627 183.384C544.371 183.384 543.902 183.299 543.219 183.128C542.622 183.043 542.195 183 541.939 183C541.512 182.915 540.872 182.915 540.019 183C539.166 183.085 538.398 183.128 537.715 183.128C537.032 183.213 536.35 183.213 535.667 183.128C535.07 183.043 534.6 182.829 534.259 182.488C533.918 182.232 533.619 181.933 533.363 181.592C533.107 181.165 532.894 180.781 532.723 180.44C532.552 180.013 532.424 179.544 532.339 179.032C532.168 178.52 532.04 178.051 531.955 177.624C531.87 177.197 531.827 176.685 531.827 176.088C531.742 175.405 531.699 174.893 531.699 174.552C531.699 174.211 531.742 173.741 531.827 173.144C531.827 172.461 531.827 171.992 531.827 171.736C531.827 171.48 531.87 171.096 531.955 170.584C531.955 169.987 531.955 169.645 531.955 169.56H531.827C531.656 169.56 531.656 169.389 531.827 169.048C532.083 168.792 532.126 168.664 531.955 168.664C531.955 168.152 531.998 167.469 532.083 166.616C532.168 165.763 532.211 165.165 532.211 164.824C532.382 164.141 532.51 163.373 532.595 162.52C532.68 161.581 532.723 160.984 532.723 160.728C533.064 159.192 533.576 156.12 534.259 151.512C534.942 146.819 535.624 143.149 536.307 140.504C536.392 140.077 536.563 139.48 536.819 138.712C537.075 137.859 537.246 137.304 537.331 137.048C538.014 134.317 539.038 130.563 540.403 125.784C541.854 121.005 542.792 117.677 543.219 115.8C543.646 115.203 543.859 114.392 543.859 113.368C545.224 110.552 545.992 108.76 546.163 107.992C546.504 107.48 546.76 107.096 546.931 106.84C547.187 106.499 547.486 106.285 547.827 106.2C548.254 106.029 548.552 105.944 548.723 105.944C548.979 105.859 549.406 105.816 550.003 105.816C550.6 105.731 551.07 105.688 551.411 105.688C551.667 105.688 552.264 105.688 553.203 105.688C554.142 105.603 554.91 105.603 555.507 105.688C556.19 105.773 556.616 105.944 556.787 106.2C556.872 106.2 556.915 106.328 556.915 106.584C556.915 106.755 556.958 106.84 557.043 106.84C557.555 105.901 557.811 105.901 557.811 106.84L557.555 107.608C558.152 106.925 558.536 106.499 558.707 106.328C558.963 106.157 559.134 106.029 559.219 105.944C559.304 105.859 559.56 105.901 559.987 106.072C560.414 106.243 560.755 106.371 561.011 106.456L561.139 106.328C561.31 106.499 561.48 106.669 561.651 106.84C561.907 107.011 562.078 107.139 562.163 107.224C562.248 107.309 562.334 107.395 562.419 107.48C562.59 107.565 562.76 107.565 562.931 107.48C562.248 106.968 562.035 106.669 562.291 106.584C562.718 106.499 563.187 106.797 563.699 107.48C563.699 107.651 563.571 107.693 563.315 107.608C563.742 108.291 563.87 108.845 563.699 109.272C563.699 109.357 563.742 109.4 563.827 109.4C563.998 109.571 564.083 109.827 564.083 110.168C564.083 110.424 564.04 110.68 563.955 110.936C563.955 111.107 563.998 111.192 564.083 111.192C563.912 111.704 563.784 112.771 563.699 114.392C563.699 115.928 563.528 116.824 563.187 117.08C563.614 117.933 563.443 118.787 562.675 119.64C562.931 121.603 562.675 122.712 561.907 122.968C562.248 123.565 562.206 124.205 561.779 124.888C562.035 125.485 561.736 126.381 560.883 127.576C560.883 128.173 560.755 128.813 560.499 129.496C560.243 130.179 559.987 130.819 559.731 131.416C559.475 131.928 559.176 132.525 558.835 133.208C558.579 133.805 558.408 134.403 558.323 135C557.896 137.645 556.744 140.973 554.867 144.984C554.867 145.496 554.611 146.307 554.099 147.416C553.672 148.44 553.416 148.995 553.331 149.08L551.539 153.176C551.368 153.432 551.283 153.475 551.283 153.304C551.283 153.219 551.326 152.963 551.411 152.536C551.667 152.28 551.624 152.067 551.283 151.896C550.771 151.981 550.472 152.195 550.387 152.536C550.387 152.877 550.558 153.176 550.899 153.432C550.558 153.944 550.515 154.285 550.771 154.456C550.942 154.541 551.07 154.627 551.155 154.712C550.984 154.883 550.771 155.053 550.515 155.224C550.259 155.309 550.259 155.565 550.515 155.992C550.942 156.675 550.814 157.315 550.131 157.912C549.448 158.424 549.363 159.021 549.875 159.704C549.875 160.045 549.704 160.429 549.363 160.856C549.107 161.283 549.064 161.667 549.235 162.008C549.235 162.52 549.064 163.16 548.723 163.928C548.467 164.611 548.339 165.08 548.339 165.336C548.339 165.507 548.083 166.147 547.571 167.256C547.656 167.597 547.571 168.152 547.315 168.92C547.144 169.603 547.102 170.072 547.187 170.328C547.528 169.731 547.87 169.304 548.211 169.048C548.638 168.792 548.936 168.707 549.107 168.792C549.363 168.792 549.534 168.749 549.619 168.664C549.704 168.493 549.619 168.28 549.363 168.024C549.363 168.024 549.448 167.981 549.619 167.896C550.131 167.64 550.344 167.469 550.259 167.384H549.619C549.875 167.043 550.259 166.872 550.771 166.872C551.027 166.872 551.112 167 551.027 167.256C551.112 167.085 551.155 166.915 551.155 166.744C551.155 166.659 551.198 166.616 551.283 166.616L551.155 166.488C550.643 166.659 550.344 166.701 550.259 166.616C550.259 166.531 550.344 166.275 550.515 165.848C550.686 165.848 550.856 165.763 551.027 165.592C551.198 165.336 551.368 165.208 551.539 165.208C551.966 163.928 552.563 162.947 553.331 162.264C553.502 162.093 553.587 162.093 553.587 162.264C553.587 162.435 553.502 162.733 553.331 163.16C553.246 163.16 553.203 163.373 553.203 163.8C553.288 163.715 553.374 163.587 553.459 163.416C553.63 163.16 553.758 162.947 553.843 162.776C554.014 162.52 554.142 162.307 554.227 162.136C554.312 161.965 554.355 161.88 554.355 161.88C554.611 161.539 554.867 161.155 555.123 160.728C555.464 160.216 555.72 159.789 555.891 159.448C556.147 159.107 556.403 158.765 556.659 158.424C556.915 157.997 557.128 157.656 557.299 157.4C557.555 157.144 557.811 156.931 558.067 156.76C558.408 156.248 558.75 155.736 559.091 155.224C559.432 154.627 559.731 154.115 559.987 153.688C560.243 153.176 560.542 152.621 560.883 152.024C561.224 151.427 561.48 150.957 561.651 150.616C561.566 150.616 561.395 150.701 561.139 150.872C560.627 151.299 560.414 151.171 560.499 150.488C561.011 149.549 561.48 149.037 561.907 148.952C561.822 148.696 561.822 148.355 561.907 147.928C561.992 147.501 562.248 147.373 562.675 147.544L562.803 147.416C562.632 147.245 562.59 147.075 562.675 146.904C562.76 146.648 562.846 146.392 562.931 146.136C563.102 145.795 563.187 145.624 563.187 145.624C563.187 145.539 563.187 145.496 563.187 145.496C563.187 145.411 563.23 145.411 563.315 145.496C563.4 145.069 563.699 144.771 564.211 144.6C564.723 144.429 565.022 144.216 565.107 143.96C565.022 143.875 565.022 143.832 565.107 143.832C564.595 144.088 564.382 143.96 564.467 143.448C564.723 142.339 565.192 141.656 565.875 141.4C566.387 140.035 566.728 139.309 566.899 139.224C566.984 139.224 567.07 139.267 567.155 139.352C566.814 138.328 567.368 137.219 568.819 136.024C568.904 135.853 569.032 135.469 569.203 134.872C569.374 134.275 569.459 133.933 569.459 133.848C569.544 133.677 569.672 133.549 569.843 133.464C570.014 133.293 570.099 133.165 570.099 133.08C570.184 132.995 570.312 132.824 570.483 132.568C570.654 132.312 570.739 132.184 570.739 132.184C570.824 132.184 570.995 132.184 571.251 132.184C571.08 131.843 571.08 131.501 571.251 131.16C571.507 130.819 571.55 130.563 571.379 130.392C571.464 130.307 571.592 130.264 571.763 130.264C572.019 130.264 571.976 130.179 571.635 130.008C571.806 129.837 571.976 129.965 572.147 130.392V130.52C572.318 130.349 572.36 130.179 572.275 130.008C572.275 129.837 572.36 129.752 572.531 129.752C572.616 129.752 572.659 129.709 572.659 129.624C572.659 129.453 572.744 129.368 572.915 129.368L573.043 128.984C572.872 129.069 572.744 128.984 572.659 128.728C572.744 128.728 572.83 128.685 572.915 128.6C573.086 128.515 573.171 128.557 573.171 128.728C573.427 128.643 573.555 128.472 573.555 128.216C573.555 128.045 573.598 127.96 573.683 127.96C573.683 127.96 573.555 128.088 573.299 128.344C573.214 128.429 573.214 128.301 573.299 127.96C573.384 127.789 573.555 127.661 573.811 127.576C573.64 126.723 573.811 125.827 574.323 124.888C574.92 124.973 575.262 124.931 575.347 124.76C575.432 124.589 575.39 124.419 575.219 124.248C575.048 123.992 575.006 123.779 575.091 123.608C575.176 123.352 575.518 123.181 576.115 123.096C576.03 122.925 576.03 122.712 576.115 122.456C576.286 122.115 576.414 121.816 576.499 121.56C576.67 121.304 576.84 121.176 577.011 121.176C577.438 119.64 577.694 118.872 577.779 118.872C580.339 114.264 582.686 110.339 584.819 107.096C585.246 106.669 585.502 106.157 585.587 105.56C585.758 104.877 585.928 104.365 586.099 104.024C586.355 103.768 586.568 103.555 586.739 103.384C586.91 103.299 587.08 103.043 587.251 102.616C587.422 102.872 587.464 102.915 587.379 102.744C587.294 102.317 587.294 102.104 587.379 102.104C587.55 102.019 587.72 101.805 587.891 101.464C587.976 101.379 588.019 101.336 588.019 101.336C588.19 101.08 588.531 100.696 589.043 100.184C589.64 99.928 590.195 99.3733 590.707 98.52C591.304 97.6667 591.859 96.6427 592.371 95.448C592.968 94.2533 593.438 93.4427 593.779 93.016C594.547 91.5653 594.846 90.84 594.675 90.84C595.016 90.6693 595.272 90.4133 595.443 90.072C595.272 89.9867 595.187 89.9013 595.187 89.816C595.187 89.6453 595.23 89.4747 595.315 89.304C595.4 89.048 595.486 88.792 595.571 88.536C595.742 88.28 595.912 88.0667 596.083 87.896C596.254 87.7253 596.424 87.5547 596.595 87.384C596.766 87.128 596.936 86.9147 597.107 86.744C597.278 86.5733 597.448 86.4453 597.619 86.36C597.79 86.1893 597.875 86.0613 597.875 85.976C598.046 85.72 598.344 85.336 598.771 84.824C599.198 84.2267 599.454 83.8 599.539 83.544C599.624 83.3733 599.923 82.904 600.435 82.136C601.032 81.368 601.502 80.8133 601.843 80.472C602.184 79.8747 602.44 79.4053 602.611 79.064C602.782 78.808 602.952 78.5947 603.123 78.424C603.294 78.2533 603.422 78.1253 603.507 78.04C603.678 77.8693 603.763 77.7413 603.763 77.656C604.019 77.9973 604.403 78.2107 604.915 78.296C604.488 78.296 604.787 77.528 605.811 75.992C604.616 77.3573 604.574 77.2293 605.683 75.608V75.48C605.854 75.3093 605.982 75.096 606.067 74.84C606.238 74.584 606.366 74.3707 606.451 74.2C606.536 73.944 606.622 73.7733 606.707 73.688C607.134 73.3467 607.603 72.7493 608.115 71.896C608.712 71.0427 609.224 70.4453 609.651 70.104C609.651 70.0187 609.736 69.9333 609.907 69.848L610.035 69.72C610.12 69.5493 610.163 69.4213 610.163 69.336C611.016 68.568 611.4 68.184 611.315 68.184C611.23 68.184 611.016 68.312 610.675 68.568C611.016 67.9707 611.443 67.4587 611.955 67.032C612.467 66.52 612.766 66.2213 612.851 66.136C613.022 65.624 613.406 65.4107 614.003 65.496ZM550.515 156.888H550.643V156.76L550.515 156.888ZM549.747 132.056V132.184C549.832 132.184 549.832 132.141 549.747 132.056ZM552.563 135.384L552.435 135.512C552.52 135.512 552.563 135.469 552.563 135.384ZM554.099 131.16C553.928 131.587 553.715 132.013 553.459 132.44C553.203 132.781 553.075 132.952 553.075 132.952C552.563 134.317 552.435 134.957 552.691 134.872C553.118 134.616 553.416 134.061 553.587 133.208C553.587 132.781 553.715 132.525 553.971 132.44C554.312 132.269 554.483 132.099 554.483 131.928C554.91 131.757 555.123 131.629 555.123 131.544C555.208 131.373 555.123 131.16 554.867 130.904C555.208 130.392 555.379 129.667 555.379 128.728C555.123 128.728 554.91 128.899 554.739 129.24C554.568 129.581 554.44 129.965 554.355 130.392C554.27 130.733 554.184 130.989 554.099 131.16ZM550.643 127.192C550.472 127.363 550.344 127.533 550.259 127.704C550.259 127.875 550.259 128.045 550.259 128.216C550.259 128.301 550.216 128.429 550.131 128.6C550.131 128.685 550.046 128.771 549.875 128.856C549.619 128.941 549.576 129.027 549.747 129.112C549.918 129.197 550.003 129.283 550.003 129.368C550.003 129.624 549.918 130.093 549.747 130.776C549.662 131.203 549.619 131.501 549.619 131.672C549.79 131.928 549.96 131.885 550.131 131.544C550.302 131.203 550.472 131.117 550.643 131.288C550.728 131.459 550.686 131.8 550.515 132.312C550.344 132.739 550.302 133.037 550.387 133.208C550.302 133.464 550.344 133.635 550.515 133.72C550.686 133.72 550.856 133.677 551.027 133.592C551.198 133.507 551.326 133.592 551.411 133.848C551.752 134.189 551.923 134.232 551.923 133.976C552.008 133.72 552.051 133.549 552.051 133.464C552.222 133.293 552.307 133.123 552.307 132.952C552.307 132.781 552.264 132.611 552.179 132.44C552.179 132.269 552.136 132.141 552.051 132.056C552.051 131.971 552.008 131.885 551.923 131.8C551.838 131.629 551.752 131.501 551.667 131.416C552.094 131.416 552.136 131.203 551.795 130.776C551.624 130.435 551.624 130.179 551.795 130.008C552.222 129.667 552.264 129.027 551.923 128.088C552.35 127.832 552.392 127.448 552.051 126.936C551.966 126.851 551.923 126.765 551.923 126.68C551.838 126.595 551.795 126.552 551.795 126.552C551.88 126.467 552.008 126.424 552.179 126.424C552.35 126.424 552.435 126.339 552.435 126.168C552.435 125.997 552.392 125.827 552.307 125.656C552.307 125.4 552.35 125.187 552.435 125.016C552.435 124.504 552.435 124.205 552.435 124.12C552.435 124.035 552.478 123.864 552.563 123.608C552.648 123.267 552.734 122.925 552.819 122.584C552.648 122.755 552.008 123.949 550.899 126.168C550.899 126.424 550.814 126.595 550.643 126.68C550.643 126.936 550.856 127.064 551.283 127.064L550.643 127.192ZM542.323 182.872C542.494 182.957 542.579 183 542.579 183C542.579 183 542.408 182.915 542.067 182.744L542.323 182.872ZM547.699 181.848L547.571 181.976C547.656 181.891 547.699 181.848 547.699 181.848ZM554.227 163.032V162.904V163.032ZM551.411 165.976V165.848C551.411 165.933 551.411 165.976 551.411 165.976ZM553.331 175.192C553.246 175.448 553.203 175.619 553.203 175.704C553.374 175.704 553.544 175.576 553.715 175.32C553.715 175.149 553.587 175.107 553.331 175.192ZM551.283 167.384C551.454 167.384 551.752 167 552.179 166.232C552.691 165.464 552.99 165.08 553.075 165.08L553.203 164.824L553.843 163.672L553.587 163.928C553.416 164.013 553.203 164.227 552.947 164.568C552.776 164.909 552.648 165.08 552.563 165.08C552.478 165.421 552.392 165.635 552.307 165.72C552.222 165.293 552.094 165.08 551.923 165.08C551.923 165.165 551.966 165.336 552.051 165.592L552.179 165.848C551.923 166.104 551.624 166.616 551.283 167.384ZM554.099 174.296C553.672 174.637 553.672 174.808 554.099 174.808C554.27 174.723 554.355 174.68 554.355 174.68C554.184 174.68 554.099 174.552 554.099 174.296ZM556.019 165.08L555.891 165.336C555.976 165.251 556.019 165.165 556.019 165.08ZM560.115 156.504C559.859 156.675 559.731 156.845 559.731 157.016C559.731 157.101 559.646 157.272 559.475 157.528C559.902 157.101 560.115 156.803 560.115 156.632C560.115 156.547 560.115 156.504 560.115 156.504ZM560.371 161.368C560.115 161.88 560.03 162.136 560.115 162.136L561.267 160.6C561.352 160.429 561.352 160.387 561.267 160.472L560.371 161.368ZM565.107 143.448L565.363 143.32L565.491 143.064L565.107 143.448ZM571.251 150.232H571.123H571.251ZM571.379 135.896C571.294 136.152 571.336 136.195 571.507 136.024C571.507 135.853 571.464 135.811 571.379 135.896ZM571.635 131.288V131.416C571.72 131.416 571.72 131.373 571.635 131.288ZM582.899 116.056C583.155 115.715 583.24 115.501 583.155 115.416C582.814 116.013 582.643 116.355 582.643 116.44C582.643 116.44 582.643 116.525 582.643 116.696C582.728 116.696 582.728 116.696 582.643 116.696C582.643 116.611 582.728 116.397 582.899 116.056ZM585.459 126.04C585.544 126.04 585.587 126.04 585.587 126.04H585.459ZM587.251 116.696H587.507L587.379 116.568L587.251 116.696ZM589.171 100.312C589.086 100.312 589.043 100.397 589.043 100.568C589.128 100.653 589.171 100.568 589.171 100.312ZM587.891 115.544C587.72 115.544 587.72 115.587 587.891 115.672V115.544ZM587.891 121.304H588.019H587.891ZM588.019 120.152C587.934 120.237 587.934 120.28 588.019 120.28V120.152ZM588.147 120.28C588.147 120.451 588.232 120.451 588.403 120.28H588.147ZM588.275 119.512V119.384C588.19 119.384 588.19 119.427 588.275 119.512ZM590.067 112.6C590.664 111.661 590.92 110.979 590.835 110.552C590.92 110.125 590.878 109.912 590.707 109.912C590.451 109.997 590.28 110.168 590.195 110.424C590.11 110.509 590.067 110.552 590.067 110.552C589.982 110.723 589.726 111.235 589.299 112.088C588.872 112.941 588.531 113.539 588.275 113.88C588.104 114.307 588.019 114.648 588.019 114.904C588.019 115.075 588.062 115.245 588.147 115.416C588.232 115.501 588.232 115.587 588.147 115.672C588.147 115.672 588.019 115.715 587.763 115.8C587.934 116.568 588.403 116.141 589.171 114.52C589.768 113.24 590.067 112.6 590.067 112.6ZM604.403 78.68C604.403 78.68 604.403 78.7227 604.403 78.808H604.531L604.403 78.68ZM605.939 80.472H606.067H605.939ZM606.067 80.344C606.152 80.2587 606.195 80.1733 606.195 80.088L606.067 80.344ZM609.267 75.48V75.992C609.267 75.8213 609.267 75.6933 609.267 75.608C609.267 75.608 609.267 75.5653 609.267 75.48ZM611.955 67.288C612.126 67.1173 612.168 67.032 612.083 67.032C611.571 67.4587 611.4 67.7147 611.571 67.8L611.955 67.288Z"></path><path fill="var(--logo-red)" d="M180.361 89.1644V104.126L157.235 93.2817V131.446L259.422 180.743V125.723L180.361 89.1644Z"></path><path fill="var(--logo-red-shade)" d="M135.19 78.4697V131.446L33 180.743V125.723L135.19 78.4697Z"></path><path fill="var(--logo-red)" d="M33 125.723L135.19 175.021V228L33 180.743V125.723Z"></path><path fill="var(--logo-red-shade)" d="M259.422 125.723L157.235 175.021V228L259.422 180.743V125.723Z"></path><path fill="var(--logo-red)" d="M186.333 80.0491L158.207 66.8652V41.0888L186.333 54.2727V80.0491Z"></path><path fill="var(--logo-red)" d="M218.081 53.1775L200.625 44.9949V29L218.081 37.1827V53.1775Z"></path><path fill="var(--logo-red)" d="M230.11 100.278L206.051 89.0019V66.9561L230.11 78.2325V100.278Z"></path></svg>
```
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - logoVariants base: rounded-sm → --radius-sm
    - logoVariants link=true: focus-visible:shadow-focus → --shadow-focus
  - href: string; Link destination. Renders a native `a` that forwards anchor attributes and events; client-router navigation is the consumer's (wrap an unlinked Logo instead). Absent in image mode: the root is a named `span` image, not focusable. Docgen merges this branch with the link branch, so both share the text directive (setting it selects link mode). (components[] · packages/ui/src/atoms/logo/types.ts)
  - label: string; Accessible name of the image or link, for example `egdev, home` for a home link. An empty or whitespace-only label also falls back to the default name. (components[] · packages/ui/src/atoms/logo/types.ts)
  - size: enum; Height preset: sm 28px, md 32px, lg 36px. The width follows the artwork ratio. (components[] · packages/ui/src/atoms/logo/types.ts)
  - variant: enum; Artwork: the isometric isotype alone (`mark`) or the isotype with the white name (`wordmark`). Use the wordmark only on the canvas or surface backgrounds. (components[] · packages/ui/src/atoms/logo/types.ts)
### PhotoFrame
catalog[] · docs/catalog.json · @egdev/ui · atom · AspectRatio
- PhotoFrame (components[] · packages/ui/src/atoms/photo-frame/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - photoFrameLabelVariants base: font-display → --font-display
    - photoFrameLabelVariants base: text-label-eyebrow → --text-label-eyebrow
    - photoFrameLabelVariants base: text-inherit → unresolved
    - photoFrameMediaVariants variant=framed: p-1.5 → --spacing
    - photoFrameRootVariants base: rounded-none → --radius-none
    - photoFrameRootVariants base: shadow-none → unresolved
    - photoFrameRootVariants caption=none: gap-0 → --spacing-0
    - photoFrameRootVariants caption=default: gap-3 → --spacing-3
    - photoFrameRootVariants caption=framed: gap-10 → --spacing-10
    - photoFrameViewportVariants variant=default: rounded-xl → --radius-xl
    - photoFrameViewportVariants variant=framed: rounded-lg → --radius-lg
    - surfaceVariants({         tone: variant === 'framed' ? 'surface-0' : 'surface-1',         elevation: variant === 'framed' ? 2 : 1,         padding: 'none',         radius: 'xl'       }) · packages/ui/src/atoms/photo-frame/usePhotoFrame.ts; see Surface anatomy
  - alt: string; Image alternative; use an explicit empty string for decorative media. (components[] · packages/ui/src/atoms/photo-frame/types.ts)
  - focalPoint: enum; Static cover alignment inside the viewport. Corners combine a horizontal and a vertical physical keyword, so the crop never mirrors. Unrecognised values fall back to center. (components[] · packages/ui/src/atoms/photo-frame/types.ts)
  - imageCaption: string; Optional plain caption; blank text omits the caption and its gap. (components[] · packages/ui/src/atoms/photo-frame/types.ts)
  - ratio: number \| PhotoFrameRatio; Reserved viewport proportion. `square` is 1, `portrait` is 4/5 and `landscape` is 4/3; `auto` reserves nothing, so the media fills the height the host layout gives the figure and the host owns that definite height. `auto` also stretches the figure itself (`h-full min-h-0`) so a grid, flex or block host can size it instead of the image's natural height. A number is the width divided by the height and is normalised by AspectRatio; unrepresentable numbers (zero, negative, NaN, infinite) fall back to a square. Unrecognised strings fall back to landscape. (components[] · packages/ui/src/atoms/photo-frame/types.ts)
  - src: string; Image resource; the caller supplies a non-empty source. (components[] · packages/ui/src/atoms/photo-frame/types.ts)
  - variant: enum; Material framing treatment. (components[] · packages/ui/src/atoms/photo-frame/types.ts)
### Pixel
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Pixel (components[] · packages/ui/src/atoms/pixel/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - state: enum; Position condition selected by the consumer, not inferred from progress. (components[] · packages/ui/src/atoms/pixel/types.ts)
### ProgressBar
catalog[] · docs/catalog.json · @egdev/ui · atom · Progress
- ProgressBar (components[] · packages/ui/src/atoms/progress-bar/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - progressBarFillVariants size=lg: rounded-[inherit] → unresolved
    - progressBarFillVariants size=lg: shadow-edge-strong → --shadow-edge-strong
    - progressBarVariants size=lg: rounded-full → --radius-full
    - progressBarVariants size=lg: shadow-well → --shadow-well
    - progressBarVariants edge=true: rounded-none → --radius-none
    - progressBarVariants {"size":"sm","edge":"false"}: rounded-[var(--radius-sm)] → --radius-sm
  - edge: boolean; Pins the bar to the bottom edge of the nearest positioned, overflow-clipping ancestor, full width and without radius. Only available with the sm size. (components[] · packages/ui/src/atoms/progress-bar/types.ts)
  - label: string; Accessible name of the progressbar; never rendered visibly. When omitted, empty or whitespace-only, the bar is decorative and hidden from assistive technology, so the consumer must expose the progress as text. (components[] · packages/ui/src/atoms/progress-bar/types.ts)
  - size: enum; sm is a 2px hairline bar; lg is a 10px goal bar in a Material well. (components[] · packages/ui/src/atoms/progress-bar/types.ts)
  - value: number; Progress in percent. Finite values clamp to 0–100; non-finite values are indeterminate: no aria-valuenow, data-state="indeterminate" and an empty fill. (components[] · packages/ui/src/atoms/progress-bar/types.ts)
  - valueText: string; Text equivalent announced as aria-valuetext for finite values. When omitted, the Radix rounded percentage ("45%") is announced. (components[] · packages/ui/src/atoms/progress-bar/types.ts)
  - variant: enum; default paints the brand fill (gradient on lg); muted paints a comparison series in fg-muted. (components[] · packages/ui/src/atoms/progress-bar/types.ts)
### PullQuote
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- PullQuote (components[] · packages/ui/src/atoms/pull-quote/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - pullQuoteSourceVariants base: font-sans → --font-sans
    - pullQuoteSourceVariants base: text-body-default → --text-body-default
    - pullQuoteVariants base: p-0 → --spacing-0
  - accent: string; Optional trailing emphasized run of the same quotation, inline for pull and block for display. Blank text renders no accent. No separator is inserted: supply the space in text. (components[] · packages/ui/src/atoms/pull-quote/types.ts)
  - source: string; Optional visible attribution or contextual caption rendered in a figcaption outside the quoted passage. Plain text only: never parsed into an author, work title or link. Blank text renders no caption. (components[] · packages/ui/src/atoms/pull-quote/types.ts)
  - text: string; Main quoted passage as plain text. Must contain non-whitespace content: blank text warns in development and renders nothing. Punctuation and whitespace are preserved; no quotation marks are inserted. (components[] · packages/ui/src/atoms/pull-quote/types.ts)
  - tone: enum; Accent context: raised on surface-1…3 or overlay hosts. Only the accent color changes. (components[] · packages/ui/src/atoms/pull-quote/types.ts)
  - variant: enum; Quote presentation. Both variants keep blockquote semantics; display never creates a heading. (components[] · packages/ui/src/atoms/pull-quote/types.ts)
### RadioGroup
catalog[] · docs/catalog.json · @egdev/ui · atom · RadioGroup
- RadioGroup (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - radioGroupIndicatorVariants base: rounded-full → --radius-full
    - radioGroupItemVariants base: p-0 → --spacing-0
    - radioGroupItemVariants base: rounded-full → --radius-full
    - radioGroupItemVariants base: shadow-[var(--shadow-well)] → --shadow-well
    - radioGroupItemVariants base: data-[state=checked]:shadow-[var(--shadow-btn-primary)] → --shadow-btn-primary
    - radioGroupItemVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - radioGroupItemVariants base: data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - radioGroupRootVariants orientation=vertical: gap-1 → --spacing-1
    - radioGroupRootVariants orientation=horizontal: gap-x-6 → --spacing-6
    - radioGroupRootVariants orientation=horizontal: gap-y-1 → --spacing-1
    - radioGroupRowVariants base: gap-2 → --spacing-2
    - radioGroupRowVariants base: font-sans → --font-sans
    - radioGroupRowVariants base: text-label-default → --text-label-default
  - defaultValue: string; Initial selected value when uncontrolled. Nothing is selected when omitted. (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - disabled: boolean; Disables every option: none can be focused or selected and every row dims to 45% opacity. (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - label: string; Accessible name of the group, applied as its aria-label. A consumer aria-labelledby, for example a Field legend, takes precedence. (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - name: string; Form field name submitted with the checked value through hidden radio inputs. No field is submitted when omitted. (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - onValueChange: ((value: string) => void); Called with the newly selected value after user interaction only. (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - options: RadioGroupOption[]; Options rendered in order as a radio and its visible label. Values must be unique. (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - orientation: enum; Layout and arrow-key axis: a column navigated with Up/Down or a wrapping row navigated with Left/Right. (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - required: boolean; Requires a selection for form validity and sets aria-required on the group. (components[] · packages/ui/src/atoms/radio-group/types.ts)
  - value: string; Controlled selected value. When omitted the group is uncontrolled; a value that matches no option checks nothing. (components[] · packages/ui/src/atoms/radio-group/types.ts)
### ScrollReveal
catalog[] · docs/catalog.json · @egdev/effects · atom · —
- ScrollReveal (components[] · packages/effects/src/scroll-reveal/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - asChild: boolean; Advanced opt-in: merge behavior and state markers onto the consumer's single native child element instead of rendering the wrapper root. Allowed only under the documented conflict policy. (components[] · packages/effects/src/scroll-reveal/types.ts)
  - delay: number; Static transition delay in milliseconds for stagger. Must be a finite number >= 0; non-finite or negative values are ignored and the element runs with no delay. (components[] · packages/effects/src/scroll-reveal/types.ts)
  - variant: enum; Entrance style: `reveal` fades in and rises; `wipe` uncovers left to right via clip-path. (components[] · packages/effects/src/scroll-reveal/types.ts)
### SearchTrigger
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- SearchTrigger (components[] · packages/ui/src/atoms/search-trigger/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - searchTriggerVariants base: gap-3 → --spacing-3
    - searchTriggerVariants base: ps-3 → --spacing-3
    - searchTriggerVariants base: pe-2 → --spacing-2
    - searchTriggerVariants base: py-0 → --spacing-0
    - searchTriggerVariants base: font-sans → --font-sans
    - searchTriggerVariants base: text-label-default → --text-label-default
    - searchTriggerVariants base: font-[var(--text-body-default--font-weight)] → --text-body-default--font-weight
    - searchTriggerVariants base: focus-visible:shadow-focus → --shadow-focus
    - searchTriggerVariants compact=true: p-0 → --spacing-0
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/atoms/search-trigger/useSearchTrigger.ts; see Surface anatomy
  - compact: boolean; Show only the search icon without changing the accessible name. (components[] · packages/ui/src/atoms/search-trigger/types.ts)
  - label: string; Visible search label and accessible button name, also used in compact mode. A supplied value must be non-empty. (components[] · packages/ui/src/atoms/search-trigger/types.ts)
  - shortcut: string; Display-only keyboard hint shown in a decorative Kbd. Omitted unless the host supplies a real binding; whitespace-only text is omitted too. It never registers a shortcut. (components[] · packages/ui/src/atoms/search-trigger/types.ts)
### Select
catalog[] · docs/catalog.json · @egdev/ui · atom · Select
- Select (components[] · packages/ui/src/atoms/select/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - selectContentVariants base: p-2 → --spacing-2
    - selectContentVariants base: rounded-lg → --radius-lg
    - selectContentVariants base: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - selectItemVariants base: gap-3 → --spacing-3
    - selectItemVariants base: rounded-md → --radius-md
    - selectItemVariants base: px-3 → --spacing-3
    - selectItemVariants base: py-2 → --spacing-2
    - selectItemVariants base: pr-8 → --spacing-8
    - selectItemVariants base: font-sans → --font-sans
    - selectItemVariants base: text-body-default → --text-body-default
    - selectTriggerVariants base: shadow-[var(--shadow-well)] → --shadow-well
    - selectTriggerVariants base: rounded-md → --radius-md
    - selectTriggerVariants base: font-sans → --font-sans
    - selectTriggerVariants base: text-left → unresolved
    - selectTriggerVariants base: focus-visible:shadow-[var(--shadow-well),var(--shadow-focus)] → --shadow-well, --shadow-focus
    - selectTriggerVariants base: data-[state=open]:shadow-[var(--shadow-well),var(--shadow-focus)] → --shadow-well, --shadow-focus
    - selectTriggerVariants size=md: pl-3 → --spacing-3
    - selectTriggerVariants size=md: pr-10 → --spacing-10
    - selectTriggerVariants size=md: py-2 → --spacing-2
    - selectTriggerVariants size=md: text-body-default → --text-body-default
    - selectTriggerVariants size=sm: pl-3 → --spacing-3
    - selectTriggerVariants size=sm: pr-10 → --spacing-10
    - selectTriggerVariants size=sm: py-1.5 → --spacing
    - selectTriggerVariants size=sm: text-label-default → --text-label-default
    - selectTriggerVariants size=sm: font-(weight:--text-body-default--font-weight) → --text-body-default--font-weight
  - defaultValue: string; Initial uncontrolled value; omitted means no selection. (components[] · packages/ui/src/atoms/select/types.ts)
  - disabled: boolean; Native-equivalent disabled state for the trigger and hidden select. (components[] · packages/ui/src/atoms/select/types.ts)
  - name: string; Native-equivalent form field name, routed to the Radix hidden select. (components[] · packages/ui/src/atoms/select/types.ts)
  - onValueChange: ((value: string) => void); Called on user selection, not incoming prop updates. (components[] · packages/ui/src/atoms/select/types.ts)
  - options: SelectOption[]; Options in display order; each value must be a non-empty unique string. (components[] · packages/ui/src/atoms/select/types.ts)
  - placeholder: string; Text shown without a selection; never the accessible name. Omitted means an empty value area. (components[] · packages/ui/src/atoms/select/types.ts)
  - required: boolean; Native-equivalent required selection for form participation. (components[] · packages/ui/src/atoms/select/types.ts)
  - size: enum; Trigger height: md 44px or sm 36px. Content sizing is unchanged. (components[] · packages/ui/src/atoms/select/types.ts)
  - value: string; Controlled selected value; omitted for uncontrolled use. (components[] · packages/ui/src/atoms/select/types.ts)
### Slider
catalog[] · docs/catalog.json · @egdev/ui · atom · Slider
- Slider (components[] · packages/ui/src/atoms/slider/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - sliderThumbVariants base: rounded-full → --radius-full
    - sliderThumbVariants base: shadow-[var(--shadow-elev-1)] → --shadow-elev-1
    - sliderThumbVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - sliderTrackVariants base: rounded-full → --radius-full
    - sliderTrackVariants base: shadow-[var(--shadow-well)] → --shadow-well
  - defaultValue: number; Initial value when uncontrolled, clamped to [min, max]. Falls back to min when omitted. (components[] · packages/ui/src/atoms/slider/types.ts)
  - disabled: boolean; Blocks keyboard and pointer changes, removes the thumb from the Tab order and dims the slider. (components[] · packages/ui/src/atoms/slider/types.ts)
  - label: string; Accessible name of the thumb. When a Field renders a visible label it passes the same text. (components[] · packages/ui/src/atoms/slider/types.ts)
  - max: number; Upper bound. (components[] · packages/ui/src/atoms/slider/types.ts)
  - min: number; Lower bound. (components[] · packages/ui/src/atoms/slider/types.ts)
  - name: string; Form field name; inside a form a hidden input submits the current value. Nothing is submitted when omitted. (components[] · packages/ui/src/atoms/slider/types.ts)
  - onValueChange: ((value: number) => void); Called with the new value while the user changes it; never for incoming prop updates. (components[] · packages/ui/src/atoms/slider/types.ts)
  - onValueCommit: ((value: number) => void); Called with the final value when the user ends an interaction: pointer release or each keyboard step. (components[] · packages/ui/src/atoms/slider/types.ts)
  - step: number; Step between values; Page keys and Shift+arrows move ten steps. (components[] · packages/ui/src/atoms/slider/types.ts)
  - value: number; Controlled value, rendered clamped to [min, max]. When omitted the slider is uncontrolled. (components[] · packages/ui/src/atoms/slider/types.ts)
  - valueText: ((value: number) => string); Formats the current value as the thumb's aria-valuetext. When omitted, or when it returns an empty string, assistive technology announces the number. (components[] · packages/ui/src/atoms/slider/types.ts)
### Spinner
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Spinner (components[] · packages/ui/src/atoms/spinner/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - label: string; Non-empty status text read by assistive technology; makes the root a polite status region. When omitted, empty or whitespace-only, the spinner is decorative and hidden from assistive technology, for hosts that own their busy state (for example a loading Button). (components[] · packages/ui/src/atoms/spinner/types.ts)
  - size: enum; Icon-scale square: sm 16px, md 20px (--icon-size), lg 28px. (components[] · packages/ui/src/atoms/spinner/types.ts)
### Stat
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Stat (components[] · packages/ui/src/atoms/stat/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - statDeltaVariants base: font-sans → --font-sans
    - statDeltaVariants base: text-label-default → --text-label-default
    - statLabelVariants base: font-display → --font-display
    - statLabelVariants base: text-meta → --text-meta
    - statValueVariants base: font-display → --font-display
    - statValueVariants size=md: text-display-stat → --text-display-stat
    - statValueVariants size=sm: text-display-stat-sm → --text-display-stat-sm
    - statVariants base: rounded-lg → --radius-lg
    - statVariants base: shadow-[var(--shadow-edge),var(--shadow-elev-1)] → --shadow-edge, --shadow-elev-1
    - statVariants base: data-[state=highlighted]:shadow-[var(--shadow-edge),var(--shadow-glow-base)] → --shadow-edge, --shadow-glow-base
    - statVariants size=md: gap-1.5 → --spacing
    - statVariants size=md: px-4 → --spacing-4
    - statVariants size=md: py-3 → --spacing-3
    - statVariants size=sm: gap-1 → --spacing-1
    - statVariants size=sm: px-3 → --spacing-3
    - statVariants size=sm: py-2.5 → --spacing
  - delta: string; Short context under the figure, such as the latest change or why there is no data. When omitted, no delta element is rendered. (components[] · packages/ui/src/atoms/stat/types.ts)
  - highlighted: boolean; Brief emphasis after a change: brand border and glow. The consumer starts and ends it and keeps one highlighted Stat at a time; the component never starts timers. (components[] · packages/ui/src/atoms/stat/types.ts)
  - label: string; Visible label of what is counted; it is also the accessible name of the group. (components[] · packages/ui/src/atoms/stat/types.ts)
  - size: enum; Figure scale: `md` 36px, `sm` 28px with tighter padding and gap. (components[] · packages/ui/src/atoms/stat/types.ts)
  - unavailableText: string; Accessible replacement for the em dash, used only when `value` is `null`. (components[] · packages/ui/src/atoms/stat/types.ts)
  - value: string \| number \| null; The figure. Numbers render as `String(value)` and strings render as given, so the consumer owns locale formatting. `null` means no data: a muted em dash hidden from assistive technology plus the readable `unavailableText`; it never renders 0. (components[] · packages/ui/src/atoms/stat/types.ts)
### StatusDot
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- StatusDot (components[] · packages/ui/src/atoms/status-dot/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - statusDotVariants base: rounded-full → --radius-full
    - statusDotVariants state=live: shadow-glow-hot → --shadow-glow-hot
    - statusDotVariants state=standby: shadow-glow-hot → --shadow-glow-hot
  - pulse: boolean; Animates the live/standby pulse. It has no effect on status states, and reduced-motion preferences always render the dot static. (components[] · packages/ui/src/atoms/status-dot/types.ts)
  - state: enum; Condition the dot represents, selected by the consumer. Status states (running, idle, warning, error, stopped) are 8px ringed dots; signal states (live, standby) are 10px glowing dots. (components[] · packages/ui/src/atoms/status-dot/types.ts)
### Switch
catalog[] · docs/catalog.json · @egdev/ui · atom · Switch
- Switch (components[] · packages/ui/src/atoms/switch/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - switchThumbVariants base: rounded-full → --radius-full
    - switchVariants base: p-0 → --spacing-0
    - switchVariants base: rounded-full → --radius-full
    - switchVariants base: shadow-[var(--shadow-well)] → --shadow-well
    - switchVariants base: data-[state=checked]:shadow-[var(--shadow-btn-primary)] → --shadow-btn-primary
    - switchVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - switchVariants base: data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
  - checked: boolean; Controlled on/off state. When omitted the switch is uncontrolled and starts from defaultChecked. (components[] · packages/ui/src/atoms/switch/types.ts)
  - defaultChecked: boolean; Initial on/off state when uncontrolled. (components[] · packages/ui/src/atoms/switch/types.ts)
  - disabled: boolean; Removes the switch from the Tab order and blocks toggling; dims it to 45% opacity. (components[] · packages/ui/src/atoms/switch/types.ts)
  - name: string; Form field name submitted with the value while the switch is on. No field is submitted when omitted. (components[] · packages/ui/src/atoms/switch/types.ts)
  - onCheckedChange: ((checked: boolean) => void); Called with the next state when the user toggles the switch; apply the immediate effect here. (components[] · packages/ui/src/atoms/switch/types.ts)
  - required: boolean; Marks the switch as required for form validation. (components[] · packages/ui/src/atoms/switch/types.ts)
  - value: string; Value submitted with the form while the switch is on. (components[] · packages/ui/src/atoms/switch/types.ts)
### Textarea
catalog[] · docs/catalog.json · @egdev/ui · atom · —
- Textarea (components[] · packages/ui/src/atoms/textarea/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - textareaVariants base: rounded-md → --radius-md
    - textareaVariants variant=default: well → unresolved
    - textareaVariants variant=default: font-sans → --font-sans
    - textareaVariants variant=default: text-body-default → --text-body-default
    - textareaVariants variant=code: well → unresolved
    - textareaVariants variant=code: font-mono → --font-mono
    - textareaVariants variant=code: text-code → --text-code
    - textareaVariants variant=prose: p-5 → --spacing-5
    - textareaVariants variant=prose: font-sans → --font-sans
    - textareaVariants variant=prose: text-body-default → --text-body-default
    - textareaVariants variant=prose: shadow-[var(--shadow-edge),var(--shadow-elev-1)] → --shadow-edge, --shadow-elev-1
    - textareaVariants variant=prose: focus-visible:shadow-[var(--shadow-edge),var(--shadow-elev-1),var(--shadow-glow-base),var(--shadow-focus)] → --shadow-edge, --shadow-elev-1, --shadow-glow-base, --shadow-focus
  - variant: enum; Visual treatment: `default` well for general text, `code` mono well for CSS, URLs and commands, `prose` raised sheet for long-form drafts. (components[] · packages/ui/src/atoms/textarea/types.ts)
### Toggle
catalog[] · docs/catalog.json · @egdev/ui · atom · Toggle + AccessibleIcon
- Toggle (components[] · packages/ui/src/atoms/toggle/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - toggleVariants base: py-0 → --spacing-0
    - toggleVariants base: rounded-md → --radius-md
    - toggleVariants base: [box-shadow:none] → unresolved
    - toggleVariants base: font-sans → --font-sans
    - toggleVariants base: text-label-default → --text-label-default
    - toggleVariants base: text-center → unresolved
    - toggleVariants base: gap-2 → --spacing-2
    - toggleVariants base: data-[state=on]:[box-shadow:var(--shadow-edge-strong),var(--shadow-elev-1)] → --shadow-edge-strong, --shadow-elev-1
    - toggleVariants base: focus-visible:[box-shadow:var(--shadow-focus)] → --shadow-focus
    - toggleVariants base: data-[state=on]:focus-visible:[box-shadow:var(--shadow-focus)] → --shadow-focus
    - toggleVariants size=sm: px-2 → --spacing-2
    - toggleVariants size=md: px-3 → --spacing-3
    - toggleVariants size=lg: px-3 → --spacing-3
    - toggleVariants iconOnly=true: p-0 → --spacing-0
  - children: ReactNode; Visible short text naming the condition; keep the name constant while toggling. No visible text in the icon-only form. (components[] · packages/ui/src/atoms/toggle/types.ts)
  - defaultPressed: boolean; Initial pressed state when uncontrolled. (components[] · packages/ui/src/atoms/toggle/types.ts)
  - icon: ReactElement<unknown, string \| JSXElementConstructor<any>>; Optional leading decorative glyph; omitted when absent. Required decorative glyph in the icon-only form, named separately by label. (components[] · packages/ui/src/atoms/toggle/types.ts)
  - label: string; Not used with visible text; the text supplies the accessible name. Required non-empty accessible name describing the condition, not its next action. (components[] · packages/ui/src/atoms/toggle/types.ts)
  - onPressedChange: ((pressed: boolean) => void); Called with the next boolean after user activation. (components[] · packages/ui/src/atoms/toggle/types.ts)
  - pressed: boolean; Controlled pressed state; uncontrolled when absent. Incoming updates emit no event. (components[] · packages/ui/src/atoms/toggle/types.ts)
  - size: enum; Control height: sm 32px, md 40px, lg 48px. Icon-only controls are square. (components[] · packages/ui/src/atoms/toggle/types.ts)
### Tooltip
catalog[] · docs/catalog.json · @egdev/ui · atom · Tooltip
- Tooltip (components[] · packages/ui/src/atoms/tooltip/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - tooltipVariants base: px-2 → --spacing-2
    - tooltipVariants base: py-1 → --spacing-1
    - tooltipVariants base: rounded-sm → --radius-sm
    - tooltipVariants base: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - tooltipVariants base: text-label-default → --text-label-default
    - tooltipVariants base: font-sans → --font-sans
  - children: ReactElement<unknown, string \| JSXElementConstructor<any>>; Exactly one focusable trigger element, rendered as the Radix trigger through `asChild`. It must forward refs, spread props and keep its own accessible name. (components[] · packages/ui/src/atoms/tooltip/types.ts)
  - className: string; Layout-safe classes merged last onto the bubble, for example `text-center` for multi-line text. Appearance overrides are unsupported. (components[] · packages/ui/src/atoms/tooltip/types.ts)
  - content: string; Supplementary plain text shown in the bubble and announced as the trigger's description. Not interactive, not rich content and never the trigger's accessible name. (components[] · packages/ui/src/atoms/tooltip/types.ts)
  - side: enum; Preferred side of the trigger; Radix flips to the opposite side when there is no room. (components[] · packages/ui/src/atoms/tooltip/types.ts)
### AspectRatio
catalog[] · docs/catalog.json · @egdev/ui · primitive · AspectRatio
- AspectRatio (components[] · packages/ui/src/primitives/aspect-ratio/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - ratio: number; Width divided by height. Non-positive, non-finite or unrepresentable reciprocal percentages fall back to a square. The parent owns width. (components[] · packages/ui/src/primitives/aspect-ratio/types.ts)
### Divider
catalog[] · docs/catalog.json · @egdev/ui · primitive · Separator
- Divider (components[] · packages/ui/src/primitives/divider/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - dividerVariants base: p-0 → --spacing-0
  - decorative: boolean; Whether the rule is decoration rather than a meaningful content boundary. Changes semantics only, never paint. Set false for a semantic separator. (components[] · packages/ui/src/primitives/divider/types.ts)
  - orientation: enum; Rule axis, shared with Radix semantic orientation. Horizontal fades physically left to right, including in RTL. Parent layout supplies the available horizontal length. (components[] · packages/ui/src/primitives/divider/types.ts)
### Label
catalog[] · docs/catalog.json · @egdev/ui · primitive · Label
- Label (components[] · packages/ui/src/primitives/label/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - labelVariants base: font-sans → --font-sans
    - labelVariants base: text-label-default → --text-label-default
    - labelVariants variant=choice: font-[var(--text-body-default--font-weight)] → --text-body-default--font-weight
  - children: ReactNode; Required visible label text. (components[] · packages/ui/src/primitives/label/types.ts)
  - variant: enum; Visual treatment: field pairs with form controls, choice precedes checkbox-like controls. (components[] · packages/ui/src/primitives/label/types.ts)
### Portal
catalog[] · docs/catalog.json · @egdev/ui · primitive · Portal
- Portal (components[] · packages/ui/src/primitives/portal/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - children: ReactNode; Layered content to render out of tree. The property is required, but ReactNode may be empty. (components[] · packages/ui/src/primitives/portal/types.ts)
  - container: Element \| DocumentFragment \| null; Ready client-side mount node. Absent or null uses document.body after mounting. To wait for a node, render Portal conditionally; null does not defer mounting. Do not supply a DOM container during server rendering. (components[] · packages/ui/src/primitives/portal/types.ts)
### Skeleton
catalog[] · docs/catalog.json · @egdev/ui · primitive · —
- Skeleton (components[] · packages/ui/src/primitives/skeleton/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - skeletonVariants base: p-0 → --spacing-0
    - skeletonVariants variant=line: rounded-sm → --radius-sm
    - skeletonVariants variant=block: rounded-md → --radius-md
    - skeletonVariants variant=circle: rounded-full → --radius-full
  - pulse: boolean; Plays a decorative opacity pulse while the placeholder is shown. Reduced-motion preferences always render it static. (components[] · packages/ui/src/primitives/skeleton/types.ts)
  - size: enum; Token-backed, variant-specific dimensions. Numeric sizes are not supported. (components[] · packages/ui/src/primitives/skeleton/types.ts)
  - variant: enum; Presentation silhouette, not a loading state or semantic role. (components[] · packages/ui/src/primitives/skeleton/types.ts)
### Slot
catalog[] · docs/catalog.json · @egdev/ui · primitive · Slot
- Slot (components[] · packages/ui/src/index.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - surfaceVariants({         tone: variant === 'framed' ? 'surface-0' : 'surface-1',         elevation: variant === 'framed' ? 2 : 1,         padding: 'none',         radius: 'xl'       }) · packages/ui/src/atoms/photo-frame/usePhotoFrame.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/atoms/search-trigger/useSearchTrigger.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/article-feature/useArticleFeature.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }) · packages/ui/src/molecules/article-feature/useArticleFeature.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'full' }) · packages/ui/src/molecules/menu/types.ts; see Surface anatomy
    - surfaceVariants({ tone: 'overlay', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/menu/useMenu.ts; see Surface anatomy
    - surfaceVariants({             tone: effectiveTone === 'overlay' ? 'surface-1' : 'surface-0',             elevation: 0,             padding: 'none',             radius: 'none'           }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
    - surfaceVariants({             tone: effectiveTone === 'overlay' ? 'surface-3' : 'surface-2',             elevation: 0,             padding: 'none',             radius: 'none'           }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
    - surfaceVariants({           tone: effectiveTone,           ...(effectiveTone === 'surface-1' ? { elevation: 1 } : {}),           padding: 'none',           radius: 'xl'         }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'md' }) · packages/ui/src/molecules/nav-list/useNavList.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/notice/types.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
    - surfaceVariants({ tone: bandTone, elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/panel/usePanel.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/select-tile/useSelectTile.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/select-tile/useSelectTile.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/table/useTable.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }) · packages/ui/src/molecules/table/useTable.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/tabs/useTabs.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'full' }) · packages/ui/src/molecules/timeline/useTimeline.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'sm', radius: 'xl' }) · packages/ui/src/molecules/tip-card/useTipCard.ts; see Surface anatomy
    - surfaceVariants({ padding: 'none' }) · packages/ui/src/organisms/live-band/useLiveBand.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/module-rail/useModuleRail.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }) · packages/ui/src/organisms/module-rail/useModuleRail.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'lg' }) · packages/ui/src/organisms/preview-frame/usePreviewFrame.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/sidebar/useSidebar.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/sidebar/useSidebar.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/tab-bar/useTabBar.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
    - surfaceVariants({ tone, elevation: raised ? (elevation ?? 1) : null, padding, radius }) · packages/ui/src/primitives/surface/useSurface.ts; see Surface anatomy
### Stack / Cluster
catalog[] · docs/catalog.json · @egdev/ui · primitive · Slot
- Cluster (components[] · packages/ui/src/primitives/stack/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - alignItems: enum; Cross-axis alignment within each wrapping row. (components[] · packages/ui/src/primitives/stack/types.ts)
  - asChild: boolean; Merge the layout onto one child element through Slot instead of rendering a div. (components[] · packages/ui/src/primitives/stack/types.ts)
  - gap: enum; Token-key gap between children on both axes. (components[] · packages/ui/src/primitives/stack/types.ts)
  - justifyContent: enum; Main-axis distribution when free space is available. (components[] · packages/ui/src/primitives/stack/types.ts)
- Stack (components[] · packages/ui/src/primitives/stack/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - alignItems: enum; Cross-axis alignment across the vertical stack. (components[] · packages/ui/src/primitives/stack/types.ts)
  - asChild: boolean; Merge the layout onto one child element through Slot instead of rendering a div. (components[] · packages/ui/src/primitives/stack/types.ts)
  - gap: enum; Token-key gap between children on both axes. (components[] · packages/ui/src/primitives/stack/types.ts)
  - justifyContent: enum; Main-axis distribution when free space is available. (components[] · packages/ui/src/primitives/stack/types.ts)
### Surface
catalog[] · docs/catalog.json · @egdev/ui · primitive · Slot
- Surface (components[] · packages/ui/src/primitives/surface/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - surfaceVariants tone=surface-1: `bg-surface-1 ${sheen}` → unresolved
    - surfaceVariants tone=surface-2: `bg-surface-2 ${sheen}` → unresolved
    - surfaceVariants tone=surface-3: `bg-surface-3 ${sheen}` → unresolved
    - surfaceVariants tone=well: shadow-[var(--shadow-well)] → --shadow-well
    - surfaceVariants tone=overlay: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - surfaceVariants padding=none: p-0 → --spacing-0
    - surfaceVariants padding=sm: p-3 → --spacing-3
    - surfaceVariants padding=md: p-6 → --spacing-6
    - surfaceVariants padding=lg: p-8 → --spacing-8
    - surfaceVariants radius=none: rounded-none → --radius-none
    - surfaceVariants radius=md: rounded-md → --radius-md
    - surfaceVariants radius=lg: rounded-lg → --radius-lg
    - surfaceVariants radius=xl: rounded-xl → --radius-xl
    - surfaceVariants radius=full: rounded-full → --radius-full
    - surfaceVariants {"tone":"raisedTones","elevation":"0"}: shadow-edge → --shadow-edge
    - surfaceVariants {"tone":"raisedTones","elevation":"1"}: shadow-[var(--shadow-edge),var(--shadow-elev-1)] → --shadow-edge, --shadow-elev-1
    - surfaceVariants {"tone":"raisedTones","elevation":"2"}: shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - surfaceVariants {"tone":"raisedTones","elevation":"3"}: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - surfaceVariants {"tone":"surface-0","elevation":"[1, 2, 3]"}: sheen → unresolved
    - surfaceVariants({ tone, elevation: raised ? (elevation ?? 1) : null, padding, radius }) · packages/ui/src/primitives/surface/useSurface.ts; see Surface anatomy
  - asChild: boolean; Merge the material onto one HTMLElement-backed child through Slot instead of a div. (components[] · packages/ui/src/primitives/surface/types.ts)
  - elevation: enum; Light edge and two-layer shadow of a raised tone; well and overlay reject it. (components[] · packages/ui/src/primitives/surface/types.ts)
  - padding: enum; Inner spacing between the edge and the content. (components[] · packages/ui/src/primitives/surface/types.ts)
  - radius: enum; Corner radius; none serves bands stacked inside a panel. (components[] · packages/ui/src/primitives/surface/types.ts)
  - tone: enum; Material level. Raised tones accept an elevation; well is recessed and overlay floats. (components[] · packages/ui/src/primitives/surface/types.ts)
### Text / Heading
catalog[] · docs/catalog.json · @egdev/ui · primitive · Slot
- Heading (components[] · packages/ui/src/primitives/text/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - headingVariants base: font-display → --font-display
    - textVariants base: font-display → --font-display
  - accent: string; One optional trailing highlighted run of the phrase. Empty or whitespace-only text renders no accent; non-empty text is preserved exactly. No separator is inserted: supply whitespace in children. (components[] · packages/ui/src/primitives/text/types.ts)
  - accentBreak: boolean; Whether the accent starts on its own line (block) or continues inline. No effect without an accent. (components[] · packages/ui/src/primitives/text/types.ts)
  - children: ReactNode; Heading text; its full visible copy, including the accent, is the accessible name. (components[] · packages/ui/src/primitives/text/types.ts)
  - level: enum; Native heading rank for the document outline; does not change the typography. (components[] · packages/ui/src/primitives/text/types.ts)
  - tone: enum; Accent Material context: canvas (surface-0) neon or raised brand on surface-1…3 and overlays. Consumers choose it; the host background is never inspected. The canvas hero accent glows. Not available on inverse: root and accent always use the on-flood foreground. (components[] · packages/ui/src/primitives/text/types.ts)
  - variant: enum; Named visual recipe, independent of the heading level. (components[] · packages/ui/src/primitives/text/types.ts)
- Text (components[] · packages/ui/src/primitives/text/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - headingVariants base: font-display → --font-display
    - textVariants base: font-display → --font-display
  - accent: string; Not available on the eyebrow: it is one short phrase with a fixed decorative diamond. One optional trailing highlighted run of the phrase. Empty or whitespace-only text renders no accent; non-empty text is preserved exactly. No separator is inserted: supply whitespace in children. (components[] · packages/ui/src/primitives/text/types.ts)
  - accentBreak: boolean; Not available on the eyebrow. Whether the accent starts on its own line (block) or continues inline. No effect without an accent. (components[] · packages/ui/src/primitives/text/types.ts)
  - asChild: boolean; Render onto one non-heading child element through Slot instead of a paragraph. (components[] · packages/ui/src/primitives/text/types.ts)
  - children: ReactNode; Main copy. With asChild, exactly one prop-spreading non-heading element with normal children. (components[] · packages/ui/src/primitives/text/types.ts)
  - tone: enum; Accent Material context. Not available on the eyebrow, whose diamond is decorative. Accent Material context: canvas (surface-0) neon or raised brand on surface-1…3 and overlays. Consumers choose it; the host background is never inspected. The canvas hero accent glows. Not available on inverse: root and accent always use the on-flood foreground. (components[] · packages/ui/src/primitives/text/types.ts)
  - variant: enum; Named visual recipe. Text excludes headings: use Heading for document hierarchy. (components[] · packages/ui/src/primitives/text/types.ts)
### VisuallyHidden
catalog[] · docs/catalog.json · @egdev/ui · primitive · VisuallyHidden
- VisuallyHidden (components[] · packages/ui/src/primitives/visually-hidden/types.ts)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
  - asChild: boolean; Apply hiding geometry to one non-focusable HTML child instead of a span. A custom child must forward props and its ref to one HTML host. (components[] · packages/ui/src/primitives/visually-hidden/types.ts)
  - children: ReactNode; Content read by assistive technology. With asChild, supply one non-focusable HTML element or a component forwarding props/ref to that host; no SVG or Fragment. No focusable descendants, skip links, or automatic live announcements. (components[] · packages/ui/src/primitives/visually-hidden/types.ts)
### AlertDialogAction
- AlertDialogAction (components[] · packages/ui/src/molecules/alert-dialog/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - alertDialogHeadVariants base: gap-[var(--space-2)] → --space-2
    - alertDialogHeadVariants base: px-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pt-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pb-[var(--space-4)] → --space-4
    - alertDialogIconVariants base: text-[var(--color-status-danger)] → --color-status-danger
    - alertDialogTitleRowVariants base: gap-[var(--space-3)] → --space-3
### AlertDialogCancel
- AlertDialogCancel (components[] · packages/ui/src/molecules/alert-dialog/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - alertDialogHeadVariants base: gap-[var(--space-2)] → --space-2
    - alertDialogHeadVariants base: px-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pt-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pb-[var(--space-4)] → --space-4
    - alertDialogIconVariants base: text-[var(--color-status-danger)] → --color-status-danger
    - alertDialogTitleRowVariants base: gap-[var(--space-3)] → --space-3
### AlertDialogContent
- AlertDialogContent (components[] · packages/ui/src/molecules/alert-dialog/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - alertDialogHeadVariants base: gap-[var(--space-2)] → --space-2
    - alertDialogHeadVariants base: px-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pt-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pb-[var(--space-4)] → --space-4
    - alertDialogIconVariants base: text-[var(--color-status-danger)] → --color-status-danger
    - alertDialogTitleRowVariants base: gap-[var(--space-3)] → --space-3
### AlertDialogTrigger
- AlertDialogTrigger (components[] · packages/ui/src/molecules/alert-dialog/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - alertDialogHeadVariants base: gap-[var(--space-2)] → --space-2
    - alertDialogHeadVariants base: px-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pt-[var(--space-6)] → --space-6
    - alertDialogHeadVariants base: pb-[var(--space-4)] → --space-4
    - alertDialogIconVariants base: text-[var(--color-status-danger)] → --color-status-danger
    - alertDialogTitleRowVariants base: gap-[var(--space-3)] → --space-3
### ArticleFeatureCover
- ArticleFeatureCover (components[] · packages/ui/src/molecules/article-feature/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - articleFeatureActionVariants base: gap-1.5 → --spacing
    - articleFeatureActionVariants base: text-label-default → --text-label-default
    - articleFeatureDescriptionVariants base: text-body-default → --text-body-default
    - articleFeatureMetaVariants base: gap-2 → --spacing-2
    - articleFeatureMetaVariants base: font-display → --font-display
    - articleFeatureMetaVariants base: text-meta → --text-meta
    - articleFeatureTitleVariants base: text-heading-small → --text-heading-small
    - articleFeatureVariants base: gap-4 → --spacing-4
    - articleFeatureVariants base: focus-visible:shadow-focus → --shadow-focus
    - articleFeatureWordVariants base: px-4 → --spacing-4
    - articleFeatureWordVariants base: text-title-display → --text-title-display
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/article-feature/useArticleFeature.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }) · packages/ui/src/molecules/article-feature/useArticleFeature.ts; see Surface anatomy
### BlogGridArchive
- BlogGridArchive (components[] · packages/ui/src/organisms/blog-grid/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - blogGridRowsVariants base: gap-3 → --spacing-3
    - blogGridRowsVariants base: p-0 → --spacing-0
    - blogGridVariants base: gap-x-5 → --spacing-5
    - blogGridVariants base: gap-y-0 → --spacing-0
    - blogGridVariants base: [@media(width<=1080px)]:gap-y-5 → --spacing-5
### BlogGridFeature
- BlogGridFeature (components[] · packages/ui/src/organisms/blog-grid/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - blogGridRowsVariants base: gap-3 → --spacing-3
    - blogGridRowsVariants base: p-0 → --spacing-0
    - blogGridVariants base: gap-x-5 → --spacing-5
    - blogGridVariants base: gap-y-0 → --spacing-0
    - blogGridVariants base: [@media(width<=1080px)]:gap-y-5 → --spacing-5
### BlogGridRow
- BlogGridRow (components[] · packages/ui/src/organisms/blog-grid/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - blogGridRowsVariants base: gap-3 → --spacing-3
    - blogGridRowsVariants base: p-0 → --spacing-0
    - blogGridVariants base: gap-x-5 → --spacing-5
    - blogGridVariants base: gap-y-0 → --spacing-0
    - blogGridVariants base: [@media(width<=1080px)]:gap-y-5 → --spacing-5
### BlogGridRows
- BlogGridRows (components[] · packages/ui/src/organisms/blog-grid/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - blogGridRowsVariants base: gap-3 → --spacing-3
    - blogGridRowsVariants base: p-0 → --spacing-0
    - blogGridVariants base: gap-x-5 → --spacing-5
    - blogGridVariants base: gap-y-0 → --spacing-0
    - blogGridVariants base: [@media(width<=1080px)]:gap-y-5 → --spacing-5
### CollapsibleContent
- CollapsibleContent (components[] · packages/ui/src/molecules/collapsible/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - collapsibleContentVariants base: p-4 → --spacing-4
    - collapsibleContentVariants base: font-sans → --font-sans
    - collapsibleContentVariants base: text-body-default → --text-body-default
    - collapsibleTriggerVariants base: text-start → unresolved
    - collapsibleTriggerVariants base: data-[state=open]:rounded-b-none → --radius-none
### CollapsibleTrigger
- CollapsibleTrigger (components[] · packages/ui/src/molecules/collapsible/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - collapsibleContentVariants base: p-4 → --spacing-4
    - collapsibleContentVariants base: font-sans → --font-sans
    - collapsibleContentVariants base: text-body-default → --text-body-default
    - collapsibleTriggerVariants base: text-start → unresolved
    - collapsibleTriggerVariants base: data-[state=open]:rounded-b-none → --radius-none
### CommunityCardAction
- CommunityCardAction (components[] · packages/ui/src/molecules/community-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - communityCardBandVariants base: rounded-t-xl → --radius-xl
    - communityCardBodyVariants base: gap-4 → --spacing-4
    - communityCardBodyVariants base: p-6 → --spacing-6
    - communityCardBodyVariants base: text-body-default → --text-body-default
    - communityCardBodyVariants base: min-[48rem]:p-8 → --spacing-8
    - communityCardEyebrowVariants base: gap-2.5 → --spacing
    - communityCardEyebrowVariants base: font-display → --font-display
    - communityCardEyebrowVariants base: text-body-default → --text-body-default
    - communityCardEyebrowVariants base: font-(weight:--text-label-eyebrow--font-weight) → --text-label-eyebrow--font-weight
    - communityCardTitleVariants base: font-display → --font-display
    - communityCardTitleVariants base: text-title-section → --text-title-section
    - communityCardTopRowVariants base: gap-3 → --spacing-3
    - communityCardTopRowVariants base: px-6 → --spacing-6
    - communityCardTopRowVariants base: py-4 → --spacing-4
    - communityCardTopRowVariants base: min-[48rem]:px-8 → --spacing-8
    - communityCardTopRowVariants base: min-[48rem]:py-5 → --spacing-5
    - communityCardVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
### CommunityCardMark
- CommunityCardMark (components[] · packages/ui/src/molecules/community-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - communityCardBandVariants base: rounded-t-xl → --radius-xl
    - communityCardBodyVariants base: gap-4 → --spacing-4
    - communityCardBodyVariants base: p-6 → --spacing-6
    - communityCardBodyVariants base: text-body-default → --text-body-default
    - communityCardBodyVariants base: min-[48rem]:p-8 → --spacing-8
    - communityCardEyebrowVariants base: gap-2.5 → --spacing
    - communityCardEyebrowVariants base: font-display → --font-display
    - communityCardEyebrowVariants base: text-body-default → --text-body-default
    - communityCardEyebrowVariants base: font-(weight:--text-label-eyebrow--font-weight) → --text-label-eyebrow--font-weight
    - communityCardTitleVariants base: font-display → --font-display
    - communityCardTitleVariants base: text-title-section → --text-title-section
    - communityCardTopRowVariants base: gap-3 → --spacing-3
    - communityCardTopRowVariants base: px-6 → --spacing-6
    - communityCardTopRowVariants base: py-4 → --spacing-4
    - communityCardTopRowVariants base: min-[48rem]:px-8 → --spacing-8
    - communityCardTopRowVariants base: min-[48rem]:py-5 → --spacing-5
    - communityCardVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
### DialogClose
- DialogClose (components[] · packages/ui/src/molecules/dialog/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - dialogBodyVariants base: p-[var(--space-6)] → --space-6
    - dialogDescriptionVariants base: text-body-default → --text-body-default
    - dialogFootVariants base: px-[var(--space-6)] → --space-6
    - dialogFootVariants base: py-[var(--space-4)] → --space-4
    - dialogFootVariants base: gap-[var(--space-3)] → --space-3
    - dialogHeadVariants base: py-[var(--space-4)] → --space-4
    - dialogHeadVariants base: ps-[var(--space-6)] → --space-6
    - dialogHeadVariants base: pe-[calc(var(--space-4)+var(--space-12))] → --space-4, --space-12
    - dialogOverlayVariants base: p-[var(--space-6)] → --space-6
    - dialogOverlayVariants flush=true: p-0 → --spacing-0
    - dialogStatusVariants base: text-label-default → --text-label-default
    - dialogTitleVariants base: font-display → --font-display
    - dialogTitleVariants base: text-heading-small → --text-heading-small
### DialogContent
- DialogContent (components[] · packages/ui/src/molecules/dialog/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - dialogBodyVariants base: p-[var(--space-6)] → --space-6
    - dialogDescriptionVariants base: text-body-default → --text-body-default
    - dialogFootVariants base: px-[var(--space-6)] → --space-6
    - dialogFootVariants base: py-[var(--space-4)] → --space-4
    - dialogFootVariants base: gap-[var(--space-3)] → --space-3
    - dialogHeadVariants base: py-[var(--space-4)] → --space-4
    - dialogHeadVariants base: ps-[var(--space-6)] → --space-6
    - dialogHeadVariants base: pe-[calc(var(--space-4)+var(--space-12))] → --space-4, --space-12
    - dialogOverlayVariants base: p-[var(--space-6)] → --space-6
    - dialogOverlayVariants flush=true: p-0 → --spacing-0
    - dialogStatusVariants base: text-label-default → --text-label-default
    - dialogTitleVariants base: font-display → --font-display
    - dialogTitleVariants base: text-heading-small → --text-heading-small
### DialogTrigger
- DialogTrigger (components[] · packages/ui/src/molecules/dialog/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - dialogBodyVariants base: p-[var(--space-6)] → --space-6
    - dialogDescriptionVariants base: text-body-default → --text-body-default
    - dialogFootVariants base: px-[var(--space-6)] → --space-6
    - dialogFootVariants base: py-[var(--space-4)] → --space-4
    - dialogFootVariants base: gap-[var(--space-3)] → --space-3
    - dialogHeadVariants base: py-[var(--space-4)] → --space-4
    - dialogHeadVariants base: ps-[var(--space-6)] → --space-6
    - dialogHeadVariants base: pe-[calc(var(--space-4)+var(--space-12))] → --space-4, --space-12
    - dialogOverlayVariants base: p-[var(--space-6)] → --space-6
    - dialogOverlayVariants flush=true: p-0 → --spacing-0
    - dialogStatusVariants base: text-label-default → --text-label-default
    - dialogTitleVariants base: font-display → --font-display
    - dialogTitleVariants base: text-heading-small → --text-heading-small
### FooterBrand
- FooterBrand (components[] · packages/ui/src/organisms/footer/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - footerGridVariants base: gap-x-10 → --spacing-10
    - footerGridVariants base: gap-y-8 → --spacing-8
    - footerGridVariants base: pt-10 → --spacing-10
    - footerHeadingVariants base: font-display → --font-display
    - footerHeadingVariants base: text-label-eyebrow → --text-label-eyebrow
    - footerLegalVariants base: gap-4 → --spacing-4
    - footerLegalVariants base: pt-4 → --spacing-4
    - footerLegalVariants base: text-body-default → --text-body-default
    - footerListVariants base: p-0 → --spacing-0
    - footerMottoVariants base: px-0 → --spacing-0
    - footerMottoVariants base: pt-10 → --spacing-10
    - footerMottoVariants base: pb-8 → --spacing-8
    - footerVariants base: p-0 → --spacing-0
    - footerVariants base: pb-8 → --spacing-8
    - footerVariants base: font-sans → --font-sans
### FooterLegal
- FooterLegal (components[] · packages/ui/src/organisms/footer/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - footerGridVariants base: gap-x-10 → --spacing-10
    - footerGridVariants base: gap-y-8 → --spacing-8
    - footerGridVariants base: pt-10 → --spacing-10
    - footerHeadingVariants base: font-display → --font-display
    - footerHeadingVariants base: text-label-eyebrow → --text-label-eyebrow
    - footerLegalVariants base: gap-4 → --spacing-4
    - footerLegalVariants base: pt-4 → --spacing-4
    - footerLegalVariants base: text-body-default → --text-body-default
    - footerListVariants base: p-0 → --spacing-0
    - footerMottoVariants base: px-0 → --spacing-0
    - footerMottoVariants base: pt-10 → --spacing-10
    - footerMottoVariants base: pb-8 → --spacing-8
    - footerVariants base: p-0 → --spacing-0
    - footerVariants base: pb-8 → --spacing-8
    - footerVariants base: font-sans → --font-sans
### FooterMotto
- FooterMotto (components[] · packages/ui/src/organisms/footer/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - footerGridVariants base: gap-x-10 → --spacing-10
    - footerGridVariants base: gap-y-8 → --spacing-8
    - footerGridVariants base: pt-10 → --spacing-10
    - footerHeadingVariants base: font-display → --font-display
    - footerHeadingVariants base: text-label-eyebrow → --text-label-eyebrow
    - footerLegalVariants base: gap-4 → --spacing-4
    - footerLegalVariants base: pt-4 → --spacing-4
    - footerLegalVariants base: text-body-default → --text-body-default
    - footerListVariants base: p-0 → --spacing-0
    - footerMottoVariants base: px-0 → --spacing-0
    - footerMottoVariants base: pt-10 → --spacing-10
    - footerMottoVariants base: pb-8 → --spacing-8
    - footerVariants base: p-0 → --spacing-0
    - footerVariants base: pb-8 → --spacing-8
    - footerVariants base: font-sans → --font-sans
### FooterNavigation
- FooterNavigation (components[] · packages/ui/src/organisms/footer/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - footerGridVariants base: gap-x-10 → --spacing-10
    - footerGridVariants base: gap-y-8 → --spacing-8
    - footerGridVariants base: pt-10 → --spacing-10
    - footerHeadingVariants base: font-display → --font-display
    - footerHeadingVariants base: text-label-eyebrow → --text-label-eyebrow
    - footerLegalVariants base: gap-4 → --spacing-4
    - footerLegalVariants base: pt-4 → --spacing-4
    - footerLegalVariants base: text-body-default → --text-body-default
    - footerListVariants base: p-0 → --spacing-0
    - footerMottoVariants base: px-0 → --spacing-0
    - footerMottoVariants base: pt-10 → --spacing-10
    - footerMottoVariants base: pb-8 → --spacing-8
    - footerVariants base: p-0 → --spacing-0
    - footerVariants base: pb-8 → --spacing-8
    - footerVariants base: font-sans → --font-sans
### FooterSocial
- FooterSocial (components[] · packages/ui/src/organisms/footer/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - footerGridVariants base: gap-x-10 → --spacing-10
    - footerGridVariants base: gap-y-8 → --spacing-8
    - footerGridVariants base: pt-10 → --spacing-10
    - footerHeadingVariants base: font-display → --font-display
    - footerHeadingVariants base: text-label-eyebrow → --text-label-eyebrow
    - footerLegalVariants base: gap-4 → --spacing-4
    - footerLegalVariants base: pt-4 → --spacing-4
    - footerLegalVariants base: text-body-default → --text-body-default
    - footerListVariants base: p-0 → --spacing-0
    - footerMottoVariants base: px-0 → --spacing-0
    - footerMottoVariants base: pt-10 → --spacing-10
    - footerMottoVariants base: pb-8 → --spacing-8
    - footerVariants base: p-0 → --spacing-0
    - footerVariants base: pb-8 → --spacing-8
    - footerVariants base: font-sans → --font-sans
### HomeTemplateAnchor
- HomeTemplateAnchor (components[] · packages/effects/src/home-template/types.ts · @egdev/effects)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
### ListItemActions
- ListItemActions (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### ListItemBody
- ListItemBody (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### ListItemContent
- ListItemContent (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### ListItemFooter
- ListItemFooter (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### ListItemLeading
- ListItemLeading (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### ListItemMedia
- ListItemMedia (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### ListItemMeta
- ListItemMeta (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### ListItemTitle
- ListItemTitle (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### ListItemTrailing
- ListItemTrailing (components[] · packages/ui/src/molecules/list-item/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - listItemPartVariants part=body: gap-3 → --spacing-3
    - listItemPartVariants part=body: group-data-[variant=editorial]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=body: group-data-[variant=editorial-divided]/list-item:gap-2 → --spacing-2
    - listItemPartVariants part=leading: [&_time]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time]:text-display-stat → --text-display-stat
    - listItemPartVariants part=leading: group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=leading: [&_time>small]:font-display → --font-display
    - listItemPartVariants part=leading: [&_time>small]:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=title: font-sans → --font-sans
    - listItemPartVariants part=title: text-body-large → --text-body-large
    - listItemPartVariants part=title: group-data-[size=sm]/list-item:text-body-default → --text-body-default
    - listItemPartVariants part=trailing: gap-2 → --spacing-2
    - listItemPartVariants part=trailing: font-display → --font-display
    - listItemPartVariants part=trailing: text-display-stat-sm → --text-display-stat-sm
    - listItemPartVariants part=content: font-sans → --font-sans
    - listItemPartVariants part=content: text-body-default → --text-body-default
    - listItemPartVariants part=content: group-data-[variant=compact]/list-item:text-label-default → --text-label-default
    - listItemPartVariants part=footer: pt-3 → --spacing-3
    - listItemPartVariants part=footer: gap-2 → --spacing-2
    - listItemPartVariants part=meta: gap-2 → --spacing-2
    - listItemPartVariants part=meta: font-sans → --font-sans
    - listItemPartVariants part=meta: text-label-default → --text-label-default
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:font-display → --font-display
    - listItemPartVariants part=meta: group-data-[variant=editorial-divided]/list-item:text-label-eyebrow → --text-label-eyebrow
    - listItemPartVariants part=actions: gap-1 → --spacing-1
    - listItemVariants base: gap-3 → --spacing-3
    - listItemVariants base: p-4 → --spacing-4
    - listItemVariants base: rounded-lg → --radius-lg
    - listItemVariants base: font-sans → --font-sans
    - listItemVariants base: data-[variant=compact]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=compact]:gap-2 → --spacing-2
    - listItemVariants base: data-[variant=compact]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=row]:p-3 → --spacing-3
    - listItemVariants base: data-[variant=row]:rounded-md → --radius-md
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:shadow-none → unresolved
    - listItemVariants base: data-[variant=editorial-divided]:data-[state=default]:rounded-none → --radius-none
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:ps-[calc(var(--space-4)+var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:pe-[calc(var(--space-4)-var(--space-2))] → --space-4, --space-2
    - listItemVariants base: data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[variant=editorial-divided]:[&:is(a)]:focus-visible:shadow-focus → --shadow-focus
    - listItemVariants base: data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - listItemVariants base: data-[state=done]:shadow-none → unresolved
    - listItemVariants base: data-[state=off]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:shadow-none → unresolved
    - listItemVariants base: data-[state=empty]:text-label-default → --text-label-default
    - listItemVariants base: data-[state=empty]:focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
### LiveBandField
- LiveBandField (components[] · packages/ui/src/organisms/live-band/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - liveBandFieldVariants base: gap-10 → --spacing-10
    - liveBandRowsVariants base: p-0 → --spacing-0
    - liveBandStreamsVariants base: gap-7 → --spacing-7
    - liveBandVodVariants base: focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ padding: 'none' }) · packages/ui/src/organisms/live-band/useLiveBand.ts; see Surface anatomy
### LiveBandList
- LiveBandList (components[] · packages/ui/src/organisms/live-band/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - liveBandFieldVariants base: gap-10 → --spacing-10
    - liveBandRowsVariants base: p-0 → --spacing-0
    - liveBandStreamsVariants base: gap-7 → --spacing-7
    - liveBandVodVariants base: focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ padding: 'none' }) · packages/ui/src/organisms/live-band/useLiveBand.ts; see Surface anatomy
### LiveBandRow
- LiveBandRow (components[] · packages/ui/src/organisms/live-band/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - liveBandFieldVariants base: gap-10 → --spacing-10
    - liveBandRowsVariants base: p-0 → --spacing-0
    - liveBandStreamsVariants base: gap-7 → --spacing-7
    - liveBandVodVariants base: focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ padding: 'none' }) · packages/ui/src/organisms/live-band/useLiveBand.ts; see Surface anatomy
### LiveBandRows
- LiveBandRows (components[] · packages/ui/src/organisms/live-band/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - liveBandFieldVariants base: gap-10 → --spacing-10
    - liveBandRowsVariants base: p-0 → --spacing-0
    - liveBandStreamsVariants base: gap-7 → --spacing-7
    - liveBandVodVariants base: focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ padding: 'none' }) · packages/ui/src/organisms/live-band/useLiveBand.ts; see Surface anatomy
### LiveBandStreams
- LiveBandStreams (components[] · packages/ui/src/organisms/live-band/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - liveBandFieldVariants base: gap-10 → --spacing-10
    - liveBandRowsVariants base: p-0 → --spacing-0
    - liveBandStreamsVariants base: gap-7 → --spacing-7
    - liveBandVodVariants base: focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ padding: 'none' }) · packages/ui/src/organisms/live-band/useLiveBand.ts; see Surface anatomy
### LiveBandVod
- LiveBandVod (components[] · packages/ui/src/organisms/live-band/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - liveBandFieldVariants base: gap-10 → --spacing-10
    - liveBandRowsVariants base: p-0 → --spacing-0
    - liveBandStreamsVariants base: gap-7 → --spacing-7
    - liveBandVodVariants base: focus-visible:shadow-focus → --shadow-focus
    - surfaceVariants({ padding: 'none' }) · packages/ui/src/organisms/live-band/useLiveBand.ts; see Surface anatomy
### NotesBoardList
- NotesBoardList (components[] · packages/ui/src/organisms/notes-board/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - notesBoardListVariants base: p-0 → --spacing-0
    - notesBoardListVariants base: gap-2 → --spacing-2
    - notesBoardSideVariants base: gap-4 → --spacing-4
    - notesBoardVariants base: gap-10 → --spacing-10
    - notesBoardVariants base: [@media(width<=1080px)]:gap-8 → --spacing-8
### NotesBoardSide
- NotesBoardSide (components[] · packages/ui/src/organisms/notes-board/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - notesBoardListVariants base: p-0 → --spacing-0
    - notesBoardListVariants base: gap-2 → --spacing-2
    - notesBoardSideVariants base: gap-4 → --spacing-4
    - notesBoardVariants base: gap-10 → --spacing-10
    - notesBoardVariants base: [@media(width<=1080px)]:gap-8 → --spacing-8
### NowCardBody
- NowCardBody (components[] · packages/ui/src/molecules/now-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - nowCardBadgeVariants base: px-6 → --spacing-6
    - nowCardBadgeVariants base: pt-6 → --spacing-6
    - nowCardBadgeVariants base: pb-3 → --spacing-3
    - nowCardBodyVariants base: gap-2 → --spacing-2
    - nowCardBodyVariants base: p-6 → --spacing-6
    - nowCardBodyVariants base: text-body-large → --text-body-large
    - nowCardBodyVariants size=sm: p-4 → --spacing-4
    - nowCardBodyVariants size=sm: text-body-default → --text-body-default
    - nowCardDetailValueVariants base: [&_b]:font-(weight:--text-title-section--font-weight) → --text-title-section--font-weight
    - nowCardDetailVariants base: font-display → --font-display
    - nowCardDetailVariants base: text-meta → --text-meta
    - nowCardFootVariants base: gap-2 → --spacing-2
    - nowCardFootVariants base: shadow-none → unresolved
    - nowCardFootVariants base: rounded-b-xl → --radius-xl
    - nowCardFootVariants base: px-6 → --spacing-6
    - nowCardFootVariants base: py-3 → --spacing-3
    - nowCardFootVariants size=sm: px-5 → --spacing-5
    - nowCardFootVariants size=sm: py-2 → --spacing-2
    - nowCardHeadingVariants base: px-6 → --spacing-6
    - nowCardHeadingVariants base: text-heading-small → --text-heading-small
    - nowCardHeadingVariants size=sm: px-4 → --spacing-4
    - nowCardHeadingVariants size=sm: text-body-large → --text-body-large
    - nowCardHeadingVariants badge=true: pt-0 → --spacing-0
    - nowCardHeadingVariants badge=false: pt-6 → --spacing-6
    - nowCardVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
### NowCardDetail
- NowCardDetail (components[] · packages/ui/src/molecules/now-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - nowCardBadgeVariants base: px-6 → --spacing-6
    - nowCardBadgeVariants base: pt-6 → --spacing-6
    - nowCardBadgeVariants base: pb-3 → --spacing-3
    - nowCardBodyVariants base: gap-2 → --spacing-2
    - nowCardBodyVariants base: p-6 → --spacing-6
    - nowCardBodyVariants base: text-body-large → --text-body-large
    - nowCardBodyVariants size=sm: p-4 → --spacing-4
    - nowCardBodyVariants size=sm: text-body-default → --text-body-default
    - nowCardDetailValueVariants base: [&_b]:font-(weight:--text-title-section--font-weight) → --text-title-section--font-weight
    - nowCardDetailVariants base: font-display → --font-display
    - nowCardDetailVariants base: text-meta → --text-meta
    - nowCardFootVariants base: gap-2 → --spacing-2
    - nowCardFootVariants base: shadow-none → unresolved
    - nowCardFootVariants base: rounded-b-xl → --radius-xl
    - nowCardFootVariants base: px-6 → --spacing-6
    - nowCardFootVariants base: py-3 → --spacing-3
    - nowCardFootVariants size=sm: px-5 → --spacing-5
    - nowCardFootVariants size=sm: py-2 → --spacing-2
    - nowCardHeadingVariants base: px-6 → --spacing-6
    - nowCardHeadingVariants base: text-heading-small → --text-heading-small
    - nowCardHeadingVariants size=sm: px-4 → --spacing-4
    - nowCardHeadingVariants size=sm: text-body-large → --text-body-large
    - nowCardHeadingVariants badge=true: pt-0 → --spacing-0
    - nowCardHeadingVariants badge=false: pt-6 → --spacing-6
    - nowCardVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
### NowCardFooter
- NowCardFooter (components[] · packages/ui/src/molecules/now-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - nowCardBadgeVariants base: px-6 → --spacing-6
    - nowCardBadgeVariants base: pt-6 → --spacing-6
    - nowCardBadgeVariants base: pb-3 → --spacing-3
    - nowCardBodyVariants base: gap-2 → --spacing-2
    - nowCardBodyVariants base: p-6 → --spacing-6
    - nowCardBodyVariants base: text-body-large → --text-body-large
    - nowCardBodyVariants size=sm: p-4 → --spacing-4
    - nowCardBodyVariants size=sm: text-body-default → --text-body-default
    - nowCardDetailValueVariants base: [&_b]:font-(weight:--text-title-section--font-weight) → --text-title-section--font-weight
    - nowCardDetailVariants base: font-display → --font-display
    - nowCardDetailVariants base: text-meta → --text-meta
    - nowCardFootVariants base: gap-2 → --spacing-2
    - nowCardFootVariants base: shadow-none → unresolved
    - nowCardFootVariants base: rounded-b-xl → --radius-xl
    - nowCardFootVariants base: px-6 → --spacing-6
    - nowCardFootVariants base: py-3 → --spacing-3
    - nowCardFootVariants size=sm: px-5 → --spacing-5
    - nowCardFootVariants size=sm: py-2 → --spacing-2
    - nowCardHeadingVariants base: px-6 → --spacing-6
    - nowCardHeadingVariants base: text-heading-small → --text-heading-small
    - nowCardHeadingVariants size=sm: px-4 → --spacing-4
    - nowCardHeadingVariants size=sm: text-body-large → --text-body-large
    - nowCardHeadingVariants badge=true: pt-0 → --spacing-0
    - nowCardHeadingVariants badge=false: pt-6 → --spacing-6
    - nowCardVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
### PanelBody
- PanelBody (components[] · packages/ui/src/molecules/panel/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - panelBodyVariants base: gap-4 → --spacing-4
    - panelBodyVariants base: zoneGeometry → unresolved
    - panelFooterVariants base: gap-3 → --spacing-3
    - panelFooterVariants base: zoneGeometry → unresolved
    - panelFooterVariants variant=banded: shadow-none → unresolved
    - panelHeaderVariants base: gap-3 → --spacing-3
    - panelHeaderVariants base: zoneGeometry → unresolved
    - panelVariants base: gap-0 → --spacing-0
    - panelVariants base: p-0 → --spacing-0
    - panelVariants base: font-sans → --font-sans
    - panelVariants base: text-body-default → --text-body-default
    - panelVariants tone=inherit: shadow-none → unresolved
    - surfaceVariants({ tone: bandTone, elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/panel/usePanel.ts; see Surface anatomy
### PanelFooter
- PanelFooter (components[] · packages/ui/src/molecules/panel/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - panelBodyVariants base: gap-4 → --spacing-4
    - panelBodyVariants base: zoneGeometry → unresolved
    - panelFooterVariants base: gap-3 → --spacing-3
    - panelFooterVariants base: zoneGeometry → unresolved
    - panelFooterVariants variant=banded: shadow-none → unresolved
    - panelHeaderVariants base: gap-3 → --spacing-3
    - panelHeaderVariants base: zoneGeometry → unresolved
    - panelVariants base: gap-0 → --spacing-0
    - panelVariants base: p-0 → --spacing-0
    - panelVariants base: font-sans → --font-sans
    - panelVariants base: text-body-default → --text-body-default
    - panelVariants tone=inherit: shadow-none → unresolved
    - surfaceVariants({ tone: bandTone, elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/panel/usePanel.ts; see Surface anatomy
### PanelHeader
- PanelHeader (components[] · packages/ui/src/molecules/panel/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - panelBodyVariants base: gap-4 → --spacing-4
    - panelBodyVariants base: zoneGeometry → unresolved
    - panelFooterVariants base: gap-3 → --spacing-3
    - panelFooterVariants base: zoneGeometry → unresolved
    - panelFooterVariants variant=banded: shadow-none → unresolved
    - panelHeaderVariants base: gap-3 → --spacing-3
    - panelHeaderVariants base: zoneGeometry → unresolved
    - panelVariants base: gap-0 → --spacing-0
    - panelVariants base: p-0 → --spacing-0
    - panelVariants base: font-sans → --font-sans
    - panelVariants base: text-body-default → --text-body-default
    - panelVariants tone=inherit: shadow-none → unresolved
    - surfaceVariants({ tone: bandTone, elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/panel/usePanel.ts; see Surface anatomy
### PopoverClose
- PopoverClose (components[] · packages/ui/src/molecules/popover/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - popoverButtonVariants base: rounded-md → --radius-md
    - popoverButtonVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - popoverContentVariants base: font-sans → --font-sans
    - popoverContentVariants base: text-body-default → --text-body-default
### PopoverContent
- PopoverContent (components[] · packages/ui/src/molecules/popover/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - popoverButtonVariants base: rounded-md → --radius-md
    - popoverButtonVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - popoverContentVariants base: font-sans → --font-sans
    - popoverContentVariants base: text-body-default → --text-body-default
### PopoverTrigger
- PopoverTrigger (components[] · packages/ui/src/molecules/popover/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - popoverButtonVariants base: rounded-md → --radius-md
    - popoverButtonVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - popoverContentVariants base: font-sans → --font-sans
    - popoverContentVariants base: text-body-default → --text-body-default
### ProjectCardBackdrop
- ProjectCardBackdrop (components[] · packages/ui/src/molecules/project-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - projectCardBodyVariants base: text-body-large → --text-body-large
    - projectCardCodeVariants base: font-mono → --font-mono
    - projectCardCodeVariants base: text-code → --text-code
    - projectCardEyebrowVariants base: text-label-eyebrow → --text-label-eyebrow
    - projectCardFootVariants base: gap-3 → --spacing-3
    - projectCardHeadingVariants size=md: text-heading-small → --text-heading-small
    - projectCardHeadingVariants size=sm: text-body-large → --text-body-large
    - projectCardIndexVariants base: text-transparent → unresolved
    - projectCardIndexVariants size=md: text-title-display → --text-title-display
    - projectCardIndexVariants size=sm: text-title-section → --text-title-section
    - projectCardTagsVariants base: gap-1.5 → --spacing
    - projectCardTagsVariants base: p-0 → --spacing-0
    - projectCardUpperContentVariants base: gap-4 → --spacing-4
    - projectCardUpperVariants base: rounded-xl → --radius-xl
    - projectCardUpperVariants base: gap-4 → --spacing-4
    - projectCardVariants base: gap-4 → --spacing-4
    - projectCardVariants variant=featured: shadow-[var(--shadow-hot)] → --shadow-hot
    - projectCardVariants size=sm: gap-3 → --spacing-3
    - projectCardVariants size=sm: p-3 → --spacing-3
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
### ProjectCardCode
- ProjectCardCode (components[] · packages/ui/src/molecules/project-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - projectCardBodyVariants base: text-body-large → --text-body-large
    - projectCardCodeVariants base: font-mono → --font-mono
    - projectCardCodeVariants base: text-code → --text-code
    - projectCardEyebrowVariants base: text-label-eyebrow → --text-label-eyebrow
    - projectCardFootVariants base: gap-3 → --spacing-3
    - projectCardHeadingVariants size=md: text-heading-small → --text-heading-small
    - projectCardHeadingVariants size=sm: text-body-large → --text-body-large
    - projectCardIndexVariants base: text-transparent → unresolved
    - projectCardIndexVariants size=md: text-title-display → --text-title-display
    - projectCardIndexVariants size=sm: text-title-section → --text-title-section
    - projectCardTagsVariants base: gap-1.5 → --spacing
    - projectCardTagsVariants base: p-0 → --spacing-0
    - projectCardUpperContentVariants base: gap-4 → --spacing-4
    - projectCardUpperVariants base: rounded-xl → --radius-xl
    - projectCardUpperVariants base: gap-4 → --spacing-4
    - projectCardVariants base: gap-4 → --spacing-4
    - projectCardVariants variant=featured: shadow-[var(--shadow-hot)] → --shadow-hot
    - projectCardVariants size=sm: gap-3 → --spacing-3
    - projectCardVariants size=sm: p-3 → --spacing-3
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
### ProjectCardFooter
- ProjectCardFooter (components[] · packages/ui/src/molecules/project-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - projectCardBodyVariants base: text-body-large → --text-body-large
    - projectCardCodeVariants base: font-mono → --font-mono
    - projectCardCodeVariants base: text-code → --text-code
    - projectCardEyebrowVariants base: text-label-eyebrow → --text-label-eyebrow
    - projectCardFootVariants base: gap-3 → --spacing-3
    - projectCardHeadingVariants size=md: text-heading-small → --text-heading-small
    - projectCardHeadingVariants size=sm: text-body-large → --text-body-large
    - projectCardIndexVariants base: text-transparent → unresolved
    - projectCardIndexVariants size=md: text-title-display → --text-title-display
    - projectCardIndexVariants size=sm: text-title-section → --text-title-section
    - projectCardTagsVariants base: gap-1.5 → --spacing
    - projectCardTagsVariants base: p-0 → --spacing-0
    - projectCardUpperContentVariants base: gap-4 → --spacing-4
    - projectCardUpperVariants base: rounded-xl → --radius-xl
    - projectCardUpperVariants base: gap-4 → --spacing-4
    - projectCardVariants base: gap-4 → --spacing-4
    - projectCardVariants variant=featured: shadow-[var(--shadow-hot)] → --shadow-hot
    - projectCardVariants size=sm: gap-3 → --spacing-3
    - projectCardVariants size=sm: p-3 → --spacing-3
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
### ProjectCardMark
- ProjectCardMark (components[] · packages/ui/src/molecules/project-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - projectCardBodyVariants base: text-body-large → --text-body-large
    - projectCardCodeVariants base: font-mono → --font-mono
    - projectCardCodeVariants base: text-code → --text-code
    - projectCardEyebrowVariants base: text-label-eyebrow → --text-label-eyebrow
    - projectCardFootVariants base: gap-3 → --spacing-3
    - projectCardHeadingVariants size=md: text-heading-small → --text-heading-small
    - projectCardHeadingVariants size=sm: text-body-large → --text-body-large
    - projectCardIndexVariants base: text-transparent → unresolved
    - projectCardIndexVariants size=md: text-title-display → --text-title-display
    - projectCardIndexVariants size=sm: text-title-section → --text-title-section
    - projectCardTagsVariants base: gap-1.5 → --spacing
    - projectCardTagsVariants base: p-0 → --spacing-0
    - projectCardUpperContentVariants base: gap-4 → --spacing-4
    - projectCardUpperVariants base: rounded-xl → --radius-xl
    - projectCardUpperVariants base: gap-4 → --spacing-4
    - projectCardVariants base: gap-4 → --spacing-4
    - projectCardVariants variant=featured: shadow-[var(--shadow-hot)] → --shadow-hot
    - projectCardVariants size=sm: gap-3 → --spacing-3
    - projectCardVariants size=sm: p-3 → --spacing-3
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
### ProjectCardTags
- ProjectCardTags (components[] · packages/ui/src/molecules/project-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - projectCardBodyVariants base: text-body-large → --text-body-large
    - projectCardCodeVariants base: font-mono → --font-mono
    - projectCardCodeVariants base: text-code → --text-code
    - projectCardEyebrowVariants base: text-label-eyebrow → --text-label-eyebrow
    - projectCardFootVariants base: gap-3 → --spacing-3
    - projectCardHeadingVariants size=md: text-heading-small → --text-heading-small
    - projectCardHeadingVariants size=sm: text-body-large → --text-body-large
    - projectCardIndexVariants base: text-transparent → unresolved
    - projectCardIndexVariants size=md: text-title-display → --text-title-display
    - projectCardIndexVariants size=sm: text-title-section → --text-title-section
    - projectCardTagsVariants base: gap-1.5 → --spacing
    - projectCardTagsVariants base: p-0 → --spacing-0
    - projectCardUpperContentVariants base: gap-4 → --spacing-4
    - projectCardUpperVariants base: rounded-xl → --radius-xl
    - projectCardUpperVariants base: gap-4 → --spacing-4
    - projectCardVariants base: gap-4 → --spacing-4
    - projectCardVariants variant=featured: shadow-[var(--shadow-hot)] → --shadow-hot
    - projectCardVariants size=sm: gap-3 → --spacing-3
    - projectCardVariants size=sm: p-3 → --spacing-3
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
### Slottable
- Slottable (components[] · packages/ui/src/index.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - surfaceVariants({         tone: variant === 'framed' ? 'surface-0' : 'surface-1',         elevation: variant === 'framed' ? 2 : 1,         padding: 'none',         radius: 'xl'       }) · packages/ui/src/atoms/photo-frame/usePhotoFrame.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/atoms/search-trigger/useSearchTrigger.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/article-feature/useArticleFeature.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }) · packages/ui/src/molecules/article-feature/useArticleFeature.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/community-card/useCommunityCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/list-item/useListItem.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'full' }) · packages/ui/src/molecules/menu/types.ts; see Surface anatomy
    - surfaceVariants({ tone: 'overlay', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/menu/useMenu.ts; see Surface anatomy
    - surfaceVariants({             tone: effectiveTone === 'overlay' ? 'surface-1' : 'surface-0',             elevation: 0,             padding: 'none',             radius: 'none'           }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
    - surfaceVariants({             tone: effectiveTone === 'overlay' ? 'surface-3' : 'surface-2',             elevation: 0,             padding: 'none',             radius: 'none'           }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
    - surfaceVariants({           tone: effectiveTone,           ...(effectiveTone === 'surface-1' ? { elevation: 1 } : {}),           padding: 'none',           radius: 'xl'         }) · packages/ui/src/molecules/module-card/useModuleCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'md' }) · packages/ui/src/molecules/nav-list/useNavList.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/notice/types.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/now-card/useNowCard.ts; see Surface anatomy
    - surfaceVariants({ tone: bandTone, elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/panel/usePanel.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }) · packages/ui/src/molecules/project-card/useProjectCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/select-tile/useSelectTile.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/select-tile/useSelectTile.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/table/useTable.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }) · packages/ui/src/molecules/table/useTable.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/tabs/useTabs.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'full' }) · packages/ui/src/molecules/timeline/useTimeline.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'sm', radius: 'xl' }) · packages/ui/src/molecules/tip-card/useTipCard.ts; see Surface anatomy
    - surfaceVariants({ padding: 'none' }) · packages/ui/src/organisms/live-band/useLiveBand.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/module-rail/useModuleRail.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }) · packages/ui/src/organisms/module-rail/useModuleRail.ts; see Surface anatomy
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'lg' }) · packages/ui/src/organisms/preview-frame/usePreviewFrame.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/sidebar/useSidebar.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/sidebar/useSidebar.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/tab-bar/useTabBar.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
    - surfaceVariants({ tone, elevation: raised ? (elevation ?? 1) : null, padding, radius }) · packages/ui/src/primitives/surface/useSurface.ts; see Surface anatomy
### TerminalCardBar
- TerminalCardBar (components[] · packages/ui/src/molecules/terminal-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - terminalCardBarVariants base: rounded-t-xl → --radius-xl
    - terminalCardBarVariants base: gap-2 → --spacing-2
    - terminalCardBarVariants base: px-4 → --spacing-4
    - terminalCardBarVariants base: py-2.5 → --spacing
    - terminalCardListVariants base: gap-x-4 → --spacing-4
    - terminalCardListVariants base: gap-y-1.5 → --spacing
    - terminalCardListVariants base: px-4 → --spacing-4
    - terminalCardListVariants base: py-3 → --spacing-3
    - terminalCardListVariants base: font-mono → --font-mono
    - terminalCardListVariants base: text-body-default → --text-body-default
    - terminalCardShellVariants base: font-sans → --font-sans
    - terminalCardShellVariants base: text-label-default → --text-label-default
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
### TerminalCardList
- TerminalCardList (components[] · packages/ui/src/molecules/terminal-card/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - terminalCardBarVariants base: rounded-t-xl → --radius-xl
    - terminalCardBarVariants base: gap-2 → --spacing-2
    - terminalCardBarVariants base: px-4 → --spacing-4
    - terminalCardBarVariants base: py-2.5 → --spacing
    - terminalCardListVariants base: gap-x-4 → --spacing-4
    - terminalCardListVariants base: gap-y-1.5 → --spacing
    - terminalCardListVariants base: px-4 → --spacing-4
    - terminalCardListVariants base: py-3 → --spacing-3
    - terminalCardListVariants base: font-mono → --font-mono
    - terminalCardListVariants base: text-body-default → --text-body-default
    - terminalCardShellVariants base: font-sans → --font-sans
    - terminalCardShellVariants base: text-label-default → --text-label-default
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/molecules/terminal-card/useTerminalCard.ts; see Surface anatomy
### ToastProvider
- ToastProvider (components[] · packages/ui/src/molecules/toast/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - toastRootVariants base: pe-2 → --spacing-2
    - toastRootVariants base: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - toastRootVariants danger=true: before:rounded-[inherit] → unresolved
    - toastViewportVariants base: gap-2 → --spacing-2
    - toastViewportVariants base: p-0 → --spacing-0
    - toastViewportVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - toastViewportVariants base: rounded-lg → --radius-lg
### TopBarBrand
- TopBarBrand (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: font-sans → --font-sans
    - topBarLinkVariants base: text-body-large → --text-body-large
    - topBarLinkVariants base: aria-[current=page]:font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - topBarListVariants base: gap-8 → --spacing-8
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: data-[state=transparent]:shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - topBarVariants initialBackground=transparent: shadow-none → unresolved
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
### TopBarEnd
- TopBarEnd (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: font-sans → --font-sans
    - topBarLinkVariants base: text-body-large → --text-body-large
    - topBarLinkVariants base: aria-[current=page]:font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - topBarListVariants base: gap-8 → --spacing-8
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: data-[state=transparent]:shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - topBarVariants initialBackground=transparent: shadow-none → unresolved
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
### TopBarMobileTrigger
- TopBarMobileTrigger (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: font-sans → --font-sans
    - topBarLinkVariants base: text-body-large → --text-body-large
    - topBarLinkVariants base: aria-[current=page]:font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - topBarListVariants base: gap-8 → --spacing-8
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: data-[state=transparent]:shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - topBarVariants initialBackground=transparent: shadow-none → unresolved
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
### TopBarSearchCompact
- TopBarSearchCompact (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: font-sans → --font-sans
    - topBarLinkVariants base: text-body-large → --text-body-large
    - topBarLinkVariants base: aria-[current=page]:font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - topBarListVariants base: gap-8 → --spacing-8
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: data-[state=transparent]:shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - topBarVariants initialBackground=transparent: shadow-none → unresolved
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
### TopBarSearchFull
- TopBarSearchFull (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: font-sans → --font-sans
    - topBarLinkVariants base: text-body-large → --text-body-large
    - topBarLinkVariants base: aria-[current=page]:font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - topBarListVariants base: gap-8 → --spacing-8
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: data-[state=transparent]:shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - topBarVariants initialBackground=transparent: shadow-none → unresolved
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
### TopBarUserMenu
- TopBarUserMenu (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: font-sans → --font-sans
    - topBarLinkVariants base: text-body-large → --text-body-large
    - topBarLinkVariants base: aria-[current=page]:font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - topBarListVariants base: gap-8 → --spacing-8
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: data-[state=transparent]:shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - topBarVariants initialBackground=transparent: shadow-none → unresolved
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/top-bar/useTopBar.ts; see Surface anatomy
### appShellVariants
- appShellVariants (components[] · packages/ui/src/templates/app-shell/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - appShellBodyVariants base: flex → 
    - appShellBodyVariants base: flex-1 → 
    - appShellBottomVariants base: sticky → 
    - appShellBottomVariants base: bottom-0 → 
    - appShellMainVariants base: min-w-0 → 
    - appShellMainVariants base: flex-1 → 
    - appShellRootVariants base: flex → 
    - appShellRootVariants base: min-h-dvh → 
    - appShellRootVariants base: w-full → 
    - appShellRootVariants base: flex-col → 
    - appShellRootVariants base: bg-bg-canvas → --color-bg-canvas
    - appShellRootVariants base: font-sans → --font-sans
    - appShellSideVariants base: sticky → 
    - appShellSideVariants base: top-0 → 
    - appShellSideVariants base: h-dvh → 
    - appShellSkipLinkVariants base: m-2 → --spacing-2
    - appShellSkipRowVariants arrangement=switching: hidden → 
    - Layout source: `cn(appShellVariants.skipLink())` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.skipLink() → unresolved
    - Layout source: `cn(appShellVariants.root(), className)` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.root() → unresolved
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: className → unresolved
    - Layout source: `cn(appShellVariants.skip({ arrangement }))` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.skip({ arrangement }) → unresolved
    - Layout source: `cn(appShellVariants.body())` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.body() → unresolved
    - Layout source: `cn(appShellVariants.side({ arrangement }))` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.side({ arrangement }) → unresolved
    - Layout source: `cn(appShellVariants.main())` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.main() → unresolved
    - Layout source: `cn(appShellVariants.bottom({ arrangement }))` · packages/ui/src/templates/app-shell/useAppShell.ts
    - Layout packages/ui/src/templates/app-shell/useAppShell.ts: appShellVariants.bottom({ arrangement }) → unresolved
    - Layout source: `{s.showSkipRow && ( <div className={s.skipRowClass}> <Button variant='secondary' asChild={true} className={s.skipLinkClass}> <a href={s.skipHref} onClick={s.onSkipClick}> {s.skipLabel} </a> </Button> </div> )}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.skipRowClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.skipRowClass → unresolved
    - Layout source: `className={s.skipLinkClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.skipLinkClass → unresolved
    - Layout source: `{s.skipLabel}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.bodyClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.bodyClass → unresolved
    - Layout source: `{s.sideNavigation != null && <div className={s.sideClass}>{s.sideNavigation}</div>}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.sideClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.sideClass → unresolved
    - Layout source: `{s.sideNavigation}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.mainClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.mainClass → unresolved
    - Layout source: `{s.children}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `{s.bottomNavigation != null && <div className={s.bottomClass}>{s.bottomNavigation}</div>}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout source: `className={s.bottomClass}` · packages/ui/src/templates/app-shell/AppShell.tsx
    - Layout packages/ui/src/templates/app-shell/AppShell.tsx: s.bottomClass → unresolved
    - Layout source: `{s.bottomNavigation}` · packages/ui/src/templates/app-shell/AppShell.tsx
### badgeVariants
- badgeVariants (components[] · packages/ui/src/atoms/badge/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - badgeVariants base: gap-1.5 → --spacing
    - badgeVariants base: py-1.5 → --spacing
    - badgeVariants base: px-2.5 → --spacing
    - badgeVariants base: rounded-full → --radius-full
    - badgeVariants base: font-sans → --font-sans
    - badgeVariants base: text-label-default → --text-label-default
    - badgeVariants variant=soft: shadow-edge → --shadow-edge
    - badgeVariants variant=solid: shadow-none → unresolved
### calendarGridVariants
- calendarGridVariants (components[] · packages/ui/src/organisms/calendar-grid/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - calendarGridAddVariants base: rounded-md → --radius-md
    - calendarGridAddVariants base: focus-visible:shadow-focus → --shadow-focus
    - calendarGridDayNumberVariants base: font-display → --font-display
    - calendarGridDayNumberVariants base: text-heading-small → --text-heading-small
    - calendarGridDayVariants base: gap-2 → --spacing-2
    - calendarGridDayVariants base: p-2 → --spacing-2
    - calendarGridDayVariants base: rounded-lg → --radius-lg
    - calendarGridEntryListVariants base: p-0 → --spacing-0
    - calendarGridEntryListVariants base: gap-2 → --spacing-2
    - calendarGridHeaderRowVariants base: gap-2 → --spacing-2
    - calendarGridHeaderVariants base: gap-2 → --spacing-2
    - calendarGridHeaderVariants base: pt-1 → --spacing-1
    - calendarGridHeaderVariants base: px-0.5 → --spacing
    - calendarGridHeaderVariants base: pb-2 → --spacing-2
    - calendarGridLinkVariants base: rounded-sm → --radius-sm
    - calendarGridLinkVariants base: focus-visible:shadow-focus → --shadow-focus
    - calendarGridListVariants base: p-0 → --spacing-0
    - calendarGridListVariants base: gap-2 → --spacing-2
    - calendarGridMetaVariants base: text-label-default → --text-label-default
    - calendarGridTodayVariants base: font-display → --font-display
    - calendarGridTodayVariants base: text-meta → --text-meta
    - calendarGridVariants base: font-sans → --font-sans
    - calendarGridWeekdayVariants base: font-display → --font-display
    - calendarGridWeekdayVariants base: text-meta → --text-meta
### chipVariants
- chipVariants (components[] · packages/ui/src/atoms/chip/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - chipVariants base: gap-1.5 → --spacing
    - chipVariants base: px-2.5 → --spacing
    - chipVariants base: py-1.5 → --spacing
    - chipVariants base: rounded-full → --radius-full
    - chipVariants base: shadow-edge → --shadow-edge
    - chipVariants base: font-sans → --font-sans
    - chipVariants base: text-label-default → --text-label-default
    - chipVariants mode=toggle: data-[state=on]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] → --shadow-edge-strong, --shadow-glow-base
    - chipVariants mode=toggle: focus-visible:shadow-focus → --shadow-focus
    - chipVariants mode=toggle: data-[state=on]:focus-visible:shadow-focus → --shadow-focus
    - chipVariants mode=link: focus-visible:shadow-focus → --shadow-focus
### cn
- cn (components[] · packages/ui/src/lib/cn.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
### dropzoneVariants
- dropzoneVariants (components[] · packages/ui/src/atoms/dropzone/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - dropzoneVariants base: p-3 → --spacing-3
    - dropzoneVariants base: rounded-md → --radius-md
    - dropzoneVariants base: [box-shadow:none] → unresolved
    - dropzoneVariants base: text-label-default → --text-label-default
    - dropzoneVariants base: font-sans → --font-sans
    - dropzoneVariants base: text-center → unresolved
    - dropzoneVariants base: focus-visible:shadow-focus → --shadow-focus
    - dropzoneVariants variant=default: gap-1.5 → --spacing
    - dropzoneVariants variant=inline: gap-2.5 → --spacing
### footerHeadingVariants
- footerHeadingVariants (components[] · packages/ui/src/organisms/footer/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - footerGridVariants base: gap-x-10 → --spacing-10
    - footerGridVariants base: gap-y-8 → --spacing-8
    - footerGridVariants base: pt-10 → --spacing-10
    - footerHeadingVariants base: font-display → --font-display
    - footerHeadingVariants base: text-label-eyebrow → --text-label-eyebrow
    - footerLegalVariants base: gap-4 → --spacing-4
    - footerLegalVariants base: pt-4 → --spacing-4
    - footerLegalVariants base: text-body-default → --text-body-default
    - footerListVariants base: p-0 → --spacing-0
    - footerMottoVariants base: px-0 → --spacing-0
    - footerMottoVariants base: pt-10 → --spacing-10
    - footerMottoVariants base: pb-8 → --spacing-8
    - footerVariants base: p-0 → --spacing-0
    - footerVariants base: pb-8 → --spacing-8
    - footerVariants base: font-sans → --font-sans
### labelVariants
- labelVariants (components[] · packages/ui/src/primitives/label/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - labelVariants base: font-sans → --font-sans
    - labelVariants base: text-label-default → --text-label-default
    - labelVariants variant=choice: font-[var(--text-body-default--font-weight)] → --text-body-default--font-weight
### menuVariants
- menuVariants (components[] · packages/ui/src/molecules/menu/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - accountMenuRecipeVariants part=trigger: cn(         surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'full' }),         'group inline-flex items-center gap-1 min-h-10 pointer-coarse:min-h-11 pl-1 pr-1.5 border-border-hairline-strong text-fg-secondary cursor-pointer hover:bg-surface-2 hover:border-border-brand hover:text-fg-default aria-expanded:bg-surface-2 aria-expanded:border-border-brand aria-expanded:text-fg-default focus-visible:outline-none focus-visible:shadow-focus transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none'       ) → unresolved
    - accountMenuRecipeVariants part=name: font-sans → --font-sans
    - accountMenuRecipeVariants part=name: text-label-default → --text-label-default
    - accountMenuRecipeVariants part=description: font-sans → --font-sans
    - accountMenuRecipeVariants part=description: text-label-default → --text-label-default
    - menuHeaderVariants base: gap-3 → --spacing-3
    - menuHeaderVariants base: p-2.5 → --spacing
    - menuHeaderVariants base: pb-3 → --spacing-3
    - menuItemVariants base: gap-3 → --spacing-3
    - menuItemVariants base: px-3 → --spacing-3
    - menuItemVariants base: py-2.25 → --spacing
    - menuItemVariants base: rounded-md → --radius-md
    - menuItemVariants base: text-label-default → --text-label-default
    - menuLabelVariants base: px-3 → --spacing-3
    - menuLabelVariants base: pt-2 → --spacing-2
    - menuLabelVariants base: pb-1 → --spacing-1
    - menuLabelVariants base: font-display → --font-display
    - menuLabelVariants base: text-meta → --text-meta
    - menuShortcutVariants base: pl-3 → --spacing-3
    - menuVariants base: p-2 → --spacing-2
    - menuVariants base: font-sans → --font-sans
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'full' }) · packages/ui/src/molecules/menu/types.ts; see Surface anatomy
    - surfaceVariants({ tone: 'overlay', padding: 'none', radius: 'xl' }) · packages/ui/src/molecules/menu/useMenu.ts; see Surface anatomy
### moduleRailVariants
- moduleRailVariants (components[] · packages/ui/src/organisms/module-rail/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - moduleRailVariants base: gap-2 → --spacing-2
    - moduleRailVariants base: py-4 → --spacing-4
    - railLinkVariants base: rounded-md → --radius-md
    - railLinkVariants base: focus-visible:shadow-focus → --shadow-focus
    - railListVariants base: gap-2 → --spacing-2
    - railListVariants base: p-0 → --spacing-0
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/module-rail/useModuleRail.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }) · packages/ui/src/organisms/module-rail/useModuleRail.ts; see Surface anatomy
### navListVariants
- navListVariants (components[] · packages/ui/src/molecules/nav-list/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - navListCaptionVariants base: gap-2 → --spacing-2
    - navListCaptionVariants base: px-[calc(var(--space-1)*2.5)] → --space-1
    - navListCaptionVariants base: font-display → --font-display
    - navListCaptionVariants base: text-nav-group → --text-nav-group
    - navListCaptionVariants base: font-[var(--text-label-eyebrow--font-weight)] → --text-label-eyebrow--font-weight
    - navListCountVariants base: font-mono → --font-mono
    - navListCountVariants base: text-nav-count → --text-nav-count
    - navListCountVariants base: font-[var(--text-label-default--font-weight)] → --text-label-default--font-weight
    - navListLinkVariants base: rounded-md → --radius-md
    - navListLinkVariants base: gap-[calc(var(--space-1)*3.125)] → --space-1
    - navListLinkVariants base: px-[calc(var(--space-1)*2.5)] → --space-1
    - navListLinkVariants base: py-[calc(var(--space-1)*2.1875)] → --space-1
    - navListLinkVariants base: font-sans → --font-sans
    - navListLinkVariants base: text-nav-row → --text-nav-row
    - navListLinkVariants base: font-[var(--text-body-muted--font-weight)] → --text-body-muted--font-weight
    - navListListVariants base: p-0 → --spacing-0
    - navListListVariants base: gap-0 → --spacing-0
    - navListMarkerVariants base: rounded-md → --radius-md
    - navListMetadataVariants base: gap-2 → --spacing-2
    - navListTriggerVariants base: gap-2 → --spacing-2
    - navListTriggerVariants base: px-[calc(var(--space-1)*2.5)] → --space-1
    - navListTriggerVariants base: py-[calc(var(--space-1)*1.5625)] → --space-1
    - navListTriggerVariants base: rounded-md → --radius-md
    - navListTriggerVariants base: text-left → unresolved
    - navListTriggerVariants base: font-display → --font-display
    - navListTriggerVariants base: text-nav-group → --text-nav-group
    - navListTriggerVariants base: font-[var(--text-label-eyebrow--font-weight)] → --text-label-eyebrow--font-weight
    - navListTriggerVariants base: focus-visible:shadow-focus → --shadow-focus
    - navListVariants base: font-sans → --font-sans
    - surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'md' }) · packages/ui/src/molecules/nav-list/useNavList.ts; see Surface anatomy
### noticeVariants
- noticeVariants (components[] · packages/ui/src/molecules/notice/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - noticeActionsVariants base: gap-2 → --spacing-2
    - noticeAppearanceVariants base: gap-3 → --spacing-3
    - noticeAppearanceVariants base: px-4 → --spacing-4
    - noticeAppearanceVariants base: py-3 → --spacing-3
    - noticeAppearanceVariants base: font-sans → --font-sans
    - noticeAppearanceVariants size=md: text-body-default → --text-body-default
    - noticeAppearanceVariants size=sm: gap-2 → --spacing-2
    - noticeAppearanceVariants size=sm: px-3 → --spacing-3
    - noticeAppearanceVariants size=sm: py-2 → --spacing-2
    - noticeAppearanceVariants size=sm: rounded-md → --radius-md
    - noticeAppearanceVariants size=sm: text-label-default → --text-label-default
    - surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }) · packages/ui/src/molecules/notice/types.ts; see Surface anatomy
### progressBarVariants
- progressBarVariants (components[] · packages/ui/src/atoms/progress-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - progressBarFillVariants size=lg: rounded-[inherit] → unresolved
    - progressBarFillVariants size=lg: shadow-edge-strong → --shadow-edge-strong
    - progressBarVariants size=lg: rounded-full → --radius-full
    - progressBarVariants size=lg: shadow-well → --shadow-well
    - progressBarVariants edge=true: rounded-none → --radius-none
    - progressBarVariants {"size":"sm","edge":"false"}: rounded-[var(--radius-sm)] → --radius-sm
### radioGroupVariants
- radioGroupVariants (components[] · packages/ui/src/atoms/radio-group/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - radioGroupIndicatorVariants base: rounded-full → --radius-full
    - radioGroupItemVariants base: p-0 → --spacing-0
    - radioGroupItemVariants base: rounded-full → --radius-full
    - radioGroupItemVariants base: shadow-[var(--shadow-well)] → --shadow-well
    - radioGroupItemVariants base: data-[state=checked]:shadow-[var(--shadow-btn-primary)] → --shadow-btn-primary
    - radioGroupItemVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - radioGroupItemVariants base: data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - radioGroupRootVariants orientation=vertical: gap-1 → --spacing-1
    - radioGroupRootVariants orientation=horizontal: gap-x-6 → --spacing-6
    - radioGroupRootVariants orientation=horizontal: gap-y-1 → --spacing-1
    - radioGroupRowVariants base: gap-2 → --spacing-2
    - radioGroupRowVariants base: font-sans → --font-sans
    - radioGroupRowVariants base: text-label-default → --text-label-default
### sidebarVariants
- sidebarVariants (components[] · packages/ui/src/organisms/sidebar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - sidebarContentVariants base: px-3 → --spacing-3
    - sidebarContentVariants base: pb-4 → --spacing-4
    - sidebarContentVariants header=false: pt-4 → --spacing-4
    - sidebarFooterVariants base: gap-2 → --spacing-2
    - sidebarFooterVariants base: px-4 → --spacing-4
    - sidebarFooterVariants base: py-3 → --spacing-3
    - sidebarFooterVariants base: font-sans → --font-sans
    - sidebarFooterVariants base: text-label-default → --text-label-default
    - sidebarHeaderVariants base: gap-3 → --spacing-3
    - sidebarHeaderVariants base: px-4 → --spacing-4
    - sidebarHeaderVariants base: pt-5 → --spacing-5
    - sidebarHeaderVariants base: pb-4 → --spacing-4
    - sidebarNameVariants base: font-display → --font-display
    - sidebarNameVariants base: text-heading-small → --text-heading-small
    - sidebarScrollbarVariants base: p-0.5 → --spacing
    - sidebarThumbVariants base: rounded-full → --radius-full
    - surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/sidebar/useSidebar.ts; see Surface anatomy
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/sidebar/useSidebar.ts; see Surface anatomy
### sliderVariants
- sliderVariants (components[] · packages/ui/src/atoms/slider/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - sliderThumbVariants base: rounded-full → --radius-full
    - sliderThumbVariants base: shadow-[var(--shadow-elev-1)] → --shadow-elev-1
    - sliderThumbVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - sliderTrackVariants base: rounded-full → --radius-full
    - sliderTrackVariants base: shadow-[var(--shadow-well)] → --shadow-well
### statVariants
- statVariants (components[] · packages/ui/src/atoms/stat/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - statDeltaVariants base: font-sans → --font-sans
    - statDeltaVariants base: text-label-default → --text-label-default
    - statLabelVariants base: font-display → --font-display
    - statLabelVariants base: text-meta → --text-meta
    - statValueVariants base: font-display → --font-display
    - statValueVariants size=md: text-display-stat → --text-display-stat
    - statValueVariants size=sm: text-display-stat-sm → --text-display-stat-sm
    - statVariants base: rounded-lg → --radius-lg
    - statVariants base: shadow-[var(--shadow-edge),var(--shadow-elev-1)] → --shadow-edge, --shadow-elev-1
    - statVariants base: data-[state=highlighted]:shadow-[var(--shadow-edge),var(--shadow-glow-base)] → --shadow-edge, --shadow-glow-base
    - statVariants size=md: gap-1.5 → --spacing
    - statVariants size=md: px-4 → --spacing-4
    - statVariants size=md: py-3 → --spacing-3
    - statVariants size=sm: gap-1 → --spacing-1
    - statVariants size=sm: px-3 → --spacing-3
    - statVariants size=sm: py-2.5 → --spacing
### statusDotVariants
- statusDotVariants (components[] · packages/ui/src/atoms/status-dot/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - statusDotVariants base: rounded-full → --radius-full
    - statusDotVariants state=live: shadow-glow-hot → --shadow-glow-hot
    - statusDotVariants state=standby: shadow-glow-hot → --shadow-glow-hot
### surfaceVariants
- surfaceVariants (components[] · packages/ui/src/primitives/surface/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - surfaceVariants tone=surface-1: `bg-surface-1 ${sheen}` → unresolved
    - surfaceVariants tone=surface-2: `bg-surface-2 ${sheen}` → unresolved
    - surfaceVariants tone=surface-3: `bg-surface-3 ${sheen}` → unresolved
    - surfaceVariants tone=well: shadow-[var(--shadow-well)] → --shadow-well
    - surfaceVariants tone=overlay: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - surfaceVariants padding=none: p-0 → --spacing-0
    - surfaceVariants padding=sm: p-3 → --spacing-3
    - surfaceVariants padding=md: p-6 → --spacing-6
    - surfaceVariants padding=lg: p-8 → --spacing-8
    - surfaceVariants radius=none: rounded-none → --radius-none
    - surfaceVariants radius=md: rounded-md → --radius-md
    - surfaceVariants radius=lg: rounded-lg → --radius-lg
    - surfaceVariants radius=xl: rounded-xl → --radius-xl
    - surfaceVariants radius=full: rounded-full → --radius-full
    - surfaceVariants {"tone":"raisedTones","elevation":"0"}: shadow-edge → --shadow-edge
    - surfaceVariants {"tone":"raisedTones","elevation":"1"}: shadow-[var(--shadow-edge),var(--shadow-elev-1)] → --shadow-edge, --shadow-elev-1
    - surfaceVariants {"tone":"raisedTones","elevation":"2"}: shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] → --shadow-edge-strong, --shadow-elev-2
    - surfaceVariants {"tone":"raisedTones","elevation":"3"}: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - surfaceVariants {"tone":"surface-0","elevation":"[1, 2, 3]"}: sheen → unresolved
    - surfaceVariants({ tone, elevation: raised ? (elevation ?? 1) : null, padding, radius }) · packages/ui/src/primitives/surface/useSurface.ts; see Surface anatomy
### tabBarVariants
- tabBarVariants (components[] · packages/ui/src/organisms/tab-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - tabBarLinkVariants base: gap-1 → --spacing-1
    - tabBarLinkVariants base: py-2 → --spacing-2
    - tabBarLinkVariants base: px-1 → --spacing-1
    - tabBarLinkVariants base: rounded-md → --radius-md
    - tabBarLinkVariants base: text-label-default → --text-label-default
    - tabBarLinkVariants base: aria-[current=page]:before:rounded-full → --radius-full
    - tabBarLinkVariants base: focus-visible:shadow-focus → --shadow-focus
    - tabBarListVariants base: p-0 → --spacing-0
    - tabBarVariants base: pt-1.5 → --spacing
    - tabBarVariants base: px-2 → --spacing-2
    - tabBarVariants base: pb-[max(var(--space-5),env(safe-area-inset-bottom))] → --space-5
    - tabBarVariants base: font-sans → --font-sans
    - surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }) · packages/ui/src/organisms/tab-bar/useTabBar.ts; see Surface anatomy
### tabsVariants
- tabsVariants (components[] · packages/ui/src/molecules/tabs/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - tabsCountVariants base: px-1.5 → --spacing
    - tabsCountVariants base: rounded-full → --radius-full
    - tabsCountVariants base: shadow-edge → --shadow-edge
    - tabsCountVariants base: text-label-default → --text-label-default
    - tabsListVariants variant=underline: gap-1 → --spacing-1
    - tabsListVariants variant=segmented: gap-0.5 → --spacing
    - tabsListVariants variant=segmented: p-0.75 → --spacing
    - tabsPanelVariants base: pt-4 → --spacing-4
    - tabsTriggerVariants base: gap-2 → --spacing-2
    - tabsTriggerVariants base: font-sans → --font-sans
    - tabsTriggerVariants base: text-label-default → --text-label-default
    - tabsTriggerVariants variant=underline: after:rounded-full → --radius-full
    - tabsTriggerVariants variant=underline: data-[state=active]:after:shadow-glow-base → --shadow-glow-base
    - tabsTriggerVariants variant=segmented: px-3 → --spacing-3
    - tabsTriggerVariants variant=segmented: rounded-[calc(var(--radius-md)---spacing(0.75))] → --radius-md, --spacing
    - tabsTriggerVariants variant=segmented: data-[state=active]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)] → --shadow-edge-strong, --shadow-elev-1
    - tabsTriggerVariants variant=segmented: focus-visible:shadow-focus → --shadow-focus
    - tabsTriggerVariants variant=segmented: data-[state=active]:focus-visible:shadow-focus → --shadow-focus
    - tabsTriggerVariants {"variant":"underline","size":"md"}: px-3 → --spacing-3
    - tabsTriggerVariants {"variant":"underline","size":"sm"}: px-2 → --spacing-2
    - tabsVariants base: gap-0 → --spacing-0
    - surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }) · packages/ui/src/molecules/tabs/useTabs.ts; see Surface anatomy
### tooltipVariants
- tooltipVariants (components[] · packages/ui/src/atoms/tooltip/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - tooltipVariants base: px-2 → --spacing-2
    - tooltipVariants base: py-1 → --spacing-1
    - tooltipVariants base: rounded-sm → --radius-sm
    - tooltipVariants base: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - tooltipVariants base: text-label-default → --text-label-default
    - tooltipVariants base: font-sans → --font-sans
### useToast
- useToast (components[] · packages/ui/src/molecules/toast/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - toastRootVariants base: pe-2 → --spacing-2
    - toastRootVariants base: shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
    - toastRootVariants danger=true: before:rounded-[inherit] → unresolved
    - toastViewportVariants base: gap-2 → --spacing-2
    - toastViewportVariants base: p-0 → --spacing-0
    - toastViewportVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - toastViewportVariants base: rounded-lg → --radius-lg
Not exported:
- LiveBand (catalog[] · docs/catalog.json)
- GaugeDock (catalog[] · docs/catalog.json)
- HoverCard (catalog[] · docs/catalog.json)
- ListItem row variant (catalog[] · docs/catalog.json)
- ListItem row variant (catalog[] · docs/catalog.json)
- ListItem row variant (catalog[] · docs/catalog.json)
- Toast (catalog[] · docs/catalog.json)
- CommunityGrid (catalog[] · docs/catalog.json)
- MobileMenu (catalog[] · docs/catalog.json)
- ProjectsGrid (catalog[] · docs/catalog.json)
- TipsSlider (catalog[] · docs/catalog.json)
- UserMenu (catalog[] · docs/catalog.json)

## Usage rules

- absolute-deadline-text: deadlineText; approved; Countdown (propNaming[] · skills/_shared/prop-naming.json)
- accent-line-break: accentBreak; approved; Heading, SectionHeader, Text (propNaming[] · skills/_shared/prop-naming.json)
- accessible-name: label; approved; Avatar, ButtonGroup, CalendarGrid, Carousel, CarouselItem, ChipGroup, ChipGroupOption, CommandPalette, CommandPaletteItem, Countdown, Dropzone, Field, FooterNavigation, FooterNavigationItem, Gauge, GaugeGroup, GaugeGroupRing, Icon, IconButton, Isotipo3D, Kbd, Logo, MeterRow, ModuleRail, NavList, NowStrip, PopoverContent, ProgressBar, ProjectCardCode, RadioGroup, SearchTrigger, SectionNav, SelectTile, SelectTileOption, Slider, SocialLinkItem, SocialLinks, Spinner, Stat, TabBar, Table, Tabs, TerminalCard, Timeline, ToastProvider, Toggle, TopBar (propNaming[] · skills/_shared/prop-naming.json)
- action-alternative-text: actionAltText; approved; Toast (propNaming[] · skills/_shared/prop-naming.json)
- active-row: activeRowId; approved; Table (propNaming[] · skills/_shared/prop-naming.json)
- active-section-id: activeId; approved; SectionNav (propNaming[] · skills/_shared/prop-naming.json)
- add-request: onAdd; approved; CalendarGrid, ModuleRail (propNaming[] · skills/_shared/prop-naming.json)
- anchor-corner-position: position; approved; Indicator (propNaming[] · skills/_shared/prop-naming.json)
- anchor-zone-binding: zone; approved; HomeTemplateAnchor (propNaming[] · skills/_shared/prop-naming.json)
- animation-paused: animationPaused; approved; Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- announcement-label: announcementLabel; approved; ToastProvider (propNaming[] · skills/_shared/prop-naming.json)
- aspect-ratio: ratio; approved; AspectRatio, PhotoFrame, PreviewFrame, SelectTile (propNaming[] · skills/_shared/prop-naming.json)
- auto-dismiss-duration: duration; approved; Toast (propNaming[] · skills/_shared/prop-naming.json)
- board-sticky-side: sticky; approved; NotesBoard (propNaming[] · skills/_shared/prop-naming.json)
- bottom-navigation: bottomNavigation; approved; AppShell (propNaming[] · skills/_shared/prop-naming.json)
- brand-monogram: monogram; approved;  (propNaming[] · skills/_shared/prop-naming.json)
- card-link-action-label: actionLabel; approved; ArticleFeature (propNaming[] · skills/_shared/prop-naming.json)
- character-counter: counter; approved; Field (propNaming[] · skills/_shared/prop-naming.json)
- checked-change: onCheckedChange; approved; Checkbox, Switch (propNaming[] · skills/_shared/prop-naming.json)
- choice-options: options; approved; ChipGroup, RadioGroup, Select, SelectTile (propNaming[] · skills/_shared/prop-naming.json)
- choreography-zone-table: zoneTable; approved; HomeTemplate (propNaming[] · skills/_shared/prop-naming.json)
- clock-initialization-message: initializingText; approved; Countdown (propNaming[] · skills/_shared/prop-naming.json)
- close-auto-focus: onCloseAutoFocus; approved; PopoverContent (propNaming[] · skills/_shared/prop-naming.json)
- collection-filtering: filtering; approved; CommandPalette (propNaming[] · skills/_shared/prop-naming.json)
- collection-items: items; approved; CalendarGrid, Carousel, CommandPalette, FooterNavigation, GaugeGroup, Menu, MenuSubmenuItem, ModuleRail, NavList, ProjectCardCode, ProjectCardTags, SectionNav, SocialLinks, TabBar, Tabs, TerminalCardList, Timeline, TopBar (propNaming[] · skills/_shared/prop-naming.json)
- committed-value-change: onValueCommit; approved; Slider (propNaming[] · skills/_shared/prop-naming.json)
- compact-presentation: compact; approved; SearchTrigger (propNaming[] · skills/_shared/prop-naming.json)
- condition-description: stateText; approved; Gauge, GaugeGroupRing (propNaming[] · skills/_shared/prop-naming.json)
- consumer-selected-condition: state; approved; Gauge, GaugeGroupRing, Pixel, StatusDot (propNaming[] · skills/_shared/prop-naming.json)
- container-edge-placement: edge; approved; ProgressBar (propNaming[] · skills/_shared/prop-naming.json)
- content-description: description; approved; AlertDialogContent, ArticleFeature, DialogContent (propNaming[] · skills/_shared/prop-naming.json)
- content-detail: detail; approved; ArticleFeature (propNaming[] · skills/_shared/prop-naming.json)
- corner-badge-icon: badgeIcon; approved; Indicator (propNaming[] · skills/_shared/prop-naming.json)
- corner-radius: radius; approved; Surface (propNaming[] · skills/_shared/prop-naming.json)
- cover-badge: coverBadge; approved; ArticleFeatureCover, TipCard (propNaming[] · skills/_shared/prop-naming.json)
- cross-axis-alignment: alignItems; approved; Cluster, Stack (propNaming[] · skills/_shared/prop-naming.json)
- deadline-expiration: onExpire; approved; Countdown (propNaming[] · skills/_shared/prop-naming.json)
- deadline-instant: deadline; approved; Countdown (propNaming[] · skills/_shared/prop-naming.json)
- decorative-center-content: center; approved; Gauge, GaugeGroup (propNaming[] · skills/_shared/prop-naming.json)
- decorative-cover-word: coverWord; approved; ArticleFeatureCover (propNaming[] · skills/_shared/prop-naming.json)
- decorative-index: index; approved; ProjectCard (propNaming[] · skills/_shared/prop-naming.json)
- decorative-separation: decorative; approved; Divider (propNaming[] · skills/_shared/prop-naming.json)
- dismiss-label: dismissLabel; approved; CommandPalette, DialogContent, Toast (propNaming[] · skills/_shared/prop-naming.json)
- drop-target-label: dropLabel; approved; Dropzone (propNaming[] · skills/_shared/prop-naming.json)
- effect-profile: profile; approved; AmbientBackground (propNaming[] · skills/_shared/prop-naming.json)
- effect-progress: progress; approved; Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- effect-scene: scene; approved; Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- end-items: endItems; approved; ModuleRail (propNaming[] · skills/_shared/prop-naming.json)
- entrance-delay: delay; approved; ScrollReveal (propNaming[] · skills/_shared/prop-naming.json)
- expired-deadline-message: expiredText; approved; Countdown (propNaming[] · skills/_shared/prop-naming.json)
- field-error: error; approved; Field (propNaming[] · skills/_shared/prop-naming.json)
- field-guidance-tone: hintTone; proposed; Field (propNaming[] · skills/_shared/prop-naming.json)
- field-hint: hint; approved; Field (propNaming[] · skills/_shared/prop-naming.json)
- field-message-content: children; proposed; FieldMessage (propNaming[] · skills/_shared/prop-naming.json)
- figure-caption: figureCaption; approved; PreviewFrame (propNaming[] · skills/_shared/prop-naming.json)
- files-received: onFiles; approved; Dropzone (propNaming[] · skills/_shared/prop-naming.json)
- filled-glyph: filled; approved; Icon (propNaming[] · skills/_shared/prop-naming.json)
- floating-align: align; approved; Menu, PopoverContent (propNaming[] · skills/_shared/prop-naming.json)
- floating-side: side; approved; Menu, PopoverContent, Tooltip (propNaming[] · skills/_shared/prop-naming.json)
- group-caption: caption; approved; SocialLinks (propNaming[] · skills/_shared/prop-naming.json)
- guide-zones: zones; approved; PreviewFrame (propNaming[] · skills/_shared/prop-naming.json)
- header-status-text: statusText; approved; DialogContent (propNaming[] · skills/_shared/prop-naming.json)
- heading-eyebrow: eyebrow; approved; ArticleFeature, ChapterBreak, Closing, CommunityCard, Hero, LabStage, PageHeader, ProjectCard, SectionHeader (propNaming[] · skills/_shared/prop-naming.json)
- heading-id: titleId; approved; SectionHeader (propNaming[] · skills/_shared/prop-naming.json)
- heading-level: level; approved; ArticleFeature, CalendarGrid, ChapterBreak, Closing, CommunityCard, FooterNavigation, Heading, Hero, LabStage, ListItemTitle, ModuleCard, NowCard, PageHeader, ProjectCard, SectionHeader, TipCard (propNaming[] · skills/_shared/prop-naming.json)
- heading-title: title; approved; AlertDialogContent, ArticleFeature, ChapterBreak, Closing, CommunityCard, DialogContent, Hero, LabStage, ModuleCard, NowCard, PageHeader, ProjectCard, SectionHeader, TipCard (propNaming[] · skills/_shared/prop-naming.json)
- icon-glyph-name: name; approved; Icon (propNaming[] · skills/_shared/prop-naming.json)
- icon-placement: iconPosition; approved; Button (propNaming[] · skills/_shared/prop-naming.json)
- image-caption: imageCaption; approved; PhotoFrame (propNaming[] · skills/_shared/prop-naming.json)
- image-focal-point: focalPoint; approved; PhotoFrame, TipCard (propNaming[] · skills/_shared/prop-naming.json)
- indicator-count: count; approved; Indicator (propNaming[] · skills/_shared/prop-naming.json)
- indicator-count-cap: max; approved; Indicator (propNaming[] · skills/_shared/prop-naming.json)
- initial-uncontrolled-open: defaultOpen; approved; AlertDialog, Collapsible, CommandPalette, Dialog, Menu, NavList, Popover, SectionNav (propNaming[] · skills/_shared/prop-naming.json)
- initial-uncontrolled-pressed: defaultPressed; approved; Chip, Toggle (propNaming[] · skills/_shared/prop-naming.json)
- initial-uncontrolled-sort: defaultSort; approved; Table (propNaming[] · skills/_shared/prop-naming.json)
- initial-uncontrolled-value: defaultValue; approved; Carousel, ChipGroup, RadioGroup, Select, SelectTile, Slider, Table, Tabs (propNaming[] · skills/_shared/prop-naming.json)
- inline-caption-layout: inline; approved; SocialLinks (propNaming[] · skills/_shared/prop-naming.json)
- inner-padding: padding; approved; Surface (propNaming[] · skills/_shared/prop-naming.json)
- interaction-drag-rotate: dragRotate; approved; Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- interaction-flip-gesture: flip; approved; Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- interaction-interactive-mode: interactive; approved; Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- interaction-modality: modal; approved; Popover (propNaming[] · skills/_shared/prop-naming.json)
- interaction-pose-change: onPoseChange; approved; Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- interactive-value-change: onValueChange; approved; Carousel, ChipGroup, RadioGroup, Select, SelectTile, Slider, Table, Tabs (propNaming[] · skills/_shared/prop-naming.json)
- item-presentation-status: status; approved; CalendarGridEntry, ListItem, ModuleCard (propNaming[] · skills/_shared/prop-naming.json)
- keyboard-shortcut-hint: shortcut; approved; CommandPaletteItem, MenuEntry, SearchTrigger (propNaming[] · skills/_shared/prop-naming.json)
- label-layout: layout; approved; Field (propNaming[] · skills/_shared/prop-naming.json)
- layer-opacity: opacity; approved; AmbientBackground, Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- layout-gap: gap; approved; Cluster, SocialLinks, Stack (propNaming[] · skills/_shared/prop-naming.json)
- layout-orientation: orientation; approved; Divider, RadioGroup (propNaming[] · skills/_shared/prop-naming.json)
- leading-icon: icon; approved; Badge, Button, Chip, ChipGroupOption, CommandPaletteItem, FieldMessage, IconButton, Input, MenuEntry, ModuleCard, ModuleRail, NavList, Notice, SocialLinkItem, TabBarItem, Timeline, Toast, Toggle (propNaming[] · skills/_shared/prop-naming.json)
- leading-status-badge: statusBadge; approved; NowCard (propNaming[] · skills/_shared/prop-naming.json)
- line-particle-direction: lineDirection; approved; AmbientBackground (propNaming[] · skills/_shared/prop-naming.json)
- live-presentation: live; approved; SelectTileOption (propNaming[] · skills/_shared/prop-naming.json)
- localized-messages: messages; approved; AppShell, CalendarGrid, Carousel, CommandPalette, MeterRow, ModuleCard, ModuleRail, TabBar, Table, Timeline, WebTemplate (propNaming[] · skills/_shared/prop-naming.json)
- main-axis-distribution: justifyContent; approved; Cluster, Stack (propNaming[] · skills/_shared/prop-naming.json)
- measurement-text-equivalent: valueText; approved; Gauge, GaugeGroupRing, MeterRow, ProgressBar, Slider (propNaming[] · skills/_shared/prop-naming.json)
- menu-entry-kind: kind; approved; MenuEntry, ModuleRail, NavList (propNaming[] · skills/_shared/prop-naming.json)
- message-summary: summary; approved; Notice, Toast (propNaming[] · skills/_shared/prop-naming.json)
- move-intent: onMove; approved; CalendarGrid (propNaming[] · skills/_shared/prop-naming.json)
- navigation-intent: onNavigate; approved; CalendarGrid, Menu, ModuleRail, NavList, SectionNav, TabBar, TopBar (propNaming[] · skills/_shared/prop-naming.json)
- new-tab-navigation: external; approved; Chip, Link, SocialLinkItem (propNaming[] · skills/_shared/prop-naming.json)
- new-tab-notice: newTabText; approved; Chip, Link, SocialLinks (propNaming[] · skills/_shared/prop-naming.json)
- numeric-display-help: help; approved; MeterRow (propNaming[] · skills/_shared/prop-naming.json)
- open-change: onOpenChange; approved; AlertDialog, Collapsible, CommandPalette, Dialog, Menu, NavList, Popover, SectionNav (propNaming[] · skills/_shared/prop-naming.json)
- open-state: open; approved; AlertDialog, Collapsible, CommandPalette, Dialog, Menu, NavList, Popover, SectionNav (propNaming[] · skills/_shared/prop-naming.json)
- option-metadata: meta; approved; SelectTileOption (propNaming[] · skills/_shared/prop-naming.json)
- page-top-bar-slot: topBar; approved; WebTemplate (propNaming[] · skills/_shared/prop-naming.json)
- panel-footer: footer; approved; ModuleCard, PreviewFrame, Sidebar, WebTemplate (propNaming[] · skills/_shared/prop-naming.json)
- panel-header: header; approved; Menu, WebSection (propNaming[] · skills/_shared/prop-naming.json)
- paused-presentation: paused; approved; Avatar (propNaming[] · skills/_shared/prop-naming.json)
- pending-activity: loading; approved; Button, Input (propNaming[] · skills/_shared/prop-naming.json)
- pointer-tilt: pointerTilt; approved; Isotipo3D (propNaming[] · skills/_shared/prop-naming.json)
- portal-container: container; approved; Portal (propNaming[] · skills/_shared/prop-naming.json)
- preset-dimensions: size; approved; Avatar, Button, Countdown, DialogContent, Gauge, GaugeGroup, Icon, IconButton, Indicator, Input, ListItem, Logo, Notice, NowCard, ProgressBar, ProjectCard, Select, Skeleton, SocialLinks, Spinner, Stat, Table, Tabs, Timeline, Toggle (propNaming[] · skills/_shared/prop-naming.json)
- pressed-change: onPressedChange; approved; Chip, Toggle (propNaming[] · skills/_shared/prop-naming.json)
- pressed-state: pressed; approved; Chip, Toggle (propNaming[] · skills/_shared/prop-naming.json)
- preview-thumbnail: thumb; approved; SelectTileOption (propNaming[] · skills/_shared/prop-naming.json)
- primary-value: value; approved; Carousel, CarouselItem, ChipGroup, ChipGroupOption, Gauge, GaugeGroupRing, MeterRow, ProgressBar, RadioGroup, SectionNav, Select, SelectTile, SelectTileOption, Slider, Stat, Table, Tabs (propNaming[] · skills/_shared/prop-naming.json)
- product-identity: product; approved; ModuleRail, Sidebar (propNaming[] · skills/_shared/prop-naming.json)
- quotation-source: source; approved; PullQuote (propNaming[] · skills/_shared/prop-naming.json)
- quotation-text: text; approved; PullQuote (propNaming[] · skills/_shared/prop-naming.json)
- render-mode: mode; approved; Chip (propNaming[] · skills/_shared/prop-naming.json)
- results-busy: busy; approved; CommandPalette (propNaming[] · skills/_shared/prop-naming.json)
- row-selection: selectable; approved; Table (propNaming[] · skills/_shared/prop-naming.json)
- rule-reference: rule; approved;  (propNaming[] · skills/_shared/prop-naming.json)
- safe-area-guide: safeArea; approved; PreviewFrame (propNaming[] · skills/_shared/prop-naming.json)
- scene-media: media; approved; ChapterBreak, Closing, Hero, LabStage, WebSection (propNaming[] · skills/_shared/prop-naming.json)
- scene-social: social; approved; Hero, WebSection (propNaming[] · skills/_shared/prop-naming.json)
- search-query-change: onQueryChange; approved; CommandPalette (propNaming[] · skills/_shared/prop-naming.json)
- section-content-wrap: wrap; approved; SectionShell (propNaming[] · skills/_shared/prop-naming.json)
- section-lede: lede; approved; ChapterBreak, Closing, Hero, LabStage, SectionHeader (propNaming[] · skills/_shared/prop-naming.json)
- section-register: register; approved; SectionShell (propNaming[] · skills/_shared/prop-naming.json)
- selection-cardinality: type; approved; ChipGroup, SelectTile (propNaming[] · skills/_shared/prop-naming.json)
- selection-placeholder: placeholder; approved; Select (propNaming[] · skills/_shared/prop-naming.json)
- shell-label: shell; approved; TerminalCardBar (propNaming[] · skills/_shared/prop-naming.json)
- side-navigation: sideNavigation; approved; AppShell (propNaming[] · skills/_shared/prop-naming.json)
- signal-pulse: pulse; approved; Skeleton, StatusDot (propNaming[] · skills/_shared/prop-naming.json)
- slot-composition: asChild; approved; AlertDialogAction, AlertDialogCancel, AlertDialogTrigger, ArticleFeature, Button, Cluster, DialogClose, DialogTrigger, IconButton, Link, ListItem, PopoverClose, PopoverTrigger, ScrollReveal, Stack, Surface, Text, VisuallyHidden (propNaming[] · skills/_shared/prop-naming.json)
- sort-change: onSortChange; approved; Table (propNaming[] · skills/_shared/prop-naming.json)
- square-particle-direction: squareDirection; approved; AmbientBackground (propNaming[] · skills/_shared/prop-naming.json)
- surface-elevation: elevation; approved; Surface (propNaming[] · skills/_shared/prop-naming.json)
- surface-material-tone: tone; approved; AlertDialogContent, Badge, Countdown, FieldMessage, Heading, Indicator, MenuEntry, ModuleCard, NavList, Notice, Panel, PreviewFrame, PullQuote, SectionHeader, Surface, Tabs, TerminalCardRow, Text, Timeline, Toast (propNaming[] · skills/_shared/prop-naming.json)
- table-columns: columns; approved; Table (propNaming[] · skills/_shared/prop-naming.json)
- table-rows: rows; approved; Table (propNaming[] · skills/_shared/prop-naming.json)
- table-sort: sort; approved; Table (propNaming[] · skills/_shared/prop-naming.json)
- terminal-caret: caret; approved; TerminalCardRow (propNaming[] · skills/_shared/prop-naming.json)
- thumbnail-badge: badge; approved; SelectTileOption (propNaming[] · skills/_shared/prop-naming.json)
- time-unit-labels: units; approved; Countdown (propNaming[] · skills/_shared/prop-naming.json)
- tooltip-content: content; approved; Tooltip, WebTemplate (propNaming[] · skills/_shared/prop-naming.json)
- top-bar-content-width: contentWidth; approved; TopBar (propNaming[] · skills/_shared/prop-naming.json)
- top-bar-initial-background: initialBackground; approved; TopBar (propNaming[] · skills/_shared/prop-naming.json)
- trailing-actions: actions; approved; AlertDialogContent, DialogContent, ModuleCard, Notice, PageHeader, PreviewFrame, Toast, WebSection (propNaming[] · skills/_shared/prop-naming.json)
- trailing-arrow: arrow; approved; Link (propNaming[] · skills/_shared/prop-naming.json)
- trailing-text-accent: accent; approved; ChapterBreak, Closing, Heading, Hero, LabStage, PullQuote, SectionHeader, Text (propNaming[] · skills/_shared/prop-naming.json)
- transient-highlight: highlighted; approved; Stat, Timeline (propNaming[] · skills/_shared/prop-naming.json)
- unavailable-measurement-message: unavailableText; approved; Countdown, Gauge, GaugeGroupRing, Stat (propNaming[] · skills/_shared/prop-naming.json)
- value-context: delta; approved; Stat (propNaming[] · skills/_shared/prop-naming.json)
- value-readout: readout; approved; Field (propNaming[] · skills/_shared/prop-naming.json)
- viewport-max-height: maxHeight; approved; Table (propNaming[] · skills/_shared/prop-naming.json)
- visual-treatment: variant; approved; Badge, Button, ButtonGroup, DialogContent, Dropzone, Heading, IconButton, Indicator, Input, Label, Link, ListItem, Logo, MeterRow, ModuleCard, Panel, PhotoFrame, PreviewFrame, ProgressBar, ProjectCard, PullQuote, ScrollReveal, SectionHeader, Skeleton, SocialLinks, Table, Tabs, Text, Textarea, Timeline (propNaming[] · skills/_shared/prop-naming.json)
- visually-hidden-label: hideLabel; approved; Field, Table (propNaming[] · skills/_shared/prop-naming.json)
- web-section-body-slot: body; approved; WebSection (propNaming[] · skills/_shared/prop-naming.json)
- zone-change: onZoneChange; approved; HomeTemplate (propNaming[] · skills/_shared/prop-naming.json)

## Other tokens

| Name | Value | Group | Usage | Source |
| --- | --- | --- | --- | --- |
| --ambient-angle | 315 | root |  | tokens[] · packages/tokens/src/theme.css |
| --ambient-cycle | 10s | root |  | tokens[] · packages/tokens/src/theme.css |
| --ambient-glow-opacity | 0.1 | root |  | tokens[] · packages/tokens/src/theme.css |
| --ambient-line-count | 70 | root |  | tokens[] · packages/tokens/src/theme.css |
| --ambient-speed | 1 | root |  | tokens[] · packages/tokens/src/theme.css |
| --ambient-square-count | 90 | root |  | tokens[] · packages/tokens/src/theme.css |
| --ambient-square-size-max | 28px | root |  | tokens[] · packages/tokens/src/theme.css |
| --ambient-square-size-min | 6px | root |  | tokens[] · packages/tokens/src/theme.css |
| --animate-pulse | pulse 2s var(--ease-snappy) infinite | theme |  | tokens[] · packages/tokens/src/theme.css |
| --animate-spin | spin 1s linear infinite | theme |  | tokens[] · packages/tokens/src/theme.css |
| --border-width | 1px | root |  | tokens[] · packages/tokens/src/theme.css |
| --border-width-invalid | 2px | root |  | tokens[] · packages/tokens/src/theme.css |
| --bp-lg | 1260px | root |  | tokens[] · packages/tokens/src/theme.css |
| --bp-md | 960px | root |  | tokens[] · packages/tokens/src/theme.css |
| --bp-sm | 520px | root |  | tokens[] · packages/tokens/src/theme.css |
| --breakpoint-section-header-split | 860px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --container-calendar-grid-stack | 960px | theme |  | tokens[] · packages/tokens/src/theme.css |
| --container-quote-pull | 40ch | theme |  | tokens[] · packages/tokens/src/theme.css |
| --content-max | 1024px | root |  | tokens[] · packages/tokens/src/theme.css |
| --delay-popover | 2s | root |  | tokens[] · packages/tokens/src/theme.css |
| --effect-grid-opacity | 0.025 | root |  | tokens[] · packages/tokens/src/theme.css |
| --effect-grid-size | 32px | root |  | tokens[] · packages/tokens/src/theme.css |
| --focus-offset | 2px | root |  | tokens[] · packages/tokens/src/theme.css |
| --focus-width | 2px | root |  | tokens[] · packages/tokens/src/theme.css |
| --gutter | clamp(12.8px, 3.2vw, 32px) | root |  | tokens[] · packages/tokens/src/theme.css |
| --icon-size | 16px | root |  | tokens[] · packages/tokens/src/theme.css |
| --icon-stroke | 1.75 | root |  | tokens[] · packages/tokens/src/theme.css |
| --logo-red | #E91B35 | root |  | tokens[] · packages/tokens/src/theme.css |
| --logo-red-shade | #800C1D | root |  | tokens[] · packages/tokens/src/theme.css |
| --mask-section-fade-both | linear-gradient(180deg, transparent, #000 clamp(96px, 14vh, 180px), #000 calc(100% - clamp(96px, 14vh, 180px)), transparent) | root |  | tokens[] · packages/tokens/src/theme.css |
| --mask-section-fade-bottom | linear-gradient(0deg, transparent, #000 clamp(96px, 14vh, 180px)) | root |  | tokens[] · packages/tokens/src/theme.css |
| --mask-section-fade-top | linear-gradient(180deg, transparent, #000 clamp(96px, 14vh, 180px)) | root |  | tokens[] · packages/tokens/src/theme.css |
| --nav-height | 54.4px | root |  | tokens[] · packages/tokens/src/theme.css |
| --section-min-height | 100dvh | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-0 | 0px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-1 | 3.2px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-10 | 32px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-12 | 38.4px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-14 | 44.8px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-16 | 51.2px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-2 | 6.4px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-20 | 64px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-24 | 76.8px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-3 | 9.6px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-4 | 12.8px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-5 | 16px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-6 | 19.2px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-7 | 22.4px | root |  | tokens[] · packages/tokens/src/theme.css |
| --space-8 | 25.6px | root |  | tokens[] · packages/tokens/src/theme.css |
| --spacing | var(--space-1) | inline |  | tokens[] · packages/tokens/src/theme.css |
| --tilt-max | 6deg | root |  | tokens[] · packages/tokens/src/theme.css |
