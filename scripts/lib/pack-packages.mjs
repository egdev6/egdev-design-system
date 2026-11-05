import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

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
  return members.map((member) => {
    const result = spawnSync('pnpm', ['pack', '--pack-destination', destination], {
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
    const path = join(destination, file);
    if (!existsSync(path)) {
      throw new Error(`pnpm pack did not write ${file} for ${member.name}:\n${result.stdout}`);
    }
    return { name: member.name, version: member.version, file, path, directory: member.directory };
  });
}

function headerString(header, offset, length) {
  const field = header.subarray(offset, offset + length);
  const end = field.indexOf(0);
  return field.subarray(0, end === -1 ? field.length : end).toString('utf8');
}

// Dependency-free reader for the packed manifest: gunzip plus 512-byte tar headers, no `tar` CLI
// and no new dependency on any platform.
export function readPackedManifest(tarball) {
  const archive = gunzipSync(readFileSync(tarball));
  for (let offset = 0; offset + 512 <= archive.length; ) {
    const header = archive.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      break;
    }
    const entryName = headerString(header, 0, 100).replace(/^\.\//, '');
    const size = Number.parseInt(headerString(header, 124, 12).trim() || '0', 8);
    const dataStart = offset + 512;
    if (entryName === 'package/package.json') {
      return JSON.parse(archive.subarray(dataStart, dataStart + size).toString('utf8'));
    }
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  throw new Error(`No package/package.json inside ${tarball}`);
}

export function changelogError({ name, version, directory }) {
  const path = join(directory, 'CHANGELOG.md');
  if (!existsSync(path)) {
    return `${name}: missing CHANGELOG.md for version ${version}`;
  }
  const heading = readFileSync(path, 'utf8')
    .split('\n')
    .find((line) => /^##\s+\S/.test(line));
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
    if (manifest.name !== entry.name) {
      errors.push(`${entry.name}: packed manifest names ${manifest.name}`);
    }
    if (manifest.version !== entry.version) {
      errors.push(`${entry.name}: packed version ${manifest.version} does not match manifest ${entry.version}`);
    }
    for (const field of DEPENDENCY_FIELDS) {
      for (const [dependency, range] of Object.entries(manifest[field] ?? {})) {
        if (typeof range === 'string' && range.includes('workspace:')) {
          errors.push(`${entry.name}: ${field}.${dependency} still contains the workspace specifier ${range}`);
        }
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
  // One shared folder: emptied on start so a run never mixes tarballs from different versions.
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  return finishReleasePack(packReleaseSet({ root, destination }), { log, error });
}
