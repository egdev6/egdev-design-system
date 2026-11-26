import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { linkVariants } from '../../atoms/link/types';
import { Breadcrumb } from './Breadcrumb';
import {
  type BreadcrumbItem,
  type BreadcrumbProps,
  breadcrumbCurrentVariants,
  breadcrumbLinkVariants,
  breadcrumbListVariants,
  breadcrumbSeparatorVariants,
  breadcrumbStepVariants,
  breadcrumbVariants
} from './types';
import { useBreadcrumb } from './useBreadcrumb';

const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  // Intentionally silent: development warnings are asserted, not printed.
});

afterEach(() => {
  consoleWarn.mockClear();
  vi.unstubAllEnvs();
});

// Hash destinations keep jsdom's navigation stub silent when a link is activated.
const home: BreadcrumbItem = { label: 'Home', href: '#home' };
const editorial: BreadcrumbItem = { label: 'Editorial', href: '#editorial' };
const post: BreadcrumbItem = { label: 'Post title' };
const trail: BreadcrumbItem[] = [home, editorial, post];

const labelWarning = 'Breadcrumb requires a non-empty label. Nothing was rendered.';
const blankLabelWarning = (index: number) =>
  `Breadcrumb omitted the entry at index ${index}: it needs a non-blank label.`;
const missingHrefWarning = (index: number) =>
  `Breadcrumb omitted the entry at index ${index}: an ancestor entry needs a non-empty href.`;

// The one documented cast: a JavaScript caller can pass values that the public types reject.
function untyped(props: Record<string, unknown>): BreadcrumbProps {
  return props as unknown as BreadcrumbProps;
}

describe('Breadcrumb structure', () => {
  it('renders one named navigation landmark with the stable marker holding one native ordered list (BC-01)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(nav);
    expect(nav.tagName).toBe('NAV');
    expect(nav).toHaveClass('eg-breadcrumb');
    expect(nav.children).toHaveLength(1);
    const list = nav.firstElementChild as HTMLElement;
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('list')).toHaveLength(1);
    expect(screen.getByRole('list')).toBe(list);
  });

  it('renders one list item per step in the supplied order, with no role override anywhere (BC-01)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(trail.length);
    expect(steps.map((step) => step.tagName)).toEqual(['LI', 'LI', 'LI']);
    expect(steps.map((step) => step.textContent)).toEqual(['Home', 'Editorial', 'Post title']);
    expect(nav.querySelector('[role]')).toBeNull();
    expect(container.querySelectorAll('[role]')).toHaveLength(0);
  });

  it('takes every visible and accessible string from props, so a second wording leaves nothing behind (BC-01)', () => {
    const first = [
      { label: 'Home', href: '#home' },
      { label: 'Editorial', href: '#editorial' },
      { label: 'Post title' }
    ];
    const second = [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Editorial', href: '#editorial' },
      { label: 'Titulo' }
    ];
    const { rerender } = render(<Breadcrumb label='Breadcrumb' items={first} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    // The landmark text is exactly the joined supplied labels: the component contributes no string of its own.
    expect(nav.textContent).toBe('HomeEditorialPost title');
    rerender(<Breadcrumb label='Migas de pan' items={second} />);
    const renamed = screen.getByRole('navigation', { name: 'Migas de pan' });
    expect(renamed.textContent).toBe('InicioEditorialTitulo');
    expect(renamed.textContent).not.toContain('Home');
    expect(renamed.textContent).not.toContain('Post title');
    expect(screen.queryByRole('navigation', { name: 'Breadcrumb' })).toBeNull();
    expect(within(renamed).getAllByRole('listitem')).toHaveLength(3);
  });

  it('returns a typed hook result for the component to render (BC-01)', () => {
    const { result } = renderHook(() => useBreadcrumb({ label: 'Breadcrumb', items: trail }));
    expect(Object.keys(result.current).sort()).toEqual(['listClassName', 'rootProps', 'steps', 'valid']);
    expect(result.current.valid).toBe(true);
    expect(result.current.rootProps['aria-label']).toBe('Breadcrumb');
    expect(result.current.rootProps.className).toContain('eg-breadcrumb');
    expect(result.current.steps.map(({ label }) => label)).toEqual(['Home', 'Editorial', 'Post title']);
  });
});

