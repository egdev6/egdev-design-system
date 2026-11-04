import { describe, expect, it } from 'vitest';
import { computeTargets, deriveBands, resolveZones } from './homeDirector';

const geometry = (heights: number[]) =>
  heights.map((height, i) => ({ top: heights.slice(0, i).reduce((a, b) => a + b, 0), height }));
const zones = resolveZones([
  { id: 'a', isotipo: true, scene: 'hero' },
  { id: 'b', profile: 'live' },
  { id: 'c', profile: 'read' }
]).zones;

describe('home director', () => {
  it.each([
    [NaN, 0],
    [Infinity, 1],
    [-Infinity, 0],
    [-0.1, 0],
    [1.1, 1],
    [0, 0],
    [1, 1]
  ] as const)('normalizes ambient %s to %s without warnings', (value, expected) => {
    const result = resolveZones([{ id: 'zone', ambient: value }]);
    expect(result.zones).toMatchObject([
      { id: 'zone', isotipo: false, ambient: expected, profile: 'base', mobileIsotipo: true }
    ]);
    expect(result.warnings).toEqual([]);
  });
  it('resolves ownership conflicts and invalid scenes with explicit warnings', () => {
    expect(resolveZones([{ id: 'x', isotipo: true, scene: 'hero', ambient: Infinity }])).toEqual({
      zones: [{ id: 'x', isotipo: true, scene: 'hero', ambient: 0, profile: 'base', mobileIsotipo: true }],
      warnings: ['Conflicting ownership: x']
    });
    for (const scene of [undefined, 'bad' as 'hero']) {
      expect(resolveZones([{ id: 'x', isotipo: true, scene, ambient: 0 }])).toEqual({
        zones: [{ id: 'x', isotipo: false, ambient: 1, profile: 'base', mobileIsotipo: true }],
        warnings: ['Invalid scene: x']
      });
    }
    expect(
      resolveZones([
        { id: 'x', scene: 'lab' },
        { id: 'x', isotipo: true, scene: 'hero' }
      ])
    ).toEqual({
      zones: [{ id: 'x', isotipo: false, ambient: 1, profile: 'base', mobileIsotipo: true }],
      warnings: ['Duplicate zone: x']
    });
  });
  it('keeps a single effectless zone stable at any reading point', () => {
    const single = resolveZones([{ id: 'x', ambient: 0 }]).zones;
    const g = geometry([900]);
    const table = deriveBands(g, 900, 0);
    for (const scroll of [-100, 0, 1000]) {
      expect(computeTargets(single, g, table, scroll, 900, 1000, false)).toMatchObject({
        active: 'x',
        isotipo: 0,
        ambient: 0
      });
    }
  });
  it('distinguishes both sides of each band edge', () => {
    const g = geometry([900, 900]);
    const table = deriveBands(g, 900, 1800);
    const pair = zones.slice(0, 2);
    const before = computeTargets(pair, g, table, -0.01, 900, 1000, false);
    const insideStart = computeTargets(pair, g, table, 0.01, 900, 1000, false);
    const insideEnd = computeTargets(pair, g, table, 674.99, 900, 1000, false);
    const after = computeTargets(pair, g, table, 675.01, 900, 1000, false);
    expect(before).toMatchObject({ active: 'a', isotipo: 1, ambient: 0, mix: { a: 'a', b: 'a', t: 0 } });
    expect(insideStart?.mix.t).toBeCloseTo(0.01 / 675);
    expect(insideStart?.isotipo).toBeCloseTo(1 - 0.02 / 675);
    expect(insideEnd?.mix.t).toBeCloseTo(1 - 0.01 / 675);
    expect(insideEnd?.ambient).toBeCloseTo(1 - 0.02 / 675);
    expect(after).toMatchObject({ active: 'b', isotipo: 0, ambient: 1, mix: { a: 'b', b: 'b', t: 0 } });
    expect(before?.position).toBeCloseTo(449.99 / 900);
    expect(after?.position).toBeCloseTo(1 + 225.01 / 900);
  });
  it.each([
    ['base', 'read', 53, 68, 0.867, 0.1],
    ['read', 'base', 37, 47, 0.733, 0.1],
    ['base', 'live', 83, 100, 1.133, 0.1266],
    ['live', 'base', 97, 110, 1.267, 0.1534],
    ['read', 'live', 50, 57, 0.866, 0.1266],
    ['live', 'read', 80, 88, 1.134, 0.1534],
    ['base', 'base', 70, 90, 1, 0.1],
    ['read', 'read', 20, 25, 0.6, 0.1],
    ['live', 'live', 110, 120, 1.4, 0.18]
  ] as const)('interpolates profile %s to %s with rounding', (a, b, lines, squares, speed, glow) => {
    const g = geometry([900, 900]);
    const pair = resolveZones([
      { id: 'a', profile: a },
      { id: 'b', profile: b }
    ]).zones;
    const result = computeTargets(pair, g, deriveBands(g, 900, 1800), 675 * 0.333, 900, 700, false);
    expect(result?.profile).toEqual({
      lineCount: lines,
      squareCount: squares,
      speedMultiplier: speed,
      backgroundGlowOpacity: glow
    });
  });
  it.each([0.001999, 0.002, 0.002001])('preserves the cutoff at %s in both handoff directions', (value) => {
    const g = geometry([900, 900]);
    const table = deriveBands(g, 900, 1800);
    const ambient = { id: 'ambient', ambient: value };
    const logo = { id: 'logo', isotipo: true, scene: 'hero' as const };
    for (const [input, scroll] of [
      [[ambient, logo], 0],
      [[logo, ambient], 675]
    ] as const) {
      const result = computeTargets(resolveZones(input).zones, g, table, scroll, 900, 1000, false);
      expect(result).toMatchObject({ active: 'ambient', isotipo: 0, ambient: value < 0.002 ? 0 : value });
    }
  });
  it('enforces the safety gate in both directions and both halves', () => {
    const g = geometry([900, 900]);
    const table = deriveBands(g, 900, 1800);
    const base = resolveZones([{ id: 'a', isotipo: true, scene: 'hero' }, { id: 'b' }]).zones;
    const a = base[0];
    const b = base[1];
    if (!a || !b) {
      throw new Error('fixture');
    }
    // Synthetic overlapping presences exercise the defensive gate independently of normalization.
    const overlap = [
      { ...a, ambient: 1 },
      { ...b, isotipo: true }
    ];
    for (const pair of [overlap, [...overlap].reverse()]) {
      expect(computeTargets(pair, g, table, 675 * 0.25, 900, 1000, false)).toMatchObject({ isotipo: 1, ambient: 0 });
      expect(computeTargets(pair, g, table, 675 * 0.5, 900, 1000, false)).toMatchObject({ isotipo: 0, ambient: 1 });
      expect(computeTargets(pair, g, table, 675 * 0.75, 900, 1000, false)).toMatchObject({ isotipo: 0, ambient: 1 });
    }
  });
  it('derives and validates all A1 witness bands', () => {
    expect(deriveBands(geometry([100, 100]), 900, 0)).toEqual({ valid: false, bands: [{ start: -225, end: 450 }] });
    expect(deriveBands(geometry([300, 300, 300]), 900, 0)).toEqual({
      valid: false,
      bands: [
        { start: -225, end: 450 },
        { start: 450, end: 451 }
      ]
    });
    expect(deriveBands(geometry([300, 300, 300]), 900, 1800)).toEqual({
      valid: false,
      bands: [
        { start: 450, end: 1125 },
        { start: 1125, end: 1126 }
      ]
    });
    expect(deriveBands(geometry([900, 900, 900]), 900, 1800)).toEqual({
      valid: true,
      bands: [
        { start: 450, end: 1125 },
        { start: 1327.5, end: 2002.5 }
      ]
    });
    expect(deriveBands(geometry([900]), 900, 0)).toEqual({ valid: true, bands: [] });
    expect(deriveBands([], 900, 0)).toEqual({ valid: false, bands: [] });
  });
  it('normalizes ownership, ambient, scene, defaults and duplicates', () => {
    const result = resolveZones([
      { id: 'nan', ambient: NaN },
      { id: 'plus', ambient: Infinity },
      { id: 'minus', ambient: -Infinity },
      { id: 'low', ambient: -1 },
      { id: 'high', ambient: 2 },
      { id: 'zero', ambient: 0 },
      { id: 'iso', isotipo: true, scene: 'hero', ambient: 0.5 },
      { id: 'missing', isotipo: true, ambient: 0 },
      { id: 'invalid', isotipo: true, scene: 'bad' as 'hero' },
      { id: 'ignored', scene: 'lab' },
      { id: 'iso', ambient: 1 }
    ]);
    expect(result.zones.map((z) => z.ambient)).toEqual([0, 1, 0, 0, 1, 0, 0, 1, 1, 1]);
    expect(result.zones[6]).toMatchObject({ isotipo: true, ambient: 0, profile: 'base', mobileIsotipo: true });
    expect(result.zones[7]).toMatchObject({ isotipo: false, ambient: 1 });
    expect(result.zones[8]).toMatchObject({ isotipo: false, ambient: 1 });
    expect(result.zones[9]?.scene).toBeUndefined();
    expect(result.warnings).toHaveLength(4);
  });
  it('samples handoffs, edges, active identity and reduced motion', () => {
    const g = geometry([900, 900, 900]);
    const bands = deriveBands(g, 900, 1800);
    for (const [t, iso, ambient, active] of [
      [0, 1, 0, 'a'],
      [0.25, 0.5, 0, 'a'],
      [0.5, 0, 0, 'b'],
      [0.75, 0, 0.5, 'b'],
      [1, 0, 1, 'b']
    ] as const) {
      const result = computeTargets(zones, g, bands, 675 * t, 900, 1000, false);
      expect(result).toMatchObject({ isotipo: iso, ambient, active, mix: { t } });
    }
    expect(computeTargets(zones, g, bands, -0.01, 900, 1000, false)?.active).toBe('a');
    expect(computeTargets(zones, g, bands, 675.01, 900, 1000, false)?.active).toBe('b');
    expect(computeTargets(zones, g, bands, 337.5, 900, 1000, true)).toMatchObject({
      active: 'b',
      isotipo: 0,
      ambient: 1,
      mix: { t: 1 }
    });
    expect(computeTargets(zones, g, bands, 337.49, 900, 1000, true)).toMatchObject({
      active: 'a',
      isotipo: 1,
      ambient: 0,
      mix: { t: 0 }
    });
    expect(computeTargets([], [], deriveBands([], 900, 0), 0, 900, 1000, false)).toBeNull();
    expect(computeTargets(zones, g, deriveBands(geometry([300, 300, 300]), 900, 1800), 0, 900, 1000, false)).toBeNull();
  });
  it('applies the 0.002 cutoff to a fading isotipo layer', () => {
    const g = geometry([900, 900]);
    const bands = deriveBands(g, 900, 1800);
    const zones = resolveZones([{ id: 'logo', isotipo: true, scene: 'hero' }, { id: 'reading' }]).zones;
    const at = (value: number) => computeTargets(zones, g, bands, ((1 - value) / 2) * 675, 900, 1000, false);
    expect(at(0.0015)?.isotipo).toBe(0);
    expect(at(0.0025)?.isotipo).toBeCloseTo(0.0025, 6);
    expect(at(0.0025)?.ambient).toBe(0);
  });
  it('gates the cutoff and reverses the layer handoff', () => {
    const g = geometry([900, 900]);
    const bands = deriveBands(g, 900, 1800);
    for (const value of [0.001999, 0.002, 0.002001]) {
      const a = resolveZones([
        { id: 'a', ambient: value },
        { id: 'b', isotipo: true, scene: 'hero' }
      ]).zones;
      const result = computeTargets(a, g, bands, 0, 900, 1000, false);
      expect(result?.ambient).toBe(value < 0.002 ? 0 : value);
      expect(result?.isotipo).toBe(0);
    }
    const reverse = resolveZones([{ id: 'a' }, { id: 'b', isotipo: true, scene: 'hero' }]).zones;
    expect(computeTargets(reverse, g, bands, 675 * 0.25, 900, 1000, false)).toMatchObject({ ambient: 0.5, isotipo: 0 });
    expect(computeTargets(reverse, g, bands, 675 * 0.75, 900, 1000, false)).toMatchObject({ ambient: 0, isotipo: 0.5 });
  });
  it('interpolates same-layer profiles, mobile gates and counts', () => {
    const g = geometry([900, 900]);
    const bands = deriveBands(g, 900, 1800);
    const same = resolveZones([
      { id: 'a', profile: 'read', ambient: 0.2 },
      { id: 'b', profile: 'live', ambient: 0.8 }
    ]).zones;
    const mixed = computeTargets(same, g, bands, 675 * 0.25, 900, 700, false);
    expect(mixed?.ambient).toBeCloseTo(0.35);
    expect(mixed?.profile).toEqual({
      lineCount: 43,
      squareCount: 49,
      speedMultiplier: 0.8,
      backgroundGlowOpacity: 0.12
    });
    expect(computeTargets(same, g, bands, 675 * 0.25, 900, 699, false)?.profile).toMatchObject({
      lineCount: 26,
      squareCount: 29
    });
    const mobile = resolveZones([{ id: 'a', isotipo: true, scene: 'chapter', mobileIsotipo: false }]).zones;
    for (const width of [759, 760]) {
      expect(
        computeTargets(mobile, geometry([900]), deriveBands(geometry([900]), 900, 0), 0, 900, width, false)
      ).toMatchObject({ isotipo: 0, ambient: 1 });
    }
    expect(
      computeTargets(mobile, geometry([900]), deriveBands(geometry([900]), 900, 0), 0, 900, 761, false)
    ).toMatchObject({ isotipo: 1, ambient: 0 });
    const zero = resolveZones([{ id: 'z', ambient: 0 }]).zones;
    expect(
      computeTargets(zero, geometry([900]), deriveBands(geometry([900]), 900, 0), 0, 900, 1000, false)
    ).toMatchObject({ isotipo: 0, ambient: 0, active: 'z' });
  });
});
