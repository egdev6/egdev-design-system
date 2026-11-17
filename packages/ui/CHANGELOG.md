# Changelog — `@egdev/ui`

All notable changes to this package are documented here, newest first. Versions follow the
[0.x policy](../../docs/distribution/versioning.md) of this repository, and every version ships as
a local tarball from `pnpm release:pack`.

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
