import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import type { ListItemPartProps, ListItemProps, ListItemStatus, ListItemVariant } from '../../index';
import {
  ListItem,
  ListItemActions,
  ListItemBody,
  ListItemContent,
  ListItemFooter,
  ListItemMedia,
  ListItemMeta
} from '../../index';
import { useListItem } from '../../molecules/list-item/useListItem';

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
