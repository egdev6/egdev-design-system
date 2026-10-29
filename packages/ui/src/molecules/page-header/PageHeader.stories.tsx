import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Stack } from '../../primitives/stack';
import { ButtonGroup } from '../button-group';
import { PageHeader } from './PageHeader';

/**
 * ## Description
 * A compact product page heading with optional context and independent actions.
 * Place it inside main or sectioning content, not as the site's banner.
 *
 * ## Dependencies
 * Stack owns the text flow. Actions are one direct Button (including asChild links),
 * or a consumer-supplied spaced ButtonGroup with at least two direct supported children.
 * No PageHeader-specific Radix behavior, paint or stylesheet.
 *
 * ## Usage guidelines
 * Supply a meaningful plain-string title; blank titles warn in development and render nothing.
 * Heading rank changes semantics only. Actions render unchanged: no arrays, fragments,
 * arbitrary wrappers, nested groups or automatic grouping. Child behavior stays child-owned;
 * loading Button remains focusable but suppresses activation. Intrinsic wrapping needs no
 * breakpoint. className supports outer margins, sizing and placement only, not internal
 * gaps, typography or paint. Long unbroken text wraps without truncation.
 */
const meta: Meta<typeof PageHeader> = {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

/** Required title only; optional parts reserve no empty space and rank defaults to h1. */
export const Default: Story = { args: { title: 'Projects' } };

/** One direct Button stays outside any group; link semantics come from Button asChild. */
export const SingleAction: Story = {
  args: {
    title: 'Projects',
    actions: (
      <Button asChild={true}>
        <a href='#new-project'>New project</a>
      </Button>
    )
  }
};

/** A supplied spaced group keeps its own name, direct children and independent tab stops. */
export const WithActions: Story = {
  args: {
    title: 'Projects',
    eyebrow: 'Workspace',
    actions: (
      <ButtonGroup variant='spaced' label='Project actions'>
        <Button variant='secondary' onClick={action('import')}>
          Import
        </Button>
        <Button onClick={action('new-project')}>New project</Button>
      </ButtonGroup>
    )
  }
};

/** A quiet contextual paragraph, not an extra heading or a decorated editorial eyebrow. */
export const WithEyebrow: Story = { args: { title: 'Projects', eyebrow: 'Workspace' } };

/** Natural wrapping also covers an unbroken title; no truncation or hidden content. */
export const LongTitle: Story = {
  args: { title: 'InternationalWorkspaceProjectArchiveWithoutWordBreaks'.repeat(3), eyebrow: 'Workspace' }
};

/** External sizing forces intrinsic reflow; the consumer supplies the same spaced group. */
export const Constrained: Story = {
  args: {
    title: 'Projects for the next release',
    eyebrow: 'Workspace',
    className: 'max-w-[calc(var(--space-24)*3)]',
    actions: (
      <ButtonGroup variant='spaced'>
        <Button variant='secondary' disabled={true}>
          Import
        </Button>
        <Button onClick={action('new-project')}>New project</Button>
      </ButtonGroup>
    )
  }
};

/** All six semantic ranks retain the same compact recipe; choose rank for the document outline. */
export const HeadingLevels: Story = {
  render: () => (
    <Stack>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <PageHeader key={level} title={`Heading level ${level}`} level={level} />
      ))}
    </Stack>
  )
};

/** Logical start/end follow RTL; DOM and keyboard order remain text then the action. */
export const RTL: Story = {
  args: {
    title: 'Projects',
    eyebrow: 'Workspace',
    dir: 'rtl',
    actions: <Button onClick={action('new-project')}>New project</Button>
  }
};

/** Native disabled, focusable loading and enabled controls keep the Button contract unchanged. */
export const ChildStates: Story = {
  args: {
    title: 'Projects',
    actions: (
      <ButtonGroup variant='spaced'>
        <Button disabled={true} variant='secondary'>
          Import
        </Button>
        <Button loading={true}>Saving</Button>
        <Button onClick={action('new-project')}>New project</Button>
      </ButtonGroup>
    )
  }
};
