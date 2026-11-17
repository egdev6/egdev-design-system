import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readClientConfig } from './readme-configs.mjs';

const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const require = createRequire(new URL('../package.json', import.meta.url));
const systemDirectory = new URL('./', pathToFileURL(require.resolve('@egdev/system/design-system.json')));
const artifact = JSON.parse(readFileSync(new URL('design-system.json', systemDirectory), 'utf8'));
const systemMd = readFileSync(new URL('system.md', systemDirectory), 'utf8');
const mcpVersion = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
const systemVersion = JSON.parse(readFileSync(new URL('package.json', systemDirectory), 'utf8')).version;
const designSystem = { name: artifact.name, schemaVersion: artifact.schemaVersion, packages: artifact.packages };
const expectedToolInputs = new Map([
  ['get_component', { fields: ['name'], required: ['name'] }],
  ['get_design_system_md', { fields: [], required: [] }],
  ['get_material_recipe', { fields: ['id'], required: [] }],
  ['get_tokens', { fields: ['group', 'prefix'], required: [] }],
  ['list_components', { fields: ['level', 'package'], required: [] }]
]);
const expectedIds = [...expectedToolInputs.keys(), 'get_component_unknown'].sort();

function parseExamples(markdown) {
  const blocks = [...markdown.matchAll(/<!-- mcp-example:([a-z_]+) -->\n([\s\S]*?)\n<!-- \/mcp-example:\1 -->/g)];
  const ids = blocks.map((match) => match[1]).sort();
  assert.deepEqual(ids, expectedIds, 'the README must mark every tool example and the unknown-component error');
  assert.equal([...markdown.matchAll(/<!-- mcp-example:[a-z_]+ -->/g)].length, blocks.length);
  assert.equal([...markdown.matchAll(/<!-- \/mcp-example:[a-z_]+ -->/g)].length, blocks.length);
  assert.equal([...markdown.matchAll(/```json mcp-request\n/g)].length, blocks.length);
  assert.equal([...markdown.matchAll(/```json mcp-response(?:-excerpt)?\n/g)].length, blocks.length);
  return blocks.map(([, id, body]) => {
    const requests = [...body.matchAll(/```json mcp-request\n([\s\S]*?)\n```/g)];
    const responses = [...body.matchAll(/```json mcp-response(-excerpt)?\n([\s\S]*?)\n```/g)];
    const digests = [...body.matchAll(/<!-- mcp-response-sha256: ([a-f0-9]{64}) -->/g)];
    assert.equal(requests.length, 1, `${id}: exactly one request`);
    assert.equal(responses.length, 1, `${id}: exactly one response`);
    assert.equal(digests.length, id === 'get_component_unknown' ? 0 : 1, `${id}: success digest`);
    return {
      id,
      request: JSON.parse(requests[0][1]),
      response: JSON.parse(responses[0][2]),
      excerpt: Boolean(responses[0][1]),
      digest: digests[0]?.[1]
    };
  });
}

function checkSchema(tool) {
  const definition = expectedToolInputs.get(tool.name);
  assert.ok(definition, `${tool.name}: unexpected tool`);
  assert.deepEqual(
    tool.inputSchema,
    {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: Object.fromEntries(definition.fields.map((name) => [name, { type: 'string' }])),
      ...(definition.required.length ? { required: definition.required } : {})
    },
    `${tool.name}: input schema`
  );
}

function checkRequest(example, tools) {
  const { id, request } = example;
  assert.deepEqual(Object.keys(request).sort(), ['arguments', 'name'], `${id}: SDK call shape`);
  assert.equal(request.name, id === 'get_component_unknown' ? 'get_component' : id);
  assert.ok(request.arguments && typeof request.arguments === 'object' && !Array.isArray(request.arguments));
  const schema = tools.find((tool) => tool.name === request.name)?.inputSchema;
  assert.ok(schema, `${id}: tool is registered`);
  assert.equal(schema.type, 'object');
  for (const name of schema.required ?? []) {
    assert.ok(Object.hasOwn(request.arguments, name), `${id}: missing required ${name}`);
  }
  for (const [name, value] of Object.entries(request.arguments)) {
    assert.ok(Object.hasOwn(schema.properties, name), `${id}: unknown argument ${name}`);
    assert.equal(typeof value, schema.properties[name].type, `${id}: invalid type for ${name}`);
  }
  const fields = expectedToolInputs.get(request.name).fields;
  assert.deepEqual(Object.keys(request.arguments).sort(), fields, `${id}: documented filter coverage`);
  if (id === 'get_component_unknown') {
    assert.equal(request.arguments.name, 'absent');
  }
}

