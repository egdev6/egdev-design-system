import fs from 'node:fs';
import { resolve } from 'node:path';

const original = fs.readFileSync;
const target = resolve('packages/ui/src/templates/web-template/WebTemplate.tsx');
fs.readFileSync = function (path, options) {
  const result = original.call(this, path, options);
  if (typeof path !== 'string' || resolve(path) !== target) {
    return result;
  }
  const source = result.toString().replaceAll('<Button ', '<button ').replaceAll('</Button>', '</button>');
  return typeof result === 'string' ? source : Buffer.from(source);
};
