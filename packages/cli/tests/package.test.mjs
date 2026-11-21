import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { readPackedManifest as packScriptReader } from '../../../scripts/lib/pack-packages.mjs';
import { readPackedManifest } from '../src/release.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('AC1 @egdev/cli ships bin egdev-ds, Node 24, no dependencies and a matching changelog', () => {
  const manifest = JSON.parse(read('../package.json'));
  assert.equal(manifest.name, '@egdev/cli');
  assert.equal(manifest.version, '0.2.0');
  assert.equal(manifest.type, 'module');
  assert.deepEqual(manifest.bin, { 'egdev-ds': './bin/egdev-ds.mjs' });
  assert.deepEqual(manifest.files, ['bin', 'src', 'types', 'CHANGELOG.md']);
  // S6 (#488): a type-only entry; there is no runtime module to import.
  assert.equal(manifest.types, './types/index.d.ts');
  assert.deepEqual(manifest.exports, {
    '.': { types: './types/index.d.ts' },
    './package.json': './package.json'
  });
  assert.equal(manifest.main, undefined);
  assert.deepEqual(manifest.engines, { node: '>=24.0.0 <25' });
  assert.equal(manifest.dependencies, undefined);
  assert.equal(manifest.devDependencies, undefined);
  assert.equal(manifest.scripts?.build, undefined, 'No build step: pnpm -r run build skips the package');
  const headings = read('../CHANGELOG.md')
    .split('\n')
    .filter((line) => /^##\s+\S/.test(line));
  assert.deepEqual(headings.slice(0, 2), ['## 0.2.0', '## 0.1.1']);
  const bin = read('../bin/egdev-ds.mjs');
  assert.ok(bin.startsWith('#!/usr/bin/env node\n'));
  assert.ok(statSync(new URL('../bin/egdev-ds.mjs', import.meta.url)).mode & 0o100, 'The bin is executable');
});

test('AC1 the packed-manifest reader has one owner shared with release:pack', () => {
  assert.equal(packScriptReader, readPackedManifest);
});
