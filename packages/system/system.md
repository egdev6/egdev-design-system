## Composition guide

Start with an existing organism; otherwise use a molecule; otherwise compose molecules and atoms and propose a new organism.
Propose a new atom for anything that could be an atom or repeats across pieces. Follow docs/CATALOGACION.md: reuse → variant → compose → extract → new; record what was inspected and why earlier choices do not suffice. The agent proposes; the owner decides.
Map each template, section, organism and molecule approximation in the artboard with `data-component="Name"` (for example `data-component="WebTemplate"` and `data-component="WebSection"`). These markers do not render React.
Mark missing pieces with `data-proposal="organism:Name"` or `data-proposal="atom:Name"` and add an artboard note describing the need, reused pieces and cataloging rationale. Proposals are not approved components.
Use the catalog descriptions, source-derived Composes lists, parts and documented props/children as slots. These are static source facts, not an exhaustive runtime composition or permission to invent slots.

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
    - appShellRootVariants base: font-sans → --font-sans
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
    - sectionShellVariants base: pt-[calc(var(--nav-height)+var(--space-8))] → --nav-height, --space-8
    - sectionShellVariants base: pb-8 → --spacing-8
    - sectionShellVariants base: shadow-none → unresolved
    - sectionShellWrapVariants base: px-[var(--gutter)] → --gutter
  - children: ReactNode; Host-supplied content in reading order. (components[] · packages/ui/src/templates/section-shell/types.ts)
  - register: enum; Coordinated visual register for this section. (components[] · packages/ui/src/templates/section-shell/types.ts)
  - wrap: boolean; Supply a centered content wrapper with page gutters; disable for self-wrapped content. (components[] · packages/ui/src/templates/section-shell/types.ts)
