import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useRef, useState } from 'react';
import { action } from 'storybook/actions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';

/**
 * ## Description
 * One named in-flow disclosure. Independent sections may stay open together; this is not Accordion.
 *
 * ## Dependencies
 * Radix Collapsible owns state, activation, relationships and presence. Surface supplies the fixed
 * Material frame, the internal ghost/md Button recipe styles the native Trigger, and Icon supplies
 * the decorative caret. The Button component/state hook is not used.
 *
 * ## Usage guidelines
 * Supply exactly one Trigger/Content pair. Use a non-empty visible label without nested controls.
 * Closed Content keeps its hidden shell/id but unmounts children; lift persistent form state outside.
 * Closed Trigger omits aria-controls; open/reopen restores the native relationship. No forceMount,
 * public asChild, body animation, automatic focus restoration or accordion navigation is provided.
 * Only Trigger forwards a ref. Move focus yourself before externally closing focused body content.
 * className is merged last: Root supports outer margin, width/max-width and grid/flex placement;
 * Trigger/Content support outer margin/self-alignment only. Paint/padding/presence/target overrides
 * are unsupported; twMerge recognition does not imply universal last-class cascade precedence.
 */
const meta = {
  title: 'Molecules/Collapsible',
  component: Collapsible,
  subcomponents: { trigger: CollapsibleTrigger, content: CollapsibleContent },
  tags: ['autodocs']
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Supplies only the required composition, preserving every native and appearance default. */
export const Default: Story = {
  args: {
    children: (
      <>
        <CollapsibleTrigger>Consumption history</CollapsibleTrigger>
        <CollapsibleContent>Recent consumption readings are available here.</CollapsibleContent>
      </>
    )
  }
};

/** Starts open without a mount callback; defaultOpen is initialization, not ongoing control. */
export const InitiallyOpen: Story = {
  args: { children: Default.args.children, defaultOpen: true }
};

/** The consumer owns visibility and accepts native next-value requests; Actions logs requests only. */
export const Controlled: Story = {
  args: { ...Default.args, onOpenChange: action('onOpenChange') },
  render: function ControlledExample({ children, onOpenChange }) {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible
        open={open}
        onOpenChange={(next) => {
          onOpenChange?.(next);
          setOpen(next);
        }}
      >
        {children}
      </Collapsible>
    );
  }
};

/** Native preventDefault vetoes Radix's toggle; no next-value request should appear in Actions. */
export const CanceledActivation: Story = {
  args: {
    onOpenChange: action('onOpenChange'),
    children: (
      <>
        <CollapsibleTrigger
          onClick={(event) => {
            action('canceled click')();
            event.preventDefault();
          }}
        >
          Locked history disclosure
        </CollapsibleTrigger>
        <CollapsibleContent>This body remains closed while activation is canceled.</CollapsibleContent>
      </>
    )
  }
};

/** Disabled is native and Trigger-only; the closed body has no interactive descendants in the DOM. */
export const DisabledClosed: Story = {
  args: { ...Default.args, disabled: true, onOpenChange: action('onOpenChange') }
};

/** Disabling does not close or dim an open body, and its consumer controls remain enabled. */
export const DisabledOpen: Story = {
  args: {
    disabled: true,
    defaultOpen: true,
    onOpenChange: action('onOpenChange'),
    children: (
      <>
        <CollapsibleTrigger>History unavailable to toggle</CollapsibleTrigger>
        <CollapsibleContent>
          <label>
            History note <input defaultValue='Editable while open' />
          </label>
        </CollapsibleContent>
      </>
    )
  }
};

/** Tab to Trigger, activate with Enter/Space, then Tab/Shift+Tab normally through the body. */
export const Keyboard: Story = {
  args: {
    onOpenChange: action('onOpenChange'),
    children: (
      <>
        <CollapsibleTrigger>Keyboard-accessible history</CollapsibleTrigger>
        <CollapsibleContent>
          <label>
            Filter history <input />
          </label>
          <button onClick={action('body action')}>Apply filter</button>
        </CollapsibleContent>
      </>
    )
  }
};

/** The consumer focuses Trigger before an external controlled close; the component does not restore it. */
export const ExternalClose: Story = {
  args: { children: Default.args.children },
  render: function ExternalCloseExample() {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger ref={triggerRef}>History</CollapsibleTrigger>
        <CollapsibleContent>
          <button
            onClick={() => {
              triggerRef.current?.focus();
              setOpen(false);
            }}
          >
            Close history
          </button>
        </CollapsibleContent>
      </Collapsible>
    );
  }
};

