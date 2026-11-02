# TerminalCard — v0.1 proposal (new issue body, prepared, not posted)

**Readiness: Draft — not ready for implementation.** OQ-1 to OQ-6 are open blocking choices, two registry conventions are proposed and not approved (`shell`, `caret`), and the root-semantics question is still open. Posting this body authorizes no code, plan, token, dependency or catalog change, and creates no publication permission.

## Snapshot identity

- `version: 0.1`
- `contentSHA256: f3272e420250e646e20dbe58d52dbd61799d944042069ea91db5b7e439135f8c` (SHA-256 over the canonical payload below, from the level-2 `1. Purpose and scope` heading line through EOF, LF line endings, final newline; tracking metadata above that heading is excluded)
- `visualHashes: VIS-03 b6f8a75d3c34d2ee2b0df7206598e23835a079223ed172f202281b686200379e`
- `approvalReference: Pending (Draft v0.1)`
- `canonicalIssue: this new issue is the canonical issue for TerminalCard; later versions must be authorized comments, never body edits or one issue per version`
- `latestPublishedComment: Pending (nothing published)`

## Catalog authority and reason

- Catalog decision (already approved, not re-opened here): `docs/components/web-catalog/v0.1/cataloging-draft.md` §4 lists **TerminalCard** as a new molecule in `@egdev/ui` with no domain defaults; `docs/components/web-catalog/v0.1/owner-approvals.md` records the owner's 2026-11-02 approval; `docs/CATALOGO.md` carries the row with action `mover` and composes `Surface`.
- Cadence and evidence authority: `odd/tasks/web-catalog.md` L6 (one versioned issue per component, Foundation previews captured read-only) and L15 (batch 1).
- Reason: the web renders `.eg-terminal`/`.term` only as page markup. `Panel` already owns the same tonal frame and bands but protects `role`/`aria-label` and has no definition-list semantics, so the card composes the same public `surfaceVariants` recipes rather than the component.

## Proposed API summary (details in the snapshot)

- Root `TerminalCard` (`div role="group"`): `label` (required group name), `children` = `TerminalCardBar` then `TerminalCardList`.
- `TerminalCardBar`: `children` (path text), optional `shell`.
- `TerminalCardList`: `items` of `{ term, value, tone?, caret? }`.
- Reuses `surfaceVariants` (raised `surface-1` frame plus the documented `surface-2` header band), `Icon` (`terminal`, decorative) and the token mono/label type recipes plus the existing `--animate-pulse` token for the caret; no new dependency, no Radix primitive, no stylesheet.
- Registry: approved entries `accessible-name` (`label`), `collection-items` (`items`), `surface-material-tone` (`tone`). **Proposed and pending**: `shell-label` / `shell` and `terminal-caret` / `caret`.
- `No stylesheet`: every role is expressible with token-backed utilities over the public Surface recipe.

## Visual references and asset status

`docs/components/terminal-card/v0.1/capture.json` holds the harness, source paths, conditions and SHA-256.

- VIS-03 — `docs/components/terminal-card/v0.1/terminal-card--variants--1280x1400--dark.png`, from `TerminalCard/preview.html` (source SHA-256 `5bf606a78ae683d3f58a243a3f72bbe00a59a5307c54fcd43e8b8367b0953ba5`).
- Conditions: 1280×1400 viewport, device scale factor 2, `chrome-headless-shell` (Playwright 1.60.0), dark colour scheme, `prefers-reduced-motion: no-preference`, animations disabled, Google Fonts loaded before capture, element screenshot of the preview board. Static resting state only (these previews contain no hover cell).

**Image handoff: Pending and blocked.** Local PNGs are not GitHub-visible. The owner must choose either human attachment (upload the exact PNG and return its URL) or a bounded, separately authorized asset-publication branch; the published bytes must be compared against the hash above before any image is linked here. No URL is invented and no commit, push or upload is implied.

## What approval of this proposal would mean

Adopting v0.1 as the TerminalCard contract (anatomy, API, behavior, accessibility, appearance and acceptance criteria) and adopting or declining VIS-03 as supporting expected-design evidence. It would not approve an implementation plan, tokens, dependencies, the `shell`/`caret` conventions globally, or any catalog-row change. Answers needed: OQ-1 (`shell` prop and convention), OQ-2 (`caret` flag and its animation), OQ-3 (`tone` with the readable-text rule), OQ-4 (brand-raised term ink), OQ-5 (no built-in max width), OQ-6 (root `role="group"` + required `label`) — each with a recommendation at the end of the snapshot.

