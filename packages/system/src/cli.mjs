#!/usr/bin/env node
import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { renderSystemMd } from './render-system-md.mjs';

function statIfPresent(path) {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

try {
  const args = process.argv.slice(2);
  if (
    !['--write', '--check'].includes(args[0]) ||
    ![1, 3].includes(args.length) ||
    (args.length === 3 && (args[1] !== '--file' || !args[2]))
  ) {
    throw new Error('Usage: egdev-system-md --write|--check [--file <path>]');
  }
  const root = resolve(process.cwd(), 'design');
  const target = resolve(process.cwd(), args[2] ?? 'design/system.md');
  const rel = relative(root, target);
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error(`Unsafe target: ${target}`);
  }
  let current = root;
  for (const part of ['', ...rel.split(sep)]) {
    if (part) {
      current = resolve(current, part);
    }
    const stat = statIfPresent(current);
    if (
      stat &&
      (stat.isSymbolicLink() || (current === target ? !stat.isFile() || stat.nlink !== 1 : !stat.isDirectory()))
    ) {
      throw new Error(`Unsafe target: ${target}`);
    }
  }
  if (existsSync(root) && realpathSync(root) !== root) {
    throw new Error(`Unsafe target: ${target}`);
  }
  const artifact = JSON.parse(readFileSync(new URL('../design-system.json', import.meta.url), 'utf8'));
  const output = renderSystemMd(artifact);
  if (args[0] === '--check') {
    if (!existsSync(target) || readFileSync(target, 'utf8') !== output) {
      throw new Error(`Stale: ${target}; run --write.`);
    }
  } else {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, output);
    console.log(`${target}: ${(artifact.packages ?? []).map((p) => `${p.name}@${p.version}`).join(', ')}`);
  }
} catch (error) {
  console.error(String(error.message).replaceAll('\n', ' '));
  process.exitCode = 1;
}
