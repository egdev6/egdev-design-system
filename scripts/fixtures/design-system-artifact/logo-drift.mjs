import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';

const read = fs.readFileSync;
const target = resolve('packages/ui/src/atoms/logo/logo-artwork.ts');
fs.readFileSync = function (path, options) {
  const value = read.call(this, path, options);
  if (typeof path !== 'string' || resolve(path) !== target) {
    return value;
  }
  const changed = value.toString().replace('M381.632 89.944', 'M381.633 89.944');
  return typeof value === 'string' ? changed : Buffer.from(changed);
};
syncBuiltinESMExports();
