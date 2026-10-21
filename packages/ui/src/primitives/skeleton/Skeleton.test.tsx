import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';
import type { SkeletonSize, SkeletonVariant } from './types';
import { useSkeleton } from './useSkeleton';

const cases: [SkeletonVariant, SkeletonSize, string, string][] = [
  ['line', 'sm', 'h-3', 'rounded-sm'],
  ['line', 'md', 'h-4', 'rounded-sm'],
  ['line', 'lg', 'h-5', 'rounded-sm'],
  ['block', 'sm', 'h-12', 'rounded-md'],
  ['block', 'md', 'h-20', 'rounded-md'],
  ['block', 'lg', 'h-24', 'rounded-md'],
  ['circle', 'sm', 'size-8', 'rounded-full'],
  ['circle', 'md', 'size-12', 'rounded-full'],
  ['circle', 'lg', 'size-16', 'rounded-full']
];

function LoadingHost({ state }: { state: 'loading' | 'ready' | 'error' }) {
  return (
    <>
      <button type='button'>Refresh</button>
      <p role='status'>
        {state === 'loading'
          ? 'Loading account details'
          : state === 'ready'
            ? 'Account ready'
            : 'Could not load account'}
      </p>
      <section aria-label='Account details' aria-busy={state === 'loading'}>
        {state === 'loading' ? (
          <>
            <Skeleton />
            <Skeleton variant='circle' />
          </>
        ) : (
          <p>{state === 'ready' ? 'Account details are available' : 'Try again later'}</p>
        )}
      </section>
    </>
  );
}

describe('Skeleton', () => {
  it('pulses by default through the approved opacity utility', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.eg-skeleton')).toHaveClass('animate-pulse', 'motion-reduce:animate-none');
  });

  it('renders exactly the v0.1 static class string when pulse is false', () => {
    const { container: pulsing } = render(<Skeleton />);
    const { container: shape } = render(<Skeleton pulse={false} />);
    const staticClasses = shape.querySelector('.eg-skeleton')?.className.split(' ') ?? [];
    const pulsingClasses = (pulsing.querySelector('.eg-skeleton')?.className.split(' ') ?? []).filter(
      (name) => name !== 'animate-pulse' && name !== 'motion-reduce:animate-none'
    );
    expect(staticClasses).toEqual(pulsingClasses);
    expect(staticClasses).not.toContain('animate-pulse');
    expect(staticClasses).not.toContain('motion-reduce:animate-none');
  });

  it('never forwards the pulse switch to the DOM and keeps hidden decorative invariants', () => {
    const { container } = render(<Skeleton pulse={true} />);
    const shape = container.querySelector('.eg-skeleton');
    expect(shape).not.toHaveAttribute('pulse');
    expect(shape).toHaveAttribute('aria-hidden', 'true');
    expect(shape).toBeEmptyDOMElement();
  });

  it('defaults to an empty, hidden, non-focusable line/md span without state or semantics', () => {
    const { container } = render(<Skeleton />);
    const shape = container.querySelector('.eg-skeleton');
    expect(shape?.tagName).toBe('SPAN');
    expect(shape).toBeEmptyDOMElement();
    expect(shape).toHaveAttribute('aria-hidden', 'true');
    expect(shape).toHaveClass(
      'block',
      'box-border',
      'shrink-0',
      'bg-border-default',
      'border-0',
      'p-0',
      'w-full',
      'h-4',
      'rounded-sm'
    );
    for (const attribute of ['id', 'role', 'tabindex', 'aria-live', 'aria-busy', 'data-state', 'style']) {
      expect(shape).not.toHaveAttribute(attribute);
    }
  });

  it.each(cases)('resolves %s/%s geometry and radius', (variant, size, dimension, radius) => {
    const { result } = renderHook(() => useSkeleton({ variant, size, pulse: false }));
    const classes = result.current.rootProps.className?.split(' ') ?? [];
    expect(classes).toContain(dimension);
    expect(classes).toContain(radius);
    expect(classes.includes('w-full')).toBe(variant !== 'circle');
    expect(classes.some((name) => /^(animate-|transition|transform|opacity-)/.test(name))).toBe(false);
    expect(result.current.rootProps['aria-hidden']).toBe(true);
  });

  it.each(['line', 'block'] as const)('supports static percentage width and external layout on %s', (variant) => {
    const { container } = render(<Skeleton variant={variant} className='w-3/4 mt-2 col-span-2 consumer-hook' />);
    const shape = container.querySelector('.eg-skeleton');
    expect(shape).toHaveClass('eg-skeleton', 'w-3/4', 'mt-2', 'col-span-2', 'consumer-hook');
    expect(shape).not.toHaveClass('w-full');
  });

  it('keeps preset-owned circle geometry with supported external placement', () => {
    const { container } = render(<Skeleton variant='circle' size='lg' className='mt-2 justify-self-center' />);
    expect(container.querySelector('.eg-skeleton')).toHaveClass(
      'size-16',
      'rounded-full',
      'mt-2',
      'justify-self-center'
    );
  });

  it('forwards compatible attributes without creating IDs', () => {
    const { container } = render(
      <Skeleton id='consumer-placeholder' title='Decorative placeholder' lang='en' data-source='consumer' />
    );
    const shape = container.querySelector('.eg-skeleton');
    expect(shape).toHaveAttribute('id', 'consumer-placeholder');
    expect(shape).toHaveAttribute('title', 'Decorative placeholder');
    expect(shape).toHaveAttribute('lang', 'en');
    expect(shape).toHaveAttribute('data-source', 'consumer');
  });

  it('guards decorative invariants against unsupported JavaScript prop spreads', () => {
    const unsupported = {
      id: 'unsafe-spread',
      children: 'Not permitted',
      dangerouslySetInnerHTML: { __html: '<button>Hidden action</button>' },
      role: 'status',
      'aria-hidden': false,
      'aria-label': 'Wrong label',
      'aria-labelledby': 'other',
      'aria-live': 'assertive',
      'aria-busy': true,
      tabIndex: 0,
      contentEditable: true,
      asChild: true,
      ref: () => {
        throw new Error('A public ref must not be attached');
      }
    };
    const { container } = render(<Skeleton {...unsupported} />);
    const shape = container.querySelector('.eg-skeleton');
    expect(shape).toBeEmptyDOMElement();
    expect(shape).toHaveAttribute('aria-hidden', 'true');
    for (const attribute of [
      'role',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-busy',
      'tabindex',
      'contenteditable',
      'aschild'
    ]) {
      expect(shape).not.toHaveAttribute(attribute);
    }
  });

  it.each(['ready', 'error'] as const)(
    'leaves replacement, busy state and one announcement to the host on %s',
    async (state) => {
      const user = userEvent.setup();
      const { container, rerender } = render(<LoadingHost state='loading' />);
      await user.tab();
      const refresh = screen.getByRole('button', { name: 'Refresh' });
      expect(refresh).toHaveFocus();
      expect(screen.getAllByRole('status')).toHaveLength(1);
      expect(screen.getByRole('region', { name: 'Account details' })).toHaveAttribute('aria-busy', 'true');
      expect(container.querySelectorAll('.eg-skeleton')).toHaveLength(2);
      rerender(<LoadingHost state={state} />);
      expect(screen.getByRole('region', { name: 'Account details' })).toHaveAttribute('aria-busy', 'false');
      expect(container.querySelector('.eg-skeleton')).toBeNull();
      expect(screen.getAllByRole('status')).toHaveLength(1);
      expect(refresh).toHaveFocus();
    }
  );
});
