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

const standaloneDocs = [
  ['welcome--docs', 'Welcome', './docs/storybook/welcome.mdx'],
  ['foundations-color--docs', 'Foundations/Color', './docs/storybook/color.mdx'],
  ['foundations-typography--docs', 'Foundations/Typography', './docs/storybook/typography.mdx'],
  ['foundations-layout--docs', 'Foundations/Layout', './docs/storybook/layout.mdx'],
  ['foundations-material--docs', 'Foundations/Material', './docs/storybook/material.mdx'],
  ['foundations-motion--docs', 'Foundations/Motion', './docs/storybook/motion.mdx'],
  ['contributing--docs', 'Contributing', './docs/storybook/contributing.mdx']
];

function assertDocsIndex(index) {
  const docsIds = [...standaloneDocs.map(([id]) => id), 'atoms-gauge--docs'];
  assert.deepEqual(
    Object.values(index.entries)
      .filter(({ type }) => type === 'docs')
      .map(({ id }) => id)
      .sort(),
    [...docsIds].sort(),
    'The index must contain exactly seven standalone docs pages and Gauge autodocs'
  );
  for (const id of docsIds) {
    assert.equal(index.entries[id]?.id, id, `${id} must match its index key`);
    assert.equal(index.entries[id]?.type, 'docs', `${id} must be a docs entry`);
  }
  for (const [id, title, importPath] of standaloneDocs) {
    assert.equal(index.entries[id].title, title, `${id} must preserve its approved Meta title`);
    assert.equal(index.entries[id].importPath, importPath, `${id} must come from its approved MDX source`);
  }
}

function assertCatalog(catalogEntries, index) {
  assertDocsIndex(index);
  const byId = ([left], [right]) => left.localeCompare(right);
  assert.deepEqual(
    catalogEntries.map(({ id, name }) => [id, name]).sort(byId),
    [['atoms-gauge', 'Gauge'], ...standaloneDocs.map(([id, title]) => [id, title])].sort(byId),
    'The catalog must list exactly Gauge and the seven approved standalone docs pages'
  );
  // Only the exact, index-validated MDX allowlist is excluded from React availability.
  const standaloneIds = new Set(standaloneDocs.map(([id]) => id));
  const components = catalogEntries.filter(({ id }) => !standaloneIds.has(id));
  assert.deepEqual(
    components.map(({ id, name }) => ({ id, name })),
    [{ id: 'atoms-gauge', name: 'Gauge' }],
    'Gauge must remain the only React component'
  );
  return components.find(({ id, name }) => id === 'atoms-gauge' && name === 'Gauge');
}

function docsIndexFixture() {
  const entries = Object.fromEntries(
    standaloneDocs.map(([id, title, importPath]) => [id, { id, title, type: 'docs', importPath }])
  );
  entries['atoms-gauge--docs'] = { id: 'atoms-gauge--docs', type: 'docs' };
  entries['atoms-gauge--default'] = { id: 'atoms-gauge--default', type: 'story' };
  return { entries };
}

test('docs index contract accepts seven standalone pages and Gauge autodocs alongside stories', () => {
  assertDocsIndex(docsIndexFixture());
});

test('docs index contract rejects each missing documentation page', () => {
  for (const id of [...standaloneDocs.map(([id]) => id), 'atoms-gauge--docs']) {
    const index = docsIndexFixture();
    delete index.entries[id];
    assert.throws(() => assertDocsIndex(index), { code: 'ERR_ASSERTION' }, id);
  }
});

test('docs index contract rejects unexpected documentation pages', () => {
  const index = docsIndexFixture();
  index.entries['unexpected--docs'] = { id: 'unexpected--docs', type: 'docs' };
  assert.throws(() => assertDocsIndex(index), { code: 'ERR_ASSERTION' });
});

test('docs index contract rejects mismatched standalone titles', () => {
  for (const [id] of standaloneDocs) {
    const index = docsIndexFixture();
    index.entries[id].title = 'Unexpected title';
    assert.throws(() => assertDocsIndex(index), { code: 'ERR_ASSERTION' }, id);
  }
});

test('docs index contract rejects documentation entries with the wrong type', () => {
  for (const id of [...standaloneDocs.map(([id]) => id), 'atoms-gauge--docs']) {
    const index = docsIndexFixture();
    index.entries[id].type = 'story';
    assert.throws(() => assertDocsIndex(index), { code: 'ERR_ASSERTION' }, id);
  }
});

test('docs index contract rejects IDs that do not match their index keys', () => {
  const index = docsIndexFixture();
  const id = 'welcome--docs';
  index.entries['wrong-key--docs'] = index.entries[id];
  delete index.entries[id];
  assert.throws(() => assertDocsIndex(index), { code: 'ERR_ASSERTION' });
});