### WebTemplate
catalog[] · docs/catalog.json · @egdev/ui · template · —
- WebTemplate (components[] · packages/ui/src/templates/web-template/types.ts)
  - Catalog composition / slots: Consumer-supplied TopBar, content and Footer (catalog[] · docs/catalog.json)
  - Composes: Button (packages/ui/src/templates/web-template/WebTemplate.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
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
    - sectionNavLinkVariants base: gap-3 → --spacing-3
    - sectionNavLinkVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - sectionNavListVariants base: p-0 → --spacing-0
    - sectionNavNextVariants base: focus-visible:shadow-[var(--shadow-focus)] → --shadow-focus
    - sectionNavPillVariants base: px-4 → --spacing-4
    - sectionNavPillVariants base: [@media(width<=520px)]:px-3 → --spacing-3
    - sectionNavRootVariants base: gap-0 → --spacing-0
    - sectionNavTriggerVariants base: gap-3 → --spacing-3
    - sectionNavTriggerVariants base: p-0 → --spacing-0
    - sectionNavTriggerVariants base: font-sans → --font-sans
    - sectionNavTriggerVariants base: text-body-default → --text-body-default
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
  - Catalog composition / slots: Consumer-supplied brand, search, user and mobile controls (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - TopBarBrand: Consumer-supplied named home link. Children: Each part accepts a single consumer-owned named link or control. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarMobileTrigger: Consumer-supplied mobile dialog trigger. Children: Each part accepts a single consumer-owned named link or control. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarSearchCompact: Compact search launcher. Children: Each part accepts a single consumer-owned named link or control. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarSearchFull: Full-width search launcher. Children: Each part accepts a single consumer-owned named link or control. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - TopBarUserMenu: Consumer-supplied account control. Children: Each part accepts a single consumer-owned named link or control. Consumer-supplied content. (components[].parts · packages/ui/src/organisms/top-bar/TopBar.tsx)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: text-label-default → --text-label-default
    - topBarLinkVariants base: after:rounded-full → --radius-full
    - topBarLinkVariants base: aria-[current=page]:after:shadow-glow-base → --shadow-glow-base
    - topBarListVariants base: gap-4 → --spacing-4
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
  - children: ReactNode; Direct TopBar parts, optionally wrapped in fragments; one brand is required. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - data-state: enum; Host-selected native presentation state; absence is transparent. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - items: TopBarItem[]; Ordered destinations, including an empty list when appropriate. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - label: string; Non-empty localized page navigation landmark name. (components[] · packages/ui/src/organisms/top-bar/types.ts)
  - onNavigate: ((item: TopBarItem, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void); Notifies a native link click; the host may prevent default. (components[] · packages/ui/src/organisms/top-bar/types.ts)
### WebSection
catalog[] · docs/catalog.json · @egdev/ui · organism · —
- WebSection (components[] · packages/ui/src/organisms/web-section/types.ts)
  - Catalog composition / slots: Consumer-supplied header, media, body, actions and social slots (catalog[] · docs/catalog.json)
  - Composes: No public JSX composition statically extracted.
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - No statically extracted anatomy.
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
    - navListCaptionVariants base: font-display → --font-display
    - navListCaptionVariants base: text-meta → --text-meta
    - navListCountVariants base: text-label-default → --text-label-default
    - navListLinkVariants base: gap-3 → --spacing-3
    - navListLinkVariants base: px-3 → --spacing-3
    - navListLinkVariants base: py-1.5 → --spacing
    - navListLinkVariants base: rounded-md → --radius-md
    - navListLinkVariants base: font-sans → --font-sans
    - navListLinkVariants base: text-label-default → --text-label-default
    - navListListVariants base: p-0 → --spacing-0
    - navListListVariants base: gap-0.5 → --spacing
    - navListMetadataVariants base: gap-2 → --spacing-2
    - navListTriggerVariants base: gap-2 → --spacing-2
    - navListTriggerVariants base: px-3 → --spacing-3
    - navListTriggerVariants base: rounded-md → --radius-md
    - navListTriggerVariants base: text-left → unresolved
    - navListTriggerVariants base: font-display → --font-display
    - navListTriggerVariants base: text-meta → --text-meta
    - navListTriggerVariants base: focus-visible:shadow-focus → --shadow-focus
    - navListVariants base: font-sans → --font-sans
    - surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }) · packages/ui/src/molecules/nav-list/useNavList.ts; see Surface anatomy
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
    - surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }) · packages/ui/src/molecules/nav-list/useNavList.ts; see Surface anatomy
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
    - surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }) · packages/ui/src/molecules/nav-list/useNavList.ts; see Surface anatomy
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
    - topBarLinkVariants base: text-label-default → --text-label-default
    - topBarLinkVariants base: after:rounded-full → --radius-full
    - topBarLinkVariants base: aria-[current=page]:after:shadow-glow-base → --shadow-glow-base
    - topBarListVariants base: gap-4 → --spacing-4
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
### TopBarMobileTrigger
- TopBarMobileTrigger (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: text-label-default → --text-label-default
    - topBarLinkVariants base: after:rounded-full → --radius-full
    - topBarLinkVariants base: aria-[current=page]:after:shadow-glow-base → --shadow-glow-base
    - topBarListVariants base: gap-4 → --spacing-4
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
### TopBarSearchCompact
- TopBarSearchCompact (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: text-label-default → --text-label-default
    - topBarLinkVariants base: after:rounded-full → --radius-full
    - topBarLinkVariants base: aria-[current=page]:after:shadow-glow-base → --shadow-glow-base
    - topBarListVariants base: gap-4 → --spacing-4
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
### TopBarSearchFull
- TopBarSearchFull (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: text-label-default → --text-label-default
    - topBarLinkVariants base: after:rounded-full → --radius-full
    - topBarLinkVariants base: aria-[current=page]:after:shadow-glow-base → --shadow-glow-base
    - topBarListVariants base: gap-4 → --spacing-4
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
### TopBarUserMenu
- TopBarUserMenu (components[] · packages/ui/src/organisms/top-bar/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - topBarLinkVariants base: text-label-default → --text-label-default
    - topBarLinkVariants base: after:rounded-full → --radius-full
    - topBarLinkVariants base: aria-[current=page]:after:shadow-glow-base → --shadow-glow-base
    - topBarListVariants base: gap-4 → --spacing-4
    - topBarListVariants base: p-0 → --spacing-0
    - topBarRowVariants base: gap-4 → --spacing-4
    - topBarRowVariants base: px-[var(--gutter)] → --gutter
    - topBarVariants base: shadow-none → unresolved
    - topBarVariants base: data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] → --shadow-edge-strong, --shadow-elev-3
### appShellVariants
- appShellVariants (components[] · packages/ui/src/templates/app-shell/types.ts · @egdev/ui)
  - Visual anatomy (source classes; unresolved is not a guessed value):
    - appShellRootVariants base: font-sans → --font-sans
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
    - navListCaptionVariants base: font-display → --font-display
    - navListCaptionVariants base: text-meta → --text-meta
    - navListCountVariants base: text-label-default → --text-label-default
    - navListLinkVariants base: gap-3 → --spacing-3
    - navListLinkVariants base: px-3 → --spacing-3
    - navListLinkVariants base: py-1.5 → --spacing
    - navListLinkVariants base: rounded-md → --radius-md
    - navListLinkVariants base: font-sans → --font-sans
    - navListLinkVariants base: text-label-default → --text-label-default
    - navListListVariants base: p-0 → --spacing-0
    - navListListVariants base: gap-0.5 → --spacing
    - navListMetadataVariants base: gap-2 → --spacing-2
    - navListTriggerVariants base: gap-2 → --spacing-2
    - navListTriggerVariants base: px-3 → --spacing-3
    - navListTriggerVariants base: rounded-md → --radius-md
    - navListTriggerVariants base: text-left → unresolved
    - navListTriggerVariants base: font-display → --font-display
    - navListTriggerVariants base: text-meta → --text-meta
    - navListTriggerVariants base: focus-visible:shadow-focus → --shadow-focus
    - navListVariants base: font-sans → --font-sans
    - surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }) · packages/ui/src/molecules/nav-list/useNavList.ts; see Surface anatomy
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
