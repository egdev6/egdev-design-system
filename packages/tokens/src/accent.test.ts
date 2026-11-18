import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Rgb = readonly [number, number, number];
type AccentTheme = {
  normalizedAccent: string;
  mode: 'default' | 'custom';
  variables: Readonly<Record<string, string>>;
};
type AccentModule = { createAccentTheme: (input: string | null | undefined) => AccentTheme };

// Resolve the public package subpath at test time, so missing distribution is a test failure.
const accentSubpath = '@egdev/tokens/' + 'accent';
const loadAccent = async (): Promise<AccentModule> => import(/* @vite-ignore */ accentSubpath) as Promise<AccentModule>;

const defaultVariables: Readonly<Record<string, string>> = {
  '--color-fg-brand-default': 'var(--color-primitive-red-neon)',
  '--color-fg-brand-raised': 'var(--color-primitive-red-neon)',
  '--color-fg-brand-hover': 'var(--color-primitive-red-light)',
  '--color-border-brand': 'var(--color-alpha-red-45)',
  '--color-border-brand-strong': 'var(--color-primitive-red-dark)',
  '--color-action-primary-solid-bg': 'var(--color-primitive-red-neon)',
  '--color-action-primary-solid-bg-hover': 'var(--color-primitive-red-light)',
  '--color-action-primary-solid-fg': 'var(--color-primitive-black)',
  '--color-focus-ring': 'var(--color-primitive-red-neon)',
  '--shadow-focus': '0 0 0 2px #141518, 0 0 0 4px #FF0036',
  '--gradient-btn-primary': 'linear-gradient(180deg, #FF2D57 0%, #FF0036 52%, #EE0031 100%)',
  '--gradient-btn-primary-hover': 'linear-gradient(180deg, #FF4A6E 0%, #FF1A49 52%, #F00033 100%)',
  '--shadow-btn-primary':
    'inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 0 rgba(0, 0, 0, 0.28), 0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 22px -8px rgba(255, 0, 54, 0.7)',
  '--shadow-btn-primary-hover':
    'inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 0, 54, 0.35), 0 10px 30px -6px rgba(255, 0, 54, 0.75)',
  '--color-state-selected': 'var(--color-action-primary-solid-bg)',
  '--color-on-selected': 'var(--color-action-primary-solid-fg)',
  '--gradient-state-selected': 'var(--gradient-btn-primary)',
  '--shadow-state-selected': 'var(--shadow-btn-primary)',
  '--shadow-state-indicator': 'var(--shadow-glow-base)',
  '--color-link-default': 'var(--color-fg-brand-raised)',
  '--color-link-hover': 'var(--color-primitive-red-200)',
  '--gradient-chip-active': 'linear-gradient(180deg, rgba(255, 0, 54, 0.24), rgba(255, 0, 54, 0.09))'
};

const white: Rgb = [255, 255, 255];
const black: Rgb = [0, 0, 0];
const graphite3: Rgb = [45, 46, 51];

function mix(first: Rgb, second: Rgb, amount: number): Rgb {
  return [
    Math.floor(first[0] * (1 - amount) + second[0] * amount + 0.5 + 1e-10),
    Math.floor(first[1] * (1 - amount) + second[1] * amount + 0.5 + 1e-10),
    Math.floor(first[2] * (1 - amount) + second[2] * amount + 0.5 + 1e-10)
  ];
}

