import type { FC } from 'react';
import { Dropzone } from '../../atoms/dropzone';
import { FieldMessage } from '../../atoms/field-message';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { PhotoFrame } from '../../atoms/photo-frame';
import { Cluster, Stack } from '../../primitives/stack';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { AttachmentFieldProps } from './types';
import { useAttachmentField } from './useAttachmentField';

/** Collects images by paste, drop or pick with visible validation; the consumer owns the Textarea and storage. */
export const AttachmentField: FC<AttachmentFieldProps> = (props) => {
  const { rootProps, rootRef, stripClassNames, items, status, label, children, dropzoneProps, rejectionMessages } =
    useAttachmentField(props);
  return (
    <Stack asChild={true} gap={4}>
      <div {...rootProps} ref={rootRef}>
        {children}
        {items.length > 0 && (
          <Cluster asChild={true} gap={3}>
            <ul aria-label={label} className={stripClassNames.strip}>
              {items.map(({ key, alt, url, removeLabel, removeProps }) => (
                <li key={key} className={stripClassNames.item}>
                  {url !== undefined && (
                    <PhotoFrame
                      ratio='square'
                      variant='default'
                      src={url}
                      alt={alt}
                      className={stripClassNames.thumbnail}
                    />
                  )}
                  <IconButton
                    {...removeProps}
                    variant='outline'
                    size='sm'
                    label={removeLabel}
                    icon={<Icon name='close' />}
                    className={stripClassNames.remove}
                  />
                </li>
              ))}
            </ul>
          </Cluster>
        )}
        <Dropzone variant='inline' multiple={true} {...dropzoneProps} />
        {rejectionMessages.map(({ id, text }) => (
          <FieldMessage key={id} id={id} tone='error'>
            {text}
          </FieldMessage>
        ))}
        <VisuallyHidden role='status' aria-live='polite'>
          {status.text !== '' && <span key={status.key}>{status.text}</span>}
        </VisuallyHidden>
      </div>
    </Stack>
  );
};

AttachmentField.displayName = 'AttachmentField';
