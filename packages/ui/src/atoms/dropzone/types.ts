import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Native button attributes; file delivery and drag/paste behavior are owned by the hook. */
type DropzoneNativeProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'type' | 'children' | 'onDrop' | 'onPaste' | 'onDragEnter' | 'onDragOver' | 'onDragLeave'
>;

/**
 * One file target, rendered as a native button and a hidden sibling picker. No ref or asChild API.
 * className supports outer layout only (margin, grid placement, width), merged last with cn().
 * Appearance overrides are unsupported; twMerge does not resolve arbitrary CSS selectors.
 * Consumers own validation, upload, previews and live announcements. No form file participation.
 */
export type DropzoneProps = DropzoneNativeProps & {
  /**
   * Receives a non-empty array of picked, dropped or pasted files, without accept/size validation.
   * @control false
   * @controlReason Functions and File objects are not serializable; see the Default and MultipleFiles action stories.
   */
  onFiles: (files: File[]) => void;
  /**
   * Resting visible text and native button accessible name.
   * @control text
   * @default Drag, paste or upload
   */
  label?: string;
  /**
   * Visible text and accessible name while files are dragged over the target.
   * @control text
   * @default Drop here
   */
  dropLabel?: string;
  /**
   * Native picker filter only; dropped and pasted files are never silently rejected.
   * @control text
   */
  accept?: string;
  /**
   * Accept several files; otherwise only the first file is delivered from every input path.
   * @control boolean
   * @default false
   */
  multiple?: boolean;
  /**
   * Square target by default; inline is a full-width row with a 56px minimum height.
   * @control select
   * @default default
   */
  variant?: 'default' | 'inline';
};

/** Approved #56 dashed transparent recipe, not a generic Surface or button treatment. */
export const dropzoneVariants = cva(
  'eg-dropzone flex items-center justify-center min-w-24 p-3 box-border rounded-md border border-dashed border-border-control bg-transparent bg-none [box-shadow:none] text-label-default font-sans text-fg-muted text-center cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none hover:border-border-brand hover:bg-alpha-red-07 hover:text-fg-default data-[state=over]:border-border-brand data-[state=over]:bg-alpha-red-07 data-[state=over]:text-fg-default focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'flex-col gap-1.5 min-h-24',
        inline: 'flex-row gap-2.5 min-h-14 w-full'
      }
    },
    defaultVariants: { variant: 'default' }
  }
);
