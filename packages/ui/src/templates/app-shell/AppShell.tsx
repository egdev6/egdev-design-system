import type { FC } from 'react';
import { Button } from '../../atoms/button';
import type { AppShellProps } from './types';
import { useAppShell } from './useAppShell';

/**
 * Responsive application region layout: it docks the supplied navigation organisms, renders the
 * view's single main landmark and owns the built-in skip link. Navigation data, routing, current
 * page and the regions' Material stay with the composed organisms and the consumer.
 */
export const AppShell: FC<AppShellProps> = (props) => {
  const s = useAppShell(props);
  return (
    <div {...s.rootProps}>
      {s.showSkipRow && (
        <div className={s.skipRowClass}>
          <Button variant='secondary' asChild={true} className={s.skipLinkClass}>
            <a href={s.skipHref} onClick={s.onSkipClick}>
              {s.skipLabel}
            </a>
          </Button>
        </div>
      )}
      <div className={s.bodyClass}>
        {s.sideNavigation != null && <div className={s.sideClass}>{s.sideNavigation}</div>}
        <main id={s.mainId} ref={s.mainRef} tabIndex={-1} className={s.mainClass}>
          {s.children}
        </main>
      </div>
      {s.bottomNavigation != null && <div className={s.bottomClass}>{s.bottomNavigation}</div>}
    </div>
  );
};
