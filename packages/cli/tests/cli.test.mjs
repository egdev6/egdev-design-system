import assert from 'node:assert/strict';
import { test } from 'node:test';
import { flattenMessage } from '../src/cli.mjs';

test('flattenMessage joins lines with one space and trims the whitespace around each break', () => {
  assert.equal(flattenMessage('single line'), 'single line');
  assert.equal(flattenMessage('first  \n   second'), 'first second');
  assert.equal(flattenMessage('a \n\n \t\n b\nc'), 'a b c');
  assert.equal(flattenMessage('keeps  inner  spacing\n'), 'keeps  inner  spacing ');
});

test('flattenMessage stays linear on long whitespace runs (CodeQL js/polynomial-redos)', () => {
  const hostile = `x${' '.repeat(200_000)}\n${' '.repeat(200_000)}y${' '.repeat(200_000)}`;
  const started = performance.now();
  const flattened = flattenMessage(hostile);
  assert.ok(performance.now() - started < 1000);
  assert.equal(flattened, `x y${' '.repeat(200_000)}`);
});
