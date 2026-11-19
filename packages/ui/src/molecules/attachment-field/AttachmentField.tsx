import type { FC } from 'react';
import { Dropzone } from '../../atoms/dropzone';
import { FieldMessage } from '../../atoms/field-message';
import { Stack } from '../../primitives/stack';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { AttachmentFieldProps } from './types';
import { useAttachmentField } from './useAttachmentField';

/** Collects images by paste, drop or pick with visible validation; the consumer owns the Textarea and storage. */
export const AttachmentField: FC<AttachmentFieldProps> = (props) => {
  const { rootProps, children, dropzoneProps, rejectionMessages } = useAttachmentField(props);
  return (
    <Stack asChild={true} gap={2}>
      <div {...rootProps}>
        {children}
        <Dropzone variant='inline' multiple={true} {...dropzoneProps} />
        {rejectionMessages.map(({ id, text }) => (
          <FieldMessage key={id} id={id} tone='error'>
            {text}
          </FieldMessage>
        ))}
        <VisuallyHidden role='status' aria-live='polite'>
          {null}
        </VisuallyHidden>
      </div>
    </Stack>
  );
};

AttachmentField.displayName = 'AttachmentField';
