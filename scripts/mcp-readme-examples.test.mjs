import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { excerptCharacters, refreshReadme, runCli } from './mcp-readme-examples.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = fileURLToPath(new URL('./mcp-readme-examples.mjs', import.meta.url));
const readmePath = join(root, 'packages/mcp/README.md');
const committed = readFileSync(readmePath, 'utf8');
const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex');
const fence = '```';
const usage = 'Usage: node scripts/mcp-readme-examples.mjs --write|--check';

// A small README with the same markers as the real one: a version sentence, a complete example, an excerpt
// example and an error example that has no digest.
const fixture = [
  '# Fixture',
  '',
  'These examples use `@egdev/mcp` 0.0.1 and `@egdev/system` 0.0.2 from the same release. Keep this text.',
  '',
  '<!-- mcp-example:get_tokens -->',
  'Request:',
  '',
  `${fence}json mcp-request`,
  '{',
  '  "name": "get_tokens",',
  '  "arguments": { "group": "root" }',
  '}',
  fence,
  '',
  'Complete success response:',
  '',
  `${fence}json mcp-response`,
  '{ "stale": true }',
  fence,
  `<!-- mcp-response-sha256: ${'0'.repeat(64)} -->`,
  '<!-- /mcp-example:get_tokens -->',
  '',
  '<!-- mcp-example:get_design_system_md -->',
  'Request:',
  '',
  `${fence}json mcp-request`,
  '{ "name": "get_design_system_md", "arguments": {} }',
  fence,
  '',
  'Success response excerpt:',
  '',
  `${fence}json mcp-response-excerpt`,
  '{ "stale": true }',
  fence,
  `<!-- mcp-response-sha256: ${'1'.repeat(64)} -->`,
  '<!-- /mcp-example:get_design_system_md -->',
  '',
  '<!-- mcp-example:get_component_unknown -->',
  'Request:',
  '',
  `${fence}json mcp-request`,
  '{ "name": "get_component", "arguments": { "name": "absent" } }',
  fence,
  '',
  `${fence}json mcp-response`,
  '{ "isError": true, "content": [{ "type": "text", "text": "Unknown component: absent" }] }',
  fence,
  '<!-- /mcp-example:get_component_unknown -->',
  ''
].join('\n');
const versions = { mcp: '1.2.3', system: '4.5.6' };
const identity = '{"name":"fixture","packages":[{"name":"@egdev/ui","version":"9.9.9"}]}';
// `$&` and `$1` are replacement patterns for String.replace: they must come through literally.
const tokensText = JSON.stringify({ designSystem: JSON.parse(identity), tokens: [{ name: '--a', value: '$&-$1' }] });
const systemMdText = `{"designSystem":${identity},"systemMd":"${'0123456789'.repeat(20)}"}`;
const results = new Map([
  ['get_tokens', { content: [{ type: 'text', text: tokensText }] }],
  ['get_design_system_md', { content: [{ type: 'text', text: systemMdText }] }]
]);
const fakeCall = async ({ name }) => results.get(name);

function tempReadme(contents) {
  const dir = mkdtempSync(join(tmpdir(), 'egdev-mcp-readme-'));
  const path = join(dir, 'README.md');
  writeFileSync(path, contents);
  return { dir, path };
}

test('refreshes the versions, responses and digests and leaves the error example alone', async () => {
  const output = await refreshReadme(fixture, { versions, call: fakeCall });
  assert.ok(
    output.includes(
      'These examples use `@egdev/mcp` 1.2.3 and `@egdev/system` 4.5.6 from the same release. Keep this text.'
    )
  );
  const response = `${fence}json mcp-response\n${JSON.stringify(results.get('get_tokens'), null, 2)}\n${fence}`;
  assert.ok(output.includes(response), 'the complete response is the pretty-printed server result');
  assert.ok(output.includes(`<!-- mcp-response-sha256: ${sha256(tokensText)} -->`));
  assert.ok(output.includes('"text": "{\\"designSystem\\"'), 'the serialized text stays an escaped string');
  assert.ok(output.includes('$&-$1'), 'replacement patterns in a response stay literal');
  const errorExample = fixture.slice(fixture.indexOf('<!-- mcp-example:get_component_unknown -->'));
  assert.ok(output.endsWith(errorExample), 'the digest-less error example is byte-identical');
  assert.ok(output.startsWith('# Fixture\n\nThese examples use'));
});

test('cuts the systemMd excerpt after the identity prefix and digests the complete text', async () => {
  const output = await refreshReadme(fixture, { versions, call: fakeCall });
  const prefix = systemMdText.slice(0, systemMdText.indexOf('"systemMd":"') + '"systemMd":"'.length);
  const shown = systemMdText.slice(0, prefix.length + excerptCharacters);
  assert.ok(shown.length < systemMdText.length);
  const excerpt = `${fence}json mcp-response-excerpt\n${JSON.stringify({ content: [{ type: 'text', text: shown }] }, null, 2)}\n${fence}`;
  assert.ok(output.includes(excerpt), 'the excerpt keeps the identity and a fixed slice of systemMd');
  assert.ok(output.includes(`<!-- mcp-response-sha256: ${sha256(systemMdText)} -->`));
  assert.ok(!output.includes(systemMdText), 'the complete response is not printed');
});

