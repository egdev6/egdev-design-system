import { fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, StrictMode } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Pagination } from './Pagination';
import type { PaginationMessages, PaginationProps } from './types';
import {
  paginationEllipsisVariants,
  paginationIconVariants,
  paginationItemVariants,
  paginationLinkVariants,
  paginationListVariants,
  paginationPlaceholderVariants,
  paginationVariants
} from './types';
import { usePagination } from './usePagination';

const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  // Intentionally silent: development warnings are asserted, not printed.
});

afterEach(() => {
  consoleWarn.mockClear();
  vi.unstubAllEnvs();
});

// Fragment destinations keep jsdom's navigation stub silent when a link is activated.
const getHref = (page: number) => `#page-${page}`;
const base: PaginationProps = { label: 'Editorial pages', value: 6, pageCount: 12, getHref };

// The row as the reader sees it: one entry per list item, ellipses as the single glyph U+2026.
const row = (container: HTMLElement) => [...container.querySelectorAll('li')].map((item) => item.textContent);
// The window slots only: everything between the Previous and Next items.
const slotsOf = (container: HTMLElement) => row(container).slice(1, -1);
const links = () => screen.getAllByRole('link');

// The one documented cast: a JavaScript caller can pass values that the public types reject.
function untyped(props: Record<string, unknown>): PaginationProps {
  return props as unknown as PaginationProps;
}

const labelWarning = 'Pagination requires a non-empty label. Nothing was rendered.';
const valueWarning = 'Pagination requires a finite numeric value. Nothing was rendered.';
const pageCountWarning = 'Pagination requires a finite numeric pageCount. Nothing was rendered.';
const getHrefWarning = 'Pagination requires a getHref function. Nothing was rendered.';
const returnWarning =
  'Pagination requires getHref to return a non-empty string for every rendered page. Nothing was rendered.';

describe('Pagination structure', () => {
  it('renders one named navigation landmark with the stable marker holding one native list (PG-01)', () => {
    const { container } = render(<Pagination {...base} />);
    const nav = screen.getByRole('navigation', { name: 'Editorial pages' });
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(nav);
    expect(nav.tagName).toBe('NAV');
    expect(nav).toHaveClass('eg-pagination');
    expect(nav.children).toHaveLength(1);
    const list = nav.firstElementChild as HTMLElement;
    expect(list.tagName).toBe('UL');
    expect(screen.getAllByRole('list')).toHaveLength(1);
    expect(screen.getByRole('list')).toBe(list);
    for (const item of list.children) {
      expect(item.tagName).toBe('LI');
    }
  });

  it('keeps list semantics explicit on the list and puts no role on the landmark or anywhere else (PG-01)', () => {
    const { container } = render(<Pagination {...base} />);
    const nav = screen.getByRole('navigation', { name: 'Editorial pages' });
    expect(nav).not.toHaveAttribute('role');
    expect(screen.getByRole('list')).toHaveAttribute('role', 'list');
    // The one explicit role of the whole landmark is the list's own.
    expect(container.querySelectorAll('[role]')).toHaveLength(1);
  });

  it('renders no heading, button, live region or alert, and never names the landmark visibly (PG-01)', () => {
    const { container } = render(<Pagination {...base} />);
    for (const role of ['heading', 'button', 'status', 'alert', 'log', 'tablist', 'menu', 'toolbar']) {
      expect(screen.queryByRole(role), role).toBeNull();
    }
    expect(container.querySelectorAll('[aria-live], [aria-atomic], [aria-labelledby]')).toHaveLength(0);
    // The label names the landmark only: it is not visible text.
    expect(container.textContent).not.toContain('Editorial pages');
  });

  it('returns a typed hook model for the component to render (PG-01)', () => {
    const { result } = renderHook(() => usePagination(base));
    expect(Object.keys(result.current)).toEqual(['model']);
    const model = result.current.model;
    expect(model).not.toBeNull();
    expect(Object.keys(model ?? {}).sort()).toEqual(['iconClassName', 'items', 'listProps', 'rootProps']);
    expect(model?.rootProps['aria-label']).toBe('Editorial pages');
    expect(model?.rootProps.className).toContain('eg-pagination');
    expect(model?.listProps.role).toBe('list');
  });
});

