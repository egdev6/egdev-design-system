import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** The rule a rejected file broke; the first failing rule wins: type, then size, then count. */
export type AttachmentRejectionReason = 'type' | 'size' | 'count';

/** One file the field refused to attach, with the rule it broke. */
export type AttachmentRejection = { file: File; reason: AttachmentRejectionReason };

/** Facts about one attachment passed to the item label formatter. `position` is 1-based. */
export type AttachmentItemInfo = { file: File; position: number; typeLabel: string; sizeLabel: string };

/** Localizable built-in text and formatters; omitted entries use the documented English defaults. */
export type AttachmentFieldMessages = {
  /** Accessible name of one attachment. Default: `Attachment ${position}, ${typeLabel}, ${sizeLabel}`. */
  itemLabel: (item: AttachmentItemInfo) => string;
  /** Accessible name of one Remove button. Default: `Remove ${itemLabel}`. */
  removeItem: (itemLabel: string) => string;
  /** Announcement after an intake adds files. Default: `Attachment added` or `${count} attachments added`. */
  added: (count: number) => string;
  /** Announcement after a removal. Default: `${itemLabel} removed`. */
  removed: (itemLabel: string) => string;
  /** Visible error for files whose type is not allowed. */
  rejectedType: (files: File[], acceptedTypes: readonly string[]) => string;
  /** Visible error for files larger than `maxFileBytes`. */
  rejectedSize: (files: File[], maxFileBytes: number) => string;
  /** Visible error for files beyond `maxFiles`. */
  rejectedCount: (files: File[], maxFiles: number) => string;
  /** Formats a byte size, 1024-based. Default: `B`, `KB` or `MB` (for example `240 KB`). */
  formatSize: (bytes: number) => string;
  /** Dropzone resting label. Omitted: the Dropzone default `Drag, paste or upload`. */
  dropzoneLabel: string;
  /** Dropzone label while dragging over. Omitted: the Dropzone default `Drop here`. */
  dropzoneDropLabel: string;
};

/** Native div attributes; paste handling is owned by the hook, and children are retyped. */
type AttachmentFieldNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'onPaste' | 'defaultValue' | 'children' | 'onChange'
>;

type AttachmentFieldOwnProps = {
  /**
   * Accessible name of the attachment list (for example "Attachments"). The list is rendered only when there is at least one item.
   * @control text
   */
  label: string;
  /**
   * Allowed MIME types, exact (`image/png`) or subtype wildcard (`image/*`), case-insensitive.
   * A file with an empty type is rejected. Also drives the Dropzone picker filter. Omitted or empty means any `image/*`.
   * @control false
   * @controlReason A readonly array of MIME types is not a scalar control; see the Validation story.
   */
  acceptedTypes?: readonly `image/${string}`[];
  /**
   * Largest allowed file size in bytes; a file of exactly this size is accepted.
   * A non-finite or non-positive value is ignored. Omitted means no limit.
   * @control number
   */
  maxFileBytes?: number;
  /**
   * Largest number of attachments, counting the current list.
   * A non-integer, non-finite or value below 1 is ignored. Omitted means no limit.
   * @control number
   */
  maxFiles?: number;
  /**
   * Called once per intake that rejects at least one file, after `onValueChange`.
   * @control false
   * @controlReason Functions and File objects are not serializable; see the Validation action story.
   */
  onFilesRejected?: (rejections: AttachmentRejection[]) => void;
  /**
   * Localizable built-in text and formatters; omitted entries use the English defaults.
   * @control false
   * @controlReason A dictionary of formatter functions is not serializable; see the Validation story.
   */
  messages?: Partial<AttachmentFieldMessages>;
  /**
   * Disables the Dropzone and the Remove buttons and ignores paste. The list stays visible.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * The consumer's control or controls, usually a Field wrapping a Textarea; paste from any descendant is handled.
   * @control false
   * @controlReason ReactNode content is not serializable; see the WithTextarea story.
   */
  children?: ReactNode;
};

type AttachmentFieldControlledProps = {
  /**
   * Controlled attachments; requires `onValueChange`. The list changes only when the parent passes a new value.
   * @control false
   * @controlReason File objects are not serializable; see the Controlled story.
   */
  value: File[];
  /**
   * Called with the next full list after a user add or remove; in controlled mode it is a request.
   * @control false
   * @controlReason Functions and File objects are not serializable; see the Controlled action story.
   */
  onValueChange: (files: File[]) => void;
  /**
   * Never combined with `value`.
   * @control false
   * @controlReason Not available while controlled.
   */
  defaultValue?: never;
};

type AttachmentFieldUncontrolledProps = {
  /**
   * Omit to leave the list uncontrolled.
   * @control false
   * @controlReason Not available while uncontrolled.
   */
  value?: undefined;
  /**
   * Initial attachments when uncontrolled, read once. Never combined with `value`.
   * @control false
   * @controlReason File objects are not serializable; see the Uncontrolled story.
   */
  defaultValue?: File[];
  /**
   * Called with the next full list after a user add or remove.
   * @control false
   * @controlReason Functions and File objects are not serializable; see the Uncontrolled action story.
   */
  onValueChange?: (files: File[]) => void;
};

/**
 * Image attachments gathered by paste, drop or pick, with type, size and count validation.
 * Controlled when `value` is defined, otherwise uncontrolled. No ref or asChild API.
 * className supports outer layout only (grid placement, margin, width), merged last with cn().
 * Appearance overrides are unsupported; twMerge does not resolve arbitrary CSS selectors.
 * Consumers own the Textarea and its label, upload, storage and deduplication.
 */
export type AttachmentFieldProps = AttachmentFieldNativeProps &
  AttachmentFieldOwnProps &
  (AttachmentFieldControlledProps | AttachmentFieldUncontrolledProps);

/** Root layout only; every other part is composed from existing atoms and adds no paint. */
const attachmentFieldVariants = cva('eg-attachment-field min-w-0');

export { attachmentFieldVariants };
