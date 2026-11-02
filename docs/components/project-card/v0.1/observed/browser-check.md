# ProjectCard v0.1 — browser verification

Parent checks: Chromium headless shell 1243, Storybook from the implementation worktree on port 6122, dark theme, 1280×900 for screenshots; 390×844 and 1280×844 for additional layout checks. Reference: adopted VIS-01 with the written contract and approved Material/type-scale differences taking precedence.

- Inspected `variants-1280-dark.png` and `sizes-1280-dark.png`: editorial order preserved, raised Material frame, featured brand edge and static halo, outline index, static Chip tags and recessed code well.
- Measured root `box-sizing: border-box`; md padding 19.2px, sm 9.6px. Heading h3 uses 19.2px at md and 16px at sm. Code remains present in both sizes.
- The Variants story's real index spans have 1px strokes: brand ink for featured, translucent brand ink for default. Some measurement rows with no index report the first decorative descendant instead; those are not index-stroke evidence.
- LongContent root: clientWidth = scrollWidth = 228px in both 390px and 1280px viewports. No card overflow in these cases.
- First Tab on WithLink reaches the supplied anchor; no root tab stop. No card animation under reduced motion.
- No page errors observed during the six-story measurement run.

## Defect and correction

The initial browser hover check failed: legacy `.eg-project-card:hover` translated the root upward by approximately 4px despite the new recipe having no hover classes. The legacy stylesheet remains unchanged. A focused regression assertion failed before adding `transform-none transition-none` to the new component recipe; all 18 component tests then passed. A fresh Chromium run confirmed identical root position, transform, shadow and cursor before/after hover (`transform: none`, `y: 16`, `cursor: auto`).

Initial measurement JSON/screenshots predate this hover reset; the static measurements remain applicable. Final hover/focus/narrow-width check evidence is job-180, exit 0. No screen-reader session or pixel-diff equivalence is claimed. Package and full-suite checks after the final recipe change are recorded separately.
