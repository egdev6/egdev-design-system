import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../../atoms/icon';
import { Logo } from '../../atoms/logo';
import { SocialLinks } from '../../molecules/social-links';
import { Text } from '../../primitives/text';
import { Footer, FooterBrand, FooterLegal, FooterMotto, FooterNavigation, FooterSocial } from './Footer';

/** Passive site boundary with consumer-owned content and a host-owned background. */
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
      <p>Independent ideas and projects.</p>
    </FooterBrand>
    <FooterNavigation
      label='Explore'
      items={[
        { href: '#projects', label: 'Projects' },
        { href: '#notes', label: 'Notes' }
      ]}
    />
    <FooterSocial>
      <h2>Elsewhere</h2>
      {social}
    </FooterSocial>
    <FooterLegal>
      <span>Community project</span>
      <a href='#privacy'>Privacy</a>
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
/** A social heading accompanies the separately named list. */
export const Social: Story = {
  args: {
    children: (
      <FooterSocial>
        <h2>Elsewhere</h2>
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
        <a href='#content'>Content</a>
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
