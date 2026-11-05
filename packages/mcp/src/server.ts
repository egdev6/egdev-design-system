import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { type Artifact, versionBlock } from './artifact.js';

export function createServer(data: Artifact) {
  const server = new McpServer({ name: '@egdev/mcp', version: '0.1.0' });
  const designSystem = versionBlock(data);
  const result = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
  const unknown = (message: string) => ({ isError: true, content: [{ type: 'text' as const, text: message }] });
  const annotations = { readOnlyHint: true };
  server.registerTool(
    'list_components',
    { inputSchema: { package: z.string().optional(), level: z.string().optional() }, annotations },
    (args) => {
      const components = data.catalog
        .filter(
          (entry) =>
            (args.package === undefined || entry.package === args.package) &&
            (args.level === undefined || entry.level === args.level)
        )
        .map(({ name, package: pkg, level, available }) => ({ name, package: pkg, level, available }));
      return result({ designSystem, components, total: components.length });
    }
  );
  server.registerTool('get_component', { inputSchema: { name: z.string() }, annotations }, ({ name }) => {
    const component = data.components.find((entry) => entry.name === name);
    if (!component) {
      return unknown(`Unknown component: ${name}`);
    }
    return result({ designSystem, component, catalog: data.catalog.find((entry) => entry.name === name) ?? null });
  });
  server.registerTool(
    'get_tokens',
    { inputSchema: { group: z.string().optional(), prefix: z.string().optional() }, annotations },
    ({ group, prefix }) => {
      const tokens = data.tokens.filter(
        (entry) =>
          (group === undefined || entry.group === group) && (prefix === undefined || entry.name.startsWith(prefix))
      );
      return result({ designSystem, tokens, total: tokens.length });
    }
  );
  server.registerTool('get_material_recipe', { inputSchema: { id: z.string().optional() }, annotations }, ({ id }) => {
    const recipes = id === undefined ? data.materialRecipes : data.materialRecipes.filter((entry) => entry.id === id);
    if (id !== undefined && recipes.length === 0) {
      return unknown(`Unknown recipe: ${id}`);
    }
    return result({ designSystem, recipes });
  });
  return server;
}
