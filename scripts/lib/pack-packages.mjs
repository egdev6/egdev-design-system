import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPackedManifest } from '../../packages/cli/src/release.mjs';

// Release set decided by docs/odd/distribution/342-local-tarballs.md (R1). Members that do not
// exist yet in the workspace are skipped, so the two packages added by later tasks join the same
// run without a second packing path (ODD task L7).
export const RELEASE_SET = ['@egdev/tokens', '@egdev/ui', '@egdev/effects', '@egdev/system', '@egdev/mcp'];

export const DEPENDENCY_FIELDS = ['dependencies', 'peerDependencies', 'optionalDependencies', 'devDependencies'];

const defaultRoot = fileURLToPath(new URL('../../', import.meta.url));

function manifestAt(directory) {
  return JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
}

// Tarball names follow pnpm: `@egdev/ui` -> `egdev-ui-<version>.tgz`.
export function tarballName(name, version) {
  return `${name.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;
}

// Ordered release-set members actually present in the workspace.
export function releaseMembers(root = defaultRoot) {
  const packages = join(root, 'packages');
  if (!existsSync(packages)) {
    return [];
  }
  const members = [];
  for (const directoryName of readdirSync(packages).sort()) {
    const directory = join(packages, directoryName);
    if (!statSync(directory).isDirectory() || !existsSync(join(directory, 'package.json'))) {
      continue;
    }
    const manifest = manifestAt(directory);
    if (RELEASE_SET.includes(manifest.name)) {
      members.push({ name: manifest.name, version: manifest.version, manifest, directory });
    }
  }
  return members.sort((a, b) => RELEASE_SET.indexOf(a.name) - RELEASE_SET.indexOf(b.name));
}

// The single packing step: every caller goes through here, so `pnpm pack` exists once.
export function packReleaseSet({ root = defaultRoot, destination, members = releaseMembers(root) } = {}) {
  if (!destination) {
    throw new Error('packReleaseSet needs a destination folder');
  }
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }
  // Each tarball is written under a temporary folder and renamed into place, so a reader of the
  // destination never sees a partially written tarball.
  const staging = mkdtempSync(join(destination, '.staging-'));
  try {
    return members.map((member) => packMember(member, destination, staging));
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

function packMember(member, destination, staging) {
  const result = spawnSync('pnpm', ['pack', '--pack-destination', staging], {
    cwd: member.directory,
    encoding: 'utf8',
    timeout: 120_000,
    maxBuffer: 8 * 1024 * 1024
  });
  if (result.status !== 0) {
    throw new Error(
      `pnpm pack failed for ${member.name} (${result.error ?? result.signal}):\n${result.stdout}\n${result.stderr}`
    );
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  const file = tarballName(member.name, member.version);
  const staged = join(staging, file);
  if (!existsSync(staged)) {
    throw new Error(`pnpm pack did not write ${file} for ${member.name}:\n${result.stdout}`);
  }
  const path = join(destination, file);
  renameSync(staged, path);
  return { name: member.name, version: member.version, file, path, directory: member.directory };
}

// The packed-manifest reader has one owner, in the CLI, which cannot import `scripts/` when it runs
// from its tarball (docs/distribution/egdev-ds-cli.md §2).
export { readPackedManifest };

export function changelogError({ name, version, directory }) {
  const path = join(directory, 'CHANGELOG.md');
  if (!existsSync(path)) {
    return `${name}: missing CHANGELOG.md for version ${version}`;
  }
  // An `## Unreleased` section may sit above the release; the first versioned section must match.
  const heading = readFileSync(path, 'utf8')
    .split('\n')
    .find((line) => /^##\s+\S/.test(line) && !/^##\s+unreleased\b/i.test(line));
  const claimed = heading?.match(/\d+\.\d+\.\d+/)?.[0];
  if (claimed !== version) {
    return `${name}: CHANGELOG.md top section is ${claimed ?? 'missing'}, expected ${version}`;
  }
  return null;
}

// Manifest verification belongs to the script, not only to tests: one line per offending package
// naming the field, so a `workspace:` specifier never reaches a consumer.
export function verifyPackedManifests(packed) {
  const errors = [];
  for (const entry of packed) {
    const manifest = readPackedManifest(entry.path);
    const workspaceSpecifiers = [];
    if (manifest.name !== entry.name) {
      errors.push(`${entry.name}: packed manifest names ${manifest.name}`);
    }
    if (manifest.version !== entry.version) {
      errors.push(`${entry.name}: packed version ${manifest.version} does not match manifest ${entry.version}`);
    }
    for (const field of DEPENDENCY_FIELDS) {
      for (const [dependency, range] of Object.entries(manifest[field] ?? {})) {
        if (typeof range === 'string' && range.includes('workspace:')) {
          workspaceSpecifiers.push(`${field}.${dependency} (${range})`);
        }
      }
    }
    if (workspaceSpecifiers.length > 0) {
      errors.push(`${entry.name}: workspace specifier in ${workspaceSpecifiers.join(', ')}`);
    }
    if (entry.name === '@egdev/mcp') {
      const system = packed.find((item) => item.name === '@egdev/system');
      if (!system || manifest.dependencies?.['@egdev/system'] !== system.version) {
        errors.push('@egdev/mcp: packed @egdev/system dependency must match the system release version');
      }
    }
    const changelog = changelogError(entry);
    if (changelog) {
      errors.push(changelog);
    }
  }
  return errors;
}

export function formatPackedLine(entry) {
  return `${entry.file}: ${entry.name}@${entry.version}`;
}

// Verification and reporting of one packing run: one stderr line per offending package, exit 1,
// and nothing removed from the folder that already holds the tarballs.
export function finishReleasePack(packed, { log, error }) {
  if (packed.length === 0) {
    error('No release-set package was packed');
    return 1;
  }
  const errors = verifyPackedManifests(packed);
  if (errors.length > 0) {
    for (const line of errors) {
      error(line);
    }
    return 1;
  }
  for (const entry of packed) {
    log(formatPackedLine(entry));
  }
  return 0;
}

// Provenance record written next to the tarballs (docs/distribution/egdev-ds-cli.md §3, Q1).
export const RELEASE_MANIFEST_FILE = 'release.json';

function gitOutput(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', timeout: 60_000 });
  if (result.status !== 0) {
    const reason = (result.stderr || String(result.error ?? result.signal)).trim().replace(/\s*\n\s*/g, ' ');
    throw new Error(`Cannot read the release commit: git ${args.join(' ')} failed (${reason})`);
  }
  return result.stdout;
}

// Runs git in the design system repository at pack time: the HEAD commit, and whether the tree has
// uncommitted or untracked changes (ignored files, such as `release/` itself, do not count).
export function readReleaseProvenance(root = defaultRoot) {
  const commit = gitOutput(root, ['rev-parse', 'HEAD']).trim();
  const dirty = gitOutput(root, ['status', '--porcelain']).trim() !== '';
  return { commit, dirty };
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

// Writes `release.json` from the tarballs actually packed, with a fixed key order and no timestamp,
// so the same tarballs and tree give byte-identical output. The file is written under a temporary
// name in the same folder and renamed, so a reader never sees a partial record.
export function writeReleaseManifest({ destination, packed, provenance }) {
  if (!/^[0-9a-f]{40}$/.test(provenance?.commit ?? '')) {
    throw new Error(`${RELEASE_MANIFEST_FILE}: commit must be a 40-character hex SHA, got ${provenance?.commit}`);
  }
  const manifest = {
    schemaVersion: 1,
    commit: provenance.commit,
    dirty: provenance.dirty === true,
    packages: packed.map((entry) => ({
      name: entry.name,
      version: entry.version,
      file: entry.file,
      sha256: sha256File(entry.path)
    }))
  };
  const staging = mkdtempSync(join(destination, '.staging-'));
  try {
    const temporary = join(staging, RELEASE_MANIFEST_FILE);
    writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`);
    renameSync(temporary, join(destination, RELEASE_MANIFEST_FILE));
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
  return manifest;
}

export function formatProvenanceLine(manifest) {
  return `${RELEASE_MANIFEST_FILE}: ${manifest.commit}${manifest.dirty ? ' (dirty)' : ''}`;
}

// Verifies the packed set and, only when it passes, records its provenance. A failed verification
// leaves the tarballs in place and writes no `release.json`.
export function completeReleasePack(packed, { destination, provenance, log, error }) {
  const exitCode = finishReleasePack(packed, { log, error });
  if (exitCode !== 0) {
    return exitCode;
  }
  log(formatProvenanceLine(writeReleaseManifest({ destination, packed, provenance })));
  return 0;
}

// `release:pack` entry point. Bumps stay manual: this never edits a version.
export function runReleasePack({
  root = defaultRoot,
  destination = join(root, 'release'),
  build = true,
  log = (line) => console.log(line),
  error = (line) => console.error(line)
} = {}) {
  if (build) {
    const built = spawnSync('pnpm', ['-r', '--filter', './packages/**', 'run', 'build'], {
      cwd: root,
      encoding: 'utf8',
      timeout: 900_000,
      maxBuffer: 16 * 1024 * 1024
    });
    if (built.status !== 0) {
      error(`Workspace build failed (${built.error ?? built.signal}):\n${built.stdout}\n${built.stderr}`);
      return 1;
    }
  }
  // Read before the folder is emptied, so a tree without git fails without touching `release/`.
  let provenance;
  try {
    provenance = readReleaseProvenance(root);
  } catch (failure) {
    error(failure.message);
    return 1;
  }
  // One shared folder: emptied on start so a run never mixes tarballs from different versions.
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  return completeReleasePack(packReleaseSet({ root, destination }), { destination, provenance, log, error });
}
