import type { StoryObj } from '@storybook/react-vite';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentPropsWithoutRef, createElement, Fragment, type ReactElement, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Icon } from '../../atoms/icon';
import { Link } from '../../atoms/link';
import { Logo } from '../../atoms/logo';
import * as publicUi from '../../index';
import { cn } from '../../lib/cn';
import { SocialLinks } from '../../molecules/social-links';
import { Footer, FooterBrand, FooterLegal, FooterMotto, FooterNavigation, FooterSocial } from './Footer';
import * as stories from './Footer.stories';
import { CurrentPage, Default, Invalid, Minimal, Social } from './Footer.stories';
import type { FooterRegister } from './index';
import { type FooterNavigationItem, type FooterProps, footerNavigationLinkVariants } from './types';

type Assert<T extends true> = T;
// @ts-expect-error The current-page token is restricted to 'page'; 'step' is outside the contract (FT-16).
type InvalidCurrent = Assert<'step' extends FooterNavigationItem['aria-current'] ? true : false>;
export type TypeNegatives = [InvalidCurrent];

// v0.4 (#561, #565): Footer's own inputs are exactly wrap and register (children shares its native name), a fade input
// is outside the contract because the host owns the group-edge fade, and the register type is public (FT-27, FT-30).
type OwnFooterKeys = Exclude<keyof FooterProps, keyof ComponentPropsWithoutRef<'footer'>>;
type OwnKeysAreWrapAndRegister = Assert<
  [OwnFooterKeys] extends ['wrap' | 'register'] ? (['wrap' | 'register'] extends [OwnFooterKeys] ? true : false) : false
>;
// @ts-expect-error A group-edge fade input is outside the contract: the host owns the fade (OQ-2, FT-27).
type FadeInput = Assert<'fade' extends keyof FooterProps ? true : false>;
type RegisterIsPublic = Assert<
  [publicUi.FooterRegister] extends [FooterRegister]
    ? [FooterRegister] extends [publicUi.FooterRegister]
      ? true
      : false
    : false
>;
export type FooterV04TypeChecks = [OwnKeysAreWrapAndRegister, FadeInput, RegisterIsPublic];

// Typed fixtures double as the FT-16 positive assertions: an entry may carry the mark and a plain
// { href, label } entry still compiles. `pnpm typecheck` checks them; vitest does not.
const plain: FooterNavigationItem = { href: '#one', label: 'One' };
const current: FooterNavigationItem = { href: '#two', label: 'Two', 'aria-current': 'page' };
const withItems = (items: FooterNavigationItem[]) => (
  <Footer>
    <FooterNavigation label='Explore' items={items} />
  </Footer>
);

// React logs a missing-key warning once per owner, so these cases keep this block ahead of every other render of a
// child that was not passed as a JSX child.
describe('Footer child keys (S5a)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // createElement(Footer, args) is what Storybook's default render does: the child travels through props, so React has
  // not validated it as a statically positioned JSX child and expects a key once the Footer lists it in a partition.
  // A story's args always carry its children, which the cast reflects.
  const fromArgs = (args: Partial<FooterProps> | undefined) => createElement(Footer, args as FooterProps);
  const fragmentArgs = { children: <FooterLegal>Legal</FooterLegal> };
  const keyWarnings = (error: { mock: { calls: unknown[][] } }) =>
    error.mock.calls.filter(([message]) => String(message).includes('unique "key" prop'));

  it.each([
    ['the Minimal story (legal)', () => fromArgs(Minimal.args)],
    ['the Invalid story (navigation)', () => fromArgs(Invalid.args)],
    ['the CurrentPage story (navigation)', () => fromArgs(CurrentPage.args)],
    [
      'a single motto (stage)',
      () =>
        fromArgs({
          children: (
            <FooterMotto>
              <p>Motto</p>
            </FooterMotto>
          )
        })
    ],
    ['a single brand (grid)', () => fromArgs({ children: <FooterBrand>Brand</FooterBrand> })],
    ['a single child inside a Fragment', () => fromArgs({ children: createElement(Fragment, fragmentArgs) })]
  ])('renders %s without a missing-key warning', (_name, build) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(build());
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(keyWarnings(error)).toEqual([]);
  });

  it('keeps entries of nested Fragments unique when they share a partition', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <Footer>
        <>
          <FooterBrand>Brand</FooterBrand>
          <>
            <FooterNavigation label='Nested' items={[{ href: '#one', label: 'One' }]} />
          </>
        </>
        <FooterNavigation label='Top' items={[{ href: '#two', label: 'Two' }]} />
        <div>Extra</div>
      </Footer>
    );
    expect(screen.getByRole('contentinfo')).toHaveTextContent('BrandNestedOneTopTwoExtra');
    expect(error).not.toHaveBeenCalled();
  });
});

