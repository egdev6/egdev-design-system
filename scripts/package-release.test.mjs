import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';
import { gunzipSync, gzipSync } from 'node:zlib';
import {
  changelogError,
  completeReleasePack,
  finishReleasePack,
  formatPackedLine,
  parseReleasePackArgs,
  RELEASE_MANIFEST_FILE,
  RELEASE_SET,
  readPackedManifest,
  readReleaseProvenance,
  releaseFolderProblem,
  releaseMembers,
  tarballName,
  verifyPackedManifests,
  writeReleaseManifest
} from './lib/pack-packages.mjs';

// The pack run is shared by every check in this file, so the workspace is built once. It writes to
// a temporary folder through `--out-dir`, so the operator's own `release/` is never touched.
const root = fileURLToPath(new URL('../', import.meta.url));
const operatorRelease = join(root, 'release');
const operatorReleaseBefore = folderFingerprint(operatorRelease);
const scratch = mkdtempSync(join(tmpdir(), 'egdev-release-pack-'));
const releaseDir = join(scratch, 'release');
after(() => rmSync(scratch, { recursive: true, force: true }));
// Read by the guide block; the key cannot be written as a literal property (naming convention).
const releaseDirectoryVariable = 'EGDEV_RELEASE_DIR';
const members = releaseMembers(root);
let releaseRun;

function packedRelease() {
  if (!releaseRun) {
    const result = spawnSync('pnpm', ['release:pack', '--out-dir', releaseDir], {
      cwd: root,
      encoding: 'utf8',
      timeout: 900_000,
      maxBuffer: 16 * 1024 * 1024
    });
    assert.equal(
      result.status,
      0,
      `pnpm release:pack failed (${result.error ?? result.signal}):\n${result.stdout}\n${result.stderr}`
    );
    releaseRun = { stdout: result.stdout.trim(), stderr: result.stderr };
  }
  return releaseRun;
}

// D5 (approved 2026-11-05): the peer range is the React matrix this repository tests, not a wider claim.
const REACT_PEER_RANGE = '^18.3.1 || ^19.3.0';

