# Gauge v0.8 — implementation plan

- **Status:** Approved for local implementation, including both prerequisites; separate delivery/network/asset permissions still apply.
- **Contract:** [Gauge v0.8](../../../specs/gauge.md), payload SHA-256 `f0999610927cc8556259c3896365697f4447ebae69eff810f3a2b66b57a3210d`.
- **Contract approval:** [approved Gauge v0.8](approval.json). **Plan approval:** [observed scoped approval](plan-approval.json), recorded from the explicit user response in the current conversation.
- **Canonical issue:** https://github.com/egdev6/egdev-design-system/issues/30. Later publication requires a separately authorized comment, not a body edit or a new issue.

## Prerequisites requiring specific approval

1. **Production Tailwind emission:** modify the existing separate UI stylesheet build and CSS entry to compile the static utilities used by Gauge, using already installed Tailwind/Vite dependencies. Current `vite.styles.config.ts` has no Tailwind plugin, and the package-export test explicitly rejects scanned utilities. Revise that obsolete expectation while retaining plain CSS output, stable exports, explicit consumer token imports and no token redefinitions. Do not migrate Surface, IconButton or Tabs or copy unreviewed worktree changes.
2. **Dynamic arc geometry:** permit a second private, numeric geometry custom property for the validated/clamped 0–100 measurement, alongside the already approved numeric diameter property. This drives the approved conic ring without interpolated class strings. The permission must remain limited to normalized geometry: no inline colors, fonts, shadows or arbitrary appearance. If the contract/policy interpretation requires a separate scoped amendment, record that approval before code; do not silently broaden the size-only exception.

No new dependency, token value, release or remote mutation is included. Any demonstrated need for one stops the affected work for a new decision.

## Work units

### 1. Establish the stylesheet build contract

- Add deterministic artifact assertions for the exact required Gauge utility output and the absence of unresolved Tailwind directives or canonical token redefinitions; observe failure before implementing the build support.
- Update `packages/ui/vite.styles.config.ts` and `packages/ui/src/styles/compiled.css` narrowly, preserving JavaScript importability without a CSS loader and the public `styles.css` export.
- Use explicit/static Gauge source scanning where supported; prove utility availability rather than assuming Storybook's Tailwind plugin covers production.
- Update `scripts/package-exports.test.mjs` without weakening checks for legacy selectors, layering, plain CSS or stable artifact paths.

### 2. Implement exactly seven meaningful Gauge files

| File under `packages/ui/src/atoms/gauge/` | Responsibility |
| --- | --- |
| `types.ts` | Approved public types, English JSDoc/defaults and static token-backed CVA variants |
| `useGauge.ts` | Numeric validation/clamping, size fallback, derived geometry, IDs, protected ARIA and per-part class composition |
| `Gauge.tsx` | JSX consuming the typed hook, with passive meter/unavailable semantics |
| `gauge.css` | Approved reusable conic-gradient/radial-mask geometry recipe; not a second appearance/variant engine |
| `Gauge.test.tsx` | Hook/DOM behavior, accessibility relationships, defaults, limits, updates and merge invariants |
| `Gauge.stories.tsx` | The eight approved scenarios, English JSDoc and real autodocs/Controls |
| `index.ts` | Named component and public type exports |

- Use test-first for applicable deterministic behavior: value limits and decimals, unavailable transitions, finite-positive sizes and invalid fallback, states/cues, unique descriptions, center alternatives and passive interaction.
- Preserve `eg-gauge` and all legacy consumers. Use isolated internal geometry markers and explicit token utility/cascade treatment so legacy hover, transition and dimensional rules cannot leak into the new passive component. Test actual emitted CSS and browser behavior; a new marker alone does not neutralize old root selectors.
- Reuse Surface's existing well treatment where appropriate without duplicating its recipe or breaking the meter root, center layout or mask visibility.

### 3. Integrate and verify the public component

- Add only the Gauge barrel to `packages/ui/src/index.ts` and its geometry stylesheet to `packages/ui/src/styles/index.css`.
- Extend applicable docgen, package-export and external-consumer tests. A packed consumer without a Tailwind compiler must render the shipped Gauge styling; React 18/19, client behavior and SSR are separate checks, not inferred from peer declarations.
- After reviewing the implemented API, update Gauge registry usages to real source symbols/revisions without approving global conventions automatically. Update only the relevant catalog source entry and regenerate the catalog if implementation tracking requires it.
- Run focused Gauge tests first, then applicable `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm props:check`, `pnpm test:props`, package-export and package-consumption checks. Record every observed result and prerequisite; dependency installation or network use needs its own authorized scope.
- Verify Storybook documentation/Controls and the real component in a browser. Compare approved visual scope under recorded conditions, including presets, custom sizes, states, centers, reduced motion and legacy coexistence. DOM tests, screenshots and metadata do not by themselves prove screen-reader behavior; report unavailable assistive-technology checks as Not evaluated.

## Delivery boundary

The approved local reference is available for implementation review, but its GitHub publication is still pending. No issue comment, asset upload, commit, push, PR, label/status mutation, closure or release is authorized by this plan. Preserve the existing issue body and unrelated worktrees. Report functional evidence and remaining delivery prerequisites separately.