describe('Footer contract', () => {
  it('exports the heading recipe and applies it to the story group headings and tagline (A6-AC2)', () => {
    expect(publicUi).toHaveProperty('footerHeadingVariants');
    const { unmount } = render(<Footer>{Default.args?.children}</Footer>);
    expect(screen.getByRole('heading', { name: 'Explore' })).toHaveClass('mb-3', 'text-label-eyebrow');
    expect(screen.getByRole('heading', { name: 'Elsewhere' })).toHaveClass('mb-3', 'text-label-eyebrow');
    expect(screen.getByText('Independent ideas and projects.')).toHaveClass('text-body-default', 'text-fg-secondary');
    unmount();
    render(<Footer>{Social.args?.children}</Footer>);
    expect(screen.getByRole('heading', { name: 'Elsewhere' })).toHaveClass('mb-3', 'text-label-eyebrow');
  });
  it('preserves composed regions and navigation targets alongside the new rhythm', () => {
    render(
      <Footer>
        <FooterBrand>
          <a href='/'>Home</a>
        </FooterBrand>
        <FooterNavigation label='Sections' items={[{ href: '#one', label: 'One' }]} />
        <FooterSocial>
          <a href='#social'>Social</a>
        </FooterSocial>
        <FooterLegal>
          <a href='#legal'>Legal</a>
        </FooterLegal>
      </Footer>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('HomeSectionsOneSocialLegal');
    expect(within(footer).getByRole('link', { name: 'One' })).toHaveClass('min-h-14', 'min-w-14');
    expect(within(footer).getByRole('link', { name: 'One' })).toHaveAttribute('href', '#one');
    expect(within(footer).getByRole('link', { name: 'Social' })).toHaveAttribute('href', '#social');
    expect(within(footer).getByRole('link', { name: 'Legal' })).toHaveAttribute('href', '#legal');
  });
  it('renders supplied parts in order without default content (FT-01)', () => {
    render(
      <Footer>
        <FooterMotto>
          <p>Motto</p>
        </FooterMotto>
        <FooterBrand>Brand</FooterBrand>
        <FooterNavigation label='Sections' items={[{ href: '#one', label: 'One' }]} />
        <FooterSocial>Social</FooterSocial>
        <FooterLegal>Legal</FooterLegal>
      </Footer>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('MottoBrandSectionsOneSocialLegal');
    expect(footer).toHaveClass('eg-footer');
  });
  it('renders only supplied wrappers and neutralizes retained legacy markers (FT-01, FT-06, FT-07)', () => {
    const { rerender } = render(
      <Footer>
        <FooterLegal>Legal</FooterLegal>
      </Footer>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer.querySelector('.eg-footer__stage')).toBeNull();
    expect(footer.querySelector('.eg-footer__grid')).toBeNull();
    expect(footer.querySelector('.eg-footer__legal')).toHaveClass('flex', 'flex-wrap', 'border-t-border-hairline');
    expect(footer).toHaveClass('relative', 'pb-8', 'border-t-border-hairline', 'border-b-border-hairline');
    rerender(
      <Footer>
        <FooterBrand>Brand</FooterBrand>
        <FooterNavigation label='Explore' items={[{ href: '#one', label: 'One' }]} />
      </Footer>
    );
    const grid = footer.querySelector('.eg-footer__grid');
    expect(grid).toHaveClass('grid', '[@media(width<=860px)]:grid-cols-2', 'border-t-border-hairline');
    expect(grid?.textContent).toBe('BrandExploreOne');
    expect(grid?.querySelector('ul')).toHaveClass('list-none', 'm-0', 'p-0');
    expect(footer.querySelector('.eg-footer__legal')).toBeNull();
    for (const marker of ['wrap', 'motto', 'tagline', 'heading', 'list', 'link', 'social']) {
      expect(footer.querySelector(`.eg-footer__${marker}`)).toBeNull();
    }
  });
  it('composes real brand and named social list without nested anchors or an arrow (FT-04)', () => {
    render(
      <Footer>
        <FooterBrand>
          <Logo href='/' label='Home' />
        </FooterBrand>
        <FooterNavigation label='Explore' items={[{ href: '#one', label: 'One' }]} />
        <FooterSocial>
          <h2>Elsewhere</h2>
          <SocialLinks
            label='Profiles'
            caption={null}
            variant='ghost'
            size='lg'
            items={[{ id: 'one', href: 'https://example.org', label: 'Profile', icon: <Icon name='github' /> }]}
          />
        </FooterSocial>
        <FooterLegal>
          <a href='#legal'>Legal</a>
        </FooterLegal>
      </Footer>
    );
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(footer).getByRole('list', { name: 'Profiles' })).toContainElement(
      screen.getByRole('link', { name: 'Profile' })
    );
    expect(within(footer).getAllByRole('navigation')).toHaveLength(1);
    expect(screen.queryByText('Follow me')).toBeNull();
    expect(screen.getByRole('link', { name: 'One' }).querySelector('svg')).toBeNull();
    expect(footer.querySelector('a a')).toBeNull();
    expect(screen.getByRole('link', { name: 'Legal' })).toHaveAttribute('href', '#legal');
  });
  it('forwards safe native props and strips protected root semantics (FT-05, FT-09)', () => {
    const unsafe = { role: 'button', tabIndex: 0, style: { color: 'red' }, asChild: true };
    render(
      <Footer {...unsafe} id='site-footer' data-purpose='site' className='w-full'>
        <FooterLegal className='mt-4'>Legal</FooterLegal>
      </Footer>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveAttribute('id', 'site-footer');
    expect(footer).toHaveAttribute('data-purpose', 'site');
    expect(footer).toHaveClass('w-full');
    expect(footer).not.toHaveAttribute('role');
    expect(footer).not.toHaveAttribute('tabindex');
    expect(footer).not.toHaveAttribute('style');
    expect(footer).not.toHaveAttribute('asChild');
    expect(footer.querySelector('.eg-footer__legal')).toHaveClass('mt-4');
  });
  it('applies the local target recipe only to navigation links (FT-08 amendment)', () => {
    render(
      <Footer>
        <FooterBrand>
          <a href='/'>Home</a>
        </FooterBrand>
        <FooterNavigation
          label='Sections'
          items={[
            { href: '#one', label: 'One' },
            { href: '#two', label: 'Two' }
          ]}
        />
        <FooterSocial>
          <a href='#social'>Social</a>
        </FooterSocial>
        <FooterLegal>
          <a href='#legal'>Legal</a>
        </FooterLegal>
      </Footer>
    );
    const links = within(screen.getByRole('navigation', { name: 'Sections' })).getAllByRole('link');
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveClass('min-h-14', 'min-w-14', 'inline-flex', 'items-center', 'justify-start');
    }
    for (const name of ['Home', 'Social', 'Legal']) {
      expect(screen.getByRole('link', { name })).not.toHaveClass('min-h-14');
      expect(screen.getByRole('link', { name })).not.toHaveClass('min-w-14');
    }
  });
  it('keeps ordered destinations and native keyboard focus without a trailing arrow (FT-03, FT-08)', async () => {
    const user = userEvent.setup();
    render(
      <Footer>
        <FooterNavigation
          label='Sections'
          items={[
            { href: '#second', label: 'Second' },
            { href: '#first?x=1&y=2', label: 'First' },
            { href: '#second', label: 'Again' }
          ]}
        />
      </Footer>
    );
    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#second', '#first?x=1&y=2', '#second']);
    expect(links.map((link) => link.textContent)).toEqual(['Second', 'First', 'Again']);
    for (const link of links) {
      expect(link).not.toHaveAttribute('target');
      expect(link.querySelector('svg')).toBeNull();
      await user.tab();
      expect(link).toHaveFocus();
    }
  });
  it('keeps breakpoint and hairline utilities on their intended parts (FT-06, FT-07)', () => {
    render(
      <Footer>
        <FooterMotto>
          <p>Motto</p>
        </FooterMotto>
        <FooterBrand>Brand</FooterBrand>
        <FooterLegal>Legal</FooterLegal>
      </Footer>
    );
    const root = screen.getByRole('contentinfo');
    expect(root).toHaveClass('border-t-[length:var(--border-width)]', 'border-b-[length:var(--border-width)]');
    expect(root.querySelector('.eg-footer__stage')).toHaveClass('px-0', 'pt-10', 'pb-8');
    const grid = root.querySelector('.eg-footer__grid');
    expect(grid).toHaveClass('gap-x-10', 'gap-y-8', 'pt-10', '[@media(width<=860px)]:[&>:first-child]:col-auto');
    expect(grid).toHaveClass('[@media(width<=860px)]:[&>.footer-brand:first-child]:col-span-2');
    expect(screen.getByText('Brand')).toHaveClass('[@media(width<=860px)]:col-span-2');
    expect(root.querySelector('.eg-footer__legal')).toHaveClass('gap-4', 'mt-10', 'pt-4');
  });
  it('does not assert a contentinfo landmark inside main (FT-02)', () => {
    render(
      <main>
        <Footer>
          <FooterLegal>Legal</FooterLegal>
        </Footer>
      </main>
    );
    const footer = screen.getByText('Legal').closest('footer');
    expect(footer?.closest('main')).not.toBeNull();
    expect(footer).not.toHaveAttribute('role');
  });
  it('names navigation by unique visible headings and omits invalid entries (FT-03)', () => {
    const items = [
      { href: '', label: 'Bad' },
      { href: '#one', label: 'One' },
      { href: '#two', label: ' ' }
    ];
    render(
      <>
        <Footer>
          <FooterNavigation label='Sections' items={items} />
        </Footer>
        <Footer>
          <FooterNavigation label='Other' level={4} items={items} />
        </Footer>
      </>
    );
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    const other = screen.getByRole('navigation', { name: 'Other' });
    expect(within(nav).getByRole('heading', { level: 2 })).toHaveAttribute('id', nav.getAttribute('aria-labelledby'));
    expect(within(other).getByRole('heading', { level: 4 })).toHaveAttribute(
      'id',
      other.getAttribute('aria-labelledby')
    );
    expect(nav.getAttribute('aria-labelledby')).not.toBe(other.getAttribute('aria-labelledby'));
    expect(within(nav).getAllByRole('link')).toHaveLength(1);
    expect(within(nav).getByRole('link', { name: 'One' })).toHaveAttribute('href', '#one');
  });
  it('omits groups with blank names or no valid links (FT-03)', () => {
    const { rerender } = render(
      <Footer>
        <FooterNavigation label=' ' items={[{ href: '#a', label: 'A' }]} />
      </Footer>
    );
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('heading')).toBeNull();
    rerender(
      <Footer>
        <FooterNavigation label='Empty' items={[]} />
      </Footer>
    );
    expect(screen.queryByRole('navigation')).toBeNull();
    rerender(
      <Footer>
        <FooterNavigation label='Invalid' items={[{ href: '', label: 'A' }]} />
      </Footer>
    );
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});

describe('Footer current page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.location.hash = '';
  });

  it('marks exactly the supplied entry anchor and no other element (FT-11)', () => {
    render(withItems([plain, current]));
    const nav = screen.getByRole('navigation', { name: 'Explore' });
    const marked = within(nav).getByRole('link', { name: 'Two' });
    expect(marked).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'One' })).not.toHaveAttribute('aria-current');
    expect(nav.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(nav.querySelector('[aria-current]')).toBe(marked);
    for (const element of [
      nav,
      within(nav).getByRole('heading'),
      within(nav).getByRole('list'),
      ...within(nav).getAllByRole('listitem')
    ]) {
      expect(element).not.toHaveAttribute('aria-current');
    }
  });
  it('renders the CurrentPage story args with exactly one marked anchor (FT-11)', () => {
    render(<Footer>{CurrentPage.args?.children}</Footer>);
    const nav = screen.getByRole('navigation', { name: 'Explore' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('aria-current'))).toEqual([null, 'page']);
    expect(nav.querySelectorAll('[aria-current]')).toHaveLength(1);
  });

  it('renders no mark when none is supplied, whatever the location or order (FT-12)', () => {
    window.location.hash = '#two';
    render(withItems([plain, { href: '#two', label: 'Two' }]));
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(document.querySelector('[aria-current]')).toBeNull();
  });
  it('forwards one or two marks exactly as supplied without picking a winner (FT-12)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const third: FooterNavigationItem = { href: '#three', label: 'Three' };
    const { rerender } = render(withItems([plain, current, third]));
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('aria-current'))).toEqual([null, 'page', null]);
    // Two marks are outside the contract: both render, and neither is dropped or preferred.
    expect(() => rerender(withItems([{ ...plain, 'aria-current': 'page' }, current, third]))).not.toThrow();
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('aria-current'))).toEqual([
      'page',
      'page',
      null
    ]);
    expect(warn).not.toHaveBeenCalled();
  });
  it('forwards a value outside the type unchanged (FT-12, OQ-2)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    // Out-of-contract runtime value (plain JS or a cast): Footer forwards it as TopBar and NavList do (OQ-2).
    const stray = { href: '#one', label: 'One', 'aria-current': 'step' } as unknown as FooterNavigationItem;
    expect(() => render(withItems([stray, { href: '#two', label: 'Two' }]))).not.toThrow();
    expect(screen.getByRole('link', { name: 'One' })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('link', { name: 'Two' })).not.toHaveAttribute('aria-current');
    expect(warn).not.toHaveBeenCalled();
  });

  it('omits an invalid marked entry together with its mark (FT-13)', () => {
    // A non-string href cannot be written in the type, so it is cast as a plain JS caller would supply it.
    const numeric = { href: 42, label: 'Numeric', 'aria-current': 'page' } as unknown as FooterNavigationItem;
    const { rerender } = render(
      withItems([
        { href: '', label: 'Empty', 'aria-current': 'page' },
        numeric,
        { href: '#blank', label: ' ', 'aria-current': 'page' },
        { href: '#one', label: 'One', 'aria-current': 'page' }
      ])
    );
    const nav = screen.getByRole('navigation', { name: 'Explore' });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.textContent)
    ).toEqual(['One']);
    expect(nav.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(within(nav).getByRole('link', { name: 'One' })).toHaveAttribute('aria-current', 'page');
    // With the only valid entry unmarked, no remaining entry becomes current.
    rerender(withItems([{ href: '', label: 'Empty', 'aria-current': 'page' }, plain]));
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['One']);
    expect(document.querySelector('[aria-current]')).toBeNull();
    // With no valid entry left, no navigation, heading or attribute is rendered.
    rerender(
      withItems([
        { href: '', label: 'Empty', 'aria-current': 'page' },
        { href: '#blank', label: ' ', 'aria-current': 'page' }
      ])
    );
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('heading')).toBeNull();
    expect(document.querySelector('[aria-current]')).toBeNull();
  });

  it('moves the attribute with the mark and keeps focus on the same element (FT-14)', async () => {
    const user = userEvent.setup();
    const second: FooterNavigationItem = { href: '#two', label: 'Two' };
    const { rerender } = render(withItems([{ ...plain, 'aria-current': 'page' }, second]));
    const one = screen.getByRole('link', { name: 'One' });
    const two = screen.getByRole('link', { name: 'Two' });
    await user.tab();
    expect(one).toHaveFocus();
    expect(one).toHaveAttribute('aria-current', 'page');
    expect(two).not.toHaveAttribute('aria-current');
    rerender(withItems([plain, { ...second, 'aria-current': 'page' }]));
    expect(screen.getByRole('link', { name: 'One' })).toBe(one);
    expect(screen.getByRole('link', { name: 'Two' })).toBe(two);
    expect(one).not.toHaveAttribute('aria-current');
    expect(two).toHaveAttribute('aria-current', 'page');
    expect(one).toHaveFocus();
  });

  it('keeps a marked anchor a normal native link with an unchanged recipe (FT-15)', async () => {
    const user = userEvent.setup();
    const { rerender } = render(withItems([plain, current]));
    const links = screen.getAllByRole('link');
    const marked = screen.getByRole('link', { name: 'Two' });
    expect(marked).toHaveAttribute('aria-current', 'page');
    expect(marked).toHaveAttribute('href', '#two');
    for (const name of ['tabindex', 'aria-disabled', 'target', 'role']) {
      expect(marked, name).not.toHaveAttribute(name);
    }
    expect(marked.querySelector('svg')).toBeNull();
    expect(marked).toHaveClass('min-h-14', 'min-w-14', 'inline-flex', 'items-center', 'justify-start');
    expect(screen.getByRole('contentinfo').querySelector('.eg-footer__link')).toBeNull();
    for (const link of links) {
      await user.tab();
      expect(link).toHaveFocus();
    }
    const markedClassName = marked.className;
    rerender(withItems([plain, { href: current.href, label: current.label }]));
    const unmarked = screen.getByRole('link', { name: 'Two' });
    expect(unmarked).not.toHaveAttribute('aria-current');
    expect(unmarked.className).toBe(markedClassName);
  });
});

