import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Text } from './Text';
import type { TextProps } from './types';
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