function golden(request) {
  const args = request.arguments;
  switch (request.name) {
    case 'get_component': {
      const component = artifact.components.find((item) => item.name === args.name);
      assert.ok(component, 'the documented component exists in the installed artifact');
      return { designSystem, component, catalog: artifact.catalog.find((item) => item.name === args.name) ?? null };
    }
    case 'list_components': {
      const components = artifact.catalog
        .filter((item) => item.package === args.package && item.level === args.level)
        .map(({ name, package: pkg, level, available }) => ({ name, package: pkg, level, available }));
      assert.ok(components.length, 'the documented component filters return results');
      return { designSystem, components, total: components.length };
    }
    case 'get_tokens': {
      const tokens = artifact.tokens.filter((item) => item.group === args.group && item.name.startsWith(args.prefix));
      assert.ok(tokens.length, 'the documented token filters return results');
      return { designSystem, tokens, total: tokens.length };
    }
    case 'get_material_recipe': {
      const recipes = artifact.materialRecipes.filter((item) => item.id === args.id);
      assert.ok(recipes.length, 'the documented recipe exists');
      return { designSystem, recipes };
    }
    case 'get_design_system_md':
      return { designSystem, systemMd };
    default:
      assert.fail(`unexpected example: ${request.name}`);
  }
}

function checkResponse(example, actual) {
  const { id, request, response, excerpt, digest } = example;
  assert.deepEqual(Object.keys(actual).sort(), Object.keys(response).sort(), `${id}: response envelope`);
  assert.ok(Array.isArray(actual.content));
  assert.equal(actual.content.length, 1);
  assert.equal(response.content.length, 1);
  assert.deepEqual(Object.keys(actual.content[0]).sort(), ['text', 'type']);
  assert.deepEqual(Object.keys(response.content[0]).sort(), ['text', 'type']);
  assert.equal(actual.content[0].type, 'text');
  assert.equal(response.content[0].type, 'text');
  const text = actual.content[0].text;
  assert.equal(typeof text, 'string');
  if (id === 'get_component_unknown') {
    assert.equal(excerpt, false);
    assert.equal(actual.isError, true);
    assert.deepEqual(actual, response);
    assert.equal(text, 'Unknown component: absent');
    assert.throws(() => JSON.parse(text), SyntaxError);
    return;
  }
  assert.equal(actual.isError, undefined, `${id}: successful result is not an error`);
  assert.equal(excerpt, id === 'get_design_system_md', `${id}: only systemMd is an excerpt`);
  assert.equal(createHash('sha256').update(text, 'utf8').digest('hex'), digest, `${id}: complete text digest`);
  const parsed = JSON.parse(text);
  assert.deepEqual(parsed, golden(request), `${id}: complete artifact or system.md golden`);
  if (excerpt) {
    const shown = response.content[0].text;
    const requiredPrefix = `{"designSystem":${JSON.stringify(designSystem)},"systemMd":"`;
    assert.ok(shown.startsWith(requiredPrefix), `${id}: excerpt shows the complete version identity`);
    assert.ok(text.startsWith(shown), `${id}: excerpt matches the actual text`);
    assert.ok(shown.length < text.length, `${id}: the response is explicitly an excerpt`);
  } else {
    assert.deepEqual(actual, response, `${id}: every displayed field matches`);
  }
}

test('both existing client configurations remain identical and usable', () => {
  const configs = ['pi', 'claude-desktop'].map((id) => {
    const pattern = new RegExp(
      `<!-- mcp-config:${id} -->\\n\`\`\`json\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- /mcp-config:${id} -->`
    );
    const match = readme.match(pattern);
    assert.ok(match, `${id}: marked configuration`);
    return JSON.parse(match[1]);
  });
  assert.deepEqual(configs[0], configs[1]);
  assert.deepEqual(configs[0], {
    mcpServers: { egdev: { command: '/absolute/path/to/consumer/node_modules/.bin/egdev-mcp', args: [] } }
  });
});

