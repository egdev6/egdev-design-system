import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'vite';
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
      'data-[state=active]:after:bg-state-selected',
      'data-[state=active]:after:shadow-[var(--shadow-state-indicator)]'
    );
    expect(tab).not.toHaveClass('data-[state=active]:after:bg-fg-brand-default');
    expect(tab).not.toHaveClass('data-[state=active]:after:shadow-glow-base');
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
    expect(tab).toHaveClass(
      'data-[state=active]:bg-state-selected-surface',
      'data-[state=active]:bg-[image:var(--gradient-sheen)]'
    );
    expect(tab).not.toHaveClass('data-[state=active]:bg-surface-3');
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

  it('uses the approved segmented border and non-interactive tint as selection moves', async () => {
    const user = userEvent.setup();
    render(<Tabs {...base} variant='segmented' />);
    const queue = screen.getByRole('tab', { name: 'Queue' });
    const drafts = screen.getByRole('tab', { name: 'Drafts' });
    const selectedTreatment = [
      'isolate',
      'border',
      'border-transparent',
      'data-[state=active]:border-border-brand',
      'data-[state=active]:bg-state-selected-surface',
      'data-[state=active]:bg-[image:var(--gradient-sheen)]',
      'data-[state=active]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)]',
      "data-[state=active]:before:content-['']",
      'data-[state=active]:before:pointer-events-none',
      'data-[state=active]:before:absolute',
      'data-[state=active]:before:inset-0',
      'data-[state=active]:before:-z-10',
      'data-[state=active]:before:rounded-[inherit]',
      'data-[state=active]:before:bg-border-brand'
    ];
    for (const tab of [queue, drafts]) {
      expect(tab).toHaveClass(...selectedTreatment);
      expect(tab).not.toHaveClass('border-0');
      expect(tab).not.toHaveClass('data-[state=active]:bg-surface-3');
    }
    expect(queue).toHaveAttribute('data-state', 'active');
    expect(drafts).toHaveAttribute('data-state', 'inactive');
    const classes = [queue.className, drafts.className];
    await user.click(drafts);
    expect(queue).toHaveAttribute('data-state', 'inactive');
    expect(drafts).toHaveAttribute('data-state', 'active');
    expect(drafts).toHaveAttribute('aria-selected', 'true');
    expect([queue.className, drafts.className]).toEqual(classes);
  });

  it('renders the selected default on the server without effects or browser-only initialization', () => {
    const html = renderToString(<Tabs {...base} defaultValue='drafts' />);
    expect(html).toContain('Draft posts');
    expect(html).not.toContain('Queued posts');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tabpanel"');
  });
});

