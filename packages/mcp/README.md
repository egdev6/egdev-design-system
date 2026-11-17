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

These examples use `@egdev/mcp` 0.2.0 and `@egdev/system` 0.2.0 from the same release. Pass each request object to an MCP SDK client's `callTool(request)` after connecting to the server. The responses show the MCP envelope: successful `content[0].text` is a JSON-serialized string, so parse that string to access the result; it is not a top-level result or `structuredContent`. The complete `designSystem` identity identifies the artifact used for these examples. Responses from a different release can differ.

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
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.1.0\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.3.0\"},{\"name\":\"@egdev/ui\",\"version\":\"0.1.0\"}]},\"component\":{\"name\":\"AspectRatio\",\"package\":\"@egdev/ui\",\"source\":\"packages/ui/src/primitives/aspect-ratio/types.ts\",\"props\":[{\"name\":\"ratio\",\"type\":\"number\",\"required\":false,\"default\":\"1\",\"description\":\"Width divided by height. Non-positive, non-finite or unrepresentable\\nreciprocal percentages fall back to a square. The parent owns width.\",\"deprecated\":false}],\"variants\":[{\"name\":\"aspectRatioVariants\",\"classes\":[\"min-w-0\"]}],\"parts\":[],\"composedOf\":[],\"anatomy\":[{\"name\":\"aspectRatioVariants\",\"base\":[],\"variants\":{},\"compounds\":[]}],\"layout\":[],\"surfaceUsage\":[]},\"catalog\":{\"name\":\"AspectRatio\",\"level\":\"primitive\",\"package\":\"@egdev/ui\",\"radix\":\"AspectRatio\",\"composes\":[],\"action\":\"nuevo\",\"available\":true}}"
    }
  ]
}
```
<!-- mcp-response-sha256: 5a3106eab0db8fbd021ffb78728392a018391c7b780703c02ee1dfa8554da5a8 -->
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
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.1.0\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.3.0\"},{\"name\":\"@egdev/ui\",\"version\":\"0.1.0\"}]},\"components\":[{\"name\":\"HomeTemplate\",\"package\":\"@egdev/effects\",\"level\":\"template\",\"available\":true}],\"total\":1}"
    }
  ]
}
```
<!-- mcp-response-sha256: a68d37e05333646a5c7d2e846b5ae6f7417baddc7073e34e9e437c0cb3e314ec -->
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
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.1.0\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.3.0\"},{\"name\":\"@egdev/ui\",\"version\":\"0.1.0\"}]},\"tokens\":[{\"name\":\"--ambient-angle\",\"value\":\"315\",\"group\":\"root\"}],\"total\":1}"
    }
  ]
}
```
<!-- mcp-response-sha256: 2cced0be4f827c411df9f02c5dc59fe7a829008e434679c97e523de5befa611d -->
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
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.1.0\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.3.0\"},{\"name\":\"@egdev/ui\",\"version\":\"0.1.0\"}]},\"recipes\":[{\"id\":\"Well\",\"semantics\":\"Recessed fill.\",\"tokens\":[\"--color-surface-0\",\"--shadow-well\"]}]}"
    }
  ]
}
```
<!-- mcp-response-sha256: 7ef785098a8228cda90f680f57f7f56a75edd97d28123283c1d667ff7657c990 -->
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
      "text": "{\"designSystem\":{\"name\":\"egdev-design-system\",\"schemaVersion\":\"1.0.0\",\"packages\":[{\"name\":\"@egdev/effects\",\"version\":\"0.1.0\"},{\"name\":\"@egdev/tokens\",\"version\":\"0.3.0\"},{\"name\":\"@egdev/ui\",\"version\":\"0.1.0\"}]},\"systemMd\":\"## Composition guide\\n\\nStart with an existing organism; other"
    }
  ]
}
```
<!-- mcp-response-sha256: f717951cd0f020776fb4f74ab364b6b607b014df66ac4191974144d9358296fa -->
<!-- /mcp-example:get_design_system_md -->
