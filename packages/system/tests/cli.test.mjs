import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../src/cli.mjs', import.meta.url));
test('CLI writes, checks, refreshes and rejects unsafe targets', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'system-cli-'));
  const run = (...args) => spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
  try {
    const target = join(cwd, 'design/system.md');
    const stale = run('--check');
    assert.equal(stale.status, 1);
    assert.equal(stale.stderr, `Stale: ${target}; run --write.\n`);
    const first = run('--write');
    assert.equal(first.status, 0);
    assert.equal(first.stderr, '');
    assert.match(first.stdout, /^.+design\/system\.md: @egdev\/effects@/);
    const bytes = readFileSync(target, 'utf8');
    const firstTime = lstatSync(target).mtimeMs;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 30);
    assert.equal(run('--write').status, 0);
    assert.ok(lstatSync(target).mtimeMs > firstTime);
    assert.equal(readFileSync(target, 'utf8'), bytes);
    const checked = run('--check');
    assert.equal(checked.status, 0);
    assert.equal(checked.stdout, '');
    assert.equal(checked.stderr, '');
    const badArgument = run('--write', '--unknown');
    assert.equal(badArgument.status, 1);
    assert.equal(badArgument.stdout, '');
    assert.equal(badArgument.stderr, 'Usage: egdev-system-md --write|--check [--file <path>]\n');
    assert.equal(readFileSync(target, 'utf8'), bytes);
    const nested = run('--write', '--file', 'design/sub/custom.md');
    assert.equal(nested.status, 0);
    assert.equal(readFileSync(join(cwd, 'design/sub/custom.md'), 'utf8'), bytes);
    const outside = join(cwd, 'outside');
    writeFileSync(outside, 'unchanged');
    symlinkSync(outside, join(cwd, 'design/link'));
    linkSync(outside, join(cwd, 'design/hard'));
    for (const path of ['design/link', 'design/hard', outside, 'design/sub']) {
      const rejected = run('--write', '--file', path);
      assert.equal(rejected.status, 1);
      assert.equal(rejected.stdout, '');
      assert.equal(rejected.stderr, `Unsafe target: ${path.startsWith('/') ? path : join(cwd, path)}\n`);
    }
    assert.equal(readFileSync(outside, 'utf8'), 'unchanged');
    const isolated = join(cwd, 'isolated');
    mkdirSync(isolated);
    cpSync(new URL('../src', import.meta.url), join(isolated, 'src'), { recursive: true });
    const missing = spawnSync(process.execPath, [join(isolated, 'src/cli.mjs'), '--write'], { cwd, encoding: 'utf8' });
    assert.equal(missing.status, 1);
    assert.equal(missing.stdout, '');
    assert.equal(missing.stderr.trim().split('\n').length, 1);
    assert.match(missing.stderr, /ENOENT/);
    assert.equal(readFileSync(target, 'utf8'), bytes);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
