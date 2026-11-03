import { Button } from '@egdev/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollReveal } from './ScrollReveal';

/**
 * Scroll-triggered entrance utility: the default wrapper fades in and rises (`reveal`) or
 * uncovers left to right via clip-path (`wipe`) when it enters the viewport. Fail-open without
 * JavaScript or observation support, once-only, reduced-motion safe, and transparent to
 * accessibility. In a static canvas the element is above the fold line, so the pre-pass reveals
 * it immediately without a transition.
 */
const meta = {
  title: 'Atoms/ScrollReveal',
  component: ScrollReveal,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default reveal entrance: fades in and rises 22.4px when scrolled into view. */
export const Reveal: Story = {
  args: {
    children: (
      <p className='max-w-md text-body-default'>
        Content becomes visible when it enters the viewport, with a 560ms fade and rise.
      </p>
    )
  }
};

/** Wipe entrance: uncovers the content left to right via clip-path. */
export const Wipe: Story = {
  args: {
    variant: 'wipe',
    children: (
      <h2 className='max-w-md text-heading-small'>
        The heading uncovers left to right over 800ms, then drops its clip-path entirely.
      </h2>
    )
  }
};

/** Per-element stagger delay applied through the scoped numeric custom property. */
export const StaggerDelay: Story = {
  args: {
    delay: 300,
    children: (
      <p className='max-w-md text-body-default'>
        A finite nonnegative delay staggers the entrance; invalid values are ignored.
      </p>
    )
  }
};

/** Restricted asChild composition onto a single native child, such as a list item. */
export const NativeListItem: Story = {
  render: () => (
    <ul className='list-disc pl-6'>
      <ScrollReveal asChild={true}>
        <li className='max-w-md text-body-default'>
          Native list items keep their semantics without a wrapper element.
        </li>
      </ScrollReveal>
      <ScrollReveal asChild={true} delay={150}>
        <li className='max-w-md text-body-default'>Delays still compose with the merged markers.</li>
      </ScrollReveal>
    </ul>
  )
};

/** Wrapper mode leaves the child's own state markers, transforms and transitions untouched. */
export const StatefulChild: Story = {
  args: {
    children: (
      <div data-state='open' className='max-w-md p-4 transition-transform translate-x-2 text-body-default'>
        The child keeps its own data-state, transform and transition while the wrapper owns the entrance.
      </div>
    )
  }
};

/** Scroll or tab into the below-fold target to exercise a real entrance rather than the pre-pass. */
export const ScrollPlayground: Story = {
  args: { variant: 'reveal', delay: 150 },
  render: (args) => (
    <div className='grid gap-8'>
      <p>Scroll down for the entrance, or press Tab to reveal the target immediately on focus.</p>
      <div className='h-screen' aria-hidden={true} />
      <ScrollReveal {...args} data-testid='entrance-target'>
        <p>This content starts below the observation boundary.</p>
        <Button asChild={true} size='lg'>
          <a href='#after-entrance'>Focus reveals content</a>
        </Button>
      </ScrollReveal>
      <div className='h-screen' aria-hidden={true} />
      <p id='after-entrance'>After the entrance</p>
    </div>
  )
};
