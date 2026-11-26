# @egdev/mcp

Offline, read-only MCP over the `@egdev/system` artifact. Install both tarballs from the same release into a consumer and use Node 24. The server exposes `list_components`, `get_component`, `get_tokens`, `get_material_recipe`, and `get_design_system_md`. Successful results include the artifact's version identity. `get_design_system_md` returns `systemMd` rendered by `@egdev/system` from the same artifact. This stdio server is separate from [Storybook MCP](../../docs/MCP.md).

See the [usage examples](#usage-examples) for SDK requests and responses.

## Client configuration

Replace `/absolute/path/to/consumer` with the directory containing the installed tarballs. Pi (`.pi/mcp.json` in a trusted project):

<!-- mcp-config:pi -->
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
<!-- /mcp-config:pi -->

Claude Desktop (`claude_desktop_config.json`):

<!-- mcp-config:claude-desktop -->
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
<!-- /mcp-config:claude-desktop -->

Run `pi mcp list` to check the configured connection. The repository's `pnpm test:mcp:packed` also connects an SDK client to the installed binary and calls every tool. No network or HTTP transport is used by the server.

## Usage examples

These examples use `@egdev/mcp` 0.4.12 and `@egdev/system` 0.13.0 from the same release. Pass each request object to an MCP SDK client's `callTool(request)` after connecting to the server. The responses show the MCP envelope: successful `content[0].text` is a JSON-serialized string, so parse that string to access the result; it is not a top-level result or `structuredContent`. The complete `designSystem` identity identifies the artifact used for these examples. Responses from a different release can differ.

### Get a component

`name` is required. The `catalog` field may be `null` when the component has no catalog entry.

<!-- mcp-example:get_component -->
Request:

```json mcp-request
{
  "name": "get_component",
  "arguments": { "name": "AspectRatio" }
}
```

Complete success response:

```json mcp-response
{
  "content": [
    {
      "type": "text",
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.2.12\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.6.1\"},{\"name\":\"@egdev/ui\",\"version\":\"0.11.0\"}]},\"component\":{\"name\":\"AspectRatio\",\"package\":\"@egdev/ui\",\"source\":\"packages/ui/src/primitives/aspect-ratio/types.ts\",\"props\":[{\"name\":\"ratio\",\"type\":\"number\",\"required\":false,\"default\":\"1\",\"description\":\"Width divided by height. Non-positive, non-finite or unrepresentable\\nreciprocal percentages fall back to a square. The parent owns width.\",\"deprecated\":false}],\"variants\":[{\"name\":\"aspectRatioVariants\",\"classes\":[\"min-w-0\"]}],\"parts\":[],\"composedOf\":[],\"anatomy\":[{\"name\":\"aspectRatioVariants\",\"base\":[],\"variants\":{},\"compounds\":[]}],\"layout\":[],\"surfaceUsage\":[]},\"catalog\":{\"name\":\"AspectRatio\",\"level\":\"primitive\",\"package\":\"@egdev/ui\",\"radix\":\"AspectRatio\",\"composes\":[],\"action\":\"nuevo\",\"available\":true}}"
    }
  ]
}
```
<!-- mcp-response-sha256: 399fce575574b8e48332a20cc9e306d2ca4ee85bedfce53665f4d56f7924809d -->
<!-- /mcp-example:get_component -->

An unknown name returns an error envelope. Its text is plain text, **not** serialized JSON:

<!-- mcp-example:get_component_unknown -->
Request:

```json mcp-request
{
  "name": "get_component",
  "arguments": { "name": "absent" }
}
```

Complete error response:

```json mcp-response
{
  "isError": true,
  "content": [
    { "type": "text", "text": "Unknown component: absent" }
  ]
}
```
<!-- /mcp-example:get_component_unknown -->

### List components

Both `package` and `level` are optional string filters.

<!-- mcp-example:list_components -->
Request:

```json mcp-request
{
  "name": "list_components",
  "arguments": { "package": "@egdev/effects", "level": "template" }
}
```

Complete success response:

```json mcp-response
{
  "content": [
    {
      "type": "text",
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.2.12\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.6.1\"},{\"name\":\"@egdev/ui\",\"version\":\"0.11.0\"}]},\"components\":[{\"name\":\"HomeTemplate\",\"package\":\"@egdev/effects\",\"level\":\"template\",\"available\":true}],\"total\":1}"
    }
  ]
}
```
<!-- mcp-response-sha256: 571a3ea5189b0ab2629b6ae60aeb2008170505b46e3697e1c9bf7ae00e444f11 -->
<!-- /mcp-example:list_components -->

### Get tokens

Both `group` and `prefix` are optional string filters.

<!-- mcp-example:get_tokens -->
Request:

```json mcp-request
{
  "name": "get_tokens",
  "arguments": { "group": "root", "prefix": "--ambient-angle" }
}
```

Complete success response:

```json mcp-response
{
  "content": [
    {
      "type": "text",
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.2.12\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.6.1\"},{\"name\":\"@egdev/ui\",\"version\":\"0.11.0\"}]},\"tokens\":[{\"name\":\"--ambient-angle\",\"value\":\"315\",\"group\":\"root\"}],\"total\":1}"
    }
  ]
}
```
<!-- mcp-response-sha256: dba9077261031fc7573181497ce5d34bfe5ae7a5350f48d9d5145e81c1377524 -->
<!-- /mcp-example:get_tokens -->

### Get a Material recipe

`id` is optional; omit it to list all recipes.

<!-- mcp-example:get_material_recipe -->
Request:

```json mcp-request
{
  "name": "get_material_recipe",
  "arguments": { "id": "Well" }
}
```

Complete success response:

```json mcp-response
{
  "content": [
    {
      "type": "text",
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.2.12\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.6.1\"},{\"name\":\"@egdev/ui\",\"version\":\"0.11.0\"}]},\"recipes\":[{\"id\":\"Well\",\"semantics\":\"Recessed fill.\",\"tokens\":[\"--color-surface-0\",\"--shadow-well\"]}]}"
    }
  ]
}
```
<!-- mcp-response-sha256: 7c66a628772242e3e786cdc04ac29c3f28165e3fd06d7a7b8ca3b5f3f527f0ba -->
<!-- /mcp-example:get_material_recipe -->

### Get the design-system reference

The request has no arguments. The response below is **an excerpt**, not a complete copyable response: `content[0].text` is truncated within the serialized `systemMd` string. The actual text contains the complete JSON value and the full generated Markdown.

<!-- mcp-example:get_design_system_md -->
Request:

```json mcp-request
{
  "name": "get_design_system_md",
  "arguments": {}
}
```

Success response excerpt:

```json mcp-response-excerpt
{
  "content": [
    {
      "type": "text",
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.2.12\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.6.1\"},{\"name\":\"@egdev/ui\",\"version\":\"0.11.0\"}]},\"systemMd\":\"## Composition guide\\n\\nStart with an existing organism; other"
    }
  ]
}
```
<!-- mcp-response-sha256: f2e1ea81d6978d836f5099e6d69d03765e869b9dea47f5c4b8a05c38235f9a0f -->
<!-- /mcp-example:get_design_system_md -->
