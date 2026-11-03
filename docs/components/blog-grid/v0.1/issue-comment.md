# BlogGrid v0.1 — proposed issue handoff, not posted

**Draft — not ready for implementation.** OQ-1–OQ-6 remain open; no GitHub action was performed. One issue per component; later versions require separately authorized comments. Canonical issue and latest published comment are Pending.

## Snapshot identity and recovery

- Version `0.1`; status **Proposed**; approval reference **Pending**. Full local seven-block snapshot and open questions: [`spec.md`](spec.md).
- Canonical payload SHA-256 `a1c7290bcb83c2462ae5466fc6773206df562df119f4222f4c315f9d47ebfd3b`, exact whole `## 1. Purpose and scope` heading line through EOF, UTF-8 LF and final newline. Local link alone is not an accessible remote snapshot.
- VIS-01 SHA-256 `5cb69f155170b623f59fe8e3b6d238bfb4650c0480f3e29f882af0007fa35165`; VIS-02 `dbc0df77949721101322e0a196652fa9fcb60015eaf163212539df42ebd44a17`. Parent provenance: [`capture.json`](capture.json) and [`capture-raw.json`](capture-raw.json). Both are Foundation boards, not DS implementation; desktop board itself describes a one-column example. Visual conformity **Not evaluated**.
- Publication is pending separate authorization; verify accessible immutable snapshot and downloaded PNG bytes before inserting remote URLs. No approval or URL is invented.

## Proposal and owner decisions

BlogGrid is an `@egdev/ui` organism, with no built-in Pulso data. Recommended compound children provide one ArticleFeature, semantic editorial rows and an optional archive link. SectionHeader and SectionShell remain host compositions. It introduces no route, click handler, landmark or extra tab stop.

1. **Composition:** supplied feature and rows rather than the Foundation structured `feature`/`articles`/`allLink` model (`design-system/components/BlogGrid/README.md:11-17`; `scripts/catalog_data.py:110`). Alternative structured collection requires a defined schema.
2. **Layout:** approve a BlogGrid-only viewport breakpoint at ≤1080px; above it use 7fr/5fr and distribute free list height across rows, below stack naturally. Long content grows rather than clips (`BlogGrid/README.md:19-23`; `packages/ui/src/styles/legacy/bundle.css:923-927`). CommunityCard's 48rem approval is not transferable (`docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3-7`).
3. **List:** `ul > li` rows, archive after the list as sibling; Foundation uses a div of links (`BlogGrid/preview.html:25-30`).
4. **Links:** separate whole-card feature anchor, row anchors and archive anchor; feature action text is paint only. Correct row composition is `<li><ListItem asChild><a>…</a></ListItem></li>` (`docs/components/list-item/v0.2/observed/browser-check.md:13-15`). ArticleFeature's visible badge participates in its default link name (`docs/components/article-feature/v0.1/badge-name-amendment.md:3-9`). Never nest controls.
5. **Heading:** host supplies SectionHeader above the body (`BlogGrid/README.md:8`; `preview.html:13-18`), with its own section context.
6. **Material:** leave the layout wrapper unpainted over host SectionShell; use existing solid ArticleFeature and editorial ListItem surface recipes, not a new flat/glass card (`docs/MATERIAL.md`, web section). SectionShell's spec approval is not evidence of implementation.

Naming lookup (`skills/_shared/prop-naming.json`, `docs/prop-naming.md`): inherited `children`/`className` need no own convention; `collection-items` requires structured items, `slot-composition` is actual Radix substitution, and `trailing-actions` does not describe this archive. Existing child inputs `content-detail` and `card-link-action-label` remain child-owned. No new convention or exception; no invented BlogGrid source revision. Reviewed `ArticleFeatureProps` `sha256:dd19b9b2a315dd9b854fed3cb7b62973f30fc81a330d156b88ed78a697cb63d6`, `ListItemProps` `sha256:df2e05c470c79ad94bef1b06c87d118216ea601ebebe1d8aea6cff8c366cbe76`, and `LinkProps` `sha256:b5e5ba0b47c7e53c9a3759888c1d746a82596537fd3834d1ca3dd2a4b05503f3` in their respective `packages/ui/src/molecules/article-feature/types.ts`, `packages/ui/src/molecules/list-item/types.ts`, `packages/ui/src/atoms/link/types.ts`.

Legacy `packages/ui/src/styles/legacy/bundle.css:923-927` collides with the stable root and old list/row/archive selectors. Preserve it, use distinct internal markers and locally neutralize/override root grid, gap, alignment and breakpoint in the actual cascade; verify with shipped styles. No stylesheet is recommended only if utilities actually suffice; any required stylesheet role needs approval.

**Approval scope:** resolving questions and adopting this exact snapshot and visuals approves only the component contract, not its plan, implementation, token, dependency, registry, catalog or publication. A separately approved plan is required before source work.
