import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Button } from '../../atoms/button';
import type { IconName } from '../../atoms/icon';
import { Link } from '../../atoms/link';
import { EmptyState } from './EmptyState';
import type { EmptyStateProps } from './types';
import { useEmptyState } from './useEmptyState';

const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  // Intentionally silent: development warnings are asserted, not printed.
});

afterEach(() => {
  consoleWarn.mockClear();
  vi.unstubAllEnvs();
});

const titleWarning = 'EmptyState requires a non-empty title. Nothing was rendered.';

// The one documented cast: a JavaScript caller can pass values that the public type rejects.
function untyped(props: Record<string, unknown>): EmptyStateProps {
  return props as unknown as EmptyStateProps;
}

describe('EmptyState structure', () => {
  it('renders one div root with the stable marker, no role and no native tooltip, named by a native heading (ES-01)', () => {
    const { container } = render(<EmptyState title='No matching posts' />);
    const root = container.firstElementChild as HTMLElement;
    expect(container.children).toHaveLength(1);
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-empty-state');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('title');
    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'No matching posts', level: 3 })).toBeInTheDocument();
    // A title-only state holds the heading and nothing else.
    expect(root.children).toHaveLength(1);
  });

  it('keeps the DOM order icon wrapper, heading, description and actions (ES-01)', () => {
    const { container } = render(
      <EmptyState
        title='No matching posts'
        description='Try another filter.'
        icon='search'
        actions={<Button variant='secondary'>Clear filters</Button>}
      />
    );
    const root = container.firstElementChild as HTMLElement;
    expect([...root.children].map((child) => child.tagName)).toEqual(['SPAN', 'H3', 'P', 'DIV']);
    const icon = root.querySelector('span') as HTMLElement;
    const heading = within(root).getByRole('heading');
    const description = root.querySelector('p') as HTMLElement;
    const actions = within(root).getByRole('button', { name: 'Clear filters' }).parentElement as HTMLElement;
    const parts = [icon, heading, description, actions];
    for (const [index, part] of parts.entries()) {
      const next = parts[index + 1];
      if (next) {
        expect(part.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    }
    expect(heading).toHaveTextContent('No matching posts');
    expect(description).toHaveTextContent('Try another filter.');
    expect(actions).toHaveTextContent('Clear filters');
  });

  it('returns a typed hook result for the component to render (ES-01)', () => {
    const { result } = renderHook(() =>
      useEmptyState({ title: 'No matching posts', description: 'Try another filter.', icon: 'search' })
    );
    expect(Object.keys(result.current).sort()).toEqual([
      'action',
      'actionsClassName',
      'description',
      'descriptionClassName',
      'headingClassName',
      'headingElement',
      'iconClassName',
      'iconName',
      'rootProps',
      'title',
      'valid'
    ]);
    expect(result.current).toMatchObject({
      valid: true,
      headingElement: 'h3',
      title: 'No matching posts',
      description: 'Try another filter.',
      iconName: 'search',
      action: null
    });
    expect(result.current.rootProps.className).toContain('eg-empty-state');
  });
});

