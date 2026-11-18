import assert from 'node:assert/strict';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { readRelease } from '../src/release.mjs';
import { COMMIT, json, releaseFixture } from './helpers.mjs';

const scratch = [];
after(() => {
  for (const path of scratch) {
    rmSync(path, { recursive: true, force: true });
  }
});
const fixture = () => {
  const directory = releaseFixture(['tokens', 'ui']);
  scratch.push(directory);
  return directory;
};
const edit = (directory, change) => {
  const path = join(directory, 'release.json');
  writeFileSync(path, json(change(JSON.parse(readFileSync(path, 'utf8')))));
};

test('AC4 readRelease returns the verified provenance', () => {
  const directory = fixture();
  const release = readRelease(directory);
  assert.equal(release.commit, COMMIT);
  assert.equal(release.dirty, false);
  assert.deepEqual(
    release.packages.map(({ name, version, file }) => [name, version, file]),
    [
      ['@egdev/tokens', '0.5.0', 'egdev-tokens-0.5.0.tgz'],
      ['@egdev/ui', '0.3.1', 'egdev-ui-0.3.1.tgz']
    ]
  );
});

test('AC4 readRelease refuses a missing, malformed or inconsistent release.json with one line naming the file', () => {
  const cases = [
    [(d) => rmSync(join(d, 'release.json')), (d) => `Cannot read ${d}/release.json: not found.`],
    [(d) => writeFileSync(join(d, 'release.json'), '{'), (d) => `Cannot read ${d}/release.json: invalid JSON.`],
    [(d) => edit(d, (m) => ({ ...m, schemaVersion: 2 })), (d) => `Invalid ${d}/release.json: schemaVersion must be 1.`],
    [
      (d) => edit(d, (m) => ({ ...m, commit: 'e712915' })),
      (d) => `Invalid ${d}/release.json: commit must be a 40-character hex SHA.`
    ],
    [(d) => edit(d, (m) => ({ ...m, dirty: 'no' })), (d) => `Invalid ${d}/release.json: dirty must be a boolean.`],
    [
      (d) => edit(d, (m) => ({ ...m, packages: [{ name: '@egdev/ui' }] })),
      (d) => `Invalid ${d}/release.json: packages[0] needs name, version, file and a 64-hex sha256.`
    ],
    [
      (d) => edit(d, (m) => ({ ...m, packages: [{ ...m.packages[0], file: '../x.tgz' }] })),
      (d) => `Invalid ${d}/release.json: packages[0] needs name, version, file and a 64-hex sha256.`
    ],
    [
      (d) => rmSync(join(d, 'egdev-ui-0.3.1.tgz')),
      (d) => `Release file missing: ${d}/egdev-ui-0.3.1.tgz (listed in ${d}/release.json).`
    ],
    [
      (d) => writeFileSync(join(d, 'egdev-ui-0.3.1.tgz'), 'tampered'),
      (d) => `Release mismatch: ${d}/egdev-ui-0.3.1.tgz sha256 differs from ${d}/release.json.`
    ]
  ];
  for (const [mutate, message] of cases) {
    const directory = fixture();
    mutate(directory);
    assert.throws(
      () => readRelease(directory),
      (error) => error instanceof Error && error.message === message(directory)
    );
  }
});
