# Component contract — ChapterBreak

- **Version / status:** 0.1 — Proposed draft; not approved or implementation-ready.
- **Approval / recovery:** The [catalog decision](../../web-catalog/v0.1/owner-approvals.md) approves a slot-based scene organism, not this spec, its visuals or an implementation plan. Tracking: `odd/tasks/web-catalog.md`, E3, S3/S4, L5 and L41–L46. The owner selected the structured scene API family; this does not approve this draft.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: e98d18fbac20bc0cee492829e69ddd5ecbe69b268f91760bf93d123493b67848`; `visualHashes: VIS-01 → e6610d8ec7b916f993157e424cb3766f7c18eebbaf10e4f12cf7a8ac388ae6b7; VIS-02 → 8c4cb2533067e57b290f8e7767e8133b68d17875afabd736af0ce9a6a4ff07f9`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the complete line `## 1. Purpose and scope` through EOF, including final LF; metadata above is excluded. Parent finalizes before publication.

## 1. Purpose and scope

ChapterBreak is a proposed passive `@egdev/ui` organism providing a visual interlude between content chapters: consumer-supplied chapter label, display heading, lede and optional decorative media. It carries no Pulso copy, identity, fixed chapter count, links, effects engine, animation director, scroll behavior or reveal/wipe choreography. The host owns section structure and any effect coordination. The Foundation source explicitly discourages CTAs and cards; this proposal exposes neither an action nor generic children slot.

**Cataloging and alternatives:** The owner approved scene organisms for reusable web views. Delivered `SectionHeader` handles editorial headings but not this copy/media scene; adding a scene layout would change its responsibility. Delivered `SectionShell` frames a section but does not coordinate this content. Composition of `Text`, `Heading` and an external media node is possible, but repeats the interlude layout; no existing exported ChapterBreak was identified to extract. Recommend a new organism with those delivered pieces. No Radix primitive is needed for passive layout. The consumer may supply `Isotipo3D` from `@egdev/effects`; UI does not import effects.

**Evidence:** read-only Foundation `design-system/components/ChapterBreak/README.md` and `preview.html`, and `packages/ui/src/styles/legacy/bundle.css:726–736`. The delivered sibling scene APIs and composition are in `packages/ui/src/organisms/{hero,closing}/`; their browser evidence is in `docs/components/{hero,closing}/v0.1/observed/browser-check.md`. Historical general availability prose predating those actual implementations is not evidence of current exports or of ChapterBreak parity.

## 2. Anatomy and composition

| Part | Proposed responsibility |
| --- | --- |
| Root | Passive `div`, proposed stable `eg-chapter-break` marker, inside a host SectionShell; no additional landmark. The source uses `.eg-chapter`; marker compatibility is OQ-5. |
| Copy | Consumer's optional `eyebrow`, one Heading with `title` and optional trailing `accent`, and optional `lede`, in that order. Text's eyebrow provides the decorative diamond. |
| Media | Optional consumer-supplied decorative 3D or image; adjacent to copy wide, visually first narrow, while DOM order stays copy then media. No automatic fallback. |

Host supplies `<SectionShell register="show" wrap>` as a candidate, its accessible name, `data-zone`, page anchor, background and document outline. It avoids a second gutter or landmark inside the scene. Heading uses the selected native rank and `accentBreak`; the consumer can supply Isotipo3D and its own fallback under its separate contract. No source fallback is bundled or promised when media is absent. Do not add CTAs, cards or choreography.

## 3. Public API

These proposals use the owner-selected structured family shared with delivered Hero and Closing; no ChapterBreak API exists yet.

