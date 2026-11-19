import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'vite';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { surfaceVariants } from '../../primitives/surface';
import { Tabs } from './index';
import { useTabs } from './useTabs';

const items = [
  { value: 'queue', label: 'Queue', content: 'Queued posts' },
  { value: 'drafts', label: 'Drafts', content: 'Draft posts' },
  { value: 'published', label: 'Published', content: 'Published posts' }
];
const base = { items, label: 'Post views' };

/** Tabs v0.4 edge-fade utilities, applied only to scrollable lists. */
const edgeFadeUtilities = [
  '[--eg-tabs-fade-size:var(--space-8)]',
  'scroll-px-8',
  '[--mask-fade-left:var(--eg-tabs-fade-start)]',
  '[--mask-fade-right:var(--eg-tabs-fade-end)]',
  'rtl:[--mask-fade-left:var(--eg-tabs-fade-end)]',
  'rtl:[--mask-fade-right:var(--eg-tabs-fade-start)]',
  'supports-[animation-timeline:scroll()]:[mask-image:var(--mask-scroll-fade-inline)]',
  'supports-[animation-timeline:scroll()]:[mask-repeat:no-repeat]',
  'supports-[animation-timeline:scroll()]:[mask-size:var(--mask-fade-left)_100%,calc(100%_-_var(--mask-fade-left)_-_var(--mask-fade-right))_100%,var(--mask-fade-right)_100%]',
  'supports-[animation-timeline:scroll()]:[mask-position:left,var(--mask-fade-left)_0,right]',
  'supports-[animation-timeline:scroll()]:[animation-name:eg-tabs-edge-fade]',
  'supports-[animation-timeline:scroll()]:[animation-duration:auto]',
  'supports-[animation-timeline:scroll()]:[animation-timing-function:linear]',
  'supports-[animation-timeline:scroll()]:[animation-fill-mode:both]',
  'supports-[animation-timeline:scroll()]:[animation-timeline:scroll(self_inline)]'
];

function selected(name: string) {
  expect(screen.getByRole('tab', { name })).toHaveAttribute('aria-selected', 'true');
}

function scrollButton(side: 'start' | 'end'): HTMLButtonElement {
  const button = screen.getByText(`Scroll tabs to ${side}`).closest('button');
  if (!button) {
    throw new Error(`Missing ${side} scroll button`);
  }
  return button;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

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
    expect(list).toHaveClass('p-1.5', 'scroll-px-8');
    expect(list).not.toHaveClass('p-0.75', 'scroll-px-1.5');
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
    expect(rule('.scroll-px-8')).toMatch(/scroll-padding-inline:\s*var\(--space-8\)/);
  }, 30_000);

  it.each([
    ['a fitted full-width segmented list', 'segmented', true, 117, 117, false],
    ['an overflowing intrinsic segmented list', 'segmented', false, 117, 176, false],
    ['an overflowing underline list', 'underline', false, 117, 176, true],
    ['an overflowing underline list with fullWidth', 'underline', true, 117, 176, true]
  ] as const)(
    'preserves native focus scrolling for %s',
    async (_name, variant, fullWidth, clientWidth, scrollWidth, reveal) => {
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
      if (reveal) {
        expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'instant'
        });
      } else {
        expect(scrollIntoView).not.toHaveBeenCalled();
      }
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
      // fullWidth toggles the v0.4-A scroll area wrapper, which remounts the list: query fresh nodes.
      const list = screen.getByRole('tablist');
      const tab = screen.getByRole('tab', { name: 'Long queued posts 0' });
      const count = within(tab).getByText('0');
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

