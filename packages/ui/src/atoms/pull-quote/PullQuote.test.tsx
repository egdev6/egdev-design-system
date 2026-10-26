import { render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PullQuote } from './PullQuote';
import type { PullQuoteProps } from './types';
import { usePullQuote } from './usePullQuote';

const base = { text: 'Build the system before the screen.' } satisfies PullQuoteProps;

const figureOf = (container: HTMLElement) => container.querySelector('figure');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('usePullQuote', () => {
  it('derives a pull canvas quotation with no accent, caption or cite by default', () => {
    const { result } = renderHook(() => usePullQuote(base));
    expect(result.current.visible).toBe(true);
    expect(result.current.text).toBe(base.text);
    expect(result.current.accent).toBeUndefined();
    expect(result.current.source).toBeUndefined();
    expect(result.current.quotationProps.cite).toBeUndefined();
    expect(result.current.rootProps.className.split(' ')).toContain('eg-quote');
    expect(result.current.rootProps.className.split(' ')).toContain('max-w-quote-pull');
  });

  it('omits blank optional strings and keeps non-empty ones verbatim', () => {
    const { result, rerender } = renderHook((props: PullQuoteProps) => usePullQuote(props), {
      initialProps: { ...base, accent: '  ', source: '\n', cite: ' ' }
    });
    expect(result.current.accent).toBeUndefined();
    expect(result.current.source).toBeUndefined();
    expect(result.current.quotationProps.cite).toBeUndefined();
    rerender({ ...base, accent: ' now.', source: 'Field notes', cite: 'https://example.com/notes' });
    expect(result.current.accent?.text).toBe(' now.');
    expect(result.current.source?.text).toBe('Field notes');
    expect(result.current.quotationProps.cite).toBe('https://example.com/notes');
  });

  it('is not visible for blank text even when optional parts are supplied', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() => usePullQuote({ text: '   ', accent: 'Accent', source: 'Source' }));
    expect(result.current.visible).toBe(false);
  });
});

