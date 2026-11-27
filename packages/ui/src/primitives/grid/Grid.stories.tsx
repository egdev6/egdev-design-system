import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../stack/Stack';
import { Grid, GridItem } from './Grid';

/**
 * ## Description
 * Equal-width columns with token gaps, an opt-in collapse to one column and no paint. `Grid` lays out its children and
 * `GridItem` places one child by column span and row span. The boxes in these examples are illustrative consumer
 * content.
 *
 * ## Usage guidelines
 * DOM order is the reading order: no prop reorders content visually. Set `collapseBelow` (860 or 1080, inclusive) on
 * every multi-column grid that carries text so it reflows on narrow screens; the threshold follows the viewport, not
 * the width of the story. Keep `span` at or below `columnCount`: a larger span adds implicit columns. `className`
 * supports outer placement only, not columns, gap, alignment or spans. `asChild` merges the layout onto exactly one
 * prop-spreading child, such as a `ul` with `li` items, keeping its semantics.
 */
const meta: Meta<typeof Grid> = {
  title: 'Primitives/Grid',
  component: Grid,
  subcomponents: { gridItem: GridItem },
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Grid>;

const well = 'rounded-md border border-border-control bg-surface-0 shadow-well px-4 py-3 text-fg-muted';

/** The numbers 1 to count: stable keys and labels for the illustrative cells. */
const numbers = (count: number): number[] => Array.from({ length: count }, (_, index) => index + 1);

/** Omitting every prop keeps the approved defaults: one column, token gap 4 and stretched items. */
export const Default: Story = {
  args: {
    children: (
      <>
        <div className={well}>First child</div>
        <div className={well}>Second child</div>
        <div className={well}>Third child</div>
      </>
    )
  }
};

/** The five column counts, each drawn as equal tracks that can shrink below the width of their content. */
export const Columns: Story = {
  render: (args) => (
    <div className='flex flex-col gap-6'>
      {([1, 2, 3, 4, 12] as const).map((columnCount) => (
        <div key={columnCount}>
          <p className='m-0 mb-2 text-fg-secondary'>columnCount {columnCount}</p>
          <Grid {...args} columnCount={columnCount}>
            {numbers(columnCount).map((cell) => (
              <div className={well} key={`${columnCount}-${cell}`}>
                {cell}
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  )
};

/** Every token key from 0 to 24 resolves an existing spacing token, on both axes; no arbitrary lengths. */
export const Gaps: Story = {
  render: (args) => (
    <div className='flex flex-col gap-6'>
      {([0, 2, 4, 6] as const).map((gap) => (
        <div key={gap}>
          <p className='m-0 mb-2 text-fg-secondary'>gap {gap}</p>
          <Grid {...args} columnCount={4} gap={gap}>
            {numbers(8).map((cell) => (
              <div className={well} key={`${gap}-${cell}`}>
                {cell}
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  )
};

/** Cross-axis alignment of items of unequal height inside their grid areas. */
export const Alignment: Story = {
  render: (args) => (
    <div className='flex flex-col gap-6'>
      {(['start', 'center', 'end', 'stretch', 'baseline'] as const).map((alignItems) => (
        <div key={alignItems}>
          <p className='m-0 mb-2 text-fg-secondary'>alignItems {alignItems}</p>
          <Grid {...args} columnCount={3} alignItems={alignItems}>
            <div className={well}>short</div>
            <div className={`${well} min-h-14`}>taller</div>
            <div className={`${well} min-h-24`}>tallest</div>
          </Grid>
        </div>
      ))}
    </div>
  )
};

/**
 * `collapseBelow` stacks the grid into one column at and below the viewport width, inclusive, and resets each direct
 * child's span. The threshold follows the viewport, so the Canvas width decides what this story shows, and on a Docs
 * page every example shows the same state.
 */
export const Collapse: Story = {
  render: (args) => (
    <div className='flex flex-col gap-6'>
      {([860, 1080] as const).map((collapseBelow) => (
        <div key={collapseBelow}>
          <p className='m-0 mb-2 text-fg-secondary'>collapseBelow {collapseBelow}</p>
          <Grid {...args} columnCount={3} collapseBelow={collapseBelow}>
            <div className={well}>One</div>
            <div className={well}>Two</div>
            <div className={well}>Three</div>
          </Grid>
        </div>
      ))}
    </div>
  )
};

/** A 12-column grid: a featured item spans 7 columns and 2 rows next to 5-column items. */
export const Spans: Story = {
  args: { columnCount: 12, gap: 6 },
  render: (args) => (
    <Grid {...args}>
      <GridItem span={7} rowSpan={2}>
        <div className={`${well} h-full`}>span 7, rowSpan 2</div>
      </GridItem>
      <GridItem span={5}>
        <div className={well}>span 5</div>
      </GridItem>
      <GridItem span={5}>
        <div className={well}>span 5</div>
      </GridItem>
    </Grid>
  )
};

/**
 * The About scene layout: a narrower media column and a wider copy column on 12 columns, with the copy column a Stack
 * merged onto the grid item. It stacks at and below 860px.
 */
export const AboutSplit: Story = {
  args: { columnCount: 12, gap: 10, alignItems: 'stretch', collapseBelow: 860 },
  render: (args) => (
    <Grid {...args}>
      <GridItem span={5}>
        <div className={`${well} h-full`}>Media</div>
      </GridItem>
      <GridItem asChild={true} span={7}>
        <Stack gap={8} justifyContent='center'>
          <div className={well}>Quotation</div>
          <div className={well}>Profile card</div>
        </Stack>
      </GridItem>
    </Grid>
  )
};

/** The Build zone: three equal project cards that stack at and below 1080px. */
export const BuildThreeColumns: Story = {
  args: { columnCount: 3, gap: 5, collapseBelow: 1080 },
  render: (args) => (
    <Grid {...args}>
      <div className={well}>Project one</div>
      <div className={well}>Project two</div>
      <div className={well}>Project three</div>
    </Grid>
  )
};

/** The semantic list stays the root: a featured item on 12 columns, with `ul` and `li` merged through `asChild`. */
export const AsChildList: Story = {
  args: { asChild: true, columnCount: 12, gap: 6, collapseBelow: 1080 },
  render: (args) => (
    <Grid {...args}>
      <ul className='m-0 list-none p-0' aria-label='Projects'>
        <GridItem asChild={true} span={7} rowSpan={2}>
          <li className={`${well} h-full`}>Featured project</li>
        </GridItem>
        <GridItem asChild={true} span={5}>
          <li className={well}>Second project</li>
        </GridItem>
        <GridItem asChild={true} span={5}>
          <li className={well}>Third project</li>
        </GridItem>
      </ul>
    </Grid>
  )
};
