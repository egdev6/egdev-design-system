import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadArtifact, versionBlock } from '../dist/artifact.js';

const path = new URL('../../system/design-system.json', import.meta.url);
const data = JSON.parse(readFileSync(path, 'utf8'));

test('loads the carrier artifact and preserves version identity', () => {
  assert.deepEqual(loadArtifact(path), data);
  assert.equal(
    JSON.stringify(versionBlock(data)),
    JSON.stringify({ name: data.name, schemaVersion: data.schemaVersion, packages: data.packages })
  );
});

test('startup fails closed with exact diagnostics for missing, malformed and incomplete artifacts', () => {
  const directory = mkdtempSync(join(tmpdir(), 'egdev-mcp-startup-'));
  try {
    const mcp = join(directory, 'node_modules/@egdev/mcp');
    const system = join(directory, 'node_modules/@egdev/system');
    mkdirSync(system, { recursive: true });
    mkdirSync(join(mcp, 'node_modules'), { recursive: true });
    cpSync(fileURLToPath(new URL('../dist/', import.meta.url)), join(mcp, 'dist'), { recursive: true });
    writeFileSync(join(mcp, 'package.json'), '{"type":"module"}');
    for (const dependency of ['@modelcontextprotocol', 'zod']) {
      symlinkSync(
        fileURLToPath(new URL(`../node_modules/${dependency}`, import.meta.url)),
        join(mcp, 'node_modules', dependency),
        'dir'
      );
    }
    writeFileSync(
      join(system, 'package.json'),
      '{"name":"@egdev/system","type":"module","exports":{".":"./render-system-md.mjs","./design-system.json":"./design-system.json"}}'
    );
    cpSync(
      fileURLToPath(new URL('../../system/src/render-system-md.mjs', import.meta.url)),
      join(system, 'render-system-md.mjs')
    );
    const artifactPath = join(system, 'design-system.json');
    const run = () => spawnSync(process.execPath, [join(mcp, 'dist/index.js')], { encoding: 'utf8', timeout: 5000 });
    const missing = run();
    assert.equal(missing.status, 1);
    assert.equal(missing.stdout, '');
    assert.equal(missing.stderr, `${artifactPath}: ENOENT: no such file or directory, open '${artifactPath}'\n`);
    writeFileSync(artifactPath, '{');
    const malformed = run();
    assert.equal(malformed.status, 1);
    assert.equal(malformed.stdout, '');
    assert.equal(
      malformed.stderr,
      `${artifactPath}: Expected property name or '}' in JSON at position 1 (line 1 column 2)\n`
    );
    writeFileSync(artifactPath, '{}');
    const incomplete = run();
    assert.equal(incomplete.status, 1);
    assert.equal(incomplete.stdout, '');
    assert.equal(incomplete.stderr, `${artifactPath}: missing or invalid name\n`);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('rejects missing, malformed and incomplete artifacts with their path', () => {
  for (const [file, read] of [
    [
      'missing.json',
      () => {
        throw new Error('missing');
      }
    ],
    ['bad.json', () => '{'],
    ['incomplete.json', () => '{}']
  ]) {
    assert.throws(
      () => loadArtifact(file, read),
      (error) => error.message.includes(file) && !error.message.includes('\n')
    );
  }
});