describe('PullQuote semantics', () => {
  it('renders figure > blockquote > p with no caption, heading or control by default', () => {
    const { container } = render(<PullQuote {...base} />);
    const figure = screen.getByRole('figure');
    expect(figure === figureOf(container)).toBe(true);
    expect(figure).toHaveClass('eg-quote');
    expect(figure.children).toHaveLength(1);
    const quotation = figure.firstElementChild;
    expect(quotation?.tagName).toBe('BLOCKQUOTE');
    expect(quotation).toHaveClass('eg-quote__text');
    expect(quotation?.children).toHaveLength(1);
    expect(quotation?.firstElementChild?.tagName).toBe('P');
    expect(quotation?.textContent).toBe(base.text);
    expect(container.querySelector('figcaption')).toBeNull();
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(figure).not.toHaveAttribute('role');
    expect(figure).not.toHaveAttribute('aria-live');
  });

  it('keeps display a quotation: no heading role, level or modifier class', () => {
    const { container } = render(<PullQuote {...base} variant='display' accent=' Twice.' />);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(container.querySelector('blockquote > p')?.textContent).toBe(`${base.text} Twice.`);
    expect(figureOf(container)).not.toHaveClass('eg-quote--display');
    expect(figureOf(container)).not.toHaveAttribute('aria-level');
  });

  it('places plain source text in a figcaption after the quotation, outside the passage', () => {
    const { container } = render(<PullQuote {...base} source='Ada Lovelace, Notes' />);
    const figure = screen.getByRole('figure');
    const caption = container.querySelector('figcaption');
    expect(caption === figure.lastElementChild).toBe(true);
    expect(caption?.previousElementSibling?.tagName).toBe('BLOCKQUOTE');
    expect(caption).toHaveClass('eg-quote__source');
    expect(caption?.textContent).toBe('Ada Lovelace, Notes');
    expect(container.querySelector('blockquote')?.textContent).toBe(base.text);
    expect(container.querySelector('cite')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });

  it('forwards cite only to the blockquote, independently of source, and never as a link', () => {
    const url = 'https://example.com/source';
    const { container, rerender } = render(<PullQuote {...base} cite={url} />);
    const quotation = container.querySelector('blockquote');
    expect(quotation).toHaveAttribute('cite', url);
    expect(figureOf(container)).not.toHaveAttribute('cite');
    expect(container.querySelector('figcaption')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).not.toContain(url);
    rerender(<PullQuote {...base} cite={url} source='Contextual note' />);
    expect(container.querySelector('blockquote')).toHaveAttribute('cite', url);
    expect(container.querySelector('figcaption')?.textContent).toBe('Contextual note');
    rerender(<PullQuote {...base} source='Contextual note' cite='  ' />);
    expect(container.querySelector('blockquote')).not.toHaveAttribute('cite');
  });

  it('preserves caller punctuation and spacing without inserting marks or separators', () => {
    const { container } = render(<PullQuote text='Build ' accent='carefully.' />);
    expect(container.querySelector('p')?.textContent).toBe('Build carefully.');
    expect(container.textContent).toBe('Build carefully.');
  });

  it('renders the accent inside the same paragraph: inline for pull, block for display, never hidden', () => {
    const { container, rerender } = render(<PullQuote text='Ship it ' accent='today.' />);
    const accent = container.querySelector('p > span');
    expect(accent).toHaveClass('eg-quote__accent', 'inline');
    expect(accent).not.toHaveClass('block');
    expect(accent).not.toHaveAttribute('aria-hidden');
    rerender(<PullQuote text='Ship it ' accent='today.' variant='display' />);
    const displayAccent = container.querySelector('p > span');
    expect(displayAccent === accent).toBe(true);
    expect(displayAccent).toHaveClass('eg-quote__accent', 'block');
    expect(displayAccent).not.toHaveClass('inline');
    rerender(<PullQuote text='Ship it ' accent=' ' variant='display' />);
    expect(container.querySelector('.eg-quote__accent')).toBeNull();
    expect(container.querySelector('p')?.textContent).toBe('Ship it ');
  });

  it('renders HTML-looking strings literally', () => {
    const { container } = render(<PullQuote text='<b>bold</b>' accent='<i>x</i>' source='<a href="/">home</a>' />);
    expect(container.querySelector('b')).toBeNull();
    expect(container.querySelector('i')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('p')?.textContent).toBe('<b>bold</b><i>x</i>');
    expect(container.querySelector('figcaption')?.textContent).toBe('<a href="/">home</a>');
  });

  it('keeps display casing in CSS only: the original text is not uppercased', () => {
    const { container } = render(<PullQuote text='Mixed Case text' variant='display' />);
    expect(container.querySelector('p')?.textContent).toBe('Mixed Case text');
    expect(container.querySelector('blockquote')).toHaveClass('uppercase');
  });
});

describe('PullQuote blank input policy', () => {
  it('warns in development and renders nothing for blank text, even with source and accent', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(
      <PullQuote text={' \n\t'} accent='Accent' source='Source' cite='https://example.com' />
    );
    expect(container.childElementCount).toBe(0);
    expect(container.textContent).toBe('');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toMatch(/PullQuote.*text/);
  });

  it('recovers from blank text on rerender and stops warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container, rerender } = render(<PullQuote text='' source='Source' />);
    expect(container.childElementCount).toBe(0);
    rerender(<PullQuote text='Back again.' source='Source' />);
    expect(screen.getByRole('figure')).toHaveTextContent('Back again.Source');
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('does not warn for a valid quotation', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<PullQuote {...base} />);
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('PullQuote native forwarding', () => {
  it('forwards compatible native attributes to the figure only', () => {
    const { container } = render(
      <PullQuote {...base} id='quote-1' title='Quote' lang='en' dir='ltr' data-testid='q' aria-describedby='note' />
    );
    const figure = figureOf(container);
    expect(figure).toHaveAttribute('id', 'quote-1');
    expect(figure).toHaveAttribute('title', 'Quote');
    expect(figure).toHaveAttribute('lang', 'en');
    expect(figure).toHaveAttribute('dir', 'ltr');
    expect(figure).toHaveAttribute('data-testid', 'q');
    expect(figure).toHaveAttribute('aria-describedby', 'note');
    const quotation = container.querySelector('blockquote');
    expect(quotation).not.toHaveAttribute('id');
    expect(quotation).not.toHaveAttribute('data-testid');
    expect(container.querySelector('[aria-labelledby]')).toBeNull();
    expect(container.querySelector('[aria-label]')).toBeNull();
  });

  it('discards untyped role, children and HTML injection before forwarding', () => {
    const untyped = {
      role: 'presentation',
      children: 'Injected child',
      dangerouslySetInnerHTML: { __html: '<em>Injected</em>' }
    } as unknown as Partial<PullQuoteProps>;
    const { container } = render(<PullQuote {...base} {...untyped} />);
    const figure = figureOf(container);
    expect(figure).not.toHaveAttribute('role');
    expect(container.querySelector('em')).toBeNull();
    expect(container.textContent).toBe(base.text);
  });

  it('rejects unsupported props at the type level', () => {
    // @ts-expect-error text is required.
    const missingText: PullQuoteProps = {};
    // @ts-expect-error Content is the text/accent/source strings, not children.
    const withChildren: PullQuoteProps = { ...base, children: 'Child' };
    // @ts-expect-error The figure role is owned.
    const withRole: PullQuoteProps = { ...base, role: 'heading' };
    // @ts-expect-error No HTML injection.
    const withHtml: PullQuoteProps = { ...base, dangerouslySetInnerHTML: { __html: '' } };
    // @ts-expect-error Only pull and display exist.
    const invalidVariant: PullQuoteProps = { ...base, variant: 'hero' };
    // @ts-expect-error Only canvas and raised tones exist.
    const invalidTone: PullQuoteProps = { ...base, tone: 'flood' };
    // @ts-expect-error No asChild composition API.
    const composed: PullQuoteProps = { ...base, asChild: true };
    expect([missingText, withChildren, withRole, withHtml, invalidVariant, invalidTone, composed]).toHaveLength(7);
  });
});

describe('PullQuote appearance contract', () => {
  it('uses logical inline-start filet and inset for pull, never physical left utilities', () => {
    const { container } = render(<PullQuote {...base} dir='rtl' />);
    const figure = figureOf(container);
    expect(figure).toHaveAttribute('dir', 'rtl');
    expect(figure).toHaveClass('ps-4.5', 'border-s-[length:calc(var(--border-width)*2)]', 'border-fg-brand-default');
    for (const name of Array.from(figure?.classList ?? [])) {
      expect(name).not.toMatch(/^(?:border-l|pl-|left-|border-r|pr-)/);
    }
  });

  it('drops the filet, inset and measure cap for display', () => {
    const { container } = render(<PullQuote {...base} variant='display' />);
    const figure = figureOf(container);
    expect(figure).toHaveClass('max-w-none', 'border-0', 'p-0', 'gap-5.5');
    expect(figure).not.toHaveClass('max-w-quote-pull');
    expect(figure).not.toHaveClass('ps-4.5');
    expect(Array.from(figure?.classList ?? []).some((name) => name.startsWith('border-s-'))).toBe(false);
    expect(container.querySelector('blockquote')).toHaveClass('text-quote-display', 'font-display');
  });

  it('changes only the accent between canvas and raised tones', () => {
    const props = { ...base, accent: ' Now.', source: 'Source' } satisfies PullQuoteProps;
    const { container, rerender } = render(<PullQuote {...props} />);
    const snapshot = () => ({
      root: figureOf(container)?.className,
      quotation: container.querySelector('blockquote')?.className,
      passage: container.querySelector('p')?.className,
      caption: container.querySelector('figcaption')?.className
    });
    const canvas = snapshot();
    expect(container.querySelector('.eg-quote__accent')).toHaveClass('text-fg-brand-default');
    rerender(<PullQuote {...props} tone='raised' />);
    expect(snapshot()).toEqual(canvas);
    const accent = container.querySelector('.eg-quote__accent');
    expect(accent).toHaveClass('text-fg-brand-raised');
    expect(accent).not.toHaveClass('text-fg-brand-default');
    for (const name of Array.from(figureOf(container)?.classList ?? [])) {
      expect(name).not.toMatch(/^(?:bg-|shadow|backdrop-|animate-|transition)/);
    }
  });

  it('merges outer layout className on the root only, keeping markers and the pull measure', () => {
    const { container } = render(<PullQuote {...base} source='Source' className='mt-8 w-64 self-center' />);
    const figure = figureOf(container);
    expect(figure).toHaveClass('eg-quote', 'max-w-quote-pull', 'mt-8', 'w-64', 'self-center');
    expect(container.querySelector('blockquote')).not.toHaveClass('mt-8');
    expect(container.querySelector('figcaption')).not.toHaveClass('w-64');
  });

  it('updates content in place without replacing the figure or announcing', () => {
    const { container, rerender } = render(<PullQuote {...base} source='First' />);
    const figure = figureOf(container);
    rerender(<PullQuote text='Second passage.' source='Second' variant='display' tone='raised' />);
    expect(figureOf(container) === figure).toBe(true);
    expect(figure).toHaveTextContent('Second passage.Second');
    expect(container.querySelector('[aria-live]')).toBeNull();
    expect(document.activeElement === document.body).toBe(true);
  });
});
