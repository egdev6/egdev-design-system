import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cluster } from './Cluster';
import { Stack } from './Stack';

/**
 * ## Description
 * A vertical flow with token gaps, no wrapping and no paint. Layout belongs to the
 * primitive; visible boxes in these examples are illustrative consumer content.
 *
 * ## Usage guidelines
 * Compose Surface for material treatment and Text for typography; Stack adds structure only.
 * className supports outer sizing and placement, not gap, direction, wrapping or alignment.
 * `asChild` merges the layout onto exactly one prop-spreading child, keeping its semantics.
 */
const meta: Meta<typeof Stack> = {
  title: 'Primitives/Stack',
  component: Stack,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Stack>;

const well = 'rounded-md border border-border-control bg-surface-0 shadow-well px-4 py-3 text-fg-muted';

/** Omitting every prop preserves the approved column defaults. */
export const Default: Story = {
  args: {
    children: (
      <>
        <div className={well}>First child</div>
        <div className={well}>Second child</div>
        <div className={well}>Third child</div>
      </>
    )
  }
};

/** Every token key from 0 to 24 resolves an existing spacing token; no arbitrary lengths. */
export const Gaps: Story = {
  args: { children: <div className={well}>Reference child</div> },
  render: (args) => (
    <div className='flex flex-wrap items-start gap-6'>
      {([0, 2, 4, 6] as const).map((gap) => (
        <div className='w-[calc(var(--space-16)*2)] max-w-full' key={gap}>
          <p className='m-0 text-fg-secondary'>gap {gap}</p>
          <Stack {...args} gap={gap}>
            <div className={well}>One</div>
            <div className={well}>Two</div>
          </Stack>
        </div>
      ))}
    </div>
  )
};

/** Cross-axis alignment from stretch to baseline on the vertical main flow. */
export const Alignment: Story = {
  args: { children: <div className={well}>Reference child</div> },
  render: (args) => (
    <div className='flex flex-col gap-6'>
      {(['stretch', 'center', 'end'] as const).map((align) => (
        <Stack {...args} alignItems={align} gap={2} className='w-full' key={align}>
          <div className={`${well} w-[calc(var(--space-16)*2)]`}>start-sized</div>
          <div className={`${well} w-[calc(var(--space-16))]`}>narrow</div>
          <p className='m-0 text-fg-secondary'>{align}</p>
        </Stack>
      ))}
    </div>
  )
};

/** Nested stacks and clusters keep independent direction, wrapping and gaps. */
export const Nested: Story = {
  args: {
    gap: 6,
    children: (
      <>
        <Cluster gap={3}>
          <div className={well}>cluster one</div>
          <div className={well}>cluster two</div>
          <div className={well}>cluster three</div>
        </Cluster>
        <Stack gap={2}>
          <div className={well}>nested stack A</div>
          <div className={well}>nested stack B</div>
        </Stack>
      </>
    )
  }
};

/** The semantic list remains the root: no wrapper div and direct li children. */
export const AsChild: Story = {
  args: {
    asChild: true,
    gap: 3,
    children: (
      <ul className='m-0 list-none p-0' aria-label='Composed sections'>
        <li className={well}>list item one</li>
        <li className={well}>list item two</li>
      </ul>
    )
  }
};