function catalogFixture() {
  return [
    { id: 'atoms-gauge', name: 'Gauge', storyId: 'atoms-gauge--default' },
    ...standaloneDocs.map(([id, name]) => ({ id, name, storyId: undefined }))
  ];
}

test('catalog contract accepts all eight docs entries and finds Gauge regardless of order', () => {
  for (const catalog of [catalogFixture(), catalogFixture().reverse()]) {
    assert.deepEqual(assertCatalog(catalog, docsIndexFixture()), {
      id: 'atoms-gauge',
      name: 'Gauge',
      storyId: 'atoms-gauge--default'
    });
  }
});

test('catalog contract rejects an unexpected React component', () => {
  const index = docsIndexFixture();
  index.entries['atoms-fake--default'] = { id: 'atoms-fake--default', type: 'story' };
  const catalog = [...catalogFixture(), { id: 'atoms-fake', name: 'Fake' }];
  assert.throws(() => assertCatalog(catalog, index), { code: 'ERR_ASSERTION' });
});

test('catalog contract rejects missing Gauge even when its autodocs remain indexed', () => {
  const catalog = catalogFixture().filter(({ id }) => id !== 'atoms-gauge');
  assert.throws(() => assertCatalog(catalog, docsIndexFixture()), { code: 'ERR_ASSERTION' });
});

test('catalog contract rejects each missing standalone listing', () => {
  for (const [missingId] of standaloneDocs) {
    const catalog = catalogFixture().filter(({ id }) => id !== missingId);
    assert.throws(() => assertCatalog(catalog, docsIndexFixture()), { code: 'ERR_ASSERTION' }, missingId);
  }
});

test('catalog contract rejects wrong listing IDs and titles', () => {
  for (const { id } of catalogFixture()) {
    for (const field of ['id', 'name']) {
      const catalog = catalogFixture();
      catalog.find((entry) => entry.id === id)[field] = 'unexpected';
      assert.throws(() => assertCatalog(catalog, docsIndexFixture()), { code: 'ERR_ASSERTION' }, id);
    }
  }
});

test('catalog contract rejects unknown MDX instead of excluding it as a component', () => {
  const index = docsIndexFixture();
  index.entries['unknown--docs'] = {
    id: 'unknown--docs',
    title: 'Unknown',
    type: 'docs',
    importPath: './docs/storybook/unknown.mdx'
  };
  const catalog = [...catalogFixture(), { id: 'unknown--docs', name: 'Unknown' }];
  assert.throws(() => assertCatalog(catalog, index), { code: 'ERR_ASSERTION' });
});

test('docs index contract rejects misclassified standalone sources', () => {
  for (const [id] of standaloneDocs) {
    for (const importPath of ['./packages/ui/Fake.stories.tsx', './docs/storybook/unknown.mdx', undefined]) {
      const index = docsIndexFixture();
      index.entries[id].importPath = importPath;
      assert.throws(() => assertDocsIndex(index), { code: 'ERR_ASSERTION' }, id);
    }
  }
});

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

test('docs-only MCP exposes seven guides, only Gauge as a component and eight valid story previews', {
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
  const catalogEntries = parseComponents(listing);
  const indexResponse = await request(new URL('/index.json', endpoint));
  assert.ok(indexResponse.ok, `Story index: HTTP ${indexResponse.status}`);
  const index = await indexResponse.json();
  const entry = assertCatalog(catalogEntries, index);
  assert.ok(entry?.storyId, `Gauge must advertise a story ID; docs-list returned:\n${listing}`);
  const docs = await call('docs-show', { id: entry.id });
  assert.match(docs, /#{2,6} Description/);
  assert.match(docs, /passive circular meter/);
  assert.match(docs, /label: string;/);
  assert.match(docs, /value: number;/);
  assert.match(docs, /Required non-empty accessible name/);
  assert.match(docs, /stateText/);
  const stories = [
    ['default', /required accessible name and measurement/],
    ['value-limits', /clamped geometry and accessible value/],
    ['decimal-value', /Fractional measurements remain decimal/],
    ['states', /consumer-selected conditions/],
    ['center-content', /centers are decorative/],
    ['contextual-value', /domain units/],
    ['invalid-value', /Non-finite inputs show readable fallback/],
    ['sizes', /custom 64\.5px stays fractional/]
  ];
  assert.deepEqual(
    Object.values(index.entries)
      .filter(({ type }) => type === 'story')
      .map(({ id }) => id)
      .sort(),
    stories.map(([name]) => `atoms-gauge--${name}`).sort()
  );
  for (const [name, description] of stories) {
    const storyId = `atoms-gauge--${name}`;
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
