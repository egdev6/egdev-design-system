import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { surfaceVariants } from '../../primitives/surface';
import { Tabs } from './index';
import { useTabs } from './useTabs';

const items = [
  { value: 'queue', label: 'Queue', content: 'Queued posts' },
  { value: 'drafts', label: 'Drafts', content: 'Draft posts' },
  { value: 'published', label: 'Published', content: 'Published posts' }
];
const base = { items, label: 'Post views' };

function selected(name: string) {
  expect(screen.getByRole('tab', { name })).toHaveAttribute('aria-selected', 'true');
}

describe('Tabs public contract', () => {
  it('derives Radix props and counter presence without taking over state', () => {
    const { result } = renderHook(() =>
      useTabs({
        ...base,
        items: [{ value: 'queue', label: 'Queue', count: 0, content: null }],
        variant: 'segmented'
      })
    );
    expect(result.current.rootProps).toMatchObject({
      value: undefined,
      defaultValue: 'queue',
      orientation: 'horizontal',
      activationMode: 'automatic'
    });
    expect(result.current.items[0]).toMatchObject({ showCount: true, count: 0, content: null });
    expect(result.current.listProps['aria-label']).toBe('Post views');
  });

  it('renders a named horizontal tablist, ordered tabs and a legacy-safe root', () => {
    const { container } = render(
      <Tabs {...base} id='post-tabs' title='Views' data-owner='posts' className='mt-2 mt-4 w-full' />
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass('eg-tabs', 'flex', 'flex-col', 'gap-0', 'border-0', 'overflow-visible', 'mt-4', 'w-full');
    expect(root).not.toHaveClass('mt-2');
    expect(root).toHaveAttribute('id', 'post-tabs');
    expect(root).toHaveAttribute('title', 'Views');
    expect(root).toHaveAttribute('data-owner', 'posts');
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    const list = screen.getByRole('tablist', { name: 'Post views' });
    expect(list).toHaveAttribute('data-orientation', 'horizontal');
    expect(
      within(list)
        .getAllByRole('tab')
        .map((tab) => tab.textContent)
    ).toEqual(['Queue', 'Drafts', 'Published']);
    selected('Queue');
    expect(container.querySelector('[class*="eg-tabs__"], [class*="eg-tabs--"], .is-active')).toBeNull();
  });

  it('keeps every Radix panel relationship, hiding wrappers and unmounting inactive contents', async () => {
    const user = userEvent.setup();
    const mounted = vi.fn();
    const unmounted = vi.fn();
    function Probe() {
      useEffect(() => {
        mounted();
        return unmounted;
      }, []);
      return <span>Queued posts</span>;
    }
    render(
      <Tabs
        {...base}
        items={[{ ...items[0], value: 'queue', label: 'Queue', content: <Probe /> }, ...items.slice(1)]}
      />
    );
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    expect(panels).toHaveLength(3);
    for (const tab of screen.getAllByRole('tab')) {
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
      expect(panel).toHaveAttribute('role', 'tabpanel');
      expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    }
    expect(screen.getByRole('tabpanel', { name: 'Queue' })).toBeVisible();
    expect(screen.queryByText('Draft posts')).not.toBeInTheDocument();
    expect(mounted).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('tab', { name: 'Drafts' }));
    selected('Drafts');
    expect(screen.getByRole('tabpanel', { name: 'Drafts' })).toHaveTextContent('Draft posts');
    expect(panels[0]).toHaveAttribute('hidden');
    expect(panels[0]).toBeEmptyDOMElement();
    expect(unmounted).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('tab', { name: 'Queue' }));
    expect(mounted).toHaveBeenCalledTimes(2);
  });

  it('derives the first enabled default without emitting a change; explicit defaultValue wins', () => {
    const onValueChange = vi.fn();
    const enabledItems = items.map((item, index) => ({ ...item, disabled: index === 0 }));
    const { unmount } = render(<Tabs {...base} items={enabledItems} onValueChange={onValueChange} />);
    selected('Drafts');
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();
    render(<Tabs {...base} items={enabledItems} defaultValue='published' onValueChange={onValueChange} />);
    selected('Published');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('delegates automatic arrow/Home/End activation, looping and disabled skipping to Radix', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs
        {...base}
        items={items.map((item) => ({ ...item, disabled: item.value === 'drafts' }))}
        onValueChange={onValueChange}
      />
    );
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Queue' })).toHaveFocus();
    for (const [key, name, value] of [
      ['{ArrowRight}', 'Published', 'published'],
      ['{ArrowRight}', 'Queue', 'queue'],
      ['{ArrowLeft}', 'Published', 'published'],
      ['{Home}', 'Queue', 'queue'],
      ['{End}', 'Published', 'published']
    ]) {
      await user.keyboard(key ?? '');
      expect(screen.getByRole('tab', { name })).toHaveFocus();
      selected(name ?? '');
      expect(onValueChange).toHaveBeenLastCalledWith(value);
    }
    expect(onValueChange).toHaveBeenCalledTimes(5);
    const disabled = screen.getByRole('tab', { name: 'Drafts' });
    expect(disabled).toBeDisabled();
    expect(disabled).toHaveAttribute('data-disabled');
    await user.click(disabled);
    expect(onValueChange).toHaveBeenCalledTimes(5);
    await user.tab();
    expect(screen.getByRole('tabpanel', { name: 'Published' })).toHaveFocus();
  });

  it('notifies clicks once, does not re-emit for the active tab and never submits a form', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Tabs {...base} onValueChange={onValueChange} />
      </form>
    );
    await user.click(screen.getByRole('tab', { name: 'Drafts' }));
    selected('Drafts');
    await user.click(screen.getByRole('tab', { name: 'Drafts' }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('drafts');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps controlled selection until its owner updates the value, without prop-change events', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Tabs {...base} value='queue' onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Published' }));
    // A fixed controlled value can be requested by both Radix pointer and automatic focus activation.
    expect(onValueChange).toHaveBeenCalledWith('published');
    expect(onValueChange.mock.calls.every(([value]) => value === 'published')).toBe(true);
    const requests = onValueChange.mock.calls.length;
    selected('Queue');
    rerender(<Tabs {...base} value='published' onValueChange={onValueChange} />);
    selected('Published');
    expect(onValueChange).toHaveBeenCalledTimes(requests);
  });

  it('renders uncapped counts including zero and fractions in accessible names, with own tone parts', () => {
    render(
      <Tabs
        {...base}
        items={[
          { ...items[0], value: 'queue', label: 'Queue', count: 0, content: 'Queued posts' },
          { ...items[1], value: 'drafts', label: 'Drafts', count: 312.5, content: 'Draft posts' },
          { ...items[2], value: 'errors', label: 'With errors', count: -1, tone: 'danger', content: 'Errors' }
        ]}
      />
    );
    for (const name of ['Queue 0', 'Drafts 312.5', 'With errors -1']) {
      const tab = screen.getByRole('tab', { name });
      expect(tab.querySelector('span')).toHaveClass('tabular-nums', 'shadow-edge', 'h-5', 'min-w-5');
      expect(tab.querySelector('.eg-badge')).toBeNull();
    }
    expect(screen.getByText('-1')).toHaveClass('bg-status-danger/14', 'text-status-danger');
    expect(screen.getByText('-1')).not.toHaveClass('bg-bg-glass', 'text-fg-secondary');
    expect(screen.getByText('0')).toHaveClass('bg-bg-glass', 'text-fg-secondary');
  });

  it('supports one enabled item, keyboard stays put, and distinct instances have unique Radix ids', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tabs {...base} items={items.slice(0, 1)} />
        <Tabs {...base} label='Other views' />
      </>
    );
    const tabs = screen.getAllByRole('tab');
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    expect(new Set([...tabs, ...panels].map((part) => part.id)).size).toBe(tabs.length + panels.length);
    await user.tab();
    await user.keyboard('{ArrowRight}{End}{Home}');
    expect(tabs[0]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('applies underline dimensions, scrolling, state indicator and reduced-motion/focus utilities', () => {
    const { rerender } = render(<Tabs {...base} />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass('border-b', 'border-border-default', 'overflow-x-auto', '[scrollbar-width:none]');
    const tab = screen.getByRole('tab', { name: 'Queue' });
    expect(tab).toHaveClass('min-h-11', 'px-3', 'text-label-default', 'after:inset-x-3');
    expect(tab).toHaveClass(
      'data-[state=active]:after:bg-fg-brand-default',
      'data-[state=active]:after:shadow-glow-base'
    );
    expect(tab).toHaveClass(
      'motion-reduce:transition-none',
      'motion-reduce:after:transition-none',
      'disabled:opacity-45',
      'disabled:pointer-events-none'
    );
    expect(tab).toHaveClass('focus-visible:inset-ring-2', 'focus-visible:inset-ring-focus-ring');
    expect(screen.getByRole('tabpanel')).toHaveClass(
      'pt-4',
      'focus-visible:outline-2',
      'focus-visible:outline-focus-ring'
    );
    rerender(<Tabs {...base} size='sm' />);
    expect(tab).toHaveClass('min-h-9', 'px-2', 'after:inset-x-2', 'text-label-default');
    expect(tab).not.toHaveClass('min-h-11', 'px-3', 'after:inset-x-3');
  });

  it('composes the existing well on the actual segmented list, refining only layout and padding', () => {
    const { rerender } = render(<Tabs {...base} variant='segmented' />);
    const list = screen.getByRole('tablist');
    const well = surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' })
      .split(' ')
      .filter((part) => part !== 'p-0');
    expect(list).toHaveClass(...well, 'inline-flex', 'self-start', 'gap-0.5', 'p-0.75');
    expect(list).not.toHaveClass('p-0', 'p-6', 'rounded-xl', 'overflow-x-auto');
    const tab = screen.getByRole('tab', { name: 'Queue' });
    expect(tab).toHaveClass('min-h-8.5', 'px-3', 'rounded-[calc(var(--radius-md)---spacing(0.75))]');
    expect(tab).toHaveClass('data-[state=active]:bg-surface-3', 'data-[state=active]:bg-[image:var(--gradient-sheen)]');
    expect(tab).toHaveClass(
      'data-[state=active]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)]',
      'focus-visible:shadow-focus',
      'data-[state=active]:focus-visible:shadow-focus'
    );
    const classes = tab.className;
    rerender(<Tabs {...base} variant='segmented' size='sm' />);
    expect(tab.className).toBe(classes);
    expect(tab.className).not.toContain('after:');
  });

  it('renders the selected default on the server without effects or browser-only initialization', () => {
    const html = renderToString(<Tabs {...base} defaultValue='drafts' />);
    expect(html).toContain('Draft posts');
    expect(html).not.toContain('Queued posts');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tabpanel"');
  });
});