function packedEntry(name) {
  const directory = name.replace(/^@egdev\//, '');
  const version = manifestVersion(directory);
  return {
    name,
    version,
    file: tarballName(name, version),
    path: join(releaseDir, tarballName(name, version)),
    directory: resolve(root, `packages/${directory}`)
  };
}

test('pnpm release:pack writes the versioned release set', async (t) => {
  assert.ok(members.length > 0, 'The workspace must contain at least one release-set package');
  assert.ok(
    members.every((member) => RELEASE_SET.includes(member.name)),
    'Every packed package must belong to the release set'
  );
  const run = packedRelease();
  const expected = members.map((member) => tarballName(member.name, member.version)).sort();

  await t.test('one tarball per workspace member, named with its manifest version, plus release.json', () => {
    assert.deepEqual(
      readdirSync(releaseDir).sort(),
      [...expected, 'release.json'].sort(),
      'The output folder must hold exactly the versioned tarballs and release.json'
    );
    for (const member of members) {
      assert.ok(
        member.version,
        `${member.name} must read its version from the manifest at run time instead of a hardcoded one`
      );
    }
  });

  await t.test('one stdout line per tarball with file, package name and version', () => {
    const lines = run.stdout.split('\n').filter(Boolean);
    const tarballLines = lines.filter((line) => line.includes('.tgz'));
    assert.equal(tarballLines.length, members.length, 'release:pack must print one line per tarball');
    const packed = members.map((member) => ({
      name: member.name,
      version: member.version,
      file: tarballName(member.name, member.version),
      path: join(releaseDir, tarballName(member.name, member.version)),
      directory: member.directory
    }));
    for (const entry of packed) {
      assert.ok(tarballLines.includes(formatPackedLine(entry)), `Missing release:pack line for ${entry.file}`);
    }
  });

  await t.test('packed manifests carry no workspace specifier and keep the manifest version', () => {
    const packed = members.map((member) => ({
      name: member.name,
      version: member.version,
      file: tarballName(member.name, member.version),
      path: join(releaseDir, tarballName(member.name, member.version)),
      directory: member.directory
    }));
    assert.deepEqual(verifyPackedManifests(packed), [], 'Packed manifests must be installable as-is');
    for (const entry of packed) {
      const manifest = readPackedManifest(entry.path);
      assert.equal(manifest.name, entry.name);
      assert.equal(manifest.version, entry.version);
    }
  });

  await t.test('release.json records the commit, the dirty flag and the sha256 of every tarball', () => {
    const manifest = JSON.parse(readFileSync(join(releaseDir, 'release.json'), 'utf8'));
    assert.deepEqual(Object.keys(manifest), ['schemaVersion', 'commit', 'dirty', 'packages']);
    assert.equal(manifest.schemaVersion, 1);
    assert.match(manifest.commit, /^[0-9a-f]{40}$/);
    assert.equal(manifest.commit, git(root, ['rev-parse', 'HEAD']), 'commit must be the HEAD that was packed');
    assert.equal(
      manifest.dirty,
      git(root, ['status', '--porcelain']) !== '',
      'dirty must reflect uncommitted or untracked changes in the packed tree'
    );
    assert.deepEqual(
      manifest.packages,
      members.map((member) => {
        const file = tarballName(member.name, member.version);
        return { name: member.name, version: member.version, file, sha256: sha256Of(join(releaseDir, file)) };
      }),
      'release.json must list every tarball in release-set order with its real sha256'
    );
    assert.ok(
      run.stdout.split('\n').includes(`release.json: ${manifest.commit}${manifest.dirty ? ' (dirty)' : ''}`),
      'release:pack must print the recorded provenance'
    );
  });

  await t.test('every tarball ships the package CHANGELOG.md', () => {
    for (const member of members) {
      const path = join(releaseDir, tarballName(member.name, member.version));
      assert.equal(
        readPackedFile(path, 'package/CHANGELOG.md'),
        readFileSync(join(member.directory, 'CHANGELOG.md'), 'utf8'),
        `${member.name} must pack its CHANGELOG.md`
      );
    }
  });

  await t.test('packed effects keeps the exact three peer', () => {
    const effects = readPackedManifest(join(releaseDir, tarballName('@egdev/effects', manifestVersion('effects'))));
    assert.equal(effects.peerDependencies.three, '0.160.0', 'three must stay an exact peer in the tarball');
  });

  await t.test('packed React peers match the tested matrix', () => {
    for (const name of ['@egdev/ui', '@egdev/effects']) {
      const manifest = readPackedManifest(packedEntry(name).path);
      for (const peer of ['react', 'react-dom']) {
        assert.equal(
          manifest.peerDependencies[peer],
          REACT_PEER_RANGE,
          `Packed ${name} must declare the tested ${peer} range instead of a wider claim`
        );
      }
    }
  });
});

test('release:pack includes the system artifact in its versioned tarball', () => {
  packedRelease();
  const entry = packedEntry('@egdev/system');
  assert.ok(existsSync(entry.path), `Missing ${entry.file}`);
  const archive = gunzipSync(readFileSync(entry.path));
  let artifact;
  const files = new Set();
  for (let offset = 0; offset + 512 <= archive.length; ) {
    const header = archive.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      break;
    }
    const name = header.subarray(0, 100).toString('utf8').split('\0')[0].replace(/^\.\//, '');
    const size = Number.parseInt(header.subarray(124, 136).toString('utf8').replace(/\0.*$/, '').trim() || '0', 8);
    const start = offset + 512;
    files.add(name);
    if (name === 'package/design-system.json') {
      artifact = archive.subarray(start, start + size).toString('utf8');
    }
    offset = start + Math.ceil(size / 512) * 512;
  }
  assert.equal(artifact, readFileSync(resolve(root, 'packages/system/design-system.json'), 'utf8'));
  for (const name of ['package/system.md', 'package/src/cli.mjs', 'package/src/render-system-md.mjs']) {
    assert.ok(files.has(name), `Missing ${name} from ${entry.file}`);
  }
  const manifest = readPackedManifest(entry.path);
  assert.equal(manifest.bin['egdev-system-md'], './src/cli.mjs');
  assert.equal(manifest.exports['.'], './src/render-system-md.mjs');
});

test('AC20 release:pack includes @egdev/cli with its egdev-ds bin, listed in release.json', () => {
  assert.deepEqual(RELEASE_SET, [
    '@egdev/tokens',
    '@egdev/ui',
    '@egdev/effects',
    '@egdev/system',
    '@egdev/mcp',
    '@egdev/cli'
  ]);
  packedRelease();
  const entry = packedEntry('@egdev/cli');
  assert.ok(existsSync(entry.path), `Missing ${entry.file}`);
  const manifest = readPackedManifest(entry.path);
  assert.equal(manifest.bin['egdev-ds'], './bin/egdev-ds.mjs');
  assert.equal(manifest.dependencies, undefined, '@egdev/cli has no dependencies');
  assert.equal(typeof readPackedFile(entry.path, 'package/bin/egdev-ds.mjs'), 'string');
  assert.equal(typeof readPackedFile(entry.path, 'package/src/upgrade.mjs'), 'string');
  assert.equal(readPackedFile(entry.path, 'package/tests/helpers.mjs'), undefined, 'tests are not packed');
  const listed = JSON.parse(readFileSync(join(releaseDir, 'release.json'), 'utf8')).packages.at(-1);
  assert.deepEqual(listed, {
    name: '@egdev/cli',
    version: entry.version,
    file: entry.file,
    sha256: sha256Of(entry.path)
  });
});

test('release:pack includes MCP with the matching carrier dependency', () => {
  packedRelease();
  const entry = packedEntry('@egdev/mcp');
  assert.ok(existsSync(entry.path), `Missing ${entry.file}`);
  const manifest = readPackedManifest(entry.path);
  assert.equal(manifest.dependencies['@egdev/system'], manifestVersion('system'));
  assert.ok(!manifest.dependencies['@egdev/system'].includes('workspace:'));
});

test('release verification rejects an MCP tarball without its carrier dependency', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'egdev-mcp-release-'));
  try {
    writeFileSync(join(fixture, 'CHANGELOG.md'), '# Changelog\n\n## 0.1.0\n');
    const path = join(fixture, 'mcp.tgz');
    writeTarball(path, { name: '@egdev/mcp', version: '0.1.0' });
    const entry = { name: '@egdev/mcp', version: '0.1.0', path, directory: fixture };
    assert.match(verifyPackedManifests([entry]).join('\n'), /packed @egdev\/system dependency/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('release:pack --out-dir chooses the output folder; release/ stays the default', () => {
  assert.deepEqual(parseReleasePackArgs([], root), { destination: join(root, 'release') });
  assert.deepEqual(parseReleasePackArgs(['--out-dir', 'tmp/pack'], root), { destination: join(root, 'tmp/pack') });
  assert.deepEqual(parseReleasePackArgs(['--out-dir', '/abs/pack'], root), { destination: '/abs/pack' });
  for (const args of [['--out-dir'], ['--out-dir', '--x'], ['--other'], ['--out-dir', 'a', '--out-dir', 'b']]) {
    assert.throws(() => parseReleasePackArgs(args, root), /^Error: Usage: pnpm release:pack \[--out-dir <dir>\]$/);
  }
});

test('release:pack refuses to empty a folder that holds files it did not write', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'egdev-release-folder-'));
  try {
    assert.equal(releaseFolderProblem(join(fixture, 'missing')), null, 'A missing folder is created');
    writeFileSync(join(fixture, 'egdev-ui-0.3.1.tgz'), '');
    writeFileSync(join(fixture, 'release.json'), '{}');
    mkdirSync(join(fixture, '.staging-abc'));
    assert.equal(releaseFolderProblem(fixture), null, 'A previous release folder is replaced');
    writeFileSync(join(fixture, 'notes.md'), 'mine');
    assert.equal(
      releaseFolderProblem(fixture),
      `Refusing to empty ${fixture}: it holds notes.md, which release:pack did not write.`
    );
    assert.equal(
      releaseFolderProblem(join(fixture, 'notes.md')),
      `Refusing to use ${join(fixture, 'notes.md')}: it is not a directory.`
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

// Names, sizes and sha256 of every entry, or `absent`: proves a run left a folder byte-identical.
function folderFingerprint(directory) {
  if (!existsSync(directory)) {
    return 'absent';
  }
  return readdirSync(directory, { recursive: true })
    .sort()
    .map((name) => {
      const path = join(directory, name);
      return statSync(path).isDirectory() ? `${name}/` : `${name} ${sha256Of(path)}`;
    })
    .join('\n');
}

function git(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')} failed: ${result.stderr}`);
  return result.stdout.trim();
}

function sha256Of(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

// Reads one entry from a packed tarball with the same gunzip + 512-byte header walk as the lib.
function readPackedFile(tarball, entry) {
  const archive = gunzipSync(readFileSync(tarball));
  for (let offset = 0; offset + 512 <= archive.length; ) {
    const header = archive.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      break;
    }
    const name = header.subarray(0, 100).toString('utf8').split('\0')[0].replace(/^\.\//, '');
    const size = Number.parseInt(header.subarray(124, 136).toString('utf8').replace(/\0.*$/, '').trim() || '0', 8);
    const start = offset + 512;
    if (name === entry) {
      return archive.subarray(start, start + size).toString('utf8');
    }
    offset = start + Math.ceil(size / 512) * 512;
  }
  return undefined;
}

// Fixture release folder with two tarballs, as a successful pack leaves it.
function fixtureRelease(fixture) {
  const destination = join(fixture, 'release');
  mkdirSync(destination, { recursive: true });
  writeFileSync(join(fixture, 'CHANGELOG.md'), '# Changelog\n\n## 0.0.1\n');
  return ['@egdev/tokens', '@egdev/ui'].map((name) => {
    const file = tarballName(name, '0.0.1');
    const path = join(destination, file);
    writeTarball(path, { name, version: '0.0.1' });
    return { name, version: '0.0.1', file, path, directory: fixture };
  });
}

const fixtureProvenance = { commit: 'a'.repeat(40), dirty: false };

test('writeReleaseManifest writes the release.json schema with the real sha256 values', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'egdev-release-manifest-'));
  try {
    const packed = fixtureRelease(fixture);
    const destination = join(fixture, 'release');
    const written = writeReleaseManifest({ destination, packed, provenance: fixtureProvenance });
    const path = join(destination, RELEASE_MANIFEST_FILE);
    assert.equal(RELEASE_MANIFEST_FILE, 'release.json');
    const expected = {
      schemaVersion: 1,
      commit: 'a'.repeat(40),
      dirty: false,
      packages: packed.map((entry) => ({
        name: entry.name,
        version: entry.version,
        file: entry.file,
        sha256: sha256Of(entry.path)
      }))
    };
    assert.deepEqual(written, expected);
    const bytes = readFileSync(path, 'utf8');
    assert.equal(bytes, `${JSON.stringify(expected, null, 2)}\n`, 'release.json keeps a fixed key order and format');
    assert.deepEqual(
      readdirSync(destination).sort(),
      [...packed.map((entry) => entry.file), 'release.json'].sort(),
      'The atomic write must leave no temporary file behind'
    );
    writeReleaseManifest({ destination, packed, provenance: fixtureProvenance });
    assert.equal(readFileSync(path, 'utf8'), bytes, 'The same tarballs and tree must give byte-identical output');
    writeReleaseManifest({ destination, packed, provenance: { ...fixtureProvenance, dirty: true } });
    assert.equal(JSON.parse(readFileSync(path, 'utf8')).dirty, true, 'release:pack records a dirty tree as-is');
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('writeReleaseManifest rejects a provenance without a full commit SHA', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'egdev-release-manifest-'));
  try {
    const packed = fixtureRelease(fixture);
    const destination = join(fixture, 'release');
    assert.throws(
      () => writeReleaseManifest({ destination, packed, provenance: { commit: 'abc1234', dirty: false } }),
      /release\.json: commit must be a 40-character hex SHA, got abc1234/
    );
    assert.equal(existsSync(join(destination, 'release.json')), false);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('readReleaseProvenance reads HEAD and the dirty flag from git', () => {
  const repo = mkdtempSync(join(tmpdir(), 'egdev-release-provenance-'));
  try {
    const identity = ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid'];
    git(repo, ['init', '--quiet']);
    writeFileSync(join(repo, 'tracked.txt'), 'one\n');
    git(repo, ['add', 'tracked.txt']);
    git(repo, [...identity, 'commit', '--quiet', '--no-gpg-sign', '-m', 'fixture']);
    const head = git(repo, ['rev-parse', 'HEAD']);
    assert.deepEqual(readReleaseProvenance(repo), { commit: head, dirty: false });
    writeFileSync(join(repo, 'untracked.txt'), 'new\n');
    assert.deepEqual(readReleaseProvenance(repo), { commit: head, dirty: true }, 'Untracked files make the tree dirty');
    rmSync(join(repo, 'untracked.txt'));
    writeFileSync(join(repo, 'tracked.txt'), 'two\n');
    assert.deepEqual(readReleaseProvenance(repo), { commit: head, dirty: true }, 'Modified files make the tree dirty');
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test('readReleaseProvenance fails outside a git repository', () => {
  const folder = mkdtempSync(join(tmpdir(), 'egdev-release-provenance-'));
  try {
    assert.throws(
      () => readReleaseProvenance(folder),
      /^Error: Cannot read the release commit: git rev-parse HEAD failed/
    );
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test('completeReleasePack writes release.json only after a verified pack', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'egdev-release-complete-'));
  try {
    const packed = fixtureRelease(fixture);
    const destination = join(fixture, 'release');
    const lines = [];
    const errors = [];
    const exitCode = completeReleasePack(packed, {
      destination,
      provenance: { ...fixtureProvenance, dirty: true },
      log: (line) => lines.push(line),
      error: (line) => errors.push(line)
    });
    assert.equal(exitCode, 0);
    assert.deepEqual(errors, []);
    assert.deepEqual(lines, [...packed.map(formatPackedLine), `release.json: ${'a'.repeat(40)} (dirty)`]);
    assert.equal(JSON.parse(readFileSync(join(destination, 'release.json'), 'utf8')).dirty, true);

    const failing = mkdtempSync(join(tmpdir(), 'egdev-release-complete-'));
    try {
      const [bad] = fixtureRelease(failing);
      writeTarball(bad.path, { name: bad.name, version: bad.version, dependencies: { '@egdev/ui': 'workspace:^' } });
      const failedLines = [];
      const failedErrors = [];
      const failedExit = completeReleasePack([bad], {
        destination: join(failing, 'release'),
        provenance: fixtureProvenance,
        log: (line) => failedLines.push(line),
        error: (line) => failedErrors.push(line)
      });
      assert.equal(failedExit, 1);
      assert.deepEqual(failedLines, []);
      assert.deepEqual(failedErrors, ['@egdev/tokens: workspace specifier in dependencies.@egdev/ui (workspace:^)']);
      assert.equal(
        existsSync(join(failing, 'release', 'release.json')),
        false,
        'A failed verification must not write release.json'
      );
    } finally {
      rmSync(failing, { recursive: true, force: true });
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

function manifestVersion(directoryName) {
  return JSON.parse(readFileSync(resolve(root, `packages/${directoryName}/package.json`), 'utf8')).version;
}

// Minimal ustar writer for fixtures only: the verification path must reject a packed manifest that
// still carries `workspace:`, which a real `pnpm pack` rewrites and can therefore never produce.
function writeTarball(path, manifest) {
  const content = Buffer.from(JSON.stringify(manifest), 'utf8');
  const header = Buffer.alloc(512);
  header.write('package/package.json', 0, 100, 'utf8');
  header.write('0000644\0', 100, 8, 'utf8');
  header.write('0000000\0', 108, 8, 'utf8');
  header.write('0000000\0', 116, 8, 'utf8');
  header.write(`${content.length.toString(8).padStart(11, '0')}\0`, 124, 12, 'utf8');
  header.write(
    `${Math.floor(Date.now() / 1000)
      .toString(8)
      .padStart(11, '0')}\0`,
    136,
    12,
    'utf8'
  );
  header.write('        ', 148, 8, 'utf8');
  header.write('0', 156, 1, 'utf8');
  header.write('ustar\0', 257, 6, 'utf8');
  header.write('00', 263, 2, 'utf8');
  let checksum = 0;
  for (const byte of header) {
    checksum += byte;
  }
  header.write(`${checksum.toString(8).padStart(6, '0')}\0 `, 148, 8, 'utf8');
  const padding = Buffer.alloc(Math.ceil(content.length / 512) * 512 - content.length);
  writeFileSync(path, gzipSync(Buffer.concat([header, content, padding, Buffer.alloc(1024)])));
}

test('release:pack rejects a packed workspace specifier and keeps the tarballs it wrote', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'egdev-release-fixture-'));
  try {
    const destination = join(fixture, 'release');
    mkdirSync(destination, { recursive: true });
    writeFileSync(join(fixture, 'CHANGELOG.md'), '# Changelog\n\n## 0.0.1\n\n- Fixture release.\n');
    const file = tarballName('@egdev/tokens', '0.0.1');
    const path = join(destination, file);
    writeTarball(path, {
      name: '@egdev/tokens',
      version: '0.0.1',
      dependencies: { '@egdev/ui': 'workspace:^' },
      peerDependencies: { react: 'workspace:*' }
    });
    const lines = [];
    const errors = [];
    const exitCode = finishReleasePack([{ name: '@egdev/tokens', version: '0.0.1', file, path, directory: fixture }], {
      log: (line) => lines.push(line),
      error: (line) => errors.push(line)
    });
    assert.equal(exitCode, 1, 'A packed workspace specifier must fail the run');
    assert.deepEqual(lines, [], 'A failed run must not print the success lines');
    assert.equal(errors.length, 1, 'One stderr line per offending package');
    assert.equal(
      errors[0],
      '@egdev/tokens: workspace specifier in dependencies.@egdev/ui (workspace:^), peerDependencies.react (workspace:*)'
    );
    assert.deepEqual(
      readdirSync(destination),
      [file],
      'The tarballs already written must stay in the output folder after a failed verification'
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('release:pack reports an empty release set instead of succeeding silently', () => {
  const lines = [];
  const errors = [];
  const exitCode = finishReleasePack([], { log: (line) => lines.push(line), error: (line) => errors.push(line) });
  assert.equal(exitCode, 1);
  assert.deepEqual(lines, []);
  assert.equal(errors.length, 1);
});

test('release:pack fails when the packed version has no matching changelog section', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'egdev-release-changelog-'));
  try {
    const entry = { name: '@egdev/ui', version: '0.1.0', directory: fixture };
    assert.match(changelogError(entry), /missing CHANGELOG\.md for version 0\.1\.0/);
    writeFileSync(join(fixture, 'CHANGELOG.md'), '# Changelog\n\n## 0.0.9\n\n- Older release.\n');
    assert.match(changelogError(entry), /CHANGELOG\.md top section is 0\.0\.9, expected 0\.1\.0/);
    writeFileSync(join(fixture, 'CHANGELOG.md'), '# Changelog\n\n## 0.1.0\n\n- Current release.\n\n## 0.0.9\n');
    assert.equal(changelogError(entry), null, 'The top section must match the packed version');
    writeFileSync(
      join(fixture, 'CHANGELOG.md'),
      '# Changelog\n\n## Unreleased\n\n- Pending change.\n\n## 0.1.0\n\n- Current release.\n'
    );
    assert.equal(changelogError(entry), null, 'An Unreleased section above the packed version is allowed');
    writeFileSync(join(fixture, 'CHANGELOG.md'), '# Changelog\n\n## Unreleased\n\n- Pending change.\n\n## 0.0.9\n');
    assert.match(changelogError(entry), /CHANGELOG\.md top section is 0\.0\.9, expected 0\.1\.0/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('the install guide runs verbatim in a clean directory', { timeout: 600_000 }, () => {
  const guide = readFileSync(resolve(root, 'docs/distribution/install.md'), 'utf8');
  const blocks = [...guide.matchAll(/^```([^\n]*)\n([\s\S]*?)^```$/gm)].filter(([, info]) => info.trim() === 'sh');
  assert.equal(blocks.length, 1, 'install.md must hold exactly one executable `sh` block');
  const commands = blocks[0][2];
  packedRelease();

  const clean = mkdtempSync(join(tmpdir(), 'egdev-install-guide-'));
  try {
    const result = spawnSync('bash', ['--noprofile', '--norc', '-s'], {
      cwd: clean,
      input: commands,
      encoding: 'utf8',
      timeout: 540_000,
      maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, [releaseDirectoryVariable]: releaseDir }
    });
    assert.equal(
      result.status,
      0,
      `install guide failed (${result.error ?? result.signal}):\n${result.stdout}\n${result.stderr}`
    );

    for (const [mode, css] of [
      ['tailwind', join(clean, 'dist', 'tailwind', 'styles.css')],
      ['native', join(clean, 'dist', 'native', 'styles.css')]
    ]) {
      assert.ok(existsSync(css), `The ${mode} CSS mode must build the documented stylesheet`);
      assert.ok(statSync(css).size > 0, `The ${mode} stylesheet must not be empty`);
    }

    for (const name of ['tokens', 'ui', 'effects']) {
      const installed = join(clean, 'node_modules', '@egdev', name);
      assert.ok(existsSync(installed), `The guide must install @egdev/${name} from its tarball`);
      const target = realpathSync(installed);
      assert.ok(
        relative(clean, target) && !relative(clean, target).startsWith('..'),
        `@egdev/${name} must be installed inside the consumer, not linked from ${target}`
      );
      const manifest = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'));
      for (const field of ['dependencies', 'peerDependencies']) {
        for (const [dependency, range] of Object.entries(manifest[field] ?? {})) {
          assert.ok(
            !String(range).includes('workspace:'),
            `Installed @egdev/${name} keeps ${field}.${dependency} as ${range}`
          );
        }
      }
    }
  } finally {
    rmSync(clean, { recursive: true, force: true });
  }
});

// Last on purpose: every pack above went to the temporary --out-dir folder.
test("the tests never alter the operator's release/ folder", () => {
  assert.equal(folderFingerprint(operatorRelease), operatorReleaseBefore);
});
