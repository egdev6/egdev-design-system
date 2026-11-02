import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../atoms/button';
import { Link } from '../../atoms/link';
import { CommunityCard, CommunityCardAction, CommunityCardMark } from './CommunityCard';
import { useCommunityCard } from './useCommunityCard';

const body = <p>A community for people who build the web together.</p>;
const injected = (props: Record<string, unknown>) => props as unknown as Parameters<typeof useCommunityCard>[0];

describe('CommunityCard public contract', () => {
  it('normalizes the hook: default rank, data-level, heading id and protected-prop stripping (CC-01)', () => {
    const { result } = renderHook(() =>
      useCommunityCard(
        injected({ title: 'Pulso', role: 'button', 'aria-label': 'hijack', tabIndex: 0, 'aria-labelledby': 'other' }),
        CommunityCardMark
      )
    );
    expect(result.current.valid).toBe(true);
    expect(result.current.headingElement).toBe('h3');
    expect(result.current.rootProps['aria-labelledby']).toBe(result.current.headingProps.id);
    expect(result.current.rootProps.role).toBeUndefined();
    expect(result.current.rootProps['aria-label']).toBeUndefined();
    expect(result.current.rootProps['aria-labelledby']).not.toBe('other');
    expect(result.current.rootProps.tabIndex).toBeUndefined();
    expect(result.current.rootProps['data-level']).toBe(3);
  });

  it('renders a passive article named by its generated heading and honours every rank (CC-01)', () => {
    render(<CommunityCard title='Pulso'>{body}</CommunityCard>);
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article).toHaveClass('eg-community-card');
    expect(article.tagName).toBe('ARTICLE');
    const heading = within(article).getByRole('heading', { name: 'Pulso', level: 3 });
    expect(heading).toHaveClass('text-title-section');
    expect(article).toHaveAttribute('aria-labelledby', heading.id);
  });

  it.each([2, 4, 5, 6] as const)('renders the heading as h%s when level=%s (CC-01)', (level) => {
    render(
      <CommunityCard title='Pulso' level={level}>
        {body}
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article).toHaveAttribute('data-level', String(level));
    expect(within(article).getByRole('heading', { name: 'Pulso', level })).toBeInTheDocument();
  });

  it('warns and renders nothing for a blank title, then recovers (CC-02)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container, rerender } = render(<CommunityCard title='   '>{body}</CommunityCard>);
    expect(container.querySelector('article')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    rerender(<CommunityCard title='Recovered'>{body}</CommunityCard>);
    expect(screen.getByRole('article', { name: 'Recovered' })).toBeInTheDocument();
    warn.mockRestore();
  });

  it('renders the eyebrow as the public Text eyebrow output with its diamond, inside the band only (CC-03)', () => {
    render(
      <CommunityCard title='Pulso' eyebrow='Open community'>
        {body}
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const eyebrow = within(article).getByText('Open community');
    expect(eyebrow.tagName).toBe('P');
    expect(eyebrow).toHaveClass('eg-text', 'text-label-eyebrow');
    expect(eyebrow.className).toContain('before:bg-fg-brand-default');
    const band = article.querySelector('.eg-community-card__band');
    expect(band).toContainElement(eyebrow);
    expect(within(band as HTMLElement).getByText('Open community')).toBeInTheDocument();
  });

  it('renders no top row without eyebrow or mark, while the band still exists (CC-03)', () => {
    render(<CommunityCard title='Pulso'>{body}</CommunityCard>);
    const article = screen.getByRole('article', { name: 'Pulso' });
    const band = article.querySelector('.eg-community-card__band');
    expect(band).not.toBeNull();
    expect(band?.children).toHaveLength(0);
  });

  it('renders a whitespace-only eyebrow as nothing, with no top row (CC-03)', () => {
    render(
      <CommunityCard title='Pulso' eyebrow='   '>
        {body}
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article.querySelector('.eg-community-card__band')?.children).toHaveLength(0);
  });

  it('paints the surface-2 band with top radius and bottom hairline over the surface-1 frame (CC-04)', () => {
    render(
      <CommunityCard title='Pulso'>
        <CommunityCardMark>
          <span role='img' aria-label='Stack and Flow mark'>
            SF
          </span>
        </CommunityCardMark>
        {body}
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const band = article.querySelector('.eg-community-card__band');
    expect(band).toHaveClass('bg-surface-2', 'border-b', 'border-border-hairline', 'rounded-t-xl');
    expect(band).not.toHaveClass('bg-surface-1');
    expect(article).toHaveClass('bg-surface-1');
    expect(article).not.toHaveClass('bg-surface-2');
  });

  it('hoists the mark into the band top row after the eyebrow and keeps it out of the body flow (CC-05)', () => {
    render(
      <CommunityCard title='Pulso' eyebrow='Open community'>
        {body}
        <CommunityCardMark>
          <span role='img' aria-label='Stack and Flow mark'>
            SF
          </span>
        </CommunityCardMark>
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const band = article.querySelector('.eg-community-card__band') as HTMLElement;
    const slot = band.querySelector('.eg-community-card__mark');
    expect(slot).not.toBeNull();
    const mark = within(slot as HTMLElement).getByRole('img', { name: 'Stack and Flow mark' });
    expect(slot).toContainElement(mark);
    const eyebrow = within(band).getByText('Open community');
    // DOM order equals visual order: role line first, mark trailing.
    expect(eyebrow.compareDocumentPosition(slot as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // The mark never renders inside the body flow.
    const bodyZone = article.querySelector('p');
    expect((bodyZone?.compareDocumentPosition(slot as Node) ?? 0) & Node.DOCUMENT_POSITION_CONTAINED_BY).toBeFalsy();
  });

  it('renders a named mark as content and a decorative mark outside the accessible name (CC-05)', () => {
    const { unmount } = render(
      <CommunityCard title='Pulso'>
        <CommunityCardMark>
          <img src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' alt='Gentleman Programming' />
        </CommunityCardMark>
        {body}
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(within(article).getByRole('img', { name: 'Gentleman Programming' })).toBeInTheDocument();
    unmount();

    render(
      <CommunityCard title='Pulso'>
        <CommunityCardMark>
          <img src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' alt='' />
        </CommunityCardMark>
        {body}
      </CommunityCard>
    );
    const articleTwo = screen.getByRole('article', { name: 'Pulso' });
    // A decorative image never takes the img role and never joins the card name.
    expect(within(articleTwo).queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByRole('article', { name: 'Pulso' })).toBeInTheDocument();
  });

  it('renders the top row with the single supplied child, mark only or eyebrow only (CC-05)', () => {
    const { unmount } = render(
      <CommunityCard title='Pulso'>
        <CommunityCardMark>
          <span role='img' aria-label='Stack and Flow mark'>
            SF
          </span>
        </CommunityCardMark>
        {body}
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const topRow = article.querySelector('.eg-community-card__band')?.children[0] as HTMLElement;
    expect(topRow.children).toHaveLength(1);
    expect(topRow.querySelector('.eg-community-card__mark')).not.toBeNull();
    unmount();

    render(
      <CommunityCard title='Pulso' eyebrow='Open community'>
        {body}
      </CommunityCard>
    );
    const articleTwo = screen.getByRole('article', { name: 'Pulso' });
    const topRowTwo = articleTwo.querySelector('.eg-community-card__band')?.children[0] as HTMLElement;
    expect(topRowTwo.children).toHaveLength(1);
    expect(topRowTwo.querySelector('.eg-community-card__mark')).toBeNull();
  });

  it('keeps a non-interactive mark out of the tab order (CC-05, CC-07)', async () => {
    const user = userEvent.setup();
    render(
      <CommunityCard title='Pulso'>
        <CommunityCardMark>
          <span role='img' aria-label='Stack and Flow mark'>
            SF
          </span>
        </CommunityCardMark>
        {body}
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </CommunityCard>
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Join the Discord' }));
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });

  it('wraps long content at a narrow host with no truncation classes (CC-06)', () => {
    const longTitle = 'A very long community name that must wrap across several lines inside a narrow card';
    render(
      <div className='w-48'>
        <CommunityCard title={longTitle} eyebrow='Open community'>
          <p>
            A long body paragraph describing the community, its weekly calls and how new members join, written so every
            line wraps at word boundaries without ever being clamped.
          </p>
          <CommunityCardAction>
            <Button>Join the Discord</Button>
          </CommunityCardAction>
        </CommunityCard>
      </div>
    );
    const article = screen.getByRole('article', { name: longTitle });
    const action = article.querySelector('.eg-community-card__action') as HTMLElement;
    // Consumer-supplied action content keeps its own approved recipes (e.g. the Button atom's nowrap).
    const ownParts = [article, ...article.querySelectorAll('*')].filter(
      (element) => !action.contains(element) || element === action
    );
    for (const element of ownParts) {
      for (const cls of element.classList) {
        expect(cls.startsWith('truncate')).toBe(false);
        expect(cls.startsWith('line-clamp')).toBe(false);
        expect(cls.startsWith('whitespace-nowrap')).toBe(false);
      }
    }
    const bodyZone = article.children[1];
    expect(bodyZone?.children[0]?.tagName).toBe('H3');
    expect(bodyZone?.children[1]?.tagName).toBe('P');
    expect(bodyZone?.children[2]?.classList.contains('eg-community-card__action')).toBe(true);
  });

  it('hosts exactly one supplied action pinned to the bottom edge as the only tab stop (CC-07)', async () => {
    const user = userEvent.setup();
    render(
      <CommunityCard title='Pulso'>
        {body}
        <CommunityCardAction>
          <Link href='#pulso'>Join the Discord</Link>
        </CommunityCardAction>
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const action = article.querySelector('.eg-community-card__action');
    expect(action).toHaveClass('mt-auto');
    expect(action).toContainElement(screen.getByRole('link', { name: 'Join the Discord' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Join the Discord' }));
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });

  it('has no hover paint, no pointer cursor and no built-in width, and merges className last (CC-08)', () => {
    const { unmount } = render(<CommunityCard title='Pulso'>{body}</CommunityCard>);
    const plain = screen.getByRole('article', { name: 'Pulso' });
    for (const cls of plain.classList) {
      expect(cls.startsWith('w-')).toBe(false);
    }
    unmount();

    render(
      <CommunityCard title='Pulso' className='w-96'>
        {body}
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article).toHaveClass('w-96');
    const ownParts = [article, ...article.querySelectorAll('*')];
    for (const element of ownParts) {
      for (const cls of element.classList) {
        expect(cls.startsWith('hover:')).toBe(false);
        expect(cls).not.toBe('cursor-pointer');
        if (cls.startsWith('transition')) {
          expect(cls).toBe('transition-none');
        }
      }
    }
  });

  it('keeps the root border-box so the consumer width contains the band (G7a)', () => {
    render(<CommunityCard title='Pulso'>{body}</CommunityCard>);
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article).toHaveClass('box-border');
    // The band stays inside the rounded frame.
    expect(article).toHaveClass('overflow-hidden');
  });

  it('partitions children once: the first hoisted marks are the mark parts, the rest stay in order (CC-05)', () => {
    render(
      <CommunityCard title='Pulso' eyebrow='Open community'>
        <>
          {body}
          <CommunityCardMark>
            <span role='img' aria-label='First mark'>
              A
            </span>
          </CommunityCardMark>
        </>
      </CommunityCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const band = article.querySelector('.eg-community-card__band') as HTMLElement;
    expect(band.querySelectorAll('.eg-community-card__mark')).toHaveLength(1);
    expect(within(band).getByRole('img', { name: 'First mark' })).toBeInTheDocument();
  });
});
