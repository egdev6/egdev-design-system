import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  ListItem,
  ListItemBody,
  ListItemContent,
  ListItemMeta,
  type ListItemPartProps,
  type ListItemProps,
  ListItemTitle,
  type ListItemTitleProps
} from '../../molecules/list-item';
import { Heading } from './Heading';
import { Text } from './Text';
import { type HeadingProps, type TextForeground, type TextProps, textVariants } from './types';
import { useText } from './useText';

const theme = readFileSync(resolve(import.meta.dirname, '../../../../tokens/src/theme.css'), 'utf8');

describe('useText', () => {
  it('resolves the eyebrow default without an accent part or Slot', () => {
    const { result } = renderHook(() => useText({ children: 'Live now' }));
    expect(result.current.asChild).toBe(false);
    expect(result.current.accent).toBeUndefined();
    expect(result.current.rootProps.className).toContain('eg-text');
    expect(result.current.rootProps.className).toContain('text-label-eyebrow');
  });

  it('omits empty and whitespace-only accents but preserves non-empty text untrimmed', () => {
    for (const accent of ['', '   ', '\n\t']) {
      const { result } = renderHook(() => useText({ children: 'Talk', variant: 'section', accent }));
      expect(result.current.accent, JSON.stringify(accent)).toBeUndefined();
    }
    const { result } = renderHook(() => useText({ children: 'Talk', variant: 'section', accent: ' now ' }));
    expect(result.current.accent?.text).toBe(' now ');
  });

  it('discards dangerouslySetInnerHTML from untyped input before forwarding', () => {
    const untyped = {
      children: 'Safe',
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    } as unknown as TextProps;
    const { result } = renderHook(() => useText(untyped));
    expect(Object.hasOwn(result.current.rootProps, 'dangerouslySetInnerHTML')).toBe(false);
  });
});

