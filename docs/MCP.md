# Storybook MCP for agents

Storybook serves a local, docs-only MCP endpoint through `@storybook/addon-mcp`. Agents use it to read
what the design system actually documents (component descriptions, props and story examples) instead of
guessing props or grepping component sources.

Operational detail for this repository:

| Fact | Value |
| --- | --- |
| Endpoint | `http://127.0.0.1:6006/mcp` (configured as `/mcp` in `.storybook/main.ts`) |
| Transport | MCP Streamable HTTP, stateful session |
| Tools | `docs-list`, `docs-show`, `docs-show-story` |
| Toolsets | `docs` only; `dev` and `test` are disabled |
| Components manifest | enabled (`features.componentsManifest`) |
| Authentication | none; loopback only |

What `/index.json` cannot tell you, `docs-list` can: it lists one entry per documented component
(`- <Name> (<component-id>)`) with its story ids, plus the standalone guides under `# Docs`.

## Prerequisites

- Node 24 and pnpm 10 (see `package.json` `engines` and `packageManager`).
- Installed dependencies and compiled tokens:

```bash
pnpm install
pnpm tokens
```

## Start the dev server

```bash
pnpm storybook
```

Storybook serves `http://127.0.0.1:6006` and the MCP endpoint at `http://127.0.0.1:6006/mcp`. Keep that
terminal open: it owns the server. Documentation requests run docgen on demand, so the first call for a
component takes a few seconds (observed ~5 s per request in this repository).

## Connect over HTTP

Every MCP session follows the same order: `initialize` → `notifications/initialized` → `tools/list` →
`tools/call`. The session is stateful: keep the `Mcp-Session-Id` that `initialize` returns and send it
with every later request, together with `MCP-Protocol-Version`.

The four commands below are the whole sequence. They use `curl` and Node 24 only; no MCP SDK is needed.
Paste them into one shell so the exported variables survive.

### 1. Initialize the session and list the tools

```bash
export STORYBOOK_MCP_URL=http://127.0.0.1:6006/mcp
export MCP_SESSION=$(curl -sS -D - -o /dev/null \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"egdev-agent","version":"1.0.0"}}}' \
  "$STORYBOOK_MCP_URL" | tr -d '\r' | awk -F': ' 'tolower($1) == "mcp-session-id" { print $2 }')
echo "$MCP_SESSION"

mcp_post() {
  curl -sS -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
    -H "Mcp-Session-Id: $MCP_SESSION" -H 'MCP-Protocol-Version: 2025-03-26' \
    --data "$1" "$STORYBOOK_MCP_URL"
}

# Reusable reader: SSE frames carry the JSON-RPC message on `data:` lines.
mcp_text() {
  sed -n 's/^data: //p' | node -e 'let raw="";process.stdin.on("data",(chunk)=>{raw+=chunk}).on("end",()=>{const message=JSON.parse(raw);const text=(message.result?.content??[]).filter((item)=>item.type==="text").map((item)=>item.text).join("\n");process.stdout.write(text+"\n")})'
}

mcp_post '{"jsonrpc":"2.0","id":2,"method":"notifications/initialized"}' >/dev/null
mcp_post '{"jsonrpc":"2.0","id":3,"method":"tools/list","params":{}}' | grep -o '"name":"docs-[a-z-]*"'
```

The tool list prints exactly three names:

```text
"name":"docs-list"
"name":"docs-show"
"name":"docs-show-story"
```

### 2. `docs-list`: discover IDs

Call this first. `withStoryIds: true` adds the story ids that `docs-show-story` takes.

```bash
mcp_post '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"docs-list","arguments":{"withStoryIds":true}}}' | mcp_text | grep '^- ' | head -5
```

Each line is one entry, `- <Name> (<id>)`; its stories follow as `  - <Story> (<story-id>)` lines, and
the standalone guides are the `# Docs` section. Count them with `grep -c '^- '` (currently 107 =
99 components + 8 guides).

### 3. `docs-show`: read a component or guide

```bash
mcp_post '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"docs-show","arguments":{"id":"atoms-gauge"}}}' | mcp_text | head -12
```

The reply starts with `# <Name>`, then `ID: <id>`, the description, the usage guidelines, the first
stories with code samples and the TypeScript prop definitions. The same call returns a standalone guide
when `id` is a `--docs` id such as `foundations-color--docs`.

### 4. `docs-show-story`: read one story variant

```bash
mcp_post '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"docs-show-story","arguments":{"storyId":"atoms-gauge--default"}}}' | mcp_text | head -12
```

Use it when the examples in `docs-show` do not show the prop or combination you need. `componentId` plus
`storyName` works too, but a story id is unambiguous.

## Client configuration

Any MCP client that supports the Streamable HTTP transport can point at the endpoint. A local
client configuration entry looks like this:

```json
{
  "mcpServers": {
    "egdev-storybook": {
      "type": "http",
      "url": "http://127.0.0.1:6006/mcp"
    }
  }
}
```

The client library performs the `initialize` handshake and session handling shown above. This repository
does not ship or modify any global client configuration: add the entry to the client you use, and keep
the URL loopback. The `@egdev/mcp` package for the versioned data artifact is a separate, offline server;
its own examples belong in `packages/mcp/README.md` once that package exists.

## Security boundary

The endpoint has no authentication and no authorization. It is a development surface for the machine that
runs Storybook:

- Bind and connect to loopback only (`127.0.0.1`, `localhost`, `[::1]`).
- Never expose it beyond the machine: no `--host 0.0.0.0`, no port forwarding, no public tunnel, no
  reverse proxy.
- Do not commit a client configuration that points at a non-loopback URL.

The smoke test enforces the same boundary: it refuses a credentialed or non-loopback
`STORYBOOK_MCP_URL`.

## Verify the endpoint

```bash
pnpm storybook            # terminal 1
pnpm test:storybook-mcp   # terminal 2
```

`pnpm test:storybook-mcp` runs the deterministic contract checks (no server needed) and then the live
smoke, which reconciles `docs-list` against the public barrels, the story metas, the MDX guides and
`scripts/storybook-mcp-exceptions.json`. Set `STORYBOOK_MCP_URL` only when the server is not on the
default port.

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `curl: (7) Failed to connect` | No server on that port. Run `pnpm storybook` and check the endpoint URL. |
| `initialize` answers `HTTP 404` | The running Storybook predates `@storybook/addon-mcp` (Storybook 8). This repository needs Storybook 10. |
| A request takes several seconds | Docgen runs on demand. Wait for the reply; the smoke allows 30 s per request. |
| `Tool docs-show not found` | `tools/list` never ran in that session, or the `Mcp-Session-Id` header is missing. |
| The smoke fails naming a component | The public exports and the manifest disagree. Fix the story/meta or update `scripts/storybook-mcp-exceptions.json`. |