---

## Full snapshot (canonical payload, SHA-256 `f3272e420250e646e20dbe58d52dbd61799d944042069ea91db5b7e439135f8c`)

## 1. Purpose and scope

- **Need:** one reusable terminal-shaped key/value card in `@egdev/ui` so a new web view can present a profile sheet, project metadata or any definition pairs with a developer tone. The card carries a title bar (path + optional shell), an optional decorative caret and an ordered list of definition pairs with an optional success tone. No path, shell name, key, value or status word is built in.
- **Non-goals:** not a code block or an executable terminal (use `ProjectCard`'s code part or a plain `pre`); not a data table for comparison (`Table` owns that); not a copy/download control; no command parsing, no shell execution, no history, no prompt input, no typing animation engine, no arbitrary per-row colours and no host detection. The decorative cursor is a static presentation flag, not a runtime simulation.
- **Cataloging decision / alternatives:** **new** molecule, per [cataloging-draft.md §4](../web-catalog/v0.1/cataloging-draft.md) and the `TerminalCard` row in `docs/CATALOGO.md` (action `mover`, source `TerminalCard (molécula)`, composes `Surface`). Rejected alternatives: *reuse* (`Panel` renders an identical tonal frame with a `surface-2` header band and a `surface-0` footer band — proven in `panel/usePanel.ts` — but it protects `role`/`aria-label` and cannot own the group name or the `<dl>` semantics this card needs, so the card composes the same public `surfaceVariants` recipes instead of the component; `ModuleCard` is a named module summary, not a definition list; `Kbd`/`Table`/`ListItem` cover other responsibilities); *variant* (`Panel`'s contract is a passive content frame with no list semantics, and adding them would change its published promise); *compose* (a `Panel` + a consumer `<dl>` would re-implement the key ink, mono rhythm, success tone and caret in every view); *extract* (nothing inside an existing component hides a definition-list card).
- **Evidence / level and package:** molecule in `@egdev/ui`, proposed `packages/ui/src/molecules/terminal-card/`. The level follows the responsibility: coordinated concepts (bar, definition list, decorative cursor) that only make sense as one unit, with no section or navigation responsibility and no domain logic. Verified public React API inspected in this working tree: `packages/ui/src/index.ts` (`sha256:f85891be7d1d2ffc6d6788c9a06d87c70466213a227dec2abbd2235d2be6bd24`), `packages/ui/src/primitives/surface/types.ts` (`sha256:26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6`), `packages/ui/src/molecules/panel/usePanel.ts` (band tones `surface-2`/`surface-0`, `sha256:941368560688af0b54cd7559004209d42757ab6a0357180ccb7f5024ab876ffb`), `packages/ui/src/molecules/panel/types.ts`, `packages/ui/src/molecules/module-card/types.ts` + `useModuleCard.ts` (banded header geometry precedent), `packages/ui/src/atoms/icon/types.ts` (`terminal` glyph exists in the closed set, `sha256:673126c6aea8fc04533a323869695bf96abc5ccc732433c446c834d5be577292`), `packages/ui/src/atoms/status-dot/types.ts` (lifecycle dot states), `packages/ui/src/primitives/text/types.ts` and `packages/ui/src/atoms/stat/types.ts` (the `role="group"` + named-region precedent).
- **Web evidence (read-only, owner-granted root):** `egdev-foundation/design-system/components/TerminalCard/README.md` (`sha256:427cfea515c71b764eee76b85212e318d86ac4d6e6d1b9beb38621b26fb9e30e`) and `preview.html` (`sha256:5bf606a78ae683d3f58a243a3f72bbe00a59a5307c54fcd43e8b8367b0953ba5`); real usage in `egdev-foundation/reference-web/pulso-source.html` lines 863–872 (`.term.glass` with `.term-bar` and a `<dl>` of five pairs, `mode` carrying the caret, `status` carrying `class="on"`); compiled recipes in `design-system/components/bundle.css` (`.eg-terminal` at line 407, bar at 408–410, list at 411–414, caret at 415–417). The web card is **glass** on the black canvas and its bar only draws a bottom hairline; `docs/MATERIAL.md` prescribes a `surface-2` header band for TerminalCard over the grey register (§6).

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| `TerminalCard` root | Named group frame, Material surface and density | `div` with `role="group"` and a required `aria-label` | `TerminalCardBar`, then `TerminalCardList`, in that order |
| Bar glyph (internal) | Terminal identity mark | Existing `Icon` (`name="terminal"`, decorative by contract) | No consumer content; never labelled |
| `TerminalCardBar` | Title bar showing the current path and, optionally, the shell name | `div` with a built-in decorative glyph | Required `children` = the path text (for example `~/egdev`); optional `shell` string on the trailing edge |
| `TerminalCardList` | Ordered definition pairs | `dl` > `dt`/`dd` | `items` of `{ term, value, tone?, caret? }`; no controls, no links and no nested lists |
| Caret (internal, per row) | Decorative block cursor after a value | Internal `span`, `aria-hidden="true"` | No consumer content; rendered only when the row sets `caret: true` |

- **Radix / composition:** no Radix primitive is needed. The card is passive: a definition list with a named group has no keyboard model, focus management, selection or dismissal to delegate, so nothing is reimplemented. No `asChild`, no ref, no new dependency, no nested interactive controls.
- **Public markers:** `eg-terminal-card` is the stable public root; parts use `eg-terminal-card__bar`, `eg-terminal-card__shell`, `eg-terminal-card__list`, `eg-terminal-card__caret`. The web's `.eg-terminal` marker is not reused: this is a new component with no in-repo consumer, and the web keeps its own classes until an explicitly approved migration.
- **Reading order:** DOM order equals visual order — bar path, shell, then each definition term followed by its value. Nothing is visually reordered against the DOM, and the caret follows its value in the same line.

## 3. Public API

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | yes | — | Accessible name of the `role="group"` region. Required and non-empty; a blank name renders nothing (never an unnamed group). |
| `children` | `ReactNode` | yes | — | `TerminalCardBar` and `TerminalCardList` in that order. |
| `TerminalCardBar.children` | `ReactNode` | yes | — | The path text shown after the decorative glyph (plain text; `<span>`/`<code>` are acceptable, controls are not). |
| `TerminalCardBar.shell` | `string` | no | none (omitted) | Trailing shell name such as `zsh`. Rendered only when supplied; whitespace-only renders nothing. |
| `TerminalCardList.items` | `TerminalCardRow[]` | yes | — | Ordered definition pairs. Empty array renders an empty list and should be omitted instead. |
| `TerminalCardRow.term` | `string` | yes | — | The definition term (rendered as `dt`). |
| `TerminalCardRow.value` | `ReactNode` | yes | — | The definition value (rendered as `dd`). Readable text; an optional decorative `StatusDot` may be composed inside it. |
| `TerminalCardRow.tone` | `'default' \| 'success'` | no | `default` | `success` paints the value with the status ink; the row's visible text must still state the condition, because colour is never the only cue. |
| `TerminalCardRow.caret` | `boolean` | no | `false` | Renders the decorative block cursor after the value. Never announced, never focusable. |
| part `className` | `string` | no | — | Local layout only (width, margin, grid placement) per part; no appearance overrides, no hidden content, no reordering. |

- **Prop conventions:** [canonical registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md), looked up by meaning and alias before drafting. Applied approved entries: `label` → `accessible-name` (a required group name, as in `TabBar`/`Stat`); `items` → `collection-items` (ordered entries a composite renders); `TerminalCardRow.tone` → `surface-material-tone` (component-specific values `default`/`success`, like `NavList`/`Timeline` brand-neutral families); `TerminalCardRow.value` → `primary-value` meaning, as a nested data field rather than a control prop. `TerminalCardRow.term` is a component-specific data field with no registry entry.
- **Proposed new conventions (pending owner approval, not registered):** (1) semantic ID `shell-label`, name `shell`, meaning “short name of the shell or context shown on the trailing edge of a code-surface title bar”, component-specific type `string`; (2) semantic ID `terminal-caret`, name `caret`, meaning “whether a decorative block cursor is rendered after a value, never announced and never animated under reduced motion”, component-specific type `boolean`. The registry is not edited by this task: `skills/_shared/prop-naming.json` and `docs/prop-naming.md` are outside its edit surface, and a usage needs a `source` revision for a `types.ts` that does not exist yet. No exception is requested and no convention status changes.
- **Native props / refs:** the root forwards native `div` attributes (`data-*`, `aria-*` outside the protected set) and is merged last through `cn()` for outer layout only. `role` is fixed to `group`, and `aria-label` is owned by `label`; `tabIndex`, `aria-pressed`/`aria-selected` and `style` are protected. No ref and no `asChild`.
- **Controlled / uncontrolled:** Not applicable. No state, no timer, no typing simulation and no clock.
- **Compatibility:** new export surface (`TerminalCard`, `TerminalCardBar`, `TerminalCardList` and the types `TerminalCardProps`, `TerminalCardBarProps`, `TerminalCardListProps`, `TerminalCardRow`, `TerminalCardTone`) added to `packages/ui/src/index.ts` under Molecules. Nothing existing changes; no token, dependency or legacy-class migration is proposed. React 18/19 consumption is a plan gate, not a claim of this draft.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Card rendered with `label`, a bar and one pair | Named group, header band with path, and one term/value row | none |
| `shell` supplied | Shell name appears on the trailing edge of the bar; absent `shell` renders no trailing text | none |
| Row with `tone: 'success'` | Value uses the status ink; the visible text still states the condition | none |
| Row with `caret: true` | Decorative block cursor after the value, hidden from assistive technology, pulsing only when motion is allowed | none |
| `prefers-reduced-motion: reduce` | The caret renders static, with no animation | none |
| `label` blank or whitespace-only | The card renders nothing at all, because an unnamed group is not a valid promise | none |
| `items` with many or very long pairs | Terms and values wrap inside the two-column grid; long values wrap at word boundaries and nothing is truncated or scrolled horizontally by the card | none |
| Pointer over the card | No movement, no glow change and no pointer cursor: the card is passive | none |

- **States / representation:** no own `data-state` and no mirrored state classes. Per-row presentation is carried by `data-tone` on the `dd` so the recipe stays declarative, and reduced motion is handled by the token animation plus `motion-reduce:animate-none`, not by JS.
- **Limits / consumer responsibilities:** the consumer supplies every key, value, path and shell name, marks the caret row, keeps a success row's text readable and provides list context (a heading, caption or surrounding copy) when the group name alone is not enough. The card never executes, parses, copies or links anything.

## 5. Accessibility

- **Accessible name / roles / relationships:** the root is a `role="group"` region named by the required `label`, so the sequence of pairs is announced as one named unit (the `Stat`/`TabBar` precedent). The pairs are a real definition list: `dt` for the term, `dd` for the value, in DOM order. The internal terminal glyph and the caret are decorative (`aria-hidden`) and never join the name.
- **Keyboard / focus:** the card has no tab stop and no key handler, and contains no interactive elements. If a consumer needs an action next to the card, it belongs outside this component.
- **Announcements / other conditions:** no live region. `tone="success"` is colour plus text: the visible value must state the condition (`online`, `passing`), and the consumer may add a decorative `StatusDot` for shape. The caret pulse follows `prefers-reduced-motion` and is never the only indicator of anything.
- **Touch targets:** Not applicable — the card exposes no target of its own.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| root | one presentation | — | No `variant`, `tone` or `size` axis: the terminal frame has a single look and its width is consumer layout |
| `TerminalCardRow.tone` | `default`, `success` | `default` | Paints the value only; the term and the frame never change |
| `TerminalCardRow.caret` | `true`, `false` | `false` | At most one row should carry it; the rule is documented, not enforced |

- **Tokens / Material:** the root composes the public `surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' })` recipe plus `flex flex-col min-w-0`. `TerminalCardBar` composes the documented band recipe — `surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' })` with the bottom hairline and `rounded-t-xl`, exactly the `ModuleCard`/`Panel` banded-header geometry — which is also what `docs/MATERIAL.md` prescribes for the TerminalCard header over the grey register. Typography uses existing tokens only: `font-mono text-body-default` for the bar and the pair list, `font-sans text-label-default text-fg-secondary` for the shell name, `tabular-nums` on values, `text-fg-brand-raised` for terms (the Material brand ink for text on `surface-1…3`), `text-fg-default` for values, `text-status-success` for a success value, and the caret painted with `bg-fg-brand-default` at token sizes (`w-2 h-4`) with `animate-pulse`/`motion-reduce:animate-none`. The web's glass paint plus `--shadow-card` is replaced by the solid tonal frame Material prescribes; that substitution is an allowed difference, not a new recipe.
- **Dynamic geometry:** Not applicable. No custom property, no interpolated class string and no inline geometry is introduced; the caret is a fixed token-sized block, not a measured cursor.
- **Motion:** the only animation is the caret's existing `--animate-pulse` token, stopped under `prefers-reduced-motion`. The card and the bar have no transition, transform or hover animation.
- **Class composition / consumer layout:** the root merges `className` last through `cn()` for outer width, margin and grid placement — the card has **no built-in max width** (the web caps it at `min(100%, 420px)`), so the consumer decides; parts merge their own `className` last for local layout. `twMerge` resolves recognised utility conflicts only: no universal last-class-wins promise, no appearance-override permission and no per-instance recipe.
- **Files / pending proposals:** the six mandatory files are planned at `packages/ui/src/molecules/terminal-card/` — `types.ts` (CVA recipes, `TerminalCardProps`, `TerminalCardBarProps`, `TerminalCardListProps`, `TerminalCardRow`, `TerminalCardTone` with English JSDoc and `@control` on every own declaration), `useTerminalCard.ts` (normalization of `label`/`shell`/`tone`, protected props, per-part `cn()`), `TerminalCard.tsx` (JSX only), `TerminalCard.test.tsx`, `TerminalCard.stories.tsx` (`Molecules/TerminalCard`, English) and `index.ts`. **No stylesheet** and no extra internal module: the band, list grid and caret are expressible with token-backed utilities over `surfaceVariants`, and the one animation is an existing token. No token or dependency change is proposed.

### Expected-design visual reference

Captured for this draft on 2026-11-02 from the read-only Foundation preview through a `/tmp` harness that links `tokens.css` and `components/bundle.css` as `file://` URLs; no file inside `egdev-website` was modified.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-03 | `terminal-card--variants--1280x1400--dark.png` — two cards side by side: the left profile sheet has a title bar with a red prompt glyph, the path `~/egdev` and the shell `zsh`, then five definition pairs in a two-column mono grid, with a neon block cursor after `building` and a green `● online` status; the right project sheet shows `~/egdev/agent-teams` with `bash`, four pairs and a green `● passing` row | Project source → proposed single presentation: bar (`children` path + `shell`) and list (`items` with `tone`/`caret`); the left card exercises `caret: true` and `tone: 'success'`, the right one `tone: 'success'` only | `egdev-foundation/design-system/components/TerminalCard/README.md` + `preview.html` (SHA-256 `5bf606a78ae683d3f58a243a3f72bbe00a59a5307c54fcd43e8b8367b0953ba5`), previews built against `tokens.css` `1c92acb8…` and `bundle.css` `04797068…`; observed web design, not the DS implementation | Proposed |

- **Conditions / provenance for VIS-03:** component-zone element screenshot of the preview board (`.pv`, the labelled grid containing every previewed state), viewport 1280×1400, device scale factor 2, `chrome-headless-shell` from Playwright 1.60.0 (`playwright-core`, Chromium 1243 build), colour scheme `dark`, locale `en-US`, `prefers-reduced-motion: no-preference`, animations disabled during the screenshot, Google Fonts loaded before capture (`document.fonts.ready`; loaded faces Barlow 600 and Barlow Condensed 600/700/800, JetBrains Mono 400/500). Board height observed 279 px. Date, tool, source and per-file SHA-256 are recorded in `capture.json`.
- **Intent / acceptance / pending evidence:** the two-zone anatomy (title bar with path and shell, then a two-column definition list), the mono rhythm, the emphasized status row and the decorative cursor must survive the port. Allowed differences: solid `surface-1` frame with a `surface-2` bar band instead of the web's alpha-glass card with a hairline-only bar; `text-fg-brand-raised` terms instead of `--color-primitive-red-200` (Material contrast ink for text on raised surfaces); token mono/label steps instead of raw 13/13.5 px; the caret pulses with the existing `--animate-pulse` token instead of the web's 1.1 s hard blink; no built-in 420 px maximum width (OQ-5); the root marker is `eg-terminal-card`. Related criteria: TC-01 to TC-09. Pending: owner adoption of VIS-03, a GitHub-visible image handoff and any comparison against an implementation. Until then visual conformity is **Not evaluated**; captures never replace behavior or accessibility tests.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| TC-01 | The root renders `role="group"` named by `label`; a blank or whitespace-only `label` renders nothing | Render assertions on role and accessible name; invalid-label case | `Default`, `InvalidLabel` (documented, not a story) | Pending |
| TC-02 | The pairs render as `dl` > `dt`/`dd` in supplied order, one term before each value | Render assertions on element sequence | `Default` with VIS-03 | Pending |
| TC-03 | The bar renders the decorative `terminal` glyph (`aria-hidden`), the supplied path text and, only when supplied, the shell name | Render assertions on glyph visibility, path text and shell presence | `WithShell`, `WithoutShell` | Pending |
| TC-04 | `tone="success"` paints the value with the status ink while the visible text keeps stating the condition | Class assertion plus a readable-text case | `StatusPairs` with VIS-03 | Pending |
| TC-05 | `caret: true` renders one decorative cursor after the value, outside the accessibility tree, and it stays static under reduced motion | Render and class assertions on the caret and its motion utilities | `WithCaret`, `ReducedMotion` | Pending |
| TC-06 | Long terms and values wrap inside the two-column grid without truncation or horizontal scroll of the card | Render case with a long term/value at a narrow host width | `LongValues` | Pending |
| TC-07 | The card exposes no tab stop and no interactive descendant | `userEvent` tabbing over a rendered card | `Default` | Pending |
| TC-08 | The card has no built-in maximum width and merges root `className` for outer layout only | Class assertions on the root merge | `Widths` | Pending |
| TC-09 | Every own prop and every `TerminalCardRow` field carries English JSDoc with a supported `@control`/`@controlReason`, and the registered Controls enhancer reports no diagnostics | `storybook-docgen` / `storybook-controls` suites | Docs table review for `Molecules/TerminalCard` | Pending |

### Spec closure

- [ ] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain — **not closed**: OQ-1 to OQ-6 below.
- [x] New/changed own props have registry lookup evidence and exact applied entry IDs; the two new proposals are marked pending and no exception or approval is invented.
- [x] Proposals, verified implementation, planned checks and observed results are distinct; every promise has an acceptance ID and a method.
- [x] VIS-03 identifies a real image with provenance, conditions and related criteria; it stays Proposed and visual conformity is Not evaluated.
- [ ] Snapshot identity is recoverable and owner approval identifies this version, digest and visual hash — **pending owner approval**; status remains Draft.
- [ ] A canonical component issue exists — **Pending**: this proposal is the body of a new issue (one issue per component), and later versions must be authorized comments, never body edits.

**Next step:** the owner resolves OQ-1 to OQ-6 and approves or rejects v0.1 with its digest and VIS-03; only then does a separately approved implementation plan authorize code. This draft authorizes no code, no token or dependency change, no capture re-run, no remote publication and no terminal Git action.

## Blocking decisions for the owner

| ID | Question | Recommendation |
| --- | --- | --- |
| OQ-1 | Is the shell name a public `shell` prop on the bar (new convention `shell-label`, pending approval), or should the bar be one free slot with no chrome prop? | Keep the optional `shell` prop: it is the only trailing-aligned element of the bar, it carries no domain data, and a slot cannot express its alignment without exposing layout to consumers. Owner approval of the convention stays separate from spec approval. |
| OQ-2 | Is the decorative cursor a public `caret` flag per row (new convention `terminal-caret`, pending approval), and is the existing `--animate-pulse` token an acceptable stand-in for the web's 1.1 s hard blink? | Keep both. The caret is the component's identity, it stays decorative and hidden, and reusing the existing pulse token avoids a new keyframe token or a stylesheet; the blink cadence difference is recorded as allowed. |
| OQ-3 | Is a two-value `tone` (`default`/`success`) the right row-level presentation, with the readable-text requirement stated in the contract? | Yes. It reuses the `tone` convention, keeps colour from being the only cue, and avoids per-row colour input. |
| OQ-4 | Should the term ink be `--color-fg-brand-raised` (Material text-on-raised brand) instead of the web's `--color-primitive-red-200`? | Yes. Material reserves the neon ink for `surface-0` text; on the `surface-1` frame the raised brand ink is the compliant choice and the visual difference is recorded. |
| OQ-5 | Should the card keep the web's `min(100%, 420px)` maximum width? | No. Width is consumer layout; a built-in cap would fight the grid of any new view. The consumer sets it through the root `className`. |
| OQ-6 | Is `role="group"` with a required `label` the right root semantics, or should the card be a `<figure>` with a `figcaption`, or a section with a generated heading? | Keep `role="group"` + required `label`: it matches the web, it avoids generating a heading rank the consumer did not choose, and it follows the `Stat`/`TabBar` precedent. A section heading, if wanted, is consumer content around the card. |
