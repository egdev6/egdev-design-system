import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MeterRow } from './MeterRow';

/**
 * ## Description
 * Named task/goal completion with a visible readout and optional persistent explanation.
 * Never use for CPU load, capacity, quota usage, rates or scores.
 *
 * ## Dependencies
 * ProgressBar supplies the sole Radix progress semantics and the thick Material well.
 *
 * ## Usage guidelines
 * Hosts own task execution, errors, cancellation and any deliberate milestone announcements.
 * Custom valueText must agree with the normalized percent. Muted identifies a named comparison
 * task, not disabled progress. className supports outer layout only; the row paints no panel.
 */
const meta: Meta<typeof MeterRow> = {
  title: 'Molecules/MeterRow',
  component: MeterRow,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof MeterRow>;

/** Required inputs only, leaving every optional default intact. */
export const Default: Story = { args: { label: 'Import files', value: 45 } };
/** Endpoints and out-of-range inputs share coherent normalized text. */
export const ValueLimits: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      {[-1, 0, 100, 142].map((value) => (
        <MeterRow key={value} label={`Import batch (${value})`} value={value} />
      ))}
    </div>
  )
};
/** Decimal completion is preserved rather than rounded by Radix's default value label. */
export const Decimal: Story = { args: { label: 'Process files', value: 42.5 } };
/** The host converts a task count into percent and supplies a coherent text equivalent. */
export const CountEquivalent: Story = {
  args: { label: 'Import archive', value: 60, valueText: '12 of 20 files imported' }
};
/** Unknown progress is static and described without a fabricated current number. */
export const Indeterminate: Story = { args: { label: 'Prepare import', value: NaN } };
/** Persistent help remains readable outside the progressbar. */
export const WithHelp: Story = {
  args: { label: 'Import files', value: 45, help: 'Keep this tab open until the import completes.' }
};
/** No help paragraph or description relationship is created when help is absent. */
export const WithoutHelp: Story = { args: { label: 'Build index', value: 20 } };
/** Each row has independent names and generated description ids. */
export const MultipleInstances: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <MeterRow label='Import images' value={NaN} help='Preparing image files.' />
      <MeterRow label='Import documents' value={60} help='Documents are processed separately.' />
    </div>
  )
};
/** A dictionary replaces the built-in phrase; task content remains caller-owned. */
export const Localized: Story = {
  args: { label: 'Import files', value: NaN, messages: { indeterminate: 'Preparing import' } }
};
/** A muted named comparison task changes the series family, not semantics or availability. */
export const ComparisonTask: Story = {
  args: { label: 'Import comparison archive', value: 60, variant: 'muted', valueText: '12 of 20 files imported' }
};

function TaskUpdates({ recovery }: { recovery: boolean }) {
  const [step, setStep] = useState(0);
  const values = recovery ? [45, NaN, 100] : [0, 45, 100];
  return (
    <div className='flex flex-col gap-4'>
      <MeterRow label='Import files' value={values[step] ?? 0} help='Updates are controlled by the host.' />
      <button type='button' onClick={() => setStep((current) => (current + 1) % values.length)}>
        Update task progress
      </button>
    </div>
  );
}
/** Host-driven finite → unknown → complete recovery has no announcement effect in the row. */
export const Recovery: Story = { render: () => <TaskUpdates recovery={true} /> };
/** A separate host control demonstrates passive prop updates without a row focus stop. */
export const PassiveUpdates: Story = { render: () => <TaskUpdates recovery={false} /> };
/** Long names, counts and help wrap without truncation, including unbroken content. */
export const LongText: Story = {
  args: {
    label: 'Import the complete project archive including images and documents',
    value: 60,
    valueText: '12 of 20 files imported from the complete project archive',
    help: 'The archive remains available while each document is processed and indexed.'
  }
};
/** Narrow parent width exercises intrinsic wrapping; no component breakpoint is involved. */
export const Narrow: Story = {
  args: LongText.args,
  decorators: [
    (Story) => (
      <div className='w-48'>
        <Story />
      </div>
    )
  ]
};
/** Native direction preserves logical label/readout order without a row-specific RTL engine. */
export const RTL: Story = {
  args: { label: 'Import files', value: 42.5, dir: 'rtl', help: 'Task completion in a right-to-left host.' }
};
/** Inspect under reduced motion: only the atom owns the fill transition policy. */
export const ReducedMotion: Story = { render: () => <TaskUpdates recovery={false} /> };
/** Supported root layout utilities do not restyle the header, key or composed atom. */
export const ConsumerLayout: Story = { args: { label: 'Import files', value: 45, className: 'w-full max-w-96 mt-4' } };
