# Footer v0.1 — navigation link target amendment

Owner answer (verbatim, 2026-11-03): "Excepción local en Footer a 44px (Recomendado)".

## Finding

The approved plan's gate 6 requires every Footer navigation link to reach a 44 × 44 CSS px target, and stops if the unmodified `Link arrow={false}` cannot. Real Chromium measured the first links at 42 × 13.44 px and 29 × 13.44 px (`observed/browser-functional-checks.json`, `observed/gate-6-initial-1280.png`): the anchor has no padding and its height is its line height, so enlarging the list item does not enlarge the hit box.

## Amendment

Footer passes `min-h-14 inline-flex items-center` (token `--space-14`, 44.8 px at the ×0.8 scale) to each `Link` it renders inside `FooterNavigation`, as a Footer-scoped exception to Link's "className for outer layout only" rule. The horizontal target relies on the link text plus the list spacing; the browser check verifies both dimensions against the plan's requirement.

- No change to `Link`, its contract or its other consumers.
- No change to consumer-supplied links in other Footer parts (brand, social, legal).
- Everything else in the approved contract and plan (whole-file SHA-256 `1009fa7b5879b44e4b9fd7b70dd572923be90aeaa346d5a169fbb58d36ebd5ce`) is unchanged; the original files stay byte-identical.

## Follow-up — width (2026-11-03)

Chromium follow-up after the height change measured 42 × 44.80 px and 29 × 44.80 px (`observed/gate-6-follow-up-1280.png`): content-sized widths stayed below 44 px. Owner answer (verbatim): "Sumar min-w-14 a la excepción (Recomendado)". Each `Link` inside `FooterNavigation` also receives `min-w-14` (44.8 px), with its text start-aligned. Same scope as above: Footer navigation links only; `Link` and other consumers are unchanged.

## Consumer-supplied links (2026-11-03)

The second browser follow-up confirmed both navigation links at 44.80 × 44.80 px. It also measured consumer-supplied links in the Focus story: brand "Home" 64.77 × 25.59 px, the SocialLinks profile 38.39 × 38.39 px and legal "Privacy" 42 × 20.47 px, with Home and Privacy at 1.94:1 contrast against the Storybook host background (`observed/browser-check.md`).

Owner answer (verbatim): "Obligación del consumidor; corrijo las stories (Recomendado)". The 44 px target is guaranteed only for Footer-owned navigation links. Brand, social and legal links are consumer content under the approved contract: their target size and contrast are documented as consumer obligations, and the stories must demonstrate compliant consumer content. SocialLinks keeps its own approved contract and is not changed here.