describe('Pagination root attributes', () => {
  it('forwards nothing but the name and the marker when only the own props are supplied (PG-01)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: React reports unknown DOM properties through console.error.
    });
    render(<Pagination {...base} onNavigate={() => undefined} messages={{ previous: 'Older' }} />);
    const nav = screen.getByRole('navigation', { name: 'Editorial pages' });
    // value, pageCount, getHref, onNavigate and messages are own props: none of them is a DOM attribute.
    expect(nav.getAttributeNames().sort()).toEqual(['aria-label', 'class']);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

type Slot = number | '…';
// [pageCount, value, the seven slots between Previous and Next, or all pages for a short row]
const windows: [pageCount: number, value: number, slots: Slot[]][] = [
  [7, 1, [1, 2, 3, 4, 5, 6, 7]],
  [7, 4, [1, 2, 3, 4, 5, 6, 7]],
  [7, 7, [1, 2, 3, 4, 5, 6, 7]],
  [8, 4, [1, 2, 3, 4, 5, '…', 8]],
  [8, 5, [1, '…', 4, 5, 6, 7, 8]],
  [9, 5, [1, '…', 4, 5, 6, '…', 9]],
  [12, 1, [1, 2, 3, 4, 5, '…', 12]],
  [12, 4, [1, 2, 3, 4, 5, '…', 12]],
  [12, 5, [1, '…', 4, 5, 6, '…', 12]],
  [12, 8, [1, '…', 7, 8, 9, '…', 12]],
  [12, 9, [1, '…', 8, 9, 10, 11, 12]],
  [12, 12, [1, '…', 8, 9, 10, 11, 12]]
];

describe('Pagination window', () => {
  it.each(windows)('renders the constant-width window of page %s of %s in order (PG-04)', (pageCount, value, slots) => {
    const spy = vi.fn(getHref);
    const { container } = render(<Pagination {...base} pageCount={pageCount} value={value} getHref={spy} />);
    expect(slotsOf(container)).toEqual(slots.map(String));
    // Above seven pages the row is always exactly seven page-or-ellipsis slots wide, so it never jumps.
    if (pageCount > 7) {
      expect(slotsOf(container)).toHaveLength(7);
    }
    // Every ellipsis is hidden from assistive technology, holds nothing focusable and never stands for one page.
    const items = [...container.querySelectorAll('li')].slice(1, -1);
    for (const [index, slot] of slots.entries()) {
      if (slot !== '…') {
        continue;
      }
      expect(items[index]).toHaveAttribute('aria-hidden', 'true');
      expect(items[index]?.querySelector('a, button, [tabindex]')).toBeNull();
      const before = slots[index - 1];
      const after = slots[index + 1];
      expect(typeof before === 'number' && typeof after === 'number' ? after - before - 1 : 0).toBeGreaterThanOrEqual(
        2
      );
    }
    // getHref runs only for the controls that are rendered: the window pages and the Previous and Next targets.
    const rendered = new Set<number>(slots.filter((slot): slot is number => slot !== '…'));
    if (value > 1) {
      rendered.add(value - 1);
    }
    if (value < pageCount) {
      rendered.add(value + 1);
    }
    expect(new Set(spy.mock.calls.map(([page]) => page))).toEqual(rendered);
  });

  it.each([2, 3, 4, 5, 6, 7])(
    'renders every page and no ellipsis for %s pages at every current page (PG-04)',
    (pageCount) => {
      for (let value = 1; value <= pageCount; value += 1) {
        const { container, unmount } = render(<Pagination {...base} pageCount={pageCount} value={value} />);
        expect(slotsOf(container)).toEqual(Array.from({ length: pageCount }, (_, index) => String(index + 1)));
        expect(container.textContent).not.toContain('…');
        unmount();
      }
    }
  );

  it('gives every item a stable key so a rerender that keeps a control keeps its node (PG-04)', () => {
    const { result } = renderHook(() => usePagination(base));
    expect(result.current.model?.items.map((item) => item.key)).toEqual([
      'previous',
      'page-1',
      'start',
      'page-5',
      'page-6',
      'page-7',
      'end',
      'page-12',
      'next'
    ]);
  });
});

describe('Pagination links and the current page', () => {
  it('renders every control as one anchor whose href is getHref of its page, in order (PG-02)', () => {
    render(<Pagination {...base} />);
    expect(
      links().map((link) => [link.getAttribute('aria-label') ?? link.textContent, link.getAttribute('href')])
    ).toEqual([
      ['Previous', '#page-5'],
      ['Page 1', '#page-1'],
      ['Page 5', '#page-5'],
      ['Page 6', '#page-6'],
      ['Page 7', '#page-7'],
      ['Page 12', '#page-12'],
      ['Next', '#page-7']
    ]);
    for (const link of links()) {
      expect(link.tagName).toBe('A');
    }
  });

  it('relies on no click handler and no button role: the links work without JavaScript (PG-02)', () => {
    const { container } = render(<Pagination {...base} />);
    expect(container.querySelectorAll('[role="button"], button')).toHaveLength(0);
    const { result } = renderHook(() => usePagination(base));
    for (const item of result.current.model?.items ?? []) {
      if (item.type === 'link') {
        expect(item.linkProps.onClick, item.key).toBeUndefined();
        expect(item.linkProps.href, item.key).toMatch(/^#page-\d+$/);
      }
    }
  });

  it('puts every href in the server-rendered markup with no JavaScript (PG-02)', () => {
    const markup = renderToString(<Pagination {...base} />);
    for (const page of [1, 5, 6, 7, 12]) {
      expect(markup).toContain(`href="#page-${page}"`);
    }
    expect(markup).toContain('rel="prev"');
    expect(markup).toContain('rel="next"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).not.toContain('onclick');
  });

  it.each([
    [12, 1],
    [12, 6],
    [12, 12],
    [5, 5],
    [2, 1]
  ])(
    'marks exactly one link as the current page, the value page, still an anchor (page %s of %s) (PG-03)',
    (pageCount, value) => {
      const { container } = render(<Pagination {...base} pageCount={pageCount} value={value} />);
      const current = screen.getByRole('link', { name: `Page ${value}` });
      expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
      expect(current).toHaveAttribute('aria-current', 'page');
      expect(current.tagName).toBe('A');
      expect(current).toHaveAttribute('href', `#page-${value}`);
      for (const link of links()) {
        if (link !== current) {
          expect(link).not.toHaveAttribute('aria-current');
        }
      }
    }
  );

  it('shows the plain digits of a page and names the link by its message, which contains them (PG-03)', () => {
    render(<Pagination {...base} />);
    const current = screen.getByRole('link', { name: 'Page 6' });
    expect(current.textContent).toBe('6');
    for (const page of [1, 5, 7, 12]) {
      const link = screen.getByRole('link', { name: `Page ${page}` });
      expect(link.textContent).toBe(String(page));
      expect(link).toHaveAttribute('aria-label', `Page ${page}`);
    }
  });
});

describe('Pagination boundaries', () => {
  it('links Previous to the page before and Next to the page after, with rel and the message texts (PG-05)', () => {
    render(<Pagination {...base} />);
    const previous = screen.getByRole('link', { name: 'Previous' });
    const next = screen.getByRole('link', { name: 'Next' });
    expect(previous).toHaveAttribute('href', '#page-5');
    expect(previous).toHaveAttribute('rel', 'prev');
    expect(previous.textContent).toBe('Previous');
    expect(next).toHaveAttribute('href', '#page-7');
    expect(next).toHaveAttribute('rel', 'next');
    expect(next.textContent).toBe('Next');
    // The arrows are decorative: the text first for Next, the arrow first for Previous.
    expect(previous.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(next.lastElementChild?.tagName.toLowerCase()).toBe('svg');
    for (const arrow of [previous.querySelector('svg'), next.querySelector('svg')]) {
      expect(arrow).toHaveAttribute('aria-hidden', 'true');
    }
    // Page links never carry a rel.
    expect(screen.getByRole('link', { name: 'Page 7' })).not.toHaveAttribute('rel');
  });

  it('keeps Previous as a dimmed hidden placeholder on the first page, without href, tab stop or link role (PG-05)', () => {
    const { container } = render(<Pagination {...base} value={1} />);
    expect(screen.queryByRole('link', { name: 'Previous' })).toBeNull();
    const first = container.querySelector('li');
    expect(first).toHaveAttribute('aria-hidden', 'true');
    expect(first?.textContent).toBe('Previous');
    expect(first?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    const placeholder = first?.firstElementChild as HTMLElement;
    expect(placeholder.tagName).toBe('SPAN');
    expect(placeholder).toHaveAttribute('data-disabled');
    for (const attribute of ['href', 'tabindex', 'role', 'rel']) {
      expect(placeholder, attribute).not.toHaveAttribute(attribute);
    }
    expect(first?.querySelector('a')).toBeNull();
    // Next stays a link on the first page.
    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '#page-2');
  });

  it('keeps Next as a dimmed hidden placeholder on the last page, with the arrow after the text (PG-05)', () => {
    const { container } = render(<Pagination {...base} value={12} />);
    expect(screen.queryByRole('link', { name: 'Next' })).toBeNull();
    const last = [...container.querySelectorAll('li')].at(-1);
    expect(last).toHaveAttribute('aria-hidden', 'true');
    expect(last?.textContent).toBe('Next');
    const placeholder = last?.firstElementChild as HTMLElement;
    expect(placeholder.tagName).toBe('SPAN');
    expect(placeholder).toHaveAttribute('data-disabled');
    expect(placeholder.lastElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(screen.getByRole('link', { name: 'Previous' })).toHaveAttribute('href', '#page-11');
    // A short row keeps both placeholders when it has a single boundary page on each side.
    const short = render(<Pagination {...base} pageCount={2} value={1} />);
    expect(short.container.querySelectorAll('[data-disabled]')).toHaveLength(1);
  });

  it('makes the Previous and Next placeholders the only data-disabled elements and never calls getHref for them (PG-05)', () => {
    const spy = vi.fn(getHref);
    const { container } = render(<Pagination {...base} pageCount={5} value={5} getHref={spy} />);
    expect(container.querySelectorAll('[data-disabled]')).toHaveLength(1);
    expect(container.querySelector('li:last-child [data-disabled]')).not.toBeNull();
    expect(new Set(spy.mock.calls.map(([page]) => page))).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it('visits Previous, the page links and Next in DOM order and skips placeholders and ellipses (PG-05)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Pagination {...base} value={1} />
        <button type='button'>After</button>
      </>
    );
    const names: (string | null)[] = [];
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    for (let step = 0; step < 7; step += 1) {
      await user.tab();
      names.push(document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent ?? null);
    }
    // Page 1 is the current page and a tab stop; the Previous placeholder and the ellipsis are not.
    expect(names).toEqual(['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 12', 'Next']);
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });
});

describe('Pagination normalization', () => {
  it.each([
    [3.9, 3],
    [1.2, 1],
    [12.9, 12],
    [0, 1],
    [-0, 1],
    [-5, 1],
    [-0.5, 1],
    [99, 12],
    [12.0001, 12]
  ])('floors and clamps a current page of %s to %s without warning or throwing (PG-06)', (value, current) => {
    const { container } = render(<Pagination {...base} value={value} />);
    const marked = container.querySelector('[aria-current="page"]');
    expect(marked).toHaveAttribute('href', `#page-${current}`);
    expect(marked?.textContent).toBe(String(current));
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('floors a page count and only ever asks getHref for integers inside the row (PG-06)', () => {
    const spy = vi.fn(getHref);
    const { container } = render(<Pagination {...base} pageCount={12.9} value={12} getHref={spy} />);
    expect(slotsOf(container)).toEqual(['1', '…', '8', '9', '10', '11', '12']);
    const asked = spy.mock.calls.map(([page]) => page);
    expect(asked.every((page) => Number.isInteger(page))).toBe(true);
    expect(new Set(asked)).toEqual(new Set([1, 8, 9, 10, 11, 12]));
    // The floored count makes page 12 the last one: Next is a placeholder and there is no page 13.
    expect(screen.queryByRole('link', { name: 'Next' })).toBeNull();
    expect(container.querySelector('li:last-child [data-disabled]')).not.toBeNull();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([1.9, 1, 0, 0.5, -0, -3, -1.5])(
    'renders nothing and warns nothing for a page count of %s (PG-06)',
    (pageCount) => {
      const { container } = render(<Pagination {...base} pageCount={pageCount} value={1} />);
      expect(container).toBeEmptyDOMElement();
      expect(screen.queryByRole('navigation')).toBeNull();
      expect(consoleWarn).not.toHaveBeenCalled();
      expect(renderHook(() => usePagination({ ...base, pageCount, value: 1 })).result.current).toEqual({ model: null });
    }
  );

  it('renders the smallest paginated row for two pages (PG-06)', () => {
    const { container } = render(<Pagination {...base} pageCount={2.9} value={2} />);
    expect(slotsOf(container)).toEqual(['1', '2']);
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('Pagination input validation', () => {
  it.each([
    ['empty', ''],
    ['whitespace-only', '   '],
    ['undefined', undefined],
    ['null', null],
    ['a number', 42],
    ['an object', { text: 'not a string' }]
  ])('warns once and renders nothing when the label is %s (PG-07)', (_name, label) => {
    const { container } = render(<Pagination {...untyped({ ...base, label })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[labelWarning]]);
  });

  it.each([
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
    ['a numeric string', '3'],
    ['undefined', undefined],
    ['null', null]
  ])('warns once and renders nothing when the current page is %s (PG-07)', (_name, value) => {
    const { container } = render(<Pagination {...untyped({ ...base, value })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[valueWarning]]);
  });

  it.each([
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
    ['a numeric string', '12'],
    ['undefined', undefined],
    ['null', null]
  ])('warns once and renders nothing when the page count is %s (PG-07)', (_name, pageCount) => {
    const { container } = render(<Pagination {...untyped({ ...base, pageCount })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[pageCountWarning]]);
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['a string', '#page-1'],
    ['a number', 1]
  ])('warns once and renders nothing when getHref is %s, not a function (PG-07)', (_name, value) => {
    const { container } = render(<Pagination {...untyped({ ...base, getHref: value })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[getHrefWarning]]);
  });

  it.each([
    ['an empty string', () => ''],
    ['a whitespace-only string', () => '   '],
    ['a number', () => 7],
    ['undefined', () => undefined],
    ['null', () => null],
    ['an object', () => ({ href: '#x' })]
  ])('warns once and renders nothing when getHref returns %s for a rendered page (PG-07)', (_name, returned) => {
    const { container } = render(<Pagination {...untyped({ ...base, getHref: returned })} />);
    expect(container).toBeEmptyDOMElement();
    // One invalid return voids the whole render, however many controls are invalid: a single warning.
    expect(consoleWarn.mock.calls).toEqual([[returnWarning]]);
  });

  it('voids the render for one invalid return, and not for a page that is not rendered (PG-07)', () => {
    const only = (bad: number) => (page: number) => (page === bad ? '' : `#page-${page}`);
    // Page 12 is rendered at page 6 of 12: its blank destination voids the row.
    const voided = render(<Pagination {...untyped({ ...base, getHref: only(12) })} />);
    expect(voided.container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[returnWarning]]);
    consoleWarn.mockClear();
    // Page 3 sits behind an ellipsis: getHref is never asked for it, so its blank destination is never seen.
    const hidden = render(<Pagination {...untyped({ ...base, getHref: only(3) })} />);
    expect(slotsOf(hidden.container)).toEqual(['1', '…', '5', '6', '7', '…', '12']);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('warns for each invalid input on its own, in the order label, value, page count, getHref (PG-07)', () => {
    const { container } = render(
      <Pagination {...untyped({ label: ' ', value: Number.NaN, pageCount: Number.NaN, getHref: undefined })} />
    );
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[labelWarning], [valueWarning], [pageCountWarning], [getHrefWarning]]);
  });

  it('keeps the quiet no-op for a short count only when every other input is valid (PG-07)', () => {
    const quiet = render(<Pagination {...base} pageCount={1} />);
    expect(quiet.container).toBeEmptyDOMElement();
    expect(consoleWarn).not.toHaveBeenCalled();
    // A blank label or a missing getHref still warns when there is nothing to paginate.
    const blank = render(<Pagination {...untyped({ ...base, label: '', pageCount: 1 })} />);
    expect(blank.container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[labelWarning]]);
    consoleWarn.mockClear();
    render(<Pagination {...untyped({ ...base, getHref: undefined, pageCount: 0 })} />);
    expect(consoleWarn.mock.calls).toEqual([[getHrefWarning]]);
  });

  it('renders on a later valid rerender and empties again on an invalid one (PG-07)', () => {
    const { container, rerender } = render(<Pagination {...untyped({ ...base, value: Number.NaN })} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Pagination {...base} />);
    expect(screen.getByRole('navigation', { name: 'Editorial pages' })).toBeInTheDocument();
    expect(links()).toHaveLength(7);
    rerender(<Pagination {...untyped({ ...base, label: '' })} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('warns during render only, so a StrictMode double render repeats the same exact message (PG-07)', () => {
    render(
      <StrictMode>
        <Pagination {...untyped({ ...base, pageCount: Number.POSITIVE_INFINITY })} />
      </StrictMode>
    );
    expect(new Set(consoleWarn.mock.calls.map(([message]) => message))).toEqual(new Set([pageCountWarning]));
  });

  it('is silent in production and still renders nothing for invalid input (PG-07)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<Pagination {...untyped({ ...base, label: '', getHref: undefined })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('reports an empty model from the hook for every invalid input (PG-07)', () => {
    for (const invalid of [{ label: '' }, { value: Number.NaN }, { pageCount: '3' }, { getHref: null }]) {
      expect(renderHook(() => usePagination(untyped({ ...base, ...invalid }))).result.current).toEqual({ model: null });
    }
  });
});

describe('Pagination navigation callback', () => {
  it('calls onNavigate once with the target page and the React click event, before the default action (PG-08)', async () => {
    const user = userEvent.setup();
    const hashes: string[] = [];
    const onNavigate = vi.fn<NonNullable<PaginationProps['onNavigate']>>(() => {
      hashes.push(window.location.hash);
    });
    render(<Pagination {...base} onNavigate={onNavigate} />);
    await user.click(screen.getByRole('link', { name: 'Page 7' }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(7, expect.objectContaining({ type: 'click' }));
    expect(onNavigate.mock.calls[0]?.[1].nativeEvent).toBeInstanceOf(MouseEvent);
    // At the time of the call nothing has navigated yet; the native navigation then proceeds on its own.
    expect(hashes).toEqual(['']);
    expect(window.location.hash).toBe('#page-7');
    window.location.hash = '';
  });

  it('reports the page each link leads to: Previous, a page, the current page and Next (PG-08)', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn<NonNullable<PaginationProps['onNavigate']>>();
    render(<Pagination {...base} onNavigate={onNavigate} />);
    for (const name of ['Previous', 'Page 1', 'Page 6', 'Page 12', 'Next']) {
      await user.click(screen.getByRole('link', { name }));
    }
    expect(onNavigate.mock.calls.map(([page]) => page)).toEqual([5, 1, 6, 12, 7]);
    window.location.hash = '';
  });

  it('never prevents default itself, and preventDefault inside the callback cancels the navigation (PG-08)', async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];
    const { rerender } = render(
      <Pagination
        {...base}
        onNavigate={(_page, event) => {
          seen.push(event.defaultPrevented);
        }}
      />
    );
    await user.click(screen.getByRole('link', { name: 'Page 7' }));
    expect(seen).toEqual([false]);
    expect(window.location.hash).toBe('#page-7');
    window.location.hash = '';
    rerender(
      <Pagination
        {...base}
        onNavigate={(_page, event) => {
          event.preventDefault();
        }}
      />
    );
    await user.click(screen.getByRole('link', { name: 'Page 5' }));
    expect(window.location.hash).toBe('');
  });

  it('leaves modified clicks native and reaches onNavigate for them, which a consumer ignores (PG-08)', () => {
    const onNavigate = vi.fn<NonNullable<PaginationProps['onNavigate']>>();
    render(<Pagination {...base} onNavigate={onNavigate} />);
    const link = screen.getByRole('link', { name: 'Page 7' });
    for (const modifier of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }]) {
      // fireEvent returns false when the event was cancelled: the component cancels none of them.
      expect(fireEvent.click(link, modifier)).toBe(true);
    }
    expect(onNavigate).toHaveBeenCalledTimes(3);
    for (const [page, event] of onNavigate.mock.calls) {
      expect(page).toBe(7);
      expect(event.defaultPrevented).toBe(false);
    }
    window.location.hash = '';
  });

  it('does not report a middle click, which the browser raises as auxclick, not click (PG-08)', () => {
    const onNavigate = vi.fn<NonNullable<PaginationProps['onNavigate']>>();
    render(<Pagination {...base} onNavigate={onNavigate} />);
    fireEvent(screen.getByRole('link', { name: 'Page 7' }), new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('is called for Enter on a focused link and never for a placeholder, an ellipsis or a prop update (PG-08)', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn<NonNullable<PaginationProps['onNavigate']>>((_page, event) => {
      event.preventDefault();
    });
    const { container, rerender } = render(<Pagination {...base} value={1} onNavigate={onNavigate} />);
    screen.getByRole('link', { name: 'Page 3' }).focus();
    await user.keyboard('{Enter}');
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenLastCalledWith(3, expect.objectContaining({ type: 'click' }));
    onNavigate.mockClear();
    // The Previous placeholder, the ellipsis and the landmark itself are not links.
    await user.click(container.querySelector('[data-disabled]') as Element);
    await user.click(screen.getByText('…'));
    await user.click(screen.getByRole('navigation', { name: 'Editorial pages' }));
    rerender(<Pagination {...base} value={2} onNavigate={onNavigate} />);
    rerender(<Pagination {...base} value={2} pageCount={20} onNavigate={onNavigate} />);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('treats a non-function onNavigate as absent and keeps the click native (PG-08)', async () => {
    const user = userEvent.setup();
    render(<Pagination {...untyped({ ...base, onNavigate: 'go' })} />);
    await user.click(screen.getByRole('link', { name: 'Page 7' }));
    expect(window.location.hash).toBe('#page-7');
    window.location.hash = '';
  });
});

describe('Pagination messages', () => {
  it('uses the English defaults Previous, Next and Page n (PG-09)', () => {
    render(<Pagination {...base} />);
    expect(screen.getByRole('link', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 6' })).toBeInTheDocument();
  });

  it('applies a complete dictionary to every link name and keeps the visible digits (PG-09)', () => {
    render(
      <Pagination {...base} messages={{ previous: 'Newer', next: 'Older', page: (page) => `Results page ${page}` }} />
    );
    expect(screen.getByRole('link', { name: 'Newer' })).toHaveAttribute('href', '#page-5');
    expect(screen.getByRole('link', { name: 'Older' })).toHaveAttribute('href', '#page-7');
    const current = screen.getByRole('link', { name: 'Results page 6' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.textContent).toBe('6');
    for (const page of [1, 5, 7, 12]) {
      const link = screen.getByRole('link', { name: `Results page ${page}` });
      expect(link.textContent).toBe(String(page));
      // Label in Name: the accessible name contains the visible digits.
      expect(link.getAttribute('aria-label')).toContain(link.textContent);
    }
    expect(screen.queryByRole('link', { name: 'Previous' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Page 6' })).toBeNull();
  });

  it('falls back independently for each omitted entry (PG-09)', () => {
    render(<Pagination {...base} messages={{ next: 'Older' }} />);
    expect(screen.getByRole('link', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Older' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 6' })).toBeInTheDocument();
  });

  it('falls back independently for each blank or non-string entry (PG-09)', () => {
    render(<Pagination {...untyped({ ...base, messages: { previous: '', next: '   ', page: 'Page' } })} />);
    expect(screen.getByRole('link', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 6' })).toBeInTheDocument();
    const mixed = render(
      <Pagination {...untyped({ ...base, label: 'Mixed', messages: { previous: 42, next: null, page: undefined } })} />
    );
    expect(within(mixed.container).getByRole('link', { name: 'Previous' })).toBeInTheDocument();
    expect(within(mixed.container).getByRole('link', { name: 'Next' })).toBeInTheDocument();
    expect(within(mixed.container).getByRole('link', { name: 'Page 6' })).toBeInTheDocument();
  });

  it.each([
    [
      'throws',
      () => {
        throw new Error('formatter failure');
      }
    ],
    ['returns an empty string', () => ''],
    ['returns whitespace', () => '   '],
    ['returns a number', () => 6],
    ['returns undefined', () => undefined]
  ])('falls back to the English page name for each link when the page formatter %s (PG-09)', (_name, page) => {
    const { container } = render(<Pagination {...untyped({ ...base, messages: { page } })} />);
    for (const number of [1, 5, 6, 7, 12]) {
      expect(screen.getByRole('link', { name: `Page ${number}` })).toBeInTheDocument();
    }
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('falls back for the one link whose formatter result is unusable and keeps the others (PG-09)', () => {
    render(<Pagination {...base} messages={{ page: (page) => (page === 7 ? '' : `Results page ${page}`) }} />);
    expect(screen.getByRole('link', { name: 'Page 7' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Results page 6' })).toBeInTheDocument();
  });

  it.each([
    ['null', null],
    ['a string', 'messages'],
    ['a number', 7],
    ['a function', () => 'Previous'],
    ['an array', ['Previous']]
  ])('treats messages as absent when it is %s (PG-09)', (_name, messages) => {
    render(<Pagination {...untyped({ ...base, messages })} />);
    expect(screen.getByRole('link', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 6' })).toBeInTheDocument();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('never replaces or locale-formats the visible digits, whatever the formatter does (PG-09)', () => {
    const localized = (page: number) => `Page ${page.toLocaleString('ar-EG')}`;
    render(<Pagination {...base} pageCount={1200} value={1000} messages={{ page: localized }} />);
    const current = screen.getByRole('link', { name: localized(1000) });
    expect(current.textContent).toBe('1000');
    expect(screen.getByRole('link', { name: localized(1200) }).textContent).toBe('1200');
  });

  it('asks the formatter for integers only and uses the supplied step text unchanged (PG-09)', () => {
    const page = vi.fn((number: number) => `Results page ${number}`);
    render(<Pagination {...base} messages={{ previous: ' Newer ', page }} />);
    expect(new Set(page.mock.calls.map(([number]) => number))).toEqual(new Set([1, 5, 6, 7, 12]));
    expect(page.mock.calls.every(([number]) => Number.isInteger(number))).toBe(true);
    expect(screen.getByRole('link', { name: 'Newer' }).textContent).toBe(' Newer ');
  });

  it('follows a changed dictionary on rerender with no stale name (PG-09)', () => {
    const { rerender } = render(<Pagination {...base} />);
    expect(screen.getByRole('link', { name: 'Next' })).toBeInTheDocument();
    rerender(<Pagination {...base} messages={{ next: 'Older' }} />);
    expect(screen.queryByRole('link', { name: 'Next' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Older' })).toBeInTheDocument();
    rerender(<Pagination {...base} />);
    expect(screen.getByRole('link', { name: 'Next' })).toBeInTheDocument();
  });
});

describe('Pagination keyboard', () => {
  it('visits Previous, the page links and Next in DOM order with Tab and back with Shift+Tab (PG-10)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Pagination {...base} />
        <button type='button'>After</button>
      </>
    );
    const name = () => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent;
    await user.tab();
    const forward: (string | null | undefined)[] = [];
    for (let step = 0; step < 7; step += 1) {
      await user.tab();
      forward.push(name());
    }
    expect(forward).toEqual(['Previous', 'Page 1', 'Page 5', 'Page 6', 'Page 7', 'Page 12', 'Next']);
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    const backward: (string | null | undefined)[] = [];
    for (let step = 0; step < 7; step += 1) {
      await user.tab({ shift: true });
      backward.push(name());
    }
    expect(backward).toEqual(['Next', 'Page 12', 'Page 7', 'Page 6', 'Page 5', 'Page 1', 'Previous']);
  });

  it('activates a focused link with Enter and adds no roving tabindex or key handler (PG-10)', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn<NonNullable<PaginationProps['onNavigate']>>((_page, event) => {
      event.preventDefault();
    });
    const { container } = render(<Pagination {...base} onNavigate={onNavigate} />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Page 1' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(1, expect.objectContaining({ type: 'click' }));
    // Only native anchors are focusable: no tabindex anywhere and no key handler on any control.
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);
    const { result } = renderHook(() => usePagination({ ...base, onNavigate }));
    for (const item of result.current.model?.items ?? []) {
      const props = item.type === 'link' ? item.linkProps : {};
      for (const handler of ['onKeyDown', 'onKeyUp', 'onKeyPress', 'onFocus', 'onBlur']) {
        expect(Object.keys(props), `${item.key} ${handler}`).not.toContain(handler);
      }
    }
  });

  it('keeps placeholders and ellipses out of the tab order on the last page too (PG-10)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Pagination {...base} value={12} />
        <button type='button'>After</button>
      </>
    );
    const stops: (string | null | undefined)[] = [];
    for (let step = 0; step < 6; step += 1) {
      await user.tab();
      stops.push(document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent);
    }
    expect(stops).toEqual(['Previous', 'Page 1', 'Page 8', 'Page 9', 'Page 10', 'Page 11']);
    await user.tab();
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Page 12');
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('does not move focus when the props change: a link that survives keeps its node and its focus (PG-10)', () => {
    const { rerender } = render(<Pagination {...base} />);
    const seven = screen.getByRole('link', { name: 'Page 7' });
    seven.focus();
    expect(seven).toHaveFocus();
    rerender(<Pagination {...base} value={7} />);
    expect(screen.getByRole('link', { name: 'Page 7' })).toBe(seven);
    expect(seven).toHaveFocus();
    expect(seven).toHaveAttribute('aria-current', 'page');
    rerender(<Pagination {...base} value={8} messages={{ page: (page) => `Results page ${page}` }} />);
    expect(screen.getByRole('link', { name: 'Results page 7' })).toBe(seven);
    expect(seven).toHaveFocus();
    expect(seven).not.toHaveAttribute('aria-current');
  });
});

describe('Pagination root props', () => {
  it('merges className last on the root only and keeps the stable marker (PG-11)', () => {
    const { container } = render(<Pagination {...base} className='mt-6 self-start' />);
    const nav = screen.getByRole('navigation', { name: 'Editorial pages' });
    const classes = nav.className.split(' ');
    expect(classes).toContain('eg-pagination');
    expect(classes).toContain('mt-6');
    expect(classes).toContain('self-start');
    expect(classes.indexOf('mt-6')).toBeGreaterThan(classes.indexOf('eg-pagination'));
    expect(classes.indexOf('self-start')).toBeGreaterThan(classes.indexOf('eg-pagination'));
    // No part receives the consumer class: the list, the items, the links, the placeholders and the arrows.
    for (const part of container.querySelectorAll('nav *')) {
      expect(part.classList.contains('mt-6')).toBe(false);
      expect(part.classList.contains('self-start')).toBe(false);
    }
  });

  it('keeps the stable marker when a consumer class conflicts with a root utility (PG-11)', () => {
    render(<Pagination {...base} className='eg-pagination-x mt-0 min-w-4' />);
    expect(screen.getByRole('navigation', { name: 'Editorial pages' })).toHaveClass('eg-pagination');
  });

  it('forwards the compatible native attributes to the root (PG-11)', () => {
    render(
      <Pagination
        {...base}
        id='pager'
        lang='es'
        dir='rtl'
        title='Pages'
        aria-describedby='hint'
        data-section='posts'
        style={{ marginInline: 'auto' }}
      />
    );
    const nav = screen.getByRole('navigation', { name: 'Editorial pages' });
    expect(nav).toHaveAttribute('id', 'pager');
    expect(nav).toHaveAttribute('lang', 'es');
    expect(nav).toHaveAttribute('dir', 'rtl');
    expect(nav).toHaveAttribute('title', 'Pages');
    expect(nav).toHaveAttribute('aria-describedby', 'hint');
    expect(nav).toHaveAttribute('data-section', 'posts');
    // style is a native attribute the spec leaves unprotected; the component sets none of its own.
    expect(nav).toHaveStyle({ marginInline: 'auto' });
  });

  it('drops the protected attributes, content, a ref and asChild at untyped boundaries (PG-11)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: React reports an unknown DOM property through console.error.
    });
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Pagination
        {...untyped({
          ...base,
          role: 'presentation',
          'aria-label': 'injected',
          'aria-labelledby': 'other',
          children: 'injected',
          dangerouslySetInnerHTML: { __html: '<b>injected</b>' },
          ref,
          asChild: true,
          id: 'kept'
        })}
      />
    );
    // The landmark keeps its role and its name from label, whatever an untyped caller supplies.
    const nav = screen.getByRole('navigation', { name: 'Editorial pages' });
    expect(nav).not.toHaveAttribute('role');
    expect(nav).not.toHaveAttribute('aria-labelledby');
    expect(nav).not.toHaveAttribute('aschild');
    expect(nav).toHaveAttribute('id', 'kept');
    expect(container.textContent).not.toContain('injected');
    expect(container.querySelector('b')).toBeNull();
    expect(nav.children).toHaveLength(1);
    expect(ref.current).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('strips the protected and own keys from the hook root props and keeps the rest (PG-11)', () => {
    const { result } = renderHook(() =>
      usePagination(
        untyped({
          ...base,
          onNavigate: () => undefined,
          messages: { next: 'Older' },
          role: 'presentation',
          'aria-labelledby': 'other',
          children: 'injected',
          dangerouslySetInnerHTML: { __html: 'injected' },
          ref: createRef(),
          asChild: true,
          id: 'kept',
          'data-section': 'posts'
        })
      )
    );
    const rootProps = result.current.model?.rootProps ?? {};
    for (const key of [
      'children',
      'role',
      'aria-labelledby',
      'dangerouslySetInnerHTML',
      'ref',
      'asChild',
      'label',
      'value',
      'pageCount',
      'getHref',
      'onNavigate',
      'messages'
    ]) {
      expect(rootProps, key).not.toHaveProperty(key);
    }
    expect(rootProps).toMatchObject({ id: 'kept', 'data-section': 'posts', 'aria-label': 'Editorial pages' });
  });

  it('excludes the protected props, a ref and asChild from the public type, and requires the four own props (PG-11)', () => {
    expectTypeOf<
      Extract<keyof PaginationProps, 'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'ref' | 'asChild'>
    >().toEqualTypeOf<never>();
    expectTypeOf<PaginationProps['label']>().toEqualTypeOf<string>();
    expectTypeOf<PaginationProps['value']>().toEqualTypeOf<number>();
    expectTypeOf<PaginationProps['pageCount']>().toEqualTypeOf<number>();
    expectTypeOf<PaginationProps['getHref']>().toEqualTypeOf<(page: number) => string>();
    expectTypeOf<PaginationProps['messages']>().toEqualTypeOf<Partial<PaginationMessages> | undefined>();
    expectTypeOf<PaginationMessages['page']>().toEqualTypeOf<(page: number) => string>();
    // @ts-expect-error The landmark keeps the navigation role: there is no role override.
    const withRole: PaginationProps = { ...base, role: 'presentation' };
    // @ts-expect-error The landmark name is label: there is no aria-label.
    const withAriaLabel: PaginationProps = { ...base, 'aria-label': 'x' };
    // @ts-expect-error The landmark name is label: there is no aria-labelledby.
    const withLabelledBy: PaginationProps = { ...base, 'aria-labelledby': 'x' };
    // @ts-expect-error The row is derived: there are no children.
    const withChildren: PaginationProps = { ...base, children: 'x' };
    // @ts-expect-error There is no root ref in this API.
    const withRef: PaginationProps = { ...base, ref: null };
    // @ts-expect-error There is no Slot composition.
    const withAsChild: PaginationProps = { ...base, asChild: true };
    // @ts-expect-error The label is required.
    const withoutLabel: PaginationProps = { value: 1, pageCount: 2, getHref };
    // @ts-expect-error The current page is required.
    const withoutValue: PaginationProps = { label: 'x', pageCount: 2, getHref };
    // @ts-expect-error The page count is required.
    const withoutCount: PaginationProps = { label: 'x', value: 1, getHref };
    // @ts-expect-error The destination builder is required.
    const withoutHref: PaginationProps = { label: 'x', value: 1, pageCount: 2 };
    // @ts-expect-error The current page is a number, not text.
    const stringValue: PaginationProps = { ...base, value: '1' };
    // @ts-expect-error A destination is a string.
    const numericHref: PaginationProps = { ...base, getHref: (page: number) => page };
    // @ts-expect-error A navigation callback receives the page number, not an entry object.
    const entryCallback: PaginationProps = { ...base, onNavigate: (item: { href: string }) => item.href };
    // @ts-expect-error The page formatter returns text.
    const numericMessage: PaginationProps = { ...base, messages: { page: (page: number) => page } };
    expect([
      withRole,
      withAriaLabel,
      withLabelledBy,
      withChildren,
      withRef,
      withAsChild,
      withoutLabel,
      withoutValue,
      withoutCount,
      withoutHref,
      stringValue,
      numericHref,
      entryCallback,
      numericMessage
    ]).toHaveLength(14);
  });
});

describe('Pagination recipes', () => {
  it('composes the static utilities of each part (PG-12)', () => {
    const { container } = render(<Pagination {...base} />);
    expect(screen.getByRole('navigation', { name: 'Editorial pages' })).toHaveClass('eg-pagination');
    expect(screen.getByRole('list')).toHaveClass(
      'm-0',
      'p-0',
      'list-none',
      'flex',
      'flex-wrap',
      'items-center',
      'justify-center',
      'gap-1'
    );
    const geometry = [
      'box-border',
      'inline-flex',
      'min-h-10',
      'min-w-10',
      'items-center',
      'justify-center',
      'gap-2',
      'rounded-md',
      'border',
      'border-solid',
      'border-transparent',
      'px-2',
      'pointer-coarse:min-h-14',
      'pointer-coarse:min-w-14',
      'font-display',
      'text-meta'
    ];
    for (const link of links()) {
      // The ghost rest: the tonal link states, transitions that motion-reduce removes, and no underline.
      expect(link).toHaveClass(
        ...geometry,
        'text-fg-secondary',
        'no-underline',
        'transition-colors',
        'duration-(--duration-fast)',
        'ease-(--ease-out)',
        'motion-reduce:transition-none',
        'hover:bg-surface-2',
        'hover:text-fg-default'
      );
    }
    // Digits are tabular and the Previous and Next texts are uppercase, by CSS only.
    for (const link of links()) {
      const step = link.hasAttribute('rel');
      expect(link.classList.contains('uppercase')).toBe(step);
      expect(link.classList.contains('tabular-nums')).toBe(!step);
    }
    const ellipses = screen.getAllByText('…', { selector: 'span' });
    expect(ellipses).toHaveLength(2);
    for (const ellipsis of ellipses) {
      expect(ellipsis).toHaveClass(...geometry, 'text-fg-muted');
    }
    expect([...container.querySelectorAll('svg')].every((arrow) => arrow.classList.contains('rtl:rotate-180'))).toBe(
      true
    );
  });

  it('puts the current-page treatment behind aria-current variants and mirrors no state into classes (PG-12)', () => {
    render(<Pagination {...base} />);
    const classes = (link: HTMLElement) => link.className.split(' ');
    const current = screen.getByRole('link', { name: 'Page 6' });
    expect(current).toHaveClass(
      'aria-[current=page]:border-state-selected',
      'aria-[current=page]:[background:var(--gradient-chip-active),var(--color-surface-1)]',
      'aria-[current=page]:shadow-[var(--shadow-edge-strong)]',
      'aria-[current=page]:text-fg-default'
    );
    // Each treatment utility of R1 lives behind the aria variant: nothing unscoped paints the current page.
    for (const name of classes(current)) {
      if (/border-state-selected|gradient-chip-active|shadow-edge-strong/.test(name)) {
        expect(name.startsWith('aria-[current=page]:'), name).toBe(true);
      }
    }
    // The state is native: every numbered link carries the very same class attribute, current or not.
    const pages = ['Page 1', 'Page 5', 'Page 6', 'Page 7', 'Page 12'].map((name) => screen.getByRole('link', { name }));
    expect(new Set(pages.map((link) => link.className)).size).toBe(1);
    expect(document.body.innerHTML).not.toMatch(/\bis-[a-z]/);
  });

  it('lets the focus ring beat the current-page shadow and gives focus and the current page a forced-colours outline (PG-12)', () => {
    render(<Pagination {...base} />);
    const link = screen.getByRole('link', { name: 'Page 6' });
    expect(link).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:shadow-focus',
      // The compound utility is the one that outranks the current page's own edge shadow.
      'aria-[current=page]:focus-visible:shadow-focus',
      'forced-colors:focus-visible:outline-solid',
      'forced-colors:focus-visible:outline-(length:--focus-width)',
      'forced-colors:focus-visible:outline-[color:Highlight]',
      'forced-colors:aria-[current=page]:outline-solid',
      'forced-colors:aria-[current=page]:outline-(length:--focus-width)',
      'forced-colors:aria-[current=page]:outline-[color:Highlight]'
    );
  });

  it('keeps text-meta and text-fg-secondary together after the class merge (PG-12)', () => {
    render(<Pagination {...base} />);
    for (const link of links()) {
      expect(link).toHaveClass('text-meta', 'text-fg-secondary');
    }
  });

  it('dims only the unavailable placeholders, without hover and without the link treatment (PG-12)', () => {
    const { container } = render(<Pagination {...base} value={1} />);
    const placeholder = container.querySelector('[data-disabled]') as HTMLElement;
    expect(placeholder).toHaveClass(
      'data-[disabled]:opacity-45',
      'text-fg-secondary',
      'uppercase',
      'min-h-10',
      'min-w-10'
    );
    for (const name of placeholder.className.split(' ')) {
      expect(name, name).not.toMatch(/^(?:hover|focus-visible|aria-|forced-colors|transition|duration|ease)/);
    }
    expect(container.querySelectorAll('[data-disabled]')).toHaveLength(1);
  });

  it('sets no inline style, data-state, animation or transform and no colour literal on anything it owns (PG-12)', () => {
    const { container } = render(<Pagination {...base} />);
    expect(container.querySelectorAll('[style]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-state]')).toHaveLength(0);
    const owned = [
      paginationVariants(),
      paginationListVariants(),
      paginationItemVariants(),
      paginationLinkVariants({ kind: 'page' }),
      paginationLinkVariants({ kind: 'step' }),
      paginationEllipsisVariants(),
      paginationPlaceholderVariants(),
      paginationIconVariants()
    ].flatMap((classes) => classes.split(' '));
    expect(owned.length).toBeGreaterThan(0);
    for (const utility of owned) {
      expect(utility).not.toMatch(/(?:^|:)(?:animate|transform|translate|scale|skew)\b/);
      // The one rotation is the right-to-left arrow flip; no hex or functional colour literal, and no !important.
      expect(utility).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/);
      expect(utility).not.toMatch(/^!|!$/);
      expect(utility).not.toMatch(/\$\{/);
    }
    expect(owned.filter((name) => /rotate/.test(name))).toEqual(['rtl:rotate-180']);
  });

  it('puts a class on the owned parts only: the landmark, list, links, placeholders, ellipses and arrows (PG-12)', () => {
    const { container } = render(<Pagination {...base} value={1} />);
    const classed = [...container.querySelectorAll('[class]')].map((element) => element.tagName.toLowerCase());
    expect(new Set(classed)).toEqual(new Set(['nav', 'ul', 'a', 'span', 'svg']));
    for (const item of container.querySelectorAll('li')) {
      expect(item).not.toHaveAttribute('class');
    }
  });
});

describe('Pagination rendering targets', () => {
  it('renders the same markup on the server and on the client (PG-16)', () => {
    for (const props of [base, { ...base, value: 1 }, { ...base, value: 12 }, { ...base, pageCount: 5, value: 3 }]) {
      const element = <Pagination {...props} className='mt-6' />;
      const server = renderToStaticMarkup(element);
      const { container, unmount } = render(element);
      expect(container.innerHTML).toBe(server);
      unmount();
    }
  });

  it('renders no markup on the server for invalid input or a single page (PG-16)', () => {
    expect(renderToStaticMarkup(<Pagination {...untyped({ ...base, label: ' ' })} />)).toBe('');
    expect(renderToStaticMarkup(<Pagination {...base} pageCount={1} />)).toBe('');
    expect(renderToStaticMarkup(<Pagination {...untyped({ ...base, getHref: null })} />)).toBe('');
  });

  it('is deterministic: the same props give the same model every time (PG-16)', () => {
    const first = renderHook(() => usePagination(base)).result.current;
    const second = renderHook(() => usePagination(base)).result.current;
    const shape = (result: typeof first) =>
      JSON.stringify(result.model?.items.map((item) => ({ ...item, linkProps: undefined })));
    expect(shape(first)).toBe(shape(second));
  });
});
