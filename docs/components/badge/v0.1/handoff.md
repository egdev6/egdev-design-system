# Badge — parent handoff

## Bounded repair handoff — PR #159 plus main `05591b1`

The seven conflict files are resolved in the working tree only; Git still reports them unmerged until the parent stages them. No staging, commit, merge command, install or push was performed by the repair writer.

Repair writes:

- `.storybook/main.ts`: Badge plus all main native metadata rows.
- `packages/ui/src/lib/storybook-controls.test.ts`: additive component inventory; all independent main and Badge assertions retained.
- `scripts/package-consumption.test.mjs`: one React type import, complete main/Badge samples, helpers and scenes; summaries include Badge.
- `scripts/package-exports.test.mjs`: independently closed Badge and main CSS tests; all runtime/declaration recipes and private Slider exclusions retained.
- `skills/_shared/prop-naming.json`: exact reviewed usage union, including both Badge and Input leading icons; no approval/revision changes.
- `scripts/prop-naming.test.mjs`: exact Badge plus main post-receipt pairs; immutable assertions untouched.
- `docs/prop-naming.md`: regenerated from the union.
- This handoff and `implementation.md`: separate repair evidence from original pre-merge gate results.

Auto-merged root exports, docgen, production/story CSS sources and catalogue were inspected for additive completeness; they retain main plus Badge, without claiming any open-PR component as implemented. Catalogue regeneration retains 107 rows. The exact seven approved transition selectors, twelve negatives, 255-token pin, shared DOM globals through the last scene and boolean identity assertions remain intact.

Repair validation: **342/342 tests across 14 files**, lint (**299 files**), typecheck, naming check and **82/82 naming tests** passed under the authorized caps. Exact commands and preservation details are in the implementation document's **Main integration repair** section. Strict TDD was not activated; no fresh RED/GREEN or browser evidence is claimed.

Parent still owns full build, exports and serialized packed React 18/19 gates, merge review/staging/completion and normal push. The original gate counts below are historical, not merged-tree verification.

## Proposed commit slices

Parent owns review, commits, integration, push and PR creation. Keep each complete test file with its helpers/imports; do not split test prefixes.

### 1. `feat(ui): implement passive Badge with consumer coverage`

Keep runtime exports and their allowlist tests atomic so this slice passes the existing public-API guards.

```text
packages/ui/src/atoms/badge/types.ts
packages/ui/src/atoms/badge/useBadge.ts
packages/ui/src/atoms/badge/Badge.tsx
packages/ui/src/atoms/badge/Badge.test.tsx
packages/ui/src/atoms/badge/Badge.stories.tsx
packages/ui/src/atoms/badge/index.ts
packages/ui/src/index.ts
packages/ui/src/styles/compiled.css
.storybook/main.ts
.storybook/preview.css
packages/ui/src/lib/storybook-controls.test.ts
packages/ui/src/lib/storybook-docgen.test.ts
scripts/package-exports.test.mjs
scripts/package-consumption.test.mjs
```

### 2. `docs(badge): register approved usages and verification`

These usage records reference the reviewed source introduced by slice 1. Include receipt-projection tests with the registry update; do not re-pin any approval.

```text
skills/_shared/prop-naming.json
docs/prop-naming.md
scripts/prop-naming.test.mjs
scripts/catalog_data.py
docs/CATALOGO.md
docs/catalog.json
docs/components/badge/v0.1/implementation.md
docs/components/badge/v0.1/handoff.md
```

`odd/tasks/particles-build.md` was already untracked on entry and remains untouched. No other files belong in these slices. No new stylesheet, token or dependency is needed.

## Ready PR title

`feat(ui): implement Badge from approved v0.1 contract`

## Ready PR body

### Summary

- Implement Badge #52 v0.1: a static span with six tones, soft/solid treatments, optional decorative leading content and the approved pill/label recipe.
- Export `Badge`, `BadgeProps`, `BadgeTone`, `BadgeVariant` and `badgeVariants`; retain legacy Tag/StatusBadge CSS and every earlier public export.
- Add the four contracted stories, real docgen/Controls regressions, precise production utility scanning and packed React 18/19 consumer coverage.
- Append exact usages of already-approved tone, visual-treatment and leading-icon conventions; regenerate naming/catalogue views without changing approval receipts.

### Contract and boundaries

Contract: https://github.com/egdev6/egdev-design-system/issues/52

Approval: https://github.com/egdev6/egdev-design-system/issues/52#issuecomment-6251420102

Canonical SHA-256: `eabc000b8cd3da7e9853e53dfaffc1403e26c6be704511277d762971301941e7`.

No substantive contract deviations. The catalogue's mandatory Icon dependency is corrected to the already-approved D7 consumer slot. WithIcon uses the current public Icon API; Badge has no automatic Icon dependency. No stylesheet, tokens, dependencies, ref, `asChild`, size axis or live announcements added. Non-empty meaningful text and non-interactive content remain consumer responsibilities. `className` supports outer layout only.

### Test-first evidence

- Observed behavior RED: missing tone/treatment utilities caused fifteen assertion failures; a sixteenth failure exposed a hook-test initial-props fixture defect, corrected explicitly.
- GREEN: 22/22 Badge tests; 128/128 focused component and real metadata tests.
- Triangulation: all twelve combinations, optional/numeric decorative content, native forwarding, layout merges, passivity and stale-state removal.
- CSS/export tests first failed against the pre-Badge build, then passed against emitted artifacts. Named shadow-token expansion is checked against the canonical token source.

### Validation

All gates were local, serialized and memory-capped; build ran before tests.

- Lint, typecheck and build: passed.
- Unit tests: 509/509 across 27 files.
- Prop registry validation: passed; receipt/schema tests 82/82.
- Package exports: 24/24; 47 reachable declaration files.
- Packed consumption: 12/12 for React 18.3.1 and 19.3.0, including strict positive/negative types, SSR, CSR and CSS with and without an application Tailwind compiler.
- Existing Surface/`surfaceVariants`/`ComponentProps`, Icon and Text/Heading fixtures retained; one React type import retained.
- No CI run claimed.

Exact commands, AC-01–AC-07 coverage, provenance and remaining checks: `docs/components/badge/v0.1/implementation.md`.

### Deferred owner review

Visual conformity, browser Controls widgets, browser keyboard/assistive-technology behavior, contrast/axe and screenshot comparison: **Not evaluated**. Per the batch instruction, the owner reviews the completed components in Storybook on main. Unit, metadata, emitted-CSS and jsdom checks do not substitute for browser evidence.

Refs #52
