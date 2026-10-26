import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Logo } from './Logo';
import { markArtwork, wordmarkArtwork } from './logo-artwork';
import type { LogoProps, LogoSize } from './types';
import { useLogo } from './useLogo';

const sizes: [LogoSize, string][] = [
  ['sm', 'h-7'],
  ['md', 'h-8'],
  ['lg', 'h-9']
];

const inks = {
  light: 'fill-(--logo-red)',
  shade: 'fill-(--logo-red-shade)',
  name: 'fill-primitive-white'
} as const;

function root(container: HTMLElement) {
  const logo = container.querySelector('.eg-logo');
  if (!logo) {
    throw new Error('Missing eg-logo root');
  }
  return logo;
}

function artwork(container: HTMLElement) {
  const svg = root(container).querySelector('svg');
  if (!svg) {
    throw new Error('Missing logo artwork');
  }
  return svg;
}

describe('Logo', () => {
  it('renders a named image "egdev" with the 32px wordmark by default (LG-01)', () => {
    const { container } = render(<Logo />);
    const image = screen.getByRole('img', { name: 'egdev' });
    expect(image).toBe(root(container));
    expect(image.tagName).toBe('SPAN');
    expect(image).toHaveAttribute('aria-label', 'egdev');
    expect(image).toHaveClass('eg-logo', 'h-8');
    expect(artwork(container)).toHaveAttribute('viewBox', wordmarkArtwork.viewBox);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('draws the V4 isotype polygons with the two token inks for the mark variant (LG-02)', () => {
    const { container } = render(<Logo variant='mark' />);
    const svg = artwork(container);
    expect(svg).toHaveAttribute('viewBox', '0 0 638.45 612.37');
    const polygons = [...svg.querySelectorAll('polygon')];
    expect(polygons).toHaveLength(markArtwork.shapes.length);
    expect(svg.querySelectorAll('path')).toHaveLength(0);
    markArtwork.shapes.forEach((shape, index) => {
      expect(polygons[index]).toHaveAttribute('points', shape.data);
      expect(polygons[index]?.getAttribute('class')).toBe(inks[shape.ink]);
    });
    const used = new Set(polygons.map((polygon) => polygon.getAttribute('class')));
    expect([...used].sort()).toEqual([inks.light, inks.shade].sort());
  });

  it('draws the wordmark paths with the red faces and the white name (LG-06)', () => {
    const { container } = render(<Logo variant='wordmark' />);
    const svg = artwork(container);
    expect(svg).toHaveAttribute('viewBox', '0 0 653 258');
    const paths = [...svg.querySelectorAll('path')];
    expect(paths).toHaveLength(wordmarkArtwork.shapes.length);
    wordmarkArtwork.shapes.forEach((shape, index) => {
      expect(paths[index]).toHaveAttribute('d', shape.data);
      expect(paths[index]?.getAttribute('class')).toBe(inks[shape.ink]);
    });
    expect(paths.filter((path) => path.getAttribute('class') === inks.name)).toHaveLength(1);
    // The artwork carries only token ink classes: no inline fills, strokes or styles.
    for (const shape of svg.querySelectorAll('path, polygon')) {
      expect(shape).not.toHaveAttribute('fill');
      expect(shape).not.toHaveAttribute('style');
    }
  });

  it('keeps the original V4 artwork data unchanged (LG-02, LG-06)', () => {
    expect(markArtwork.shapes.map((shape) => shape.ink)).toEqual([
      'light',
      'shade',
      'light',
      'shade',
      'light',
      'light',
      'light'
    ]);
    expect(markArtwork.shapes[0]?.data).toBe(
      '415.52 185.14 415.52 231.18 350.31 197.81 350.31 315.25 638.45 466.95 638.45 297.64 415.52 185.14'
    );
    expect(wordmarkArtwork.shapes.map((shape) => [shape.kind, shape.ink])).toEqual([
      ['path', 'name'],
      ['path', 'light'],
      ['path', 'shade'],
      ['path', 'light'],
      ['path', 'shade'],
      ['path', 'light'],
      ['path', 'light'],
      ['path', 'light']
    ]);
    expect(wordmarkArtwork.shapes[0]?.data.startsWith('M381.632 89.944C382.315 90.0293')).toBe(true);
    expect(wordmarkArtwork.shapes[0]?.data.endsWith('611.571 67.8L611.955 67.288Z')).toBe(true);
    expect(wordmarkArtwork.shapes[7]?.data).toBe('M230.11 100.278L206.051 89.0019V66.9561L230.11 78.2325V100.278Z');
  });

  it.each(sizes)(
    'resolves the %s preset to %s on the root, the artwork following its ratio (LG-03)',
    (size, utility) => {
      const { result } = renderHook(() => useLogo({ size }));
      const classes = result.current.rootProps.className.split(' ');
      expect(classes).toContain(utility);
      for (const [, other] of sizes.filter(([candidate]) => candidate !== size)) {
        expect(classes).not.toContain(other);
      }
      expect(result.current.artworkClassName.split(' ')).toEqual(expect.arrayContaining(['block', 'h-full', 'w-auto']));
    }
  );

  it('applies the brand-artwork root recipe without Material paint', () => {
    const { container } = render(<Logo />);
    const logo = root(container);
    expect(logo).toHaveClass('inline-block', 'shrink-0', 'leading-none', 'rounded-sm');
    expect(logo.className).not.toMatch(/\b(bg|border|shadow|text)-/);
  });

  it('renders a named native link that Tab focuses with the focus ring (LG-04)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <button type='button'>Before</button>
        <Logo href='/' label='egdev, home' />
      </>
    );
    const link = screen.getByRole('link', { name: 'egdev, home' });
    expect(link).toBe(root(container));
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass('focus-visible:outline-none', 'focus-visible:shadow-focus');
    expect(link).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Before' }));
    await user.tab();
    expect(link).toHaveFocus();
  });

  it('forwards native anchor events and attributes in link mode', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(<Logo href='/home' target='_self' rel='home' data-source='topbar' onClick={onClick} />);
    const link = screen.getByRole('link', { name: 'egdev' });
    expect(link).toHaveAttribute('target', '_self');
    expect(link).toHaveAttribute('rel', 'home');
    expect(link).toHaveAttribute('data-source', 'topbar');
    link.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is not focusable in image mode and has no own state', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Logo />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    const logo = root(container);
    expect(logo).not.toHaveAttribute('tabindex');
    expect(logo).not.toHaveAttribute('data-state');
    expect(logo).not.toHaveClass('focus-visible:shadow-focus');
  });

  it('always hides the artwork so each mode exposes exactly one name (LG-05)', () => {
    for (const element of [<Logo key='image' />, <Logo key='link' href='/' label='egdev, home' />]) {
      const { container, unmount } = render(element);
      const svg = artwork(container);
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('focusable', 'false');
      expect(svg.querySelector('title')).toBeNull();
      expect(root(container)).toHaveTextContent('');
      expect(screen.getAllByRole(element.props.href ? 'link' : 'img')).toHaveLength(1);
      unmount();
    }
  });

  it.each([
    ['empty', ''],
    ['whitespace-only', '   ']
  ])('falls back to the egdev name when the label is %s', (_case, label) => {
    render(<Logo label={label} />);
    expect(screen.getByRole('img', { name: 'egdev' })).toBeInTheDocument();
  });

  it('keeps eg-logo and merges layout className last on the root only (LG-07)', () => {
    const { container } = render(<Logo size='lg' className='ms-2 self-center consumer-logo' />);
    const logo = root(container);
    expect(logo).toHaveClass('eg-logo', 'h-9', 'ms-2', 'self-center', 'consumer-logo');
    expect(logo.className.split(' ').at(-1)).toBe('consumer-logo');
    expect(artwork(container).getAttribute('class')).not.toMatch(/ms-2|consumer-logo/);
  });

  it('forwards native span attributes in image mode (LG-07)', () => {
    const { container } = render(<Logo id='brand' title='egdev' lang='en' data-source='footer' />);
    const logo = root(container);
    expect(logo).toHaveAttribute('id', 'brand');
    expect(logo).toHaveAttribute('title', 'egdev');
    expect(logo).toHaveAttribute('lang', 'en');
    expect(logo).toHaveAttribute('data-source', 'footer');
  });

  it('keeps component-owned naming and content against unsupported JavaScript prop spreads', () => {
    const image = {
      role: 'presentation',
      'aria-label': 'Injected',
      'aria-labelledby': 'other',
      'aria-hidden': true,
      children: 'Injected',
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    };
    const { container: imageContainer } = render(<Logo {...image} label='egdev' />);
    const imageRoot = root(imageContainer);
    expect(imageRoot).toHaveAttribute('role', 'img');
    expect(imageRoot).toHaveAttribute('aria-label', 'egdev');
    expect(imageRoot).not.toHaveAttribute('aria-labelledby');
    expect(imageRoot).not.toHaveAttribute('aria-hidden');
    expect(imageRoot).toHaveTextContent('');
    expect(imageRoot.querySelector('svg')).not.toBeNull();
    const link = {
      'aria-label': 'Injected',
      'aria-labelledby': 'other',
      children: 'Injected',
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    };
    const { container: linkContainer } = render(<Logo {...link} href='/' label='egdev, home' />);
    const linkRoot = root(linkContainer);
    expect(linkRoot).toHaveAttribute('aria-label', 'egdev, home');
    expect(linkRoot).not.toHaveAttribute('aria-labelledby');
    expect(linkRoot).toHaveTextContent('');
    expect(linkRoot.querySelector('svg')).not.toBeNull();
  });

  it('derives the mode and name in the hook and never leaks own props to the DOM', () => {
    const { result } = renderHook(() =>
      useLogo({ href: '/', label: 'egdev, home', variant: 'mark', size: 'sm', id: 'home' })
    );
    expect(result.current.href).toBe('/');
    expect(result.current.artwork).toBe(markArtwork);
    expect(result.current.rootProps).toMatchObject({ id: 'home', href: '/', 'aria-label': 'egdev, home' });
    expect(result.current.rootProps).not.toHaveProperty('role');
    for (const prop of ['label', 'size', 'variant']) {
      expect(result.current.rootProps).not.toHaveProperty(prop);
    }
    const { result: image } = renderHook(() => useLogo({}));
    expect(image.current.href).toBeUndefined();
    expect(image.current.artwork).toBe(wordmarkArtwork);
    expect(image.current.rootProps).toMatchObject({ role: 'img', 'aria-label': 'egdev' });
    expect(image.current.rootProps).not.toHaveProperty('href');
    expect(image.current.shapes.map((shape) => shape.className)).toEqual(
      wordmarkArtwork.shapes.map((shape) => inks[shape.ink])
    );
  });
});

