# Scene recipes v0.1 — About and Community (documented compositions, no export)

**Status: verified.** The owner approved this delivery route verbatim (tracking L41): "Recetas documentadas, sin export (Recomendado)". The About (PhotoFrame + PullQuote + TerminalCard) and Community (CommunityCard grid) scenes stay documented recipes, like MobileMenu, CommunityGrid and ProjectsGrid; layer (e) exports only the approved slot scenes Hero, ChapterBreak, LabStage and Closing.

## Quick path

1. Read the composition tables below; nothing here is a new component, prop, token, dependency or effect.
2. Open the live compositions: [About scene](/?path=/story/recipes-scene-recipes--about-scene) and [Community scene](/?path=/story/recipes-scene-recipes--community-scene) (`packages/ui/src/recipes/scene-recipes.stories.tsx`).
3. Copy the composition into your host and supply your own copy, media, marks and actions.

## About scene

A photo + quote split with a key/value card, the two reusable patterns the anatomy review recorded for this zone (tracking L3). All parts compose inside a `SectionShell` two-column split; the taller column sets the row height.

| Slot | Part | Recipe role |
|---|---|---|
| Section frame | `SectionShell` (`register='pro'` in the story) | Section frame and centered wrapper; the host owns the landmark name |
| Media | `PhotoFrame` `variant='framed'`, `ratio='landscape'` | Framed editorial image with caption |
| Statement | `PullQuote` (`pull`) | Editorial quotation with source caption |
| Facts | `TerminalCard` + `TerminalCardBar` + `TerminalCardList` | Named key/value profile card with status ink and caret |

## Community scene

A grid of two passive `CommunityCard`s stretched to equal height, so the pinned actions align at the bottom edge (the card's own documented behavior). One card shows a text-only `role="img"` wordmark mark with a primary `Button` action; the other shows an image mark with a secondary `Button` anchor action.

| Slot | Part | Recipe role |
|---|---|---|
| Section frame | `SectionShell` (`register='grafito'` in the story) | Tonal section frame; the register is the host's choice |
| Cards | `CommunityCard` `eyebrow` + `title` + body copy | Passive community card with display heading and tonal band |
| Mark | `CommunityCardMark` | One consumer-supplied non-interactive mark per card |
| Action | `CommunityCardAction` with `Button asChild size="lg"` anchors (at least 44px high) | The card's single interactive element |

## Host obligations

- The host owns section registers, heading identifiers and landmark names (`aria-label` or `aria-labelledby` on the `SectionShell`).
- The host supplies all copy, image sources and alternatives, marks and actions; no Pulso domain data is baked into any component.
- Every part keeps its own contract: outer layout only through `className`, one action per card, decorative media carries an explicit empty alternative, success rows keep readable condition text.
- A host that wants the About media to fill the split row's height can switch `PhotoFrame` to `ratio='auto'` under a definite-height host, as the PhotoFrame v0.4 contract documents.
- Story-only layout utilities used by the recipes are registered in `.storybook/preview.css` via `@source`, so they compile in Storybook without entering the production stylesheet.

## Boundaries

- **No export:** there is no `AboutScene`/`CommunityScene` component, no new public API and no barrel change.
- **No new design decisions:** no tokens, dependencies, effects or choreography; Material composition follows each part's approved recipe.
- **Recipes are not a migration path:** composing a scene does not grant approval to add variants or bypass component contracts.

## Checklist

- [x] The compositions render from delivered public API only (`SectionShell`, `PhotoFrame`, `PullQuote`, `TerminalCard`, `CommunityCard`, `Button`).
- [x] Each story reads as a small, proportionate scene: three parts (About) and two cards (Community).
- [x] No export, token, dependency or effect change accompanies this recipe.

## Next step

ER closes layer (e); HomeTemplate in @egdev/effects remains layer (f). Reference: `docs/components/web-catalog/v0.1/cataloging-draft.md` §4 and `docs/storybook/scene-recipes.mdx`.


## Observed verification

Parent Chromium 153 checks: About and Community render at 390, 768 and 1280px without page errors or horizontal overflow; image sources load. Both Community actions are native anchors composed with Button `size="lg"`, measuring 44.8px high at 390 and 1280px. An initial plain Link action measured only 16px; the recipe was corrected without changing Link. The Storybook MDX overview renders its title and recipe navigation.

Offline installation and package build passed. Root typechecking exceeded the 30-second command limit during effects after the UI check passed; the owner-authorized background rerun subsequently passed in 26 seconds. Lint and all 2533 Vitest tests passed. Screen readers and native zoom were not evaluated.