describe('EmptyState heading rank', () => {
  it.each([2, 3, 4, 5, 6] as const)('renders the matching native heading element for level %s (ES-02)', (level) => {
    render(<EmptyState title='No results' level={level} />);
    expect(screen.getByRole('heading', { name: 'No results', level })).toBeInTheDocument();
    expect(screen.getByRole('heading').tagName).toBe(`H${level}`);
  });

  it.each([
    ['undefined', undefined],
    ['1', 1],
    ['7', 7],
    ['0', 0],
    ['2.5', 2.5],
    ['NaN', Number.NaN],
    ['the string "4"', '4'],
    ['null', null]
  ])('falls back to h3 without a warning when level is %s (ES-02)', (_label, level) => {
    const { container } = render(<EmptyState {...untyped({ title: 'No results', level })} />);
    expect(screen.getByRole('heading', { name: 'No results', level: 3 }).tagName).toBe('H3');
    expect(container.querySelector('h1')).toBeNull();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('resolves the same element in the hook as in the DOM (ES-02)', () => {
    const ranked = renderHook(() => useEmptyState({ title: 'No results', level: 5 }));
    expect(ranked.result.current.headingElement).toBe('h5');
    const invalid = renderHook(() => useEmptyState(untyped({ title: 'No results', level: 1 })));
    expect(invalid.result.current.headingElement).toBe('h3');
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});

describe('EmptyState optional parts', () => {
  it.each([
    ['absent', undefined],
    ['empty', ''],
    ['whitespace-only', '   '],
    ['null', null],
    ['a number', 42],
    ['an object', { text: 'not a string' }]
  ])('renders no paragraph and no empty node when the description is %s (ES-03)', (_label, description) => {
    const { container } = render(<EmptyState {...untyped({ title: 'No results', description })} />);
    expect(container.querySelector('p')).toBeNull();
    expect(container.firstElementChild?.children).toHaveLength(1);
    expect(container.firstElementChild?.textContent).toBe('No results');
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['false', false],
    ['true', true]
  ])('renders no actions wrapper when actions is %s (ES-03)', (_label, actions) => {
    const { container } = render(<EmptyState {...untyped({ title: 'No results', actions })} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(1);
    expect(root.querySelector('div')).toBeNull();
  });

  it('renders no icon wrapper when the icon is absent and a title-only state is valid (ES-03)', () => {
    const { container } = render(<EmptyState title='No results' />);
    expect(container.querySelector('span')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
    expect(container.firstElementChild?.children).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('renders markup characters in the title and description as literal text (ES-03)', () => {
    const { container } = render(
      <EmptyState title='<b>No</b> results' description='Try <i>another</i> filter & retry' />
    );
    expect(screen.getByRole('heading', { name: '<b>No</b> results' })).toBeInTheDocument();
    expect(container.querySelector('p')).toHaveTextContent('Try <i>another</i> filter & retry');
    expect(container.querySelector('b, i')).toBeNull();
  });
});

describe('EmptyState title validation', () => {
  it.each([
    ['empty', ''],
    ['whitespace-only', '   '],
    ['undefined', undefined],
    ['null', null],
    ['a number', 42]
  ])('warns once and renders nothing for a %s title (ES-04)', (_label, title) => {
    const { container } = render(<EmptyState {...untyped({ title, description: 'Still here', icon: 'search' })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn).toHaveBeenCalledTimes(1);
    expect(consoleWarn).toHaveBeenCalledWith(titleWarning);
  });

  it('renders normally on a later valid rerender (ES-04)', () => {
    const { container, rerender } = render(<EmptyState title='   ' />);
    expect(container).toBeEmptyDOMElement();
    rerender(<EmptyState title='No results' />);
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
    expect(consoleWarn).toHaveBeenCalledTimes(1);
  });

  it('stays silent in production but still renders nothing for a blank title (ES-04)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<EmptyState title='' />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('reports an invalid title from the hook as not valid (ES-04)', () => {
    const named = renderHook(() => useEmptyState({ title: 'No results' }));
    expect(named.result.current.valid).toBe(true);
    const blank = renderHook(() => useEmptyState({ title: ' ' }));
    expect(blank.result.current.valid).toBe(false);
    const missing = renderHook(() => useEmptyState(untyped({})));
    expect(missing.result.current.valid).toBe(false);
  });
});

describe('EmptyState decorative icon', () => {
  it('hides the icon wrapper from assistive technology and keeps the heading name to the title (ES-05)', () => {
    const { container } = render(<EmptyState title='No results' icon='search' />);
    const wrapper = container.querySelector('span') as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper.querySelector('svg')).not.toBeNull();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByRole('heading')).toHaveAccessibleName('No results');
  });

  it('draws the glyph through the system Icon at the lg preset (ES-05)', () => {
    const { container } = render(<EmptyState title='No results' icon='inbox' />);
    const glyph = container.querySelector('svg') as SVGElement;
    expect(glyph).toHaveClass('eg-icon', 'size-7');
    expect(glyph.classList.contains('size-4')).toBe(false);
    expect(glyph.classList.contains('size-(--icon-size)')).toBe(false);
  });
});

describe('EmptyState action', () => {
  it('renders a Button unchanged and activates it once per click, Enter and Space (ES-06)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        title='No results'
        actions={
          <Button variant='secondary' onClick={onClick} data-probe='kept'>
            Clear filters
          </Button>
        }
      />
    );
    const button = screen.getByRole('button', { name: 'Clear filters' });
    expect(button).toHaveAttribute('data-probe', 'kept');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    button.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('renders a Button asChild anchor unchanged and activates it once per click and Enter (ES-06)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <EmptyState
        title='No results'
        actions={
          <Button asChild={true}>
            <a href='#recover' onClick={onClick}>
              Browse all posts
            </a>
          </Button>
        }
      />
    );
    const anchor = screen.getByRole('link', { name: 'Browse all posts' });
    expect(anchor).toHaveAttribute('href', '#recover');
    await user.click(anchor);
    expect(onClick).toHaveBeenCalledTimes(1);
    anchor.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders a Link unchanged and activates it once per click and Enter (ES-06)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <EmptyState
        title='No results'
        actions={
          <Link href='#recover' onClick={onClick}>
            Browse all posts
          </Link>
        }
      />
    );
    const link = screen.getByRole('link', { name: 'Browse all posts' });
    expect(link).toHaveAttribute('href', '#recover');
    await user.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
    link.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('adds no role or tab stop around the action and is reached by Tab exactly once (ES-06)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <button type='button'>Before</button>
        <EmptyState title='No results' description='Try another filter.' actions={<Button>Clear filters</Button>} />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Before' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Clear filters' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After' }));
    const wrapper = screen.getByRole('button', { name: 'Clear filters' }).parentElement as HTMLElement;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.children).toHaveLength(1);
    expect(wrapper).not.toHaveAttribute('role');
    expect(wrapper).not.toHaveAttribute('tabindex');
    for (const element of container.querySelectorAll('.eg-empty-state, .eg-empty-state *')) {
      if (element.tagName !== 'BUTTON') {
        expect(element, element.tagName).not.toHaveAttribute('tabindex');
      }
    }
  });
});

describe('EmptyState passivity', () => {
  it('renders no live region, status, alert or log (ES-07)', () => {
    const { container } = render(
      <EmptyState
        title='No results'
        description='Try another filter.'
        icon='search'
        actions={<Button>Clear filters</Button>}
      />
    );
    for (const role of ['status', 'alert', 'log']) {
      expect(screen.queryByRole(role), role).toBeNull();
    }
    expect(container.querySelector('[aria-live], [aria-atomic], [aria-relevant], [role]')).toBeNull();
  });

  it('drops an untyped role and the live-region attributes at runtime (ES-07)', () => {
    const { container } = render(
      <EmptyState
        {...untyped({
          title: 'No results',
          role: 'status',
          'aria-live': 'polite',
          'aria-atomic': 'true',
          'aria-relevant': 'additions'
        })}
      />
    );
    const root = container.firstElementChild as HTMLElement;
    for (const attribute of ['role', 'aria-live', 'aria-atomic', 'aria-relevant']) {
      expect(root, attribute).not.toHaveAttribute(attribute);
    }
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('never moves focus on mount, update or unmount (ES-07)', () => {
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    const { rerender, unmount } = render(<EmptyState title='No results' actions={<Button>Clear filters</Button>} />);
    expect(document.activeElement).toBe(outside);
    rerender(<EmptyState title='Still nothing' description='The filter changed.' icon='inbox' />);
    expect(document.activeElement).toBe(outside);
    unmount();
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it('excludes the role and live-region props from the public type (ES-07)', () => {
    expectTypeOf<
      Extract<keyof EmptyStateProps, 'role' | 'aria-live' | 'aria-atomic' | 'aria-relevant'>
    >().toEqualTypeOf<never>();
  });
});

describe('EmptyState native props', () => {
  it('forwards compatible attributes to the root (ES-08)', () => {
    const { container } = render(
      <EmptyState title='No results' id='empty' lang='es' dir='rtl' aria-describedby='hint' data-section='posts' />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('id', 'empty');
    expect(root).toHaveAttribute('lang', 'es');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('aria-describedby', 'hint');
    expect(root).toHaveAttribute('data-section', 'posts');
  });

  it('drops the protected attributes, content and refs at untyped boundaries (ES-08)', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <EmptyState
        {...untyped({
          title: 'No results',
          children: 'injected',
          'aria-label': 'injected',
          'aria-labelledby': 'other',
          tabIndex: 0,
          contentEditable: true,
          dangerouslySetInnerHTML: { __html: '<b>injected</b>' },
          ref,
          id: 'kept'
        })}
      />
    );
    const root = container.firstElementChild as HTMLElement;
    for (const attribute of ['aria-label', 'aria-labelledby', 'tabindex', 'contenteditable', 'title']) {
      expect(root, attribute).not.toHaveAttribute(attribute);
    }
    expect(root).toHaveAttribute('id', 'kept');
    expect(root.textContent).toBe('No results');
    expect(container.querySelector('b')).toBeNull();
    expect(ref.current).toBeNull();
  });

  it('strips the protected keys from the hook root props and keeps the rest (ES-08)', () => {
    const { result } = renderHook(() =>
      useEmptyState(
        untyped({
          title: 'No results',
          children: 'injected',
          role: 'status',
          'aria-live': 'polite',
          'aria-atomic': 'true',
          'aria-relevant': 'additions',
          'aria-label': 'injected',
          'aria-labelledby': 'other',
          dangerouslySetInnerHTML: { __html: 'injected' },
          tabIndex: 0,
          contentEditable: true,
          ref: createRef(),
          id: 'kept',
          'data-section': 'posts'
        })
      )
    );
    for (const key of [
      'children',
      'role',
      'aria-live',
      'aria-atomic',
      'aria-relevant',
      'aria-label',
      'aria-labelledby',
      'dangerouslySetInnerHTML',
      'tabIndex',
      'contentEditable',
      'ref',
      'title',
      'level',
      'description',
      'icon',
      'actions'
    ]) {
      expect(result.current.rootProps, key).not.toHaveProperty(key);
    }
    expect(result.current.rootProps).toMatchObject({ id: 'kept', 'data-section': 'posts' });
  });

  it('merges className last on the root only and keeps the stable marker (ES-08)', () => {
    const { container } = render(
      <EmptyState
        title='No results'
        description='Try another filter.'
        icon='search'
        actions={<Button>Clear filters</Button>}
        className='mt-6 w-72'
      />
    );
    const root = container.firstElementChild as HTMLElement;
    const classes = root.className.split(' ');
    expect(classes).toContain('eg-empty-state');
    expect(classes).toContain('mt-6');
    expect(classes.indexOf('mt-6')).toBeGreaterThan(classes.indexOf('eg-empty-state'));
    expect(classes.indexOf('w-72')).toBeGreaterThan(classes.indexOf('eg-empty-state'));
    for (const part of root.children) {
      expect(part.classList.contains('mt-6')).toBe(false);
      expect(part.classList.contains('w-72')).toBe(false);
    }
  });

  it('exposes no ref, asChild, content or protected prop in the public type (ES-08)', () => {
    expectTypeOf<
      Extract<
        keyof EmptyStateProps,
        | 'children'
        | 'role'
        | 'aria-live'
        | 'aria-atomic'
        | 'aria-relevant'
        | 'aria-label'
        | 'aria-labelledby'
        | 'dangerouslySetInnerHTML'
        | 'tabIndex'
        | 'contentEditable'
        | 'ref'
        | 'asChild'
      >
    >().toEqualTypeOf<never>();
    expectTypeOf<EmptyStateProps['title']>().toEqualTypeOf<string>();
    expectTypeOf<EmptyStateProps['description']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<EmptyStateProps['icon']>().toEqualTypeOf<IconName | undefined>();
  });
});

describe('EmptyState rendering targets', () => {
  it('renders the same markup on the server and on the client (ES-13)', () => {
    const element = (
      <EmptyState
        title='No results'
        level={2}
        description='Try another filter.'
        icon='search'
        actions={<Button variant='secondary'>Clear filters</Button>}
        className='mt-6'
      />
    );
    const server = renderToStaticMarkup(element);
    const { container } = render(element);
    expect(container.innerHTML).toBe(server);
    expect(server).toContain('eg-empty-state');
    expect(server).toContain('<h2');
  });

  it('renders nothing on the server for a blank title (ES-13)', () => {
    expect(renderToStaticMarkup(<EmptyState title='   ' />)).toBe('');
  });
});