describe('Breadcrumb ancestors', () => {
  it('renders every entry except the last as one link named by its label, with its href, in order (BC-02)', () => {
    render(<Breadcrumb label='Breadcrumb' items={trail} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(trail.length - 1);
    expect(links.map((link) => link.textContent)).toEqual(['Home', 'Editorial']);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home');
    expect(screen.getByRole('link', { name: 'Editorial' })).toHaveAttribute('href', '#editorial');
    // Each link is the only child of its own list item, and the current page follows them.
    const steps = screen.getAllByRole('listitem');
    expect(links[0]?.closest('li')).toBe(steps[0]);
    expect(links[1]?.closest('li')).toBe(steps[1]);
    expect(screen.getByText('Post title').closest('li')).toBe(steps[2]);
    expect(steps[2]?.querySelector('a')).toBeNull();
  });

  it('renders each link through the Link atom with the quiet variant, no arrow and no new-tab behavior (BC-02)', () => {
    render(<Breadcrumb label='Breadcrumb' items={trail} />);
    for (const [index, link] of screen.getAllByRole('link').entries()) {
      expect(link).toHaveClass('eg-link');
      // Every class of the quiet recipe is present: the link is the exported Link atom, not a lookalike.
      expect(link).toHaveClass(...linkVariants({ variant: 'quiet' }).split(' '));
      expect(link).not.toHaveClass('text-link-default');
      expect(link.querySelector('svg')).toBeNull();
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
      // No new-tab notice text: the link name is exactly its label.
      expect(link.textContent).toBe(trail[index]?.label);
    }
  });

  it('hands Link the quiet variant, no arrow and the destination of each ancestor (BC-02)', () => {
    const { result } = renderHook(() => useBreadcrumb({ label: 'Breadcrumb', items: trail }));
    const [first, second, third] = result.current.steps;
    expect(first?.link).toMatchObject({ href: '#home', variant: 'quiet', arrow: false });
    expect(second?.link).toMatchObject({ href: '#editorial', variant: 'quiet', arrow: false });
    expect(third?.link).toBeUndefined();
  });
});

describe('Breadcrumb separators', () => {
  it('renders one decorative separator after every step except the last, each hidden from assistive technology (BC-04)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    // The links carry no arrow, so every svg of the landmark is a separator.
    const separators = [...container.querySelectorAll('svg')];
    expect(separators).toHaveLength(trail.length - 1);
    for (const separator of separators) {
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).toHaveAttribute('focusable', 'false');
      expect(separator).toHaveClass('eg-icon');
    }
    // Each separator closes the step it follows, after the link, and the last step has none.
    const steps = screen.getAllByRole('listitem');
    expect(steps[0]?.lastElementChild).toBe(separators[0]);
    expect(steps[1]?.lastElementChild).toBe(separators[1]);
    expect(steps[2]?.querySelector('svg')).toBeNull();
    expect(steps[0]?.firstElementChild?.tagName).toBe('A');
  });

  it('adds no text and no role to any name or reading: links keep their label as name and no image is exposed (BC-04)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('svg[role]')).toBeNull();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Editorial' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' }).textContent).toBe('HomeEditorialPost title');
  });

  it('renders no separator for a single step (BC-04)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={[{ label: 'Home' }]} />);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('gives a separator class to every step except the last in the hook result (BC-04)', () => {
    const { result } = renderHook(() => useBreadcrumb({ label: 'Breadcrumb', items: trail }));
    expect(result.current.steps.map((step) => step.separatorClassName !== undefined)).toEqual([true, true, false]);
  });
});

