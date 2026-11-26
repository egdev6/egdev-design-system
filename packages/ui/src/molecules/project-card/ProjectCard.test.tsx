import { composeStory } from '@storybook/react-vite';
import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Badge } from '../../atoms/badge';
import { Icon } from '../../atoms/icon';
import { Link } from '../../atoms/link';
import {
  ProjectCard,
  ProjectCardBackdrop,
  ProjectCardCode,
  ProjectCardFooter,
  ProjectCardMark,
  ProjectCardTags
} from './ProjectCard';
import meta, { StatusInNarrowCard, StatusOverBackdrop, StatusPlacements, WithStatus } from './ProjectCard.stories';
import type { ProjectCardCodeLine, ProjectCardProps } from './types';
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

/** The warning "testing" status of the #558 Lab experiment card. */
const status = (
  <Badge tone='warning' icon={<Icon name='alert' />}>
    testing
  </Badge>
);

/** The card-owned status wrapper; fails with a plain assertion, not a TypeError, while it is absent. */
function statusWrapper(article: HTMLElement): HTMLElement {
  const wrapper = article.querySelector<HTMLElement>('.eg-project-card__badge');
  expect(wrapper, 'the .eg-project-card__badge wrapper').not.toBeNull();
  return wrapper as HTMLElement;
}

/** Header row, lead group and status wrapper never carry interaction, motion, reorder or truncation utilities. */
function expectInert(element: Element) {
  expect(element.tagName).toBe('DIV');
  expect(element.hasAttribute('tabindex')).toBe(false);
  for (const cls of element.classList) {
    expect(cls).not.toMatch(/(^|:)(hover|focus|focus-visible|active|group-hover):/);
    expect(cls).not.toMatch(/^(transition|duration|ease-|animate-|cursor-|order-)/);
    expect(cls).not.toMatch(/^(truncate|line-clamp|text-ellipsis|overflow-|whitespace-nowrap)/);
  }
}

/** Ids come from useId, so two DOM renders differ only by them. */
const withoutIds = (html: string) => html.replace(/\s(id|aria-labelledby)="[^"]*"/g, ' $1="_"');

/** The ProjectCard JSX before the status slot existed: the oracle for "renders exactly as before". */
function PreviousCard(props: ProjectCardProps) {
  const {
    rootProps,
    headingElement: Heading,
    headingProps,
    title,
    index,
    indexProps,
    eyebrow,
    eyebrowProps,
    children,
    backdrop,
    mark,
    upperClassName,
    upperContentClassName,
    scrimClassName
  } = useProjectCard(props, { backdrop: ProjectCardBackdrop, mark: ProjectCardMark });
  return (
    <article {...rootProps}>
      {backdrop || mark ? (
        <div className={upperClassName}>
          {backdrop}
          {backdrop && <div aria-hidden='true' className={scrimClassName} />}
          <div className={upperContentClassName}>
            {mark}
            {index !== null && <span {...indexProps}>{index}</span>}
            {eyebrow !== null && <span {...eyebrowProps}>{eyebrow}</span>}
            <Heading {...headingProps}>{title}</Heading>
          </div>
        </div>
      ) : (
        <>
          {index !== null && <span {...indexProps}>{index}</span>}
          {eyebrow !== null && <span {...eyebrowProps}>{eyebrow}</span>}
          <Heading {...headingProps}>{title}</Heading>
        </>
      )}
      {children}
    </article>
  );
}

