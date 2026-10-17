import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as props from './prop-naming.mjs';

const { renderRegistry, runCli, validateRegistry } = props;
const root = fileURLToPath(new URL('../', import.meta.url));
const sourcePath = 'scripts/prop-naming.test.mjs';
const digest = (bytes) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const source = () => ({
  path: sourcePath,
  symbol: 'seed',
  revision: digest(fs.readFileSync(resolve(root, sourcePath)))
});
const seed = () => [
  {
    id: 'selected-value',
    name: 'value',
    meaning: 'Selected or displayed value.',
    whenToUse: 'Selection or measurement.',
    avoid: 'Visual treatment.',
    status: 'proposed',
    approval: null,
    aliases: [],
    exceptions: [],
    usages: [{ component: 'Example', type: 'string', status: 'existing', source: source() }]
  }
];
const validate = (registry, options = {}) => validateRegistry(registry, { root, ...options });
const entry = (overrides) => [{ ...seed()[0], ...overrides }];
const second = (overrides) => [...seed(), { ...seed()[0], id: 'other', name: 'other', usages: [], ...overrides }];
const usage = (overrides) => entry({ usages: [{ ...seed()[0].usages[0], ...overrides }] });
const evidence = (overrides) => usage({ source: { ...source(), ...overrides } });
const pendingException = (overrides = {}) => ({
  scope: 'Example',
  propName: 'selectedValue',
  reason: 'A separately reviewed component responsibility.',
  approval: null,
  ...overrides
});
const approval = (scope, contentHash) => ({
  reference: 'https://example.test/reviews/1#decision',
  scope,
  contentHash
});
function approve(entry, status = 'approved') {
  entry.status = status;
  entry.approval = approval(`convention:${entry.id}`, props.conventionHash(entry));
}
function approveException(entry, exception) {
  exception.approval = approval(
    `exception:${entry.id}:${exception.scope}:${exception.propName}`,
    props.exceptionHash(exception)
  );
}

test('seed and component-specific types are valid; importing performs no CLI work', () => {
  const registry = seed();
  registry[0].usages.push({ component: 'Gauge', type: 'number', status: 'proposed', source: source() });
  assert.doesNotThrow(() => validate(registry));
  assert.match(renderRegistry(registry), /number/);
});

test('registry keeps proposed conventions separate from reviewed implementation usage', () => {
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.ok(actual.every((entry) => entry.status === 'proposed' && entry.approval === null));
  const observed = actual.flatMap((entry) =>
    entry.usages.filter((usage) => usage.component === 'Gauge').map((usage) => [entry.name, usage])
  );
  const expected = {
    value: 'number',
    label: 'string',
    size: "GaugeSize | number (GaugeSize = 'sm' | 'md' | 'lg'; numeric CSS pixels, e.g. 64)",
    state: "GaugeState = 'normal' | 'warning' | 'critical' | 'muted' (GaugeStateProps union)",
    stateText: 'string (conditional requiredness in GaugeStateProps)',
    valueText: 'string',
    center: 'ReactNode',
    unavailableText: 'string'
  };
  assert.deepEqual(observed.map(([name]) => name).sort(), Object.keys(expected).sort());
  for (const [name, usage] of observed) {
    assert.equal(usage.type, expected[name]);
    assert.equal(usage.status, 'existing');
    assert.equal(usage.source.path, 'packages/ui/src/atoms/gauge/types.ts');
    assert.equal(usage.source.symbol, 'GaugeProps');
    assert.equal(usage.source.revision, digest(fs.readFileSync(resolve(root, usage.source.path))));
  }
});

test('promoting observed usage to existing does not approve or change its proposed convention', () => {
  const registry = seed();
  const entry = registry[0];
  entry.usages[0].status = 'proposed';
  const before = props.conventionHash(entry);
  entry.usages[0].status = 'existing';
  assert.doesNotThrow(() => validate(registry));
  assert.equal(entry.status, 'proposed');
  assert.equal(entry.approval, null);
  assert.equal(props.conventionHash(entry), before);
  assert.match(renderRegistry(registry), /proposed; None recorded/);
});

for (const status of ['approved', 'deprecated']) {
  test(`${status} requires approval; synthetic scoped content-bound approval is accepted without proving consent`, () => {
    const registry = seed();
    registry[0].status = status;
    assert.throws(() => validate(registry), /approval/i);
    delete registry[0].approval;
    assert.throws(() => validate(registry), /approval/i);
    approve(registry[0], status);
    assert.doesNotThrow(() => validate(registry));
  });
}

