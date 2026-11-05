import assert from 'node:assert/strict';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  assertContract,
  EXCEPTIONS_FILE,
  enumeratePublicComponents,
  normalizeComponentName,
  parseDocsList,
  readExceptions,
  readMdxDocs,
  readStoryMetas
} from './storybook-mcp-contract.mjs';

// Run only against a parent-owned docs-only Storybook server; no SDK or model needed.
const endpoint = new URL(process.env.STORYBOOK_MCP_URL ?? 'http://127.0.0.1:6006/mcp');
assert.ok(
  ['http:', 'https:'].includes(endpoint.protocol) &&
    ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname) &&
    !endpoint.username &&
    !endpoint.password,
  'STORYBOOK_MCP_URL must be a credential-free loopback URL'
);

const root = fileURLToPath(new URL('../', import.meta.url));
// docs-list/docs-show run docgen on demand: ~5 s per call on a dev machine, so every
// request gets a bounded but realistic budget instead of the historical 3 s.
const REQUEST_TIMEOUT_MS = 30_000;
// The historical contract sample (D5). Availability itself is enforced by the reconciliation:
// removing the Gauge story or export fails the contract before this sample is requested.
const HISTORICAL_SAMPLE = 'atoms-gauge';

async function readRpc(response, id) {
  if (!response.headers.get('content-type')?.includes('text/event-stream')) {
    assert.match(response.headers.get('content-type') ?? '', /application\/json/);
    return response.json();
  }
  assert.ok(response.body, 'SSE response must have a body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      assert.ok(!done, `SSE ended before response ${id}`);
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop();
      for (const event of events) {
        const data = event
          .split(/\r?\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trimStart())
          .join('\n');
        if (data) {
          const message = JSON.parse(data);
          if (message.id === id) {
            return message;
          }
        }
      }
    }
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
}

// Only supply inputs whose names/types are actually advertised by tools/list.
function inputs(tool, values) {
  assert.equal(tool.inputSchema?.type, 'object');
  for (const [key, value] of Object.entries(values)) {
    assert.equal(tool.inputSchema.properties?.[key]?.type, typeof value, `${tool.name}.${key} schema`);
  }
  for (const key of tool.inputSchema.required ?? []) {
    assert.ok(Object.hasOwn(values, key), `Unresolved required input ${tool.name}.${key}`);
  }
  return values;
}

// One deterministic sample per level, plus the historical contract component (D5).
function sampleIds(manifest, exports) {
  const ids = new Set();
  const levels = [...new Set(manifest.components.map(({ id }) => id.slice(0, id.indexOf('-'))))];
  for (const level of levels) {
    const [first] = manifest.components
      .filter(({ id, name }) => id.startsWith(`${level}-`) && exports.includes(normalizeComponentName(name)))
      .sort((left, right) => left.id.localeCompare(right.id));
    if (first) {
      ids.add(first.id);
    }
  }
  ids.add(HISTORICAL_SAMPLE);
  return [...ids].sort();
}

