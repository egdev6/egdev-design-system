import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const version = JSON.parse(readFileSync(join(root, 'packages/system/package.json'), 'utf8')).version;
const tarball = join(root, 'release', `egdev-system-${version}.tgz`);

test('installed tarball writes a current regular design system', { timeout: 120_000 }, () => {
  assert.ok(existsSync(tarball), `Run pnpm release:pack first: ${tarball}`);
  const consumer = mkdtempSync(join(tmpdir(), 'egdev-system-consumer-'));
  let succeeded = false;
  try {
    writeFileSync(join(consumer, 'package.json'), '{"name":"consumer","private":true}\n');
    const install = spawnSync('pnpm', ['add', '--offline', tarball], {
      cwd: consumer,
      encoding: 'utf8',
      timeout: 100_000
    });
    assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);
    const source = join(consumer, 'tokens.css');
    writeFileSync(source, ':root { --consumer-token: 1px; }\n');
    const old = new Date(Date.now() - 2000);
    // Make the source older without relying on filesystem timestamp resolution.
    utimesSync(source, old, old);
    assert.ok(statSync(source).mtimeMs <= old.getTime());
    const bin = join(consumer, 'node_modules/.bin/egdev-system-md');
    const run = spawnSync(bin, ['--write'], { cwd: consumer, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const output = join(consumer, 'design/system.md');
    assert.ok(lstatSync(output).isFile());
    assert.ok(!relative(join(consumer, 'design'), realpathSync(output)).startsWith('..'));
    assert.ok(statSync(output).mtimeMs > statSync(source).mtimeMs);
    assert.match(run.stdout, /design\/system\.md/);
    succeeded = true;
    if (process.env.EGDEV_SYSTEM_MD_KEEP_CONSUMER === '1') {
      console.log(`Consumer retained for gentle-design observation: ${consumer}`);
      console.log(run.stdout.trim());
    }
  } finally {
    if (!succeeded || process.env.EGDEV_SYSTEM_MD_KEEP_CONSUMER !== '1') {
      rmSync(consumer, { recursive: true, force: true });
    }
  }
});
