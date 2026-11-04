import { describe, expect, it, vi } from 'vitest';
import { ambientProfiles, resolveAmbientColors } from './particleStreaks';

const names = [
  '--color-ambient-bg',
  '--color-ambient-glow',
  '--color-ambient-line',
  '--color-ambient-line-glow',
  '--color-ambient-square',
  '--color-ambient-square-glow'
];

function styleWith(values: string[]) {
  const getPropertyValue = vi.fn((name: string) => values[names.indexOf(name)] ?? '');
  return { style: { getPropertyValue } as unknown as CSSStyleDeclaration, getPropertyValue };
}

describe('private ambient reuse', () => {
  it('exposes the exact existing profiles', () => {
    expect(ambientProfiles).toEqual({
      base: { lineCount: 70, squareCount: 90, speedMultiplier: 1, backgroundGlowOpacity: 0.1 },
      read: { lineCount: 20, squareCount: 25, speedMultiplier: 0.6, backgroundGlowOpacity: 0.1 },
      live: { lineCount: 110, squareCount: 120, speedMultiplier: 1.4, backgroundGlowOpacity: 0.18 }
    });
  });

  it('resolves trimmed three- and six-digit hex from only the supplied style', () => {
    const { style, getPropertyValue } = styleWith([' #AbC ', '#123456', '#abc', '#ABCDEF', '#012', '#fedcba']);
    const computed = vi.spyOn(window, 'getComputedStyle');
    expect(resolveAmbientColors(style)).toEqual({
      backgroundColor: '#AbC',
      backgroundGlowColor: '#123456',
      lineColor: '#abc',
      lineGlowColor: '#ABCDEF',
      squareColor: '#012',
      squareGlowColor: '#fedcba'
    });
    expect(getPropertyValue.mock.calls.map(([name]) => name)).toEqual(names);
    expect(computed).not.toHaveBeenCalled();
    computed.mockRestore();
  });

  it.each(['', '   ', '#12', '#1234', '#12345678', 'red', '#xyz', 'rgb(0, 0, 0)'])(
    'returns no colors when a token is invalid or absent: %s',
    (invalid) => {
      for (let index = 0; index < names.length; index++) {
        const values = names.map(() => '#123');
        values[index] = invalid;
        expect(resolveAmbientColors(styleWith(values).style)).toBeUndefined();
      }
    }
  );
});
