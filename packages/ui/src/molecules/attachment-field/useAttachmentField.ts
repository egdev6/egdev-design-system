import type { ClipboardEvent, ComponentPropsWithoutRef, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type {
  AttachmentFieldMessages,
  AttachmentFieldProps,
  AttachmentRejection,
  AttachmentRejectionReason
} from './types';
import { attachmentFieldVariants } from './types';

const REASON_ORDER = ['type', 'size', 'count'] as const satisfies readonly AttachmentRejectionReason[];

/** Messages after defaults; the Dropzone labels stay undefined unless the consumer defines them. */
type ResolvedMessages = Omit<AttachmentFieldMessages, 'dropzoneLabel' | 'dropzoneDropLabel'> &
  Partial<Pick<AttachmentFieldMessages, 'dropzoneLabel' | 'dropzoneDropLabel'>>;

type AttachmentFieldResult = {
  rootProps: Omit<ComponentPropsWithoutRef<'div'>, 'children'> & { 'data-disabled'?: '' };
  children: ReactNode;
  label: string;
  messages: ResolvedMessages;
  dropzoneProps: {
    accept: string;
    disabled: boolean;
    label?: string;
    dropLabel?: string;
    'aria-describedby'?: string;
    onFiles: (files: File[]) => void;
  };
  rejectionMessages: { id: string; text: string }[];
};

/** Upper-cased MIME subtype without a `+xml` suffix (`image/svg+xml` becomes `SVG`). */
const typeLabelOf = (type: string) => (type.split('/')[1] ?? type).replace(/\+xml$/i, '').toUpperCase();

const formatSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kilobytes = Math.round(bytes / 1024);
  return kilobytes < 1024 ? `${kilobytes} KB` : `${Number((bytes / (1024 * 1024)).toFixed(1))} MB`;
};

const nameOf = (file: File | undefined) => file?.name || 'Image';

const subject = (files: File[]) => (files.length === 1 ? nameOf(files[0]) : `${files.length} files`);

const verb = (files: File[]) => (files.length === 1 ? 'was' : 'were');

/** Builds the English defaults; the rejection texts use the already resolved size formatter. */
const defaultMessages = (size: (bytes: number) => string): ResolvedMessages => ({
  itemLabel: ({ position, typeLabel, sizeLabel }) => `Attachment ${position}, ${typeLabel}, ${sizeLabel}`,
  removeItem: (itemLabel) => `Remove ${itemLabel}`,
  added: (count) => (count === 1 ? 'Attachment added' : `${count} attachments added`),
  removed: (itemLabel) => `${itemLabel} removed`,
  rejectedType: (files, acceptedTypes) => {
    const types = acceptedTypes.map((type) => (type.endsWith('/*') ? type.slice(0, -2) : typeLabelOf(type)));
    return `${subject(files)} ${verb(files)} not added: only ${types.join(', ')} files are allowed.`;
  },
  rejectedSize: (files, maxFileBytes) =>
    files.length === 1
      ? `${nameOf(files[0])} was not added: it is larger than ${size(maxFileBytes)}.`
      : `${files.length} files were not added: each must be ${size(maxFileBytes)} or smaller.`,
  rejectedCount: (files, maxFiles) =>
    `${subject(files)} ${verb(files)} not added: at most ${maxFiles} attachments are allowed.`,
  formatSize: size
});

const typeMatcher = (acceptedTypes: readonly string[] | undefined) => {
  const entries = (acceptedTypes ?? []).map((type) => type.toLowerCase()).filter((type) => type.startsWith('image/'));
  const allowed = entries.length > 0 ? entries : ['image/*'];
  return {
    allowed,
    matches: (file: File) => {
      const type = file.type.toLowerCase();
      return (
        type !== '' &&
        allowed.some((entry) => (entry.endsWith('/*') ? type.startsWith(entry.slice(0, -1)) : type === entry))
      );
    }
  };
};

