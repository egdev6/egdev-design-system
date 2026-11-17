# Collapsible sibling actions (#408)

Implement the APPROVED Collapsible v0.5 amendment, read from `/home/egdev/proyectos/eds-wt-c/docs/components/collapsible/v0.5/actions-amendment.md` (lands on main via PR #442; do NOT copy or edit it in this branch). Every open decision resolves to its **Recommended** option. Branch `feat/collapsible-actions` (worktree `../eds-wt-f`), one PR, Closes #408.

## Specs

- S1: New `CollapsibleHeader` part (exported with `CollapsibleHeaderProps`): `<div>` with `children` (the Trigger/heading) and optional `actions` rendered as a sibling wrapper OUTSIDE the Trigger; props omit `style`, `role`, `tabIndex`; `@control false` with concrete reasons for ReactNode props. Header recipe `eg-collapsible__header flex flex-wrap items-center gap-2 [&>:first-child]:grow [&>:first-child]:basis-14 [&>:first-child]:min-w-14`; actions recipe `eg-collapsible__actions flex flex-initial flex-wrap max-w-full gap-2`. No header padding; the Trigger's open radius is unchanged (recommended).
- S2: Content: `padding?: 'sm' | 'md'` (`@default md`; md `p-4` unchanged, sm `p-2`) and `presence?: 'unmount' | 'keep-mounted'` (`@default unmount`; keep-mounted → internal `forceMount` + `data-[state=closed]:hidden`). Raw `forceMount`/`keepMounted` stay forbidden.
- S3: Trigger: `motion?: 'default' | 'none'` (`@default default`); none resets transition and active translate/scale (Button reset pattern) and the caret rotation; default output byte-identical; the direct `buttonVariants({variant:'neutral',size:'md'})` call is kept. Reduced-motion classes survive.
- S4: Tests first (RED before GREEN): actions outside the Trigger and toggle nothing (click/Enter/Space, aria-expanded unchanged; Root disabled keeps actions enabled); Tab order Trigger → actions → body; `actions={null}` renders no wrapper; without Header the DOM and class hash equal today; padding sm/md; keep-mounted closed: shell present with closed state and hidden class, reopen keeps state, `aria-controls` = shell id, unique ids; default still unmounts; motion none classes; types/exports (Header excludes style/role/tabIndex, presence closed set, raw forceMount type error); props never on DOM; all existing tests green.
- S5: Docgen/controls (Header part, new own props/defaults, property count), package exports (Header exported; hook/variants private; CSS has `p-2`, `data-[state=closed]:hidden`, motion-none selectors), packed consumer (typed samples, `@ts-expect-error` for forceMount/bad presence/style on Header, SSR keep-mounted). Stories `SiblingActions`, `NarrowActions`, `CompactContent`, `KeepMounted`, `NoMotion`, `Rtl`; extend `ReducedMotion`; update the "No forceMount" doc text; no argTypes/play.
- S6: Registry: Collapsible usages on `trailing-actions` and `inner-padding`; new conventions `disclosure-presence` and `disclosure-motion`; approval record `docs/components/collapsible/v0.5/prop-naming-approval.json`; refresh Collapsible whole-file revisions; `pnpm props:docs`. Catalog note (fix stale "ghost/md" → neutral/md) + `build_catalog.py`. System artifact: `pnpm artifact --write && pnpm system:docs`. Evidence `docs/components/collapsible/v0.5/implementation.md` with the amendment SHA-256; note that the eight Nexo consumer overrides (AC-08) are outside this repo.
- S7: No stylesheet, no new module, no tokens, no dependencies.

## Tasks

| ID | Specs | Route |
| --- | --- | --- |
| T1 | S1–S7 | gentle-ai-worker |
| T2 | S1–S3 | parent: Chrome/Edge/Firefox narrow actions, keep-mounted hidden from AT/Tab, motion none, RTL; captures |
| T3 | all | parent: full checks, PR, CI, merge |

## Log

- L1: Plan by explorer, approved by the parent applying recommendations (delegation L1 in the main tracking doc); header without padding; visual approval covered by the delegation.
- L2: Parent browser check (Chrome/Edge/Firefox): independent actions, narrow wrapping, keep-mounted hidden from layout and Tab, motion none, RTL; capture recorded.