describe('Text single-line truncation', () => {
  it.each([
    ['omitted', undefined, false],
    ['false', false, false],
    ['true', true, true],
    ['string', 'true', false],
    ['number', 1, false],
    ['null', null, false]
  ] as const)('consumes %s input for native and Slot roots', (_label, input, enabled) => {
    for (const asChild of [false, true]) {
      const children = asChild ? <span data-origin='child'>Complete text</span> : 'Complete text';
      const props = { children, asChild, truncate: input } as unknown as TextProps;
      const { result } = renderHook(() => useText(props));
      expect(Object.hasOwn(result.current.rootProps, 'truncate')).toBe(false);
      const { container, unmount } = render(<Text {...props} />);
      const root = container.firstElementChild;
      expect(root?.tagName).toBe(asChild ? 'SPAN' : 'P');
      expect(root).not.toHaveAttribute('truncate');
      expect(root?.textContent).toBe('Complete text');
      if (enabled) {
        expect(root).toHaveClass('block', 'min-w-0', 'truncate');
        expect(root).not.toHaveClass('inline-flex');
      } else {
        expect(root).toHaveClass('inline-flex');
        expect(root).not.toHaveClass('truncate', 'block');
      }
      unmount();
    }
  });

  it.each(['eyebrow', 'display', 'hero', 'section', 'show', 'inverse', 'body', 'body-large', 'lede'] as const)(
    'supports truncation on the %s recipe',
    (variant) => {
      render(
        <Text variant={variant} truncate={true}>
          Complete copy
        </Text>
      );
      const root = screen.getByText('Complete copy');
      expect(root).toHaveClass('eg-text', 'block', 'min-w-0', 'truncate');
      expect(root).not.toHaveAttribute('truncate');
      expect(root).not.toHaveAttribute('title');
      expect(root.textContent).toBe('Complete copy');
    }
  );

  it('switches the eyebrow diamond into the block line and restores its previous layout', () => {
    const { rerender } = render(<Text truncate={true}>Eyebrow</Text>);
    const root = screen.getByText('Eyebrow');
    expect(root).toHaveClass(
      'block',
      'truncate',
      'before:inline-block',
      'before:me-2.5',
      "before:content-['']",
      'before:size-2',
      'before:rotate-45',
      'before:bg-fg-brand-default'
    );
    expect(root).not.toHaveClass('inline-flex');
    rerender(<Text truncate={false}>Eyebrow</Text>);
    expect(root).toHaveClass('inline-flex', 'items-center', 'gap-2.5');
    expect(root).not.toHaveClass('truncate', 'block', 'before:inline-block', 'before:me-2.5');
  });

  it.each([undefined, true, false] as const)(
    'keeps the hero accent inline while truncated and restores accentBreak %s',
    (accentBreak) => {
      const { rerender } = render(
        <Text variant='hero' accent='glow' accentBreak={accentBreak} truncate={true}>
          Hero{' '}
        </Text>
      );
      const accent = screen.getByText('glow');
      const root = accent.parentElement;
      expect(root?.textContent).toBe('Hero glow');
      expect(accent).toHaveClass(
        'eg-text__accent',
        'inline',
        'text-fg-brand-default',
        '[text-shadow:var(--text-shadow-title-hero)]'
      );
      expect(accent).not.toHaveClass('block');
      expect(accent).not.toHaveAttribute('aria-hidden');
      rerender(
        <Text variant='hero' accent='glow' accentBreak={accentBreak} truncate={false}>
          Hero{' '}
        </Text>
      );
      expect(root).not.toHaveClass('truncate');
      expect(accent).toHaveClass(accentBreak === false ? 'inline' : 'block');
      expect(accent).not.toHaveClass(accentBreak === false ? 'block' : 'inline');
      expect(root?.textContent).toBe('Hero glow');
    }
  );

  it('preserves foreground, tone, full semantic content and supported layout merges', () => {
    const { rerender } = render(
      <Text variant='body-large' foreground='muted' truncate={true} className='mt-4 mt-2 max-w-64'>
        Before <strong>important</strong> after
      </Text>
    );
    const strong = screen.getByText('important');
    const root = strong.parentElement;
    expect(root?.tagName).toBe('P');
    expect(root?.textContent).toBe('Before important after');
    expect(root?.childNodes).toHaveLength(3);
    expect(root).toHaveClass('text-body-large', 'text-fg-muted', 'mt-2', 'max-w-64', 'truncate');
    expect(root).not.toHaveClass('mt-4');
    for (const attribute of ['title', 'role', 'tabindex', 'aria-label', 'aria-live']) {
      expect(root).not.toHaveAttribute(attribute);
    }
    rerender(
      <Text variant='hero' tone='raised' accent='accent' truncate={true}>
        Full{' '}
      </Text>
    );
    const accent = screen.getByText('accent');
    expect(accent).toHaveClass('inline', 'text-fg-brand-raised', '[text-shadow:none]');
    expect(accent.parentElement?.textContent).toBe('Full accent');
  });

  it('keeps a slotted child, its ref, attributes and accent without adding a wrapper', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container, rerender } = render(
      <Text
        asChild={true}
        variant='section'
        truncate={true}
        accent='accent'
        id='slotted'
        lang='ar'
        dir='rtl'
        title='Full title'
      >
        <span ref={ref} className='consumer-span' data-origin='child'>
          Complete{' '}
        </span>
      </Text>
    );
    const root = container.firstElementChild;
    expect(root?.tagName).toBe('SPAN');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('id', 'slotted');
    expect(root).toHaveAttribute('lang', 'ar');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('title', 'Full title');
    expect(root).toHaveAttribute('data-origin', 'child');
    expect(root).toHaveClass('consumer-span', 'eg-text', 'block', 'min-w-0', 'truncate');
    expect(root?.textContent).toBe('Complete accent');
    expect(root?.lastElementChild).toHaveClass('eg-text__accent', 'inline');
    expect(container.children).toHaveLength(1);
    rerender(
      <Text
        asChild={true}
        variant='section'
        truncate={false}
        accent='accent'
        id='slotted'
        lang='ar'
        dir='rtl'
        title='Full title'
      >
        <span ref={ref} className='consumer-span' data-origin='child'>
          Complete{' '}
        </span>
      </Text>
    );
    expect(ref.current).toBe(root);
    expect(root).not.toHaveClass('truncate');
    expect(root?.lastElementChild).toHaveClass('block');
    expect(root?.textContent).toBe('Complete accent');
  });

  it('retains complete text in native heading and ancestor-link names', () => {
    render(
      <>
        <h3>
          <Text asChild={true} variant='section' truncate={true} accent='accent'>
            <span>Heading </span>
          </Text>
        </h3>
        <a href='#details'>
          <Text asChild={true} variant='body' truncate={true}>
            <span>
              Link <strong>complete</strong> value
            </span>
          </Text>
        </a>
      </>
    );
    const heading = screen.getByRole('heading', { level: 3, name: 'Heading accent' });
    const link = screen.getByRole('link', { name: 'Link complete value' });
    expect(heading.querySelector('.eg-text')?.textContent).toBe('Heading accent');
    expect(link.querySelector('.eg-text')?.textContent).toBe('Link complete value');
    expect(link.querySelector('strong')).toHaveTextContent('complete');
    expect(link.querySelector('.eg-text')).not.toHaveAttribute('aria-label');
    expect(link.querySelector('.eg-text')).not.toHaveAttribute('tabindex');
  });

  it('preserves ListItem content and composes both supported truncation patterns', () => {
    render(
      <>
        <ListItem>
          <ListItemContent>Unclamped default content</ListItemContent>
        </ListItem>
        <ListItem variant='compact'>
          <ListItemContent>
            <Text variant='body' truncate={true}>
              Complete compact copy
            </Text>
          </ListItemContent>
        </ListItem>
        <ListItem variant='editorial'>
          <ListItemBody>
            <ListItemTitle level={3} className='self-stretch'>
              <Text asChild={true} variant='body-large' truncate={true}>
                <span>Complete editorial title</span>
              </Text>
            </ListItemTitle>
            <ListItemMeta className='self-stretch'>
              <Text asChild={true} variant='body' foreground='muted' truncate={true}>
                <span>Complete project name</span>
              </Text>
            </ListItemMeta>
          </ListItemBody>
        </ListItem>
      </>
    );
    const normal = screen.getByText('Unclamped default content');
    expect(normal).toHaveClass('eg-list-item__content', 'min-w-0');
    expect(normal).not.toHaveClass('truncate', 'overflow-hidden', 'whitespace-nowrap');
    const compact = screen.getByText('Complete compact copy');
    expect(compact.tagName).toBe('P');
    expect(compact).toHaveClass('truncate');
    expect(compact.parentElement).toHaveClass('eg-list-item__content', 'min-w-0');
    const heading = screen.getByRole('heading', { level: 3, name: 'Complete editorial title' });
    expect(heading).toHaveClass('self-stretch', 'min-w-0');
    expect(heading.firstElementChild?.tagName).toBe('SPAN');
    expect(heading.firstElementChild).toHaveClass('truncate');
    const meta = screen.getByText('Complete project name');
    expect(meta.tagName).toBe('SPAN');
    expect(meta).toHaveClass('truncate', 'text-fg-muted');
    expect(meta.parentElement).toHaveClass('eg-list-item__meta', 'self-stretch', 'min-w-0');
  });

  it('leaves independent ancestor and sibling actions keyboard and pointer operable', async () => {
    const user = userEvent.setup();
    const follow = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const action = vi.fn();
    render(
      <>
        <a href='#details' onClick={follow}>
          <Text asChild={true} variant='body' truncate={true}>
            <span>Full linked value</span>
          </Text>
        </a>
        <button type='button' onClick={action}>
          More actions
        </button>
      </>
    );
    const link = screen.getByRole('link', { name: 'Full linked value' });
    const button = screen.getByRole('button', { name: 'More actions' });
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard(' ');
    await user.click(link);
    await user.click(button);
    expect(follow).toHaveBeenCalledTimes(2);
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('accepts only a boolean on Text without widening Heading or ListItem props', () => {
    const valid: TextProps[] = [
      { children: 'Copy', truncate: true },
      { variant: 'body', children: 'Copy', truncate: false }
    ];
    // @ts-expect-error Truncation accepts a boolean, not a string.
    const text: TextProps = { children: 'Copy', truncate: 'true' };
    // @ts-expect-error Truncation is not a Heading prop.
    const heading: HeadingProps = { children: 'Heading', truncate: true };
    // @ts-expect-error Truncation is not a ListItem prop.
    const item: ListItemProps = { children: 'Item', truncate: true };
    // @ts-expect-error Truncation is not a ListItem part prop.
    const part: ListItemPartProps = { children: 'Part', truncate: true };
    // @ts-expect-error Truncation is not a ListItemTitle prop.
    const title: ListItemTitleProps = { children: 'Title', truncate: true };
    expect([valid, text, heading, item, part, title]).toHaveLength(6);
  });
});

