import type { Meta, StoryObj } from '@storybook/react-vite';
import { WebTemplate } from './WebTemplate';

/** A structural page with consumer-owned header, content and footer. */
const meta = {
  title: 'Templates/WebTemplate',
  component: WebTemplate,
  tags: ['autodocs'],
  args: { content: <p>Page content</p> }
} satisfies Meta<typeof WebTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;
/** Content without optional regions. */
export const Default: Story = {};
/** Header and footer retain their own landmarks. */
export const Full: Story = { args: { topBar: <header>Page header</header>, footer: <footer>Page footer</footer> } };
/** The skip link accepts localized text. */
export const Localized: Story = { args: { messages: { skipToContent: 'Jump to main content' } } };
