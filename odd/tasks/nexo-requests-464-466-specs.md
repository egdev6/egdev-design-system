# Nexo requests #464–#466 — spec batch

Spec amendments for three Nexo requests opened after the 0.2.0 release: #464 Tabs segmented outline, #465 ColorSwatchGroup neutral ring, #466 Dialog stacked header spacing. Specs first, owner approval, then one plan and one PR per issue. No token/dependency changes, no GitHub writes in this batch.

## Specs

- S1: Flow, verbatim owner choice: "One spec batch, then a PR per issue" ("Same flow as milestone #14: spec amendments in one branch, then one plan and one PR per issue.").
- S2: Each spec follows `skills/component-spec-proposer/SKILL.md` (seven blocks, shared English schema `skills/_shared/component-spec-template.md`, prop-naming registry lookup, acceptance matrix mapped to checks), is saved as **Draft — not approved**, and lives at `docs/components/<kebab-name>/v<next>/<topic>-amendment.md` (existing amendment convention, e.g. `docs/components/tabs/v0.2/`).
- S3: #464 Tabs, verbatim owner choice: "Opt-in variant selectedTone" ("'tint' stays the default (the #426 decision); Nexo opts into 'outline'. Quorb is unaffected."). Issue acceptance criteria, verbatim: "`selectedTone="outline"` reproduces the brand border plus chip-active sheen over surface-1 with the edge shadow, using semantic roles that follow the runtime accent." / "The default rendering does not change." / "Contrast and focus remain WCAG-compliant in both tones." / "Stories and tests cover both tones." Scope: "Only the selected state's surface, border and shadow. The other tab states, the `fullWidth`/`labelWrap` behaviour and keyboard handling stay as they are."
- S4: #465 ColorSwatchGroup, verbatim owner choice: "Neutral as the default, no prop" ("Fixes the red preset clash for every consumer and adds no API."). Issue acceptance criteria, verbatim: "With the neutral style, the selected swatch shows a surface gap plus an `fg-default` ring, readable on every preset including red, and the focus ring stays distinct." / "Stories and tests cover the style." Issue: "The same treatment should apply to the custom-colour swatch." Scope: "Only the selected and focus indicators. The options, the custom colour input, the `<output>` and the RadioGroup semantics stay as they are." The spec flags the default change as a visible contract change with its impact (only consumer today: Nexo).
- S5: #466 Dialog, verbatim owner choice: "Fix the default" ("Measure in the browser first, then tighten title to description (space-1/2). No prop."). Issue acceptance criteria, verbatim: "In the stacked layout, the description sits close below the title, like a subtitle." / "The inline layout is unchanged." / "The stories show both layouts with a long title." Applies to Dialog and AlertDialog stacked header. Scope: "Only the vertical spacing inside the stacked header. The inline layout, the header-to-body spacing and the dismiss button position stay as they are."
- S6: Owner instruction, verbatim: "en cada entrega enséñame storybook para verificar". Every delivery (this spec batch included) ends with Storybook running and the exact story URLs to check; the parent stops for the owner's visual verification before the next delivery.
- S7: Every spec ends with planned checks and resolved/remaining decisions; nothing is marked implemented. Spec approval does not authorize code: each implementation plan needs separate approval.

## Tasks

| ID | Specs | Issue | Route | Surfaces | Commit |
| --- | --- | --- | --- | --- | --- |
| T1 | S2, S3, S7 | #464 | worker A | `docs/components/tabs/v0.3/**` | — |
| T2 | S2, S4, S7 | #465 | worker B | `docs/components/color-swatch-group/v0.2/**` | — |
| T3 | S2, S5, S7 | #466 | worker C | `docs/components/dialog/v0.3/**`, `docs/components/alert-dialog/**` | — |
| T4 | S1, S6 | all | parent | commit, Storybook baseline URLs, owner review | — |

## Log

- L1 (owner, verbatim): "tenemos nuevas peticiones de Nexo, revisemos"
- L2: Owner decisions (question answers, verbatim labels): #464 "Opt-in variant selectedTone (Recommended)"; #465 "Neutral as the default, no prop (Recommended)"; #466 "Fix the default (Recommended)"; delivery "One spec batch, then a PR per issue (Recommended)".
- L3 (owner, verbatim): "en cada entrega enséñame storybook para verificar"
- L4: Evidence: segmented active fill at `packages/ui/src/molecules/tabs/types.ts:155-157` (`before:bg-border-brand` + `bg-state-selected-surface` + sheen + edge-strong); Dialog `stacked` variant is `flex flex-col items-start` with no gap (`packages/ui/src/molecules/dialog/types.ts:140`), so the visible gap comes from margins/line-height and must be measured in a browser.
