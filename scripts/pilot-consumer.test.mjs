import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = fileURLToPath(new URL('./pilot-consumer.mjs', import.meta.url));

function run(env = {}) {
  return spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: 'utf8',
    timeout: 300_000,
    maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, ...env }
  });
}

function report(output) {
  const line = output.split('\n').find((item) => item.startsWith('PILOT_REPORT '));
  assert.ok(line, `missing report: ${output}`);
  return JSON.parse(line.slice('PILOT_REPORT '.length));
}

test('isolated tarball consumer builds both documented modes and the public page', { timeout: 300_000 }, () => {
  const result = run();
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.equal(result.stderr, '');
  const data = report(result.stdout);
  assert.equal(existsSync(data.temporary), false, 'temporary consumer must be removed');
  for (const name of ['tokens', 'ui', 'effects']) {
    assert.match(data.packages[name].specifier, /^file:.*\.tgz$/);
    assert.ok(!data.packages[name].realpath.startsWith(`${root}/`));
    assert.ok(data.packages[name].version);
  }
  assert.match(data.html, /class="[^"]*eg-web-template/);
  assert.equal((data.html.match(/class="[^"]*eg-web-section/g) ?? []).length, 2);
  for (const marker of ['eg-tabs', 'eg-chip-group', 'eg-field', 'eg-notice', 'eg-list-item']) {
    assert.ok(data.html.includes(marker), `rendered HTML missing ${marker}`);
  }
  assert.equal((data.html.match(/<main\b/g) ?? []).length, 1);
  for (const mode of ['tailwind', 'native']) {
    assert.ok(data.builds[mode].cssBytes > 0);
    assert.ok(data.builds[mode].jsBytes > 0);
    assert.equal(data.builds[mode].themeBlock, false);
    for (const marker of [
      'eg-web-template',
      'eg-web-section',
      'eg-tabs',
      'eg-chip-group',
      'eg-field',
      'eg-notice',
      'eg-list-item'
    ]) {
      assert.ok(data.builds[mode].markers.includes(marker), `${mode} missing ${marker}`);
    }
  }
});

test('preview serves both builds and removes its temporary app when stopped', { timeout: 300_000 }, async () => {
  const child = spawn(process.execPath, [script, '--serve'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  let errors = '';
  child.stdout.on('data', (chunk) => {
    output += chunk;
  });
  child.stderr.on('data', (chunk) => {
    errors += chunk;
  });
  const finished = new Promise((resolve) => child.once('close', (code) => resolve(code)));
  try {
    for (const port of [4173, 4174]) {
      let response;
      for (let attempt = 0; attempt < 200; attempt++) {
        if (child.exitCode !== null) {
          break;
        }
        try {
          response = await fetch(`http://127.0.0.1:${port}/`);
          break;
        } catch {
          await delay(100);
        }
      }
      assert.ok(response?.ok, `preview ${port} unavailable: ${output}\n${errors}`);
      assert.match(await response.text(), /<title>EGDEV pilot<\/title>/);
    }
  } finally {
    child.kill('SIGTERM');
    await finished;
  }
  const temporary = output.match(/^PILOT_TEMP (.+)$/m)?.[1];
  assert.ok(temporary, output);
  assert.equal(existsSync(temporary), false);
});

test('rejects a repository entry and cleans the temporary directory', { timeout: 300_000 }, () => {
  const result = run({
    ['EGDEV_PILOT_TEST_REPO_ENTRY']: fileURLToPath(new URL('../packages/ui/dist/index.js', import.meta.url))
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /repository entry.*packages\/ui\/dist\/index\.js/);
  const temporary = result.stdout.match(/^PILOT_TEMP (.+)$/m)?.[1];
  assert.ok(temporary, result.stdout);
  assert.equal(existsSync(temporary), false);
});
