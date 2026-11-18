import { parseReleasePackArgs, runReleasePack } from './lib/pack-packages.mjs';

// `pnpm release:pack [--out-dir <dir>]`: build, then pack the release set into `release/` (or the
// given folder), verify the packed manifests and record `release.json` (commit, dirty flag, sha256
// per tarball). Exit code 1 keeps `workspace:` specifiers and stale changelogs out of the tarballs;
// misuse exits 2.
let options;
try {
  options = parseReleasePackArgs(process.argv.slice(2));
} catch (failure) {
  console.error(failure.message);
  process.exitCode = 2;
}
if (options) {
  process.exitCode = runReleasePack(options);
}
