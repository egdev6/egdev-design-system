# Link v0.2 — borderless brand text and rightward arrow

- **Canonical issue:** [#61](https://github.com/egdev6/egdev-design-system/issues/61); publish this delta as a comment, not a body replacement.
- **Previous snapshot:** v0.1 in the canonical issue body; [approval record](https://github.com/egdev6/egdev-design-system/issues/61#issuecomment-6251446299), [implementation evidence](../v0.1/implementation.md).
- **Request:** [#175](https://github.com/egdev6/egdev-design-system/issues/175), T3/S3 in [component iteration](../../../../odd/tasks/component-iteration.md), Specs and Log L2.
- **Status:** amendment draft for parent publication. The owner approved the visual direction and delegated its implementation; this document does not invent a published approval of these exact bytes.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: 12deea02d427224fa479f6d5cfa0e094b8e595891d6379f74148abe6a72f0232`; `visualHashes: Pending`; `approvalReference: odd/tasks/component-iteration.md#log (L2, direction only)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/61`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings including the final newline; tracking metadata is excluded.

## 1. Purpose and scope

Retain the existing standalone navigation atom and change only its visual treatment: brand-colored text without the bottom border, a centered right arrow for every destination, and a small rightward hover movement. This is reuse of Link, not a new component or variant. Inline prose links, icon-only navigation and action buttons remain outside its scope. All unmodified v0.1 promises remain in force.

## 2. Anatomy and composition

The root stays a native anchor, or the single anchor-compatible child through the installed Radix Slot/Slottable packages. The child spreads props and forwards its anchor ref, and owns href in `asChild` mode. Text is followed by the existing decorative `Icon name='arrow-right' size='sm'`. External navigation still appends the Radix VisuallyHidden notice. `eg-link` remains the stable public root; no new public parts or exports.

## 3. Public API

No public prop is added, removed or renamed:

| Prop | Contract |
| --- | --- |
| `children` | Required descriptive ReactNode; one anchor-compatible element with `asChild`. |
| `asChild` | Boolean, default false; discriminates native required `href: string` from child-owned href. |
| `external` | Boolean, default false; forces `_blank`, safe rel tokens and hidden notice, but no longer changes the glyph. |
| `newTabText` | String, default `(opens in a new tab)`; consumer-localizable notice. |
| `arrow` | Boolean, default true; toggles only the decorative right arrow. |

Native anchor attributes and anchor refs remain supported. `className` remains outer margin/alignment only. Registry mappings are unchanged: `asChild` → `slot-composition`, `external` → `new-tab-navigation`, `newTabText` → `new-tab-notice`, `arrow` → `trailing-arrow`. See the [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md). Reviewed source: `packages/ui/src/atoms/link/types.ts#LinkProps`; whole-file revision `sha256:ba59cc4ae5c38984541b2c5a84e2aefe74b7b7f99295cc94fd3682107122936d`. No convention semantics, approval records or exceptions change.

## 4. Behavior

- Internal and external links always use arrow-right when `arrow` is true.
- Hover moves the arrow right by `--space-1`, with no vertical translation. The named group scopes hover to this link.
- Reduced motion suppresses translation and transitions, including retained legacy transforms.
- External rel deduplication, target normalization (also on slotted children), notice localization, arrow omission, events and navigation remain unchanged.

## 5. Accessibility

Native Tab/Enter and anchor navigation remain authoritative; Radix owns composition and hidden-notice geometry. The arrow stays hidden from assistive technology and unfocusable. External destinations retain the hidden new-tab notice even without the arrow. Preserve `--shadow-focus` on focus-visible. No live region, custom keyboard handling or disabled API is added.

## 6. Appearance and implementation boundary

- Resting text uses existing `--color-fg-brand-raised`, rather than neon: it is the semantic brand-text token documented for raised surfaces and reaches at least 4.82:1 on surface-3, while neon fails on surfaces 1–3. Existing `--color-primitive-red-200` remains the brighter hover ink.
- Root utilities explicitly reset legacy bottom padding and border (`pb-0 border-0`), retain label-default typography and center alignment. Icon sm remains 16px, shrink-free and self-centered. Optical appearance still requires browser inspection.
- Arrow motion uses `motion-safe:group-hover/link:translate-x-1`, `--duration-fast` and `--ease-out`; reset legacy transform and apply reduced-motion fallbacks. No hand-authored appearance, new tokens or dependencies.
- Keep the six files: `types.ts` owns static CVA and public JSDoc; `useLink.ts` owns semantics and per-part `cn()`; `Link.tsx` owns JSX; tests and stories cover the delta; `index.ts` preserves exports. **No stylesheet**, additional internal module or legacy CSS edit.
- Root layout merges through `cn()` with consumer classes last; this does not grant arbitrary appearance overrides or universal cascade precedence.

### Visual evidence

The v0.1 VIS-01 board remains historical and is not adopted as this changed appearance. No v0.2 screenshot or browser/Controls evidence was obtained: **visual: not evaluated**. Parent review should inspect Default, External, AsChild, WithoutArrow and States at rest/hover/focus and with reduced motion; screenshots and their conditions/hashes remain pending. No image URL or visual approval is fabricated.

## 7. Acceptance criteria

| ID | Promise | Evidence / review |
| --- | --- | --- |
| L2-01 | Borderless brand text and centered small right arrow for internal/external links | Link unit/hook assertions; browser appearance pending. |
| L2-02 | Horizontal token-backed hover movement only; static under reduced motion | CVA assertions and updated package CSS checks; emitted CSS/browser evaluation pending. |
| L2-03 | External safety and accessible notice preserved in native/Slot modes | Existing rel/target/notice, keyboard, ref, SSR and rerender tests retained. |
| L2-04 | Arrow omission and root layout merge unchanged | Existing unit cases and stories retained. |
| L2-05 | Public metadata remains accurate | Updated JSDoc/stories; real docgen and registered Controls tests. |

Test-first evidence for the delta: the focused Link/Input command first observed 9 failures and 24 passes, including Link's border, diagonal external glyph and old motion; after implementation it passed all 33 tests. The final handoff records subsequent integration and root-gate results separately. Packed-consumer fixtures are updated, not claimed executed. This draft authorizes no remote publication or terminal Git action by the writer.
