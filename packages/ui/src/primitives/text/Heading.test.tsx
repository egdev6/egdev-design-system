import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Heading } from './Heading';
import type { HeadingLevel, HeadingProps, TextProps } from './types';
import { useHeading } from './useHeading';

describe('Text and Heading type contract', () => {
  it('rejects forbidden combinations at compile time (checked by pnpm typecheck)', () => {
    // @ts-expect-error Heading excludes the eyebrow recipe: an eyebrow is not a heading.
    const eyebrowHeading: HeadingProps = { children: 'Heading', variant: 'eyebrow' };
    // @ts-expect-error Heading uses level, never asChild, so its semantics follow the requested rank.
    const slottedHeading: HeadingProps = { children: 'Heading', asChild: true };
    // @ts-expect-error Heading ranks are 1 through 6 only.
    const deepHeading: HeadingProps = { children: 'Heading', level: 7 };
    // @ts-expect-error The native heading owns aria-level.
    const ariaLevelHeading: HeadingProps = { children: 'Heading', 'aria-level': 3 };
    // @ts-expect-error Inverse has no tone choice.
    const tonedInverseHeading: HeadingProps = { children: 'Heading', variant: 'inverse', tone: 'raised' };
    // @ts-expect-error Text has no heading level.
    const leveledText: TextProps = { children: 'Text', level: 2 };
    // @ts-expect-error The eyebrow has no accent.
    const accentedEyebrow: TextProps = { children: 'Text', accent: 'Red' };
    // @ts-expect-error The eyebrow has no tone.
    const tonedEyebrow: TextProps = { children: 'Text', variant: 'eyebrow', tone: 'raised' };
    // @ts-expect-error Inverse has no tone choice.
    const tonedInverseText: TextProps = { children: 'Text', variant: 'inverse', tone: 'canvas' };
    // @ts-expect-error HTML injection is excluded from both exports.
    const injectedText: TextProps = { children: 'Text', dangerouslySetInnerHTML: { __html: '' } };
    // @ts-expect-error HTML injection is excluded from both exports.
    const injectedHeading: HeadingProps = { children: 'Heading', dangerouslySetInnerHTML: { __html: '' } };
    // @ts-expect-error Children are required content.
    const emptyHeading: HeadingProps = {};
    const valid: (TextProps | HeadingProps)[] = [
      { children: 'Text' },
      { children: 'Text', variant: 'hero', tone: 'raised', accent: 'Red', accentBreak: false },
      { children: 'Text', variant: 'inverse', accent: '.' },
      { children: 'Heading', level: 4, variant: 'show', tone: 'canvas' }
    ];
    expect(
      [
        eyebrowHeading,
        slottedHeading,
        deepHeading,
        ariaLevelHeading,
        tonedInverseHeading,
        leveledText,
        accentedEyebrow,
        tonedEyebrow,
        tonedInverseText,
        injectedText,
        injectedHeading,
        emptyHeading,
        ...valid
      ].length
    ).toBe(16);
  });
});

describe('useHeading', () => {
  it('resolves the h2 section default', () => {
    const { result } = renderHook(() => useHeading({ children: 'Section' }));
    expect(result.current.element).toBe('h2');
    expect(result.current.accent).toBeUndefined();
    expect(result.current.rootProps.className).toContain('text-title-section');
  });

  it('falls back to h2 for an untyped out-of-range level', () => {
    const untyped = { children: 'Bad level', level: 9 } as unknown as HeadingProps;
    const { result } = renderHook(() => useHeading(untyped));
    expect(result.current.element).toBe('h2');
  });

  it('discards dangerouslySetInnerHTML and asChild from untyped input', () => {
    const untyped = {
      children: 'Safe',
      asChild: true,
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    } as unknown as HeadingProps;
    const { result } = renderHook(() => useHeading(untyped));
    expect(Object.hasOwn(result.current.rootProps, 'dangerouslySetInnerHTML')).toBe(false);
    expect(Object.hasOwn(result.current.rootProps, 'asChild')).toBe(false);
  });
});

