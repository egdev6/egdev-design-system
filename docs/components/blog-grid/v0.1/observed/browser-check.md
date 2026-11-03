# BlogGrid v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-d-blog-grid`), dark theme, DPR 1.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.

## Boundary and tracks (BG-03)

| Story | 1079 | 1080 | 1081 | 1280 |
|---|---|---|---|---|
| Default, EmptyRows, WithoutArchive, LongContent, Narrow | 1 track | 1 track | 2 tracks, 602.58px / 430.42px | 2 tracks, 718.66px / 513.33px |
| HostComposition (inside SectionShell) | 1 track, 960px | 1 track | 2 tracks, 550.66px / 393.33px | 2 tracks, 550.66px / 393.33px |

The tracks keep the 7:5 ratio (602.58 / 430.42 = 1.40). The inclusive `[@media(width<=1080px)]:` boundary holds at 1080 and releases at 1081. No horizontal overflow and no nested anchors in any story or width. **Not measured:** fractional viewport widths.

## Stretch and empty rows (BG-03)

- **Wide, with archive (Default, 1081px):** the feature card fills its cell (384.5px). The list takes the remaining column height (359.1px) and its three rows share it equally (113.3px each). The archive sits below the list, and its bottom aligns with the feature bottom.
- **Wide, without archive:** the list matches the feature height (384.5px), with rows at 121.8px each.
- **LongContent:** the content grows the layout without clipping.
- **EmptyRows:** no list is rendered. The grid height equals the feature height (wide) and adds no phantom gap (stacked).

## Deviation found and fixed: stacked gap

The approved root recipe uses `gap-y-0`, which the wide layout needs because the archive has its own `mt-2`. With no stacked override, the first Chromium pass showed the feature touching the first row at ≤1080px (feature bottom 278.3px, list top 278.3px, at 390px).

The spec takes its layout from the legacy rule (`gap: var(--space-5)`), so the fix adds `[@media(width<=1080px)]:gap-y-5`:

- **Test-first:** a failing test came first, then the fix made it pass. The package CSS test scans every CVA class, so it covers the new utility.
- **Stacked:** row gap 16px. Feature ends at 278.3px, the list starts at 294.3px, and the archive follows with its `mt-2`.
- **Wide:** row gap stays 0px.

This is the only utility added to the plan's root list.

## Paint, links and keyboard (BG-04, BG-05)

| Check | Result |
|---|---|
| Root paint | Background transparent, no image, no shadow, transition `all 0s` |
| Archive link "All articles" | Delivered `Link` ink `rgb(255, 0, 54)` on `rgb(20, 21, 24)`: 4.61:1 |
| Tab order | feature → three rows → archive, each with `:focus-visible` |

## Not evaluated

Screen-reader output, native browser zoom, the computed cascade on a separate legacy-only `.eg-blog-grid` fixture, and pixel comparison with the source web.
