# Gauge transparent interior — bounded visual amendment and implementation plan

Status: proposal for separate plan approval; visual goal accepted in the current conversation. No code changes or verification results are claimed.

## Visual contract delta

The Gauge-owned circular wrapper becomes a transparent geometry frame rather than an opaque recessed well. It must not paint a background color/image or inset shadow over the interior. The existing arc, track and optional decorative center remain visible; transparency means showing the actual host background, not imitating its color. Paint intentionally supplied by decorative center content is not removed.

Explicit consequence: the existing semi-transparent unfilled track also loses the opaque backing beneath it and therefore blends with the actual host background. Its color/opacity definition and the filled arc are unchanged; identical track pixels across different backgrounds are not promised. Preserving an opaque backing under only the annulus is a different composition, not included in this plan.

This supersedes only the surface-0 background and shadow-well requirements of the v0.9 Gauge appearance. It is a Gauge-only exception, not permission for arbitrary flat Material surfaces. Preserve the native wrapper, internal marker, seven meaningful files and all other approved promises: public API, passive accessibility, values/states/defaults, presets/custom sizes, box model, stroke, center inset and +0.5px arc smoothing. No new prop, token, dependency, component, animation or appearance override API.

## Implementation unit

1. Create a local feature/fix branch from clean main 637b422c90ed60e87c34ccd9d1a1c6ac07cda1c0; preserve branches, the proposals worktree and the current Storybook process.
2. Persist the bounded v0.10 appearance amendment, this approved plan and separately identified manual human decision records. Preserve all v0.8/v0.9 contracts, receipts and historical captures byte-for-byte. The version is a component contract version, not an npm release.
3. In types.ts, replace only the circular wrapper's opaque background and shadow-well utility with transparent/no-shadow static CVA resets. Keep gauge.css, hook and JSX byte-identical if the source inspection confirms no additional change is necessary.
4. Update active CSS/compiled-style assertions to test the new finish without whole-class snapshots; retain geometry, arc/track and passive semantics coverage. Revise only active documentation that would otherwise instruct agents to restore the opaque well.
5. Manually re-review the unchanged eight Gauge own prop declarations after the CVA edit, then renew their whole-file source hashes in the registry and regenerate its view. Preserve all eight convention approvals, content hashes, meanings and five deferred entries.

## Active-reference footprint

- Source and active assertions: `packages/ui/src/atoms/gauge/types.ts`, `Gauge.test.tsx`, `packages/ui/src/lib/storybook-css.test.ts`, `scripts/package-consumption.test.mjs`.
- Evidence refresh only: `skills/_shared/prop-naming.json` and generated `docs/prop-naming.md`; convention approval records and normative payloads remain unchanged.
- Current appearance and version pointers only: `AGENTS.md`, `docs/ARQUITECTURA.md`, `docs/MATERIAL.md`, `docs/CATALOGACION.md`, `packages/ui/README.md`, `skills/_shared/component-contract.md`, `skills/component-contributor/SKILL.md`, its `references/testing.md`, `references/stories.md` and `references/radix-patterns.md`, plus the Gauge-specific sentence in `docs/storybook/material.mdx`.
- Update Gauge's contract pointer in `scripts/catalog_data.py` and regenerate `docs/CATALOGO.md`; no recataloging or availability change. Keep generic Material specimens untouched.
- Add only new v0.10 amendment/plan/manual-decision and verification artifacts. No historical spec, receipt, screenshot or log is rewritten. If another necessary active assertion is discovered, inspect and disclose it before expanding this footprint.

## Verification

- Observe genuine deterministic RED then GREEN for the transparent/no-shadow contract using the existing CSS compilation/testing pipeline. Build the actual UI CSS and verify its emitted rules rather than source utility strings alone.
- Run relevant Gauge/metadata/CSS tests, registry checks and tests, typecheck, lint and diff integrity checks; use the verification plan returned by any applicable assessment. No invented native approval.
- Use the existing Storybook on localhost:6006 and available Playwright MCP browser tools for scoped computed-style and image evidence. Compare at least two distinct existing token backgrounds; test the empty center and preserve visible decorative text/icon content. Check presets/custom numeric size, boundary values and condition states proportionately, distinguishing computed cases from captured cases.
- Require transparent background, no interior shadow paint, unchanged dimensions/strokes/mask/center positioning and preserved passive semantics. Record actual conditions, component-zone crops and limits under the new version; do not overwrite historical references or claim old/new pixel parity where the finish intentionally changes.
- The full Storybook MCP RPC smoke and packed React 18/19 matrix remain separately blocked: no retry, cache probe, install, dependency download or fallback network installation. No server restart is included. A browser failure stops that check for diagnosis; never silently count it as passed.

## Delivery boundary

Local implementation and evidence only after plan approval. No automatic commit, push, PR, issue mutation, merge, release or branch/worktree deletion. The canonical component issue remains #30; a future remote version handoff would require separate authorization, not a new issue per contract version.

Forecast: one cohesive appearance/contract/test unit; approximately 1–3 source lines, focused assertion changes and 20–40 active-reference lines, plus new bounded amendment/plan/decision/verification records. Provisional authored forecast: 150–350 changed lines; generated views, observation metadata and real binary captures are disclosed separately, not hidden. This is an estimate, not a counted diff. If the necessary authored forecast exceeds 400 lines, stop for a new review-load decision before producing that expansion; never shrink evidence or omit tests to fit. No token or dependency edits are allowed without a new explicit decision.