describe('Tabs outline variant', () => {
  const outlineItems = [
    { value: 'apps', label: 'My apps', count: 3, content: 'Installed apps' },
    { value: 'catalog', label: 'Catalog', content: 'Available apps' }
  ];
  const outlineBase = { items: outlineItems, label: 'App views' };
  const outlineTreatment = [
    'min-h-8.5',
    'px-3',
    'rounded-[calc(var(--radius-md)---spacing(0.75))]',
    'border',
    'border-transparent',
    'text-fg-secondary',
    'data-[state=active]:text-fg-default',
    'data-[state=active]:border-state-selected',
    'data-[state=active]:[background:var(--gradient-chip-active),var(--color-surface-1)]',
    'data-[state=active]:shadow-[var(--shadow-edge-strong)]',
    'focus-visible:outline-none',
    'focus-visible:shadow-focus',
    'data-[state=active]:focus-visible:shadow-focus'
  ];

  // SHA-256 of JSON [list, trigger, count, typeof onFocus] for every variant/size/layout combination,
  // captured at v0.3 (ff6438f) with scroll-px-1.5 filtered from the list. v0.4 adds the edge-fade
  // utilities (filtered below). v0.4-A intentionally adds an underline focus handler; assert it separately
  // and normalize only that entry to its v0.3 value before comparing the unchanged fingerprints.
  const v03Recipes: Record<string, string> = {
    'underline|md|false|false': 'b7e7458902c516780666e15a9541296e4e3a895d467ac915f3f544517879be2c',
    'underline|md|false|true': 'b7e7458902c516780666e15a9541296e4e3a895d467ac915f3f544517879be2c',
    'underline|md|true|false': 'b7e7458902c516780666e15a9541296e4e3a895d467ac915f3f544517879be2c',
    'underline|md|true|true': 'b7e7458902c516780666e15a9541296e4e3a895d467ac915f3f544517879be2c',
    'underline|sm|false|false': 'd21a97d345ae7ecd826ce0c1b809eb725f29aeef1504af97fcaacd37bc4e35c2',
    'underline|sm|false|true': 'd21a97d345ae7ecd826ce0c1b809eb725f29aeef1504af97fcaacd37bc4e35c2',
    'underline|sm|true|false': 'd21a97d345ae7ecd826ce0c1b809eb725f29aeef1504af97fcaacd37bc4e35c2',
    'underline|sm|true|true': 'd21a97d345ae7ecd826ce0c1b809eb725f29aeef1504af97fcaacd37bc4e35c2',
    'segmented|md|false|false': 'd64840bd41c311550f4b9fa74fb935e3a6c019f6a3e6913bd056cbfb98f99ea5',
    'segmented|md|false|true': 'd3e44fa60eaf3913c522a7b1e0cf1a788673b947f7615dda328a5d738c39278c',
    'segmented|md|true|false': 'ed4ea369c1e97530ea3470c23b4d9df64fdc7bcec2fa6ba35b630fd6a15f49f8',
    'segmented|md|true|true': '32a231c592d7d77e1226cd72e2ca3e9cc4924ab0ae8c49809500fd28178c7443',
    'segmented|sm|false|false': 'd64840bd41c311550f4b9fa74fb935e3a6c019f6a3e6913bd056cbfb98f99ea5',
    'segmented|sm|false|true': 'd3e44fa60eaf3913c522a7b1e0cf1a788673b947f7615dda328a5d738c39278c',
    'segmented|sm|true|false': 'ed4ea369c1e97530ea3470c23b4d9df64fdc7bcec2fa6ba35b630fd6a15f49f8',
    'segmented|sm|true|true': '32a231c592d7d77e1226cd72e2ca3e9cc4924ab0ae8c49809500fd28178c7443',
    'outline|md|false|false': '51509cff3bc7f03bb648b7427460079ce802846325a1a72ed17f5db97d87ae0b',
    'outline|md|false|true': '60b3e60262457586795239d4a68710f9841a0d6c65ab20d1734b0db73d4c3345',
    'outline|md|true|false': '2700b37a73cf2a0a045161573617d4b1b3164be6ffba1e7d0b98f7c8ece74a95',
    'outline|md|true|true': '25304d1bac7cf0daedc1d35a8a4b3c0661abfcfc61413de7243c3188247e7e5b',
    'outline|sm|false|false': '51509cff3bc7f03bb648b7427460079ce802846325a1a72ed17f5db97d87ae0b',
    'outline|sm|false|true': '60b3e60262457586795239d4a68710f9841a0d6c65ab20d1734b0db73d4c3345',
    'outline|sm|true|false': '2700b37a73cf2a0a045161573617d4b1b3164be6ffba1e7d0b98f7c8ece74a95',
    'outline|sm|true|true': '25304d1bac7cf0daedc1d35a8a4b3c0661abfcfc61413de7243c3188247e7e5b'
  };

  it('keeps every list, trigger, counter and focus handler byte-identical to v0.3 apart from the edge fade', () => {
    const counted = [{ value: 'a', label: 'A', count: 1, content: 'x' }];
    for (const variant of ['underline', 'segmented', 'outline'] as const) {
      for (const size of ['md', 'sm'] as const) {
        for (const fullWidth of [false, true]) {
          for (const labelWrap of [false, true]) {
            const { result: hook } = renderHook(() =>
              useTabs({ items: counted, label: 'L', variant, size, fullWidth, labelWrap })
            );
            const result = hook.current;
            const list = (result.listProps.className ?? '')
              .split(' ')
              .filter((part) => part !== 'scroll-px-1.5' && !edgeFadeUtilities.includes(part))
              .join(' ');
            const focusType = typeof result.listProps.onFocus;
            expect(focusType).toBe(variant === 'underline' || fullWidth ? 'function' : 'undefined');
            const fingerprint = createHash('sha256')
              .update(
                JSON.stringify([
                  list,
                  result.triggerClassName,
                  result.items[0]?.countClassName,
                  variant === 'underline' ? 'undefined' : focusType
                ])
              )
              .digest('hex');
            const key = `${variant}|${size}|${fullWidth}|${labelWrap}`;
            expect(fingerprint, key).toBe(v03Recipes[key]);
          }
        }
      }
    }
  });

  it('composes the existing well on the outline list with segmented geometry', () => {
    const { rerender } = render(<Tabs {...outlineBase} variant='outline' />);
    const list = screen.getByRole('tablist', { name: 'App views' });
    const well = surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' })
      .split(' ')
      .filter((part) => part !== 'p-0');
    expect(list).toHaveClass(...well, 'inline-flex', 'self-start', 'gap-0.5', 'p-0.75');
    expect(list).not.toHaveClass('p-0', 'border-b', 'overflow-x-auto', 'grid');
    const tab = screen.getByRole('tab', { name: 'My apps 3' });
    expect(tab).toHaveClass(...outlineTreatment);
    const classes = tab.className;
    rerender(<Tabs {...outlineBase} variant='outline' size='sm' />);
    expect(tab.className).toBe(classes);
  });

  it('paints the selected box from accent-following roles without the segmented overlay or tint', () => {
    render(<Tabs {...outlineBase} variant='outline' />);
    const tab = screen.getByRole('tab', { name: 'My apps 3' });
    expect(tab.className).not.toContain('before:');
    expect(tab.className).not.toContain('after:');
    expect(tab).not.toHaveClass(
      'isolate',
      'border-0',
      'data-[state=active]:bg-state-selected-surface',
      'data-[state=active]:bg-[image:var(--gradient-sheen)]',
      'data-[state=active]:border-border-brand',
      'data-[state=active]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)]'
    );
    expect(tab.className).not.toMatch(/primitive-|#[\da-f]|rgba\(|shadow-elev|glow/i);
  });

  it('transfers the selected treatment as Radix selection moves, without changing classes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs {...outlineBase} variant='outline' onValueChange={onValueChange} />);
    const apps = screen.getByRole('tab', { name: 'My apps 3' });
    const catalog = screen.getByRole('tab', { name: 'Catalog' });
    expect(apps).toHaveAttribute('data-state', 'active');
    expect(catalog).toHaveAttribute('data-state', 'inactive');
    const classes = [apps.className, catalog.className];
    expect(catalog).toHaveClass(...outlineTreatment);
    await user.click(catalog);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('catalog');
    expect(catalog).toHaveAttribute('aria-selected', 'true');
    expect(apps).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByRole('tabpanel', { name: 'Catalog' })).toHaveTextContent('Available apps');
    expect([apps.className, catalog.className]).toEqual(classes);
    await user.keyboard('{ArrowRight}');
    expect(apps).toHaveFocus();
    selected('My apps 3');
  });

  it('keeps selection and emits nothing when only the variant changes', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs {...outlineBase} variant='segmented' defaultValue='catalog' onValueChange={onValueChange} />
    );
    rerender(<Tabs {...outlineBase} variant='outline' defaultValue='catalog' onValueChange={onValueChange} />);
    selected('Catalog');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('applies fullWidth to outline with equal columns, focus-ring padding and centered labels', () => {
    render(<Tabs {...outlineBase} variant='outline' fullWidth={true} />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass(
      'grid',
      'grid-flow-col',
      'auto-cols-[1fr]',
      'w-full',
      'self-stretch',
      'overflow-x-auto',
      'p-1.5',
      'scroll-px-8',
      '[&::-webkit-scrollbar]:h-1.5'
    );
    expect(list).not.toHaveClass('inline-flex', 'self-start', 'p-0.75');
    expect(screen.getByRole('tab', { name: 'Catalog' })).toHaveClass('justify-center', 'whitespace-nowrap');
  });

  it('applies labelWrap to outline, keeping counters together, and both props combine', () => {
    const { rerender } = render(<Tabs {...outlineBase} variant='outline' labelWrap={true} />);
    const tab = screen.getByRole('tab', { name: 'My apps 3' });
    expect(tab).toHaveClass('whitespace-normal', 'wrap-anywhere', 'text-start', 'justify-start', 'py-1');
    expect(tab).not.toHaveClass('whitespace-nowrap', 'justify-center');
    expect(within(tab).getByText('3')).toHaveClass('whitespace-nowrap');
    rerender(<Tabs {...outlineBase} variant='outline' fullWidth={true} labelWrap={true} />);
    const wrapped = screen.getByRole('tab', { name: 'My apps 3' });
    expect(wrapped).toHaveClass('wrap-break-word', 'whitespace-normal', 'text-start');
    expect(wrapped).toHaveClass(...outlineTreatment);
  });

  it('reveals the focused tab when the full-width outline list overflows', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs {...outlineBase} variant='outline' fullWidth={true} onValueChange={onValueChange} />);
    const list = screen.getByRole('tablist');
    Object.defineProperties(list, {
      clientWidth: { configurable: true, value: 80 },
      scrollWidth: { configurable: true, value: 160 }
    });
    const catalog = screen.getByRole('tab', { name: 'Catalog' });
    const scrollIntoView = vi.fn();
    Object.defineProperty(catalog, 'scrollIntoView', { configurable: true, value: scrollIntoView });
    await user.tab();
    await user.keyboard('{End}');
    expect(catalog).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('catalog');
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  });

  it('does not attach the reveal handler to the intrinsic outline list', () => {
    const intrinsic = renderHook(() => useTabs({ ...outlineBase, variant: 'outline' })).result.current;
    expect(intrinsic.listProps.onFocus).toBeUndefined();
    const filled = renderHook(() => useTabs({ ...outlineBase, variant: 'outline', fullWidth: true })).result.current;
    expect(filled.listProps.onFocus).toBeTypeOf('function');
  });
});

