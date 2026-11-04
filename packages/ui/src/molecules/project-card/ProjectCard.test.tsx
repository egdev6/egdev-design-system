import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Link } from '../../atoms/link';
import {
  ProjectCard,
  ProjectCardBackdrop,
  ProjectCardCode,
  ProjectCardFooter,
  ProjectCardMark,
  ProjectCardTags
} from './ProjectCard';
import type { ProjectCardCodeLine } from './types';
import { useProjectCard } from './useProjectCard';

const body = <p>Ship autonomous agents for the web.</p>;
const injected = (props: Record<string, unknown>) => props as unknown as Parameters<typeof useProjectCard>[0];

describe('ProjectCard public contract', () => {
  it('normalizes the hook: default rank, data hooks, heading id and protected-prop stripping (PC-01)', () => {
    const { result } = renderHook(() =>
      useProjectCard(injected({ title: 'Pulso', role: 'button', 'aria-label': 'hijack', tabIndex: 0 }))
    );
    expect(result.current.valid).toBe(true);
    expect(result.current.headingElement).toBe('h3');
    expect(result.current.rootProps['aria-labelledby']).toBe(result.current.headingProps.id);
    expect(result.current.rootProps.role).toBeUndefined();
    expect(result.current.rootProps['aria-label']).toBeUndefined();
    expect(result.current.rootProps.tabIndex).toBeUndefined();
    expect(result.current.rootProps['data-variant']).toBe('default');
    expect(result.current.rootProps['data-size']).toBe('md');
  });

  it('renders a passive article named by its generated heading and honours every rank (PC-01)', () => {
    render(<ProjectCard title='Pulso'>{body}</ProjectCard>);
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article).toHaveClass('eg-project-card');
    const heading = within(article).getByRole('heading', { name: 'Pulso', level: 3 });
    expect(article).toHaveAttribute('aria-labelledby', heading.id);
  });

  it.each([2, 4, 5, 6] as const)('renders the heading as h%s when level=%s (PC-01)', (level) => {
    render(
      <ProjectCard title='Pulso' level={level}>
        {body}
      </ProjectCard>
    );
    expect(screen.getByRole('heading', { name: 'Pulso', level })).toBeInTheDocument();
  });

  it('warns and renders nothing for a blank title, then recovers (PC-02)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container, rerender } = render(<ProjectCard title='   '>{body}</ProjectCard>);
    expect(container.querySelector('article')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    rerender(<ProjectCard title='Recovered'>{body}</ProjectCard>);
    expect(screen.getByRole('article', { name: 'Recovered' })).toBeInTheDocument();
    warn.mockRestore();
  });

  it('renders the index aria-hidden and the eyebrow only when supplied, out of the name (PC-03)', () => {
    render(
      <ProjectCard title='Pulso' index='01' eyebrow='Open source'>
        {body}
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article.querySelector('span[aria-hidden="true"]')).toHaveTextContent('01');
    expect(within(article).getByText('Open source')).toBeInTheDocument();
  });

  it('preserves the exact no-part markup', () => {
    const props = { title: 'Pulso', index: '01', eyebrow: 'Open source', children: body };
    function PreviousCard() {
      const {
        rootProps,
        headingElement: Heading,
        headingProps,
        title,
        index,
        indexProps,
        eyebrow,
        eyebrowProps,
        children
      } = useProjectCard(props);
      return (
        <article {...rootProps}>
          {index !== null && <span {...indexProps}>{index}</span>}
          {eyebrow !== null && <span {...eyebrowProps}>{eyebrow}</span>}
          <Heading {...headingProps}>{title}</Heading>
          {children}
        </article>
      );
    }
    expect(renderToStaticMarkup(<ProjectCard {...props} />)).toBe(renderToStaticMarkup(<PreviousCard />));
  });

  it('keeps the eyebrow exposed and index hidden', () => {
    render(<ProjectCard title='Pulso' index='01' eyebrow='Open source' />);
    expect(screen.getByText('Open source')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByText('01')).toHaveAttribute('aria-hidden', 'true');
  });

  it('places decorative backdrop and trailing mark in the upper zone with one scrim', async () => {
    const user = userEvent.setup();
    render(
      <ProjectCard title='Pulso' index='01' eyebrow='Open source'>
        <p>
          Body <a href='#body'>Body link</a>
        </p>
        <ProjectCardBackdrop data-example='background'>
          <img src='/backdrop.png' alt='' />
        </ProjectCardBackdrop>
        <ProjectCardMark data-example='mark'>
          <img src='/mark.png' alt='Mark' />
        </ProjectCardMark>
        <ProjectCardFooter>
          <a href='#footer'>Footer link</a>
        </ProjectCardFooter>
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const backdrop = article.querySelector('[data-example="background"]') as HTMLElement;
    const mark = article.querySelector('[data-example="mark"]') as HTMLElement;
    const upper = backdrop.parentElement as HTMLElement;
    expect(upper).toHaveClass('isolate', 'overflow-hidden');
    expect(upper).toContainElement(screen.getByText('01'));
    expect(upper).toContainElement(screen.getByRole('heading', { name: 'Pulso' }));
    expect(upper).toContainElement(mark);
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop.querySelector('img')).toHaveAttribute('alt', '');
    expect(backdrop).toHaveClass('pointer-events-none');
    expect(backdrop).toHaveClass('[&>img]:object-cover');
    expect(mark).toHaveClass('max-w-[calc(var(--space-24)*2)]');
    expect(upper.querySelectorAll('.bg-\\[var\\(--color-alpha-black-42\\)\\]')).toHaveLength(1);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Body link' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Footer link' })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('keeps the first duplicate part and warns in development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <ProjectCard title='Pulso'>
        <ProjectCardBackdrop>
          <img src='/first.png' alt='' />
        </ProjectCardBackdrop>
        <ProjectCardBackdrop>
          <img src='/second.png' alt='' />
        </ProjectCardBackdrop>
        <ProjectCardMark>
          <span>First mark</span>
        </ProjectCardMark>
        <ProjectCardMark>
          <span>Second mark</span>
        </ProjectCardMark>
      </ProjectCard>
    );
    expect(document.querySelector('img[src="/first.png"]')).not.toBeNull();
    expect(document.querySelector('img[src="/second.png"]')).toBeNull();
    expect(screen.getByText('First mark')).toBeInTheDocument();
    expect(screen.queryByText('Second mark')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it('omits index and eyebrow placeholder boxes when both are absent (PC-03)', () => {
    render(<ProjectCard title='Pulso'>{body}</ProjectCard>);
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article.querySelector('span[aria-hidden="true"]')).toBeNull();
    expect(within(article).queryByText('Open source')).toBeNull();
  });

  it('paints the featured signature without changing anatomy (PC-04)', () => {
    render(
      <>
        <ProjectCard title='Default card'>{body}</ProjectCard>
        <ProjectCard title='Featured card' variant='featured'>
          {body}
        </ProjectCard>
      </>
    );
    const featured = screen.getByRole('article', { name: 'Featured card' });
    const regular = screen.getByRole('article', { name: 'Default card' });
    expect(featured).toHaveAttribute('data-variant', 'featured');
    expect(featured.classList.contains('border-border-brand')).toBe(true);
    expect(featured.classList.contains('shadow-[var(--shadow-hot)]')).toBe(true);
    expect(regular.classList.contains('border-border-brand')).toBe(false);
    expect(regular.classList.contains('shadow-[var(--shadow-hot)]')).toBe(false);
    expect(featured.children.length).toBe(regular.children.length);
  });

  it('applies the sm density steps and still renders the code block (PC-05)', () => {
    const lines: ProjectCardCodeLine[] = [{ text: 'pnpm install' }];
    render(
      <>
        <ProjectCard title='Regular size'>
          <ProjectCardCode label='Install' items={lines} />
        </ProjectCard>
        <ProjectCard title='Compact size' size='sm'>
          <ProjectCardCode label='Install' items={lines} />
        </ProjectCard>
      </>
    );
    const md = screen.getByRole('article', { name: 'Regular size' });
    const sm = screen.getByRole('article', { name: 'Compact size' });
    expect(md).toHaveAttribute('data-size', 'md');
    expect(sm).toHaveAttribute('data-size', 'sm');
    expect(sm).toHaveClass('gap-3');
    expect(within(sm).getByRole('heading', { name: 'Compact size' })).toHaveClass('text-body-large');
    expect(within(md).getByRole('heading', { name: 'Regular size' })).toHaveClass('text-heading-small');
    expect(within(sm).getByRole('generic', { name: 'Install' }).tagName).toBe('PRE');
  });

  it('renders tags as a real list of static chips with no interactive control (PC-06)', () => {
    render(<ProjectCardTags items={['React', 'Vitest']} />);
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    for (const item of items) {
      expect(item.querySelector('.eg-chip')).not.toBeNull();
      expect(item.querySelector('button')).toBeNull();
      expect(item.querySelector('[aria-pressed]')).toBeNull();
    }
  });

  it('renders an empty tag list when items is empty (PC-06)', () => {
    render(<ProjectCardTags items={[]} />);
    expect(screen.getByRole('list').children).toHaveLength(0);
  });

  it('keeps smaller positive token padding in sm instead of erasing the Surface padding (PC-05)', () => {
    render(
      <>
        <ProjectCard title='Regular padding'>
          <p>Body</p>
        </ProjectCard>
        <ProjectCard title='Compact padding' size='sm'>
          <p>Body</p>
        </ProjectCard>
      </>
    );
    const md = screen.getByRole('article', { name: 'Regular padding' });
    const sm = screen.getByRole('article', { name: 'Compact padding' });
    expect(md).toHaveClass('p-6');
    expect(md).not.toHaveClass('p-0', 'p-3');
    expect(sm).toHaveClass('p-3');
    expect(sm).not.toHaveClass('p-0', 'p-6');
  });

  it('names the code pre by label and keeps prompt glyphs decorative (PC-07)', () => {
    const lines: ProjectCardCodeLine[] = [{ text: 'pnpm install' }, { text: '# requires Node 20', kind: 'comment' }];
    render(<ProjectCardCode label='Install commands' items={lines} />);
    const pre = screen.getByRole('generic', { name: 'Install commands' });
    expect(pre.tagName).toBe('PRE');
    expect(pre).toHaveAttribute('aria-label', 'Install commands');
    expect(pre).toHaveClass('eg-project-card__code');
    const glyphs = pre.querySelectorAll('span[aria-hidden="true"]');
    expect(glyphs).toHaveLength(1);
    expect(glyphs[0]).toHaveTextContent('$');
    expect(within(pre).getByText('# requires Node 20')).toBeInTheDocument();
    expect(within(pre).getByText('pnpm install')).toBeInTheDocument();
  });

  it('exposes exactly one tab stop: the supplied footer link (PC-08)', async () => {
    const user = userEvent.setup();
    render(
      <ProjectCard title='Pulso'>
        {body}
        <ProjectCardFooter>
          <Link href='#pulso' variant='underlined'>
            View project
          </Link>
        </ProjectCardFooter>
      </ProjectCard>
    );
    const footer = screen.getByRole('article', { name: 'Pulso' }).querySelector('.eg-project-card__foot');
    expect(footer).not.toBeNull();
    expect(footer).toContainElement(screen.getByRole('link', { name: 'View project' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'View project' }));
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });

  it('wraps long content in a narrow host without truncation, clamping or reordering (PC-09)', () => {
    const longTitle = 'A very long project title that must wrap across several lines inside a narrow card';
    render(
      <div className='w-48'>
        <ProjectCard title={longTitle} index='01' eyebrow='Open source'>
          <p>A long body paragraph that keeps wrapping at word boundaries without ever being clamped.</p>
          <ProjectCardTags items={['React', 'TypeScript', 'Vitest', 'Storybook', 'Tailwind', 'Radix']} />
          <ProjectCardFooter>
            <Link href='#pulso' variant='underlined'>
              View project
            </Link>
          </ProjectCardFooter>
        </ProjectCard>
      </div>
    );
    const article = screen.getByRole('article', { name: longTitle });
    // Chip's own approved recipe keeps a single pill label on one line; the card itself adds no truncation.
    const ownParts = [article, ...article.querySelectorAll('*')].filter((el) => !el.classList.contains('eg-chip'));
    for (const element of ownParts) {
      for (const cls of element.classList) {
        expect(cls).not.toMatch(/^(truncate|line-clamp|text-ellipsis|overflow-hidden|whitespace-nowrap)/);
      }
    }
    expect(article.children[0]).toHaveTextContent('01');
    expect(article.children[1]).toHaveTextContent('Open source');
    expect(article.children[2]?.tagName).toBe('H3');
    expect(article.children[3]?.tagName).toBe('P');
    expect(article.children[4]?.tagName).toBe('UL');
    expect(article.children[5]?.classList.contains('eg-project-card__foot')).toBe(true);
  });

  it('keeps the root border-box and passive on hover (G7a, OQ-4)', () => {
    render(<ProjectCard title='Pulso'>{body}</ProjectCard>);
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article).toHaveClass('box-border', 'transform-none', 'transition-none');
    for (const cls of article.classList) {
      expect(cls.startsWith('hover:')).toBe(false);
      if (cls.startsWith('transition')) {
        expect(cls).toBe('transition-none');
      }
      expect(cls).not.toBe('cursor-pointer');
    }
  });
});