describe('Breadcrumb landmark name', () => {
  it.each([
    ['empty', ''],
    ['whitespace-only', '   '],
    ['undefined', undefined],
    ['null', null],
    ['a number', 42],
    ['an object', { text: 'not a string' }]
  ])('warns once and renders nothing when the label is %s (BC-06)', (_name, label) => {
    const { container } = render(<Breadcrumb {...untyped({ label, items: trail })} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(consoleWarn).toHaveBeenCalledTimes(1);
    expect(consoleWarn).toHaveBeenCalledWith(labelWarning);
  });

  it('renders normally on a later valid rerender and never leaves an unnamed landmark (BC-06)', () => {
    const { container, rerender } = render(<Breadcrumb {...untyped({ label: '   ', items: trail })} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Breadcrumb label='Breadcrumb' items={trail} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    rerender(<Breadcrumb {...untyped({ label: '', items: trail })} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('checks the label before any entry, so an unnamed trail reports only the label (BC-06)', () => {
    render(<Breadcrumb {...untyped({ label: ' ', items: [{ label: '' }, { label: 'Home' }] })} />);
    expect(consoleWarn.mock.calls).toEqual([[labelWarning]]);
  });

  it('is silent in production (BC-06)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<Breadcrumb {...untyped({ label: '', items: trail })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});

describe('Breadcrumb entry validation', () => {
  it.each([
    ['a blank label', { label: '', href: '#editorial' }],
    ['a whitespace-only label', { label: '   ', href: '#editorial' }],
    ['a non-string label', { label: 42, href: '#editorial' }],
    ['a missing label', { href: '#editorial' }],
    ['a null entry', null],
    ['a non-object entry', 'Editorial']
  ])('omits an ancestor with %s and warns with its supplied index (BC-05)', (_name, entry) => {
    const { container } = render(<Breadcrumb {...untyped({ label: 'Breadcrumb', items: [home, entry, post] })} />);
    expect(screen.getAllByRole('listitem').map((step) => step.textContent)).toEqual(['Home', 'Post title']);
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Home']);
    expect(consoleWarn.mock.calls).toEqual([[blankLabelWarning(1)]]);
    // Separators sit only between rendered steps: two rendered steps, one separator.
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it.each([
    ['no href', { label: 'Editorial' }],
    ['an empty href', { label: 'Editorial', href: '' }],
    ['a non-string href', { label: 'Editorial', href: 42 }],
    ['a null href', { label: 'Editorial', href: null }]
  ])('omits an ancestor with %s and warns with the href message (BC-05)', (_name, entry) => {
    const { container } = render(<Breadcrumb {...untyped({ label: 'Breadcrumb', items: [home, entry, post] })} />);
    expect(screen.getAllByRole('listitem').map((step) => step.textContent)).toEqual(['Home', 'Post title']);
    expect(screen.queryByRole('link', { name: 'Editorial' })).toBeNull();
    expect(consoleWarn.mock.calls).toEqual([[missingHrefWarning(1)]]);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('reports the label problem first when an ancestor lacks both a label and an href (BC-05)', () => {
    render(<Breadcrumb {...untyped({ label: 'Breadcrumb', items: [{ label: ' ' }, post] })} />);
    expect(consoleWarn.mock.calls).toEqual([[blankLabelWarning(0)]]);
  });

  it('forwards a whitespace-only href as supplied, with no URL validation (BC-05)', () => {
    render(<Breadcrumb label='Breadcrumb' items={[{ label: 'Home', href: ' ' }, post]} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', ' ');
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('renders every label as supplied, without trimming or rewriting it (BC-05)', () => {
    render(<Breadcrumb label='Breadcrumb' items={[{ label: '  Home ', href: '#home' }, { label: ' Post title ' }]} />);
    expect(screen.getByRole('link').textContent).toBe('  Home ');
    expect(screen.getByText('Post title').textContent).toBe(' Post title ');
  });

  it('omits an invalid current page, promotes nobody and ends the trail at the last remaining link (BC-05)', () => {
    const { container } = render(
      <Breadcrumb {...untyped({ label: 'Breadcrumb', items: [home, editorial, { label: '   ' }] })} />
    );
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Home', 'Editorial']);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(0);
    // No separator follows the last rendered step, even though it is an ancestor link here.
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    expect(screen.getAllByRole('listitem')[1]?.querySelector('svg')).toBeNull();
    expect(consoleWarn.mock.calls).toEqual([[blankLabelWarning(2)]]);
  });

  it('keeps the supplied index in the warning of every omitted entry, even after earlier omissions (BC-05)', () => {
    render(
      <Breadcrumb
        {...untyped({
          label: 'Breadcrumb',
          items: [{ label: '' }, home, { label: 'Section' }, { label: 'Topic', href: '#topic' }, { label: 'Post' }]
        })}
      />
    );
    expect(consoleWarn.mock.calls).toEqual([[blankLabelWarning(0)], [missingHrefWarning(2)]]);
    expect(screen.getAllByRole('listitem').map((step) => step.textContent)).toEqual(['Home', 'Topic', 'Post']);
    expect(screen.getByText('Post')).toHaveAttribute('aria-current', 'page');
  });

  it.each([
    ['an empty array', []],
    ['undefined', undefined],
    ['null', null],
    ['a string', 'Home'],
    ['a plain object', { label: 'Home' }]
  ])('renders nothing and warns nothing when items is %s (BC-05)', (_name, items) => {
    const { container } = render(<Breadcrumb {...untyped({ label: 'Breadcrumb', items })} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('renders nothing, with one warning per entry, when no entry is valid (BC-05)', () => {
    const { container } = render(
      <Breadcrumb {...untyped({ label: 'Breadcrumb', items: [{ label: '' }, { label: 'Section' }, null] })} />
    );
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[blankLabelWarning(0)], [missingHrefWarning(1)], [blankLabelWarning(2)]]);
  });

  it('warns during render only, so a StrictMode double render repeats the same exact messages (BC-05)', () => {
    render(
      <StrictMode>
        <Breadcrumb {...untyped({ label: 'Breadcrumb', items: [{ label: '' }, post] })} />
      </StrictMode>
    );
    expect(new Set(consoleWarn.mock.calls.map(([message]) => message))).toEqual(new Set([blankLabelWarning(0)]));
  });

  it('is silent in production (BC-05)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    render(<Breadcrumb {...untyped({ label: 'Breadcrumb', items: [{ label: '' }, post] })} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('reports validity and an empty step list from the hook when nothing can render (BC-05, BC-06)', () => {
    const unnamed = renderHook(() => useBreadcrumb(untyped({ label: ' ', items: trail })));
    expect(unnamed.result.current).toMatchObject({ valid: false, steps: [] });
    const empty = renderHook(() => useBreadcrumb({ label: 'Breadcrumb', items: [] }));
    expect(empty.result.current).toMatchObject({ valid: false, steps: [] });
    const rendered = renderHook(() => useBreadcrumb({ label: 'Breadcrumb', items: trail }));
    expect(rendered.result.current.valid).toBe(true);
  });
});

describe('Breadcrumb current page', () => {
  it('renders the last entry as a span marked aria-current page that is not a link (BC-03)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    const current = screen.getByText('Post title');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.closest('a')).toBeNull();
    expect(current).not.toHaveAttribute('href');
    expect(current).not.toHaveAttribute('tabindex');
    expect(screen.queryByRole('link', { name: 'Post title' })).toBeNull();
    // Exactly one element of the landmark carries aria-current.
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(container.querySelector('[aria-current]')).toBe(current);
  });

  it('ignores an href on the last entry: the current page is never a link (BC-03)', () => {
    const { container } = render(
      <Breadcrumb
        label='Breadcrumb'
        items={[
          { label: 'Home', href: '#home' },
          { label: 'Post title', href: '#post-title' }
        ]}
      />
    );
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.queryByRole('link', { name: 'Post title' })).toBeNull();
    expect(container.querySelector('a[href="#post-title"]')).toBeNull();
    expect(container.querySelector('[href="#post-title"]')).toBeNull();
    expect(screen.getByText('Post title')).toHaveAttribute('aria-current', 'page');
  });

  it('renders a single entry as the current page alone, with no link (BC-03)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={[{ label: 'Home' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
  });

  it('describes the current page to the component as aria-current page with its own text recipe (BC-03)', () => {
    const { result } = renderHook(() => useBreadcrumb({ label: 'Breadcrumb', items: trail }));
    const [first, second, third] = result.current.steps;
    expect(third?.current).toMatchObject({ 'aria-current': 'page' });
    expect(third?.current?.className).toContain('text-fg-default');
    expect(first?.current).toBeUndefined();
    expect(second?.current).toBeUndefined();
  });
});

describe('Breadcrumb navigation callback', () => {
  it('calls onNavigate once with the original entry and the React click event for a clicked ancestor (BC-07)', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn<NonNullable<BreadcrumbProps['onNavigate']>>();
    render(<Breadcrumb label='Breadcrumb' items={trail} onNavigate={onNavigate} />);
    await user.click(screen.getByRole('link', { name: 'Editorial' }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(editorial, expect.objectContaining({ type: 'click' }));
    // The very same entry object, never a copy, so a host can look it up by reference.
    expect(onNavigate.mock.calls[0]?.[0]).toBe(editorial);
    expect(onNavigate.mock.calls[0]?.[1].nativeEvent).toBeInstanceOf(MouseEvent);
  });

  it('calls it for the root link too, and for Enter on a focused ancestor link (BC-07)', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn<NonNullable<BreadcrumbProps['onNavigate']>>();
    render(<Breadcrumb label='Breadcrumb' items={trail} onNavigate={onNavigate} />);
    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(onNavigate).toHaveBeenLastCalledWith(home, expect.objectContaining({ type: 'click' }));
    // The click focused the Home link, so the next Tab stop is the Editorial link.
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Editorial' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onNavigate).toHaveBeenCalledTimes(2);
    expect(onNavigate).toHaveBeenLastCalledWith(editorial, expect.objectContaining({ type: 'click' }));
    expect(onNavigate.mock.calls[1]?.[0]).toBe(editorial);
  });

  it('never prevents default itself, and preventDefault inside the callback cancels native navigation (BC-07)', async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];
    const events: boolean[] = [];
    const { rerender } = render(
      <Breadcrumb
        label='Breadcrumb'
        items={trail}
        onNavigate={(_item, event) => {
          seen.push(event.defaultPrevented);
          events.push(event.nativeEvent.defaultPrevented);
        }}
      />
    );
    await user.click(screen.getByRole('link', { name: 'Editorial' }));
    // At the time of the call nothing has prevented the click, and it stays native afterwards.
    expect(seen).toEqual([false]);
    expect(window.location.hash).toBe('#editorial');
    window.location.hash = '';
    rerender(
      <Breadcrumb
        label='Breadcrumb'
        items={trail}
        onNavigate={(_item, event) => {
          event.preventDefault();
        }}
      />
    );
    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(window.location.hash).toBe('');
  });

  it('never calls onNavigate for the current page or a separator (BC-07)', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn<NonNullable<BreadcrumbProps['onNavigate']>>();
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} onNavigate={onNavigate} />);
    await user.click(screen.getByText('Post title'));
    for (const separator of container.querySelectorAll('svg')) {
      await user.click(separator);
    }
    await user.click(screen.getByRole('navigation', { name: 'Breadcrumb' }));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('keeps the click native with no handler at all when onNavigate is absent (BC-07)', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useBreadcrumb({ label: 'Breadcrumb', items: trail }));
    expect(result.current.steps.map((step) => step.link?.onClick)).toEqual([undefined, undefined, undefined]);
    render(<Breadcrumb label='Breadcrumb' items={trail} />);
    await user.click(screen.getByRole('link', { name: 'Editorial' }));
    expect(window.location.hash).toBe('#editorial');
    window.location.hash = '';
  });

  it('does not leak onNavigate to the landmark as an unknown DOM attribute (BC-07)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: React reports unknown event handler properties through console.error.
    });
    render(<Breadcrumb label='Breadcrumb' items={trail} onNavigate={() => undefined} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.getAttributeNames().sort()).toEqual(['aria-label', 'class']);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('Breadcrumb root props', () => {
  it('merges className last on the root only and keeps the stable marker (BC-09)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} className='mt-6 self-start' />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const classes = nav.className.split(' ');
    expect(classes).toContain('eg-breadcrumb');
    expect(classes).toContain('mt-6');
    expect(classes).toContain('self-start');
    expect(classes.indexOf('mt-6')).toBeGreaterThan(classes.indexOf('eg-breadcrumb'));
    expect(classes.indexOf('self-start')).toBeGreaterThan(classes.indexOf('eg-breadcrumb'));
    // No part receives the consumer class: the list, the steps, the links, the text and the separators stay as authored.
    for (const part of container.querySelectorAll('nav *')) {
      expect(part.classList.contains('mt-6')).toBe(false);
      expect(part.classList.contains('self-start')).toBe(false);
    }
  });

  it('keeps the stable marker when a consumer class conflicts with a root utility (BC-09)', () => {
    render(<Breadcrumb label='Breadcrumb' items={trail} className='min-w-4' />);
    // twMerge settles recognized conflicts, but the public marker is never merged away.
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveClass('eg-breadcrumb');
  });

  it('forwards compatible attributes to the root (BC-09)', () => {
    render(
      <Breadcrumb
        label='Breadcrumb'
        items={trail}
        id='trail'
        lang='es'
        dir='rtl'
        title='Where you are'
        aria-describedby='hint'
        data-section='posts'
      />
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveAttribute('id', 'trail');
    expect(nav).toHaveAttribute('lang', 'es');
    expect(nav).toHaveAttribute('dir', 'rtl');
    expect(nav).toHaveAttribute('title', 'Where you are');
    expect(nav).toHaveAttribute('aria-describedby', 'hint');
    expect(nav).toHaveAttribute('data-section', 'posts');
  });

  it('drops the protected attributes, content and refs at untyped boundaries (BC-09)', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Breadcrumb
        {...untyped({
          label: 'Breadcrumb',
          items: trail,
          role: 'presentation',
          'aria-label': 'injected',
          'aria-labelledby': 'other',
          children: 'injected',
          dangerouslySetInnerHTML: { __html: '<b>injected</b>' },
          ref,
          id: 'kept'
        })}
      />
    );
    // The landmark keeps its role and its name from label, whatever an untyped caller supplies.
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).not.toHaveAttribute('role');
    expect(nav).not.toHaveAttribute('aria-labelledby');
    expect(nav).toHaveAttribute('id', 'kept');
    expect(nav.textContent).toBe('HomeEditorialPost title');
    expect(container.querySelector('b')).toBeNull();
    expect(ref.current).toBeNull();
  });

  it('strips the protected keys from the hook root props and keeps the rest (BC-09)', () => {
    const { result } = renderHook(() =>
      useBreadcrumb(
        untyped({
          label: 'Breadcrumb',
          items: trail,
          onNavigate: () => undefined,
          role: 'presentation',
          'aria-labelledby': 'other',
          children: 'injected',
          dangerouslySetInnerHTML: { __html: 'injected' },
          ref: createRef(),
          id: 'kept',
          'data-section': 'posts'
        })
      )
    );
    for (const key of [
      'children',
      'role',
      'aria-labelledby',
      'dangerouslySetInnerHTML',
      'ref',
      'items',
      'label',
      'onNavigate'
    ]) {
      expect(result.current.rootProps, key).not.toHaveProperty(key);
    }
    expect(result.current.rootProps).toMatchObject({ id: 'kept', 'data-section': 'posts', 'aria-label': 'Breadcrumb' });
  });

  it('excludes the protected props, a ref and asChild from the public type (BC-09)', () => {
    expectTypeOf<
      Extract<
        keyof BreadcrumbProps,
        'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML' | 'ref' | 'asChild'
      >
    >().toEqualTypeOf<never>();
    expectTypeOf<BreadcrumbProps['label']>().toEqualTypeOf<string>();
    expectTypeOf<BreadcrumbProps['items']>().toEqualTypeOf<BreadcrumbItem[]>();
    // @ts-expect-error The landmark keeps the navigation role: there is no role override.
    const withRole: BreadcrumbProps = { label: 'Breadcrumb', items: [], role: 'presentation' };
    // @ts-expect-error The landmark name is label: there is no aria-label.
    const withAriaLabel: BreadcrumbProps = { label: 'Breadcrumb', items: [], 'aria-label': 'x' };
    // @ts-expect-error The landmark name is label: there is no aria-labelledby.
    const withLabelledBy: BreadcrumbProps = { label: 'Breadcrumb', items: [], 'aria-labelledby': 'x' };
    // @ts-expect-error The trail is data: there are no children.
    const withChildren: BreadcrumbProps = { label: 'Breadcrumb', items: [], children: 'x' };
    // @ts-expect-error Raw HTML is protected.
    const withHtml: BreadcrumbProps = { label: 'Breadcrumb', items: [], dangerouslySetInnerHTML: { __html: 'x' } };
    // @ts-expect-error There is no root ref in this API.
    const withRef: BreadcrumbProps = { label: 'Breadcrumb', items: [], ref: null };
    // @ts-expect-error There is no Slot composition.
    const withAsChild: BreadcrumbProps = { label: 'Breadcrumb', items: [], asChild: true };
    // @ts-expect-error The label is required.
    const withoutLabel: BreadcrumbProps = { items: [] };
    // @ts-expect-error The items are required.
    const withoutItems: BreadcrumbProps = { label: 'Breadcrumb' };
    // @ts-expect-error An entry label is a string.
    const numericLabel: BreadcrumbProps = { label: 'Breadcrumb', items: [{ label: 1 }] };
    // @ts-expect-error An entry has no component or icon field.
    const extraField: BreadcrumbProps = { label: 'Breadcrumb', items: [{ label: 'x', icon: 'home' }] };
    expect([
      withRole,
      withAriaLabel,
      withLabelledBy,
      withChildren,
      withHtml,
      withRef,
      withAsChild,
      withoutLabel,
      withoutItems,
      numericLabel,
      extraField
    ]).toHaveLength(11);
  });
});

describe('Breadcrumb keyboard order', () => {
  it('visits the ancestor links in order with Tab and back with Shift+Tab, skipping the current page and the separators (BC-08)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Breadcrumb label='Breadcrumb' items={trail} />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Editorial' })).toHaveFocus();
    // The current page and the separators are not tab stops: the next stop leaves the landmark.
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: 'Editorial' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  });

  it('adds no tabindex, no role and no key handler: only the native anchors are focusable (BC-08)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);
    expect(container.querySelectorAll('[role]')).toHaveLength(0);
    const { result } = renderHook(() => useBreadcrumb({ label: 'Breadcrumb', items: trail }));
    const [first, second, third] = result.current.steps;
    expect(Object.keys(first?.link ?? {})).not.toContain('onKeyDown');
    expect(Object.keys(second?.link ?? {})).not.toContain('onKeyDown');
    expect(Object.keys(third?.current ?? {}).sort()).toEqual(['aria-current', 'className']);
  });
});

