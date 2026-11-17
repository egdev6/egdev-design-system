# Text body recipes + foreground (#396)

Implement the APPROVED Text v0.2 amendment, read from `/home/egdev/proyectos/eds-wt-c/docs/components/text/v0.2/body-tone-amendment.md` (it lands on main via PR #442; do NOT copy or edit it in this branch). Every open decision resolves to its **Recommended** option (its "Approval" section; owner delegation in `odd/tasks/milestones-1-2-delivery.md` L1). Branch `feat/text-body-foreground` (worktree `../eds-wt-d`), one PR, Closes #396.

## Specs

- S1: `TextVariant` adds `'body' | 'body-large' | 'lede'` (internal `TextBodyVariant`); export `TextForeground = 'inherit' | 'default' | 'secondary' | 'muted' | 'warning' | 'danger' | 'on-flood'` (also from `packages/ui/src/index.ts`). Body branch of `TextVisualProps`: `{ variant: TextBodyVariant; foreground?: TextForeground; tone?: never; accent?: never; accentBreak?: never }`; other branches get `foreground?: never`. JSDoc in English; `@default inherit` only on the body branch; `@control select`.
- S2: Existing `textVariantClasses`/`textVariants` are untouched (eyebrow/display classes byte-identical; artifact `typographyRoles` and drift fixture stable). New separate CVA `textBodyVariants`: base `eg-text m-0 font-sans [&_strong]:[font-weight:var(--text-heading-small--font-weight)]`; variant `body: text-body-default`, `body-large: text-body-large`, `lede: text-body-muted`; foreground `inherit: ''`, `default: text-fg-default`, `secondary: text-fg-secondary`, `muted: text-fg-muted`, `warning: text-status-warning`, `danger: text-status-danger`, `on-flood: text-fg-on-flood`; default `inherit`. Body never gets `font-display`, `uppercase`, `wrap-break-word` or `inline-flex`. Existing tokens only.
- S3: `useText.ts`: body names in `textVariantNames`; destructure `foreground` (never on DOM); invalid/untyped → `inherit`; ignored on old variants; accent forced undefined for body. `Text.tsx` unchanged except JSDoc.
- S4: Tests first (RED before GREEN) via the public interface: recipes per body variant (element `P`, classes present/absent, Slot keeps whitespace and `lang`); `strong` emphasis kept in order with the root arbitrary class; foreground map (7 values), omitted → no color class, untyped `'bogus'` → inherit, attribute never on DOM, rerender, warning/danger add no role/aria-live/tabindex; JS boundary (untyped tone/accent on body → no accent span; untyped foreground on old variants ignored); preservation: class strings of old variants equal pre-change `textVariants(...)` output, Heading class hash unchanged, existing tests green.
- S5: Docgen/controls (`storybook-docgen.test.ts`, `storybook-controls.test.ts`: `foreground` select, 7 options, default `inherit`; Heading has none), package exports (`TextForeground` in sorted names), packed consumer (positive body/foreground fixtures; `@ts-expect-error` for tone/accent on body and foreground on section/eyebrow/inverse; SSR; shipped CSS has `.text-body-large`, `.text-status-warning`, `.text-fg-on-flood`, the escaped `[&_strong]` rule). Stories `BodyRecipes`, `Emphasis`, `ForegroundMatrix` (surfaces 0–3, flood with inherit/on-flood), `StatusCopy`, `BodyAsChild`, `BodyLongText`; no argTypes/play.
- S6: Registry: Text usage + scoped exception `exception:surface-material-tone:Text:foreground` (shape like SectionNav's), Text `variant` usage type updated under `visual-treatment`, refresh all Text/Heading whole-file revisions, approval record `docs/components/text/v0.2/foreground-exception-approval.json`, `pnpm props:docs`. Catalog note (`scripts/catalog_data.py`) + `build_catalog.py`. System artifact: `pnpm artifact --write && pnpm system:docs` (system.md TextProps rows go stale). Evidence `docs/components/text/v0.2/implementation.md` with the amendment content SHA-256 (computed from the wt-c file) and approval reference.
- S7: No stylesheet, no new module, no new tokens, no dependencies. If a foreground fails 4.5:1 contrast on a supported surface, do NOT change tokens — report it for the owner.

## Tasks

| ID | Specs | Route |
| --- | --- | --- |
| T1 | S1–S7 | gentle-ai-worker |
| T2 | S2 | parent: Chrome/Edge/Firefox (computed font, sizes, contrast per surface), captures |
| T3 | all | parent: full checks, PR, CI, merge |

## Log

- L1: Plan by explorer, approved by the parent applying recommendations (delegation L1 in the main tracking doc). Header "Pending" fields of the amendment are left to PR #442's file; the hash is recorded in implementation.md.
- L2: Parent browser check (Chrome/Edge/Firefox): all foregrounds ≥4.5:1 on surface-0…3 and flood (min 4.82), recipes and strong as specified; capture recorded.
