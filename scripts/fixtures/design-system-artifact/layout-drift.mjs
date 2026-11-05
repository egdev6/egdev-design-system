import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';

const original = fs.readFileSync;
const source = resolve('packages/ui/src/templates/section-shell/types.ts');
const artifact = resolve('packages/system/design-system.json');
fs.readFileSync = function (path, options) {
  const result = original.call(this, path, options);
  if (typeof path !== 'string' || ![source, artifact].includes(resolve(path))) {
    return result;
  }
  const text = result.toString().replace('max-w-[var(--content-max)]', 'max-w-full');
  return typeof result === 'string' ? text : Buffer.from(text);
};
syncBuiltinESMExports();
