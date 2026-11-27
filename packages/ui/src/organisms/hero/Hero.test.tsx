import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Link } from '../../atoms/link';
import { SocialLinks } from '../../molecules/social-links';
import { SectionShell } from '../../templates/section-shell';
import { Hero, type HeroProps } from './index';

// Compile-time examples are never rendered.
const typeExamples = () => {
  // @ts-expect-error A title is required.
  const missingTitle = <Hero level={1} />;
  // @ts-expect-error A heading level is required.
  const missingLevel = <Hero title='Title' />;
  // @ts-expect-error Heading ranks are limited to 1–6.
  const invalidLevel = <Hero title='Title' level={7} />;
  // @ts-expect-error The root role cannot be overridden.
  const role = <Hero title='Title' level={1} role='button' />;
  // @ts-expect-error Inline style is excluded.
  const style = <Hero title='Title' level={1} style={{ color: 'red' }} />;
  // @ts-expect-error Raw HTML is excluded.
  const html: HeroProps = { title: 'Title', level: 1, dangerouslySetInnerHTML: { __html: 'unsafe' } };
  // @ts-expect-error No root ref is exposed.
  const ref = <Hero title='Title' level={1} ref={createRef<HTMLDivElement>()} />;
  // @ts-expect-error No polymorphic root is exposed.
  const asChild = <Hero title='Title' level={1} asChild={true} />;
  return [missingTitle, missingLevel, invalidLevel, role, style, html, ref, asChild];
};
void typeExamples;

