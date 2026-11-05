import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { renderSystemMd } from '../packages/system/src/render-system-md.mjs';

const target = new URL('../packages/system/system.md', import.meta.url);
try {
  if (process.argv.length !== 3 || !['--write', '--check'].includes(process.argv[2])) {
    throw new Error('Usage: node scripts/system-md.mjs --write|--check');
  }
  const artifact = JSON.parse(readFileSync(new URL('../packages/system/design-system.json', import.meta.url), 'utf8'));
  const output = renderSystemMd(artifact);
  if (process.argv[2] === '--write') {
    writeFileSync(target, output);
  } else if (!existsSync(target) || readFileSync(target, 'utf8') !== output) {
    throw new Error('Stale: packages/system/system.md; run --write.');
  }
} catch (error) {
  console.error(String(error.message).replaceAll('\n', ' '));
  process.exitCode = 1;
}
