import { composeStory } from '@storybook/react-vite';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Badge } from '../../atoms/badge';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Link } from '../../atoms/link';
import { StepMeter } from '../../atoms/step-meter';
import { NowCard, NowCardBody, NowCardDetail, NowCardFooter } from './NowCard';
import meta, { WithStatusBand } from './NowCard.stories';
import type { NowCardProps } from './types';
import { useNowCard } from './useNowCard';

const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  // Intentionally silent: development warnings are asserted, not printed.
});

afterEach(() => {
  consoleWarn.mockClear();
});

const fullCard = (
  <NowCard
    title='Currently building'
    size='md'
    statusBadge={
      <Badge tone='brand' variant='soft'>
        Building
      </Badge>
    }
  >
    <NowCardBody>
      <p>Shipping the web catalog layer for the design system.</p>
    </NowCardBody>
    <NowCardFooter>
      <NowCardDetail>
        Next stream <b>Thursday</b>
      </NowCardDetail>
      <Link href='#live' variant='underlined'>
        Watch live
      </Link>
    </NowCardFooter>
  </NowCard>
);

describe('NowCard public contract', () => {
  it.each(['md', 'sm'] as const)('sets the heading inset and badge marker at %s density', (size) => {
    const { rerender } = render(<NowCard title='Activity' size={size} />);
    const article = screen.getByRole('article', { name: 'Activity' });
    const heading = screen.getByRole('heading', { name: 'Activity' });
    expect(article).toHaveAttribute('data-badge', 'false');
    expect(heading).toHaveClass('pt-6');
    for (const statusBadge of [null, false, true]) {
      rerender(<NowCard title='Activity' size={size} statusBadge={statusBadge} />);
      expect(article).toHaveAttribute('data-badge', 'false');
      expect(heading).toHaveClass('pt-6');
      expect(article.querySelector('.eg-now-card__badge')).toBeNull();
    }
    rerender(<NowCard title='Activity' size={size} statusBadge={<span>Active</span>} />);
    expect(article).toHaveAttribute('data-badge', 'true');
    expect(heading).toHaveClass('pt-0');
    expect(heading).not.toHaveClass('pt-6');
    expect(article.firstElementChild).toHaveClass('px-6', 'pt-6', 'pb-3');
    expect(article.firstElementChild?.nextElementSibling).toBe(heading);
    expect(heading).toHaveClass('m-0', 'min-w-0', 'text-fg-default', 'wrap-anywhere');
    expect(heading).toHaveClass(...(size === 'md' ? ['px-6', 'text-heading-small'] : ['px-4', 'text-body-large']));
  });
  it('derives passive defaults and names the article with the generated heading (NC-01)', () => {
    const { result } = renderHook(() => useNowCard({ title: 'Currently building' }));
    expect(result.current.valid).toBe(true);
    expect(result.current.headingElement).toBe('h3');
    expect(result.current.rootProps['data-size']).toBe('md');
    expect(result.current.rootProps['aria-labelledby']).toBe(result.current.headingProps.id);
    expect(result.current.showBadge).toBe(false);

    render(fullCard);
    const article = screen.getByRole('article', { name: 'Currently building' });
    expect(article.tagName).toBe('ARTICLE');
    const heading = screen.getByRole('heading', { level: 3, name: 'Currently building' });
    expect(heading.id).toBe(article.getAttribute('aria-labelledby'));
  });

  it('selects the native heading rank from level without changing the visual step (NC-01)', () => {
    const { rerender } = render(<NowCard title='Currently building' />);
    expect(screen.getByRole('heading', { level: 3, name: 'Currently building' })).toBeInTheDocument();
    rerender(<NowCard title='Currently building' level={6} />);
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 6, name: 'Currently building' })).toBeInTheDocument();
    rerender(<NowCard title='Currently building' level={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Currently building' })).toBeInTheDocument();
  });

  it('warns in development and renders nothing for a blank or whitespace title (NC-02)', () => {
    render(<NowCard title='   ' />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(consoleWarn).toHaveBeenCalledWith('NowCard requires a non-empty title. Nothing was rendered.');
  });

  it('renders body and footer in DOM order with their public markers and the banded footer (NC-03)', () => {
    const { container } = render(fullCard);
    const article = screen.getByRole('article', { name: 'Currently building' });
    expect(article).toHaveClass('eg-now-card', 'rounded-xl', 'overflow-hidden', 'flex', 'flex-col', 'min-w-0');

    const body = container.querySelector('.eg-now-card__body');
    const foot = container.querySelector('.eg-now-card__foot');
    expect(body).not.toBeNull();
    expect(foot).not.toBeNull();
    expect(body).toHaveClass('p-6', 'text-body-large', 'text-fg-secondary');
    // Body-grow amendment: the body absorbs stretched height so the footer band pins to the card bottom.
    expect(body).toHaveClass('flex-1');
    expect(body?.nextElementSibling).toBe(foot);
    expect(foot).toHaveClass('eg-now-card__foot', 'bg-surface-0', 'border-t', 'rounded-b-xl');
    expect(foot).toHaveClass('flex-wrap', 'justify-between');
  });

  it('reduces density at size="sm" and still renders the full copy and footer (NC-04)', () => {
    const sm = (
      <NowCard title='Currently exploring' size='sm'>
        <NowCardBody>
          <p>Exploring token-driven density presets.</p>
        </NowCardBody>
        <NowCardFooter>
          <NowCardDetail>
            Last sync <b>today</b>
          </NowCardDetail>
        </NowCardFooter>
      </NowCard>
    );
    const { container, rerender } = render(sm);
    expect(screen.getByRole('article', { name: 'Currently exploring' })).toHaveAttribute('data-size', 'sm');
    expect(container.querySelector('.eg-now-card__body')).toHaveClass('p-4', 'text-body-default');
    expect(container.querySelector('.eg-now-card__body')).not.toHaveClass('p-6');
    expect(container.querySelector('.eg-now-card__body')).not.toHaveClass('text-body-large');
    expect(screen.getByRole('heading', { level: 3, name: 'Currently exploring' })).toHaveClass('text-body-large');
    expect(container.querySelector('.eg-now-card__foot')).toHaveClass('px-5', 'py-2');
    expect(screen.getByText('Exploring token-driven density presets.')).toBeInTheDocument();
    expect(screen.getByText('Last sync')).toBeInTheDocument();

    rerender(<NowCard title='Currently exploring'>{sm.props.children}</NowCard>);
    expect(screen.getByRole('article', { name: 'Currently exploring' })).toHaveAttribute('data-size', 'md');
    const mdBody = container.querySelector('.eg-now-card__body');
    expect(mdBody).toHaveClass('p-6', 'text-body-large');
    expect(screen.getByRole('heading', { level: 3, name: 'Currently exploring' })).toHaveClass('text-heading-small');
  });

  it('renders the status badge as the first DOM child before the heading (NC-A1)', () => {
    render(fullCard);
    const article = screen.getByRole('article', { name: 'Currently building' });
    const badge = article.querySelector('.eg-now-card__badge');
    expect(badge).not.toBeNull();
    expect(article.firstElementChild).toBe(badge);
    expect(badge).toHaveClass('eg-now-card__badge', 'px-6', 'pt-6', 'pb-3');
    expect(screen.getByText('Building')).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 3, name: 'Currently building' });
    const body = article.querySelector('.eg-now-card__body');
    expect(body).not.toBeNull();
    if (badge && body) {
      expect(badge.compareDocumentPosition(heading)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(heading.compareDocumentPosition(body)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    }
  });

  it('keeps the status badge readable, non-interactive and absent when empty (NC-A2)', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <NowCard
        title='Currently building'
        statusBadge={
          <Badge tone='brand' variant='soft'>
            Building
          </Badge>
        }
      >
        <NowCardBody>
          <p>Shipping the web catalog layer.</p>
        </NowCardBody>
      </NowCard>
    );
    const wrapper = container.querySelector('.eg-now-card__badge');
    expect(wrapper).not.toBeNull();
    expect(wrapper).not.toHaveAttribute('aria-hidden');
    expect(screen.getByText('Building')).toBeInTheDocument();
    await user.tab();
    expect(document.activeElement).toBe(document.body);

    rerender(
      <NowCard title='Currently building' statusBadge={null}>
        <NowCardBody>
          <p>Shipping the web catalog layer.</p>
        </NowCardBody>
      </NowCard>
    );
    expect(container.querySelector('.eg-now-card__badge')).toBeNull();
    rerender(
      <NowCard title='Currently building' statusBadge={false}>
        <NowCardBody>
          <p>Shipping the web catalog layer.</p>
        </NowCardBody>
      </NowCard>
    );
    expect(container.querySelector('.eg-now-card__badge')).toBeNull();
  });

  it('exposes exactly one tab stop for a footer detail plus link (NC-06)', async () => {
    const user = userEvent.setup();
    render(fullCard);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Watch live' })).toHaveFocus();
    await user.tab();
    expect(document.activeElement).not.toBe(screen.getByRole('link', { name: 'Watch live' }));
  });

  it('aligns a single-child footer to the leading edge through justify-between (NC-06)', () => {
    render(
      <NowCard title='Currently streaming'>
        <NowCardFooter>
          <NowCardDetail>Live now</NowCardDetail>
        </NowCardFooter>
      </NowCard>
    );
    const foot = document.querySelector('.eg-now-card__foot');
    expect(foot).toHaveClass('justify-between');
    expect(foot?.childElementCount).toBe(1);
    expect(foot?.className).not.toContain('justify-end');
    expect(foot?.className).not.toContain('ms-auto');
  });

  it('supports a lone icon action in the footer with its own accessible label (NC-06)', async () => {
    const user = userEvent.setup();
    render(
      <NowCard title='Currently streaming'>
        <NowCardFooter>
          <IconButton label='Open stream' icon={<span data-icon={true} />} />
        </NowCardFooter>
      </NowCard>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Open stream' })).toHaveFocus();
  });

  it('renders the detail sentence with the emphasized value and a real time element (NC-07)', () => {
    render(
      <NowCard title='Currently building'>
        <NowCardFooter>
          <NowCardDetail>
            Next stream{' '}
            <b>
              <time dateTime='2026-11-05T18:00:00Z'>Thu 18:00</time>
            </b>
          </NowCardDetail>
        </NowCardFooter>
      </NowCard>
    );
    const detail = document.querySelector('.eg-now-card__detail');
    expect(detail).toHaveClass('eg-now-card__detail', 'text-meta', 'uppercase', 'tabular-nums', 'text-fg-muted');
    expect(detail).toHaveClass('[&_b]:text-fg-default', '[&_b]:font-(weight:--text-title-section--font-weight)');
    expect(detail?.textContent).toContain('Next stream');
    const time = detail?.querySelector('time');
    expect(time).toHaveAttribute('dateTime', '2026-11-05T18:00:00Z');
    expect(screen.getByText('Thu 18:00')).toBeInTheDocument();
  });

  it('wraps long content at a narrow host without truncate, clamp or reorder utilities (NC-08)', () => {
    const longCopy =
      'Shipping an unusually long status sentence that must wrap at word boundaries inside a narrow grid column without ever being clamped, truncated or replaced by a tooltip.';
    const longDetail =
      'Next milestone lands after the final review pass of the second documentation batch sometime next week';
    render(
      <div style={{ width: 200 }}>
        <NowCard title='Currently building a very long descriptive status title'>
          <NowCardBody>
            <p>{longCopy}</p>
          </NowCardBody>
          <NowCardFooter>
            <NowCardDetail>
              {longDetail}{' '}
              <b>
                <time dateTime='2026-11-05T18:00:00Z'>Thu 18:00</time>
              </b>
            </NowCardDetail>
          </NowCardFooter>
        </NowCard>
      </div>
    );
    const article = screen.getByRole('article');
    const body = article.querySelector('.eg-now-card__body');
    const foot = article.querySelector('.eg-now-card__foot');
    const detail = article.querySelector('.eg-now-card__detail');
    for (const part of [article, body, foot, detail]) {
      expect(part?.className).not.toContain('truncate');
      expect(part?.className).not.toContain('line-clamp');
      expect(part?.className).not.toContain('whitespace-nowrap');
    }
    expect(foot).toHaveClass('flex-wrap');
    expect(screen.getByText(longCopy, { exact: false })).toBeInTheDocument();
  });

  it('carries no transition, animation, hover or pointer cursor utilities, reduced motion included (NC-09)', () => {
    const matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: () => {
        // jsdom stub: no media listeners are needed.
      },
      removeEventListener: () => {
        // jsdom stub: no media listeners are needed.
      },
      addListener: () => {
        // Legacy API stub for older environments.
      },
      removeListener: () => {
        // Legacy API stub for older environments.
      },
      dispatchEvent: () => false
    }));
    vi.stubGlobal('matchMedia', matchMedia);
    try {
      const { container } = render(fullCard);
      for (const selector of ['.eg-now-card', '.eg-now-card__body', '.eg-now-card__foot', '.eg-now-card__detail']) {
        const element = container.querySelector(selector);
        expect(element).not.toBeNull();
        expect(element?.className).not.toMatch(
          /(^|\s)(transition-(?!none)|animate-|motion-safe|hover:|cursor-pointer)/
        );
      }
      expect(matchMedia.mock.calls.every(([query]) => typeof query === 'string')).toBe(true);
      expect(screen.getByRole('article', { name: 'Currently building' })).toBeInTheDocument();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('keeps every surface-composed element border-box so consumer widths contain the frame (G7a)', () => {
    const { container } = render(fullCard);
    expect(container.querySelector('.eg-now-card')).toHaveClass(
      'box-border',
      'items-stretch',
      'gap-0',
      'min-h-0',
      'transform-none',
      'transition-none'
    );
    expect(container.querySelector('h3')).toHaveClass('px-6');
    expect(container.querySelector('.eg-now-card__foot')).toHaveClass('m-0');
    expect(container.querySelector('.eg-now-card__foot')).toHaveClass('box-border');
    expect(container.querySelector('.eg-now-card__foot')).toHaveClass('border-x-0', 'border-b-0', 'shadow-none');
  });

  it('rejects root style at the public type and untyped runtime boundaries while preserving native attributes', () => {
    const styleIsProtected: 'style' extends keyof NowCardProps ? false : true = true;
    expect(styleIsProtected).toBe(true);
    const untyped: ComponentPropsWithoutRef<'article'> & { title: string; 'data-track': string } = {
      title: 'Activity',
      style: { color: 'red', display: 'none' },
      role: 'region',
      id: 'activity',
      'data-track': 'kept'
    };
    render(<NowCard {...(untyped as NowCardProps)} />);
    const article = screen.getByRole('article', { name: 'Activity' });
    expect(article).not.toHaveAttribute('style');
    expect(article).not.toHaveAttribute('role');
    expect(article).toHaveAttribute('id', 'activity');
    expect(article).toHaveAttribute('data-track', 'kept');
  });

  it('strips protected article semantics and forwards the remaining native props', () => {
    // The real pre-narrowing native surface a JavaScript consumer can pass; `data-*` attributes are
    // valid on the element but absent from React's attribute type, so the fixture declares the one
    // it asserts. The single documented cast simulates the untyped/JavaScript boundary where the
    // hook must still strip protected semantics; no `any` and no blanket suppression is used.
    const untyped: ComponentPropsWithoutRef<'article'> & { title: string; 'data-track'?: string } = {
      title: 'Currently building',
      role: 'region',
      tabIndex: 0,
      'aria-label': 'overridden',
      'aria-labelledby': 'overridden',
      'aria-live': 'polite',
      'aria-pressed': true,
      id: 'kept-id',
      'data-track': 'now-1'
    };
    const { result } = renderHook(() => useNowCard(untyped as NowCardProps));
    const rootProps = result.current.rootProps as Record<string, unknown>;
    expect(rootProps.role).toBeUndefined();
    expect(rootProps.tabIndex).toBeUndefined();
    expect(rootProps['aria-label']).toBeUndefined();
    expect(rootProps['aria-labelledby']).toBe(result.current.headingProps.id);
    expect(rootProps['aria-live']).toBeUndefined();
    expect(rootProps['aria-pressed']).toBeUndefined();
    expect(rootProps.id).toBe('kept-id');
    expect(rootProps['data-track']).toBe('now-1');
  });

  it('falls back to md density when the parts render outside a card', () => {
    render(
      <NowCardBody>
        <p>Orphan body</p>
      </NowCardBody>
    );
    expect(document.querySelector('.eg-now-card__body')).toHaveClass('p-6', 'eg-now-card__body');
  });
});

