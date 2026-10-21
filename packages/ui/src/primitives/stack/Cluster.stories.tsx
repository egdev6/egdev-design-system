import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cluster } from './Cluster';
import { Stack } from './Stack';

/**
 * ## Description
 * A horizontal wrapping row with token gaps and no paint. Items flow to another
 * row at the available width; visible boxes are illustrative consumer content.
 *
 * ## Usage guidelines
 * Wrap naturally at the container width; no orientation prop or wrap toggle exists.
 * Justification applies to each row separately; DOM and keyboard order never change.
 * Inherited `dir` controls the logical start without reversing children.
 */
const meta: Meta<typeof Cluster> = {
  title: 'Primitives/Cluster',
  component: Cluster,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Cluster>;

const well = 'rounded-md border border-border-control bg-surface-0 shadow-well px-4 py-3 text-fg-muted';

/** Omitting every prop preserves the approved wrapping-row defaults. */
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

/** Compact and roomy rows share one token scale without dynamic classes. */
export const Gaps: Story = {
  args: { children: <div className={well}>Reference child</div> },
  render: (args) => (
    <div className='flex flex-col gap-6'>
      {([0, 4] as const).map((gap) => (
        <Cluster {...args} gap={gap} key={gap}>
          <div className={well}>One</div>
          <div className={well}>Two</div>
          <div className={well}>Three</div>
        </Cluster>
      ))}
    </div>
  )
};

/** Cross-axis and main-axis choices within each wrapping row. */
export const Alignment: Story = {
  args: { children: <div className={well}>Reference child</div> },
  render: (args) => (
    <div className='flex flex-col gap-6'>
      <Cluster {...args} alignItems='baseline'>
        <span className='text-body-large'>large text</span>
        <span className='text-body-default'>default text</span>
        <span className='text-label-default'>label text</span>
      </Cluster>
      <Cluster {...args} justifyContent='between' className='w-full'>
        <div className={well}>leading</div>
        <div className={well}>trailing</div>
      </Cluster>
    </div>
  )
};

/** Constraining the host width flows items to extra rows with both gaps applied. */
export const Wrapping: Story = {
  args: { children: <div className={well}>Reference child</div> },
  render: (args) => (
    <div className='flex flex-col gap-6'>
      <Cluster {...args} className='w-full'>
        <div className={well}>wide row</div>
      </Cluster>
      <Cluster {...args} className='w-[calc(var(--space-16)*2)] max-w-full'>
        <div className={well}>constrained one</div>
        <div className={well}>constrained two</div>
        <div className={well}>constrained three</div>
      </Cluster>
    </div>
  )
};

/** Nested stacks and clusters keep independent direction, wrapping and gaps. */
export const Nested: Story = {
  args: {
    gap: 3,
    children: (
      <>
        <Stack gap={2}>
          <div className={well}>nested stack A</div>
          <div className={well}>nested stack B</div>
        </Stack>
        <Cluster gap={4}>
          <div className={well}>cluster one</div>
          <div className={well}>cluster two</div>
        </Cluster>
      </>
    )
  }
};

/** The semantic list remains the root: no wrapper div and direct li children. */
export const AsChild: Story = {
  args: {
    asChild: true,
    gap: 2,
    children: (
      <ul className='m-0 list-none p-0' aria-label='Composed links'>
        <li className={well}>list item one</li>
        <li className={well}>list item two</li>
      </ul>
    )
  }
};

/** Inherited direction starts the row from the right without reversing DOM order. */
export const RTL: Story = {
  args: { children: <div className={well}>Reference child</div> },
  render: (args) => (
    <div dir='rtl'>
      <Cluster {...args}>
        <button type='button'>أول</button>
        <button type='button'>ثانٍ</button>
        <button type='button'>ثالث</button>
      </Cluster>
    </div>
  )
};
