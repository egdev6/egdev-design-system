# SectionShell v0.1 — browser check

S3 / DI1; partial SS-02–SS-06 and SS-08 evidence, not a complete acceptance pass. Chromium headless shell 1243, Storybook iframe at 390×800 and 1280×800, dark, device scale 1. Storybook's loaded CSSOM contains the legacy `.eg-section >` rule. Raw measurements: `browser-functional-checks.json`; normal-transparency fade follow-up: `browser-supplement.json`. Screenshots retain the first measurements. Reduced-transparency emulated through CDP, confirmed by `matchMedia`. No source fixes made.

## Initial findings (before Storybook source-scan correction)

| Check | Result | Measurement |
| --- | --- | --- |
| SS-02 five paints | PASS, measured root paint | Pro transparent; show radial gradient 45% 55% at 22% 50%, rgba(255,0,54,.12); flood rgb(255,0,54)/black; deep rgb(128,12,29)/white; Grafito surface-0 at alpha .5 / white. Reduced transparency: rgb(20,21,24) opaque. |
| SS-03 wrapper | PARTIAL PASS | 390: root/wrap 358px, gutter 12.8px; 1280: root 1248px, wrap max 1024px, gutter 32px. Unwrapped story has one direct self-wrapped child, 154px wide at both widths; no extra wrapper. Explicit-width child and margin preservation not tested. |
| SS-04 height | PARTIAL PASS | min-height and actual short height 800px; top 80px = nav 54.4px + 25.6px; bottom 25.6px. Long content grows to 1171.59px at both widths. Actual anchor navigation/fixed bar offset not tested. |
| SS-05 group fades | **FAIL** | First normal-preference measurement: both underlays' computed `mask-image` and `-webkit-mask-image` are `none`, although mask tokens exist. Grafito section remains 50% wash instead of transparent; wash is doubled. Reduced transparency: underlay and section both opaque rgb(20,21,24), also with no mask. Adjacent section boundaries meet at y=816; that alone does not prove an unfaded seam. Bottom-only, neither edge, and short-group overlap not exercised. |
| SS-06 pseudo-elements | PARTIAL PASS | All five new roots: `::before` content `none`, image/mask `none`, position static, at both widths. CSSOM confirms legacy selector loaded. Descendant-card comparison and untouched legacy controls not exercised. |
| SS-08 contrast | PARTIAL PASS | Calculated WCAG ratios from measured root colors: flood black on rgb(255,0,54) **5.31:1**, deep white on rgb(128,12,29) **10.56:1**. Child/control and Grafito descendant contrast not tested. |
| SS-08 focus | PARTIAL | Tab focused the link; rect y=452.70–471.70 with story bar bottom 35px at both widths. Computed outline `rgb(16,16,16) auto 1px`, offset 1px. Actual visual contrast/visibility and anchor navigation remain unverified; story bar is sticky, not a measured fixed-height navigation. |

The initial likely cause was missing `.storybook/preview.css` source scanning for `SectionShell.stories.tsx`. The parent added that source before the follow-up below; the initial failure is retained as historical evidence.

## Follow-up after parent source-scan correction

Chromium headless shell 1243, 390×800 and 1280×800. The `followUp` object in `browser-functional-checks.json` preserves every initial entry and adds these measurements. Screenshots use `*-follow-up-*` names. No Storybook restart was necessary.

| Check | Result | Measurement |
| --- | --- | --- |
| SS-05 single top and both | PASS, computed story CSS | Both widths: top mask resolves transparent to black at 112px; both mask resolves black at 112px and `calc(100% - 112px)`. `mask-image` and `-webkit-mask-image` agree. Each single section is transparent; section mask `none`; underlay alpha 0.5 and pointer-events `none`. |
| SS-05 bottom and short overlap | PASS, computed fixture CSS | No bottom-only story exists: cloned host story markup uses the approved bottom token via fixture-only inline properties; both mask properties resolve `linear-gradient(0deg, transparent, black 112px)`. A 120px-tall both-edge fixture resolves stops at 112px and `calc(100% - 112px)` (8px); CSS stop fixup applies where they overlap. This tests the approved token, not emission of a bottom-specific story utility. Fixture-only inline height/padding overrides make the short group possible. |
| SS-05 adjacent / no double wash | PASS, computed | One 1600px underlay spans two 800px sections; they meet at y=816px. Both section backgrounds are `rgba(0,0,0,0)` while underlay is surface-0 at 50%; content masks `none`. |
| SS-05 reduced transparency | PASS, computed | CDP media query confirmed true. Underlays become opaque `rgb(20, 21, 24)` with masks retained; every grouped section remains transparent, at both widths, including fixtures. |
| SS-06 CommunityCard | PASS for this representative | A delivered CommunityCard story DOM was cloned inside the Grafito SectionShell and outside it. At rest and CSS hover both computed backgrounds are `rgb(27, 28, 32)` plus the same white-alpha gradient; backdrop filter `none`, border and box shadow match. This tests browser CSS, not copied React handlers or other card types. |
| SS-08 child focus | PASS for this fixture | Focused CommunityCard button is `:focus-visible` and in viewport at both widths. Ring: 2px surface-0 inner and 4px rgb(255,0,54) outer box-shadow. The red ring is visibly distinct in both `card-focus-follow-up` screenshots; no host fixed bar was included. |

## Limitations

SS-01, SS-07, packed no-Tailwind consumer, other legacy card comparisons and featured behavior, bottom-only story utility emission, 200% zoom and real fixed-bar anchor navigation remain outstanding. No actual screen reader, native zoom or Storybook Controls exercised. Light theme not evaluated. VIS-01 is a shortened-height four-register board and has not been compared for pixel parity. Reduced motion was requested during the initial run but no animation measurement was made. The initial reduced fade records include an unrelated Storybook `aria-hidden` element; use the section-associated entries and supplemental file for underlays.
