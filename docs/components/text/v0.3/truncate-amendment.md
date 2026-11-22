# Text v0.3 — single-line truncation amendment

- **Version / status:** v0.3 — Approved 2026-11-22 (owner, in session; odd/tasks/consumer-request-specs.md L6). Implementation plan requires separate approval.
- **Amends:** the [approved Text and Heading v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/108#issuecomment-6251575943) and [Text v0.2](../v0.2/body-tone-amendment.md). Except for the explicitly opt-in changes below, their promises remain unchanged. Request: [#538](https://github.com/egdev6/egdev-design-system/issues/538); context: [Recado #41](https://github.com/egdev6/recado/issues/41).
- **Approval / recovery:** Owner session 2026-11-22, recorded verbatim in this file's resolved decisions and in odd/tasks/consumer-request-specs.md; this spec is not an implementation authorization. A separate plan approval is required. No code, token, dependency, registry or GitHub change is authorized here.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: fd8f0fdebc2bfd898a51cee69f94685cc64a9f877045f151fea609b202fcd799`; `visualHashes: Pending`; `approvalReference: owner session 2026-11-22 (odd/tasks/consumer-request-specs.md L6)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/108`; `latestPublishedComment: Pending verification`. #538 is the request, not a replacement for the canonical component issue.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and the final newline. Tracking metadata above is excluded. Approval must identify this version, payload digest and any adopted visual hashes.

## 1. Purpose and scope

**Proposal:** add an opt-in, one-line ellipsis to passive `Text` wherever a consumer supplies a bounded inline size. Recado's compact card needs two independently truncated lines while keeping the full title and secondary text reachable. The host owns its card layout and full-text route. Multi-line clamping, automatic overflow detection, a new text component, automatic tooltips and modifications to `ListItem` are out of scope.

**Cataloging:** reuse and extend the existing `@egdev/ui` Text primitive. Existing variants choose typography, not truncation; consumer `className` is not an appearance override, and a `ListItem`-only switch would not be reusable elsewhere. A new component or extraction would duplicate passive typography. Compose `Text` inside existing `ListItem` parts instead. This is a proposed contract expansion, not a new cataloging or implementation approval.

**Evidence obtained, not validation of the proposal:**

- The public barrel exports `Text`, `Heading`, `ListItem` and `Tooltip` (`packages/ui/src/index.ts:41`, `:67`, `:235-236`). `Text` renders a paragraph or Radix Slot; it has no public ref (`packages/ui/src/primitives/text/Text.tsx:9-20`). Its public props have `asChild`, not an `as` element selector (`packages/ui/src/primitives/text/types.ts:283-296`).
- Despite sharing `types.ts` and the barrel, `Heading` has a separate public type, hook and native h1–h6 renderer (`packages/ui/src/primitives/text/Heading.tsx:6-12`, `packages/ui/src/primitives/text/useHeading.ts:27-47`, `packages/ui/src/primitives/text/types.ts:304`). **Decision for this draft:** #538 requests `Text`, so `Heading` does not gain `truncate`; sharing a directory is not sufficient reason to change the heading contract. A real heading can contain a slotted, non-heading `Text` span as illustrated below.
- `ListItemContent` promises it is never *automatically* clamped or hidden (`packages/ui/src/molecules/list-item/ListItem.tsx:23-24`); its long-content story explicitly excludes ellipsis and tooltip (`packages/ui/src/molecules/list-item/ListItem.stories.tsx:354`). `ListItemTitle` is a native heading and `ListItemMeta` a div, not wrappers that render `Text` internally (`packages/ui/src/molecules/list-item/ListItem.tsx:30-32`, `:47-50`).
- The owner triage on [#538](https://github.com/egdev6/egdev-design-system/issues/538) selects an optional Text prop, with full text accessible and ListItem's default preserved. Its issue body describes a 440px Recado panel, two independent lines and an existing issue-backed TODO/allowlist mitigation. Keep that mitigation until the shipped change is verified in the consumer; this draft does not establish card-wide layout parity.

## 2. Anatomy and composition

| Part | Proposed responsibility / element | Content |
| --- | --- | --- |
| Text root | Existing `p`, or the one compatible non-heading element supplied with `asChild`; no new wrapper | Passive phrasing content, including native `strong`; the root is the clipping box only when opted in. |
| Existing decoration and accent | Existing eyebrow pseudo-element and optional trailing accent span | Decoration remains decorative. On opt-in, the accent joins the same visual line; its text remains in reading order. |
| Host full-text access | A separate, consumer-owned visible details link or disclosure outside the clipping box | It makes the complete value available visually to pointer, keyboard and touch users. No new Text control or focus stop. |

Keep `eg-text`, `eg-text__accent` and the existing native/Slot semantics. Radix Slot is already used for `asChild`; no new Radix primitive, ref API or dependency is proposed. The consumer supplies valid HTML and keeps focusable elements outside the clipping box. An interactive ancestor, such as an existing whole-row link, may contain the passive Text if its own focus indicator is not clipped.

### ListItem composition

No `ListItem`, `ListItemTitle` or `ListItemMeta` prop needs to forward truncation: the consumer explicitly renders `Text` inside the appropriate part. In an editorial row, a `p` inside `ListItemTitle` would be invalid heading content, so use a slotted span. `self-stretch` is a permitted self-alignment, not an appearance override; it matters because the editorial Body is a column with `items-start`. The host must still bound the row's width. Example, with `note.href` resolving to a view that actually displays **both** complete values:

```tsx
<ListItem variant='editorial'>
  <ListItemBody>
    <ListItemTitle level={3} className='self-stretch'>
      <Text asChild={true} variant='body-large' truncate={true} title={note.title}>
        <span>{note.title}</span>
      </Text>
    </ListItemTitle>
    <ListItemMeta className='self-stretch'>
      <Text asChild={true} variant='body' foreground='muted' truncate={true} title={note.project}>
        <span>{note.project}</span>
      </Text>
    </ListItemMeta>
  </ListItemBody>
</ListItem>
<a href={note.href}>View full note</a>
```

Alternatively, two ordinary `Text` paragraphs can be children of `ListItemContent` in a card/compact composition. The consumer chooses title emphasis and supplies full-text access; native `title` in the example is supplementary only. Current root, Body, Content, Title and Meta recipes have `min-w-0` at the locations shown in `packages/ui/src/molecules/list-item/types.ts:138-140`, `:185-203`, `:214`; other flex/grid ancestors still need inspection. The example's actual sizing and keyboard/touch route are **planned checks**, not observed results. ListItem's row recipe is allowed to wrap (`types.ts:140`); this amendment does not promise a single row or fixed card height at every width, nor does it modify the independent action or its hit area. Parent cross-checks the complete Recado card with the separate #540 proposal.

## 3. Public API

| Prop / input | Type and default | Proposed rule |
| --- | --- | --- |
| `Text.truncate` | New optional `boolean`; omitted or `false`: no truncation; `true`: opt in | Available on every existing Text variant; consume it in Text rather than forwarding it as a DOM/Slot attribute. Only the literal boolean `true` enables it at an untyped boundary. Proposed JSDoc: `@default false` and `@control boolean`. No new event or controlled state. |
| `variant`, `foreground`, `tone` | Existing types, restrictions and defaults | Orthogonal to truncation. Preserve the default `eyebrow`, all typography, allowed foreground/tone combinations and their token choices; no new variant or tone. |
| `accent`, `accentBreak` | Existing types; `accentBreak` defaults to `true` for display recipes | With `truncate=true` only, render an existing non-empty accent inline even when `accentBreak` is omitted or true; otherwise two lines would contradict the opt-in. Preserve its content, order, tone and glow recipe. `false` or omitted `truncate` restores the existing block/inline behavior. |
| `asChild`, native attributes including `title`, `lang`, `dir`, `id` | Existing types and defaults; no `as` prop | Default root remains `p`; one prop-spreading non-heading Slot child remains the actual element. With truncation it must be a passive, non-focusable, CSS-block-compatible element containing passive phrasing content. Existing consumer-supplied `title` passes through; Text never synthesizes or overwrites it. |

The opt-in changes the clipping root's CSS display to `block`, including a slotted `span`. Its native tag and semantics do not change, but it no longer flows as an ordinary inline phrase. Consumers needing inline prose or a focusable Text root must not opt in; do not add a wrapper or silently change `asChild` when false. Explicit hard-break elements, nested block boxes and focusable descendants are unsupported within a truncating root; the component does not promise to inspect or reject arbitrary React children. Keep controls and their focus indicators outside the clipped root. An ancestor link may own interaction and its own focus ring.

**Naming lookup:** checked meaning, canonical name and aliases for `truncate`, `clamp`, `lines`, `ellipsis`, `wrap` and `nowrap` in the [registry source](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md). No existing entry represents single-line text ellipsis. The nearby approved `accent-line-break` / `accentBreak` explicitly excludes truncation (`skills/_shared/prop-naming.json:6298-6302`); `control-label-wrap` / `labelWrap` explicitly excludes arbitrary children and truncation (`:8450-8454`); `section-content-wrap` / `wrap` means a section wrapper (`:8288-8292`). None is a match.

**New convention proposal:** semantic ID `single-line-text-truncation`, canonical name `truncate`, meaning “opt in to visually eliding overflowing text to one line without removing its underlying content”; Text-specific usage `truncate?: boolean`, default `false`. Avoid multi-line clamp, data mutation and interactive-content clipping. Status `proposed`, `approval: null`; no aliases or scoped exception are proposed. Existing `slot-composition`, `visual-treatment`, `surface-material-tone` and `accent-line-break` continue to describe unchanged APIs, not the new concept. A spec approval does not itself approve a global convention.

Reviewed current baseline: `{ path: 'packages/ui/src/primitives/text/types.ts', symbol: 'TextProps', revision: 'sha256:5ef0768327e1ad973783f0907b8a0f5f3a0b0975507bdc94499cda219f6a0b7e' }`. The symbol does **not** yet contain `truncate`; the baseline hash is not evidence of an implemented usage. A separately authorized implementation must review the resulting source and record its real revision in the registry; this draft changes neither registry nor generated view.

**Compatibility:** omitted/false leaves existing Text behavior, defaults, markers, supported merges, accents, children and Slot/ref restrictions unchanged. Heading and ListItem APIs are unchanged. This is a TypeScript API addition only for Text; no migration is required for existing calls. `title` and other native attributes remain consumer-owned. React 18/19 compatibility and actual docgen/Controls are planned package checks, not inferred from types.

## 4. Behavior

| Input / condition | Proposed observable result |
| --- | --- |
| `truncate` omitted, false or an untyped non-boolean value | No truncation; consume the new prop without leaking it. Omitted/false preserves the existing rendering. No automatic clipping, title, tooltip, focus or extra DOM node. |
| `true`, passive phrasing content, finite constrained inline size, content overflows | One visual line; hide overflow and show the browser ellipsis at the inline end. Preserve the complete DOM text, including any accent and semantic `strong`, in original order. No character-count slicing or content mutation. |
| `true`, content fits | One line with no ellipsis. If the available width cannot fit the ellipsis glyph itself, the browser may clip it; no legibility is promised at zero or near-zero width. |
| Long unbroken text; RTL or mixed-direction text | No wrapping of the long token; native CSS ellipsis follows the resolved text direction (left edge for a simple RTL line). Preserve logical source and accessibility-tree order; do not reverse or manually insert characters. |
| `true` with a display accent / eyebrow | The accent is inline even for default/true `accentBreak`; the eyebrow remains a decorative diamond followed by text. Without truncation, existing block accent and `inline-flex` eyebrow behavior remain unchanged. |
| Nested focusable content, `<br>` or a block descendant in the clipping box | Unsupported for this opt-in; no focus, layout or single-line guarantee and no runtime tree-validation promise. Place controls outside or do not truncate. No interception of existing ancestor/other control interaction. |

**Sizing ownership:** Text supplies `min-width: 0` on its own truncating root, but cannot change the min-content sizing of flex/grid ancestors. The consumer bounds the available inline size and sets `min-width: 0` (or the applicable logical equivalent) on **each flex/grid item in the shrinking path**, including wrappers where necessary; grid tracks must themselves permit shrinking. Setting it only on Text does not repair an unshrinkable ancestor. The owner of each ancestor supplies that layout; no measured-width observer or viewport breakpoint is added. Native keyboard behavior and state management are not applicable to passive Text.

## 5. Accessibility

**Selected proposal:** retain the full, unsliced children and accent in the DOM. Text itself adds no `aria-hidden`, automatically generated `aria-label` or duplicate announcement, and preserves consumer-authored child attributes. Screen readers can read the full meaningful text regardless of visual truncation; where it names a heading or an ancestor link, its full text remains available to that name, subject to the consumer not overriding or hiding it. A passive paragraph does not thereby acquire a new accessible name, role, tab stop or live region. Verify actual screen-reader reading order as well as DOM/accessibility-tree relationships; the latter alone is not assistive-technology proof.

For visual access, the consumer must provide an always discoverable, visible, keyboard- and touch-operable route or disclosure outside the clipping box which exposes the **complete** text, including the secondary line when present. A pre-existing action can fulfill this only if it actually exposes both values and retains an accessible name and focus indicator. The host owns the route/disclosure, localization and focus behavior. Text itself neither adds an action nor makes itself focusable. Full text in an accessible name alone is not a visual-access solution.

**Alternatives evaluated:** native `title` is already an inherited attribute, useful as supplementary pointer help but unreliable for keyboard and touch, so it cannot be the only route. The public DS `Tooltip` describes rather than names one focusable, ref-forwarding trigger (`packages/ui/src/atoms/tooltip/types.ts:5-17`); its own story explicitly says it is unavailable on touch and must not contain essential information (`packages/ui/src/atoms/tooltip/Tooltip.stories.tsx:18-20`; touch test at `Tooltip.test.tsx:151`). Passive Text has no public ref or focus stop. A tooltip is therefore optional supplementary content, not a substitute for the route or for the full accessibility-tree text. No automatic `title` is inferred from arbitrary React children or accents.

## 6. Appearance

| Axis | Opt-in proposal | Unchanged / limitation |
| --- | --- | --- |
| One-line geometry | Static CVA utilities equivalent to `block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap` on the Text root | Only while `truncate=true`; no fixed width. CSS ellipsis is a visual marker, not a substituted string. Layout needs a shrinkable host. |
| Eyebrow | Override its `inline-flex` root for a block formatting context; retain the existing token-sized rotated decorative diamond and token gap, using static pseudo-element utilities | The before pseudo-element must be inline-block and use logical end spacing equivalent to the existing gap. Centering and clipping are subject to the planned browser/visual check; do not claim current `inline-flex` itself can ellipsize the text. |
| Accent | Retain the existing accent span, tone and glow recipe; select inline layout only on opt-in | Root overflow may clip painted glow at its edge; evaluate it visually, do not promise an unclipped glow. Default block accent remains when not opted in. |
| Typography and foreground | Existing variant, semantic foreground and accent-tone token utilities | No new color, font, spacing, shadow or Material recipe; the host still owns its background and contrast. |

Use static CVA choices in `types.ts`, composed through `useText` with `cn()`. No inline appearance, dynamic classes, new token or dependency. **No stylesheet** or extra internal module is proposed; the existing roles are `types.ts` (props/CVA), `useText.ts` (derivation), `Text.tsx` (JSX), `Text.test.tsx`, `Text.stories.tsx` and `index.ts` (exports). Shared Heading files and legacy CSS stay unchanged unless a separately approved plan identifies an unavoidable shared-file edit.

Text's existing `className` remains outer layout only: margins, width constraints and flex/grid placement. Its existing tag is exactly `@classNameAllows width min-width max-width inline-size min-inline-size max-inline-size` (`packages/ui/src/primitives/text/types.ts:279-283`); no new property allowance is proposed. Base self-alignment and zero minimums are already allowed by the shared contract. Supported layout classes are merged last by `cn()` for recognized utility conflicts, while the prop owns overflow, whitespace, ellipsis and display; `className` is not permission to override those or typography/color. Slot child classes are also retained; conflicting child CSS and arbitrary selectors/cascade are not covered by `twMerge` or a universal last-class-wins promise. Test supported width/placement merges and non-conflicting Slot classes.

### Expected-design visual reference

| ID | Scenario / descriptive alt text | Source, conditions and status |
| --- | --- | --- |
| VIS-01 | Pending: two bounded single-line Text values in a compact ListItem, with the title visually stronger and an adjacent full-text route | Expected-design source/version, real image, viewport, device scale, browser/version, theme, loaded fonts, motion/transparency, component crop, capture date/tool, SHA-256 and human adoption all Pending. |
| VIS-02 | Pending: narrow LTR and RTL overflow, long unbroken text, eyebrow diamond and inline accent | Same source, conditions, provenance, hash and approval Pending. |

No authorized capture or expected-design source was supplied; old Text v0.1/v0.2 captures are not approval for truncation. Visual conformity is **Not evaluated**. Exact next step: agree on the expected-design source, each scenario and capture conditions; obtain read-only source/hosting and real-browser permission (including separate server-start permission if needed); use Playwright MCP to capture each component zone, inspect the PNGs and record provenance, conditions and hashes in `docs/components/text/v0.3/capture.json`; then obtain recoverable human adoption of the exact images. Follow the [visual guide](../../../design/README.md). Do not implement merely to fabricate an expected reference, copy unrelated artifacts, or treat a capture as a behavior/accessibility test.

## 7. Acceptance criteria

All checks below are **planned**, not observed. Stories demonstrate scenarios; they do not replace behavior tests. Browser geometry, actual assistive technology and expected-design comparison are separate evidence.

| ID | Observable promise | Planned test / method and story | Visual / observed evidence |
| --- | --- | --- | --- |
| AC-01 | `truncate` is optional boolean, defaults false, literal true opts in, false/omitted and untyped non-booleans do not; it never leaks to the native or slotted element. | Public DOM/rerender and positive/negative type tests, including untyped inputs; docgen and boolean Controls check. | Pending; visual not applicable to prop typing. |
| AC-02 | Bounded passive text fits or renders a single ellipsized line without slicing children; long unbroken text, LTR, RTL, mixed direction and insufficient-marker width follow the specified limits. | Browser computed-style, geometry and rendered-pixel inspection with full DOM text assertions; bounded, unbounded, fits, overflow and direction stories. JSDOM alone cannot prove ellipsis. | VIS-01/02 Pending. |
| AC-03 | Every Text variant can opt in; default eyebrow diamond, title accent, inline override of `accentBreak`, tone/glow and body/foreground combinations follow the delta, including toggle back to false. | Public DOM tests and browser computed-style checks per variant/representative tones, accents, `strong` and state toggling; Eyebrow and Accent stories. | VIS-02 Pending, including diamond centering and glow-edge review. |
| AC-04 | `p` and a non-heading slotted `span` keep their native tags, attributes, marker, order and child ref while opted-in display is block; no new wrapper or automatic `title`. Existing supplied `title` and non-conflicting child classes survive. | Public native/Slot DOM and ref tests plus browser display check; AsChild story. | VIS-01/02 Pending. |
| AC-05 | Root `min-width: 0` and bounded, shrinkable flex/grid ancestry allow ellipsis; an unshrinkable ancestor or unbounded host is explicitly the consumer's responsibility. | Browser flex and grid cases with/without ancestor min-width zero and a shrinkable track, plus supported width/placement merge tests; FlexGrid story. | VIS-02 Pending. |
| AC-06 | Full children and accent remain exposed to assistive technology and native heading/ancestor-link naming where applicable, without generated role, focus stop, label, live region or duplicate announcement. | Accessibility-tree/role/name and native-attribute tests, plus actual screen-reader reading-order check; heading/link composition story. | AT result Pending; visual not a substitute. |
| AC-07 | A host-provided visible details route exposes both complete card values and is operable by keyboard, pointer and touch; focus indicators and controls are outside clipping. Native title/Tooltip alone is not relied on. | Consumer integration story and real-browser keyboard, pointer and touch checks; destination/disclosure text and focus assertions. | VIS-01 Pending; consumer integration not yet observed. |
| AC-08 | ListItem default content remains unclamped; opt-in nested Text works in Content and in the editorial Title/Meta spans, with correct native heading, sizing and full text; no part receives a new prop. | Public ListItem preservation and composition tests; real-browser flex sizing and narrow row story; type/API checks for unchanged parts. | VIS-01 Pending. |
| AC-09 | With the option absent/false, existing Text defaults, recipes, whitespace, tone, accentBreak, Slot, native attributes and layout merge remain; Heading's separate behavior/API remains unchanged. | Existing focused Text and Heading suites plus explicit default/false preservation and Heading negative type case; existing stories. | Existing behavior is source evidence only; planned regression results Pending. |
| AC-10 | Static utilities are emitted in actual shipped CSS and the feature works for packed React 18/19 consumers without a Tailwind compiler. This draft changes no token, dependency, registry or legacy CSS; separately approved registry work is required for implementation. | Built-CSS/static-scan and packed-consumer tests, source/diff audit; verify separately approved registry work when authorized. | Pending; visual not applicable to packaging. |
| AC-11 | The usage documentation excludes hard breaks, block boxes and focusable descendants inside a truncating root; Text does not gain a tree-validation or interaction engine. Independent ancestor/sibling controls remain operable. | Documentation/source review and public DOM/keyboard tests for unchanged ancestor/sibling control behavior; unsupported child combinations are not represented as supported test cases. | Pending; visual not applicable to the unsupported-content policy. |

### Resolved decisions and next steps

1. **Spec:** approved as drafted. Owner choice, verbatim: "Aprobar tal cual (Recomendado)". Text-only `truncate` on every variant, block display on opt-in, inline accent and eyebrow while truncating. Widening to `Heading` would need a separate scoped decision.
2. **Full-text access policy:** approved as drafted. The visible route or disclosure is owned by the consumer; native `title` and the DS Tooltip are supplementary only. For Recado's card, confirm during implementation that tapping the card opens the full-text detail without hiding the trailing action's focus or touch target.
3. **Naming convention:** owner choice, verbatim: "Aprobar `truncate` (Recomendado)". `single-line-text-truncation` / `truncate` is approved for registration with the first reviewed usage, during separately authorized implementation. This draft does not edit the registry.
4. **Visual references:** the spec is approved without captures. VIS-01/02 remain pending, and visual conformity is Not evaluated until expected-design sources and captures are supplied and approved.
5. **Next step:** propose a separate implementation plan, which needs its own approval. All acceptance checks and real package, browser and assistive-technology evidence remain pending.
