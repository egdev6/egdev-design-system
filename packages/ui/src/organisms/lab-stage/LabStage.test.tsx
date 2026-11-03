import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Surface } from '../../primitives/surface';
import { Heading, Text } from '../../primitives/text';
import { SectionShell } from '../../templates/section-shell';
import { LabStage, type LabStageProps } from './index';

describe('LabStage contract', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)('LS-01 names the host with rank %i', (level) => {
    const { container } = render(
      <SectionShell aria-labelledby={`heading-${level}`}>
        <LabStage title='Scene' level={level} id={`heading-${level}`} />
      </SectionShell>
    );
    expect(screen.getByRole('region', { name: 'Scene' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level, name: 'Scene' })).toHaveAttribute('id', `heading-${level}`);
    expect(container.querySelector('.eg-lab')).not.toHaveAttribute('id');
    expect(container.querySelectorAll(`#heading-${level}`)).toHaveLength(1);
  });
  it.each(['eyebrow', 'accent', 'lede', 'children', 'media'] as const)('LS-02/03 omits %s independently', (missing) => {
    const options = {
      eyebrow: 'Context',
      accent: 'Accent',
      lede: 'Introduction',
      children: <article>Experiment</article>,
      media: <img alt='' src='/image.png' />
    };
    const { [missing]: _missing, ...present } = options;
    const { container } = render(<LabStage title='Title ' level={2} {...present} />);
    expect(Boolean(screen.queryByText('Context'))).toBe(missing !== 'eyebrow');
    expect(Boolean(container.querySelector('.eg-heading__accent'))).toBe(missing !== 'accent');
    expect(Boolean(screen.queryByText('Introduction'))).toBe(missing !== 'lede');
    expect(Boolean(screen.queryByRole('article'))).toBe(missing !== 'children');
    expect(Boolean(container.querySelector('[aria-hidden="true"]:has(img)'))).toBe(missing !== 'media');
    const grid = container.querySelector('.eg-lab')?.firstElementChild;
    expect(grid?.children).toHaveLength(missing === 'media' ? 1 : 2);
    expect(grid?.firstElementChild?.children).toHaveLength(
      4 - Number(missing === 'eyebrow' || missing === 'lede' || missing === 'children')
    );
  });
  it('LS-03/04 derives tracks from present, absent and empty media', () => {
    const { container, rerender } = render(<LabStage title='Scene' level={2} />);
    const grid = () => container.querySelector('.eg-lab')?.firstElementChild;
    expect(grid()).toHaveClass('grid-cols-1');
    expect(grid()).not.toHaveClass('grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]');
    rerender(<LabStage title='Scene' level={2} media={<img alt='' src='/image.png' />} />);
    expect(grid()).toHaveClass(
      'grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]',
      '[@media(width<=860px)]:grid-cols-1',
      '[@media(width<=860px)]:gap-2'
    );
    const media = container.querySelector('img')?.parentElement;
    expect(media).toHaveAttribute('aria-hidden', 'true');
    expect(media).not.toHaveAttribute('tabindex');
    expect(media?.querySelector('a,button,input,select,textarea,[tabindex]')).toBeNull();
    for (const empty of [false, null, []]) {
      rerender(<LabStage title='Scene' level={2} media={empty} />);
      expect(grid()?.children).toHaveLength(1);
      expect(grid()).not.toHaveClass('grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]');
    }
  });
  it('LS-02/05 keeps experiment after lede and its link keyboard reachable', async () => {
    const user = userEvent.setup();
    render(
      <LabStage title='Scene' level={2} eyebrow='Context' lede='Introduction' media={<img alt='' src='/image.png' />}>
        <article>
          <h3>Experiment</h3>
          <a href='#experiment'>Explore</a>
        </article>
      </LabStage>
    );
    expect(
      screen.getByText('Context').compareDocumentPosition(screen.getByRole('heading', { level: 2 })) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      screen.getByText('Introduction').compareDocumentPosition(screen.getByRole('article')) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Explore' })).toHaveFocus();
    expect(screen.getByRole('link')).toHaveAttribute('href', '#experiment');
  });
  it('LS-01 preserves distinct heading ids across rerender', () => {
    const view = (first: string) => (
      <>
        <SectionShell aria-labelledby='first-id'>
          <LabStage id='first-id' title={first} level={2} />
        </SectionShell>
        <SectionShell aria-labelledby='second-id'>
          <LabStage id='second-id' title='Second' level={3} />
        </SectionShell>
      </>
    );
    const { container, rerender } = render(view('First'));
    rerender(view('Updated'));
    expect(screen.getByRole('region', { name: 'Updated' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Second' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Updated', level: 2 })).toHaveAttribute('id', 'first-id');
    expect(screen.getByRole('heading', { name: 'Second', level: 3 })).toHaveAttribute('id', 'second-id');
    expect(container.querySelectorAll('#first-id')).toHaveLength(1);
    expect(container.querySelectorAll('#second-id')).toHaveLength(1);
  });
  it('LS-02 preserves composed experiment semantics and content order', () => {
    render(
      <LabStage title='Lab' level={2} lede='Introduction'>
        <Surface asChild={true}>
          <article aria-label='Experiment card'>
            <Badge>In progress</Badge>
            <Heading level={3}>Experiment title</Heading>
            <Text>Experiment details</Text>
          </article>
        </Surface>
      </LabStage>
    );
    const article = screen.getByRole('article', { name: 'Experiment card' });
    const badge = screen.getByText('In progress');
    const heading = screen.getByRole('heading', { name: 'Experiment title', level: 3 });
    const detail = screen.getByText('Experiment details');
    expect(article).toContainElement(badge);
    expect(article).toContainElement(heading);
    expect(article).toContainElement(detail);
    expect(badge.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(heading.compareDocumentPosition(detail) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      screen.getByText('Introduction').compareDocumentPosition(article) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
  it('LS-05 activates the composed card link with Enter and retains reverse tab order', async () => {
    const user = userEvent.setup();
    let activations = 0;
    render(
      <LabStage title='Lab' level={2}>
        <Surface asChild={true}>
          <article>
            <Button asChild={true} size='lg' variant='secondary'>
              <a
                href='#experiment'
                onClick={(event) => {
                  event.preventDefault();
                  activations += 1;
                }}
              >
                Explore experiment
              </a>
            </Button>
            <a href='#more'>More</a>
          </article>
        </Surface>
      </LabStage>
    );
    const link = screen.getByRole('link', { name: 'Explore experiment' });
    expect(link).toHaveAttribute('href', '#experiment');
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(activations).toBe(1);
    await user.tab();
    expect(screen.getByRole('link', { name: 'More' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(link).toHaveFocus();
  });
  it('LS-06/07 filters protected props and applies owned classes', () => {
    const unsafe = {
      role: 'navigation',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' },
      asChild: true,
      ref: () => undefined
    };
    const { container } = render(
      <LabStage
        {...unsafe}
        title='Scene'
        level={2}
        id='scene'
        lede='Body'
        className='mt-4 mt-8'
        data-owner='host'
        media={<img alt='' src='/image.png' />}
      >
        Experiment
      </LabStage>
    );
    const root = container.querySelector('.eg-lab');
    expect(root).toHaveClass('box-border', 'relative', 'h-auto', 'w-full', 'font-sans', 'text-fg-default', 'mt-8');
    expect(root).not.toHaveClass('mt-4');
    for (const attr of ['id', 'role', 'style', 'asChild']) {
      expect(root).not.toHaveAttribute(attr);
    }
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(container.querySelector('b')).toBeNull();
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'scene');
    expect(container.querySelector('img')?.parentElement).toHaveClass(
      'aspect-square',
      'w-[min(100%,72vh)]',
      '[@media(width<=860px)]:order-first',
      '[@media(width<=860px)]:w-[min(100%,36svh,calc(var(--space-24)*4))]'
    );
    expect(container.querySelector('[class*="eg-lab__"]')).toBeNull();
    for (const element of Array.from(root?.querySelectorAll('*') ?? []).concat(root ? [root] : [])) {
      expect(Array.from(element.classList).filter((name) => /(^|:)(animate|transition)(-|$)/.test(name))).toEqual([]);
    }
  });
  it('LS-07 rejects invalid types', () => {
    const valid = { title: 'Title', level: 2 as const };
    // @ts-expect-error title is required.
    const title: LabStageProps = { level: 2 };
    // @ts-expect-error level is required.
    const level: LabStageProps = { title: 'Title' };
    // @ts-expect-error rank must be 1–6.
    const rank: LabStageProps = { ...valid, level: 7 };
    // @ts-expect-error role is protected.
    const role: LabStageProps = { ...valid, role: 'navigation' };
    // @ts-expect-error style is protected.
    const style: LabStageProps = { ...valid, style: {} };
    // @ts-expect-error raw HTML is protected.
    const html: LabStageProps = { ...valid, dangerouslySetInnerHTML: { __html: 'x' } };
    // @ts-expect-error ref is unsupported.
    const ref: LabStageProps = { ...valid, ref: () => undefined };
    // @ts-expect-error asChild is unsupported.
    const asChild: LabStageProps = { ...valid, asChild: true };
    expect([title, level, rank, role, style, html, ref, asChild]).toHaveLength(8);
  });
});
