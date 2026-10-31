import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Portal } from '../../primitives/portal';
import { Surface } from '../../primitives/surface';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '../popover';
import { Panel, PanelBody, PanelFooter, PanelHeader } from './Panel';

/**
 * ## Description
 * A passive content unit with supplied Header, required Body and optional Footer.
 * Default and banded presentations share semantics; Panel owns no interaction or landmark.
 *
 * ## Dependencies
 * Surface owns framed Material and exported recipes supply bounded native bands.
 * Button demonstrates independent child actions. Portal hosts the standalone floating example.
 * Popover owns opening, accessible naming, focus, dismissal and its existing overlay frame.
 *
 * ## Usage guidelines
 * Render direct DOM sibling zones in Header → Body → Footer order; wrapper-free fragments work.
 * Omit an optional part rather than render empty content when its padding/band is unwanted.
 * Inherit requires an already painted surface-2 or overlay host, without removing host padding.
 * Overlay is reserved for actually floating content. Container width and heading rank are consumer-owned.
 * className supports only documented outer layout and per-part content alignment/grid merges.
 */
const meta = {
  title: 'Molecules/Panel',
  component: Panel,
  subcomponents: { panelHeader: PanelHeader, panelBody: PanelBody, panelFooter: PanelFooter },
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <PanelHeader>
          <h2>Workspace summary</h2>
        </PanelHeader>
        <PanelBody>
          <p>Review the information supplied by your application.</p>
          <p>Data, headings and independent actions belong to the consumer.</p>
        </PanelBody>
        <PanelFooter>
          <time dateTime='2026-10-30T10:00:00Z'>Updated 30 October 2026, 10:00 UTC</time>
        </PanelFooter>
      </>
    )
  }
} satisfies Meta<typeof Panel>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Required compound content only: actual surface-1/default behavior, without optional default args. */
export const Default: Story = {};

/** The upper band is surface-2 and the lower band surface-0; Body exposes the single Surface frame. */
export const Banded: Story = { args: { variant: 'banded' } };

/** Both variants inherit explicit raised hosts without introducing another frame or guessing host tone. */
export const InheritedHost: Story = {
  args: { tone: 'inherit' },
  render: (args) => (
    <div className='grid gap-6'>
      <Surface tone='surface-2'>
        <Panel {...args} variant='default' />
      </Surface>
      <Surface tone='surface-2'>
        <Panel {...args} variant='banded' />
      </Surface>
    </div>
  )
};

/** A real out-of-tree, fixed host makes overlay a floating frame; no open/dismiss engine is added. */
export const Overlay: Story = {
  args: { tone: 'overlay', variant: 'banded' },
  parameters: { docs: { story: { inline: false } } },
  render: (args) => (
    <Portal className='fixed top-6 end-6 w-[calc(var(--space-24)*4)] max-w-[calc(100vw-var(--space-12))]'>
      <Panel {...args} />
    </Portal>
  )
};

/** Body only, omitted Header and omitted Footer leave no phantom optional band or separator. */
export const OptionalParts: Story = {
  render: () => (
    <div className='grid gap-6'>
      <Panel variant='banded'>
        <PanelBody>Body-only content with no reserved optional zones.</PanelBody>
      </Panel>
      <Panel variant='banded'>
        <PanelBody>Main content without a header.</PanelBody>
        <PanelFooter>Supplementary context</PanelFooter>
      </Panel>
      <Panel variant='banded'>
        <PanelHeader>
          <h2>Summary without metadata</h2>
        </PanelHeader>
        <PanelBody>Content ends here; no empty footer is generated.</PanelBody>
      </Panel>
    </div>
  )
};

/** A distinct nested content unit reads its nearest presentation context, not the outer Panel's bands. */
export const NestedPanels: Story = {
  args: {
    variant: 'banded',
    children: (
      <>
        <PanelHeader>
          <h2>Workspace</h2>
        </PanelHeader>
        <PanelBody>
          <p>Workspace context is separate from the nested report.</p>
          <Surface tone='surface-2'>
            <Panel tone='inherit'>
              <PanelHeader>
                <h3>Report summary</h3>
              </PanelHeader>
              <PanelBody>The nested default presentation exposes its own raised host.</PanelBody>
              <PanelFooter>Report metadata</PanelFooter>
            </Panel>
          </Surface>
        </PanelBody>
      </>
    )
  }
};

/** Independently labelled child actions retain native focus, activation and disabled behavior. */
export const ChildControls: Story = {
  args: {
    children: (
      <>
        <PanelHeader>
          <h2>Workspace actions</h2>
        </PanelHeader>
        <PanelBody>
          <p>Panel neither activates the whole container nor disables descendants.</p>
          <Button onClick={action('review-workspace')}>Review workspace</Button>
          <Button disabled={true}>Export unavailable</Button>
        </PanelBody>
        <PanelFooter>
          <Button variant='secondary' onClick={action('refresh-summary')}>
            Refresh summary
          </Button>
        </PanelFooter>
      </>
    )
  }
};

/** Supported outer placement, wrapping alignment and a Body content grid leave Material and padding intact. */
export const LayoutComposition: Story = {
  render: () => (
    <Panel variant='banded' className='w-full max-w-[calc(var(--space-24)*6)]'>
      <PanelHeader className='items-start'>
        <h2>Report summary</h2>
        <p>Additional context can wrap.</p>
      </PanelHeader>
      <PanelBody className='grid grid-cols-2'>
        <p>Report period: October</p>
        <p>Prepared by your application</p>
      </PanelBody>
      <PanelFooter className='items-start'>
        <time dateTime='2026-10-30'>Updated 30 October 2026</time>
      </PanelFooter>
    </Panel>
  )
};

/** A consumer owns the named page region and heading relationship; Panel adds no landmark or generated ID. */
export const PageRegion: Story = {
  render: function PageRegionExample(args) {
    const headingId = useId();
    return (
      <section aria-labelledby={headingId}>
        <Panel {...args}>
          <PanelHeader>
            <h2 id={headingId}>Workspace reports</h2>
          </PanelHeader>
          <PanelBody>Consumer-owned section semantics surround the passive content unit.</PanelBody>
        </Panel>
      </section>
    );
  }
};

/** Existing Popover Content retains its name, frame, padding and Radix behavior around inherited Panel content. */
export const InPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button>Open workspace summary</Button>
      </PopoverTrigger>
      <PopoverContent label='Workspace summary'>
        <Panel tone='inherit' variant='banded'>
          <PanelHeader>
            <h2>Workspace summary</h2>
          </PanelHeader>
          <PanelBody>
            <p>The already painted host remains the only outer overlay.</p>
            <Button onClick={action('review-from-summary')}>Review workspace</Button>
          </PanelBody>
          <PanelFooter>
            <PopoverClose>Close summary</PopoverClose>
          </PanelFooter>
        </Panel>
      </PopoverContent>
    </Popover>
  )
};
