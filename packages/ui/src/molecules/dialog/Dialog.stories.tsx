import { createAccentTheme } from '@egdev/tokens/accent';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useState } from 'react';
import { Button } from '../../atoms/button';
import { Input } from '../../atoms/input';
import { Stack } from '../../primitives/stack';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './Dialog';

/**
 * ## Description
 * Radix modal dialog with a body portal or a ready custom host.
 *
 * ## Dependencies
 * Surface supplies panel material; Button, Input and Stack compose the examples.
 *
 * ## Usage guidelines
 * A container host must be connected, positioned, non-scrolling and have a definite size.
 * Render Content after its ref is ready and close before replacing or removing it. A custom
 * host bounds paint, not Radix's document-wide modal interaction. Viewport scope requires
 * ancestors without clipping or fixed-position containing blocks. Content className merges
 * last; reserved panel geometry, paint, focus and positioning overrides are unsupported.
 */
const meta = {
  title: 'Molecules/Dialog',
  component: Dialog,
  subcomponents: { dialogTrigger: DialogTrigger, dialogContent: DialogContent, dialogClose: DialogClose },
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open settings</Button>
        </DialogTrigger>
        <DialogContent title='Settings' description='Adjust preferences.'>
          Settings content
        </DialogContent>
      </>
    )
  }
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithSplitAction: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open settings</Button>
        </DialogTrigger>
        <DialogContent
          title='Settings'
          actions={
            <>
              <Button size='sm'>Apply</Button>
              <DialogClose asChild={true}>
                <Button variant='neutral' size='sm'>
                  Cancel
                </Button>
              </DialogClose>
            </>
          }
        >
          Settings content
        </DialogContent>
      </>
    )
  }
};
export const Sizes: Story = {
  render: () => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild={true}>
            <Button variant='secondary'>{size}</Button>
          </DialogTrigger>
          <DialogContent title={`${size} dialog`} size={size}>
            Content
          </DialogContent>
        </Dialog>
      ))}
    </>
  )
};
export const Full: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open full dialog</Button>
        </DialogTrigger>
        <DialogContent title='Full dialog' size='full'>
          Content
        </DialogContent>
      </>
    )
  }
};
export const Sheet: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open sheet</Button>
        </DialogTrigger>
        <DialogContent title='Sheet' variant='sheet'>
          Content
        </DialogContent>
      </>
    )
  }
};
export const LongContent: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open long dialog</Button>
        </DialogTrigger>
        <DialogContent title='Long content'>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>Paragraph {i + 1}</p>
          ))}
        </DialogContent>
      </>
    )
  }
};
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open controlled dialog</Button>
        </DialogTrigger>
        <DialogContent title='Controlled'>Content</DialogContent>
      </Dialog>
    );
  }
};
function ContainerExample({ viewport = false }: { viewport?: boolean }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button variant='secondary'>Open hosted dialog</Button>
      </DialogTrigger>
      <div ref={setHost} className='relative w-full max-w-[calc(var(--space-24)*8)] h-[calc(var(--space-24)*6)]' />
      {host && (
        <DialogContent
          title={viewport ? 'Viewport overlay' : 'Contained overlay'}
          container={host}
          overlayScope={viewport ? 'viewport' : undefined}
        >
          The portal is mounted in the positioned host.
        </DialogContent>
      )}
    </Dialog>
  );
}

/** A ready positioned host bounds the overlay and panel; Radix modality remains document-wide. */
export const Container: Story = { render: () => <ContainerExample /> };

/** A custom mount may keep viewport layout when its ancestors do not clip or transform it. */
export const ContainerViewport: Story = { render: () => <ContainerExample viewport={true} /> };

function RuntimeAccentExample() {
  const [accent, setAccent] = useState('#0000aa');
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const theme = createAccentTheme(accent);
  const red = createAccentTheme(null);
  return (
    <Stack gap={4}>
      <Input aria-label='Accent hex' value={accent} onChange={(event) => setAccent(event.currentTarget.value)} />
      <div style={theme.variables as CSSProperties}>
        <Stack gap={4}>
          <p className='text-fg-brand-default'>
            {theme.mode} accent: {theme.normalizedAccent}
          </p>
          <Button>Scoped primary action</Button>
          <Dialog>
            <DialogTrigger asChild={true}>
              <Button>Open themed settings</Button>
            </DialogTrigger>
            <div ref={setHost} />
            {host && (
              <DialogContent title='Themed settings' container={host} overlayScope='viewport'>
                <Stack gap={4}>
                  <p className='text-fg-brand-default'>This portal inherits the surrounding theme host.</p>
                  <Button>Save settings</Button>
                </Stack>
              </DialogContent>
            )}
          </Dialog>
          <div style={red.variables as CSSProperties}>
            <p className='text-fg-brand-default'>Nested default red</p>
            <Button>Default red action</Button>
          </div>
        </Stack>
      </div>
      <p>Secondary gradients and primitive-backed colors do not automatically follow this accent.</p>
    </Stack>
  );
}

/** Apply a complete map to a consumer host and mount the Dialog portal beneath that host. */
export const RuntimeAccent: Story = { render: () => <RuntimeAccentExample /> };

/** Compact body padding and Stack child gaps are independent; the existing Button opts into wrapping. */
export const CompactForm: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open compact form</Button>
        </DialogTrigger>
        <DialogContent
          title='Compact form'
          bodyPadding='compact'
          size='sm'
          actions={<Button labelWrap={true}>Save these detailed account preferences</Button>}
        >
          <Stack gap={3}>
            <Input aria-label='Display name' placeholder='Display name' />
            <Input aria-label='Email address' type='email' placeholder='Email address' />
          </Stack>
        </DialogContent>
      </>
    )
  }
};

/** A compact body remains the scroll viewport while its header and actions stay in place. */
export const CompactLongContent: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open compact long content</Button>
        </DialogTrigger>
        <DialogContent
          title='Compact long content'
          bodyPadding='compact'
          size='sm'
          actions={
            <DialogClose asChild={true}>
              <Button>Done</Button>
            </DialogClose>
          }
        >
          <Stack gap={3}>
            {Array.from({ length: 30 }, (_, index) => (
              <p key={index}>Preference detail {index + 1}</p>
            ))}
          </Stack>
        </DialogContent>
      </>
    )
  }
};

export const WithoutTrigger: Story = {
  render: function WithoutTriggerStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant='secondary' onClick={() => setOpen(true)}>
          Open externally
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent title='External trigger'>The consumer owns focus restoration.</DialogContent>
        </Dialog>
      </>
    );
  }
};
