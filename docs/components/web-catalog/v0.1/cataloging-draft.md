# Web catalog — cataloging draft v0.1

**Status: approved 2026-11-02 (see owner-approvals.md).** These are catalog decisions only: every component and variant still needs its own approved spec, then a separately approved implementation plan, before any code.

Tracking: `odd/tasks/web-catalog.md` (W1–W4, L1–L4). Source of truth, read-only and owner-granted: `/home/egdev/proyectos/egdev-website/egdev-foundation` — `reference-web/pulso-source.html`, `design-system/components/<Name>/README.md`, and `src/effects/pulso-director.js`.

## 1. Why this needs a policy change first

Today `docs/CATALOGACION.md` keeps out of the system anything that "only exists for the layout of a page" or "is used by one app with its domain data". That is why HomeTemplate, SectionShell and 25 other web pieces are cataloged with destino `web` and action `mover` (27 rows).

The owner's goal changes the premise: **the design system must be able to build new views of the web**. So the web stops being one app among others and becomes a first-class consumer of the system.

**Proposed amendment (to approve as a rule, before any row changes):**

1. **Web building blocks enter the system.** A web piece enters `@egdev/ui` when a new web view could reuse it. This applies even when only the web uses it, as long as it carries no domain data: content arrives through props or slots and never as built-in Pulso copy.
2. **Storytelling scenes enter as slot-based organisms.** Hero, ChapterBreak, LabStage and Closing are reusable scene shapes: copy, CTAs and the 3D/media slot are inputs. They do not run choreography; they only expose the anchors a template drives.
3. **Choreography lives in `@egdev/effects`.** Anything that drives Isotipo3D, AmbientBackground or the 3D/particle exclusion rule belongs to effects, as the owner chose (S2). `@egdev/ui` still never imports effects.
4. **Effects contracts are reinterpreted, not rewritten.** Isotipo3D v0.4 and AmbientBackground v0.4 exclude the director "because it belongs to HomeTemplate (web)". Their exclusion stays valid: the components themselves still don't choreograph. A new HomeTemplate contract owns it instead. This needs a short appended note on each, not an edit to the approved text.
5. **Domain data never enters.** Pulso copy, links, social networks, the zone table values and the experiment/stream data stay in the web app.

## 2. Already covered — reuse (25 of 54)

| Foundation | Design system |
|---|---|
| Avatar, Button, CommandPalette, Countdown, Divider, Icon, IconButton, Kbd, Link, Logo, PhotoFrame, ProgressBar, PullQuote, SearchTrigger, SectionHeader, SocialLinks | Same public name |
| AmbientBackground, Isotipo3D | Same name in `@egdev/effects` |
| Eyebrow, Title | `Text variant="eyebrow"`, `Heading` / `Text` display variants |
| Tag, StatusBadge | `Badge` (soft/solid, status tones) |
| LiveDot | `StatusDot state="live"` |
| MenuList | `Menu` (actions) + `NavList` (index) |
| UserMenu, ProjectsGrid | Recipes: no export, as already cataloged |

## 3. Variant gaps on existing components (no new component)

Each needs its own amendment spec on the existing component:

| Component | Gap seen in the web |
|---|---|
| Chip | Static and `href` topic chips; the DS Chip is pressable-only (Radix Toggle) |
| ListItem | A `row` editorial variant with a leading date or meta; covers **ArticleItem, NoteItem and StreamItem**, which would otherwise be three molecules |
| PhotoFrame | `ratio="auto"` and image `position` |
| IconButton | Round outline treatment used in social rows |
| Link | External `arrow-up-right` affordance |
| Isotipo3D | Named zone poses (hero/chapter/lab/outro) as inputs, without choreography |
| Countdown, ProgressBar | API deltas (deadline format, 0–1 progress); likely documentation, not new props — to confirm per spec |

## 4. New to the system (proposed)

| Level | Component | Package | Notes |
|---|---|---|---|
| atom | Pixel | ui | Isometric 8×12 marker (meter, index); its `clip-path` geometry needs a geometry/token decision |
| molecule | ProjectCard, NowCard, TerminalCard, TipCard, ArticleFeature, CommunityCard | ui | Card shapes on `Surface`; no domain defaults |
| organism | TopBar, SectionNav, Footer | ui | Site navigation chrome; scroll state (glass, active section, progress) comes from the host |
| organism | NotesBoard, BlogGrid, LiveBand, NowStrip | ui | Section bodies composed from the molecules above and existing parts |
| organism | Hero, ChapterBreak, LabStage, Closing | ui | Scene organisms with a media/3D slot (rule 2) |
| template | SectionShell | ui | Section frame with registers `pro/show/flood/deep/grafito` and fades |
| template | HomeTemplate | effects | Effect layers + zone choreography; the zone table becomes an input, not hardcoded Pulso values |

**Recipes, not exports** (documented compositions, like UserMenu): MobileMenu (Dialog sheet + NavList + SocialLinks), CommunityGrid, ProjectsGrid, TipsSlider (Carousel + TipCard; becomes an organism only if coverflow offsets are required).

## 5. Not cataloged

- **Cover:** a documentation cover graphic with no README and no catalog row. It is not UI.
- **Prototype scaffolding** in the reference page: `#toast`, `data-page` interception.
- **Dead hooks**: the director writes `[data-nav]` but the markup uses `data-page`; there is an unused live-signal pill and an unused count-up. These are bugs to report to the web, not components.

## 6. Open questions for the owner

1. **Approve the policy amendment (§1)** before any catalog row changes?
2. **Scene organisms (§4, rule 2):** include Hero, ChapterBreak, LabStage and Closing as reusable scenes, or keep them in the web as Pulso storytelling?
3. **Scroll reveal/wipe** (`data-reveal`, `data-wipe`, staggered on 9 of 12 zones): a small `@egdev/effects` utility, part of HomeTemplate, or left to the web?
4. **"About" and "Community" scenes** have no Foundation folder (they're composed inline from PhotoFrame + PullQuote + TerminalCard). Keep them as recipes?
5. **Delivery order:** this is roughly 20 new components plus 7 variant amendments, i.e. several waves. Proposed order: (a) policy + catalog rows; (b) variants on existing components; (c) molecules; (d) navigation and section organisms + SectionShell; (e) scenes; (f) HomeTemplate last, because it composes everything.

## 7. Evidence

- Page anatomy, frame vs received content, 12 zones, reusable vs storytelling: tracking L3.
- Component-by-component gap table with README line references: tracking L4.
- Current rows: `scripts/catalog_data.py` (27 `web` rows) and `docs/CATALOGO.md`.
- Exclusions to reinterpret: `docs/components/isotipo3d/v0.4/contract-recovery.md:14`, `docs/components/ambient-background/v0.4/contract-recovery.md:18`.
