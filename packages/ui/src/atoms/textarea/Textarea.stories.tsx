import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { action } from 'storybook/actions';
import { Label } from '../../primitives/label';
import { Textarea } from './Textarea';

/**
 * ## Description
 * A bare multi-line plain-text control rendered as a native `textarea`: first comments,
 * descriptions, notes, CSS or commands in `code`, and long-form drafts in `prose`.
 *
 * ## Dependencies
 * No Radix behavior base: the native element provides editing, keyboard and form semantics.
 * No stylesheet is required; every treatment is a token-backed utility.
 *
 * ## Usage guidelines
 * Always give the control an accessible name with `<label htmlFor>`, `aria-labelledby` or
 * `aria-label`; the placeholder is never the name. Label, hint, error and counter belong to the
 * future Field molecule, which relates them through `aria-describedby` and `aria-invalid`.
 * Enter inserts a new line and Tab leaves the control. The height resizes vertically only and
 * never below the variant minimum; there is no auto-grow. className supports layout only
 * (width, margin, grid placement or a larger minimum height), not appearance.
 */
const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/** Default well with three rows reaching the 120px minimum; no variant arg overwrites the default. */
export const Default: Story = {
  args: { 'aria-label': 'First comment', rows: 3, placeholder: 'Write the first comment' }
};

/** The three treatments: default well, code mono well and the raised prose sheet. */
export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      <Textarea aria-label='Default notes' defaultValue='Notes for the release.' />
      <Textarea
        aria-label='Custom CSS'
        variant='code'
        spellCheck={false}
        defaultValue={'.eg-card {\n  padding: var(--space-4);\n}'}
      />
      <Textarea
        aria-label='Long-form draft'
        variant='prose'
        defaultValue='A long-form draft reads on a raised sheet with generous padding.'
      />
    </div>
  )
};

/** Controlled value with native onChange; the line count updates as the user types. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('First line');
    const onChange = action('onChange');
    return (
      <div className='flex flex-col gap-2'>
        <Textarea
          aria-label='Controlled notes'
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            onChange(event.target.value);
          }}
        />
        <output className='font-sans text-body-default text-fg-muted'>{value.split('\n').length} lines</output>
      </div>
    );
  }
};

/** Disabled: dimmed to 45%, not focusable and not editable. */
export const Disabled: Story = {
  args: { 'aria-label': 'Archived notes', disabled: true, defaultValue: 'This note is archived.' }
};

/** Read-only: focusable and selectable, not editable, without a hover change. */
export const ReadOnly: Story = {
  args: { 'aria-label': 'Published notes', readOnly: true, defaultValue: 'This note is published.' }
};

/** Native aria-invalid paints the danger border on every variant, also while focused. */
export const Invalid: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      <Textarea aria-label='Invalid default' aria-invalid='true' defaultValue='Too long for X.' />
      <Textarea aria-label='Invalid code' aria-invalid='true' variant='code' defaultValue='color: ;' />
      <Textarea aria-label='Invalid prose' aria-invalid='true' variant='prose' defaultValue='Draft' />
    </div>
  )
};

/** Composes with a label and a hint through htmlFor and aria-describedby, as Field will. */
export const WithLabel: Story = {
  render: () => {
    const id = useId();
    const hintId = useId();
    return (
      <div className='flex flex-col gap-2'>
        <Label htmlFor={id}>First comment</Label>
        <Textarea id={id} aria-describedby={hintId} rows={3} maxLength={1250} />
        <p id={hintId} className='font-sans text-body-default text-fg-muted'>
          Shown below the post.
        </p>
      </div>
    );
  }
};
