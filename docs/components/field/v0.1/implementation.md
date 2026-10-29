# Field v0.1 implementation evidence

## Authority and scope

- Contract: [#84](https://github.com/egdev6/egdev-design-system/issues/84), v0.1, adopted by its owner full-contract approval comment. Canonical payload SHA-256: `8da041653613d30b20fbe54532467830d58ad79218592eb0bbbcc0ee151d4361`; frozen body SHA-256: `1149a80575145f91f02aa6a3fbb97403bfcf74dde9b7cfc1a9e6c63be57fa870`. Historical Draft/Pending headers do not supersede that approval. No later approved Field amendment was present when recovered.
- Separate implementation authorization: the parent explicitly delegated the complete approved contract under `odd/tasks/molecules-build.md`, T1, S1–S4. This records the parent task, not an independent or signed approval receipt. Branch `feat/84-field`; implementation resumed on `b232b10` after the prerequisite correction below merged.
- Prerequisite: Slider [#68 amendment A1](https://github.com/egdev6/egdev-design-system/issues/68), merged in `b232b10`, routes `aria-invalid` together with `aria-describedby` to the focusable thumb. Before that fix Field could not satisfy its Slider invalid semantics through Slot. Field changes no control atom.
- FieldMessage [#179](https://github.com/egdev6/egdev-design-system/issues/179) remains unapproved and is **not composed**. The catalogue now distinguishes implemented native messages from that future proposal.
- No dependency or token changes. Six meaningful files, **No stylesheet**, no extra internal module.

## Decisions applied

| Decisions | Implementation |
| --- | --- |
| D1 | Compose Label, not Form.Field: no Form.Root ancestor or validation engine. |
| D2 | Real `@radix-ui/react-slot` Root supplies only id, generated description ids and invalid flag. Child descriptions remain first and deduplicate through Slot; explicit child invalid props retain precedence, including explicit undefined. No custom merge engine or forced override. |
| D3 | Child id when supplied, otherwise `useId()`; separate generated message/counter ids. Root id remains independent. |
| D4–D6 | Child owns the control, size and leading icon. No Field `as`, `size` or `icon` prop. |
| D7–D9 | Error replaces hint in one native paragraph; over-limit counter changes tone only. No live region or submit focus management. |
| D10 | Required label remains mounted inside VisuallyHidden when hideLabel is true. |
| D11 | Stacked readout is an output associated with the control id; Slider retains its own matching accessible label. |
| D12 | Choice renders control before the Label row, with message in column two and coarse-pointer 44px minimum. Counter and readout are omitted in choice layout. |
| D13–D14 | No required marker or group API; required stays on the child, and groups need a fieldset/legend pattern. |
| D15–D16 | Label owns field/choice typography. Native p/span own hint/error/counter with the approved token-backed CVAs; no Text or FieldMessage dependency. |
| D17 | No Field ref; Slot preserves the child ref. |
| D18 | Static utilities live only in types.ts CVAs, composed per part with cn. No stylesheet or surface paint; controls retain their Material treatments. |

The stable root `eg-field` is retained. Legacy part markers and state classes are not emitted; legacy CSS/consumers are untouched. Root recipes set the old root layout properties explicitly. Field-owned label-row, message and counter each get the two disabled `group-has` variants; Label/readout descendants and Field root receive no extra opacity. The control owns its separate disabled presentation.

`className` merges last for outer grid placement, margins and width only. No public part-class props or arbitrary appearance override promise. Internal CVAs and useField stay private. Public exports are exactly `Field`, `FieldProps`, `FieldLayout` and `FieldCounter`.

## Integration and naming

- `compiled.css` scans `molecules/field/types.ts` additively. Storybook's existing recursive stories glob already includes molecules; no replacement glob is needed. Preview adds the Field story source, and the central native-prop allowlist gains Field's supported div rows.
- Stories: WithInput, WithHint, Invalid, Counter, WithSelect, WithTextarea, WithSlider, HiddenLabel, ChoiceCheckbox, ChoiceSwitch and Disabled under `Molecules/Field`. No manual argTypes or play functions.
- Seven already-approved conventions gain reviewed FieldProps usages: `accessible-name`, `field-hint`, `field-error`, `character-counter`, `value-readout`, `visually-hidden-label`, `label-layout`. Whole-file source SHA-256 for `packages/ui/src/molecules/field/types.ts`: `5bd6ba99dfd49dfcfe2273cd75bf631ae77448d44bcd33e9c36544ea399f14c0`. No convention/approval/alias/exception changes; generated naming view and post-receipt usage filters updated.
- Real docgen checks all eight own Field props, both FieldCounter members, requiredness, enum values, actual defaults and allowed native rows. Registered extraction/enhancer/inference checks require zero owned metadata diagnostics. Installed Storybook formats the enum default summary as `"stacked"`; parser metadata retains bare `stacked`. Neither changes defaults or supplies optional args.
- Exact barrel, runtime and declaration inventories include Field; internal recipes and hook remain excluded. Packed fixtures use real exported types, eight type negatives, separate SSR/client examples and CSS assertions without changing the existing App control counts. **Packed fixtures are prepared, not executed by this worker.**

## Acceptance evidence

| Criteria | Observed evidence | Remaining evidence |
| --- | --- | --- |
| AC-01–AC-02 | Real Input/Textarea/Select roles resolve label and hint; generated/consumer ids, unique instances, native attributes and label focus tested. | Browser accessibility tree not evaluated. |
| AC-03–AC-04, AC-12 | Error replacement/recovery, empty error, real Slot child-first deduplication with existing/duplicate/empty ids; absent/true compatibility and explicit conflicting invalid props tested. Real Slider role receives error description and aria-invalid after A1. | Screen-reader output not evaluated. |
| AC-05 | 0, 279, 280 and 294 against max 280; over state only beyond the limit, no invented error. | Pixel comparison not evaluated. |
| AC-06–AC-07 | Hidden label keeps accessible name and Radix hiding geometry; output links to control id and ends label row. | Browser layout not evaluated. |
| AC-08 | Real Checkbox/Switch label click toggles; control-first choice order, Label choice variant, message column, coarse-target utility and omitted stacked-only content tested. | Actual coarse-pointer hit area not evaluated. |
| AC-09–AC-10 | Part-specific disabled classes, no root/descendant double-opacity classes, disabled label focus behavior, retained public root/layout class and unchanged child classes tested. | Computed ancestor opacity not evaluated. |
| AC-11 | Build/export validation recorded below; built CSS and built SSR assertions added. | Full packed React 18/19 consumer matrix belongs to the parent. |

## Validation

Commands ran in the foreground, serialized and capped at MemoryMax=2G where applicable. No packed consumer, browser, Storybook server, watcher, installation, CI or terminal Git mutation was run.

- RED: after writing behavior tests, the first focused run failed resolving the not-yet-created `./index` module (0 tests collected). This is the observed new-API failure, not an assertion-level failure.
- Intermediate focused run: 27 passed, 2 failed because the test assumed clipPath instead of Radix's actual hiding geometry and jsdom lacked ResizeObserver. Corrected the assertion and added the same geometry-only observer stub used by Slider tests; no Radix interaction mock.
- GREEN: Field suite 29/29 passed. Additional compatibility, error recovery, counter boundaries, ref lifetime and malformed child tests provide triangulation.
- Metadata first run: 226 passed, one assertion expected the enum default without Storybook's display quotes. Corrected that expectation; rerun 227/227 passed.
- Lint initially reported formatting/import order in edited files only; corrected manually. Typecheck passed. Registry check passed; naming suite 87/87 passed.

| Exact command | Observed result |
| --- | --- |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/field --maxWorkers=2` | 29 passed. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=1` | 227 passed across two files. |
| `pnpm props:docs` | Generated view regenerated. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Generated both catalogue files; 110 rows. Bytecode disabled to avoid out-of-scope generated files. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck` | Passed root and workspace checks. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm props:check` | Registry valid; view current. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props` | 87 passed. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint` | Passed; 382 files checked. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm build` | Passed on the single run; UI JS/declarations and 252.42 kB CSS emitted, tokens rebuilt. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-exports` | 52 passed on the single run, including Field built SSR, emitted CSS, both exact public export inventories and 116 reachable declaration files. |

## Visual scope

Expected references are identified by #84: VIS-01 Field board (`80af435a468eecb6ffd17b1b7187d06dc9015bd9d0b8477d874493ff88498df6`), VIS-02 Dialog body (`d80802e8ffcb69dbcf383b508571f9573f9462fd9c385d86fab894398321e82d`), VIS-03 Slider readout specimen (`bfd416a007ad24b277f45e982cc6010dc9d35d7cf952745f16e641946ca3ff4b`). No reference was replaced or new screenshot captured. Approved differences remain 14px hint/counter typography and 44px choice rows on coarse pointers. Visual conformity: **Not evaluated**; the owner reviews Storybook on main.