function luminance(color: Rgb): number {
  const linear = (byte: number) => {
    const channel = byte / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(color[0]) + 0.7152 * linear(color[1]) + 0.0722 * linear(color[2]);
}

function contrast(first: Rgb, second: Rgb): number {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function hex(color: Rgb): string {
  return `#${color.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function readColor(value: string): Rgb {
  const hexMatch = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(value.trim());
  if (hexMatch?.[1] && hexMatch[2] && hexMatch[3]) {
    return [Number.parseInt(hexMatch[1], 16), Number.parseInt(hexMatch[2], 16), Number.parseInt(hexMatch[3], 16)];
  }
  const shortHex = /^#([\da-f])([\da-f])([\da-f])$/i.exec(value.trim());
  if (shortHex?.[1] && shortHex[2] && shortHex[3]) {
    return [
      Number.parseInt(shortHex[1].repeat(2), 16),
      Number.parseInt(shortHex[2].repeat(2), 16),
      Number.parseInt(shortHex[3].repeat(2), 16)
    ];
  }
  const rgbMatch = /^rgb\(\s*(\d+)(?:\s*,\s*|\s+)(\d+)(?:\s*,\s*|\s+)(\d+)\s*\)$/i.exec(value.trim());
  if (rgbMatch?.[1] && rgbMatch[2] && rgbMatch[3]) {
    const color: Rgb = [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
    if (color.every((channel) => channel <= 255)) {
      return color;
    }
  }
  throw new Error(`Expected a serialized opaque sRGB color, got ${value}`);
}

function variable(variables: Readonly<Record<string, string>>, name: string): string {
  const value = variables[name];
  if (value === undefined) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

function expectedBase(input: Rgb): { color: Rgb; step: number } {
  const maxSurface = mix(graphite3, white, 0.045);
  for (let step = 0; step <= 255; step++) {
    const candidate = mix(input, white, step / 255);
    if (contrast(candidate, maxSurface) >= 4.6 && contrast(black, mix(candidate, black, 0.28)) >= 4.6) {
      return { color: candidate, step };
    }
  }
  throw new Error(`White must pass both bounds for ${hex(input)}`);
}

function gradientColors(value: string): Rgb[] {
  return [...value.matchAll(/#[\da-f]{6}\b|#[\da-f]{3}\b|rgb\([^()]+\)/gi)].map(([color]) => readColor(color));
}

function normalizedPaint(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .trim();
}

function assertCustomMap(theme: AccentTheme, input: Rgb): void {
  const { color: base } = expectedBase(input);
  const hover = mix(base, white, 0.1);
  const top = mix(base, white, 0.15);
  const middle = mix(base, white, 0.07);
  const bottom = mix(base, white, 0.03);
  const vars = theme.variables;
  expect(theme).toMatchObject({ normalizedAccent: hex(input), mode: 'custom' });
  expect(Object.keys(vars).sort()).toEqual(Object.keys(defaultVariables).sort());
  for (const name of [
    '--color-fg-brand-default',
    '--color-fg-brand-raised',
    '--color-border-brand-strong',
    '--color-action-primary-solid-bg',
    '--color-focus-ring',
    '--color-state-selected',
    '--color-link-default'
  ]) {
    expect(readColor(variable(vars, name)), name).toEqual(base);
  }
  for (const name of ['--color-fg-brand-hover', '--color-action-primary-solid-bg-hover', '--color-link-hover']) {
    expect(readColor(variable(vars, name)), name).toEqual(hover);
  }
  expect(variable(vars, '--color-action-primary-solid-fg')).toBe('var(--color-primitive-black)');
  expect(variable(vars, '--color-on-selected')).toBe('var(--color-primitive-black)');
  const [r, g, b] = base;
  expect(normalizedPaint(variable(vars, '--color-border-brand'))).toBe(`rgba(${r}, ${g}, ${b}, 0.45)`);
  expect(gradientColors(variable(vars, '--shadow-focus'))).toEqual([readColor('#141518'), base]);
  expect(variable(vars, '--shadow-focus').replace(/#[\da-f]{6}\b|#[\da-f]{3}\b|rgb\([^()]+\)/gi, 'COLOR')).toMatch(
    /^0 0 0 2px COLOR,\s*0 0 0 4px COLOR$/
  );
  const restGradient = variable(vars, '--gradient-btn-primary');
  const hoverGradient = variable(vars, '--gradient-btn-primary-hover');
  expect(gradientColors(restGradient)).toEqual([hover, base, bottom]);
  expect(gradientColors(hoverGradient)).toEqual([top, middle, base]);
  for (const gradient of [restGradient, hoverGradient]) {
    expect(gradient.replace(/#[\da-f]{6}\b|#[\da-f]{3}\b|rgb\([^()]+\)/gi, 'COLOR')).toMatch(
      /^linear-gradient\(180deg,\s*COLOR 0%,\s*COLOR 52%,\s*COLOR 100%\)$/
    );
  }
  const restShadow =
    `inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 0 rgba(0, 0, 0, 0.28), ` +
    `0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 22px -8px rgba(${r}, ${g}, ${b}, 0.7)`;
  const hoverShadow =
    `inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 0, 0, 0.25), ` +
    `0 1px 2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(${r}, ${g}, ${b}, 0.35), ` +
    `0 10px 30px -6px rgba(${r}, ${g}, ${b}, 0.75)`;
  expect(normalizedPaint(variable(vars, '--shadow-btn-primary'))).toBe(restShadow);
  expect(normalizedPaint(variable(vars, '--shadow-btn-primary-hover'))).toBe(hoverShadow);
  expect(variable(vars, '--gradient-state-selected')).toBe(restGradient);
  expect(variable(vars, '--shadow-state-selected')).toBe(variable(vars, '--shadow-btn-primary'));
  expect(normalizedPaint(variable(vars, '--shadow-state-indicator'))).toBe(`0 4px 20px 0 rgba(${r}, ${g}, ${b}, 0.15)`);
  expect(normalizedPaint(variable(vars, '--gradient-chip-active'))).toBe(
    `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.24), rgba(${r}, ${g}, ${b}, 0.09))`
  );
  for (const stop of [base, hover, top, middle, bottom]) {
    expect(contrast(stop, mix(graphite3, white, 0.045))).toBeGreaterThanOrEqual(4.6);
    expect(contrast(black, mix(stop, black, 0.28))).toBeGreaterThanOrEqual(4.6);
  }
}

describe('createAccentTheme public contract', () => {
  it('exports the helper at the approved tokens accent subpath', async () => {
    const module = await loadAccent();
    expect(module.createAccentTheme).toBeTypeOf('function');
  });

  it.each([
    ['  AbC  ', '#aabbcc', 'custom'],
    ['#aBc', '#aabbcc', 'custom'],
    ['  A0b1C2  ', '#a0b1c2', 'custom'],
    ['#000', '#000000', 'custom'],
    ['#fff', '#ffffff', 'custom'],
    ['#0000aa', '#0000aa', 'custom'],
    ['#777777', '#777777', 'custom'],
    ['#123456', '#123456', 'custom'],
    ['FF0036', '#ff0036', 'default'],
    [' #Ff0036 ', '#ff0036', 'default']
  ] as const)('normalizes %s to %s in %s mode', async (input, normalizedAccent, mode) => {
    const { createAccentTheme } = await loadAccent();
    expect(createAccentTheme(input)).toMatchObject({ normalizedAccent, mode });
  });

  it('returns every exact original default expression with no unrelated overrides or self-reference', async () => {
    const { createAccentTheme } = await loadAccent();
    const result = createAccentTheme('#ff0036');
    expect(result).toEqual({ normalizedAccent: '#ff0036', mode: 'default', variables: defaultVariables });
    for (const [name, value] of Object.entries(result.variables)) {
      expect(value).not.toContain(`var(${name})`);
    }
  });

  it('reproduces the theme.css chip-active literal for the default accent and derives a different custom sheen', async () => {
    const { createAccentTheme } = await loadAccent();
    const theme = readFileSync(resolve('packages/tokens/src/theme.css'), 'utf8');
    const declaration = /^\s*--gradient-chip-active:\s*([^;]+);/m.exec(theme);
    expect(declaration?.[1]).toBe('linear-gradient(180deg, rgba(255, 0, 54, 0.24), rgba(255, 0, 54, 0.09))');
    const red = createAccentTheme('#ff0036');
    expect(variable(red.variables, '--gradient-chip-active')).toBe(declaration?.[1]);
    const blue = createAccentTheme('#3b82f6');
    const blueSheen = variable(blue.variables, '--gradient-chip-active');
    expect(blueSheen).not.toBe(declaration?.[1]);
    expect(blueSheen).not.toContain('255, 0, 54');
    const [r, g, b] = readColor(variable(blue.variables, '--color-state-selected'));
    expect(blueSheen).toBe(`linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.24), rgba(${r}, ${g}, ${b}, 0.09))`);
  });

  it.each([
    null,
    undefined,
    '',
    '   ',
    '#12',
    '#1234',
    '#12345678',
    '#ggg',
    '##123456',
    '12 3456',
    'rgb(1,2,3)',
    'red',
    'transparent',
    0,
    Number.NaN,
    true,
    {},
    [['#abc']]
  ])('returns the entire unchanged default for invalid input %s', async (input) => {
    const { createAccentTheme } = await loadAccent();
    const previous = createAccentTheme('#123456');
    const before = { ...previous.variables };
    const result = createAccentTheme(input as string | null | undefined);
    expect(result).toEqual({ normalizedAccent: '#ff0036', mode: 'default', variables: defaultVariables });
    expect(previous.variables).toEqual(before);
  });

  it('keeps each returned map immutable and makes no DOM or root-theme writes', async () => {
    const { createAccentTheme } = await loadAccent();
    const rootBefore = document.documentElement.getAttribute('style');
    const bodyBefore = document.body.getAttribute('style');
    const theme = createAccentTheme('#123456');
    const before = { ...theme.variables };
    try {
      Reflect.set(theme.variables, '--color-fg-brand-default', 'red');
      Reflect.set(theme.variables, '--not-approved', 'red');
      Reflect.deleteProperty(theme.variables, '--shadow-focus');
    } catch {
      // A rejecting proxy is also an immutable map.
    }
    expect(theme.variables).toEqual(before);
    expect(createAccentTheme('#123456').variables).toEqual(before);
    expect(createAccentTheme(null).variables).toEqual(defaultVariables);
    expect(document.documentElement.getAttribute('style')).toBe(rootBefore);
    expect(document.body.getAttribute('style')).toBe(bodyBefore);
  });

  it.each([
    [0, 0, 0],
    [255, 255, 255],
    [0, 0, 170],
    [119, 119, 119],
    [18, 52, 86],
    [0, 255, 0],
    [255, 0, 0],
    [127, 128, 129]
  ] as const)('materializes the complete derived map and ink for rgb(%i, %i, %i)', async (r, g, b) => {
    const { createAccentTheme } = await loadAccent();
    const input: Rgb = [r, g, b];
    assertCustomMap(createAccentTheme(hex(input)), input);
  });

  it('chooses the first rounded passing step across channel boundaries and both contrast bounds', async () => {
    const { createAccentTheme } = await loadAccent();
    const values = [0, 1, 31, 63, 64, 95, 127, 128, 159, 191, 223, 254, 255];
    const samples = new Set<string>();
    for (const r of values) {
      for (const g of values) {
        for (const b of values) {
          samples.add(hex([r, g, b]));
        }
      }
    }
    for (let channel = 0; channel <= 255; channel++) {
      samples.add(hex([channel, channel, channel]));
      for (const fixed of [0, 85, 170, 255]) {
        samples.add(hex([channel, fixed, fixed]));
        samples.add(hex([fixed, channel, fixed]));
        samples.add(hex([fixed, fixed, channel]));
      }
    }
    expect(samples.size).toBeGreaterThan(4000);
    const surface = mix(graphite3, white, 0.045);
    expect(surface).toEqual([54, 55, 60]);
    for (const input of samples) {
      if (input === '#ff0036') {
        continue;
      }
      const source = readColor(input);
      const expected = expectedBase(source);
      const theme = createAccentTheme(input);
      const actual = readColor(variable(theme.variables, '--color-action-primary-solid-bg'));
      expect(actual, input).toEqual(expected.color);
      expect(contrast(actual, surface), input).toBeGreaterThanOrEqual(4.6);
      expect(contrast(black, mix(actual, black, 0.28)), input).toBeGreaterThanOrEqual(4.6);
      if (expected.step > 0) {
        const before = mix(source, white, (expected.step - 1) / 255);
        expect(contrast(before, surface) < 4.6 || contrast(black, mix(before, black, 0.28)) < 4.6, input).toBe(true);
      }
    }
  }, 120_000);
});
