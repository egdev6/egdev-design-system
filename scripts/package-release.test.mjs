import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
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
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { gunzipSync, gzipSync } from 'node:zlib';
import {
  changelogError,
  finishReleasePack,
  formatPackedLine,
  RELEASE_SET,
  readPackedManifest,
  releaseMembers,
  tarballName,
  verifyPackedManifests
} from './lib/pack-packages.mjs';

// The pack run is shared by every check in this file, so the workspace is built once.
const root = fileURLToPath(new URL('../', import.meta.url));
const releaseDir = join(root, 'release');
// Read by the guide block; the key cannot be written as a literal property (naming convention).
const releaseDirectoryVariable = 'EGDEV_RELEASE_DIR';
const members = releaseMembers(root);
let releaseRun;

function packedRelease() {
  if (!releaseRun) {
    const result = spawnSync('pnpm', ['release:pack'], {
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

  await t.test('one tarball per workspace member, named with its manifest version', () => {
    assert.deepEqual(readdirSync(releaseDir).sort(), expected, 'release/ must hold exactly the versioned tarballs');
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
  for (let offset = 0; offset + 512 <= archive.length; ) {
    const header = archive.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      break;
    }
    const name = header.subarray(0, 100).toString('utf8').split('\0')[0].replace(/^\.\//, '');
    const size = Number.parseInt(header.subarray(124, 136).toString('utf8').replace(/\0.*$/, '').trim() || '0', 8);
    const start = offset + 512;
    if (name === 'package/design-system.json') {
      artifact = archive.subarray(start, start + size).toString('utf8');
    }
    offset = start + Math.ceil(size / 512) * 512;
  }
  assert.equal(artifact, readFileSync(resolve(root, 'packages/system/design-system.json'), 'utf8'));
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
