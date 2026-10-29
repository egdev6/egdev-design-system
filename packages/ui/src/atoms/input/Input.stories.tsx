import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ChangeEvent, useId, useState } from 'react';
import { action } from 'storybook/actions';
import { Input } from './Input';

/**
 * ## Description
 * Bare single-line text control in the Material well: titles, URLs, search and settings.
 * The visible label, hint, error text and counter belong to the consumer (the future Field
 * molecule); Input renders the control, an optional decorative leading icon and a trailing loading Spinner.
 *
 * ## Dependencies
 * No Radix primitive: the native `<input>` provides keyboard, focus, selection and form
 * semantics. Spinner supplies the decorative loading indicator. No stylesheet is required;
 * every state uses token-backed utilities.
 *
 * ## Usage guidelines
 * Always supply an accessible name through a `<label htmlFor>`, `aria-labelledby` or
 * `aria-label`; the placeholder is never the name. Set `aria-invalid` and `aria-describedby`
 * to point at the error text, so invalid is not color-only. `md` (44px) meets the touch
 * minimum; keep `sm` (36px) for dense pointer UIs. The ref and every native attribute reach
 * the `<input>`; className reaches the `eg-input` root for layout only (width, margin,
 * placement). loading sets aria-busy but stays editable unless disabled or readOnly;
 * consumers own status announcements, as with Button.
 */
const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Input>;

function SearchGlyph() {
  return (
    <svg viewBox='0 0 16 16' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='1.5'>
      <circle cx='7' cy='7' r='4.5' />
      <path d='m10.5 10.5 3 3' strokeLinecap='round' />
    </svg>
  );
}

/** Default md text control with a placeholder; native change events are logged. */
export const Default: Story = {
  args: { 'aria-label': 'Title', placeholder: 'Untitled post', onChange: action('change') }
};

/** The md 44px default and the sm 36px preset for toolbars and dialog footers. */
export const Sizes: Story = {
  render: () => (
    <div className='flex max-w-80 flex-col gap-4'>
      <Input aria-label='Medium title' placeholder='Medium (44px)' />
      <Input aria-label='Small title' size='sm' placeholder='Small (36px)' />
    </div>
  )
};

/** The code treatment: mono text on the darker well, for code, URLs and commands. */
export const Code: Story = {
  render: () => (
    <div className='flex max-w-80 flex-col gap-4'>
      <Input aria-label='Install command' variant='code' defaultValue='pnpm add @egdev/ui' />
      <Input aria-label='Small install command' variant='code' size='sm' defaultValue='pnpm add @egdev/ui' />
    </div>
  )
};

/** A small search control with a decorative leading icon, hidden from assistive technology. */
export const WithIcon: Story = {
  args: { 'aria-label': 'Search', type: 'search', size: 'sm', placeholder: 'Search', icon: <SearchGlyph /> }
};

/** Loading preserves editable text and native change events; the Spinner is decorative, not a live region. */
export const Loading: Story = {
  args: { 'aria-label': 'Search', type: 'search', placeholder: 'Search', loading: true, onChange: action('change') }
};

/** Loading and a leading icon reserve independent space at both height presets. */
export const LoadingWithIcon: Story = {
  render: () => (
    <div className='flex max-w-80 flex-col gap-4'>
      <Input aria-label='Search projects' icon={<SearchGlyph />} loading={true} placeholder='Search projects' />
      <Input aria-label='Search commands' size='sm' variant='code' icon={<SearchGlyph />} loading={true} />
    </div>
  )
};

/** Controlled value through native value and onChange, mirrored below the control. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('Launch notes');
    return (
      <div className='flex max-w-80 flex-col gap-2'>
        <Input
          aria-label='Controlled title'
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
        />
        <p className='font-sans text-label-default text-fg-muted'>Value: {value}</p>
      </div>
    );
  }
};

/** Disabled: not focusable, no input and the root dims to 45%. */
export const Disabled: Story = {
  args: { 'aria-label': 'Disabled title', defaultValue: 'Locked value', disabled: true }
};

/** Read-only: focusable and selectable but not editable; hover keeps the control border. */
export const ReadOnly: Story = {
  args: { 'aria-label': 'API token', variant: 'code', defaultValue: 'egd_4f1763a5e997fc', readOnly: true }
};

/** Native aria-invalid applies the danger border, kept while focused; the error text names the problem. */
export const Invalid: Story = {
  render: () => {
    const id = useId();
    const error = useId();
    return (
      <div className='flex max-w-80 flex-col gap-2'>
        <label htmlFor={id} className='font-sans text-label-default text-fg-secondary'>
          Post text
        </label>
        <Input id={id} aria-invalid='true' aria-describedby={error} defaultValue='This post is far too long' />
        <p id={error} className='font-sans text-label-default text-status-danger'>
          Keep the post under 280 characters.
        </p>
      </div>
    );
  }
};

/** Composition the way Field will do it: a native label and a hint resolve the name and description. */
export const WithLabel: Story = {
  render: () => {
    const id = useId();
    const hint = useId();
    return (
      <div className='flex max-w-80 flex-col gap-2'>
        <label htmlFor={id} className='font-sans text-label-default text-fg-secondary'>
          Project title
        </label>
        <Input id={id} aria-describedby={hint} required={true} placeholder='egdev design system' />
        <p id={hint} className='font-sans text-label-default text-fg-muted'>
          Shown on the dashboard.
        </p>
      </div>
    );
  }
};
