import assert from 'node:assert/strict';
import test from 'node:test';

// Run only against a parent-owned docs-only Storybook server; no SDK or model needed.
const endpoint = new URL(process.env.STORYBOOK_MCP_URL ?? 'http://127.0.0.1:6006/mcp');
assert.ok(
  ['http:', 'https:'].includes(endpoint.protocol) &&
    ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname) &&
    !endpoint.username &&
    !endpoint.password,
  'STORYBOOK_MCP_URL must be a credential-free loopback URL'
);

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

function parseComponents(listing) {
  return listing.split(/(?=^- [^\n]+? \([^)\n]+\):)/m).flatMap((section) => {
    const header = section.match(/^- ([^\n]+?) \(([^)\n]+)\):/);
    if (!header) {
      return [];
    }
    const storyId = section.match(/^ {2}- [^\n]*\(([^)\n]+)\)/m)?.[1];
    return [{ name: header[1], id: header[2], storyId }];
  });
}

test('catalog parser discovers IDs through multiline component documentation', () => {
  const listing =
    '- Surface (primitives-surface): ## Descripción\nCaja...\n  - Default (primitives-surface--default)\n- IconButton (atoms-iconbutton): ## Descripción\nBotón con solo icono y nombre accesible obligatorio.\n\n## Radix\n`AccessibleIcon`\n  - Default (atoms-iconbutton--default)\n  - Variants (atoms-iconbutton--variants)\n- Tabs (molecules-tabs): ## Descripción\nPestañas con contador opcional. Sin paneles, sirve de selector.\n\n- `variant...\n  - Default (molecules-tabs--default)\n  - Segmented (molecules-tabs--segmented)';
  assert.deepEqual(parseComponents(listing), [
    { name: 'Surface', id: 'primitives-surface', storyId: 'primitives-surface--default' },
    { name: 'IconButton', id: 'atoms-iconbutton', storyId: 'atoms-iconbutton--default' },
    { name: 'Tabs', id: 'molecules-tabs', storyId: 'molecules-tabs--default' }
  ]);
});

test('catalog parser never borrows a neighboring component story', () => {
  const listing =
    '- IconButton (atoms-iconbutton): ## Descripción\nNo stories.\n\n- Tabs (molecules-tabs): ## Descripción\nPestañas...\n  - Default (molecules-tabs--default)';
  assert.deepEqual(parseComponents(listing), [
    { name: 'IconButton', id: 'atoms-iconbutton', storyId: undefined },
    { name: 'Tabs', id: 'molecules-tabs', storyId: 'molecules-tabs--default' }
  ]);
});

test('docs-only MCP exposes real component APIs, Spanish stories and valid previews', {
  timeout: 30_000
}, async (t) => {
  let session;
  let version;
  let sequence = 0;
  const request = (url, options = {}) =>
    fetch(url, {
      ...options,
      redirect: 'error',
      signal: AbortSignal.any([t.signal, AbortSignal.timeout(3000)])
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
  const initialized = await rpc('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'egdev-docs-smoke', version: '1.0.0' }
  });
  assert.equal(typeof initialized.protocolVersion, 'string');
  version = initialized.protocolVersion;
  await rpc('notifications/initialized', {}, true);
  const { tools, nextCursor } = await rpc('tools/list', {});
  assert.equal(nextCursor, undefined, 'Docs-only tool list must fit in one page');
  assert.deepEqual(tools.map((tool) => tool.name).sort(), ['docs-list', 'docs-show', 'docs-show-story']);
  async function call(name, values) {
    const tool = tools.find((item) => item.name === name);
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
  const components = parseComponents(listing);
  const indexResponse = await request(new URL('/index.json', endpoint));
  assert.ok(indexResponse.ok, `Story index: HTTP ${indexResponse.status}`);
  const index = await indexResponse.json();
  for (const [name, description] of [
    ['IconButton', /Botón redondo ghost por defecto/],
    ['Surface', /Superficie por defecto/],
    ['Tabs', /Pestañas con paneles/]
  ]) {
    const entry = components.find((component) => component.name === name);
    assert.ok(entry, `${name} and its story IDs must be listed`);
    const { id, storyId } = entry;
    assert.ok(storyId, `${name} must advertise a story ID; docs-list returned:\n${listing}`);
    const docs = await call('docs-show', { id });
    assert.match(docs, /#{2,6} Descripción/);
    if (name === 'IconButton') {
      assert.match(docs, /label: string;/);
      assert.match(docs, /icon: [^;\n]+;/);
      assert.match(docs, /Nombre accesible/);
      for (const [prop, options, value] of [
        ['variant', ['ghost', 'outline'], 'ghost'],
        ['shape', ['round', 'square'], 'round'],
        ['size', ['md', 'sm'], 'md']
      ]) {
        const declaration = docs.match(new RegExp(`\\b${prop}\\?: ([^;\\n]+);`))?.[1];
        assert.ok(declaration, `${prop} must be documented`);
        for (const option of options) {
          assert.match(declaration, new RegExp(`['"]${option}['"]`));
        }
        assert.match(declaration, new RegExp(`= ['"]*${value}['"]*$`));
      }
      assert.match(docs, /asChild\?: boolean = ['"]*false['"]*;/);
    }
    assert.match(await call('docs-show-story', { storyId }), description);
    assert.equal(index.entries[storyId]?.type, 'story', `${storyId} must exist in the live index`);
    // The official docs tools return no preview URL: derive it from the returned ID.
    const preview = new URL('/iframe.html', endpoint);
    preview.searchParams.set('id', storyId);
    const response = await request(preview);
    assert.ok(response.ok, `${preview}: HTTP ${response.status}`);
    assert.match(await response.text(), /<!doctype html/i);
  }
});