describe('Hero', () => {
  it('HE-01 renders selected heading ranks and names independent host sections', () => {
    render(
      <>
        <SectionShell aria-labelledby='first'>
          <Hero id='first' title='First' level={1} />
        </SectionShell>
        <SectionShell aria-labelledby='second'>
          <Hero id='second' title='Second' level={3} />
        </SectionShell>
      </>
    );
    expect(within(screen.getByRole('region', { name: 'First' })).getByRole('heading', { level: 1 })).toHaveAttribute(
      'id',
      'first'
    );
    expect(within(screen.getByRole('region', { name: 'Second' })).getByRole('heading', { level: 3 })).toHaveAttribute(
      'id',
      'second'
    );
    expect(screen.getAllByRole('heading')).toHaveLength(2);
  });
  it('HE-02/03 preserves copy order, accessible accent and independent CTA interaction', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const { container } = render(
      <Hero
        title='Hello '
        accent='world'
        level={2}
        eyebrow='Intro'
        lede='Description'
        social={<nav aria-label='Profiles'>Profiles</nav>}
        media={<span>Decorative</span>}
      >
        <Button onClick={click}>First action</Button>
        <Button variant='secondary'>Second action</Button>
      </Hero>
    );
    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeInTheDocument();
    const root = container.querySelector('.eg-hero');
    expect(root).not.toBeNull();
    expect(root?.textContent).toMatch(
      /Intro.*Hello world.*Description.*First action.*Second action.*Profiles.*Decorative/
    );
    expect(screen.getByText('Decorative').parentElement).toHaveAttribute('aria-hidden', 'true');
    await user.tab();
    expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus();
    await user.keyboard(' ');
    expect(click).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Second action' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus();
    expect(container.querySelector('button button, a button, button a')).toBeNull();
  });
  it('HE-02/04/06/07 omits empty slots and asserts owned responsive and legacy boundaries', () => {
    const { container, rerender } = render(
      <Hero title='Only' level={2} media={false} data-owner='host' className='mt-4 mt-6' />
    );
    const root = container.querySelector('.eg-hero');
    expect(root).toHaveClass('grid-cols-1', 'mt-6');
    expect(root).not.toHaveClass('mt-4', 'grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]');
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root?.children).toHaveLength(1);
    rerender(<Hero title='Only' level={2} media={<span>Art</span>} />);
    expect(root).toHaveClass(
      'grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]',
      '[@media(width<=860px)]:grid-cols-1',
      '[@media(width<=860px)]:gap-4'
    );
    const outer = screen.getByText('Art').parentElement?.parentElement;
    expect(outer).toHaveClass('[@media(width<=860px)]:order-first');
    expect(screen.getByText('Art').parentElement).toHaveClass(
      'aspect-square',
      'max-w-[62vh]',
      '[@media(width<=860px)]:max-w-[min(34svh,calc(var(--space-24)*4))]',
      '[@media(width>=961px)]:max-w-[min(56svh,calc(var(--space-24)*7))]'
    );
    expect(container.querySelector('[class*="eg-hero__"]')).toBeNull();
  });
  it('HE-01 renders all native ranks and reserves each id for its heading', () => {
    const levels = [1, 2, 3, 4, 5, 6] as const;
    const { container } = render(
      <>
        {levels.map((level) => (
          <Hero key={level} title={`Title ${level}`} level={level} id={`heading-${level}`} />
        ))}
      </>
    );
    for (const level of levels) {
      const heading = screen.getByRole('heading', { name: `Title ${level}`, level });
      expect(heading.tagName).toBe(`H${level}`);
      expect(heading).toHaveAttribute('id', `heading-${level}`);
      expect(container.querySelectorAll(`#heading-${level}`)).toHaveLength(1);
      expect(heading.closest('.eg-hero')).not.toHaveAttribute('id');
    }
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('HE-02 independently omits every optional part without empty wrappers', () => {
    const full = {
      title: 'Title ',
      level: 2 as const,
      eyebrow: 'Eyebrow',
      accent: 'Accent',
      lede: 'Lede',
      children: <Button>Action</Button>,
      social: <span>Social marker</span>,
      media: <img alt='' src='/art.png' />
    };
    const cases = ['eyebrow', 'accent', 'lede', 'children', 'social', 'media'] as const;
    for (const omitted of cases) {
      const props = { ...full, [omitted]: undefined };
      const { container, unmount } = render(<Hero {...props} />);
      const root = container.querySelector('.eg-hero');
      const copy = root?.firstElementChild;
      expect(copy?.children).toHaveLength(omitted === 'accent' || omitted === 'media' ? 5 : 4);
      expect(root?.children).toHaveLength(omitted === 'media' ? 1 : 2);
      expect(screen.getByRole('heading')).toHaveTextContent(omitted === 'accent' ? 'Title' : 'Title Accent');
      expect(screen.queryByText('Eyebrow')).toEqual(omitted === 'eyebrow' ? null : expect.any(HTMLElement));
      expect(screen.queryByText('Lede')).toEqual(omitted === 'lede' ? null : expect.any(HTMLElement));
      expect(screen.queryByRole('button', { name: 'Action' })).toEqual(
        omitted === 'children' ? null : expect.any(HTMLElement)
      );
      expect(screen.queryByText('Social marker')).toEqual(omitted === 'social' ? null : expect.any(HTMLElement));
      expect(container.querySelectorAll('.eg-hero div:empty')).toHaveLength(0);
      unmount();
    }
  });

  it('HE-02/03 keeps zero, one and two CTA controls in order and delegates keyboard activation', async () => {
    const user = userEvent.setup();
    const buttonClick = vi.fn();
    const linkClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const { rerender } = render(<Hero title='Scene' level={1} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    rerender(
      <Hero title='Scene' level={1}>
        <Button onClick={buttonClick}>Act</Button>
      </Hero>
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(buttonClick).toHaveBeenCalledTimes(2);
    rerender(
      <Hero title='Scene' level={1}>
        <Button onClick={buttonClick}>Act</Button>
        <Link href='#destination' onClick={linkClick}>
          Read
        </Link>
      </Hero>
    );
    expect(
      screen.getByRole('button', { name: 'Act' }).compareDocumentPosition(screen.getByRole('link', { name: 'Read' })) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Read' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(linkClick).toHaveBeenCalledTimes(1);
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Act' })).toHaveFocus();
  });

  it('HE-03 retains real SocialLinks names and hides compliant decorative media', () => {
    const { container } = render(
      <Hero
        title='Scene'
        level={2}
        social={
          <SocialLinks
            label='Community profiles'
            size='lg'
            items={[
              {
                id: 'profile',
                label: 'Project profile',
                href: 'https://example.org/profile',
                icon: <Icon name='github' />
              }
            ]}
          />
        }
        media={<img src='/art.png' alt='' />}
      />
    );
    const list = screen.getByRole('list', { name: 'Community profiles' });
    expect(within(list).getByRole('link', { name: 'Project profile' })).toHaveAttribute(
      'href',
      'https://example.org/profile'
    );
    const image = container.querySelector('img');
    const slot = image?.parentElement;
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(slot).not.toHaveAttribute('tabindex');
    expect(slot?.querySelector('a, button, input, select, textarea, [tabindex]')).toBeNull();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('HE-04/05/06/07 assigns the approved per-part responsive and token recipes', () => {
    const { container } = render(
      <Hero
        title='Title '
        accent='Accent'
        level={2}
        eyebrow='Eyebrow'
        lede='Lede'
        media={<img alt='' src='/art.png' />}
        social={<span>Social</span>}
      >
        <Button>Act</Button>
      </Hero>
    );
    const root = container.querySelector('.eg-hero');
    expect(root).toHaveClass('box-border', 'w-full', 'max-w-none', 'mx-0', 'px-0', 'font-sans', 'text-fg-default');
    expect(screen.getByText('Eyebrow').parentElement).toHaveClass('mb-5', '[@media(width>=961px)]:mb-3');
    expect(screen.getByRole('heading').parentElement).toHaveClass('mb-7', '[@media(width>=961px)]:mb-5');
    expect(screen.getByText('Lede')).toHaveClass(
      'm-0',
      'font-sans',
      'text-body-large',
      'text-fg-secondary',
      'wrap-break-word'
    );
    expect(screen.getByRole('button')).toHaveClass(
      'eg-btn',
      'box-border',
      'm-0',
      'font-sans',
      'bg-transparent',
      'focus-visible:outline-none',
      'motion-reduce:transition-none'
    );
    expect(screen.getByRole('button').parentElement).toHaveClass(
      'flex',
      'flex-wrap',
      'gap-3',
      'mt-8',
      'mb-10',
      '[@media(width>=961px)]:mt-7',
      '[@media(width>=961px)]:mb-8'
    );
    expect(screen.getByText('Accent')).toHaveClass(
      'block',
      'text-fg-brand-default',
      '[text-shadow:var(--text-shadow-title-hero)]'
    );
    expect(container.querySelector('[class*="eg-hero__"]')).toBeNull();
    expect(root?.querySelector('[style]')).toBeNull();
  });

  it('HE-07 forwards native attributes and merges supported placement classes', () => {
    const { container } = render(
      <Hero
        title='Scene'
        level={2}
        id='heading-id'
        lang='en'
        dir='rtl'
        data-owner='host'
        aria-describedby='description'
        className='mt-4 mt-6 self-start'
      />
    );
    const root = container.querySelector('.eg-hero');
    expect(root).toHaveAttribute('lang', 'en');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root).toHaveAttribute('aria-describedby', 'description');
    expect(root).toHaveClass('mt-6', 'self-start');
    expect(root).not.toHaveClass('mt-4');
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'heading-id');
  });

  it('HE-07 rejects protected overrides at untyped boundaries', () => {
    const unsafe = {
      role: 'button',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: 'unsafe' },
      ref: vi.fn()
    };
    const { container } = render(<Hero title='Safe' level={2} {...unsafe} />);
    const root = container.querySelector('.eg-hero');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('style');
    expect(root).not.toHaveTextContent('unsafe');
    expect(unsafe.ref).not.toHaveBeenCalled();
  });
});

describe('Hero titleVariant (#560)', () => {
  // Every optional part is present. Plain elements keep ids out of the markup, so two renders compare byte for byte.
  const props = {
    title: 'Hello ',
    accent: 'world',
    level: 2,
    id: 'hero-title',
    eyebrow: 'Intro',
    lede: 'Description',
    children: <a href='#start'>Start</a>,
    social: <span>Profiles</span>,
    media: <span>Art</span>
  } satisfies HeroProps;
  const glow = '[text-shadow:var(--text-shadow-title-hero)]';
  const baseline = () => {
    const view = render(<Hero {...props} />);
    const html = view.container.innerHTML;
    view.unmount();
    return html;
  };

  it('TV-01 renders the default recipe, byte for byte, with the prop omitted and with hero', () => {
    const expected = baseline();
    const { container } = render(<Hero {...props} titleVariant='hero' />);
    expect(container.innerHTML).toBe(expected);
    const heading = screen.getByRole('heading', { level: 2, name: 'Hello world' });
    expect(heading).toHaveClass('text-title-hero');
    expect(heading).not.toHaveClass('text-title-show');
    expect(screen.getByText('world')).toHaveClass('block', 'text-fg-brand-default', glow);
    expect(screen.getByText('world')).not.toHaveClass('[text-shadow:none]');
  });

  it.each([1, 2, 3, 4, 5, 6] as const)(
    'TV-02 selects the show recipe at rank %i on the same heading and drops the accent glow',
    (level) => {
      const { container } = render(<Hero {...props} level={level} titleVariant='show' />);
      const heading = screen.getByRole('heading', { level, name: 'Hello world' });
      expect(heading.tagName).toBe(`H${level}`);
      expect(heading).toHaveAttribute('id', 'hero-title');
      expect(heading).toHaveClass('text-title-show');
      expect(heading).not.toHaveClass('text-title-hero');
      expect(screen.getByText('world')).toHaveClass('block', 'text-fg-brand-default', '[text-shadow:none]');
      expect(screen.getByText('world')).not.toHaveClass(glow);
      expect(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).toHaveLength(1);
    }
  );

  it.each(['display', 'section', 'inverse', 'compact', 'SHOW', '', null, 42])(
    'TV-03 resolves the untyped value %j to hero and never reaches the DOM',
    (value) => {
      const expected = baseline();
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      try {
        const untyped = { titleVariant: value } as unknown as HeroProps;
        const { container } = render(<Hero {...props} {...untyped} />);
        expect(container.innerHTML).toBe(expected);
        expect(container.innerHTML).not.toMatch(/title-?variant/i);
        expect(container.querySelector('.eg-hero')?.getAttributeNames()).toEqual(['class']);
        expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-title-hero');
        expect(error).not.toHaveBeenCalled();
      } finally {
        error.mockRestore();
      }
    }
  );

  it('TV-03 accepts only hero and show at compile time', () => {
    const base = { title: 'Title', level: 2 as const };
    const hero: HeroProps = { ...base, titleVariant: 'hero' };
    const show: HeroProps = { ...base, titleVariant: 'show' };
    // @ts-expect-error display is not a supported scene recipe.
    const display: HeroProps = { ...base, titleVariant: 'display' };
    // @ts-expect-error section is not a supported scene recipe.
    const section: HeroProps = { ...base, titleVariant: 'section' };
    // @ts-expect-error inverse is not a supported scene recipe.
    const inverse: HeroProps = { ...base, titleVariant: 'inverse' };
    // @ts-expect-error compact is not a supported scene recipe.
    const compact: HeroProps = { ...base, titleVariant: 'compact' };
    // @ts-expect-error a number is not a recipe.
    const numeric: HeroProps = { ...base, titleVariant: 42 };
    expect([hero, show, display, section, inverse, compact, numeric]).toHaveLength(7);
  });

  it('TV-04 changes nothing but the recipe class and the glow utility', () => {
    const hero = render(<Hero {...props} titleVariant='hero' />);
    const heroHtml = hero.container.innerHTML;
    hero.unmount();
    const { container } = render(<Hero {...props} titleVariant='show' />);
    expect(heroHtml.split('text-title-hero')).toHaveLength(2);
    expect(heroHtml.split(glow)).toHaveLength(2);
    const swapped = heroHtml.replace('text-title-hero', 'text-title-show').replace(glow, '[text-shadow:none]');
    expect(container.innerHTML).toBe(swapped);
    expect(container.innerHTML).not.toBe(heroHtml);
    expect(container.querySelector('[style]')).toBeNull();
    const markers = (html: string) => html.match(/\beg-[\w-]+/g);
    expect(markers(container.innerHTML)).toEqual(markers(heroHtml));
  });

  it('TV-05 keeps the heading node and id across hero, show and hero again', () => {
    const { rerender } = render(<Hero {...props} />);
    const heading = screen.getByRole('heading', { level: 2 });
    rerender(<Hero {...props} titleVariant='show' />);
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
    expect(heading).toHaveClass('text-title-show');
    expect(heading).not.toHaveClass('text-title-hero');
    expect(heading).toHaveAttribute('id', 'hero-title');
    rerender(<Hero {...props} titleVariant='hero' />);
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
    expect(heading).toHaveClass('text-title-hero');
    expect(heading).not.toHaveClass('text-title-show');
    expect(heading).toHaveAttribute('id', 'hero-title');
  });

  it('TV-05 keeps instance ids distinct when scenes choose different recipes', () => {
    const { container } = render(
      <>
        <Hero {...props} id='first-scene' titleVariant='show' />
        <Hero {...props} id='second-scene' title='Another ' />
      </>
    );
    const [first, second] = screen.getAllByRole('heading', { level: 2 });
    expect(first).toHaveAttribute('id', 'first-scene');
    expect(second).toHaveAttribute('id', 'second-scene');
    expect(first).toHaveClass('text-title-show');
    expect(second).toHaveClass('text-title-hero');
    expect(container.querySelectorAll('[id]')).toHaveLength(2);
  });
});