describe('Heading public contract', () => {
  it('defaults to a native h2 section title with the marker and zero margin', () => {
    render(<Heading>Section title</Heading>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Section title' });
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveClass(
      'eg-heading',
      'm-0',
      'font-display',
      'uppercase',
      'wrap-break-word',
      'text-title-section',
      'text-fg-default'
    );
    expect(heading).not.toHaveAttribute('aria-level');
    expect(heading).not.toHaveAttribute('role');
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('level %i keeps the chosen hero variant and full accessible text', (level) => {
    render(
      <Heading level={level} variant='hero' accent='Now'>
        Ship it{' '}
      </Heading>
    );
    const heading = screen.getByRole('heading', { level, name: 'Ship it Now' });
    expect(heading.tagName).toBe(`H${level satisfies HeadingLevel}`);
    expect(heading).toHaveClass('eg-heading', 'text-title-hero');
    expect(heading).not.toHaveAttribute('aria-level');
  });

  it('renders the block accent by default, inline on request, never hidden', () => {
    const { rerender } = render(<Heading accent='Ideas'>Big </Heading>);
    const accent = screen.getByText('Ideas');
    expect(accent).toHaveClass('eg-heading__accent', 'block', 'text-fg-brand-default');
    expect(accent).not.toHaveAttribute('aria-hidden');
    rerender(
      <Heading accent='Ideas' accentBreak={false}>
        Big{' '}
      </Heading>
    );
    expect(screen.getByText('Ideas')).toHaveClass('inline');
    expect(screen.getByRole('heading', { name: 'Big Ideas' })).toBeInTheDocument();
  });

  it('omits a blank accent span and keeps punctuation directly attached', () => {
    const { container, rerender } = render(<Heading accent='   '>No accent</Heading>);
    expect(container.querySelector('.eg-heading__accent')).toBeNull();
    rerender(
      <Heading variant='display' accent='.' accentBreak={false}>
        Talk
      </Heading>
    );
    expect(screen.getByRole('heading', { name: 'Talk.' })).toBeInTheDocument();
  });

  it('switches hero glow off on raised hosts and paints inverse on-flood', () => {
    const { rerender } = render(
      <Heading variant='hero' accent='Glow'>
        Hero{' '}
      </Heading>
    );
    expect(screen.getByText('Glow')).toHaveClass('[text-shadow:var(--text-shadow-title-hero)]');
    rerender(
      <Heading variant='hero' tone='raised' accent='Glow'>
        Hero{' '}
      </Heading>
    );
    expect(screen.getByText('Glow')).toHaveClass('text-fg-brand-raised', '[text-shadow:none]');
    rerender(
      <Heading variant='inverse' accent='Flood'>
        Black{' '}
      </Heading>
    );
    const inverse = screen.getByRole('heading', { name: 'Black Flood' });
    expect(inverse).toHaveClass('text-title-display', 'text-fg-on-flood');
    expect(screen.getByText('Flood')).toHaveClass('text-fg-on-flood', '[text-shadow:none]');
    expect(inverse.className).not.toMatch(/\bbg-/);
  });

  it.each([
    ['show', 'text-title-show'],
    ['display', 'text-title-display']
  ] as const)('maps the %s variant to its own fluid recipe', (variant, recipe) => {
    render(<Heading variant={variant}>Scale</Heading>);
    expect(screen.getByRole('heading', { name: 'Scale' })).toHaveClass(recipe);
  });

  it('ignores an untyped eyebrow variant and keeps the section recipe', () => {
    const untyped = { children: 'Not an eyebrow', variant: 'eyebrow' } as unknown as HeadingProps;
    render(<Heading {...untyped} />);
    const heading = screen.getByRole('heading', { name: 'Not an eyebrow' });
    expect(heading).toHaveClass('text-title-section');
    expect(heading).not.toHaveClass('text-label-eyebrow');
  });

  it('merges layout className last, passes native relationships and adds no focus', async () => {
    const user = userEvent.setup();
    const clicked = vi.fn();
    render(
      <>
        <Heading id='panel-title' className='mb-6 m-4' onClick={clicked}>
          Panel
        </Heading>
        <section aria-labelledby='panel-title'>Content</section>
      </>
    );
    const heading = screen.getByRole('heading', { name: 'Panel' });
    expect(heading).toHaveClass('eg-heading', 'm-4');
    expect(heading).not.toHaveClass('m-0');
    await user.click(heading);
    expect(clicked).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('region', { name: 'Panel' })).toBeInTheDocument();
    for (const attribute of ['tabindex', 'aria-live', 'data-state']) {
      expect(heading).not.toHaveAttribute(attribute);
    }
  });

  it('never forwards dangerouslySetInnerHTML from untyped callers', () => {
    const untyped = {
      children: 'Visible',
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    } as unknown as HeadingProps;
    render(<Heading {...untyped} />);
    expect(screen.getByRole('heading', { name: 'Visible' })).toBeInTheDocument();
    expect(screen.queryByText('Injected')).toBeNull();
  });
});
