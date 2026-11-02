# Component contract — Chip

- **Version / status:** v0.2 — **Draft** (amendment of the approved v0.1 pressable contract; owner review in issue #55). Not ready for an implementation plan while Q2 and Q4 below are open.
- **Approval / recovery:** v0.1 is approved under the owner's 2026-10-17 batch grant recorded in #55 (`bb73aeca…` canonical, `d5cc4a81…` frozen body). v0.2 is **Pending**: it changes the approved v0.1 promise D1 ("Static chip and link chip → Dropped. Chip is always a pressable toggle"), so it needs its own explicit adoption. No agent may treat this file as approved.
- **Current situation / pending decisions:** Chip is implemented in `packages/ui/src/atoms/chip/` and exported from `@egdev/ui`. The web (Pulso) uses the same pill for two roles the current contract rejects: a **static** topic label and a **link** to a topic destination. Blocking owner decisions: Q2 (mode selector shape) and Q4 (whether the link mode is adopted at all). See "Open questions" after §7.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: 958fb7fde0922018be87c0155be62e916e23be887f872849c03857035bfca797`; `visualHashes: VIS-01 a45c6772f1ab77e6d14cc45a05c518a17f3ae581e601b4e04884655c548c72ae (reused v0.1 reference); VIS-02 2a7903a8d97519013730c39427865b0a5c01c92eb4d820bdc3704a948b4a97ec; VIS-03 f735de41bad0c77b774f943885ef32cf74f072c67260e8eb8f2af7d04d061ca8; VIS-04 6b71fdae5191843726c2652575c144f76dba35be0c5ffd00d3ed2332c917c70c; VIS-05 5677e54fac872067b744a379ebd6f60757244d9c96bb0dd7500451d1af0ce50e`; `approvalReference: Pending (v0.2 Draft)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/55`; `latestPublishedComment: Pending (this snapshot is prepared, not posted)`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, with LF line endings and the recorded final newline. The tracking metadata above that heading is excluded.

---

## 1. Purpose and scope

**Delta against approved v0.1.** v0.1 ships one Chip: a pressable Radix Toggle pill with `pressed`/`defaultPressed`/`onPressedChange`, an optional decorative `icon`, `chipVariants` and no stylesheet. Its decision D1 explicitly dropped the Foundation static chip and the `href` chip ("Chip is always a pressable toggle; static pills use `Badge tone="neutral"`; navigation uses `Link`"). The web catalog review (approved v0.1 draft, §3, tracking L4) recorded the reversed need: the web uses the pill as a **static topic label** and as a **link**, so one appearance serves three roles and D1 needs a new approval.

- **Need / non-goals:** one pill atom that covers three roles without forking the recipe: (a) **toggle**, unchanged v0.1 behavior; (b) **static**, a non-interactive topic/technology label rendered inline or inside a consumer list item; (c) **link**, the same pill as a real anchor to a topic or collection destination. Non-goals: tonal chips (`success`/`warning`); removable or dismissible tokens; counters or badges; group selection and roving focus (ChipGroup owns them); status semantics (Badge/StatusDot own them); a list container (`ChipList`); arbitrary destinations without a real `href`; router integration beyond native anchor events; refs and `asChild`.
- **Cataloging decision / alternatives:** **variant** of the existing atom (step 2 of `docs/CATALOGACION.md`), not a new component. *Reuse* rejected: `Badge tone="neutral" variant="soft"` is visually close but its `tone` axis is a status family, it would leave two recipes for one pill role, and it cannot express the link role; `Link` is a text link, not a pill. *Compose* rejected: a span/badge wrapped in a link with Chip classes would duplicate the recipe in the app and put appearance in consumers. *Extract* rejected: nothing is hidden inside another component. *New* rejected: no new responsibility, level or Radix base. Evidence for the gap: `reference-web/pulso-source.html` renders `.chip` spans inside ProjectCard (`.proj .chips`, 3 project cards) and one `.chip.warn` in the LabStage experiment card, and a `ul.topics` list of seven static pills in the Think/NotesBoard side column; `design-system/components/Chip/README.md` documents `href` ("Chip enlace") and `active`; `design-system/components/bundle.css:119` ships `a.eg-chip:hover`. No anchor chip is rendered anywhere in the available HTML (DOM query `a.chip, a.eg-chip, a[class*="chip"]` → 0), so the link role is documented and styled but unused: see Q4.
- **Evidence / level and package:** atom in `@egdev/ui`, existing folder `packages/ui/src/atoms/chip/`. Inspected in this repository: `packages/ui/src/atoms/chip/{types.ts,useChip.ts,Chip.tsx,index.ts,Chip.test.tsx,Chip.stories.tsx}` (whole files; `types.ts` sha256 `ba72c0a8…`), `packages/ui/src/atoms/link/types.ts` (the `href`-versus-`asChild` discriminated-union precedent), `packages/ui/src/atoms/logo/types.ts` (the `href` selects `a` versus named `span` precedent), `packages/ui/src/atoms/badge/types.ts`, `packages/ui/src/molecules/chip-group/useChipGroup.ts:89` (`chipVariants()` consumer), `packages/ui/src/index.ts:6` (`export * from './atoms/chip'`), `packages/ui/package.json:48` (`@radix-ui/react-toggle` 1.2.1 already a dependency), `docs/CATALOGO.md:66` (Chip row) and `:143` (NotesBoard row), `docs/components/web-catalog/v0.1/{cataloging-draft.md,owner-approvals.md}`. Read-only web evidence: `egdev-website/egdev-foundation/reference-web/pulso-source.html` (sha256 `778e5412…`), `design-system/components/Chip/README.md` (sha256 `b7ee7561…`), `design-system/components/Chip/preview.html` (sha256 `b165fe3c…`), `design-system/components/bundle.css` (sha256 `04797068…`).

## 2. Anatomy and composition

Exactly one root element per instance, chosen by `mode`; the icon part and label content are identical in all three.

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Root — toggle (default) | Pressable pill, pressed state, focus | `TogglePrimitive.Root` → `button type="button"` | Icon part and label |
| Root — static (`mode="static"`) | Non-interactive label pill | native `span` | Icon part and label text only; no interactive descendants |
| Root — link (`mode="link"`) | Navigation pill | native `a` with required `href` | Icon part and label |
| Icon | Optional decorative leading visual | `span aria-hidden="true"`, 14px wrapper | Consumer `ReactNode`; never focusable content |
| Label | Accessible name and visible text | text inside the root | Short, non-empty, non-truncating text |

- **Radix / composition:** `@radix-ui/react-toggle` remains the only primitive and is used **only** by the toggle root (1.2.1, already installed). No Radix link primitive exists; the link root is a native anchor. `asChild` stays unavailable in every mode (v0.1 already strips it at the runtime boundary), so a consumer router must intercept `onClick` on the anchor. The external notice reuses `@radix-ui/react-visually-hidden` (already installed and already used by `Link`, `Link.tsx:25`), or the local `VisuallyHidden` primitive at `packages/ui/src/primitives/visually-hidden`; the implementation plan must name one and keep it consistent with `Link`.
- **Public markers:** the stable root class `eg-chip` stays on all three roots, so theme selectors and legacy parity keep working. No public part markers, no `data-testid`. Legacy `.eg-chip`/`a.eg-chip` rules in `packages/ui/src/styles/legacy/bundle.css` remain until parity and an approved migration; during coexistence both apply, and the utilities win for the properties they set.

## 3. Public API

- **Prop conventions:** registry source `skills/_shared/prop-naming.json`, generated view `docs/prop-naming.md`, consulted by meaning, name and aliases before drafting any prop.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `mode` | `ChipMode` (`'toggle'` \| `'static'` \| `'link'`) | No | `toggle` | **New convention candidate `render-mode`** (see below). Selects the semantic role and the rendered element. `static` and `link` reject every pressed/disabled prop at the type level. |
| `children` | `ReactNode` | Yes | None | Visible label; the accessible name in every mode. `@control false`, non-serializable. |
| `pressed` | `boolean` | No (toggle only) | Absent → uncontrolled | Reuses `pressed-state`. Controlled pressed state. `@control boolean`. |
| `defaultPressed` | `boolean` | No (toggle only) | `false` | Reuses `initial-uncontrolled-pressed`. `@control boolean`. |
| `onPressedChange` | `(pressed: boolean) => void` | No (toggle only) | Absent | Reuses `pressed-change`. Fires on user interaction only. `@control false`. |
| `icon` | `ReactNode` | No (all modes) | Absent | Reuses `leading-icon` (Chip usage already registered with source hash `ba72c0a8…`). Decorative, `aria-hidden`, 14px. `@control false`. |
| `href` | `string` | Yes in `link`, `never` otherwise | None | Native anchor destination, declared as an own prop exactly like `Logo` and `Link` because the root element is mode-dependent. `@control text`. |
| `external` | `boolean` | No (link only) | `false` | Reuses `new-tab-navigation` (Link/SocialLink usage). Adds `target="_blank"`, `rel="noopener noreferrer"` and the hidden new-tab notice. `@control boolean`. |
| `newTabText` | `string` | No (link only) | `(opens in a new tab)` | Reuses `new-tab-notice`. Localized notice used only when `external` is true. `@control text`. |
| `disabled` | `boolean` | No (toggle only) | `false` | Native button disabled; Radix adds `data-disabled`. Not offered in static or link mode (no disabled anchors, as in `Link`). `@control boolean`. |
| `className` | `string` | No | Absent | Inherited on every root; outer layout only, merged last by `cn()`. |
| Native attributes | `button` / `span` / `a` props of the active branch | No | Forwarded to the active root | `id`, `title`, `data-*`, compatible `aria-*`, `onClick`; `aria-current` and `aria-describedby` are consumer-owned in link mode. |

```ts
export type ChipMode = 'toggle' | 'static' | 'link';

type ChipCommonProps = {
  children: ReactNode;
  icon?: ReactNode;
};

type ChipPressedProps = {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
};

type ChipToggleProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'aria-pressed' | 'disabled'
> &
  ChipCommonProps &
  ChipPressedProps & {
    mode?: 'toggle';
    disabled?: boolean;
    href?: never;
  };

type ChipStaticProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'role'> &
  ChipCommonProps & {
    mode: 'static';
    href?: never;
    pressed?: never;
    defaultPressed?: never;
    onPressedChange?: never;
    disabled?: never;
  };

type ChipLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'href'> &
  ChipCommonProps & {
    mode: 'link';
    href: string;
    external?: boolean;
    newTabText?: string;
    pressed?: never;
    defaultPressed?: never;
    onPressedChange?: never;
    disabled?: never;
  };

export type ChipProps = ChipToggleProps | ChipStaticProps | ChipLinkProps;
```

- **Registry entries reused (exact IDs):** `pressed-state` (`pressed`), `initial-uncontrolled-pressed` (`defaultPressed`), `pressed-change` (`onPressedChange`), `leading-icon` (`icon`), `new-tab-navigation` (`external`), `new-tab-notice` (`newTabText`). All six are `approved` conventions, and the first four already carry a `Chip` usage; `external`/`newTabText` add a new `Chip` usage with `source: {path: packages/ui/src/atoms/chip/types.ts, symbol: ChipProps, revision: <reviewed file hash>}` in the implementation commit.
- **New convention candidate (proposed, not approved):**

```json
{
  "id": "render-mode",
  "name": "mode",
  "meaning": "The semantic role and rendered element of a component whose behavior differs per role, when the role is not a visual treatment.",
  "whenToUse": "A component keeps one appearance and content contract but must render as a non-interactive element, a pressable control or a link.",
  "avoid": "Visual presentation (use variant), data-entry kind (use kind), selection cardinality (use type) or a boolean flag per role.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": []
}
```

  Rejected reuse: `visual-treatment` (`variant`) is explicitly visual presentation, and role is not appearance; `menu-entry-kind` (`kind`) describes data-driven entry kinds in a menu/navigation collection, not an element choice on a single control; `selection-cardinality` (`type`) is cardinality; `slot-composition` (`asChild`) would keep toggle behavior and ARIA on a consumer element, which is exactly what static must not do. Convention approval is separate from this spec and from the issue: it needs its own recoverable approval, and until then `mode` is a proposal, not a global naming rule.
- **Native props / refs:** each branch inherits its own element's props (`Omit` removes only the conflicting keys listed above). No ref is promised in any mode, unchanged from v0.1; adding one would need separate evidence.
- **Controlled / uncontrolled:** toggle only, exactly as v0.1 (`pressed` + `onPressedChange`, or `defaultPressed`); static and link have no state.
- **Compatibility:** the toggle default is unchanged, so existing `Chip` usages, stories and tests keep their behavior; `chipVariants()` with no arguments keeps the current class output, so `ChipGroup` (`useChipGroup.ts:89`) is unaffected. Public exports keep `Chip`, `ChipProps` and `chipVariants`, and `ChipMode` is added to `index.ts` (and appears publicly through `packages/ui/src/index.ts:6`). **Public type change:** `ChipProps` becomes a discriminated union, so a consumer that spreads a `ChipProps`-typed object across the component may need narrowing; the implementation plan must show the compile impact and keep the runtime boundary that ignores `asChild`, `type`, `aria-pressed` and `data-state` in toggle mode.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Toggle, default render | `button type="button"`, `aria-pressed="false"`, `data-state="off"`, class `eg-chip` | None |
| Toggle, click / Space / Enter | Turns on or off: `aria-pressed`, `data-state` update | `onPressedChange(next)` |
| Toggle, controlled parent ignores the change | State stays as `pressed` dictates | `onPressedChange(next)` still fires |
| Toggle, disabled | Not focusable, no state change, dimmed | None |
| Static, default render | One `span` with `eg-chip`; no `role`, no `tabindex`, no `aria-pressed`, no `data-state` | None |
| Static, pointer click / keyboard | Nothing happens; the element is not focusable and not announced as a control | None |
| Link, default render | One `a` with `href` and `eg-chip`; no `aria-pressed`, no `data-state` | None |
| Link, click / Enter | Native navigation | `onClick` (composed; `preventDefault` lets a router handle it) |
| Link, Space | No activation (native anchor behavior) | None |
| Link, `external` | Adds `target="_blank"` and `rel="noopener noreferrer"`, plus the hidden `newTabText` notice | `onClick` |
| Any mode, props from another mode at runtime | Ignored: the declared mode's element and semantics stand, no error dialog, no class change | None |

- **States / representation:** only the toggle root has state, expressed by Radix `data-state="on|off"`, `aria-pressed` and `data-disabled`, styled through `data-[state=on]:`, `focus-visible:`, `disabled:` and `active:` utilities. Static and link roots expose **no** own state attribute and must not be styled through `data-[state]`; visual variant classes are never mirrored.
- **Limits / consumer responsibilities:** labels stay short and never truncate; the consumer owns list semantics (`<ul aria-label>` + `<li><Chip mode="static">…</Chip></li>`), `aria-current`, router interception, and the destination itself (no `href` is invented). Group exclusivity stays in ChipGroup. Within one visual group, consumers must not mix identical-looking interactive and static chips: mode is not visible without pointer/keyboard exploration (see Q7).

## 5. Accessibility

- **Accessible name / roles / relationships:** toggle → native `button` with `aria-pressed`, name from the label text, icon hidden. Static → generic `span` with no role and no name API; the text is read in document order, and the consumer's list or heading provides the group name. Link → native `a` named by the label text; the icon stays hidden; `external` appends a visually hidden new-tab notice inside the anchor.
- **Keyboard / focus:** toggle and link are in the Tab order (Toggle and native anchor supply keys: Space/Enter and Enter respectively); static is never focusable and must not receive `tabIndex`. Focus for toggle and link is `focus-visible:shadow-focus` with the outline removed, unchanged in style from v0.1/Link. Static has no focus treatment. No arrow-key behavior; roving focus belongs to ChipGroup.
- **Announcements / other conditions:** pressed state is announced through `aria-pressed` (unchanged) and is not carried by colour alone (border, fill, glow and text tone change together). Static chips announce nothing and need no state cue. Touch targets: 44px minimum on coarse pointers for toggle and link; not applicable to static, which is not interactive. Contrast: `text-fg-secondary` on the raised surface-1 pill is unchanged from v0.1 and must be re-measured in the implementation plan, not inferred from these captures.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `mode` | `toggle`, `static`, `link` | `toggle` | `static`/`link` reject `pressed`, `defaultPressed`, `onPressedChange`, `disabled`; `link` requires `href`. |
| `disabled` | `boolean` | `false` | Toggle only. |
| `icon` | present / absent | absent | Same decorative part in all modes. |
| Size | none | — | One size, as in v0.1 (D9); no `size` axis is added. |

- **Tokens / Material:** the approved raised pill recipe is unchanged and splits into a shared base plus per-mode state utilities, all declared with CVA in `types.ts` and composed with `cn()`. Shared base (identical strings): `eg-chip inline-flex items-center gap-1.5 min-h-8 px-2.5 py-1.5 rounded-full border border-border-hairline [background:var(--gradient-sheen),var(--color-surface-1)] shadow-edge font-sans text-label-default text-fg-secondary whitespace-nowrap`. Toggle adds, unchanged: `pointer-coarse:min-h-11 cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-hairline-strong hover:[background:var(--gradient-sheen),var(--color-surface-2)] hover:text-fg-default data-[state=on]:border-primitive-red-neon/60 data-[state=on]:[background:var(--gradient-chip-active),var(--color-surface-1)] data-[state=on]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] data-[state=on]:text-fg-default active:translate-y-px active:scale-[.97] active:duration-[var(--duration-press)] active:ease-[var(--ease-snappy)] motion-reduce:active:transform-none motion-reduce:active:translate-none motion-reduce:active:scale-none focus-visible:outline-none focus-visible:shadow-focus data-[state=on]:focus-visible:shadow-focus disabled:opacity-45 disabled:pointer-events-none`. Static adds **nothing** and therefore must not resolve `cursor-pointer`, `transition-colors`, `hover:`, `active:`, `focus-visible:`, `data-[state=…]`, `disabled:` or `pointer-coarse:min-h-11`. Link adds: `pointer-coarse:min-h-11 cursor-pointer no-underline transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-hairline-strong hover:[background:var(--gradient-sheen),var(--color-surface-2)] hover:text-fg-default focus-visible:outline-none focus-visible:shadow-focus`. No new token, no handwritten shadow/gradient/colour, no new Material treatment: the pill stays the raised sheen-plus-edge element on `--color-surface-1`, and static/link reuse that base rather than introducing a flat `Surface` variant. The web's current flat `.chip` (`rgba(255,255,255,.04)`, no sheen/edge; captures VIS-02/VIS-03) is source evidence for the role, **not** the expected design for this recipe.
- **Dynamic geometry:** Not applicable. No inline style, no custom property, no interpolated class string.
- **Class composition / consumer layout:** `className` merges last on the active root through `cn()` in every mode for outer layout (margin, alignment, flex/grid placement); `eg-chip` is never dropped. `twMerge` resolves recognized conflicts only, so a consumer utility that collides with a mode recipe (for example a background utility on a static chip) is a documented limitation, not a supported appearance override. Per-part override surfaces do not exist (the icon wrapper stays internal).
- **Files / pending proposals:** the six mandatory files keep their roles — `types.ts` (CVA `chipVariants` with the new `mode` variant key defaulting to `toggle`, `ChipMode`, the three branch types, JSDoc with `@control` per branch), `useChip.ts` (branch selection, per-mode prop stripping, class composition, link `target`/`rel`/notice derivation), `Chip.tsx` (JSX for the three roots), `Chip.test.tsx`, `Chip.stories.tsx` (Atoms/Chip: `Default`, `WithIcon`, `Pressed`, `Controlled`, `Disabled`, plus `Static`, `Link`, `ExternalLink`, and a `StaticInList` composition example), `index.ts` (adds the `ChipMode` type export). **No stylesheet.** No additional internal module. No dependency change (`@radix-ui/react-toggle` 1.2.1 is already installed). No token change. Documentation outside this folder that becomes stale is proposed separately: `docs/CATALOGO.md:66` (still says "always-pressable") and `:143` (NotesBoard composes ChipGroup, while the rendered pulso topics list is static) are generated from `scripts/catalog_data.py` and are not edited here.

### Expected-design visual reference

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | [`docs/design/foundation-boards/v2026-10-17/Chip.png`](../../../design/foundation-boards/v2026-10-17/Chip.png) — "Grey raised pills with bold labels, two with leading icons, and an interactive row showing default, hover (lighter) and active (red-tinted with glow) chips" | Foundation rows: static-looking `off`, icon `off`, interactive `off`/`hover`/`on` | Foundation `components/Chip/preview.html`, board set v2026-10-17 (`bundle.css` sha256 `4f1763a5…`); **reused historical capture**, source capture version v2026-10-17, cited by spec v0.2 | Approved as v0.1 expected design (owner instruction 2026-10-17, review in #55); in v0.2 it remains the reference for the **toggle** appearance only, and it is not a fresh v0.2 capture |
| VIS-02 | `static--topic-chips--1280x900--dark.png` — "Two static topic pills on a dark card: 'Open Source' and 'TypeScript', hairline-bordered rounded pills with secondary text." | Real web static chips inside a featured ProjectCard (`.proj .chips`), no interaction | `reference-web/pulso-source.html` sha256 `778e5412…`, capture v0.2-capture-1 | Proposed (Pending owner adoption); source evidence of the role, not approved expected design |
| VIS-03 | `static--topic-list--1280x900--dark.png` — "Named topics list of seven static pills in two wrapped rows: 'Arquitectura frontend', 'Accesibilidad', 'Agentes IA', 'CSS moderno', 'Design systems', 'Testing', 'React'." | Real web `ul.topics[aria-label="Temas"]` + `li` content, static | `reference-web/pulso-source.html` sha256 `778e5412…`, capture v0.2-capture-1 | Proposed (Pending owner adoption) |
| VIS-04 | `static--icon-warning--1280x900--dark.png` — "One static pill with a leading warning-triangle icon and the label 'testing', in the warning tone (amber border, amber text)." | Real web static chip with leading icon and warning tone (`.chip.warn`) | `reference-web/pulso-source.html` sha256 `778e5412…`, capture v0.2-capture-1 | Proposed (Pending owner adoption); supports the `icon` part in static mode only; the tone is outside the v0.2 delta (Q1) |
| VIS-05 | `static--foundation-preview-row--720x480--dark.png` — "Four static Foundation `.eg-chip` pills in one row: 'Open Source', 'TypeScript', 'React', 'CLI'." | Foundation preview row 1 (`default`), static `.eg-chip` spans with no interaction | `design-system/components/Chip/preview.html` sha256 `b165fe3c…` in a read-only `/tmp` harness with `tokens.css` and `bundle.css`, capture v0.2-capture-1 | Proposed supporting reference only; it does not renew or widen VIS-01 approval |
| — | **Link mode: no capture.** No anchor chip exists in the reference page (`a.chip, a.eg-chip, a[class*="chip"]` → 0 matches); the only traces are the README `href` prop and `bundle.css:119` `a.eg-chip:hover`. No synthetic markup was rendered to fabricate one. | — | — | Not available (recorded, not pending a substitute) |

- **Conditions / provenance per VIS ID:** all captures: playwright-core 1.x driving Chromium 153.0.8010.12 (chrome-headless-shell) headless on Linux x86_64, `file://` loading, color scheme dark, `reducedMotion: no-preference`, DPR 1, force sRGB, `document.fonts.ready` plus 1.5 s, all `[data-reveal]` nodes forced to their revealed state plus 900 ms, element-level component-zone crop, taken 2026-11-02. VIS-02/VIS-03/VIS-04: viewport 1280×900, Barlow 400/500/600/700, Barlow Condensed 700/800 and JetBrains Mono 400/500 loaded. VIS-05: viewport 720×480, only Barlow 600 and Barlow Condensed 600 loaded (the chip label weight). Per-image hashes, selectors, source HTML fragments and observed computed style live in [`capture.json`](./capture.json). VIS-01 keeps its original 2026-10-17 conditions (Playwright MCP, Chromium 148, 1280×900, hover simulated with the legacy `.is-hover` class).
- **Intent / acceptance / pending evidence:** preserve pill geometry (`min-h-8`, `rounded-full`, `px-2.5 py-1.5`, `gap-1.5`), the hairline border with sheen and edge, the icon-then-label order at 14px, and the secondary-to-default text tone change on hover/on. Allowed differences against the captures: 14px `text-label-default` and a 32px minimum height instead of the web's 13px labels on 27-28px pills; the design-system sheen/edge material instead of the web's flat 4% fill; token glow instead of the web's handwritten halo. Visual conformity is **Not evaluated** until the owner adopts a snapshot; captures never replace behavior or accessibility checks, and no token value may be inferred from these pixels.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Toggle is still the default: `button type="button"`, `aria-pressed="false"`, `data-state="off"`, class `eg-chip` | `Chip.test.tsx` (existing case, preserved) | Default | Pending |
| AC-02 | Toggle still switches with click, Space and Enter and reports the next boolean | `Chip.test.tsx` with `userEvent` (existing case, preserved) | Controlled | Pending |
| AC-03 | Controlled `pressed` still wins and incoming prop updates emit nothing | `Chip.test.tsx` (existing case, preserved) | Controlled | Pending |
| AC-04 | Disabled toggle is still unfocusable and cannot change state | `Chip.test.tsx` (existing case, preserved) | Disabled | Pending |
| AC-05 | `mode="static"` renders one `span.eg-chip` with no `role`, no `tabindex`, no `aria-pressed` and no `data-state`, and is not reachable by `user.tab()` | `Chip.test.tsx` | Static | Pending |
| AC-06 | The static class set keeps the shared pill utilities and resolves none of `cursor-pointer`, `transition-colors`, `hover:`, `active:`, `focus-visible:`, `data-[state`, `disabled:` or `pointer-coarse:min-h-11` | CVA unit assertion on `chipVariants({ mode: 'static' })` plus a browser check | Static | Pending |
| AC-07 | `mode="link"` renders one `a[href]` with no `aria-pressed`/`data-state`, in the Tab order, and `Enter` activates the link while `Space` does not | `Chip.test.tsx` with `userEvent.keyboard` | Link | Pending |
| AC-08 | `external` adds `target="_blank"`, `rel="noopener noreferrer"` and the hidden `newTabText`; without `external` there is neither a target nor a notice | `Chip.test.tsx` (accessible-name query) | ExternalLink | Pending |
| AC-09 | Wrong-mode props are ignored at runtime: passing `pressed`/`href`/`disabled`/`asChild`/`type` across modes never changes the declared element, never toggles and never submits a form | `Chip.test.tsx`, extending the current runtime-boundary case | Not applicable | Pending |
| AC-10 | `icon` is `aria-hidden` in all three modes and the accessible name still equals the label | `Chip.test.tsx` (`getByRole` for toggle/link, text query for static) | WithIcon, Static | Pending |
| AC-11 | `className` merges last and `eg-chip` survives in all three modes | `Chip.test.tsx` per mode | Default, Static, Link | Pending |
| AC-12 | ChipGroup appearance and behavior are unchanged because `chipVariants()` still yields the toggle recipe | existing `ChipGroup.test.tsx` plus one assertion that `chipVariants()` equals `chipVariants({ mode: 'toggle' })` | ChipGroup stories (unchanged) | Pending |
| AC-13 | Static chips add no list semantics: inside `<ul aria-label><li>` the list keeps its name and item count, and Chip contributes no role | `Chip.test.tsx` composition case | StaticInList | Pending |
| AC-14 | Docs and stories describe all three modes, and no `@control` diagnostic is emitted for the new props | Storybook docgen/control metadata test (existing suite) | all stories | Pending |

