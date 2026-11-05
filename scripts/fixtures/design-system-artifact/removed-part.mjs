import fs from 'node:fs';
import { resolve } from 'node:path';

// Simulate removing a source export in this child process only; never edit the worktree.
const original = fs.readFileSync;
const target = resolve('packages/ui/src/organisms/top-bar/TopBar.tsx');
fs.readFileSync = function (path, options) {
  const result = original.call(this, path, options);
  if (typeof path !== 'string' || resolve(path) !== target) {
    return result;
  }
  const source = result.toString().replace('export const TopBarUserMenu:', 'const TopBarUserMenu:');
  return typeof result === 'string' ? source : Buffer.from(source);
};
