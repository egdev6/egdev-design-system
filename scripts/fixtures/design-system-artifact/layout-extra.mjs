import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';

const read = fs.readFileSync;
const exists = fs.existsSync;
const write = fs.writeFileSync;
const hook = resolve('packages/ui/src/organisms/web-section/useWebSection.ts');
const component = resolve('packages/ui/src/organisms/web-section/WebSection.tsx');
const css = resolve('packages/ui/src/organisms/web-section/web-section.css');
const artifact = resolve('packages/system/design-system.json');
fs.existsSync = function (path) {
  return typeof path === 'string' && resolve(path) === css ? true : exists.call(this, path);
};
fs.readFileSync = function (path, options) {
  if (typeof path === 'string' && resolve(path) === css) {
    return '@media (min-width: 42rem) { .eg-web-section { max-width: var(--content-max); gap: var(--unknown-gap); } }';
  }
  const value = read.call(this, path, options);
  if (typeof path !== 'string') {
    return value;
  }
  let changed = value.toString();
  if (resolve(path) === hook) {
    changed = changed.replace(
      '  return {',
      "  const zoneStyle = { '--eg-zone-x': `${props.offset}%` };\n  const dynamic = cn('gap-4', props.dynamicLayout);\n  return {"
    );
  } else if (resolve(path) === component) {
    changed = changed.replace(
      '<div {...section.rootProps}>',
      '<div {...section.rootProps} className={section.dynamicClass}>'
    );
  } else {
    return value;
  }
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
