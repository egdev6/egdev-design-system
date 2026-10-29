import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Link } from '../../atoms/link';
import { Stat } from '../../atoms/stat';
import { Stack } from '../../primitives/stack';
import { ModuleCard } from './ModuleCard';

/**
 * ## Description
 * A passive, named capability summary or compact settings panel with independent controls.
 *
 * ## Dependencies
 * Surface supplies root and band Material recipes; Badge and Icon supply readable status.
 * Consumers supply Button/Link actions and optionally an IconButton utility in the footer.
 *
 * ## Usage guidelines
 * Supply meaningful body content and one or two actions for error/stopped. Footer is metadata,
 * not a replacement action region. Stopped supports only default/surface-1. Root className is
 * external layout only. Overlay paints a genuinely floating host; it adds no positioning,
 * Portal, dialog semantics or focus management. No stylesheet or whole-card activation.
 */
const meta = {
  title: 'Molecules/ModuleCard',
  component: ModuleCard,
  tags: ['autodocs'],
  args: { title: 'Automation', children: 'Coordinate repetitive work with a reusable capability.' }
} satisfies Meta<typeof ModuleCard>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Required inputs only: the component chooses h2, Ready and solid Material. */
export const Default: Story = {};
/** Independent instances derive different heading relationships, even with identical titles. */
export const MultipleInstances: Story = {
  render: (args) => (
    <Stack>
      <ModuleCard {...args} />
      <ModuleCard {...args} />
    </Stack>
  )
};
/** Native heading ranks change document semantics, never the typography recipe. */
export const HeadingLevels: Story = {
  render: (args) => (
    <Stack>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <ModuleCard {...args} key={level} level={level} title={`Level ${level}`} />
      ))}
    </Stack>
  )
};
/** Decorative identity is supplementary to the complete visible heading. */
export const WithIcon: Story = { args: { icon: <Icon name='plug' /> } };
/** Error explains the issue and leaves a real recovery action usable. */
// biome-ignore lint/suspicious/noShadowRestrictedNames: The approved story matrix names this scenario Error.
export const Error: Story = {
  args: {
    status: 'error',
    children: 'The connection could not be established. Check the credentials and try again.',
    actions: <Button onClick={action('Retry')}>Retry</Button>
  }
};
/** Stopped is unpainted and dashed, never a disabled subtree. */
export const Stopped: Story = {
  args: {
    status: 'stopped',
    children: 'This capability is paused until you enable it.',
    actions: <Button onClick={action('Start')}>Start</Button>
  }
};
/** All valid inputs: default/error across both variants and tones, plus bounded stopped. */
export const Combinations: Story = {
  render: (args) => (
    <Stack>
      {(['default', 'error'] as const).flatMap((status) =>
        (['default', 'banded'] as const).flatMap((variant) =>
          (['surface-1', 'overlay'] as const).map((tone) => (
            <ModuleCard
              {...args}
              key={`${status}-${variant}-${tone}`}
              title={`${status} / ${variant} / ${tone}`}
              status={status}
              variant={variant}
              tone={tone}
              actions={<Button onClick={action('Review')}>Review</Button>}
              footer='Updated recently'
            >
              Review this capability and its configuration.
            </ModuleCard>
          ))
        )
      )}
      <ModuleCard
        {...args}
        status='stopped'
        variant='default'
        tone='surface-1'
        actions={<Button onClick={action('Start')}>Start</Button>}
      />
    </Stack>
  )
};
/** Status phrases always accompany decorative glyphs; no service lifecycle is inferred. */
export const Statuses: Story = {
  render: (args) => (
    <Stack>
      {(['default', 'error', 'stopped'] as const).map((status) => (
        <ModuleCard
          {...args}
          key={status}
          status={status}
          variant='default'
          tone='surface-1'
          actions={<Button onClick={action('Review')}>Review</Button>}
        >
          Review this capability before proceeding.
        </ModuleCard>
      ))}
    </Stack>
  )
};
/** Partial dictionaries specialize the readable words while keeping omitted defaults. */
export const Localized: Story = { args: { messages: { defaultStatus: 'Available', errorStatus: 'Review needed' } } };
/** Brighter header, inherited body/actions and lower metadata band without nested cards. */
export const Banded: Story = {
  args: {
    variant: 'banded',
    icon: <Icon name='settings' />,
    actions: <Button onClick={action('Configure')}>Configure</Button>,
    footer: (
      <>
        <span>Updated just now</span>
        <IconButton label='Refresh' icon={<Icon name='radio' />} onClick={action('Refresh')} />
      </>
    )
  }
};
/** Omission adds no footer band/separator; the last content region owns bottom corners. */
export const BandedWithoutFooter: Story = { args: { variant: 'banded' } };
/** Static overlay Material only; a separately reviewed floating host owns behavior. */
export const Overlay: Story = { args: { tone: 'overlay' } };
/** Overlay body exposes root paint; the upper/lower bands use surface-3/surface-1. */
export const OverlayBanded: Story = {
  args: { tone: 'overlay', variant: 'banded', footer: 'Floating context metadata' }
};
/** Danger border does not remove overlay blur, elevation or solid fallbacks. */
export const OverlayError: Story = {
  args: {
    tone: 'overlay',
    variant: 'banded',
    status: 'error',
    children: 'The connection expired. Reconnect to continue.',
    actions: <Button onClick={action('Reconnect')}>Reconnect</Button>,
    footer: 'Last checked recently'
  }
};
/** Emulate reduced transparency or unsupported backdrop-filter in the browser to inspect Surface's real fallback; no simulated paint override. */
export const OverlayFallback: Story = {
  args: { tone: 'overlay', variant: 'banded', footer: 'Bands retain their defined tones' }
};
/** Wide is placement in an explicit parent grid, not a component state or minimum width. */
export const Wide: Story = {
  render: (args) => (
    <div className='grid grid-cols-2 gap-4'>
      <ModuleCard {...args} title='First' />
      <ModuleCard {...args} title='Second' />
      <ModuleCard {...args} title='Full row' className='col-span-full' />
    </div>
  )
};
/** Banded full-row composition uses the same parent layout contract. */
export const WideBanded: Story = {
  render: (args) => (
    <div className='grid grid-cols-2 gap-4'>
      <ModuleCard {...args} title='First' />
      <ModuleCard
        {...args}
        title='Full row'
        status='default'
        variant='banded'
        footer='Supplementary context'
        className='col-span-full'
      />
    </div>
  )
};
/** One action stays at logical start; only the last of multiple controls moves to the end. */
export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button onClick={action('Configure')}>Configure</Button>
        <Link href='#details'>Details</Link>
      </>
    )
  }
};
/** Footer follows primary actions and contains at most one supplementary utility. */
export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <span>Last checked just now</span>
        <IconButton label='Refresh' icon={<Icon name='radio' />} onClick={action('Refresh')} />
      </>
    )
  }
};
/** Body figures and child loading/disabled feedback remain consumer-owned. */
export const ChildStates: Story = {
  args: {
    children: <Stat label='Completed tasks' value={24} />,
    actions: (
      <>
        <Button loading={true}>Saving</Button>
        <Button disabled={true}>Unavailable</Button>
      </>
    )
  }
};
/** Logical spacing/alignment keeps the same reading and focus order in RTL. */
export const RTL: Story = {
  args: {
    dir: 'rtl',
    variant: 'banded',
    actions: (
      <>
        <Button onClick={action('Configure')}>Configure</Button>
        <Link href='#details'>Details</Link>
      </>
    ),
    footer: 'Updated today'
  }
};
/** Pointer hover adds no container lift/focus stop; only the child owns activation. */
export const NoContainerInteraction: Story = {
  args: { actions: <Button onClick={action('Configure')}>Configure</Button> }
};
/** Titles and body wrap rather than truncate; concise status phrases stay in one Badge. */
export const LongContent: Story = {
  args: {
    title: 'A capability with a long descriptive title that wraps without hiding its identity',
    children:
      'Detailed supporting context remains free content. The consumer supplies figures, explanations and related controls without automatic truncation.',
    footer: 'Additional context that may wrap independently of the title and body.'
  }
};
/** Narrow parent layout exercises wrapping without imposing a card minimum width. */
export const Narrow: Story = {
  args: {
    className: 'max-w-64',
    actions: <Button onClick={action('Configure')}>Configure</Button>,
    footer: 'Updated today'
  }
};
/** Recognized layout classes merge on the article, not on its internal parts. */
export const ConsumerLayout: Story = { args: { id: 'automation-module', className: 'w-full max-w-96 mx-auto' } };
