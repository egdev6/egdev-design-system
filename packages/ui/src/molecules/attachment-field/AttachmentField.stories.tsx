import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useEffect, useState } from 'react';
import { action } from 'storybook/actions';
import { Button, Field, Link, Textarea } from '../../index';
import { AttachmentField } from './AttachmentField';

const notes = (
  <Field label='Notes'>
    <Textarea placeholder='Describe the issue, then paste a screenshot with Ctrl+V' />
  </Field>
);

const tokenColor = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Builds a small PNG from design tokens so every story works offline, without static assets. */
const sampleImage = (name: string, index: number, padBytes = 0): File => {
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = tokenColor('--color-bg-surface');
    context.fillRect(0, 0, 96, 96);
    context.fillStyle = tokenColor('--color-fg-brand-default');
    context.fillRect(8 + index * 12, 8 + index * 12, 48, 48);
  }
  const binary = atob(canvas.toDataURL('image/png').split(',')[1] ?? '');
  const bytes = new Uint8Array(binary.length + padBytes);
  for (let position = 0; position < binary.length; position += 1) {
    bytes[position] = binary.charCodeAt(position);
  }
  return new File([bytes], name, { type: 'image/png' });
};

const sampleImages = (count: number): File[] =>
  Array.from({ length: count }, (_, index) => sampleImage(`screenshot-${index + 1}.png`, index));

/** Generates the images once per mount; the canvas needs the browser, so it cannot run at module load. */
const WithSamples = ({ count, children }: { count: number; children: (files: File[]) => ReactNode }) => {
  const [files] = useState(() => sampleImages(count));
  return <>{children(files)}</>;
};

/** Offers one file per validation rule as a download so it can be picked from disk or dropped. */
const ValidationSamples = () => {
  const [links, setLinks] = useState<{ name: string; href: string; hint: string }[]>([]);
  useEffect(() => {
    const samples = [
      { file: new File(['Plain text'], 'notes.txt', { type: 'text/plain' }), hint: 'wrong type' },
      { file: sampleImage('large.png', 0, 150 * 1024), hint: 'over the size limit' },
      { file: sampleImage('small.png', 1), hint: 'accepted' }
    ];
    const created = samples.map(({ file, hint }) => ({ name: file.name, href: URL.createObjectURL(file), hint }));
    setLinks(created);
    return () => {
      for (const { href } of created) {
        URL.revokeObjectURL(href);
      }
    };
  }, []);
  return (
    <ul className='m-0 list-none p-0'>
      {links.map(({ name, href, hint }) => (
        <li key={name}>
          <Link href={href} download={name}>
            {name}
          </Link>
          {` (${hint})`}
        </li>
      ))}
    </ul>
  );
};

/**
 * ## Description
 * Collects image attachments by paste, drop or pick, with type, size and count validation, thumbnails and
 * Remove buttons. Controlled when `value` is defined, otherwise uncontrolled.
 *
 * ## Dependencies
 * Dropzone owns the picker, drop target and its own paste scope; PhotoFrame renders the thumbnails; IconButton renders
 * Remove; FieldMessage shows rejections; Stack and Cluster lay it out. The consumer supplies the Textarea (usually inside a
 * Field), and paste from any descendant is handled.
 *
 * ## Usage guidelines
 * Uploading, storage, deduplication and the Textarea label belong to the consumer. The list is owned by the parent when
 * controlled: `onValueChange` is then a request and the list changes only when a new `value` arrives. Rejections are shown as
 * visible errors, and `onFilesRejected` runs once per intake after `onValueChange`. Additions and removals are announced in
 * a polite status region; override the text and formatters through `messages` for other languages. The Remove button
 * has a 25.6px visible box and an extended 44.8px target under default tokens; it partly covers the 64px thumbnail.
 * The field uses a 12.8px root gap and the wrapping strip a 9.6px gap under default tokens. Avoid clipping or overlays,
 * and keep other interactive controls clear; browsers can adjust touch targeting near adjacent controls.
 * Paste a screenshot (Ctrl+V) while a Textarea inside the field is focused to add it. className supports outer layout only
 * (grid placement, margin, width), not appearance overrides.
 */