describe('Tabs scroll buttons (v0.4-A)', () => {
  it.each([
    ['underline', 'underline', false, true],
    ['underline with fullWidth', 'underline', true, true],
    ['full-width segmented', 'segmented', true, true],
    ['full-width outline', 'outline', true, true],
    ['intrinsic segmented', 'segmented', false, false],
    ['intrinsic outline', 'outline', false, false]
  ] as const)('wraps only the scrollable %s list', (_name, variant, fullWidth, scrollable) => {
    const { container } = render(<Tabs {...base} variant={variant} fullWidth={fullWidth} />);
    const root = container.firstElementChild;
    const list = screen.getByRole('tablist');
    expect(root).not.toBeNull();
    if (scrollable) {
      const area = list.parentElement;
      expect(area?.parentElement).toBe(root);
      expect(area).toHaveClass('relative');
      expect(area?.children).toHaveLength(3);
      expect(scrollButton('start').parentElement).toBe(area);
      expect(scrollButton('end').parentElement).toBe(area);
    } else {
      expect(list.parentElement).toBe(root);
      expect(root?.children).toHaveLength(items.length + 1);
      expect(screen.queryByText('Scroll tabs to start')).not.toBeInTheDocument();
      expect(screen.queryByText('Scroll tabs to end')).not.toBeInTheDocument();
    }
  });

  it.each(['ltr', 'rtl'] as const)('tracks %s edges on scroll, resize and changed items', (direction) => {
    let notifyResize: (() => void) | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this);
      }
      observe = observe;
      unobserve = vi.fn();
      disconnect = disconnect;
    }
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    const { rerender, unmount } = render(<Tabs {...base} />);
    const list = screen.getByRole('tablist');
    list.style.direction = direction;
    let width = 300;
    let position = 0;
    Object.defineProperties(list, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, get: () => width },
      scrollLeft: { configurable: true, get: () => position }
    });
    const start = scrollButton('start');
    const end = scrollButton('end');
    const state = (startState: string, endState: string) => {
      expect(start).toHaveAttribute('data-state', startState);
      expect(end).toHaveAttribute('data-state', endState);
    };
    expect(observe).toHaveBeenCalledWith(list);
    for (const tab of screen.getAllByRole('tab')) {
      expect(observe).toHaveBeenCalledWith(tab);
    }
    fireEvent.scroll(list);
    state('hidden', 'visible');
    position = direction === 'rtl' ? -100 : 100;
    fireEvent.scroll(list);
    state('visible', 'visible');
    position = direction === 'rtl' ? -200 : 200;
    fireEvent.scroll(list);
    state('visible', 'hidden');
    position = 0;
    width = 100;
    act(() => notifyResize?.());
    state('hidden', 'hidden');
    width = 300;
    act(() => notifyResize?.());
    state('hidden', 'visible');
    rerender(<Tabs {...base} items={[...items, { value: 'new', label: 'New', content: 'New posts' }]} />);
    expect(observe).toHaveBeenCalledWith(screen.getByRole('tab', { name: 'New' }));
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it.each([
    ['ltr', false, 'smooth', -148.8, 148.8],
    ['rtl', true, 'instant', 148.8, -148.8]
  ] as const)(
    'scrolls a page in %s with reduced motion %s without changing selection',
    async (direction, reduced, behavior, startDistance, endDistance) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const matchMedia = vi.fn(() => ({ matches: reduced }));
      vi.stubGlobal('matchMedia', matchMedia);
      render(<Tabs {...base} onValueChange={onValueChange} />);
      const list = screen.getByRole('tablist');
      list.style.direction = direction;
      Object.defineProperties(list, {
        clientWidth: { configurable: true, value: 200 },
        scrollWidth: { configurable: true, value: 600 },
        scrollLeft: { configurable: true, value: direction === 'rtl' ? -200 : 200 }
      });
      const scrollBy = vi.fn();
      Object.defineProperty(list, 'scrollBy', { configurable: true, value: scrollBy });
      const start = scrollButton('start');
      const end = scrollButton('end');
      for (const button of [start, end]) {
        vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({ width: 25.6 } as DOMRect);
      }
      fireEvent.scroll(list);
      await user.click(start);
      await user.click(end);
      expect(scrollBy).toHaveBeenNthCalledWith(1, { left: startDistance, behavior });
      expect(scrollBy).toHaveBeenNthCalledWith(2, { left: endDistance, behavior });
      expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
      selected('Queue');
      expect(onValueChange).not.toHaveBeenCalled();
    }
  );

  it.each(['start', 'end'] as const)('keeps the hovered %s button inert until pointer leave', (side) => {
    const onValueChange = vi.fn();
    render(<Tabs {...base} onValueChange={onValueChange} />);
    const list = screen.getByRole('tablist');
    let position = 100;
    Object.defineProperties(list, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 300 },
      scrollLeft: { configurable: true, get: () => position }
    });
    const scrollBy = vi.fn();
    Object.defineProperty(list, 'scrollBy', { configurable: true, value: scrollBy });
    const button = scrollButton(side);
    fireEvent.scroll(list);
    expect(button).toHaveAttribute('data-state', 'visible');
    fireEvent.pointerEnter(button);
    position = side === 'start' ? 0 : 200;
    fireEvent.scroll(list);
    expect(button).toHaveAttribute('data-state', 'inert');
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(scrollBy).not.toHaveBeenCalled();
    selected('Queue');
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.pointerLeave(button);
    expect(button).toHaveAttribute('data-state', 'hidden');
  });

  it('hides the scroll buttons from assistive technology and skips them on Tab', async () => {
    const user = userEvent.setup();
    render(<Tabs {...base} />);
    for (const side of ['start', 'end'] as const) {
      const button = scrollButton(side);
      expect(button).toHaveAttribute('aria-hidden', 'true');
      expect(button).toHaveAttribute('tabindex', '-1');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveClass('hidden', '[@media(hover:hover)_and_(pointer:fine)]:inline-flex');
      expect(button).toHaveClass('data-[state=hidden]:invisible', 'data-[state=hidden]:pointer-events-none');
      expect(button).toHaveClass('data-[state=inert]:opacity-45', 'motion-reduce:transition-none');
      expect(button.querySelector('svg')).toHaveClass(
        ...(side === 'start' ? ['rotate-90', 'rtl:-rotate-90'] : ['-rotate-90', 'rtl:rotate-90'])
      );
    }
    expect(screen.queryByRole('button', { name: /scroll tabs/i })).not.toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Queue' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tabpanel', { name: 'Queue' })).toHaveFocus();
  });
});

