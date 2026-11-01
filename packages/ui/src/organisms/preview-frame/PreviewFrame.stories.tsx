import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { PreviewFrame } from './PreviewFrame';

/** Decorative canvas with consumer-owned actions and footer. */
const meta: Meta<typeof PreviewFrame> = {
  title: 'Organisms/PreviewFrame',
  component: PreviewFrame,
  tags: ['autodocs'],
  args: { figureCaption: 'Preview' }
};
export default meta;
type Story = StoryObj<typeof PreviewFrame>;
export const Default: Story = {
  args: { actions: <IconButton label='Refresh preview' icon={<Icon name='user' />} />, footer: <Badge>Ready</Badge> }
};
export const Plain: Story = { args: { variant: 'plain' } };
export const Zones: Story = {
  args: {
    zones: [
      { id: 'title', label: 'Title', x: 10, y: 10, width: 80, height: 20 },
      { id: 'warning', label: 'Warning', tone: 'warning', x: 10, y: 75, width: 80, height: 15 }
    ]
  }
};
export const Portrait: Story = { args: { ratio: 9 / 16, className: 'max-w-90 mx-auto' } };
export const Variables: Story = {
  args: {
    actions: (
      <Button variant='neutral' size='sm'>
        Reset
      </Button>
    ),
    footer: <Badge tone='info'>Variables</Badge>
  }
};
export const NoSafeArea: Story = { args: { safeArea: false } };
export const Unnamed: Story = { args: { figureCaption: undefined, 'aria-label': 'Preview canvas' } };