describe('Text body contract', () => {
  const colorClasses = [
    'text-fg-default',
    'text-fg-secondary',
    'text-fg-muted',
    'text-status-warning',
    'text-status-danger',
    'text-fg-on-flood'
  ];

  it.each([
    ['body', 'text-body-default'],
    ['body-large', 'text-body-large'],
    ['lede', 'text-body-muted']
  ] as const)('renders %s as normal-flow paragraph with the body recipe', (variant, recipe) => {
    render(
      <Text variant={variant} lang='en'>
        Body copy
      </Text>
    );
    const root = screen.getByText('Body copy');
    expect(root.tagName).toBe('P');
    expect(root).toHaveAttribute('lang', 'en');
    expect(root).toHaveClass(
      'eg-text',
      'm-0',
      'font-sans',
      recipe,
      '[&_strong]:[font-weight:var(--text-heading-small--font-weight)]'
    );
    for (const name of ['font-display', 'uppercase', 'wrap-break-word', 'inline-flex', ...colorClasses]) {
      expect(root).not.toHaveClass(name);
    }
    expect(root).not.toHaveAttribute('foreground');
  });

  it('preserves ordered native strong content without a wrapper or inline appearance', () => {
    render(
      <Text variant='body'>
        Read <strong>important</strong> words.
      </Text>
    );
    const strong = screen.getByText('important');
    const root = strong.parentElement;
    expect(root?.tagName).toBe('P');
    expect(root?.textContent).toBe('Read important words.');
    expect(root?.childNodes).toHaveLength(3);
    expect(strong.tagName).toBe('STRONG');
    expect(strong).not.toHaveAttribute('style');
    expect(root).toHaveClass('[&_strong]:[font-weight:var(--text-heading-small--font-weight)]');
  });

  it.each(['body', 'body-large', 'lede'] as const)(
    'slots %s without losing whitespace, language or emphasis',
    (variant) => {
      render(
        <Text asChild={true} variant={variant} lang='fr'>
          <span data-origin='child'>
            Before <strong>important</strong> after
          </span>
        </Text>
      );
      const root = screen.getByText('important').parentElement;
      expect(root?.tagName).toBe('SPAN');
      expect(root).toHaveAttribute('lang', 'fr');
      expect(root).toHaveAttribute('data-origin', 'child');
      expect(root?.textContent).toBe('Before important after');
      expect(root).toHaveClass('[&_strong]:[font-weight:var(--text-heading-small--font-weight)]');
      expect(root?.parentElement?.tagName).not.toBe('P');
      expect(root).not.toHaveAttribute('foreground');
    }
  );

  it.each([
    ['inherit', ''],
    ['default', 'text-fg-default'],
    ['secondary', 'text-fg-secondary'],
    ['muted', 'text-fg-muted'],
    ['warning', 'text-status-warning'],
    ['danger', 'text-status-danger'],
    ['on-flood', 'text-fg-on-flood']
  ] satisfies [TextForeground, string][])(
    'maps %s without leaking attributes or adding status semantics',
    (foreground, expected) => {
      render(
        <Text variant='body' foreground={foreground}>
          Meaningful status copy
        </Text>
      );
      const root = screen.getByText('Meaningful status copy');
      for (const name of colorClasses) {
        if (name === expected) {
          expect(root).toHaveClass(name);
        } else {
          expect(root).not.toHaveClass(name);
        }
      }
      for (const attribute of ['foreground', 'role', 'aria-live', 'tabindex']) {
        expect(root).not.toHaveAttribute(attribute);
      }
    }
  );

  it('falls back to inherited color for bogus input and updates across rerenders', () => {
    const { rerender } = render(
      <Text variant='body' foreground='warning'>
        Copy
      </Text>
    );
    const root = screen.getByText('Copy');
    expect(root).toHaveClass('text-status-warning');
    rerender(
      <Text variant='body-large' foreground='danger'>
        Copy
      </Text>
    );
    expect(root).toHaveClass('text-body-large', 'text-status-danger');
    expect(root).not.toHaveClass('text-status-warning');
    const invalid = { variant: 'lede', foreground: 'bogus', children: 'Copy' } as unknown as TextProps;
    rerender(<Text {...invalid} />);
    expect(root).toHaveClass('text-body-muted');
    for (const name of colorClasses) {
      expect(root).not.toHaveClass(name);
    }
    expect(root).not.toHaveAttribute('foreground');
    rerender(<Text variant='body'>Copy</Text>);
    for (const name of colorClasses) {
      expect(root).not.toHaveClass(name);
    }
  });

  it.each(['body', 'body-large', 'lede'] as const)('discards untyped title accent and tone on %s', (variant) => {
    const props = {
      variant,
      tone: 'raised',
      accent: 'Hidden',
      accentBreak: false,
      children: 'Plain'
    } as unknown as TextProps;
    const { container } = render(<Text {...props} />);
    const root = screen.getByText('Plain');
    const recipe = { body: 'text-body-default', 'body-large': 'text-body-large', lede: 'text-body-muted' }[variant];
    expect(root).toHaveClass(recipe, 'font-sans');
    expect(container.querySelector('.eg-text__accent')).toBeNull();
    expect(root.textContent).toBe('Plain');
    for (const name of ['tone', 'accent', 'accentBreak']) {
      expect(root).not.toHaveAttribute(name);
    }
  });

  it('retains the eyebrow fallback for an invalid untyped variant', () => {
    const props = { variant: 'unknown', foreground: 'danger', children: 'Fallback' } as unknown as TextProps;
    render(<Text {...props} />);
    const root = screen.getByText('Fallback');
    expect(root.className).toBe(textVariants({ variant: 'eyebrow' }));
    expect(root).not.toHaveAttribute('foreground');
    expect(root).not.toHaveClass('text-status-danger');
  });

  it.each(['eyebrow', 'section', 'hero', 'show', 'display', 'inverse'] as const)(
    'ignores untyped foreground on old %s and preserves its previous exact classes',
    (variant) => {
      const props = { variant, foreground: 'warning', children: 'Old copy' } as unknown as TextProps;
      render(<Text {...props} />);
      const root = screen.getByText('Old copy');
      expect(root.className).toBe(textVariants({ variant }));
      expect(root).not.toHaveAttribute('foreground');
      expect(root).not.toHaveClass('text-status-warning');
    }
  );

  it.each([
    ['section', '1486cc186cf99b22fc786633f78037b0aebdd1c70ad3390de53dbc8cbfe369ed'],
    ['hero', '35b387bbd8589640eec370ebd0e7d8d4a0c00eed1e46ad83827631da3fb24b65'],
    ['show', '0c88e5ff9ab9a14c3c22c02c1e1c1528dffba799fa08499f1244a1e0d9c4796c'],
    ['display', 'ab97ac27b1923294c3be7acf1f09375e8024ce938c916285bce9a8703b050fc4'],
    ['inverse', '96a92a552765edb6e8d67fb96d82a368e6e0f7ae7ed4e292fd51e9b5784c0e96']
  ] as const)('preserves the pre-change Heading %s class hash', (variant, hash) => {
    render(<Heading variant={variant}>Heading</Heading>);
    const classes = screen.getByRole('heading', { name: 'Heading' }).className;
    expect(createHash('sha256').update(classes).digest('hex')).toBe(hash);
  });

  it('checks body and existing variant combinations at the type boundary', () => {
    const valid: TextProps[] = [
      { variant: 'body', children: 'Copy' },
      { variant: 'body-large', foreground: 'warning', children: 'Copy' },
      { variant: 'lede', foreground: 'on-flood', children: 'Copy' }
    ];
    // @ts-expect-error Body does not accept display accent tone.
    const tone: TextProps = { variant: 'body', tone: 'raised', children: 'Copy' };
    // @ts-expect-error Body does not accept a trailing accent.
    const accent: TextProps = { variant: 'body-large', accent: 'No', children: 'Copy' };
    // @ts-expect-error Body does not accept accent layout.
    const accentBreak: TextProps = { variant: 'lede', accentBreak: false, children: 'Copy' };
    // @ts-expect-error Foreground is restricted to body recipes.
    const section: TextProps = { variant: 'section', foreground: 'warning', children: 'Copy' };
    // @ts-expect-error Foreground is restricted to body recipes.
    const eyebrow: TextProps = { variant: 'eyebrow', foreground: 'warning', children: 'Copy' };
    // @ts-expect-error Foreground is restricted to body recipes.
    const inverse: TextProps = { variant: 'inverse', foreground: 'warning', children: 'Copy' };
    expect([...valid, tone, accent, accentBreak, section, eyebrow, inverse]).toHaveLength(9);
  });
});