### Spec closure

- [x] All seven blocks are complete or justified as Not applicable (dynamic geometry: not applicable).
- [x] New/changed own props have registry lookup evidence with exact applied IDs (`pressed-state`, `initial-uncontrolled-pressed`, `pressed-change`, `leading-icon`, `new-tab-navigation`, `new-tab-notice`), plus one explicitly `proposed` new convention (`render-mode`) whose approval stays separate from this spec.
- [x] Proposals, verified implementation and planned checks are distinct: every promise has an acceptance ID and a planned method; nothing is claimed as observed.
- [x] Visual IDs identify real provenance, conditions and related criteria; unavailable link-mode capture is recorded as such, and pending captures are not treated as verification.
- [ ] Snapshot identity is recoverable and the owner approval identifies this exact version, content digest, visual hashes and scope — **Pending**; the status stays Draft until then.
- [x] One canonical issue is retained (#55); v0.2 is prepared as a versioned comment with the previous snapshot (the v0.1 body plus its approval comment) identified, never a body edit or a new issue.

### Open questions for owner approval (blocking)

- **Q1 — Chip tones.** The web renders `.chip.warn` (VIS-04) and ships `.chip.ok`/`.chip.warn` in its local CSS. v0.2 does not add `tone`: status meaning belongs to Badge/StatusDot, and the Foundation Chip README itself sends statuses to StatusBadge. *Recommendation:* decline tones here, keep the observation recorded, and revisit only if a topic chip must carry a semantic severity.
- **Q2 — Mode selector shape (blocking).** Proposal: a single explicit `mode` prop with the union `'toggle' | 'static' | 'link'`, default `toggle`, with `href` required in the link branch. Rejected alternatives: (a) `Logo`-style implicit `href` inference (an anchor appears whenever `href` is passed) — rejected because a future `href` on a toggle would silently drop `aria-pressed` and change the role; (b) a `static` boolean — a second selector next to `href`, with inverted reading; (c) `asChild` with a consumer `span`/`a` — keeps toggle behavior and ARIA on the wrong element; (d) `as="span" | "a"` polymorphism without a role name. *Recommendation:* the `mode` union as proposed, plus the `render-mode` convention proposal.
- **Q3 — Static pills: Chip variant or Badge reuse (blocking).** v0.1 D1 answered "Badge". The catalog review reversed it for the web. *Recommendation:* adopt the Chip static mode, because one pill recipe then covers the same visual role across static, link and toggle, and Badge keeps its status `tone` axis; keep `Badge tone="neutral"` for labels that are not topics.
- **Q4 — Is the link mode adopted at all? (blocking).** The reference page never renders an anchor chip; the promise exists only in the Foundation Chip README and the shipped `a.eg-chip:hover` rule. *Recommendation:* adopt it, because the approved catalog gap names it and the foundation documents it; if the owner prefers the minimal delta, dropping the link branch leaves a smaller v0.2 that still closes the static role.
- **Q5 — `external`/`newTabText` in link mode.** Not exercised by the web today. *Recommendation:* include them (they reuse two approved conventions and match `Link`/`SocialLinks`), or defer both if Q4 is trimmed to destinations inside the site.
- **Q6 — Static pill size.** Captures show 13px labels on 27-28px pills (element boxes 27-29px tall); the design-system recipe uses `text-label-default` (14px) and `min-h-8` (32px). *Recommendation:* keep the design-system scale so a static chip and a pressable chip in the same row share height and type size; record the difference as allowed, not as a defect.
- **Q7 — Mixing modes in one visual group.** Static and off-toggle chips look identical; only pointer/keyboard affordances differ. *Recommendation:* allow it, document "one mode per visual group" as the consumer rule, and add no extra visual treatment in v0.2 (a future distinction would be a new appearance promise).

**Next step:** the owner answers Q2–Q4 (and decides on Q1, Q5–Q7), adopts or revises the proposed captures, and approves this exact version; only then may an implementation plan be proposed, with its own approval, and no token, dependency or catalog change is authorized by this spec.
