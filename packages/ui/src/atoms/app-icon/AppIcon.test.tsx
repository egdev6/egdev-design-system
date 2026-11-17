import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as publicAPI from '../../index';
import { useAppIcon } from './useAppIcon';

// Replace only browser image transport: Radix owns image loading and fallback.
let images: HTMLImageElement[];
beforeEach(() => {
  images = [];
  vi.stubGlobal('Image', function Image() {
    const image = document.createElement('img');
    images.push(image);
    return image;
  });
});
afterEach(() => vi.unstubAllGlobals());

async function settleImage(type: 'load' | 'error', index = images.length - 1) {
  const image = images[index];
  if (!image) {
    throw new Error('Radix did not create its preload image');
  }
  Object.defineProperties(image, {
    complete: { value: true, configurable: true },
    naturalWidth: { value: type === 'load' ? 100 : 0, configurable: true }
  });
  await act(async () => image.dispatchEvent(new Event(type)));
}

const AppIcon = publicAPI.AppIcon;

describe('AppIcon public contract', () => {
  it('derives decorative defaults and per-part classes in the hook', () => {
    const { result } = renderHook(() => useAppIcon({ monogram: 'A', src: '  ', label: ' ' }));
    expect(result.current.src).toBeUndefined();
    expect(result.current.rootProps).toMatchObject({ 'aria-hidden': true });
    expect(result.current.rootProps.className).toContain('size-10');
    expect(result.current.fallbackClassName).toContain('text-body-default');
    expect(result.current.imageClassName).toContain('object-contain');
  });
  it.each([undefined, '', '  \t '])('renders the exact monogram without an image for src %s', (src) => {
    const { container } = render(<AppIcon monogram='👩🏽‍💻' src={src} label='Editor' />);
    const root = screen.getByRole('img', { name: 'Editor' });
    expect(root).toHaveTextContent('👩🏽‍💻');
    expect(root.querySelector('img')).toBeNull();
    expect(root.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(images).toHaveLength(0);
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('shows immediate fallback, then a contained decorative image and exactly one image role', async () => {
    render(<AppIcon monogram='Ab' src='logo.png' label='Application' />);
    const root = screen.getByRole('img', { name: 'Application' });
    expect(root).toHaveTextContent('Ab');
    expect(root.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(root.querySelector('img')).toBeNull();
    await settleImage('load');
    await waitFor(() => expect(root.querySelector('img')).toHaveAttribute('src', 'logo.png'));
    expect(root.querySelector('img')).toHaveAttribute('alt', '');
    expect(root.querySelector('img')).toHaveClass('size-full', 'object-contain', 'object-center');
    expect(root).not.toHaveTextContent('Ab');
    expect(screen.getAllByRole('img')).toEqual([root]);
  });

  it('recovers from an error when the source changes and returns to fallback when removed', async () => {
    const { rerender } = render(<AppIcon monogram='Aa' label='Application' src='broken.png' />);
    await settleImage('error');
    const root = screen.getByRole('img', { name: 'Application' });
    expect(root).toHaveTextContent('Aa');
    expect(root.querySelector('img')).toBeNull();
    rerender(<AppIcon monogram='Aa' label='Application' src='working.png' />);
    expect(root).toHaveTextContent('Aa');
    await settleImage('load');
    await waitFor(() => expect(root.querySelector('img')).toHaveAttribute('src', 'working.png'));
    expect(root).not.toHaveTextContent('Aa');
    rerender(<AppIcon monogram='Aa' label='Application' />);
    await waitFor(() => expect(root).toHaveTextContent('Aa'));
    expect(root.querySelector('img')).toBeNull();
    expect(screen.getAllByRole('img')).toEqual([root]);
  });

  it('preserves a nonblank source verbatim', async () => {
    render(<AppIcon monogram='A' label='Application' src='  logo.png  ' />);
    await settleImage('load');
    expect(screen.getByRole('img', { name: 'Application' }).querySelector('img')).toHaveAttribute(
      'src',
      '  logo.png  '
    );
  });

  it('updates naming independently from image state and treats blank labels as decorative', async () => {
    const { rerender, container } = render(<AppIcon monogram='A' label='  ' src='logo.png' />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).toBeNull();
    rerender(<AppIcon monogram='A' label='First' src='logo.png' />);
    expect(screen.getByRole('img', { name: 'First' })).toBe(root);
    await settleImage('load');
    expect(screen.getAllByRole('img')).toEqual([root]);
    rerender(<AppIcon monogram='A' label='Second' src='logo.png' />);
    expect(screen.getByRole('img', { name: 'Second' })).toBe(root);
    rerender(<AppIcon monogram='A' src='logo.png' />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-label');
  });

  it('strips untyped owned semantics and interaction props while forwarding supported attributes', () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const ref = vi.fn();
    const conflicting = {
      role: 'button',
      'aria-label': 'Wrong',
      'aria-labelledby': 'other',
      'aria-hidden': true,
      tabIndex: 0,
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: 'Wrong' },
      contentEditable: true,
      onClick,
      onKeyDown,
      ref,
      asChild: true,
      alt: 'Wrong',
      children: 'Wrong'
    };
    render(
      <AppIcon
        {...conflicting}
        monogram='A'
        label='Application'
        id='app'
        title='Icon'
        data-app='demo'
        aria-describedby='hint'
      />
    );
    const root = screen.getByRole('img', { name: 'Application' });
    for (const attribute of ['aria-labelledby', 'aria-hidden', 'tabindex', 'style', 'contenteditable', 'alt']) {
      expect(root, attribute).not.toHaveAttribute(attribute);
    }
    expect(root).toHaveTextContent('A');
    expect(root).toHaveAttribute('id', 'app');
    expect(root).toHaveAttribute('title', 'Icon');
    expect(root).toHaveAttribute('data-app', 'demo');
    expect(root).toHaveAttribute('aria-describedby', 'hint');
    fireEvent.click(root);
    fireEvent.keyDown(root, { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();
    expect(onKeyDown).not.toHaveBeenCalled();
    expect(ref).not.toHaveBeenCalled();
  });

  it.each([
    ['sm', 'size-8', 'text-label-default'],
    ['md', 'size-10', 'text-body-default'],
    ['lg', 'size-12', 'text-body-default']
  ] as const)('uses the %s token geometry and fallback typography', (size, dimension, text) => {
    render(<AppIcon monogram='A' label='Application' size={size} />);
    const root = screen.getByRole('img', { name: 'Application' });
    expect(root).toHaveClass('eg-app-icon', 'eg-surface', 'rounded-md', 'overflow-hidden', 'p-0', dimension);
    expect(root.firstElementChild).toHaveClass(
      'grid',
      'size-full',
      'place-items-center',
      'font-sans',
      'text-fg-default',
      text
    );
  });

  it('uses md by default and merges supported layout classes last', () => {
    render(<AppIcon monogram='A' label='Application' className='ms-1 ms-2 self-center' />);
    const root = screen.getByRole('img');
    expect(root).toHaveClass('size-10', 'ms-2', 'self-center', 'eg-app-icon', 'eg-surface');
    expect(root).not.toHaveClass('ms-1');
  });

  it('does not create a tab stop', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <AppIcon monogram='A' label='Application' />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });
});