describe('ProjectCard header-row status (#558)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('places the status in one badge wrapper in the header row, after the index and eyebrow and before the heading (PC-S1)', () => {
    render(
      <ProjectCard title='OpenDesign × Gentle AI' index='014' eyebrow='Experiment' statusBadge={status}>
        {body}
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'OpenDesign × Gentle AI' });
    expect(article.querySelectorAll('.eg-project-card__badge')).toHaveLength(1);
    const wrapper = statusWrapper(article);
    const row = wrapper.parentElement as HTMLElement;
    const index = screen.getByText('014');
    const eyebrow = screen.getByText('Experiment');
    const heading = screen.getByRole('heading', { name: 'OpenDesign × Gentle AI' });
    expect(row.parentElement).toBe(article);
    expect(row).toContainElement(index);
    expect(row).toContainElement(eyebrow);
    expect(row).not.toContainElement(heading);
    expect(index.compareDocumentPosition(wrapper)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(eyebrow.compareDocumentPosition(wrapper)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(wrapper.compareDocumentPosition(heading)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(within(wrapper).getByText('testing')).toHaveAttribute('data-tone', 'warning');
  });

  it.each(
    (['plain', 'upper zone'] as const).flatMap((branch) =>
      [undefined, null, true, false].map((statusBadge) => ({ branch, statusBadge }))
    )
  )(
    'renders exactly the previous markup in the $branch branch when statusBadge is $statusBadge (PC-S2)',
    ({ branch, statusBadge }) => {
      const props: ProjectCardProps =
        branch === 'plain'
          ? { title: 'Pulso', index: '01', eyebrow: 'Open source', children: body }
          : {
              title: 'Pulso',
              index: '01',
              eyebrow: 'Open source',
              children: (
                <>
                  {body}
                  <ProjectCardBackdrop>
                    <img src='/backdrop.png' alt='' />
                  </ProjectCardBackdrop>
                  <ProjectCardMark>
                    <img src='/mark.png' alt='Mark' />
                  </ProjectCardMark>
                </>
              )
            };
      const markup = renderToStaticMarkup(<ProjectCard {...props} statusBadge={statusBadge} />);
      expect(markup).toBe(renderToStaticMarkup(<PreviousCard {...props} />));
      expect(markup).not.toContain('eg-project-card__badge');
    }
  );

  it('treats 0 as present and renders it verbatim, with no content inspection (PC-S2)', () => {
    render(
      <ProjectCard title='Pulso' statusBadge={0}>
        {body}
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(statusWrapper(article)).toHaveTextContent(/^0$/);
  });

  it('restores the previous markup when the status is removed on rerender, with no stale row or marker (PC-S2)', () => {
    const props = { title: 'Pulso', index: '01', eyebrow: 'Open source' };
    const { container, rerender } = render(
      <ProjectCard {...props} statusBadge={status}>
        {body}
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(statusWrapper(article)).toBeInTheDocument();
    rerender(<ProjectCard {...props}>{body}</ProjectCard>);
    expect(container.querySelector('.eg-project-card__badge')).toBeNull();
    expect(Array.from(article.children, (child) => child.tagName)).toEqual(['SPAN', 'SPAN', 'H3', 'P']);
    const fresh = render(<ProjectCard {...props}>{body}</ProjectCard>);
    expect(withoutIds(container.innerHTML)).toBe(withoutIds(fresh.container.innerHTML));
    rerender(
      <ProjectCard {...props} statusBadge={status}>
        {body}
      </ProjectCard>
    );
    expect(container.querySelectorAll('.eg-project-card__badge')).toHaveLength(1);
  });

  it.each([
    { label: 'index and eyebrow', props: { index: '014', eyebrow: 'Experiment' }, lead: ['014', 'Experiment'] },
    { label: 'index only', props: { index: '014' }, lead: ['014'] },
    { label: 'eyebrow only', props: { eyebrow: 'Experiment' }, lead: ['Experiment'] },
    { label: 'blank index and eyebrow', props: { index: '  ', eyebrow: ' ' }, lead: [] },
    { label: 'neither', props: {}, lead: [] }
  ] satisfies { label: string; props: Pick<ProjectCardProps, 'index' | 'eyebrow'>; lead: string[] }[])(
    'builds the row for $label: a lead group only with content and the status last at the inline end (PC-S3)',
    ({ props, lead }) => {
      render(
        <ProjectCard title='Pulso' {...props} statusBadge={status}>
          {body}
        </ProjectCard>
      );
      const article = screen.getByRole('article', { name: 'Pulso' });
      const wrapper = statusWrapper(article);
      const row = wrapper.parentElement as HTMLElement;
      expect(row.parentElement).toBe(article);
      expect(row.lastElementChild).toBe(wrapper);
      if (lead.length === 0) {
        expect(row.children).toHaveLength(1);
      } else {
        expect(row.children).toHaveLength(2);
        const group = row.firstElementChild as HTMLElement;
        expect(Array.from(group.children, (child) => child.textContent)).toEqual(lead);
        expect(group).toHaveClass('flex-col');
      }
      expect(row).toHaveClass('self-stretch');
      expect(wrapper).toHaveClass('ms-auto');
      for (const cls of wrapper.classList) {
        expect(cls).not.toMatch(/^-?(ml|mr)-/);
      }
    }
  );

  it('puts the row between the mark and the heading in the upper zone, with one scrim and no duplicate (PC-S4)', () => {
    render(
      <ProjectCard title='Pulso' index='01' eyebrow='Open source' statusBadge={status}>
        <p>Body copy</p>
        <ProjectCardBackdrop data-example='background'>
          <img src='/backdrop.png' alt='' />
        </ProjectCardBackdrop>
        <ProjectCardMark data-example='mark'>
          <img src='/mark.png' alt='Mark' />
        </ProjectCardMark>
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const backdrop = article.querySelector('[data-example="background"]') as HTMLElement;
    const mark = article.querySelector('[data-example="mark"]') as HTMLElement;
    const upper = backdrop.parentElement as HTMLElement;
    const content = mark.parentElement as HTMLElement;
    const heading = screen.getByRole('heading', { name: 'Pulso' });
    const row = statusWrapper(article).parentElement as HTMLElement;
    expect(upper).toContainElement(row);
    expect(row.parentElement).toBe(content);
    expect(content.children).toHaveLength(3);
    expect(content.children[0]).toBe(mark);
    expect(content.children[1]).toBe(row);
    expect(content.children[2]).toBe(heading);
    expect(upper.querySelectorAll('.bg-\\[var\\(--color-alpha-black-42\\)\\]')).toHaveLength(1);
    expect(article.querySelectorAll('.eg-project-card__badge')).toHaveLength(1);
    expect(screen.getAllByText('testing')).toHaveLength(1);
    expect(upper).not.toContainElement(screen.getByText('Body copy'));
  });

  it.each(['backdrop', 'mark'] as const)('puts the row in the upper zone of a %s-only card (PC-S4)', (part) => {
    const Part = part === 'backdrop' ? ProjectCardBackdrop : ProjectCardMark;
    render(
      <ProjectCard title='Pulso' index='01' statusBadge={status}>
        <Part data-example='part'>
          <img src='/part.png' alt={part === 'mark' ? 'Mark' : ''} />
        </Part>
        <p>Body copy</p>
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    const upper = article.firstElementChild as HTMLElement;
    const row = statusWrapper(article).parentElement as HTMLElement;
    expect(upper).toContainElement(row);
    expect(upper).toContainElement(screen.getByRole('heading', { name: 'Pulso' }));
    expect(upper).not.toContainElement(screen.getByText('Body copy'));
    expect(upper.querySelectorAll('.bg-\\[var\\(--color-alpha-black-42\\)\\]')).toHaveLength(
      part === 'backdrop' ? 1 : 0
    );
  });

  it('keeps first-part-wins for duplicate backdrops and marks when a status is supplied (PC-S4)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <ProjectCard title='Pulso' statusBadge={status}>
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
    expect(document.querySelectorAll('.eg-project-card__badge')).toHaveLength(1);
  });

  it('names the article by the heading alone and exposes the status as plain visible text (PC-S5)', () => {
    render(
      <ProjectCard title='OpenDesign × Gentle AI' index='014' eyebrow='Experiment' statusBadge={status}>
        {body}
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'OpenDesign × Gentle AI' });
    const heading = screen.getByRole('heading', { name: 'OpenDesign × Gentle AI' });
    expect(article).toHaveAttribute('aria-labelledby', heading.id);
    const wrapper = statusWrapper(article);
    const row = wrapper.parentElement as HTMLElement;
    const lead = row.firstElementChild as HTMLElement;
    const label = within(wrapper).getByText('testing');
    expect(label.closest('[aria-hidden="true"]')).toBeNull();
    expect(screen.getByText('Experiment').closest('[aria-hidden="true"]')).toBeNull();
    for (const element of [row, lead, wrapper]) {
      expect(element.getAttributeNames().filter((name) => name === 'role' || name.startsWith('aria-'))).toEqual([]);
    }
    expect(wrapper.querySelector('svg')?.parentElement).toHaveAttribute('aria-hidden', 'true');
    const eyebrow = screen.getByText('Experiment');
    expect(eyebrow.compareDocumentPosition(wrapper)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(wrapper.compareDocumentPosition(heading)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    for (const element of [row, lead, wrapper]) {
      for (const cls of element.classList) {
        expect(cls).not.toMatch(/(^|:)order-/);
      }
    }
  });

  it.each(['plain', 'upper zone'] as const)(
    'adds no tab stop, handler or hover treatment with a status in the %s branch (PC-S6)',
    async (branch) => {
      const user = userEvent.setup();
      render(
        <ProjectCard title='Pulso' index='01' eyebrow='Open source' statusBadge={status}>
          <p>
            Body <a href='#body'>Body link</a>
          </p>
          {branch === 'upper zone' && (
            <ProjectCardMark>
              <img src='/mark.png' alt='Mark' />
            </ProjectCardMark>
          )}
          <ProjectCardFooter>
            <a href='#footer'>Footer link</a>
          </ProjectCardFooter>
        </ProjectCard>
      );
      const article = screen.getByRole('article', { name: 'Pulso' });
      const wrapper = statusWrapper(article);
      const row = wrapper.parentElement as HTMLElement;
      const lead = row.firstElementChild as HTMLElement;
      for (const element of [row, lead, wrapper]) {
        expectInert(element);
      }
      await user.tab();
      expect(screen.getByRole('link', { name: 'Body link' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('link', { name: 'Footer link' })).toHaveFocus();
      await user.tab();
      expect(document.body).toHaveFocus();
      const before = article.outerHTML;
      await user.hover(wrapper);
      await user.click(wrapper);
      expect(article.outerHTML).toBe(before);
      expect(document.body).toHaveFocus();
    }
  );

  it('never forwards statusBadge to the article and keeps protected semantics stripped (PC-S7)', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const props = injected({
      title: 'Pulso',
      statusBadge: status,
      'aria-describedby': 'status-note',
      role: 'button',
      'aria-label': 'hijack',
      tabIndex: 0
    });
    const { result } = renderHook(() => useProjectCard(props));
    const rootProps = result.current.rootProps as Record<string, unknown>;
    expect(rootProps.statusBadge).toBeUndefined();
    expect(rootProps['aria-describedby']).toBe('status-note');
    expect(rootProps.role).toBeUndefined();
    expect(rootProps['aria-label']).toBeUndefined();
    expect(rootProps.tabIndex).toBeUndefined();
    render(<ProjectCard {...props} />);
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(article.getAttributeNames().map((name) => name.toLowerCase())).not.toContain('statusbadge');
    expect(article).toHaveAttribute('aria-describedby', 'status-note');
    expect(article).not.toHaveAttribute('role');
    expect(error).not.toHaveBeenCalled();
  });

  it.each([
    { size: 'md', upper: false, gap: 'gap-4', other: 'gap-3' },
    { size: 'sm', upper: false, gap: 'gap-3', other: 'gap-4' },
    { size: 'md', upper: true, gap: 'gap-4', other: 'gap-3' },
    { size: 'sm', upper: true, gap: 'gap-4', other: 'gap-3' }
  ] as const)(
    'gives the lead the $gap step at size $size (upper zone: $upper) and renders every part (PC-S8)',
    ({ size, upper, gap, other }) => {
      render(
        <ProjectCard title='Pulso' index='01' eyebrow='Open source' size={size} statusBadge={status}>
          {upper && (
            <ProjectCardMark>
              <img src='/mark.png' alt='Mark' />
            </ProjectCardMark>
          )}
          {body}
        </ProjectCard>
      );
      const article = screen.getByRole('article', { name: 'Pulso' });
      const lead = (statusWrapper(article).parentElement as HTMLElement).firstElementChild as HTMLElement;
      expect(lead).toHaveClass(gap);
      expect(lead).not.toHaveClass(other);
      expect(within(lead).getByText('01')).toBeInTheDocument();
      expect(within(lead).getByText('Open source')).toBeInTheDocument();
      expect(within(article).getByText('testing')).toBeInTheDocument();
      expect(within(article).getByRole('heading', { name: 'Pulso' })).toBeInTheDocument();
    }
  );

  it('leaves the row, lead and wrapper recipes unchanged by the featured variant (PC-S8)', () => {
    render(
      <>
        <ProjectCard title='Default card' index='01' eyebrow='Open source' statusBadge={status}>
          {body}
        </ProjectCard>
        <ProjectCard title='Featured card' index='01' eyebrow='Open source' variant='featured' statusBadge={status}>
          {body}
        </ProjectCard>
      </>
    );
    const parts = (name: string) => {
      const wrapper = statusWrapper(screen.getByRole('article', { name }));
      const row = wrapper.parentElement as HTMLElement;
      return [row.className, (row.firstElementChild as HTMLElement).className, wrapper.className];
    };
    expect(parts('Featured card')).toEqual(parts('Default card'));
  });

  it('adds no truncation, clamp, clip or nowrap utility around a status in a narrow host and lets the row wrap (PC-S9)', () => {
    const longTitle = 'A very long project title that must wrap across several lines inside a narrow card';
    render(
      <div className='w-48'>
        <ProjectCard title={longTitle} index='01' eyebrow='Open source' statusBadge={status}>
          <p>A long body paragraph that keeps wrapping at word boundaries without ever being clamped.</p>
          <ProjectCardTags items={['React', 'TypeScript', 'Vitest', 'Storybook', 'Tailwind', 'Radix']} />
        </ProjectCard>
      </div>
    );
    const article = screen.getByRole('article', { name: longTitle });
    const wrapper = statusWrapper(article);
    expect(wrapper.parentElement).toHaveClass('flex-wrap');
    // The supplied Badge and the Chips keep their own approved recipes; every card-owned part is scanned.
    const ownParts = [article, ...article.querySelectorAll('*')].filter(
      (el) => el.closest('.eg-chip, .eg-badge') === null
    );
    expect(ownParts).toContain(wrapper);
    for (const element of ownParts) {
      for (const cls of element.classList) {
        expect(cls).not.toMatch(/^(truncate|line-clamp|text-ellipsis|overflow-hidden|whitespace-nowrap)/);
      }
    }
  });

  it('merges the root className last and gives the row, lead and wrapper no class surface (PC-S10)', () => {
    render(
      <ProjectCard title='Pulso' index='01' className='w-64 justify-self-end' statusBadge={status}>
        {body}
      </ProjectCard>
    );
    const article = screen.getByRole('article', { name: 'Pulso' });
    expect(Array.from(article.classList).slice(-2)).toEqual(['w-64', 'justify-self-end']);
    const wrapper = statusWrapper(article);
    const row = wrapper.parentElement as HTMLElement;
    for (const element of [row, row.firstElementChild as HTMLElement, wrapper]) {
      expect(element).not.toHaveClass('w-64');
      expect(element).not.toHaveClass('justify-self-end');
    }
  });

  it('styles the row, lead and wrapper with static token utilities only: no inline style, no arbitrary value (PC-S13)', () => {
    render(
      <ProjectCard title='Pulso' index='014' eyebrow='Experiment' statusBadge={status}>
        {body}
      </ProjectCard>
    );
    const wrapper = statusWrapper(screen.getByRole('article', { name: 'Pulso' }));
    const row = wrapper.parentElement as HTMLElement;
    for (const element of [row, row.firstElementChild as HTMLElement, wrapper]) {
      expect(element).not.toHaveAttribute('style');
      for (const cls of element.classList) {
        expect(cls).not.toMatch(/[[\]]/);
      }
    }
  });

  it('renders nothing and warns once for a blank title even with a status (PC-S15)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(
      <ProjectCard title='   ' statusBadge={status}>
        {body}
      </ProjectCard>
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('testing')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe('ProjectCard status stories (#558)', () => {
  it('composes WithStatus as the Lab experiment card: the lead at the start, the warning status at the end (PC-S1)', () => {
    const Story = composeStory(WithStatus, meta);
    render(<Story />);
    const article = screen.getByRole('article', { name: 'OpenDesign × Gentle AI' });
    const wrapper = statusWrapper(article);
    const row = wrapper.parentElement as HTMLElement;
    expect(row).toContainElement(screen.getByText('014'));
    expect(row).toContainElement(screen.getByText('Experiment'));
    expect(within(wrapper).getByText('testing')).toHaveAttribute('data-tone', 'warning');
    expect(wrapper.querySelector('svg')).not.toBeNull();
  });

  it('composes StatusPlacements as four sm cards: status only, eyebrow only, index only and both (PC-S3, PC-S8)', () => {
    const Story = composeStory(StatusPlacements, meta);
    render(<Story />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(4);
    const leads = articles.map((article) => {
      expect(article).toHaveAttribute('data-size', 'sm');
      expect(article.querySelectorAll('.eg-project-card__badge')).toHaveLength(1);
      const row = statusWrapper(article).parentElement as HTMLElement;
      return row.children.length === 1
        ? []
        : Array.from((row.firstElementChild as HTMLElement).children, (child) => child.textContent);
    });
    expect(leads).toEqual([[], ['Experiment'], ['014'], ['014', 'Experiment']]);
  });

  it('composes StatusOverBackdrop with the row in the upper zone and a solid Badge (PC-S4)', () => {
    const Story = composeStory(StatusOverBackdrop, meta);
    render(<Story />);
    const article = screen.getByRole('article');
    const upper = article.firstElementChild as HTMLElement;
    const wrapper = statusWrapper(article);
    expect(upper).toContainElement(wrapper);
    expect(upper.querySelectorAll('.bg-\\[var\\(--color-alpha-black-42\\)\\]')).toHaveLength(1);
    expect(within(wrapper).getByText('testing')).toHaveAttribute('data-variant', 'solid');
  });

  it('composes StatusInNarrowCard in a w-72 host with a wrapping row (PC-S9)', () => {
    const Story = composeStory(StatusInNarrowCard, meta);
    const { container } = render(<Story />);
    expect(container.firstElementChild).toHaveClass('w-72');
    const article = screen.getByRole('article');
    expect(statusWrapper(article).parentElement).toHaveClass('flex-wrap');
    expect(within(article).getByText('testing')).toBeInTheDocument();
  });
});
