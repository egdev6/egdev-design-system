import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Toast, ToastProvider } from './Toast';
import type { ToastProps } from './types';

function ToastDemo({ stack = false, ...props }: ToastProps & { stack?: boolean }) {
  const [messages, setMessages] = useState<number[]>([]);
  const [nextId, setNextId] = useState(0);
  return (
    <ToastProvider>
      <Button
        onClick={() => {
          setMessages((current) => (stack ? [...current, nextId] : [nextId]));
          setNextId((current) => current + 1);
        }}
      >
        Show notification
      </Button>
      {messages.map((id) => (
        <Toast
          {...props}
          key={id}
          onOpenChange={(open) => {
            props.onOpenChange?.(open);
            if (!open) {
              setMessages((current) => current.filter((message) => message !== id));
            }
          }}
        />
      ))}
    </ToastProvider>
  );
}

function ControlledDemo(props: ToastProps) {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Show controlled notification</Button>
      <Toast
        {...props}
        open={open}
        onOpenChange={(nextOpen) => {
          action('onOpenChange')(nextOpen);
          setOpen(nextOpen);
        }}
      />
    </ToastProvider>
  );
}

/**
 * ## Description
 * Short-lived feedback for a completed action, not persistent view state or a confirmation.
 *
 * ## Dependencies
 * Radix Toast owns announcements, timers, pause/resume, F8, Escape, swipe and focus. The system
 * Portal hosts the viewport; Notice supplies its shared recipe, Icon its tone cue and IconButton
 * its 48px close control. Optional actions use Button md (48px).
 *
 * ## Usage guidelines
 * Mount one ToastProvider near the app root. Consumers own their notification list, deduplication
 * and removal after onOpenChange(false); there is no imperative queue. Supply a persistent route
 * in actionAltText for every action. Alternate action children must forward props/refs and offer
 * a 44px coarse-pointer target. Closing a focused toast moves focus to the viewport (A1).
 * className permits root layout additions only, never tone or Material overrides.
 */
const meta: Meta<typeof Toast> = {
  title: 'Molecules/Toast',
  component: Toast,
  subcomponents: { toastProvider: ToastProvider },
  tags: ['autodocs'],
  render: (args) => <ToastDemo {...args} />
};
export default meta;
type Story = StoryObj<typeof Toast>;

/** Required summary only; all runtime defaults remain untouched. */
export const Default: Story = { args: { summary: 'Link copied' } };

/** Five independent launchers; danger is assertive, all other messages are polite. */
export const Tones: Story = {
  args: { summary: 'Current state' },
  render: (args) => (
    <ToastProvider>
      {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
        <ToneLauncher {...args} tone={tone} key={tone} />
      ))}
    </ToastProvider>
  )
};

function ToneLauncher(props: ToastProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{props.tone}</Button>
      <Toast {...props} open={open} onOpenChange={setOpen} />
    </>
  );
}

/** A single 48px action, with an alternate persistent route and its own handler. */
export const WithAction: Story = {
  args: {
    summary: 'Post published',
    children: 'Ready to share.',
    tone: 'success',
    actions: (
      <Button size='md' onClick={action('undo')}>
        Undo
      </Button>
    ),
    actionAltText: 'Undo publication from post history'
  }
};

/** Infinity disables auto-dismissal; close, Escape and swipe still work. */
export const Persistent: Story = { args: { summary: 'Could not publish', tone: 'danger', duration: Infinity } };

/** Repeated activation appends messages; the newest is the bottom row, without a built-in queue. */
export const Stack: Story = {
  args: { summary: 'Changes saved' },
  render: (args) => <ToastDemo {...args} stack={true} />
};

/** Close uses IconButton lg and action uses Button md; narrow content wraps, not targets. */
export const DismissTargets: Story = {
  args: {
    summary: 'Changes could not be published yet',
    children: 'Review the editor and try again.',
    tone: 'danger',
    duration: Infinity,
    actions: (
      <Button size='md' onClick={action('retry')}>
        Retry
      </Button>
    ),
    actionAltText: 'Retry publication from the editor'
  }
};

/** Consumer-owned open state acknowledges requests without incoming-prop echo events. */
export const Controlled: Story = {
  args: { summary: 'Draft saved' },
  render: (args) => <ControlledDemo {...args} />
};

/** The decorative custom glyph does not add an accessible label or a second announcement. */
export const CustomIcon: Story = { args: { summary: 'Link copied', icon: <Icon name='copy' /> } };