/** The ref reaches the actual native Trigger button, not Root, Surface or the decorative caret. */
export const ButtonRef: Story = {
  args: { children: Default.args.children },
  render: function ButtonRefExample() {
    const triggerRef = useRef<HTMLButtonElement>(null);
    return (
      <>
        <button onClick={() => triggerRef.current?.focus()}>Focus history trigger</button>
        <Collapsible>
          <CollapsibleTrigger ref={triggerRef}>History</CollapsibleTrigger>
          <CollapsibleContent>Recent readings</CollapsibleContent>
        </Collapsible>
      </>
    );
  }
};

/** Local child state resets after close/reopen; use lifted state when persistence is required. */
export const Remount: Story = {
  args: { defaultOpen: true, children: Default.args.children },
  render: function RemountExample() {
    return (
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Temporary counter</CollapsibleTrigger>
        <CollapsibleContent>
          <TemporaryCounter />
        </CollapsibleContent>
      </Collapsible>
    );
  }
};

function TemporaryCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Local count: {count}</button>;
}

/** Uncontrolled form fields unmount while closed; the component provides no implicit data persistence. */
export const WithFormContent: Story = {
  args: {
    defaultOpen: true,
    children: (
      <>
        <CollapsibleTrigger>Temporary history filter</CollapsibleTrigger>
        <CollapsibleContent>
          <label>
            Search <input defaultValue='Recent' />
          </label>
        </CollapsibleContent>
      </>
    )
  }
};

/** Siblings have independent state/ids, can both open, and support Root layout classes without paint changes. */
export const IndependentSections: Story = {
  args: { children: Default.args.children },
  render: () => (
    <div className='grid gap-4'>
      <Collapsible className='w-full'>
        <CollapsibleTrigger>Consumption</CollapsibleTrigger>
        <CollapsibleContent>Current consumption readings.</CollapsibleContent>
      </Collapsible>
      <Collapsible className='w-full' defaultOpen={true}>
        <CollapsibleTrigger>History</CollapsibleTrigger>
        <CollapsibleContent>Previously recorded readings.</CollapsibleContent>
      </Collapsible>
    </div>
  )
};

/** Nested disclosures own separate native relationships; closing a parent unmounts the nested Root. */
export const Nested: Story = {
  args: {
    defaultOpen: true,
    children: (
      <>
        <CollapsibleTrigger>History</CollapsibleTrigger>
        <CollapsibleContent>
          <Collapsible>
            <CollapsibleTrigger>Earlier readings</CollapsibleTrigger>
            <CollapsibleContent>Readings from earlier periods.</CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </>
    )
  }
};

/** A consumer heading wraps Trigger; no heading level or landmark is invented by Root. */
export const Heading: Story = {
  args: {
    children: (
      <>
        <h2>
          <CollapsibleTrigger>Consumption history</CollapsibleTrigger>
        </h2>
        <CollapsibleContent>Recent consumption readings.</CollapsibleContent>
      </>
    )
  }
};

/** Native naming opts a substantial body into a region; use a unique consumer Trigger id, never for styling. */
export const NamedRegion: Story = {
  args: { defaultOpen: true, children: Default.args.children },
  render: function NamedRegionExample(args) {
    const labelId = useId();
    return (
      <Collapsible {...args}>
        <CollapsibleTrigger id={labelId}>Consumption history</CollapsibleTrigger>
        <CollapsibleContent role='region' aria-labelledby={labelId}>
          Detailed consumption readings for the selected period.
        </CollapsibleContent>
      </Collapsible>
    );
  }
};

/** Inspect at narrow width and 200% zoom: the label wraps while the trailing caret does not shrink. */
export const LongLabel: Story = {
  args: {
    children: (
      <>
        <CollapsibleTrigger>
          Consumption history for the selected measurement period and
          uninterrupted-label-without-ordinary-breaking-spaces-to-check-narrow-layout
        </CollapsibleTrigger>
        <CollapsibleContent>Recent readings remain in normal document flow.</CollapsibleContent>
      </>
    )
  }
};

/** Enable the actual OS/browser reduced-motion preference: open caret rotation and transitions are removed. */
export const ReducedMotion: Story = {
  args: { children: Default.args.children, defaultOpen: true }
};
