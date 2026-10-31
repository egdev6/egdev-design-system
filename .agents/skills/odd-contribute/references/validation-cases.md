# Contract readback cases

These cases specify expected assistant behavior, not automated GitHub enforcement.
Structural checks do not prove that every assistant or contributor follows the contract.

| Case | Expected behavior |
| --- | --- |
| Index #8 open but current revision or chain unconfirmed | Ask the maintainer; recommend nothing as ready. |
| Historical unit (#3–#7) or closed issue cited as ready | Treat as history; do not declare M3 or successors ready. |
| No ODD signal | Use the non-ODD contribution path; no fabricated priority. |
| Latest comment proposes new scope | Not approval; ask for maintainer acceptance. |
| Assignee or PR data incomplete | Treat as unknown, not free; paginate or ask. |
| Issue/PR has another assignee | Exclude from free work; warn and offer alternatives. |
| Assigned only to the contributor | Offer resume separately; do not re-add the assignee. |
| Unassigned issue covered by a draft or fork PR | Detect active work and coordinate; no duplicate implementation. |
| Browse, plan, study or review a PR | Do not assign or start implementation. |
| Explicit start, free and eligible | Verify login and state, add assignee, read back, then proceed. |
| Shared credential, bot or ambiguous identity | Ask; never default to the repository owner. |
| Permission error or timeout | Reconcile by reading; claim nothing and do not retry blindly. |
| Another assignee or PR appears during claim | Pause and coordinate; never remove others. |
| Independent lower-priority issue | Warn and allow the choice. |
| Scope or dependencies change before PR | Revalidate and seek an accepted revision. |
| Checks fail or PR still open | Report pending work; do not declare integration. |
| Authorized PR is opened | Assign and read back the PR and linked issue; do not merge. |
