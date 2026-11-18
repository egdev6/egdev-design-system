# Link v0.4 — text underline at rest, removed on hover

- **Canonical issue:** [#61](https://github.com/egdev6/egdev-design-system/issues/61); publish this delta as a comment, not a body replacement.
- **Previous snapshot:** v0.3 [contract](../v0.3/spec.md) and [implementation plan](../v0.3/implementation-plan.md) (opt-in `underlined` variant, owner approval [#61 comment 6576886041](https://github.com/egdev6/egdev-design-system/issues/61#issuecomment-6576886041)); v0.2 [amendment](../v0.2/amendment.md); v0.1 [implementation evidence](../v0.1/implementation.md).
- **Request:** T1/S1–S5 in [link-underline-hover](../../../../odd/tasks/link-underline-hover.md), Specs and Log L1–L3.
- **Status:** Approved — 2026-11-18 by the owner (decisions in odd/tasks/link-underline-hover.md L3); implementation in the same PR.
- **Snapshot identity:** `version: 0.4`; `contentSHA256: see the hash definition (computed by the parent before publication)`; `visualHashes: Pending (Storybook check by the owner, T2)`; `approvalReference: odd/tasks/link-underline-hover.md#log (L3)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/61`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings including the final newline; tracking metadata is excluded.

## 1. Purpose and scope

Change the default look of the existing standalone navigation atom: every Link gets a text underline at rest, and hover removes it instead of changing the colour. This is a design adjustment of Link, not a new component or variant. All unmodified v0.1–v0.3 promises remain in force, except where this amendment replaces them (the borderless default from v0.2 and the opt-in `underlined` hairline from v0.3).

Owner decisions, verbatim:

- S1 (request): "un ajuste de diseño. en l componente link podemos cambiar el diseño? sería el estado inicial como está pero añadirle underline y al hacer hover sigue la animación de la flecha pero en vez de cambiar color le quitamos el underline"
- S2 (scope): "Change the default look; retire 'underlined' (Recommended)" ("Every Link gets it. The 'underlined' variant becomes redundant: keep it as a deprecated alias of the default (no breaking change) and remove it in a later major.").
- S3 (treatment): "Text underline in the link color (Recommended)" ("text-decoration underline with offset, same color as the text; standard and follows the accent.").

Non-goals: new tokens, dependencies or stylesheets; changes to the arrow glyph, its motion or the reduced-motion fallback; changes to the focus ring; edits to the legacy `.eg-link` CSS; removing the `underlined` value now.

## 2. Anatomy and composition

Unchanged: native anchor root, or a single anchor-compatible child through Radix Slot/Slottable; decorative `Icon name='arrow-right' size='sm'`; Radix VisuallyHidden new-tab notice. `eg-link` remains the stable public root; no new public parts or exports.

## 3. Public API

No public prop is added, removed or renamed, and no type narrows:

| Prop | Contract |
| --- | --- |
| `variant` | `LinkVariant = 'plain' \| 'underlined'`, default `plain`. `plain` is the only treatment. `underlined` is **deprecated**: an alias that renders exactly the same classes as `plain`. The type keeps the value, so existing consumers compile and render unchanged in behaviour. |

The deprecation is documented in the `variant` prop description and on the `underlined` CVA branch. The prop itself carries no `@deprecated` tag, because only one value is deprecated, not the axis. A runtime value outside the union still resolves to `plain`. All other props (`children`, `asChild`, `href`, `external`, `newTabText`, `arrow`) are unchanged. Registry mappings are unchanged; `atoms/link/types.ts` bytes change, so the parent refreshes the registry's reviewed whole-file hashes.

## 4. Behavior

- **Rest:** the current look (font, size, `text-link-default`, centered arrow) plus a text underline in the link colour, offset by a space token.
- **Hover:** the arrow keeps its `translate-x-1` motion; the colour does **not** change (no `hover:text-link-hover`); the underline is removed.
- **Focus-visible:** the `--shadow-focus` ring is unchanged.
- **Reduced motion:** unchanged; the arrow does not move and transitions are suppressed. Removing the underline is an instant state change, not motion.
- `variant="underlined"` behaves exactly like the default.
- External rel deduplication, target normalization, notice localization, arrow omission, events, refs and navigation are unchanged.

## 5. Accessibility

WCAG 2.2 SC 1.4.1 (Use of Color): the underline identifies the link without relying on colour alone, which matters wherever a Link sits near body text of a similar hue or luminance. Hover still produces a visible, non-colour change (the underline disappears and the arrow moves), so pointer feedback no longer depends on the colour shift that v0.2 used. Native Tab/Enter, the hidden decorative arrow, the new-tab notice and the focus ring are unchanged. No live region, custom keyboard handling or disabled API is added.

## 6. Appearance and implementation boundary

- Root utilities add `underline underline-offset-(--space-1) hover:no-underline` and drop `no-underline` and `hover:text-link-hover`. The underline uses the default `currentColor`, so it follows `text-link-default`; the offset reads the `--space-1` token (no raw pixel offset), and the thickness is the font default.
- `pb-0 border-0` now applies to both `plain` and `underlined` (one shared recipe), so the retained legacy bottom border and padding never paint. The v0.3 branch (`border-b border-border-brand pb-0.5 hover:border-state-selected`) is removed.
- Legacy CSS check: `.eg-link` in `packages/ui/src/styles/legacy/bundle.css` sets `text-decoration:none`, a 1px brand `border-bottom`, `padding-bottom:2px` and a hover colour/border colour. The bundle is imported into `@layer components`, so the utilities layer wins: `underline` overrides `text-decoration:none`, `text-link-default` overrides the legacy hover colour, and `border-0 pb-0` reset the border and padding. The legacy file is not edited.
- `--color-link-hover` is no longer referenced by Link. The token is not changed or removed here.
- Arrow utilities (`linkArrowVariants`) stay byte-identical. **No stylesheet**, additional internal module, token or dependency.

### Visual evidence

No v0.4 screenshot or browser measurement exists yet: **visual: not evaluated**. The parent checks the rest, hover, focus and reduced-motion states of Default, External, WithoutArrow, AsChild, States and Underlined in Chrome and Storybook with the owner (T2). The v0.3 captures show the removed hairline and remain historical.

## 7. Acceptance criteria

| ID | Promise | Evidence / review |
| --- | --- | --- |
| L4-01 | Rest: underline in the link colour with a token offset; colour, font and arrow unchanged | Link unit/hook assertions; package CSS pins; browser appearance pending. |
| L4-02 | Hover: underline removed, colour unchanged, arrow motion unchanged | CVA assertions (`hover:no-underline`, no `hover:text-*`, arrow classes unchanged); browser pending. |
| L4-03 | Focus ring and reduced motion unchanged | Existing and extended utility assertions. |
| L4-04 | `underlined` renders exactly like the default; type still accepts it | Class-equality tests at CVA, hook and DOM level; typed test usage; packed-consumer fixture. |
| L4-05 | Deprecation documented without deprecating the prop | Docgen description assertion; no `deprecated` tag on `variant`; stories. |

## 8. Deprecation plan for `underlined`

1. **This release (minor):** `underlined` stays in `LinkVariant` and the Controls select, renders exactly like `plain`, and is documented as deprecated in the prop description, the CVA branch and the Underlined story. No consumer breaks.
2. **Consumers:** existing `variant="underlined"` call sites (NowCard, ProjectCard and CommunityCard stories and tests, plus packed-consumer fixtures) keep working and should drop the prop when next touched. New code omits `variant`.
3. **Next major:** remove `'underlined'` from `LinkVariant`, its CVA branch and the Underlined story, and decide whether the `variant` axis remains at all. That removal needs its own spec amendment, registry update and changelog entry.
