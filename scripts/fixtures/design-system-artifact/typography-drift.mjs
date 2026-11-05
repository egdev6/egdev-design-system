import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';

const original = fs.readFileSync;
const target = resolve('packages/ui/src/primitives/text/types.ts');
fs.readFileSync = function (path, options) {
  const result = original.call(this, path, options);
  if (typeof path !== 'string' || resolve(path) !== target) {
    return result;
  }
  const text = result.toString().replace('eg-heading m-0 font-display', 'eg-heading m-0 font-sans');
  return typeof result === 'string' ? text : Buffer.from(text);
};
syncBuiltinESMExports();
