// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cn } from './cn';

const theme = readFileSync(new URL('../../../tokens/src/theme.css', import.meta.url), 'utf8');
// Tailwind's --text-shadow-* namespace is a glyph shadow, not a font size.
const typographySizes = [...theme.matchAll(/--text-(?!shadow-)([a-z0-9]+(?:-[a-z0-9]+)*):/g)].map((match) => match[1]);
const source = readFileSync(new URL('./cn.ts', import.meta.url), 'utf8');

describe('cn', () => {
  it('resolves conflicting Tailwind utilities in favor of the caller', () => {
    expect(cn('w-full px-4', 'w-auto px-6')).toBe('w-auto px-6');
  });

  it('preserves public EGDEV classes and conditional inputs', () => {
    expect(cn('eg-surface', { 'eg-surface--well': true }, false, undefined)).toBe('eg-surface eg-surface--well');
  });

  it('keeps responsive utilities distinct from base utilities', () => {
    expect(cn('w-full md:w-auto', 'w-1/2')).toBe('md:w-auto w-1/2');
  });
});

describe('cn token typography merging', () => {
  it('registers exactly the token typography sizes, excluding companion properties', () => {
    const declaration = source.match(/const tokenTypographySizes = \[([\s\S]*?)\];/);
    expect(declaration, 'Keep the registered typography scale explicit and auditable').not.toBeNull();
    const registered = [...(declaration?.[1] ?? '').matchAll(/'([^']+)'/g)].map((match) => match[1]);
    expect(typographySizes.length).toBeGreaterThan(0);
    expect(registered).toEqual(typographySizes);
    expect(new Set(registered).size).toBe(registered.length);
  });

  it('keeps each typography size alongside foreground color and a token-backed weight', () => {
    const weight = 'font-[var(--text-body-default--font-weight)]';
    for (const size of typographySizes) {
      for (const color of ['text-fg-default', 'text-fg-secondary', 'text-fg-muted']) {
        expect(cn('eg-label', 'font-sans', `text-${size}`, color, weight).split(' ')).toEqual([
          'eg-label',
          'font-sans',
          `text-${size}`,
          color,
          weight
        ]);
      }
    }
  });

  it('still resolves typography, foreground-color and layout conflicts last', () => {
    for (const first of typographySizes) {
      for (const last of typographySizes) {
        expect(cn(`text-${first}`, `text-${last}`)).toBe(`text-${last}`);
      }
      expect(cn(`text-${first}`, 'text-sm')).toBe('text-sm');
      expect(cn('text-sm', `text-${first}`)).toBe(`text-${first}`);
      expect(cn(`text-${first}`, 'text-fg-secondary', 'text-fg-default')).toBe(`text-${first} text-fg-default`);
    }
    expect(cn('eg-label', 'mt-2', 'mt-4')).toBe('eg-label mt-4');
  });
});
