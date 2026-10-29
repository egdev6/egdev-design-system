# SocialLinks v0.1 implementation

## Authority and scope

- Contract: [#104 v0.1](https://github.com/egdev6/egdev-design-system/issues/104), adopted by the [owner approval](https://github.com/egdev6/egdev-design-system/issues/104#issuecomment-6251563933).
- Canonical payload SHA-256: `945bf1cfb681830b10f1ff8a9354870e1f7a1aef26d53fd895dfea8262e28e08`.
- Original issue-body SHA-256: `409c7f0381741377f78c2f1bba482e0f1691e1dd2276f9bce7e04f803d971b7a`.
- Implementation follows the delegated molecules-build T10 / S1–S4 work: compose only prerequisites already exported from main, no new dependencies/tokens, focused memory-capped checks, parent-owned Git/PR/full gates.
- Six meaningful files in `packages/ui/src/molecules/social-links/`. **No stylesheet**, extra internal modules, own interaction state or peer changes.
- Public exports: `SocialLinks`, `SocialLinksProps`, `SocialLinkItem`, `SocialLinksVariant`, `SocialLinksSize`, `SocialLinksGap`. Hooks, CVA recipes and the native helper remain internal.

## Decisions implemented

| Decision | Implementation / protection |
| --- | --- |
| D1 | IconButton asChild composes genuine HTTPS anchors. Native Enter, Space, click and pointer semantics are not replaced. Link is not nested inside another appearance engine. |
| D2 | Stack/Cluster asChild root div; Cluster asChild named ul with role=list and direct li children. No navigation/menu/toolbar model. |
| D3 | List label defaults to Social profiles; separate caption defaults to Follow me. Null/blank caption removes its node. Blank list names warn and fall back. |
| D4 | Ordered stable data ids, explicit destinations/names and supplied decorative Icon elements. No account data, glyph inference or DOM ids from keys. |
| D5 | external is per entry and opt-in. Only true creates target=_blank and secure rel. Rel tokens are deduplicated case-insensitively, preserving first spellings and custom tokens. |
| D6 | The complete label plus one localized notice reaches IconButton's existing AccessibleIcon. No duplicate aria-label, description or hidden hint. Blank notice warns and falls back. |
| D7 | outline/ghost and md/lg pass directly to IconButton; default lg is 48px, explicit md is dense 40px desktop only. IconButton controls geometry, Material, focus and motion. |
| D8 | List gap 1/2 is delegated to Cluster; root Stack gap 3 or inline wrapping Cluster gap 4. No layout measurement or ordering logic. |
| D9 | Raw controls are rejected before trimming/URL parsing. Only absolute HTTPS with hostname and no credentials is forwarded. Invalid ids/names/URLs and later duplicate ids warn in development and are skipped. First occurrence reserves the id, even when invalid. Empty/all-invalid data renders nothing; more than six entries is supported. |
| D10 | No selection, loading, disabled, pressed state, own data-state, interception or tooltip. Native listeners observe bubbling. Retained keyed links retain focus/identity on data rerender. |
| D11 | eg-social, eg-social__label and eg-social__list remain markers; primitive and atom markers remain theirs. No legacy modifier classes or migration. |
| D12 | Hook owns validation, derived names/rel, layout choice and per-part cn/CVA. Root native attributes stay on the div. className supports outer sizing/margins/placement only, not appearance or internal layout overrides. |

## Styling and metadata

CVA in types.ts adds only collection markers, minimum intrinsic sizing, native list/caption resets, direct-item flex and caption token typography. Stack/Cluster and IconButton recipes are composed, never copied. Utilities layer after the retained legacy component layer; no marker-based appearance engine is added. Slot class concatenation is not universal twMerge precedence; only non-conflicting child classes are supported.

`compiled.css` adds the exact production types.ts source. Storybook already discovers all hierarchy levels with its recursive stories glob; no duplicate stories glob is necessary. The native-prop allowlist and preview story source are additive. Story title is `Molecules/SocialLinks`; all nine specified scenarios are included. The constrained story supplies token-backed external container geometry, not implementation appearance.

All eight root own props and six nested item fields have JSDoc controls. Nullable caption and structured items retain their full public types and disable only their controller, with concrete reasons and dedicated examples. Real docgen and installed extraction/enhancement/inference tests verify requiredness, defaults, enum values and zero metadata diagnostics. Caption's nullable union produces an unquoted `Follow me` Docs summary in the installed pipeline; string-only defaults are quoted by Storybook. No manual argTypes, fabricated defaults or initialized optional args hide these distinctions.

## Naming evidence

The reviewed types.ts is registered by whole-file SHA-256 under existing conventions only:

- SocialLinksProps: collection-items, accessible-name, group-caption, inline-caption-layout, visual-treatment, preset-dimensions, layout-gap, new-tab-notice.
- SocialLinkItem: accessible-name, new-tab-navigation, leading-icon (the existing IconButton.icon input is delegated, not a new icon-only-control permission).
- id, href and rel are structural/native fields, not new conventions. No approval, convention definition, alias or exception changed.

## Verification

- RED: behavior tests observed missing named list/links against the initial null-rendering component (30 failures, one hook pass). Initial missing-module failure was also observed before files existed; it is not the behavior RED claim.
- GREEN: 31/31 focused behavior tests passed with real atoms/primitives, including exact names, native keyboard/events, validation boundaries, list semantics, SSR and keyed focus retention.
- Metadata/behavior: 258/258 across SocialLinks, Storybook docgen and Controls passed.
- Naming: props:check passed; test:props passed 87/87; props:docs and catalog generation completed.
- `pnpm build` passed once with MemoryMax=2G, emitting UI JavaScript/declarations/CSS and compiled native tokens. `pnpm test:package-exports` then passed 51/51, including both exact export inventories and SocialLinks SSR/static CSS checks.
- Preview CSS: 53/53 passed after building tokens. The first attempt lacked built tokens; the next exposed Tailwind's nested `--tw-tracking` fallback, which the CSS fixture now accepts without weakening the required typography token.
- `pnpm lint` and `pnpm typecheck` passed. Early fixture-only failures (atom size class spelling, nullable-caption summary and the barrel inventory) were corrected; no atom/primitives behavior was mocked or changed.
- Packed consumer fixtures cover all six public exports, type negatives, SSR, client keyed focus/caption/empty rerenders, exact runtime inventory and shipped CSS with/without consumer Tailwind. Execution belongs to the parent; **not run by this writer**.

## Evidence limits / follow-up

Visual conformity: **Not evaluated**. No browser/Storybook server was launched. Owner review must compare approved VIS-01/VIS-02 with legacy CSS loaded, narrow widths, RTL, 200%/400% zoom, unclipped keyboard focus and reduced motion. Browser accessibility-tree/screen-reader names and actual Controls widgets remain unverified; JSDOM metadata/class/CSS checks are not substitutes. No network reachability or destination-ownership guarantee is made.

The writer leaves changes uncommitted. The parent owns full gates, packed React 18/19 consumption, review, commits, push and PR creation.
