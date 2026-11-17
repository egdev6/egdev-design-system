import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ts from 'typescript';
import { describe, expect, it, vi } from 'vitest';
import { Heading } from './Heading';
import type { HeadingLevel, HeadingProps, TextForeground, TextProps } from './types';
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

describe('Heading compact contract', () => {
  const colors = [
    'text-fg-default',
    'text-fg-secondary',
    'text-fg-muted',
    'text-status-warning',
    'text-status-danger',
    'text-fg-on-flood'
  ];

  it.each([1, 2, 3, 4, 5, 6] as const)('renders level %i with native text and id', (level) => {
    render(
      <Heading variant='compact' level={level} id={`compact-${level}`}>
        Compact heading
      </Heading>
    );
    const heading = screen.getByRole('heading', { level, name: 'Compact heading' });
    expect(heading.tagName).toBe(`H${level}`);
    expect(heading).toHaveAttribute('id', `compact-${level}`);
    expect(new Set(heading.className.split(' '))).toEqual(
      new Set(['eg-heading', 'm-0', 'font-display', 'uppercase', 'wrap-break-word', 'text-heading-small'])
    );
    expect(heading).not.toHaveAttribute('foreground');
  });

  it('keeps h2 as the compact default and inherited color', () => {
    render(<Heading variant='compact'>Default compact</Heading>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Default compact' });
    expect(heading).toHaveClass('text-heading-small');
    for (const color of colors) {
      expect(heading).not.toHaveClass(color);
    }
  });

  it.each([
    ['inherit', ''],
    ['default', 'text-fg-default'],
    ['secondary', 'text-fg-secondary'],
    ['muted', 'text-fg-muted'],
    ['warning', 'text-status-warning'],
    ['danger', 'text-status-danger'],
    ['on-flood', 'text-fg-on-flood']
  ] satisfies [TextForeground, string][])(
    'maps compact foreground %s without new semantics',
    (foreground, expected) => {
      render(
        <Heading variant='compact' foreground={foreground}>
          Meaningful heading
        </Heading>
      );
      const heading = screen.getByRole('heading', { name: 'Meaningful heading' });
      expect(heading).toHaveClass('text-heading-small');
      for (const color of colors) {
        if (color === expected) {
          expect(heading).toHaveClass(color);
        } else {
          expect(heading).not.toHaveClass(color);
        }
      }
      for (const attr of ['foreground', 'role', 'aria-live', 'tabindex']) {
        expect(heading).not.toHaveAttribute(attr);
      }
    }
  );

  it('discards invalid untyped compact foreground and accent inputs', () => {
    const untyped = {
      children: 'Safe compact',
      variant: 'compact',
      foreground: 'bogus',
      tone: 'raised',
      accent: 'Hidden',
      accentBreak: false
    } as unknown as HeadingProps;
    render(<Heading {...untyped} />);
    const heading = screen.getByRole('heading', { name: 'Safe compact' });
    expect(heading).toHaveClass('text-heading-small');
    expect(heading.textContent).toBe('Safe compact');
    for (const color of colors) {
      expect(heading).not.toHaveClass(color);
    }
    for (const attr of ['foreground', 'tone', 'accent', 'accentBreak']) {
      expect(heading).not.toHaveAttribute(attr);
    }
    expect(heading.querySelector('.eg-heading__accent')).toBeNull();
  });

  it.each(['section', 'hero', 'show', 'display', 'inverse'] as const)(
    'consumes untyped foreground on existing %s',
    (variant) => {
      const props = { children: 'Existing', variant, foreground: 'warning' } as unknown as HeadingProps;
      render(<Heading {...props} />);
      const heading = screen.getByRole('heading', { name: 'Existing' });
      expect(heading).not.toHaveAttribute('foreground');
      expect(heading).not.toHaveClass('text-status-warning');
    }
  );

  it('typechecks the exact packed Heading fixtures against the public source barrel', () => {
    const fixture = readFileSync(
      resolve(import.meta.dirname, '../../../../../scripts/package-consumption.test.mjs'),
      'utf8'
    );
    const start = fixture.indexOf('export const headingCompact:');
    const end = fixture.indexOf('export const textRaised:', start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    const code = ["import type { HeadingProps, TextProps } from '../../index';", fixture.slice(start, end)].join('\n');
    const file = resolve(import.meta.dirname, '__heading_consumer__.ts');
    const options: ts.CompilerOptions = {
      strict: true,
      noUncheckedIndexedAccess: true,
      noEmit: true,
      skipLibCheck: false,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      types: ['react', 'node'],
      paths: { '@/*': [resolve(import.meta.dirname, '../../*')] }
    };
    const host = ts.createCompilerHost(options);
    const original = host.getSourceFile.bind(host);
    host.getSourceFile = (path, languageVersion, onError, shouldCreateNewSourceFile) =>
      path === file
        ? ts.createSourceFile(path, code, languageVersion, true)
        : original(path, languageVersion, onError, shouldCreateNewSourceFile);
    const program = ts.createProgram([file], options, host);
    expect(
      ts.getPreEmitDiagnostics(program).map((item) => ts.flattenDiagnosticMessageText(item.messageText, '\n'))
    ).toEqual([]);
  }, 15000);

  it('enforces compact-only foreground and excludes title accent props', () => {
    const valid: HeadingProps[] = [
      { variant: 'compact', children: 'Compact' },
      { variant: 'compact', foreground: 'warning', children: 'Warning' }
    ];
    // @ts-expect-error Compact has no accent tone.
    const tone: HeadingProps = { variant: 'compact', tone: 'raised', children: 'Compact' };
    // @ts-expect-error Compact has no trailing accent.
    const accent: HeadingProps = { variant: 'compact', accent: 'No', children: 'Compact' };
    // @ts-expect-error Compact has no accent layout.
    const accentBreak: HeadingProps = { variant: 'compact', accentBreak: false, children: 'Compact' };
    // @ts-expect-error Foreground is unavailable on section.
    const section: HeadingProps = { variant: 'section', foreground: 'warning', children: 'Section' };
    // @ts-expect-error Foreground is unavailable on inverse.
    const inverse: HeadingProps = { variant: 'inverse', foreground: 'warning', children: 'Inverse' };
    // @ts-expect-error Compact is a Heading-only recipe.
    const text: TextProps = { variant: 'compact', children: 'Text' };
    expect([...valid, tone, accent, accentBreak, section, inverse, text]).toHaveLength(8);
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