// Footer v0.4 (#561, #565, #562): the content wrapper, the Grafito register and the quiet navigation links.
type FooterStory = StoryObj<typeof Footer>;
// Storybook calls render(args, context); the Footer stories only read their args.
const renderStory = (story: FooterStory): ReactElement => {
  const custom = story.render as ((args: FooterProps) => ReactElement) | undefined;
  return custom ? custom(story.args as FooterProps) : createElement(Footer, story.args as FooterProps);
};
// Generated ids differ between renders, so each distinct id is replaced by its order of appearance.
const normalizedMarkup = (element: HTMLElement) => {
  const seen = new Map<string, string>();
  return element.outerHTML.replace(/\b(id|aria-labelledby)="([^"]*)"/g, (_match, attribute: string, value: string) => {
    if (!seen.has(value)) {
      seen.set(value, `id-${seen.size}`);
    }
    return `${attribute}="${seen.get(value)}"`;
  });
};
const classTokens = (element: Element) => Array.from(element.classList);
const paintTokens = (element: Element) => classTokens(element).filter((token) => /(^|:)bg-/.test(token));
const regions = ['eg-footer__stage', 'eg-footer__grid', 'eg-footer__legal'];
const regionsOf = (parent: Element) =>
  Array.from(parent.children).map((child) => regions.find((name) => child.classList.contains(name)));