test('docs-only MCP manifest matches the public exports and serves documentation', { timeout: 300_000 }, async (t) => {
  let session;
  let version;
  let sequence = 0;
  const request = (url, options = {}) =>
    fetch(url, {
      ...options,
      redirect: 'error',
      signal: AbortSignal.any([t.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
    });
  async function rpc(method, params, notification = false) {
    const id = ++sequence;
    const headers = new Headers([
      ['Content-Type', 'application/json'],
      ['Accept', 'application/json, text/event-stream']
    ]);
    if (session) {
      headers.set('Mcp-Session-Id', session);
    }
    if (version) {
      headers.set('MCP-Protocol-Version', version);
    }
    const response = await request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ jsonrpc: '2.0', ...(notification ? {} : { id }), method, params })
    });
    assert.ok(response.ok, `${method}: HTTP ${response.status}`);
    session = response.headers.get('mcp-session-id') ?? session;
    if (notification) {
      await response.body?.cancel();
      return;
    }
    const message = await readRpc(response, id);
    assert.equal(message.jsonrpc, '2.0');
    assert.equal(message.id, id);
    assert.equal(message.error, undefined, JSON.stringify(message.error));
    assert.ok(message.result, `${method} must return a result`);
    return message.result;
  }

  let initialized;
  try {
    initialized = await rpc('initialize', {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'egdev-docs-smoke', version: '1.0.0' }
    });
  } catch (error) {
    throw new Error(
      `Cannot reach the Storybook MCP endpoint ${endpoint.href}: ${error.message}\n` +
        'Start Storybook with "pnpm storybook" (endpoint http://127.0.0.1:6006/mcp) and run this check again.'
    );
  }
  assert.equal(typeof initialized.protocolVersion, 'string');
  version = initialized.protocolVersion;
  await rpc('notifications/initialized', {}, true);

  const { tools, nextCursor } = await rpc('tools/list', {});
  assert.equal(nextCursor, undefined, 'Docs-only tool list must fit in one page');
  assert.deepEqual(
    tools.map((tool) => tool.name).sort(),
    ['docs-list', 'docs-show', 'docs-show-story'],
    'The docs toolset is exactly docs-list, docs-show and docs-show-story'
  );

  async function call(name, values) {
    const tool = tools.find((item) => item.name === name);
    assert.ok(tool, `${name} must be advertised by tools/list`);
    const result = await rpc('tools/call', { name, arguments: inputs(tool, values) });
    assert.notEqual(result.isError, true, JSON.stringify(result.content));
    const text = result.content
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n');
    assert.ok(text.trim(), `${name} must return documentation`);
    return text;
  }

  const listing = await call('docs-list', { withStoryIds: true });
  const manifest = parseDocsList(listing);
  const indexResponse = await request(new URL('/index.json', endpoint));
  assert.ok(indexResponse.ok, `Story index: HTTP ${indexResponse.status}`);
  const index = await indexResponse.json();

  const exports = enumeratePublicComponents(root);
  const stories = readStoryMetas(root);
  const docs = readMdxDocs(root);
  const exceptions = readExceptions(join(root, EXCEPTIONS_FILE));
  assertContract({ exports, stories, docs, exceptions, manifest, index });
  t.diagnostic(
    `docs-list: ${manifest.components.length} components, ${manifest.docs.length} docs guides, ` +
      `${manifest.components.reduce((total, { stories: list }) => total + list.length, 0)} story ids`
  );

  for (const story of stories.filter(({ component, subcomponents }) => component && subcomponents.length > 0)) {
    const documentation = await call('docs-show', { id: story.id });
    for (const part of story.subcomponents) {
      assert.ok(documentation.includes(part), `${story.id} docs-show must list declared part ${part}`);
    }
    t.diagnostic(`${story.id} docs-show lists ${story.subcomponents.length} declared parts`);
  }

  for (const id of sampleIds(manifest, exports)) {
    const documentation = await call('docs-show', { id });
    assert.match(documentation, /^# /m, `${id} docs-show must start with a heading`);
    assert.ok(documentation.includes(`ID: ${id}`), `${id} docs-show must report its own ID`);
    const storyIds = [...documentation.matchAll(/^Story ID: (\S+)$/gm)].map((match) => match[1]);
    assert.ok(storyIds.length > 0, `${id} docs-show must include story IDs`);
    for (const storyId of storyIds) {
      assert.equal(index.entries[storyId]?.type, 'story', `${storyId} from ${id} must be a live story`);
    }

    const storyId = storyIds[0];
    const story = await call('docs-show-story', { storyId });
    assert.match(story, /^# /m, `${storyId} docs-show-story must return a heading`);
    // The official docs tools return no preview URL: derive it from the returned story ID.
    const preview = new URL('/iframe.html', endpoint);
    preview.searchParams.set('id', storyId);
    const response = await request(preview);
    assert.ok(response.ok, `${preview}: HTTP ${response.status}`);
    assert.match(await response.text(), /<!doctype html/i);
  }

  const [docsSample] = [...manifest.docs].sort((left, right) => left.id.localeCompare(right.id));
  const docsPage = await call('docs-show', { id: docsSample.id });
  assert.match(docsPage, /^# /m, `${docsSample.id} docs-show must start with a heading`);
  assert.ok(docsPage.includes(docsSample.name), `${docsSample.id} docs-show must contain its MDX title`);
});
