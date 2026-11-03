import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Icon } from '../../atoms/icon';
import { Logo } from '../../atoms/logo';
import { SocialLinks } from '../../molecules/social-links';
import { Footer, FooterBrand, FooterLegal, FooterMotto, FooterNavigation, FooterSocial } from './Footer';

describe('Footer contract', () => {
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
    expect(root.querySelector('.eg-footer__stage')).toHaveClass('px-0', 'pt-12', 'pb-10');
    const grid = root.querySelector('.eg-footer__grid');
    expect(grid).toHaveClass('gap-10', 'pt-10', '[@media(width<=860px)]:[&>:first-child]:col-auto');
    expect(grid).toHaveClass('[@media(width<=860px)]:[&>.footer-brand:first-child]:col-span-2');
    expect(screen.getByText('Brand')).toHaveClass('[@media(width<=860px)]:col-span-2');
    expect(root.querySelector('.eg-footer__legal')).toHaveClass('gap-4', 'mt-12', 'pt-5');
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
