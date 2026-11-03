# Component contract — LiveBand

- **Version / status:** 0.1 — Proposed, draft for owner review; not approved or implementation-ready.
- **Approval / recovery:** Pending exact payload and VIS-01/02 approval. Catalog classification is approved in `docs/components/web-catalog/v0.1/owner-approvals.md`; capture authority `odd/tasks/web-catalog.md` L6, L15, L25–L29. SectionShell #291 is an approved contract, not an implemented dependency; its plan remains separate.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: 8ea4767016ed22c1e0fc022fb73f0a23541ecae71106c3bef9f41196fc576061`; `visualHashes: VIS-01 → 501ce4aa4d1602e180bccb33aa658f65540b42b5ee38f4dd2e96bd410327101e; VIS-02 → 3975eebab47e3be4156943b7382add59b36ad71eb83f01335bfadbe253b5bd14`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact whole heading line `## 1. Purpose and scope` through EOF, LF and final newline included; metadata above is excluded.

## 1. Purpose and scope

A reusable live-event and recording section composition, organism in `@egdev/ui`, with an upcoming-event field and a featured recording plus past-recording list. It contains no platform, schedule, URLs, copy, date calculation, fetch, router, playback or ambient choreography. Host supplies content and effects. The web amendment permits generic web building blocks without domain data. Catalog `scripts/catalog_data.py:111` identifies Countdown, PhotoFrame and ListItem editorial composition; Foundation `design-system/CONTRACT.md:82` describes the combined live field and list. Foundation root throughout is `/home/egdev/proyectos/egdev-website/egdev-foundation` (read-only).

**Alternatives:** a Countdown, PhotoFrame or ListItem alone cannot coordinate this region; extending one changes its responsibility. Consumer composition is viable, but would repeat both grid shapes; a common organism with separately placeable parts is recommended, with the archive independently optional (OQ-1). No existing exported organism hides this exact layout to extract. ArticleFeature is an existing whole-card article link, not a 16:9 video thumbnail with overlay play; its contract is a comparison, not proof it can produce the reference (`packages/ui/src/molecules/article-feature/types.ts`, `ArticleFeatureProps`). A dedicated generic VOD part is a proposal, not a new approved molecule. Public `Surface`/`surfaceVariants` are exported (`packages/ui/src/index.ts:119-125`); their availability does not authorize copying a new VOD paint recipe. The catalog is not proof of implementation or a plan.

**Evidence:** `design-system/components/LiveBand/README.md:1-51`, `preview.html:14-68`, `design-system/components/StreamItem/README.md:1-52`, `reference-web/pulso-source.html:1080-1132`, `design-system/CONTRACT.md:56,82`, `design-system/DECISIONES.md:23,42`. Screenshot content and Foundation's fixed copy are examples, not defaults. Older repository availability prose predates delivered components.

## 2. Anatomy and composition

| Part | Proposed content and ownership |
| --- | --- |
| `LiveBandField` | `div.eg-live-band`: unpainted content grid inside a host `SectionShell register="flood"`; host supplies heading/eyebrow/copy, Countdown, CTA and photo. No section or extra landmark. |
| `LiveBandStreams` | Independently placeable passive grid, supplied featured VOD and past streams; host places it after field under a separate appropriate section/background. No flood paint. |
| `LiveBandVod` | Proposed one whole-card anchor around consumer-supplied cover and metadata, no nested action. Its 16:9 cover contains visible title, badge, duration and decorative play affordance. |
| `LiveBandList` / `LiveBandRow` | Consumer heading and separate archive Link; list `ul`, rows `li`, each containing one editorial-divided ListItem slotted onto an anchor. |

These are independently exported compound parts, not a required single React parent: an example host can place `<SectionShell register="flood"><LiveBandField>…</LiveBandField></SectionShell>` followed by a separately framed `<LiveBandStreams>…</LiveBandStreams>`. The host owns surrounding named section(s), valid heading IDs and wrapping; do not assume an implemented SectionShell until its separate plan is delivered. One organism is a catalog responsibility, not a forced common DOM wrapper; OQ-1 may instead split contracts. Native anchors and existing Slot-based children need no new Radix dependency or invented keyboard behavior. Parts do not inspect, clone or validate arbitrary descendants. Root marker `eg-live-band` is public; new internal parts avoid legacy `eg-live-band__*` selectors. Existing CSS and consumers are preserved.

