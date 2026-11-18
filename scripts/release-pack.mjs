import { runReleasePack } from './lib/pack-packages.mjs';

// `pnpm release:pack`: build, then pack the release set into `release/`, verify the packed
// manifests and record `release.json` (commit, dirty flag, sha256 per tarball). Exit code 1 keeps
// `workspace:` specifiers and stale changelogs out of the tarballs.
process.exitCode = runReleasePack();
