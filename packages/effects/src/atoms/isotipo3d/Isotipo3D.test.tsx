import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as effects from '../../index';
import * as isotipoScene from './isotipoScene';
import { isotipoPose } from './isotipoScene';
import type { Isotipo3DProps } from './types';

describe('Isotipo3D public SSR shell', () => {
  it('renders a decorative loading fallback with the original seven polygons', () => {
    const component = Reflect.get(effects, 'Isotipo3D');
    expect(component).toBeDefined();
    const html = renderToStaticMarkup(createElement(component, { id: 'brand', title: 'Decorative' }));
    expect(html).toContain('eg-isotipo-3d');
    expect(html).toContain('data-state="loading"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('id="brand"');
    expect(html).toContain('title="Decorative"');
    expect(html).toContain('--eg-iso3d-opacity:1');
    expect(html.match(/<polygon/g)).toHaveLength(7);
    expect(html).toContain('viewBox="-20 -20 678.45 652.37"');
    expect(html).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(html).toContain('focusable="false"');
    expect(html).toMatch(/<canvas[^>]*hidden/);
    expect(html).not.toMatch(/<svg[^>]*hidden=""/);
  });

  it('merges recognized layout utilities before enforcing the decorative root invariants', () => {
    const component = Reflect.get(effects, 'Isotipo3D');
    const html = renderToStaticMarkup(
      createElement(component, {
        className:
          'absolute mx-4 self-center z-10 w-8 h-8 overflow-visible pointer-events-auto opacity-50 bg-red-500 bg-linear-to-r border-4 shadow-lg ring-4 ring-offset-4 outline-2'
      })
    );
    const rootClass = html.match(/class="([^"]+)"/)?.[1]?.split(' ') ?? [];
    for (const allowed of ['absolute', 'mx-4', 'self-center', 'z-10']) {
      expect(rootClass).toContain(allowed);
    }
    for (const invariant of [
      'h-full',
      'w-full',
      'overflow-hidden',
      'pointer-events-none',
      'opacity-[var(--eg-iso3d-opacity)]',
      'bg-transparent',
      'bg-none',
      'border-0',
      'shadow-none',
      'ring-0',
      'ring-offset-0',
      'outline-none'
    ]) {
      expect(rootClass).toContain(invariant);
    }
    for (const conflict of [
      'relative',
      'w-8',
      'h-8',
      'overflow-visible',
      'pointer-events-auto',
      'opacity-50',
      'bg-red-500',
      'bg-linear-to-r',
      'border-4',
      'shadow-lg',
      'ring-4',
      'ring-offset-4'
    ]) {
      expect(rootClass).not.toContain(conflict);
    }
  });

  it.each(['absolute', 'fixed', 'sticky', 'static', 'relative'])(
    'allows recognized %s placement to replace the default position',
    (position) => {
      const component = Reflect.get(effects, 'Isotipo3D');
      const html = renderToStaticMarkup(createElement(component, { className: `relative ${position}` }));
      const rootClass = html.match(/class="([^"]+)"/)?.[1]?.split(' ') ?? [];
      expect(rootClass).toContain(position);
      if (position !== 'relative') {
        expect(rootClass).not.toContain('relative');
      }
    }
  );

  it('rejects unsafe native overrides and preserves safe div attributes', () => {
    const component = Reflect.get(effects, 'Isotipo3D');
    expect(component).toBeDefined();
    const html = renderToStaticMarkup(
      createElement(
        component,
        {
          'aria-hidden': false,
          role: 'button',
          tabIndex: 0,
          contentEditable: true,
          autoFocus: true,
          style: { color: 'red' },
          'data-state': 'hostile',
          'data-example': 'safe',
          lang: 'en',
          opacity: 0.25
        } as unknown as Isotipo3DProps,
        'forbidden'
      )
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-state="loading"');
    expect(html).toContain('data-example="safe"');
    expect(html).toContain('lang="en"');
    expect(html).toContain('--eg-iso3d-opacity:0.25');
    expect(html).not.toContain('role=');
    expect(html).not.toContain('tabindex=');
    expect(html).not.toContain('contenteditable=');
    expect(html).not.toContain('autofocus=');
    expect(html).not.toContain('color:red');
    expect(html).not.toContain('forbidden');
  });
});

describe('Isotipo3D engine input normalization', () => {
  it.each([
    [-1, 0],
    [0, 0],
    [0.25, 0.25],
    [1, 1],
    [2, 1],
    [Number.NaN, 0],
    [Infinity, 0],
    [-Infinity, 0],
    [null, 0],
    ['0.5', 0]
  ])('normalizes progress %s to %s', (input, expected) => {
    const normalize = Reflect.get(isotipoScene, 'isotipoNormalizeProgress');
    expect(normalize).toBeTypeOf('function');
    expect(normalize(input)).toBe(expected);
  });
});

