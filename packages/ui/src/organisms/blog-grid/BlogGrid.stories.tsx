import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../../atoms/link';
import { ArticleFeature, ArticleFeatureCover } from '../../molecules/article-feature';
import { ListItem, ListItemBody, ListItemTitle } from '../../molecules/list-item';
import { SectionHeader } from '../../molecules/section-header';
import { SectionShell } from '../../templates/section-shell';
import { BlogGrid, BlogGridArchive, BlogGridFeature, BlogGridRow, BlogGridRows } from './BlogGrid';

/** Passive editorial layout. The host owns the section heading and named section. Supply independent links and place ListItem's asChild on the anchor, not the li. */
const meta = { title: 'Organisms/BlogGrid', component: BlogGrid, tags: ['autodocs'] } satisfies Meta<typeof BlogGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

const feature = (
  <BlogGridFeature>
    <ArticleFeature href='#feature' title='Building a design system' actionLabel='Read article'>
      <ArticleFeatureCover badge='Featured' coverWord='/design' />
    </ArticleFeature>
  </BlogGridFeature>
);
const rows = (
  <BlogGridRows>
    {['A practical guide', 'Making space for ideas', 'An editorial workflow'].map((title, index) => (
      <BlogGridRow key={title}>
        <ListItem variant='editorial' asChild={true}>
          <a href={`#article-${index}`}>
            <ListItemBody>
              <ListItemTitle>{title}</ListItemTitle>
            </ListItemBody>
          </a>
        </ListItem>
      </BlogGridRow>
    ))}
  </BlogGridRows>
);
const archive = (
  <BlogGridArchive>
    <Link href='#archive'>All articles</Link>
  </BlogGridArchive>
);

/** Feature, semantic editorial rows and independent archive. */
export const Default: Story = {
  args: {
    children: (
      <>
        {feature}
        {rows}
        {archive}
      </>
    )
  }
};
/** Empty rows omit the list but preserve the archive. */
export const EmptyRows: Story = {
  args: {
    children: (
      <>
        {feature}
        <BlogGridRows>{[]}</BlogGridRows>
        {archive}
      </>
    )
  }
};
/** The archive is optional. */
export const WithoutArchive: Story = {
  args: {
    children: (
      <>
        {feature}
        {rows}
      </>
    )
  }
};
/** Each editorial ListItem is slotted onto its own anchor, separate from the other links. */
export const ComposedLinks: Story = { ...Default };
/** Inspect the layout above the viewport breakpoint. */
export const Wide: Story = { ...Default };
/** Inspect natural row heights at or below the breakpoint. */
export const Narrow: Story = { ...Default, args: { ...Default.args, className: 'max-w-sm' } };
/** Long content remains consumer-owned and should wrap without clipping. */
export const LongContent: Story = {
  args: {
    children: (
      <>
        {feature}
        <BlogGridRows>
          <BlogGridRow>
            <ListItem variant='editorial' asChild={true}>
              <a href='#long'>
                <ListItemBody>
                  <ListItemTitle>
                    A long editorial title that wraps across multiple lines without truncation in a narrow host
                  </ListItemTitle>
                </ListItemBody>
              </a>
            </ListItem>
          </BlogGridRow>
        </BlogGridRows>
        {archive}
      </>
    )
  }
};

/** Host composition: the host names the section with SectionShell and places SectionHeader above BlogGrid. */
export const HostComposition: Story = {
  args: {
    children: (
      <>
        {feature}
        {rows}
        {archive}
      </>
    )
  },
  render: (args) => (
    <SectionShell aria-labelledby='blog-grid-story-heading'>
      <SectionHeader title='From the blog' titleId='blog-grid-story-heading' level={2} />
      <BlogGrid {...args} />
    </SectionShell>
  )
};
