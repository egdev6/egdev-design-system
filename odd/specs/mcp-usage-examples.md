# MCP usage examples — documentation plan

- **Status:** Approved — 2026-11-16 (owner, in session; proposal egdev-ds-nexo-adoption-v1). Implementation plan requires separate approval.
- **Request:** [#419](https://github.com/egdev6/egdev-design-system/issues/419), as replaced by the owner's [revision comment](https://github.com/egdev6/egdev-design-system/issues/419#issuecomment-6923525607). `get_component` is already listed in `packages/mcp/README.md`; concrete request/response examples are missing.
- **Approval:** Owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1. Execution requires separate approval; this plan authorizes no MCP, artifact, dependency, GitHub or consumer changes.

## Objective and scope

Propose version-matched, copyable tool-call requests and accurate response examples in `packages/mcp/README.md` for the offline, read-only `@egdev/mcp` server over the installed `@egdev/system` artifact. Identify Node 24 and same-release package prerequisites; distinguish this server from Storybook MCP. Existing configuration guidance and callers stay intact.

The revised issue replaces the original body: no new tools, server/protocol behavior, UI APIs, consumer migration or new JSX/composition examples are assumed. Component-usage guidance from the superseded body can be considered separately if the owner requests it. Visual captures are not applicable to this documentation-only plan.

## Proposed examples

Add at least one request and corresponding success response for each existing tool; requests use the SDK `callTool` shape `{ name, arguments }` and values that exist in the matched artifact:

| Tool | Request coverage | Successful JSON value inside the MCP text content |
| --- | --- | --- |
| `get_component` | Required string `name` | `designSystem`, `component`, `catalog` (which may be null) |
| `list_components` | Optional string `package` / `level` filters | `designSystem`, `components`, `total` |
| `get_tokens` | Optional string `group` / `prefix` filters | `designSystem`, `tokens`, `total` |
| `get_material_recipe` | Optional string `id` | `designSystem`, `recipes` |
| `get_design_system_md` | Empty arguments object | `designSystem`, `systemMd` |

Show that success is an MCP `content` array containing a text item whose `text` is serialized JSON, not a top-level component or `structuredContent`. Include an unknown-component example with `isError: true` and plain text `Unknown component: absent`; it is not JSON. Obtain all values and version identity from a real matching artifact, never fabricate a live response. Long values such as `systemMd` may be clearly marked excerpts; do not present an excerpt as a complete copyable response.

## Keeping examples synchronized

- Derive or verify request fields against `packages/mcp/src/server.ts` and the server's `listTools` input schemas. Compare documented successful fields and error text against actual SDK `callTool` results over stdio using the matching installed artifact. Preserve and verify the full `designSystem` identity; do not silently normalize away version drift.
- Propose machine-readable, distinctly marked README request/response blocks and extend the existing MCP/packed checks to execute each documented request and compare every displayed response field, including parsed text JSON. For each success, record the SHA-256 of the exact UTF-8 bytes in the complete `content[0].text` and compare it with the live response, including when the display is an explicitly marked excerpt; also compare each displayed field/substring and check the complete response against its artifact or `system.md` golden. Check the envelope separately. A schema, value or version change must fail the documentation check until the example is reviewed and updated.
- `scripts/mcp-packed.test.mjs` currently parses every `json` fence and asserts exactly two matching configuration blocks. Update its selection to isolate those two configs while still validating both, so additional example fences neither break nor weaken the existing configuration check. This is planned future work, not a change made by this plan.

## Acceptance criteria

| ID | Observable outcome | Planned evidence |
| --- | --- | --- |
| AC-01 | README correctly explains the existing offline server and supplies valid requests and version-matched response examples for the five listed tools. | Compare examples with `listTools`, real stdio responses and installed artifact; inspect README. |
| AC-02 | `get_component` success and the unknown-name error show the real MCP envelope and distinct JSON-text versus plain-error-text behavior. | Execute both examples via SDK; assert names, `content`, `isError` and exact error text. |
| AC-03 | Examples cannot silently go stale, including examples marked as excerpts; both existing client configurations remain checked. | Automated README example comparison plus packed configuration and golden-output checks. |
| AC-04 | Current tools, callers and artifact behavior are unchanged; no new tool or UI capability is claimed. | Existing MCP and packed-consumer regression suites. |

All evidence is Pending; this approved plan is not an implementation or a claim that these checks ran.

## Visual reference

Not applicable: this is a documentation-only MCP plan, not a component implementation. The stories-and-real-capture requirement applies to the seven component implementation PRs.

## Resolved decisions

- “Sí, validación visual en cada PR” — component specs are approved without captures; each of the seven component implementation PRs must provide stories and a real capture before merge. Visuals are not applicable to this MCP documentation plan.

## Remaining open decisions for the owner

1. Confirm coverage of all five tools, or narrow to the mandatory `get_component` example.
2. Confirm README placement and automated artifact-backed example checks, including clearly labelled excerpts for long output.
3. Decide separately whether any superseded JSX/composition guidance merits a later, independently scoped task.

## Planned checks

After separate execution approval, run the focused README/SDK example checks and the existing `pnpm test:mcp` suite; run `pnpm test:mcp:packed` only when matching release tarballs and the separately authorized packed-consumer setup are available. Verify the five input schemas, success/error envelopes, version identity, both configuration blocks and full golden output. No checks or builds have been run for this plan.
