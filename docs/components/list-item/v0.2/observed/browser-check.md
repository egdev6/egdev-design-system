# ListItem v0.2 — browser check

Recorded 2026-11-02 by the parent session against the adopted VIS-03…VIS-05 captures (`docs/components/web-catalog/v0.1/layer-b-plan-approvals.md`). Chromium headless shell 1243, Storybook dev server from the implementation worktree, viewport 1024×768, dark theme.

| Story | Rows (element, height) | Notes |
|---|---|---|
| EditorialLinkRow | `a` 73px | Hover border hairline `rgba(255,255,255,0.08)` → brand `rgba(255,0,54,0.45)` |
| EditorialDatedList | 3 × `a` 73px | One horizontal row each: leading date left, title + meta middle, trailing right; no underline |
| EditorialDivided | 3 × `a` 72px | No surface or radius, one bottom hairline per row; no underline (matches VIS-05 layout) |
| EditorialSizes | `md` 73px, `sm` 68px | Title 16px → 12.8px at `sm` |
| EditorialHover | `a` 73px + `a` 72px | Interactive-only hover on linked rows |

All titles render as real `h3` headings and the leading stamps as `<time datetime>`.

**Defect found and fixed during this check:** the list stories first nested an anchor inside a `ListItem asChild` placed on the `<li>`, so the three-zone layout stayed on the `li` and every row stacked vertically (140px) with the browser's default link underline. The approved model makes the row element the anchor (`<li><ListItem asChild><a>…</a></ListItem></li>`); stories, the guideline text and the packed consumer sample were corrected and a composition guard test was added.

Not evaluated: screen reader session and pixel-level comparison. Allowed differences recorded in the spec (raised Material row instead of the web's alpha-glass card, token type steps) stand.