## 3. Public API

Conditional on OQ-1–OQ-9. Each listed part accepts required `children`; no implicit domain data, copy or defaults.

| Part / input | Type | Contract |
| --- | --- | --- |
| `LiveBandField.children` | `ReactNode` | Consumer composes the text/countdown/CTA area and one PhotoFrame; source order text then photo. |
| `LiveBandStreams.children` | `ReactNode` | One featured VOD and one list column in source order; omit the entire part if no archive is wanted. |
| `LiveBandVod.children` | `ReactNode` | Consumer supplies non-interactive cover and metadata, including named title; one whole-card link, not a player. |
| `LiveBandVod.href` | native anchor `string` | Required non-empty destination; consumer owns URL and navigation. No root `asChild` or router adapter promised; router need is an open plan concern. |
| `LiveBandList.children` | `ReactNode` | Consumer heading and optional independent archive link, then zero or more `LiveBandRow` children. Zero rows omit `ul`; heading/link remain. |
| `LiveBandRow.children` | `ReactElement` | One editorial-divided ListItem composed onto a named anchor. Row renders its `li`; no ListItemActions inside. Consumer provides stable keys. |
| `className` | `string` | Optional on Field and Streams only; outer margin, width and placement, not paint or arbitrary child overrides. |

Field/Streams inherit compatible `ComponentPropsWithoutRef<'div'>`; Vod inherits compatible anchor attributes; omit conflicting children, unsafe HTML, `role`, `style` and interaction overrides that would change passive/anchor semantics. Row and List expose only children. No ref, own state, automatic expiry action, events, data model or empty placeholder. Child semantics are consumer obligations, not guaranteed by React types. No fixed IDs, `aria-label` override generated by the organism, or forced heading rank. React 18/19 and package export compatibility require future verification.

**Naming lookup:** searched `skills/_shared/prop-naming.json` and `docs/prop-naming.md` by meaning, name and aliases. General `children`, `className`, `href`, anchor/ARIA attributes are native, not own conventions; no new own prop or exception is proposed. `collection-items` / `items` is structured data, not these compound children; `slot-composition` / `asChild` describes Radix element substitution, not this composition. Existing child inputs retain their own approved IDs: Countdown `deadline` → `deadline-instant`, `deadlineText` → `absolute-deadline-text`, `label` → `accessible-name`, `tone` → `surface-material-tone`; Button/ListItem `asChild` → `slot-composition`; ArticleFeature `actionLabel` → `card-link-action-label`. These are not new LiveBand props. `duration` / `auto-dismiss-duration` is transient timeout, not media length; consumer supplies duration text. No fabricated source usage or registry edit. Reviewed sources: `CountdownProps` `packages/ui/src/atoms/countdown/types.ts` SHA-256 `35d8c209c7aa249f4a78bb3c0c8c1154dd34affed22529cff4af8e134b97908e`; `PhotoFrameProps` `packages/ui/src/atoms/photo-frame/types.ts` `aca1d91add7e92b3629233d6bc521b2d07d1e7bf14d86795c3ba23fe6213092e`; `ListItemProps` `packages/ui/src/molecules/list-item/types.ts` `df2e05c470c79ad94bef1b06c87d118216ea601ebebe1d8aea6cff8c366cbe76`; `ArticleFeatureProps` `packages/ui/src/molecules/article-feature/types.ts` `dd19b9b2a315dd9b854fed3cb7b62973f30fc81a330d156b88ed78a697cb63d6`; `ButtonProps` `packages/ui/src/atoms/button/types.ts` `8c61498c24fe7f3da8f7393782910328e9f48cb5273b31dcd215f8bd9f58a0cb`. Convention approval remains independent of this draft.

## 4. Behavior

