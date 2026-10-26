import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';
import { iconPaths } from './icon-paths';
import type { IconName, IconSize } from './types';
import { useIcon } from './useIcon';

const names = Object.keys(iconPaths) as IconName[];
const sizes: [IconSize, string][] = [
  ['sm', 'size-4'],
  ['md', 'size-(--icon-size)'],
  ['lg', 'size-7']
];
const glyphElements = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon']);

const svgOf = (container: HTMLElement) => {
  const svg = container.querySelector('svg.eg-icon');
  if (!svg) {
    throw new Error('Icon must render an svg root with the eg-icon marker');
  }
  return svg;
};

describe('Icon glyph set', () => {
  it('ships the closed 42-name set, including the marks needed by sibling atoms and organisms', () => {
    expect(names).toHaveLength(42);
    for (const name of ['check', 'minus', 'plus', 'chevron-down', 'grip', 'flask', 'trash'] as const) {
      expect(names).toContain(name);
    }
  });

  it.each(names)('renders %s as a 24x24 viewBox svg with its own glyph elements', (name) => {
    const { container } = render(<Icon name={name} />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    const children = [...svg.children];
    expect(children).toHaveLength(iconPaths[name].length);
    children.forEach((child, index) => {
      const [element, attributes] = iconPaths[name][index] ?? [];
      expect(child.tagName).toBe(element);
      expect(glyphElements.has(child.tagName)).toBe(true);
      for (const [attribute, value] of Object.entries(attributes ?? {})) {
        expect(child.getAttribute(attribute), `${name} ${element} ${attribute}`).toBe(value);
      }
    });
  });

  it('keeps verbatim Lucide geometry for the added marks', () => {
    const d = (name: IconName) =>
      [...svgOf(render(<Icon name={name} />).container).querySelectorAll('path')].map((path) => path.getAttribute('d'));
    expect(d('check')).toEqual(['M20 6 9 17l-5-5']);
    expect(d('minus')).toEqual(['M5 12h14']);
    expect(d('plus')).toEqual(['M5 12h14', 'M12 5v14']);
  });

  it('rejects unknown names at the type level', () => {
    // @ts-expect-error The glyph set is closed; there is no runtime fallback glyph.
    const unknown = <Icon name='unknown-glyph' />;
    expect(unknown).toBeTruthy();
  });

  it('swaps glyph paths on rerender while keeping the same root element', () => {
    const { container, rerender } = render(<Icon name='search' />);
    const before = svgOf(container);
    rerender(<Icon name='close' />);
    const after = svgOf(container);
    expect(after === before).toBe(true);
    expect([...after.querySelectorAll('path')].map((path) => path.getAttribute('d'))).toEqual([
      'M18 6 6 18',
      'm6 6 12 12'
    ]);
    expect(after.querySelector('circle')).toBeNull();
  });
});

describe('Icon appearance', () => {
  it('defaults to a 20px stroke-only glyph with round geometry inheriting currentColor', () => {
    const { container } = render(<Icon name='radio' />);
    const svg = svgOf(container);
    expect(svg).toHaveClass(
      'eg-icon',
      'inline-block',
      'shrink-0',
      'align-middle',
      'stroke-current',
      'stroke-(length:--icon-stroke)',
      'size-(--icon-size)',
      'fill-none'
    );
    expect(svg).not.toHaveClass('fill-current');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
    for (const attribute of ['width', 'height', 'fill', 'stroke', 'stroke-width', 'style', 'data-state']) {
      expect(svg).not.toHaveAttribute(attribute);
    }
  });

  it.each(sizes)('maps size %s to the %s preset', (size, utility) => {
    const { result } = renderHook(() => useIcon({ name: 'radio', size }));
    const classes = result.current.svgProps.className.split(' ');
    expect(classes).toContain(utility);
    expect(classes.filter((name) => name.startsWith('size-'))).toEqual([utility]);
  });

  it('fills the glyph with currentColor when filled, keeping the stroke', () => {
    const { container } = render(<Icon name='play' filled={true} size='lg' />);
    const svg = svgOf(container);
    expect(svg).toHaveClass('fill-current', 'stroke-current', 'size-7');
    expect(svg).not.toHaveClass('fill-none');
    expect(svg).not.toHaveAttribute('filled');
  });

  it('lets supported size, color and layout utilities win while keeping the public marker', () => {
    const { container } = render(<Icon name='arrow-right' size='lg' className='size-3.5 text-fg-brand-default mt-1' />);
    const svg = svgOf(container);
    expect(svg).toHaveClass('eg-icon', 'size-3.5', 'text-fg-brand-default', 'mt-1');
    expect(svg).not.toHaveClass('size-7');
    const classes = (svg.getAttribute('class') ?? '').split(' ');
    expect(classes.filter((name) => name.startsWith('size-'))).toEqual(['size-3.5']);
  });
});

describe('Icon accessibility', () => {
  it('is decorative by default: hidden, not focusable and without a name or role', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <button type='button'>Before</button>
        <Icon name='search' />
        <button type='button'>After</button>
      </>
    );
    const svg = svgOf(container);
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    for (const attribute of ['role', 'aria-label', 'aria-labelledby', 'tabindex']) {
      expect(svg).not.toHaveAttribute(attribute);
    }
    expect(svg.querySelector('title')).toBeNull();
    expect(container.querySelectorAll('span')).toHaveLength(0);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('names an informative icon through AccessibleIcon without a manual role or title', () => {
    const { container } = render(
      <button type='button'>
        <Icon name='search' label='Search' />
      </button>
    );
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getAllByText('Search')).toHaveLength(1);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveClass('eg-icon', 'size-(--icon-size)');
    expect(svg).not.toHaveAttribute('role');
    expect(svg).not.toHaveAttribute('label');
    expect(svg.querySelector('title')).toBeNull();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('treats an empty label as absent and stays decorative', () => {
    const { container } = render(
      <button type='button'>
        <Icon name='search' label='' />
        Find
      </button>
    );
    expect(screen.getByRole('button', { name: 'Find' })).toBeInTheDocument();
    expect(container.querySelectorAll('span')).toHaveLength(0);
    expect(svgOf(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('reports the decorative or labelled mode from the hook', () => {
    expect(renderHook(() => useIcon({ name: 'bell' })).result.current.label).toBeUndefined();
    expect(renderHook(() => useIcon({ name: 'bell', label: '' })).result.current.label).toBeUndefined();
    expect(renderHook(() => useIcon({ name: 'bell', label: 'Notifications' })).result.current.label).toBe(
      'Notifications'
    );
  });
});

describe('Icon native attributes', () => {
  it('forwards compatible svg attributes', () => {
    const { container } = render(
      <>
        <p id='icon-hint'>Opens the search dialog</p>
        <Icon
          name='search'
          id='consumer-icon'
          data-source='consumer'
          aria-describedby='icon-hint'
          style={{ verticalAlign: 'text-bottom' }}
        />
      </>
    );
    const svg = svgOf(container);
    expect(svg).toHaveAttribute('id', 'consumer-icon');
    expect(svg).toHaveAttribute('data-source', 'consumer');
    expect(svg).toHaveAttribute('aria-describedby', 'icon-hint');
    expect(svg).toHaveStyle({ verticalAlign: 'text-bottom' });
  });

  it('keeps geometry, paint and naming invariants against unsupported JavaScript spreads', () => {
    const unsupported = {
      children: 'Not permitted',
      dangerouslySetInnerHTML: { __html: '<circle r="12" />' },
      viewBox: '0 0 48 48',
      role: 'img',
      'aria-hidden': false,
      'aria-label': 'Wrong label',
      'aria-labelledby': 'other',
      focusable: 'true',
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 4,
      width: 64,
      height: 64,
      strokeLinecap: 'square' as const,
      asChild: true,
      ref: () => {
        throw new Error('A public ref must not be attached');
      }
    };
    const { container } = render(<Icon name='minus' {...unsupported} />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    for (const attribute of [
      'role',
      'aria-label',
      'aria-labelledby',
      'fill',
      'stroke',
      'stroke-width',
      'width',
      'height',
      'aschild'
    ]) {
      expect(svg).not.toHaveAttribute(attribute);
    }
    expect([...svg.children].map((child) => child.tagName)).toEqual(['path']);
    expect(svg.textContent).toBe('');
  });
});

describe('Icon file contract', () => {
  it('keeps the six mandatory files plus the spec-named path module and no stylesheet', () => {
    const files = readdirSync(import.meta.dirname).sort();
    expect(files).toEqual([
      'Icon.stories.tsx',
      'Icon.test.tsx',
      'Icon.tsx',
      'icon-paths.ts',
      'index.ts',
      'types.ts',
      'useIcon.ts'
    ]);
  });

  it('keeps the path module as data with provenance and out of the public barrel', () => {
    const paths = readFileSync(resolve(import.meta.dirname, 'icon-paths.ts'), 'utf8');
    expect(paths).toMatch(/Lucide/);
    expect(paths).toMatch(/ISC/);
    expect(paths).not.toMatch(/from 'react'|<[a-z]+[\s/>]/);
    const barrel = readFileSync(resolve(import.meta.dirname, 'index.ts'), 'utf8');
    expect(barrel).not.toMatch(/icon-paths|iconPaths|iconVariants/);
  });
});
