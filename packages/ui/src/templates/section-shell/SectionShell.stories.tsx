import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionShell } from './SectionShell';

/** A passive section frame; the host supplies naming, content and group-edge composition. */
const meta = {
  title: 'Templates/SectionShell',
  component: SectionShell,
  tags: ['autodocs'],
  args: { 'aria-label': 'Example section', children: <p>Host-supplied section content.</p> }
} satisfies Meta<typeof SectionShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default pro register and centered wrapper. */
export const Default: Story = {};

/** The five independently selected section registers. */
export const FiveRegisters: Story = {
  render: () => (
    <>
      {(['pro', 'show', 'flood', 'deep', 'grafito'] as const).map((register) => (
        <SectionShell key={register} register={register} aria-label={`${register} section`}>
          <h2>{register}</h2>
        </SectionShell>
      ))}
    </>
  )
};

/** Self-wrapped children can opt out of the internal wrapper. */
export const WithoutWrap: Story = {
  args: { wrap: false, children: <div className='mx-auto max-w-[var(--content-max)]'>Self-wrapped content</div> }
};

/** Long host content remains in normal document flow. */
export const LongContent: Story = {
  args: {
    children: (
      <div>
        {Array.from({ length: 30 }, (_, index) => (
          <p key={index}>A paragraph in a long section.</p>
        ))}
      </div>
    )
  }
};

/** A visible heading can supply the landmark name. */
export const NamedByHeading: Story = {
  render: () => (
    <SectionShell aria-labelledby='story-section-heading'>
      <h2 id='story-section-heading'>Visible heading</h2>
    </SectionShell>
  )
};

/** A zone is independent of both the landmark name and the anchor. */
export const NativeZone: Story = {
  render: () => (
    <SectionShell aria-label='Reading' id='reading-section' data-zone='reading'>
      Reading content
    </SectionShell>
  )
};

/** The host paints a masked underlay; it never masks section content or focus. */
export const AdjacentGrafitoGroups: Story = {
  render: () => (
    <div className='relative isolate [&_.eg-section]:bg-transparent'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10 bg-surface-0/50 [mask-image:var(--mask-section-fade-both)] [-webkit-mask-image:var(--mask-section-fade-both)] [@media(prefers-reduced-transparency:reduce)]:bg-surface-0'
      />
      <SectionShell register='grafito' aria-label='First section'>
        First section
      </SectionShell>
      <SectionShell register='grafito' aria-label='Second section'>
        Second section
      </SectionShell>
    </div>
  )
};

/** A host chooses each edge mask independently for each group. */
export const SingleAndBothFades: Story = {
  render: () => (
    <>
      <div className='relative isolate [&_.eg-section]:bg-transparent'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 -z-10 bg-surface-0/50 [mask-image:var(--mask-section-fade-top)] [-webkit-mask-image:var(--mask-section-fade-top)] [@media(prefers-reduced-transparency:reduce)]:bg-surface-0'
        />
        <SectionShell register='grafito' aria-label='Top fade'>
          Top edge fade
        </SectionShell>
      </div>
      <div className='relative isolate [&_.eg-section]:bg-transparent'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 -z-10 bg-surface-0/50 [mask-image:var(--mask-section-fade-both)] [-webkit-mask-image:var(--mask-section-fade-both)] [@media(prefers-reduced-transparency:reduce)]:bg-surface-0'
        />
        <SectionShell register='grafito' aria-label='Both fades'>
          Both edge fades
        </SectionShell>
      </div>
    </>
  )
};

/** Hosts should verify contrast of their actual descendants on each field. */
export const FloodDeepContrast: Story = {
  render: () => (
    <>
      <SectionShell register='flood' aria-label='Flood'>
        <p>Flood foreground</p>
      </SectionShell>
      <SectionShell register='deep' aria-label='Deep'>
        <p>Deep foreground</p>
      </SectionShell>
    </>
  )
};

/** Scroll offset is owned by the host fixed-bar layout. */
export const HostFixedBar: Story = {
  render: () => (
    <div className='scroll-pt-[var(--nav-height)]'>
      <div className='sticky top-0 z-10 bg-surface-0'>Host navigation</div>
      <SectionShell aria-label='Anchor target' id='anchor-target'>
        <a href='#anchor-target'>Focus target</a>
      </SectionShell>
    </div>
  )
};