| Input | Proposed type / default | Contract / registry lookup |
| --- | --- | --- |
| `title` | `string`, required | Non-empty main heading; approved `heading-title`. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6`, required | Host-selected heading rank; approved `heading-level`. |
| `eyebrow` | `string`, optional; absent omits | Chapter context, not hardcoded “Lectura”; approved `heading-eyebrow`. |
| `accent` | `string`, optional; absent omits | Trailing highlighted heading text on a block line; approved `trailing-text-accent`. Heading inserts no separator: consumer supplies trailing whitespace in `title` when needed for the accessible name. |
| `lede` | `string`, optional; absent omits | Introductory paragraph; approved `section-lede`. |
| `media` | `ReactNode`, optional; absent omits | Consumer-supplied decorative, non-focusable media, never sole meaning; approved `scene-media`, not interactive media or an effect selector. |
| `id` | native `string`, optional | Forward to Heading, not root, for host SectionShell's `aria-labelledby`; host supplies a unique value and puts its section anchor and `data-zone` on SectionShell. |
| `className` | native `string`, optional | Root outer placement only, not appearance overrides. |

No `children`: Hero/Closing reserve it for CTA controls, while this source has no CTAs and explicitly says not to add them. No `slot`, `social`, `scene`, action API or arbitrary content slot is proposed. Consulted [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md) by name, meaning and aliases: `scene-media` is approved in `docs/components/hero/v0.1/prop-naming-approval-scene-media.json`; `effect-scene` selects a pose rather than supplying media; `slot-composition` / `asChild` is Radix substitution. No new convention or exception is proposed; a future new convention would remain proposed with `approval: null` until separately approved. Append a reviewed ChapterBreak usage only during separately authorized implementation, never invent a source revision. Existing reviewed evidence: `HeroProps`, `packages/ui/src/organisms/hero/types.ts`, SHA-256 `09c805d2cd51cf46095f17945aabfe547ab59f464fccdbdba9fe30d66c1ed844`; `ClosingProps`, `packages/ui/src/organisms/closing/types.ts`, SHA-256 `b413fbef41e1ca87a2ebd9300287aad94f5c751f829f733b0463a614fc7e496e`.

Root accepts compatible `ComponentPropsWithoutRef<'div'>`, excluding `children`, `id`, `title`, `role`, `style`, `dangerouslySetInnerHTML` and conflicting own props; `id` is reserved for the heading. No ref, root `asChild`, own state, callback or controlled/uncontrolled mode is proposed. Protect these restrictions for untyped callers too. Merge supported placement utilities through `cn()`; `twMerge` cannot guarantee universal cascade precedence. React 18/19 and packed consumer compatibility remain planned checks.

## 4. Behavior

| Condition | Proposed result |
| --- | --- |
| Wide | Copy first and decorative media adjacent, if supplied. |
| Narrow | Media visually above copy; copy stays before media in DOM and reading order. |
| Missing optional text or media | Omit it without placeholder, invented copy or fallback; absent media leaves one full-width copy track, including `null`, `false` and empty React children. |
| Effect inputs change | Consumer owns effect lifecycle and pose; scene renders the supplied node without coordination. |
| Reduced motion | ChapterBreak introduces no animation; supplied media owns its own reduced-motion behavior. |

**Source candidates, not proof or approval:** `bundle.css:727–735` specifies `1.25fr / 1fr`, square media with `58vh` maximum height, and inclusive `≤860px` single-column media-first layout with `min(34svh, 300px)` maximum height. Source lede uses `clamp(17px,1.5vw,20px)` and `52ch`; README describes display typography at 56–132px. These numbers do not approve hardcoded typography, geometry or a local breakpoint and do not prove utility emission. Review token-compatible geometry and test 859/860/861, fractional boundaries, short viewports, narrow embeds, zoom and long translated copy. Do not assume `md:` exists or `aspect-video` emits.

## 5. Accessibility

Host chooses rank and supplies a unique heading ID to label the surrounding SectionShell, or another appropriate section name; it owns a coherent document outline. One heading includes the accent in its accessible name, including any consumer-supplied separating whitespace. Eyebrow's diamond is decorative. Media is decorative, `aria-hidden`, non-interactive and contains no focusable descendants; meaningful or interactive media is outside this contract. Do not hide an interactive Isotipo3D. No new landmarks, live announcements, focus management or keyboard behavior apply. Any controls in the surrounding host remain consumer-owned, must be named, keyboard accessible with visible token focus and measure at least 44 × 44 CSS px. Verify contrast on the actual host, reflow and assistive technology; none is observed for ChapterBreak.

## 6. Appearance

- **Material and typography:** Candidate `SectionShell` show register owns the background and any approved host glow; ChapterBreak does not paint an invented flat surface. Use delivered token-backed Text/Heading treatments and verify contrast, particularly neon against the actual background. The source SVG drop-shadow and title scale are reference evidence, not permission for a handwritten glow, shadow, gradient or arbitrary appearance. Any additional recipe, token or visual difference needs explicit owner approval. Respect reduced motion and applicable reduced-transparency fallbacks.
- **Geometry and cascade:** Use static token-backed CVA utilities in `types.ts` and `cn()` per part; no interpolated classes, inline appearance or new dynamic geometry exception. Compiler proof and component-local breakpoint approval precede a plan. The legacy unlayered `bundle.css:727–735` assigns `.eg-chapter` width, max-width, auto margins, gutters, font and color; `__grid` grid/gap/alignment, `__copy > .eg-title` margins, `__lede` font/color/width, `__slot` size/ratio and direct-SVG drop-shadow, plus ≤860px grid/slot order and cap. Composed `.eg-eyebrow`, `.eg-title`, accent and SectionShell selectors also need computed-style checks. Proposed `eg-chapter-break` avoids direct `.eg-chapter` collision, but compatibility needs a decision; do not silently repurpose legacy part markers, delete legacy CSS, rely on class-string order or use blanket `!important`. Preserve existing consumers.
- **Layer (d)/(e) lessons:** Shipped CSS has no preflight: do not assume UA resets for surrounding controls. `aspect-video` was absent in LiveBand; prove every chosen utility. Shared emitted responsive rules can mask missing classes, so assert responsive utilities on this component's own SSR elements as well as packed CSS. When no media is rendered, no empty track may remain. Validate actual 44px targets in host stories, not just declared sizes; delivered Button `lg` measured 44.8px under its [approved amendment](../../../button/v0.3/large-size-amendment.md), not a blanket guarantee for arbitrary controls. Story decorators must spread `context.args` when adding IDs; Storybook assets use `/brand/…` (e.g. `/brand/egdev-logo.png`) and story-only utilities need the appropriate preview source scan. Use a packed consumer without Tailwind and browser checks with legacy styles; these are future checks, not observed ChapterBreak evidence.
- **Files:** Proposed six meaningful files `types.ts`, `useChapterBreak.ts`, `ChapterBreak.tsx`, `ChapterBreak.test.tsx`, `ChapterBreak.stories.tsx`, `index.ts`; no extra module. **No stylesheet** recommended if approved utilities and collision handling suffice. If not, stop for an explicitly approved meaningful compliant role; do not modify legacy styles. No token, dependency, registry or code change is authorized by this draft.

### Expected-design visual references

| ID | Image and English description | SHA-256 / status |
| --- | --- | --- |
| VIS-01 | [Wide Foundation preview](chapter-break--variants--1280x1400--dark.png): diamond eyebrow, two-tone display title, lede and 3D isotype slot. | `e6610d8ec7b916f993157e424cb3766f7c18eebbaf10e4f12cf7a8ac388ae6b7` — proposed |
| VIS-02 | [Narrow Foundation preview](chapter-break--variants--390x1400--dark.png): the interlude on a narrow board. | `8c4cb2533067e57b290f8e7767e8133b68d17875afabd736af0ce9a6a4ff07f9` — proposed |

Parent supplied captures of read-only Foundation `ChapterBreak/preview.html` (SHA-256 `8e55b3c3b4146a1658b13d3fe0fb35020a62e10e402a3b40584c2b1410a08fc1`), reported dark viewports 1280×1400 and 390×1400 (L46). Browser/version, DPR, capture date, crop, locale, actual fonts and motion/transparency preferences are not independently established here. Parent must recover capture metadata and verify immutable published image bytes before adoption. Captures are examples, not responsive, accessibility or token proof; Spanish source copy is not a default. Related criteria CB-02, CB-04 and CB-05. Visual conformity **Not evaluated**.

## 7. Acceptance criteria

All checks are proposed, not observed, and require owner decisions and separate plan approval.

| ID | Observable promise | Planned evidence |
| --- | --- | --- |
| CB-01 | Host-selected rank and unique heading ID create one named host section, with no hardcoded chapter text or extra landmark. | Public role/name, ID and multi-instance tests; SectionShell composition story. |
| CB-02 | Optional eyebrow, accent and lede render in order or are omitted; accent remains in the heading name; no CTA or generic children API. | DOM/name and public type tests; VIS-01/02. |
| CB-03 | Optional media is decorative and non-focusable, absent media creates no wrapper, fallback or empty column, and no effects/choreography is owned by UI. | Public DOM tests including null/false/empty media; dependency and host integration checks. |
| CB-04 | Approved responsive behavior reflows without clipping, preserves DOM order and accommodates long copy, narrow hosts and absent media. | Own-element SSR class assertions, compiled CSS and browser at boundary neighbors, zoom and short viewports; VIS-01/02. |
| CB-05 | Approved host Material and contrast, motion preferences and bounded collision handling preserve legacy consumers. | Packed browser computed styles, contrast and legacy fixture; VIS-01/02. |
| CB-06 | Surrounding consumer controls remain keyboard accessible, visibly focused and at least 44 × 44px. | Browser keyboard, focus and target measurements in composed examples; no controls are supplied by ChapterBreak. |
| CB-07 | Root marker, protected native props and placement-only merge hold; documentation and packed React 18/19 consumers work without Tailwind. | Type/DOM/docgen tests, static CVA scan and packed-consumer checks. |

## Blocking owner questions

| ID | Question / evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | Foundation includes a default label, fixed copy and fallback; should any be built in? | Require consumer title/rank, allow optional label, lede and decorative media, with no default copy or fallback and no empty media column. |
| OQ-2 | The source has no CTA and explicitly discourages cards; should the sibling CTA `children` slot exist here? | No `children` or CTA slot; preserve the structured copy/media family without adding a responsibility absent from this scene. |
| OQ-3 | Adopt source inclusive 860px boundary and square 58vh / `min(34svh,300px)` media sizing? | Review a ChapterBreak-local ≤860px boundary and token-compatible square sizing; prove compiler output and check boundary neighbors and small hosts before adoption. |
| OQ-4 | Which host and glow treatment preserves Material and contrast? | Use the delivered SectionShell show register as host candidate and existing Heading/Text recipes; do not add source SVG shadow or handwritten glow. Explicitly approve any visual difference or new compliant recipe. |
| OQ-5 | Source marker is `.eg-chapter`, while the standard new-component root would be `eg-chapter-break`; legacy selectors are unlayered. | Use `eg-chapter-break` for the new root, retain all legacy markers and consumers unchanged, and verify composed-child cascade in a packed browser; separately approve any needed stylesheet role. |
| OQ-6 | Source uses `h2` and decorative fallback; what are the reusable semantics? | Host selects rank and supplies unique heading ID; decorative, non-focusable consumer media only, with effect fallback owned by the supplied effect. |

**Closure:** OQ-1–OQ-6, exact payload finalization, capture metadata, visual adoption and immutable publication remain pending. Spec approval does not approve a plan; responsive/Material exceptions and any plan require their own scoped approval before implementation.