describe('Tabs segmented layout opt-ins', () => {
  it.each([
    ['full-width segmented', 'segmented', true],
    ['underline', 'underline', false]
  ] as const)(
    'uses Radix roving focus without preventScroll for %s keyboard navigation',
    async (_name, variant, fullWidth) => {
      const user = userEvent.setup();
      render(<Tabs {...base} variant={variant} fullWidth={fullWidth} />);
      const published = screen.getByRole('tab', { name: 'Published' });
      const focus = vi.spyOn(published, 'focus');
      await user.tab();
      await user.keyboard('{End}');
      expect(published).toHaveFocus();
      expect(focus).toHaveBeenLastCalledWith({ preventScroll: false });
      focus.mockRestore();
    }
  );

  it.each([false, true])('reveals focused tabs on overflow with labelWrap=%s', async (labelWrap) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onFocus = vi.fn();
    render(
      <Tabs
        {...base}
        variant='segmented'
        fullWidth={true}
        labelWrap={labelWrap}
        onValueChange={onValueChange}
        onFocus={onFocus}
      />
    );
    const list = screen.getByRole('tablist');
    Object.defineProperties(list, {
      clientWidth: { configurable: true, value: 117 },
      scrollWidth: { configurable: true, value: 176 }
    });
    const queue = screen.getByRole('tab', { name: 'Queue' });
    const drafts = screen.getByRole('tab', { name: 'Drafts' });
    const published = screen.getByRole('tab', { name: 'Published' });
    const queueScroll = vi.fn();
    const draftsScroll = vi.fn();
    const publishedScroll = vi.fn();
    Object.defineProperty(queue, 'scrollIntoView', { configurable: true, value: queueScroll });
    Object.defineProperty(drafts, 'scrollIntoView', { configurable: true, value: draftsScroll });
    Object.defineProperty(published, 'scrollIntoView', { configurable: true, value: publishedScroll });
    const options = { block: 'nearest', inline: 'nearest', behavior: 'instant' };

    await user.tab();
    expect(queueScroll).toHaveBeenCalledExactlyOnceWith(options);
    await user.keyboard('{End}');
    expect(published).toHaveFocus();
    expect(published).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('published');
    expect(onFocus).toHaveBeenCalled();
    expect(publishedScroll).toHaveBeenCalledExactlyOnceWith(options);
    await user.keyboard('{Home}{ArrowRight}');
    expect(queueScroll).toHaveBeenCalledTimes(2);
    expect(queueScroll).toHaveBeenLastCalledWith(options);
    expect(drafts).toHaveFocus();
    expect(drafts).toHaveAttribute('aria-selected', 'true');
    expect(draftsScroll).toHaveBeenCalledExactlyOnceWith(options);
    expect(onValueChange.mock.calls).toEqual([['published'], ['queue'], ['drafts']]);
  });

  it('reserves token-derived space for the segmented focus ring at the scrollport and its edges', () => {
    render(<Tabs {...base} variant='segmented' fullWidth={true} />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass('p-1.5', 'scroll-px-1.5');
    expect(list).not.toHaveClass('p-0.75');
  });

  it('compiles the focus-ring padding and logical scroll padding into production CSS', async () => {
    const entry = resolve('packages/ui/src/styles/compiled.css');
    const result = await build({
      configFile: false,
      envDir: false,
      plugins: [tailwindcss({ optimize: false })],
      logLevel: 'warn',
      build: { write: false, minify: false, cssMinify: false, rolldownOptions: { input: entry } }
    });
    const outputs = (Array.isArray(result) ? result : [result]).flatMap((output) =>
      'output' in output ? output.output : []
    );
    const asset = outputs.find((output) => output.type === 'asset' && output.fileName.endsWith('.css'));
    if (asset?.type !== 'asset') {
      throw new Error('Missing production CSS output');
    }
    const css = String(asset.source);
    const rule = (selector: string) => {
      const start = css.indexOf(selector);
      expect(start, selector).toBeGreaterThan(-1);
      return css.slice(start, css.indexOf('}', start) + 1);
    };
    expect(rule(String.raw`.p-1\.5`)).toMatch(/padding:\s*calc\(var\(--space-1\)\s*\*\s*1\.5\)/);
    expect(rule(String.raw`.scroll-px-1\.5`)).toMatch(/scroll-padding-inline:\s*calc\(var\(--space-1\)\s*\*\s*1\.5\)/);
  }, 30_000);

  it.each([
    ['a fitted full-width segmented list', 'segmented', true, 117, 117],
    ['an overflowing intrinsic segmented list', 'segmented', false, 117, 176],
    ['an overflowing underline list', 'underline', false, 117, 176],
    ['an overflowing underline list with fullWidth', 'underline', true, 117, 176]
  ] as const)(
    'preserves native focus scrolling for %s',
    async (_name, variant, fullWidth, clientWidth, scrollWidth) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Tabs {...base} variant={variant} fullWidth={fullWidth} onValueChange={onValueChange} />);
      const list = screen.getByRole('tablist');
      Object.defineProperties(list, {
        clientWidth: { configurable: true, value: clientWidth },
        scrollWidth: { configurable: true, value: scrollWidth }
      });
      const published = screen.getByRole('tab', { name: 'Published' });
      const scrollIntoView = vi.fn();
      Object.defineProperty(published, 'scrollIntoView', { configurable: true, value: scrollIntoView });
      await user.tab();
      await user.keyboard('{End}');
      expect(published).toHaveFocus();
      expect(published).toHaveAttribute('aria-selected', 'true');
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('published');
      expect(scrollIntoView).not.toHaveBeenCalled();
    }
  );

  it('keeps Radix keyboard selection working when scrollIntoView is unavailable', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs {...base} variant='segmented' fullWidth={true} onValueChange={onValueChange} />);
    const list = screen.getByRole('tablist');
    Object.defineProperties(list, {
      clientWidth: { configurable: true, value: 117 },
      scrollWidth: { configurable: true, value: 176 }
    });
    const published = screen.getByRole('tab', { name: 'Published' });
    Object.defineProperty(published, 'scrollIntoView', { configurable: true, value: undefined });
    await user.tab();
    await user.keyboard('{End}');
    expect(published).toHaveFocus();
    expect(published).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('published');
  });

  const countedItems = [
    { value: 'queue', label: 'Long queued posts', count: 0, content: 'Queued posts' },
    { value: 'drafts', label: 'UnbrokenLongDraftsLabel', count: 312, content: 'Draft posts' },
    { value: 'disabled', label: 'Unavailable', disabled: true, content: 'Unavailable posts' }
  ];

  it('consumes both props without forwarding attributes or emitting React warnings', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const { container } = render(<Tabs {...base} variant='segmented' fullWidth={true} labelWrap={true} />);
      expect(container.firstElementChild?.outerHTML).not.toMatch(/(?:fullwidth|labelwrap)=/i);
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('fills the segmented list with equal centered columns, visible overflow and the existing Surface well', () => {
    render(<Tabs {...base} variant='segmented' fullWidth={true} />);
    const list = screen.getByRole('tablist', { name: 'Post views' });
    const well = surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' })
      .split(' ')
      .filter((part) => part !== 'p-0');
    expect(list).toHaveClass(
      ...well,
      'grid',
      'grid-flow-col',
      'auto-cols-[1fr]',
      'w-full',
      'self-stretch',
      'overflow-x-auto'
    );
    expect(list).not.toHaveClass('inline-flex', 'self-start', '[scrollbar-width:none]');
    // Thin, token-colored scrollbar: WebKit/Blink pseudo-elements without arrow buttons, and the
    // standard properties only where those pseudo-elements do not exist (Firefox).
    expect(list).toHaveClass(
      '[&::-webkit-scrollbar]:h-1.5',
      '[&::-webkit-scrollbar-track]:bg-transparent',
      '[&::-webkit-scrollbar-thumb]:rounded-full',
      '[&::-webkit-scrollbar-thumb]:bg-border-control',
      'hover:[&::-webkit-scrollbar-thumb]:bg-fg-muted',
      '[&::-webkit-scrollbar-button]:hidden',
      'supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin]',
      'supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-color:var(--color-border-control)_transparent]'
    );
    expect(list).not.toHaveClass('[scrollbar-width:thin]');
    expect(screen.getByRole('tab', { name: 'Queue' })).toHaveClass('justify-center', 'whitespace-nowrap');
  });

  it('wraps segmented labels independently, keeping counters together and avoiding a minimum width', () => {
    render(<Tabs {...base} items={countedItems} variant='segmented' labelWrap={true} />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass('inline-flex', 'self-start');
    expect(list).not.toHaveClass('grid', 'w-full', 'overflow-x-auto');
    for (const name of ['Long queued posts 0', 'UnbrokenLongDraftsLabel 312']) {
      const tab = screen.getByRole('tab', { name });
      expect(tab).toHaveClass('whitespace-normal', 'wrap-anywhere', 'text-start', 'justify-start', 'py-1');
      expect(tab).not.toHaveClass('whitespace-nowrap', 'justify-center', 'text-balance');
      expect(tab.className).not.toMatch(/(?:^|\s)min-w-/);
      expect(within(tab).getByText(name.endsWith(' 0') ? '0' : '312')).toHaveClass('whitespace-nowrap');
    }
  });

  it('supports all combinations, preserves explicit false defaults and never emits selection on reflow', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs {...base} items={countedItems} variant='segmented' onValueChange={onValueChange} />
    );
    const list = screen.getByRole('tablist');
    const tab = screen.getByRole('tab', { name: 'Long queued posts 0' });
    const count = within(tab).getByText('0');
    const defaults = [list.className, tab.className, count.className];
    for (const [fullWidth, labelWrap] of [
      [false, false],
      [true, false],
      [false, true],
      [true, true]
    ]) {
      rerender(
        <Tabs
          {...base}
          items={countedItems}
          variant='segmented'
          fullWidth={fullWidth}
          labelWrap={labelWrap}
          onValueChange={onValueChange}
        />
      );
      expect(list.classList.contains('grid')).toBe(fullWidth);
      expect(tab.classList.contains('whitespace-normal')).toBe(labelWrap);
      expect(tab.classList.contains('justify-center')).toBe(fullWidth && !labelWrap);
      expect(tab.classList.contains('justify-start')).toBe(labelWrap);
      // Full width owns a scroll container, so words stay whole there and long ones widen the column;
      // without full width, breaking anywhere is what keeps a long word inside the host.
      expect(tab.classList.contains('wrap-anywhere')).toBe(labelWrap && !fullWidth);
      expect(tab.classList.contains('wrap-break-word')).toBe(labelWrap && fullWidth);
      expect(count.classList.contains('whitespace-nowrap')).toBe(labelWrap);
      expect(tab).toHaveAttribute('aria-selected', 'true');
      if (!fullWidth && !labelWrap) {
        expect([list.className, tab.className, count.className]).toEqual(defaults);
      }
    }
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tabpanel', { name: 'Long queued posts 0' })).toHaveTextContent('Queued posts');
  });

  it('leaves all underline list, trigger and counter classes unchanged for both sizes and every combination', () => {
    const { rerender } = render(<Tabs {...base} items={countedItems} />);
    for (const size of ['md', 'sm'] as const) {
      rerender(<Tabs {...base} items={countedItems} size={size} />);
      const list = screen.getByRole('tablist');
      const tab = screen.getByRole('tab', { name: 'Long queued posts 0' });
      const count = within(tab).getByText('0');
      const defaults = [list.className, tab.className, count.className];
      for (const [fullWidth, labelWrap] of [
        [false, false],
        [true, false],
        [false, true],
        [true, true]
      ]) {
        rerender(<Tabs {...base} items={countedItems} size={size} fullWidth={fullWidth} labelWrap={labelWrap} />);
        expect([list.className, tab.className, count.className]).toEqual(defaults);
      }
    }
  });

  it('preserves automatic keyboard activation, looping, disabled skipping, panel relations and Tab exit with both props', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs
        {...base}
        items={countedItems}
        variant='segmented'
        fullWidth={true}
        labelWrap={true}
        onValueChange={onValueChange}
      />
    );
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Long queued posts 0' })).toHaveFocus();
    for (const [key, name, value] of [
      ['{ArrowRight}', 'UnbrokenLongDraftsLabel 312', 'drafts'],
      ['{ArrowRight}', 'Long queued posts 0', 'queue'],
      ['{ArrowLeft}', 'UnbrokenLongDraftsLabel 312', 'drafts'],
      ['{Home}', 'Long queued posts 0', 'queue'],
      ['{End}', 'UnbrokenLongDraftsLabel 312', 'drafts']
    ]) {
      await user.keyboard(key ?? '');
      const tab = screen.getByRole('tab', { name });
      expect(tab).toHaveFocus();
      expect(tab).toHaveAttribute('aria-selected', 'true');
      expect(onValueChange).toHaveBeenLastCalledWith(value);
      expect(screen.getByRole('tabpanel', { name })).toHaveAttribute('aria-labelledby', tab.id);
    }
    expect(onValueChange).toHaveBeenCalledTimes(5);
    await user.click(screen.getByRole('tab', { name: 'Unavailable' }));
    expect(onValueChange).toHaveBeenCalledTimes(5);
    await user.tab();
    expect(screen.getByRole('tabpanel', { name: 'UnbrokenLongDraftsLabel 312' })).toHaveFocus();
  });

  it('retains controlled selection until acknowledged while both layout props are enabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs
        {...base}
        items={countedItems}
        variant='segmented'
        fullWidth={true}
        labelWrap={true}
        value='queue'
        onValueChange={onValueChange}
      />
    );
    await user.click(screen.getByRole('tab', { name: 'UnbrokenLongDraftsLabel 312' }));
    expect(onValueChange).toHaveBeenCalledWith('drafts');
    expect(onValueChange.mock.calls.every(([value]) => value === 'drafts')).toBe(true);
    const requests = onValueChange.mock.calls.length;
    selected('Long queued posts 0');
    rerender(
      <Tabs
        {...base}
        items={countedItems}
        variant='segmented'
        fullWidth={true}
        labelWrap={true}
        value='drafts'
        onValueChange={onValueChange}
      />
    );
    selected('UnbrokenLongDraftsLabel 312');
    expect(onValueChange).toHaveBeenCalledTimes(requests);
  });
});