describe('Footer v0.4 wrap, register and quiet links', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['Default', stories.Default, regions],
    ['Minimal', stories.Minimal, ['eg-footer__legal']],
    ['Landmark', stories.Landmark, regions]
  ])(
    'keeps the unwrapped and unpainted structure of the %s story when neither prop is set (FT-19)',
    (_name, story, expected) => {
      render(renderStory(story));
      const footer = screen.getByRole('contentinfo');
      expect(regionsOf(footer)).toEqual(expected);
      expect(footer.querySelector('.eg-footer__wrap')).toBeNull();
      expect(paintTokens(footer)).toEqual([]);
      expect(footer).not.toHaveAttribute('wrap');
      expect(footer).not.toHaveAttribute('register');
    }
  );

  it.each([
    ['Default', stories.Default],
    ['Minimal', stories.Minimal]
  ])(
    'renders the %s args identically with the explicit default values and never forwards either prop (FT-19)',
    (_name, story) => {
      const baseline = render(<Footer {...(story.args as FooterProps)} />);
      const expected = normalizedMarkup(screen.getByRole('contentinfo'));
      baseline.unmount();
      render(<Footer wrap={false} register='none' {...(story.args as FooterProps)} />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).not.toHaveAttribute('wrap');
      expect(footer).not.toHaveAttribute('register');
      expect(normalizedMarkup(footer)).toBe(expected);
    }
  );

  it('wraps the motto, grid and legal row in exactly one centered content wrapper (FT-20)', () => {
    render(<Footer wrap={true}>{Default.args?.children}</Footer>);
    const footer = screen.getByRole('contentinfo');
    expect(footer.children).toHaveLength(1);
    const wrapper = footer.children[0] as HTMLElement;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper).toHaveClass(
      'eg-footer__wrap',
      'box-border',
      'w-full',
      'max-w-[var(--content-max)]',
      'mx-auto',
      'px-[var(--gutter)]'
    );
    expect(classTokens(wrapper).filter((token) => token.startsWith('overflow-'))).toEqual([]);
    for (const name of ['role', 'id', 'tabindex']) {
      expect(wrapper, name).not.toHaveAttribute(name);
    }
    expect(wrapper.getAttributeNames().filter((name) => name.startsWith('aria-'))).toEqual([]);
    expect(regionsOf(wrapper)).toEqual(regions);
    expect(wrapper.querySelector('.eg-footer__stage')).toHaveClass('px-0', 'pt-10', 'pb-8');
    expect(wrapper.querySelector('.eg-footer__grid')).toHaveClass(
      'grid',
      'gap-x-10',
      'pt-10',
      'border-t-border-hairline'
    );
    expect(wrapper.querySelector('.eg-footer__legal')).toHaveClass('flex', 'gap-4', 'mt-10', 'pt-4');
    // The root keeps its full-width boundary: bottom padding and both hairlines.
    expect(footer).toHaveClass('pb-8', 'border-t-border-hairline', 'border-b-border-hairline');
  });

  it('renders no wrapper when no part renders and keeps every other legacy marker absent (FT-20)', () => {
    const { rerender } = render(<Footer wrap={true}>{null}</Footer>);
    const footer = screen.getByRole('contentinfo');
    expect(footer.children).toHaveLength(0);
    rerender(
      <Footer wrap={true}>
        <FooterNavigation label='Empty' items={[]} />
      </Footer>
    );
    expect(footer.children).toHaveLength(0);
    expect(footer.querySelector('.eg-footer__wrap')).toBeNull();
    rerender(<Footer wrap={true}>{Default.args?.children}</Footer>);
    expect(footer.querySelectorAll('.eg-footer__wrap')).toHaveLength(1);
    for (const marker of ['motto', 'tagline', 'heading', 'list', 'link', 'social']) {
      expect(footer.querySelector(`.eg-footer__${marker}`), marker).toBeNull();
    }
  });

  it.each([['true'], [1]])('treats wrap=%j outside the boolean contract as absent (FT-21)', (value) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <Footer wrap={value as unknown as boolean}>
          <FooterLegal>Legal</FooterLegal>
        </Footer>
      )
    ).not.toThrow();
    const footer = screen.getByRole('contentinfo');
    expect(footer.querySelector('.eg-footer__wrap')).toBeNull();
    expect(regionsOf(footer)).toEqual(['eg-footer__legal']);
    expect(footer).not.toHaveAttribute('wrap');
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it.each([['pro'], ['show'], ['Grafito']])('treats register=%j outside the union as none (FT-21)', (value) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <Footer register={value as unknown as FooterRegister}>
          <FooterLegal>Legal</FooterLegal>
        </Footer>
      )
    ).not.toThrow();
    const footer = screen.getByRole('contentinfo');
    expect(paintTokens(footer)).toEqual([]);
    expect(footer).not.toHaveAttribute('register');
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it('paints the Grafito wash on the footer root without changing its flow, height or landmark (FT-24)', () => {
    render(
      <Footer register='grafito'>
        <FooterLegal>Legal</FooterLegal>
      </Footer>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass(
      'bg-surface-0/50',
      'bg-none',
      '[@media(prefers-reduced-transparency:reduce)]:bg-surface-0',
      'text-fg-default',
      'border-t-border-hairline',
      'border-b-border-hairline'
    );
    const foreign = classTokens(footer).filter(
      (token) =>
        /^(min-h-|shadow-|pt-\[calc\()/.test(token) ||
        ['flex', 'isolate', 'absolute', 'fixed', 'sticky'].includes(token)
    );
    expect(foreign).toEqual([]);
    expect(footer.tagName).toBe('FOOTER');
    expect(footer).not.toHaveAttribute('role');
    expect(footer).not.toHaveAttribute('register');
    expect(screen.getAllByRole('contentinfo')).toEqual([footer]);
  });

  it('paints no background with register none or without it (FT-24)', () => {
    const { rerender } = render(
      <Footer register='none'>
        <FooterLegal>Legal</FooterLegal>
      </Footer>
    );
    expect(paintTokens(screen.getByRole('contentinfo'))).toEqual([]);
    rerender(
      <Footer>
        <FooterLegal>Legal</FooterLegal>
      </Footer>
    );
    expect(paintTokens(screen.getByRole('contentinfo'))).toEqual([]);
  });

  it.each([
    [false, 'none'],
    [true, 'none'],
    [false, 'grafito'],
    [true, 'grafito']
  ] as const)('composes wrap=%s with register=%s and keeps the consumer classes (FT-26)', (wrap, register) => {
    render(
      <Footer wrap={wrap} register={register} className='mt-4 w-full'>
        <FooterBrand>Brand</FooterBrand>
        <FooterLegal className='mt-4'>Legal</FooterLegal>
      </Footer>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass(
      'eg-footer',
      'mt-4',
      'w-full',
      'pb-8',
      'border-t-border-hairline',
      'border-b-border-hairline'
    );
    const legal = footer.querySelector('.eg-footer__legal');
    expect(legal).toHaveClass('mt-4', 'flex', 'border-t-border-hairline');
    const wrapper = footer.querySelector('.eg-footer__wrap');
    expect(wrapper !== null).toBe(wrap);
    expect(footer.children).toHaveLength(wrap ? 1 : 2);
    // The wash belongs to the root and never to the wrapper; the wrapper constrains content only.
    expect(paintTokens(footer).length > 0).toBe(register === 'grafito');
    if (wrapper) {
      expect(paintTokens(wrapper)).toEqual([]);
      expect(wrapper).not.toHaveClass('mt-4', 'w-full');
      expect(wrapper).toContainElement(legal as HTMLElement);
    }
  });

  it('has no fade input, underlay part or mask utility, and documents the host-owned fade (FT-27)', () => {
    const { unmount } = render(
      <Footer wrap={true} register='grafito'>
        {Default.args?.children}
      </Footer>
    );
    const footer = screen.getByRole('contentinfo');
    const owned = [
      footer,
      footer.querySelector('.eg-footer__wrap'),
      ...regions.map((r) => footer.querySelector(`.${r}`))
    ];
    for (const element of owned) {
      expect(element?.getAttribute('class') ?? '').not.toMatch(/mask/);
    }
    unmount();
    render(renderStory(stories.HostFade));
    const host = screen.getByRole('contentinfo').parentElement as HTMLElement;
    expect(host).toHaveClass('relative', 'isolate', '[&_.eg-footer]:bg-transparent');
    const underlay = host.firstElementChild as HTMLElement;
    expect(underlay).toHaveAttribute('aria-hidden', 'true');
    expect(underlay.className).toContain('[mask-image:var(--mask-section-fade-top)]');
    // The footer itself is the unchanged Grafito root; the host only suppresses its wash locally.
    expect(screen.getByRole('contentinfo')).toHaveClass('bg-surface-0/50');
  });

  it('renders every navigation anchor as a quiet Link with the Footer target recipe (FT-28)', () => {
    render(
      <Footer>
        <FooterNavigation
          label='Explore'
          items={[
            { href: '#projects', label: 'Projects' },
            { href: '#notes', label: 'Notes', 'aria-current': 'page' }
          ]}
        />
      </Footer>
    );
    const standalone = render(
      <Link href='#standalone' variant='quiet' arrow={false} className={cn(footerNavigationLinkVariants())}>
        Standalone
      </Link>
    );
    const expected = standalone.getByRole('link', { name: 'Standalone' }).className;
    const anchors = within(screen.getByRole('navigation', { name: 'Explore' })).getAllByRole('link');
    expect(anchors).toHaveLength(2);
    for (const anchor of anchors) {
      expect(anchor.className).toBe(expected);
      expect(anchor).toHaveClass(
        'text-fg-default',
        'min-h-14',
        'min-w-14',
        'inline-flex',
        'items-center',
        'justify-start'
      );
      expect(anchor).not.toHaveClass('text-link-default');
      expect(anchor.querySelector('svg')).toBeNull();
    }
    expect(anchors[0]).not.toHaveAttribute('aria-current');
    expect(anchors[1]).toHaveAttribute('aria-current', 'page');
  });

  it('leaves consumer-supplied brand and legal links untouched by the quiet adoption (FT-28)', () => {
    render(
      <Footer>
        <FooterBrand>
          <a href='/'>Home</a>
        </FooterBrand>
        <FooterLegal>
          <Link href='#privacy' arrow={false}>
            Privacy
          </Link>
        </FooterLegal>
      </Footer>
    );
    const standalone = render(
      <Link href='#standalone' arrow={false}>
        Standalone
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Privacy' }).className).toBe(
      standalone.getByRole('link', { name: 'Standalone' }).className
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('class');
  });

  it('remounts the parts when wrap is toggled, so a consumer part loses its local state (spec section 4)', async () => {
    const user = userEvent.setup();
    const Counter = () => {
      const [count, setCount] = useState(0);
      return (
        <button type='button' onClick={() => setCount(count + 1)}>
          Count {count}
        </button>
      );
    };
    const tree = (wrap: boolean) => (
      <Footer wrap={wrap}>
        <FooterBrand>
          <Counter />
        </FooterBrand>
      </Footer>
    );
    const { rerender } = render(tree(false));
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Count 1');
    rerender(tree(true));
    expect(screen.getByRole('button')).toHaveTextContent('Count 0');
  });

  it('renders the args of every story, existing and new, without a React key warning (FT-32)', () => {
    const entries = Object.entries(stories).filter(([name]) => name !== 'default') as [string, FooterStory][];
    expect(entries.map(([name]) => name)).toEqual(
      expect.arrayContaining(['Wrapped', 'Grafito', 'WrappedGrafito', 'HostFade'])
    );
    expect(entries).toHaveLength(15);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    for (const [, story] of entries) {
      const { unmount } = render(renderStory(story));
      expect(screen.getAllByRole('contentinfo').length).toBeGreaterThan(0);
      unmount();
    }
    const keyWarnings = error.mock.calls.filter(([message]) => String(message).includes('unique "key" prop'));
    expect(keyWarnings).toEqual([]);
  });
});
