import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Avatar } from './Avatar.js';
import { avatarBadgeIconVariants, avatarBadgeVariants } from './types.js';
import { useAvatar } from './useAvatar.js';

// Only the browser image transport is replaced; real Radix owns loading and fallback.
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

describe('Avatar contract', () => {
  it('derives passive defaults and per-part classes from the hook', () => {
    const { result } = renderHook(() => useAvatar({}));
    expect(result.current.rootProps).toMatchObject({ 'aria-hidden': true, 'data-state': 'active' });
    expect(result.current.rootProps.className).toContain('size-7.5');
    expect(result.current.fallbackIconClassName).toContain('size-4');
    expect(result.current.badgeClassName).toContain('size-4.5');
  });

  it.each([
    ['sm', 'size-6', 'size-3.25'],
    ['md', 'size-7.5', 'size-4'],
    ['lg', 'size-10', 'size-(--icon-size)'],
    ['xl', 'size-12', 'size-6']
  ] as const)('selects the %s disc and fallback geometry', (size, disc, glyph) => {
    render(<Avatar label='Channel' size={size} />);
    const root = screen.getByRole('img', { name: 'Channel' });
    expect(root).toHaveClass('eg-avatar', disc);
    expect(root.querySelector('svg')).toHaveClass('eg-icon', glyph);
    expect(root.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders an immediate fallback, replaces it after load and preserves one name', async () => {
    render(<Avatar src='portrait.png' label='Channel' />);
    const root = screen.getByRole('img', { name: 'Channel' });
    expect(root.querySelector('svg')).toBeInTheDocument();
    expect(root.querySelector('img')).toBeNull();
    await settleImage('load');
    await waitFor(() => expect(root.querySelector('img')).toHaveAttribute('src', 'portrait.png'));
    expect(root.querySelector('img')).toHaveAttribute('alt', '');
    expect(root.querySelector('img')).toHaveClass('size-full', 'rounded-full', 'object-cover');
    expect(root.querySelector('svg')).toBeNull();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('retains fallback on error and recovers when src changes or is removed', async () => {
    const { rerender } = render(<Avatar label='Channel' src='broken.png' />);
    await settleImage('error');
    expect(screen.getByRole('img').querySelector('svg')).toBeInTheDocument();
    rerender(<Avatar label='Channel' src='working.png' />);
    await settleImage('load');
    await waitFor(() => expect(screen.getByRole('img').querySelector('img')).toHaveAttribute('src', 'working.png'));
    rerender(<Avatar label='Channel' />);
    await waitFor(() => expect(screen.getByRole('img').querySelector('svg')).toBeInTheDocument());
    expect(screen.getByRole('img').querySelector('img')).toBeNull();
  });

  it('owns naming even when untyped callers supply conflicting native semantics', () => {
    const conflicting = { role: 'button', 'aria-label': 'Wrong', 'aria-labelledby': 'other', 'aria-hidden': true };
    const { rerender, container } = render(<Avatar {...conflicting} label='Channel' />);
    expect(screen.getByRole('img', { name: 'Channel' })).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('img')).not.toHaveAttribute('aria-labelledby');
    rerender(<Avatar />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['md', 'xl'] as const)('renders the %s decorative network badge without clipping', (size) => {
    render(<Avatar label='Channel on LinkedIn' badgeIcon='linkedin' size={size} />);
    const root = screen.getByRole('img');
    const badge = root.querySelector('.eg-avatar__badge');
    expect(badge).toHaveAttribute('aria-hidden', 'true');
    expect(badge).toHaveClass('ring-2', 'ring-[var(--eg-avatar-ring,var(--color-bg-surface))]');
    expect(badge).toHaveClass(size === 'xl' ? 'size-5.5' : 'size-4.5');
    expect(badge?.querySelector('svg')).toHaveClass(size === 'xl' ? 'size-3.25' : 'size-2.75');
    expect(root).not.toHaveClass('overflow-hidden');
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('toggles paused data state without state classes or DOM-only props', () => {
    const { rerender } = render(<Avatar label='Channel, paused' paused={true} />);
    const root = screen.getByRole('img');
    expect(root).toHaveAttribute('data-state', 'paused');
    expect(root).toHaveClass('data-[state=paused]:grayscale', 'data-[state=paused]:opacity-60');
    expect(root).not.toHaveClass('is-paused');
    expect(root).not.toHaveAttribute('paused');
    rerender(<Avatar label='Channel' paused={false} />);
    expect(root).toHaveAttribute('data-state', 'active');
    expect(root.querySelector('.eg-avatar__badge')).toBeNull();
  });

  it('forwards native attributes and merges supported layout and ring-property classes', () => {
    render(
      <Avatar
        label='Channel'
        id='channel'
        title='Profile'
        data-channel='demo'
        aria-describedby='hint'
        className='ms-1 ms-2 [--eg-avatar-ring:var(--color-bg-canvas)]'
      />
    );
    const root = screen.getByRole('img');
    expect(root).toHaveAttribute('id', 'channel');
    expect(root).toHaveAttribute('title', 'Profile');
    expect(root).toHaveAttribute('data-channel', 'demo');
    expect(root).toHaveAttribute('aria-describedby', 'hint');
    expect(root).toHaveClass('eg-avatar', 'ms-2', '[--eg-avatar-ring:var(--color-bg-canvas)]');
    expect(root).not.toHaveClass('ms-1');
    expect(root).not.toHaveAttribute('style');
  });

  it('removes informative semantics when its label is removed', () => {
    const { rerender, container } = render(<Avatar label='Channel' />);
    expect(screen.getByRole('img', { name: 'Channel' })).toBeInTheDocument();
    rerender(<Avatar />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
    expect(container.firstElementChild).not.toHaveAttribute('aria-label');
  });

  it('does not enter the tab sequence', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Avatar label='Channel' />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });
});

// Bounds are asserted as token utility intent; real before/after browser parity is parent-owned.
describe('Avatar geometry-sharing compatibility', () => {
  it.each([
    ['sm', 'size-4.5', 'size-2.75'],
    ['md', 'size-4.5', 'size-2.75'],
    ['lg', 'size-4.5', 'size-2.75'],
    ['xl', 'size-5.5', 'size-3.25']
  ] as const)(
    'retains %s badge bounds classes, paint, pointer behavior and paused ancestry',
    (size, diameter, glyph) => {
      const { container, rerender } = render(<Avatar label='Channel on LinkedIn' size={size} badgeIcon='linkedin' />);
      const root = screen.getByRole('img', { name: 'Channel on LinkedIn' });
      const badge = root.querySelector('.eg-avatar__badge');
      const svg = badge?.querySelector('svg');
      expect(container.firstElementChild).toBe(root);
      expect(root.tagName).toBe('SPAN');
      expect(badge?.parentElement).toBe(root);
      expect(badge).toHaveClass(
        'absolute',
        'grid',
        'place-items-center',
        'rounded-full',
        '-right-1',
        '-bottom-1',
        diameter
      );
      expect(svg).toHaveClass(glyph);
      expect(badge).toHaveClass(
        'bg-bg-canvas',
        'text-fg-default',
        'ring-2',
        'ring-[var(--eg-avatar-ring,var(--color-bg-surface))]'
      );
      expect(badge?.className).not.toMatch(
        /pointer-events|select-none|border-|outline-|shadow-|bg-\[image|eg-indicator/
      );
      expect(root).not.toHaveClass('overflow-hidden');
      expect(root.querySelector('.eg-indicator')).toBeNull();
      expect(root.querySelectorAll('.eg-avatar__badge')).toHaveLength(1);
      rerender(<Avatar label='Channel on LinkedIn, paused' size={size} badgeIcon='linkedin' paused={true} />);
      expect(screen.getByRole('img')).toBe(root);
      expect(root.querySelector('.eg-avatar__badge')).toBe(badge);
      expect(badge?.querySelector('svg')).toBe(svg);
      expect(root).toHaveAttribute('data-state', 'paused');
      expect(root).toHaveClass(
        'bg-linear-135',
        'from-bg-deep',
        'to-primitive-red-neon',
        'data-[state=paused]:grayscale',
        'data-[state=paused]:opacity-60'
      );
      expect(badge?.className).not.toMatch(/opacity|grayscale/);
    }
  );

  it('preserves source-exported size signatures, md defaults and class composition', () => {
    expect(avatarBadgeVariants()).toBe(avatarBadgeVariants({ size: 'md' }));
    expect(avatarBadgeIconVariants()).toBe(avatarBadgeIconVariants({ size: 'md' }));
    expect(avatarBadgeVariants({ size: 'sm', className: 'source-consumer' })).toContain('source-consumer');
    expect(avatarBadgeIconVariants({ size: 'lg', className: 'source-glyph' })).toContain('source-glyph');
    expect(avatarBadgeVariants({ size: null }).split(' ')).toEqual(
      expect.arrayContaining(['absolute', 'grid', 'place-items-center', 'rounded-full', '-right-1', '-bottom-1'])
    );
    expect(avatarBadgeVariants({ size: null })).not.toMatch(/size-4\.5|size-5\.5/);
    expect(avatarBadgeIconVariants({ size: null })).toBe('');
  });

  it('retains one badge across live size changes, and removes it without replacing the root', () => {
    const { rerender } = render(
      <Avatar label='Channel' badgeIcon='linkedin' className='ms-2 [--eg-avatar-ring:var(--color-bg-canvas)]' />
    );
    const root = screen.getByRole('img');
    const badge = root.querySelector('.eg-avatar__badge');
    rerender(<Avatar size='xl' badgeIcon='github' className='ms-2 [--eg-avatar-ring:var(--color-bg-canvas)]' />);
    expect(root.querySelector('.eg-avatar__badge')).toBe(badge);
    expect(badge).toHaveClass('size-5.5');
    expect(badge?.querySelector('svg')).toHaveClass('size-3.25');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-label');
    expect(root).toHaveClass('[--eg-avatar-ring:var(--color-bg-canvas)]');
    rerender(<Avatar label='Channel' />);
    expect(screen.getByRole('img')).toBe(root);
    expect(root.querySelector('.eg-avatar__badge')).toBeNull();
  });
});
