# Collapsible v0.3 — proposed Radix relationship amendment

- **Status:** Proposed only; owner acceptance and runtime resumption Pending. This docs assignment neither selects acceptance nor resumes prior runtime authority.
- **Canonical identity:** `contentSHA256: sha256:4f06cbf29245dfa4cd9677f3975b8ccf11a436613bfe7d5271a2988bb3ba60aa`; SHA-256 of UTF-8 LF bytes from the actual whole-line heading `## Scope and frozen bases` through EOF, including final LF; exclude this tracking header and its inline heading mention.
- **Recovery:** [frozen v0.2 spec](../v0.2/spec.md), [frozen v0.2 plan](../v0.2/implementation-plan.md), canonical issue [#181](https://github.com/egdev6/egdev-design-system/issues/181). Prior approval remains scoped to those bases, not this new delta. No receipt/native verdict is created.

## Scope and frozen bases

Original approved canonical identities stay **unchanged**: spec `b3d9f158d45661b151dbff249b645ab6f97b036e872d187eb6f4be39d35b2017`, plan `136dc06ca4e2bdc55cdd31ab07a023aaa13443642bde467541eefcbf271df42f`. Preserve original files, headers and historical captures; do not rewrite/re-hash the bases to pretend the delta was previously approved. Only fresh owner acceptance makes effective contract/plan **frozen base + this accepted amendment**, with both identities recoverable. Derived replacement materializations, if computed, are not approvals or new runtime source evidence.

**Only changed promise:** native Trigger aria-controls exists only while open and equals the native Content id; closed Trigger omits aria-controls. Native aria-expanded remains false/true in closed/open states. Closed Content shell/id stays mounted and hidden with children unmounted; reopening restores its relationship and children. No complete Content-shell removal is promised. No forceMount, custom state/id/relationship override or second engine. Unsupported untyped relationship overrides remain filtered under the approved contract.

No dependency/version, public API, layout/Material/visual recipe, disabled/presence policy, callback/cancellation semantics, focus/restoration policy, file surface or stylesheet change. The four adopted static PNG scopes/conditions stay unchanged; no recapture is required for this ARIA delta. Static closed-state illustration attributes are not runtime relationship assertions. No browser/AT approval or runtime conformity result follows.

## Installed source evidence — read, not executed

| Exact installed path (relative to this worktree) | Whole-file SHA-256 |
| --- | --- |
| `packages/ui/node_modules/@radix-ui/react-collapsible/dist/index.mjs` | `0915ed5caf62ed46cfa341eaa079bf2925fc565ab40942f0868f9c14250fcf8b` |
| `packages/ui/node_modules/@radix-ui/react-collapsible/dist/index.d.ts` | `3e95d8c6ad460431c74aa8e18e24b773563bcc4fadd36f0bf323b109f530fca7` |

Installed package version is 1.2.1. Runtime Trigger assigns `"aria-controls": context.open ? context.contentId : void 0` and `"aria-expanded": context.open || false`. ContentImpl assigns `id: context.contentId`, `hidden: !isOpen` and `children: isOpen && children`; Presence uses a render-function child. Declarations expose native button/div parts and optional forceMount; this wrapper still forbids forceMount and owned-attribute overrides. Source inspection explains the contradiction; it is not an executed DOM test.

## Ordered exact replacement ledger

Apply **in memory only for review**, starting from the exact frozen bases. Each entry replaces its unique literal old string with new, in order; required original occurrence count is 1 for every entry. Targets are repository-relative. Do not persist materialized base files or replace historical identities. Stop if any base hash/count differs. Four spec replacements cover §4, §5 and affected AC-01/05; two plan replacements cover the corresponding default/closed-relationship checks. Other AC relationship wording is interpreted through those explicit state rules.

```json
[
  {
    "order": 1, "target": "docs/components/collapsible/v0.2/spec.md", "count": 1,
    "old": "Trigger aria-controls continues to identify that shell. On open, children mount in place.",
    "new": "Trigger aria-controls is absent while closed. While open it equals the native Content id; reopening restores that relationship and mounts children in place. Native aria-expanded remains false/true in closed/open states."
  },
  {
    "order": 2, "target": "docs/components/collapsible/v0.2/spec.md", "count": 1,
    "old": "Radix supplies aria-expanded, aria-controls, unique useId-based Content ids and data-state=open|closed;",
    "new": "Radix supplies aria-expanded in both states, aria-controls only while open (matching the native Content id), unique useId-based Content ids and data-state=open|closed;"
  },
  {
    "order": 3, "target": "docs/components/collapsible/v0.2/spec.md", "count": 1,
    "old": "Closed default, initially-open option, click/Enter/Space and coherent expanded/controls",
    "new": "Closed default and initially-open option; click/Enter/Space; native aria-expanded in both states, aria-controls absent closed and matching Content id open/reopen"
  },
  {
    "order": 4, "target": "docs/components/collapsible/v0.2/spec.md", "count": 1,
    "old": "Closed shell hidden, body children unmounted/remounted; local state reset documented",
    "new": "Closed shell/id retained and hidden, body children unmounted, Trigger aria-controls absent; open/reopen relationship and children restored; local state reset documented"
  },
  {
    "order": 5, "target": "docs/components/collapsible/v0.2/implementation-plan.md", "count": 1,
    "old": "Defaults; Enter/Space/click; exactly one next-value request;",
    "new": "Defaults with native aria-expanded in both states and open-only aria-controls; Enter/Space/click; exactly one next-value request;"
  },
  {
    "order": 6, "target": "docs/components/collapsible/v0.2/implementation-plan.md", "count": 1,
    "old": "Hidden shell id/controls at closed state;",
    "new": "Closed shell id retained/hidden, Trigger aria-controls absent; open/reopen aria-controls matches that id;"
  }
]
```

## Eventual real-Radix DOM checks — planned, not run

After acceptance and a fresh parent runtime resumption: assert default closed Trigger aria-expanded=false and no aria-controls; retained Content shell has non-empty native id/hidden=true and no body children. Activate real Trigger: aria-expanded=true, aria-controls equals that shell id, shell visible and children mounted. Close: aria-controls removed, expanded=false, same shell/id hidden and children unmounted. Reopen: relation restored to same mounted-instance id and children remounted. Initially-open/controlled cases use the same state rules; unsupported untyped aria-controls/id/hidden overrides cannot replace Radix ownership. Multiple/nested roots have distinct shell ids and each open Trigger controls only its own shell; closed peers omit the relationship independently. Preserve all prior keyboard/focus/disabled/callback/ref/type tests without mocking Radix.

## Self-check and pending human choices

Observed writer self-check only: original spec/plan canonical hashes and both installed source hashes/version matched; original occurrence counts and ordered application counts were each [1, 1, 1, 1, 1, 1]. Six replacements dry-ran in memory; all seven reconstructed spec blocks and ten AC rows survived, obsolete persistent-closed-controls wording was absent and original base bytes remained unchanged. Local links/LF/whitespace and final anchored amendment identity are checked separately. No base/materialized-file writes, source code, runtime RED/GREEN, tests/build/install/server/capture/Git/GitHub/registry/tracking operations or independent/native verdict. This proposed ledger is not an acceptance record.

Parent questionnaire options remain **Pending**: **Accept this exact amendment and resume the unchanged six-file runtime assignment under prior bounded permission**, or **park Collapsible runtime without accepting the delta**. Parent inspects this digest-bound proposal, obtains the actual owner decision and freshly resumes only after acceptance; persistence of this document grants neither choice.
