import { runReleasePack } from './lib/pack-packages.mjs';

// `pnpm release:pack`: build, then pack the release set into `release/` and verify the packed
// manifests. Exit code 1 keeps `workspace:` specifiers and stale changelogs out of the tarballs.
process.exitCode = runReleasePack();