describe('Tabs edge fade (v0.4)', () => {
  it.each([
    ['underline md', { variant: 'underline', size: 'md' }],
    ['underline sm', { variant: 'underline', size: 'sm' }],
    ['segmented full width', { variant: 'segmented', fullWidth: true }],
    ['outline full width', { variant: 'outline', fullWidth: true }],
    ['segmented full width wrapped', { variant: 'segmented', fullWidth: true, labelWrap: true }]
  ] as const)('masks the scroll edges and pads focus past the fade on the %s list', (_, props) => {
    render(<Tabs {...base} {...props} />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass(...edgeFadeUtilities);
    expect(list).not.toHaveClass('scroll-px-1.5');
    expect(list.className).not.toMatch(/(^|\s)(supports-\[[^\]]+\]:)?\[animation:/);
  });

  it.each([
    ['segmented', 'segmented'],
    ['outline', 'outline']
  ] as const)('leaves the non-scrolling intrinsic %s list without a mask or scroll padding', (_, variant) => {
    render(<Tabs {...base} variant={variant} />);
    const list = screen.getByRole('tablist');
    for (const utility of edgeFadeUtilities) {
      expect(list).not.toHaveClass(utility);
    }
  });

  it('keeps selection, keyboard and panel behavior on a masked underline list', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs {...base} onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard('{End}');
    const tabs = screen.getAllByRole('tab');
    const last = tabs[tabs.length - 1];
    expect(last).toHaveFocus();
    expect(last).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
});
