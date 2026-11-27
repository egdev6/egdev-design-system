import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Stack } from '../../primitives/stack';
import { Text } from '../../primitives/text';
import { SectionShell } from '../../templates/section-shell';
import { Pagination } from './Pagination';
import type { PaginationProps } from './types';

// Same-document fragments keep a click inside the Storybook iframe: the link never leaves the story.
const getHref = (page: number) => `#page-${page}`;

/**
 * ## Description
 * A named navigation landmark of crawlable links that splits a long listing into pages: Previous and Next, numbered
 * pages in a window of at most seven slots with ellipses, and the current page marked with `aria-current="page"`. The
 * window has a constant width, so the row does not jump while the reader pages. Every control is a native anchor whose
 * destination comes from `getHref`, so each page is reachable without JavaScript and by search engines. At the first
 * and the last page, Previous and Next stay in the row as dimmed placeholders that leave the accessibility tree.
 *
 * ## Dependencies
 * Composes the exported Icon for the two decorative arrows. The semantics are native (`nav`, `ul`, `li`, `a`): no
 * Radix primitive, Surface, ref, `asChild` or stylesheet. The current page reuses the selected treatment of Tabs
 * `outline` (a brand-tinted fill with a neon edge and no glow), and every utility is token-backed.
 *
 * ## Usage guidelines
 * The consumer owns the data slice, `pageCount`, `value` (kept equal to the route), the 404 or redirect for an
 * out-of-range page parameter, and `getHref`, which carries the route and the active filters in every URL. For client
 * routing, handle `onNavigate` and call `preventDefault` only on unmodified primary activations; after a client-side
 * navigation the consumer owns focus and any announcement. Give each pagination on a page a distinct `label`. A
 * listing with fewer than two pages renders nothing, and an empty listing needs an empty state instead. It is not a
 * filter, a tab set or a stepper. `className` supports outer placement only.
 */
const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Editorial pages', value: 6, pageCount: 12, getHref }
};
export default meta;
type Story = StoryObj<typeof Pagination>;

/**
 * Page 6 of 12 on a grafito reading section, the register the component is designed for: Previous, the first page, an
 * ellipsis, the pages around the current one, an ellipsis, the last page and Next. The current page is the highlighted
 * link with the neon edge.
 */
export const Default: Story = {
  render: (args) => (
    <SectionShell register='grafito' aria-label='Editorial'>
      <Pagination {...args} />
    </SectionShell>
  )
};

const rows = [
  {
    label: 'First page of twelve',
    caption: 'First page of 12: Previous is a dimmed placeholder.',
    value: 1,
    pageCount: 12
  },
  { label: 'Middle page of twelve', caption: 'Page 6 of 12: an ellipsis on each side.', value: 6, pageCount: 12 },
  { label: 'Last page of twelve', caption: 'Last page of 12: Next is a dimmed placeholder.', value: 12, pageCount: 12 },
  {
    label: 'Short row of five',
    caption: 'Page 5 of 5: every page is shown and there is no ellipsis.',
    value: 5,
    pageCount: 5
  }
] as const;

/**
 * The window at the first, a middle and the last page of twelve, and a short row of five. Above seven pages the row is
 * always seven page-or-ellipsis slots wide. At a boundary the missing Previous or Next stays as a dimmed placeholder so
 * the row does not jump, and an ellipsis always stands for at least two hidden pages. Each pagination has its own
 * `label`, as a page with several of them needs.
 */
export const Window: Story = {
  render: (args) => (
    <Stack gap={6}>
      {rows.map(({ label, caption, value, pageCount }) => (
        <Stack key={label} gap={2}>
          <Text variant='body' foreground='muted'>
            {caption}
          </Text>
          <Pagination {...args} label={label} value={value} pageCount={pageCount} />
        </Stack>
      ))}
    </Stack>
  )
};

function ClientRoutingExample(props: PaginationProps) {
  const [value, setValue] = useState(props.value);
  return (
    <Stack gap={2}>
      <Pagination
        {...props}
        value={value}
        onNavigate={(page, event) => {
          props.onNavigate?.(page, event);
          // A client router takes over only an unmodified primary activation; a modified click keeps its native
          // behavior, so "open in a new tab" still works. There is no router dependency here: the story keeps the page.
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
          }
          event.preventDefault();
          setValue(page);
        }}
      />
      <Text variant='body' foreground='muted'>
        Showing page {value} of {props.pageCount} for the topic “design”.
      </Text>
    </Stack>
  );
}

/**
 * `onNavigate` receives the target page and the React click event of any rendered link. The component never prevents
 * default itself: for client routing, call `preventDefault` only on an unmodified primary click, as here, and let
 * modified clicks stay native. `getHref` carries the active filter (`topic=design`) through every URL, so each page
 * stays a crawlable link and a shareable address.
 */
export const ClientRouting: Story = {
  args: { getHref: (page) => `#topic=design&page=${page}`, onNavigate: action('onNavigate') },
  render: (args) => <ClientRoutingExample {...args} />
};

/**
 * A custom `messages` dictionary: `previous` and `next` are the visible link texts and `page` names a numbered link
 * from its page number. The visible digits are never replaced, so each name should contain them. Each omitted or blank
 * entry falls back to English on its own.
 */
export const Localized: Story = {
  args: {
    label: 'Results pages',
    messages: { previous: 'Newer', next: 'Older', page: (page) => `Results page ${page}` }
  }
};
