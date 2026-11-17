# Component contract — SectionHeader multilingual amendment

- **Version / status:** v0.2 — Approved — 2026-11-17 (parent applying the recommended options under owner delegation; see "Approval" below). Implementation plan follows the same delegation.
- **Amends:** [SectionHeader v0.1 implementation evidence](../v0.1/implementation.md) and the [approved #100 contract](https://github.com/egdev6/egdev-design-system/issues/100#issuecomment-6251551951); unchanged promises remain in force. Request: [#417](https://github.com/egdev6/egdev-design-system/issues/417).
- **Approval / recovery:** Pending for this exact file and any separate implementation plan. The local draft is authorized; no code, registry, token, dependency or GitHub write is authorized.
- **Current situation / pending decisions:** v0.1 accepts only strings in its owned copy props. D1–D5 recommend concrete replacements; mixed-language behavior, captures and this amendment's approval are not yet observed.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending before publication`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/100`; `latestPublishedComment: Pending — no v0.2 snapshot published`; the recovered base approval is linked above, without claiming it is the latest issue comment.
- **Hash definition:** SHA-256 of UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, LF line endings and final newline; metadata above is excluded. Approval must bind this version, payload and identified visuals.

## 1. Purpose and scope

Enable supplied multilingual text and decorative separators independently in eyebrow, title and lede, without a bilingual component, translation service or language switcher. The caller owns wording and language tags. No interactive content, arbitrary rich slots or layout/appearance variants are added.

**Cataloging:** extend the existing passive `@egdev/ui` SectionHeader molecule. Root `lang` cannot identify mixed languages; reusing its string-only props is insufficient. Restricted textual runs preserve Heading/Text composition and avoid a second header or uncontrolled arbitrary ReactNode content. Evidence: `packages/ui/src/molecules/section-header/{types.ts,useSectionHeader.ts,SectionHeader.tsx,index.ts}`, component tests/stories, `packages/ui/src/primitives/text/`, public `packages/ui/src/index.ts` and the #417 issue. Proposed behavior is not implemented evidence.

## 2. Anatomy and composition

| Part | Existing element / composition | Proposed content |
| --- | --- | --- |
| Root | Native `header`, `eg-section-head` | Same eyebrow, optional Divider, Heading and lede order. |
| Eyebrow | `Text variant='eyebrow'` with decorative diamond | String or ordered language spans. |
| Title | `Heading variant='section'`, consumer rank and optional existing trailing accent | String or ordered language spans; caller-owned `titleId` targets the heading. |
| Lede | Paragraph using #396's `Text variant='lede' foreground='secondary'` | String or ordered language spans; preserve `eg-section-head__lede` and current lede typography/layout. |

Each tuple is rendered as a native inline `span` in its existing part; no nested paragraph or heading. For an eyebrow run array only, group the run spans inside one unstyled inline `span`: the existing eyebrow is `inline-flex` with a diamond and gap, and this prevents a new flex gap between every run. String eyebrows retain their original markup. Preserve native root `id` separately from heading `titleId`. The lede gains Text's public `eg-text` marker in addition to `eg-section-head__lede`; this is an explicit DOM/selector change requiring cascade regression checks, not removal of any marker. Divider remains decorative. No new Radix package or interaction engine.

## 3. Public API

```ts
type SectionHeaderTextRun = readonly [text: string, lang?: string, decorative?: boolean];
type SectionHeaderText = string | readonly SectionHeaderTextRun[];
```

| Prop | Type / required / default | Rule |
| --- | --- | --- |
| `title` | `SectionHeaderText`, required, no default | At least one non-decorative non-whitespace run is required; blank still warns in development and renders nothing. |
| `eyebrow`, `lede` | `SectionHeaderText`, optional, absent by default | If there is no non-decorative non-whitespace text, omit the complete part and apply the existing layout fallback. |
| Tuple entries | `text: string`, optional `lang: string`, optional `decorative: boolean` | Ordered plain text only. When decorative is `true`, the span has `aria-hidden='true'`; otherwise it is readable. Omit `lang` to inherit, or forward the provided string verbatim. |
| `accent`, `accentBreak`, `level`, `titleId`, `variant`, `tone` | Existing types and defaults | Unchanged. `accent` remains a separately supplied string; it inherits the heading's language and is not automatically included in title blank validation. |
| Root native attributes / `className` | Existing header passthrough and layout-only merge | Root `lang` remains a fallback; a per-run `lang` overrides it on that span. No ref, children or `asChild` API is added. |

Example: `title={[['Hotel ', 'es'], ['/ ', undefined, true], ['Hotel', 'en']]}` yields visible `Hotel / Hotel` and an accessible heading name `Hotel Hotel`. Consumers provide spaces themselves; the component inserts no separators. The labels `text`, `lang`, `decorative` are TypeScript tuple-position labels, not new named props/object fields. The optional native HTML `lang` attribute is passed to the rendered span; an explicit empty string is forwarded as HTML unknown language, not replaced with a guessed language. No automatic tag validation, translation or bidi isolation is promised; use root native `dir` or appropriate consumer content. Because all three copy props accept a non-serializable union, each changed own prop uses `@control false` with an English reason pointing to the multilingual stories; do not falsely retain `@control text` for the full union.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry): widened `title` → approved `heading-title`, `eyebrow` → approved `heading-eyebrow`, `lede` → approved `section-lede`; structured **plain** text is not arbitrary rich content. No new own prop, convention, object-field convention or scoped exception is proposed; positional tuple labels do not create a prop API. Existing `trailing-text-accent`, `heading-level`, `heading-id`, `surface-material-tone` and `visual-treatment` remain unchanged. Proposed exported type aliases are not props.

