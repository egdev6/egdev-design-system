# NowStrip v0.1 — proposed issue handoff, not posted

**Draft — not ready for implementation.** Owner questions OQ-1–OQ-7 remain open. One issue per component; future versions require separately authorized comments. Canonical issue and latest published comment are Pending. No GitHub action has been performed.

## Snapshot identity and recovery

- Version `0.1`; status **Proposed**; approval reference **Pending**.
- Complete seven-block contract and decisions: [`spec.md`](spec.md), canonical payload SHA-256 `6e083a20352345ed6d3b0317e13a114e2b83165568b518a4a0de6e18b32227c4`, UTF-8 from exact heading line `## 1. Purpose and scope` through EOF including final LF. A remotely accessible immutable snapshot and verified bytes are required before publication.
- VIS-01 `97ee91df0f13be6b2954dd7ab587cf8f1a372509cc86c97833ce1e0ecf566fbf`; VIS-02 `944e986359850ec614d27ee83eb27dba16558f61c66306a7eadcac451a18c031`. [`capture.json`](capture.json) and [`capture-raw.json`](capture-raw.json) record parent-provided Foundation preview conditions. Not a DS render; visual conformity **Not evaluated**. Separate authorization and downloaded-byte verification are needed for publicly accessible assets.

## Proposal and owner decisions

NowStrip is a passive labelled organism in `@egdev/ui` composed from direct consumer-supplied NowCards; no Pulso copy, schedule, links or data are built in. Recommendations, not decisions:

1. **Composition:** supplied NowCards with explicit `size="sm"`, not structured cards or implicit cloning. Evidence: Foundation `design-system/components/NowStrip/README.md:12-16`; `packages/ui/src/molecules/now-card/types.ts:24-109`.
2. **Semantics:** group named by visible required `label` via `useId()`, static `StatusDot state="live" pulse={false}` hidden from AT, no live region. Evidence: Foundation `NowStrip/preview.html:13-14`; `packages/ui/src/atoms/status-dot/types.ts:5-31`.
3. **Breakpoint:** explicitly approve NowStrip-only inclusive viewport ≤860px single column, above three; test 859/860/861. Footer's and CommunityCard's local approvals do not transfer. Evidence: `packages/ui/src/styles/legacy/bundle.css:915-916`; `docs/components/footer/v0.1/spec.md` OQ-3; `docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3-7`.
4. **Equal heights:** stretch direct cards per row, no wrapper; footer alignment needs verification. Evidence: Foundation `reference-web/pulso-source.html:197-204`; `packages/ui/src/molecules/now-card/types.ts:112-129`.
5. **Meter:** omit for now, retaining NowCard's already approved difference; future consumer meter belongs in its footer only after a separately approved NowCard contract amendment and Pixel decision. NowStrip must not depend on Pixel. The delivered footer allows only one detail and/or one action, not arbitrary meter content. Evidence: `docs/components/now-card/v0.1/spec.md` OQ-1; `packages/ui/src/molecules/now-card/types.ts:80-95`; `odd/tasks/web-catalog.md` D7/L25.
6. **Hairline:** retain decorative token-backed bottom boundary and `--space-6` padding. Evidence: Foundation `NowStrip/README.md:19-21`; `packages/ui/src/styles/legacy/bundle.css:908-909`.
7. **Material:** host-owned Grafito reading surface and separately approved unpainted group/boundary recipe; delivered cards retain solid surface-1 and surface-0 band. Source glass and static dot differ. Evidence: `docs/MATERIAL.md`, Principles and En la web; `packages/ui/src/molecules/now-card/useNowCard.ts:75-110`.

Naming: `label` → approved `accessible-name`; `group-caption`, `collection-items` and `slot-composition` are distinct concepts, not applied. `children`/`className` are native composition. No new convention or exception; future NowStrip usage requires reviewed real source and its whole-file hash. Existing precedent `TabBarProps`, `packages/ui/src/organisms/tab-bar/types.ts`, `sha256:0ea79ce6d91c30838af890c520786a1d1cd866b1d310b3579eff3d09e23ad672`. Registry: `skills/_shared/prop-naming.json` and `docs/prop-naming.md`; convention approval is independent.

Legacy root, label, dot and grid rules collide (`packages/ui/src/styles/legacy/bundle.css:908-916`). Preserve legacy; avoid old internal markers, locally neutralize or match root declarations and verify cascade and boundaries in a real shipped-CSS browser. No stylesheet is recommended only if utilities suffice; otherwise seek a separately approved role.

**Approval scope:** resolving these questions and adopting the snapshot/visuals approves only the component contract, not implementation, plan, tokens, dependencies, registry, catalog or publication. A separately approved plan precedes code.
