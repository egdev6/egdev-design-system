import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderSystemMd } from '../packages/system/src/render-system-md.mjs';

const artifact = JSON.parse(readFileSync(new URL('../packages/system/design-system.json', import.meta.url), 'utf8'));
const golden = readFileSync(new URL('../packages/system/system.md', import.meta.url), 'utf8');
test('golden matches and detects artifact changes', () => {
  assert.equal(renderSystemMd(artifact), golden);
  for (const key of ['tokens', 'components', 'materialRecipes']) {
    const copy = structuredClone(artifact);
    if (key === 'components') {
      const row = copy.catalog.find((item) => item.available && !item.name.includes('/'));
      copy.components = copy.components.filter((component) => component.name !== row.name);
    } else {
      copy[key].shift();
    }
    assert.notEqual(renderSystemMd(copy), golden, key);
  }
  const copy = structuredClone(artifact);
  copy.tokens[0].value += '-changed';
  assert.notEqual(renderSystemMd(copy), golden);
});
test('output provenance and token references are traceable to the artifact', () => {
  const names = new Set(artifact.tokens.map((token) => token.name));
  for (const token of artifact.tokens) {
    assert.ok(golden.includes(token.name));
    assert.ok(golden.includes(token.value.replaceAll('|', '\\|').replaceAll('\n', ' ')));
  }
  for (const name of golden.match(/--[a-zA-Z][\w-]*/g) ?? []) {
    assert.ok(name === '--write' || names.has(name), `Unknown token: ${name}`);
  }
  for (const recipe of artifact.materialRecipes) {
    assert.ok(golden.includes(recipe.id));
    assert.ok(golden.includes(recipe.semantics));
  }
  for (const row of artifact.catalog) {
    assert.ok(golden.includes(row.name));
  }
  for (const source of [
    'tokens[] · packages/tokens/src/theme.css',
    'materialRecipes[] · docs/MATERIAL.md',
    'catalog[] · docs/catalog.json',
    'propNaming[] · skills/_shared/prop-naming.json'
  ]) {
    assert.ok(golden.includes(source));
  }
});

test('same artifact renders identically in different cwd and environment', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'system-determinism-'));
  try {
    const moduleUrl = pathToFileURL(
      fileURLToPath(new URL('../packages/system/src/render-system-md.mjs', import.meta.url))
    ).href;
    const artifactPath = fileURLToPath(new URL('../packages/system/design-system.json', import.meta.url));
    const code = `import {readFileSync} from 'node:fs'; import {renderSystemMd} from ${JSON.stringify(moduleUrl)}; process.stdout.write(renderSystemMd(JSON.parse(readFileSync(${JSON.stringify(artifactPath)}, 'utf8'))));`;
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', code], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, ['TZ']: 'UTC', ['LANG']: 'C', ['LC_ALL']: 'C' }
    });
    assert.equal(child.status, 0, child.stderr);
    assert.equal(child.stderr, '');
    assert.equal(child.stdout, golden);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('consumer CLI reports a stale file after an artifact token value changes', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'system-drift-'));
  try {
    const pkg = join(cwd, 'package');
    mkdirSync(pkg);
    cpSync(new URL('../packages/system/src', import.meta.url), join(pkg, 'src'), { recursive: true });
    const changed = structuredClone(artifact);
    changed.tokens[0].value += '-changed';
    writeFileSync(join(pkg, 'design-system.json'), JSON.stringify(changed));
    mkdirSync(join(cwd, 'design'));
    const target = join(cwd, 'design/system.md');
    writeFileSync(target, golden);
    const result = spawnSync(process.execPath, [join(pkg, 'src/cli.mjs'), '--check'], { cwd, encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, `Stale: ${target}; run --write.\n`);
    assert.equal(readFileSync(target, 'utf8'), golden);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('repository check succeeds', () => {
  const result = spawnSync(process.execPath, ['scripts/system-md.mjs', '--check'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});