for (const [field, value] of [
  ['reference', ' '],
  ['reference', 'approved by someone'],
  ['reference', 'http://example.test/review/1'],
  ['reference', 'https://user:password@example.test/review/1'],
  ['reference', '../approval.md'],
  ['reference', '/outside/approval.md'],
  ['reference', 'scripts/missing-approval.md'],
  ['scope', ' '],
  ['scope', 'convention:another-id'],
  ['contentHash', ' '],
  ['contentHash', 'sha256:invalid'],
  ['contentHash', `sha256:${'0'.repeat(64)}`]
]) {
  test(`rejects invalid approval ${field}: ${value}`, () => {
    const registry = seed();
    approve(registry[0]);
    registry[0].approval[field] = value;
    assert.throws(() => validate(registry));
  });
}

test('local approval references must resolve inside the repository; proposed entries cannot claim approval', () => {
  const registry = seed();
  approve(registry[0]);
  registry[0].approval.reference = `${sourcePath}#review-record`;
  assert.doesNotThrow(() => validate(registry));
  const io = {
    ...fs,
    realpathSync: (path) => (path === resolve(root, sourcePath) ? '/outside/approval' : fs.realpathSync(path))
  };
  assert.throws(() => validate(registry, { io }), /outside/);
  registry[0].status = 'proposed';
  assert.throws(() => validate(registry), /approval/i);
});

test('convention hashes have a fixed canonical definition, no approval/usage dependency and no array-order dependency', () => {
  const registry = seed();
  const e = registry[0];
  const canonical = {
    aliases: [],
    avoid: e.avoid,
    exceptions: [],
    id: e.id,
    meaning: e.meaning,
    name: e.name,
    status: e.status,
    whenToUse: e.whenToUse
  };
  assert.equal(props.conventionHash(e), digest(JSON.stringify(canonical)));
  e.aliases = ['z', 'a'];
  e.exceptions = [pendingException(), pendingException({ scope: 'Other', reason: 'Other reason.' })];
  approve(e);
  const before = props.conventionHash(e);
  e.approval.reference = 'https://example.test/reviews/2';
  e.usages.push({ component: 'Other', type: 'number', status: 'proposed', source: source() });
  approveException(e, e.exceptions[0]);
  e.aliases.reverse();
  e.exceptions.reverse();
  assert.equal(props.conventionHash(e), before);
  assert.doesNotThrow(() => validate(registry));
});

for (const key of ['id', 'name', 'meaning', 'whenToUse', 'avoid', 'status', 'aliases', 'exceptions']) {
  test(`approval goes stale when convention ${key} changes`, () => {
    const registry = seed();
    approve(registry[0]);
    const e = registry[0];
    if (key === 'aliases') {
      e.aliases.push('selected');
    } else if (key === 'exceptions') {
      e.exceptions.push(pendingException());
    } else if (key === 'status') {
      e.status = 'deprecated';
    } else {
      e[key] += 'Changed';
    }
    assert.throws(() => validate(registry), /approval/i);
  });
}

const invalid = [
  ['canonical name case collision', second({ name: 'VALUE' })],
  ['semantic ID collision', second({ id: 'SELECTED-VALUE' })],
  ['duplicate alias', entry({ aliases: ['selected', 'SELECTED'] })],
  ['alias canonical collision', entry({ aliases: ['VALUE'] })],
  [
    'cross-entry alias collision',
    [...entry({ aliases: ['selected'] }), ...entry({ id: 'other', name: 'other', aliases: ['SELECTED'] })]
  ],
  ['alias collides with later canonical', [...entry({ aliases: ['other'] }), ...entry({ id: 'other', name: 'OTHER' })]],
  ['duplicate component usage', entry({ usages: [seed()[0].usages[0], { ...seed()[0].usages[0], type: 'number' }] })],
  ['cross-entry public usage', second({ aliases: ['value'] })],
  ['missing source', evidence({ path: 'scripts/missing-prop-evidence.mjs' })],
  ['traversal', evidence({ path: 'scripts/../package.json' })],
  ['absolute source', evidence({ path: resolve(root, sourcePath) })],
  ['directory source', evidence({ path: 'scripts' })],
  ['backslash source', evidence({ path: 'scripts\\evidence' })],
  ['legacy string source', usage({ source: sourcePath })],
  ['absent source object', usage({ source: undefined })],
  ['missing source path', usage({ source: { symbol: 'ExampleProps', revision: source().revision } })],
  ['missing symbol', usage({ source: { path: sourcePath, revision: source().revision } })],
  ['empty symbol', evidence({ symbol: ' ' })],
  ['missing revision', usage({ source: { path: sourcePath, symbol: 'ExampleProps' } })],
  ['non-hash revision', evidence({ revision: 'HEAD' })],
  ['wrong file hash', evidence({ revision: `sha256:${'0'.repeat(64)}` })],
  ['bad convention status', entry({ status: 'existing' })],
  ['bad usage status', usage({ status: 'approved' })],
  ['empty type', usage({ type: ' ' })],
  ['empty meaning', entry({ meaning: '' })],
  ['unscoped exception', entry({ exceptions: [pendingException({ scope: '' })] })],
  ['wildcard exception scope', entry({ exceptions: [pendingException({ scope: '*' })] })],
  ['empty reason', entry({ exceptions: [pendingException({ reason: ' ' })] })],
  ['missing alternative prop name', entry({ exceptions: [{ scope: 'Example', reason: 'Reason.', approval: null }] })],
  ['invalid alternative prop name', entry({ exceptions: [pendingException({ propName: 'not-a-prop' })] })],
  ['same alternative as canonical', entry({ exceptions: [pendingException({ propName: 'VALUE' })] })],
  [
    'missing exception approval',
    entry({ exceptions: [{ scope: 'Example', propName: 'selected', reason: 'Reason.' }] })
  ],
  ['missing aliases', entry({ aliases: undefined })],
  ['extra entry field', entry({ invented: true })],
  ['extra source field', evidence({ invented: true })],
  ['invalid object', [null]]
];
for (const [name, registry] of invalid) {
  test(`rejects ${name}`, () => assert.throws(() => validate(registry)));
}

