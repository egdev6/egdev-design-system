# Panel v0.5 and Tabs v0.5 fill — joint implementation and verification record

- **Amendments:**
  - [Panel v0.5](fill-amendment.md): `contentSHA256: a7842866492a1553616c56a5bccc159ce726812a34a72b610d5b9888a7267a4b`.
  - [Tabs v0.5](../../tabs/v0.5/fill-amendment.md): `contentSHA256: f9c81882cd9ad0fc990bcb65e756016cb564f64ff3b28e1a34c73e790fce8bb6`.
  - Both approved 2026-11-19 ("Acepto todas").
- **Plans:**
  - [Panel](implementation-plan.md) and [Tabs](../../tabs/v0.5/implementation-plan.md).
  - Approved 2026-11-20 ("Apruebo con las recomendaciones").
  - This is the single joint record (OQ6).
- **Issues:** #499 (Panel) and #500 (Tabs), requested by Recado. Branch `feat/panel-tabs-fill`. Task log: `odd/tasks/panel-tabs-fill-build.md`.
- **Captures:** implementation captures, recorded as Proposed references (OQ4). Visual conformity is **Not evaluated**.

## Commits

| Unit | Commit | Content |
| --- | --- | --- |
| 1 | `a6acf3f` | Panel `fill` through `PanelContext`: root `h-full min-h-0`, Header/Footer `shrink-0`, Body `min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]` with `has-[>[data-fill]]:[scrollbar-gutter:auto]`. Default fingerprints are captured from the base commit. |
| 2 | `9df0d98` | Tabs `fill`: root `h-full min-h-0`, list/scroll area `shrink-0`, active panel scroller with an inset focus ring. `data-fill` comes only from the component, and a consumer value is dropped when `fill` is off (OQ-T2). |
| 3 | `ce0d4bf` | FillHost stories (Panel, Tabs), the nested FillWithTabs story, controls/docgen/CSS rows, and package-consumption typed samples with fill and `:has` CSS assertions |
| 4 | `aafa53c` | `host-fill` convention with approval record `docs/decisions/prop-naming-panel-tabs-fill-approval.json`, 13 usage revisions refreshed, regenerated system artifact |
| 5 | this commit | Longer story content so both fill stories really overflow; this record and the captures |

## Automated checks (observed)

| Check | Result |
| --- | --- |
| Panel unit 1, RED → GREEN | 13 failed / 57 passed → 70/70; ModuleCard green |
| Tabs unit 2, RED → GREEN | 14 failed / 74 passed → 88/88; v0.3 fingerprint test untouched |
| Consumer `data-fill` drop (OQ-T2) | RED observed, then GREEN |
| Panel, Tabs, ModuleCard, controls, docgen, tabs-css | 601/601 |
| `pnpm typecheck`, `pnpm build`, Biome on changed files | Clean |
| `props:check`, `test:props`, `test:artifact`, system tests | Valid; 130/130; 34/34; 31/31 |
| `test:package-exports`, `test:package-consumption` | 137/137; 14/14 |

## Real browser (Chrome 157, Windows classic scrollbars, Playwright; host 440 × 640)

| Check | Observation | Result |
| --- | --- | --- |
| Panel fill (`FillHost`) | Panel matches the 640 px host. The Body scrolls (scrollTop 200) while the Header and Footer stay put. The Body's 15 px scrollbar sits in a stable gutter | Pass |
| PanelBody keyboard (D-P1) | The first Tab focuses the Body, a native keyboard-focusable scroller, and shows the inset ring (2 px inset `focus-ring` box-shadow). PageDown scrolls it to 424 | Pass |
| Tabs fill (`FillHost`) | The active panel is limited to 606 px (640 minus the list) and scrolls. The tab list stays fixed | Pass |
| Tabs panel keyboard and ring (D-T1) | Tab from the selected tab focuses the panel. The outline is solid at offset −1.6 px (inset). PageDown scrolls it to 530 | Pass |
| Nested Panel + Tabs (`FillWithTabs`, D-G) | Only the tab panel scrolls (scrollTop 300). The Body does not overflow, computes `scrollbar-gutter: auto` and shows no scrollbar (0 px), while the panel shows one 15 px gutter. The list stays fixed | Pass |

Found and fixed during verification: the Tabs FillHost and FillWithTabs stories did not overflow at 440 px (14 and 12 one-line entries). Both now use 40 entries.

Observation for the owner, not a defect of this change: on the dark theme the classic native scrollbar renders light, because the document does not declare `color-scheme: dark`. Fixing that belongs to the theme base and needs owner confirmation.

## Captures (Proposed references)

Conditions: Chrome 157 on Windows, Playwright viewport 520 × 720, device scale 1, dark theme, classic scrollbars, 2026-11-20.

| Visual ID | File | Scenario | sha256 (prefix) |
| --- | --- | --- | --- |
| Panel VIS-01 | [vis-01-panel-fill.png](vis-01-panel-fill.png) | Panel FillHost with the Body scrolled | `25c75e7ee94ec814` |
| Panel VIS-02 | [vis-02-panel-tabs-nested.png](vis-02-panel-tabs-nested.png) | Nested fill Tabs inside a fill Panel: single gutter | `0199219f5586db21` |
| Tabs VIS-01 | [../../tabs/v0.5/vis-01-tabs-fill.png](../../tabs/v0.5/vis-01-tabs-fill.png) | Tabs FillHost with the panel scrolled | `ed0227ceb3d2eb03` |

## Consumer responsibility found after release (#507)

Recado reported this from its WebView2 window. In `<Tabs fill>` the active panel is the scroll container and has no inline padding, so a control that starts at the panel edge (for example a Textarea) has its focus ring clipped. The ring is clipped left and right, and at the top or bottom at the ends of the scroll range.

Owner decision (2026-11-20): this is the consumer's to fix. Tabs content is consumer-owned ("Panel spacing only: consumers own content surfaces"), and a forced DS padding would double the inset for content that already has its own. Content inside a fill Tabs panel keeps its own token inset (for example a wrapper with `p-1` / `var(--space-1)`) so descendant focus rings stay visible. The Tabs FillHost story documents it. Panel `fill` is unaffected, because PanelBody keeps its `p-4`.

## Not evaluated

- Firefox, Safari and WebView2. Keyboard-focusable scrollers in Safari are the D-P1 risk; Recado's WebView2 is Chromium.
- Overlay-scrollbar platforms, real screen readers, forced colors.
- Owner review of the `host-fill` whenToUse/avoid wording in the registry, which the implementer wrote from the amendment's meaning.
