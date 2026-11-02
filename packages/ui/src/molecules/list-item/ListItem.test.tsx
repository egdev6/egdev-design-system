import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import type {
  ListItemPartProps,
  ListItemProps,
  ListItemSize,
  ListItemStatus,
  ListItemTitleProps,
  ListItemVariant
} from '../../index';
import {
  ListItem,
  ListItemActions,
  ListItemBody,
  ListItemContent,
  ListItemFooter,
  ListItemLeading,
  ListItemMedia,
  ListItemMeta,
  ListItemTitle,
  ListItemTrailing
} from '../../index';
import { useListItem, type useListItemTitle } from '../../molecules/list-item/useListItem';

describe('ListItem public contract', () => {
  it('keeps required content, empty action composition and protected props in the public types', () => {
    expectTypeOf<{ status: 'default' }>().not.toExtend<ListItemProps>();
    expectTypeOf<{ status: 'empty'; children: string }>().not.toExtend<ListItemProps>();
    expectTypeOf<{ asChild: true; children: string }>().not.toExtend<ListItemProps>();
    expectTypeOf<{
      status: 'empty';
      variant: 'row';
      asChild: true;
      children: ReactElement;
    }>().not.toExtend<ListItemProps>();
    expectTypeOf<Extract<'ref' | 'role' | 'tabIndex', keyof ListItemProps>>().toBeNever();
    expectTypeOf<Extract<'ref' | 'role' | 'tabIndex', keyof ListItemPartProps>>().toBeNever();
  });

  it('derives passive defaults and protects reserved root attributes', () => {
    const { result } = renderHook(() => useListItem({ children: 'Draft' }));
    expect(result.current.rootProps).toMatchObject({ 'data-state': 'default', 'data-variant': 'card' });
    const injected = {
      role: 'button',
      tabIndex: 0,
      contentEditable: true,
      'aria-selected': true,
      'aria-pressed': true,
      'aria-disabled': true,
      'data-state': 'failed',
      'data-variant': 'row'
    };
    render(
      <ListItem {...injected} id='draft' title='Draft item' aria-describedby='detail'>
        Draft
      </ListItem>
    );
    const root = screen.getByText('Draft');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-list-item', 'group/list-item');
    expect(root).toHaveAttribute('data-state', 'default');
    expect(root).toHaveAttribute('data-variant', 'card');
    expect(root).toHaveAttribute('aria-describedby', 'detail');
    expect(root).toHaveAttribute('id', 'draft');
    expect(root).toHaveAttribute('title', 'Draft item');
    for (const name of ['role', 'tabindex', 'contenteditable', 'aria-selected', 'aria-pressed', 'aria-disabled']) {
      expect(root).not.toHaveAttribute(name);
    }
  });

  it('slots one list item without a wrapper and preserves child ref, handlers and classes', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLLIElement>();
    const childClick = vi.fn();
    const rootClick = vi.fn();
    render(
      <ul>
        <ListItem asChild={true} status='new' onClick={rootClick} className='mt-4'>
          <li ref={ref} onClick={childClick} className='consumer-item'>
            New draft
          </li>
        </ListItem>
      </ul>
    );
    const item = screen.getByRole('listitem');
    expect(ref.current).toBe(item);
    expect(item.parentElement?.children).toHaveLength(1);
    expect(item).toHaveClass('eg-list-item', 'consumer-item', 'mt-4');
    expect(item).toHaveAttribute('data-state', 'new');
    await user.click(item);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(rootClick).toHaveBeenCalledTimes(1);
  });

  it('preserves article semantics and forwards consumer relationships', () => {
    render(
      <ListItem asChild={true} aria-labelledby='heading'>
        <article>
          <h2 id='heading'>Release notes</h2>
        </article>
      </ListItem>
    );
    expect(screen.getByRole('article', { name: 'Release notes' })).toHaveClass('eg-list-item');
  });

  it.each(['default', 'new', 'failed', 'done', 'dragging', 'off'] as const)(
    'updates the exclusive %s presentation without implicit semantics',
    (status) => {
      const { rerender } = render(
        <ListItem status={status}>
          <ListItemContent>{status} item</ListItemContent>
        </ListItem>
      );
      const root = screen.getByText(`${status} item`).parentElement;
      expect(root).toHaveAttribute('data-state', status);
      for (const name of ['aria-busy', 'aria-disabled', 'aria-selected', 'aria-pressed', 'aria-live', 'draggable']) {
        expect(root).not.toHaveAttribute(name);
      }
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      rerender(<ListItem status='default'>Restored item</ListItem>);
      expect(screen.getByText('Restored item')).toHaveAttribute('data-state', 'default');
    }
  );

  it('normalizes unknown runtime enums and empty variant combinations', () => {
    const { result, rerender } = renderHook(
      ({ status, variant }: { status: ListItemStatus; variant: ListItemVariant }) =>
        useListItem({ status, variant, children: 'Item' } as ListItemProps),
      { initialProps: { status: 'unknown' as ListItemStatus, variant: 'unknown' as ListItemVariant } }
    );
    expect(result.current.rootProps).toMatchObject({ 'data-state': 'default', 'data-variant': 'card' });
    rerender({ status: 'empty', variant: 'row' });
    expect(result.current.rootProps).toMatchObject({ 'data-state': 'empty', 'data-variant': 'card' });
  });

  it('never clears new status on focus or activation', async () => {
    const user = userEvent.setup();
    render(
      <ListItem status='new'>
        <ListItemContent>New draft</ListItemContent>
        <ListItemActions>
          <button type='button'>Open</button>
        </ListItemActions>
      </ListItem>
    );
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByText('New draft').parentElement).toHaveAttribute('data-state', 'new');
  });

  it('composes all parts, preserves DOM order and leaves omitted regions absent', () => {
    const { container, rerender } = render(
      <ListItem variant='compact'>
        <ListItemBody>
          <ListItemContent>Long readable content without clamping</ListItemContent>
          <ListItemMedia>
            <img alt='Mountain landscape' src='landscape.png' />
          </ListItemMedia>
        </ListItemBody>
        <ListItemFooter>
          <ListItemMeta>Draft</ListItemMeta>
          <ListItemActions>
            <button type='button'>Edit</button>
          </ListItemActions>
        </ListItemFooter>
      </ListItem>
    );
    for (const marker of ['body', 'content', 'media', 'foot', 'meta', 'acts']) {
      expect(container.querySelector(`.eg-list-item__${marker}`)).not.toBeNull();
    }
    expect(screen.getByRole('img', { name: 'Mountain landscape' })).not.toHaveAttribute('aria-hidden');
    expect(container.querySelector('.eg-list-item__media')).toHaveClass('eg-surface', 'overflow-hidden');
    expect(container.querySelector('.eg-list-item')).not.toHaveClass('overflow-hidden');
    expect(container.querySelector('.eg-list-item__content')).not.toHaveClass('truncate', 'line-clamp-2');
    expect(
      screen.getByText('Draft').compareDocumentPosition(screen.getByRole('button')) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    rerender(<ListItem>Content only</ListItem>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it.each(['done', 'off', 'dragging'] as const)('keeps %s text and independent actions operable', async (status) => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <ListItem status={status} variant='row'>
        <ListItemBody>
          <ListItemContent>{status} draft</ListItemContent>
        </ListItemBody>
        <ListItemMeta>{status}</ListItemMeta>
        <ListItemActions>
          <button type='button' onClick={click}>
            Show
          </button>
        </ListItemActions>
      </ListItem>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Show' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
    expect(screen.getByText(`${status} draft`).closest('.eg-list-item')).not.toHaveClass('opacity-50', 'opacity-45');
  });

  it('leaves reorder boundaries, callbacks and focus with the host', async () => {
    const user = userEvent.setup();
    const move = vi.fn();
    render(
      <ListItem status='dragging' variant='row'>
        <ListItemBody>
          <ListItemContent>Moving draft</ListItemContent>
        </ListItemBody>
        <ListItemActions>
          <button type='button' disabled={true}>
            Move up
          </button>
          <button type='button' onClick={move}>
            Move down
          </button>
        </ListItemActions>
      </ListItem>
    );
    await user.tab();
    const down = screen.getByRole('button', { name: 'Move down' });
    expect(down).toHaveFocus();
    await user.keyboard(' ');
    expect(move).toHaveBeenCalledTimes(1);
    expect(down).toHaveFocus();
    const root = down.closest('.eg-list-item');
    expect(root).not.toHaveAttribute('aria-grabbed');
    expect(root).not.toHaveAttribute('aria-dropeffect');
  });

  it('retains native empty button activation and avoids form submission', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <ListItem status='empty' asChild={true}>
          <button type='button' onClick={click}>
            Create draft
          </button>
        </ListItem>
      </form>
    );
    const button = screen.getByRole('button', { name: 'Create draft' });
    expect(button).toHaveAttribute('data-state', 'empty');
    expect(button).toHaveAttribute('data-variant', 'card');
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.click(button);
    expect(click).toHaveBeenCalledTimes(3);
    expect(submit).not.toHaveBeenCalled();
    expect(button.querySelector('div')).toBeNull();
  });

  it('keeps disabled empty actions out of the tab sequence', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <>
        <ListItem status='empty' asChild={true}>
          <button type='button' disabled={true} onClick={click}>
            Create draft
          </button>
        </ListItem>
        <button type='button'>Next</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Create draft' }));
    expect(click).not.toHaveBeenCalled();
  });

  it('retains native empty link activation without Space emulation', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <ListItem status='empty' asChild={true}>
        <a href='#new' onClick={click}>
          Create draft
        </a>
      </ListItem>
    );
    const link = screen.getByRole('link', { name: 'Create draft' });
    expect(link).toHaveAttribute('href', '#new');
    expect(link).not.toHaveAttribute('role');
    await user.tab();
    await user.keyboard(' ');
    expect(click).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('isolates each layout merge and emits conditional Material and focus overrides', () => {
    const { result } = renderHook(() => useListItem({ children: 'Draft', className: 'w-full mt-4' }));
    expect(result.current.rootProps.className).toContain('w-full');
    expect(result.current.rootProps.className).toContain('mt-4');
    for (const state of ['done', 'off', 'empty']) {
      expect(result.current.rootProps.className).toContain(`data-[state=${state}]:bg-transparent`);
      expect(result.current.rootProps.className).toContain(`data-[state=${state}]:bg-none`);
      expect(result.current.rootProps.className).toContain(`data-[state=${state}]:shadow-none`);
    }
    expect(result.current.rootProps.className).toContain('data-[state=new]:bg-[image:var(--gradient-post-new)]');
    expect(result.current.rootProps.className).toContain('data-[state=empty]:focus-visible:shadow-focus');
    render(
      <ListItem>
        <ListItemBody className='max-w-full'>Body</ListItemBody>
        <ListItemContent className='max-w-full'>Content</ListItemContent>
        <ListItemMedia className='self-start'>Media</ListItemMedia>
        <ListItemFooter className='w-full'>Footer</ListItemFooter>
        <ListItemMeta className='max-w-full'>Meta</ListItemMeta>
        <ListItemActions className='ms-0'>Actions</ListItemActions>
      </ListItem>
    );
    for (const name of ['Body', 'Content', 'Meta']) {
      expect(screen.getByText(name)).toHaveClass('max-w-full');
    }
    expect(screen.getByText('Media')).toHaveClass('self-start');
    expect(screen.getByText('Footer')).toHaveClass('w-full');
    expect(screen.getByText('Actions')).toHaveClass('ms-0');
    expect(screen.getByText('Actions')).not.toHaveClass('ms-auto');
  });
});

