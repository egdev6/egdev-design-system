import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Badge } from '../../atoms/badge';
import { IconButton } from '../../atoms/icon-button';
import { Link } from '../../atoms/link';
import { NowCard, NowCardBody, NowCardDetail, NowCardFooter } from './NowCard';
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
        expect(element?.className).not.toMatch(/(^|\s)(transition|animate-|motion-safe|hover:|cursor-pointer)/);
      }
      expect(matchMedia.mock.calls.every(([query]) => typeof query === 'string')).toBe(true);
      expect(screen.getByRole('article', { name: 'Currently building' })).toBeInTheDocument();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('keeps every surface-composed element border-box so consumer widths contain the frame (G7a)', () => {
    const { container } = render(fullCard);
    expect(container.querySelector('.eg-now-card')).toHaveClass('box-border');
    expect(container.querySelector('.eg-now-card__foot')).toHaveClass('box-border');
    expect(container.querySelector('.eg-now-card__foot')).toHaveClass('border-x-0', 'border-b-0', 'shadow-none');
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
