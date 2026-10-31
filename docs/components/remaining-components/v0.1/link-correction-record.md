# Link correction record — sibling-worktree paths

Owner decision (2026-10-31): correct every Markdown link that pointed outside the repository through a sibling worktree path (`../../../../../indicator|panel|collapsible/...`), and re-pin the affected index bindings.

Only link targets changed: each rewritten link now points to the same file inside this repository. No wording, decision, scope or approval changed. Approvals recorded against the previous canonical hashes remain valid for the corrected bytes listed below; older documents that cite a previous hash are left untouched as historical statements and resolve through this table.

## Rewritten files

| File | Links rewritten |
|---|---|
| `docs/components/collapsible/v0.3/owner-approval.md` | 1 |
| `docs/components/isotipo3d/v0.4/dependency-build-plan.md` | 2 |
| `docs/components/isotipo3d/v0.4/implementation-plan.md` | 2 |
| `docs/components/remaining-components/v0.1/approval-decision-index.md` | 33 |
| `docs/components/remaining-components/v0.1/effects-compatibility-disposition.md` | 1 |
| `docs/components/remaining-components/v0.1/effects-compatibility-owner-decision.md` | 1 |
| `docs/components/remaining-components/v0.1/effects-integration-plan.md` | 3 |
| `docs/components/remaining-components/v0.1/ui-first-wave-owner-approvals.md` | 10 |

## Re-pinned bindings

| Binding | File | Hash kind | Previous SHA-256 | Corrected SHA-256 |
|---|---|---|---|---|
| UI-O | `docs/components/remaining-components/v0.1/ui-first-wave-owner-approvals.md` | C: `## Approved scopes` | `bbc9ec9834515877bd416af040179b0e5916d75ca0d699fbad35a292b73eceb7` | `0634a27670d7fc00c1d66257c64c5dbe3fc5c892f04ad453dfe597403837070c` |
| FX-P | `docs/components/remaining-components/v0.1/effects-integration-plan.md` | C: `## 1. Decisions and authority` | `bae5b2351b711927b89f8dd5b60de637fa52e1a7b9a981ef0607c3fc522aa3ad` | `d95b7d360d46f0efa27c10c750525ade476220cbfcb4be9d57ee985f721d6729` |
| FX-D | `docs/components/remaining-components/v0.1/effects-compatibility-disposition.md` | C: `## Compatibility disposition proposal` | `77a76a5ecc5157b5811baa97ed09bf3d89a5bb0bb796c346bc9b8a8e8f832133` | `655b7b895ba62e2b2b044e505fd2d145a587d61b613c5fe116dab5a42555f773` |
| FX-A | `docs/components/remaining-components/v0.1/effects-compatibility-owner-decision.md` | C: `## Accepted disposition` | `ac15f886844e2e11581c7024f09db1d202dc751f9ec225d79da824708304353a` | `7aababf3b009e2ffd05383ed895852fc6360f4d9f31a9e811743cb1fea36b1ca` |
| ISO-P | `docs/components/isotipo3d/v0.4/implementation-plan.md` | C: `## 1. Plan gate and scope` | `a0b2e146df64848ef66681f8f4675d29273700d9dbafc6e837f8d47804625f02` | `a5b46aec4f6a56ca92570da39d680badebb7b99e5b5829a2deeccab61d2e51ad` |

`docs/components/collapsible/v0.3/owner-approval.md` has no binding in the decision index; its link was rewritten the same way and its whole-file SHA-256 changed from `f0dd426a384a9979009d414428bc257fd6e9c169f567d64bda3561a46cca6ef8` to `f8fb5132bb4672dc6ca970f69098694978b570ca33e4780111975b33b50bf3cb`.
