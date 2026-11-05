import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';

const read = fs.readFileSync;
const write = fs.writeFileSync;
const button = resolve('packages/ui/src/atoms/button/types.ts');
const artifact = resolve('packages/system/design-system.json');
fs.readFileSync = function (path, options) {
  const value = read.call(this, path, options);
  if (typeof path !== 'string' || resolve(path) !== button) {
    return value;
  }
  const changed = value
    .toString()
    .replace('rounded-md font-sans', 'shadow-[var(--shadow-edge),var(--unknown-mixed)] font-sans');
  return typeof value === 'string' ? changed : Buffer.from(changed);
};
fs.writeFileSync = function (path, value, ...rest) {
  if (typeof path === 'string' && resolve(path) === artifact) {
    process.stdout.write(value);
    return;
  }
  return write.call(this, path, value, ...rest);
};
syncBuiltinESMExports();
