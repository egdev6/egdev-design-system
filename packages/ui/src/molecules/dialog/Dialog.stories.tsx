import { createAccentTheme } from '@egdev/tokens/accent';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
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
 * Sheets independently opt into full overlay width, a two-line title and header actions.
 * A clamped title needs a visible complete-title route usable by keyboard, pointer and touch;
 * native title and Tooltip are supplementary. In a sufficiently large host, the body scrolls
 * under fixed header actions. If the chrome and minimum body cannot fit, an opted-in clamp or
 * header action placement permits overlay scrolling, so top actions can move out of view.
 * Supply manageable actions and adequate spacing for extended targets, including wrapped rows.
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

/** The default inline header keeps the description beside the title and passive status. */
export const InlineHeader: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open inline settings</Button>
        </DialogTrigger>
        <DialogContent title='Settings' description='Adjust preferences.' statusText='Saved' headerLayout='inline'>
          Settings content
        </DialogContent>
      </>
    )
  }
};

/** The stacked header keeps status with the title and the description on its own line. */
export const StackedHeader: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open stacked settings</Button>
        </DialogTrigger>
        <DialogContent
          title='Settings'
          description='Adjust preferences.'
          statusText='Saved'
          size='sm'
          headerLayout='stacked'
        >
          Settings content
        </DialogContent>
      </>
    )
  }
};
/** A long title in the stacked header: the description reads as its subtitle. */
export const StackedLongTitle: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open stacked long title</Button>
        </DialogTrigger>
        <DialogContent
          title='Add a local application'
          description='Pick an executable and customize how it appears in the hub.'
          size='sm'
          headerLayout='stacked'
        >
          Application form
        </DialogContent>
      </>
    )
  }
};

/** The same long title in the inline header, for comparison. */
export const InlineLongTitle: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open inline long title</Button>
        </DialogTrigger>
        <DialogContent
          title='Add a local application'
          description='Pick an executable and customize how it appears in the hub.'
          size='sm'
          headerLayout='inline'
        >
          Application form
        </DialogContent>
      </>
    )
  }
};
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

type SheetExampleProps = {
  title: string;
  full?: boolean;
  clamp?: boolean;
  headerActions?: boolean;
  noActions?: boolean;
  headerLayout?: 'inline' | 'stacked';
};

function SheetExample({ title, full, clamp, headerActions, noActions, headerLayout }: SheetExampleProps) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const actions = noActions ? undefined : (
    <>
      <IconButton label='Edit record' icon={<Icon name='pencil' />} size='md' onClick={action('edit')} />
      <Button size='lg' labelWrap={true} onClick={action('apply')}>
        Apply changes
      </Button>
    </>
  );
  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button variant='secondary'>Open {title}</Button>
      </DialogTrigger>
      <div className='w-full max-w-[calc(var(--space-1)*137.5)] min-w-[var(--space-24)] resize-x overflow-hidden'>
        <div ref={setHost} className='relative w-full h-[calc(var(--space-24)*7)]' />
      </div>
      {host && (
        <DialogContent
          variant='sheet'
          container={host}
          size={full ? 'full' : undefined}
          title={title}
          titleOverflow={clamp ? 'clamp' : undefined}
          actionsPlacement={headerActions ? 'header' : undefined}
          headerLayout={headerLayout}
          actions={actions}
        >
          <Stack gap={3}>
            <p className='wrap-anywhere'>{title}</p>
            <Input aria-label='Record name' />
            {Array.from({ length: 24 }, (_, index) => (
              <p key={index}>Record detail {index + 1}</p>
            ))}
            <Button size='lg' onClick={action('body action')}>
              Review details
            </Button>
          </Stack>
        </DialogContent>
      )}
    </Dialog>
  );
}

/** A full sheet follows its resizable host; the host is the overlay boundary, not merely the portal mount. */
export const FullSheet: Story = {
  render: () => <SheetExample title='Full-width sheet' full={true} />
};

/** Fitting, long and unbroken titles retain a visible complete copy in the body in both layouts. */
export const ClampedSheetTitle: Story = {
  render: () => (
    <Stack gap={6}>
      <SheetExample title='Short title' clamp={true} headerLayout='inline' />
      <SheetExample
        title='A long record title that stays completely available in the scrollable body'
        clamp={true}
        headerLayout='stacked'
      />
      <SheetExample
        title='AnExtremelyLongUnbrokenRecordTitleThatRemainsAvailableInTheScrollableBody'
        clamp={true}
        headerLayout='inline'
      />
    </Stack>
  )
};

/** Header actions wrap before body controls; absent actions add no row and the built-in close remains last in Tab order. */
export const HeaderActions: Story = {
  render: () => (
    <Stack gap={6}>
      <SheetExample title='Actions above the body' headerActions={true} />
      <SheetExample title='No supplied actions' headerActions={true} noActions={true} />
    </Stack>
  )
};

/** A 440px token-derived host combines all three options and a visible complete-title route. */
export const RecadoSheet: Story = {
  render: () => (
    <SheetExample
      title='A detailed record title that remains available in full at the start of the body'
      full={true}
      clamp={true}
      headerActions={true}
      headerLayout='stacked'
    />
  )
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