test('is idempotent: refreshing a refreshed README changes nothing', async () => {
  const once = await refreshReadme(fixture, { versions, call: fakeCall });
  const twice = await refreshReadme(once, { versions, call: fakeCall });
  assert.equal(twice, once);
});

test('refuses to write an example it cannot reproduce faithfully', async () => {
  const call = fakeCall;
  await assert.rejects(
    refreshReadme(fixture.replace('These examples use', 'These samples use'), { versions, call }),
    /version sentence/
  );
  await assert.rejects(
    refreshReadme(fixture, {
      versions,
      call: async () => ({ isError: true, content: [{ type: 'text', text: 'Unknown component: x' }] })
    }),
    /get_tokens.*error/
  );
  await assert.rejects(
    refreshReadme(fixture, {
      versions,
      call: async ({ name }) =>
        name === 'get_design_system_md'
          ? { content: [{ type: 'text', text: '{"designSystem":{},"systemMd":"short"}' }] }
          : results.get(name)
    }),
    /get_design_system_md.*excerpt/
  );
  await assert.rejects(
    refreshReadme(
      fixture.replace(`${fence}json mcp-request\n{\n  "name": "get_tokens"`, `${fence}json\n{\n  "name": "get_tokens"`),
      {
        versions,
        call
      }
    ),
    /get_tokens.*request/
  );
});

test('the committed README is a fixed point of the generator over the real stdio server', async () => {
  const messages = [];
  assert.equal(await runCli(['--check'], { log: (message) => messages.push(message) }), 0);
  assert.deepEqual(messages, ['MCP README examples are up to date.']);
  assert.equal(readFileSync(readmePath, 'utf8'), committed, '--check never writes');
});

test('--check reports a stale copy without writing and --write restores the committed bytes', async () => {
  const stale = committed
    .replace(/(`@egdev\/mcp` )\S+( and `@egdev\/system` )\S+/, (_match, mcp, system) => `${mcp}0.0.1${system}0.0.2`)
    .replace(/<!-- mcp-response-sha256: [a-f0-9]{64} -->/, `<!-- mcp-response-sha256: ${'f'.repeat(64)} -->`)
    .replace('"name\\":\\"AspectRatio\\"', '"name\\":\\"Changed\\"');
  assert.notEqual(stale, committed);
  const { dir, path } = tempReadme(stale);
  try {
    const messages = [];
    const log = (message) => messages.push(message);
    assert.equal(await runCli(['--check'], { readmePath: path, log }), 1);
    assert.deepEqual(messages, ['MCP README examples are stale; run pnpm mcp:readme.']);
    assert.equal(readFileSync(path, 'utf8'), stale, '--check never writes');
    messages.length = 0;
    assert.equal(await runCli(['--write'], { readmePath: path, log }), 0);
    assert.deepEqual(messages, ['MCP README examples regenerated.']);
    assert.equal(readFileSync(path, 'utf8'), committed, 'regeneration reproduces the committed README');
    messages.length = 0;
    assert.equal(await runCli(['--write'], { readmePath: path, log }), 0);
    assert.deepEqual(messages, ['MCP README examples are already up to date.']);
    assert.equal(readFileSync(path, 'utf8'), committed);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('rejects missing, unknown and conflicting flags with the usage line and reads nothing', async () => {
  for (const args of [[], ['--bogus'], ['--write', '--check'], ['--check', '--check']]) {
    const messages = [];
    const code = await runCli(args, {
      readmePath: join(tmpdir(), 'egdev-mcp-readme-never-read.md'),
      log: (message) => messages.push(message)
    });
    assert.equal(code, 1, args.join(' '));
    assert.deepEqual(messages, [usage], args.join(' '));
  }
});

test('the command line reports through its exit code', () => {
  const run = (args) =>
    spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: 'utf8', timeout: 60_000 });
  const ok = run(['--check']);
  assert.equal(ok.status, 0, ok.stderr);
  assert.equal(ok.stderr.trim(), 'MCP README examples are up to date.');
  const bad = run([]);
  assert.equal(bad.status, 1);
  assert.equal(bad.stderr.trim(), usage);
  assert.equal(readFileSync(readmePath, 'utf8'), committed);
});

test('the package script builds the server before it regenerates the README', () => {
  const { scripts } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.equal(
    scripts['mcp:readme'],
    'pnpm --filter @egdev/mcp run build && node scripts/mcp-readme-examples.mjs --write'
  );
  assert.match(scripts['test:mcp'], /^pnpm --filter @egdev\/mcp run build && node --test /);
  assert.ok(scripts['test:mcp'].includes('packages/mcp/tests/*.test.mjs'));
  assert.ok(scripts['test:mcp'].includes('scripts/mcp-readme-examples.test.mjs'), 'CI runs this test through test:mcp');
});
