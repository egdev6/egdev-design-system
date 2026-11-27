import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import { Link } from '../../atoms/link';
import type { BreadcrumbProps } from './types';
import { useBreadcrumb } from './useBreadcrumb';

/** A named trail from the root to the current page: ancestor links, the current page as text, decorative separators. */
export const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { valid, rootProps, listClassName, steps } = useBreadcrumb(props);
  return valid ? (
    <nav {...rootProps}>
      <ol className={listClassName}>
        {steps.map((step) => (
          <li key={step.position} className={step.stepClassName}>
            {step.link ? <Link {...step.link}>{step.label}</Link> : <span {...step.current}>{step.label}</span>}
            {step.separatorClassName !== undefined && (
              <Icon name='chevron-down' size='sm' className={step.separatorClassName} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  ) : null;
};
