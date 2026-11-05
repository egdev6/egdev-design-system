import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';

// Affect only the child process: expose stale JSON bytes without changing the real artifact.
const original = fs.readFileSync;
const artifact = resolve('packages/system/design-system.json');
fs.readFileSync = function (path, options) {
  const result = original.call(this, path, options);
  if (typeof path !== 'string' || resolve(path) !== artifact) {
    return result;
  }
  const stale = JSON.parse(result.toString());
  stale.tokens.pop();
  const text = `${JSON.stringify(stale, null, 2)}\n`;
  return typeof result === 'string' ? text : Buffer.from(text);
};
syncBuiltinESMExports();
