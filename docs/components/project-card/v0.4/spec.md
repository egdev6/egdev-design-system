# Component contract — ProjectCard v0.4: footer actions amendment

- **Version / status:** 0.4 — **Proposed.** Never approved: this draft carries no owner approval and no implementation. It amends the effective ProjectCard contract and answers consumer request [#577](https://github.com/egdev6/egdev-design-system/issues/577) (several actions in a project card footer; consumer issue [egdev-website#49](https://github.com/egdev6/egdev-website/issues/49), found while building the listings in egdev-website#50). Issue #577 was read on 2026-11-27: open, labels `enhancement` and `status:needs-review`, no comments. ODD coverage: `odd/tasks/round-5-consumer-requests.md` S2, S6 and L10.
- **Amends:** the effective baseline is the [v0.1 spec](../v0.1/spec.md) with its [decorative-index approval](../v0.1/decorative-index-approval.json), the [v0.2 spec](../v0.2/spec.md) with its [approval record](../v0.2/approval.md), and the [v0.3 spec](../v0.3/spec.md) with its [approval record](../v0.3/approval.md), including Amendment 1 (the §4 over-wide status label sentence) and Amendment 2 (the §4 narrow-host row). Every promise not listed under "Changed promises" in §1 stays as approved. v0.3's `statusBadge` slot, header row, lead group, `eg-project-card__badge` marker and both amendments are untouched.
- **Approval / recovery:** Pending for this version. Gate 1 (cataloging) is approved: owner answer, verbatim, "Aprobar las dos (Recomendado)" on 2026-11-27, recorded in [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md) L10 and in the "Listings (#576, #577)" block at the end of [`odd/tasks/round-5-cataloging.md`](../../../../odd/tasks/round-5-cataloging.md). Both ODD files were modified and uncommitted in the working tree when this draft was written, so the parent commits them before a reviewer relies on them. The spec (gate 2) and the [implementation plan](implementation-plan.md) (gate 3) are presented together for one owner approval (L10); approving one gate approves no other (S6). Agreed spec location: this file.
- **Current situation / pending decisions:** existing, implemented molecule; this is an additive widening of one part's documented contract plus one recipe utility. Verified facts (V-1 to V-12) and proposals are kept apart. Three questions are open (OQ-1 to OQ-3, closing section) and the text below is written with each recommended answer folded in. No token, dependency, Radix package, Material recipe, stylesheet, prop, part or export is proposed. Nothing is implemented and no check has run.
- **Snapshot identity:** `version: 0.4`; `contentSHA256: 0f09e0353dedec6dd24eb7d5920760317854447e530c8388b9d2ac6994c8e74c`; `visualHashes: Pending (VIS-01 and VIS-02 are not captured)`; `approvalReference: Pending (cataloging approval: odd/tasks/round-5-consumer-requests.md L10, "Aprobar las dos (Recomendado)"; spec approval Pending)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/275` (ProjectCard's single component issue, as in v0.2 and v0.3; #577 is the consumer request, not a second canonical issue); `latestPublishedComment: Pending (nothing published; remote comment history not checked)`.
- **Hash definition:** SHA-256 of the UTF-8 LF bytes from the exact line-start `## 1. Purpose and scope` heading through EOF, including the final newline; every line above that heading is tracking metadata and is excluded, so the digest cannot depend on itself. Reproduce it with an exact full-line match on that heading (for example `awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`), never with a substring search. Finalize before publication; approval must bind the exact payload and the identified visuals.

## 1. Purpose and scope

- **Need:** a project card in the website's projects listing offers up to three actions in its footer: the detail page, GitHub and the demo (#577). `ProjectCardFooter` is documented as one supplied action (V-1) and its row does not wrap (V-2), so the consumer composes the multi-action footer app-side (`src/components/listing-projects.tsx` in egdev-website, named in #577 as the current mitigation; it lives outside this repository and was not read for this draft). This amendment widens the documented contract of the footer to one to three supplied Button or Link actions and lets the row wrap, so a narrow card can show every action by wrapping the row.
- **Non-goals:** a list, toolbar or menu (no `ul`/`li`, no `role`, no roving focus, no arrow-key model); an `actions` prop, an array or data-driven API, or any new prop, part, export, marker, token, dependency, stylesheet or Material recipe; a whole-card link (the v0.1 non-goal holds) or nested interactive controls; pinning, primary/secondary styling or reordering of the actions (ModuleCard's logical `ms-auto` rule for its last action is not adopted, because it is not part of the approved decision); runtime enforcement of the cap or of unique names (no warning, count, clone, filter or removal); any change to the header row, `statusBadge`, Backdrop, Mark, Tags, Code, the `variant` and `size` axes or any other v0.1 to v0.3 promise; a release or version decision.
- **Cataloging decision / alternatives:** approved at gate 1 (L10): **variant**, a ProjectCard v0.4 contract amendment. The walk through the cataloging order:

| Step | Result | Evidence |
| --- | --- | --- |
| Reuse as is | Fails | The footer documents "exactly one Link or Button … never two competing actions" (V-1) and its row is a non-wrapping flex line (V-2). |
| Appearance variant | Fails | An appearance axis cannot widen how many consumer actions a part holds. |
| Compose with today's API | Possible, but outside the contract | It is the current mitigation: several children inside `ProjectCardFooter` render in order and keep their own tab stops by inspection (V-3). The contract forbids it and the row cannot wrap, so a consumer that needs wrapping must solve it in its own app. |
| New `actions` prop or array API | Rejected | It would be a data-driven list (this is not a list), a second way to supply the footer, and a prop named `actions` on a part whose content is `children`. v0.3's D2 rationale stands: header content is props, body content is child parts. |
| Extract / new component | Not warranted | Same responsibility (a passive card's footer zone) and no new interaction pattern: independent controls, each with its own native focus. [`docs/CATALOGACION.md`](../../../CATALOGACION.md) says a variant stops being one when it introduces another responsibility or interaction pattern; neither applies. |
| **Variant (approved)** | **Chosen** | One part's documented contract plus one recipe utility. |

  Precedent: ModuleCard's `actions` supplies the mechanism, not the number. It takes consumer-supplied Button/Link controls whose count and names are consumer obligations, and it documents **one or two** (V-7). This amendment documents **one to three**, because #577 names three destinations.
- **Evidence / level and package:** the molecule stays in `@egdev/ui` at `packages/ui/src/molecules/project-card/`. Availability is verified in the React package, not inferred from CSS, catalog or stories: `packages/ui/src/index.ts:91-110` re-exports `ProjectCard`, its parts and its types from `./molecules/project-card`.

**Verified facts** (read-only inspection of the working tree on branch `integration/round-5`, HEAD `5ed0748`, while no ProjectCard-related file differed from HEAD; no test, build, Storybook or browser ran and no source file was changed). Whole-file SHA-256 values, full or as prefixes, are those of the files at HEAD `5ed0748` and are recorded for the files that matter to the registry or the pins. Another writer's uncommitted work has since changed the generated artifact, the catalog source and both changelogs in the tree, so re-verify those against the tree you start from:

| ID | Verified fact | Source | Whole-file SHA-256 |
| --- | --- | --- | --- |
| V-1 | `ProjectCardFooterProps` documents one action. Type JSDoc: "Footer zone for the card's single action; the consumer supplies exactly one Link or Button." The `children` JSDoc: "One supplied action; the card itself stays passive and adds no tab stop of its own." It is `@control false` with `@controlReason … see the WithLink story for the supplied action.` | `packages/ui/src/molecules/project-card/types.ts:144-153` | `5da961e5d9f85a2a444299cea66fb900f2ae8fa304bd6b3db761fc70b4a9517b` |
| V-2 | The footer recipe is `cva('eg-project-card__foot flex items-center gap-3')` with the comment "single supplied action; no pinning, it follows the body flow". It has no wrap utility and no variant axis. It is private: used only by `useProjectCardFooter`, absent from both barrels, and listed among the names that must not be root exports. | `types.ts:270-271`; `useProjectCard.ts:261`; `scripts/package-exports.test.mjs:8380` | same file |
| V-3 | `ProjectCardFooter` renders `<div {...footProps}>{children}</div>`; `useProjectCardFooter` returns `cn(projectCardFootVariants(), className)` and the children untouched, so the footer never inspects, counts, clones or reorders them and takes only `children` and `className`. Its component JSDoc and the hook comment both say "single supplied action". | `ProjectCard.tsx:124-128`; `useProjectCard.ts:253-262` | `888ab022b31f6694497c59e98d83acba191c1a1e05b37b404d9413443b9cbdfa`; `74350af3beb6ed1dacefd30e1a7095a5958685492ab371958eb735a9196d383b` |
| V-4 | The card renders no anchor, button or tab stop of its own; the protected native set (`role`, `tabIndex`, `contentEditable`, `dangerouslySetInnerHTML`, `aria-label`, `aria-labelledby`, `aria-disabled`, `aria-selected`, `aria-pressed`, `aria-live`) is stripped by the hook. | `ProjectCard.tsx:60-80`; `useProjectCard.ts:121-132` | same files |
| V-5 | Existing tests: the PC-08 case tabs through one footer link (`ProjectCard.test.tsx:273-292`); the PC-09 case scans a `w-48` host for truncation utilities and expects the footer as the last child (`:294-323`). No test covers two or three footer actions. | `ProjectCard.test.tsx` | `05da45f4b6b1bb21dc734c90cdf2a8d601cb8d8b1f4bd7018d48e4a684359654` |
| V-6 | Stories and docs say "one footer action", "the card's single interactive element lives in the footer" and "the one action the consumer supplies inside `ProjectCardFooter`" in the meta text, and `WithLink` says "The footer hosts exactly one action". The same "single supplied action" wording is carried into the generated artifact. | `ProjectCard.stories.tsx:18,22,27,175`; V-12 | `41eec38dae104a4bc2e304f2020a6a310a46c8cc61f4c55fa8d4484cc3ae1efa` |
| V-7 | ModuleCard precedent: `actions` is documented as "One or two supplied Button/Link controls" (error and stopped: "One or two meaningful …"). Its recipe is `flex flex-wrap items-center gap-2 mt-auto …` with a logical last-of-multiple `ms-auto` rule. Its `WithActions` story pairs a `Button` and a `Link`. | `packages/ui/src/molecules/module-card/types.ts:109,132,155,209-212`; `ModuleCard.stories.tsx:191` | `ed7adc13e5eb72795fbfdd83ee8108b291cefd94708e6b4f3642293357139c53` |
| V-8 | Supplied controls: `Button` is `whitespace-nowrap` unless its own `labelWrap` is set (the label then wraps, long unbroken words included); `Link` carries no no-wrap utility. | `packages/ui/src/atoms/button/types.ts:61-68,73,98`; `packages/ui/src/atoms/link/types.ts:86-87` | `26547d7d24fb9a9e8f5a3850d09ef9e010dce123f62c8fcc3db7c9ccf16cb11e`; `38f79b26ada7091484423cec50726c9094c1321c51938dedbe6bcd8524ffffc9` |
| V-9 | Legacy cascade, in `@layer components` below utilities: `.eg-project-card` sets `align-items:flex-start` and `overflow:hidden`; `.eg-project-card__foot` sets only `margin-top:auto` and `padding-top:var(--space-2)`, so it sets no display, wrap or alignment that the footer utilities would fight. v0.3 Amendment 1 already records that `overflow:hidden` clips whatever passes the card's padding edge. | `packages/ui/src/styles/legacy/bundle.css:293,303`; `packages/ui/src/styles/index.css:10-12` | `0ddabe8b8488…` (prefix) |
| V-10 | `.flex-wrap` is already shipped and pinned for the #558 header row: the packed-CSS test lists it and asserts `flex-wrap: wrap`. | `scripts/package-exports.test.mjs:7051,7067` | prefix `26f4dc6b9b98…` |
| V-11 | Registry: `trailing-actions` (`actions`, approved) lists ModuleCard ("one or two supplied Button/Link controls") and EmptyState among its usages; `collection-items` says to avoid free composition through children. No part-level `children` slot (`NowCardFooter`, `ListItemActions`, `CommunityCardAction`, `ProjectCardFooter`) is registered. Ten usages are sourced from `project-card/types.ts`, all at revision `sha256:5da961e5…`. | `skills/_shared/prop-naming.json`; `docs/prop-naming.md` | prefix `6228f538f7a1…` |
| V-12 | Artifact: `packages/system/design-system.json` and `system.md:1545` carry the `ProjectCardFooter` part description (from the component JSDoc) and its `children` description (from `ProjectCardFooterProps`). The artifact's ProjectCard `variants` and `anatomy` list 11 recipes, without the footer, tags, code, mark or backdrop recipes, so the footer recipe is not part of it. | `packages/system/design-system.json`; `packages/system/system.md` | prefixes `48de625a33ce…`, `62526b8b6742…` |

**Changed promises** (all additive; they apply to every ProjectCard, since the footer has no opt-in switch):

| Approved promise (source) | What v0.4 changes | Impact | Checks (§7) |
| --- | --- | --- | --- |
| "Footer zone for the card's single action … Exactly one `Link` (or one `Button`) supplied by the consumer; never two competing actions" (v0.1 §2); "one consumer-supplied Link or Button, a consumer obligation not runtime enforcement" (v0.2 §2); `ProjectCardFooter.children` "required `ReactNode`, one supplied action" (v0.2 §3); "one footer action" (v0.1 §1) and "one supplied footer action" (v0.2 §1) | The footer holds one to three consumer-supplied Button or Link actions. The sentence "never two competing actions" is retired: independent actions to different destinations are the use case. The cap and name uniqueness are consumer obligations, not runtime enforcement. | A one-action footer stays valid. `ProjectCardFooter.children` keeps its type (`ReactNode`, required). | PC-08, PC-F1, PC-F5, PC-F7 |
| "not a whole-card link (the web card is passive and its footer holds the only action)" (v0.1 §1 non-goal) | The non-goal holds; only its reason changes: the footer holds the card's actions and there is no whole-card link. | None. | PC-F6 |
| "The only focusable element is the consumer's footer `Link`/`Button` … No nested interactive controls exist" (v0.1 §5); "the one-action rule applies to the intended footer composition, not a runtime guarantee about arbitrary children" (v0.2 §5) | The focusable footer elements are the one to three supplied actions, one tab stop each in DOM order. The card still renders no interactive element, so nothing nests. The one-to-three rule applies to the intended composition, with no runtime guarantee. | Wording; no card behavior changes. | PC-08, PC-F6 |
| PC-08 "The footer hosts exactly one supplied action and the card exposes no other tab stop" (v0.1 §7) | Rewritten in §7. | See §7. | PC-08 |
| Footer recipe `eg-project-card__foot flex items-center gap-3` (V-2) | Adds `flex-wrap`, so actions that do not fit flow onto further lines at the inline start. | A single action is expected to lay out as before (it stays on one line); the plan measures it. | PC-F2, PC-F3, PC-F4 |

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| `ProjectCardFooter` (changed) | Footer zone holding the card's actions in one wrapping row | `div` (marker `eg-project-card__foot`) | One to three consumer-supplied `Button` or `Link` actions (or one element composing either through its own `asChild`). Never a nested interactive control, never a list. |
| Root, header row and lead group, index, eyebrow, heading, `eg-project-card__badge`, Backdrop, Mark, Tags, Code | Unchanged | Unchanged | Unchanged |

```text
article.eg-project-card
├─ …                              unchanged: header, heading, body children
└─ div.eg-project-card__foot      ProjectCardFooter, wrapping row
   ├─ a | button                  action 1 (supplied)
   ├─ a | button                  action 2 (supplied, optional)
   └─ a | button                  action 3 (supplied, optional)
```

- **Radix / composition:** none; the card is passive and has no interaction to delegate. Each action keeps its own semantics through the existing atoms (`Link` and `Button` both compose `@radix-ui/react-slot` for `asChild`). ProjectCard does not import Button or Link: the consumer composes them, so no dependency edge appears. The card never clones, inspects, counts or reorders the actions.
- **Public markers:** `eg-project-card__foot` and every other marker are preserved. No new marker: the actions are consumer elements, and the wrap behavior is not an override surface.

## 3. Public API

- **Prop conventions:** looked up in the [canonical registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning, name and aliases (the entries consulted declare no aliases). Result: **no new own prop, no new usage, no new concept and no exception.** `ProjectCardFooter.children` is an existing own prop whose documented rule changes (one action becomes one to three); its name, type and requiredness do not. Candidates considered:

| Candidate entry (prop name) | Registry meaning | Verdict for the footer |
| --- | --- | --- |
| `trailing-actions` (`actions`) | "Consumer-supplied action content in a component or neutral section"; ModuleCard documents one or two supplied Button/Link controls | Not applied: the footer's content is its `children` slot, not an `actions` prop, and reusing the entry would need a scoped exception for the prop name `children` (OQ-3). No part-level `children` slot is registered under it today (V-11). |
| `collection-items` (`items`) | Ordered data a composite renders from a consumer list; avoid free composition through children | Rejected: the footer is not data-driven and not a list, it is free composition of supplied elements. |
| `leading-status-badge` (`statusBadge`) | v0.3 header slot | Untouched. |

  Reviewed source for the unchanged prop: `packages/ui/src/molecules/project-card/types.ts`, symbol `ProjectCardFooterProps`, whole-file `sha256:5da961e5d9f85a2a444299cea66fb900f2ae8fa304bd6b3db761fc70b4a9517b` (current working tree, equal to the revision recorded for the ten existing ProjectCard usages). Editing `types.ts` stales those ten revisions, so the implementation must refresh them. That is evidence maintenance, not a new convention, and it approves nothing globally. Not edited by this task: the registry JSON, the generated view and the tests.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `ProjectCardFooter.children` (rule changed) | `ReactNode` | yes (on the part) | None. One to three supplied Button or Link actions is a documented consumer rule, not a runtime check. | One to three supplied Button or Link actions in importance order; the row wraps onto further lines in a narrow card. The card adds no tab stop, role or semantics of its own. |
| `ProjectCardFooter.className` | `string` | no | Unchanged | Local layout only (grid placement, margin, width), merged last. |
| Every other prop, part and export | Unchanged | Unchanged | Unchanged | See v0.1 to v0.3. |

Proposed JSDoc for `types.ts` (English; `@control false` for a ReactNode per the shared contract; no `@default`, because there is no constant):

```ts
/** Footer zone for one to three supplied Button or Link actions; the card itself stays passive.
 * The consumer owns the cap of three and keeps each action's accessible name unique within the card;
 * neither is enforced at runtime. No whole-card link, no nested interactive controls, not a list.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
export type ProjectCardFooterProps = {
  /**
   * One to three supplied Button or Link actions in importance order; the row wraps onto further lines
   * in a narrow card. The card adds no tab stop, role or semantics of its own.
   * @control false
   * @controlReason Non-serializable ReactNode content; see the WithLink and WithActions stories for the supplied actions.
   */
  children: ReactNode;
  // className: unchanged
};
```

The component JSDoc in `ProjectCard.tsx` becomes "Footer zone for one to three supplied Button or Link actions; the card itself stays passive."

- **Native props / refs:** unchanged. The footer forwards nothing native (it takes `children` and `className` only); no ref, no `asChild`, no per-action `className` surface: each action merges its own `className` inside Button or Link, for root layout only.
- **Controlled / uncontrolled:** Not applicable; no state.
- **Compatibility:** additive documentation plus one utility. No prop, part, export, marker, token or dependency is added, removed or renamed; `index.ts` and the barrels are unchanged. A one-action footer carries one more class token (`flex-wrap`) and is expected to lay out as before; consumer application code was not inspected. React 18 and 19 packed consumption is a plan check, not a claim from types. Release and version impact is decided separately (S2: the amendment folds into the unpacked 0.11.0 with no bump).

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Footer with one action | As today: the action at the inline start on one line. | none |
| Footer with two or three actions | The actions render verbatim in supplied order, in one row at the inline start with one gap step. The card wraps, inspects, clones or reorders nothing. | none |
| Row narrower than the actions | The row wraps: the actions that do not fit flow onto further lines at the inline start with the same gap. The card adds no truncation, clamp, clipping or scaling. | none |
| Activate an action | The action's own behavior (native or Slot navigation, or its handler). The card stays non-interactive. | the supplied element's own event |
| Tab / Shift+Tab | One tab stop per action in DOM order, and no other card stop. | none |
| Disabled or loading Button in the footer | The Button's own contract; the card neither knows nor changes it. | none |
| Four or more actions, two actions with the same accessible name, or a child that is not a Button or Link | Rendered verbatim: no warning, error, removal or clone. The cap and the names are consumer obligations. | none |
| Empty footer (no children) | An empty footer `div` as today; the consumer omits the part instead. | none |
| Pointer over the footer or the card | No effect added by the card (no lift, glow or cursor change). | none |
| `statusBadge`, Backdrop, Mark, Tags, Code, `featured`, `sm` | Unchanged; the v0.3 rows and both amendments apply as approved. | none |
| Blank title | Unchanged: development warning and nothing rendered, footer included. | none |

- **States / representation:** no own state, no new `data-*` and no mirrored class; `data-variant` and `data-size` are unchanged. The wrap is layout, not state.
- **Limits / consumer responsibilities:** the consumer supplies one to three actions, each a `Button` or `Link` (or a compatible `asChild` composition) with a short localized visible label; orders them by importance in the DOM; keeps accessible names distinct within the card (OQ-1); never nests controls or adds a whole-card link; omits the footer instead of rendering it empty; and owns announcements, routing and analytics. A single label wider than the card's content box is the v0.3 Amendment 1 limit: wrapping the row cannot help one control, so the card's legacy `overflow: hidden` (V-9) clips whatever passes the padding edge. A Button label does not wrap unless the consumer sets `labelWrap`; a Link label wraps at word boundaries (V-8) (OQ-2).

## 5. Accessibility

- **Accessible name / roles / relationships:** unchanged. The article is named by its generated heading only (`useId()` and `aria-labelledby`); the footer and its actions add nothing to the name. The footer is a generic `div` with no role, no `aria-*` and no list or group semantics: it is not a list, one to three controls need no list announcement, and a `group` would need a name the card cannot derive. Each action is a native link or button named by its own content. **Consumer obligations, documented and not enforced at runtime:** every action has a visible, descriptive name; names are distinct within the card (OQ-1 (a)); where the same wording repeats across the cards of a listing, include the project name in the accessible name while keeping the visible label inside it (label in name). An external Link's own hidden new-tab notice becomes part of that link's name.
- **Keyboard / focus:** the card adds no key handler and no tab stop. Each supplied action is one tab stop in DOM order (the footer is the last body part by convention, so a body link is reached first); Shift+Tab reverses; after the last action focus leaves the card. There is no roving focus, arrow-key model or composite widget: the actions are independent controls and keep their native keys and their own focus ring (`--shadow-focus`). A disabled Button leaves the tab order and a loading Button stays focusable, by their own contracts. Wrapping never reorders: DOM order equals visual order, including in right-to-left, because the layout uses logical flow only (meaningful sequence).
- **No whole-card link, no nested controls:** the card renders no anchor, button or role of its own, so no card-level activation exists and no control nests inside another; the footer actions are siblings. A consumer must not wrap the card or an action in another interactive element, nor put interactive content inside an action.
- **Announcements / other conditions:** none; no live region and no announcement on change. Touch targets: each action owns its target (Button `lg` 44.8px, `md` 38.4px, `sm` 32px per the Button contract; the project minimum on touch is 44px) and the card neither enlarges nor shrinks them. The footer's `gap-3` row and column gap is the card's only contribution. Conformance of the combination (the WCAG 2.5.8 target-size minimum and its spacing exception) is **Not evaluated** until observed in a real browser with the supplied controls. Non-color cues belong to the supplied atoms (Link underline, Button border); the card adds none, and adds no motion.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `variant` | `default`, `featured` | Unchanged | The footer is unaffected. |
| `size` | `md`, `sm` | Unchanged | The footer recipe has no size axis: gap and wrap are identical at both sizes and no action is hidden or shrunk. |
| `level` | 2 to 6 | Unchanged | Semantics only. |
| Action count | Derived from the supplied children; not a prop or CVA axis | One to three, consumer-owned | No count-specific layout and no variant per count. |

- **Tokens / Material:** layout only. The footer paints nothing (no background, border, shadow, gradient or radius), so no Surface composition or Material recipe applies; the supplied Button and Link keep their own paint, hover and focus treatments. The recipe stays a private CVA in `types.ts`, composed per part with `cn()` in the hook, and becomes `eg-project-card__foot flex flex-wrap items-center gap-3`: it adds only the keyword utility `flex-wrap`, which this package already ships (V-10). `gap-3` resolves through the spacing alias to `--space-3` (9.6px per the v0.3 evidence) and, once the row wraps, applies to both row and column gaps; `items-center` centers the actions within each line. The legacy footer rule (V-9) stays untouched and fights none of these utilities; the plan proves the cascade in a browser rather than assuming it. No hand-written color, shadow, spacing or font, no inline style, no new token.
- **Dynamic geometry:** Not applicable; no limited geometry exception is requested.
- **Class composition / consumer layout:** the footer's `className` still merges last through `cn()` for outer layout only (grid placement, margin, width), with the `@classNameAllows` width set unchanged. There is no per-action class surface, and the card never merges classes into a supplied action. `twMerge` resolves recognized conflicts among the footer's own classes only; a consumer class such as `flex-nowrap` is outside the supported surface and is not promised to win or to lose. Tests: PC-F2.
- **Files / pending proposals:** the six mandatory files keep their roles.
  - `types.ts`: the footer recipe plus the JSDoc above; no new export or type.
  - `useProjectCard.ts`: a comment-only edit on `useProjectCardFooter` (V-3); no logic, since the hook already composes the recipe and returns the children verbatim.
  - `ProjectCard.tsx`: a JSDoc-only edit on `ProjectCardFooter`; the JSX is unchanged.
  - `ProjectCard.test.tsx` and `ProjectCard.stories.tsx`: new cases, the `WithActions` story and updated meta text (see the plan).
  - `index.ts`: unchanged (no new export).
  - **No stylesheet.** No additional internal module, token, dependency, Material recipe or exception.

### Expected-design visual reference

Follows the [capture guide](../../../design/README.md). No image exists; nothing below is a captured or approved image. There is no expected-design source: the consumer's app-side composition named in #577 is outside this repository, was not read, and is not a design reference. Both IDs are therefore **observed** implementation, to be captured after implementation if captures are authorized.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending. Alt text on capture: "ProjectCard footer with three actions, a link to the detail page, a link to GitHub and a button for the demo, in one row at the inline start." | Principal scenario, observed: Storybook `WithActions`, `md`, viewport 1280×900 | Story id and commit recorded at capture | Observed, never expected design; Pending |
| VIS-02 | Pending. Alt text on capture: "The same footer in a narrow card, with the later actions wrapped onto a second line at the inline start." | Additional scenario, observed: `WithActions` at a 320×800 viewport | Same | Observed; Pending |

- **Conditions / provenance per VIS ID (proposed, to agree before any capture):** Chromium through Playwright MCP; device scale 2; dark theme; element-level crop of `article.eg-project-card`; fonts loaded before capture; default motion preference. Record tool, version, date, crop and SHA-256 in `capture.json` under this directory when captures exist. Starting Storybook and using Playwright MCP need separate permission.
- **Intent / acceptance / pending evidence:** intent: the actions read as one row at the inline start with one gap step, and wrap at the inline start in a narrow card without overflowing the card's padding box for realistic labels (`Details`, `GitHub`, `Demo`). No allowed difference is adopted. Related AC: PC-F4, PC-F10. Missing: authorization, captures, conditions, approval.
- Without recoverable approved references and comparable conditions, visual conformity is **Not evaluated**. Captures do not replace behavior or accessibility tests.

## 7. Acceptance criteria

All checks below are planned, not observed. `PC-F*` extends v0.1's `PC-01` to `PC-10`, v0.2's `PC-11` to `PC-16` and v0.3's `PC-S1` to `PC-S15`; `PC-08` is rewritten in place and keeps its ID. Every row of the "Changed promises" table in §1 names the checks below that cover it, and PC-F8 covers every promise that did not change.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| PC-08 (rewritten) | Before: "The footer hosts exactly one supplied action and the card exposes no other tab stop". After: the footer hosts one to three supplied Button or Link actions; Tab visits each action once in DOM order, Shift+Tab reverses, and the card exposes no other tab stop | `ProjectCard.test.tsx`: the existing one-link case stays unedited; new `userEvent.tab()` sequences with two and three actions (a Link and Buttons) in the plain and upper-zone branches, ending on `document.body` | `WithLink` (one action), `WithActions` (three) | Pending |
| PC-F1 | The supplied actions render verbatim inside one `.eg-project-card__foot`, in supplied order, keeping their roles and accessible names (links stay `link`, buttons stay `button`); the footer has no `role`, no `aria-*` and no list element generated by the card | Render with one, two and three actions: `within(footer)`, `getAllByRole`, order by `compareDocumentPosition`, attribute and `ul`/`ol`/`li` absence | `WithActions` | Pending |
| PC-F2 | The footer recipe adds `flex-wrap` and nothing else: it keeps the marker, `flex`, `items-center` and `gap-3` and carries no pinning (`ms-auto`, `ml-auto`, `justify-*`), reordering (`order-*`), clipping (`truncate`, `line-clamp`, `text-ellipsis`, `overflow-*`) or no-wrap (`whitespace-nowrap`, `flex-nowrap`) utility; the footer `className` still merges last | Targeted class assertions (no full class string) and a scan of the footer's classes; a render with `className` | Not applicable | Pending |
| PC-F3 | PRESERVE: a one-action footer keeps today's behavior. The supplied element is the footer's only child and no wrapper is added, in both branches; in the browser a one-action footer has the same rect and computed `display`, `align-items` and `padding-top` as on the base | Unit: DOM structure of a one-action footer in both branches. Browser, separately authorized: geometry of `WithLink` on the base and on the change | `WithLink` | Pending |
| PC-F4 | In a narrow host the row wraps: with three realistic actions in a `w-72` host and at a 320px viewport, the later actions flow onto further lines at the inline start with the same gap, the card and its footer show no horizontal overflow, every action stays inside the card's padding box, and right-to-left mirrors | Unit: a `w-48` host shows no truncation, clamp or clipping utility with three actions (extends the PC-09 scan). Browser, separately authorized: rects and `scrollWidth <= clientWidth`, in `dir="rtl"` too | `WithActions` at 1280 and 320px; VIS-01, VIS-02 | Pending |
| PC-F5 | No runtime enforcement: four actions, two actions with the same accessible name and a child that is not a Button or Link render verbatim, with no console warning or error and no removal, clone or reorder | Render each case with `console.warn` and `console.error` spies; DOM assertions | Not applicable | Pending |
| PC-F6 | No whole-card link and no nested controls: with only footer actions, the interactive elements inside the article are exactly the supplied ones and none nests inside another; the article has no `role`, `tabindex`, link or button of its own; activating the article away from an action moves no focus | DOM queries for `a`, `button` and `[tabindex]`; `userEvent.click` on the article; focus and `outerHTML` unchanged | Not applicable | Pending |
| PC-F7 | The documentation states the contract: `ProjectCardFooterProps`, its `children`, the `ProjectCardFooter` component, the hook comment, the meta text and the `WithLink` and `WithActions` descriptions say one to three supplied Button or Link actions, that the cap and unique accessible names are consumer obligations not enforced at runtime, and that there is no whole-card link, nested control or list. No stale "single action" or "exactly one" wording remains in ProjectCard source. Docgen metadata stays valid: `children` is `@control false` with a reason, own-prop counts are unchanged, `WithActions` is in the story list and there are zero diagnostics | `storybook-docgen.test.ts` PC-10 case (footer `children` description, story list); a search for the old wording; `storybook-controls.test.ts` unchanged | Docs table for `Molecules/ProjectCard` | Pending |
| PC-F8 | PRESERVE: every v0.1 to v0.3 promise outside the footer holds: `PC-01` to `PC-16` except the rewritten PC-08, `PC-S1` to `PC-S15`, `statusBadge`, the header row, `eg-project-card__badge`, Backdrop and Mark first-part-wins, and both v0.3 amendments. The existing ProjectCard, LabStage and NowCard suites pass unedited except the story-name pin | The full ProjectCard, LabStage, NowCard and metadata suites | Not applicable | Pending |
| PC-F9 | No new export, token, dependency, stylesheet or marker; `index.ts` is byte-identical; convention text, status and approvals are unchanged and the ten `types.ts` revisions are refreshed; the artifact differs only in the two footer descriptions; the built package renders three actions in one footer and emits `.flex-wrap` with its declaration; a typed consumer accepts three actions on React 18 and 19 | `pnpm props:check`, `pnpm test:props`, `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system`; packed SSR and typed-consumer extensions; an emitted-CSS check | Not applicable | Pending |
| PC-F10 | Observed captures match the references under the same conditions, or each difference is explained and mapped to an acceptance ID | Playwright MCP component-zone captures plus `capture.json`, separately authorized | VIS-01, VIS-02 | Not evaluated (no capture, no approval) |

### Spec closure

- [ ] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain. *Not closed: OQ-1 to OQ-3 await the owner; the blocks are complete with each recommended answer folded in.*
- [x] New or changed own props have registry lookup evidence, exact candidate verdicts and reviewed exceptions. *Met: no new or changed own prop beyond the documented rule of `ProjectCardFooter.children`; no usage, concept or exception is proposed; convention approval stays separate.*
- [x] Proposals, verified facts, planned test and story matrices and observed results are distinct; each promise has an acceptance ID and a suitable method. *Met: V-1 to V-12, PC-08 and PC-F1 to PC-F10; every observed cell stays Pending.*
- [ ] Visual IDs identify real image provenance, conditions and related criteria; pending captures are not verification. *Not met, by design: VIS-01 and VIS-02 stay Pending and visual conformity stays Not evaluated.*
- [ ] Snapshot identity is recoverable and human approval identifies this exact version, digest, visual hashes and scope. *Pending: the digest is recoverable from this file; no approval exists, so the status stays Proposed.*
- [x] One canonical component issue is retained; later versions are authorized comments, never silent body edits or one issue per version. *Met: #275 is canonical, #577 is the request, nothing is published.*

**Gate map (S6):**

| Gate | Skill | State |
| --- | --- | --- |
| 1 Cataloging | `component-cataloging` | Approved: L10, "Aprobar las dos (Recomendado)" |
| 2 Spec | `component-spec-proposer` | This document: Proposed, awaiting approval |
| 3 Plan | `component-contributor` | [implementation-plan.md](implementation-plan.md): Proposed, awaiting independent approval |
| 4 Code | n/a | Not authorized |

**Open owner decisions (recommended answers are folded into the text above):**

- **OQ-1 — Scope of "unique link names".** (a) The card-level obligation is that each action's accessible name is distinct within the card and states its destination or operation; the documentation recommends adding the project name to the accessible name, with the visible label kept inside it, when the same wording repeats across the cards of a listing (recommended). (b) Make page-wide uniqueness the documented obligation. (c) Document no naming rule beyond the native one. Why (a): the card can reason about its own actions, page-wide naming is the app's concern, and tightening it later is a documentation change.
- **OQ-2 — A single label wider than the card.** (a) Document the limit: wrapping the row cannot help one control wider than the content box, the card's legacy `overflow: hidden` clips what passes its padding edge (the v0.3 Amendment 1 behavior), and the consumer supplies short labels or Button `labelWrap` (recommended). (b) Add a child-width rule such as `[&>*]:max-w-full` to the footer recipe. Why (a): (b) styles consumer children, which the card never does, and does not fix no-wrap text.
- **OQ-3 — Registry.** (a) No registry write: `ProjectCardFooter.children` stays an unregistered part slot, as every part-level `children` slot is today (V-11); only the ten `types.ts` source revisions are refreshed (recommended). (b) Register the footer under `trailing-actions` with a scoped exception for the prop name `children`, which is a new pending exception with its own approval and hash for a prop that is not being added or renamed.

**Next step:** the owner resolves OQ-1 to OQ-3 and approves or rejects this exact version and the [implementation plan](implementation-plan.md), each by its own digest. This spec authorizes no code, token or dependency change, registry write, capture, GitHub action or terminal Git action.