/** Owns the list, the intake pipeline (type, size, count), paste scope and rejection messages. */
export function useAttachmentField({
  label,
  value,
  defaultValue,
  onValueChange,
  acceptedTypes,
  maxFileBytes,
  maxFiles,
  onFilesRejected,
  messages,
  disabled = false,
  children,
  className,
  ...rest
}: AttachmentFieldProps): AttachmentFieldResult {
  const baseId = useId();
  const [internal, setInternal] = useState<File[]>(() => defaultValue ?? []);
  const [rejections, setRejections] = useState<AttachmentRejection[]>([]);
  const files = value ?? internal;
  const latestFiles = useRef(files);
  latestFiles.current = files;

  const resolvedSize = messages?.formatSize ?? formatSize;
  const defaults = defaultMessages(resolvedSize);
  const resolved: ResolvedMessages = { ...defaults, ...messages, formatSize: resolvedSize };
  const { allowed, matches } = typeMatcher(acceptedTypes);
  const bytesLimit =
    typeof maxFileBytes === 'number' && Number.isFinite(maxFileBytes) && maxFileBytes > 0 ? maxFileBytes : undefined;
  const countLimit = typeof maxFiles === 'number' && Number.isInteger(maxFiles) && maxFiles >= 1 ? maxFiles : undefined;

  const commit = (next: File[]) => {
    if (value === undefined) {
      latestFiles.current = next;
      setInternal(next);
    }
    onValueChange?.(next);
  };

  /** Runs one intake and returns how many files were added. */
  const intake = (selected: File[]) => {
    if (disabled || selected.length === 0) {
      return 0;
    }
    const current = latestFiles.current;
    const accepted: File[] = [];
    const rejected: AttachmentRejection[] = [];
    for (const file of selected) {
      let reason: AttachmentRejectionReason | undefined;
      if (!matches(file)) {
        reason = 'type';
      } else if (bytesLimit !== undefined && file.size > bytesLimit) {
        reason = 'size';
      } else if (countLimit !== undefined && countLimit - current.length - accepted.length <= 0) {
        reason = 'count';
      }
      if (reason) {
        rejected.push({ file, reason });
      } else {
        accepted.push(file);
      }
    }
    setRejections(rejected);
    if (accepted.length > 0) {
      commit([...current, ...accepted]);
    }
    if (rejected.length > 0) {
      onFilesRejected?.(rejected);
    }
    return accepted.length;
  };

  const rejectionMessages = REASON_ORDER.flatMap((reason) => {
    const group = rejections.filter((item) => item.reason === reason).map((item) => item.file);
    if (group.length === 0) {
      return [];
    }
    const text =
      reason === 'type'
        ? resolved.rejectedType(group, allowed)
        : reason === 'size'
          ? resolved.rejectedSize(group, bytesLimit ?? 0)
          : resolved.rejectedCount(group, countLimit ?? 0);
    return [{ id: `${baseId}-${reason}`, text }];
  });

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (disabled || event.defaultPrevented) {
      return;
    }
    const pasted = Array.from(event.clipboardData?.files ?? []);
    if (pasted.length === 0) {
      return;
    }
    if (intake(pasted) > 0) {
      event.preventDefault();
    }
  };

  return {
    rootProps: {
      ...rest,
      className: cn(attachmentFieldVariants(), className),
      onPaste,
      'data-disabled': disabled ? '' : undefined
    },
    children,
    label,
    messages: resolved,
    dropzoneProps: {
      accept: acceptedTypes && acceptedTypes.length > 0 ? acceptedTypes.join(',') : 'image/*',
      disabled,
      label: messages?.dropzoneLabel,
      dropLabel: messages?.dropzoneDropLabel,
      'aria-describedby': rejectionMessages.length > 0 ? rejectionMessages.map((item) => item.id).join(' ') : undefined,
      onFiles: (selected) => {
        intake(selected);
      }
    },
    rejectionMessages
  };
}
