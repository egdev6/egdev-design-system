import type { FC } from 'react';
import { Icon } from '../icon';
import type { FieldMessageProps } from './types';
import { useFieldMessage } from './useFieldMessage';

/** A passive form annotation; tone alone never validates or announces. */
export const FieldMessage: FC<FieldMessageProps> = (props) => {
  const message = useFieldMessage(props);
  return message.visible ? (
    <p {...message.rootProps}>
      {message.icon ? <Icon name={message.icon} {...message.iconProps} /> : null}
      <span {...message.textProps}>{message.children}</span>
    </p>
  ) : null;
};