test('rejects malformed schema and symlink evidence outside root before reading', () => {
  for (const registry of [null, {}, [], [42]]) {
    assert.throws(() => validate(registry));
  }
  const io = {
    ...fs,
    readFileSync: () => assert.fail('must not read escaping evidence'),
    realpathSync: (path) => (path === resolve(root, sourcePath) ? '/outside/evidence' : fs.realpathSync(path))
  };
  assert.throws(() => validate(seed(), { io }), /outside/);
});

test('pending and approved exceptions bind component, alternative prop name and reason without global alias promotion', () => {
  const registry = seed();
  const exception = pendingException();
  registry[0].exceptions.push(exception);
  assert.doesNotThrow(() => validate(registry));
  assert.match(renderRegistry(registry), /Pending exception \(Example → selectedValue\)/);
  assert.deepEqual(registry[0].aliases, []);
  assert.equal(
    props.exceptionHash(exception),
    digest(
      JSON.stringify({
        propName: exception.propName,
        reason: exception.reason,
        scope: exception.scope
      })
    )
  );
  approveException(registry[0], exception);
  assert.doesNotThrow(() => validate(registry));
  assert.match(renderRegistry(registry), /Approved exception \(Example → selectedValue\)/);
  for (const key of ['scope', 'propName', 'reason']) {
    const changed = structuredClone(registry);
    changed[0].exceptions[0][key] += 'Changed';
    assert.throws(() => validate(changed), /approval/i);
  }
  for (const field of ['reference', 'scope', 'contentHash']) {
    const changed = structuredClone(registry);
    changed[0].exceptions[0].approval[field] = '';
    assert.throws(() => validate(changed), /approval/i);
  }
  exception.approval.scope = 'convention:selected-value';
  assert.throws(() => validate(registry), /approval/i);
});

test('approved alternative conflicts are component-scoped; pending exceptions grant no API permission', () => {
  const registry = second({ name: 'selectedValue' });
  const exception = pendingException();
  registry[0].exceptions.push(exception);
  registry[1].usages = [{ ...seed()[0].usages[0] }];
  assert.doesNotThrow(() => validate(registry));
  approveException(registry[0], exception);
  assert.throws(() => validate(registry), /public usage/i);
  registry[1].usages[0].component = 'Other';
  assert.doesNotThrow(() => validate(registry));
  registry.reverse();
  assert.doesNotThrow(() => validate(registry));
  registry[0].name = 'otherValue';
  registry[0].exceptions.push(pendingException({ propName: 'SELECTEDVALUE' }));
  approveException(registry[0], registry[0].exceptions[0]);
  assert.throws(() => validate(registry), /public usage/i);
});

test('duplicate scoped exceptions are rejected case-insensitively, not made global aliases', () => {
  const registry = seed();
  registry[0].exceptions = [pendingException(), pendingException({ scope: 'EXAMPLE', propName: 'SELECTEDVALUE' })];
  assert.throws(() => validate(registry), /duplicate/i);
  registry[0].exceptions[1].scope = 'Other';
  registry[0].aliases = ['selectedValue'];
  assert.doesNotThrow(() => validate(registry));
});