test('packed configuration selector ignores other JSON fences', () => {
  const config = { command: '/absolute/path/to/consumer/node_modules/.bin/egdev-mcp', args: [] };
  assert.deepEqual(readClientConfig(readme), config);
  const otherExample = '\n```json\n{"mcpServers":{"egdev":{"command":"wrong","args":[]}}}\n```\n';
  assert.deepEqual(readClientConfig(`${otherExample}${readme}${otherExample}`), config);
});

test('packed configuration selector requires and validates both marked configurations', () => {
  for (const id of ['pi', 'claude-desktop']) {
    const pattern = new RegExp(`<!-- mcp-config:${id} -->[\\s\\S]*?<!-- /mcp-config:${id} -->`);
    const block = readme.match(pattern)?.[0];
    assert.ok(block, `${id}: marked configuration`);
    assert.throws(() => readClientConfig(readme.replace(block, '')), assert.AssertionError);
    assert.throws(() => readClientConfig(`${readme}\n${block}`), assert.AssertionError);
    const changed = block.replace('/absolute/path/to/consumer', '/different/consumer');
    assert.notEqual(changed, block);
    assert.throws(() => readClientConfig(readme.replace(block, changed)), assert.AssertionError);
  }
});

test('README requests and responses track the real stdio tools and installed artifact', async () => {
  const examples = parseExamples(readme);
  assert.ok(
    readme.includes(`These examples use \`@egdev/mcp\` ${mcpVersion} and \`@egdev/system\` ${systemVersion}`),
    'the documented package versions match the installed release'
  );
  const client = new Client({ name: 'readme-examples-test', version: '1.0.0' });
  const executable = fileURLToPath(new URL('../dist/index.js', import.meta.url));
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [executable] }));
  try {
    assert.deepEqual(client.getServerVersion(), { name: '@egdev/mcp', version: mcpVersion });
    const { tools } = await client.listTools();
    assert.deepEqual(
      tools.map((tool) => tool.name).sort(),
      expectedIds.filter((id) => id !== 'get_component_unknown')
    );
    for (const tool of tools) {
      checkSchema(tool);
    }
    const results = new Map();
    for (const example of examples) {
      checkRequest(example, tools);
      const actual = await client.callTool(example.request);
      checkResponse(example, actual);
      results.set(example.id, actual);
    }

    assert.throws(() => parseExamples(readme.replace('<!-- mcp-example:get_tokens -->', '')), assert.AssertionError);
    const component = structuredClone(examples.find((item) => item.id === 'get_component'));
    component.response.content[0].text = component.response.content[0].text.replace('AspectRatio', 'Changed');
    assert.throws(() => checkResponse(component, results.get(component.id)), assert.AssertionError);
    const badDigest = structuredClone(examples.find((item) => item.id === 'get_tokens'));
    badDigest.digest = '0'.repeat(64);
    assert.throws(() => checkResponse(badDigest, results.get(badDigest.id)), assert.AssertionError);
    const badExcerpt = structuredClone(examples.find((item) => item.id === 'get_design_system_md'));
    badExcerpt.response.content[0].text += 'not part of the response';
    assert.throws(() => checkResponse(badExcerpt, results.get(badExcerpt.id)), assert.AssertionError);
    const badError = structuredClone(examples.find((item) => item.id === 'get_component_unknown'));
    badError.response.content[0].text = 'Unknown component';
    assert.throws(() => checkResponse(badError, results.get(badError.id)), assert.AssertionError);
    const badArgument = structuredClone(examples.find((item) => item.id === 'get_material_recipe'));
    badArgument.request.arguments.id = 42;
    assert.throws(() => checkRequest(badArgument, tools), assert.AssertionError);
    const badSchema = structuredClone(tools.find((tool) => tool.name === 'get_material_recipe'));
    badSchema.inputSchema.properties.id.maxLength = 1;
    assert.throws(() => checkSchema(badSchema), assert.AssertionError);
  } finally {
    await client.close();
  }
});
