// `egdev-ds status <project>` (#486, odd/tasks/egdev-ds-485-486.md S3): a read-only report of the
// vendored commit and each vendored package's version, file and specifier style, derived from the
// vendored file names. It writes nothing, spawns nothing and runs no git; no new state file.
import { join } from 'node:path';
import { RefusedError } from './args.mjs';
import {
  collectSpecifiers,
  DEPENDENCY_FIELDS,
  detectCssMode,
  detectFramework,
  detectPackageManager,
  isVendorPath,
  PACKAGES,
  safeVendorFile,
  vendorState
} from './detect.mjs';
import { readManifest, readText } from './init.mjs';
import { WORKSPACE_FILE } from './pnpm-workspace.mjs';

/** @typedef {import('./release.mjs').Release} Release */
/** @typedef {{ name: string, version: string, file: string, style: string }} StatusPackage */
/**
 * @typedef {{
 *   packageManager: 'npm' | 'pnpm' | null,
 *   framework: 'next' | 'vite' | null,
 *   cssMode: 'tailwind' | 'native',
 *   commit: string,
 *   packages: StatusPackage[],
 *   releaseCommit: string | null,
 *   upgradeAvailable: boolean | null
 * }} StatusReport
 */

/**
 * The version in `egdev-<pkg>-<version>-<commit>.tgz`, the same name `commitOf` parses.
 * @param {string} file
 */
const versionOf = (file) =>
  file.slice(file.lastIndexOf('/') + 1).match(/^egdev-[a-z]+-(\d+\.\d+\.\d+[^-]*)-[a-f\d]{7,40}\.tgz$/i)?.[1] ?? '';

/**
 * Reads the vendored state of `project`. Refuses (exit 2) the states upgrade refuses: none, an
 * unsafe path, a foreign specifier and a mixed set (spec §5.5).
 * @param {{ argument: string, project: string, release: Release | null }} input
 * @returns {StatusReport}
 */
export function readStatus({ argument, project, release }) {
  const { manifest } = readManifest(project, argument);
  const specs = collectSpecifiers(manifest, readText(join(project, WORKSPACE_FILE)));
  if (specs.length === 0) {
    throw new RefusedError(`${argument} has no vendored @egdev packages; run egdev-ds init.`);
  }
  const state = vendorState(specs);
  if (state.unsafe) {
    throw new RefusedError(`Unsafe vendored path: ${state.unsafe.name} (${state.unsafe.spec}).`);
  }
  const foreign = specs.find(({ spec }) => !isVendorPath(spec));
  if (foreign) {
    throw new RefusedError(
      `${argument} declares ${foreign.name} as ${foreign.spec} (${foreign.source} ${foreign.field}); status reads only vendored tarballs.`
    );
  }
  const [commit] = state.commits;
  if (state.commits.length !== 1 || commit === undefined || commit === 'none') {
    throw new RefusedError(`${argument} has a mixed vendored set (${state.commits.join(', ')}); run egdev-ds upgrade.`);
  }
  /** @type {StatusPackage[]} */
  const packages = [];
  for (const pkg of PACKAGES) {
    const name = `@egdev/${pkg}`;
    const own = specs.filter((item) => item.name === name);
    const item = own.find(({ field }) => DEPENDENCY_FIELDS.includes(field)) ?? own[0];
    const file = item ? safeVendorFile(item.spec) : null;
    if (item && file) {
      packages.push({
        name,
        version: versionOf(file),
        file,
        style: item.spec.slice(0, item.spec.length - file.length)
      });
    }
  }
  return {
    packageManager: detectPackageManager(project, manifest).packageManager,
    framework: detectFramework(manifest).framework,
    cssMode: detectCssMode(manifest),
    commit: commit.slice(0, 7),
    packages,
    releaseCommit: release ? release.commit : null,
    upgradeAvailable: release ? !release.commit.startsWith(commit) : null
  };
}