describe('Logo types (LG-07)', () => {
  it('accepts native attributes per mode and rejects contract-owned props across both branches', () => {
    const link: LogoProps = { href: '/', target: '_blank', rel: 'noopener', label: 'egdev, home' };
    const image: LogoProps = { variant: 'mark', size: 'lg', title: 'egdev', lang: 'en' };
    // @ts-expect-error The artwork is component-owned: no children.
    const children: LogoProps = { children: 'egdev' };
    // @ts-expect-error The image role is component-owned.
    const role: LogoProps = { role: 'presentation' };
    // @ts-expect-error The image role is component-owned, also with an explicit absent href.
    const roleImage: LogoProps = { href: undefined, role: 'presentation' };
    // @ts-expect-error The accessible name comes from label.
    const ariaLabel: LogoProps = { 'aria-label': 'egdev' };
    // @ts-expect-error The link name comes from label, not aria-labelledby.
    const labelledBy: LogoProps = { href: '/', 'aria-labelledby': 'brand' };
    // @ts-expect-error The image cannot be hidden from assistive technology.
    const hidden: LogoProps = { 'aria-hidden': true };
    // @ts-expect-error Anchor attributes require href.
    const target: LogoProps = { target: '_blank' };
    // @ts-expect-error Anchor attributes require href, also with an explicit absent href.
    const targetImage: LogoProps = { href: undefined, target: '_blank' };
    // @ts-expect-error Logo has no public ref API (D8).
    const ref: LogoProps = { ref: null };
    // @ts-expect-error Router links wrap an unlinked Logo; there is no asChild (D4).
    const asChild: LogoProps = { href: '/', asChild: true };
    // @ts-expect-error Heights are presets only.
    const numeric: LogoProps = { size: 32 };
    // @ts-expect-error Only the mark and wordmark artwork exist.
    const icon: LogoProps = { variant: 'icon' };
    const rejected = [children, role, roleImage, ariaLabel, labelledBy, hidden, target, targetImage, ref, asChild];
    expect([link, image, ...rejected, numeric, icon]).toHaveLength(14);
  });
});
