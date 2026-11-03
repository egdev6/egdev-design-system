# Pixel v0.1 — proposed issue handoff, not posted

**Draft — not ready for implementation.** OQ-1–OQ-6 are open. This prepared initial issue body is for owner review only; no GitHub action has been performed. One issue per component; later versions require separately authorized comments. Canonical issue and latest published comment: Pending.

## Snapshot identity and recovery

- Version `0.1`; approval reference **Pending**. Full seven-block local snapshot: [`spec.md`](spec.md); canonical payload SHA-256 `9d2c435e3648f428b6b58dc216fbc86c690ee43c0e00232cd077b1b7db2bb490` (exact heading line `## 1. Purpose and scope` through EOF; UTF-8 LF with final newline).
- VIS-01 `164187ecd80434b8e824153f62b3055b55255292d8c2a7bbeedb84dffd7957d4`; VIS-02 `2348a1ddb51ce598249e9088ac0a040343bf3b1c52724096937ba750a504c72c`. See [`capture.json`](capture.json) and parent [`capture-raw.json`](capture-raw.json). Visual conformity **Not evaluated**.
- Asset handoff is pending separate authorization: the parent must provide an accessible immutable full snapshot and image URLs and verify downloaded PNG bytes before publication. Local links alone are not GitHub-visible assets.

## Proposal and owner decisions

One empty, always-hidden decorative marker in `@egdev/ui`, classified as an atom; no built-in sequence, meter, navigation, text or interaction. The proposed `state` (`idle` default, `past`, `active`) maps to `data-state`, not legacy state classes. The host supplies meaningful text/current or accessible meter semantics.

1. **Geometry:** recommend a Pixel-only approved static `[clip-path:polygon(0_0,100%_33.8%,100%_100%,0_66.2%)]` utility and no stylesheet if compiled; geometric percentages are not color, spacing or fonts but Pixel permission remains pending. Alternatives: meaningful geometry-only `@layer components` stylesheet only if compliant utilities cannot express it; explicitly approved new geometry tokens; or inline SVG with different anatomy. Evidence: Foundation `design-system/CONTRACT.md:8-11`, `packages/ui/src/styles/legacy/bundle.css:182-187`, `skills/_shared/component-contract.md` stylesheet and geometry rules.
2. **Size:** recommend 6.4×9.6 CSS px via token-backed `w-2 h-3`, explicitly different from the Foundation 8×12 capture; no size prop. Evidence `Pixel/README.md:3`, `packages/tokens/src/theme.css:415-423`.
3. **State and naming:** recommend `state` prop plus derived `data-state`, with separately approved widening of existing `consumer-selected-condition` convention, whose current wording is Gauge-specific. Evidence `Pixel/README.md:11`, `packages/ui/src/atoms/status-dot/types.ts`.
4. **Colors:** past `--color-bg-deep`, active `--color-fg-brand-default`; recommend token-backed `bg-fg-default/18` for idle only with explicit scoped approval of the literal alpha, otherwise select a different existing token or separately approve a new token. Evidence `Pixel/README.md:14-19`, `packages/tokens/src/theme.css:36-39,72-79,136-137`.
5. **Glow:** recommend none, a visual deviation; legacy's un-tokenized drop shadow is not equivalent to available box-shadow tokens. Evidence `packages/ui/src/styles/legacy/bundle.css:189`, `packages/tokens/src/theme.css:343-348`. A new filter token requires separate approval.
6. **Composition:** recommend separately composed SectionNav list and accessible meter; NowCard's currently approved footer excludes the meter and needs its own future amendment. Evidence `design-system/components/SectionNav/preview.html:25-29`, `design-system/components/NowCard/README.md:20-26`, `odd/tasks/web-catalog.md` L29.

Registry: `state` → `consumer-selected-condition` (approved existing convention but proposed widening pending independent approval); `visual-treatment`/`variant`, `surface-material-tone`/`tone`, `preset-dimensions`/`size` considered and not used. Native `data-state` and `className` need no own entry. Reviewed source `packages/ui/src/atoms/status-dot/types.ts#StatusDotProps`, SHA-256 `4d3db595cffe56d87931b3000d57fa0226a2c812d35950308f6d4309c89e4ecb`; no Pixel source revision exists. No convention or exception is silently approved.

Legacy `packages/ui/src/styles/legacy/bundle.css:182-190` matches the stable root and sets geometry, background, transition and old state filter. Preserve it; locally neutralize conflicting properties with approved static utilities, do not emit `.is-*`, and verify real shipped CSS cascade and reduced motion. The exact role, recipe and visual differences are pending.

**Approval scope:** exact snapshot and chosen visual approval would approve only the component contract, not a plan, implementation, naming convention, token, dependency, registry, catalog change or publication. A separate implementation plan and explicit approvals remain necessary.
