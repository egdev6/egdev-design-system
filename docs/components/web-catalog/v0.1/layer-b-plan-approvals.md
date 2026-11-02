# Web catalog layer (b) — implementation plan approvals

Recorded 2026-11-02 from the owner's questionnaire answers (tracking: `odd/tasks/web-catalog.md`, L13).

| Decision | Owner answer | Scope |
|---|---|---|
| Implementation plans | "Aprobar los cinco (Recomendado)" | The five plans below, with every recommendation they list. Highlights: PhotoFrame hides the `ratio` Storybook control (`@control false` with a reason) once numeric ratios exist and `data-ratio` shows the effective numeric value; ListItem leaves meta/title order to the consumer (one order per family) and exposes `data-size`; Chip may restructure metadata only if docgen cannot resolve the props union; Link implements only the `underlined` treatment (no arrow glyph); IconButton changes only the outline hover border class and refreshes its registry revisions. Approved specs are not edited. |
| Visual references | "Adoptarlas (Recomendado)" | The captures recorded in each layer-(b) spec folder (with their SHA-256 in `capture.json`) are adopted as the visual reference for the browser comparison of the implementation. Differences each spec already accepts (×0.8 scale, Material recipes, token steps) stay allowed. |
| Prop-naming convention | "Aprobar render-mode (Recomendado)" | Approves the `render-mode` convention proposed by Chip v0.2 for the `mode` prop. It is registered with its own appended receipt during the Chip implementation slice; historical approvals are not rewritten. |

## Approved plans (whole-file SHA-256 at approval)

- `docs/components/chip/v0.2/implementation-plan.md` — `20b0ae308b5db80ec380968a9b534b182f3471374228656d81833b5d9d3fd074`
- `docs/components/list-item/v0.2/implementation-plan.md` — `76cb34f4c6c25a20bd222e47ae1195018628fa7d7a64627a5f5ec95ce8fbdadb`
- `docs/components/photo-frame/v0.4/implementation-plan.md` — `ec1e848a130737e52e528c9ab55022aaa1530f8ed9383e160afbe06e115c3b45`
- `docs/components/link/v0.3/implementation-plan.md` — `165e78a5c310b4aa409d44428bca5122a520b7f54a806470850b6623f33f262f`
- `docs/components/icon-button/v0.3/implementation-plan.md` — `2a1fcbd808b2ab4c6b23a275e524b623bebe3389f4253dd70a04c501e7bf0d1a`

These approvals authorize implementation of exactly these plans, test-first, with the full local gates and a browser check before each merge. No token value or dependency change is approved.
