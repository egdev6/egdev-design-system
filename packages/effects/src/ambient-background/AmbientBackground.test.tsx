import { type CSSProperties, createElement, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as effects from '../index';

describe('AmbientBackground public SSR shell', () => {
  it('renders a passive stopped canvas with the default opacity and native attributes', () => {
    const Component = Reflect.get(effects, 'AmbientBackground');
    expect(Component).toBeDefined();
    const html = renderToStaticMarkup(createElement(Component, { id: 'ambient', title: 'Decoration' }));
    expect(html).toContain('eg-ambient-background');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-state="stopped"');
    expect(html).toContain('--eg-ambient-opacity:1');
    expect(html).toContain('id="ambient"');
    expect(html).toContain('title="Decoration"');
    expect(html).toContain('<canvas');
  });

  it('keeps its decorative canvas and opacity when native overrides conflict', () => {
    const Component = Reflect.get(effects, 'AmbientBackground');
    expect(Component).toBeDefined();
    const html = renderToStaticMarkup(
      createElement(
        Component,
        {
          'aria-hidden': false,
          tabIndex: 0,
          style: { '--eg-ambient-opacity': 0.1 } as CSSProperties,
          opacity: 0.5
        },
        'Interactive content'
      )
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('tabindex=');
    expect(html).not.toContain('Interactive content');
    expect(html).toContain('--eg-ambient-opacity:0.5');
    expect(html).toContain('<canvas');
  });

  it.each([
    [-2, '0'],
    [0.35, '0.35'],
    [2, '1'],
    [Number.NaN, '0'],
    [Infinity, '0'],
    [-Infinity, '0']
  ])('normalizes opacity %s to %s', (opacity, expected) => {
    const Component = Reflect.get(effects, 'AmbientBackground');
    expect(Component).toBeDefined();
    const html = renderToStaticMarkup(createElement(Component, { opacity, ref: createRef<HTMLDivElement>() }));
    expect(html).toContain(`--eg-ambient-opacity:${expected}`);
  });
});