const meta: Meta<typeof AttachmentField> = {
  title: 'Molecules/AttachmentField',
  component: AttachmentField,
  tags: ['autodocs'],
  args: { label: 'Attachments' }
};
export default meta;
type Story = StoryObj<typeof AttachmentField>;

/** Empty field with a labelled Textarea; add images by pasting, dropping or picking. */
export const Default: Story = {
  args: {
    children: notes,
    onValueChange: action('onValueChange'),
    onFilesRejected: action('onFilesRejected')
  }
};

/** Focus the Textarea and paste a screenshot (Ctrl+V); the image is attached and the Textarea keeps focus. */
export const WithTextarea: Story = {
  args: {
    children: notes,
    onValueChange: action('onValueChange'),
    onFilesRejected: action('onFilesRejected')
  }
};

/** Three generated images as the initial list, with thumbnails and Remove buttons. */
export const WithAttachments: Story = {
  render: (args) => (
    <WithSamples count={3}>
      {(files) => <AttachmentField {...args} value={undefined} defaultValue={files} />}
    </WithSamples>
  ),
  args: {
    children: notes,
    onValueChange: action('onValueChange')
  }
};

const ControlledExample = () => {
  const [files, setFiles] = useState<File[]>(() => sampleImages(2));
  const [resetKey, setResetKey] = useState(0);
  return (
    <AttachmentField
      label='Attachments'
      value={files}
      acceptedTypes={['image/png']}
      resetKey={resetKey}
      onValueChange={(next) => {
        action('onValueChange')(next);
        setFiles(next);
      }}
    >
      {notes}
      <Button
        variant='secondary'
        onClick={() => {
          setFiles([]);
          setResetKey((key) => key + 1);
        }}
      >
        Clear after save
      </Button>
    </AttachmentField>
  );
};

/** The parent owns the list: changes arrive as requests. "Clear after save" empties it and bumps `resetKey`, which also clears a rejection when the list was already empty (only PNG is accepted here). */
export const Controlled: Story = { render: () => <ControlledExample /> };

/** Only `defaultValue` is read, once; the field then keeps its own list. */
export const Uncontrolled: Story = {
  render: (args) => (
    <WithSamples count={1}>
      {(files) => <AttachmentField {...args} value={undefined} defaultValue={files} />}
    </WithSamples>
  ),
  args: { children: notes, onValueChange: action('onValueChange') }
};

/** PNG only, up to 100 KB and three files. Download a sample below, then pick or drop it to see each rejection. */
export const Validation: Story = {
  args: {
    acceptedTypes: ['image/png'],
    maxFileBytes: 100 * 1024,
    maxFiles: 3,
    children: (
      <>
        {notes}
        <ValidationSamples />
      </>
    ),
    onValueChange: action('onValueChange'),
    onFilesRejected: action('onFilesRejected')
  }
};

/** At `maxFiles`, every further file is rejected with the count message. */
export const AtLimit: Story = {
  render: (args) => (
    <WithSamples count={3}>
      {(files) => <AttachmentField {...args} value={undefined} defaultValue={files} maxFiles={3} />}
    </WithSamples>
  ),
  args: { children: notes, onFilesRejected: action('onFilesRejected') }
};

/** Five items in a 320 px host: the strip wraps instead of overflowing. */
export const ManyItems: Story = {
  render: (args) => (
    <div className='w-[calc(var(--space-20)*5)] max-w-full'>
      <WithSamples count={5}>
        {(files) => <AttachmentField {...args} value={undefined} defaultValue={files} />}
      </WithSamples>
    </div>
  ),
  args: { children: notes }
};

/** Disabled keeps the list visible but blocks the Dropzone, the Remove buttons and paste. */
export const Disabled: Story = {
  render: (args) => (
    <WithSamples count={3}>
      {(files) => <AttachmentField {...args} value={undefined} defaultValue={files} disabled={true} />}
    </WithSamples>
  ),
  args: { children: notes }
};
