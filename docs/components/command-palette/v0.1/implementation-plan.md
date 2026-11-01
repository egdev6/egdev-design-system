# CommandPalette v0.1 — implementation plan

**Status: owner-approved plan, amended to native D4 in organism-wave L19.** Covers organism-wave S2–S4 / O5, coordinated with O1 / L3. The [#121 v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/121) and its [owner full-contract approval record](https://github.com/egdev6/egdev-design-system/issues/121#issuecomment-6251593347) govern behavior and scoped visual differences. Canonical payload SHA-256 `4020d3cc2a59cf9fce03c93541a6cbe375679e0c0502a1f1ebaa27eadd42d881`; frozen body SHA-256 `7c6a534ebdf6b5d09d2551773c205a0aa8a4a28b9a82bb74a8cc5a6cc04f7664`. The approval is a manual record of a forwarded owner grant, not a signed per-payload receipt; historical Draft/Pending identity declarations are superseded, not substantive promises. The owner approved this plan and later selected native D4 in L19; runtime conformity still requires verification.

## Gates and engine verdict

- **Native D4 combobox selected by the owner in L19.** No new dependency beyond the already-installed Radix Dialog is needed. The previously considered engine failed active-descendant timing and is not used.
- **`@radix-ui/react-dialog@1.3.1`, shared direct dependency with Dialog #119**: the owner approved version alignment in organism-wave L12 ("Alineadas"); reuse the installed version. Existing `@radix-ui/react-visually-hidden@1.2.13` needs no new direct dependency.
- Radix has no combobox primitive. Use the owner-selected D4 native ARIA 1.2 combobox and listbox inside Radix Dialog. The hook owns filtering, highlight, option identifiers and keyboard behavior; Radix owns modal focus and dismissal.
- D4 was explicitly selected by the owner after the earlier engine failed active-descendant timing. It retains the same public API and contract tests.
- Dialog's marker-free `dialogScrimVariants` is reused internally; do not duplicate or import its public wrapper. Verify prerequisite exports, slot/ref behavior and React 18/19 runtime. No token changes are authorized.

## File inventory

| Path | Responsibility |
| --- | --- |
| `packages/ui/src/molecules/command-palette/types.ts` | Public item, messages, filtering and props types; English JSDoc/Controls; static CVA for overlay, panel, field, row, category and messages. |
| `packages/ui/src/molecules/command-palette/useCommandPalette.ts` | Open/query wiring, reset, deduplication, normalization/filtering, highlight preservation, status, defaults and CVA/`cn`; D4 additionally owns keyboard and generated active-descendant IDs. |
| `packages/ui/src/molecules/command-palette/CommandPalette.tsx` | Dialog and native combobox composition using hook output. |
| `packages/ui/src/molecules/command-palette/CommandPalette.test.tsx` | Public interaction, accessibility, API and preservation tests. |
| `packages/ui/src/molecules/command-palette/CommandPalette.stories.tsx` | Autodocs and contract examples. |
| `packages/ui/src/molecules/command-palette/index.ts` | Named component and type exports; no internal CVA exports. |

**No stylesheet. No extra internal modules.** Integration includes `packages/ui/src/index.ts` for exports; `scripts/catalog_data.py` and generated `docs/CATALOGO.md` / `docs/catalog.json` for the approved Input/ListItem composition refinement; `skills/_shared/prop-naming.json` and generated `docs/prop-naming.md` for reviewed usages; relevant existing docgen, Controls, package export and packed-consumption tests. Do not hand-edit generated outputs or modify legacy CSS or tokens.

## API and naming

Export `CommandPalette`, `CommandPaletteProps`, `CommandPaletteItem`, `CommandPaletteMessages`, `CommandPaletteFiltering`. No public ref, native-prop spread, `asChild`, `modal`, `container`, query control, link, hotkey or navigation API. One optional `children: ReactElement` is a named, focusable, props-spreading, ref-forwarding launcher slotted via Dialog Trigger; SearchTrigger is intended, never wired twice. No trigger is required for controlled opening.

| API | Contract / convention |
| --- | --- |
| Required `items` | `collection-items`: ordered unique-id commands; `{id, label, onSelect, category?, keywords?, icon?: IconName, shortcut?, disabled?}`. Labels non-empty. Duplicate ids: development warning, first wins. Shortcut is decorative; blank omitted. |
| `label`, `dismissLabel` | `accessible-name` and `dismiss-label`, default `Search` and `Close`. Label names both hidden dialog title and input. |
| `messages` | `localized-messages`, partial overrides: placeholder `Type a command or search…`, empty `No results.`, loading `Loading results…`, count `1 result` or `${n} results`. |
| `filtering`, `busy`, `onQueryChange` | `collection-filtering` (`builtin` default or `none`), `results-busy` (false), `search-query-change` (each user edit only). |
| `open`, `defaultOpen`, `onOpenChange` | `open-state`, `initial-uncontrolled-open`, `open-change`; default uncontrolled closed; interactions request state, prop changes never echo. |
| `children`, `className` | React content and panel outer width/max-width only, respectively; merged last with `cn`, not permission for appearance overrides. |

Entry `label`, `icon`, `shortcut` map to `accessible-name`, `leading-icon`, `keyboard-shortcut-hint`; entry id/disabled are native-equivalent, `onSelect` is the established item callback, and category/keywords belong to the collection shape. No exceptions are proposed. #121 records these convention mappings and approved entries including `search-query-change`, `collection-filtering`, `results-busy`; their organism naming receipt is assistant-applied under delegation, not independent per-payload review. Recheck current [registry](../../../../skills/_shared/prop-naming.json) by meaning/name/aliases before code, then append only matching usages with actual reviewed whole-file SHA-256 and symbols; never invent hashes or infer global approval. Regenerate and run `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` only after separately authorized changes.

## Behavior, composition and accessibility

Dialog Root is always modal; optional Trigger → Portal → Overlay `eg-palette` wrapping Content. Content contains a visually hidden Radix Title, no Description (`aria-describedby={undefined}`), and a command root with field, list and hidden polite status. Prevent Radix open autofocus and focus the search input; trap Tab between input and close, restore trigger focus or pre-open focus without a trigger. Escape, outside pointer-down and IconButton Close request false; selection invokes item `onSelect` once before requesting false. An ignored controlled request stays open. Verify triggerless restoration in a real browser; do not assume Radix provides it without a trigger.

Use decorative Icon `search` md and entry Icon sm, Kbd for nonblank shortcut, and `IconButton` ghost/lg (48px) with close icon and localized accessible label. Field uses the D4 native search input, not Input's bordered well; actionable options are not ListItem's content containers. Menu is a dropdown, not an editable combobox. Use the existing Surface overlay recipe, not a cloned paint recipe. Verify actual runtime exports and slots rather than infer them from type declarations.

Hook-owned query resets to empty on every actual opening without `onQueryChange`. With `builtin`, trim, Unicode NFD normalize, remove combining marks and lowercase locale-independently; substring-match label, category or keywords, preserving input order. With `none`, render supplied items unchanged; consumer manages fetch, debounce, cancellation and results reset on opening. Busy leaves supplied rows visible, appends loading, suppresses empty, sets list `aria-busy` and announces loading. Otherwise announce empty at zero or localized count when the result set changes, not every keystroke when unchanged.

First enabled item is highlighted on opening and query-driven result changes; on consumer `items` updates retain its id if still rendered/enabled, else first enabled. Arrow keys wrap and skip disabled; Home/End select first/last only for empty query, otherwise retain native caret movement; pointer move highlights enabled rows; highlighted row scrolls into view. Enter/click on enabled row selects once; disabled or no highlight does nothing. No option receives DOM focus. The native D4 hook owns highlight and update timing for these distinctions.

The combobox has label, `aria-expanded`, `aria-controls`, and active descendant referring to a present enabled `role=option` in `role=listbox`; option accessible name is label then category, with icons and Kbd hidden. No active descendant when there is no enabled item. The status is `role=status` / polite and hidden through VisuallyHidden. In D4, native input additionally has `aria-autocomplete=list`, IDs are generated per instance with `useId()`, option rows carry `aria-selected`/`aria-disabled`, and the hook implements the exact keys, pointer, scrolling and selection rules above. Verify IME composition, native text editing, focus restoration and screen-reader behavior for either engine.

The component installs no document hotkey listener, reads no `navigator` or `location`, owns no index or routing, and supplies no product entries. Consumer owns at most one page-level Mod+K listener, `preventDefault`, repeat/IME/editable-field policy and cleanup; show SearchTrigger's hint only when bound. Route inside `onSelect`. Large-list virtualization, groups and nested pages are out of scope.

## Material and layout

Static CVA in `types.ts`, `cn()` per part, data/ARIA state variants rather than mirrored classes. Overlay uses `eg-palette fixed inset-0 flex items-start justify-center px-(--gutter) pt-[12vh]` plus the **unchanged internal** `../dialog/types` `dialogScrimVariants()` (`bg-bg-scrim/72 backdrop-blur-none`, paint only). Panel composes `surfaceVariants({ tone: 'overlay', padding: 'none', radius: 'xl' })` with `w-full max-w-150 p-2 text-fg-default`: existing overlay fill, blur/saturation, strong hairline and edge/elevation shadows; solid surface-2 on reduced transparency or unsupported filter. No new tokens, handwritten shadows, gradients or color mixes.

Field: `group relative flex items-center gap-2.5 px-3 py-1.5 border-b border-border-subtle text-fg-secondary`; input `h-11 min-w-0 flex-1 bg-transparent border-0 outline-none font-sans text-body-default text-fg-default placeholder:text-fg-muted`; decorative focus underline `h-0.5 bg-focus-ring`, initially transparent and visible on `group-focus-within`. List `max-h-[50vh] overflow-y-auto py-1.5`; row `flex items-center gap-3 p-3 rounded-md font-sans text-body-default`, selected semantic primary fill plus 2px inset inverse-focus outline, disabled 45% opacity and not activatable. Category is `font-display text-label-eyebrow uppercase text-fg-secondary`; messages use body-default muted. Viewport fractions are expressly approved geometry exceptions in D20, not new tokens.

Fade and 6px rise use static `starting:` and `--duration-fast`/`--ease-out`; rise only under motion-safe, no reduced-motion transition, immediate exit. No new z-index utility: existing legacy `.eg-palette` z-index 80 remains while legacy CSS is loaded. No `eg-palette__*` or `.is-active`; preserve legacy consumers. Test computed cascade with legacy CSS: `cn`/`twMerge` handles recognized utility conflicts but cannot enforce the width-only restriction or universal precedence. Stop for owner resolution if unsupported consumer appearance classes or the legacy cascade cannot satisfy the contract.

## Test-first and evidence plan

After approval, write behavior tests first and record actual RED, then implement minimally and record GREEN; add preservation checks for touched existing shared behavior. Planned checks, not observed results:

1. AC-01/02/07: trigger and controlled open, empty focused input, initial enabled highlight; accent/case/keyword/category substring and order, `none`, each edit callback but no reset callback; reopen reset; item updates preserve valid highlight and replace invalid highlight.
2. AC-03–06/10: empty, busy with rows and suppressed empty, all message overrides and status timing; enabled/disabled, wrap, Home/End with both empty and nonempty text, pointer and scroll, Enter/click exact callback order, no-op cases; Escape with query, outside and close, controlled refusal, Tab trap and both restoration routes. Check roles, relationships, IDs, names and decorative content. Exercise multiple instances, duplicates first-wins and warning.
3. AC-08/09/11: real-browser computed Material, shared veil, legacy cascade, inverse outline, underline, targets ≥44px/close 48px, disabled opacity, reduced transparency and motion; no component-owned global binding or browser globals. Cover existing composed SearchTrigger, IconButton, Surface, Kbd and Dialog behavior where touched.
4. AC-12: named exports and contract types, no extra files, static CVA scan and actual CSS build, real docgen plus registered enhancer/inference with zero owned diagnostics and browser Controls; packed consumer without Tailwind on React 18 and 19. Focused tests first, then parent-authorized full local Verify set including `pnpm props:check` and `pnpm test:props`, package consumption and integration. The parent owns RDD, review and delivery.
5. Compare runtime captures against VIS-01 and VIS-02 under comparable conditions; record differences per criterion, not snapshots as proof of behavior. VIS-01 `db24e6adbea2109bde84f67331268b1f9c8ced867fdb19a71191802c95c1b789`, [board metadata](../../../design/foundation-boards/v2026-10-18-wave3/capture.json): Chromium 148/Linux, 1280×900, DPR 1, dark, fonts loaded, reduced motion off. VIS-02 `e4093ba741679c5a8d5622336fc9c1ad73a6f5d272c97668e843ca816ff4261c`, [specimen metadata](../../../design/foundation-boards/v2026-10-18-wave3/specimens/capture.json): 1280×900, DPR 1, reduced motion off, theme and reduced transparency not recorded. Allowed differences include 72% veil without blur, 48px close, 16px input/empty text, 14px tag, inverse outline and English copy. Visual conformity: **Not evaluated**. Manual NVDA/VoiceOver and real-browser focus/media checks remain separate evidence.

## Stories and Controls

`Molecules/CommandPalette`: Default (controlled, reference consumer Mod+K effect), WithSearchTrigger, Shortcuts, Empty, Busy, RemoteResults, Localized, Controlled. Stories use `action` for applicable callbacks, real `Meta`/`StoryObj`, autodocs, no manual `argTypes` or `play`. Default does not override runtime defaults. Annotate every own public declaration and union branch with English `@control`: text for strings, boolean for booleans, select for finite filtering, false with concrete reasons for item arrays, elements, message objects and callbacks. Only actual constant defaults receive `@default`; verify real docgen, enhancer/inference and browser widgets independently.

## Risks and owner questions

1. The owner selected native D4 in L19; the already-installed shared `@radix-ui/react-dialog@1.3.1` remains the only Dialog dependency.
2. Dialog is implemented; reuse its internal shared veil without exporting it.
3. D4 owns keyboard and ARIA behavior in the hook; verify every acceptance criterion rather than weakening tests.
4. Triggerless focus restoration, SearchTrigger slot/ref compatibility, Surface recipe exports and real React 18 behavior need runtime proof; types alone are insufficient. Width-only `className` is a documented constraint, not an automatic `twMerge` security filter.
