import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import type { PaginationProps } from './types';
import { type PaginationStep, usePagination } from './usePagination';

type StepContentProps = { step: PaginationStep | undefined; text: string; iconClassName: string };

// Previous shows its arrow first and Next shows it last; the arrows are decorative, so the text names the control.
const StepContent: FC<StepContentProps> = ({ step, text, iconClassName }) => (
  <>
    {step === 'previous' && <Icon name='arrow-left' size='sm' className={iconClassName} />}
    {text}
    {step === 'next' && <Icon name='arrow-right' size='sm' className={iconClassName} />}
  </>
);

/** A named navigation landmark of crawlable links to the pages of a long listing. */
export const Pagination: FC<PaginationProps> = (props) => {
  const { model } = usePagination(props);
  return model ? (
    <nav {...model.rootProps}>
      <ul {...model.listProps}>
        {model.items.map((item) => (
          <li key={item.key} {...item.itemProps}>
            {item.type === 'link' ? (
              <a {...item.linkProps}>
                <StepContent step={item.step} text={item.text} iconClassName={model.iconClassName} />
              </a>
            ) : item.type === 'placeholder' ? (
              <span {...item.placeholderProps}>
                <StepContent step={item.step} text={item.text} iconClassName={model.iconClassName} />
              </span>
            ) : (
              <span {...item.ellipsisProps}>…</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  ) : null;
};
