# TopBar v0.1 — proposed issue handoff, not posted

**Draft — not ready for implementation.** This prepared initial issue body is for owner review only; no GitHub action has been performed or authorized. OQ-1–OQ-6 remain open. One issue per component; future versions require separately authorized comments, not silent body replacement. Canonical issue and latest published comment are Pending.

## Snapshot identity and recovery

- Version: `0.1`; status: **Proposed**; approval reference: **Pending**.
- Full, recoverable local snapshot: [`spec.md`](spec.md), all seven contract blocks and owner questions. Canonical payload SHA-256 `12dc99c75b4b5e07e3772fd55f0c0c413339f64c6fe9ab0cd58404640fa74e82` (exact `## 1. Purpose and scope` heading line through EOF, UTF-8 LF including final newline). Before remote handoff the parent must provide an accessible immutable snapshot and verify its bytes; this local link alone is not a GitHub-visible asset.
- VIS-01 SHA-256 `4472d21dd0d5f12375972ca309a75a0d067ce63278e6e36eb4b741e2a961f25b`; VIS-02 SHA-256 `dbdd553b8f813cf5792d7932ac6fb07c37031c71eb73ca4b759b2c7ac7240a7a`. Capture metadata and limits: [`capture.json`](capture.json), raw parent provenance in [`capture-raw.json`](capture-raw.json). Foundation board capture, not a DS implementation. Visual conformity: **Not evaluated**.
- Asset handoff pending: publish or attach the two exact PNGs only under separate authorization; verify accessible downloaded bytes against these hashes before inserting real URLs. No URL or approval is invented.

## Proposal and owner decisions

TopBar is site navigation chrome in `@egdev/ui`, classified as an organism by the approved web catalog. The proposed API has a named `header`/inner `nav`, consumer-supplied brand and search/user/mobile parts, ordered `items`, `label`, optional `onNavigate` and a host-supplied native `data-state`. It contains no built-in account, links, shortcut, route detection, scroll listener or mobile menu implementation. MobileMenu (Dialog + NavList + SocialLinks) and UserMenu are recipes, not exports. Existing consumers and legacy rules remain unchanged.

1. **Navigation:** recommend native links for observed flat destinations; `scripts/catalog_data.py:99` names NavigationMenu but `packages/ui/package.json:24-58` has no `@radix-ui/react-navigation-menu`. If flyouts are required, use the individual Radix package only after separate dependency approval.
2. **State/Material:** recommend host `data-state` instead of new `scrolled` prop, no scroll listener; the host drives glass for scroll and an open mobile dialog. Foundation `design-system/components/TopBar/README.md:19-33` differs from `docs/MATERIAL.md:14,54-59`; approve transparent use on a legible host and Material overlay with a solid `surface-2` reduced-transparency fallback.
3. **Composition:** recommend consumer-supplied search, account and mobile trigger; Dialog/Menu own interactions, Escape, focus and portals. Evidence: `docs/components/web-catalog/v0.1/cataloging-draft.md:31,59`.
4. **Compact layout:** recommend TopBar-only ≤900px container query, subject to explicit approval and built CSS boundary tests. Foundation `TopBar/README.md:28`; `docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3-7` approves 48rem only for CommunityCard, not TopBar.
5. **Position:** recommend fixed viewport-top bar; host reserves `--nav-height` once and coordinates with the separately proposed SectionShell, without assuming its API. Evidence `TopBar/README.md:32`, `packages/tokens/src/theme.css:473-478`.
6. **Landmarks:** recommend native page-level header, distinctly labelled inner nav, `aria-current="page"` on the host's current link; controls outside nav. Evidence `TopBar/README.md:36-38`, `reference-web/pulso-source.html:740-749`.

Naming registry (`skills/_shared/prop-naming.json`, `docs/prop-naming.md`): `label` → `accessible-name`, `items` → `collection-items`, `onNavigate` → `navigation-intent`, all approved. Native children/data/class/anchor attributes do not add conventions. `product-identity`, `trailing-actions`, `compact-presentation` and `slot-composition` were considered and not reused for the proposed slots. No new convention or exception; future usages require real source review and whole-file hashes. Existing `TabBarProps` source `packages/ui/src/organisms/tab-bar/types.ts` SHA-256 `0ea79ce6d91c30838af890c520786a1d1cd866b1d310b3579eff3d09e23ad672`; `SearchTriggerProps` `packages/ui/src/atoms/search-trigger/types.ts` SHA-256 `31b3eff9676b1a6646a39ed20eea22a30df4fa29741bae5d38bd89434b7d95fc`.

Legacy `packages/ui/src/styles/legacy/bundle.css:492-531,1782-1783` collides with the stable root and old parts/state markers. A future plan must preserve legacy, use distinct internal markers, locally neutralize root effects and verify real cascade; the exact recipe and any stylesheet role are pending. The spec recommends no stylesheet only if static utilities suffice.

**Approval scope:** resolving OQs and adopting the exact snapshot and chosen visuals would approve only that component contract, not a plan, implementation, dependency, token, registry or catalog change. Obtain a separately approved implementation plan before source work. No capture itself proves visual or accessibility conformance.
