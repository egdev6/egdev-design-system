import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../../atoms/icon';
import { Link } from '../../atoms/link';
import { Logo } from '../../atoms/logo';
import { SocialLinks } from '../../molecules/social-links';
import { Text } from '../../primitives/text';
import { SectionShell } from '../../templates/section-shell';
import { Footer, FooterBrand, FooterLegal, FooterMotto, FooterNavigation, FooterSocial } from './Footer';
import { footerHeadingVariants } from './index';

/**
 * Passive site boundary with consumer-owned content. The host owns the background unless `register` is `grafito`,
 * and `wrap` is opt-in.
 */
const meta: Meta<typeof Footer> = {
  title: 'Organisms/Footer',
  component: Footer,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Footer>;

const social = (
  <SocialLinks
    label='Community profiles'
    caption={null}
    variant='ghost'
    size='lg'
    items={[{ id: 'profile', label: 'Community profile', href: 'https://example.org', icon: <Icon name='github' /> }]}
  />
);
const content = (
  <>
    <FooterMotto>
      <Text variant='display'>Make useful things together.</Text>
    </FooterMotto>
    <FooterBrand>
      <Logo href='/' label='Home' />
      <p className='text-body-default text-fg-secondary'>Independent ideas and projects.</p>
    </FooterBrand>
    <FooterNavigation
      label='Explore'
      items={[
        { href: '#projects', label: 'Projects' },
        { href: '#notes', label: 'Notes' }
      ]}
    />
    <FooterSocial>
      <h2 className={footerHeadingVariants()}>Elsewhere</h2>
      {social}
    </FooterSocial>
    <FooterLegal>
      <span>Community project</span>
      <Link href='#privacy' arrow={false}>
        Privacy
      </Link>
    </FooterLegal>
  </>
);

/** Consumer-supplied content fills the optional regions. */
export const Default: Story = { args: { children: content } };
/** No absent region creates a placeholder. */
export const Minimal: Story = { args: { children: <FooterLegal>Independent project</FooterLegal> } };
/** The site footer follows main rather than being nested in it. */
export const Landmark: Story = {
  args: { children: content },
  render: (args) => (
    <>
      <main>
        <h1>Page</h1>
      </main>
      <Footer {...args} />
    </>
  )
};
/** An empty navigation collection is omitted. */
export const Empty: Story = { args: { children: <FooterNavigation label='Explore' items={[]} /> } };
/** Invalid entries are omitted without changing the valid destination. */
export const Invalid: Story = {
  args: {
    children: (
      <FooterNavigation
        label='Explore'
        items={[
          { href: '', label: 'Invalid' },
          { href: '#notes', label: 'Notes' }
        ]}
      />
    )
  }
};
/**
 * The host marks the current page on one link, which renders `aria-current="page"`; the Footer adds no visual cue
 * and never infers the current page. Mark at most one link across the Footer, and pass the literal `'page'` or
 * `undefined`: a `current && 'page'` expression can yield `false`, which the type rejects.
 */
export const CurrentPage: Story = {
  args: {
    children: (
      <FooterNavigation
        label='Explore'
        items={[
          { href: '#projects', label: 'Projects' },
          { href: '#notes', label: 'Notes', 'aria-current': 'page' }
        ]}
      />
    )
  }
};
/** A social heading accompanies the separately named list. */
export const Social: Story = {
  args: {
    children: (
      <FooterSocial>
        <h2 className={footerHeadingVariants()}>Elsewhere</h2>
        {social}
      </FooterSocial>
    )
  }
};
/** The host owns visibility and any adjacent navigation. */
export const HostComposition: Story = {
  args: { children: content },
  render: (args) => (
    <>
      <nav aria-label='Host navigation'>
        <Link href='#content' arrow={false}>
          Content
        </Link>
      </nav>
      <main id='content'>Content</main>
      <Footer {...args} />
    </>
  )
};
/** Long consumer content remains in reading order. */
export const Responsive: Story = {
  args: {
    children: (
      <>
        <FooterBrand>Brand with a deliberately long localized description that can wrap naturally.</FooterBrand>
        <FooterNavigation
          label='Explore this collection'
          items={[{ href: '#long', label: 'A long destination label for a narrow viewport' }]}
        />
        <FooterLegal>Long legal content supplied entirely by the host application.</FooterLegal>
      </>
    )
  }
};
/** Native links retain their own focus treatment and keyboard behavior. */
export const Focus: Story = { args: { children: content } };
/** The host may supply outer layout classes and native attributes. */
export const Composition: Story = { args: { id: 'site-footer', className: 'w-full', children: content } };
/**
 * `wrap` centers the motto, grid and legal row on the page content edge, the same edge as a wrapped section above
 * it. The root hairlines and bottom padding stay full width; the inner hairlines span the content box.
 */
export const Wrapped: Story = {
  args: { wrap: true, children: content },
  render: (args) => (
    <>
      <SectionShell aria-label='Wrapped section'>
        <p className='text-body-default text-fg-secondary'>Section content on the page content edge.</p>
      </SectionShell>
      <Footer {...args} />
    </>
  )
};
/**
 * `register='grafito'` paints the Grafito reading wash on the footer root, which stays a native `footer` at its
 * natural height. The backdrop here stands in for the ambient layer, which the host owns.
 */
export const Grafito: Story = {
  args: { register: 'grafito', children: content },
  render: (args) => (
    <div className='bg-surface-2'>
      <Footer {...args} />
    </div>
  )
};
/** Both props are independent: the wash spans the root and the wrapper only constrains the content. */
export const WrappedGrafito: Story = {
  args: { wrap: true, register: 'grafito', children: content },
  render: (args) => (
    <div className='bg-surface-2'>
      <Footer {...args} />
    </div>
  )
};
/**
 * The group-edge fade is host-owned and is not Footer API. The host paints a masked `aria-hidden` underlay and
 * suppresses the footer's own wash locally through the stable `eg-footer` marker, as the SectionShell stories do for
 * `eg-section`.
 */
export const HostFade: Story = {
  args: { wrap: true, register: 'grafito', children: content },
  render: (args) => (
    <div className='relative isolate [&_.eg-footer]:bg-transparent'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10 bg-surface-0/50 [mask-image:var(--mask-section-fade-top)] [-webkit-mask-image:var(--mask-section-fade-top)] [@media(prefers-reduced-transparency:reduce)]:bg-surface-0'
      />
      <Footer {...args} />
    </div>
  )
};
