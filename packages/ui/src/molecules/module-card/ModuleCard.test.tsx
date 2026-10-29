import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { useModuleCard } from '@/molecules/module-card/useModuleCard';
import { Button, Icon, IconButton, Link, ModuleCard, type ModuleCardProps } from '../../index';

const body = <p>Manage this capability.</p>;
const injected = (props: Record<string, unknown>) => props as unknown as Record<string, never>;
const part = (root: HTMLElement, name: string) => root.querySelector(`.eg-module-card__${name}`);

describe('ModuleCard public contract', () => {
  it('rejects missing content/actions, contradictory stopped Material and unsupported public APIs (AC-04/14)', () => {
    type Base = { title: string; children: string };
    expectTypeOf<Base>().toExtend<ModuleCardProps>();
    expectTypeOf<Base & { status: 'error'; actions: string }>().toExtend<ModuleCardProps>();
    expectTypeOf<Base & { status: 'stopped'; actions: string }>().toExtend<ModuleCardProps>();
    expectTypeOf<{ children: string }>().not.toExtend<ModuleCardProps>();
    expectTypeOf<{ title: string }>().not.toExtend<ModuleCardProps>();
    expectTypeOf<Base & { status: 'error' }>().not.toExtend<ModuleCardProps>();
    expectTypeOf<Base & { status: 'stopped' }>().not.toExtend<ModuleCardProps>();
    expectTypeOf<Base & { status: 'stopped'; variant: 'banded'; actions: string }>().not.toExtend<ModuleCardProps>();
    expectTypeOf<Base & { status: 'stopped'; tone: 'overlay'; actions: string }>().not.toExtend<ModuleCardProps>();
    expectTypeOf<
      Extract<
        keyof ModuleCardProps,
        'ref' | 'asChild' | 'wide' | 'glass' | 'banded' | 'role' | 'tabIndex' | 'aria-live'
      >
    >().toEqualTypeOf<never>();
  });

  it('names the passive article from one generated h2, without optional empty wrappers (AC-01)', () => {
    render(<ModuleCard title='Automation'>{body}</ModuleCard>);
    const article = screen.getByRole('article', { name: 'Automation' });
    const heading = within(article).getByRole('heading', { name: 'Automation', level: 2 });
    expect(article).toHaveClass('eg-module-card', 'eg-surface');
    expect(article).toHaveAttribute('aria-labelledby', heading.id);
    expect(article).not.toHaveAttribute('title');
    expect(article).toHaveAttribute('data-state', 'default');
    expect(article).toHaveAttribute('data-variant', 'default');
    expect(article).toHaveAttribute('data-tone', 'surface-1');
    expect(within(article).getByText('Ready')).toHaveClass('eg-badge');
    expect(part(article, 'body')).toHaveTextContent('Manage this capability.');
    for (const name of ['icon', 'actions', 'foot']) {
      expect(part(article, name)).toBeNull();
    }
    expect([...article.children]).toEqual([part(article, 'head'), part(article, 'body')]);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('keeps heading relationships unique and root ids independent', () => {
    render(
      <>
        <ModuleCard title='First' id='first'>
          {body}
        </ModuleCard>
        <ModuleCard title='Second'>{body}</ModuleCard>
      </>
    );
    const headings = screen.getAllByRole('heading');
    expect(new Set(headings.map(({ id }) => id)).size).toBe(2);
    expect(screen.getByRole('article', { name: 'First' })).toHaveAttribute('id', 'first');
    expect(headings[0]?.id).not.toBe('first');
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('changes only the semantic heading rank to %s (AC-02)', (level) => {
    render(
      <ModuleCard title='Rank' level={level}>
        {body}
      </ModuleCard>
    );
    expect(screen.getByRole('heading', { name: 'Rank', level })).toHaveClass('font-sans', 'text-cta-label');
  });

  it.each(['', ' \n\t'])('warns and removes all content for a blank title %j, then recovers', (title) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container, rerender } = render(
      <ModuleCard title={title} actions={<Button>Run</Button>}>
        {body}
      </ModuleCard>
    );
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/ModuleCard.*title/));
    rerender(<ModuleCard title='Recovered'>{body}</ModuleCard>);
    expect(screen.getByRole('article', { name: 'Recovered' })).toBeVisible();
    warn.mockRestore();
  });

  it.each([
    ['default', 'Ready', 'info', 'bell'],
    ['error', 'Needs attention', 'danger', 'alert'],
    ['stopped', 'Stopped', 'neutral', 'pause']
  ] as const)(
    'renders readable %s status with the real Badge and decorative Icon (AC-03/05)',
    (status, text, tone, glyph) => {
      const { result } = renderHook(() =>
        useModuleCard({ title: 'Capability', children: body, status, actions: <Button>Recover</Button> })
      );
      expect(result.current.badgeProps).toMatchObject({ tone, children: text });
      expect(result.current.statusIconProps).toMatchObject({ name: glyph });
      render(
        <ModuleCard title='Capability' status={status} actions={<Button>Recover</Button>}>
          {body}
        </ModuleCard>
      );
      const article = screen.getByRole('article', { name: 'Capability' });
      expect(article).toHaveAttribute('data-state', status);
      expect(within(article).getByText(text)).toHaveClass('eg-badge');
      expect(article.querySelector('.eg-badge svg')).toHaveAttribute('aria-hidden', 'true');
      expect(article).not.toHaveAttribute('aria-disabled');
      expect(article).not.toHaveAttribute('aria-live');
    }
  );

  it.each(['default', 'error'] as const)('supports every material/variant pair for %s (AC-04/06/07)', (status) => {
    for (const tone of ['surface-1', 'overlay'] as const) {
      for (const variant of ['default', 'banded'] as const) {
        const { unmount } = render(
          <ModuleCard
            title='Pair'
            status={status}
            variant={variant}
            tone={tone}
            actions={<Button>Review</Button>}
            footer='Updated recently'
          >
            {body}
          </ModuleCard>
        );
        const root = screen.getByRole('article', { name: 'Pair' });
        expect(root).toHaveAttribute('data-tone', tone);
        expect(root).toHaveAttribute('data-variant', variant);
        expect(root).toHaveClass(tone === 'overlay' ? 'bg-surface-overlay' : 'bg-surface-1');
        expect(root).toHaveClass('data-[state=error]:border-status-danger/40');
        if (tone === 'overlay') {
          expect(root).toHaveClass('backdrop-blur-overlay', 'not-supports-[backdrop-filter]:bg-surface-2');
          expect(root).toHaveClass('data-[tone=overlay]:bg-none');
        }
        if (variant === 'banded') {
          expect(part(root, 'head')).toHaveClass(
            'eg-surface',
            tone === 'overlay' ? 'bg-surface-3' : 'bg-surface-2',
            'border-x-0',
            'border-t-0',
            'border-b',
            'rounded-t-xl'
          );
          expect(part(root, 'foot')).toHaveClass(
            'eg-surface',
            tone === 'overlay' ? 'bg-surface-1' : 'bg-surface-0',
            'bg-none',
            'shadow-none',
            'border-x-0',
            'border-b-0',
            'border-t',
            'rounded-b-xl'
          );
          expect(part(root, 'body')).not.toHaveClass('eg-surface');
          expect(part(root, 'actions')).not.toHaveClass('eg-surface');
          expect(part(root, 'name')).toHaveClass('font-display', 'text-heading-small', 'uppercase');
        }
        unmount();
      }
    }
  });

  it('normalizes untyped invalid inputs and conflicting stopped combinations (AC-04)', () => {
    const { rerender } = render(
      <ModuleCard title='Normalize' {...injected({ status: 'unknown', variant: 'unknown', tone: 'unknown', level: 0 })}>
        {body}
      </ModuleCard>
    );
    const root = screen.getByRole('article', { name: 'Normalize' });
    expect(root).toHaveAttribute('data-state', 'default');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect(root).toHaveAttribute('data-tone', 'surface-1');
    expect(screen.getByRole('heading', { level: 2 })).toBeVisible();
    rerender(
      <ModuleCard
        title='Normalize'
        {...injected({ status: 'stopped', variant: 'banded', tone: 'overlay' })}
        actions={<Button>Start</Button>}
      >
        {body}
      </ModuleCard>
    );
    expect(root).toHaveAttribute('data-state', 'stopped');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect(root).toHaveAttribute('data-tone', 'surface-1');
    expect(root).toHaveClass(
      'data-[state=stopped]:bg-transparent',
      'data-[state=stopped]:bg-none',
      'data-[state=stopped]:shadow-none',
      'data-[state=stopped]:border-dashed',
      'data-[state=stopped]:border-border-control'
    );
  });

  it('merges partial localized messages and falls back for blank or invalid phrases (AC-05)', () => {
    const { rerender } = render(
      <ModuleCard title='Messages' messages={{ defaultStatus: 'Available' }}>
        {body}
      </ModuleCard>
    );
    expect(screen.getByText('Available')).toBeVisible();
    rerender(
      <ModuleCard
        title='Messages'
        status='error'
        actions={<Button>Retry</Button>}
        messages={{ defaultStatus: 'Available' }}
      >
        {body}
      </ModuleCard>
    );
    expect(screen.getByText('Needs attention')).toBeVisible();
    rerender(
      <ModuleCard
        title='Messages'
        status='stopped'
        actions={<Button>Start</Button>}
        messages={{ stoppedStatus: 'Paused' }}
      >
        {body}
      </ModuleCard>
    );
    expect(screen.getByText('Paused')).toBeVisible();
    rerender(
      <ModuleCard title='Messages' messages={{ defaultStatus: '  ' }}>
        {body}
      </ModuleCard>
    );
    expect(screen.getByText('Ready')).toBeVisible();
    rerender(
      <ModuleCard title='Messages' {...injected({ messages: { defaultStatus: 42 } })}>
        {body}
      </ModuleCard>
    );
    expect(screen.getByText('Ready')).toBeVisible();
  });

  it.each([undefined, null, false, true])(
    'omits absent/null/boolean optional slots %j without an empty band',
    (slot) => {
      render(
        <ModuleCard title='Slots' variant='banded' icon={slot} actions={slot} footer={slot}>
          {body}
        </ModuleCard>
      );
      const root = screen.getByRole('article', { name: 'Slots' });
      for (const name of ['icon', 'actions', 'foot']) {
        expect(part(root, name)).toBeNull();
      }
      expect(part(root, 'body')).toHaveClass('last:rounded-b-xl');
    }
  );

  it('renders decorative identity, body, actions and utility footer in order (AC-10/13)', () => {
    render(
      <ModuleCard
        title='Order'
        icon={<Icon name='plug' />}
        actions={
          <>
            <Button>Configure</Button>
            <Link href='#details'>Details</Link>
          </>
        }
        footer={
          <>
            <span>Updated today</span>
            <IconButton label='Refresh' icon={<Icon name='radio' />} />
          </>
        }
      >
        {body}
      </ModuleCard>
    );
    const root = screen.getByRole('article', { name: 'Order' });
    expect([...root.children]).toEqual(['head', 'body', 'actions', 'foot'].map((name) => part(root, name)));
    expect(part(root, 'icon')).toHaveAttribute('aria-hidden', 'true');
    expect(part(root, 'icon')).toHaveClass('fill-inherit', 'stroke-inherit');
    expect(part(root, 'actions')).toHaveClass(
      '[&>:last-child:not(:first-child)]:ml-0',
      '[&>:last-child:not(:first-child)]:ms-auto'
    );
    expect(screen.queryByRole('contentinfo')).toBeNull();
  });

  it('preserves child activation, state, disabled/loading and focus across status changes (AC-10/11)', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const controls = (
      <>
        <Button onClick={click}>Retry</Button>
        <Button disabled={true}>Unavailable</Button>
      </>
    );
    const footer = <IconButton label='Refresh' icon={<Icon name='radio' />} />;
    const { rerender } = render(
      <ModuleCard title='Focus' status='error' actions={controls} footer={footer}>
        <Button>Body action</Button>
      </ModuleCard>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Body action' })).toHaveFocus();
    await user.tab();
    const retry = screen.getByRole('button', { name: 'Retry' });
    expect(retry).toHaveFocus();
    await user.keyboard('{Enter} ');
    expect(click).toHaveBeenCalledTimes(2);
    await user.hover(screen.getByRole('article'));
    rerender(
      <ModuleCard title='Focus' status='stopped' actions={controls} footer={footer}>
        <Button>Body action</Button>
      </ModuleCard>
    );
    expect(retry).toHaveFocus();
    expect(retry).toHaveAttribute('data-state', 'idle');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Refresh' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
    rerender(
      <ModuleCard title='Focus' actions={<Button loading={true}>Retry</Button>}>
        {body}
      </ModuleCard>
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toHaveAttribute('data-state', 'loading');
  });

  it('forwards native relationships/layout only to the article while protecting semantics (AC-09/13)', () => {
    render(
      <ModuleCard
        title='Native'
        id='module'
        dir='rtl'
        aria-describedby='hint'
        aria-busy={true}
        data-owner='host'
        className='w-full w-auto col-span-full mt-4'
        {...injected({
          role: 'button',
          tabIndex: 0,
          contentEditable: true,
          'aria-label': 'Wrong',
          'aria-labelledby': 'wrong',
          'aria-live': 'assertive',
          'aria-disabled': true,
          'aria-selected': true,
          'aria-pressed': true,
          'data-state': 'wrong',
          'data-variant': 'wrong',
          'data-tone': 'wrong',
          dangerouslySetInnerHTML: { __html: '<b>Wrong</b>' }
        })}
      >
        {body}
      </ModuleCard>
    );
    const root = screen.getByRole('article', { name: 'Native' });
    expect(root).toHaveAttribute('id', 'module');
    expect(root).toHaveAttribute('aria-describedby', 'hint');
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveClass(
      'w-auto',
      'col-span-full',
      'mt-4',
      'overflow-visible',
      'transform-none',
      'transition-none',
      'animate-none'
    );
    expect(root).not.toHaveClass('w-full');
    for (const attr of [
      'role',
      'tabindex',
      'contenteditable',
      'aria-label',
      'aria-live',
      'aria-disabled',
      'aria-selected',
      'aria-pressed'
    ]) {
      expect(root).not.toHaveAttribute(attr);
    }
    expect(part(root, 'head')).not.toHaveAttribute('data-owner');
    expect(root.querySelector('b')).toBeNull();
  });
});
