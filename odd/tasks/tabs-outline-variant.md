# Tabs outline variant (#464)

Implementation of the approved spec `docs/components/tabs/v0.3/outline-variant-amendment.md` (merged in PR #467), plus Chip following the accent. Branch `feat/tabs-outline-variant`, one PR closing #464.

## Specs

- S1: Approved spec, owner decisions verbatim (feature log L8 of `odd/tasks/nexo-requests-464-466-specs.md`): "Derive the gradient from the accent (Recommended)" — `--gradient-chip-active` built from the accent role so a custom accent recolors it; same look in red. Spec "Owner decisions — 2026-11-17": edge-only shadow `--shadow-edge-strong`; shared 600 label weight; DS accent focus ring; `fullWidth` and `labelWrap` also apply to `outline`; name `variant="outline"`.
- S2: Owner correction verbatim (L6): "464 yo lo veo más como una variante propia (Tal i como estaba en Nexo" — `outline` is its own value of the Tabs `variant` prop; `underline` and `segmented` rendering and defaults do not change.
- S3: Token change via the accent helper only (`packages/tokens/src/accent.ts` default and custom maps): default `--gradient-chip-active` byte-identical to `packages/tokens/src/theme.css:549`; custom = `linear-gradient(180deg, rgba(base,0.24), rgba(base,0.09))` with the helper's adjusted base. `theme.css` and the compiled `tokens.css` unchanged.
- S4: Owner choice verbatim (L2 below): "Chip follows the accent too (Recommended)" ("Same token change, plus Chip's selected border moves from the fixed red-neon to the accent-derived role. Coherent under any accent; red look unchanged."). Default red Chip rendering must stay visually identical.
- S5: Issue acceptance criteria verbatim: "`selectedTone="outline"` reproduces the brand border plus chip-active sheen over surface-1 with the edge shadow, using semantic roles that follow the runtime accent." (now `variant="outline"`) / "The default rendering does not change." / "Contrast and focus remain WCAG-compliant in both tones." / "Stories and tests cover both tones."
- S6: Owner instruction verbatim: "en cada entrega enséñame storybook para verificar" — stories `Outline`, `OutlineFullWidth`, `OutlineCustomAccent` (Tabs) and a custom-accent Chip check; the parent shows Storybook before the PR.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S5 | worker | this commit |
| T2 | S5–S6 | parent | measurement, generated artifacts, checks, Storybook, PR |

## Log

- L1: Plan (explorer, 2026-11-18): helper-only token change; Tabs outline = segmented geometry + `data-[state=active]:border-state-selected` + `[background:var(--gradient-chip-active),var(--color-surface-1)]` + `shadow-[var(--shadow-edge-strong)]`, no `before:` overlay or `bg-state-selected-surface`; `useTabs.ts:49,60` conditions extended to outline; compounds for fullWidth/labelWrap/count; registry: reuse `visual-treatment → variant`, update usage type string, rehash tabs/types.ts revisions; catalog_data.py:52 description. Risk found: Chip shares `--gradient-chip-active` (`chip/types.ts:122`) with a fixed `border-primitive-red-neon/60` border.
- L2 (owner, verbatim choice): "Chip follows the accent too (Recommended)".
- L3: T1 done by worker (RED tokens 29 failed, Tabs 7, Chip 2 → GREEN; underline/segmented byte-identical hash test). Parent: registry revisions rehashed (tabs 10, chip 7) and `TabsVariant` usage type updated; catalog description + `docs/CATALOGO.md`; props docs; tokens, build, artifact, system.md; package-consumption/package-exports Chip selector pins moved to `border-state-selected/60`. Checks: Vitest 3180/3180, tokens 70/0, package-consumption, package-exports 137/0, system 36/0, props 130/0, typecheck, biome on changed files. Chrome: outline default border rgb(255,0,54) + gradient 24/9% red over surface-1, weight 600; custom accent #3b82f6 → border and gradient rgb(114,165,249); nested default host stays red. Open: Chip glow `--shadow-glow-base` stays red under custom accents (not in the accent map).
- L4 (owner, verbatim): "el accent de chip no puede ser rojo, debe de poder adaptarse al custom color". Fix at the token: `--shadow-glow-base` and `--shadow-glow-active` added to both accent maps (default byte-identical to theme.css:365,367; custom `rgba(base, 0.15)` / `rgba(base, 0.3)`); also recolors Button, IconButton, Textarea, Stat and SelectTile glows under custom accents. `--shadow-glow-intense`/`--shadow-glow-hot` stay fixed (Show-register brand effects). TDD: RED 29 failed → GREEN tokens 69/69. Chrome (atoms-chip--custom-accent): custom border oklab blue/0.6 + glow rgba(114,165,249,0.15); default glow rgba(255,0,54,0.15). Checks: Vitest 3181/3181, tokens 70/0, package-consumption, package-exports 137/0, system 36/0, props 130/0, typecheck, biome.
