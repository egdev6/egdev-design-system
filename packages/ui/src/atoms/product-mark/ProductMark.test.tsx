import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductMark } from './ProductMark';
import { productMarkVariants } from './types';
import { useProductMark } from './useProductMark';

function root(container: HTMLElement) {
  const mark = container.querySelector('.eg-product-mark');
  if (!(mark instanceof HTMLElement)) {
    throw new Error('Missing eg-product-mark root');
  }
  return mark;
}

const material = [
  'inline-flex',
  'size-10',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-md',
  'bg-(image:--gradient-btn-primary)',
  'shadow-btn-primary',
  'text-action-primary-solid-fg',
  'font-display',
  'text-heading-small',
  'no-underline'
];

describe('ProductMark', () => {
  it('renders a passive image named by label with the monogram hidden (PM-01)', () => {
    const { container } = render(<ProductMark monogram='M' label='Mando' />);
    const mark = screen.getByRole('img', { name: 'Mando' });
    expect(mark).toBe(root(container));
    expect(container.children).toHaveLength(1);
    expect(mark.tagName).toBe('SPAN');
    expect(mark).toHaveAttribute('aria-label', 'Mando');
    expect(mark).not.toHaveAttribute('href');
    expect(mark).not.toHaveAttribute('tabindex');
    expect(mark.children).toHaveLength(1);
    const monogram = screen.getByText('M');
    expect(monogram.tagName).toBe('SPAN');
    expect(monogram.parentElement).toBe(mark);
    expect(monogram).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders one- and two-character monograms in the same tile (PM-02)', () => {
    render(
      <>
        {['M', 'C', 'L', 'Cr', 'Mt', 'Q'].map((monogram) => (
          <ProductMark key={monogram} monogram={monogram} label={`Product ${monogram}`} />
        ))}
      </>
    );
    for (const monogram of ['M', 'C', 'L', 'Cr', 'Mt', 'Q']) {
      const mark = screen.getByRole('img', { name: `Product ${monogram}` });
      expect(mark).toHaveTextContent(monogram);
      expect(mark).toHaveClass('size-10', 'items-center', 'justify-center');
    }
  });

  it('applies the product-mark Material recipe from the CVA base (PM-03, PM-07)', () => {
    const { container } = render(<ProductMark monogram='Cr' label='Criterio' />);
    expect(root(container)).toHaveClass('eg-product-mark', ...material);
    expect(productMarkVariants()).toContain('eg-product-mark');
    // No hover lift, press or motion: the source has none (PM-05).
    expect(productMarkVariants({ link: true })).not.toMatch(/hover:|active:|transition|animate|translate/);
    // Focus styles exist only in link mode.
    expect(productMarkVariants()).not.toMatch(/focus/);
  });

  it('renders a native link named by label that Tab focuses and Enter follows (PM-04)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const { container } = render(
      <>
        <button type='button'>Before</button>
        <ProductMark monogram='M' label='Mando home' href='/' onClick={onClick} />
      </>
    );
    const link = screen.getByRole('link', { name: 'Mando home' });
    expect(link).toBe(root(container));
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');
    expect(link).not.toHaveAttribute('role');
    expect(link).toHaveClass(...material, 'focus-visible:outline-none', 'focus-visible:shadow-focus');
    expect(screen.getByText('M')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).toBeNull();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keeps the image mode out of the Tab order and carries no state (PM-05)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <button type='button'>Before</button>
        <ProductMark monogram='Q' label='Quorb' />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(root(container)).not.toHaveAttribute('data-state');
  });

  it('merges root layout className last and forwards native attributes per mode (PM-06)', () => {
    const { container } = render(
      <ProductMark
        monogram='L'
        label='egdev-live'
        id='live-mark'
        title='egdev-live'
        data-source='consumer'
        className='mb-1 mb-3'
      />
    );
    const mark = root(container);
    expect(mark).toHaveClass('eg-product-mark', 'mb-3');
    expect(mark).not.toHaveClass('mb-1');
    expect(mark.className.split(' ')[0]).toBe('eg-product-mark');
    expect(mark.className.split(' ').at(-1)).toBe('mb-3');
    expect(mark).toHaveAttribute('id', 'live-mark');
    expect(mark).toHaveAttribute('title', 'egdev-live');
    expect(mark).toHaveAttribute('data-source', 'consumer');

    const { container: linked } = render(
      <ProductMark
        monogram='C'
        label='Cadencia home'
        href='/cadencia'
        target='_self'
        rel='noopener'
        className='self-center'
      />
    );
    const link = root(linked);
    expect(link).toHaveAttribute('target', '_self');
    expect(link).toHaveAttribute('rel', 'noopener');
    expect(link.className.split(' ').at(-1)).toBe('self-center');
  });

  it('keeps image naming authoritative when untyped role or aria-hidden props slip through the union (PM-01)', () => {
    // The union accepts anchor-only attributes without href; the hook still owns role and naming.
    const loose = { monogram: 'Q', label: 'Quorb', role: 'button', 'aria-hidden': true } as const;
    render(<ProductMark {...loose} />);
    const mark = screen.getByRole('img', { name: 'Quorb' });
    expect(mark).toHaveAttribute('role', 'img');
    expect(mark).not.toHaveAttribute('aria-hidden');
  });

  it('derives the mode, naming and classes in the hook without leaking own props to the DOM', () => {
    const { result } = renderHook(() => useProductMark({ monogram: 'Mt', label: 'media-tool', id: 'media' }));
    const image = result.current;
    if (image.link) {
      throw new Error('Expected image mode without href');
    }
    expect(image.monogram).toBe('Mt');
    expect(image.imageProps).toMatchObject({ id: 'media', role: 'img', 'aria-label': 'media-tool' });
    expect(image.imageProps.className).toContain('eg-product-mark');
    expect(image.imageProps.className).not.toContain('focus-visible');
    for (const prop of ['monogram', 'label', 'href', 'children']) {
      expect(image.imageProps).not.toHaveProperty(prop);
    }
    const { result: linked } = renderHook(() => useProductMark({ monogram: 'M', label: 'Mando home', href: '/' }));
    const link = linked.current;
    if (!link.link) {
      throw new Error('Expected link mode with href');
    }
    expect(link.linkProps).toMatchObject({ href: '/', 'aria-label': 'Mando home' });
    for (const prop of ['monogram', 'label', 'role', 'children']) {
      expect(link.linkProps).not.toHaveProperty(prop);
    }
    expect(link.linkProps.className).toContain('focus-visible:shadow-focus');
  });
});
