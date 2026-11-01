import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { ToastProvider } from './Toast';
import type { ToastApi, ToastPlacement } from './types';
import { useToast } from './useToast';

function ShowButton({ show, children = 'Show notification' }: { show: (api: ToastApi) => void; children?: string }) {
  const api = useToast();
  return <Button onClick={() => show(api)}>{children}</Button>;
}

function ShowOnMount({ title }: { title: string }) {
  const api = useToast();
  const shown = useRef(false);
  useEffect(() => {
    if (!shown.current) {
      shown.current = true;
      api.show({ title });
    }
  }, [api, title]);
  return null;
}

function PlacementDemo() {
  const [placement, setPlacement] = useState<ToastPlacement>('bottom-end');
  return (
    <div className='flex flex-col gap-4'>
      {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((option) => (
        <Button key={option} onClick={() => setPlacement(option)}>
          {option}
        </Button>
      ))}
      {/* Remounting re-anchors the viewport and makes the selected provider the active one. */}
      <ToastProvider key={placement} placement={placement}>
        <ShowOnMount title={`Placed at ${placement}`} />
      </ToastProvider>
    </div>
  );
}

/**
 * ## Description
 * Imperative short-lived feedback for a completed action, not persistent view state or a
 * confirmation. The provider renders every store-driven toast; consumers never mount one.
 *
 * ## Dependencies
 * Radix Toast owns announcements, timers, pause/resume, F8, Escape, swipe and focus; the store
 * owns identity and ordering only. The system Portal hosts the viewport; Notice supplies the
 * shared recipe, Icon the tone cue, Spinner the loading glyph and IconButton the 48px close
 * control. Optional actions use Button md (48px).
 *
 * ## Usage guidelines
 * Mount one ToastProvider near the app root and call `useToast()` anywhere below it; the most
 * recently mounted provider owns the single active viewport. Supply a persistent route in
 * actionAltText for every action. Alternate action children must forward props/refs and offer a
 * 44px coarse-pointer target. Closing a focused toast moves focus to the viewport (A1).
 * className permits root layout additions only, never tone or Material overrides.
 */
const meta: Meta<typeof ToastProvider> = {
  title: 'Molecules/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  render: (args) => (
    <ToastProvider {...args}>
      <span>Application</span>
    </ToastProvider>
  )
};
export default meta;
type Story = StoryObj<typeof ToastProvider>;

/** Required title only; all runtime defaults remain untouched. */
export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ShowButton show={(api) => api.show({ title: 'Link copied' })} />
    </ToastProvider>
  )
};

/** Five tone helpers; danger is assertive, every other message is polite. */
export const Tones: Story = {
  render: () => (
    <ToastProvider>
      {(
        [
          ['neutral', (api: ToastApi) => api.show({ title: 'Current state' })],
          ['info', (api: ToastApi) => api.info('Current state')],
          ['success', (api: ToastApi) => api.success('Current state')],
          ['warning', (api: ToastApi) => api.warning('Current state')],
          ['danger', (api: ToastApi) => api.error('Current state')]
        ] as const
      ).map(([label, show]) => (
        <ShowButton key={label} show={show}>
          {label}
        </ShowButton>
      ))}
    </ToastProvider>
  )
};

/** A single 48px action, with an alternate persistent route and its own handler. */
export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <ShowButton
        show={(api) =>
          api.show({
            title: 'Post published',
            description: 'Ready to share.',
            tone: 'success',
            actions: (
              <Button size='md' onClick={action('undo')}>
                Undo
              </Button>
            ),
            actionAltText: 'Undo publication from post history'
          })
        }
      />
    </ToastProvider>
  )
};

/** Infinity disables auto-dismissal; close, Escape and swipe still work. */
export const Persistent: Story = {
  render: () => (
    <ToastProvider>
      <ShowButton show={(api) => api.show({ title: 'Could not publish', tone: 'danger', duration: Infinity })} />
    </ToastProvider>
  )
};

/** The loading tone renders a decorative spinner and stays mounted until updated or closed. */
export const Loading: Story = {
  render: () => (
    <ToastProvider>
      <ShowButton show={(api) => api.loading('Uploading file…')} />
    </ToastProvider>
  )
};

/** toast.promise tracks a promise through loading into success or danger content and rethrows. */
export const PromiseLifecycle: Story = {
  render: () => (
    <ToastProvider>
      <ShowButton
        show={(api) => {
          void api.promise(
            new Promise<string>((resolve) => {
              window.setTimeout(() => resolve('ok'), 2000);
            }),
            { loading: 'Saving…', success: 'Saved', error: (reason: unknown) => `Save failed: ${String(reason)}` }
          );
        }}
      >
        Save now
      </ShowButton>
    </ToastProvider>
  )
};

/** Four placements re-anchor the viewport; the swipe direction derives from each anchor. */
export const Placement: Story = {
  render: () => <PlacementDemo />
};

/** maxVisible caps the mounted list; overflow queues and promotes on close. */
export const Stack: Story = {
  render: () => (
    <ToastProvider maxVisible={2}>
      <ShowButton
        show={(api) => {
          api.show({ title: 'First' });
          api.show({ title: 'Second' });
          api.show({ title: 'Third' });
        }}
      >
        Show three notifications
      </ShowButton>
    </ToastProvider>
  )
};

/** The decorative custom glyph does not add an accessible label or a second announcement. */
export const CustomIcon: Story = {
  render: () => (
    <ToastProvider>
      <ShowButton show={(api) => api.show({ title: 'Link copied', icon: <Icon name='copy' /> })} />
    </ToastProvider>
  )
};
