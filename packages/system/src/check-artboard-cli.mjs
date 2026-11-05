#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { checkArtboard, tokensFromSystem } from './check-artboard.mjs';

try {
  const args = process.argv.slice(2);
  if (
    !args[0] ||
    args[0].startsWith('--') ||
    !(
      args.length === 1 ||
      (args.length === 2 && args[1] === '--artifact') ||
      (args.length === 3 && args[1] === '--system' && args[2] && !args[2].startsWith('--'))
    )
  ) {
    throw new Error('Usage: egdev-artboard-check <file.html> [--system <path>|--artifact]');
  }
  const html = readFileSync(args[0], 'utf8');
  const tokens =
    args[1] === '--system'
      ? tokensFromSystem(readFileSync(args[2], 'utf8'))
      : JSON.parse(readFileSync(new URL('../design-system.json', import.meta.url), 'utf8')).tokens;
  const result = checkArtboard(html, tokens);
  process.stdout.write(result.output);
  if (result.untraced) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message.replaceAll('\n', ' '));
  process.exitCode = 1;
}
