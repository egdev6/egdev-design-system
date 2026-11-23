# Changelog — `@egdev/ui`

All notable changes to this package are documented here, newest first. Versions follow the
[0.x policy](../../docs/distribution/versioning.md) of this repository, and every version ships as
a local tarball from `pnpm release:pack`.

## Unreleased

### Added

- Sheets independently support `size='full'`, `titleOverflow='clamp'` and `actionsPlacement='header'`.
  Consumers provide a visible complete-title route usable by keyboard, pointer and touch, manageable actions,
  and clear hit targets and focus rings. In an insufficient host, clamp or header actions may make the overlay
  scroll and move top actions out of view; unchanged sheets keep their existing cap and footer. (#543)
- AlertDialog supports a ready portal `container` and derived or explicit `overlayScope`. Both
  AlertDialog and Dialog independently support a root `pending` lock for their owned dismissal controls.
  Consumers prevent the initiating close and duplicate starts synchronously, and provide progress,
  recovery and any accessible announcements; host-scoped paint remains document-modal. (#544)

## 0.9.0

### Added

- Icon includes the physical `arrow-left` glyph. Applications choose the appropriate direction in
  RTL; it does not mirror automatically. Audit exhaustive `IconName` switches and maps for the new
  member. (#537)

### Changed

- CollapsibleHeader actions use `gap-5` and the Trigger-to-actions row uses `gap-3`;
  PreviewFrame actions and the Sidebar footer also use `gap-5`. These visual spacing changes
  can widen or wrap content. Consumers must provide extra clearance for `sm` action neighbors
  and reserve target space from surrounding controls and clipping. (#550)

## 0.8.0

### Added

- Text supports opt-in single-line truncation with `truncate`. Full content remains in the DOM;
  consumers provide a bounded, shrinkable host and a visible route to the complete text. (#538)

### Fixed

- Standalone IconButton controls provide a centered 44.8px invisible target under default tokens,
  including `lg`, without changing their visible box. Hosts must reserve unobstructed, non-overlapping
  space with a one-token margin above adjacent target outsets. (#540)

### Changed

- IconButton press feedback no longer scales the visible control. Ghost and outline use a pressed
  surface tone and depth; focus remains on the visible box. This changes momentary feedback in consumers. (#540)
- SocialLinks uses at least `gap-5` for `md` and `gap-3` for `lg`; ListItemActions uses `gap-5`.
  These visible spacing changes can widen or wrap consumer layouts. `sm` neighbors need extra clearance. (#540)
- The invisible IconButton target extends past the visible box, so an IconButton flush against the edge of an
  `overflow: auto` or `overflow: hidden` container can create scrollbars or be clipped. Give it clearance or let the
  container overflow visibly. (#540)
- Carousel control spacing and AttachmentField thumbnail-strip spacing increase to `gap-3`;
  AttachmentField root spacing increases to `gap-4`. These visible layout changes protect adjacent targets. (#540)
- ButtonGroup suppresses extended IconButton targets in both variants to preserve compact layout.
  Tabs scroll buttons also suppress them; on touch-capable hybrids those controls can remain about 25.6px,
  while the list also supports dragging. (#540)

## 0.7.1

### Changed

- Published props types include `@classNameAllows` metadata for explicitly documented additional
  `className` CSS properties; runtime behavior and existing prose are unchanged. Refs #530

## 0.7.0

### Added

- AttachmentField accepts `resetKey?: string | number`. Its value at mount does nothing; each later
  change silently clears rejection messages and the hidden status text, without remounting, moving
  focus or changing the list. Bump it after a save, even when the list was already empty.

### Changed

- AttachmentField also empties its hidden status text when a parent externally resets or replaces
  the controlled `value`, so screen-reader users do not land on a stale announcement.

## 0.6.0

### Added

- PhotoFrame accepts `fit: 'cover' | 'contain'` and exports `PhotoFrameFit`. The default `cover`
  keeps existing output unchanged; `contain` shows the whole image inside the reserved frame.

### Fixed

- AttachmentField silently clears rejection messages when a parent externally resets or replaces
  its controlled `value`, without moving focus. An echo of the field's own request, or a filter back
  to the previous list, keeps the messages.

## 0.5.1

- No code changes. Repacked so the peer on `@egdev/tokens` is 0.6.1.

## 0.5.0

### Added

- **AttachmentField** molecule for image attachments: paste from a Textarea, drop or pick files,
  with type, size and count validation, removable thumbnails and screen-reader announcements.
  Works controlled or uncontrolled.
- Panel and Tabs accept `fill`: the component fills a definite-height host, keeps its chrome fixed
  and scrolls its content in a single native scroller with a stable gutter. A fill Tabs nested in
  a fill Panel does not add a second gutter.

### Changed

- **Behavior change:** Tabs no longer honors a consumer-supplied `data-fill` attribute; only the
  component sets it, from `fill`. Use the `fill` prop instead.

## 0.4.0

### Added

- Scrollable Tabs lists fade at edges with hidden content in supporting browsers. Fine-pointer scroll
  buttons page through overflowing lists, hide at the extremes, and remain inert under a hovering
  pointer until it leaves; touch devices do not show the buttons.

### Changed

- Focused tabs in overflowing underline lists now scroll away from the faded edges.
- **Compatibility:** scrollable Tabs lists have an internal scroll-area wrapper, so the tablist is
  no longer a direct child of `.eg-tabs`; selectors relying on that relationship must be updated.
- RTL Tabs require a Radix `DirectionProvider` ancestor; a bare `dir="rtl"` ancestor is not enough.

## 0.3.2

- No code changes. The tarball now ships this `CHANGELOG.md`, and `release:pack` records the release in `release.json` (commit, dirty flag, sha256), so `egdev-ds upgrade` can verify the set and show what changed.

## 0.3.1

### Changed

- **Link has a new default look**: it is underlined at rest in the link color, and hover removes
  the underline instead of changing the color; the arrow keeps its rightward motion. Underlining
  identifies links without relying on color alone. Apps that styled links around the previous
  borderless look should re-check them.

### Deprecated

- Link `variant="underlined"` now renders exactly like the default and is deprecated; it will be
  removed in a later major. Remove the prop when convenient.

## 0.3.0

### Added

- Tabs `variant="outline"`: a recessed well whose selected tab shows an accent border and the chip
  sheen over surface-1. It follows a runtime accent from `createAccentTheme` and supports
  `fullWidth` and `labelWrap` like the segmented variant.

### Changed

- Chip's pressed state follows the runtime accent: its border uses `--color-state-selected` and
  its sheen and glow recolor with `@egdev/tokens` 0.5.0. The default red rendering is unchanged.
- **ColorSwatchGroup has a new default look**, the circular accent picker used by Quorb and Nexo:
  38.4px circular swatches in a 44.8px target, visually hidden option labels (accessible names are
  kept), a hairline ring per swatch, a neutral surface gap plus `fg-default` ring for the selected
  swatch instead of the check mark, a distinct offset focus ring, and the custom color control as
  a spectrum circle with a plus badge in the same row. RadioGroup semantics, the custom color input
  and the `<output>` are unchanged. Apps that relied on the visible labels or the check should
  re-check their layouts.

### Fixed

- Dialog and AlertDialog headers align in every variant and both header layouts: the Dialog title's
  first line is centred on the dismiss icon, the description sits `--space-2` from the title, the
  description (inline) and status text share the title's last baseline, including multi-line
  titles, and the title and description no longer inherit browser heading and paragraph margins.
  This changes the **default AlertDialog** (stacked) rendering, where the description now sits
  closer to the title, and inline headers now keep a `--space-2` gap between the title and the
  status.

## 0.2.0

### Added

- `ColorSwatchGroup` molecule: preset swatches on Radix RadioGroup plus an optional native custom
  color input, controlled through `value` / `onValueChange`.
- `AppIcon` atom: square app identity with an image or initials.
- Dialog: `container` placement for portalled content, `compact` body padding, and
  `headerLayout` (`'inline'` default) to stack the title and description.
- AlertDialog: `headerLayout` (`'stacked'` default, its existing rendering; `'inline'` opt-in).
- Panel: opt-in `accentEdge="start"` decoration that follows a runtime accent and mirrors in RTL;
  compact Heading recipe for Panel band headers.
- Tabs `fullWidth` and `labelWrap`; Button `labelWrap`; Carousel full-width track; Field
  `choice-trailing` layout; PageHeader `leadingAction` and `lede`; SelectTile text-only variant;
  SectionHeader per-run `lang`; Text body recipes and `foreground` tones; Collapsible header
  actions, padding, presence and motion; Icon `download` and `external-link` glyphs.
- TopBar end slot, scroll glass and app-header finish; Sidebar and NavList adopt the Antena
  desktop navigation recipe.
- Declare the tested React peer range `^18.3.1 || ^19.3.0`.

### Changed

- Switch, Slider, RadioGroup, Tabs, Input and Link use the new semantic contrast roles from
  `@egdev/tokens` 0.4.0. Rendered colors are unchanged except the **segmented Tabs selected
  state**, which now has a red border and tint. Apps that restyled these defaults with scoped
  overrides should re-check them, preferably by overriding the role variables instead.
- Coarse-pointer (touch) targets now resolve to 44.8px instead of 35.2px for Field `choice` rows,
  Chip and ChipGroup, SearchTrigger (including compact width), Table sort and selection controls,
  and the Slider hit area. Fine-pointer sizes are unchanged; touch layouts may grow slightly.

### Fixed

- Carousel keeps its native listeners on the latest render and aligns slides with absolute,
  tolerant scrolling, so a controlled Carousel no longer jumps to the last slide in WebView2.
- The Switch thumb mirrors in right-to-left contexts.

## 0.1.0

- First versioned release of the component library: primitives, atoms, molecules, organisms and
  templates built on Radix UI, with the compiled `./styles.css` stylesheet.
