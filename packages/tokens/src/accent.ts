import type { AccentTheme } from './accent-types.js';

export type { AccentTheme } from './accent-types.js';

type Rgb = readonly [number, number, number];

const defaultAccent = '#ff0036';
const black: Rgb = [0, 0, 0];
const white: Rgb = [255, 255, 255];
const graphite3: Rgb = [45, 46, 51];

// These expressions are the approved original values, not aliases to inherited
// semantic roles. Redeclaring all of them lets a nested default scope reset red.
const defaultVariables = Object.freeze({
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
});

// Integer weights implement the specified sRGB interpolation with exact
// half-up rounding, including cases that binary floating point cannot express.
function mix(first: Rgb, second: Rgb, numerator: number, denominator: number): Rgb {
  const channel = (a: number, b: number) =>
    Math.floor((a * (denominator - numerator) + b * numerator) / denominator + 0.5);
  return [channel(first[0], second[0]), channel(first[1], second[1]), channel(first[2], second[2])];
}

function luminance(color: Rgb): number {
  const linearize = (byte: number) => {
    const channel = byte / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(color[0]) + 0.7152 * linearize(color[1]) + 0.0722 * linearize(color[2]);
}

function contrast(first: Rgb, second: Rgb): number {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const maxSurface = mix(graphite3, white, 45, 1000);

function accessibleBase(input: Rgb): Rgb {
  for (let step = 0; step < 255; step++) {
    const candidate = mix(input, white, step, 255);
    const bevel = mix(candidate, black, 28, 100);
    if (contrast(candidate, maxSurface) >= 4.6 && contrast(black, bevel) >= 4.6) {
      return candidate;
    }
  }
  // At step 255 the candidate is white. White and its rounded 28% black
  // composite both exceed 4.6 against the specified surface/ink respectively.
  return white;
}

function normalize(input: string | null | undefined): string {
  if (typeof input !== 'string') {
    return defaultAccent;
  }
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(input.trim());
  const digits = match?.[1]?.toLowerCase();
  if (!digits) {
    return defaultAccent;
  }
  if (digits.length === 3) {
    return `#${[...digits].map((digit) => digit + digit).join('')}`;
  }
  return `#${digits}`;
}

function rgb(normalized: string): Rgb {
  const value = Number.parseInt(normalized.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function hex(color: Rgb): string {
  return `#${color.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function rgba(color: Rgb, alpha: number): string {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function customVariables(base: Rgb): AccentTheme['variables'] {
  const color = hex(base);
  const hover = hex(mix(base, white, 10, 100));
  const restGradient = `linear-gradient(180deg, ${hover} 0%, ${color} 52%, ${hex(mix(base, white, 3, 100))} 100%)`;
  const hoverGradient = `linear-gradient(180deg, ${hex(mix(base, white, 15, 100))} 0%, ${hex(mix(base, white, 7, 100))} 52%, ${color} 100%)`;
  const restShadow =
    `inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 0 rgba(0, 0, 0, 0.28), ` +
    `0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 22px -8px ${rgba(base, 0.7)}`;
  const hoverShadow =
    `inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 0, 0, 0.25), ` +
    `0 1px 2px rgba(0, 0, 0, 0.6), 0 0 0 1px ${rgba(base, 0.35)}, 0 10px 30px -6px ${rgba(base, 0.75)}`;
  return Object.freeze({
    '--color-fg-brand-default': color,
    '--color-fg-brand-raised': color,
    '--color-fg-brand-hover': hover,
    '--color-border-brand': rgba(base, 0.45),
    '--color-border-brand-strong': color,
    '--color-action-primary-solid-bg': color,
    '--color-action-primary-solid-bg-hover': hover,
    '--color-action-primary-solid-fg': 'var(--color-primitive-black)',
    '--color-focus-ring': color,
    '--shadow-focus': `0 0 0 2px #141518, 0 0 0 4px ${color}`,
    '--gradient-btn-primary': restGradient,
    '--gradient-btn-primary-hover': hoverGradient,
    '--shadow-btn-primary': restShadow,
    '--shadow-btn-primary-hover': hoverShadow,
    '--color-state-selected': color,
    '--color-on-selected': 'var(--color-primitive-black)',
    '--gradient-state-selected': restGradient,
    '--shadow-state-selected': restShadow,
    '--shadow-state-indicator': `0 4px 20px 0 ${rgba(base, 0.15)}`,
    '--color-link-default': color,
    '--color-link-hover': hover,
    '--gradient-chip-active': `linear-gradient(180deg, ${rgba(base, 0.24)}, ${rgba(base, 0.09)})`
  });
}

/** Derive the complete dark-theme accent map without changing the DOM. */
export function createAccentTheme(input: string | null | undefined): AccentTheme {
  const normalizedAccent = normalize(input);
  if (normalizedAccent === defaultAccent) {
    return { normalizedAccent, mode: 'default', variables: defaultVariables };
  }
  return { normalizedAccent, mode: 'custom', variables: customVariables(accessibleBase(rgb(normalizedAccent))) };
}
