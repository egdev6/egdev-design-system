import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentPropsWithoutRef } from 'react';
import { action } from 'storybook/actions';
import { Slot, Slottable } from './index';

// Story-local composition example, not an additional public button component.
function CompositionDemo({
  asChild = false,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'button';
  return <Component {...props}>{children}</Component>;
}

/**
 * Pure Radix re-exports: Slot merges props onto one child without adding a host,
 * styles or a root marker. Children must spread props and forward refs.
 * Slot has no asChild prop; composing components opt into it, as demonstrated here.
 * Class names concatenate without cn()/twMerge; child styles win conflicts.
 */
const meta = {
  title: 'Primitives/Slot',
  component: Slot,
  tags: ['autodocs']
} satisfies Meta<typeof Slot>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A composing component keeps its default native button when asChild is absent. */
export const Default: Story = {
  render: () => (
    <CompositionDemo type='button' onClick={action('button-click')}>
      Native button
    </CompositionDemo>
  )
};

/** asChild belongs to the composing component; Slot preserves the anchor semantics. */
export const AsChild: Story = {
  render: () => (
    <CompositionDemo asChild={true} onClick={action('composed-click')}>
      <a href='#slot-composition' onClick={action('child-click')}>
        Read composition documentation
      </a>
    </CompositionDemo>
  )
};

/** Slottable routes surrounding content inside the consumer's single target element. */
export const WithSlottable: Story = {
  render: () => (
    <Slot onClick={action('slottable-click')}>
      <span aria-hidden='true'>→ </span>
      <Slottable>
        <a href='#slot-composition'>Documentation with sibling content</a>
      </Slottable>
      <span aria-hidden='true'> ↗</span>
    </Slot>
  )
};
