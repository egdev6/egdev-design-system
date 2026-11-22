# App-side enforcement of the consumer requests flow (#530)

Consumer apps must carry out the consumer requests flow (#522) on their own: the only way past a DS component's API is a guard allowlist entry, and an entry requires a DS issue. Issue #530 lists eight work units; this document tracks them. Branch per unit.

## Specs

- S1: Owner request, verbatim: "la idea es no tener que hacer revisión desde el design system si no que las apps sean capaces de realizar el flujo correctamente. como lo hacemos?"
- S2: Owner approval, verbatim: "si" (to opening #530 with the three layers as tasks) and "empezamos" (to starting with the first guard unit).
- S3 (T1, agent design choices, open to owner review): new doctor check **DS046** (error), "an app class on a DS component changes its appearance or layout".
  - **Where a class counts:** in non-test `.tsx` files under `sourceDirectory`, a JSX element whose tag is a component imported from `@egdev/ui` (named import, aliased import, or `Namespace.Component` from a namespace import). Collect only static class names from its `className`: string literals, the static parts of template literals, and string-literal arguments of any call expression (`cn(...)`, `clsx(...)`). Dynamic values are ignored.
  - **Which CSS counts:** `.css` files under `sourceDirectory`, outside `themeDirectory` (the theme folder stays the sanctioned override place, as for DS041). A rule matches when one of the collected classes appears in the selector's **last compound** (the element the rule styles). Classes in earlier compounds (structural selectors such as `.x > footer`) belong to T2, not here.
  - **Allowed properties (placement only):** custom properties (`--*`), `margin` and `margin-*`, `align-self`, `justify-self`, `place-self`, `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `order`, `grid-area`, `grid-column*` and `grid-row*`. Any other declaration in a matching rule is a DS046 finding. This is a list of what is permitted, not of what is forbidden.
  - **Finding:** one per rule, naming the selector, the component, the first offending properties and the fix: `DS046 error src/styles.css:38: .compact-note__title on ListItemTitle sets font-size, font-weight: use the component API or add an allowlist entry with an issue.`
  - **Allowlist:** reuse the existing entry shape: `file` is the CSS file and `pattern` is the rule's selector, as for DS041. Stale-entry, issue-format and DS043 pending rules apply unchanged.
  - Out of scope for T1: Tailwind utility classes in `className`, inline `style`, structural selectors (T2), DS internals in code (T3) and hand-written values (T4).
- S5 (T1, owner choice verbatim): "Permitirlos solo con valor 0 (Recomendado)" ("Son ajuste de ítem flex/grid (dejar encoger), no apariencia. Cualquier otro valor de min-width/min-height, y width/max-width, siguen siendo DS046. Recado y Nexo pierden 2 falsos positivos."). `min-width` and `min-height` are placement when their value is zero (`0`, or `0` with a unit such as `0px`); any other value stays a finding.
- S4: Same CLI rules as the rest of `egdev-ds`: Node stdlib plus the project's own `typescript` and `postcss` (as the guard already resolves them), never run git, stable exit codes and `--json`, no `\s*X\s*` regexes on untrusted strings. Doctor codes are never reused.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S3, S4, S5 | worker | done: 4bf4c02 + verification amendments (next commit) |
| T2–T8 | #530 | — | not started; each needs owner approval |

## Log

- L1 (owner, verbatim): S1.
- L2: Agent proposed three layers (guard enforcement, AGENTS.md block, MCP tooling); owner "si" → issue #530, linked from #491.
- L3 (owner, verbatim): "empezamos" → T1 on branch feat/guard-ds046-app-class-overrides. Design choices in S3 are the agent's, recorded for review.
- L4: T1 first pass by worker: RED 9 → GREEN test:cli 173/173. Parent ran the new doctor on clean copies of the consumers' origin/main: Recado 7cd65e1 → exactly the six audited className overrides (ListItemTitle/Meta typography, IconButton size, DialogContent width) plus `min-width: 0` on ListItemContent; egdev-website b009d8e → none; Nexo 2e74b33 → nine real overrides (Tabs padding, SelectTile grid-template-columns, Button width, Icon transform, Text white-space/overflow-wrap, …) plus `min-width: 0` on Field.
- L5 (owner choice): S5.
- L6: S5 by worker: RED 4 → GREEN test:cli 177/177; typecheck and biome green. Re-run on the consumers: Recado 5 DS046, egdev-website 0, Nexo 8 (the two `min-width: 0` findings are gone).
- L7: Independent verify (Risk: item 3) PASS for S3, S4, S5 and the risk: DS040–DS045 byte-identical to base on 19 fixtures × 3 flag sets; all 13 consumer findings true positives (no Button full-width, Text wrap, Tabs padding, Icon rotate, SelectTile columns or ListItem truncate API); ~+90 ms on Nexo. Advisories adopted: string literals anywhere in a className expression count (conditionals, &&/||/??, arrays, object keys), closing the `cn(on && 'x')` dodge; zero minimums only with real CSS length units. Worker: RED 3 → GREEN test:cli 181/181. Consumers unchanged: Recado 5, egdev-website 0, Nexo 8.