describe('Breadcrumb data changes', () => {
  it('follows the data on rerender: the previous last step becomes a link and aria-current moves (BC-10)', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<Breadcrumb label='Breadcrumb' items={[home, { label: 'Editorial' }]} />);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();
    expect(screen.getByText('Editorial')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Editorial' })).toBeNull();
    rerender(<Breadcrumb label='Breadcrumb' items={[home, editorial, post]} />);
    // Appending an entry turns the previous last step into a link and moves the one aria-current to the new last.
    expect(screen.getByRole('link', { name: 'Editorial' })).toHaveAttribute('href', '#editorial');
    expect(screen.getByText('Post title')).toHaveAttribute('aria-current', 'page');
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(container.querySelectorAll('svg')).toHaveLength(2);
    // Focus on a link that survives the update stays where it was: the component moves none.
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();
  });

  it('leaves no stale aria-current, destination or separator when the trail shrinks (BC-10)', () => {
    const { container, rerender } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
    rerender(<Breadcrumb label='Breadcrumb' items={[{ label: 'Home' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
    expect(container.querySelector('[href]')).toBeNull();
  });
});

describe('Breadcrumb recipes', () => {
  it('composes the static utilities of each part (BC-11)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveClass('eg-breadcrumb', 'min-w-0', 'wrap-anywhere');
    expect(screen.getByRole('list')).toHaveClass(
      'm-0',
      'p-0',
      'list-none',
      'flex',
      'flex-wrap',
      'items-center',
      'gap-x-2',
      'gap-y-1'
    );
    for (const step of screen.getAllByRole('listitem')) {
      expect(step).toHaveClass('flex', 'min-h-14', 'min-w-0', 'items-center', 'gap-2');
    }
    for (const link of screen.getAllByRole('link')) {
      // The anchor itself fills the step height: the one Breadcrumb-owned placement class on the Link atom.
      expect(link).toHaveClass('self-stretch');
    }
    expect(screen.getByText('Post title')).toHaveClass('font-sans', 'text-label-default', 'text-fg-default');
    for (const separator of container.querySelectorAll('svg')) {
      expect(separator).toHaveClass('self-center', '-rotate-90', 'text-fg-muted');
    }
  });

  it('sets no inline style and mirrors no state into classes or data attributes (BC-11)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    expect(container.querySelectorAll('[style]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-state]')).toHaveLength(0);
    expect(container.innerHTML).not.toMatch(/\bis-[a-z]/);
  });

  it('puts a class on the six owned parts only: the landmark, list, step, link, text and separator (BC-11)', () => {
    const { container } = render(<Breadcrumb label='Breadcrumb' items={trail} />);
    const classed = [...container.querySelectorAll('[class]')].map((element) => element.tagName.toLowerCase());
    expect(new Set(classed)).toEqual(new Set(['nav', 'ol', 'li', 'a', 'span', 'svg']));
  });

  it('adds no transition, animation, paint, border or shadow utility to any part it owns (BC-11, BC-15)', () => {
    const owned = [
      breadcrumbVariants(),
      breadcrumbListVariants(),
      breadcrumbStepVariants(),
      breadcrumbLinkVariants(),
      breadcrumbCurrentVariants(),
      breadcrumbSeparatorVariants()
    ].flatMap((classes) => classes.split(' '));
    expect(owned.length).toBeGreaterThan(0);
    for (const utility of owned) {
      expect(utility).not.toMatch(
        /^(?:transition|animate|duration|ease|delay|bg|border|shadow|ring|outline|backdrop|filter|rounded|opacity|transform)\b/
      );
    }
  });

  it('keeps the quiet Link recipe untouched: Breadcrumb adds only its placement class to the anchor (BC-15)', () => {
    render(<Breadcrumb label='Breadcrumb' items={trail} />);
    const quiet = linkVariants({ variant: 'quiet' }).split(' ');
    for (const link of screen.getAllByRole('link')) {
      const own = [...link.classList].filter((name) => !quiet.includes(name));
      expect(own).toEqual(['self-stretch']);
    }
  });
});

describe('Breadcrumb rendering targets', () => {
  it('renders the same markup on the server and on the client (BC-16)', () => {
    const element = <Breadcrumb label='Breadcrumb' items={trail} className='mt-6' />;
    const server = renderToStaticMarkup(element);
    const { container } = render(element);
    expect(container.innerHTML).toBe(server);
    expect(server).toContain('eg-breadcrumb');
    expect(server).toContain('aria-current="page"');
    expect(server).toContain('<ol');
  });

  it('renders nothing on the server for an unnamed or empty trail (BC-16)', () => {
    expect(renderToStaticMarkup(<Breadcrumb {...untyped({ label: '  ', items: trail })} />)).toBe('');
    expect(renderToStaticMarkup(<Breadcrumb label='Breadcrumb' items={[]} />)).toBe('');
  });
});