| Condition / action | Proposed result |
| --- | --- |
| Field >860px viewport | Text and framed photo in 1.1fr / 1fr grid, content in DOM order. |
| Field ≤860px | Single column, text then photo; no clipping or horizontal scroll. |
| Streams >1080px viewport | VOD and list in 1.15fr / 1fr grid; content can grow. |
| Streams ≤1080px | Single column, VOD then list. |
| Empty list / missing archive | No empty `ul` or invented message; omit optional archive link; host chooses any empty-state content. |
| Anchor activation | Native navigation, no player, fetch, hidden action or custom keyboard handler. |
| Countdown | Delivered Countdown owns initializing, running, expired and unavailable behavior, quiet timer and optional `onExpire`; host supplies `deadline` epoch milliseconds, localized `deadlineText` with timezone, visible `label` and localized units. No new timer or deadline parsing in LiveBand. |
| Reduced motion | No photo transform/hover motion, play scaling or transitions. |

The host decides whether and where to render each part; no loading, sorting or streaming state is inferred. The reference's ≤560px play/title dimensions are visual evidence, not an approved breakpoint: adopt existing token-responsive sizing or seek a separate local exception (OQ-8).

## 5. Accessibility

Host labels the SectionShell with a unique heading ID or appropriate name and sets heading ranks. Field/Streams add no landmark, tab stop or aria-live. Countdown's visible label names its `role="timer"` via `aria-labelledby`; `aria-live="off"`, its remaining values remain exposed and the absolute `<time>` and state text are descriptions (`packages/ui/src/atoms/countdown/useCountdown.ts`). Do not copy the Foundation's hidden digits or claim a dynamically generated aria-label. The host supplies meaningful image alt (empty only if decorative), localized dates, readable durations and named links. Each `<li><ListItem variant="editorial-divided" asChild><a>…</a></ListItem></li>` owns one anchor, with `<time dateTime="…">` and duration text within it. Archive is a separate link outside `ul`. VOD is one named anchor, visible badge/title/date/duration included by normal name computation; play glyph and pixel artwork are `aria-hidden`, not controls. No nested anchors/buttons. Native Tab/Shift+Tab and Enter operate links; retain visible `--shadow-focus` or equivalent token focus and touch targets at least 44px. No screen reader or contrast conformity has been observed.

## 6. Appearance

- **Field:** SectionShell's approved `flood` register owns `--color-bg-flood` and `--color-fg-on-flood`; LiveBand does not duplicate the background or section semantics. Host avoids double wrapping and validates SectionShell geometry; its separate plan/implementation is pending. Heading/Text and Countdown inherit flood foreground; CTA uses delivered `<Button variant="dark" asChild><a href="…">…</a></Button>`. The host owns the schedule text and accessible CTA name.
- **Photo:** delivered `<PhotoFrame variant="framed" ratio="landscape" …>` provides framed media, a token-derived static tilt and reduced-motion reset (`packages/ui/src/atoms/photo-frame/types.ts`); no claim that the Foundation's exact 2° or straighten-on-hover is already supported. Recommend existing static tilt without new hover motion; approve any changed transform or caption/crop separately (OQ-4). No unrestricted `className` appearance override.
- **Pixels:** recommend omit decorative pixels in v0.1 until D7 Pixel and any intended composition are approved/delivered, or separately approve a decorative SVG recipe; never depend on unapproved Pixel. Decorative source glyphs are not semantic content. Visual difference requires owner adoption (OQ-5).
- **VOD/list:** recommend a new local whole-card VOD part rather than misusing ArticleFeature's 16:8 inset cover and generated article layout. A token-backed compliant cover/surface and focus recipe must be explicitly approved; legacy radial/linear gradients, red halo, 16:9 cover and scaling are reference only, not permission for handwritten paint. Existing Surface is available for approved Material compositions. ListItem editorial-divided owns row paint and focus, with its documented Material adaptation; do not force legacy StreamItem styling. Keep list link separately operable. No duplicated host ambient wash; host/effects owns profile `live` and any background/contrast decision. Confirm all foregrounds, badge and dark-button contrast against actual field/cover.
- **Responsive:** request explicit LiveBand-only static viewport thresholds ≤860px and ≤1080px; token theme has no default `md`. Another component's local breakpoint approval does not transfer. Test 859/860/861 and 1079/1080/1081, zoom and narrow embedding in built CSS. No new breakpoint token. Exact spacing and VOD recipe need review against available tokens; no hardcoded color, font, spacing, handwritten shadow/gradient or inline appearance. Static geometry only; no dynamic CSS custom-property exception is proposed.
- **Legacy collision:** `packages/ui/src/styles/legacy/bundle.css:930-993` gives `.eg-live-band` position relative; `__band` paints flood, `__streams` applies 50% canvas wash, `__wrap`, `__grid`, `__streams-grid` set layouts, and `__vod`, `__thumb`, `__play`, `__list` plus pseudo/hover/focus/media rules paint, animate and size internals. Use stable root but distinct internal markers; locally neutralize/override root position to the intended computed value and avoid all legacy part names, leaving legacy unchanged. Child markers (`eg-photo`, `eg-countdown`, `eg-btn`, `eg-list-item`) have their own legacy collisions and existing local neutralization; verify them together. Do not rely on `twMerge` or class order to defeat unlayered legacy CSS. With shipped `@egdev/ui/styles.css`, verify root, descendants, focus, hover, breakpoints, reduced motion and unrelated legacy consumers. If utilities cannot win, stop for a separately approved scoped stylesheet role, never edit legacy or use blanket `!important`.
- **Files:** six meaningful future files under `packages/ui/src/organisms/live-band/`: `types.ts` (CVA/types), `useLiveBand.ts` (class derivation), `LiveBand.tsx` (JSX), tests, stories and `index.ts`. No extra module. **No stylesheet** recommended only if approved static utilities and neutralization win; otherwise an explicit meaningful scoped role and plan approval are prerequisites. Per-part `cn()`; Field/Streams `className` is layout-only and recognized utility conflicts merge last, not universal cascade precedence. No token/dependency/catalog change authorized.