Reviewed source: `{ path: 'packages/ui/src/molecules/section-header/types.ts', symbol: 'SectionHeaderProps', revision: 'sha256:5726750a3c95049bf2262524f7d11d504774fd67f3b7d4409e49b9641b1d6f0c' }`. Future usage records require the actual reviewed post-implementation source hash; existing convention approval is not approval of this spec.

**Contract change / migration:** widening these three prop types changes downstream reads: consumers that call string methods directly on `SectionHeaderProps['title' | 'eyebrow' | 'lede']` or exhaustively type them as strings must narrow with `typeof value === 'string'` or handle runs; existing JSX string calls and visible output remain valid. The extra lede `eg-text` marker is additive but may match consumer CSS; verify legacy and consumer cascades. No automatic consumer migration. React 18/19 packed compatibility is a planned check, not a type-derived claim. Controlled/uncontrolled state is not applicable.

## 4. Behavior

| Input / action | Result |
| --- | --- |
| Existing strings | Preserve original text and whitespace, blank-title diagnostic, optional blank omission, rank, title ID and accent concatenation. |
| Valid run array | Render spans in input order and preserve each exact string; no extra separator or eyebrow flex gap between runs. A decorative span is visible but excluded from the accessibility tree; `lang` belongs to its own span. |
| Empty array, whitespace-only or only decorative/blank readable runs | Required title follows the existing warning/no-header rule; eyebrow/lede are omitted and inline/split resolve to stack exactly as for blank strings. A nonblank separate accent cannot rescue a blank title. |
| Invalid untyped tuple entry | Skip entries that are not arrays of length 1–3 with a string first entry, optional string/undefined language and optional boolean/undefined decorative flag; do not throw. Evaluate blank/fallback rules on the remaining entries. Existing typed string calls are unchanged. |
| Rerender / passive content | Update the text/attributes without translating, adding events or moving focus. |

No tree parsing of arbitrary React elements, HTML injection, interactive runs or hidden meaningful words. Consumers own the grammatical spaces and must mark only genuinely decorative text hidden. No derived state, timers or announcements.

## 5. Accessibility

Keep one native heading with its requested h1–h6 rank and its complete readable text, including the unchanged accent. Spans preserve individual language changes for assistive technologies; decorative separators have `aria-hidden='true'`, never an extra spoken separator. Do not concatenate `aria-label` or duplicate text. The consumer chooses heading rank and may use a unique `useId()`-derived `titleId` for an enclosing section's `aria-labelledby`. Root `lang` and `dir` are inherited normally; no invented tag fallback. Header is passive: no keyboard/focus behavior, live region or touch target; any controls remain consumer-owned and are not accepted as text runs.

## 6. Appearance

| Axis | Existing default / values | Proposed constraint |
| --- | --- | --- |
| Layout | `stack` default; `split`, `inline` | Existing breakpoint, part order, gaps and blank optional fallbacks unchanged. |
| Heading/tone | h2 default; level 1–6; canvas default, raised | Existing section typography, trailing accent and tone semantics unchanged. |
| Lede | Existing sans `text-body-muted`, secondary foreground, max `--bp-sm` width | Reuse #396's `lede` recipe with explicit `secondary`; retain current root/layout classes, no extra margin, and `eg-section-head__lede`. |
| Runs | Inline spans | No own font, background, color or display variant; inherit the containing part's appearance. |