describe('Isotipo3D source geometry port', () => {
  it('retains the seven clipped source polygons, their order and ink assignment', () => {
    const polygons = Reflect.get(isotipoScene, 'isotipoPolygons');
    expect(polygons).toEqual([
      {
        ink: 'light',
        pixel: false,
        points: '415.52 185.14 415.52 231.18 350.31 197.81 350.31 315.25 477.66 382.29 638.45 297.64'
      },
      { ink: 'shade', pixel: false, points: '288.15 152.23 288.15 315.25 160.80 382.29 0 297.64' },
      { ink: 'light', pixel: false, points: '0 297.64 288.15 449.34 288.15 612.37 0 466.95' },
      { ink: 'shade', pixel: false, points: '638.45 297.64 350.31 449.34 350.31 612.37 638.45 466.95' },
      { ink: 'light', pixel: true, points: '432.36 157.09 353.05 116.52 353.05 37.2 432.36 77.77' },
      { ink: 'light', pixel: true, points: '521.88 74.4 472.66 49.22 472.66 0 521.88 25.18' },
      { ink: 'light', pixel: true, points: '555.8 219.34 487.96 184.64 487.96 116.8 555.8 151.5' }
    ]);
  });

  it('converts source coordinates to centered, vertically inverted scene units and removes closed duplicates', () => {
    const parse = Reflect.get(isotipoScene, 'isotipoParsePolygon');
    expect(parse).toBeTypeOf('function');
    const points = parse('0 0 638.45 0 638.45 612.37 0 612.37 0 0');
    expect(points).toHaveLength(4);
    expect(points[0]?.[0]).toBeCloseTo(-3.19225);
    expect(points[0]?.[1]).toBeCloseTo(3.06185);
    expect(points[2]?.[0]).toBeCloseTo(3.19225);
    expect(points[2]?.[1]).toBeCloseTo(-3.06185);
  });
});

describe('Isotipo3D scene pose port', () => {
  it.each([
    ['hero', 0, -16, 7, 24, 0, 0.3],
    ['hero', 0.2, 14.5, 21.132, 18, 0, 0.3],
    ['hero', 0.4, 45, 35.264, 12, 0, 0.3],
    ['hero', 1, 45, 35.264, 12, 0, 0.3],
    ['chapter', 0, 33, 35.264, 10, 0, 0.2],
    ['chapter', 0.5, 45, 35.264, 10, 0, 0.2],
    ['chapter', 1, 57, 35.264, 10, 0, 0.2],
    ['lab', 0.06, -9.6, 4.72, 30, 0, 0.35],
    ['lab', 0.24, -2.4, 6.88, 30, 0.5, 0.35],
    ['lab', 0.42, 4.8, 9.04, 30, 1, 0.35],
    ['lab', 0.5, 8, 10, 30, 1, 0.35],
    ['lab', 0.7, 16, 12.4, 30, 1, 0.35],
    ['lab', 0.83, 21.2, 13.96, 30, 0.5, 0.35],
    ['lab', 0.96, 26.4, 15.52, 30, 0, 0.35],
    ['outro', 0.2, -20, 12, 26, 0.9, 0.08],
    ['outro', 0.525, 12.5, 23.632, 19, 0.45, 0.18],
    ['outro', 0.85, 45, 35.264, 12, 0, 0.28],
    ['outro', 1, 45, 35.264, 12, 0, 0.28]
  ] as const)('%s at %s uses the approved target pose', (scene, progress, az, el, fov, ex, halo) => {
    const pose = isotipoPose(scene, progress, false);
    for (const [key, value] of Object.entries({ az, el, fov, ex, halo })) {
      expect(pose[key as keyof typeof pose], key).toBeCloseTo(value, 6);
    }
  });

  it.each([
    ['hero', -16, 7, 24, 0, 0.3],
    ['chapter', 45, 35.264, 10, 0, 0.2],
    ['lab', -12, 4, 30, 0, 0.35],
    ['outro', 45, 35.264, 12, 0, 0.28]
  ] as const)('%s reduced motion stays at its fixed assembled pose', (scene, az, el, fov, ex, halo) => {
    for (const progress of [0, 0.5, 1]) {
      const pose = isotipoPose(scene, progress, true);
      for (const [key, value] of Object.entries({ az, el, fov, ex, halo })) {
        expect(pose[key as keyof typeof pose], key).toBeCloseTo(value, 6);
      }
    }
  });
});
