import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef } from 'react';
import { createRef, forwardRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Link } from './Link';
import { type LinkVariant, linkVariants } from './types';
import { useLink } from './useLink';

const tokens = (value: string) => value.split(/\s+/).filter(Boolean).sort();

const RouterLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>((props, ref) => (
  <a {...props} ref={ref} />
));

describe('Link navigation contract', () => {
  it('renders the native destination, public marker and decorative small right arrow by default', () => {
    render(<Link href='#articles'>All articles</Link>);
    const link = screen.getByRole('link', { name: 'All articles' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#articles');
    expect(link).toHaveClass(
      'eg-link',
      'text-label-default',
      'text-link-default',
      'underline',
      'underline-offset-(--space-1)',
      'hover:no-underline',
      'items-center',
      'border-0',
      'pb-0'
    );
    for (const oldClass of [
      'no-underline',
      'hover:text-link-hover',
      'border-b',
      'border-border-brand',
      'text-fg-default',
      'text-fg-brand-raised',
      'hover:text-primitive-red-200'
    ]) {
      expect(link).not.toHaveClass(oldClass);
    }
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    const arrow = link.querySelector('svg');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
    expect(arrow).toHaveAttribute('focusable', 'false');
    expect(arrow).toHaveClass('eg-icon', 'size-4', 'transform-none');
    expect(arrow?.innerHTML).toContain('M5 12h14');
    expect(link.querySelector('span')).toBeNull();
  });

  it('derives hook defaults, arrow direction and safe deduplicated rel tokens', () => {
    const { result, rerender } = renderHook(
      ({ external }) => useLink({ href: '#docs', children: 'Docs', external, rel: 'author noopener author' }),
      { initialProps: { external: false } }
    );
    expect(result.current.arrowName).toBe('arrow-right');
    expect(result.current.showArrow).toBe(true);
    expect(result.current.rootProps.rel).toBe('author noopener author');
    expect(result.current.rootProps.target).toBeUndefined();
    rerender({ external: true });
    expect(result.current.arrowName).toBe('arrow-right');
    expect(result.current.rootProps.target).toBe('_blank');
    expect(result.current.rootProps.rel).toBe('author noopener noreferrer');
    expect(result.current.newTabText).toBe('(opens in a new tab)');
  });

  it('announces external navigation and overrides a conflicting native target', () => {
    render(
      <Link href='https://example.com' external={true} target='_self' rel='author noreferrer'>
        Repository
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Repository (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(new Set(link.getAttribute('rel')?.split(' '))).toEqual(new Set(['author', 'noopener', 'noreferrer']));
    expect(link.querySelector('svg')?.innerHTML).toContain('M5 12h14');
    const notice = screen.getByText('(opens in a new tab)');
    expect(notice).not.toHaveAttribute('aria-hidden');
    expect(notice.style.position).toBe('absolute');
  });

  it('localizes the notice, hides only the arrow and removes external additions on rerender', () => {
    const { rerender } = render(
      <Link href='#docs' external={true} arrow={false} newTabText='(new window)'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs (new window)' }).querySelector('svg')).toBeNull();
    rerender(
      <Link href='#docs' arrow={false} newTabText='(new window)'>
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    expect(screen.queryByText('(new window)')).toBeNull();
  });

  it('preserves native attributes, supported layout and native refs without leaking own props', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link
        href='#docs'
        ref={ref}
        id='docs'
        title='Read docs'
        lang='en'
        data-purpose='help'
        aria-describedby='hint'
        className='mt-2 mt-4 self-start'
      >
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(ref.current === link).toBe(true);
    expect(link).toHaveClass('eg-link', 'mt-4', 'self-start');
    expect(link).not.toHaveClass('mt-2');
    expect(link).toHaveAttribute('aria-describedby', 'hint');
    expect(link).toHaveAttribute('data-purpose', 'help');
    expect(link).toHaveAttribute('title', 'Read docs');
    for (const prop of ['external', 'newTabText', 'asChild', 'arrow']) {
      expect(link).not.toHaveAttribute(prop);
    }
  });

  it('slots one router-like anchor, composing refs, child events, layout and appended content', async () => {
    const user = userEvent.setup();
    const parentRef = createRef<HTMLAnchorElement>();
    const childRef = createRef<HTMLAnchorElement>();
    const parentClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const childClick = vi.fn();
    render(
      <Link asChild={true} ref={parentRef} onClick={parentClick} className='mt-4'>
        <RouterLink href='#router' ref={childRef} onClick={childClick} className='self-start'>
          Router docs
        </RouterLink>
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Router docs' });
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(link).toHaveClass('eg-link', 'mt-4', 'self-start', 'text-link-default', 'underline', 'hover:no-underline');
    expect(link).not.toHaveClass('hover:text-link-hover');
    expect(parentRef.current === link && childRef.current === link).toBe(true);
    expect(link.querySelector('svg')).not.toBeNull();
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(childClick).toHaveBeenCalledOnce();
    expect(parentClick).toHaveBeenCalledOnce();
    expect(childClick.mock.invocationCallOrder[0]).toBeLessThan(parentClick.mock.invocationCallOrder[0] ?? 0);
  });

  it('keeps external safety and notice even when the slotted anchor supplies target and rel', () => {
    render(
      <Link asChild={true} external={true} rel='author' newTabText='(new window)'>
        <RouterLink href='#router' target='_self' rel='help noreferrer'>
          Router docs
        </RouterLink>
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Router docs (new window)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(new Set(link.getAttribute('rel')?.split(' '))).toEqual(
      new Set(['author', 'help', 'noopener', 'noreferrer'])
    );
    expect(link.querySelector('svg')?.innerHTML).toContain('M5 12h14');
  });

  it('leaves ordinary native and slotted targets/rel untouched when external is false', () => {
    const { rerender } = render(
      <Link href='#docs' target='details' rel='help'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link')).toHaveAttribute('target', 'details');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'help');
    rerender(
      <Link asChild={true}>
        <RouterLink href='#router' target='router' rel='bookmark'>
          Docs
        </RouterLink>
      </Link>
    );
    expect(screen.getByRole('link')).toHaveAttribute('target', 'router');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'bookmark');
  });

  it('uses native Tab/Enter and forwards click prevention without custom keyboard handlers', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    render(
      <Link href='#docs' onClick={onClick}>
        Docs
      </Link>
    );
    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('link')).not.toHaveAttribute('role');
    expect(screen.getByRole('link')).not.toHaveAttribute('tabindex');
  });

  it('provides scoped hover, focus and reduced-motion utilities while resetting legacy transforms', () => {
    const { result } = renderHook(() => useLink({ href: '#docs', children: 'Docs' }));
    expect(result.current.rootProps.className).toContain('group/link');
    expect(result.current.rootProps.className).toContain('focus-visible:[box-shadow:var(--shadow-focus)]');
    expect(result.current.rootProps.className).toContain('motion-reduce:transition-none');
    for (const utility of ['focus-visible:outline-none', 'focus-visible:rounded-sm']) {
      expect(tokens(result.current.rootProps.className as string)).toContain(utility);
    }
    expect(result.current.arrowClassName).toContain('transform-none');
    expect(result.current.arrowClassName).toContain('motion-safe:group-hover/link:translate-x-1');
    expect(result.current.arrowClassName).not.toContain('translate-y');
    expect(result.current.arrowClassName).toContain('self-center');
    expect(result.current.arrowClassName).toContain('duration-(--duration-fast)');
    expect(result.current.arrowClassName).toContain('ease-(--ease-out)');
    expect(result.current.arrowClassName).toContain('motion-reduce:translate-none');
    expect(result.current.arrowClassName).toContain('motion-reduce:transition-none');
  });

  it('server-renders native and slotted anchors with safe external semantics', () => {
    const html = renderToString(
      <Link href='#docs' external={true}>
        Docs
      </Link>
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('noopener noreferrer');
    expect(html).toContain('(opens in a new tab)');
    const slotted = renderToString(
      <Link asChild={true}>
        <RouterLink href='#router'>Router docs</RouterLink>
      </Link>
    );
    expect(slotted.startsWith('<a ')).toBe(true);
    expect(slotted).toContain('eg-link');
    expect(slotted).toContain('href="#router"');
    expect(slotted).not.toContain('asChild');
  });
});

describe('Link underline treatment and deprecated underlined alias', () => {
  it('underlines the label at rest with a token offset and removes it on hover without a colour change', () => {
    const recipe = tokens(linkVariants());
    for (const utility of ['underline', 'underline-offset-(--space-1)', 'hover:no-underline', 'text-link-default']) {
      expect(recipe).toContain(utility);
    }
    for (const utility of ['no-underline', 'hover:text-link-hover', 'hover:underline']) {
      expect(recipe).not.toContain(utility);
    }
    expect(recipe.filter((utility) => utility.startsWith('underline-offset-'))).toEqual([
      'underline-offset-(--space-1)'
    ]);
    expect(recipe.filter((utility) => utility.startsWith('hover:text-'))).toEqual([]);
  });

  it('keeps the plain recipe as the default, including its legacy border and padding reset', () => {
    const plain = linkVariants({ variant: 'plain' });
    expect(tokens(plain)).toEqual(tokens(linkVariants()));
    expect(tokens(linkVariants())).toContain('border-0');
    expect(tokens(linkVariants())).toContain('pb-0');
    for (const utility of ['border-b', 'border-border-brand', 'pb-0.5', 'hover:border-state-selected']) {
      expect(tokens(plain)).not.toContain(utility);
    }
  });

  it('resolves the deprecated underlined variant to exactly the default recipe', () => {
    const deprecatedAlias: LinkVariant = 'underlined';
    expect(tokens(linkVariants({ variant: deprecatedAlias }))).toEqual(tokens(linkVariants()));
    const { result } = renderHook(() => useLink({ href: '#docs', children: 'Docs', variant: deprecatedAlias }));
    const defaults = renderHook(() => useLink({ href: '#docs', children: 'Docs' }));
    expect(tokens(result.current.rootProps.className as string)).toEqual(
      tokens(defaults.result.current.rootProps.className as string)
    );
    expect(result.current.arrowClassName).toBe(defaults.result.current.arrowClassName);
  });

  it('renders underlined with the default classes, ink, marker and decorative arrow', () => {
    render(
      <>
        <Link href='#docs' variant='underlined'>
          Docs
        </Link>
        <Link href='#docs'>Default docs</Link>
      </>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    const reference = screen.getByRole('link', { name: 'Default docs' });
    expect(tokens(link.className)).toEqual(tokens(reference.className));
    expect(link).toHaveClass('eg-link', 'text-link-default', 'underline', 'hover:no-underline', 'border-0', 'pb-0');
    for (const oldClass of [
      'no-underline',
      'hover:text-link-hover',
      'border-b',
      'border-border-brand',
      'pb-0.5',
      'hover:border-state-selected'
    ]) {
      expect(link).not.toHaveClass(oldClass);
    }
    expect(link).not.toHaveAttribute('variant');
    expect(link.style.textDecoration).toBe('');
    const arrow = link.querySelector('svg');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
    expect(arrow).toHaveAttribute('focusable', 'false');
    expect(arrow).toHaveClass('size-4');
    expect(arrow?.getAttribute('class')).toBe(reference.querySelector('svg')?.getAttribute('class'));
    expect(arrow?.innerHTML).toContain('M5 12h14');
    expect(link.querySelector('span')).toBeNull();
  });

  it('falls back to the plain recipe for a runtime variant outside the union', () => {
    const { result } = renderHook(() =>
      useLink({ href: '#docs', children: 'Docs', variant: 'primary' as unknown as LinkVariant })
    );
    expect(tokens(result.current.rootProps.className as string)).toContain('border-0');
    expect(tokens(result.current.rootProps.className as string)).toContain('pb-0');
    expect(tokens(result.current.rootProps.className as string)).not.toContain('border-b');
  });

  it('keeps new-tab safety, the hidden notice and arrow visibility for the deprecated underlined alias', () => {
    const { rerender } = render(
      <Link href='https://example.com' external={true} variant='underlined'>
        Repository
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Repository (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(new Set(link.getAttribute('rel')?.split(' '))).toEqual(new Set(['noopener', 'noreferrer']));
    expect(link.querySelector('svg')?.innerHTML).toContain('M5 12h14');
    expect(screen.getByText('(opens in a new tab)').style.position).toBe('absolute');
    rerender(
      <Link href='https://example.com' external={true} variant='underlined' arrow={false}>
        Repository
      </Link>
    );
    const withoutArrow = screen.getByRole('link', { name: 'Repository (opens in a new tab)' });
    expect(withoutArrow.querySelector('svg')).toBeNull();
    expect(withoutArrow).toHaveClass('underline', 'hover:no-underline');
    expect(withoutArrow).not.toHaveClass('border-b');
  });

  it('merges consumer layout last, keeps the marker and never leaks own props for either mode', () => {
    const { rerender } = render(
      <Link href='#docs' variant='underlined' className='mt-2 mt-4 self-start'>
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('eg-link', 'mt-4', 'self-start', 'underline');
    expect(link).not.toHaveClass('border-b');
    expect(link).not.toHaveClass('mt-2');
    for (const prop of ['variant', 'external', 'newTabText', 'asChild', 'arrow']) {
      expect(link).not.toHaveAttribute(prop);
    }
    rerender(
      <Link asChild={true} variant='underlined' className='self-start'>
        <RouterLink href='#router'>Router docs</RouterLink>
      </Link>
    );
    const slotted = screen.getByRole('link', { name: 'Router docs' });
    expect(slotted).toHaveClass('eg-link', 'self-start', 'underline', 'hover:no-underline');
    expect(slotted).not.toHaveClass('border-b');
    expect(slotted).not.toHaveAttribute('variant');
  });
});

// The v0.4 class set that plain and underlined keep, written out once so that moving the ink out of the shared
// base cannot drift silently. Compared as a set: string order is not part of the contract.
const v04Recipe = [
  'border-0',
  'cursor-pointer',
  'duration-(--duration-fast)',
  'ease-(--ease-out)',
  'eg-link',
  'focus-visible:[box-shadow:var(--shadow-focus)]',
  'focus-visible:outline-none',
  'focus-visible:rounded-sm',
  'font-sans',
  'gap-2',
  'group/link',
  'hover:no-underline',
  'inline-flex',
  'items-center',
  'motion-reduce:transition-none',
  'pb-0',
  'text-label-default',
  'text-link-default',
  'transition-colors',
  'underline',
  'underline-offset-(--space-1)'
].sort();
const v04Arrow =
  'self-center shrink-0 transform-none transition-[translate] duration-(--duration-fast) ease-(--ease-out) motion-safe:group-hover/link:translate-x-1 motion-reduce:translate-none motion-reduce:transition-none';

const rootTokens = (variant?: LinkVariant) =>
  tokens(
    renderHook(() => useLink({ href: '#docs', children: 'Docs', variant })).result.current.rootProps.className ?? ''
  );

// A text-colour utility is any text-* utility that is not the label font-size step; decoration-* sets the
// text-decoration colour. Counting them per group is what proves no variant emits two of one group.
const textColours = (list: string[]) => list.filter((name) => /^text-(?!label-default$)/.test(name));
const fontSizes = (list: string[]) => list.filter((name) => name === 'text-label-default');
const decorationColours = (list: string[]) => list.filter((name) => name.startsWith('decoration-'));

// Guard: quiet must own its ink, so a vacuous pass against the plain fallback is impossible.
const expectQuietInk = (list: string[]) => {
  expect(list).toContain('text-fg-default');
  expect(list).toContain('decoration-fg-brand-default');
  expect(list).not.toContain('text-link-default');
};

describe('Link quiet variant', () => {
  it('preserves the v0.4 class set of plain, underlined and the default, on the root and the arrow', () => {
    expect(tokens(linkVariants())).toEqual(v04Recipe);
    expect(tokens(linkVariants({ variant: 'plain' }))).toEqual(v04Recipe);
    expect(tokens(linkVariants({ variant: 'underlined' }))).toEqual(v04Recipe);
    expect(rootTokens()).toEqual(v04Recipe);
    expect(rootTokens('underlined')).toEqual(v04Recipe);
    render(
      <>
        <Link href='#default'>Default docs</Link>
        <Link href='#plain' variant='plain'>
          Plain docs
        </Link>
        <Link href='#underlined' variant='underlined'>
          Underlined docs
        </Link>
      </>
    );
    for (const name of ['Default docs', 'Plain docs', 'Underlined docs']) {
      expect(tokens(screen.getByRole('link', { name }).className), name).toEqual(v04Recipe);
    }
    const { result } = renderHook(() => useLink({ href: '#docs', children: 'Docs' }));
    expect(result.current.arrowClassName).toBe(v04Arrow);
  });

  it('accepts quiet as a typed variant, never forwards it to the DOM and keeps plain as the default', () => {
    const quietVariant: LinkVariant = 'quiet';
    render(
      <>
        <Link href='#quiet' variant={quietVariant}>
          Quiet docs
        </Link>
        <Link href='#default'>Default docs</Link>
      </>
    );
    const quiet = screen.getByRole('link', { name: 'Quiet docs' });
    const fallback = screen.getByRole('link', { name: 'Default docs' });
    expectQuietInk(tokens(quiet.className));
    expect(quiet).toHaveClass('eg-link');
    expect(quiet).not.toHaveAttribute('variant');
    expect(fallback).toHaveClass('text-link-default');
    expect(fallback).not.toHaveClass('text-fg-default');
  });

  it('emits the plain set with the ink swapped for the neutral ink and the brand underline for quiet', () => {
    const plain = tokens(linkVariants({ variant: 'plain' }));
    const quiet = tokens(linkVariants({ variant: 'quiet' }));
    expectQuietInk(quiet);
    expect(quiet).toEqual(
      [...plain.filter((name) => name !== 'text-link-default'), 'text-fg-default', 'decoration-fg-brand-default'].sort()
    );
    expect(quiet).toHaveLength(22);
    for (const utility of [
      'eg-link',
      'text-fg-default',
      'decoration-fg-brand-default',
      'underline',
      'underline-offset-(--space-1)',
      'hover:no-underline',
      'text-label-default',
      'border-0',
      'pb-0'
    ]) {
      expect(quiet).toContain(utility);
    }
    for (const utility of ['text-link-default', 'no-underline', 'border-b', 'pb-0.5']) {
      expect(quiet).not.toContain(utility);
    }
    expect(quiet.filter((name) => /^hover:(text-|decoration-|underline$)/.test(name))).toEqual([]);
  });

  it('never emits two utilities of one group for any variant, in the recipe or in the rendered classes', () => {
    const cases = [
      ['plain', 'text-link-default', []],
      ['underlined', 'text-link-default', []],
      ['quiet', 'text-fg-default', ['decoration-fg-brand-default']]
    ] as const;
    for (const [variant, ink, decoration] of cases) {
      render(
        <Link href={`#${variant}`} variant={variant}>
          {`${variant} docs`}
        </Link>
      );
      const rendered = tokens(screen.getByRole('link', { name: `${variant} docs` }).className);
      for (const list of [tokens(linkVariants({ variant })), rendered]) {
        expect(textColours(list), `${variant} text colour`).toEqual([ink]);
        expect(fontSizes(list), `${variant} font size`).toEqual(['text-label-default']);
        expect(decorationColours(list), `${variant} decoration colour`).toEqual([...decoration]);
      }
    }
  });

  it('removes the underline on hover for quiet without a hover colour and keeps the arrow identical', () => {
    const quiet = rootTokens('quiet');
    expectQuietInk(quiet);
    expect(quiet).toContain('hover:no-underline');
    expect(quiet.filter((name) => /^hover:(text-|decoration-|underline$)/.test(name))).toEqual([]);
    const arrow = (variant: LinkVariant) =>
      renderHook(() => useLink({ href: '#docs', children: 'Docs', variant })).result.current.arrowClassName;
    expect(arrow('quiet')).toBe(arrow('plain'));
    expect(arrow('underlined')).toBe(arrow('plain'));
    expect(arrow('quiet')).toBe(v04Arrow);
  });

  it('keeps the focus ring, the reduced-motion fallbacks and the tab order on quiet', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useLink({ href: '#docs', children: 'Docs', variant: 'quiet' }));
    const root = tokens(result.current.rootProps.className ?? '');
    expectQuietInk(root);
    for (const utility of [
      'focus-visible:outline-none',
      'focus-visible:[box-shadow:var(--shadow-focus)]',
      'focus-visible:rounded-sm',
      'motion-reduce:transition-none'
    ]) {
      expect(root).toContain(utility);
    }
    const arrow = tokens(result.current.arrowClassName);
    for (const utility of ['motion-reduce:translate-none', 'motion-reduce:transition-none']) {
      expect(arrow).toContain(utility);
    }
    render(
      <Link href='#docs' variant='quiet'>
        Docs
      </Link>
    );
    await user.tab();
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveFocus();
  });

  it('keeps new-tab safety, the hidden notice and the arrow choice for quiet', () => {
    const { rerender } = render(
      <Link href='https://example.com' external={true} variant='quiet' rel='author'>
        Repository
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Repository (opens in a new tab)' });
    expectQuietInk(tokens(link.className));
    expect(link).toHaveAttribute('target', '_blank');
    expect(new Set(link.getAttribute('rel')?.split(' '))).toEqual(new Set(['author', 'noopener', 'noreferrer']));
    expect(link.querySelector('svg')?.innerHTML).toContain('M5 12h14');
    expect(screen.getByText('(opens in a new tab)').style.position).toBe('absolute');
    // The footer-navigation case: no arrow, so the underline is the only feedback.
    rerender(
      <Link href='https://example.com' external={true} variant='quiet' arrow={false}>
        Repository
      </Link>
    );
    const withoutArrow = screen.getByRole('link', { name: 'Repository (opens in a new tab)' });
    expectQuietInk(tokens(withoutArrow.className));
    expect(withoutArrow.querySelector('svg')).toBeNull();
    expect(withoutArrow).toHaveClass('underline', 'underline-offset-(--space-1)', 'hover:no-underline');
  });

  it('slots one router anchor for quiet, composing refs and events with native Tab and Enter', async () => {
    const user = userEvent.setup();
    const parentRef = createRef<HTMLAnchorElement>();
    const childRef = createRef<HTMLAnchorElement>();
    const parentClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const childClick = vi.fn();
    render(
      <Link asChild={true} variant='quiet' ref={parentRef} onClick={parentClick} className='mt-4'>
        <RouterLink href='#router' ref={childRef} onClick={childClick} className='self-start'>
          Router docs
        </RouterLink>
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Router docs' });
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expectQuietInk(tokens(link.className));
    expect(link).toHaveClass('eg-link', 'mt-4', 'self-start', 'underline', 'hover:no-underline');
    expect(parentRef.current === link && childRef.current === link).toBe(true);
    expect(link.querySelector('svg')).not.toBeNull();
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(childClick).toHaveBeenCalledOnce();
    expect(parentClick).toHaveBeenCalledOnce();
    expect(childClick.mock.invocationCallOrder[0]).toBeLessThan(parentClick.mock.invocationCallOrder[0] ?? 0);
  });

  it('server-renders quiet native and slotted anchors with the neutral ink and no variant attribute', () => {
    const html = renderToString(
      <Link href='#docs' external={true} variant='quiet'>
        Docs
      </Link>
    );
    for (const text of [
      'eg-link',
      'text-fg-default',
      'decoration-fg-brand-default',
      'target="_blank"',
      'noopener noreferrer',
      '(opens in a new tab)'
    ]) {
      expect(html).toContain(text);
    }
    expect(html).not.toContain('text-link-default');
    expect(html).not.toContain('variant=');
    const slotted = renderToString(
      <Link asChild={true} variant='quiet'>
        <RouterLink href='#router'>Router docs</RouterLink>
      </Link>
    );
    expect(slotted.startsWith('<a ')).toBe(true);
    expect(slotted).toContain('text-fg-default');
    expect(slotted).toContain('href="#router"');
    expect(slotted).not.toContain('asChild');
    expect(slotted).not.toContain('variant=');
  });

  it('passes quiet and underlined through the hook and resolves every other runtime value to plain', () => {
    const plain = rootTokens('plain');
    for (const utility of ['text-link-default', 'border-0', 'pb-0']) {
      expect(plain, `plain ${utility}`).toContain(utility);
    }
    const quiet = rootTokens('quiet');
    expectQuietInk(quiet);
    expect(quiet).not.toEqual(plain);
    expect(rootTokens('underlined')).toEqual(plain);
    for (const value of ['primary', 'Quiet', '', null, undefined]) {
      // Never a partial class set: the retained legacy border and padding resets must always be present.
      expect(rootTokens(value as unknown as LinkVariant), `runtime value ${JSON.stringify(value)}`).toEqual(plain);
    }
  });

  it('merges consumer layout last on quiet, keeps the marker and never leaks own props for either mode', () => {
    const { rerender } = render(
      <Link href='#docs' variant='quiet' className='mt-2 mt-4 self-start'>
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expectQuietInk(tokens(link.className));
    expect(link).toHaveClass('eg-link', 'mt-4', 'self-start', 'underline');
    expect(link).not.toHaveClass('mt-2');
    for (const prop of ['variant', 'external', 'newTabText', 'asChild', 'arrow']) {
      expect(link).not.toHaveAttribute(prop);
    }
    rerender(
      <Link asChild={true} variant='quiet' className='self-start'>
        <RouterLink href='#router'>Router docs</RouterLink>
      </Link>
    );
    const slotted = screen.getByRole('link', { name: 'Router docs' });
    expectQuietInk(tokens(slotted.className));
    expect(slotted).toHaveClass('eg-link', 'self-start', 'underline', 'hover:no-underline');
    for (const prop of ['variant', 'external', 'newTabText', 'asChild', 'arrow']) {
      expect(slotted).not.toHaveAttribute(prop);
    }
  });
});

// Token arithmetic only: it proves the ratios the spec promises, not rendered contrast, focus visibility or
// anything over a translucent backdrop. The colours come from the classes quiet emits, so a changed recipe
// changes the numbers instead of leaving a free-standing token check green.
describe('Link quiet contrast on the tonal surfaces', () => {
  const theme = readFileSync(resolve(import.meta.dirname, '../../../../tokens/src/theme.css'), 'utf8');
  const declarations = new Map<string, string>();
  for (const [, name, value] of theme.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    if (name && value) {
      declarations.set(name, value.trim());
    }
  }
  const resolveToken = (name: string, seen: string[] = []): string => {
    const value = declarations.get(name);
    if (value === undefined || seen.includes(name)) {
      throw new Error(`Cannot resolve ${name} from theme.css`);
    }
    return value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, target: string) => resolveToken(target, [...seen, name]));
  };
  const luminance = (hex: string) => {
    if (!/^#[\da-f]{6}$/i.test(hex)) {
      throw new Error(`Expected a six-digit hex colour, got ${hex}`);
    }
    const [red = 0, green = 0, blue = 0] = [1, 3, 5].map((index) => {
      const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const contrast = (first: string, second: string) => {
    const [lighter = 0, darker = 0] = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
  };
  // text-<x> and decoration-<x> read --color-<x>; any other emitted utility is a failure of the recipe.
  const colourOf = (utility: string | undefined, prefix: string) => {
    if (!utility?.startsWith(prefix)) {
      throw new Error(`quiet emits no ${prefix}* colour utility`);
    }
    return resolveToken(`--color-${utility.slice(prefix.length)}`);
  };

  it('keeps the emitted ink at 4.5:1 and the emitted underline at 3:1 on surface-0 to surface-3', () => {
    const emitted = tokens(linkVariants({ variant: 'quiet' }));
    const ink = colourOf(textColours(emitted)[0], 'text-');
    const underline = colourOf(decorationColours(emitted)[0], 'decoration-');
    for (const [surface, inkRatio, underlineRatio] of [
      ['surface-0', '18.26', '4.61'],
      ['surface-1', '17.02', '4.30'],
      ['surface-2', '15.50', '3.92'],
      ['surface-3', '13.55', '3.42']
    ] as const) {
      const background = resolveToken(`--color-${surface}`);
      expect(contrast(ink, background), `ink on ${surface}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(underline, background), `underline on ${surface}`).toBeGreaterThanOrEqual(3);
      expect(contrast(ink, background).toFixed(2), `ink ratio on ${surface}`).toBe(inkRatio);
      expect(contrast(underline, background).toFixed(2), `underline ratio on ${surface}`).toBe(underlineRatio);
    }
  });
});