No new tokens, dependencies or Material paint. Existing CVA layout remains in `types.ts`, normalized text/fallbacks in `useSectionHeader.ts`, JSX composition in `SectionHeader.tsx`; preserve `SectionHeader.test.tsx`, `SectionHeader.stories.tsx` and `index.ts`. **No stylesheet** and no extra internal module. Each part still uses `cn()`. Root `className` supports outer layout only; lede classes passed to Text are layout/marker only, not a typography override. `twMerge` cannot guarantee arbitrary selector/cascade precedence. #396 must provide the specified lede recipe first; no new background-detection mechanism.

### Expected-design visual reference

| Visual ID | Image / scenario | Source and conditions / status |
| --- | --- | --- |
| VIS-01 | Pending: Spanish/English eyebrow, heading and lede with hidden decorative separators | Expected-design source/version, browser, viewport, DPR, fonts, theme, crop, motion/transparency, date, hash and scoped approval Pending. |
| VIS-02 | Pending: existing split/inline fallback and narrow long content | Same provenance and conditions Pending. |

No captures in this batch. Implementation PR must provide stories and real component captures before merge; baseline references do not validate the new run rendering. Visual conformity: **Not evaluated**; use the [capture guide](../../../design/README.md). Visual evidence cannot replace language, accessibility or behavior tests.

## 7. Acceptance criteria

All methods are planned, not observed.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Eyebrow, title and lede accept ordered Spanish/English runs with per-span `lang`; visible order/text and whitespace are unchanged, with no extra eyebrow flex gaps. | Public DOM tests and Multilingual story across stack/split/inline, VIS-01. | Pending |
| AC-02 | Decorative separators stay visible but are hidden from the title accessible name; meaningful runs and existing accent remain readable exactly once. | Role/name and span-attribute tests; browser accessibility-tree/screen-reader follow-up. | Pending |
| AC-03 | Empty arrays, all-blank/readable or decorative-only runs follow the same title warning/omission and split/inline fallbacks as strings; invalid untyped entries are skipped without throwing. | Table-driven public DOM/rerender tests in development/production; MissingParts story. | Pending |
| AC-04 | Ranks 1–6, unique consumer heading IDs/relationships, root language/direction and string-only callers are preserved; no injected children/HTML, focus or live region. | Existing and new role/relationship/type/keyboard-passivity tests, SSR and packed React 18/19 checks. | Pending |
| AC-05 | Lede keeps its element, typography, layout and old marker despite adding `eg-text`; no display or Material regression. | DOM/class assertions, compiled CSS, legacy-loaded computed style and narrow/zoom/RTL browser comparisons; VIS-02. | Pending |
| AC-06 | Proposed union/type exports and actual docgen controls are usable without silently inventing string defaults. | Strict positive/negative type fixtures, AST/docgen/enhancer and actual Controls review; rich run example remains a story. | Pending |

### Decisions awaiting approval

- D1 — rich ReactNode slots or restricted text data? **Recommended:** ordered readonly text tuples, because language and hidden separators are explicit while arbitrary interactive or inaccessible markup is excluded.
- D2 — absent/blank/invalid runs? **Recommended:** ignore malformed untyped entries, count only non-decorative nonblank text, and apply existing string fallbacks, because decorative punctuation must not create an unnamed heading or orphan layout.
- D3 — run languages and separators? **Recommended:** forward each provided native `lang` verbatim and hide only explicitly decorative spans, because the caller owns language and meaning and no extra speech should be inserted.
- D4 — lede integration? **Recommended:** compose #396's `Text variant='lede' foreground='secondary'`, retaining the old marker and explicitly testing the added `eg-text` marker, because the existing token recipe remains identical and reusable.
- D5 — visual evidence? **Recommended:** defer captures to the implementation PR, with real stories/captures before merge, because no new expected-design capture exists in this batch.

### Closure and dependencies

- Depends on [Text v0.2 / #396](../../text/v0.2/body-tone-amendment.md), specifically its lede recipe; land or implement that approved contract first. No new token or dependency is requested.
- Exact snapshot approval and a separate implementation plan are required. The documented public type expansion and added marker require consumer-impact review; no capture or runtime result is claimed.

## Approval

- **Status:** Approved 2026-11-17.
- **Authority:** the owner delegated these decisions to the parent's recommendations: "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar" (owner session 2026-11-17, recorded in `odd/tasks/milestones-1-2-delivery.md` L1 and `odd/tasks/nexo-adoption-m2-specs.md` L1).
- **Resolution:** every open decision in this document resolves to its option marked **Recommended**. New or changed prop-naming conventions and scoped exceptions proposed here are approved together with this spec; registry entries and approval records are added in the implementation PR.
- **Not approved here:** new tokens or token value changes, new dependencies, and anything this document flags as out of scope; those stop for the owner.
