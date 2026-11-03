# Footer v0.1 — browser check

S3 / DI3: the initial gate 6 / FT-08 measurements failed twice. After two separately approved Footer-local amendments the navigation targets pass, but the broader FT-08 check still fails for consumer-supplied brand, social and legal links in the Focus story. No Footer or Link source was changed during these checks.

## First failing measurement

Storybook `organisms-footer--default`, unmodified section links (`Link arrow={false}`), Chromium headless shell 153.0.8010.12, 1280 × 900 CSS px, DPR 1, system light preference, reduced motion off, fonts loaded (computed family `Barlow, system-ui, sans-serif`). Screenshot: `gate-6-initial-1280.png`; measurements: `browser-functional-checks.json`; reproducible harness: `browser-check.mjs`.

| Anchor | Actual hit rectangle | Required | Result |
| --- | --- | --- | --- |
| Projects | 42 × 13.4375 CSS px | at least 44 × 44 CSS px | FAIL |
| Notes | 29 × 13.4375 CSS px | at least 44 × 44 CSS px | FAIL |

The actual anchors are `inline-flex`, have `0px` padding and a `13.44px` line height; their own boxes are therefore too small. Enlarging their list items would not enlarge the anchor hit boxes. Proposed next step: obtain separate owner approval for a contract-compliant target-size solution; no specific Link API or Footer override is authorized by this plan.

## Owner-amended follow-up — still FAIL

After the owner-approved Footer-local `min-h-14 inline-flex items-center` exception, the story was reloaded. Both anchors carry the new classes and compute `min-height: 44.8px`; Storybook picked up the change. Chromium 153.0.8010.12, 1280 × 900 CSS px, DPR 1, fonts loaded:

| Anchor | Initial width × height | Follow-up width × height | Required | Result |
| --- | --- | --- | --- | --- |
| Projects | 42 × 13.4375px | 42 × 44.796875px | at least 44 × 44px | FAIL (width) |
| Notes | 29 × 13.4375px | 29 × 44.796875px | at least 44 × 44px | FAIL (width) |

The exception adds minimum height, not width: both anchors remain `inline-flex` with `0px` padding, and surrounding list spacing does not enlarge their rectangles. `gate-6-follow-up-1280.png` and the separately labelled `followUp` object in `browser-functional-checks.json` preserve this measurement; the initial results remain in `initial`. Stop again: a separately approved contract-compliant horizontal target solution is needed. No source was changed.

## Second follow-up — navigation gate PASS

After the owner added `min-w-14`, reload picked up the change. Projects and Notes each measure **44.796875 × 44.796875px** at 1280px, with `justify-content: flex-start` and text start offset 0px. `gate-6-second-follow-up-1280.png` and `secondFollowUp` preserve the evidence; initial and first follow-up remain unchanged.

## Remaining checks (Chromium 153.0.8010.12, DPR 1)

| Check | Result and measured evidence |
| --- | --- |
| Grid boundary and brand | PASS at 859/860/861: tracks 397.5/397.5, 398/398, 315/225/225px respectively. Brand spans two at 859/860, `auto` at 861. Social-only story without brand has first child `auto` at 859/860/861; this covers that combination, not all combinations. |
| Overflow and long content | PASS for default and Responsive stories at 390/859/860/861/1280: page scroll width equals viewport. At 390 a 400-character unbroken navigation label has 163px client and scroll widths in a 358px footer; this is a DOM-injected stress case. |
| Landmarks | PASS for Landmark story: one main, one contentinfo outside main, one nav named Explore and one list named Community profiles. |
| Keyboard and focus | PASS for the Focus example's tab order: Home → Projects → Notes → Community profile → Privacy; all match `:focus-visible`. Nav/brand have focus shadows and Privacy has a native outline; social shadow is visible after its transition settles (4px outer ring). Enter on Privacy sets `#privacy`. The immediate social measurement was transparent; both immediate and 600ms settled measurements are retained. |
| Reduced motion | PASS: media query matches; nav and social links have `transition-property: none`, while logo and legal links have 0s duration. |
| Hairlines and sampled legacy collision inventory | PASS for default story at all five widths: root top/bottom, grid top and legal top are 1px solid `rgba(255, 255, 255, 0.08)`, matching tokens; root relative, transparent and shadowless, padding bottom 25.6px; stage padding 38.4px 0 32px; grid gap and top padding 32px; legal flex-wrap, space-between, gap 12.8px, top margin 38.4px, top padding 16px and font-size 12.8px; nav list has zero margin/padding and `list-style: none`. A separate bare legacy fixture at 390 computes red root border, subtle grid/legal borders and `1 / -1` first child, demonstrating legacy CSS is loaded and the new recipe wins for these cases. Minimal has no stage/grid and one legal row. |
| All hit targets | FAIL in Focus at 390: Home 64.765625 × 25.59375px, Community profile 38.390625 × 38.390625px, Privacy 42 × 20.46875px. Those are consumer-supplied Logo, SocialLinks and legal content, outside the navigation-only amendment; parent/owner must decide a contract-compliant resolution. |
| Host-background contrast | FAIL for sample Home and Privacy: computed blue `rgb(0, 0, 238)` against Storybook body `rgb(20, 21, 24)` gives 1.94:1; consumer-supplied native/link styling must be addressed by its owner. Projects and Notes are 4.61:1 and social icon foreground is 11.37:1. |

Captures `default-second-follow-up-{390,859,860,861,1280}.png`, `long-unbroken-second-follow-up-390.png`, and social focus captures are alongside the JSON and reproducible harnesses. Raw computed declarations and first measurements are in `browser-functional-checks.json`.

## Limitations / not evaluated

Fractional viewport boundaries, every optional-part combination (including navigation-first without brand), multiple Footer instances, extensive legal/social wrapping, every possible legacy import order, actual Controls widgets, production CSS emission/packed consumers, 200% native browser zoom and a screen-reader session were not evaluated. No visual parity is claimed; reference adoption is not established. The observed contrast is specific to this Storybook host and consumer-supplied content.

## Parent follow-up — consumer link contrast (2026-11-03)

After the owner decision "Obligación del consumidor; corrijo las stories (Recomendado)", the stories use the delivered `Link` for legal and host links (no overrides). Parent re-measured every Footer story in Chromium against the nearest painted background: navigation and legal links 4.61:1 (was 1.94:1 for "Privacy" in the Focus story), the SocialLinks profile 11.37:1. Consumer target sizes (Logo brand, SocialLinks profile, legal links) remain consumer and child-contract obligations, documented in the Footer part JSDoc and `link-target-amendment.md`.