### Expected-design visual references

| ID | Image / alt | Proposed SHA-256 |
| --- | --- | --- |
| VIS-01 | [Desktop board](live-band--variants--1280--dark.png): red live field with countdown, CTA and framed photo, followed by a featured recording and past streams. | `501ce4aa4d1602e180bccb33aa658f65540b42b5ee38f4dd2e96bd410327101e` |
| VIS-02 | [Narrow board](live-band--variants--390--dark.png): same live and recording composition on a narrow viewport. | `3975eebab47e3be4156943b7382add59b36ad71eb83f01335bfadbe253b5bd14` |

Parent supplied PNGs and `capture-raw.json`; no recapture. Foundation `preview.html` SHA-256 `7f378402544976c380943b9b8f0de904886405438b4dbde18270f4f708a6a88a`. Chromium headless shell 1243, 1280×1400 and 390×1400, DPR 2, dark, en-US, motion no-preference, screenshot animations disabled, fonts reported loaded, `.pv` crop, 2026-11-03; blob resolved to `reference-web/assets/photo-setup.webp`, SHA-256 `f743512e2ba0beb98e2e68400ab4723d592df2f1e5facbdae3118a30688fe47f`. Details in `capture.json`. Static preview does not establish DS parity, real interactions, preference behavior, contrast, accessibility or asset publication. Expected-design adoption pending; visual conformity **Not evaluated**.

## 7. Acceptance criteria

All are planned, not observed, and conditional on owner decisions and separate implementation plan.

| ID | Promise | Planned evidence |
| --- | --- | --- |
| LB-01 | Independently placed Field and optional Streams preserve supplied order, content and native attributes; no invented data, duplicate paint or landmarks | DOM/type tests; host SectionShell integration and empty list stories |
| LB-02 | Named Countdown retains delivered initialization, expiry, invalid handling, visible values and quiet semantics; host supplies deadline and timezone text | Public role/name tests and integration stories for running/expired/unavailable |
| LB-03 | CTA, VOD, each row and archive are distinct native links, named and keyboard operable, no nested action | DOM and browser Tab/Enter tests, semantic `ul > li`, time and duration checks |
| LB-04 | Photo framed treatment and reduced motion; decorative play/pixels hidden from accessibility | Real browser computed styles/preferences, role/name tests, visual stories VIS-01/02 |
| LB-05 | Both explicitly approved responsive boundaries, content order, wrapping and no clipping | Compiled CSS and browser at 859/860/861 and 1079/1080/1081, zoom/long content |
| LB-06 | Material recipe, contrast, focus and local legacy neutralization; unchanged legacy consumers | Packed-consumer browser with shipped stylesheet, hover/focus/reduced motion, contrast and cascade |
| LB-07 | Native forwarding, layout-only class merges, no unintended own props or refs; English docs and controls | Type/DOM tests, docgen/Controls, static CVA scanning and React 18/19 packed consumer without Tailwind |

