# First UI wave — native Docgen scope approval

- **Status:** owner-approved bounded integration amendment; not a runtime or review verdict.
- **Canonical identity:** sha256:625f9e0cf76d88e70a1680fd5db575cd6e437121c1932e1260286c446090ca26
- **Hash rule:** SHA-256 from the actual whole-line heading `## Accepted scope` through EOF, including final LF; tracking metadata above is excluded.

## Accepted scope

The owner explicitly selected the questionnaire option authorizing the exact native whitelist edits and this separate record. The alternative to leave the metadata gate pending was not selected. This extends the first-wave integration scope; it does not replace or rewrite the frozen first-wave approval or Collapsible's native relationship amendment.

### Authorized paths and ownership

The parent may append only the entries below to `.storybook/main.ts` in the existing `indicator`, `panel` and `collapsible` sibling worktrees, respectively. All three share baseline `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`.

The parent may create this separate record at `docs/components/remaining-components/v0.1/ui-native-docgen-scope-approval.md` in the Indicator worktree and run the already-authorized metadata and functional checks afterward. Workers do not own these integration edits.

### Exact documented native rows

The common set is `id`, `title`, `dir`, `aria-describedby`, `className`, in that order.

| Worktree | New entry | Exact rows |
| --- | --- | --- |
| indicator | indicator | Common, then onClick, onKeyDown, onFocus, onBlur |
| panel | panel | Common |
| panel | panelHeader | Common |
| panel | panelBody | Common |
| panel | panelFooter | Common |
| collapsible | collapsible | Common |
| collapsible | collapsibleTrigger | Common, then onClick, onKeyDown, onFocus, onBlur, aria-label, aria-labelledby |
| collapsible | collapsibleContent | title, dir, aria-describedby, className, role, aria-label, aria-labelledby; no id |

These rows expose only already-supported native properties. Preserve every existing entry and its values. Do not change the propFilter logic, parser settings, public API, runtime semantics, tokens or dependencies. No Git delivery is authorized.

### Evidence and limits at approval

The parent-owned real-parser probe (job77) exited 1: expected native id rows were absent for Indicator, Panel and its three parts, Collapsible and Trigger; Content lacked its expected aria-describedby row. Own rows were present. The original exact plan ledgers did not list `.storybook/main.ts`; the parent stopped for this fresh grant rather than silently widening them.

Parent focused runtime/regression reruns (job76) had already exited 0: Indicator/Avatar/Badge 103 tests, Panel/Surface/Popover/ModuleCard 89 tests, and Collapsible/Button/Surface 59 tests. Those groups overlap in regressions and are not a unique aggregate count or full-workspace result.

This approval does not claim the whitelist fix has passed, actual Controls work, emitted CSS is correct, packed React consumers pass, browser/AT checks pass, or any component is complete. Preserve the failed probe and record subsequent validation separately. Prior contracts, plans, static captures, adoption identities and owner approvals remain unchanged.
