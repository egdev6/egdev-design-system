import { describe, expect, it } from 'vitest';
import { cn } from './cn';

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