test('view is stable across ordering, escapes Markdown and displays approval and source evidence as text', () => {
  const registry = seed();
  registry[0].aliases = ['z', 'a'];
  registry[0].exceptions = [
    pendingException({ scope: 'Z', reason: 'Z reason' }),
    pendingException({ scope: 'A', reason: 'A | reason' })
  ];
  approveException(registry[0], registry[0].exceptions[0]);
  approve(registry[0]);
  registry[0].usages.push({ component: 'Another', type: 'number | null', status: 'proposed', source: source() });
  registry.push({ ...seed()[0], id: 'size', name: 'size', usages: [] });
  const before = renderRegistry(registry);
  registry.reverse();
  for (const entry of registry) {
    for (const key of ['usages', 'aliases', 'exceptions']) {
      entry[key].reverse();
    }
  }
  assert.equal(renderRegistry(registry), before);
  assert.match(before, /number &#124; null/);
  assert.match(before, /A &#124; reason/);
  assert.ok(before.includes(registry[1].approval.reference));
  assert.ok(before.includes(registry[1].approval.scope));
  assert.ok(before.includes(registry[1].approval.contentHash));
  assert.ok(before.includes(sourcePath));
  assert.ok(before.includes(source().revision));
  assert.doesNotMatch(before, /\[object Object\]/);
  assert.ok(before.includes('`convention:<entry.id>`'));
  assert.ok(before.includes('`exception:<entry.id>:<scope>:<propName>`'));
});

function fixture(overrides = {}) {
  const registryPath = 'skills/_shared/prop-naming.json';
  const outputPath = 'docs/prop-naming.md';
  const files = new Map([
    [resolve(root, registryPath), JSON.stringify(seed())],
    [resolve(root, outputPath), 'stale\n'],
    [resolve(root, sourcePath), fs.readFileSync(resolve(root, sourcePath))]
  ]);
  const writes = [];
  const messages = [];
  const io = {
    ...fs,
    readFileSync: (path) => {
      assert.ok(files.has(path), `Unexpected fixture read: ${path}`);
      return files.get(path);
    },
    writeFileSync: (path, text) => {
      assert.equal(path, resolve(root, outputPath));
      writes.push(path);
      files.set(path, text);
    },
    ...overrides
  };
  const run = (args) => runCli(args, { root, registryPath, outputPath, io, log: (text) => messages.push(text) });
  return { files, writes, messages, run, registry: resolve(root, registryPath), output: resolve(root, outputPath) };
}

test('CLI check fails stale without writes, write regenerates only view, default check succeeds', () => {
  const f = fixture();
  const original = f.files.get(f.registry);
  assert.equal(f.run(['--check']), 1);
  assert.equal(f.files.get(f.output), 'stale\n');
  assert.deepEqual(f.writes, []);
  assert.match(f.messages.join('\n'), /stale/i);
  assert.equal(f.run(['--write']), 0);
  assert.equal(f.files.get(f.output), renderRegistry(seed()));
  assert.deepEqual(f.writes, [f.output]);
  assert.equal(f.files.get(f.registry), original);
  assert.equal(f.run([]), 0);
  assert.match(f.messages.join('\n'), /up to date/i);
});

test('stale source evidence fails both modes without refreshing JSON or generated view', () => {
  const f = fixture();
  f.files.set(resolve(root, sourcePath), 'Changed file, even outside the reviewed symbol.');
  const before = new Map(f.files);
  for (const args of [['--check'], ['--write'], []]) {
    assert.equal(f.run(args), 1);
  }
  assert.match(f.messages.join('\n'), /revision/i);
  assert.deepEqual(f.writes, []);
  assert.deepEqual(f.files, before);
});

test('stale approval fails both modes without refreshing approval or generated view', () => {
  const f = fixture();
  const registry = seed();
  approve(registry[0]);
  registry[0].meaning += ' Changed.';
  f.files.set(f.registry, JSON.stringify(registry));
  const before = new Map(f.files);
  assert.equal(f.run(['--check']), 1);
  assert.equal(f.run(['--write']), 1);
  assert.match(f.messages.join('\n'), /approval/i);
  assert.deepEqual(f.writes, []);
  assert.deepEqual(f.files, before);
});

test('output symlinks cannot redirect regeneration to another repository file', () => {
  const f = fixture({
    realpathSync: (path) =>
      path === resolve(root, 'docs/prop-naming.md') ? resolve(root, sourcePath) : fs.realpathSync(path)
  });
  assert.equal(f.run(['--write']), 1);
  assert.deepEqual(f.writes, []);
});

test('invalid registry, unknown flags and escaping output never write', () => {
  const f = fixture();
  assert.equal(f.run(['--unknown']), 1);
  assert.equal(f.run(['--check', '--write']), 1);
  f.files.set(f.registry, '[{}]');
  assert.equal(f.run(['--write']), 1);
  f.files.set(f.registry, 'not json');
  assert.equal(f.run(['--write']), 1);
  assert.deepEqual(f.writes, []);
  assert.equal(runCli(['--write'], { root, outputPath: '../escape.md', log: (text) => f.messages.push(text) }), 1);
  const result = spawnSync(process.execPath, ['scripts/prop-naming.mjs', '--unknown'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown/i);
});
