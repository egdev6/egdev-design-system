# ColorSwatchGroup picker look (#465)

Implementation of the approved spec `docs/components/color-swatch-group/v0.2/picker-look-amendment.md` (PR #467). Branch `feat/color-swatch-picker-look`, one PR closing #465.

## Specs

- S1: Owner correction verbatim (L6 of `odd/tasks/nexo-requests-464-466-specs.md`): "465 el aspecto visual tiene que ser el mismo que quorb y nexo". Default look (no prop): circular swatches, visually hidden per-option labels with accessible names kept, hairline ring per swatch, neutral double ring for the selected swatch (surface gap + 2px `fg-default`), distinct offset `focus-ring` outline, custom-colour control as a spectrum circle with a dark plus badge in the same row. RadioGroup semantics, the custom colour input and the `<output>` are kept.
- S2: Owner decisions verbatim (L8): "38.4px circle in a 44.8px target (Recommended)"; "New named spectrum token (Recommended)"; "Ring only, no check (Recommended)". Spec decisions: the same ring marks the custom control when a valid non-preset colour is active; dark plus badge.
- S3: Plan choices verbatim (L2 below): hairline "Token border (Recommended)" (`border-(--border-width)` + `border-hairline-strong`, no arbitrary shadow); forced colors "Keep hues on the patch only (Recommended)" (`forced-color-adjust-none` only on the aria-hidden patch; rings and focus use system colours); spectrum "Hex stops (Recommended)" (`--gradient-spectrum: conic-gradient(#FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)` in `packages/tokens/src/theme.css`, English comment).
- S4: Only the aria-hidden preset patch may use `bg-[color:var(--eg-swatch-color)]` with validated inline `--eg-swatch-color` (AGENTS.md exception); the spectrum is a token utility.
- S5: Issue acceptance criteria verbatim: "With the neutral style, the selected swatch shows a surface gap plus an `fg-default` ring, readable on every preset including red, and the focus ring stays distinct." / "Stories and tests cover the style."
- S6: Owner instruction verbatim: "en cada entrega enséñame storybook para verificar".

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S5 | worker | this commit |
| T2 | S5–S6 | parent | Chrome measurement, artifacts, checks, Storybook, PR |

## Log

- L1: Plan (explorer, 2026-11-18): item `size-14 rounded-full` target, patch `size-12 rounded-full`, new aria-hidden `ring` part (hairline + `group-data-[state=checked]:outline` 2px `fg-default` with `--focus-width` offset), labels `sr-only`, remove Indicator/check, focus `focus-visible:outline` `focus-ring` with offset beyond the ring (ring outer radius 23.2px vs 22.4px half-target: measure), custom frame `data-state=checked` for a valid non-preset value, spectrum circle + `Icon plus` badge `bg-surface-0`, custom input transparent overlay with `has-[:focus-visible]` focus on the frame. Tests pinning the old look: `ColorSwatchGroup.test.tsx:105,627-637`; script pins in package-exports/package-consumption; token count 311 → 312 in `packages/tokens/tests/token-contract.test.mjs:130,135`.
- L2 (owner choices, verbatim labels): "Token border (Recommended)"; "Keep hues on the patch only (Recommended)"; "Hex stops (Recommended)"; "Approve and implement".
- L3: T1 done by worker (RED tokens 3 / component 6 → GREEN tokens 71/71, component 29/29). Parent: registry revisions rehashed (6), catalog row updated + regenerated, props docs, tokens, build, artifact, system.md. `scripts/prop-naming.test.mjs` compared the immutable v0.1 approval receipt with the CURRENT types.ts hash, so any types.ts change forced rewriting a human approval record; the test now pins the receipt's reviewed revision (`sha256:6e52ed0b…`) and the receipt is unchanged. Checks: Vitest 3185/3185, tokens 71/0, package-consumption, package-exports 137/0, system 36/0, props 130/0, typecheck, biome. Chrome: target 44.8px, circle 38.4px, selection ring 1.6px (`--focus-width`) white with 1.6px gap, hairline 0.8px white/14%, focus outline 1.6px `#FF0036` offset 1.6px outside the target, row gap 9.6px; matches the owner's Quorb/Nexo screenshot.
- Open: registry usage type strings still say "visible" for `ColorSwatchGroupOption.label` ("string (visible and accessible preset name)") although option labels are now visually hidden; changing them touches approval-pinned usages → follow-up decision for the owner.
