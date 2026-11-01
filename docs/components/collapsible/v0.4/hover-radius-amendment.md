# Collapsible v0.4 — open-state hover radius amendment

- **Status:** Implemented in this worktree (branch `fix/222-notice-collapsible`); owner confirmation of the visual result is pending. Static recipe change only; no runtime/browser verdict is claimed (Storybook was not running).
- **Owner quote (issue #222 / S11, review 2026-11-01):** "Revisar efector hover cuando está desplegado (se ven los bordes inferiores redondeados)"
- **Canonical bases:** frozen [v0.2 spec](../v0.2/spec.md) and plan, plus the [v0.3 Radix relationship amendment](../v0.3/radix-relationship-amendment.md) (proposed there; relationship promises are not touched by this delta). No base is rewritten or re-hashed.

## Root cause

The Trigger reuses the ghost/md Button recipe (`useCollapsibleTrigger`), which paints a hover background (`bg-surface-2` + sheen + edge shadow) inside the Button's `rounded-md` on every corner. While open, the Trigger sits directly above the Content with its top hairline, so the hover paint's rounded **bottom** corners read as a detached pill instead of the top section of the frame.

## Changed promise

`collapsibleTriggerVariants` (`packages/ui/src/molecules/collapsible/types.ts`) adds `data-[state=open]:rounded-b-none`, selected by the native Radix `data-state` attribute already owned by the Trigger. Closed state keeps the full ghost radius; open state keeps the hover paint but its bottom corners stay square so the highlight stays visually attached to the content below it. No state is mirrored into classes; the attribute remains the single source.

## Unchanged

No public API, prop, ARIA/relationship behavior (including the v0.3 open-only `aria-controls` promise), disabled/presence policy, Surface frame, token value, dependency, file surface or stylesheet change. The ghost hover paint, focus ring, press and reduced-motion rules are untouched. No new tokens or recipe copies: the Radius override is a static Tailwind data-variant utility on the existing recipe.

## Test evidence (Vitest, jsdom recipe assertions; no browser claims)

- RED: 1 focused test failed before the change (missing `data-[state=open]:rounded-b-none` on the Trigger).
- GREEN: `packages/ui/src/molecules/notice`, `packages/ui/src/molecules/collapsible`, `packages/ui/src/lib` — 27 files, 483 tests passed, including the pre-existing Trigger class assertions (`eg-btn`, ghost recipe, closed/open `data-state`) and the root Surface `rounded-md` assertions.
