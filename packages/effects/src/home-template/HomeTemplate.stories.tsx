import { Button, ChapterBreak, Closing, Hero } from '@egdev/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { HomeTemplate } from './HomeTemplate';
import { HomeTemplateAnchor } from './HomeTemplateAnchor';
import type { HomeTemplateZone } from './types';

const zones: HomeTemplateZone[] = [
  { id: 'introduction', isotipo: true, scene: 'hero' },
  { id: 'reading', profile: 'read' },
  { id: 'experiment', isotipo: true, scene: 'lab' },
  { id: 'closing', profile: 'live' }
];

function Fallback() {
  return (
    <svg aria-hidden='true' viewBox='0 0 100 100' className='h-full w-full'>
      <circle cx='50' cy='50' r='30' fill='currentColor' />
    </svg>
  );
}

function Page() {
  return (
    <main>
      <section data-zone='introduction' className='min-h-screen p-8'>
        <h1>Introduction</h1>
        <p>A consumer-owned page and its decorative anchor.</p>
        <HomeTemplateAnchor zone='introduction' className='h-48 w-48'>
          <Fallback />
        </HomeTemplateAnchor>
      </section>
      <section data-zone='reading' className='min-h-screen p-8'>
        <h2>Reading</h2>
        <p>Ambient profiles follow the scroll.</p>
      </section>
      <section data-zone='experiment' className='min-h-screen p-8'>
        <h2>Experiment</h2>
        <HomeTemplateAnchor zone='experiment' className='h-64 w-64'>
          <Fallback />
        </HomeTemplateAnchor>
      </section>
      <section data-zone='closing' className='min-h-screen p-8'>
        <h2>Closing</h2>
        <p>End of this example.</p>
      </section>
    </main>
  );
}

const meta = {
  title: 'Templates/HomeTemplate',
  component: HomeTemplate,
  tags: ['autodocs'],
  args: { zoneTable: zones, children: <Page /> },
  parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof HomeTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Required inputs only: the consumer supplies sections and their content. */
export const Default: Story = {};

/** Scroll between the read and live profiles and the 3D ownership handoffs. */
export const ProfilesAndHandoff: Story = {};

/** Delivered scenes host two adjacent measured boxes; the consumer owns the section heights that give the band room to travel. */
export const TwoAnchorTravel: Story = {
  args: {
    zoneTable: [
      { id: 'introduction', isotipo: true, scene: 'hero' },
      { id: 'closing', isotipo: true, scene: 'outro' },
      { id: 'reading', profile: 'read' }
    ],
    children: (
      <main>
        <section data-zone='introduction' aria-labelledby='travel-introduction' className='min-h-screen p-8'>
          <Hero
            id='travel-introduction'
            title='A new beginning'
            level={1}
            lede='The page owns its content and the decorative media box.'
            media={
              <HomeTemplateAnchor zone='introduction' className='h-48 w-48'>
                <Fallback />
              </HomeTemplateAnchor>
            }
          />
        </section>
        <section data-zone='closing' aria-labelledby='travel-closing' className='min-h-screen p-8'>
          <Closing
            id='travel-closing'
            title='Continue exploring'
            level={2}
            lede='The same decorative scene can arrive at another box.'
            media={
              <HomeTemplateAnchor zone='closing' className='h-64 w-64'>
                <Fallback />
              </HomeTemplateAnchor>
            }
          >
            <Button asChild={true}>
              <a href='#travel-introduction'>Return to the beginning</a>
            </Button>
          </Closing>
        </section>
        <section data-zone='reading' aria-labelledby='travel-reading' className='min-h-screen p-8'>
          <ChapterBreak
            id='travel-reading'
            title='A moment to read'
            level={2}
            lede='After the two anchors, the ambient layer takes over.'
          />
        </section>
      </main>
    )
  }
};

/** On mobile, the first anchor retains its decorative fallback. */
export const MobileGate: Story = {
  args: { zoneTable: [{ ...zones[0], id: 'introduction', mobileIsotipo: false }, ...zones.slice(1)] }
};

/** Sticky positioning and extra scroll height are explicitly owned by the consumer. */
export const NaturalVsConsumerStickyLab: Story = {
  args: {
    zoneTable: [
      { id: 'reading', isotipo: true, scene: 'lab' },
      { id: 'experiment', isotipo: true, scene: 'lab' }
    ],
    children: (
      <main>
        <section data-zone='reading' className='min-h-screen p-8'>
          <h1>Natural lab layout</h1>
          <p>This anchor follows document flow.</p>
          <HomeTemplateAnchor zone='reading' className='h-64 w-64'>
            <Fallback />
          </HomeTemplateAnchor>
        </section>
        <section data-zone='experiment' className='min-h-[200vh] p-8'>
          <h2>Consumer-sticky lab layout</h2>
          <p>The consumer owns the sticky container and scroll height.</p>
          <div className='sticky top-0'>
            <HomeTemplateAnchor zone='experiment' className='h-64 w-64'>
              <Fallback />
            </HomeTemplateAnchor>
          </div>
        </section>
      </main>
    )
  }
};

/** Short consecutive sections cannot fit the transition bands: content remains visible. */
export const InvalidGeometryFailOpen: Story = {
  args: {
    zoneTable: [{ id: 'introduction' }, { id: 'reading' }],
    children: (
      <main>
        <section data-zone='introduction'>
          <h1>Short introduction</h1>
        </section>
        <section data-zone='reading'>
          <h2>Short reading</h2>
        </section>
      </main>
    )
  }
};

/** Enable reduced motion in your operating system: the scene snaps to a static target. */
export const ReducedMotionNote: Story = {};

/** Native attributes and outer-placement className stay on the root. */
export const NativeAttributesAndClassName: Story = {
  args: { id: 'example-page', 'aria-label': 'Example page', className: 'my-4' }
};

/** The callback reports identity changes, not per-frame progress. */
export const ActiveZoneCallback: Story = { args: { onZoneChange: action('zone-change') } };
