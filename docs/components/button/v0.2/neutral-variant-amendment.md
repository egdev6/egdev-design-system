# Button v0.2 — neutral variant amendment (replaces `ghost`)

## Owner approval

Visual review of Storybook on main (2026-11-01), recorded verbatim in `odd/tasks/visual-review-corrections.md`:

> "el muted no me convence. Creo más útil botón con los estilos grises vivibles y cambio de opacity en el hover (valorar cambio de nombre de variante)"

Owner decision on the variant name (questionnaire 2026-11-01, L2): **`neutral`** — visible grey plus opacity hover, replacing the reviewed treatment.

Owner mapping decision (2026-11-01, follow-up review of this amendment): **"Reemplazar ghost por neutral"** — Button has no variant named `muted`; the transparent low-emphasis treatment the owner reviewed is `ghost`. The owner chose the breaking rename option: remove `ghost` and add `neutral` on Button. IconButton is out of scope and keeps its own `ghost` variant. Unrelated `muted` tone values on ProgressBar, Gauge, MeterRow and GaugeGroup are unchanged.

## Breaking change

- `ButtonVariant` changes from `'primary' | 'secondary' | 'ghost' | 'dark'` to `'primary' | 'secondary' | 'neutral' | 'dark'`.
- `variant='ghost'` is removed. Passing it is a type error and renders no variant treatment at runtime. Every Button consumer must migrate `ghost` → `neutral`.

## New `neutral` treatment

Visible grey quiet action built from existing Material/neutral tokens; no new tokens:

- Rest: `bg-surface-2` with the `--gradient-sheen` light edge (`bg-[image:var(--gradient-sheen)]`), `border-border-hairline` separation, `shadow-(--shadow-edge)` and `text-fg-default`. The surface is visible at rest; it is not a ghost.
- Hover/active feedback is an opacity change only: `opacity-80` on hover and `opacity-70` on active for enabled states (`[&:not([aria-disabled=true])…]`), so the pressed scale/translate and the retained icon slide still come from the root recipe. `opacity` is appended to the variant's transition list (`--duration-fast` / `--ease-out`), and `motion-reduce:transition-none` from the root recipe disables the transition under reduced motion while the state change itself remains.
- Focus ring and disabled rules are unchanged: the root `focus-visible:[box-shadow:var(--shadow-focus)]` replaces the rest edge shadow, and root `data-disabled:opacity-45` plus pointer-events none still apply. Loading keeps the root `data-[state=loading]:opacity-100` because the hover selector excludes `aria-disabled`.

The recipe keeps the established Material pairing of a tonal surface, sheen light edge and hairline border (same tokens as the Chip and IconButton outline recipes). There is no stylesheet: the change is confined to the CVA recipe in `packages/ui/src/atoms/button/types.ts`.

## Migrated consumers

- `packages/ui/src/molecules/collapsible/useCollapsible.ts` — Trigger reuses `buttonVariants({ variant: 'neutral', size: 'md' })`.
- `packages/ui/src/molecules/notice` — actions in `Notice.stories.tsx` and `Notice.test.tsx`.
- `packages/ui/src/molecules/list-item` — `ListItem.stories.tsx` (three actions).
- `packages/ui/src/molecules/button-group` — `ButtonGroup.stories.tsx` cancel action.
- `packages/ui/src/atoms/button/Button.stories.tsx` — Variants story.
- Registry metadata: `skills/_shared/prop-naming.json` (ButtonVariant type and refreshed whole-file evidence revisions for `button/types.ts` and `notice/types.ts`) and the generated `docs/prop-naming.md`.

Carousel's `variant='ghost'` and Toast's dismiss IconButton are `IconButtonVariant` values and are intentionally unchanged.

## Evidence

Test-first sequence (focused `vitest run`, `--maxWorkers=2`):

1. RED: the new neutral recipe test failed against the unimplemented variant (element kept the ghost-less base recipe classes) and the docgen Button variant enum still reported `'ghost'`.
2. GREEN: after the rename, the focused run passed 160 tests across `Button.test.tsx`, `storybook-docgen.test.ts` and `Notice.test.tsx`.
3. `node scripts/prop-naming.mjs --check` passed after the registry refresh.

Visual conformity in a real browser is not evaluated here; owner review continues in Storybook.
