import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { SectionShell } from '../../templates/section-shell';
import { WebSection } from './WebSection';

/** The host owns the section frame and heading relationship. */
const meta = { title: 'Organisms/WebSection', component: WebSection, tags: ['autodocs'] } satisfies Meta<
  typeof WebSection
>;
export default meta;
type Story = StoryObj<typeof meta>;

/** All slots may contain consumer-owned interactive content. */
export const Full: Story = {
  render: (args) => {
    const id = useId();
    return (
      <SectionShell aria-labelledby={id}>
        <WebSection
          {...args}
          header={<h2 id={id}>Explore</h2>}
          media={<a href='#media'>Open media</a>}
          body={<p>Section content</p>}
          actions={<button>Continue</button>}
          social={<a href='#social'>Social</a>}
        />
      </SectionShell>
    );
  }
};
/** Omitted slots produce no placeholders. */
export const Sparse: Story = { args: { body: <p>Only content</p> } };
