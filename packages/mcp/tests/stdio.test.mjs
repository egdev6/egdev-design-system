import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const artifact = JSON.parse(readFileSync(new URL('../../system/design-system.json', import.meta.url), 'utf8'));
const designSystem = { name: artifact.name, schemaVersion: artifact.schemaVersion, packages: artifact.packages };
const executable = fileURLToPath(new URL('../dist/index.js', import.meta.url));
const names = ['get_component', 'get_material_recipe', 'get_tokens', 'list_components'];

test('stdio tools project the installed artifact, validate inputs, and survive errors', async () => {
  const client = new Client({ name: 'test', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: process.execPath, args: [executable], stderr: 'pipe' });
  await client.connect(transport);
  try {
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((tool) => tool.name).sort(), names);
    for (const tool of tools) {
      assert.equal(tool.inputSchema.type, 'object');
    }
    const call = async (name, args = {}) => client.callTool({ name, arguments: args });
    const value = async (name, args) => JSON.parse((await call(name, args)).content[0].text);
    const components = artifact.catalog.map(({ name, package: pkg, level, available }) => ({
      name,
      package: pkg,
      level,
      available
    }));
    assert.deepEqual(await value('list_components'), { designSystem, components, total: components.length });
    const selected = components.filter(
      (entry) => entry.package === components[0].package && entry.level === components[0].level
    );
    assert.deepEqual(await value('list_components', { package: components[0].package, level: components[0].level }), {
      designSystem,
      components: selected,
      total: selected.length
    });
    const component = artifact.components[0];
    assert.deepEqual(await value('get_component', { name: component.name }), {
      designSystem,
      component,
      catalog: artifact.catalog.find((entry) => entry.name === component.name)
    });
    assert.deepEqual(await value('get_tokens'), {
      designSystem,
      tokens: artifact.tokens,
      total: artifact.tokens.length
    });
    const token = artifact.tokens[0];
    const tokens = artifact.tokens.filter(
      (entry) => entry.group === token.group && entry.name.startsWith(token.name.slice(0, 5))
    );
    assert.deepEqual(await value('get_tokens', { group: token.group, prefix: token.name.slice(0, 5) }), {
      designSystem,
      tokens,
      total: tokens.length
    });
    assert.deepEqual(await value('get_material_recipe'), { designSystem, recipes: artifact.materialRecipes });
    assert.deepEqual(await value('get_material_recipe', { id: artifact.materialRecipes[0].id }), {
      designSystem,
      recipes: [artifact.materialRecipes[0]]
    });
    for (const [name, args, message] of [
      ['get_component', { name: 'absent' }, 'Unknown component: absent'],
      ['get_material_recipe', { id: 'absent' }, 'Unknown recipe: absent']
    ]) {
      const result = await call(name, args);
      assert.equal(result.isError, true);
      assert.deepEqual(result.content, [{ type: 'text', text: message }]);
    }
    for (const [name, args] of [
      ['get_component', {}],
      ['get_component', { name: 1 }],
      ['get_tokens', { group: 1 }]
    ]) {
      assert.equal((await call(name, args)).isError, true);
    }
    assert.deepEqual(await value('get_material_recipe'), { designSystem, recipes: artifact.materialRecipes });
  } finally {
    await client.close();
  }
});

test('artifact-derived component assertions detect a removed component', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'egdev-mcp-negative-'));
  try {
    const fixture = structuredClone(artifact);
    const removed = fixture.components.shift();
    const path = join(directory, 'artifact.json');
    writeFileSync(path, JSON.stringify(fixture));
    const server = new URL('../dist/server.js', import.meta.url).href;
    const sdk = import.meta.resolve('@modelcontextprotocol/sdk/server/stdio.js');
    const script = `import {readFileSync} from 'node:fs'; import {createServer} from ${JSON.stringify(server)}; import {StdioServerTransport} from ${JSON.stringify(sdk)}; await createServer(JSON.parse(readFileSync(process.argv[1], 'utf8'))).connect(new StdioServerTransport());`;
    const client = new Client({ name: 'negative-test', version: '1.0.0' });
    await client.connect(
      new StdioClientTransport({ command: process.execPath, args: ['--input-type=module', '-e', script, path] })
    );
    try {
      const result = await client.callTool({ name: 'list_components', arguments: {} });
      const actual = JSON.parse(result.content[0].text);
      const expected = artifact.catalog
        .filter((entry) => entry.name !== removed.name)
        .map(({ name, package: pkg, level, available }) => ({ name, package: pkg, level, available }));
      assert.throws(() => assert.deepEqual(actual.components, expected), assert.AssertionError);
      assert.equal(actual.total, artifact.catalog.length);
    } finally {
      await client.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
