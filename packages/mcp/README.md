# @egdev/mcp

Offline, read-only MCP over the `@egdev/system` artifact. Install both tarballs from the same release into a consumer and use Node 24. The server exposes `list_components`, `get_component`, `get_tokens`, and `get_material_recipe`. Each result includes the artifact's version identity. `get_design_system_md` is deferred to the #347 integration.

Replace `/absolute/path/to/consumer` with the directory containing the installed tarballs. Pi (`.pi/mcp.json` in a trusted project):

```json
{
  "mcpServers": {
    "egdev": {
      "command": "/absolute/path/to/consumer/node_modules/.bin/egdev-mcp",
      "args": []
    }
  }
}
```

Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "egdev": {
      "command": "/absolute/path/to/consumer/node_modules/.bin/egdev-mcp",
      "args": []
    }
  }
}
```

Run `pi mcp list` to check the configured connection. The repository's `pnpm test:mcp:packed` also connects an SDK client to the installed binary and calls every tool. No network or HTTP transport is used by the server.
