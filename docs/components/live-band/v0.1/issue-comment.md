# LiveBand v0.1 — proposed issue handoff, not posted

**Draft — not ready for implementation.** Owner questions OQ-1–OQ-9 are open. One issue per component; future versions require separately authorized comments. Canonical issue and latest published comment: Pending. No GitHub action has been performed.

## Snapshot identity and recovery

- Version `0.1`; status **Proposed**; approval reference **Pending**. Recover all seven blocks and owner questions in [`spec.md`](spec.md). Canonical payload SHA-256 `8ea4767016ed22c1e0fc022fb73f0a23541ecae71106c3bef9f41196fc576061` (UTF-8 bytes from the exact whole `## 1. Purpose and scope` heading line through EOF, including final newline). Before remote handoff the parent must provide an accessible immutable snapshot and verify its bytes; this local link is not a GitHub-visible asset.
- VIS-01 `501ce4aa4d1602e180bccb33aa658f65540b42b5ee38f4dd2e96bd410327101e`; VIS-02 `3975eebab47e3be4156943b7382add59b36ad71eb83f01335bfadbe253b5bd14`. See [`capture.json`](capture.json) and parent-supplied [`capture-raw.json`](capture-raw.json). Foundation board capture, not DS parity. Visual conformity: **Not evaluated**. Accessible asset handoff and independently verified downloaded bytes remain pending; no fabricated URL.

## Proposal and owner decisions

One `@egdev/ui` organism contract with separately placeable live Field and optional Streams parts is recommended; the host composes SectionShell and content, owns domain data and effects. No behavior or implementation is approved by this draft.

1. **One or two:** recommend one contract with independently placeable parts, splitting only if independent archive reuse justifies it. Evidence `design-system/components/LiveBand/README.md:1-13`, `scripts/catalog_data.py:111`.
2. **Flood ownership:** recommend host SectionShell `flood` for Field and separate appropriate host frame for Streams, no duplicate paint; approved SectionShell is not yet implemented (`docs/components/section-shell/v0.1/spec.md:22-28,65-69`).
3. **Countdown:** reuse delivered Countdown with host epoch deadline, localized deadline text/timezone, label and units; preserve its named quiet timer and visible accessible values, no new data/timer (`packages/ui/src/atoms/countdown/types.ts:29-105`, `useCountdown.ts`).
4. **Photo:** reuse framed landscape PhotoFrame and its token-derived static tilt; no new hover straightening, and no transform under reduced motion (`packages/ui/src/atoms/photo-frame/types.ts:99-119`).
5. **Pixels:** omit pending D7 approval/delivery; alternatively request separate decorative SVG recipe approval (`LiveBand/preview.html:16-17`, `odd/tasks/web-catalog.md` D7/L25). This differs from the visual.
6. **VOD:** recommend new local whole-card anchor with noninteractive play, not nested actions. ArticleFeature's 16:8 article layout is not a 16:9 video overlay; approve a compliant Material recipe separately (`packages/ui/src/molecules/article-feature/types.ts`, `LiveBand/preview.html:49-58`).
7. **CTA and rows:** Button dark asChild anchor; `<li><ListItem variant="editorial-divided" asChild><a>…</a></ListItem></li>`, `<time>` and readable duration, separate archive link (`docs/components/list-item/v0.2/observed/browser-check.md:11-15`, `StreamItem/README.md:5-20,35-50`).
8. **Responsive:** explicitly approve local viewport boundaries ≤860 and ≤1080; no default md. Token-responsive small VOD sizing or a separate ≤560 approval (`packages/ui/src/styles/legacy/bundle.css:980-988`).
9. **Ambient:** host/effects owns `live` profile and any wash; UI does not import effects or duplicate background (`LiveBand/README.md:39`, `docs/CATALOGACION.md` web amendment).

**Naming:** registry `skills/_shared/prop-naming.json` and `docs/prop-naming.md`: no new own props or conventions; native `children`, `className`, `href` are not own conventions. `collection-items` does not describe compound children; `slot-composition` is Radix substitution. Reused child entries: `deadline-instant`, `absolute-deadline-text`, `accessible-name`, `surface-material-tone`, `slot-composition`; ArticleFeature comparison `card-link-action-label`. `auto-dismiss-duration` is not media duration. No exceptions or registry changes. Reviewed `CountdownProps` `packages/ui/src/atoms/countdown/types.ts` SHA-256 `35d8c209c7aa249f4a78bb3c0c8c1154dd34affed22529cff4af8e134b97908e`, `PhotoFrameProps` `packages/ui/src/atoms/photo-frame/types.ts` `aca1d91add7e92b3629233d6bc521b2d07d1e7bf14d86795c3ba23fe6213092e`, `ListItemProps` `packages/ui/src/molecules/list-item/types.ts` `df2e05c470c79ad94bef1b06c87d118216ea601ebebe1d8aea6cff8c366cbe76`, `ArticleFeatureProps` `packages/ui/src/molecules/article-feature/types.ts` `dd19b9b2a315dd9b854fed3cb7b62973f30fc81a330d156b88ed78a697cb63d6`, `ButtonProps` `packages/ui/src/atoms/button/types.ts` `8c61498c24fe7f3da8f7393782910328e9f48cb5273b31dcd215f8bd9f58a0cb`. Convention approval is independent.

**Legacy:** `packages/ui/src/styles/legacy/bundle.css:930-993` collides with stable root and legacy field, wash, grid, VOD and play selectors; preserve legacy, use distinct internal markers, locally neutralize root and verify child collisions/cascade with shipped CSS. Exact recipe and any stylesheet role remain pending; no stylesheet is recommended only if utilities suffice.

**Approval scope:** resolve questions, adopt the exact payload and chosen visuals, explicitly approve any local breakpoint or Material recipe, then separately approve a plan. No implementation, registry, catalog, token, dependency or remote mutation is authorized here.
