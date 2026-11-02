# Chip v0.2 — browser check

Recorded 2026-11-02 by the parent session against the adopted v0.2 captures (`docs/components/chip/v0.2/`). Chromium headless shell 1243, Storybook dev server from the implementation worktree, viewport 1280×900, dark theme.

| Story | Element, height | Rest → hover border | Accessibility tree |
|---|---|---|---|
| Default | `button` 26px | hairline → hairline strong | `button "Design"` |
| Pressed | `button` 26px ×3 | on: brand border, unchanged on hover | `button "Design" [pressed]` |
| Static | `span` 26px ×3 | no hover change, `cursor: auto`, not tabbable | plain text |
| StaticInList | `span` 26px ×3 | no hover change | `list "Topics"` with three list items |
| Link | `a` 26px ×2 | hairline → hairline strong | `link "Topics"` with `/url` |
| ExternalLink | `a` 26px ×2, `target="_blank"`, `rel="noopener noreferrer"` | hairline → hairline strong | `link "Documentation (opens in a new tab)"`, custom notice `link "Examples (new window)"` |

No underline in any mode.

**Defect found and fixed during this check:** static and link chips first measured 37px against 26px for the toggle. The `button` gets `box-sizing: border-box` from the user-agent stylesheet, while `span` and `a` stay `content-box` (the system loads no global reset), so padding and border were added on top of `min-h-8`. The base recipe now carries `box-border`, the fix already used by ModuleRail, and a test pins it for every mode.

Not evaluated: screen reader session and pixel-level comparison.