describe('Text public contract', () => {
  it('defaults to a paragraph eyebrow with the marker, zero margin and decorative diamond', () => {
    render(<Text>Live now</Text>);
    const root = screen.getByText('Live now');
    expect(root.tagName).toBe('P');
    expect(root).toHaveClass(
      'eg-text',
      'm-0',
      'font-display',
      'uppercase',
      'text-label-eyebrow',
      'text-fg-secondary',
      'inline-flex',
      'items-center',
      'gap-2.5',
      "before:content-['']",
      'before:size-2',
      'before:shrink-0',
      'before:rotate-45',
      'before:bg-fg-brand-default'
    );
    expect(root).not.toHaveAttribute('role');
    expect(screen.queryByRole('heading')).toBeNull();
    expect(root.children).toHaveLength(0);
    expect(root.textContent).toBe('Live now');
  });

  it('never emits legacy eg-title or eg-eyebrow roots', () => {
    const { container } = render(
      <>
        <Text>Eyebrow</Text>
        <Text variant='hero' accent='glow'>
          Hero{' '}
        </Text>
      </>
    );
    expect(container.querySelector('[class*="eg-title"], [class*="eg-eyebrow"]')).toBeNull();
  });

  it.each([
    ['section', 'text-title-section'],
    ['hero', 'text-title-hero'],
    ['show', 'text-title-show'],
    ['display', 'text-title-display']
  ] as const)('renders %s display copy with its fluid token recipe as non-heading text', (variant, recipe) => {
    render(<Text variant={variant}>Display copy</Text>);
    const root = screen.getByText('Display copy');
    expect(root.tagName).toBe('P');
    expect(root).toHaveClass(
      'eg-text',
      'm-0',
      'font-display',
      'uppercase',
      'wrap-break-word',
      recipe,
      'text-fg-default'
    );
    expect(root).not.toHaveClass('text-label-eyebrow', 'inline-flex');
    expect(theme).toMatch(new RegExp(`--${recipe}:\\s*clamp\\(`));
  });

  it('renders a trailing block accent by default and an inline accent on request', () => {
    const { rerender } = render(
      <Text variant='section' accent='Ideas'>
        Big{' '}
      </Text>
    );
    const block = screen.getByText('Ideas');
    expect(block.tagName).toBe('SPAN');
    expect(block).toHaveClass('eg-text__accent', 'block', 'text-fg-brand-default', '[text-shadow:none]');
    expect(block).not.toHaveAttribute('aria-hidden');
    expect(block.parentElement?.lastChild).toBe(block);
    rerender(
      <Text variant='section' accent='Ideas' accentBreak={false}>
        Big{' '}
      </Text>
    );
    expect(screen.getByText('Ideas')).toHaveClass('inline');
    expect(screen.getByText('Ideas')).not.toHaveClass('block');
    expect(screen.getByText('Ideas').parentElement?.textContent).toBe('Big Ideas');
  });

  it('places punctuation accents without an injected separator', () => {
    render(
      <Text variant='display' accent='.' accentBreak={false}>
        Talk
      </Text>
    );
    expect(screen.getByText('.').parentElement?.textContent).toBe('Talk.');
  });

  it('glows only the canvas hero accent and uses the raised brand token on raised hosts', () => {
    const { rerender } = render(
      <Text variant='hero' accent='Glow'>
        Hero{' '}
      </Text>
    );
    expect(screen.getByText('Glow')).toHaveClass(
      'text-fg-brand-default',
      '[text-shadow:var(--text-shadow-title-hero)]'
    );
    rerender(
      <Text variant='hero' tone='raised' accent='Glow'>
        Hero{' '}
      </Text>
    );
    const raised = screen.getByText('Glow');
    expect(raised).toHaveClass('text-fg-brand-raised', '[text-shadow:none]');
    expect(raised).not.toHaveClass('text-fg-brand-default', '[text-shadow:var(--text-shadow-title-hero)]');
    expect(raised.parentElement).not.toHaveClass('bg-surface-1');
  });

  it('paints inverse root and accent on-flood at display scale without a host background', () => {
    render(
      <Text variant='inverse' accent='Flood'>
        Black{' '}
      </Text>
    );
    const accent = screen.getByText('Flood');
    const root = accent.parentElement;
    expect(root).toHaveClass('text-title-display', 'text-fg-on-flood');
    expect(root?.className).not.toMatch(/\bbg-/);
    expect(accent).toHaveClass('text-fg-on-flood', '[text-shadow:none]');
  });

  it('ignores accent props on an untyped eyebrow', () => {
    const untyped = { children: 'Eyebrow', accent: 'Hidden' } as unknown as TextProps;
    render(<Text {...untyped} />);
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  it('slots onto one span, preserving child classes and placing the accent inside it', () => {
    render(
      <Text asChild={true} variant='section' accent='Inside' accentBreak={false}>
        <span className='consumer-span' data-origin='child'>
          Slotted{' '}
        </span>
      </Text>
    );
    const accent = screen.getByText('Inside');
    const root = accent.parentElement;
    expect(root?.tagName).toBe('SPAN');
    expect(root).toHaveClass('eg-text', 'text-title-section', 'consumer-span');
    expect(root).toHaveAttribute('data-origin', 'child');
    expect(root?.textContent).toBe('Slotted Inside');
    expect(root?.parentElement?.tagName).not.toBe('P');
    expect(document.querySelector('p')).toBeNull();
  });

  it('merges layout className last and keeps the public marker', () => {
    render(<Text className='mt-4 max-w-prose m-2'>Layout</Text>);
    const root = screen.getByText('Layout');
    expect(root).toHaveClass('eg-text', 'max-w-prose', 'm-2');
    expect(root).not.toHaveClass('m-0');
  });

  it('passes native relationships and handlers without adding focus or live regions', async () => {
    const user = userEvent.setup();
    const clicked = vi.fn();
    render(
      <>
        <Text id='intro-eyebrow' title='Intro' onClick={clicked}>
          Intro
        </Text>
        <section aria-labelledby='intro-eyebrow'>Body</section>
      </>
    );
    const root = screen.getByText('Intro');
    await user.click(root);
    expect(clicked).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('region', { name: 'Intro' })).toBeInTheDocument();
    for (const attribute of ['tabindex', 'aria-live', 'role', 'data-state']) {
      expect(root).not.toHaveAttribute(attribute);
    }
  });

  it('never forwards dangerouslySetInnerHTML from untyped callers', () => {
    const untyped = {
      children: 'Visible',
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    } as unknown as TextProps & { children: ReactNode };
    render(<Text {...untyped} />);
    expect(screen.getByText('Visible')).toBeInTheDocument();
    expect(screen.queryByText('Injected')).toBeNull();
  });
});
