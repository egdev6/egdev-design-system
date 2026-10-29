import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Gauge } from '../../atoms/gauge';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { GaugeDock, GaugeDockItem, GaugeDockSeparator } from './index';

/**
 * ## Description
 * Groups independent passive measurements beside their related detail actions.
 *
 * ## Dependencies
 * Radix Toolbar owns keyboard/focus; Surface owns overlay Material; Gauge owns each reading.
 * Button and IconButton provide named, independently sized action targets.
 *
 * ## Usage guidelines
 * Supply a direct Gauge and one native-button-compatible action per Item. Actions must forward
 * props/ref to a single button and expose disabled on the supplied element. Use Button md or
 * IconButton lg for touch. No links, nested buttons, selection, totals or automatic panels.
 * Set dir explicitly for RTL. The host owns placement, clipping constraints and focus fallback
 * before removing a focused action. className supports outer layout, not appearance overrides.
 */
const meta = {
  title: 'Molecules/GaugeDock',
  component: GaugeDock,
  subcomponents: { gaugeDockItem: GaugeDockItem, gaugeDockSeparator: GaugeDockSeparator },
  tags: ['autodocs'],
  args: {
    label: 'Usage detail actions',
    children: [
      <GaugeDockItem key='a'>
        <Gauge label='Provider A session usage' value={0} size='sm' />
        <Button onClick={action('Open Provider A session details')}>Open Provider A</Button>
      </GaugeDockItem>,
      <GaugeDockSeparator key='separator' />,
      <GaugeDockItem key='b'>
        <Gauge label='Provider B daily usage' value={72.25} size='sm' />
        <Button onClick={action('Open Provider B daily details')}>Open Provider B</Button>
      </GaugeDockItem>
    ]
  }
} satisfies Meta<typeof GaugeDock>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Independent zero and decimal readings; only required Dock inputs are supplied. */
export const Default: Story = {};

/** Up/Down replace inline arrows; separators automatically become horizontal. */
export const Vertical: Story = { args: { orientation: 'vertical' } };

/** Explicit RTL configures Radix inline navigation, independently of inherited CSS direction. */
export const RTL: Story = { args: { dir: 'rtl' } };

/** A readable Gauge does not become disabled when its separate action is disabled. */
export const DisabledAction: Story = {
  args: {
    children: (
      <GaugeDockItem>
        <Gauge label='Provider A session usage' value={42} size='sm' />
        <Button disabled={true}>Open Provider A</Button>
      </GaugeDockItem>
    )
  }
};

/** No enabled Tab target is invented; all measurements remain available for reading. */
export const AllDisabled: Story = { args: { ...DisabledAction.args, orientation: 'vertical' } };

/** Unavailable/muted readings are independent of whether details remain operable. */
export const IndependentReadings: Story = {
  args: {
    children: (
      <>
        <GaugeDockItem>
          <Gauge label='Provider A session usage' value={NaN} unavailableText='Session reading offline' />
          <Button onClick={action('Open offline session details')}>Open Provider A</Button>
        </GaugeDockItem>
        <GaugeDockSeparator />
        <GaugeDockItem>
          <Gauge label='Provider B daily usage' value={25} state='muted' stateText='Previous day' size='sm' />
          <Button onClick={action('Open previous day details')}>Open Provider B</Button>
        </GaugeDockItem>
      </>
    )
  }
};

/** A separate, independently named 48px icon action receives focus, never the Gauge. */
export const WithDetailAction: Story = {
  args: {
    children: (
      <GaugeDockItem>
        <Gauge label='Provider A session usage' value={42.5} size='sm' center='A' />
        <IconButton
          label='Open Provider A session details'
          icon={<Icon name='arrow-right' />}
          size='lg'
          onClick={action('Open Provider A session details')}
        />
      </GaugeDockItem>
    )
  }
};

/** A constrained host allows native scrolling rather than clipping long condition cues. */
export const LongStateText: Story = {
  args: {
    className: 'max-w-80',
    children: (
      <GaugeDockItem>
        <Gauge
          label='Provider A session usage'
          value={95}
          size='sm'
          state='critical'
          stateText='Session limit reached; details remain available for the current time window'
        />
        <Button onClick={action('Open critical session details')}>Open Provider A</Button>
      </GaugeDockItem>
    )
  }
};

/** No placeholder toolbar, measurement or action is fabricated for null content. */
export const Empty: Story = { args: { children: null } };