describe('ListItem editorial rows', () => {
  it('orders leading, title/meta and trailing and keeps the raised row surface', () => {
    const { container } = render(
      <ListItem variant='editorial'>
        <ListItemLeading>
          <time dateTime='2026-09-12'>
            12<small>SEP</small>
          </time>
        </ListItemLeading>
        <ListItemBody>
          <ListItemTitle>Reading the release train</ListItemTitle>
          <ListItemMeta>Notes · 4 min read</ListItemMeta>
        </ListItemBody>
        <ListItemTrailing>18:04</ListItemTrailing>
      </ListItem>
    );
    const root = container.querySelector('.eg-list-item');
    expect(root).toHaveAttribute('data-variant', 'editorial');
    expect(root).toHaveClass(
      'eg-surface',
      'data-[variant=editorial]:flex-row',
      'data-[variant=editorial]:items-start',
      'data-[variant=editorial]:min-h-11'
    );
    const nodes = [
      '.eg-list-item__leading',
      '.eg-list-item__title',
      '.eg-list-item__meta',
      '.eg-list-item__trailing'
    ].map((selector) => container.querySelector(selector));
    expect(nodes.every(Boolean)).toBe(true);
    for (let index = 1; index < nodes.length; index += 1) {
      expect(
        (nodes[index - 1] as Node).compareDocumentPosition(nodes[index] as Node) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    }
  });

  it('normalizes empty back to card and keeps every other status snapshot on editorial rows', () => {
    const { result } = renderHook(() =>
      useListItem({ status: 'empty', variant: 'editorial', asChild: true, children: null } as unknown as ListItemProps)
    );
    expect(result.current.rootProps).toMatchObject({ 'data-state': 'empty', 'data-variant': 'card' });
    for (const status of ['default', 'new', 'failed', 'done', 'off', 'dragging'] as const) {
      const { container, rerender } = render(
        <ListItem status={status} variant='editorial-divided'>
          <ListItemBody>
            <ListItemTitle>{status} row</ListItemTitle>
          </ListItemBody>
        </ListItem>
      );
      const root = container.querySelector('.eg-list-item');
      expect(root).toHaveAttribute('data-state', status);
      expect(root).toHaveAttribute('data-variant', 'editorial-divided');
      rerender(
        <ListItem status='default' variant='editorial-divided'>
          Restored
        </ListItem>
      );
      expect(container.querySelector('.eg-list-item')).toHaveAttribute('data-state', 'default');
    }
  });

  it('narrows the leading column and the day/title steps for size sm only', () => {
    const { container, rerender } = render(
      <ListItem variant='editorial' size='sm'>
        <ListItemLeading>
          <time dateTime='2026-09-12'>
            12<small>SEP</small>
          </time>
        </ListItemLeading>
        <ListItemBody>
          <ListItemTitle>Compact note</ListItemTitle>
        </ListItemBody>
      </ListItem>
    );
    const root = container.querySelector('.eg-list-item');
    expect(root).toHaveAttribute('data-size', 'sm');
    const leading = container.querySelector('.eg-list-item__leading');
    expect(leading).toHaveClass('group-data-[size=sm]/list-item:w-[var(--space-16)]');
    expect(leading).toHaveClass('[&_time]:text-display-stat');
    expect(leading).toHaveClass('group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm');
    expect(leading).toHaveClass('[&_time>small]:text-label-eyebrow');
    const title = container.querySelector('.eg-list-item__title');
    expect(title).toHaveClass('text-body-large', 'group-data-[size=sm]/list-item:text-body-default');
    rerender(
      <ListItem variant='card' size='sm'>
        Card row
      </ListItem>
    );
    const card = container.querySelector('.eg-list-item');
    expect(card).toHaveAttribute('data-size', 'sm');
    expect(card?.className).not.toMatch(/size=sm/);
    const { result } = renderHook(() =>
      useListItem({ variant: 'editorial', size: 'lg' as ListItemSize, children: 'Row' })
    );
    expect(result.current.rootProps['data-size']).toBe('md');
  });

  it('keeps a machine-readable time and renders the chosen heading rank', () => {
    const { container } = render(
      <ListItem variant='editorial'>
        <ListItemLeading>
          <time dateTime='2026-09-12'>12</time>
        </ListItemLeading>
        <ListItemBody>
          <ListItemTitle id='row-title' aria-describedby='row-meta'>
            Dated row
          </ListItemTitle>
          <ListItemMeta id='row-meta'>September</ListItemMeta>
        </ListItemBody>
      </ListItem>
    );
    const time = container.querySelector('time');
    expect(time).toHaveAttribute('datetime', '2026-09-12');
    const title = screen.getByRole('heading', { name: 'Dated row' });
    expect(title.tagName).toBe('H3');
    expect(title).toHaveAttribute('id', 'row-title');
    expect(title).toHaveAttribute('aria-describedby', 'row-meta');
    const levels = [2, 4, 5, 6] as const;
    for (const level of levels) {
      const { container: ranked } = render(
        <ListItem variant='editorial'>
          <ListItemTitle level={level}>Rank {level}</ListItemTitle>
        </ListItem>
      );
      expect(ranked.querySelector('.eg-list-item__title')?.tagName).toBe(`H${level}`);
    }
  });

  it('slots one anchor for the whole editorial row and forwards its native API', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLAnchorElement>();
    const click = vi.fn((event) => event.preventDefault());
    render(
      <ListItem asChild={true} variant='editorial'>
        <a ref={ref} href='#notes' onClick={click}>
          <ListItemBody>
            <ListItemTitle>Linked row</ListItemTitle>
          </ListItemBody>
        </a>
      </ListItem>
    );
    const link = screen.getByRole('link', { name: 'Linked row' });
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute('href', '#notes');
    expect(link).toHaveClass('eg-list-item');
    expect(link).toHaveAttribute('data-variant', 'editorial');
    expect(link.parentElement?.tagName).toBe('DIV');
    await user.click(link);
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('exposes one tab stop and one accessible name per linked row', async () => {
    const user = userEvent.setup();
    const first = vi.fn();
    const second = vi.fn();
    render(
      <>
        <ListItem asChild={true} variant='editorial'>
          <a href='#first' onClick={first}>
            <ListItemLeading>
              <time dateTime='2026-09-12'>12</time>
            </ListItemLeading>
            <ListItemBody>
              <ListItemTitle>First stream</ListItemTitle>
            </ListItemBody>
            <ListItemTrailing>18:04</ListItemTrailing>
          </a>
        </ListItem>
        <ListItem asChild={true} variant='editorial-divided'>
          <a href='#second' onClick={second}>
            <ListItemBody>
              <ListItemTitle>Second stream</ListItemTitle>
            </ListItemBody>
          </a>
        </ListItem>
        <ListItem variant='editorial'>
          <ListItemBody>
            <ListItemTitle>Static stream</ListItemTitle>
          </ListItemBody>
        </ListItem>
      </>
    );
    const link = screen.getByRole('link', { name: '12 First stream 18:04' });
    await user.tab();
    expect(link).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Second stream' })).toHaveFocus();
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(document.querySelector('[data-variant=editorial]:not(a)')).not.toHaveAttribute('tabindex');
    link.focus();
    await user.keyboard('{Enter}');
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it('adds no link affordance to static rows and paints only a bottom hairline when divided', () => {
    const { container } = render(
      <ListItem variant='editorial-divided'>
        <ListItemBody>
          <ListItemTitle>Static stream</ListItemTitle>
          <ListItemMeta>2026-08-30</ListItemMeta>
        </ListItemBody>
        <ListItemTrailing>42:11</ListItemTrailing>
      </ListItem>
    );
    const root = container.querySelector('.eg-list-item');
    expect(root?.tagName).toBe('DIV');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveClass(
      'data-[variant=editorial-divided]:data-[state=default]:bg-transparent',
      'data-[variant=editorial-divided]:data-[state=default]:bg-none',
      'data-[variant=editorial-divided]:data-[state=default]:shadow-none',
      'data-[variant=editorial-divided]:data-[state=default]:rounded-none',
      'data-[variant=editorial-divided]:data-[state=default]:border-x-0',
      'data-[variant=editorial-divided]:data-[state=default]:border-t-0',
      'data-[variant=editorial-divided]:data-[state=default]:border-b',
      'data-[variant=editorial-divided]:data-[state=default]:border-border-hairline'
    );
    const classes = (root?.className ?? '').split(/\s+/).filter(Boolean);
    const hoverRules = classes.filter(
      (name) =>
        /:(hover|focus-visible):/.test(name) && name.includes('data-[variant=editorial') && !name.includes('not-data-')
    );
    expect(hoverRules.length).toBeGreaterThan(0);
    for (const rule of hoverRules) {
      expect(rule, rule).toContain('[&:is(a)]');
    }
    expect(classes).toContain(
      'data-[state=default]:not-data-[variant=editorial]:not-data-[variant=editorial-divided]:hover:border-border-hairline-strong'
    );
    expect(classes).not.toContain('data-[state=default]:hover:border-border-hairline-strong');
  });

  it('keys linked hover, focus and motion to existing tokens and reduced motion', () => {
    const { container } = render(
      <ListItem asChild={true} variant='editorial'>
        <a href='#row'>Row</a>
      </ListItem>
    );
    const root = container.querySelector('.eg-list-item');
    for (const token of [
      'data-[variant=editorial]:duration-(--duration-fast)',
      'data-[variant=editorial]:ease-(--ease-out)',
      'data-[variant=editorial]:motion-reduce:transition-none',
      'data-[state=default]:data-[variant=editorial]:[&:is(a)]:hover:border-border-brand',
      'data-[state=default]:data-[variant=editorial]:[&:is(a)]:hover:[background:var(--gradient-sheen),var(--color-surface-2)]',
      'data-[variant=editorial]:[&:is(a)]:focus-visible:outline-none',
      'data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus',
      'data-[variant=editorial]:[&:is(a)]:hover:[&>.eg-list-item__trailing]:text-fg-brand-raised'
    ]) {
      expect(root, token).toHaveClass(token);
    }
    const classes = (root?.className ?? '').split(/\s+/).filter(Boolean);
    expect(classes.some((name) => /#[0-9a-f]{3,8}/i.test(name) || /rgba?\(/.test(name))).toBe(false);
  });

  it('keeps the row element itself as the anchor inside a linked list', () => {
    const { container } = render(
      <ul>
        {['2026-09-12', '2026-08-30'].map((dateTime, index) => (
          <li key={dateTime}>
            <ListItem asChild={true} variant={index === 0 ? 'editorial' : 'editorial-divided'}>
              <a href={`#${dateTime}`}>
                <ListItemLeading>
                  <time dateTime={dateTime}>{index + 12}</time>
                </ListItemLeading>
                <ListItemBody>
                  <ListItemTitle>Stream {index + 1}</ListItemTitle>
                  <ListItemMeta>{dateTime}</ListItemMeta>
                </ListItemBody>
                <ListItemTrailing>18:04</ListItemTrailing>
              </a>
            </ListItem>
          </li>
        ))}
      </ul>
    );
    const links = [...container.querySelectorAll('a')];
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveClass('eg-list-item');
      expect(link).toHaveAttribute('data-variant', expect.stringMatching(/^editorial(-divided)?$/));
      expect(link.parentElement?.tagName).toBe('LI');
      expect(link.parentElement).not.toHaveAttribute('data-variant');
      expect(link.parentElement?.className ?? '').not.toContain('eg-list-item');
      const parts = [
        '.eg-list-item__leading',
        '.eg-list-item__body',
        '.eg-list-item__title',
        '.eg-list-item__trailing'
      ];
      for (const selector of parts) {
        expect(link.querySelector(selector), selector).not.toBeNull();
      }
      expect(link.querySelector('.eg-list-item__leading')?.parentElement).toBe(link);
      expect(link.querySelector('.eg-list-item__trailing')?.parentElement).toBe(link);
    }
  });

  it('documents that an ancestor list item cannot carry the editorial row recipe', () => {
    const { container } = render(
      <ListItem asChild={true} variant='editorial'>
        <li>
          <a href='#nested'>
            <ListItemBody>
              <ListItemTitle>Nested anchor</ListItemTitle>
            </ListItemBody>
          </a>
        </li>
      </ListItem>
    );
    const row = container.querySelector('.eg-list-item');
    expect(row?.tagName).toBe('LI');
    expect(row).toHaveAttribute('data-variant', 'editorial');
    expect(container.querySelector('a')).not.toHaveAttribute('data-variant');
    expect(container.querySelector('a')?.className ?? '').not.toContain('eg-list-item');
  });

  it('merges each editorial part className independently', () => {
    const { container } = render(
      <ListItem variant='editorial' className='mt-2'>
        <ListItemLeading className='w-full'>Leading</ListItemLeading>
        <ListItemBody>
          <ListItemTitle className='text-label-default'>Title</ListItemTitle>
        </ListItemBody>
        <ListItemTrailing className='gap-1'>Trailing</ListItemTrailing>
      </ListItem>
    );
    expect(container.querySelector('.eg-list-item')).toHaveClass('mt-2');
    expect(container.querySelector('.eg-list-item__leading')).toHaveClass('w-full');
    const title = container.querySelector('.eg-list-item__title');
    expect(title).toHaveClass('text-label-default');
    expect(title).not.toHaveClass('text-body-large');
    const trailing = container.querySelector('.eg-list-item__trailing');
    expect(trailing).toHaveClass('gap-1');
    expect(trailing).not.toHaveClass('gap-2');
  });

  it('keeps the editorial API closed at the type level', () => {
    expectTypeOf<{ size: 'lg'; children: ReactElement }>().not.toExtend<ListItemProps>();
    expectTypeOf<{ variant: 'editorial'; size: 'md'; children: ReactElement }>().toExtend<ListItemProps>();
    expectTypeOf<Extract<'level', keyof ListItemProps>>().toBeNever();
    expectTypeOf<Extract<1 | 7, ListItemTitleProps['level']>>().toBeNever();
    expectTypeOf<Extract<'ref' | 'role' | 'tabIndex', keyof ListItemTitleProps>>().toBeNever();
    expectTypeOf<ListItemTitleProps['level']>().toEqualTypeOf<2 | 3 | 4 | 5 | 6 | undefined>();
    expectTypeOf<ReturnType<typeof useListItemTitle>['component']>().toEqualTypeOf<'h2' | 'h3' | 'h4' | 'h5' | 'h6'>();
  });
});
