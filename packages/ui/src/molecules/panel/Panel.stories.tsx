import { createAccentTheme } from '@egdev/tokens/accent';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useId, useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Portal } from '../../primitives/portal';
import { Surface } from '../../primitives/surface';
import { Heading } from '../../primitives/text';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '../popover';
import { Tabs } from '../tabs';
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
 * Heading supplies the optional consumer-owned compact band heading.
 * The optional edge reads the inherited accent role; createAccentTheme supplies a complete host map.
 *
 * ## Usage guidelines
 * Render direct DOM sibling zones in Header → Body → Footer order; wrapper-free fragments work.
 * Omit an optional part rather than render empty content when its padding/band is unwanted.
 * Inherit requires an already painted surface-2 or overlay host, without removing host padding.
 * Overlay is reserved for actually floating content. Container width and heading rank are consumer-owned.
 * accentEdge='start' adds a decorative logical-start edge, never a status or focus indicator.
 * The opt-in positions its root, which can change the containing block of absolute descendants.
 * fill makes Panel fill a host that owns a definite height: Header and Footer stay fixed and only Body scrolls.
 * Without a definite host height Panel stays content-sized. A Body whose direct child is a fill Tabs hands
 * scrolling to that child and leaves the scrollbar gutter to it.
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

/** The optional inherited-color edge is decorative and independent of the banded presentation. */
export const AccentEdge: Story = { args: { variant: 'banded', accentEdge: 'start' } };

/** Complete host accent maps update both directions without changing Panel or child semantics. */
export const ScopedAccentEdges: Story = {
  render: function ScopedAccentEdgesExample() {
    const [custom, setCustom] = useState(true);
    const ltrId = useId();
    const rtlId = useId();
    const theme = createAccentTheme(custom ? '#123456' : null);
    return (
      <div className='grid gap-6'>
        <Button variant='secondary' onClick={() => setCustom((current) => !current)}>
          {custom ? 'Use default accent' : 'Use custom accent'}
        </Button>
        <div className='grid gap-6' style={theme.variables as CSSProperties}>
          <section aria-labelledby={ltrId} dir='ltr'>
            <Panel variant='banded' accentEdge='start'>
              <PanelHeader>
                <Heading id={ltrId} variant='compact'>
                  Workspace settings
                </Heading>
              </PanelHeader>
              <PanelBody>
                <p>The frame and bands retain their Material paint.</p>
                <Button>Review settings</Button>
              </PanelBody>
              <PanelFooter>Decorative edge at inline-start</PanelFooter>
            </Panel>
          </section>
          <Surface tone='surface-2'>
            <section aria-labelledby={rtlId} dir='rtl' lang='en'>
              <Panel tone='inherit' variant='banded' accentEdge='start'>
                <PanelHeader>
                  <Heading id={rtlId} variant='compact'>
                    Workspace reports
                  </Heading>
                </PanelHeader>
                <PanelBody>
                  <p>The inherited Panel keeps its existing raised host.</p>
                  <Button>Review reports</Button>
                </PanelBody>
                <PanelFooter>Logical start follows the reading direction</PanelFooter>
              </Panel>
            </section>
          </Surface>
        </div>
      </div>
    );
  }
};

/** Consumer-labelled compact headings in all three banded host modes, including RTL and a floating overlay. */
export const CompactBandHeading: Story = {
  render: function CompactBandHeadingExample() {
    const surfaceId = useId();
    const inheritedId = useId();
    const overlayId = useId();
    return (
      <div className='grid gap-6'>
        <section aria-labelledby={surfaceId}>
          <Panel variant='banded'>
            <PanelHeader>
              <Heading id={surfaceId} variant='compact'>
                Workspace settings
              </Heading>
            </PanelHeader>
            <PanelBody>Surface-1 frame with an inherited heading foreground.</PanelBody>
          </Panel>
        </section>
        <Surface tone='surface-2'>
          <section aria-labelledby={inheritedId} dir='rtl' lang='en'>
            <Panel tone='inherit' variant='banded'>
              <PanelHeader>
                <Heading id={inheritedId} variant='compact'>
                  Workspace settings and reports
                </Heading>
              </PanelHeader>
              <PanelBody>Right-to-left panel content.</PanelBody>
            </Panel>
          </section>
        </Surface>
        <Portal className='fixed top-6 end-6 w-[calc(var(--space-24)*4)] max-w-[calc(100vw-var(--space-12))]'>
          <section aria-labelledby={overlayId}>
            <Panel tone='overlay' variant='banded'>
              <PanelHeader>
                <Heading id={overlayId} variant='compact'>
                  Floating summary
                </Heading>
              </PanelHeader>
              <PanelBody>Overlay frame with an inherited heading foreground.</PanelBody>
            </Panel>
          </section>
        </Portal>
      </div>
    );
  }
};

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

/** The same edge is available on a genuinely floating overlay without replacing its frame. */
export const AccentEdgeOverlay: Story = {
  args: { tone: 'overlay', variant: 'banded', accentEdge: 'start' },
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

const longBody = Array.from({ length: 14 }, (_, index) => (
  <p key={index}>
    Paragraph {index + 1}: consumer-owned content keeps flowing inside the Body while the Header and Footer stay put.
  </p>
));

/** A fixed 440 × 640 host owns the definite height: Header and Footer stay fixed and only Body scrolls. */
export const FillHost: Story = {
  args: {
    variant: 'banded',
    fill: true,
    children: (
      <>
        <PanelHeader>
          <h2>Workspace summary</h2>
        </PanelHeader>
        <PanelBody>{longBody}</PanelBody>
        <PanelFooter>
          <Button variant='secondary' onClick={action('refresh-summary')}>
            Refresh summary
          </Button>
        </PanelFooter>
      </>
    )
  },
  render: (args) => (
    <div className='h-[640px] w-[440px]'>
      <Panel {...args} />
    </div>
  )
};

const tabPanelContent = (label: string) =>
  Array.from({ length: 40 }, (_, index) => (
    <p key={index}>
      {label} entry {index + 1}: only the active tab panel scrolls inside the fill Panel.
    </p>
  ));

/**
 * A fill Panel whose only Body child is a fill Tabs: the tab list stays fixed and the active panel is the single
 * scroller. Body leaves its scrollbar gutter to Tabs, so only one gutter shows. Fixed 440 × 640 host.
 */
export const FillWithTabs: Story = {
  args: {
    variant: 'banded',
    fill: true,
    children: (
      <>
        <PanelHeader>
          <h2>Workspace</h2>
        </PanelHeader>
        <PanelBody>
          <Tabs
            fill={true}
            variant='outline'
            label='Workspace views'
            items={[
              { value: 'queue', label: 'Queue', content: tabPanelContent('Queue') },
              { value: 'drafts', label: 'Drafts', content: tabPanelContent('Draft') },
              { value: 'published', label: 'Published', content: tabPanelContent('Published') }
            ]}
          />
        </PanelBody>
        <PanelFooter>
          <Button variant='secondary' onClick={action('refresh-workspace')}>
            Refresh workspace
          </Button>
        </PanelFooter>
      </>
    )
  },
  render: (args) => (
    <div className='h-[640px] w-[440px]'>
      <Panel {...args} />
    </div>
  )
};
