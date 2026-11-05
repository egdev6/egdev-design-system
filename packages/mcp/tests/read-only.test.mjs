import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';

function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) {
      check(path);
    } else if (entry.name.endsWith('.ts')) {
      assert.doesNotMatch(readFileSync(path, 'utf8'), /node:(?:http|https|net|dgram)|\bfetch\s*\(/);
    }
  }
}
test('server source does not use network APIs', () => check(new URL('../src/', import.meta.url)));