describe('NowCard footer with one StepMeter', () => {
  const companions = {
    link: (
      <Link href='#live' variant='underlined'>
        Watch live
      </Link>
    ),
    iconButton: <IconButton label='Open stream' icon={<span data-icon={true} />} />,
    detail: (
      <NowCardDetail>
        Next stream <b>Thursday</b>
      </NowCardDetail>
    )
  };
  const focusable = { link: 'link', iconButton: 'button', detail: null } as const;
  const footWith = (...children: ReactNode[]) => (
    <NowCard title='Currently building' size='md'>
      <NowCardBody>
        <p>Shipping the web catalog layer for the design system.</p>
      </NowCardBody>
      <NowCardFooter>{children}</NowCardFooter>
    </NowCard>
  );
  const warningFor = 'StepMeter requires a non-empty label. Nothing was rendered.';

  it.each(
    (['link', 'iconButton', 'detail'] as const).flatMap((kind) =>
      (['md', 'sm'] as const).map((size) => [kind, size] as const)
    )
  )(
    'keeps a %s companion first and the named meter last, with one tab stop at most, at %s density (NC3-01, NC3-02)',
    async (kind, size) => {
      const user = userEvent.setup();
      const { container } = render(
        <NowCard title='Currently building' size={size}>
          <NowCardBody>
            <p>Shipping the web catalog layer for the design system.</p>
          </NowCardBody>
          <NowCardFooter>
            {companions[kind]}
            <StepMeter label='High progress' value={3} />
          </NowCardFooter>
        </NowCard>
      );
      const foot = container.querySelector('.eg-now-card__foot');
      expect(foot).not.toBeNull();
      const meter = screen.getByRole('img', { name: 'High progress' });
      expect(foot?.childElementCount).toBe(2);
      expect(foot?.children[1]).toBe(meter);
      expect(meter).toHaveClass('eg-step-meter');
      expect(foot?.children[0]).not.toBe(meter);
      expect(foot?.contains(meter)).toBe(true);
      // The article is still named only by its generated heading; the meter does not rename or describe it.
      const article = screen.getByRole('article', { name: 'Currently building' });
      expect(article).toHaveAttribute('data-size', size);
      expect(article.getAttribute('aria-labelledby')).toBe(screen.getByRole('heading', { level: 3 }).id);
      expect(article).not.toHaveAttribute('aria-describedby');
      expect(foot).toHaveClass('flex-wrap', 'justify-between');
      // At most one tab stop, owned by the companion; the meter and the detail never take focus.
      const role = focusable[kind];
      await user.tab();
      if (role === null) {
        expect(document.body).toHaveFocus();
      } else {
        expect(foot?.children[0]).toHaveFocus();
        expect(screen.getByRole(role)).toBe(foot?.children[0]);
        await user.tab();
        expect(document.body).toHaveFocus();
      }
      expect(meter).not.toHaveFocus();
      expect(consoleWarn).not.toHaveBeenCalled();
    }
  );

  it('renders detail, action and meter in DOM order without inspecting, limiting or warning (NC3-06)', () => {
    const { container } = render(
      footWith(companions.detail, companions.link, <StepMeter label='High progress' value={3} />)
    );
    const foot = container.querySelector('.eg-now-card__foot');
    expect([...(foot?.children ?? [])].map((child) => child.className.split(' ')[0])).toEqual([
      'eg-now-card__detail',
      'eg-link',
      'eg-step-meter'
    ]);
    expect(screen.getByRole('link', { name: 'Watch live' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'High progress' })).toBeInTheDocument();
    expect(foot).toHaveClass('flex-wrap', 'justify-between');
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['a blank label', { label: '   ', value: 3 }, warningFor],
    [
      'a non-finite value',
      { label: 'High progress', value: Number.NaN },
      'StepMeter requires a finite numeric value. Nothing was rendered.'
    ]
  ])(
    'leaves the other footer child unchanged and adds no warning or placeholder for %s (NC3-07)',
    (_name, meter, warning) => {
      const { container } = render(footWith(companions.link, <StepMeter {...meter} />));
      const foot = container.querySelector('.eg-now-card__foot');
      expect(foot?.childElementCount).toBe(1);
      expect(foot?.firstElementChild).toBe(screen.getByRole('link', { name: 'Watch live' }));
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(foot?.textContent).toBe('Watch live');
      // The only message is the atom's own: NowCard neither duplicates it nor adds a warning of its own.
      expect(consoleWarn.mock.calls).toEqual([[warning]]);
      expect(screen.getByRole('article', { name: 'Currently building' })).toBeInTheDocument();
    }
  );
});