**Closure:** OQ-1–OQ-9, exact payload and visual adoption, responsive exceptions, VOD Material recipe, accessible immutable asset handoff and independently approved plan remain pending. No source, registry, catalog, token, dependency or remote mutation follows from this draft.

## Blocking owner questions

| ID | Question / evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | One organism or separate live and recordings organisms? Foundation `LiveBand/README.md:1-13`, `CONTRACT.md:82`; catalog `scripts/catalog_data.py:111`. | One organism contract with independently placeable Field and optional Streams parts; host composes the two sections. If independently reused archive proves a separate responsibility, split before implementation. |
| OQ-2 | Who paints the flood field and frames recordings? `docs/components/section-shell/v0.1/spec.md:22-28,65-69`; Foundation `LiveBand/README.md:31-34`. | Host uses approved SectionShell flood for Field and a separate suitable host section/background for Streams; no duplicate flood paint or assumed SectionShell implementation. |
| OQ-3 | Use custom timer or delivered Countdown? `packages/ui/src/atoms/countdown/types.ts:29-105`, `useCountdown.ts` root props; Foundation `LiveBand/README.md:45-48`. | Reuse Countdown with host-supplied epoch deadline, localized absolute text/timezone, visible label and units; keep actual quiet named timer and exposed values, not Foundation's hidden-digit aria-label. |
| OQ-4 | Tilted frame and hover straightening? `LiveBand/README.md:8`, `packages/ui/src/atoms/photo-frame/types.ts:99-119`. | Reuse framed landscape PhotoFrame's existing token-derived tilt and reduced-motion reset; omit hover straightening unless specifically approved. Exact crop and caption differ. |
| OQ-5 | D7 Pixel, decorative SVG or omit? `LiveBand/preview.html:16-17`; `odd/tasks/web-catalog.md` D7/L25. | Omit pending Pixel approval/delivery; accept the visual difference, or separately approve an aria-hidden SVG recipe. Do not add an unapproved dependency. |
| OQ-6 | ArticleFeature whole-card link or dedicated VOD part? `packages/ui/src/molecules/article-feature/types.ts` ArticleFeatureProps/ArticleFeatureCoverProps; `LiveBand/preview.html:49-58`. | Dedicated local single anchor with noninteractive play and metadata, no nested links; ArticleFeature's 16:8 article cover/content does not reproduce 16:9 overlay. Approve compliant Material recipe before plan. |
| OQ-7 | How compose the CTA and past streams? `StreamItem/README.md:5-20,35-50`; `docs/components/list-item/v0.2/observed/browser-check.md:11-15`; `packages/ui/src/atoms/button/types.ts:14-54`. | Dark Button asChild anchor; editorial-divided ListItem on each anchor inside `li`, consumer `<time>` and readable duration, separate archive link. |
| OQ-8 | Keep source viewport ≤860/≤1080 and ≤560 details? `LiveBand/README.md:31-38`; `packages/ui/src/styles/legacy/bundle.css:980-988`; `packages/tokens/src/theme.css`. | Explicitly approve only component-local 860 and 1080 boundaries; handle small play/title with approved token-responsive sizing or separately approve 560 after design review. |
| OQ-9 | Who owns ambient profile and wash? `LiveBand/README.md:39`; `docs/CATALOGACION.md` web consumer amendment. | Host/effects controls `live` ambient profile and any section background; UI neither imports effects nor replicates legacy 50% wash. |
