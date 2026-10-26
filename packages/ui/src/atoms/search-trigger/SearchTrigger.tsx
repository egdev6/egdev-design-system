import { forwardRef } from 'react';
import { Icon } from '../icon';
import { Kbd } from '../kbd';
import type { SearchTriggerProps } from './types';
import { useSearchTrigger } from './useSearchTrigger';

/** Native search launcher: decorative icon, visible label and an optional passive shortcut hint. */
export const SearchTrigger = forwardRef<HTMLButtonElement, SearchTriggerProps>((props, ref) => {
  const trigger = useSearchTrigger(props);
  return (
    <button {...trigger.rootProps} ref={ref}>
      <Icon name='search' size='sm' />
      {trigger.label !== undefined && <span className={trigger.labelClassName}>{trigger.label}</span>}
      {trigger.shortcut !== undefined && (
        <span className={trigger.hintClassName} aria-hidden='true'>
          <Kbd>{trigger.shortcut}</Kbd>
        </span>
      )}
    </button>
  );
});

SearchTrigger.displayName = 'SearchTrigger';
