import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Badge } from '../../atoms/badge';
import { Link } from '../../atoms/link';
import { NowCard, NowCardBody, NowCardDetail, NowCardFooter } from '../../molecules/now-card';
import { NowStrip } from './index';

const cards = (
  <>
    <NowCard title='First' size='sm' statusBadge={<Badge>Building</Badge>}>
      <NowCardBody>
        <p>Long consumer copy stays visible.</p>
      </NowCardBody>
      <NowCardFooter>
        <NowCardDetail>
          Next <b>today</b>
        </NowCardDetail>
        <Link href='#first'>Open first</Link>
      </NowCardFooter>
    </NowCard>
    {null}
    {false}
    <NowCard title='Second' size='sm'>
      <NowCardBody>
        <p>Second copy</p>
      </NowCardBody>
    </NowCard>
  </>
);

describe('NowStrip public contract', () => {
  it('names multiple groups by unique visible labels and retains IDs on rerender (NS-01)', () => {
    const { rerender } = render(
      <>
        <NowStrip label='Current'>{cards}</NowStrip>
        <NowStrip label='Other'>{null}</NowStrip>
      </>
    );
    const first = screen.getByRole('group', { name: 'Current' });
    const second = screen.getByRole('group', { name: 'Other' });
    const id = first.getAttribute('aria-labelledby');
    expect(id).toBeTruthy();
    expect(id).not.toBe(second.getAttribute('aria-labelledby'));
    expect(document.getElementById(id ?? '')).toHaveTextContent('Current');
    rerender(
      <>
        <NowStrip label='Updated'>{cards}</NowStrip>
        <NowStrip label='Other'>{null}</NowStrip>
      </>
    );
    expect(screen.getByRole('group', { name: 'Updated' })).toHaveAttribute('aria-labelledby', id);
    expect(second.lastElementChild).toBeEmptyDOMElement();
  });

  it('suppresses blank labels and their children with a development warning (NS-01)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
      // The warning is asserted below.
    });
    const { container, rerender } = render(<NowStrip label=''>{cards}</NowStrip>);
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalled();
    warn.mockClear();
    rerender(<NowStrip label='  '>{cards}</NowStrip>);
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('preserves real cards, badge order, density, content and direct order (NS-02, NS-05, NS-07)', () => {
    render(<NowStrip label='Current'>{cards}</NowStrip>);
    const group = screen.getByRole('group', { name: 'Current' });
    const articles = within(group).getAllByRole('article');
    expect(articles.map((article) => article.getAttribute('data-size'))).toEqual(['sm', 'sm']);
    expect(articles.map((article) => within(article).getByRole('heading').textContent)).toEqual(['First', 'Second']);
    const first = within(group).getByRole('article', { name: 'First' });
    expect(first.parentElement?.children).toHaveLength(2);
    expect(first.firstElementChild).toHaveTextContent('Building');
    expect(within(first).getByText('Long consumer copy stays visible.')).toBeInTheDocument();
    expect(within(first).getByText('Next')).toBeInTheDocument();
    expect(within(group).queryByRole('meter')).not.toBeInTheDocument();
  });

  it('uses a decorative static live dot and child-owned keyboard interaction (NS-03, NS-05)', async () => {
    const user = userEvent.setup();
    render(<NowStrip label='Current'>{cards}</NowStrip>);
    const group = screen.getByRole('group', { name: 'Current' });
    const dot = group.querySelector('[data-state="live"]');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot?.className).not.toContain('animate-');
    expect(group).not.toHaveAttribute('aria-live');
    expect(group).not.toHaveAttribute('tabindex');
    await user.tab();
    const link = screen.getByRole('link', { name: 'Open first' });
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute('href', '#first');
    await user.tab();
    expect(link).not.toHaveFocus();
  });

  it('uses the approved static part utilities and no legacy internal markers (NS-04, NS-06)', () => {
    render(<NowStrip label='Current'>{cards}</NowStrip>);
    const group = screen.getByRole('group', { name: 'Current' });
    expect(group).toHaveClass(
      'eg-now-strip',
      'm-0',
      'pb-6',
      'border-b-[length:var(--border-width)]',
      '[border-bottom-style:solid]',
      'border-b-border-hairline'
    );
    const label = document.getElementById(group.getAttribute('aria-labelledby') ?? '');
    expect(label).toHaveClass(
      'm-0',
      'mb-3',
      'flex',
      'items-center',
      'gap-2',
      'font-display',
      'text-meta',
      'uppercase',
      'text-fg-secondary'
    );
    expect(group.lastElementChild).toHaveClass(
      'grid',
      'grid-cols-3',
      'gap-5',
      'items-stretch',
      '[@media(width<=860px)]:grid-cols-1'
    );
    expect(group.querySelector('[class*="eg-now-strip__"]')).toBeNull();
  });

  it('forwards compatible native props and protects semantics against untyped inputs (NS-08)', () => {
    const unsafe = {
      role: 'status',
      'aria-label': 'Wrong',
      'aria-labelledby': 'wrong',
      'aria-live': 'polite',
      tabIndex: 0,
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: 'wrong' }
    } as unknown as ComponentPropsWithoutRef<typeof NowStrip>;
    render(
      <NowStrip {...unsafe} label='Current' data-example='forwarded' className='m-4 w-full'>
        {null}
      </NowStrip>
    );
    const group = screen.getByRole('group', { name: 'Current' });
    expect(group).toHaveAttribute('data-example', 'forwarded');
    expect(group).toHaveClass('m-4', 'w-full');
    expect(group).not.toHaveClass('m-0');
    expect(group).not.toHaveAttribute('aria-label');
    expect(group).not.toHaveAttribute('aria-live');
    expect(group).not.toHaveAttribute('tabindex');
    expect(group).not.toHaveAttribute('style');
    expect(group).not.toHaveTextContent('wrong');
  });
});
