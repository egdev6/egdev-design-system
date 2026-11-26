import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, Fragment } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Icon } from '../../atoms/icon';
import { Logo } from '../../atoms/logo';
import * as publicUi from '../../index';
import { SocialLinks } from '../../molecules/social-links';
import { Footer, FooterBrand, FooterLegal, FooterMotto, FooterNavigation, FooterSocial } from './Footer';
import { CurrentPage, Default, Invalid, Minimal, Social } from './Footer.stories';
import type { FooterNavigationItem, FooterProps } from './types';

type Assert<T extends true> = T;
// @ts-expect-error The current-page token is restricted to 'page'; 'step' is outside the contract (FT-16).
type InvalidCurrent = Assert<'step' extends FooterNavigationItem['aria-current'] ? true : false>;
export type TypeNegatives = [InvalidCurrent];

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