describe('NowCard status presentation (#564)', () => {
  const densities = ['md', 'sm'] as const;
  // Recipe R1 of the band without its density-dependent inset (`mx-6` at md, `mx-4` at sm).
  const bandUtilities = [
    'mt-6',
    'mb-3',
    'items-center',
    'gap-2',
    'rounded-sm',
    'border',
    'border-alpha-red-22',
    'bg-alpha-red-12',
    'px-2.5',
    'py-1.5',
    'font-display',
    'text-label-eyebrow',
    'text-primitive-red-200',
    'uppercase',
    'shadow-edge',
    'wrap-anywhere'
  ];
  const pillSlot = ['px-6', 'pt-6', 'pb-3'];
  const label = <span>Building</span>;
  let consoleError: MockInstance<typeof console.error>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: unexpected React diagnostics are asserted, not printed.
    });
  });
  afterEach(() => {
    consoleError.mockRestore();
  });

  const wrapperOf = (article: HTMLElement) => {
    const wrapper = article.querySelector<HTMLElement>('.eg-now-card__badge');
    if (wrapper === null) {
      throw new Error('The status wrapper is missing.');
    }
    return wrapper;
  };
  const silent = () => {
    expect(consoleWarn).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  };

  it.each(['band', 'badge'] as const)(
    'consumes statusPresentation %s instead of forwarding it to the article (NC4-02)',
    (statusPresentation) => {
      render(
        <NowCard title='Activity' statusBadge={label} statusPresentation={statusPresentation} data-example='kept' />
      );
      const article = screen.getByRole('article', { name: 'Activity' });
      expect(article).not.toHaveAttribute('statuspresentation');
      expect(article).toHaveAttribute('data-example', 'kept');
      const { result } = renderHook(() => useNowCard({ title: 'Activity', statusBadge: label, statusPresentation }));
      expect(Object.keys(result.current.rootProps)).not.toContain('statusPresentation');
      silent();
    }
  );

  it.each(densities.flatMap((size) => [undefined, 'badge' as const].map((value) => [size, value] as const)))(
    'keeps the pill slot untouched at %s density when statusPresentation is %s (NC4-01)',
    (size, statusPresentation) => {
      render(
        <NowCard
          title='Activity'
          size={size}
          statusBadge={label}
          {...(statusPresentation === undefined ? {} : { statusPresentation })}
        />
      );
      const wrapper = wrapperOf(screen.getByRole('article', { name: 'Activity' }));
      expect(wrapper).toHaveClass('eg-now-card__badge', 'flex', ...pillSlot);
      for (const utility of bandUtilities) {
        expect(wrapper, utility).not.toHaveClass(utility);
      }
      expect([...wrapper.classList].filter((name) => name.startsWith('mx-'))).toEqual([]);
      silent();
    }
  );

  it.each([
    ['md', 'mx-6', 'px-6'],
    ['sm', 'mx-4', 'px-4']
  ] as const)('paints the band with recipe R1 at %s density (NC4-03)', (size, inset, headingInset) => {
    render(<NowCard title='Activity' size={size} statusBadge={label} statusPresentation='band' />);
    const wrapper = wrapperOf(screen.getByRole('article', { name: 'Activity' }));
    expect([...wrapper.classList].sort()).toEqual(['eg-now-card__badge', 'flex', inset, ...bandUtilities].sort());
    expect([...wrapper.classList].filter((name) => name.startsWith('mx-'))).toEqual([inset]);
    for (const utility of pillSlot) {
      expect(wrapper, utility).not.toHaveClass(utility);
    }
    // The heading keeps its inset and no top padding: the band owns the vertical slot.
    expect(screen.getByRole('heading', { level: 3, name: 'Activity' })).toHaveClass('pt-0', headingInset);
    silent();
  });

  it('keeps the band readable, first in reading order and out of the tab sequence (NC4-04)', async () => {
    const user = userEvent.setup();
    render(
      <NowCard
        title='Activity'
        statusPresentation='band'
        statusBadge={
          <>
            <Icon name='hammer' size='sm' />
            Building
          </>
        }
      >
        <NowCardBody>
          <p>Shipping the catalog.</p>
        </NowCardBody>
        <NowCardFooter>
          <NowCardDetail>
            Layer <b>in review</b>
          </NowCardDetail>
        </NowCardFooter>
      </NowCard>
    );
    const article = screen.getByRole('article', { name: 'Activity' });
    const heading = screen.getByRole('heading', { level: 3, name: 'Activity' });
    const wrapper = wrapperOf(article);
    expect(Array.from(article.children)).toEqual([
      wrapper,
      heading,
      article.querySelector('.eg-now-card__body'),
      article.querySelector('.eg-now-card__foot')
    ]);
    expect(wrapper).not.toHaveAttribute('aria-hidden');
    expect(wrapper.closest('[aria-hidden="true"]')).toBeNull();
    expect(screen.getByText('Building')).toBeInTheDocument();
    expect(article.getAttribute('aria-labelledby')).toBe(heading.id);
    await user.tab();
    expect(document.body).toHaveFocus();
    silent();
  });

  it.each([undefined, null, false, true])(
    'renders no wrapper for a band without a status node (%s) (NC4-05)',
    (statusBadge) => {
      render(<NowCard title='Activity' statusPresentation='band' statusBadge={statusBadge} />);
      const article = screen.getByRole('article', { name: 'Activity' });
      const heading = screen.getByRole('heading', { level: 3, name: 'Activity' });
      expect(article.querySelector('.eg-now-card__badge')).toBeNull();
      expect(article).toHaveAttribute('data-badge', 'false');
      expect(heading).toHaveClass('pt-6');
      expect(heading).not.toHaveClass('pt-0');
      silent();
    }
  );

  it.each(['ribbon', '', null, 0])(
    'resolves the untyped value %j to the pill presentation without leaking it (NC4-06)',
    (value) => {
      // One documented cast: a JavaScript consumer can pass any value at an untyped boundary, and the hook must still
      // fall back to the default presentation, as an invalid level falls back to 3.
      const untyped = { title: 'Activity', statusBadge: label, statusPresentation: value } as unknown as NowCardProps;
      render(<NowCard {...untyped} />);
      const article = screen.getByRole('article', { name: 'Activity' });
      const wrapper = wrapperOf(article);
      expect(article).not.toHaveAttribute('statuspresentation');
      expect(wrapper).toHaveClass('eg-now-card__badge', 'flex', ...pillSlot);
      for (const utility of bandUtilities) {
        expect(wrapper, utility).not.toHaveClass(utility);
      }
      silent();
    }
  );

  it('swaps only the wrapper classes when the presentation changes, with no event (NC4-07)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const card = (statusPresentation: 'badge' | 'band') => (
      <NowCard title='Activity' statusBadge={label} statusPresentation={statusPresentation}>
        <NowCardFooter>
          <Link href='#live' onClick={onClick}>
            Watch live
          </Link>
        </NowCardFooter>
      </NowCard>
    );
    const { rerender } = render(card('badge'));
    const article = screen.getByRole('article', { name: 'Activity' });
    const heading = screen.getByRole('heading', { level: 3, name: 'Activity' });
    const wrapper = wrapperOf(article);
    const link = screen.getByRole('link', { name: 'Watch live' });
    const pill = wrapper.className;
    const headingId = heading.id;
    await user.tab();
    expect(link).toHaveFocus();

    rerender(card('band'));
    expect(screen.getByRole('article', { name: 'Activity' })).toBe(article);
    expect(wrapperOf(article)).toBe(wrapper);
    expect(wrapper).toHaveClass('uppercase', 'mx-6');
    expect(wrapper).not.toHaveClass('px-6');
    expect(heading.id).toBe(headingId);
    expect(article.getAttribute('aria-labelledby')).toBe(headingId);
    expect(link).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
    await user.tab();
    expect(link).toHaveFocus();

    rerender(card('badge'));
    expect(wrapper.className).toBe(pill);
    expect(heading.id).toBe(headingId);
    expect(link).toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
    silent();
  });

  it.each(densities)(
    'gives the band wrapper no motion, transform, hover or pointer-cursor utility at %s density (NC4-08)',
    (size) => {
      render(<NowCard title='Activity' size={size} statusBadge={label} statusPresentation='band' />);
      const wrapper = wrapperOf(screen.getByRole('article', { name: 'Activity' }));
      expect(wrapper.className).not.toMatch(
        /(^|\s)(transition|animate|transform|translate|scale|rotate|hover:|focus|active:|cursor-)/
      );
    }
  );

  it('renders a Badge supplied in the band verbatim, without inspecting or warning about it (NC4-15)', () => {
    const plain = render(<NowCard title='Activity' statusBadge={label} statusPresentation='band' />);
    const plainClass = wrapperOf(plain.container).className;
    plain.unmount();
    const { container } = render(
      <NowCard
        title='Activity'
        statusPresentation='band'
        statusBadge={
          <Badge tone='brand' variant='soft'>
            Building
          </Badge>
        }
      />
    );
    const wrapper = wrapperOf(container);
    const badge = wrapper.querySelector('.eg-badge');
    expect(badge).not.toBeNull();
    expect(wrapper.firstElementChild).toBe(badge);
    expect(wrapper.className).toBe(plainClass);
    silent();
  });

  it('composes WithStatusBand as an md and an sm band, each with a decorative icon and a one-line label (NC4-12)', () => {
    const Story = composeStory(WithStatusBand, meta);
    render(<Story />);
    const articles = screen.getAllByRole('article');
    expect(articles.map((article) => article.getAttribute('data-size'))).toEqual(['md', 'sm']);
    for (const [index, article] of articles.entries()) {
      const wrapper = wrapperOf(article);
      expect(article.firstElementChild).toBe(wrapper);
      expect(wrapper).toHaveClass('uppercase', index === 0 ? 'mx-6' : 'mx-4');
      expect(wrapper.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    }
    expect(screen.getByText('Building')).toBeInTheDocument();
    expect(screen.getByText('Exploring')).toBeInTheDocument();
    silent();
  });
});
