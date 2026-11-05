import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';

// Change only the child process's view of the component source, not the worktree.
const original = fs.readFileSync;
const button = resolve('packages/ui/src/atoms/button/types.ts');
const artifact = resolve('packages/system/design-system.json');
fs.readFileSync = function (path, options) {
  const result = original.call(this, path, options);
  if (typeof path !== 'string' || ![button, artifact].includes(resolve(path))) {
    return result;
  }
  // Keep the old flattened variants in sync so only anatomy can detect the drift.
  const text = result.toString().replace('rounded-md font-sans', 'rounded-lg font-sans');
  return typeof result === 'string' ? text : Buffer.from(text);
};
syncBuiltinESMExports();
